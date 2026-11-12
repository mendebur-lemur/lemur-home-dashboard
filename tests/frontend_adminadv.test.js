// Yönetim paneli (gelişmiş): telefon ayarlarındaki öğe anahtarlarının yenilenmesi (_phRekey) ve "Orta" hizalamanın taşmada kayması.
// Çalıştır: node --test tests/frontend_adminadv.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

function rekeyFn() {
  const src = rd('admin.js'), a = src.indexOf('  _phRekey(sid, a, b) {'), b = src.indexOf('\n  }\n', a);
  assert.ok(a > 0 && b > a, '_phRekey bulunamadı');
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(rd('safe.js') + '\nconst lhdClone = (x) => JSON.parse(JSON.stringify(x));\nthis.f = function ' + src.slice(a + 2, b + 4).replace(/^_phRekey/, '') + ';\nthis.isObj = lhdIsObj;', ctx);
  return ctx;
}
function host(ctx, settings) {
  const h = { s: settings, commits: [] };
  h._settings = () => h.s;
  h._phSec = (id) => { const S = (h.s.phone || {}).secs; return ctx.isObj(S) && ctx.isObj(S[id]) ? S[id] : {}; };
  h._commit = (k, v) => { h.commits.push(k); h.s = v; };
  return h;
}

test('_phRekey: gizli öğe, sıra ve katlanır grup yeni anahtara geçer', () => {
  const ctx = rekeyFn();
  const h = host(ctx, { phone: { secs: { s1: { hide_items: ['n:Sinema|mdi:movie', 'light.a'], item_order: ['light.a', 'n:Sinema|mdi:movie'], folds: [{ name: 'G', items: ['n:Sinema|mdi:movie'] }] }, s2: { hide_items: ['n:Sinema|mdi:movie'] } } } });
  ctx.f.call(h, 's1', 'n:Sinema|mdi:movie', 'n:Film|mdi:movie');
  const q = JSON.parse(JSON.stringify(h.s.phone.secs));   // vm bağlamındaki diziler
  assert.deepStrictEqual(q.s1.hide_items, ['n:Film|mdi:movie', 'light.a']);
  assert.deepStrictEqual(q.s1.item_order, ['light.a', 'n:Film|mdi:movie']);
  assert.deepStrictEqual(q.s1.folds[0].items, ['n:Film|mdi:movie']);
  assert.deepStrictEqual(q.s2.hide_items, ['n:Sinema|mdi:movie'], 'başka bölüm değişmez');
  assert.deepStrictEqual(h.commits, ['settings']);
});

test('_phRekey: anahtar aynıysa ya da telefonda o öğe yoksa kayıt yapılmaz', () => {
  const ctx = rekeyFn();
  const h = host(ctx, { phone: { secs: { s1: { hide_items: ['light.a'] } } } });
  ctx.f.call(h, 's1', 'light.a', 'light.a');
  ctx.f.call(h, 's1', 'n:x|', 'n:y|');
  ctx.f.call(h, 's9', 'light.a', 'light.b');
  assert.deepStrictEqual(h.commits, []);
});

test('Orta hizalama justify-content:center kullanmaz (taşan içerik yukarıda kalıp kaydırılamıyordu)', () => {
  const css = rd('base.css');
  assert.ok(!/\.box\.al-center\s*\{[^}]*justify-content:\s*center/.test(css));
  assert.ok(/\.box\.al-center > :last-child \{ margin-bottom: auto; \}/.test(css));
});
