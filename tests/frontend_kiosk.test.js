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
