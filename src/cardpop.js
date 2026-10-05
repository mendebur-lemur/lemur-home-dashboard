// Gömülü HA kartı ve kart penceresi.
// Öğe { card: { type: ... } } bölümde HA'nın kart yardımcısıyla (window.loadCardHelpers().createCardElement) çizilir; hass verilir.
// Eylem { popup: { title, card } } kartı panonun kendi penceresinde açar (ışık penceresi gibi): dışarı dokun, X ya da geri tuşu kapatır.
// Kart yüklenemezse yerinde kısa bir uyarı çıkar; pano bozulmaz.
const LP_CARD_TXT = {
  tr: { bad: 'Kart ayarı eksik: type yok', fail: 'Kart yüklenemedi: {t}', close: 'Kapat', yes: 'Evet', no: 'Vazgeç', ask: '{n} çalıştırılsın mı?' },
  en: { bad: 'Card config is missing its type', fail: 'Card could not be loaded: {t}', close: 'Close', yes: 'Yes', no: 'Cancel', ask: 'Run {n}?' }
};
const lpCardT = (lang, k, v) => { let s = (LP_CARD_TXT[lang] || LP_CARD_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
const LP_CH = { p: null };
function lpCardHelpers() {
  if (!LP_CH.p) LP_CH.p = window.loadCardHelpers ? Promise.resolve().then(() => window.loadCardHelpers()).catch(() => null) : Promise.resolve(null);
  return LP_CH.p;
}
// ph: kartın konacağı kutu; getHass: güncel hass; onEl(el): kart takılınca (hass güncellemesi için listeye eklenir)
function lpMountCard(ph, cfg, getHass, lang, onEl) {
  const warn = (msg) => { ph.innerHTML = '<div class="cwarn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>' + esc(msg) + '</span></div>'; };
  if (!cfg || typeof cfg !== 'object' || typeof cfg.type !== 'string' || !cfg.type) { warn(lpCardT(lang, 'bad')); return; }
  const put = (el) => {
    if (!ph.isConnected && ph.parentNode === null) return;
    try { el.hass = getHass(); } catch (e) {}
    // HA'nın hata kartı, eksik özel kart sonradan tanımlanınca kendini yeniden kurdurur
    el.addEventListener('ll-rebuild', (ev) => { ev.stopPropagation(); lpMountCard(ph, cfg, getHass, lang, onEl); });
    ph.innerHTML = ''; ph.appendChild(el);
    if (onEl) onEl(el);
    setTimeout(() => { try { window.dispatchEvent(new Event('resize')); } catch (e) {} }, 60);   // grafik kartları boyutunu ölçsün
  };
  lpCardHelpers().then((H) => {
    if (H && H.createCardElement) {
      let el = null;
      try { el = H.createCardElement(cfg); } catch (e) { warn(lpCardT(lang, 'fail', { t: cfg.type })); return; }
      if (!el) { warn(lpCardT(lang, 'fail', { t: cfg.type })); return; }
      put(el); return;
    }
    // kart yardımcısı yok (çok eski HA): özel kart doğrudan oluşturulur
    const tag = cfg.type.indexOf('custom:') === 0 ? cfg.type.slice(7) : 'hui-' + cfg.type + '-card';
    const make = () => { try { const el = document.createElement(tag); if (typeof el.setConfig !== 'function') return false; el.setConfig(cfg); put(el); return true; } catch (e) { return false; } };
    if (make()) return;
    let done = false;
    const tm = setTimeout(() => { if (!done) { done = true; warn(lpCardT(lang, 'fail', { t: cfg.type })); } }, 4000);
    if (window.customElements && customElements.whenDefined) customElements.whenDefined(tag).then(() => { if (done) return; done = true; clearTimeout(tm); if (!make()) warn(lpCardT(lang, 'fail', { t: cfg.type })); });
  });
}

const LP_CPOP_CSS = `
:host { position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 9000; display: block; font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
  -webkit-tap-highlight-color: transparent; }
.bg { position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.55); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.18s; }
.pan { position: absolute; left: 50%; top: 50%; width: 640px; max-width: calc(100vw - 16px); max-height: calc(100vh - 24px); overflow-y: auto; -webkit-overflow-scrolling: touch;
  box-sizing: border-box; padding: 18px; border-radius: 30px; background: #131416; color: #ECEDEF; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -46%) scale(0.98); opacity: 0; transition: transform 0.2s ease-out, opacity 0.18s; }
:host(.in) .bg { opacity: 1; }
:host(.in) .pan { transform: translate(-50%, -50%); opacity: 1; }
.hd { display: flex; align-items: center; margin-bottom: 14px; }
.hd .nm { flex: 1 1 auto; display: flex; align-items: center; height: 56px; padding: 0 18px; min-width: 0; background: #1E2024; border-radius: 18px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.hd .nm b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x { flex: 0 0 56px; height: 56px; margin-left: 12px; border-radius: 18px; background: #1E2024; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ECEDEF; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.x ha-icon { --mdc-icon-size: 22px; }
.x.solo { position: absolute; right: 18px; top: 18px; z-index: 1; }
.cb { min-height: 40px; }
.cwarn { display: flex; align-items: center; padding: 14px 16px; border-radius: 14px; background: rgba(229, 72, 77, 0.12); color: #FF9592; font-size: 14px; line-height: 1.35; }
.cwarn ha-icon { --mdc-icon-size: 20px; margin-right: 10px; flex: 0 0 auto; }
.phist { background: #1E2024; border-radius: 18px; padding: 6px 0; }
.phr { display: flex; align-items: center; padding: 10px 18px; font-size: 15px; }
.phr + .phr { border-top: 1px solid rgba(255, 255, 255, 0.06); }
.phr b { flex: 0 0 auto; font-weight: 600; margin-right: 14px; font-variant-numeric: tabular-nums; }
.phr span { flex: 1 1 auto; color: #9aa0a8; }
.phr i { font-style: normal; color: #9aa0a8; font-size: 13px; }
.cfm { display: flex; margin-top: 4px; }
.cfm > div { flex: 1 1 0; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 600; cursor: pointer; background: #1E2024; }
.cfm > div + div { margin-left: 12px; }
.cfm .ok { background: #F0A93B; color: #111; }
`;
const LP_CPOP = { cur: null };
class LemurCardPopup {
  // p: { title, card }
  // p: { title, card }. Hazır HTML içerik yalnız panonun kendi pencerelerinden (_openHtml): ayardan gelen html kabul edilmez
  static open(hass, p, lang) { p = p || {}; return LemurCardPopup._open(hass, { title: p.title, card: p.card }, lang); }
  static _openHtml(hass, title, html, lang) { return LemurCardPopup._open(hass, { title: title, html: html }, lang); }
  static _open(hass, p, lang) {
    if (LP_CPOP.cur) LP_CPOP.cur.close(true);
    if (typeof LP_POP !== 'undefined' && LP_POP.cur) LP_POP.cur.close(true);
    const x = new LemurCardPopup(hass, p || {}, lang || pickLang(hass));
    LP_CPOP.cur = x;
    return x;
  }
  static update(hass) { if (LP_CPOP.cur) LP_CPOP.cur.hass = hass; }
  // onay sorusu ("Evi Kapa çalıştırılsın mı?"): Evet'e basınca yes() çalışır
  static confirm(hass, lang, text, yes) {
    const p = LemurCardPopup._openHtml(hass, text, '<div class="cfm"><div data-no>' + esc(lpCardT(lang, 'no')) + '</div><div class="ok" data-yes>' + esc(lpCardT(lang, 'yes')) + '</div></div>', lang);
    const R = p._host.shadowRoot;
    R.querySelector('[data-no]').addEventListener('click', () => p.close());
    R.querySelector('[data-yes]').addEventListener('click', () => { p.close(); yes(); });
    return p;
  }
  constructor(hass, p, lang) {
    this._h = hass; this._els = [];
    this._host = document.createElement('div');
    this._host.className = 'lemur-card-popup';
    const R = this._host.attachShadow({ mode: 'open' });
    const title = p.title ? String(p.title) : '';
    R.innerHTML = '<style>' + LP_CPOP_CSS + '</style><div class="bg"></div><div class="pan" role="dialog" aria-modal="true">' +
      (title ? '<div class="hd"><div class="nm"><b>' + esc(title) + '</b></div><div class="x" data-x title="' + esc(lpCardT(lang, 'close')) + '"><ha-icon icon="mdi:close"></ha-icon></div></div>'
        : '<div class="x solo" data-x title="' + esc(lpCardT(lang, 'close')) + '"><ha-icon icon="mdi:close"></ha-icon></div>') +
      '<div class="cb"></div></div>';
    R.querySelector('.bg').addEventListener('click', () => this.close());
    R.querySelector('[data-x]').addEventListener('click', () => this.close());
    this._key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); this.close(); } };
    window.addEventListener('keydown', this._key, true);
    // geri tuşu pencereyi kapatsın (Android tablet, tarayıcı)
    this._pop = () => this.close(true);
    try { history.pushState(Object.assign({}, history.state, { lhdPop: 1 }), ''); this._pushed = true; window.addEventListener('popstate', this._pop); } catch (e) { this._pushed = false; }
    document.body.appendChild(this._host);
    if (typeof p.html === 'string') R.querySelector('.cb').innerHTML = p.html;   // hazır içerik (ör. son beslemeler)
    else lpMountCard(R.querySelector('.cb'), p.card, () => this._h, lang, (el) => { this._els.push(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => this._host.classList.add('in')));
  }
  set hass(h) { this._h = h; if (!this._closed) this._els.forEach((e) => { e.hass = h; }); }
  close(fromNav) {
    if (this._closed) return;
    this._closed = true;
    if (LP_CPOP.cur === this) LP_CPOP.cur = null;
    window.removeEventListener('keydown', this._key, true);
    window.removeEventListener('popstate', this._pop);
    if (this._pushed && !fromNav) { try { history.back(); } catch (e) {} }
    this._host.classList.remove('in');
    setTimeout(() => { if (this._host.parentNode) this._host.parentNode.removeChild(this._host); }, 200);
  }
}
