"""The loader as a Lovelace resource (v0.34.0, GitHub #21): only our own row, one row, no needless writes."""
import os
from unittest.mock import patch

from homeassistant.setup import async_setup_component

from custom_components.lemur_home_dashboard import lovres as LR
from custom_components.lemur_home_dashboard.const import LOADER_FILE, VERSION

REGISTER = LR.async_register   # the real one; conftest replaces the module attribute for every test
URL = f"/local/lemur_home_dashboard/{LOADER_FILE}?v={VERSION}"
LEC = "/lemur_light_effects/lemur-light-effect-loader.js?v=1.8.2"
OTHER = "/hacsfiles/mushroom/mushroom.js?hacstag=1"


async def _lovelace(hass, tmp_path, items=None, www=True):
    """Real Lovelace in storage mode, config folder in tmp_path."""
    hass.config.config_dir = str(tmp_path)
    if www:
        os.makedirs(tmp_path / "www", exist_ok=True)
    assert await async_setup_component(hass, "lovelace", {})
    res = hass.data["lovelace"].resources
    for url in items or []:
        await res.async_create_item({"res_type": "module", "url": url})
    return res


def _urls(res):
    return [it["url"] for it in res.async_items()]


async def test_row_added_once_and_file_copied(hass, tmp_path):
    res = await _lovelace(hass, tmp_path, [OTHER, LEC])
    assert await REGISTER(hass) == "created"
    assert _urls(res) == [OTHER, LEC, URL]                       # others untouched, order kept
    assert res.async_items()[2]["type"] == "module"
    copy = tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE
    src = os.path.join(os.path.dirname(LR.__file__), "frontend", LOADER_FILE)
    assert copy.read_bytes() == open(src, "rb").read()
    # second start: nothing changes and nothing is written
    with patch.object(res, "async_create_item") as c, patch.object(res, "async_update_item") as u, patch.object(res, "async_delete_item") as d, \
            patch.object(res.store, "async_delay_save") as s1, patch.object(res.store, "async_save") as s2:
        assert await REGISTER(hass) == "same"
        assert not (c.called or u.called or d.called or s1.called or s2.called)
    mtime = copy.stat().st_mtime_ns
    assert await REGISTER(hass) == "same"
    assert copy.stat().st_mtime_ns == mtime


async def test_new_version_updates_the_row_in_place(hass, tmp_path):
    old = f"/local/lemur_home_dashboard/{LOADER_FILE}?v=0.33.9"
    res = await _lovelace(hass, tmp_path, [OTHER, old, LEC])
    rid = res.async_items()[1]["id"]
    assert await REGISTER(hass) == "updated"
    assert _urls(res) == [OTHER, URL, LEC]
    assert res.async_items()[1]["id"] == rid                    # same row, not a new one


async def test_duplicates_and_hand_added_rows_become_one(hass, tmp_path):
    hand = f"/lemur_home_dashboard/{LOADER_FILE}?v={VERSION}"     # added by hand with the integration's own address
    res = await _lovelace(hass, tmp_path, [hand, OTHER, URL, f"/local/lemur_home_dashboard/{LOADER_FILE}?v=0.1.0", LEC])
    assert await REGISTER(hass) == "updated"
    assert _urls(res) == [OTHER, URL, LEC]


async def test_wrong_type_is_fixed(hass, tmp_path):
    res = await _lovelace(hass, tmp_path)
    await res.async_create_item({"res_type": "js", "url": URL})
    assert await REGISTER(hass) == "updated"
    assert [(it["url"], it["type"]) for it in res.async_items()] == [(URL, "module")]


async def test_www_missing_waits_for_next_start(hass, tmp_path):
    res = await _lovelace(hass, tmp_path, [OTHER], www=False)
    assert await REGISTER(hass) == "next-start"         # /local is not served until Home Assistant restarts
    assert _urls(res) == [OTHER]
    assert (tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE).exists()
    assert await REGISTER(hass) == "created"            # next start: the folder is there
    assert _urls(res) == [OTHER, URL]


async def test_yaml_mode_is_left_alone(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    os.makedirs(tmp_path / "www")
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"mode": "yaml", "resources": [{"url": OTHER, "type": "module"}]}})
    res = hass.data["lovelace"].resources
    assert await REGISTER(hass) == "skipped"
    assert _urls(res) == [OTHER]
    await LR.async_unregister(hass)
    assert _urls(res) == [OTHER]


async def test_no_lovelace_or_broken_core_never_raises(hass, tmp_path):
    hass.config.config_dir = str(tmp_path)
    assert await REGISTER(hass) == "skipped"            # Lovelace not loaded
    await LR.async_unregister(hass)

    class Odd:
        loaded = True

        def async_items(self):
            raise RuntimeError("changed core")

        async def async_create_item(self, data):
            raise RuntimeError

        async_update_item = async_delete_item = async_create_item

    hass.data["lovelace"] = {"resources": Odd()}                 # dict form of older cores
    assert await REGISTER(hass) == "failed"
    await LR.async_unregister(hass)
    hass.data["lovelace"] = object()
    assert await REGISTER(hass) == "skipped"


async def test_removed_with_the_integration_only(hass, tmp_path, setup_lhd):
    res = await _lovelace(hass, tmp_path, [OTHER, LEC])
    assert await REGISTER(hass) == "created"
    copy = tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE
    (tmp_path / "www" / "keep.txt").write_text("x")
    # reload / unload: the row and the file stay
    assert await hass.config_entries.async_unload(setup_lhd.entry_id)
    await hass.async_block_till_done()
    assert _urls(res) == [OTHER, LEC, URL] and copy.exists()
    # removed: both go, nothing else does
    assert await hass.config_entries.async_remove(setup_lhd.entry_id)
    await hass.async_block_till_done()
    assert _urls(res) == [OTHER, LEC]
    assert not copy.exists() and not copy.parent.exists()
    assert (tmp_path / "www" / "keep.txt").exists()
