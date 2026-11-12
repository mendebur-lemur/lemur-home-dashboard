// Öğe penceresi aç → Kaydet: dokunulmayan anahtar asıl hâliyle kalır (lhdImKeep, src/admin.js). Tarayıcıda bütün öğeler: ux/dbg3/leftover/opensave.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const s = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const a = s.indexOf('function lhdImKeep('), b = s.indexOf('\n}\n', a);
const ctx = {}; vm.createContext(ctx);
vm.runInContext("const lhdIsObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);\n" + s.slice(a, b + 2) + '\nthis.K = lhdImKeep;', ctx);
const J = JSON.stringify;
const raw = { entity: 'sensor.x', look: 'halo', height: 2, tap: { action: 'perform-action', perform_action: 'timer.start', target: { entity_id: 'timer.t' } }, state_colors: { entity: 'sensor.y', map: { on: 'green' } }, name: 'A' };
const it0 = { entity: 'sensor.x', look: 'halo', height: '2', tap: { service: 'timer.start', target: 'timer.t' }, state_colors: { map: { on: 'green' }, entity: 'sensor.y' }, name: 'A' };

test('untouched dialog: the stored item comes back byte for byte', () => {
  assert.strictEqual(J(ctx.K(raw, it0, JSON.parse(J(it0)))), J(raw));
});
test('one field changed: only that key changes, the rest keeps type, form and order', () => {
  const it = Object.assign(JSON.parse(J(it0)), { name: 'B' });
  assert.strictEqual(J(ctx.K(raw, it0, it)), J(Object.assign({}, raw, { name: 'B' })));
  const it2 = JSON.parse(J(it0)); it2.height = '3'; delete it2.name; it2.icon = 'mdi:fish';
  const o = ctx.K(raw, it0, it2);
  assert.deepStrictEqual(Object.keys(o), ['entity', 'look', 'height', 'tap', 'state_colors', 'icon']);
  assert.strictEqual(o.height, '3'); assert.strictEqual(J(o.tap), J(raw.tap));
});
