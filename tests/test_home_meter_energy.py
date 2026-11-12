"""sensor.lhd_ev_energy with a home meter (v0.36.0b4): the home's kWh today is the meter's, guarded like a category
(a glitch is not counted, a reset is), Wh converted; without a meter it stays the devices' sum; meter without devices works;
picking the meter in the settings is followed at once (also by sensor.lhd_ev_power)."""
import pytest

DOMAIN = "lemur_home_dashboard"
KWH, WH, W = {"unit_of_measurement": "kWh"}, {"unit_of_measurement": "Wh"}, {"unit_of_measurement": "W", "device_class": "power"}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    yield


async def _set(hass, ws, key, value, n=[100]):
    n[0] += 1
    await ws.send_json({"id": n[0], "type": f"{DOMAIN}/set", "key": key, "value": value})
    assert (await ws.receive_json())["success"]
    for _ in range(3):
        await hass.async_block_till_done()


def _ev(hass):
    s = hass.states.get("sensor.lhd_ev_energy")
    return None if s is None else float(s.state)


async def _feed(hass, ent, vals, attrs=KWH):
    for v in vals:
        hass.states.async_set(ent, v, attrs)
        await hass.async_block_till_done()
    return _ev(hass)


async def _home(hass, hass_ws_client, meter=None, devices=True):
    ws = await hass_ws_client(hass)
    hass.states.async_set("sensor.p_w", "40", W)
    hass.states.async_set("sensor.p_kwh", "10.0", KWH)
    hass.states.async_set("sensor.em_w", "300", W)
    hass.states.async_set("sensor.em_kwh", "1000.0", KWH)
    if devices:
        await _set(hass, ws, "estimates", {"p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh"}})
    if meter is not None:
        await _set(hass, ws, "settings", {"energy": {"meter": meter}})
    return ws


async def test_no_meter_counts_devices(hass, hass_ws_client, setup_lhd):
    await _home(hass, hass_ws_client)
    assert abs(await _feed(hass, "sensor.p_kwh", ["10.5", "11.0"]) - 1.0) < 1e-6
    assert await _feed(hass, "sensor.em_kwh", ["1003.0"]) == pytest.approx(1.0)   # the meter is not followed


async def test_meter_is_the_home_total(hass, hass_ws_client, setup_lhd):
    await _home(hass, hass_ws_client, meter={"power": "sensor.em_w", "energy": "sensor.em_kwh"})
    assert await _feed(hass, "sensor.p_kwh", ["10.5"]) == pytest.approx(0.0)   # devices are parts, not the total
    assert await _feed(hass, "sensor.em_kwh", ["1001.2", "1002.0"]) == pytest.approx(2.0)
    # glitch on the meter (99999 kWh, then back near the old value): the jump is not counted, the meter goes on counting
    assert await _feed(hass, "sensor.em_kwh", ["99999", "1002.1", "1002.2", "1002.3", "1002.4", "1002.5", "1002.6"]) == pytest.approx(2.5)
    # one jump over MAX_STEP (50 kWh): a wrong reading
    assert await _feed(hass, "sensor.em_kwh", ["1100.0"]) == pytest.approx(2.5)


async def test_meter_reset_counts_after(hass, hass_ws_client, setup_lhd):
    await _home(hass, hass_ws_client, meter={"energy": "sensor.em_kwh"})
    await _feed(hass, "sensor.em_kwh", ["1001.0"])
    v = await _feed(hass, "sensor.em_kwh", ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6"])
    assert v == pytest.approx(1.0 + 0.6)


async def test_meter_in_wh(hass, hass_ws_client, setup_lhd):
    hass.states.async_set("sensor.em_kwh", "1000000", WH)
    await _home(hass, hass_ws_client, meter={"energy": "sensor.em_kwh"})
    hass.states.async_set("sensor.em_kwh", "1000000", WH)
    await hass.async_block_till_done()
    assert await _feed(hass, "sensor.em_kwh", ["1000500", "1001500"], WH) == pytest.approx(1.5)


async def test_meter_without_devices(hass, hass_ws_client, setup_lhd):
    await _home(hass, hass_ws_client, meter={"power": "sensor.em_w", "energy": "sensor.em_kwh"}, devices=False)
    assert _ev(hass) is not None
    assert await _feed(hass, "sensor.em_kwh", ["1000.7"]) == pytest.approx(0.7)
    assert float(hass.states.get("sensor.lhd_ev_power").state) == 300


async def test_meter_with_solar_keeps_devices(hass, hass_ws_client, setup_lhd):
    await _home(hass, hass_ws_client)
    ws = await hass_ws_client(hass)
    await _set(hass, ws, "settings", {"energy": {"meter": {"energy": "sensor.em_kwh"}, "solar": {"on": True, "sun": True, "prod": "sensor.pv"}}})
    assert await _feed(hass, "sensor.em_kwh", ["1005.0"]) == pytest.approx(0.0)   # grid import is not the home's use
    assert await _feed(hass, "sensor.p_kwh", ["10.4"]) == pytest.approx(0.4)


async def test_picking_meter_is_followed_at_once(hass, hass_ws_client, setup_lhd):
    ws = await _home(hass, hass_ws_client)
    hass.states.async_set("sensor.p_w", "41", W)
    await hass.async_block_till_done()
    await _feed(hass, "sensor.p_kwh", ["10.3"])
    await _set(hass, ws, "settings", {"energy": {"meter": {"power": "sensor.em_w", "energy": "sensor.em_kwh"}}})
    # from now on the meter: its counter, and the power sensor follows the meter too
    assert await _feed(hass, "sensor.em_kwh", ["1000.5"]) == pytest.approx(0.3 + 0.5)
    hass.states.async_set("sensor.em_w", "333", W)
    for _ in range(3):
        await hass.async_block_till_done()
    from datetime import timedelta
    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=10))
    await hass.async_block_till_done()
    assert float(hass.states.get("sensor.lhd_ev_power").state) == 333
