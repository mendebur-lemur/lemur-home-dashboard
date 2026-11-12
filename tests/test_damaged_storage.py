"""Bad stored data never stops the setup: a broken entry is skipped (with one warning), the rest loads."""
import logging
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

DOMAIN = "lemur_home_dashboard"
AVG_OK = {"plug": "sensor.ok", "kind": "avg", "started": 1700000000.0}

CASES = {
    "avg_started_text": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "avg", "started": "abc"}}},
    "avg_started_list": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "avg", "started": [1]}}},
    "avg_started_nan": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "avg", "started": float("nan")}}},
    "avg_started_inf": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "avg", "started": float("inf")}}},
    "avg_started_bool": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "avg", "started": True}}},
    "avg_plug_list": {"learn_avg": {"a": {"plug": ["x"], "kind": "avg", "started": 5}}},
    "light_interval_text": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "interval": "zz", "steps": [{"t": "b", "b": 50}]}}},
    "light_steps_text": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "steps": "zz", "i": "q"}}},
    "light_step_not_dict": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "steps": [5, None], "i": 0}}},
    "light_i_too_big": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "steps": [{"t": "b", "b": 50}], "i": 9}}},
    "light_done_no_steps": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "phase": "done", "result": {"x": 1}, "steps": None, "i": None}}},
    "light_res_list": {"learn_avg": {"a": {"plug": "sensor.p", "kind": "light", "entity": "light.x", "steps": [{"t": "b", "b": 50}], "i": 0, "res": [1], "settle_s": "x"}}},
    "learn_avg_list": {"learn_avg": [1, 2]},
    "pets_bad": {"pets": {"p1": {"name": "x", "mode": "times", "times": "abc", "every_h": "x"}, "p2": [1]}, "feed": {"p1": {"last": 5, "due": [1], "log": "x"}}},
    "feed_list": {"pets": {"p1": {"name": "x", "mode": "interval", "every_h": "x"}}, "feed": {"p1": []}},
    "estimates_bad": {"estimates": {"a": {"entity": 5, "watts": "x", "kind": [1]}, "b": [1], "c": None}, "ecats": [{"id": 5}, {"id": "k", "name": None, "devices": "x"}, 3]},
    "twins_bad": {"twins": {"light.a": "x", "light.b": {"twin": 5}}, "walls": [{"entity": 5}, "x", None, {"switch": ["x"], "lights": "y"}]},
    "settings_bad": {"settings": {"energy": {"solar": "x", "meter": [1], "sync": "x", "price": "x"}, "season": 5}, "tabs": [1, None, {"id": 5, "sections": "x"}]},
    "top_level_wrong_types": {"settings": [], "tabs": {}, "pets": [], "learn_avg": "x", "energy_solar_src": 5},
}


@pytest.mark.parametrize("name", list(CASES))
async def test_damaged_storage_never_stops_the_setup(hass, hass_storage, caplog, name):
    data = {"version": 1, "settings": {}, "tabs": [], "profiles": {}}
    data.update(CASES[name])
    if isinstance(data.get("learn_avg"), dict):
        data["learn_avg"] = dict(data["learn_avg"], ok=AVG_OK)   # a good entry next to the broken one survives
    hass_storage[DOMAIN] = {"version": 1, "minor_version": 1, "key": DOMAIN, "data": data}
    hass.config.components.update({"frontend", "panel_custom"})
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    with patch("custom_components.lemur_home_dashboard._register_static"), \
            patch("custom_components.lemur_home_dashboard.add_extra_js_url"), \
            patch("homeassistant.components.panel_custom.async_register_panel"), \
            patch("custom_components.lemur_home_dashboard.async_remove_panel"):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        d = hass.data[DOMAIN]
        await d.async_tick()
        st = await d.learning.async_status()            # the admin page's learning list works too
        await hass.async_block_till_done()
    assert not [r for r in caplog.records if r.levelno >= logging.ERROR]
    if isinstance(CASES[name].get("learn_avg"), dict):
        assert "ok" in d.learning.runs and "ok" in st
        bad = [r for r in caplog.records if r.levelno == logging.WARNING and "learn" in r.getMessage().lower()]
        if "a" not in d.learning.runs:
            assert len(bad) == 1, [r.getMessage() for r in bad]
