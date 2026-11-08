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
