"""Removed and added again in the same Home Assistant run: the dashboard resource row and the copied loader come back
at once; static paths, the extra js and the websocket commands are not registered a second time."""
import os
from unittest.mock import patch

from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lemur_home_dashboard import lovres as LR
from custom_components.lemur_home_dashboard.const import LOADER_FILE, VERSION

DOMAIN = "lemur_home_dashboard"
REGISTER = LR.async_register   # the real one (conftest replaces the module attribute)
URL = f"/local/lemur_home_dashboard/{LOADER_FILE}?v={VERSION}"


async def test_remove_and_add_again_restores_the_resource(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    os.makedirs(tmp_path / "www")
    assert await async_setup_component(hass, "lovelace", {})
    res = hass.data["lovelace"].resources
    hass.config.components.update({"frontend", "panel_custom"})
    copy = tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE
    with patch.object(LR, "async_register", REGISTER), patch.object(LR, "_local_served", return_value=True), \
            patch("custom_components.lemur_home_dashboard._register_static") as static, \
            patch("custom_components.lemur_home_dashboard.add_extra_js_url") as extra, \
            patch("homeassistant.components.websocket_api.async_register_command") as wsreg, \
            patch("homeassistant.components.panel_custom.async_register_panel"), \
            patch("custom_components.lemur_home_dashboard.async_remove_panel"):
        e1 = MockConfigEntry(domain=DOMAIN, data={})
        e1.add_to_hass(hass)
        assert await hass.config_entries.async_setup(e1.entry_id)
        await hass.async_block_till_done()
        assert [it["url"] for it in res.async_items()] == [URL] and copy.exists()
        n_static, n_extra, n_ws = static.call_count, extra.call_count, wsreg.call_count
        assert await hass.config_entries.async_remove(e1.entry_id)
        await hass.async_block_till_done()
        assert res.async_items() == [] and not copy.exists()
        # added again, no restart
        e2 = MockConfigEntry(domain=DOMAIN, data={})
        e2.add_to_hass(hass)
        assert await hass.config_entries.async_setup(e2.entry_id)
        await hass.async_block_till_done()
        assert [it["url"] for it in res.async_items()] == [URL]
        assert copy.exists()
        assert (static.call_count, extra.call_count, wsreg.call_count) == (n_static, n_extra, n_ws)
        # a reload (not a removal) keeps one row and writes nothing new
        assert await hass.config_entries.async_reload(e2.entry_id)
        await hass.async_block_till_done()
        assert [it["url"] for it in res.async_items()] == [URL]
