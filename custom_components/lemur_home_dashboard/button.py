"""'Fed it' button per pet: same as tapping the feeding card (for automations, voice assistants, NFC tags)."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.core import callback

from ._petent import is_tr, setup_pet_entities
from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    setup_pet_entities(hass, entry, async_add_entities, "button", PetFeedButton, "feed")


class PetFeedButton(ButtonEntity):
    _attr_should_poll = False

    def __init__(self, data, pid: str) -> None:
        self._d = data
        self.pet_id = pid
        self._attr_unique_id = f"{DOMAIN}_pet_{pid}_feed"
        self._sync_name()

    def _sync_name(self) -> None:
        pet = self._d.pets().get(self.pet_id) or {}
        name = pet.get("name") or self.pet_id
        self._attr_name = f"{name} besledim" if is_tr(self._d.hass) else f"{name} fed"
        self._attr_icon = "mdi:food-drumstick"

    @callback
    def async_pet_changed(self) -> None:
        self._sync_name()
        if self.hass:
            self.async_write_ha_state()

    async def async_press(self) -> None:
        await self._d.async_feed(self.pet_id, "button")
