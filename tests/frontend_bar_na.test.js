'use strict';
// Kaydırmalı çubuk: ulaşılamayan cihazın çubuğu kaydırılınca komut gitmez (dokunuş ve ışık penceresi gibi).
// Çalıştır: node --test tests/frontend_bar_na.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const fn = (head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
const canLine = () => { const m = /\n\s*can: (\(\) => [^\n]*?),(\s*\/\/[^\n]*)?\n/.exec(src); assert.ok(m, 'can:'); return m[1]; };

function can(st) {
  const ctx = { self: { _hass: { states: { 'light.x': st } } }, id: 'light.x' };
  vm.createContext(ctx);
  vm.runInContext(fn('function lpBarCan(') + '\nthis.f = (function () { return ' + canLine() + '; }).call(self);', ctx);
  return ctx.f();
}
const L = (state, extra) => Object.assign({ entity_id: 'light.x', state: state, attributes: { supported_color_modes: ['brightness'] } }, extra || {});

test('ulaşılamayan ışığın çubuğu kaydırılamaz', () => { assert.equal(can(L('unavailable')), false); });
test('açık ve kapalı kısılabilir ışık kaydırılır (değişmedi)', () => { assert.equal(can(L('on')), true); assert.equal(can(L('off')), true); });
test('aç/kapa ışık ve olmayan varlık kaydırılamaz (değişmedi)', () => {
  assert.equal(can({ entity_id: 'light.x', state: 'on', attributes: { supported_color_modes: ['onoff'] } }), false);
  assert.equal(can(undefined), false);
});
