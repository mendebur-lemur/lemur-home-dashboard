// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Şimdilik: oda düğmeleri + saat, ışık karoları (dokun = aç/kapat, basılı tut = HA'nın cihaz penceresi),
// senaryo düğmeleri, iklim ve medya için geçici satırlar (dokun = cihaz penceresi). Asıl iklim/medya kartları ve
// kendi ışık penceremiz 3. adımda gelecek. Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
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

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; if (this._hass) this._render(); }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) { STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    const w = this._watched;
    if (!w) return;
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
  }
  connectedCallback() {
    if (!this._unsub) this._unsub = STORE.onChange(() => { this._def = null; this._render(); });
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    if (this._hass && this.shadowRoot) this._render();
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

  // --- bölüm içerikleri: boşsa '' döner, bölüm hiç çizilmez ---
  _lights(s, watched) {
    const S = this._hass.states;
    const ids = (s.entities || []).filter((id) => S[id]);
    if (!ids.length) return '';
    const c = s.tile_columns || 5, rows = Math.max(4, Math.ceil(ids.length / c));
    return '<div class="grid" style="grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + rows + ',minmax(84px,1fr))">' +
      ids.map((id) => {
        watched.push(id);
        const st = S[id], a = st.attributes, on = st.state === 'on', na = st.state === 'unavailable';
        const rgb = on && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
        const br = on && typeof a.brightness === 'number' ? Math.round(a.brightness / 2.55) + '%' : '';
        return '<div class="tile' + (on ? ' on' : '') + (na ? ' na' : '') + '" data-light="' + esc(id) + '"' + (rgb ? ' style="--tile-rgb:' + rgb + '"' : '') + '>' +
          '<ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon><div class="nm">' + esc(a.friendly_name || id) + '</div>' +
          (br ? '<div class="br">' + br + '</div>' : '') + '</div>';
      }).join('') + '</div>';
  }
  _scenes(s) {
    const items = s.items || [];
    if (!items.length) return '';
    return items.map((it, i) => '<div class="scene" data-scene="' + esc(s.id) + ':' + i + '"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || 'var(--lp-accent)') + '"></ha-icon><span>' + esc(it.name) + '</span></div>').join('');
  }
  _rows(s, watched, lang) {
    const S = this._hass.states;
    const ids = (s.entities || []).filter((id) => S[id]);
    if (!ids.length) return '';
    return '<div class="rows">' + ids.map((id) => {
      watched.push(id);
      const st = S[id], a = st.attributes;
      let txt = '', cls = '';
      if (st.state === 'unavailable') { txt = t(lang, 'unavailable'); cls = ' na'; }
      else if (id.indexOf('climate.') === 0) {
        const act = a.hvac_action;
        const parts = [];
        if (typeof a.current_temperature === 'number') parts.push(a.current_temperature + '°' + (st.state !== 'off' && typeof a.temperature === 'number' ? ' → ' + a.temperature + '°' : ''));
        if (st.state === 'off') { parts.push(t(lang, 'off')); }
        else if (act === 'heating') { parts.push(t(lang, 'heat')); cls = ' heat'; }
        else if (act === 'cooling') { parts.push(t(lang, 'cool')); cls = ' cool'; }
        else { parts.push(t(lang, 'idle')); cls = ' on'; }
        txt = parts.join(' · ');
      } else {
        if (st.state === 'playing') { txt = a.media_title ? a.media_title + (a.media_artist ? ' · ' + a.media_artist : '') : t(lang, 'playing'); cls = ' on'; }
        else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
      }
      return '<div class="row' + cls + '" data-more="' + esc(id) + '"><ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon>' +
        '<div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div></div>';
    }).join('') + '</div>';
  }

  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states, lang = pickLang(h);
    const tabs = this._tabs();
    const tab = tabs.filter((x) => x.id === (this._config && this._config.tab))[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; return; }
    const watched = [];

    // kolonlara dağıt; başlıksız bölüm aynı kolondaki önceki kutunun içine girer (ör. iklimin altında medya)
    const widths = tab.columns || ['56%', '17%', '25.5%'];
    const cols = widths.map(() => []);
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0));
      let body = '';
      if (s.type === 'lights') body = this._lights(s, watched);
      else if (s.type === 'scenes') body = this._scenes(s);
      else if (s.type === 'climate' || s.type === 'media') body = this._rows(s, watched, lang);
      if (!body) return;
      const boxes = cols[ci];
      if (!s.title && boxes.length) boxes[boxes.length - 1].body += body;
      else boxes.push({ title: s.title || (s.type === 'media' ? t(lang, 'media') : ''), body: body });
    });
    const used = [];
    cols.forEach((b, i) => { if (b.length) used.push(i); });

    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><ha-icon icon="' + esc(x.icon || 'mdi:home') + '"></ha-icon><span>' + esc(x.name) + '</span></div>').join('') +
      '<div class="clock">' + this._time() + '</div></div>';
    let grid, body;
    if (used.length) {
      grid = 'grid-template-columns:' + used.map((i) => lpFr(widths[i])).join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => '<div class="col" style="grid-area:c' + i + '">' + cols[i].map((b) =>
        '<div class="box">' + (b.title ? '<div class="title">' + esc(b.title) + '</div>' : '') + b.body + '</div>').join('') + '</div>').join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div>';
    }
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style><div class="wrap" style="' + grid + '">' + nav + body + '</div>';

    this._watched = watched; this._last = {};
    watched.forEach((id) => { this._last[id] = S[id]; });
    const R = this.shadowRoot;
    R.querySelectorAll('ha-state-icon[data-eid]').forEach((e) => { e.hass = h; e.stateObj = S[e.getAttribute('data-eid')]; });
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      const base = location.pathname.split('/').slice(0, 2).join('/');
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => lpFire(this, 'hass-more-info', { entityId: id });
    R.querySelectorAll('[data-light]').forEach((b) => {
      const id = b.getAttribute('data-light');
      lpPress(b, () => h.callService('homeassistant', 'toggle', { entity_id: id }), () => more(id));
    });
    R.querySelectorAll('[data-more]').forEach((b) => lpPress(b, () => more(b.getAttribute('data-more'))));
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => {
      const p = b.getAttribute('data-scene').split(':');
      const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      const it = s && s.items && s.items[+p[1]];
      if (!it || !it.action || !it.action.service) return;
      const sv = it.action.service.split('.');
      h.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }));
  }
}
