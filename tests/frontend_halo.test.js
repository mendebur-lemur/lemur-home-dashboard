// v0.35: hâle görünümü: duruma göre renk + hareket + ad + simge + çerçeve, yer değiştirme, kendi boyunda kalma.
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const safe = fs.readFileSync(path.join(__dirname, '../src/safe.js'), 'utf8');
const pick = (re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };
const code = [
  /const lhdIsObj = [^\n]*\n/.exec(safe)[0],
  pick(/const LP_EMB_H = [^\n]*\n/),
  pick(/function lpHaloStyle\(it\) \{[\s\S]*?\n\}\n/),
  pick(/function lpMapStyle\(it, S\) \{[\s\S]*?\n\}\n/),
  pick(/function lpMapColor\(it, S\) \{[^\n]*\n/),
  pick(/const LP_HALO_RGB = [^\n]*\n/),
  pick(/function lpHexA\(c, a\) \{[^\n]*\n/),
].join('') + 'this.F = { lpHaloStyle, lpMapStyle, lpMapColor };';
const ctx = {}; vm.createContext(ctx); vm.runInContext(code, ctx);
const F = ctx.F;
const S = { 'sensor.d': { state: 'acil' }, 'sensor.e': { state: 'aktif' }, 'switch.o': { state: 'off' } };
const it = { entity: 'sensor.g', state_colors: { entity: 'sensor.d', map: { aktif: 'green', acil: { color: 'red', effect: 'blink', name: 'Acilen Besle', icon: 'mdi:alert-circle', frame: true } } } };

test('duruma göre görünüm: düz renk ve nesne', () => {
  assert.strictEqual(F.lpMapStyle(it, S).name, 'Acilen Besle');
  assert.strictEqual(F.lpMapColor(it, S), 'red');
  const it2 = Object.assign({}, it, { state_colors: Object.assign({}, it.state_colors, { entity: 'sensor.e' }) });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(F.lpMapStyle(it2, S))), { color: 'green' });
  assert.strictEqual(F.lpMapColor(it2, S), 'green');
  assert.strictEqual(F.lpMapStyle({ entity: 'x', state_colors: { entity: 'sensor.yok', map: {} } }, S), null);
  assert.strictEqual(F.lpMapColor({ state_colors: { entity: 'switch.o', map: { off: { effect: 'still' } } } }, S), null);   // renksiz nesne: renk yok
});

test('çerçeve, yanıp sönme, yer değiştirme ve kendi boyu', () => {
  const css = F.lpHaloStyle({ _frame: '#FF3737', _frameFx: 'blink', swap: true });
  assert.ok(/ha-card\{box-shadow:inset 0 0 0 2px rgba\(255,55,55,0\.95\)\}/.test(css));
  assert.ok(/animation:lhdfr 1s/.test(css));
  assert.ok(/flex-direction:column-reverse/.test(css));
  assert.ok(/:host\{height:100%\}/.test(css));
  assert.ok(!/animation/.test(F.lpHaloStyle({ _frame: '#FF3737', _frameFx: 'still' }).replace(/@media[^}]*\}\}/, '')));
  assert.ok(!/:host\{height:100%\}/.test(F.lpHaloStyle({ natural: true })));   // KH gibi kart olarak eklenenlerle aynı boy
  assert.ok(/\.compact \.top\{height:192px\}/.test(F.lpHaloStyle({ height: 2 })));   // büyük kart: simge ve yazı ortada
});
