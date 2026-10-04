// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Görünüm referans tablet panosuyla birebir (ölçüler base.css'te).
// Çizim iki aşamalı: iskelet sekme ya da ayar değişince bir kez kurulur (_build), durum değişince sadece karolar güncellenir (_update).
// Böylece gömülü kartların (iklim, süpürge) halesi ve karoların efekt animasyonu her durum değişiminde baştan başlamaz.
// Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
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
function lpFire(node, type, detail) {
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
function lpIsPhone(cfg) {
  if (cfg && typeof cfg.phone === 'boolean') return cfg.phone;
  return (window.innerWidth || 1280) < LP_PHONE_W;
}

// üst şeritteki Efektler düğmesi: LEC kuruluysa varsayılan açık
function lpLecNav(h) {
  const st = (STORE.data && STORE.data.settings) || {};
  return LEC.installed(h) && st.lec_nav !== false;
}

// Mevsim: ayarda yoksa aya göre (Mayıs-Eylül yaz). Kış'ta petek, Yaz'da klima kartları.
function lpSeason() {
  const d = STORE.data, s = d && d.settings && d.settings.season;
  if (s === 'summer' || s === 'winter') return s;
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 9 ? 'summer' : 'winter';
}

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._sig = null; if (this._hass) this._render(); }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) { LEC.load(h); STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    LemurLightPopup.update(h);
    if (!this._sig) return;
    (this._embeds || []).forEach((e) => { e.hass = h; });
    const w = this._watched || [];
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
    const m = this._missing || [];
    for (let i = 0; i < m.length; i++) if (h.states[m[i]]) { this._render(); return; }
  }
  connectedCallback() {
    if (!this._unsub) this._unsub = STORE.onChange((d) => {
      this._def = null;
      const st = (d && d.settings) || {};
      if (!this._config.edit) LemurScale.set(st.canvas || null, st.kiosk || null);   // ölçek ve kiosk ayarı canlı değişsin
      this._render();
    });
    if (!this._lecUnsub) this._lecUnsub = LEC.onChange((kind) => {
      if (kind === 'rooms') { this._sig = null; this._render(); return; }
      if (kind === 'effects' || kind === 'info') return;   // oda listesi değişti: izlenen ışıklar değişir
      this._last = {}; if (this._sig) this._update();                       // oynayan efekt değişti: karolar ve düğmeler
    });
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => this._render());   // LEC simgeleri yüklendi
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { this._sig = null; this._render(); });   // renkli simge seti yüklendi
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    // ekran döndürülünce ya da pencere daralınca telefon ↔ tablet görünümü
    if (!this._rsz) { this._rsz = () => { const p = lpIsPhone(this._config); if (p !== this._phone) { this._phone = p; this._sig = null; this._render(); } }; window.addEventListener('resize', this._rsz); }
    this._phone = lpIsPhone(this._config);
    if (this._hass) this._render();
  }
  disconnectedCallback() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._leciUnsub) { this._leciUnsub(); this._leciUnsub = null; }
    if (this._mdicUnsub) { this._mdicUnsub(); this._mdicUnsub = null; }
    clearInterval(this._clock); this._clock = null;
    if (this._rsz) { window.removeEventListener('resize', this._rsz); this._rsz = null; }
    if (this._edMove) { window.removeEventListener('pointermove', this._edMove); window.removeEventListener('pointerup', this._edUp); window.removeEventListener('pointercancel', this._edUp); this._edMove = null; }
    if (this._edRO) { this._edRO.disconnect(); this._edRO = null; }
    this._sig = null;   // geri takılınca baştan kurulsun (dinleyiciler yeniden bağlansın)
  }

  _tabs() {
    const d = STORE.data;
    if (d && d.tabs && d.tabs.length) return d.tabs;
    if (!this._def) this._def = buildDefaultTabs(this._hass, pickLang(this._hass));
    return this._def;
  }
  _tick() {
    const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time();
    this._ticks = (this._ticks || 0) + 1;
    if (this._ticks % 20 === 0 && this._def && this._hass) { this._def = null; this._render(); }   // otomatik düzen 5 dk'da bir tazelenir
  }
  _time() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states, lang = pickLang(h);
    const tabs = this._tabs();
    const tab = tabs.filter((x) => x.id === (this._config && this._config.tab))[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; this._sig = null; return; }
    const season = lpSeason();
    // iskeleti değiştiren her şey: sekme ayarı, mevsim, dil, var olan cihazlar
    const present = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => { const e = lpEnt(x); if (e && S[e.entity]) present.push(e.entity); }));
    const sig = JSON.stringify([tab, season, lang, present, tabs.map((x) => [x.id, x.name, x.icon]), lpHas('lemur-hd-climate-card'), LEC.installed(h), lpLecNav(h), lpIsPhone(this._config), !!this._config.edit, this._config.selected || '', !!LP_LECI.map, lpMdicOn(), !!LP_MDIC.map]);
    if (sig !== this._sig) { this._sig = sig; this._build(tab, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    tab = lhdNormTab(tab);
    const h = this._hass, S = h.states;
    if (this.getAttribute('lang') !== lang) this.setAttribute('lang', lang);
    const tiles = [], tileItems = [], rows = [], embeds = [];
    const lecRooms = {};   // bu sekmede LEC'ten oynayan efekti sorulacak odalar
    // ayarda olup şu an HA'da olmayan cihazlar: gelince (ör. HA yeniden başladıktan sonra) pano yeniden kurulur
    this._missing = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => { const e = lpEnt(x); if (e && !S[e.entity]) this._missing.push(e.entity); }));
    const edit = !!this._config.edit, selected = this._config.selected || '';
    const phone = lpIsPhone(this._config);
    let curSec = '';
    // her öğe hangi bölümün kaçıncı öğesi: düzenleme modunda sürükle-bırak için
    const mark = (i) => ' data-sec="' + esc(curSec) + '" data-idx="' + i + '"';
    const emb = (tag, cfg, id, i) => {
      if (!lpHas(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"' + mark(i) + '></div>'; }
      embeds.push({ tag: tag, cfg: Object.assign({ language: lang }, cfg) });
      return '<div class="emb" data-emb="' + (embeds.length - 1) + '"' + mark(i) + '></div>';
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
      if (s.look === 'bar' || (s.look === 'phone' && phone)) {
        const want = s.bar_columns || (items.length > 12 ? 3 : 2), bc = phone ? Math.min(want, 2) : Math.max(1, Math.min(want, Math.floor((inner + 8) / 158)));
        // tablette satırlar kutuyu doldurur ama bir çubuk kutunun altıda birinden uzun olmaz; telefonda ya da başka öğelerle birlikteyken sabit yükseklik
        const br = Math.max(6, Math.ceil(items.length / bc)), fillB = only && !phone;
        return '<div class="bars' + (fillB ? '' : ' fixed') + '" data-sec="' + esc(s.id) + '" style="grid-template-columns:repeat(' + bc + ',minmax(0,1fr))' + (fillB ? ';grid-template-rows:repeat(' + br + ',minmax(60px,1fr))' : '') + '">' +
          items.map((it) => {
            if (!it.entity) return '<div class="bar ph"' + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="bt"><div class="nm">' + esc(it.name || '') + '</div></div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="bar" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + mark(it._i) + '><div class="bf"></div>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<ha-state-icon></ha-state-icon>') + '<div class="bt"><div class="nm"></div><div class="pc"></div></div></div>';
          }).join('') + '</div>';
      }
      // 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
      // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
      const c = phone ? Math.min(s.tile_columns || 5, 3) : Math.max(1, Math.min(s.tile_columns || 5, Math.floor((inner + 8) / 78))), r = Math.ceil(items.length / c), fill = !phone && r >= 4;
      // başka öğelerle aynı kutudaysa karolar kalan yeri doldurur, gerekirse kısalır (kartlar kendi yüksekliğinde kalır)
      const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? (only ? 'minmax(84px,1fr)' : 'minmax(56px,1fr)') : '1fr') + ')';
      const open = fill ? '<div class="grid" data-sec="' + esc(s.id) + '" style="' + gs + '">'
        : '<div class="gsq" data-sec="' + esc(s.id) + '" style="padding-bottom:calc((100% - ' + (8 * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (8 * (r - 1)) + 'px)"><div class="grid" style="' + gs + '">';
      return open + items.map((it) => {
        if (!it.entity) return '<div class="tile ph"' + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="nm">' + esc(it.name || '') + '</div></div>';
        tiles.push(it.entity); tileItems.push(it);
        return '<div class="tile" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + mark(it._i) + '>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<ha-state-icon></ha-state-icon>') + '<div class="nm"></div></div>';
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
      return '<div class="scene' + (k ? ' lec' + (lecOn ? '' : ' na') : '') + '" style="--sc:' + esc(c) + '" data-scene="' + esc(s.id) + ':' + i + '"' + lec + mark(i) + '><div class="si">' + lpIcon(icon, '', 'color:' + esc(c)) + '</div><span>' + esc(name) + '</span></div>';
    };
    const bodyOf = (s) => {
      const lecOn = LEC.installed(h);
      const all = (s.entities || []).map((x, i) => {
        const k = lhdKind(x); if (!k) return null;
        const it = typeof x === 'string' ? { entity: x } : x;
        if (it.entity && !S[it.entity]) return null;                                // HA'da (şimdilik) yok
        if (k === 'scene' && lpLecKind(it) && !lecOn && !edit) return null;          // LEC kurulu değilse LEC düğmesi görünmez
        return Object.assign({ _i: i, _k: k === 'ph' ? 'tile' : k }, it);
      }).filter(Boolean);
      if (!all.length) return null;
      // iklim: bölümde hem klima hem petek varsa mevsime göre biri gösterilir (başlıkta Yaz/Kış düğmesi)
      const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
      const cl = all.filter((x) => x._k === 'climate'), both = cl.some(isAC) && cl.some((x) => !isAC(x));
      const items = both ? all.filter((x) => x._k !== 'climate' || (season === 'winter' ? !isAC(x) : isAC(x))) : all;
      if (!items.length) return null;
      const groups = [];
      items.forEach((x) => { const g = groups[groups.length - 1]; if (g && g.k === x._k && (x._k === 'tile')) g.items.push(x); else groups.push({ k: x._k, items: [x] }); });
      const hasTiles = groups.some((g) => g.k === 'tile'), onlyTiles = groups.length === 1 && hasTiles;
      const html = groups.map((g) => {
        if (g.k === 'tile') return tileGrid(s, g.items, onlyTiles);
        return g.items.map((x) => {
          if (x._k === 'scene') return sceneBtn(s, x, x._i);
          const c = Object.assign({}, x); delete c._i; delete c._k;
          if (x._k === 'climate') return emb('lemur-hd-climate-card', Object.assign(c, { type: 'custom:lemur-hd-climate-card' }), x.entity, x._i);
          if (x._k === 'vacuum') return emb('lemur-hd-vacuum-card', Object.assign(c, { type: 'custom:lemur-hd-vacuum-card' }), x.entity, x._i);
          rows.push(x.entity); return '<div class="row" data-row="' + esc(x.entity) + '"' + mark(x._i) + '></div>';
        }).join('');
      }).join('');
      // başlık biçimi: karo ya da düğmeyle başlayan bölüm büyük başlık, kartla başlayan küçük başlık
      const first = groups[0].k;
      return { kind: first === 'tile' || first === 'scene' ? 'md' : 'hd', spread: !hasTiles, mix: hasTiles && !onlyTiles, season: both, html: html };
    };

    // Her bölüm bir kutu. Yerleşim: kolonlar (genişlik oranı) ve her kolonun içinde 1-3 eşit sütun (tab.splits). Bölümün yeri: col + sub.
    // Düzenleme modunda boş bölüm de bir kutu olarak görünür (içine sürüklenebilsin diye).
    const widths = lpWeights(tab), splits = lpSplits(tab, widths.length);
    const cols = widths.map((w, i) => { const a = []; for (let j = 0; j < splits[i]; j++) a.push([]); return a; });
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0)), sj = Math.max(0, Math.min(splits[ci] - 1, s.sub || 0));
      curSec = s.id;
      let b = bodyOf(s);
      if (!b && edit) b = { kind: 'md', html: '<div class="eph" data-sec="' + esc(s.id) + '">' + esc(t(lang, 'edit_empty')) + '</div>' };
      if (!b) return;
      cols[ci][sj].push({ title: s.title || '', kind: b.kind, season: !!b.season, spread: b.spread, mix: b.mix, html: b.html, secs: [s.id], grow: s.grow || 1 });
    });
    const used = [];
    cols.forEach((c, i) => { if (edit || c.some((x) => x.length)) used.push(i); });   // düzenlemede boş kolon da görünür

    // Lemur Light Effect Card kuruluysa üst şeridin sonunda "Efektler": efekt ekranını bu sekmenin odasıyla açar (ayarlardan kapatılabilir)
    const navFx = lpLecNav(h) ? '<div class="navb fxb" data-navfx><div class="ni"><ha-icon icon="mdi:creation"></ha-icon></div><div class="nn">' + esc(t(lang, 'effects')) + '</div></div>' : '';
    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni">' + lpIcon(x.icon || 'mdi:home-outline') + '</div><div class="nn">' + esc(x.name) + '</div></div>').join('') +
      navFx + '<div class="clock">' + this._time() + '</div></div>';
    const seasonIcon = season === 'winter' ? '<ha-icon icon="mdi:snowflake" style="color:#7cc8ff"></ha-icon>' : '<ha-icon icon="mdi:white-balance-sunny" style="color:#ffc23d"></ha-icon>';
    // aynı sütunda birden çok kutu varsa yükseklikler "grow" oranında paylaşılır (düzenlemede aradaki çizgi sürüklenerek değişir)
    const boxHtml = (b, multi) => '<div class="box' + (b.spread ? ' spread' : '') + (b.mix ? ' mix' : '') + (edit && b.secs.indexOf(selected) >= 0 ? ' selbox' : '') + '" data-secs="' + esc(b.secs.join(',')) + '"' +
      (multi ? ' style="flex:' + b.grow + ' 1 0px;min-height:auto"' : '') + '>' +
      (edit ? '<div class="bgrip" title="' + esc(t(lang, 'drag_box')) + '"><ha-icon icon="mdi:drag"></ha-icon></div>' : '') +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    const subHtml = (i, j, boxes) => '<div class="sub" data-col="' + i + '" data-sub="' + j + '">' +
      (boxes.length ? boxes.map((b) => boxHtml(b, boxes.length > 1)).join('')
        : '<div class="box colempty"><span>' + esc(t(lang, 'col_empty')) + '</span><button class="addsec" data-addsec="' + i + ':' + j + '">+ ' + esc(t(lang, 'add_section')) + '</button></div>') + '</div>';
    let grid, body;
    if (phone) {
      // telefon: kolonlar soldan sağa, sütunlar sırayla alt alta; boş sütun yer kaplamaz
      grid = '';
      const bx = [];
      cols.forEach((c) => c.forEach((boxes) => boxes.forEach((b) => bx.push(b))));
      body = '<div class="pcol">' + (bx.length ? bx.map((b) => boxHtml(b, false)).join('') : '<div class="box empty">' + esc(t(lang, 'empty')) + '</div>') + '</div>';
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
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap' + (edit ? ' edit' : '') + (phone ? ' phone' : '') + '" style="' + grid + '">' + nav + body + '</div>';

    // gömülü kartlar
    this._embeds = [];
    R.querySelectorAll('[data-emb]').forEach((ph) => {
      const spec = embeds[+ph.getAttribute('data-emb')];
      const el = document.createElement(spec.tag);
      try { el.setConfig(spec.cfg); } catch (e) { ph.textContent = String((e && e.message) || e); return; }
      el.hass = h;
      ph.appendChild(el);
      this._embeds.push(el);
    });
    this._tiles = []; R.querySelectorAll('[data-light]').forEach((el) => { el._item = tileItems[+el.getAttribute('data-ti')]; el._bar = el.classList.contains('bar'); this._tiles.push(el); });
    this._rows = []; R.querySelectorAll('[data-row]').forEach((el) => this._rows.push(el));
    // LEC: karoların odaları da sorulur; efekt düğmesi olan odaların ışıkları izlenir (değişince oynayan efekt yeniden sorulur)
    tiles.forEach((id) => { const r = LEC.roomOf(id); if (r) lecRooms[r] = 1; });
    this._lecRooms = Object.keys(lecRooms).filter((r) => LEC.hasRoom(r));
    const lecLights = [];
    this._lecRooms.forEach((r) => LEC.lightsOf(r).forEach((id) => { if (tiles.indexOf(id) < 0 && lecLights.indexOf(id) < 0) lecLights.push(id); }));
    this._watched = tiles.concat(rows, lecLights);
    if (!edit && LEC.installed(h)) this._lecRooms.forEach((r) => LEC.query(h, r));
    this._last = {};
    this._lang = lang;

    // düzenleme modu (yönetim panelindeki önizleme): cihazlara dokunulmaz; tıklama seçer, sürükleme taşır, çizgiler boyutlandırır
    if (edit) { this._editBind(R, tab, widths, used); return; }
    // dokunuşlar
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      const base = location.pathname.split('/').slice(0, 2).join('/');
      // pano açıkken eklenen sekmenin HA'da henüz görünümü yok: sayfa baştan yüklenir, pano yeniden üretilir
      if (window.__LHD_VIEWS && window.__LHD_VIEWS.indexOf(id) < 0) { location.assign(base + '/' + id); return; }
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => lpFire(this, 'hass-more-info', { entityId: id });
    this._tiles.forEach((b) => {
      const id = b.getAttribute('data-light');
      // basılı tut: varsayılan bizim ışık penceremiz; ayarda seçildiyse HA'nın penceresi ya da LEC'in efekt ekranı (lambanın odasıyla)
      const hold = () => {
        const mode = lpHoldMode(), h = this._hass, d = id.split('.')[0];
        if (mode === 'lec' && LEC.installed(h) && LEC.open(h, LEC.roomOf(id) || tab.area)) return;
        if (mode !== 'ha' && (d === 'light' || d === 'switch' || d === 'input_boolean')) { LemurLightPopup.open(h, id, b._item, LEC.roomOf(id) || tab.area); return; }
        more(id);
      };
      const tap = () => this._hass.callService('homeassistant', 'toggle', { entity_id: id });
      if (!b._bar) { lpPress(b, tap, hold); return; }
      lpSlide(b, {
        tap: tap, hold: hold,
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
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => {
      const p = b.getAttribute('data-scene').split(':');
      const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      let it = s && s.entities && s.entities[+p[1]];
      if (typeof it === 'string') it = { entity: it };
      if (it && it.entity && !it.action) {   // düğme olarak eklenmiş betik, sahne, otomasyon, buton
        const d = it.entity.split('.')[0];
        const sv = d === 'automation' ? 'trigger' : (d === 'button' || d === 'input_button') ? 'press' : 'turn_on';
        this._hass.callService(d, sv, { entity_id: it.entity }); return;
      }
      if (!it || !it.action || !it.action.service) return;
      const lk = lpLecKind(it);
      if (lk === 'open') { LEC.open(this._hass, it.action.room || tab.area); return; }
      if (lk) { LEC.run(this._hass, it.action); return; }
      const sv = it.action.service.split('.');
      this._hass.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }));
    R.querySelectorAll('[data-season]').forEach((b) => lpPress(b, () => STORE.season(lpSeason() === 'winter' ? 'summer' : 'winter')));
    R.querySelectorAll('[data-navfx]').forEach((b) => lpPress(b, () => LEC.open(this._hass, tab.area)));
  }

  // --- düzenleme modu: tıkla seç, sürükle taşı, çizgiden boyutlandır ---
  // Kart değişikliği kendisi kaydetmez; yeni sekme ayarını 'lhd-change' ile yönetim paneline verir, panel kaydeder.
  _editBind(R, tab, widths, used) {
    const wrap = R.querySelector('.wrap');
    const clone = () => JSON.parse(JSON.stringify(tab));
    const emit = (nt) => lpFire(this, 'lhd-change', { tab: nt });
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
        if (D.kind === 'box' || D.kind === 'item') D.el.classList.add('dragging');
        if (D.kind === 'col' || D.kind === 'row') arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => { if (x !== D.el) x.style.display = 'none'; });
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
        const c = colAt(e.clientX); if (!c) return;
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs') && x !== D.el);
        let before = null;
        for (let i = 0; i < bx.length; i++) { const r = bx[i].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { before = bx[i]; break; } }
        const last = bx[bx.length - 1];
        const top = before ? before.offsetTop - 8 : (last ? last.offsetTop + last.offsetHeight + 4 : c.offsetTop + 8);
        line(c.offsetLeft, top, c.offsetWidth);
        D.target = { col: +c.getAttribute('data-col'), sub: +c.getAttribute('data-sub'), before: before ? before.getAttribute('data-secs').split(',')[0] : null };
        return;
      }
      if (D.kind === 'item') {
        clearMarks(); D.target = null;
        const under = R.elementFromPoint ? R.elementFromPoint(e.clientX, e.clientY) : null; if (!under) return;
        const srcType = typeOf(D.el.getAttribute('data-sec'));
        const it = under.closest ? under.closest('[data-idx]') : null;
        if (it && it !== D.el && typeOf(it.getAttribute('data-sec')) === srcType) {
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile') || it.classList.contains('bar');
          const after = horiz ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
          it.classList.add(horiz ? (after ? 'dropr' : 'dropl') : (after ? 'dropd' : 'dropt'));
          D.target = { sec: it.getAttribute('data-sec'), idx: +it.getAttribute('data-idx') + (after ? 1 : 0) };
          return;
        }
        // öğenin üstünde değil: aynı türden bir bölümün kutusuna bırakılırsa sona eklenir
        const bx = under.closest ? under.closest('.box[data-secs]') : null;
        if (bx) {
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
      if (!d.on) return;   // sürüklenmedi: tıklama olarak kalır
      this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
      if (d.kind === 'col') { const nt = clone(); nt.columns = d.W; return emit(nt); }
      if (d.kind === 'row') {
        if (d.na === undefined) return;
        const nt = clone();
        const ha = secById(nt, d.A.getAttribute('data-secs').split(',')[0]), hb = secById(nt, d.B.getAttribute('data-secs').split(',')[0]);
        if (ha) ha.grow = d.na; if (hb) hb.grow = d.nb;
        return emit(nt);
      }
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
    el.className = 'bar' + (on && !na ? ' on' : '') + (na ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '') + (el._drag ? ' drag' : '');
    el.style.setProperty('--bar-c', fx ? fx.c[0] : (d === 'light' && rgb ? rgb : LP_BAR_COLOR));
    el.style.setProperty('--p', (na ? 0 : v) + '%');
    const ic = this._icSwap(el, st, it, 1), nm = el.querySelector('.nm'), pc = el.querySelector('.pc');
    if (ic.tagName !== 'SPAN') { ic.hass = this._hass; ic.stateObj = st; if (it.icon) { const fi = lpFlatIcon(it.icon); ic.icon = fi; ic.setAttribute('icon', fi); } }
    nm.textContent = it.name || a.friendly_name || st.entity_id;
    let txt;
    if (na) txt = t(lang, 'unavailable');
    else if (lpBarCan(st) && (on || d === 'cover')) txt = v + '%';
    else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
    pc.textContent = txt;
  }

  // karo / çubuk simgesi: renkli stilde varlığın simgesi (kendi simgesi ya da durumuna göre varsayılan) setteyse span.lic.mdic,
  // değilse HA'nın ha-state-icon'u. Durum değişince (kapı açıldı, priz kapandı) simge de değişir. i: simgenin öğedeki sırası
  _icSwap(el, st, it, i) {
    const old = el.children[i];
    if (!old || lpIsLecIcon(it.icon)) return old;
    const name = it.icon || (st.attributes && st.attributes.icon) || lpStateIconName(st);
    const svg = lpMdicSvg(name), k = svg ? lpMdicKey(name) : null;
    if (svg) {
      if (old.tagName === 'SPAN' && old.getAttribute('data-n') === k) return old;
      const sp = document.createElement('span'); sp.className = 'lic mdic'; sp.setAttribute('data-n', k); sp.innerHTML = svg;
      el.replaceChild(sp, old); return sp;
    }
    if (old.tagName === 'SPAN' && old.classList.contains('mdic')) { const hi = document.createElement('ha-state-icon'); el.replaceChild(hi, old); return hi; }
    return old;
  }

  // --- durum güncellemesi (iskelete dokunmadan) ---
  _update() {
    const h = this._hass, S = h.states, lang = this._lang;
    // LEC odalarındaki bir ışık değiştiyse o odada oynayan efekti yeniden sor
    if (this._lecRooms && this._lecRooms.length && !this._config.edit) {
      const seen = {};
      (this._watched || []).forEach((id) => { if (this._last[id] && S[id] !== this._last[id]) { const r = LEC.roomOf(id); if (r && !seen[r] && this._lecRooms.indexOf(r) >= 0) { seen[r] = 1; LEC.watch(h, r); } } });
    }
    (this._tiles || []).forEach((el) => {
      const id = el.getAttribute('data-light'), st = S[id];
      if (!st || this._last[id] === st) return;
      const a = st.attributes, it = el._item || {}, on = LP_ON.indexOf(st.state) >= 0;
      // efekt: ışığın kendi efekti; yoksa LEC'in o odada oynattığı efekt (yanan ışıklarda)
      const fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(id)]) : null);
      if (el._bar) { if (!el._drag) this._paintBar(el, st, null, fx); return; }
      el.className = 'tile' + (on ? ' on' : '') + (st.state === 'unavailable' || st.state === 'unknown' ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '');
      const rgb = on && !fx && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
      const ic = this._icSwap(el, st, it, 0);
      if (ic.tagName !== 'SPAN') {   // renkli simge (span.lic: LEC ya da gömülü set) kendi renginde kalır
        ic.hass = h; ic.stateObj = st;
        if (it.icon) { const fi = lpFlatIcon(it.icon); ic.icon = fi; ic.setAttribute('icon', fi); }
        // HA'nın kendi karosundaki gibi: renkli lambanın simgesi parlaklığa göre hafif koyulaşır
        ic.style.filter = on && !fx && typeof a.brightness === 'number' ? 'brightness(' + Math.round((a.brightness + 245) / 5) + '%)' : '';
      }
      el.lastChild.textContent = it.name || a.friendly_name || id;
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
      el.innerHTML = '<ha-state-icon></ha-state-icon><div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div>';
      const ic = el.firstChild; ic.hass = h; ic.stateObj = st;
    });
    (this._watched || []).forEach((id) => { this._last[id] = S[id]; });
    // LEC düğmeleri: efekti oynuyorsa (ya da efekt ekranı düğmesinin odasında bir efekt oynuyorsa) yanar
    const R = this.shadowRoot;
    if (R) Array.prototype.forEach.call(R.querySelectorAll('.scene[data-lk]'), (el) => {
      const k = el.getAttribute('data-lk'), room = el.getAttribute('data-lroom');
      const on = k === 'play' ? LEC.isPlaying(room, el.getAttribute('data-lfx')) : (k === 'open' ? !!LEC.playing[room] : false);
      el.classList.toggle('on', on);
    });
  }
}
