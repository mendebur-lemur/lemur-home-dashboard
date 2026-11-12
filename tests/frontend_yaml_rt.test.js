// YAML gidiş-dönüş (src/yaml.js): kart öğesini açıp kaydetmek kullanıcının ayarını değiştirmemeli: parse(dump(x)) === x.
// Çalıştır: node --test tests/frontend_yaml_rt.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/yaml.js'), 'utf8') + '\nthis.Y = { parse: lhdYamlParse, dump: lhdYamlDump };', ctx);
const Y = ctx.Y, J = (x) => JSON.parse(JSON.stringify(x));

const S = [
  '  girintili ilk satır\nikinci satır', '    kod bloğu\n    devamı', '\n  boş satırdan sonra girintili', '   \nyalnız boşluklu ilk satır',
  'sonda satır sonu\n', 'sonda iki satır sonu\n\n', 'sonda üç\n\n\n', '\n', '\n\n', 'a\n\nb', 'a\n   \nb', 'a\n  ', 'satır sonu boşluk  \nb  ',
  'a\tb', '\tbaşta sekme', 'çok\nsatır\tsekme', '\t\n\t', 'a\r\nb', 'satır\rdönüş',
  'key: value', 'a: b\nc: d', 'sonu iki nokta:', 'abc:', '# yorum değil', 'a # b', 'a#b', 'satır\n# yorum gibi\n  # girintili', 'x\n---\ny',
  '"tırnaklı"', "'tek'", 'say "hi" # there', 'a "b', "it's", '\\ters bölü \\" ve "', '"', "'", '- liste gibi', '-', '[a, b]', '{a: 1}', '|', '>', '&anc', '*ref', '!tag', '%p', '@x', '`k`',
  'Işık İklim ğüşöç ıİ', 'emoji 🙂 ve ✨', 'ünicode\nçok satır ŞĞ', '\u00a0nbsp başta', 'sonda nbsp\u00a0', '\u2028ayırıcı',
  'x'.repeat(5000), ('uzun satır ' + 'y'.repeat(300) + '\n').repeat(5),
  '123', '-1.5', '1e5', '0123', '.5', '+7', 'true', 'False', 'null', 'NULL', '~', 'yes', 'no', 'on', 'off', 'NaN', '.inf', '', ' ', '  ', ' baştaboşluk', 'sondaboşluk ',
];

test('her zor metin değer olarak (eşleme, liste, iç içe) gidip geri gelir', () => {
  const bad = [];
  S.forEach((s) => {
    [{ type: 'markdown', content: s }, { list: [s, 'b'] }, { a: { b: [{ c: s, d: 1 }] } }, [s]].forEach((x) => {
      let y; try { y = J(Y.parse(Y.dump(x))); } catch (e) { y = 'HATA ' + e.message; }
      try { assert.deepStrictEqual(y, x); } catch (e) { bad.push(JSON.stringify(s).slice(0, 60) + ' in ' + JSON.stringify(Object.keys(Array.isArray(x) ? { arr: 1 } : x))); }
    });
  });
  assert.deepStrictEqual(bad, []);
});

test('zor anahtarlar ve sayı / mantık / null değerler', () => {
  const x = { 'a b': 1, '': 2, '123': 'x', 'true': false, 'k:v': null, 'a #b': [1, -2.5, 1e21, 0.1], '"q"': { 'x\ty': 'z' }, e: [], f: {}, g: [[], {}, [1, [2]]] };
  assert.deepStrictEqual(J(Y.parse(Y.dump(x))), x);
});

test('elle yazılmış YAML: değerin içindeki sekme korunur, girintideki sekme iki boşluk sayılır', () => {
  assert.deepStrictEqual(J(Y.parse('a: "x\ty"\nb: x\ty')), { a: 'x\ty', b: 'x\ty' });
  assert.deepStrictEqual(J(Y.parse('a:\n\tb: 1')), { a: { b: 1 } });
  assert.deepStrictEqual(J(Y.parse('content: |2-\n    girintili\n  düz')), { content: '  girintili\ndüz' });
});

test('girinti göstergesi yalnız gerektiğinde: sıradan çok satırlı metin bugünkü gibi yazılır', () => {
  assert.strictEqual(Y.dump({ type: 'markdown', content: '# Başlık\nmetin' }), 'type: markdown\ncontent: |-\n  # Başlık\n  metin');
  assert.strictEqual(Y.dump({ content: 'a\nb\n' }), 'content: |\n  a\n  b');
});
