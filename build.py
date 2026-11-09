#!/usr/bin/env python3
"""src/ klasörünü entegrasyonun sunduğu tek dosyada birleştirir: custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js"""
import json, pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"

# ---- renkli simgeler ----
# Lemur ailesinin bütün renkli simgelerinin ana kopyası ../lemur-icons klasöründe (geliştirici bilgisayarında, git'e girmez).
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
# Yenilikler penceresi yalnız ilk kayıt paketin sürümüyle aynıysa çıkar (2026-11-04: 0.17.6'da kalmıştı)
_m = re.search(r"const LHD_CHANGES = \[\s*\{\s*v:\s*'([^']+)'", (src / "changes.js").read_text(encoding="utf-8"))
if not _m or _m.group(1) != version:
    raise SystemExit("src/changes.js en üstteki kayıt v" + (_m.group(1) if _m else "?") + ", paket v" + version + ": Yenilikler'e bu sürümün satırını ekle")
def load_css(name):
    c = re.sub(r"/\*.*?\*/", "", (src / name).read_text(encoding="utf-8"), flags=re.S)
    return "\n".join(l.strip() for l in c.splitlines() if l.strip())
css = load_css("base.css")
admin_css = load_css("admin.css")
# Rehber (src/guide.json): pakete veri olarak girer, GitHub için docs/REHBER.md ve docs/GUIDE.md buradan yazılır.
# Görseller docs/guide/<dil>/<id>.webp; panel bunları sürümün GitHub etiketinden yükler (kurulum dosyasına girmez, .gitattributes).
guide = json.loads((src / "guide.json").read_text(encoding="utf-8"))
guide.pop("_note", None)
for _st in guide["steps"]:
    for _l in ("tr", "en"):
        if not (isinstance(_st.get(_l), list) and len(_st[_l]) >= 2):
            raise SystemExit("guide.json: '" + _st.get("id", "?") + "' adımında " + _l + " metni eksik")
# panelin yazıları (src/admin.js'teki tr / en sözlüğü): rehberdeki seçenek adları buradan; anahtar yoksa derleme durur
_adm = (src / "admin.js").read_text(encoding="utf-8")
def _dict(block):
    return {m.group(1): m.group(2).replace("\\'", "'") for m in re.finditer(r"(\w+): '((?:[^'\\]|\\.)*)'", block)}
UI = {"tr": _dict(_adm[_adm.index("  tr: {"):_adm.index("  en: {")]), "en": _dict(_adm[_adm.index("  en: {"):_adm.index("\n};", _adm.index("  en: {"))])}
for _st in guide["steps"]:
    for _o in _st.get("opts", []):
        for _k in ([_o["k"]] if _o.get("k") else []) + [x for x in _o.get("v", []) if not x.startswith("=")]:
            for _l in ("tr", "en"):
                if _k not in UI[_l]:
                    raise SystemExit("guide.json: '" + _st["id"] + "' seçeneğinde '" + _k + "' panelin " + _l + " yazılarında yok")
def guide_md(lang):
    other = {"tr": ("GUIDE.md", "English"), "en": ("REHBER.md", "Türkçe")}[lang]
    title = {"tr": "Lemur Home Dashboard rehberi", "en": "Lemur Home Dashboard guide"}[lang]
    intro = {"tr": "Panonun yapabildiği her şey, sırayla. Aynı rehber yönetim panelinde **⋯ → Rehber**'de de var.",
             "en": "Everything the dashboard can do, in order. The same guide is in the admin panel under **⋯ → Guide**."}[lang]
    out = ["# " + title, "", intro + " [" + other[1] + "](" + other[0] + ")", ""]
    last = None
    for i, st in enumerate(guide["steps"], 1):
        if st["group"] != last:
            last = st["group"]; out += ["## " + guide["groups"][last][lang], ""]
        T = st[lang]
        out += ["### " + str(i) + ". " + T[0], ""]
        if (root / "docs/guide" / lang / (st["id"] + ".webp")).exists():
            out += ["![" + T[0] + "](guide/" + lang + "/" + st["id"] + ".webp)", ""]
        for p in T[1:]:
            out += [p, ""]
        if st.get("opts"):
            out += ["**" + {"tr": "Seçenekler", "en": "Options"}[lang] + "**", ""]
            for o in st["opts"]:
                lab = UI[lang][o["k"]] if o.get("k") else o["l"][lang]
                vals = [(x[1:].split("|")[0 if lang == "tr" else -1]) if x.startswith("=") else UI[lang][x] for x in o.get("v", [])]
                out += ["- **" + lab + "**" + (" (" + " · ".join(vals) + ")" if vals else "") + ": " + o[lang]]
            out += [""]
    return "\n".join(out).rstrip() + "\n"
for _l, _n in (("tr", "REHBER.md"), ("en", "GUIDE.md")):
    _p = root / "docs" / _n
    _md = guide_md(_l)
    if not _p.exists() or _p.read_text(encoding="utf-8") != _md:
        _p.write_text(_md, encoding="utf-8")
# Önerilen ürünler (library/picks.json): pakete ilk kopya olarak girer; panel GitHub'daki main kopyasını 6 saatte bir okur
picks = json.loads((root / "library/picks.json").read_text(encoding="utf-8"))
picks.pop("_note", None)
if picks.get("v") != 1 or not isinstance(picks.get("items"), list):
    raise SystemExit("library/picks.json: v=1 ve items listesi olmalı")
for _it in picks["items"]:
    for _k in ("id", "cat", "name"):
        if not _it.get(_k):
            raise SystemExit("library/picks.json: bir üründe '" + _k + "' yok")
    for _u in (_it.get("buy") or {}).values():
        if not str(_u).startswith("https://"):
            raise SystemExit("library/picks.json: '" + _it["id"] + "' linki https değil")
parts = ["const LHD_GUIDE = " + json.dumps(guide, ensure_ascii=False) + ";", "const LHD_PICKS = " + json.dumps(picks, ensure_ascii=False) + ";"] + [(src / f).read_text(encoding="utf-8") for f in ("i18n.js", "safe.js", "changes.js", "store.js", "autodash.js", "mdic.js", "lec.js", "defaults.js", "demohome.js", "scale.js", "strategy.js", "tpl.js", "panel-card.js", "lightpop.js", "coverpop.js", "cardpop.js", "pet.js", "energy.js", "enlooks.js", "enplus.js", "enrep.js", "yaml.js", "help.js", "thumbs.js", "picks.js", "admin.js")]
errlog = (src / "errlog.js").read_text(encoding="utf-8")
out = f"""/*! Lemur Home Dashboard v{version} | GPL-3.0 */
(() => {{
{errlog}
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
window.__LEMUR_HD_STRATEGY = LemurHomeDashboardStrategy;  // yükleyici (loader.js) generate() çağrısını buraya devreder
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

# Yükleyici (2026-11-04, GitHub #3): her sayfaya bu küçük dosya yüklenir; strateji elemanını hemen tanımlar,
# ana dosyayı arkadan yükler. Ana dosya büyük olduğu için yavaş cihazlarda HA'nın strateji bekleme süresi doluyordu.
loader = (src / "loader.js").read_text(encoding="utf-8").replace("__VERSION__", version)
ldst = root / "custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard-loader.js"
if not ldst.exists() or ldst.read_text(encoding="utf-8") != loader:
    ldst.write_text(loader, encoding="utf-8")
print(ldst, len(loader.encode()))
