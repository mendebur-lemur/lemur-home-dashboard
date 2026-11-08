"""Shared checks for submitted light measurements (check.py on every submission, review.py weekly).
Only numbers and fixed fields are read; free text in a submission is never used."""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "custom_components" / "lemur_home_dashboard"))
import lut as LUT  # noqa: E402  (no Home Assistant needed)

GENERIC = re.compile(r"^(extended color light|color light|dimmable light|color temperature light|on/off light|light|lamp|bulb|led|strip|rgb|rgbw|rgbww|unknown|generic)$", re.I)
MAX_BY_FORM = {"bulb": 40.0, "spot": 25.0, "strip_per_m": 30.0, "other": 300.0}


def parse(body: str) -> dict | None:
    """The JSON block of an issue made from the template."""
    if not isinstance(body, str) or len(body) > 60000:
        return None
    m = re.search(r"```(?:json)?\s*(\{.*\})\s*```", body, re.S) or re.search(r"(\{.*\})", body, re.S)
    if not m:
        return None
    try:
        v = json.loads(m.group(1))
    except ValueError:
        return None
    return v if isinstance(v, dict) else None


def _s(v, n=80) -> str:
    return str(v)[:n] if isinstance(v, (str, int, float)) and not isinstance(v, bool) else ""


def key(p: dict) -> str:
    m = p.get("model") or {}
    return (re.sub(r"[^a-z0-9]", "", _s(m.get("manufacturer")).casefold()) + "|" + re.sub(r"[^a-z0-9]", "", (_s(m.get("model_id")) or _s(m.get("model"))).casefold()))


def check(p: dict) -> tuple[list[str], dict]:
    """Problems (empty: format is fine) and the cleaned submission."""
    errs: list[str] = []
    if not isinstance(p, dict) or p.get("v") != 1:
        return ["biçim sürümü yok / no format version"], {}
    m = p.get("model") if isinstance(p.get("model"), dict) else {}
    man, mod, mid = _s(m.get("manufacturer")), _s(m.get("model")), _s(m.get("model_id"))
    if not man or not (mod or mid):
        errs.append("marka ya da model yok / brand or model missing")
    if (mod and GENERIC.match(mod.strip())) and not mid:
        errs.append("model adı belirsiz / the model name is generic")
    try:
        tb = LUT.valid_lut(p.get("lut"))
    except Exception as err:  # noqa: BLE001
        return errs + [f"tablo geçersiz / table invalid: {err}"], {}
    sb = p.get("standby")
    # v0.28.8+: prizin okuyamadığı bekleme "ölçülemedi" olarak boş (null) gelir, standby_floor ile; geçerli sayılır, havuzda 0 olarak
    # tutulur (inceleme 0.1 W altını yok sayar, pano kendi tabanını kullanır). Hue Play gönderimi bu yüzden reddedilmişti.
    if sb is None and p.get("standby_floor") is True:
        sb = 0.0
    if not isinstance(sb, (int, float)) or isinstance(sb, bool) or not math.isfinite(sb) or not 0 <= sb <= 20:
        errs.append("bekleme gücü geçersiz / standby invalid")
        sb = 0.0
    lo, hi = LUT.span(tb)
    strip = bool(p.get("strip"))
    ln = p.get("length_m")
    if strip and (not isinstance(ln, (int, float)) or isinstance(ln, bool) or not 0.1 <= ln <= 50):
        errs.append("şerit uzunluğu yok / strip length missing")
    cap = p.get("adapter_w")
    if cap is not None and (not isinstance(cap, (int, float)) or isinstance(cap, bool) or not 1 <= cap <= 2000):
        errs.append("adaptör gücü geçersiz / adapter power invalid")
    if sb > hi:
        errs.append("bekleme en yüksek güçten büyük / standby above the highest power")
    if strip and isinstance(ln, (int, float)) and ln > 0 and (hi - sb) / ln > MAX_BY_FORM["strip_per_m"]:
        errs.append("metre başına güç çok yüksek / power per meter too high")
    if not strip and hi > MAX_BY_FORM["other"]:
        errs.append("güç bir ışık için çok yüksek / too much power for a light")
    # parlaklık arttıkça güç artmalı (küçük gürültüye izin var)
    rows = []
    if tb.get("ct"):
        rows += tb["ct"]["w"]
    if tb.get("hs"):
        rows += [r for p2 in tb["hs"]["w"] for r in p2]
    if tb.get("br"):
        rows.append(tb["br"]["w"])
    bad = sum(1 for r in rows for a, b in zip(r, r[1:]) if b < a * 0.85 - 0.2)
    if rows and bad > max(2, len(rows) // 5):
        errs.append("parlaklık arttıkça güç düşüyor / power falls as brightness rises")
    flat = len({round(x, 2) for r in rows for x in r})
    if rows and flat <= 2:
        errs.append("tablo düz / the table is flat")
    caps = p.get("caps") if isinstance(p.get("caps"), dict) else {}
    clean = {"key": key(p), "manufacturer": man, "model": mod, "model_id": mid, "integration": _s((m or {}).get("integration"), 40),
             "caps": {"color_modes": [x for x in caps.get("color_modes") or [] if isinstance(x, str)][:8], "kelvin": [x for x in (caps.get("kelvin") or [])[:2] if isinstance(x, (int, float))],
                      "effects": caps.get("effects") if isinstance(caps.get("effects"), int) else None, "sw": _s(caps.get("sw"), 40)},
             "mains_v": p.get("mains_v") if p.get("mains_v") in (120, 230) else 230, "standby": float(sb), "lut": tb, "strip": strip,
             "length_m": float(ln) if strip and isinstance(ln, (int, float)) else None, "adapter_w": float(cap) if isinstance(cap, (int, float)) and not isinstance(cap, bool) else None,
             "plug": {k: _s(v, 60) for k, v in (p.get("plug") or {}).items() if k in ("manufacturer", "model")} if isinstance(p.get("plug"), dict) else {},
             "samples": {k: v for k, v in (p.get("samples") or {}).items() if k in ("n", "settle_s", "repeats", "diff") and isinstance(v, (int, float))} if isinstance(p.get("samples"), dict) else {},
             "hi": round(hi, 2), "lo": round(lo, 2)}
    return errs, clean


def per_meter(c: dict) -> dict:
    """A strip's table for 1 m: standby stays, the rest divided by the length."""
    if not c.get("strip") or not c.get("length_m"):
        return c["lut"]
    k, sb = 1.0 / c["length_m"], c["standby"]
    f = lambda w: round(sb + max(0.0, w - sb) * k, 3)  # noqa: E731
    t = json.loads(json.dumps(c["lut"]))
    if t.get("ct"):
        t["ct"]["w"] = [[f(x) for x in r] for r in t["ct"]["w"]]
    if t.get("hs"):
        t["hs"]["w"] = [[[f(x) for x in r] for r in p2] for p2 in t["hs"]["w"]]
    if t.get("br"):
        t["br"]["w"] = [f(x) for x in t["br"]["w"]]
    if t.get("fx") is not None:
        t["fx"] = f(t["fx"])
    return t
