"""Estimated devices (Enerji → Tahmini cihazlar): power formulas, schema, power and energy sensors."""
from datetime import timedelta
from types import SimpleNamespace

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util

from custom_components.lemur_home_dashboard import estimates as EST

DOMAIN = "lemur_home_dashboard"


def st(state, **attrs):
    return SimpleNamespace(state=state, attributes=attrs)


def test_power_formulas():
    light = {"kind": "light", "idle": 2, "max": 60}
    assert EST.power(light, None) == 2
    assert EST.power(light, st("off")) == 2
    assert EST.power(light, st("on", brightness=255)) == 60
    assert abs(EST.power(light, st("on", brightness=76.5)) - 19.4) < 0.01
    assert EST.power(light, st("on")) == 60                       # no brightness: full
    tv = {"kind": "onoff", "off": 0.5, "on": 95}
    assert EST.power(tv, st("playing")) == 95
    assert EST.power(tv, st("idle")) == 0.5
    assert EST.power(tv, st("unavailable")) == 0.5
    assert EST.power({"kind": "fixed", "w": 9}, None) == 9
    assert round(EST.power({"kind": "year", "year": 250}, None), 2) == 28.54
    assert round(EST.power({"kind": "cycle", "k100": 52, "week": 4}, None), 2) == 12.35
    assert EST.power({"kind": "fixed", "w": "x"}, None) == 0
    assert EST.kwh(1000, 3600) == 1
    assert EST.kwh(-5, 3600) == 0


def test_schema():
    ok = EST.ESTIMATES_SCHEMA({"buz": {"name": "Buzdolabı", "kind": "year", "year": 250, "junk": 1}})
    assert ok == {"buz": {"name": "Buzdolabı", "kind": "year", "year": 250.0}}
    for bad in ({"Buz!": {"name": "x", "kind": "year"}}, {"a": {"name": "x", "kind": "nuclear"}}, {"a": {"name": "x", "kind": "fixed", "w": -1}},
                {"a": {"name": "x", "kind": "light", "entity": "light.x; rm"}}):
        with pytest.raises(vol.Invalid):
            EST.ESTIMATES_SCHEMA(bad)


async def test_estimate_sensors(hass: HomeAssistant, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    entry = setup_lhd
    hass.states.async_set("light.masa", "on", {"brightness": 128})
    ws = await hass_ws_client(hass)
    est = {"masa": {"name": "Masa Lambası", "kind": "light", "entity": "light.masa", "idle": 2, "max": 60},
           "buz": {"name": "Buzdolabı", "kind": "year", "year": 250}}
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "estimates", "value": est})
    r = await ws.receive_json(); assert r["success"], r
    await hass.async_block_till_done()
    p = hass.states.get("sensor.lhd_masa_power")
    assert p is not None and float(p.state) == round(2 + 58 * 128 / 255, 2)
    assert p.attributes["unit_of_measurement"] == "W" and p.attributes["device_class"] == "power" and p.attributes["estimated"] is True
    assert "tahmini güç" in p.attributes["friendly_name"]
    e = hass.states.get("sensor.lhd_buz_energy")
    assert e is not None and e.attributes["state_class"] == "total_increasing" and e.attributes["unit_of_measurement"] == "kWh"
    # the light turns off: power follows
    hass.states.async_set("light.masa", "off", {})
    await hass.async_block_till_done()
    assert float(hass.states.get("sensor.lhd_masa_power").state) == 2
    # energy adds up over time
    d = hass.data[DOMAIN]
    ents = [x for x in hass.data["sensor"].entities if getattr(x, "est_id", None) == "buz" and x.entity_id.endswith("_energy")]
    assert ents
    en = ents[0]
    en._t = dt_util.utcnow() - timedelta(hours=10)
    en._tick(); await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_buz_energy").state) - 0.2854) < 0.002
    # bad value is refused
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/set", "key": "estimates", "value": {"x": {"name": "x", "kind": "fixed", "w": -3}}})
    r = await ws.receive_json(); assert not r["success"]
    # removing an estimate removes its sensors
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/set", "key": "estimates", "value": {"buz": est["buz"]}})
    r = await ws.receive_json(); assert r["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_masa_power") is None
    assert d.estimates().keys() == {"buz"}
    assert await hass.config_entries.async_unload(entry.entry_id)
