"""The loader as a Lovelace resource (v0.34.0, GitHub #21).

While Home Assistant starts, the interface answers before integrations are set up. A page opened in that gap
(about 14 s at home, longer on slow systems) gets an index.html without the files given to add_extra_js_url,
so the dashboard strategy is never defined and the dashboard stays on an error page until it is refreshed.
The list of Lovelace resources is ready as soon as the interface is, so the loader is also registered there.

The integration's own address (/lemur_home_dashboard/...) answers "not found" in that same gap, so the resource
cannot point at it (tried: the dashboard stays broken). The loader is copied to <config>/www/lemur_home_dashboard/
and the resource points at /local/lemur_home_dashboard/..., which Home Assistant serves from the start.

Rules shared with Lemur Light Effect Card (lemur-ortak/ORTAK.md):
only our own rows are touched, one row, updated in place, nothing written when nothing changed, YAML mode left
alone, removed only when the integration is removed, no failure here may stop the setup.
"""
from __future__ import annotations

import logging
import os

from homeassistant.core import HomeAssistant

from .const import LOADER_FILE, URL_BASE, VERSION

_LOGGER = logging.getLogger(__name__)

WWW_DIR = "lemur_home_dashboard"
LOCAL_BASE = f"/local/{WWW_DIR}"
# rows whose address starts with one of these are ours (the second: a row added by hand with the integration's own address)
OWN_PREFIXES = (f"{LOCAL_BASE}/", f"{URL_BASE}/")


def resource_url() -> str:
    return f"{LOCAL_BASE}/{LOADER_FILE}?v={VERSION}"


def _is_ours(item) -> bool:
    url = item.get("url") if isinstance(item, dict) else None
    return isinstance(url, str) and url.startswith(OWN_PREFIXES)


def _collection(hass: HomeAssistant):
    """The storage collection of Lovelace resources, or None (YAML mode, Lovelace not loaded, unknown core)."""
    data = hass.data.get("lovelace")
    if data is None:
        return None
    res = data.get("resources") if isinstance(data, dict) else getattr(data, "resources", None)   # dict before 2025.2
    if res is None:
        return None
    for name in ("async_items", "async_create_item", "async_update_item", "async_delete_item"):
        if not callable(getattr(res, name, None)):
            return None   # YAML mode has only async_items
    return res


async def _loaded(res) -> None:
    if getattr(res, "loaded", True) is False and callable(getattr(res, "async_load", None)):
        await res.async_load()
        res.loaded = True


def _copy_loader(src: str, www: str) -> str:
    """Copy the loader into <config>/www/lemur_home_dashboard. Returns "new" (www did not exist), "ok" or "same"."""
    existed = os.path.isdir(www)
    dst_dir = os.path.join(www, WWW_DIR)
    dst = os.path.join(dst_dir, LOADER_FILE)
    with open(src, "rb") as fh:
        body = fh.read()
    try:
        with open(dst, "rb") as fh:
            if fh.read() == body:
                return "same"
    except OSError:
        pass
    os.makedirs(dst_dir, exist_ok=True)
    tmp = dst + ".tmp"
    with open(tmp, "wb") as fh:
        fh.write(body)
    os.replace(tmp, dst)
    return "ok" if existed else "new"


def _remove_copy(www: str) -> None:
    dst_dir = os.path.join(www, WWW_DIR)
    try:
        os.remove(os.path.join(dst_dir, LOADER_FILE))
    except OSError:
        pass
    try:
        os.rmdir(dst_dir)   # only when empty; the www folder itself is never removed
    except OSError:
        pass


async def async_register(hass: HomeAssistant) -> str:
    """Make sure the loader is a Lovelace resource. Never raises. Returns what happened (for the log and tests)."""
    try:
        src = os.path.join(os.path.dirname(__file__), "frontend", LOADER_FILE)
        copied = await hass.async_add_executor_job(_copy_loader, src, hass.config.path("www"))
        res = _collection(hass)
        if res is None:
            return "skipped"
        await _loaded(res)
        mine = [it for it in (res.async_items() or []) if _is_ours(it)]
        if copied == "new" and not mine:
            # Home Assistant serves /local only when the www folder existed at start: until the next restart the
            # address would answer "not found" on every page. The row is added at the next start.
            return "next-start"
        url = resource_url()
        keep = next((it for it in mine if it.get("url") == url and it.get("type") == "module"), None) or (mine[0] if mine else None)
        result = "same"
        if keep is None:
            await res.async_create_item({"res_type": "module", "url": url})
            result = "created"
        elif keep.get("url") != url or keep.get("type") != "module":
            await res.async_update_item(keep["id"], {"res_type": "module", "url": url})
            result = "updated"
        for it in mine:
            if keep is not None and it.get("id") != keep.get("id"):
                await res.async_delete_item(it["id"])
                result = "updated" if result == "same" else result
        return result
    except Exception as err:  # noqa: BLE001  (core internals change between versions; the setup must go on)
        _LOGGER.info("Loader was not registered as a dashboard resource: %s", err)
        return "failed"


async def async_unregister(hass: HomeAssistant) -> None:
    """Remove our rows and the copied loader (the integration is being removed). Never raises."""
    try:
        res = _collection(hass)
        if res is not None:
            await _loaded(res)
            for it in [it for it in (res.async_items() or []) if _is_ours(it)]:
                await res.async_delete_item(it["id"])
    except Exception as err:  # noqa: BLE001
        _LOGGER.info("Dashboard resource was not removed: %s", err)
    try:
        await hass.async_add_executor_job(_remove_copy, hass.config.path("www"))
    except Exception as err:  # noqa: BLE001
        _LOGGER.info("Copied loader was not removed: %s", err)
