// PR #35 tarayıcı turu: "Ana düzeni kopyala" ile oluşturulan profil, ana panoda telefon ayarı yokken oluşturulursa, anada
// SONRADAN yapılan telefon düzeni değişikliğini (telefondaki sekme adı, gizlenen bölüm, sıra) alıyordu; tablet düzeni ise
// bağımsızdı. Anada telefon ayarı varken oluşturulan kopya ise kendi telefon düzenini saklıyordu (tutarsız).
// Yeniden üretim: ux/dbg35/tarayici/repro/r02_kopya_telefon_sizinti.js. Çalıştır: node --test tests/frontend_proftel037.test.js
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
  return (head[1] || '') + 'function ' + adm.slice(start, adm.indexOf('\n  }\n', start) + 4);
};
const mainTabs = [{ id: 'home', sections: [{ id: 'home-s' }] }];

function host(settings) {
  const S = { data: clone({ tabs: mainTabs, settings: settings, profiles: {} }), subs: [], writes: [] };
  S.set = (key, value) => { S.writes.push([key, clone(value)]); return Promise.resolve(S.data); };
  const h = { _prof: null, _undo: [], _render() {}, _toast() {}, _t: (k) => k, _snap() {}, _undoBtn() {} };
  const c = vm.createContext({ STORE: S, h, lhdClone: clone, console, localStorage: { setItem() {}, removeItem() {} } });
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' + store.slice(store.indexOf('const LP_OVR ='), store.indexOf('// Telefona özel görünüm')) + '\n' +
    adm.slice(adm.indexOf('const lhdSlug = '), adm.indexOf('const lhdMove')), c);
  ['_commit', '_commitBase', '_profNew', '_profSet', '_phEdit'].forEach((m) => vm.runInContext('h.' + m + ' = ' + method(m), c));
  h._profOwn = vm.runInContext('(function ' + adm.match(/^  (_profOwn\(.*)$/m)[1] + ')', c);
  h._settings = vm.runInContext('(function ' + adm.match(/^  (_settings\(.*)$/m)[1] + ')', c);
  h._work = () => clone(mainTabs);
  h._phOv = () => { const p = h._settings().phone; return clone(p && typeof p === 'object' ? p : {}); };
  return { h, S, c };
}

test('anada telefon ayarı yokken kopya profil boş telefon ayarıyla oluşur (ana telefon düzeni sonradan geçmez)', () => {
  const { h, S, c } = host({ canvas: { width: 1280 } });
  const id = h._profNew('Duvar', 'copy');
  assert.deepEqual(clone(S.data.profiles[id]), { name: 'Duvar', tabs: mainTabs, settings: { phone: {} } });
  // ana panoda telefon düzeni sonradan değişir
  S.data = Object.assign({}, S.data, { settings: { canvas: { width: 1280 }, phone: { tabs: { names: { home: 'AnaTel' } }, secs: { 'home-s': { hide: true } } } } });
  assert.deepEqual(clone(c.lpProfSettings(S.data, id).phone), {});
});

test('anada telefon ayarı varken kopya profil onu kopyalar (değişmeyen davranış)', () => {
  const phone = { nav: 'rooms', secs: { 'home-s': { hide: true } } };
  const { h, S } = host({ phone: phone });
  const id = h._profNew('Duvar', 'copy');
  assert.deepEqual(clone(S.data.profiles[id].settings), { phone: phone });
});

test('bağlı profil telefon ayarı saklamaz', () => {
  const { h, S } = host({});
  const id = h._profNew('Bağlı', 'link');
  assert.deepEqual(clone(S.data.profiles[id]), { name: 'Bağlı' });
});

test('kopya profilde telefon düzeni boşaltılınca da boş ayar kalır (silinmez)', () => {
  const { h, S } = host({});
  const id = h._profNew('Duvar', 'copy');
  h._profSet(id);
  h._phEdit((p) => { p.tabs.names.home = 'X'; });
  assert.deepEqual(clone(S.data.profiles[id].settings.phone), { tabs: { names: { home: 'X' } } });
  h._phEdit((p) => { delete p.tabs.names.home; });
  assert.ok(S.data.profiles[id].settings && Object.prototype.hasOwnProperty.call(S.data.profiles[id].settings, 'phone'), JSON.stringify(S.data.profiles[id]));
  assert.deepEqual(clone(S.data.profiles[id].settings.phone), {});
});
