// Saatte parlaklık (GitHub #22): bütün ışıklar kapalıyken kaydırma da bir hedef bulur.
// Çalıştır: node --test tests/frontend_bright_off.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const fn = (head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
const method = (name) => { const a = src.indexOf('\n  ' + name + '('); assert.ok(a >= 0, name); const eol = src.indexOf('\n', a + 1), one = /\}\s*$/.test(src.slice(a + 1, eol));   // tek satırlık yöntem
  return 'function ' + src.slice(a + 3 + name.length, one ? eol : src.indexOf('\n  }\n', a) + 4); };

function card(states, tiles, area, opt) {
  opt = opt || {};
  const store = {};
  const ctx = { localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } }, lpBrightCfg: () => ({ allOff: opt.allOff === true }) };
  vm.createContext(ctx);
  const M = ['_bbIds', '_bbKey', '_bbMemGet', '_bbMemSet', '_bbTargets'];
  vm.runInContext(fn('function lpBarCan(') + M.map((m) => 'this.' + m + ' = ' + method(m) + ';').join('\n'), ctx);
  const S = {}; Object.keys(states).forEach((id) => { S[id] = { entity_id: id, state: states[id][0], attributes: { supported_color_modes: states[id][1] } }; });
  const ents = {}; Object.keys(states).forEach((id) => { ents[id] = { area_id: states[id][2] || null }; });
  const c = { _hass: { states: S, entities: ents, devices: {} }, _bbTab: { id: 'salon', area: area || null }, _tiles: tiles.map((id) => ({ getAttribute: () => id })), _store: store };
  M.forEach((m) => { c[m] = ctx[m]; });
  return c;
}
const arr = (x) => Array.from(x);
const ALL_OFF = { 'light.a': ['off', ['brightness']], 'light.b': ['off', ['onoff']], 'light.c': ['unavailable', ['brightness']], 'light.d': ['off', ['color_temp']], 'light.gizli': ['off', ['brightness'], 'salon'] };

test('hepsi kapalı, en son açık olanlar bilinmiyor: varsayılan ayarda hiçbir şey hedef olmaz (kaydırma bütün evi yakmaz)', () => {
  const c = card(ALL_OFF, ['light.a', 'light.b', 'light.c', 'light.d'], 'salon');
  assert.deepStrictEqual(arr(c._bbTargets()), []);
});

test('ayar açıksa (bright.all_off) o durumda sekmedeki kısılabilir ışık karoları; aç/kapa ışık, ulaşılamayan ve alanın görünmeyen ışığı olmaz', () => {
  const c = card(ALL_OFF, ['light.a', 'light.b', 'light.c', 'light.d'], 'salon', { allOff: true });
  assert.deepStrictEqual(arr(c._bbTargets()), ['light.a', 'light.d']);
});

test('açık ışık varsa yalnız açık olanlar (alanın görünmeyen açık ışığı dahil, eskisi gibi); ayar bunu değiştirmez', () => {
  const st = { 'light.a': ['on', ['brightness']], 'light.d': ['off', ['brightness']], 'light.gizli': ['on', ['brightness'], 'salon'] };
  assert.deepStrictEqual(arr(card(st, ['light.a', 'light.d'], 'salon')._bbTargets()), ['light.a', 'light.gizli']);
  assert.deepStrictEqual(arr(card(st, ['light.a', 'light.d'], 'salon', { allOff: true })._bbTargets()), ['light.a', 'light.gizli']);
});

test('hepsi kapanınca en son açık olanlar hedef olur (karodan kapatılmış olsa da); ulaşılamayan çıkarılır; başka sekmenin belleği kullanılmaz', () => {
  const c = card({ 'light.a': ['off', ['brightness']], 'light.d': ['off', ['brightness']], 'light.e': ['unavailable', ['brightness']] }, ['light.a', 'light.d', 'light.e']);
  c._bbMemSet(['light.d', 'light.e']);
  assert.deepStrictEqual(arr(c._bbTargets()), ['light.d']);
  c._bbTab = { id: 'mutfak' };
  assert.deepStrictEqual(arr(c._bbTargets()), []);
});

test('bellek tarayıcıda saklanır: yeni açılan sayfa (yeni kart) aynı ışıkları bulur; bozuk kayıt hata vermez', () => {
  const c = card({ 'light.a': ['off', ['brightness']], 'light.d': ['off', ['brightness']] }, ['light.a', 'light.d']);
  c._bbMemSet(['light.a']);
  assert.deepStrictEqual(JSON.parse(c._store['lhd-bb-mem']), { salon: ['light.a'] });
  c._bbMem = null;   // sayfa yenilendi
  assert.deepStrictEqual(arr(c._bbTargets()), ['light.a']);
  c._bbMem = null; c._store['lhd-bb-mem'] = '{"salon":"bozuk"}';
  assert.deepStrictEqual(arr(c._bbTargets()), []);
  c._bbMem = null; c._store['lhd-bb-mem'] = 'not json';
  assert.deepStrictEqual(arr(c._bbTargets()), []);
});

test('bellek _bbPaint içinde tutulur (önizlemede değil), _bbLast kalmadı, ayar yönetim panelinde', () => {
  assert.ok(/if \(L\.length && !\(this\._config && \(this\._config\.demo \|\| this\._config\.edit\)\)\) this\._bbMemSet\(L\);/.test(src));
  assert.ok(src.indexOf('_bbLast') < 0);
  assert.ok(/allOff: b\.all_off === true/.test(src));
  const adm = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
  assert.ok(adm.indexOf("tg('bright.all_off', b.all_off === true)") > 0 && /bbAll: '/.test(adm));
});
