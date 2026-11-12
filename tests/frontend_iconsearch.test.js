// Simge araması kelime kelime (lhdIcTerms / lhdIcHit, src/admin.js): yanlış eşleşme yok, gerçek eşleşmeler kalır.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const s = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const a = s.indexOf('const LHD_ICON_TR = '), b = s.indexOf('const LHD_ICONS = {', a);
const ctx = {}; vm.createContext(ctx); vm.runInContext(s.slice(a, b) + '\nthis.T = lhdIcTerms; this.H = lhdIcHit; this.W = lhdIcWords;', ctx);
const keys = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, '../custom_components/lemur_home_dashboard/frontend/mdi-color.json'), 'utf8')));
const nz = (x) => x.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
const find = (q) => { const t = ctx.T(nz(q.toLowerCase())), W = ctx.W(keys); return keys.filter((k) => ctx.H(k, t, W)); };
const has = (q, yes, no) => { const r = find(q); yes.forEach((x) => assert.ok(r.includes(x), q + ' → ' + x)); (no || []).forEach((x) => assert.ok(!r.includes(x), q + ' ↛ ' + x)); };

test('false matches are gone', () => {
  has('çamaşır', ['lhd:laundry-basket'], ['mdi:window-closed', 'mdi:window-open']);
  has('kapı', ['mdi:door', 'mdi:door-open', 'lhd:garage-door-sectional'], ['lhd:ac-outdoor-unit', 'mdi:outdoor-lamp']);
  has('door', ['mdi:door'], ['lhd:ac-outdoor-unit']);
  has('kilit', ['mdi:lock', 'lhd:lock-padlock'], ['mdi:clock']);
  has('çay', ['lhd:tea-glass'], ['mdi:kettle-steam']);
  has('air', ['mdi:air-conditioner'], ['mdi:stairs', 'mdi:hair-dryer']);
});
test('true matches stay: word prefix, Turkish suffixes, compound words, :ac-', () => {
  has('lambalar', ['mdi:lamp']); has('kapısı', ['mdi:door']); has('ışıklar', ['mdi:lightbulb', 'lhd:ceiling-skylight']);
  has('bulb', ['mdi:lightbulb']); has('book', ['mdi:bookshelf', 'lhd:ebook-reader']); has('chair', ['mdi:chair-rolling']);
  has('iklim', ['mdi:thermostat', 'lhd:ac-cassette']); has('cam', ['mdi:window-closed', 'mdi:webcam']); has('ka', ['mdi:door', 'mdi:coffee']);
  has('lec_ceiling', []); assert.ok(ctx.H('ceiling_light', ctx.T('light'), ctx.W(['ceiling_light'])), 'LEC keys with _');
});
