// src/loader.js: pano hata sayfasında kaldıysa yeniden ürettirilir (v0.33.1, GitHub #21); v0.34.0: sayfa yenileme yok,
// ana dosya uzun süre yeniden denenir, dosya iki kez gelirse ikincisi hiçbir şey yapmaz. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '../src/loader.js'), 'utf8');
const OURS = { views: [{ title: 'Ev', cards: [{ type: 'custom:lemur-home-dashboard-card', tab: 'ev' }] }] };
const ERR = { views: [{ title: 'Error', cards: [{ type: 'markdown', content: 'Error loading the dashboard strategy' }] }] };
const RAW = { strategy: { type: 'custom:lemur-home-dashboard' } };

// sahte sayfa: saat elle ilerletilir (run(ms)); ana dosya o.mainOkAt'ten (ms) önce inemez, sonra iner ve strateji tanımlanır
function page(o) {
  let now = 1000000, seq = 0;
  const timers = [], listeners = {}, defs = {}, srcs = [];
  const W = o.W || { customElements: { get: (k) => defs[k], define: (k, v) => { defs[k] = v; } }, addEventListener: (k, f) => { (listeners[k] = listeners[k] || []).push(f); },
    location: { reload: () => { W.reloads = (W.reloads || 0) + 1; } }, reloads: 0 };
  const panel = o.panel;
  const main = { shadowRoot: { querySelector: (q) => (q === 'ha-panel-lovelace' ? panel : null) } };
  const ha = { shadowRoot: { querySelector: (q) => (q === 'home-assistant-main' ? main : null) } };
  const okAt = o.mainOkAt === undefined ? 0 : o.mainOkAt;
  const document = { querySelector: (q) => (q === 'home-assistant' ? ha : null), createElement: () => ({}),
    head: { appendChild: (s) => { srcs.push(s.src); s.parentNode = { removeChild() { s.parentNode = null; } };
      Promise.resolve().then(() => { if (now - 1000000 < okAt) { if (s.onerror) s.onerror(); } else { W.__LEMUR_HD_STRATEGY = { generate: () => OURS }; if (s.onload) s.onload(); } }); } } };
  const FakeDate = { now: () => now };
  const add = (f, ms, every) => { timers.push({ id: ++seq, f, at: now + (ms || 0), every: every ? (ms || 1) : 0 }); return seq; };
  const ctx = { window: W, document, HTMLElement: class {}, HTMLScriptElement: { prototype: { noModule: true } }, console: { warn() {} }, Promise, Date: FakeDate, Array, Error, String,
    setInterval: (f, ms) => add(f, ms, true), clearInterval: (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); }, setTimeout: (f, ms) => add(f, ms, false) };
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  const run = async (ms) => {
    const end = now + ms;
    for (;;) {
      await new Promise((r) => setImmediate(r));
      let t = null;
      for (const x of timers) if (x.at <= end && (!t || x.at < t.at)) t = x;
      if (!t) break;
      now = Math.max(now, t.at);
      if (t.every) t.at += t.every; else timers.splice(timers.indexOf(t), 1);
      t.f();
    }
    now = end;
    await new Promise((r) => setImmediate(r));
  };
  return { W, run, listeners, defs, srcs, ctx };
}

test('hata sayfasında kalan pano yeniden ürettirilir', async () => {
  let calls = 0;
  const panel = { lovelace: { rawConfig: RAW, config: ERR }, _regenerateStrategyConfig() { calls++; this.lovelace = Object.assign({}, this.lovelace, { config: OURS }); return Promise.resolve(); } };
  const P = page({ panel });
  await P.run(1500);
  assert.equal(calls, 0);                 // ilk bakış 2. saniyede
  await P.run(60000);
  assert.equal(calls, 1);                 // bir kez ürettirildi, düzelince bir daha dokunulmadı
  assert.equal(P.W.reloads, 0);
  assert.ok(P.defs['ll-strategy-dashboard-lemur-home-dashboard']);
});

test('sağlam panoya ve başkasının panosuna dokunulmaz', async () => {
  let calls = 0;
  const mk = (raw, cfg) => ({ lovelace: { rawConfig: raw, config: cfg }, _regenerateStrategyConfig() { calls++; return Promise.resolve(); } });
  for (const panel of [mk(RAW, OURS), mk({ strategy: { type: 'original-states' } }, ERR), mk({ views: [] }, ERR), { lovelace: undefined }, null]) {
    const P = page({ panel });
    await P.run(120000);
    assert.equal(P.W.reloads, 0);
  }
  assert.equal(calls, 0);
});

test('düzelmiyorsa denemeler seyrekleşir, 14 denemede biter; sayfa hiç yenilenmez', async () => {
  const at = [];
  let P = null;
  const panel = { lovelace: { rawConfig: RAW, config: ERR }, _regenerateStrategyConfig() { at.push(Math.round((P.ctx.Date.now() - 1000000) / 1000)); return Promise.resolve(); } };
  P = page({ panel });
  await P.run(30 * 60000);
  assert.equal(at.length, 14);
  assert.deepEqual(at.slice(0, 6), [2, 7, 22, 52, 112, 172]);
  assert.equal(P.W.reloads, 0);
  // sayfa geçişinde yeniden başlar
  P.listeners['location-changed'].forEach((f) => f());
  await P.run(5000);
  assert.equal(at.length, 15);
  assert.equal(P.W.reloads, 0);
});

test('HA\'nın yeniden üretme işlevi yoksa _fetchConfig kullanılır; ikisi de yoksa hiçbir şey yapılmaz', async () => {
  let calls = 0;
  const p1 = { lovelace: { rawConfig: RAW, config: ERR }, _fetchConfig(force) { calls += force ? 1 : 0; this.lovelace = Object.assign({}, this.lovelace, { config: OURS }); return Promise.resolve(); } };
  const P1 = page({ panel: p1 });
  await P1.run(10000);
  assert.equal(calls, 1);
  const P2 = page({ panel: { lovelace: { rawConfig: RAW, config: ERR } } });
  await P2.run(30 * 60000);
  assert.equal(P2.W.reloads, 0);
});

test('ana dosya inemiyorsa başka adresle yeniden denenir, inince pano üretilir (HA açılırken açılan sayfa)', async () => {
  let calls = 0;
  const panel = { lovelace: { rawConfig: RAW, config: ERR }, _regenerateStrategyConfig() { calls++; this.lovelace = Object.assign({}, this.lovelace, { config: OURS }); return Promise.resolve(); } };
  const P = page({ panel, mainOkAt: 45000 });     // eklenti 45. saniyede kuruluyor
  const gen = P.defs['ll-strategy-dashboard-lemur-home-dashboard'].generate({}, {});   // HA stratejiyi çağırdı: ana dosyayı bekler
  let done = null;
  gen.then((c) => { done = c; });
  await P.run(44000);
  assert.equal(done, null);
  assert.ok(P.srcs.length >= 12 && P.srcs.length <= 16, 'deneme sayısı ' + P.srcs.length);
  assert.equal(new Set(P.srcs).size, P.srcs.length);          // her deneme başka adresle (tarayıcı başarısız adresi hatırlar)
  assert.equal(P.srcs[0].indexOf('&r='), -1);
  await P.run(6000);
  assert.deepEqual(done, OURS);                                // 45. saniyeden sonraki ilk denemede
  assert.equal(calls, 1);                                      // hata sayfasında kalan pano da aynı anda ürettirildi
  assert.equal(P.W.reloads, 0);
});

test('ana dosya hiç inemiyorsa 10 dakika sonra bırakılır, sayfa yenilenmez', async () => {
  let calls = 0;
  const panel = { lovelace: { rawConfig: RAW, config: ERR }, _regenerateStrategyConfig() { calls++; return Promise.resolve(); } };
  const P = page({ panel, mainOkAt: 1e12 });
  let failed = false;
  P.defs['ll-strategy-dashboard-lemur-home-dashboard'].generate({}, {}).catch(() => { failed = true; });
  await P.run(9 * 60000);
  assert.equal(failed, false);
  const n = P.srcs.length;
  assert.ok(n > 30 && n < 60, 'deneme sayısı ' + n);
  await P.run(3 * 60000);
  assert.equal(failed, true);
  assert.equal(calls, 0);
  assert.equal(P.W.reloads, 0);
});

test('dosya sayfaya iki kez gelirse (add_extra_js_url ve Lovelace kaynağı) ikincisi hiçbir şey yapmaz', async () => {
  const P = page({ panel: null });
  const first = P.defs['ll-strategy-dashboard-lemur-home-dashboard'];
  const n = P.srcs.length;
  const P2 = page({ panel: null, W: P.W });
  assert.equal(P.defs['ll-strategy-dashboard-lemur-home-dashboard'], first);
  assert.equal(P2.srcs.length, 0);                              // ana dosyayı bir daha istemedi
  assert.equal(P.srcs.length, n);
  assert.equal(Object.keys(P2.listeners).length, 0);
});

test('yükleyicide sayfa yenileme ve depolama yok', () => {
  assert.equal(/location\.reload|sessionStorage|localStorage/.test(SRC), false);
});
