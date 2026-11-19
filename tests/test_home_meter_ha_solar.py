"""sensor.lhd_ev_energy ("Ev bugün toplam") with a home meter picked in the dashboard and solar or a battery only in Home
Assistant's Energy settings (not switched on in the dashboard): the meter counts what came from the grid, not what the home
used. The dashboard's cards already keep the devices' sum there (v0.36.0b8, src/energy.js lpEnHomeIds); the sensor must agree."""
import pytest

DOMAIN = "lemur_home_dashboard"
KWH, W = {"unit_of_measurement": "kWh"}, {"unit_of_measurement": "W", "device_class": "power"}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    yield


async def _set(hass, ws, key, value, n=[500]):
    n[0] += 1
    await ws.send_json({"id": n[0], "type": f"{DOMAIN}/set", "key": key, "value": value})
    assert (await ws.receive_json())["success"]
    for _ in range(3):
        await hass.async_block_till_done()


async def _feed(hass, ent, vals):
    for v in vals:
        hass.states.async_set(ent, v, KWH)
        await hass.async_block_till_done()
    return float(hass.states.get("sensor.lhd_ev_energy").state)


async def _prefs(hass, extra):
    from homeassistant.components.energy.data import async_get_manager
    mgr = await async_get_manager(hass)
    grid = {"type": "grid", "flow_from": [{"stat_energy_from": "sensor.em_kwh"}], "flow_to": [], "cost_adjustment_day": 0}
    await mgr.async_update({"energy_sources": [grid] + extra})
    for _ in range(3):
        await hass.async_block_till_done()


async def _home(hass, hass_ws_client):
    ws = await hass_ws_client(hass)
    hass.states.async_set("sensor.p_w", "40", W)
    hass.states.async_set("sensor.p_kwh", "10.0", KWH)
    hass.states.async_set("sensor.em_kwh", "1000.0", KWH)
    await _set(hass, ws, "estimates", {"p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh"}})
    await _set(hass, ws, "settings", {"energy": {"sync": False, "meter": {"energy": "sensor.em_kwh"}}})
    return ws


@pytest.mark.parametrize("src", [
    {"type": "solar", "stat_energy_from": "sensor.pv_kwh"},
    {"type": "battery", "stat_energy_from": "sensor.b_out", "stat_energy_to": "sensor.b_in"},
])
async def test_solar_only_in_ha_keeps_devices(hass, hass_ws_client, setup_lhd, src):
    await _prefs(hass, [src])
    await _home(hass, hass_ws_client)
    assert await _feed(hass, "sensor.em_kwh", ["1005.0"]) == pytest.approx(0.0)   # grid import is not the home's use
    assert await _feed(hass, "sensor.p_kwh", ["10.4"]) == pytest.approx(0.4)


async def test_solar_added_in_ha_later_is_followed(hass, hass_ws_client, setup_lhd):
    await _prefs(hass, [])
    await _home(hass, hass_ws_client)
    assert await _feed(hass, "sensor.em_kwh", ["1001.0"]) == pytest.approx(1.0)   # no solar: the meter is the home
    await _prefs(hass, [{"type": "solar", "stat_energy_from": "sensor.pv_kwh"}])
    assert await _feed(hass, "sensor.em_kwh", ["1004.0"]) == pytest.approx(1.0)
    assert await _feed(hass, "sensor.p_kwh", ["10.5"]) == pytest.approx(1.5)
    # solar taken out again: back to the meter
    await _prefs(hass, [])
    assert await _feed(hass, "sensor.em_kwh", ["1004.2"]) == pytest.approx(1.7)
