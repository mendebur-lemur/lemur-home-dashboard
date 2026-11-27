// Pano profilleri: ortak ayarlar, profil katmanı ve telefon görünümü.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const safe = rd('safe.js'), store = rd('store.js');
const plain = (v) => JSON.parse(JSON.stringify(v));

function profileContext(data, extra) {
  const window = { __LEMUR_HOME_DASHBOARD_STORE: { data } };
  const ctx = vm.createContext(Object.assign({ window }, extra));
  vm.runInContext(safe.split('\n// Canlı abonelik')[0] + '\n' + store, ctx);
  return ctx;
}

test('profil ayarları bir seviyede birleşir, ev geneli ana ayarda kalır', () => {
  const c = profileContext();
  const base = { canvas: { width: 1280, ref_height: 1075 }, bg: { mode: 'dark' }, season: 'winter' };
  assert.deepEqual(plain(c.lpProfMerge(base, { canvas: { width: 2560 } })), {
    canvas: { width: 2560, ref_height: 1075 }, bg: { mode: 'dark' }, season: 'winter'
  });
  assert.equal(c.lpProfMerge(base, {}), base);
  const home = { header: { clock: true, weather_entity: 'weather.home' }, energy: { price: 4 }, season: 'winter' };
  assert.deepEqual(plain(c.lpProfMerge(home, {
    header: { clock: false, weather_entity: 'weather.other' }, energy: { price: 1 }, season: 'summer'
  })), { header: { clock: false, weather_entity: 'weather.home' }, energy: { price: 4 }, season: 'winter' });
});

test('telefon ayarı bütün olarak değişir ve telefon görünümü en son uygulanır', () => {
  const c = profileContext();
  const base = { bg: { mode: 'dark' }, phone: { nav: 'cats', tabs: { order: ['a'] } } };
  assert.deepEqual(plain(c.lpProfMerge(base, { phone: { nav: 'rooms' } }).phone), { nav: 'rooms' });
  const over = { bg: { mode: 'black' }, phone: { style: { bg: { mode: 'color', color: '#123456' } } } };
  const merged = c.lpProfMerge(base, over);
  assert.equal(merged.bg.mode, 'black');
  assert.deepEqual(plain(c.lpPhoneMerge(merged).bg), over.phone.style.bg);
});

test('birleşik ayar önbelleği ayar, profil haritası ve profil kimliğine bağlıdır', () => {
  const c = profileContext();
  const profiles = { masaustu: { name: 'Masaüstü', settings: { canvas: { width: 2560 } } }, tablet: { name: 'Tablet', settings: { canvas: { width: 1280 } } } };
  const data = { settings: { canvas: { ref_height: 1075 } }, profiles };
  const first = c.lpProfSettings(data, 'masaustu');
  assert.equal(c.lpProfSettings(Object.assign({}, data), 'masaustu'), first);
  const next = Object.assign({}, data, { profiles: Object.assign({}, profiles) });
  assert.notEqual(c.lpProfSettings(next, 'masaustu'), first);
  assert.equal(c.lpProfSettings(next, 'tablet').canvas.width, 1280);
  const fresh = Object.assign({}, next, { settings: { canvas: { ref_height: 800 } } });
  assert.equal(c.lpProfSettings(fresh, 'tablet').canvas.ref_height, 800);
});

test('bağlı ve bilinmeyen profiller ana sekmeleri kullanır, boş profil dizisi ayrı düzendir', () => {
  const c = profileContext();
  const data = { tabs: [{ id: 'ana' }], profiles: { linked: { name: 'Bağlı' }, empty: { name: 'Boş', tabs: [] }, own: { name: 'Ayrı', tabs: [{ id: 'other' }] } } };
  for (const id of ['missing', 'linked', '__proto__']) {
    assert.equal(c.lpProfTabs(data, id), data.tabs);
    assert.equal(c.lpProfOwnTabs(data, id), false);
  }
  assert.equal(c.lpProfile(data, '__proto__'), null);
  assert.equal(c.lpProfTabs(data, 'empty'), data.profiles.empty.tabs);
  assert.equal(c.lpProfOwnTabs(data, 'empty'), true);
  assert.deepEqual(plain(c.lpAllTabs(data)), [{ id: 'ana' }, { id: 'other' }]);
});

test('birleşik düzenleme yalnız farkları saklar ve ev geneli ayarları ayırır', () => {
  const c = profileContext();
  const base = {
    canvas: { width: 1280, ref_height: 1075 }, header: { clock: true, weather_entity: 'weather.home' },
    phone: { nav: 'cats', tabs: { order: ['a'] } }, season: 'winter', energy: { price: 4 }
  };
  const over = { canvas: { width: 2560 }, header: { clock: false }, phone: { nav: 'rooms' } };
  const merged = plain(c.lpProfMerge(base, over));
  assert.deepEqual(plain(c.lpProfSplit(base, merged, over)), { base, over });
  merged.canvas.width = 1280;
  merged.phone = { tabs: { order: ['a'] }, nav: 'cats' };
  merged.header.weather_entity = 'weather.other';
  merged.energy.price = 5;
  merged.season = 'summer';
  assert.deepEqual(plain(c.lpProfSplit(base, merged, over)), {
    base: Object.assign({}, base, { energy: { price: 5 }, header: { clock: true, weather_entity: 'weather.other' } }),
    over: { header: { clock: false } }
  });
  delete merged.header.weather_entity;
  assert.deepEqual(plain(c.lpProfSplit(base, merged, over).base.header), { clock: true });
});

test('lpSettings etkin profili okur ve önizleme ayarına öncelik verir', () => {
  const data = { settings: { hold: 'ha' }, profiles: { masaustu: { name: 'Masaüstü', settings: { hold: 'lec' } } } };
  const c = profileContext(data);
  assert.equal(c.lpSettings(), data.settings);
  vm.runInContext("LP_PROF.id = 'masaustu';", c);
  assert.equal(c.lpSettings().hold, 'lec');
  const preview = vm.runInContext("LP_OVR.s = { hold: 'pop' };", c);
  assert.equal(c.lpSettings(), preview);
});

const strategy = rd('strategy.js'), card = rd('panel-card.js'), scale = rd('scale.js');
const mainTab = { id: 'ana', name: 'Ana', icon: 'mdi:home' };
const profileTab = { id: 'calisma', name: 'Çalışma', icon: 'mdi:desk' };
const renderData = {
  tabs: [mainTab],
  settings: { canvas: { width: 1280, ref_height: 1075 }, kiosk: { hide_header: false, hide_sidebar: false }, bg: { mode: 'dark' }, theme_name: 'ana' },
  profiles: {
    masaustu: { name: 'Masaüstü', tabs: [profileTab], settings: { canvas: { width: 2560 }, kiosk: { hide_header: true, hide_sidebar: true }, bg: { mode: 'color', color: '#123456' }, theme_name: 'masaustu' } },
    linked: { name: 'Bağlı', settings: { canvas: { width: 1920 } } }
  }
};

function strategyContext(data = renderData) {
  const warn = [], scaleCalls = [];
  const c = profileContext(data, {
    HTMLElement: class {},
    pickLang: () => 'tr',
    buildDefaultTabs: () => [mainTab],
    lpPhoneScreen: () => false,
    LemurScale: { set: (...args) => scaleCalls.push(args) },
    console: { warn: (...args) => warn.push(args) }
  });
  c.window.__LEMUR_HOME_DASHBOARD_STORE.load = async () => data;
  vm.runInContext(strategy + '\nthis.Strategy = LemurHomeDashboardStrategy;', c);
  return { c, warn, scaleCalls };
}

// Profilsiz panonun değişiklikten önce ürettiği görünüm.
const mainViews = {
  views: [{
    title: 'Ana', path: 'ana', icon: 'mdi:home', type: 'panel',
    background: 'radial-gradient(ellipse at center, #0b0e15 0%, #0b0e15 55%, #0a0c13 100%) fixed',
    cards: [{ type: 'custom:lemur-home-dashboard-card', tab: 'ana' }], theme: 'ana'
  }]
};

test('strateji profilin sekmelerini, temasını ve zeminini kullanır; gezinme listeleri ayrı kalır', async () => {
  const { c, warn } = strategyContext();
  const own = await c.Strategy.generate({ profile: 'masaustu' });
  assert.equal(own.views.length, 1);
  assert.equal(own.views[0].path, 'calisma');
  assert.equal(own.views[0].theme, 'masaustu');
  assert.match(own.views[0].background, /#123456/);
  assert.deepEqual(plain(own.views[0].cards[0]), { type: 'custom:lemur-home-dashboard-card', tab: 'calisma', profile: 'masaustu' });
  assert.equal(c.window.__LHD_VIEWS, c.window.__LHD_VIEWS_BY.masaustu);
  const main = await c.Strategy.generate({});
  assert.equal(JSON.stringify(main), JSON.stringify(mainViews));
  assert.deepEqual(plain(c.window.__LHD_VIEWS_BY.masaustu), ['calisma']);
  assert.deepEqual(plain(c.window.__LHD_VIEWS_BY['']), ['ana']);
  assert.equal(c.window.__LHD_VIEWS, c.window.__LHD_VIEWS_BY['']);
  assert.match(card, /__LHD_VIEWS_BY\[this\._config\.profile \|\| ''\]/);
  assert.equal(warn.length, 0);
});

test('bilinmeyen profil ana panoya döner ve uyarı verir', async () => {
  const { c, warn } = strategyContext();
  assert.equal(JSON.stringify(await c.Strategy.generate({ profile: 'yok' })), JSON.stringify(mainViews));
  assert.equal(warn.length, 1);
});

test('bağlı profil ana sekmeleri kendi birleşik kanvasıyla çizer', async () => {
  const { c, scaleCalls } = strategyContext();
  const result = await c.Strategy.generate({ profile: 'linked' });
  assert.equal(result.views[0].path, 'ana');
  assert.equal(result.views[0].cards[0].profile, 'linked');
  assert.deepEqual(plain(scaleCalls[0][0]), { width: 1920, ref_height: 1075 });
});

function scaleContext(data) {
  const host = () => {
    const styles = {};
    return {
      getElementById: (id) => styles[id],
      appendChild: (style) => { styles[style.id] = style; },
      querySelector: () => null
    };
  };
  const view = host(), main = host();
  view.querySelector = (q) => q === 'hui-view-container' ? { getBoundingClientRect: () => ({ width: 3840, top: 0 }) } : null;
  const lovelace = { rawConfig: { strategy: { type: 'custom:lemur-home-dashboard', profile: 'masaustu' } } };
  const root = { shadowRoot: view, lovelace };
  main.querySelector = () => ({ shadowRoot: { querySelector: () => root } });
  const ha = { shadowRoot: { querySelector: () => ({ shadowRoot: main }) } };
  const meta = { color: '#03a9f4', getAttribute() { return this.color; }, setAttribute(k, v) { this.color = v; } };
  const saved = { 'lhd-kiosk': '{"hide_header":false}', 'lhd-kiosk:masaustu': '{"hide_header":true}' };
  const c = profileContext(data, {
    HTMLElement: class {},
    document: { querySelector: (q) => q === 'home-assistant' ? ha : meta, createElement: () => ({ textContent: '' }) },
    getComputedStyle: () => ({ paddingTop: '0px' }),
    localStorage: { getItem: (k) => saved[k], setItem: (k, v) => { saved[k] = v; } },
    setInterval: () => 0
  });
  Object.assign(c.window, { innerWidth: 3840, innerHeight: 2160, addEventListener: () => {} });
  vm.runInContext(scale + '\n' + strategy + '\nthis.Scale = LemurScale;', c);
  return { Scale: c.Scale, lovelace, view, main, meta, saved };
}

test('açık panonun kanvası, kiosku ve durum çubuğu set çağrısı olmadan değişir', () => {
  const { Scale, lovelace, view, main, meta } = scaleContext(renderData);
  const css = () => view.getElementById('lemur-home-dashboard-scale').textContent;
  const header = () => view.getElementById('lemur-home-dashboard-kiosk').textContent;
  const sidebar = () => main.getElementById('lemur-home-dashboard-kiosk').textContent;
  Scale.run();
  assert.match(css(), /zoom:1\.5;/);
  assert.match(header(), /display:none/);
  assert.match(sidebar(), /display:none/);
  assert.equal(meta.color, '#123456');
  delete lovelace.rawConfig.strategy.profile;
  Scale.run();
  assert.match(css(), /zoom:2;/);
  assert.equal(header(), '');
  assert.equal(sidebar(), '');
  assert.equal(meta.color, '#03a9f4');
  lovelace.rawConfig.strategy.profile = 'yok';
  Scale.run();
  assert.match(css(), /zoom:2;/);
});

test('kiosk önbelleği ayarlar yüklenmeden önce de profil anahtarına bağlıdır', () => {
  const { Scale, lovelace, view, saved } = scaleContext(null);
  const header = () => view.getElementById('lemur-home-dashboard-kiosk').textContent;
  Scale.run();
  assert.match(header(), /display:none/);
  Scale.set({ width: 2560 }, { hide_header: 'all' }, '#123456', 'masaustu');
  assert.equal(JSON.parse(saved['lhd-kiosk:masaustu']).hide_header, 'all');
  assert.equal(JSON.parse(saved['lhd-kiosk']).hide_header, false);
  delete lovelace.rawConfig.strategy.profile;
  Scale.run();
  assert.equal(header(), '');
  assert.match(view.getElementById('lemur-home-dashboard-scale').textContent, /zoom:2;/);
});

test('sanal enerji taraması yalnız profil sekmesindeki sensörü bulur ve profil değişince yenilenir', () => {
  const tabs = [{ id: 'ana' }], data = { tabs, profiles: {} };
  const c = profileContext(data, { LP_EN: {} });
  vm.runInContext(card.slice(card.indexOf('function lpEnVirtUsed('), card.indexOf('// enerji değerine (')), c);
  assert.equal(c.lpEnVirtUsed(), false);
  c.window.__LEMUR_HOME_DASHBOARD_STORE.data = {
    tabs, profiles: { masaustu: { name: 'Masaüstü', tabs: [{ sections: [{ entities: ['sensor.lhdx_olcmeyen'] }] }] } }
  };
  assert.equal(c.lpEnVirtUsed(), true);
  c.window.__LEMUR_HOME_DASHBOARD_STORE.data = data;
  assert.equal(c.lpEnVirtUsed(), false);
});

test('enerji kısayolu açık panonun enerji sekmesine gider', () => {
  const data = {
    tabs: [{ id: 'ana-enerji', sections: [{ type: 'energy' }] }],
    profiles: { masaustu: { name: 'Masaüstü', tabs: [{ id: 'profil-enerji', sections: [{ type: 'energy' }] }] }, empty: { name: 'Boş', tabs: [] } }
  };
  const paths = [];
  const c = profileContext(data, {
    location: { pathname: '/pano/oda' },
    history: { pushState: (state, title, url) => paths.push(url) },
    Event: class {}
  });
  c.window.dispatchEvent = () => {};
  vm.runInContext(card.slice(card.indexOf('function lpEnVirtUsed('), card.indexOf('// enerji değerine (')), c);
  assert.equal(c.lpEnGoTab(), true);
  vm.runInContext("LP_PROF.id = 'masaustu';", c);
  assert.equal(c.lpEnGoTab(), true);
  vm.runInContext("LP_PROF.id = 'empty';", c);
  assert.equal(c.lpEnGoTab(), false);
  assert.equal(c.lpEnGoTab('masaustu'), true);
  assert.deepEqual(paths, ['/pano/ana-enerji', '/pano/profil-enerji', '/pano/profil-enerji']);
});

test('kart profili yapılandırmada ve yeniden bağlandığında etkinleştirir', () => {
  const c = profileContext(renderData, { HTMLElement: class {}, LP_CARDS: [], lpPhoneKey: () => '' });
  const start = card.indexOf('class LemurHomeDashboardCard');
  vm.runInContext(card.slice(start, card.indexOf('  _tick() {', start)) + '}\nthis.Card = LemurHomeDashboardCard;', c);
  const profile = new c.Card(), main = new c.Card();
  profile.setConfig({ profile: 'masaustu' });
  assert.equal(c.lpSettings().canvas.width, 2560);
  assert.equal(profile._tabs(), renderData.profiles.masaustu.tabs);
  main.setConfig({});
  assert.equal(c.lpSettings().canvas.width, 1280);
  assert.equal(main._tabs(), renderData.tabs);
  Object.assign(profile, { _nw: 1, _unsub: 1, _lecUnsub: 1, _leciUnsub: 1, _mdicUnsub: 1, _enUnsub: 1, _clock: 1, _vis: 1, _rsz: 1, _wRO: 1 });
  profile.connectedCallback();
  assert.equal(c.lpSettings().canvas.width, 2560);
});

for (const preview of [false, true]) {
  test(`saat ve ışık penceresi kartın kendi profilini kullanır (önizleme: ${preview})`, () => {
    const data = {
      settings: {},
      profiles: {
        a: { name: 'A', settings: { header: { clock: true }, lightpop: { colors: ['#123456'] } } },
        b: { name: 'B', settings: { header: { clock: false } } }
      }
    };
    const c = profileContext(data, { HTMLElement: class {}, lpIsPhone: () => false });
    c.LemurLightPopup = { open: () => c.lpSettings().lightpop };
    const start = card.indexOf('class LemurHomeDashboardCard');
    vm.runInContext(card.slice(card.indexOf('function lpHeaderCfg('), card.indexOf('function lpLightPopCfg(')) + '\n' +
      card.slice(start, card.indexOf('  _render0()', start)) + '}\nthis.Card = LemurHomeDashboardCard;', c);
    const a = new c.Card(), b = new c.Card(), clock = {};
    a.setConfig({ profile: 'a', admin_preview: preview });
    b.setConfig({ profile: 'b' });
    Object.assign(a, { _hass: {}, _lang: 'en', _time: () => '12:34', shadowRoot: { querySelector: () => clock } });
    a._headerPaint();
    assert.equal(clock.innerHTML, '12:34');
    assert.equal(c.lpSettings().header.clock, false);
    assert.deepEqual(plain(a._popOpen({}, 'light.office')), { colors: ['#123456'] });
    assert.equal(c.lpSettings().header.clock, false);
  });
}

test('profil rehberi iki dilde strateji seçimini ve kimliği yeniden kullanmayı açıklar', () => {
  const guide = JSON.parse(rd('guide.json'));
  const section = guide.steps.find((step) => step.en[0] === 'Dashboard profiles');
  assert.match(section.tr.join(' '), /`profile:`.*aynı adla.*kimliğini.*yeniden.*yeni profili gösterir/);
  assert.match(section.en.join(' '), /`profile:`.*reuse.*ID.*same name.*show the new profile/);
});
