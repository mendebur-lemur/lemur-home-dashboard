'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = (name) => fs.readFileSync(require('node:path').join(__dirname, '../src/', name), 'utf8');
const admin = read('admin.js'), card = read('panel-card.js');
const ctx = { window: {}, HTMLElement: class {}, lpIcon: (id) => '<ha-icon icon="' + id + '"></ha-icon>' };
vm.createContext(ctx);
const method = (source, name) => {
  const a = source.indexOf('  ' + name + '('), b = source.indexOf('\n  }\n', a);
  assert.ok(a >= 0 && b > a);
  return 'function ' + source.slice(a + 2, b + 4);
};
vm.runInContext(read('i18n.js') + '\n' + read('safe.js') + '\n' + card + '\nthis.html = lpTabSensors; this.Card = LemurHomeDashboardCard; this.clean = lhdCleanTabs; this.editor = ' + method(admin, '_tabSensorsHtml') + ';', ctx);
const state = (id, value, dc, extra) => ({ entity_id: id, state: value, attributes: Object.assign({ friendly_name: id, device_class: dc }, extra) });
function sensorRow(id, presence) {
  const el = { text: { textContent: '' }, active: false, getAttribute: () => id, hasAttribute: () => !!presence,
    querySelector(selector) { assert.equal(selector, '.ntval'); return this.text; }, classList: {} };
  el.classList.toggle = (key, value) => { el.active = value; };
  return el;
}

test('optional metadata: old tabs unchanged, configured IDs escaped and retained by cleaning', () => {
  assert.equal(ctx.html({}), '');
  assert.equal(ctx.html({ temperature_sensor: {} }), '');
  const tab = { id: 'room', temperature_sensor: 'sensor.temp', humidity_sensor: 'sensor.humidity', presence_sensor: 'binary_sensor.motion', sections: [] };
  assert.match(ctx.html(tab), /data-nav-sensor="sensor.temp"/);
  assert.match(ctx.html(tab), /data-presence/);
  assert.match(ctx.html(tab), /class="ntval"/);
  assert.equal(ctx.clean([tab])[0].presence_sensor, tab.presence_sensor);
  assert.match(ctx.html({ temperature_sensor: 'sensor.x" onmouseover="x' }), /&quot;/);
  assert.doesNotMatch(ctx.html({ temperature_sensor: 'sensor.x" onmouseover="x' }), /" onmouseover="/);
});

test('selectors filter types, put entity/device area matches first and keep missing selections', () => {
  const S = {
    'sensor.other': state('sensor.other', '20', 'temperature'),
    'sensor.local': state('sensor.local', '21', 'temperature'),
    'sensor.humidity': state('sensor.humidity', '40', 'humidity'),
    'binary_sensor.motion': state('binary_sensor.motion', 'off', 'motion'),
    'binary_sensor.presence': state('binary_sensor.presence', 'on', 'presence'),
    'binary_sensor.diy': state('binary_sensor.diy', 'on'),
    'binary_sensor.door': state('binary_sensor.door', 'on', 'door'),
    'sensor.power': state('sensor.power', '2', 'power')
  };
  const h = { _hass: { states: S, entities: { 'sensor.local': { device_id: 'd' }, 'binary_sensor.presence': { area_id: 'room' } }, devices: { d: { area_id: 'room' } } },
    _t: (k) => k, _ename: (id) => (S[id] || {}).entity_id || id };
  const html = ctx.editor.call(h, { area: 'room', humidity_sensor: 'sensor.missing' });
  const fields = html.split('<div class="fld">').slice(1);
  assert.ok(fields[0].indexOf('sensor.local') < fields[0].indexOf('sensor.other'));
  assert.doesNotMatch(fields[0], /sensor.humidity|sensor.power/);
  assert.match(fields[1], /value="sensor.missing" selected/);
  assert.match(fields[2], /binary_sensor.motion/);
  assert.match(fields[2], /binary_sensor.presence/);
  assert.match(fields[2], /binary_sensor.diy/);
  assert.doesNotMatch(fields[2], /binary_sensor.door/);
  assert.match(fields[0], /label for="tab-temperature_sensor"/);
  assert.match(fields[0], /id="tab-temperature_sensor"/);
});

test('live paint uses HA formatting and localized presence, handles unknown/missing and clears active state', () => {
  const a = sensorRow('sensor.temp'), b = sensorRow('sensor.humidity'), c = sensorRow('binary_sensor.motion', true);
  const h = { _lang: 'tr', _last: {}, _navSensors: [a, b, c], _hass: { states: {
    'sensor.temp': state('sensor.temp', '23.4', 'temperature', { unit_of_measurement: '°F' }),
    'sensor.humidity': state('sensor.humidity', '0', 'humidity', { unit_of_measurement: '%' }),
    'binary_sensor.motion': state('binary_sensor.motion', 'on', 'motion')
  } } };
  const paint = () => ctx.Card.prototype._navSensorsPaint.call(h);
  paint();
  assert.equal(a.text.textContent, '23.4 °F');
  assert.equal(b.text.textContent, '0 %');
  assert.equal(c.text.textContent, 'Var'); assert.equal(c.active, true);
  h._hass.formatEntityState = () => '23,4 °C'; paint();
  assert.equal(a.text.textContent, '23,4 °C');
  h._lang = 'en'; h._hass.states['binary_sensor.motion'] = state('binary_sensor.motion', 'off', 'motion'); paint();
  assert.equal(c.text.textContent, 'Absent'); assert.equal(c.active, false);
  for (const value of ['unknown', 'unavailable']) {
    h._hass.states['binary_sensor.motion'] = state('binary_sensor.motion', value, 'motion'); paint();
    assert.equal(c.text.textContent, value === 'unknown' ? '—' : 'Unavailable');
    assert.equal(c.active, false);
  }
  delete h._hass.states['sensor.temp']; paint(); assert.equal(a.text.textContent, 'Unavailable');
});
