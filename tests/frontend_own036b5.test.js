// v0.36.0b5: b4'teki "panonun kendi penceresi" ve "Sade satır" düzeltmeleri: basılı tutma bilgisi HA biçimli eylemde de taşınır; enerji
// verisi geç gelirse beklenir (8 sn), dokunuş hiçbir zaman boşa gitmez; sayfadan çıkmış kartta pencere açılmaz; makine kartı sayfa
// açılırken ulaşılamıyorsa gelince yeniden kurulur; Sade satırda duruma göre ad ve simge; kategori gücü kategorinin penceresini açar.
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const panel = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const cycle = fs.readFileSync(path.join(__dirname, '../src/cycle.js'), 'utf8');
const energy = fs.readFileSync(path.join(__dirname, '../src/energy.js'), 'utf8');
const pick = (src, re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };
const KAT = /const lpEnKatCat = [^\n]*\n/, VIRT = /const lpEnIsVirt = [^\n]*\n/, ISVAL = /const lpEnIsVal = [^\n]*\n/;

function actCard() {
  const log = { fired: [], cy: [], en: [] };
  const ctx = { lpFire: (el, ev, d) => log.fired.push(ev + ':' + d.entityId), lpTwinOf: () => null, LP_OPT: { pend: {} }, LemurCardPopup: {}, lhdIsObj: () => true, lhdSafeUrl: () => false,
    lpCyIs: (st) => !!st && !!st.attributes && st.attributes.lhd_cycle === true, lpCyTap: (c, id, hold) => log.cy.push(id + ':' + hold), lpEnValOpen: (c, id) => log.en.push(id) };
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /const LP_NOTOG = [^\n]*\n/) + pick(panel, KAT) + pick(energy, VIRT) + pick(energy, ISVAL) +
    'class X {' + pick(panel, /\n  _own\(id, hold\) \{[\s\S]*?\n  \}\n/) + pick(panel, /\n  _act\(a, id, def, hold\) \{[\s\S]*?\n  \}\n/) + '}; this.X = X;', ctx);
  const x = new ctx.X();
  x._hass = { states: { 'sensor.lhd_bul_cycle': { state: 'done', attributes: { lhd_cycle: true } }, 'sensor.lhd_kat_isik_power': { state: '96', attributes: {} } }, callService: () => Promise.resolve() };
  return { x: x, log: log };
}

test('HA biçimli eylem ({ action: more-info }): basılı tutma bilgisi kaybolmaz (Bitti\'yken Boşaltıldı sayılmaz)', () => {
  const C = actCard();
  C.x._act({ action: 'more-info' }, 'sensor.lhd_bul_cycle', undefined, true);
  C.x._act({ action: 'more-info', entity: 'sensor.lhd_bul_cycle' }, 'light.x', undefined, true);
  C.x._act({ action: 'more-info' }, 'sensor.lhd_bul_cycle', undefined);
  assert.deepStrictEqual(C.log.cy, ['sensor.lhd_bul_cycle:true', 'sensor.lhd_bul_cycle:true', 'sensor.lhd_bul_cycle:false']);
});

test('kategori gücü (sensor.lhd_kat_*_power): panonun kategori penceresi, HA penceresi değil; Halo görünümünde katman', () => {
  const C = actCard();
  C.x._act(undefined, 'sensor.lhd_kat_isik_power', 'more-info');
  assert.deepStrictEqual(C.log.en, ['sensor.lhd_kat_isik_power']); assert.deepStrictEqual(C.log.fired, []);
  assert.strictEqual(C.x._own('sensor.lhd_kat_isik_energy'), false);
  assert.ok(/\(lpCyIs\(h\.states\[it\.entity\]\) \|\| lpEnIsVal\(it\.entity\) \|\| !!lpEnKatCat\(it\.entity\)\)/.test(panel));
});

// lpEnValOpen: sahte model, sekme, zamanlayıcı
function enval(o) {
  const log = { open: [], tab: 0, fired: [], subs: [], timers: [] };
  const ctx = { lpEnGet: () => o.m, lpEnGoTab: () => { if (!o.tab) return false; log.tab++; return true; }, lpFire: (c, ev, d) => log.fired.push(ev + ':' + d.entityId),
    lpEnSub: (fn) => { log.subs.push(fn); return () => { log.subs = log.subs.filter((f) => f !== fn); }; }, setTimeout: (fn, ms) => { log.timers.push([fn, ms]); return 1; } };
  vm.createContext(ctx);
  vm.runInContext(pick(energy, VIRT) + pick(panel, KAT) + pick(panel, /function lpEnValView\(id\) \{[^\n]*\n/) + pick(panel, /function lpEnValOpen\(card, id\) \{[\s\S]*?\n\}\n/) + 'this.V = lpEnValView; this.O = lpEnValOpen;', ctx);
  const c = Object.assign({ _hass: {}, _lang: 'tr', _config: {}, _enOpen: (v) => log.open.push(JSON.stringify(v)) }, o.card || {});
  return { ctx: ctx, c: c, log: log, o: o, timeout: () => log.timers.forEach((x) => x[0]()) };
}

test('enerji verisi gelmediyse 8 sn beklenir; gelince pencere açılır (1,5 sn\'de vazgeçilmez)', () => {
  const E = enval({ m: null, tab: true });
  E.ctx.O(E.c, 'sensor.lhd_ev_power');
  assert.deepStrictEqual(E.log.timers.map((x) => x[1]), [8000]);
  E.o.m = { cats: [], devs: [] }; E.log.subs[0]();
  assert.deepStrictEqual(E.log.open, ['{"k":"cat","id":"__all"}']);
  E.timeout(); assert.strictEqual(E.log.open.length, 1); assert.strictEqual(E.log.tab, 0);
});

test('süre dolunca: Enerji sekmesi; sekme yoksa gerçek sensörde son çare HA penceresi, sanal değerde hiçbir şey', () => {
  let E = enval({ m: null, tab: true }); E.ctx.O(E.c, 'sensor.lhd_ev_power'); E.timeout();
  assert.strictEqual(E.log.tab, 1); assert.deepStrictEqual(E.log.fired, []);
  E = enval({ m: null, tab: false }); E.ctx.O(E.c, 'sensor.lhd_ev_power'); E.timeout();
  assert.deepStrictEqual(E.log.fired, ['hass-more-info:sensor.lhd_ev_power']); assert.strictEqual(E.log.subs.length, 0);
  E = enval({ m: null, tab: false }); E.ctx.O(E.c, 'sensor.lhdx_ay_tl'); E.timeout();
  assert.deepStrictEqual(E.log.fired, []); assert.deepStrictEqual(E.log.open, []);
});

test('önizlemede (demo, düzenleme) sekme değişmez, HA penceresi açılmaz', () => {
  [{ demo: true }, { edit: true }].forEach((cf) => [true, false].forEach((tab) => {
    const E = enval({ m: null, tab: tab, card: { _config: cf } }); E.ctx.O(E.c, 'sensor.lhd_ev_power'); E.timeout();
    assert.strictEqual(E.log.tab, 0); assert.deepStrictEqual(E.log.fired, []);
  }));
  // veri varsa önizlemede de pencere açılır
  const E = enval({ m: { cats: [] }, tab: true, card: { _config: { demo: true } } }); E.ctx.O(E.c, 'sensor.lhd_ev_energy');
  assert.deepStrictEqual(E.log.open, ['{"k":"ana","show":null}']);
});

test('lpEnGoTab: enerji sekmesi varsa gider ve true, yoksa false döner', () => {
  const pushed = [], ctx = { STORE: { data: { tabs: [{ id: 'a', sections: [{ type: 'lights' }] }] } }, location: { pathname: '/pano/a' }, history: { pushState: (s, t, u) => pushed.push(u) }, window: { dispatchEvent: () => {} }, Event: function () {} };
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /function lpEnGoTab\(\) \{[\s\S]*?\n\}\n/) + 'this.G = lpEnGoTab;', ctx);
  assert.strictEqual(ctx.G(), false); assert.deepStrictEqual(pushed, []);
  ctx.STORE.data.tabs.push({ id: 'en', sections: [{ type: 'energy' }] });
  assert.strictEqual(ctx.G(), true); assert.deepStrictEqual(pushed, ['/pano/en']);
});

test('kategori gücü: o kategorinin penceresi; kategori modelde yoksa bütün cihazların listesi', () => {
  const E = enval({ m: { cats: [{ id: 'sensor.lhd_kat_isik_energy' }] }, tab: true });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(E.ctx.V('sensor.lhd_kat_isik_power'))), { k: 'cat', id: 'sensor.lhd_kat_isik_energy' });
  E.ctx.O(E.c, 'sensor.lhd_kat_isik_power'); E.ctx.O(E.c, 'sensor.lhd_kat_silindi_power'); E.ctx.O(E.c, 'sensor.lhd_ev_power');
  assert.deepStrictEqual(E.log.open, ['{"k":"cat","id":"sensor.lhd_kat_isik_energy"}', '{"k":"cat","id":"__all"}', '{"k":"cat","id":"__all"}']);
});

test('sayfadan çıkmış kartta (sekme değişti) geç gelen veri pencere açmaz: enerji değeri, makine kartı, _enOpen', () => {
  // enerji değeri
  const E = enval({ m: null, tab: true }); E.ctx.O(E.c, 'sensor.lhd_ev_power');
  E.c.isConnected = false; E.o.m = { cats: [] }; E.log.subs[0](); E.timeout();
  assert.deepStrictEqual(E.log.open, []); assert.strictEqual(E.log.tab, 0); assert.deepStrictEqual(E.log.fired, []);
  // makine kartı
  const opened = [], fired = [], subs = [], timers = [];
  const ctx = { LP_EN: { m: null, busy: true }, lpEnGet: () => ctx.LP_EN.m, lpEnSub: (fn) => { subs.push(fn); return () => {}; }, lpFire: (c, ev) => fired.push(ev), setTimeout: (fn) => { timers.push(fn); return 0; } };
  vm.createContext(ctx);
  vm.runInContext(pick(cycle, /function lpCyTap\(card, id, hold\) \{[\s\S]*?\n\}\n/) + 'this.T = lpCyTap;', ctx);
  const c = { _lang: 'tr', isConnected: true, _enOpen: (v) => opened.push(v.id), _hass: { states: { 'sensor.c': { state: 'running', attributes: { device: 'bul' } } }, callService: () => {} } };
  ctx.T(c, 'sensor.c');
  c.isConnected = false; ctx.LP_EN.m = { devs: [{ id: 'd1', lid: 'bul' }] }; subs[0](); timers.forEach((f) => f());
  assert.deepStrictEqual(opened, []); assert.deepStrictEqual(fired, []);
  c.isConnected = true; ctx.T(c, 'sensor.c'); assert.deepStrictEqual(opened, ['d1']);   // bağlı kartta eskisi gibi
  // _enOpen: enerji verisine bakmadan döner
  let got = 0; const c2 = { lpEnGet: () => { got++; return null; } };
  vm.createContext(c2);
  vm.runInContext('class X {' + pick(panel, /\n  _enOpen\(V, keep\) \{[\s\S]*?\n  \}\n/) + '}; this.X = X;', c2);
  const x = new c2.X(); x.shadowRoot = {}; x.isConnected = false; x._enOpen({ k: 'cat', id: '__all' });
  assert.strictEqual(got, 0);
  x.isConnected = true; x._enOpen({ k: 'cat', id: '__all' }); assert.strictEqual(got, 1);
});

test('makine durumu imzada: sayfa açılırken ulaşılamayan sensör gelince kart yeniden kurulur', () => {
  const m = pick(panel, /const present = \[\], vis = \[\];[\s\S]*?\n    const sig = /);
  assert.ok(/if \(e && lpCyIs\(S\[e\.entity\]\)\) vis\.push\('cy'\);/.test(m));
  // Halo kartının varlığı yalnız ulaşılamıyorken izlenir (yoksa durum değişince imzaya hiç bakılmaz)
  assert.ok(/if \(!cyS && S\[x\.entity\]\.state === 'unavailable' && visW\.indexOf\(x\.entity\) < 0\) visW\.push\(x\.entity\);/.test(panel));
});

test('Sade stilde satıra dönen Halo değeri: duruma göre ad ve simge; öteki satırlarda eskisi gibi', () => {
  const ctx = { LP_VAL_ONOFF: [], LP_VAL_ON: [], LP_ON: ['on'], lhdIsObj: (v) => !!v && typeof v === 'object' && !Array.isArray(v), lpValText: (h, st) => st.state, t: (l, k) => k, TXT: { tr: {} } };
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /function lpMapStyle\(it, S\) \{[\s\S]*?\n\}\n/) + 'class X {' + pick(panel, /\n  _paintEnt\(el, st\) \{[\s\S]*?\n  \}\n/) + '}; this.X = X;', ctx);
  const run = (item) => {
    const parts = { '.rn': { textContent: '' }, '.rv': { textContent: '' } }, ic = [];
    const el = { _item: item, className: '', classList: { contains: (c) => c === 'vrow' }, style: { setProperty() {}, removeProperty() {} }, querySelector: (s) => parts[s], firstChild: {} };
    const st = { entity_id: 'sensor.m', state: 'done', attributes: { friendly_name: 'Makine' } };
    const x = new ctx.X(); x._hass = { states: { 'sensor.m': st } }; x._lang = 'tr'; x._colorize = () => false; x._icSwap = (e, s, it, i, own) => ic.push(own); x._tx = (s) => s || ''; x._sec2 = () => null;
    x._paintEnt(el, st);
    return [parts['.rn'].textContent, parts['.rv'].textContent, ic[0]];
  };
  const sc = { map: { done: { color: 'green', name: 'Boşalt', icon: 'mdi:check' }, idle: 'grey' } };
  assert.deepStrictEqual(run({ entity: 'sensor.m', name: 'Bulaşık', icon: 'mdi:dishwasher', _val: true, _full: true, state_colors: sc }), ['Boşalt', 'done', 'mdi:check']);
  assert.deepStrictEqual(run({ entity: 'sensor.m', name: 'Bulaşık', icon: 'mdi:dishwasher', _val: true, _full: true }), ['Bulaşık', 'done', 'mdi:dishwasher']);
  assert.deepStrictEqual(run({ entity: 'sensor.m', name: 'Bulaşık', icon: 'mdi:dishwasher', _val: true, state_colors: sc }), ['Bulaşık', 'done', 'mdi:dishwasher']);   // kendi satır görünümü: değişmedi
});

test('yeni kodda ?. ve ?? yok (ES2017)', () => {
  [pick(panel, /function lpEnValOpen\(card, id\) \{[\s\S]*?\n\}\n/), pick(panel, KAT), pick(panel, /\n  _own\(id, hold\) \{[\s\S]*?\n  \}\n/), pick(panel, /\n  _paintEnt\(el, st\) \{[\s\S]*?\n  \}\n/), pick(cycle, /function lpCyTap\(card, id, hold\) \{[\s\S]*?\n\}\n/)]
    .forEach((s) => assert.ok(!/\?\.|\?\?/.test(s.replace(/\/\/.*$/gm, ''))));
});
