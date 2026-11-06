// Perde penceresinin yardımcıları (src/coverpop.js): tasarım seçimi, yön, çizim ölçüleri, sürüklemeden konum. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../src/coverpop.js'), 'utf8');
const ctx = { LemurLightPopup: class {} };
vm.createContext(ctx);
vm.runInContext(src + '\nthis.C = { lpCovStyle, lpCovDir, lpCovGeom, lpCovFromPt, LP_COV_STYLES, LP_COV_N };', ctx);
const C = ctx.C;
const st = (dc) => ({ state: 'open', attributes: dc ? { device_class: dc } : {} });

test('style: item choice first, then device class, shutter by default', () => {
  assert.strictEqual(C.lpCovStyle(st('curtain'), { cover: 'vert' }), 'vert');
  assert.strictEqual(C.lpCovStyle(st('curtain'), {}), 'center');
  assert.strictEqual(C.lpCovStyle(st('shade'), {}), 'shade');
  assert.strictEqual(C.lpCovStyle(st('awning'), {}), 'shade');
  assert.strictEqual(C.lpCovStyle(st('blind'), {}), 'blind');
  assert.strictEqual(C.lpCovStyle(st('shutter'), {}), 'shutter');
  assert.strictEqual(C.lpCovStyle(st(''), { cover: 'bogus' }), 'shutter');
  assert.strictEqual(C.lpCovStyle(null, null), 'shutter');
  assert.strictEqual(C.lpCovStyle({ state: 'open', attributes: { supported_features: 255 } }, {}), 'blind');
  assert.strictEqual(C.lpCovStyle({ state: 'open', attributes: { device_class: 'shutter', supported_features: 255 } }, {}), 'shutter');
});

test('direction: one-side curtain left by default, vertical blind both sides by default', () => {
  assert.strictEqual(C.lpCovDir('side', {}), 'l');
  assert.strictEqual(C.lpCovDir('side', { cover_dir: 'r' }), 'r');
  assert.strictEqual(C.lpCovDir('side', { cover_dir: 'c' }), 'l');
  assert.strictEqual(C.lpCovDir('vert', {}), 'c');
  assert.strictEqual(C.lpCovDir('vert', { cover_dir: 'l' }), 'l');
});

test('geometry: closed covers the window, open leaves a small stack', () => {
  assert.ok(C.lpCovGeom('center', 'l', 0).wl > 49);
  assert.ok(C.lpCovGeom('center', 'l', 100).wl < 6);
  assert.strictEqual(C.lpCovGeom('side', 'r', 50).wl, undefined);
  assert.ok(C.lpCovGeom('side', 'r', 50).wr > 50);
  assert.ok(C.lpCovGeom('shutter', 'l', 0).h >= 100);
  assert.ok(C.lpCovGeom('shade', 'l', 100).h <= 10);
  const b = C.lpCovGeom('blind', 'l', 0, 0);
  assert.strictEqual(b.slats.length, C.LP_COV_N);
  assert.strictEqual(b.slats[0].sc, 1);
  assert.ok(C.lpCovGeom('blind', 'l', 0, 100).slats[0].sc < 0.2);
  // dikey, iki yana, kapalı: kanatlar bütün pencereyi kaplar ve ortada boşluk kalmaz
  const v = C.lpCovGeom('vert', 'c', 0, 0).slats, n = v.length;
  assert.ok(v[0].left <= 0.01 && v[n - 1].left + 100 / n > 99.9);
  assert.ok(v[n / 2].left - (v[n / 2 - 1].left + v[n / 2 - 1].w) < 2);
  // açık: kanatlar iki kenarda toplanır
  const vo = C.lpCovGeom('vert', 'c', 100, 0).slats;
  assert.ok(vo[n / 2 - 1].left < 1 && vo[n / 2].left > 92);
  // değerler sınırların dışına çıkmaz
  assert.deepStrictEqual(C.lpCovGeom('shutter', 'l', 150), C.lpCovGeom('shutter', 'l', 100));
});

test('drag point to position', () => {
  assert.strictEqual(C.lpCovFromPt('center', 'l', 50, 0), 0);
  assert.strictEqual(C.lpCovFromPt('center', 'l', 0, 0), 100);
  assert.strictEqual(C.lpCovFromPt('side', 'l', 0, 0), 100);
  assert.strictEqual(C.lpCovFromPt('side', 'r', 0, 0), 0);
  assert.strictEqual(C.lpCovFromPt('vert', 'c', 100, 0), 100);
  assert.strictEqual(C.lpCovFromPt('shutter', 'l', 0, 50), 53);
  assert.strictEqual(C.lpCovFromPt('shade', 'l', 0, 100), 100);
});
