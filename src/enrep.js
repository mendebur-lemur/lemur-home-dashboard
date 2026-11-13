// Enerji: "Analiz ve raporlar" kartı (v0.31). İki karo: Analiz penceresi (gece, saatler, dün/bugün, olağandışı, 7 gün, dönem)
// ve Raporlar penceresi (aylık / yıllık). Pencereler açılmadıkça hiçbir şey çizilmez ve veri istenmez. Rapor verisi Home Assistant'ın
// kalıcı istatistiklerinden (gün / ay toplamları); biten dönemin özeti bu tarayıcıda saklanır, yeniden sorulmaz.
const LP_ER_TXT = {
  tr: { k_nav: 'Analiz ve raporlar', d_nav: 'İki karo: Analiz ve Raporlar pencereleri', s_nav: 'Analiz ve raporlar', ana: 'Analiz', rep: 'Raporlar', warnN: '{n} uyarı', allOk: 'her şey normal',
    anaT: 'Enerji analizi', show: 'Analiz penceresinde', month: 'Ay', year: 'Yıl', running: 'sürüyor', use: 'Tüketim', cost: 'Tutar', avg: 'Günlük ortalama', peak: 'en yoğun: {d} · {k} kWh',
    tier: 'Kademe ({l} kWh)', tierOk: 'aşılmadı', tierOver: 'aşıldı', tierNo: 'tarife kademesiz', vsPrev: '{p} {m} ayına göre', vsLy: 'geçen yıl aynı ay {k} kWh', noPrev: 'önceki ay kaydı yok',
    daily: 'Günlük kWh', cats: 'Kategoriler', topM: 'Dönemin en çok tüketenleri', wk: 'Hafta içi · hafta sonu', wkd: 'hafta içi', wke: 'hafta sonu', perDay: 'günlük ortalama',
    sbT: 'Bekleme ~{c} tuttu', sbTk: 'Bekleme ~{k} kWh', sbS: 'Gece tabanı ortalama {w}; dönemin {p} kadarı hiçbir şey kullanılmıyorken gitti.',
    topT: '{n} tek başına {p}', topS: '{k} kWh{c}', none: 'Bu dönem için kayıt yok', noneS: 'Home Assistant bu dönemde bu sensörlerin istatistiğini tutmamış.',
    ytd: 'Bu yıl şimdiye kadar', ytdAll: 'Yıl toplamı', yEnd: 'Yıl sonu tahmini', yLim: 'Yıllık sınır ({l} kWh)', left: 'kalan {k} kWh', under: 'sınırın altında', over: 'sınırı aşıyor',
    vsLyY: '{p} geçen yılın aynı dönemine göre', monthly: 'Aylık kWh', legend: 'gri: {a} · renkli: {b}', bestM: 'En yüksek ay {m}', bestS: '{k} kWh{c}', topY: 'Yılın en çok tüketenleri',
    vsPrevS: '{p} {m} ayının aynı günlerine göre', csv: 'CSV indir', measured: 'Panonun ölçtüğü ve tahmin ettiği cihazlar; tutar bugünkü tarifeyle', loading: 'Yükleniyor…',
    measuredM: 'Toplam ev sayacından; kategoriler panonun ölçtüğü ve tahmin ettiği cihazlar; tutar bugünkü tarifeyle' },
  en: { k_nav: 'Analysis and reports', d_nav: 'Two tiles: the Analysis and Reports windows', s_nav: 'Analysis and reports', ana: 'Analysis', rep: 'Reports', warnN: '{n} alerts', allOk: 'all normal',
    anaT: 'Energy analysis', show: 'In the Analysis window', month: 'Month', year: 'Year', running: 'in progress', use: 'Usage', cost: 'Cost', avg: 'Daily average', peak: 'busiest: {d} · {k} kWh',
    tier: 'Tier ({l} kWh)', tierOk: 'not passed', tierOver: 'passed', tierNo: 'no tiered tariff', vsPrev: '{p} vs {m}', vsLy: 'same month last year {k} kWh', noPrev: 'no previous month',
    daily: 'Daily kWh', cats: 'Categories', topM: 'Top consumers of the period', wk: 'Weekdays · weekend', wkd: 'weekdays', wke: 'weekend', perDay: 'daily average',
    sbT: 'Standby cost ~{c}', sbTk: 'Standby ~{k} kWh', sbS: 'Night base load {w} on average; {p} of the period went while nothing was in use.',
    topT: '{n} alone {p}', topS: '{k} kWh{c}', none: 'No history for this period', noneS: 'Home Assistant kept no statistics for these sensors in this period.',
    ytd: 'This year so far', ytdAll: 'Year total', yEnd: 'Year-end estimate', yLim: 'Yearly limit ({l} kWh)', left: '{k} kWh left', under: 'below the limit', over: 'passes the limit',
    vsLyY: '{p} vs the same period last year', monthly: 'Monthly kWh', legend: 'grey: {a} · colour: {b}', bestM: 'Highest month {m}', bestS: '{k} kWh{c}', topY: 'Top consumers of the year',
    vsPrevS: '{p} vs the same days of {m}', csv: 'Download CSV', measured: 'Devices the dashboard measures or estimates; cost at today\'s tariff', loading: 'Loading…',
    measuredM: 'Total from the home meter; categories are the devices the dashboard measures or estimates; cost at today\'s tariff' }
};
const lpErT = (lang, k, v) => { let s = (LP_ER_TXT[lang] || LP_ER_TXT.en)[k] || LP_ER_TXT.en[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
if (LP_EN_TYPES.indexOf('nav') < 0) LP_EN_TYPES.splice(0, 0, 'nav');
LP_EN_IC.nav = 'mdi:chart-box-multiple-outline';
['tr', 'en'].forEach((l) => { ['k_', 'd_', 's_'].forEach((p) => { LP_EN_TXT[l][p + 'nav'] = LP_ER_TXT[l][p + 'nav']; }); });
const LP_ER_ANA = ['night', 'heat', 'cmp', 'odd', 'week', 'period'];
const lpErShow = (it) => { const a = it && Array.isArray(it.show) ? it.show.filter((k) => LP_ER_ANA.indexOf(k) >= 0) : null; return a && a.length ? a : LP_ER_ANA.slice(); };
const lpErMon = (y, m, lang, long) => new Date(y, m, 1).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', long ? { month: 'long', year: 'numeric' } : { month: 'long' });

// ---- kart: iki karo ----
LP_EX_CARDS.nav = (h, M, it, lang) => {
  const meas = M.devs.filter((d) => !lpEnIsEst(d) && d.e), O = lpExOddData(h, M, meas);
  const left = M.demo ? 1 : lpEnTips(h, M, lang).filter((x) => /^left:/.test(x.k)).length, n = (O && O.L ? O.L.length : 0) + left;
  const now = new Date(), show = encodeURIComponent(JSON.stringify(lpErShow(it)));
  const tile = (pg, ic, col, name, sub, dot) => '<div class="encat exnv" data-enpg="' + pg + '"' + (pg === 'ana' ? ' data-enshow="' + show + '"' : '') + ' style="--c:' + col + '"><div class="ect"><span class="eci"><ha-icon icon="' + ic + '"></ha-icon></span><span class="ecn">' + esc(name) + '</span></div><div class="ecv exnvs">' + esc(sub) + '</div>' + (dot ? '<i class="exdot"></i>' : '') + '</div>';
  return '<div class="encats exnav" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
    tile('ana', 'mdi:chart-timeline-variant-shimmer', '#5B8DEF', lpErT(lang, 'ana'), n ? lpErT(lang, 'warnN', { n: n }) : lpErT(lang, 'allOk'), n > 0) +
    tile('rep', 'mdi:file-chart-outline', '#F2A93B', lpErT(lang, 'rep'), lpErMon(now.getFullYear(), now.getMonth(), lang, false), false) + '</div>';
};

// ---- Analiz penceresi ----
function lpExAnaHtml(h, M, P, lang, ph) {
  const L = Array.isArray(P.show) && P.show.length ? P.show : LP_ER_ANA;
  return '<div class="exh" style="--c:#5B8DEF"><span class="eci"><ha-icon icon="mdi:chart-timeline-variant-shimmer"></ha-icon></span><div class="exn"><b>' + esc(lpErT(lang, 'anaT')) + '</b></div><button class="enx" data-enclose><ha-icon icon="mdi:close"></ha-icon></button></div>' +
    '<div class="exana' + (ph ? ' ph' : '') + '">' + L.map((k) => '<div class="exbox exac en-' + k + '"><h4>' + esc(lpEnT(lang, 's_' + k)) + '</h4><div class="enc">' + lpEnCard(h, M, { energy: k }, lang, ph) + '</div></div>').join('') + '</div>';
}

// ---- rapor verisi ----
const lpErOf = (c) => (c.e ? [c.e] : (c.es || []));
function lpErCatIds(M) { const o = []; M.cats.forEach((c) => lpErOf(c).forEach((x) => { if (x && o.indexOf(x) < 0) o.push(x); })); return o; }
// biten dönemin özeti tarayıcıda (localStorage lhd-rep, en çok 30 dönem); süren dönem 10 dakika saklanır
function lpErStore(key, v) {
  try { const S = JSON.parse(localStorage.getItem('lhd-rep') || '{}'); S[key] = v; const K = Object.keys(S); if (K.length > 30) delete S[K[0]]; localStorage.setItem('lhd-rep', JSON.stringify(S)); } catch (e) {}
}
function lpErLoad(key) { try { const S = JSON.parse(localStorage.getItem('lhd-rep') || '{}'); return S[key] || null; } catch (e) { return null; } }
function lpErData(h, M, P) {
  const yr = P.mode === 'y', y = P.y, m = P.m;
  const from = yr ? new Date(y, 0, 1).getTime() : new Date(y, m, 1).getTime(), to = yr ? new Date(y + 1, 0, 1).getTime() : new Date(y, m + 1, 1).getTime();
  const hid = M.demo ? null : lpEnHomeIds(M);   // ev sayacı: satırların toplamı sayaçtan (lpEnMix), kategoriler parçası
  const sig = lpErCatIds(M).join(',') + '|' + M.devs.length + (hid ? '|m:' + hid.join(',') : ''), key = (yr ? 'y' : 'm') + ':' + y + (yr ? '' : '-' + m) + ':' + sig.length + ':' + M.cats.length;
  const done = to <= Date.now();
  if (M.demo) return lpErDemo(M, P);
  if (done) { const S = lpErLoad(key); if (S) return S; }
  return lpExGet(h, 'rep:' + key, done ? 43200000 : 600000, (conn) => {
    const cids = lpErCatIds(M), dids = M.devs.filter((d) => d.e).map((d) => d.e), tids = lpExTotIds(M);
    const q = yr ? [lpExSt(conn, cids, new Date(y - 1, 0, 1).getTime(), 'month', ['change'], { energy: 'kWh' }, to), lpExSt(conn, dids, from, 'month', ['change'], { energy: 'kWh' }, to), lpExSt(conn, tids, from, 'day', ['min'], { power: 'W' }, to)]
      : [lpExSt(conn, cids, from, 'day', ['change'], { energy: 'kWh' }, to), lpExSt(conn, dids, from, 'month', ['change'], { energy: 'kWh' }, to), lpExSt(conn, tids, from, 'day', ['min'], { power: 'W' }, to), lpExSt(conn, cids, new Date(y - 1, m, 1).getTime(), 'month', ['change'], { energy: 'kWh' }, from),
        lpExSt(conn, cids, new Date(y, m - 1, 1).getTime(), 'day', ['change'], { energy: 'kWh' }, done ? from : Math.min(from, new Date(y, m - 1, 1).getTime() + Date.now() - from))];   // önceki ay: süren ayda aynı süre
    const mfrom = yr ? new Date(y - 1, 0, 1).getTime() : new Date(y - 1, m, 1).getTime();
    if (hid) q.push(lpExSt(conn, cids.concat(hid.filter((x) => cids.indexOf(x) < 0)), mfrom, 'day', ['change'], { energy: 'kWh' }, to));   // gün gün sayaç ve cihazlar (geçen yılın aynı ayından)
    return Promise.all(q).then((r) => {
      const ch = (x) => (isFinite(x.change) ? Math.max(0, x.change) : 0);
      const D = { mode: yr ? 'y' : 'm', y: y, m: m, from: from, to: to, cats: {}, devs: [], rows: [], base: null };
      // satırlar: ayda günler, yılda aylar; her satırda kategori kWh'leri
      // gün 23 ya da 25 saat olabilir (yaz saati) ve Home Assistant'ın saat dilimi tarayıcınınkinden farklı olabilir: en yakın gün / ayın ortası
      const n = yr ? 12 : Math.round((to - from) / LP_EX_D), slot = (t) => { const d = new Date(t + 12 * LP_EX_H); return yr ? d.getMonth() + (d.getFullYear() - y) * 12 : Math.round((t - from) / LP_EX_D); };
      for (let i = 0; i < n; i++) D.rows.push({ t: yr ? new Date(y, i, 1).getTime() : new Date(y, m, i + 1).getTime(), c: {}, tot: 0, prev: 0 });
      M.cats.forEach((c) => {
        let sum = 0;
        lpErOf(c).forEach((id) => ((r[0] || {})[id] || []).forEach((x) => { const s = slot(lpExT0(x)), v = ch(x); if (yr && s < 0 && s >= -12) { D.rows[s + 12].prev += v; return; } if (s < 0 || s >= n) return; D.rows[s].c[c.id] = (D.rows[s].c[c.id] || 0) + v; D.rows[s].tot += v; sum += v; }));
        D.cats[c.id] = sum;
      });
      D.tot = D.rows.reduce((a, x) => a + x.tot, 0);
      M.devs.forEach((d) => { let v = 0; ((r[1] || {})[d.e] || []).forEach((x) => { v += ch(x); }); if (v > 0.005) D.devs.push({ id: d.id, v: v }); });
      D.devs.sort((a, b) => b.v - a.v); D.devs = D.devs.slice(0, 8);
      // gece tabanı: günlük en düşük gücün ortalaması (sensörlerin toplamı; tek toplam sensörde doğrudan)
      const mins = {}; tids.forEach((id) => ((r[2] || {})[id] || []).forEach((x) => { if (!isFinite(x.min)) return; const k = lpExT0(x); mins[k] = (mins[k] || 0) + Math.max(0, x.min); }));
      const mv = Object.keys(mins).map((k) => mins[k]).filter((v) => v > 0.5); if (mv.length) D.base = mv.reduce((a, b) => a + b, 0) / mv.length;
      D.nd = mv.length;   // kaydı olan gün sayısı (kayıt dönemin ortasında başladıysa ortalamalar buna göre)
      if (!yr) {
        const pm = new Date(y, m - 1, 1).getTime(), ly = new Date(y - 1, m, 1).getTime(); let p = 0, l = 0, pk = false, lk = false;
        cids.forEach((id) => ((r[3] || {})[id] || []).forEach((x) => { const t = lpExT0(x); if (Math.abs(t - pm) < 3 * LP_EX_D) { p += ch(x); pk = true; } else if (Math.abs(t - ly) < 3 * LP_EX_D) { l += ch(x); lk = true; } }));
        // önceki ayın kaydı ayın başından değilse karşılaştırma yok (kayıt ortadan başladı)
        let p2 = 0, f2 = null; cids.forEach((id) => ((r[4] || {})[id] || []).forEach((x) => { p2 += ch(x); const t = lpExT0(x); if (f2 === null || t < f2) f2 = t; }));
        D.prevTot = pk && f2 !== null && f2 < pm + 1.5 * LP_EX_D ? p2 : null; D.lyTot = lk ? l : null;
      }
      if (hid) {
        // ev sayacı: her satırın toplamı günlerinden (sayaçtan; sayaçtan önceki günler cihazlardan), "ölçülmeyen" = toplam − cihazlar
        const R = r[q.length - 1] || {}, dv = {}, mt = {}, rows = (id, f) => (R[id] || []).forEach((x) => { if (isFinite(x.change)) f(lpExT0(x), x.change); });
        cids.forEach((id) => rows(id, (t, v) => { dv[t] = (dv[t] || 0) + Math.max(0, v); }));
        hid.forEach((id) => rows(id, (t, v) => { mt[t] = (mt[t] || 0) + v; }));
        const X = lpEnMix(dv, mt, mfrom), sumIn = (a, b) => { let s = 0, n2 = 0; X.forEach((x) => { if (x.t >= a - 12 * LP_EX_H && x.t < b - 12 * LP_EX_H) { s += x.k; n2++; } }); return n2 ? s : null; };
        D.rows.forEach((w) => { w.tot = 0; w.unt = 0; if (yr) w.prev = 0; });
        X.forEach((x) => { const s = slot(x.t); if (yr && s < 0 && s >= -12) { D.rows[s + 12].prev += x.k; return; } if (s < 0 || s >= n) return; D.rows[s].tot += x.k; D.rows[s].unt += Math.max(0, x.k - x.d); });
        D.tot = D.rows.reduce((a, x) => a + x.tot, 0); D.cats.__unt = D.rows.reduce((a, x) => a + x.unt, 0); D.meter = true;
        D.ne = X.filter((x) => x.t >= from - 12 * LP_EX_H && x.t < to - 12 * LP_EX_H && x.k > 0).length;   // kaydı olan gün (yıl sonu tahmini): sayaç yeniyse gece tabanının gün sayısı değil
        if (!yr) {
          const pm = new Date(y, m - 1, 1).getTime(), pe = done ? from : Math.min(from, pm + Date.now() - from);
          // önceki ay sayaçtan: kategorilerin kaydı o ayı tutmasa da (cihazlar sonradan eklendi) sayacın kaydı ayın başından varsa karşılaştırılır
          const v = sumIn(pm, pe), f0 = X.filter((x) => x.t >= pm - 12 * LP_EX_H && x.k > 0)[0];
          D.prevTot = v !== null && f0 && f0.t < pm + 1.5 * LP_EX_D ? v : null;
          D.lyTot = sumIn(new Date(y - 1, m, 1).getTime(), new Date(y - 1, m + 1, 1).getTime());
        }
      }
      if (done && D.tot > 0) lpErStore(key, D);
      return D;
    });
  });
}
function lpErDemo(M, P) {
  const yr = P.mode === 'y', y = P.y, m = P.m, from = yr ? new Date(y, 0, 1).getTime() : new Date(y, m, 1).getTime(), to = yr ? new Date(y + 1, 0, 1).getTime() : new Date(y, m + 1, 1).getTime();
  const n = yr ? 12 : Math.round((to - from) / LP_EX_D), D = { mode: yr ? 'y' : 'm', y: y, m: m, from: from, to: to, cats: {}, devs: [], rows: [], base: 140, demo: true };
  const sh = [0.1, 0.45, 0.2, 0.12, 0.08, 0.05];
  for (let i = 0; i < n; i++) { const t = yr ? new Date(y, i, 1).getTime() : from + i * LP_EX_D, wd = new Date(t).getDay(), base = yr ? 300 + (i >= 5 && i <= 7 ? 180 : 0) + (i % 3) * 20 : 9 + ((i * 37) % 10) / 3 + (wd === 0 || wd === 6 ? 3 : 0); const r = { t: t, c: {}, tot: 0, prev: yr ? base * 1.06 : 0 }; if (t > Date.now()) { D.rows.push(r); continue; } M.cats.forEach((c, k) => { const v = base * (sh[k] || 0.05); r.c[c.id] = v; r.tot += v; D.cats[c.id] = (D.cats[c.id] || 0) + v; }); D.rows.push(r); }
  D.tot = D.rows.reduce((a, x) => a + x.tot, 0); D.prevTot = yr ? null : D.tot * 0.92; D.lyTot = yr ? null : D.tot * 1.05;
  D.devs = M.devs.slice(0, 5).map((d, i) => ({ id: d.id, v: D.tot * [0.3, 0.12, 0.08, 0.05, 0.04][i] }));
  return D;
}

// ---- rapor penceresi ----
function lpExRepHtml(h, M, P, lang, ph) {
  const yr = P.mode === 'y', now = new Date(), cur = yr ? P.y === now.getFullYear() : P.y === now.getFullYear() && P.m === now.getMonth();
  const title = yr ? String(P.y) : lpErMon(P.y, P.m, lang, true);
  const seg = '<span class="exseg"><button data-enrep="mode:m"' + (yr ? '' : ' class="on"') + '>' + esc(lpErT(lang, 'month')) + '</button><button data-enrep="mode:y"' + (yr ? ' class="on"' : '') + '>' + esc(lpErT(lang, 'year')) + '</button></span>';
  const nav = '<span class="exper"><button data-enrep="prev"><ha-icon icon="mdi:chevron-left"></ha-icon></button><b>' + esc(title) + (cur ? ' <i>' + esc(lpErT(lang, 'running')) + '</i>' : '') + '</b><button data-enrep="next"' + (cur ? ' disabled' : '') + '><ha-icon icon="mdi:chevron-right"></ha-icon></button></span>';
  const head = '<div class="exh exrh" style="--c:#F2A93B"><span class="eci"><ha-icon icon="mdi:file-chart-outline"></ha-icon></span>' + seg + nav + '<button class="enx" data-enclose><ha-icon icon="mdi:close"></ha-icon></button></div>';
  const D = lpErData(h, M, P);
  if (D === undefined) return head + lpExLoading(lang);
  if (!D || !(D.tot > 0)) return head + '<div class="enmsg"><ha-icon icon="mdi:file-chart-outline"></ha-icon><b>' + esc(lpErT(lang, 'none')) + '</b><span>' + esc(lpErT(lang, 'noneS')) + '</span></div>';
  return head + (yr ? lpErYear(h, M, D, lang, ph) : lpErMonth(h, M, D, lang, ph)) + '<div class="exrf"><span>' + esc(lpErT(lang, D.meter ? 'measuredM' : 'measured')) + '</span>' + (ph ? '' : '<button class="exb gh" data-encsv>' + esc(lpErT(lang, 'csv')) + '</button>') + '</div>';
}
const lpErKpi = (lab, big, sub, cls) => '<div class="exst exk"><span>' + esc(lab) + '</span><b>' + esc(big) + '</b><span' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(sub) + '</span></div>';
const lpErPct = (a, b, lang) => { if (!(b > 0.05)) return null; const p = Math.round((a - b) / b * 100); return { s: (p > 0 ? '▲ ' : p < 0 ? '▼ ' : '') + lpEnPct(Math.abs(p), lang), c: p > 3 ? 'up' : p < -3 ? 'dn' : '' }; };
function lpErCats(M, D, lang) {
  const L = M.cats.map((c) => ({ c: c, v: D.cats[c.id] || 0 })).filter((x) => x.v > 0.005).sort((a, b) => b.v - a.v);
  if (D.meter && D.cats.__unt > 0.005) L.push({ c: { id: '', name: lpEnT(lang, 'untracked'), icon: 'mdi:help-circle-outline', color: LP_EN_UNT_C }, v: D.cats.__unt });   // ev sayacı: ölçülmeyen pay sonda
  const mx = Math.max.apply(null, L.map((x) => x.v).concat([0])) || 1, all = D.meter ? L.reduce((a, x) => a + x.v, 0) || 1 : D.tot;   // paylar toplamı %100
  return '<div class="exrows">' + L.map((x) => '<div class="exrow"' + (x.c.id ? ' data-encat="' + esc(x.c.id) + '"' : '') + ' style="--c:' + x.c.color + '"><span class="eci"><ha-icon icon="' + esc(x.c.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(x.c.name) + '</span><i class="erl"><i style="width:' + Math.max(2, x.v / mx * 100).toFixed(1) + '%"></i></i></div><b class="erw">' + esc(lpExK(x.v, lang)) + ' kWh<small> · ' + lpEnPct(x.v / all * 100, lang) + '</small></b></div>').join('') + '</div>';
}
function lpErTop(h, M, D, lang) {
  const u = lpEnUnit(M);
  return '<div class="exrows">' + D.devs.slice(0, 5).map((x, i) => { const d = M.devs.filter((y) => y.id === x.id)[0]; if (!d) return ''; return '<div class="exrow" data-endev="' + esc(d.id) + '" style="--c:' + d.color + '"><span class="exrk">' + (i + 1) + '</span><span class="eci"><ha-icon icon="' + esc(d.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(d.name) + '</span></div><b class="erw">' + esc(lpExK(x.v, lang)) + ' kWh' + (u ? '<small> · ' + esc(lpEnMoney(h, x.v * u, lang)) + '</small>' : '') + '</b></div>'; }).join('') + '</div>';
}
function lpErMonth(h, M, D, lang, ph) {
  const len = D.rows.length, now = Date.now(), past = D.rows.filter((r) => r.t <= now && r.tot > 0), el = Math.max(1, past.length), u = lpEnUnit(M);   // yalnız kaydı olan günler
  const mc = lpEnMonthCost(D.tot, len, M), avg = D.tot / el, pk = past.slice().sort((a, b) => b.tot - a.tot)[0];
  const pm = new Date(D.y, D.m - 1, 1), pr = D.prevTot !== null && D.prevTot !== undefined ? lpErPct(D.tot, D.prevTot, lang) : null;
  const tierOn = lpEnMode() === 'tier', lim = tierOn ? lpEnDaily() * len : 0;
  let k = '<div class="exstats n4 exkp">' + lpErKpi(lpErT(lang, 'use'), lpExK(D.tot, lang) + ' kWh', pr ? lpErT(lang, D.to > now ? 'vsPrevS' : 'vsPrev', { p: pr.s, m: lpErMon(pm.getFullYear(), pm.getMonth(), lang, false) }) : lpErT(lang, 'noPrev'), pr ? pr.c : '') +
    lpErKpi(lpErT(lang, 'cost'), u ? lpEnMoney(h, mc.tl, lang) : '–', D.lyTot ? lpErT(lang, 'vsLy', { k: lpExK(D.lyTot, lang) }) : '') +
    lpErKpi(lpErT(lang, 'avg'), lpExK(avg, lang) + ' kWh', pk ? lpErT(lang, 'peak', { d: lpExDM(pk.t), k: lpExK(pk.tot, lang) }) : '') +
    (tierOn ? lpErKpi(lpErT(lang, 'tier', { l: lpEnNum(Math.round(lim), 0, lang) }), lpEnPct(D.tot / lim * 100, lang), lpErT(lang, D.tot > lim ? 'tierOver' : 'tierOk'), D.tot > lim ? 'up' : 'dn') : lpErKpi(lpErT(lang, 'tier', { l: '–' }), '–', lpErT(lang, 'tierNo'))) + '</div>';
  // günlük çubuklar (kategori renkleriyle yığılmış), kademede günlük pay çizgisi
  const W = ph ? 360 : 640, H = 150, pb = 16, cw = W / len, bw = cw * 0.66, mx = Math.max.apply(null, D.rows.map((r) => r.tot).concat([tierOn ? lpEnDaily() : 0, 0.1])) * 1.15;
  let s = '';
  D.rows.forEach((r, i) => {
    const x = i * cw + (cw - bw) / 2; let yy = H - pb;
    if (!r.tot) s += '<rect x="' + x.toFixed(1) + '" y="' + (H - pb - 2) + '" width="' + bw.toFixed(1) + '" height="2" rx="1" fill="rgba(255,255,255,.07)"/>';
    const sc = lpErScale(M, D, r);   // ev sayacı: çubuk satırın toplamı, cihazların üstünde gri ölçülmeyen
    M.cats.forEach((c) => { const v = (r.c[c.id] || 0) * sc, hh = v / mx * (H - pb - 6); if (hh <= 0) return; yy -= hh; s += '<rect x="' + x.toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + c.color + '"/>'; });
    if (D.meter && r.unt > 0) { const hh = r.unt * sc / mx * (H - pb - 6); if (hh > 0) { yy -= hh; s += '<rect x="' + x.toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + LP_EN_UNT_C + '"/>'; } }
    if (i === 0 || (i + 1) % 5 === 0 || i === len - 1) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle">' + (i + 1) + '</text>';
  });
  if (tierOn) { const ly = (H - pb - lpEnDaily() / mx * (H - pb - 6)).toFixed(1); s += '<line x1="0" x2="' + W + '" y1="' + ly + '" y2="' + ly + '" stroke="#3DDC84" stroke-dasharray="4 4" opacity=".7"/>'; }
  // hafta içi / sonu
  const wd = [0, 0], wn = [0, 0]; past.forEach((r) => { const d = new Date(r.t).getDay(), j = d === 0 || d === 6 ? 1 : 0; wd[j] += r.tot; wn[j]++; });
  const wa = wn[0] ? wd[0] / wn[0] : 0, we = wn[1] ? wd[1] / wn[1] : 0, wm = Math.max(wa, we, 0.1);
  const wk = '<div class="exwk"><div><span>' + esc(lpErT(lang, 'wkd')) + '</span><i><i style="width:' + (wa / wm * 100).toFixed(1) + '%;background:#5B8DEF"></i></i><b>' + esc(lpExK(wa, lang)) + ' kWh</b></div><div><span>' + esc(lpErT(lang, 'wke')) + '</span><i><i style="width:' + (we / wm * 100).toFixed(1) + '%;background:#FFC94A"></i></i><b>' + esc(lpExK(we, lang)) + ' kWh</b></div></div>';
  // tespitler
  let ins = '';
  if (D.base !== null && D.base > 0) { const bk = D.base * 24 * Math.min(el, D.nd || el) / 1000, p = Math.min(100, bk / D.tot * 100); ins += lpErIns('mdi:power-sleep', '#8E7CFF', u ? lpErT(lang, 'sbT', { c: lpEnMoney(h, bk * u, lang) }) : lpErT(lang, 'sbTk', { k: lpExK(bk, lang) }), lpErT(lang, 'sbS', { w: lpEnWs(D.base, lang), p: lpEnPct(p, lang) })); }
  const t0 = D.devs[0], td = t0 && M.devs.filter((y) => y.id === t0.id)[0];
  if (td && t0.v / D.tot > 0.15) ins += lpErIns(td.icon, td.color, lpErT(lang, 'topT', { n: td.name, p: lpEnPct(t0.v / D.tot * 100, lang) }), lpErT(lang, 'topS', { k: lpExK(t0.v, lang), c: u ? ' · ' + lpEnMoney(h, t0.v * u, lang) : '' }), td.id);
  return k + '<div class="exrg"><div class="exbox"><h4>' + esc(lpErT(lang, 'daily')) + '</h4><svg class="ench2" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' + lpEnLegend(M, D.meter && D.cats.__unt > 0.005 ? lang : null) + '</div><div class="exbox"><h4>' + esc(lpErT(lang, 'cats')) + '</h4>' + lpErCats(M, D, lang) + '</div></div>' +
    '<div class="exrg"><div class="exbox"><h4>' + esc(lpErT(lang, 'topM')) + '</h4>' + lpErTop(h, M, D, lang) + '</div><div class="exbox"><h4>' + esc(lpErT(lang, 'wk')) + ' <i>' + esc(lpErT(lang, 'perDay')) + '</i></h4>' + wk + (ins ? '<div class="exins">' + ins + '</div>' : '') + '</div></div>';
}
// ev sayacı: satırın parçaları (kategoriler + ölçülmeyen) toplamdan fazlaysa (cihazlar sayaçtan çok saydı) çubuk yine toplam kadar
function lpErScale(M, D, r) { if (!D.meter) return 1; const p = M.cats.reduce((a, c) => a + (r.c[c.id] || 0), 0) + (r.unt || 0); return p > r.tot && p > 0 ? r.tot / p : 1; }
const lpErIns = (ic, col, b, s, dev) => '<div class="exal"' + (dev ? ' data-endev="' + esc(dev) + '"' : '') + ' style="--c:' + col + '"><span class="eci"><ha-icon icon="' + esc(ic) + '"></ha-icon></span><div class="exn"><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div></div>';
function lpErYear(h, M, D, lang, ph) {
  const now = new Date(), cur = D.y === now.getFullYear(), u = lpEnUnit(M), lim = D.y === now.getFullYear() ? lpEnYearLimit() : lpEnLimitOf(D.y);
  const mdays = (i) => new Date(D.y, i + 1, 0).getDate();
  let cost = 0; D.rows.forEach((r, i) => { if (r.tot) cost += lpEnMonthCost(r.tot, mdays(i), M).tl; });
  // geçen yılın aynı dönemi: süren ay geçen kısmı kadar; karşılaştırılan aylardan birinin kaydı yoksa oran gösterilmez
  const m0 = new Date(D.y, now.getMonth(), 1).getTime(), fr = cur ? Math.min(1, (now.getTime() - m0) / (new Date(D.y, now.getMonth() + 1, 1).getTime() - m0)) : 1;
  const cmpM = D.rows.slice(0, cur ? now.getMonth() + 1 : 12), prevSame = cmpM.every((r) => r.prev > 0) ? cmpM.reduce((a, r, i) => a + r.prev * (cur && i === now.getMonth() ? fr : 1), 0) : 0;
  const yd0 = new Date(D.y, 0, 1).getTime(), elD = Math.max(1, D.ne || D.nd || ((cur ? Date.now() : D.to) - yd0) / LP_EX_D), yDays = (D.to - yd0) / LP_EX_D, est = cur ? D.tot / elD * yDays : D.tot;   // kaydı olan günlere göre
  const pr = lpErPct(D.tot, prevSame, lang);
  let k = '<div class="exstats n4 exkp">' + lpErKpi(lpErT(lang, cur ? 'ytd' : 'ytdAll'), lpExK(D.tot, lang) + ' kWh', pr ? lpErT(lang, 'vsLyY', { p: pr.s }) : '', pr ? pr.c : '') +
    lpErKpi(lpErT(lang, 'cost'), u ? lpEnMoney(h, cost, lang) : '–', '') +
    lpErKpi(lpErT(lang, 'yEnd'), (cur ? '~' : '') + lpExK(est, lang) + ' kWh', lpErT(lang, est > lim ? 'over' : 'under'), est > lim ? 'up' : 'dn') +
    lpErKpi(lpErT(lang, 'yLim', { l: lpEnNum(lim, 0, lang) }), lpEnPct(D.tot / lim * 100, lang), lpErT(lang, 'left', { k: lpEnNum(Math.max(0, Math.round(lim - D.tot)), 0, lang) })) + '</div>';
  // aylar: geçen yıl gri, bu yıl kategori renkleriyle; birikim çizgisi ve yıllık sınır
  const W = ph ? 360 : 640, H = 170, pb = 16, cw = W / 12, bw = cw * 0.34, mx = Math.max.apply(null, D.rows.map((r) => Math.max(r.tot, r.prev)).concat([1])) * 1.15;
  let s = '', c = 0; const pts = [];
  D.rows.forEach((r, i) => {
    const X = i * cw + cw / 2, hp = r.prev / mx * (H - pb - 12);
    if (r.prev) s += '<rect x="' + (X - bw - 1).toFixed(1) + '" y="' + (H - pb - hp).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hp.toFixed(1) + '" rx="2" fill="rgba(255,255,255,.13)"/>';
    const sc = lpErScale(M, D, r);
    let yy = H - pb; M.cats.forEach((cc) => { const v = (r.c[cc.id] || 0) * sc, hh = v / mx * (H - pb - 12); if (hh <= 0) return; yy -= hh; s += '<rect x="' + (X + 1).toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + cc.color + '"/>'; });
    if (D.meter && r.unt > 0) { const hh = r.unt * sc / mx * (H - pb - 12); if (hh > 0) { yy -= hh; s += '<rect x="' + (X + 1).toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + LP_EN_UNT_C + '"/>'; } }
    s += '<text x="' + X.toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle">' + esc(new Date(D.y, i, 1).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { month: 'short' })) + '</text>';
    if (r.tot) { c += r.tot; pts.push([X, H - pb - Math.min(1, c / lim) * (H - pb - 12)]); }
  });
  s += '<line x1="0" x2="' + W + '" y1="12" y2="12" stroke="#FF5A5A" stroke-dasharray="5 5" opacity=".55"/><text x="' + (W - 2) + '" y="24" text-anchor="end" fill="#FF5A5A">' + esc(lpEnNum(lim, 0, lang)) + ' kWh</text>';
  if (pts.length > 1) s += '<polyline points="' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') + '" fill="none" stroke="#FFC94A" stroke-width="2"/>';
  pts.forEach((p) => { s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.5" fill="#FFC94A"/>'; });
  const best = D.rows.map((r, i) => ({ r: r, i: i })).filter((x) => x.r.tot > 0).sort((a, b) => b.r.tot - a.r.tot)[0];
  let ins = '';
  if (best) ins += lpErIns('mdi:calendar-star', '#FFC94A', lpErT(lang, 'bestM', { m: lpErMon(D.y, best.i, lang, false) }), lpErT(lang, 'bestS', { k: lpExK(best.r.tot, lang), c: u ? ' · ' + lpEnMoney(h, lpEnMonthCost(best.r.tot, mdays(best.i), M).tl, lang) : '' }));
  if (D.base !== null && D.base > 0) { const bk = D.base * 24 * elD / 1000; ins += lpErIns('mdi:power-sleep', '#8E7CFF', u ? lpErT(lang, 'sbT', { c: lpEnMoney(h, bk * u, lang) }) : lpErT(lang, 'sbTk', { k: lpExK(bk, lang) }), lpErT(lang, 'sbS', { w: lpEnWs(D.base, lang), p: lpEnPct(Math.min(100, bk / D.tot * 100), lang) })); }
  return k + '<div class="exrg"><div class="exbox"><h4>' + esc(lpErT(lang, 'monthly')) + ' <i>' + esc(lpErT(lang, 'legend', { a: D.y - 1, b: D.y })) + '</i></h4><svg class="ench2" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' + lpEnLegend(M, D.meter && D.cats.__unt > 0.005 ? lang : null) + '</div><div class="exbox"><h4>' + esc(lpErT(lang, 'topY')) + '</h4>' + lpErTop(h, M, D, lang) + '</div></div>' +
    '<div class="exrg"><div class="exbox"><h4>' + esc(lpErT(lang, 'cats')) + '</h4>' + lpErCats(M, D, lang) + '</div><div class="exbox"><div class="exins">' + ins + '</div></div></div>';
}
// CSV: ayda günler, yılda aylar; sütunlar kategoriler ve toplam
function lpErCsv(h, M, P, lang) {
  const D = lpErData(h, M, P); if (!D || !D.rows) return null;
  const sep = lang === 'tr' ? ';' : ',', num = (v) => (lang === 'tr' ? String(Math.round(v * 1000) / 1000).replace('.', ',') : String(Math.round(v * 1000) / 1000));
  const txt = (x) => (/^[=+\-@\t\r]/.test(String(x)) ? "'" + x : String(x));   // kategori adı = + - @ ile başlarsa tablo programı formül saymasın (v0.32.1)
  const head = [lang === 'tr' ? 'Tarih' : 'Date'].concat(M.cats.map((c) => txt(c.name)), D.meter ? [lpEnT(lang, 'untracked')] : [], [lang === 'tr' ? 'Toplam kWh' : 'Total kWh']);
  const rows = D.rows.map((r) => { const d = new Date(r.t); return [P.mode === 'y' ? d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) : d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)].concat(M.cats.map((c) => num(r.c[c.id] || 0)), D.meter ? [num(r.unt || 0)] : [], [num(r.tot)]); });
  const q = (x) => (/[";,\n]/.test(x) ? '"' + String(x).replace(/"/g, '""') + '"' : x);
  return { name: (lang === 'tr' ? 'enerji-' : 'energy-') + (P.mode === 'y' ? P.y : P.y + '-' + ('0' + (P.m + 1)).slice(-2)) + '.csv', text: '﻿' + [head].concat(rows).map((r) => r.map(q).join(sep)).join('\r\n') };
}
