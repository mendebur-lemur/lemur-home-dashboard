'use strict';
// Telefon başlığı: Saatte parlaklık + tarih / hava durumu açıkken uzun oda adı parlaklık değerini kendi satırına itmesin
// (ad ile saat satırı arasında boş bant kalıyordu, 0.36.0b8). Ad ilk satırda kalan yeri alır, saat satırı yine alta iner.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const css = fs.readFileSync(path.join(__dirname, '../src/base.css'), 'utf8');
const rule = (sel) => { const i = css.indexOf(sel + ' {'); return i < 0 ? null : css.slice(i, css.indexOf('}', i)); };

test('brightness header with date/weather: the name shrinks instead of pushing the value to its own line', () => {
  const r = rule('.phone .phd.bbar.hasinfo > b');
  assert.ok(r, 'rule exists');
  assert.match(r, /flex:\s*1 1 0px/);
});
test('the name rule does not apply to the plain header (there the clock row has basis 100% and would share the line)', () => {
  assert.equal(rule('.phone .phd.hasinfo > b'), null);
  assert.match(rule('.phone .phd .clock.hinfo'), /flex:\s*1 1 100%/);
  assert.match(rule('.phone .phd.bbar'), /gap:\s*10px/);   // gap + 100% basis: the clock row always wraps below the name
});
