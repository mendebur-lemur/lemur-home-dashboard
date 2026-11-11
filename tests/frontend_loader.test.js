// src/loader.js: pano hata sayfasında kaldıysa yeniden ürettirilir (v0.33.1, GitHub #21). Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '../src/loader.js'), 'utf8');
const OURS = { views: [{ title: 'Ev', cards: [{ type: 'custom:lemur-home-dashboard-card', tab: 'ev' }] }] };
const ERR = { views: [{ title: 'Error', cards: [{ type: 'markdown', content: 'Error loading the dashboard strategy' }] }] };

// sahte sayfa: zamanlayıcılar elle ilerletilir, ana dosya "yüklenince" strateji tanımlanır
function page(o) {
  const timers = [], listeners = {}, defs = {}, store = {};
  const W = { customElements: { get: (k) => defs[k], define: (k, v) => { defs[k] = v; } }, addEventListener: (k, f) => { (listeners[k] = listeners[k] || []).push(f); },
    sessionStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = v; } }, location: { reload: () => { W.reloads = (W.reloads || 0) + 1; } }, reloads: 0 };
  const panel = o.panel;
  const main = { shadowRoot: { querySelector: (q) => (q === 'ha-panel-lovelace' ? panel : null) } };
  const ha = { shadowRoot: { querySelector: (q) => (q === 'home-assistant-main' ? main : null) } };
  const document = { querySelector: (q) => (q === 'home-assistant' ? ha : null), createElement: () => ({}),
    head: { appendChild: (s) => { Promise.resolve().then(() => { if (o.mainFails) { if (s.onerror) s.onerror(); } else { W.__LEMUR_HD_STRATEGY = { generate: () => OURS }; if (s.onload) s.onload(); } }); } } };
  const ctx = { window: W, document, HTMLElement: class {}, HTMLScriptElement: { prototype: { noModule: true } }, console: { warn() {} }, Promise, Date, Array, Error, String,
    setInterval: (f) => { timers.push(f); return timers.length; }, clearInterval: () => {}, setTimeout: (f) => { timers.push({ once: f }); return timers.length; } };
  vm.createContext(ctx);
  vm.runInContext(SRC, ctx);
  const tick = async (n) => { for (let i = 0; i < n; i++) { timers.slice().forEach((t) => { if (typeof t === 'function') t(); else if (t.once) { const f = t.once; t.once = null; f(); } }); await new Promise((r) => setImmediate(r)); } };
  return { W, tick, listeners, defs };
}

test('hata sayfasında kalan pano yeniden ürettirilir', async () => {
  let calls = 0;
  const panel = { lovelace: { rawConfig: { strategy: { type: 'custom:lemur-home-dashboard' } }, config: ERR }, _regenerateStrategyConfig() { calls++; this.lovelace = Object.assign({}, this.lovelace, { config: OURS }); return Promise.resolve(); } };
  const P = page({ panel });
  await P.tick(40);
  assert.equal(calls, 1);                 // bir kez ürettirildi, düzelince bir daha dokunulmadı
  assert.equal(P.W.reloads, 0);
  assert.ok(P.defs['ll-strategy-dashboard-lemur-home-dashboard']);
});

test('sağlam panoya ve başkasının panosuna dokunulmaz', async () => {
  let calls = 0;
  const mk = (raw, cfg) => ({ lovelace: { rawConfig: raw, config: cfg }, _regenerateStrategyConfig() { calls++; return Promise.resolve(); } });
  for (const panel of [mk({ strategy: { type: 'custom:lemur-home-dashboard' } }, OURS), mk({ strategy: { type: 'original-states' } }, ERR), mk({ views: [] }, ERR), { lovelace: undefined }, null]) {
    const P = page({ panel });
    await P.tick(40);
    assert.equal(P.W.reloads, 0);
  }
  assert.equal(calls, 0);
});

test('düzelmiyorsa en çok 3 kez denenir, sonra sayfa bir kez yenilenir', async () => {
  let calls = 0;
  const panel = { lovelace: { rawConfig: { strategy: { type: 'custom:lemur-home-dashboard' } }, config: ERR }, _regenerateStrategyConfig() { calls++; return Promise.resolve(); } };
  const P = page({ panel });
  await P.tick(200);
  assert.equal(calls, 3);
  assert.equal(P.W.reloads, 1);
});

test('HA\'nın işlevi yoksa sayfa bir kez yenilenir', async () => {
  const panel = { lovelace: { rawConfig: { strategy: { type: 'custom:lemur-home-dashboard' } }, config: ERR } };
  const P = page({ panel });
  await P.tick(200);
  assert.equal(P.W.reloads, 1);
});
