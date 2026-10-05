"""Checks for what the admin panel stores (same rules as src/safe.js in the browser).

Pets run services on their own: the feeder when someone taps "fed" (also a non-admin wall tablet),
the notification when a pet is late. So the stored pets are validated: allowed feeder domains only,
a notify.* target, sane numbers. Tabs come from the admin panel or a backup file: a popup may only
hold a card (no ready HTML), an url action only an http(s) address or a path.
"""
from __future__ import annotations

import re
from typing import Any

import voluptuous as vol

FEEDER_DOMAINS = (
    "switch", "button", "input_button", "timer", "script", "fan",
    "number", "select", "esphome", "notify", "input_boolean", "light",
)
PET_KINDS = ("cat", "dog", "fish", "bird", "rabbit", "turtle", "other")
MAX_PETS = 50
FEED_MIN_SECONDS = 60

_SVC_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
_ENT_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
NOTIFY_RE = re.compile(r"^notify\.[a-z0-9_]+$")
_URL_RE = re.compile(r"^(https?://[^\s\"'<>]+|/(?!/)[^\s\"'<>]*)$", re.I)


def safe_feeder_service(value: Any) -> bool:
    return isinstance(value, str) and bool(_SVC_RE.match(value)) and value.split(".", 1)[0] in FEEDER_DOMAINS


def _feeder_service(value: Any) -> str:
    if not safe_feeder_service(value):
        raise vol.Invalid(f"feeder service must be one of: {', '.join(FEEDER_DOMAINS)}")
    return value


def _number(lo: float, hi: float):
    return vol.All(vol.Any(int, float), vol.Range(min=lo, max=hi))


_ENTITY = vol.All(str, vol.Match(_ENT_RE))

FEEDER_SCHEMA = vol.Schema(
    {
        vol.Required("service"): _feeder_service,
        vol.Optional("target"): vol.Any(_ENTITY, vol.All([_ENTITY], vol.Length(max=20))),
        vol.Optional("data"): dict,
    }
)

PET_SCHEMA = vol.Schema(
    {
        vol.Optional("name"): vol.All(str, vol.Length(max=60)),
        vol.Optional("icon"): vol.All(str, vol.Match(r"^[a-z]+:[a-z0-9-]+$")),
        vol.Optional("kind"): vol.In(PET_KINDS),
        vol.Optional("mode"): vol.In(("interval", "times")),
        vol.Optional("every_h"): _number(0, 720),
        vol.Optional("soon_min"): _number(0, 1440),
        vol.Optional("grace_min"): _number(0, 1440),
        vol.Optional("times"): vol.All([vol.All(str, vol.Match(r"^\d{1,2}:\d{2}$"))], vol.Length(max=24)),
        vol.Optional("notify"): vol.Any(None, "", vol.All(str, vol.Match(r"^notify\.[a-z0-9_]+$"))),
        vol.Optional("feeder"): vol.Any(None, FEEDER_SCHEMA),
    },
    extra=vol.REMOVE_EXTRA,
)

PETS_SCHEMA = vol.All(
    vol.Schema({vol.Match(r"^[a-z0-9_-]{1,40}$"): PET_SCHEMA}),
    vol.Length(max=MAX_PETS),
)


def clean_action(action: Any) -> Any:
    if not isinstance(action, dict):
        return action
    out = dict(action)
    popup = out.get("popup")
    if isinstance(popup, dict):
        p: dict[str, Any] = {}
        if isinstance(popup.get("title"), str):
            p["title"] = popup["title"][:200]
        if isinstance(popup.get("card"), dict):
            p["card"] = popup["card"]
        out["popup"] = p
    elif "popup" in out:
        del out["popup"]
    if out.get("action") == "url" and not (isinstance(out.get("url_path"), str) and _URL_RE.match(out["url_path"])):
        out.pop("url_path", None)
    return out


def _num_or_drop(sec: dict, key: str, ok) -> None:
    if key not in sec:
        return
    try:
        v = float(sec[key])
    except (TypeError, ValueError):
        v = None
    if v is None or v != v or not ok(v):
        del sec[key]
    else:
        sec[key] = int(v) if v == int(v) else v


def clean_tabs(tabs: Any) -> list:
    """Tabs → sections → items: actions cleaned, grow / gap numbers. Unknown fields are kept."""
    if not isinstance(tabs, list):
        return []
    out = []
    for tab in tabs[:60]:
        if not isinstance(tab, dict):
            continue
        T = dict(tab)
        secs = []
        for sec in tab.get("sections") if isinstance(tab.get("sections"), list) else []:
            if not isinstance(sec, dict):
                continue
            S = dict(sec)
            _num_or_drop(S, "grow", lambda v: 0 < v < 100)
            _num_or_drop(S, "gap", lambda v: 0 <= v <= 60)
            items = []
            for it in sec.get("entities") if isinstance(sec.get("entities"), list) else []:
                if isinstance(it, str):
                    items.append(it)
                elif isinstance(it, dict):
                    I = dict(it)
                    for k in ("tap", "hold", "action"):
                        if k in I:
                            I[k] = clean_action(I[k])
                    items.append(I)
            S["entities"] = items[:200]
            secs.append(S)
        T["sections"] = secs[:80]
        out.append(T)
    return out


def public_data(data: dict) -> dict:
    """What a non-admin user gets: pets without the feeder service and the notification target."""
    pets = data.get("pets")
    if not isinstance(pets, dict) or not pets:
        return data
    slim = {}
    for pid, pet in pets.items():
        if isinstance(pet, dict):
            slim[pid] = {k: v for k, v in pet.items() if k not in ("feeder", "notify")}
    out = dict(data)
    out["pets"] = slim
    return out
