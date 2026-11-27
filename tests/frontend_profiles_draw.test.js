// Pano kartı GERÇEKTEN çizilir (derlenmiş paket, sahte DOM): PR #35'te _build içindeki tileGrid, _render'da tanımlı `canvas`
// değişkenini kullanıyordu; sözdizimi denetimi ve birim testleri geçti ama karo içeren her pano ReferenceError ile boş kaldı.
// Burada kart profilli ve profilsiz, tablet ve telefon düzeninde, sütun ve serbest ızgarada, karo ve kaydırıcı ışıklarla,
// iklim satırı / Halo ile baştan sona _render edilir; hata atmamalı ve karoların sütun sayısı profilin kanvas genişliğinden gelmeli.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const BUNDLE = process.env.LHD_BUNDLE || path.join(__dirname, '../custom_components/lemur_home_dashboard/frontend/lemur-home-dashboard.js');

// her şeye "var ama boş" diyen küçük DOM taklidi: çizim HTML üretir, bağlama adımı öğe bulamaz
function el() {
  const e = {
    style: { setProperty() {}, removeProperty() {}, getPropertyValue() { return ''; } },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {}, children: [], childNodes: [], offsetWidth: 1280, offsetHeight: 800, clientWidth: 1280, clientHeight: 800, isConnected: true,
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {}, hasAttribute() { return false; },
    appendChild(c) { return c; }, removeChild() {}, insertBefore(c) { return c; }, remove() {}, append() {}, prepend() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; }, closest() { return null; },
    getBoundingClientRect() { return { x: 0, y: 0, top: 0, left: 0, width: 1280, height: 800, right: 1280, bottom: 800 }; },
    attachShadow() { this.shadowRoot = el(); return this.shadowRoot; }, focus() {}, blur() {}, animate() { return { finished: Promise.resolve(), cancel() {} }; }
  };
  let html = '';
  Object.defineProperty(e, 'innerHTML', { get() { return html; }, set(v) { html = String(v); } });
  Object.defineProperty(e, 'textContent', { get() { return ''; }, set() {} });
  return e;
}
function load(w, h) {
  const defs = {};
  const store = {};
  class HTMLElementStub { constructor() { Object.assign(this, el()); delete this.shadowRoot; } }
  const win = {
    innerWidth: w, innerHeight: h, devicePixelRatio: 1, location: { pathname: '/lemur-home/a', search: '', hash: '' },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    requestAnimationFrame: () => 0, customCards: []
  };
  const doc = { querySelector: () => null, querySelectorAll: () => [], createElement: () => el(), getElementById: () => null, addEventListener() {}, removeEventListener() {}, body: el(), head: el(), documentElement: el(), hidden: false, fonts: { ready: Promise.resolve() } };
  const ctx = {
    window: win, document: doc, navigator: { userAgent: 'node', language: 'tr' }, location: win.location, history: { pushState() {}, replaceState() {} },
    HTMLElement: HTMLElementStub, customElements: { define(n, c) { defs[n] = c; }, get(n) { return defs[n]; }, whenDefined: () => Promise.resolve() },
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {}, requestAnimationFrame: () => 0, getComputedStyle: () => ({ paddingTop: '0px', getPropertyValue: () => '' }),
    Event: class { constructor(t) { this.type = t; } }, CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
    ResizeObserver: class { observe() {} disconnect() {} }, MutationObserver: class { observe() {} disconnect() {} },
    fetch: () => Promise.reject(new Error('yok')), console: { log() {}, warn() {}, error() {}, info() {}, debug() {} }, performance: { now: () => 0 }
  };
  win.document = doc; win.customElements = ctx.customElements; win.localStorage = ctx.localStorage;
  vm.createContext(ctx);
  ctx.window.__LEMUR_HOME_DASHBOARD_STORE = { data: null, subs: [], load() { return Promise.resolve(this.data); }, onChange(f) { this.subs.push(f); return () => {}; } };
  vm.runInContext(fs.readFileSync(BUNDLE, 'utf8'), ctx, { filename: 'lemur-home-dashboard.js' });
  return { ctx, defs };
}
const S = (id, state, attrs) => ({ entity_id: id, state: state, attributes: attrs || {}, last_changed: '2026-11-27T10:00:00Z', last_updated: '2026-11-27T10:00:00Z' });
function hass() {
  const st = {};
  for (let i = 0; i < 12; i++) st['light.l' + i] = S('light.l' + i, i % 2 ? 'on' : 'off', { friendly_name: 'Lamba ' + i, brightness: 120, supported_color_modes: ['brightness'] });
  st['climate.k'] = S('climate.k', 'heat', { friendly_name: 'Klima', current_temperature: 21, temperature: 22, hvac_modes: ['heat', 'off'], min_temp: 7, max_temp: 30, target_temp_step: 0.5 });
  st['vacuum.v'] = S('vacuum.v', 'docked', { friendly_name: 'Süpürge', battery_level: 90 });
  st['media_player.tv'] = S('media_player.tv', 'playing', { friendly_name: 'TV', media_title: 'Film' });
  st['cover.p'] = S('cover.p', 'open', { friendly_name: 'Perde', current_position: 50, supported_features: 15 });
  st['script.s'] = S('script.s', 'off', { friendly_name: 'Sahne', icon: 'mdi:movie' });
  return { states: st, entities: {}, devices: {}, areas: {}, floors: {}, services: {}, language: 'tr', locale: { language: 'tr' }, themes: { darkMode: true },
    config: { unit_system: { temperature: '°C' }, time_zone: 'Europe/Istanbul', components: [] }, user: { is_admin: true },
    callService: () => Promise.resolve(), callWS: () => Promise.resolve(null), connection: { sendMessagePromise: () => Promise.resolve(null), subscribeMessage: () => Promise.resolve(() => {}) } };
}
const LIGHTS = Array.from({ length: 12 }, (_, i) => 'light.l' + i);
function tabs(prefix) {
  return [
    { id: prefix + 'a', name: 'A', icon: 'mdi:home', columns: [1, 1, 1], sections: [
      { id: prefix + 'a-l', type: 'lights', title: 'Işıklar', col: 0, entities: LIGHTS },
      { id: prefix + 'a-s', type: 'scenes', title: 'Sahneler', col: 1, entities: ['script.s'] },
      { id: prefix + 'a-c', type: 'climate', title: 'İklim', col: 2, entities: ['climate.k', 'vacuum.v', 'media_player.tv', 'cover.p'] }] },
    { id: prefix + 'g', name: 'G', icon: 'mdi:grid', layout: 'grid', sections: [
      { id: prefix + 'g-l', type: 'lights', title: 'Işıklar', look: 'bar', entities: LIGHTS.slice(0, 4), g: { x: 0, y: 0, w: 6, h: 6 } },
      { id: prefix + 'g-c', type: 'climate', title: 'İklim', entities: ['climate.k'], g: { x: 6, y: 0, w: 6, h: 6 } }] }
  ];
}
function draw(w, h, data, cfg) {
  const { ctx, defs } = load(w, h);
  ctx.window.__LEMUR_HOME_DASHBOARD_STORE.data = data;
  const Card = defs['lemur-home-dashboard-card'];
  assert.ok(Card, 'kart tanımlanmadı');
  const card = new Card();
  card.setConfig(cfg);
  card._hass = hass();
  card._render();   // hata atarsa test kırmızı (PR #35: ReferenceError: canvas is not defined)
  return card.shadowRoot.innerHTML;
}
// ışık bölümünün karo ızgarasındaki sütun sayısı (tileGrid). Üç eşit sütunda 1280 kanvasta 4, 2560'ta 5 karo sığar.
const cols = (html) => { const m = /data-sec="a-l"[^>]*>(?:<div class="grid" style=")?[^"]*?repeat\((\d+)/.exec(html); return m ? +m[1] : null; };

const DATA = () => ({ version: 1, settings: { canvas: { width: 1280 }, climate_style: 'halo' }, tabs: tabs(''),
  profiles: { tv: { name: 'TV', settings: { canvas: { width: 2560 }, climate_style: 'rows', icon_style: 'mono' } }, own: { name: 'Ayrı', tabs: tabs('o') } } });

for (const [w, h, label] of [[1280, 800, 'tablet'], [390, 844, 'telefon']]) {
  test('kart profilsiz çizilir, karolar ve iklim kartı var (' + label + ')', () => {
    for (const tab of ['a', 'g']) {
      const html = draw(w, h, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: tab });
      assert.match(html, /data-light="light\.l1"/, tab + ': ışık karosu çizilmedi');
    }
  });
  test('kart profille çizilir: kendi sekmeleri ve bilinmeyen profil (' + label + ')', () => {
    const own = draw(w, h, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'og', profile: 'own' });
    assert.match(own, /data-light="light\.l1"/);
    const tv = draw(w, h, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'a', profile: 'tv' });
    assert.match(tv, /data-light="light\.l1"/);
    const yok = draw(w, h, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'a', profile: 'yok' });
    assert.equal(yok, draw(w, h, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'a' }), 'bilinmeyen profil ana pano gibi çizilmeli');
  });
}

test('tablette karo sütun sayısı profilin kanvas genişliğinden gelir (tileGrid)', () => {
  const base = draw(1280, 800, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'a' });
  const tv = draw(1280, 800, DATA(), { type: 'custom:lemur-home-dashboard-card', tab: 'a', profile: 'tv' });
  const wide = DATA(); wide.settings.canvas.width = 2560;
  const mainWide = draw(1280, 800, wide, { type: 'custom:lemur-home-dashboard-card', tab: 'a' });
  assert.ok(cols(base) !== null, 'karo ızgarası bulunamadı');
  assert.equal(cols(base), 4);
  assert.equal(cols(tv), cols(mainWide), 'profilin 2560 kanvası ana ayardaki 2560 ile aynı sütun sayısını vermeli');
  assert.ok(cols(tv) > cols(base), 'geniş kanvasta daha çok sütun beklenir: ' + cols(base) + ' / ' + cols(tv));
  // profilin iklim stili (rows) yalnız profilli kartta
  assert.match(tv, /class="clr/); assert.doesNotMatch(base, /class="clr/);
});
