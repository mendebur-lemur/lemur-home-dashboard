"""Release gate: every place that carries the version says the same (manifest, const.VERSION, the built bundle, the
loader, the newest changes entry). A mismatch is not caught anywhere else: ws_info answers const.VERSION and the
dashboard compares it with the bundle's PANEL_VERSION, so a bumped manifest with an old const.py shows "A new version
is installed, reload" on every screen for good, and the loader and the admin panel load the bundle at two addresses."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
CC = ROOT / "custom_components" / "lemur_home_dashboard"


def test_versions_agree():
    man = json.loads((CC / "manifest.json").read_text(encoding="utf-8"))["version"]
    const = re.search(r'^VERSION = "([^"]+)"', (CC / "const.py").read_text(encoding="utf-8"), re.M).group(1)
    bundle = (CC / "frontend" / "lemur-home-dashboard.js").read_text(encoding="utf-8")
    panel = re.search(r"const PANEL_VERSION = '([^']+)'", bundle).group(1)
    loader = (CC / "frontend" / "lemur-home-dashboard-loader.js").read_text(encoding="utf-8")
    lv = set(re.findall(r"v=([0-9][0-9a-z.]*)'", loader)) | set(re.findall(r"__LEMUR_HD_LOADER = '([^']+)'", loader))
    assert const == man, f"const.VERSION {const} != manifest {man}"
    assert panel == man, f"bundle PANEL_VERSION {panel} != manifest {man} (run build.py)"
    assert lv == {man}, f"loader versions {lv} != manifest {man} (run build.py)"
    newest = re.search(r"v:\s*'([^']+)'", (ROOT / "src" / "changes.js").read_text(encoding="utf-8")).group(1)
    assert newest == man, f"newest changes.js entry {newest} != manifest {man}: the 'what is new' window is skipped"


def test_hacs_minimum_matches_code():
    hacs = json.loads((ROOT / "hacs.json").read_text(encoding="utf-8"))
    y, m = (int(x) for x in hacs["homeassistant"].split(".")[:2])
    # StaticPathConfig has a fallback; single_config_entry (manifest) needs 2024.3, notify.send_message 2024.6
    assert (y, m) >= (2024, 6)
