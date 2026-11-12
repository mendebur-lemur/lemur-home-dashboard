// v0.36 pano düzeltmeleri: saat biçimi (12 / 24), ışık penceresi (ulaşılamayan lamba, hızlı iki dokunuş, bozuk özellikler),
// pencereler arası geçmiş adımı, şablon geri çağrılarının temizlenmesi.
// Çalıştır: node --test tests/frontend_dash036.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');

test('saat: HA time_format (12 / 24 / dile göre); Türkçe varsayılan 24 saat kalır', () => {
  const src = rd('panel-card.js');
  const m = /const LP_AMPM = [\s\S]*?\nfunction lpDayPeriod[\s\S]*?\n\}\n/.exec(src);
  assert.ok(m, 'lpAmPm / lpDayPeriod bulunamadı');
  const ctx = { Intl, Date };
  vm.createContext(ctx);
  vm.runInContext(m[0] + '; this.lpAmPm = lpAmPm; this.lpDayPeriod = lpDayPeriod;', ctx);
  const h = (f, l) => ({ locale: { language: l, time_format: f } });
  assert.strictEqual(ctx.lpAmPm(h('language', 'tr')), false);
  assert.strictEqual(ctx.lpAmPm(h('language', 'en')), true);
  assert.strictEqual(ctx.lpAmPm(h('12', 'tr')), true);
  assert.strictEqual(ctx.lpAmPm(h('24', 'en')), false);
  assert.strictEqual(ctx.lpAmPm({}), false);                    // eski HA: ayar yok, 24 saat
  assert.strictEqual(ctx.lpAmPm(h('language', 'xx-!!')), false); // geçersiz dil hata atmaz
  assert.match(ctx.lpDayPeriod(new Date(2026, 0, 1, 22, 0), 'en'), /PM/);
});

test('şablon: kart sökülünce geri çağrısı silinir', () => {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(rd('tpl.js') + '; this.lpTpl = lpTpl; this.lpTplOff = lpTplOff; this.LP_TPL = LP_TPL;', ctx);
  const T = '{{ 1 }}', cbs = [];
  for (let i = 0; i < 50; i++) { const f = () => {}; ctx.lpTpl(null, T, f); ctx.lpTplOff(f); cbs.push(f); }
  assert.strictEqual(ctx.LP_TPL.m[T].cbs.length, 0);
  const keep = () => {}; ctx.lpTpl(null, T, keep);
  assert.strictEqual(ctx.LP_TPL.m[T].cbs.length, 1);
});

function lightCtx() {
  const ctx = { window: {}, document: {}, Date, Math, Object, Array, JSON, setTimeout, clearTimeout, LEC: { installed: () => false } };
  vm.createContext(ctx);
  vm.runInContext(rd('lightpop.js') + '; this.LemurLightPopup = LemurLightPopup; this.LP_POP = LP_POP; this.lpPopTake = lpPopTake;', ctx);
  return ctx;
}
function lamp(ctx, state, attrs) {
  const calls = [];
  const p = Object.create(ctx.LemurLightPopup.prototype);
  p._id = 'light.a'; p._pan = null; p._room = null;
  p._h = { states: { 'light.a': { entity_id: 'light.a', state: state, attributes: attrs || {} } }, entities: {},
    callService: (d, s, x) => { calls.push(d + '.' + s); return null; } };
  return { p, calls };
}

test('ışık penceresi: ulaşılamayan lambaya komut gitmez', () => {
  const ctx = lightCtx();
  const { p, calls } = lamp(ctx, 'unavailable', { supported_color_modes: ['hs'] });
  p._power('light.a'); p._call('turn_on', 'light.a', { brightness_pct: 40 });
  assert.deepStrictEqual(calls, []);
  p._h.states['light.a'] = Object.assign({}, p._h.states['light.a'], { state: 'off' });
  p._power('light.a');
  assert.deepStrictEqual(calls, ['light.turn_on']);
});

test('ışık penceresi: cevap gelmeden ikinci dokunuş beklenen durumu tersine çevirir (açık aç / kapat)', () => {
  const ctx = lightCtx();
  const { p, calls } = lamp(ctx, 'off');
  p._toggle('light.a'); p._toggle('light.a'); p._toggle('light.a');
  assert.deepStrictEqual(calls, ['light.turn_on', 'light.turn_off', 'light.turn_on']);
  assert.strictEqual(p._eff('light.a').state, 'on');
});

test('ışık penceresi: liste olmayan supported_color_modes / effect_list hata atmaz', () => {
  const ctx = lightCtx();
  const { p } = lamp(ctx, 'on', { supported_color_modes: 'hs', effect_list: 'Rainbow' });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(p._caps('light.a'))), { color: false, ct: false, dim: false, fx: false });
  ctx.LP_POP.cur = { set hass(h) { throw new Error('x'); } };
  assert.doesNotThrow(() => ctx.LemurLightPopup.update({}));
});

test('pencere değişimi: geçmiş adımı yeni pencereye geçer, ikinci adım eklenmez', () => {
  const ctx = lightCtx();
  const old = { _pushed: true, close(f) { this.nav = f; this._closed = true; } };
  ctx.LP_POP.cur = old;
  assert.strictEqual(ctx.lpPopTake(), true);
  assert.strictEqual(old.nav, true);          // eski pencere geçmişe dokunmadan kapanır
  ctx.LP_POP.cur = null;
  assert.strictEqual(ctx.lpPopTake(), false);  // açık pencere yok: yeni adım eklenir
});
