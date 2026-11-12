// Yönetim paneli akışları (v0.36.0b3 hata avı, "flows"): serbest ızgaranın sütun sayısı, ızgara <-> sütun geçişi, telefon sırası,
// yedekten geri yüklemenin geri alınması, Stil seç ile telefona özel zemin, hayvan adı sınırı, Geri tuşu, sayı alanı sınırları.
// Çalıştır: node --test tests/frontend_flows.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const card = rd('panel-card.js'), adm = rd('admin.js'), defs = rd('defaults.js');
const fnSrc = (src, head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
// sınıf yöntemi: "  _ad(...) {" ile başlayıp ilk "\n  }\n" ile biten parça, function olarak
const method = (head) => { const a = adm.indexOf('  ' + head + '('); assert.ok(a >= 0, head); const b = adm.indexOf('\n  }\n', a); return 'function ' + adm.slice(a + 2 + head.length, b + 4); };
const clone = (x) => JSON.parse(JSON.stringify(x));

test('ızgaranın sütun sayısı kartın o anki boyutundan; boyut değişince _gStale yeniden çizim ister', () => {
  const ctx = { window: { innerHeight: 800 }, getComputedStyle: (el) => ({ getPropertyValue: () => el.lh }) };
  vm.createContext(ctx);
  vm.runInContext(fnSrc(card, 'function lpGridC(') + '\nthis.C = lpGridC;', ctx);
  const a = card.indexOf('  _gStale() {'); assert.ok(a >= 0);
  vm.runInContext('this.stale = function () ' + card.slice(a + 12, card.indexOf('\n', a)).replace(/^\s*/, ''), ctx);
  const el = { offsetWidth: 1720, lh: '1075px', isConnected: true };
  assert.strictEqual(ctx.C(el, {}), 12);
  assert.strictEqual(ctx.C({ offsetWidth: 1280, lh: '2049px' }, {}), 6);
  assert.strictEqual(ctx.C({ offsetWidth: 1720, lh: '1075px' }, { _gn: 6 }), 6);
  // önizleme kartı kutu boyutlanmadan (950 px genişlikte) çizildi: 6 sütun; kutu 1720 olunca bayat
  const host = Object.assign({ _gTab: { layout: 'grid' }, _gC: 6 }, el);
  assert.strictEqual(ctx.stale.call(host), true);
  host._gC = 12; assert.strictEqual(ctx.stale.call(host), false);
  host._gTab = null; host._gC = 6; assert.strictEqual(ctx.stale.call(host), false, 'ızgarasız sekme');
  assert.ok(/else if \(card && !ph && card\._gStale && card\._gStale\(\)\)/.test(adm), 'önizleme _fit boyutlandırdıktan sonra bakar');
  assert.ok(/p !== this\._phone \|\| this\._gStale\(\)/.test(card), 'pano döndürülünce de');
});

test('telefon sırası: ızgarada yeri olmayan (yeni) bölüm tablette olduğu gibi en sonda', () => {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fnSrc(defs, 'function lhdOrderBy(') + '\n' + fnSrc(defs, 'function lhdPhoneOrder(') + '\nthis.O = lhdPhoneOrder;', ctx);
  const T = { layout: 'grid', sections: [{ id: 'a', g: { x: 0, y: 0, w: 7, h: 12 } }, { id: 'yeni' }, { id: 'b', g: { x: 7, y: 0, w: 2, h: 12 } }, { id: 'c', g: { x: 0, y: 12, w: 12, h: 4 } }] };
  assert.deepStrictEqual(ctx.O(T, null).map((s) => s.id), ['a', 'b', 'c', 'yeni']);
  assert.ok(/const gy = \(x\) => \{ const g = x\.s\.g \|\| \{\}; return g\.y === undefined \? 999/.test(card), 'panodaki telefon sırası da');
});

test('Serbest ızgaraya dönüş kayıtlı yerleri korur; ızgaralı sekmede "Alandan yeniden doldur" sütunlardan yerleştirir', () => {
  assert.ok(adm.indexOf("if (act === 'laygrid') return editTab((T) => { if (!(T.sections || []).some((x) => x.g)) lpGridFromCols(T);") >= 0);
  assert.ok(/if \(T\.layout === 'grid'\) \{ lpGridFromCols\(T\); delete T\.gm_own; \}/.test(adm));
});

test('yedekten geri yükleme: geri al hayvanları, profilleri ve tahminleri de geri getirir; ileri al yeniden uygular', () => {
  const ctx = { STORE: { data: {} }, lhdClone: clone, lhdIsObj: (x) => !!x && typeof x === 'object' && !Array.isArray(x), lhdCleanTabs: (x) => clone(x), lhdCleanPets: (x) => clone(x) };
  vm.createContext(ctx);
  ['_snap', '_histCur', '_undoIt', '_redoIt', '_histApply', '_backupApply'].forEach((m) => vm.runInContext('this.' + m + ' = ' + method(m) + ';', ctx));
  const S0 = { tabs: [{ id: 'ev', sections: [] }], settings: { a: 1 }, pets: { kedi: { name: 'Pamuk' }, kopek: { name: 'Karabaş' } }, estimates: { 'switch.kettle': { w: 2000 } }, profiles: { p: 1 } };
  ctx.STORE.data = clone(S0);
  const h = { _undo: [], _redo: [], _tab: 'ev', _settings: () => ctx.STORE.data.settings || {}, _commit: (k, v) => { ctx.STORE.data = Object.assign({}, ctx.STORE.data, { [k]: v }); }, _render: () => {}, _toast: () => {}, _t: (k) => k };
  ['_snap', '_histCur', '_undoIt', '_redoIt', '_histApply', '_backupApply'].forEach((m) => { h[m] = ctx[m]; });
  h._bk = { data: { tabs: [{ id: 'eski', sections: [] }], settings: {}, profiles: {}, pets: { kedi: { name: 'Pamuk' } }, estimates: { 'switch.kettle': { w: 100 } } } };
  h._backupApply();
  assert.deepStrictEqual(Object.keys(ctx.STORE.data.pets), ['kedi']);
  h._undoIt();
  for (const k of ['tabs', 'settings', 'pets', 'estimates', 'profiles']) assert.deepStrictEqual(clone(ctx.STORE.data[k]), S0[k], k);
  h._redoIt();
  assert.deepStrictEqual(ctx.STORE.data.estimates, { 'switch.kettle': { w: 100 } });
  h._undoIt();
  assert.deepStrictEqual(ctx.STORE.data.pets, S0.pets);
  // sıradan değişiklik (more yok) eskisi gibi
  h._snap(); ctx.STORE.data = Object.assign({}, ctx.STORE.data, { tabs: [] }); h._undoIt();
  assert.deepStrictEqual(ctx.STORE.data.tabs, S0.tabs);
});

test('Stil seç: değiştirilen zemin / iklim görünümü telefona özel eski seçimin yerine geçer, dokunulmayan kalır', () => {
  const ctx = { lhdIsObj: (x) => !!x && typeof x === 'object' && !Array.isArray(x) }; vm.createContext(ctx);
  vm.runInContext('this.f = ' + method('_akPhStyle') + ';', ctx);
  const host = (K) => ({ _ak: K, _akBgSel: (k) => (k ? { mode: 'fx', fx: k } : null) });
  const s = { phone: { nav: 'top', style: { bg: { mode: 'black' }, background: '#000', climate_style: 'rows', icon_style: 'mono' } } };
  const a = clone(s); ctx.f.call(host({ bg: 'ocean', bg0: 'zen', clim: 'rows', clim0: 'rows' }), a);
  assert.deepStrictEqual(clone(a.phone.style), { climate_style: 'rows', icon_style: 'mono' });
  const b = clone(s); ctx.f.call(host({ bg: 'zen', bg0: 'zen', clim: 'halo', clim0: 'rows' }), b);
  assert.deepStrictEqual(Object.keys(b.phone.style).sort(), ['background', 'bg', 'icon_style']);
  const c = { phone: { style: { bg: { mode: 'black' } } } }; ctx.f.call(host({ bg: 'ocean', bg0: 'zen', clim: 'halo', clim0: 'halo' }), c);
  assert.deepStrictEqual(clone(c.phone), {}, 'boş kalan telefon stili silinir');
  assert.strictEqual(s.phone.style.bg.mode, 'black', 'ayarın kendisine dokunulmaz (kopya)');
});

test('hayvan: ad en çok 60 karakter (emoji bölünmez), uygun olmayan simge kaydedilmez', () => {
  const pets = {};
  const ctx = { STORE: { data: { pets: {} } }, lhdKind: () => 'pet', lhdClone: clone, lhdIsObj: (x) => !!x && typeof x === 'object' && !Array.isArray(x), lhdSafeFeederSvc: () => true, LHD_FEEDER_DOMAINS: [], LHD_TWIN_DOMAINS: [], lhdItemKey: () => '' };
  vm.createContext(ctx);
  const sl = adm.indexOf('const lhdSlug = '); vm.runInContext(adm.slice(sl, adm.indexOf(';\n', sl) + 2).replace('const lhdSlug', 'this.lhdSlug'), ctx);
  vm.runInContext('this.f = ' + method('_imSave') + '; this.g = ' + method('_imBuild') + ';', ctx);
  const run = (f) => { const h = { _imBuild: ctx.g, _imPut: () => {}, _im: { f: Object.assign({ pKind: 'cat', pMode: 'interval', pEvery: '12', pSoon: '60', pGrace: '30', pTimes: '' }, f), raw: { pet: '' }, isNew: true }, _t: (k) => k, _render: () => {}, _commit: (k, v) => { pets[k] = v; }, _edit: () => {}, _work: () => [], _hass: { states: {} } }; ctx.f.call(h); return pets.pets; };
  const P = run({ pName: 'Pamuk 😀'.repeat(10), pIcon: 'MDI:Cat' });
  const p = P[Object.keys(P)[0]];
  assert.strictEqual(Array.from(p.name).length, 60);
  assert.ok(!/[\ud800-\udbff]$/.test(p.name), 'yarım emoji yok');
  assert.strictEqual(p.icon, undefined);
  const Q = run({ pName: 'Boncuk', pIcon: 'mdi:cat' }); assert.strictEqual(Q.boncuk.icon, 'mdi:cat');
});

test('Geri tuşu Esc ile aynı: yalnız üstteki katman kapanır', () => {
  assert.ok(/this\._pop = \(\) => \{ if \(this\._hp\) \{ this\._hp = false; this\._hpNav = true; this\._esc\(\); \} \};/.test(adm));
});

test('Ayarlar: kanvas ve oda düğmesi ölçüsü alanın min / max sınırına çekilir (enerji alanları hariç)', () => {
  assert.ok(/if \(!en && v !== null && el\.type === 'number' && el\.min !== '' && el\.max !== ''\) \{ const v2 = Math\.min\(\+el\.max, Math\.max\(\+el\.min, v\)\);/.test(adm));
  ['nav.w', 'nav.h', 'canvas.width', 'canvas.ref_height'].forEach((k) => assert.ok(new RegExp('min="\\d+" max="\\d+" data-sf="' + k.replace('.', '\\.') + '"').test(adm), k));
});
