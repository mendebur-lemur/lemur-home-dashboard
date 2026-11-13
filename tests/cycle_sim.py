"""Synthetic plug readings for the cycle tests (tests/test_cycle.py) and the preview (dev/cycle_preview.py).

real(): the owner's two dishwasher cycles (tests/dishwasher_real.json, 1-minute averages) as a Sonoff plug would report
them: a reading every 2 s, only changes reach Home Assistant (state_changed), idle flicker between 0 and 2.8 W, the
heater's partial minutes as a fraction of the minute at full power. Noise on the same plug can be added: the water
purifier's 35-45 W bursts of 1-2 minutes, single false readings of 1714 W.
"""
from __future__ import annotations

import json
import pathlib
import random

REAL = json.loads((pathlib.Path(__file__).parent / "dishwasher_real.json").read_text(encoding="utf-8"))
STEP = 2.0
HEAT_W = 1720.0


def minute_samples(v: float, rng: random.Random, prev: float, nxt: float) -> list[float]:
    """30 readings (2 s) whose mean is about v."""
    n = int(60 / STEP)
    if v < 2:   # idle: 0 with some flicker up to 2.8 W (the light's standby)
        pr = 0.08 if v < 0.5 else min(0.5, v / 2.7)
        return [rng.choice((2.5, 2.6, 2.8)) if rng.random() < pr else 0.0 for _ in range(n)]
    if v <= 60:
        return [round(max(0.0, v + rng.uniform(-0.15, 0.15) * v), 1) for _ in range(n)]
    # a heater minute: on for the fraction v / HEAT_W, the rest at the circulation pump (5 W); the on part is next to
    # the busier neighbour
    f = min(1.0, max(0.0, (v - 5) / (HEAT_W - 5)))
    k = int(round(f * n))
    on = [round(HEAT_W + rng.uniform(-12, 12), 0) for _ in range(k)]
    off = [round(5 + rng.uniform(-0.5, 0.5), 1) for _ in range(n - k)]
    return on + off if prev >= nxt else off + on


def series(minutes: list[float], t0: float = 0.0, seed: int = 1) -> list[tuple[float, float]]:
    rng = random.Random(seed)
    out = []
    for i, v in enumerate(minutes):
        prev = minutes[i - 1] if i else 0.0
        nxt = minutes[i + 1] if i + 1 < len(minutes) else 0.0
        for j, w in enumerate(minute_samples(v, rng, prev, nxt)):
            out.append((t0 + i * 60 + j * STEP, w))
    return out


def add(base: list[tuple[float, float]], t: float, dur: float, w: float, rng: random.Random | None = None) -> None:
    """Another load on the same plug (the purifier): w added for dur seconds from t."""
    for i, (x, v) in enumerate(base):
        if t <= x < t + dur:
            base[i] = (x, round(v + w + (rng.uniform(-3, 3) if rng else 0.0), 1))


def spike(base: list[tuple[float, float]], t: float, w: float = 1714.0) -> None:
    """A single false reading."""
    for i, (x, _v) in enumerate(base):
        if x >= t:
            base[i] = (x, w)
            return


def changes(base: list[tuple[float, float]]) -> list[tuple[float, float]]:
    """What reaches Home Assistant: a new state only when the value changes."""
    out = []
    last = object()
    for t, w in base:
        if w != last:
            out.append((t, w))
            last = w
    return out


def real(which: int = 1, pad_before: int = 60, pad_after: int = 60, seed: int = 1) -> tuple[list[float], int]:
    """The real cycle's 1-minute averages with idle minutes before and after; returns (minutes, index of minute 0)."""
    m = REAL["cycle1_1min_avg_w" if which == 1 else "cycle2_1min_avg_w"]
    return [0.0] * pad_before + list(m) + [0.0] * pad_after, pad_before


def feed(det, pts, tick: float = 30.0, until: float | None = None):
    """Feed readings and 30-second ticks to a detector; returns [(t, event, info)]."""
    ev = []
    nxt = (pts[0][0] if pts else 0.0) + tick
    end = until if until is not None else (pts[-1][0] if pts else 0.0)
    i = 0
    while i < len(pts) or nxt <= end:
        if i < len(pts) and pts[i][0] <= nxt:
            t, w = pts[i]
            ev += [(t, k, x) for k, x in det.feed(t, w)]
            i += 1
        else:
            ev += [(nxt, k, x) for k, x in det.tick(nxt)]
            nxt += tick
    return ev
