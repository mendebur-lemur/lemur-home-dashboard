// Ayarlar → Sürüm → "Güncellemeleri denetle" (_updCheck): beta sürümleri (0.36.0b8) kararlı sürümden (0.36.0) ve bir sonraki
// betadan (0.36.0b9) eski sayılır. Eskiden "0b8" sayısı 0 okunuyordu: 0.36.0b8'deki kullanıcıya 0.36.0 çıkınca "güncel" deniyordu.
// Çalıştır: node --test tests/frontend_update_beta.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');

function check(cur, ent, gh) {
  const src = rd('admin.js'), a = src.indexOf('  async _updCheck() {'), b = src.indexOf('\n  }\n', a);
  assert.ok(a > 0 && b > a, '_updCheck bulunamadı');
  const ctx = { setTimeout: (f) => f(), fetch: async () => ({ json: async () => gh || {} }), PANEL_VERSION: cur, LHD_REPO_URL: /^https:\/\/github\.com\/mendebur-lemur\/lemur-home-dashboard(\/|$)/i };
  vm.createContext(ctx);
  vm.runInContext('this.f = async function ' + src.slice(a + 8, b + 4).replace(/^_updCheck/, '') + ';', ctx);
  const h = { _lang: 'tr', st: null, _upd: {} };
  h._hass = { connection: { sendMessagePromise: async (m) => { if (m.type === 'lemur_home_dashboard/info') return { version: cur }; throw new Error('unknown'); } } };
  h._updEnt = () => ent || null;
  h._updSet = (o) => { h.st = Object.assign({}, h.st, o); };
  return ctx.f.call(h).then(() => h.st);
}
const ENT = (latest, inst) => ({ entity_id: 'update.lemur_home_dashboard_update', attributes: { latest_version: latest, installed_version: inst, release_url: 'https://github.com/mendebur-lemur/lemur-home-dashboard/releases/tag/v' + latest } });

test('beta → kararlı: 0.36.0b8 kuruluyken 0.36.0 yeni sürüm', async () => {
  assert.strictEqual((await check('0.36.0b8', ENT('0.36.0', '0.36.0b8'))).st, 'new');
  assert.strictEqual((await check('0.36.0b8', null, { tag_name: 'v0.36.0', html_url: 'https://github.com/mendebur-lemur/lemur-home-dashboard/releases/tag/v0.36.0' })).st, 'new');
});
test('beta → sonraki beta (HACS\'ta beta açık): 0.36.0b9 yeni', async () => {
  assert.strictEqual((await check('0.36.0b8', ENT('0.36.0b9', '0.36.0b8'))).st, 'new');
});
test('HACS indirdi, yeniden başlatılmadı: "yeniden başlat" denir', async () => {
  assert.strictEqual((await check('0.36.0b8', ENT('0.36.0', '0.36.0'))).st, 'installed');
});
test('değişmeyenler: aynı sürüm güncel, kararlıdan eski betaya inilmez, yama sürümü yeni', async () => {
  assert.strictEqual((await check('0.36.0', ENT('0.36.0', '0.36.0'))).st, 'ok');
  assert.strictEqual((await check('0.36.0', ENT('0.36.0b8', '0.36.0'))).st, 'ok');
  assert.strictEqual((await check('0.35.1', ENT('0.36.0', '0.35.1'))).st, 'new');
  assert.strictEqual((await check('0.36.0', ENT('0.36.1', '0.36.0'))).st, 'new');
  assert.strictEqual((await check('0.36.0', ENT('0.37.0b1', '0.36.0'))).st, 'new');
  assert.strictEqual((await check('0.36.0b8', ENT('v0.36.0b8', 'v0.36.0b8'))).st, 'ok');
});
