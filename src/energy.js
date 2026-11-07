// Enerji kartları (v0.25): evin anlık gücü (Halo), kategori karoları, şu an en çok çekenler, son 7/30 gün, son 24 saat, bekleme tüketimi.
// Öğe biçimi: { energy: 'halo' | 'cats' | 'top' | 'week' | 'day' | 'standby', ...kartın seçenekleri }
// Veri Home Assistant'ın Enerji ayarlarından okunur: "Cihaz tüketimi" listesi. Listede başka bir girişe bağlı olmayanlar (included_in_stat yok)
// kategori, altında başka giriş olmayanlar cihazdır. Anlık güç: girişin güç sensörü (stat_rate, ..._energy → ..._power ya da aynı cihazın güç sensörü).
// Geçmiş: HA'nın kendi kayıtları (son 24 saat güç, günlük kWh istatistiği); pano ayrıca kayıt tutmaz. 5 dakikada bir tazelenir.
// Genel ayarlar settings.energy (yönetim panelinde Enerji sayfası):
//   total, standby: evin toplam güç ve bekleme gücü sensörü; limits: Halo'nun 3 sınırı (W); badge: karoda watt 'on' | 'always'
//   price_mode: 'bill' (son faturadan) | 'single' (price) | 'tier' (low, high, daily: günlük kWh sınırı, ay = daily × gün sayısı)
//   year_mode: 'auto' (2026: 4000, 2027'den itibaren 3000 kWh) | 'manual' (year_limit); sktt_price: sınır aşılınca fiyat
//   bills: [{ from, to, kwh, tl, panel }] faturalar (panel: o dönemde panelin ölçtüğü kWh); last12: son faturadaki 12 aylık toplam
//   tilde: tahmini değerler "~" ile (varsayılan açık); untracked: ölçülmeyen pay kategori karolarında (varsayılan açık)
// Tahmini cihazlar ayrı kayıtta (data.estimates); entegrasyon her biri için sensor.lhd_<id>_power ve _energy kurar.
// Eski Safari için ?. ve ?? yok.

const LP_EN = window.__LEMUR_HD_EN || (window.__LEMUR_HD_EN = { m: null, key: '', at: 0, busy: false, subs: [], dm: null, dmL: '', tp: {} });
const LP_EN_TYPES = ['halo', 'cats', 'top', 'week', 'day', 'standby'];
const LP_EN_IC = { halo: 'mdi:lightning-bolt-circle', cats: 'mdi:view-grid-outline', top: 'mdi:format-list-numbered', week: 'mdi:chart-bar', day: 'mdi:chart-line', standby: 'mdi:power-sleep' };
const LP_EN_LVL = ['#3DDC84', '#FFC94A', '#FF9142', '#FF5A5A'];
const LP_EN_BINS = 48;   // son 24 saat yarım saatlik dilimler
const LP_EN_DAYS = 35;   // günlük kWh: son 30 gün grafiği ve bu ayın başı
// kategori adından simge ve renk (Türkçe ve İngilizce); bulunmazsa sıradaki renk
const LP_EN_LOOK = [
  [/ışık|Işık|IŞIK|isik|aydınlat|aydinlat|lamba|avize|light|lamp/i, 'mdi:lightbulb', '#FFC94A'],
  [/klima|iklim|ısıt|isit|soğut|sogut|petek|kombi|climate|heat|cool|hvac|\bac\b|air/i, 'mdi:air-conditioner', '#4DD0E1'],
  [/yazıcı|yazici|printer|3d/i, 'mdi:printer-3d', '#FF9142'],
  [/medya|ekran|televizyon|\btv\b|media|screen|display|audio|hoparlör|speaker/i, 'mdi:television', '#B388FF'],
  [/süpürge|supurge|vacuum|robot/i, 'mdi:robot-vacuum', '#3DDC84'],
  [/mutfak|kitchen|buzdolab|fridge|fırın|firin|oven|bulaşık|bulasik|dish|çamaşır|camasir|wash|dryer|kurutma/i, 'mdi:fridge-outline', '#FF7AA2'],
  [/altyapı|altyapi|\bağ\b|network|modem|router|server|sunucu|infra|\bnas\b/i, 'mdi:server-network', '#90A4AE'],
  [/bilgisayar|computer|\bpc\b|ofis|office|masa\b|desk/i, 'mdi:desktop-tower-monitor', '#7C9CFF'],
  [/şarj|sarj|charg|araç|arac|\bcar\b/i, 'mdi:ev-station', '#7BD83A']
];
const LP_EN_PAL = ['#5B8DEF', '#FF6FAE', '#F2B33D', '#4FD1C5', '#8E7CFF', '#6BC46B', '#FF8A4A', '#E5484D'];
const LP_EN_TXT = {
  tr: { lvl0: 'Düşük tüketim', lvl1: 'Orta tüketim', lvl2: 'Yüksek tüketim', lvl3: 'Çok yüksek tüketim', today: 'kWh bugün', costToday: 'bugün', month: 'kWh/ay bu hızla',
    none: 'Enerji verisi yok', noneT: 'Home Assistant\'ta Ayarlar → Panolar → Enerji → "Cihaz tüketimi"ne cihaz ya da grup ekle; kartlar oradan dolar.', loading: 'Yükleniyor…',
    sbT: 'Hiçbir şey kullanılmıyorken evin çektiği güç', sbMin: 'Son 24 saatin en düşüğü', year: 'Yılda ~{k} kWh', yearC: 'Yılda ~{k} kWh · ~{c}',
    wd: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'], todayD: 'Bugün', noHist: 'Geçmiş kaydı yok', noDev: 'Güç sensörü olan cihaz yok', devs: '{n} cihaz', close: 'Kapat', total: 'Toplam',
    costMonth: 'bu ay', tierLo: 'Bu ay düşük kademe', tierHi: 'Bu ay yüksek kademede', yearL: 'Son 12 ay · yıllık sınır', untracked: 'Ölçülmeyen', untrackedT: 'Son faturaya göre',
    k_halo: 'Evin anlık gücü', k_cats: 'Kategori karoları', k_top: 'Şu an en çok çekenler', k_week: 'Günlük tüketim', k_day: 'Son 24 saat', k_standby: 'Bekleme tüketimi',
    s_halo: 'Evin anlık gücü', s_standby: 'Bekleme', s_cats: 'Kategoriler', s_week: 'Son 7 gün · kWh', s_top: 'Şu an en çok çekenler', s_day: 'Son 24 saat', s_energy: 'Enerji' },
  en: { lvl0: 'Low usage', lvl1: 'Medium usage', lvl2: 'High usage', lvl3: 'Very high usage', today: 'kWh today', costToday: 'today', month: 'kWh/mo at this rate',
    none: 'No energy data', noneT: 'In Home Assistant go to Settings → Dashboards → Energy → "Individual devices" and add devices or groups; the cards fill from there.', loading: 'Loading…',
    sbT: 'What the home draws when nothing is in use', sbMin: 'Lowest of the last 24 hours', year: '~{k} kWh a year', yearC: '~{k} kWh a year · ~{c}',
    wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], todayD: 'Today', noHist: 'No history yet', noDev: 'No device with a power sensor', devs: '{n} devices', close: 'Close', total: 'Total',
    costMonth: 'this month', tierLo: 'This month, lower tier', tierHi: 'This month, upper tier', yearL: 'Last 12 months · yearly limit', untracked: 'Not measured', untrackedT: 'From the last bill',
    k_halo: 'Home power now', k_cats: 'Category tiles', k_top: 'Top consumers now', k_week: 'Daily usage', k_day: 'Last 24 hours', k_standby: 'Standby usage',
    s_halo: 'Home power now', s_standby: 'Standby', s_cats: 'Categories', s_week: 'Last 7 days · kWh', s_top: 'Top consumers now', s_day: 'Last 24 hours', s_energy: 'Energy' }
};
function lpEnT(lang, k, v) {
  const d = LP_EN_TXT[lang] || LP_EN_TXT.en;
  let s = d[k] !== undefined ? d[k] : LP_EN_TXT.en[k];
  if (v && typeof s === 'string') Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); });
  return s;
}
function lpEnCfg() { const s = lpSettings().energy; return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; }
function lpEnLim() { const L = lpEnCfg().limits; return Array.isArray(L) && L.length === 3 && L.every((x) => typeof x === 'number' && x > 0) && L[0] < L[1] && L[1] < L[2] ? L : [300, 800, 1800]; }
function lpEnPrice() { const p = parseFloat(lpEnCfg().price); return p > 0 ? p : 0; }
const lpEnNumOf = (v) => { const x = parseFloat(v); return x > 0 && isFinite(x) ? x : 0; };
// faturalar (tarihe göre) ve sonuncusu
function lpEnBills() {
  const b = lpEnCfg().bills;
  return (Array.isArray(b) ? b : []).filter((x) => x && lpEnNumOf(x.kwh) && lpEnNumOf(x.tl) && typeof x.to === 'string').slice().sort((a, b2) => (a.to < b2.to ? -1 : a.to > b2.to ? 1 : 0));
}
function lpEnLastBill() { const L = lpEnBills(); return L.length ? L[L.length - 1] : null; }
// fiyat düzeni: seçilmediyse fatura varsa faturadan, yoksa tek fiyat
function lpEnMode() {
  const m = lpEnCfg().price_mode;
  if (m === 'bill' && lpEnLastBill()) return 'bill';
  if (m === 'tier' && lpEnNumOf(lpEnCfg().low) && lpEnNumOf(lpEnCfg().high)) return 'tier';
  if (m === 'single') return 'single';
  return lpEnLastBill() ? 'bill' : 'single';
}
function lpEnDaily() { return lpEnNumOf(lpEnCfg().daily) || 8; }
// bir ayın tutarı: kademede günlük sınır × ayın gün sayısı düşük fiyattan, üstü yüksek fiyattan
function lpEnMonthCost(kwh, days, M) {
  const c = lpEnCfg(), mode = lpEnMode();
  if (mode === 'tier') { const lim = lpEnDaily() * days, lo = Math.min(kwh, lim); return { tl: lo * lpEnNumOf(c.low) + Math.max(0, kwh - lim) * lpEnNumOf(c.high), lim: lim, lo: lo, hi: Math.max(0, kwh - lim) }; }
  const u = lpEnUnit(M);
  return { tl: kwh * u, lim: 0, lo: kwh, hi: 0 };
}
// ortalama birim fiyat (0: fiyat yok). Kademede bu ayın ortalaması
function lpEnUnit(M) {
  const c = lpEnCfg(), mode = lpEnMode();
  if (mode === 'bill') { const b = lpEnLastBill(); return lpEnNumOf(b.tl) / lpEnNumOf(b.kwh); }
  if (mode === 'tier') { const mk = M && M.days ? lpEnMonthKwh(M) : 0; if (!mk) return lpEnNumOf(c.low); return lpEnMonthCost(mk, lpEnMonthDays(), M).tl / mk; }
  return lpEnPrice() || (M && M.price) || 0;
}
function lpEnMonthDays() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
const lpEnDayTot = (M, i) => M.cats.reduce((a, c) => a + ((M.days.cats[c.id] || [])[i] || 0), 0);
// bu ay şimdiye kadar (sayaç tahmini: takip edilenler + ölçülmeyen pay)
function lpEnMonthKwh(M) {
  if (!M || !M.days) return 0;
  const m0 = new Date(); m0.setDate(1); m0.setHours(0, 0, 0, 0);
  let s = 0; M.days.t.forEach((t, i) => { if (t >= m0.getTime()) s += lpEnDayTot(M, i); });
  return s / (1 - lpEnUntracked());   // faturadan bulunan ölçülmeyen payla sayaca yaklaştırılır
}
// son faturada panelin ölçmediği pay (0-0,95)
function lpEnUntracked() { const b = lpEnLastBill(); if (!b || !lpEnNumOf(b.panel)) return 0; return Math.max(0, Math.min(0.95, (b.kwh - b.panel) / b.kwh)); }
// yıllık sınır: elle ya da yıla göre (2026: 4000, 2027'den itibaren 3000 kWh)
function lpEnYearLimit() { const c = lpEnCfg(); if (c.year_mode === 'manual' && lpEnNumOf(c.year_limit)) return lpEnNumOf(c.year_limit); return new Date().getFullYear() >= 2027 ? 3000 : 4000; }
// son 12 ay (sayaç): faturadaki 12 aylık toplam + son faturadan bu yana panelin ölçtüğü (ölçülmeyen payla büyütülür)
function lpEnYear(M) {
  const c = lpEnCfg(), b = lpEnLastBill();
  let base = lpEnNumOf(c.last12);
  if (!base) { const y0 = Date.now() - 365 * 86400000; lpEnBills().forEach((x) => { if (Date.parse(x.to) >= y0) base += lpEnNumOf(x.kwh); }); }
  if (!base) return 0;
  let since = 0;
  if (b && M && M.days) { const t0 = Date.parse(b.to) + 86400000; M.days.t.forEach((t, i) => { if (t >= t0) since += lpEnDayTot(M, i); }); }
  return base + since / (1 - lpEnUntracked());
}
// tahmini cihaz (entegrasyonun kurduğu sensör): kartlarda "~" ile
const lpEnIsEst = (x) => !!x && typeof x.e === 'string' && /^sensor\.lhd_[a-z0-9_]+_energy$/.test(x.e);
const lpEnTil = (x) => (lpEnIsEst(x) && lpEnCfg().tilde !== false ? '~' : '');
// bir dönemde takip edilenlerin toplamı (fatura eklenince "panelin ölçtüğü" için)
function lpEnPeriodKwh(h, from, to) {
  const M = LP_EN.m, conn = h && h.connection;
  if (!M || !M.cats.length || !conn) return Promise.resolve(0);
  const a = new Date(from + 'T00:00:00'), b = new Date(to + 'T00:00:00'); b.setDate(b.getDate() + 1);
  return conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: a.toISOString(), end_time: b.toISOString(), period: 'day', statistic_ids: M.cats.map((c) => c.e), types: ['change'], units: { energy: 'kWh' } })
    .then((r) => { let s = 0; Object.keys(r || {}).forEach((k) => (r[k] || []).forEach((p) => { if (isFinite(p.change)) s += Math.max(0, p.change); })); return Math.round(s * 10) / 10; }).catch(() => 0);
}
// tahmini cihazın gücü (yönetim panelindeki hesap; entegrasyondaki estimates.power ile aynı)
function lpEnEstW(e, st) {
  const n = (k) => lpEnNumOf(e[k]);
  if (e.kind === 'fixed') return n('w');
  if (e.kind === 'year') return n('year') * 1000 / 8760;
  if (e.kind === 'cycle') return n('k100') / 100 * n('week') * 52 * 1000 / 8760;
  const on = !!st && ['off', 'unavailable', 'unknown', 'standby', 'idle', 'closed', 'docked', 'none', ''].indexOf(String(st.state)) < 0;
  if (e.kind === 'light') { if (!on) return n('idle'); const b = st.attributes.brightness; const f = b === undefined || b === null ? 1 : Math.max(0, Math.min(1, b / 255)); return n('idle') + (Math.max(n('max'), n('idle')) - n('idle')) * f; }
  if (e.kind === 'onoff') return on ? n('on') : n('off');
  return 0;
}
function lpEnBadge() { const b = lpEnCfg().badge; return b === 'on' || b === 'always' ? b : ''; }
const lpEnIsPow = (st) => !!st && (st.attributes.device_class === 'power' || /^(W|kW)$/.test(String(st.attributes.unit_of_measurement || '')));
function lpEnW(S, id) {
  const st = id && S[id]; if (!st) return null;
  const v = parseFloat(st.state); if (!isFinite(v)) return null;
  return String(st.attributes.unit_of_measurement || '') === 'kW' ? v * 1000 : v;
}
// enerji (kWh) sensörünün güç karşılığı
function lpEnPowOf(h, eid, rate) {
  const S = h.states || {}, E = h.entities || {};
  if (typeof rate === 'string' && lpEnIsPow(S[rate])) return rate;
  if (!eid) return null;
  const c = [eid.replace(/_energy$/, '_power'), eid.replace(/energy/g, 'power'), eid.replace(/_(energy|kwh|consumption|tuketim)(_[a-z0-9]+)?$/, '_power')];
  for (let i = 0; i < c.length; i++) if (c[i] !== eid && lpEnIsPow(S[c[i]])) return c[i];
  const dv = E[eid] && E[eid].device_id;
  if (dv) {
    const L = Object.keys(E).filter((x) => E[x].device_id === dv && x.indexOf('sensor.') === 0 && lpEnIsPow(S[x]) && !/standby|bekleme/.test(x));
    if (L.length) return L.sort((a, b) => a.length - b.length)[0];
  }
  return null;
}
function lpEnName(h, d) {
  if (d.name) return String(d.name);
  const st = (h.states || {})[d.stat_consumption];
  const n = String((st && st.attributes.friendly_name) || d.stat_consumption.split('.')[1] || '').replace(/[\s_-]*(energy|enerji|consumption|tüketim|tuketim|kwh)\s*$/i, '').trim();
  return n || d.stat_consumption;
}
function lpEnLookOf(name, i) {
  for (let k = 0; k < LP_EN_LOOK.length; k++) if (LP_EN_LOOK[k][0].test(name)) return [LP_EN_LOOK[k][1], LP_EN_LOOK[k][2]];
  return ['mdi:flash', LP_EN_PAL[i % LP_EN_PAL.length]];
}
// HA enerji ayarlarından kategori ve cihaz listesi
function lpEnModel(h, prefs) {
  const dc = ((prefs && prefs.device_consumption) || []).filter((d) => d && typeof d.stat_consumption === 'string');
  const ids = {}; dc.forEach((d) => { ids[d.stat_consumption] = d; });
  const par = {}; dc.forEach((d) => { if (d.included_in_stat && ids[d.included_in_stat]) par[d.included_in_stat] = 1; });
  const topOf = (d) => { let x = d, n = 0; while (x.included_in_stat && ids[x.included_in_stat] && n++ < 10) x = ids[x.included_in_stat]; return x.stat_consumption; };
  const cats = dc.filter((d) => !(d.included_in_stat && ids[d.included_in_stat])).map((d, i) => {
    const nm = lpEnName(h, d), lk = lpEnLookOf(nm, i);
    return { id: d.stat_consumption, name: nm, icon: lk[0], color: lk[1], e: d.stat_consumption, p: lpEnPowOf(h, d.stat_consumption, d.stat_rate), kids: [] };
  });
  const by = {}; cats.forEach((c) => { by[c.id] = c; });
  const devs = dc.filter((d) => !par[d.stat_consumption]).map((d) => {
    const c = by[topOf(d)];
    return { id: d.stat_consumption, name: lpEnName(h, d), e: d.stat_consumption, p: lpEnPowOf(h, d.stat_consumption, d.stat_rate), cat: c ? c.id : null, icon: c ? c.icon : 'mdi:flash', color: c ? c.color : LP_EN_PAL[0] };
  });
  devs.forEach((d) => { if (d.cat && by[d.cat]) by[d.cat].kids.push(d); });
  // şebeke fiyatı enerji ayarında sabit verilmişse (ayarda fiyat yoksa o kullanılır)
  let price = 0;
  ((prefs && prefs.energy_sources) || []).forEach((s) => { if (s && s.type === 'grid') (s.flow_from || []).forEach((f) => { if (!price && f && f.number_energy_price > 0) price = f.number_energy_price; }); });
  return { cats: cats, devs: devs, price: price, hist: null, days: null };
}
// güç geçmişi: zaman ağırlıklı ortalama, n dilim
function lpEnBin(L, t0, step, n, f) {
  const acc = []; for (let i = 0; i < n; i++) acc.push([0, 0]);
  const pts = (L || []).map((p) => ({ t: p.lu !== undefined ? p.lu * 1000 : Date.parse(p.last_updated || p.last_changed || ''), v: parseFloat(p.s !== undefined ? p.s : p.state) })).filter((p) => isFinite(p.t));
  const end = Math.min(t0 + step * n, Date.now());
  for (let i = 0; i < pts.length; i++) {
    const a = Math.max(pts[i].t, t0), b = Math.min(i + 1 < pts.length ? pts[i + 1].t : end, end);
    if (!(b > a) || !isFinite(pts[i].v)) continue;
    const v = pts[i].v * f;
    let x = a;
    while (x < b) { const k = Math.floor((x - t0) / step); if (k < 0 || k >= n) break; const be = Math.min(b, t0 + (k + 1) * step); acc[k][0] += v * (be - x); acc[k][1] += be - x; x = be; }
  }
  return acc.map((a) => (a[1] > 0 ? a[0] / a[1] : null));
}
const lpEnSum = (arrs, n) => { const o = []; for (let i = 0; i < n; i++) { let s = null; arrs.forEach((a) => { if (a && a[i] !== null && a[i] !== undefined) s = (s || 0) + a[i]; }); o.push(s); } return o; };
function lpEnHist(conn, S, M) {
  const now = Date.now(), t0 = now - 86400000, step = 86400000 / LP_EN_BINS, ids = [];
  const add = (x) => { if (x && ids.indexOf(x) < 0) ids.push(x); };
  M.cats.forEach((c) => { if (c.p) add(c.p); else c.kids.forEach((k) => add(k.p)); });
  const tot = lpEnCfg().total; if (tot) add(tot);
  if (!ids.length) return Promise.resolve();
  return conn.sendMessagePromise({ type: 'history/history_during_period', start_time: new Date(t0).toISOString(), end_time: new Date(now).toISOString(), entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
    .then((r) => {
      const ser = {};
      ids.forEach((id) => { const u = S[id] ? String(S[id].attributes.unit_of_measurement || '') : ''; ser[id] = lpEnBin((r && r[id]) || [], t0, step, LP_EN_BINS, u === 'kW' ? 1000 : 1); });
      const cats = {};
      M.cats.forEach((c) => { cats[c.id] = c.p ? ser[c.p] : lpEnSum(c.kids.map((k) => ser[k.p]), LP_EN_BINS); });
      M.hist = { t0: t0, step: step, cats: cats, total: tot && ser[tot] ? ser[tot] : lpEnSum(M.cats.map((c) => cats[c.id]), LP_EN_BINS) };
    }).catch(() => {});
}
function lpEnDays(conn, M) {
  const ids = M.cats.map((c) => c.e);
  if (!ids.length) return Promise.resolve();
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const days = []; for (let i = LP_EN_DAYS - 1; i >= 0; i--) { const d = new Date(d0.getTime()); d.setDate(d.getDate() - i); days.push(d.getTime()); }
  return conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: new Date(days[0]).toISOString(), period: 'day', statistic_ids: ids, types: ['change'], units: { energy: 'kWh' } })
    .then((r) => {
      const cats = {};
      ids.forEach((id) => {
        const a = days.map(() => 0);
        ((r && r[id]) || []).forEach((p) => {
          const s = typeof p.start === 'number' ? p.start : Date.parse(p.start);
          let k = -1; for (let j = 0; j < days.length; j++) if (Math.abs(days[j] - s) < 43200000) k = j;
          if (k >= 0 && isFinite(p.change)) a[k] += Math.max(0, p.change);
        });
        cats[id] = a;
      });
      M.days = { t: days, cats: cats };
    }).catch(() => {});
}
function lpEnSub(fn) { LP_EN.subs.push(fn); return () => { const i = LP_EN.subs.indexOf(fn); if (i >= 0) LP_EN.subs.splice(i, 1); }; }
function lpEnFire() { LP_EN.subs.slice().forEach((f) => { try { f(); } catch (e) {} }); }
// veriyi yükle (ilk kez, 5 dakikada bir ya da enerji ayarı değişince)
function lpEnEnsure(h) {
  if (!h || LP_EN.busy) return;
  const key = JSON.stringify([lpEnCfg().total || '', lpEnCfg().standby || '']);
  if (LP_EN.m && LP_EN.key === key && Date.now() - LP_EN.at < 300000) return;
  const conn = h.connection; if (!conn || !conn.sendMessagePromise) return;
  LP_EN.busy = true; LP_EN.key = key;
  conn.sendMessagePromise({ type: 'energy/get_prefs' }).catch(() => null).then((prefs) => {
    const M = lpEnModel(h, prefs);
    return M.cats.length ? Promise.all([lpEnHist(conn, h.states || {}, M), lpEnDays(conn, M)]).then(() => M) : M;
  }).then((M) => { LP_EN.m = M; LP_EN.at = Date.now(); LP_EN.busy = false; lpEnFire(); },
    () => { LP_EN.busy = false; LP_EN.at = Date.now(); if (!LP_EN.m) LP_EN.m = { cats: [], devs: [], price: 0 }; lpEnFire(); });
}
// hayali ev (Otomatik kur önizlemesi, rehber görselleri): sabit örnek veri
function lpEnDemo(lang) {
  const tr = lang !== 'en', T = (a, b) => (tr ? a : b);
  const C = [[T('Işıklar', 'Lights'), 96], [T('Klimalar', 'Air conditioners'), 640], [T('Mutfak', 'Kitchen'), 148], [T('Medya ve Ekranlar', 'Media and screens'), 74], [T('Altyapı', 'Infrastructure'), 22], [T('Süpürgeler', 'Vacuums'), 6]];
  const D = [[1, T('Salon Klima', 'Living Room AC'), 640], [2, T('Buzdolabı', 'Fridge'), 118], [3, T('Salon TV', 'Living Room TV'), 64], [0, T('Salon Tavan', 'Living Room Ceiling'), 24], [0, T('Gizli Şerit', 'Cove Strip'), 18],
    [0, T('Mutfak Ada', 'Kitchen Island'), 16], [4, T('Modem', 'Router'), 12], [2, T('Kahve Makinesi', 'Coffee Machine'), 30], [4, T('Kamera', 'Camera'), 10], [3, T('Hoparlör', 'Speaker'), 10], [5, T('Robot Süpürge', 'Robot Vacuum'), 6]];
  const cats = C.map((c, i) => { const lk = lpEnLookOf(c[0], i); return { id: 'demo' + i, name: c[0], icon: lk[0], color: lk[1], e: null, p: null, w: c[1], kids: [] }; });
  const devs = D.map((d, i) => ({ id: 'dd' + i, name: d[1], e: null, p: null, w: d[2], cat: cats[d[0]].id, icon: cats[d[0]].icon, color: cats[d[0]].color }));
  devs.forEach((d) => { cats.forEach((c) => { if (c.id === d.cat) c.kids.push(d); }); });
  const now = Date.now(), t0 = now - 86400000, step = 86400000 / LP_EN_BINS, hc = {};
  const hr = (i) => new Date(t0 + i * step).getHours();
  const shape = [
    (i) => { const x = hr(i); return x >= 18 || x < 1 ? 110 + (i % 3) * 8 : x < 7 ? 6 : 14; },
    (i) => { const x = hr(i); return (x >= 13 && x < 17) || (x >= 20 && x < 23) ? 900 + (i % 4) * 40 : 0; },
    (i) => (i % 6 === 0 ? 140 : 60) + (hr(i) >= 19 && hr(i) < 21 ? 900 : 0),
    (i) => { const x = hr(i); return x >= 19 && x < 24 ? 80 : 8; },
    () => 22,
    (i) => (hr(i) === 10 ? 40 : 4)
  ];
  cats.forEach((c, k) => { const a = []; for (let i = 0; i < LP_EN_BINS; i++) a.push(shape[k](i)); hc[c.id] = a; });
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  const days = []; for (let i = LP_EN_DAYS - 1; i >= 0; i--) { const d = new Date(d0.getTime()); d.setDate(d.getDate() - i); days.push(d.getTime()); }
  const base = [1.6, 6.2, 3.1, 0.9, 0.53, 0.12], dc = {};
  cats.forEach((c, k) => { dc[c.id] = days.map((x, j) => Math.round(base[k] * (k === 1 ? (0.55 + ((j * 7) % 10) / 10) : (0.8 + ((j * 3) % 5) / 10)) * (j === LP_EN_DAYS - 1 ? 0.6 : 1) * 100) / 100); });
  return { demo: true, cats: cats, devs: devs, price: tr ? 3.15 : 0.3, hist: { t0: t0, step: step, cats: hc, total: lpEnSum(cats.map((c) => hc[c.id]), LP_EN_BINS) }, days: { t: days, cats: dc } };
}
function lpEnGet(h, lang) {
  if (h && h.lhdEnDemo) { if (!LP_EN.dm || LP_EN.dmL !== lang) { LP_EN.dm = lpEnDemo(lang); LP_EN.dmL = lang; } return LP_EN.dm; }
  lpEnEnsure(h);
  return LP_EN.m;
}
// güç ölçümü olan bütün varlıklar (anlık değer değişince kartlar yeniden çizilir)
function lpEnIds(M) {
  if (!M || M.demo) return [];
  const o = [], add = (x) => { if (x && o.indexOf(x) < 0) o.push(x); };
  M.cats.forEach((c) => add(c.p)); M.devs.forEach((d) => add(d.p));
  const c = lpEnCfg(); add(c.total); add(c.standby);
  return o;
}
const lpEnWOf = (S, x) => (x.w !== undefined ? x.w : (x.p ? lpEnW(S, x.p) : null));
function lpEnCatW(S, c) {
  const w = lpEnWOf(S, c); if (w !== null) return w;
  let s = null; c.kids.forEach((k) => { const v = lpEnWOf(S, k); if (v !== null) s = (s || 0) + v; });
  return s;
}
function lpEnTotal(S, M) {
  const tot = !M.demo && lpEnCfg().total;
  if (tot) { const v = lpEnW(S, tot); if (v !== null) return v; }
  let s = null; M.cats.forEach((c) => { const v = lpEnCatW(S, c); if (v !== null) s = (s || 0) + v; });
  return s;
}
// biçimleme
function lpEnNum(v, d, lang) { return Number(v).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function lpEnWp(w, lang) {   // [sayı, birim]
  if (w === null || w === undefined) return ['–', 'W'];
  if (Math.abs(w) >= 1000) return [lpEnNum(w / 1000, Math.abs(w) >= 10000 ? 0 : 1, lang), 'kW'];
  return [lpEnNum(Math.round(w), 0, lang), 'W'];
}
const lpEnWs = (w, lang) => { const p = lpEnWp(w, lang); return p[0] + ' ' + p[1]; };
function lpEnMoney(h, v, lang) {
  const cur = (h && h.config && h.config.currency) || (lang === 'tr' ? 'TRY' : h && h.lhdEnDemo ? 'EUR' : '');
  const d = v < 10 ? 2 : 0;
  if (cur) { try { return v.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: d, maximumFractionDigits: d }); } catch (e) {} }
  return lpEnNum(v, d, lang);
}
// küçük grafikler (SVG): çizgi, alan, yığılmış çubuk
function lpEnSpark(arr, color, H) {
  const v = (arr || []).filter((x) => x !== null && x !== undefined);
  if (v.length < 2) return '<svg class="esp" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none"></svg>';
  const mx = Math.max.apply(null, v) || 1, n = arr.length, pts = [];
  arr.forEach((x, i) => { if (x === null || x === undefined) return; pts.push((i / (n - 1) * 100).toFixed(1) + ',' + (H - 1 - x / mx * (H - 3)).toFixed(1)); });
  return '<svg class="esp" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none"><polygon points="0,' + H + ' ' + pts.join(' ') + ' 100,' + H + '" fill="' + color + '" opacity=".16"/>' +
    '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
}
function lpEnMini(arr, color, H) {   // 7 günlük küçük çubuklar
  const v = (arr || []).slice(-7), mx = Math.max.apply(null, v.concat([0.001]));
  return '<svg class="esp" viewBox="0 0 70 ' + H + '" preserveAspectRatio="none">' + v.map((x, i) => { const hh = Math.max(1, x / mx * (H - 2)); return '<rect x="' + (i * 10 + 1.5) + '" y="' + (H - hh).toFixed(1) + '" width="7" height="' + hh.toFixed(1) + '" rx="1.5" fill="' + color + '" opacity="' + (i === v.length - 1 ? 1 : 0.55) + '"/>'; }).join('') + '</svg>';
}
// kartın gövdesi (data yoksa ipucu)
function lpEnEmpty(M, lang, big) {
  if (!M) return '<div class="enmsg">' + esc(lpEnT(lang, 'loading')) + '</div>';
  return '<div class="enmsg"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><b>' + esc(lpEnT(lang, 'none')) + '</b>' + (big ? '<span>' + esc(lpEnT(lang, 'noneT')) + '</span>' : '') + '</div>';
}
function lpEnCard(h, M, it, lang, phone) {
  const S = (h && h.states) || {}, k = it.energy;
  if (!M || !M.cats.length) return lpEnEmpty(M, lang, k === 'halo' || k === 'cats');
  const price = lpEnUnit(M), N = M.days ? M.days.t.length : 0;
  const total = lpEnTotal(S, M);
  const todayKwh = M.days ? lpEnDayTot(M, N - 1) : null;
  if (k === 'halo') {
    const L = lpEnLim(), w = total || 0, lvl = w < L[0] ? 0 : w < L[1] ? 1 : w < L[2] ? 2 : 3, col = LP_EN_LVL[lvl];
    const deg = Math.max(3, Math.min(360, w / (L[2] * 1.25) * 360)), wp = lpEnWp(total, lang);
    const chip = (b, s) => '<div class="ench"><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div>';
    // bugünkü para: kademede ayın tutarından bugünden öncesinin tutarı çıkar
    const mk = lpEnMonthKwh(M), md = lpEnMonthDays(), mc = M.days ? lpEnMonthCost(mk, md, M) : null;
    const todayTl = todayKwh === null || !price ? null : lpEnMode() === 'tier' ? mc.tl - lpEnMonthCost(Math.max(0, mk - todayKwh), md, M).tl : todayKwh * price;
    const chips = it.chips === false ? '' : '<div class="enchs">' + chip(todayKwh === null ? '–' : lpEnNum(todayKwh, todayKwh < 10 ? 1 : 0, lang), lpEnT(lang, 'today')) +
      (todayTl !== null ? chip(lpEnMoney(h, todayTl, lang), lpEnT(lang, 'costToday')) : '') +
      (price && mc ? chip(lpEnMoney(h, mc.tl, lang), lpEnT(lang, 'costMonth')) : chip(lpEnNum(Math.round(w * 0.72), 0, lang), lpEnT(lang, 'month'))) + '</div>';
    // kademe ve yıllık sınır çubukları
    const bar = (lab, val, frac, col2, frac2) => '<div class="enbl"><span>' + esc(lab) + '</span><b>' + esc(val) + '</b></div><div class="enbar"><i style="width:' + (Math.min(1, frac) * 100).toFixed(1) + '%;background:' + col2 + '"></i>' + (frac2 ? '<i style="width:' + (Math.min(1 - Math.min(1, frac), frac2) * 100).toFixed(1) + '%;background:#FF9142"></i>' : '') + '</div>';
    let bars = '';
    if (it.bars !== false && mc && lpEnMode() === 'tier') bars += bar(lpEnT(lang, mc.hi > 0 ? 'tierHi' : 'tierLo'), lpEnNum(Math.round(mc.lo), 0, lang) + ' / ' + lpEnNum(Math.round(mc.lim), 0, lang) + ' kWh', mc.lo / mc.lim, '#3DDC84', mc.hi / mc.lim);
    const yk = lpEnYear(M), yl = lpEnYearLimit();
    if (it.bars !== false && yk) bars += bar(lpEnT(lang, 'yearL'), lpEnNum(Math.round(yk), 0, lang) + ' / ' + lpEnNum(yl, 0, lang) + ' kWh', yk / yl, yk / yl > 0.85 ? '#FFC94A' : '#4DD0E1');
    const chips2 = chips + (bars ? '<div class="enbars">' + bars + '</div>' : '');
    const len = (deg / 360 * 540.35).toFixed(1);
    return '<div class="enhalo"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="15"/>' +
      '<circle cx="100" cy="100" r="86" fill="none" stroke="' + col + '" stroke-width="15" stroke-linecap="round" stroke-dasharray="' + len + ' 600" transform="rotate(-90 100 100)" style="filter:drop-shadow(0 0 6px ' + col + ')"/>' +
      '<circle cx="100" cy="100" r="72" fill="#121419"/></svg><div class="enin">' +
      '<div class="enw">' + esc(wp[0]) + '<small>' + wp[1] + '</small></div><div class="enlv" style="color:' + col + '">' + esc(lpEnT(lang, 'lvl' + lvl)) + '</div></div></div>' + chips2;
  }
  if (k === 'cats') {
    const sum = M.cats.reduce((a, c) => a + (lpEnCatW(S, c) || 0), 0) || 1;
    let L = M.cats.map((c) => ({ c: c, w: lpEnCatW(S, c) }));
    if (L.length > 12) L = L.slice().sort((a, b) => (b.w || 0) - (a.w || 0)).slice(0, 12);
    const cols = phone ? 2 : Math.max(2, Math.min(4, +it.cols || 3)), ch = it.chart === '7d' || it.chart === 'none' ? it.chart : '24h';
    // ölçülmeyen pay (son faturadan): gri karo, anlık gücü toplamın o payı kadar varsayılır
    const un = lpEnCfg().untracked === false ? 0 : lpEnUntracked();
    const unT = un ? '<div class="encat unt"><div class="ect"><span class="eci"><ha-icon icon="mdi:help-circle-outline"></ha-icon></span><span class="ecn">' + esc(lpEnT(lang, 'untracked')) + '</span></div>' +
      '<div class="ecv">~' + esc(lpEnWs(sum * un / (1 - un), lang)) + '<small>' + ' · ' + (lang === 'tr' ? '%' + Math.round(un * 100) : Math.round(un * 100) + '%') + '</small></div><div class="ecu">' + esc(lpEnT(lang, 'untrackedT')) + '</div></div>' : '';
    return '<div class="encats" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))">' + L.map((x) => {
      const c = x.c, pct = x.w === null ? null : Math.round(x.w / sum * 100), wp = lpEnWp(x.w, lang);
      const gr = ch === 'none' ? '' : ch === '7d' ? lpEnMini(M.days ? M.days.cats[c.id] : null, c.color, 26) : lpEnSpark(M.hist ? M.hist.cats[c.id] : null, c.color, 26);
      return '<div class="encat' + (pct !== null && pct >= 40 ? ' hot' : '') + '" data-encat="' + esc(c.id) + '" style="--c:' + c.color + '"><div class="ect"><span class="eci"><ha-icon icon="' + esc(c.icon) + '"></ha-icon></span><span class="ecn">' + esc(c.name) + '</span></div>' +
        '<div class="ecv">' + esc(wp[0]) + '<small>' + wp[1] + (pct !== null ? ' · ' + (lang === 'tr' ? '%' + pct : pct + '%') : '') + '</small></div>' + gr + '</div>';
    }).join('') + unT + '</div>';
  }
  if (k === 'top') {
    let L = M.devs.filter((d) => !it.cat || d.cat === it.cat).map((d) => ({ d: d, w: lpEnWOf(S, d) })).filter((x) => x.w !== null && (!it.hide_idle || x.w >= 2));
    L.sort((a, b) => b.w - a.w);
    L = L.slice(0, Math.max(3, Math.min(10, +it.count || 6)));
    if (!L.length) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noDev')) + '</span></div>';
    const mx = L[0].w || 1;
    return '<div class="entop">' + L.map((x) => '<div class="enrk" data-enmore="' + esc(x.d.p || '') + '" style="--c:' + x.d.color + '"><span class="eci"><ha-icon icon="' + esc(x.d.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(x.d.name) + '</span>' +
      '<i class="erl"><i style="width:' + Math.max(2, x.w / mx * 100).toFixed(1) + '%"></i></i></div><b class="erw' + (lpEnTil(x.d) ? ' est' : '') + '">' + lpEnTil(x.d) + esc(lpEnWs(x.w, lang)) + '</b></div>').join('') + '</div>';
  }
  if (k === 'week') {
    if (!M.days) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const n = +it.days === 30 ? 30 : 7, cost = it.unit === 'cost' && price > 0, f = cost ? price : 1;
    const idx = []; for (let i = N - n; i < N; i++) idx.push(i);
    const tot = idx.map((i) => M.cats.reduce((a, c) => a + (M.days.cats[c.id][i] || 0), 0) * f);
    const mx = Math.max.apply(null, tot.concat([0.001])) * 1.08;
    const W = phone ? 360 : 600, H = phone ? 170 : 190, pl = 34, pb = 20, cw = (W - pl - 4) / n, bw = cw * (n > 7 ? 0.7 : 0.56);
    let s = '';
    [0, 0.5, 1].forEach((q) => { const y = (H - pb - q * (H - pb - 8)).toFixed(1); s += '<line x1="' + pl + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="rgba(255,255,255,.07)"/><text x="' + (pl - 6) + '" y="' + (+y + 4) + '" text-anchor="end">' + esc(lpEnNum(mx * q, mx * q < 10 && q ? 1 : 0, lang)) + '</text>'; });
    idx.forEach((i, j) => {
      const x = pl + j * cw + (cw - bw) / 2; let y = H - pb;
      M.cats.forEach((c) => { const v = (M.days.cats[c.id][i] || 0) * f, hh = v / mx * (H - pb - 8); if (hh <= 0) return; y -= hh; s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + hh.toFixed(1) + '" fill="' + c.color + '"/>'; });
      const d = new Date(M.days.t[i]), today = i === N - 1;
      const lab = n === 7 ? (today ? lpEnT(lang, 'todayD') : lpEnT(lang, 'wd')[d.getDay()]) : (j % 5 === 4 || today ? d.getDate() + '.' + (d.getMonth() + 1) : '');
      if (lab) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="middle"' + (today ? ' class="now"' : '') + '>' + esc(lab) + '</text>';
    });
    const sum = tot.reduce((a, b) => a + b, 0);
    return '<div class="enhd"><span>' + (cost ? esc(lpEnMoney(h, sum, lang)) : esc(lpEnNum(sum, sum < 10 ? 1 : 0, lang)) + ' kWh') + '</span></div><svg class="ench2" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' + lpEnLegend(M);
  }
  if (k === 'day') {
    if (!M.hist) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const tot = it.mode === 'total', series = tot ? [{ a: M.hist.total, c: '#5B8DEF' }] : M.cats.map((c) => ({ a: M.hist.cats[c.id], c: c.color }));
    const all = []; series.forEach((x) => (x.a || []).forEach((v) => { if (v !== null) all.push(v); }));
    if (!all.length) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const W = phone ? 360 : 600, H = phone ? 160 : 170, pl = 40, pb = 20, mx = Math.max.apply(null, all.concat([1])) * 1.08, n = LP_EN_BINS;
    const X = (i) => pl + i / (n - 1) * (W - pl - 4), Y = (v) => H - pb - v / mx * (H - pb - 8);
    let s = '';
    [0, 0.5, 1].forEach((q) => { const y = Y(mx * q).toFixed(1); s += '<line x1="' + pl + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" stroke="rgba(255,255,255,.07)"/><text x="' + (pl - 6) + '" y="' + (+y + 4) + '" text-anchor="end">' + esc(lpEnWs(mx * q, lang).replace(' ', '')) + '</text>'; });
    series.forEach((x) => {
      const pts = []; (x.a || []).forEach((v, i) => { if (v !== null) pts.push(X(i).toFixed(1) + ',' + Y(v).toFixed(1)); });
      if (pts.length < 2) return;
      if (tot) s += '<polygon points="' + X(0).toFixed(1) + ',' + (H - pb) + ' ' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + (H - pb) + '" fill="' + x.c + '" opacity=".18"/>';
      s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + x.c + '" stroke-width="2" stroke-linejoin="round"/>';
    });
    for (let q = 0; q <= 4; q++) { const tt = new Date(M.hist.t0 + q * 6 * 3600000); s += '<text x="' + X(q * (n - 1) / 4).toFixed(1) + '" y="' + (H - 5) + '" text-anchor="' + (q === 0 ? 'start' : q === 4 ? 'end' : 'middle') + '">' + ('0' + tt.getHours()).slice(-2) + ':' + ('0' + tt.getMinutes()).slice(-2) + '</text>'; }
    return '<svg class="ench2" viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' + (tot ? '' : lpEnLegend(M));
  }
  if (k === 'standby') {
    const sb = !M.demo && lpEnCfg().standby;
    let w = sb ? lpEnW(S, sb) : null, note = sb ? '' : lpEnT(lang, 'sbMin');
    if (w === null && M.hist) { const v = M.hist.total.filter((x) => x !== null); if (v.length) w = Math.min.apply(null, v); }
    if (w === null) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noHist')) + '</span></div>';
    const kwh = w * 8.76, yr = price ? lpEnT(lang, 'yearC', { k: lpEnNum(Math.round(kwh), 0, lang), c: lpEnMoney(h, kwh * price, lang) }) : lpEnT(lang, 'year', { k: lpEnNum(Math.round(kwh), 0, lang) });
    return '<div class="ensb"' + (sb ? ' data-enmore="' + esc(sb) + '"' : '') + '><span class="eci"><ha-icon icon="mdi:power-sleep"></ha-icon></span><div><b>~' + esc(lpEnWs(w, lang)) + '</b><span>' + esc(lpEnT(lang, 'sbT')) + (note ? ' (' + esc(note.toLocaleLowerCase(lang === 'tr' ? 'tr' : 'en')) + ')' : '') + '</span><span>' + esc(yr) + '</span></div></div>';
  }
  return '';
}
function lpEnLegend(M) { return '<div class="enlg">' + M.cats.map((c) => '<span><i style="background:' + c.color + '"></i>' + esc(c.name) + '</span>').join('') + '</div>'; }
// kategoriye dokununca: o kategorinin cihazları (anlık güce göre)
function lpEnPopHtml(h, M, catId, lang) {
  const S = (h && h.states) || {}, c = M.cats.filter((x) => x.id === catId)[0]; if (!c) return '';
  const L = c.kids.map((d) => ({ d: d, w: lpEnWOf(S, d) })).sort((a, b) => (b.w || 0) - (a.w || 0)), mx = (L[0] && L[0].w) || 1, cw = lpEnCatW(S, c);
  return '<div class="enpop" data-enclose><div class="enpd" style="--c:' + c.color + '"><div class="enph"><span class="eci"><ha-icon icon="' + esc(c.icon) + '"></ha-icon></span><b>' + esc(c.name) + '</b><span class="erw">' + esc(lpEnWs(cw, lang)) + '</span>' +
    '<button class="enx" data-enclose title="' + esc(lpEnT(lang, 'close')) + '"><ha-icon icon="mdi:close"></ha-icon></button></div><div class="entop">' +
    L.map((x) => '<div class="enrk" data-enmore="' + esc(x.d.p || '') + '"><div class="erb"><span class="ern">' + esc(x.d.name) + '</span><i class="erl"><i style="width:' + Math.max(2, (x.w || 0) / mx * 100).toFixed(1) + '%"></i></i></div><b class="erw' + (lpEnTil(x.d) ? ' est' : '') + '">' + lpEnTil(x.d) + esc(x.w === null ? '–' : lpEnWs(x.w, lang)) + '</b></div>').join('') +
    '</div><div class="enpf">' + esc(lpEnT(lang, 'devs', { n: L.length })) + '</div></div></div>';
}
// ışık / priz karosunun güç sensörü (karoda watt rozeti için): aynı cihazın güç sensörü ya da sensor.<ad>_power
function lpEnTileP(h, id) {
  if (Object.prototype.hasOwnProperty.call(LP_EN.tp, id)) return LP_EN.tp[id];
  const S = h.states || {}, E = h.entities || {}, obj = id.split('.')[1];
  let p = null;
  const ES = (STORE.data && STORE.data.estimates) || {};
  Object.keys(ES).forEach((k) => { if (!p && ES[k] && ES[k].entity === id && lpEnIsPow(S['sensor.lhd_' + k + '_power'])) p = 'sensor.lhd_' + k + '_power'; });
  ['sensor.' + obj + '_power', 'sensor.' + obj + '_guc'].forEach((x) => { if (!p && lpEnIsPow(S[x])) p = x; });
  const dv = E[id] && E[id].device_id;
  if (!p && dv) { const L = Object.keys(E).filter((x) => E[x].device_id === dv && x.indexOf('sensor.') === 0 && lpEnIsPow(S[x]) && !/standby|bekleme/.test(x)); if (L.length) p = L.sort((a, b) => a.length - b.length)[0]; }
  if (S[id]) LP_EN.tp[id] = p;   // cihaz henüz yüklenmediyse sonra yeniden bakılır
  return p;
}
// Enerji sekmesi: "+ Sekme" menüsü ve Otomatik kur. Solda Halo ve bekleme, ortada kategoriler ve günlük tüketim, sağda en çok çekenler ve son 24 saat.
function lhdEnergyTab(lang, id) {
  const T = (k) => upper(lang, lpEnT(lang, 's_' + k));
  return { id: id, name: lang === 'tr' ? 'Enerji' : 'Energy', icon: 'mdi:lightning-bolt', area: null, v: 2, columns: [30, 40, 30], sections: [
    { id: id + '-h', type: 'energy', title: T('halo'), col: 0, grow: 3, entities: [{ energy: 'halo' }] },
    { id: id + '-b', type: 'energy', title: T('standby'), col: 0, entities: [{ energy: 'standby' }] },
    { id: id + '-c', type: 'energy', title: T('cats'), col: 1, grow: 3, entities: [{ energy: 'cats' }] },
    { id: id + '-w', type: 'energy', title: T('week'), col: 1, grow: 2, entities: [{ energy: 'week' }] },
    { id: id + '-t', type: 'energy', title: T('top'), col: 2, grow: 3, entities: [{ energy: 'top' }] },
    { id: id + '-d', type: 'energy', title: T('day'), col: 2, grow: 2, entities: [{ energy: 'day' }] }
  ] };
}
