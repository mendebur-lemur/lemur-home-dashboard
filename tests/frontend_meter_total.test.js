// Ev sayacı varken evin toplamı (v0.36.0b4, src/energy.js lpEnMix / lpEnHomeDays / lpEnStat, src/enrep.js): her gün sayaçtan,
// sayaçtan önceki / okunmayan / sıfırlanan günler cihazlardan, günler ayı ve yılı tutar; bozuk okuma (99999 kWh) sayılmaz.
// Çalıştır: node --test tests/
'use strict';
process.env.TZ = 'Europe/Istanbul';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = ['energy.js', 'enlooks.js', 'enplus.js', 'enrep.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8')).join('\n');
const SET = { s: {} };
const ctx = {
  window: {}, STORE: { data: {} }, lpSettings: () => SET.s, upper: (l, s) => String(s).toUpperCase(), pickLang: () => 'tr',
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  localStorage: { _d: {}, getItem(k) { return this._d[k] === undefined ? null : this._d[k]; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } }
};
vm.createContext(ctx);
// saat: setNow ile (new Date() de; panonun günleri new Date()'ten kurulur)
vm.runInContext('var __NOW = Date.now(); var __D = Date; Date = class extends __D { constructor(...a) { if (a.length) super(...a); else super(__NOW); } static now() { return __NOW; } };', ctx);
vm.runInContext(src + '\nthis.E = { lpEnMix, lpEnStat, lpEnDays, lpEnDayTot, lpEnMonthKwh, lpEnYtdInfo, lpEnHomeDays, lpErData, lpErCsv, LP_EN, LP_EX }; this.setNow = (t) => { __NOW = t; };', ctx);
const E = ctx.E;
const D = 86400000, H = 3600000;
const day = (y, m, d) => new Date(y, m, d).getTime();

test('lpEnMix: one source per day; before the meter, its half first day, reset and missing days from the devices', () => {
  const t = [1, 2, 3, 4, 5, 6, 7].map((d) => day(2026, 10, d));
  const dev = {}; t.forEach((x) => { dev[x] = 8; });
  // meter from day 3 (installed at noon), day 5 not read (came back on day 6 with day 5's 10 kWh), day 7 reset (-500)
  const met = {}; met[t[2]] = 4; met[t[3]] = 10; met[t[5]] = 20; met[t[6]] = -490;
  const L = E.lpEnMix(dev, met, t[0]);
  assert.deepStrictEqual(Array.from(L, (x) => x.k), [8, 8, 8, 10, 8, 12, 8]);
  assert.deepStrictEqual(Array.from(L, (x) => x.m), [false, false, false, true, false, true, false]);
  // what the meter counted over days 4-6 (30 kWh) is what the days add up to (10 + 8 + 12)
  assert.strictEqual(L[3].k + L[4].k + L[5].k, 30);
  // devices more than the meter: the meter stays the total (not measured would be 0)
  const L2 = E.lpEnMix({ [t[0]]: 9 }, { [t[0]]: 7 }, t[0]);
  assert.strictEqual(L2[0].k, 7);
  // meter and devices start together (new install): the meter counts from its first day
  const L3 = E.lpEnMix({ [t[2]]: 2 }, { [t[2]]: 2.4 }, t[0]);
  assert.strictEqual(L3[0].k, 2.4);
});

function statConn(rows, log) {
  return { sendMessagePromise: (m) => {
    if (log) log.push(m.period + ':' + m.statistic_ids.join(','));
    const a = Date.parse(m.start_time), b = m.end_time ? Date.parse(m.end_time) : Infinity, out = {};
    m.statistic_ids.forEach((id) => { const L = (rows[id] && rows[id][m.period]) || []; const f = L.filter((x) => x.start >= a && x.start < b).map((x) => Object.assign({}, x)); if (f.length) out[id] = f; });
    return Promise.resolve(out);
  } };
}

test('lpEnStat: a 99999 kWh reading on a plug or meter is not counted; integration sensors are left alone', async () => {
  const d0 = day(2026, 10, 10), hrs = [];
  for (let i = 0; i < 24; i++) hrs.push({ start: d0 + i * H, end: d0 + (i + 1) * H, change: i === 20 ? 99999 : 0.5 });
  const rows = { 'sensor.tv_kwh': { day: [{ start: d0, end: d0 + D, change: 99999 + 23 * 0.5 }], hour: hrs }, 'sensor.lhd_kat_x_energy': { day: [{ start: d0, end: d0 + D, change: 80 }] } };
  const log = [];
  const r = await E.lpEnStat(statConn(rows, log), { type: 'recorder/statistics_during_period', start_time: new Date(d0).toISOString(), period: 'day', statistic_ids: ['sensor.tv_kwh', 'sensor.lhd_kat_x_energy'], types: ['change'], units: { energy: 'kWh' } });
  assert.strictEqual(r['sensor.tv_kwh'][0].change, 11.5);
  assert.strictEqual(r['sensor.lhd_kat_x_energy'][0].change, 80);
  assert.deepStrictEqual(log, ['day:sensor.tv_kwh,sensor.lhd_kat_x_energy', 'hour:sensor.tv_kwh']);   // saatlik yalnız bozuk dilim için
  const r2 = await E.lpEnStat(statConn(rows), { type: 'recorder/statistics_during_period', start_time: new Date(d0).toISOString(), period: 'hour', statistic_ids: ['sensor.tv_kwh'], types: ['change'], units: { energy: 'kWh' } });
  assert.strictEqual(r2['sensor.tv_kwh'].reduce((a, x) => a + x.change, 0), 11.5);
  // normal day: no extra request
  const log2 = [];
  await E.lpEnStat(statConn({ 'sensor.tv_kwh': { day: [{ start: d0, end: d0 + D, change: 12 }] } }, log2), { type: 'recorder/statistics_during_period', start_time: new Date(d0).toISOString(), period: 'day', statistic_ids: ['sensor.tv_kwh'], types: ['change'] });
  assert.strictEqual(log2.length, 1);
});

// ev: iki kategori (cihazlar günde 6 kWh), sayaç günde 8 kWh; sayaç 5 Kasım'dan beri (öğlen takıldı: o gün 3 kWh)
function home(meterFrom) {
  const now = new Date(2026, 10, 13, 15, 0).getTime(); ctx.setNow(now);
  const rows = { 'sensor.lhd_kat_a_energy': { day: [] }, 'sensor.lhd_kat_b_energy': { day: [] }, 'sensor.em_kwh': { day: [] } };
  for (let t = day(2026, 0, 1) - 40 * D; t <= now; t = new Date(new Date(t).setDate(new Date(t).getDate() + 1)).getTime()) {
    const td = t > now - D;
    rows['sensor.lhd_kat_a_energy'].day.push({ start: t, end: t + D, change: td ? 2 : 4 });
    rows['sensor.lhd_kat_b_energy'].day.push({ start: t, end: t + D, change: td ? 1 : 2 });
    if (meterFrom && t >= meterFrom) rows['sensor.em_kwh'].day.push({ start: t, end: t + D, change: t === meterFrom ? 3 : td ? 4 : 8 });
  }
  return rows;
}
const model = () => ({ cats: [{ id: 'a', name: 'A', e: 'sensor.lhd_kat_a_energy', color: '#fff', icon: 'mdi:flash', kids: [] }, { id: 'b', name: 'B', e: 'sensor.lhd_kat_b_energy', color: '#fff', icon: 'mdi:flash', kids: [] }], devs: [] });

test('with a home meter: today, the days of the month and the month agree; days before the meter are the devices', async () => {
  SET.s = { energy: { price_mode: 'single', price: 2, meter: { power: 'sensor.em_w', energy: 'sensor.em_kwh' } } };
  E.LP_EN.dk = null; E.LP_EN.dq = null; E.LP_EN.hd = null; E.LP_EN.yr = null;
  const M = model(); E.LP_EN.m = M;
  await E.lpEnDays(statConn(home(day(2026, 10, 5))), M);
  const N = M.days.t.length;
  assert.strictEqual(E.lpEnDayTot(M, N - 1), 4);                       // today: the meter (devices: 3)
  // Nov 1-4 devices (6), Nov 5 the meter's half day -> devices (6), Nov 6-12 meter (8), today 4
  assert.strictEqual(E.lpEnMonthKwh(M), 4 * 6 + 6 + 7 * 8 + 4);
  let s = 0; M.days.t.forEach((t, i) => { if (t >= day(2026, 10, 1)) s += E.lpEnDayTot(M, i); });
  assert.strictEqual(s, E.lpEnMonthKwh(M));
  // the year: devices until Nov 5, then the meter
  const I = E.lpEnYtdInfo(M);
  const daysBefore = Math.round((day(2026, 10, 6) - day(2026, 0, 1)) / D);
  assert.strictEqual(Math.round(I.k), daysBefore * 6 + 7 * 8 + 4);
  assert.strictEqual(I.src, 'grid');
});

test('without a meter nothing changes: the devices', async () => {
  SET.s = { energy: { price_mode: 'single', price: 2 } };
  E.LP_EN.dk = null; E.LP_EN.dq = null; E.LP_EN.hd = null; E.LP_EN.yr = null;
  const M = model(); E.LP_EN.m = M;
  await E.lpEnDays(statConn(home(day(2026, 10, 5))), M);
  assert.strictEqual(M.days.mall, undefined);
  assert.strictEqual(E.lpEnDayTot(M, M.days.t.length - 1), 3);
  assert.strictEqual(E.lpEnMonthKwh(M), 12 * 6 + 3);
});

test('solar on: the meter counts the grid, not the home; days stay the devices', async () => {
  SET.s = { energy: { price_mode: 'single', price: 2, meter: { energy: 'sensor.em_kwh' }, solar: { sun: true, prod: 'sensor.pv' } } };
  E.LP_EN.dk = null; E.LP_EN.dq = null; E.LP_EN.hd = null;
  const M = model(); E.LP_EN.m = M;
  await E.lpEnDays(statConn(home(day(2026, 10, 5))), M);
  assert.strictEqual(E.lpEnDayTot(M, M.days.t.length - 1), 3);
});

test('report with a meter: total from the meter, "not measured" row and CSV column, days add up', async () => {
  SET.s = { energy: { price_mode: 'single', price: 2, meter: { power: 'sensor.em_w', energy: 'sensor.em_kwh' } } };
  E.LP_EX.c = {}; E.LP_EX.busy = {}; ctx.localStorage._d = {};
  const M = model(), h = { connection: statConn(home(day(2026, 10, 5))) }, P = { k: 'rep', mode: 'm', y: 2026, m: 10 };
  E.lpErData(h, M, P); await new Promise((r) => setTimeout(r, 30));
  const R = E.lpErData(h, M, P);
  assert.ok(R.meter);
  assert.strictEqual(R.tot, 4 * 6 + 6 + 7 * 8 + 4);
  assert.strictEqual(Math.round(R.cats.__unt * 1000) / 1000, 7 * 2 + 1);   // 2 kWh a day not measured, today 1
  const csv = E.lpErCsv(h, M, P, 'tr').text.replace(/^﻿/, '').split('\r\n');
  assert.strictEqual(csv[0], 'Tarih;A;B;Ölçülmeyen;Toplam kWh');
  const n = (s) => parseFloat(String(s).replace(/"/g, '').replace(',', '.'));
  let tot = 0; csv.slice(1).forEach((l) => { const c = l.split(';'); tot += n(c[4]); assert.ok(Math.abs(n(c[1]) + n(c[2]) + n(c[3]) - n(c[4])) < 1e-6, l); });
  assert.strictEqual(tot, R.tot);
  // without a meter the CSV is as before
  SET.s = { energy: { price_mode: 'single', price: 2 } }; E.LP_EX.c = {}; E.LP_EX.busy = {}; ctx.localStorage._d = {};
  E.lpErData(h, M, P); await new Promise((r) => setTimeout(r, 30));
  assert.strictEqual(E.lpErCsv(h, M, P, 'tr').text.replace(/^﻿/, '').split('\r\n')[0], 'Tarih;A;B;Toplam kWh');
  assert.strictEqual(E.lpErData(h, M, P).tot, 12 * 6 + 3);
});
