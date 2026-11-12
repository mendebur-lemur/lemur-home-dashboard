// Yaz / kış (tablet, yönetici değil) ile yöneticinin ayar kaydı birbirini geri almamalı (v0.36, tests/test_season_merge.py).
// Sahte sunucu entegrasyonun kuralını izler: mevsim kendi sayacında; settings kaydı ssn ile gelir.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

function server() {
  const S = { data: { settings: { season: 'summer' }, tabs: [] }, revs: {}, sent: [], hold: [], live: null };
  const view = () => Object.assign({}, S.data, { revs: Object.assign({}, S.revs) });
  S.handle = (m) => {
    if (m.type.endsWith('/set')) {
      if (m.rev !== undefined && m.rev !== (S.revs[m.key] || 0)) return Promise.reject({ code: 'conflict' });
      let v = m.value;
      if (m.key === 'settings' && 'ssn' in m) {
        const cur = S.data.settings.season === undefined ? null : S.data.settings.season;
        const vs = v.season === undefined ? null : v.season;
        if (vs === m.ssn && cur !== m.ssn) { v = Object.assign({}, v); if (cur === null) delete v.season; else v.season = cur; }
      }
      S.data = Object.assign({}, S.data); S.data[m.key] = v; S.revs[m.key] = (S.revs[m.key] || 0) + 1;
      if (S.live) S.live({ __part: { [m.key]: v }, revs: Object.assign({}, S.revs) });
      return Promise.resolve(view());
    }
    if (m.type.endsWith('/season')) {
      S.data = Object.assign({}, S.data, { settings: Object.assign({}, S.data.settings, { season: m.season }) });
      S.revs.season = (S.revs.season || 0) + 1;
      if (S.live) S.live({ __part: { settings: S.data.settings }, revs: Object.assign({}, S.revs) });
      return Promise.resolve({ season: m.season });
    }
    if (m.type.endsWith('/info')) return Promise.resolve({ version: '0' });
    if (m.type.endsWith('/get')) return Promise.resolve(view());
    return Promise.resolve({});
  };
  S.conn = {
    connected: true, commands: new Map(), addEventListener() {},
    // admin saves wait in S.hold until the test lets them reach the server (they are "on their way")
    sendMessagePromise(m) { S.sent.push(m); if (m.type.endsWith('/set')) return new Promise((res, rej) => S.hold.push(() => S.handle(m).then(res, rej))); return S.handle(m); },
    subscribeMessage(cb) { S.live = cb; return Promise.resolve(() => {}); }
  };
  S.deliver = async () => { const f = S.hold.shift(); f(); await new Promise((r) => setTimeout(r, 0)); };
  return S;
}
function loadStore() {
  const ctx = { window: {}, setInterval: () => 0, setTimeout: setTimeout, document: {}, location: {}, PANEL_VERSION: '0', t: () => '', console: console };
  vm.createContext(ctx);
  vm.runInContext(rd('safe.js') + '\n' + rd('store.js') + '\nthis.STORE = STORE;', ctx);
  return ctx.STORE;
}
const tick = () => new Promise((r) => setTimeout(r, 0));

test('a tablet flips the season while two admin saves are on their way: both survive, no conflict', async () => {
  const S = server(), ST = loadStore();
  await ST.load({ connection: S.conn }); await tick();
  const edit = (k, v) => { const s = Object.assign({}, ST.data.settings, { [k]: v }); ST.data = Object.assign({}, ST.data, { settings: s }); return ST.set('settings', s); };
  const p1 = edit('a', 1), p2 = edit('b', 2);   // two quick edits (e.g. typing), both sent before any answer
  S.handle({ type: 'lemur_home_dashboard/season', season: 'winter' });   // the tablet, in between
  await tick();
  await S.deliver(); await S.deliver();
  await Promise.all([p1, p2]);
  assert.deepStrictEqual(S.data.settings, { season: 'winter', a: 1, b: 2 });
  assert.strictEqual(ST.data.settings.season, 'winter');           // the page shows the tablet's season
  const p3 = edit('c', 3); await S.deliver(); await p3;            // and its next save is not refused
  assert.deepStrictEqual(S.data.settings, { season: 'winter', a: 1, b: 2, c: 3 });
  assert.ok(S.sent.filter((m) => m.type.endsWith('/set')).every((m) => m.ssn !== undefined));
});

test('the admin choosing a season is saved even after a tablet flip it has seen', async () => {
  const S = server(), ST = loadStore();
  await ST.load({ connection: S.conn }); await tick();
  S.handle({ type: 'lemur_home_dashboard/season', season: 'winter' }); await tick();
  assert.strictEqual(ST.data.settings.season, 'winter');
  const p = ST.set('settings', Object.assign({}, ST.data.settings, { season: 'auto' })); await S.deliver(); await p;
  assert.strictEqual(S.data.settings.season, 'auto');
});

test('this screen flipping the season itself sends ssn of the new season', async () => {
  const S = server(), ST = loadStore();
  await ST.load({ connection: S.conn }); await tick();
  await ST.season('winter');
  const p = ST.set('settings', Object.assign({}, ST.data.settings, { x: 1 })); await S.deliver(); await p;
  assert.deepStrictEqual(S.data.settings, { season: 'winter', x: 1 });
});
