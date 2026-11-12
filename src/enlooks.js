// Enerji kartlarının görünümleri: her kart türü için beş görünüm (it.look). İlki kartın kendi çizimi ('' = varsayılan).
// Kutu küçülünce ikincil parçalar kendiliğinden gizlenir (.elh-s / .elh-m / .elh-6, kutunun yüksekliğine göre; eski Safari'de hepsi görünür).
// Eski Safari için ?. ve ?? yok.
const LP_EL_LOOKS = {
  halo: ['', 'gauge', 'mix', 'spark', 'level'],
  cats: ['', 'strip', 'donut', 'tree', 'cols'],
  flow: ['', 'sankey', 'hours', 'inout', 'rows'],
  top: ['', 'lead', 'rings', 'tiles', 'race'],
  week: ['', 'mono', 'curve', 'cal', 'cmp'],
  day: ['', 'stack', 'clock', 'heat', 'mark'],
  battery: ['', 'ring', 'cell', 'wave', 'strip'],
  tariff: ['', 'nums', 'ring', 'time', 'rcpt'],
  meter: ['', 'nums', 'rings', 'lines', 'gauges'],
  tips: ['', 'one', 'cards', 'lead', 'pills'],
  standby: ['']
};
const LP_EL_T = {
  tr: { L_halo: ['Halka', 'Gösterge', 'Dağılım halkası', 'Sayı ve eğri', 'Seviye çubuğu'], L_cats: ['Karolar', 'Oran şeridi', 'Halka', 'Ağaç haritası', 'Sütunlar'],
    L_flow: ['Düğümler', 'Akış şeridi', 'Saat saat', 'Gelen ve giden', 'Satırlar'], L_top: ['Çubuklu liste', 'Lider', 'Halka satırları', 'Karolar', 'Yarış çubukları'],
    L_week: ['Yığılı sütun', 'Tek renk, ortalamalı', 'Eğri', 'Takvim', 'Bu hafta, geçen hafta'], L_day: ['Çizgiler', 'Yığılı alan', 'Saat kadranı', 'Isı tablosu', 'Tek eğri, işaretli'],
    L_battery: ['Büyük yüzde', 'Halka', 'Pil', 'Dalga', 'Şerit'], L_tariff: ['Şeritler', 'Sayılar', 'Dönem halkası', 'Zaman çizgisi', 'Fiş'],
    L_meter: ['Bölünmüş çubuk', 'Sayılar', 'İç içe halka', 'İki çizgi', 'Güç ve gerilim'], L_tips: ['Liste', 'Tek satır', 'Kartlar', 'Öne çıkan', 'Rozetler'], L_standby: ['Satır'],
    now: 'şu an', unt: 'Ölçülmeyen', byMeter: 'ev sayacına göre', byBill: 'son faturaya göre', home: 'Ev', grid: 'Şebeke', gridIn: 'Şebekeden', sun: 'Güneş', bat: 'Batarya',
    charge: 'şarj', dis: 'boşalma', idle: 'beklemede', inc: 'Gelen', out: 'Giden', avg: 'ortalama {v} / gün', tot: 'Toplam', thisW: 'Bu hafta', lastW: 'Geçen hafta',
    peak: 'En yoğun', calm: 'en sakin', most: 'en çok', hiLo: 'en düşük {a} · en yüksek {b}', share: 'evdeki payı {p}', lead: 'evin', soFar: 'şimdiye kadar', perEnd: 'dönem sonu',
    perDay: '{d}. gün', cheap: 'düşük kademe', dear: 'yüksek kademe', unit: '₺/kWh şu an', yearL: 'yıllık sınır', tierUse: 'kademe', perUse: 'dönem', kwhUse: 'kWh tüketim',
    bill: 'Bu dönem', devs: 'Paneldeki cihazlar', meterL: 'Sayaç', diff: 'Fark', volt: 'gerilim', power: 'güç', noTips: 'Şu an ipucu yok', hide: 'Gizle', dayKwh: 'kWh · 24 saat',
    bandD: 'Gündüz', bandP: 'Puant', bandN: 'Gece', costDays: 'günlük, son 9 gün', est: '~', kwhToday: 'kWh bugün', today: 'bugün', month: 'bu ay', full: 'dolmasına {t}', left: 'bitmesine {t}', noMeter: 'Ev sayacı seçilmedi', noMeterT: 'Enerji sayfasında "Ev sayacı" bölümünden seç.', noPrice: 'Fiyat girilmedi', noPriceT: 'Enerji sayfasında "Fiyat ve tarife" bölümünden gir.' },
  en: { L_halo: ['Ring', 'Gauge', 'Split ring', 'Number and curve', 'Level bar'], L_cats: ['Tiles', 'Share strip', 'Donut', 'Treemap', 'Columns'],
    L_flow: ['Nodes', 'Flow ribbons', 'Hour by hour', 'In and out', 'Rows'], L_top: ['Bar list', 'Leader', 'Ring rows', 'Tiles', 'Race bars'],
    L_week: ['Stacked columns', 'One colour, with average', 'Curve', 'Calendar', 'This week vs last'], L_day: ['Lines', 'Stacked area', 'Clock dial', 'Heat table', 'One curve, marked'],
    L_battery: ['Big percent', 'Ring', 'Cell', 'Wave', 'Strip'], L_tariff: ['Bars', 'Numbers', 'Period ring', 'Timeline', 'Receipt'],
    L_meter: ['Split bar', 'Numbers', 'Nested rings', 'Two lines', 'Power and voltage'], L_tips: ['List', 'One line', 'Cards', 'Featured', 'Badges'], L_standby: ['Row'],
    now: 'now', unt: 'Not measured', byMeter: 'from the home meter', byBill: 'from the last bill', home: 'Home', grid: 'Grid', gridIn: 'From grid', sun: 'Solar', bat: 'Battery',
    charge: 'charging', dis: 'discharging', idle: 'idle', inc: 'In', out: 'Out', avg: 'average {v} / day', tot: 'Total', thisW: 'This week', lastW: 'Last week',
    peak: 'Busiest', calm: 'quietest', most: 'most', hiLo: 'low {a} · high {b}', share: '{p} of home', lead: 'of home', soFar: 'so far', perEnd: 'period end',
    perDay: 'day {d}', cheap: 'lower tier', dear: 'upper tier', unit: '/kWh now', yearL: 'yearly limit', tierUse: 'tier', perUse: 'period', kwhUse: 'kWh used',
    bill: 'This period', devs: 'Dashboard devices', meterL: 'Meter', diff: 'Difference', volt: 'voltage', power: 'power', noTips: 'No tips right now', hide: 'Hide', dayKwh: 'kWh · 24 hours',
    bandD: 'Day', bandP: 'Peak', bandN: 'Night', costDays: 'daily, last 9 days', est: '~', kwhToday: 'kWh today', today: 'today', month: 'this month', full: 'full in {t}', left: 'empty in {t}', noMeter: 'No home meter picked', noMeterT: 'Pick it under "Home meter" on the Energy page.', noPrice: 'No price set', noPriceT: 'Set it under "Price and tariff" on the Energy page.' }
};
function elT(lang, k, v) { const d = LP_EL_T[lang === 'tr' ? 'tr' : 'en']; let s = d[k] === undefined ? LP_EL_T.en[k] : d[k]; if (typeof s === 'string' && v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; }
function lpElNames(k, lang) { return elT(lang, 'L_' + k) || ['']; }
// ---- çizim yardımcıları ----
let LP_EL_ID = 0;
const elId = () => 'el' + (++LP_EL_ID);
const elSum = (a) => a.reduce((x, y) => x + (y || 0), 0);
function elPts(a, W, H, top, pad) { pad = pad || 0; const mx = top || Math.max.apply(null, a.concat([0.001])), n = Math.max(2, a.length); return a.map((v, i) => [i / (n - 1) * W, H - pad - (v || 0) / mx * (H - pad * 2)]); }
function elSmooth(P) {
  if (P.length < 2) return '';
  let d = 'M' + P[0][0].toFixed(2) + ',' + P[0][1].toFixed(2);
  for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2) + ' ' + p2[0].toFixed(2) + ',' + p2[1].toFixed(2); }
  return d;
}
function elPol(cx, cy, r, a) { const t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
function elArc(cx, cy, r, a0, a1) { if (a1 - a0 >= 359.9) a1 = a0 + 359.9; const p = elPol(cx, cy, r, a0), q = elPol(cx, cy, r, a1); return 'M' + p[0].toFixed(2) + ',' + p[1].toFixed(2) + ' A' + r + ',' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + q[0].toFixed(2) + ',' + q[1].toFixed(2); }
function elArea(a, col, top, opt) {
  opt = opt || {}; const id = elId(), d = elSmooth(elPts(a, 100, 100, top, 2));
  if (!d) return '';
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + col + '" stop-opacity="' + (opt.op || 0.35) + '"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></linearGradient></defs>' +
    (opt.grid ? '<g stroke="rgba(255,255,255,.06)"><line x1="0" y1="33" x2="100" y2="33" vector-effect="non-scaling-stroke"/><line x1="0" y1="66" x2="100" y2="66" vector-effect="non-scaling-stroke"/></g>' : '') +
    '<path d="' + d + ' L100,100 L0,100 Z" fill="url(#' + id + ')"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (opt.sw || 2) + '" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
}
const elIc = (ic, px, col) => '<ha-icon icon="' + esc(ic) + '" style="--mdc-icon-size:' + (px || 18) + 'px;width:' + (px || 18) + 'px;height:' + (px || 18) + 'px;' + (col ? 'color:' + col : '') + '"></ha-icon>';
const elChip = (ic, col, px) => '<span class="elchip" style="color:' + col + (px ? ';width:' + px + 'px;height:' + px + 'px;border-radius:' + Math.round(px * 0.3) + 'px' : '') + '">' + elIc(ic, px ? Math.round(px * 0.58) : 18, col) + '</span>';
const elBig = (w, lang, cls) => { const p = lpEnWp(w, lang); return '<span class="' + (cls || 'elbig') + '">' + esc(p[0]) + '<small>' + p[1] + '</small></span>'; };
const elHx = (i) => (i >= 5 ? ' elh-6' : i >= 4 ? ' elh-m' : i >= 3 ? ' elh-s' : '');
function elPb(lab, a, b, unit, col, lang, cls) { return '<div class="elpb' + (cls ? ' ' + cls : '') + '"><div class="r"><span>' + esc(lab) + '</span><b>' + lpEnNum(Math.round(a), 0, lang) + ' / ' + lpEnNum(Math.round(b), 0, lang) + ' ' + unit + '</b></div><div class="t"><i style="width:' + Math.min(100, a / Math.max(0.001, b) * 100).toFixed(1) + '%;background:' + col + '"></i></div></div>'; }
const elChs = (L) => '<div class="elchs">' + L.map((x) => '<div><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>').join('') + '</div>';
const elHatch = 'repeating-linear-gradient(45deg,#555a63 0 4px,#3a3e45 4px 8px)';
// ---- kartın verisi ----
function lpElCtx(h, M, lang) {
  const S = (h && h.states) || {}, C = {};
  C.S = S; C.lang = lang; C.h = h; C.M = M;
  C.cats = M.cats.map((c) => ({ id: c.id, n: c.name, c: c.color, i: c.icon, w: lpEnCatW(S, c) || 0, hr: M.hist ? (M.hist.cats[c.id] || []) : [], d: M.days ? (M.days.cats[c.id] || []) : [] }));
  C.cats = C.cats.filter((c) => c.id !== '__loose').concat(C.cats.filter((c) => c.id === '__loose'));   // kategorisiz hep sonda
  C.sum = elSum(C.cats.map((c) => c.w));
  const uOff = lpEnCfg().untracked === false, hm = uOff || M.demo ? null : lpEnHomeMeter(S, M), un = uOff || hm !== null ? 0 : lpEnUntracked();
  C.unt = hm !== null ? Math.max(0, hm - C.sum) : un ? C.sum * un / (1 - un) : 0; C.untM = hm !== null;
  const t = lpEnTotal(S, M); C.home = t !== null && t !== undefined && t > 0 ? Math.max(t, C.sum) : C.sum + C.unt;
  C.all = C.sum + C.unt || 1;
  C.lvl = (() => { const L = lpEnLim(), w = C.home; const v = w < L[0] ? 0 : w < L[1] ? 1 : w < L[2] ? 2 : 3; return [lpEnT(lang, 'lvl' + v), LP_EN_LVL[v], v]; })();
  C.N = M.days ? M.days.t.length : 0;
  C.dayTot = (i) => lpEnDayTot(M, i);
  C.price = lpEnUnit(M);
  C.money = (v) => lpEnMoney(h, v, lang);
  C.F = M.demo ? M.flow : lpEnFlowNow(S);
  return C;
}
// haftanın 7 günü: [{lab, today, k (kWh), cats:[..]}]
function elWeek(C, off) {
  const M = C.M, out = []; if (!M.days) return out;
  for (let i = C.N - 7 - (off || 0); i < C.N - (off || 0); i++) { if (i < 0) continue; const d = new Date(M.days.t[i]), td = i === C.N - 1; out.push({ lab: td ? lpEnT(C.lang, 'todayD') : lpEnT(C.lang, 'wd')[d.getDay()], today: td, k: C.dayTot(i), cats: M.cats.map((c) => (M.days.cats[c.id] || [])[i] || 0) }); }
  return out;
}
function elXr(W, lang, cost, C) { return '<div class="elxr">' + W.map((d) => '<span class="' + (d.today ? 't' : '') + '">' + esc(d.lab) + '<b class="elh-s">' + esc(cost ? C.money(d.k * C.price) : lpEnNum(d.k, d.k < 100 ? 1 : 0, lang)) + '</b></span>').join('') + '</div>'; }
function elHours(C) { const M = C.M; if (!M.hist) return null; const a = M.hist.total.map((v) => (v === null ? 0 : v)); return a; }
function elHourAxis(C) { const M = C.M; if (!M.hist) return ''; const lab = []; for (let q = 0; q <= 4; q++) { const t = new Date(M.hist.t0 + q * 6 * 3600000); lab.push(('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2)); } return '<div class="elax">' + lab.map((x) => '<span>' + x + '</span>').join('') + '</div>'; }
const elNoHist = (lang) => '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
// ---- görünümler ----
const LP_EL = {};
LP_EL.halo = {
  gauge: (C, it, lang) => {
    const H = C.home, L = lpEnLim(), top = L[2] * 1.25, fr = Math.min(1, H / top), cut = [0, L[0] / top, L[1] / top, L[2] / top, 1];
    const ang = -90 + 180 * fr, np = elPol(100, 104, 66, ang);
    let s = ''; for (let i = 0; i < 4; i++) s += '<path d="' + elArc(100, 104, 80, -90 + 180 * cut[i] + 1.5, -90 + 180 * cut[i + 1] - 1.5) + '" fill="none" stroke="' + LP_EN_LVL[i] + '" stroke-width="14" opacity="' + (fr >= cut[i] ? 1 : 0.25) + '"/>';
    return '<div class="elfill"><svg viewBox="0 0 200 128">' + s + '<line x1="100" y1="104" x2="' + np[0].toFixed(1) + '" y2="' + np[1].toFixed(1) + '" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="104" r="8" fill="#16181d" stroke="#fff" stroke-width="3"/>' +
      '<text x="20" y="124" class="elsv" text-anchor="middle">0</text><text x="180" y="124" class="elsv" text-anchor="middle">' + esc(lpEnWs(top, lang)) + '</text></svg></div>' +
      '<div class="elc">' + elBig(H, lang) + '<div class="ellv" style="color:' + C.lvl[1] + '">' + esc(C.lvl[0]) + '</div></div>' + (it.tips === false ? '' : '<div class="elh-m">' + lpEnTipsHtml(C.h, C.M, lang) + '</div>');
  },
  mix: (C, it, lang) => {
    const id = elId(), segs = C.cats.filter((c) => c.w > 0).map((c) => [c.w, c.c]); if (C.unt > 0) segs.push([C.unt, 'url(#' + id + ')']);
    const T = elSum(segs.map((x) => x[0])) || 1; let a = 0;
    const s = segs.map((x) => { const d = x[0] / T * 360, p = '<path d="' + elArc(100, 100, 78, a + 1.6, a + Math.max(1.7, d - 1.6)) + '" fill="none" stroke="' + x[1] + '" stroke-width="16"/>'; a += d; return p; }).join('');
    const p = lpEnWp(C.home, lang), top = C.cats.slice().sort((x, y) => y.w - x.w).slice(0, 3);
    return '<div class="elfill"><svg viewBox="0 0 200 200"><defs><pattern id="' + id + '" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#3a3e45"/><rect width="3" height="6" fill="#555a63"/></pattern></defs>' + s +
      '<text x="100" y="102" text-anchor="middle" class="elsn">' + esc(p[0]) + '</text><text x="100" y="121" text-anchor="middle" class="elsu">' + p[1] + ' ' + esc(elT(lang, 'now')) + '</text></svg></div>' +
      '<div class="ellg elh-s elcen">' + top.map((c) => '<span><i style="background:' + c.c + '"></i>' + esc(c.n) + ' ' + lpEnPct(c.w / T * 100, lang) + '</span>').join('') + (C.unt > 0 ? '<span><i style="background:#555a63"></i>' + esc(elT(lang, 'unt')) + ' ' + lpEnPct(C.unt / T * 100, lang) + '</span>' : '') + '</div>';
  },
  spark: (C, it, lang) => {
    const a = elHours(C); if (!a) return null;
    const v = a.filter((x) => x > 0), mx = Math.max.apply(null, v.concat([1])), mn = Math.min.apply(null, v.concat([mx]));
    return '<div class="elrow">' + elBig(C.home, lang) + '</div><div class="ellv" style="color:' + C.lvl[1] + '">' + esc(C.lvl[0]) + '</div><div class="elfill">' + elArea(a, C.lvl[1], mx * 1.08, { grid: true }) + '</div>' +
      '<div class="elax"><span>' + (lang === 'tr' ? '−24 sa' : '−24 h') + '</span><span class="elw-s">' + esc(elT(lang, 'hiLo', { a: lpEnWs(mn, lang), b: lpEnWs(mx, lang) })) + '</span><span>' + esc(elT(lang, 'now')) + '</span></div>';
  },
  level: (C, it, lang) => {
    const L = lpEnLim(), n = Math.max(1, Math.round(Math.min(1, C.home / (L[2] * 1.25)) * 12)), cs = ['#3DDC84', '#3DDC84', '#7ED957', '#B8E04A', '#FFC94A', '#FFC94A', '#FFB347', '#FF9142', '#FF9142', '#FF7A45', '#FF5A5A', '#FF5A5A'];
    const N = C.N, tk = C.M.days ? C.dayTot(N - 1) : null;
    return '<div class="elmid"><div>' + elBig(C.home, lang) + '</div><div class="ellvl">' + cs.map((c, i) => '<i style="background:' + (i < n ? c : 'rgba(255,255,255,.07)') + (i === n - 1 ? ';box-shadow:0 0 12px ' + c : '') + '"></i>').join('') + '</div><b style="color:' + C.lvl[1] + '">' + esc(C.lvl[0]) + '</b></div>' +
      (it.chips === false ? '' : '<div class="elh-s">' + elChs([[tk === null ? '–' : lpEnNum(tk, 1, lang), elT(lang, 'kwhToday')], [C.price && tk !== null ? C.money(tk * C.price) : '–', elT(lang, 'today')], [lpEnYear(C.M) ? lpEnPct(lpEnYear(C.M) / lpEnYearLimit() * 100, lang) : '–', elT(lang, 'yearL')]]) + '</div>');
  }
};
function elUntTile(C, lang) { return C.unt > 0 ? { n: elT(lang, 'unt'), c: '#8A8F96', i: 'mdi:help-circle-outline', w: C.unt, u: 1 } : null; }
LP_EL.cats = {
  strip: (C, it, lang) => {
    const L = C.cats.slice(); const u = elUntTile(C, lang); if (u) L.push(u); L.sort((a, b) => b.w - a.w);
    return '<div class="elstrip">' + L.map((c) => '<i style="flex:' + Math.max(0.001, c.w) + ';background:' + (c.u ? elHatch : c.c) + '"></i>').join('') + '</div>' +
      '<div class="ellist">' + L.map((c, i) => '<div class="' + elHx(i + 1) + '" data-encat="' + esc(c.id || '') + '"><i style="background:' + (c.u ? '#555a63' : c.c) + '"></i><span>' + esc(c.n) + '</span><b>' + esc(lpEnWs(c.w, lang)) + '</b><em>' + lpEnPct(c.w / C.all * 100, lang) + '</em></div>').join('') + '</div>';
  },
  donut: (C, it, lang) => {
    const L = it.sort === 'w' ? C.cats.slice().sort((a, b) => b.w - a.w) : C.cats.slice(); if (C.unt > 0) L.push({ n: elT(lang, 'unt'), c: '#4a4f57', w: C.unt }); let a = 0;
    const s = L.map((c) => { const d = c.w / C.all * 360, p = d > 0.3 ? '<path d="' + elArc(100, 100, 70, a + 1.2, a + Math.max(1.4, d - 1.2)) + '" fill="none" stroke="' + c.c + '" stroke-width="26"/>' : ''; a += d; return p; }).join('');
    const p = lpEnWp(C.home, lang);
    return '<div class="elside"><div class="elfill"><svg viewBox="0 0 200 200">' + s + '<text x="100" y="98" text-anchor="middle" class="elsn" style="font-size:26px">' + esc(p[0]) + '</text><text x="100" y="116" text-anchor="middle" class="elsu">' + p[1] + '</text></svg></div>' +
      '<div class="ellg2 elw-s">' + L.map((c, i) => '<div class="' + elHx(i) + '"><i style="background:' + c.c + '"></i><span>' + esc(c.n) + '</span><b>' + lpEnPct(c.w / C.all * 100, lang) + '</b></div>').join('') + '</div></div>';
  },
  tree: (C, it, lang) => {
    const L = C.cats.filter((c) => c.w > 0).slice(); const u = elUntTile(C, lang); if (u) L.push(u); L.sort((a, b) => b.w - a.w);
    const out = [];
    const lay = (items, x, y, w, hh) => { if (!items.length) return; if (items.length === 1) { out.push([items[0], x, y, w, hh]); return; } const tot = elSum(items.map((q) => q.w)) || 1; let acc = 0, k = 0; while (k < items.length - 1 && acc + items[k].w < tot / 2) { acc += items[k].w; k++; } if (k === 0) { acc = items[0].w; k = 1; } const f = acc / tot; if (w >= hh) { lay(items.slice(0, k), x, y, w * f, hh); lay(items.slice(k), x + w * f, y, w * (1 - f), hh); } else { lay(items.slice(0, k), x, y, w, hh * f); lay(items.slice(k), x, y + hh * f, w, hh * (1 - f)); } };
    lay(L, 0, 0, 100, 100);
    return '<div class="elfill">' + out.map((o) => { const c = o[0], sm = o[3] < 22 || o[4] < 24; return '<div class="eltm' + (c.u ? ' u' : '') + '"' + (c.id ? ' data-encat="' + esc(c.id) + '"' : '') + ' style="left:calc(' + o[1].toFixed(2) + '% + 2px);top:calc(' + o[2].toFixed(2) + '% + 2px);width:calc(' + o[3].toFixed(2) + '% - 4px);height:calc(' + o[4].toFixed(2) + '% - 4px);--c:' + c.c + '">' + (sm ? '<b style="font-size:11px">' + Math.round(c.w) + '</b>' : '<span>' + esc(c.n) + '</span><b style="font-size:' + (o[3] * o[4] > 1500 ? 24 : 16) + 'px">' + esc(lpEnWs(c.w, lang)) + '</b><em>' + lpEnPct(c.w / C.all * 100, lang) + '</em>') + '</div>'; }).join('') + '</div>';
  },
  cols: (C, it, lang) => {
    const L = (it.sort === 'w' ? C.cats.slice().sort((a, b) => b.w - a.w) : C.cats.slice()).slice(0, 8); const u = elUntTile(C, lang); if (u) L.push(u);
    const mx = Math.max.apply(null, L.map((c) => c.w).concat([1]));
    return '<div class="elcols" style="grid-template-columns:repeat(' + L.length + ',minmax(0,1fr))">' + L.map((c) => '<div' + (c.id ? ' data-encat="' + esc(c.id) + '"' : '') + '><b>' + (c.w >= 1000 ? lpEnNum(c.w / 1000, 1, lang) + 'k' : Math.round(c.w)) + '</b><i style="height:' + (Math.max(3, c.w / mx * 100) * 0.72).toFixed(1) + '%;background:linear-gradient(180deg,' + c.c + ',' + c.c + '55)"></i>' + elChip(c.i, c.c, 28) + '</div>').join('') + '</div>' +
      '<div class="elmut elh-s elcen">W · ' + esc(elT(lang, 'tot').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + ' ' + esc(lpEnWs(C.home, lang)) + '</div>';
  }
};
function elFlowVals(C) { const F = C.F; if (!F || !F.has) return null; const P = Math.max(0, F.prod || 0), G = F.grid || 0, B = F.bat || 0; return { P: P, G: G, Gi: Math.max(0, G), Ge: Math.max(0, -G), B: B, chg: Math.max(0, B), dis: Math.max(0, -B), home: F.home, soc: F.soc, sun: !!F.sun || (C.M.demo && F.prod !== null), bat: F.hasBat || F.bat !== null, out: !!F.outage }; }
LP_EL.flow = {
  sankey: (C, it, lang) => {
    const V = elFlowVals(C); if (!V) return null;
    const src = []; if (V.Gi > 5) src.push([elT(lang, 'grid'), V.Gi, '#7C9CFF']); if (V.P > 5) src.push([elT(lang, 'sun'), V.P, '#FFC94A']); if (V.dis > 5) src.push([elT(lang, 'bat'), V.dis, '#3DDC84']);
    const dst = []; const home = Math.max(1, V.home); dst.push([elT(lang, 'home'), home, '#ffffff']); if (V.chg > 5) dst.push([elT(lang, 'bat'), V.chg, '#3DDC84']); if (V.Ge > 5) dst.push([elT(lang, 'grid'), V.Ge, '#7C9CFF']);
    const T = Math.max(elSum(src.map((x) => x[1])), elSum(dst.map((x) => x[1]))) || 1, H = 200, sc = (H - 20) / T, x1 = 74, x2 = 170, x3 = 246;
    let s = '', y = 10, ys = []; src.forEach((x) => { const hh = x[1] * sc; s += '<rect x="' + (x1 - 8) + '" y="' + y + '" width="8" height="' + hh + '" rx="3" fill="' + x[2] + '"/><text x="' + (x1 - 12) + '" y="' + (y + 11) + '" text-anchor="end" class="elsl">' + esc(x[0]) + '</text><text x="' + (x1 - 12) + '" y="' + (y + 24) + '" text-anchor="end" class="elsv">' + esc(lpEnWs(x[1], lang)) + '</text>'; ys.push([y, hh, x[2]]); y += hh + 4; });
    let yd = 10, yi = 10, si = 0, used = 0; const dy = [];
    dst.forEach((d) => { const hh = d[1] * sc; dy.push([yd, hh, d[2], d[0]]); yd += hh + 4; });
    // her kaynaktan sırayla hedeflere dağıt
    let srcI = 0, srcLeft = ys.length ? ys[0][1] : 0, srcY = ys.length ? ys[0][0] : 0;
    dy.forEach((d) => { let need = d[1], ty = d[0]; while (need > 0.2 && srcI < ys.length) { const take = Math.min(need, srcLeft); s += '<path d="M' + x1 + ',' + srcY + ' C' + (x1 + 45) + ',' + srcY + ' ' + (x2 - 45) + ',' + ty + ' ' + x2 + ',' + ty + ' L' + x2 + ',' + (ty + take) + ' C' + (x2 - 45) + ',' + (ty + take) + ' ' + (x1 + 45) + ',' + (srcY + take) + ' ' + x1 + ',' + (srcY + take) + 'Z" fill="' + ys[srcI][2] + '" opacity=".3"/>'; need -= take; ty += take; srcY += take; srcLeft -= take; if (srcLeft <= 0.2) { srcI++; if (srcI < ys.length) { srcLeft = ys[srcI][1]; srcY = ys[srcI][0]; } } } s += '<rect x="' + x2 + '" y="' + d[0] + '" width="8" height="' + Math.max(1, d[1]) + '" rx="3" fill="' + d[2] + '"/>'; });
    // ev → kategoriler
    const hd = dy[0], L = C.cats.filter((c) => c.w > 0).slice(); if (C.unt > 0) L.push({ n: elT(lang, 'unt'), c: '#555a63', w: C.unt }); L.sort((a, b) => b.w - a.w);
    const tot = elSum(L.map((c) => c.w)) || 1; let ry = hd[0], cy = 10; const avail = H - 20 - 3 * (L.length - 1);
    L.forEach((c) => { const hs = c.w / tot * hd[1], hh = c.w / tot * avail; s += '<path d="M' + (x2 + 8) + ',' + ry + ' C' + (x2 + 36) + ',' + ry + ' ' + (x3 - 26) + ',' + cy + ' ' + x3 + ',' + cy + ' L' + x3 + ',' + (cy + hh) + ' C' + (x3 - 26) + ',' + (cy + hh) + ' ' + (x2 + 36) + ',' + (ry + hs) + ' ' + (x2 + 8) + ',' + (ry + hs) + 'Z" fill="' + c.c + '" opacity=".4"/><rect x="' + x3 + '" y="' + cy + '" width="5" height="' + Math.max(1, hh) + '" rx="2" fill="' + c.c + '"/>' + (hh > 9 ? '<text x="' + (x3 + 9) + '" y="' + (cy + hh / 2 + 4) + '" class="elsl" style="font-weight:400">' + esc(c.n) + '</text>' : ''); ry += hs; cy += hh + 3; });
    return '<div class="elfill"><svg viewBox="0 0 320 ' + H + '">' + s + '</svg></div>';
  },
  hours: (C, it, lang) => {
    const a = elHours(C); if (!a) return null;
    const n = a.length, mx = Math.max.apply(null, a.concat([1])), t0 = C.M.hist.t0, st = C.M.hist.step, tou = lpEnMode() === 'tou';
    const col = (i) => { const b = lpEnBand(t0 + i * st); return b === 'peak' ? '#FF5A5A' : b === 'night' ? '#7C9CFF' : '#FFC94A'; };
    const bw = 100 / n;
    return '<div class="elrow sp">' + elBig(C.home, lang) + '<span class="elsub elr">' + esc(lpEnT(lang, 'todayD')) + '<br><b>' + (C.M.days ? esc(lpEnNum(C.dayTot(C.N - 1), 1, lang)) + ' kWh' : '–') + '</b></span></div><div class="elfill"><svg viewBox="0 0 100 100" preserveAspectRatio="none">' + a.map((v, i) => { const hh = v / mx * 96; return '<rect x="' + (i * bw + bw * 0.12).toFixed(2) + '" y="' + (100 - hh).toFixed(2) + '" width="' + (bw * 0.76).toFixed(2) + '" height="' + hh.toFixed(2) + '" rx="0.6" fill="' + (tou ? col(i) : '#7C9CFF') + '"/>'; }).join('') + '</svg></div>' + elHourAxis(C) +
      (tou ? '<div class="ellg elh-s"><span><i style="background:#FFC94A"></i>' + esc(elT(lang, 'bandD')) + '</span><span><i style="background:#FF5A5A"></i>' + esc(elT(lang, 'bandP')) + '</span><span><i style="background:#7C9CFF"></i>' + esc(elT(lang, 'bandN')) + '</span></div>' : '');
  },
  inout: (C, it, lang) => {
    const V = elFlowVals(C); if (!V) return null;
    const inn = [], out = []; if (V.Gi > 0) inn.push([elT(lang, 'grid'), V.Gi, '#7C9CFF']); if (V.P > 0) inn.push([elT(lang, 'sun'), V.P, '#FFC94A']); if (V.dis > 0) inn.push([elT(lang, 'bat'), V.dis, '#3DDC84']);
    out.push([elT(lang, 'home'), V.home, '#ffffff']); if (V.chg > 0) out.push([elT(lang, 'bat'), V.chg, '#3DDC84']); if (V.Ge > 0) out.push([elT(lang, 'grid'), V.Ge, '#7C9CFF']);
    const bar = (ttl, parts) => { const v = elSum(parts.map((p) => p[1])) || 1; return '<div><div class="elrow sp"><span class="elsub">' + esc(ttl) + '</span><b class="eln20">' + esc(lpEnWs(v, lang)) + '</b></div><div class="elio">' + (parts.length ? parts : [['', 1, 'rgba(255,255,255,.08)']]).map((p) => '<div style="flex:' + Math.max(0.001, p[1]) + ';background:' + p[2] + '">' + (p[1] / v > 0.22 ? esc(p[0]) : '') + '</div>').join('') + '</div></div>'; };
    return '<div class="elmid g18">' + bar(V.out ? lpEnT(lang, 'nGridOff') : elT(lang, 'inc'), inn) + bar(elT(lang, 'out'), out) + '</div>' + (V.soc !== null ? '<div class="elh-s">' + elChs([[lpEnPct(V.soc, lang), elT(lang, 'bat')], [lpEnWs(V.P, lang), elT(lang, 'sun')], [lpEnWs(V.Gi, lang), elT(lang, 'gridIn')]]) + '</div>' : '');
  },
  rows: (C, it, lang) => {
    const V = elFlowVals(C); if (!V) return null;
    const r = (a, ac, b, bc, v) => '<div class="elrw' + (v < 5 ? ' off' : '') + '">' + elChip(a, ac, 32) + '<span class="elln" style="background:linear-gradient(90deg,' + ac + ',' + bc + ')"></span>' + elChip(b, bc, 32) + '<span class="w">' + esc(lpEnWs(v, lang)) + '</span></div>';
    const gh = Math.max(0, Math.min(V.Gi, V.home)), sh = Math.max(0, Math.min(V.P, V.home - gh)), bh = Math.max(0, V.home - gh - sh);
    let h2 = r('mdi:transmission-tower', '#7C9CFF', 'mdi:home-lightning-bolt-outline', '#ffffff', V.out ? 0 : gh);
    if (V.sun) h2 += r('mdi:solar-power-variant', '#FFC94A', 'mdi:home-lightning-bolt-outline', '#ffffff', sh);
    if (V.bat) h2 += r('mdi:home-battery-outline', '#3DDC84', 'mdi:home-lightning-bolt-outline', '#ffffff', Math.min(bh, V.dis)) + r(V.sun ? 'mdi:solar-power-variant' : 'mdi:transmission-tower', V.sun ? '#FFC94A' : '#7C9CFF', 'mdi:home-battery-outline', '#3DDC84', V.chg);
    return '<div class="elrows mid">' + h2 + '</div>';
  }
};
function elTop(C, it) {
  const S = C.S; let L = C.M.devs.filter((d) => !it.cat || d.cat === it.cat).map((d) => ({ d: d, w: lpEnWOf(S, d) })).filter((x) => x.w !== null && (!it.hide_idle || x.w >= 2));
  L.sort((a, b) => b.w - a.w); return L.slice(0, Math.max(3, Math.min(10, +it.count || 6)));
}
const elTil = (x) => lpEnTil(x.d);
LP_EL.top = {
  lead: (C, it, lang) => {
    const L = elTop(C, it); if (!L.length) return null; const a = L[0], p = lpEnWp(a.w, lang);
    return '<div class="ellead" data-enmore="' + esc(a.d.p || '') + '" style="--c:' + a.d.color + '">' + elChip(a.d.icon, a.d.color, 52) + '<div class="n"><span class="elsub">' + esc(a.d.name) + '</span><span class="elbig" style="font-size:32px">' + elTil(a) + esc(p[0]) + '<small>' + p[1] + '</small></span></div><div class="elw-s elr"><b class="eln20">' + lpEnPct(a.w / Math.max(1, C.home) * 100, lang) + '</b><div class="elmut">' + esc(elT(lang, 'lead')) + '</div></div></div>' +
      '<div class="ellist n">' + L.slice(1).map((x, i) => '<div class="' + elHx(i + 1) + '" data-enmore="' + esc(x.d.p || '') + '"><em>' + (i + 2) + '</em>' + elIc(x.d.icon, 16, x.d.color) + '<span>' + esc(x.d.name) + '</span><b class="' + (elTil(x) ? 'elest' : '') + '">' + elTil(x) + esc(lpEnWs(x.w, lang)) + '</b></div>').join('') + '</div>';
  },
  rings: (C, it, lang) => {
    const L = elTop(C, it); if (!L.length) return null;
    return '<div class="elrows">' + L.map((x, i) => { const p = x.w / Math.max(1, C.home); return '<div class="elrw' + elHx(i) + '" data-enmore="' + esc(x.d.p || '') + '"><span class="elring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="4"/><path d="' + elArc(20, 20, 16, 0, Math.max(3, 360 * Math.min(1, p))) + '" fill="none" stroke="' + x.d.color + '" stroke-width="4" stroke-linecap="round"/></svg>' + elIc(x.d.icon, 15, x.d.color) + '</span><div class="n"><b>' + esc(x.d.name) + '</b><span class="elmut">' + esc(elT(lang, 'share', { p: lpEnPct(p * 100, lang) })) + '</span></div><span class="w' + (elTil(x) ? ' elest' : '') + '">' + elTil(x) + esc(lpEnWs(x.w, lang)) + '</span></div>'; }).join('') + '</div>';
  },
  tiles: (C, it, lang) => {
    const L = elTop(C, it); if (!L.length) return null;
    return '<div class="eltiles">' + L.map((x, i) => { const p = lpEnWp(x.w, lang); return '<div class="eltl' + (i ? '' : ' hot') + elHx(i) + '" data-enmore="' + esc(x.d.p || '') + '" style="--c:' + x.d.color + '"><div class="h">' + elIc(x.d.icon, 18, x.d.color) + '<span>' + esc(x.d.name) + '</span></div><div class="v' + (elTil(x) ? ' elest' : '') + '">' + elTil(x) + esc(p[0]) + '<small>' + p[1] + '</small></div></div>'; }).join('') + '</div>';
  },
  race: (C, it, lang) => {
    const L = elTop(C, it); if (!L.length) return null; const mx = L[0].w || 1;
    return '<div class="elrace">' + L.map((x, i) => '<div class="' + elHx(i) + '" data-enmore="' + esc(x.d.p || '') + '"><i style="width:' + Math.max(38, x.w / mx * 100).toFixed(1) + '%;background:linear-gradient(90deg,' + x.d.color + '55,' + x.d.color + '22);border-color:' + x.d.color + '66"></i><span>' + elIc(x.d.icon, 15, x.d.color) + esc(x.d.name) + '</span><b class="' + (elTil(x) ? 'elest' : '') + '">' + elTil(x) + esc(lpEnWs(x.w, lang)) + '</b></div>').join('') + '</div>';
  }
};
LP_EL.week = {
  mono: (C, it, lang) => {
    const W = elWeek(C); if (!W.length) return null; const T = W.map((d) => d.k), mx = Math.max.apply(null, T.concat([0.001])) * 1.1, av = elSum(T.slice(0, -1)) / Math.max(1, T.length - 1), id = elId(), n = W.length, bw = 140 / n;
    return '<div class="elrow sp"><span class="elbig" style="font-size:30px">' + esc(lpEnNum(elSum(T), 1, lang)) + '<small>kWh</small></span><span class="elsub">' + esc(elT(lang, 'avg', { v: lpEnNum(av, 1, lang) })) + '</span></div><div class="elfill"><svg viewBox="0 0 140 100" preserveAspectRatio="none"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2A93B"/><stop offset="1" stop-color="#F2A93B" stop-opacity=".25"/></linearGradient></defs>' +
      T.map((v, i) => { const hh = v / mx * 100; return '<rect x="' + (i * bw + bw * 0.2).toFixed(2) + '" y="' + (100 - hh).toFixed(2) + '" width="' + (bw * 0.6).toFixed(2) + '" height="' + hh.toFixed(2) + '" rx="3" fill="' + (W[i].today ? 'url(#' + id + ')' : 'rgba(255,255,255,.16)') + '"/>'; }).join('') +
      '<line x1="0" x2="140" y1="' + (100 - av / mx * 100).toFixed(2) + '" y2="' + (100 - av / mx * 100).toFixed(2) + '" stroke="#F2A93B" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" opacity=".7"/></svg></div>' + elXr(W, lang, false, C);
  },
  curve: (C, it, lang) => {
    const W = elWeek(C); if (W.length < 2) return null; const T = W.map((d) => d.k), P = elWeek(C, 7), pt = elSum(P.map((d) => d.k)), dd = pt > 0.5 && P.length === W.length ? (elSum(T) - pt) / pt * 100 : null;
    return '<div class="elrow sp"><span class="elsub">' + esc(elT(lang, 'tot')) + ' <b>' + esc(lpEnNum(elSum(T), 1, lang)) + ' kWh</b></span>' + (dd !== null ? '<span class="elpill ' + (dd < 0 ? 'ok' : 'bad') + '">' + (dd > 0 ? '+' : '') + esc(lpEnNum(dd, 0, lang)) + '% · ' + esc(elT(lang, 'lastW').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + '</span>' : '') + '</div><div class="elfill">' + elArea(T, '#4FD1E6', Math.max.apply(null, T) * 1.1, { grid: true, sw: 2.5 }) + '</div>' + elXr(W, lang, false, C);
  },
  cal: (C, it, lang) => {
    const W = elWeek(C); if (!W.length) return null; const mx = Math.max.apply(null, W.map((d) => d.k).concat([0.001]));
    return '<div class="elcal" style="grid-template-columns:repeat(' + W.length + ',minmax(0,1fr))">' + W.map((d) => { const a = 0.1 + d.k / mx * 0.6, dark = a > 0.45; return '<div class="' + (d.today ? 't' : '') + (dark ? ' dk' : '') + '" style="background:rgba(242,169,59,' + a.toFixed(2) + ')"><span>' + esc(d.lab) + '</span><b>' + esc(lpEnNum(d.k, 1, lang)) + '</b><em class="elh-s">' + (C.price ? esc(C.money(d.k * C.price)) : 'kWh') + '</em></div>'; }).join('') + '</div>';
  },
  cmp: (C, it, lang) => {
    const W = elWeek(C), P = elWeek(C, 7); if (!W.length || P.length !== W.length) return null;
    const T = W.map((d) => d.k), Q = P.map((d) => d.k), mx = Math.max.apply(null, T.concat(Q).concat([0.001])) * 1.08, d = elSum(Q) > 0.5 ? (elSum(T) - elSum(Q)) / elSum(Q) * 100 : 0, bw = 140 / W.length;
    return '<div class="ellg sp"><span><i style="background:#F2A93B"></i>' + esc(elT(lang, 'thisW')) + ' ' + esc(lpEnNum(elSum(T), 1, lang)) + '</span><span><i style="background:rgba(255,255,255,.3)"></i>' + esc(elT(lang, 'lastW')) + ' ' + esc(lpEnNum(elSum(Q), 1, lang)) + '</span><b style="color:' + (d < 0 ? '#3DDC84' : '#FF8A8A') + '">' + (d > 0 ? '+' : '') + esc(lpEnNum(d, 0, lang)) + '%</b></div>' +
      '<div class="elfill"><svg viewBox="0 0 140 100" preserveAspectRatio="none">' + T.map((v, i) => { const h1 = Q[i] / mx * 100, h2 = v / mx * 100; return '<rect x="' + (i * bw + bw * 0.12).toFixed(2) + '" y="' + (100 - h1).toFixed(2) + '" width="' + (bw * 0.34).toFixed(2) + '" height="' + h1.toFixed(2) + '" rx="2" fill="rgba(255,255,255,.22)"/><rect x="' + (i * bw + bw * 0.52).toFixed(2) + '" y="' + (100 - h2).toFixed(2) + '" width="' + (bw * 0.34).toFixed(2) + '" height="' + h2.toFixed(2) + '" rx="2" fill="#F2A93B"/>'; }).join('') + '</svg></div>' +
      '<div class="elxr">' + W.map((x) => '<span class="' + (x.today ? 't' : '') + '">' + esc(x.lab) + '</span>').join('') + '</div>';
  }
};
LP_EL.day = {
  stack: (C, it, lang) => {
    const M = C.M; if (!M.hist) return null; const n = LP_EN_BINS, acc = []; for (let i = 0; i < n; i++) acc.push(0);
    let mx = 0; for (let i = 0; i < n; i++) mx = Math.max(mx, elSum(C.cats.map((c) => c.hr[i] || 0))); mx = (mx || 1) * 1.06;
    const lay = C.cats.map((c) => { const lo = acc.slice(); for (let i = 0; i < n; i++) acc[i] += c.hr[i] || 0; const up = elPts(acc, 100, 100, mx), dn = elPts(lo, 100, 100, mx).reverse(); return '<path d="' + elSmooth(up) + ' L' + dn.map((p) => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' L') + ' Z" fill="' + c.c + '" fill-opacity=".75"/>'; });
    let im = 0; acc.forEach((v, i) => { if (v > acc[im]) im = i; }); const tm = new Date(M.hist.t0 + im * M.hist.step);
    return '<div class="elrow sp"><span class="elsub">' + esc(elT(lang, 'peak')) + ' <b>' + ('0' + tm.getHours()).slice(-2) + ':' + ('0' + tm.getMinutes()).slice(-2) + ' · ' + esc(lpEnWs(acc[im], lang)) + '</b></span></div><div class="elfill"><svg viewBox="0 0 100 100" preserveAspectRatio="none">' + lay.join('') + '</svg></div>' + elHourAxis(C);
  },
  clock: (C, it, lang) => {
    const a = elHours(C); if (!a) return null; const M = C.M, hrs = []; for (let i = 0; i < 24; i++) hrs.push(0);
    a.forEach((v, i) => { const hh = new Date(M.hist.t0 + i * M.hist.step).getHours(); hrs[hh] += v * M.hist.step / 3600000; });
    const mx = Math.max.apply(null, hrs.concat([1])), now = new Date().getHours(); let s = '';
    hrs.forEach((v, hh) => { const a0 = hh * 15 + 1.5, a1 = hh * 15 + 13.5, r0 = 54, r1 = 54 + 34 * v / mx, f = v / mx, c = f > 0.7 ? '#FF5A5A' : f > 0.4 ? '#FF9142' : f > 0.2 ? '#FFC94A' : '#3DDC84'; const p0 = elPol(100, 100, r0, a0), p1 = elPol(100, 100, r1, a0), p2 = elPol(100, 100, r1, a1), p3 = elPol(100, 100, r0, a1); s += '<path d="M' + p0.join(',') + ' L' + p1.join(',') + ' A' + r1 + ',' + r1 + ' 0 0 1 ' + p2.join(',') + ' L' + p3.join(',') + ' A' + r0 + ',' + r0 + ' 0 0 0 ' + p0.join(',') + 'Z" fill="' + c + '" opacity="' + (hh === now ? 1 : 0.78) + '"/>'; });
    [0, 6, 12, 18].forEach((q) => { const p = elPol(100, 100, 46, q * 15); s += '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 3).toFixed(1) + '" text-anchor="middle" class="elsv" style="font-size:8px">' + ('0' + q).slice(-2) + '</text>'; });
    const kwh = elSum(hrs) / 1000;
    return '<div class="elfill"><svg viewBox="0 0 200 200">' + s + '<text x="100" y="98" text-anchor="middle" class="elsn" style="font-size:20px">' + esc(lpEnNum(kwh, 1, lang)) + '</text><text x="100" y="113" text-anchor="middle" class="elsu" style="font-size:9px">' + esc(elT(lang, 'dayKwh')) + '</text></svg></div>';
  },
  heat: (C, it, lang) => {
    if (!C.M.hist) return null; let mx = 0; C.cats.forEach((c) => c.hr.forEach((v) => { if (v > mx) mx = v; })); mx = mx || 1; const n = LP_EN_BINS;
    const L = C.cats.slice(0, 8);
    return '<div class="elheat" style="grid-template-columns:64px repeat(' + n + ',minmax(0,1fr))">' + L.map((c) => '<span>' + esc(c.n) + '</span>' + c.hr.map((v) => '<i style="background:' + c.c + ';opacity:' + (0.08 + (v || 0) / mx * 0.92).toFixed(2) + '"></i>').join('')).join('') + '</div>' + elHourAxis(C);
  },
  mark: (C, it, lang) => {
    const a = elHours(C); if (!a) return null; const M = C.M; let im = 0, il = -1; a.forEach((v, i) => { if (v > a[im]) im = i; if (v > 0 && (il < 0 || v < a[il])) il = i; }); if (il < 0) il = 0;
    const mx = a[im] || 1, top = mx * 1.15, n = a.length;
    const mk = (i, c, up) => { const v = a[i], t = new Date(M.hist.t0 + i * M.hist.step), x = i / (n - 1) * 100, y = (1 - v / top) * 100; return '<i class="elmk" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;background:' + c + ';box-shadow:0 0 0 4px ' + c + '33"></i><span class="elmkl" style="left:' + Math.min(78, Math.max(0, x - 10)).toFixed(1) + '%;top:calc(' + y.toFixed(1) + '% ' + (up ? '- 30px' : '+ 10px') + ')"><b>' + esc(lpEnWs(v, lang)) + '</b> ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2) + '</span>'; };
    return '<div class="elfill">' + elArea(a, '#FF9142', top, { grid: true }) + mk(im, '#FF5A5A', true) + mk(il, '#3DDC84', false) + '</div>' + elHourAxis(C);
  }
};
function elBat(C, lang) {
  const F = C.F; if (!F || !(F.hasBat || F.bat !== null)) return null;
  const soc = F.soc === null ? null : F.soc, cap = F.cap, B = F.bat || 0, kwh = soc !== null && cap ? soc / 100 * cap : null;
  const st = Math.abs(B) < 5 ? 'idle' : B > 0 ? 'charge' : 'dis', col = soc === null ? '#3DDC84' : soc < 15 ? '#FF5A5A' : soc < 35 ? '#FFC94A' : '#3DDC84';
  const hrs = kwh === null || Math.abs(B) < 5 ? 0 : B > 0 ? (cap - kwh) / (B / 1000) : kwh / (-B / 1000);
  const eta = hrs > 0.02 && hrs <= 48 ? elT(lang, B > 0 ? 'full' : 'left', { t: lpEnDur(hrs * 60, lang) }) : '';
  return { soc: soc, cap: cap, B: B, kwh: kwh, st: st, col: col, eta: eta, lab: elT(lang, st) + (st === 'idle' ? '' : ' · ' + lpEnWs(Math.abs(B), lang)), s: soc === null ? 0 : soc };
}
LP_EL.battery = {
  ring: (C, it, lang) => {
    const b = elBat(C, lang); if (!b) return null; const id = elId();
    return '<div class="elfill"><svg viewBox="0 0 200 200"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="' + b.col + '" stop-opacity=".6"/><stop offset="1" stop-color="' + b.col + '"/></linearGradient></defs><circle cx="100" cy="100" r="78" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="14"/>' + (b.s > 0.5 ? '<path d="' + elArc(100, 100, 78, 0, 360 * b.s / 100) + '" fill="none" stroke="url(#' + id + ')" stroke-width="14" stroke-linecap="round"/>' : '') +
      '<text x="100" y="104" text-anchor="middle" class="elsn">' + (b.soc === null ? '–' : esc(lpEnPct(b.soc, lang))) + '</text><text x="100" y="126" text-anchor="middle" class="elsu" style="fill:' + (b.st === 'idle' ? '#c9ccd1' : b.col) + ';font-weight:700">' + esc(b.lab) + '</text></svg></div>' + (b.eta || b.kwh !== null ? '<div class="elsub elcen elh-s">' + (b.kwh !== null ? esc(lpEnNum(b.kwh, 1, lang)) + ' kWh' : '') + (b.eta ? ' · ' + esc(b.eta) : '') + '</div>' : '');
  },
  cell: (C, it, lang) => {
    const b = elBat(C, lang); if (!b) return null; const id = elId();
    return '<div class="elside"><div class="elfill" style="flex:0 0 40%"><svg viewBox="0 0 80 150"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="' + b.col + '" stop-opacity=".65"/><stop offset="1" stop-color="' + b.col + '"/></linearGradient><clipPath id="' + id + 'c"><rect x="8" y="16" width="64" height="128" rx="12"/></clipPath></defs><rect x="28" y="4" width="24" height="10" rx="4" fill="rgba(255,255,255,.25)"/><rect x="5" y="13" width="70" height="134" rx="15" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="3"/><g clip-path="url(#' + id + 'c)"><rect x="8" y="' + (144 - 128 * b.s / 100).toFixed(1) + '" width="64" height="' + (128 * b.s / 100).toFixed(1) + '" fill="url(#' + id + ')"/></g></svg></div>' +
      '<div class="n"><span class="elbig">' + (b.soc === null ? '–' : esc(lpEnPct(b.soc, lang))) + '</span><div class="elsub" style="color:' + (b.st === 'idle' ? '#c9ccd1' : b.col) + ';font-weight:700;margin:6px 0 8px">' + esc(b.lab) + '</div>' + (b.kwh !== null ? '<div class="elsub elh-s">' + esc(lpEnNum(b.kwh, 1, lang)) + ' / ' + esc(lpEnNum(b.cap, b.cap % 1 ? 1 : 0, lang)) + ' kWh</div>' : '') + (b.eta ? '<div class="elsub elh-s">' + esc(b.eta) + '</div>' : '') + '</div></div>';
  },
  wave: (C, it, lang) => {
    const b = elBat(C, lang); if (!b) return null; const id = elId(), y = 180 - 160 * b.s / 100;
    let wv = 'M0,' + y.toFixed(1) + ' Q25,' + (y - 7).toFixed(1) + ' 50,' + y.toFixed(1); for (let x = 100; x <= 400; x += 50) wv += ' T' + x + ',' + y.toFixed(1); wv += ' V200 H0Z';
    return '<div class="elfill"><svg viewBox="0 0 200 200"><defs><clipPath id="' + id + '"><circle cx="100" cy="100" r="78"/></clipPath></defs><circle cx="100" cy="100" r="86" fill="none" stroke="' + b.col + '" stroke-opacity=".35" stroke-width="3"/><circle cx="100" cy="100" r="78" fill="rgba(255,255,255,.03)"/><g clip-path="url(#' + id + ')"><path class="elwave s" d="' + wv + '" fill="' + b.col + '" fill-opacity=".35" transform="translate(0,6)"/><path class="elwave" d="' + wv + '" fill="' + b.col + '" fill-opacity=".75"/></g>' +
      '<text x="100" y="98" text-anchor="middle" class="elsn">' + (b.soc === null ? '–' : esc(lpEnPct(b.soc, lang))) + '</text><text x="100" y="120" text-anchor="middle" class="elsu" style="fill:#fff;font-weight:700">' + esc(b.lab) + '</text></svg></div>';
  },
  strip: (C, it, lang) => {
    const b = elBat(C, lang); if (!b) return null; const segs = 10, on = Math.round(b.s / 10);
    return '<div class="elmid"><div class="elrow sp"><span class="elbig">' + (b.soc === null ? '–' : esc(lpEnPct(b.soc, lang))) + '</span><span class="elsub elr" style="color:' + (b.st === 'idle' ? '#c9ccd1' : b.col) + ';font-weight:700">' + esc(b.lab) + '</span></div><div class="ellvl b">' + Array.apply(null, Array(segs)).map((x, i) => '<i style="background:' + (i < on ? b.col : 'rgba(255,255,255,.07)') + (i === on - 1 && b.st === 'charge' ? ';animation:elpulse 1.4s infinite' : '') + '"></i>').join('') + '</div><div class="elrow sp elsub"><span>' + (b.kwh !== null ? esc(lpEnNum(b.kwh, 1, lang)) + ' / ' + esc(lpEnNum(b.cap, b.cap % 1 ? 1 : 0, lang)) + ' kWh' : '') + '</span><span>' + esc(b.eta) + '</span></div></div>';
  }
};
// tarife kartı: varsayılanı dahil bütün görünümler burada
function elTar(C, lang) {
  const M = C.M; if (!M.days) return null;
  const mk = lpEnMonthKwh(M), md = lpEnMonthDays(), mc = lpEnMonthCost(mk, md, M), P = lpEnPeriod(), D = 86400000;
  const from = P ? P.from : (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  const el = Math.max(1, (Date.now() - from) / D), endK = mk / el * md, endC = lpEnMonthCost(endK, md, M);
  const yk = lpEnYear(M), yl = lpEnYearLimit(), mode = lpEnMode();
  const fd = (t) => new Date(t).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' });
  return { mk: mk, md: md, mc: mc, from: from, to: from + md * D, day: Math.min(md, Math.ceil(el)), endK: endK, endC: endC, yk: yk, yl: yl, mode: mode, unit: C.price, fd: fd, tier: mode === 'tier' };
}
LP_EL.tariff = {
  '': (C, it, lang) => {
    const T = elTar(C, lang); if (!T) return null; if (!T.unit) return '<div class="enmsg"><ha-icon icon="mdi:cash"></ha-icon><b>' + esc(elT(lang, 'noPrice')) + '</b><span>' + esc(elT(lang, 'noPriceT')) + '</span></div>';
    const ds = []; for (let i = Math.max(0, C.N - 9); i < C.N; i++) ds.push(C.dayTot(i) * T.unit); const dm = Math.max.apply(null, ds.concat([0.001]));
    return '<div class="elrow sp"><span class="elbig" style="font-size:34px">' + esc(C.money(T.mc.tl)) + '</span><span class="elsub elr">' + esc(elT(lang, 'perEnd')) + ' ~' + esc(C.money(T.endC.tl)) + '</span></div>' +
      (T.tier ? elPb(elT(lang, 'bill') + ' · ' + elT(lang, T.mc.hi > 0 ? 'dear' : 'cheap'), T.mc.lo, T.mc.lim, 'kWh', T.mc.hi > 0 ? '#FF9142' : '#3DDC84', lang) : '') + (T.yk ? elPb(new Date().getFullYear() + ' · ' + elT(lang, 'yearL'), T.yk, T.yl, 'kWh', T.yk / T.yl > 0.85 ? '#F2A93B' : '#4DD0E1', lang) : '') +
      '<div class="elfill elh-s" style="min-height:40px"><svg viewBox="0 0 90 40" preserveAspectRatio="none">' + ds.map((v, i) => { const hh = v / dm * 34; return '<rect x="' + (i * 10 + 1.5) + '" y="' + (40 - hh).toFixed(2) + '" width="7" height="' + hh.toFixed(2) + '" rx="1.5" fill="' + (i === ds.length - 1 ? '#F2A93B' : 'rgba(255,255,255,.16)') + '"/>'; }).join('') + '</svg><span class="elmut eltr">' + esc(elT(lang, 'costDays')) + '</span></div>';
  },
  nums: (C, it, lang) => {
    const T = elTar(C, lang); if (!T || !T.unit) return LP_EL.tariff[''](C, it, lang);
    const L = [[C.money(T.mc.tl), elT(lang, 'bill').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en'), '#fff'], ['~' + C.money(T.endC.tl), elT(lang, 'perEnd'), '#c9ccd1'], [lpEnNum(T.unit, 2, lang), elT(lang, 'unit'), '#3DDC84'], [T.yk ? lpEnPct(T.yk / T.yl * 100, lang) : '–', elT(lang, 'yearL'), '#F2A93B']];
    return '<div class="elbox4">' + L.map((x) => '<div><b style="color:' + x[2] + '">' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>').join('') + '</div>';
  },
  ring: (C, it, lang) => {
    const T = elTar(C, lang); if (!T || !T.unit) return LP_EL.tariff[''](C, it, lang);
    const f = T.tier ? T.mc.lo / Math.max(1, T.mc.lim) : T.mk / Math.max(1, T.endK), t = T.day / T.md;
    return '<div class="elside"><div class="elfill"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="14"/><path d="' + elArc(100, 100, 80, 0, Math.max(2, 360 * Math.min(1, f))) + '" fill="none" stroke="#3DDC84" stroke-width="14" stroke-linecap="round"/><circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="6"/><path d="' + elArc(100, 100, 60, 0, Math.max(2, 360 * t)) + '" fill="none" stroke="#7C9CFF" stroke-width="6" stroke-linecap="round"/>' +
      '<text x="100" y="98" text-anchor="middle" class="elsn" style="font-size:30px">' + esc(lpEnNum(Math.round(T.mk), 0, lang)) + '</text><text x="100" y="116" text-anchor="middle" class="elsu">' + (T.tier ? '/ ' + esc(lpEnNum(Math.round(T.mc.lim), 0, lang)) + ' kWh' : 'kWh') + '</text></svg></div>' +
      '<div class="ellg2 elw-s"><div><i style="background:#3DDC84"></i><span>' + esc(elT(lang, T.tier ? 'tierUse' : 'kwhUse')) + '</span><b>' + lpEnPct(f * 100, lang) + '</b></div><div><i style="background:#7C9CFF"></i><span>' + esc(elT(lang, 'perUse')) + '</span><b>' + lpEnPct(t * 100, lang) + '</b></div><div class="elh-s"><b class="eln20">' + esc(C.money(T.mc.tl)) + '</b></div></div></div>';
  },
  time: (C, it, lang) => {
    const T = elTar(C, lang); if (!T || !T.unit) return LP_EL.tariff[''](C, it, lang); const tf = T.day / T.md * 100;
    return '<div class="elrow sp elsub"><span>' + esc(T.fd(T.from)) + '</span><b style="color:#fff">' + esc(lpEnT(lang, 'todayD')) + ' · ' + esc(elT(lang, 'perDay', { d: T.day })) + '</b><span>' + esc(T.fd(T.to - 86400000)) + '</span></div><div class="eltime"><i class="a"></i><i class="b" style="width:' + tf.toFixed(1) + '%"></i><i class="c" style="left:' + tf.toFixed(1) + '%"></i><i class="d" style="left:calc(' + tf.toFixed(1) + '% - 7px)"></i></div>' +
      '<div class="elnum3"><div><b>' + esc(C.money(T.mc.tl)) + '</b><span>' + esc(elT(lang, 'soFar')) + '</span></div><div><b>~' + esc(C.money(T.endC.tl)) + '</b><span>' + esc(elT(lang, 'perEnd')) + '</span></div><div><b style="color:#3DDC84">' + (T.tier ? lpEnPct(T.mc.lo / Math.max(1, T.mc.lim) * 100, lang) : esc(lpEnNum(T.unit, 2, lang))) + '</b><span>' + esc(T.tier ? elT(lang, 'cheap') : elT(lang, 'unit')) + '</span></div></div>' + (T.yk ? elPb(new Date().getFullYear() + ' · ' + elT(lang, 'yearL'), T.yk, T.yl, 'kWh', '#F2A93B', lang, 'elh-s') : '');
  },
  rcpt: (C, it, lang) => {
    const T = elTar(C, lang); if (!T || !T.unit) return LP_EL.tariff[''](C, it, lang);
    const r = (a, b, cls) => '<div class="' + (cls || '') + '">' + esc(a) + ' <b>' + esc(b) + '</b></div>';
    return '<div class="elrcpt">' + r(lpEnNum(Math.round(T.mk), 0, lang) + ' kWh', T.tier ? elT(lang, T.mc.hi > 0 ? 'dear' : 'cheap') : lpEnNum(T.unit, 2, lang) + ' ₺') + (T.tier ? r(lpEnNum(Math.round(T.mc.lo), 0, lang) + ' kWh × ' + lpEnNum(lpEnNumOf(lpEnCfg().low), 2, lang), C.money(T.mc.lo * lpEnNumOf(lpEnCfg().low)), 'elh-s') + (T.mc.hi > 0 ? r(lpEnNum(Math.round(T.mc.hi), 0, lang) + ' kWh × ' + lpEnNum(lpEnNumOf(lpEnCfg().high), 2, lang), C.money(T.mc.hi * lpEnNumOf(lpEnCfg().high)), 'elh-s') : '') : '') +
      r(elT(lang, 'perEnd'), '~' + C.money(T.endC.tl), 'elh-m') + r(elT(lang, 'bill'), C.money(T.mc.tl), 'tt') + '</div>';
  }
};
function elMeter(C, lang) { const m = lpEnMeter(); if (!m || !m.power || C.M.demo) return null; const v = m.volt ? lpEnW(C.S, m.volt) : null; return { m: m, home: C.home, dev: C.sum, unt: Math.max(0, C.home - C.sum), volt: v }; }
const elNoMeter = (lang) => '<div class="enmsg"><ha-icon icon="mdi:meter-electric-outline"></ha-icon><b>' + esc(elT(lang, 'noMeter')) + '</b><span>' + esc(elT(lang, 'noMeterT')) + '</span></div>';
LP_EL.meter = {
  '': (C, it, lang) => {
    const X = elMeter(C, lang); if (!X) return elNoMeter(lang); const a = elHours(C);
    return '<div>' + elBig(X.home, lang) + '</div><div class="elstrip h22"><i style="flex:' + Math.max(0.001, X.dev) + ';background:#7C9CFF"></i><i style="flex:' + Math.max(0.001, X.unt) + ';background:' + elHatch + '"></i></div><div class="ellg"><span><i style="background:#7C9CFF"></i>' + esc(elT(lang, 'devs')) + ' ' + esc(lpEnWs(X.dev, lang)) + '</span><span><i style="background:#555a63"></i>' + esc(elT(lang, 'unt')) + ' ' + esc(lpEnWs(X.unt, lang)) + ' · ' + lpEnPct(X.unt / Math.max(1, X.home) * 100, lang) + '</span></div>' +
      (a ? '<div class="elfill elh-s" style="min-height:30px">' + elArea(a, '#7C9CFF', Math.max.apply(null, a.concat([1])) * 1.1, { op: 0.25 }) + '</div>' : '') +
      '<div class="elh-m">' + elChs([[X.volt === null ? '–' : lpEnNum(X.volt, 0, lang) + ' V', elT(lang, 'volt')], [C.M.days ? lpEnNum(C.dayTot(C.N - 1), 1, lang) : '–', elT(lang, 'kwhToday')], [lpEnYear(C.M) ? lpEnNum(Math.round(lpEnYear(C.M)), 0, lang) : '–', 'kWh ' + new Date().getFullYear()]]) + '</div>';
  },
  nums: (C, it, lang) => { const X = elMeter(C, lang); if (!X) return elNoMeter(lang); const L = [[lpEnWs(X.home, lang), elT(lang, 'home'), '#fff'], [lpEnWs(X.dev, lang), elT(lang, 'devs'), '#7C9CFF'], [lpEnWs(X.unt, lang), elT(lang, 'unt'), '#c9ccd1'], [X.volt === null ? '–' : lpEnNum(X.volt, 0, lang) + ' V', elT(lang, 'volt'), '#3DDC84']]; return '<div class="elbox4">' + L.map((x) => '<div><b style="color:' + x[2] + '">' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>').join('') + '</div>'; },
  rings: (C, it, lang) => {
    const X = elMeter(C, lang); if (!X) return elNoMeter(lang); const mx = lpEnLim()[2] * 1.25, f = X.dev / Math.max(1, X.home), p = lpEnWp(X.home, lang);
    return '<div class="elfill"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="12"/><path d="' + elArc(100, 100, 82, 0, Math.max(2, 360 * Math.min(1, X.home / mx))) + '" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="100" cy="100" r="64" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="12"/><path d="' + elArc(100, 100, 64, 0, Math.max(2, 360 * Math.min(1, X.home / mx) * f)) + '" fill="none" stroke="#7C9CFF" stroke-width="12" stroke-linecap="round"/>' +
      '<text x="100" y="98" text-anchor="middle" class="elsn" style="font-size:28px">' + esc(p[0]) + '</text><text x="100" y="115" text-anchor="middle" class="elsu" style="font-size:10px">' + p[1] + ' · ' + esc(elT(lang, 'unt').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + ' ' + lpEnPct(X.unt / Math.max(1, X.home) * 100, lang) + '</text></svg></div><div class="ellg elcen elh-s"><span><i style="background:#fff"></i>' + esc(elT(lang, 'home')) + '</span><span><i style="background:#7C9CFF"></i>' + esc(elT(lang, 'devs')) + '</span></div>';
  },
  lines: (C, it, lang) => {
    const X = elMeter(C, lang); if (!X) return elNoMeter(lang); const M = C.M; if (!M.hist) return LP_EL.meter[''](C, it, lang);
    const A = M.hist.total.map((v) => v || 0), B = []; for (let i = 0; i < A.length; i++) B.push(Math.min(A[i], elSum(C.cats.map((c) => c.hr[i] || 0))));
    const top = Math.max.apply(null, A.concat([1])) * 1.1, P1 = elPts(A, 100, 100, top), P2 = elPts(B, 100, 100, top);
    return '<div class="elrow sp">' + elBig(X.home, lang) + '<span class="elsub elr">' + esc(elT(lang, 'unt').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + '<br><b>' + esc(lpEnWs(X.unt, lang)) + '</b></span></div><div class="elfill"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="' + elSmooth(P1) + ' L' + P2.slice().reverse().map((p) => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' L') + 'Z" fill="rgba(255,255,255,.08)"/><path d="' + elSmooth(P1) + '" fill="none" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="' + elSmooth(P2) + '" fill="none" stroke="#7C9CFF" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div>' +
      '<div class="ellg elh-s"><span><i style="background:#fff"></i>' + esc(elT(lang, 'meterL')) + '</span><span><i style="background:#7C9CFF"></i>' + esc(elT(lang, 'devs')) + '</span><span><i style="background:rgba(255,255,255,.2)"></i>' + esc(elT(lang, 'diff')) + '</span></div>';
  },
  gauges: (C, it, lang) => {
    const X = elMeter(C, lang); if (!X) return elNoMeter(lang); const mx = lpEnLim()[2] * 1.25, p = lpEnWp(X.home, lang);
    const g = (fr, lab, val, c) => '<div class="elfill"><svg viewBox="0 0 120 110"><path d="' + elArc(60, 64, 46, -110, 110) + '" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/><path d="' + elArc(60, 64, 46, -110, -110 + 220 * Math.max(0.01, Math.min(1, fr))) + '" fill="none" stroke="' + c + '" stroke-width="9" stroke-linecap="round"/><text x="60" y="66" text-anchor="middle" class="elsn" style="font-size:19px">' + esc(val) + '</text><text x="60" y="82" text-anchor="middle" class="elsv">' + esc(lab) + '</text></svg></div>';
    const v = X.volt, vc = v === null ? '#8A8F96' : v < 207 || v > 253 ? '#FF5A5A' : '#3DDC84';
    return '<div class="el2">' + g(X.home / mx, p[1] + ' · ' + elT(lang, 'power'), p[0], C.lvl[1]) + g(v === null ? 0 : (v - 190) / 60, 'V · ' + elT(lang, 'volt'), v === null ? '–' : lpEnNum(v, 0, lang), vc) + '</div><div class="elsub elcen elh-s">' + esc(elT(lang, 'unt').toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + ' ' + esc(lpEnWs(X.unt, lang)) + '</div>';
  }
};
function elTips(C, lang) { return lpEnTips(C.h, C.M, lang); }
const elNoTips = (lang) => '<div class="enmsg"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>' + esc(elT(lang, 'noTips')) + '</span></div>';
const elTipAttr = (x) => ' data-entip="' + esc(x.k) + '"' + (x.ent ? ' data-tipent="' + esc(x.ent) + '"' : '');
const LP_EL_TC = { 1: '#F2A93B', 2: '#FF5A5A', 3: '#7C9CFF', 4: '#FFC94A', 5: '#3DDC84' };
const elTc = (x) => LP_EL_TC[x.pr] || '#F2A93B';
LP_EL.tips = {
  '': (C, it, lang) => { const L = elTips(C, lang); if (!L.length) return elNoTips(lang); return '<div class="elrows mid">' + L.map((x, i) => '<div class="elrw' + elHx(i) + '"' + elTipAttr(x) + '>' + elChip(x.ic, elTc(x)) + '<div class="n"><b class="elwr">' + esc(x.t) + '</b></div></div>').join('') + '</div>'; },
  one: (C, it, lang) => { const L = elTips(C, lang); if (!L.length) return elNoTips(lang); return '<div class="elmid">' + lpEnTipsHtml(C.h, C.M, lang) + (L.length > 1 ? '<div class="eldots">' + L.map((x, i) => '<i class="' + (i ? '' : 'on') + '"></i>').join('') + '</div>' : '') + '</div>'; },
  cards: (C, it, lang) => { const L = elTips(C, lang); if (!L.length) return elNoTips(lang); return '<div class="eltiles w140">' + L.map((x, i) => '<div class="eltl t' + elHx(i) + '"' + elTipAttr(x) + ' style="--c:' + elTc(x) + '">' + elChip(x.ic, elTc(x)) + '<b>' + esc(x.t) + '</b><em>' + esc(elT(lang, 'hide')) + '</em></div>').join('') + '</div>'; },
  lead: (C, it, lang) => { const L = elTips(C, lang); if (!L.length) return elNoTips(lang); const x = L[0]; return '<div class="ellead t"' + elTipAttr(x) + ' style="--c:' + elTc(x) + '">' + elChip(x.ic, elTc(x), 46) + '<div class="n"><b>' + esc(x.t) + '</b></div></div><div class="elrows elh-s">' + L.slice(1).map((y, i) => '<div class="elsm' + elHx(i + 2) + '"' + elTipAttr(y) + '>' + elIc(y.ic, 16, elTc(y)) + '<span>' + esc(y.t) + '</span></div>').join('') + '</div>'; },
  pills: (C, it, lang) => { const L = elTips(C, lang); if (!L.length) return elNoTips(lang); return '<div class="elpills">' + L.map((x) => '<span' + elTipAttr(x) + ' style="--c:' + elTc(x) + '">' + elIc(x.ic, 16, elTc(x)) + esc(x.t) + '</span>').join('') + '</div>'; }
};
// kartın gövdesi bir görünümle çizilecekse HTML, yoksa null (kartın kendi çizimi kullanılır)
function lpEnLook(h, M, it, lang, phone) {
  if (it.loose === false && M && M.cats && it.energy === 'cats') M = Object.assign({}, M, { cats: M.cats.filter((c) => c.id !== '__loose') });   // kategorisiz gizli
  const k = it.energy, L = LP_EL[k]; if (!L || !M || M.cats === undefined) return null;
  const look = it.look || '', fn = L[look]; if (!fn) return null;
  if (!M.cats.length && k !== 'flow' && k !== 'battery' && k !== 'meter' && k !== 'tariff' && k !== 'tips') return null;
  let out = null;
  try { out = fn(lpElCtx(h, M, lang), it, lang, phone); } catch (e) { out = null; }
  if (out === null && (k === 'tariff' || k === 'meter' || k === 'tips')) out = elNoHist(lang);   // bu türlerin kendi çizimi yok
  return out === null ? null : '<div class="enlk lk-' + k + (look ? ' lk-' + look : '') + '">' + out + '</div>';
}
function lpEnIsLook(it) { const L = LP_EL[it.energy]; return !!(L && L[it.look || '']); }
// küçük canlı önizleme (kart seçiminde): kartı panelin kendi CSS'iyle, gerçek kutu boyunda çizip kutucuğa sığacak kadar küçültür.
// Veri: yüklü enerji verisi, yoksa örnek veri. Görünüm seçimi ekranı her açıldığında yeniden çizilir.
const LP_EL_MINI = { h: null, lang: 'tr' };
if (typeof customElements !== 'undefined' && !customElements.get('lhd-en-mini')) {
  customElements.define('lhd-en-mini', class extends HTMLElement {
    connectedCallback() { this._draw(); }
    _draw() {
      const k = this.getAttribute('k') || 'halo', lk = this.getAttribute('look') || '', W = +this.getAttribute('w') || 420, H = +this.getAttribute('h') || 321, lang = LP_EL_MINI.lang;
      const h = LP_EL_MINI.h || { states: {} }, real = LP_EN.m && !LP_EN.m.demo && LP_EN.m.cats && LP_EN.m.cats.length ? LP_EN.m : null;
      const M = real || lpEnDemo(lang), hh = real ? h : Object.assign({}, h, { states: {}, lhdEnDemo: true });
      let it = { energy: k }; try { const x = JSON.parse(this.getAttribute('it') || 'null'); if (x && x.energy === k) it = x; } catch (e) {}   // kartın şimdiki ayarlarıyla
      if (lk) it.look = lk; else delete it.look;
      let body = ''; try { body = lpEnCard(hh, M, it, lang, false); } catch (e) { body = ''; }
      const sr = this.shadowRoot || this.attachShadow({ mode: 'open' });
      sr.innerHTML = '<style>' + CSS + ':host{display:block;position:relative;overflow:hidden;pointer-events:none}.mini{position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;transform-origin:0 0;display:flex}.mini>.box{flex:1 1 auto}</style>' +
        '<div class="mini"><div class="box"><div class="title hd"><span>' + esc(lpEnT(lang, 'k_' + k)) + '</span></div><div class="enc en-' + esc(k) + (lpEnIsLook(it) ? ' enlook' : '') + '">' + body + '</div></div></div>';
      const fit = () => { const m = sr.querySelector('.mini'); if (m && this.clientWidth) m.style.transform = 'scale(' + (this.clientWidth / W).toFixed(4) + ')'; };
      fit(); if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(fit);
    }
  });
}
