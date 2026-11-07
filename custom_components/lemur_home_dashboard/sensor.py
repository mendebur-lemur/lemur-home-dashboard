"""Feeding status sensor per pet (ok, soon, due, late or never; last and next feeding as attributes),
and the power / energy sensors of estimated devices (estimates.py)."""
from __future__ import annotations

from homeassistant.components.sensor import RestoreSensor, SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import UnitOfEnergy, UnitOfPower
from homeassistant.core import callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from . import estimates as EST
from . import pets as P
from ._petent import is_tr, setup_pet_entities
from .const import DOMAIN, SIGNAL_EST, SIGNAL_TICK


async def async_setup_entry(hass, entry, async_add_entities):
    setup_pet_entities(hass, entry, async_add_entities, "sensor", PetFeedingSensor, "feeding")
    _setup_estimates(hass, entry, async_add_entities)


def _setup_estimates(hass, entry, async_add_entities) -> None:
    """One power and one energy sensor per estimate; added and removed as the estimates change."""
    known: dict[str, list] = {}

    @callback
    def sync() -> None:
        data = hass.data.get(DOMAIN)
        if data is None:
            return
        ests = data.estimates()
        new = []
        for eid in ests:
            if eid not in known:
                pair = [EstimatePowerSensor(data, eid), EstimateEnergySensor(data, eid)]
                known[eid] = pair
                new.extend(pair)
        if new:
            async_add_entities(new)
        reg = er.async_get(hass)
        for eid in list(known):
            if eid not in ests:
                known.pop(eid)
                for suffix in ("power", "energy"):
                    ent = reg.async_get_entity_id("sensor", DOMAIN, f"{DOMAIN}_est_{eid}_{suffix}")
                    if ent:
                        reg.async_remove(ent)
            else:
                for ent in known[eid]:
                    ent.async_est_changed()

    sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_EST, sync))


class _EstimateBase:
    """Shared: the estimate's record, its name and the linked entity it follows."""

    _attr_should_poll = False
    _attr_has_entity_name = False

    def _init_est(self, data, eid: str, suffix: str) -> None:
        self._d = data
        self.est_id = eid
        self._unsub_link = None
        self._attr_unique_id = f"{DOMAIN}_est_{eid}_{suffix}"
        self.entity_id = f"sensor.lhd_{eid}_{suffix}"
        self._suffix = suffix
        self._sync_name()

    def est(self) -> dict:
        return self._d.estimates().get(self.est_id) or {}

    def _sync_name(self) -> None:
        e = self.est()
        name = e.get("name") or self.est_id
        tr = is_tr(self._d.hass)
        word = {"power": ("tahmini güç", "estimated power"), "energy": ("tahmini enerji", "estimated energy")}[self._suffix]
        self._attr_name = f"{name} {word[0] if tr else word[1]}"
        self._attr_icon = e.get("icon") or ("mdi:flash-outline" if self._suffix == "power" else "mdi:lightning-bolt-outline")

    def _link(self) -> str | None:
        e = self.est()
        ent = e.get("entity")
        return ent if ent and e.get("kind") in ("light", "onoff") else None

    def _watts(self) -> float:
        link = self._link()
        return EST.power(self.est(), self.hass.states.get(link) if link and self.hass else None)

    def _relink(self, handler) -> None:
        if self._unsub_link:
            self._unsub_link()
            self._unsub_link = None
        link = self._link()
        if link and self.hass:
            self._unsub_link = async_track_state_change_event(self.hass, [link], handler)

    @property
    def extra_state_attributes(self):
        e = self.est()
        return {"estimated": True, "kind": e.get("kind"), "linked_entity": e.get("entity") or None}


class EstimatePowerSensor(_EstimateBase, SensorEntity):
    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_suggested_display_precision = 1

    def __init__(self, data, eid: str) -> None:
        self._init_est(data, eid, "power")

    async def async_added_to_hass(self) -> None:
        self._relink(self._linked_changed)
        self.async_on_remove(lambda: self._unsub_link() if self._unsub_link else None)

    @callback
    def _linked_changed(self, _event) -> None:
        self.async_write_ha_state()

    @callback
    def async_est_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self._relink(self._linked_changed)
            self.async_write_ha_state()

    @property
    def native_value(self):
        return round(self._watts(), 2)


class EstimateEnergySensor(_EstimateBase, RestoreSensor):
    """Adds up the estimated power over time (kept across restarts)."""

    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_native_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_suggested_display_precision = 3

    def __init__(self, data, eid: str) -> None:
        self._init_est(data, eid, "energy")
        self._kwh = 0.0
        self._t = None
        self._w = 0.0

    async def async_added_to_hass(self) -> None:
        last = await self.async_get_last_sensor_data()
        if last is not None:
            try:
                v = float(last.native_value)
                if v == v and v >= 0:
                    self._kwh = v
            except (TypeError, ValueError):
                pass
        self._t = dt_util.utcnow()
        self._w = self._watts()
        self._relink(self._linked_changed)
        self.async_on_remove(lambda: self._unsub_link() if self._unsub_link else None)
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_TICK, self._tick))

    @callback
    def _step(self) -> None:
        """Count the time since the last step at the power that held until now, then take the new power."""
        now = dt_util.utcnow()
        if self._t is not None:
            self._kwh += EST.kwh(self._w, (now - self._t).total_seconds())
        self._t = now
        self._w = self._watts()

    @callback
    def _linked_changed(self, _event) -> None:
        self._step()
        self.async_write_ha_state()

    @callback
    def _tick(self) -> None:
        self._step()
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
