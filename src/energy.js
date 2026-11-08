// Enerji kartları (v0.25): evin anlık gücü (Halo), kategori karoları, şu an en çok çekenler, son 7/30 gün, son 24 saat, bekleme tüketimi.
// Öğe biçimi: { energy: 'halo' | 'cats' | 'top' | 'week' | 'day' | 'standby', ...kartın seçenekleri }
// Veri Home Assistant'ın Enerji ayarlarından okunur: "Cihaz tüketimi" listesi. Listede başka bir girişe bağlı olmayanlar (included_in_stat yok)
// kategori, altında başka giriş olmayanlar cihazdır. Anlık güç: girişin güç sensörü (stat_rate, ..._energy → ..._power ya da aynı cihazın güç sensörü).
// Geçmiş: HA'nın kendi kayıtları (son 24 saat güç, günlük kWh istatistiği); pano ayrıca kayıt tutmaz. 5 dakikada bir tazelenir.
// Genel ayarlar settings.energy (yönetim panelinde Enerji sayfası):
//   total, standby: evin toplam güç ve bekleme gücü sensörü; limits: Halo'nun 3 sınırı (W); badge: karoda watt 'on' | 'always'
//   price_mode: 'bill' (son faturadan) | 'single' (price) | 'tier' (low, high, daily: günlük kWh sınırı, ay = daily × gün sayısı)
//   year_mode: 'auto' (EPDK: 30.10.2026'dan itibaren 3000; önce 2026 4000, 2025 5000 kWh) | 'manual' (year_limit)
//   sktt_price: son kaynak fiyatı (vergiler dahil, aylık değişir); sktt_on: şu an son kaynak tarifesinde (hesaplar bu fiyatla)
//   ytd: 1 Ocak'tan son faturanın sonuna kadar tüketim (kWh, isteğe bağlı); prev_year: geçen yılın toplamı (isteğe bağlı)
//   Fatura girilmeden de çalışır: yılın toplamı Home Assistant'ın kayıtlarından (şebeke sayacı ya da panel), kademe takvim ayıyla
//   bills: [{ from, to, kwh, tl, panel }] faturalar (panel: o dönemde panelin ölçtüğü kWh)
//   tilde: tahmini değerler "~" ile (varsayılan açık); untracked: ölçülmeyen pay kategori karolarında (varsayılan açık)
// Tahmini cihazlar ayrı kayıtta (data.estimates); entegrasyon her biri için sensor.lhd_<id>_power ve _energy kurar.
// Eski Safari için ?. ve ?? yok.

const LP_EN = window.__LEMUR_HD_EN || (window.__LEMUR_HD_EN = { m: null, key: '', at: 0, busy: false, subs: [], dm: null, dmL: '', tp: {} });
const LP_EN_TYPES = ['halo', 'cats', 'top', 'week', 'day', 'standby', 'flow', 'battery', 'tariff', 'meter', 'tips'];
const LP_EN_IC = { halo: 'mdi:lightning-bolt-circle', cats: 'mdi:view-grid-outline', top: 'mdi:format-list-numbered', week: 'mdi:chart-bar', day: 'mdi:chart-line', standby: 'mdi:power-sleep', flow: 'mdi:transmission-tower-export', battery: 'mdi:home-battery-outline', tariff: 'mdi:cash-multiple', meter: 'mdi:meter-electric-outline', tips: 'mdi:lightbulb-on-outline' };
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
    costMonth: 'bu ay', tierLo: 'Bu ay düşük kademe', tierHi: 'Bu ay yüksek kademede', yearL: 'Bu yıl · yıllık sınır', untracked: 'Ölçülmeyen', untrackedM: 'Ev sayacına göre', untrackedT: 'Son faturaya göre',
    k_halo: 'Evin anlık gücü', k_cats: 'Kategori karoları', k_top: 'Şu an en çok çekenler', k_week: 'Günlük tüketim', k_day: 'Son 24 saat', k_standby: 'Bekleme tüketimi',
    s_halo: 'Evin anlık gücü', s_standby: 'Bekleme', s_cats: 'Kategoriler', s_week: 'Son 7 gün · kWh', s_top: 'Şu an en çok çekenler', s_day: 'Son 24 saat', s_energy: 'Enerji',
    loose: 'Kategorisiz', d_halo: 'Evin şu an çektiği, seviye ve bugünkü tutar', d_cats: 'Kategorilerin anlık gücü ve payı', d_top: 'En çok çeken cihazlar', d_week: 'Günlük kWh ya da para', d_day: 'Son 24 saatin gücü', d_standby: 'Gece en düşük tüketim', d_flow: 'Güneş, şebeke, batarya ve ev arasında akış', d_battery: 'Doluluk, şarj ve kalan süre', d_tariff: 'Bu dönemin tutarı, kademe ve yıllık sınır', d_meter: 'Ev sayacı ve ölçülmeyen pay', d_tips: 'Uzun süre açık kalanlar, bekleme, sınır', k_tariff: 'Bu ay ve tarife', k_meter: 'Ev sayacı', k_tips: 'İpuçları', s_tariff: 'Bu ay ve tarife', s_meter: 'Ev sayacı', s_tips: 'İpuçları', k_flow: 'Güneş ve şebeke akışı', k_battery: 'Batarya', s_flow: 'Enerji akışı', s_battery: 'Batarya',
    noSol: 'Güneş ya da batarya açık değil', noSolT: 'Enerji sayfasında "Güneş ve batarya" bölümünden "Güneş enerjisi var" ya da "Batarya var"ı aç.', nGridOff: 'Şebeke yok', nGridOffT: 'kesinti',  noBat: 'Batarya sensörü seçilmedi',
    nSun: 'Güneş', nGrid: 'Şebeke', nGridO: 'Şebekeye', nGridI: 'Şebekeden', nHome: 'Ev', nBat: 'Batarya', prodT: 'kWh üretim bugün', selfU: 'kendi kullanımı', expN: 'şebekeye', impN: 'şebekeden',
    bCh: 'Şarj oluyor', bDis: 'Evi besliyor', bIdle: 'Beklemede', bFull: '~{t} sonra dolu', bLeft: '~{t} yeter', bKwh: '{k} / {c} kWh',
    tLeft: '{n} {h} saattir açık · {w}', tSb: 'Gece bekleme tüketimi yüksek: ~{w}', tDay: 'Bugün {k} kWh, günlük hedef {d} kWh', tYear: 'Yıllık sınırın %{p}\'ine gelindi',
    tSun: 'Güneş fazlası {w}: çamaşır için iyi an', tHide: 'Basılı tut: bunu gösterme', h: 'sa', m: 'dk' },
  en: { lvl0: 'Low usage', lvl1: 'Medium usage', lvl2: 'High usage', lvl3: 'Very high usage', today: 'kWh today', costToday: 'today', month: 'kWh/mo at this rate',
    none: 'No energy data', noneT: 'In Home Assistant go to Settings → Dashboards → Energy → "Individual devices" and add devices or groups; the cards fill from there.', loading: 'Loading…',
    sbT: 'What the home draws when nothing is in use', sbMin: 'Lowest of the last 24 hours', year: '~{k} kWh a year', yearC: '~{k} kWh a year · ~{c}',
    wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], todayD: 'Today', noHist: 'No history yet', noDev: 'No device with a power sensor', devs: '{n} devices', close: 'Close', total: 'Total',
    costMonth: 'this month', tierLo: 'This month, lower tier', tierHi: 'This month, upper tier', yearL: 'This year · yearly limit', untracked: 'Not measured', untrackedM: 'From the home meter', untrackedT: 'From the last bill',
    k_halo: 'Home power now', k_cats: 'Category tiles', k_top: 'Top consumers now', k_week: 'Daily usage', k_day: 'Last 24 hours', k_standby: 'Standby usage',
    s_halo: 'Home power now', s_standby: 'Standby', s_cats: 'Categories', s_week: 'Last 7 days · kWh', s_top: 'Top consumers now', s_day: 'Last 24 hours', s_energy: 'Energy',
    loose: 'Uncategorized', d_halo: 'What the home draws now, level and today\'s cost', d_cats: 'Power and share by category', d_top: 'Devices drawing the most', d_week: 'Daily kWh or money', d_day: 'Power over the last 24 hours', d_standby: 'Lowest use at night', d_flow: 'Flow between solar, grid, battery and home', d_battery: 'Charge, charging and time left', d_tariff: 'This period\'s cost, tier and yearly limit', d_meter: 'Home meter and the untracked share', d_tips: 'Left on, standby, the limit', k_tariff: 'This month and tariff', k_meter: 'Home meter', k_tips: 'Tips', s_tariff: 'This month and tariff', s_meter: 'Home meter', s_tips: 'Tips', k_flow: 'Solar and grid flow', k_battery: 'Battery', s_flow: 'Energy flow', s_battery: 'Battery',
    noSol: 'Solar or battery is not on', noSolT: 'On the Energy page, turn on "I have solar" or "I have a battery" under "Solar and battery".', nGridOff: 'No grid', nGridOffT: 'outage',  noBat: 'No battery sensor picked',
    nSun: 'Solar', nGrid: 'Grid', nGridO: 'To grid', nGridI: 'From grid', nHome: 'Home', nBat: 'Battery', prodT: 'kWh produced today', selfU: 'used at home', expN: 'to grid', impN: 'from grid',
    bCh: 'Charging', bDis: 'Powering the home', bIdle: 'Idle', bFull: 'full in ~{t}', bLeft: 'lasts ~{t}', bKwh: '{k} / {c} kWh',
    tLeft: '{n} on for {h} hours · {w}', tSb: 'Night standby is high: ~{w}', tDay: '{k} kWh today, daily goal {d} kWh', tYear: '{p}% of the yearly limit used',
    tSun: '{w} solar surplus: good time for laundry', tHide: 'Hold: don\'t show this', h: 'h', m: 'min' }
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
  if (lpEnCfg().sktt_on && lpEnNumOf(lpEnCfg().sktt_price)) return 'sktt';   // son kaynak tarifesinde: kademe yok, her kWh bu fiyattan
  if (m === 'bill' && lpEnLastBill()) return 'bill';
  if (m === 'tier' && lpEnNumOf(lpEnCfg().low) && lpEnNumOf(lpEnCfg().high)) return 'tier';
  if (m === 'tou' && lpEnTouP('day') && lpEnTouP('peak') && lpEnTouP('night')) return 'tou';
  if (m === 'single') return 'single';
  return lpEnLastBill() ? 'bill' : 'single';
}
// üç zamanlı (çok zamanlı) tarife: gündüz 06-17, puant 17-22, gece 22-06; kademe yok
function lpEnBand(t) { const h = new Date(t).getHours(); return h >= 6 && h < 17 ? 'day' : h >= 17 && h < 22 ? 'peak' : 'night'; }
function lpEnTouP(b) { const c = lpEnCfg(); return lpEnNumOf(b === 'day' ? c.t_day : b === 'peak' ? c.t_peak : c.t_night); }
function lpEnDaily() { return lpEnNumOf(lpEnCfg().daily) || 8; }
// bir ayın tutarı: kademede günlük sınır × ayın gün sayısı düşük fiyattan, üstü yüksek fiyattan
function lpEnMonthCost(kwh, days, M) {
  const c = lpEnCfg(), mode = lpEnMode();
  if (mode === 'tou') { const f = lpEnTouShare(); const tl = kwh * (f.day * lpEnTouP('day') + f.peak * lpEnTouP('peak') + f.night * lpEnTouP('night')); return { tl: tl, lim: 0, lo: kwh, hi: 0, f: f }; }
  if (mode === 'tier') { const lim = lpEnDaily() * days, lo = Math.min(kwh, lim); return { tl: lo * lpEnNumOf(c.low) + Math.max(0, kwh - lim) * lpEnNumOf(c.high), lim: lim, lo: lo, hi: Math.max(0, kwh - lim) }; }
  const u = lpEnUnit(M);
  return { tl: kwh * u, lim: 0, lo: kwh, hi: 0 };
}
// ortalama birim fiyat (0: fiyat yok). Kademede bu ayın ortalaması
function lpEnUnit(M) {
  const c = lpEnCfg(), mode = lpEnMode();
  if (mode === 'sktt') return lpEnNumOf(c.sktt_price);
  if (mode === 'tou') { const f = lpEnTouShare(); return f.day * lpEnTouP('day') + f.peak * lpEnTouP('peak') + f.night * lpEnTouP('night'); }
  if (mode === 'bill') { const b = lpEnLastBill(); return lpEnNumOf(b.tl) / lpEnNumOf(b.kwh); }
  if (mode === 'tier') { const mk = M && M.days ? lpEnMonthKwh(M) : 0; if (!mk) return lpEnNumOf(c.low); return lpEnMonthCost(mk, lpEnMonthDays(), M).tl / mk; }
  return lpEnPrice() || (M && M.price) || 0;
}
function lpEnMonthDays() { const P = lpEnPeriod(); if (P) return P.len; const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
// fatura dönemi: son faturanın bittiği günden başlar, son faturanın uzunluğunda sürer (kademe dönemin gün sayısı × günlük sınır). Fatura yoksa takvim ayı
function lpEnPeriod() {
  const b = lpEnLastBill(); if (!b) return null;
  const D = 86400000, f = Date.parse(b.from + 'T00:00:00'), t = Date.parse(b.to + 'T00:00:00') + D, len = Math.max(25, Math.min(35, Math.round((t - f) / D)));
  let a = t; while (a + len * D <= Date.now()) a += len * D;   // fatura girilmeden geçen dönemler atlanır
  return { from: a, len: len };
}
const lpEnDayTot = (M, i) => M.cats.reduce((a, c) => a + ((M.days.cats[c.id] || [])[i] || 0), 0);
// bu ay şimdiye kadar (sayaç tahmini: takip edilenler + ölçülmeyen pay)
function lpEnMonthKwh(M) {
  if (!M || !M.days) return 0;
  const P = lpEnPeriod(), m0 = new Date(); m0.setDate(1); m0.setHours(0, 0, 0, 0); if (P) m0.setTime(P.from);
  const hs = lpEnSince(m0.getTime()); if (hs !== null && LP_EN.yr.src === 'grid') return hs;   // şebeke sayacı varsa dönem onunla
  let s = 0; M.days.t.forEach((t, i) => { if (t >= m0.getTime()) s += lpEnDayTot(M, i); });
  return s / (1 - lpEnUntracked());   // faturadan bulunan ölçülmeyen payla sayaca yaklaştırılır
}
// son faturada panelin ölçmediği pay (0-0,95)
function lpEnUntracked() {
  const b = lpEnLastBill(); if (b && lpEnNumOf(b.panel)) return Math.max(0, Math.min(0.95, (b.kwh - b.panel) / b.kwh));
  return lpEnMeterUnt();
}
// ev sayacı varsa faturasız: son 7 tam günde sayacın saydığı ile panelin cihazlarının toplamı arasındaki fark
function lpEnMeterUnt() {
  const Y = LP_EN.yr, M = LP_EN.m; if (!lpEnMeter() || !Y || Y.src !== 'grid' || !M || !M.days || M.demo) return 0;
  let a = 0, p = 0; const n = M.days.t.length;
  for (let i = Math.max(0, n - 8); i < n - 1; i++) { const t = M.days.t[i]; let g = 0; Object.keys(Y.days).forEach((k) => { if (Math.abs(+k - t) < 43200000) g += Y.days[k]; }); if (!g) continue; a += g; p += lpEnDayTot(M, i); }
  return a > 0.5 ? Math.max(0, Math.min(0.95, (a - p) / a)) : 0;
}
// yıllık sınır (son kaynak tedarik tarifesi, mesken, ikili anlaşması olmayan). Y yılında geçerli sınır: 2025 5.000, 2026 4.000,
// 2027'den itibaren 3.000 kWh (EPDK 30.10.2026, karar 15005). Ölçü takvim yılının toplamı (sayaç okumalarıyla), "geçerli yıl ya da bir önceki yıl":
//  - önceki yılın toplamı o yılın sınırını geçtiyse bütün yıl son kaynak (Y başından itibaren)
//  - yıl içinde geçilirse geçildiği ayı izleyen 3. ayın 1'inden itibaren, yıl sonuna kadar
//  - 2026 geçişi: 2026 toplamı da 3.000 ile sayılır ama yeni sınır 1.1.2027'de yürürlükte; en erken 1 Ocak 2027
function lpEnLimitOf(y) { return y >= 2027 ? 3000 : y === 2026 ? 4000 : 5000; }
function lpEnYearLimit() { const c = lpEnCfg(); if (c.year_mode === 'manual' && lpEnNumOf(c.year_limit)) return lpEnNumOf(c.year_limit); const y = new Date().getFullYear(); return y === 2026 ? 3000 : lpEnLimitOf(y); }
// Home Assistant'ın kayıtlarından bu yıl (günlük) ve geçen yıl (aylık): şebekeden çekilen sayaç (Enerji ayarlarındaki şebeke kaynağı) varsa o,
// yoksa panelin kategorileri. Fatura girilmeden de çalışır; 30 dakikada bir tazelenir
function lpEnYearIds(M) {
  const mt = lpEnMeter(); if (mt && mt.energy) return { src: 'grid', ids: [mt.energy] };
  const P = LP_EN.prefs, g = [];
  ((P && P.energy_sources) || []).forEach((src) => { if (src && src.type === 'grid') (src.flow_from || []).forEach((f) => { if (f && f.stat_energy_from && g.indexOf(f.stat_energy_from) < 0) g.push(f.stat_energy_from); }); });
  if (g.length) return { src: 'grid', ids: g };
  const ids = []; (M ? M.cats : []).forEach((c) => (c.e ? [c.e] : (c.es || [])).forEach((x) => { if (x && ids.indexOf(x) < 0) ids.push(x); }));
  return { src: 'panel', ids: ids };
}
function lpEnYearFetch(conn, M) {
  const Y = LP_EN.yr, q = lpEnYearIds(M), key = q.src + q.ids.join(',');
  if (!q.ids.length || (Y && Y.key === key && Date.now() - Y.at < 1800000)) return Promise.resolve();
  const y = new Date().getFullYear(), a = new Date(y, 0, 1), p0 = new Date(y - 1, 0, 1), sum = (L) => { let t = 0; (L || []).forEach((x) => { if (isFinite(x.change)) t += Math.max(0, x.change); }); return t; };
  const st = (x) => (typeof x.start === 'number' ? x.start : Date.parse(x.start));
  const ask = (from, to, period) => conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: from.toISOString(), end_time: to ? to.toISOString() : undefined, period: period, statistic_ids: q.ids, types: ['change'], units: { energy: 'kWh' } });
  return Promise.all([ask(a, null, 'day'), ask(p0, a, 'month')]).then((r) => {
    const days = {}; let first = 0;
    q.ids.forEach((id) => ((r[0] && r[0][id]) || []).forEach((x) => { const t = st(x); if (!isFinite(x.change)) return; days[t] = (days[t] || 0) + Math.max(0, x.change); if (!first || t < first) first = t; }));
    let prev = 0, pfirst = 0; q.ids.forEach((id) => { const L = (r[1] && r[1][id]) || []; prev += sum(L); L.forEach((x) => { const t = st(x); if (!pfirst || t < pfirst) pfirst = t; }); });
    LP_EN.yr = { key: key, at: Date.now(), y: y, src: q.src, days: days, first: first, prev: prev, pfull: !!pfirst && pfirst <= p0.getTime() + 2 * 86400000 };
  }).catch(() => {});
}
// bir tarihten bu yana Home Assistant'ın saydığı (şebeke sayacı ya da panel; panelse ölçülmeyen payla büyütülür)
function lpEnSince(t0) {
  const Y = LP_EN.yr; if (!Y || Y.y !== new Date().getFullYear()) return null;
  let s = 0; Object.keys(Y.days).forEach((k) => { if (+k >= t0 - 43200000) s += Y.days[k]; });
  return Y.src === 'grid' ? s : s / (1 - lpEnUntracked());
}
// bu takvim yılı (1 Ocak'tan bu yana): { k, src: manual | bills | grid | panel, est: kayıt yılın başını tutmuyor (ortalamayla tamamlandı), low: panel ölçmeyeni görmüyor (en az) }
function lpEnYtdInfo(M) {
  const c = lpEnCfg(), D = 86400000, now = Date.now(), y0 = new Date(new Date().getFullYear(), 0, 1).getTime(), b = lpEnLastBill(), Y = LP_EN.yr;
  const end = (x) => Date.parse(x.to + 'T00:00:00') + D;
  const tail = (t0) => { const v = lpEnSince(t0); if (v !== null) return v; let s = 0; if (M && M.days) M.days.t.forEach((t, i) => { if (t >= t0) s += lpEnDayTot(M, i); }); return s / (1 - lpEnUntracked()); };
  if (lpEnNumOf(c.ytd) && b && end(b) > y0) return { k: lpEnNumOf(c.ytd) + tail(end(b)), src: 'manual' };
  let base = 0, upto = 0;
  lpEnBills().forEach((x) => { const f = Date.parse(x.from + 'T00:00:00'), t = end(x); if (t <= y0 || !(f < t)) return; base += lpEnNumOf(x.kwh) * (f >= y0 ? 1 : (t - y0) / (t - f)); if (t > upto) upto = t; });
  // faturalar yılın başından mı başlıyor? değilse aradaki dönem Home Assistant'tan
  if (base) { const f0 = Math.min.apply(null, lpEnBills().map((x) => Date.parse(x.from + 'T00:00:00')).filter((f) => f + 40 * D > y0)); if (f0 <= y0 + 3 * D) return { k: base + tail(upto), src: 'bills' }; }
  if (Y && Y.y === new Date().getFullYear() && Y.first) {
    let s = 0; Object.keys(Y.days).forEach((k) => { s += Y.days[k]; });
    const covered = Math.max(1, (now - Y.first) / D), elapsed = Math.max(1, (now - y0) / D), est = Y.first > y0 + 2 * D;
    let k = est ? s / covered * elapsed : s;
    if (Y.src === 'panel') k = k / (1 - lpEnUntracked());
    return { k: k, src: Y.src, est: est, low: Y.src === 'panel' && !lpEnLastBill() };
  }
  if (base) return { k: base + tail(upto), src: 'bills' };
  return { k: 0, src: '' };
}
function lpEnYtd(M) { return lpEnYtdInfo(M).k; }
const lpEnYear = lpEnYtd;
// geçen yılın toplamı: elle yazılan, yoksa Home Assistant'ın kaydı (yılın tamamını tutuyorsa)
function lpEnPrev() { const c = lpEnCfg(), Y = LP_EN.yr; if (lpEnNumOf(c.prev_year)) return lpEnNumOf(c.prev_year); if (Y && Y.pfull && Y.prev) return Y.src === 'grid' ? Y.prev : Y.prev / (1 - lpEnUntracked()); return 0; }
// yılın gidişi: şimdiki hızla yıl sonu, sınırın geçileceği gün, son kaynak fiyatının başlayacağı gün
function lpEnYearPlan(M) {
  const I = lpEnYtdInfo(M), k = I.k, y = new Date().getFullYear(), prev = lpEnPrev(), prevOver = prev > 0 && prev >= lpEnLimitOf(y);
  if (!k && !prevOver) return null;
  const now = new Date(), y0 = new Date(y, 0, 1), D = 86400000;
  const days = Math.max(1, (now - y0) / D), avg = k / days, lim = lpEnYearLimit(), proj = k + avg * (new Date(y + 1, 0, 1) - now) / D;
  const cross = k && proj >= lim ? new Date(y0.getTime() + Math.min(lim / avg, 366) * D) : null;
  let start = cross ? new Date(cross.getFullYear(), cross.getMonth() + 3, 1) : null;
  if (start && y === 2026 && lpEnCfg().year_mode !== 'manual' && start < new Date(2027, 0, 1)) start = new Date(2027, 0, 1);   // yeni sınır 1.1.2027'de yürürlükte
  return { k: k, src: I.src, est: !!I.est, low: !!I.low, lim: lim, avg: avg, proj: proj, cross: cross, start: start, past: k >= lim, prev: prev, prevOver: prevOver, nowIn: prevOver || (!!start && start <= now) };
}
// tahmini cihaz (entegrasyonun kurduğu sensör): kartlarda "~" ile
const lpEnIsEst = (x) => !!x && (x.est !== undefined ? !!x.est : typeof x.e === 'string' && /^sensor\.lhd_[a-z0-9_]+_energy$/.test(x.e));
const lpEnTil = (x) => (lpEnIsEst(x) && lpEnCfg().tilde !== false ? '~' : '');
// bir dönemde takip edilenlerin toplamı (fatura eklenince "panelin ölçtüğü" için)
function lpEnPeriodKwh(h, from, to) {
  const M = LP_EN.m, conn = h && h.connection;
  if (!M || !M.cats.length || !conn) return Promise.resolve(0);
  const a = new Date(from + 'T00:00:00'), b = new Date(to + 'T00:00:00'); b.setDate(b.getDate() + 1);
  return conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: a.toISOString(), end_time: b.toISOString(), period: 'day', statistic_ids: M.cats.reduce((a, c) => a.concat(c.e ? [c.e] : c.es || []), []).filter((x) => !!x), types: ['change'], units: { energy: 'kWh' } })
    .then((r) => { let s = 0; Object.keys(r || {}).forEach((k) => (r[k] || []).forEach((p) => { if (isFinite(p.change)) s += Math.max(0, p.change); })); return Math.round(s * 10) / 10; }).catch(() => 0);
}
// ölçülmüş ışık tablosu (Öğren, ortak havuz, aktarma): entegrasyondaki lut.power ile aynı ara değer hesabı
function lrLin(xs, ys, x) { if (xs.length === 1 || x <= xs[0]) return ys[0]; if (x >= xs[xs.length - 1]) return ys[ys.length - 1]; for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + (ys[i] - ys[i - 1]) * (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[ys.length - 1]; }
function lrHue(hs, ys, h) { h = ((h % 360) + 360) % 360; if (hs.length === 1) return ys[0]; const xs = hs.concat([hs[0] + 360]), vs = ys.concat([ys[0]]); if (h < xs[0]) h += 360; return lrLin(xs, vs, h); }
function lrPow(lut, a) {
  if (!lut || typeof lut !== 'object') return null;
  const bri = parseFloat(a.brightness), b = isFinite(bri) ? Math.max(0, Math.min(100, bri / 255 * 100)) : 100;
  if (lut.fx !== undefined && lut.fx !== null && ['', 'None', 'none', 'off', 'Off', 'solid', 'Solid'].indexOf(String(a.effect === undefined || a.effect === null ? '' : a.effect)) < 0) {
    const f = lut.fx; if (typeof f !== 'object') return +f;   // efekt: %100'deki gücü × efektlerin parlaklık eğrisi
    const w = f.e && f.e[String(a.effect)] !== undefined ? +f.e[String(a.effect)] : +(f.avg || 0);
    return w * (f.b && f.r ? lrLin(f.b, f.r, b) : (b < 100 ? b / 100 : 1));
  }
  const mode = String(a.color_mode || ''), hs = a.hs_color;
  if (lut.hs && (['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(mode) >= 0 || (!mode && hs)) && hs && hs.length === 2) {
    const t = lut.hs, per = t.w.map((plane) => lrHue(t.h, plane.map((row) => lrLin(t.b, row, b)), +hs[0] || 0));
    const o = t.s.map((x, i) => i).sort((i, j) => t.s[i] - t.s[j]);
    return lrLin(o.map((i) => t.s[i]), o.map((i) => per[i]), +hs[1] || 0);
  }
  if (lut.ct) { const t = lut.ct; let k = parseFloat(a.color_temp_kelvin); if (!isFinite(k) && parseFloat(a.color_temp) > 0) k = 1e6 / parseFloat(a.color_temp); if (!isFinite(k)) k = t.k[Math.floor(t.k.length / 2)]; return lrLin(t.k, t.w.map((row) => lrLin(t.b, row, b)), k); }
  if (lut.br) return lrLin(lut.br.b, lut.br.w, b);
  if (lut.hs) { const t = lut.hs; let i = 0; t.s.forEach((x, j) => { if (x < t.s[i]) i = j; }); return t.w[i].reduce((acc, row) => acc + lrLin(t.b, row, b), 0) / t.h.length; }
  return null;
}
function lrCount(lut) { let n = 0; if (lut && lut.ct) n += lut.ct.k.length * lut.ct.b.length; if (lut && lut.hs) n += lut.hs.s.length * lut.hs.h.length * lut.hs.b.length; if (lut && lut.br) n += lut.br.b.length; if (lut && lut.fx && typeof lut.fx === 'object' && lut.fx.e) n += Object.keys(lut.fx.e).length; return n; }
// tahmini cihazın gücü (yönetim panelindeki hesap; entegrasyondaki estimates.power ile aynı)
function lpEnEstW(e, st) {
  const n = (k) => lpEnNumOf(e[k]);
  if (e.kind === 'fixed') return n('w');
  if (e.kind === 'year') return n('year') * 1000 / 8760;
  if (e.kind === 'cycle') return n('k100') / 100 * n('week') * 52 * 1000 / 8760;
  if (e.kind === 'meas') return st ? Math.max(0, lpEnW({ x: st }, 'x') || 0) : 0;
  if (e.kind === 'states') { const sv = st ? String(st.state) : 'unavailable', r = (Array.isArray(e.states) ? e.states : []).filter((x) => x && String(x.s) === sv)[0]; return r ? lpEnNumOf(r.w) : n('other'); }
  const on = !!st && ['off', 'unavailable', 'unknown', 'standby', 'idle', 'closed', 'docked', 'none', ''].indexOf(String(st.state)) < 0;
  if (e.kind === 'light') {
    if (!on) return n('idle');
    if (e.lut) { const v = lrPow(e.lut, st.attributes || {}); if (v !== null && isFinite(v)) return Math.max(0, v); }
    const lo = e.min !== undefined && e.min !== null && e.min !== '' ? n('min') : n('idle'), b = st.attributes.brightness;
    const f = b === undefined || b === null ? 1 : Math.max(0, Math.min(1, b / 255));
    return lo + (Math.max(n('max'), lo) - lo) * f;
  }
  if (e.kind === 'onoff') return on ? n('on') : n('off');
  return 0;
}
// Güneş, şebeke ve batarya (settings.energy.solar): on, prod (W), prod_energy (kWh, yoksa entegrasyon sensor.lhd_solar_energy kurar),
// grid_mode 'net' (grid: + alınan, - verilen) | 'two' (grid_in, grid_out) | 'none'; bat_power (+ şarj), bat_inv (işaret ters), soc (%), cap (kWh)
function lpEnSolar() { const s = lpEnCfg().solar; return s && typeof s === 'object' && !Array.isArray(s) ? s : {}; }
// güneş ve batarya ayrı ayrı açılır (sun, bat); eski kayıtta yalnız "on" vardı: üretim sensörü varsa güneş, batarya sensörü varsa batarya
function lpEnSunOn(s0) { const s = s0 || lpEnSolar(); return s.sun !== undefined ? !!s.sun && s.on !== false : !!(s.on && s.prod); }
function lpEnBatOn(s0) { const s = s0 || lpEnSolar(); return s.bat !== undefined ? !!s.bat && s.on !== false : !!(s.on && (s.bat_power || s.soc)); }
function lpEnSunE() { const s = lpEnSolar(); return lpEnSunOn(s) && s.prod ? (s.prod_energy || 'sensor.lhd_solar_energy') : null; }
// ev sayacı (settings.energy.meter): power (W, şebekeden alınan +), energy (kWh, şebekeden alınan), out (kWh, şebekeye verilen), inv (gücün işareti ters), volt (V)
function lpEnMeter() { const m = lpEnCfg().meter; return m && typeof m === 'object' && !Array.isArray(m) && (m.power || m.energy) ? m : null; }
function lpEnGridMode(s) { return s.grid_mode === 'two' || s.grid_mode === 'none' ? s.grid_mode : 'net'; }
// anlık akış: ev = şebeke + üretim - batarya şarjı
function lpEnFlowNow(S) {
  const s = lpEnSolar(), sun = lpEnSunOn(s), bt = lpEnBatOn(s), m = lpEnMeter(); if (!sun && !bt) return null;
  const w = (id) => (id ? lpEnW(S, id) : null), gm = m && m.power ? 'meter' : lpEnGridMode(s);
  const prod = sun ? w(s.prod) : null;
  let grid = null;
  if (gm === 'meter') { grid = w(m.power); if (grid !== null && m.inv) grid = -grid; }
  else if (gm === 'two') { const a = w(s.grid_in), b = w(s.grid_out); if (a !== null || b !== null) grid = (a || 0) - (b || 0); } else if (gm === 'net') { grid = w(s.grid); if (grid !== null && s.grid_inv) grid = -grid; }
  let bat = bt ? w(s.bat_power) : null; if (bat !== null && s.bat_inv) bat = -bat;
  const so = bt && s.soc && S[s.soc] ? parseFloat(S[s.soc].state) : NaN;
  // şebeke kesintisi: sayacın gerilimi düştüyse ya da şebeke ölçümü yokken ev bataryadan besleniyorsa
  const vs = m && m.volt && S[m.volt] ? parseFloat(S[m.volt].state) : NaN, gEnt = gm === 'meter' ? m.power : s.grid || s.grid_in;
  const gUn = !!gEnt && (!S[gEnt] || ['unavailable', 'unknown'].indexOf(String(S[gEnt].state)) >= 0);
  const outage = bt && bat !== null && bat < -20 && ((isFinite(vs) && vs < 100) || (gUn && !sun));
  return { prod: prod, grid: outage ? 0 : grid, bat: bat, soc: isFinite(so) ? Math.max(0, Math.min(100, so)) : null, cap: bt ? lpEnNumOf(s.cap) : 0, home: Math.max(0, (outage ? 0 : grid || 0) + (prod || 0) - (bat || 0)),
    gridKnown: (grid !== null || outage) && (prod !== null || !sun || !s.prod) && (bat !== null || !bt || !(s.bat_power || s.soc)), has: prod !== null || grid !== null || bat !== null, hasBat: bt && !!(s.bat_power || s.soc), sun: sun, outage: outage };
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
// Panelin kendi cihaz ve kategori kaydı (Enerji sayfası): varsa kartlar ondan, yoksa HA enerji ayarlarından dolar
function lpEnLemur() {
  const d = STORE.data || {}, E = d.estimates && typeof d.estimates === 'object' && !Array.isArray(d.estimates) ? d.estimates : {}, C = Array.isArray(d.ecats) ? d.ecats : [];
  return Object.keys(E).length || C.length ? { E: E, C: C } : null;
}
// cihazın güç ve kWh sensörü (entegrasyonun kurdukları ya da ölçen cihazın kendi sensörleri)
const lpEnDevP = (id, x) => (x.kind === 'meas' ? x.sensor || '' : 'sensor.lhd_' + id + '_power');
const lpEnDevE = (id, x) => (x.kind === 'meas' && x.energy ? x.energy : 'sensor.lhd_' + id + '_energy');
// ölçen prize bağlı cihazlar (Python'daki estimates.inside_of ile aynı kural): var olan, kendisi değil, kendi prizi olmayan
function lpEnInside(id, x, E) {
  if (!x || x.kind !== 'meas' || !Array.isArray(x.inside)) return [];
  const out = [];
  x.inside.forEach((k) => { const e = E[k]; if (k !== id && e && !(e.kind === 'meas' && Array.isArray(e.inside) && e.inside.length) && out.indexOf(k) < 0) out.push(k); });
  return out;
}
function lpEnModelLemur(h, L, prefs) {
  const cats = L.C.map((c, i) => { const lk = lpEnLookOf(c.name, i); return { id: 'sensor.lhd_kat_' + c.id + '_energy', cid: c.id, name: c.name, icon: c.icon || lk[0], color: c.color || lk[1], e: 'sensor.lhd_kat_' + c.id + '_energy', p: 'sensor.lhd_kat_' + c.id + '_power', kids: [] }; });
  const by = {}; cats.forEach((c) => { by[c.cid] = c; });
  const devs = Object.keys(L.E).map((id) => {
    const x = L.E[id] || {}, c = by[x.cat], net = lpEnInside(id, x, L.E).length > 0;
    // paylaşımlı priz: kartlarda prizin toplamı yerine kalan pay (prizdeki işaretli cihazlar kendi satırlarında)
    const e = net ? 'sensor.lhd_' + id + '_net_energy' : lpEnDevE(id, x), p = net ? 'sensor.lhd_' + id + '_net_power' : lpEnDevP(id, x);
    return { id: e, lid: id, name: String((net && x.rest) || x.name || id), e: e, p: p, cat: c ? c.id : null, icon: x.icon || (c ? c.icon : 'mdi:flash'), color: c ? c.color : '#8A8F96', est: x.kind !== 'meas', kind: x.kind, link: x.entity || x.sensor || null, plug: net ? lpEnDevP(id, x) : null };
  });
  devs.forEach((d) => { if (d.cat) by[d.cat.replace(/^sensor\.lhd_kat_|_energy$/g, '')].kids.push(d); });
  const loose = devs.filter((d) => !d.cat);
  if (loose.length) cats.push({ id: '__loose', name: lpEnT(pickLang(h), 'loose'), icon: 'mdi:dots-horizontal-circle-outline', color: '#8A8F96', e: null, es: loose.map((d) => d.e), p: null, kids: loose });
  let price = 0;
  ((prefs && prefs.energy_sources) || []).forEach((s) => { if (s && s.type === 'grid') (s.flow_from || []).forEach((f) => { if (!price && f && f.number_energy_price > 0) price = f.number_energy_price; }); });
  return { cats: cats, devs: devs, price: price, hist: null, days: null, lemur: true };
}
// HA enerji ayarlarından kategori ve cihaz listesi
function lpEnModel(h, prefs) {
  const LM = lpEnLemur();
  if (LM) return lpEnModelLemur(h, LM, prefs);
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
  M.devs.slice(0, 120).forEach((d) => add(d.p));   // ipuçları için (uzun süre açık kalan cihaz)
  const sol = lpEnSolar(), gm = lpEnGridMode(sol);
  const mt = lpEnMeter(); if (mt && mt.power) add(mt.power);
  if (lpEnSunOn(sol) || lpEnBatOn(sol)) [lpEnSunOn(sol) ? sol.prod : null, mt && mt.power ? null : gm === 'net' ? sol.grid : null, mt && mt.power ? null : gm === 'two' ? sol.grid_in : null, mt && mt.power ? null : gm === 'two' ? sol.grid_out : null, lpEnBatOn(sol) ? sol.bat_power : null].forEach(add);
  if (!ids.length) return Promise.resolve();
  return conn.sendMessagePromise({ type: 'history/history_during_period', start_time: new Date(t0).toISOString(), end_time: new Date(now).toISOString(), entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false })
    .then((r) => {
      const ser = {};
      ids.forEach((id) => { const u = S[id] ? String(S[id].attributes.unit_of_measurement || '') : ''; ser[id] = lpEnBin((r && r[id]) || [], t0, step, LP_EN_BINS, u === 'kW' ? 1000 : 1); });
      const cats = {};
      M.cats.forEach((c) => { cats[c.id] = c.p ? ser[c.p] : lpEnSum(c.kids.map((k) => ser[k.p]), LP_EN_BINS); });
      const devs = {}; M.devs.forEach((d) => { if (ser[d.p]) devs[d.id] = ser[d.p]; });
      let total = tot && ser[tot] ? ser[tot] : lpEnSum(M.cats.map((c) => cats[c.id]), LP_EN_BINS);
      // güneşli evde sayaçtan: ev = şebeke + üretim - batarya şarjı (anlık akıştaki hesap)
      const g = mt && mt.power && ser[mt.power] ? ser[mt.power].map((v) => (v === null ? null : mt.inv ? -v : v)) : gm === 'net' && ser[sol.grid] ? ser[sol.grid].map((v) => (v === null ? null : sol.grid_inv ? -v : v))
        : gm === 'two' && ser[sol.grid_in] ? ser[sol.grid_in].map((v, i) => (v === null ? null : v - ((ser[sol.grid_out] || [])[i] || 0))) : null;
      if (!tot && g && (!lpEnSunOn(sol) && !lpEnBatOn(sol) ? !!mt : (!lpEnSunOn(sol) || !sol.prod || ser[sol.prod]) && (!lpEnBatOn(sol) || !sol.soc || sol.bat_power))) {
        const pr = lpEnSunOn(sol) && sol.prod ? ser[sol.prod] : null, bt = lpEnBatOn(sol) && sol.bat_power ? ser[sol.bat_power] : null;
        total = g.map((v, i) => { const p0 = pr ? pr[i] : 0; if (v === null || p0 === null || p0 === undefined) return total[i]; const b = bt && bt[i] !== null && bt[i] !== undefined ? (sol.bat_inv ? -bt[i] : bt[i]) : 0; return Math.max(0, v + p0 - b); });
      }
      M.hist = { t0: t0, step: step, cats: cats, total: total, devs: devs, ser: ser };
    }).catch(() => {});
}
function lpEnDays(conn, M) {
  const of = (c) => (c.e ? [c.e] : (c.es || [])), ids = [];
  M.cats.forEach((c) => of(c).forEach((x) => { if (x && ids.indexOf(x) < 0) ids.push(x); }));
  const sun = lpEnSunE(); if (sun && ids.indexOf(sun) < 0) ids.push(sun);
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
      const per = {}; M.cats.forEach((c) => { per[c.id] = days.map((x, i) => of(c).reduce((s0, id) => s0 + ((cats[id] || [])[i] || 0), 0)); });
      M.days = { t: days, cats: per, sun: sun ? cats[sun] : null };
    }).catch(() => {});
}
// dönemin saatlik tüketimi (üç zamanlının payları) ve bataryanın saatlik şarj/deşarjı: Home Assistant'ın saatlik istatistiklerinden
function lpEnTouShare() {
  const T = LP_EN.tou; if (T && T.k) { const a = T.k.day + T.k.peak + T.k.night; if (a > 0.5) return { day: T.k.day / a, peak: T.k.peak / a, night: T.k.night / a, known: true }; }
  return { day: 0.5, peak: 0.25, night: 0.25, known: false };   // kayıt yoksa tipik ev
}
function lpEnHourFetch(conn, M) {
  const c = lpEnCfg(), s = lpEnSolar(), mt = lpEnMeter(), need = c.price_mode === 'tou' || (lpEnBatOn(s) && s.bat_power);
  const q = lpEnYearIds(M), ids = q.ids.slice(), bp = lpEnBatOn(s) ? s.bat_power : null, sig = ids.join(',') + '|' + (bp || '') + '|' + (s.bat_inv ? 1 : 0);
  if (!need || (LP_EN.tou && LP_EN.tou.sig === sig && Date.now() - LP_EN.tou.at < 1800000)) return Promise.resolve();
  const P = lpEnPeriod(), from = P ? new Date(P.from) : (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; })();
  const st = (x) => (typeof x.start === 'number' ? x.start : Date.parse(x.start));
  const a = ids.length ? conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: from.toISOString(), period: 'hour', statistic_ids: ids, types: ['change'], units: { energy: 'kWh' } }) : Promise.resolve({});
  const b = bp ? conn.sendMessagePromise({ type: 'recorder/statistics_during_period', start_time: from.toISOString(), period: 'hour', statistic_ids: [bp], types: ['mean'], units: { power: 'W' } }) : Promise.resolve({});
  return Promise.all([a, b]).then((r) => {
    const k = { day: 0, peak: 0, night: 0 }, ch = { day: 0, peak: 0, night: 0 }, dis = { day: 0, peak: 0, night: 0 };
    ids.forEach((id) => ((r[0] && r[0][id]) || []).forEach((x) => { if (isFinite(x.change)) k[lpEnBand(st(x))] += Math.max(0, x.change); }));
    ((r[1] && bp && r[1][bp]) || []).forEach((x) => { if (!isFinite(x.mean)) return; const v = (s.bat_inv ? -x.mean : x.mean) / 1000, bd = lpEnBand(st(x)); if (v > 0) ch[bd] += v; else dis[bd] -= v; });
    LP_EN.tou = { at: Date.now(), sig: sig, from: from.getTime(), k: k, ch: ch, dis: dis, bat: !!bp && !!(r[1] && r[1][bp] && r[1][bp].length) };
  }).catch(() => {});
}
// bataryanın dönemdeki dökümü: şarj, deşarj, kayıp; üç zamanlıda kazanç (deşarjın çıktığı dilimin fiyatı − şarjın girdiği dilimin fiyatı)
function lpEnBatGain() {
  const T = LP_EN.tou; if (!T || !T.bat) return null;
  const sum = (o) => o.day + o.peak + o.night, chg = sum(T.ch), dis = sum(T.dis);
  const tou = lpEnMode() === 'tou', val = (o) => o.day * lpEnTouP('day') + o.peak * lpEnTouP('peak') + o.night * lpEnTouP('night');
  return { from: T.from, ch: chg, dis: dis, loss: Math.max(0, chg - dis), gain: tou ? val(T.dis) - val(T.ch) : null, chN: T.ch.night, disP: T.dis.peak + T.dis.day };
}
function lpEnSub(fn) { LP_EN.subs.push(fn); return () => { const i = LP_EN.subs.indexOf(fn); if (i >= 0) LP_EN.subs.splice(i, 1); }; }
function lpEnFire() { LP_EN.subs.slice().forEach((f) => { try { f(); } catch (e) {} }); }
// veriyi yükle (ilk kez, 5 dakikada bir ya da enerji ayarı değişince)
function lpEnEnsure(h) {
  if (!h || LP_EN.busy) return;
  const LM = lpEnLemur();
  const key = JSON.stringify([lpEnCfg().total || '', lpEnCfg().standby || '', lpEnSolar(), lpEnMeter(), lpEnCfg().price_mode || '', LM ? [LM.C, Object.keys(LM.E).map((k) => [k, LM.E[k].cat, LM.E[k].kind, LM.E[k].sensor, LM.E[k].energy, LM.E[k].name])] : 0]);
  if (LP_EN.m && LP_EN.key === key && Date.now() - LP_EN.at < 300000) return;
  const conn = h.connection; if (!conn || !conn.sendMessagePromise) return;
  LP_EN.busy = true; LP_EN.key = key;
  conn.sendMessagePromise({ type: 'energy/get_prefs' }).catch(() => null).then((prefs) => {
    const M = lpEnModel(h, prefs);
    LP_EN.prefs = prefs || null;   // yönetim panelinde bulunan cihazlar için (grup toplamları hariç tutulur)
    return M.cats.length || lpEnSunE() || lpEnYearIds(M).ids.length ? Promise.all([lpEnHist(conn, h.states || {}, M), lpEnDays(conn, M), lpEnYearFetch(conn, M), lpEnHourFetch(conn, M)]).then(() => M) : M;
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
  const sun = days.map((x, j) => Math.round((9 + ((j * 5) % 7)) * (j === LP_EN_DAYS - 1 ? 0.7 : 1) * 10) / 10);
  return { demo: true, flow: { prod: 2380, grid: -754, bat: 640, soc: 72, cap: 10, home: 986, gridKnown: true, has: true, hasBat: true }, cats: cats, devs: devs, price: tr ? 3.15 : 0.3, hist: { t0: t0, step: step, cats: hc, total: lpEnSum(cats.map((c) => hc[c.id]), LP_EN_BINS) }, days: { t: days, cats: dc, sun: sun } };
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
  const s = lpEnSolar(); if (lpEnSunOn(s) || lpEnBatOn(s)) ['prod', 'grid', 'grid_in', 'grid_out', 'bat_power', 'soc'].forEach((k) => add(s[k]));
  const m = lpEnMeter(); if (m) { add(m.power); add(m.volt); }
  return o;
}
const lpEnWOf = (S, x) => (x.w !== undefined ? x.w : (x.p ? lpEnW(S, x.p) : null));
function lpEnCatW(S, c) {
  const w = lpEnWOf(S, c); if (w !== null) return w;
  let s = null; c.kids.forEach((k) => { const v = lpEnWOf(S, k); if (v !== null) s = (s || 0) + v; });
  return s;
}
// ev sayacından evin şu anki gücü (yoksa null): güneş/batarya varsa akıştan, yoksa sayaçtan
function lpEnHomeMeter(S, M) {
  const m = lpEnMeter(); if (!m || !m.power || (M && M.demo)) return null;
  const F = lpEnFlowNow(S); if (F && F.gridKnown) return F.home;
  const v = lpEnW(S, m.power); return v === null ? null : Math.max(0, m.inv ? -v : v);
}
function lpEnTotal(S, M) {
  const m = !M.demo && lpEnMeter();
  if (m && m.power && !lpEnSunOn() && !lpEnBatOn()) { const v = lpEnW(S, m.power); if (v !== null) return Math.max(0, m.inv ? -v : v); }   // ev sayacı: evin gücü doğrudan
  const tot = !M.demo && lpEnCfg().total;
  if (tot) { const v = lpEnW(S, tot); if (v !== null) return v; }
  const F = !M.demo && lpEnFlowNow(S, null);
  if (F && F.gridKnown) return F.home;
  let s = null; M.cats.forEach((c) => { const v = lpEnCatW(S, c); if (v !== null) s = (s || 0) + v; });
  return s;
}
// biçimleme
function lpEnNum(v, d, lang) { return Number(v).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function lpEnWp(w, lang) {   // [sayı, birim]
  if (w === null || w === undefined) return ['–', 'W'];
  if (Math.abs(w) >= 1000) return [lpEnNum(w / 1000, Math.abs(w) >= 10000 ? 0 : 1, lang), 'kW'];
  if (w !== 0 && Math.abs(w) < 1) return [lpEnNum(w, 1, lang), 'W'];
  return [lpEnNum(Math.round(w), 0, lang), 'W'];
}
const lpEnPct = (v, lang) => (lang === 'tr' ? '%' + Math.round(v) : Math.round(v) + '%');
const lpEnWs = (w, lang) => { const p = lpEnWp(w, lang); return p[0] + ' ' + p[1]; };
function lpEnMoney(h, v, lang) {
  const cur = (h && h.config && h.config.currency) || (lang === 'tr' ? 'TRY' : h && h.lhdEnDemo ? 'EUR' : '');
  const d = v < 10 ? 2 : 0;
  if (cur) { try { return v.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: cur, minimumFractionDigits: d, maximumFractionDigits: d }); } catch (e) {} }
  return lpEnNum(v, d, lang);
}
// küçük grafikler (SVG): çizgi, alan, yığılmış çubuk
function lpEnSpark(arr, color, H, top) {   // top: ortak ölçek (kategoriler aynı ölçekte çizilir, küçük olan küçük görünür)
  const v = (arr || []).filter((x) => x !== null && x !== undefined);
  if (v.length < 2) return '<svg class="esp" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none"></svg>';
  const mx = top > 0 ? top : Math.max.apply(null, v) || 1, n = arr.length, pts = [];
  arr.forEach((x, i) => { if (x === null || x === undefined) return; pts.push((i / (n - 1) * 100).toFixed(1) + ',' + (H - 1 - x / mx * (H - 3)).toFixed(1)); });
  return '<svg class="esp" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none"><polygon points="0,' + H + ' ' + pts.join(' ') + ' 100,' + H + '" fill="' + color + '" opacity=".16"/>' +
    '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>';
}
function lpEnMini(arr, color, H, top) {   // 7 günlük küçük çubuklar
  const v = (arr || []).slice(-7), mx = top > 0 ? top : Math.max.apply(null, v.concat([0.001]));
  return '<svg class="esp" viewBox="0 0 70 ' + H + '" preserveAspectRatio="none">' + v.map((x, i) => { const hh = Math.max(1, x / mx * (H - 2)); return '<rect x="' + (i * 10 + 1.5) + '" y="' + (H - hh).toFixed(1) + '" width="7" height="' + hh.toFixed(1) + '" rx="1.5" fill="' + color + '" opacity="' + (i === v.length - 1 ? 1 : 0.55) + '"/>'; }).join('') + '</svg>';
}
// kartın gövdesi (data yoksa ipucu)
function lpEnEmpty(M, lang, big) {
  if (!M) return '<div class="enmsg">' + esc(lpEnT(lang, 'loading')) + '</div>';
  return '<div class="enmsg"><ha-icon icon="mdi:lightning-bolt-outline"></ha-icon><b>' + esc(lpEnT(lang, 'none')) + '</b>' + (big ? '<span>' + esc(lpEnT(lang, 'noneT')) + '</span>' : '') + '</div>';
}
function lpEnCard(h, M, it, lang, phone) {
  const S = (h && h.states) || {}, k = it.energy;
  if (M) { const lk = lpEnLook(h, M, it, lang, phone); if (lk) return lk; }   // seçilen görünüm (enlooks.js)
  if (M && k === 'flow') return lpEnFlowCard(h, M, it, lang);
  if (M && k === 'battery') return lpEnBatCard(h, M, it, lang);
  const F0 = M && !M.cats.length && k === 'halo' ? lpEnFlowNow(S) : null;   // cihaz yok ama güneş/şebeke sayacı var: Halo yine evin gücünü gösterir
  if (!M || (!M.cats.length && !(F0 && F0.gridKnown))) return lpEnEmpty(M, lang, k === 'halo' || k === 'cats');
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
      '<div class="enw">' + esc(wp[0]) + '<small>' + wp[1] + '</small></div><div class="enlv" style="color:' + col + '">' + esc(lpEnT(lang, 'lvl' + lvl)) + '</div></div></div>' + (it.tips === false ? '' : lpEnTipsHtml(h, M, lang)) + chips2;
  }
  if (k === 'cats') {
    const sum = M.cats.reduce((a, c) => a + (it.loose === false && c.id === '__loose' ? 0 : lpEnCatW(S, c) || 0), 0) || 1;
    let L = M.cats.map((c) => ({ c: c, w: lpEnCatW(S, c) }));
    if (L.length > 12) L = L.slice().sort((a, b) => (b.w || 0) - (a.w || 0)).slice(0, 12);
    if (it.sort === 'w') L = L.slice().sort((a, b) => (b.w || 0) - (a.w || 0));   // çok çekene göre; yoksa Kategoriler'deki sıra
    L = L.filter((x) => x.c.id !== '__loose').concat(it.loose === false ? [] : L.filter((x) => x.c.id === '__loose'));   // kategorisiz hep sonda; istenirse gizli
    // sütun: seçilmediyse kategori sayısına göre (2 → yan yana, 4 → 2×2, 6 → 3×2, fazlası 5'li); boş hücre kalmaz
    const hm0 = lpEnCfg().untracked === false ? null : lpEnHomeMeter(S, M), nT = L.length + (lpEnCfg().untracked === false ? 0 : hm0 !== null ? (hm0 - sum >= 5 ? 1 : 0) : lpEnUntracked() ? 1 : 0);
    const cols = phone ? Math.min(2, Math.max(1, nT)) : +it.cols >= 2 ? Math.min(5, +it.cols) : nT <= 3 ? Math.max(1, nT) : nT === 4 ? 2 : nT <= 6 ? 3 : nT <= 8 ? 4 : 5;
    const ch = it.chart === '7d' || it.chart === 'none' ? it.chart : '24h', rows = Math.ceil(nT / cols);
    // grafikler ortak ölçekte: hepsinin en yükseği
    let top = 0; L.forEach((x) => { const a = ch === '7d' ? (M.days ? (M.days.cats[x.c.id] || []).slice(-7) : []) : (M.hist ? M.hist.cats[x.c.id] || [] : []); a.forEach((y) => { if (y > top) top = y; }); });
    // ölçülmeyen pay (son faturadan): gri karo, anlık gücü toplamın o payı kadar varsayılır
    // ev sayacı varsa anlık: evin gücü − kategoriler; yoksa son faturadaki payla
    const uOff = lpEnCfg().untracked === false, hm = uOff ? null : lpEnHomeMeter(S, M), un = uOff || hm !== null ? 0 : lpEnUntracked();
    const uW = hm !== null ? Math.max(0, hm - sum) : un ? sum * un / (1 - un) : 0, all = sum + uW, showU = hm !== null ? uW >= 5 : !!un;
    const unT = showU ? '<div class="encat unt"><div class="ect"><span class="eci"><ha-icon icon="mdi:help-circle-outline"></ha-icon></span><span class="ecn">' + esc(lpEnT(lang, 'untracked')) + '</span></div>' +
      '<div class="ecv">' + (hm !== null ? '' : '~') + esc(lpEnWs(uW, lang)) + '<small>' + ' · ' + (lang === 'tr' ? '%' + Math.round(uW / all * 100) : Math.round(uW / all * 100) + '%') + '</small></div><div class="ecu">' + esc(lpEnT(lang, hm !== null ? 'untrackedM' : 'untrackedT')) + '</div></div>' : '';
    const tiles = L.map((x) => {
      const c = x.c, pct = x.w === null ? null : Math.round(x.w / all * 100), wp = lpEnWp(x.w, lang);
      const gr = ch === 'none' ? '' : ch === '7d' ? lpEnMini(M.days ? M.days.cats[c.id] : null, c.color, 26, top) : lpEnSpark(M.hist ? M.hist.cats[c.id] : null, c.color, 26, top);
      return '<div class="encat' + (gr ? ' bgc' : '') + (nT > 6 ? ' sm' : '') + (pct !== null && pct >= 40 ? ' hot' : '') + '" data-encat="' + esc(c.id) + '" style="--c:' + c.color + '"><div class="ect"><span class="eci"><ha-icon icon="' + esc(c.icon) + '"></ha-icon></span><span class="ecn">' + esc(c.name) + '</span></div>' +
        '<div class="ecv">' + esc(wp[0]) + '<small>' + wp[1] + (pct !== null ? '<span class="ecp"> · ' + (lang === 'tr' ? '%' + pct : pct + '%') + '</span>' : '') + '</small></div>' + gr + '</div>';
    });
    if (unT) tiles.push(unT);
    // son satır eksikse boşluğu ilk karo (en önemlisi) kapatır; kategorisiz ve ölçülmeyen küçük kalır
    const rem = phone ? 0 : tiles.length % cols;
    if (rem && tiles.length) tiles[0] = tiles[0].replace('<div class="encat', '<div style="grid-column:span ' + (cols - rem + 1) + '" class="encat');
    return '<div class="encats" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr));' + (phone ? '' : 'grid-template-rows:repeat(' + rows + ',minmax(0,1fr))') + '">' + tiles.join('') + '</div>';
  }
  if (k === 'top') {
    let L = M.devs.filter((d) => !it.cat || d.cat === it.cat).map((d) => ({ d: d, w: lpEnWOf(S, d) })).filter((x) => x.w !== null && (!it.hide_idle || x.w >= 2));
    L.sort((a, b) => b.w - a.w);
    L = L.slice(0, Math.max(3, Math.min(10, +it.count || 6)));
    if (!L.length) return '<div class="enmsg"><span>' + esc(lpEnT(lang, 'noDev')) + '</span></div>';
    const mx = L[0].w || 1, warn = {};
    lpEnTips(h, M, lang).forEach((x) => { if (x.dev) warn[x.dev] = 1; });
    return '<div class="entop">' + L.map((x) => '<div class="enrk' + (warn[x.d.id] ? ' warn' : '') + '" data-enmore="' + esc(x.d.p || '') + '" style="--c:' + x.d.color + '"><span class="eci"><ha-icon icon="' + esc(x.d.icon) + '"></ha-icon></span><div class="erb"><span class="ern">' + esc(x.d.name) + '</span>' +
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
// süre: 95 → "1 sa 35 dk"
function lpEnDur(min, lang) { const m = Math.max(1, Math.round(min)), hh = Math.floor(m / 60), mm = m % 60; return (hh ? hh + ' ' + lpEnT(lang, 'h') + (mm && hh < 10 ? ' ' : '') : '') + (mm && hh < 10 ? mm + ' ' + lpEnT(lang, 'm') : ''); }
// akış kartı: güneş üstte, şebeke solda, ev sağda, batarya altta; çizgiler o yönde güç akıyorsa hareketli
function lpEnFlowCard(h, M, it, lang) {
  const S = (h && h.states) || {}, F = M.demo ? M.flow : lpEnFlowNow(S);
  if (!F || !F.has) return '<div class="enmsg"><ha-icon icon="mdi:solar-power-variant-outline"></ha-icon><b>' + esc(lpEnT(lang, 'noSol')) + '</b><span>' + esc(lpEnT(lang, 'noSolT')) + '</span></div>';
  const P = Math.max(0, F.prod || 0), G = F.grid || 0, B = F.bat || 0, exp = Math.max(0, -G), chg = Math.max(0, B), gk = F.gridKnown;
  const sg = Math.min(P, exp), sb = Math.min(P - sg, chg), sh = Math.max(0, P - sg - sb), bh0 = Math.max(0, -B), gb = Math.max(0, chg - sb);
  const bg = Math.min(bh0, Math.max(0, exp - sg)), bh = bh0 - bg, gh = Math.max(0, Math.max(0, G) - gb);   // batarya şebekeye veriyor / şebeke bataryayı dolduruyor
  const noGrid = lpEnGridMode(lpEnSolar()) === 'none' && !lpEnMeter() && !M.demo;
  const bat = F.hasBat || F.bat !== null, sun = M.demo ? F.prod !== null : !!F.sun;
  const N = { s: [150, 30], g: [40, 104], o: [260, 104], b: [150, 172] };
  const ln = (a, b2, v, col) => { const A = N[a], Bp = N[b2], on = v >= 5; return '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + Bp[0] + '" y2="' + Bp[1] + '" class="efl' + (on ? ' on' : '') + '" style="stroke:' + col + (on ? ';animation-duration:' + Math.max(0.6, 3 - Math.log(v) / 3).toFixed(2) + 's' : '') + '"/>'; };
  let svg = '';
  if (sun) { svg += ln('s', 'o', sh, '#FFC94A') + (noGrid ? '' : ln('s', 'g', sg, '#FFC94A')); if (bat) svg += ln('s', 'b', sb, '#FFC94A'); }
  if (!noGrid) svg += F.outage ? '<line x1="' + N.g[0] + '" y1="' + N.g[1] + '" x2="' + N.o[0] + '" y2="' + N.o[1] + '" class="efl" style="stroke:#FF5A5A;opacity:.4;stroke-dasharray:3 5"/>' : ln('g', 'o', gh, '#7C9CFF');   // kesintide kopuk çizgi
  if (bat) { svg += ln('b', 'o', bh, '#3DDC84'); if (gb >= 5) svg += ln('g', 'b', gb, '#7C9CFF'); if (bg >= 5) svg += ln('b', 'g', bg, '#3DDC84'); }
  const node = (k, ic, col, lab, w, sub, ent) => '<div class="efn efn-' + k + '"' + (ent && !M.demo ? ' data-enmore="' + esc(ent) + '"' : '') + ' style="left:' + (N[k][0] / 3).toFixed(2) + '%;top:' + (N[k][1] / 2.16).toFixed(2) + '%;--c:' + col + '"><span class="efi"><ha-icon icon="' + ic + '"></ha-icon></span><span class="eft"><b>' + esc(w) + '</b><i>' + esc(lab) + (sub ? ' · ' + esc(sub) : '') + '</i></span></div>';
  const s = lpEnSolar();
  let nodes = '';
  if (sun) nodes += node('s', 'mdi:solar-power-variant', '#FFC94A', lpEnT(lang, 'nSun'), lpEnWs(P, lang), '', s.prod);
  const mt = lpEnMeter();
  if (!noGrid) nodes += F.outage ? node('g', 'mdi:transmission-tower-off', '#FF5A5A', lpEnT(lang, 'nGridOff'), lpEnT(lang, 'nGridOffT'), '', mt ? mt.volt || mt.power : s.grid || s.grid_in) : node('g', 'mdi:transmission-tower', '#7C9CFF', lpEnT(lang, F.grid === null || Math.abs(G) < 5 ? 'nGrid' : G < 0 ? 'nGridO' : 'nGridI'), F.grid === null ? '–' : lpEnWs(Math.abs(G), lang), '', mt && mt.power ? mt.power : s.grid || s.grid_in);
  nodes += node('o', 'mdi:home-lightning-bolt-outline', '#ECEDEF', lpEnT(lang, 'nHome'), gk || M.demo ? lpEnWs(F.home, lang) : '–', '', lpEnCfg().total);
  if (bat) nodes += node('b', 'mdi:home-battery-outline', '#3DDC84', lpEnT(lang, 'nBat'), F.soc === null ? lpEnWs(Math.abs(B), lang) : lpEnPct(F.soc, lang), F.bat === null || Math.abs(B) < 5 ? '' : lpEnWs(Math.abs(B), lang), s.soc || s.bat_power);
  const N2 = M.days && M.days.sun ? M.days.sun.length : 0, today = N2 ? M.days.sun[N2 - 1] : null;
  const chip = (b, t2) => '<div class="ench"><b>' + esc(b) + '</b><span>' + esc(t2) + '</span></div>';
  const chips = it.chips === false || !sun ? '' : '<div class="enchs">' + chip(today === null ? '–' : lpEnNum(today, today < 10 ? 1 : 0, lang), lpEnT(lang, 'prodT')) +
    (gk || M.demo ? chip(P > 0 ? lpEnPct((sh + sb) / P * 100, lang) : '–', lpEnT(lang, 'selfU')) + chip(lpEnWs(G < 0 ? exp : Math.max(0, G), lang), lpEnT(lang, G < 0 ? 'expN' : 'impN')) : '') + '</div>';
  return '<div class="enflow' + (bat ? '' : ' nobat') + '"><svg viewBox="0 0 300 216" preserveAspectRatio="none">' + svg + '</svg>' + nodes + '</div>' + chips;
}
function lpEnBatCard(h, M, it, lang) {
  const S = (h && h.states) || {}, F = M.demo ? M.flow : lpEnFlowNow(S);
  if (!F || !(F.hasBat || F.bat !== null)) return '<div class="enmsg"><ha-icon icon="mdi:home-battery-outline"></ha-icon><b>' + esc(lpEnT(lang, F ? 'noBat' : 'noSol')) + '</b>' + (F ? '' : '<span>' + esc(lpEnT(lang, 'noSolT')) + '</span>') + '</div>';
  const soc = F.soc, cap = F.cap, B = F.bat || 0, kwh = soc !== null && cap ? soc / 100 * cap : null;
  const st = Math.abs(B) < 5 ? 'bIdle' : B > 0 ? 'bCh' : 'bDis', col = soc === null ? '#3DDC84' : soc < 15 ? '#FF5A5A' : soc < 35 ? '#FFC94A' : '#3DDC84';
  let eta = '';
  const hrs = kwh === null || Math.abs(B) < 5 ? 0 : B > 0 ? (cap - kwh) / (B / 1000) : kwh / (-B / 1000);
  if (hrs > 0.02 && hrs <= 48 && !(B > 0 && soc >= 99.5) && !(B < 0 && soc <= 0.5)) eta = B > 0 ? lpEnT(lang, 'bFull', { t: lpEnDur((cap - kwh) / (B / 1000) * 60, lang) }) : lpEnT(lang, 'bLeft', { t: lpEnDur(kwh / (-B / 1000) * 60, lang) });
  const s = lpEnSolar();
  return '<div class="enbat"' + (s.soc && !M.demo ? ' data-enmore="' + esc(s.soc) + '"' : '') + '><div class="ebv"><b>' + (soc === null ? '–' : lang === 'tr' ? '<small>%</small>' + Math.round(soc) : Math.round(soc) + '<small>%</small>') + '</b><span style="color:' + col + '">' + esc(lpEnT(lang, st)) + (Math.abs(B) >= 5 ? ' · ' + esc(lpEnWs(Math.abs(B), lang)) : '') + '</span></div>' +
    '<div class="ebar"><i style="width:' + (soc === null ? 0 : soc).toFixed(1) + '%;background:' + col + '"></i>' + (B > 5 ? '<em></em>' : '') + '</div>' +
    '<div class="ebl"><span>' + (kwh !== null ? esc(lpEnT(lang, 'bKwh', { k: lpEnNum(kwh, 1, lang), c: lpEnNum(cap, cap % 1 ? 1 : 0, lang) })) : '') + '</span><span>' + esc(eta) + '</span></div></div>';
}
// İpuçları: bildirim yok; Halo'nun altında tek satır döner, ilgili satırın kenarı turuncu olur. Basılı tutunca o ipucu gizlenir.
// settings.energy.tips: { on, left_w (300 W), left_h (3 sa), standby_w (150 W), daily (false), daily_kwh (12), year (true), sun (true), dot (false) }
// gizlenenler: settings.energy.tips_off (yönetim paneli) ve bu cihazda localStorage
function lpEnTipCfg() { const t = lpEnCfg().tips; return t && typeof t === 'object' && !Array.isArray(t) ? t : {}; }
function lpEnTipsOff() {
  const o = {}, a = lpEnCfg().tips_off; (Array.isArray(a) ? a : []).forEach((k) => { o[k] = 1; });
  try { JSON.parse(localStorage.getItem('lhd-en-tips-off') || '[]').forEach((k) => { o[k] = 1; }); } catch (e) {}
  return o;
}
function lpEnTipHide(k) { try { const a = JSON.parse(localStorage.getItem('lhd-en-tips-off') || '[]'); if (a.indexOf(k) < 0) a.push(k); localStorage.setItem('lhd-en-tips-off', JSON.stringify(a.slice(-100))); } catch (e) {} }
function lpEnTips(h, M, lang) {
  const c = lpEnTipCfg(); if (c.on === false || !M || !M.cats || M.demo) return M && M.demo && c.on !== false ? lpEnDemoTips(M, lang) : [];
  const S = (h && h.states) || {}, off = lpEnTipsOff(), out = [], num = (k, d) => { const v = parseFloat(c[k]); return v > 0 ? v : d; };
  const add = (x) => { if (!off[x.k]) out.push(x); };
  // uzun süredir açık: son left_h saatin bütün dilimleri ve şimdiki güç left_w üstünde
  const lw = num('left_w', 300), lh = num('left_h', 3), nb = Math.max(1, Math.round(lh * 3600000 / ((M.hist && M.hist.step) || 1800000)));
  if (M.hist && M.hist.devs) M.devs.forEach((d) => {
    const a = M.hist.devs[d.id], w = lpEnWOf(S, d); if (!a || w === null || w < lw || a.length < nb) return;
    for (let i = a.length - nb; i < a.length; i++) if (a[i] === null || a[i] < lw * 0.9) return;
    add({ k: 'left:' + (d.lid || d.id), ic: 'mdi:timer-alert-outline', t: lpEnT(lang, 'tLeft', { n: d.name, h: lpEnNum(lh, lh % 1 ? 1 : 0, lang), w: lpEnWs(w, lang) }), ent: d.link || d.p, dev: d.id, pr: 1 });
  });
  // gece bekleme: 02-05 arası en düşük
  if (M.hist && M.hist.total) {
    let mn = null; M.hist.total.forEach((v, i) => { const x = new Date(M.hist.t0 + i * M.hist.step).getHours(); if (v !== null && x >= 2 && x < 5) mn = mn === null ? v : Math.min(mn, v); });
    if (mn !== null && mn > num('standby_w', 150)) add({ k: 'standby', ic: 'mdi:power-sleep', t: lpEnT(lang, 'tSb', { w: lpEnWs(mn, lang) }), ent: lpEnCfg().standby || null, pr: 3 });
  }
  const N = M.days ? M.days.t.length : 0;
  if (c.daily === true && N) { const k = lpEnDayTot(M, N - 1), d = num('daily_kwh', 12); if (k > d) add({ k: 'daily:' + new Date().toDateString(), ic: 'mdi:calendar-today', t: lpEnT(lang, 'tDay', { k: lpEnNum(k, 1, lang), d: lpEnNum(d, d % 1 ? 1 : 0, lang) }), pr: 4 }); }
  if (c.year !== false) { const yk = lpEnYear(M), yl = lpEnYearLimit(); if (yk && yk / yl >= 0.85) add({ k: 'year:' + new Date().getFullYear() + ':' + (yk >= yl ? 2 : 1), ic: 'mdi:gauge', t: lpEnT(lang, 'tYear', { p: Math.round(yk / yl * 100) }), pr: 2 }); }
  if (c.sun !== false) { const F = lpEnFlowNow(S); if (F && F.grid !== null && -F.grid >= 500) add({ k: 'sun:' + new Date().toDateString(), ic: 'mdi:solar-power-variant', t: lpEnT(lang, 'tSun', { w: lpEnWs(-F.grid, lang) }), ent: lpEnSolar().prod, pr: 5 }); }
  return out.sort((a, b) => a.pr - b.pr);
}
function lpEnDemoTips(M, lang) { const d = M.devs[0]; return [{ k: 'demo', ic: 'mdi:timer-alert-outline', t: lpEnT(lang, 'tLeft', { n: d.name, h: '3', w: lpEnWs(d.w, lang) }), dev: d.id, pr: 1 }]; }
// Halo'nun altındaki satır: hepsi üst üste, biri görünür (panel 6 sn'de bir sıradakine geçer)
function lpEnTipsHtml(h, M, lang) {
  const L = lpEnTips(h, M, lang); if (!L.length) return '';
  return '<div class="entips" title="' + esc(lpEnT(lang, 'tHide')) + '">' + L.map((x, i) => '<div class="entip' + (i ? '' : ' on') + '" data-entip="' + esc(x.k) + '"' + (x.ent ? ' data-tipent="' + esc(x.ent) + '"' : '') + '><ha-icon icon="' + esc(x.ic) + '"></ha-icon><span>' + esc(x.t) + '</span>' + (L.length > 1 ? '<i>' + (i + 1) + '/' + L.length + '</i>' : '') + '</div>').join('') + '</div>';
}
function lpEnLegend(M) { const L = M.cats.slice(0, 10); return '<div class="enlg">' + L.map((c) => '<span><i style="background:' + c.color + '"></i>' + esc(c.name) + '</span>').join('') + (M.cats.length > L.length ? '<span>+' + (M.cats.length - L.length) + '</span>' : '') + '</div>'; }
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
  const T = (k) => upper(lang, lpEnT(lang, 's_' + k)), sol = lpEnSolar();
  const t = { id: id, name: lang === 'tr' ? 'Enerji' : 'Energy', icon: 'mdi:lightning-bolt', area: null, v: 2, columns: [30, 40, 30], sections: [
    { id: id + '-h', type: 'energy', title: T('halo'), col: 0, grow: 3, entities: [{ energy: 'halo' }] },
    { id: id + '-b', type: 'energy', title: T('standby'), col: 0, entities: [{ energy: 'standby' }] },
    { id: id + '-c', type: 'energy', title: T('cats'), col: 1, grow: 3, entities: [{ energy: 'cats' }] },
    { id: id + '-w', type: 'energy', title: T('week'), col: 1, grow: 2, entities: [{ energy: 'week' }] },
    { id: id + '-t', type: 'energy', title: T('top'), col: 2, grow: 3, entities: [{ energy: 'top' }] },
    { id: id + '-d', type: 'energy', title: T('day'), col: 2, grow: 2, entities: [{ energy: 'day' }] }
  ] };
  // güneşli evde akış kartı soldaki kolonda, bekleme yerine (batarya doluluğu akışta da görünür; ayrı kart + Enerji kartı'ndan)
  if (lpEnSunOn(sol) || lpEnBatOn(sol)) t.sections[1] = { id: id + '-f', type: 'energy', title: T('flow'), col: 0, grow: 2, entities: [{ energy: 'flow' }] };
  return t;
}
// ---- enerji değerleri başka bölümlerde (v0.28.2): ışık karosu, senaryo düğmesi ya da değer satırı gibi durur ----
// Panelin hesapladığı değerler sanal sensör olarak hass.states'e eklenir (sensor.lhdx_*); Home Assistant'ta yoktur.
// Değerler öğesi gibi eklenir (Cihaz ekle → Değerler), bütün görünümleri (karo, düğme, satır, halo) ve boyutları kullanır.
const LP_EN_VIRT = [
  ['ev', 'mdi:home-lightning-bolt-outline', 'power', 'W'], ['bugun', 'mdi:calendar-today', 'energy', 'kWh'], ['bugun_tl', 'mdi:cash', 'monetary', '$'],
  ['ay_tl', 'mdi:cash-multiple', 'monetary', '$'], ['ay_kwh', 'mdi:counter', 'energy', 'kWh'], ['donem_sonu', 'mdi:calendar-end', 'monetary', '$'],
  ['yil', 'mdi:gauge', null, '%'], ['olcmeyen', 'mdi:help-circle-outline', 'power', 'W']
];
const LP_EN_VN = {
  tr: { ev: 'Ev şu an', bugun: 'Bugün', bugun_tl: 'Bugünkü tutar', ay_tl: 'Bu ayın tutarı', ay_kwh: 'Bu dönem', donem_sonu: 'Dönem sonu tahmini', yil: 'Yıllık sınır', olcmeyen: 'Ölçülmeyen' },
  en: { ev: 'Home now', bugun: 'Today', bugun_tl: 'Today\'s cost', ay_tl: 'This month\'s cost', ay_kwh: 'This period', donem_sonu: 'Period end estimate', yil: 'Yearly limit', olcmeyen: 'Not measured' }
};
const lpEnIsVirt = (id) => typeof id === 'string' && id.indexOf('sensor.lhdx_') === 0;
// değerler (yüklü enerji verisinden); veri yoksa boş
function lpEnVirtVals(h) {
  const M = LP_EN.m; if (!M || M.demo || !M.cats) return null;
  const S = (h && h.states) || {}, out = {}, N = M.days ? M.days.t.length : 0, price = lpEnUnit(M);
  const tot = lpEnTotal(S, M); if (tot !== null && tot !== undefined) out.ev = Math.round(tot);
  const tk = N ? lpEnDayTot(M, N - 1) : null; if (tk !== null) out.bugun = Math.round(tk * 100) / 100;
  if (M.days && price) {
    const mk = lpEnMonthKwh(M), md = lpEnMonthDays(), mc = lpEnMonthCost(mk, md, M), P = lpEnPeriod(), D = 86400000;
    const from = P ? P.from : (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d.getTime(); })(), el = Math.max(1, (Date.now() - from) / D);
    out.ay_tl = Math.round(mc.tl); out.ay_kwh = Math.round(mk);
    out.donem_sonu = Math.round(lpEnMonthCost(mk / el * md, md, M).tl);
    if (tk !== null) out.bugun_tl = Math.round((lpEnMode() === 'tier' ? mc.tl - lpEnMonthCost(Math.max(0, mk - tk), md, M).tl : tk * price) * 100) / 100;
  }
  const yk = lpEnYear(M); if (yk) out.yil = Math.round(yk / lpEnYearLimit() * 100);
  try { const C = lpElCtx(h, M, pickLang(h)); if (C.unt > 0) out.olcmeyen = Math.round(C.unt); } catch (e) {}
  return out;
}
// cihazın alanı (oda): bağlı varlığın ya da güç sensörünün alanı, yoksa cihazının alanı
function lpEnAreaOf(h, d) {
  const E = (h && h.entities) || {}, D = (h && h.devices) || {};
  const ids = [d.link, d.p, d.e];
  for (let i = 0; i < ids.length; i++) {
    const r = ids[i] && E[ids[i]]; if (!r) continue;
    if (r.area_id) return r.area_id;
    const dv = r.device_id && D[r.device_id]; if (dv && dv.area_id) return dv.area_id;
  }
  return null;
}
// odaların enerjisi: şu anki güç (W) ve bugünkü tüketim (kWh, son 24 saatin kaydından gece yarısından beri)
function lpEnRooms(h) {
  const M = LP_EN.m; if (!M || M.demo || !M.devs || !M.devs.length) return {};
  const S = (h && h.states) || {}, out = {}, H = M.hist, mid = new Date(); mid.setHours(0, 0, 0, 0);
  M.devs.forEach((d) => {
    const a = lpEnAreaOf(h, d); if (!a) return;
    const o = out[a] || (out[a] = { w: null, kwh: null, n: 0 }); o.n++;
    const w = lpEnWOf(S, d); if (w !== null) o.w = (o.w || 0) + w;
    const ser = H && H.devs && H.devs[d.id];
    if (ser) { let k = 0, any = false; ser.forEach((v, i) => { if (v !== null && v !== undefined && H.t0 + (i + 1) * H.step > mid.getTime()) { k += v * H.step / 3600000000; any = true; } }); if (any) o.kwh = (o.kwh || 0) + k; }
  });
  return out;
}
// Halo kartında enerji değerinin altındaki kutular (iklim kartının alt satırı gibi): ilgili öteki değerler
const LP_EN_HX = { ev: ['bugun', 'bugun_tl', 'ay_tl'], bugun: ['bugun_tl', 'ay_kwh', 'ay_tl'], bugun_tl: ['bugun', 'ay_tl', 'donem_sonu'], ay_tl: ['ay_kwh', 'donem_sonu', 'yil'],
  ay_kwh: ['ay_tl', 'donem_sonu', 'yil'], donem_sonu: ['ay_tl', 'ay_kwh', 'yil'], yil: ['ay_kwh', 'ay_tl', 'bugun'], olcmeyen: ['ev', 'bugun'] };
function lpEnHaloExtra(id, S) {
  const ok = (x) => S[x] && S[x].state !== 'unavailable' && S[x].state !== 'unknown';
  const m = /^sensor\.lhdx_oda_(.+)_(guc|bugun)$/.exec(id);
  if (m) return ['sensor.lhdx_oda_' + m[1] + '_' + (m[2] === 'guc' ? 'bugun' : 'guc'), 'sensor.lhdx_ev'].filter(ok);
  return (LP_EN_HX[id.slice(12)] || []).map((k) => 'sensor.lhdx_' + k).filter(ok);
}
const lpEnRoomId = (a, k) => 'sensor.lhdx_oda_' + String(a).replace(/[^a-z0-9_]/gi, '_').toLowerCase() + '_' + k;
// hass'ın kopyası, sanal sensörlerle (aynı değer aynı nesne: panel boşuna yeniden çizmesin)
function lpEnVirt(h) {
  if (!h || !h.states) return h;
  const V = lpEnVirtVals(h), lang = pickLang(h), cur = lpEnMoney(h, 1, lang).replace(/[\d.,\s\u00a0]/g, '') || (h.config && h.config.currency) || 'TRY', add = {}, C = LP_EN.vs || (LP_EN.vs = {});
  LP_EN_VIRT.forEach((x) => {
    const id = 'sensor.lhdx_' + x[0], v = V && V[x[0]] !== undefined ? String(V[x[0]]) : 'unavailable', o = C[id];
    if (o && o.state === v && o._l === lang) { add[id] = o; return; }
    const a = { friendly_name: (LP_EN_VN[lang === 'tr' ? 'tr' : 'en'] || LP_EN_VN.en)[x[0]], icon: x[1], unit_of_measurement: x[3] === '$' ? cur : x[3], lhd_energy: true };
    if (x[2]) a.device_class = x[2];
    const now = new Date().toISOString();
    C[id] = add[id] = { entity_id: id, state: v, attributes: a, last_changed: now, last_updated: now, context: { id: '' }, _l: lang };
  });
  // odalar: her alan için şu an ve bugün
  const R = lpEnRooms(h), AR = h.areas || {}, tr = lang === 'tr';
  Object.keys(R).forEach((a) => {
    const an = (AR[a] && AR[a].name) || a, r = R[a];
    [['guc', r.w === null ? 'unavailable' : String(Math.round(r.w)), 'power', 'W', tr ? an + ' şu an' : an + ' now', 'mdi:lightning-bolt-outline'],
      ['bugun', r.kwh === null ? 'unavailable' : String(Math.round(r.kwh * 100) / 100), 'energy', 'kWh', tr ? an + ' bugün' : an + ' today', 'mdi:calendar-today']].forEach((x) => {
      const id = lpEnRoomId(a, x[0]), o = C[id];
      if (o && o.state === x[1] && o._l === lang && o.attributes.friendly_name === x[4]) { add[id] = o; return; }
      const now = new Date().toISOString();
      C[id] = add[id] = { entity_id: id, state: x[1], attributes: { friendly_name: x[4], icon: x[5], unit_of_measurement: x[3], device_class: x[2], lhd_energy: true, lhd_area: a }, last_changed: now, last_updated: now, context: { id: '' }, _l: lang };
    });
  });
  return Object.assign({}, h, { states: Object.assign({}, h.states, add) });
}
