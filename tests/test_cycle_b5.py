"""Appliance cycles, 0.36.0b5: what the first days in a real home showed (each test fails on 0.36.0b4).
Another small load on the plug during the drying, the door opened while it dries, a plug that goes away, the store
written every 30 seconds, an end wait longer than 25 minutes, Home Assistant down while the machine finishes."""
import copy
import json
import time
from unittest.mock import patch

import pytest
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.lemur_home_dashboard import cycle as C
from custom_components.lemur_home_dashboard import cycle_ha as CYH

from . import cycle_sim as S
from .test_cycle import REAL_END, T0, det, ev_of, noisy_real

DOMAIN = "lemur_home_dashboard"


def _extra(which, extra, on_min, pad_after=150):
    """A real cycle with the plug's noise and another load of `extra` W from the cycle's minute on_min on."""
    m, i0 = S.real(which, 90, pad_after)
    base = S.series(m, T0, seed=which)
    S.add(base, T0 + 20 * 60, 100, 40)                                        # purifier while idle
    S.add(base, T0 + (i0 + (60 if which == 1 else 58)) * 60, 90, 36)          # ... and while it dries
    S.add(base, T0 + (i0 + on_min) * 60, 10 * 3600, extra)
    return S.changes(base), i0


# ---- 1: another small load on the plug while it dries ----
@pytest.mark.parametrize("which", [1, 2])
@pytest.mark.parametrize("extra", [2.0, 3.0, 4.0])
@pytest.mark.parametrize("on_min", [-60, 30])
def test_tail_ends_with_another_load_on_the_plug(which, extra, on_min):
    """A lamp of 2-4 W on the same plug, on before the cycle (the baseline has not learned it yet) or from the middle
    of the wash: the plug never comes back to the baseline. "Bitti" came after the 60 minutes of tail_min, with the
    end 50 minutes late; now the step down from the drying's level ends it."""
    pts, i0 = _extra(which, extra, on_min)
    d = det()
    ev = S.feed(d, pts, until=pts[-1][0])
    dones = ev_of(ev, "done")
    assert len(dones) == 1 and len(ev_of(ev, "start")) == 1, ev
    info = dones[0][2]
    end = (info["end"] - T0) / 60 - i0
    found = (dones[0][0] - T0) / 60 - i0
    assert info["why"] == "tail_drop"
    assert REAL_END[which] - 1 <= end <= REAL_END[which] + 1, end
    assert found - REAL_END[which] <= 6, found
    if on_min > 0:   # (a lamp of 3 W or more that came on before the start still dates the start back too far: _back)
        assert abs(info["min"] - (55 if which == 1 else 61)) <= 2, info


def test_tail_max_reports_the_end_of_the_wash():
    """The lamp comes on right after the machine finished: the plug goes up and stays there, nothing steps down. After
    tail_min the cycle ends with the end of the wash as its end (it was the time of the decision: an hour late)."""
    pts, i0 = _extra(1, 4.0, REAL_END[1] + 1)
    d = det()
    ev = S.feed(d, pts, until=pts[-1][0])
    info = ev_of(ev, "done")[0][2]
    assert info["why"] == "tail_max"
    end = (info["end"] - T0) / 60 - i0
    assert 52 <= end <= REAL_END[1] + 1, end        # not after the real end
    assert info["min"] <= 56, info


def test_no_load_still_ends_the_same():
    """Without another load nothing changes: the end and the time it is found (the noisy real cycles of test_cycle)."""
    for which in (1, 2):
        pts, i0 = noisy_real(which)
        d = det()
        ev = S.feed(d, pts, until=pts[-1][0] + 600)
        info = ev_of(ev, "done")[0][2]
        assert abs((info["end"] - T0) / 60 - i0 - REAL_END[which]) <= 1 and info["why"] in ("tail", "tail_drop")


# ---- 3: gaps ----
def test_plug_gone_for_good_ends_after_max_h():
    """The power sensor goes unavailable in the middle of a cycle and never comes back: it was "running" for ever."""
    m, i0 = S.real(1, 60, 60)
    pts = S.changes(S.series(m, T0))
    cut = T0 + (i0 + 30) * 60
    d = det()
    ev = S.feed(d, [p for p in pts if p[0] < cut] + [(cut, None)], until=cut + 12 * 3600)
    dones = ev_of(ev, "done")
    assert len(dones) == 1 and dones[0][2]["why"] == "max", ev
    assert d.state == "done" and d.live(cut + 12 * 3600)["elapsed"] is None
    start = ev_of(ev, "start")[0][2]["start"]
    assert abs(dones[0][0] - (start + 5 * 3600)) <= 60          # found at max_h ...
    assert dones[0][2]["end"] <= cut                             # ... with its last known activity as the end
    # an idle plug that goes away stays idle
    d2 = det()
    assert not S.feed(d2, [(T0, 0.0), (T0 + 60, None)], until=T0 + 12 * 3600) and d2.state == "idle"


def test_short_gaps_are_bridged():
    """A plug that drops off the network for 30 seconds every 6 minutes (less than end_min): every gap started the end
    window again and the cycle ran until max_h. Short gaps no longer drop the windows."""
    m, i0 = S.real(1, 90, 400)
    pts, last, gap = [], object(), False
    for t, w in S.series(m, T0):
        if (t - T0) % 360 < 30:
            if not gap:
                pts.append((t, None))
                gap, last = True, object()
            continue
        gap = False
        if w != last:
            pts.append((t, w))
            last = w
    d = det()
    ev = S.feed(d, pts, until=pts[-1][0])
    dones = ev_of(ev, "done")
    assert len(dones) == 1 and len(ev_of(ev, "start")) == 1, ev
    info = dones[0][2]
    assert info["why"] != "max"
    assert abs((info["end"] - T0) / 60 - i0 - REAL_END[1]) <= 1.5, info
    assert (dones[0][0] - T0) / 60 - i0 - REAL_END[1] <= 7
    assert 0.65 <= info["kwh"] <= 0.80          # the gaps' energy is not counted (8 % of the time)
    assert d.rt["gaps"] >= 5


def test_gap_energy_and_long_gap():
    """A bridged gap counts no energy; a gap longer than GAP_S starts the windows again (as before)."""
    d = det(base=0.0)
    d.rt.update(state="running", phase="main", start=T0, wh=0.0, wh_all=0.0, cost=0.0)
    d.feed(T0, 300.0)
    d.feed(T0 + 60, 300.0)
    d.feed(T0 + 120, None)
    assert d.tick(T0 + 150) == [] and d.known is not None
    assert d.live(T0 + 170)["kwh"] == pytest.approx(300 * 120 / 3.6e6, abs=1e-3)   # nothing more during the gap
    d.feed(T0 + 180, 300.0)                      # back after 60 s: bridged
    d.feed(T0 + 240, 300.0)
    assert d.known == T0 and len(d.segs) == 4
    assert d.rt["wh"] == pytest.approx(300 * 180 / 3600, abs=0.5)                  # 120 s + 60 s, not the gap's 60 s
    d.feed(T0 + 300, None)
    d.tick(T0 + 300 + C.GAP_S + 30)               # too long: the windows are dropped
    assert d.known is None and not d.segs
    d.feed(T0 + 900, 5.0)
    assert d.known == T0 + 900


# ---- 5: an end wait longer than 25 minutes ----
@pytest.mark.parametrize("end_min", [30, 60])
def test_long_end_wait_keeps_its_readings(end_min):
    """end_min 30 (what "Geçmişten öner" can give) or 60: a 27-minute pause is one cycle. Only 25 minutes of readings
    were kept, so the mean "over end_min" saw nothing but the pause and ended the cycle in it."""
    pts, t = [(T0, 0.0)], T0 + 1800
    for k in range(90 * 6):
        pts.append((t, 150.0 + (k % 3)))
        t += 10
    pts.append((t, 0.0))
    t += 27 * 60
    for k in range(60 * 6):
        pts.append((t, 150.0 + (k % 3)))
        t += 10
    pts.append((t, 0.0))
    d = det("other", end_min=end_min)
    ev = S.feed(d, pts, until=t + 2 * 3600)
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "done")) == 1 and d.rt["count"] == 1, [(k, round((x - T0) / 60)) for x, k, _i in ev]
    assert abs(ev_of(ev, "done")[0][2]["end"] - t) <= 120


# ---- 6: Home Assistant down while the machine finishes ----
@pytest.mark.parametrize("down_min", [40, 76])
def test_restart_after_the_machine_finished(down_min):
    """Home Assistant stops in the heating (minute 45) and comes back after the machine finished. The end was the time
    the readings came back (duration 73 / 109 minutes for a 55-minute cycle) and went into the average. Now the end is
    the last activity that was seen and the average is left alone."""
    m, i0 = S.real(1, 90, 240)
    pts = S.changes(S.series(m, T0))
    cut = T0 + (i0 + 45) * 60
    d1 = det()
    d1.rt.update(count=3, avg_min=50.0)
    S.feed(d1, [p for p in pts if p[0] < cut])
    saved = json.loads(json.dumps(d1.rt))
    d2 = C.Detector(C.params({"kind": "dishwasher"}), saved)
    back = cut + down_min * 60
    rest = [(back, None), (back + 45, 0.0)] + [p for p in pts if p[0] >= back + 45]
    ev = S.feed(d2, rest, until=rest[-1][0])
    dones = ev_of(ev, "done")
    assert len(dones) == 1 and not ev_of(ev, "start")
    info = dones[0][2]
    assert info["end"] <= T0 + (i0 + REAL_END[1]) * 60 and abs(info["end"] - cut) <= 60, info   # not the return time
    assert d2.rt["count"] == 4 and d2.rt["avg_min"] == 50.0
    # the next cycle is seen whole again: it counts for the average
    later = [(t + 6 * 3600, w) for t, w in pts]
    ev = S.feed(d2, later, until=later[-1][0])
    assert len(ev_of(ev, "done")) == 1 and d2.rt["count"] == 5 and not d2.rt.get("blind") and d2.rt["avg_min"] > 50.0


def test_short_restart_is_not_blind():
    """A restart of 3 minutes in the heating: the machine is seen active again, the end is the real one."""
    m, i0 = S.real(1, 90, 240)
    pts = S.changes(S.series(m, T0))
    cut = T0 + (i0 + 45) * 60
    d1 = det()
    S.feed(d1, [p for p in pts if p[0] < cut])
    d2 = C.Detector(C.params({"kind": "dishwasher"}), json.loads(json.dumps(d1.rt)))
    ev = S.feed(d2, [p for p in pts if p[0] >= cut + 180], until=pts[-1][0])
    info = ev_of(ev, "done")[0][2]
    assert abs((info["end"] - T0) / 60 - i0 - REAL_END[1]) <= 1 and not d2.rt.get("blind")


# ---- Home Assistant ----
REC = {"name": "Bulaşık makinesi", "kind": "meas", "sensor": "sensor.bulasik_power",
       "cycle": {"on": True, "kind": "dishwasher", "door": "binary_sensor.bulasik_kapi",
                 "notify": {"on": True, "targets": ["notify.telefon"], "remind_h": 2}}}


async def _setup(hass, hass_ws_client):
    await async_setup_component(hass, "http", {})
    calls = []

    async def legacy(call):
        calls.append(call.data["message"])

    hass.services.async_register("notify", "telefon", legacy)
    hass.states.async_set("sensor.bulasik_power", "0", {"unit_of_measurement": "W"})
    hass.states.async_set("binary_sensor.bulasik_kapi", "off")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": f"{DOMAIN}/set", "key": "estimates", "value": {"bul": copy.deepcopy(REC)}})
    r = await ws.receive_json()
    assert r["success"], r
    await hass.async_block_till_done()
    return calls, hass.data[DOMAIN].cycles.trackers["bul"]


async def _run(hass, tr, in_tail=None, resume=False):
    """The real cycle 1 through the tracker; in_tail() is called once, two minutes into the drying."""
    m, i0 = S.real(1, 90, 90)
    if resume:   # the machine goes on with a second heating after 12 minutes of drying
        m = m[:i0 + 66] + m[i0 + 36:i0 + 53] + m[i0 + 53:]
    pts = S.changes(S.series(m, time.time() - 6 * 3600))
    d = tr.det
    d.segs.clear()
    d.known = None
    nxt = pts[0][0] + 30
    called = False
    for t, w in pts:
        while nxt < t:
            tr.tick(nxt)
            nxt += 30
        tr.handle(d.feed(t, w))
        if in_tail and not called and d.rt.get("phase") == "tail" and t > d.rt["tail_since"] + 120:
            called = True
            await in_tail()
    for k in range(40):
        tr.tick(pts[-1][0] + 30 * (k + 1))
    await hass.async_block_till_done()
    assert called or not in_tail


@pytest.mark.parametrize("how", ["door", "button"])
async def test_emptied_while_it_dries(hass: HomeAssistant, hass_ws_client, setup_lhd, how):
    """The wash is over, the machine still dries (the tail, "running"): the door opens and stays open (or Boşaltıldı is
    pressed). "Bitti" stayed for ever and the reminder came for an emptied machine. Now it counts as emptied when the
    cycle ends: the message is sent once, the state goes to idle, no reminder."""
    calls, tr = await _setup(hass, hass_ws_client)

    async def act():
        assert hass.states.get("sensor.lhd_bul_cycle").state == "running"
        if how == "door":
            hass.states.async_set("binary_sensor.bulasik_kapi", "on")
        else:
            await hass.services.async_call("button", "press", {"entity_id": "button.lhd_bul_emptied"}, blocking=True)
        await hass.async_block_till_done()
        assert tr.det.state == "running" and tr.det.rt["emptied"] == how

    await _run(hass, tr, act)
    s = hass.states.get("sensor.lhd_bul_cycle")
    assert s.state == "idle" and s.attributes["cycle_count"] == 1 and s.attributes["duration"] > 45, s
    assert tr.det.rt["cleared"] == how and "emptied" not in tr.det.rt
    assert len(calls) == 1 and "bitti" in calls[0]
    tr.tick(tr.det.rt["finished"] + 2 * 3600 + 60)
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_door_in_a_pause_is_not_emptied(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """The door opened in what looked like the drying, then the machine went on heating (resume): not emptied."""
    calls, tr = await _setup(hass, hass_ws_client)

    async def act():
        hass.states.async_set("binary_sensor.bulasik_kapi", "on")
        await hass.async_block_till_done()
        hass.states.async_set("binary_sensor.bulasik_kapi", "off")
        await hass.async_block_till_done()
        assert tr.det.rt["emptied"] == "door"

    await _run(hass, tr, act, resume=True)
    assert hass.states.get("sensor.lhd_bul_cycle").state == "done" and "emptied" not in tr.det.rt
    assert tr.det.rt["count"] == 1 and len(calls) == 1
    # and the door after the finish still clears it
    hass.states.async_set("binary_sensor.bulasik_kapi", "on")
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle").state == "idle"


async def test_store_is_not_written_for_idle_readings(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """An idle plug that flickers between 0 and 2.6 W every 2 seconds: the whole store was saved every 30 seconds
    (2880 times a day). Idle readings save nothing; a running cycle saves every SAVE_S; a decision at once; what the
    readings changed is written when Home Assistant stops."""
    calls, tr = await _setup(hass, hass_ws_client)
    await hass.async_block_till_done()
    mgr = hass.data[DOMAIN].cycles
    store = hass.data[DOMAIN].store
    n = []
    real = store.async_delay_save

    def count(fn, delay=0):
        n.append(delay)
        return real(fn, delay)

    with patch.object(store, "async_delay_save", side_effect=count):
        for sec in range(0, 600, 2):
            hass.states.async_set("sensor.bulasik_power", "2.6" if (sec // 2) % 2 else "0", {"unit_of_measurement": "W"})
            await hass.async_block_till_done()
            if sec % 30 == 28:
                mgr._tick()
        assert tr.det.state == "idle" and len(n) == 0, n
        assert mgr._dirty
        # running: at most one save per SAVE_S for the readings
        tr.det.rt.update(state="running", phase="main", start=time.time() - 600, wh=100.0, wh_all=100.0, cost=0.0, hi_t=time.time())
        clock = [time.monotonic()]
        with patch.object(CYH.time, "monotonic", side_effect=lambda: clock[0]):
            mgr._saved = clock[0]
            for k in range(40):   # 20 minutes of ticks, the plug reading 1700 W
                hass.states.async_set("sensor.bulasik_power", str(1700 + k), {"unit_of_measurement": "W"})
                await hass.async_block_till_done()
                clock[0] += 30
                mgr._tick()
        assert 3 <= len(n) <= 4, n
        # a decision is saved at once
        tr.det.rt.update(state="done", finished=time.time(), detected=time.time())
        before = len(n)
        assert mgr.press("bul") and len(n) == before + 1
        # Home Assistant stops: the readings since the last save are written with the final write
        hass.states.async_set("sensor.bulasik_power", "3", {"unit_of_measurement": "W"})
        await hass.async_block_till_done()
        assert mgr._dirty
        before = len(n)
        hass.bus.async_fire(EVENT_HOMEASSISTANT_STOP)
        await hass.async_block_till_done()
        assert len(n) == before + 1 and not mgr._dirty


async def test_reload_still_keeps_the_idle_baseline(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """Unload saves the store: the baseline learned from idle readings (never saved by itself now) survives a reload."""
    calls, tr = await _setup(hass, hass_ws_client)
    tr.det.rt["ring"] = [1.5] * 20
    tr.det.rt["base"] = 1.5
    assert await hass.config_entries.async_reload(setup_lhd.entry_id)
    await hass.async_block_till_done()
    tr2 = hass.data[DOMAIN].cycles.trackers["bul"]
    assert tr2 is not tr and tr2.det.rt["base"] == 1.5 and len(tr2.det.rt["ring"]) >= 20
