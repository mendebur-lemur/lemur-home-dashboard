// Yönetim panelinde profil: olaylar seçili profilin ayarlarıyla çalışır, profil adı Enter ile kaydedilir,
// başka ekranda silinen profil sessizce ana panoya yazdırmaz, geri al değişikliğin yapıldığı profile geçer.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const adm = rd('admin.js'), store = rd('store.js'), safe = rd('safe.js');
const clone = (x) => JSON.parse(JSON.stringify(x));
const method = (name) => {
  const head = new RegExp('^  (async )?' + name + '\\(', 'm').exec(adm);
  assert.ok(head, name);
  const start = head.index + head[0].length - 1;
  const end = adm.indexOf('\n  }\n', start);
  return (head[1] || '') + 'function ' + adm.slice(start, end + 4);
};

// _bind sahte bir gölge kökle çalıştırılır; uygulamaya eklenen dinleyiciler toplanır
function bound(prof) {
  const listeners = {};
  const app = { addEventListener: (t, f) => { (listeners[t] = listeners[t] || []).push(f); } };
  const R = { querySelector: (s) => (s === '.app' ? app : null), querySelectorAll: () => [] };
  const LP_PROF = { id: null }, seen = [];
  const h = { shadowRoot: R, _prof: prof, _modal: 'settings', _hass: { states: {} }, _render() {}, _t: (k) => k,
    _lpList: () => { seen.push(LP_PROF.id); return [2700, 3000, 4000]; }, _lpSave() {} };
  const c = vm.createContext({ h, LP_PROF, console });
  vm.runInContext('h._profContext = ' + method('_profContext') + '; h._bind = ' + method('_bind'), c);
  h._bind([], null, null);
  return { listeners, seen, LP_PROF };
}

test('ayarlar penceresindeki tıklama seçili profilin ayarlarını okur (ışık penceresi listesi)', () => {
  const { listeners, seen, LP_PROF } = bound('masa');
  const el = { hasAttribute: (n) => n === 'data-lpkdel', getAttribute: () => '0' };
  listeners.click[0]({ target: { closest: (sel) => (/data-lpkdel/.test(sel) ? el : null) } });
  // önceden ana panonun listesi (LP_PROF.id = null) okunup profile yazılıyordu: iki silmede aynı ton, eklemede 7 ton
  assert.ok(seen.length > 0);
  assert.ok(seen.every((id) => id === 'masa'), JSON.stringify(seen));
  assert.equal(LP_PROF.id, null);   // olaydan sonra açık panonun profili geri gelir
  for (const t of ['click', 'change', 'input']) assert.equal(listeners[t].length, 1, t);
});

test('profil adı alanında Enter formu gönderir; formsuz alanda alan bırakılır', () => {
  const { listeners } = bound(null);
  const key = listeners.keydown[0];
  let blurred = 0;
  const input = (form) => ({ tagName: 'INPUT', form, classList: { contains: (c) => c === 'inp' }, blur: () => { blurred++; } });
  key({ key: 'Enter', target: input({}) });
  assert.equal(blurred, 0);   // blur, formun Enter ile gönderilmesini engelliyordu
  key({ key: 'Enter', target: input(null) });
  assert.equal(blurred, 1);
});

function host(profile) {
  const S = { data: clone({ tabs: [{ id: 'home', sections: [] }], settings: { season: 'winter' }, profiles: { masa: { name: 'Masa', tabs: [{ id: 'office', sections: [] }] } } }), subs: [], writes: [] };
  S.set = (key, value) => { S.writes.push([key, clone(value)]); return Promise.resolve(S.data); };
  S.onChange = (f) => { S.subs.push(f); return () => {}; };
  const h = { _prof: profile, _tab: null, _undo: [], _modal: null, renders: 0, _render() { this.renders++; }, _toast() {}, _t: (k) => k };
  const c = vm.createContext({ STORE: S, h, lhdClone: clone, console });
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' + store.slice(store.indexOf('const LP_OVR ='), store.indexOf('// Telefona özel görünüm')), c);
  ['_commit', '_commitBase', '_snap', '_histCur', '_histApply', '_undoIt', '_redoIt', '_sub', '_profSet'].forEach((m) => vm.runInContext('h.' + m + ' = ' + method(m), c));
  h._profOwn = vm.runInContext('(function ' + adm.match(/^  (_profOwn\(.*)$/m)[1] + ')', c);
  h._settings = vm.runInContext('(function ' + adm.match(/^  (_settings\(.*)$/m)[1] + ')', c);
  return { h, S, c };
}
const ls = () => ({ setItem() {}, removeItem() {} });

test('başka ekranda silinen profile kayıt yapılmaz; panel yeniden çizilip ana panoya geçtiğini söyler', async () => {
  const { h, S, c } = host('masa');
  c.localStorage = ls();
  S.data = Object.assign({}, S.data, { profiles: {} });
  const r = await h._commit('settings', { canvas: { width: 2000 } });
  assert.equal(r, false);
  assert.deepEqual(S.writes, []);
  assert.ok(h.renders > 0);   // çizim seçimi ana panoya alır ve profGone bildirimini gösterir (önce sessizce false dönüyordu)
  const A = vm.runInContext(adm.slice(adm.indexOf('const ADM ='), adm.indexOf('\n};', adm.indexOf('const ADM =')) + 3) + '\nADM', vm.createContext({}));
  assert.ok(A.tr.profGone && A.en.profGone);
});

test('pencere açıkken seçili profil silinirse abonelik paneli yeniden çizer', () => {
  const { h, S } = host('masa');
  h._modal = 'settings';
  h._sub();
  const d = Object.assign({}, S.data, { profiles: {} });
  S.subs.forEach((f) => f(d));
  assert.equal(h.renders, 1);
  // profil yerindeyken pencere açık: eskisi gibi çizilmez
  const k = host('masa'); k.h._modal = 'settings'; k.h._sub();
  k.S.subs.forEach((f) => f(Object.assign({}, k.S.data, { settings: { season: 'summer' } })));
  assert.equal(k.h.renders, 0);
});

test('profil oluşturmayı geri alınca önceki seçim gelir; silmeyi geri alınca silinen profil seçilir', async () => {
  const { h, S, c } = host(null);
  c.localStorage = ls();
  h._snap();
  await h._commitBase('profiles', Object.assign({}, S.data.profiles, { yeni: { name: 'Yeni' } }));
  h._profSet('yeni');
  h._undoIt();
  assert.equal(Object.hasOwn(S.data.profiles, 'yeni'), false);
  assert.equal(h._prof, null);
  h._profSet('masa');
  h._snap();
  await h._commitBase('profiles', {});
  h._profSet(null);
  h._undoIt();
  assert.equal(h._prof, 'masa');
  assert.ok(S.data.profiles.masa);
});
