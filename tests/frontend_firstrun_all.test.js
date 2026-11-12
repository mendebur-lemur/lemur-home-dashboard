// İlk kurulum (src/defaults.js): evin kullanılabilir hiçbir ışığı/sahnesi/perdesi/iklim cihazı/medyası/süpürgesi kaybolmaz,
// her biri en az bir sekmede. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['i18n.js', 'defaults.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/', f), 'utf8')).join('\n') + '\nthis.B = buildDefaultTabs;', ctx);

// dev/synth.js'deki sentetik evin aynısı (dev/ depoda yok): i%10 < 7 ışık, 7 iklim, 8 sahne, 9 medya; oda başına 8 cihaz, en çok 12 oda
function synth(n, v) {
  const S = {}, E = {}, A = {};
  const add = (id, st, at, area) => { S[id] = { entity_id: id, state: st, attributes: at }; E[id] = { entity_id: id, area_id: area || null, platform: 'demo' }; };
  const nr = v === 'one' ? 1 : Math.max(1, Math.min(12, Math.ceil(n / 8)));
  for (let r = 0; r < nr; r++) A['r' + r] = { area_id: 'r' + r, name: 'Oda ' + r, icon: null, floor_id: null };
  for (let i = 0; i < n; i++) {
    const ar = v === 'noarea' ? null : 'r' + (i % nr), k = i % 10;
    if (k < 7) add('light.x' + i, i % 3 ? 'off' : 'on', { friendly_name: 'Lamba ' + i, brightness: 200 }, ar);
    else if (k === 7) add('climate.x' + i, 'heat', { friendly_name: 'Termostat ' + i, hvac_modes: ['heat', 'off'] }, ar);
    else if (k === 8) add('scene.x' + i, 'unknown', { friendly_name: 'Senaryo ' + i }, ar);
    else add('media_player.x' + i, 'playing', { friendly_name: 'Hoparlör ' + i }, ar);
  }
  if (v === 'big80') {
    A.big = { area_id: 'big', name: 'Büyük Salon', icon: null, floor_id: null };
    for (let j = 0; j < 80; j++) add('light.big' + j, j % 2 ? 'on' : 'off', { friendly_name: 'Salon ışık ' + (j + 1) }, 'big');
  }
  return { states: S, entities: E, areas: A, devices: {}, floors: {} };
}
// panoya girmesi gereken her şey (kullanılabilir ışık/sahne/perde/iklim/medya/süpürge)
const want = (H) => Object.keys(H.states).filter((id) => /^(light|scene|cover|climate|media_player|vacuum)\./.test(id) && ['unavailable', 'unknown'].indexOf(H.states[id].state) < 0 || /^scene\./.test(id));
const placed = (tabs) => {
  const o = {};
  tabs.forEach((T) => T.sections.forEach((s) => s.entities.forEach((e) => { const x = typeof e === 'string' ? e : (e.entity || (e.action && e.action.target)); if (x) o[x] = (o[x] || []).concat(T.id); })));
  return o;
};
const check = (H, lang) => {
  const tabs = ctx.B(H, lang || 'tr'), P = placed(tabs);
  const miss = want(H).filter((id) => !P[id]);
  assert.deepStrictEqual(miss, [], 'eksik: ' + miss.join(', '));
  assert.ok(tabs.length <= 8, 'sekme sayısı ' + tabs.length);
  return tabs;
};

test('home without areas: every device appears (Home shows the whole house)', () => {
  const tabs = check(synth(60, 'noarea'));
  assert.strictEqual(tabs.map((T) => T.id).join(), 'home');
});
test('one room with 80 lights: all 80 on its room tab', () => {
  const tabs = check(synth(10, 'big80'));
  const big = tabs.filter((T) => T.area === 'big')[0];
  assert.strictEqual(big.sections[0].entities.filter((x) => /^light\.big/.test(x)).length, 80);
  assert.strictEqual(tabs[0].sections[0].entities.length, 20);   // Ev özet olarak kalır
});
test('150-device home (12 rooms, 6 room tabs): rest of the rooms and their scenes in "Other"', () => {
  const tabs = check(synth(150));
  assert.ok(tabs.some((T) => T.id === 'other'));
  check(synth(150), 'en');
});
test('one-room home: every device appears', () => { check(synth(20, 'one')); check(synth(8, 'one')); });
test('one-room home: no room tab that duplicates Home; a second room or a device outside the room keeps the room tab', () => {
  assert.strictEqual(check(synth(20, 'one')).map((T) => T.id).join(), 'home');
  assert.strictEqual(check(synth(40, 'one')).map((T) => T.id).join(), 'home');   // 28 ışık: Ev hepsini gösterir (özet sınırı yok)
  assert.strictEqual(check(synth(40, 'one'))[0].sections[0].entities.length, 28);
  const H = synth(20, 'one');
  H.states['light.disari'] = { entity_id: 'light.disari', state: 'off', attributes: { friendly_name: 'Dış' } }; H.entities['light.disari'] = { entity_id: 'light.disari', area_id: null };
  assert.strictEqual(check(H).map((T) => T.id).join(), 'home,r0,other');
  assert.strictEqual(check(synth(20, 'one'))[0].area, null);
  // Otomatik kur'da elle seçilen tek alan sekme olur
  assert.strictEqual(ctx.B(synth(20, 'one'), 'tr', { areas: ['r0'] }).map((T) => T.id).join(), 'home,r0');
});
test('covers, vacuums, many global scenes and more climates than the summary are all placed', () => {
  const H = synth(16);
  const add = (id, st, area) => { H.states[id] = { entity_id: id, state: st, attributes: { friendly_name: id } }; H.entities[id] = { entity_id: id, area_id: area }; };
  for (let i = 0; i < 9; i++) add('scene.g' + i, 'unknown', null);              // 9 genel sahne (Ev 6 gösterir)
  for (let i = 0; i < 8; i++) add('cover.c' + i, 'closed', i % 2 ? 'r0' : null); // perdeler: odada ve alansız
  for (let i = 0; i < 5; i++) add('vacuum.v' + i, 'docked', 'r1');              // 5 süpürge (Ev 3 gösterir)
  for (let i = 0; i < 6; i++) add('media_player.m' + i, 'idle', 'r0');           // 6 medya bir odada
  for (let i = 0; i < 7; i++) add('climate.k' + i, 'off', 'r1');                 // 7 iklim bir odada
  check(H);
  // alanı olmayan evde de
  Object.keys(H.entities).forEach((id) => { H.entities[id].area_id = null; });
  check(H);
});
test('no Home tab and no areas picked (Auto setup): everything lands in "Other"', () => {
  const H = synth(60, 'noarea');
  const tabs = ctx.B(H, 'tr', { home: false, areas: [] }), P = placed(tabs);
  assert.deepStrictEqual(want(H).filter((id) => !P[id]), []);
  assert.strictEqual(tabs.map((T) => T.id).join(), 'other');
});
