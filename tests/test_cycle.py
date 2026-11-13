"""Appliance cycles (cycle.py, cycle_ha.py): the detector on the owner's real dishwasher with the noise of its plug,
synthetic washers and dryers, the state machine around it, the entities, notifications, schema and backups."""
import copy
import json
import pathlib
import random
import time
from unittest.mock import patch

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.lemur_home_dashboard import cycle as C
from custom_components.lemur_home_dashboard import estimates as EST
from custom_components.lemur_home_dashboard import safety as SF

from . import cycle_sim as S

DOMAIN = "lemur_home_dashboard"
T0 = 1_790_000_000.0   # a real-looking time (nothing may treat 0 as "missing")


def ev_of(ev, kind):
    return [x for x in ev if x[1] == kind]


def noisy_real(which, seed=5, pad_before=90, pad_after=90, t0=T0):
    """A real cycle, as the plug reports it, with the noise of that plug: purifier bursts while idle, in the drain dip
    and right at the end of the heating, single false readings of 1714 W while idle and during the cycle."""
    m, i0 = S.real(which, pad_before, pad_after)
    base = S.series(m, t0, seed=which)
    rng = random.Random(seed)
    S.add(base, t0 + 20 * 60, 100, 40, rng)                                  # purifier while idle
    S.add(base, t0 + (i0 + (31 if which == 1 else 10)) * 60 + 50, 100, 38, rng)   # ... in the drain dip / pause
    S.add(base, t0 + (i0 + (53 if which == 1 else 50)) * 60 + 20, 110, 42, rng)   # ... right at the end of the heating
    S.add(base, t0 + (i0 + (60 if which == 1 else 58)) * 60, 90, 36, rng)          # ... while it dries
    for t in (10 * 60, (i0 + 40) * 60 + 7, (i0 + 58) * 60 + 3, (i0 + 100) * 60, (i0 + 120) * 60):
        S.spike(base, t0 + t)
    return S.changes(base), i0


REAL_END = {1: 71, 2: 66}     # the minute (from the cycle's first minute) the machine went back to 0 W
REAL_START = {1: 16, 2: 5}


def det(kind="dishwasher", base=0.0, **over):
    cfg = dict(kind=kind, **over)
    return C.Detector(C.params(cfg), {"base": base} if base is not None else {})


# ---- the real dishwasher ----
@pytest.mark.parametrize("which", [1, 2])
def test_real_cycles_with_noise(which):
    pts, i0 = noisy_real(which)
    d = det()
    ev = S.feed(d, pts, until=pts[-1][0] + 600)
    starts, dones = ev_of(ev, "start"), ev_of(ev, "done")
    assert len(starts) == 1 and len(dones) == 1 and not ev_of(ev, "short"), ev
    st = (starts[0][2]["start"] - T0) / 60 - i0
    assert abs(st - REAL_START[which]) <= 1, st                                # dated back to the pre-wash fill
    info = dones[0][2]
    end = (info["end"] - T0) / 60 - i0
    assert REAL_END[which] - 1 <= end <= REAL_END[which] + 1, end             # after the drying and the last drain
    found = (dones[0][0] - T0) / 60 - i0
    assert found - REAL_END[which] <= 6, found                                 # "Bitti" a few minutes late
    assert abs(info["kwh"] - 0.79) <= 0.03, info
    assert d.state == "done" and d.rt["count"] == 1
    assert d.rt.get("spikes", 0) >= 1                                          # the false readings were seen as such


def test_real_cycle_without_drying_wait():
    """tail off: finished 8 minutes after the last heating, during the drying (the owner's other choice)."""
    pts, i0 = noisy_real(1)
    d = det(tail=False)
    ev = S.feed(d, pts, until=pts[-1][0] + 600)
    dones = ev_of(ev, "done")
    assert len(dones) == 1
    end = (dones[0][2]["end"] - T0) / 60 - i0
    assert 52 <= end <= 62, end   # the last minute above baseline + 20 W: here a purifier burst at minute 60


def test_idle_noise_never_starts():
    """Two days of the plug idle: flicker, purifier bursts every hour, the long 2.75 h period at ~7 W with 43 W peaks,
    seven false readings. Nothing starts."""
    m = [0.0] * (48 * 60)
    base = S.series(m, T0, seed=3)
    rng = random.Random(9)
    for h in range(0, 48, 1):
        S.add(base, T0 + h * 3600 + rng.uniform(0, 3000), rng.uniform(60, 120), rng.uniform(35, 45), rng)
    t = T0 + 20 * 3600   # the long period: ~7 W with peaks of 43 W
    while t < T0 + 22.75 * 3600:
        S.add(base, t, 50, rng.uniform(3, 6))
        if rng.random() < 0.08:
            S.add(base, t, 30, 43 - 5)
        t += 50
    for k in range(7):
        S.spike(base, T0 + (3 + k * 6.5) * 3600)
    d = det(base=None)
    ev = S.feed(d, S.changes(base))
    assert not [x for x in ev if x[1] in ("start", "done", "short")], ev[:3]
    assert d.base < 1.5 and d.state == "idle"


def test_single_false_reading_slow_plug():
    """A plug that reports every 60 s: one false reading holds for a minute; still no start."""
    pts = [(T0 + i * 60, 0.0 if i != 30 else 1714.0) for i in range(120)]
    d = det()
    assert not ev_of(S.feed(d, pts), "start")


def test_aborted_start_goes_back_silently():
    """Started, heated 3 minutes, cancelled: below the minimum energy, back to idle without "done"."""
    m = [0.0] * 30 + [7, 9, 1700, 1700, 1700] + [0.0] * 40
    d = det()
    ev = S.feed(d, S.changes(S.series(m, T0)))
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "short")) == 1 and not ev_of(ev, "done")
    assert d.state == "idle" and d.rt["count"] == 0


def test_restart_mid_cycle():
    """Home Assistant restarts in the middle: state, start and energy come back from the saved record, the cycle
    goes on (2 minutes of readings lost) and ends once."""
    pts, i0 = noisy_real(1)
    cut = T0 + (i0 + 35) * 60
    d1 = det()
    ev1 = S.feed(d1, [p for p in pts if p[0] < cut])
    assert ev_of(ev1, "start") and d1.state == "running"
    saved = json.loads(json.dumps(d1.rt))           # what the store keeps
    wh_before = saved["wh"]
    d2 = C.Detector(C.params({"kind": "dishwasher"}), saved)
    assert d2.state == "running" and d2.rt["start"] == d1.rt["start"] and d2.rt["wh"] == wh_before
    rest = [p for p in pts if p[0] >= cut + 120]
    ev2 = S.feed(d2, rest, until=rest[-1][0] + 600)
    assert not ev_of(ev2, "start") and len(ev_of(ev2, "done")) == 1
    info = ev_of(ev2, "done")[0][2]
    assert info["start"] == d1.rt["start"] and 0.70 <= info["kwh"] <= 0.80


def test_unavailable_gaps():
    """The power sensor goes unavailable: the state is kept; nothing ends during a gap; after a gap in the drying the
    end comes from the new readings."""
    pts, i0 = noisy_real(2)
    a, b = T0 + (i0 + 20) * 60, T0 + (i0 + 35) * 60   # 15 minutes gone in the middle of the heating
    c, e = T0 + (i0 + 60) * 60, T0 + (i0 + 100) * 60  # 40 minutes gone at the end: back at 0 W
    feed = [p for p in pts if p[0] < a] + [(a, None)] + [p for p in pts if b <= p[0] < c] + [(c, None)] + [p for p in pts if p[0] >= e]
    d = det()
    ev = S.feed(d, feed, until=feed[-1][0] + 600)
    for t, k, _x in ev:
        assert not (a <= t < b or c <= t < e) or k not in ("done", "short", "start"), (t, k)
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "done")) == 1
    done_t = ev_of(ev, "done")[0][0]
    assert e <= done_t <= e + 10 * 60
    # idle: a gap and a return with the machine running starts once (the window starts again)
    d2 = det()
    S.feed(d2, [(T0, 0.0), (T0 + 60, None), (T0 + 3600, 1700.0), (T0 + 3602, 1710.0), (T0 + 3604, 1702.0)], until=T0 + 3604 + 300)
    assert d2.state == "running" and d2.rt["start"] >= T0 + 3600


def test_kinds_and_presets():
    for k in C.KINDS:
        p = C.params({"kind": k})
        assert p["end_min"] >= 5 and p["start_min"] >= 1 and p["min_kwh"] > 0
    assert C.params({"kind": "nuclear"})["kind"] == "other"
    p = C.params({"kind": "dishwasher", "end_min": 12, "tail": False, "start_w": "x"})
    assert p["end_min"] == 12 and p["tail"] is False and p["start_w"] == 80


# ---- synthetic machines ----
def washer_series(t0, rng):
    """A washing machine: fill, tumbling with pauses, heating, a 6-minute soak, rinse fills, spin, display left on."""
    out = []
    t = t0

    def hold(sec, w, jitter=0.0):
        nonlocal t
        n = int(sec / 2)
        for _ in range(n):
            out.append((t, round(max(0.0, w + rng.uniform(-jitter, jitter)), 1)))
            t += 2

    def tumble(sec, w=150):
        nonlocal t
        end = t + sec
        while t < end:
            hold(12, w, 15)
            hold(4, 3, 0.3)

    hold(30 * 60, 0.0)
    hold(180, 5, 0.5)            # fill
    tumble(20 * 60)
    end = t + 10 * 60
    while t < end:               # heating with the drum turning
        hold(12, 2100, 20)
        hold(4, 1950, 20)
    tumble(10 * 60)
    hold(6 * 60, 3, 0.3)         # soak pause
    tumble(15 * 60)
    hold(120, 5, 0.5)            # rinse fill
    tumble(8 * 60)
    hold(8 * 60, 420, 40)        # spin
    spin_end = t
    hold(5 * 60, 3, 0.3)         # display still on
    hold(60 * 60, 0.0)
    return out, spin_end


def test_washer_with_soak_pause():
    rng = random.Random(2)
    pts, spin_end = washer_series(T0, rng)
    d = det("washer")
    ev = S.feed(d, S.changes(pts), until=pts[-1][0])
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "done")) == 1, [x[:2] for x in ev]
    info = ev_of(ev, "done")[0][2]
    assert abs(info["end"] - spin_end) <= 90
    assert ev_of(ev, "done")[0][0] - spin_end <= 11 * 60


def dryer_series(t0, rng):
    """A heat-pump dryer: 90 minutes at 450-700 W (compressor dips), cooling tumble, anti-crease tumbles for an hour."""
    out = []
    t = t0

    def hold(sec, w, jitter=0.0):
        nonlocal t
        for _ in range(int(sec / 2)):
            out.append((t, round(max(0.0, w + rng.uniform(-jitter, jitter)), 1)))
            t += 2

    hold(20 * 60, 0.6, 0.2)
    for k in range(18):          # 90 minutes, a compressor dip every 5 minutes
        hold(4 * 60, 620, 60)
        hold(60, 160, 10)
    hold(10 * 60, 150, 10)       # cooling tumble
    end = t
    for k in range(30):          # anti-crease: 16 s every 2 minutes for an hour
        hold(16, 180, 15)
        hold(104, 0.6, 0.2)
    hold(60 * 60, 0.6, 0.2)
    return out, end


def test_heat_pump_dryer_with_anti_crease():
    rng = random.Random(4)
    pts, end = dryer_series(T0, rng)
    d = det("dryer", base=None)
    ev = S.feed(d, S.changes(pts), until=pts[-1][0])
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "done")) == 1, [x[:2] for x in ev]
    t_done, _k, info = ev_of(ev, "done")[0]
    assert abs(info["end"] - end) <= 3 * 60 and t_done - end <= 6 * 60    # finished during the anti-crease, not after it
    assert info["kwh"] > 0.7


def test_shared_plug_baseline_60w():
    """The machine on a plug that also feeds a 60 W load (router, NAS ...): the baseline is learned at ~60 W and the
    cycle's kWh is the machine's own."""
    m, i0 = S.real(1, 120, 60)
    base = S.series(m, T0, seed=8)
    rng = random.Random(1)
    base = [(t, round(w + 60 + rng.uniform(-3, 3), 1)) for t, w in base]
    d = det(base=None)
    ev = S.feed(d, S.changes(base), until=base[-1][0] + 600)
    assert 55 <= d.base <= 65
    assert len(ev_of(ev, "start")) == 1 and len(ev_of(ev, "done")) == 1
    info = ev_of(ev, "done")[0][2]
    assert abs(info["kwh"] - 0.79) <= 0.04
    end = (info["end"] - T0) / 60 - i0
    assert 50 <= end <= 75   # the ±3 W noise of the other load hides the drying: finished after the heating at worst


def test_kw_unit():
    assert EST.watts_of(S_("1.72", "kW")) == 1720
    assert EST.watts_of(S_("unavailable", "W")) is None


def S_(state, unit):
    from types import SimpleNamespace
    return SimpleNamespace(state=state, attributes={"unit_of_measurement": unit})


def test_done_cleared_by_next_cycle_and_clear():
    pts, i0 = noisy_real(1, pad_after=10)
    d = det()
    S.feed(d, pts, until=pts[-1][0] + 600)
    assert d.state == "done"
    later = [(t + 3 * 3600, w) for t, w in pts]
    ev = S.feed(d, later, until=later[-1][0] + 600)
    assert ev_of(ev, "clear") and ev_of(ev, "clear")[0][2]["reason"] == "next"
    assert d.rt["count"] == 2 and d.state == "done"
    assert d.clear("button") and d.state == "idle" and not d.clear("button")


def test_max_hours_and_rebase():
    """A load that stays on the plug (100 W more): the cycle ends after max_h and the baseline moves up."""
    pts = [(T0 + i * 2, 0.0 if i < 600 else 1700.0 if i < 1500 else 100.0) for i in range(12 * 1800)]
    d = det(max_h=2)
    ev = S.feed(d, S.changes(pts) + [(pts[-1][0], 100.0)], until=pts[-1][0])
    assert len(ev_of(ev, "done")) == 1 and ev_of(ev, "done")[0][2]["why"] == "max"
    assert 90 <= d.base <= 110 and d.state == "done"


# ---- history ----
def history_days(days=5, seed=11):
    """days of the plug: idle with purifier bursts and false readings, the two real cycles on day 2 and day 4."""
    rng = random.Random(seed)
    t0 = T0 - days * 86400
    m = [0.0] * (days * 1440)
    c1 = REAL_C1 = S.REAL["cycle1_1min_avg_w"]
    c2 = S.REAL["cycle2_1min_avg_w"]
    a, b = 1 * 1440 + 19 * 60, 3 * 1440 + 13 * 60
    m[a:a + len(c1)] = c1
    m[b:b + len(c2)] = c2
    base = S.series(m, t0, seed=seed)
    for h in range(days * 24):
        if rng.random() < 0.4:
            S.add(base, t0 + h * 3600 + rng.uniform(0, 3000), rng.uniform(60, 120), rng.uniform(35, 45), rng)
    for k in range(7):
        S.spike(base, t0 + (5 + k * 15) * 3600)
    return S.changes(base)


def test_suggest_from_history():
    pts = history_days()
    r = C.suggest(pts, {"kind": "dishwasher"}, now=T0)
    assert r["days"] == 5 and len(r["cycles"]) == 2, r
    assert abs(r["avg_kwh"] - 0.79) <= 0.03 and 50 <= r["avg_min"] <= 65
    assert r["base"] < 1.5
    assert 6 <= r["tuned"].get("end_min", 8) <= 12
    assert "start_w" not in r["tuned"]   # the purifier stays under the start margin
    # only programs without a long pause in the history: the wait is never suggested shorter than the preset
    m = [0.0] * 600 + S.REAL["cycle1_1min_avg_w"] + [0.0] * 600
    one = C.suggest(S.changes(S.series(m, T0)), {"kind": "dishwasher"})
    assert len(one["cycles"]) == 1 and "end_min" not in one["tuned"]
    none = C.suggest([], {"kind": "dishwasher"})
    assert none["days"] == 0 and none["cycles"] == [] and none["tuned"] == {}


def test_tariff_and_message():
    s = {"energy": {"price_mode": "single", "price": 3.15}}
    assert C.price_at(s, 12) == 3.15
    assert C.price_at({"energy": {"price_mode": "tou", "t_day": 3, "t_peak": 5, "t_night": 2}}, 18) == 5
    assert C.price_at({"energy": {"price_mode": "tier", "low": 2.5, "high": 4}}, 3) == 2.5
    assert C.price_at({"energy": {"sktt_on": True, "sktt_price": 6, "price": 1}}, 3) == 6
    assert C.price_at({}, 3) is None
    assert C.message("", "Bulaşık makinesi", {"min": 52.2, "kwh": 0.789}, True) == "Bulaşık makinesi bitti · 52 dk · 0,79 kWh"
    assert C.message("", "Dishwasher", {"min": 75, "kwh": 1.2}, False) == "Dishwasher finished · 1 h 15 min · 1.20 kWh"
    assert C.message("{name}: {time}", "X", {}, True, "14:05") == "X: 14:05"
    assert "hâlâ boşaltılmadı" in C.message("", "X", {}, True, remind=True, ago_min=125)
    d = C.Detector(C.params({"kind": "dishwasher"}), {"base": 0.0}, lambda t: 3.0)
    pts, _i0 = noisy_real(2)
    ev = S.feed(d, pts, until=pts[-1][0] + 600)
    assert abs(ev_of(ev, "done")[0][2]["cost"] - 0.79 * 3) < 0.1


# ---- schema, backups ----
def test_schema():
    rec = {"bul": {"name": "Bulaşık makinesi", "kind": "meas", "sensor": "sensor.bulasik_power",
                   "cycle": {"on": True, "kind": "dishwasher", "end_min": "9", "junk": 1, "door": "binary_sensor.bulasik_kapi",
                             "notify": {"on": True, "targets": ["notify.mobile_app_pixel", "notify.telefon"], "msg": "{name} bitti", "remind_h": 2, "x": 1}}}}
    out = EST.ESTIMATES_SCHEMA(copy.deepcopy(rec))
    c = out["bul"]["cycle"]
    assert c["end_min"] == 9.0 and "junk" not in c and "x" not in c["notify"] and c["notify"]["targets"][1] == "notify.telefon"
    for bad in ({"kind": "toaster"}, {"end_min": 0}, {"door": "light.x"}, {"notify": {"targets": ["script.x"]}}, {"start_w": -1}):
        r = copy.deepcopy(rec)
        r["bul"]["cycle"].update(bad)
        with pytest.raises(vol.Invalid):
            EST.ESTIMATES_SCHEMA(r)
    # a device that is not measured cannot track cycles: the block is dropped, the save goes through
    out = EST.ESTIMATES_SCHEMA({"tv": {"name": "TV", "kind": "fixed", "w": 5, "cycle": {"on": True}}})
    assert "cycle" not in out["tv"]
    assert C.tracked(EST.ESTIMATES_SCHEMA(copy.deepcopy(rec))["bul"])
    # non-admin screens do not get the notification targets
    pub = SF.public_data({"estimates": EST.ESTIMATES_SCHEMA(copy.deepcopy(rec))})
    assert "notify" not in pub["estimates"]["bul"]["cycle"] and pub["estimates"]["bul"]["cycle"]["kind"] == "dishwasher"


FULL = json.loads((pathlib.Path(__file__).parent / "backup_full.json").read_text(encoding="utf-8"))


async def _call(ws, n, **msg):
    await ws.send_json({"id": n, **msg})
    while True:
        r = await ws.receive_json()
        if r.get("type") == "result" and r.get("id") == n:
            return r


async def test_backup_round_trip_keeps_cycle(hass: HomeAssistant, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    ws = await hass_ws_client(hass)
    data = copy.deepcopy(FULL)
    data["estimates"]["bul"] = {"name": "Bulaşık makinesi", "kind": "meas", "sensor": "sensor.bulasik_power",
                                "cycle": {"on": True, "kind": "dishwasher", "end_min": 9.0, "notify": {"on": True, "targets": ["notify.telefon"], "msg": "", "remind_h": 2.0}}}
    r = await _call(ws, 1, type=f"{DOMAIN}/get")
    r = await _call(ws, 2, type=f"{DOMAIN}/restore", data=data, revs={k: r["result"]["revs"].get(k, 0) for k in data})
    assert r["success"], r
    g = await _call(ws, 3, type=f"{DOMAIN}/get")
    assert json.loads(json.dumps(g["result"]["estimates"]["bul"])) == json.loads(json.dumps(data["estimates"]["bul"]))
    assert "cycles" not in g["result"]   # the trackers' state is not sent to screens (nor in a backup)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle") is not None and hass.states.get("button.lhd_bul_emptied") is not None


# ---- Home Assistant: entities, buttons, door, notifications ----
REC = {"name": "Bulaşık makinesi", "kind": "meas", "sensor": "sensor.bulasik_power",
       "cycle": {"on": True, "kind": "dishwasher", "door": "binary_sensor.bulasik_kapi",
                 "notify": {"on": True, "targets": ["notify.telefon", "notify.bozuk", "notify.tablet"], "remind_h": 2}}}


async def _setup(hass, hass_ws_client, rec=None, unit="W"):
    await async_setup_component(hass, "http", {})
    calls = []

    async def legacy(call):
        calls.append(("telefon", call.data["message"]))

    async def broken(call):
        raise RuntimeError("phone is off")

    async def send_message(call):
        calls.append((call.data.get("entity_id"), call.data["message"]))

    hass.services.async_register("notify", "telefon", legacy)
    hass.services.async_register("notify", "bozuk", broken)
    hass.services.async_register("notify", "send_message", send_message)
    hass.states.async_set("notify.tablet", "unknown")   # a notify entity
    hass.states.async_set("sensor.bulasik_power", "0", {"unit_of_measurement": unit, "device_class": "power"})
    hass.states.async_set("binary_sensor.bulasik_kapi", "off")
    ws = await hass_ws_client(hass)
    r = await _call(ws, 1, type=f"{DOMAIN}/set", key="estimates", value={"bul": copy.deepcopy(rec or REC)})
    assert r["success"], r
    await hass.async_block_till_done()
    return ws, calls, hass.data[DOMAIN].cycles.trackers["bul"]


def _run_cycle(hass, tr, which=1, t0=None, kw=False):
    pts, i0 = noisy_real(which, t0=t0 or time.time() - 4 * 3600)
    if kw:
        pts = [(t, w / 1000) for t, w in pts]
    d = tr.det
    d.segs.clear()   # the readings Home Assistant gave at setup are newer than this replayed day
    d.known = None
    nxt = pts[0][0] + 30
    for t, w in pts:
        while nxt < t:
            tr.tick(nxt)
            nxt += 30
        tr.handle(d.feed(t, w * 1000 if kw else w))
    for k in range(25):
        tr.tick(pts[-1][0] + 30 * (k + 1))
    return pts, i0


async def test_entities_and_notification_once(hass: HomeAssistant, hass_ws_client, setup_lhd):
    ws, calls, tr = await _setup(hass, hass_ws_client)
    s = hass.states.get("sensor.lhd_bul_cycle")
    assert s.state == "idle" and s.attributes["device_class"] == "enum" and s.attributes["options"] == ["idle", "running", "done"]
    assert s.attributes["friendly_name"] == "Bulaşık makinesi durumu" and s.attributes["emptied_button"] == "button.lhd_bul_emptied"
    assert s.attributes["device_name"] == "Bulaşık makinesi" and s.attributes["icon"] == "mdi:dishwasher" and s.attributes["lhd_cycle"] is True
    b = hass.states.get("button.lhd_bul_emptied")
    assert b.attributes["friendly_name"] == "Bulaşık makinesi boşaltıldı"
    from homeassistant.helpers import entity_registry as er, device_registry as dr
    ent = er.async_get(hass).async_get("sensor.lhd_bul_cycle")
    assert ent.unique_id == f"{DOMAIN}_est_bul_cycle" and ent.translation_key == "cycle"
    dev = dr.async_get(hass).async_get(ent.device_id)
    assert dev.name == "Bulaşık makinesi" and er.async_get(hass).async_get("button.lhd_bul_emptied").device_id == dev.id
    _run_cycle(hass, tr)
    await hass.async_block_till_done()
    s = hass.states.get("sensor.lhd_bul_cycle")
    assert s.state == "done", s
    assert abs(s.attributes["energy_kwh"] - 0.79) <= 0.03 and s.attributes["cycle_count"] == 1 and s.attributes["duration"] > 45
    assert s.attributes["finished"] and s.attributes["started"]
    # the message went to the legacy service and the notify entity once; the broken target did not stop anything
    assert sorted(c[0] if isinstance(c[0], str) else c[0][0] for c in calls) == ["notify.tablet", "telefon"], calls
    assert all("Bulaşık makinesi bitti · " in c[1] and "0,7" in c[1] for c in calls)
    assert [x for x in hass.data[DOMAIN].cycles.sent if x[0] == "notify.bozuk"][0][2] is False
    # more ticks, a restart of the record: no second message
    for k in range(5):
        tr.tick(time.time() - 3600 + k * 30)
    await hass.async_block_till_done()
    assert len(calls) == 2
    # the reminder after 2 hours, once
    fin = tr.det.rt["finished"]
    tr.tick(fin + 2 * 3600 + 10)
    tr.tick(fin + 2 * 3600 + 40)
    await hass.async_block_till_done()
    rem = [c for c in calls if "hâlâ boşaltılmadı" in c[1]]
    assert len(rem) == 2, calls   # telefon + tablet, once each
    # Emptied button: done → idle; pressing again does nothing
    await hass.services.async_call("button", "press", {"entity_id": "button.lhd_bul_emptied"}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle").state == "idle"
    assert hass.states.get("sensor.lhd_bul_cycle").attributes["energy_kwh"] == pytest.approx(0.79, abs=0.03)   # the last cycle stays
    await hass.services.async_call("button", "press", {"entity_id": "button.lhd_bul_emptied"}, blocking=True)
    assert hass.states.get("sensor.lhd_bul_cycle").state == "idle"


async def test_door_auto_clear_and_restart(hass: HomeAssistant, hass_ws_client, setup_lhd):
    ws, calls, tr = await _setup(hass, hass_ws_client, unit="kW")
    _run_cycle(hass, tr, which=2)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle").state == "done"
    hass.states.async_set("binary_sensor.bulasik_kapi", "on")
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle").state == "idle"
    # auto-clear after 3 hours
    rec = copy.deepcopy(REC)
    rec["cycle"].update(clear_h=3, door="")
    r = await _call(ws, 5, type=f"{DOMAIN}/set", key="estimates", value={"bul": rec})
    assert r["success"]
    await hass.async_block_till_done()
    tr = hass.data[DOMAIN].cycles.trackers["bul"]
    _run_cycle(hass, tr, which=1, t0=time.time() - 8 * 3600)
    assert tr.det.state == "done"
    tr.tick(tr.det.rt["detected"] + 3 * 3600 + 5)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle").state == "idle" and tr.det.rt["cleared"] == "auto"
    # the power sensor in kW: a reading of 1.7 kW is 1700 W
    hass.states.async_set("sensor.bulasik_power", "1.7", {"unit_of_measurement": "kW"})
    await hass.async_block_till_done()
    assert tr.det.segs[-1][1] == 1700


async def test_restart_keeps_running_cycle(hass: HomeAssistant, hass_ws_client, setup_lhd):
    ws, calls, tr = await _setup(hass, hass_ws_client)
    pts, i0 = noisy_real(1, t0=time.time() - 3 * 3600)
    tr.det.segs.clear()
    tr.det.known = None
    half = [p for p in pts if p[0] < pts[0][0] + (i0 + 30) * 60]
    for t, w in half:
        tr.handle(tr.det.feed(t, w))
    assert tr.det.state == "running"
    start, wh = tr.det.rt["start"], tr.det.rt["wh"]
    entry = setup_lhd
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    tr2 = hass.data[DOMAIN].cycles.trackers["bul"]
    assert tr2 is not tr and tr2.det.state == "running" and tr2.det.rt["start"] == start and tr2.det.rt["wh"] >= wh
    s = hass.states.get("sensor.lhd_bul_cycle")
    assert s.state == "running" and s.attributes["elapsed"] > 20


async def test_tracking_off_removes_entities(hass: HomeAssistant, hass_ws_client, setup_lhd):
    ws, calls, tr = await _setup(hass, hass_ws_client)
    rec = copy.deepcopy(REC)
    rec["cycle"]["on"] = False
    r = await _call(ws, 7, type=f"{DOMAIN}/set", key="estimates", value={"bul": rec})
    assert r["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.lhd_bul_cycle") is None and hass.states.get("button.lhd_bul_emptied") is None
    assert "bul" not in hass.data[DOMAIN].cycles.trackers and "bul" not in hass.data[DOMAIN].data["cycles"]


async def test_ws_suggest_and_test_message(hass: HomeAssistant, hass_ws_client, setup_lhd):
    ws, calls, tr = await _setup(hass, hass_ws_client)
    pts = history_days()
    shift = time.time() - T0

    async def fake_history(_hass, sensor, days):
        assert sensor == "sensor.bulasik_power" and days >= 10
        return [(t + shift, w) for t, w in pts]

    with patch("custom_components.lemur_home_dashboard.cycle_ha.history", fake_history):
        r = await _call(ws, 10, type=f"{DOMAIN}/cycle_suggest", sensor="sensor.bulasik_power", cycle={"kind": "dishwasher"})
    assert r["success"], r
    assert r["result"]["days"] == 5 and len(r["result"]["cycles"]) == 2
    # no recorder in this test: nothing found, the preset stays
    r = await _call(ws, 11, type=f"{DOMAIN}/cycle_suggest", sensor="sensor.bulasik_power", cycle={"kind": "washer"})
    assert r["success"] and r["result"]["days"] == 0 and r["result"]["tuned"] == {}
    r = await _call(ws, 12, type=f"{DOMAIN}/cycle_test", targets=["notify.telefon", "notify.bozuk"], name="Bulaşık makinesi")
    assert r["success"]
    res = {x["target"]: x["ok"] for x in r["result"]["results"]}
    assert res == {"notify.telefon": True, "notify.bozuk": False}
    assert r["result"]["message"] == "Bulaşık makinesi bitti · 52 dk · 0,79 kWh"
