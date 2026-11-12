// İlk kurulum (src/defaults.js): numaralı adlar sayı sırasıyla. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['i18n.js', 'defaults.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/', f), 'utf8')).join('\n') + '\nthis.B = buildDefaultTabs;', ctx);
test('room lights with numbers sort 1, 2, ..., 10, 11', () => {
  const S = {}, E = {};
  for (let i = 1; i <= 12; i++) { const id = 'light.l' + i; S[id] = { entity_id: id, state: 'off', attributes: { friendly_name: 'Lamba ' + i } }; E[id] = { entity_id: id, area_id: 'r' }; }
  const tabs = ctx.B({ states: S, entities: E, areas: { r: { area_id: 'r', name: 'Oda' } }, floors: {}, devices: {} }, 'tr');
  const room = tabs.filter((T) => T.area === 'r')[0];
  assert.deepStrictEqual(room.sections[0].entities.map((x) => S[x].attributes.friendly_name.split(' ')[1]).join(','), '1,2,3,4,5,6,7,8,9,10,11,12');
});
