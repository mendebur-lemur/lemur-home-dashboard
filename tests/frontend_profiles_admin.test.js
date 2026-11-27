// Yönetim panelinde profil kayıtları, geri alma ve yedekleme.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const adm = rd('admin.js'), store = rd('store.js'), safe = rd('safe.js');
const clone = (x) => JSON.parse(JSON.stringify(x));
const method = (name) => {
  const head = new RegExp('^  (async )?' + name + '\\(', 'm').exec(adm);
  assert.ok(head, name);
  const start = head.index + head[0].length - 1;
  const end = adm.indexOf('\n  }\n', start);
  return (head[1] || '') + 'function ' + adm.slice(start, end + 4);
};
const mainTabs = [{ id: 'home', sections: [] }];
const desktopTabs = [{ id: 'office', sections: [] }];
const base = { canvas: { width: 1280, ref_height: 1075 }, energy: { price: 1 }, season: 'winter', phone: { tabs: { order: ['home'] }, secs: { s: { hide: true } } } };

function host(profile = 'masaustu') {
  const S = { data: clone({ tabs: mainTabs, settings: base, profiles: { masaustu: { name: 'Masaüstü', tabs: desktopTabs } } }), subs: [], writes: [] };
  S.set = (key, value) => { S.writes.push([key, clone(value)]); return Promise.resolve(S.data); };
  const h = { _prof: profile, _tab: 'office', _undo: [], _render() {}, _toast() {}, _t: (k) => k };
  const c = vm.createContext({ STORE: S, h, lhdClone: clone, console, esc: (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'), localStorage: { setItem() {}, removeItem() {} } });
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' +
    store.slice(store.indexOf('const LP_OVR ='), store.indexOf('// Telefona özel görünüm')) + '\n' +
    adm.slice(adm.indexOf('const LHD_BK_KEYS'), adm.indexOf('const LHD_REPO')) + '\nthis.prep = lhdBkPrep;', c);
  ['_commit', '_commitBase', '_snap', '_histCur', '_histApply', '_undoIt', '_redoIt'].forEach((m) => {
    if (new RegExp('^  ' + m + '\\(', 'm').test(adm)) vm.runInContext('h.' + m + ' = ' + method(m), c);
  });
  h._profOwn = vm.runInContext('(function ' + adm.match(/^  (_profOwn\(.*)$/m)[1] + ')', c);
  if (!h._settings) h._settings = vm.runInContext('(function ' + adm.match(/^  (_settings\(.*)$/m)[1] + ')', c);
  return { h, S, c };
}

test('profil sekmeleri yalnız profiles anahtarına yazılır', async () => {
  const { h, S } = host();
  await h._commit('tabs', [{ id: 'new', sections: [] }]);
  assert.deepEqual(S.writes, [['profiles', { masaustu: { name: 'Masaüstü', tabs: [{ id: 'new', sections: [] }] } }]]);
  assert.deepEqual(S.data.tabs, mainTabs);
});

test('profil görünümü ve ev geneli ayarlar ayrılır, mevsim korunur', async () => {
  const { h, S } = host();
  const draft = clone(h._settings());
  draft.canvas.width = 2560;
  draft.energy.price = 2;
  S.data.settings.season = 'summer';
  await h._commit('settings', draft);
  assert.deepEqual(Object.fromEntries(S.writes), {
    profiles: { masaustu: { name: 'Masaüstü', tabs: desktopTabs, settings: { canvas: { width: 2560 } } } },
    settings: Object.assign(clone(base), { energy: { price: 2 }, season: 'summer' })
  });
});

test('ana panoda sekmeler ve ayarlar kendi anahtarlarına yazılır', async () => {
  const { h, S } = host(null);
  await h._commit('tabs', []);
  await h._commit('settings', { season: 'summer' });
  assert.deepEqual(S.writes, [['tabs', []], ['settings', { season: 'summer' }]]);
});

test('profil değiştirildikten sonra geri al ve ileri al doğru profili yazar ve o profile geçer', async () => {
  const { h, S } = host();
  const chosen = [];
  h._profSet = (id) => { chosen.push(id); h._prof = id; h._tab = null; };
  h._snap();
  const next = [{ id: 'new', sections: [] }];
  await h._commit('tabs', next);
  S.data.settings.season = 'summer';
  h._prof = null;
  h._tab = 'home';
  h._undoIt();
  assert.deepEqual(clone(S.data.profiles.masaustu.tabs), desktopTabs);
  // geri alınan değişiklik ekranda görünsün: değişikliğin yapıldığı profil seçilir
  assert.equal(h._prof, 'masaustu');
  h._prof = null;
  h._redoIt();
  assert.deepEqual(clone(S.data.profiles.masaustu.tabs), next);
  assert.equal(h._prof, 'masaustu');
  assert.deepEqual(chosen, ['masaustu', 'masaustu']);
  assert.deepEqual(S.writes.map(([k]) => k), ['profiles', 'profiles', 'profiles']);
  assert.equal(S.data.settings.season, 'summer');
});

test('yedek hazırlığı profil ve ana pano sekmelerini aynı şekilde temizler', () => {
  const { c } = host();
  const tabs = [{ id: 'home', sections: [{ entities: [{ entity: 'light.a', tap: { action: 'url', url_path: 'javascript:alert(1)' } }] }] }];
  const out = c.prep({ tabs, profiles: { masaustu: { name: 'Masaüstü', tabs }, shared: { name: 'Shared' } } }).V;
  assert.deepEqual(clone(out.profiles.masaustu.tabs), clone(out.tabs));
  assert.equal(out.profiles.masaustu.tabs[0].sections[0].entities[0].tap.url_path, undefined);
  assert.equal(Object.hasOwn(out.profiles.shared, 'tabs'), false);
});

function profileHost(profile) {
  const { h, S, c } = host(profile);
  const a = adm.indexOf('const lhdSlug = ');
  vm.runInContext(adm.slice(a, adm.indexOf('const lhdMove', a)), c);
  h._work = (id) => clone(id === null ? mainTabs : desktopTabs);
  ['_profSet', '_profNew', '_profRename', '_profDel', '_profDetach', '_profReset', '_profDash', '_setting', '_bgSet', '_profPicker', '_profDialog', '_profOverridesHtml'].forEach((m) => {
    if (new RegExp('^  (async )?' + m + '\\(', 'm').test(adm)) vm.runInContext('h.' + m + ' = ' + method(m), c);
  });
  return { h, S, c };
}

test('profil kopyası ana sekmeleri ve telefon düzenini alır; bağlı profil sekme saklamaz', async () => {
  const { h, S } = profileHost(null);
  delete S.data.profiles.masaustu;
  assert.equal(h._profNew('Masaüstü', 'copy'), 'masaustu');
  assert.deepEqual(clone(S.data.profiles.masaustu), { name: 'Masaüstü', tabs: mainTabs, settings: { phone: base.phone } });
  assert.notStrictEqual(S.data.profiles.masaustu.settings.phone, S.data.settings.phone);
  h._profSet('masaustu');
  const draft = clone(h._settings());
  draft.canvas.width = 2560;
  await h._commit('settings', draft);
  assert.deepEqual(clone(S.data.profiles.masaustu.settings.phone), base.phone);
  assert.equal(h._profNew('Masaüstü', 'link'), 'masaustu-2');
  assert.deepEqual(clone(S.data.profiles['masaustu-2']), { name: 'Masaüstü' });
});

test('bağlı düzen sekme yazmaz; ayırınca sekmeleri ve etkin telefon düzenini kopyalar', async () => {
  const { h, S } = profileHost(null);
  const toasts = [];
  h._toast = (...args) => toasts.push(args);
  const id = h._profNew('Tablet', 'link');
  h._profSet(id);
  assert.equal(await h._commit('tabs', desktopTabs), false);
  assert.deepEqual(toasts, [['profDetachFirst', false]]);
  assert.equal(Object.hasOwn(S.data.profiles[id], 'tabs'), false);
  await h._profDetach();
  assert.deepEqual(clone(S.data.profiles[id]), { name: 'Tablet', tabs: mainTabs, settings: { phone: base.phone } });
});

test('telefon düzeni bağlı profilde ana panodan gelir ve yalnız görünüm farkı saklanır', async () => {
  const { h, S } = profileHost(null);
  const id = h._profNew('Tablet', 'link');
  h._profSet(id);
  h._setting('phone.nav', 'rooms');
  assert.deepEqual(S.writes.at(-1)[1][id].settings.phone, { nav: 'rooms' });

  const layout = { tabs: { order: ['second', 'home'] }, order: { home: ['s2', 's'] }, secs: { s2: { hide: true } } };
  S.data.settings = Object.assign({}, S.data.settings, { phone: layout });
  assert.deepEqual(clone(h._settings().phone), { ...layout, nav: 'rooms' });

  S.data.profiles = { ...S.data.profiles, [id]: { name: 'Tablet', settings: { phone: { ...base.phone, nav: 'rooms' } } } };
  assert.deepEqual(clone(h._settings().phone), { ...layout, nav: 'rooms' });
  h._setting('canvas.width', 1920);
  assert.deepEqual(S.writes.at(-1)[1][id].settings.phone, { nav: 'rooms' });
  await h._profDetach();
  assert.deepEqual(S.writes.at(-1)[1][id].settings.phone, { ...layout, nav: 'rooms' });
});

test('telefonsuz ana düzenden ayrılırken boş profil ayarı gönderilmez', async () => {
  const { h, S } = profileHost(null);
  delete S.data.settings.phone;
  const id = h._profNew('Tablet', 'link');
  h._profSet(id);
  await h._profDetach();
  assert.deepEqual(S.writes.at(-1)[1][id], { name: 'Tablet', tabs: mainTabs });
});

test('eski profil kayıtları seçicide ve sınırda yoktur; kimlikleri yeniden kullanılmaz', () => {
  const { h, S, c } = profileHost(null);
  const legacy = { tab: 'home', note: 'eski' };
  S.data.profiles = { tablet: legacy, ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => ['legacy-' + i, {}])) };
  assert.equal(c.lpProfile(S.data, 'tablet'), null);
  assert.doesNotMatch(h._profPicker(), /value="(?:tablet|legacy-\d+)"/);
  assert.doesNotMatch(h._profPicker(), /value="\+" disabled/);
  assert.equal(h._profNew('Tablet', 'link'), 'tablet-2');
  assert.deepEqual(S.writes.at(-1)[1].tablet, legacy);
  for (let i = 0; i < 9; i++) assert.ok(h._profNew('Pano ' + i, 'link'));
  assert.match(h._profPicker(), /value="\+" disabled/);
  assert.equal(h._profNew('Fazla', 'link'), null);
});

test('profil zemini temizlenince ana panonun zemini görünmez', async () => {
  const { h, S, c } = profileHost();
  c.lpBgCss = () => '';
  S.data.settings.bg = { mode: 'color', color: '#123456' };
  S.data.settings.background = '#123456';
  h._bgSet(null);
  assert.deepEqual(S.writes.at(-1)[1].masaustu.settings, { bg: null, background: null });
  assert.equal(h._settings().bg, null);
  assert.equal(S.data.settings.bg.color, '#123456');
  await h._profReset('bg');
  assert.equal(h._settings().bg.color, '#123456');
});

test('profil adı değiştirilebilir, seçili profil silinince ana pano seçilir', async () => {
  const { h, S } = profileHost();
  await h._profRename('masaustu', 'Çalışma');
  assert.equal(S.data.profiles.masaustu.name, 'Çalışma');
  await h._profDel('masaustu');
  assert.equal(h._prof, null);
  assert.equal(Object.hasOwn(S.data.profiles, 'masaustu'), false);
});

test('ana değere dön yalnız seçili farkı siler', async () => {
  const { h, S } = profileHost();
  S.data.profiles.masaustu.settings = { canvas: { width: 2560, ref_height: 1440 }, header: { clock: false }, phone: { nav: 'rooms' } };
  await h._profReset('canvas.width');
  assert.deepEqual(clone(h._settings().canvas), { width: 1280, ref_height: 1440 });
  await h._profReset('header.clock');
  assert.equal(Object.hasOwn(S.data.profiles.masaustu.settings, 'header'), false);
  await h._profReset('phone');
  assert.deepEqual(clone(h._settings().phone), base.phone);
  assert.deepEqual(S.writes.map(([k]) => k), ['profiles', 'profiles', 'profiles']);
});

test('yeni profil metinleri Türkçe ve İngilizce aynı anahtarları taşır', () => {
  const c = vm.createContext({});
  vm.runInContext(adm.slice(adm.indexOf('const ADM ='), adm.indexOf('\n};', adm.indexOf('const ADM =')) + 3) + '\nthis.A = ADM;', c);
  const keys = (lang) => Object.keys(c.A[lang]).filter((x) => x.startsWith('prof')).sort();
  assert.ok(keys('tr').length > 0);
  assert.deepEqual(keys('tr'), keys('en'));
});

test('profil panosu aynı HA yolunu kullanır; hata olursa strateji YAML olarak gösterilir', async () => {
  const { h, c } = profileHost();
  const auto = rd('autodash.js');
  const start = auto.indexOf('async function lhdCreateDash(');
  if (start >= 0) vm.runInContext(auto.slice(start, auto.indexOf('\n}\n', start) + 2), c);
  vm.runInContext(auto.match(/^const LHD_STRAT = .*$/m)[0], c);
  const messages = [];
  let reject = false;
  h._hass = { panels: { 'lemur-masaustu': {} }, connection: { async sendMessagePromise(m) {
    messages.push(clone(m));
    if (m.type === 'lovelace/dashboards/list') return [];
    if (m.type === 'lovelace/config/save' && reject) throw Error('save');
    if (m.type === 'lovelace/dashboards/create') return { id: 'new_id' };
  } } };
  await h._profDash('masaustu');
  assert.deepEqual(messages[2], { type: 'lovelace/config/save', url_path: 'lemur-masaustu-2', config: { strategy: { type: 'custom:lemur-home-dashboard', profile: 'masaustu' } } });
  reject = true;
  await h._profDash('masaustu');
  assert.equal(h._modal, 'profYaml');
  assert.match(h._profYaml, /^strategy:\n  type: custom:lemur-home-dashboard\n  profile: "masaustu"\n$/);
  assert.deepEqual(messages.at(-1), { type: 'lovelace/dashboards/delete', dashboard_id: 'new_id' });
});

test('profilde kapalı kiosk seçilebilir; ana değere dön ana panonun kiosk ayarını getirir', async () => {
  const { h, S } = profileHost();
  S.data.settings.kiosk = { hide_header: 'all' };
  h._setting('kiosk.hide_header', null);
  assert.equal(h._settings().kiosk.hide_header, null);
  assert.equal(S.data.settings.kiosk.hide_header, 'all');
  assert.match(h._profOverridesHtml(), /data-profreset="kiosk.hide_header"/);
  await h._profReset('kiosk.hide_header');
  assert.equal(h._settings().kiosk.hide_header, 'all');
});

test('profil adı HTML olarak açılmaz; oluşturma formu kopyalama seçeneğiyle başlar', () => {
  const { h, S } = profileHost();
  S.data.profiles.masaustu.name = '<profil>';
  const picker = h._profPicker();
  assert.match(picker, /<select[^>]+data-prof[^>]+aria-label="profLabel"/);
  assert.match(picker, /value="masaustu" selected>&lt;profil&gt;/);
  assert.match(picker, /value="\+" ?[^>]*>profNew/);
  assert.match(h._profDialog('profNew'), /name="layout"><option value="copy">profCopy<\/option><option value="link">profLink/);
});

test('önizleme yeniden çizilirken profili kullanır ve açık panonun profilini geri bırakır', () => {
  const { c } = host();
  const card = rd('panel-card.js');
  const preview = card.slice(card.indexOf('  _previewProfile(fn)'), card.indexOf('  _render0()'));
  const setConfig = card.match(/^  setConfig\(.*$/m)[0];
  vm.runInContext(`
    const lpIsPhone = () => false;
    const card = { ${setConfig}, ${preview.replace(/}\n  _render\(/, '},\n  _render(')}
      , _hass: {}, _render0() { this.width = lpSettings().canvas.width; }
    };
    LP_PROF.id = 'pano';
    STORE.data.profiles.masaustu.settings = { canvas: { width: 2560 } };
    card.setConfig({ admin_preview: true, profile: 'masaustu' });
    this.sample = [card.width, LP_PROF.id];
    card._render();
    this.redraw = [card.width, LP_PROF.id];
  `, c);
  assert.deepEqual(clone(c.sample), [2560, 'pano']);
  assert.deepEqual(clone(c.redraw), [2560, 'pano']);
});
