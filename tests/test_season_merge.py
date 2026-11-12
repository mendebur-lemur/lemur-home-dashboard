"""Summer/winter on a wall tablet (any user) and the admin's settings save: neither undoes the other.
The flip has its own counter; a save says which season the page last had (ssn); two admins still conflict."""
DOMAIN = "lemur_home_dashboard"


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


def _st(hass):
    return hass.data[DOMAIN].data["settings"]


async def test_flip_first_then_admin_save_on_the_older_copy(hass, hass_ws_client, setup_lhd):
    adm, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await adm(t="set", key="settings", value={"season": "summer", "a": 1}, rev=0, ssn=None))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    # the admin's next edit was made before the flip reached the page: rev 1, ssn summer, season summer
    r = await adm(t="set", key="settings", value={"season": "summer", "a": 2}, rev=1, ssn="summer")
    assert r["success"], r
    assert _st(hass) == {"season": "winter", "a": 2}            # both survive
    assert r["result"]["settings"]["season"] == "winter" and r["result"]["revs"]["settings"] == 2


async def test_admin_save_first_then_flip(hass, hass_ws_client, setup_lhd):
    adm, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await adm(t="set", key="settings", value={"a": 1}, rev=0, ssn=None))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    assert _st(hass) == {"a": 1, "season": "winter"}
    assert hass.data[DOMAIN].revs["settings"] == 1               # the flip did not touch the settings counter
    # a page that never had a season: its next save keeps the tablet's
    assert (await adm(t="set", key="settings", value={"a": 2}, rev=1, ssn=None))["success"]
    assert _st(hass) == {"a": 2, "season": "winter"}


async def test_admin_changes_the_season_itself(hass, hass_ws_client, setup_lhd):
    adm, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await tab(t="season", season="winter"))["success"]
    # the page saw winter and the admin chose Automatic / Summer: the admin's choice is saved
    assert (await adm(t="set", key="settings", value={"season": "auto"}, rev=0, ssn="winter"))["success"]
    assert _st(hass) == {"season": "auto"}
    assert (await adm(t="set", key="settings", value={"season": "summer"}, rev=1, ssn="auto"))["success"]
    assert _st(hass) == {"season": "summer"}
    # the admin page chose winter while it still had summer, the tablet also chose winter: winter
    assert (await tab(t="season", season="winter"))["success"]
    assert (await adm(t="set", key="settings", value={"season": "winter", "b": 1}, rev=2, ssn="summer"))["success"]
    assert _st(hass) == {"season": "winter", "b": 1}


async def test_two_admins_still_conflict(hass, hass_ws_client, setup_lhd):
    a, b, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await a(t="set", key="settings", value={"x": 1}, rev=0, ssn=None))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    r = await b(t="set", key="settings", value={"y": 1}, rev=0, ssn=None)   # made on the copy before a's save
    assert not r["success"] and r["error"]["code"] == "conflict"
    assert _st(hass) == {"x": 1, "season": "winter"}


async def test_non_admin_can_flip_but_not_save(hass, hass_ws_client, setup_lhd, hass_read_only_access_token):
    tab = await hass_ws_client(hass, hass_read_only_access_token)
    await tab.send_json({"id": 1, "type": f"{DOMAIN}/season", "season": "winter"})
    assert (await tab.receive_json())["success"]
    await tab.send_json({"id": 2, "type": f"{DOMAIN}/set", "key": "settings", "value": {}, "rev": 0, "ssn": None})
    assert (await tab.receive_json())["error"]["code"] == "unauthorized"
    assert _st(hass) == {"season": "winter"} and hass.data[DOMAIN].revs.get("season") == 1


async def test_flip_is_saved_to_disk(hass, hass_ws_client, setup_lhd, hass_storage):
    from datetime import timedelta
    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import async_fire_time_changed
    tab = await _ws(hass, hass_ws_client)
    assert (await tab(t="season", season="winter"))["success"]
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await hass.async_block_till_done()
    assert hass_storage[DOMAIN]["data"]["settings"]["season"] == "winter"
