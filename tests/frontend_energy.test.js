// Enerji kartlarının yardımcıları (src/energy.js): HA enerji ayarlarından kategori/cihaz, güç sensörü bulma, geçmişi dilimleme,
// kartların içeriği ve hazır Enerji sekmesi. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../src/energy.js'), 'utf8');
const SET = { s: {} };
const ctx = {
  window: {}, SET: SET, STORE: { data: {} },
  lpSettings: () => SET.s,
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  upper: (lang, s) => String(s).toUpperCase()
};
vm.createContext(ctx);
vm.runInContext(src + '\nthis.E = { LP_EN, LP_EN_TYPES, lpEnModel, lpEnPowOf, lpEnBin, lpEnCard, lpEnTotal, lpEnCatW, lpEnDemo, lpEnLim, lpEnWs, lpEnTileP, lhdEnergyTab, lpEnIds, lpEnPopHtml, lpEnMode, lpEnMonthCost, lpEnUnit, lpEnUntracked, lpEnYearLimit, lpEnYear, lpEnEstW, lpEnIsEst, lpEnModel: lpEnModel, STORE };', ctx);
const E = ctx.E;

const pw = (v, u) => ({ state: String(v), attributes: { device_class: 'power', unit_of_measurement: u || 'W' } });
const en = (v) => ({ state: String(v), attributes: { device_class: 'energy', unit_of_measurement: 'kWh' } });
const hass = () => ({
  states: {
    'sensor.enerji_isiklar_energy': en(1), 'sensor.enerji_isiklar_power': pw(60),
    'sensor.enerji_klimalar_energy': en(5), 'sensor.enerji_klimalar_power': pw(1.2, 'kW'),
    'sensor.tavan_energy': en(1), 'sensor.tavan_power': pw(40),
    'sensor.serit_energy': en(1), 'sensor.serit_power': pw(20),
    'sensor.klima_kwh': en(5), 'sensor.klima_watt': pw(1200),
    'light.tavan': { state: 'on', attributes: {} }
  },
  entities: { 'sensor.klima_kwh': { device_id: 'd1' }, 'sensor.klima_watt': { device_id: 'd1' }, 'light.tavan': { device_id: 'd2' }, 'sensor.tavan_power': { device_id: 'd2' } },
  config: { currency: 'TRY' }
});
const prefs = { energy_sources: [], device_consumption: [
  { stat_consumption: 'sensor.enerji_isiklar_energy', name: 'Işıklar' },
  { stat_consumption: 'sensor.enerji_klimalar_energy', name: 'Klimalar' },
  { stat_consumption: 'sensor.tavan_energy', included_in_stat: 'sensor.enerji_isiklar_energy' },
  { stat_consumption: 'sensor.serit_energy', included_in_stat: 'sensor.enerji_isiklar_energy' },
  { stat_consumption: 'sensor.klima_kwh', included_in_stat: 'sensor.enerji_klimalar_energy' }
] };

test('model: top-level entries are categories, leaves are devices, power sensors are found', () => {
  const M = E.lpEnModel(hass(), prefs);
  assert.deepStrictEqual(M.cats.map((c) => c.name), ['Işıklar', 'Klimalar']);
  assert.strictEqual(M.cats[0].icon, 'mdi:lightbulb');
  assert.strictEqual(M.cats[1].icon, 'mdi:air-conditioner');
  assert.deepStrictEqual(M.devs.map((d) => d.id), ['sensor.tavan_energy', 'sensor.serit_energy', 'sensor.klima_kwh']);
  assert.strictEqual(M.devs[0].p, 'sensor.tavan_power');
  assert.strictEqual(M.devs[2].p, 'sensor.klima_watt');                         // aynı cihazın güç sensörü
  assert.strictEqual(M.devs[2].cat, 'sensor.enerji_klimalar_energy');
  assert.strictEqual(M.cats[0].kids.length, 2);
});

test('model: no hierarchy, no prefs', () => {
  assert.strictEqual(E.lpEnModel(hass(), null).cats.length, 0);
  const M = E.lpEnModel(hass(), { device_consumption: [{ stat_consumption: 'sensor.tavan_energy' }] });
  assert.strictEqual(M.cats.length, 1);
  assert.strictEqual(M.devs.length, 1);
  assert.strictEqual(M.cats[0].name, 'tavan');
});

test('totals: kW is converted, sum of categories unless a total sensor is set', () => {
  const h = hass(), M = E.lpEnModel(h, prefs);
  assert.strictEqual(E.lpEnCatW(h.states, M.cats[1]), 1200);
  assert.strictEqual(E.lpEnTotal(h.states, M), 1260);
  SET.s = { energy: { total: 'sensor.serit_power' } };
  assert.strictEqual(E.lpEnTotal(h.states, M), 20);
  SET.s = {};
  assert.ok(E.lpEnIds(M).indexOf('sensor.klima_watt') >= 0);
});

test('history bins: time weighted average per slot', () => {
  const t0 = Date.now() - 4 * 3600000, step = 3600000;
  const L = [{ s: '100', lu: t0 / 1000 }, { s: '0', lu: (t0 + 1800000) / 1000 }, { s: 'unavailable', lu: (t0 + 7200000) / 1000 }];
  const b = E.lpEnBin(L, t0, step, 4, 1);
  assert.strictEqual(b[0], 50);
  assert.strictEqual(b[1], 0);
  assert.strictEqual(b[2], null);
  assert.strictEqual(E.lpEnBin([{ s: '2', lu: (t0 - 1000) / 1000 }], t0, step, 1, 1000)[0], 2000);
});

test('limits: invalid setting falls back to defaults', () => {
  SET.s = { energy: { limits: [800, 300, 1800] } };
  assert.deepStrictEqual(Array.from(E.lpEnLim()), [300, 800, 1800]);
  SET.s = { energy: { limits: [100, 200, 300] } };
  assert.deepStrictEqual(Array.from(E.lpEnLim()), [100, 200, 300]);
  SET.s = {};
});

test('cards render with data, show a hint without it, and escape names', () => {
  const h = hass(), M = E.lpEnModel(h, prefs);
  M.cats[0].name = '<b>x</b>';
  E.LP_EN_TYPES.forEach((k) => { const html = E.lpEnCard(h, M, { energy: k }, 'tr', false); assert.ok(typeof html === 'string' && html.length > 10, k); });
  const cats = E.lpEnCard(h, M, { energy: 'cats' }, 'tr', false);
  assert.ok(cats.indexOf('&lt;b&gt;x&lt;/b&gt;') >= 0 && cats.indexOf('<b>x</b>') < 0);
  assert.ok(cats.indexOf('encat hot') >= 0);                                         // Klimalar %95
  const top = E.lpEnCard(h, M, { energy: 'top', count: 3 }, 'tr', false);
  assert.strictEqual((top.match(/class="enrk"/g) || []).length, 3);
  assert.ok(top.indexOf('1,2 kW') >= 0);
  const halo = E.lpEnCard(h, M, { energy: 'halo' }, 'tr', false);
  assert.ok(halo.indexOf('1,3') >= 0 && halo.indexOf('kW') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'halo', chips: false }, 'tr', false).indexOf('enchs') < 0);
  assert.ok(E.lpEnCard(h, null, { energy: 'halo' }, 'tr', false).indexOf('Yükleniyor') >= 0);
  assert.ok(E.lpEnCard(h, { cats: [], devs: [] }, { energy: 'cats' }, 'en', false).indexOf('Individual devices') >= 0);
  assert.ok(E.lpEnPopHtml(h, M, 'sensor.enerji_isiklar_energy', 'tr').indexOf('2 cihaz') >= 0);
});

test('demo data draws every card with charts', () => {
  const M = E.lpEnDemo('en'), h = { states: {}, lhdEnDemo: true, config: {} };
  assert.strictEqual(M.cats.length, 6);
  assert.strictEqual(M.hist.total.length, 48);
  assert.strictEqual(M.days.t.length, 35);
  assert.ok(E.lpEnCard(h, M, { energy: 'week', days: 30, unit: 'cost' }, 'en', true).indexOf('<rect') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'day', mode: 'total' }, 'en', false).indexOf('<polygon') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'standby' }, 'en', false).indexOf('a year') >= 0);
});

test('energy tab and tile power sensor', () => {
  const T = E.lhdEnergyTab('tr', 'enerji');
  assert.strictEqual(T.id, 'enerji');
  assert.strictEqual(T.sections.map((s) => s.entities[0].energy).join(','), 'halo,standby,cats,week,top,day');
  assert.ok(T.sections.every((s) => s.type === 'energy'));
  const h = hass();
  assert.strictEqual(E.lpEnTileP(h, 'light.tavan'), 'sensor.tavan_power');
});

test('tariff: bill, single and tiered prices, untracked share, yearly limit', () => {
  SET.s = { energy: { price: 3 } };
  assert.strictEqual(E.lpEnMode(), 'single');
  assert.strictEqual(E.lpEnUnit(null), 3);
  SET.s = { energy: { price_mode: 'tier', low: 2, high: 4, daily: 8 } };
  assert.strictEqual(E.lpEnMode(), 'tier');
  const c = E.lpEnMonthCost(300, 30, null);                     // sınır 240 kWh
  assert.strictEqual(c.lim, 240); assert.strictEqual(c.tl, 240 * 2 + 60 * 4); assert.strictEqual(c.hi, 60);
  assert.strictEqual(E.lpEnMonthCost(100, 30, null).tl, 200);
  SET.s = { energy: { price_mode: 'tier', low: 2 } };              // eksik kademe: tek fiyata düşer
  assert.strictEqual(E.lpEnMode(), 'single');
  SET.s = { energy: { bills: [{ from: '2026-09-06', to: '2026-10-05', kwh: 268, tl: 1004.7, panel: 171 }, { from: '2026-10-06', to: '2026-11-04', kwh: 280, tl: 1050, panel: 196 }] } };
  assert.strictEqual(E.lpEnMode(), 'bill');                         // fatura varsa kendiliğinden faturadan
  assert.strictEqual(E.lpEnUnit(null), 3.75);
  assert.strictEqual(Math.round(E.lpEnUntracked() * 100), 30);
  SET.s.energy.last12 = 3120;
  assert.ok(Math.abs(E.lpEnYear(null) - 3120) < 1e-9);
  assert.ok([3000, 4000].indexOf(E.lpEnYearLimit()) >= 0);
  SET.s.energy.year_mode = 'manual'; SET.s.energy.year_limit = 5000;
  assert.strictEqual(E.lpEnYearLimit(), 5000);
  SET.s = {};
});

test('estimates: same formulas as the integration, marked with ~ on cards', () => {
  const st = (s0, a) => ({ state: s0, attributes: a || {} });
  assert.ok(Math.abs(E.lpEnEstW({ kind: 'light', idle: 2, max: 60 }, st('on', { brightness: 76.5 })) - 19.4) < 0.01);
  assert.strictEqual(E.lpEnEstW({ kind: 'light', idle: 2, max: 60 }, st('off')), 2);
  assert.strictEqual(E.lpEnEstW({ kind: 'onoff', off: 0.5, on: 95 }, st('idle')), 0.5);
  assert.ok(Math.abs(E.lpEnEstW({ kind: 'year', year: 250 }, null) - 28.54) < 0.01);
  assert.ok(Math.abs(E.lpEnEstW({ kind: 'cycle', k100: 52, week: 4 }, null) - 12.35) < 0.01);
  assert.ok(E.lpEnIsEst({ e: 'sensor.lhd_buz_energy' }));
  assert.ok(!E.lpEnIsEst({ e: 'sensor.buz_energy' }));
  const h = { states: { 'sensor.lhd_buz_energy': { state: '1', attributes: { device_class: 'energy', unit_of_measurement: 'kWh' } }, 'sensor.lhd_buz_power': { state: '28.5', attributes: { device_class: 'power', unit_of_measurement: 'W' } } }, entities: {} };
  const M = E.lpEnModel(h, { device_consumption: [{ stat_consumption: 'sensor.lhd_buz_energy', name: 'Buzdolabı' }] });
  const top = E.lpEnCard(h, M, { energy: 'top' }, 'tr', false);
  assert.ok(top.indexOf('erw est') >= 0 && top.indexOf('~29 W') >= 0);
  SET.s = { energy: { tilde: false } };
  assert.ok(E.lpEnCard(h, M, { energy: 'top' }, 'tr', false).indexOf('~') < 0);
  SET.s = {};
});
