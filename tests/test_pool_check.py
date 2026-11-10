"""Ortak havuz biçim kontrolü (library/tools/common.py): prizin okuyamadığı bekleme boş gelince ölçüm reddedilmez."""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "library" / "tools"))
import common  # noqa: E402


def _sub(**kw):
    p = {"v": 1, "model": {"manufacturer": "Signify Netherlands B.V.", "model": "Hue Play", "model_id": "440400982842", "integration": "hue"},
         "mains_v": 230, "standby": 0.3,
         "lut": {"ct": {"k": [2200, 4000, 6500], "b": [1, 50, 100], "w": [[0.5, 3.0, 7.0], [0.6, 3.2, 7.4], [0.6, 3.1, 7.2]]}}}
    p.update(kw)
    return p


def test_unreadable_standby_with_floor_passes():
    errs, clean = common.check(_sub(standby=None, standby_floor=True))
    assert errs == []
    assert clean["standby"] == 0.0


def test_missing_standby_without_floor_still_rejected():
    errs, _ = common.check(_sub(standby=None))
    assert any("standby" in e for e in errs)


def test_measured_standby_kept():
    errs, clean = common.check(_sub(standby=0.3))
    assert errs == [] and clean["standby"] == 0.3


def test_strip_per_meter_scales_effect_table():
    c = {"strip": True, "length_m": 2.0, "standby": 0.0,
         "lut": {"br": {"b": [1, 100], "w": [1.0, 10.0]}, "fx": {"e": {"Fire": 4.0}, "avg": 4.0, "b": [10, 100], "r": [0.5, 1.0]}}}
    t = common.per_meter(c)
    assert t["fx"]["e"]["Fire"] == 2.0 and t["fx"]["avg"] == 2.0 and t["fx"]["r"] == [0.5, 1.0]


def _hs(rows):
    return {"hs": {"h": [0, 120, 240], "s": [100], "b": [1, 5, 10, 25, 40, 60, 80, 100], "w": [rows]}}


def test_stuck_plug_row_rejected():
    ok = [6.3, 7.7, 8.7, 10.5, 12.5, 14.8, 17.6, 20.5]
    errs, _ = common.check(_sub(lut=_hs([ok, [7.3] * 8, ok])))   # #13: the plug stopped sending, a row kept one value
    assert any("takılmış" in e for e in errs)
    errs, _ = common.check(_sub(lut=_hs([ok, [6, 7, 9, 11, 12.8, 12.8, 12.8, 12.8], ok])))   # stops well under the others
    assert any("takılmış" in e for e in errs)
    errs, _ = common.check(_sub(lut=_hs([ok, [6, 7, 9, 11, 19.5, 19.5, 19.5, 19.5], ok])))   # a real cap near the others: fine
    assert errs == []


def test_zero_watts_rejected():
    errs, _ = common.check(_sub(lut={"ct": {"k": [2200, 6500], "b": [1, 50, 100], "w": [[0.0, 3.0, 7.0], [0.6, 3.2, 7.4]]}}))   # #14
    assert any("0 W" in e for e in errs)


# ---- v0.32: herkese açık havuz, ölçümün kendisi denetlenir ----
import json  # noqa: E402

import check as CK  # noqa: E402
import review as RV  # noqa: E402

_ROW = [0.6, 1.0, 1.5, 2.6, 3.7, 4.9, 6.2, 7.4]


def _q(**smp):
    return _sub(lut={"ct": {"k": [2200, 6500], "b": [1, 5, 10, 25, 40, 60, 80, 100], "w": [_ROW, [x * 1.02 for x in _ROW]]}}, samples=dict({"settle_s": 5.2, "floor": 0}, **smp),
                plug={"manufacturer": "Shelly", "model": "Shelly 1PM Mini Gen4"})


def test_slow_plug_rejected():
    errs, _ = common.check(_q(settle_s=60))
    assert any("yavaş" in e for e in errs)
    assert common.check(_q(settle_s=9))[0] == []


def test_speed_required_from_others_not_owner():
    p = _q(); del p["samples"]["settle_s"]
    assert any("hızı" in e for e in common.check(p, strict=True)[0])
    assert common.check(p, strict=False)[0] == []


def test_too_many_unread_cells_rejected():
    assert any("okuyamadığı" in e for e in common.check(_q(floor=12))[0])   # 12 of 16
    assert common.check(_q(floor=8))[0] == []                              # half: fine


def test_blocked_plug_rejected():
    errs, c = common.check(_q(), blocked=["shelly|shelly1pmminigen4"])
    assert any("priz modeli" in e for e in errs) and c["plug_key"] == "shelly|shelly1pmminigen4"


def test_plug_blocked_after_repeated_failures():
    d = {"stats": {}, "block": []}
    for ok in (True, False, False, False, False):
        CK.count_plug(d, "x|plug", ok)
    assert d["block"] == ["x|plug"]


def _lib(tmp_path):
    (tmp_path / "models").mkdir()
    RV.LIB = tmp_path
    return tmp_path


def test_owner_added_at_once(tmp_path):
    _lib(tmp_path)
    _, c = common.check(_q())
    add, _ = CK.decide(c, 5, True, "aa", [])
    assert [x[0] for x in add] == [5]


def test_agrees_with_pool_or_waits(tmp_path):
    _lib(tmp_path)
    _, c = common.check(_q())
    RV.add_sub(c, 1, "owner")
    assert [x[0] for x in CK.decide(c, 2, False, "bb", [])[0]] == [2]          # same table: agrees
    far = json.loads(json.dumps(c)); far["lut"]["ct"]["w"] = [[x * 1.5 for x in r] for r in far["lut"]["ct"]["w"]]
    assert CK.decide(far, 3, False, "cc", [])[0] == []                          # 50% off: waits
    assert CK.decide(c, 4, False, "owner", [])[0] == []                         # same account again: waits


def test_two_accounts_pair_up(tmp_path, monkeypatch):
    _lib(tmp_path)
    p = _q()
    other = {"number": 7, "body": "```json\n" + json.dumps(p) + "\n```", "user": {"login": "someone"}, "author_association": "NONE"}
    monkeypatch.setattr(CK, "pending", lambda n: [other])
    _, c = common.check(p, strict=True)
    add, note = CK.decide(c, 8, False, RV.by_hash("another"), [])
    assert sorted(x[0] for x in add) == [7, 8] and "#7" in note
    add, _ = CK.decide(c, 8, False, RV.by_hash("someone"), [])                  # the same account twice does not pair
    assert add == []
