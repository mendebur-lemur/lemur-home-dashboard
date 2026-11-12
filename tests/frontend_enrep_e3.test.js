// Raporlar (src/enrep.js lpErData / lpErMonth / lpErYear): yaz saati değişen ayda günler ve süren ayın karşılaştırması.
// Saat dilimi Europe/Berlin (yaz saati var). Çalıştır: node --test tests/
'use strict';
process.env.TZ = 'Europe/Berlin';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = ['energy.js', 'enlooks.js', 'enplus.js', 'enrep.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8')).join('\n');
const SET = { s: { energy: { price_mode: 'single', price: 2 } } };
const ctx = {
  window: {}, STORE: { data: {} }, lpSettings: () => SET.s, upper: (l, s) => String(s).toUpperCase(), pickLang: () => 'tr',
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]),
  localStorage: { _d: {}, getItem(k) { return this._d[k] === undefined ? null : this._d[k]; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } }
};
vm.createContext(ctx);
vm.runInContext(src + '\nthis.E = { lpErData, lpErCsv, lpExRepHtml, LP_EX }; this.setNow = (t) => { Date.now = () => t; };', ctx);
const E = ctx.E;
// sahte istatistik: her yerel günün kWh'i = günün ayın kaçıncı günü olduğu (1..31); ay periyodunda ayın günlerinin toplamı.
// first: kaydın başladığı gün (öncesi yok)
function conn(first) {
  return { sendMessagePromise: (m) => {
    const a = Date.parse(m.start_time), b = m.end_time ? Date.parse(m.end_time) : Infinity, out = {};
    m.statistic_ids.forEach((id) => {
      const rows = []; const d = new Date(a); d.setHours(0, 0, 0, 0); if (m.period === 'month') d.setDate(1);
      for (; d.getTime() < b && d.getTime() < Date.now(); m.period === 'month' ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 1)) {
        let v = 0, any = false;   // ay: kayıtlı günlerin toplamı (Home Assistant'ın ay satırı gibi, kayıt ortadan başladıysa kısmi)
        if (m.period === 'month') { for (const x = new Date(d.getTime()); x.getMonth() === d.getMonth() && x.getTime() < Date.now(); x.setDate(x.getDate() + 1)) if (!first || x.getTime() >= first) { v += x.getDate(); any = true; } }
        else { any = !first || d.getTime() >= first; v = d.getDate(); }
        if (!any) continue;
        rows.push({ start: d.getTime(), end: d.getTime() + 86400000, change: v });
      }
      if (rows.length) out[id] = rows;
    });
    return Promise.resolve(out);
  } };
}
const M = { cats: [{ id: 'c1', name: 'Isik', e: 'sensor.c1', color: '#fff', icon: 'mdi:flash', kids: [] }], devs: [] };
async function data(P, first) {
  E.LP_EX.c = {}; E.LP_EX.busy = {}; ctx.localStorage._d = {};
  const h = { connection: conn(first) };
  E.lpErData(h, M, P); await new Promise((r) => setTimeout(r, 20));
  return { D: E.lpErData(h, M, P), h };
}

test('month report: days stay on their date across the spring and autumn clock change', async () => {
  ctx.setNow(new Date(2026, 10, 20, 12).getTime());
  for (const m of [2, 9]) {   // Mart (29'unda ileri), Ekim (25'inde geri)
    const { D, h } = await data({ k: 'rep', mode: 'm', y: 2026, m: m });
    const n = new Date(2026, m + 1, 0).getDate();
    assert.strictEqual(D.rows.length, n);
    D.rows.forEach((r, i) => { assert.strictEqual(new Date(r.t).getDate(), i + 1, 'row date ' + m + '/' + (i + 1)); assert.strictEqual(r.tot, i + 1, 'row kWh ' + m + '/' + (i + 1)); });
    const csv = E.lpErCsv(h, M, { k: 'rep', mode: 'm', y: 2026, m: m }, 'en').text.split('\r\n').slice(1);
    csv.forEach((l, i) => assert.ok(l.indexOf('-' + ('0' + (i + 1)).slice(-2) + ',') === 7, l));
  }
});

test('month report: the running month is compared with the same days of the previous month', async () => {
  ctx.setNow(new Date(2026, 10, 12, 12).getTime());   // 12 Kasım öğlen
  const { D, h } = await data({ k: 'rep', mode: 'm', y: 2026, m: 10 });
  // Kasım 1..12 (12'si bütün gün sayılır: sahte kayıt gün başında) = 78; Ekim 1..12 = 78
  assert.strictEqual(D.tot, 78);
  assert.strictEqual(D.prevTot, 78);
  const html = E.lpExRepHtml(h, M, { k: 'rep', mode: 'm', y: 2026, m: 10 }, 'tr', false);
  assert.ok(/%0 Ekim ayının aynı günlerine göre/.test(html), html.slice(0, 600));
});

test('month report: no comparison when the previous month record starts in its middle', async () => {
  ctx.setNow(new Date(2026, 10, 20, 12).getTime());
  const { D } = await data({ k: 'rep', mode: 'm', y: 2026, m: 10 }, new Date(2026, 9, 20).getTime());   // kayıt 20 Ekim'de başladı
  assert.strictEqual(D.prevTot, null);
});

test('year report: no "vs last year" when last year is only partly recorded', async () => {
  ctx.setNow(new Date(2026, 10, 12, 12).getTime());
  const P = { k: 'rep', mode: 'y', y: 2026 };
  let r = await data(P, new Date(2025, 9, 1).getTime());   // kayıt Ekim 2025'te başladı
  let html = E.lpExRepHtml(r.h, M, P, 'en', false);
  assert.ok(!/vs the same period last year/.test(html));
  r = await data(P);   // bütün yıl kayıtlı: Ocak-Ekim aynı, Kasım'ın geçen kısmı geçen yılın Kasım'ının 11,5/30'u
  html = E.lpExRepHtml(r.h, M, P, 'en', false);
  const m = /([▲▼] )?(\d+)% vs the same period last year/.exec(html);
  assert.ok(m, html.slice(0, 500));
  let a = 0, b = 0; for (let i = 0; i < 10; i++) { const n = new Date(2026, i + 1, 0).getDate(), n2 = new Date(2025, i + 1, 0).getDate(); a += n * (n + 1) / 2; b += n2 * (n2 + 1) / 2; }
  a += 78; b += 465 * (11.5 / 30);
  assert.strictEqual(m[0], (a < b ? '▼ ' : '▲ ') + Math.round(Math.abs(a - b) / b * 100) + '% vs the same period last year');
});
