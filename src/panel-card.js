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
function lpFire(node, type, detail) {
  const ev = new Event(type, { bubbles: true, composed: true });
  ev.detail = detail;
  node.dispatchEvent(ev);
}
// Kolon genişlikleri: sayı dizisi (oran, ör. [56, 17, 25.5]); eski kayıtlarda "56%" metni de olabilir.
const LP_DEFAULT_COLS = [56, 17, 25.5];
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
  const ef = String(st.attributes.effect || '').toLowerCase().replace(/^\s+|\s+$/g, '');
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
    '.tile.fx-' + p.k + '{border-color:' + p.c[0] + ';animation:lpfx-' + p.k + ' ' + p.d + 's linear infinite}' +
    '.tile.fx-' + p.k + ' ha-state-icon{animation:lpfxi-' + p.k + ' ' + p.d + 's linear infinite}';
}).join('');

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
    if (first) { STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    if (!this._sig) return;
    (this._embeds || []).forEach((e) => { e.hass = h; });
    const w = this._watched || [];
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
  }
  connectedCallback() {
    if (!this._unsub) this._unsub = STORE.onChange((d) => {
      this._def = null;
      const st = (d && d.settings) || {};
      if (!this._config.edit) LemurScale.set(st.canvas || null, st.kiosk || null);   // ölçek ve kiosk ayarı canlı değişsin
      this._render();
    });
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    if (this._hass) this._render();
  }
  disconnectedCallback() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    clearInterval(this._clock); this._clock = null;
  }

  _tabs() {
    const d = STORE.data;
    if (d && d.tabs && d.tabs.length) return d.tabs;
    if (!this._def) this._def = buildDefaultTabs(this._hass, pickLang(this._hass));
    return this._def;
  }
  _tick() { const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time(); }
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
    const sig = JSON.stringify([tab, season, lang, present, tabs.map((x) => [x.id, x.name, x.icon]), lpHas('lemur-hd-climate-card'), !!this._config.edit, this._config.selected || '']);
    if (sig !== this._sig) { this._sig = sig; this._build(tab, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    const h = this._hass, S = h.states;
    const tiles = [], tileItems = [], rows = [], embeds = [];
    const edit = !!this._config.edit, selected = this._config.selected || '';
    let curSec = '';
    // her öğe hangi bölümün kaçıncı öğesi: düzenleme modunda sürükle-bırak için
    const mark = (i) => ' data-sec="' + esc(curSec) + '" data-idx="' + i + '"';
    const emb = (tag, cfg, id, i) => {
      if (!lpHas(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"' + mark(i) + '></div>'; }
      embeds.push({ tag: tag, cfg: Object.assign({ language: lang }, cfg) });
      return '<div class="emb" data-emb="' + (embeds.length - 1) + '"' + mark(i) + '></div>';
    };
    const withIdx = (arr, norm) => (arr || []).map((x, i) => { const e = norm(x); return e ? Object.assign({ _i: i }, e) : null; }).filter(Boolean);
    const bodyOf = (s) => {
      if (s.type === 'lights') {
        // karo: "light.x" ya da { entity, name, icon }; cihazı olmayan { name, icon } boş yuva olarak çizilir (tablet panosundaki gibi)
        const items = withIdx(s.entities, lpItem).filter((e) => !e.entity || S[e.entity]);
        if (!items.some((e) => e.entity)) return null;
        // Tablet panosundaki gibi: 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
        // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
        const c = s.tile_columns || 5, r = Math.ceil(items.length / c), fill = r >= 4;
        const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? 'minmax(84px,1fr)' : '1fr') + ')';
        const open = fill ? '<div class="grid" data-sec="' + esc(s.id) + '" style="' + gs + '">'
          : '<div class="gsq" data-sec="' + esc(s.id) + '" style="padding-bottom:calc((100% - ' + (8 * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (8 * (r - 1)) + 'px)"><div class="grid" style="' + gs + '">';
        return { kind: 'md', html: open +
          items.map((it) => {
            if (!it.entity) return '<div class="tile ph"' + mark(it._i) + '><ha-icon icon="' + esc(it.icon || 'mdi:lightbulb') + '"></ha-icon><div class="nm">' + esc(it.name || '') + '</div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="tile" data-light="' + esc(it.entity) + '"' + mark(it._i) + '><ha-state-icon></ha-state-icon><div class="nm"></div></div>';
          }).join('') + (fill ? '</div>' : '</div></div>') };
      }
      if (s.type === 'scenes') {
        const items = s.items || [];
        if (!items.length) return null;
        return { kind: 'md', spread: true, html: items.map((it, i) => '<div class="scene" data-scene="' + esc(s.id) + ':' + i + '"' + mark(i) + '><div class="si"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || '#5B8DEF') + '"></ha-icon></div><span>' + esc(it.name) + '</span></div>').join('') };
      }
      if (s.type === 'climate') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
        const ac = items.filter(isAC), rad = items.filter((x) => !isAC(x));
        const both = ac.length > 0 && rad.length > 0;
        const list = both ? (season === 'winter' ? rad : ac) : items;
        return { kind: 'hd', spread: true, season: both, html: list.map((x) => { const c = Object.assign({ type: 'custom:lemur-hd-climate-card' }, x); delete c._i; return emb('lemur-hd-climate-card', c, x.entity, x._i); }).join('') };
      }
      if (s.type === 'vacuum') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        return { kind: 'hd', spread: true, html: items.map((x) => { const c = Object.assign({ type: 'custom:lemur-hd-vacuum-card' }, x); delete c._i; return emb('lemur-hd-vacuum-card', c, x.entity, x._i); }).join('') };
      }
      if (s.type === 'media') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        return { kind: 'hd', spread: true, html: items.map((x) => { rows.push(x.entity); return '<div class="row" data-row="' + esc(x.entity) + '"' + mark(x._i) + '></div>'; }).join('') };
      }
      return null;
    };

    // kolonlara dağıt; başlıksız bölüm aynı kolondaki önceki kutunun içine girer (ör. iklimin altında süpürge)
    // içi boş bölümün başlığı, aynı kolonda arkasından gelen başlıksız bölüme geçer.
    // Düzenleme modunda boş bölüm de bir kutu olarak görünür (içine sürüklenebilsin diye).
    const widths = lpWeights(tab);
    const cols = widths.map(() => []), pending = widths.map(() => null);
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0));
      curSec = s.id;
      let b = bodyOf(s);
      if (!b && edit) b = { kind: s.type === 'lights' || s.type === 'scenes' ? 'md' : 'hd', html: '<div class="eph" data-sec="' + esc(s.id) + '">' + esc(t(lang, 'edit_empty')) + '</div>' };
      if (!b) { if (s.title) pending[ci] = s; return; }
      const boxes = cols[ci];
      if (!s.title && !pending[ci] && boxes.length) { const last = boxes[boxes.length - 1]; last.html += b.html; last.spread = last.spread || b.spread; last.secs.push(s.id); return; }
      const head = s.title ? s : pending[ci];
      pending[ci] = null;
      boxes.push({ title: head ? head.title : (s.type === 'media' ? t(lang, 'media') : ''), kind: b.kind, season: !!b.season && head === s, spread: b.spread, html: b.html,
        secs: head && head !== s ? [head.id, s.id] : [s.id], grow: (head || s).grow || 1 });
    });
    const used = [];
    cols.forEach((b, i) => { if (b.length || edit) used.push(i); });   // düzenlemede boş kolon da görünür

    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni"><ha-icon icon="' + esc(x.icon || 'mdi:home-outline') + '"></ha-icon></div><div class="nn">' + esc(x.name) + '</div></div>').join('') +
      '<div class="clock">' + this._time() + '</div></div>';
    const seasonIcon = season === 'winter' ? '<ha-icon icon="mdi:snowflake" style="color:#7cc8ff"></ha-icon>' : '<ha-icon icon="mdi:white-balance-sunny" style="color:#ffc23d"></ha-icon>';
    // aynı kolonda birden çok kutu varsa yükseklikler "grow" oranında paylaşılır (düzenlemede aradaki çizgi sürüklenerek değişir)
    const boxHtml = (b, multi) => '<div class="box' + (b.spread ? ' spread' : '') + (edit && b.secs.indexOf(selected) >= 0 ? ' selbox' : '') + '" data-secs="' + esc(b.secs.join(',')) + '"' +
      (multi ? ' style="flex:' + b.grow + ' 1 0px;min-height:auto"' : '') + '>' +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    let grid, body;
    if (used.length) {
      // kolon genişlikleri oran (fr): kolon sayısı ne olursa olsun ekrana sığar, aralıklar taşırmaz
      grid = 'grid-template-columns:' + used.map((i) => widths[i] + 'fr').join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => '<div class="col" data-col="' + i + '" style="grid-area:c' + i + '">' +
        (cols[i].length ? cols[i].map((b) => boxHtml(b, cols[i].length > 1)).join('') : '<div class="box colempty">' + esc(t(lang, 'col_empty')) + '</div>') + '</div>').join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div>';
    }
    const R = this.shadowRoot;
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap' + (edit ? ' edit' : '') + '" style="' + grid + '">' + nav + body + '</div>';

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
    this._tiles = []; R.querySelectorAll('[data-light]').forEach((el, i) => { el._item = tileItems[i]; this._tiles.push(el); });
    this._rows = []; R.querySelectorAll('[data-row]').forEach((el) => this._rows.push(el));
    this._watched = tiles.concat(rows);
    this._last = {};
    this._lang = lang;

    // düzenleme modu (yönetim panelindeki önizleme): cihazlara dokunulmaz; tıklama seçer, sürükleme taşır, çizgiler boyutlandırır
    if (edit) { this._editBind(R, tab, widths, used); return; }
    // dokunuşlar
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      const base = location.pathname.split('/').slice(0, 2).join('/');
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => lpFire(this, 'hass-more-info', { entityId: id });
    this._tiles.forEach((b) => {
      const id = b.getAttribute('data-light');
      lpPress(b, () => this._hass.callService('homeassistant', 'toggle', { entity_id: id }), () => more(id));
    });
    this._rows.forEach((b) => lpPress(b, () => more(b.getAttribute('data-row'))));
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => {
      const p = b.getAttribute('data-scene').split(':');
      const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      const it = s && s.items && s.items[+p[1]];
      if (!it || !it.action || !it.action.service) return;
      const sv = it.action.service.split('.');
      this._hass.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }));
    R.querySelectorAll('[data-season]').forEach((b) => lpPress(b, () => STORE.season(lpSeason() === 'winter' ? 'summer' : 'winter')));
  }

  // --- düzenleme modu: tıkla seç, sürükle taşı, çizgiden boyutlandır ---
  // Kart değişikliği kendisi kaydetmez; yeni sekme ayarını 'lhd-change' ile yönetim paneline verir, panel kaydeder.
  _editBind(R, tab, widths, used) {
    const wrap = R.querySelector('.wrap');
    const clone = () => JSON.parse(JSON.stringify(tab));
    const emit = (nt) => lpFire(this, 'lhd-change', { tab: nt });
    const zoom = () => { const r = this.getBoundingClientRect(); return (r.width && this.offsetWidth) ? r.width / this.offsetWidth : 1; };
    const secById = (T, id) => (T.sections || []).filter((x) => x.id === id)[0];
    const listOf = (s) => (s.type === 'scenes' ? (s.items = s.items || []) : (s.entities = s.entities || []));
    const typeOf = (id) => { const s = secById(tab, id); return s ? s.type : ''; };
    const r2 = (x) => Math.round(x * 100) / 100;
    const arr = (x) => Array.prototype.slice.call(x);
    R.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => lpFire(this, 'lhd-tab', { tab: b.getAttribute('data-nav') })));

    // boyutlandırma tutamakları: kolonların arasında dikey, aynı kolonda üst üste duran kutuların arasında yatay
    const place = () => {
      if (!wrap.isConnected) return;
      arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => x.remove());
      const cols = arr(R.querySelectorAll('.col[data-col]'));
      for (let k = 0; k < cols.length - 1; k++) {
        const a = cols[k], b = cols[k + 1], hd = document.createElement('div');
        hd.className = 'colh'; hd.setAttribute('data-k', k);
        hd.style.left = ((a.offsetLeft + a.offsetWidth + b.offsetLeft) / 2 - 7) + 'px';
        hd.style.top = a.offsetTop + 'px'; hd.style.height = a.offsetHeight + 'px';
        wrap.appendChild(hd);
      }
      cols.forEach((c) => {
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs'));
        for (let j = 0; j < bx.length - 1; j++) {
          const hd = document.createElement('div');
          hd.className = 'rowh'; hd.setAttribute('data-col', c.getAttribute('data-col')); hd.setAttribute('data-j', j);
          hd.style.left = c.offsetLeft + 'px'; hd.style.width = c.offsetWidth + 'px';
          hd.style.top = ((bx[j].offsetTop + bx[j].offsetHeight + bx[j + 1].offsetTop) / 2 - 7) + 'px';
          wrap.appendChild(hd);
        }
      });
    };
    requestAnimationFrame(place); setTimeout(place, 400); setTimeout(place, 1500);

    let D = null;
    const clearMarks = () => arr(R.querySelectorAll('.dropl,.dropr,.dropt,.dropd,.dropin')).forEach((x) => x.classList.remove('dropl', 'dropr', 'dropt', 'dropd', 'dropin'));
    const line = (left, top, width) => {
      let ln = R.querySelector('.dropline');
      if (!ln) { ln = document.createElement('div'); ln.className = 'dropline'; wrap.appendChild(ln); }
      ln.style.left = left + 'px'; ln.style.top = top + 'px'; ln.style.width = width + 'px';
    };
    const colAt = (x) => {
      const cols = arr(R.querySelectorAll('.col[data-col]'));
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
        const c = R.querySelector('.col[data-col="' + rh.getAttribute('data-col') + '"]'), j = +rh.getAttribute('data-j');
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
        const tot = D.pa + D.pb, na = Math.max(120, Math.min(tot - 120, D.pa + dx));
        const sum = widths[D.a] + widths[D.b];
        D.W[D.a] = r2(sum * na / tot); D.W[D.b] = r2(sum - D.W[D.a]);
        wrap.style.gridTemplateColumns = used.map((i) => D.W[i] + 'fr').join(' ');
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
        D.target = { col: +c.getAttribute('data-col'), before: before ? before.getAttribute('data-secs').split(',')[0] : null };
        return;
      }
      if (D.kind === 'item') {
        clearMarks(); D.target = null;
        const under = R.elementFromPoint ? R.elementFromPoint(e.clientX, e.clientY) : null; if (!under) return;
        const srcType = typeOf(D.el.getAttribute('data-sec'));
        const it = under.closest ? under.closest('[data-idx]') : null;
        if (it && it !== D.el && typeOf(it.getAttribute('data-sec')) === srcType) {
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile');
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
        moving.forEach((s) => { s.col = d.target.col; });
        let at = rest.length;
        if (d.target.before) at = rest.map((s) => s.id).indexOf(d.target.before);
        else { for (let i = rest.length - 1; i >= 0; i--) if ((rest[i].col || 0) === d.target.col) { at = i + 1; break; } }
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

    // tıklama: bölümü seç (sürüklemeden sonra gelen tıklama sayılmaz)
    wrap.addEventListener('click', (e) => {
      if (this._dragged) return;
      const bx = e.target.closest ? e.target.closest('.box[data-secs]') : null; if (!bx) return;
      const hit = e.target.closest('[data-sec]');
      lpFire(this, 'lhd-select', { section: hit ? hit.getAttribute('data-sec') : bx.getAttribute('data-secs').split(',')[0] });
    });
  }

  // --- durum güncellemesi (iskelete dokunmadan) ---
  _update() {
    const h = this._hass, S = h.states, lang = this._lang;
    (this._tiles || []).forEach((el) => {
      const id = el.getAttribute('data-light'), st = S[id];
      if (!st || this._last[id] === st) return;
      const a = st.attributes, it = el._item || {}, on = LP_ON.indexOf(st.state) >= 0, fx = lpFx(st);
      el.className = 'tile' + (on ? ' on' : '') + (st.state === 'unavailable' || st.state === 'unknown' ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '');
      const rgb = on && !fx && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
      const ic = el.firstChild;
      ic.hass = h; ic.stateObj = st;
      if (it.icon) { ic.icon = it.icon; ic.setAttribute('icon', it.icon); }
      // HA'nın kendi karosundaki gibi: renkli lambanın simgesi parlaklığa göre hafif koyulaşır
      ic.style.filter = on && !fx && typeof a.brightness === 'number' ? 'brightness(' + Math.round((a.brightness + 245) / 5) + '%)' : '';
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
  }
}
