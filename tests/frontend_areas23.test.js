// GitHub #23 "alan tanımlama": sekme ile Home Assistant alanı. Benzer ad eşleşmesi, oda sekmesi tanıma, HA'da alan oluşturup bağlama
// (config/area_registry/create), ad zaten varsa bağlama, reddedilme, silinmiş alan, yönetici olmayan kullanıcı.
// Çalıştır: node --test tests/frontend_areas23.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const adm = fs.readFileSync(path.join(__dirname, '../src/admin.js'), 'utf8');
const card = fs.readFileSync(path.join(__dirname, '../src/panel-card.js'), 'utf8');
const fnSrc = (src, head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n}\n', a) + 2); };
const method = (head) => { let a = adm.indexOf('  ' + head + '('), pre = 'function '; if (a < 0) { a = adm.indexOf('  async ' + head + '('); pre = 'async function '; if (a >= 0) a += 6; } assert.ok(a >= 0, head); const b = adm.indexOf('\n  }\n', a); return pre + adm.slice(a + 2 + head.length, b + 4); };
const line = (src, head) => { const a = src.indexOf(head); assert.ok(a >= 0, head); return src.slice(a, src.indexOf('\n', a)); };

const ctx = {}; vm.createContext(ctx);
vm.runInContext([line(card, 'const esc = '), line(adm, 'const lhdFold = '), fnSrc(adm, 'function lhdAreaKey('), fnSrc(adm, 'function lhdNear1('), fnSrc(adm, 'function lhdAreaMatch('), fnSrc(adm, 'function lhdRoomTab(')].join('\n') +
  '\nthis.K = lhdAreaKey; this.M = lhdAreaMatch; this.R = lhdRoomTab; this.esc = esc; this.lhdFold = lhdFold;', ctx);
['_areas', '_tabArSt', '_tabArHtml', '_arMake'].forEach((m) => vm.runInContext('this.' + m + ' = ' + method(m) + ';', ctx));
const AREAS = {
  oyun_odasi: { area_id: 'oyun_odasi', name: 'Oyun odası' }, mutfak: { area_id: 'mutfak', name: 'Mutfak' }, yatak_odasi: { area_id: 'yatak_odasi', name: 'Yatak odası' },
  hol: { area_id: 'hol', name: 'Hol' }, misafir_odasi: { area_id: 'misafir_odasi', name: 'Misafir Odası' }
};
const T = (k, v) => { let s = k; if (v) Object.keys(v).forEach((x) => { s += '|' + v[x]; }); return s; };

// yönetim panelinin küçük taklidi: sekmeler, sahte callWS, _edit ve _toast kaydı
function host(o) {
  o = o || {};
  const H = {
    tabs: o.tabs || [{ id: 'cocuk-odasi', name: 'Çocuk Odası', icon: 'mdi:teddy-bear', area: null, sections: [] }],
    ws: [], toasts: [], renders: 0,
    _hass: { areas: Object.assign({}, o.areas || AREAS), user: { is_admin: o.admin !== false },
      callWS: (m) => { H.ws.push(m); return o.ws ? o.ws(m, H) : Promise.resolve(null); } },
    _t: T, _render: () => { H.renders++; }, _toast: (x) => { H.toasts.push(x); },
    _work: () => H.tabs, _curTab: () => H.tabs[0],
    _edit: (fn, msg) => { fn(H.tabs); H.toasts.push(msg || 'saved'); }
  };
  ['_areas', '_tabArSt', '_tabArHtml', '_arMake'].forEach((m) => { H[m] = ctx[m]; });
  H._area = (id) => { const a = H._areas()[id]; return a ? a.name : ''; };
  return H;
}
// HA'nın config/area_registry/create cevabı: ad benzersiz (büyük/küçük harf ve boşluk fark etmez)
const haWs = (m, H) => {
  const A = H._hass.areas;
  if (m.type === 'config/area_registry/list') return Promise.resolve(Object.keys(A).map((k) => A[k]));
  if (m.type === 'config/area_registry/create') {
    const k = m.name.toLowerCase().replace(/\s/g, '');
    if (Object.keys(A).some((x) => A[x].name.toLowerCase().replace(/\s/g, '') === k)) return Promise.reject({ code: 'invalid_info', message: 'The name ' + m.name + ' is already in use' });
    return Promise.resolve({ area_id: 'cocuk_odasi', name: m.name, icon: m.icon || null });
  }
  return Promise.reject({ code: 'unknown_command' });
};

test('alan adı anahtarı: büyük/küçük harf, I/ı/İ, ç ş ğ ö ü, boşluk ve noktalama fark etmez', () => {
  assert.strictEqual(ctx.K('Çocuk Odası'), 'cocukodasi');
  assert.strictEqual(ctx.K('ÇOCUK ODASI'), 'cocukodasi');
  assert.strictEqual(ctx.K('cocuk-odasi'), 'cocukodasi');
  assert.strictEqual(ctx.K('İş Yeri / Ofis'), 'isyeriofis');
  assert.strictEqual(ctx.K('Café'), 'cafe');
  assert.strictEqual(ctx.K('Гостиная'), 'гостиная', 'Latin olmayan ad boşalmaz');
});

test('sekme adına uyan alan: önce birebir, yoksa tek harf farkla ve tek aday; sayısı farklı oda eşleşmez', () => {
  assert.deepStrictEqual(Object.assign({}, ctx.M(AREAS, 'YATAK ODASI')), { id: 'yatak_odasi', exact: true });
  assert.deepStrictEqual(Object.assign({}, ctx.M(AREAS, 'misafir odasi')), { id: 'misafir_odasi', exact: true });
  assert.deepStrictEqual(Object.assign({}, ctx.M(AREAS, 'Misafir Odas')), { id: 'misafir_odasi', exact: false });
  assert.deepStrictEqual(Object.assign({}, ctx.M(AREAS, 'Mutfakk')), { id: 'mutfak', exact: false });
  assert.strictEqual(ctx.M(AREAS, 'Çocuk Odası'), null);
  assert.strictEqual(ctx.M(AREAS, 'Hl'), null, 'kısa adda tahmin yok');
  assert.strictEqual(ctx.M({ b3: { name: 'Banyo 3' } }, 'Banyo 2'), null, 'Banyo 2 ile Banyo 3 aynı oda değil');
  assert.strictEqual(ctx.M({ a: { name: 'Salon A' }, b: { name: 'Salon B' } }, 'Salon C'), null, 'iki aday: tahmin yok');
  assert.strictEqual(ctx.M(AREAS, 'Hol', 'hol'), null, 'skip: sekmenin kendi (bulunamayan) alanı sayılmaz');
  assert.strictEqual(ctx.M(AREAS, ''), null);
});

test('oda sekmesi: Ev, Diğer, Enerji, Kameralar sekmelerinde alan yokluğu söylenmez', () => {
  assert.strictEqual(ctx.R({ id: 'home', name: 'Ev', sections: [] }), false);
  assert.strictEqual(ctx.R({ id: 'other', name: 'Diğer', sections: [] }), false);
  assert.strictEqual(ctx.R({ id: 'enerji', name: 'Enerji', sections: [{ type: 'energy' }] }), false);
  assert.strictEqual(ctx.R({ id: 'x', name: 'Güvenlik', sections: [{ type: 'camera' }] }), false, 'yalnız kamera bölümü olan sekme');
  assert.strictEqual(ctx.R({ id: 'ev-2', name: 'EV', sections: [] }), false, 'adı Ev');
  assert.strictEqual(ctx.R({ id: 'cocuk-odasi', name: 'Çocuk Odası', sections: [] }), true);
  assert.strictEqual(ctx.R({ id: 'sekme', name: 'Yeni sekme', sections: [] }), true);
});

test('sekme düzenleyicisi: alanı olmayan oda sekmesinde tek satır + oluştur düğmesi; benzer alan varsa bağla; Ev sekmesinde hiçbir şey', () => {
  let H = host();
  assert.strictEqual(H._tabArSt(H.tabs[0]), 'none');
  let h = H._tabArHtml(H.tabs[0]);
  assert.ok(/arNone/.test(h) && /data-a="armake"/.test(h) && !/data-arlink/.test(h) && /arHelp/.test(h));
  H.tabs[0].name = 'misafir odası';
  h = H._tabArHtml(H.tabs[0]);
  assert.ok(/data-arlink="misafir_odasi"/.test(h) && !/armake/.test(h), 'birebir eşleşmede yalnız bağla');
  H.tabs[0].name = 'Misafir Odas';
  h = H._tabArHtml(H.tabs[0]);
  assert.ok(/data-arlink="misafir_odasi"/.test(h) && /armake/.test(h), 'benzerde ikisi de');
  H.tabs[0] = { id: 'home', name: 'Ev', area: null, sections: [] };
  assert.strictEqual(H._tabArHtml(H.tabs[0]), '');
  H.tabs[0] = { id: 'hol', name: 'Hol', area: 'hol', sections: [] };
  assert.strictEqual(H._tabArSt(H.tabs[0]), 'ok'); assert.strictEqual(H._tabArHtml(H.tabs[0]), '');
});

test('alan Home Assistant\'ta silinince sekme bozulmaz: "bulunamadı", yeniden oluştur düğmesi; Alan seçiminde silinen alan görünür', () => {
  const H = host({ tabs: [{ id: 'cocuk-odasi', name: 'Çocuk Odası', icon: 'mdi:teddy-bear', area: 'cocuk_odasi', sections: [] }] });
  assert.strictEqual(H._tabArSt(H.tabs[0]), 'gone');
  const h = H._tabArHtml(H.tabs[0]);
  assert.ok(/arGone/.test(h) && /armake/.test(h));
  assert.ok(adm.indexOf("(tab && tab.area && !AR[tab.area] ? '<option value=\"' + esc(tab.area) + '\" selected>' + t('arGoneOpt', { a: tab.area })") >= 0, 'seçimde "(alan bulunamadı)"');
  assert.ok(adm.indexOf("(tab.area && AR[tab.area] ? '<button class=\"btn sm\" data-a=\"refill\"") >= 0, 'Alandan yeniden doldur alan yokken gizli');
  // pano: alanı olmayan alan kimliği saatteki parlaklıkta hiçbir ışık bulmaz, hata da vermez (eski davranış)
  assert.ok(/if \(\(e\.area_id \|\| \(d && d\.area_id\)\) === tab\.area\) ids\.push\(id\);/.test(card));
});

test('yönetici olmayan kullanıcı: oluştur düğmesi yok, nedeni yazılı', () => {
  const H = host({ admin: false });
  const h = H._tabArHtml(H.tabs[0]);
  assert.ok(!/armake/.test(h) && /arNoAdm/.test(h));
});

test('HA\'da alan oluştur ve bağla: ad ve simgeyle create, sekme yeni alana bağlanır, HA listesi gelene kadar seçimde görünür', async () => {
  const H = host({ ws: haWs });
  const ok = await H._arMake('cocuk-odasi', 'Çocuk Odası', 'mdi:teddy-bear');
  assert.strictEqual(ok, true);
  assert.deepStrictEqual(H.ws.map((m) => Object.assign({}, m)), [{ type: 'config/area_registry/create', name: 'Çocuk Odası', icon: 'mdi:teddy-bear' }]);
  assert.strictEqual(H.tabs[0].area, 'cocuk_odasi');
  assert.ok(H.toasts.indexOf('arMade|Çocuk Odası') >= 0);
  assert.strictEqual(H._area('cocuk_odasi'), 'Çocuk Odası', 'HA listesi yenilenmeden de adı biliniyor');
  assert.strictEqual(H._tabArSt(H.tabs[0]), 'ok');
  assert.strictEqual(H._arBusy, null);
});

test('simge mdi: değilse gönderilmez; boş ad hiçbir şey yapmaz; aynı anda ikinci basış yok sayılır', async () => {
  const H = host({ ws: haWs });
  assert.strictEqual(await H._arMake('cocuk-odasi', '   ', 'mdi:door'), false);
  assert.strictEqual(H.ws.length, 0);
  const p1 = H._arMake('cocuk-odasi', 'Çocuk Odası', 'http://x/y.png'), p2 = H._arMake('cocuk-odasi', 'Çocuk Odası', 'mdi:door');
  assert.strictEqual(await p2, false); await p1;
  assert.strictEqual(H.ws.length, 1); assert.strictEqual(H.ws[0].icon, undefined);
});

test('aynı (ya da harf farkıyla aynı) adlı alan zaten varsa yenisi oluşturulmaz, sekme ona bağlanır', async () => {
  const H = host({ ws: haWs });
  H.tabs[0].name = 'YATAK ODASI';
  assert.strictEqual(await H._arMake('cocuk-odasi', 'YATAK ODASI', 'mdi:bed'), true);
  assert.strictEqual(H.ws.length, 0, 'yerel listede var: HA\'ya sorulmadı');
  assert.strictEqual(H.tabs[0].area, 'yatak_odasi');
  assert.ok(H.toasts.indexOf('arExist|Yatak odası') >= 0);
  // panelin listesi eski: HA "ad kullanılıyor" der, liste çekilip o alana bağlanır
  const H2 = host({ ws: (m, X) => { X._hass.areas.cocuk = { area_id: 'cocuk', name: 'çocuk odası' }; return haWs(m, X); } });
  assert.strictEqual(await H2._arMake('cocuk-odasi', 'Çocuk Odası', 'mdi:teddy-bear'), true);
  assert.deepStrictEqual(H2.ws.map((m) => m.type), ['config/area_registry/create', 'config/area_registry/list']);
  assert.strictEqual(H2.tabs[0].area, 'cocuk');
});

test('HA reddederse (yetki yok, hata) sekme değişmez, nedeni bildirilir, düğme yeniden kullanılabilir', async () => {
  for (const err of [{ code: 'unauthorized', message: 'Unauthorized' }, { code: 'home_assistant_error', message: 'Registry read-only' }, undefined]) {
    const H = host({ ws: (m) => (m.type === 'config/area_registry/list' ? Promise.reject(err) : Promise.reject(err)) });
    assert.strictEqual(await H._arMake('cocuk-odasi', 'Çocuk Odası', 'mdi:teddy-bear'), false);
    assert.strictEqual(H.tabs[0].area, null);
    assert.strictEqual(H._arBusy, null);
    assert.ok(H.toasts.some((x) => x.indexOf('arFail|') === 0 && x.indexOf(err ? err.message : '?') > 0), JSON.stringify(H.toasts));
  }
  // create cevabı boş (beklenmedik): bağlanmaz
  const H = host({ ws: () => Promise.resolve(null) });
  assert.strictEqual(await H._arMake('cocuk-odasi', 'Çocuk Odası', 'mdi:teddy-bear'), false);
  assert.strictEqual(H.tabs[0].area, null);
});

test('+ Sekme menüsü: önce sekmesi olmayan HA alanları, sonra adıyla yeni oda (HA alanı ile ya da yalnız sekme)', () => {
  const a = adm.indexOf("if (m.kind === 'addtab') {"), b = adm.indexOf("if (m.kind === 'addenergy')", a), M = adm.slice(a, b);
  assert.ok(M.indexOf("t('fromArea')") < M.indexOf("t('newRoom')"), 'alanlar önce');
  assert.ok(/\(adm \? '<button data-newroom="ha"/.test(M), 'HA alanı seçeneği yalnız yöneticiye');
  assert.ok(/data-newroom="" title/.test(M) && /data-nrname/.test(M));
  assert.ok(/if \(ha && !nm\) \{ this\._toast\(this\._t\('arNeedName'\), false\);/.test(adm), 'adsız HA alanı yok');
  assert.ok(/if \(ha\) this\._arMake\(id, nm, nw\.icon\);/.test(adm));
});

test('HA\'nın alan listesi değişince panel yeniden çizilir (yalnız liste gerçekten değişince); oluşturulan geçici alan HA\'da görününce düşer', () => {
  const a = adm.indexOf('  set hass(h) {'), S = adm.slice(a, adm.indexOf('\n  }\n', a));
  assert.ok(/if \(A !== this\._arRef\)/.test(S) && /const ch = this\._arSig !== undefined && sig !== this\._arSig;/.test(S));
  assert.ok(/if \(this\._arMade\) Object\.keys\(this\._arMade\)\.forEach\(\(k\) => \{ if \(A\[k\]\) delete this\._arMade\[k\]; \}\);/.test(S));
  assert.ok(/!this\._modal && !this\._menu/.test(S), 'açık pencere ya da menü varken çizilmez');
});
