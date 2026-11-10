"""Shared measurements (Enerji → Öğren → Havuz): a light model's table without measuring it.

Looked up in order:
  1. the dashboard's own pool (library/library.json in this project's repository, checked by hand every week)
  2. measured profiles already on this Home Assistant (another integration's downloads in .storage)
  3. the open measurement library on GitHub (MIT licensed; its tables are resampled to our grid)
Only numbers are read; everything is validated with the same schema as a local measurement.
"""
from __future__ import annotations

import json
import logging
import time
import zlib
from pathlib import Path
from typing import Any
from urllib.parse import quote

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import energy_import as EI
from . import lut as LUT

_LOGGER = logging.getLogger(__name__)
# v0.32: the pool lives on the 'havuz' branch (the submission check adds to it); main has the copy that came with the code
POOL_URL = "https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/havuz/library/library.json"
POOL_URL_MAIN = "https://raw.githubusercontent.com/mendebur-lemur/lemur-home-dashboard/main/library/library.json"
FAIL_TTL = 600   # a download that failed is tried again after 10 minutes, not after the full ttl
LIB_BASE = "https://raw.githubusercontent.com/bramstroker/homeassistant-powercalc/master/profile_library/"
MAX_BYTES = 8 * 1024 * 1024
MAX_UNZIPPED = 4 * 1024 * 1024   # a table is a few hundred kB; a file that opens to more is not a table (v0.32.1)


def gunzip(data: bytes, limit: int = MAX_UNZIPPED) -> str:
    """A downloaded .gz as text, opened only up to limit: a small file that unpacks to gigabytes must not fill the memory."""
    d = zlib.decompressobj(16 + zlib.MAX_WBITS)
    try:
        out = d.decompress(data, limit + 1)
    except zlib.error as err:
        raise ValueError(str(err)) from err
    if len(out) > limit or d.unconsumed_tail:
        raise ValueError("unpacked file too large")
    return out.decode("utf-8")


def _seg(v: Any) -> str | None:
    """One folder name of the open library for an address: no path parts, nothing that could leave the library."""
    s = str(v or "")
    if not s or len(s) > 120 or s in (".", "..") or "/" in s or "\\" in s or any(ord(c) < 32 for c in s):
        return None
    return quote(s, safe="")
_CACHE: dict[str, tuple[float, Any]] = {}


def norm(s: Any) -> str:
    return "".join(ch for ch in str(s or "").casefold() if ch.isalnum())


async def _get(hass: HomeAssistant, url: str, ttl: float, binary: bool = False) -> Any:
    hit = _CACHE.get(url)
    if hit and time.time() - hit[0] < (ttl if hit[1] is not None else min(ttl, FAIL_TTL)):
        return hit[1]
    sess = async_get_clientsession(hass)
    try:
        async with sess.get(url, timeout=20) as r:
            if r.status != 200:
                _CACHE[url] = (time.time(), None)
                return None
            data = await r.content.read(MAX_BYTES + 1)
    except Exception as err:  # noqa: BLE001 - offline: no pool, the page says so
        _LOGGER.debug("Pool download failed %s: %s", url, err)
        _CACHE[url] = (time.time(), None)
        return None
    if len(data) > MAX_BYTES:
        return None
    if not binary:
        try:
            data = json.loads(data.decode("utf-8"))
        except ValueError:
            data = None
    _CACHE[url] = (time.time(), data)
    return data


def _match_pool(lib: Any, man: str, keys: list[str]) -> dict | None:
    if not isinstance(lib, dict) or not isinstance(lib.get("models"), dict):
        return None
    nm = norm(man)
    for k, e in lib["models"].items():
        if not isinstance(e, dict):
            continue
        mans = [norm(e.get("manufacturer"))] + [norm(x) for x in e.get("manufacturer_aliases") or []]
        ids = [norm(e.get("model"))] + [norm(x) for x in e.get("aliases") or []]
        if (nm in mans or any(m and (m in nm or nm in m) for m in mans)) and any(x and x in ids for x in keys):
            return e
    return None


def _match_lib(idx: Any, man: str, keys: list[str]) -> tuple[str, dict] | None:
    if not isinstance(idx, dict):
        return None
    nm = norm(man)
    for m in idx.get("manufacturers") or []:
        names = [norm(m.get("name")), norm(m.get("full_name")), norm(m.get("dir_name"))] + [norm(x) for x in m.get("aliases") or []]
        if not any(n and (n == nm or n in nm or nm in n) for n in names):
            continue
        for md in m.get("models") or []:
            ids = [norm(md.get("id")), norm(md.get("name"))] + [norm(x) for x in (md.get("aliases") or []) + (md.get("legacy_ids") or [])]
            if any(x and x in ids for x in keys):
                return str(m.get("dir_name") or m.get("name")), md
    return None


async def lookup(hass: HomeAssistant, man: str, model: str, model_id: str = "") -> dict | None:
    """{source, n, agree, lut, standby, min, max, mains_v, name} or None."""
    keys = [k for k in (norm(model_id), norm(model)) if k]
    if not man or not keys:
        return None
    # 1. own pool
    lib = await _get(hass, POOL_URL, 6 * 3600)
    if not isinstance(lib, dict):
        lib = await _get(hass, POOL_URL_MAIN, 6 * 3600)
    e = _match_pool(lib, man, keys)
    if e:
        try:
            tb = LUT.valid_lut(e.get("lut"))
            lo, hi = LUT.span(tb)
            return {"source": "pool", "name": f"{e.get('manufacturer')} {e.get('model')}", "n": int(e.get("n") or 1), "agree": e.get("agree"), "updated": e.get("updated"),
                    "lut": tb, "standby": float(e.get("standby") or 0), "min": round(lo, 2), "max": round(hi, 2), "mains_v": e.get("mains_v"),
                    "strip": bool(e.get("strip")), "per_m": bool(e.get("per_m")), "cap_w": e.get("cap_w")}   # a strip's table is per meter (standby is the controller)
        except Exception:  # noqa: BLE001 - a broken entry is skipped
            pass
    # 2. profiles already downloaded here
    def _local() -> dict | None:
        for mid in [model_id, model]:
            if not mid:
                continue
            for root in (Path(hass.config.path(".storage", "powercalc_profiles")), Path(hass.config.path("powercalc_profiles"))):
                try:
                    p = EI.profile_data(root, man, mid)
                except OSError:
                    p = None
                if p and p.get("lut"):
                    return p
        return None
    p = await hass.async_add_executor_job(_local)
    if p:
        lo, hi = LUT.span(p["lut"])
        return {"source": "library", "name": f"{man} {model_id or model}", "n": 1, "lut": p["lut"], "standby": float(p.get("standby_power") or 0), "min": round(lo, 2), "max": round(hi, 2)}
    # 3. the open library on GitHub
    m = _match_lib(await _get(hass, LIB_BASE + "library.json", 24 * 3600), man, keys)
    if not m:
        return None
    dirn, md = m
    if str(md.get("calculation_strategy") or "") != "lut":
        return None
    d1, d2 = _seg(dirn), _seg(md.get("id"))
    if not d1 or not d2:
        return None
    base = f"{LIB_BASE}{d1}/{d2}/"
    out: dict = {}
    for kind, name in (("ct", "color_temp.csv.gz"), ("hs", "hs.csv.gz"), ("br", "brightness.csv.gz")):
        raw = await _get(hass, base + name, 24 * 3600, binary=True)
        if not raw:
            continue
        try:
            rows = await hass.async_add_executor_job(lambda b=raw: LUT.parse_csv(gunzip(b)))
        except (OSError, EOFError, ValueError):
            continue
        t = LUT.from_csv(kind, rows)
        if t:
            out[kind] = t
    if not out:
        return None
    raw = await _get(hass, base + "effect.csv.gz", 24 * 3600, binary=True)
    if raw:
        try:
            fx = await hass.async_add_executor_job(lambda b=raw: LUT.from_effect_csv(gunzip(b)))
            if fx:
                out["fx"] = fx
        except (OSError, EOFError, ValueError):
            pass
    try:
        tb = LUT.valid_lut(out)
    except Exception:  # noqa: BLE001
        return None
    lo, hi = LUT.span(tb)
    specs = md.get("device_specs") or {}
    return {"source": "library", "name": str(md.get("name") or md.get("id")), "n": 1, "lut": tb, "standby": float(md.get("standby_power") or 0),
            "min": round(lo, 2), "max": round(hi, 2), "mains_v": md.get("mains_voltage"),
            "strip": str(specs.get("form_factor") or "").lower() in ("strip", "lightstrip") or "strip" in str(md.get("name") or "").lower(), "per_m": False, "length_m": None}
