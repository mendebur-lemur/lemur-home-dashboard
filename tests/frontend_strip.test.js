// Şerit uzunluğu (v0.28.6): ışığın düzenlemesinde uzunluk değişince tablo ve değerler ölçeklenir, adaptör gücünü geçmez.
// Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const A = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
// sınıftan tek bir yöntemi gövdesiyle al
function method(name) {
  const i = A.indexOf('\n  ' + name + '(');
  assert.ok(i >= 0, name);
  const open = A.indexOf('{', A.indexOf(')', i));
  let d = 0, j = open;
  for (; j < A.length; j++) { if (A[j] === '{') d++; else if (A[j] === '}') { d--; if (!d) break; } }
  return A.slice(i + 3, j + 1);
}
const lpEnNumOf = (v) => { const x = parseFloat(String(v === undefined || v === null ? '' : v).replace(',', '.')); return isFinite(x) ? x : 0; };
const lhdClone = (x) => JSON.parse(JSON.stringify(x));
const body = ['_enStripK', '_enRec', '_lrnScale', '_lrnSpan', '_enDraft'].map(method).join('\n');
const Cls = new Function('lpEnNumOf', 'lhdClone', 'return class { ' + body + ' }')(lpEnNumOf, lhdClone);
const mk = (E) => { const o = new Cls(); o._enEsts = () => E; return o; };
const lut = { ct: { w: [[1, 10], [2, 20]] }, br: { w: [0.5, 34.2] }, fx: { e: { a: 30 }, avg: 25 } };

test('a strip without a stored length takes the length of the strip it shares the table with', () => {
  const E = { koltuk: { name: 'Koltuk', kind: 'light', entity: 'light.k', idle: 0, max: 34.2, lut: lut, strip: true, len: 4.6, cap: 72 }, tv: { name: 'TV', kind: 'light', entity: 'light.tv', idle: 0, max: 34.2, lut: lhdClone(lut) } };
  const o = mk(E); o._enDraft('tv');
  const f = o._enE.f;
  assert.strictEqual(f.strip, true); assert.strictEqual(f.lenref, '4.6'); assert.strictEqual(f.cap, '72');
  f.len = '2.3';
  const e = o._enRec(f);
  assert.strictEqual(e.len, 2.3); assert.strictEqual(e.cap, 72); assert.strictEqual(e.strip, true);
  assert.deepStrictEqual(e.lut.br.w, [0.25, 17.1]); assert.strictEqual(e.max, 17.1); assert.strictEqual(e.lut.fx.avg, 12.5);
});

test('a stored length is the reference; longer strips stop at the adapter power', () => {
  const E = { s: { name: 'S', kind: 'light', entity: 'light.s', idle: 0, max: 34.2, lut: lut, strip: true, len: 4.6, cap: 40 } };
  const o = mk(E); o._enDraft('s');
  const f = o._enE.f; f.len = '9.2';
  const e = o._enRec(f);
  assert.deepStrictEqual(e.lut.br.w, [1, 40]); assert.strictEqual(e.max, 40);
  f.len = '4.6';
  assert.deepStrictEqual(o._enRec(f).lut.br.w, [0.5, 34.2]);
});

test('without a table min and max are scaled; not a strip leaves everything as it was', () => {
  const E = { s: { name: 'S', kind: 'light', entity: 'light.s', idle: 0.5, min: 1.5, max: 10.5, strip: true, len: 2 } };
  const o = mk(E); o._enDraft('s');
  const f = o._enE.f; f.len = '4';
  const e = o._enRec(f);
  assert.strictEqual(e.max, 20.5); assert.strictEqual(e.min, 2.5);
  f.strip = false;
  const e2 = o._enRec(f);
  assert.strictEqual(e2.max, 10.5); assert.strictEqual(e2.strip, undefined); assert.strictEqual(e2.len, undefined);
});
