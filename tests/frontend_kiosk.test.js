// Kiosk ayarı (src/scale.js): yan menü ve üst bar her yerde ya da sadece telefon ve tablette gizlenir. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/scale.js'), 'utf8');
function load(w, h, coarse) {
  const store = {};
  const win = { innerWidth: w, innerHeight: h, matchMedia: (q) => ({ matches: q.indexOf('coarse') >= 0 && coarse }), addEventListener: () => {} };
  const ctx = { window: win, document: { querySelector: () => null }, setInterval: () => 0, setTimeout: () => 0, localStorage: { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = v; } }, JSON: JSON };
  vm.createContext(ctx);
  vm.runInContext(src + '\nthis.K = { lpKioskOn, LemurScale };', ctx);
  return { K: ctx.K, store: store };
}
test('touch option hides only on phones and tablets', () => {
  const pc = load(1920, 1080, false).K, tab = load(1280, 800, true).K, ph = load(390, 844, false).K;
  assert.strictEqual(pc.lpKioskOn('touch'), false);
  assert.strictEqual(tab.lpKioskOn('touch'), true);
  assert.strictEqual(ph.lpKioskOn('touch'), true);
  [true, 'all'].forEach((v) => assert.strictEqual(pc.lpKioskOn(v), true));
  [null, undefined, false, ''].forEach((v) => assert.strictEqual(tab.lpKioskOn(v), false));
});
test('the setting is kept in the browser for the next load', () => {
  const L = load(1920, 1080, false);
  L.K.LemurScale.set(null, { hide_sidebar: 'touch' });
  assert.strictEqual(JSON.parse(L.store['lhd-kiosk']).hide_sidebar, 'touch');
});

// #11: üst bar gizliyken içerik durum çubuğunun altına kaymaz, durum çubuğu zeminin rengini alır; pano kapanınca HA'nın rengi geri gelir
function fakeHA(w, h, withCard) {
  const mk = () => { const kids = []; return { kids, appendChild: (e) => kids.push(e), getElementById: (id) => kids.filter((k) => k.id === id)[0] || null, querySelector: () => null }; };
  const meta = { c: '#03a9f4', getAttribute: () => meta.c, setAttribute: (k, v) => { meta.c = v; } };
  const rootSR = mk(), mainSR = mk(), panelSR = mk();
  const card = {};
  rootSR.querySelector = (q) => (q === 'lemur-home-dashboard-card' && withCard.on ? card : (q === 'hui-view-container' ? { getBoundingClientRect: () => ({ width: w, top: 0 }) } : null));
  const huiRoot = { shadowRoot: rootSR, lovelace: null };
  panelSR.querySelector = (q) => (q === 'hui-root' ? huiRoot : null);
  mainSR.querySelector = (q) => (q === 'ha-panel-lovelace' ? { shadowRoot: panelSR } : null);
  const ha = { shadowRoot: { querySelector: (q) => (q === 'home-assistant-main' ? { shadowRoot: mainSR } : null) } };
  const doc = { querySelector: (q) => (q === 'home-assistant' ? ha : (q === 'meta[name=theme-color]' ? meta : null)), createElement: () => ({ id: '', textContent: '' }) };
  const win = { innerWidth: w, innerHeight: h, matchMedia: () => ({ matches: true }), addEventListener: () => {} };
  const ctx = { window: win, document: doc, navigator: { userAgent: 'iPhone' }, getComputedStyle: () => ({ paddingTop: '47px' }), setInterval: () => 0, setTimeout: () => 0, localStorage: { getItem: () => null, setItem: () => {} }, JSON: JSON };
  vm.createContext(ctx);
  vm.runInContext(src + '\nthis.K = { LemurScale };', ctx);
  return { K: ctx.K, meta, rootSR };
}
test('hidden top bar keeps the status bar gap and paints it in the background colour', () => {
  const st = { on: true };
  const F = fakeHA(390, 844, st);
  F.K.LemurScale.set(null, { hide_header: 'touch' }, '#0b0e15');
  const css = F.rootSR.getElementById('lemur-home-dashboard-kiosk').textContent;
  assert.ok(/padding-top:var\(--safe-area-inset-top/.test(css), css);
  assert.ok(!/padding-top:0/.test(css));
  assert.strictEqual(F.meta.c, '#0b0e15');
  st.on = false; F.K.LemurScale.run();
  assert.strictEqual(F.meta.c, '#03a9f4');
});
test('with the top bar shown the theme colour is left to HA', () => {
  const F = fakeHA(1280, 800, { on: true });
  F.K.LemurScale.set(null, { hide_header: false }, '#0b0e15');
  assert.strictEqual(F.meta.c, '#03a9f4');
});
