"""agentC: real-life simulations of the energy part (import, sync, sensors). Each test asserts the EXPECTED behaviour."""
from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.lemur_home_dashboard import estimates as EST  # noqa: F401  (import before patching)

DOMAIN = "lemur_home_dashboard"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    yield


async def _energy(hass):
    await async_setup_component(hass, "http", {})
    assert await async_setup_component(hass, "energy", {})
    from homeassistant.components.energy.data import async_get_manager
    return await async_get_manager(hass)


def _pc(hass, eid, data, power=None, energy=None, pw="20", kwh="1.0", unique_id=None, title=None, extra=()):
    reg = er.async_get(hass)
    e = MockConfigEntry(domain="powercalc", entry_id=eid, data=data, title=title or data.get("name", eid), unique_id=unique_id)
    e.add_to_hass(hass)
    for ent, dc, unit, val in ((power, "power", "W", pw), (energy, "energy", "kWh", kwh), *extra):
        if ent:
            reg.async_get_or_create("sensor", "powercalc", ent + "_uid", suggested_object_id=ent.split(".")[1], config_entry=e, original_device_class=dc)
            hass.states.async_set(ent, val, {"unit_of_measurement": unit, "device_class": dc})
    return e


async def _ws(ws, i, **kw):
    await ws.send_json({"id": i, **kw})
    return await ws.receive_json()


def _ent(hass, eid):
    return [x for x in hass.data["sensor"].entities if x.entity_id == eid][0]


# ---------------- 1. import ----------------

async def test_import_realistic(hass: HomeAssistant, hass_ws_client, setup_lhd, caplog):
    mgr = await _energy(hass)
    hass.states.async_set("light.hue", "on", {"brightness": 255})
    hass.states.async_set("light.tavan", "off", {})
    hass.states.async_set("media_player.tv", "idle", {})
    hass.states.async_set("sensor.plug_power", "60", {"unit_of_measurement": "W", "device_class": "power", "friendly_name": "Çamaşır Makinesi"})
    hass.states.async_set("sensor.plug_energy", "123.4", {"unit_of_measurement": "kWh", "device_class": "energy"})
    # global configuration entry of powercalc (GUI): not a device
    _pc(hass, "glob", {"power_sensor_naming": "{} power", "create_energy_sensors": True}, unique_id="powercalc_global_configuration", title="Global Configuration")
    # LUT (library) light, no mode in data
    _pc(hass, "lut", {"entity_id": "light.hue", "name": "Hue Çalışma", "manufacturer": "signify", "model": "LCT015"}, "sensor.hue_power", "sensor.hue_energy", pw="9.4")
    _pc(hass, "lin", {"entity_id": "light.tavan", "name": "Salon Tavan", "mode": "linear", "linear": {"min_power": 2, "max_power": 46}, "standby_power": 0.4}, "sensor.tavan_power", "sensor.tavan_kwh_renamed", pw="0.4")
    # media player: on-power 20 for any other on state, plus states
    _pc(hass, "tv", {"entity_id": "media_player.tv", "name": "Salon TV", "mode": "fixed", "fixed": {"power": 20, "states_power": {"playing": 95, "paused": 70}}, "standby_power": 0.5}, "sensor.tv_power", "sensor.tv_energy", pw="20")
    # daily energy: 100 W for 2 h a day = 8.33 W average
    _pc(hass, "daily", {"sensor_type": "daily_energy", "name": "Akvaryum Isıtıcı", "daily_fixed_energy": {"value": 100, "unit_of_measurement": "W", "on_time": {"hours": 2, "minutes": 0, "seconds": 0}}}, None, "sensor.akvaryum_energy")
    _pc(hass, "real", {"sensor_type": "real_power", "name": "Klima", "entity_id": "sensor.klima_w"}, None, "sensor.klima_energy")
    hass.states.async_set("sensor.klima_w", "800", {"unit_of_measurement": "W", "device_class": "power"})
    # cost sensor entry (powercalc >= 1.17)
    _pc(hass, "cost", {"sensor_type": "cost", "name": "TV maliyet", "energy_sensor_id": "sensor.tv_energy", "energy_price": 2.5})
    _pc(hass, "g1", {"sensor_type": "group", "name": "Enerji Işıklar", "group_member_sensors": ["lut", "lin"]}, "sensor.g_isik_power", "sensor.g_isik_energy")
    _pc(hass, "g2", {"sensor_type": "group", "name": "Enerji Medya", "group_member_sensors": ["tv"], "group_power_entities": ["sensor.plug_power"]}, "sensor.g_medya_power", "sensor.g_medya_energy")
    _pc(hass, "g3", {"sensor_type": "group", "name": "Toplam", "sub_groups": ["g1", "g2"]}, "sensor.total_power", "sensor.total_energy")
    # the user already has a manual category named like the group, and a device with same name as one entry
    d = hass.data[DOMAIN]
    d.data["ecats"] = [{"id": "isiklar", "name": "Işıklar"}]
    d.data["estimates"] = {"modem": {"name": "Salon TV", "kind": "fixed", "w": 9}}
    await mgr.async_update({"energy_sources": [{"type": "grid", "flow_from": [{"stat_energy_from": "sensor.grid_in"}], "flow_to": [], "cost_adjustment_day": 0}],
                            "device_consumption": [
        {"stat_consumption": "sensor.total_energy", "name": "Ev"},
        {"stat_consumption": "sensor.g_isik_energy", "name": "Işıklar", "included_in_stat": "sensor.total_energy"},
        {"stat_consumption": "sensor.g_medya_energy", "name": "Medya", "included_in_stat": "sensor.total_energy"},
        {"stat_consumption": "sensor.hue_energy", "name": "Hue (özel ad)", "included_in_stat": "sensor.g_isik_energy"},
        {"stat_consumption": "sensor.tavan_kwh_renamed", "included_in_stat": "sensor.g_isik_energy"},
        {"stat_consumption": "sensor.tv_energy", "included_in_stat": "sensor.g_medya_energy"},
        {"stat_consumption": "sensor.plug_energy", "name": "Çamaşır", "included_in_stat": "sensor.g_medya_energy"},
        {"stat_consumption": "sensor.unrelated_energy", "name": "Fırın"}]})
    ws = await hass_ws_client(hass)
    r = await _ws(ws, 1, type="lemur_home_dashboard/energy_import", apply=True)
    assert r["success"], r
    await hass.async_block_till_done()
    ests = d.estimates()
    names = sorted(v["name"] for v in ests.values())
    problems = []
    if any("Global" in n or "maliyet" in n for n in names):
        problems.append(f"bogus devices imported: {names}")
    cats = d.ecats()
    if [c["name"] for c in cats].count("Işıklar") > 1:
        problems.append(f"duplicate category: {cats}")
    ak = [v for v in ests.values() if v["name"] == "Akvaryum Isıtıcı"]
    if ak and abs(ak[0].get("w", 0) - 100 * 2 / 24) > 0.1:
        problems.append(f"daily W with on_time: {ak[0]}")
    tv = [v for v in ests.values() if v.get("entity") == "media_player.tv"]
    if tv:
        from custom_components.lemur_home_dashboard import estimates as EST
        if EST.power(tv[0], hass.states.get("media_player.tv")) != 20:
            problems.append(f"tv idle with fixed.power 20 -> {EST.power(tv[0], hass.states.get('media_player.tv'))} ({tv[0]})")
    stats = [x["stat_consumption"] for x in mgr.data["device_consumption"]]
    if "sensor.plug_energy" in stats and any(v.get("sensor") == "sensor.plug_power" and not v.get("energy") for v in ests.values()):
        problems.append(f"plug counted twice: own row kept + lhd energy: {stats}")
    for st in ("sensor.total_energy", "sensor.g_isik_energy", "sensor.hue_energy", "sensor.tavan_kwh_renamed", "sensor.tv_energy"):
        if st in stats:
            problems.append(f"powercalc stat left: {st}")
    if "sensor.unrelated_energy" not in stats:
        problems.append("unrelated dropped")
    if not any(s["type"] == "grid" for s in mgr.data["energy_sources"]):
        problems.append("grid lost")
    rows = {x["stat_consumption"]: x for x in mgr.data["device_consumption"]}
    for x in mgr.data["device_consumption"]:
        p = x.get("included_in_stat")
        if p and p not in rows:
            problems.append(f"dangling parent {x}")
    hue = [k for k, v in ests.items() if v.get("entity") == "light.hue"]
    if hue and rows.get(f"sensor.lhd_{hue[0]}_energy", {}).get("name") != "Hue (özel ad)":
        problems.append("custom prefs name not kept")
    # re-import (apply) must not add anything
    n_est, n_cat = len(d.estimates()), len(d.ecats())
    r = await _ws(ws, 2, type="lemur_home_dashboard/energy_import", apply=True)
    assert r["success"], r
    if len(d.estimates()) != n_est or len(d.ecats()) != n_cat:
        problems.append(f"re-import added: est {n_est}->{len(d.estimates())} cats {n_cat}->{len(d.ecats())} {d.ecats()}")
    errs = [r.message for r in caplog.records if r.levelname in ("ERROR", "WARNING") and "lemur" in r.name]
    if errs:
        problems.append(f"log: {errs}")
    assert not problems, "\n".join(problems)


# ---------------- 2. sync ----------------
async def _set(ws, i, key, value):
    r = await _ws(ws, i, type="lemur_home_dashboard/set", key=key, value=value)
    assert r["success"], r



async def test_sync_removing_last_device_cleans_prefs(hass, hass_ws_client, setup_lhd):
    mgr = await _energy(hass)
    ws = await hass_ws_client(hass)
    d = hass.data[DOMAIN]
    await _set(ws, 1, "estimates", {"modem": {"name": "Modem", "kind": "fixed", "w": 9}})
    assert await d.async_sync_prefs()
    assert [x["stat_consumption"] for x in mgr.data["device_consumption"]] == ["sensor.lhd_modem_energy"]
    await _set(ws, 2, "estimates", {})
    await d.async_sync_prefs()
    assert [x["stat_consumption"] for x in mgr.data["device_consumption"]] == [], mgr.data["device_consumption"]



async def test_sync_removed_meas_device_with_own_kwh(hass, hass_ws_client, setup_lhd):
    mgr = await _energy(hass)
    ws = await hass_ws_client(hass)
    d = hass.data[DOMAIN]
    hass.states.async_set("sensor.p_w", "40", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.p_kwh", "4", {"unit_of_measurement": "kWh"})
    await _set(ws, 1, "ecats", [{"id": "mutfak", "name": "Mutfak"}])
    await _set(ws, 2, "estimates", {"p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh", "cat": "mutfak"},
                                    "f": {"name": "Fırın", "kind": "fixed", "w": 1, "cat": "mutfak"}})
    assert await d.async_sync_prefs()
    await _set(ws, 3, "estimates", {"f": {"name": "Fırın", "kind": "fixed", "w": 1, "cat": "mutfak"}})
    await d.async_sync_prefs()
    rows = {x["stat_consumption"]: x for x in mgr.data["device_consumption"]}
    assert "sensor.p_kwh" not in rows or "included_in_stat" not in rows["sensor.p_kwh"], rows


async def test_sync_off_and_debounce(hass, hass_ws_client, setup_lhd):
    mgr = await _energy(hass)
    await mgr.async_update({"energy_sources": [], "device_consumption": [{"stat_consumption": "sensor.x"}]})
    ws = await hass_ws_client(hass)
    d = hass.data[DOMAIN]
    calls = []
    orig = mgr.async_update

    async def spy(u):
        calls.append(u)
        await orig(u)
    with patch.object(mgr, "async_update", spy):
        await _set(ws, 1, "settings", {"energy": {"sync": False}})
        await _set(ws, 2, "estimates", {"a": {"name": "A", "kind": "fixed", "w": 1}})
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
        await hass.async_block_till_done()
        assert calls == []
        await _set(ws, 3, "settings", {"energy": {"sync": True}})
        for i in range(5):
            await _set(ws, 10 + i, "estimates", {"a": {"name": f"A{i}", "kind": "fixed", "w": 1}})
        async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
        await hass.async_block_till_done()
        assert len(calls) == 1
        assert calls[0]["device_consumption"][0]["name"] == "A4"



async def test_solar_sources(hass, hass_ws_client, setup_lhd):
    mgr = await _energy(hass)
    ws = await hass_ws_client(hass)
    d = hass.data[DOMAIN]
    hass.states.async_set("sensor.inv_kw", "1.5", {"unit_of_measurement": "kW", "device_class": "power"})
    await mgr.async_update({"energy_sources": [
        {"type": "grid", "flow_from": [], "flow_to": [], "cost_adjustment_day": 0},
        {"type": "solar", "stat_energy_from": "sensor.inv_a", "config_entry_solar_forecast": ["fc1"]}], "device_consumption": []})
    problems = []
    await _set(ws, 1, "settings", {"energy": {"solar": {"on": True, "prod": "sensor.inv_kw", "prod_energy": "sensor.inv_a"}}})
    await d.async_sync_prefs()
    sol = [s for s in mgr.data["energy_sources"] if s["type"] == "solar"]
    if sol[0].get("config_entry_solar_forecast") != ["fc1"]:
        problems.append(f"forecast lost: {sol}")
    await _set(ws, 2, "settings", {"energy": {"solar": {"on": True, "prod": "sensor.inv_kw", "prod_energy": "sensor.inv_b"}}})
    await d.async_sync_prefs()
    sol = [s["stat_energy_from"] for s in mgr.data["energy_sources"] if s["type"] == "solar"]
    if sol != ["sensor.inv_b"]:
        problems.append(f"prod_energy changed A->B: {sol}")
    await _set(ws, 3, "settings", {"energy": {"solar": {"on": True, "prod": "sensor.inv_kw"}}})
    await hass.async_block_till_done()
    se = _ent(hass, "sensor.lhd_solar_energy")
    se._t = dt_util.utcnow() - timedelta(hours=1)
    se._tick()
    if abs(se._kwh - 1.5) > 0.01:
        problems.append(f"kW solar integration {se._kwh}")
    await _set(ws, 4, "settings", {"energy": {"solar": {"on": False, "prod": "sensor.inv_kw"}}})
    await hass.async_block_till_done()
    r = await d.async_sync_prefs()
    sol = [s["stat_energy_from"] for s in mgr.data["energy_sources"] if s["type"] == "solar"]
    if hass.states.get("sensor.lhd_solar_energy") is not None or "sensor.lhd_solar_energy" in sol:
        problems.append(f"solar off (no devices): sync={r} sources={sol} state={hass.states.get('sensor.lhd_solar_energy')}")
    assert not problems, "\n".join(problems)


# ---------------- 3. sensors ----------------
async def test_reload_no_double_count(hass, hass_ws_client, setup_lhd):
    await _energy(hass)
    ws = await hass_ws_client(hass)
    await _set(ws, 1, "ecats", [{"id": "k", "name": "K"}])
    await _set(ws, 2, "estimates", {"a": {"name": "A", "kind": "fixed", "w": 1000, "cat": "k"}})
    await hass.async_block_till_done()
    a = _ent(hass, "sensor.lhd_a_energy")
    a._t = dt_util.utcnow() - timedelta(hours=2)
    a._tick()
    await hass.async_block_till_done(); await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_a_energy").state) - 2) < 0.01
    assert abs(float(hass.states.get("sensor.lhd_kat_k_energy").state) - 2) < 0.01
    await hass.data[DOMAIN].store.async_save(hass.data[DOMAIN].data)   # the delayed save, as on a real stop
    assert await hass.config_entries.async_reload(setup_lhd.entry_id)
    await hass.async_block_till_done(); await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_a_energy").state) - 2) < 0.01
    assert abs(float(hass.states.get("sensor.lhd_kat_k_energy").state) - 2) < 0.01
    a = _ent(hass, "sensor.lhd_a_energy")
    a._t = dt_util.utcnow() - timedelta(hours=1)
    a._tick()
    await hass.async_block_till_done(); await hass.async_block_till_done()
    assert abs(float(hass.states.get("sensor.lhd_kat_k_energy").state) - 3) < 0.01



async def test_category_member_glitches(hass, hass_ws_client, setup_lhd):
    await _energy(hass)
    ws = await hass_ws_client(hass)
    U = {"unit_of_measurement": "kWh"}
    hass.states.async_set("sensor.p_w", "40", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.p_kwh", "30.0", U)
    await _set(ws, 1, "ecats", [{"id": "k", "name": "K"}])
    await _set(ws, 2, "estimates", {"p": {"name": "Priz", "kind": "meas", "sensor": "sensor.p_w", "energy": "sensor.p_kwh", "cat": "k"}})
    await hass.async_block_till_done()
    cat = lambda: float(hass.states.get("sensor.lhd_kat_k_energy").state)
    for v in ("30.5", "unavailable", "30.6"):
        hass.states.async_set("sensor.p_kwh", v, U); await hass.async_block_till_done()
    assert abs(cat() - 0.6) < 1e-6
    # plug reboots and reports 0 for a moment, then its real lifetime counter again
    hass.states.async_set("sensor.p_kwh", "0", U); await hass.async_block_till_done()
    hass.states.async_set("sensor.p_kwh", "30.7", U); await hass.async_block_till_done()
    assert abs(cat() - 0.7) < 1e-6, cat()



async def test_meas_spike_and_kw(hass, hass_ws_client, setup_lhd):
    await _energy(hass)
    ws = await hass_ws_client(hass)
    hass.states.async_set("sensor.k_kw", "1.2", {"unit_of_measurement": "kW"})
    await _set(ws, 1, "estimates", {"k": {"name": "Klima", "kind": "meas", "sensor": "sensor.k_kw"}})
    await hass.async_block_till_done()
    e = _ent(hass, "sensor.lhd_k_energy")
    e._t = dt_util.utcnow() - timedelta(hours=1)
    hass.states.async_set("sensor.k_kw", "1.0", {"unit_of_measurement": "kW"}); await hass.async_block_till_done()
    assert abs(e._kwh - 1.2) < 0.01
    # a glitch: one minute of a crazy reading
    hass.states.async_set("sensor.k_kw", "inf", {"unit_of_measurement": "kW"}); await hass.async_block_till_done()
    e._t = dt_util.utcnow() - timedelta(minutes=1)
    hass.states.async_set("sensor.k_kw", "1.0", {"unit_of_measurement": "kW"}); await hass.async_block_till_done()
    assert e._kwh == e._kwh and e._kwh < 10, e._kwh



async def test_solar_off_removes_source(hass, hass_ws_client, setup_lhd):
    mgr = await _energy(hass)
    ws = await hass_ws_client(hass)
    d = hass.data[DOMAIN]
    hass.states.async_set("sensor.inv_w", "500", {"unit_of_measurement": "W"})
    await _set(ws, 1, "settings", {"energy": {"solar": {"on": True, "prod": "sensor.inv_w"}}})
    assert await d.async_sync_prefs()
    assert [s["stat_energy_from"] for s in mgr.data["energy_sources"]] == ["sensor.lhd_solar_energy"]
    await _set(ws, 2, "settings", {"energy": {"solar": {"on": False, "prod": "sensor.inv_w"}}})
    await d.async_sync_prefs()
    assert mgr.data["energy_sources"] == [], mgr.data["energy_sources"]


async def test_category_members_added_removed(hass, hass_ws_client, setup_lhd):
    await _energy(hass)
    ws = await hass_ws_client(hass)
    U = {"unit_of_measurement": "kWh"}
    for n, v in (("a", "100"), ("b", "2000")):
        hass.states.async_set(f"sensor.{n}_w", "40", {"unit_of_measurement": "W"})
        hass.states.async_set(f"sensor.{n}_kwh", v, U)
    await _set(ws, 1, "ecats", [{"id": "k", "name": "K"}])
    A = {"name": "A", "kind": "meas", "sensor": "sensor.a_w", "energy": "sensor.a_kwh", "cat": "k"}
    B = {"name": "B", "kind": "meas", "sensor": "sensor.b_w", "energy": "sensor.b_kwh", "cat": "k"}
    await _set(ws, 2, "estimates", {"a": A})
    await hass.async_block_till_done()
    cat = lambda: float(hass.states.get("sensor.lhd_kat_k_energy").state)
    hass.states.async_set("sensor.a_kwh", "101", U); await hass.async_block_till_done()
    await _set(ws, 3, "estimates", {"a": A, "b": B}); await hass.async_block_till_done()
    hass.states.async_set("sensor.b_kwh", "2001", U); await hass.async_block_till_done()
    assert abs(cat() - 2) < 1e-6, cat()
    await _set(ws, 4, "estimates", {"b": B}); await hass.async_block_till_done()
    hass.states.async_set("sensor.a_kwh", "150", U); await hass.async_block_till_done()
    assert abs(cat() - 2) < 1e-6, cat()
    await _set(ws, 5, "estimates", {"a": A, "b": B}); await hass.async_block_till_done()
    hass.states.async_set("sensor.a_kwh", "151", U); await hass.async_block_till_done()
    assert abs(cat() - 3) < 1e-6, cat()



async def test_meas_huge_spike(hass, hass_ws_client, setup_lhd):
    await _energy(hass)
    ws = await hass_ws_client(hass)
    hass.states.async_set("sensor.k_w", "100", {"unit_of_measurement": "W"})
    await _set(ws, 1, "estimates", {"k": {"name": "Klima", "kind": "meas", "sensor": "sensor.k_w"}})
    await hass.async_block_till_done()
    e = _ent(hass, "sensor.lhd_k_energy")
    hass.states.async_set("sensor.k_w", "4000000", {"unit_of_measurement": "W"}); await hass.async_block_till_done()
    e._t = dt_util.utcnow() - timedelta(minutes=1)
    hass.states.async_set("sensor.k_w", "100", {"unit_of_measurement": "W"}); await hass.async_block_till_done()
    assert e._kwh < 1, e._kwh
