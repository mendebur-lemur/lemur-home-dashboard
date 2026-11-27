"""Data saved by 0.35.1 (with odd but valid old shapes) loads in this version unchanged (except the legacy profiles
entry, which is dropped), and saving each key back unchanged from the admin page (ws_set, as the page does after an edit
elsewhere) neither refuses nor rewrites it.
Runs on both trees; with LHD_DUMP=<file> it writes what it saw, so 0.35.1 and 0.36 can be compared."""
import copy
import json
import os
from pathlib import Path
from unittest.mock import patch

from pytest_homeassistant_custom_component.common import MockConfigEntry

DOMAIN = "lemur_home_dashboard"
HERE = Path(__file__).parent


def _blob():
    p = HERE / "backup_full.json"
    d = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {"tabs": [], "settings": {}}
    d = copy.deepcopy(d)
    # odd but valid 0.35.1 shapes
    d["tabs"].append({"id": "eski", "name": "Eski", "sections": [
        {"id": "s1", "type": "lights", "entities": ["light.a", {"entity": "light.b"}, {"name": "Boş", "icon": "mdi:sofa"}, {"subtitle": "Üst"}]},
        {"id": "s2", "type": "scenes", "entities": [{"name": "Film", "icon": "mdi:movie", "color": "#ff0000", "action": {"service": "scene.turn_on", "target": "scene.film"}, "confirm": True}]},
        {"id": "s3", "type": "cards", "entities": [{"card": {"type": "markdown", "content": "x"}}]},
        {"id": "s4", "type": "energy", "entities": []},
        {"id": "s5", "type": "climate", "entities": ["climate.salon"], "col": 2, "sub": 1},
    ]})
    d["tabs"].append({"id": "izg", "name": "Izgara", "layout": "grid", "sections": [{"id": "g1", "type": "lights", "entities": ["light.a"]}, {"id": "g2", "type": "lights", "entities": ["light.b"], "g": {"x": 0, "y": 0, "w": 6, "h": 4}}]})
    est = d.setdefault("estimates", {})
    est["kurutma"] = {"name": "Kurutma", "kind": "cycle", "entity": "switch.kurutma", "k100": 2.5, "week": 3}
    est["buzdolabi"] = {"name": "Buzdolabı", "kind": "year", "year": 250}
    est["tv"] = {"name": "TV", "kind": "onoff", "entity": "media_player.tv", "on": 90, "off": 0.5}
    est["kombi"] = {"name": "Kombi", "kind": "states", "entity": "climate.salon", "states": [{"s": "heat", "w": 120}]}
    est["modem"] = {"name": "Modem", "kind": "fixed", "w": 12}
    est["bulasik"] = {"name": "Bulaşık", "kind": "meas", "sensor": "sensor.bulasik_power", "energy": "sensor.bulasik_energy", "cat": ""}
    d["feed"] = {"pamuk": {"last": "2026-11-10T08:01:00+03:00", "log": []}}
    d["energy_solar_src"] = ""
    d["energy_grid_src"] = ""
    d["learn_avg"] = {"r1": {"plug": "sensor.p_power", "kind": "avg", "entity": "light.x", "started": 1763000000.0}}
    d["version"] = 1
    d["legacy_top_key"] = {"x": 1}                            # a key no version knows
    return d


async def _ws(hass, hass_ws_client):
    ws = await hass_ws_client(hass)
    ws.n = 0

    async def call(**m):
        ws.n += 1
        await ws.send_json(dict(m, id=ws.n, type=f"{DOMAIN}/{m.pop('t')}"))
        while True:
            r = await ws.receive_json()
            if r.get("id") == ws.n and r["type"] == "result":
                return r
    return call


async def test_035_data_loads_and_resaves_unchanged(hass, hass_storage, hass_ws_client):
    blob = _blob()
    hass_storage[DOMAIN] = {"version": 1, "minor_version": 1, "key": DOMAIN, "data": copy.deepcopy(blob)}
    hass.config.language = "tr"
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
        loaded = copy.deepcopy(d.data)
        call = await _ws(hass, hass_ws_client)
        got = (await call(t="get"))["result"]
        res = {}
        for key in ("settings", "tabs", "profiles", "pets", "twins", "walls", "estimates", "ecats"):
            before = copy.deepcopy(d.data[key])
            r = await call(t="set", key=key, value=copy.deepcopy(got[key]), rev=(got.get("revs") or {}).get(key, 0))
            res[key] = {"ok": r["success"], "err": r.get("error"), "same": d.data[key] == before}
            got = (await call(t="get"))["result"]
        await hass.async_block_till_done()
    lost = {k: (k in loaded) for k in blob}
    changed = {k: loaded.get(k) != blob[k] for k in blob if k in loaded}
    out = {"lost_keys": [k for k, v in lost.items() if not v], "changed_on_load": [k for k, v in changed.items() if v], "resave": res,
           "loaded": loaded}
    if os.environ.get("LHD_DUMP"):
        Path(os.environ["LHD_DUMP"]).write_text(json.dumps(out, indent=1, sort_keys=True, ensure_ascii=False), encoding="utf-8")
    # v0.6 öncesinin eski profil kaydı pano profili değildir: atılır.
    assert loaded["profiles"] == {}
    for k in blob:
        if k in loaded and k not in ("estimates", "profiles"):
            assert loaded[k] == blob[k], k
    assert loaded["estimates"] == blob["estimates"]
    for k, v in res.items():
        assert v["ok"], (k, v)
        assert v["same"], k
