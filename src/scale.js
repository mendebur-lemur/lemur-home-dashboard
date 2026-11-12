// Kanvas ölçekleme ve kiosk. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
// Kiosk: ayarda seçildiyse bizim panomuz açıkken HA'nın üst barı ve yan menüsü gizlenir (kiosk-mode ya da browser_mod gerekmez).
// Telefon düzeni (ölçekleme yok, bölümler alt alta, sayfa kayar): dar ekran (700 px altı), yatay telefon (yükseklik 500 px altı)
// ve dikey tutulan tablet (genişlik 1100 px altı, yükseklik genişlikten fazla). Yoksa 1280 px kanvas ekrana sığdırılır;
// yatay telefonda yazılar okunamayacak kadar küçülüyor, dikey tablette karolar uzun ince oluyordu.
// gizli yan menüyü açan kaydırmanın başlayabileceği sol kenar şeridi (CSS piksel). Android'in hareketli gezinmesi en kenardaki
// ~30 pikseli geri hareketine ayırır, oradan başlayan dokunuş sayfaya hiç gelmez; şerit bu yüzden geniş (v0.28.11: 48 → 72).
const LP_EDGE = 72;
// Sonuç önbellekte (v0.36.0): window.innerWidth / innerHeight okumak, sayfada bekleyen bir değişiklik varsa tarayıcıya o anda
// yerleşim yaptırıyordu; pano her HA güncellemesinde bunu birkaç kez soruyordu (ucuz tablette güncelleme süresinin yarısı).
// Pencere boyutu değişince ('resize', yakalama aşamasında: kartların kendi resize dinleyicilerinden önce) yeniden hesaplanır.
let lpPhS = null;
function lpPhoneScreen() {
  if (lpPhS === null) {
    const w = window.innerWidth || 1280, h = window.innerHeight || 800;
    lpPhS = w < 700 || (h < 500 && w < 1100) || (h > w && w < 1100);
  }
  return lpPhS;
}
try { ['resize', 'orientationchange'].forEach((ev) => window.addEventListener(ev, () => { lpPhS = null; }, true)); } catch (e) {}
// dokunmatik cihaz (telefon, tablet): kiosk ayarındaki "Sadece telefon ve tablette" seçeneği buna bakar
function lpTouchDev() {
  try { if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true; } catch (e) {}
  return lpPhoneScreen();
}
// kiosk ayarı: true / 'all' her yerde, 'touch' sadece telefon ve tablette
const lpKioskOn = (v) => v === true || v === 'all' || (v === 'touch' && lpTouchDev());
const LemurScale = (() => {
  const ID = 'lemur-home-dashboard-scale', KID = 'lemur-home-dashboard-kiosk';
  function mainRoot() {
    try { return document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main').shadowRoot; } catch (e) { return null; }
  }
  function root(m) {
    try {
      const p = m.querySelector('ha-panel-lovelace');
      const r = p && p.shadowRoot && p.shadowRoot.querySelector('hui-root');
      return (r && r.shadowRoot) ? r : null;
    } catch (e) { return null; }
  }
  function style(host, id, css) {
    if (!host) return;
    let st = host.getElementById ? host.getElementById(id) : host.querySelector('#' + id);
    if (!css) { if (st) st.textContent = ''; return; }
    if (!st) { st = document.createElement('style'); st.id = id; host.appendChild(st); }
    if (st.textContent !== css) st.textContent = css;
  }
  // Üst bar gizliyken iOS uygulaması durum çubuğunu (saat, pil) sayfanın theme-color rengine boyar; HA bunu kendi üst barının
  // rengine ayarlıyor, bar gizlenince tabletin üstünde panoya uymayan koyu bir şerit kalıyordu (#11). Pano açıkken zeminin
  // ana rengi yazılır, pano kapanınca HA'nınki geri konur.
  let tcOrig = null;
  function themeColor(c) {
    const m = document.querySelector && document.querySelector('meta[name=theme-color]');
    if (!m) return;
    if (c) { if (tcOrig === null) tcOrig = m.getAttribute('content') || ''; if (m.getAttribute('content') !== c) m.setAttribute('content', c); }
    else if (tcOrig !== null) { m.setAttribute('content', tcOrig); tcOrig = null; }
  }
  function apply(canvas, kiosk) {
    const m = mainRoot(); if (!m) return;
    const r = root(m);
    const sr = r && r.shadowRoot;
    const raw = r && r.lovelace && r.lovelace.rawConfig;
    const active = !!sr && (!!sr.querySelector('lemur-home-dashboard-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-home-dashboard'));
    // kiosk: yan menü home-assistant-main içinde, üst bar hui-root içinde. Yeni HA (2025.x+) menü genişliğini
    // --ha-sidebar-width ile verir; sadece menüyü gizlemek solda boş şerit bırakıyordu, genişlik de sıfırlanır.
    const k = kiosk || {}, sideOff = active && lpKioskOn(k.hide_sidebar);
    hidden = sideOff; onDash = active;
    style(m, KID, sideOff && !peek ? ':host{--ha-sidebar-width:0px !important;--ha-top-app-bar-width:100% !important}ha-sidebar{display:none !important}ha-drawer{--mdc-drawer-width:0px !important}' : '');
    if (!sr) return;
    // üst bar gizliyken içerik telefonun durum çubuğunun altına kaymasın: HA'nın kendi boşluğu (--safe-area-inset-top) bırakılır,
    // zemin yine ekranın en üstüne kadar uzanır (#11)
    const headOff = active && lpKioskOn(k.hide_header);
    style(sr, KID, headOff ? '.header,.toolbar,app-header,ha-app-layout>[slot=header]{display:none !important}#view,hui-view-container{padding-top:var(--safe-area-inset-top, env(safe-area-inset-top, 0px)) !important;min-height:100vh !important;box-sizing:border-box !important}' : '');
    themeColor(headOff ? bgc : null);
    if (!active) { style(sr, ID, ''); return; }
    // telefon: ölçekleme yok, pano kendi telefon düzenini çizer (panel-card lpIsPhone ile aynı eşik)
    if (lpPhoneScreen()) { style(sr, ID, 'hui-view{min-height:0 !important;}'); return; }
    const W = (canvas && canvas.width) || 1280, H = (canvas && canvas.ref_height) || 1075;
    const kap = sr.querySelector('hui-view-container') || r;
    const g = kap.getBoundingClientRect().width;
    const bas = sr.querySelector('.header');
    let top = bas && bas.offsetHeight ? bas.getBoundingClientRect().bottom : Math.max(0, kap.getBoundingClientRect().top);
    if (!(bas && bas.offsetHeight)) { const pt = parseFloat(getComputedStyle(kap).paddingTop) || 0; top += pt; }   // gizli barda durum çubuğu boşluğu
    const y = window.innerHeight - top;
    if (!g || !y) return;
    let gen = Math.max(W, Math.floor(g / y * H));
    const z = Math.max(0.35, Math.min(2, Math.floor(g / gen * 1000) / 1000));
    gen = Math.max(W, Math.floor(g / z));
    // --lp-h: ekranın kalan yüksekliği, kanvas pikseli cinsinden. Kart bunu en az yükseklik olarak kullanır, böylece kolonlar ekranı doldurur.
    // (Ekrandan hesaplanır, içerikten değil: içerik ölçülürse zoom kendini besler.)
    const lh = Math.floor(y / z);
    style(sr, ID, 'hui-view{zoom:' + z + ';width:' + gen + 'px !important;max-width:' + gen + 'px !important;margin:0 auto;flex:0 0 auto !important;min-height:0 !important;height:auto !important;--lp-h:' + lh + 'px;}');
  }
  let canvas = null, kiosk = null, bgc = null, hidden = false, peek = false, onDash = false;
  // son kiosk ayarı tarayıcıda saklı: sayfa yenilenince menü ayar gelene kadar görünüp kaybolmasın
  try { const sv = JSON.parse(localStorage.getItem('lhd-kiosk') || 'null'); if (sv && typeof sv === 'object') kiosk = sv; } catch (e) {}
  const run = () => apply(canvas, kiosk);
  // gizli yan menü bilgisayarda: fare ekranın sol kenarına gidince açılır, menüden çıkınca yine gizlenir
  window.addEventListener('mousemove', (e) => {
    if (!hidden && !peek) return;
    if (!peek && e.clientX <= 3) { peek = true; run(); }
    else if (peek && e.clientX > 300) { peek = false; run(); }
  }, { passive: true });
  // dokunmatikte gizli yan menü: sol kenardan sağa kaydırınca açılır. iOS uygulaması bunu kendisi yapıyor; Android uygulaması,
  // Fully Kiosk ve tarayıcılar yapmıyordu (v0.28.9). Android'in geri hareketi en kenarı tuttuğu için kenardan LP_EDGE piksele kadar başlayan kaydırma sayılır.
  const nv = typeof navigator !== 'undefined' ? navigator : {}, iosApp = /iPad|iPhone|iPod/.test(nv.userAgent || '') || (nv.platform === 'MacIntel' && nv.maxTouchPoints > 1);
  const mainEl = () => { try { return document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main'); } catch (e) { return null; } };
  const drawer = () => { const m = mainRoot(); return m ? m.querySelector('ha-drawer') : null; };
  let tx = -1, ty = 0;
  if (!iosApp) {
    window.addEventListener('touchstart', (e) => {
      const p = e.touches && e.touches[0]; if (!p) return;
      tx = -1;
      // açık menünün dışına dokununca yine gizlenir (dar ekranda HA'nın kendi çekmecesi kapanınca)
      if (peek) { const d = drawer(); if (p.clientX > 320 && !(d && d.open)) { peek = false; run(); } return; }
      // gizli menü ya da dar ekran (telefon: menü HA'nın çekmecesi, üst bar gizliyken açacak düğme yok). iOS uygulaması bunu kendisi yapar.
      const me = (hidden || p.clientX > LP_EDGE) ? null : mainEl();
      if (p.clientX <= LP_EDGE && (hidden || (onDash && me && me.narrow))) { tx = p.clientX; ty = p.clientY; }
    }, { passive: true, capture: true });
    window.addEventListener('touchmove', (e) => {
      if (tx < 0) return;
      const p = e.touches && e.touches[0]; if (!p) return;
      const dx = p.clientX - tx, dy = Math.abs(p.clientY - ty);
      if (dy > 40) { tx = -1; return; }
      if (dx > 60 && dy < dx * 0.6) {
        tx = -1; if (hidden) { peek = true; run(); }
        // dar ekranda (telefon) menü HA'nın çekmecesi: açılması için HA'ya söylenir; genişte yalnız gizlemeyi kaldırmak yeter
        const me = mainEl();
        if (me && me.narrow) setTimeout(() => { const d = drawer(); if (!(d && d.open)) me.dispatchEvent(new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true, detail: { open: true } })); }, 30);
      }
    }, { passive: true, capture: true });
  }
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  // açılışta sık bak: pano yüklenir yüklenmez gizlensin (ilk 5 saniye)
  let fast = 0; const fi = setInterval(() => { run(); if (++fast >= 50) clearInterval(fi); }, 100);
  return { set(c, k, b) { canvas = c; kiosk = k || null; if (b) bgc = b; try { localStorage.setItem('lhd-kiosk', JSON.stringify(kiosk)); } catch (e) {} run(); }, run: run };
})();
