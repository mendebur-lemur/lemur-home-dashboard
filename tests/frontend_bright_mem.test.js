// Saatte parlaklık (GitHub #22), en son açık olanların belleği (v0.36.0b4 düzeltmeleri): ışıklar tek tek kapanırken bellek son ışığa
// kadar küçülmez, başka sekmenin kartının kaydı silinmez, sekmeden çıkan / başka odaya taşınan ışık yanmaz.
// Gerçek yöntemler (_bbPaint, _bbMemSet ...) sahte saatle çalıştırılır. Çalıştır: node --test tests/frontend_bright_mem.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const fn = (head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
const has = (name) => src.indexOf('\n  ' + name + '(') >= 0;
const method = (name) => { const a = src.indexOf('\n  ' + name + '('); assert.ok(a >= 0, name); const eol = src.indexOf('\n', a + 1), one = /\}\s*$/.test(src.slice(a + 1, eol));
  return 'function ' + src.slice(a + 3 + name.length, one ? eol : src.indexOf('\n  }\n', a) + 4); };
const M = ['_bbIds', '_bbKey', '_bbMemGet', '_bbMemSet', '_bbTargets', '_bbVal', '_bbPaint'].concat(has('_bbMemPut') ? ['_bbMemPut'] : []);

// ev: paylaşılan tarayıcı kaydı (store), HA durumları, sahte saat. Her card() ayrı bir kart örneği (HA'da her sekme ayrı kart).
function home(ids) {
  const H = { store: {}, now: 0, timers: [], seq: 0, cards: [], hass: { states: {}, entities: {}, devices: {} } };
  const st = (id, s) => ({ entity_id: id, state: s, attributes: { supported_color_modes: ['brightness'], brightness: 200 } });
  Object.keys(ids).forEach((id) => { H.hass.states[id] = st(id, ids[id]); });
  H.card = (tabId, tiles, area) => {
    const ctx = { localStorage: { getItem: (k) => (k in H.store ? H.store[k] : null), setItem: (k, v) => { H.store[k] = String(v); } }, lpBrightCfg: () => ({ allOff: false }), t: () => 'off', lpEnPct: (v) => v + '%', Date: Date, Math: Math,
      setTimeout: (f, ms) => { H.timers.push({ id: ++H.seq, at: H.now + ms, f: f }); return H.seq; }, clearTimeout: (id) => { H.timers = H.timers.filter((x) => x.id !== id); } };
    vm.createContext(ctx);
    vm.runInContext(fn('function lpBarCan(') + fn('function lpBarVal(') + M.map((m) => 'this.' + m + ' = ' + method(m) + ';').join('\n'), ctx);
    const bar = { classList: { toggle() {} }, querySelector: () => ({ style: {}, textContent: '' }) };
    const c = { _hass: H.hass, _config: {}, isConnected: true, _bbTab: { id: tabId, area: area || null }, _tiles: tiles.map((id) => ({ getAttribute: () => id })), shadowRoot: { querySelector: () => bar } };
    M.forEach((m) => { c[m] = ctx[m]; });
    H.cards.push(c); c._bbPaint();
    return c;
  };
  // HA'dan bir durum değişikliği: yeni durum nesnesi, ekrandaki kartlar yeniden boyanır (_update → _bbPaint)
  H.set = (id, s, only) => { H.hass.states = Object.assign({}, H.hass.states); H.hass.states[id] = st(id, s); (only || H.cards).forEach((c) => { if (c.isConnected) c._bbPaint(); }); };
  H.wait = (ms) => { H.now += ms; let due; while ((due = H.timers.filter((x) => x.at <= H.now).sort((a, b) => a.at - b.at)[0])) { H.timers = H.timers.filter((x) => x !== due); due.f(); } };
  H.mem = () => JSON.parse(H.store['lhd-bb-mem'] || '{}');
  return H;
}
const arr = (x) => Array.from(x);
const ABC = ['light.a', 'light.b', 'light.c'];
const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

test('üç ışık 5 sn içinde tek tek kapanır (hangi sırayla olursa olsun): bellek üçünü de tutar, kaydırınca üçü açılır', () => {
  perms.forEach((p) => {
    const H = home({ 'light.a': 'on', 'light.b': 'on', 'light.c': 'on' }), c = H.card('salon', ABC);
    assert.deepStrictEqual(H.mem(), { salon: ABC });
    p.forEach((i) => { H.set(ABC[i], 'off'); H.wait(1500); });
    H.wait(60000);
    assert.deepStrictEqual(H.mem(), { salon: ABC }, 'sıra ' + p.join());
    assert.deepStrictEqual(arr(c._bbTargets()), ABC);
    assert.strictEqual(H.timers.length, 0);
  });
});

test('biri bilerek kapatılıp ikisi uzun süre açık kalırsa bellek o ikisi olur; sonra onlar kapanınca yine ikisi', () => {
  const H = home({ 'light.a': 'on', 'light.b': 'on', 'light.c': 'on' }), c = H.card('salon', ABC);
  H.set('light.b', 'off');
  H.wait(4000); assert.deepStrictEqual(H.mem(), { salon: ABC });                       // henüz yazılmadı
  H.wait(2000); assert.deepStrictEqual(H.mem(), { salon: ['light.a', 'light.c'] });    // 5 sn sonra hâlâ ikisi açık
  H.wait(3600000);
  H.set('light.a', 'off'); H.wait(300); H.set('light.c', 'off'); H.wait(60000);
  assert.deepStrictEqual(H.mem(), { salon: ['light.a', 'light.c'] });
  assert.deepStrictEqual(arr(c._bbTargets()), ['light.a', 'light.c']);
  // kapatılan ışık 5 sn dolmadan yeniden açılırsa bekleyen yazma düşer, bellek değişmez
  const G = home({ 'light.a': 'on', 'light.b': 'on' }); G.card('salon', ['light.a', 'light.b']);
  G.set('light.a', 'off'); G.wait(2000); G.set('light.a', 'on');
  assert.strictEqual(G.timers.length, 0);
  G.wait(60000); assert.deepStrictEqual(G.mem(), { salon: ['light.a', 'light.b'] });
  // yeni bir ışık açılınca (liste büyür ya da değişir) hemen yazılır
  G.set('light.b', 'off'); G.wait(1000); G.hass.states['light.z'] = { entity_id: 'light.z', state: 'off', attributes: { supported_color_modes: ['brightness'] } };
  G.cards[0]._tiles.push({ getAttribute: () => 'light.z' }); G.set('light.z', 'on');
  assert.deepStrictEqual(G.mem(), { salon: ['light.a', 'light.z'] });
});

test('ışıklar ulaşılamaz olup (elektrik kesildi) kapalı geri gelir: bellek hepsini tutar', () => {
  const H = home({ 'light.a': 'on', 'light.b': 'on', 'light.c': 'on' }), c = H.card('salon', ABC);
  ABC.forEach((id) => { H.set(id, 'unavailable'); H.wait(700); });
  assert.deepStrictEqual(arr(c._bbTargets()), []);                                     // ulaşılamayan ışık hedef olmaz
  H.wait(30000);
  ABC.forEach((id) => { H.set(id, 'off'); H.wait(700); });
  H.wait(30000);
  assert.deepStrictEqual(H.mem(), { salon: ABC });
  assert.deepStrictEqual(arr(c._bbTargets()), ABC);
  // açık geri gelirlerse de (tek tek) bellek küçülmez
  const G = home({ 'light.a': 'on', 'light.b': 'on' }), g = G.card('salon', ['light.a', 'light.b']);
  G.set('light.a', 'unavailable'); G.set('light.b', 'unavailable'); G.wait(20000);
  G.set('light.b', 'on'); G.wait(1000); G.set('light.a', 'on'); G.wait(20000);
  assert.deepStrictEqual(G.mem(), { salon: ['light.a', 'light.b'] });
  assert.deepStrictEqual(arr(g._bbIds()), ['light.a', 'light.b']);
});

test('kart 5 sn dolmadan ekrandan kalkarsa (başka görünüme geçildi) yazılmaz, hata olmaz', () => {
  const H = home({ 'light.a': 'on', 'light.b': 'on', 'light.c': 'on' }), c = H.card('salon', ABC);
  H.set('light.a', 'off');
  c.isConnected = false;                 // HA görünümü değişti: bu karta artık durum gelmez (_hass eski kalır)
  H.set('light.b', 'off'); H.set('light.c', 'off');
  assert.doesNotThrow(() => H.wait(60000));
  assert.deepStrictEqual(H.mem(), { salon: ABC });
  // durumu hiç gelmemiş kart (hass yok) da hata vermez
  const G = home({ 'light.a': 'on', 'light.b': 'on' }), g = G.card('salon', ['light.a', 'light.b']);
  G.set('light.a', 'off'); g._hass = null;
  assert.doesNotThrow(() => G.wait(60000));
  assert.deepStrictEqual(G.mem(), { salon: ['light.a', 'light.b'] });
});

test('5 sn dolmadan sekme değişirse (telefonda oda hapı) eski sekmenin belleği de yeni sekmeninki de bozulmaz', () => {
  const H = home({ 'light.a': 'on', 'light.b': 'on', 'light.m': 'on', 'light.n': 'off' }), c = H.card('salon', ['light.a', 'light.b']);
  H.set('light.a', 'off');
  c._bbTab = { id: 'mutfak', area: null }; c._tiles = ['light.m', 'light.n'].map((id) => ({ getAttribute: () => id })); c._bbPaint();
  H.wait(60000);
  assert.deepStrictEqual(H.mem(), { salon: ['light.a', 'light.b'], mutfak: ['light.m'] });
  // sekme değişip boyanmadan süre dolarsa da eski anahtara yeni sekmenin ışıkları yazılmaz
  const G = home({ 'light.a': 'on', 'light.b': 'on', 'light.m': 'on' }), g = G.card('salon', ['light.a', 'light.b']);
  G.set('light.a', 'off');
  g._bbTab = { id: 'mutfak', area: null }; g._tiles = [{ getAttribute: () => 'light.m' }];
  G.wait(60000);
  assert.deepStrictEqual(G.mem(), { salon: ['light.a', 'light.b'] });
});

test('iki sekmenin kartı aynı tarayıcıda: biri yazarken ötekinin kaydını silmez', () => {
  const H = home({ 'light.s': 'on', 'light.s2': 'off', 'light.m': 'off' });
  const salon = H.card('salon', ['light.s', 'light.s2']), mutfak = H.card('mutfak', ['light.m']);
  H.set('light.m', 'on', [mutfak]);
  assert.deepStrictEqual(H.mem(), { salon: ['light.s'], mutfak: ['light.m'] });
  H.set('light.m', 'off', [mutfak]);
  H.set('light.s2', 'on', [salon]);                                                    // Salon kartı kaydı Mutfak yazmadan önce okumuştu
  assert.deepStrictEqual(H.mem(), { salon: ['light.s', 'light.s2'], mutfak: ['light.m'] });
  const yeni = H.card('mutfak', ['light.m']);                                          // sayfa yenilendi
  assert.deepStrictEqual(arr(yeni._bbTargets()), ['light.m']);
});

test('bellekteki ışık artık sekmenin karosu ya da alanının ışığı değilse yanmaz; alanın (karosu olmayan) ışığı yanar', () => {
  const H = home({ 'light.a': 'off', 'light.x': 'off', 'light.gizli': 'off' });
  H.store['lhd-bb-mem'] = JSON.stringify({ salon: ['light.a', 'light.x', 'light.gizli'] });
  H.hass.entities = { 'light.a': { area_id: 'salon' }, 'light.x': { area_id: 'yatak' }, 'light.gizli': { area_id: 'salon' } };
  const c = H.card('salon', ['light.a'], 'salon');
  assert.deepStrictEqual(arr(c._bbTargets()), ['light.a', 'light.gizli']);              // light.x başka odaya taşındı
  const d = H.card('salon', ['light.a']);                                              // alanı olmayan sekme: yalnız karolar
  assert.deepStrictEqual(arr(d._bbTargets()), ['light.a']);
});

test('tarayıcı kaydı kullanılamıyorsa (gizli sekme) bellek oturum boyunca çalışır, hata olmaz', () => {
  const boom = () => { throw new Error('SecurityError'); };
  const E = home({ 'light.a': 'on', 'light.b': 'on' });
  Object.defineProperty(E, 'store', { get: boom });
  let e = null;
  assert.doesNotThrow(() => { e = E.card('salon', ['light.a', 'light.b']); E.set('light.a', 'off'); E.set('light.b', 'off'); E.wait(60000); });
  assert.deepStrictEqual(arr(e._bbTargets()), ['light.a', 'light.b']);
});
