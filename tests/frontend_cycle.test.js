// Çalışıyor / Bitti takibi (src/cycle.js): cihaz düzenleyicide cycle bloğunun kaydı ve okunması, hazır Halo görünümü,
// kartın yazısı, Halo kartına verilen hass, dokunma (Bitti'yken tek servis çağrısı).
// Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '../src/cycle.js'), 'utf8');
const A = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
function load(extra) {
  const ctx = Object.assign({
    esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
    lhdIsObj: (x) => !!x && typeof x === 'object' && !Array.isArray(x),
    lpEnNum: (v, d, lang) => { const s = Number(v).toFixed(d); return lang === 'tr' ? s.replace('.', ',') : s; },
    lpExStat: (b, s) => '<div class="exst"><b>' + b + '</b><span>' + s + '</span></div>',
    lpExK: (k) => String(k), lpEnMoney: (h, v) => '₺' + v,
    lpAmPm: (h) => !!(h && h.locale && h.locale.time_format === '12'),
    pickLang: () => 'tr', LP_EN: { m: null, busy: false }, console: console, Date: Date, JSON: JSON, Math: Math, Object: Object
  }, extra || {});
  vm.createContext(ctx);
  vm.runInContext(SRC + '\n;this.X = { lpCyDraft, lpCyRec, lpCyBad, lpCyItem, lpCyLabel, lpCyHass, lpCyTap, lpCyClick, lpCyInput, lpCyTargets, lpCyDevHtml, LP_CY_PRE };', ctx);
  return ctx.X;
}

test('a stored cycle block comes back the same after the editor (draft → record)', () => {
  const X = load();
  const stored = { on: true, kind: 'washer', end_min: 12, start_w: 40, tail: true, door: 'binary_sensor.kapi', clear_h: 4,
    notify: { on: true, targets: ['notify.mobile_app_pixel', 'notify.telefon'], msg: '{name} bitti', remind_h: 2 } };
  const d = X.lpCyDraft({ kind: 'meas', sensor: 'sensor.p', cycle: stored });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(X.lpCyRec(d))), stored);
  // a value equal to the preset is not stored; an empty field means the preset
  d.v.end_min = '10'; d.v.start_w = ''; d.tail = false;
  const r = X.lpCyRec(d);
  assert.ok(!('end_min' in r) && !('start_w' in r) && !('tail' in r));
  // never switched on: nothing is stored; switched off later: the block stays with on: false (the choices are kept)
  assert.strictEqual(X.lpCyRec(X.lpCyDraft({ kind: 'meas' })), null);
  const off = X.lpCyDraft({ kind: 'meas', cycle: { on: true, kind: 'dryer' } }); off.on = false;
  assert.deepStrictEqual(JSON.parse(JSON.stringify(X.lpCyRec(off))), { on: false, kind: 'dryer' });
  // Turkish decimal comma
  const c = X.lpCyDraft({ kind: 'meas', cycle: { on: true, kind: 'dishwasher' } }); c.v.min_kwh = '0,3';
  assert.strictEqual(X.lpCyRec(c).min_kwh, 0.3);
});

test('wrong numbers are named, in the same limits as the server schema', () => {
  const X = load();
  const d = X.lpCyDraft({ kind: 'meas', cycle: { on: true, kind: 'dishwasher' } });
  assert.strictEqual(X.lpCyBad(d, 'tr'), '');
  d.v.end_min = '500'; assert.ok(/Bitiş bekleme/.test(X.lpCyBad(d, 'tr')));
  d.v.end_min = 'abc'; assert.ok(X.lpCyBad(d, 'tr'));
  d.v.end_min = ''; d.n.remind_h = '99'; assert.ok(/hatırlat/i.test(X.lpCyBad(d, 'tr')));
  d.on = false; assert.strictEqual(X.lpCyBad(d, 'tr'), '');
  // the presets are the same as cycle.py's
  const py = fs.readFileSync(path.join(__dirname, '../custom_components/lemur_home_dashboard/cycle.py'), 'utf8');
  Object.keys(X.LP_CY_PRE).forEach((k) => {
    const m = new RegExp('"' + k + '":\\s*\\{([^}]*)\\}').exec(py); assert.ok(m, k);
    const P = X.LP_CY_PRE[k];
    Object.keys(P).forEach((f) => { const v = new RegExp('"' + f + '":\\s*([\\w.]+)').exec(m[1])[1]; assert.strictEqual(String(P[f]), v === 'True' ? 'true' : v === 'False' ? 'false' : String(+v), k + '.' + f); });
  });
});

test('the editor saves the cycle block of a measured device (admin _enDraft / _enRec)', () => {
  const X = load();
  function method(name) {
    const i = A.indexOf('\n  ' + name + '(');
    const open = A.indexOf('{', A.indexOf(')', i));
    let d = 0, j = open;
    for (; j < A.length; j++) { if (A[j] === '{') d++; else if (A[j] === '}') { d--; if (!d) break; } }
    return A.slice(i + 3, j + 1);
  }
  const body = ['_enStripK', '_enRec', '_lrnScale', '_lrnSpan', '_enDraft'].map(method).join('\n');
  const Cls = new Function('lpEnNumOf', 'lhdClone', 'lpCyDraft', 'lpCyRec', 'return class { ' + body + ' }')((v) => { const x = parseFloat(v); return isFinite(x) ? x : 0; }, (x) => JSON.parse(JSON.stringify(x)), X.lpCyDraft, X.lpCyRec);
  const E = { bul: { name: 'Bulaşık makinesi', kind: 'meas', sensor: 'sensor.bul_power', cycle: { on: true, kind: 'dishwasher', notify: { on: true, targets: ['notify.x'] } } } };
  const o = new Cls(); o._enEsts = () => E; o._enDraft('bul');
  const rec = o._enRec(o._enE.f);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(rec.cycle)), E.bul.cycle);
  o._enE.f.cy.on = false;
  assert.strictEqual(o._enRec(o._enE.f).cycle.on, false);
  // another kind (not measured): no cycle block
  o._enE.f.kind = 'fixed';
  assert.ok(!('cycle' in o._enRec(o._enE.f)));
});

test('clicks: another kind resets the thresholds; targets toggle; the card goes into the chosen section with the halo preset', () => {
  const X = load();
  let rendered = 0, edited = null, msg = '';
  const tabs = [{ id: 'ev', name: 'Ev', sections: [{ id: 'a', title: 'Mutfak', entities: ['light.x'] }, { id: 'b', title: 'Salon', entities: [] }] }];
  const Adm = { _lang: 'tr', _enE: { id: 'bul', f: { name: 'B', sensor: 'sensor.p', cy: X.lpCyDraft({ cycle: { on: true, kind: 'dishwasher', end_min: 12 } }) } },
    _render: () => { rendered++; }, _work: () => JSON.parse(JSON.stringify(tabs)), _edit: (fn, m) => { const T = JSON.parse(JSON.stringify(tabs)); fn(T); edited = T; msg = m; } };
  const el = (attr, v) => ({ getAttribute: (k) => (k === attr ? v : null) });
  const g = (o) => (sel) => (o[sel] || null);
  assert.ok(X.lpCyClick(Adm, g({ '[data-cyk]': el('data-cyk', 'washer') })));
  assert.strictEqual(Adm._enE.f.cy.kind, 'washer'); assert.strictEqual(Adm._enE.f.cy.v.end_min, '');
  X.lpCyClick(Adm, g({ '[data-cyn]': el('data-cyn', 'notify.tel') }));
  assert.deepStrictEqual(Array.from(Adm._enE.f.cy.n.targets), ['notify.tel']);
  X.lpCyClick(Adm, g({ '[data-cyn]': el('data-cyn', 'notify.tel') }));
  assert.strictEqual(Adm._enE.f.cy.n.targets.length, 0);
  // section select, then Add
  X.lpCyInput(Adm, { tagName: 'SELECT', value: 'b', getAttribute: (k) => (k === 'data-cyd' ? 'sec' : null) });
  X.lpCyClick(Adm, g({ '[data-cya]': el('data-cya', 'card') }));
  const it = edited[0].sections[1].entities[0];
  assert.strictEqual(it.entity, 'sensor.lhd_bul_cycle'); assert.strictEqual(it.look, 'halo'); assert.ok(/Salon/.test(msg));
  assert.ok(rendered > 0);
});

test('the ready-made halo look: calm grey idle, blue breathing while running, green frame when finished', () => {
  const X = load();
  const it = X.lpCyItem('sensor.lhd_bul_cycle'), m = it.state_colors.map;
  assert.deepStrictEqual(JSON.parse(JSON.stringify(m)), { idle: { color: 'grey', effect: 'still' }, running: { color: 'blue', effect: 'breathe' }, done: { color: 'green', effect: 'breathe', frame: true } });
  assert.ok(!it.tap && !it.hold);   // the tap is the card's own (Emptied while finished), the hold its window
});

const st = (state, a) => ({ entity_id: 'sensor.lhd_bul_cycle', state: state, attributes: Object.assign({ lhd_cycle: true, kind: 'dishwasher', device: 'bul', emptied_button: 'button.lhd_bul_emptied' }, a || {}) });

test('the card text: elapsed time, drying, the finish time in 24 hours', () => {
  const X = load();
  assert.strictEqual(X.lpCyLabel({}, st('idle'), 'tr'), 'Boş');
  assert.strictEqual(X.lpCyLabel({}, st('running', { elapsed: 32 }), 'tr'), 'Çalışıyor · 32 dk');
  assert.strictEqual(X.lpCyLabel({}, st('running', { elapsed: 72, phase: 'tail' }), 'tr'), 'Kurutuyor · 1 sa 12 dk');
  assert.strictEqual(X.lpCyLabel({}, st('running', { elapsed: 5 }), 'en'), 'Running · 5 min');
  const d = new Date(); d.setHours(14, 5, 0, 0);
  if (d.getTime() > Date.now()) d.setTime(Date.now() - 60000);
  const hm = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  assert.strictEqual(X.lpCyLabel({}, st('done', { finished: d.toISOString() }), 'tr'), 'Bitti · ' + hm);
  assert.ok(/AM|PM/.test(X.lpCyLabel({ locale: { time_format: '12' } }, st('done', { finished: d.toISOString() }), 'en')));
  const y = new Date(Date.now() - 86400000);
  assert.ok(/^Bitti · dün \d\d:\d\d$/.test(X.lpCyLabel({}, st('done', { finished: y.toISOString() }), 'tr')));
  assert.strictEqual(X.lpCyLabel({}, { state: 'unavailable', attributes: { lhd_cycle: true } }, 'tr'), null);
});

test('the halo card gets the text as the value; everything else is the real hass, the same object while nothing changed', () => {
  const X = load();
  const s = st('running', { elapsed: 32 }), other = { state: '23' };
  const h = { states: { 'sensor.lhd_bul_cycle': s, 'sensor.t': other }, language: 'tr', callService: () => 1 };
  const H = X.lpCyHass(h, 'sensor.lhd_bul_cycle', 'tr');
  assert.strictEqual(H.states['sensor.lhd_bul_cycle'].state, 'Çalışıyor · 32 dk');
  assert.strictEqual(H.states['sensor.t'], other); assert.strictEqual(H.language, 'tr'); assert.strictEqual(H.callService(), 1);
  assert.strictEqual(X.lpCyHass(h, 'sensor.lhd_bul_cycle', 'tr').states['sensor.lhd_bul_cycle'], H.states['sensor.lhd_bul_cycle']);
  assert.strictEqual(X.lpCyHass(h, 'sensor.t', 'tr'), h);   // not a cycle sensor: untouched
});

test('a tap while finished presses Emptied exactly once; otherwise the device energy window', () => {
  const calls = [], opened = [], fired = [];
  const X = load({ lpEnGet: () => ({ devs: [{ id: 'sensor.lhd_bul_energy', lid: 'bul' }] }), lpEnSub: () => () => {}, lpFire: (n, t, d) => fired.push(d) });
  const h = { states: { 'sensor.lhd_bul_cycle': st('done', { finished: new Date().toISOString() }), 'button.lhd_bul_emptied': { state: 'unknown' } }, callService: function (d, s, x) { calls.push([d, s, x]); } };
  const card = { _hass: h, _lang: 'tr', _enOpen: (v) => opened.push(v) };
  X.lpCyTap(card, 'sensor.lhd_bul_cycle');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(calls)), [['button', 'press', { entity_id: 'button.lhd_bul_emptied' }]]);
  assert.strictEqual(opened.length, 0);
  h.states['sensor.lhd_bul_cycle'] = st('idle');
  X.lpCyTap(card, 'sensor.lhd_bul_cycle');
  assert.strictEqual(calls.length, 1); assert.deepStrictEqual(JSON.parse(JSON.stringify(opened)), [{ k: 'dev', id: 'sensor.lhd_bul_energy' }]);
  // no energy device: the more-info window
  const X2 = load({ lpEnGet: () => ({ devs: [] }), lpEnSub: () => () => {}, lpFire: (n, t, d) => fired.push(d), LP_EN: { m: { devs: [] }, busy: false } });
  X2.lpCyTap(card, 'sensor.lhd_bul_cycle');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(fired)), [{ entityId: 'sensor.lhd_bul_cycle' }]);
});

test('notify targets: notify entities and legacy services, without send_message', () => {
  const X = load();
  const L = X.lpCyTargets({ states: { 'notify.ntfy': { attributes: { friendly_name: 'Telefon (ntfy)' } } }, services: { notify: { mobile_app_pixel_7: {}, send_message: {}, persistent_notification: {} } } });
  assert.deepStrictEqual(Array.from(L.map((x) => x.id + ':' + (x.ent ? 'e' : 's'))), ['notify.ntfy:e', 'notify.mobile_app_pixel_7:s', 'notify.persistent_notification:s']);
});

test('the bundle wires it: card text, halo hass, tap, editor, picker, energy window; no ?. or ??', () => {
  const P = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8'), E = fs.readFileSync(path.join(__dirname, '../src/enplus.js'), 'utf8');
  assert.ok(/a\.lhd_cycle === true\) \{ const c = lpCyLabel/.test(P));
  assert.ok(/e\._lpCy \? lpCyHass\(h, e\._lpCy/.test(P) && /cy \? lpCyTap\(this, id\)/.test(P));
  assert.ok(/lpCyEdHtml\(this, D\)/.test(A) && /lpCyIs\(st\)\) \{ S\.entities\.push\(lpCyItem\(id\)\)/.test(A));
  assert.ok(/lpCyDevHtml\(h, d, lang\)/.test(E));
  assert.ok(!/\?\.|\?\?/.test(SRC.replace(/\/\/.*$/gm, '').replace(/'[^'\n]*'/g, '')));   // yorumlar ve yazılar hariç
  assert.ok(/"cycle\.js"/.test(fs.readFileSync(path.join(__dirname, '../build.py'), 'utf8')));
});
