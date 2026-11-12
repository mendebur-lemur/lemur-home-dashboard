// 0.35.1 -> 0.36.0b3 görünüm gerilemeleri (regress turu): CSS kurallarının kapsamı ve sırası.
// Çalıştır: node --test tests/frontend_regress036.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

test('Orta hizalama: başlıklı kutunun son öğesi telefonun 8 px alt boşluğunu ezer (0.35.1 ile aynı yükseklik)', () => {
  const css = rd('base.css');
  const a = css.indexOf('.box.al-center > .title ~ :last-child { margin-bottom: auto; }');
  const b = css.indexOf('.phone .box.spread > .emb, .phone .box.spread > .row {');
  assert.ok(a > 0, 'başlıklı kutu kuralı yok');
  assert.ok(b > 0 && a > b, 'kural telefon kuralından sonra gelmeli (aynı özgüllük, sıra kazanır)');
  assert.ok(/\.box\.al-center > :last-child \{ margin-bottom: auto; \}/.test(css), 'başlıksız kutu kuralı da kalır');
});

test('Telefon yönetim paneli: 40 px satır yalnız hâle satırlarında (diğer "Duruma göre renk" satırları 36 px kalır)', () => {
  const css = rd('admin.css');
  const m = css.slice(css.indexOf('.scxm .fld { margin: 0; }'));
  const blk = m.slice(m.indexOf('@media (max-width: 600px)'), m.indexOf('\n}', m.indexOf('@media (max-width: 600px)')));
  assert.ok(blk.length > 20, 'telefon bloğu bulunamadı');
  assert.ok(!/(^|[\s,])\.scr (\.inp|input)/m.test(blk), '.scr satır kuralı .scx ile sınırlı olmalı: ' + blk);
  assert.ok(/\.scr\.scx \.inp/.test(blk) && /\.scr\.scx input\[type=color\]/.test(blk));
});
