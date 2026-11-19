'use strict';
// Işık ve perde penceresi: komut reddedilince ya da cihaz hiç durum bildirmeyince bırakılan değer ekranda kalmaz, gerçeğe döner.
// Çalıştır: node --test tests/frontend_pop_reject.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const pop = fs.readFileSync(path.join(__dirname, '../src/lightpop.js'), 'utf8');
const cov = fs.readFileSync(path.join(__dirname, '../src/coverpop.js'), 'utf8');
const method = (source, name) => {
  const a = source.indexOf('\n  ' + name + '('); assert.ok(a >= 0, name);
  const eol = source.indexOf('\n', a + 1), one = /\}\s*$/.test(source.slice(a + 1, eol));
  return 'function ' + source.slice(a + 3, one ? eol : source.indexOf('\n  }\n', a) + 4);
};
const fn = (src) => new Function('return ' + src)();   // eslint-disable-line no-new-func
const tick = () => new Promise((r) => setTimeout(r, 0));

function popup(reject) {
  const sl = { _settle: { v: 20, until: Date.now() + 3000 } }, wh = { _settle: { hs: [10, 50], until: Date.now() + 3000 } };
  const calls = [];
  const p = {
    _closed: false, _dragging: false, _kHold: { k: 3200, until: Date.now() + 3000 }, _seen: [1], synced: 0,
    _h: { states: { 'light.a': { state: 'on' } }, callService: (d, s, x) => { calls.push([d, s, x]); return reject ? Promise.reject(new Error('x')) : Promise.resolve(); } },
    _pan: { querySelectorAll: () => [sl, wh] },
    _live: () => true, _sync() { this.synced++; }
  };
  p._call = fn(method(pop, '_call')); p._resync = fn(method(pop, '_resync'));
  return { p, sl, wh, calls };
}

test('reddedilen komut: kaydırıcı, beyaz tonu ve renk noktası tutulmaz, pencere yeniden çizilir', async () => {
  const { p, sl, wh, calls } = popup(true);
  p._call('turn_on', 'light.a', { brightness_pct: 20 });
  assert.equal(calls.length, 1);   // komut bir kez gider
  await tick(); await tick();
  assert.equal(sl._settle, null); assert.equal(wh._settle, null); assert.equal(p._kHold, null);
  assert.equal(p.synced, 1); assert.equal(p._seen, null);
});

test('kabul edilen komut: değerler cihaz bildirene kadar tutulur', async () => {
  const { p, sl, wh } = popup(false);
  p._call('turn_on', 'light.a', { brightness_pct: 20 });
  await tick(); await tick();
  assert.ok(sl._settle && wh._settle && p._kHold); assert.equal(p.synced, 0);
});

test('pencere kapandıysa ya da parmak hâlâ kaydırıyorsa yeniden çizilmez', async () => {
  const a = popup(true); a.p._closed = true; a.p._call('turn_on', 'light.a', {}); await tick(); await tick(); assert.equal(a.p.synced, 0);
  const b = popup(true); b.p._dragging = true; b.p._call('turn_on', 'light.a', {}); await tick(); await tick(); assert.equal(b.p.synced, 0); assert.equal(b.sl._settle, null);
});

test('süre dolunca (cihaz hiç durum bildirmedi) yeniden çizilir', async () => {
  const { p } = popup(false);
  p._resync(5); await new Promise((r) => setTimeout(r, 30));
  assert.equal(p.synced, 1);
});

test('kaydırıcı, beyaz tonu ve renk teki bırakılınca süre dolumu yeniden çizim kurar; perde penceresi de reddedilince döner', () => {
  assert.ok(/sl\._settle = \{ v: pct, until: Date\.now\(\) \+ 3000 \}; this\._resync\(3100\)/.test(pop));
  assert.ok(/this\._kHold = \{[^\n]*this\._resync\(3100\)/.test(pop));
  assert.ok(/wh\._settle = \{ hs: hs, until: Date\.now\(\) \+ 3000 \}; this\._resync\(3100\)/.test(pop));
  assert.ok(/pr\.catch\(\(\) => \{ this\._hold = null; back\(\); \}\)/.test(cov));
});
