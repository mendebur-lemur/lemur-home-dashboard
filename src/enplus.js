// Enerji ekleri (v0.30): cihaz ve kategori detay penceresi (HA'nın penceresi yerine), "şu an çekenler", son 24 saat grafiğinde dokunma
// ve yeni kartlar: gece kim çekiyor (night), haftanın saatleri (heat), dün ile bugün (cmp), olağandışı (odd), fatura dönemi (period).
// Veri Home Assistant'ın istatistiklerinden istenince alınır ve bir süre saklanır (LP_EX); gelince kartlar ve açık pencere yeniden çizilir.
const LP_EX_TXT = {
  tr: { k_night: 'Gece kim çekiyor', k_heat: 'Haftanın saatleri', k_cmp: 'Dün ile bugün', k_odd: 'Olağandışı', k_period: 'Fatura dönemi',
    d_night: 'Dün gece en düşük saatlerde hangi cihaz ne çekti', d_heat: 'Son 7 günün saat saat tüketimi', d_cmp: 'Bugün bu saate kadar, dünün aynı saatine göre',
    d_odd: 'Ölçülen cihazlar kendi alışkanlığından saparsa', d_period: 'Dönem başından bugüne günlük kWh ve dönem sonu tahmini',
    s_night: 'Gece kim çekiyor', s_heat: 'Haftanın saatleri', s_cmp: 'Dün ile bugün', s_odd: 'Olağandışı', s_period: 'Fatura dönemi',
    meas: 'Ölçülen', estL: 'Tahmini · ışık modeli', estY: 'Tahmini · yıllık tüketimden', est: 'Tahmini', share: 'Evin şu anki gücündeki payı {p}', shareC: '{c} içinde {p}',
    h24: 'Son 24 saat', d7: 'Son 7 gün · kWh', per: 'Bu dönem', mon: 'Bu ay', nightMin: 'Gece en düşük (02-05)', onToday: 'Bugün açık', projEnd: 'Böyle giderse dönem sonu',
    noData: 'kayıt yok', days: 'kayıt {n} gündür', tipNight: 'Gece boyunca {w} altına inmedi. Bekleme ya da uyku ayarına bakmaya değer: ayda ~{k} kWh{c}.',
    on: 'Aç', off: 'Kapat', offSure: 'Kapatmak için tekrar dokun', lightOn: 'Işığı aç', lightOff: 'Işığı kapat', more: 'Ayrıntılar', back: 'Geri', nowAll: 'Şu an çekenler', devN: '{n} cihaz',
    nightHd: 'Dün gece 02-05 arası ev ortalama {w} çekti', nightHd2: 'Gece 02-05 arası ev ortalama {w} çekti', others: 'Diğerleri', othersT: 'Ölçülmeyen ya da küçük cihazlar',
    nightFoot: 'Bu taban gün boyu sürüyor: ayda ~{k} kWh{c}', peakAt: 'En yoğun: {d} {h}:00 · {w}', low: 'az', mid: 'orta', hi: 'çok', top: 'tepe', peakH: 'puant',
    yd: 'Dün {h}:00\'a kadar', td: 'Bugün {h}:00\'a kadar', early: 'Gün yeni başladı; ilk saat bitince karşılaştırılır.', upMost: 'En çok artan', dnMost: 'En çok azalan',
    oddUp: '{n} bugün normalin {x} katı', oddUpT: 'Bugün {t} kWh · bu hızla {p} kWh; son günlerin ortalaması {a} kWh.', oddDn: '{n} bugün normalden çok az çekiyor', oddDnT: 'Bugün {t} kWh; son günlerin ortalaması {a} kWh. Kapalı ya da bozuk olabilir.',
    oddOk: 'Olağandışı bir şey yok', oddOkT: '{n} ölçülen cihaz kendi alışkanlığıyla karşılaştırılıyor.', oddNone: 'Ölçülen cihaz yok', oddNoneT: 'Bu kart yalnız prizle ya da sayaçla ölçülen cihazlara bakar.',
    perHd: 'Bu dönem {k} kWh', perProj: 'Bu hızla dönem sonu ~{k} kWh', perCross: 'Düşük kademe sınırı ({l} kWh) ~{d} aşılır', perOver: 'Düşük kademe sınırı ({l} kWh) aşıldı', perSafe: 'Düşük kademe sınırı ({l} kWh) aşılmaz',
    perDays: '{a} – {b} · {n} gün kaldı', daily: 'günlük pay', loading: 'Yükleniyor…' },
  en: { k_night: 'Who draws at night', k_heat: 'Hours of the week', k_cmp: 'Yesterday vs today', k_odd: 'Unusual', k_period: 'Billing period',
    d_night: 'What each device drew in the quietest hours last night', d_heat: 'Hour by hour use over the last 7 days', d_cmp: 'Today so far against the same hour yesterday',
    d_odd: 'When a measured device leaves its habits', d_period: 'Daily kWh since the period began and an end-of-period estimate',
    s_night: 'Who draws at night', s_heat: 'Hours of the week', s_cmp: 'Yesterday vs today', s_odd: 'Unusual', s_period: 'Billing period',
    meas: 'Measured', estL: 'Estimated · light model', estY: 'Estimated · from yearly use', est: 'Estimated', share: '{p} of the home\'s power now', shareC: '{p} of {c}',
    h24: 'Last 24 hours', d7: 'Last 7 days · kWh', per: 'This period', mon: 'This month', nightMin: 'Lowest at night (2-5)', onToday: 'On today', projEnd: 'Period end at this rate',
    noData: 'no history', days: '{n} days of history', tipNight: 'It never went below {w} all night. Worth checking its standby or sleep setting: ~{k} kWh a month{c}.',
    on: 'Turn on', off: 'Turn off', offSure: 'Tap again to turn off', lightOn: 'Turn the light on', lightOff: 'Turn the light off', more: 'Details', back: 'Back', nowAll: 'Drawing now', devN: '{n} devices',
    nightHd: 'Last night between 2 and 5 the home drew {w} on average', nightHd2: 'Between 2 and 5 at night the home drew {w} on average', others: 'Others', othersT: 'Unmeasured or small devices',
    nightFoot: 'This base load runs all day: ~{k} kWh a month{c}', peakAt: 'Busiest: {d} {h}:00 · {w}', low: 'low', mid: 'medium', hi: 'high', top: 'peak', peakH: 'peak',
    yd: 'Yesterday until {h}:00', td: 'Today until {h}:00', early: 'The day just began; compared once the first hour is over.', upMost: 'Rose the most', dnMost: 'Fell the most',
    oddUp: '{n} is at {x}× its usual today', oddUpT: '{t} kWh today · {p} kWh at this rate; recent average {a} kWh.', oddDn: '{n} draws far less than usual today', oddDnT: '{t} kWh today; recent average {a} kWh. It may be off or broken.',
    oddOk: 'Nothing unusual', oddOkT: '{n} measured devices are compared with their own habits.', oddNone: 'No measured device', oddNoneT: 'This card only looks at devices measured by a plug or meter.',
    perHd: '{k} kWh this period', perProj: '~{k} kWh by period end at this rate', perCross: 'Lower tier limit ({l} kWh) passed around {d}', perOver: 'Lower tier limit ({l} kWh) already passed', perSafe: 'Lower tier limit ({l} kWh) will not be passed',
    perDays: '{a} – {b} · {n} days left', daily: 'daily share', loading: 'Loading…' }
};
const lpExT = (lang, k, v) => { let s = (LP_EX_TXT[lang] || LP_EX_TXT.en)[k] || LP_EX_TXT.en[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
// yeni kart türleri yönetim panelinin listesine (ad, açıklama, simge)
['night', 'heat', 'cmp', 'odd', 'period'].forEach((k) => { if (LP_EN_TYPES.indexOf(k) < 0) LP_EN_TYPES.push(k); });
Object.assign(LP_EN_IC, { night: 'mdi:weather-night', heat: 'mdi:calendar-clock', cmp: 'mdi:compare-horizontal', odd: 'mdi:alert-decagram-outline', period: 'mdi:calendar-range' });
['tr', 'en'].forEach((l) => { ['night', 'heat', 'cmp', 'odd', 'period'].forEach((k) => { ['k_', 'd_', 's_'].forEach((p) => { LP_EN_TXT[l][p + k] = LP_EX_TXT[l][p + k]; }); }); });

const LP_EX = { c: {}, busy: {} }, LP_EX_H = 3600000, LP_EX_D = 86400000;
// istenince getir: saklanan değer (yoksa undefined: yükleniyor); eskiyse arkada yenilenir, gelince kartlar yeniden çizilir
function lpExGet(h, key, ttl, fn) {
  const C = LP_EX.c[key], conn = h && h.connection;
  if (!(C && Date.now() - C.at < ttl) && !LP_EX.busy[key] && conn && conn.sendMessagePromise) {
    LP_EX.busy[key] = 1;
    Promise.resolve().then(() => fn(conn)).then((v) => { LP_EX.c[key] = { at: Date.now(), v: v }; }, () => { LP_EX.c[key] = { at: Date.now(), v: null }; })
      .then(() => { delete LP_EX.busy[key]; lpEnFire(); });
  }
  return C ? C.v : undefined;
}
const lpExSt = (conn, ids, start, period, types, units, end) => (ids.length ? lpEnStat(conn, { type: 'recorder/statistics_during_period', start_time: new Date(start).toISOString(), end_time: end ? new Date(end).toISOString() : undefined, period: period, statistic_ids: ids, types: types, units: units }).catch(() => ({})) : Promise.resolve({}));
const lpExT0 = (x) => (typeof x.start === 'number' ? x.start : Date.parse(x.start));
const lpExDay0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
function lpExNight0() { const d = new Date(); d.setHours(2, 0, 0, 0); if (Date.now() < d.getTime() + 3 * LP_EX_H) d.setDate(d.getDate() - 1); return d.getTime(); }
function lpExPerFrom() { const P = lpEnPeriod(); if (P) return P.from; const m = new Date(); m.setDate(1); m.setHours(0, 0, 0, 0); return m.getTime(); }
// evin toplam gücünü veren sensörler: ayardaki toplam, yoksa ev sayacı (güneşsiz), yoksa kategoriler
function lpExTotIds(M) {
  const c = lpEnCfg(); if (c.total) return [c.total];
  const m = lpEnMeter(); if (m && m.power && !m.inv && !lpEnSunOn() && !lpEnBatOn()) return [m.power];
  const o = []; M.cats.forEach((x) => { if (x.p) o.push(x.p); else x.kids.forEach((k) => { if (k.p && o.indexOf(k.p) < 0) o.push(k.p); }); });
  return o;
}
const lpExMoney = (h, M, kwh, lang) => { const u = lpEnUnit(M); return u > 0 ? lpEnMoney(h, kwh * u, lang) : ''; };
const lpExK = (k, lang) => lpEnNum(k, k < 10 ? (k < 1 ? 2 : 1) : 0, lang);
const lpExHH = (t) => ('0' + new Date(t).getHours()).slice(-2) + ':' + ('0' + new Date(t).getMinutes()).slice(-2);
const lpExDM = (t) => { const d = new Date(t); return d.getDate() + '.' + (d.getMonth() + 1); };
const lpExLoading = (lang) => '<div class="enmsg"><span>' + esc(lpExT(lang, 'loading')) + '</span></div>';

// ---- grafikler ----
function lpExArea(vals, color, W, H, labels, mxIn) {
  const v = vals.filter((x) => x !== null && x !== undefined); if (v.length < 2) return '<svg class="exch" viewBox="0 0 ' + W + ' ' + H + '"></svg>';
  const n = vals.length, mx = mxIn || Math.max.apply(null, v.concat([1])) * 1.12, pb = 16, X = (i) => (i / (n - 1) * (W - 2) + 1), Y = (x) => H - pb - x / mx * (H - pb - 6), pts = [];
  vals.forEach((x, i) => { if (x !== null && x !== undefined) pts.push(X(i).toFixed(1) + ',' + Y(x).toFixed(1)); });
  let s = '<line x1="0" x2="' + W + '" y1="' + Y(mx / 2.24).toFixed(1) + '" y2="' + Y(mx / 2.24).toFixed(1) + '" stroke="rgba(255,255,255,.06)"/>';
  s += '<polygon points="' + X(0).toFixed(1) + ',' + (H - pb) + ' ' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + (H - pb) + '" fill="' + color + '" opacity=".2"/><polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round"/>';
  (labels || []).forEach((l, j, a) => { s += '<text x="' + X(l[0]).toFixed(1) + '" y="' + (H - 3) + '" text-anchor="' + (j === 0 ? 'start' : j === a.length - 1 ? 'end' : 'middle') + '">' + esc(l[1]) + '</text>'; });
  return '<svg class="exch" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>';
}
function lpExBars(vals, labels, color, W, H, lang, last) {
  const mx = Math.max.apply(null, vals.map((x) => x || 0).concat([0.001])) * 1.25, n = vals.length, cw = W / n, bw = Math.min(26, cw * 0.62), pb = 16;
  let s = '';
  vals.forEach((x, i) => {
    const bx = i * cw + (cw - bw) / 2, hh = x ? Math.max(2, x / mx * (H - pb - 14)) : 2, y = H - pb - hh;
    s += '<rect x="' + bx.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="' + Math.min(6, bw / 3).toFixed(1) + '" fill="' + (x ? color : 'rgba(255,255,255,.08)') + '" opacity="' + (x ? (i === n - 1 && last ? 1 : 0.6) : 1) + '"/>';
    if (x && n <= 7) s += '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" text-anchor="middle">' + esc(lpExK(x, lang)) + '</text>';
    if (labels[i]) s += '<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle">' + esc(labels[i]) + '</text>';
  });
  return '<svg class="exch" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>';
}

// ---- cihaz detayı ----
function lpExDevData(h, M, d) {
  if (M.demo) {
    const hrs = []; for (let i = 0; i < 24; i++) { const x = new Date(Date.now() - (23 - i) * LP_EX_H).getHours(); hrs.push({ t: 0, v: (d.w || 10) * (x >= 18 || x < 1 ? 1 : x < 7 ? 0.3 : 0.6) }); }
    return { hrs: hrs, d7: [0.8, 1.1, 0.9, 1.2, 1, 1.3, 0.7].map((x) => x * (d.w || 10) / 60), per: (d.w || 10) * 0.2, from: lpExPerFrom(), night: (d.w || 10) * 0.3, on: null };
  }
  return lpExGet(h, 'dev:' + d.id, 300000, (conn) => {
    const now = Date.now(), d0 = lpExDay0(), from = lpExPerFrom(), w7 = d0 - 6 * LP_EX_D;
    const lk = d.link && /^(light|switch|fan|input_boolean)\./.test(d.link) ? conn.sendMessagePromise({ type: 'history/history_during_period', start_time: new Date(d0).toISOString(), entity_ids: [d.link], minimal_response: true, no_attributes: true }).catch(() => null) : Promise.resolve(null);
    return Promise.all([d.p ? lpExSt(conn, [d.p], now - 25 * LP_EX_H, 'hour', ['mean'], { power: 'W' }) : {}, d.e ? lpExSt(conn, [d.e], Math.min(from, w7), 'day', ['change'], { energy: 'kWh' }) : {}, lk]).then((r) => {
      const hrs = ((r[0] || {})[d.p] || []).filter((x) => isFinite(x.mean)).map((x) => ({ t: lpExT0(x), v: x.mean })).filter((x) => x.t >= now - 24 * LP_EX_H - LP_EX_H);
      const days = ((r[1] || {})[d.e] || []).filter((x) => isFinite(x.change)).map((x) => ({ t: lpExT0(x), v: Math.max(0, x.change) }));
      const d7 = []; for (let i = 6; i >= 0; i--) { const t = d0 - i * LP_EX_D, f = days.filter((x) => Math.abs(x.t - t) < 12 * LP_EX_H); d7.push(f.length ? f[0].v : null); }
      let per = 0, first = 0; days.forEach((x) => { if (x.t >= from - 12 * LP_EX_H) { per += x.v; if (x.v > 0 && !first) first = x.t; } });
      const n0 = lpExNight0(), nv = hrs.filter((x) => x.t >= n0 && x.t < n0 + 3 * LP_EX_H).map((x) => x.v);
      let on = null;
      if (r[2] && r[2][d.link]) {
        let s = 0, last = null, was = false;
        r[2][d.link].forEach((p) => { const t = p.lu !== undefined ? p.lu * 1000 : Date.parse(p.last_changed || p.last_updated || ''); if (!isFinite(t)) return; const t1 = Math.max(t, d0); if (was && last !== null) s += t1 - last; last = t1; was = (p.s !== undefined ? p.s : p.state) === 'on'; });
        if (was && last !== null) s += now - last; on = s / 60000;
      }
      return { hrs: hrs, d7: d7, per: per, from: from, first: first, night: nv.length ? Math.min.apply(null, nv) : null, on: on };
    });
  });
}
function lpExHead(icon, color, name, chips, right) {
  return '<div class="exh" style="--c:' + color + '"><span class="eci"><ha-icon icon="' + esc(icon) + '"></ha-icon></span><div class="exn"><b>' + esc(name) + '</b><div class="exchips">' + chips + '</div></div>' + (right || '') +
    '<button class="enx" data-enclose><ha-icon icon="mdi:close"></ha-icon></button></div>';
}
const lpExChip = (t, cls) => '<span class="exchip' + (cls ? ' ' + cls : '') + '">' + esc(t) + '</span>';
const lpExStat = (b, s) => '<div class="exst"><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div>';
function lpExDevHtml(h, M, d, lang, ph, arm, back) {
  const S = (h && h.states) || {}, D = lpExDevData(h, M, d), w = lpEnWOf(S, d), tot = M.demo ? lpEnTotal(S, M) || 1 : lpEnTotal(S, M), c = M.cats.filter((x) => x.id === d.cat)[0];
  const est = lpEnIsEst(d), how = !est ? 'meas' : d.kind === 'light' ? 'estL' : d.kind === 'year' ? 'estY' : 'est';
  const chips = (c ? lpExChip(c.name) : '') + lpExChip(lpExT(lang, how), est ? 'est' : 'ok');
  const wp = lpEnWp(w, lang), pr = w !== null && tot ? Math.round(w / tot * 100) : null;
  let body = '<div class="exbig"><div class="exnow">' + (est && w !== null ? '~' : '') + esc(wp[0]) + '<small>' + wp[1] + '</small></div>' + (pr !== null ? '<div class="exsh">' + esc(lpExT(lang, 'share', { p: lpEnPct(Math.min(100, pr), lang) })) + '</div>' : '') + '</div>';
  if (D === undefined) return lpExHead(d.icon, d.color, d.name, chips, back) + body + lpExLoading(lang) + lpExActs(h, d, lang, arm);
  const X = D || { hrs: [], d7: [], per: 0, from: lpExPerFrom(), night: null, on: null };
  const k24 = X.hrs.reduce((a, x) => a + x.v, 0) / 1000, perL = lpEnPeriod() ? 'per' : 'mon';
  const el = Math.max(1, (Date.now() - Math.max(X.from, X.first || 0)) / LP_EX_D), len = lpEnMonthDays(), proj = X.per / el * len;   // kayıt dönemin ortasında başladıysa tahmin oradan
  const m24 = lpExMoney(h, M, k24, lang), mp = lpExMoney(h, M, X.per, lang), mj = lpExMoney(h, M, proj, lang);
  const st = [lpExStat(lpExK(k24, lang) + ' kWh', lpExT(lang, 'h24') + (m24 ? ' · ' + m24 : '')), lpExStat(lpExK(X.per, lang) + ' kWh', lpExT(lang, perL) + (mp ? ' · ' + mp : ''))];
  if (X.on !== null) st.push(lpExStat(X.on < 1 ? '0 ' + lpEnT(lang, 'm') : lpEnDur(X.on, lang), lpExT(lang, 'onToday')));
  else if (X.night !== null) st.push(lpExStat('~' + lpEnWs(X.night, lang), lpExT(lang, 'nightMin')));
  if (X.per > 0) st.push(lpExStat('~' + (mj || lpExK(proj, lang) + ' kWh'), lpExT(lang, 'projEnd')));
  body += '<div class="exstats' + (st.length === 4 ? ' n4' : '') + '">' + st.join('') + '</div>' + (typeof lpCyDevHtml === 'function' ? lpCyDevHtml(h, d, lang) : '');   // makine: şu anki durum ve son çalışma (src/cycle.js)
  const hv = X.hrs.length >= 2 ? X.hrs.map((x) => x.v) : (M.hist && M.hist.devs && M.hist.devs[d.id]) || [];
  const lab = X.hrs.length >= 2 ? [[0, lpExHH(X.hrs[0].t)], [Math.round((X.hrs.length - 1) / 2), lpExHH(X.hrs[Math.round((X.hrs.length - 1) / 2)].t)], [X.hrs.length - 1, lpExHH(X.hrs[X.hrs.length - 1].t)]] : [];
  const wd = lpEnT(lang, 'wd'), d0 = lpExDay0(), dl = X.d7.map((x, i) => (i === 6 ? lpEnT(lang, 'todayD') : wd[new Date(d0 - (6 - i) * LP_EX_D).getDay()]));
  const nd = X.d7.filter((x) => x !== null && x > 0).length;
  body += '<div class="excharts"><div class="exbox"><h4>' + esc(lpExT(lang, 'h24')) + '</h4>' + (hv.length >= 2 ? lpExArea(hv, d.color, 400, 120, M.demo ? [] : lab) : '<div class="exempty">' + esc(lpExT(lang, 'noData')) + '</div>') + '</div>' +
    '<div class="exbox"><h4>' + esc(lpExT(lang, 'd7')) + (nd && nd < 7 ? ' <i>' + esc(lpExT(lang, 'days', { n: nd })) + '</i>' : '') + '</h4>' + (nd ? lpExBars(X.d7, dl, d.color, ph ? 400 : 240, ph ? 110 : 120, lang, true) : '<div class="exempty">' + esc(lpExT(lang, 'noData')) + '</div>') + '</div></div>';
  // ipucu: ölçülen cihaz gece hiç inmediyse; ya da panelin "uzun süredir açık" ipucu
  let tip = '';
  if (!est && X.night !== null && X.night >= 15) { const mk = X.night * 24 * 30 / 1000, mc = lpExMoney(h, M, mk, lang); tip = lpExT(lang, 'tipNight', { w: lpEnWs(X.night, lang), k: lpEnNum(Math.round(mk), 0, lang), c: mc ? ' · ' + mc : '' }); }
  if (!tip && !M.demo) lpEnTips(h, M, lang).forEach((x) => { if (!tip && x.dev === d.id) tip = x.t; });
  if (tip) body += '<div class="extip"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>' + esc(tip) + '</span></div>';
  return lpExHead(d.icon, d.color, d.name, chips, back) + body + lpExActs(h, d, lang, arm);
}
// aç/kapat için varlık: bağlı ışık ya da anahtar; bağlı olan ölçen prizin güç sensörüyse aynı cihazın anahtarı
function lpExSw(h, d) {
  const S = (h && h.states) || {}, E = (h && h.entities) || {}, ok = (x) => /^(light|switch|fan|input_boolean)\./.test(x || '');
  if (ok(d.link)) return d.link;
  const dv = d.link && E[d.link] && E[d.link].device_id; if (!dv) return null;
  const L = Object.keys(E).filter((x) => E[x].device_id === dv && /^switch\./.test(x) && S[x] && !E[x].hidden && !E[x].entity_category);
  return L.length === 1 ? L[0] : null;
}
function lpExActs(h, d, lang, arm) {
  const S = (h && h.states) || {}, id = lpExSw(h, d), st = id && S[id], dom = id ? id.split('.')[0] : '';
  let a = '';
  if (st && /^(light|switch|fan|input_boolean)$/.test(dom) && st.state !== 'unavailable') {
    const on = st.state === 'on', lt = dom === 'light';
    a += '<button class="exb' + (on ? '' : ' pri') + (arm ? ' arm' : '') + '" data-enact="' + esc(id) + '">' + esc(arm ? lpExT(lang, 'offSure') : on ? lpExT(lang, lt ? 'lightOff' : 'off') : lpExT(lang, lt ? 'lightOn' : 'on')) + '</button>';
  }
  const more = d.link || d.p;
  if (more && S[more]) a += '<button class="exb gh" data-enmore="' + esc(more) + '">' + esc(lpExT(lang, 'more')) + '</button>';
  return a ? '<div class="exacts">' + a + '</div>' : '';
}
// ---- kategori detayı ve "şu an çekenler" (catId '__all') ----
function lpExCatHtml(h, M, catId, lang) {
  const S = (h && h.states) || {}, all = catId === '__all', c = all ? null : M.cats.filter((x) => x.id === catId)[0]; if (!all && !c) return '';
  const kids = all ? M.devs : c.kids, tot = lpEnTotal(S, M);
  const L = kids.map((d) => ({ d: d, w: lpEnWOf(S, d) })).filter((x) => !all || (x.w !== null && x.w >= 0.5)).sort((a, b) => (b.w || 0) - (a.w || 0));
  const cw = all ? tot : lpEnCatW(S, c), color = all ? '#5B8DEF' : c.color, mx = (L[0] && L[0].w) || 1;
  const wp = lpEnWp(cw, lang), pr = !all && cw !== null && tot ? Math.round(cw / tot * 100) : null;
  let body = '<div class="exbig"><div class="exnow">' + esc(wp[0]) + '<small>' + wp[1] + '</small></div>' + (pr !== null ? '<div class="exsh">' + esc(lpExT(lang, 'share', { p: lpEnPct(Math.min(100, pr), lang) })) + '</div>' : '') + '</div>';
  // 24 saat ve 7 gün (yüklü enerji verisinden), bu dönemin kWh'i
  const hv = M.hist ? (all ? M.hist.total : M.hist.cats[c.id]) : null, N = M.days ? M.days.t.length : 0;
  const dv = []; if (N) for (let i = N - 7; i < N; i++) dv.push(all ? lpEnDayTot(M, i) : (M.days.cats[c.id] || [])[i] || 0);
  if (hv || N) {
    const wd = lpEnT(lang, 'wd'), dl = N ? M.days.t.slice(N - 7).map((t, i) => (i === 6 ? lpEnT(lang, 'todayD') : wd[new Date(t).getDay()])) : [];
    const lab = M.hist ? [[0, lpExHH(M.hist.t0)], [LP_EN_BINS - 1, lpExHH(M.hist.t0 + (LP_EN_BINS - 1) * M.hist.step)]] : [];
    body += '<div class="excharts"><div class="exbox"><h4>' + esc(lpExT(lang, 'h24')) + '</h4>' + (hv ? lpExArea(hv, color, 400, 110, lab) : '') + '</div><div class="exbox"><h4>' + esc(lpExT(lang, 'd7')) + '</h4>' + (N ? lpExBars(dv, dl, color, 240, 110, lang, true) : '') + '</div></div>';
  }
  if (N) {
    const from = lpExPerFrom(); let pk = 0; M.days.t.forEach((t, i) => { if (t >= from - 12 * LP_EX_H) pk += all ? lpEnDayTot(M, i) : (M.days.cats[c.id] || [])[i] || 0; });
    const pm = lpExMoney(h, M, pk, lang); body += '<div class="exstats">' + lpExStat(lpExK(pk, lang) + ' kWh', lpExT(lang, lpEnPeriod() ? 'per' : 'mon') + (pm ? ' · ' + pm : '')) + lpExStat(lpExT(lang, 'devN', { n: L.length }), all ? lpExT(lang, 'nowAll') : c.name) + '</div>';
  }
  body += '<div class="entop exlist">' + L.map((x) => '<div class="enrk" data-endev="' + esc(x.d.id) + '" style="--c:' + x.d.color + '"><span class="eci"><ha-icon icon="' + esc(x.d.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(x.d.name) + '</span><i class="erl"><i style="width:' + Math.max(2, (x.w || 0) / mx * 100).toFixed(1) + '%"></i></i></div><b class="erw' + (lpEnTil(x.d) ? ' est' : '') + '">' + lpEnTil(x.d) + esc(x.w === null ? '–' : lpEnWs(x.w, lang)) + '</b><ha-icon class="exgo" icon="mdi:chevron-right"></ha-icon></div>').join('') + '</div>';
  return lpExHead(all ? 'mdi:home-lightning-bolt-outline' : c.icon, color, all ? lpExT(lang, 'nowAll') : c.name, '', '') + body;
}
// açık pencere: P = { k: 'cat' | 'dev', id }
function lpExPopHtml(h, M, P, lang, ph, arm, back) {
  const bk = back ? '<button class="enx exbk" data-enback><ha-icon icon="mdi:arrow-left"></ha-icon></button>' : '';
  let inner = '';
  if (P.k === 'dev') { const d = M.devs.filter((x) => x.id === P.id)[0]; if (!d) return ''; inner = lpExDevHtml(h, M, d, lang, ph, arm, bk); }
  else if (P.k === 'ana') inner = lpExAnaHtml(h, M, P, lang, ph);   // src/enrep.js
  else if (P.k === 'rep') inner = lpExRepHtml(h, M, P, lang, ph);
  else inner = lpExCatHtml(h, M, P.id, lang);
  if (!inner) return '';
  return '<div class="enpd expd' + (P.k === 'ana' || P.k === 'rep' ? ' exwide' : '') + '">' + (ph ? '<div class="exgrab"></div>' : '') + inner + '</div>';
}
// son 24 saat grafiğinde dokunulan an: saat, evin gücü, o an en çok çeken kategoriler
function lpExDayTip(svg, clientX, M, lang) {
  if (!M || !M.hist) return;
  const r = svg.getBoundingClientRect(), vb = svg.viewBox && svg.viewBox.baseVal; if (!r.width || !vb) return;
  const n = LP_EN_BINS, xv = (clientX - r.left) / r.width * vb.width, i = Math.max(0, Math.min(n - 1, Math.round((xv - 40) / (vb.width - 44) * (n - 1))));
  const host = svg.parentNode; if (!host) return;
  const old = host.querySelector('.extt'); if (old) old.parentNode.removeChild(old);
  const ol = svg.querySelector('.extl'); if (ol) ol.parentNode.removeChild(ol);
  const t = M.hist.t0 + i * M.hist.step, tot = M.hist.total[i];
  const L = M.cats.map((c) => ({ c: c, v: (M.hist.cats[c.id] || [])[i] })).filter((x) => x.v !== null && x.v !== undefined && x.v >= 1).sort((a, b) => b.v - a.v).slice(0, 3);
  const lx = 40 + i / (n - 1) * (vb.width - 44), ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  ln.setAttribute('class', 'extl'); ln.setAttribute('x1', lx); ln.setAttribute('x2', lx); ln.setAttribute('y1', 4); ln.setAttribute('y2', vb.height - 20); svg.appendChild(ln);
  const tip = document.createElement('div'); tip.className = 'extt';
  tip.innerHTML = '<b>' + esc(lpExHH(t) + '–' + lpExHH(t + M.hist.step)) + ' · ' + esc(tot === null || tot === undefined ? '–' : lpEnWs(tot, lang)) + '</b>' + L.map((x) => '<span><i style="background:' + x.c.color + '"></i>' + esc(x.c.name) + '<em>' + esc(lpEnWs(x.v, lang)) + '</em></span>').join('');
  const fx = (lx / vb.width) * 100; tip.style.left = Math.max(2, Math.min(62, fx - 18)).toFixed(1) + '%';
  host.appendChild(tip);
  clearTimeout(LP_EX.tt); LP_EX.tt = setTimeout(() => { if (tip.parentNode) tip.parentNode.removeChild(tip); if (ln.parentNode) ln.parentNode.removeChild(ln); }, 6000);
}

// olağandışı: ölçülen cihazların bugünkü gidişi son günlerin ortalamasıyla (kart ve Analiz karosundaki uyarı sayısı)
function lpExOddData(h, M, meas) {
  return M.demo ? { L: [{ d: M.devs[1].id, up: true, ratio: 2.1, today: 1.9, avg: 0.9, proj: 1.9 }] } : !meas.length ? { L: [] } : lpExGet(h, 'odd', 1800000, (conn) => {
      const d0 = lpExDay0();
      return lpExSt(conn, meas.map((d) => d.e), d0 - 8 * LP_EX_D, 'day', ['change'], { energy: 'kWh' }).then((r) => {
        const hrs = Math.floor((Date.now() - d0) / LP_EX_H), L = [];
        meas.forEach((d) => {
          const A = ((r[d.e]) || []).filter((x) => isFinite(x.change)).map((x) => ({ t: lpExT0(x), v: Math.max(0, x.change) }));
          const prev = A.filter((x) => x.t < d0 - 12 * LP_EX_H), td = A.filter((x) => x.t >= d0 - 12 * LP_EX_H);
          if (prev.length < 4 || hrs < 6) return;
          const avg = prev.reduce((a, x) => a + x.v, 0) / prev.length, today = td.length ? td[td.length - 1].v : 0, proj = today * 24 / hrs;
          if (avg < 0.15) return;
          if (proj / avg >= 1.8) L.push({ d: d.id, up: true, ratio: proj / avg, today: today, avg: avg, proj: proj });
          else if (proj / avg <= 0.25 && avg >= 0.4) L.push({ d: d.id, up: false, ratio: proj / avg, today: today, avg: avg, proj: proj });
        });
        return { L: L };
      });
    });
}
// ---- yeni kartlar ----
function lpExCard(h, M, it, lang, phone) {
  const k = it.energy; if (!LP_EX_CARDS[k]) return null;
  if (!M || !M.cats.length) return lpEnEmpty(M, lang, false);
  try { return LP_EX_CARDS[k](h, M, it, lang, phone); } catch (e) { return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>'; }
}
const LP_EX_CARDS = {
  night: (h, M, it, lang) => {
    const D = M.demo ? { n0: lpExNight0(), tot: 140, devs: M.devs.slice(0, 5).map((d, i) => ({ id: d.id, w: [60, 22, 12, 10, 6][i] })) } : lpExGet(h, 'night', 1800000, (conn) => {
      const n0 = lpExNight0(), ids = [], tids = lpExTotIds(M);
      M.devs.forEach((d) => { if (d.p && ids.indexOf(d.p) < 0) ids.push(d.p); });
      return lpExSt(conn, ids.concat(tids.filter((x) => ids.indexOf(x) < 0)), n0, 'hour', ['mean'], { power: 'W' }, n0 + 3 * LP_EX_H).then((r) => {
        const avg = (id) => { const L = (r[id] || []).filter((x) => isFinite(x.mean)); return L.length ? L.reduce((a, x) => a + x.mean, 0) / L.length : null; };
        let tot = null; tids.forEach((id) => { const v = avg(id); if (v !== null) tot = (tot || 0) + v; });
        return { n0: n0, tot: tot, devs: M.devs.map((d) => ({ id: d.id, w: d.p ? avg(d.p) : null })).filter((x) => x.w !== null && x.w >= 0.5) };
      });
    });
    if (D === undefined) return lpExLoading(lang);
    if (!D || D.tot === null) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const L = D.devs.slice().sort((a, b) => b.w - a.w).slice(0, 4), shown = L.reduce((a, x) => a + x.w, 0), rest = Math.max(0, D.tot - shown), mx = Math.max(D.tot, 1);
    const dm = (id) => M.devs.filter((x) => x.id === id)[0] || {};
    const row = (ic, col, name, sub, w, at) => '<div class="exrow"' + (at || '') + ' style="--c:' + col + '"><span class="eci"><ha-icon icon="' + esc(ic) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(name) + '</span>' + (sub ? '<span class="exsub">' + esc(sub) + '</span>' : '<i class="erl"><i style="width:' + Math.max(2, w / mx * 100).toFixed(1) + '%"></i></i>') + '</div><b class="erw">' + esc(lpEnWs(w, lang)) + '</b></div>';
    const mk = D.tot * 24 * 30 / 1000, mc = lpExMoney(h, M, mk, lang), y = Date.now() - D.n0 > 12 * LP_EX_H;
    return '<div class="exnt">' + esc(lpExT(lang, y ? 'nightHd' : 'nightHd2', { w: lpEnWs(D.tot, lang) })) + '</div><div class="exrows">' +
      L.map((x) => { const d = dm(x.id); return row(d.icon || 'mdi:flash', d.color || '#8A8F96', d.name || x.id, '', x.w, ' data-endev="' + esc(x.id) + '"'); }).join('') +
      (rest >= 1 ? row('mdi:dots-horizontal-circle-outline', '#8A8F96', lpExT(lang, 'others'), lpExT(lang, 'othersT'), rest) : '') + '</div>' +
      '<div class="exft">' + esc(lpExT(lang, 'nightFoot', { k: lpEnNum(Math.round(mk), 0, lang), c: mc ? ' · ~' + mc : '' })) + '</div>';
  },
  heat: (h, M, it, lang) => {
    const from = lpExDay0() - 6 * LP_EX_D;
    const D = M.demo ? (() => { const g = []; for (let i = 0; i < 7; i++) { const r = []; for (let x = 0; x < 24; x++) r.push((x < 7 ? 150 : x < 17 ? 350 : x < 23 ? 900 : 300) + ((i * 7 + x * 13) % 10) * 25); g.push(r); } return { from: from, g: g }; })() : lpExGet(h, 'heat', 1800000, (conn) => {
      const ids = lpExTotIds(M);
      return lpExSt(conn, ids, from, 'hour', ['mean'], { power: 'W' }).then((r) => {
        const g = []; for (let i = 0; i < 7; i++) { const a = []; for (let x = 0; x < 24; x++) a.push(null); g.push(a); }
        ids.forEach((id) => (r[id] || []).forEach((x) => { if (!isFinite(x.mean)) return; const t = lpExT0(x), di = Math.floor((t - from) / LP_EX_D + 0.02), hr = new Date(t).getHours(); if (di >= 0 && di < 7) g[di][hr] = (g[di][hr] || 0) + x.mean; }));
        return { from: from, g: g };
      });
    });
    if (D === undefined) return lpExLoading(lang);
    const all = []; (D ? D.g : []).forEach((r) => r.forEach((v) => { if (v !== null) all.push(v); }));
    if (all.length < 6) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const srt = all.slice().sort((a, b) => a - b), q = (p) => srt[Math.min(srt.length - 1, Math.floor(p * srt.length))], q1 = q(0.5), q2 = q(0.85), q3 = q(0.97);
    const col = (v) => (v === null ? 'rgba(255,255,255,.03)' : v >= q3 ? '#FF5A5A' : v >= q2 ? '#FFC94A' : v >= q1 ? '#3d7bd1' : '#1d3550');
    const wd = lpEnT(lang, 'wd'), tou = lpEnMode() === 'tou';
    let best = null, s = '<span></span>';
    for (let x = 0; x < 24; x++) s += '<span class="hh">' + (x % 6 === 0 ? x : '') + '</span>';
    D.g.forEach((r, i) => {
      const dt = D.from + i * LP_EX_D; s += '<span class="dd">' + esc(i === 6 ? lpEnT(lang, 'todayD') : wd[new Date(dt).getDay()]) + '</span>';
      r.forEach((v, x) => { if (v !== null && (!best || v > best.v)) best = { v: v, i: i, x: x }; s += '<i style="background:' + col(v) + '"' + (tou && x >= 17 && x < 22 ? ' class="pk"' : '') + '></i>'; });
    });
    const lg = [['#1d3550', 'low'], ['#3d7bd1', 'mid'], ['#FFC94A', 'hi'], ['#FF5A5A', 'top']].map((x) => '<span><i style="background:' + x[0] + '"></i>' + esc(lpExT(lang, x[1])) + '</span>').join('') + (tou ? '<span><i class="pk"></i>' + esc(lpExT(lang, 'peakH')) + ' 17-22</span>' : '');
    return '<div class="exhm">' + s + '</div><div class="enlg exlg">' + lg + '</div>' + (best ? '<div class="exft">' + esc(lpExT(lang, 'peakAt', { d: best.i === 6 ? lpEnT(lang, 'todayD') : wd[new Date(D.from + best.i * LP_EX_D).getDay()], h: ('0' + best.x).slice(-2), w: lpEnWs(best.v, lang) })) + '</div>' : '');
  },
  cmp: (h, M, it, lang) => {
    const of = (c) => (c.e ? [c.e] : (c.es || []));
    const D = M.demo ? { H0: new Date().getHours(), cats: M.cats.map((c, i) => ({ id: c.id, y: [1.2, 3.4, 1.1, 0.6, 0.4, 0.1][i] || 0.2, t: [1.1, 4.1, 1.3, 0.5, 0.4, 0.1][i] || 0.2 })) } : lpExGet(h, 'cmp', 600000, (conn) => {
      const d0 = lpExDay0(), ids = []; M.cats.forEach((c) => of(c).forEach((x) => { if (x && ids.indexOf(x) < 0) ids.push(x); }));
      const hid = (lpEnHomeIds(M) || []).filter((x) => ids.indexOf(x) < 0);   // ev sayacı: dünün ve bugünün toplamı ondan
      return lpExSt(conn, ids.concat(hid), d0 - LP_EX_D, 'hour', ['change'], { energy: 'kWh' }).then((r) => {
        const H0 = new Date().getHours();
        let my = null, mt = null;
        if (hid.length) { my = 0; mt = 0; hid.forEach((id) => (r[id] || []).forEach((x) => { if (!isFinite(x.change)) return; const ts = lpExT0(x); if (new Date(ts).getHours() >= H0) return; if (ts >= d0) mt += x.change; else my += x.change; })); }
        return { H0: H0, my: my, mt: mt, cats: M.cats.map((c) => { let y = 0, t = 0; of(c).forEach((id) => (r[id] || []).forEach((x) => { if (!isFinite(x.change)) return; const ts = lpExT0(x); if (new Date(ts).getHours() >= H0) return; if (ts >= d0) t += Math.max(0, x.change); else y += Math.max(0, x.change); })); return { id: c.id, y: y, t: t }; }) };
      });
    });
    if (D === undefined) return lpExLoading(lang);
    if (!D) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    if (!D.H0) return '<div class="enmsg"><span>' + esc(lpExT(lang, 'early')) + '</span></div>';
    // ev sayacı o günü tutuyorsa (lpEnHomeDays: sayaçtan) toplam sayaçtan; satırlar yine kategoriler
    const Hd = lpEnHomeDays(M), Nd = M.days ? M.days.t.length : 0, mOk = (i, v) => typeof v === 'number' && v >= 0 && !!Hd && Nd > 1 && !!Hd.idx[i] && Hd.idx[i].m;
    const Y = mOk(Nd - 2, D.my) ? D.my : D.cats.reduce((a, x) => a + x.y, 0), T = mOk(Nd - 1, D.mt) ? D.mt : D.cats.reduce((a, x) => a + x.t, 0), hh = ('0' + D.H0).slice(-2);
    const dp = Y > 0.05 ? Math.round((T - Y) / Y * 100) : null, my = lpExMoney(h, M, Y, lang), mt = lpExMoney(h, M, T, lang);
    const box = (lab, k, sub, cls) => '<div class="exst"><span>' + esc(lab) + '</span><b>' + esc(lpExK(k, lang)) + ' kWh</b><span' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(sub) + '</span></div>';
    let s = '<div class="exstats">' + box(lpExT(lang, 'yd', { h: hh }), Y, my || '') + box(lpExT(lang, 'td', { h: hh }), T, (dp === null ? '' : (dp > 0 ? '▲ ' : dp < 0 ? '▼ ' : '') + lpEnPct(Math.abs(dp), lang)) + (mt ? ' · ' + mt : ''), dp === null ? '' : dp > 5 ? 'up' : dp < -5 ? 'dn' : '') + '</div>';
    const L = D.cats.map((x) => ({ c: M.cats.filter((c) => c.id === x.id)[0], d: x.t - x.y })).filter((x) => x.c);
    const up = L.slice().sort((a, b) => b.d - a.d)[0], dn = L.slice().sort((a, b) => a.d - b.d)[0];
    const row = (x, lab, cls) => '<div class="exrow" data-encat="' + esc(x.c.id) + '" style="--c:' + x.c.color + '"><span class="eci"><ha-icon icon="' + esc(x.c.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(x.c.name) + '</span><span class="exsub">' + esc(lab) + '</span></div><b class="erw ' + cls + '">' + (x.d > 0 ? '+' : '−') + esc(lpExK(Math.abs(x.d), lang)) + ' kWh</b></div>';
    s += '<div class="exrows">' + (up && up.d >= 0.05 ? row(up, lpExT(lang, 'upMost'), 'up') : '') + (dn && dn.d <= -0.05 ? row(dn, lpExT(lang, 'dnMost'), 'dn') : '') + '</div>';
    return s;
  },
  odd: (h, M, it, lang) => {
    const meas = M.devs.filter((d) => !lpEnIsEst(d) && d.e);
    const left = M.demo ? lpEnDemoTips(M, lang) : lpEnTips(h, M, lang).filter((x) => /^left:/.test(x.k));
    const D = lpExOddData(h, M, meas);
    if (D === undefined) return lpExLoading(lang);
    const dm = (id) => M.devs.filter((x) => x.id === id)[0] || {};
    const al = (ic, col, b, s, at) => '<div class="exal"' + (at || '') + ' style="--c:' + col + '"><span class="eci"><ha-icon icon="' + ic + '"></ha-icon></span><div class="exn"><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div></div>';
    const A = ((D && D.L) || []).map((x) => { const d = dm(x.d); return al(x.up ? 'mdi:trending-up' : 'mdi:trending-down', x.up ? '#FF5A5A' : '#FFC94A', lpExT(lang, x.up ? 'oddUp' : 'oddDn', { n: d.name || '', x: lpEnNum(x.ratio, 1, lang) }), lpExT(lang, x.up ? 'oddUpT' : 'oddDnT', { t: lpExK(x.today, lang), p: lpExK(x.proj, lang), a: lpExK(x.avg, lang) }), ' data-endev="' + esc(x.d) + '"'); })
      .concat(left.map((x) => al('mdi:timer-alert-outline', '#FF9142', x.t, '', x.dev ? ' data-endev="' + esc(x.dev) + '"' : '')));
    if (A.length) return '<div class="exrows">' + A.slice(0, 4).join('') + '</div>';
    return meas.length ? '<div class="enmsg exok"><ha-icon icon="mdi:check-circle-outline"></ha-icon><b>' + esc(lpExT(lang, 'oddOk')) + '</b><span>' + esc(lpExT(lang, 'oddOkT', { n: meas.length })) + '</span></div>'
      : '<div class="enmsg"><ha-icon icon="mdi:power-plug-outline"></ha-icon><b>' + esc(lpExT(lang, 'oddNone')) + '</b><span>' + esc(lpExT(lang, 'oddNoneT')) + '</span></div>';
  },
  period: (h, M, it, lang, phone) => {
    if (!M.days) return lpExLoading(lang);
    const from = lpExPerFrom(), len = lpEnMonthDays(), N = M.days.t.length, vals = [], labs = [];
    for (let j = 0; j < len; j++) {
      const t = from + j * LP_EX_D, i = M.days.t.findIndex((x) => Math.abs(x - t) < 12 * LP_EX_H);
      vals.push(i >= 0 && i < N ? lpEnDayTot(M, i) : null); labs.push(j === 0 || j === len - 1 || (t <= Date.now() && Date.now() < t + LP_EX_D) ? lpExDM(t) : '');
    }
    const mk = lpEnMonthKwh(M), el = Math.max(1, (Date.now() - from) / LP_EX_D), rate = mk / el, proj = rate * len;
    const mc = lpEnMonthCost(mk, len, M), pc = lpEnMonthCost(proj, len, M), u = lpEnUnit(M);
    const mx = Math.max.apply(null, vals.map((x) => x || 0).concat([0.1])) * 1.2, W = phone ? 360 : 600, H = 120, pb = 16, cw = W / len, bw = Math.max(3, cw * 0.62);
    let s = '';
    const tier = lpEnMode() === 'tier' ? lpEnDaily() : 0;
    vals.forEach((v, j) => { const x = j * cw + (cw - bw) / 2, fut = from + j * LP_EX_D > Date.now(), hh = v ? Math.max(2, v / mx * (H - pb - 8)) : 2; s += '<rect x="' + x.toFixed(1) + '" y="' + (H - pb - hh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="2" fill="' + (fut ? 'rgba(255,255,255,.06)' : tier && v > tier ? '#FF9142' : '#5B8DEF') + '"/>'; if (labs[j]) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle">' + esc(labs[j]) + '</text>'; });
    if (tier && tier < mx) { const y = (H - pb - tier / mx * (H - pb - 8)).toFixed(1); s += '<line x1="0" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="#3DDC84" stroke-dasharray="4 4" opacity=".7"/><text x="' + (W - 2) + '" y="' + (+y + 12) + '" text-anchor="end" fill="#3DDC84">' + esc(lpExT(lang, 'daily')) + '</text>'; }
    let line3 = '';
    if (tier) {
      const lim = mc.lim, ls = lpEnNum(Math.round(lim), 0, lang);
      if (mk >= lim) line3 = lpExT(lang, 'perOver', { l: ls });
      else if (proj > lim && rate > 0) line3 = lpExT(lang, 'perCross', { l: ls, d: lpExDM(from + lim / rate * LP_EX_D) });
      else line3 = lpExT(lang, 'perSafe', { l: ls });
    }
    const left = Math.max(0, Math.ceil(len - el));
    return '<div class="exnt"><b>' + esc(lpExT(lang, 'perHd', { k: lpEnNum(Math.round(mk * 10) / 10, mk < 100 ? 1 : 0, lang) })) + (u ? ' · ' + esc(lpEnMoney(h, mc.tl, lang)) : '') + '</b><span>' + esc(lpExT(lang, 'perDays', { a: lpExDM(from), b: lpExDM(from + (len - 1) * LP_EX_D), n: left })) + '</span></div>' +
      '<svg class="ench2" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' +
      '<div class="exft">' + esc(lpExT(lang, 'perProj', { k: lpEnNum(Math.round(proj), 0, lang) })) + (u ? ' · ~' + esc(lpEnMoney(h, pc.tl, lang)) : '') + (line3 ? '<br>' + esc(line3) : '') + '</div>';
  }
};
