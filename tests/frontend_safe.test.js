// src/safe.js denetimleri (tarayıcı tarafı). Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/safe.js'), 'utf8') +
  '\nthis.S = { lhdSafeSvg, lhdSafeIcons, lhdSafeUrl, lhdSafeFeederSvc, lhdSafeNotify, lhdCleanAction, lhdCleanTabs, lhdCleanPets };', ctx);
const S = ctx.S;
const plain = (x) => JSON.parse(JSON.stringify(x));

test('svg: clean icons pass, active content is dropped', () => {
  assert.ok(S.lhdSafeSvg('<svg viewBox="0 0 24 24"><path d="M0 0h24"/></svg>'));
  assert.ok(S.lhdSafeSvg('<svg><defs><linearGradient id="g"/></defs><path fill="url(#g)"/></svg>'));
  ['<svg><script>alert(1)</script></svg>', '<svg onload="alert(1)"></svg>', '<svg><a href="javascript:x">a</a></svg>',
    '<svg><image href="https://x/y.png"/></svg>', '<svg><foreignObject></foreignObject></svg>', '<svg><use href="https://x#a"/></svg>',
    '<svg><path style="fill:url(https://x)"/></svg>', '<img src=x onerror=alert(1)>', '<svg></svg><svg></svg>', 42
  ].forEach((v) => assert.ok(!S.lhdSafeSvg(v), String(v)));
});

test('icon set: bad keys and bad svgs removed', () => {
  const m = S.lhdSafeIcons({ 'mdi:ok': '<svg><path/></svg>', 'mdi:bad': '<svg onclick="x"></svg>', '"><x': '<svg></svg>' }, /^(mdi|lhd):[a-z0-9-]+$/);
  assert.deepStrictEqual(Object.keys(m), ['mdi:ok']);
  assert.deepStrictEqual(plain(S.lhdSafeIcons(null, /x/)), {});
  assert.deepStrictEqual(plain(S.lhdSafeIcons([1], /x/)), {});
});

test('url: only http(s) or a path', () => {
  ['https://a.b/c', 'http://x', '/lovelace/0', '/'].forEach((u) => assert.ok(S.lhdSafeUrl(u), u));
  ['javascript:alert(1)', 'data:text/html,x', '//evil.com', 'JaVaScRiPt:x', ' https://x', 'https://x"onmouseover=1', 5].forEach((u) => assert.ok(!S.lhdSafeUrl(u), String(u)));
});

test('popup action keeps only title and card', () => {
  const a = S.lhdCleanAction({ popup: { title: 'T', html: '<img onerror=x>', card: { type: 'markdown' } } });
  assert.deepStrictEqual(plain(a.popup), { title: 'T', card: { type: 'markdown' } });
  assert.strictEqual(S.lhdCleanAction({ action: 'url', url_path: 'javascript:x' }).url_path, undefined);
  assert.strictEqual(S.lhdCleanAction('toggle'), 'toggle');
});

test('tabs: grow / gap numbers, limits, junk dropped', () => {
  const t = S.lhdCleanTabs([{ sections: [{ grow: '1.5', gap: 'x', entities: ['a.b', 5, { entity: 'a.c', tap: { popup: { html: 'x' } } }] }] }, 'junk']);
  assert.strictEqual(t.length, 1);
  const s = t[0].sections[0];
  assert.strictEqual(s.grow, 1.5); assert.ok(!('gap' in s));
  assert.strictEqual(s.entities.length, 2);
  assert.deepStrictEqual(plain(s.entities[1].tap.popup), {});
  assert.deepStrictEqual(plain(S.lhdCleanTabs({})), []);
});

test('pets: feeder domains and notify target', () => {
  const p = S.lhdCleanPets({
    pamuk: { name: 'Pamuk', kind: 'cat', feeder: { service: 'button.press', target: 'button.yemlik', data: { a: 1 } }, notify: 'notify.tel' },
    'kara-bas': { name: 'K', feeder: { service: 'hassio.host_shutdown' }, notify: 'script.x' },
    'Bad Id': { name: 'x' }, zz: 'str'
  });
  assert.deepStrictEqual(Object.keys(p), ['pamuk', 'kara-bas']);
  assert.strictEqual(p.pamuk.feeder.service, 'button.press');
  assert.strictEqual(p['kara-bas'].feeder, undefined);
  assert.strictEqual(p['kara-bas'].notify, undefined);
  const many = {}; for (let i = 0; i < 60; i++) many['p' + i] = { name: 'x' };
  assert.strictEqual(Object.keys(S.lhdCleanPets(many)).length, 50);
  assert.ok(!S.lhdSafeFeederSvc('homeassistant.stop'));
  assert.ok(S.lhdSafeNotify('notify.mobile_app_x'));
});
