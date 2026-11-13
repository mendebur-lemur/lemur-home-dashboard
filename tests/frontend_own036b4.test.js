// v0.36.0b4: panonun kendi penceresi olan değerler HA'nın penceresini açmaz (makine durumu, enerji değerleri); Stil seç'te "Sade"
// seçiliyken Halo görünümlü değer kartı sade satır çizilir; önizlemede seçili kutudaki öğeye tıklamak öğe ayarını açar.
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const panel = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const admin = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const cycle = fs.readFileSync(path.join(__dirname, '../src/cycle.js'), 'utf8');
const energy = fs.readFileSync(path.join(__dirname, '../src/energy.js'), 'utf8');
const pick = (src, re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };

function card(extra) {
  const log = { fired: [], cy: [], en: [], calls: [] };
  const ctx = Object.assign({
    lpFire: (el, ev, d) => log.fired.push(ev + ':' + d.entityId), lpTwinOf: () => null, LP_OPT: { pend: {} }, LemurCardPopup: {}, lhdIsObj: () => true, lhdSafeUrl: () => false,
    lpCyIs: (st) => !!st && !!st.attributes && st.attributes.lhd_cycle === true,
    lpCyTap: (c, id, hold) => log.cy.push(id + ':' + hold), lpEnValOpen: (c, id) => log.en.push(id)
  }, extra || {});
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /const LP_NOTOG = [^\n]*\n/) + pick(energy, /const lpEnIsVirt = [^\n]*\n/) + pick(energy, /const lpEnIsVal = [^\n]*\n/) +
    'class X {' + pick(panel, /\n  _own\(id, hold\) \{[\s\S]*?\n  \}\n/) + pick(panel, /\n  _act\(a, id, def, hold\) \{[\s\S]*?\n  \}\n/) + '}; this.X = X;', ctx);
  const x = new ctx.X();
  x._hass = { states: { 'sensor.lhd_bul_cycle': { state: 'done', attributes: { lhd_cycle: true } }, 'sensor.lhd_ev_power': { state: '400', attributes: {} }, 'sensor.sicaklik': { state: '21', attributes: {} } },
    callService: (d, s, data) => { log.calls.push(d + '.' + s); return Promise.resolve(); } };
  x._optTap = () => {};
  return { x: x, log: log };
}

test('makine durumu ve enerji değeri: dokunuş ve basılı tutuş panonun penceresine gider, HA penceresi açılmaz', () => {
  const C = card(), x = C.x, L = C.log;
  x._act(undefined, 'sensor.lhd_bul_cycle', 'more-info');            // dokun
  x._act(undefined, 'sensor.lhd_bul_cycle', 'more-info', true);      // basılı tut
  x._act('more-info', 'sensor.lhd_ev_power');                         // öğeye elle verilen "cihaz penceresi" de
  x._act(undefined, 'sensor.lhdx_ay_tl', 'more-info');                // sanal değer (HA'da varlığı yok)
  x._act(undefined, 'sensor.lhd_oda_salon_energy', 'more-info', true);
  assert.deepStrictEqual(L.cy, ['sensor.lhd_bul_cycle:false', 'sensor.lhd_bul_cycle:true']);
  assert.deepStrictEqual(L.en, ['sensor.lhd_ev_power', 'sensor.lhdx_ay_tl', 'sensor.lhd_oda_salon_energy']);
  assert.deepStrictEqual(L.fired, []);
  // kendi penceresi olmayan değer: eskisi gibi
  x._act(undefined, 'sensor.sicaklik', 'more-info');
  assert.deepStrictEqual(L.fired, ['hass-more-info:sensor.sicaklik']);
  assert.strictEqual(x._own('sensor.sicaklik'), false);
  assert.strictEqual(x._own(''), false);
});

function enval(model) {
  const log = { open: [], tab: 0, subs: [], timers: [] };
  const ctx = { lpEnGet: () => model.m, lpEnGoTab: () => { log.tab++; }, lpEnSub: (fn) => { log.subs.push(fn); return () => { log.subs = log.subs.filter((f) => f !== fn); }; },
    setTimeout: (fn) => { log.timers.push(fn); return 1; } };
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /function lpEnValView\(id\) \{[^\n]*\n/) + pick(panel, /function lpEnValOpen\(card, id\) \{[\s\S]*?\n\}\n/) + 'this.V = lpEnValView; this.O = lpEnValOpen;', ctx);
  const c = { _hass: {}, _lang: 'tr', _enOpen: (v) => log.open.push(JSON.stringify(v)) };
  return { ctx: ctx, c: c, log: log };
}

test('enerji değeri: anlık güç cihaz listesini, tüketim ve tutar Analiz penceresini açar', () => {
  const E = enval({ m: { devs: [] } });
  ['sensor.lhd_ev_power', 'sensor.lhd_oda_salon_power', 'sensor.lhdx_olcmeyen'].forEach((id) => assert.deepStrictEqual(JSON.parse(JSON.stringify(E.ctx.V(id))), { k: 'cat', id: '__all' }, id));
  ['sensor.lhd_ev_energy', 'sensor.lhdx_bugun_tl', 'sensor.lhdx_ay_kwh', 'sensor.lhd_oda_salon_energy'].forEach((id) => assert.strictEqual(E.ctx.V(id).k, 'ana', id));
  E.ctx.O(E.c, 'sensor.lhd_ev_power');
  assert.deepStrictEqual(E.log.open, ['{"k":"cat","id":"__all"}']);
  assert.strictEqual(E.log.tab, 0);
});

test('enerji verisi henüz yoksa gelince açılır; 1,5 sn içinde gelmezse Enerji sekmesine gidilir, iki kez açılmaz', () => {
  const M = { m: null }, E = enval(M);
  E.ctx.O(E.c, 'sensor.lhd_ev_energy');
  assert.deepStrictEqual(E.log.open, []); assert.strictEqual(E.log.subs.length, 1);
  M.m = { devs: [] }; E.log.subs[0]();                 // veri geldi
  assert.deepStrictEqual(E.log.open, ['{"k":"ana","show":null}']); assert.strictEqual(E.log.subs.length, 0);
  E.log.timers.forEach((f) => f());                    // süre dolunca yeniden açılmaz
  assert.strictEqual(E.log.open.length, 1); assert.strictEqual(E.log.tab, 0);
  const M2 = { m: null }, E2 = enval(M2);
  E2.ctx.O(E2.c, 'sensor.lhd_ev_power');
  E2.log.timers.forEach((f) => f());                   // veri hiç gelmedi
  assert.deepStrictEqual(E2.log.open, []); assert.strictEqual(E2.log.tab, 1); assert.strictEqual(E2.log.subs.length, 0);
});

test('makine kartı: Bitti\'yken dokunmak Boşaltıldı sayar, basılı tutmak saymaz (pencere açar)', () => {
  const calls = [], opened = [];
  const ctx = { LP_EN: { m: { devs: [{ id: 'd1', lid: 'bul' }] }, busy: false }, lpEnGet: () => ctx.LP_EN.m, lpEnSub: () => () => {}, lpFire: () => {}, setTimeout: () => 0, console: console };
  vm.createContext(ctx);
  vm.runInContext(pick(cycle, /function lpCyTap\(card, id, hold\) \{[\s\S]*?\n\}\n/) + 'this.T = lpCyTap;', ctx);
  const c = { _lang: 'tr', _enOpen: (v) => opened.push(v.k + ':' + v.id),
    _hass: { states: { 'sensor.c': { state: 'done', attributes: { emptied_button: 'button.e', device: 'bul' } }, 'button.e': { state: 'unknown' } }, callService: (d, s, data) => calls.push(d + '.' + s + ':' + data.entity_id) } };
  ctx.T(c, 'sensor.c');
  assert.deepStrictEqual(calls, ['button.press:button.e']); assert.deepStrictEqual(opened, []);
  ctx.T(c, 'sensor.c', true);
  assert.deepStrictEqual(calls, ['button.press:button.e']); assert.deepStrictEqual(opened, ['dev:d1']);
});

test('Sade stilde Halo görünümlü değer tam genişlikte sade satır olur; öğenin kayıtlı görünümü değişmez', () => {
  assert.ok(/lk === 'halo' && LP_HALO_DOMAINS\.indexOf\(d0\) >= 0\) return lpClimStyle\(\) === 'rows' \? Object\.assign\(base, \{ _k: 'vrow', _val: true, _full: true \}, it\) : Object\.assign\(base, \{ _k: 'halo' \}, it\);/.test(panel));
  assert.ok(/!g\.full === !x\._full/.test(panel) && /full: !!x\._full/.test(panel));
  assert.ok(/\(phone \|\| g\.full \? 1 : Math\.max\(1, Math\.min\(s\.row_columns \|\| 3, g\.items\.length\)\)\)/.test(panel));
  // kayıt: bodyOf yalnız çizim için kopya üretir (Object.assign(base, ..., it)); it'e yazmaz
  assert.ok(!/it\.look = /.test(pick(panel, /const bodyOf = \(s\) => \{[\s\S]*?\n    \};\n/)));
});

test('Halo kartının üstündeki katman: makine durumu ve enerji değerinde hep var; sade görünümlerde makinenin adı', () => {
  assert.ok(/own = !!it && !it\.card && !!it\.entity && \(lpCyIs\(h\.states\[it\.entity\]\) \|\| lpEnIsVal\(it\.entity\)\)/.test(panel));
  assert.ok(/if \(!it \|\| \(!it\.tap && !it\.hold && !own\)\) return;/.test(panel));
  assert.ok(/lpPress\(ov, \(\) => this\._act\(it\.tap, id, 'more-info'\), \(\) => this\._act\(it\.hold, id, 'more-info', true\)\)/.test(panel));
  assert.strictEqual((panel.match(/\(a\.lhd_cycle === true && a\.device_name\) \|\| a\.friendly_name/g) || []).length, 2);
  // basılı tutuşların hepsi hold bilgisini taşır
  assert.ok(!/this\._act\(it\.hold, id\)/.test(panel) && !/this\._act\(it\.hold, id, 'more-info'\)/.test(panel));
});

test('önizleme: seçili kutudaki öğeye tıklamak öğe ayarını açar; telefon ve kategori önizlemesinde açmaz', () => {
  assert.ok(/hit\.hasAttribute\('data-idx'\) && !tab\._ph && !tab\._cvs && sid && sid === this\._config\.selected\) return lpFire\(this, 'lhd-item', \{ section: sid, idx: \+hit\.getAttribute\('data-idx'\) \}\);\n\s+lpFire\(this, 'lhd-select'/.test(panel));
  assert.ok(/addEventListener\('lhd-item', \(e\) => \{ const sc = this\._curSec\(this\._curTab\(this\._work\(\)\)\), L = \(sc && sc\.entities\) \|\| \[\], i = e\.detail\.idx; if \(sc && sc\.id === e\.detail\.section && L\[i\] !== undefined\) this\._imOpen\(i, L\[i\], false\); \}\)/.test(admin));
});

test('yeni kodda ?. ve ?? yok (ES2017)', () => {
  [pick(panel, /function lpEnValOpen\(card, id\) \{[\s\S]*?\n\}\n/), pick(panel, /\n  _own\(id, hold\) \{[\s\S]*?\n  \}\n/)].forEach((s) => assert.ok(!/\?\.|\?\?/.test(s)));
});
