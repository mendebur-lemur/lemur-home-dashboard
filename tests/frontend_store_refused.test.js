// Sunucunun geri çevirdiği kayıt (invalid, unauthorized...) sayaçları bozmamalı: sonraki kayıt "başka yerde değişti" olmamalı.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

function server(data) {
  const S = { data: data, revs: {}, sent: [], refuse: null };
  S.conn = {
    connected: true, commands: new Map(), addEventListener() {},
    sendMessagePromise(m) {
      S.sent.push(m);
      if (m.type.endsWith('/info')) return Promise.resolve({ version: '0' });
      if (m.type.endsWith('/get')) return Promise.resolve(Object.assign({}, S.data, { revs: Object.assign({}, S.revs) }));
      if (m.type.endsWith('/set')) {
        if (m.rev !== undefined && m.rev !== (S.revs[m.key] || 0)) return Promise.reject({ code: 'conflict' });
        if (S.refuse) { const c = S.refuse; S.refuse = null; return Promise.reject({ code: c, message: c }); }
        S.data = Object.assign({}, S.data); S.data[m.key] = m.value; S.revs[m.key] = (S.revs[m.key] || 0) + 1;
        return Promise.resolve(Object.assign({}, S.data, { revs: Object.assign({}, S.revs) }));
      }
      return Promise.resolve({});
    },
    subscribeMessage(cb) { return Promise.resolve(() => {}); }
  };
  return S;
}
function loadStore() {
  const ctx = { window: {}, setInterval: () => 0, setTimeout: setTimeout, document: {}, location: {}, PANEL_VERSION: '0', t: () => '', console: console };
  vm.createContext(ctx);
  vm.runInContext(rd('safe.js') + '\n' + rd('store.js') + '\nthis.STORE = STORE;', ctx);
  return ctx.STORE;
}

test('a save the server refuses does not make the next save a conflict', async () => {
  const S = server({ settings: {}, pets: {} }), ST = loadStore();
  await ST.load({ connection: S.conn });
  S.refuse = 'invalid';
  let err = null;
  await ST.set('pets', { 'Bad Id': {} }).catch((e) => { err = e; });
  assert.strictEqual(err && err.code, 'invalid');
  await ST.set('pets', { cat: { name: 'Tekir' } });          // düzeltilmiş kayıt geçmeli
  assert.deepStrictEqual(S.data.pets, { cat: { name: 'Tekir' } });
});
