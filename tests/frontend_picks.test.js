// Önerilen ürünler (src/picks.js): liste, telefon bulma, linkler. Çalıştır: node --test tests/
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/picks.js'), 'utf8');
const picks = JSON.parse(fs.readFileSync(path.join(__dirname, '../library/picks.json'), 'utf8'));
function load() {
  const ctx = { localStorage: { getItem: () => null, setItem: () => {} }, JSON: JSON, LHD_PICKS: picks, Date: Date };
  vm.createContext(ctx);
  vm.runInContext(src + '\nthis.P = { lhdMaSlug, lhdPhones, lhdHttps, LHDPicks, lhdQrSvg, lhdPickSend };', ctx);
  return ctx.P;
}
test('the bundled list is used and every link is https', () => {
  const P = load();
  assert.ok(P.LHDPicks.get().items.length > 10);
  P.LHDPicks.get().items.forEach((x) => Object.keys(x.buy || {}).forEach((k) => assert.ok(P.lhdHttps(x.buy[k]), x.id + ' ' + k)));
  assert.strictEqual(P.lhdHttps('javascript:alert(1)'), '');
  assert.strictEqual(P.lhdHttps('https://x.y/a"b'), '');
});
test('mobile app service name follows HA slugify', () => {
  const P = load();
  assert.strictEqual(P.lhdMaSlug('Ali iPhone’u'), 'ali_iphoneu');
  assert.strictEqual(P.lhdMaSlug('Galaxy S26 Ultra'), 'galaxy_s26_ultra');
  assert.strictEqual(P.lhdMaSlug("Ali's iPhone"), 'ali_s_iphone');
  assert.strictEqual(P.lhdMaSlug('Çalışma Odası Tablet'), 'calisma_odasi_tablet');
});
test("the logged-in person's phones are found, others' are not", () => {
  const P = load();
  const hass = { user: { id: 'u1' },
    services: { notify: { mobile_app_benim_telefon: {}, mobile_app_esin_telefonu: {} } },
    states: { 'person.ben': { attributes: { user_id: 'u1', device_trackers: ['device_tracker.bt'] } }, 'person.es': { attributes: { user_id: 'u2', device_trackers: ['device_tracker.et'] } } },
    entities: { 'device_tracker.bt': { platform: 'mobile_app', device_id: 'd1' }, 'device_tracker.et': { platform: 'mobile_app', device_id: 'd2' } },
    devices: { d1: { name: 'Benim Telefon' }, d2: { name: 'Eşin Telefonu' } } };
  const f = P.lhdPhones(hass);
  assert.strictEqual(f.length, 1);
  assert.strictEqual(f[0].svc, 'mobile_app_benim_telefon');
  // kişi eşleşmezse: evde tek telefon varsa o, birden fazlaysa hiçbiri
  assert.strictEqual(P.lhdPhones({ user: { id: 'x' }, services: { notify: { mobile_app_tek: {} } }, states: {} }).length, 1);
  assert.strictEqual(P.lhdPhones({ user: { id: 'x' }, services: { notify: { mobile_app_a: {}, mobile_app_b: {} } }, states: {} }).length, 0);
});
test('sending opens the link from the notification on iPhone and Android', async () => {
  const P = load(); let call = null;
  await P.lhdPickSend({ callService: (d, s, data) => { call = [d, s, data]; return Promise.resolve(); } }, { svc: 'mobile_app_x' }, { name: 'Ürün', buy: { hb: 'https://lemur.run/a' } }, 'hb', 'tr');
  assert.strictEqual(call[0], 'notify'); assert.strictEqual(call[1], 'mobile_app_x');
  assert.strictEqual(call[2].data.url, 'https://lemur.run/a'); assert.strictEqual(call[2].data.clickAction, 'https://lemur.run/a');
});
test('QR code is drawn', () => {
  assert.ok(/<svg/.test(load().lhdQrSvg('https://lemur.run/abc')));
});
