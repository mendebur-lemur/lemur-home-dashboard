// Yedek ve geri yükleme (v0.36.0b4, dbg4/backup): yedek dosyası bütün ev verisini içerir (format_version 2), geri yükleme
// yalnız dosyadaki anahtarları ve ancak sunucu hepsini kabul edince yazar, tek geri al adımıdır; başka evin yedeği uyarır.
// Çalıştır: node --test tests/frontend_backup.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const adm = rd('admin.js'), safe = rd('safe.js'), store = rd('store.js'), css = rd('admin.css');
const py = fs.readFileSync(path.join(__dirname, '../custom_components/lemur_home_dashboard/__init__.py'), 'utf8');
const clone = (x) => JSON.parse(JSON.stringify(x));
// sınıf yöntemi ("  _ad(" ya da "  async _ad(") function olarak
const method = (head) => { let a = adm.indexOf('  ' + head + '('), pre = 'function '; if (a < 0) { a = adm.indexOf('  async ' + head + '('); pre = 'async function '; if (a >= 0) a += 6; } assert.ok(a >= 0, head); const b = adm.indexOf('\n  }\n', a); return pre + adm.slice(a + 2 + head.length, b + 4); };
const between = (src, a, b) => { const i = src.indexOf(a); assert.ok(i >= 0, a); const j = src.indexOf(b, i); assert.ok(j > i, b); return src.slice(i, j); };
const fnSrc = (src, head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
const KEYS = ['tabs', 'settings', 'profiles', 'pets', 'estimates', 'ecats', 'twins', 'walls'];
const FULL = JSON.parse(fs.readFileSync(path.join(__dirname, 'backup_full.json'), 'utf8'));

// safe.js (lhdPyLen, lhdCleanTabs, lhdCleanPets, lhdIsObj) + admin.js'in yedek sabitleri ve işlevleri tek bağlamda
function ctxWith(extra) {
  const ctx = Object.assign({ lhdClone: clone, console }, extra || {});
  vm.createContext(ctx);
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' + between(adm, 'const LHD_BK_KEYS', 'const LHD_REPO') + '\n' + fnSrc(adm, 'function lhdBkEnts(').replace(/^/, '') +
    '\nthis.K = LHD_BK_KEYS; this.prep = lhdBkPrep; this.pyLen = lhdPyLen; this.ents = lhdBkEnts; this.none = lhdBkNone;', ctx);
  return ctx;
}

test('lhdPyLen = Python json.dumps uzunluğu (entegrasyonun 1 MB sınırı)', () => {
  const c = ctxWith();
  const cases = [[null, 4], [true, 4], [false, 5], [0, 1], [12, 2], [-3.5, 4], ['', 2], ['abc', 5], ['a"b\\c\n\t', 13], ['Işık ğüş', 35], ['😀', 14], ['\x01', 8], [[], 2], [[1, 2, 3], 9], [{}, 2], [{ a: 1, b: [1, { c: 'ç' }] }, 35], [{ x: null, y: [true, false] }, 31]];
  cases.forEach(([v, n]) => assert.strictEqual(c.pyLen(v), n, JSON.stringify(v)));
});

test('yedek dosyası: bütün anahtarlar ve format_version 2; feed / learn_avg / sayaçlar dışarıda', () => {
  const c = ctxWith();
  assert.deepStrictEqual(Array.from(c.K), KEYS);
  const down = method('_backupDown');
  assert.ok(/format_version: LHD_BK_FV/.test(down) && /LHD_BK_KEYS\.forEach/.test(down));
  assert.ok(/const LHD_BK_FV = 2;/.test(adm));
  // sunucunun ws_set ile yazılabilen anahtarları = yedeğin anahtarları
  const sk = /SET_KEYS = \(([^)]*)\)/.exec(py)[1].match(/"([a-z_]+)"/g).map((x) => x.slice(1, -1));
  assert.deepStrictEqual(sk.slice().sort(), KEYS.slice().sort());
});

test('lhdBkPrep: yalnız dosyadaki anahtarlar; bozuk tür ve 1 MB üstü önceden söylenir', () => {
  const c = ctxWith();
  const old = { tabs: [{ id: 'a', sections: [{ id: 's' }] }], settings: {}, profiles: {}, pets: { kedi: { name: 'P' } }, estimates: {} };
  const r = c.prep(old);
  assert.deepStrictEqual(Object.keys(r.V), ['tabs', 'settings', 'profiles', 'pets', 'estimates']);
  assert.deepStrictEqual(clone(r.V.tabs[0].sections[0].entities), []);
  assert.strictEqual(r.V.pets.kedi.kind, 'other');
  assert.deepStrictEqual(Array.from(r.bad), []);
  assert.deepStrictEqual(clone(c.prep({ tabs: [], settings: [1, 2] }).V.settings), {}, '0.35 gibi: bozuk ayar boş ayar');
  assert.deepStrictEqual(Array.from(c.prep({ tabs: [], walls: {}, ecats: [], twins: [] }).bad), ['twins:type', 'walls:type']);
  assert.deepStrictEqual(Array.from(c.prep({ tabs: [{ id: 't', name: 'x'.repeat(1024 * 1024) }] }).bad), ['tabs:big']);
  const f = c.prep(clone(FULL));
  assert.deepStrictEqual(Object.keys(f.V), KEYS);
  KEYS.forEach((k) => assert.deepStrictEqual(clone(f.V[k]), FULL[k], k));
  assert.ok(f.size > 10000 && f.size < 3.5 * 1024 * 1024);
});

// yönetim panelinin yedek yöntemleri, sahte STORE ile
function host(opts) {
  const S = { data: Object.assign({ version: 1, feed: {} }, clone(opts.data)), subs: [], sets: [], restores: 0 };
  if (!opts.noRestore) S.restore = (V) => { S.restores++; const bad = opts.reject && Object.keys(V).filter((k) => opts.reject.indexOf(k) >= 0); if (bad && bad.length) return Promise.reject({ code: opts.code || 'invalid', message: bad.map((k) => k + ': wrong type or too large').join('; ') }); S.data = Object.assign({}, S.data, clone(V)); return Promise.resolve(S.data); };
  S.set = (k, v) => { S.sets.push(k); if (opts.reject && opts.reject.indexOf(k) >= 0 && !(opts.rejectOnce && S.sets.filter((x) => x === k).length > 1)) return Promise.reject({ code: 'invalid', message: k + ': refused' }); S.data = Object.assign({}, S.data, { [k]: v }); return Promise.resolve(S.data); };
  const ctx = ctxWith({ STORE: S, esc: (x) => String(x), PANEL_VERSION: '0.36.0b4' });
  const M = ['_snap', '_histCur', '_undoIt', '_redoIt', '_histApply', '_backupApply', '_bkWrite', '_bkErrText', '_bkParts'];
  M.forEach((m) => vm.runInContext('this.' + m + ' = ' + method(m) + ';', ctx));
  const T = { tr: { bkFail: 'Yedek geri yüklenmedi, hiçbir şey değişmedi. Sorunlu bölüm: {p}', bkBig: 'çok büyük', bkBadT: 'bozuk' } };
  KEYS.forEach((k) => { T.tr['bkP_' + k] = k.toUpperCase(); });
  const h = { _undo: [], _redo: [], _tab: 'ev', toasts: [], renders: 0, _settings: () => S.data.settings || {}, _commit: (k, v) => { S.data = Object.assign({}, S.data, { [k]: v }); },
    _render: () => { h.renders++; }, _toast: (m) => { h.toasts.push(m); }, _t: (k, v) => String(T.tr[k] || k).replace(/\{(\w+)\}/g, (m, q) => (v && v[q] !== undefined ? v[q] : m)) };
  M.forEach((m) => { h[m] = ctx[m]; });
  h.S = S; h.ctx = ctx;
  return h;
}
const pick = (d) => { const o = {}; KEYS.forEach((k) => { if (d[k] !== undefined) o[k] = clone(d[k]); }); return o; };
const FRESH = { tabs: [], settings: {}, profiles: {}, pets: {}, estimates: {}, ecats: [], twins: {}, walls: [] };

test('sıfır kuruluma tam yedek: aynı veri; tek geri al hepsini (liste anahtarları dahil) geri getirir, ileri al yeniden uygular', async () => {
  const h = host({ data: FRESH });
  h._bk = { data: h.ctx.prep(clone(FULL)).V, size: 1000 };
  await h._backupApply();
  assert.deepStrictEqual(pick(h.S.data), FULL);
  assert.strictEqual(h._undo.length, 1);
  assert.deepStrictEqual(h.toasts, ['bkOk']);
  h._undoIt();
  assert.deepStrictEqual(pick(h.S.data), FRESH);
  assert.ok(Array.isArray(h.S.data.walls) && Array.isArray(h.S.data.ecats));
  h._redoIt();
  assert.deepStrictEqual(pick(h.S.data), FULL);
});

test('0.35.1 yedeği dolu eve: yalnız 5 anahtar değişir, ecats / twins / walls kalır; iki kez = aynı; geri al', async () => {
  const h = host({ data: FULL });
  const old = { tabs: [{ id: 'eski', name: 'Eski', sections: [] }], settings: { season: 'summer' }, profiles: {}, pets: { boncuk: { name: 'Boncuk', kind: 'dog' } }, estimates: { modem: { name: 'Modem', kind: 'fixed', w: 9 } } };
  h._bk = { data: h.ctx.prep(clone(old)).V }; await h._backupApply();
  const S1 = pick(h.S.data);
  ['ecats', 'twins', 'walls'].forEach((k) => assert.deepStrictEqual(S1[k], FULL[k], k));
  assert.deepStrictEqual(S1.tabs[0].id, 'eski');
  assert.strictEqual(h._undo[0].sx, true, 'mevsim de değişti: geri alınca döner');
  assert.deepStrictEqual(Object.keys(h._undo[0].more).sort(), ['estimates', 'pets', 'profiles']);
  h._bk = { data: h.ctx.prep(clone(old)).V }; await h._backupApply();
  assert.deepStrictEqual(pick(h.S.data), S1);
  h._undoIt(); assert.deepStrictEqual(pick(h.S.data), S1);
  h._undoIt(); assert.deepStrictEqual(pick(h.S.data), FULL);
});

test('sunucu bir anahtarı geri çevirirse hiçbir şey değişmez, "geri yüklendi" denmez, hangi bölüm olduğu yazar', async () => {
  const h = host({ data: FULL, reject: ['tabs', 'pets'] });
  h._bk = { data: h.ctx.prep(clone(Object.assign({}, FULL, { tabs: [{ id: 'yeni', sections: [] }], settings: { a: 1 } }))).V };
  await h._backupApply();
  assert.deepStrictEqual(pick(h.S.data), FULL);
  assert.deepStrictEqual(h.toasts, []);
  assert.strictEqual(h._undo.length, 0);
  assert.strictEqual(h._bkErr, 'Yedek geri yüklenmedi, hiçbir şey değişmedi. Sorunlu bölüm: TABS (çok büyük), PETS (çok büyük)');
  assert.ok(h._bk, 'pencere açık kalır');
  assert.strictEqual(h.S.sets.length, 0, 'tek mesaj, anahtar anahtar yazılmadı');
});

test('restore bilmeyen entegrasyon: anahtar anahtar yazılır; biri geri çevrilirse yazılanlar eski hâline döner', async () => {
  const h = host({ data: FULL, noRestore: true, reject: ['estimates'] });
  const V = h.ctx.prep(clone(Object.assign({}, FRESH, { tabs: [{ id: 'yeni', sections: [] }], settings: { a: 1 }, pets: { kedi: { name: 'K' } } }))).V;
  h._bk = { data: V };
  await h._backupApply();
  assert.deepStrictEqual(pick(h.S.data), FULL);
  assert.deepStrictEqual(h.S.sets, ['tabs', 'settings', 'profiles', 'pets', 'estimates', 'pets', 'profiles', 'settings', 'tabs']);
  assert.ok(/ESTIMATES$/.test(h._bkErr), h._bkErr);
  // unknown_command (0.36.0b3 entegrasyonu) da aynı yola düşer
  const h2 = host({ data: FRESH, reject: ['tabs'], code: 'unknown_command', rejectOnce: true });
  h2.S.restore = () => Promise.reject({ code: 'unknown_command', message: 'Unknown command.' });
  h2.S.set = (k, v) => { h2.S.sets.push(k); h2.S.data = Object.assign({}, h2.S.data, { [k]: v }); return Promise.resolve(); };
  h2._bk = { data: h2.ctx.prep(clone(FULL)).V };
  await h2._backupApply();
  assert.deepStrictEqual(pick(h2.S.data), FULL);
  assert.deepStrictEqual(h2.S.sets, KEYS);
  // 3.5 MB'tan büyük yedek tek mesaja konmaz (HA websocket 4 MB'ta bağlantıyı keser)
  const h3 = host({ data: FRESH });
  h3._bk = { data: h3.ctx.prep(clone(FULL)).V, size: 4 * 1024 * 1024 };
  await h3._backupApply();
  assert.strictEqual(h3.S.restores, 0); assert.deepStrictEqual(h3.S.sets, KEYS);
});

test('başka evin yedeği: kaç cihazın bu evde olmadığı sayılır (panonun kendi sensörleri sayılmaz)', () => {
  const c = ctxWith();
  const E = Array.from(c.ents(FULL)).sort();
  ['light.giris', 'light.hue_tv_ust', 'script.s2', 'light.masa_lambasi', 'sensor.pc_priz_power', 'media_player.tv', 'button.mama_kabi', 'light.wc_matter', 'binary_sensor.wc_anahtar', 'switch.lantern_role']
    .forEach((x) => assert.ok(E.indexOf(x) >= 0, x));
  assert.ok(!E.some((x) => /^sensor\.lhd/.test(x) || /^mdi:/.test(x) || x === 'script.turn_on'), 'servis adı ve simge cihaz değil');
  assert.deepStrictEqual(Array.from(c.ents({ tabs: [{ sections: [{ entities: ['light.a', { entity: 'light.b', temperature_sensor: 'sensor.t' }, { name: 'boş' }] }] }] })).sort(), ['light.a', 'light.b', 'sensor.t']);
  const html = method('_restoreHtml');
  assert.ok(/b\.miss === b\.ents \? 'bkMissAll' : 'bkMiss'/.test(html));
  assert.ok(/bkMiss: 'Bu yedekteki \{n\} cihazdan \{m\} tanesi bu evde yok/.test(adm) && /bkMiss: '\{m\} of the \{n\} devices in this backup/.test(adm));
});

test('STORE.restore: kabul edilince veri ve sayaçlar sunucudaki hâliyle; geri çevrilince hiçbir şey değişmez', async () => {
  const src = between(store, '  restore(values) {', '  // sunucudaki güncel veriyi al');
  const mk = (reply) => {
    const S = { data: { tabs: [1], settings: { season: 'winter' }, walls: [] }, revs: { tabs: 3, walls: 1, feed: 9 }, pending: 0, pk: {}, subs: [], ssn: 'winter', refreshed: 0, sent: null,
      _ssnOf: (d) => (d && d.settings && typeof d.settings.season === 'string' ? d.settings.season : null), refresh() { this.refreshed++; return Promise.resolve(); },
      conn: { sendMessagePromise: (m) => { S.sent = m; return reply(m); } } };
    const ctx = { S, lhdIsObj: (x) => !!x && typeof x === 'object' && !Array.isArray(x) }; vm.createContext(ctx);
    vm.runInContext('S.restore = function ' + src.trim().replace(/^restore/, '').replace(/,\s*$/, '') + ';', ctx);
    return S;
  };
  const ok = mk((m) => Promise.resolve({ tabs: [{ id: 'temiz' }], settings: { season: 'summer' }, walls: [{ switch: 'switch.a', light: 'light.b' }], feed: { x: {} }, revs: { tabs: 4, settings: 2, walls: 2, feed: 10 } }));
  let seen = 0; ok.subs.push(() => seen++);
  await ok.restore({ tabs: [{ id: 'kirli', x: 1 }], settings: { season: 'summer' }, walls: [{ switch: 'switch.a', light: 'light.b', junk: 1 }] });
  assert.deepStrictEqual(clone(ok.sent.revs), { tabs: 3, settings: 0, walls: 1 });
  assert.deepStrictEqual(clone(ok.data.tabs), [{ id: 'temiz' }]);
  assert.deepStrictEqual(clone(ok.revs), { tabs: 4, settings: 2, walls: 2, feed: 10 });
  assert.strictEqual(ok.ssn, 'summer'); assert.strictEqual(seen, 1); assert.strictEqual(ok.pending, 0);
  const no = mk(() => Promise.reject({ code: 'invalid', message: 'pets: x' }));
  await assert.rejects(no.restore({ tabs: [], pets: {} }));
  assert.deepStrictEqual(clone(no.data.tabs), [1]); assert.deepStrictEqual(clone(no.revs), { tabs: 3, walls: 1, feed: 9 }); assert.strictEqual(no.pending, 0); assert.strictEqual(no.pk.tabs, 0);
  const cf = mk(() => Promise.reject({ code: 'conflict' }));
  await assert.rejects(cf.restore({ tabs: [] })); assert.strictEqual(cf.refreshed, 1);
});

test('sunucu: restore komutu kayıtlı, ws_set ile aynı denetim (_check)', () => {
  assert.ok(/for handler in \(ws_get, ws_set, ws_restore,/.test(py));
  assert.ok(/def ws_set[\s\S]*?value = _check\(key, value\)/.test(py));
  assert.ok(/def ws_restore[\s\S]*?out\[key\] = _check\(key, vals\[key\]\)[\s\S]*?if errs:[\s\S]*?return[\s\S]*?data\.data\.update\(out\)/.test(py), 'önce hepsi denetlenir, sonra yazılır');
});

test('telefonda pencere kaydırılmış sayfada da ekranda (.narrowv > .ov sabit)', () => {
  assert.ok(/\.narrowv > \.ov \{ position: fixed; \}/.test(css));
});

// gerçek STORE (src/store.js) + gerçek _bkWrite, ws_get / ws_set gibi davranan sahte sunucuyla (sayaçlar, conflict; değişiklik
// mesajı komutun cevabından önce gider). Anahtar anahtar yolda biri çakışırsa STORE.set hemen güncel veriyi ister: o cevap geri
// almadan önceki yarım hâldir. Geri almadan sonra bir kez daha okunmazsa ekranda yedeğin sekmeleri kalır, sunucuda eskileri.
test('anahtar anahtar yol, arada başka ekran kaydetti (conflict): geri almadan sonra ekran sunucudaki hâlde', async () => {
  const home = Object.assign({}, clone(FRESH), { tabs: [{ id: 'ev', name: 'Ev', sections: [] }], settings: { a: 1 }, estimates: { modem: { name: 'Modem', kind: 'fixed', w: 9 } }, feed: {} });
  const SV = { data: clone(home), revs: {}, subs: [] };
  const view = () => Object.assign(clone(SV.data), { revs: Object.assign({}, SV.revs) });
  let other = true;
  const conn = {
    sendMessagePromise: (m) => new Promise((res, rej) => setTimeout(() => {
      const ty = m.type.split('/')[1];
      if (ty === 'get') return res(view());
      if (ty === 'info') return res({ version: '0.36.0b4' });
      if (ty !== 'set') return rej({ code: 'unknown_command', message: 'Unknown command.' });   // restore: eski entegrasyon
      if (m.key === 'estimates' && other) { other = false; SV.data.estimates = { baska: { name: 'X', kind: 'fixed', w: 1 } }; SV.revs.estimates = (SV.revs.estimates || 0) + 1; }   // öteki ekranın kaydı (mesajı henüz yolda)
      if ('rev' in m && m.rev !== (SV.revs[m.key] || 0)) return rej({ code: 'conflict', message: m.key + ' was changed elsewhere' });
      SV.data[m.key] = clone(m.value); SV.revs[m.key] = (SV.revs[m.key] || 0) + 1;
      SV.subs.forEach((cb) => cb({ __part: { [m.key]: clone(m.value) }, revs: Object.assign({}, SV.revs) }));
      res(view());
    }, 1)),
    subscribeMessage: (cb) => { SV.subs.push(cb); return Promise.resolve(() => {}); }
  };
  const ctx = { window: {}, console, setTimeout, setInterval: () => 0, lhdClone: clone, PANEL_VERSION: '0.36.0b4', document: { body: { appendChild() {} }, createElement: () => ({ setAttribute() {}, appendChild() {}, addEventListener() {}, remove() {} }) } };
  vm.createContext(ctx);
  vm.runInContext(safe + '\n' + store.split('// Panonun ayarları')[0] + '\n' + between(adm, 'const LHD_BK_KEYS', 'const LHD_REPO') + '\nthis.STORE = STORE; this.prep = lhdBkPrep;', ctx);
  vm.runInContext('this._bkWrite = ' + method('_bkWrite') + ';', ctx);
  await ctx.STORE.load({ connection: conn });
  const V = ctx.prep(Object.assign({}, clone(FRESH), { tabs: [{ id: 'yedek', name: 'Yedek', sections: [] }], settings: { b: 2 }, estimates: { tv: { name: 'TV', kind: 'fixed', w: 80 } } })).V;
  const prev = {}; KEYS.forEach((k) => { prev[k] = clone(ctx.STORE.data[k]); });
  let err = null; try { await ctx._bkWrite(V, KEYS, prev, false); } catch (e) { err = e; }
  await new Promise((r) => setTimeout(r, 30));
  assert.strictEqual(err && err.code, 'conflict');
  assert.strictEqual(SV.data.tabs[0].id, 'ev', 'sunucuda geri alındı');
  assert.deepStrictEqual(Object.keys(SV.data.estimates), ['baska'], 'öteki ekranın kaydı duruyor');
  KEYS.forEach((k) => assert.deepStrictEqual(clone(ctx.STORE.data[k]), SV.data[k], k + ': ekran = sunucu'));
  KEYS.forEach((k) => assert.strictEqual(ctx.STORE.revs[k] || 0, SV.revs[k] || 0, k + ' sayacı'));
});
