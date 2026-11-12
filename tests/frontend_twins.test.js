// İkiz öğeler (v0.36): bölümde aynı anahtarlı öğeler (adsız boş karolar, başlıksız markdown kartları, aynı türden enerji kartları,
// aynı ad ve simgeli düğmeler) telefonda birbirinden bağımsız gizlenir, sıralanır, gruplanır. Eski kayıtlar olduğu gibi çalışır.
// Çalıştır: node --test tests/frontend_twins.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const rd = (f) => fs.readFileSync(path.join(__dirname, '../src/' + f), 'utf8');
const method = (src, name) => { const a = src.indexOf('  ' + name + '('), b = src.indexOf('\n  }\n', a); assert.ok(a > 0 && b > a, name + ' bulunamadı'); return 'function ' + src.slice(a + 2, b + 4); };

const adm = rd('admin.js'), pc = rd('panel-card.js');
const pa = pc.indexOf('function lpPhoneOv()'), pb = pc.indexOf('\n// Mevsim: ayarda');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(['safe.js', 'i18n.js', 'defaults.js'].map(rd).join('\n') + '\nconst lhdClone = (x) => JSON.parse(JSON.stringify(x));\nlet SET = {};\nfunction lpSettings() { return SET; }\n' +
  pc.slice(pa, pb) + '\nthis.split = ' + method(adm, '_phSplit') + ';\nthis.rekey = ' + method(adm, '_phRekey') + ';\n' +
  'this.D = { lhdItemKey, lpPhoneTab, setS: (s) => { SET = s; } };', ctx);
const D = ctx.D, J = (x) => JSON.parse(JSON.stringify(x));

// yönetim panelinin ilgili parçası: sekmeler + ayarlar, _phEdit gibi (önce _phSplit, sonra değişiklik)
function adminHost(tabs, settings) {
  const h = { tabs: J(tabs), s: J(settings || {}), commits: [] };
  h._work = () => J(h.tabs);
  h._settings = () => h.s;
  h._phSec = (id) => { const S = (h.s.phone || {}).secs; return S && S[id] ? S[id] : {}; };
  h._commit = (k, v) => { h.commits.push(k); if (k === 'tabs') h.tabs = J(v); else h.s = J(v); };
  h._phSplit = (sid, p, save) => ctx.split.call(h, sid, p, save);
  h._phRekey = (sid, a, b, keep) => ctx.rekey.call(h, sid, a, b, keep);
  // telefonda öğe gizle/göster (admin.js data-phitem ile aynı sıra)
  h.toggleHide = (sid, i) => {
    const s = J(h.s); s.phone = s.phone || {}; s.phone.secs = s.phone.secs || {};
    const k = D.lhdItemKey(h._phSplit(sid, s.phone, true).E[i]);
    const o = s.phone.secs[sid] = s.phone.secs[sid] || {}, L = (o.hide_items || []).slice(), j = L.indexOf(k);
    if (j >= 0) L.splice(j, 1); else L.push(k); o.hide_items = L; h._commit('settings', s);
  };
  h.sec = (sid) => h.tabs[0].sections.filter((x) => x.id === sid)[0];
  return h;
}
// telefonda çizilen öğeler (lpPhoneTab, düzenleme değil): her öğenin tablet listesindeki yeri
function phone(h, sid) {
  D.setS(J(h.s));
  const T = D.lpPhoneTab(J(h.tabs[0]), false, false), S = T.sections.filter((x) => x.id === sid)[0];
  const src = h.sec(sid).entities.map((x) => JSON.stringify(x));
  const used = {};   // aynı JSON'lu (pk'siz) ikizler sırayla eşlenir
  return S.entities.map((x) => { let i = -1; do { i = src.indexOf(JSON.stringify(x), i + 1); } while (i >= 0 && used[i]); if (i >= 0) used[i] = 1; return i; });
}
const TW = () => [{ id: 't1', name: 'T', sections: [{ id: 's1', type: 'free', title: 'S', entities: [
  { name: '', icon: '' }, 'light.a', { name: '', icon: '' }, { card: { type: 'markdown', content: 'A' } }, { card: { type: 'markdown', content: 'B' } },
  { energy: 'halo' }, { energy: 'halo' }, { name: 'Film', icon: 'mdi:movie' }, { name: 'Film', icon: 'mdi:movie' }] }] }];

test('ikizi olmayan pano: anahtarlar bugünküyle bayt bayt aynı, _phSplit hiçbir şey yazmaz', () => {
  const tabs = [{ id: 't1', sections: [{ id: 's1', entities: ['light.a', { entity: 'light.b', name: 'X' }, { name: 'Z', icon: 'mdi:z' }, { card: { type: 'markdown', title: 'N' } }, { energy: 'halo' }, { subtitle: 'Alt' }, { pet: 'kedi' }] }] }];
  assert.deepStrictEqual(tabs[0].sections[0].entities.map(D.lhdItemKey), ['light.a', 'light.b', 'n:Z|mdi:z', 'card:markdown:N', 'energy:halo', 'sub:Alt', 'pet:kedi']);
  const h = adminHost(tabs, { phone: { secs: { s1: { hide_items: ['light.a'] } } } });
  const p = J(h.s.phone), r = h._phSplit('s1', p, true);
  assert.deepStrictEqual(J(r.map), {}); assert.deepStrictEqual(h.commits, []); assert.deepStrictEqual(J(r.E), tabs[0].sections[0].entities); assert.deepStrictEqual(J(p), h.s.phone);
  h.toggleHide('s1', 2);
  assert.deepStrictEqual(h.commits, ['settings'], 'sekmeler kaydedilmez');
  assert.deepStrictEqual(h.s.phone.secs.s1.hide_items, ['light.a', 'n:Z|mdi:z']);
});

test('ikizler telefonda bağımsız: 2. boş karo, 2. markdown, 2. enerji kartı, 2. Film gizlenir; ilkler görünür', () => {
  const h = adminHost(TW(), {});
  assert.deepStrictEqual(phone(h, 's1'), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  [2, 4, 6, 8].forEach((i) => h.toggleHide('s1', i));
  assert.deepStrictEqual(phone(h, 's1'), [0, 1, 3, 5, 7]);
  assert.deepStrictEqual(h.s.phone.secs.s1.hide_items, ['n:|#2', 'card:markdown:#4', 'energy:halo#6', 'n:Film|mdi:movie#8']);
  assert.strictEqual(h.sec('s1').entities[1], 'light.a', 'ikizi olmayan öğe değişmez');
  h.toggleHide('s1', 2);   // geri göster
  assert.deepStrictEqual(phone(h, 's1'), [0, 1, 2, 3, 5, 7]);
});

test('eski kayıt (ortak anahtar): kurulumdan sonra aynı öğeler gizli/sıralı/gruplu; bir öğe değişince de aynı kalır', () => {
  const old = { phone: { secs: { s1: { hide_items: ['n:|', 'light.a'], item_order: ['n:Film|mdi:movie', 'card:markdown:'], folds: [{ name: 'G', items: ['energy:halo'] }] } } } };
  const h = adminHost(TW(), old);
  const base = phone(h, 's1');
  assert.deepStrictEqual(base, [7, 8, 3, 4], 'eski davranış: iki boş karo gizli, Film ikizleri ve markdownlar önde, enerji kartları grupta');
  D.setS(J(h.s)); const fo = D.lpPhoneTab(J(h.tabs[0]), false, false).sections[0]._folds; assert.strictEqual(fo[0].entities.length, 2);
  h.toggleHide('s1', 1);   // kullanıcı ışığı telefonda gösterir: ikizler bu sırada ayrı anahtar alır
  assert.deepStrictEqual(phone(h, 's1'), [7, 8, 3, 4, 1], 'ikizlerin ayarı aynen kalır');
  const q = h.s.phone.secs.s1;
  assert.deepStrictEqual(q.hide_items, ['n:|#1', 'n:|#2']);
  assert.deepStrictEqual(q.item_order, ['n:Film|mdi:movie#7', 'n:Film|mdi:movie#8', 'card:markdown:#3', 'card:markdown:#4']);
  assert.deepStrictEqual(q.folds[0].items, ['energy:halo#5', 'energy:halo#6']);
  D.setS(J(h.s)); assert.strictEqual(D.lpPhoneTab(J(h.tabs[0]), false, false).sections[0]._folds[0].entities.length, 2);
});

test('tablette ikizlerin yeri değişince telefon ayarı ikizler arasında karışmaz', () => {
  const h = adminHost(TW(), {});
  h.toggleHide('s1', 2);
  const E = h.sec('s1').entities; const a = E[0]; E[0] = E[2]; E[2] = a;   // tablette sürükle: 2. boş karo başa
  assert.strictEqual(E[0].pk, '2');
  assert.deepStrictEqual(phone(h, 's1'), [1, 2, 3, 4, 5, 6, 7, 8], 'gizli olan yine aynı karo (şimdi 0. sırada)');
});

test('ikizlerden birinin adı değişince: kendi ayarı ona geçer, öteki ikizinki kalır (eski ortak kayıtta ikisi de korunur)', () => {
  const h = adminHost(TW(), {});
  h.toggleHide('s1', 0); h.toggleHide('s1', 2);
  const E = h.sec('s1').entities, a = D.lhdItemKey(E[2]); E[2].name = 'Yeni';
  h._phRekey('s1', a, D.lhdItemKey(E[2]), E.some((x, j) => j !== 2 && D.lhdItemKey(x) === a));
  assert.deepStrictEqual(h.s.phone.secs.s1.hide_items, ['n:|#1', 'n:Yeni|#2']);
  assert.deepStrictEqual(phone(h, 's1'), [1, 3, 4, 5, 6, 7, 8]);
  // eski kayıt, pk yok: biri adlanınca öteki gizli kalır, adlanan da gizli kalır (önceden öteki görünür oluyordu)
  const g = adminHost(TW(), { phone: { secs: { s1: { hide_items: ['n:|'] } } } });
  const F = g.sec('s1').entities; F[0].name = 'Yeni';
  g._phRekey('s1', 'n:|', 'n:Yeni|', F.some((x, j) => j !== 0 && D.lhdItemKey(x) === 'n:|'));
  assert.deepStrictEqual(g.s.phone.secs.s1.hide_items, ['n:|', 'n:Yeni|']);
  assert.deepStrictEqual(phone(g, 's1'), [1, 3, 4, 5, 6, 7, 8]);
});

test('ikizlerden biri silinince öteki kendi ayarını tutar; yeni eklenen benzer öğe eski ayarı almaz', () => {
  const h = adminHost(TW(), {});
  h.toggleHide('s1', 2);   // 2. boş karo gizli
  h.sec('s1').entities.splice(0, 1);   // görünen 1. ikiz silindi: gizli olan gizli kalır
  assert.deepStrictEqual(phone(h, 's1'), [0, 2, 3, 4, 5, 6, 7]);
  const g = adminHost(TW(), {});
  g.toggleHide('s1', 2);
  g.sec('s1').entities.splice(2, 1);   // gizli ikiz silindi: kalan görünür kalır, ayardaki anahtar artık hiçbir öğeye uymaz
  assert.deepStrictEqual(phone(g, 's1'), [0, 1, 2, 3, 4, 5, 6, 7]);
  g.sec('s1').entities.push({ name: '', icon: '' });   // yeni boş karo: pk'siz, 'n:|' (gizli değil)
  assert.deepStrictEqual(phone(g, 's1'), [0, 1, 2, 3, 4, 5, 6, 7, 8], 'yeni karo görünür');
  // eski ortak kayıtta biri silinirse kalan yine gizli
  const o = adminHost(TW(), { phone: { secs: { s1: { hide_items: ['n:|'] } } } });
  o.sec('s1').entities.splice(0, 1);
  assert.deepStrictEqual(phone(o, 's1'), [0, 2, 3, 4, 5, 6, 7]);
});

test('kopyalanmış pk (aynı pk iki öğede): ilki kendi pk ve ayarını tutar, kopyası yeni pk alır', () => {
  const tabs = [{ id: 't1', sections: [{ id: 's1', entities: [{ name: '', icon: '', pk: '1' }, { name: '', icon: '', pk: '1' }] }] }];
  const h = adminHost(tabs, { phone: { secs: { s1: { hide_items: ['n:|#1'] } } } });
  h.toggleHide('s1', 1);
  assert.deepStrictEqual(h.sec('s1').entities.map((x) => x.pk), ['1', '2']);
  assert.deepStrictEqual(h.s.phone.secs.s1.hide_items, ['n:|#1']);
});

test('panel-card telefonda sürüklemede ikizin sırasını (occ) gönderir; yönetim paneli onu kullanır', () => {
  assert.ok(/occ: ix\.map\(/.test(pc));
  assert.ok(/d\.occ\[j\]/.test(adm));
});
