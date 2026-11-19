'use strict';
// Işık penceresi: yakın özel beyaz tonlarında (2700 / 2750 / 2800 K) yalnız ışığın değerine en yakın düğme seçili görünür.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const pop = fs.readFileSync(require('node:path').join(__dirname, '../src/lightpop.js'), 'utf8');
const a = pop.indexOf('    const kReal ='), b = pop.indexOf('    const ef =', a);
assert.ok(a > 0 && b > a);
const run = new Function('self', 'R', 'tgt', 'ta', pop.slice(a, b).replace(/this\./g, 'self.'));
const mk = (ks) => { const els = ks.map((k) => ({ k: k, on: false, getAttribute: () => String(k), classList: { toggle(c, v) { els.find((e) => e === this.el).on = !!v; } } })); els.forEach((e) => { e.classList.el = e; }); return els; };
const sel = (ks, kReal, hold) => {
  const els = mk(ks), self = { _kHold: hold || null };
  const st = { state: 'on', attributes: { color_mode: 'color_temp', color_temp_kelvin: kReal } };
  run(self, { querySelectorAll: () => els }, st, st.attributes);
  return { on: els.filter((e) => e.on).map((e) => e.k), hold: self._kHold };
};

test('yakın tonlarda yalnız en yakın düğme seçili', () => {
  assert.deepEqual(sel([2700, 2750, 2800, 6500], 2750).on, [2750]);
  assert.deepEqual(sel([2700, 2750, 2800, 6500], 2710).on, [2700]);
  assert.deepEqual(sel([2700, 2800], 2780).on, [2800]);
  assert.deepEqual(sel([2700, 2800], 3000).on, []);
});
test('varsayılan tonlarda eskisi gibi (120 K içinde)', () => {
  const D = [2200, 2700, 3200, 3500, 4000, 6500];
  assert.deepEqual(sel(D, 6535).on, [6500]);
  assert.deepEqual(sel(D, 3350).on, []);
  assert.deepEqual(sel(D, 0).on, []);
});
test('dokunulan ton, ışık onu bildirene kadar seçili kalır; komşu değer bildirilince bırakılmaz', () => {
  const r = sel([2700, 2800], 2700, { k: 2800, until: Date.now() + 3000 });
  assert.deepEqual(r.on, [2800]); assert.ok(r.hold);
  const r2 = sel([2700, 2800], 2795, { k: 2800, until: Date.now() + 3000 });
  assert.deepEqual(r2.on, [2800]); assert.equal(r2.hold, null);
  const r3 = sel([2700, 2800], 2700, { k: 2800, until: Date.now() - 1 });
  assert.deepEqual(r3.on, [2700]);
});
