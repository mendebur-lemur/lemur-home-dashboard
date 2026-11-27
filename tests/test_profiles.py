from datetime import timedelta

import pytest
import voluptuous as vol

from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.lemur_home_dashboard import SF, _check
from custom_components.lemur_home_dashboard.const import MAX_CONFIG_BYTES
from tests.test_backup_restore import DOMAIN, _Ids, _call, _get, _ws


def test_clean_profiles_drops_bad_ids_and_caps_count(caplog):
    profiles = {"masaustu": {"name": "Masaüstü"}, "Bad Id!": {"name": "X"}, "newline\n": {"name": "X"}, "broken": None,
                **{f"p{i}": {"name": "x"} for i in range(12)}}
    out = _check("profiles", profiles)
    assert list(out) == ["masaustu", *(f"p{i}" for i in range(9))]
    assert any("profiles" in message.lower() for message in caplog.messages)


@pytest.mark.parametrize("name", [5, "x" * 61])
def test_clean_profiles_name_fallback(name):
    assert _check("profiles", {"a": {"name": name}}) == {"a": {"name": "a"}}


def test_clean_profiles_cleans_tab_actions():
    tabs = [{"id": "a", "sections": [{"entities": [
        {"entity": "light.c", "hold": {"action": "url", "url_path": "javascript:alert(1)"}},
    ]}]}]
    out = _check("profiles", {"a": {"name": "A", "tabs": tabs}})
    assert out["a"]["tabs"] == SF.clean_tabs(tabs)
    assert "url_path" not in out["a"]["tabs"][0]["sections"][0]["entities"][0]["hold"]


def test_clean_profiles_settings_allowlist():
    settings = {"canvas": {"width": 2560}, "season": "summer", "energy": {"x": 1},
                "header": {"clock": True, "weather_entity": "weather.home"}, "foo": 1}
    out = _check("profiles", {"a": {"name": "A", "settings": settings}})
    assert out["a"]["settings"] == {"canvas": {"width": 2560}, "header": {"clock": True}}
    assert settings["header"]["weather_entity"] == "weather.home"


def test_check_profiles_rejects_only_wrong_type():
    with pytest.raises(vol.Invalid):
        _check("profiles", [])
    assert _check("profiles", {"Bad!": {"name": "X"}}) == {}
    assert _check("profiles", {"a": {"name": "A", "tabs": {}, "settings": []}}) == {"a": {"name": "A"}}
    assert _check("profiles", {"a": {"name": "A", "tabs": []}}) == {"a": {"name": "A", "tabs": []}}
    assert _check("profiles", {"a": {"name": "A", "settings": {"header": {"weather_entity": "weather.home"}}}}) == {
        "a": {"name": "A"},
    }


def test_check_profiles_rejects_oversized_payload():
    with pytest.raises(vol.Invalid):
        _check("profiles", {"a": {"ignored": "x" * MAX_CONFIG_BYTES}})


def test_clean_profiles_keeps_legacy_entries_without_spending_the_cap(caplog):
    legacy = {"tab": "home", "note": {"value": 1}}
    named = {f"p{i}": {"name": f"Pano {i}"} for i in range(10)}
    assert _check("profiles", {"legacy": legacy, **named, "Old Id!": {}}) == {
        "legacy": legacy, **named, "Old Id!": {},
    }
    assert not caplog.records


def test_clean_profiles_warns_only_for_cleaned_data(caplog):
    assert _check("profiles", {"a": {"name": "A", "settings": {}}, "b": {"name": "B"}}) == {
        "a": {"name": "A"}, "b": {"name": "B"},
    }
    assert not caplog.records
    assert _check("profiles", {"a": {"name": "A", "settings": {"season": "summer"}}}) == {"a": {"name": "A"}}
    assert [(record.levelname, record.message) for record in caplog.records] == [
        ("WARNING", "Dashboard profiles contained invalid or outdated data and were cleaned"),
    ]


def test_clean_profiles_stores_phone_layout_only_for_separate_tabs():
    phone = {"nav": "rooms", "tabs": {"order": ["a"]}, "order": {"a": ["b"]}, "secs": {"b": {"hide": True}}}
    profiles = {
        "linked": {"name": "Linked", "settings": {"phone": phone}},
        "separate": {"name": "Separate", "tabs": [], "settings": {"phone": phone}},
    }
    assert _check("profiles", profiles) == {
        "linked": {"name": "Linked", "settings": {"phone": {"nav": "rooms"}}},
        "separate": profiles["separate"],
    }


async def test_legacy_profile_survives_ws_set_and_restore(hass, hass_ws_client, setup_lhd):
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    legacy = {"tab": "home", "note": {"items": ["unchanged"]}}
    profiles = {"legacy": legacy, "desktop": {"name": "Desktop"}}
    result = await _call(ws, ids, type=f"{DOMAIN}/set", key="profiles", value=profiles)
    assert result["success"], result
    assert (await _get(ws, ids))["profiles"] == profiles
    result = await _call(ws, ids, type=f"{DOMAIN}/restore", data={"profiles": profiles})
    assert result["success"], result
    assert (await _get(ws, ids))["profiles"] == profiles


async def test_restore_with_profiles_roundtrip(hass, hass_ws_client, setup_lhd):
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    assert (await _call(ws, ids, type=f"{DOMAIN}/season", season="winter"))["success"]
    profiles = {"masaustu": {"name": "Masaüstü", "tabs": [{"id": "calisma", "sections": []}],
                             "settings": {"canvas": {"width": 2560}}}}
    dirty = {"Bad!": {"name": "X"}, "masaustu": dict(profiles["masaustu"], settings={"canvas": {"width": 2560}, "season": "summer"})}
    for value in (dirty, profiles):
        result = await _call(ws, ids, type=f"{DOMAIN}/restore", data={"profiles": value})
        assert result["success"], result
        data = await _get(ws, ids)
        assert data["profiles"] == profiles
        assert data["settings"]["season"] == "winter"


@pytest.fixture
def stored_profiles(hass_storage):
    tabs = [{"id": "calisma", "sections": [{"entities": [{"entity": "sensor.lhdx_ev", "look": "halo"}]}]}]
    hass_storage[DOMAIN] = {"version": 1, "minor_version": 1, "key": DOMAIN, "data": {
        "profiles": {"Bad!": {"name": "X"}, "masaustu": {"name": "Masaüstü", "tabs": tabs, "settings": {"season": "summer"}}},
    }}


@pytest.mark.usefixtures("stored_profiles", "setup_lhd")
async def test_load_cleans_stored_profiles(hass, hass_storage):
    data = hass.data[DOMAIN].data
    tabs = [{"id": "calisma", "sections": [{"entities": [{"entity": "sensor.lhd_ev_power", "look": "halo"}]}]}]
    expected = {"masaustu": {"name": "Masaüstü", "tabs": tabs}}
    assert data["tabs"] == []
    assert data["profiles"] == expected

    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()
    assert hass_storage[DOMAIN]["data"]["profiles"] == expected


async def test_profiles_rev_conflict(hass, hass_ws_client, hass_read_only_access_token, setup_lhd):
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    before = await _get(ws, ids)
    rev = before["revs"].get("profiles", 0)
    tablet = await hass_ws_client(hass, hass_read_only_access_token)
    assert (await _call(tablet, ids, type=f"{DOMAIN}/season", season="winter"))["success"]

    result = await _call(ws, ids, type=f"{DOMAIN}/set", key="profiles", rev=rev,
                         value={"masaustu": {"name": "Masaüstü", "settings": {"season": "summer"}}})
    assert result["success"], result
    result = await _call(ws, ids, type=f"{DOMAIN}/set", key="profiles", rev=rev, value={})
    assert result["error"]["code"] == "conflict"
    data = await _get(ws, ids)
    assert data["profiles"] == {"masaustu": {"name": "Masaüstü"}}
    assert data["settings"]["season"] == "winter"
    assert data["revs"]["profiles"] == rev + 1
