// Enerji cihazı kaydı (_enRec) form denetimi (_enBadNum) ve Python şemasıyla aynı sınırları kullanır: geçen sayı kırpılmadan kaydedilir.
// Çalıştır: node --test tests/frontend_enlimits.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../' + f), 'utf8');
const adm = rd('src/admin.js');
const method = (name) => { const a = adm.indexOf('  ' + name + '('), b = adm.indexOf('\n  }\n', a); assert.ok(a > 0 && b > a, name); return 'function ' + adm.slice(a + 2, b + 4); };
const ctx = {}; vm.createContext(ctx);
vm.runInContext('const lpEnNumOf = (v) => { const x = parseFloat(v); return x > 0 && isFinite(x) ? x : 0; };\nthis.rec = ' + method('_enRec') + ';\nthis.bad = ' + method('_enBadNum') + ';', ctx);
const host = { _t: (k, v) => k + (v ? ':' + v.n : ''), _enNum: (n) => String(n), _enStripK: () => null, _enEsts: () => ({}) };
const py = rd('custom_components/lemur_home_dashboard/estimates.py');
const pyMax = (k) => +new RegExp('"' + k + '"\\): vol\\.All\\(vol\\.Coerce\\(float\\), vol\\.Range\\(min=0, max=(\\d+)\\)').exec(py)[1];

test('yıllık kWh: denetimden geçen değer kırpılmadan kaydedilir, sınır Python şemasıyla aynı', () => {
  assert.strictEqual(pyMax('year'), 100000);
  const f = (v) => ({ kind: 'year', name: 'Buzdolabı', year: v });
  assert.strictEqual(ctx.bad.call(host, f('60000')), '');
  assert.strictEqual(ctx.rec.call(host, f('60000')).year, 60000, 'eskiden 50000 oluyordu');
  assert.strictEqual(ctx.rec.call(host, f('100000')).year, 100000);
  assert.strictEqual(ctx.bad.call(host, f('100001')), 'enEBig:100000', 'sınırın üstü hata mesajı verir');
});

test('çevrim (k100, week): denetimden geçen her değer kayıtta aynı kalır', () => {
  ['k100', 'week'].forEach((k) => {
    const mx = pyMax(k), f = { kind: 'cycle', name: 'X', k100: '1', week: '1' }; f[k] = String(mx);
    assert.strictEqual(ctx.bad.call(host, f), '');
    assert.strictEqual(ctx.rec.call(host, f)[k], mx);
  });
});
