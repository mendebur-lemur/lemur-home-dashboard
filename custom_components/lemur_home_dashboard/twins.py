"""Backup control (yedek kontrol) and wall switches (duvar anahtarları).

Some lights show up twice in Home Assistant, for example a Govee lamp through govee2mqtt (fast, LAN)
and through Matter (slower, but local and reliable). In the admin panel a light can get a "backup"
twin. Then:

- Commands always go to the light itself first (the fast path).
- Whether the lamp is on is read from whichever of the two changed last: a stuck state on one side
  (govee2mqtt after a Wi-Fi drop) is corrected by the other.
- If the twin does not report the wanted state within a few seconds, the same command is sent to the
  twin. The time of that fallback is kept (in memory) and shown on the dashboard.

Wall switches: a relay (Sonoff, ESPHome...) that is only used as a signal. A physical press (state
change with no user and no parent context) toggles the light with the same safe logic.
Stored in the panel data:
    twins: {light_entity: {"backup": other_light_entity}}
    walls: [{"switch": entity, "light": entity, "brightness": 1-100 (optional), "kelvin": 2000-9000 (optional)}]
"""
from __future__ import annotations

import asyncio
import logging
import re
from typing import Any, Callable

import voluptuous as vol

from homeassistant.core import Context, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

_LOGGER = logging.getLogger(__name__)

CONTROL_DOMAINS = ("light", "switch", "fan", "input_boolean")
WALL_DOMAINS = ("switch", "input_boolean", "binary_sensor", "light")
OFF_WAIT = 2.0      # seconds the twin gets to report "off"
ON_WAIT = 3.0       # seconds the twin gets to report "on" (brightness / colour may follow)
MAX_TWINS = 200
MAX_WALLS = 50

_ENT = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")


def _entity(domains: tuple[str, ...]):
    def check(value: Any) -> str:
        if not isinstance(value, str) or not _ENT.match(value) or value.split(".", 1)[0] not in domains:
            raise vol.Invalid(f"entity must be one of: {', '.join(domains)}")
        return value
    return check


TWINS_SCHEMA = vol.All(
    vol.Schema({_entity(CONTROL_DOMAINS): vol.Schema({vol.Required("backup"): _entity(CONTROL_DOMAINS)}, extra=vol.REMOVE_EXTRA)}),
    vol.Length(max=MAX_TWINS),
)

WALL_SCHEMA = vol.Schema(
    {
        vol.Required("switch"): _entity(WALL_DOMAINS),
        vol.Required("light"): _entity(CONTROL_DOMAINS),
        vol.Optional("brightness"): vol.All(vol.Any(int, float), vol.Range(min=1, max=100)),
        vol.Optional("kelvin"): vol.All(vol.Any(int, float), vol.Range(min=1500, max=9000)),
    },
    extra=vol.REMOVE_EXTRA,
)
WALLS_SCHEMA = vol.All([WALL_SCHEMA], vol.Length(max=MAX_WALLS))


def _onoff(st: State | None) -> bool | None:
    if st is None or st.state not in ("on", "off"):
        return None
    return st.state == "on"


def is_on(hass: HomeAssistant, eid: str, backup: str | None) -> bool:
    """On/off from whichever of the two changed last (a stuck side is corrected by the other)."""
    a, b = hass.states.get(eid), hass.states.get(backup) if backup else None
    va, vb = _onoff(a), _onoff(b)
    if vb is not None and (va is None or b.last_changed > a.last_changed):
        return vb
    return bool(va)


class Twins:
    """Safe on/off for lights that have a backup twin, and the wall switch bindings."""

    def __init__(self, hass: HomeAssistant, get_data: Callable[[], dict], on_fallback: Callable[[str, str], None]) -> None:
        self.hass = hass
        self._get = get_data
        self._on_fallback = on_fallback
        self.fallback: dict[str, str] = {}     # entity → time of the last backup use (iso)
        self._busy: set[str] = set()
        self._unsub: Callable[[], None] | None = None

    # ---- configuration ----
    def twins(self) -> dict:
        t = self._get().get("twins")
        return t if isinstance(t, dict) else {}

    def walls(self) -> list:
        w = self._get().get("walls")
        return [x for x in w if isinstance(x, dict)] if isinstance(w, list) else []

    def backup_of(self, eid: str) -> str | None:
        rec = self.twins().get(eid)
        b = rec.get("backup") if isinstance(rec, dict) else None
        return b if isinstance(b, str) and b != eid else None

    # ---- safe control ----
    async def control(self, eid: str, action: str = "toggle", data: dict | None = None, context: Context | None = None) -> str:
        """Turn a light on/off/toggle. Returns "primary", "backup" or "plain" (no twin)."""
        data = dict(data or {})
        backup = self.backup_of(eid)
        dom = eid.split(".", 1)[0]
        if dom not in CONTROL_DOMAINS:
            raise vol.Invalid(f"{eid}: not a light or switch")
        if action == "toggle":
            target = not is_on(self.hass, eid, backup)
        else:
            target = action == "turn_on"
        svc = "turn_on" if target else "turn_off"
        sdata = data if target and dom == "light" else {}
        await self.hass.services.async_call(dom, svc, {"entity_id": eid, **sdata}, blocking=False, context=context)
        if not backup or self.hass.states.get(backup) is None:
            return "plain"
        if await self._wait(eid, backup, target, ON_WAIT if target else OFF_WAIT):
            return "primary"
        # the fast path did not reach the lamp: same command through the twin
        bdom = backup.split(".", 1)[0]
        bdata = sdata if bdom == "light" else {}
        _LOGGER.warning("%s did not answer, using backup %s (%s)", eid, backup, svc)
        await self.hass.services.async_call(bdom, svc, {"entity_id": backup, **bdata}, blocking=False, context=context)
        now = dt_util.now().isoformat()
        self.fallback[eid] = now
        self._on_fallback(eid, now)
        return "backup"

    async def _wait(self, eid: str, backup: str, target: bool, timeout: float) -> bool:
        """True when the twin (the reliable side) reports the wanted state in time.
        If the twin is unavailable, the light's own state counts."""
        def ok() -> bool:
            vb = _onoff(self.hass.states.get(backup))
            if vb is None:
                return _onoff(self.hass.states.get(eid)) == target
            return vb == target

        if ok():
            return True
        done = asyncio.Event()

        @callback
        def _changed(_ev: Event) -> None:
            if ok():
                done.set()

        unsub = async_track_state_change_event(self.hass, [eid, backup], _changed)
        try:
            await asyncio.wait_for(done.wait(), timeout)
            return True
        except asyncio.TimeoutError:
            return ok()
        finally:
            unsub()

    # ---- wall switches ----
    @callback
    def listen(self) -> None:
        """(Re)subscribe to the wall switches after a change in the settings."""
        self.stop()
        switches = [w["switch"] for w in self.walls() if isinstance(w.get("switch"), str)]
        if switches:
            self._unsub = async_track_state_change_event(self.hass, switches, self._pressed)

    @callback
    def stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    @callback
    def _pressed(self, event: Event) -> None:
        old, new = event.data.get("old_state"), event.data.get("new_state")
        if old is None or new is None or old.state not in ("on", "off") or new.state not in ("on", "off") or old.state == new.state:
            return
        # only a physical press: changes made by a user, an automation or HA itself are ignored
        if new.context.user_id is not None or new.context.parent_id is not None:
            return
        sw = new.entity_id
        for w in self.walls():
            if w.get("switch") != sw or not isinstance(w.get("light"), str):
                continue
            light = w["light"]
            if light in self._busy:      # a press while the previous one is still running is ignored
                continue
            data = {}
            if isinstance(w.get("brightness"), (int, float)):
                data["brightness_pct"] = int(w["brightness"])
            if isinstance(w.get("kelvin"), (int, float)):
                data["color_temp_kelvin"] = int(w["kelvin"])
            self.hass.async_create_task(self._run(light, data, new.context))

    async def _run(self, light: str, data: dict, context: Context) -> None:
        self._busy.add(light)
        try:
            await self.control(light, "toggle", data, Context(parent_id=context.id))
        except Exception as err:  # noqa: BLE001 - a broken lamp must not break the listener
            _LOGGER.warning("Wall switch for %s failed: %s", light, err)
        finally:
            self._busy.discard(light)
