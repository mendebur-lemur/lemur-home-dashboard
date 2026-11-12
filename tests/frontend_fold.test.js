// Cihaz ekle araması: I / ı / İ büyük-küçük dönüşümünde eşleşir (src/admin.js lhdFold)
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const line = src.split('\n').filter((l) => l.indexOf('const lhdFold = ') === 0)[0];
const lhdFold = new Function(line + '\nreturn lhdFold;')();
test('Turkish I forms fold together for search', () => {
  assert.ok(lhdFold('Monitör Işığı').indexOf(lhdFold('monitör ışığı')) >= 0);
  assert.ok(lhdFold('İyi Geceler').indexOf(lhdFold('iyi gece')) >= 0);
  assert.ok(lhdFold('Altıgen Panel').indexOf(lhdFold('ALTIGEN')) >= 0);
});
