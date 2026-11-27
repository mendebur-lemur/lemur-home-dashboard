// PR #35 gerileme denetimi: profil kullanmayan mevcut kurulumlarda yönetim panelinin üst şeridi 0.36.0'daki gibi kalır.
// 1280 genişlikte (otomatik düzen rozetiyle) profil seçici Basit / Gelişmiş'i alt alta düşürüp Ayarlar'ı taşırıyordu.
// Profil yokken seçici çizilmez; ilk profil ⋯ menüsündeki "Yeni profil…" ile oluşturulur.
// Çalıştır: node --test tests/frontend_profiles_regress.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const adm = rd('admin.js'), store = rd('store.js'), safe = rd('safe.js');
const method = (name) => {
  const head = new RegExp('^  (async )?' + name + '\\(', 'm').exec(adm);
  assert.ok(head, name);
  const start = head.index + head[0].length - 1;
  const end = adm.indexOf('\n  }\n', start);
  return (head[1] || '') + 'function ' + adm.slice(start, end + 4);
};

function host(data, prof) {
  const c = vm.createContext({ STORE: { data: data }, window: { innerWidth: 1280, innerHeight: 800 }, console, esc: (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;') });
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' + store.slice(store.indexOf('const LP_OVR ='), store.indexOf('// Telefona özel görünüm')) + '\n' +
    adm.slice(adm.indexOf('const LHD_REPO_URL'), adm.indexOf('const lhdMove')), c);
  const h = { _prof: prof || null, _menu: null, _t: (k) => k };
  c.h = h;
  ['_profPicker', '_menuHtml'].forEach((m) => vm.runInContext('h.' + m + ' = ' + method(m), c));
  return h;
}

test('profil yokken (0.36.0 verisi profiles: {}) üst şeritte profil seçici yok', () => {
  for (const profiles of [{}, undefined, { tablet_salon: { tab: 'ev', note: 'eski anahtar' } }]) {
    const h = host({ tabs: [], settings: {}, profiles: profiles });
    assert.equal(h._profPicker(), '', JSON.stringify(profiles));
  }
});

test('profil varken seçici çizilir; seçili profil silinmiş olsa da ana pano seçeneği kalır', () => {
  const h = host({ tabs: [], settings: {}, profiles: { masaustu: { name: 'Masaüstü' } } });
  const html = h._profPicker();
  assert.match(html, /data-prof/);
  assert.match(html, /Masaüstü/);
  assert.match(html, /value="\+"/);
});

test('ilk profil ⋯ menüsünden oluşturulabilir (seçici yokken giriş noktası kaybolmaz)', () => {
  const h = host({ tabs: [], settings: {}, profiles: {} });
  h._menu = { kind: 'more' };
  assert.match(h._menuHtml(), /data-a="profNew"/);
  // profil varken menüde ayrıca yer almaz (seçicide "Yeni profil…" var)
  const h2 = host({ tabs: [], settings: {}, profiles: { masaustu: { name: 'Masaüstü' } } });
  h2._menu = { kind: 'more' };
  assert.doesNotMatch(h2._menuHtml(), /data-a="profNew"/);
});

test('⋯ menüsündeki Yeni profil… profil oluşturma penceresini açar', () => {
  assert.match(adm, /if \(act === 'profNew'\) \{ this\._menu = null; this\._modal = 'profNew'; return this\._render\(\); \}/);
});
