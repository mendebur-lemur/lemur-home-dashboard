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
