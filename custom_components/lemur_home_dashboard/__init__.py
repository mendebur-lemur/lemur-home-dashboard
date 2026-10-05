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
DEFAULT_DATA: dict[str, Any] = {"version": 1, "settings": {}, "tabs": [], "profiles": {}, "pets": {}, "feed": {}}
PLATFORMS = ["sensor", "button"]


class PanelData:
    """Shared, persisted panel layout."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = json.loads(json.dumps(DEFAULT_DATA))

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
        return self.data.get("pets") or {}

    def rec(self, pid: str) -> dict:
        return (self.data.get("feed") or {}).get(pid) or {}

    def status(self, pid: str) -> str:
        return P.status(self.pets().get(pid) or {}, self.rec(pid), dt_util.now())

    @callback
    def set_rec(self, pid: str, rec: dict) -> None:
        feed = dict(self.data.get("feed") or {})
        feed[pid] = rec
        self.data["feed"] = feed

    @callback
    def refresh_all(self) -> None:
        """After the pets changed: recompute the next feeding of every pet."""
        now = dt_util.now()
        for pid, pet in self.pets().items():
            self.set_rec(pid, P.refresh(pet, self.rec(pid), now))

    def find(self, key: str) -> str | None:
        key = str(key or "").strip()
        if key in self.pets():
            return key
        low = key.lower()
        for pid, pet in self.pets().items():
            if str(pet.get("name") or "").strip().lower() == low:
                return pid
        return None

    async def async_feed(self, pid: str, by: str = "", take_back: bool = False) -> None:
        pet = self.pets().get(pid)
        if pet is None:
            return
        now = dt_util.now()
        self.set_rec(pid, P.undo(pet, self.rec(pid), now) if take_back else P.fed(pet, self.rec(pid), now, by))
        self.changed()
        async_dispatcher_send(self.hass, SIGNAL_TICK)
        feeder = pet.get("feeder")
        if not take_back and isinstance(feeder, dict) and "." in str(feeder.get("service") or ""):
            dom, svc = str(feeder["service"]).split(".", 1)
            sdata = dict(feeder.get("data") or {})
            if feeder.get("target"):
                sdata["entity_id"] = feeder["target"]
            try:
                await self.hass.services.async_call(dom, svc, sdata, blocking=False)
            except Exception as err:  # noqa: BLE001 - a broken feeder must not break the feeding record
                _LOGGER.warning("Feeder %s failed: %s", feeder.get("service"), err)

    async def async_tick(self, _now=None) -> None:
        """Every minute: statuses for the entities, a notification when a pet becomes late."""
        now = dt_util.now()
        dirty = False
        tr = (self.hass.config.language or "").lower().startswith("tr")
        for pid, pet in self.pets().items():
            rec = self.rec(pid)
            due0 = P.parse(rec.get("due"))
            if not rec.get("last") and pet.get("mode") == "times" and (due0 is None or due0 <= now):   # hiç beslenmedi: sıradaki saati göster
                rec = P.refresh(pet, rec, now)
                if rec.get("due"):
                    self.set_rec(pid, rec)
                    dirty = True
            st = P.status(pet, rec, now)
            notify = str(pet.get("notify") or "")
            if st == "late" and notify.startswith("notify.") and rec.get("due") and rec.get("notified") != rec.get("due"):
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
        if dirty:
            self.changed()
        async_dispatcher_send(self.hass, SIGNAL_TICK)


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
        await d.async_feed(pid, "service", bool(call.data.get("undo")))

    hass.services.async_register(DOMAIN, "feed", _svc_feed, schema=vol.Schema({vol.Required("pet"): str, vol.Optional("undo", default=False): bool}))
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
    connection.send_result(msg["id"], data.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_home_dashboard/set",
        vol.Required("key"): vol.In(["settings", "tabs", "profiles", "pets"]),
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
    data.data[key] = value
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
    await data.async_feed(msg["pet"], (user.name if user else "") or "", msg["undo"])
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
        connection.send_message(websocket_api.event_message(msg["id"], payload))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATE, _forward)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "lemur_home_dashboard/info"})
@callback
def ws_info(hass, connection, msg):
    """Version of the integration, so an outdated script in a browser cache can ask for a reload."""
    connection.send_result(msg["id"], {"version": VERSION})
