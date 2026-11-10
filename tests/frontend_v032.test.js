// v0.32: kayıt sayaçları ve parça parça gelen değişiklikler (src/store.js), havuzdan gelen "ölçüm hazır" (src/picks.js).
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const picks = JSON.parse(fs.readFileSync(path.join(__dirname, '../library/picks.json'), 'utf8'));

// sahte bağlantı: get / set / subscribe; sunucudaki gibi sayaç tutar
function server(data, withRevs) {
  const S = { data: data, revs: {}, sub: null, subMsg: null, sent: [], hold: null };
  S.conn = {
    connected: true, commands: new Map(), addEventListener() {},
    sendMessagePromise(m) {
      S.sent.push(m);
      if (m.type.endsWith('/info')) return Promise.resolve({ version: '0' });
      if (m.type.endsWith('/get')) return Promise.resolve(Object.assign({}, S.data, withRevs ? { revs: Object.assign({}, S.revs) } : {}));
      if (m.type.endsWith('/set')) {
        const run = () => {
          if (m.rev !== undefined && m.rev !== (S.revs[m.key] || 0)) return Promise.reject({ code: 'conflict' });
          S.data = Object.assign({}, S.data); S.data[m.key] = m.value; S.revs[m.key] = (S.revs[m.key] || 0) + 1;
          return Promise.resolve(Object.assign({}, S.data, { revs: Object.assign({}, S.revs) }));
        };
        if (S.hold) return new Promise((res, rej) => { S.hold.push(() => run().then(res, rej)); });
        return run();
      }
      return Promise.resolve({});
    },
    subscribeMessage(cb, m) { S.sub = cb; S.subMsg = m; return Promise.resolve(() => {}); }
  };
  return S;
}
function loadStore() {
  const ctx = { window: {}, setInterval: () => 0, setTimeout: setTimeout, document: {}, location: {}, PANEL_VERSION: '0', t: () => '', console: console };
  vm.createContext(ctx);
  vm.runInContext(rd('safe.js') + '\n' + rd('store.js') + '\nthis.STORE = STORE;', ctx);
  return ctx.STORE;
}
const tick = () => new Promise((r) => setTimeout(r, 0));

test('new integration: subscribes for parts, saves carry the counter', async () => {
  const S = server({ settings: { a: 1 }, tabs: [] }, true), ST = loadStore();
  await ST.load({ connection: S.conn });
  assert.strictEqual(S.subMsg.parts, true);
  await ST.set('settings', { a: 2 });
  await ST.set('settings', { a: 3 });                       // art arda iki kendi kaydı: ikisi de geçer
  const sets = S.sent.filter((m) => m.type.endsWith('/set'));
  assert.deepStrictEqual(sets.map((m) => m.rev), [0, 1]);
  assert.deepStrictEqual(S.data.settings, { a: 3 });
});

test('two saves sent before the first answer do not trip over each other', async () => {
  const S = server({ settings: {}, tabs: [] }, true), ST = loadStore();
  await ST.load({ connection: S.conn });
  S.hold = [];
  const p1 = ST.set('settings', { a: 1 }), p2 = ST.set('settings', { a: 2 });
  const q = S.hold; S.hold = null; q.forEach((f) => f());
  await p1; await p2;
  assert.deepStrictEqual(S.data.settings, { a: 2 });
});

test('a part replaces only its key; a change elsewhere makes the late save fail and reload', async () => {
  const S = server({ settings: { a: 1 }, tabs: [{ id: 't' }] }, true), ST = loadStore();
  await ST.load({ connection: S.conn });
  let seen = 0; ST.onChange(() => { seen++; });
  // başka bir ekran settings'i değiştirdi: parça gelir
  S.data = Object.assign({}, S.data, { settings: { a: 9 } }); S.revs.settings = 1;
  S.sub({ __part: { settings: { a: 9 } }, revs: { settings: 1 } });
  assert.deepStrictEqual(ST.data.settings, { a: 9 });
  assert.deepStrictEqual(ST.data.tabs, [{ id: 't' }]);
  assert.strictEqual(seen, 1);
  await ST.set('settings', { a: 10 });                      // güncel kopyanın üstüne: geçer
  assert.deepStrictEqual(S.data.settings, { a: 10 });
  // bu ekranın haberi olmadan sunucuda değişti (parça kaçtı): kayıt geri çevrilir, güncel veri alınır
  S.data = Object.assign({}, S.data, { tabs: [{ id: 'x' }] }); S.revs.tabs = 1;
  let err = null;
  await ST.set('tabs', [{ id: 'mine' }]).catch((e) => { err = e; });
  assert.strictEqual(err && err.code, 'conflict');
  await tick(); await tick();
  assert.deepStrictEqual(ST.data.tabs, [{ id: 'x' }]);       // üstüne yazılmadı
  assert.deepStrictEqual(S.data.tabs, [{ id: 'x' }]);
  await ST.set('tabs', [{ id: 'again' }]);                   // yeniden yüklenen sayaçla geçer
  assert.deepStrictEqual(S.data.tabs, [{ id: 'again' }]);
});

test('a part for a key being saved is left to the server', async () => {
  const S = server({ settings: { a: 1 } }, true), ST = loadStore();
  await ST.load({ connection: S.conn });
  S.hold = [];
  const p = ST.set('settings', { a: 2 });
  ST.data = Object.assign({}, ST.data, { settings: { a: 2 } });     // yönetim paneli yereli hemen değiştirir
  S.sub({ __part: { settings: { a: 1 } }, revs: { settings: 0 } });  // eski bir yankı: ekrandakini ezmez
  assert.deepStrictEqual(ST.data.settings, { a: 2 });
  const q = S.hold; S.hold = null; q.forEach((f) => f());
  await p;
});

test('older integration: no counters, plain subscription, saves as before', async () => {
  const S = server({ settings: {}, tabs: [] }, false), ST = loadStore();
  await ST.load({ connection: S.conn });
  assert.strictEqual(S.subMsg.parts, undefined);
  await ST.set('settings', { a: 1 });
  assert.strictEqual(S.sent.filter((m) => m.type.endsWith('/set'))[0].rev, undefined);
  S.sub({ settings: { a: 5 }, tabs: [] });                    // bütün veri gelir
  assert.deepStrictEqual(ST.data.settings, { a: 5 });
});

// ---- Önerilen ürünler: "ölçüm hazır" havuzdan ----
function loadPicks(cache, fetchMap) {
  const store = { v: cache ? JSON.stringify(cache) : null };
  const ctx = { localStorage: { getItem: () => store.v, setItem: (k, v) => { store.v = v; } }, JSON: JSON, LHD_PICKS: picks, Date: Date, Promise: Promise,
    fetch: (u) => Promise.resolve(fetchMap && fetchMap[u.indexOf('index.json') >= 0 ? 'ix' : 'pk'] ? { ok: true, json: () => Promise.resolve(fetchMap[u.indexOf('index.json') >= 0 ? 'ix' : 'pk']) } : { ok: false }) };
  vm.createContext(ctx);
  vm.runInContext(rd('picks.js') + '\nthis.P = { LHDPicks };', ctx);
  return { P: ctx.P.LHDPicks, store: store };
}
test('a product whose model is in the pool shows as measured, whatever the list says', async () => {
  const { P, store } = loadPicks(null, { ix: { v: 1, models: ['govee|h6046', 'x|y'] } });
  const it = P.get().items.filter((x) => x.id === 'govee-h6046')[0];
  assert.strictEqual(it.energy, 'wait');
  assert.strictEqual(it.pool, 'govee|h6046');
  assert.strictEqual(P.en(it), 'wait');                       // havuz listesi henüz gelmedi
  let changed = 0;
  P.load(() => { changed++; });
  await tick(); await tick(); await tick();
  assert.strictEqual(P.en(it), 'lut');
  assert.strictEqual(changed, 1);
  assert.deepStrictEqual(JSON.parse(store.v).p.sort(), ['govee|h6046', 'x|y']);
  assert.strictEqual(P.en({ energy: 'self' }), 'self');
  assert.strictEqual(P.en({ energy: 'bogus' }), 'none');
  assert.strictEqual(P.en({ energy: 'wait', pool: 'toString' }), 'wait');   // nesnenin kendi özellikleri sayılmaz
});
test('the pool list is remembered between visits', () => {
  const { P } = loadPicks({ t: Date.now(), d: picks, p: ['govee|h6046'] });
  assert.strictEqual(P.en(P.get().items.filter((x) => x.id === 'govee-h6046')[0]), 'lut');
});
test('every pool key in the list has the pool key shape', () => {
  picks.items.forEach((x) => { if (x.pool !== undefined) assert.ok(/^[a-z0-9]+\|[a-z0-9]+$/.test(x.pool), x.id); });
});
