// Performans düzeltmeleri (v0.36.0, perf turu): telefon/tablet kararının önbelleği, enerji sayı biçimleyicisi, yönetim panelinde otomatik düzenin önbelleği.
// Çalıştır: node --test tests/frontend_perf036.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

function scale(w, h) {
  const L = {}, win = { _w: w, _h: h, reads: 0, matchMedia: () => ({ matches: false }), addEventListener: (ev, f) => { (L[ev] = L[ev] || []).push(f); } };
  Object.defineProperty(win, 'innerWidth', { get() { win.reads++; return win._w; } });
  Object.defineProperty(win, 'innerHeight', { get() { win.reads++; return win._h; } });
  const ctx = { window: win, document: { querySelector: () => null }, navigator: { userAgent: '' }, setInterval: () => 0, setTimeout: () => 0, localStorage: { getItem: () => null, setItem: () => {} }, JSON };
  vm.createContext(ctx);
  vm.runInContext(rd('scale.js') + '\nthis.ph = lpPhoneScreen;', ctx);
  return { ph: ctx.ph, win, fire: (ev) => (L[ev] || []).forEach((f) => f()) };
}

test('lpPhoneScreen: pencere boyutu bir kez okunur, resize olunca yeniden hesaplanır', () => {
  const S = scale(1280, 800);
  assert.strictEqual(S.ph(), false);
  const r = S.win.reads;
  for (let i = 0; i < 20; i++) S.ph();
  assert.strictEqual(S.win.reads, r, 'her çağrıda innerWidth/innerHeight okunmamalı (zorunlu yerleşim)');
  S.win._w = 390; S.win._h = 844;
  S.fire('resize');
  assert.strictEqual(S.ph(), true, 'dar pencere: telefon');
  S.win._w = 1280; S.win._h = 800; S.fire('orientationchange');
  assert.strictEqual(S.ph(), false, 'döndürünce tablet');
  S.win._w = 800; S.win._h = 1280; S.fire('resize');
  assert.strictEqual(S.ph(), true, 'dikey tablet telefon düzeninde');
});

test('lpPhoneScreen: resize dinleyicisi yakalama aşamasında (kartların resize dinleyicilerinden önce) kurulur', () => {
  const src = rd('scale.js');
  assert.ok(/addEventListener\(ev, \(\) => \{ lpPhS = null; \}, true\)/.test(src));
});

function enNum() {
  const src = rd('energy.js'), a = src.indexOf('const LP_EN_NF = {};'), b = src.indexOf('\n}\n', src.indexOf('function lpEnNum(', a)) + 3;
  assert.ok(a > 0 && b > a, 'lpEnNum bulunamadı');
  let made = 0;
  const NF = function (loc, o) { made++; return new Intl.NumberFormat(loc, o); };
  const ctx = { Intl: { NumberFormat: NF }, Number };
  vm.createContext(ctx);
  vm.runInContext(src.slice(a, b) + '\nthis.f = lpEnNum;', ctx);
  return { f: ctx.f, made: () => made };
}

test('lpEnNum: toLocaleString ile aynı çıktı, biçimleyici dil ve ondalık başına bir kez kurulur', () => {
  const E = enNum();
  const vals = [0, 1, 1.25, 12.5, 999.95, 1234.5, -3.14159, 1e6, NaN, '42.7'];
  for (const lang of ['tr', 'en']) for (const d of [0, 1, 2]) for (const v of vals) {
    const want = Number(v).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    assert.strictEqual(E.f(v, d, lang), want, lang + ' ' + d + ' ' + v);
  }
  assert.strictEqual(E.made(), 6, 'iki dil x üç ondalık');
});

function work() {
  const src = rd('admin.js'), a = src.indexOf('  _work() {'), b = src.indexOf('\n  }\n', a) + 4;
  assert.ok(a > 0 && b > a, '_work bulunamadı');
  let calls = 0;
  const ctx = { STORE: { data: { tabs: [] } }, buildDefaultTabs: (h, l) => { calls++; return [{ id: 'home', name: l + h.n, sections: [] }]; }, lhdClone: (x) => JSON.parse(JSON.stringify(x)), lhdNormTab: (x) => x };
  vm.createContext(ctx);
  vm.runInContext('this.o = {' + src.slice(a, b) + '};', ctx);
  return { ctx, o: ctx.o, calls: () => calls };
}

test('yönetim paneli _work: otomatik düzen aynı hass ve dil için bir kez kurulur, dışarı kopyası verilir', () => {
  const W = work(), h1 = { n: 1 };
  W.o._hass = h1; W.o._lang = 'tr';
  const a = W.o._work(); a[0].name = 'değişti';
  const b = W.o._work();
  assert.strictEqual(W.calls(), 1);
  assert.strictEqual(b[0].name, 'tr1', 'saklanan düzen dışarıdaki değişiklikten etkilenmez');
  assert.notStrictEqual(a, b);
  W.o._hass = { n: 2 }; assert.strictEqual(W.o._work()[0].name, 'tr2'); assert.strictEqual(W.calls(), 2, 'yeni hass: yeniden kurulur');
  W.o._lang = 'en'; assert.strictEqual(W.o._work()[0].name, 'en2'); assert.strictEqual(W.calls(), 3, 'dil değişince yeniden kurulur');
  W.ctx.STORE.data = { tabs: [{ id: 'x', name: 'Kayıtlı', sections: [] }] };
  assert.strictEqual(W.o._work()[0].name, 'Kayıtlı', 'kayıtlı düzen varsa o');
  assert.strictEqual(W.calls(), 3);
});
