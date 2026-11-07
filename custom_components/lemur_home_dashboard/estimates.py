"""Estimated power for devices that do not measure it (Enerji → Tahmini cihazlar).

Each estimate gets a power sensor (W) and an energy sensor (kWh) in Home Assistant, so it can be added to
Home Assistant's Energy settings like any measured device. Kinds:
  light   idle W when off, idle + (max - idle) * brightness when on (brightness read from the linked light)
  onoff   off W / on W, by the linked entity's state
  fixed   always the same W
  year    the label's kWh per year, as an average (kWh / 8.76 = W)
  cycle   the label's kWh per 100 cycles and cycles per week, as an average
"""
from __future__ import annotations

from typing import Any

import voluptuous as vol

KINDS = ("light", "onoff", "fixed", "year", "cycle")
MAX_ESTIMATES = 100
HOURS_PER_YEAR = 8760
# states that mean "off" for the on / off kinds (media players sit in idle / standby when not playing)
OFF_STATES = ("off", "unavailable", "unknown", "standby", "idle", "closed", "docked", "none", "")

_W = vol.All(vol.Coerce(float), vol.Range(min=0, max=50000))
ESTIMATE_SCHEMA = vol.Schema(
    {
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=60)),
        vol.Required("kind"): vol.In(KINDS),
        vol.Optional("entity"): vol.Any(None, "", vol.All(str, vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"))),
        vol.Optional("icon"): vol.All(str, vol.Match(r"^[a-z]+:[a-z0-9-]+$")),
        vol.Optional("idle"): _W,
        vol.Optional("max"): _W,
        vol.Optional("off"): _W,
        vol.Optional("on"): _W,
        vol.Optional("w"): _W,
        vol.Optional("year"): vol.All(vol.Coerce(float), vol.Range(min=0, max=100000)),
        vol.Optional("k100"): vol.All(vol.Coerce(float), vol.Range(min=0, max=10000)),
        vol.Optional("week"): vol.All(vol.Coerce(float), vol.Range(min=0, max=100)),
        vol.Optional("cat"): vol.Any(None, "", vol.All(str, vol.Length(max=255))),
    },
    extra=vol.REMOVE_EXTRA,
)
ESTIMATES_SCHEMA = vol.All(
    vol.Schema({vol.Match(r"^[a-z0-9_]{1,40}$"): ESTIMATE_SCHEMA}),
    vol.Length(max=MAX_ESTIMATES),
)


def _f(est: dict, key: str, default: float = 0.0) -> float:
    try:
        v = float(est.get(key, default) or 0)
    except (TypeError, ValueError):
        return default
    return v if v == v and v >= 0 else default


def power(est: dict, state: Any = None) -> float:
    """Watts now. state: the linked entity's state object (or None)."""
    kind = est.get("kind")
    if kind == "fixed":
        return _f(est, "w")
    if kind == "year":
        return _f(est, "year") * 1000 / HOURS_PER_YEAR
    if kind == "cycle":
        return _f(est, "k100") / 100 * _f(est, "week") * 52 * 1000 / HOURS_PER_YEAR
    on = state is not None and str(state.state) not in OFF_STATES
    if kind == "light":
        idle, mx = _f(est, "idle"), _f(est, "max")
        if not on:
            return idle
        bri = state.attributes.get("brightness") if state is not None else None
        try:
            frac = max(0.0, min(1.0, float(bri) / 255)) if bri is not None else 1.0
        except (TypeError, ValueError):
            frac = 1.0
        return idle + (max(mx, idle) - idle) * frac
    if kind == "onoff":
        return _f(est, "on") if on else _f(est, "off")
    return 0.0


def kwh(watts: float, seconds: float) -> float:
    """Energy of a constant power over a time span."""
    if seconds <= 0 or watts <= 0:
        return 0.0
    return watts * seconds / 3600 / 1000
