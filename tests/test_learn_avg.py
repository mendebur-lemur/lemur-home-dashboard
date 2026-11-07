"""Long average (Öğren on an always-on device): from Home Assistant's records of the plug."""
import time

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done

from custom_components.lemur_home_dashboard import learn as LRN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    yield


async def test_average_from_history(hass: HomeAssistant):
    t0 = time.time() - 1
    hass.states.async_set("sensor.buz", "30", {"unit_of_measurement": "W"})   # no state_class: no statistics, the history is used
    await async_wait_recording_done(hass)
    r = await LRN.average_since(hass, "sensor.buz", t0)
    assert r["avg"] == 30 and r["kwh"] >= 0
    assert r["settled"] is False and r["hours"] < 1
    none = await LRN.average_since(hass, "sensor.yok", t0)
    assert none["avg"] is None and none["hours"] == 0
