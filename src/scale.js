// Kanvas ölçekleme. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
const LemurScale = (() => {
  const ID = 'lemur-home-dashboard-scale';
  function root() {
    try {
      const m = document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main').shadowRoot;
      const p = m.querySelector('ha-panel-lovelace');
      const r = p && p.shadowRoot && p.shadowRoot.querySelector('hui-root');
      return (r && r.shadowRoot) ? r : null;
    } catch (e) { return null; }
  }
  function apply(canvas) {
    const r = root(); if (!r) return;
    const sr = r.shadowRoot;
    const raw = r.lovelace && r.lovelace.rawConfig;
    const active = !!sr.querySelector('lemur-home-dashboard-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-home-dashboard');
    let st = sr.getElementById(ID);
    if (!active) { if (st) st.textContent = ''; return; }
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
    const css = 'hui-view{zoom:' + z + ';width:' + gen + 'px !important;max-width:' + gen + 'px !important;margin:0 auto;flex:0 0 auto !important;min-height:0 !important;height:auto !important;}';
    if (!st) { st = document.createElement('style'); st.id = ID; sr.appendChild(st); }
    if (st.textContent !== css) st.textContent = css;
  }
  let canvas = null;
  const run = () => apply(canvas);
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  return { set(c) { canvas = c; run(); }, run: run };
})();
