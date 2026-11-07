"""Import from another power-estimating integration (Enerji → Aktar).

Reads that integration's config entries: virtual power entries become the dashboard's devices, groups become
categories. Which device goes into which category follows Home Assistant's Energy settings (included_in_stat)
when they say so, otherwise the group membership. Groups that only hold other groups (a "whole home" total)
are not categories. The imported devices keep their names; their old entries are taken out of the Energy
settings and the dashboard's own sensors go in. Nothing of the other integration is changed or removed;
the user removes it afterwards.
"""
from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import slugify

from . import estimates as EST

SOURCE = "powercalc"


def _entities(reg, entry_id: str) -> list:
    return list(er.async_entries_for_config_entry(reg, entry_id))


def _pick(ents: list, kind: str) -> str | None:
    """The power (W) or energy (kWh) sensor among an entry's entities."""
    for e in ents:
        if e.domain != "sensor":
            continue
        dc = e.device_class or e.original_device_class
        if dc == kind:
            return e.entity_id
    for e in ents:
        if e.domain == "sensor" and e.entity_id.endswith("_" + kind):
            return e.entity_id
    return None


def _uid(base: str, taken: set, prefix: str = "") -> str:
    s = (slugify(base or "") or "cihaz")[:34]
    if s.startswith("kat_") or s in EST.RESERVED:
        s = "c_" + s
    s = prefix + s
    i, out = 2, s
    while out in taken:
        out = f"{s}_{i}"
        i += 1
    taken.add(out)
    return out


def _power_of_energy(hass: HomeAssistant, reg, stat: str, rate: str | None) -> str | None:
    if rate and hass.states.get(rate):
        return rate
    cand = stat.replace("_energy", "_power")
    if cand != stat and hass.states.get(cand):
        return cand
    ent = reg.async_get(stat)
    if ent and ent.device_id:
        for e in er.async_entries_for_device(reg, ent.device_id):
            if e.domain == "sensor" and (e.device_class or e.original_device_class) == "power":
                return e.entity_id
    return None


def plan(hass: HomeAssistant, prefs: dict, existing: dict, cats_now: list) -> dict:
    """What an import would do. prefs: the current energy settings."""
    reg = er.async_get(hass)
    entries = hass.config_entries.async_entries(SOURCE)
    dc = [d for d in (prefs or {}).get("device_consumption") or [] if isinstance(d, dict) and d.get("stat_consumption")]
    by_stat = {d["stat_consumption"]: d for d in dc}
    virt: dict[str, dict] = {}      # entry id → {rec, power, energy}
    groups: list[dict] = []
    stat_owner: dict[str, str] = {}  # energy / power entity → entry id
    for e in entries:
        d = {**(e.data or {}), **(e.options or {})}
        ents = _entities(reg, e.entry_id)
        pw, en = _pick(ents, "power"), _pick(ents, "energy")
        for x in (pw, en):
            if x:
                stat_owner[x] = e.entry_id
        st = str(d.get("sensor_type") or "virtual_power")
        if e.unique_id == "powercalc_global_configuration" or st not in ("virtual_power", "daily_energy", "real_power", "group"):
            continue   # its global settings entry and cost entries are not devices
        if st == "group" or any(k in d for k in ("group_member_sensors", "group_power_entities", "group_energy_entities", "sub_groups")):
            groups.append({"entry": e, "d": d, "power": pw, "energy": en})
            continue
        name = (by_stat.get(en) or {}).get("name") or d.get("name") or e.title
        if st == "daily_energy":
            de = d.get("daily_fixed_energy") if isinstance(d.get("daily_fixed_energy"), dict) else {}
            val = EST._num(de.get("value")) or 0.0
            unit = str(de.get("unit_of_measurement") or "kWh")
            ot = de.get("on_time")   # W for this long a day (a duration or seconds; default the whole day)
            hrs = 24.0
            try:
                if isinstance(ot, dict):
                    hrs = float(ot.get("days", 0)) * 24 + float(ot.get("hours", 0)) + float(ot.get("minutes", 0)) / 60 + float(ot.get("seconds", 0)) / 3600
                elif isinstance(ot, (int, float)):
                    hrs = float(ot) / 3600
            except (TypeError, ValueError):
                hrs = 24.0
            hrs = max(0.0, min(24.0, hrs)) if hrs > 0 else 24.0
            w = val * 1000 / 24 if unit == "kWh" else val * hrs / 24
            rec = {"name": str(name)[:60], "kind": "fixed", "w": round(w, 2)}
        elif st == "real_power":
            src = d.get("entity_id")
            rec = {"name": str(name)[:60], "kind": "meas", "sensor": src, "energy": None}
        else:
            src_state = hass.states.get(d.get("entity_id") or "")
            rec = EST.convert_entry(dict(d, name=name), EST.watts_of(hass.states.get(pw)) if pw else None, src_state)
        if rec:
            virt[e.entry_id] = {"rec": rec, "power": pw, "energy": en}
    gby_energy = {g["energy"]: g for g in groups if g["energy"]}
    gby_entry = {g["entry"].entry_id: g for g in groups}

    def members(g: dict) -> tuple[list[str], list[str]]:
        """Direct device entries and plain (measured) power sensors of a group."""
        d = g["d"]
        dev, plain = [], []
        for m in d.get("group_member_sensors") or []:
            if m in virt:
                dev.append(m)
        for ent in (d.get("group_power_entities") or []) + (d.get("group_energy_entities") or []):
            owner = stat_owner.get(ent)
            if owner in virt:
                dev.append(owner)
            elif owner is None and isinstance(ent, str):
                plain.append(ent)
        return list(dict.fromkeys(dev)), list(dict.fromkeys(plain))

    # categories: groups that hold devices directly (a group of groups is a total, not a category)
    taken_c = {c.get("id") for c in cats_now if isinstance(c, dict)}
    by_name = {str(c.get("name", "")).casefold(): c["id"] for c in cats_now if isinstance(c, dict) and c.get("id")}   # same name: the existing category
    cats, cat_of_group = [], {}
    for g in groups:
        dev, plain = members(g)
        if not dev and not plain:
            continue
        nm = (by_stat.get(g["energy"]) or {}).get("name") or g["d"].get("name") or g["entry"].title
        nm = str(nm)
        if nm.lower().startswith("enerji ") and len(nm) > 7:
            nm = nm[7:]
        k = nm[:60].casefold()
        if k in by_name:
            cat_of_group[g["entry"].entry_id] = by_name[k]
            continue
        cid = _uid(nm, taken_c)
        by_name[k] = cid
        cats.append({"id": cid, "name": nm[:60]})
        cat_of_group[g["entry"].entry_id] = cid
    # each device: the category the energy settings put it in, otherwise its first group
    taken_d = set(existing) | set(EST.RESERVED)
    have = {(v.get("entity") or v.get("sensor") or ""): k for k, v in existing.items() if v.get("entity") or v.get("sensor")}
    names = {str(v.get("name") or "").lower() for v in existing.values()}
    devices, plan_devs, skipped = {}, [], []
    for eid_entry, v in virt.items():
        rec = dict(v["rec"])
        key = rec.get("entity") or rec.get("sensor") or ""
        if (key and key in have) or (not key and str(rec["name"]).lower() in names):
            skipped.append({"name": rec["name"], "why": "exists"})
            continue
        cat = None
        parent = (by_stat.get(v["energy"]) or {}).get("included_in_stat")
        if parent in gby_energy and gby_energy[parent]["entry"].entry_id in cat_of_group:
            cat = cat_of_group[gby_energy[parent]["entry"].entry_id]
        if cat is None:
            for g in groups:
                if g["entry"].entry_id in cat_of_group and eid_entry in members(g)[0]:
                    cat = cat_of_group[g["entry"].entry_id]
                    break
        did = _uid(rec["name"], taken_d)
        check = bool(rec.pop("check", False))
        if cat:
            rec["cat"] = cat
        devices[did] = {k: x for k, x in rec.items() if x is not None}
        plan_devs.append({"id": did, "name": rec["name"], "kind": rec["kind"], "cat": cat, "check": check, "w": round(EST.power(rec, hass.states.get(EST.linked(rec) or "")), 1)})
    # measured devices in the energy settings under one of its groups (with their own kWh sensor), then plain group members
    for d in dc:
        stat = d["stat_consumption"]
        par = d.get("included_in_stat")
        if stat in stat_owner or par not in gby_energy:
            continue
        cid = cat_of_group.get(gby_energy[par]["entry"].entry_id)
        sensor = _power_of_energy(hass, reg, stat, d.get("stat_rate"))
        if not cid or not sensor or sensor in have:
            continue
        nm = d.get("name") or (hass.states.get(stat).attributes.get("friendly_name") if hass.states.get(stat) else stat)
        did = _uid(str(nm), taken_d)
        devices[did] = {"name": str(nm)[:60], "kind": "meas", "sensor": sensor, "energy": stat, "cat": cid}
        have[sensor] = did
        plan_devs.append({"id": did, "name": str(nm)[:60], "kind": "meas", "cat": cid, "check": False, "w": round(EST.watts_of(hass.states.get(sensor)) or 0, 1)})
    for g in groups:
        cid = cat_of_group.get(g["entry"].entry_id)
        if not cid:
            continue
        _dev, plain = members(g)
        for ent in plain:
            st = hass.states.get(ent)
            unit = str((st.attributes if st else {}).get("unit_of_measurement") or "")
            sensor = ent if unit in ("W", "kW") else _power_of_energy(hass, reg, ent, None)
            energy = ent if unit in ("kWh", "Wh") else None
            if not sensor or sensor in have:
                continue
            nm = (st.attributes.get("friendly_name") if st else None) or ent
            did = _uid(str(nm), taken_d)
            devices[did] = {"name": str(nm)[:60], "kind": "meas", "sensor": sensor, "cat": cid, **({"energy": energy} if energy else {})}
            have[sensor] = did
            plan_devs.append({"id": did, "name": str(nm)[:60], "kind": "meas", "cat": cid, "check": False, "w": round(EST.watts_of(hass.states.get(sensor)) or 0, 1)})
    drop = [s for s in by_stat if s in stat_owner]
    # the old total now: the categories' groups, or every device
    old_w = 0.0
    tops = [g for g in groups if g["entry"].entry_id in cat_of_group]
    for g in tops:
        old_w += EST.watts_of(hass.states.get(g["power"] or "")) or 0.0
    if not tops:
        old_w = sum(EST.watts_of(hass.states.get(v["power"] or "")) or 0.0 for v in virt.values())
    cats = [c for c in cats if any(x.get("cat") == c["id"] for x in devices.values())]   # no empty categories
    return {"found": len(entries), "cats": [{"id": c["id"], "name": c["name"], "n": sum(1 for x in devices.values() if x.get("cat") == c["id"])} for c in cats],
            "devices": plan_devs, "skipped": skipped, "drop": drop, "old_w": round(old_w, 1),
            "_records": devices, "_cats": cats}
