"""Reload of the integration (Settings → Integrations → Reload): open admin pages keep saving."""
from unittest.mock import patch

DOMAIN = "lemur_home_dashboard"


async def _reload(hass, entry):
    with patch("custom_components.lemur_home_dashboard._register_static"), \
            patch("custom_components.lemur_home_dashboard.add_extra_js_url"), \
            patch("homeassistant.components.panel_custom.async_register_panel"), \
            patch("custom_components.lemur_home_dashboard.async_remove_panel"):
        assert await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()


async def test_save_after_reload_is_not_a_conflict(hass, hass_ws_client, setup_lhd):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 1}, "rev": 0})
    assert (await ws.receive_json())["success"]
    await _reload(hass, setup_lhd)
    # the page still holds rev 1 for settings (its subscription survives the reload, it does not fetch again)
    await ws.send_json({"id": 2, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 2}, "rev": 1})
    r = await ws.receive_json()
    assert r["success"], r
    assert hass.data[DOMAIN].data["settings"] == {"a": 2}
    # a really older copy is still turned down
    await ws.send_json({"id": 3, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 3}, "rev": 1})
    assert (await ws.receive_json())["error"]["code"] == "conflict"


async def test_reload_leaves_no_listeners_behind(hass, setup_lhd):
    n0 = sum(hass.bus.async_listeners().values())
    for _ in range(3):
        await _reload(hass, setup_lhd)
    assert sum(hass.bus.async_listeners().values()) == n0
