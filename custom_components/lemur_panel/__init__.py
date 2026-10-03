"""Lemur Panel.

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
from homeassistant.helpers.storage import Store

from .const import (
    DOMAIN,
    JS_FILE,
    MAX_CONFIG_BYTES,
    PANEL_ELEMENT,
    PANEL_URL,
    SIGNAL_UPDATE,
    STORAGE_KEY,
    STORAGE_VERSION,
    URL_BASE,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

# Empty config means "build the default layout from the home's areas" (done in the browser, src/defaults.js).
DEFAULT_DATA: dict[str, Any] = {"version": 1, "settings": {}, "tabs": [], "profiles": {}}


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
        for handler in (ws_get, ws_set, ws_subscribe, ws_info):
            websocket_api.async_register_command(hass, handler)
        hass.data[f"{DOMAIN}_static"] = True
    if PANEL_URL not in hass.data.get("frontend_panels", {}):
        turkish = (hass.config.language or "").lower().startswith("tr")
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL,
            webcomponent_name=PANEL_ELEMENT,
            sidebar_title="Lemur Panel",
            sidebar_icon="mdi:tablet-dashboard",
            module_url=f"{URL_BASE}/{JS_FILE}?v={VERSION}",
            require_admin=True,
            config={"turkish": turkish},
        )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.pop(DOMAIN, None)
    async_remove_panel(hass, PANEL_URL)
    return True


def _data(hass: HomeAssistant) -> PanelData | None:
    return hass.data.get(DOMAIN)


@websocket_api.websocket_command({vol.Required("type"): "lemur_panel/get"})
@callback
def ws_get(hass, connection, msg):
    data = _data(hass)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
        return
    connection.send_result(msg["id"], data.data)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lemur_panel/set",
        vol.Required("key"): vol.In(["settings", "tabs", "profiles"]),
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
    data.changed()
    connection.send_result(msg["id"], data.data)


@websocket_api.websocket_command({vol.Required("type"): "lemur_panel/subscribe"})
@callback
def ws_subscribe(hass, connection, msg):
    @callback
    def _forward(payload):
        connection.send_message(websocket_api.event_message(msg["id"], payload))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATE, _forward)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "lemur_panel/info"})
@callback
def ws_info(hass, connection, msg):
    """Version of the integration, so an outdated script in a browser cache can ask for a reload."""
    connection.send_result(msg["id"], {"version": VERSION})
