// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Görünüm referans tablet panosuyla birebir (ölçüler base.css'te).
// Çizim iki aşamalı: iskelet sekme ya da ayar değişince bir kez kurulur (_build), durum değişince sadece karolar güncellenir (_update).
// Böylece gömülü kartların (iklim, süpürge) halesi ve karoların efekt animasyonu her durum değişiminde baştan başlamaz.
// Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const LP_HOLD_MS = 500;

// Dokun / basılı tut. Parmak kayarsa (kaydırma) hiçbir şey yapmaz.
function lpPress(el, tap, hold) {
  let timer = null, held = false, moved = false, sx = 0, sy = 0, touched = false;
  const start = (x, y) => {
    held = false; moved = false; sx = x; sy = y; clearTimeout(timer);
    el.classList.add('down');
    if (hold) timer = setTimeout(() => { held = true; el.classList.remove('down'); hold(); }, LP_HOLD_MS);
  };
  const cancel = () => { moved = true; clearTimeout(timer); el.classList.remove('down'); };
  const end = () => { clearTimeout(timer); el.classList.remove('down'); if (!held && !moved) tap(); };
  el.addEventListener('touchstart', (e) => { touched = true; const p = e.touches[0]; start(p.clientX, p.clientY); }, { passive: true });
  el.addEventListener('touchmove', (e) => { const p = e.touches[0]; if (Math.abs(p.clientX - sx) > 10 || Math.abs(p.clientY - sy) > 10) cancel(); }, { passive: true });
  el.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); end(); });
  el.addEventListener('touchcancel', cancel);
  el.addEventListener('mousedown', (e) => { if (touched || e.button !== 0) return; start(e.clientX, e.clientY); });
  el.addEventListener('mouseup', () => { if (touched) return; end(); });
  el.addEventListener('mouseleave', () => { if (!touched) cancel(); });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
// Kaydırmalı çubuk: dokun aç/kapat, sağa-sola kaydır değer (parlaklık, perde konumu, fan hızı), basılı tut pencere.
// Kaydırma parmağın başladığı yerden göreli (dokununca değer zıplamaz). Dikey hareket sayfayı kaydırır.
// o: { tap, hold, can() → kaydırılabilir mi, start() → şu anki değer 0-100, move(v), end() }
function lpSlide(el, o) {
  let timer = null, held = false, mode = null, sx = 0, sy = 0, sv = 0, w = 1, touched = false;
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
  const begin = (x, y) => {
    held = false; mode = null; sx = x; sy = y; clearTimeout(timer);
    el.classList.add('down');
    timer = setTimeout(() => { if (mode) return; held = true; el.classList.remove('down'); o.hold(); }, LP_HOLD_MS);
  };
  const move = (x, y, e) => {
    const dx = x - sx, dy = y - sy;
    if (!mode && !held) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) && o.can()) {
        mode = 'drag'; clearTimeout(timer); el.classList.remove('down'); el.classList.add('drag');
        sv = o.start(); w = el.getBoundingClientRect().width || 1; sx = x;
      } else if (Math.abs(dx) > 10 || Math.abs(dy) > 10) { mode = 'scroll'; clearTimeout(timer); el.classList.remove('down'); }
    }
    if (mode === 'drag') { if (e && e.cancelable) e.preventDefault(); o.move(clamp(sv + (x - sx) / w * 100)); }
  };
  const end = () => {
    clearTimeout(timer); el.classList.remove('down');
    if (mode === 'drag') { el.classList.remove('drag'); o.end(); } else if (!held && !mode) o.tap();
    mode = null;
  };
  el.addEventListener('touchstart', (e) => { touched = true; const p = e.touches[0]; begin(p.clientX, p.clientY); }, { passive: true });
  el.addEventListener('touchmove', (e) => { const p = e.touches[0]; move(p.clientX, p.clientY, e); }, { passive: false });
  el.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); end(); });
  el.addEventListener('touchcancel', () => { clearTimeout(timer); el.classList.remove('down'); if (mode === 'drag') { el.classList.remove('drag'); o.end(); } mode = 'scroll'; });
  el.addEventListener('mousedown', (e) => {
    if (touched || e.button !== 0) return;
    begin(e.clientX, e.clientY);
    const mm = (ev) => move(ev.clientX, ev.clientY, ev);
    const mu = () => { document.removeEventListener('mousemove', mm, true); document.removeEventListener('mouseup', mu, true); end(); };
    document.addEventListener('mousemove', mm, true); document.addEventListener('mouseup', mu, true);
  });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
// Çubuğun kaydırdığı değer (0-100): ışıkta parlaklık, perdede konum, fanda hız. Kaydırılamayan cihazda null.
function lpBarCan(st) {
  if (!st) return false;
  const d = st.entity_id.split('.')[0], a = st.attributes || {};
  if (d === 'light') { const m = a.supported_color_modes || []; return !(m.length && m.every((x) => x === 'onoff')); }
  if (d === 'cover') return typeof a.current_position === 'number';
  if (d === 'fan') return typeof a.percentage === 'number' || ((a.supported_features || 0) & 1) === 1;
  return false;
}
function lpBarVal(st) {
  const d = st.entity_id.split('.')[0], a = st.attributes || {};
  if (d === 'cover') return typeof a.current_position === 'number' ? a.current_position : (st.state === 'open' ? 100 : 0);
  if (st.state !== 'on') return 0;
  if (d === 'light' && typeof a.brightness === 'number') return Math.max(1, Math.round(a.brightness / 2.55));
  if (d === 'fan' && typeof a.percentage === 'number') return a.percentage;
  return 100;
}
function lpBarSet(h, id, v) {
  const d = id.split('.')[0];
  if (d === 'light') return v > 0 ? h.callService('light', 'turn_on', { entity_id: id, brightness_pct: v }) : h.callService('light', 'turn_off', { entity_id: id });
  if (d === 'cover') return h.callService('cover', 'set_cover_position', { entity_id: id, position: v });
  if (d === 'fan') return v > 0 ? h.callService('fan', 'set_percentage', { entity_id: id, percentage: v }) : h.callService('fan', 'turn_off', { entity_id: id });
}
const LP_BAR_COLOR = '#F0A93B';
// panoda sanal enerji değeri kullanılan bir öğe var mı (sekmeler değişince yeniden bakılır)
function lpEnVirtUsed() {
  const T = STORE.data && STORE.data.tabs; if (!T) return false;
  if (LP_EN.vu && LP_EN.vu.t === T) return LP_EN.vu.v;
  const v = JSON.stringify(T).indexOf('sensor.lhdx_') >= 0; LP_EN.vu = { t: T, v: v }; return v;
}
// enerji kartı olan ilk sekmeye git
function lpEnGoTab() {
  const T = (STORE.data && STORE.data.tabs) || [], tab = T.filter((x) => (x.sections || []).some((s) => s.type === 'energy'))[0]; if (!tab) return;
  const seg = location.pathname.split('/').filter((x) => x), base = '/' + (seg[0] || 'lemur-home-dashboard');
  history.pushState(null, '', base + '/' + tab.id);
  const ev = new Event('location-changed', { bubbles: true, composed: true }); ev.detail = { replace: false }; window.dispatchEvent(ev);
}
function lpFire(node, type, detail) {
  if (type === 'hass-more-info' && detail && lpEnIsVirt(detail.entityId)) { lpEnGoTab(); return; }   // sanal enerji değeri: Enerji sekmesine git
  const ev = new Event(type, { bubbles: true, composed: true });
  ev.detail = detail;
  node.dispatchEvent(ev);
}
// Kolon genişlikleri: sayı dizisi (oran, ör. [56, 17, 25.5]); eski kayıtlarda "56%" metni de olabilir.
const LP_DEFAULT_COLS = [56, 17, 25.5];
// Kolon içi sütun sayısı (1-3); genişlik kolondan eşit paylaşılır, ayrıca ayarlanmaz.
function lpSplits(tab, n) {
  const sp = (tab && tab.splits) || [];
  const out = [];
  for (let i = 0; i < n; i++) { const v = parseInt(sp[i], 10); out.push(v >= 1 && v <= 3 ? v : 1); }
  return out;
}
function lpWeights(tab) {
  const c = (tab && tab.columns && tab.columns.length) ? tab.columns : LP_DEFAULT_COLS;
  return c.map((x) => { const v = parseFloat(typeof x === 'object' && x ? x.w : x); return v > 0 ? v : 10; });
}
// ---- serbest ızgara (tab.layout === 'grid'): bölümler 12 sütunluk ızgarada {x, y, w, h}; dikey ekranda 6 sütun ----
// s.g geniş ekranın yeri, s.gm dikey ekranınki (tab.gm_own: elle düzenlendi, yoksa geniş düzenden türetilir).
// tab.gfit: false ise satır yüksekliği sabit (tab.growh px) ve sayfa kayar; yoksa düzen ekranı doldurur (tab.grows satır).
const LP_GMIN = { halo: [3, 4], cats: [3, 3], flow: [3, 4], top: [3, 3], week: [3, 3], day: [3, 3], battery: [2, 2], tariff: [3, 3], meter: [3, 3], tips: [3, 2], standby: [2, 2] };
function lpGMin(s, C) {
  const e = (s.entities || [])[0], k = s.type === 'energy' && e && typeof e === 'object' ? e.energy : null, m = LP_GMIN[k] || [2, 2];
  return C === 6 ? [Math.max(2, Math.ceil(m[0] / 2) + (m[0] > 2 ? 1 : 0)), m[1]] : m;
}
const lpGHit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
// çakışanları aşağı iter, sonra boşlukları yukarı toplar; taşınan (moved) yerinde kalır
function lpGSettle(L, moved, C) {
  L.forEach((o) => { o.w = Math.max(1, Math.min(C, o.w)); o.x = Math.max(0, Math.min(C - o.w, o.x)); o.y = Math.max(0, o.y); o.h = Math.max(1, o.h); });
  const ord = L.slice().sort((a, b) => (a.id === moved ? -1 : b.id === moved ? 1 : 0) || a.y - b.y || a.x - b.x), done = [];
  ord.forEach((o) => { while (done.some((p) => lpGHit(p, o))) o.y++; done.push(o); });
  const by = L.slice().sort((a, b) => a.y - b.y || a.x - b.x), put = [];
  by.forEach((o) => { if (o.id !== moved) while (o.y > 0) { o.y--; if (put.some((p) => lpGHit(p, o))) { o.y++; break; } } put.push(o); });
  return L;
}
// sütunlu düzenden ızgaraya: kolon genişlikleri 12'ye, aynı kolondaki kutular grow oranında 12 satıra bölünür
function lpGridFromCols(T) {
  const W = lpWeights(T), sum = W.reduce((a, b) => a + b, 0) || 1, n = W.length, xs = [], ws = []; let acc = 0;
  W.forEach((w, i) => { const x0 = Math.round(acc / sum * 12), x1 = i === n - 1 ? 12 : Math.round((acc + w) / sum * 12); xs.push(x0); ws.push(Math.max(1, x1 - x0)); acc += w; });
  const by = W.map(() => []); (T.sections || []).forEach((s) => by[Math.max(0, Math.min(n - 1, s.col || 0))].push(s));
  by.forEach((L, i) => { const g = L.reduce((a, s) => a + (parseFloat(s.grow) > 0 ? parseFloat(s.grow) : 1), 0) || 1; let y = 0; L.forEach((s, k) => { const h = k === L.length - 1 ? Math.max(2, 12 - y) : Math.max(2, Math.round((parseFloat(s.grow) > 0 ? parseFloat(s.grow) : 1) / g * 12)); s.g = { x: xs[i], y: y, w: ws[i], h: h }; y += h; }); });
  return T;
}
// boşlukları kapat: her kutu önce sağa, sonra en alt satıra kadar aşağı uzar (yalnız boş hücrelere)
function lpGFill(L, C, rows) {
  const ord = L.slice().sort((a, b) => a.y - b.y || a.x - b.x), free = (o, c) => !L.some((p) => p !== o && lpGHit(p, c));
  ord.forEach((o) => { while (o.x + o.w < C && free(o, { x: o.x, y: o.y, w: o.w + 1, h: o.h })) o.w++; });
  ord.forEach((o) => { while (o.y + o.h < rows && free(o, { x: o.x, y: o.y, w: o.w, h: o.h + 1 })) o.h++; });
  return L;
}
// bölümlerin yerleri: { id: {x, y, w, h} }
function lpGridPos(T, C, ids) {
  const S = (T.sections || []).filter((s) => !ids || ids.indexOf(s.id) >= 0), out = {};
  // yeri olmayan (yeni eklenen) bölüm en alta, kartın en küçüğünden küçük olmayan 4×4 ile girer
  const wide = S.map((s) => { const g = s.g || {}, m = lpGMin(s, 12); return { id: s.id, s: s, x: +g.x || 0, y: g.y === undefined ? 999 : +g.y || 0, w: +g.w || Math.max(4, m[0]), h: +g.h || Math.max(4, m[1]) }; });
  if (C === 12) { lpGSettle(wide, null, 12); wide.forEach((o) => { out[o.id] = { x: o.x, y: o.y, w: o.w, h: o.h }; }); return out; }
  if (T.gm_own && S.every((s) => s.gm)) { const L = S.map((s) => ({ id: s.id, x: +s.gm.x || 0, y: +s.gm.y || 0, w: +s.gm.w || 3, h: +s.gm.h || 4 })); lpGSettle(L, null, C); L.forEach((o) => { out[o.id] = o; }); return out; }
  // dikey: geniş düzenin okuma sırasıyla, genişlik yarıya (en az kartın en küçüğü), boş ilk yere
  const put = [];
  wide.sort((a, b) => a.y - b.y || a.x - b.x).forEach((o) => {
    const m = lpGMin(o.s, C), w = Math.max(m[0], Math.min(C, Math.round(o.w / 2) || 1)), h = Math.max(m[1], o.h);
    let y = 0, x = 0, ok = false;
    for (y = 0; !ok && y < 400; y++) for (x = 0; x <= C - w; x++) { const c = { x: x, y: y, w: w, h: h }; if (!put.some((p) => lpGHit(p, c))) { ok = true; break; } }
    const c = { id: o.id, x: x, y: y - 1, w: w, h: h }; put.push(c); out[o.id] = c;
  });
  return out;
}
const lpEnt = (x) => (typeof x === 'string' ? { entity: x } : (x && x.entity ? x : null));
// Gömülü kart (Halo) tanımlı mı? customElements.get'e güvenilmez (kayıt defteri değişmiş olabilir), öğeyi oluşturup bakıyoruz.
const LP_HAS = {};
function lpHas(tag) {
  if (LP_HAS[tag]) return true;
  try { const el = document.createElement(tag); if (typeof el.setConfig === 'function') LP_HAS[tag] = true; } catch (e) {}
  return !!LP_HAS[tag];
}
const lpItem = (x) => (typeof x === 'string' ? { entity: x } : (x && (x.entity || x.name) ? x : null));
// karoda "açık" sayılan durumlar (ışık, priz, perde açık, medya çalıyor...)
const LP_ON = ['on', 'open', 'opening', 'closing', 'playing', 'cleaning'];
// Anında tepki: aç/kapat'a dokununca karo cihazın cevabını beklemeden yeni durumda çizilir.
// Işığın son rengi ve parlaklığı bu tarayıcıda hatırlanır (lhd-light-mem); açarken karo o renkte yanar.
// Gerçek durum gelince (ya da 5 sn içinde gelmezse) karo gerçeğe göre yeniden çizilir; başka yerden değiştiyse gerçek olan kalır.
const LP_OPT = window.__LEMUR_HD_OPT || (window.__LEMUR_HD_OPT = { mem: null, pend: {}, t: null });
const LP_OPT_DOMAINS = ['light', 'switch', 'input_boolean', 'fan'];
const LP_OPT_MS = 5000;
function lpOptMem() {
  if (!LP_OPT.mem) {
    let m = null; try { m = JSON.parse(localStorage.getItem('lhd-light-mem') || 'null'); } catch (e) {}
    LP_OPT.mem = m && typeof m === 'object' && !Array.isArray(m) ? m : {};
  }
  return LP_OPT.mem;
}
// yanan ışığın rengini ve parlaklığını hatırla (değiştiyse kaydet; yazma 2 sn toplanır)
function lpOptRemember(st) {
  if (!st || st.state !== 'on' || st.entity_id.indexOf('light.') !== 0) return;
  const a = st.attributes || {}, o = {};
  if (Array.isArray(a.rgb_color) && a.rgb_color.length >= 3) o.rgb_color = a.rgb_color.slice(0, 3);
  if (typeof a.brightness === 'number') o.brightness = a.brightness;
  if (typeof a.color_mode === 'string') o.color_mode = a.color_mode;
  const M = lpOptMem(), id = st.entity_id;
  if (M[id] && JSON.stringify(M[id]) === JSON.stringify(o)) return;
  M[id] = o;
  clearTimeout(LP_OPT.t);
  LP_OPT.t = setTimeout(() => { try { localStorage.setItem('lhd-light-mem', JSON.stringify(M)); } catch (e) {} }, 2000);
}
// dokunuşta beklenen durumu hazırla; aç/kapat edilebilen bir cihaz değilse false
function lpOptToggle(h, id) {
  const st = h && h.states[id], d = String(id).split('.')[0];
  if (!st || LP_OPT_DOMAINS.indexOf(d) < 0 || (st.state !== 'on' && st.state !== 'off')) return false;
  const on = st.state === 'off', a = Object.assign({}, st.attributes);
  if (d === 'light') {
    if (on) Object.assign(a, lpOptMem()[id] || {});
    else ['rgb_color', 'brightness', 'hs_color', 'xy_color', 'rgbw_color', 'rgbww_color', 'color_temp', 'color_temp_kelvin', 'effect'].forEach((k) => { delete a[k]; });
  }
  LP_OPT.pend[id] = { from: st, st: Object.assign({}, st, { state: on ? 'on' : 'off', attributes: a }), until: Date.now() + LP_OPT_MS };
  return true;
}
// yedek kontrol (twins.py): lambanın yedeği ve son 30 dakikada yedek yolun kullanıldığı zaman
const lpTwinOf = (id) => { const T = STORE.data && STORE.data.twins; const r = T && T[id]; return r && typeof r.backup === 'string' ? r.backup : null; };
function lpFbAt(id) {
  const F = STORE.data && STORE.data.fallback, v = F && F[id]; if (!v) return null;
  const ms = Date.parse(v); return ms && Date.now() - ms < 30 * 60000 ? ms : null;
}
// çizimde kullanılacak durum: cevap beklenirken beklenen durum, gelince (ya da süre dolunca) gerçeği
function lpEff(S, id) {
  const p = LP_OPT.pend[id], r = S[id];
  if (!p) return r;
  if (r && Date.now() < p.until && r.state === p.from.state) return p.st;
  delete LP_OPT.pend[id];
  return r;
}

// Efekt oynayan ışık: çerçeve ve simge efektin adına göre seçilen paletle döner, hafif parlar (tablet panosundaki Govee karoları).
const LP_FX = [
  { k: 'music', d: 3, c: ['#ff3b6b', '#ffd60a', '#34c759', '#0a84ff', '#bf5af2'], t: (e) => e.slice(0, 5) === 'music' },
  { k: 'water', d: 6, c: ['#0a84ff', '#5ac8fa', '#00c7ff', '#2b6cff'], w: ['sea', 'ocean', 'lake', 'river', 'ice', 'glacier', 'snow', 'winter', 'rain', 'wave', 'ripple', 'deep', 'fog', 'cloud'] },
  { k: 'fire', d: 5, c: ['#ff453a', '#ff9f0a', '#ff6b00', '#ff2d55'], w: ['fire', 'blood', 'dracarys', 'sunset', 'sunrise', 'autumn', 'desert', 'candle'] },
  { k: 'forest', d: 6, c: ['#30d158', '#a3e635', '#00c78c', '#34c759'], w: ['forest', 'grass', 'green', 'spring', 'leaf', 'tree', 'oasis', 'mountain', 'summer'] },
  { k: 'aurora', d: 7, c: ['#bf5af2', '#5e5ce6', '#0a84ff', '#af52de'], w: ['aurora', 'night', 'moon', 'twilight', 'galaxy', 'dream', 'coven', 'arctic'] },
  { k: 'rainbow', d: 5, c: ['#ff3b30', '#ff9f0a', '#ffd60a', '#34c759', '#0a84ff', '#bf5af2'], w: ['rainbow', 'colorful', 'flower', 'cherry', 'birthday', 'bloom', 'party'] },
  { k: 'other', d: 6, c: ['#ffd60a', '#ff9f0a', '#ffe9a8'] }
];
const LP_FX_NONE = ['', 'none', 'off', 'solid', 'static', 'normal'];
function lpFx(st) {
  if (!st || st.state !== 'on') return null;
  return lpFxByName(st.attributes.effect);
}
function lpFxByName(name) {
  const ef = String(name || '').toLowerCase().replace(/^\s+|\s+$/g, '');
  if (LP_FX_NONE.indexOf(ef) >= 0) return null;
  for (let i = 0; i < LP_FX.length; i++) {
    const p = LP_FX[i];
    if (p.t ? p.t(ef) : (!p.w || p.w.some((w) => ef.indexOf(w) >= 0))) return p;
  }
  return null;
}
const LP_FX_CSS = LP_FX.map((p) => {
  let a = '', b = '';
  p.c.forEach((c, i) => {
    const pc = Math.round(i * 100 / p.c.length);
    a += pc + '%{border-color:' + c + ';box-shadow:0 0 18px -6px ' + c + '}';
    b += pc + '%{color:' + c + '}';
  });
  a += '100%{border-color:' + p.c[0] + ';box-shadow:0 0 18px -6px ' + p.c[0] + '}';
  b += '100%{color:' + p.c[0] + '}';
  return '@keyframes lpfx-' + p.k + '{' + a + '}@keyframes lpfxi-' + p.k + '{' + b + '}' +
    '.tile.fx-' + p.k + ',.bar.fx-' + p.k + '{border-color:' + p.c[0] + ';animation:lpfx-' + p.k + ' ' + p.d + 's linear infinite}' +
    '.tile.fx-' + p.k + ' ha-state-icon,.bar.fx-' + p.k + ' ha-state-icon{animation:lpfxi-' + p.k + ' ' + p.d + 's linear infinite}';
}).join('');

// Telefon görünümü: dar ekranda (700 px altı) pano ölçeklenmez; üst şerit kayar, bölümler alt alta, karolar 3'lü.
// Yönetim panelinin önizlemesi "Telefon" ekranında config.phone ile zorlar.
const LP_PHONE_W = 700;
// telefon düzeninde kartın genişliği (yönetim panelinin telefon önizlemesinde çerçevenin genişliği); geniş ekranda karo sayısı artar (karo ~120 px): 390 px'te 3, 800 px'te 6
// genişlik ölçeklemeden bağımsız (offsetWidth): yönetim panelindeki küçültülmüş telefon önizlemesi de gerçek telefon gibi sayılır
const lpPhoneW = (el) => Math.min((el && (el.offsetWidth || el.getBoundingClientRect().width)) || window.innerWidth || 390, 1100);
const lpPhoneKey = (el, cfg) => (lpIsPhone(cfg) ? 'p' + Math.floor(lpPhoneW(el) / 120) : 't');
function lpIsPhone(cfg) {
  if (cfg && typeof cfg.phone === 'boolean') return cfg.phone;
  return lpPhoneScreen();   // src/scale.js
}

// üst şeritteki Efektler düğmesi: LEC kuruluysa varsayılan açık
function lpLecNav(h) {
  const st = lpSettings();
  return LEC.installed(h) && st.lec_nav !== false;
}

// üst şerit (ayar nav): oda düğmelerinin genişliği ve yüksekliği (tuval pikseli; varsayılan 235×155, tablet panosundaki ölçü),
// cols: düğmeler ilk N kolonun genişliğini eşit paylaşır ve N. kolonun kenarında biter (0 = kapalı), fx_in: Efektler de bu alanda
function lpNavCfg() {
  const st = lpSettings(), n = lhdIsObj(st.nav) ? st.nav : {};
  const num = (v, lo, hi) => { const x = typeof v === 'string' ? parseFloat(v) : v; return typeof x === 'number' && isFinite(x) ? Math.max(lo, Math.min(hi, Math.round(x))) : null; };
  return { w: num(n.w, 80, 400), h: num(n.h, 60, 260), cols: num(n.cols, 0, 6) || 0, fx_in: n.fx_in === true };
}
// Saatte parlaklık (ayar bright, isteğe bağlı, varsayılan kapalı): üst şeritte saatin olduğu alan kaydırılınca sekmenin
// odasındaki açık ışıkların hepsi aynı parlaklığa gelir. look: yok = gizli (yalnız saat, kaydırınca belirir), 'box' = oda
// düğmesi gibi kutu; icon: true = solda ampul simgesi; value: 'always' = dolgu ve yüzde hep görünür (yoksa yalnız kaydırırken);
// phone: false = telefon düzeninde (telefon, dikey tablet) sayfa adı + saat satırı kaydırılmaz (varsayılan kaydırılır).
function lpBrightCfg() {
  const s = lpSettings(), b = lhdIsObj(s.bright) ? s.bright : {};
  return { on: b.on === true, box: b.look === 'box', icon: b.icon === true, always: b.value === 'always', phone: b.phone !== false };
}

// telefon seçenekleri (ayar phone), her biri ayrı açılır:
//   nav: 'cats' (v0.17 varsayılan: altta kategoriler: Işıklar, İklim, Senaryolar...) | 'rooms' (odalar altta) | 'top' (oda düğmeleri üstte, eski düzen)
//   lights: 'auto' (bölüm ayarındaki gibi, varsayılan) | 'tiles' (karo) | 'rows' (tek sıra, kaydırarak parlaklık)
//   sheet: ışık penceresi ekranın altından açılır (varsayılan açık; kapatılınca false saklanır)
//   flat: çerçevesiz bölümler (v0.29): telefonda bölüm kutusu çizilmez, başlık küçük etiket olur (varsayılan kapalı)
function lpPhoneCfg() {
  const st = lpSettings(), p = lhdIsObj(st.phone) ? st.phone : {};
  return { nav: p.nav === 'rooms' || p.nav === 'top' ? p.nav : 'cats', lights: p.lights === 'tiles' || p.lights === 'rows' ? p.lights : 'auto', sheet: p.sheet !== false, flat: p.flat === true };
}
// iklim kartlarının stili (ayar climate_style): 'halo' (varsayılan, Halo iklim kartı) ya da 'rows' (sade satır: durum, hedef, mod, fan, salınım)
function lpClimStyle() { const st = lpSettings(); return st.climate_style === 'rows' ? 'rows' : 'halo'; }
const LP_HVAC = {
  tr: { off: 'Kapalı', heat: 'Isıtma', cool: 'Soğutma', auto: 'Otomatik', heat_cool: 'Otomatik', dry: 'Nem alma', fan_only: 'Fan' },
  en: { off: 'Off', heat: 'Heat', cool: 'Cool', auto: 'Auto', heat_cool: 'Auto', dry: 'Dry', fan_only: 'Fan' } };
const LP_HACT = {
  tr: { heating: 'Isıtıyor', cooling: 'Soğutuyor', idle: 'Bekliyor', off: 'Kapalı', drying: 'Nem alıyor', fan: 'Fan çalışıyor', preheating: 'Isınıyor', defrosting: 'Buz çözüyor' },
  en: { heating: 'Heating', cooling: 'Cooling', idle: 'Idle', off: 'Off', drying: 'Drying', fan: 'Fan', preheating: 'Preheating', defrosting: 'Defrosting' } };
const LP_FANW = {
  tr: { auto: 'Oto', low: 'Düşük', medium: 'Orta', middle: 'Orta', mid: 'Orta', high: 'Yüksek', quiet: 'Sessiz', silent: 'Sessiz', turbo: 'Turbo', strong: 'Güçlü', on: 'Açık', off: 'Kapalı', vertical: 'Dikey', horizontal: 'Yatay', both: 'İkisi', stopped: 'Kapalı', stop: 'Kapalı', swing: 'Açık', rangefull: 'Tam', fixedtop: 'Üst', fixedmiddletop: 'Orta üst', fixedmiddle: 'Orta', fixedmiddlebottom: 'Orta alt', fixedbottom: 'Alt', standard: 'Standart', normal: 'Normal', max: 'En yüksek', min: 'En düşük', gentle: 'Hafif', balanced: 'Dengeli', mop: 'Paspas' },
  en: { auto: 'Auto', low: 'Low', medium: 'Medium', middle: 'Medium', mid: 'Medium', high: 'High', quiet: 'Quiet', silent: 'Quiet', turbo: 'Turbo', strong: 'Strong', on: 'On', off: 'Off', vertical: 'Vertical', horizontal: 'Horizontal', both: 'Both', stopped: 'Off', stop: 'Off', swing: 'On', rangefull: 'Full', fixedtop: 'Top', fixedmiddletop: 'Upper middle', fixedmiddle: 'Middle', fixedmiddlebottom: 'Lower middle', fixedbottom: 'Bottom', standard: 'Standard', normal: 'Normal', max: 'Max', min: 'Min', gentle: 'Gentle', balanced: 'Balanced', mop: 'Mop' } };
const lpClW = (map, lang, v) => {
  const d = map[lang] || map.en, k = String(v), lk = k.toLowerCase();
  if (d[k] || d[lk]) return d[k] || d[lk];
  // birleşik adlar (ör. "Medium low", "mid_high"): kelime kelime çevrilir
  const w = lk.split(/[\s_-]+/).filter(Boolean).map((x) => d[x] ? d[x].toLowerCase() : x).join(' ');
  return w.charAt(0).toUpperCase() + w.slice(1);
};
const LP_VAC = {
  tr: { docked: 'İstasyonda', cleaning: 'Temizliyor', returning: 'İstasyona dönüyor', paused: 'Duraklatıldı', idle: 'Beklemede', error: 'Hata', unavailable: 'Ulaşılamıyor' },
  en: { docked: 'Docked', cleaning: 'Cleaning', returning: 'Returning', paused: 'Paused', idle: 'Idle', error: 'Error', unavailable: 'Unavailable' } };
const lpNum = (st) => { const x = st ? parseFloat(st.state) : NaN; return isFinite(x) ? x : null; };

// kategori görünümünün durumu (hangi kategori, ışıklarda hangi oda): bütün sekme kartları paylaşır
const LP_PH = window.__LEMUR_HD_PH || (window.__LEMUR_HD_PH = { cat: null, room: null });
const LP_CATS = ['lights', 'climate', 'scenes', 'camera', 'energy', 'other'];
const LP_CAT_IC = { lights: 'mdi:lightbulb-group', climate: 'mdi:thermostat', scenes: 'lhd:scene-switch', camera: 'mdi:cctv', energy: 'mdi:lightning-bolt', other: 'mdi:view-grid-outline' };
// kamera: kamera bölümü ya da yalnız kameralardan oluşan bölüm (Kameralar kategorisi bütün sekmelerin kameralarını toplar)
const lpCamOnly = (s) => (s.entities || []).length > 0 && s.entities.every((x) => { const e = lpEnt(x); return !!e && String(e.entity).indexOf('camera.') === 0; });
// enerji: enerji bölümü ya da yalnız enerji kartlarından oluşan bölüm
const lpEnOnly = (s) => (s.entities || []).length > 0 && s.entities.every((x) => !!x && typeof x.energy === 'string');
const lpSecCat = (s) => (!s ? 'other' : s.type === 'lights' || s.type === 'climate' || s.type === 'scenes' ? s.type : s.type === 'camera' || lpCamOnly(s) ? 'camera' : s.type === 'energy' || lpEnOnly(s) ? 'energy' : 'other');
// kategori görünümü: bütün sekmelerin o türdeki bölümleri tek sayfada (her biri sekmenin adıyla). Işıklarda oda oda gezilir
// ("Tümü" bütün evin ışıkları, aynı cihaz iki sekmede varsa bir kez). Kayıtlı sekmeler değişmez, sayfa yalnız çizilirken kurulur.
function lpCatView(tabs, cur) {
  tabs = tabs.map(lhdNormTab);
  const has = (s) => (s.entities || []).length > 0 || (s._folds || []).some((F) => (F.entities || []).length > 0);   // katlanır gruplardakiler de sayılır
  const cats = LP_CATS.filter((c) => tabs.some((T) => (T.sections || []).some((s) => lpSecCat(s) === c && has(s))));
  if (!cats.length) return null;
  const cat = cats.indexOf(LP_PH.cat) >= 0 ? LP_PH.cat : cats[0];
  const rooms = cat === 'lights' ? tabs.filter((T) => (T.sections || []).some((s) => lpSecCat(s) === 'lights' && has(s))) : [];
  const roomIds = ['all'].concat(rooms.map((T) => T.id));
  const room = roomIds.indexOf(LP_PH.room) >= 0 ? LP_PH.room : (rooms.some((T) => T.id === cur.id) ? cur.id : 'all');
  const secs = [], seen = {};
  const one = cat === 'lights' && room !== 'all' ? rooms.filter((T) => T.id === room)[0] : null;
  (one ? [one] : tabs).forEach((T) => (T.sections || []).forEach((s) => {
    if (lpSecCat(s) !== cat || !has(s)) return;
    const dd = (L) => (cat !== 'scenes' && !one ? (L || []).filter((x) => { const e = lpEnt(x), k = e && e.entity; if (!k) return true; if (seen[k]) return false; seen[k] = 1; return true; }) : (L || []));
    const ents = dd(s.entities), fl = (s._folds || []).map((F) => Object.assign({}, F, { entities: dd(F.entities) })).filter((F) => F.entities.length);   // aynı cihaz gruplarda da bir kez
    if (!ents.length && !fl.length) return;
    secs.push(Object.assign({}, s, { col: 0, sub: 0, entities: ents, _folds: fl.length ? fl : null, title: one || cat === 'energy' ? s.title : (T.name || s.title) }));
  }));
  // iklim: bütün odalar tek kutuda, oda adları küçük ara başlık (Halo ya da sade satırlar)
  if (cat === 'climate' && secs.length) {
    const all = [], fl = [];
    secs.forEach((s) => { all.push({ subtitle: s.title || '', _catSub: true }); s.entities.forEach((x) => all.push(x)); (s._folds || []).forEach((F) => fl.push(F)); });
    secs.length = 0;
    secs.push({ id: 'lhd-cat-climate', type: 'climate', title: '', col: 0, sub: 0, entities: all, _folds: fl.length ? fl : null });
  }
  return { tab: { id: cur.id, name: cur.name, icon: cur.icon, area: one ? one.area || null : null, columns: [1], sections: secs }, cat: cat, cats: cats, rooms: rooms, room: room };
}

// Telefona özel ayarlar (v0.22). Sekmeler ve cihazlar tablet ile ortak; telefonda çizilirken sekmenin bir kopyası kurulur:
//   settings.phone.secs[bölüm] = { hide: true, look: 'tiles' | 'rows' | 'rows2', cols: 2-6, hide_items: [öğe anahtarı (lhdItemKey)], item_order: [öğe anahtarları],
//                                  folds: [{ name, icon, items: [öğe anahtarları] }] (katlanır gruplar, bölümün sonunda sırayla) }
//   settings.phone.tabs = { order: [sekme], hide: { sekme: true }, names: { sekme: ad }, icons: { sekme: simge } }   (oda düğmeleri)
//   settings.phone.style = { icon_style, icon_tint, climate_style, bg, background }   (lpPhoneMerge)
//   settings.phone.order[sekme] = [bölüm kimlikleri]   (telefondaki sıra; yoksa kolon kolon)
// Kopyada bütün bölümler tek kolonda (telefon zaten alt alta dizer), gizli bölümler yok. Düzenleme önizlemesinde gizli öğeler
// soluk görünür (sıra numaraları bozulmasın diye listede kalır), normal panoda hiç çizilmez. _ph işaretli kopya kaydedilmez.
// katlanır grupların açık/kapalı durumu bu tarayıcıda (localStorage lhd-fold)
function lpFoldMap() { try { const v = JSON.parse(localStorage.getItem('lhd-fold') || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; } }
function lpFoldOpen(id) { return lpFoldMap()[id] === 1; }
function lpFoldSet(id, o) { const m = lpFoldMap(); if (o) m[id] = 1; else delete m[id]; try { localStorage.setItem('lhd-fold', JSON.stringify(m)); } catch (e) {} }
function lpPhoneOv() { const p = lpSettings().phone; return lhdIsObj(p) ? p : {}; }
function lpPhoneTab(T, edit, folds) {
  if (!T) return T;
  const P = lpPhoneOv(), SO = lhdIsObj(P.secs) ? P.secs : {}, OR = lhdIsObj(P.order) ? P.order : {};
  const ord = Array.isArray(OR[T.id]) && OR[T.id].length ? OR[T.id] : null;
  // normal panoda ayar yoksa sekmenin kendisi; telefon önizlemesinde (edit) hep kopya: orada yapılan sürükleme telefona yazılır
  if (!edit && !ord && !(T.sections || []).some((s) => lhdIsObj(SO[s.id]))) return T;
  const N = lhdNormTab(T), out = [];
  lhdPhoneOrder(N, ord).forEach((s) => {
    const o = lhdIsObj(SO[s.id]) ? SO[s.id] : {};
    if (o.hide) return;
    const c = Object.assign({}, s, { col: 0, sub: 0 });
    if (Array.isArray(o.item_order) && o.item_order.length) c.entities = lhdOrderBy(s.entities || [], o.item_order, lhdItemKey);   // telefona özel öğe sırası
    if (o.look === 'tiles' || o.look === 'rows') c._phLook = o.look;
    if (o.look === 'rows2') { c._phLook = 'rows'; c._phBc = 2; }   // ikili sıra: iki çubuk yan yana (v0.29)
    const n = parseInt(o.cols, 10); if (n >= 2 && n <= 6) c._phCols = n;
    const hi = Array.isArray(o.hide_items) ? o.hide_items.filter((x) => typeof x === 'string') : [];
    if (hi.length) { if (edit) c._phHide = hi; else c.entities = (c.entities || []).filter((x) => hi.indexOf(lhdItemKey(x)) < 0); }
    // katlanır gruplar (v0.29): her grubun öğeleri bölümün sonunda, dokununca açılan bir satırda. Düzenleme önizlemesinde öğeler yerinde kalır
    const FL = Array.isArray(o.folds) ? o.folds.filter((g) => lhdIsObj(g) && Array.isArray(g.items) && g.items.length) : [];
    if (FL.length && (!edit || folds)) {   // düzenlemede de "Grupları göster" açıksa (v0.29.6)
      c._folds = [];
      FL.forEach((g, gj) => {
        const inG = (x) => g.items.indexOf(lhdItemKey(x)) >= 0, fe = (c.entities || []).filter(inG);
        c.entities = (c.entities || []).filter((x) => !inG(x));
        if (fe.length) c._folds.push(Object.assign({}, c, { title: '', entities: fe, _folds: null, _fk: s.id + '#' + gj, _foldName: typeof g.name === 'string' ? g.name : '', _foldIcon: typeof g.icon === 'string' ? g.icon : '' }));
      });
    }
    out.push(c);
  });
  return Object.assign({}, N, { v: 2, sections: out, _ph: true });
}

// Mevsim: ayarda yoksa aya göre (Mayıs-Eylül yaz). Kış'ta petek, Yaz'da klima kartları.
function lpSeason() {
  const s = lpSettings().season;
  if (s === 'summer' || s === 'winter') return s;
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 9 ? 'summer' : 'winter';
}

// Öğe boyutu (size): karonun ızgarada kapladığı hücre. '1x1' (varsayılan), '2x1', '1x2', '2x2', 'row' (satır boyu)
function lpSpan(it, c) {
  const z = String((it && it.size) || '');
  if (z === 'row') return [c, 1];
  const m = /^([1-3])x([1-3])$/.exec(z);
  return m ? [Math.min(+m[1], c), +m[2]] : [1, 1];
}
// Izgaranın satır sayısı: öğeler sırayla, boşlukları dolduran (dense) yerleşimle; hepsi 1x1 ise ceil(n / c)
function lpGridRows(items, c) {
  const occ = [];
  const free = (r, x, w, h) => { for (let j = r; j < r + h; j++) for (let i = x; i < x + w; i++) if (occ[j] && occ[j][i]) return false; return true; };
  let rows = 0;
  items.forEach((it) => {
    const sp = lpSpan(it, c), w = sp[0], h = sp[1];
    for (let r = 0; ; r++) {
      let done = false;
      for (let x = 0; x + w <= c; x++) if (free(r, x, w, h)) {
        for (let j = r; j < r + h; j++) { occ[j] = occ[j] || []; for (let i = x; i < x + w; i++) occ[j][i] = 1; }
        rows = Math.max(rows, r + h); done = true; break;
      }
      if (done) break;
    }
  });
  return rows;
}
// Simge ve yazı boyutu (icon_size / text_size: 's' | 'm' | 'l'; yoksa bugünkü ölçü). Öğenin style'ına CSS değişkeni olarak yazılır.
const LP_ICW = { row: { s: '18px', m: '22px', l: '28px' }, tile: { s: '28%', m: '40%', l: '56%' }, val: { s: '24%', m: '32%', l: '46%' }, bar: { s: '24px', m: '34px', l: '46px' }, scene: { s: '28px', m: '40px', l: '58px' } };
const LP_FS = { row: { s: 13, m: 15, l: 18 }, tile: { s: 13, m: 16, l: 20 }, val: { s: 14, m: 17, l: 22 }, bar: { s: 14, m: 17, l: 21 }, scene: { s: 15, m: 18, l: 23 } };
function lpItemStyle(it, kind, c) {
  let st = '';
  if (c) { const sp = lpSpan(it, c); if (it.size === 'row') st += 'grid-column:1/-1;'; else { if (sp[0] > 1) st += 'grid-column:span ' + sp[0] + ';'; if (sp[1] > 1) st += 'grid-row:span ' + sp[1] + ';'; } }
  if (c && lpWide(it, c) && it.icon_size && LP_ICWP[it.icon_size]) st += '--lp-icwp:' + LP_ICWP[it.icon_size] + ';';
  if (it.icon_size && LP_ICW[kind][it.icon_size]) st += '--lp-icw:' + LP_ICW[kind][it.icon_size] + ';';
  if (it.text_size && LP_FS[kind][it.text_size]) st += '--lp-fs:' + LP_FS[kind][it.text_size] + 'px;';
  return st;
}
const LP_HALO_DOMAINS = ['sensor', 'number', 'input_number'];
// gömülü kartın (Halo görünümü, kart öğesi) yüksekliği: height = '1' | '1.5' | '2' satır
const LP_EMB_H = { 1: 96, 1.5: 144, 2: 192 };
// Halo kartının yazı ve simge boyutu (öğenin text_size / icon_size), kartın içine eklenen stil
function lpHaloStyle(it) {
  const T = { s: [13, 11], m: [16, 13.5], l: [20, 16] }[it.text_size], I = { s: [56, 32], m: [74, 44], l: [90, 54] }[it.icon_size];
  let css = ':host{height:100%}ha-card{height:100%;box-sizing:border-box}.compact .top{height:100%;min-height:80px}';
  if (T) css += '.name{font-size:' + T[0] + 'px;line-height:' + Math.round(T[0] * 1.4) + 'px}.sec{font-size:' + T[1] + 'px;line-height:' + Math.round(T[1] * 1.35) + 'px;max-height:none}';
  if (I) css += '.ic{width:' + I[0] + 'px;height:' + I[0] + 'px;--mdc-icon-size:' + I[1] + 'px}.ic svg{width:' + I[1] + 'px;height:' + I[1] + 'px}.txt{left:' + (I[0] + 12) + 'px}';
  return css;
}
// A4 öğe renkleri. zones: { t: [4 sınır], c: [5 renk] } (Halo kartlarındaki bölge mantığı): değer t[k]'ye eşit ya da büyükse bir üst bölge
function lpZone(it, st) {
  const z = it && it.zones; if (!z || !st) return null;
  const v = parseFloat(st.state); if (isNaN(v)) return null;
  const T = z.t || [], C = z.c || [];
  let i = 0;
  for (let k = 0; k < 4; k++) { const x = parseFloat(T[k]); if (!isNaN(x) && v >= x) i = k + 1; }
  return C[i] || null;
}
// duruma göre renk: state_colors = { entity (verilmezse öğenin varlığı), map: { durum: renk } }
function lpMapColor(it, S) {
  const m = it && it.state_colors; if (!m || typeof m !== 'object' || !m.map) return null;
  const id = m.entity || it.entity, st = id && S ? S[id] : null;
  return st ? (m.map[st.state] || null) : null;
}
// Halo kartının hale rengi (Halo'nun kendi renk adlarıyla da verilebilir: green, blue...)
const LP_HALO_RGB = { green: '#28BE64', blue: '#008CFF', ice: '#78D7FF', yellow: '#FFCD28', orange: '#FF8C1E', red: '#FF3737', purple: '#A064FF', grey: '#969696' };
function lpHexA(c, a) { const m = /^#?([0-9a-f]{6})$/i.exec(String(c || '')); if (!m) return c; const n = parseInt(m[1], 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
// geniş ve tek satır yüksekliğindeki karo (2x1, satır boyu): simge ve yazı yan yana
const lpWide = (it, c) => { const sp = lpSpan(it, c); return sp[0] >= 2 && sp[1] === 1 && c >= 2; };
const LP_ICWP = { s: '28px', m: '40px', l: '56px' };
const lpStyleA = (st) => (st ? ' style="' + st + '"' : '');
// Değer karosu: açık/kapalı durumu olan alanlar ve "açık" sayılan durumları
const LP_VAL_ONOFF = ['binary_sensor', 'timer', 'person', 'device_tracker', 'update', 'calendar'];
const LP_VAL_ON = ['on', 'active', 'home', 'open'];
function lpDur(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60, p = (n) => (n < 10 ? '0' : '') + n;
  return h ? h + ':' + p(m) + ':' + p(s) : m + ':' + p(s);
}
function lpDurParse(x) { const p = String(x || '').split(':').map(Number); if (p.some(isNaN) || !p.length) return null; return p.reduce((a, b) => a * 60 + b, 0); }
// Değer metni: HA'nın kendi biçimi (çeviri, birim, ondalık) varsa o; yoksa durum + birim. Çalışan zamanlayıcıda kalan süre.
function lpValText(h, st, lang) {
  const a = st.attributes || {}, d = st.entity_id.split('.')[0];
  if (d === 'timer' && st.state === 'active') {
    let left = null;
    if (a.finishes_at) left = (Date.parse(a.finishes_at) - Date.now()) / 1000;
    else { const r = lpDurParse(a.remaining); if (r !== null) left = r - (Date.now() - Date.parse(st.last_changed || st.last_updated || '')) / 1000; }
    if (left !== null && !isNaN(left)) return lpDur(left);
  }
  if (st.state === 'unavailable') return t(lang, 'unavailable');
  if (h && typeof h.formatEntityState === 'function') { try { const v = h.formatEntityState(st); if (v !== undefined && v !== null && v !== '') return String(v); } catch (e) {} }
  if (st.state === 'unknown') return '—';
  const s = TXT[lang] && TXT[lang][st.state] ? t(lang, st.state) : st.state;
  return a.unit_of_measurement ? s + ' ' + a.unit_of_measurement : s;
}

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._sig = null; if (this._hass) this._render(); }
  // ışık penceresi; önizlemede (demo) ekran yerine önizleme kutusunda, seçilen telefon/alttan ayarıyla açılır
  _popOpen(h, id, item, room) {
    const c = this._config;
    if (!c.demo || !c.demo_mount) return LemurLightPopup.open(h, id, item, room);
    const ph = lpIsPhone(c), ds = c.demo_settings || {}, pc = lhdIsObj(ds.phone) ? ds.phone : {};
    return LemurLightPopup.open(h, id, item, room, { mount: c.demo_mount, phone: ph, sheet: ph && pc.sheet !== false });
  }
  _covOpen(h, id, item) {
    const c = this._config;
    if (!c.demo || !c.demo_mount) return LemurCoverPopup.open(h, id, item);
    const ph = lpIsPhone(c), ds = c.demo_settings || {}, pc = lhdIsObj(ds.phone) ? ds.phone : {};
    return LemurCoverPopup.open(h, id, item, { mount: c.demo_mount, phone: ph, sheet: ph && pc.sheet !== false });
  }
  // önizlemede bir ışığın penceresini aç (yanan ışık öncelikli)
  lhdDemoPop() {
    const R = this.shadowRoot; if (!R || !this._hass) return;
    const L = Array.prototype.slice.call(R.querySelectorAll('[data-light]')).filter((b) => /^light\./.test(b.getAttribute('data-light')));
    const S = this._hass.states, b = L.filter((x) => (S[x.getAttribute('data-light')] || {}).state === 'on')[0] || L[0];
    if (b) this._popOpen(this._hass, b.getAttribute('data-light'), b._item, null);
  }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    if (h && !(this._config && this._config.demo) && lpEnVirtUsed()) { lpEnEnsure(h); h = lpEnVirt(h); }   // enerji değerleri (sanal sensörler) panoda kullanılıyorsa
    this._hass = h;
    // Otomatik kur önizlemesi (hayali ev): sahte hass ile çizilir, panonun kayıtlı verisine ve LEC'e dokunulmaz
    if (first && this._config && this._config.demo) { this._render(); return; }
    if (first) { LEC.load(h); STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    LemurLightPopup.update(h);
    LemurCardPopup.update(h);
    if (!this._sig) return;
    (this._embeds || []).forEach((e) => { e.hass = h; });
    if (this._ens && this._ens.length) { const L = this._enIds || []; for (let i = 0; i < L.length; i++) if (h.states[L[i]] !== this._enLast[L[i]]) { this._enPaint(false); break; } }
    const w = this._watched || [];
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
    const m = this._missing || [];
    for (let i = 0; i < m.length; i++) if (h.states[m[i]]) { this._render(); return; }
  }
  connectedCallback() {
    // yeni sürüm uyarısı (src/store.js): yalnız gerçek pano sayar, yönetim panelindeki önizleme kartı saymaz
    if (!this._nw && !(this._config && this._config.demo)) { this._nw = 1; lhdNewerUse(true, this._hass ? pickLang(this._hass) : null); }
    if (!this._unsub) this._unsub = STORE.onChange((d) => {
      this._def = null;
      const st = (d && d.settings) || {};
      if (!this._config.edit && !this._config.demo) LemurScale.set(st.canvas || null, st.kiosk || null, lpBgBase(lpPhoneScreen() ? lpPhoneMerge(st) : st));   // ölçek ve kiosk ayarı canlı değişsin
      this._render();
    });
    if (!this._lecUnsub) this._lecUnsub = LEC.onChange((kind) => {
      if (kind === 'rooms') { this._sig = null; this._render(); return; }
      if (kind === 'effects' || kind === 'info') return;   // oda listesi değişti: izlenen ışıklar değişir
      this._last = {}; if (this._sig) this._update();                       // oynayan efekt değişti: karolar ve düğmeler
    });
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => this._render());   // LEC simgeleri yüklendi
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { this._sig = null; this._render(); });   // renkli simge seti yüklendi
    if (!this._enUnsub) this._enUnsub = lpEnSub(() => { if (this._ens && this._ens.length) this._enPaint(true); this._enDot(); });   // enerji verisi yüklendi
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    // ekran döndürülünce ya da pencere daralınca telefon ↔ tablet görünümü
    if (!this._rsz) { this._rsz = () => { const p = lpPhoneKey(this, this._config); if (p !== this._phone) { this._phone = p; this._sig = null; this._render(); } }; window.addEventListener('resize', this._rsz); }
    this._phone = lpPhoneKey(this, this._config);
    if (this._hass) this._render();
  }
  disconnectedCallback() {
    if (this._nw) { this._nw = 0; lhdNewerUse(false); }
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._leciUnsub) { this._leciUnsub(); this._leciUnsub = null; }
    if (this._mdicUnsub) { this._mdicUnsub(); this._mdicUnsub = null; }
    if (this._enUnsub) { this._enUnsub(); this._enUnsub = null; }
    clearTimeout(this._enT); this._enT = null;
    clearInterval(this._tipT); this._tipT = null;
    clearInterval(this._clock); this._clock = null;
    clearInterval(this._tmr); this._tmr = null;
    clearInterval(this._camT); this._camT = null;
    if (this._rsz) { window.removeEventListener('resize', this._rsz); this._rsz = null; }
    if (this._edMove) { window.removeEventListener('pointermove', this._edMove); window.removeEventListener('pointerup', this._edUp); window.removeEventListener('pointercancel', this._edUp); this._edMove = null; }
    if (this._edRO) { this._edRO.disconnect(); this._edRO = null; }
    this._sig = null;   // geri takılınca baştan kurulsun (dinleyiciler yeniden bağlansın)
  }

  _tabs() {
    if (this._config && this._config.demo) return this._config.demo_tabs || [];
    const d = STORE.data;
    if (d && d.tabs && d.tabs.length) return d.tabs;
    if (!this._def) this._def = buildDefaultTabs(this._hass, pickLang(this._hass));
    return this._def;
  }
  _tick() {
    const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time();
    (this._pets || []).forEach((el) => lpPetPaint(el, this._lang, Date.now()));   // "2 sa önce", durum rengi
    if (this._ticks % 4 === 0 && this._hasAgo) this._repaint();                       // "son değişim" ikinci satırları
    if (this._ticks % 4 === 3 && this._ens && this._ens.length) this._enPaint(true);  // enerji: dakikada bir (veri 5 dk'da bir tazelenir)
    if (this._ticks % 4 === 1) this._enDot();
    this._ticks = (this._ticks || 0) + 1;
    if (this._ticks % 20 === 0 && this._def && this._hass) { this._def = null; this._render(); }   // otomatik düzen 5 dk'da bir tazelenir
  }
  _time() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  _render() {
    if (!this._hass) return;
    // önizleme kartı kendi ayarlarıyla çizilir (bu kartın çizimi bitince panonun ayarlarına dönülür)
    if (this._config && this._config.demo) { LP_OVR.s = this._config.demo_settings || {}; try { this._render0(); } finally { LP_OVR.s = null; } return; }
    // telefonda telefona özel görünüm (simge stili, iklim kartları, zemin) genel ayarların yerine geçer
    if (lpIsPhone(this._config)) { const b = lpSettings(), m = lpPhoneMerge(b); if (m !== b) { LP_OVR.s = m; try { this._render0(); } finally { LP_OVR.s = null; } return; } }
    this._render0();
  }
  _render0() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states, lang = pickLang(h);
    if (this._nw) LHD_NEWER.lang = lang;
    let tabs = this._tabs(), allTabs = tabs;
    // telefonda (ve telefon önizlemesinde) sekmeler telefona özel ayarlarla kurulur; oda düğmeleri telefona özel sırada,
    // gizlenen sekmeler şeritte yok (doğrudan açılırsa yine çizilir), ad ve simge telefona özel olabilir
    if (lpIsPhone(this._config)) {
      const ed = !!(this._config && this._config.edit), PT = lhdIsObj(lpPhoneOv().tabs) ? lpPhoneOv().tabs : {};
      const NM = lhdIsObj(PT.names) ? PT.names : {}, IC = lhdIsObj(PT.icons) ? PT.icons : {}, HD = lhdIsObj(PT.hide) ? PT.hide : {};
      allTabs = tabs.map((T) => { let x = lpPhoneTab(T, ed, !!(this._config && this._config.folds)); if ((typeof NM[T.id] === 'string' && NM[T.id]) || (typeof IC[T.id] === 'string' && IC[T.id])) x = Object.assign({}, x, NM[T.id] ? { name: NM[T.id] } : {}, IC[T.id] ? { icon: IC[T.id] } : {}); return x; });
      const vis = lhdOrderBy(allTabs.filter((T) => !HD[T.id]), PT.order);
      tabs = vis.length ? vis : allTabs;
    }
    const tab = allTabs.filter((x) => x.id === (this._config && this._config.tab))[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; this._sig = null; return; }
    const season = lpSeason();
    // telefonda altta kategoriler: sayfa bütün sekmelerden kurulur (düzenleme önizlemesinde değil)
    // düzenleme önizlemesinde de telefon seçenekleri görünür; kategori sayfası yerine sekmenin kendisi düzenlenir
    const pc = lpPhoneCfg(), ph = lpIsPhone(this._config) && !this._config.edit;
    this._cat = ph && pc.nav === 'cats' ? lpCatView(tabs, tab) : null;
    const view = this._cat ? this._cat.tab : tab;
    // iskeleti değiştiren her şey: sekme ayarı, mevsim, dil, var olan cihazlar
    const present = [], vis = [];
    const allOf = (s) => (s.entities || []).concat.apply(s.entities || [], (s._folds || []).map((F) => F.entities || []));   // katlanır gruplardakiler de
    (view.sections || []).forEach((s) => allOf(s).forEach((x) => {
      const e = lpEnt(x); if (e && S[e.entity]) present.push(e.entity);
      if (x && x.visible) vis.push(lpVisible(x.visible, S));   // koşullu öğe: koşul değişince iskelet yeniden kurulur
      if (x && x.state_colors) vis.push(lpMapColor(x, S));      // duruma göre renk (Halo kartı yeniden kurulur)
    }));
    const sig = JSON.stringify([view, pc, this._cat ? [this._cat.cat, this._cat.room] : 0, season, lang, present, vis, tabs.map((x) => [x.id, x.name, x.icon]), lpHas('lemur-hd-climate-card'), LEC.installed(h), lpLecNav(h), lpIsPhone(this._config), !!this._config.edit, this._config.selected || '', !!LP_LECI.map, lpIconMode(), lpIconTint(), lpIconTintLight(), !!LP_MDIC.map, lpNavCfg(), lpClimStyle(), lpBrightCfg(), lpEnBadge()]);
    if (sig !== this._sig) { this._sig = sig; this._build(view, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    tab = lhdNormTab(tab);
    const h = this._hass, S = h.states;
    if (this.getAttribute('lang') !== lang) this.setAttribute('lang', lang);
    const tiles = [], tileItems = [], rows = [], embeds = [], vals = [], cards = [], visW = [], ssItems = [], clrs = [], cams = [], ens = [];
    // şablonlu (A6) sabit yazılar: yer tutucu span, _update'te doldurulur
    const txs = (s) => (lpIsTpl(s) ? '<span data-tx="' + esc(s) + '">…</span>' : esc(s));
    const lecRooms = {};   // bu sekmede LEC'ten oynayan efekti sorulacak odalar
    // ayarda olup şu an HA'da olmayan cihazlar: gelince (ör. HA yeniden başladıktan sonra) pano yeniden kurulur
    this._missing = [];
    (tab.sections || []).forEach((s) => (s.entities || []).concat.apply(s.entities || [], (s._folds || []).map((F) => F.entities || [])).forEach((x) => { const e = lpEnt(x); if (e && !S[e.entity]) this._missing.push(e.entity); }));
    const edit = !!this._config.edit, selected = this._config.selected || '';
    const phone = lpIsPhone(this._config);
    let curSec = '';
    // her öğe hangi bölümün kaçıncı öğesi: düzenleme modunda sürükle-bırak için
    const mark = (i) => ' data-sec="' + esc(curSec) + '" data-idx="' + i + '"';
    // düzenleme modunda koşulu şu an sağlanmayan öğe soluk görünür (normal panoda hiç çizilmez, yer kaplamaz)
    const hidA = (it) => (it._hid ? ' data-hid="1"' : '');
    // değer karosu (sensör, zamanlayıcı...): simge, değer, ad. Çubuk görünümünde yatay çubuk
    const valTile = (it, bar, c) => {
      vals.push(it);
      const ic = lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>';
      if (bar) return '<div class="bar val" data-val="' + esc(it.entity) + '" data-vi="' + (vals.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'bar', c)) + hidA(it) + mark(it._i) + '>' + ic + '<div class="bt"><div class="nm"></div><div class="pc"></div></div></div>';
      return '<div class="tile val' + (lpEnIsVal(it.entity) ? ' entl' : '') + (c && lpWide(it, c) ? ' wide" data-wide="1' : '') + '" data-val="' + esc(it.entity) + '" data-vi="' + (vals.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'val', c)) + hidA(it) + mark(it._i) + '>' + ic + '<div class="vl"></div><div class="nm"></div>' + (it.secondary ? '<div class="sl"></div>' : '') + '</div>';
    };
    const emb = (tag, cfg, id, i, it) => {
      if (!lpHas(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"' + mark(i) + '></div>'; }
      embeds.push({ tag: tag, cfg: Object.assign({ language: lang }, cfg), it: it || null });
      return '<div class="emb' + (it && LP_EMB_H[it.height] ? ' hfix' : '') + '" data-emb="' + (embeds.length - 1) + '"' + (it && LP_EMB_H[it.height] ? ' style="min-height:' + LP_EMB_H[it.height] + 'px"' : '') + (it ? hidA(it) : '') + mark(i) + '></div>';
    };
    // görünümü değiştirilmiş varlık öğesi (düğme ya da satır): simge, ad, değer/durum. _paintEnt çizer
    const ents = [];
    const entEl = (it, look) => {
      ents.push(it);
      const ei = ' data-ent="' + esc(it.entity) + '" data-ei="' + (ents.length - 1) + '"' + hidA(it) + mark(it._i);
      const ic = lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>';
      if (look === 'row') return '<div class="vrow"' + lpStyleA(lpItemStyle(it, 'row', 0)) + ei + '>' + ic + '<span class="rn"></span><span class="rv"></span></div>';
      return '<div class="scene ebtn"' + lpStyleA(lpItemStyle(it, 'scene', 0)) + ei + '><div class="si">' + ic + '</div><div class="sb"><b class="sn"></b><i class="sv"></i></div></div>';
    };
    // eylem öğesi (düğme) karo ya da satır görünümünde: dokununca düğme gibi çalışır (data-scene)
    const actEl = (s, it, look, c) => {
      const st = it.entity ? S[it.entity] : null, cc = it.color || '#5B8DEF';
      const name = it.name || (st ? st.attributes.friendly_name || it.entity : '');
      const icon = it.icon || (st && st.attributes.icon) || 'mdi:play';
      const ic = lpIcon(icon, 'acti', 'color:' + esc(cc));
      if (look === 'row') return '<div class="vrow act" style="--sc:' + esc(cc) + ';' + lpItemStyle(it, 'row', 0) + '" data-scene="' + esc(s._fk || s.id) + ':' + it._i + '"' + hidA(it) + mark(it._i) + '>' + ic + '<span class="rn">' + txs(name) + '</span></div>';
      return '<div class="tile act" style="--sc:' + esc(cc) + ';' + lpItemStyle(it, 'tile', c) + '" data-scene="' + esc(s._fk || s.id) + ':' + it._i + '"' + hidA(it) + mark(it._i) + '>' + ic + '<div class="nm">' + txs(name) + '</div></div>';
    };
    const withIdx = (arr, norm) => (arr || []).map((x, i) => { const e = norm(x); return e ? Object.assign({ _i: i }, e) : null; }).filter(Boolean);
    // Bölüm serbest: öğeler sırayla, kendi türüne göre çizilir. Art arda gelen aynı türden öğeler bir grup olur:
    // karolar (ışık, priz, perde, fan... ve boş karo) bir ızgara, senaryo düğmeleri, iklim/süpürge kartları ve medya satırları alt alta.
    // Bölümde sadece karo varsa ızgara kutuyu doldurur (tablet panosundaki gibi); başka öğelerle birlikteyse karolar kare kalır.
    const tileGrid = (s, items, only) => {
      // Karo sayısı ayardaki kadar, ama sütun daraldıysa karolar 70 px'ten küçülmesin diye azalır (kanvas en az W piksel geniş)
      const cw = ((STORE.data && STORE.data.settings && STORE.data.settings.canvas) || {}).width || 1280;
      const sumW = widths.reduce((a, b) => a + b, 0), ci = Math.max(0, Math.min(widths.length - 1, s.col || 0));
      const inner = (cw - 8 - 20 * widths.length) * widths[ci] / sumW / splits[ci] - 12 - 40;
      // kaydırmalı çubuklar: bölüm ayarı look = 'bar' (her yerde) ya da 'phone' (telefonda otomatik)
      // telefon seçeneği Işıklar: Tek sıra (her öğe bir satır, kaydırarak parlaklık) ya da Karo; yoksa bölümün ayarı
      const pl = phone ? (s._phLook || lpPhoneCfg().lights) : 'auto';   // bölümün telefona özel görünümü önce gelir
      if (pl === 'rows' || (pl !== 'tiles' && (s.look === 'bar' || (s.look === 'phone' && phone)))) {
        const want = s.bar_columns || (items.length > 12 ? 3 : 2), bc = pl === 'rows' ? (s._phBc || 1) : phone ? Math.min(want, 2) : Math.max(1, Math.min(want, Math.floor((inner + 8) / 158)));
        // tablette satırlar kutuyu doldurur ama bir çubuk kutunun altıda birinden uzun olmaz; telefonda ya da başka öğelerle birlikteyken sabit yükseklik
        const br = Math.max(6, lpGridRows(items, bc)), fillB = only && !phone;
        const dense = items.some((x) => x.size) ? ';grid-auto-flow:row dense' : '';
        return '<div class="bars' + (fillB ? '' : ' fixed') + '" data-sec="' + esc(s.id) + '" style="grid-template-columns:repeat(' + bc + ',minmax(0,1fr))' + (fillB ? ';grid-template-rows:repeat(' + br + ',minmax(60px,1fr))' : '') + dense + (typeof s.gap === 'number' ? ';grid-gap:' + s.gap + 'px' : '') + '">' +
          items.map((it) => {
            if (it._val) return valTile(it, true, bc);
            if (it._act) return actEl(s, it, 'tile', bc);
            if (!it.entity) return '<div class="bar ph"' + lpStyleA(lpItemStyle(it, 'bar', bc)) + hidA(it) + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="bt"><div class="nm">' + esc(it.name || '') + '</div></div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="bar" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'bar', bc)) + hidA(it) + mark(it._i) + '><div class="bf"></div>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>') + '<div class="bt"><div class="nm"></div><div class="pc"></div></div></div>';
          }).join('') + '</div>';
      }
      // 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
      // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
      const c = phone ? (s._phCols || Math.max(Math.min(s.tile_columns || 5, 3), Math.min(8, Math.floor(lpPhoneW(this) / 120)))) : Math.max(1, Math.min(s.tile_columns || 5, Math.floor((inner + 8) / 78))), r = lpGridRows(items, c), fill = !phone && (r >= 4 || !!s.fill);
      // başka öğelerle aynı kutudaysa karolar kalan yeri doldurur, gerekirse kısalır (kartlar kendi yüksekliğinde kalır)
      const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? (only ? 'minmax(84px,1fr)' : 'minmax(56px,1fr)') : '1fr') + ')' + (items.some((x) => x.size) ? ';grid-auto-flow:row dense' : '');
      const G = typeof s.gap === 'number' ? s.gap : 8, gs2 = gs + (typeof s.gap === 'number' ? ';grid-gap:' + G + 'px' : '');   // bölüm ayarı Aralık
      const open = fill ? '<div class="grid" data-sec="' + esc(s.id) + '" style="' + gs2 + '">'
        : '<div class="gsq" data-sec="' + esc(s.id) + '" style="padding-bottom:calc((100% - ' + (G * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (G * (r - 1)) + 'px)"><div class="grid" style="' + gs2 + '">';
      return open + items.map((it) => {
        if (it._val) return valTile(it, false, c);
        if (it._act) return actEl(s, it, 'tile', c);
        if (!it.entity) return '<div class="tile ph"' + lpStyleA(lpItemStyle(it, 'tile', c)) + hidA(it) + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="nm">' + esc(it.name || '') + '</div></div>';
        tiles.push(it.entity); tileItems.push(it);
        return '<div class="tile' + (lpWide(it, c) ? ' wide" data-wide="1' : '') + '" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'tile', c)) + hidA(it) + mark(it._i) + '>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>') + '<div class="nm"></div>' + (it.secondary ? '<div class="sl"></div>' : '') + '</div>';
      }).join('') + (fill ? '</div>' : '</div></div>');
    };
    const sceneBtn = (s, it, i) => {
      const lecOn = LEC.installed(h), k = lpLecKind(it), c = it.color || '#5B8DEF';
      let lec = '';
      if (k) {
        const room = k === 'open' ? (it.action.room || tab.area || '') : ((it.action.data && it.action.data.room) || '');
        if (room) lecRooms[room] = 1;
        lec = ' data-lk="' + esc(k) + '" data-lroom="' + esc(room) + '" data-lfx="' + esc((it.action.data && it.action.data.effect) || '') + '"';
      }
      const st = it.entity ? S[it.entity] : null;
      const name = it.name || (st ? st.attributes.friendly_name || it.entity : '');
      const icon = it.icon || (st && st.attributes.icon) || 'mdi:play';
      return '<div class="scene' + (k ? ' lec' + (lecOn ? '' : ' na') : '') + '" style="--sc:' + esc(c) + ';' + lpItemStyle(it, 'scene', 0) + '" data-scene="' + esc(s._fk || s.id) + ':' + i + '"' + lec + hidA(it) + mark(i) + '><div class="si">' + lpIcon(icon, '', 'color:' + esc(c)) + '</div>' +
        (it.secondary ? '<span class="s2w"><b>' + txs(name) + '</b><i class="ss" data-ss="' + (ssItems.push(it) - 1) + '"></i></span>' : '<span>' + txs(name) + '</span>') + '</div>';
    };
    const bodyOf = (s) => {
      const lecOn = LEC.installed(h);
      const all = (s.entities || []).map((x, i) => {
        const k = lhdKind(x); if (!k) return null;
        const it = typeof x === 'string' ? { entity: x } : x;
        if (it.entity && !S[it.entity]) return null;                                // HA'da (şimdilik) yok
        if (k === 'scene' && lpLecKind(it) && !lecOn && !edit) return null;          // LEC kurulu değilse LEC düğmesi görünmez
        if (it.visible && it.visible.entity && visW.indexOf(it.visible.entity) < 0) visW.push(it.visible.entity);
        const sce = it.state_colors && (it.state_colors.entity || it.entity);
        if (sce && visW.indexOf(sce) < 0) visW.push(sce);
        // telefonda gizlenen öğe (yalnız telefon düzenleme önizlemesinde listede kalır) koşulu sağlanmayan öğe gibi soluk görünür
        const hid = (!!s._phHide && s._phHide.indexOf(lhdItemKey(x)) >= 0) || (!!it.visible && !lpVisible(it.visible, S));
        if (hid && !edit) return null;                                              // koşul sağlanmıyor: çizilmez, boşluk kalmaz
        // görünüm (look): eylem öğesi karo/satır, varlık öğesi düğme/satır, değer öğesi Halo kartı. Verilmezse türünün bugünkü görünümü
        const lk = it.look, d0 = it.entity ? it.entity.split('.')[0] : '';
        const base = { _i: i, _hid: hid };
        if (k === 'scene' && lk === 'tile') return Object.assign(base, { _k: 'tile', _act: true }, it);
        if (k === 'scene' && lk === 'row') return Object.assign(base, { _k: 'vrow', _act: true }, it);
        if ((k === 'value' || k === 'tile') && it.entity && (lk === 'button' || lk === 'row')) return Object.assign(base, { _k: lk === 'row' ? 'vrow' : 'ebtn', _val: k === 'value' }, it);
        if (k === 'value' && lk === 'halo' && LP_HALO_DOMAINS.indexOf(d0) >= 0) return Object.assign(base, { _k: 'halo' }, it);
        if (k === 'energy') return LP_EN_TYPES.indexOf(it.energy) >= 0 ? Object.assign(base, it, { _k: 'energy' }) : null;
        return Object.assign(base, { _k: k === 'ph' || k === 'value' ? 'tile' : k, _val: k === 'value' }, it);
      }).filter(Boolean);
      if (!all.length) return null;
      // iklim: bölümde hem klima hem petek varsa mevsime göre biri gösterilir (başlıkta Yaz/Kış düğmesi)
      const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
      const cl = all.filter((x) => x._k === 'climate'), both = cl.some(isAC) && cl.some((x) => !isAC(x));
      const items0 = both ? all.filter((x) => x._k !== 'climate' || (season === 'winter' ? !isAC(x) : isAC(x))) : all;
      // kategori sayfasının oda ara başlığı: altında (mevsime göre) cihaz kalmadıysa çizilmez
      const items = items0.filter((x, i, arr) => !x._catSub || (arr[i + 1] && !arr[i + 1]._catSub));
      if (!items.length) return null;
      const groups = [];
      items.forEach((x) => { const g = groups[groups.length - 1]; if (g && g.k === x._k && (x._k === 'tile' || x._k === 'vrow' || x._k === 'pet' || x._k === 'camera')) g.items.push(x); else groups.push({ k: x._k, items: [x] }); });
      const hasTiles = groups.some((g) => g.k === 'tile'), onlyTiles = groups.length === 1 && hasTiles;
      const html = groups.map((g) => {
        if (g.k === 'tile') return tileGrid(s, g.items, onlyTiles);
        // besleme kartları: kutuya sığdığı kadar yan yana (en az 220 px)
        // kameralar: anlık görüntü karosu (16:9); kutuya sığdığı kadar yan yana, her biri en az 240 px (telefonda tek sütun). Dokununca canlı görüntü penceresi
        // "Satırda kaç kamera" (s.cam_columns 1-4) seçiliyse o kadar; telefonda en fazla 2
        const camN = Math.max(0, Math.min(4, +s.cam_columns || 0)), camP = phone ? Math.min(camN || 1, 2) : camN;
        if (g.k === 'camera') return '<div class="cams" style="grid-template-columns:' + (camP ? 'repeat(' + camP + ',minmax(0,1fr))' : 'repeat(auto-fit,minmax(240px,1fr))') + '">' +
          g.items.map((x) => { cams.push(Object.assign({}, x, { _secRef: s.cam_refresh })); return '<div class="cam" data-cam="' + esc(x.entity) + '" data-cmi="' + (cams.length - 1) + '"' + hidA(x) + mark(x._i) + '><img alt="" draggable="false"><div class="cof">' + lpIcon('mdi:video-off') + '<span class="c0">' + esc(t(lang, 'cam_off')) + '</span><span class="c1">' + esc(t(lang, 'cam_nopic')) + '</span></div><div class="cnm"></div></div>'; }).join('') + '</div>';
        if (g.k === 'pet') return '<div class="pets">' + g.items.map((x) => '<div class="petc" data-pet="' + esc(x.pet) + '"' + hidA(x) + mark(x._i) + '></div>').join('') + '</div>';
        // satırlar: ince yatay satırlar, kutuya sığdığı kadar yan yana (en az 170 px)
        if (g.k === 'vrow') return '<div class="vrows" style="grid-template-columns:repeat(' + (phone ? 1 : Math.max(1, Math.min(s.row_columns || 3, g.items.length))) + ',minmax(0,1fr))">' +
          g.items.map((x) => (x._act ? actEl(s, x, 'row') : entEl(x, 'row'))).join('') + '</div>';
        return g.items.map((x) => {
          if (x._k === 'scene') return sceneBtn(s, x, x._i);
          if (x._k === 'ebtn') return entEl(x, 'button');
          if (x._k === 'halo') {
            const hc = { type: 'custom:lemur-hd-sensor-card', entity: x.entity };
            if (x.name) hc.name = x.name;
            if (x.icon && !lpIsLecIcon(x.icon)) hc.icon = x.icon;
            if (lpEnIsVal(x.entity)) { const ex = Array.isArray(x.extra) ? x.extra : lpEnHaloExtra(x.entity, S); if (ex.length) hc.extra = ex; }   // enerji değeri: altında ilgili değerler, iklim kartı boyunda
            const hcol = lpMapColor(x, S) || x.color;                       // sabit renk ya da duruma göre renk
            if (hcol) hc.color = LP_HALO_RGB[hcol] || hcol;
            return emb('lemur-hd-sensor-card', hc, x.entity, x._i, x);
          }
          if (x._k === 'energy') { ens.push(x); return '<div class="enc en-' + esc(x.energy) + (lpEnIsLook(x) ? ' enlook' : '') + '" data-en="' + (ens.length - 1) + '"' + hidA(x) + mark(x._i) + '></div>'; }
          if (x._k === 'card') { cards.push(x); return '<div class="emb hc' + (LP_EMB_H[x.height] ? ' hfix" style="min-height:' + LP_EMB_H[x.height] + 'px' : '') + '" data-hc="' + (cards.length - 1) + '"' + hidA(x) + mark(x._i) + '></div>'; }
          if (x._k === 'sub') return '<div class="subt' + (x._catSub ? ' csub' : '') + '"' + hidA(x) + mark(x._i) + '>' + esc(x.subtitle) + '</div>';
          const c = Object.assign({}, x); delete c._i; delete c._k; delete c._val; delete c._hid; delete c._act;
          if (x._k === 'climate' && lpClimStyle() === 'rows') { clrs.push(x); return '<div class="clr" data-clr="' + (clrs.length - 1) + '"' + hidA(x) + mark(x._i) + '></div>'; }
          if (x._k === 'climate') return emb('lemur-hd-climate-card', Object.assign(c, { type: 'custom:lemur-hd-climate-card' }), x.entity, x._i);
          if (x._k === 'vacuum' && lpClimStyle() === 'rows') { clrs.push(x); return '<div class="clr vac" data-clr="' + (clrs.length - 1) + '"' + hidA(x) + mark(x._i) + '></div>'; }
          if (x._k === 'vacuum') return emb('lemur-hd-vacuum-card', Object.assign(c, { type: 'custom:lemur-hd-vacuum-card' }), x.entity, x._i);
          rows.push(x.entity); return '<div class="row" data-row="' + esc(x.entity) + '"' + hidA(x) + mark(x._i) + '></div>';
        }).join('');
      }).join('');
      // başlık biçimi: karo ya da düğmeyle başlayan bölüm büyük başlık, kartla başlayan küçük başlık
      const first = groups[0].k;
      // kare karolu (gsq) kutu da içeriğinden kısa olamaz (alttaki karo kesilmez)
      return { kind: first === 'tile' || first === 'scene' ? 'md' : 'hd', spread: !hasTiles, mix: hasTiles && !onlyTiles, season: both, html: html, fit: html.indexOf('class="gsq"') >= 0 };
    };

    // Her bölüm bir kutu. Yerleşim: kolonlar (genişlik oranı) ve her kolonun içinde 1-3 eşit sütun (tab.splits). Bölümün yeri: col + sub.
    // Düzenleme modunda boş bölüm de bir kutu olarak görünür (içine sürüklenebilsin diye).
    const widths = lpWeights(tab), splits = lpSplits(tab, widths.length);
    const cols = widths.map((w, i) => { const a = []; for (let j = 0; j < splits[i]; j++) a.push([]); return a; });
    const gbx = [];   // serbest ızgarada her bölümün kutusu
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0)), sj = Math.max(0, Math.min(splits[ci] - 1, s.sub || 0));
      curSec = s.id;
      let b = bodyOf(s);
      (s._folds || []).forEach((F) => {   // katlanır grup: başlık çubuğu (ışık çubuğu boyunda) ve altında öğeleri; açık/kapalı localStorage'da
        const fb = bodyOf(F); if (!fb) return;
        const FE = (F.entities || []).filter((x) => { const e = lpEnt(x); if (e && !S[e.entity]) return false; return !(x && typeof x === 'object' && x.visible && !lpVisible(x.visible, S)); });   // HA'da olmayan ya da koşulu yüzünden gizli öğe sayılmaz
        const ids = FE.map((x) => (typeof x === 'string' ? x : x && x.entity)).filter(Boolean), op = lpFoldOpen(F._fk);
        const fh = '<div class="fh' + (op ? ' open' : '') + '" data-fold="' + esc(F._fk) + '">' + lpIcon(F._foldIcon || 'mdi:chevron-down-box-outline') + '<b>' + esc(F._foldName || t(lang, 'fold_more')) + '</b>' +
          '<span class="fc" data-fn="' + FE.length + '" data-fcnt="' + esc(ids.join(',')) + '">' + esc(t(lang, 'fold_n', { n: FE.length })) + '</span><span class="fch"><ha-icon icon="mdi:chevron-down"></ha-icon></span></div>' +
          '<div class="fbd"' + (op ? '' : ' hidden') + '>' + fb.html + '</div>';
        // senaryo kutusu (spread) yayılı kalır; karo kutusu karışık olur (v0.29.6: senaryolarda grup açılınca kalan düğmeler daralıyordu)
        b = b ? Object.assign({}, b, { html: b.html + fh, mix: b.spread ? b.mix : true, fit: b.fit || fb.fit }) : Object.assign({}, fb, { html: fh, mix: fb.spread ? fb.mix : true });
      });
      if (!b && edit) b = { kind: 'md', html: '<div class="eph" data-sec="' + esc(s.id) + '">' + esc(t(lang, 'edit_empty')) + '</div>' };
      if (!b) return;
      cols[ci][sj].push({ title: s.title || '', kind: b.kind, season: !!b.season, spread: b.spread, mix: b.mix, fit: !!b.fit, html: b.html, secs: [s.id], grow: parseFloat(s.grow) > 0 ? parseFloat(s.grow) : 1, gap: typeof s.gap === 'number' ? s.gap : null,
        fill: !!s.fill, align: !s.fill && (s.align === 'center' || s.align === 'spread') ? s.align : '' });   // doldururken hizalama yok (aralık kaybolmasın)
      gbx.push({ s: s, b: cols[ci][sj][cols[ci][sj].length - 1] });
    });
    const used = [];
    cols.forEach((c, i) => { if (edit || c.some((x) => x.length)) used.push(i); });   // düzenlemede boş kolon da görünür

    // Lemur Light Effect Card kuruluysa üst şeridin sonunda "Efektler": efekt ekranını bu sekmenin odasıyla açar (ayarlardan kapatılabilir)
    const navFx = lpLecNav(h) ? '<div class="navb fxb" data-navfx><div class="ni">' + lpIcon('mdi:creation') + '</div><div class="nn">' + esc(t(lang, 'effects')) + '</div></div>' : '';
    const navBtns = tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni">' + lpIcon(x.icon || 'mdi:home-outline') + '</div><div class="nn">' + esc(x.name) + '</div></div>').join('');
    const clock0 = '<div class="clock">' + this._time() + '</div>';
    const bbc = lpBrightCfg();
    this._bbTab = tab;
    // telefon düzeninde (telefon, dikey tablet) saatte parlaklık: üstteki sayfa adı + saat satırı kaydırılır (v0.28.11)
    const bbPh = bbc.on && bbc.phone && phone && !edit;
    const phd = (name) => bbPh
      ? '<div class="phd bbar' + (bbc.always ? ' bbal' : '') + '" data-bbar><div class="bbf"></div><b>' + esc(name) + '</b><span class="bbv"></span>' + clock0 + '</div>'
      : '<div class="phd"><b>' + esc(name) + '</b>' + clock0 + '</div>';
    const clock = bbc.on && !phone ? '<div class="bbar' + (bbc.box ? ' bbbox' : '') + (bbc.always ? ' bbal' : '') + '" data-bbar><div class="bbf"></div>' +
      (bbc.icon ? lpIcon('lhd:bulb-bright', 'bbi') : '') + clock0 + '<span class="bbv"></span></div>' : clock0;
    const nc = lpNavCfg(), nst = (nc.w ? '--lp-nav-w:' + nc.w + 'px;' : '') + (nc.h ? '--lp-nav-h:' + nc.h + 'px;' : '');
    // kolona hizala: düğmeler ilk N kolonun üstünü eşit paylaşır, sağ kenarları N. kolonun kutusuyla aynı çizgide biter;
    // Efektler (içeride değilse) ve saat kalan kolonların üstünde. Telefonda ve kolon sayısı yetmezse normal şerit.
    // Kolonu az olan sekmede (ör. tek sütunluk Kameralar sekmesi) şerit kaymasın: hizalama yeterli kolonu olan ilk sekmenin
    // kolonlarına göre yapılır; şerit o kolon oranlarıyla ayrı bir ızgarada çizilir (aynı aralıkla, böylece düğmeler aynı yerde kalır).
    // Kolonları farklı olan sekmede de (ör. 30/40/30 Enerji, tek sütunluk Kameralar) şerit kaymasın: hizalama her sekmede aynı
    // referans sekmeye göre yapılır (yeterli kolonu olan ilk sekme). Referans sekmenin kendisi normal ızgarada çizilir.
    let navCols = 0, navRef = null;
    if (!phone && nc.cols > 0) {
      const refUsed = (T) => { const w = lpWeights(T), u = []; w.forEach((x, i) => { if ((T.sections || []).some((s) => Math.min(Math.max(0, +s.col || 0), w.length - 1) === i && (s.entities || []).length)) u.push(w[i]); }); return u; };
      let ref = null;
      for (let k = 0; k < tabs.length && !ref; k++) { const u = refUsed(tabs[k]); if (u.length > nc.cols) { ref = tabs[k]; navRef = u; } }
      const same = ref && (ref.id === tab.id || JSON.stringify(navRef) === JSON.stringify(used.map((i) => widths[i])));
      if (same || !ref) { navRef = null; navCols = nc.cols < used.length ? nc.cols : 0; } else navCols = nc.cols;
    }
    const navPos = (a, b) => (navRef ? 'grid-column:' + a + ' / ' + b + ';grid-row:1;' : 'grid-area:1 / ' + a + ' / 2 / ' + b + ';');
    const nav0 = navCols
      ? '<div class="nav navl" style="' + navPos(1, navCols + 1) + nst + '">' + navBtns + (nc.fx_in ? navFx : '') + '</div>' +
        '<div class="nav navr" style="' + navPos(navCols + 1, -1) + nst + '">' + (nc.fx_in ? '' : navFx) + clock + '</div>'
      : '<div class="nav"' + (nst ? ' style="' + nst + '"' : '') + '>' + navBtns + navFx + clock + '</div>';
    const nav = navRef ? '<div class="navg" style="grid-area:h;display:grid;grid-column-gap:12px;min-width:0;grid-template-columns:' + navRef.map((w) => 'minmax(0,' + w + 'fr)').join(' ') + '">' + nav0 + '</div>' : nav0;
    // telefon: odalar ya da kategoriler altta (uygulama gibi); üstte yalnız sayfanın adı ve saat
    const pcf = lpPhoneCfg(), pbOn = phone && pcf.nav !== 'top';
    // önizlemede (düzenleme) kategori çubuğu görünür ama sayfa sekmenin kendisidir: üstte sekmenin adı
    const cv = pbOn ? (this._cat || (edit && pcf.nav === 'cats' ? lpCatView(tabs, tab) : null)) : null, cvPage = cv && !edit;
    let pHead = '', pBar = '';
    if (pbOn) {
      const fxI = lpLecNav(h) ? '<div class="pbi fxb" data-navfx>' + lpIcon('mdi:creation') + '<span>' + esc(t(lang, 'effects')) + '</span></div>' : '';
      if (cv) {
        pBar = cv.cats.map((c) => '<div class="pbi' + (c === cv.cat ? ' sel' : '') + '" data-cat="' + c + '">' + lpIcon(LP_CAT_IC[c]) + '<span>' + esc(t(lang, 'c_' + c)) + '</span></div>').join('') + fxI;
        if (cvPage) { const rt = cv.rooms.filter((T) => T.id === cv.room)[0]; this._bbTab = cv.cat === 'lights' ? (rt || null) : tab; }   // Işıklar: seçili oda (Hepsi: sayfadaki ışıklar)
        pHead = phd(cvPage ? t(lang, 'c_' + cv.cat) : tab.name || '') +
          (cvPage && cv.rooms.length ? '<div class="ppills">' + ['all'].concat(cv.rooms.map((T) => T.id)).map((id) => { const T = cv.rooms.filter((x) => x.id === id)[0]; return '<div class="pp' + (id === cv.room ? ' sel' : '') + '" data-room="' + esc(id) + '">' + esc(T ? T.name : t(lang, 'c_all')) + '</div>'; }).join('') + '</div>' : '');
      } else {
        pBar = tabs.map((x) => '<div class="pbi' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '">' + lpIcon(x.icon || 'mdi:home-outline') + '<span>' + esc(x.name) + '</span></div>').join('') + fxI;
        pHead = phd(tab.name || '');
      }
      pBar = '<div class="pbar">' + pBar + '</div>';
    }
    const seasonIcon = lpIcon(season === 'winter' ? 'mdi:snowflake' : 'mdi:white-balance-sunny', 'season');
    // aynı sütunda birden çok kutu varsa yükseklikler "grow" oranında paylaşılır (düzenlemede aradaki çizgi sürüklenerek değişir)
    // fill: öğeler kutunun yüksekliğini doldurur; align: içeriğe göre olan kutuda öğeler ortada ya da eşit aralıkla
    const boxHtml = (b, multi) => '<div class="box' + (b.spread ? ' spread' : '') + (b.mix ? ' mix' : '') + (b.fit ? ' fit' : '') + (b.fill ? ' fill' : '') + (b.align ? ' al-' + b.align : '') + (edit && b.secs.indexOf(selected) >= 0 ? ' selbox' : '') + '" data-secs="' + esc(b.secs.join(',')) + '"' +
      (multi || b.gap !== null ? ' style="' + (multi ? 'flex:' + b.grow + ' 1 0px;min-height:auto;' : '') + (b.gap !== null ? '--lp-gap:' + b.gap + 'px;--lp-gapg:' + b.gap + 'px' : '') + '"' : '') + '>' +
      (edit ? '<div class="bgrip" title="' + esc(t(lang, 'drag_box')) + '"><ha-icon icon="mdi:drag"></ha-icon></div>' : '') +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    const subHtml = (i, j, boxes) => '<div class="sub" data-col="' + i + '" data-sub="' + j + '">' +
      (boxes.length ? boxes.map((b) => boxHtml(b, boxes.length > 1)).join('')
        : '<div class="box colempty"><span>' + esc(t(lang, 'col_empty')) + '</span><button class="addsec" data-addsec="' + i + ':' + j + '">+ ' + esc(t(lang, 'add_section')) + '</button>' +
          (j === 0 && widths.length > 1 && cols[i].every((x) => !x.length) ? '<button class="addsec coldel" data-coldel="' + i + '">− ' + esc(t(lang, 'col_del')) + '</button>' : '') + '</div>') + '</div>';
    let grid, body;
    if (phone) {
      // telefon: kolonlar soldan sağa, sütunlar sırayla alt alta; boş sütun yer kaplamaz
      grid = '';
      const bx = [];
      if (tab.layout === 'grid' && !tab._ph) gbx.slice().sort((a, b) => ((a.s.g || {}).y || 0) - ((b.s.g || {}).y || 0) || ((a.s.g || {}).x || 0) - ((b.s.g || {}).x || 0)).forEach((x) => bx.push(x.b));   // ızgarada okuma sırası
      else cols.forEach((c) => c.forEach((boxes) => boxes.forEach((b) => bx.push(b))));
      body = '<div class="pcol">' + (bx.length ? bx.map((b) => boxHtml(b, false)).join('') : '<div class="box empty">' + esc(t(lang, 'empty')) + '</div>') + '</div>';
    } else if (tab.layout === 'grid' && gbx.length) {
      // serbest ızgara: geniş ekranda 12, dikeyde 6 sütun; ekrana sığdır ya da sabit satırla kaydır
      const lh = parseFloat(getComputedStyle(this).getPropertyValue('--lp-h')) || window.innerHeight, ow = this.offsetWidth || window.innerWidth;
      const C = tab._gn === 6 || (tab._gn !== 12 && ow < lh * 0.95) ? 6 : 12, P = lpGridPos(tab, C, gbx.map((x) => x.s.id));
      let rows = 0; gbx.forEach((x) => { const p = P[x.s.id]; if (p) rows = Math.max(rows, p.y + p.h); });
      const fit = tab.gfit !== false, R0 = fit ? Math.max(+tab.grows || 12, rows) : rows + (edit ? 2 : 0);
      if (fit && !edit) lpGFill(Object.keys(P).map((k) => P[k]), C, R0);   // panoda boş hücre kalmaz (düzenlemede gerçek yerler görünür)
      this._gC = C; this._gR = R0;
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="gl' + (fit ? ' gfit' : ' gscr') + '" data-gl style="grid-area:c0;grid-template-columns:repeat(' + C + ',minmax(0,1fr));grid-template-rows:repeat(' + R0 + ',' + (fit ? 'minmax(0,1fr)' : (+tab.growh || 70) + 'px') + ')">' +
        gbx.map((x) => { const p = P[x.s.id]; return '<div class="gcell" data-gsec="' + esc(x.s.id) + '" style="grid-column:' + (p.x + 1) + ' / span ' + p.w + ';grid-row:' + (p.y + 1) + ' / span ' + p.h + '">' + boxHtml(x.b, false) + (edit ? '<i class="grz" title="' + esc(t(lang, 'drag_size')) + '"></i>' : '') + '</div>'; }).join('') + '</div>';
    } else if (used.length) {
      // kolon genişlikleri oran (fr): kolon sayısı ne olursa olsun ekrana sığar, aralıklar taşırmaz
      grid = 'grid-template-columns:' + used.map((i) => 'minmax(0,' + widths[i] + 'fr)').join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => {
        // normal panoda boş sütun yer kaplamaz; düzenlemede görünür
        const subs = cols[i].map((boxes, j) => ({ j: j, boxes: boxes })).filter((x) => edit || x.boxes.length);
        return '<div class="col" data-col="' + i + '" style="grid-area:c' + i + '"><div class="subs" style="grid-template-columns:repeat(' + subs.length + ',minmax(0,1fr))">' +
          subs.map((x) => subHtml(i, x.j, x.boxes)).join('') + '</div></div>';
      }).join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="subs"><div class="sub"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div></div></div>';
    }
    const R = this.shadowRoot;
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap ic-' + lpIconMode() + (lpIconTintLight() ? ' ic-lightc' : '') + (edit ? ' edit' : '') + (phone ? ' phone' + (lpPhoneCfg().flat ? ' flat' : '') : '') + (pbOn ? ' pb' : '') + '" style="' + grid + ';--lp-ic-on:' + lpIconTint() + '">' + (pbOn ? pHead : nav) + body + pBar + '</div>';

    // gömülü kartlar
    this._embeds = [];
    R.querySelectorAll('[data-emb]').forEach((ph) => {
      const spec = embeds[+ph.getAttribute('data-emb')];
      const el = document.createElement(spec.tag);
      try { el.setConfig(spec.cfg); } catch (e) { ph.textContent = String((e && e.message) || e); return; }
      el.hass = h;
      ph.appendChild(el);
      this._embeds.push(el);
      if (spec.it) ph._item = spec.it;
      if (spec.it && spec.tag === 'lemur-hd-sensor-card' && el.shadowRoot) { const st = document.createElement('style'); st.textContent = lpHaloStyle(spec.it); el.shadowRoot.appendChild(st); }
    });
    // gömülü HA kartları (HA'nın kart yardımcısıyla; yüklenemezse kısa uyarı)
    R.querySelectorAll('[data-hc]').forEach((ph) => {
      const ci = cards[+ph.getAttribute('data-hc')];
      ph._item = ci;
      lpMountCard(ph, ci.card, () => this._hass, lang, (el) => { if (ph.isConnected && this._embeds) this._embeds.push(el); });
    });
    this._txEls = Array.prototype.slice.call(R.querySelectorAll('[data-tx]'));
    this._ssEls = []; R.querySelectorAll('[data-ss]').forEach((el) => { el._item = ssItems[+el.getAttribute('data-ss')]; this._ssEls.push(el); });
    this._pets = []; R.querySelectorAll('[data-pet]').forEach((el) => this._pets.push(el));
    // enerji kartları: veri src/energy.js'ten (HA enerji ayarları ve kayıtları); anlık değer değişince yeniden çizilir
    this._ens = []; R.querySelectorAll('[data-en]').forEach((el) => { el._item = ens[+el.getAttribute('data-en')]; this._ens.push(el); });
    this._enAt = 0; this._enLast = {};

    // kameralar: görüntü birkaç saniyede bir yenilenir (öğe ayarı refresh, yoksa bölüm ayarı cam_refresh, sn; varsayılan 10). Sekme görünmüyorsa yenilenmez.
    this._cams = []; R.querySelectorAll('[data-cam]').forEach((el) => { el._item = cams[+el.getAttribute('data-cmi')]; el._at = 0; this._cams.push(el); });
    clearInterval(this._camT); this._camT = this._cams.length ? setInterval(() => this._camTick(), 1000) : null;
    this._ents = []; R.querySelectorAll('[data-ent]').forEach((el) => { el._item = ents[+el.getAttribute('data-ei')]; this._ents.push(el); });
    this._vals = []; R.querySelectorAll('[data-val]').forEach((el) => { el._item = vals[+el.getAttribute('data-vi')]; el._bar = el.classList.contains('bar'); el._wide = el.hasAttribute('data-wide'); this._vals.push(el); });
    this._tiles = []; R.querySelectorAll('[data-light]').forEach((el) => { el._item = tileItems[+el.getAttribute('data-ti')]; el._bar = el.classList.contains('bar'); el._wide = el.hasAttribute('data-wide'); this._tiles.push(el); });
    // ışık / priz karosunda watt rozeti (Enerji sayfası → Görünüm): karonun güç sensörü izlenir
    this._badges = [];
    if (lpEnBadge()) this._tiles.forEach((el) => { const p = lpEnTileP(h, el.getAttribute('data-light')); if (p) { el._pw = p; this._badges.push(el); } });
    this._rows = []; R.querySelectorAll('[data-row]').forEach((el) => this._rows.push(el));
    this._clrs = []; R.querySelectorAll('[data-clr]').forEach((el) => { el._item = clrs[+el.getAttribute('data-clr')]; this._clrs.push(el); if (!edit) this._clrBind(el); });
    const clrW = []; clrs.forEach((x) => [x.entity, x.temperature_sensor, x.humidity_sensor].concat(x.entities || []).forEach((e) => { if (typeof e === 'string' && clrW.indexOf(e) < 0) clrW.push(e); }));
    // LEC: karoların odaları da sorulur; efekt düğmesi olan odaların ışıkları izlenir (değişince oynayan efekt yeniden sorulur)
    tiles.forEach((id) => { const r = LEC.roomOf(id); if (r) lecRooms[r] = 1; });
    this._lecRooms = Object.keys(lecRooms).filter((r) => LEC.hasRoom(r));
    const lecLights = [];
    this._lecRooms.forEach((r) => LEC.lightsOf(r).forEach((id) => { if (tiles.indexOf(id) < 0 && lecLights.indexOf(id) < 0) lecLights.push(id); }));
    this._watched = tiles.concat(rows, clrW, lecLights, cams.map((x) => x.entity), vals.concat(ents, ssItems).map((x) => x.entity).filter((x) => x && tiles.indexOf(x) < 0), visW);
    this._badges.forEach((el) => [].concat(el._pw).forEach((x) => { if (this._watched.indexOf(x) < 0) this._watched.push(x); }));
    if (!edit && LEC.installed(h)) this._lecRooms.forEach((r) => LEC.query(h, r));
    this._last = {};
    this._lang = lang;
    if (this._ens.length) { this._enPaint(true); if (!edit) this._ens.forEach((el) => this._enBind(el)); }
    this._enDot();

    // düzenleme modu (yönetim panelindeki önizleme): cihazlara dokunulmaz; tıklama seçer, sürükleme taşır, çizgiler boyutlandırır
    if (edit) { this._editBind(R, tab, widths, used); return; }
    (this._cams || []).forEach((el) => lpPress(el, () => this._camOpen(el)));
    const bbEl = R.querySelector('[data-bbar]');
    if (bbEl) this._bbBind(bbEl);
    // dokunuşlar
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      if (this._config.demo) { this._config = Object.assign({}, this._config, { tab: id }); this._sig = null; this._render(); return; }
      const base = location.pathname.split('/').slice(0, 2).join('/');
      // pano açıkken eklenen sekmenin HA'da henüz görünümü yok: sayfa baştan yüklenir, pano yeniden üretilir
      if (window.__LHD_VIEWS && window.__LHD_VIEWS.indexOf(id) < 0) { location.assign(base + '/' + id); return; }
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => { if (!this._config.demo) lpFire(this, 'hass-more-info', { entityId: id }); };
    this._tiles.forEach((b) => {
      const id = b.getAttribute('data-light');
      // basılı tut: varsayılan bizim ışık penceremiz; ayarda seçildiyse HA'nın penceresi ya da LEC'in efekt ekranı (lambanın odasıyla)
      const hold = () => {
        const mode = lpHoldMode(), h = this._hass, d = id.split('.')[0];
        if (mode !== 'ha' && d === 'cover') { this._covOpen(h, id, b._item); return; }   // perde: bizim perde penceremiz
        if (mode === 'lec' && !this._config.demo && LEC.installed(h) && LEC.open(h, LEC.roomOf(id) || tab.area)) return;
        if (mode !== 'ha' && (d === 'light' || d === 'switch' || d === 'input_boolean')) { this._popOpen(h, id, b._item, LEC.roomOf(id) || tab.area); return; }
        more(id);
      };
      const it = b._item || {};
      const tap0 = () => this._act(it.tap, id, 'toggle');
      const tap = () => this._confirm(it, tap0);
      const hold2 = it.hold ? () => this._act(it.hold, id) : hold;   // öğede tap/hold verildiyse o
      if (!b._bar) { lpPress(b, tap, hold2); return; }
      lpSlide(b, {
        tap: tap, hold: hold2,
        can: () => lpBarCan(this._hass.states[id]),
        start: () => { const st = this._hass.states[id]; return b._settle && Date.now() < b._settle.until ? b._settle.v : (st ? lpBarVal(st) : 0); },
        move: (v) => { b._drag = true; b._dv = v; this._paintBar(b, this._hass.states[id], v); },
        end: () => {
          b._drag = false; const v = b._dv;
          if (typeof v !== 'number') return;
          // gönderilen değer, cihazın yeni durumu gelene kadar (en çok 3 sn) çubukta kalır; geri zıplamaz
          b._settle = { v: v, until: Date.now() + 3000 };
          lpBarSet(this._hass, id, v);
          setTimeout(() => { if (!b._drag) this._paintBar(b, this._hass.states[id]); }, 3100);
        }
      });
    });
    this._rows.forEach((b) => lpPress(b, () => more(b.getAttribute('data-row'))));
    // düğme / satır görünümündeki varlık: değer öğesinde cihaz penceresi, diğerlerinde aç/kapat (öğenin tap/hold'u önce gelir)
    this._ents.forEach((b) => {
      const id = b.getAttribute('data-ent'), it = b._item || {}, d = id.split('.')[0];
      const holdDef = () => { const hm = lpHoldMode(); if (!it._val && hm !== 'ha' && d === 'cover') { this._covOpen(this._hass, id, it); return; } if (!it._val && hm !== 'ha' && (d === 'light' || d === 'switch' || d === 'input_boolean')) this._popOpen(this._hass, id, it, LEC.roomOf(id) || tab.area); else more(id); };
      lpPress(b, () => this._confirm(it, () => this._act(it.tap, id, it._val ? 'more-info' : 'toggle')), it.hold ? () => this._act(it.hold, id) : holdDef);
    });
    // besleme kartı: dokun "Besledim" (10 sn içinde yeniden dokununca geri alınır), basılı tut son beslemeler
    this._pets.forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-pet'), now = Date.now();
      if (!STORE.data || !(STORE.data.pets || {})[id]) return;
      if (b._fedAt && now - b._fedAt < 10000) { b._fedAt = 0; b._pk = null; lpPetPaint(b, lang, now); STORE.feed(id, true); return; }
      b._fedAt = now; b._pk = null; lpPetPaint(b, lang, now); STORE.feed(id, false);
      setTimeout(() => { b._pk = null; lpPetPaint(b, this._lang, Date.now()); }, 10100);
    }, () => lpPetHistory(this._hass, this._lang, b.getAttribute('data-pet'))));
    // gömülü kart (kart öğesi ya da Halo görünümü): öğede tap/hold verildiyse kartın üstüne şeffaf katman, kartın kendi tıklaması yerine o çalışır
    R.querySelectorAll('[data-hc],[data-emb]').forEach((ph) => {
      const it = ph._item; if (!it || (!it.tap && !it.hold)) return;
      const ov = document.createElement('div'); ov.className = 'tapov'; ph.appendChild(ov);
      const id = it.entity || (it.card && it.card.entity) || '';
      lpPress(ov, () => this._act(it.tap, id, 'more-info'), () => this._act(it.hold, id, 'more-info'));
    });
    // değer karosu: dokun → öğenin tap'i (varsayılan cihaz penceresi), basılı tut → hold'u (varsayılan cihaz penceresi)
    this._vals.forEach((b) => { const id = b.getAttribute('data-val'), it = b._item || {}; lpPress(b, () => this._confirm(it, () => this._act(it.tap, id, 'more-info')), () => this._act(it.hold, id, 'more-info')); });
    const sceneItem = (b) => { const v = b.getAttribute('data-scene'), k = v.lastIndexOf(':'), p = [v.slice(0, k), v.slice(k + 1)]; let s = (tab.sections || []).filter((x) => x.id === p[0])[0]; (tab.sections || []).forEach((x) => (x._folds || []).forEach((F) => { if (F._fk === p[0]) s = F; })); const it = s && s.entities && s.entities[+p[1]]; return typeof it === 'string' ? { entity: it } : it; };
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => this._confirm(sceneItem(b), () => {
      const it = sceneItem(b);
      if (it && it.tap) { this._act(it.tap, it.entity); return; }   // öğede dokunma eylemi verildiyse o
      if (it && it.entity && !it.action) {   // düğme olarak eklenmiş betik, sahne, otomasyon, buton
        const d = it.entity.split('.')[0];
        const sv = d === 'automation' ? 'trigger' : (d === 'button' || d === 'input_button') ? 'press' : 'turn_on';
        this._hass.callService(d, sv, { entity_id: it.entity }); return;
      }
      if (!it || !it.action) return;
      if (!it.action.service) { this._act(it.action, it.entity); return; }   // pencerede kart aç, HA biçimli eylem...
      const lk = lpLecKind(it);
      if (lk && this._config.demo) return;   // önizlemede efekt ekranı açılmaz, efekt çalmaz
      if (lk === 'open') { LEC.open(this._hass, it.action.room || tab.area); return; }
      if (lk) { LEC.run(this._hass, it.action); return; }
      // servis: hedef varlık kimliği, liste ya da { area_id, entity_id... } olabilir; data ile birleşir (_act)
      this._act(it.action, it.entity);
    }), (() => { const it0 = sceneItem(b); return it0 && it0.hold ? () => this._act(it0.hold, it0.entity) : null; })()));
    R.querySelectorAll('[data-season]').forEach((b) => lpPress(b, () => STORE.season(lpSeason() === 'winter' ? 'summer' : 'winter')));
    R.querySelectorAll('[data-fold]').forEach((b) => lpPress(b, () => { const o = !b.classList.contains('open'); b.classList.toggle('open', o); const bd = b.nextElementSibling; if (bd) bd.hidden = !o; lpFoldSet(b.getAttribute('data-fold'), o); }));
    R.querySelectorAll('[data-navfx]').forEach((b) => lpPress(b, () => { if (this._config.demo) return; LEC.open(this._hass, tab.area); }));
    // telefon kategorileri: alttaki kategori, üstteki oda; ışıklarda sağa sola kaydırınca sonraki / önceki oda
    const goCat = (c, room) => { LP_PH.cat = c; LP_PH.room = room; this._sig = null; this._render(); try { window.scrollTo(0, 0); } catch (e) {} };
    R.querySelectorAll('[data-cat]').forEach((b) => lpPress(b, () => goCat(b.getAttribute('data-cat'), LP_PH.room)));
    R.querySelectorAll('[data-room]').forEach((b) => lpPress(b, () => goCat(LP_PH.cat || 'lights', b.getAttribute('data-room'))));
    const pp = R.querySelector('.ppills .pp.sel'); if (pp && pp.scrollIntoView) { try { pp.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {} }
    const cvw = this._cat, wrapEl = R.querySelector('.wrap');
    if (cvw && cvw.rooms.length && wrapEl) {
      let sx = null, sy = 0;
      wrapEl.addEventListener('touchstart', (e) => {
        const tg = e.target && e.target.closest ? e.target.closest('.bar, .ppills, .pbar, .emb, [data-bbar]') : null;   // parlaklık çubuğu, saatte parlaklık, oda şeridi ve kartlar kendi kaydırmasını kullanır
        sx = tg || e.touches[0].clientX <= LP_EDGE ? null : e.touches[0].clientX; sy = e.touches[0].clientY;   // sol kenar: yan menünün kaydırması (src/scale.js)
      }, { passive: true });
      wrapEl.addEventListener('touchend', (e) => {
        if (sx === null) return;
        const p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy; sx = null;
        if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
        const ids = ['all'].concat(cvw.rooms.map((T) => T.id)), i = ids.indexOf(cvw.room) + (dx < 0 ? 1 : -1);
        if (i >= 0 && i < ids.length) goCat('lights', ids[i]);
      }, { passive: true });
    }
  }

  // --- düzenleme modu: tıkla seç, sürükle taşı, çizgiden boyutlandır ---
  // Kart değişikliği kendisi kaydetmez; yeni sekme ayarını 'lhd-change' ile yönetim paneline verir, panel kaydeder.
  _editBind(R, tab, widths, used) {
    const wrap = R.querySelector('.wrap');
    const clone = () => JSON.parse(JSON.stringify(tab));
    // telefona özel kopya (_ph) asla kaydedilmez: telefonda sürükleme yalnız telefon sırasını değiştirir ('lhd-phorder' bölümler, 'lhd-phitems' öğeler)
    const emit = (nt) => { if (!tab._ph) lpFire(this, 'lhd-change', { tab: nt }); };
    const zoom = () => { const r = this.getBoundingClientRect(); return (r.width && this.offsetWidth) ? r.width / this.offsetWidth : 1; };
    const secById = (T, id) => (T.sections || []).filter((x) => x.id === id)[0];
    const listOf = (s) => (s.entities = s.entities || []);
    // bölümler serbest: her öğe her bölüme taşınabilir
    const typeOf = (id) => (secById(tab, id) ? 'any' : '');
    const r2 = (x) => Math.round(x * 100) / 100;
    const arr = (x) => Array.prototype.slice.call(x);
    R.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => lpFire(this, 'lhd-tab', { tab: b.getAttribute('data-nav') })));

    let D = null;   // süren sürükleme
    // boyutlandırma tutamakları: kolonların arasında dikey, aynı kolonda üst üste duran kutuların arasında yatay
    const place = () => {
      if (!wrap.isConnected || D) return;
      if (wrap.classList.contains('phone')) return;   // telefonda kolon/satır boyutlandırma yok
      // sığmayan kutuyu işaretle
      arr(R.querySelectorAll('.box[data-secs]')).forEach((b) => {
        const over = b.scrollHeight > b.clientHeight + 2 || b.scrollWidth > b.clientWidth + 2;
        b.classList.toggle('over', over);
        if (over) b.setAttribute('data-over', t(this._lang || 'tr', 'too_full')); else b.removeAttribute('data-over');
      });
      arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => x.remove());
      const cols = arr(R.querySelectorAll('.col[data-col]'));
      for (let k = 0; k < cols.length - 1; k++) {
        const a = cols[k], b = cols[k + 1], hd = document.createElement('div');
        hd.className = 'colh'; hd.setAttribute('data-k', k);
        hd.style.left = ((a.offsetLeft + a.offsetWidth + b.offsetLeft) / 2 - 7) + 'px';
        hd.style.top = a.offsetTop + 'px'; hd.style.height = a.offsetHeight + 'px';
        wrap.appendChild(hd);
      }
      arr(R.querySelectorAll('.sub[data-sub]')).forEach((c) => {
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs'));
        for (let j = 0; j < bx.length - 1; j++) {
          const hd = document.createElement('div');
          hd.className = 'rowh'; hd.setAttribute('data-col', c.getAttribute('data-col')); hd.setAttribute('data-sub', c.getAttribute('data-sub')); hd.setAttribute('data-j', j);
          hd.style.left = c.offsetLeft + 'px'; hd.style.width = c.offsetWidth + 'px';
          hd.style.top = ((bx[j].offsetTop + bx[j].offsetHeight + bx[j + 1].offsetTop) / 2 - 7) + 'px';
          wrap.appendChild(hd);
        }
      });
    };
    requestAnimationFrame(place); setTimeout(place, 400); setTimeout(place, 1500);

    const clearMarks = () => arr(R.querySelectorAll('.dropl,.dropr,.dropt,.dropd,.dropin')).forEach((x) => x.classList.remove('dropl', 'dropr', 'dropt', 'dropd', 'dropin'));
    const line = (left, top, width) => {
      let ln = R.querySelector('.dropline');
      if (!ln) { ln = document.createElement('div'); ln.className = 'dropline'; wrap.appendChild(ln); }
      ln.style.left = left + 'px'; ln.style.top = top + 'px'; ln.style.width = width + 'px';
    };
    // bırakma hedefi: işaretçinin altındaki (ya da en yakın) sütun
    const colAt = (x) => {
      const cols = arr(R.querySelectorAll('.sub[data-sub]'));
      let best = null, bd = 1e9;
      cols.forEach((c) => { const r = c.getBoundingClientRect(); const d = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0); if (d < bd) { bd = d; best = c; } });
      return best;
    };

    const down = (e) => {
      if (e.button !== 0) return;
      const tg = e.target;
      const ch = tg.closest('.colh'), rh = tg.closest('.rowh');
      const item = !ch && !rh ? tg.closest('[data-idx]') : null;
      const box = !ch && !rh && !item ? tg.closest('.box[data-secs]') : null;
      const gcell = tab.layout === 'grid' && !tab._ph ? tg.closest('.gcell') : null;
      if (gcell && !item && (tg.closest('.grz') || box)) {   // ızgarada kutu taşınır ya da köşesinden büyütülür
        const gl = R.querySelector('[data-gl]'), C = this._gC || 12, Rn = this._gR || 12;
        const pos = {}; arr(gl.querySelectorAll('.gcell')).forEach((c) => { const a = c.style.gridColumn.match(/(\d+)\s*\/\s*span\s*(\d+)/), b = c.style.gridRow.match(/(\d+)\s*\/\s*span\s*(\d+)/); if (a && b) pos[c.getAttribute('data-gsec')] = { id: c.getAttribute('data-gsec'), x: +a[1] - 1, w: +a[2], y: +b[1] - 1, h: +b[2] }; });
        const id = gcell.getAttribute('data-gsec'), sec = secById(tab, id);
        D = { kind: tg.closest('.grz') ? 'gsize' : 'gmove', el: gcell, id: id, sx: e.clientX, sy: e.clientY, on: false, z: zoom(), C: C, cw: gl.offsetWidth / C, ch: (tab.gfit !== false ? gl.offsetHeight / Rn : (+tab.growh || 70)), pos: pos, o: JSON.parse(JSON.stringify(pos[id])), min: lpGMin(sec || {}, C), gl: gl };
        e.preventDefault(); return;
      }
      if (!ch && !rh && !item && !box) return;
      D = { kind: ch ? 'col' : rh ? 'row' : item ? 'item' : 'box', el: ch || rh || item || box, sx: e.clientX, sy: e.clientY, on: false, z: zoom() };
      if (ch) {
        const k = +ch.getAttribute('data-k'), cols = arr(R.querySelectorAll('.col[data-col]'));
        D.a = used[k]; D.b = used[k + 1]; D.pa = cols[k].offsetWidth; D.pb = cols[k + 1].offsetWidth; D.W = widths.slice();
      }
      if (rh) {
        const c = R.querySelector('.sub[data-col="' + rh.getAttribute('data-col') + '"][data-sub="' + rh.getAttribute('data-sub') + '"]'), j = +rh.getAttribute('data-j');
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs'));
        D.A = bx[j]; D.B = bx[j + 1]; D.ha = D.A.offsetHeight; D.hb = D.B.offsetHeight;
        D.ga = parseFloat(D.A.style.flexGrow) || 1; D.gb = parseFloat(D.B.style.flexGrow) || 1;
      }
      e.preventDefault();
    };
    const move = (e) => {
      if (!D) return;
      const dx = (e.clientX - D.sx) / D.z, dy = (e.clientY - D.sy) / D.z;
      if (!D.on) {
        if (Math.abs(e.clientX - D.sx) + Math.abs(e.clientY - D.sy) < 6) return;
        D.on = true;
        if (D.kind === 'box' || D.kind === 'item' || D.kind === 'gmove' || D.kind === 'gsize') D.el.classList.add('dragging');
        // kutu: küçük bir başlık kartı imleci izler; kutunun kendisi canlı olarak yeni yerine geçer, ötekiler kayar
        if (D.kind === 'box') {
          D.home = { p: D.el.parentNode, n: D.el.nextSibling };
          const tl = D.el.querySelector('.title'), g = document.createElement('div');
          g.className = 'lpghost lpgbox'; g.textContent = (tl && tl.textContent.trim()) || '⠿';
          wrap.appendChild(g); D.gh = g; D.gx = 24; D.gy = 26;
        }
        // öğe: tutulan karo parmağı/imleci izler (kopyası), yerinde soluk hali kalır ve öteki öğeler canlı olarak kenara kayar
        if (D.kind === 'item') {
          const er = D.el.getBoundingClientRect();
          D.home = { p: D.el.parentNode, n: D.el.nextSibling };
          D.gx = (D.sx - er.left) / D.z; D.gy = (D.sy - er.top) / D.z;
          const g = D.el.cloneNode(true); g.classList.remove('dragging'); g.classList.add('lpghost');
          g.removeAttribute('data-idx'); g.removeAttribute('data-sec');
          g.style.width = D.el.offsetWidth + 'px'; g.style.height = D.el.offsetHeight + 'px';
          wrap.appendChild(g); D.gh = g;
        }
        if (D.kind !== 'item') arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => { if (x !== D.el) x.style.display = 'none'; });   // kutu kayarken tutamaklar yerinde kalmasın
      }
      if (D.kind === 'gmove' || D.kind === 'gsize') {
        const o = D.pos[D.id], L = Object.keys(D.pos).map((k) => D.pos[k]);
        if (D.kind === 'gmove') { o.x = Math.round(D.o.x + dx / D.cw); o.y = Math.max(0, Math.round(D.o.y + dy / D.ch)); }
        else { o.w = Math.max(D.min[0], Math.min(D.C - o.x, Math.round(D.o.w + dx / D.cw))); o.h = Math.max(D.min[1], Math.round(D.o.h + dy / D.ch)); }
        lpGSettle(L, D.id, D.C);
        arr(D.gl.querySelectorAll('.gcell')).forEach((c) => { const p = D.pos[c.getAttribute('data-gsec')]; if (!p) return; c.style.gridColumn = (p.x + 1) + ' / span ' + p.w; c.style.gridRow = (p.y + 1) + ' / span ' + p.h; });
        if (tab.gfit === false) { let rr = 0; L.forEach((p) => { rr = Math.max(rr, p.y + p.h); }); D.gl.style.gridTemplateRows = 'repeat(' + (rr + 2) + ',' + (+tab.growh || 70) + 'px)'; }
        else { let rr = 0; L.forEach((p) => { rr = Math.max(rr, p.y + p.h); }); if (rr > (this._gR || 12)) D.gl.style.gridTemplateRows = 'repeat(' + rr + ',minmax(0,1fr))'; }
        return;
      }
      if (D.kind === 'col') {
        // kolon, içindeki sütun sayısı kadar daralabilir: her sütun en dar kanvasta (W, genelde 1280) en az 150 px.
        // Sınır oran olarak hesaplanır; önizleme ya da ekran daha geniş olsa da dar tablette sütun ezilmez.
        const spl = lpSplits(tab, widths.length), n = widths.length;
        const cw = ((STORE.data && STORE.data.settings && STORE.data.settings.canvas) || {}).width || 1280;
        const k = (wrap.offsetWidth - 8 - 20 * n) / (cw - 8 - 20 * n);
        const ma = spl[D.a] * 150 * Math.max(1, k), mb = spl[D.b] * 150 * Math.max(1, k);
        const tot = D.pa + D.pb, na = Math.max(ma, Math.min(tot - mb, D.pa + dx));
        const sum = widths[D.a] + widths[D.b];
        D.W[D.a] = r2(sum * na / tot); D.W[D.b] = r2(sum - D.W[D.a]);
        wrap.style.gridTemplateColumns = used.map((i) => 'minmax(0,' + D.W[i] + 'fr)').join(' ');
        D.el.style.left = (parseFloat(D.el.style.left) + (e.clientX - (D.lx || D.sx)) / D.z) + 'px'; D.lx = e.clientX;
        return;
      }
      if (D.kind === 'row') {
        const tot = D.ha + D.hb, nh = Math.max(100, Math.min(tot - 100, D.ha + dy)), sum = D.ga + D.gb;
        D.na = r2(sum * nh / tot); D.nb = r2(sum - D.na);
        D.A.style.flexGrow = D.na; D.B.style.flexGrow = D.nb;
        D.el.style.top = (parseFloat(D.el.style.top) + (e.clientY - (D.ly || D.sy)) / D.z) + 'px'; D.ly = e.clientY;
        return;
      }
      if (D.kind === 'box') {
        if (D.gh) { const wr = wrap.getBoundingClientRect(); D.gh.style.left = ((e.clientX - wr.left) / D.z - D.gx) + 'px'; D.gh.style.top = ((e.clientY - wr.top) / D.z - D.gy) + 'px'; }
        const c = tab._ph ? R.querySelector('.pcol') : colAt(e.clientX); if (!c) return;   // telefonda tek sütun
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs') && x !== D.el);
        let before = null;
        for (let i = 0; i < bx.length; i++) { const r = bx[i].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { before = bx[i]; break; } }
        // kutu hemen oraya geçer (sütunun boş yer tutucusu varsa onun önüne)
        const ref = before || (bx.length ? bx[bx.length - 1].nextSibling : (c.firstChild || null));
        if (D.el.parentNode !== c || (ref !== D.el && D.el.nextSibling !== ref)) { try { c.insertBefore(D.el, ref); } catch (x) {} }
        D.target = tab._ph ? { ph: true } : { col: +c.getAttribute('data-col'), sub: +c.getAttribute('data-sub'), before: before ? before.getAttribute('data-secs').split(',')[0] : null };
        return;
      }
      if (D.kind === 'item') {
        clearMarks(); D.target = null;
        if (D.gh) { const wr = wrap.getBoundingClientRect(); D.gh.style.left = ((e.clientX - wr.left) / D.z - D.gx) + 'px'; D.gh.style.top = ((e.clientY - wr.top) / D.z - D.gy) + 'px'; }
        const under = R.elementFromPoint ? R.elementFromPoint(e.clientX, e.clientY) : null; if (!under) return;
        const srcType = typeOf(D.el.getAttribute('data-sec'));
        const it = under.closest ? under.closest('[data-idx]') : null;
        // aynı türden öğenin üstünde (karo karonun, çubuk çubuğun): öğe hemen oraya taşınır, ötekiler kayar
        // telefonda öğe yalnız kendi bölümünde yer değiştirir (telefona özel öğe sırası)
        if (tab._ph && it && it !== D.el && it.getAttribute('data-sec') !== D.el.getAttribute('data-sec')) return;
        if (it && it !== D.el && it.classList[0] === D.el.classList[0] && typeOf(it.getAttribute('data-sec')) === srcType) {
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile') || it.classList.contains('bar') || it.classList.contains('cam');
          const after = horiz ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
          const ref = after ? it.nextSibling : it;
          if (ref !== D.el && D.el.nextSibling !== ref) it.parentNode.insertBefore(D.el, ref);
          D.live = true;
          return;
        }
        if (it === D.el || tab._ph) return;
        // başka türden öğe (ör. karo bölümünde satır): eski işaretle gösterilir
        if (it && it !== D.el && typeOf(it.getAttribute('data-sec')) === srcType) {
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile') || it.classList.contains('bar');
          const after = horiz ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
          it.classList.add(horiz ? (after ? 'dropr' : 'dropl') : (after ? 'dropd' : 'dropt'));
          D.target = { sec: it.getAttribute('data-sec'), idx: +it.getAttribute('data-idx') + (after ? 1 : 0) };
          return;
        }
        // öğenin üstünde değil: aynı türden bir bölümün kutusuna bırakılırsa sona eklenir
        const bx = under.closest ? under.closest('.box[data-secs]') : null;
        if (bx && !(D.live && bx.contains(D.el))) {   // canlı taşınan öğe bu kutudaysa yeri zaten belli
          const sid = bx.getAttribute('data-secs').split(',').filter((id) => typeOf(id) === srcType)[0];
          if (sid) { bx.classList.add('dropin'); const s = secById(tab, sid); D.target = { sec: sid, idx: listOf(JSON.parse(JSON.stringify(s))).length }; }
        }
      }
    };
    const up = () => {
      if (!D) return;
      const d = D; D = null;
      clearMarks();
      const ln = R.querySelector('.dropline'); if (ln) ln.remove();
      if (d.el) d.el.classList.remove('dragging');
      if (d.gh) d.gh.remove();
      if (!d.on) return;   // sürüklenmedi: tıklama olarak kalır
      // canlı taşınan öğe: yeni yeri yanındaki öğeden okunur (sonraki öğenin önü ya da öncekinin arkası)
      let liveT = null;
      if (d.kind === 'item' && d.live && !d.target) {
        const sib = (fw) => { let x = fw ? d.el.nextElementSibling : d.el.previousElementSibling; while (x && !x.hasAttribute('data-idx')) x = fw ? x.nextElementSibling : x.previousElementSibling; return x; };
        const nx = sib(true), pv = sib(false);
        liveT = nx ? { sec: nx.getAttribute('data-sec'), idx: +nx.getAttribute('data-idx') } : pv ? { sec: pv.getAttribute('data-sec'), idx: +pv.getAttribute('data-idx') + 1 } : null;
      }
      // telefonda bölüm sırası: kutuların son dizilişi (gizli bölümler zaten kopyada yok, yönetim paneli onları yerinde tutar)
      const phOrd = d.kind === 'box' && tab._ph ? arr(R.querySelectorAll('.pcol > .box[data-secs]')).map((b) => b.getAttribute('data-secs').split(',')[0]) : null;
      // telefonda öğe sırası: bölümdeki öğelerin son dizilişi, öğe anahtarlarıyla
      let phItems = null;
      if (d.kind === 'item' && tab._ph && d.live) {
        const sid = d.el.getAttribute('data-sec'), S0 = secById(tab, sid), bxe = d.el.closest('.box[data-secs]');
        if (S0 && bxe) phItems = { sec: sid, keys: arr(bxe.querySelectorAll('[data-idx][data-sec="' + sid + '"]')).map((x) => lhdItemKey((S0.entities || [])[+x.getAttribute('data-idx')])) };
      }
      // değişiklik olmazsa (ya da kaydedilmezse) öğe/kutu eski yerine döner; kaydedilirse pano zaten yeniden çizilir
      if (d.home && d.home.p) { try { d.home.p.insertBefore(d.el, d.home.n && d.home.n.parentNode === d.home.p ? d.home.n : null); } catch (e) {} }
      if (liveT) d.target = liveT;
      arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => { x.style.display = ''; });
      this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
      if (d.kind === 'col') { const nt = clone(); nt.columns = d.W; return emit(nt); }
      if (d.kind === 'gmove' || d.kind === 'gsize') {
        const nt = clone(), key = d.C === 6 ? 'gm' : 'g';
        (nt.sections || []).forEach((s) => { const p = d.pos[s.id]; if (p) s[key] = { x: p.x, y: p.y, w: p.w, h: p.h }; });
        if (d.C === 6) nt.gm_own = true;
        return emit(nt);
      }
      if (d.kind === 'row') {
        if (d.na === undefined) return;
        const nt = clone();
        const ha = secById(nt, d.A.getAttribute('data-secs').split(',')[0]), hb = secById(nt, d.B.getAttribute('data-secs').split(',')[0]);
        if (ha) ha.grow = d.na; if (hb) hb.grow = d.nb;
        return emit(nt);
      }
      if (phItems) { lpFire(this, 'lhd-phitems', phItems); return; }
      if (tab._ph && d.kind === 'item') return;
      if (phOrd) { if (d.target && phOrd.join() !== (tab.sections || []).map((x) => x.id).join()) lpFire(this, 'lhd-phorder', { tab: tab.id, order: phOrd }); return; }
      if (d.kind === 'box' && d.target) {
        const nt = clone(), group = d.el.getAttribute('data-secs').split(',');
        const moving = nt.sections.filter((s) => group.indexOf(s.id) >= 0), rest = nt.sections.filter((s) => group.indexOf(s.id) < 0);
        const spl = lpSplits(nt, lpWeights(nt).length);
        const subOf = (x) => Math.min(x.sub || 0, (spl[x.col || 0] || 1) - 1);
        moving.forEach((x) => { x.col = d.target.col; if (d.target.sub) x.sub = d.target.sub; else delete x.sub; });
        let at = rest.length;
        if (d.target.before) at = rest.map((x) => x.id).indexOf(d.target.before);
        else { for (let i = rest.length - 1; i >= 0; i--) if ((rest[i].col || 0) === d.target.col && subOf(rest[i]) === d.target.sub) { at = i + 1; break; } }
        if (at < 0) at = rest.length;
        nt.sections = rest.slice(0, at).concat(moving, rest.slice(at));
        if (JSON.stringify(nt.sections) !== JSON.stringify(tab.sections)) emit(nt);
        return;
      }
      if (d.kind === 'item' && d.target) {
        const nt = clone(), sid = d.el.getAttribute('data-sec'), si = +d.el.getAttribute('data-idx');
        const src = secById(nt, sid), dst = secById(nt, d.target.sec);
        if (!src || !dst) return;
        let di = d.target.idx;
        if (src === dst && si < di) di--;
        if (src === dst && si === di) return;
        const obj = listOf(src).splice(si, 1)[0];
        listOf(dst).splice(di, 0, obj);
        emit(nt);
      }
    };
    if (this._edDown && this._edWrap) this._edWrap.removeEventListener('pointerdown', this._edDown);
    if (this._edMove) { window.removeEventListener('pointermove', this._edMove); window.removeEventListener('pointerup', this._edUp); window.removeEventListener('pointercancel', this._edUp); }
    this._edWrap = wrap; this._edDown = down; this._edMove = move; this._edUp = up;
    wrap.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    if (window.ResizeObserver) { if (this._edRO) this._edRO.disconnect(); this._edRO = new ResizeObserver(() => { if (!D) place(); }); this._edRO.observe(wrap); }

    // tıklama: bölümü seç (sürüklemeden sonra gelen tıklama sayılmaz); boş sütundaki "+ Bölüm ekle" panelin menüsünü açar
    wrap.addEventListener('click', (e) => {
      if (this._dragged) return;
      const cd = e.target.closest ? e.target.closest('[data-coldel]') : null;
      if (cd) return lpFire(this, 'lhd-coldel', { col: +cd.getAttribute('data-coldel') });
      const ad = e.target.closest ? e.target.closest('[data-addsec]') : null;
      if (ad) { const p = ad.getAttribute('data-addsec').split(':'); return lpFire(this, 'lhd-addsec', { col: +p[0], sub: +p[1], x: e.clientX, y: e.clientY }); }
      const bx = e.target.closest ? e.target.closest('.box[data-secs]') : null; if (!bx) return;
      const hit = e.target.closest('[data-sec]');
      lpFire(this, 'lhd-select', { section: hit ? hit.getAttribute('data-sec') : bx.getAttribute('data-secs').split(',')[0] });
    });
  }

  // kaydırmalı çubuğu çiz: dolgu değer kadar (ışığın renginde), simge renkli, altta yüzde ya da durum.
  // v verilirse (kaydırırken) o değer gösterilir; yoksa cihazın durumu (gönderilen değer yerleşene kadar o).
  _paintBar(el, st, v, fx) {
    if (!st) return;
    const a = st.attributes, it = el._item || {}, d = st.entity_id.split('.')[0], lang = this._lang;
    if (typeof v !== 'number') {
      v = lpBarVal(st);
      if (el._settle) { if (Date.now() < el._settle.until && Math.abs(el._settle.v - v) > 1) v = el._settle.v; else el._settle = null; }
    }
    if (fx === undefined) fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(st.entity_id)]) : null);
    const on = v > 0 || LP_ON.indexOf(st.state) >= 0, na = st.state === 'unavailable' || st.state === 'unknown';
    const rgb = a.rgb_color && a.rgb_color[0] + a.rgb_color[1] + a.rgb_color[2] >= 12 ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
    el.className = 'bar' + (on && !na ? ' on' : '') + (na ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '') + (el._drag ? ' drag' : '') + (el._fb ? ' fbk' : '');
    el.style.setProperty('--bar-c', fx ? fx.c[0] : (d === 'light' && rgb ? rgb : LP_BAR_COLOR));
    el.style.setProperty('--p', (na ? 0 : v) + '%');
    if (on && !na && !fx && d === 'light' && rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
    const ic = this._icSwap(el, st, it, 1), nm = el.querySelector('.nm'), pc = el.querySelector('.pc');
    nm.textContent = this._tx(it.name) || a.friendly_name || st.entity_id;
    let txt;
    if (na) txt = t(lang, 'unavailable');
    else if (lpBarCan(st) && (on || d === 'cover')) txt = v + '%';
    else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
    pc.textContent = txt;
  }

  // karo / çubuk simgesi (span.lic.mdic): öğenin simgesi, varlığın HA'daki simgesi ya da durumuna göre varsayılan, hepsi setten.
  // Durum değişince (kapı açıldı, priz kapandı) simge de değişir. Set yüklenmediyse boş kalır. i: simgenin öğedeki sırası.
  // own: öğenin istediği simge (verilmezse it.icon; değer karosunda duruma göre icon_on/icon_off).
  // Açıkça verilen simgenin sette karşılığı yoksa HA'nın düz simgesi (ha-icon) çizilir; ampul ya da noktaya dönmez.
  _icSwap(el, st, it, i, own, mono) {
    if (own === undefined) own = it.icon;
    const old = el.children[i];
    if (!old) return old;
    if (lpIsLecIcon(own)) {
      if (old.getAttribute('data-n') === own) return old;
      const tmp = document.createElement('div'); tmp.innerHTML = lpIcon(own);
      const x = tmp.firstChild; x.setAttribute('data-n', own); el.replaceChild(x, old); return x;
    }
    if (!LP_MDIC.map) { lpMdicLoad(); return old; }
    if (own && lpIconFlat(own)) {
      if (old.getAttribute('data-n') !== 'ha:' + own) { old.setAttribute('data-n', 'ha:' + own); old.className = 'lic haic'; old.innerHTML = '<ha-icon icon="' + esc(own) + '"></ha-icon>'; }
      return old;
    }
    const k = lpMdicKey(lpEntIcon(st, own)) || lpMdicKey(lpStateIconName(st)) || LP_MDIC_FALLBACK;
    // renk verilmiş öğede simge tek renk (currentColor) çizilir, rengi CSS'ten (--ic)
    const key = mono ? k + '#m' : k;
    if (old.getAttribute('data-n') !== key) { old.setAttribute('data-n', key); old.className = 'lic mdic'; old.innerHTML = mono ? lpMono(k) : lpMdicGet(k); }
    return old;
  }
  // öğenin renkleri: simge rengi (color), açıkken renk (color_on), eşiğe göre renk (zones), arka plan tonu (bg). Simge tek renge geçerse true
  _colorize(el, it, st, on) {
    const mc = lpMapColor(it, this._hass.states), z0 = lpZone(it, st) || mc, z = z0 ? (LP_HALO_RGB[z0] || z0) : null;
    const col = z || (on && it.color_on) || (LP_HALO_RGB[it.color] || it.color) || '';
    if (col) el.style.setProperty('--ic', col); else el.style.removeProperty('--ic');
    if (col) el.classList.add('icc');
    if (z) { el.style.setProperty('--tile-rgb', z); el.classList.add('zc'); }
    else if (on && it.color_on) el.style.setProperty('--tile-rgb', it.color_on);
    if (it.bg) el.style.setProperty('background-color', lpHexA(it.bg, 0.22));
    return !!col;
  }

  // A7 onay: öğede confirm verildiyse ("Evi Kapa" gibi) dokununca önce sorulur
  _confirm(it, fn) {
    if (!it || !it.confirm) return fn();
    const st = it.entity ? this._hass.states[it.entity] : null;
    const name = this._tx(it.name) || (st && st.attributes.friendly_name) || it.entity || '';
    LemurCardPopup.confirm(this._hass, this._lang, typeof it.confirm === 'string' ? this._tx(it.confirm) : lpCardT(this._lang, 'ask', { n: name }), fn);
  }
  // A6 şablon metin: {{ }} / {% %} içeren yazı Home Assistant'ta çözülür (render_template), sonuç gelince yeniden çizilir
  _tx(s) {
    if (!lpIsTpl(s)) return s || '';
    if (!this._tplCb) this._tplCb = () => { if (this._tplT) return; this._tplT = setTimeout(() => { this._tplT = null; this._repaint(); }, 60); };
    const v = lpTpl(this._hass, s, this._tplCb);
    return v === null ? '…' : v;
  }
  // aç/kapat dokunuşu: karoyu hemen beklenen durumda çiz, süre dolunca gerçeğe göre yeniden çiz
  _optTap(id) {
    if (!lpOptToggle(this._hass, id) || !this._sig) return;
    delete this._last[id]; this._update();
    setTimeout(() => { if (this._sig && this._hass) { delete this._last[id]; this._update(); } }, LP_OPT_MS + 100);
  }
  _repaint() {
    if (!this._hass || !this._sig) return;
    this._last = {};
    [this._vals, this._ents].forEach((L) => (L || []).forEach((el) => el.removeAttribute('data-p')));
    this._update();
  }
  // A5 ikinci satır: 'state' durum, 'last_changed' son değişim, 'attr:ad' öznitelik, ya da şablon metin
  _sec2(it, st) {
    const s = it && it.secondary; if (!s) return null;
    if (s === 'last_changed') this._hasAgo = true;
    if (s === 'state') return st ? lpValText(this._hass, st, this._lang) : '';
    if (s === 'last_changed') { if (!st) return ''; const ms = Date.now() - Date.parse(st.last_changed); return ms < 60000 ? lpPetT(this._lang, 'now') : lpPetT(this._lang, 'ago', { t: lpPetDur(this._lang, ms) }); }
    if (s.indexOf('attr:') === 0) {
      const k = s.slice(5), v = st && st.attributes ? st.attributes[k] : undefined;
      if (v === undefined || v === null) return '';
      if (this._hass.formatEntityAttributeValue) { try { return String(this._hass.formatEntityAttributeValue(st, k)); } catch (e) {} }
      return String(v);
    }
    return this._tx(s);
  }

  // Öğe eylemi (dokun / basılı tut / düğme). a:
  //   'more-info' | 'toggle' | 'none'                     cihaz penceresi, aç/kapat, hiçbir şey
  //   { service: 'timer.start', target, data }            servis çalıştır (target: varlık kimliği, liste ya da { entity_id })
  //   { popup: { title, card } }                          kartı panonun kendi penceresinde aç
  //   { action: 'more-info' | 'toggle' | 'navigate' | 'perform-action', ... }   HA'nın kart biçimi de olur
  // a yoksa def (varsayılan) yapılır. id: öğenin varlığı
  _act(a, id, def) {
    const h = this._hass;
    if (a === undefined || a === null || a === '') a = def;
    if (!a) return;
    if (typeof a === 'string') {
      if (a === 'more-info') { if (id) lpFire(this, 'hass-more-info', { entityId: id }); return; }
      if (a === 'toggle') {
        if (!id) return;
        this._optTap(id);
        // yedek kontrolü olan lamba: entegrasyon önce hızlı yoldan dener, cevap gelmezse yedekten gönderir (twins.py)
        if (lpTwinOf(id)) h.callService('lemur_home_dashboard', 'control', { entity_id: id, action: 'toggle' });
        else h.callService('homeassistant', 'toggle', { entity_id: id });
        return;
      }
      return;
    }
    if (typeof a !== 'object') return;
    if (a.popup) { const pp = lhdIsObj(a.popup) ? a.popup : {}; LemurCardPopup.open(h, { title: pp.title, card: pp.card }, this._lang); return; }   // pencere içeriği yalnız kart
    const sv = a.service || a.perform_action;
    if (!sv && typeof a.action === 'string') {
      if (a.action === 'navigate' && a.navigation_path) { history.pushState(null, '', a.navigation_path); lpFire(window, 'location-changed', { replace: false }); return; }
      if (a.action === 'url' && lhdSafeUrl(a.url_path)) { window.open(a.url_path, '_blank', 'noopener'); return; }
      if (a.action === 'more-info' || a.action === 'toggle') this._act(a.action, a.entity || id); 
      return;
    }
    if (typeof sv !== 'string' || sv.indexOf('.') < 0) return;
    const p = sv.split('.'), d = Object.assign({}, a.data || a.service_data || {}), tg = a.target;
    if (typeof tg === 'string' || Array.isArray(tg)) d.entity_id = tg;
    else if (tg && typeof tg === 'object') Object.keys(tg).forEach((k) => { d[k] = tg[k]; });
    h.callService(p[0], p[1], d);
  }

  // sade satır (iklim ve süpürge, ayar climate_style = rows): tek satırda simge, ad, durum ve en sık kullanılan düğmeler
  // (iklimde hedef − +, süpürgede başlat/duraklat ve istasyon). Satıra dokununca altı açılır: aç/kapat, mod, fan, salınım
  // ya da durdur, bul, emiş gücü (yalnız cihazın desteklediği). Hedef değişikliği bir an bekletilip tek komut gider;
  // birlikte kontrol edilen ikinci iklim cihazı (entities) aynı komutu alır.
  _paintClr(el) {
    const S = this._hass.states, lang = this._lang, it = el._item || {}, st = S[it.entity], vac = el.classList.contains('vac');
    const key = [st, S[it.temperature_sensor], S[it.humidity_sensor], el._tgt, el._menu, el._open].map((x) => (x && x.last_updated) || x).join('|');
    if (el._key === key) return;
    el._key = key;
    const cls = 'clr' + (vac ? ' vac' : '') + (el._open ? ' open' : '');
    if (!st) { el.className = cls + ' na'; el.innerHTML = '<div class="cl1"><div class="ct"><b>' + esc(it.name || it.entity) + '</b><span>' + esc(t(lang, 'unavailable')) + '</span></div></div>'; return; }
    const a = st.attributes, mode = st.state, na = mode === 'unavailable' || mode === 'unknown';
    const f1 = (x) => (Math.round(x * 10) / 10).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-GB');
    const ib = (c, icon, on) => '<button class="cib' + (on ? ' on' : '') + '" data-c="' + c + '"><ha-icon icon="' + icon + '"></ha-icon></button>';
    const chip = (k, label, v, on) => '<button class="cch' + (label ? '' : ' one') + (el._menu === k ? ' sel' : '') + (on ? ' on' : '') + '" data-c="' + k + '">' + (label ? '<i>' + esc(label) + '</i>' : '') + '<b>' + esc(v) + '</b></button>';
    const name = esc(this._tx(it.name) || a.friendly_name || it.entity);
    let sub, right = '', stepH = '', more = '', opts = [], curO = null, omap = LP_FANW, kind = 'off';
    if (vac) {
      const busy = mode === 'cleaning';
      kind = busy ? 'cool' : mode === 'error' ? 'err' : mode === 'returning' ? 'heat' : 'off';
      sub = '<em>' + esc(lpClW(LP_VAC, lang, mode)) + '</em>' + (typeof a.battery_level === 'number' ? ' · ' + lpEnPct(a.battery_level, lang) : '');
      // kapalı satırda tek düğme (başlat ya da duraklat), dar telefonda ad sığsın. Açıkken sağdaki düğme gizlenir,
      // yerine iklimdeki hedef alanı gibi iki büyük düğme gelir: başlat/duraklat ve istasyona dön (v0.28.9)
      if (!na && !el._open) right = ib(busy ? 'vpause' : 'vstart', busy ? 'mdi:pause' : 'mdi:play', busy);   // kapalıyken tek düğme; istasyona dön açınca
      const big = (c, icon, label, on, off) => '<button class="cbig' + (on ? ' on' : '') + '" data-c="' + c + '"' + (off ? ' disabled' : '') + '><ha-icon icon="' + icon + '"></ha-icon><span>' + esc(label) + '</span></button>';
      if (!na) stepH = '<div class="cstep cvac">' + big(busy ? 'vpause' : 'vstart', busy ? 'mdi:pause' : 'mdi:play', t(lang, busy ? 'cl_pause' : 'cl_start'), busy) + big('vdock', 'mdi:home-import-outline', t(lang, 'cl_dock'), mode === 'returning', mode === 'docked') + '</div>';
      const fs = a.fan_speed_list || [];
      more = chip('vstop', '', t(lang, 'cl_stop')) + chip('vloc', '', t(lang, 'cl_find')) + (fs.length ? chip('vfan', t(lang, 'cl_suction'), lpClW(LP_FANW, lang, a.fan_speed || '–')) : '');
      if (el._menu === 'vfan') { opts = fs; curO = a.fan_speed; }
    } else {
      const on = !na && mode !== 'off';
      kind = !on ? 'off' : /cool/.test(mode) || a.hvac_action === 'cooling' ? 'cool' : /heat/.test(mode) || a.hvac_action === 'heating' ? 'heat' : mode === 'dry' ? 'dry' : 'fan';
      const cur = lpNum(S[it.temperature_sensor]) !== null ? lpNum(S[it.temperature_sensor]) : (typeof a.current_temperature === 'number' ? a.current_temperature : null);
      const hum = lpNum(S[it.humidity_sensor]) !== null ? lpNum(S[it.humidity_sensor]) : (typeof a.current_humidity === 'number' ? a.current_humidity : null);
      const tgt = typeof el._tgt === 'number' ? el._tgt : (typeof a.temperature === 'number' ? a.temperature : null);
      const act = na ? t(lang, 'unavailable') : a.hvac_action ? lpClW(LP_HACT, lang, a.hvac_action) : lpClW(LP_HVAC, lang, mode);
      sub = '<em>' + esc(act) + '</em>' + (cur !== null ? ' · ' + esc(t(lang, 'cl_now')) + ' ' + f1(cur) + '°' : '') + (hum !== null && el._open ? ' · ' + lpEnPct(hum, lang) : '');
      // kapalıyken sağda yalnız hedef; karta dokununca açılır, hedef − + ve öbür ayarlar altta
      if (tgt !== null && !na) {
        right = el._open ? '' : '<b class="ctg ctv">' + f1(tgt) + '°</b>';
        stepH = '<div class="cstep"><button class="cbt" data-c="dn">−</button><b class="ctg">' + f1(tgt) + '°</b><button class="cbt" data-c="up">+</button></div>';
      }
      const modes = (a.hvac_modes || []).filter((m) => m !== 'off'), fans = a.fan_modes || [], sw = a.swing_modes || [];
      more = chip('pw', t(lang, 'cl_power'), on ? t(lang, 'on') : t(lang, 'off'), on) +
        (modes.length > 1 ? chip('mode', t(lang, 'cl_mode'), on ? lpClW(LP_HVAC, lang, mode) : '–') : '') +
        (fans.length ? chip('fan', t(lang, 'cl_fan'), lpClW(LP_FANW, lang, a.fan_mode || '–')) : '') +
        (sw.length ? chip('swing', t(lang, 'cl_swing'), lpClW(LP_FANW, lang, a.swing_mode || '–')) : '');
      if (el._menu === 'mode') { opts = modes; curO = mode; omap = LP_HVAC; }
      if (el._menu === 'fan') { opts = fans; curO = a.fan_mode; }
      if (el._menu === 'swing') { opts = sw; curO = a.swing_mode; }
    }
    if (el._open && !na) right = '<button class="cib" data-c="info" title="' + esc(t(lang, 'cl_more')) + '"><ha-icon icon="mdi:information-outline"></ha-icon></button>';   // açıkken ayrıntılar başlıkta
    let h = '<div class="cl1"><span class="cli">' + lpIcon(lpEntIcon(st, it.icon)) + '</span><div class="ct" data-c="tog"><b>' + name + '</b><span>' + sub + '</span></div><div class="crt">' + right + '</div>' +
      (na ? '' : '<span class="chev"><ha-icon icon="mdi:chevron-' + (el._open ? 'up' : 'down') + '"></ha-icon></span>') + '</div>';
    if (el._open && !na) {
      h += stepH + (more ? '<div class="cl2 n' + (more.split('class="cch').length - 1) + '">' + more + '</div>' : '');
      if (opts.length) h += '<div class="cmenu">' + opts.map((o) => '<button class="cop' + (o === curO ? ' sel' : '') + '" data-o="' + esc(o) + '">' + esc(lpClW(omap, lang, o)) + '</button>').join('') + '</div>';
    }
    el.className = cls + ' k-' + kind + (na ? ' na' : '');
    el.innerHTML = h;
  }
  _clrBind(el) {
    const vac = el.classList.contains('vac');
    const ids = () => { const it = el._item || {}; return [it.entity].concat(vac ? [] : (it.entities || []).filter((x) => typeof x === 'string' && x.indexOf('climate.') === 0)); };
    const call = (dom, svc, data) => this._hass.callService(dom, svc, Object.assign({ entity_id: ids() }, data || {}));
    el.addEventListener('click', (e) => {
      const b = e.target && e.target.closest ? e.target.closest('[data-c], [data-o]') : null;
      const it = el._item || {}, st = this._hass.states[it.entity];
      if (!b || !st) { if (!b) { el._open = !el._open; el._menu = null; this._paintClr(el); } return; }
      const a = st.attributes, c = b.getAttribute('data-c'), o = b.getAttribute('data-o');
      if (o !== null) {
        const m = el._menu; el._menu = null;
        if (m === 'mode') call('climate', 'set_hvac_mode', { hvac_mode: o });
        else if (m === 'fan') call('climate', 'set_fan_mode', { fan_mode: o });
        else if (m === 'swing') call('climate', 'set_swing_mode', { swing_mode: o });
        else if (m === 'vfan') call('vacuum', 'set_fan_speed', { fan_speed: o });
        this._paintClr(el); return;
      }
      if (c === 'tog') { el._open = !el._open; el._menu = null; this._paintClr(el); return; }
      if (c === 'info') { lpFire(this, 'hass-more-info', { entityId: it.entity }); return; }
      if (c === 'pw') { call('climate', st.state === 'off' ? 'turn_on' : 'turn_off'); return; }
      if (c === 'vstart') { call('vacuum', 'start'); return; }
      if (c === 'vpause') { call('vacuum', 'pause'); return; }
      if (c === 'vdock') { call('vacuum', 'return_to_base'); return; }
      if (c === 'vstop') { call('vacuum', 'stop'); return; }
      if (c === 'vloc') { call('vacuum', 'locate'); return; }
      if (c === 'mode' || c === 'fan' || c === 'swing' || c === 'vfan') { el._menu = el._menu === c ? null : c; this._paintClr(el); return; }
      if (c === 'up' || c === 'dn') {
        const step = a.target_temp_step || (a.temperature_unit === '°F' ? 1 : 0.5), lo = typeof a.min_temp === 'number' ? a.min_temp : 5, hi = typeof a.max_temp === 'number' ? a.max_temp : 35;
        const base = typeof el._tgt === 'number' ? el._tgt : (typeof a.temperature === 'number' ? a.temperature : null); if (base === null) return;
        el._tgt = Math.max(lo, Math.min(hi, Math.round((base + (c === 'up' ? step : -step)) / step) * step));
        this._paintClr(el);
        clearTimeout(el._tmr);
        el._tmr = setTimeout(() => { const v = el._tgt; call('climate', 'set_temperature', { temperature: v }); setTimeout(() => { if (el._tgt === v) { el._tgt = null; this._paintClr(el); } }, 4000); }, 700);
      }
    });
  }

  // değer karosunu çiz: simge (duruma göre), değer (HA'nın biçimiyle, birimli), ad. Zamanlayıcı çalışırken geri sayar.
  _paintVal(el, st) {
    const it = el._item || {}, a = st.attributes || {}, d = st.entity_id.split('.')[0];
    const na = st.state === 'unavailable';
    // açık/kapalı durumu olanlar (ikili sensör, zamanlayıcı, kişi...) duruma göre renklenir; ölçüm gösterenler hep canlı
    const two = LP_VAL_ONOFF.indexOf(d) >= 0, on = two && LP_VAL_ON.indexOf(st.state) >= 0;
    el.className = (el._bar ? 'bar' : 'tile') + ' val' + (lpEnIsVal(st.entity_id) && !el._bar ? ' entl' : '') + (el._wide ? ' wide' : '') + (on ? ' on' : '') + (!two && !na ? ' live' : '') + (na ? ' na' : '');
    if (el._bar) el.style.setProperty('--p', '0%');
    el.style.removeProperty('--tile-rgb');
    const mono = this._colorize(el, it, st, on);
    const own = (on ? it.icon_on : (two ? it.icon_off : null)) || it.icon;
    this._icSwap(el, st, it, 0, own, mono);
    const nm = el.querySelector('.nm'), vl = el.querySelector(el._bar ? '.pc' : '.vl');
    const nmT = this._tx(it.name) || a.friendly_name || st.entity_id, vlT = lpValText(this._hass, st, this._lang);
    // swap: ad üstte büyük, değer altta
    nm.textContent = it.swap && !el._bar ? vlT : nmT;
    vl.textContent = it.swap && !el._bar ? nmT : vlT;
    const s2 = el.querySelector('.sl'); if (s2) s2.textContent = this._sec2(it, st) || '';
  }
  // düğme ya da satır görünümündeki varlık öğesi
  _paintEnt(el, st) {
    const it = el._item || {}, a = st.attributes || {}, d = st.entity_id.split('.')[0], row = el.classList.contains('vrow');
    const na = st.state === 'unavailable' || (!it._val && st.state === 'unknown');
    const two = !it._val || LP_VAL_ONOFF.indexOf(d) >= 0;
    const on = it._val ? two && LP_VAL_ON.indexOf(st.state) >= 0 : LP_ON.indexOf(st.state) >= 0;
    el.className = (row ? 'vrow' : 'scene ebtn') + (on ? ' on' : '') + (!two && !na ? ' live' : '') + (na ? ' na' : '') + (el._fb ? ' fbk' : '');
    const rgb = on && !it._val && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
    if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
    const mono = this._colorize(el, it, st, on);
    const own = (on ? it.icon_on : (two ? it.icon_off : null)) || it.icon;
    this._icSwap(row ? el : el.firstChild, st, it, 0, own, mono);
    const txt = it._val ? lpValText(this._hass, st, this._lang) : (na ? t(this._lang, 'unavailable') : (this._hass.formatEntityState ? lpValText(this._hass, st, this._lang) : (TXT[this._lang][st.state] ? t(this._lang, st.state) : st.state)));
    el.querySelector(row ? '.rn' : '.sn').textContent = this._tx(it.name) || a.friendly_name || st.entity_id;
    const s2 = this._sec2(it, st);
    el.querySelector(row ? '.rv' : '.sv').textContent = s2 !== null ? s2 : txt;
  }
  _timers() {
    const act = (this._vals || []).some((el) => { const st = this._hass.states[el.getAttribute('data-val')]; return st && st.entity_id.indexOf('timer.') === 0 && st.state === 'active'; });
    if (act && !this._tmr) this._tmr = setInterval(() => {
      if (!this.isConnected || !this._hass) return;
      (this._vals || []).forEach((el) => { const id = el.getAttribute('data-val'), st = this._hass.states[id]; if (st && id.indexOf('timer.') === 0 && st.state === 'active') { const vl = el.querySelector(el._bar ? '.pc' : '.vl'); if (vl) vl.textContent = lpValText(this._hass, st, this._lang); } });
    }, 1000);
    if (!act && this._tmr) { clearInterval(this._tmr); this._tmr = null; }
  }

  // --- durum güncellemesi (iskelete dokunmadan) ---
  // Saatte parlaklık: etkilenen ışıklar sekmedeki ışık karoları ve sekmenin odası (alanı) varsa o alandaki bütün ışıklar;
  // yalnız o an açık ve kısılabilir olanlar.
  _bbIds() {
    const h = this._hass, S = h.states, out = [], tab = this._bbTab;
    const add = (id) => {
      if (!id || id.split('.')[0] !== 'light' || out.indexOf(id) >= 0) return;
      const st = S[id]; if (st && st.state === 'on' && lpBarCan(st)) out.push(id);
    };
    (this._tiles || []).forEach((b) => add(b.getAttribute('data-light')));
    if (tab && tab.area) {
      const ents = h.entities || {}, devs = h.devices || {};
      Object.keys(ents).forEach((id) => {
        const e = ents[id];
        if (!e || e.hidden || e.entity_category || id.split('.')[0] !== 'light') return;
        const d = e.device_id && devs[e.device_id];
        if ((e.area_id || (d && d.area_id)) === tab.area) add(id);
      });
    }
    return out;
  }
  // kaydırınca etkilenecekler: açık ışıklar; hiçbiri açık değilse bu alandan en son kapatılanlar (yeniden açılır)
  _bbTargets() { const L = this._bbIds(); return L.length ? L : (this._bbLast || []); }
  _bbVal(L) {
    if (typeof this._bbDrag === 'number') return this._bbDrag;
    if (this._bbHold && Date.now() < this._bbHold.until) return this._bbHold.v;
    if (!L.length) return 0;
    let s = 0; L.forEach((id) => { s += lpBarVal(this._hass.states[id]); });
    return Math.round(s / L.length);
  }
  _bbPaint() {
    const el = this.shadowRoot && this.shadowRoot.querySelector('[data-bbar]');
    if (!el || !this._hass) return;
    const L = this._bbIds(), v = this._bbVal(L), lang = this._lang || 'tr';
    el.classList.toggle('bbon', L.length > 0);
    el.classList.toggle('bboff', !L.length && typeof this._bbDrag !== 'number');
    el.querySelector('.bbf').style.width = v + '%';
    el.querySelector('.bbv').textContent = v === 0 ? t(lang, 'off') : lpEnPct(v, lang);
  }
  // göreli kaydırma (panodaki çubuklar gibi): yatay hareket 8 px'i geçince başlar, dikey hareket sayfayı kaydırır;
  // bırakınca tek komut: %0 ise kapat, değilse brightness_pct. Gönderilen değer 3 sn ekranda kalır.
  _bbBind(el) {
    let down = false, mode = null, sx = 0, sy = 0, sv = 0, w = 1, pid = null;
    el.addEventListener('pointerdown', (e) => {
      if (!this._bbTargets().length) return;
      down = true; mode = null; sx = e.clientX; sy = e.clientY; pid = e.pointerId;
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!mode) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          mode = 'drag'; sv = this._bbVal(this._bbIds()); w = el.getBoundingClientRect().width || 1; sx = e.clientX;
          el.classList.add('bbdrag'); try { el.setPointerCapture(pid); } catch (x) {}
        } else if (Math.abs(dy) > 10) { down = false; return; }
      }
      if (mode === 'drag') {
        if (e.cancelable) e.preventDefault();
        this._bbDrag = Math.max(0, Math.min(100, Math.round(sv + (e.clientX - sx) / w * 100)));
        this._bbPaint();
      }
    });
    const finish = (send) => {
      if (!down) return;
      down = false; el.classList.remove('bbdrag');
      if (mode !== 'drag') return;
      const v = this._bbDrag, L = this._bbTargets(); this._bbDrag = null;
      if (send && typeof v === 'number' && L.length && !(this._config && this._config.demo)) {
        this._bbHold = { v: v, until: Date.now() + 3000 };
        if (v === 0) { this._bbLast = L.slice(); this._hass.callService('light', 'turn_off', { entity_id: L }); }
        else this._hass.callService('light', 'turn_on', { entity_id: L, brightness_pct: v });
        setTimeout(() => this._bbPaint(), 3100);
      }
      this._bbPaint();
    };
    el.addEventListener('pointerup', () => finish(true));
    el.addEventListener('pointercancel', () => finish(false));
  }
  // --- kameralar ---
  // Görüntü HA'nın kamera vekilinden gelir (entity_picture, içinde HA'nın birkaç dakikada bir yenilediği erişim anahtarı).
  // Yeni görüntü önce arkada yüklenir, hazır olunca değişir: karo yenilenirken kararıp parlamaz.
  _camLoad(el) {
    const p = el._pic; if (!p || el._busy) return;
    el._busy = true; el._at = Date.now();
    const url = p + (p.indexOf('?') >= 0 ? '&' : '?') + '_=' + el._at;
    const im = new Image();
    im.onload = () => { el._busy = false; el._fail = 0; const img = el.querySelector('img'); if (img) img.src = im.src; el.classList.add('ok'); el.classList.remove('nop'); };
    // Bazı kameralar bir süre istenmeyince ilk görüntüde hata verir (ör. 3B yazıcı kamerası: önce 500, sonra hep 200).
    // Tek hata görünmez: 2 ve 4 sn sonra yeniden denenir, eldeki son görüntü kalır. Üç kez üst üste alınamazsa
    // "Görüntü alınamıyor" (ör. tablet ekranı kapalı, kamera kapalı); sonra da yenileme aralığında denemeye devam edilir.
    im.onerror = () => {
      el._busy = false; el._fail = (el._fail || 0) + 1;
      if (el._fail >= 3) { el.classList.add('nop'); el.classList.remove('ok'); return; }
      el._at = Date.now() - (el._rf || 10) * 1000 + el._fail * 2000;   // _camTick 2 sn, sonra 4 sn içinde yeniden dener
    };
    im.src = this._hass && this._hass.hassUrl ? this._hass.hassUrl(url) : url;
  }
  _camTick() {
    if (document.hidden || !this.isConnected) return;
    const now = Date.now();
    (this._cams || []).forEach((el) => {
      if (el.classList.contains('na') || !el._pic) return;
      const it = el._item || {}, r = Math.max(2, Math.min(600, parseFloat(it.refresh) || parseFloat(it._secRef) || 10));   // öğenin ayarı, yoksa bölümün (cam_refresh)
      el._rf = r;
      if (now - el._at >= r * 1000) this._camLoad(el);
    });
  }
  _camOpen(el) {
    const id = el.getAttribute('data-cam'), st = this._hass.states[id], it = el._item || {};
    if (!st) return;
    const name = this._tx(it.name) || st.attributes.friendly_name || id;
    LemurCardPopup._open(this._hass, { title: name, card: { type: 'picture-entity', entity: id, camera_view: 'live', show_name: false, show_state: false }, wide: true }, this._lang);
  }
  // enerji kartlarını çiz: force değilse en çok 2 sn'de bir (güç sensörleri sık değişir); arada gelen değişiklik sonra çizilir
  _enPaint(force) {
    if (!this._ens || !this._ens.length || !this._hass) return;
    const now = Date.now();
    if (!force && now - this._enAt < 2000) {
      if (!this._enT) this._enT = setTimeout(() => { this._enT = null; this._enPaint(true); }, 2000 - (now - this._enAt));
      return;
    }
    if (this._tipHold) { if (!this._enT) this._enT = setTimeout(() => { this._enT = null; this._enPaint(true); }, 700); return; }
    clearTimeout(this._enT); this._enT = null; this._enAt = now;
    const h = this._hass, M = lpEnGet(h, this._lang), ph = lpIsPhone(this._config);
    this._enIds = lpEnIds(M); this._enLast = {};
    this._enIds.forEach((id) => { this._enLast[id] = h.states[id]; });
    this._ens.forEach((el) => {
      const html = lpEnCard(h, M, el._item || {}, this._lang, ph);
      if (el._html !== html) { el._html = html; el.innerHTML = html; }
    });
    this._tipShow();
    // ipuçları birden fazlaysa 6 sn'de bir sıradakine geçilir (yeniden çizmeden)
    const many = this._ens.some((el) => el.querySelectorAll('.entip').length > 1);
    if (many && !this._tipT) this._tipT = setInterval(() => { this._tipI = (this._tipI || 0) + 1; this._tipShow(); }, 6000);
    if (!many && this._tipT) { clearInterval(this._tipT); this._tipT = null; }
  }
  _tipShow() {
    (this._ens || []).forEach((el) => {
      const L = el.querySelectorAll('.entip'); if (!L.length) return;
      const k = (this._tipI || 0) % L.length;
      for (let i = 0; i < L.length; i++) L[i].classList.toggle('on', i === k);
    });
  }
  // İpucu olunca Enerji sekmesinin düğmesinde küçük nokta (Enerji sayfası → İpuçları, varsayılan kapalı)
  _enDot() {
    const R = this.shadowRoot, h = this._hass; if (!R || !h) return;
    const on = lpEnTipCfg().dot === true && lpEnTipCfg().on !== false && !this._config.edit && !this._config.demo;
    const tabs = on ? this._tabs().filter((T) => (T.sections || []).some((x) => x.type === 'energy' || lpEnOnly(x))) : [];
    let n = 0;
    if (tabs.length) { const M = lpEnGet(h, this._lang); n = M ? lpEnTips(h, M, this._lang).length : 0; }
    R.querySelectorAll('.navb[data-nav], .pbi[data-nav]').forEach((b) => { const id = b.getAttribute('data-nav'); b.classList.toggle('endot', n > 0 && tabs.some((T) => T.id === id)); });
    R.querySelectorAll('.pbi[data-cat="energy"]').forEach((b) => b.classList.toggle('endot', n > 0));   // telefonda kategori çubuğu
  }
  // dokunuşlar: kategori karosu o kategorinin cihazlarını açar, cihaz satırı cihaz penceresini
  _enBind(el) {
    // ipucu: dokununca ilgili cihaz, basılı tutunca "bunu gösterme" (bu cihazda)
    // eski Safari'de pointer olayı yok: dokunma ve fare ayrı
    let hold = null, held = false, touched = 0;
    const stop = () => { clearTimeout(hold); hold = null; this._tipHold = false; };
    const begin = (tg) => {
      const tp = tg && tg.closest ? tg.closest('[data-entip]') : null; if (!tp) return;
      held = false; stop();
      this._tipHold = true;   // basılıyken yeniden çizilmesin (eski Safari dokunuşu kopan düğüme gönderir)
      hold = setTimeout(() => { hold = null; held = true; this._tipHold = false; lpEnTipHide(tp.getAttribute('data-entip')); tp.classList.add('gone'); setTimeout(() => { this._enPaint(true); this._enDot(); }, 500); }, LP_HOLD_MS);
    };
    el.addEventListener('touchstart', (e) => { touched = Date.now(); begin(e.target); }, { passive: true });
    el.addEventListener('mousedown', (e) => { if (Date.now() - touched > 800 && e.button === 0) begin(e.target); });
    ['touchend', 'touchcancel', 'touchmove', 'mouseup', 'mouseleave'].forEach((ev) => el.addEventListener(ev, stop, { passive: true }));
    el.addEventListener('contextmenu', (e) => { if (e.target && e.target.closest && e.target.closest('[data-entip]')) e.preventDefault(); });
    el.addEventListener('click', (e) => {
      const tg = e.target && e.target.closest ? e.target : null; if (!tg) return;
      const tip = tg.closest('[data-entip]');
      if (tip) { if (held) { held = false; return; } const te = tip.getAttribute('data-tipent'); if (te && !this._config.demo) lpFire(this, 'hass-more-info', { entityId: te }); return; }
      const cat = tg.closest('[data-encat]'), more = tg.closest('[data-enmore]');
      if (cat) { this._enPop(cat.getAttribute('data-encat')); return; }
      if (more && more.getAttribute('data-enmore') && !this._config.demo) lpFire(this, 'hass-more-info', { entityId: more.getAttribute('data-enmore') });
    });
  }
  _enPop(catId) {
    const R = this.shadowRoot, M = lpEnGet(this._hass, this._lang); if (!R || !M) return;
    const old = R.querySelector('.enpop'); if (old) old.parentNode.removeChild(old);
    const box = document.createElement('div'); box.innerHTML = lpEnPopHtml(this._hass, M, catId, this._lang);
    const pop = box.firstChild; if (!pop) return;
    R.appendChild(pop);
    pop.addEventListener('click', (e) => {
      const t0 = e.target;
      const more = t0.closest ? t0.closest('[data-enmore]') : null;
      if (more && more.getAttribute('data-enmore') && !this._config.demo) { lpFire(this, 'hass-more-info', { entityId: more.getAttribute('data-enmore') }); return; }
      if (t0 === pop || (t0.closest && t0.closest('.enx'))) pop.parentNode.removeChild(pop);
    });
  }
  _update() {
    const h = this._hass, S = h.states, lang = this._lang;
    const RF = this.shadowRoot;   // katlanır grubun başlığında kaç öğe, kaçı açık
    if (RF) RF.querySelectorAll('[data-fcnt]').forEach((el) => { const n = +el.getAttribute('data-fn') || 0, on = el.getAttribute('data-fcnt').split(',').filter((id) => id && S[id] && LP_ON.indexOf(S[id].state) >= 0).length; const tx = t(lang, on ? 'fold_on' : 'fold_n', { n: n, on: on }); if (el.textContent !== tx) el.textContent = tx; el.classList.toggle('on', on > 0); });
    // LEC odalarındaki bir ışık değiştiyse o odada oynayan efekti yeniden sor
    if (this._lecRooms && this._lecRooms.length && !this._config.edit) {
      const seen = {};
      (this._watched || []).forEach((id) => { if (this._last[id] && S[id] !== this._last[id]) { const r = LEC.roomOf(id); if (r && !seen[r] && this._lecRooms.indexOf(r) >= 0) { seen[r] = 1; LEC.watch(h, r); } } });
    }
    (this._tiles || []).forEach((el) => {
      const id = el.getAttribute('data-light'), st = lpEff(S, id);
      lpOptRemember(S[id]);
      const fb = lpFbAt(id);
      if (el._fb !== fb) { el._fb = fb; delete this._last[id]; el.title = fb ? t(lang, 'fb', { t: new Date(fb).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) }) : ''; }
      if (!st || this._last[id] === st) return;
      const a = st.attributes, it = el._item || {}, on = LP_ON.indexOf(st.state) >= 0;
      // efekt: ışığın kendi efekti; yoksa LEC'in o odada oynattığı efekt (yanan ışıklarda)
      const fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(id)]) : null);
      if (el._bar) { if (!el._drag) this._paintBar(el, st, null, fx); return; }
      el.className = 'tile' + (el._wide ? ' wide' : '') + (on ? ' on' : '') + (st.state === 'unavailable' || st.state === 'unknown' ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '') + (el._fb ? ' fbk' : '');
      const rgb = on && !fx && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
      const mono = this._colorize(el, it, st, on);
      this._icSwap(el, st, it, 0, undefined, mono);
      el.querySelector('.nm').textContent = this._tx(it.name) || a.friendly_name || id;
      const s2 = el.querySelector('.sl'); if (s2) s2.textContent = this._sec2(it, st) || '';
    });
    (this._rows || []).forEach((el) => {
      const id = el.getAttribute('data-row'), st = S[id];
      if (!st || this._last[id] === st) return;
      const a = st.attributes;
      let txt;
      if (st.state === 'unavailable') txt = t(lang, 'unavailable');
      else if (st.state === 'playing') txt = a.media_title ? a.media_title + (a.media_artist ? ' · ' + a.media_artist : '') : t(lang, 'playing');
      else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
      el.className = 'row' + (st.state === 'playing' || st.state === 'on' ? ' on' : '');
      el.innerHTML = lpIcon(lpEntIcon(st)) + '<div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div>';
    });
    (this._clrs || []).forEach((el) => this._paintClr(el));
    (this._vals || []).forEach((el) => {
      const id = el.getAttribute('data-val'), st = S[id];
      if (!st || (this._last[id] === st && el.getAttribute('data-p'))) return;
      el.setAttribute('data-p', '1');
      this._paintVal(el, st);
    });
    (this._pets || []).forEach((el) => lpPetPaint(el, lang, Date.now()));
    (this._badges || []).forEach((el) => {
      const w = lpEnWSum(S, el._pw), lst = S[el.getAttribute('data-light')], on = !!lst && LP_ON.indexOf(lst.state) >= 0;
      let b = el.querySelector('.enb');
      if (w === null || !(on || lpEnBadge() === 'always')) { if (b) b.parentNode.removeChild(b); return; }
      if (!b) { b = document.createElement('span'); b.className = 'enb'; el.appendChild(b); }
      b.textContent = w > 0 && w < 10 && Math.round(w) !== w ? lpEnNum(w, 1, lang) + ' W' : lpEnWs(w, lang);
      b.classList.toggle('off', !on);
    });
    if (this._ens && this._ens.length) this._enPaint(false);
    (this._cams || []).forEach((el) => {
      const id = el.getAttribute('data-cam'), st = S[id];
      if (!st || this._last[id] === st) return;
      // görüntü yalnız Home Assistant'ın kendi adresinden (/api/camera_proxy/...): başka bir siteye istek gitmez
      const pic = typeof st.attributes.entity_picture === 'string' && /^\/[^\/\\]/.test(st.attributes.entity_picture) ? st.attributes.entity_picture : '';
      const it = el._item || {}, off = st.state === 'unavailable' || st.state === 'unknown' || !pic;
      el.classList.toggle('na', off);
      el.querySelector('.cnm').textContent = this._tx(it.name) || st.attributes.friendly_name || id;
      if (!off && el._pic !== pic) { el._pic = pic; el._at = 0; el._fail = 0; this._camLoad(el); }
    });
    (this._txEls || []).forEach((el) => { el.textContent = this._tx(el.getAttribute('data-tx')); });
    (this._ssEls || []).forEach((el) => { const it = el._item || {}; el.textContent = this._sec2(it, it.entity ? S[it.entity] : null) || ''; });
    (this._ents || []).forEach((el) => {
      const id = el.getAttribute('data-ent'), st = lpEff(S, id);
      lpOptRemember(S[id]);
      const fb = lpFbAt(id);
      if (el._fb !== fb) { el._fb = fb; el.removeAttribute('data-p'); el.title = fb ? t(lang, 'fb', { t: new Date(fb).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) }) : ''; }
      if (!st || (this._last[id] === st && el.getAttribute('data-p'))) return;
      el.setAttribute('data-p', '1');
      this._paintEnt(el, st);
    });
    this._timers();
    (this._watched || []).forEach((id) => { this._last[id] = S[id]; });
    this._bbPaint();
    // LEC düğmeleri: efekti oynuyorsa (ya da efekt ekranı düğmesinin odasında bir efekt oynuyorsa) yanar
    const R = this.shadowRoot;
    if (R) Array.prototype.forEach.call(R.querySelectorAll('.scene[data-lk]'), (el) => {
      const k = el.getAttribute('data-lk'), room = el.getAttribute('data-lroom');
      const on = k === 'play' ? LEC.isPlaying(room, el.getAttribute('data-lfx')) : (k === 'open' ? !!LEC.playing[room] : false);
      el.classList.toggle('on', on);
    });
  }
}
