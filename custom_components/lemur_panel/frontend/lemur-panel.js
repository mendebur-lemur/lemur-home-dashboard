/*! Lemur Panel v0.0.1 | MIT */
(() => {
if (customElements.get('lemur-panel-card')) return;
const PANEL_VERSION = '0.0.1';
const CSS = ":host { display: block; --lp-box-bg: rgba(20, 24, 31, 0.55); --lp-box-border: rgba(255, 255, 255, 0.08); --lp-accent: #5B8DEF; --lp-on: #fdd835; }\n.wrap { display: grid; grid-template-areas: \"h1 h1 h1\" \"c1 c2 c3\"; gap: 12px; padding: 12px; box-sizing: border-box; }\n.nav { grid-area: h1; display: flex; align-items: center; gap: 12px; }\n.navb { width: 235px; height: 155px; border-radius: 15px; border: none; background: var(--ha-card-background, rgba(30,33,40,0.9)); color: var(--primary-text-color);\nopacity: 0.85; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-size: 18px; --mdc-icon-size: 64px; }\n.navb.sel { opacity: 1; box-shadow: inset 0 0 0 2px rgba(91, 141, 239, 0.9); }\n.clock { margin-left: auto; margin-right: 40px; font-size: 48px; font-weight: 700; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }\n.col { display: flex; flex-direction: column; gap: 12px; min-width: 0; }\n.box { background: var(--lp-box-bg); border: 1px solid var(--lp-box-border); border-radius: 22px; padding: 12px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; }\n.title { text-align: center; font-weight: 700; font-size: 18px; color: var(--primary-text-color); padding: 6px 0 4px; }\n.grid { display: grid; gap: 10px; flex: 1 1 auto; grid-auto-rows: 1fr; }\n.tile { border-radius: 14px; background: var(--ha-card-background, rgba(30,33,40,0.9)); border: 1px solid transparent; color: var(--primary-text-color);\ndisplay: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; min-height: 90px; --mdc-icon-size: 44px; font-size: 14px; }\n.tile.on { border: 2px solid var(--tile-rgb, var(--lp-on)); background: rgba(255, 255, 255, 0.05); }\n.scene { height: 118px; border-radius: 22px; border: none; background: var(--ha-card-background, rgba(30,33,40,0.9)); color: var(--primary-text-color);\ndisplay: flex; align-items: center; gap: 16px; padding: 0 20px; font-size: 18px; cursor: pointer; --mdc-icon-size: 40px; text-align: left; }\n.todo { color: var(--secondary-text-color); font-size: 13px; text-align: center; padding: 8px; }";
// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', scenes: 'SENARYOLAR', control: 'EV KONTROL', media: 'MEDYA',
    admin_title: 'Lemur Panel', admin_intro: 'Panelin sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Panel entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', scenes: 'SCENES', control: 'CONTROLS', media: 'MEDIA',
    admin_title: 'Lemur Panel', admin_intro: 'Tabs, sections and sizes of the panel will be edited here. (Work in progress)',
    reset: 'Reset to defaults', save: 'Save', saved: 'Saved', not_loaded: 'The Lemur Panel integration is not loaded.' }
};
function pickLang(hass) {
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}
function t(lang, key) { const d = TXT[lang] || TXT.en; return d[key] !== undefined ? d[key] : (TXT.en[key] || key); }

// Ortak ayarlar: entegrasyondan okunur, değişince bütün açık ekranlara gelir.
const STORE = window.__LEMUR_PANEL_STORE || (window.__LEMUR_PANEL_STORE = {
  data: null, conn: null, subs: [], loading: null,
  load(hass) {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.conn = hass.connection;
    this.loading = this.conn.sendMessagePromise({ type: 'lemur_panel/get' }).then((d) => {
      this.data = d;
      this.conn.subscribeMessage((msg) => { this.data = msg; this.subs.forEach((f) => f(msg)); }, { type: 'lemur_panel/subscribe' });
      return d;
    }).catch((e) => { this.loading = null; throw e; });
    return this.loading;
  },
  set(key, value) { return this.conn.sendMessagePromise({ type: 'lemur_panel/set', key: key, value: value }); },
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});

// Ayar yokken evden varsayılan düzen üretir (ilk kurulumda tek satırla dolu panel gelsin diye).
// TASLAK: alanlar → sekmeler; alandaki ışık ve anahtarlar → ışık bölümü; script/sahne → senaryolar; climate → kontrol; media_player → medya.
function buildDefaultTabs(hass, lang) {
  const S = hass.states;
  const ents = hass.entities || {};   // entity registry özeti (area_id, device_id)
  const devs = hass.devices || {};
  const areas = hass.areas || {};
  const areaOf = (id) => { const e = ents[id]; if (!e) return null; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return d ? d.area_id : null; };
  const hidden = (id) => { const e = ents[id]; return !!(e && (e.hidden || e.entity_category)); };
  const pick = (domains, area) => Object.keys(S).filter((id) => domains.indexOf(id.split('.')[0]) >= 0 && !hidden(id) && (area === undefined || areaOf(id) === area));
  const scenes = pick(['script', 'scene']).slice(0, 6).map((id) => ({ name: (S[id].attributes.friendly_name || id), icon: S[id].attributes.icon || 'mdi:play',
    action: { service: id.split('.')[0] === 'script' ? 'script.turn_on' : 'scene.turn_on', target: id } }));
  const tab = (id, name, icon, area) => ({ id: id, name: name, icon: icon, area: area, columns: ['56%', '17%', '25.5%'], sections: [
    { id: id + '-l', type: 'lights', title: t(lang, 'lights'), col: 0, entities: pick(['light', 'switch'], area).slice(0, 20), tile_columns: 5 },
    { id: id + '-s', type: 'scenes', title: t(lang, 'scenes'), col: 1, items: scenes },
    { id: id + '-c', type: 'climate', title: t(lang, 'control'), col: 2, entities: pick(['climate'], area).slice(0, 3) },
    { id: id + '-m', type: 'media', col: 2, entities: pick(['media_player'], area).slice(0, 2) }
  ] });
  const tabs = [tab('ev', t(lang, 'home'), 'mdi:home-outline', undefined)];
  Object.keys(areas).forEach((aid) => {
    if (pick(['light', 'climate', 'media_player'], aid).length) tabs.push(tab(aid, areas[aid].name, areas[aid].icon || 'mdi:door', aid));
  });
  return tabs.slice(0, 6);
}

// Kanvas ölçekleme. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
const LemurScale = (() => {
  const ID = 'lemur-panel-scale';
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
    const active = !!sr.querySelector('lemur-panel-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-panel');
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

// Pano stratejisi: `strategy: { type: custom:lemur-panel }` yazılan pano bu sınıfla üretilir.
// HA kuralı: custom:lemur-panel → <ll-strategy-dashboard-lemur-panel>, static generate(config, hass).
class LemurPanelStrategy extends HTMLElement {
  static async generate(config, hass) {
    const lang = pickLang(hass);
    let data = null;
    try { data = await STORE.load(hass); } catch (e) { data = null; }
    if (!data) {
      return { views: [{ title: 'Lemur Panel', type: 'panel', cards: [{ type: 'markdown', content: t(lang, 'not_loaded') }] }] };
    }
    const tabs = (data.tabs && data.tabs.length) ? data.tabs : buildDefaultTabs(hass, lang);
    const settings = data.settings || {};
    LemurScale.set(settings.canvas || null);
    return {
      views: tabs.map((tab) => ({
        title: tab.name,
        path: tab.id,
        icon: tab.icon,
        type: 'panel',
        theme: settings.theme_name || undefined,
        cards: [{ type: 'custom:lemur-panel-card', tab: tab.id }]
      }))
    };
  }
}

// lemur-panel-card: bir sekmeyi baştan sona çizer. TASLAK: iskelet düzen, ışık karoları ve senaryo düğmeleri çalışıyor;
// iklim/medya bölümleri yer tutucu. Eski Safari için ?. ve ?? yok.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

class LemurPanelCard extends HTMLElement {
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

// lemur-panel-admin: sol menüdeki yönetim paneli. TASLAK: şimdilik ayarları gösterir, varsayılana dönebilir.
// Hedef: Light Effect Card'ın kontrol paneli düzeninde sekme/bölüm/cihaz/boyut düzenleme, sürükle-bırak, canlı önizleme.
class LemurPanelAdmin extends HTMLElement {
  set hass(h) { const first = !this._hass; this._hass = h; if (first) STORE.load(h).then(() => this._render()).catch(() => this._render()); }
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panel = p; }
  _render() {
    const lang = pickLang(this._hass);
    const d = STORE.data;
    this.innerHTML = '<div style="padding:24px;max-width:960px;font-family:var(--primary-font-family, sans-serif);color:var(--primary-text-color)">' +
      '<h1 style="margin:0 0 8px">' + t(lang, 'admin_title') + '</h1><p>' + t(lang, 'admin_intro') + '</p>' +
      (d ? '<button id="reset">' + t(lang, 'reset') + '</button><pre style="white-space:pre-wrap;font-size:12px;opacity:.8">' + esc(JSON.stringify(d, null, 2)) + '</pre>' : '<p>' + t(lang, 'not_loaded') + '</p>') + '</div>';
    const r = this.querySelector('#reset');
    if (r) r.addEventListener('click', () => STORE.set('tabs', []).then(() => this._render()));
  }
}

customElements.define('ll-strategy-dashboard-lemur-panel', LemurPanelStrategy);
customElements.define('lemur-panel-card', LemurPanelCard);
customElements.define('lemur-panel-admin', LemurPanelAdmin);
console.info('%c LEMUR PANEL %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
