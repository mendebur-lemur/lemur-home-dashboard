// Geri al / ileri al (_histApply): seçili sekmenin kimliği değişse de (yeni sekme adlandırılınca) aynı sekmede kalınır.
// Çalıştır: node --test tests/frontend_hist.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const adm = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const a = adm.indexOf('  _histApply(u) {'), b = adm.indexOf('\n  }\n', a);
const ctx = { STORE: { data: {} } }; vm.createContext(ctx);
vm.runInContext('this.f = function ' + adm.slice(a + 2, b + 4).replace(/^_histApply/, '') + ';', ctx);

function host(tabs, cur) {
  ctx.STORE.data = { tabs: tabs, settings: {} };
  return { _tab: cur, _settings: () => ctx.STORE.data.settings, _commit: (k, v) => { ctx.STORE.data = Object.assign({}, ctx.STORE.data, { [k]: v }); }, _render: () => {} };
}
const T = (ids) => ids.map((id) => ({ id: id, sections: [] }));

test('yeniden adlandırılan sekme: geri alınca eski kimliğiyle, ileri alınca yenisiyle seçili kalır', () => {
  const h = host(T(['home', 'salon', 'calisma-alani']), 'calisma-alani');
  ctx.f.call(h, { tabs: T(['home', 'salon', 'sekme']), settings: {} });
  assert.strictEqual(h._tab, 'sekme');
  ctx.f.call(h, { tabs: T(['home', 'salon', 'calisma-alani']), settings: {} });
  assert.strictEqual(h._tab, 'calisma-alani');
});

test('seçili sekme hâlâ varsa ya da sekme sayısı değiştiyse seçim elle değiştirilmez', () => {
  const h = host(T(['home', 'salon']), 'salon');
  ctx.f.call(h, { tabs: T(['salon', 'home']), settings: {} });
  assert.strictEqual(h._tab, 'salon');
  const g = host(T(['home', 'salon', 'yeni']), 'yeni');
  ctx.f.call(g, { tabs: T(['home', 'salon']), settings: {} });
  assert.strictEqual(g._tab, 'yeni', '_curTab ilk sekmeye düşer (sekme silindi), burada değişmez');
});
