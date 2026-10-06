// Işık penceresi: ışık karosuna basılı tutunca açılır (Hakan'ın tablet panosundaki ışık penceresinin aynısı, yardımcı varlık gerekmeden).
// Üstte ad + kapat, altında parlaklık kaydırıcısı + güç düğmesi, sonra sekmeler:
//   Renk: kelvin düğmeleri (2200-6500 K), renk çemberi, 12 renk örneği
//   Efekt: Lemur Light Effect Card kuruluysa ve ışık bir LEC odasındaysa efekt ekranını o odayla açar; değilse ışığın kendi efekt listesi
//   Segment: aynı cihazın segment ışıkları varsa (Govee şerit/lamba) segment seçilir, renk o segmente uygulanır
// Durum pencerenin içinde tutulur (input_select gibi yardımcı varlık yok). Pencere sayfanın kendisine eklenir (panonun ölçeğinden bağımsız).
// Eski Safari (iOS 12): pointer event yok (dokunma + fare), ?. ?? yok, flex gap yok.
const LP_POP_KELVIN = [[2200, '#FF9227'], [2700, '#FFA757'], [3200, '#FFB87B'], [3500, '#FFC18D'], [4000, '#FFCEA6'], [6500, '#FFFEFA']];
const LP_POP_SWATCH = ['#FF3B30', '#FF9500', '#FFD60A', '#A3E635', '#30D158', '#40E0D0', '#32ADE6', '#0A84FF', '#5E5CE6', '#BF5AF2', '#FF6FB5', '#FF2D95'];
const LP_POP_ACCENT = '#F0A93B';
const LP_POP_CSS = `
:host { position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 9000; display: block; font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
  -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; }
.bg { position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.55); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.18s; }
.pan { position: absolute; left: 50%; top: 50%; width: 560px; max-width: calc(100vw - 16px); max-height: calc(100vh - 24px); overflow-y: auto; -webkit-overflow-scrolling: touch;
  box-sizing: border-box; padding: 18px; border-radius: 30px; background: #131416; color: #ECEDEF; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -46%) scale(0.98); opacity: 0; transition: transform 0.2s ease-out, opacity 0.18s; }
:host(.in) .bg { opacity: 1; }
:host(.in) .pan { transform: translate(-50%, -50%); opacity: 1; }
.box { background: #1E2024; border-radius: 18px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.box + .box { margin-top: 14px; }
.hd { display: flex; align-items: center; }
.hd .nm { flex: 1 1 auto; display: flex; align-items: center; height: 56px; padding: 0 18px; min-width: 0; }
.hd .nm ha-icon, .hd .nm ha-state-icon { --mdc-icon-size: 22px; color: ${LP_POP_ACCENT}; margin-right: 12px; flex: 0 0 auto; }
.hd .nm b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x { flex: 0 0 56px; height: 56px; margin-left: 12px; border-radius: 18px; background: #1E2024; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ECEDEF; }
.x ha-icon { --mdc-icon-size: 22px; }
.row { display: flex; align-items: center; padding: 8px; }
.sl { position: relative; flex: 1 1 auto; height: 74px; border-radius: 14px; background: #0C0D0F; overflow: hidden; cursor: pointer; touch-action: none; }
.sl .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--lc, ${LP_POP_ACCENT}); opacity: 0.85; transition: width 0.15s; }
.sl.drag .fill { transition: none; }
.sl .in { position: relative; display: flex; align-items: center; height: 100%; padding: 0 18px; }
.sl ha-state-icon, .sl ha-icon { --mdc-icon-size: 24px; color: #8A8F96; margin-right: 14px; flex: 0 0 auto; }
.sl.on ha-state-icon, .sl.on ha-icon { color: #fff; }
:host(.ic-auto) .sl:not(.on) .lic, :host(.ic-mono) .lic { filter: grayscale(1) brightness(1.1); opacity: 0.7; }
:host(.ic-tint) .lic { color: #8A8F96; } :host(.ic-tint) .sl.on .lic { color: #fff; } :host(.ic-tint) .hd .lic { color: var(--lp-ic-on, #FFC24A); }
.lic { display: inline-block; line-height: 0; flex: 0 0 auto; } .lic svg { width: 100%; height: 100%; display: block; }
.hd .nm .lic { width: 22px; height: 22px; margin-right: 12px; } .sl .lic { width: 24px; height: 24px; margin-right: 14px; }
.sl .tx { min-width: 0; }
.sl .tx b { display: block; font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sl .tx span { display: block; font-size: 13px; color: #8A8F96; margin-top: 2px; }
.sl.on .tx span { color: rgba(255, 255, 255, 0.85); }
.pw { flex: 0 0 74px; height: 74px; margin-left: 10px; border-radius: 18px; background: #2A2D33; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8A8F96; }
.pw.on { background: ${LP_POP_ACCENT}; color: #1A1105; }
.pw ha-icon { --mdc-icon-size: 26px; }
.tabs { display: flex; padding: 5px; }
.tab { flex: 1 1 0; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #8A8F96; cursor: pointer; }
.tab + .tab { margin-left: 5px; }
.tab.on { background: ${LP_POP_ACCENT}; color: #1A1105; font-weight: 600; }
.pane { padding: 18px; }
.kel { display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 7px; }
.kel div { height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #3A2A17;
  font-family: 'JetBrains Mono', ui-monospace, monospace; cursor: pointer; }
.kel div.on { box-shadow: 0 0 0 2px #fff; }
@media (max-width: 360px) { .kel { grid-template-columns: repeat(3, 1fr); } }   /* dar telefonda 6 kelvin düğmesi sığmıyor: 2 satır */
.col { display: grid; grid-template-columns: 177px 1fr; align-items: center; grid-gap: 14px; margin-top: 14px; }
.wh { position: relative; width: 163px; height: 163px; margin: 0 auto; touch-action: none; }
.wh canvas { width: 100%; height: 100%; border-radius: 50%; display: block; box-shadow: 0 6px 24px -12px rgba(0, 0, 0, 0.9); }
.wh .dot { position: absolute; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5);
  -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); pointer-events: none; left: 50%; top: 50%; }
.sw { display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 8px; }
.sw div { height: 51px; border-radius: 11px; cursor: pointer; }
.fx { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 6px; max-height: 300px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.fx div { font-size: 13px; padding: 11px 12px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); color: #B5B9C0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
.fx div.on { background: rgba(91, 141, 239, 0.28); border-color: rgba(91, 141, 239, 0.95); color: #fff; }
.lecb { display: flex; align-items: center; justify-content: center; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #FF6FAE, #8E7CFF); color: #fff;
  font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; }
.lecb ha-icon { --mdc-icon-size: 22px; margin-right: 10px; }
.segs { display: grid; grid-gap: 7px; margin-bottom: 14px; }
.segs div { height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #B5B9C0; cursor: pointer; }
.segs div.on { background: ${LP_POP_ACCENT}; color: #1A1105; font-weight: 600; }
.segs div.lit { box-shadow: inset 0 0 0 2px var(--sc, #fff); }
.empty { color: #8A8F96; font-size: 14px; text-align: center; padding: 18px 0; }
.grab { display: none; }
/* telefon seçeneği: pencere ekranın altından açılır, aşağı çekince kapanır */
:host(.sheet) .pan { left: 0; right: 0; top: auto; bottom: 0; width: 100%; max-width: 100%; max-height: 90vh; border-radius: 28px 28px 0 0;
  padding: 10px 14px calc(18px + env(safe-area-inset-bottom, 0px)); transform: translateY(100%); opacity: 1; transition: transform 0.26s ease-out; }
:host(.sheet.in) .pan { transform: translateY(0); }
:host(.sheet) .grab { display: block; width: 44px; height: 5px; border-radius: 9px; background: #3A3F4A; margin: 2px auto 12px; }
@media (max-width: 560px) { .col { grid-template-columns: 1fr; } .pan { padding: 12px; border-radius: 24px; } }
`;
const LP_POP_TXT = {
  tr: { color: 'Renk', effect: 'Efekt', segment: 'Segment', off: 'Kapalı', on: 'Açık', lec: 'Efekt ekranını aç', noFx: 'Bu ışığın efekti yok', unav: 'Ulaşılamıyor', seg: 'Segment {n}' },
  en: { color: 'Color', effect: 'Effect', segment: 'Segment', off: 'Off', on: 'On', lec: 'Open effect screen', noFx: 'This light has no effects', unav: 'Unavailable', seg: 'Segment {n}' }
};

// basılı tutunca ne açılır: 'popup' (bu pencere, varsayılan), 'ha' (HA'nın kendi penceresi), 'lec' (LEC efekt ekranı); eski lec_hold ayarı 'lec' sayılır
function lpHoldMode() {
  const st = (STORE.data && STORE.data.settings) || {};
  if (st.hold === 'ha' || st.hold === 'lec' || st.hold === 'popup') return st.hold;
  return st.lec_hold ? 'lec' : 'popup';
}

// hsv → rgb (renk çemberi)
function lpHsv(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
// dokunma + fare ile sürükleme (iOS 12'de pointer event yok)
function lpDrag(el, onMove, onEnd) {
  let on = false;
  const pt = (e) => (e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e));
  const mv = (e) => { if (!on) return; if (e.cancelable) e.preventDefault(); onMove(pt(e), false); };
  const up = (e) => {
    if (!on) return; on = false;
    window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up);
    window.removeEventListener('touchmove', mv); window.removeEventListener('touchend', up); window.removeEventListener('touchcancel', up);
    onEnd(pt(e));
  };
  const down = (e) => {
    if (e.type === 'mousedown' && e.button !== 0) return;
    on = true; if (e.cancelable) e.preventDefault(); onMove(pt(e), true);
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', up); window.addEventListener('touchcancel', up);
  };
  el.addEventListener('mousedown', down);
  el.addEventListener('touchstart', down, { passive: false });
}

const LP_POP = { cur: null };
class LemurLightPopup {
  // id: ışık; item: karodaki ad/simge; room: LEC odası (yoksa sekmenin alanı)
  static open(hass, id, item, room) {
    if (LP_POP.cur) LP_POP.cur.close(true);
    const p = new LemurLightPopup(hass, id, item || {}, room || null);
    LP_POP.cur = p;
    return p;
  }
  static update(hass) { if (LP_POP.cur) LP_POP.cur.hass = hass; }

  constructor(hass, id, item, room) {
    this._h = hass; this._id = id; this._item = item; this._room = room;
    this._lang = pickLang(hass);
    this._tab = 'color'; this._seg = 0;
    this._sheet = lpPhoneScreen() && lpPhoneCfg().sheet;
    this._host = document.createElement('div');
    this._host.className = 'lemur-light-popup';
    const R = this._host.attachShadow({ mode: 'open' });
    R.innerHTML = '<style>' + LP_POP_CSS + '</style><div class="bg"></div><div class="pan" role="dialog" aria-modal="true"></div>';
    this._R = R; this._pan = R.querySelector('.pan');
    R.querySelector('.bg').addEventListener('click', () => this.close());
    // alttan açılan pencere: başlıktan ya da tutamaktan aşağı çekince kapanır (kaydırıcılar ve renk çemberi kendi sürüklemesini kullanır)
    let sy = null;
    this._pan.addEventListener('touchstart', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('[data-sl], .wh, .fx, .segs') : null;
      sy = this._sheet && !t && this._pan.scrollTop <= 0 ? e.touches[0].clientY : null;
    }, { passive: true });
    this._pan.addEventListener('touchmove', (e) => {
      if (sy === null) return;
      const dy = e.touches[0].clientY - sy;
      if (dy > 0) { this._pan.style.transition = 'none'; this._pan.style.transform = 'translateY(' + dy + 'px)'; }
    }, { passive: true });
    this._pan.addEventListener('touchend', (e) => {
      if (sy === null) return;
      const dy = e.changedTouches[0].clientY - sy; sy = null;
      this._pan.style.transition = ''; this._pan.style.transform = '';
      if (dy > 90) this.close();
    }, { passive: true });
    this._key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); this.close(); } };
    window.addEventListener('keydown', this._key, true);
    // geri tuşu pencereyi kapatsın (Android tablet, tarayıcı)
    this._pop = () => this.close(true);
    try { history.pushState(Object.assign({}, history.state, { lhdPop: 1 }), ''); this._pushed = true; window.addEventListener('popstate', this._pop); } catch (e) { this._pushed = false; }
    document.body.appendChild(this._host);
    this._render();
    requestAnimationFrame(() => requestAnimationFrame(() => this._host.classList.add('in')));
  }
  close(fromNav) {
    if (this._closed) return;
    this._closed = true;
    if (LP_POP.cur === this) LP_POP.cur = null;
    window.removeEventListener('keydown', this._key, true);
    window.removeEventListener('popstate', this._pop);
    if (this._pushed && !fromNav) { try { history.back(); } catch (e) {} }
    this._host.classList.remove('in');
    setTimeout(() => { if (this._host.parentNode) this._host.parentNode.removeChild(this._host); }, 200);
  }
  // HA her durum değişiminde hass gönderir: pencere yalnız kendi ışıklarından biri değiştiyse yeniden çizilir
  set hass(h) { this._h = h; if (!this._closed && !this._dragging) this._sync(true); }
  _t(k, v) { let s = (LP_POP_TXT[this._lang] || LP_POP_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; }

  // aynı cihazın segment ışıkları (ör. light.lantern_floor_lamp_s_segment_001..004)
  // (bütün varlıkları taramak pahalı: varlık listesi değişmedikçe önceki sonuç kullanılır)
  _segments() {
    const ents = this._h.entities || {};
    if (this._segC && this._segC.e === ents) return this._segC.v;
    const e = ents[this._id], dv = e && e.device_id;
    const v = !dv ? [] : Object.keys(this._h.states).filter((x) => x !== this._id && x.indexOf('light.') === 0 && /_segment_?\d+$/.test(x) && ents[x] && ents[x].device_id === dv).sort();
    this._segC = { e: ents, v: v };
    return v;
  }
  _caps(id) {
    const st = this._h.states[id], a = (st && st.attributes) || {}, m = a.supported_color_modes || [];
    const color = m.some((x) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(x) >= 0);
    const ct = m.indexOf('color_temp') >= 0 || color;
    const dim = color || ct || m.indexOf('brightness') >= 0 || m.indexOf('white') >= 0;
    return { color: color, ct: ct, dim: id.indexOf('light.') === 0 && dim, fx: (a.effect_list || []).filter((x) => x).length > 0 };
  }
  _lecRoom() { return LEC.installed(this._h) ? (LEC.roomOf(this._id) || (LEC.hasRoom(this._room) ? this._room : null)) : null; }
  _tabs() {
    const c = this._caps(this._id), out = [];
    if (c.color || c.ct) out.push('color');
    if (c.fx || this._lecRoom()) out.push('effect');
    if (this._segments().length) out.push('segment');
    return out;
  }

  _render() {
    const S = this._h.states, st = S[this._id], it = this._item;
    const name = it.name || (st && st.attributes.friendly_name) || this._id;
    const icon = lpIcon(lpEntIcon(st, it.icon));
    if (!LP_MDIC.map) lpMdicLoad().then(() => { if (this._host && this._host.isConnected) this._render(); });
    // sınıf baştan yazılırken açılış sınıfı (in) korunur; yoksa sekme değişince pencere görünmez olur ama ekranı kaplamaya devam eder
    if (this._host) { const inn = this._host.classList.contains('in'); this._host.className = 'lemur-light-popup ic-' + lpIconMode() + (this._sheet ? ' sheet' : '') + (inn ? ' in' : ''); this._host.style.setProperty('--lp-ic-on', lpIconTint()); }
    const tabs = this._tabs();
    if (tabs.indexOf(this._tab) < 0) this._tab = tabs[0] || null;
    let h = (this._sheet ? '<div class="grab"></div>' : '') + '<div class="hd"><div class="box nm">' + icon + '<b>' + esc(name) + '</b></div><div class="x" data-x><ha-icon icon="mdi:close"></ha-icon></div></div>' +
      '<div class="box row" style="margin-top:14px">' + this._sliderHtml(this._id, name, icon) + '<div class="pw" data-pw><ha-icon icon="mdi:power"></ha-icon></div></div>';
    if (tabs.length > 1 || (tabs.length === 1 && tabs[0] !== 'color')) {
      h += '<div class="box tabs" style="margin-top:14px">' + tabs.map((k) => '<div class="tab' + (k === this._tab ? ' on' : '') + '" data-tab="' + k + '">' + esc(this._t(k)) + '</div>').join('') + '</div>';
    }
    if (this._tab) h += '<div class="box pane" style="margin-top:14px">' + this._paneHtml() + '</div>';
    this._pan.innerHTML = h;
    this._bind();
    this._sync();
  }
  _sliderHtml(id, name, icon) {
    return '<div class="sl" data-sl="' + esc(id) + '"><div class="fill"></div><div class="in">' + icon + '<div class="tx"><b>' + esc(name) + '</b><span></span></div></div></div>';
  }
  _target() { const segs = this._segments(); return this._tab === 'segment' && segs[this._seg] ? segs[this._seg] : this._id; }
  _colorHtml(id) {
    const c = this._caps(id);
    let h = '';
    if (c.ct) h += '<div class="kel">' + LP_POP_KELVIN.map((k) => '<div data-k="' + k[0] + '" style="background:' + k[1] + '">' + k[0] + 'K</div>').join('') + '</div>';
    if (c.color) h += '<div class="col"' + (c.ct ? '' : ' style="margin-top:0"') + '><div class="wh"><canvas width="326" height="326"></canvas><div class="dot"></div></div>' +
      '<div class="sw">' + LP_POP_SWATCH.map((x) => '<div data-rgb="' + x + '" style="background:' + x + '"></div>').join('') + '</div></div>';
    return h;
  }
  _paneHtml() {
    const S = this._h.states;
    if (this._tab === 'color') return this._colorHtml(this._id);
    if (this._tab === 'effect') {
      const room = this._lecRoom();
      const list = ((S[this._id] && S[this._id].attributes.effect_list) || []).filter((x) => x);
      return (room ? '<div class="lecb" data-lec><ha-icon icon="mdi:creation"></ha-icon>' + esc(this._t('lec')) + '</div>' : '') +
        (list.length ? '<div class="fx">' + list.map((x) => '<div data-fx="' + esc(x) + '">' + esc(x) + '</div>').join('') + '</div>' : (room ? '' : '<div class="empty">' + esc(this._t('noFx')) + '</div>'));
    }
    if (this._tab === 'segment') {
      const segs = this._segments(), id = segs[this._seg];
      const n = segs.length;
      return '<div class="segs" style="grid-template-columns:repeat(' + Math.min(n, 6) + ',1fr)">' + segs.map((x, i) => '<div data-seg="' + i + '"' + (i === this._seg ? ' class="on"' : '') + '>' + (i + 1) + '</div>').join('') + '</div>' +
        '<div class="row" style="padding:0;margin-bottom:14px">' + this._sliderHtml(id, this._t('seg', { n: this._seg + 1 }), '<ha-icon icon="mdi:led-strip-variant"></ha-icon>') +
        '<div class="pw" data-pws><ha-icon icon="mdi:power"></ha-icon></div></div>' + this._colorHtml(id);
    }
    return '';
  }

  _bind() {
    const R = this._pan, H = () => this._h;
    R.querySelector('[data-x]').addEventListener('click', () => this.close());
    R.querySelector('[data-pw]').addEventListener('click', () => this._toggle(this._id));
    const pws = R.querySelector('[data-pws]'); if (pws) pws.addEventListener('click', () => this._toggle(this._target()));
    Array.prototype.forEach.call(R.querySelectorAll('[data-tab]'), (el) => el.addEventListener('click', () => {
      const k = el.getAttribute('data-tab');
      // tablet panosundaki gibi: Efekt sekmesi, LEC kuruluysa ve ışığın listesi yoksa doğrudan efekt ekranını açar
      if (k === 'effect' && this._lecRoom() && !this._caps(this._id).fx) { this._openLec(); return; }
      this._tab = k; this._render();
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-seg]'), (el) => el.addEventListener('click', () => { this._seg = +el.getAttribute('data-seg'); this._render(); }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-k]'), (el) => el.addEventListener('click', () => {
      this._call('turn_on', this._target(), { color_temp_kelvin: +el.getAttribute('data-k') });
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-rgb]'), (el) => el.addEventListener('click', () => {
      const x = el.getAttribute('data-rgb'); this._call('turn_on', this._target(), { rgb_color: [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)] });
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-fx]'), (el) => el.addEventListener('click', () => this._call('turn_on', this._id, { effect: el.getAttribute('data-fx') })));
    const lec = R.querySelector('[data-lec]'); if (lec) lec.addEventListener('click', () => this._openLec());
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = H(); el.stateObj = H().states[this._id]; });
    // parlaklık kaydırıcıları: sürükledikçe dolgu değişir, bırakınca (ve sürüklerken 300 ms'de bir) ışığa gönderilir
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => {
      const id = sl.getAttribute('data-sl');
      if (!this._caps(id).dim) return;
      let pct = 0, last = 0;
      const send = () => { last = Date.now(); if (pct <= 0) this._call('turn_off', id, {}); else this._call('turn_on', id, { brightness_pct: pct }); };
      lpDrag(sl, (p) => {
        this._dragging = true; sl.classList.add('drag');
        const r = sl.getBoundingClientRect();
        pct = Math.max(0, Math.min(100, Math.round((p.clientX - r.left) / r.width * 100)));
        sl.querySelector('.fill').style.width = pct + '%';
        sl.querySelector('.tx span').textContent = pct ? pct + '%' : this._t('off');
        if (Date.now() - last > 300) send();
      }, () => { this._dragging = false; this._seen = null; sl.classList.remove('drag'); send(); });
    });
    // renk çemberi
    const wh = R.querySelector('.wh');
    if (wh) {
      this._paintWheel(wh.querySelector('canvas'));
      let hs = null, last = 0;
      const send = () => { if (!hs) return; last = Date.now(); this._call('turn_on', this._target(), { hs_color: hs }); };
      lpDrag(wh, (p) => {
        this._dragging = true;
        const r = wh.getBoundingClientRect(), rad = r.width / 2;
        let x = p.clientX - r.left - rad, y = p.clientY - r.top - rad, d = Math.sqrt(x * x + y * y) / rad;
        if (d > 1) { x /= d; y /= d; d = 1; }
        hs = [Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360), Math.round(d * 100)];
        const dot = wh.querySelector('.dot'); dot.style.left = (50 + x / rad * 50) + '%'; dot.style.top = (50 + y / rad * 50) + '%';
        if (Date.now() - last > 220) send();
      }, () => { this._dragging = false; this._seen = null; setTimeout(send, 120); });
    }
  }
  _paintWheel(cv) {
    const n = cv.width, c = n / 2, ctx = cv.getContext('2d'), img = ctx.createImageData(n, n), d = img.data;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const dx = x - c + 0.5, dy = y - c + 0.5, r = Math.sqrt(dx * dx + dy * dy) / c, k = 4 * (y * n + x);
      if (r > 1) { d[k + 3] = 0; continue; }
      const rgb = lpHsv((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, r, 1);
      d[k] = rgb[0]; d[k + 1] = rgb[1]; d[k + 2] = rgb[2]; d[k + 3] = r > 0.985 ? Math.round((1 - r) / 0.015 * 255) : 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  _call(svc, id, data) {
    const d = id.split('.')[0];
    if (d !== 'light') { this._h.callService('homeassistant', svc === 'turn_off' ? 'turn_off' : 'turn_on', { entity_id: id }); return; }
    this._h.callService('light', svc, Object.assign({ entity_id: id }, data));
  }
  _toggle(id) { this._h.callService(id.split('.')[0] === 'light' ? 'light' : 'homeassistant', 'toggle', { entity_id: id }); }
  _openLec() {
    const room = this._lecRoom();
    this.close();
    setTimeout(() => LEC.open(this._h, room), 220);
  }

  // durumu ekrana yansıt (yeniden çizmeden)
  _sync(onlyIfChanged) {
    const R = this._pan, S = this._h.states;
    if (!R) return;
    const ids = [this._id, this._target()].concat(this._segments());
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => ids.push(sl.getAttribute('data-sl')));
    const seen = ids.map((i) => S[i]), L = this._seen;
    if (onlyIfChanged && L && L.length === seen.length && seen.every((x, i) => x === L[i])) return;
    this._seen = seen;
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => {
      const st = S[sl.getAttribute('data-sl')];
      const on = !!st && st.state === 'on', a = (st && st.attributes) || {};
      const pct = on ? (typeof a.brightness === 'number' ? Math.max(1, Math.round(a.brightness / 2.55)) : 100) : 0;
      const rgb = on && a.rgb_color && (a.rgb_color[0] + a.rgb_color[1] + a.rgb_color[2]) > 12 ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      sl.classList.toggle('on', on);
      if (rgb) sl.style.setProperty('--lc', rgb); else sl.style.removeProperty('--lc');
      sl.querySelector('.fill').style.width = pct + '%';
      sl.querySelector('.tx span').textContent = !st || st.state === 'unavailable' ? this._t('unav') : (on ? (this._caps(sl.getAttribute('data-sl')).dim ? pct + '%' : this._t('on')) : this._t('off'));
    });
    const pw = R.querySelector('[data-pw]'), st = S[this._id];
    if (pw) pw.classList.toggle('on', !!st && st.state === 'on');
    const pws = R.querySelector('[data-pws]'), ts = S[this._target()];
    if (pws) pws.classList.toggle('on', !!ts && ts.state === 'on');
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = this._h; el.stateObj = st; });
    // seçili renk: çemberdeki nokta, kelvin düğmesi, efekt
    const tgt = S[this._target()], ta = (tgt && tgt.attributes) || {};
    const dot = R.querySelector('.wh .dot');
    if (dot && ta.hs_color && tgt.state === 'on') {
      const a = ta.hs_color[0] * Math.PI / 180, r = ta.hs_color[1] / 100;
      dot.style.left = (50 + Math.cos(a) * r * 50) + '%'; dot.style.top = (50 + Math.sin(a) * r * 50) + '%';
    }
    Array.prototype.forEach.call(R.querySelectorAll('[data-k]'), (el) => {
      el.classList.toggle('on', !!tgt && tgt.state === 'on' && ta.color_mode === 'color_temp' && Math.abs((ta.color_temp_kelvin || 0) - +el.getAttribute('data-k')) < 120);
    });
    const ef = st && st.state === 'on' ? String(st.attributes.effect || '') : '';
    Array.prototype.forEach.call(R.querySelectorAll('[data-fx]'), (el) => el.classList.toggle('on', !!ef && el.getAttribute('data-fx') === ef));
    Array.prototype.forEach.call(R.querySelectorAll('[data-seg]'), (el) => {
      const s2 = S[this._segments()[+el.getAttribute('data-seg')]], a2 = (s2 && s2.attributes) || {};
      const lit = !!s2 && s2.state === 'on';
      el.classList.toggle('lit', lit);
      if (lit && a2.rgb_color) el.style.setProperty('--sc', 'rgb(' + a2.rgb_color.join(',') + ')'); else el.style.removeProperty('--sc');
    });
  }
}
