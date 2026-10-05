"""Feeding status sensor per pet: ok, soon, due, late or never; last and next feeding as attributes."""
from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from . import pets as P
from ._petent import is_tr, setup_pet_entities
from .const import DOMAIN, SIGNAL_TICK


async def async_setup_entry(hass, entry, async_add_entities):
    setup_pet_entities(hass, entry, async_add_entities, "sensor", PetFeedingSensor, "feeding")


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
