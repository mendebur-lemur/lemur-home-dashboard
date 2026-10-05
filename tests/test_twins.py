"""Backup control (twins) and wall switches."""
from homeassistant.core import Context
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import async_mock_service

DOMAIN = "lemur_home_dashboard"
FAST, SLOW, WALL = "light.wc_govee", "light.wc_matter", "switch.wc_wall"


def _set(hass, eid, state, **attrs):
    hass.states.async_set(eid, state, attrs)


async def _setup_twin(hass, hass_ws_client, walls=None):
    await async_setup_component(hass, "http", {})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "twins", "value": {FAST: {"backup": SLOW}}})
    assert (await ws.receive_json())["success"]
    if walls is not None:
        await ws.send_json({"id": 2, "type": "lemur_home_dashboard/set", "key": "walls", "value": walls})
        r = await ws.receive_json()
        assert r["success"], r
    return ws


async def test_schema_rejects_bad(hass, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    ws = await hass_ws_client(hass)
    for i, (key, value) in enumerate([
        ("twins", {FAST: {"backup": "script.x"}}),
        ("twins", {"homeassistant.stop": {"backup": SLOW}}),
        ("walls", [{"switch": WALL}]),
        ("walls", [{"switch": WALL, "light": FAST, "brightness": 500}]),
    ]):
        await ws.send_json({"id": 10 + i, "type": "lemur_home_dashboard/set", "key": key, "value": value})
        r = await ws.receive_json()
        assert not r["success"], (key, value)


async def test_fast_path_answers_no_fallback(hass, hass_ws_client, setup_lhd):
    _set(hass, FAST, "off")
    _set(hass, SLOW, "off")
    await _setup_twin(hass, hass_ws_client)
    fast_on = async_mock_service(hass, "light", "turn_on")

    async def answer():   # the lamp turns on: the twin reports it
        _set(hass, FAST, "on")
        _set(hass, SLOW, "on")

    hass.loop.call_later(0.2, lambda: hass.async_create_task(answer()))
    res = await hass.data[DOMAIN].twins.control(FAST, "toggle")
    assert res == "primary"
    assert [c.data["entity_id"] for c in fast_on] == [FAST]
    assert hass.data[DOMAIN].twins.fallback == {}


async def test_stuck_fast_side_uses_backup(hass, hass_ws_client, setup_lhd, monkeypatch):
    from custom_components.lemur_home_dashboard import twins as TW
    monkeypatch.setattr(TW, "OFF_WAIT", 0.2)
    # govee2mqtt stuck at "off" since the morning, Matter knows the lamp is on
    _set(hass, FAST, "off")
    await hass.async_block_till_done()
    _set(hass, SLOW, "on")
    await _setup_twin(hass, hass_ws_client)
    offs = async_mock_service(hass, "light", "turn_off")
    res = await hass.data[DOMAIN].twins.control(FAST, "toggle")
    assert res == "backup"
    # the decision was "turn off" (Matter changed last), first fast, then the twin
    assert [c.data["entity_id"] for c in offs] == [FAST, SLOW]
    assert FAST in hass.data[DOMAIN].twins.fallback


async def test_no_twin_is_plain(hass, setup_lhd):
    _set(hass, "light.other", "off")
    ons = async_mock_service(hass, "light", "turn_on")
    res = await hass.data[DOMAIN].twins.control("light.other", "toggle", {"brightness_pct": 40})
    assert res == "plain"
    assert ons[0].data == {"entity_id": "light.other", "brightness_pct": 40}


async def test_service_and_fallback_broadcast(hass, hass_ws_client, setup_lhd, monkeypatch):
    from custom_components.lemur_home_dashboard import twins as TW
    monkeypatch.setattr(TW, "ON_WAIT", 0.2)
    _set(hass, FAST, "off")
    _set(hass, SLOW, "off")
    ws = await _setup_twin(hass, hass_ws_client)
    await ws.send_json({"id": 5, "type": "lemur_home_dashboard/subscribe"})
    assert (await ws.receive_json())["success"]
    ons = async_mock_service(hass, "light", "turn_on")
    await hass.services.async_call(DOMAIN, "control", {"entity_id": FAST, "brightness_pct": 50, "color_temp_kelvin": 3200}, blocking=True)
    assert [c.data["entity_id"] for c in ons] == [FAST, SLOW]
    assert ons[1].data["brightness_pct"] == 50 and ons[1].data["color_temp_kelvin"] == 3200
    ev = await ws.receive_json()
    assert ev["type"] == "event" and FAST in ev["event"]["__fb"]
    await ws.send_json({"id": 6, "type": "lemur_home_dashboard/get"})
    r = await ws.receive_json()
    assert FAST in r["result"]["fallback"]


async def test_wall_switch_physical_press_only(hass, hass_ws_client, setup_lhd):
    _set(hass, WALL, "off")
    _set(hass, FAST, "off")
    _set(hass, SLOW, "off")
    await _setup_twin(hass, hass_ws_client, [{"switch": WALL, "light": FAST, "brightness": 50, "kelvin": 3200}])
    ons = async_mock_service(hass, "light", "turn_on")

    async def answer():
        _set(hass, FAST, "on")
        _set(hass, SLOW, "on")

    hass.loop.call_later(0.2, lambda: hass.async_create_task(answer()))
    hass.states.async_set(WALL, "on")            # physical press: no user, no parent
    await hass.async_block_till_done()
    assert len(ons) == 1 and ons[0].data == {"entity_id": FAST, "brightness_pct": 50, "color_temp_kelvin": 3200}

    # a change made by a user (HA app) or by an automation is ignored
    hass.states.async_set(WALL, "off", context=Context(user_id="abc"))
    hass.states.async_set(WALL, "on", context=Context(parent_id="xyz"))
    await hass.async_block_till_done()
    assert len(ons) == 1
