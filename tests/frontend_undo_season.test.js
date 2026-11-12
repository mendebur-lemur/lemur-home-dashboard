// Geri al / ileri al tabletin yaz / kış seçimini geri getirmemeli (yöneticinin geri aldığı adım mevsim değişikliği değilse).
// Gerçek STORE (store.js) + entegrasyonun ssn kuralını izleyen sahte sunucu + admin.js'nin geçmiş fonksiyonları.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const SRC = process.env.LHD_SRC || path.join(__dirname, '../src');
const rd = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

function server() {
  const S = { data: { settings: { season: 'summer', a: 1 }, tabs: [{ id: 'home', sections: [] }] }, revs: {}, live: null };
  const view = () => Object.assign({}, S.data, { revs: Object.assign({}, S.revs) });
  S.handle = (m) => {
    if (m.type.endsWith('/set')) {
      if (m.rev !== undefined && m.rev !== (S.revs[m.key] || 0)) return Promise.reject({ code: 'conflict' });
      let v = m.value;
      if (m.key === 'settings' && 'ssn' in m) {   // custom_components/.../__init__.py ws_set
        const cur = S.data.settings.season === undefined ? null : S.data.settings.season;
        const vs = v.season === undefined ? null : v.season;
        if (vs === m.ssn && cur !== m.ssn) { v = Object.assign({}, v); if (cur === null) delete v.season; else v.season = cur; }
      }
      S.data = Object.assign({}, S.data); S.data[m.key] = v; S.revs[m.key] = (S.revs[m.key] || 0) + 1;
      if (S.live) S.live({ __part: { [m.key]: v }, revs: Object.assign({}, S.revs) });
      return Promise.resolve(view());
    }
    if (m.type.endsWith('/season')) {   // ws_season: settings sayacı artmaz
      S.data = Object.assign({}, S.data, { settings: Object.assign({}, S.data.settings, { season: m.season }) });
      if (S.live) S.live({ __part: { settings: S.data.settings }, revs: Object.assign({}, S.revs) });
      return Promise.resolve({ season: m.season });
    }
    if (m.type.endsWith('/get')) return Promise.resolve(view());
    return Promise.resolve({ version: '0' });
  };
  S.conn = { connected: true, addEventListener() {}, sendMessagePromise: (m) => S.handle(m), subscribeMessage(cb) { S.live = cb; return Promise.resolve(() => {}); } };
  return S;
}
const adm = rd('admin.js');
const meth = (n) => { const a = adm.indexOf('\n  ' + n + '('), b = adm.indexOf('\n  }\n', a); assert.ok(a > 0 && b > a, n); return adm.slice(a + 3, b + 4); };
function setup() {
  const ctx = { window: {}, setInterval: () => 0, setTimeout: setTimeout, document: {}, location: {}, PANEL_VERSION: '0', t: () => '', console: console };
  vm.createContext(ctx);
  vm.runInContext(rd('safe.js') + '\n' + rd('store.js') + '\nconst lhdClone = (x) => JSON.parse(JSON.stringify(x));\nthis.STORE = STORE;\nthis.A = {' + ['_commit', '_snap', '_histCur', '_undoIt', '_redoIt', '_histApply'].map(meth).join(',\n') + '};', ctx);
  const A = Object.assign(Object.create(ctx.A), { _undo: [], _redo: [], _tab: 'home', _modal: null, _t: (k) => k, _toast() {}, _render() {}, _settings: () => (ctx.STORE.data && ctx.STORE.data.settings) || {} });
  return { ST: ctx.STORE, A: A };
}
const tick = () => new Promise((r) => setTimeout(r, 0));

test('undo of a tabs edit keeps the season the tablet chose meanwhile', async () => {
  const S = server(), { ST, A } = setup();
  await ST.load({ connection: S.conn }); await tick();
  A._snap(); A._commit('tabs', [{ id: 'home', name: 'Ev', sections: [] }]); await tick();
  S.handle({ type: 'lemur_home_dashboard/season', season: 'winter' }); await tick();
  assert.strictEqual(ST.data.settings.season, 'winter');
  A._undoIt(); await tick(); await tick();
  assert.strictEqual(S.data.settings.season, 'winter', 'server season');
  assert.strictEqual(ST.data.settings.season, 'winter', 'page season');
  assert.strictEqual(S.data.tabs[0].name, undefined, 'tabs undone');
  A._redoIt(); await tick(); await tick();
  assert.strictEqual(S.data.settings.season, 'winter');
  assert.strictEqual(S.data.tabs[0].name, 'Ev');
});

test('undo of a settings edit keeps the season too, and undoes the edit', async () => {
  const S = server(), { ST, A } = setup();
  await ST.load({ connection: S.conn }); await tick();
  A._snap(); A._commit('settings', Object.assign({}, ST.data.settings, { a: 2 })); await tick();
  S.handle({ type: 'lemur_home_dashboard/season', season: 'winter' }); await tick();
  A._undoIt(); await tick(); await tick();
  assert.deepStrictEqual([S.data.settings.a, S.data.settings.season], [1, 'winter']);
  A._redoIt(); await tick(); await tick();
  assert.deepStrictEqual([S.data.settings.a, S.data.settings.season], [2, 'winter']);
});

test("the admin's own season change is still undone and redone", async () => {
  const S = server(), { ST, A } = setup();
  await ST.load({ connection: S.conn }); await tick();
  A._snap(); A._commit('settings', Object.assign({}, ST.data.settings, { season: 'winter' })); await tick();
  assert.strictEqual(S.data.settings.season, 'winter');
  A._undoIt(); await tick(); await tick();
  assert.strictEqual(S.data.settings.season, 'summer');
  A._redoIt(); await tick(); await tick();
  assert.strictEqual(S.data.settings.season, 'winter');
  // otomatiğe dönmek (season silinir) de kendi adımıdır
  A._snap(); const s = Object.assign({}, ST.data.settings); delete s.season; A._commit('settings', s); await tick();
  assert.strictEqual(S.data.settings.season, undefined);
  A._undoIt(); await tick(); await tick();
  assert.strictEqual(S.data.settings.season, 'winter');
});
