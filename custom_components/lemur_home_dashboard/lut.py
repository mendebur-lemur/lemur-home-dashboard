"""Light power tables (Enerji → Öğren, the shared pool, imports).

A table (stored in a light device's record as "lut") holds measured watts:
  ct  white tones:  {"k": [kelvin...], "b": [brightness %...], "w": [[w per b] per k]}
  hs  colors:       {"h": [hue°...], "s": [saturation %...], "b": [...], "w": [[[w per b] per h] per s]}
  br  brightness only: {"b": [...], "w": [...]}
  fx  the light's own effects: {"e": {effect: watts at 100%}, "avg": watts, "b": [brightness %...], "r": [share of
      the 100% watts...]} (an older table may hold one number). Effects not measured use avg; r scales by brightness
The power now is read from the table for the light's current mode, interpolated between the measured points.
Tables made by the other integration's measuring (CSV: bri 0-255, mired or hue 0-65535 and sat 0-255, watt) are
resampled to the same grid.
"""
from __future__ import annotations

import math
from typing import Any

import voluptuous as vol

BRI = [1, 5, 10, 25, 40, 60, 80, 100]
KS = [2200, 2700, 4000, 5000, 6500]
HUES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
HUES6 = [0, 60, 120, 180, 240, 300]
SATS = [100, 50]
HS_MODES = ("hs", "xy", "rgb", "rgbw", "rgbww")
MAX_W = 50000.0


# ---- schema: only numbers in bounded lists ----
def _nums(v: Any, n_max: int, lo: float = 0.0, hi: float = MAX_W) -> list[float]:
    if not isinstance(v, list) or not 0 < len(v) <= n_max:
        raise vol.Invalid("bad list")
    out = []
    for x in v:
        if isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x) or not lo <= x <= hi:
            raise vol.Invalid("bad number")
        out.append(float(x))
    return out


def _sorted(v: list[float]) -> list[float]:
    if any(b <= a for a, b in zip(v, v[1:])):
        raise vol.Invalid("axis must increase")
    return v


def valid_lut(v: Any) -> dict:
    """The table as stored, or vol.Invalid."""
    if not isinstance(v, dict) or not v or set(v) - {"ct", "hs", "br", "fx"}:
        raise vol.Invalid("bad table")
    out: dict = {}
    if "ct" in v:
        t = v["ct"]
        if not isinstance(t, dict):
            raise vol.Invalid("bad ct")
        k, b = _sorted(_nums(t.get("k"), 40, 1000, 10000)), _sorted(_nums(t.get("b"), 16, 0, 100))
        w = t.get("w")
        if not isinstance(w, list) or len(w) != len(k):
            raise vol.Invalid("bad ct rows")
        out["ct"] = {"k": k, "b": b, "w": [_nums(r, len(b)) if isinstance(r, list) and len(r) == len(b) else _bad() for r in w]}
    if "hs" in v:
        t = v["hs"]
        if not isinstance(t, dict):
            raise vol.Invalid("bad hs")
        h, s, b = _sorted(_nums(t.get("h"), 24, 0, 359.99)), _nums(t.get("s"), 4, 1, 100), _sorted(_nums(t.get("b"), 16, 0, 100))
        w = t.get("w")
        if not isinstance(w, list) or len(w) != len(s) or any(not isinstance(x, list) or len(x) != len(h) for x in w):
            raise vol.Invalid("bad hs rows")
        out["hs"] = {"h": h, "s": s, "b": b, "w": [[_nums(r, len(b)) if isinstance(r, list) and len(r) == len(b) else _bad() for r in x] for x in w]}
    if "br" in v:
        t = v["br"]
        if not isinstance(t, dict):
            raise vol.Invalid("bad br")
        b = _sorted(_nums(t.get("b"), 16, 0, 100))
        w = _nums(t.get("w"), 16)
        if len(w) != len(b):
            raise vol.Invalid("bad br rows")
        out["br"] = {"b": b, "w": w}
    if "fx" in v:
        out["fx"] = _valid_fx(v["fx"])
    if not any(k in out for k in ("ct", "hs", "br")):
        raise vol.Invalid("empty table")
    return out


def _valid_fx(f: Any) -> Any:
    if isinstance(f, (int, float)) and not isinstance(f, bool):
        return _nums([f], 1)[0]
    if not isinstance(f, dict) or set(f) - {"e", "avg", "b", "r"}:
        raise vol.Invalid("bad fx")
    e = f.get("e") or {}
    if not isinstance(e, dict) or len(e) > 300:
        raise vol.Invalid("bad fx list")
    out: dict = {"e": {}}
    for k, w in e.items():
        if not isinstance(k, str) or not 0 < len(k) <= 60:
            raise vol.Invalid("bad effect name")
        out["e"][k] = _nums([w], 1)[0]
    out["avg"] = _nums([f.get("avg") if f.get("avg") is not None else (sum(out["e"].values()) / len(out["e"]) if out["e"] else 0)], 1)[0]
    if f.get("b") is not None or f.get("r") is not None:
        b, r = _sorted(_nums(f.get("b"), 12, 0, 100)), _nums(f.get("r"), 12, 0, 5)
        if len(b) != len(r):
            raise vol.Invalid("bad fx curve")
        out["b"], out["r"] = b, r
    return out


def _bad():
    raise vol.Invalid("bad row")


# ---- interpolation ----
def _lin(xs: list[float], ys: list[float], x: float) -> float:
    if len(xs) == 1 or x <= xs[0]:
        return ys[0]
    if x >= xs[-1]:
        return ys[-1]
    for i in range(1, len(xs)):
        if x <= xs[i]:
            a, b = xs[i - 1], xs[i]
            return ys[i - 1] + (ys[i] - ys[i - 1]) * (x - a) / (b - a)
    return ys[-1]


def _hue(hs: list[float], ys: list[float], h: float) -> float:
    """Around the color circle."""
    h %= 360
    if len(hs) == 1:
        return ys[0]
    xs = hs + [hs[0] + 360]
    vs = ys + [ys[0]]
    if h < xs[0]:
        h += 360
    return _lin(xs, vs, h)


def _num(v: Any) -> float | None:
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return x if math.isfinite(x) else None


def power(lut: dict, attrs: dict) -> float | None:
    """Watts of a light that is on, from its table and its attributes (brightness, color mode, color). None: no table fits."""
    if not isinstance(lut, dict):
        return None
    bri = _num(attrs.get("brightness"))
    b = 100.0 if bri is None else max(0.0, min(100.0, bri / 255 * 100))
    fx = attrs.get("effect")
    if lut.get("fx") is not None and fx not in (None, "", "None", "none", "off", "Off", "solid", "Solid"):
        f = lut["fx"]
        if not isinstance(f, dict):
            return float(f)
        w = f["e"].get(str(fx), f.get("avg", 0.0))
        r = _lin(f["b"], f["r"], b) if f.get("b") else (b / 100 if b < 100 else 1.0)
        return w * r
    mode = str(attrs.get("color_mode") or "")
    hs = attrs.get("hs_color")
    if lut.get("hs") and (mode in HS_MODES or (not mode and hs)) and isinstance(hs, (list, tuple)) and len(hs) == 2:
        t = lut["hs"]
        h, s = _num(hs[0]) or 0.0, _num(hs[1]) or 0.0
        per_s = [_hue(t["h"], [_lin(t["b"], row, b) for row in plane], h) for plane in t["w"]]
        order = sorted(range(len(t["s"])), key=lambda i: t["s"][i])
        return _lin([t["s"][i] for i in order], [per_s[i] for i in order], s)
    if lut.get("ct"):
        t = lut["ct"]
        k = _num(attrs.get("color_temp_kelvin"))
        if k is None and _num(attrs.get("color_temp")):
            k = 1e6 / _num(attrs.get("color_temp"))
        if k is None:
            k = t["k"][len(t["k"]) // 2]
        return _lin(t["k"], [_lin(t["b"], row, b) for row in t["w"]], k)
    if lut.get("br"):
        return _lin(lut["br"]["b"], lut["br"]["w"], b)
    if lut.get("hs"):   # a color-only light shown in white: the least saturated row at its middle hue
        t = lut["hs"]
        i = min(range(len(t["s"])), key=lambda j: t["s"][j])
        return sum(_lin(t["b"], row, b) for row in t["w"][i]) / len(t["h"])
    return None


def span(lut: dict) -> tuple[float, float]:
    """Lowest and highest watts in a table (for the simple model and the cards)."""
    vals: list[float] = []
    for key in ("ct", "br"):
        t = lut.get(key)
        if t:
            vals += [x for r in (t["w"] if key == "ct" else [t["w"]]) for x in r]
    t = lut.get("hs")
    if t:
        vals += [x for p in t["w"] for r in p for x in r]
    f = lut.get("fx")
    if isinstance(f, dict) and f.get("e"):
        vals += list(f["e"].values())
    return (min(vals), max(vals)) if vals else (0.0, 0.0)


def count(lut: dict) -> int:
    n = 0
    if lut.get("ct"):
        n += len(lut["ct"]["k"]) * len(lut["ct"]["b"])
    if lut.get("hs"):
        n += len(lut["hs"]["s"]) * len(lut["hs"]["h"]) * len(lut["hs"]["b"])
    if lut.get("br"):
        n += len(lut["br"]["b"])
    if isinstance(lut.get("fx"), dict):
        n += len(lut["fx"].get("e") or {})
    return n


# ---- resampling a measured CSV table to our grid ----
def _near(rows: list[tuple], b255: float):
    """Rows at the brightness level closest to b255 (the CSVs are measured on a brightness grid)."""
    levels = sorted({r[0] for r in rows})
    lv = min(levels, key=lambda x: abs(x - b255))
    return [r for r in rows if r[0] == lv]


def from_csv(kind: str, rows: list[tuple]) -> dict | None:
    """kind 'ct': (bri, mired, watt); 'hs': (bri, hue 0-65535, sat 0-255, watt); 'br': (bri, watt)."""
    rows = [r for r in rows if all(isinstance(x, (int, float)) and math.isfinite(x) for x in r)]
    if not rows:
        return None
    if kind == "br":
        return {"b": BRI, "w": [round(min(_near(rows, b * 2.55), key=lambda r: 0)[1], 2) for b in BRI]}
    if kind == "ct":
        # the white tones the profile was measured at (its curve can bend sharply between two of them), at most 40
        mireds = sorted({r[1] for r in rows if r[1] > 0})
        if not mireds:
            return None
        if len(mireds) > 40:
            mireds = [mireds[round(i * (len(mireds) - 1) / 39)] for i in range(40)]
        grid = sorted({min(10000, max(1000, int(round(1e6 / m / 10.0) * 10))) for m in mireds})
        w = []
        for k in grid:
            m = 1e6 / k
            row = []
            for b in BRI:
                cand = _near(rows, b * 2.55)
                row.append(round(min(cand, key=lambda r: abs(r[1] - m))[2], 2))
            w.append(row)
        return {"k": [float(k) for k in grid], "b": [float(b) for b in BRI], "w": w}
    if kind == "hs":
        w = []
        for s in SATS:
            plane = []
            for h in HUES:
                hv, sv = h / 360 * 65535, s * 2.55
                row = []
                for b in BRI:
                    cand = _near(rows, b * 2.55)
                    best = min(cand, key=lambda r: min(abs(r[1] - hv), 65535 - abs(r[1] - hv)) / 65535 * 3 + abs(r[2] - sv) / 255)
                    row.append(round(best[3], 2))
                plane.append(row)
            w.append(plane)
        return {"h": [float(h) for h in HUES], "s": [float(s) for s in SATS], "b": [float(b) for b in BRI], "w": w}
    return None


def from_effect_csv(text: str) -> dict | None:
    """effect.csv (effect, bri 0-255, watt) → fx: each effect at full brightness and the median brightness curve."""
    by: dict[str, dict[float, float]] = {}
    for i, line in enumerate(text.splitlines()):
        parts = line.split(",")
        if i == 0 or len(parts) != 3:
            continue
        try:
            by.setdefault(parts[0].strip()[:60], {})[float(parts[1])] = float(parts[2])
        except ValueError:
            continue
    by.pop("off", None)
    by.pop("None", None)
    if not by:
        return None
    e = {}
    ratios: dict[int, list[float]] = {}
    for name, pts in list(by.items())[:300]:
        bs = sorted(pts)
        top = pts[bs[-1]]
        if top <= 0:
            continue
        e[name] = round(top, 2)
        for pct in (10, 25, 50, 75, 100):
            ratios.setdefault(pct, []).append(_lin(bs, [pts[x] for x in bs], pct * 2.55) / top)
    if not e:
        return None
    med = lambda v: sorted(v)[len(v) // 2]  # noqa: E731
    return {"e": e, "avg": round(sum(e.values()) / len(e), 2), "b": [10.0, 25.0, 50.0, 75.0, 100.0], "r": [round(med(ratios[p]), 3) for p in (10, 25, 50, 75, 100)]}


def parse_csv(text: str) -> list[tuple]:
    out = []
    for i, line in enumerate(text.splitlines()):
        if i == 0 or not line.strip():
            continue
        try:
            out.append(tuple(float(x) for x in line.split(",")))
        except ValueError:
            continue
    return out
