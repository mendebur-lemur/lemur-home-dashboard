"""Home Assistant test setup: the integration without the real frontend panel and static files."""
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

pytest_plugins = "pytest_homeassistant_custom_component"
DOMAIN = "lemur_home_dashboard"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture
async def setup_lhd(hass):
    """Set up the integration; returns its config entry."""
    hass.config.language = "tr"
    hass.config.components.update({"frontend", "panel_custom"})
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch("custom_components.lemur_home_dashboard._register_static"), \
            patch("custom_components.lemur_home_dashboard.add_extra_js_url"), \
            patch("homeassistant.components.panel_custom.async_register_panel"), \
            patch("custom_components.lemur_home_dashboard.async_remove_panel"):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        yield entry


@pytest.fixture(autouse=True)
def _no_waiting(monkeypatch):
    """v0.32 waits before writing: kWh sensors (ENERGY_WRITE_S), registry sync (REG_SYNC_S), the learning runs' save
    (LEARN_SAVE_S). The tests read the result right after a change; the waits have their own tests."""
    import custom_components.lemur_home_dashboard as pkg
    from custom_components.lemur_home_dashboard import sensor
    monkeypatch.setattr(sensor, "ENERGY_WRITE_S", 0.0)
    monkeypatch.setattr(sensor, "ENERGY_IDLE_S", 0.0)   # v0.33: the minute tick writes every time in the tests
    monkeypatch.setattr(sensor, "REG_SYNC_S", 0.0)
    monkeypatch.setattr(pkg, "LEARN_SAVE_S", 0.0)
