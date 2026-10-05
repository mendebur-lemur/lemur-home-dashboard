"""Shared helpers for the feeding entities (sensor + button): one pair per pet, added and removed as pets change."""
from __future__ import annotations

from typing import Callable

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DOMAIN, SIGNAL_PETS


def setup_pet_entities(hass: HomeAssistant, entry, async_add_entities, platform: str, make: Callable, suffix: str) -> None:
    known: dict[str, object] = {}

    @callback
    def sync() -> None:
        data = hass.data.get(DOMAIN)
        if data is None:
            return
        pets = data.pets()
        new = [make(data, pid) for pid in pets if pid not in known]
        for ent in new:
            known[ent.pet_id] = ent
        if new:
            async_add_entities(new)
        reg = er.async_get(hass)
        for pid in list(known):
            if pid not in pets:
                known.pop(pid)
                eid = reg.async_get_entity_id(platform, DOMAIN, f"{DOMAIN}_pet_{pid}_{suffix}")
                if eid:
                    reg.async_remove(eid)
            else:
                known[pid].async_pet_changed()

    sync()
    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_PETS, sync))


def is_tr(hass: HomeAssistant) -> bool:
    return (hass.config.language or "").lower().startswith("tr")
