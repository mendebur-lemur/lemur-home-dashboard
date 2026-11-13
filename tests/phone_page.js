// Telefon kategori sayfası testlerinin ortak yardımcısı: panel-card.js'in ilgili parçalarını vm'de yükler, _render0'ın telefon
// kısmını (sekmelerin telefon kopyası → lpCatView → önizlemede lpPvMark) ve _build'in öğe süzgeçlerini taklit eder.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('node:assert');
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
  'this.X = { lpCatView, lpPhoneWhere, lpPvMark, lpPhoneTab, lpSecCat, lpCatName, LP_PH, lhdItemKey, lhdNormTab, lhdOrderBy, lhdIsObj, lpPhoneOv, lpVisible,' +
  ' lpPvPick: typeof lpPvPick === "function" ? lpPvPick : null };'].join('\n'), Object.assign(ctx, { SET }));
const X = ctx.X;
// telefondaki (edit = false) ya da önizlemedeki (edit = true) sayfa: { cv, view }. S: HA durumları (verilirse lpCatView'a da gider)
function page(tabs0, settings, edit, tabId, st, S) {
  SET.s = settings || {};
  const PT = X.lhdIsObj(X.lpPhoneOv().tabs) ? X.lpPhoneOv().tabs : {}, HD = X.lhdIsObj(PT.hide) ? PT.hide : {};
  const allTabs = tabs0.map((T) => X.lpPhoneTab(T, edit, false));
  const vis = X.lhdOrderBy(allTabs.filter((T) => !HD[T.id]), PT.order);
  const tabs = vis.length ? vis : allTabs;
  const tab = allTabs.filter((x) => x.id === tabId)[0] || tabs[0];
  const cv = X.lpCatView(tabs, tab, st, S);
  return { cv: cv, view: edit && cv ? X.lpPvMark(cv, tab) : (cv ? cv.tab : tab) };
}
// ekranda görünenler, kutu kutu: "[kutu başlığı] -- oda -- | öğe | öğe [gizli] [soluk]" (_build'deki süzgeçler: HA'da yok, gizli, boş ara başlık)
function lines(P, S, edit) {
  const out = [];
  (P.view.sections || []).forEach((s) => {
    let L = (s.entities || []).map((x, i) => {
      const it = typeof x === 'string' ? { entity: x } : x;
      if (!it) return null;
      if (it.entity && S && !S[it.entity]) return null;
      const hid = (!!s._phHide && s._phHide.indexOf(X.lhdItemKey(x)) >= 0) || (!!s._hidIdx && s._hidIdx.indexOf(i) >= 0) || (!!it.visible && !X.lpVisible(it.visible, S));
      if (hid && !edit) return null;
      return it._catSub ? { h: it.subtitle } : (it.entity || X.lhdItemKey(it)) + (hid ? ' [gizli]' : '') + (it._oth ? ' [soluk]' : '');
    }).filter(Boolean);
    const isH = (x) => typeof x === 'object';
    L = L.filter((x, i, a) => !isH(x) || (a[i + 1] && !isH(a[i + 1]))).map((x) => (isH(x) ? '-- ' + x.h + ' --' : x));
    if (L.length) out.push((s.title ? '[' + s.title + '] ' : '') + L.join(' | '));
  });
  return out;
}
const states = (ids, extra) => { const S = {}; ids.forEach((id) => { S[id] = { entity_id: id, state: 'on', attributes: {} }; }); return Object.assign(S, extra || {}); };
module.exports = { X, PC, page, lines, states };
