"""Appliance cycles in Home Assistant (cycle.py runs the detector): one tracker per tracked device, its entities.

Per tracked device (estimates[id].cycle.on, a measured device with its own power sensor):
  sensor.lhd_<id>_cycle      idle / running / done (enum, translated: Boş / Çalışıyor / Bitti), with the cycle's
                             start, finish, elapsed minutes, kWh, cost (the dashboard's tariff), count, average length
  button.lhd_<id>_emptied    done → idle ("Boşaltıldı"); also: the next cycle starts, the door sensor opens after the
                             finish, or the auto-clear after clear_h hours
Both sit on a device of their own (the appliance, under this integration).
The trackers' state (data["cycles"]) is saved: a restart in the middle of a cycle goes on with its start and energy.
Saved at once on a decision (start, done, cleared ...), every SAVE_S while a cycle runs, when Home Assistant stops and
on unload; never for the readings of an idle plug (the whole store was written every 30 seconds).
A notification (notify entities: notify.send_message; legacy notify.<name> services) is sent once per cycle; a failing
target is logged and never stops the tracking.
"""
from __future__ import annotations

import logging
import time
from datetime import timedelta
from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.util import dt as dt_util

from . import cycle as CY
from . import estimates as EST
from .const import DOMAIN, SIGNAL_EST

_LOGGER = logging.getLogger(__name__)
SIGNAL_CYCLE = f"{DOMAIN}_cycle"
TICK_S = 30
SAVE_S = 300             # a running cycle's energy is saved this often (a restart loses at most this much)
HISTORY_DAYS = 30        # "suggest from history" reads this far back (the recorder keeps 10 days by default)
SEED_HOURS = 24          # the first baseline
KIND_ICON = {"dishwasher": "mdi:dishwasher", "washer": "mdi:washing-machine", "dryer": "mdi:tumble-dryer", "washer_dryer": "mdi:washing-machine", "other": "mdi:stove"}


def _tr(hass: HomeAssistant) -> bool:
    return (hass.config.language or "").lower().startswith("tr")


def _iso(t: Any) -> str | None:
    return dt_util.as_local(dt_util.utc_from_timestamp(float(t))).isoformat(timespec="seconds") if isinstance(t, (int, float)) else None


def _hhmm(t: Any) -> str:
    return dt_util.as_local(dt_util.utc_from_timestamp(float(t))).strftime("%H:%M") if isinstance(t, (int, float)) else ""


def device_info(eid: str, est: dict, tr: bool) -> dict:
    return {"identifiers": {(DOMAIN, f"cycle_{eid}")}, "name": est.get("name") or eid, "manufacturer": "Lemur Home Dashboard",
            "model": "Döngü takibi" if tr else "Cycle tracking", "entry_type": dr.DeviceEntryType.SERVICE}


class Tracker:
    """One tracked device: its detector, the power sensor and door it follows, its notifications."""

    def __init__(self, mgr: "CycleManager", eid: str, est: dict) -> None:
        self.mgr = mgr
        self.hass = mgr.hass
        self.eid = eid
        self.est = est
        rt = mgr.runtime(eid)
        self.det = CY.Detector(CY.params(est.get("cycle")), rt, self._price)
        self._unsubs: list = []
        self._key = None

    @property
    def cfg(self) -> dict:
        c = self.est.get("cycle")
        return c if isinstance(c, dict) else {}

    def _price(self, t: float) -> float | None:
        try:
            return CY.price_at(self.mgr.data.data.get("settings") or {}, dt_util.as_local(dt_util.utc_from_timestamp(t)).hour)
        except Exception:  # noqa: BLE001 - a broken tariff gives no cost, not a broken tracker
            return None

    def update(self, est: dict) -> None:
        """The device's record changed (editor saved): new values, maybe another sensor or door."""
        self.est = est
        self.det.p = CY.params(est.get("cycle"))
        key = (est.get("sensor"), self.cfg.get("door") or None)
        if key != self._key:
            self.stop()
            self._key = key
            ids = [x for x in key if x]
            if ids:
                self._unsubs.append(async_track_state_change_event(self.hass, ids, self._changed))
            st = self.hass.states.get(est.get("sensor") or "")
            if st is not None:
                self.handle(self.det.feed(time.time(), EST.watts_of(st)))

    def stop(self) -> None:
        for u in self._unsubs:
            u()
        self._unsubs = []
        self._key = None

    @callback
    def _changed(self, event) -> None:
        ent = event.data.get("entity_id")
        new = event.data.get("new_state")
        t = new.last_updated.timestamp() if new is not None else time.time()
        if ent == self.est.get("sensor"):
            self.handle(self.det.feed(t, EST.watts_of(new)))
            self.mgr.dirty(self.eid, False)
            return
        if ent == self.cfg.get("door") and new is not None and new.state == "on":
            old = event.data.get("old_state")
            fin = self.det.rt.get("finished")
            if self.det.state == "done" and (old is None or old.state != "on") and (not isinstance(fin, (int, float)) or t >= fin):
                self.handle(self.det.clear("door"))
            elif old is None or old.state != "on":
                self._early("door")

    def _early(self, reason: str) -> bool:
        """The door opened (or Emptied was pressed) while the machine still dries (the tail): it counts as emptied once
        "done" arrives. Not if the machine goes on with the wash (resume)."""
        r = self.det.rt
        if r["state"] != "running" or r.get("phase") != "tail":
            return False
        r["emptied"] = reason
        self.mgr.dirty(self.eid, True)
        return True

    def tick(self, t: float) -> None:
        self.handle(self.det.tick(t))
        r, c = self.det.rt, self.cfg
        if r["state"] == "done":
            ch = c.get("clear_h") or 0
            det_t = r.get("detected") or r.get("finished")
            if ch and isinstance(det_t, (int, float)) and t - det_t >= ch * 3600:
                self.handle(self.det.clear("auto"))
                return
            n = c.get("notify") if isinstance(c.get("notify"), dict) else {}
            rh = n.get("remind_h") or 0
            fin = r.get("finished")
            if n.get("on") and rh and isinstance(fin, (int, float)) and t - fin >= rh * 3600 and not r.get("reminded"):
                r["reminded"] = t
                self.mgr.dirty(self.eid, True)
                self._notify(remind=True, ago=(t - fin) / 60)
        if r["state"] == "running":
            async_dispatcher_send(self.hass, SIGNAL_CYCLE, self.eid)   # elapsed minutes and kWh go on

    def press(self) -> bool:
        ev = self.det.clear("button")
        self.handle(ev)
        return bool(ev) or self._early("button")

    def handle(self, events: list) -> None:
        if not events:
            return
        for kind, info in events:
            _LOGGER.debug("Cycle %s: %s %s", self.eid, kind, info)
            r = self.det.rt
            if kind in ("start", "resume", "short"):
                r.pop("emptied", None)
            if kind == "done":
                n = self.cfg.get("notify") if isinstance(self.cfg.get("notify"), dict) else {}
                if n.get("on") and n.get("targets") and r.get("notified") != r.get("start"):
                    r["notified"] = r.get("start")   # once per cycle, before sending (a restart does not send it again)
                    self._notify()
                early = r.pop("emptied", None)
                if early:   # emptied while it dried: no "done" left to clear, no reminder
                    _LOGGER.debug("Cycle %s: clear %s (while drying)", self.eid, early)
                    self.det.clear(str(early))
        self.mgr.dirty(self.eid, True)
        async_dispatcher_send(self.hass, SIGNAL_CYCLE, self.eid)

    def _notify(self, remind: bool = False, ago: float = 0) -> None:
        n = self.cfg.get("notify") if isinstance(self.cfg.get("notify"), dict) else {}
        info = self.det.rt.get("last") or {}
        msg = CY.message(n.get("msg"), self.est.get("name") or self.eid, info, _tr(self.hass), _hhmm(info.get("end")), remind, ago)
        self.hass.async_create_task(self.mgr.async_send(list(n.get("targets") or []), msg))


class CycleManager:
    def __init__(self, hass: HomeAssistant, data) -> None:
        self.hass = hass
        self.data = data
        self.trackers: dict[str, Tracker] = {}
        self._unsubs: list = []
        self._dirty = False      # readings changed the trackers' state since the last save
        self._saved = time.monotonic()
        self._stop_unsub = None
        self.sent: list = []   # (target, message, ok) of the last sends (tests, the test button)

    def runtime(self, eid: str) -> dict:
        cy = self.data.data.get("cycles")
        if not isinstance(cy, dict):
            cy = self.data.data["cycles"] = {}
        rt = cy.get(eid)
        if not isinstance(rt, dict):
            rt = cy[eid] = {}
        return rt

    def start(self) -> None:
        self.sync()
        self._unsubs.append(async_dispatcher_connect(self.hass, SIGNAL_EST, self.sync))
        self._unsubs.append(async_track_time_interval(self.hass, self._tick, timedelta(seconds=TICK_S)))
        self._stop_unsub = self.hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, self._on_stop)

    @callback
    def _on_stop(self, _event=None) -> None:
        """Home Assistant stops: what the readings changed since the last save (energy so far, the baseline) is written
        with the store's final write."""
        self._stop_unsub = None
        if self._dirty:
            self._save()

    def _save(self) -> None:
        self._dirty = False
        self._saved = time.monotonic()
        self.data.store.async_delay_save(lambda: self.data.data, 1.0)

    def stop(self) -> None:
        for u in self._unsubs:
            u()
        self._unsubs = []
        if self._stop_unsub is not None:
            self._stop_unsub()
            self._stop_unsub = None
        for tr in self.trackers.values():
            tr.stop()

    @callback
    def sync(self) -> None:
        ests = self.data.estimates()
        want = {k: e for k, e in ests.items() if CY.tracked(e)}
        for k in list(self.trackers):
            if k not in want:
                self.trackers.pop(k).stop()
                cy = self.data.data.get("cycles")
                if isinstance(cy, dict):
                    cy.pop(k, None)
                dev = dr.async_get(self.hass).async_get_device(identifiers={(DOMAIN, f"cycle_{k}")})
                if dev is not None:
                    dr.async_get(self.hass).async_remove_device(dev.id)
                self.dirty(k, True)
        cy = self.data.data.get("cycles")
        if isinstance(cy, dict):   # records of devices that are gone (removed while the integration was not running)
            for k in [k for k in cy if k not in want]:
                cy.pop(k, None)
        for k, e in want.items():
            tr = self.trackers.get(k)
            if tr is None:
                tr = self.trackers[k] = Tracker(self, k, e)
                if tr.det.rt.get("base") is None:
                    self.hass.async_create_task(self._seed(k))
            tr.update(e)
        async_dispatcher_send(self.hass, SIGNAL_CYCLE, None)

    async def _seed(self, eid: str) -> None:
        """A first baseline from the last day of the power sensor's history (no history: learned while idle)."""
        tr = self.trackers.get(eid)
        if tr is None:
            return
        try:
            pts = await history(self.hass, tr.est.get("sensor"), SEED_HOURS / 24)
            b = await self.hass.async_add_executor_job(CY.base_from, pts) if pts else None
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("No history for the baseline of %s: %s", eid, err)
            return
        tr = self.trackers.get(eid)
        if tr is not None and b is not None:
            tr.det.seed_base(b)
            self.dirty(eid, True)
            async_dispatcher_send(self.hass, SIGNAL_CYCLE, eid)

    @callback
    def _tick(self, _now=None) -> None:
        t = time.time()
        for tr in list(self.trackers.values()):
            try:
                tr.tick(t)
            except Exception as err:  # noqa: BLE001 - one broken tracker must not stop the others
                _LOGGER.warning("Cycle %s: %s", tr.eid, err)
        if self._dirty and time.monotonic() - self._saved >= SAVE_S and any(x.det.state == "running" for x in self.trackers.values()):
            self._save()

    def dirty(self, eid: str, now: bool) -> None:
        """The tracker's state changed: saved within a second on a decision. A reading only marks it: saved every
        SAVE_S while a cycle runs, when Home Assistant stops and on unload; an idle plug writes nothing."""
        if now:
            self._save()
        else:
            self._dirty = True

    def press(self, eid: str) -> bool:
        tr = self.trackers.get(eid)
        return tr.press() if tr is not None else False

    async def async_send(self, targets: list, msg: str) -> list:
        """One message to each target; never raises. Notify entities get notify.send_message (Home Assistant's
        current way), names without an entity the legacy notify.<name> service."""
        out = []
        for tgt in targets:
            ok, err = True, ""
            try:
                if not isinstance(tgt, str) or not tgt.startswith("notify."):
                    raise ValueError("not a notify target")
                name = tgt.split(".", 1)[1]
                if self.hass.states.get(tgt) is not None:
                    await self.hass.services.async_call("notify", "send_message", {"message": msg}, blocking=True, target={"entity_id": tgt})
                elif self.hass.services.has_service("notify", name):
                    await self.hass.services.async_call("notify", name, {"message": msg}, blocking=True)
                else:
                    raise ValueError("unknown notify target")
            except Exception as err2:  # noqa: BLE001 - a failing target never breaks the tracking
                ok, err = False, str(err2) or type(err2).__name__
                _LOGGER.warning("Cycle notification to %s failed: %s", tgt, err)
            out.append({"target": tgt, "ok": ok, "error": err})
            self.sent.append((tgt, msg, ok))
        del self.sent[:-50]
        return out

    # ---- what the entities show ----
    def view(self, eid: str) -> dict:
        tr = self.trackers.get(eid)
        if tr is None:
            return {"state": "idle", "attrs": {}}
        r = tr.det.rt
        t = time.time()
        lv = tr.det.live(t)
        last = r.get("last") if isinstance(r.get("last"), dict) else {}
        running = r["state"] == "running"
        attrs = {
            "lhd_cycle": True,
            "kind": tr.det.p.get("kind"),
            "started": _iso(r.get("start")) if running else _iso(last.get("start")),
            "finished": None if running else _iso(last.get("end")),
            "elapsed": int(lv["elapsed"]) if lv["elapsed"] is not None else None,   # whole minutes: one change a minute
            "phase": r.get("phase") if running else None,
            "energy_kwh": round(lv["kwh"], 2) if running else last.get("kwh"),
            "cost": round(r.get("cost") or 0, 2) if running and r.get("cost") else (None if running else last.get("cost")),
            "duration": None if running else last.get("min"),
            "cycle_count": int(r.get("count") or 0),
            "avg_minutes": r.get("avg_min"),
            "baseline_w": round(tr.det.base, 1),
            "power_sensor": tr.est.get("sensor"),
            "door": tr.cfg.get("door") or None,
            "emptied_button": f"button.lhd_{eid}_emptied",
            "device": eid,
            "device_name": tr.est.get("name") or eid,
        }
        return {"state": r["state"], "attrs": attrs}


async def history(hass: HomeAssistant, sensor: str | None, days: float) -> list[tuple[float, float | None]]:
    """(time, W) of a power sensor from the recorder (kW converted with the sensor's current unit); [] without one."""
    if not sensor:
        return []
    from homeassistant.components.recorder import get_instance
    from homeassistant.components.recorder.history import state_changes_during_period
    start = dt_util.utcnow() - timedelta(days=days)
    hist = await get_instance(hass).async_add_executor_job(state_changes_during_period, hass, start, None, sensor, True, False, None, True)
    cur = hass.states.get(sensor)
    unit = str(((cur.attributes if cur is not None else {}) or {}).get("unit_of_measurement") or "")
    f = 1000.0 if unit == "kW" else 0.001 if unit == "mW" else 1.0
    out = []
    for s in hist.get(sensor, []):
        try:
            v = float(s.state) * f
        except (TypeError, ValueError):
            v = None
        out.append((s.last_updated.timestamp(), v))
    return out


# ---- the entities ----
class CycleStatusSensor(SensorEntity):
    _attr_should_poll = False
    _attr_has_entity_name = False
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = list(CY.STATES)
    _attr_translation_key = "cycle"

    def __init__(self, data, eid: str) -> None:
        self._d = data
        self.est_id = eid
        self._attr_unique_id = f"{DOMAIN}_est_{eid}_cycle"
        self.entity_id = f"sensor.lhd_{eid}_cycle"
        self._sync_name()

    def _est(self) -> dict:
        return self._d.estimates().get(self.est_id) or {}

    def _sync_name(self) -> None:
        e = self._est()
        tr = _tr(self._d.hass)
        name = e.get("name") or self.est_id
        self._attr_name = f"{name} durumu" if tr else f"{name} status"
        kind = (e.get("cycle") or {}).get("kind") if isinstance(e.get("cycle"), dict) else None
        self._attr_icon = e.get("icon") or KIND_ICON.get(kind or "", "mdi:washing-machine")
        self._attr_device_info = device_info(self.est_id, e, tr)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_CYCLE, self._cycle))

    @callback
    def _cycle(self, eid) -> None:
        if eid is None or eid == self.est_id:
            self.async_write_ha_state()

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self.async_write_ha_state()

    def _view(self) -> dict:
        mgr = getattr(self._d, "cycles", None)
        return mgr.view(self.est_id) if mgr is not None else {"state": "idle", "attrs": {}}

    @property
    def native_value(self):
        return self._view()["state"]

    @property
    def extra_state_attributes(self):
        return self._view()["attrs"]


class CycleEmptiedButton(ButtonEntity):
    _attr_should_poll = False
    _attr_has_entity_name = False
    _attr_translation_key = "emptied"

    def __init__(self, data, eid: str) -> None:
        self._d = data
        self.est_id = eid
        self._attr_unique_id = f"{DOMAIN}_est_{eid}_emptied"
        self.entity_id = f"button.lhd_{eid}_emptied"
        self._sync_name()

    def _sync_name(self) -> None:
        e = self._d.estimates().get(self.est_id) or {}
        tr = _tr(self._d.hass)
        name = e.get("name") or self.est_id
        self._attr_name = f"{name} boşaltıldı" if tr else f"{name} emptied"
        self._attr_icon = "mdi:check-circle-outline"
        self._attr_device_info = device_info(self.est_id, e, tr)

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self.async_write_ha_state()

    async def async_press(self) -> None:
        mgr = getattr(self._d, "cycles", None)
        if mgr is not None:
            mgr.press(self.est_id)


def setup_buttons(hass: HomeAssistant, entry, async_add_entities) -> None:
    """The Emptied buttons, added and removed as devices get or lose cycle tracking."""
    known: dict[str, CycleEmptiedButton] = {}

    @callback
    def sync() -> None:
        data = hass.data.get(DOMAIN)
        if data is None:
            return
        want = [k for k, e in data.estimates().items() if CY.tracked(e)]
        new = [CycleEmptiedButton(data, k) for k in want if k not in known]
        for b in new:
            known[b.est_id] = b
        if new:
            async_add_entities(new)
        reg = er.async_get(hass)
        for k in list(known):
            if k not in want:
                b = known.pop(k)
                rid = reg.async_get_entity_id("button", DOMAIN, b.unique_id)
                if rid:
                    reg.async_remove(rid)
            else:
                known[k].async_est_changed()

    sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_EST, sync))


async def async_suggest(hass: HomeAssistant, sensor: str, cfg: dict) -> dict:
    try:
        pts = await history(hass, sensor, HISTORY_DAYS)
    except Exception as err:  # noqa: BLE001 - no recorder: the preset stays
        _LOGGER.debug("No history for %s: %s", sensor, err)
        pts = []
    res = await hass.async_add_executor_job(CY.suggest, pts, cfg, time.time())
    return res
