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
    assert common.check(_q(settle_s=14.6))[0] == []   # Hue Play on a 1PM Mini


def test_speed_required_from_others_not_owner():
    p = _q(); del p["samples"]["settle_s"]
    assert any("hızı" in e for e in common.check(p, strict=True)[0])
    assert common.check(p, strict=False)[0] == []


def test_too_many_unread_cells_rejected():
    assert any("okuyamadığı" in e for e in common.check(_q(floor=13))[0])   # 13 of 16
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
    add, _ = CK.decide(c, 5, True, "aa")
    assert [x[0] for x in add] == [5]


def test_agrees_with_pool_or_waits(tmp_path):
    _lib(tmp_path)
    _, c = common.check(_q())
    RV.add_sub(c, 1, "owner")
    assert [x[0] for x in CK.decide(c, 2, False, "bb")[0]] == [2]          # same table: agrees
    far = json.loads(json.dumps(c)); far["lut"]["ct"]["w"] = [[x * 1.5 for x in r] for r in far["lut"]["ct"]["w"]]
    assert CK.decide(far, 3, False, "cc")[0] == []                          # 50% off: waits
    assert CK.decide(c, 4, False, "owner")[0] == []                         # same account again: waits


def test_first_measurement_of_a_model_always_waits(tmp_path):
    _lib(tmp_path)
    _, c = common.check(_q(), strict=True)
    add, note = CK.decide(c, 8, False, RV.by_hash("someone"))                # two accounts can no longer pair up
    assert add == [] and "ilk ölçümü" in note


def _event(tmp_path, action, assoc, sender, label=None, n=30):
    ev = {"action": action, "issue": {"number": n, "body": "```json\n" + json.dumps(_q()) + "\n```", "user": {"login": "someone"}, "author_association": assoc},
          "sender": {"login": sender}, "repository": {"owner": {"login": "boss"}}}
    if label:
        ev["label"] = {"name": label}
    f = tmp_path / "ev.json"
    f.write_text(json.dumps(ev), encoding="utf-8")
    return str(f)


def _run(monkeypatch, tmp_path, *a):
    lib = tmp_path / "lib"
    (lib / "models").mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(sys, "argv", ["check.py", "--event", _event(tmp_path, *a), "--lib", str(lib)])
    monkeypatch.delenv("GITHUB_OUTPUT", raising=False)
    CK.main()
    f = lib / "models" / "signifynetherlandsbv__440400982842.json"
    return json.loads(f.read_text())["subs"] if f.exists() else []


def test_owner_label_accepts_a_waiting_measurement(tmp_path, monkeypatch):
    assert _run(monkeypatch, tmp_path, "opened", "NONE", "someone") == []                       # waits
    assert _run(monkeypatch, tmp_path, "labeled", "NONE", "someone", "onay") == []              # not the owner's label
    assert _run(monkeypatch, tmp_path, "labeled", "NONE", "boss", "olcum") == []                # another label
    subs = _run(monkeypatch, tmp_path, "labeled", "NONE", "boss", "onay")
    assert [x["issue"] for x in subs] == [30] and subs[0]["by"] == RV.by_hash("someone")
    idx = json.loads((tmp_path / "lib" / "index.json").read_text())
    assert idx["models"] == ["signifynetherlandsbv|440400982842"]


def test_filled_low_cells_are_not_zeros():
    lut = {"ct": {"k": [2200, 6500], "b": [1, 5, 10, 25, 40, 60, 80, 100], "w": [[0.03, 0.17, 0.35, 0.88, 1.4, 2.9, 4.8, 7.5]] * 2}}
    assert common.check(_sub(lut=lut, samples={"settle_s": 14.6, "floor": 6}))[0] == []      # filled from the row: fine
    lut["ct"]["w"] = [[0.0, 0.17, 0.35, 0.88, 1.4, 2.9, 4.8, 7.5]] * 2
    assert any("0 W" in e for e in common.check(_sub(lut=lut, samples={"settle_s": 5, "floor": 0}))[0])


def test_owner_newer_measurement_replaces_owners_older(tmp_path):
    _lib(tmp_path)
    _, c = common.check(_q())
    RV.add_sub(c, 9)                       # an old owner entry (no 'by')
    RV.add_sub(c, 12, "someone")           # another account's
    RV.add_sub(c, 17, "own")
    assert CK.owner_replace(c["key"], 17, "own")
    subs = json.loads((tmp_path / "models" / (RV._fname(c["key"]) + ".json")).read_text())["subs"]
    assert [x["issue"] for x in subs] == [12, 17]
