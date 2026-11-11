// Enerji kartlarının yardımcıları (src/energy.js): HA enerji ayarlarından kategori/cihaz, güç sensörü bulma, geçmişi dilimleme,
// kartların içeriği ve hazır Enerji sekmesi. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '../src/energy.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, '../src/enlooks.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, '../src/enplus.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, '../src/enrep.js'), 'utf8');
const SET = { s: {} };
const ctx = {
  window: {}, SET: SET, STORE: { data: {} },
  lpSettings: () => SET.s,
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  upper: (lang, s) => String(s).toUpperCase(),
  pickLang: () => 'tr',
  localStorage: { _d: {}, getItem(k) { return this._d[k] === undefined ? null : this._d[k]; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } }
};
vm.createContext(ctx);
vm.runInContext(src + '\nthis.E = { lpEnInside, lpEnModelLemur, LP_EN, LP_EN_TYPES, lpEnModel, lpEnPowOf, lpEnBin, lpEnCard, lpEnTotal, lpEnCatW, lpEnDemo, lpEnLim, lpEnWs, lpEnTileP, lpEnWSum, lhdEnergyTab, lpEnIds, lpEnPopHtml, lpEnMode, lpEnMonthCost, lpEnUnit, lpEnUntracked, lpEnYearLimit, lpEnYear, lpEnYtd, lpEnYearPlan, lpEnYtdInfo, lpEnPrev, lpEnLimitOf, lpEnMonthDays, lpEnBatGain, lpEnBand, lpEnMeter, lpEnMeterUnt, lpEnSunOn, lpEnBatOn, lpEnEstW, lpEnIsEst, lpEnModel: lpEnModel, STORE, lpEnFlowNow, lpEnTips, lpEnTipHide, lpEnSunE, lpEnDur, lrPow, lrCount, LP_EL_LOOKS, LP_EL, lpEnLook, lpElNames, lpEnIsLook, lpExCard, lpExPopHtml, LP_EX, LP_EX_CARDS, lpErCsv, lpEnCutStart, lpEnMergeStats, lpEnDayQ, lpEn5m, lpEnDayFrom };', ctx);
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
  assert.ok(/class="encat[^"]* hot"/.test(cats));
  assert.ok(/grid-template-columns:repeat\(\d,/.test(cats));                                         // Klimalar %95
  const top = E.lpEnCard(h, M, { energy: 'top', count: 3 }, 'tr', false);
  assert.strictEqual((top.match(/class="enrk"/g) || []).length, 3);
  assert.ok(top.indexOf('1,2 kW') >= 0);
  const halo = E.lpEnCard(h, M, { energy: 'halo' }, 'tr', false);
  assert.ok(halo.indexOf('1,3') >= 0 && halo.indexOf('kW') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'halo', chips: false }, 'tr', false).indexOf('enchs') < 0);
  assert.ok(E.lpEnCard(h, null, { energy: 'halo' }, 'tr', false).indexOf('Yükleniyor') >= 0);
  assert.ok(E.lpEnCard(h, { cats: [], devs: [] }, { energy: 'halo' }, 'en', false).indexOf('Energy → Devices') >= 0);   // veri yok: mesaj yalnız ana kartta
  assert.ok(E.lpEnCard(h, { cats: [], devs: [] }, { energy: 'cats' }, 'en', false).indexOf('enmsg quiet') >= 0);
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

test('v0.30: new cards and the device and category windows draw from demo data', () => {
  const M = E.lpEnDemo('tr'), h = { states: {}, lhdEnDemo: true, config: {} };
  ['night', 'heat', 'cmp', 'odd', 'period'].forEach((k) => {
    assert.ok(E.LP_EN_TYPES.indexOf(k) >= 0, k + ' listed');
    const html = E.lpEnCard(h, M, { energy: k }, 'tr', false);
    assert.ok(html && html.indexOf('Yükleniyor') < 0, k + ' drew');
  });
  assert.ok(E.lpEnCard(h, M, { energy: 'heat' }, 'tr', false).indexOf('class="exhm"') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'night' }, 'tr', false).indexOf('data-endev') >= 0);
  const dev = E.lpExPopHtml(h, M, { k: 'dev', id: M.devs[0].id }, 'tr', false, false, false);
  assert.ok(dev.indexOf(M.devs[0].name) >= 0 && dev.indexOf('<svg') >= 0, 'device window');
  const cat = E.lpExPopHtml(h, M, { k: 'cat', id: M.cats[0].id }, 'tr', true, false, false);
  assert.ok(cat.indexOf('data-endev') >= 0 && cat.indexOf('exgrab') >= 0, 'category window on phone');
  const all = E.lpExPopHtml(h, M, { k: 'cat', id: '__all' }, 'tr', false, false, false);
  assert.ok(all.indexOf('Şu an çekenler') >= 0);
  // real data: nothing fetched without a connection, the card says it is loading instead of breaking
  assert.ok(E.lpExCard({ states: {} }, { cats: [{ id: 'a', kids: [], p: 'sensor.x' }], devs: [] }, { energy: 'night' }, 'tr', false).indexOf('Yükleniyor') >= 0);
});

test('v0.31: analysis and reports card, windows and CSV from demo data', () => {
  const M = E.lpEnDemo('tr'), h = { states: {}, lhdEnDemo: true, config: {} };
  assert.strictEqual(E.LP_EN_TYPES[0], 'nav');
  const nav = E.lpEnCard(h, M, { energy: 'nav' }, 'tr', false);
  assert.ok(nav.indexOf('data-enpg="ana"') >= 0 && nav.indexOf('data-enpg="rep"') >= 0 && nav.indexOf('exdot') >= 0, 'two tiles, alert dot');
  const ana = E.lpExPopHtml(h, M, { k: 'ana', show: ['night', 'heat'] }, 'tr', false, false, false);
  assert.ok(ana.indexOf('exwide') >= 0 && ana.indexOf('en-night') >= 0 && ana.indexOf('en-heat') >= 0 && ana.indexOf('en-cmp') < 0, 'analysis shows the chosen cards');
  const now = new Date();
  const mo = E.lpExPopHtml(h, M, { k: 'rep', mode: 'm', y: now.getFullYear(), m: now.getMonth() }, 'tr', false, false, false);
  assert.ok(mo.indexOf('data-enrep="prev"') >= 0 && mo.indexOf('<svg') >= 0 && mo.indexOf('data-encsv') >= 0, 'month report');
  const yr = E.lpExPopHtml(h, M, { k: 'rep', mode: 'y', y: now.getFullYear() }, 'en', true, false, false);
  assert.ok(yr.indexOf('Monthly kWh') >= 0 && yr.indexOf('data-encsv') < 0, 'year report, no CSV on phones');
  const csv = E.lpErCsv(h, M, { k: 'rep', mode: 'm', y: now.getFullYear(), m: now.getMonth() }, 'tr');
  assert.ok(csv && /^\ufeffTarih;/.test(csv.text) && csv.text.split('\r\n').length > 28, 'csv rows');
});

test('energy tab and tile power sensor', () => {
  const T = E.lhdEnergyTab('tr', 'enerji');
  assert.strictEqual(T.id, 'enerji');
  assert.strictEqual(T.sections.map((s) => s.entities[0].energy).join(','), 'halo,standby,cats,week,nav,top,day');
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
  const y = new Date().getFullYear();
  SET.s.energy.bills = [{ from: y + '-01-01', to: y + '-01-30', kwh: 300, tl: 1000 }, { from: (y - 1) + '-12-02', to: y + '-01-01', kwh: 310, tl: 1000 }];
  assert.ok(Math.abs(E.lpEnYtd(null) - 310) < 1e-6);               // geçen yıldan taşan faturanın yalnız 1 günü bu yıla
  SET.s.energy.ytd = 2500;
  assert.strictEqual(E.lpEnYear(null), 2500);                         // elle yazılan yıl başından son faturaya
  assert.strictEqual(E.lpEnYearLimit(), y >= 2026 ? 3000 : 5000);
  assert.strictEqual(E.lpEnLimitOf(2025), 5000); assert.strictEqual(E.lpEnLimitOf(2026), 4000); assert.strictEqual(E.lpEnLimitOf(2027), 3000);
  const P = E.lpEnYearPlan(null);
  assert.ok(P && P.k === 2500 && P.lim === E.lpEnYearLimit() && P.avg > 0);
  if (P.cross) assert.strictEqual(P.start.getDate(), 1);            // aşılan ayı izleyen 3. ayın 1'i
  SET.s.energy.ytd = 2990; const P2 = E.lpEnYearPlan(null);
  assert.ok(P2.cross && P2.start.getMonth() === (P2.cross.getMonth() + 3) % 12);
  SET.s.energy.sktt_on = true; SET.s.energy.sktt_price = 6.97;
  assert.strictEqual(E.lpEnMode(), 'sktt'); assert.strictEqual(E.lpEnUnit(null), 6.97);
  delete SET.s.energy.sktt_on;
  // faturasız: Home Assistant'ın kaydı (şebeke sayacı) yılın başından
  SET.s.energy = {}; const d = {}, y0 = new Date(y, 0, 1).getTime(), D = 86400000; let tot = 0;
  for (let t = y0; t < Date.now() - D; t += D) { d[t] = 9; tot += 9; }
  E.LP_EN.yr = { key: 'x', at: Date.now(), y: y, src: 'grid', days: d, first: y0, prev: 3400, pfull: true };
  const I = E.lpEnYtdInfo(null); assert.strictEqual(I.src, 'grid'); assert.ok(Math.abs(I.k - tot) < 1e-6); assert.ok(!I.est);
  assert.strictEqual(E.lpEnPrev(), 3400);
  const P3 = E.lpEnYearPlan(null); assert.strictEqual(P3.prevOver, 3400 >= E.lpEnLimitOf(y));
  // kayıt yılın ortasından başlıyorsa ortalamayla tamamlanır
  const half = {}, h0 = Date.now() - 30 * D; for (let t = h0; t < Date.now() - D; t += D) half[t] = 10;
  E.LP_EN.yr = { key: 'x', at: Date.now(), y: y, src: 'panel', days: half, first: h0, prev: 0, pfull: false };
  const I2 = E.lpEnYtdInfo(null); assert.ok(I2.est && I2.low && I2.k > 290 * 10 * 0.5);
  if (y === 2026) { E.LP_EN.yr = { key: 'x', at: Date.now(), y: y, src: 'grid', days: { [y0]: 3200 }, first: y0, prev: 0, pfull: false }; const P4 = E.lpEnYearPlan(null); assert.ok(P4.start >= new Date(2027, 0, 1)); }   // 2026 geçişi en erken 1 Ocak 2027
  E.LP_EN.yr = null;
  // fatura dönemi: kademe son faturanın bittiği günden
  SET.s.energy = { bills: [{ from: '2026-09-06', to: '2026-10-05', kwh: 268, tl: 1004.7 }] };
  assert.strictEqual(E.lpEnMonthDays(), 30);
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


test('own devices and categories: model, uncategorized tile, estimate marks', () => {
  E.STORE.data = { estimates: {
    klima: { name: 'Klima', kind: 'meas', sensor: 'sensor.klima_watt', energy: 'sensor.klima_kwh', cat: 'iklim' },
    tavan: { name: 'Tavan', kind: 'meas', sensor: 'sensor.tavan_power', cat: 'isik' },
    tv: { name: 'TV', kind: 'states', entity: 'media_player.tv', states: [{ s: 'playing', w: 95 }], other: 1, cat: 'medya' },
    modem: { name: 'Modem', kind: 'fixed', w: 9 }
  }, ecats: [{ id: 'iklim', name: 'Klimalar' }, { id: 'isik', name: 'Işıklar' }, { id: 'medya', name: 'Medya', color: '#B388FF' }] };
  const h = hass();
  h.states['sensor.lhd_tv_power'] = pw(95); h.states['sensor.lhd_modem_power'] = pw(9);
  const M = E.lpEnModel(h, prefs);
  assert.strictEqual(M.lemur, true);
  assert.strictEqual(M.cats.map((c) => c.name).join(','), 'Klimalar,Işıklar,Medya,Kategorisiz');
  assert.strictEqual(M.cats[0].p, 'sensor.lhd_kat_iklim_power');
  const kl = M.devs.filter((d) => d.lid === 'klima')[0];
  assert.strictEqual(kl.p, 'sensor.klima_watt'); assert.strictEqual(kl.e, 'sensor.klima_kwh'); assert.strictEqual(kl.est, false);
  const tv = M.devs.filter((d) => d.lid === 'tv')[0];
  assert.strictEqual(tv.p, 'sensor.lhd_tv_power'); assert.strictEqual(tv.est, true);
  assert.strictEqual(M.devs.filter((d) => d.lid === 'tavan')[0].e, 'sensor.lhd_tavan_energy');   // ölçen ama kWh yok: panel sayar
  const loose = M.cats[3];
  assert.strictEqual(loose.e, null); assert.strictEqual(JSON.stringify(loose.es), '["sensor.lhd_modem_energy"]');
  // kategori sensörü henüz yoksa cihazların toplamı
  assert.strictEqual(E.lpEnCatW(h.states, M.cats[0]), 1200);
  const top = E.lpEnCard(h, M, { energy: 'top' }, 'tr', false);
  assert.ok(/~95 W/.test(top) && /1,2 kW/.test(top));
  // durum kaydı: aynı formül
  assert.strictEqual(E.lpEnEstW({ kind: 'states', states: [{ s: 'playing', w: 95 }], other: 1 }, { state: 'playing', attributes: {} }), 95);
  assert.strictEqual(E.lpEnEstW({ kind: 'states', states: [{ s: 'playing', w: 95 }], other: 1 }, { state: 'idle', attributes: {} }), 1);
  assert.strictEqual(E.lpEnEstW({ kind: 'light', idle: 2, min: 5, max: 60 }, { state: 'on', attributes: { brightness: 0 } }), 5);
  assert.strictEqual(E.lpEnEstW({ kind: 'light', idle: 2, max: 60 }, { state: 'off', attributes: {} }), 2);
  E.STORE.data = {};
});

test('solar flow: net grid, two meters, battery sign, home balance, cards', () => {
  const h = hass();
  Object.assign(h.states, { 'sensor.pv': pw(2.4, 'kW'), 'sensor.grid': pw(-400), 'sensor.gin': pw(0), 'sensor.gout': pw(400), 'sensor.bat': pw(-600), 'sensor.soc': { state: '50', attributes: { unit_of_measurement: '%' } } });
  SET.s = { energy: { solar: { on: true, prod: 'sensor.pv', grid: 'sensor.grid', bat_power: 'sensor.bat', bat_inv: true, soc: 'sensor.soc', cap: 10 } } };
  let F = E.lpEnFlowNow(h.states);
  assert.strictEqual(F.prod, 2400); assert.strictEqual(F.grid, -400); assert.strictEqual(F.bat, 600); assert.strictEqual(F.home, 1400); assert.strictEqual(F.soc, 50);
  SET.s.energy.solar = { on: true, prod: 'sensor.pv', grid_mode: 'two', grid_in: 'sensor.gin', grid_out: 'sensor.gout' };
  F = E.lpEnFlowNow(h.states);
  assert.strictEqual(F.grid, -400); assert.strictEqual(F.home, 2000); assert.strictEqual(F.hasBat, false);
  assert.strictEqual(E.lpEnSunE(), 'sensor.lhd_solar_energy');
  const M = E.lpEnModel(h, prefs);
  assert.strictEqual(E.lpEnTotal(h.states, M), 2000);   // ayarlı toplam yoksa sayaçtan: şebeke + üretim
  const fl = E.lpEnCard(h, M, { energy: 'flow' }, 'tr', false);
  assert.ok(/enflow nobat/.test(fl) && /2,4 kW/.test(fl) && /Şebekeye/.test(fl) && /efl on/.test(fl));
  assert.ok(/noBat|Batarya sensörü seçilmedi/.test(E.lpEnCard(h, M, { energy: 'battery' }, 'tr', false)));
  SET.s.energy.solar = { on: true, prod: 'sensor.pv', grid: 'sensor.grid', bat_power: 'sensor.bat', soc: 'sensor.soc', cap: 10 };   // -600: boşalıyor
  const bt = E.lpEnCard(h, M, { energy: 'battery' }, 'tr', false);
  assert.ok(/<small>%<\/small>50/.test(bt) && /Evi besliyor/.test(bt) && /~8 sa 20 dk yeter/.test(bt), bt);
  SET.s = {};
  assert.strictEqual(E.lpEnFlowNow(h.states), null);
  assert.ok(/Güneş ya da batarya açık değil/.test(E.lpEnCard(h, M, { energy: 'flow' }, 'tr', false)));
  const tab = E.lhdEnergyTab('tr', 'enerji');
  assert.ok(!tab.sections.some((s) => s.entities[0].energy === 'flow'));
  SET.s = { energy: { solar: { on: true, prod: 'sensor.pv' } } };
  assert.ok(E.lhdEnergyTab('tr', 'enerji').sections.some((s) => s.entities[0].energy === 'flow'));
  SET.s = {};
  // yalnız batarya (güneş yok), şebeke ev sayacından; kesinti: sayacın gerilimi düştü
  Object.assign(h.states, { 'sensor.em_power': pw(300), 'sensor.em_volt': { state: '229', attributes: { unit_of_measurement: 'V' } } });
  SET.s = { energy: { meter: { power: 'sensor.em_power', energy: 'sensor.em_energy', volt: 'sensor.em_volt' }, solar: { on: true, sun: false, bat: true, prod: 'sensor.pv', bat_power: 'sensor.bat', soc: 'sensor.soc', cap: 10 } } };
  F = E.lpEnFlowNow(h.states);
  assert.strictEqual(F.sun, false); assert.strictEqual(F.prod, null); assert.strictEqual(F.grid, 300); assert.strictEqual(F.bat, -600); assert.strictEqual(F.home, 900); assert.ok(!F.outage);
  const fl2 = E.lpEnCard(h, M, { energy: 'flow' }, 'tr', false);
  assert.ok(!/efn-s/.test(fl2) && /efn-b/.test(fl2) && !/kWh üretim/.test(fl2));
  h.states['sensor.em_volt'] = { state: '0', attributes: { unit_of_measurement: 'V' } }; h.states['sensor.em_power'] = pw(0);
  F = E.lpEnFlowNow(h.states); assert.ok(F.outage); assert.strictEqual(F.home, 600);
  assert.ok(/Şebeke yok/.test(E.lpEnCard(h, M, { energy: 'flow' }, 'tr', false)));
  assert.strictEqual(E.lpEnSunE(), null);                                  // güneş kapalı: üretim kaynağı yok
  // yalnız ev sayacı: evin gücü sayaçtan
  SET.s = { energy: { meter: { power: 'sensor.em_power', energy: 'sensor.em_energy' } } }; h.states['sensor.em_power'] = pw(1240);
  assert.strictEqual(E.lpEnTotal(h.states, M), 1240); assert.strictEqual(E.lpEnFlowNow(h.states), null);
  // üç zamanlı: payı saatlik kayıttan, kazanç: puantta deşarj, gecede şarj
  SET.s = { energy: { price_mode: 'tou', t_day: 4.95, t_peak: 7.03, t_night: 3.27, solar: { on: true, bat: true, bat_power: 'sensor.bat' } } };
  assert.strictEqual(E.lpEnMode(), 'tou');
  E.LP_EN.tou = { at: Date.now(), from: 0, k: { day: 50, peak: 25, night: 25 }, ch: { day: 0, peak: 0, night: 10 }, dis: { day: 2, peak: 7, night: 0 }, bat: true };
  assert.ok(Math.abs(E.lpEnUnit(null) - (0.5 * 4.95 + 0.25 * 7.03 + 0.25 * 3.27)) < 1e-9);
  assert.ok(Math.abs(E.lpEnMonthCost(100, 30, null).tl - 100 * (0.5 * 4.95 + 0.25 * 7.03 + 0.25 * 3.27)) < 1e-9);
  const G = E.lpEnBatGain(); assert.strictEqual(G.ch, 10); assert.strictEqual(G.dis, 9); assert.strictEqual(G.loss, 1);
  assert.ok(Math.abs(G.gain - (2 * 4.95 + 7 * 7.03 - 10 * 3.27)) < 1e-9);
  assert.strictEqual(E.lpEnBand(new Date(2026, 0, 1, 18).getTime()), 'peak'); assert.strictEqual(E.lpEnBand(new Date(2026, 0, 1, 23).getTime()), 'night'); assert.strictEqual(E.lpEnBand(new Date(2026, 0, 1, 6).getTime()), 'day');
  E.LP_EN.tou = null; SET.s = {};
  assert.strictEqual(E.lpEnDur(95, 'tr'), '1 sa 35 dk'); assert.strictEqual(E.lpEnDur(12 * 60, 'en'), '12 h');
});

test('tips: left on, night standby, yearly limit, hidden ones, off switch', () => {
  const h = hass(), M = E.lpEnModel(h, prefs);
  const n = 48, step = 1800000, t0 = Date.now() - 86400000;
  const kl = M.devs.filter((d) => d.p === 'sensor.klima_watt')[0] || M.devs[0];
  M.hist = { t0: t0, step: step, cats: {}, devs: {}, total: [] };
  M.devs.forEach((d) => { M.hist.devs[d.id] = new Array(n).fill(10); });
  M.hist.devs[kl.id] = new Array(n).fill(0).map((x, i) => (i >= n - 8 ? 1100 : 0));
  M.hist.total = new Array(n).fill(0).map((x, i) => { const hr = new Date(t0 + i * step).getHours(); return hr >= 2 && hr < 5 ? 220 : 600; });
  h.states[kl.p] = pw(1200);
  let L = E.lpEnTips(h, M, 'tr');
  const ks = L.map((x) => x.k.split(':')[0]);
  assert.ok(ks.indexOf('left') >= 0 && ks.indexOf('standby') >= 0, JSON.stringify(L));
  const left = L.filter((x) => x.k.indexOf('left') === 0)[0];
  assert.strictEqual(left.dev, kl.id); assert.ok(/3 saattir açık/.test(left.t));
  // üst listede turuncu kenar, Halo'nun altında satır
  assert.ok(/enrk warn/.test(E.lpEnCard(h, M, { energy: 'top' }, 'tr', false)));
  M.days = null;
  assert.ok(/entips/.test(E.lpEnCard(h, M, { energy: 'halo' }, 'tr', false)));
  assert.ok(!/entips/.test(E.lpEnCard(h, M, { energy: 'halo', tips: false }, 'tr', false)));
  // gizlenen (bu cihazda) ve ayarda gizlenen
  E.lpEnTipHide(left.k);
  SET.s = { energy: { tips_off: ['standby'] } };
  assert.strictEqual(E.lpEnTips(h, M, 'tr').length, 0);
  SET.s = { energy: { tips: { on: false } } };
  ctx.localStorage._d = {};
  assert.strictEqual(E.lpEnTips(h, M, 'tr').length, 0);
  // eşik yüksekse yok
  SET.s = { energy: { tips: { left_w: 2000, standby_w: 300 } } };
  assert.strictEqual(E.lpEnTips(h, M, 'tr').length, 0);
  SET.s = {};
});


test('measured light table: same interpolation as the integration', () => {
  const T = { ct: { k: [2700, 6500], b: [1, 50, 100], w: [[1, 8, 18], [1, 9, 20]] },
    hs: { h: [0, 120, 240], s: [100, 50], b: [1, 50, 100], w: [[[1, 6, 12], [1, 7, 14], [1, 9, 18]], [[1, 7, 16], [1, 7, 16], [1, 8, 17]]] } };
  assert.strictEqual(E.lrPow(T, { brightness: 255, color_mode: 'color_temp', color_temp_kelvin: 6500 }), 20);
  assert.ok(Math.abs(E.lrPow(T, { brightness: 255, color_mode: 'color_temp', color_temp_kelvin: 4600 }) - 19) < 1e-9);
  assert.strictEqual(E.lrPow(T, { brightness: 255, color_mode: 'hs', hs_color: [300, 100] }), 15);
  assert.strictEqual(E.lrPow(T, { brightness: 255, color_mode: 'hs', hs_color: [0, 75] }), 14);
  assert.strictEqual(E.lrCount(T), 24);
  assert.strictEqual(E.lpEnEstW({ kind: 'light', idle: 0.4, max: 9, lut: T }, { state: 'on', attributes: { brightness: 255, color_mode: 'hs', hs_color: [120, 100] } }), 14);
  assert.strictEqual(E.lpEnEstW({ kind: 'light', idle: 0.4, max: 9, lut: T }, { state: 'off', attributes: {} }), 0.4);
});

test('every card look draws with demo data, in both languages', () => {
  const M = E.lpEnDemo('tr'), h = { states: {}, lhdEnDemo: true, config: {} };
  Object.keys(E.LP_EL_LOOKS).forEach((k) => {
    assert.strictEqual(E.lpElNames(k, 'tr').length, E.LP_EL_LOOKS[k].length, k + ' names');
    assert.strictEqual(E.lpElNames(k, 'en').length, E.LP_EL_LOOKS[k].length, k + ' names en');
    E.LP_EL_LOOKS[k].forEach((l) => {
      ['tr', 'en'].forEach((lang) => {
        const out = E.lpEnCard(h, M, { energy: k, look: l }, lang, false);
        assert.ok(typeof out === 'string' && out.length > 20, k + '/' + l + ' empty');
        assert.ok(!/undefined|NaN|\[object/.test(out), k + '/' + l + ' ' + lang + ': ' + (out.match(/.{0,60}(undefined|NaN|\[object).{0,30}/) || [''])[0]);
      });
    });
  });
  // görünüm seçilmediyse kartın kendi çizimi; seçildiyse kutuyu dolduran görünüm
  assert.ok(E.lpEnCard(h, M, { energy: 'halo' }, 'tr', false).indexOf('enhalo') >= 0);
  assert.ok(E.lpEnCard(h, M, { energy: 'halo', look: 'gauge' }, 'tr', false).indexOf('enlk') >= 0);
  assert.ok(E.lpEnIsLook({ energy: 'tariff' }) && !E.lpEnIsLook({ energy: 'halo' }) && E.lpEnIsLook({ energy: 'cats', look: 'tree' }));
});

test('shared plug: cards take the rest, the devices on it keep their own rows', () => {
  const Est = { masa: { name: 'PC masası prizi', kind: 'meas', sensor: 'sensor.masa_w', inside: ['led', 'masa', 'yok'], rest: 'Bilgisayar', cat: 'pc' }, led: { name: 'LED', kind: 'fixed', w: 13, cat: 'isik' } };
  assert.strictEqual(JSON.stringify(E.lpEnInside('masa', Est.masa, Est)), '["led"]');
  const M = E.lpEnModelLemur({ states: {} }, { E: Est, C: [{ id: 'pc', name: 'Bilgisayar' }, { id: 'isik', name: 'Işıklar' }] }, null);
  const d = M.devs.filter((x) => x.lid === 'masa')[0];
  assert.strictEqual(d.p, 'sensor.lhd_masa_net_power');
  assert.strictEqual(d.e, 'sensor.lhd_masa_net_energy');
  assert.strictEqual(d.name, 'Bilgisayar');
  assert.strictEqual(d.plug, 'sensor.masa_w');
  assert.strictEqual(M.devs.filter((x) => x.lid === 'led')[0].p, 'sensor.lhd_led_power');
});

test('a measured light whose standby read 0 counts 0.4 W while off and reachable (v0.28.8)', () => {
  const ctx2 = {}; vm.createContext(ctx2);
  const lut = { br: { b: [1, 100], w: [0.5, 6] } };
  const e = { kind: 'light', idle: 0, max: 6, lut: lut };
  assert.strictEqual(E.lpEnEstW(e, { state: 'off', attributes: {} }), 0.4);
  assert.strictEqual(E.lpEnEstW(e, { state: 'unavailable', attributes: {} }), 0);
  assert.strictEqual(E.lpEnEstW(Object.assign({}, e, { idle: 0.3 }), { state: 'off', attributes: {} }), 0.3);
  assert.strictEqual(E.lpEnEstW(Object.assign({}, e, { lut: null }), { state: 'off', attributes: {} }), 0);
});

test('a light group tile sums its members\' power (v0.28.8)', () => {
  E.LP_EN.tp = {};
  const h = { states: {
    'light.tavan_serit': { state: 'on', attributes: { entity_id: ['light.salon_serit', 'light.mutfak_serit'] } },
    'light.salon_serit': { state: 'on', attributes: {} }, 'light.mutfak_serit': { state: 'on', attributes: {} },
    'sensor.salon_serit_power': pw(42.3), 'sensor.mutfak_serit_power': pw(38.5)
  }, entities: {} };
  const p = E.lpEnTileP(h, 'light.tavan_serit');
  assert.deepStrictEqual(Array.from(p), ['sensor.salon_serit_power', 'sensor.mutfak_serit_power']);
  assert.strictEqual(Math.round(E.lpEnWSum(h.states, p) * 10) / 10, 80.8);
  assert.strictEqual(E.lpEnWSum(h.states, 'sensor.salon_serit_power'), 42.3);
  E.LP_EN.tp = {};
});

test('under two weeks of records the year is not extrapolated (v0.28.8)', () => {
  const y = new Date().getFullYear(), now = Date.now(), f = now - 1.5 * 86400000;
  if (f < new Date(y, 0, 1).getTime() + 3 * 86400000) return;   // ocak başında anlamsız
  E.LP_EN.yr = { key: 'x', at: now, y: y, src: 'grid', days: { [f]: 12 }, first: f, prev: 0, pfull: false };
  const I = E.lpEnYtdInfo(null), P = E.lpEnYearPlan(null);
  assert.strictEqual(I.short, true); assert.strictEqual(I.k, 12); assert.strictEqual(I.est, false);
  assert.strictEqual(P.proj, null); assert.strictEqual(P.cross, null); assert.strictEqual(P.short, true);
  E.LP_EN.yr = { key: 'x', at: now, y: y, src: 'grid', days: { [now - 20 * 86400000]: 120 }, first: now - 20 * 86400000, prev: 0, pfull: false };
  assert.strictEqual(E.lpEnYtdInfo(null).est, true);
  E.LP_EN.yr = null;
});

// ---- v0.33: yalnız son kısım yenilenir ----
test('kesme noktası eldeki dilim başlangıçlarından seçilir', () => {
  const d = { a: [{ start: 100 }, { start: 200 }, { start: 300 }, { start: 400 }], b: [{ start: 300 }, { start: 500 }] };
  assert.equal(E.lpEnCutStart(d, ['a', 'b'], 2), 300);   // 100 200 300 400 500: sondan 2 öncesi
  assert.equal(E.lpEnCutStart(d, ['b'], 2), null);        // yeterli dilim yok: baştan indirilir
  assert.equal(E.lpEnCutStart({}, ['a'], 0), null);
});
test('eski kısım + yeni kısım, tam indirmenin aynısını verir', () => {
  const full1 = { a: [{ start: 100, change: 1 }, { start: 200, change: 2 }, { start: 300, change: 3 }], b: [{ start: 200, change: 5 }] };
  const full2 = { a: [{ start: 100, change: 1 }, { start: 200, change: 2 }, { start: 300, change: 3.5 }, { start: 400, change: 0.2 }], b: [{ start: 200, change: 5 }, { start: 400, change: 1 }], c: [{ start: 400, change: 9 }] };
  const inc = { a: [{ start: 300, change: 3.5 }, { start: 400, change: 0.2 }], b: [{ start: 400, change: 1 }], c: [{ start: 400, change: 9 }] };
  assert.deepEqual(JSON.parse(JSON.stringify(E.lpEnMergeStats(full1, inc, ['a', 'b', 'c'], 300, 0))), full2);
  // drop: pencereden çıkan eski dilimler atılır
  assert.deepEqual(JSON.parse(JSON.stringify(E.lpEnMergeStats(full1, inc, ['a'], 300, 200))), { a: [{ start: 200, change: 2 }, { start: 300, change: 3.5 }, { start: 400, change: 0.2 }] });
  // ISO tarihli başlangıçlar da çalışır
  const o = { a: [{ start: '2026-01-01T00:00:00Z', change: 1 }, { start: '2026-01-02T00:00:00Z', change: 2 }] };
  assert.equal(E.lpEnMergeStats(o, { a: [{ start: '2026-01-02T00:00:00Z', change: 7 }] }, ['a'], Date.parse('2026-01-02T00:00:00Z'), 0).a[1].change, 7);
});
test('günlük veri: ilk istek baştan, sonraki yalnız son günler; sonuç aynı', async () => {
  const day = 86400000, from = E.lpEnDayFrom(), calls = [];
  const mk = (n, last) => { const L = []; for (let i = 0; i < n; i++) L.push({ start: from + i * day, change: i === n - 1 ? last : 1 }); return L; };
  let now = { 'sensor.a': mk(10, 0.4) };
  const conn = { sendMessagePromise: (m) => { calls.push(m.start_time); const s = Date.parse(m.start_time), o = {}; m.statistic_ids.forEach((id) => { o[id] = (now[id] || []).filter((x) => x.start >= s); }); return Promise.resolve(o); } };
  E.LP_EN.dq = null; E.LP_EN.dk = null;
  const r1 = await E.lpEnDayQ(conn, ['sensor.a']);
  assert.equal(r1['sensor.a'].length, 10);
  assert.equal(Date.parse(calls[0]), from);
  now = { 'sensor.a': mk(10, 0.9) };            // bugünün değeri arttı
  E.LP_EN.dq = null;                              // bir dakikalık bekleme geçmiş sayılır
  const r2 = await E.lpEnDayQ(conn, ['sensor.a']);
  assert.equal(Date.parse(calls[1]), from + 7 * day);   // yalnız son 3 gün istendi
  assert.deepEqual(JSON.parse(JSON.stringify(r2)), JSON.parse(JSON.stringify(now)));
  E.LP_EN.dq = null;
  await E.lpEnDayQ(conn, ['sensor.a', 'sensor.b']);       // yeni bir sensör: baştan
  assert.equal(Date.parse(calls[2]), from);
  E.LP_EN.dq = null; E.LP_EN.dk = null;
});
test('5 dakikalık veri: sonraki istek yalnız son yarım saat; pencereden çıkanlar atılır', async () => {
  const st = 300000, base = Math.floor(Date.now() / st) * st - 86400000, calls = [];
  let n = 288;
  const conn = { sendMessagePromise: (m) => { calls.push(Date.parse(m.start_time)); const s = Date.parse(m.start_time), o = {}; m.statistic_ids.forEach((id) => { const L = []; for (let i = 0; i < n; i++) { const t = base + i * st; if (t >= s) L.push({ start: t, mean: i }); } o[id] = L; }); return Promise.resolve(o); } };
  E.LP_EN.h5 = null;
  const r1 = await E.lpEn5m(conn, ['p'], base);
  assert.equal(r1.p.length, 288);
  n = 290;                                        // 10 dakika geçti
  const t0 = base + 2 * st;
  const r2 = await E.lpEn5m(conn, ['p'], t0);
  assert.equal(calls[1], base + (288 - 1 - 5) * st);   // son 6 dilimden başlayarak istendi
  assert.equal(r2.p[r2.p.length - 1].mean, 289);
  assert.ok(r2.p.every((x, i) => i === 0 || x.start - r2.p[i - 1].start === st));   // boşluk ya da çift yok
  assert.ok(r2.p[0].start >= t0 - 600000);
  E.LP_EN.h5 = null;
});
