// v0.35.2: kart öğesinin şeffaf dokunma katmanı (tapov) kart takılınca silinmez; ekran açılınca saat tazelenir.
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cardpop = fs.readFileSync(path.join(__dirname, '../src/cardpop.js'), 'utf8');
const panel = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const pick = (src, re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };

// çok küçük sahte DOM: yalnız lpMountCard'ın kullandıkları
function node(cls) {
  const n = { children: [], classList: { contains: (c) => c === cls }, isConnected: true, parentNode: {}, _ev: {} };
  Object.defineProperty(n, 'innerHTML', { set() { n.children = []; }, get() { return ''; } });
  n.appendChild = (c) => { n.children = n.children.filter((x) => x !== c).concat([c]); return c; };
  n.addEventListener = (t, f) => { n._ev[t] = f; };
  return n;
}

test('kart takılınca tapov katmanı yerinde kalır ve kartın üstündedir', async () => {
  const card = node('card');
  const ctx = { window: { loadCardHelpers: () => ({ createCardElement: () => card }), dispatchEvent() {} }, Event: function () {}, setTimeout: () => 0, clearTimeout() {}, Promise, Array, esc: (s) => String(s) };
  vm.createContext(ctx);
  vm.runInContext(pick(cardpop, /const lpCardT = [^\n]*\n/) + pick(cardpop, /const LP_CARD_TXT = \{[\s\S]*?\n\};\n/) + pick(cardpop, /const LP_CH = [^\n]*\n/) +
    pick(cardpop, /function lpCardHelpers\(\) \{[\s\S]*?\n\}\n/) + pick(cardpop, /function lpMountCard\([\s\S]*?\n\}\n/) + 'this.lpMountCard = lpMountCard;', ctx);
  const ph = node('emb'), ov = node('tapov');
  ph.appendChild(ov);   // pano katmanı çizimde hemen ekler, kart sonra (söz verilmiş) takılır
  let got = null;
  ctx.lpMountCard(ph, { type: 'custom:x' }, () => ({}), 'tr', (el) => { got = el; });
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  assert.strictEqual(got, card);
  assert.deepStrictEqual(ph.children.map((x) => (x === card ? 'card' : x === ov ? 'tapov' : '?')), ['card', 'tapov']);
});

test('ekran açılınca saat tazelenir; dinleyici ayrılınca kaldırılır', () => {
  const con = pick(panel, /connectedCallback\(\) \{[\s\S]*?\n {2}\}\n/), dis = pick(panel, /disconnectedCallback\(\) \{[\s\S]*?\n {2}\}\n/);
  assert.ok(/document\.addEventListener\('visibilitychange', this\._vis\)/.test(con));
  assert.ok(/this\._tick\(\)/.test(con));
  assert.ok(/document\.removeEventListener\('visibilitychange', this\._vis\)/.test(dis));
});
