// Perde penceresi: perde karosuna basılı tutunca açılır (ışık penceresinin dilinde).
// Üstte ad + durum + kapat; ortada pencere çizimi (perdenin türüne göre), altında Aç / Durdur / Kapat;
// jaluzi ve dikey storda (cihaz destekliyorsa) kanat açısı için ikinci bir Aç / Durdur / Kapat sırası.
// Tasarım öğenin ayarından seçilir (cover: center | side | shutter | shade | blind | vert), seçilmediyse cihaz sınıfından tahmin edilir.
// Tek yönden açılan perde ve dikey storda toplanma yönü: cover_dir l | r | c (c yalnız dikey storda).
// Çizim sürüklenerek konum ince ayarlanır (cihaz konum destekliyorsa). Eski Safari: ?. ?? yok.
const LP_COV_STYLES = ['center', 'side', 'shutter', 'shade', 'blind', 'vert'];
const LP_COV_N = 14;   // çizimdeki çıta / dikey kanat sayısı
// cihaz özellikleri (CoverEntityFeature)
const LP_COV_F = { open: 1, close: 2, pos: 4, stop: 8, topen: 16, tclose: 32, tstop: 64, tpos: 128 };
const LP_COV_TXT = {
  tr: { open: 'Aç', stop: 'Durdur', close: 'Kapat', tilt: 'Kanat açısı', opening: 'açılıyor…', closing: 'kapanıyor…', isOpen: 'Açık', isClosed: 'Kapalı', pct: '%{n} açık', unav: 'Ulaşılamıyor' },
  en: { open: 'Open', stop: 'Stop', close: 'Close', tilt: 'Slat angle', opening: 'opening…', closing: 'closing…', isOpen: 'Open', isClosed: 'Closed', pct: '{n}% open', unav: 'Unavailable' }
};
const LP_COV_CSS = `
.win { position: relative; height: 230px; border-radius: 16px; overflow: hidden; margin: 10px; touch-action: none;
  background: linear-gradient(180deg, #2c4a6e 0%, #e6a35c 70%, #f4c27a 100%); }
.win.dr.y { cursor: ns-resize; } .win.dr.x { cursor: ew-resize; }
.win .frame { position: absolute; left: 0; top: 0; right: 0; bottom: 0; border: 7px solid #2A2D33; border-radius: 16px; pointer-events: none; z-index: 4; }
.win .mull { position: absolute; left: 50%; top: 0; bottom: 0; width: 6px; margin-left: -3px; background: #2A2D33; }
.win .sun { position: absolute; width: 46px; height: 46px; border-radius: 50%; background: #ffe2a6; right: 22%; top: 38%; }
.win .rail { position: absolute; left: 0; right: 0; top: 0; height: 9px; background: #23252a; z-index: 3; }
.win .cv { position: absolute; transition: width 0.45s, height 0.45s, left 0.45s, top 0.45s, opacity 0.3s, transform 0.3s; }
.win.drag .cv { transition: none; }
.win .wing { top: 9px; bottom: 0; background: repeating-linear-gradient(90deg, #4a3f36 0 10px, #42382f 10px 20px); box-shadow: 0 0 14px rgba(0, 0, 0, 0.5); }
.win .wing.l { left: 0; } .win .wing.r { right: 0; }
.win .roll { left: 0; right: 0; top: 0; background: linear-gradient(180deg, #d9d2c5, #cfc7b8); box-shadow: 0 6px 12px rgba(0, 0, 0, 0.35); border-top: 14px solid #3a3d44; border-bottom: 7px solid #8d8576; box-sizing: border-box; }
.win .shut { left: 0; right: 0; top: 0; background: repeating-linear-gradient(180deg, #5b6068 0 11px, #4c5057 11px 13px); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45); border-top: 16px solid #3a3d44; box-sizing: border-box; }
.win .hsl { left: 7px; right: 7px; height: 13px; background: #c9ccd1; border-radius: 2px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); }
.win .vsl { top: 9px; bottom: 6px; background: #d6d1c6; border-radius: 2px; box-shadow: 1px 0 3px rgba(0, 0, 0, 0.35); }
.win .pct { position: absolute; right: 14px; bottom: 12px; background: rgba(0, 0, 0, 0.55); color: #fff; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 13px; z-index: 5; }
.tri { display: flex; padding: 6px; }
.tri > div { flex: 1 1 0; height: 68px; border-radius: 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box;
  display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 13px; color: #D3D3D3; cursor: pointer; }
.tri > div + div { margin-left: 8px; }
.tri > div ha-icon { --mdc-icon-size: 24px; margin-bottom: 4px; }
.tri > div.on { background: rgba(255, 255, 255, 0.05); border: 2px solid rgb(255, 214, 10); color: #FFC107; font-weight: 600; }
.tri > div.off { opacity: 0.35; pointer-events: none; }
.tri > div:active { -webkit-transform: scale(0.96); transform: scale(0.96); }
.tri.sm > div { height: 52px; flex-direction: row; }
.tri.sm > div ha-icon { --mdc-icon-size: 20px; margin: 0 6px 0 0; }
.lbl { display: flex; justify-content: space-between; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A8F96; font-weight: 600; padding: 12px 14px 0; }
.lbl b { color: #ECEDEF; letter-spacing: 0; text-transform: none; font-size: 12.5px; }
.hd .nm i { font-style: normal; color: #8A8F96; font-size: 13px; margin-left: auto; padding-left: 10px; white-space: nowrap; }
.hd .nm i.mv { color: #FFC107; }
`;

// perdenin tasarımı: öğede seçildiyse o, yoksa cihaz sınıfından
function lpCovStyle(st, item) {
  const s = item && item.cover;
  if (LP_COV_STYLES.indexOf(s) >= 0) return s;
  const dc = st && st.attributes ? st.attributes.device_class : '';
  if (dc === 'curtain') return 'center';
  if (dc === 'shade' || dc === 'awning') return 'shade';
  if (dc === 'blind') return 'blind';
  // sınıfı yok ama kanat açısı var: jaluzi
  const f = (st && st.attributes && st.attributes.supported_features) || 0;
  if (!dc && f & (LP_COV_F.topen | LP_COV_F.tclose | LP_COV_F.tpos)) return 'blind';
  return 'shutter';
}
function lpCovDir(style, item) {
  const d = item && item.cover_dir;
  if (style === 'vert') return d === 'l' || d === 'r' ? d : 'c';
  return d === 'r' ? 'r' : 'l';
}
// çizimin ölçüleri (yüzde): p konum (100 açık), t kanat açısı (100 açık)
function lpCovGeom(style, dir, p, t) {
  p = Math.max(0, Math.min(100, p)); const cov = 100 - p, g = { style: style };
  if (style === 'center') { g.wl = cov / 2 * 0.92 + 4; g.wr = g.wl; }
  else if (style === 'side') { const w = cov * 0.92 + 8; if (dir === 'r') g.wr = w; else g.wl = w; }
  else if (style === 'shutter' || style === 'shade') g.h = cov * 0.9 + 10;
  else {
    const sc = 0.12 + (1 - (typeof t === 'number' ? t : 0) / 100) * 0.88, n = LP_COV_N, out = [];
    if (style === 'blind') {   // çıtalar yukarı toplanır
      const H = Math.max(6, cov);
      for (let i = 0; i < n; i++) out.push({ top: 4 + i / n * H * 0.92, sc: sc });
    } else {   // dikey: kanatlar yana toplanır
      const W = Math.max(8, cov), w = 100 / n;
      for (let i = 0; i < n; i++) {
        let l;
        if (dir === 'c') { const h = n / 2, sp = Math.max(0, W / 2 - w); l = i < h ? i / (h - 1) * sp : 100 - w - (n - 1 - i) / (h - 1) * sp; }
        else if (dir === 'r') l = 100 - W + i / (n - 1) * (W - w);
        else l = i / (n - 1) * (W - w);
        out.push({ left: l, w: w * 0.9, sc: sc });
      }
    }
    g.slats = out;
  }
  return g;
}
// çizimde sürüklenen noktadan konum (x, y: 0-100)
function lpCovFromPt(style, dir, x, y) {
  const c = (v) => Math.max(0, Math.min(100, Math.round(v)));
  if (style === 'center' || (style === 'vert' && dir === 'c')) return c(Math.abs(x - 50) * 2.1);
  if (style === 'side' || style === 'vert') return dir === 'r' ? c(x * 1.05) : c((100 - x) * 1.05);
  return c(y * 1.05);
}

class LemurCoverPopup extends LemurLightPopup {
  static open(hass, id, item, opts) {
    if (LP_POP.cur) LP_POP.cur.close(true);
    const p = new LemurCoverPopup(hass, id, item || {}, null, opts);
    LP_POP.cur = p;
    return p;
  }
  _t(k, v) { let s = (LP_COV_TXT[this._lang] || LP_COV_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; }
  _st() { return this._h.states[this._id]; }
  _ft() { const st = this._st(); return (st && st.attributes && st.attributes.supported_features) || 0; }
  _pos(st) {
    if (!st) return 0;
    const a = st.attributes || {};
    if (typeof a.current_position === 'number') return a.current_position;
    return st.state === 'closed' ? 0 : 100;
  }
  _tiltOk() { const f = this._ft(); return (this._style === 'blind' || this._style === 'vert') && !!(f & (LP_COV_F.topen | LP_COV_F.tclose | LP_COV_F.tpos)); }
  _render() {
    const st = this._st(), it = this._item, F = this._ft();
    this._style = lpCovStyle(st, it); this._dir = lpCovDir(this._style, it);
    const name = it.name || (st && st.attributes.friendly_name) || this._id;
    const icon = lpIcon(lpEntIcon(st, it.icon));
    if (this._host) { const inn = this._host.classList.contains('in'); this._host.className = 'lemur-cover-popup ic-' + lpIconMode() + (this._sheet ? ' sheet' : '') + (this._mount ? ' inbox' + (this._inPh ? ' ph' : '') : '') + (inn ? ' in' : ''); this._host.style.setProperty('--lp-ic-on', lpIconTint()); }
    if (!this._css) { const s = document.createElement('style'); s.textContent = LP_COV_CSS; this._R.insertBefore(s, this._R.firstChild.nextSibling); this._css = true; }
    const S = this._style, D = this._dir, xs = S === 'center' || S === 'side' || S === 'vert';
    let w = '<div class="sun"></div><div class="mull"></div>';
    if (S === 'center' || S === 'side' || S === 'vert') w += '<div class="rail"></div>';
    if (S === 'center') w += '<div class="cv wing l"></div><div class="cv wing r"></div>';
    else if (S === 'side') w += '<div class="cv wing ' + (D === 'r' ? 'r' : 'l') + '"></div>';
    else if (S === 'shutter') w += '<div class="cv shut"></div>';
    else if (S === 'shade') w += '<div class="cv roll"></div>';
    else { for (let i = 0; i < LP_COV_N; i++) w += '<div class="cv ' + (S === 'blind' ? 'hsl' : 'vsl') + '"></div>'; }
    const can = !!(F & LP_COV_F.pos);
    const ic = S === 'center' || (S === 'vert' && D === 'c') ? ['mdi:arrow-expand-horizontal', 'mdi:arrow-collapse-horizontal']
      : S === 'side' || S === 'vert' ? (D === 'r' ? ['mdi:arrow-right', 'mdi:arrow-left'] : ['mdi:arrow-left', 'mdi:arrow-right']) : ['mdi:arrow-up', 'mdi:arrow-down'];
    const btn = (k, i, txt, ok) => '<div data-cv="' + k + '"' + (ok ? '' : ' class="off"') + '><ha-icon icon="' + i + '"></ha-icon>' + esc(txt) + '</div>';
    let h = (this._sheet ? '<div class="grab"></div>' : '') + '<div class="hd"><div class="box nm">' + icon + '<b>' + esc(name) + '</b><i data-sub></i></div><div class="x" data-x><ha-icon icon="mdi:close"></ha-icon></div></div>' +
      '<div class="box" style="margin-top:14px"><div class="win' + (can ? ' dr ' + (xs ? 'x' : 'y') : '') + '" data-w>' + w + '<div class="frame"></div><div class="pct" data-pct></div></div></div>' +
      '<div class="box tri" style="margin-top:14px">' + btn('open', ic[0], this._t('open'), F & LP_COV_F.open || F & LP_COV_F.pos) + btn('stop', 'mdi:stop', this._t('stop'), F & LP_COV_F.stop) + btn('close', ic[1], this._t('close'), F & LP_COV_F.close || F & LP_COV_F.pos) + '</div>';
    if (this._tiltOk()) h += '<div class="box"><div class="lbl">' + esc(this._t('tilt')) + '<b data-tl></b></div><div class="tri sm">' +
      btn('topen', 'mdi:arrow-top-right', this._t('open'), F & (LP_COV_F.topen | LP_COV_F.tpos)) + btn('tstop', 'mdi:stop', this._t('stop'), F & LP_COV_F.tstop) + btn('tclose', 'mdi:arrow-bottom-left', this._t('close'), F & (LP_COV_F.tclose | LP_COV_F.tpos)) + '</div></div>';
    this._pan.innerHTML = h;
    this._bind();
    this._seen = null;
    this._sync();
  }
  _bind() {
    const R = this._pan;
    R.querySelector('[data-x]').addEventListener('click', () => this.close());
    Array.prototype.forEach.call(R.querySelectorAll('[data-cv]'), (el) => el.addEventListener('click', () => this._cmd(el.getAttribute('data-cv'))));
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = this._h; el.stateObj = this._st(); });
    const win = R.querySelector('[data-w]');
    if (win && win.classList.contains('dr')) {
      let v = null;
      lpDrag(win, (p) => {
        this._dragging = true; win.classList.add('drag');
        const r = win.getBoundingClientRect();
        v = lpCovFromPt(this._style, this._dir, (p.clientX - r.left) / r.width * 100, (p.clientY - r.top) / r.height * 100);
        this._paint(v, this._tilt());
      }, () => {
        this._dragging = false; win.classList.remove('drag');
        if (v === null) return;
        this._hold = { v: v, until: Date.now() + 4000 };   // cihazın yeni konumu gelene kadar çizim geri zıplamasın
        this._h.callService('cover', 'set_cover_position', { entity_id: this._id, position: v });
      });
    }
  }
  _tilt() { const st = this._st(), a = (st && st.attributes) || {}; return typeof a.current_tilt_position === 'number' ? a.current_tilt_position : null; }
  _cmd(k) {
    const st = this._st(), F = this._ft(), id = { entity_id: this._id }, mv = st ? st.state : '';
    this._hold = null;
    // hareket ederken aynı yöne yeniden basınca durur
    if ((k === 'open' && mv === 'opening') || (k === 'close' && mv === 'closing')) k = 'stop';
    if (k === 'open') { if (F & LP_COV_F.open) this._h.callService('cover', 'open_cover', id); else this._h.callService('cover', 'set_cover_position', Object.assign({ position: 100 }, id)); }
    else if (k === 'close') { if (F & LP_COV_F.close) this._h.callService('cover', 'close_cover', id); else this._h.callService('cover', 'set_cover_position', Object.assign({ position: 0 }, id)); }
    else if (k === 'stop') this._h.callService('cover', 'stop_cover', id);
    else if (k === 'topen') { if (F & LP_COV_F.topen) this._h.callService('cover', 'open_cover_tilt', id); else this._h.callService('cover', 'set_cover_tilt_position', Object.assign({ tilt_position: 100 }, id)); }
    else if (k === 'tclose') { if (F & LP_COV_F.tclose) this._h.callService('cover', 'close_cover_tilt', id); else this._h.callService('cover', 'set_cover_tilt_position', Object.assign({ tilt_position: 0 }, id)); }
    else if (k === 'tstop') this._h.callService('cover', 'stop_cover_tilt', id);
  }
  // çizimi verilen konuma ve kanat açısına göre boya (öğeler yerinde kalır, geçişle kayar)
  _paint(p, t) {
    const R = this._pan, g = lpCovGeom(this._style, this._dir, p, t);
    const set = (sel, k, v) => { const e = R.querySelector(sel); if (e) e.style[k] = v + '%'; };
    if (g.wl !== undefined) set('.wing.l', 'width', g.wl);
    if (g.wr !== undefined) set('.wing.r', 'width', g.wr);
    if (g.h !== undefined) set(this._style === 'shade' ? '.roll' : '.shut', 'height', g.h);
    if (g.slats) Array.prototype.forEach.call(R.querySelectorAll('.hsl, .vsl'), (e, i) => {
      const s = g.slats[i]; if (!s) return;
      if (this._style === 'blind') { e.style.top = s.top + '%'; e.style.transform = 'scaleY(' + s.sc.toFixed(2) + ')'; }
      else { e.style.left = s.left + '%'; e.style.width = s.w + '%'; e.style.transform = 'scaleX(' + s.sc.toFixed(2) + ')'; }
    });
    const pc = R.querySelector('[data-pct]');
    if (pc) pc.textContent = (this._ft() & LP_COV_F.pos ? '%' + p : (p > 0 ? this._t('isOpen') : this._t('isClosed'))) + (this._tiltOk() && typeof t === 'number' ? ' · ' + this._t('tilt').toLowerCase() + ' %' + t : '');
  }
  _sync(onlyIfChanged) {
    const R = this._pan; if (!R || !R.querySelector('[data-w]')) return;
    const st = this._st();
    if (onlyIfChanged && this._seen === st) return;
    this._seen = st;
    if (this._style !== lpCovStyle(st, this._item)) { this._render(); return; }
    const p0 = this._pos(st), hd = this._hold && Date.now() < this._hold.until && Math.abs(p0 - this._hold.v) > 1 ? this._hold.v : null;
    const p = hd === null ? p0 : hd, t = this._tilt(), s = st ? st.state : '';
    if (!this._dragging) this._paint(p, t);
    const sub = R.querySelector('[data-sub]');
    if (sub) {
      sub.textContent = !st || s === 'unavailable' ? this._t('unav') : s === 'opening' ? this._t('opening') : s === 'closing' ? this._t('closing')
        : (this._ft() & LP_COV_F.pos) && p > 0 && p < 100 ? this._t('pct', { n: p }) : s === 'closed' || p <= 0 ? this._t('isClosed') : this._t('isOpen');
      sub.className = s === 'opening' || s === 'closing' ? 'mv' : '';
    }
    const o = R.querySelector('[data-cv="open"]'), c = R.querySelector('[data-cv="close"]');
    if (o) o.classList.toggle('on', s === 'opening');
    if (c) c.classList.toggle('on', s === 'closing');
    const tl = R.querySelector('[data-tl]'); if (tl) tl.textContent = typeof t === 'number' ? '%' + t : '';
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = this._h; el.stateObj = st; });
  }
}
