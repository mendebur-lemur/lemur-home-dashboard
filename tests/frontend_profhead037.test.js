// PR #35 tarayıcı turu: yönetim panelinin üst şeridine profil seçici eklenince 1100-1400 px arasında (1280 px dizüstü, EN'de
// 1024-1366 px) Basit / Gelişmiş anahtarı alt alta düşüyor, şerit 70 px'e çıkıp taşıyordu (ux/dbg35/tarayici/repro/r01_baslik.js).
// Çalıştır: node --test tests/frontend_profhead037.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join(__dirname, '../src/admin.css'), 'utf8');
const adm = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');

// kuralın gövdesi (ilk eşleşen seçici)
const body = (sel, from) => { const i = css.indexOf(sel + ' {', from || 0); return i < 0 ? null : css.slice(i, css.indexOf('}', i)); };

test('Üst şeritte profil seçici var (testin dayandığı yapı)', () => {
  assert.ok(/<div class="profbar">/.test(adm) && /this\._profPicker\(\) \+ '<div class="grow">/.test(adm));
});

test('Basit / Gelişmiş anahtarı üst şeritte daralmaz ve alt satıra kırılmaz (her genişlikte)', () => {
  const b = body('.top.hasprof .modeseg');
  assert.ok(b, '.top.hasprof .modeseg kuralı yok');
  assert.ok(/flex:\s*none/.test(b), 'anahtar daralmamalı: ' + b);
  assert.ok(/flex-wrap:\s*nowrap/.test(b), 'anahtar alt satıra kırılmamalı: ' + b);
  // .seg genel kuralından (flex-wrap: wrap) sonra gelmeli: aynı özgüllükte sıra kazanır değil ama .top .modeseg daha özgül; yine de sonra
  assert.ok(css.indexOf('.top.hasprof .modeseg {') > css.indexOf('.seg { display: inline-flex;'));
  assert.ok(/\.top\.hasprof \.modeseg button \{ white-space: nowrap; \}/.test(css), 'düğme yazıları kırılmamalı');
});

test('1400 px\'e kadar yıldız / önerilen yalnız simge ve "Otomatik düzen" rozeti gizli (seçiciye yer kalsın)', () => {
  const i = css.indexOf('@media (max-width: 1400px)');
  assert.ok(/class="top' \+ \(this\._profPicker\(\) \? ' hasprof' : ''\)/.test(adm), 'şerit profil varken .hasprof almalı');
  assert.ok(i > 0, '1400 px kırılımı yok');
  const blk = css.slice(i, css.indexOf('\n}', i));
  assert.ok(/\.top\.hasprof \.badge \{ display: none; \}/.test(blk), blk);
  assert.ok(/\.top\.hasprof \.stb \.l, \.top\.hasprof \.shb \.l \{ display: none; \}/.test(blk), blk);
});
