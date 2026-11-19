'use strict';
// Işık penceresindeki hazır beyaz tonları ve hazır renkler yönetim panelinden özelleştirilir (ayar lightpop).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = (name) => fs.readFileSync(require('node:path').join(__dirname, '../src/', name), 'utf8');
const admin = read('admin.js'), card = read('panel-card.js'), pop = read('lightpop.js');
const method = (source, name) => {
  const a = source.indexOf('  ' + name + '('), b = source.indexOf('\n  }\n', a);
  assert.ok(a >= 0 && b > a, name);
  return 'function ' + source.slice(a + 2, b + 4);
};
const line = (source, start) => { const a = source.indexOf(start), b = source.indexOf('\n', a); assert.ok(a >= 0, start); return source.slice(a, b); };
const ctx = { window: {}, HTMLElement: class {}, SET: {} };
vm.createContext(ctx);
vm.runInContext(read('i18n.js') + '\n' + read('safe.js') + '\nfunction lpSettings() { return SET; }\n' + card + '\n' +
  line(pop, 'const LP_POP_KELVIN') + '\n' + line(pop, 'const LP_POP_SWATCH') + '\n' +
  'this.cfg = lpLightPopCfg; this.css = lpKelvinCss; this.KEL = LP_POP_KELVIN; this.SW = LP_POP_SWATCH;' +
  'this.colorHtml = ' + method(pop, '_colorHtml') + '; this.lpList = ' + method(admin, '_lpList') + '; this.lpSave = ' + method(admin, '_lpSave') + ';', ctx);
const html = () => ctx.colorHtml.call({ _caps: () => ({ ct: true, color: true }) }, 'light.x');
const count = (s, re) => (s.match(re) || []).length;

test('ayar yokken penceredeki varsayılanlar kullanılır', () => {
  ctx.SET = {};
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.cfg())), { kelvin: null, colors: null });
  const h = html();
  assert.equal(count(h, /data-k="/g), 6);
  assert.equal(count(h, /data-rgb="/g), 12);
  assert.ok(h.indexOf('grid-template-columns') < 0);
  assert.ok(h.indexOf('data-k="2200" style="background:#FF9227"') >= 0);
});

test('özel beyaz tonları ve renkler: geçersizler atılır, sayı sınırlanır', () => {
  ctx.SET = { lightpop: { kelvin: [2000, '2700', 99999, 'x', 3200, 4500], colors: ['#ff3b30', 'kirmizi', '#7FD1AE', '#12'] } };
  const c = JSON.parse(JSON.stringify(ctx.cfg()));
  assert.deepEqual(c.kelvin, [2000, 2700, 3200, 4500]);
  assert.deepEqual(c.colors, ['#ff3b30', '#7FD1AE']);
  const h = html();
  assert.equal(count(h, /data-k="/g), 4);
  assert.ok(h.indexOf('grid-template-columns:repeat(4,1fr)') >= 0);
  assert.ok(h.indexOf('data-k="2000"') >= 0 && h.indexOf('>4500K<') >= 0);
  assert.equal(count(h, /data-rgb="/g), 2);
  ctx.SET = { lightpop: { kelvin: [2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700], colors: new Array(20).fill('#112233') } };
  assert.equal(ctx.cfg().kelvin.length, 6);
  assert.equal(ctx.cfg().colors.length, 12);
  ctx.SET = { lightpop: { kelvin: [100], colors: 'x' } };   // hepsi geçersiz: varsayılana düşer
  assert.deepEqual(JSON.parse(JSON.stringify(ctx.cfg())), { kelvin: null, colors: null });
});

test('kelvin düğmesinin rengi: varsayılan değerlerde eski renklerle aynı, aralarda geçiş, uçlarda sabit', () => {
  const hex = (s) => '#' + s.slice(4, -1).split(',').map((n) => ('0' + (+n).toString(16)).slice(-2)).join('').toUpperCase();
  ctx.KEL.forEach((k) => assert.equal(hex(ctx.css(k[0])), k[1]));
  assert.equal(ctx.css(100), ctx.css(1500));
  assert.equal(ctx.css(20000), ctx.css(9000));
  assert.equal(ctx.css(2450), 'rgb(255,157,63)');
});

test('yönetim paneli: varsayılanla aynı liste ayar olarak saklanmaz', () => {
  const calls = [], self = { _setting: (p, v) => calls.push([p, v]) };
  ctx.SET = {};
  assert.deepEqual(Array.from(ctx.lpList.call(self, 'kelvin')), [2200, 2700, 3200, 3500, 4000, 6500]);
  assert.equal(ctx.lpList.call(self, 'colors').length, 12);
  ctx.lpSave.call(self, 'kelvin', [2200, 2700, 3200, 3500, 4000, 6500]);
  ctx.lpSave.call(self, 'kelvin', [2000, 3000]);
  ctx.lpSave.call(self, 'colors', Array.from(ctx.lpList.call(self, 'colors')));
  ctx.lpSave.call(self, 'colors', ['#112233']);
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [['lightpop.kelvin', null], ['lightpop.kelvin', [2000, 3000]], ['lightpop.colors', null], ['lightpop.colors', ['#112233']]]);
});
