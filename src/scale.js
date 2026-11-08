// Kanvas ölçekleme ve kiosk. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
// Kiosk: ayarda seçildiyse bizim panomuz açıkken HA'nın üst barı ve yan menüsü gizlenir (kiosk-mode ya da browser_mod gerekmez).
// Telefon düzeni (ölçekleme yok, bölümler alt alta, sayfa kayar): dar ekran (700 px altı), yatay telefon (yükseklik 500 px altı)
// ve dikey tutulan tablet (genişlik 1100 px altı, yükseklik genişlikten fazla). Yoksa 1280 px kanvas ekrana sığdırılır;
// yatay telefonda yazılar okunamayacak kadar küçülüyor, dikey tablette karolar uzun ince oluyordu.
function lpPhoneScreen() {
  const w = window.innerWidth || 1280, h = window.innerHeight || 800;
  return w < 700 || (h < 500 && w < 1100) || (h > w && w < 1100);
}
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
  function apply(canvas, kiosk) {
    const m = mainRoot(); if (!m) return;
    const r = root(m);
    const sr = r && r.shadowRoot;
    const raw = r && r.lovelace && r.lovelace.rawConfig;
    const active = !!sr && (!!sr.querySelector('lemur-home-dashboard-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-home-dashboard'));
    // kiosk: yan menü home-assistant-main içinde, üst bar hui-root içinde. Yeni HA (2025.x+) menü genişliğini
    // --ha-sidebar-width ile verir; sadece menüyü gizlemek solda boş şerit bırakıyordu, genişlik de sıfırlanır.
    const k = kiosk || {}, sideOff = active && lpKioskOn(k.hide_sidebar);
    hidden = sideOff;
    style(m, KID, sideOff && !peek ? ':host{--ha-sidebar-width:0px !important;--ha-top-app-bar-width:100% !important}ha-sidebar{display:none !important}ha-drawer{--mdc-drawer-width:0px !important}' : '');
    if (!sr) return;
    style(sr, KID, active && lpKioskOn(k.hide_header) ? '.header,.toolbar,app-header,ha-app-layout>[slot=header]{display:none !important}#view,hui-view-container{padding-top:0 !important;min-height:100vh !important}' : '');
    if (!active) { style(sr, ID, ''); return; }
    // telefon: ölçekleme yok, pano kendi telefon düzenini çizer (panel-card lpIsPhone ile aynı eşik)
    if (lpPhoneScreen()) { style(sr, ID, 'hui-view{min-height:0 !important;}'); return; }
    const W = (canvas && canvas.width) || 1280, H = (canvas && canvas.ref_height) || 1075;
    const kap = sr.querySelector('hui-view-container') || r;
    const g = kap.getBoundingClientRect().width;
    const bas = sr.querySelector('.header');
    const top = bas && bas.offsetHeight ? bas.getBoundingClientRect().bottom : Math.max(0, kap.getBoundingClientRect().top);
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
  let canvas = null, kiosk = null, hidden = false, peek = false;
  // son kiosk ayarı tarayıcıda saklı: sayfa yenilenince menü ayar gelene kadar görünüp kaybolmasın
  try { const sv = JSON.parse(localStorage.getItem('lhd-kiosk') || 'null'); if (sv && typeof sv === 'object') kiosk = sv; } catch (e) {}
  const run = () => apply(canvas, kiosk);
  // gizli yan menü bilgisayarda: fare ekranın sol kenarına gidince açılır, menüden çıkınca yine gizlenir
  window.addEventListener('mousemove', (e) => {
    if (!hidden && !peek) return;
    if (!peek && e.clientX <= 3) { peek = true; run(); }
    else if (peek && e.clientX > 300) { peek = false; run(); }
  }, { passive: true });
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  // açılışta sık bak: pano yüklenir yüklenmez gizlensin (ilk 5 saniye)
  let fast = 0; const fi = setInterval(() => { run(); if (++fast >= 50) clearInterval(fi); }, 100);
  return { set(c, k) { canvas = c; kiosk = k || null; try { localStorage.setItem('lhd-kiosk', JSON.stringify(kiosk)); } catch (e) {} run(); }, run: run };
})();
