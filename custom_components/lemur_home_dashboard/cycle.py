"""Appliance cycles from a smart plug (bulaşık / çamaşır makinesi, kurutucu): idle, running, done.

A device of the Energy page with its own power sensor (kind "meas") can have cycle tracking:
    estimates[id]["cycle"] = {on, kind, start_w, start_min, end_w, end_min, tail, tail_w, tail_min, min_kwh, max_h,
                              door, clear_h, notify: {on, targets, msg, remind_h}}
Only "on" and "kind" are needed; the rest overrides the kind's preset (advanced mode of the device editor).

How it decides (everything is relative to the idle BASELINE: what the plug reads while the machine rests, so a plug
shared with other small loads or a machine with a high standby works without tuning):
  start    the time-weighted mean over the last start_min is at least baseline + start_w, and at least two separate
           readings (or one held for start_min + 1 min) are that high: a single false reading never starts a cycle.
           The start is dated back to where the activity began (pre-wash fill, a few W).
  end      the mean over the last end_min is below baseline + end_w. A mean, not every reading: a 2-minute 40 W burst of
           another load on the same plug delays the end by at most end_min, and cannot keep a cycle alive for ever.
  tail     (dishwasher) after the end the machine may still dry at 2-5 W: it stays "running" until the 5-minute mean is
           back at the baseline (+ tail_w), for at most tail_min. A machine that dries at the baseline just ends.
  short    a cycle that used less than min_kwh above the baseline was not a cycle: back to idle without "done".
  max_h    a cycle longer than this ends anyway and the baseline is learned again (a new load stays on the plug).
  spikes   an isolated reading of 400 W or more above the baseline, shorter than 90 s, with low readings on both sides is
           a false reading: it counts as the reading before it (energy, means).
  gaps     unavailable / unknown: nothing is decided, the state is kept. When readings come back the windows start again
           (the end needs end_min of new readings), the energy of the gap is not counted.
  baseline the 20th percentile of the last 4 hours of quiet idle minutes (minutes without a reading above
           baseline + start_w); seeded from the recorder's history when tracking is switched on.

Pure code (no Home Assistant): the detector is fed (time, watts) and ticked; cycle_ha.py runs it for the entities, the
"suggest from history" command runs the same detector over the recorder's history.
"""
from __future__ import annotations

import math
from collections import deque
from typing import Any, Callable

import voluptuous as vol

KINDS = ("dishwasher", "washer", "dryer", "washer_dryer", "other")
STATES = ("idle", "running", "done")

# Presets. Safe against ending too early: the end waits are longer than the quiet phases these machines have
#   dishwasher    heats in 1-3 bursts of 1.5-2.2 kW, drains / pauses up to ~6 min at 0-50 W, dries 15-60 min at 2-5 W
#   washer        tumbles at 50-500 W with pauses; soaks and rinse fills of several minutes at 2-10 W; spins at the end
#   dryer         heat pump 300-900 W (vented / condenser up to 2.5 kW), then anti-crease: 10-30 s tumbles every few minutes
#   washer_dryer  a wash and a dry with a cool-down between them; anti-crease at the end
#   other         oven or anything else: a heater that cycles on its thermostat
PRESETS: dict[str, dict[str, Any]] = {
    "dishwasher":   {"start_w": 80, "start_min": 2, "end_w": 20, "end_min": 8,  "tail": True,  "tail_w": 1.2, "tail_min": 60, "min_kwh": 0.15, "max_h": 5},
    "washer":       {"start_w": 50, "start_min": 2, "end_w": 12, "end_min": 10, "tail": False, "tail_w": 1.2, "tail_min": 30, "min_kwh": 0.05, "max_h": 6},
    "dryer":        {"start_w": 80, "start_min": 2, "end_w": 30, "end_min": 5,  "tail": False, "tail_w": 1.2, "tail_min": 30, "min_kwh": 0.2,  "max_h": 5},
    "washer_dryer": {"start_w": 50, "start_min": 2, "end_w": 25, "end_min": 15, "tail": False, "tail_w": 1.2, "tail_min": 30, "min_kwh": 0.1,  "max_h": 8},
    "other":        {"start_w": 30, "start_min": 1, "end_w": 10, "end_min": 10, "tail": False, "tail_w": 1.2, "tail_min": 30, "min_kwh": 0.02, "max_h": 12},
}
PARAMS = ("start_w", "start_min", "end_w", "end_min", "tail", "tail_w", "tail_min", "min_kwh", "max_h")

TAIL_WIN_S = 300.0     # the tail's mean window
SPIKE_W = 400.0        # a false reading is at least this far above the baseline ...
SPIKE_S = 90.0         # ... and shorter than this, with low readings before and after
BACK_LOW_S = 60.0      # the start is dated back over activity; a quiet stretch this long stops it
BACK_MAX_S = 20 * 60.0
KEEP_S = 25 * 60.0     # readings kept in memory (the longest window + the date-back)
BASE_RING = 240        # quiet idle minutes kept for the baseline (4 hours)
BASE_MIN = 15          # the baseline is learned once this many quiet minutes are known
BASE_Q = 0.2

_ENT = vol.All(str, vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"))
_NOTIFY = vol.All(str, vol.Match(r"^notify\.[a-z0-9_]+$"))


def _num(lo: float, hi: float):
    return vol.All(vol.Coerce(float), vol.Range(min=lo, max=hi))


NOTIFY_SCHEMA = vol.Schema({
    vol.Optional("on"): bool,
    vol.Optional("targets"): vol.All([_NOTIFY], vol.Length(max=10)),
    vol.Optional("msg"): vol.All(str, vol.Length(max=200)),
    vol.Optional("remind_h"): _num(0, 48),
}, extra=vol.REMOVE_EXTRA)

CYCLE_SCHEMA = vol.Schema({
    vol.Optional("on"): bool,
    vol.Optional("kind"): vol.In(KINDS),
    vol.Optional("start_w"): _num(1, 5000),
    vol.Optional("start_min"): _num(0.5, 30),
    vol.Optional("end_w"): _num(0.5, 2000),
    vol.Optional("end_min"): _num(1, 120),
    vol.Optional("tail"): bool,
    vol.Optional("tail_w"): _num(0.2, 50),
    vol.Optional("tail_min"): _num(1, 240),
    vol.Optional("min_kwh"): _num(0, 20),
    vol.Optional("max_h"): _num(0.5, 48),
    vol.Optional("door"): vol.Any(None, "", vol.All(str, vol.Match(r"^binary_sensor\.[a-z0-9_]+$"))),
    vol.Optional("clear_h"): _num(0, 168),
    vol.Optional("notify"): NOTIFY_SCHEMA,
}, extra=vol.REMOVE_EXTRA)


def tracked(est: Any) -> bool:
    """A device whose cycles are tracked: a measured device (own power sensor) with cycle.on."""
    return isinstance(est, dict) and est.get("kind") == "meas" and bool(est.get("sensor")) and isinstance(est.get("cycle"), dict) and bool(est["cycle"].get("on"))


def params(cfg: Any) -> dict[str, Any]:
    """The kind's preset with the device's own values over it."""
    cfg = cfg if isinstance(cfg, dict) else {}
    kind = cfg.get("kind") if cfg.get("kind") in PRESETS else "other"
    p = dict(PRESETS[kind], kind=kind)
    for k in PARAMS:
        v = cfg.get(k)
        if k == "tail":
            if isinstance(v, bool):
                p[k] = v
        elif isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v) and v >= 0:
            p[k] = float(v)
    return p


def _nz(v: Any, d: float) -> float:
    """v as a number, d when it is missing (0 is a number)."""
    return float(v) if isinstance(v, (int, float)) and not isinstance(v, bool) else float(d)


def percentile(vals: list[float], q: float) -> float | None:
    if not vals:
        return None
    s = sorted(vals)
    i = (len(s) - 1) * q
    lo = int(math.floor(i))
    hi = min(lo + 1, len(s) - 1)
    return s[lo] + (s[hi] - s[lo]) * (i - lo)


class Detector:
    """One appliance. feed(t, watts or None) for every reading, tick(t) now and then (every 30 s); both return events:
    ("start", info), ("tail", info), ("resume", info), ("done", info), ("short", info), ("clear", info).
    rt: the persisted state (dict, changed in place): state, phase, start, wh, wh_all, cost, base, ring, last, count,
    avg_min, ... Readings themselves are not persisted: after a restart the windows start again."""

    def __init__(self, p: dict, rt: dict | None = None, price: Callable[[float], float | None] | None = None) -> None:
        self.p = p
        self.rt = rt if isinstance(rt, dict) else {}
        self.price = price
        r = self.rt
        if r.get("state") not in STATES:
            r["state"] = "idle"
        r.setdefault("base", None)
        if not isinstance(r.get("ring"), list):
            r["ring"] = []
        r.setdefault("count", 0)
        self.segs: deque = deque()     # [t, raw W, effective W] — the reading holds until the next one
        self.known: float | None = None   # readings known without a gap since
        self.acc_t: float | None = None   # energy and minute buckets counted up to here
        self.bucket: list | None = None   # [minute, W·s, s, max W]

    # ---- helpers ----
    @property
    def state(self) -> str:
        return self.rt["state"]

    @property
    def base(self) -> float:
        b = self.rt.get("base")
        return float(b) if isinstance(b, (int, float)) and b >= 0 else 0.0

    def seed_base(self, w: float | None) -> None:
        """A baseline from history (cycle_ha.py) when none was learned yet."""
        if w is not None and math.isfinite(w) and w >= 0 and not (self.rt.get("ring") and len(self.rt["ring"]) >= BASE_MIN):
            self.rt["base"] = round(float(w), 2)

    def _end(self, i: int, t: float) -> float:
        return self.segs[i + 1][0] if i + 1 < len(self.segs) else t

    def mean(self, t0: float, t1: float) -> tuple[float | None, float]:
        """Time-weighted mean of the effective readings over [t0, t1] and the seconds covered."""
        tot = sec = 0.0
        for i, sg in enumerate(self.segs):
            a, b = max(sg[0], t0), min(self._end(i, t1), t1)
            if b > a:
                tot += sg[2] * (b - a)
                sec += b - a
        return (tot / sec if sec > 0 else None), sec

    def _highs(self, t0: float, t1: float, thr: float) -> tuple[int, float]:
        """Readings above thr overlapping [t0, t1] and the longest one's whole length."""
        n, longest = 0, 0.0
        for i, sg in enumerate(self.segs):
            e = self._end(i, t1)
            if e > t0 and sg[0] < t1 and sg[2] > thr:
                n += 1
                longest = max(longest, e - sg[0])
        return n, longest

    def _last_active(self, t: float, thr: float, back: float, floor: float, blk: float = 120.0) -> float:
        """When the machine was last active: walking back from t (not before floor) in blk-second blocks, the latest
        block whose mean is above thr, and in it the end of the last reading above thr. max(floor, t - back) if none.
        Two-minute blocks: a 15-second anti-crease tumble or a single reading does not count as activity."""
        lo = max(floor, t - back)
        x = t
        while x > lo:
            a = max(lo, x - blk)
            m, sec = self.mean(a, x)
            if m is not None and sec > 20 and m > thr:
                last = a
                for i, sg in enumerate(self.segs):
                    e = min(self._end(i, x), x)
                    if e > a and sg[0] < x and sg[2] > thr:
                        last = max(last, e)
                return last
            x -= blk
        return lo

    # ---- counting (energy, cost, baseline minutes) ----
    def _count(self, t0: float, t1: float, w: float) -> None:
        if t1 <= t0:
            return
        r = self.rt
        if r["state"] == "running":
            r["wh_all"] = r.get("wh_all", 0.0) + w * (t1 - t0) / 3600
            above = max(0.0, w - self.base)
            wh = above * (t1 - t0) / 3600
            r["wh"] = r.get("wh", 0.0) + wh
            pr = self.price((t0 + t1) / 2) if self.price else None
            if pr:
                r["cost"] = r.get("cost", 0.0) + wh / 1000 * pr
            if above > self.p["end_w"]:
                r["hi_t"] = t1
            return
        # idle / done: quiet minutes teach the baseline
        x = t0
        while x < t1:
            m = int(x // 60)
            y = min(t1, (m + 1) * 60.0)
            b = self.bucket
            if b is None or b[0] != m:
                self._close_bucket()
                b = self.bucket = [m, 0.0, 0.0, 0.0]
            b[1] += w * (y - x)
            b[2] += y - x
            b[3] = max(b[3], w)
            x = y
        if self.bucket and t1 >= (self.bucket[0] + 1) * 60.0:
            self._close_bucket()

    def _close_bucket(self) -> None:
        b, self.bucket = self.bucket, None
        if not b or b[2] < 45 or self.rt["state"] == "running":
            return
        if b[3] >= self.base + self.p["start_w"] and self.rt.get("base") is not None:
            return   # the machine (or a big load) was on: not a quiet minute
        ring = self.rt["ring"]
        ring.append(round(b[1] / b[2], 2))
        del ring[:-BASE_RING]
        if len(ring) >= BASE_MIN or self.rt.get("base") is None:
            self.rt["base"] = round(percentile(ring, BASE_Q) or 0.0, 2)

    def _advance(self, t: float) -> None:
        """Count the last reading up to t, unless it may still turn out to be a false reading."""
        if not self.segs or self.acc_t is None:
            return
        sg = self.segs[-1]
        if sg[2] - self.base >= SPIKE_W and t - sg[0] < SPIKE_S:
            return
        self._count(max(self.acc_t, sg[0]), t, sg[2])
        self.acc_t = max(self.acc_t, t)

    # ---- input ----
    def feed(self, t: float, w: float | None) -> list:
        if w is None or not math.isfinite(w):
            if self.known is not None:
                self._advance(t)   # the last reading before the gap is counted up to it
                self._close_bucket()
                self.known = None
                self.acc_t = None
                self.segs.clear()
                self.rt["gaps"] = self.rt.get("gaps", 0) + (1 if self.rt["state"] == "running" else 0)
            return []
        w = max(0.0, float(w))
        if self.known is None:
            self.known = t
            self.acc_t = t
            self.segs.append([t, w, w])
            return self._eval(t)
        if t < self.segs[-1][0]:
            return []   # out of order
        last = self.segs[-1]
        b = self.base
        # the reading before this one: a false reading? (high, short, low on both sides)
        prev_low = len(self.segs) < 2 or self.segs[-2][2] < b + self.p["end_w"]
        if last[1] - b >= SPIKE_W and t - last[0] < SPIKE_S and prev_low and w < b + self.p["end_w"]:
            last[2] = self.segs[-2][2] if len(self.segs) >= 2 else w
            self.rt["spikes"] = self.rt.get("spikes", 0) + 1
        self._count(max(self.acc_t, last[0]), t, last[2])
        self.acc_t = max(self.acc_t, t)
        self.segs.append([t, w, w])
        while len(self.segs) > 2 and self.segs[1][0] < t - KEEP_S:
            self.segs.popleft()
        return self._eval(t)

    def tick(self, t: float) -> list:
        if self.known is None:
            return []
        self._advance(t)
        return self._eval(t)

    # ---- the decisions ----
    def _start_ok(self, t: float, floor: float) -> bool:
        p, b = self.p, self.base
        win = p["start_min"] * 60
        if t - max(self.known, floor) < win:
            return False
        m, _ = self.mean(t - win, t)
        if m is None or m < b + p["start_w"]:
            return False
        n, longest = self._highs(t - win, t, b + p["start_w"])
        return n >= 2 or longest >= win + 60

    def _back(self, t0: float) -> float:
        """Where the activity that started a cycle began: walk back while it is not quiet for BACK_LOW_S."""
        thr = self.base + max(3.0, self.p["tail_w"] * 2)
        start = t0
        x = t0
        lo = max(self.known if self.known is not None else t0, t0 - BACK_MAX_S)
        while x - 30 >= lo:
            m, sec = self.mean(x - 30, x)
            if m is None or sec < 10:
                break
            if m > thr:
                start = x - 30
            elif start - (x - 30) >= BACK_LOW_S:
                break
            x -= 30
        return start

    def _integrate(self, t0: float, t1: float) -> tuple[float, float, float]:
        """Energy above the baseline, all energy and cost over [t0, t1] from the kept readings (the date-back)."""
        wh = wh_all = cost = 0.0
        for i, sg in enumerate(self.segs):
            a, e = max(sg[0], t0), min(self._end(i, t1), t1)
            if e > a:
                wh_all += sg[2] * (e - a) / 3600
                x = max(0.0, sg[2] - self.base) * (e - a) / 3600
                wh += x
                pr = self.price((a + e) / 2) if self.price else None
                if pr:
                    cost += x / 1000 * pr
        return wh, wh_all, cost

    def _eval(self, t: float) -> list:
        r, p, b = self.rt, self.p, self.base
        ev: list = []
        if r["state"] in ("idle", "done"):
            if self._start_ok(t, -math.inf):
                self._close_bucket()
                win = p["start_min"] * 60
                st = self._back(t - win)
                was_done = r["state"] == "done"
                wh, wh_all, cost = self._integrate(st, self.acc_t if self.acc_t is not None else t)
                r.update(state="running", phase="main", start=st, wh=wh, wh_all=wh_all, cost=cost, hi_t=t, tail_since=None,
                         main_end=None, detected=None, finished=None, notified=None, reminded=None, gaps=0, spikes=0)
                if was_done:
                    ev.append(("clear", {"reason": "next"}))
                ev.append(("start", {"start": st}))
            return ev
        if r["state"] != "running":
            return ev
        st = _nz(r.get("start"), t)
        if t - st >= p["max_h"] * 3600:
            fin = _nz(r.get("hi_t"), t)
            ev += self._finish(t, min(fin, t), "max")
            # a load that stays on the plug: learn the baseline again from the last minutes
            m, _ = self.mean(t - 600, t)
            r["ring"] = []
            if m is not None:
                lows = []
                x = t
                while x - 60 >= t - 1800:
                    mm, sec = self.mean(x - 60, x)
                    if mm is not None and sec > 20:
                        lows.append(mm)
                    x -= 60
                r["base"] = round(percentile(lows, BASE_Q) or m, 2)
            return ev
        floor = max(self.known, st)
        if r.get("phase") == "tail":
            if self._start_ok(t, _nz(r.get("tail_since"), t)):
                r["phase"] = "main"
                r["tail_since"] = None
                ev.append(("resume", {}))
                return ev
            tw = b + p["tail_w"]
            if t - max(self.known, _nz(r.get("tail_since"), t) - TAIL_WIN_S) >= TAIL_WIN_S:
                m, sec = self.mean(t - TAIL_WIN_S, t)
                if m is not None and sec >= TAIL_WIN_S * 0.5 and m < tw:
                    fin = max(_nz(r.get("main_end"), st), self._last_active(t, tw, TAIL_WIN_S, floor, 60.0))
                    return self._finish(t, fin, "tail")
            if t - _nz(r.get("tail_since"), t) >= p["tail_min"] * 60:
                return self._finish(t, t, "tail_max")
            return ev
        win = p["end_min"] * 60
        if t - floor >= win:
            m, _ = self.mean(t - win, t)
            if m is not None and m < b + p["end_w"]:
                fin = self._last_active(t, b + p["end_w"], win, floor)
                if p.get("tail"):
                    r.update(phase="tail", tail_since=t, main_end=fin)
                    ev.append(("tail", {"main_end": fin}))
                    # the drying may already be over (a machine that dries at the baseline): decided on the next ticks
                    return ev
                return self._finish(t, fin, "end")
        return ev

    def _finish(self, t: float, fin: float, why: str) -> list:
        r, p = self.rt, self.p
        st = _nz(r.get("start"), fin)
        fin = max(st, min(fin, t))
        kwh = r.get("wh", 0.0) / 1000
        info = {"start": st, "end": fin, "min": round((fin - st) / 60, 1), "kwh": round(kwh, 3), "why": why,
                "cost": round(r["cost"], 2) if r.get("cost") else None}
        r.update(phase=None, tail_since=None)
        if kwh < p["min_kwh"]:
            r.update(state="idle", start=None)
            return [("short", info)]
        n = int(r.get("count") or 0) + 1
        avg = r.get("avg_min")
        r.update(state="done", finished=fin, detected=t, last=info, count=n,
                 avg_min=round(info["min"] if not isinstance(avg, (int, float)) else (avg * min(n - 1, 9) + info["min"]) / min(n, 10), 1))
        return [("done", info)]

    def clear(self, reason: str) -> list:
        """Done → idle: the Emptied button, the door, the auto-clear."""
        if self.rt["state"] != "done":
            return []
        self.rt["state"] = "idle"
        self.rt["cleared"] = reason
        return [("clear", {"reason": reason})]

    # ---- what the entity shows ----
    def live(self, t: float) -> dict:
        """Elapsed minutes and kWh so far (the last reading counted up to now)."""
        r = self.rt
        wh = r.get("wh", 0.0)
        if r["state"] == "running" and self.segs and self.acc_t is not None and t > self.acc_t:
            wh += max(0.0, self.segs[-1][2] - self.base) * (t - self.acc_t) / 3600
        st = r.get("start")
        return {"elapsed": round((t - st) / 60, 1) if r["state"] == "running" and st else None, "kwh": round(wh / 1000, 3)}


# ---- the recorder's history: baseline and "suggest from history" ----
def bins(samples: list[tuple[float, float | None]], step: float = 10.0) -> list[tuple[float, float | None]]:
    """Readings → step-second time-weighted means (None for gaps). A long history (2-second plug, 10 days: 400 000
    readings) is run through the detector quickly. False readings are taken out first (same rule as the detector, the
    baseline being the history's 20th percentile)."""
    pts = [(float(t), (None if w is None or not math.isfinite(w) else max(0.0, float(w)))) for t, w in samples]
    pts.sort(key=lambda x: x[0])
    if not pts:
        return []
    known = [w for _t, w in pts if w is not None]
    b = percentile(known, BASE_Q) or 0.0
    vals = [w for _t, w in pts]
    for i in range(1, len(pts) - 1):
        w = vals[i]
        if w is None or vals[i - 1] is None or vals[i + 1] is None:
            continue
        if w - b >= SPIKE_W and pts[i + 1][0] - pts[i][0] < SPIKE_S and vals[i - 1] < b + 30 and vals[i + 1] < b + 30:
            vals[i] = vals[i - 1]
    out: list = []
    t0 = math.floor(pts[0][0] / step) * step
    t_end = pts[-1][0]
    i = 0
    x = t0
    while x <= t_end:
        y = x + step
        tot = sec = 0.0
        gap = False
        while i < len(pts) and pts[i][0] < y:
            i += 1
        # the readings overlapping [x, y): from the one holding at x
        j = max(0, i - 1)
        while j > 0 and pts[j][0] > x:
            j -= 1
        k = j
        while k < len(pts) and pts[k][0] < y:
            a = max(x, pts[k][0])
            e = min(y, pts[k + 1][0] if k + 1 < len(pts) else y)
            if e > a:
                if vals[k] is None:
                    gap = True
                else:
                    tot += vals[k] * (e - a)
                    sec += e - a
            k += 1
        out.append((x, None if sec < step * 0.5 and gap else (tot / sec if sec > 0 else None)))
        x = y
    return out


def run(samples: list[tuple[float, float | None]], p: dict, base: float | None = None, step: float = 10.0) -> dict:
    """The detector over a history. Returns {cycles: [...], short: n, base, idle_minutes: [...]}."""
    bs = bins(samples, step)
    known = [w for _t, w in bs if w is not None]
    b0 = base if base is not None else (percentile(known, BASE_Q) or 0.0)
    det = Detector(p, {"base": round(b0, 2)})
    cycles: list = []
    short = 0
    idle: list = []
    cur = None
    for t, w in bs:
        for kind, info in det.feed(t, w):
            if kind == "start":
                cur = {"start": info["start"]}
            elif kind == "tail" and cur is not None:
                cur["main_end"] = info["main_end"]
            elif kind == "done":
                c = dict(info)
                c["main_end"] = (cur or {}).get("main_end", info["end"])
                cycles.append(c)
                cur = None
            elif kind == "short":
                short += 1
                cur = None
    if det.state == "running":
        cur = None   # still running at the end of the history: not counted
    return {"cycles": cycles, "short": short, "base": det.base, "det": det, "bins": bs}


def _min_quiet_window(bs: list, t0: float, t1: float, thr: float, step: float) -> float:
    """The shortest window length (minutes) that never has a mean below thr inside [t0, t1]; 0 if never below."""
    vals = [(t, w) for t, w in bs if t0 <= t < t1 and w is not None]
    if not vals:
        return 0.0
    pre = [0.0]
    for _t, w in vals:
        pre.append(pre[-1] + w)
    n = len(vals)
    need = 0.0
    for L in range(1, 31):
        k = int(round(L * 60 / step))
        if k > n:
            break
        low = any((pre[i + k] - pre[i]) / k < thr for i in range(0, n - k + 1))
        if low:
            need = L + 1
        else:
            break
    return need


def suggest(samples: list[tuple[float, float | None]], cfg: dict, now: float | None = None) -> dict:
    """"Suggest from history": the cycles the detector finds in the power sensor's history with the kind's preset (and
    the device's own values), and tuned values. No history: the preset is kept (tuned = {})."""
    p = params(cfg)
    pts = [(t, w) for t, w in samples if w is not None]
    if len(pts) < 2:
        return {"days": 0, "cycles": [], "base": None, "tuned": {}, "preset": {k: p[k] for k in PARAMS}}
    step = 10.0
    res = run(samples, p, None, step)
    cyc = res["cycles"]
    t_first, t_last = min(t for t, _w in pts), max(t for t, _w in pts)
    days = max(1, int(math.ceil((max(now or t_last, t_last) - t_first) / 86400 - 0.05)))
    base = res["base"]
    tuned: dict[str, Any] = {}
    if cyc:
        need = max(_min_quiet_window(res["bins"], c["start"], c["main_end"], base + p["end_w"], step) for c in cyc)
        end_min = int(min(30, max(3, math.ceil(max(need + 2, need * 1.25))))) if need else int(p["end_min"])   # a margin over the longest pause
        if end_min > p["end_min"]:   # only longer: a shorter wait would end a program with a longer pause too early
            tuned["end_min"] = end_min
        k_min = min(c["kwh"] for c in cyc)
        if k_min * 0.25 < p["min_kwh"]:
            tuned["min_kwh"] = max(0.01, round(k_min * 0.25, 2))
    # a noisy shared plug: the start margin stays above what the other loads draw for a minute
    idle = []
    bs = res["bins"]
    minute: dict[int, list] = {}
    for t, w in bs:
        if w is not None:
            minute.setdefault(int(t // 60), []).append(w)
    in_cycle = lambda t: any(c["start"] - 120 <= t <= c["end"] + 600 for c in cyc)   # noqa: E731
    for m, ws in minute.items():
        if not in_cycle(m * 60.0):
            idle.append(sum(ws) / len(ws) - base)
    hi = percentile(idle, 0.995) if len(idle) > 60 else None
    if hi is not None and hi > p["start_w"] * 0.8:
        tuned["start_w"] = int(math.ceil((hi + 20) / 10) * 10)
    out = {"days": days, "base": round(base, 1), "short": res["short"],
           "cycles": [{"start": c["start"], "end": c["end"], "min": c["min"], "kwh": c["kwh"]} for c in cyc][-20:],
           "tuned": tuned, "preset": {k: p[k] for k in PARAMS}}
    if cyc:
        out["avg_min"] = round(sum(c["min"] for c in cyc) / len(cyc))
        out["avg_kwh"] = round(sum(c["kwh"] for c in cyc) / len(cyc), 2)
    return out


def base_from(samples: list[tuple[float, float | None]]) -> float | None:
    """A first baseline from history: the 20th percentile of its 1-minute means."""
    bs = bins(samples, 60.0)
    v = [w for _t, w in bs if w is not None]
    return round(percentile(v, BASE_Q), 2) if len(v) >= 10 else None


# ---- the tariff (a port of src/energy.js lpEnMode / lpEnUnit, without the month's total) ----
def _pos(v: Any) -> float:
    try:
        x = float(v)
    except (TypeError, ValueError):
        return 0.0
    return x if x > 0 and math.isfinite(x) else 0.0


def price_at(settings: Any, local_hour: int) -> float | None:
    """The price of a kWh at an hour, from the dashboard's tariff (Enerji → Fiyat ve tarife); None without a price.
    Tiered: the lower price (the page uses the month's average once it knows the month)."""
    e = settings.get("energy") if isinstance(settings, dict) and isinstance(settings.get("energy"), dict) else {}
    bills = [b for b in (e.get("bills") or []) if isinstance(b, dict) and _pos(b.get("kwh")) and _pos(b.get("tl")) and isinstance(b.get("to"), str)]
    bills.sort(key=lambda b: b["to"])
    last = bills[-1] if bills else None
    m = e.get("price_mode") or ("bill" if last else "tier")
    if e.get("sktt_on") and _pos(e.get("sktt_price")):
        return _pos(e.get("sktt_price"))
    if m == "bill" and last:
        return _pos(last["tl"]) / _pos(last["kwh"])
    if m == "tier" and _pos(e.get("low")) and _pos(e.get("high")):
        return _pos(e.get("low"))
    if m == "tou" and _pos(e.get("t_day")) and _pos(e.get("t_peak")) and _pos(e.get("t_night")):
        h = local_hour
        return _pos(e.get("t_day")) if 6 <= h < 17 else _pos(e.get("t_peak")) if 17 <= h < 22 else _pos(e.get("t_night"))
    if m == "single" or not last:
        return _pos(e.get("price")) or None
    return _pos(last["tl"]) / _pos(last["kwh"])


def fmt_num(v: float, dec: int, tr: bool) -> str:
    s = f"{v:.{dec}f}"
    return s.replace(".", ",") if tr else s


def fmt_dur(minutes: float, tr: bool) -> str:
    m = int(round(minutes or 0))
    if m < 60:
        return f"{m} dk" if tr else f"{m} min"
    return (f"{m // 60} sa {m % 60} dk" if tr else f"{m // 60} h {m % 60} min") if m % 60 else (f"{m // 60} sa" if tr else f"{m // 60} h")


DEFAULT_MSG = {"tr": "{name} bitti · {duration} · {kwh} kWh", "en": "{name} finished · {duration} · {kwh} kWh"}
REMIND_MSG = {"tr": "{name} hâlâ boşaltılmadı · {ago} önce bitti", "en": "{name} is still not emptied · finished {ago} ago"}


def message(tpl: str | None, name: str, info: dict, tr: bool, end_local: str = "", remind: bool = False, ago_min: float = 0) -> str:
    """The notification: the user's text (or the default) with {name} {duration} {kwh} {cost} {time} {ago}."""
    t = (tpl or "").strip() or (REMIND_MSG if remind else DEFAULT_MSG)["tr" if tr else "en"]
    if remind and tpl:
        t = REMIND_MSG["tr" if tr else "en"]   # the reminder has its own text
    vals = {
        "name": name,
        "duration": fmt_dur(info.get("min") or 0, tr),
        "kwh": fmt_num(info.get("kwh") or 0, 2, tr),
        "cost": fmt_num(info["cost"], 2, tr) if info.get("cost") else "",
        "time": end_local,
        "ago": fmt_dur(ago_min, tr),
    }
    out = t
    for k, v in vals.items():
        out = out.replace("{" + k + "}", v)
    return out[:300]
