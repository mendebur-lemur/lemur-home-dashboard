// Yönetim panelindeki seçimlerin küçük resimleri (src/thumbs.js). Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/thumbs.js'), 'utf8');
const ctx = { esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]) };
vm.createContext(ctx);
vm.runInContext(src + '\nthis.T = { lhdTh, lhdSegX, lhdThLook };', ctx);
const T = ctx.T;

test('every option has a drawing without NaN', () => {
  const keys = ['icon_style:auto', 'icon_style:full', 'icon_style:mono', 'icon_style:tint', 'bright.look:auto', 'bright.look:box',
    'phone.nav:cats', 'phone.nav:rooms', 'phone.nav:top', 'phone.lights:auto', 'phone.lights:tiles', 'phone.lights:rows', 'phlook:tiles', 'phlook:rows',
    'season:auto', 'season:summer', 'season:winter', 'clim:', 'clim:halo', 'clim:rows', 'fill:', 'fill:1', 'align:', 'align:center', 'align:spread',
    'size:', 'size:2x1', 'size:1x2', 'size:2x2', 'size:row', 'gap:', 'gap:0', 'gap:24', 'cols:2', 'cols:5', 'nav:auto', 'nav:1', 'nav:2',
    'icon_size:', 'icon_size:l', 'text_size:s', 'text_size:m'];
  keys.forEach((k) => { const s = T.lhdTh(k); assert.ok(/^<svg class="th"/.test(s), k); assert.ok(!/NaN|undefined/.test(s), k); });
  assert.strictEqual(T.lhdTh('nothing:here'), '');
});
test('picker: drawings when any exist, plain buttons otherwise', () => {
  const a = T.lhdSegX((v) => 'data-x="' + v + '"', 'box', [['auto', 'A'], ['box', 'B']], 'bright.look');
  assert.ok(a.indexOf('<div class="vseg">') === 0 && /data-x="box" class="on"/.test(a) && (a.match(/<svg/g) || []).length === 2);
  const b = T.lhdSegX((v) => 'data-x="' + v + '"', '', [['', 'A'], ['1', 'B']], 'height');
  assert.ok(b.indexOf('class="seg"') > 0 && b.indexOf('<svg') < 0);
  ['tile', 'bar', 'phone', 'itile', 'ibutton', 'irow', 'ihalo'].forEach((k) => assert.ok(T.lhdThLook(k, [{ ic: '<i></i>', nm: 'Salon <b>' }]).indexOf('Salon &lt;b&gt;') > 0, k));
});
