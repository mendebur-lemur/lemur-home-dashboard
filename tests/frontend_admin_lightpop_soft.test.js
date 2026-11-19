'use strict';
// dbg9 (yönetim paneli): varsayılanı açık "Telefonda" anahtarı kapanabilmeli; Işık penceresi yazı alanları soft kaydedilmeli
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const admin = fs.readFileSync(require('node:path').join(__dirname, '../src/admin.js'), 'utf8');
const line = (start) => { const a = admin.indexOf(start), b = admin.indexOf('\n', a); assert.ok(a >= 0, start); return admin.slice(a, b); };
const method = (name) => { const a = admin.indexOf('  ' + name + '('), b = admin.indexOf('\n  }\n', a); assert.ok(a >= 0 && b > a, name); return 'function ' + admin.slice(a + 2, b + 4); };

test('Saatte parlaklık > Telefonda: açıkken basınca false saklanır, kapalıyken basınca silinir', () => {
  const src = line("if (path === 'lec_nav'").replace(/\/\/.*$/, '');
  const run = new Function('path', 'cur', 'const self = { _setting: (p, v) => [p, v] }; return (function () { ' + src.replace('this.', 'self.') + ' return self._setting(path, cur ? null : true); })();');
  assert.deepEqual(run('bright.phone', true), ['bright.phone', false]);
  assert.deepEqual(run('bright.phone', false), ['bright.phone', null]);
  assert.deepEqual(run('header.clock', true), ['header.clock', false]);
  assert.deepEqual(run('bright.icon', false), ['bright.icon', true]);   // varsayılanı kapalı olanlar değişmedi
});

test('Işık penceresi: Kelvin ve renk kodu alanı soft kaydedilir (tıklama yutulmaz, odak kalır)', () => {
  const calls = [];
  const LP_POP_KELVIN = [[2200], [2700]], LP_POP_SWATCH = ['#ff0000'];
  const save = new Function('LP_POP_KELVIN', 'LP_POP_SWATCH', 'return ' + method('_lpSave'))(LP_POP_KELVIN, LP_POP_SWATCH);
  const self = { _setting: (p, v, s) => calls.push(['set', p, v, !!s]), _lpOwnPaint: () => calls.push(['paint']) };
  save.call(self, 'kelvin', [2300, 2700], true);
  save.call(self, 'kelvin', [2200, 2700]);
  assert.deepEqual(calls, [['set', 'lightpop.kelvin', [2300, 2700], true], ['paint'], ['set', 'lightpop.kelvin', null, false]]);
  assert.ok(/return this\._lpSave\('kelvin', K, true\)/.test(admin), 'Kelvin alanı soft');
  assert.ok(/return this\._lpSave\('colors', C, true\)/.test(admin), 'renk kodu alanı soft');
});
