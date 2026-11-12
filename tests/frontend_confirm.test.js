// v0.35.2: onay penceresinde "Evet": onaylanan iş, pencere kapanırken yapılan geçmiş geri gidişi (history.back, eşzamansız)
// bittikten sonra çalışmalı. Önce çalışınca gecikmeli popstate onayla açılan kart penceresini hemen kapatıyordu.
// Çalıştır: node --test tests/frontend_confirm.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/cardpop.js'), 'utf8');
const cls = /const LP_CPOP = \{ cur: null \};\nclass LemurCardPopup \{[\s\S]*?\n\}\n/.exec(src);
assert.ok(cls, 'LemurCardPopup bulunamadı');

// en küçük sahte tarayıcı: olay dinleyicileri, eşzamansız history.back ve popstate
function env() {
  const L = {}, q = [];
  const on = (t, f) => { (L[t] = L[t] || []).push(f); };
  const off = (t, f) => { L[t] = (L[t] || []).filter((x) => x !== f); };
  const fire = (t, e) => (L[t] || []).slice().forEach((f) => f(e || {}));
  const el = () => {
    const h = {}, kids = {};
    const o = { classList: { add() {}, remove() {} }, parentNode: null, innerHTML: '', addEventListener: (t, f) => { (h[t] = h[t] || []).push(f); }, click: () => (h.click || []).forEach((f) => f({})),
      attachShadow: () => { o.shadowRoot = { set innerHTML(v) {}, querySelector: (s) => kids[s] || (kids[s] = el()) }; return o.shadowRoot; } };
    return o;
  };
  const stack = [null];
  const ctx = {
    window: { addEventListener: on, removeEventListener: off },
    history: { get state() { return stack[stack.length - 1]; }, pushState: (s) => stack.push(s), back: () => q.push(() => { stack.pop(); fire('popstate'); }) },
    document: { createElement: el, querySelector: () => null, body: { appendChild: (x) => { x.parentNode = ctx.document.body; } } },
    requestAnimationFrame: (f) => f(), setTimeout: (f, ms) => { if (ms >= 400) ctx._late = f; return 0; },
    esc: (s) => String(s), lpCardT: (l, k) => k, pickLang: () => 'tr', lpMountCard: () => {}, LP_CPOP_CSS: '',
    flush: () => { while (q.length) q.shift()(); }, L: L
  };
  ctx.window.history = ctx.history;
  vm.createContext(ctx);
  vm.runInContext(cls[0] + 'this.LemurCardPopup = LemurCardPopup; this.LP_CPOP = LP_CPOP;', ctx);
  return ctx;
}

test('Evet: onaylanan iş geri gidişten sonra çalışır; açtığı pencere açık kalır', () => {
  const c = env();
  let opened = null;
  const p = c.LemurCardPopup.confirm({}, 'tr', 'Emin misin?', () => { opened = c.LemurCardPopup._open({}, { title: 'Grafik' }, 'tr'); });
  p._host.shadowRoot.querySelector('[data-yes]').click();
  assert.strictEqual(opened, null, 'geri gidiş bitmeden çalışmamalı');
  c.flush();   // tarayıcı geri gider, popstate gelir
  assert.ok(opened, 'popstate ile çalışmalı');
  c.flush();
  assert.strictEqual(opened._closed, undefined, 'onayla açılan pencere açık kalmalı');
  assert.strictEqual(c.LP_CPOP.cur, opened);
});

test('Evet: popstate gelmezse yine de (bir kez) çalışır', () => {
  const c = env();
  let n = 0;
  const p = c.LemurCardPopup.confirm({}, 'tr', 'Emin misin?', () => { n++; });
  p._host.shadowRoot.querySelector('[data-yes]').click();
  c._late(); c.flush();
  assert.strictEqual(n, 1);
});
