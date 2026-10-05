"""Security checks (görev-6): stored pets and tabs, feeding rate limit, what non-admin users see."""
from datetime import timedelta

from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.lemur_home_dashboard import safety as SF

DOMAIN = "lemur_home_dashboard"
PET = {"name": "Pamuk", "kind": "cat", "mode": "interval", "every_h": 8, "soon_min": 60, "grace_min": 30,
       "notify": "notify.telefon", "feeder": {"service": "button.press", "target": "button.yemlik"}}


# ---- pure checks ----
def test_pets_schema_accepts_panel_data():
    out = SF.PETS_SCHEMA({"pamuk": PET, "balik-2": {"name": "Balık", "mode": "times", "times": ["08:00"]}})
    assert out["pamuk"]["feeder"]["service"] == "button.press"


def test_pets_schema_rejects_dangerous():
    import voluptuous as vol
    bad = [
        {"pamuk": dict(PET, feeder={"service": "hassio.host_shutdown"})},
        {"pamuk": dict(PET, feeder={"service": "homeassistant.stop"})},
        {"pamuk": dict(PET, feeder={"service": "button.press", "data": "x"})},
        {"pamuk": dict(PET, notify="script.anything")},
        {"pamuk": "not a dict"},
        {"Bad Id!": PET},
        {f"p{i}": PET for i in range(51)},
    ]
    for value in bad:
        try:
            SF.PETS_SCHEMA(value)
        except vol.Invalid:
            continue
        raise AssertionError(f"accepted: {value}")


def test_pets_schema_drops_unknown_fields():
    assert "x" not in SF.PETS_SCHEMA({"pamuk": dict(PET, x=1)})["pamuk"]


def test_clean_tabs():
    tabs = [{"id": "a", "sections": [{"grow": "2", "gap": 999, "entities": [
        "light.a",
        {"entity": "light.b", "tap": {"popup": {"title": "T", "html": "<img src=x onerror=alert(1)>", "card": {"type": "markdown"}}}},
        {"entity": "light.c", "hold": {"action": "url", "url_path": "javascript:alert(1)"}},
        {"entity": "light.d", "tap": {"action": "url", "url_path": "https://example.com/x"}},
    ]}]}, "junk"]
    out = SF.clean_tabs(tabs)
    assert len(out) == 1
    sec = out[0]["sections"][0]
    assert sec["grow"] == 2 and "gap" not in sec
    items = sec["entities"]
    assert items[0] == "light.a"
    assert items[1]["tap"]["popup"] == {"title": "T", "card": {"type": "markdown"}}
    assert "url_path" not in items[2]["hold"]
    assert items[3]["tap"]["url_path"] == "https://example.com/x"
    assert SF.clean_tabs("x") == []


def test_public_data():
    data = {"tabs": [], "pets": {"pamuk": PET}}
    pub = SF.public_data(data)
    assert "feeder" not in pub["pets"]["pamuk"] and "notify" not in pub["pets"]["pamuk"]
    assert pub["pets"]["pamuk"]["name"] == "Pamuk"
    assert "feeder" in data["pets"]["pamuk"]   # original untouched


# ---- with Home Assistant ----
async def test_set_rejects_bad_pets(hass, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "pets",
                        "value": {"pamuk": dict(PET, feeder={"service": "hassio.host_shutdown"})}})
    r = await ws.receive_json()
    assert not r["success"] and r["error"]["code"] == "invalid"
    assert hass.data[DOMAIN].pets() == {}


async def test_set_cleans_tabs(hass, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    ws = await hass_ws_client(hass)
    tabs = [{"id": "a", "sections": [{"entities": [{"entity": "x.y", "tap": {"popup": {"html": "<b>x</b>"}}}]}]}]
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "tabs", "value": tabs})
    r = await ws.receive_json()
    assert r["success"]
    assert hass.data[DOMAIN].data["tabs"][0]["sections"][0]["entities"][0]["tap"]["popup"] == {}


async def test_feed_rate_limit_and_feeder_once(hass, hass_ws_client, setup_lhd):
    await async_setup_component(hass, "http", {})
    presses = async_mock_service(hass, "button", "press")
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "pets", "value": {"pamuk": PET}})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()

    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/feed", "pet": "pamuk"})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert len(presses) == 1
    # second tap within a minute: refused, no second record, feeder not run
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/feed", "pet": "pamuk"})
    r = await ws.receive_json()
    assert not r["success"] and r["error"]["code"] == "too_soon"
    assert len(hass.data[DOMAIN].rec("pamuk")["log"]) == 1
    # undo is always allowed; feeding again records it, but the feeder does not drop food twice
    await ws.send_json({"id": 4, "type": "lemur_home_dashboard/feed", "pet": "pamuk", "undo": True})
    assert (await ws.receive_json())["success"]
    await ws.send_json({"id": 5, "type": "lemur_home_dashboard/feed", "pet": "pamuk"})
    assert (await ws.receive_json())["success"]
    await hass.async_block_till_done()
    assert len(presses) == 1
    assert len(hass.data[DOMAIN].rec("pamuk")["log"]) == 1


async def test_stored_bad_feeder_is_not_run(hass, setup_lhd):
    """A record stored by an older version (or edited by hand) with a forbidden service is skipped."""
    calls = async_mock_service(hass, "homeassistant", "stop")
    d = hass.data[DOMAIN]
    d.data["pets"] = {"pamuk": dict(PET, feeder={"service": "homeassistant.stop", "data": 5})}
    assert await d.async_feed("pamuk", "test")
    await hass.async_block_till_done()
    assert calls == []
    assert d.rec("pamuk")["last"]


async def test_tick_survives_broken_pets(hass, setup_lhd):
    d = hass.data[DOMAIN]
    d.data["pets"] = {"a": "broken", "b": {"name": "B", "mode": "times", "times": ["x"]}, "c": {"name": "C", "every_h": "zz"}}
    d.data["feed"] = {"b": "broken", "c": {"last": "not a date", "log": []}}
    await d.async_tick()
    d.refresh_all()
    await hass.async_block_till_done()


async def test_non_admin_does_not_see_feeder(hass, hass_ws_client, hass_read_only_access_token, setup_lhd):
    await async_setup_component(hass, "http", {})
    admin = await hass_ws_client(hass)
    await admin.send_json({"id": 1, "type": "lemur_home_dashboard/set", "key": "pets", "value": {"pamuk": PET}})
    assert (await admin.receive_json())["success"]

    user = await hass_ws_client(hass, hass_read_only_access_token)
    await user.send_json({"id": 1, "type": "lemur_home_dashboard/get"})
    r = await user.receive_json()
    assert r["success"]
    assert r["result"]["pets"]["pamuk"]["name"] == "Pamuk"
    assert "feeder" not in r["result"]["pets"]["pamuk"] and "notify" not in r["result"]["pets"]["pamuk"]

    await user.send_json({"id": 2, "type": "lemur_home_dashboard/subscribe"})
    assert (await user.receive_json())["success"]
    await admin.send_json({"id": 2, "type": "lemur_home_dashboard/season", "season": "winter"})
    assert (await admin.receive_json())["success"]
    ev = await user.receive_json()
    assert ev["type"] == "event" and "feeder" not in ev["event"]["pets"]["pamuk"]

    # a feeding sends only that pet's record
    await user.send_json({"id": 3, "type": "lemur_home_dashboard/feed", "pet": "pamuk"})
    msgs = [await user.receive_json(), await user.receive_json()]
    ev = [m for m in msgs if m.get("type") == "event"][0]
    assert list(ev["event"]) == ["__feed"] and ev["event"]["__feed"]["pamuk"]["last"]

    # a non-admin user cannot change pets
    await user.send_json({"id": 4, "type": "lemur_home_dashboard/set", "key": "pets", "value": {}})
    r = await user.receive_json()
    assert not r["success"]


async def test_old_feed_record_still_feeds(hass, setup_lhd):
    d = hass.data[DOMAIN]
    d.data["pets"] = {"pamuk": {"name": "Pamuk"}}
    d.data["feed"] = {"pamuk": {"last": (dt_util.now() - timedelta(minutes=5)).isoformat(), "log": []}}
    assert await d.async_feed("pamuk", "t")
