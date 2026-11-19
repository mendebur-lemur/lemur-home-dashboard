"""Profile lookup (pool_lookup, energy import) stays inside the profile folders: an absolute path, ".." or a path in the
manufacturer or model name does not reach a model.json elsewhere on the system. Real names still work."""
import json

from custom_components.lemur_home_dashboard import energy_import as EI

MODEL = {"calculation_strategy": "linear", "standby_power": 0.4, "linear_config": {"min_power": 1, "max_power": 99}}


def _mk(p, data):
    p.mkdir(parents=True, exist_ok=True)
    (p / "model.json").write_text(json.dumps(data), encoding="utf-8")


def test_names_cannot_leave_the_profile_folder(tmp_path):
    root = tmp_path / "config" / ".storage" / "powercalc_profiles"
    _mk(tmp_path / "outside" / "secret", MODEL)
    _mk(root / "signify" / "LCT010", MODEL)
    _mk(root / "signify" / "LCT010" / "sub", dict(MODEL, standby_power=0.2))
    assert EI.profile_data(root, str(tmp_path / "outside"), "secret") is None
    assert EI.profile_data(root, "../../../outside", "secret") is None
    assert EI.profile_data(root, "..", "../outside/secret") is None
    assert EI.profile_data(root, "signify", "../../../../outside/secret") is None
    assert EI.profile_data(root, "Signify", "lct010")["linear"]["max_power"] == 99   # case-insensitive names still found
    assert EI.profile_data(root, "signify", "LCT010/sub")["standby_power"] == 0.2   # sub profiles still found
