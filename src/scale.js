// Kanvas ölçekleme ve kiosk. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
// Kiosk: ayarda seçildiyse bizim panomuz açıkken HA'nın üst barı ve yan menüsü gizlenir (kiosk-mode ya da browser_mod gerekmez).
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
    const k = kiosk || {};
    style(m, KID, active && k.hide_sidebar ? ':host{--ha-sidebar-width:0px !important;--ha-top-app-bar-width:100% !important}ha-sidebar{display:none !important}ha-drawer{--mdc-drawer-width:0px !important}' : '');
    if (!sr) return;
    style(sr, KID, active && k.hide_header ? '.header,.toolbar,app-header,ha-app-layout>[slot=header]{display:none !important}#view,hui-view-container{padding-top:0 !important;min-height:100vh !important}' : '');
    if (!active) { style(sr, ID, ''); return; }
    // telefon: ölçekleme yok, pano kendi telefon düzenini çizer (panel-card lpIsPhone ile aynı eşik)
    if ((window.innerWidth || 1280) < 700) { style(sr, ID, 'hui-view{min-height:0 !important;}'); return; }
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
  let canvas = null, kiosk = null;
  const run = () => apply(canvas, kiosk);
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  return { set(c, k) { canvas = c; kiosk = k || null; run(); }, run: run };
})();
