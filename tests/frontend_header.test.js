'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = (name) => fs.readFileSync(path.join(__dirname, '../src/', name), 'utf8');
let now = new Date(2026, 10, 16, 23, 59).getTime();
class ClockDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
const ctx = { window: {}, HTMLElement: class {}, Date: ClockDate, settings: {}, lpIcon: (name) => '<svg data-icon="' + name + '"></svg>',
  LemurLightPopup: { update() {} }, LemurCardPopup: { update() {} } };
vm.createContext(ctx);
vm.runInContext(read('i18n.js') + '\n' + read('safe.js') + '\nfunction lpSettings() { return settings; }\nconst lhdClone = x => JSON.parse(JSON.stringify(x));\n' + read('panel-card.js') + '\nthis.Card = LemurHomeDashboardCard; this.cfg = lpHeaderCfg;', ctx);
function adminMethod(name) {
  const src = read('admin.js'), a = src.indexOf('  ' + name + '('), b = src.indexOf('\n  }\n', a);
  assert.ok(a >= 0 && b > a);
  return 'function ' + src.slice(a + 2, b + 4);
}
vm.runInContext('this.editor = ' + adminMethod('_headerRows') + '; this.setting = ' + adminMethod('_setting') + ';', ctx);
const weather = (state, temperature, unit) => ({ entity_id: 'weather.home', state, attributes: { friendly_name: 'Home', temperature, temperature_unit: unit } });
function card(settings, st) {
  ctx.settings = settings;
  const c = Object.create(ctx.Card.prototype);
  Object.assign(c, { _hass: { states: st ? { 'weather.home': st } : {} }, _lang: 'en', _header: ctx.cfg(), _time: () => '20:35', _last: {} });
  return c;
}
const plain = (v) => JSON.parse(JSON.stringify(v));

test('old settings keep only the clock; malformed settings and non-weather entity IDs are ignored', () => {
  for (const value of [undefined, null, [], 'broken', 12]) {
    ctx.settings = { header: value };
    assert.deepEqual(plain(ctx.cfg()), { clock: true, date: false, weather: false, entity: '' });
  }
  assert.equal(card({}, null)._headerHtml(), '20:35');
  ctx.settings = { header: { clock: false, date: true, weather: true, weather_entity: 'sensor.outside' } };
  assert.equal(ctx.cfg().clock, false); assert.equal(ctx.cfg().entity, '');
});

test('all eight clock/date/weather combinations render independently', () => {
  for (let bits = 0; bits < 8; bits++) {
    const c = card({ header: { clock: !!(bits & 1), date: !!(bits & 2), weather: !!(bits & 4), weather_entity: 'weather.home' } }, weather('sunny', 22.4, '°C'));
    const html = c._headerHtml();
    assert.equal(html.includes('20:35'), !!(bits & 1));
    assert.equal(html.includes('hdate'), !!(bits & 2));
    assert.equal(html.includes('Sunny'), !!(bits & 4));
    if (!bits) assert.equal(html, '');
  }
});

test('weather uses the source unit, accepts zero and omits invalid temperatures', () => {
  const c = card({ header: { clock: false, weather: true, weather_entity: 'weather.home' } }, weather('sunny', 0, '°C'));
  assert.match(c._headerHtml(), /Sunny · 0 °C/);
  c._hass.states['weather.home'] = weather('rainy', 32, '°F');
  assert.match(c._headerHtml(), /Rainy · 32 °F/);
  c._lang = 'tr'; c._hass.states['weather.home'] = weather('partlycloudy', 22.4, '°C');
  assert.match(c._headerHtml(), /Parçalı bulutlu · 22,4 °C/);
  for (const temp of [null, undefined, NaN, Infinity, '23']) {
    c._hass.states['weather.home'] = weather('sunny', temp, '°C');
    assert.doesNotMatch(c._headerHtml(), / · /);
  }
});

test('missing, unavailable and unknown weather never shows an old temperature; dynamic HTML is escaped', () => {
  const c = card({ header: { weather: true, weather_entity: 'weather.home' } });
  assert.match(c._headerHtml(), /Unavailable/);
  for (const state of ['unknown', 'unavailable']) {
    c._hass.states['weather.home'] = weather(state, 999, '°C');
    assert.doesNotMatch(c._headerHtml(), /999/);
  }
  c._hass.states['weather.home'] = weather('<script>alert(1)</script>', 12, '<img>');
  c._hass.states['weather.home'].attributes.friendly_name = 'x" onmouseover="bad';
  assert.doesNotMatch(c._headerHtml(), /<script>|<img>|" onmouseover="/);
  c._header.entity = '';
  assert.match(c._headerHtml(), /Choose a source/);
});

test('a weather state arriving or changing updates the header through the hass setter', () => {
  const c = card({ header: { weather: true, weather_entity: 'weather.home' } });
  const clock = { innerHTML: c._headerHtml() };
  Object.assign(c, { _config: { demo: true }, _sig: 'built', _watched: ['weather.home'], shadowRoot: { querySelector: () => clock },
    _render() { this._headerPaint(); this._last['weather.home'] = this._hass.states['weather.home']; } });
  c.hass = { states: { 'weather.home': weather('rainy', 10, '°C') } };
  assert.match(clock.innerHTML, /Rainy · 10 °C/);
  c.hass = { states: { 'weather.home': weather('sunny', 15, '°C') } };
  assert.match(clock.innerHTML, /Sunny · 15 °C/);
});

test('date changes after midnight; tick keeps the preview configuration instead of global settings', () => {
  now = new Date(2026, 10, 16, 23, 59).getTime();
  const c = card({ header: { clock: false, date: true } });
  const clock = { innerHTML: c._headerHtml() };
  assert.match(clock.innerHTML, /16 Nov/);
  c.shadowRoot = { querySelector: () => clock }; c._ticks = 0;
  ctx.settings = {};
  now += 60000; c._tick();
  assert.match(clock.innerHTML, /17 Nov/); assert.doesNotMatch(clock.innerHTML, /20:35/);
  c._lang = 'tr'; c._headerPaint(); assert.match(clock.innerHTML, /17 Kas/);
});

test('settings list only weather entities, keep a missing source, and label switches and selection', () => {
  ctx.settings = { header: { weather: true, weather_entity: 'weather.removed' } };
  const h = { _hass: { states: { 'weather.home': weather('sunny', 20, '°C'), 'sensor.other': {} } }, _t: (k) => k, _ename: (id) => id };
  const html = ctx.editor.call(h);
  assert.match(html, /value="weather.home"/); assert.match(html, /value="weather.removed" selected/);
  assert.doesNotMatch(html, /sensor.other/);
  assert.match(html, /role="switch" aria-checked="true" aria-labelledby="header-clock"/);
  assert.match(html, /label for="header-weather-entity"/);
  ctx.settings = { header: { weather: true } }; h._hass.states = {};
  assert.match(ctx.editor.call(h), /headerWeatherEmpty/);
});

test('settings save a hidden clock explicitly and restore its default without losing the weather source', () => {
  ctx.settings = { header: { weather_entity: 'weather.home' }, language: 'en' };
  const h = { _settings: () => ctx.settings, _snap() {}, _commit(key, value) { assert.equal(key, 'settings'); ctx.settings = value; }, _render() {}, _toast() {}, _t: (k) => k };
  ctx.setting.call(h, 'header.clock', false);
  assert.equal(ctx.cfg().clock, false); assert.equal(ctx.cfg().entity, 'weather.home');
  ctx.setting.call(h, 'header.clock', null);
  assert.equal(ctx.cfg().clock, true); assert.equal(ctx.settings.language, 'en');
});

test('unrelated updates do not rewrite header SVG markup normalized by the browser', () => {
  const c = card({ header: { weather: true, weather_entity: 'weather.home' } }, weather('sunny', 20, '°C'));
  let value = '', writes = 0;
  const clock = { get innerHTML() { return value.replace(/<svg/g, '<SVG'); }, set innerHTML(v) { value = v; writes++; } };
  c.shadowRoot = { querySelector: () => clock };
  c._headerPaint(); c._headerPaint(); assert.equal(writes, 1);
  c._hass.states['weather.home'] = weather('rainy', 18, '°C');
  c._headerPaint(); assert.equal(writes, 2);
});
