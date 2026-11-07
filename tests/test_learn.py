"""Enerji → Öğren: light tables, measuring with a plug, learning per state, the pool lookup."""
import asyncio
from types import SimpleNamespace

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant

from custom_components.lemur_home_dashboard import estimates as EST
from custom_components.lemur_home_dashboard import learn as LRN
from custom_components.lemur_home_dashboard import lut as LUT
from custom_components.lemur_home_dashboard import pool as POOL


def st(state, **a):
    return SimpleNamespace(state=state, attributes=a)


TB = {"ct": {"k": [2700, 6500], "b": [1, 50, 100], "w": [[1, 8, 18], [1, 9, 20]]},
      "hs": {"h": [0, 120, 240], "s": [100, 50], "b": [1, 50, 100], "w": [[[1, 6, 12], [1, 7, 14], [1, 9, 18]], [[1, 7, 16], [1, 7, 16], [1, 8, 17]]]}}


def test_table_power_and_schema():
    t = LUT.valid_lut(TB)
    assert LUT.power(t, {"brightness": 255, "color_mode": "color_temp", "color_temp_kelvin": 6500}) == 20
    assert abs(LUT.power(t, {"brightness": 255, "color_mode": "color_temp", "color_temp_kelvin": 4600}) - 19) < 1e-9
    assert abs(LUT.power(t, {"brightness": 127.5, "color_mode": "color_temp", "color_temp_kelvin": 2700}) - 8) < 1e-9
    assert LUT.power(t, {"brightness": 255, "color_mode": "hs", "hs_color": [240, 100]}) == 18
    assert LUT.power(t, {"brightness": 255, "color_mode": "hs", "hs_color": [300, 100]}) == 15     # between 240 and 360(=0)
    assert LUT.power(t, {"brightness": 255, "color_mode": "hs", "hs_color": [0, 75]}) == 14        # between saturations
    assert LUT.span(t) == (1, 20) and LUT.count(t) == 6 + 18
    rec = {"kind": "light", "idle": 0.4, "max": 10, "lut": t}
    assert EST.power(rec, st("off")) == 0.4
    assert EST.power(rec, st("on", brightness=255, color_mode="hs", hs_color=[120, 100])) == 14
    assert EST.ESTIMATES_SCHEMA({"a": {"name": "A", "kind": "light", "entity": "light.a", "lut": TB, "src": "own"}})["a"]["lut"]["ct"]["k"] == [2700.0, 6500.0]
    for bad in ({"ct": {"k": [6500, 2700], "b": [1], "w": [[1], [1]]}}, {"hs": {"h": [0], "s": [100], "b": [1], "w": [[["x"]]]}}, {"br": {"b": [1, 2], "w": [1]}}, {"zz": 1}, {"fx": 3}):
        with pytest.raises(vol.Invalid):
            LUT.valid_lut(bad)


def test_from_csv():
    ct = [(b, m, round(b / 255 * 10 + (m - 153) / 347, 2)) for b in (1, 128, 255) for m in (153, 250, 370, 454, 500)]
    t = LUT.from_csv("ct", ct)
    assert t["k"][0] == 2000 and t["k"][-1] == 6500 and len(t["w"]) == len(t["k"]) and len(t["w"][0]) == len(LUT.BRI)
    hs = [(b, h, s, round(b / 255 * 10 + h / 65535, 2)) for b in (1, 255) for h in range(0, 65536, 6553) for s in (127, 254)]
    t2 = LUT.from_csv("hs", hs)
    assert len(t2["w"]) == 2 and len(t2["w"][0]) == 12
    assert LUT.valid_lut({"ct": t, "hs": t2})


async def _fake_light(hass, modes, watts, extra=None):
    """light.x answers turn_on / turn_off and the plug sensor.p follows with watts(attrs)."""
    attrs = {"supported_color_modes": modes, "min_color_temp_kelvin": 2700, "max_color_temp_kelvin": 6500, **(extra or {})}
    hass.states.async_set("light.x", "off", attrs)
    hass.states.async_set("sensor.p", "0.3", {"unit_of_measurement": "W", "device_class": "power"})
    calls = []

    async def on(call):
        a = dict(hass.states.get("light.x").attributes)
        if "brightness_pct" in call.data:
            a["brightness"] = round(call.data["brightness_pct"] * 2.55)
        if "color_temp_kelvin" in call.data:
            a.update(color_mode="color_temp", color_temp_kelvin=call.data["color_temp_kelvin"])
        if "hs_color" in call.data:
            a.update(color_mode="hs", hs_color=call.data["hs_color"], effect=None)
        if "color_temp_kelvin" in call.data:
            a["effect"] = None
        if "effect" in call.data:
            a["effect"] = call.data["effect"]
        calls.append(("on", dict(call.data)))
        hass.states.async_set("light.x", "on", a)
        hass.states.async_set("sensor.p", str(watts(a)), {"unit_of_measurement": "W", "device_class": "power"})

    async def off(call):
        calls.append(("off", dict(call.data)))
        hass.states.async_set("light.x", "off", dict(hass.states.get("light.x").attributes))
        hass.states.async_set("sensor.p", "0.3", {"unit_of_measurement": "W", "device_class": "power"})

    hass.services.async_register("light", "turn_on", on)
    hass.services.async_register("light", "turn_off", off)
    return calls


async def _until(pred, n=4000):
    for _ in range(n):
        if pred():
            return True
        await asyncio.sleep(0.005)
    return False


@pytest.fixture
def fast(monkeypatch):
    monkeypatch.setattr(LRN.LightLearn, "first_wait", 0.0)
    monkeypatch.setattr(LRN.LightLearn, "quiet", 0.01)
    monkeypatch.setattr(LRN.LightLearn, "poll", 0.002)
    monkeypatch.setattr(LRN.LightLearn, "fx_window", 0.02)


async def test_light_learn_full(hass: HomeAssistant, fast):
    def w(a):
        b = a.get("brightness", 255) / 255
        if a.get("color_mode") == "hs":
            return round(1 + 15 * b * (0.6 + 0.4 * a["hs_color"][0] / 360), 2)
        return round(1 + 19 * b, 2)
    calls = await _fake_light(hass, ["color_temp", "hs"], w)
    L = LRN.Learning(hass)
    with pytest.raises(ValueError):
        L.start("x", "light", "light.x", "sensor.yok")
    r = L.start("x", "light", "light.x", "sensor.p", 1)
    assert await _until(lambda: r.phase in ("done", "error")), r.status()
    s = r.status()
    assert s["phase"] == "done", s
    assert s["standby"] == 0.3 and [p["c"] for p in s["probe"]] == ["white", "red", "green", "blue"]
    assert s["plan"]["h"] == LUT.HUES and s["plan"]["s"] == [100, 50] and s["plan"]["k"][0] == 2700   # colors differ: the fine grid
    res = s["result"]
    assert res["n"] == len(s["plan"]["k"]) * 8 + 12 * 2 * 8 and res["standby"] == 0.3 and res["max"] == 20
    tb = res["lut"]
    assert LUT.power(tb, {"brightness": 255, "color_mode": "color_temp", "color_temp_kelvin": 4000}) == 20
    assert calls[-1][0] == "off"   # put back as it was (off)


async def test_light_learn_dimmer_pause_and_external(hass: HomeAssistant, fast):
    calls = await _fake_light(hass, ["brightness"], lambda a: round(0.5 + 9 * a.get("brightness", 255) / 255, 2))
    hass.states.async_set("light.x", "on", {"supported_color_modes": ["brightness"], "brightness": 100})
    L = LRN.Learning(hass)
    r = L.start("d", "light", "light.x", "sensor.p", 1)
    with pytest.raises(ValueError):
        L.start("d", "light", "light.x", "sensor.p", 1)   # one run per device
    assert await _until(lambda: r.phase == "run")
    await L.control("d", "pause")
    assert r.phase == "paused" and calls[-1] == ("on", {"entity_id": "light.x", "brightness": 100})   # back to how it was
    await asyncio.sleep(0.05)
    L.control and await L.control("d", "resume")
    assert await _until(lambda: r.phase in ("done", "error"))
    assert r.phase == "done" and r.result["lut"]["br"]["w"][-1] == 9.5 and r.result["n"] == 8
    # someone turns the light off from elsewhere during a run: it stops
    r2 = L.start("d", "light", "light.x", "sensor.p", 1)
    assert await _until(lambda: r2.phase == "run")
    orig = r2._settle

    async def settle_then_off():
        v = await orig()
        hass.states.async_set("light.x", "off", {"supported_color_modes": ["brightness"]})
        return v
    r2._settle = settle_then_off
    assert await _until(lambda: r2.phase in ("error", "done"))
    assert r2.phase == "error" and r2.msg == "external"
    await L.control("d", "clear")
    assert L.status() == {}


async def test_state_learn(hass: HomeAssistant):
    hass.states.async_set("media_player.tv", "playing")
    hass.states.async_set("sensor.p", "95", {"unit_of_measurement": "W"})
    L = LRN.Learning(hass)
    r = L.start("tv", "states", "media_player.tv", "sensor.p")
    r._t -= 120   # two minutes of playing at 95 W
    hass.states.async_set("media_player.tv", "paused")
    hass.states.async_set("sensor.p", "70", {"unit_of_measurement": "W"})
    await hass.async_block_till_done()
    r._t -= 60
    L.runs["tv"].stop()
    s = r.status()
    assert s["phase"] == "done"
    assert s["states"]["playing"]["avg"] == 95 and s["states"]["playing"]["sec"] >= 120
    assert s["states"]["paused"]["avg"] == 70


def test_pool_match():
    lib = {"models": {"govee|h61a1": {"manufacturer": "Govee", "model": "H61A1", "aliases": ["RGBIC Strip"], "n": 3, "lut": TB}}}
    assert POOL._match_pool(lib, "Govee", [POOL.norm("H61A1")])
    assert POOL._match_pool(lib, "govee lighting", [POOL.norm("rgbic strip")])
    assert POOL._match_pool(lib, "Govee", [POOL.norm("H6008")]) is None
    idx = {"manufacturers": [{"name": "signify", "dir_name": "signify", "aliases": ["Philips", "Signify Netherlands B.V."], "models": [{"id": "LCT024", "name": "Hue Play", "aliases": ["915005733701"]}]}]}
    assert POOL._match_lib(idx, "Signify Netherlands B.V.", [POOL.norm("LCT024")])[0] == "signify"
    assert POOL._match_lib(idx, "Philips", [POOL.norm("Hue Play")])
    assert POOL._match_lib(idx, "IKEA", [POOL.norm("LCT024")]) is None


async def test_pool_lookup(hass: HomeAssistant, aioclient_mock):
    """Own pool first; otherwise the open library's table, resampled."""
    import gzip
    POOL._CACHE.clear()
    aioclient_mock.get(POOL.POOL_URL, json={"v": 1, "models": {"govee|h61a1": {"manufacturer": "Govee", "model": "H61A1", "n": 3, "standby": 0.4, "lut": TB, "strip": True, "per_m": True, "cap_w": 24}}})
    r = await POOL.lookup(hass, "Govee", "RGBIC Strip", "H61A1")
    assert r["source"] == "pool" and r["n"] == 3 and r["per_m"] and r["cap_w"] == 24 and r["max"] == 20
    aioclient_mock.get(POOL.LIB_BASE + "library.json", json={"manufacturers": [{"name": "signify", "dir_name": "signify", "aliases": ["Signify Netherlands B.V."], "models": [{"id": "LCT024", "name": "Hue Play", "calculation_strategy": "lut", "standby_power": 0.3, "device_specs": {"form_factor": "lightbar"}}]}]})
    csv = "bri,mired,watt\n" + "\n".join(f"{b},{m},{round(b / 255 * 6 + 0.4, 2)}" for b in (1, 128, 255) for m in (153, 454))
    aioclient_mock.get(POOL.LIB_BASE + "signify/LCT024/color_temp.csv.gz", content=gzip.compress(csv.encode()))
    aioclient_mock.get(POOL.LIB_BASE + "signify/LCT024/hs.csv.gz", status=404)
    aioclient_mock.get(POOL.LIB_BASE + "signify/LCT024/brightness.csv.gz", status=404)
    r2 = await POOL.lookup(hass, "Signify Netherlands B.V.", "Hue play", "LCT024")
    assert r2["source"] == "library" and r2["standby"] == 0.3 and r2["max"] == 6.4 and "ct" in r2["lut"] and not r2["strip"]
    assert await POOL.lookup(hass, "IKEA", "x", "") is None



async def test_light_effects_and_curve(hass: HomeAssistant, fast):
    """Each effect at 100%, then three of them at 75 / 50 / 25 / 10% for the brightness curve of effects."""
    def w(a):
        b = a.get("brightness", 255) / 255
        if a.get("effect"):
            return round({"Candle": 4, "Party": 12, "Ocean": 8}[a["effect"]] * (0.2 + 0.8 * b), 2)
        return round(1 + 9 * b, 2)
    await _fake_light(hass, ["brightness"], w, {"effect_list": ["None", "Candle", "Party", "Ocean"]})
    L = LRN.Learning(hass)
    r = L.start("fx", "light", "light.x", "sensor.p", 1)
    assert await _until(lambda: r.phase in ("done", "error"), 8000), r.status()
    assert r.phase == "done", r.status()
    fx = r.result["lut"]["fx"]
    assert fx["e"] == {"Candle": 4, "Party": 12, "Ocean": 8} and fx["avg"] == 8
    assert fx["b"] == [10, 25, 50, 75, 100] and fx["r"][-1] == 1 and abs(fx["r"][2] - 0.6) < 0.02     # 0.2 + 0.8 * 0.5
    tb = r.result["lut"]
    assert abs(LUT.power(tb, {"brightness": 127.5, "effect": "Party"}) - 12 * 0.6) < 0.3
    assert abs(LUT.power(tb, {"brightness": 255, "effect": "Unknown one"}) - 8) < 1e-9       # not measured: the average
    assert LUT.power(tb, {"brightness": 255, "color_mode": "brightness"}) == 10                 # no effect: the table


async def test_skip_effects(hass: HomeAssistant, fast, monkeypatch):
    monkeypatch.setattr(LRN.LightLearn, "fx_window", 0.15)
    await _fake_light(hass, ["brightness"], lambda a: 5.0 if a.get("effect") else round(1 + 9 * a.get("brightness", 255) / 255, 2), {"effect_list": [f"E{i}" for i in range(20)]})
    L = LRN.Learning(hass)
    r = L.start("s", "light", "light.x", "sensor.p", 1)
    assert await _until(lambda: r.phase == "fx" and len(r.res.get("fxl", {})) >= 2, 8000)
    await L.control("s", "skipfx")
    assert await _until(lambda: r.phase in ("done", "error"), 8000)
    e = r.result["lut"]["fx"]["e"]
    assert 2 <= len(e) < 20 and "b" not in r.result["lut"]["fx"]


async def test_plug_and_bridge_busy_and_average(hass: HomeAssistant, fast, monkeypatch):
    from homeassistant.helpers import entity_registry as er
    from pytest_homeassistant_custom_component.common import MockConfigEntry
    hass.states.async_set("sensor.p", "30", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.q", "9", {"unit_of_measurement": "W"})
    hass.states.async_set("media_player.tv", "playing")
    saved = {}
    L = LRN.Learning(hass, None, lambda d: saved.update(runs=d))
    a = L.start("buz", "avg", "", "sensor.p")
    assert saved["runs"]["buz"]["plug"] == "sensor.p"
    with pytest.raises(ValueError, match="plug_busy"):
        L.start("tv", "states", "media_player.tv", "sensor.p")
    L.start("tv", "states", "media_player.tv", "sensor.q")
    async def fake(hass2, plug, started):
        return {"avg": 31.2, "hours": 30, "kwh": 0.936, "avg24": 31.0, "days": [], "settled": True}
    monkeypatch.setattr(LRN, "average_since", fake)
    st = await L.async_status()
    assert st["buz"]["avg"] == 31.2 and st["buz"]["settled"] and st["buz"]["phase"] == "listen"
    # kept across a restart
    L2 = LRN.Learning(hass, saved["runs"], None)
    assert L2.runs["buz"].plug == "sensor.p" and L2.runs["buz"].started == a.started
    await L.control("buz", "stop")
    assert L.runs["buz"].phase == "done" and "buz" not in saved["runs"]
    # two lights on the same bridge are not measured at once
    entry = MockConfigEntry(domain="hue"); entry.add_to_hass(hass)
    reg = er.async_get(hass)
    for n in ("a", "b"):
        reg.async_get_or_create("light", "hue", n, config_entry=entry, suggested_object_id=n)
        hass.states.async_set(f"light.{n}", "off", {"supported_color_modes": ["brightness"]})
    hass.states.async_set("sensor.r", "1", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.s", "1", {"unit_of_measurement": "W"})
    async def svc(call):
        return None
    hass.services.async_register("light", "turn_on", svc); hass.services.async_register("light", "turn_off", svc)
    L.start("la", "light", "light.a", "sensor.r", 1)
    with pytest.raises(ValueError, match="bridge_busy"):
        L.start("lb", "light", "light.b", "sensor.s", 1)
    await L.async_stop()
