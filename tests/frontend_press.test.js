// v0.35.2: dokunmatik + fareli cihazda (Windows tablet, dokunmatik dizüstü) parmakla bir dokunuştan sonra fare de çalışmalı.
// Önce lpPress / lpSlide fareyi o karo yeniden kurulana kadar tamamen yok sayıyordu. Dokunuşun hemen ardından gelen
// (taklit) fare olayları ise yine yok sayılmalı: bir dokunuş tek komut.
// Çalıştır: node --test tests/frontend_press.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const pick = (re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };
const code = pick(/const LP_HOLD_MS = [^\n]*\n/) + pick(/function lpPress\(el, tap, hold\) \{[\s\S]*?\n\}\n/) + pick(/function lpSlide\(el, o\) \{[\s\S]*?\n\}\n/) + 'this.F = { lpPress, lpSlide };';
let now = 1000000;
const ctx = { Date: { now: () => now }, setTimeout: () => 0, clearTimeout: () => {}, Math: Math, document: { D: {}, addEventListener(t, f) { (this.D[t] = this.D[t] || []).push(f); }, removeEventListener(t, f) { this.D[t] = (this.D[t] || []).filter((x) => x !== f); } } };
vm.createContext(ctx); vm.runInContext(code, ctx);
const fake = () => {
  const L = {};
  return { L, classList: { add() {}, remove() {} }, getBoundingClientRect: () => ({ width: 100 }), addEventListener: (t, f) => { (L[t] = L[t] || []).push(f); },
    fire(t, e) { (L[t] || []).forEach((f) => f(Object.assign({ button: 0, clientX: 5, clientY: 5, touches: [{ clientX: 5, clientY: 5 }], cancelable: true, preventDefault() {} }, e || {}))); } };
};
const click = (el) => { el.fire('mousedown'); el.fire('mouseup'); };
const touch = (el) => { el.fire('touchstart'); el.fire('touchend'); };

test('lpPress: dokunuş tek komut, hemen ardından gelen fare olayları sayılmaz', () => {
  let n = 0; const el = fake(); ctx.F.lpPress(el, () => n++, null);
  touch(el); click(el);
  assert.strictEqual(n, 1);
});
test('lpPress: dokunuştan sonra fareyle tıklama da çalışır', () => {
  let n = 0; const el = fake(); ctx.F.lpPress(el, () => n++, null);
  touch(el); now += 2000; click(el); click(el);
  assert.strictEqual(n, 3);
});
test('lpSlide: dokunuştan sonra fareyle tıklama da çalışır', () => {
  let n = 0; const el = fake();
  ctx.F.lpSlide(el, { tap: () => n++, hold() {}, can: () => true, start: () => 0, move() {}, end() {} });
  touch(el); click(el); assert.strictEqual(n, 1, 'taklit fare olayı sayılmamalı');
  now += 2000; el.fire('mousedown'); (ctx.document.D.mouseup || []).slice().forEach((f) => f({}));
  assert.strictEqual(n, 2, 'dokunuştan sonra fare de çalışmalı');
});
