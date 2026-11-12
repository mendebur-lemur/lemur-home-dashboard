"""Backup restore (ws lemur_home_dashboard/restore, v0.36.0b4): every key checked before anything is written.

backup_full.json: a home with every key the backup holds filled in (tabs with a free grid and phone settings, settings
with style / kiosk / tariff, profiles, pets with feeding times, energy devices of every kind with a measured table,
categories, wall switches, backup controls).
"""
import copy
import json
import pathlib

from homeassistant.setup import async_setup_component

KEYS = ("tabs", "settings", "profiles", "pets", "estimates", "ecats", "twins", "walls")
FULL = json.loads((pathlib.Path(__file__).parent / "backup_full.json").read_text(encoding="utf-8"))
DOMAIN = "lemur_home_dashboard"


async def _ws(hass, hass_ws_client, token=None):
    await async_setup_component(hass, "http", {})
    return await hass_ws_client(hass, token) if token else await hass_ws_client(hass)


class _Ids:
    n = 100

    def __call__(self):
        self.n += 1
        return self.n


async def _call(ws, ids, **msg):
    await ws.send_json({"id": ids(), **msg})
    while True:
        r = await ws.receive_json()
        if r.get("type") == "result":
            return r


async def _get(ws, ids):
    r = await _call(ws, ids, type=f"{DOMAIN}/get")
    assert r["success"], r
    return r["result"]


def _norm(x):
    return json.loads(json.dumps(x))


async def test_round_trip_fresh_install(hass, hass_ws_client, setup_lhd):
    """Backup of a full home, restored on a fresh install: the same store, key for key."""
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    before = await _get(ws, ids)
    assert before["tabs"] == [] and before["walls"] == []
    r = await _call(ws, ids, type=f"{DOMAIN}/restore", data=copy.deepcopy(FULL), revs={k: before["revs"].get(k, 0) for k in FULL})
    assert r["success"], r
    after = await _get(ws, ids)
    for k in KEYS:
        assert _norm(after[k]) == _norm(FULL[k]), k
    # the backup the page would make now (STORE.data's keys) restores to the same again
    r = await _call(ws, ids, type=f"{DOMAIN}/restore", data={k: after[k] for k in KEYS})
    assert r["success"], r
    again = await _get(ws, ids)
    assert all(_norm(again[k]) == _norm(after[k]) for k in KEYS)
    assert all(again["revs"][k] == after["revs"][k] + 1 for k in KEYS)
    # sensors of the energy devices and categories are made at once
    await hass.async_block_till_done()
    assert hass.data[DOMAIN].estimates().keys() == FULL["estimates"].keys()


async def test_refused_key_writes_nothing(hass, hass_ws_client, setup_lhd):
    """One bad key (here a pet with a forbidden feeder, a too large tab list, a broken wall switch): nothing changes."""
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    assert (await _call(ws, ids, type=f"{DOMAIN}/restore", data=copy.deepcopy(FULL)))["success"]
    base = await _get(ws, ids)
    bad_pets = copy.deepcopy(FULL["pets"])
    bad_pets["pamuk"]["feeder"] = {"service": "homeassistant.stop"}
    huge = [{"id": "t", "name": "x" * (1024 * 1024 + 10), "sections": []}]
    for data, part in (
        ({"tabs": [{"id": "yeni", "sections": []}], "settings": {"a": 1}, "pets": bad_pets}, "pets"),
        ({"tabs": huge, "settings": {"a": 1}}, "tabs"),
        ({"tabs": [], "walls": [{"switch": "switch.x"}], "ecats": [{"id": "a", "name": "A"}, {"id": "a", "name": "B"}]}, "walls"),
        ({"tabs": [], "settings": [1, 2]}, "settings"),
    ):
        r = await _call(ws, ids, type=f"{DOMAIN}/restore", data=data)
        assert not r["success"] and r["error"]["code"] == "invalid", r
        assert r["error"]["message"].split(":")[0] == part or f"{part}:" in r["error"]["message"], r
        now = await _get(ws, ids)
        assert all(_norm(now[k]) == _norm(base[k]) for k in KEYS), data.keys()
        assert now["revs"] == base["revs"]
    # every bad key is named (the page lists them)
    r = await _call(ws, ids, type=f"{DOMAIN}/restore", data={"tabs": [], "walls": [{"switch": "switch.x"}], "ecats": [{"id": "a", "name": "A"}, {"id": "a", "name": "B"}]})
    assert "ecats:" in r["error"]["message"] and "walls:" in r["error"]["message"]


async def test_old_backup_keeps_new_keys(hass, hass_ws_client, setup_lhd):
    """A 0.35.1 backup (tabs, settings, profiles, pets, estimates) does not wipe categories, wall switches, backup controls."""
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    assert (await _call(ws, ids, type=f"{DOMAIN}/restore", data=copy.deepcopy(FULL)))["success"]
    old = {"tabs": [{"id": "eski", "name": "Eski", "sections": []}], "settings": {"season": "summer"}, "profiles": {},
           "pets": {"boncuk": {"name": "Boncuk", "kind": "dog", "mode": "interval", "every_h": 8}}, "estimates": {"modem": {"name": "Modem", "kind": "fixed", "w": 9}}}
    assert (await _call(ws, ids, type=f"{DOMAIN}/restore", data=copy.deepcopy(old)))["success"]
    now = await _get(ws, ids)
    for k in ("ecats", "twins", "walls"):
        assert _norm(now[k]) == _norm(FULL[k]), k
    assert now["tabs"] == [{"id": "eski", "name": "Eski", "sections": []}]
    assert list(now["pets"]) == ["boncuk"] and list(now["estimates"]) == ["modem"]
    assert "boncuk" in now["feed"] and "pamuk" not in hass.data[DOMAIN].pets()


async def test_conflict_unknown_key_and_non_admin(hass, hass_ws_client, hass_read_only_access_token, setup_lhd):
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    base = await _get(ws, ids)
    r = await _call(ws, ids, type=f"{DOMAIN}/restore", data={"tabs": [{"id": "a", "sections": []}]}, revs={"tabs": 7})
    assert r["error"]["code"] == "conflict"
    r = await _call(ws, ids, type=f"{DOMAIN}/restore", data={"tabs": [], "feed": {}})
    assert r["error"]["code"] == "invalid" and r["error"]["message"].startswith("feed:")
    user = await hass_ws_client(hass, hass_read_only_access_token)
    r = await _call(user, ids, type=f"{DOMAIN}/restore", data={"tabs": [{"id": "a", "sections": []}]})
    assert r["error"]["code"] == "unauthorized"
    assert (await _get(ws, ids))["tabs"] == base["tabs"] == []


async def test_ws_set_messages_unchanged(hass, hass_ws_client, setup_lhd):
    """ws_set uses the same check (_check): the error texts the page shows stay as they were."""
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    r = await _call(ws, ids, type=f"{DOMAIN}/set", key="tabs", value=[{"id": "x" * (1024 * 1024 + 1)}])
    assert r["error"]["message"] == "tabs: wrong type or too large"
    r = await _call(ws, ids, type=f"{DOMAIN}/set", key="pets", value={"a": {"feeder": {"service": "homeassistant.stop"}}})
    assert r["error"]["message"].startswith("pets: ")
