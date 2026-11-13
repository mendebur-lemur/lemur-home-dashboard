// v0.36: ışık dışı cihazlar. Kilit karosuna dokunma, sade satırdaki süpürge ve iklim düğmeleri (yalnız desteklenenler), medya satırı taşması.
// Çalıştır: node --test "tests/*.test.js"
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const panel = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../src/base.css'), 'utf8');
const pick = (src, re) => { const m = src.match(re); assert.ok(m, 'bulunamadı: ' + re); return m[0]; };

function klass(method, extra) {
  const ctx = Object.assign({ esc: (s) => String(s), t: (l, k) => k, lpClW: (m, l, v) => v, LP_VAC: {}, LP_FANW: {}, LP_HVAC: {}, LP_HACT: {}, lpEnPct: (v) => v + '%',
    lpNum: () => null, lpIcon: () => '', lpEntIcon: () => '' }, extra || {});
  vm.createContext(ctx);
  vm.runInContext(pick(panel, /const LP_NOTOG = [^\n]*\n/) + 'class X {' + method + '}; this.X = X;', ctx);
  return ctx.X;
}

test('kilit ve alarm karosuna dokununca cihaz penceresi açılır, homeassistant.toggle gitmez', () => {
  const fired = [], calls = [];
  const X = klass(pick(panel, /\n  _act\(a, id, def, hold\) \{[\s\S]*?\n  \}\n/), {
    lpFire: (el, ev, d) => fired.push(ev + ':' + d.entityId), lpTwinOf: () => null, LP_OPT: { pend: {} }, LemurCardPopup: {}, lhdIsObj: () => true, lhdSafeUrl: () => false });
  const x = new X();
  x._hass = { states: { 'lock.kapi': { state: 'locked' }, 'alarm_control_panel.ev': { state: 'disarmed' }, 'switch.priz': { state: 'off' } },
    callService: (d, s, data) => { calls.push(d + '.' + s + ':' + data.entity_id); return Promise.resolve(); } };
  x._optTap = () => {};
  x._act(undefined, 'lock.kapi', 'toggle');
  x._act('toggle', 'alarm_control_panel.ev');
  x._act(undefined, 'switch.priz', 'toggle');
  assert.deepStrictEqual(fired, ['hass-more-info:lock.kapi', 'hass-more-info:alarm_control_panel.ev']);
  assert.deepStrictEqual(calls, ['homeassistant.toggle:switch.priz']);
});

function clr(st, vac) {
  const X = klass(pick(panel, /\n  _paintClr\(el\) \{[\s\S]*?\n  \}\n/));
  const x = new X();
  x._hass = { states: { [st.entity_id]: st } }; x._lang = 'tr'; x._tx = (s) => s || '';
  const el = { _item: { entity: st.entity_id }, _open: true, classList: { contains: (c) => c === 'vac' && vac }, className: '', innerHTML: '' };
  x._paintClr(el);
  return (el.innerHTML.match(/data-c="[a-z]+"/g) || []).map((s) => s.slice(8, -1));
}

test('sade satırdaki süpürge yalnız desteklediği düğmeleri gösterir', () => {
  const full = clr({ entity_id: 'vacuum.a', state: 'docked', last_updated: '1', attributes: { supported_features: 4 | 8 | 16 | 32 | 512 | 8192, fan_speed_list: ['a'] } }, true);
  ['vstart', 'vdock', 'vstop', 'vloc', 'vfan'].forEach((c) => assert.ok(full.indexOf(c) >= 0, c));
  // başlat ve istasyona dön var; duraklat, durdur, bul yok (temizlerken)
  const basit = clr({ entity_id: 'vacuum.b', state: 'cleaning', last_updated: '1', attributes: { supported_features: 16 | 4096 | 8192 } }, true);
  assert.deepStrictEqual(basit.filter((c) => c.charAt(0) === 'v'), ['vdock']);
  // temizlerken duraklatma yok ama durdurma var: ana düğme durdur, ayrı Durdur çipi tekrarlanmaz
  const dur = clr({ entity_id: 'vacuum.c', state: 'cleaning', last_updated: '1', attributes: { supported_features: 8 | 8192 } }, true);
  assert.deepStrictEqual(dur.filter((c) => c.charAt(0) === 'v'), ['vstop']);
  // özelliği bildirmeyen süpürge: hepsi (eski davranış)
  const eski = clr({ entity_id: 'vacuum.d', state: 'docked', last_updated: '1', attributes: {} }, true);
  ['vstart', 'vdock', 'vstop', 'vloc'].forEach((c) => assert.ok(eski.indexOf(c) >= 0, c));
});

test('sade satırdaki iklim: kapatılamayan cihazda Güç çıkmaz', () => {
  const noOff = clr({ entity_id: 'climate.v', state: 'auto', last_updated: '1', attributes: { hvac_modes: ['heat', 'auto'], temperature: 20, supported_features: 1 } });
  assert.ok(noOff.indexOf('pw') < 0);
  const trv = clr({ entity_id: 'climate.t', state: 'heat', last_updated: '1', attributes: { hvac_modes: ['heat', 'off'], temperature: 20, supported_features: 1 } });
  assert.ok(trv.indexOf('pw') >= 0);
  const ac = clr({ entity_id: 'climate.a', state: 'cool', last_updated: '1', attributes: { hvac_modes: ['cool'], temperature: 20, supported_features: 1 | 128 | 256 } });
  assert.ok(ac.indexOf('pw') >= 0);
  const off = clr({ entity_id: 'climate.o', state: 'off', last_updated: '1', attributes: { hvac_modes: ['off', 'cool'], temperature: 20, supported_features: 1 } });
  assert.ok(off.indexOf('pw') >= 0);
});

test('medya satırı kutudan taşmaz (esnek öğe en küçük boyu)', () => {
  assert.ok(/\n\.row \{[^}]*min-width: 0/.test(css));
});
