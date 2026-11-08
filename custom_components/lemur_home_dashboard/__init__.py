"""Lemur Home Dashboard.

Serves the panel's JavaScript (dashboard strategy, panel card and admin panel),
loads it on every page and keeps the household panel layout in Home Assistant
storage so every tablet and phone shows the same panel.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any

import voluptuous as vol

from homeassistant.components import panel_custom, websocket_api
from homeassistant.components.frontend import add_extra_js_url, async_remove_panel
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util
from datetime import timedelta

from . import energy_import as EI
from . import estimates as EST
from . import learn as LRN
from . import pool as POOL
from . import pets as P
from . import safety as SF
from . import twins as TW

from .const import (
    DOMAIN,
    JS_FILE,
    LOADER_FILE,
    MAX_CONFIG_BYTES,
    PANEL_ELEMENT,
    PANEL_URL,
    SIGNAL_EST,
    SIGNAL_PETS,
    SIGNAL_TICK,
    SIGNAL_UPDATE,
    STORAGE_KEY,
    STORAGE_VERSION,
    URL_BASE,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

# Empty config means "build the default layout from the home's areas" (done in the browser, src/defaults.js).
# pets / feed: feeding reminders (pets.py); older stored data simply has none
# twins / walls: backup control and wall switches (twins.py)
# estimates / ecats: energy devices (measured and virtual) and categories (estimates.py, sensor.py)
# energy_solar_src: the solar statistic the dashboard put into the energy settings; learn_avg: long averages running (learn.py)
DEFAULT_DATA: dict[str, Any] = {"version": 1, "settings": {}, "tabs": [], "profiles": {}, "pets": {}, "feed": {}, "twins": {}, "walls": [], "estimates": {}, "ecats": [], "energy_solar_src": "", "energy_grid_src": "", "learn_avg": {}}
PLATFORMS = ["sensor", "button"]


class PanelData:
    """Shared, persisted panel layout."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = json.loads(json.dumps(DEFAULT_DATA))
        self._feeder_at: dict[str, Any] = {}   # pet id → last time the feeder service ran (in memory)
        self.twins = TW.Twins(hass, lambda: self.data, self._fallback_used)
        self.learning = LRN.Learning(hass, None, self._save_learn)   # Enerji → Öğren (light runs and long averages go on after a restart)
        self._prefs_unsub = None

    @callback
    def _fallback_used(self, eid: str, when: str) -> None:
        """A light was controlled through its backup twin: tell the screens (not saved)."""
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, {"__fb": {eid: when}})

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if isinstance(stored, dict):
            for key, default in DEFAULT_DATA.items():
                val = stored.get(key)
                if isinstance(val, type(default)):
                    self.data[key] = val
        # v0.28.5: the former browser-only energy values became real sensors; panels and records follow
        tabs = self.data.get("tabs")
        if tabs:
            new = EST.migrate_ids(tabs)
            if new != tabs:
                self.data["tabs"] = new
                self.store.async_delay_save(lambda: self.data, 1.0)
        est = self.data.get("estimates")
        if isinstance(est, dict) and any(EST.is_virtual(v) for v in est.values()):
            self.data["estimates"] = {k: v for k, v in est.items() if not EST.is_virtual(v)}
            self.store.async_delay_save(lambda: self.data, 1.0)
        self.learning = LRN.Learning(self.hass, self.data.get("learn_avg"), self._save_learn)
        self.learning.resume_saved()   # yeniden başlatmayla kesilen ışık ölçümü kaldığı yerden sürer

    def _save_learn(self, runs: dict) -> None:
        if runs != self.data.get("learn_avg"):
            self.data["learn_avg"] = runs
            self.store.async_delay_save(lambda: self.data, 1.0)

    @callback
    def changed(self) -> None:
        self.store.async_delay_save(lambda: self.data, 1.0)
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, self.data)

    # ---- feeding reminders ----
    def pets(self) -> dict:
        """Only well-formed pets (a broken stored record must not stop the minute tick)."""
        pets = self.data.get("pets")
        if not isinstance(pets, dict):
            return {}
        return {pid: pet for pid, pet in pets.items() if isinstance(pid, str) and isinstance(pet, dict)}

    def ecats(self) -> list:
        c = self.data.get("ecats")
        return [x for x in c if isinstance(x, dict) and isinstance(x.get("id"), str)] if isinstance(c, list) else []

    # ---- Home Assistant energy settings: kept in step with the dashboard's devices and categories ----
    @callback
    def schedule_prefs(self) -> None:
        """Debounced: several quick saves (category, then its devices) end in one update."""
        if self._prefs_unsub:
            self._prefs_unsub()
        from homeassistant.helpers.event import async_call_later

        async def _run(_now) -> None:
            self._prefs_unsub = None
            await self.async_sync_prefs()

        self._prefs_unsub = async_call_later(self.hass, 2, _run)

    async def async_sync_prefs(self, drop: set | None = None) -> bool:
        """Write the dashboard's categories, devices and solar source into the energy settings.
        drop: other statistics to take out (entries replaced by an import). Off when settings.energy.sync is false."""
        st = self.data.get("settings") or {}
        en = st.get("energy") if isinstance(st.get("energy"), dict) else {}
        if en.get("sync") is False:
            return False
        try:
            from homeassistant.components.energy.data import async_get_manager
            mgr = await async_get_manager(self.hass)
            prefs = dict(mgr.data or {})
            owned = self.data.get("energy_solar_src")
            ours = owned or any(str(x.get("stat_consumption", "")).startswith("sensor.lhd_") for x in prefs.get("device_consumption") or [] if isinstance(x, dict)) \
                or any(str(x.get("stat_energy_from", "")).startswith("sensor.lhd_") for x in prefs.get("energy_sources") or [] if isinstance(x, dict))
            ours = ours or bool(self.data.get("energy_grid_src"))
            if not (self.estimates() or self.ecats() or EST.solar_energy_entity(st) or EST.meter_cfg(st).get("energy") or drop or ours):
                return False
            if drop:
                prefs["device_consumption"] = [d for d in prefs.get("device_consumption") or [] if d.get("stat_consumption") not in drop]
            owned_grid = self.data.get("energy_grid_src") or None
            had = {f.get("stat_energy_from") for x in prefs.get("energy_sources") or [] if isinstance(x, dict) and x.get("type") == "grid" for f in x.get("flow_from") or []}
            new = EST.build_prefs(prefs, self.estimates(), self.ecats(), st, owned, owned_grid)
            # şebeke kaynağına bizim yazdığımız sayaç (önceden kullanıcının kendi yazdığı değilse)
            mw = EST.meter_written(new, st)
            grid_src = mw if mw and (mw not in had or mw == owned_grid) else ("" if not mw else (owned_grid or ""))
            if (self.data.get("energy_grid_src") or "") != grid_src:
                self.data["energy_grid_src"] = grid_src
                self.store.async_delay_save(lambda: self.data, 1)
            sol = EST.solar_energy_entity(st)
            if (self.data.get("energy_solar_src") or None) != sol:   # which solar statistic is the dashboard's (taken out when it changes)
                self.data["energy_solar_src"] = sol or ""
                self.store.async_delay_save(lambda: self.data, 1)
            if new["device_consumption"] == (mgr.data or {}).get("device_consumption") and new["energy_sources"] == (mgr.data or {}).get("energy_sources"):
                return True
            await mgr.async_update(new)
            return True
        except Exception as err:  # noqa: BLE001 - the energy integration may be missing; the dashboard works without it
            _LOGGER.warning("Energy settings could not be updated: %s", err)
            return False

    def estimates(self) -> dict:
        est = self.data.get("estimates")
        if not isinstance(est, dict):
            return {}
        return {k: v for k, v in est.items() if isinstance(k, str) and isinstance(v, dict) and not EST.is_virtual(v)}

    def rec(self, pid: str) -> dict:
        feed = self.data.get("feed")
        rec = feed.get(pid) if isinstance(feed, dict) else None
        return rec if isinstance(rec, dict) else {}

    def status(self, pid: str) -> str:
        return P.status(self.pets().get(pid) or {}, self.rec(pid), dt_util.now())

    @callback
    def set_rec(self, pid: str, rec: dict) -> None:
        feed = dict(self.data.get("feed") if isinstance(self.data.get("feed"), dict) else {})
        feed[pid] = rec
        self.data["feed"] = feed

    @callback
    def refresh_all(self) -> None:
        """After the pets changed: recompute the next feeding of every pet."""
        now = dt_util.now()
        for pid, pet in self.pets().items():
            try:
                self.set_rec(pid, P.refresh(pet, self.rec(pid), now))
            except Exception as err:  # noqa: BLE001 - one broken pet must not stop the others
                _LOGGER.warning("Pet %s could not be refreshed: %s", pid, err)

    def find(self, key: str) -> str | None:
        key = str(key or "").strip()
        if key in self.pets():
            return key
        low = key.lower()
        for pid, pet in self.pets().items():
            if str(pet.get("name") or "").strip().lower() == low:
                return pid
        return None

    @callback
    def changed_feed(self, pid: str) -> None:
        """Only one feeding record changed: save, and send just that record to the screens."""
        self.store.async_delay_save(lambda: self.data, 1.0)
        async_dispatcher_send(self.hass, SIGNAL_UPDATE, {"__feed": {pid: self.rec(pid)}})

    async def async_feed(self, pid: str, by: str = "", take_back: bool = False) -> bool:
        """Record a feeding (or take the last one back). False: unknown pet, or fed less than a minute ago."""
        pet = self.pets().get(pid)
        if pet is None:
            return False
        now = dt_util.now()
        if not take_back:
            last = P.parse(self.rec(pid).get("last"))
            if last is not None and timedelta(0) <= now - last < timedelta(seconds=SF.FEED_MIN_SECONDS):
                return False   # a second tap / call within a minute: already fed
        self.set_rec(pid, P.undo(pet, self.rec(pid), now) if take_back else P.fed(pet, self.rec(pid), now, by))
        self.changed_feed(pid)
        async_dispatcher_send(self.hass, SIGNAL_TICK)
        if not take_back:
            await self._run_feeder(pid, pet, now)
        return True

    async def _run_feeder(self, pid: str, pet: dict, now) -> None:
        feeder = pet.get("feeder")
        if not isinstance(feeder, dict) or not feeder.get("service"):
            return
        service = feeder.get("service")
        if not SF.safe_feeder_service(service):
            _LOGGER.warning("Feeder %s of %s is not allowed (domains: %s)", service, pid, ", ".join(SF.FEEDER_DOMAINS))
            return
        prev = self._feeder_at.get(pid)
        if prev is not None and now - prev < timedelta(seconds=SF.FEED_MIN_SECONDS):
            return   # fed, taken back and fed again: the feeder does not drop food twice
        self._feeder_at[pid] = now
        dom, svc = service.split(".", 1)
        try:
            sdata = dict(feeder.get("data") or {})
        except (TypeError, ValueError):
            sdata = {}
        if feeder.get("target"):
            sdata["entity_id"] = feeder["target"]
        try:
            await self.hass.services.async_call(dom, svc, sdata, blocking=False)
        except Exception as err:  # noqa: BLE001 - a broken feeder must not break the feeding record
            _LOGGER.warning("Feeder %s failed: %s", service, err)

    async def async_tick(self, _now=None) -> None:
        """Every minute: statuses for the entities, a notification when a pet becomes late."""
        now = dt_util.now()
        dirty = False
        tr = (self.hass.config.language or "").lower().startswith("tr")
        for pid, pet in self.pets().items():
            try:
                dirty = await self._tick_pet(pid, pet, now, tr) or dirty
            except Exception as err:  # noqa: BLE001 - one broken pet must not stop the others
                _LOGGER.warning("Pet %s: %s", pid, err)
        if dirty:
            self.changed()
        async_dispatcher_send(self.hass, SIGNAL_TICK)

    async def _tick_pet(self, pid: str, pet: dict, now, tr: bool) -> bool:
        dirty = False
        rec = self.rec(pid)
        due0 = P.parse(rec.get("due"))
        if not rec.get("last") and pet.get("mode") == "times" and (due0 is None or due0 <= now):   # hiç beslenmedi: sıradaki saati göster
            rec = P.refresh(pet, rec, now)
            if rec.get("due"):
                self.set_rec(pid, rec)
                dirty = True
        st = P.status(pet, rec, now)
        notify = str(pet.get("notify") or "")
        if st == "late" and SF.NOTIFY_RE.match(notify) and rec.get("due") and rec.get("notified") != rec.get("due"):
            rec = dict(rec)
            rec["notified"] = rec.get("due")
            self.set_rec(pid, rec)
            dirty = True
            name = pet.get("name") or pid
            msg = f"{name} beslenmeyi bekliyor." if tr else f"{name} is waiting to be fed."
            try:
                await self.hass.services.async_call("notify", notify.split(".", 1)[1], {"title": "Besleme" if tr else "Feeding", "message": msg}, blocking=False)
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Feeding notification %s failed: %s", notify, err)
        return dirty


async def _register_static(hass: HomeAssistant) -> None:
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    try:
        from homeassistant.components.http import StaticPathConfig  # 2024.6+

        await hass.http.async_register_static_paths([StaticPathConfig(URL_BASE, frontend_dir, True)])
    except ImportError:  # older cores
        hass.http.register_static_path(URL_BASE, frontend_dir, False)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = PanelData(hass)
    await data.async_load()
    hass.data[DOMAIN] = data

    if not hass.data.get(f"{DOMAIN}_static"):
        await _register_static(hass)
        # Every page loads the small loader. It defines the strategy element at once and loads the main file
        # (strategy, card, scaling) in the background. The main file is large; on slow tablets and in the HA
        # Android app HA's strategy wait ran out before it was ready (GitHub #3). Registered for both frontend
        # builds, so browsers that get HA's legacy build load it too.
        add_extra_js_url(hass, f"{URL_BASE}/{LOADER_FILE}?v={VERSION}")
        add_extra_js_url(hass, f"{URL_BASE}/{LOADER_FILE}?v={VERSION}", es5=True)
        for handler in (ws_get, ws_set, ws_season, ws_subscribe, ws_info, ws_feed, ws_dashboard_claim, ws_energy_import, ws_learn_start, ws_learn_status, ws_learn_ctl, ws_pool_lookup):
            websocket_api.async_register_command(hass, handler)
        hass.data[f"{DOMAIN}_static"] = True

    async def _svc_feed(call) -> None:
        d = _data(hass)
        pid = d.find(call.data["pet"]) if d else None
        if pid is None:
            raise vol.Invalid(f"Unknown pet: {call.data['pet']}")
        if not await d.async_feed(pid, "service", bool(call.data.get("undo"))):
            _LOGGER.info("Pet %s was fed less than a minute ago; feeding not repeated", pid)

    hass.services.async_register(DOMAIN, "feed", _svc_feed, schema=vol.Schema({vol.Required("pet"): str, vol.Optional("undo", default=False): bool}))

    async def _svc_control(call) -> None:
        d = _data(hass)
        if d is None:
            return
        extra = {k: call.data[k] for k in ("brightness_pct", "color_temp_kelvin") if k in call.data}
        for eid in call.data["entity_id"]:
            await d.twins.control(eid, call.data["action"], extra, call.context)

    hass.services.async_register(DOMAIN, "control", _svc_control, schema=vol.Schema({
        vol.Required("entity_id"): vol.All(vol.Any(str, [str]), lambda v: [v] if isinstance(v, str) else v),
        vol.Optional("action", default="toggle"): vol.In(["toggle", "turn_on", "turn_off"]),
        vol.Optional("brightness_pct"): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
        vol.Optional("color_temp_kelvin"): vol.All(vol.Coerce(int), vol.Range(min=1500, max=9000)),
    }))
    data.twins.listen()
    entry.async_on_unload(async_track_time_interval(hass, data.async_tick, timedelta(minutes=1)))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    if PANEL_URL not in hass.data.get("frontend_panels", {}):
        turkish = (hass.config.language or "").lower().startswith("tr")
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL,
            webcomponent_name=PANEL_ELEMENT,
            sidebar_title="Lemur Home Dashboard",
            sidebar_icon="mdi:tablet-dashboard",
            module_url=f"{URL_BASE}/{JS_FILE}?v={VERSION}",
            require_admin=True,
            config={"turkish": turkish},
        )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    hass.services.async_remove(DOMAIN, "feed")
    hass.services.async_remove(DOMAIN, "control")
    d = _data(hass)
    if d is not None:
        d.twins.stop()
        await d.learning.async_stop()
        if d._prefs_unsub:
            d._prefs_unsub()
            d._prefs_unsub = None
        await d.store.async_save(d.data)   # a change saved less than a second ago is not lost on reload
    hass.data.pop(DOMAIN, None)
    async_remove_panel(hass, PANEL_URL)
    return True


def _data(hass: HomeAssistant) -> PanelData | None:
    return hass.data.get(DOMAIN)


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/get"})
@callback
def ws_get(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    out = _for_user(connection, data.data)
    out = dict(out, fallback=dict(data.twins.fallback))   # last backup use per light (in memory)
    connection.send_result(msg["id"], out)


def _for_user(connection, payload: dict) -> dict:
    """Non-admin users (the wall tablet) do not see the pets' feeder service and notification target."""
    user = connection.user
    if user is not None and user.is_admin:
        return payload
    return SF.public_data(payload)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/set",
        vol.Required("key"): vol.In(["settings", "tabs", "profiles", "pets", "twins", "walls", "estimates", "ecats"]),
        vol.Required("value"): vol.Any(list, dict),
    }
)
@callback
def ws_set(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    if not connection.user.is_admin:
        connection.send_error(msg["id"], "unauthorized", "Only administrators can change the panel")
        return
    key, value = msg["key"], msg["value"]
    if not isinstance(value, type(DEFAULT_DATA[key])) or len(json.dumps(value)) > MAX_CONFIG_BYTES:
        connection.send_error(msg["id"], "invalid", f"{key}: wrong type or too large")
        return
    if key == "pets":
        try:
            value = SF.PETS_SCHEMA(value)
        except vol.Invalid as err:
            connection.send_error(msg["id"], "invalid", f"pets: {err}")
            return
    elif key in ("estimates", "ecats"):
        try:
            value = (EST.ESTIMATES_SCHEMA if key == "estimates" else EST.ECATS_SCHEMA)(value)
        except vol.Invalid as err:
            connection.send_error(msg["id"], "invalid", f"{key}: {err}")
            return
    elif key == "tabs":
        value = EST.migrate_ids(SF.clean_tabs(value))
    elif key in ("twins", "walls"):
        try:
            value = (TW.TWINS_SCHEMA if key == "twins" else TW.WALLS_SCHEMA)(value)
        except vol.Invalid as err:
            connection.send_error(msg["id"], "invalid", f"{key}: {err}")
            return
    # solar production or the sync switch changed: sensors and energy settings follow
    def _en(st: dict) -> tuple:
        e = st.get("energy") if isinstance(st, dict) and isinstance(st.get("energy"), dict) else {}
        return (json.dumps(e.get("solar"), sort_keys=True), e.get("sync"))
    energy_changed = key == "settings" and _en(data.data.get("settings") or {}) != _en(value)
    data.data[key] = value
    if key == "walls":
        data.twins.listen()
    if key == "pets":
        data.refresh_all()
        async_dispatcher_send(hass, SIGNAL_PETS)
    if key in ("estimates", "ecats") or (key == "settings" and energy_changed):
        async_dispatcher_send(hass, SIGNAL_EST)
        data.schedule_prefs()
    data.changed()
    connection.send_result(msg["id"], data.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/feed",
        vol.Required("pet"): str,
        vol.Optional("undo", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_feed(hass, connection, msg):
    """Fed it, from the feeding card. Any signed-in user (the wall tablet is usually not admin)."""
    data = _data(hass)
    if data is None or msg["pet"] not in data.pets():
        connection.send_error(msg["id"], "not_found", "Unknown pet")
        return
    user = connection.user
    if not await data.async_feed(msg["pet"], (user.name if user else "") or "", msg["undo"]):
        connection.send_error(msg["id"], "too_soon", "Fed less than a minute ago")
        return
    connection.send_result(msg["id"], data.rec(msg["pet"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/season",
        vol.Required("season"): vol.In(["summer", "winter"]),
    }
)
@callback
def ws_season(hass, connection, msg):
    """Summer/winter switch on the climate section. Any signed-in user may flip it (wall tablets are often not admin)."""
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    settings = dict(data.data.get("settings") or {})
    settings["season"] = msg["season"]
    data.data["settings"] = settings
    data.changed()
    connection.send_result(msg["id"], {"season": msg["season"]})


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/subscribe"})
@callback
def ws_subscribe(hass, connection, msg):
    @callback
    def _forward(payload):
        connection.send_message(websocket_api.event_message(msg["id"], payload if ("__feed" in payload or "__fb" in payload) else _for_user(connection, payload)))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATE, _forward)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/info"})
@callback
def ws_info(hass, connection, msg):
    """Version of the integration, so an outdated script in a browser cache can ask for a reload.
    For admins it also says whether the dashboard should still be created (src/autodash.js)."""
    res = {"version": VERSION}
    entry = _entry(hass)
    if entry is not None and connection.user and connection.user.is_admin and entry.data.get("create_dashboard") and not entry.data.get("dashboard_done"):
        res["setup_dashboard"] = {"title": entry.data.get("dashboard_title") or "Lemur Home Dashboard"}
    connection.send_result(msg["id"], res)


def _entry(hass: HomeAssistant) -> ConfigEntry | None:
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0] if entries else None


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/dashboard_claim"})
@websocket_api.require_admin
@callback
def ws_dashboard_claim(hass, connection, msg):
    """One browser gets to create the dashboard: the first claim returns true and marks it done,
    so two open tabs do not create it twice."""
    entry = _entry(hass)
    ok = bool(entry is not None and entry.data.get("create_dashboard") and not entry.data.get("dashboard_done"))
    if ok:
        hass.config_entries.async_update_entry(entry, data={**entry.data, "dashboard_done": True})
    connection.send_result(msg["id"], {"ok": ok, "title": (entry.data.get("dashboard_title") if entry else None) or "Lemur Home Dashboard"})


async def _energy_prefs(hass: HomeAssistant) -> dict:
    try:
        from homeassistant.components.energy.data import async_get_manager
        return dict((await async_get_manager(hass)).data or {})
    except Exception:  # noqa: BLE001
        return {}


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/energy_import",
        vol.Optional("apply", default=False): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_energy_import(hass, connection, msg):
    """Enerji → Aktar: what an import from the other power-estimating integration would do (apply=false),
    or do it: devices and categories are added (existing ones are kept), the old entries leave the energy settings."""
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    prefs = await _energy_prefs(hass)
    try:
        profs = await hass.async_add_executor_job(EI.load_profiles, hass, hass.config_entries.async_entries(EI.SOURCE))
        p = EI.plan(hass, prefs, data.estimates(), data.ecats(), profs)
    except Exception as err:  # noqa: BLE001 - an unexpected entry shape must not break the panel
        _LOGGER.warning("Energy import could not read the entries: %s", err)
        connection.send_error(msg["id"], "failed", str(err))
        return
    recs, cats = p.pop("_records"), p.pop("_cats")
    if not msg["apply"]:
        connection.send_result(msg["id"], p)
        return
    try:
        ests = EST.ESTIMATES_SCHEMA({**data.estimates(), **recs})
        ecats = EST.ECATS_SCHEMA(data.ecats() + [c for c in cats if c["id"] not in {x["id"] for x in data.ecats()}])
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    data.data["estimates"] = ests
    data.data["ecats"] = ecats
    data.changed()
    async_dispatcher_send(hass, SIGNAL_EST)
    synced = await data.async_sync_prefs(set(p["drop"]))
    connection.send_result(msg["id"], dict(p, applied=True, synced=synced))


# ---- Enerji → Öğren: measure a device with a plug (learn.py) and the shared pool (pool.py) ----
@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/learn_start",
        vol.Required("device"): vol.All(str, vol.Match(r"^[a-z0-9_]{1,40}$")),   # not "id": that is the message's own number
        vol.Required("kind"): vol.In(["light", "states", "avg"]),
        vol.Optional("entity", default=""): vol.Any("", vol.All(str, vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"))),
        vol.Required("plug"): vol.All(str, vol.Match(r"^sensor\.[a-z0-9_]+$")),
        vol.Optional("interval", default=2.0): vol.All(vol.Coerce(float), vol.Range(min=0.2, max=120)),
    }
)
@websocket_api.require_admin
@callback
def ws_learn_start(hass, connection, msg):
    d = _data(hass)
    if d is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    try:
        r = d.learning.start(msg["device"], msg["kind"], msg["entity"], msg["plug"], msg["interval"])
    except ValueError as err:
        connection.send_error(msg["id"], str(err), str(err))
        return
    connection.send_result(msg["id"], r.status())


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/learn_status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_learn_status(hass, connection, msg):
    d = _data(hass)
    connection.send_result(msg["id"], (await d.learning.async_status()) if d else {})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/learn_ctl",
        vol.Required("device"): str,
        vol.Required("action"): vol.In(["pause", "resume", "cancel", "stop", "clear", "skipfx", "continue"]),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_learn_ctl(hass, connection, msg):
    d = _data(hass)
    try:
        if d is None:
            raise ValueError("not_loaded")
        await d.learning.control(msg["device"], msg["action"])
    except ValueError as err:
        connection.send_error(msg["id"], str(err), str(err))
        return
    connection.send_result(msg["id"], await d.learning.async_status())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/pool_lookup",
        vol.Required("manufacturer"): vol.All(str, vol.Length(max=100)),
        vol.Required("model"): vol.All(str, vol.Length(max=100)),
        vol.Optional("model_id", default=""): vol.All(str, vol.Length(max=100)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_pool_lookup(hass, connection, msg):
    try:
        r = await POOL.lookup(hass, msg["manufacturer"], msg["model"], msg["model_id"])
    except Exception as err:  # noqa: BLE001 - the page shows "not found"
        _LOGGER.debug("Pool lookup failed: %s", err)
        r = None
    connection.send_result(msg["id"], r)
