"""Feeding reminders (Besleme kartı).

Pets are set up in the admin panel and stored in the panel data under "pets":
    {id: {name, icon, kind, mode: "interval" | "times", every_h, times: ["08:00", ...],
          soon_min, grace_min, notify: "notify.xxx", feeder: {service, target, data}}}
Feedings are stored under "feed" (any signed-in user can feed, the wall tablet is usually not admin):
    {id: {last: iso, due: iso, log: [{t: iso, by: name}]}}
"due" is computed here (Home Assistant's time zone) so every screen shows the same time.
Status: never (not fed yet), ok, soon (within soon_min before due), due (up to grace_min after), late.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

LOG_MAX = 30
STATUSES = ["ok", "soon", "due", "late", "never"]


def _num(v: Any, default: float) -> float:
    try:
        f = float(v)
    except (TypeError, ValueError):
        return default
    return f if f > 0 else default


def _times(pet: dict) -> list[tuple[int, int]]:
    out = []
    for x in pet.get("times") or []:
        try:
            h, m = str(x).strip().split(":")[:2]
            h, m = int(h), int(m)
        except (ValueError, TypeError):
            continue
        if 0 <= h < 24 and 0 <= m < 60:
            out.append((h, m))
    return sorted(set(out))


def parse(ts: Any) -> datetime | None:
    if not ts:
        return None
    d = dt_util.parse_datetime(str(ts))
    if d is None:
        return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt_util.get_default_time_zone())
    return d


def due_at(pet: dict, last: datetime | None, now: datetime) -> datetime | None:
    """Next feeding time after the last feeding."""
    times = _times(pet)
    if pet.get("mode") == "times" and times:
        # erken besleme (sıradaki saatten en çok soon_min önce) o saati karşılar; hiç beslenmediyse sıradaki saat
        base = dt_util.as_local(last) + timedelta(minutes=_num(pet.get("soon_min"), 60)) if last else dt_util.as_local(now)
        for day in range(0, 3):
            d = (base + timedelta(days=day)).date()
            for h, m in times:
                cand = datetime(d.year, d.month, d.day, h, m, tzinfo=base.tzinfo)
                if cand > base:
                    return cand
        return None
    if last is None:
        return None
    return last + timedelta(hours=_num(pet.get("every_h"), 12))


def status(pet: dict, rec: dict | None, now: datetime) -> str:
    rec = rec or {}
    if not rec.get("last"):
        return "never"
    due = parse(rec.get("due"))
    if due is None:
        due = due_at(pet, parse(rec.get("last")), now)
    if due is None:
        return "never"
    soon = timedelta(minutes=_num(pet.get("soon_min"), 60))
    grace = timedelta(minutes=_num(pet.get("grace_min"), 30))
    if now < due - soon:
        return "ok"
    if now < due:
        return "soon"
    if now < due + grace:
        return "due"
    return "late"


def refresh(pet: dict, rec: dict | None, now: datetime) -> dict:
    """Record with an up-to-date "due" (after a config change, or for a pet never fed in "times" mode)."""
    rec = dict(rec or {})
    due = due_at(pet, parse(rec.get("last")), now)
    rec["due"] = due.isoformat() if due else None
    rec.setdefault("log", [])
    return rec


def fed(pet: dict, rec: dict | None, now: datetime, by: str = "") -> dict:
    rec = dict(rec or {})
    log = list(rec.get("log") or [])
    log.insert(0, {"t": now.isoformat(), "by": by})
    rec["log"] = log[:LOG_MAX]
    rec["last"] = now.isoformat()
    due = due_at(pet, now, now)
    rec["due"] = due.isoformat() if due else None
    return rec


def undo(pet: dict, rec: dict | None, now: datetime) -> dict:
    """Take back the last feeding (a tap by mistake)."""
    rec = dict(rec or {})
    log = list(rec.get("log") or [])
    if log:
        log.pop(0)
    rec["log"] = log
    rec["last"] = log[0]["t"] if log else None
    due = due_at(pet, parse(rec["last"]), now)
    rec["due"] = due.isoformat() if due else None
    return rec
