"""Enerji sayfası v0.26: measured devices, state-based power, categories, energy settings sync, solar, import."""
from datetime import timedelta
from types import SimpleNamespace

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.lemur_home_dashboard import estimates as EST

DOMAIN = "lemur_home_dashboard"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    """The energy integration needs the recorder: it must start before hass (overrides conftest)."""
    yield


def st(state, **attrs):
    return SimpleNamespace(state=state, attributes=attrs)


def test_states_and_meas_power():
    tv = {"kind": "states", "states": [{"s": "playing", "w": 95}, {"s": "paused", "w": 70}], "other": 0.5}
    assert EST.power(tv, st("playing")) == 95
    assert EST.power(tv, st("paused")) == 70
    assert EST.power(tv, st("off")) == 0.5
    assert EST.power(tv, None) == 0.5
    assert EST.power({"kind": "meas"}, st("1.2", unit_of_measurement="kW")) == 1200
    assert EST.power({"kind": "meas"}, st("unavailable")) == 0
    assert EST.power({"kind": "light", "idle": 0.4, "min": 3, "max": 10}, st("on", brightness=0)) == 3
    assert EST.power({"kind": "light", "idle": 0.4, "min": 3, "max": 10}, st("off")) == 0.4
    assert EST.energy_entity("x", {"kind": "meas", "energy": "sensor.x_kwh"}) == "sensor.x_kwh"
    assert EST.energy_entity("x", {"kind": "meas"}) == "sensor.lhd_x_energy"
    assert EST.power_entity("x", {"kind": "meas", "sensor": "sensor.x_w"}) == "sensor.x_w"


def test_build_prefs_keeps_others():
    prefs = {"energy_sources": [{"type": "grid", "flow_from": []}], "device_consumption": [
        {"stat_consumption": "sensor.other_energy"}, {"stat_consumption": "sensor.lhd_gone_energy"},
        {"stat_consumption": "sensor.child_energy", "included_in_stat": "sensor.lhd_kat_old_energy"}]}
    ests = {"tv": {"name": "TV", "kind": "states", "cat": "medya"}, "p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh"}}
    cats = [{"id": "medya", "name": "Medya"}]
    out = EST.build_prefs(prefs, ests, cats, {"energy": {"solar": {"on": True, "prod": "sensor.pv_w"}}})
    stats = [d["stat_consumption"] for d in out["device_consumption"]]
    assert stats[:3] == ["sensor.lhd_kat_medya_energy", "sensor.lhd_tv_energy", "sensor.p_kwh"]
    assert "sensor.other_energy" in stats and "sensor.lhd_gone_energy" not in stats
    tvrow = out["device_consumption"][1]
    assert tvrow["included_in_stat"] == "sensor.lhd_kat_medya_energy" and tvrow["stat_rate"] == "sensor.lhd_tv_power"
    child = [d for d in out["device_consumption"] if d["stat_consumption"] == "sensor.child_energy"][0]
    assert "included_in_stat" not in child
    sol = [s for s in out["energy_sources"] if s["type"] == "solar"]
    assert sol and sol[0]["stat_energy_from"] == "sensor.lhd_solar_energy" and sol[0]["stat_rate"] == "sensor.pv_w"
    assert any(s["type"] == "grid" for s in out["energy_sources"])


async def test_categories_meas_and_sync(hass: HomeAssistant, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "energy", {})
    hass.states.async_set("media_player.tv", "playing", {})
    hass.states.async_set("sensor.priz_w", "40", {"unit_of_measurement": "W", "device_class": "power"})
    hass.states.async_set("sensor.pv_w", "1500", {"unit_of_measurement": "W", "device_class": "power"})
    ws = await hass_ws_client(hass)
    cats = [{"id": "medya", "name": "Medya", "color": "#B388FF"}]
    est = {"tv": {"name": "Salon TV", "kind": "states", "entity": "media_player.tv", "states": [{"s": "playing", "w": 95}, {"s": "paused", "w": 70}], "other": 0.5, "cat": "medya"},
           "priz": {"name": "Priz", "kind": "meas", "sensor": "sensor.priz_w", "cat": "medya"}}
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "ecats", "value": cats})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/set", "key": "estimates", "value": est})
    r = await ws.receive_json(); assert r["success"], r
    await hass.async_block_till_done()
    assert float(hass.states.get("sensor.lhd_tv_power").state) == 95
    assert hass.states.get("sensor.lhd_priz_power") is None                 # measured: its own sensor
    assert hass.states.get("sensor.lhd_priz_energy") is not None            # no kWh sensor: the dashboard counts
    assert float(hass.states.get("sensor.lhd_kat_medya_power").state) == 135
    hass.states.async_set("media_player.tv", "paused", {})
    await hass.async_block_till_done()
    await hass.async_block_till_done()   # the category follows the device sensor one step later
    assert float(hass.states.get("sensor.lhd_kat_medya_power").state) == 110
    # category kWh follows its devices' counters
    ce = [x for x in hass.data["sensor"].entities if x.entity_id == "sensor.lhd_kat_medya_energy"][0]
    tvE = [x for x in hass.data["sensor"].entities if x.entity_id == "sensor.lhd_tv_energy"][0]
    tvE._t = dt_util.utcnow() - timedelta(hours=1)
    tvE._tick(); await hass.async_block_till_done(); await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_tv_energy").state) - 0.07) < 0.002
    assert abs(float(hass.states.get("sensor.lhd_kat_medya_energy").state) - 0.07) < 0.002
    # counter reset of a member: decided on the next reading, then only what it gained after
    hass.states.async_set("sensor.lhd_tv_energy", "0.01", {"unit_of_measurement": "kWh"})
    await hass.async_block_till_done()
    await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_kat_medya_energy").state) - 0.07) < 0.002
    hass.states.async_set("sensor.lhd_tv_energy", "0.02", {"unit_of_measurement": "kWh"})
    await hass.async_block_till_done()
    await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_kat_medya_energy").state) - 0.09) < 0.002
    # energy settings follow (debounced)
    d = hass.data[DOMAIN]
    assert await d.async_sync_prefs()
    from homeassistant.components.energy.data import async_get_manager
    prefs = (await async_get_manager(hass)).data
    stats = [x["stat_consumption"] for x in prefs["device_consumption"]]
    assert stats == ["sensor.lhd_kat_medya_energy", "sensor.lhd_tv_energy", "sensor.lhd_priz_energy"]
    # solar without a kWh sensor: the dashboard counts it and adds a solar source
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/set", "key": "settings", "value": {"energy": {"solar": {"on": True, "prod": "sensor.pv_w"}}}})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_solar_energy") is not None
    assert await d.async_sync_prefs()
    prefs = (await async_get_manager(hass)).data
    assert [s["stat_energy_from"] for s in prefs["energy_sources"] if s["type"] == "solar"] == ["sensor.lhd_solar_energy"]
    # removing the category: its sensors go, devices stay
    await ws.send_json({"id": 4, "type": "lemur_home_dashboard/set", "key": "ecats", "value": []})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_kat_medya_power") is None
    assert hass.states.get("sensor.lhd_tv_power") is not None
    # bad category id refused, reserved device id refused
    await ws.send_json({"id": 5, "type": "lemur_home_dashboard/set", "key": "ecats", "value": [{"id": "A B", "name": "x"}]})
    assert not (await ws.receive_json())["success"]
    await ws.send_json({"id": 6, "type": "lemur_home_dashboard/set", "key": "estimates", "value": {"solar": {"name": "x", "kind": "fixed", "w": 1}}})
    assert not (await ws.receive_json())["success"]
    await ws.send_json({"id": 7, "type": "lemur_home_dashboard/set", "key": "estimates", "value": {"kat_x": {"name": "x", "kind": "fixed", "w": 1}}})
    assert not (await ws.receive_json())["success"]


async def test_import(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """Entries of the other integration: two lights and a TV in two groups, a total group of groups."""
    await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "energy", {})
    reg = er.async_get(hass)
    hass.states.async_set("light.tavan", "on", {"brightness": 128})
    hass.states.async_set("media_player.tv", "playing", {})

    def entry(eid, data, power, energy):
        e = MockConfigEntry(domain="powercalc", entry_id=eid, data=data, title=data.get("name", eid))
        e.add_to_hass(hass)
        for ent, dc, unit, val in ((power, "power", "W", "20"), (energy, "energy", "kWh", "1.0")):
            if ent:
                reg.async_get_or_create("sensor", "powercalc", ent, suggested_object_id=ent.split(".")[1], config_entry=e, original_device_class=dc)
                hass.states.async_set(ent, val, {"unit_of_measurement": unit, "device_class": dc})
        return e
    entry("e1", {"entity_id": "light.tavan", "name": "Salon Tavan", "mode": "linear", "linear": {"min_power": 2, "max_power": 46}, "standby_power": 0.4}, "sensor.salon_tavan_power", "sensor.salon_tavan_energy")
    entry("e2", {"entity_id": "media_player.tv", "name": "Salon TV", "mode": "fixed", "fixed": {"states_power": {"playing": 95, "paused": 70}}, "standby_power": 0.5}, "sensor.salon_tv_power", "sensor.salon_tv_energy")
    entry("e3", {"entity_id": "sensor.dummy", "name": "Modem", "mode": "fixed", "fixed": {"power": 9}}, "sensor.modem_power", "sensor.modem_energy")
    entry("g1", {"sensor_type": "group", "name": "Enerji Işıklar", "group_member_sensors": ["e1"]}, "sensor.enerji_isiklar_power", "sensor.enerji_isiklar_energy")
    entry("g2", {"sensor_type": "group", "name": "Enerji Medya", "group_member_sensors": ["e2", "e3"]}, "sensor.enerji_medya_power", "sensor.enerji_medya_energy")
    entry("g3", {"sensor_type": "group", "name": "Ev Toplam", "group_member_sensors": ["g1", "g2"]}, "sensor.ev_toplam_power", "sensor.ev_toplam_energy")
    from homeassistant.components.energy.data import async_get_manager
    mgr = await async_get_manager(hass)
    await mgr.async_update({"energy_sources": [], "device_consumption": [
        {"stat_consumption": "sensor.enerji_isiklar_energy", "name": "Işıklar"}, {"stat_consumption": "sensor.enerji_medya_energy", "name": "Medya ve Ekranlar"},
        {"stat_consumption": "sensor.salon_tavan_energy", "included_in_stat": "sensor.enerji_isiklar_energy"},
        {"stat_consumption": "sensor.salon_tv_energy", "included_in_stat": "sensor.enerji_medya_energy"},
        {"stat_consumption": "sensor.modem_energy", "included_in_stat": "sensor.enerji_medya_energy"},
        {"stat_consumption": "sensor.unrelated_energy"}]})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/energy_import"})
    r = await ws.receive_json(); assert r["success"], r
    p = r["result"]
    assert p["found"] == 6
    assert sorted(c["name"] for c in p["cats"]) == ["Işıklar", "Medya ve Ekranlar"]
    kinds = {x["name"]: x["kind"] for x in p["devices"]}
    assert kinds == {"Salon Tavan": "light", "Salon TV": "states", "Modem": "fixed"}
    assert set(p["drop"]) >= {"sensor.salon_tavan_energy", "sensor.enerji_isiklar_energy"}
    assert p["old_w"] == 40
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/energy_import", "apply": True})
    r = await ws.receive_json(); assert r["success"], r
    assert r["result"]["synced"]
    await hass.async_block_till_done()
    d = hass.data[DOMAIN]
    e = {v["name"]: v for v in d.estimates().values()}
    assert e["Salon Tavan"]["min"] == 2 and e["Salon Tavan"]["max"] == 46 and e["Salon Tavan"]["idle"] == 0.4
    assert e["Salon TV"]["states"][:2] == [{"s": "playing", "w": 95.0}, {"s": "paused", "w": 70.0}]
    assert [x["s"] for x in e["Salon TV"]["states"][2:]] == ["off", "standby", "unavailable"]
    assert e["Modem"]["w"] == 9
    stats = [x["stat_consumption"] for x in mgr.data["device_consumption"]]
    assert "sensor.unrelated_energy" in stats and "sensor.salon_tv_energy" not in stats and "sensor.enerji_medya_energy" not in stats
    assert any(s.startswith("sensor.lhd_kat_") for s in stats)
    tav = [k for k, v in d.estimates().items() if v["name"] == "Salon Tavan"][0]
    assert abs(float(hass.states.get(f"sensor.lhd_{tav}_power").state) - (2 + 44 * 128 / 255)) < 0.05
    # running it again does not add the same devices twice
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/energy_import"})
    r = await ws.receive_json(); assert r["success"]
    assert r["result"]["devices"] == [] and len(r["result"]["skipped"]) == 3


def test_library_profiles(tmp_path):
    """Entries made from the other integration's library: watts come from the downloaded profile."""
    import gzip
    import json as _j
    from custom_components.lemur_home_dashboard import energy_import as EI2
    g = tmp_path / "govee" / "H6008"
    g.mkdir(parents=True)
    (g / "model.json").write_text(_j.dumps({"calculation_strategy": "lut", "standby_power": 0.28, "aliases": ["Bulb X"]}))
    with gzip.open(g / "color_temp.csv.gz", "wt") as f:
        f.write("bri,mired,watt\n1,153,0.9\n1,370,0.8\n128,153,4.1\n255,153,9.7\n255,370,9.2\n")
    a = tmp_path / "apple" / "A2374"
    a.mkdir(parents=True)
    (a / "model.json").write_text(_j.dumps({"calculation_strategy": "linear", "standby_power": 0.65, "calculation_enabled_condition": "{{ is_state('[[entity]]', 'playing') }}",
                                            "linear_config": {"calibrate": ["0 -> 0.99", "50 -> 1.06", "100 -> 4.22"]}}))
    p = EI2.profile_data(tmp_path, "Govee", "H6008")
    assert p["mode"] == "linear" and p["linear"] == {"min_power": 0.8, "max_power": 9.7} and p["standby_power"] == 0.28
    assert EI2.profile_data(tmp_path, "govee", "Bulb X")["linear"]["max_power"] == 9.7   # by alias
    assert EI2.profile_data(tmp_path, "govee", "nope") is None
    # newer downloads: <model>/.powercalc/current/
    n = tmp_path / "signify" / "BSB002" / ".powercalc" / "current"
    n.mkdir(parents=True)
    (n / "model.json").write_text(_j.dumps({"calculation_strategy": "fixed", "fixed_config": {"power": 1.74}}))
    g2 = tmp_path / "govee" / "H61F5" / ".powercalc" / "current"
    g2.mkdir(parents=True)
    (g2 / "model.json").write_text(_j.dumps({"calculation_strategy": "lut", "standby_power": 1.2, "name": "Strip 2"}))
    with gzip.open(g2 / "color_temp.csv.gz", "wt") as f:
        f.write("bri,mired,watt\n1,153,4.8\n255,153,25.8\n")
    with gzip.open(g2 / "effect.csv.gz", "wt") as f:
        f.write("effect,bri,watt\nRainbow,255,14.2\nRainbow,128,7.5\n")
    p2 = EI2.profile_data(tmp_path, "govee", "H61F5")
    assert p2["standby_power"] == 1.2 and p2["linear"]["max_power"] == 25.8 and "fx" in p2["lut"]
    assert EI2.profile_data(tmp_path, "govee", "Strip 2")["standby_power"] == 1.2   # by name
    assert EI2.profile_data(tmp_path, "signify", "BSB002")["fixed"]["power"] == 1.74
    # a sub profile (LST002/230v) inherits its parent's strategy and standby
    par = tmp_path / "signify" / "LST002" / ".powercalc" / "current"
    (par / "230v").mkdir(parents=True)
    (par / "model.json").write_text(_j.dumps({"calculation_strategy": "lut", "standby_power": 0.18}))
    (par / "230v" / "model.json").write_text(_j.dumps({"name": "Strip 230V"}))
    with gzip.open(par / "230v" / "color_temp.csv.gz", "wt") as f:
        f.write("bri,mired,watt\n1,153,1.0\n255,153,20.0\n")
    p3 = EI2.profile_data(tmp_path, "signify", "LST002/230v")
    assert p3["standby_power"] == 0.18 and p3["linear"]["max_power"] == 20.0
    hp = EI2.profile_data(tmp_path, "apple", "A2374")
    r = EST.convert_entry({"entity_id": "media_player.hp", "name": "HomePod", **hp}, 0.65, None)
    assert r["kind"] == "states" and r["states"] == [{"s": "playing", "w": 2.6}] and r["other"] == 0.65
    lt = EST.convert_entry({"entity_id": "light.x", "name": "Lamba", **p}, 0, None)
    assert lt["kind"] == "light" and lt["max"] == 9.7 and lt["min"] == 0.8 and lt["idle"] == 0.28 and "check" not in lt
    assert lt["src"] == "import" and lt["lut"]["ct"]["w"][-1][-1] == 9.7   # the measured table itself, not a straight line
    # a fixed device that is on in a state the other integration counts as on (a printer "idle")
    fx = EST.convert_entry({"entity_id": "sensor.yazici_durum", "name": "Yazıcı", "mode": "fixed", "fixed": {"power": 12}}, 12, None)
    assert fx["kind"] == "fixed" and fx["w"] == 12
    fx2 = EST.convert_entry({"entity_id": "select.yazici", "name": "Yazıcı", "mode": "fixed", "fixed": {"power": 12}}, 12, None)
    assert fx2["kind"] == "states" and fx2["other"] == 12 and EST.power(fx2, type("S", (), {"state": "idle", "attributes": {}})()) == 12


async def test_learn_ws(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """The learn commands over the websocket: the device goes in "device", not "id" (that is the message number)."""
    await async_setup_component(hass, "http", {})
    hass.states.async_set("sensor.priz_power", "0.0", {"unit_of_measurement": "W", "device_class": "power"})
    hass.states.async_set("climate.oda", "off", {})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/learn_start", "device": "oda_klima", "kind": "states", "entity": "climate.oda", "plug": "sensor.priz_power", "interval": 3})
    r = await ws.receive_json()
    assert r["success"], r
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/learn_status"})
    r = await ws.receive_json()
    assert "oda_klima" in r["result"]
    # the same plug for another device is refused with a code the dashboard shows
    hass.states.async_set("climate.oda2", "off", {})
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/learn_start", "device": "oda2", "kind": "states", "entity": "climate.oda2", "plug": "sensor.priz_power"})
    r = await ws.receive_json()
    assert not r["success"] and r["error"]["code"] == "plug_busy"
    await ws.send_json({"id": 4, "type": "lemur_home_dashboard/learn_ctl", "device": "oda_klima", "action": "cancel"})
    r = await ws.receive_json()
    assert r["success"], r


def test_meter_grid_source():
    """The whole-home meter picked in the dashboard becomes the grid source; the user's own grid meter is left alone."""
    st = {"energy": {"meter": {"energy": "sensor.em_in", "out": "sensor.em_out"}, "solar": {"on": True, "sun": False, "bat": True, "prod": "sensor.pv"}}}
    new = EST.build_prefs({"energy_sources": [], "device_consumption": []}, {}, [], st)
    g = [x for x in new["energy_sources"] if x["type"] == "grid"]
    assert len(g) == 1 and g[0]["flow_from"][0]["stat_energy_from"] == "sensor.em_in" and g[0]["flow_to"][0]["stat_energy_to"] == "sensor.em_out"
    assert not [x for x in new["energy_sources"] if x["type"] == "solar"]   # güneş kapalı (yalnız batarya): üretim kaynağı yazılmaz
    assert EST.meter_written(new, st) == "sensor.em_in"
    # the user already has a grid meter: kept as it is
    theirs = {"energy_sources": [{"type": "grid", "flow_from": [{"stat_energy_from": "sensor.mine"}], "flow_to": [], "cost_adjustment_day": 0}], "device_consumption": []}
    new2 = EST.build_prefs(theirs, {}, [], st)
    assert [f["stat_energy_from"] for f in new2["energy_sources"][0]["flow_from"]] == ["sensor.mine"] and EST.meter_written(new2, st) == ""
    # meter removed in the dashboard: ours goes away
    new3 = EST.build_prefs(new, {}, [], {"energy": {}}, None, "sensor.em_in")
    assert not [x for x in new3["energy_sources"] if x["type"] == "grid"]
    # old record with only "on": solar if a production sensor is set
    assert EST.solar_energy_entity({"energy": {"solar": {"on": True, "prod": "sensor.pv"}}}) == "sensor.lhd_solar_energy"


def test_shared_plug_rest():
    """A plug with two lights on it: the rest is the plug minus the lights; HA's settings list the rest, not the total."""
    ests = {"masa": {"name": "PC masası prizi", "kind": "meas", "sensor": "sensor.masa_w", "energy": "sensor.masa_kwh", "inside": ["led", "mon", "masa", "yok"], "rest": "Bilgisayar ve monitörler", "cat": "pc"},
            "led": {"name": "Şerit LED", "kind": "fixed", "w": 13, "cat": "isik"},
            "mon": {"name": "Monitör ışığı", "kind": "fixed", "w": 7, "cat": "isik"}}
    assert EST.inside_of("masa", ests["masa"], ests) == ["led", "mon"]          # itself and unknown ids dropped
    assert EST.owner_of("led", ests) == "masa" and EST.owner_of("masa", ests) is None
    S = {"sensor.masa_w": st("180", unit_of_measurement="W"), "sensor.lhd_led_power": st("13"), "sensor.lhd_mon_power": st("7")}
    assert EST.net_power("masa", ests["masa"], ests, S) == 160
    S["sensor.masa_w"] = st("10", unit_of_measurement="W")
    assert EST.net_power("masa", ests["masa"], ests, S) == 0                  # never below zero
    assert EST.member_power_entity("masa", ests["masa"], ests) == "sensor.lhd_masa_net_power"
    assert EST.member_power_entity("led", ests["led"], ests) == "sensor.lhd_led_power"
    prefs = {"energy_sources": [], "device_consumption": [{"stat_consumption": "sensor.masa_kwh"}]}
    out = EST.build_prefs(prefs, ests, [{"id": "pc", "name": "Bilgisayar"}, {"id": "isik", "name": "Işıklar"}], {})
    rows = {d["stat_consumption"]: d for d in out["device_consumption"]}
    assert "sensor.masa_kwh" not in rows                                      # the total would count the lights twice
    assert rows["sensor.lhd_masa_net_energy"]["name"] == "Bilgisayar ve monitörler"
    assert rows["sensor.lhd_masa_net_energy"]["included_in_stat"] == "sensor.lhd_kat_pc_energy"
    assert rows["sensor.lhd_led_energy"]["included_in_stat"] == "sensor.lhd_kat_isik_energy"
    # a plug that lists another shared plug: that one is not taken (no nesting)
    ests["ust"] = {"name": "Üst", "kind": "meas", "sensor": "sensor.ust_w", "inside": ["masa", "led"]}
    assert EST.inside_of("ust", ests["ust"], ests) == ["led"]


async def test_shared_plug_sensors(hass: HomeAssistant, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    hass.states.async_set("sensor.masa_w", "180", {"unit_of_measurement": "W", "device_class": "power"})
    hass.states.async_set("light.led", "on", {"brightness": 255})
    ws = await hass_ws_client(hass)
    cats = [{"id": "pc", "name": "Bilgisayar"}, {"id": "isik", "name": "Işıklar"}]
    est = {"masa": {"name": "PC masası prizi", "kind": "meas", "sensor": "sensor.masa_w", "inside": ["led"], "rest": "Bilgisayar ve monitörler", "cat": "pc"},
           "led": {"name": "Şerit LED", "kind": "light", "entity": "light.led", "idle": 0.5, "min": 2, "max": 20, "cat": "isik"}}
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "ecats", "value": cats})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/set", "key": "estimates", "value": est})
    r = await ws.receive_json(); assert r["success"], r
    await hass.async_block_till_done(); await hass.async_block_till_done()
    assert float(hass.states.get("sensor.lhd_led_power").state) == 20
    assert float(hass.states.get("sensor.lhd_masa_net_power").state) == 160
    assert hass.states.get("sensor.lhd_masa_net_power").name == "Bilgisayar ve monitörler güç"
    assert hass.states.get("sensor.lhd_masa_net_energy") is not None
    assert float(hass.states.get("sensor.lhd_kat_pc_power").state) == 160       # the rest, not the plug's 180
    assert float(hass.states.get("sensor.lhd_kat_isik_power").state) == 20
    hass.states.async_set("light.led", "on", {"brightness": 0})
    await hass.async_block_till_done(); await hass.async_block_till_done(); await hass.async_block_till_done()
    assert float(hass.states.get("sensor.lhd_masa_net_power").state) == 178
    # the plug no longer shared: its rest sensors go
    est["masa"].pop("inside")
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/set", "key": "estimates", "value": est})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_masa_net_power") is None
    assert float(hass.states.get("sensor.lhd_kat_pc_power").state) == 180
