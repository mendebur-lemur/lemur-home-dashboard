// v0.36.0b4 yönetim paneli hata avı düzeltmeleri: Çalışıyor / Bitti ayarları (src/cycle.js), cihaz formunun kaydı, öğe penceresinde
// Halo görünümü, + Sekme'de az önce oluşturulan alan (src/admin.js).
// Çalıştır: node --test tests/frontend_adminfix036b4.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '../src/cycle.js'), 'utf8');
const adm = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const clone = (x) => JSON.parse(JSON.stringify(x));
const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// sınıf yöntemi: "  _ad(...) {" ile başlayıp ilk "\n  }\n" ile biten parça, function olarak
const method = (head) => { let a = adm.indexOf('\n  ' + head + '('), pre = 'function '; if (a < 0) { a = adm.indexOf('\n  async ' + head + '('); pre = 'async function '; assert.ok(a >= 0, head); a += 6; } const b = adm.indexOf('\n  }\n', a); return pre + adm.slice(a + 3 + head.length, b + 4); };
// tek satırlık yöntem
const method1 = (head) => { const a = adm.indexOf('\n  ' + head + '('); assert.ok(a >= 0, head); return 'function ' + adm.slice(a + 3 + head.length, adm.indexOf('\n', a + 1)); };
const lineWith = (re) => { const L = adm.split('\n').filter((x) => re.test(x)); assert.strictEqual(L.length, 1, String(re)); return L[0]; };

function load() {
  const ctx = {
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    lhdIsObj: isObj, lpEnNum: (v, d, lang) => { const s = Number(v).toFixed(d); return lang === 'tr' ? s.replace('.', ',') : s; },
    lpAmPm: () => false, pickLang: () => 'tr', LP_EN: { m: null, busy: false }, console: console
  };
  vm.createContext(ctx);
  vm.runInContext(SRC + '\n;this.X = { lpCyDraft, lpCyRec, lpCyBad, lpCyEdHtml, lpCyClick, lpCyInput };', ctx);
  return ctx.X;
}
// yönetim panelinin küçük taklidi (cihaz düzenleyici açık)
function panel(X, est, o) {
  o = o || {};
  const A = {
    _lang: 'tr', tabs: o.tabs || [{ id: 'ev', name: 'Ev', sections: [{ id: 's1', title: 'IŞIKLAR', entities: ['light.a'] }, { id: 's2', title: 'DİĞER', entities: [] }] }],
    toasts: [], renders: 0, _enErr: '',
    _hass: { states: Object.assign({ 'sensor.lhd_bul_cycle': { state: 'idle', attributes: { lhd_cycle: true, baseline_w: 2 } }, 'notify.pixel': { state: 'unknown', attributes: { friendly_name: 'Pixel' } } }, o.states || {}), services: {} },
    _adv: () => o.adv !== false, _enEsts: () => ({ bul: est }), _ename: (x) => x, _render() { A.renders++; }, _toast(x, u) { A.toasts.push(x); },
    _work: () => clone(A.tabs), _edit(fn, msg) { const T = clone(A.tabs); fn(T); A.tabs = T; A.toasts.push(msg); }
  };
  A._enE = { id: 'bul', f: Object.assign({}, est, { cy: X.lpCyDraft(est) }) };
  return A;
}
const g = (sel, val) => (q) => (q === sel ? { getAttribute: () => val } : null);
const EST = { name: 'Bulaşık makinesi', kind: 'meas', sensor: 'sensor.bul_power', cycle: { on: true, kind: 'dishwasher' } };

test('sınır dışı eşik hiç kaydedilmez (takip kapalıyken de): entegrasyon bütün cihaz kaydını geri çevirmesin', () => {
  const X = load();
  const d = X.lpCyDraft(EST);
  d.v.end_w = '0'; d.v.start_w = '9999'; d.v.end_min = '12'; d.on = false;
  assert.strictEqual(X.lpCyBad(d, 'tr'), '', 'takip kapalı: uyarı yok');
  assert.deepStrictEqual(clone(X.lpCyRec(d)), { on: false, kind: 'dishwasher', end_min: 12 });
  d.clear_h = '500'; d.n.remind_h = '99'; d.n.on = true;
  assert.deepStrictEqual(clone(X.lpCyRec(d)), { on: false, kind: 'dishwasher', end_min: 12, notify: { on: true, targets: [] } });
  // takip açıkken yanlış sayı eskisi gibi adıyla söylenir; sınırın kendisi geçerli
  d.on = true; d.clear_h = ''; d.n.remind_h = ''; d.n.on = false;
  assert.ok(/Başlama \(W üstü\)/.test(X.lpCyBad(d, 'tr')));
  d.v.end_w = '0,5'; d.v.start_w = '5000';
  assert.strictEqual(X.lpCyBad(d, 'tr'), '');
  assert.deepStrictEqual(clone(X.lpCyRec(d)), { on: true, kind: 'dishwasher', start_w: 5000, end_w: 0.5, end_min: 12 });
});

test('geri çevrilen cihaz kaydı "Kaydedildi" demez: form açık kalır, hata yazılır, ekrandaki veri sunucudakine döner', async () => {
  const mk = (refuse) => {
    const E0 = { bul: clone(EST) };
    const ctx = { STORE: { data: { estimates: E0, tabs: [] }, subs: [], refreshed: 0 }, lhdClone: clone, lhdIsObj: isObj, LP_EN: {}, lpEnEnsure: () => {}, lpCyBad: () => '', lpEnMeter: () => '', lpEnSolar: () => ({}), lpEnCfg: () => ({}) };
    ctx.STORE.set = (k, v) => (refuse ? Promise.reject({ code: 'invalid', message: 'value must be at least 0.5' }) : Promise.resolve({}));
    ctx.STORE.refresh = () => { ctx.STORE.refreshed++; return Promise.resolve(ctx.STORE.data); };
    vm.createContext(ctx);
    vm.runInContext('this._enSave = ' + method('_enSave') + '; this._commit = ' + method('_commit') + ';', ctx);
    const rec = { name: 'Bulaşık (yeni ad)', kind: 'meas', sensor: 'sensor.bul_power', cycle: { on: false, kind: 'dishwasher' } };
    const H = { toasts: [], drafts: 0, _undo: [], _redo: [], _modal: 'energy', _enErr: '', _hass: {}, _enE: { id: 'bul', f: { name: rec.name, cat: '' } },
      _t: (k, v) => k + (v && v.e ? ':' + v.e : ''), _toast(x) { H.toasts.push(x); }, _render() {}, _settings: () => ({}),
      _enRec: () => clone(rec), _enEsts: () => (ctx.STORE.data.estimates || {}), _enCats: () => [], _enBadNum: () => '', _enSlug: () => 'x', _enDraft() { H.drafts++; },
      _enSave: ctx._enSave, _commit: ctx._commit };
    return { H: H, ctx: ctx, E0: E0, rec: rec };
  };
  const bad = mk(true), D = bad.H._enE;
  await bad.H._enSave();
  assert.deepStrictEqual(bad.H.toasts, ['err:value must be at least 0.5'], 'yalnız neden; "Kaydedildi" yok');
  assert.strictEqual(bad.H._enErr, 'enERefused');
  assert.strictEqual(bad.H._enE, D, 'form açık, yazılanlar duruyor'); assert.strictEqual(bad.H.drafts, 0);
  assert.strictEqual(bad.H._enBusy, false);
  assert.deepStrictEqual(clone(bad.ctx.STORE.data.estimates), { bul: EST }, 'ekrandaki veri eski hâline döndü');
  assert.strictEqual(bad.ctx.STORE.refreshed, 1, 'sunucudaki hâli yeniden alındı');
  // kabul edilen kayıt eskisi gibi
  const ok = mk(false);
  await ok.H._enSave();
  assert.deepStrictEqual(ok.H.toasts, ['enESaved']); assert.strictEqual(ok.H._enErr, ''); assert.strictEqual(ok.H.drafts, 1);
  assert.deepStrictEqual(clone(ok.ctx.STORE.data.estimates.bul), ok.rec);
  assert.strictEqual(ok.ctx.STORE.refreshed, 0);
  // iki dilde de yazısı var
  assert.strictEqual((adm.match(/enERefused: '/g) || []).length, 2);
});

test('yeniden çizimde odaktaki eşik alanı taslağa yazılır ama Kaydet\'in hata yazısı silinmez', () => {
  const X = load();
  const ln = lineWith(/^    if \(act && act\.hasAttribute.*data-cyv/);
  const A = panel(X, EST); A._enErr = 'Bitiş bekleme (dk): 1,00 ile 120 arasında olmalı';
  const act = { tagName: 'INPUT', value: '500', hasAttribute: (k) => k === 'data-cyv', getAttribute: (k) => (k === 'data-cyv' ? 'end_min' : null) };
  new Function('act', 'lpCyInput', ln).call(A, act, X.lpCyInput);
  assert.strictEqual(A._enE.f.cy.v.end_min, '500');
  assert.ok(A._enErr, 'hata yazısı duruyor');
  // mesaj alanı eskisi gibi taslağa geçer
  const m = { tagName: 'INPUT', value: 'bitti', hasAttribute: (k) => k === 'data-cyd', getAttribute: (k) => (k === 'data-cyd' ? 'msg' : null) };
  new Function('act', 'lpCyInput', ln).call(A, m, X.lpCyInput);
  assert.strictEqual(A._enE.f.cy.n.msg, 'bitti');
});

test('eşik alanları yazı alanı (ondalık klavye): "0,3" 0,3 olarak kaydedilir, yanlış yazı adıyla söylenir', () => {
  const X = load();
  const A = panel(X, EST), h = X.lpCyEdHtml(A, A._enE);
  const inps = h.match(/<input[^>]*data-cyv="[a-z_]+"[^>]*>/g) || [];
  assert.strictEqual(inps.length, 8);
  inps.forEach((x) => { assert.ok(!/type="number"/.test(x), x); assert.ok(/type="text"/.test(x) && /inputmode="decimal"/.test(x), x); });
  const cy = A._enE.f.cy;
  X.lpCyInput(A, { tagName: 'INPUT', value: '0,3', getAttribute: (k) => (k === 'data-cyv' ? 'min_kwh' : null) });
  assert.strictEqual(X.lpCyBad(cy, 'tr'), ''); assert.strictEqual(X.lpCyRec(cy).min_kwh, 0.3);
  ['abc', '1,2,3', '-4', '1e3'].forEach((v) => { cy.v.min_kwh = v; assert.ok(/En az enerji/.test(X.lpCyBad(cy, 'tr')), v); });
});

test('Home Assistant\'ta artık olmayan bildirim hedefi listeden çıkarılabilir', () => {
  const X = load();
  const est = Object.assign({}, EST, { cycle: { on: true, kind: 'dishwasher', notify: { on: true, targets: ['notify.pixel', 'notify.mobile_app_eski_telefon'] } } });
  const A = panel(X, est), h = X.lpCyEdHtml(A, A._enE);
  assert.ok(/<button class="chip on gone" data-cyn="notify\.mobile_app_eski_telefon"/.test(h), 'çıkarma düğmesi');
  assert.ok(/data-cyn="notify\.pixel"/.test(h));
  assert.strictEqual(X.lpCyClick(A, g('[data-cyn]', 'notify.mobile_app_eski_telefon')), true);
  assert.deepStrictEqual(clone(A._enE.f.cy.n.targets), ['notify.pixel']);
  assert.ok(!/eski_telefon/.test(X.lpCyEdHtml(A, A._enE)));
  assert.deepStrictEqual(clone(X.lpCyRec(A._enE.f.cy).notify.targets), ['notify.pixel']);
});

test('durum kartı aynı bölüme ikinci kez eklenmez; başka bölüme eklenir', () => {
  const X = load();
  const A = panel(X, EST), add = () => X.lpCyClick(A, g('[data-cya]', 'card'));
  add(); add();
  const n = (sid) => A.tabs[0].sections.filter((s) => s.id === sid)[0].entities.filter((x) => x && x.entity === 'sensor.lhd_bul_cycle').length;
  assert.strictEqual(n('s1'), 1);
  assert.deepStrictEqual(A.toasts, ['Kart "IŞIKLAR" bölümüne eklendi', 'Kart "IŞIKLAR" bölümünde zaten var']);
  A._enE.f.cy.sec = 's2'; add();
  assert.strictEqual(n('s2'), 1); assert.strictEqual(n('s1'), 1);
  // yalnız kimliğiyle kayıtlı (sade) öğe de sayılır
  const B = panel(X, EST, { tabs: [{ id: 'ev', name: 'Ev', sections: [{ id: 's1', title: 'A', entities: ['sensor.lhd_bul_cycle'] }] }] });
  X.lpCyClick(B, g('[data-cya]', 'card'));
  assert.strictEqual(B.tabs[0].sections[0].entities.length, 1);
});

test('geçmişten öneri, deneme bildirimi ve kart için sekme seçimi formu "kaydedilmedi" yapmaz; gerçek değişiklik yapar', () => {
  const X = load();
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext('this._enSig = ' + method1('_enSig') + '; this._enEClose = ' + method('_enEClose') + ';', ctx);
  const mk = () => { const f = Object.assign({}, EST, { cy: X.lpCyDraft(EST) }); const H = { _enE: { id: 'bul', f: f, f0: JSON.stringify(f) }, _enErr: '', _t: (k) => k, _render() {}, _enSig: ctx._enSig, _enEClose: ctx._enEClose }; return H; };
  let H = mk();
  H._enE.f.cy.sug = { busy: false, res: { days: 10, cycles: [] } }; H._enE.f.cy.test = { ok: true, text: 'x' }; H._enE.f.cy.tab = 'salon'; H._enE.f.cy.sec = 's2';
  H._enEClose(false);
  assert.strictEqual(H._enE, null, 'uyarmadan kapanır'); assert.strictEqual(H._enErr, '');
  H = mk(); H._enE.f.cy.v.end_min = '14';   // "Uygula" ya da elle yazılan eşik
  H._enEClose(false);
  assert.ok(H._enE && H._enE.warned); assert.strictEqual(H._enErr, 'enEDirty');
  H = mk(); H._enE.f.name = 'Başka ad';
  H._enEClose(false);
  assert.ok(H._enE, 'ad değişti: uyarır');
});

test('Basit modda Halo seçeneği: makine durumunda hep var; Halo ile açılan öğede başka görünüme geçince kaybolmaz', () => {
  const ln = lineWith(/^      const lks2 = /);
  const LKS = [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row'], ['halo', 'lk_halo']];
  const run = (raw, look, st) => { const f = new Function('lks', 'adv', 'f', 'M', 'it', 'lhdIsObj', 'lpEnIsVal', 'lpCyIs', ln + '\n return lks2.map((x) => x[0]);');
    return f.call({ _hass: { states: { 'sensor.x': st || { attributes: {} } } } }, LKS, false, { look: look }, { raw: raw }, { entity: 'sensor.x' }, isObj, () => false, (s) => !!(s && s.attributes && s.attributes.lhd_cycle === true)); };
  assert.deepStrictEqual(run({ entity: 'sensor.x', look: 'halo' }, 'row'), ['', 'button', 'row', 'halo'], 'Halo ile açıldı, Satır seçildi');
  assert.deepStrictEqual(run({ entity: 'sensor.x', look: 'row' }, 'row', { attributes: { lhd_cycle: true } }), ['', 'button', 'row', 'halo'], 'makine durumu');
  assert.deepStrictEqual(run('sensor.x', '', { attributes: { lhd_cycle: true } }), ['', 'button', 'row', 'halo']);
  assert.deepStrictEqual(run({ entity: 'sensor.x' }, ''), ['', 'button', 'row'], 'sıradan sensörde Basit modda eskisi gibi yok');
  assert.deepStrictEqual(run('sensor.x', 'row'), ['', 'button', 'row']);
});

test('+ Sekme: az önce buradan oluşturulan alan HA\'nın listesine gelmeden seçilirse hata vermez', () => {
  const ln = lineWith(/^          const ar = this\./);
  const f = new Function('aid', ln + '\n return { name: ar.name, icon: ar.icon || "mdi:door" };');
  const H = { _hass: { areas: { salon: { name: 'Salon' } } }, _arMade: { yatak_odasi: { area_id: 'yatak_odasi', name: 'Yatak Odası', icon: 'mdi:bed' } } };
  H._areas = () => Object.assign({}, H._hass.areas, H._arMade);
  assert.deepStrictEqual(f.call(H, 'yatak_odasi'), { name: 'Yatak Odası', icon: 'mdi:bed' });
  assert.deepStrictEqual(f.call(H, 'salon'), { name: 'Salon', icon: 'mdi:door' });
  assert.deepStrictEqual(f.call(H, 'yok'), { name: 'yok', icon: 'mdi:door' });
});

test('yeni kodda ?. ve ?? yok (ES2017)', () => {
  const strip = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
  [SRC, method('_enSave'), method('_enEClose'), method1('_enSig')].forEach((s) => { assert.ok(!/\?\.[a-zA-Z_(\[]/.test(strip(s))); assert.ok(!/\?\?/.test(strip(s))); });
});
