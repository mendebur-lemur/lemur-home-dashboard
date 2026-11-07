// Serbest ızgaranın yardımcıları (src/panel-card.js): yerleşim, çakışma, sütunlu düzenden geçiş, dikey ekran. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const pick = (name) => { const i = src.indexOf(name); assert.ok(i >= 0, name); return i; };
// panel-card.js tarayıcıya bağlı; yalnız ızgara bölümü (lpSplits'ten lpGridPos'un sonuna) alınır
const a = pick('function lpSplits('), b = src.indexOf('\n}\n', pick('function lpGridPos(')) + 3;
const ctx = { LP_DEFAULT_COLS: [56, 17, 25.5] };
vm.createContext(ctx);
vm.runInContext(src.slice(a, b) + '\nthis.G = { lpGSettle, lpGridFromCols, lpGridPos, lpGFill, lpGMin, lpGHit };', ctx);
const G = ctx.G;
const J = (x) => JSON.parse(JSON.stringify(x));
const overlap = (L) => L.some((p, i) => L.some((q, j) => i < j && G.lpGHit(p, q)));

test('settle: the moved box keeps its place, the others make room and close gaps', () => {
  const L = [{ id: 'a', x: 0, y: 0, w: 6, h: 4 }, { id: 'b', x: 6, y: 0, w: 6, h: 4 }, { id: 'c', x: 0, y: 4, w: 12, h: 3 }];
  L[2].y = 0; L[2].x = 0;   // c üste taşındı
  G.lpGSettle(L, 'c', 12);
  assert.ok(!overlap(L));
  assert.deepStrictEqual([L[2].x, L[2].y], [0, 0]);
  assert.strictEqual(L[0].y, 3); assert.strictEqual(L[1].y, 3);
  const M = [{ id: 'a', x: 10, y: 0, w: 6, h: 2 }]; G.lpGSettle(M, null, 12); assert.deepStrictEqual([M[0].x, M[0].w], [6, 6]);   // taşmaz
});
test('from columns: widths go to 12 columns, boxes share 12 rows by grow', () => {
  const T = { columns: [30, 40, 30], sections: [{ id: 'a', col: 0, grow: 3 }, { id: 'b', col: 0, grow: 1 }, { id: 'c', col: 1 }, { id: 'd', col: 2 }] };
  G.lpGridFromCols(T);
  const g = {}; T.sections.forEach((s) => { g[s.id] = s.g; });
  assert.deepStrictEqual(J(g.a), { x: 0, y: 0, w: 4, h: 9 });
  assert.deepStrictEqual(J(g.b), { x: 0, y: 9, w: 4, h: 3 });
  assert.deepStrictEqual(J(g.c), { x: 4, y: 0, w: 4, h: 12 });
  assert.deepStrictEqual(J(g.d), { x: 8, y: 0, w: 4, h: 12 });
});
test('portrait: 6 columns derived in reading order, never below a card\'s minimum; own layout wins', () => {
  const T = { layout: 'grid', sections: [{ id: 'a', type: 'energy', entities: [{ energy: 'halo' }], g: { x: 0, y: 0, w: 4, h: 7 } }, { id: 'b', g: { x: 4, y: 0, w: 8, h: 7 } }, { id: 'c', g: { x: 0, y: 7, w: 12, h: 5 } }] };
  const P = G.lpGridPos(T, 6), L = Object.keys(P).map((k) => P[k]);
  assert.ok(!overlap(L));
  L.forEach((p) => assert.ok(p.x + p.w <= 6));
  assert.ok(P.a.w >= G.lpGMin(T.sections[0], 6)[0]);
  assert.ok(P.a.y <= P.c.y && P.b.y <= P.c.y);
  T.gm_own = true; T.sections.forEach((s, i) => { s.gm = { x: 0, y: i * 4, w: 6, h: 4 }; });
  assert.deepStrictEqual(J(G.lpGridPos(T, 6).c), { id: 'c', x: 0, y: 8, w: 6, h: 4 });
});
test('fill: boxes grow into empty cells only', () => {
  const L = [{ id: 'a', x: 0, y: 0, w: 4, h: 4 }, { id: 'b', x: 6, y: 0, w: 6, h: 2 }];
  G.lpGFill(L, 12, 6);
  assert.ok(!overlap(L));
  assert.deepStrictEqual([L[0].w, L[0].h], [6, 6]);
  assert.deepStrictEqual([L[1].w, L[1].h], [6, 6]);
});
