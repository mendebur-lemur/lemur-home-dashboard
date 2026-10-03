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
const lpFr = (v) => (/%$/.test(String(v)) ? parseFloat(v) + 'fr' : String(v));
const lpEnt = (x) => (typeof x === 'string' ? { entity: x } : (x && x.entity ? x : null));
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
    if (!this._unsub) this._unsub = STORE.onChange(() => { this._def = null; this._render(); });
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
    const sig = JSON.stringify([tab, season, lang, present, tabs.map((x) => [x.id, x.name, x.icon]), !!customElements.get('lemur-climate-card')]);
    if (sig !== this._sig) { this._sig = sig; this._build(tab, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    const h = this._hass, S = h.states;
    const tiles = [], tileItems = [], rows = [], embeds = [];
    const emb = (tag, cfg, id) => {
      if (!customElements.get(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"></div>'; }
      embeds.push({ tag: tag, cfg: cfg });
      return '<div class="emb" data-emb="' + (embeds.length - 1) + '"></div>';
    };
    const bodyOf = (s) => {
      if (s.type === 'lights') {
        // karo: "light.x" ya da { entity, name, icon }; cihazı olmayan { name, icon } boş yuva olarak çizilir (tablet panosundaki gibi)
        const items = (s.entities || []).map(lpItem).filter((e) => e && (!e.entity || S[e.entity]));
        if (!items.some((e) => e.entity)) return null;
        // Tablet panosundaki gibi: 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
        // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
        const c = s.tile_columns || 5, r = Math.ceil(items.length / c), fill = r >= 4;
        const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? 'minmax(84px,1fr)' : '1fr') + ')';
        const open = fill ? '<div class="grid" style="' + gs + '">'
          : '<div class="gsq" style="padding-bottom:calc((100% - ' + (8 * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (8 * (r - 1)) + 'px)"><div class="grid" style="' + gs + '">';
        return { kind: 'md', html: open +
          items.map((it) => {
            if (!it.entity) return '<div class="tile ph"><ha-icon icon="' + esc(it.icon || 'mdi:lightbulb') + '"></ha-icon><div class="nm">' + esc(it.name || '') + '</div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="tile" data-light="' + esc(it.entity) + '"><ha-state-icon></ha-state-icon><div class="nm"></div></div>';
          }).join('') + (fill ? '</div>' : '</div></div>') };
      }
      if (s.type === 'scenes') {
        const items = s.items || [];
        if (!items.length) return null;
        return { kind: 'md', spread: true, html: items.map((it, i) => '<div class="scene" data-scene="' + esc(s.id) + ':' + i + '"><div class="si"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || '#5B8DEF') + '"></ha-icon></div><span>' + esc(it.name) + '</span></div>').join('') };
      }
      if (s.type === 'climate') {
        const items = (s.entities || []).map(lpEnt).filter((e) => e && S[e.entity]);
        if (!items.length) return null;
        const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
        const ac = items.filter(isAC), rad = items.filter((x) => !isAC(x));
        const both = ac.length > 0 && rad.length > 0;
        const list = both ? (season === 'winter' ? rad : ac) : items;
        return { kind: 'hd', spread: true, season: both, html: list.map((x) => emb('lemur-climate-card', Object.assign({ type: 'custom:lemur-climate-card' }, x), x.entity)).join('') };
      }
      if (s.type === 'vacuum') {
        const items = (s.entities || []).map(lpEnt).filter((e) => e && S[e.entity]);
        if (!items.length) return null;
        return { kind: 'hd', spread: true, html: items.map((x) => emb('lemur-vacuum-card', Object.assign({ type: 'custom:lemur-vacuum-card' }, x), x.entity)).join('') };
      }
      if (s.type === 'media') {
        const ids = (s.entities || []).map(lpEnt).filter((e) => e && S[e.entity]).map((e) => e.entity);
        if (!ids.length) return null;
        return { kind: 'hd', spread: true, html: ids.map((id) => { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"></div>'; }).join('') };
      }
      return null;
    };

    // kolonlara dağıt; başlıksız bölüm aynı kolondaki önceki kutunun içine girer (ör. iklimin altında süpürge)
    // içi boş bölümün başlığı, aynı kolonda arkasından gelen başlıksız bölüme geçer
    const widths = tab.columns || ['56%', '17%', '25.5%'];
    const cols = widths.map(() => []), pending = widths.map(() => null);
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0));
      const b = bodyOf(s);
      if (!b) { if (s.title) pending[ci] = s; return; }
      const boxes = cols[ci];
      if (!s.title && !pending[ci] && boxes.length) { const last = boxes[boxes.length - 1]; last.html += b.html; last.spread = last.spread || b.spread; return; }
      const head = s.title ? s : pending[ci];
      pending[ci] = null;
      boxes.push({ title: head ? head.title : (s.type === 'media' ? t(lang, 'media') : ''), kind: b.kind, season: !!b.season && head === s, spread: b.spread, html: b.html });
    });
    const used = [];
    cols.forEach((b, i) => { if (b.length) used.push(i); });

    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni"><ha-icon icon="' + esc(x.icon || 'mdi:home-outline') + '"></ha-icon></div><div class="nn">' + esc(x.name) + '</div></div>').join('') +
      '<div class="clock">' + this._time() + '</div></div>';
    const seasonIcon = season === 'winter' ? '<ha-icon icon="mdi:snowflake" style="color:#7cc8ff"></ha-icon>' : '<ha-icon icon="mdi:white-balance-sunny" style="color:#ffc23d"></ha-icon>';
    const boxHtml = (b) => '<div class="box' + (b.spread ? ' spread' : '') + '">' +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    let grid, body;
    if (used.length) {
      // bütün kolonlar doluysa yüzdeler olduğu gibi (tablet panosuyla aynı), biri boşsa kalanlar oranla paylaşır
      grid = 'grid-template-columns:' + used.map((i) => (used.length === widths.length ? widths[i] : lpFr(widths[i]))).join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => '<div class="col" style="grid-area:c' + i + '">' + cols[i].map(boxHtml).join('') + '</div>').join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div>';
    }
    const R = this.shadowRoot;
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap" style="' + grid + '">' + nav + body + '</div>';

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
