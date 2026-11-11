"""The loader as a Lovelace resource (v0.34.0, GitHub #21): only our own row, one row, no needless writes."""
import os
from unittest.mock import patch

import pytest

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


@pytest.fixture(autouse=True)
def local_served(request):
    """Most tests: /local is served in this run (the www folder existed at start). Tests marked real_local read the routes."""
    if request.node.get_closest_marker("real_local"):
        yield None
        return
    with patch.object(LR, "_local_served", return_value=True) as m:
        yield m


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


async def test_www_missing_waits_for_next_start(hass, tmp_path, local_served):
    local_served.return_value = None                             # routes unreadable: the folder rule decides
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


# ---- /local served or not: read from Home Assistant's routes (v0.34.1, with Lemur Light Effect Card v1.8.3) ----
async def test_www_created_by_someone_else_in_the_same_run(hass, tmp_path, local_served):
    """www did not exist at start; another integration created it before us. /local is not served: no row."""
    local_served.return_value = False
    res = await _lovelace(hass, tmp_path, [OTHER], www=True)      # the folder is there, but only since this run
    assert await REGISTER(hass) == "next-start"
    assert _urls(res) == [OTHER]
    assert (tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE).exists()
    local_served.return_value = True                             # next start: Home Assistant serves /local
    assert await REGISTER(hass) == "created"
    assert _urls(res) == [OTHER, URL]


async def test_not_served_keeps_an_existing_row(hass, tmp_path, local_served):
    """Our row from an earlier run is left as it is (only adding is held back)."""
    local_served.return_value = False
    res = await _lovelace(hass, tmp_path, [URL, LEC])
    assert await REGISTER(hass) == "same"
    assert _urls(res) == [URL, LEC]


async def test_routes_unreadable_falls_back_to_the_folder_rule(hass, tmp_path, local_served):
    local_served.return_value = None
    res = await _lovelace(hass, tmp_path, [OTHER], www=True)
    assert await REGISTER(hass) == "created"
    assert _urls(res) == [OTHER, URL]


@pytest.mark.real_local
def test_local_served_never_raises():
    class H:
        http = None
    assert LR._local_served(H()) is None
    assert LR._local_served(object()) is None


async def _frontend(hass, tmp_path, www):
    hass.config.config_dir = str(tmp_path)
    if www:
        os.makedirs(tmp_path / "www")
    assert await async_setup_component(hass, "frontend", {})
    await hass.async_block_till_done()


@pytest.mark.real_local
async def test_real_frontend_www_at_start(hass, tmp_path):
    await _frontend(hass, tmp_path, www=True)
    assert LR._local_served(hass) is True
    res = hass.data["lovelace"].resources
    assert await REGISTER(hass) == "created"
    assert _urls(res) == [URL]


@pytest.mark.real_local
async def test_real_frontend_www_created_later(hass, tmp_path):
    await _frontend(hass, tmp_path, www=False)
    assert LR._local_served(hass) is False
    os.makedirs(tmp_path / "www" / "lemur_light_effects")       # e.g. Lemur Light Effect Card created it in this run
    assert LR._local_served(hass) is False                       # still not served until Home Assistant restarts
    res = hass.data["lovelace"].resources
    assert await REGISTER(hass) == "next-start"
    assert _urls(res) == []
    assert (tmp_path / "www" / "lemur_home_dashboard" / LOADER_FILE).exists()
