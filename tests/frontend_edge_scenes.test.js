// İlk kurulum (src/defaults.js): hiç çalıştırılmamış sahne ('unknown') otomatik panoya girer. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['i18n.js', 'defaults.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/', f), 'utf8')).join('\n') + '\nthis.B = buildDefaultTabs;', ctx);
const acts = (tabs) => { const o = []; tabs.forEach((T) => T.sections.forEach((s) => s.entities.forEach((e) => { if (e && e.action) o.push(e.action.target); }))); return o; };
test('never-activated scene (state unknown) is a scene button; unavailable ones and unknown lights are not', () => {
  const S = {}, E = {};
  const add = (id, st, area) => { S[id] = { entity_id: id, state: st, attributes: { friendly_name: id } }; E[id] = { entity_id: id, area_id: area || null }; };
  add('light.a', 'on', 'r'); add('light.b', 'off', 'r'); add('light.c', 'on', 'r'); add('light.u', 'unknown', 'r');
  add('scene.never', 'unknown'); add('scene.used', '2026-11-01T10:00:00+00:00'); add('scene.broken', 'unavailable');
  const tabs = ctx.B({ states: S, entities: E, areas: { r: { area_id: 'r', name: 'Oda' } }, floors: {}, devices: {} }, 'tr');
  const a = acts(tabs);
  assert.ok(a.indexOf('scene.never') >= 0, a.join());
  assert.ok(a.indexOf('scene.used') >= 0);
  assert.ok(a.indexOf('scene.broken') < 0);
  assert.ok(JSON.stringify(tabs).indexOf('light.u') < 0);
});
