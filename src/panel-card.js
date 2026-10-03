// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer. TASLAK: iskelet düzen, ışık karoları ve senaryo düğmeleri çalışıyor;
// iklim/medya bölümleri yer tutucu. Eski Safari için ?. ve ?? yok.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; }
  getCardSize() { return 12; }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) {
      STORE.load(h).then(() => this._render()).catch(() => this._render());
      this._unsub = STORE.onChange(() => this._render());
      this._clock = setInterval(() => this._tick(), 15000);
      return;
    }
    if (this._watched && this._watched.some((id) => h.states[id] !== this._last[id])) this._render();
  }
  disconnectedCallback() { if (this._unsub) this._unsub(); clearInterval(this._clock); }

  _tabs() {
    const d = STORE.data;
    return (d && d.tabs && d.tabs.length) ? d.tabs : buildDefaultTabs(this._hass, pickLang(this._hass));
  }

  _tick() { const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time(); }
  _time() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states;
    const tabs = this._tabs();
    const tab = tabs.filter((x) => x.id === this._config.tab)[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; return; }
    const watched = [];
    const nav = '<div class="nav">' + tabs.map((x) => '<button class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><ha-icon icon="' + esc(x.icon || 'mdi:home') + '"></ha-icon>' + esc(x.name) + '</button>').join('') + '<div class="clock">' + this._time() + '</div></div>';
    const cols = [[], [], []];
    (tab.sections || []).forEach((s) => { cols[Math.max(0, Math.min(2, s.col || 0))].push(s); });
    const sec = (s) => {
      let body = '';
      if (s.type === 'lights') {
        body = '<div class="grid" style="grid-template-columns:repeat(' + (s.tile_columns || 5) + ',1fr)">' + (s.entities || []).map((id) => {
          const st = S[id]; if (!st) return ''; watched.push(id);
          const on = st.state === 'on'; const rgb = st.attributes.rgb_color;
          return '<div class="tile' + (on ? ' on' : '') + '" data-toggle="' + esc(id) + '"' + (on && rgb ? ' style="--tile-rgb:rgb(' + rgb.join(',') + ')"' : '') + '><ha-state-icon></ha-state-icon><ha-icon icon="' + esc(st.attributes.icon || (id.indexOf('switch.') === 0 ? 'mdi:power-socket-eu' : 'mdi:lightbulb')) + '"></ha-icon>' + esc(st.attributes.friendly_name || id) + '</div>';
        }).join('') + '</div>';
      } else if (s.type === 'scenes') {
        body = (s.items || []).map((it, i) => '<button class="scene" data-scene="' + esc(s.id) + ':' + i + '"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || 'var(--lp-accent)') + '"></ha-icon>' + esc(it.name) + '</button>').join('');
      } else {
        body = '<div class="todo">' + esc(s.type) + ': ' + esc((s.entities || []).join(', ')) + ' (yapılacak)</div>';
      }
      return '<div class="box">' + (s.title ? '<div class="title">' + esc(s.title) + '</div>' : '') + body + '</div>';
    };
    const colTpl = (tab.columns || ['56%', '17%', '25.5%']).join(' ');
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style><div class="wrap" style="grid-template-columns:' + esc(colTpl) + '">' + nav +
      cols.map((c, i) => '<div class="col" style="grid-area:c' + (i + 1) + '">' + c.map(sec).join('') + '</div>').join('') + '</div>';
    this._watched = watched; this._last = {}; watched.forEach((id) => { this._last[id] = S[id]; });
    this.shadowRoot.querySelectorAll('.tile ha-state-icon').forEach((e) => e.remove());
    this.shadowRoot.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => {
      const base = location.pathname.split('/').slice(0, 2).join('/');
      history.pushState(null, '', base + '/' + b.getAttribute('data-nav'));
      window.dispatchEvent(new CustomEvent('location-changed'));
    }));
    this.shadowRoot.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
      h.callService('homeassistant', 'toggle', { entity_id: b.getAttribute('data-toggle') });
    }));
    this.shadowRoot.querySelectorAll('[data-scene]').forEach((b) => b.addEventListener('click', () => {
      const p = b.getAttribute('data-scene').split(':'); const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      const it = s && s.items[+p[1]]; if (!it || !it.action) return;
      const sv = it.action.service.split('.');
      h.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : {});
    }));
  }
}
