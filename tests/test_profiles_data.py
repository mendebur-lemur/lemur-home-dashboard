"""PR #35 veri katmanı: çok derin iç içe değer, kayıtlı profillerin yüklenmesi, 0.36.0'ın yazdığı profil verisi."""
import copy

import pytest
import voluptuous as vol

from custom_components.lemur_home_dashboard import MAX_DEPTH, _check
from custom_components.lemur_home_dashboard.const import MAX_CONFIG_BYTES
from tests.test_backup_restore import DOMAIN, _Ids, _call, _get, _ws


def _nest(n):
    x = []
    for _ in range(n):
        x = [x]
    return x


@pytest.mark.parametrize("key", ["profiles", "settings", "tabs"])
def test_check_refuses_too_deep(key):
    """orjson (HA'nın deposu ve websocket'i) 255 kattan derini yazamaz: böyle bir değer hiç kabul edilmez."""
    value = {"a": {"name": "A", "settings": {"canvas": _nest(300)}}} if key == "profiles" else (
        {"canvas": _nest(300)} if key == "settings" else [{"id": "t", "sections": [], "x": _nest(300)}])
    with pytest.raises(vol.Invalid, match="too deeply nested"):
        _check(key, value)
    with pytest.raises(vol.Invalid):   # özyinelemeli json.dumps'a hiç varmadan (RecursionError değil)
        _check("settings", {"canvas": _nest(5000)})


def test_check_keeps_real_depth():
    """Gerçek düzenler (15 kat kadar) ve sınırdaki değer geçer."""
    assert _check("settings", {"canvas": _nest(MAX_DEPTH - 2)})
    tabs = [{"id": "t", "sections": [{"id": "s", "entities": [{"card": {"type": "vertical-stack", "cards": [{"type": "grid", "cards": [{"type": "tile"}]}]}}]}]}]
    assert _check("profiles", {"a": {"name": "A", "tabs": tabs}})["a"]["tabs"][0]["sections"][0]["entities"] == tabs[0]["sections"][0]["entities"]


async def test_deep_backup_does_not_break_the_store(hass, hass_ws_client, setup_lhd):
    """Önceden: derin bir yedek kabul ediliyor, cevabı ve sonraki her get 'Invalid JSON in response' ile düşüyordu
    (bütün panolar boş), diske kayıt da patlıyordu. Şimdi geri çevrilir, hiçbir şey değişmez."""
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    before = await _get(ws, ids)
    for data in ({"profiles": {"a": {"name": "A", "settings": {"canvas": _nest(300)}}}},
                 {"settings": {"canvas": _nest(300)}}):
        r = await _call(ws, ids, type=f"{DOMAIN}/restore", data=copy.deepcopy(data))
        assert not r["success"] and r["error"]["code"] == "invalid", r
        assert "too deeply nested" in r["error"]["message"]
    r = await _call(ws, ids, type=f"{DOMAIN}/set", key="profiles", value={"a": {"name": "A", "settings": {"nav": _nest(300)}}})
    assert r["error"]["code"] == "invalid", r
    after = await _get(ws, ids)
    assert after["profiles"] == before["profiles"] and after["settings"] == before["settings"]


@pytest.fixture
def big_stored_profiles(hass_storage):
    """Temizlenince 1 MB'ı biraz aşan kayıtlı profiller (ör. eski sensör kimlikleri yenisine çevrilince uzar)."""
    name = "x" * (MAX_CONFIG_BYTES - 200)
    tabs = [{"id": "t", "name": name, "sections": [{"entities": [{"entity": "sensor.lhdx_ev"}] * 20}]}]
    hass_storage[DOMAIN] = {"version": 1, "minor_version": 1, "key": DOMAIN, "data": {
        "profiles": {"masaustu": {"name": "Masaüstü", "tabs": tabs}}}}


@pytest.mark.usefixtures("big_stored_profiles", "setup_lhd")
async def test_load_does_not_wipe_large_profiles(hass):
    """Önceden: yüklerken boyut sınırı da uygulanıyordu; aşan kayıtta bütün profiller {} olup diske yazılıyordu."""
    prof = hass.data[DOMAIN].data["profiles"]
    assert list(prof) == ["masaustu"]
    assert prof["masaustu"]["tabs"][0]["sections"][0]["entities"][0]["entity"] == "sensor.lhd_ev_power"


# 0.36.0'ın, 0.37'nin yazdığı profilleri aynen saklayıp geri yazdığı hâl (lp70 üzerinde denendi, RAPOR.md)
STORED_BY_036 = {
    "masaustu": {"name": "Masaüstü <b>", "tabs": [{"id": "calisma", "name": "Çalışma", "sections": [{"id": "s", "type": "lights", "entities": ["light.a"]}]}],
                 "settings": {"canvas": {"width": 2560}, "phone": {"nav": "top", "tabs": {"order": ["calisma"]}}, "bg": None}},
    "bagli": {"name": "Bağlı", "settings": {"theme_name": "x", "phone": {"style": {"bg": {"mode": "black"}}}}},
    "tablet_salon": {"tab": "ev", "note": "eski anahtar"},
}


@pytest.fixture
def stored_by_036(hass_storage):
    hass_storage[DOMAIN] = {"version": 1, "minor_version": 1, "key": DOMAIN, "data": {
        "tabs": [], "settings": {"season": "summer"}, "profiles": copy.deepcopy(STORED_BY_036)}}


@pytest.mark.usefixtures("stored_by_036", "setup_lhd")
async def test_profiles_back_from_036_load_unchanged(hass, hass_ws_client):
    """0.37 -> 0.36 -> 0.37: profiller (eski biçimli kayıt dahil) değişmeden açılır ve aynen geri yazılabilir."""
    assert hass.data[DOMAIN].data["profiles"] == STORED_BY_036
    ws, ids = await _ws(hass, hass_ws_client), _Ids()
    got = await _get(ws, ids)
    r = await _call(ws, ids, type=f"{DOMAIN}/set", key="profiles", value=got["profiles"], rev=got["revs"].get("profiles", 0))
    assert r["success"], r
    assert (await _get(ws, ids))["profiles"] == STORED_BY_036
