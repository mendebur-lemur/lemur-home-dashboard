// Telefon gezinmesi "Altta kategoriler" (GitHub #24): her öğe hangi sayfada, hiçbir öğe ulaşılamaz kalmıyor, yönetim panelinin
// telefon önizlemesi telefondaki sayfayı aynı işlevle (lpCatView) kuruyor. Çalıştır: node --test tests/frontend_phone_cats.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

const PC = rd('src/panel-card.js');
const cut = (a, b) => { const i = PC.indexOf(a), j = PC.indexOf(b, i); assert.ok(i >= 0 && j > i, 'bulunamadı: ' + a); return PC.slice(i, j + b.length); };
const SET = { s: {} };
const ctx = { console, location: { search: '' }, document: { write() {} }, localStorage: { getItem() { return null; }, setItem() {} } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext([rd('src/i18n.js'), rd('src/safe.js'), rd('src/defaults.js'),
  'function lpSettings() { return SET.s; }',
  cut('const lpEnt = ', ';\n'),
  cut('// kategori görünümünün durumu', "return Object.assign({}, N, { v: 2, sections: out, _ph: true });\n}"),
  'this.X = { lpCatView, lpPhoneWhere, lpPvMark, lpPhoneTab, lpSecCat, lpCatName, LP_PH, buildDefaultTabs, lhdItemKey, lhdNormTab };'].join('\n'), Object.assign(ctx, { SET }));
const X = ctx.X;

// --- evler ---
const load = (f, expr) => { const c = { location: { search: '' }, document: { write() {} } }; c.window = c; vm.createContext(c); vm.runInContext(rd(f) + '\nthis.__R = ' + expr + ';', c); return c.__R; };
const autoTabs = (H) => X.buildDefaultTabs({ states: H.states, entities: H.entities || {}, areas: H.areas || {}, devices: H.devices || {}, floors: {} }, 'tr');
// tests/ içindeki iki ev depoda; dev/ altındakiler (örnek ev, gerçek pano) yalnız geliştirme kopyasında varsa eklenir
const HOMES = {
  i24: () => load('tests/phone_home_i24.js', 'LP_I24').tabs,
  home40: () => autoTabs(load('tests/synth_home.js', 'LP_SYNTH(40)')),
};
const has0 = (f) => fs.existsSync(path.join(__dirname, '..', f));
if (has0('dev/ornek-ev.js')) HOMES.ornek = () => { const c = load('dev/ornek-ev.js', 'lhdDemoHome("tr")'); return autoTabs(c); };
const REAL = 'dev/' + ['ha', 'kan-ornek.js'].join('');   // gerçek bir panonun kopyası (yalnız geliştirme kopyasında)
if (has0(REAL)) HOMES.gercek = () => load(REAL, 'window.LP_DEMO_HOME').tabs;

const has = (s) => (s.entities || []).length > 0 || (s._folds || []).some((F) => (F.entities || []).length > 0);
const keysOf = (s) => [s.entities || []].concat((s._folds || []).map((F) => F.entities || [])).reduce((a, L) => a.concat(L), []).map(X.lhdItemKey).filter((k) => k && k.indexOf('sub:') !== 0);
// telefonda (kategoriler) ulaşılabilen her sayfa: her kategori, ışıklarda Tümü ve her oda
function pages(tabs) {
  const v0 = X.lpCatView(tabs, tabs[0], { cat: null, room: null }); if (!v0) return [];
  const out = [];
  v0.cats.forEach((c) => {
    const v = X.lpCatView(tabs, tabs[0], { cat: c, room: 'all' });
    out.push({ cat: c, room: 'all', v: v });
    v.rooms.forEach((T) => out.push({ cat: c, room: T.id, v: X.lpCatView(tabs, tabs[0], { cat: c, room: T.id }) }));
  });
  return out;
}

test('#24: kullanıcının evi: süpürge Hol başlığı altında, sayfanın adı Süpürge, alt çubuk Işıklar + Süpürge', () => {
  const tabs = HOMES.i24();
  const v = X.lpCatView(tabs, tabs[1], { cat: 'climate', room: null });
  assert.deepStrictEqual(Array.from(v.cats), ['lights', 'climate']);
  assert.strictEqual(v.clim, 'vacuum');
  assert.strictEqual(X.lpCatName(v, 'climate'), 'vacuum');
  const E = v.tab.sections[0].entities;
  assert.strictEqual(E[0].subtitle, 'Hol');                  // önceden "Ev" (özet sekmesi) altında çıkıyordu
  assert.strictEqual(E[1], 'vacuum.robot');
  assert.strictEqual(E.length, 2);
  const L = X.lpCatView(tabs, tabs[0], { cat: 'lights', room: 'all' });
  assert.deepStrictEqual(Array.from(L.rooms.map((T) => T.id)), ['home', 'oyun_odasi']);
  assert.deepStrictEqual(Array.from(L.tab.sections.map((s) => s.title)), ['Oyun odası']);   // Tümü: ışık odasının adıyla
});

test('kategori adı içindekine göre: yalnız iklim İklim, yalnız süpürge / medya kendi adı, karışık Cihazlar', () => {
  const T = (E) => [{ id: 'a', name: 'A', area: 'a', sections: [{ id: 's', title: 'S', type: 'climate', entities: E }] }];
  const nm = (E) => X.lpCatView(T(E), T(E)[0], {}).clim;
  assert.strictEqual(nm(['climate.x', 'climate.y']), 'climate');
  assert.strictEqual(nm(['climate.x', 'vacuum.v']), 'devices');   // iklimin yanında süpürge: sayfa "Cihazlar"
  assert.strictEqual(nm(['climate.x', 'media_player.m']), 'devices');
  assert.strictEqual(nm(['vacuum.v']), 'vacuum');
  assert.strictEqual(nm(['media_player.m']), 'media');
  assert.strictEqual(nm(['vacuum.v', 'media_player.m']), 'devices');
  assert.strictEqual(nm([{ subtitle: 'Üst' }, 'vacuum.v']), 'vacuum');
});

test('her öğe türü (oda sekmesinde) kategorilerde nerede', () => {
  const tabs = [
    { id: 'ev', name: 'Ev', sections: [{ id: 'ev-l', title: 'EV-L', type: 'lights', entities: ['light.a'] }] },
    { id: 'hol', name: 'Hol', area: 'hol', sections: [
      { id: 'l', title: 'L', type: 'lights', entities: ['light.a', 'sensor.t'] },
      { id: 'c', title: 'C', type: 'climate', entities: ['climate.k', 'vacuum.v', 'media_player.m', 'camera.x'] },
      { id: 's', title: 'S', type: 'scenes', entities: [{ name: 'Gece', action: { service: 'script.turn_on' } }, 'script.g'] },
      { id: 'k', title: 'K', type: 'camera', entities: ['camera.y'] },
      { id: 'e', title: 'E', type: 'energy', entities: [{ energy: 'halo' }] },
      { id: 'f', title: 'F', type: 'free', entities: [{ card: { type: 'markdown', title: 'Not' } }, { entity: 'sensor.h', look: 'halo' }, { pet: 'kedi' }] },
      { id: 'v', title: 'V', type: 'vacuum', entities: ['vacuum.w'] },
      { id: 'm', title: 'M', type: 'media', entities: ['media_player.n'] },
      { id: 'cams', title: 'CAMS', entities: ['camera.z'] },
      { id: 'ens', title: 'ENS', entities: [{ energy: 'week' }] }] }];
  const where = {};
  pages(tabs).forEach((P) => P.v.tab.sections.forEach((s) => keysOf(s).forEach((k) => { (where[k] = where[k] || []).push(P.cat + (P.cat === 'lights' ? '/' + P.room : '')); })));
  const on = (k) => (where[k] || []).join(' ');
  assert.match(on('light.a'), /lights\/all/); assert.match(on('light.a'), /lights\/hol/); assert.match(on('light.a'), /lights\/ev/);
  assert.match(on('sensor.t'), /^lights/);                                // ışık bölümündeki değer karosu ışıklarda
  ['climate.k', 'vacuum.v', 'media_player.m', 'camera.x'].forEach((k) => assert.strictEqual(on(k), 'climate', k));   // iklim bölümündeki her şey İklim'de
  assert.strictEqual(on('n:Gece|'), 'scenes'); assert.strictEqual(on('script.g'), 'scenes');
  assert.strictEqual(on('camera.y'), 'camera'); assert.strictEqual(on('camera.z'), 'camera');   // yalnız kameralı serbest bölüm Kameralar'da
  assert.strictEqual(on('energy:halo'), 'energy'); assert.strictEqual(on('energy:week'), 'energy');
  ['card:markdown:Not', 'sensor.h', 'pet:kedi', 'vacuum.w', 'media_player.n'].forEach((k) => assert.strictEqual(on(k), 'other', k));   // serbest, süpürge ve medya bölümleri Diğer'de
  // ışıksız oda: ışık şeridinde hap yok ama cihazları kendi adıyla İklim / Diğer sayfasında
  const cl = X.lpCatView(tabs, tabs[0], { cat: 'climate' });
  assert.strictEqual(cl.tab.sections[0].entities[0].subtitle, 'Hol');
});

for (const name of Object.keys(HOMES)) {
  test('ulaşılamayan öğe yok (kategoriler ve odalar): ' + name, () => {
    const tabs = HOMES[name]();
    assert.ok(tabs.length > 0);
    const seen = {};
    pages(tabs).forEach((P) => P.v.tab.sections.forEach((s) => keysOf(s).forEach((k) => { seen[k] = 1; })));
    const lost = [];
    tabs.forEach((T) => (X.lhdNormTab(T).sections || []).forEach((s) => keysOf(s).forEach((k) => { if (!seen[k]) lost.push(T.id + '/' + s.id + '/' + k); })));
    assert.deepStrictEqual(lost, []);
    // altta odalar / üstte odalar: her sekme bir düğme, sekmenin telefondaki kopyası bütün öğeleri taşır
    tabs.forEach((T) => { const P = X.lhdNormTab(X.lpPhoneTab(T, false, false)); assert.deepStrictEqual(P.sections.map(keysOf), X.lhdNormTab(T).sections.map(keysOf)); });
  });

  test('önizleme = telefon: seçili bölümün sayfası aynı işlevle kurulur ve bölümün öğelerini gösterir: ' + name, () => {
    const tabs = HOMES[name]();
    tabs.forEach((T) => (X.lhdNormTab(T).sections || []).filter(has).forEach((s) => {
      const w = X.lpPhoneWhere(T, s.id);
      assert.strictEqual(w.cat, X.lpSecCat(s));
      const pv = X.lpCatView(tabs, T, w);
      X.LP_PH.cat = w.cat; X.LP_PH.room = w.room;
      const phone = X.lpCatView(tabs, T);                        // telefonda o kategoriye / odaya dokunulmuş gibi
      assert.deepStrictEqual(JSON.parse(JSON.stringify(pv)), JSON.parse(JSON.stringify(phone)));
      const shown = {}; pv.tab.sections.forEach((x) => keysOf(x).forEach((k) => { shown[k] = 1; }));
      keysOf(s).forEach((k) => assert.ok(shown[k], T.id + '/' + s.id + ': ' + k + ' sayfada yok'));
      // önizlemenin işaretli kopyası: öğeler aynı, yalnız soluk işareti eklenir, kaydedilmez (_ph)
      const mk = X.lpPvMark(pv, T);
      assert.strictEqual(mk._ph, true);
      assert.deepStrictEqual(mk.sections.map(keysOf), pv.tab.sections.map(keysOf));
      mk.sections.forEach((x) => (x.entities || []).forEach((e) => { if (e && e._oth) assert.ok(!keysOf(s).includes(X.lhdItemKey(e))); }));
    }));
    X.LP_PH.cat = null; X.LP_PH.room = null;
  });
}

test('önizleme: seçili sekmenin olmayan öğeler soluk, kendi öğeleri değil', () => {
  const tabs = HOMES.i24();
  const v = X.lpCatView(tabs, tabs[3], { cat: 'climate' });           // Mutfak: hiçbir şeyi yok
  const m = X.lpPvMark(v, tabs[3]);
  assert.ok(m.sections[0].entities.every((x) => x._oth));
  const h = X.lpPvMark(X.lpCatView(tabs, tabs[1], { cat: 'climate' }), tabs[1]);   // Hol: süpürge onun
  assert.ok(h.sections[0].entities.every((x) => !(x && x._oth)));
  assert.strictEqual(h._cvs.mine['vacuum.robot'], 'hol-c');
  const e = X.lpPvMark(X.lpCatView(tabs, tabs[0], { cat: 'climate' }), tabs[0]);    // Ev: süpürge Hol başlığı altında ama Ev'de de var
  assert.strictEqual(e._cvs.mine['vacuum.robot'], 'home-c');
  assert.ok(!e.sections[0].entities[1]._oth);
  assert.strictEqual(X.lpPhoneWhere(tabs[3], 'mutfak-l'), null);       // boş sekme: sayfa değişmez
  assert.deepStrictEqual(Object.assign({}, X.lpPhoneWhere(tabs[1], 'hol-l')), { cat: 'climate', room: null });   // boş bölüm: sekmenin ilk dolu bölümü
  assert.deepStrictEqual(Object.assign({}, X.lpPhoneWhere(tabs[2], 'oyun_odasi-l')), { cat: 'lights', room: 'oyun_odasi' });
});

test('panel kodu: telefon ve önizleme kategori sayfasını aynı işlevle kurar', () => {
  assert.match(PC, /this\._cat = ph && pc\.nav === 'cats' \? lpCatView\(tabs, tab, null, S\) : \(pve \? lpCatView\(tabs, tab, this\._pvState\(tab\), S\) : null\);/);
});
