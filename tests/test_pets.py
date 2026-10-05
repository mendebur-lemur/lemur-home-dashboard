"""Feeding reminders (Besleme kartı)."""
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_mock_service

DOMAIN = "lemur_home_dashboard"


async def test_pets(hass: HomeAssistant, hass_ws_client, setup_lhd):
    """Feeding reminders: entities, statuses, late notification, feed / undo, removing a pet."""
    await async_setup_component(hass, "http", {})
    entry = setup_lhd
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lemur_home_dashboard/get"})
    r = await ws.receive_json(); assert r["success"]; assert r["result"]["pets"] == {} and r["result"]["feed"] == {}
    pets = {"pamuk": {"name": "Pamuk", "kind": "cat", "icon": "mdi:cat", "mode": "interval", "every_h": 8, "soon_min": 60, "grace_min": 30, "notify": "notify.telefon"},
            "balik": {"name": "Balıklar", "kind": "fish", "mode": "times", "times": ["08:00", "20:00"]}}
    await ws.send_json({"id": 2, "type": "lemur_home_dashboard/set", "key": "pets", "value": pets})
    r = await ws.receive_json(); assert r["success"], r
    await hass.async_block_till_done()
    st = hass.states.get("sensor.pamuk_besleme")
    assert st.state == "never"
    assert hass.states.get("button.pamuk_besledim") is not None
    sb = hass.states.get("sensor.baliklar_besleme"); assert sb.state == "never" and sb.attributes["next_feeding"]
    # feed via ws
    await ws.send_json({"id": 3, "type": "lemur_home_dashboard/feed", "pet": "pamuk"})
    r = await ws.receive_json(); assert r["success"], r
    await hass.async_block_till_done()
    st = hass.states.get("sensor.pamuk_besleme")
    assert st.state == "ok" and st.attributes["last_fed"]
    # time passes -> soon, due, late + notify
    calls = async_mock_service(hass, "notify", "telefon")
    # statuses use dt_util.now (real time); simulate by moving record back
    d = hass.data[DOMAIN]
    rec = dict(d.rec("pamuk")); last = dt_util.parse_datetime(rec["last"]) - timedelta(hours=8.7)
    rec["last"] = last.isoformat(); rec["due"] = (last + timedelta(hours=8)).isoformat(); d.set_rec("pamuk", rec)
    await d.async_tick(); await hass.async_block_till_done()
    assert hass.states.get("sensor.pamuk_besleme").state == "late"
    assert len(calls) == 1 and "Pamuk" in calls[0].data["message"]
    await d.async_tick(); await hass.async_block_till_done()
    assert len(calls) == 1
    # button press -> ok
    await hass.services.async_call("button", "press", {"entity_id": "button.pamuk_besledim"}, blocking=True); await hass.async_block_till_done()
    assert hass.states.get("sensor.pamuk_besleme").state == "ok"
    # service feed by name + undo
    await hass.services.async_call(DOMAIN, "feed", {"pet": "Balıklar"}, blocking=True); await hass.async_block_till_done()
    b = hass.states.get("sensor.baliklar_besleme"); assert b.attributes["last_fed"]
    await hass.services.async_call(DOMAIN, "feed", {"pet": "balik", "undo": True}, blocking=True); await hass.async_block_till_done()
    assert hass.states.get("sensor.baliklar_besleme").attributes["last_fed"] is None
    # remove pet -> entities removed
    await ws.send_json({"id": 4, "type": "lemur_home_dashboard/set", "key": "pets", "value": {"pamuk": pets["pamuk"]}})
    r = await ws.receive_json(); assert r["success"]
    await hass.async_block_till_done()
    assert hass.states.get("sensor.baliklar_besleme") is None
    # unload
    assert await hass.config_entries.async_unload(entry.entry_id)
