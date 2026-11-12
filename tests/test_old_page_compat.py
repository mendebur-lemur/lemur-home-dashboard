"""An admin page left open from before the update (0.35.1 JavaScript, new server). Its settings save has a rev but no ssn.
0.35.1's server counted a wall tablet's summer / winter as a settings change, so a save made on the copy from before the flip
was refused (conflict). The 0.36 server does not (season has its own counter), so it has to keep the tablet's season itself:
the season the settings had at their last save stands in for the missing ssn. Pages older than 0.32 (no rev) are unchanged."""
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


async def test_old_page_save_on_its_copy_from_before_the_flip_keeps_the_tablets_season(hass, hass_ws_client, setup_lhd):
    old, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await old(t="set", key="settings", value={"season": "summer", "a": 1}, rev=0))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    # the old page's next edit was made before the flip reached it (0.35.1 skips pushes while its own save is on the way)
    r = await old(t="set", key="settings", value={"season": "summer", "a": 2}, rev=1)
    assert r["success"], r
    assert _st(hass) == {"season": "winter", "a": 2}
    # the old page got the push: its copy has winter
    assert (await old(t="set", key="settings", value={"season": "winter", "a": 3}, rev=2))["success"]
    assert _st(hass) == {"season": "winter", "a": 3}


async def test_old_page_still_changes_the_season_itself(hass, hass_ws_client, setup_lhd):
    old, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await old(t="set", key="settings", value={"season": "winter"}, rev=0))["success"]
    assert (await old(t="set", key="settings", value={"season": "summer"}, rev=1))["success"]   # Settings > Season: Summer
    assert _st(hass) == {"season": "summer"}
    assert (await old(t="set", key="settings", value={}, rev=2))["success"]                     # Automatic
    assert _st(hass) == {}
    assert (await tab(t="season", season="winter"))["success"]
    # flip, then the old page (copy from before the flip, no season) chooses Summer: the admin's choice
    assert (await old(t="set", key="settings", value={"season": "summer", "b": 1}, rev=3))["success"]
    assert _st(hass) == {"season": "summer", "b": 1}


async def test_old_page_other_keys_and_pages_without_rev_unchanged(hass, hass_ws_client, setup_lhd):
    old, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await old(t="set", key="settings", value={"season": "summer"}, rev=0))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    assert (await old(t="set", key="tabs", value=[{"id": "ev", "sections": []}], rev=0))["success"]   # not settings: nothing to keep
    assert _st(hass) == {"season": "winter"}
    # a page from before 0.32 (no counter at all) overwrites, as it always did
    assert (await old(t="set", key="settings", value={"season": "summer", "c": 1}))["success"]
    assert _st(hass) == {"season": "summer", "c": 1}


async def test_new_page_rules_unchanged(hass, hass_ws_client, setup_lhd):
    new, tab = await _ws(hass, hass_ws_client), await _ws(hass, hass_ws_client)
    assert (await new(t="set", key="settings", value={"season": "summer"}, rev=0, ssn=None))["success"]
    assert (await tab(t="season", season="winter"))["success"]
    # ssn given: it decides (here the page says it had winter and chose summer)
    assert (await new(t="set", key="settings", value={"season": "summer"}, rev=1, ssn="winter"))["success"]
    assert _st(hass) == {"season": "summer"}


async def test_old_page_reads_the_new_answers(hass, hass_ws_client, setup_lhd):
    """What 0.35.1's store.js reads: get / set results are the view with revs (a new 'season' counter is ignored there),
    the season result is {season}, subscribe parts carry settings and revs."""
    old = await hass_ws_client(hass)
    await old.send_json({"id": 1, "type": f"{DOMAIN}/subscribe", "parts": True})
    assert (await old.receive_json())["success"]
    tab = await _ws(hass, hass_ws_client)
    assert (await tab(t="season", season="winter"))["result"] == {"season": "winter"}
    ev = await old.receive_json()
    assert ev["type"] == "event" and ev["event"]["__part"] == {"settings": {"season": "winter"}}
    assert isinstance(ev["event"]["revs"], dict) and ev["event"]["revs"].get("settings", 0) == 0
