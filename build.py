#!/usr/bin/env python3
"""src/ klasörünü entegrasyonun sunduğu tek dosyada birleştirir: custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"""
import json, pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"

# ---- renkli simgeler ----
# Lemur ailesinin bütün renkli simgelerinin ana kopyası ../lemur-icons klasöründe (Hakan'ın bilgisayarı, git'e girmez).
# Klasör varsa oradaki dosyalar depodaki kopyaların yerine konur; yoksa depodaki son kopyalarla derlenir.
#   mdi.json      → frontend/mdi-color.json  (panonun simge seti, "mdi:ad" ve "lhd:ad")
#   efektler.json → frontend/lec-icons.json  ("lec:ad" efekt simgeleri; Light Effect Card kurulu olmasa da görünür)
# Simge adları bir kez verildikten sonra değişmez: kayıtlı panolar adı tutar. Silinen ya da adı değişen simge varsa derleme durur.
import gzip
ICONS = root.parent / "lemur-icons"
FE = root / "custom_components/lemur_home_dashboard/frontend"
for master_name, repo_name in (("mdi.json", "mdi-color.json"), ("efektler.json", "lec-icons.json")):
    repo_file = FE / repo_name
    cur = json.loads(repo_file.read_text(encoding="utf-8")) if repo_file.exists() else {}
    if (ICONS / master_name).exists():
        master = json.loads((ICONS / master_name).read_text(encoding="utf-8"))
        gone = sorted(set(cur) - set(master))
        if gone:
            raise SystemExit("lemur-icons/" + master_name + " bazı simgeleri silmiş ya da adını değiştirmiş (adlar değişmemeli): " + ", ".join(gone[:10]) + (" …" if len(gone) > 10 else ""))
        if master != cur:
            cur = master
            print(repo_name + " lemur-icons'tan güncellendi:", len(cur))
    elif not cur:
        raise SystemExit(repo_name + " yok ve ../lemur-icons bulunamadı")
    data = json.dumps(dict(sorted(cur.items())), ensure_ascii=False, separators=(",", ":"))
    if not repo_file.exists() or repo_file.read_text(encoding="utf-8") != data:
        repo_file.write_text(data, encoding="utf-8")
    gz = repo_file.with_name(repo_name + ".gz")
    if not gz.exists() or gzip.decompress(gz.read_bytes()).decode("utf-8") != data:
        gz.write_bytes(gzip.compress(data.encode("utf-8"), 9, mtime=0))

version = json.loads((root / "custom_components/lemur_home_dashboard/manifest.json").read_text())["version"]
def load_css(name):
    c = re.sub(r"/\*.*?\*/", "", (src / name).read_text(encoding="utf-8"), flags=re.S)
    return "\n".join(l.strip() for l in c.splitlines() if l.strip())
css = load_css("base.css")
admin_css = load_css("admin.css")
parts = [(src / f).read_text(encoding="utf-8") for f in ("i18n.js", "safe.js", "changes.js", "store.js", "mdic.js", "lec.js", "defaults.js", "scale.js", "strategy.js", "tpl.js", "panel-card.js", "lightpop.js", "cardpop.js", "pet.js", "yaml.js", "help.js", "admin.js")]
heal = (src / "heal.js").read_text(encoding="utf-8").replace("__VERSION__", version) + "\n" + (src / "errlog.js").read_text(encoding="utf-8")
out = f"""/*! Lemur Home Dashboard v{version} | GPL-3.0 */
(() => {{
{heal}
if (customElements.get('lemur-home-dashboard-card')) return;
const PANEL_VERSION = '{version}';
const CSS = {json.dumps(css, ensure_ascii=False)};
const ADMIN_CSS = {json.dumps(admin_css, ensure_ascii=False)};
{chr(10).join(parts)}
// Bazı eklentiler sayfa açılırken window.customElements'i kendi kopyasıyla değiştiriyor (scoped registry polyfill).
// Biz ondan önce yüklenirsek tanımımız yeni kopyada görünmez; HA pano stratejisini bulamaz ("Timeout waiting for strategy element").
// Bu yüzden ilk 30 sn boyunca kayıt defterine bakıp eksikse yeniden kaydediyoruz (aynı sınıf; tarayıcının asıl kaydı zaten bizde).
const LP_DEFS = [['ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy], ['lemur-home-dashboard-card', LemurHomeDashboardCard], ['lemur-home-dashboard-admin', LemurHomeDashboardAdmin]];
const lpDefineAll = () => LP_DEFS.forEach((d) => {{ try {{ if (!window.customElements.get(d[0])) window.customElements.define(d[0], d[1]); }} catch (e) {{}} }});
window.__LEMUR_HD_VER = PANEL_VERSION;
lpDefineAll();
let lpTries = 0;
const lpTimer = setInterval(() => {{ lpDefineAll(); if (++lpTries > 300) clearInterval(lpTimer); }}, 100);
window.addEventListener('location-changed', lpDefineAll);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
}})();
"""
# Lemur Halo Cards (iklim, süpürge... kartları) pakete gömülü: tablet panosundaki kartların kendisi.
# Gömülü kopya KENDİ ADLARIYLA kaydolur (lemur-climate-card → lemur-hd-climate-card), "Kart ekle" listesine girmez ve kendi bayrağını kullanır.
# Böylece kullanıcı Halo'yu ayrıca kurarsa iki sürüm birbirini ezmez: pano her zaman test edilen gömülü sürümü, diğer panolar kurulan Halo'yu kullanır.
# Güncellemek için: lemur-halo-cards deposundaki dist/lemur-halo-cards.js dosyasını vendor/ içine kopyala (dosyanın kendisi değiştirilmez).
halo = (root / "vendor/lemur-halo-cards.js").read_text(encoding="utf-8")
HALO_PATCH = [
    ("window.__lemurCardsLoaded", "window.__lemurHdCardsLoaded"),
    ("  const type = cls.TYPE;", "  const type = cls.TYPE.replace(/^lemur-/, 'lemur-hd-');"),
    ("  window.customCards = window.customCards || [];", "  return;  // gömülü kopya Kart ekle listesine girmez\n  window.customCards = window.customCards || [];"),
    ("console.info('%c LEMUR HALO CARDS %c v' + CARD_VERSION + ' ',", "if (0) console.info('%c LEMUR HALO CARDS %c v' + CARD_VERSION + ' ',"),
]
for old, new in HALO_PATCH:
    if old not in halo:
        raise SystemExit("Halo dosyasında beklenen satır yok (Halo değişmiş olabilir): " + old)
    halo = halo.replace(old, new)
halo = halo.replace("/*! Lemur Halo Cards", "/*! Lemur Halo Cards (gömülü kopya)", 1)
out = halo.rstrip() + "\n" + out
dst = root / "custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"
dst.write_text(out, encoding="utf-8")
# sıkıştırılmış kopya: Home Assistant'ın web sunucusu (aiohttp) tarayıcı gzip kabul ediyorsa .gz dosyasını gönderir (~580 KB yerine ~170 KB)
# .gz yalnız içerik değişince yeniden yazılır: zlib sürümleri aynı veriyi farklı baytlarla sıkıştırabilir,
# her derlemede yazılırsa GitHub'daki denetim (git diff) içerik aynıyken de "değişti" der.
gz = dst.with_name(dst.name + ".gz")
if not gz.exists() or gzip.decompress(gz.read_bytes()).decode("utf-8") != out:
    gz.write_bytes(gzip.compress(out.encode("utf-8"), 9, mtime=0))
print(dst, len(out.encode()))
