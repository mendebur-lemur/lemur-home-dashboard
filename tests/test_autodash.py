"""Creating the dashboard for the user (2026-11-05): config flow fields, info, single claim."""
from unittest.mock import patch

from pytest_homeassistant_custom_component.common import MockConfigEntry

DOMAIN = "lemur_home_dashboard"


async def _setup(hass, data):
    hass.config.components.update({"frontend", "panel_custom"})
    entry = MockConfigEntry(domain=DOMAIN, data=data)
    entry.add_to_hass(hass)
    with patch("custom_components.lemur_home_dashboard._register_static"), \
            patch("custom_components.lemur_home_dashboard.add_extra_js_url"), \
            patch("homeassistant.components.panel_custom.async_register_panel"), \
            patch("custom_components.lemur_home_dashboard.async_remove_panel"):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


async def test_flow_defaults(hass):
    hass.config.language = "tr"
    hass.config.components.update({"frontend", "panel_custom"})
    with patch("custom_components.lemur_home_dashboard.async_setup_entry", return_value=True):
        r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
        assert r["type"] == "form"
        r = await hass.config_entries.flow.async_configure(r["flow_id"], {"create_dashboard": True, "dashboard_title": "  "})
    assert r["type"] == "create_entry"
    assert r["data"] == {"create_dashboard": True, "dashboard_title": "Ev", "dashboard_done": False}


async def test_info_and_single_claim(hass, hass_ws_client):
    entry = await _setup(hass, {"create_dashboard": True, "dashboard_title": "Salon", "dashboard_done": False})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/info"})
    r = await ws.receive_json()
    assert r["result"]["setup_dashboard"] == {"title": "Salon"}
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/dashboard_claim"})
    assert (await ws.receive_json())["result"] == {"ok": True, "title": "Salon"}
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/dashboard_claim"})
    assert (await ws.receive_json())["result"]["ok"] is False
    await ws.send_json({"id": 4, "type": "lemur_home_dashboard/info"})
    assert "setup_dashboard" not in (await ws.receive_json())["result"]
    assert entry.data["dashboard_done"] is True


async def test_old_entry_creates_nothing(hass, hass_ws_client):
    await _setup(hass, {})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/info"})
    assert "setup_dashboard" not in (await ws.receive_json())["result"]
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/dashboard_claim"})
    assert (await ws.receive_json())["result"]["ok"] is False
