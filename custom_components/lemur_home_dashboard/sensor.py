"""Feeding status sensor per pet (ok, soon, due, late or never; last and next feeding as attributes),
and the sensors of the energy devices, categories and solar production (estimates.py)."""
from __future__ import annotations

import math
import time

from homeassistant.components.sensor import RestoreSensor, SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import UnitOfEnergy, UnitOfPower
from homeassistant.core import callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util import dt as dt_util

from . import estimates as EST
from . import pets as P
from ._petent import is_tr, setup_pet_entities
from .const import DOMAIN, SIGNAL_EST, SIGNAL_TICK

ENERGY_WRITE_S = 30.0   # kWh sensors: the value is kept exact, written to the state machine at most this often
ENERGY_IDLE_S = 300   # a kWh sensor whose shown value did not move is still written this often
REG_SYNC_S = 2.0        # registry events (devices, areas): one sync this long after the last one


async def async_setup_entry(hass, entry, async_add_entities):
    setup_pet_entities(hass, entry, async_add_entities, "sensor", PetFeedingSensor, "feeding")
    _setup_energy(hass, entry, async_add_entities)


def _setup_energy(hass, entry, async_add_entities) -> None:
    """Sensors of the energy devices, categories and solar production; added and removed as they change."""
    known: dict[str, list] = {}

    def wanted(data) -> dict:
        out = {}
        for eid, est in data.estimates().items():
            keys = []
            if EST.needs_power_sensor(est):
                keys.append(("power", lambda d=data, i=eid: EstimatePowerSensor(d, i)))
            if EST.needs_energy_sensor(est):
                keys.append(("energy", lambda d=data, i=eid: EstimateEnergySensor(d, i)))
            if EST.has_net(eid, est, data.estimates()):   # shared plug: what is left after the devices on it
                keys.append(("net_power", lambda d=data, i=eid: NetPowerSensor(d, i)))
                keys.append(("net_energy", lambda d=data, i=eid: NetEnergySensor(d, i)))
            for suffix, make in keys:
                out[f"est_{eid}_{suffix}"] = make
        for c in data.ecats():
            cid = c["id"]
            out[f"kat_{cid}_power"] = lambda d=data, i=cid: CategoryPowerSensor(d, i)
            out[f"kat_{cid}_energy"] = lambda d=data, i=cid: CategoryEnergySensor(d, i)
        st = EST.solar_cfg(data.data.get("settings") or {})
        if st.get("on") and st.get("prod") and not st.get("prod_energy"):
            out["solar_energy"] = lambda d=data: SolarEnergySensor(d)
        # the home's and each room's totals (power now, kWh today)
        ests = data.estimates()
        mcfg = EST.meter_cfg(data.data.get("settings") or {})
        if ests or mcfg.get("power") or mcfg.get("energy"):
            out["ev_power"] = lambda d=data: HomePowerSensor(d)
            out["ev_energy"] = lambda d=data: HomeEnergySensor(d)
        for aid in sorted({a for a in (area_of(hass, k, e) for k, e in ests.items()) if a}):
            out[f"oda_{aid}_power"] = lambda d=data, a=aid: RoomPowerSensor(d, a)
            out[f"oda_{aid}_energy"] = lambda d=data, a=aid: RoomEnergySensor(d, a)
        return out

    @callback
    def sync() -> None:
        data = hass.data.get(DOMAIN)
        if data is None:
            return
        want = wanted(data)
        new = []
        for key, make in want.items():
            if key not in known:
                ent = make()
                known[key] = ent
                new.append(ent)
        if new:
            async_add_entities(new)
        reg = er.async_get(hass)
        for key in list(known):
            if key not in want:
                ent = known.pop(key)
                rid = reg.async_get_entity_id("sensor", DOMAIN, ent.unique_id)
                if rid:
                    reg.async_remove(rid)
            else:
                known[key].async_est_changed()

    sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_EST, sync))
    # a device moved to another room, a room added or removed: the room sensors follow. Registry events come in bursts
    # (an integration reloading, a device deleted with its 20 entities) and each one rebuilt every sensor's links;
    # v0.32: one sync, REG_SYNC_S after the last event.
    pending: dict = {"unsub": None}

    @callback
    def _run(_now) -> None:
        pending["unsub"] = None
        sync()

    @callback
    def reg_sync(_event) -> None:
        if pending["unsub"]:
            pending["unsub"]()
            pending["unsub"] = None
        if REG_SYNC_S <= 0:
            sync()
            return
        pending["unsub"] = async_call_later(hass, REG_SYNC_S, _run)

    @callback
    def _cancel() -> None:
        if pending["unsub"]:
            pending["unsub"]()
            pending["unsub"] = None

    entry.async_on_unload(_cancel)
    for ev in (er.EVENT_ENTITY_REGISTRY_UPDATED, dr.EVENT_DEVICE_REGISTRY_UPDATED, ar.EVENT_AREA_REGISTRY_UPDATED):
        entry.async_on_unload(hass.bus.async_listen(ev, reg_sync))


def area_of(hass, eid: str, est: dict) -> str | None:
    """The room of a device: its linked entity's or its power sensor's area, otherwise that entity's device's."""
    if hass is None:
        return None
    ents, devs = er.async_get(hass), dr.async_get(hass)
    for x in (est.get("entity"), est.get("sensor"), EST.power_entity(eid, est)):
        r = ents.async_get(x) if x else None
        if r is None:
            continue
        if r.area_id:
            return r.area_id
        d = devs.async_get(r.device_id) if r.device_id else None
        if d is not None and d.area_id:
            return d.area_id
    return None


class _Base:
    """Shared: name, icon and the entities the sensor follows."""

    _attr_should_poll = False
    _attr_has_entity_name = False

    def _init(self, data, uid: str, entity_id: str) -> None:
        self._d = data
        self._unsub_link = None
        self._attr_unique_id = f"{DOMAIN}_{uid}"
        self.entity_id = entity_id
        self._sync_name()

    def _word(self, power: bool) -> str:
        tr = is_tr(self._d.hass)
        return ("güç" if power else "enerji") if tr else ("power" if power else "energy")

    def _sync_name(self) -> None:  # overridden
        pass

    def _follow(self) -> list[str]:  # entities whose changes matter
        return []

    def _relink(self, handler) -> None:
        if self._unsub_link:
            self._unsub_link()
            self._unsub_link = None
        ids = [x for x in self._follow() if x]
        if ids and self.hass:
            self._unsub_link = async_track_state_change_event(self.hass, ids, handler)

    def _unlink(self) -> None:
        if self._unsub_link:
            self._unsub_link()
            self._unsub_link = None
        p = getattr(self, "_tw_pending", None)
        if p:
            p()
            self._tw_pending = None

    # Güç sensörleri (v0.29.4): bağlı prizler saniyede birkaç kez değişebiliyor; ev ve oda toplamı günde 38 bin satır
    # yazıyordu. En sık THROTTLE_S saniyede bir yazılır; belirgin değişim (açma, kapama) hemen yazılır, aradaki son değer kaybolmaz.
    THROTTLE_S = 5.0

    def _write_soon(self) -> None:
        if not self.hass:
            return
        if getattr(self, "_tw_pending", None):
            return
        now = time.monotonic()
        last = getattr(self, "_tw_last", 0.0)
        try:
            v = self.native_value
        except Exception:  # noqa: BLE001 - değer hesaplanamazsa hemen yaz, HA kendi hatasını gösterir
            v = None
        lv = getattr(self, "_tw_val", None)
        big = v is None or lv is None or (abs(v - lv) > 5 and abs(v - lv) > 0.2 * max(abs(lv), 1.0))
        if big or now - last >= self.THROTTLE_S:
            self._tw_last, self._tw_val = now, v
            self.async_write_ha_state()
            return
        self._tw_pending = async_call_later(self.hass, self.THROTTLE_S - (now - last), self._tw_fire)

    @callback
    def _tw_fire(self, _now) -> None:
        self._tw_pending = None
        if not self.hass:
            return
        self._tw_last = time.monotonic()
        try:
            self._tw_val = self.native_value
        except Exception:  # noqa: BLE001
            self._tw_val = None
        self.async_write_ha_state()


class _Device(_Base):
    def _init_dev(self, data, eid: str, suffix: str) -> None:
        self.est_id = eid
        self._suffix = suffix
        self._init(data, f"est_{eid}_{suffix}", f"sensor.lhd_{eid}_{suffix}")

    def est(self) -> dict:
        return self._d.estimates().get(self.est_id) or {}

    def _sync_name(self) -> None:
        e = self.est()
        name = e.get("name") or self.est_id
        tr = is_tr(self._d.hass)
        est = e.get("kind") != "meas"
        if est:
            word = ("tahmini " if tr else "estimated ") + self._word(self._suffix == "power")
        else:
            word = self._word(self._suffix == "power")
        self._attr_name = f"{name} {word}"
        self._attr_icon = e.get("icon") or ("mdi:flash-outline" if self._suffix == "power" else "mdi:lightning-bolt-outline")

    def _follow(self) -> list[str]:
        return [EST.linked(self.est())]

    def _watts(self) -> float:
        link = EST.linked(self.est())
        return EST.power(self.est(), self.hass.states.get(link) if link and self.hass else None)

    @property
    def extra_state_attributes(self):
        e = self.est()
        return {"estimated": e.get("kind") != "meas", "kind": e.get("kind"), "linked_entity": EST.linked(e), "category": e.get("cat") or None}


class EstimatePowerSensor(_Device, SensorEntity):
    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_suggested_display_precision = 1

    def __init__(self, data, eid: str) -> None:
        self._init_dev(data, eid, "power")

    async def async_added_to_hass(self) -> None:
        self._relink(self._linked_changed)
        self.async_on_remove(self._unlink)

    @callback
    def _linked_changed(self, _event) -> None:
        self._write_soon()

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self._relink(self._linked_changed)
            self.async_write_ha_state()

    @property
    def native_value(self):
        return round(self._watts(), 2)


class _Integrating(RestoreSensor):
    """Adds up a power over time (kept across restarts): steps when the followed entities change and every minute."""

    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_suggested_display_precision = 3

    def _init_int(self) -> None:
        self._kwh = 0.0
        self._t = None
        self._w = 0.0
        self._ew_last = 0.0

    async def async_added_to_hass(self) -> None:
        last = await self.async_get_last_sensor_data()
        if last is not None:
            try:
                v = float(last.native_value)
                if math.isfinite(v) and v >= 0:
                    self._kwh = v
            except (TypeError, ValueError):
                pass
        self._t = dt_util.utcnow()
        self._w = self._watts()
        self._relink(self._linked_changed)
        self.async_on_remove(self._unlink)
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_TICK, self._tick))

    @callback
    def _step(self) -> None:
        """Count the time since the last step at the power that held until now, then take the new power."""
        now = dt_util.utcnow()
        if self._t is not None and self._w <= EST.MAX_W:   # more than this is a wrong reading, not usage
            self._kwh += EST.kwh(self._w, (now - self._t).total_seconds())
        self._t = now
        self._w = self._watts()

    @callback
    def _linked_changed(self, _event) -> None:
        # v0.32: every change is counted, but the state is written at most every ENERGY_WRITE_S (and on the minute
        # tick). A plug that reports every second made the kWh sensor write a row every second.
        self._step()
        now = time.monotonic()
        if now - self._ew_last >= ENERGY_WRITE_S:
            self._ew_last = now
            self.async_write_ha_state()

    @callback
    def _tick(self) -> None:
        # v0.33: the minute tick still counts, but writes only when the shown value (3 decimals) moved or ENERGY_IDLE_S
        # passed. Every device drawing a little power changed its 4th decimal each minute and wrote a row (and its
        # category, room and home total followed): about 47 rows a minute in a home where nothing was happening.
        self._step()
        now = time.monotonic()
        shown = round(self._kwh, 3)
        if shown == getattr(self, "_ew_shown", None) and now - self._ew_last < ENERGY_IDLE_S:
            return
        self._ew_shown = shown
        self._ew_last = now
        self.async_write_ha_state()

    @callback
    def async_est_changed(self) -> None:
        if self.hass:
            self._step()
            self._sync_name()
            self._relink(self._linked_changed)
            self.async_write_ha_state()
        else:
            self._sync_name()

    @property
    def native_value(self):
        return round(self._kwh, 4)


class EstimateEnergySensor(_Device, _Integrating):
    def __init__(self, data, eid: str) -> None:
        self._init_int()
        self._init_dev(data, eid, "energy")


class SolarEnergySensor(_Base, _Integrating):
    """Solar production in kWh when the inverter gives only power."""

    def __init__(self, data) -> None:
        self._init_int()
        self._init(data, "solar_energy", "sensor.lhd_solar_energy")

    def _cfg(self) -> dict:
        return EST.solar_cfg(self._d.data.get("settings") or {})

    def _sync_name(self) -> None:
        self._attr_name = "Güneş üretimi" if is_tr(self._d.hass) else "Solar production"
        self._attr_icon = "mdi:solar-power"

    def _follow(self) -> list[str]:
        return [self._cfg().get("prod")]

    def _watts(self) -> float:
        p = self._cfg().get("prod")
        w = EST.watts_of(self.hass.states.get(p)) if p and self.hass else None
        return max(0.0, w) if w is not None else 0.0


class _Net(_Device):
    """The rest of a shared plug: the plug's power minus the devices on it."""

    def _sync_name(self) -> None:
        e = self.est()
        name = e.get("rest") or e.get("name") or self.est_id
        self._attr_name = f"{name} {self._word(self._suffix == 'net_power')}"
        self._attr_icon = e.get("icon") or ("mdi:flash-outline" if self._suffix == "net_power" else "mdi:lightning-bolt-outline")

    def _follow(self) -> list[str]:
        ests = self._d.estimates()
        return [EST.power_entity(self.est_id, self.est())] + [EST.power_entity(k, ests[k]) for k in EST.inside_of(self.est_id, self.est(), ests)]

    def _watts(self) -> float:
        return EST.net_power(self.est_id, self.est(), self._d.estimates(), self.hass.states if self.hass else None)

    @property
    def extra_state_attributes(self):
        e = self.est()
        return {"plug": EST.power_entity(self.est_id, e), "inside": EST.inside_of(self.est_id, e, self._d.estimates()), "category": e.get("cat") or None}


class NetPowerSensor(_Net, SensorEntity):
    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_suggested_display_precision = 1

    def __init__(self, data, eid: str) -> None:
        self._init_dev(data, eid, "net_power")

    async def async_added_to_hass(self) -> None:
        self._relink(self._changed)
        self.async_on_remove(self._unlink)

    @callback
    def _changed(self, _event) -> None:
        self._write_soon()

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self._relink(self._changed)
            self.async_write_ha_state()

    @property
    def native_value(self):
        return round(self._watts(), 2)


class NetEnergySensor(_Net, _Integrating):
    def __init__(self, data, eid: str) -> None:
        self._init_int()
        self._init_dev(data, eid, "net_energy")


class _Cat(_Base):
    def _init_cat(self, data, cid: str, suffix: str) -> None:
        self.cat_id = cid
        self._suffix = suffix
        self._init(data, f"kat_{cid}_{suffix}", f"sensor.lhd_kat_{cid}_{suffix}")

    def cat(self) -> dict:
        return next((c for c in self._d.ecats() if c.get("id") == self.cat_id), {})

    def members(self) -> list[tuple[str, dict]]:
        return [(eid, e) for eid, e in self._d.estimates().items() if e.get("cat") == self.cat_id]

    def _sync_name(self) -> None:
        c = self.cat()
        self._attr_name = f"{c.get('name') or self.cat_id} {self._word(self._suffix == 'power')}"
        self._attr_icon = c.get("icon") or ("mdi:flash" if self._suffix == "power" else "mdi:lightning-bolt")

    @property
    def extra_state_attributes(self):
        return {"category": self.cat_id, "devices": len(self.members())}


class CategoryPowerSensor(_Cat, SensorEntity):
    """The category's devices' power together."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_suggested_display_precision = 1

    def __init__(self, data, cid: str) -> None:
        self._init_cat(data, cid, "power")

    def _follow(self) -> list[str]:
        ests = self._d.estimates()
        return [EST.member_power_entity(eid, e, ests) for eid, e in self.members()]

    async def async_added_to_hass(self) -> None:
        self._relink(self._changed)
        self.async_on_remove(self._unlink)

    @callback
    def _changed(self, _event) -> None:
        self._write_soon()

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self._relink(self._changed)
            self.async_write_ha_state()

    @property
    def native_value(self):
        if not self.hass:
            return None
        s = 0.0
        ests = self._d.estimates()
        for eid, e in self.members():
            w = EST.watts_of(self.hass.states.get(EST.member_power_entity(eid, e, ests)))
            if w is not None and w > 0:
                s += w
        return round(s, 2)


class CategoryEnergySensor(_Cat, RestoreSensor):
    """The category's kWh: what its devices' kWh sensors added since the sensor started (kept across restarts).
    A device's counter going back (a reset) only counts what it gained after the reset."""

    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_suggested_display_precision = 3
    MAX_STEP = 50.0   # kWh in one update: more than this is a wrong reading, not usage
    HOLD_RISES = 5    # a counter that went back and then rose this many times without returning: a real reset

    def __init__(self, data, cid: str) -> None:
        self._kwh = 0.0
        self._last: dict[str, float] = {}
        self._held: dict[str, dict] = {}   # a counter that went back: {hi, lo, pend, n} until it is clear (glitch or reset)
        self._ew_last = 0.0
        self._ew_unsub = None
        self._init_cat(data, cid, "energy")

    def _follow(self) -> list[str]:
        ests = self._d.estimates()
        return [EST.member_energy_entity(eid, e, ests) for eid, e in self.members()]

    def _val(self, ent: str) -> float | None:
        st = self.hass.states.get(ent) if self.hass else None
        if st is None:
            return None
        try:
            v = float(st.state)
        except (TypeError, ValueError):
            return None
        if v != v:
            return None
        unit = str((st.attributes or {}).get("unit_of_measurement") or "")
        return v / 1000 if unit == "Wh" else v * 1000 if unit == "MWh" else v

    def _baseline(self) -> None:
        self._last = {}
        for ent in self._follow():
            v = self._val(ent)
            if v is not None:
                self._last[ent] = v

    async def async_added_to_hass(self) -> None:
        last = await self.async_get_last_sensor_data()
        if last is not None:
            try:
                v = float(last.native_value)
                if math.isfinite(v) and v >= 0:
                    self._kwh = v
            except (TypeError, ValueError):
                pass
        self._baseline()
        self._relink(self._changed)
        self.async_on_remove(self._unlink)
        self.async_on_remove(self._ew_cancel)

    @callback
    def _changed(self, event) -> None:
        ent = event.data.get("entity_id")
        v = self._val(ent)
        if v is None:
            return
        prev = self._last.get(ent)
        self._last[ent] = v
        if prev is None:
            return
        h = self._held.get(ent)
        if h is None:
            if v < prev:   # a reset or a glitch (a plug reporting 0 for a few readings): decided later, nothing counted meanwhile
                self._held[ent] = {"hi": prev, "lo": v, "pend": 0.0, "n": 0}
                return
            d = v - prev
            if not 0 < d <= self.MAX_STEP:
                return
        elif v < prev:   # went down again while held
            h["lo"] = min(h["lo"], v)
            return
        elif v >= h["hi"] and v - prev >= (h["hi"] - h["lo"]) / 2:
            # jumped back to the old counter: it was a glitch; only what it gained above the old value counts
            del self._held[ent]
            d = v - h["hi"]
            if not 0 < d <= self.MAX_STEP:
                return
        else:
            # climbing from the low value: what a reset device used; counted once it is clear it is a reset
            if 0 < v - prev <= self.MAX_STEP:
                h["pend"] += v - prev
                h["n"] += 1
            if h["n"] < self.HOLD_RISES:
                return
            del self._held[ent]
            # a reset goes to 0: the low reading itself was used after the reset (not when it only dipped a little)
            d = h["pend"] + (h["lo"] if 0 < h["lo"] < h["hi"] - h["lo"] and h["lo"] <= self.MAX_STEP else 0.0)
            if d <= 0:
                return
        self._kwh += d
        self._write_energy()

    def _write_energy(self) -> None:
        """Written at most every ENERGY_WRITE_S; the last value is never left unwritten (a timer writes it)."""
        now = time.monotonic()
        if now - getattr(self, "_ew_last", 0.0) >= ENERGY_WRITE_S:
            self._ew_last = now
            self.async_write_ha_state()
        elif not getattr(self, "_ew_unsub", None) and self.hass:
            self._ew_unsub = async_call_later(self.hass, ENERGY_WRITE_S - (now - self._ew_last), self._ew_fire)

    @callback
    def _ew_fire(self, _now) -> None:
        self._ew_unsub = None
        if self.hass:
            self._ew_last = time.monotonic()
            self.async_write_ha_state()

    def _ew_cancel(self) -> None:
        if getattr(self, "_ew_unsub", None):
            self._ew_unsub()
            self._ew_unsub = None

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            old = dict(self._last)
            self._baseline()
            for k, v in old.items():   # keep the counters of devices that stay
                if k in self._last:
                    self._last[k] = v
            self._relink(self._changed)
            self.async_write_ha_state()

    @property
    def native_value(self):
        return round(self._kwh, 4)


class _Total:
    """Shared by the home and room totals: a note that they are totals, not devices."""

    def _note(self) -> str:
        return ("Toplam değer: Enerji ayarına cihaz olarak eklenmez (ev iki kez sayılırdı)" if is_tr(self._d.hass)
                else "A total: not to be added as a device in the Energy settings (the home would count twice)")


class _RoomMixin(_Total):
    def _room_name(self) -> str:
        a = ar.async_get(self._d.hass).async_get_area(self.area_id) if self._d.hass else None
        return (a.name if a else None) or self.area_id

    def members(self) -> list[tuple[str, dict]]:
        return [(k, e) for k, e in self._d.estimates().items() if area_of(self._d.hass, k, e) == self.area_id]

    def _sync_name(self) -> None:
        tr = is_tr(self._d.hass)
        n = self._room_name()
        self._attr_name = (f"{n} toplam güç" if tr else f"{n} total power") if self._suffix == "power" else (f"{n} bugün toplam" if tr else f"{n} total today")
        self._attr_icon = "mdi:home-lightning-bolt-outline" if self._suffix == "power" else "mdi:calendar-today"

    @property
    def extra_state_attributes(self):
        return {"area": self.area_id, "devices": len(self.members()), "lhd_total": True, "note": self._note()}


class _HomeMixin(_Total):
    def members(self) -> list[tuple[str, dict]]:
        return list(self._d.estimates().items())

    def _sync_name(self) -> None:
        tr = is_tr(self._d.hass)
        self._attr_name = ("Ev toplam güç" if tr else "Home total power") if self._suffix == "power" else ("Ev bugün toplam" if tr else "Home total today")
        self._attr_icon = "mdi:home-lightning-bolt-outline" if self._suffix == "power" else "mdi:calendar-today"

    @property
    def extra_state_attributes(self):
        return {"devices": len(self.members()), "lhd_total": True, "note": self._note()}


class RoomPowerSensor(_RoomMixin, CategoryPowerSensor):
    """A room's devices' power together (a shared plug counts with its rest)."""

    def __init__(self, data, aid: str) -> None:
        self.area_id = aid
        self._suffix = "power"
        self._init(data, f"oda_{aid}_power", f"sensor.lhd_oda_{aid}_power")


class HomePowerSensor(_HomeMixin, CategoryPowerSensor):
    """The home's power now, worked out like the dashboard's cards (meter, flow, or the devices together)."""

    def __init__(self, data) -> None:
        self._suffix = "power"
        self._init(data, "ev_power", "sensor.lhd_ev_power")

    def _follow(self) -> list[str]:
        return EST.home_follow(self._d.data.get("settings") or {}, self._d.estimates())

    @property
    def native_value(self):
        if not self.hass:
            return None
        v = EST.home_power(self.hass.states, self._d.data.get("settings") or {}, self._d.estimates())
        return round(v, 2) if v is not None else None


class _Daily:
    """kWh since midnight: the sum's counter starts from zero every day (Home Assistant sees the drop as a new cycle)."""

    def _roll(self) -> bool:
        today = dt_util.now().date()
        if getattr(self, "_day", None) != today:
            first = getattr(self, "_day", None) is None
            self._day = today
            if not first:
                self._kwh = 0.0
                return True
        return False

    async def _daily_start(self) -> None:
        last = await self.async_get_last_state()
        if last is not None and dt_util.as_local(last.last_updated).date() != dt_util.now().date():
            self._kwh = 0.0
        self._day = dt_util.now().date()
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_TICK, self._daily_tick))

    @callback
    def _daily_tick(self) -> None:
        if self._roll():
            self.async_write_ha_state()

    @callback
    def _changed(self, event) -> None:
        self._roll()
        CategoryEnergySensor._changed(self, event)


class RoomEnergySensor(_RoomMixin, _Daily, CategoryEnergySensor):
    def __init__(self, data, aid: str) -> None:
        self._kwh = 0.0
        self._last = {}
        self._held = {}
        self._day = None
        self.area_id = aid
        self._suffix = "energy"
        self._init(data, f"oda_{aid}_energy", f"sensor.lhd_oda_{aid}_energy")

    async def async_added_to_hass(self) -> None:
        await CategoryEnergySensor.async_added_to_hass(self)
        await self._daily_start()


class HomeEnergySensor(_HomeMixin, _Daily, CategoryEnergySensor):
    def __init__(self, data) -> None:
        self._kwh = 0.0
        self._last = {}
        self._held = {}
        self._day = None
        self._suffix = "energy"
        self._init(data, "ev_energy", "sensor.lhd_ev_energy")

    def _follow(self) -> list[str]:
        # ev sayacı seçiliyse evin bugünkü kWh'ı sayaçtan (panonun kartları da evin toplamını ondan alır); yoksa cihazların toplamı
        m = EST.home_meter_energy(self._d.data.get("settings") or {})
        return [m] if m else CategoryEnergySensor._follow(self)

    async def async_added_to_hass(self) -> None:
        await CategoryEnergySensor.async_added_to_hass(self)
        await self._daily_start()


class PetFeedingSensor(SensorEntity):
    _attr_should_poll = False
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = P.STATUSES
    _attr_translation_key = "feeding"

    def __init__(self, data, pid: str) -> None:
        self._d = data
        self.pet_id = pid
        self._attr_unique_id = f"{DOMAIN}_pet_{pid}_feeding"
        self._sync_name()

    def _sync_name(self) -> None:
        pet = self._d.pets().get(self.pet_id) or {}
        name = pet.get("name") or self.pet_id
        self._attr_name = f"{name} besleme" if is_tr(self._d.hass) else f"{name} feeding"
        self._attr_icon = pet.get("icon") or "mdi:paw"

    @callback
    def async_pet_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self.async_write_ha_state()

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_TICK, self._tick))

    @callback
    def _tick(self) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self):
        return self._d.status(self.pet_id)

    @property
    def extra_state_attributes(self):
        rec = self._d.rec(self.pet_id)
        pet = self._d.pets().get(self.pet_id) or {}
        return {"pet": self.pet_id, "last_fed": rec.get("last"), "next_feeding": rec.get("due"), "kind": pet.get("kind")}
