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

from . import pets as P
from . import safety as SF
from . import twins as TW

from .const import (
    DOMAIN,
    JS_FILE,
    MAX_CONFIG_BYTES,
    PANEL_ELEMENT,
    PANEL_URL,
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
DEFAULT_DATA: dict[str, Any] = {"version": 1, "settings": {}, "tabs": [], "profiles": {}, "pets": {}, "feed": {}, "twins": {}, "walls": []}
PLATFORMS = ["sensor", "button"]


class PanelData:
    """Shared, persisted panel layout."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = json.loads(json.dumps(DEFAULT_DATA))
        self._feeder_at: dict[str, Any] = {}   # pet id → last time the feeder service ran (in memory)
        self.twins = TW.Twins(hass, lambda: self.data, self._fallback_used)

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
        # loaded on every page, so the strategy, the card and the scaling are defined before a dashboard opens
        add_extra_js_url(hass, f"{URL_BASE}/{JS_FILE}?v={VERSION}")
        for handler in (ws_get, ws_set, ws_season, ws_subscribe, ws_info, ws_feed):
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
        vol.Required("key"): vol.In(["settings", "tabs", "profiles", "pets", "twins", "walls"]),
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
    elif key == "tabs":
        value = SF.clean_tabs(value)
    elif key in ("twins", "walls"):
        try:
            value = (TW.TWINS_SCHEMA if key == "twins" else TW.WALLS_SCHEMA)(value)
        except vol.Invalid as err:
            connection.send_error(msg["id"], "invalid", f"{key}: {err}")
            return
    data.data[key] = value
    if key == "walls":
        data.twins.listen()
    if key == "pets":
        data.refresh_all()
        async_dispatcher_send(hass, SIGNAL_PETS)
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
    """Version of the integration, so an outdated script in a browser cache can ask for a reload."""
    connection.send_result(msg["id"], {"version": VERSION})
