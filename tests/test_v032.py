"""v0.32: saves checked against a per-key counter, changes sent in parts, the learning runs kept off the screens and
saved once a minute, kWh sensors written at most every ENERGY_WRITE_S, registry events synced once."""
from datetime import timedelta
from unittest.mock import patch

from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

import custom_components.lemur_home_dashboard as pkg
from custom_components.lemur_home_dashboard import sensor as SENSOR

DOMAIN = "lemur_home_dashboard"


async def _get(ws, i):
    await ws.send_json({"id": i, "type": f"{DOMAIN}/get"})
    return (await ws.receive_json())["result"]


async def test_get_has_counters_and_no_learning_runs(hass, hass_ws_client, setup_lhd):
    hass.data[DOMAIN].data["learn_avg"] = {"x": {"steps": [1, 2, 3]}}
    ws = await hass_ws_client(hass)
    d = await _get(ws, 1)
    assert "learn_avg" not in d and d["revs"] == {}


async def test_save_on_an_older_copy_is_turned_down(hass, hass_ws_client, setup_lhd):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 1}, "rev": 0})
    r = await ws.receive_json()
    assert r["success"] and r["result"]["revs"]["settings"] == 1 and "learn_avg" not in r["result"]
    await ws.send_json({"id": 2, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 2}, "rev": 0})   # made on the copy before
    r = await ws.receive_json()
    assert not r["success"] and r["error"]["code"] == "conflict"
    assert hass.data[DOMAIN].data["settings"] == {"a": 1}
    await ws.send_json({"id": 3, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 3}, "rev": 1})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 4, "type": f"{DOMAIN}/set", "key": "settings", "value": {"a": 4}})   # an older page: no counter, not checked
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 5, "type": f"{DOMAIN}/set", "key": "tabs", "value": [], "rev": 0})     # another key has its own counter
    assert (await ws.receive_json())["success"]


async def test_season_counts_as_a_settings_change(hass, hass_ws_client, setup_lhd):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": f"{DOMAIN}/season", "season": "winter"})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 2, "type": f"{DOMAIN}/set", "key": "settings", "value": {}, "rev": 0})   # would undo the season
    assert (await ws.receive_json())["error"]["code"] == "conflict"


async def test_changes_come_in_parts_when_asked(hass, hass_ws_client, setup_lhd):
    new, old = await hass_ws_client(hass), await hass_ws_client(hass)
    await new.send_json({"id": 1, "type": f"{DOMAIN}/subscribe", "parts": True})
    assert (await new.receive_json())["success"]
    await old.send_json({"id": 1, "type": f"{DOMAIN}/subscribe"})
    assert (await old.receive_json())["success"]
    await new.send_json({"id": 2, "type": f"{DOMAIN}/season", "season": "winter"})
    msgs = [await new.receive_json(), await new.receive_json()]
    ev = next(m for m in msgs if m["type"] == "event")["event"]
    assert set(ev) == {"__part", "revs"} and list(ev["__part"]) == ["settings"] and ev["__part"]["settings"]["season"] == "winter"
    assert ev["revs"]["settings"] == 1
    full = (await old.receive_json())["event"]            # a page that did not ask: everything, as before
    assert "tabs" in full and full["settings"]["season"] == "winter" and "learn_avg" not in full


async def test_pets_change_sends_the_feedings_too(hass, hass_ws_client, setup_lhd):
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": f"{DOMAIN}/subscribe", "parts": True})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 2, "type": f"{DOMAIN}/set", "key": "pets", "value": {"p": {"name": "P", "mode": "interval", "every_h": 8}}})
    msgs = [await ws.receive_json(), await ws.receive_json()]
    ev = next(m for m in msgs if m["type"] == "event")["event"]
    assert set(ev["__part"]) == {"pets", "feed"}


async def test_learning_steps_are_saved_once_a_minute(hass, setup_lhd, monkeypatch):
    d = hass.data[DOMAIN]
    monkeypatch.setattr(pkg, "LEARN_SAVE_S", 60.0)
    with patch.object(d.store, "async_delay_save") as save:
        d._save_learn({"a": {"phase": "", "i": 1}})          # a run appears: saved at once
        assert save.call_count == 1
        for i in range(2, 8):                                  # the steps that follow: kept in memory
            d._save_learn({"a": {"phase": "", "i": i}})
        assert save.call_count == 1 and d.data["learn_avg"]["a"]["i"] == 7
        d._learn_saved -= 61                                   # a minute later: saved
        d._save_learn({"a": {"phase": "", "i": 8}})
        assert save.call_count == 2
        d._save_learn({"a": {"phase": "done", "i": 9}})      # it finishes: saved at once
        assert save.call_count == 3
        d._save_learn({})                                      # saved and cleared: at once
        assert save.call_count == 4


async def _add_meas(hass, ws, i=1):
    await ws.send_json({"id": i, "type": f"{DOMAIN}/set", "key": "estimates", "value": {"priz": {"name": "Priz", "kind": "meas", "sensor": "sensor.priz_w"}}})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()


async def test_kwh_sensor_counts_every_change_but_writes_rarely(hass, hass_ws_client, setup_lhd, monkeypatch):
    hass.states.async_set("sensor.priz_w", "1000", {"unit_of_measurement": "W"})
    ws = await hass_ws_client(hass)
    await _add_meas(hass, ws)
    monkeypatch.setattr(SENSOR, "ENERGY_WRITE_S", 30.0)
    ent = next(e for e in hass.data["sensor"].entities if e.entity_id == "sensor.lhd_priz_energy")
    ent._ew_last = SENSOR.time.monotonic()                  # just written
    writes = []
    monkeypatch.setattr(ent, "async_write_ha_state", lambda: writes.append(1))
    start, base = ent._t, ent._kwh
    for n in range(1, 21):                                  # a plug reporting every second for 20 s
        with patch.object(SENSOR.dt_util, "utcnow", return_value=start + timedelta(seconds=n)):
            hass.states.async_set("sensor.priz_w", str(1000 + n), {"unit_of_measurement": "W"})
            await hass.async_block_till_done()
    assert writes == []                                     # nothing written within 30 s
    assert ent._kwh - base > 0.0054                         # but ~1 kW for 20 s was counted (0.0056 kWh)
    ent._ew_last -= 31                                      # half a minute later
    with patch.object(SENSOR.dt_util, "utcnow", return_value=start + timedelta(seconds=51)):
        hass.states.async_set("sensor.priz_w", "900", {"unit_of_measurement": "W"})
        await hass.async_block_till_done()
    assert len(writes) == 1


async def test_registry_events_end_in_one_sync(hass, hass_ws_client, setup_lhd, monkeypatch):
    from homeassistant.helpers import entity_registry as er
    hass.states.async_set("sensor.priz_w", "10", {"unit_of_measurement": "W"})
    ws = await hass_ws_client(hass)
    await _add_meas(hass, ws)
    monkeypatch.setattr(SENSOR, "REG_SYNC_S", 2.0)
    ent = next(e for e in hass.data["sensor"].entities if e.entity_id == "sensor.lhd_priz_energy")
    calls = []
    monkeypatch.setattr(ent, "async_est_changed", lambda: calls.append(1))
    reg = er.async_get(hass)
    for n in range(15):                                     # a device deleted with its entities, an integration reloading
        reg.async_get_or_create("sensor", "test", f"u{n}")
    await hass.async_block_till_done()
    assert calls == []
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=3))
    await hass.async_block_till_done()
    assert len(calls) == 1


# ---- v0.33: less work, fewer rows ----
async def test_estimates_list_is_kept_until_the_table_is_replaced(hass, setup_lhd):
    d = hass.data[DOMAIN]
    d.data["estimates"] = {"a": {"name": "A", "kind": "fixed", "w": 5}}
    one = d.estimates()
    assert d.estimates() is one                       # same table: not rebuilt
    d.data["estimates"] = {"a": {"name": "A", "kind": "fixed", "w": 5}, "b": {"name": "B", "kind": "fixed", "w": 7}}
    two = d.estimates()
    assert two is not one and set(two) == {"a", "b"}  # replaced: rebuilt
    d.data["estimates"]["c"] = {"name": "C", "kind": "fixed", "w": 1}
    assert set(d.estimates()) == {"a", "b", "c"}      # grown in place: rebuilt too


async def test_idle_kwh_sensor_is_not_written_every_minute(hass, setup_lhd, monkeypatch):
    from custom_components.lemur_home_dashboard import sensor as S

    class Fake(S._Integrating):
        def __init__(self):
            self._init_int()
            self.writes = 0
            self.w = 0.2

        def _watts(self):
            return self.w

        def async_write_ha_state(self):
            self.writes += 1

    f = Fake()
    f.hass = hass
    f._t = dt_util.utcnow()
    f._w = 0.2
    monkeypatch.setattr(S, "ENERGY_IDLE_S", 300.0)
    f._tick()
    assert f.writes == 1                              # the first tick writes
    for _ in range(3):                                # 0.2 W for three minutes: the 3rd decimal does not move
        f._t = dt_util.utcnow() - timedelta(seconds=60)
        f._tick()
    assert f.writes == 1
    assert f._kwh > 0                                  # still counted
    f._t = dt_util.utcnow() - timedelta(hours=6)       # 0.2 W for six hours: 0.0012 kWh, the shown value moved
    f._tick()
    assert f.writes == 2
    f._ew_last -= 301                                  # five minutes without a write: written even if unchanged
    f._tick()
    assert f.writes == 3
