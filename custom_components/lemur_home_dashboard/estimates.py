"""Energy devices and categories of the dashboard (Enerji sayfası).

Devices (data["estimates"]): every device the dashboard tracks, measured or virtual.
  meas    the device measures itself: its own power sensor (and kWh sensor if it has one; otherwise
          the dashboard counts kWh from the power)
  light   idle W when off, min + (max - min) * brightness when on (brightness read from the linked light)
  states  a W value per state of the linked entity (playing 95, paused 70, idle 28 ...), "other" for the rest
  onoff   off W / on W, by the linked entity's state
  fixed   always the same W
  year    the label's kWh per year, as an average (kWh / 8.76 = W)
  cycle   the label's kWh per 100 cycles and cycles per week, as an average
Every virtual device gets sensor.lhd_<id>_power and sensor.lhd_<id>_energy; a measured device without its own
kWh sensor gets sensor.lhd_<id>_energy. Categories (data["ecats"]) get sensor.lhd_kat_<id>_power and _energy:
the sum of their devices. Solar production without a kWh sensor gets sensor.lhd_solar_energy.
Home Assistant's Energy settings are kept in step (sync_prefs): categories and devices as individual devices,
solar production as a solar source. Entries the dashboard did not make are kept as they are.
"""
from __future__ import annotations

import math
from typing import Any

import voluptuous as vol

from . import lut as LUT

KINDS = ("meas", "light", "states", "onoff", "fixed", "year", "cycle")
MAX_ESTIMATES = 200
MAX_CATS = 40
HOURS_PER_YEAR = 8760
# states that mean "off" for the on / off kinds (media players sit in idle / standby when not playing)
OFF_STATES = ("off", "unavailable", "unknown", "standby", "idle", "closed", "docked", "none", "")
RESERVED = ("solar",)
MAX_W = 50000.0   # a power reading above this is a wrong reading, not usage

_ENT = vol.All(str, vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"))
_OPT_ENT = vol.Any(None, "", _ENT)
_W = vol.All(vol.Coerce(float), vol.Range(min=0, max=50000))
_ID = vol.Match(r"^(?!kat_)[a-z0-9_]{1,40}$")
ESTIMATE_SCHEMA = vol.Schema(
    {
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Required("kind"): vol.In(KINDS),
        vol.Optional("entity"): _OPT_ENT,
        vol.Optional("sensor"): _OPT_ENT,
        vol.Optional("energy"): _OPT_ENT,
        vol.Optional("icon"): vol.All(str, vol.Match(r"^[a-z]+:[a-z0-9-]+$")),
        vol.Optional("idle"): _W,
        vol.Optional("min"): _W,
        vol.Optional("max"): _W,
        vol.Optional("off"): _W,
        vol.Optional("on"): _W,
        vol.Optional("w"): _W,
        vol.Optional("other"): _W,
        vol.Optional("states"): vol.All([vol.Schema({vol.Required("s"): vol.All(str, vol.Length(min=1, max=40)), vol.Required("w"): _W})], vol.Length(max=24)),
        vol.Optional("year"): vol.All(vol.Coerce(float), vol.Range(min=0, max=100000)),
        vol.Optional("k100"): vol.All(vol.Coerce(float), vol.Range(min=0, max=10000)),
        vol.Optional("week"): vol.All(vol.Coerce(float), vol.Range(min=0, max=100)),
        vol.Optional("cat"): vol.Any(None, "", vol.All(str, vol.Match(r"^[a-z0-9_]{1,40}$"))),
        vol.Optional("lut"): LUT.valid_lut,   # measured table of a light (Öğren, pool, import)
        vol.Optional("src"): vol.All(str, vol.Length(max=40)),   # where the table came from: own | pool | library | import
    },
    extra=vol.REMOVE_EXTRA,
)


def _no_reserved(v: dict) -> dict:
    for k in v:
        if k in RESERVED:
            raise vol.Invalid(f"{k} is reserved")
    return v


ESTIMATES_SCHEMA = vol.All(vol.Schema({_ID: ESTIMATE_SCHEMA}), vol.Length(max=MAX_ESTIMATES), _no_reserved)
ECAT_SCHEMA = vol.Schema(
    {
        vol.Required("id"): vol.All(str, vol.Match(r"^[a-z0-9_]{1,40}$")),
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Optional("color"): vol.All(str, vol.Match(r"^#[0-9a-fA-F]{6}$")),
        vol.Optional("icon"): vol.All(str, vol.Match(r"^[a-z]+:[a-z0-9-]+$")),
    },
    extra=vol.REMOVE_EXTRA,
)


def _unique_ids(v: list) -> list:
    ids = [c["id"] for c in v]
    if len(ids) != len(set(ids)):
        raise vol.Invalid("category ids must be unique")
    return v


ECATS_SCHEMA = vol.All([ECAT_SCHEMA], vol.Length(max=MAX_CATS), _unique_ids)


def _f(est: dict, key: str, default: float = 0.0) -> float:
    try:
        v = float(est.get(key, default) if est.get(key) is not None else default)
    except (TypeError, ValueError):
        return default
    return v if v == v and v >= 0 else default


def watts_of(state: Any) -> float | None:
    """A power sensor's state in W (kW converted); None when it has no number."""
    if state is None:
        return None
    try:
        v = float(state.state)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(v):
        return None
    unit = str((state.attributes or {}).get("unit_of_measurement") or "")
    return v * 1000 if unit == "kW" else v / 1000 if unit == "mW" else v


def power(est: dict, state: Any = None) -> float:
    """Watts now. state: the linked entity's state object (or the device's own power sensor for 'meas')."""
    kind = est.get("kind")
    if kind == "meas":
        w = watts_of(state)
        return max(0.0, w) if w is not None else 0.0
    if kind == "fixed":
        return _f(est, "w")
    if kind == "year":
        return _f(est, "year") * 1000 / HOURS_PER_YEAR
    if kind == "cycle":
        return _f(est, "k100") / 100 * _f(est, "week") * 52 * 1000 / HOURS_PER_YEAR
    if kind == "states":
        s = str(state.state) if state is not None else "unavailable"
        for row in est.get("states") or []:
            if isinstance(row, dict) and str(row.get("s")) == s:
                return _f(row, "w")
        return _f(est, "other")
    on = state is not None and str(state.state) not in OFF_STATES
    if kind == "light":
        idle, mx = _f(est, "idle"), _f(est, "max")
        if not on:
            return idle
        if est.get("lut") and state is not None:
            w = LUT.power(est["lut"], dict(state.attributes or {}))
            if w is not None:
                return max(0.0, w)
        lo = _f(est, "min", idle) if est.get("min") is not None else idle
        bri = state.attributes.get("brightness") if state is not None else None
        try:
            frac = max(0.0, min(1.0, float(bri) / 255)) if bri is not None else 1.0
        except (TypeError, ValueError):
            frac = 1.0
        return lo + (max(mx, lo) - lo) * frac
    if kind == "onoff":
        return _f(est, "on") if on else _f(est, "off")
    return 0.0


def kwh(watts: float, seconds: float) -> float:
    """Energy of a constant power over a time span."""
    if seconds <= 0 or watts <= 0:
        return 0.0
    return watts * seconds / 3600 / 1000


def linked(est: dict) -> str | None:
    """The entity whose state drives the device: its own power sensor (meas) or the device it follows."""
    kind = est.get("kind")
    if kind == "meas":
        return est.get("sensor") or None
    if kind in ("light", "states", "onoff"):
        return est.get("entity") or None
    return None


def power_entity(eid: str, est: dict) -> str:
    """The device's power sensor: its own (meas) or the dashboard's."""
    return (est.get("sensor") or f"sensor.lhd_{eid}_power") if est.get("kind") == "meas" else f"sensor.lhd_{eid}_power"


def energy_entity(eid: str, est: dict) -> str:
    """The device's kWh sensor: its own (meas with one) or the dashboard's."""
    return (est.get("energy") or f"sensor.lhd_{eid}_energy") if est.get("kind") == "meas" else f"sensor.lhd_{eid}_energy"


def needs_power_sensor(est: dict) -> bool:
    return est.get("kind") != "meas"


def needs_energy_sensor(est: dict) -> bool:
    return not (est.get("kind") == "meas" and est.get("energy"))


def solar_cfg(settings: dict) -> dict:
    e = settings.get("energy") if isinstance(settings, dict) else None
    s = e.get("solar") if isinstance(e, dict) else None
    return s if isinstance(s, dict) else {}


def solar_energy_entity(settings: dict) -> str | None:
    s = solar_cfg(settings)
    sun = s.get("sun") if "sun" in s else bool(s.get("prod"))   # güneş ve batarya ayrı açılır; eski kayıtta yalnız "on"
    if not s.get("on") or not sun or not s.get("prod"):
        return None
    return s.get("prod_energy") or "sensor.lhd_solar_energy"


def meter_cfg(settings: dict) -> dict:
    """The whole-home meter picked in the dashboard: energy (kWh from the grid), out (kWh to the grid)."""
    e = settings.get("energy") if isinstance(settings, dict) else None
    m = e.get("meter") if isinstance(e, dict) else None
    return m if isinstance(m, dict) else {}


def build_prefs(prefs: dict, ests: dict, cats: list, settings: dict, owned: str | None = None, owned_grid: str | None = None) -> dict:
    """Energy settings with the dashboard's categories, devices and solar source; other entries kept.
    owned: the solar statistic the dashboard wrote last time (taken out if it changed)."""
    dc_old = [d for d in (prefs or {}).get("device_consumption") or [] if isinstance(d, dict)]
    old_by = {d.get("stat_consumption"): d for d in dc_old}
    mine = set()
    rows = []
    cat_ids = {c["id"] for c in cats if isinstance(c, dict) and c.get("id")}
    for c in cats:
        if not isinstance(c, dict) or not c.get("id"):
            continue
        st = f"sensor.lhd_kat_{c['id']}_energy"
        mine.add(st)
        row = {"stat_consumption": st, "stat_rate": f"sensor.lhd_kat_{c['id']}_power", "name": str(c.get("name") or c["id"])}
        up = (old_by.get(st) or {}).get("included_in_stat")   # the user put the category under a meter in HA: keep it
        if up and not str(up).startswith("sensor.lhd_"):
            row["included_in_stat"] = up
        rows.append(row)
    for eid, est in ests.items():
        st = energy_entity(eid, est)
        if st in mine:
            continue
        mine.add(st)
        row = {"stat_consumption": st, "stat_rate": power_entity(eid, est), "name": str(est.get("name") or eid)}
        if est.get("cat") in cat_ids:
            row["included_in_stat"] = f"sensor.lhd_kat_{est['cat']}_energy"
        rows.append(row)
    keep = [dict(d) for d in dc_old if d.get("stat_consumption") not in mine and not str(d.get("stat_consumption", "")).startswith("sensor.lhd_")]
    # an entry kept from before may point into one of ours that no longer exists; a category only sums its own devices
    present = {d.get("stat_consumption") for d in keep} | mine
    for d in keep:
        p = d.get("included_in_stat")
        if p and (p not in present or str(p).startswith("sensor.lhd_")):
            d.pop("included_in_stat", None)
    for r in rows:   # a category row kept under a meter that is gone
        if r.get("included_in_stat") and r["included_in_stat"] not in present:
            r.pop("included_in_stat", None)
    srcs = [s for s in list((prefs or {}).get("energy_sources") or []) if isinstance(s, dict)]
    sol = solar_energy_entity(settings)
    old = [s for s in srcs if s.get("type") == "solar" and (str(s.get("stat_energy_from", "")).startswith("sensor.lhd_") or s.get("stat_energy_from") in (sol, owned))]
    fc = next((s.get("config_entry_solar_forecast") for s in old if s.get("config_entry_solar_forecast")), None)   # keep the forecast link
    srcs = [s for s in srcs if not any(s is o for o in old)]
    if sol:
        row = {"type": "solar", "stat_energy_from": sol, "config_entry_solar_forecast": fc}
        if solar_cfg(settings).get("prod"):
            row["stat_rate"] = solar_cfg(settings)["prod"]
        srcs.append(row)
    # şebeke: panelde seçilen ev sayacı. HA'da tek şebeke kaynağı olur; kullanıcının kendi kurduğu başka bir sayaç varsa ona dokunulmaz
    m = meter_cfg(settings)
    grid = next((x for x in srcs if x.get("type") == "grid"), None)
    mine_grid = bool(grid) and owned_grid and any(f.get("stat_energy_from") == owned_grid for f in grid.get("flow_from") or [])
    if grid is not None and mine_grid and m.get("energy") != owned_grid:   # sayaç değişti ya da kaldırıldı: bizim yazdığımız çıkar
        grid = dict(grid)
        grid["flow_from"] = [f for f in grid.get("flow_from") or [] if f.get("stat_energy_from") != owned_grid]
        srcs = [grid if x.get("type") == "grid" else x for x in srcs]
        if not grid["flow_from"]:   # bizim kurduğumuz kaynak: verilen sayacıyla birlikte kalkar
            srcs = [x for x in srcs if x.get("type") != "grid"]
        grid = next((x for x in srcs if x.get("type") == "grid"), None)
    if m.get("energy"):
        flow = {"stat_energy_from": m["energy"], "stat_cost": None, "entity_energy_price": None, "number_energy_price": None}
        if grid is None:
            row = {"type": "grid", "flow_from": [flow], "flow_to": [], "cost_adjustment_day": 0.0}
            if m.get("out"):
                row["flow_to"] = [{"stat_energy_to": m["out"], "stat_compensation": None, "entity_energy_price": None, "number_energy_price": None}]
            srcs.append(row)
        elif not grid.get("flow_from"):
            g2 = dict(grid)
            g2["flow_from"] = [flow]
            srcs = [g2 if x.get("type") == "grid" else x for x in srcs]
    return {"energy_sources": srcs, "device_consumption": rows + keep}


def meter_written(prefs: dict, settings: dict) -> str:
    """The statistic the dashboard owns in the grid source after build_prefs (empty if the user's own meter is there)."""
    m = meter_cfg(settings).get("energy") or ""
    for x in (prefs or {}).get("energy_sources") or []:
        if isinstance(x, dict) and x.get("type") == "grid" and any(f.get("stat_energy_from") == m for f in x.get("flow_from") or []):
            return m
    return ""


# ---- import from another power-estimating integration (its config entries) ----
def _num(v: Any) -> float | None:
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return x if x == x and x >= 0 else None


def convert_entry(d: dict, power_now: float | None, src_state: Any) -> dict | None:
    """One virtual power entry → a device record (without id / category). None when it is not a device."""
    ent = d.get("entity_id") or ""
    name = str(d.get("name") or "").strip()
    mode = str(d.get("mode") or "").lower()
    standby = _num(d.get("standby_power")) or 0.0
    dom = ent.split(".")[0] if "." in ent else ""
    fixed = d.get("fixed") if isinstance(d.get("fixed"), dict) else {}
    linear = d.get("linear") if isinstance(d.get("linear"), dict) else {}
    out: dict = {"name": name[:60] or ent or "?"}
    if ent in ("", "sensor.dummy") or dom in ("sensor", "binary_sensor") and mode == "fixed" and not fixed.get("states_power"):
        w = _num(fixed.get("power"))
        out.update(kind="fixed", w=w if w is not None else (power_now or 0.0))
        return out
    if mode == "fixed":
        # the other integration counts only off / standby / unavailable as off; any other state draws the fixed power
        sp = fixed.get("states_power") if isinstance(fixed.get("states_power"), dict) else {}
        w = _num(fixed.get("power"))
        if w is None and not sp:
            w = power_now or 0.0
        if not sp and dom in ("switch", "light", "input_boolean"):
            out.update(kind="onoff", entity=ent, on=w, off=standby)
            return out
        rows = []
        for s, wv in list(sp.items())[:20]:
            v = _num(wv)
            if v is not None and isinstance(s, str) and s:
                rows.append({"s": s[:40], "w": v})
        rows += [{"s": s, "w": standby} for s in ("off", "standby", "unavailable") if s not in sp]
        out.update(kind="states", entity=ent, states=rows[:24], other=w if w is not None else standby)
        return out
    if mode == "linear" and linear.get("calibrate") and linear.get("max_power") is None:   # "10 -> 1.02" list
        vals = [v for v in (_num(str(x).split("->")[-1]) for x in linear.get("calibrate") or []) if v is not None]
        if vals:
            linear = {**linear, "min_power": min(vals), "max_power": max(vals)}
    if mode == "linear" and d.get("only_playing"):   # counts only while playing (speakers): the middle of its range then
        mn, mx = _num(linear.get("min_power")) or 0.0, _num(linear.get("max_power")) or 0.0
        out.update(kind="states", entity=ent, states=[{"s": "playing", "w": round((mn + mx) / 2, 2)}], other=standby)
        return out
    if dom == "light" and isinstance(d.get("lut"), dict):   # a measured table: kept as it is
        try:
            tb = LUT.valid_lut(d["lut"])
        except vol.Invalid:
            tb = None
        if tb:
            lo, hi = LUT.span(tb)
            out.update(kind="light", entity=ent, idle=standby, min=round(lo, 2), max=round(hi, 2), lut=tb, src="import")
            return out
    if mode == "linear" and dom == "light":
        mn, mx = _num(linear.get("min_power")), _num(linear.get("max_power"))
        out.update(kind="light", entity=ent, idle=standby, min=mn if mn is not None else standby, max=mx if mx is not None else (power_now or 10.0))
        return out
    if mode == "linear":
        mx = _num(linear.get("max_power"))
        out.update(kind="onoff", entity=ent, on=mx if mx is not None else (power_now or 0.0), off=standby)
        return out
    if dom == "light":
        # measured lookup table: turned into the straight-line model from what it draws now
        mx = 10.0
        if power_now is not None and src_state is not None and str(src_state.state) == "on":
            bri = (src_state.attributes or {}).get("brightness")
            try:
                f = max(0.05, float(bri) / 255) if bri is not None else 1.0
            except (TypeError, ValueError):
                f = 1.0
            mx = round(standby + (power_now - standby) / f, 1)
        out.update(kind="light", entity=ent, idle=standby, max=max(mx, standby), check=True)
        return out
    is_off = src_state is None or str(src_state.state) in OFF_STATES
    out.update(kind="onoff", entity=ent, on=0.0 if is_off else (power_now or 0.0), off=(power_now or standby) if is_off else standby, check=True)
    return out
