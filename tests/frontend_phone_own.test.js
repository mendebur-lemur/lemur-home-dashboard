// Telefon kategori sayfaları (GitHub #24, v0.36.0b4 düzeltmeleri): telefonda gizlenen öğe önizlemede de sahip sayılmaz ve soluk
// görünür, koşullu kopya cihazı kaybettirmez, altı boşalan ara başlık kalmaz, alanı olmayan oda sekmesi özetten önce gelir,
// önizlemede İklim kutusunun boş yerine tıklamak seçili sekmede kalır. Çalıştır: node --test tests/frontend_phone_own.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { X, PC, page, lines, states } = require('./phone_page.js');

const HOME = () => [
  { id: 'home', name: 'Ev', sections: [{ id: 'home-l', type: 'lights', title: 'Işıklar', entities: ['light.a', 'light.b'] }, { id: 'home-c', type: 'climate', title: 'Ev kontrol', entities: ['climate.salon', 'vacuum.robot'] }] },
  { id: 'salon', name: 'Salon', area: 'salon', sections: [{ id: 'salon-l', type: 'lights', title: 'L', entities: ['light.a'] }, { id: 'salon-c', type: 'climate', title: 'C', entities: ['climate.salon'] }] },
  { id: 'hol', name: 'Hol', area: 'hol', sections: [{ id: 'hol-l', type: 'lights', title: 'L', entities: ['light.b'] }, { id: 'hol-c', type: 'climate', title: 'C', entities: ['vacuum.robot'] }] }];
const S = states(['light.a', 'light.b', 'climate.salon', 'vacuum.robot']);
// önizlemenin telefondan farkı yalnız soluk gizli öğeler olmalı
const noHid = (L) => L.map((l) => l.split(' | ').filter((x) => x.indexOf('[gizli]') < 0).join(' | ').replace(/ \[soluk\]/g, ''))
  .map((l) => l.split(' | ').filter((x, i, a) => !/^-- .* --$/.test(x) || (a[i + 1] && !/^-- .* --$/.test(a[i + 1]))).join(' | ')).filter((l) => l && !/^\[[^\]]*\] ?$/.test(l));
const both = (tabs, set, st, S0) => ({ ph: page(tabs, set, false, 'home', st, S0), pv: page(tabs, set, true, 'home', st, S0) });

test('telefonda gizlenen cihaz: önizlemede İklim kutusunda soluk (gizli) görünür, sayfanın adı telefondakiyle aynı', () => {
  const set = { phone: { secs: { 'hol-c': { hide_items: ['vacuum.robot'] }, 'home-c': { hide_items: ['vacuum.robot'] } } } };
  const r = both(HOME(), set, { cat: 'climate' }, S);
  assert.deepStrictEqual(lines(r.ph, S, false), ['-- Salon -- | climate.salon']);
  assert.strictEqual(r.ph.cv.clim, 'climate');
  assert.strictEqual(r.pv.cv.clim, 'climate');                          // önceden önizlemede "Cihazlar"
  const pv = lines(r.pv, S, true);
  assert.ok(pv.join(' ').indexOf('vacuum.robot [gizli]') >= 0);          // önceden gizli işareti yoktu: açık bir kart gibi çiziliyordu
  assert.ok(!/vacuum\.robot(?! \[gizli\])/.test(pv.join(' ')));
  assert.deepStrictEqual(noHid(pv), lines(r.ph, S, false));
  assert.match(PC, /\(!!s\._hidIdx && s\._hidIdx\.indexOf\(i\) >= 0\)/);   // _build: birleşik kutuda gizli öğe sıra numarasıyla
});

test('yalnız odasında gizlenen cihaz: telefonda da önizlemede de özet sekmesinin başlığı altında', () => {
  const r = both(HOME(), { phone: { secs: { 'hol-c': { hide_items: ['vacuum.robot'] } } } }, { cat: 'climate' }, S);
  assert.deepStrictEqual(lines(r.ph, S, false), ['-- Ev -- | vacuum.robot | -- Salon -- | climate.salon']);
  assert.deepStrictEqual(noHid(lines(r.pv, S, true)), lines(r.ph, S, false));
  const l = both(HOME(), { phone: { secs: { 'hol-l': { hide_items: ['light.b'] } } } }, { cat: 'lights', room: 'all' }, S);
  assert.deepStrictEqual(lines(l.ph, S, false), ['[Ev] light.b', '[Salon] light.a']);
  assert.deepStrictEqual(noHid(lines(l.pv, S, true)), lines(l.ph, S, false));
  assert.ok(lines(l.pv, S, true).indexOf('[Hol] light.b [gizli]') >= 0);
});

test('sayfanın adı: HA\'da olmayan cihaz sayılmaz', () => {
  const tabs = [{ id: 'home', name: 'Salon', area: 'salon', sections: [{ id: 'c', type: 'climate', title: 'C', entities: ['climate.k', 'vacuum.eski'] }] }];
  assert.strictEqual(page(tabs, {}, false, 'home', { cat: 'climate' }, states(['climate.k'])).cv.clim, 'climate');
  assert.strictEqual(page(tabs, {}, false, 'home', { cat: 'climate' }, states(['climate.k', 'vacuum.eski'])).cv.clim, 'devices');
  assert.strictEqual(page(tabs, {}, false, 'home', { cat: 'climate' }).cv.clim, 'devices');   // durumlar verilmezse eskisi gibi
  assert.match(PC, /this\._cat \? \[this\._cat\.cat, this\._cat\.room, this\._cat\.clim\] : 0/);   // ad değişince iskelet yeniden kurulur
});

test('koşullu görünen kopya cihazı sayfalardan düşürmez: koşulsuz kopya sahip olur', () => {
  const tabs = [
    { id: 'home', name: 'Ev', sections: [{ id: 'home-c', type: 'climate', title: 'Ev', entities: ['media_player.tv', 'climate.k'] }] },
    { id: 'salon', name: 'Salon', area: 'salon', sections: [{ id: 'salon-c', type: 'climate', title: 'C', entities: [{ entity: 'media_player.tv', visible: { entity: 'input_boolean.misafir', state: 'on' } }] }] }];
  const S0 = states(['media_player.tv', 'climate.k'], { 'input_boolean.misafir': { state: 'off' } });
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'climate' }, S0), S0, false), ['-- Ev -- | media_player.tv | climate.k']);
  // yalnız koşullu kopyası olan cihaz odasında kalır
  const only = [tabs[1]];
  const S1 = states(['media_player.tv'], { 'input_boolean.misafir': { state: 'on' } });
  assert.deepStrictEqual(lines(page(only, {}, false, 'salon', { cat: 'climate' }, S1), S1, false), ['-- Salon -- | media_player.tv']);
});

test('cihazları oda sekmelerine giden bölümün ara başlıkları ve boş başlığı kalmaz', () => {
  const tabs = [
    { id: 'home', name: 'Ev', sections: [{ id: 'home-c', type: 'climate', title: 'Ev', entities: [{ subtitle: 'Üst kat' }, 'climate.a', { subtitle: 'Alt kat' }, 'climate.b'] },
      { id: 'home-l', type: 'lights', title: 'I', entities: [{ subtitle: 'Üst kat' }, 'light.a', { subtitle: 'Alt kat' }, 'light.b', 'light.c'] }] },
    { id: 'ust', name: 'Yatak', area: 'y', sections: [{ id: 'y-c', type: 'climate', title: 'C', entities: ['climate.a'] }, { id: 'y-l', type: 'lights', title: 'L', entities: ['light.a'] }] },
    { id: 'alt', name: 'Salon', area: 's', sections: [{ id: 's-c', type: 'climate', title: 'C', entities: ['climate.b'] }, { id: 's-l', type: 'lights', title: 'L', entities: ['light.b'] }] }];
  const S0 = states(['climate.a', 'climate.b', 'light.a', 'light.b', 'light.c']);
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'climate' }, S0), S0, false), ['-- Yatak -- | climate.a | -- Salon -- | climate.b']);
  // altında cihaz kalan ara başlık durur (light.c yalnız Ev'de)
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'lights', room: 'all' }, S0), S0, false), ['[Ev] sub:Alt kat | light.c', '[Yatak] light.a', '[Salon] light.b']);
  // odanın kendi sayfası ve hiçbir öğesi eksilmeyen bölüm değişmez
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'lights', room: 'home' }, S0), S0, false), ['[I] sub:Üst kat | light.a | sub:Alt kat | light.b | light.c']);
  const solo = [{ id: 'home', name: 'Ev', sections: [{ id: 'l', type: 'lights', title: 'I', entities: ['light.a', { subtitle: 'Son' }] }] }, { id: 'b', name: 'B', area: 'b', sections: [{ id: 'l2', type: 'lights', title: 'x', entities: ['light.b'] }] }];
  assert.deepStrictEqual(lines(page(solo, {}, false, 'home', { cat: 'lights', room: 'all' }, S0), S0, false), ['[Ev] light.a | sub:Son', '[B] light.b']);
});

test('alanı olmayan oda sekmesi özet sekmesinden (home) önce gelir; alanı olan hepsinden önce', () => {
  const tabs = [
    { id: 'home', name: 'Ev', sections: [{ id: 'home-l', type: 'lights', title: 'I', entities: ['light.a', 'light.b'] }, { id: 'home-c', type: 'climate', title: 'Ev', entities: ['vacuum.robot'] }] },
    { id: 'hol', name: 'Hol', sections: [{ id: 'hol-l', type: 'lights', title: 'L', entities: ['light.a', 'light.b'] }, { id: 'hol-c', type: 'climate', title: 'C', entities: ['vacuum.robot'] }] },
    { id: 'oda', name: 'Oda', area: 'oda', sections: [{ id: 'oda-l', type: 'lights', title: 'L', entities: ['light.b'] }] }];
  const S0 = states(['light.a', 'light.b', 'vacuum.robot']);
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'climate' }, S0), S0, false), ['-- Hol -- | vacuum.robot']);   // önceden "Ev"
  assert.deepStrictEqual(lines(page(tabs, {}, false, 'home', { cat: 'lights', room: 'all' }, S0), S0, false), ['[Hol] light.a', '[Oda] light.b']);
});

test('önizleme, İklim kutusu: boş yere tıklamak seçili sekmenin bölümünü seçer, kutu seçili çerçevesini alır; gruptaki öğe yanlış sekmeye götürmez', () => {
  assert.strictEqual(typeof X.lpPvPick, 'function');
  const pv = page(HOME(), {}, true, 'home', { cat: 'climate' }, S), S0 = pv.view.sections[0];
  assert.deepStrictEqual(lines(pv, S, true), ['-- Salon -- | climate.salon | -- Hol -- | vacuum.robot']);   // Ev'in cihazları odalarının başlığı altında
  assert.deepStrictEqual(Array.from(X.lpPvPick(pv.view, S0, S0.id, null)), ['home', 'home-c']);              // önceden Salon sekmesine geçiyordu
  assert.ok(S0._srcs.indexOf('home-c') >= 0);                                                                // seçili bölüm kutunun bölümlerinden (selbox)
  assert.deepStrictEqual(Array.from(S0._srcs), ['salon-c', 'hol-c', 'home-c']);
  // öğeye ve oda başlığına tıklama eskisi gibi
  assert.deepStrictEqual(Array.from(X.lpPvPick(pv.view, S0, S0.id, 1)), ['home', 'home-c']);                 // Ev'de de olan cihaz: Ev'deki bölümü
  assert.deepStrictEqual(Array.from(X.lpPvPick(pv.view, S0, S0.id, 2)), ['hol', 'hol-c']);                   // "Hol" başlığı
  const m = page(HOME(), {}, true, 'salon', { cat: 'climate' }, S), M0 = m.view.sections[0];
  assert.deepStrictEqual(Array.from(X.lpPvPick(m.view, M0, M0.id, null)), ['salon', 'salon-c']);
  assert.deepStrictEqual(Array.from(X.lpPvPick(m.view, M0, M0.id, 3)), ['hol', 'hol-c']);                    // başka sekmenin cihazı: o sekme
  // hiçbir iklim cihazı olmayan sekme: ilk başlığın bölümü (eskisi gibi)
  const tabs = HOME().concat([{ id: 'bos', name: 'Boş', area: 'bos', sections: [{ id: 'bos-l', type: 'lights', title: 'L', entities: ['light.a'] }] }]);
  const e = page(tabs, {}, true, 'bos', { cat: 'climate' }, S), E0 = e.view.sections[0];
  assert.deepStrictEqual(Array.from(X.lpPvPick(e.view, E0, E0.id, null)), ['salon', 'salon-c']);
  // ışık sayfası (ayrı kutular): kutunun sekmesi
  const l = page(HOME(), {}, true, 'home', { cat: 'lights', room: 'all' }, S), L0 = l.view.sections[0];
  assert.deepStrictEqual(Array.from(X.lpPvPick(l.view, L0, L0.id, null)), ['salon', 'salon-l']);
  assert.deepStrictEqual(Array.from(X.lpPvPick(l.view, L0, L0.id, 0)), ['home', 'home-l']);
  // katlanır gruptaki öğe: sıra numarası grubun içinde, kutuya tıklanmış sayılır
  assert.match(PC, /lpPvPick\(tab, secById\(tab, sid\), sid, hit && hit\.hasAttribute\('data-idx'\) && !hit\.closest\('\.fbd'\) \? \+hit\.getAttribute\('data-idx'\) : null\)/);
});
