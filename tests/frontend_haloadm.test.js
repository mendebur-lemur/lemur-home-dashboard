// v0.36: öğe penceresi, duruma göre görünüm satırları (hareket, çerçeve, ad, simge): yükle → kaydet gidiş dönüşü.
// Çalıştır: node --test tests/frontend_haloadm.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const safe = fs.readFileSync(path.join(__dirname, '../src/safe.js'), 'utf8');
const pick = (re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };
const code = [
  /const lhdIsObj = [^\n]*\n/.exec(safe)[0],
  pick(/function lhdScLoad\(f, sc\) \{[\s\S]*?\n\}\n/),
  pick(/function lhdScBuild\([^)]*\) \{[\s\S]*?\n\}\n/),
  pick(/const lhdScCanon = [^\n]*\n/),
  pick(/function lhdScVal\(f, q, col\) \{[\s\S]*?\n\}\n/),
].join('') + 'this.F = { lhdScLoad, lhdScVal };';
const ctx = {}; vm.createContext(ctx); vm.runInContext(code, ctx);
const F = ctx.F;
const J = (x) => JSON.stringify(x);
// _imSave ile aynı: durumu boş satır yazılmaz
const save = (f) => { const m = {}; f.scRows.forEach((r, q) => { const k = String(r[0]).trim(); if (k) m[k] = F.lhdScVal(f, q, r[1]); }); return m; };
const SC = { entity: 'sensor.d', map: { aktif: 'green', yem: { color: 'yellow', effect: 'blink', name: 'Yem Zamanı', frame: true },
  acil: { color: 'red', effect: 'blink', name: 'Acilen Besle', icon: 'mdi:alert-circle', frame: true }, sade: { color: 'blue' }, eski: { effect: 'still', gelecek: 1 } } };

test('dokunulmayan satırlar bayt bayt aynı kalır', () => {
  const f = {}; F.lhdScLoad(f, SC);
  assert.strictEqual(f.scRows.length, 5);
  assert.strictEqual(f.scfx1, 'blink'); assert.strictEqual(f.scname2, 'Acilen Besle'); assert.strictEqual(f.scicon2, 'mdi:alert-circle'); assert.strictEqual(f.scfr2, true); assert.strictEqual(f.scfr0, false);
  assert.strictEqual(J(save(f)), J(SC.map));   // düz yazı düz, nesne nesne ({ color } bile), bilinmeyen alan korunur
});

test('yalnız renk: düz yazı; ek ayar: nesne; ekler silinince yine düz yazı', () => {
  const f = {}; F.lhdScLoad(f, { map: { aktif: 'green' } });
  f.scRows.push(['acil', '#ff3737']);
  assert.strictEqual(J(save(f)), J({ aktif: 'green', acil: '#ff3737' }));
  Object.assign(f, { scfx1: 'blink', scfr1: true, scname1: '  Acilen Besle ', scicon1: 'mdi:alert-circle' });
  assert.strictEqual(J(save(f).acil), J({ color: '#ff3737', effect: 'blink', name: 'Acilen Besle', icon: 'mdi:alert-circle', frame: true }));
  Object.assign(f, { scfx1: '', scname1: 'Acil' });   // boşlar yazılmaz
  assert.strictEqual(J(save(f).acil), J({ color: '#ff3737', name: 'Acil', icon: 'mdi:alert-circle', frame: true }));
  // kaydedilmiş hâlinden yeniden yükle ve ekleri temizle
  const g = {}; F.lhdScLoad(g, { map: save(f) });
  Object.assign(g, { scname1: '', scicon1: '', scfr1: false });
  assert.strictEqual(J(save(g)), J({ aktif: 'green', acil: '#ff3737' }));
});

test('renk değişince nesnenin ekleri korunur; durum adı değişince de (satır sırasıyla)', () => {
  const f = {}; F.lhdScLoad(f, SC);
  f.scRows[1][1] = '#ffaa00'; f.scRows[2][0] = 'cok_acil';
  const m = save(f);
  assert.strictEqual(J(m.yem), J({ color: '#ffaa00', effect: 'blink', name: 'Yem Zamanı', frame: true }));
  assert.ok(!m.acil); assert.strictEqual(m.cok_acil.name, 'Acilen Besle');
  f.scRows[4][0] = ''; assert.ok(!('eski' in save(f)));   // durumu silinen satır gider
});

test('nesnedeki fazlalıklar: renk + frame:false → düz yazı yerine asıl hâli (anlamca aynıysa dokunulmaz)', () => {
  const o = { color: 'red', frame: false };
  const f = {}; F.lhdScLoad(f, { map: { x: o } });
  assert.strictEqual(save(f).x, o);
  f.scfx0 = 'pulse';
  assert.strictEqual(J(save(f).x), J({ color: 'red', effect: 'pulse' }));
});
