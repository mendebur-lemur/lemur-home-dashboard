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
// Bazı eklentiler sayfa açılırken window.customElements'i kendi kopyasıyla değiştiriyor (scoped registry polyfill).
// Biz ondan önce yüklenirsek tanımımız yeni kopyada görünmez; HA pano stratejisini bulamaz ("Timeout waiting for strategy element").
// Bu yüzden ilk 30 sn boyunca kayıt defterine bakıp eksikse yeniden kaydediyoruz (aynı sınıf; tarayıcının asıl kaydı zaten bizde).
const LP_DEFS = [['ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy], ['lemur-home-dashboard-card', LemurHomeDashboardCard], ['lemur-home-dashboard-admin', LemurHomeDashboardAdmin]];
const lpDefineAll = () => LP_DEFS.forEach((d) => {{ try {{ if (!window.customElements.get(d[0])) window.customElements.define(d[0], d[1]); }} catch (e) {{}} }});
lpDefineAll();
let lpTries = 0;
const lpTimer = setInterval(() => {{ lpDefineAll(); if (++lpTries > 300) clearInterval(lpTimer); }}, 100);
window.addEventListener('location-changed', lpDefineAll);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
# Lemur Halo Cards (iklim, süpürge... kartları) pakete gömülü: tablet panosundaki kartların kendisi. Kendi koruması var
# (window.__lemurCardsLoaded): kullanıcı Halo'yu ayrıca kurduysa hangisi önce yüklenirse o tanımlar, çakışma olmaz.
# Güncellemek için: lemur-halo-cards deposundaki dist/lemur-halo-cards.js dosyasını vendor/ içine kopyala.
halo = (root / "vendor/lemur-halo-cards.js").read_text(encoding="utf-8")
out = halo.rstrip() + "\n" + out
dst = root / "custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"
dst.write_text(out, encoding="utf-8")
print(dst, len(out.encode()))
