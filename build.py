#!/usr/bin/env python3
"""src/ klasörünü entegrasyonun sunduğu tek dosyada birleştirir: custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"""
import json, pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"
version = json.loads((root / "custom_components/lemur_home_dashboard/manifest.json").read_text())["version"]
css = re.sub(r"/\*.*?\*/", "", (src / "base.css").read_text(encoding="utf-8"), flags=re.S)
css = "\n".join(l.strip() for l in css.splitlines() if l.strip())
parts = [(src / f).read_text(encoding="utf-8") for f in ("i18n.js", "store.js", "defaults.js", "scale.js", "strategy.js", "panel-card.js", "admin.js")]
out = f"""/*! Lemur Home Dashboard v{version} | MIT */
(() => {{
if (customElements.get('lemur-home-dashboard-card')) return;
const PANEL_VERSION = '{version}';
const CSS = {json.dumps(css, ensure_ascii=False)};
{chr(10).join(parts)}
customElements.define('ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy);
customElements.define('lemur-home-dashboard-card', LemurHomeDashboardCard);
customElements.define('lemur-home-dashboard-admin', LemurHomeDashboardAdmin);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
dst = root / "custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"
dst.write_text(out, encoding="utf-8")
print(dst, len(out.encode()))
