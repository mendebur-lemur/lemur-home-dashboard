// Telefona özel ayarların yardımcıları (src/defaults.js): öğe anahtarı ve telefondaki bölüm sırası. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(['i18n.js', 'defaults.js'].map((f) => fs.readFileSync(path.join(__dirname, '../src/', f), 'utf8')).join('\n') +
  '\nthis.D = { lhdItemKey, lhdPhoneOrder, lhdOrderBy };', ctx);
const D = ctx.D;
const ids = (a) => a.map((s) => s.id).join(',');

test('item key: entity, pet, card, subtitle, named button', () => {
  assert.strictEqual(D.lhdItemKey('light.a'), 'light.a');
  assert.strictEqual(D.lhdItemKey({ entity: 'light.b', name: 'X' }), 'light.b');
  assert.strictEqual(D.lhdItemKey({ pet: 'kedi' }), 'pet:kedi');
  assert.strictEqual(D.lhdItemKey({ card: { type: 'markdown', title: 'Not' } }), 'card:markdown:Not');
  assert.strictEqual(D.lhdItemKey({ subtitle: 'Üst kat' }), 'sub:Üst kat');
  assert.strictEqual(D.lhdItemKey({ name: 'Evi Kapa', icon: 'mdi:power' }), 'n:Evi Kapa|mdi:power');
  assert.strictEqual(D.lhdItemKey(null), '');
});

test('phone order: column by column by default, then the saved order', () => {
  const T = { id: 't', columns: [50, 25, 25], splits: [1, 2, 1], sections: [
    { id: 'c', col: 2 }, { id: 'a', col: 0 }, { id: 'b2', col: 1, sub: 1 }, { id: 'b1', col: 1, sub: 0 }, { id: 'x', col: 9 } ] };
  assert.strictEqual(ids(D.lhdPhoneOrder(T)), 'a,b1,b2,c,x');
  assert.strictEqual(ids(D.lhdPhoneOrder(T, ['c', 'a'])), 'c,a,b1,b2,x');
  assert.strictEqual(ids(D.lhdPhoneOrder(T, ['gone', 'b2'])), 'b2,a,b1,c,x');
  assert.strictEqual(ids(D.lhdPhoneOrder(T, [])), 'a,b1,b2,c,x');
  assert.strictEqual(ids(D.lhdPhoneOrder({ sections: [] }, ['a'])), '');
});

test('order by keys: listed first in that order, the rest keep their place', () => {
  const L = ['a', 'b', 'c', 'd'].map((id) => ({ id: id }));
  assert.strictEqual(ids(D.lhdOrderBy(L, ['d', 'b'])), 'd,b,a,c');
  assert.strictEqual(ids(D.lhdOrderBy(L, null)), 'a,b,c,d');
  assert.strictEqual(D.lhdOrderBy(['light.x', 'light.y', { name: 'Z' }], ['light.y', 'n:Z|'], D.lhdItemKey).map(D.lhdItemKey).join(','), 'light.y,n:Z|,light.x');
});
