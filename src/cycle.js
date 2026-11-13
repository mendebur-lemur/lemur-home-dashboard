// Çalışıyor / Bitti takibi (bulaşık, çamaşır, kurutma makinesi, fırın): akıllı prizin gücünden makinenin çalıştığı ve bittiği.
// Kararı entegrasyon verir (custom_components/.../cycle.py); burada yalnız görünüm ve ayarlar:
//   sensor.lhd_<id>_cycle   idle | running | done; öznitelikler: started, finished, elapsed (dk), energy_kwh, cost, duration,
//                           cycle_count, avg_minutes, phase (tail: kurutuyor), emptied_button, device, device_name, kind
//   button.lhd_<id>_emptied Bitti → Boş ("Boşaltıldı")
// Ayar: estimates[id].cycle = { on, kind, start_w, start_min, end_w, end_min, tail, tail_w, tail_min, min_kwh, max_h, door, clear_h,
//   notify: { on, targets, msg, remind_h } }; basit modda yalnız tür seçilir, eşikler gelişmiş modda.
// Kart: Halo görünümü (hazır görünüm lpCyItem: Boş gri sabit, Çalışıyor mavi yavaş nefes, Bitti yeşil çerçeveli). Kartın alt
// satırı "Çalışıyor · 32 dk" / "Bitti · 14:05"; dokununca Bitti'yken Boşaltıldı düğmesi (tek servis çağrısı), değilken cihazın
// enerji penceresi; basılı tutunca cihaz penceresi. Satır ve karo görünümünde de aynı yazı (lpValText).
// Eski Safari için ?. ve ?? yok.

const LP_CY_KINDS = ['dishwasher', 'washer', 'dryer', 'washer_dryer', 'other'];
// cycle.py PRESETS ile aynı (değiştirince ikisini birden)
const LP_CY_PRE = {
  dishwasher: { start_w: 80, start_min: 2, end_w: 20, end_min: 8, tail: true, tail_w: 1.2, tail_min: 60, min_kwh: 0.15, max_h: 5 },
  washer: { start_w: 50, start_min: 2, end_w: 12, end_min: 10, tail: false, tail_w: 1.2, tail_min: 30, min_kwh: 0.05, max_h: 6 },
  dryer: { start_w: 80, start_min: 2, end_w: 30, end_min: 5, tail: false, tail_w: 1.2, tail_min: 30, min_kwh: 0.2, max_h: 5 },
  washer_dryer: { start_w: 50, start_min: 2, end_w: 25, end_min: 15, tail: false, tail_w: 1.2, tail_min: 30, min_kwh: 0.1, max_h: 8 },
  other: { start_w: 30, start_min: 1, end_w: 10, end_min: 10, tail: false, tail_w: 1.2, tail_min: 30, min_kwh: 0.02, max_h: 12 }
};
// sayı alanları: [anahtar, en az, en çok, adım] (Python şeması CYCLE_SCHEMA ile aynı sınırlar)
const LP_CY_NUM = [['start_w', 1, 5000, 1], ['start_min', 0.5, 30, 0.5], ['end_w', 0.5, 2000, 1], ['end_min', 1, 120, 1], ['tail_w', 0.2, 50, 0.1], ['tail_min', 1, 240, 1], ['min_kwh', 0, 20, 0.01], ['max_h', 0.5, 48, 0.5]];
const LP_CY_IC = { dishwasher: 'mdi:dishwasher', washer: 'mdi:washing-machine', dryer: 'mdi:tumble-dryer', washer_dryer: 'mdi:washing-machine', other: 'mdi:stove' };
const LP_CY_TXT = {
  tr: {
    idle: 'Boş', running: 'Çalışıyor', done: 'Bitti', drying: 'Kurutuyor', yest: 'dün',
    min: '{m} dk', hm: '{h} sa {m} dk', h: '{h} sa',
    k_dishwasher: 'Bulaşık makinesi', k_washer: 'Çamaşır makinesi', k_dryer: 'Kurutma makinesi', k_washer_dryer: 'Kurutmalı çamaşır', k_other: 'Fırın ya da diğer',
    n_dishwasher: 'yıkama', n_washer: 'yıkama', n_dryer: 'kurutma', n_washer_dryer: 'çalışma', n_other: 'çalışma',
    n1_dishwasher: 'yıkama', n1_washer: 'yıkama', n1_dryer: 'kurutma', n1_washer_dryer: 'çalışma', n1_other: 'çalışma',
    title: 'Çalışıyor / Bitti', onL: 'Çalışıp bittiğini takip et', onT: 'Priz, makinenin gücünden anlar. "Bitti", makine durduktan birkaç dakika sonra görünür ve sen boşaltana kadar kalır.',
    needSensor: 'Önce yukarıdan güç sensörünü seç.', kindL: 'Ne tür bir makine?',
    sum: 'Çalışıyor: {sm} boyunca {sw} W üstü · Bitti: {em} boyunca {ew} W altı', sumTail: ' · kurutmayı bekler (en çok {tm})', sumT: 'Hepsi prizin boştaki değerine göre ({b} W); paylaşılan prizde de çalışır.',
    sug: 'Geçmişten öner', sugBusy: 'Geçmiş okunuyor…', sugNone: 'Bu sensörün geçmişi yok. Hazır ayarlar kalıyor; makine ilk kez çalışınca kendiliğinden öğrenir.',
    sugZero: 'Son {d} günde {n} bulunamadı. Hazır ayarlar kalıyor.', sugFound: 'Son {d} günde {c} {n} bulundu: ~{m}, ~{k} kWh', sugBase: 'Boştayken ~{b} W',
    sugTune: 'Önerilen ayar', sugApply: 'Uygula', sugKeep: 'Hazır ayarlar bu makineye uyuyor.', sugApplied: 'Uygulandı; kaydetmeyi unutma.', sugErr: 'Geçmiş okunamadı: {e}',
    t_end_min: 'Bitiş bekleme {v} dk', t_min_kwh: 'En az {v} kWh', t_start_w: 'Başlama {v} W',
    card: 'Panoya durum kartı ekle', cardT: 'Halo kartı: Boş, Çalışıyor (süreyle), Bitti (çerçeveli). Bitti\'yken dokununca boşaltıldı sayılır.', cardTab: 'Sekme', cardSec: 'Bölüm', cardAdd: 'Ekle', cardAdded: 'Kart "{s}" bölümüne eklendi', cardSave: 'Kaydedince panoya ekleyebilirsin.', cardNoSec: 'Bu sekmede bölüm yok',
    nTitle: 'Bildirim', nOn: 'Bitince bildirim gönder', nOnT: 'Her çalışmada bir kez.', nTo: 'Kime', nNone: 'Home Assistant\'ta bildirim servisi bulunamadı (ör. telefondaki uygulama).', nMsg: 'Mesaj', nMsgT: 'Boş bırakırsan: {ex}. Yazılabilenler: {name}, {duration}, {kwh}, {cost}, {time}.',
    nEnt: 'varlık', nSvc: 'servis', nPers: 'Home Assistant bildirimleri', nTest: 'Deneme gönder', nTestBusy: 'Gönderiliyor…', nTestOk: 'Gönderildi: {m}', nTestBad: '{t} gönderilemedi: {e}', nPick: 'Önce kime gideceğini seç.',
    nRem: 'Boşaltılmazsa hatırlat', nRemOff: 'Hatırlatma yok', nRemH: '{h} saat sonra',
    adv: 'Eşikler', advT: 'Boş bırakılan alan türün hazır değerini kullanır. Hepsi prizin boştaki değerinin üstü.',
    f_start_w: 'Başlama (W üstü)', f_start_min: 'Başlama süresi (dk)', f_end_w: 'Bitiş (W altı)', f_end_min: 'Bitiş bekleme (dk)', f_tail_w: 'Kurutma (W üstü)', f_tail_min: 'Kurutma en çok (dk)', f_min_kwh: 'En az enerji (kWh)', f_max_h: 'En uzun (saat)',
    tailL: 'Kurutmayı bekle', tailT: 'Ana yıkamadan sonra 2-5 W ile kurutan makinede "Bitti" kurutma bitince gelir.',
    door: 'Kapı sensörü (isteğe bağlı)', doorNone: 'Kapı sensörü yok', doorT: 'Bitti\'den sonra kapı açılınca boşaltıldı sayılır.',
    clear: 'Bitti kendiliğinden kalksın', clearOff: 'Hiç (boşaltınca)', clearH: '{h} saat sonra',
    bad: '{f}: {a} ile {b} arasında olmalı', ents: 'Home Assistant\'ta: {s} (Boş / Çalışıyor / Bitti) ve {b} (Boşaltıldı)',
    winNow: 'Şu an', winLast: 'Son {n}', winCost: 'tutar', winCount: 'ortalama · {c} {n}'
  },
  en: {
    idle: 'Idle', running: 'Running', done: 'Finished', drying: 'Drying', yest: 'yesterday',
    min: '{m} min', hm: '{h} h {m} min', h: '{h} h',
    k_dishwasher: 'Dishwasher', k_washer: 'Washing machine', k_dryer: 'Tumble dryer', k_washer_dryer: 'Washer-dryer', k_other: 'Oven or other',
    n_dishwasher: 'washes', n_washer: 'washes', n_dryer: 'drying cycles', n_washer_dryer: 'cycles', n_other: 'cycles',
    n1_dishwasher: 'wash', n1_washer: 'wash', n1_dryer: 'drying cycle', n1_washer_dryer: 'cycle', n1_other: 'cycle',
    title: 'Running / Finished', onL: 'Track when it runs and finishes', onT: 'The plug tells from the machine\'s power. "Finished" shows a few minutes after the machine stops and stays until you empty it.',
    needSensor: 'Pick the power sensor above first.', kindL: 'What kind of machine?',
    sum: 'Running: above {sw} W for {sm} · Finished: below {ew} W for {em}', sumTail: ' · waits for the drying (at most {tm})', sumT: 'All above the plug\'s idle reading ({b} W); works on a shared plug too.',
    sug: 'Suggest from history', sugBusy: 'Reading the history…', sugNone: 'This sensor has no history. The presets stay; it learns by itself the first time the machine runs.',
    sugZero: 'No {n} found in the last {d} days. The presets stay.', sugFound: '{c} {n} found in the last {d} days: ~{m}, ~{k} kWh', sugBase: 'Idle at ~{b} W',
    sugTune: 'Suggested', sugApply: 'Apply', sugKeep: 'The presets fit this machine.', sugApplied: 'Applied; remember to save.', sugErr: 'Could not read the history: {e}',
    t_end_min: 'End wait {v} min', t_min_kwh: 'At least {v} kWh', t_start_w: 'Start {v} W',
    card: 'Add a status card to the dashboard', cardT: 'Halo card: Idle, Running (with the time), Finished (framed). Tapping it while finished marks it emptied.', cardTab: 'Tab', cardSec: 'Section', cardAdd: 'Add', cardAdded: 'Card added to "{s}"', cardSave: 'Save first, then add it to the dashboard.', cardNoSec: 'This tab has no sections',
    nTitle: 'Notification', nOn: 'Notify when finished', nOnT: 'Once per cycle.', nTo: 'To', nNone: 'No notification service found in Home Assistant (e.g. the phone app).', nMsg: 'Message', nMsgT: 'Left empty: {ex}. You can use {name}, {duration}, {kwh}, {cost}, {time}.',
    nEnt: 'entity', nSvc: 'service', nPers: 'Home Assistant notifications', nTest: 'Send a test', nTestBusy: 'Sending…', nTestOk: 'Sent: {m}', nTestBad: '{t} failed: {e}', nPick: 'Pick who gets it first.',
    nRem: 'Remind if not emptied', nRemOff: 'No reminder', nRemH: 'after {h} h',
    adv: 'Thresholds', advT: 'An empty field uses the kind\'s preset. All are above the plug\'s idle reading.',
    f_start_w: 'Start (W above)', f_start_min: 'Start time (min)', f_end_w: 'End (W below)', f_end_min: 'End wait (min)', f_tail_w: 'Drying (W above)', f_tail_min: 'Drying at most (min)', f_min_kwh: 'Least energy (kWh)', f_max_h: 'Longest (hours)',
    tailL: 'Wait for the drying', tailT: 'For a machine that dries at 2-5 W after the wash, "Finished" comes when the drying ends.',
    door: 'Door sensor (optional)', doorNone: 'No door sensor', doorT: 'Opening the door after it finished marks it emptied.',
    clear: 'Clear Finished by itself', clearOff: 'Never (when emptied)', clearH: 'after {h} h',
    bad: '{f}: must be between {a} and {b}', ents: 'In Home Assistant: {s} (Idle / Running / Finished) and {b} (Emptied)',
    winNow: 'Now', winLast: 'Last {n}', winCost: 'cost', winCount: 'average · {c} {n}'
  }
};
function lpCyT(lang, k, v) {
  const d = LP_CY_TXT[lang] || LP_CY_TXT.en;
  let s = d[k] !== undefined ? d[k] : (LP_CY_TXT.en[k] !== undefined ? LP_CY_TXT.en[k] : k);
  if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); });
  return s;
}
const lpCyIs = (st) => !!(st && st.attributes && st.attributes.lhd_cycle === true);
const lpCyNum = (v, d, lang) => (typeof lpEnNum === 'function' ? lpEnNum(v, d, lang) : String(Math.round(v * Math.pow(10, d)) / Math.pow(10, d)));
// süre: "32 dk", "1 sa 12 dk"
function lpCyDur(min, lang) {
  const m = Math.max(0, Math.round(+min || 0));
  if (m < 60) return lpCyT(lang, 'min', { m: m });
  return m % 60 ? lpCyT(lang, 'hm', { h: Math.floor(m / 60), m: m % 60 }) : lpCyT(lang, 'h', { h: m / 60 });
}
// bitiş saati: 24 saat (HA'da açıkça 12 saat seçilmediyse); dün bittiyse "dün 22:40", daha eskiyse gün ve ay
function lpCyTime(iso, h, lang) {
  const t = Date.parse(iso || ''); if (isNaN(t)) return '';
  const d = new Date(t), now = new Date(), p = (n) => ('0' + n).slice(-2);
  const hm = typeof lpAmPm === 'function' && lpAmPm(h) ? (d.getHours() % 12 || 12) + ':' + p(d.getMinutes()) + ' ' + (d.getHours() < 12 ? 'AM' : 'PM') : p(d.getHours()) + ':' + p(d.getMinutes());
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(), dd = Math.round((day(now) - day(d)) / 86400000);
  if (dd <= 0) return hm;
  if (dd === 1) return lpCyT(lang, 'yest') + ' ' + hm;
  try { return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' }) + ' ' + hm; } catch (e) { return hm; }
}
// kartın yazısı: "Boş", "Çalışıyor · 32 dk", "Kurutuyor · 58 dk", "Bitti · 14:05"
function lpCyLabel(h, st, lang) {
  const a = (st && st.attributes) || {}, s = st ? st.state : '';
  if (s === 'running') {
    let el = typeof a.elapsed === 'number' ? a.elapsed : null;
    if (el === null && a.started) { const t = Date.parse(a.started); if (!isNaN(t)) el = (Date.now() - t) / 60000; }
    const w = a.phase === 'tail' && a.kind === 'dishwasher' ? lpCyT(lang, 'drying') : lpCyT(lang, 'running');
    return el !== null ? w + ' · ' + lpCyDur(el, lang) : w;
  }
  if (s === 'done') { const tm = lpCyTime(a.finished, h, lang); return lpCyT(lang, 'done') + (tm ? ' · ' + tm : ''); }
  if (s === 'idle') return lpCyT(lang, 'idle');
  return null;
}
// Halo kartına verilen hass: durum sensörünün değeri yazıyla (kartın kendisi değiştirilmez, vendor/); diğer her şey asıl hass'tan
function lpCyHass(h, id, lang) {
  const st = h && h.states ? h.states[id] : null, lab = lpCyIs(st) ? lpCyLabel(h, st, lang) : null;
  if (!lab) return h;
  const C = lpCyHass.c || (lpCyHass.c = {}), k = id + '|' + lang, o = C[k];
  let s2 = o && o.src === st && o.lab === lab ? o.st : null;
  if (!s2) { s2 = Object.assign({}, st, { state: lab }); C[k] = { src: st, lab: lab, st: s2 }; }
  const S = Object.create(h.states); S[id] = s2;
  const H = Object.create(h); H.states = S;
  return H;
}
// hazır görünüm: panoya eklenen durum kartı (yönetim panelinde Ekle listesi ve cihaz düzenleyicideki "Panoya durum kartı ekle")
function lpCyItem(id) {
  return { entity: id, look: 'halo', state_colors: { map: { idle: { color: 'grey', effect: 'still' }, running: { color: 'blue', effect: 'breathe' }, done: { color: 'green', effect: 'breathe', frame: true } } } };
}
// karta dokununca: Bitti'yken Boşaltıldı (tek servis çağrısı), değilken cihazın enerji penceresi (yoksa cihaz penceresi). hold (basılı tut): hep pencere
function lpCyTap(card, id, hold) {
  const h = card._hass, st = h && h.states[id]; if (!st) return;
  const a = st.attributes || {};
  if (st.state === 'done' && !hold) { if (a.emptied_button && h.states[a.emptied_button]) h.callService('button', 'press', { entity_id: a.emptied_button }); return; }
  const dev = () => { const M = typeof lpEnGet === 'function' ? lpEnGet(h, card._lang) : null; return M && M.devs ? M.devs.filter((x) => x.lid === a.device)[0] : null; };
  const open = (d) => { if (d && typeof card._enOpen === 'function') card._enOpen({ k: 'dev', id: d.id }); else lpFire(card, 'hass-more-info', { entityId: id }); };
  const d0 = dev(); if (d0 || typeof lpEnSub !== 'function' || (LP_EN.m && !LP_EN.busy)) { open(d0); return; }
  // enerji verisi henüz yüklenmedi (panoda enerji kartı yok): gelince pencere açılır, 1,5 sn içinde gelmezse cihaz penceresi
  let fin = false; const un = lpEnSub(() => { const d = dev(); if (fin || !d) return; fin = true; un(); open(d); });
  setTimeout(() => { if (fin) return; fin = true; un(); open(dev()); }, 1500);
}
// enerji penceresi (cihaz): şu anki durum ve son çalışma (süre, kWh, tutar)
function lpCyDevHtml(h, d, lang) {
  const S = (h && h.states) || {}, id = 'sensor.lhd_' + (d && d.lid) + '_cycle', st = S[id];
  if (!d || !d.lid || !lpCyIs(st)) return '';
  const a = st.attributes, n = lpCyT(lang, 'n_' + (a.kind || 'other')), stats = [];
  const lab = lpCyLabel(h, st, lang) || st.state;
  stats.push(lpExStat(lab, st.state === 'running' && typeof a.energy_kwh === 'number' ? lpCyT(lang, 'winNow') + ' · ' + lpExK(a.energy_kwh, lang) + ' kWh' : lpCyT(lang, 'winNow')));
  // son çalışma: süre ve kWh, altında tutar (tarife girildiyse)
  if (st.state !== 'running' && typeof a.duration === 'number') stats.push(lpExStat(lpCyDur(a.duration, lang) + ' · ' + lpExK(a.energy_kwh || 0, lang) + ' kWh', lpCyT(lang, 'winLast', { n: lpCyT(lang, 'n1_' + (a.kind || 'other')) }) + (a.cost ? ' · ' + lpEnMoney(h, a.cost, lang) : '')));
  else if (a.cycle_count) stats.push(lpExStat(lpCyDur(a.avg_minutes || 0, lang), lpCyT(lang, 'winCount', { c: a.cycle_count, n: n, m: '' }).replace(/,\s*$/, '')));
  return '<div class="exstats excy" data-ency="' + esc(id) + '">' + stats.join('') + '</div>';
}

// ---- yönetim paneli: cihaz düzenleyicide (Kendi ölçüyor) ayarlar ----
function lpCyDraft(e) {
  const c = e && lhdIsObj(e.cycle) ? e.cycle : null, n = c && lhdIsObj(c.notify) ? c.notify : {};
  const kind = c && LP_CY_PRE[c.kind] ? c.kind : 'dishwasher', v = {};
  LP_CY_NUM.forEach((x) => { v[x[0]] = c && typeof c[x[0]] === 'number' ? String(c[x[0]]) : ''; });
  return { on: !!(c && c.on), had: !!c, kind: kind, v: v, tail: c && typeof c.tail === 'boolean' ? c.tail : null, door: (c && c.door) || '', clear_h: c && c.clear_h > 0 ? String(c.clear_h) : '',
    n: { on: !!n.on, targets: Array.isArray(n.targets) ? n.targets.slice() : [], msg: typeof n.msg === 'string' ? n.msg : '', remind_h: n.remind_h > 0 ? String(n.remind_h) : '' }, sug: null, test: null, tab: '', sec: '' };
}
const lpCyF = (v) => { const s = String(v === undefined || v === null ? '' : v).trim().replace(',', '.'); return s === '' ? null : /^\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN; };
// kaydedilecek cycle bloğu (null: hiç açılmadı)
function lpCyRec(cy) {
  if (!cy || (!cy.on && !cy.had)) return null;
  const P = LP_CY_PRE[cy.kind] || LP_CY_PRE.other, out = { on: !!cy.on, kind: LP_CY_PRE[cy.kind] ? cy.kind : 'other' };
  LP_CY_NUM.forEach((x) => { const v = lpCyF(cy.v[x[0]]); if (v !== null && !isNaN(v) && v !== P[x[0]]) out[x[0]] = v; });
  if (typeof cy.tail === 'boolean' && cy.tail !== P.tail) out.tail = cy.tail;
  if (/^binary_sensor\.[a-z0-9_]+$/.test(cy.door || '')) out.door = cy.door;
  const ch = lpCyF(cy.clear_h); if (ch > 0) out.clear_h = ch;
  const n = cy.n || {}, rh = lpCyF(n.remind_h), tg = (n.targets || []).filter((x) => /^notify\.[a-z0-9_]+$/.test(x)).slice(0, 10), msg = String(n.msg || '').trim().slice(0, 200);
  if (n.on || tg.length || msg || rh > 0) { out.notify = { on: !!n.on, targets: tg }; if (msg) out.notify.msg = msg; if (rh > 0) out.notify.remind_h = rh; }
  return out;
}
// yanlış sayı: neyin yanlış olduğu yazılır (Python şemasıyla aynı sınırlar)
function lpCyBad(cy, lang) {
  if (!cy || !cy.on) return '';
  for (let i = 0; i < LP_CY_NUM.length; i++) {
    const x = LP_CY_NUM[i], v = lpCyF(cy.v[x[0]]);
    if (v !== null && (isNaN(v) || v < x[1] || v > x[2])) return lpCyT(lang, 'bad', { f: lpCyT(lang, 'f_' + x[0]), a: lpCyNum(x[1], 2, lang), b: lpCyNum(x[2], 0, lang) });
  }
  const ch = lpCyF(cy.clear_h), rh = lpCyF((cy.n || {}).remind_h);
  if (ch !== null && (isNaN(ch) || ch > 168)) return lpCyT(lang, 'bad', { f: lpCyT(lang, 'clear'), a: 0, b: 168 });
  if (rh !== null && (isNaN(rh) || rh > 48)) return lpCyT(lang, 'bad', { f: lpCyT(lang, 'nRem'), a: 0, b: 48 });
  return '';
}
// Home Assistant'ın bildirim hedefleri: notify varlıkları (notify.send_message ile) ve eski notify.<ad> servisleri
function lpCyTargets(h) {
  const S = (h && h.states) || {}, out = [], seen = {};
  Object.keys(S).filter((x) => x.indexOf('notify.') === 0).sort().forEach((x) => { seen[x] = 1; out.push({ id: x, name: (S[x].attributes && S[x].attributes.friendly_name) || x, ent: true }); });
  Object.keys((h && h.services && h.services.notify) || {}).sort().forEach((s) => {
    const id = 'notify.' + s; if (s === 'send_message' || seen[id] || !/^[a-z0-9_]+$/.test(s)) return;
    const nm = s === 'persistent_notification' ? lpCyT(pickLang(h), 'nPers') : s.replace(/^mobile_app_/, '').replace(/_/g, ' ');
    out.push({ id: id, name: nm.charAt(0).toUpperCase() + nm.slice(1), ent: false });
  });
  return out;
}
const lpCyVal = (cy, k) => { const v = lpCyF(cy.v[k]); return v !== null && !isNaN(v) ? v : (LP_CY_PRE[cy.kind] || LP_CY_PRE.other)[k]; };
function lpCySugHtml(A, cy) {
  const L = A._lang, s = cy.sug, t = (k, v) => esc(lpCyT(L, k, v)); if (!s) return '';
  if (s.busy) return '<div class="hint ency-sr">' + t('sugBusy') + '</div>';
  if (s.err) return '<div class="hint ency-sr enwarn">' + t('sugErr', { e: s.err }) + '</div>';
  const r = s.res || {}, n = lpCyT(L, 'n_' + cy.kind);
  if (!r.days) return '<div class="hint ency-sr">' + t('sugNone') + '</div>';
  if (!(r.cycles || []).length) return '<div class="hint ency-sr">' + t('sugZero', { d: r.days, n: n }) + (r.base !== null && r.base !== undefined ? ' ' + t('sugBase', { b: lpCyNum(r.base, 1, L) }) : '') + '</div>';
  let h = '<div class="ency-sr ok"><b>' + t('sugFound', { d: r.days, c: r.cycles.length, n: r.cycles.length === 1 ? lpCyT(L, 'n1_' + cy.kind) : n, m: lpCyDur(r.avg_min, L), k: lpCyNum(r.avg_kwh, 2, L) }) + '</b>' +
    '<span>' + t('sugBase', { b: lpCyNum(r.base || 0, 1, L) }) + '</span><div class="ency-cl">' + r.cycles.slice(-5).reverse().map((c) => {
      const d = new Date(c.start * 1000);
      return '<div><span>' + esc(lpCyTime(d.toISOString(), A._hass, L)) + '</span><span>' + esc(lpCyDur(c.min, L)) + '</span><b>' + esc(lpCyNum(c.kwh, 2, L)) + ' kWh</b></div>';
    }).join('') + '</div>';
  const T = r.tuned || {}, ks = Object.keys(T);
  h += ks.length ? '<div class="ency-tune"><span>' + t('sugTune') + ': ' + ks.map((k) => esc(lpCyT(L, 't_' + k, { v: lpCyNum(T[k], k === 'min_kwh' ? 2 : 0, L) }))).join(' · ') + '</span>' +
    (s.applied ? '<i>' + t('sugApplied') + '</i>' : '<button class="btn sm" data-cya="sugapply">' + t('sugApply') + '</button>') + '</div>' : '<div class="hint">' + t('sugKeep') + '</div>';
  return h + '</div>';
}
function lpCyEdHtml(A, D) {
  const L = A._lang, f = D.f, cy = f.cy, t = (k, v) => esc(lpCyT(L, k, v)), S = A._hass.states;
  if (!cy) return '';
  let h = '<section class="ency"><h4>' + t('title') + '</h4>';
  h += '<div class="ency-row"><div class="t"><b>' + t('onL') + '</b><span>' + t('onT') + '</span></div><button class="tg' + (cy.on ? ' on' : '') + '" data-cya="on" aria-label="' + t('onL') + '"></button></div>';
  if (!cy.on) return h + '</section>';
  if (!f.sensor) return h + '<div class="hint enwarn">' + t('needSensor') + '</div></section>';
  // tür
  h += '<div class="ency-l">' + t('kindL') + '</div><div class="endchips ency-k">' + LP_CY_KINDS.map((k) => '<button class="chip' + (cy.kind === k ? ' on' : '') + '" data-cyk="' + k + '"><ha-icon icon="' + LP_CY_IC[k] + '"></ha-icon>' + t('k_' + k) + '</button>').join('') + '</div>';
  const E0 = A._enEsts(), cur = D.id && E0[D.id] ? E0[D.id] : null, cst = D.id ? S['sensor.lhd_' + D.id + '_cycle'] : null;
  const base = cst && typeof cst.attributes.baseline_w === 'number' ? cst.attributes.baseline_w : 0;
  const tail = typeof cy.tail === 'boolean' ? cy.tail : (LP_CY_PRE[cy.kind] || LP_CY_PRE.other).tail;
  h += '<div class="ency-sum">' + t('sum', { sw: lpCyNum(lpCyVal(cy, 'start_w'), 0, L), sm: lpCyDur(lpCyVal(cy, 'start_min'), L), ew: lpCyNum(lpCyVal(cy, 'end_w'), 0, L), em: lpCyDur(lpCyVal(cy, 'end_min'), L) }) +
    (tail ? t('sumTail', { tm: lpCyDur(lpCyVal(cy, 'tail_min'), L) }) : '') + '<small>' + t('sumT', { b: lpCyNum(base, 1, L) }) + '</small></div>';
  h += '<div class="ency-acts"><button class="btn sm" data-cya="sug"' + (cy.sug && cy.sug.busy ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:history"></ha-icon>' + t('sug') + '</button></div>' + lpCySugHtml(A, cy);
  // gelişmiş: eşikler, kurutma, kapı, kendiliğinden kalkma
  if (A._adv()) {
    const P = LP_CY_PRE[cy.kind] || LP_CY_PRE.other;
    const num = (k, st) => '<div class="fld"><label title="' + t('f_' + k) + '">' + t('f_' + k) + '</label><input class="inp" type="number" min="0" step="' + st + '" data-cyv="' + k + '" value="' + esc(cy.v[k] || '') + '" placeholder="' + esc(lpCyNum(P[k], k === 'min_kwh' ? 2 : k === 'tail_w' ? 1 : 0, L)) + '"></div>';
    h += '<div class="ency-l">' + t('adv') + '</div><div class="hint">' + t('advT') + '</div><div class="engrid g2">' + LP_CY_NUM.filter((x) => tail || (x[0] !== 'tail_w' && x[0] !== 'tail_min')).map((x) => num(x[0], x[3])).join('') + '</div>';
    h += '<div class="ency-row"><div class="t"><b>' + t('tailL') + '</b><span>' + t('tailT') + '</span></div><button class="tg' + (tail ? ' on' : '') + '" data-cya="tail" aria-label="' + t('tailL') + '"></button></div>';
    const doors = Object.keys(S).filter((x) => x.indexOf('binary_sensor.') === 0).sort((a, b) => { const r = (x) => (/^(door|opening|window)$/.test(String(S[x].attributes.device_class || '')) ? 0 : 1); return r(a) - r(b) || (a < b ? -1 : 1); });
    h += '<div class="engrid g2"><div class="fld"><label>' + t('door') + '</label><select class="inp" data-cyd="door"><option value="">' + t('doorNone') + '</option>' + doors.map((x) => '<option value="' + esc(x) + '"' + (cy.door === x ? ' selected' : '') + '>' + esc(A._ename(x)) + '</option>').join('') + '</select><div class="hint">' + t('doorT') + '</div></div>' +
      '<div class="fld"><label>' + t('clear') + '</label><select class="inp" data-cyd="clear_h">' + [['', t('clearOff')]].concat([1, 2, 4, 8, 12, 24].map((x) => [String(x), t('clearH', { h: x })])).map((o) => '<option value="' + o[0] + '"' + (String(cy.clear_h || '') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div></div>';
  }
  // bildirim
  const n = cy.n, T = lpCyTargets(A._hass);
  h += '<div class="ency-row"><div class="t"><b>' + t('nOn') + '</b><span>' + t('nOnT') + '</span></div><button class="tg' + (n.on ? ' on' : '') + '" data-cya="non" aria-label="' + t('nOn') + '"></button></div>';
  if (n.on) {
    h += '<div class="ency-l">' + t('nTo') + '</div>' + (T.length ? '<div class="endchips">' + T.map((x) => '<button class="chip' + (n.targets.indexOf(x.id) >= 0 ? ' on' : '') + '" data-cyn="' + esc(x.id) + '" title="' + esc(x.id) + '">' + esc(x.name) + ' <i>' + t(x.ent ? 'nEnt' : 'nSvc') + '</i></button>').join('') + '</div>' : '<div class="hint enwarn">' + t('nNone') + '</div>');
    n.targets.filter((x) => !T.some((y) => y.id === x)).forEach((x) => { h += '<div class="hint enwarn">' + esc(x) + '</div>'; });
    const nm = String(f.name || '').trim() || lpCyT(L, 'k_' + cy.kind);
    const ph = L === 'tr' ? '{name} bitti · {duration} · {kwh} kWh' : '{name} finished · {duration} · {kwh} kWh';   // cycle.py DEFAULT_MSG
    h += '<div class="engrid g1"><div class="fld"><label>' + t('nMsg') + '</label><input class="inp" spellcheck="false" maxlength="200" data-cyd="msg" value="' + esc(n.msg) + '" placeholder="' + esc(ph) + '"><div class="hint">' + t('nMsgT', { ex: L === 'tr' ? nm + ' bitti · 52 dk · 0,79 kWh' : nm + ' finished · 52 min · 0.79 kWh' }) + '</div></div></div>';
    h += '<div class="engrid g2"><div class="fld"><label>' + t('nRem') + '</label><select class="inp" data-cyd="remind_h">' + [['', t('nRemOff')]].concat([1, 2, 3, 6, 12].map((x) => [String(x), t('nRemH', { h: x })])).map((o) => '<option value="' + o[0] + '"' + (String(n.remind_h || '') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>' +
      '<div class="fld"><label>&nbsp;</label><button class="btn sm" data-cya="test"' + (cy.test && cy.test.busy ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:send-outline"></ha-icon>' + t(cy.test && cy.test.busy ? 'nTestBusy' : 'nTest') + '</button></div></div>';
    if (cy.test && !cy.test.busy) h += '<div class="hint ency-sr' + (cy.test.ok ? ' ok' : ' enwarn') + '">' + esc(cy.test.text || '') + '</div>';
  }
  // panoya kart
  h += '<div class="ency-l">' + t('card') + '</div><div class="hint">' + t('cardT') + '</div>';
  if (cur && lhdIsObj(cur.cycle) && cur.cycle.on && cst) {
    const tabs = (A._work ? A._work() : []) || [], tab = tabs.filter((x) => x.id === cy.tab)[0] || tabs[0], secs = (tab && tab.sections) || [], sec = secs.filter((x) => x.id === cy.sec)[0] || secs[0];
    h += '<div class="engrid g3 ency-add"><div class="fld"><label>' + t('cardTab') + '</label><select class="inp" data-cyd="tab">' + tabs.map((x) => '<option value="' + esc(x.id) + '"' + (tab && x.id === tab.id ? ' selected' : '') + '>' + esc(x.name || x.id) + '</option>').join('') + '</select></div>' +
      '<div class="fld"><label>' + t('cardSec') + '</label><select class="inp" data-cyd="sec">' + (secs.length ? secs.map((x) => '<option value="' + esc(x.id) + '"' + (sec && x.id === sec.id ? ' selected' : '') + '>' + esc(x.title || x.id) + '</option>').join('') : '<option value="">' + t('cardNoSec') + '</option>') + '</select></div>' +
      '<div class="fld"><label>&nbsp;</label><button class="btn sm pri" data-cya="card"' + (sec ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('cardAdd') + '</button></div></div>';
    h += '<div class="hint">' + t('ents', { s: 'sensor.lhd_' + D.id + '_cycle', b: 'button.lhd_' + D.id + '_emptied' }) + '</div>';
  } else h += '<div class="hint">' + t('cardSave') + '</div>';
  return h + '</section>';
}
// tıklamalar (admin.js'in tıklama işleyicisinden); true: işlendi
function lpCyClick(A, g) {
  const D = A._enE; if (!D || !D.f || !D.f.cy) return false;
  const cy = D.f.cy, L = A._lang, k = g('[data-cyk]'), nb = g('[data-cyn]'), a = g('[data-cya]');
  if (k) { const v = k.getAttribute('data-cyk'); if (v !== cy.kind) { cy.kind = v; LP_CY_NUM.forEach((x) => { cy.v[x[0]] = ''; }); cy.tail = null; cy.sug = null; } A._render(); return true; }   // başka tür: o türün hazır değerleri
  if (nb) { const id = nb.getAttribute('data-cyn'), T = cy.n.targets, i = T.indexOf(id); if (i >= 0) T.splice(i, 1); else T.push(id); cy.test = null; A._render(); return true; }
  if (!a) return false;
  const act = a.getAttribute('data-cya');
  if (act === 'on') { cy.on = !cy.on; A._enErr = ''; A._render(); return true; }
  if (act === 'non') { cy.n.on = !cy.n.on; A._render(); return true; }
  if (act === 'tail') { const P = LP_CY_PRE[cy.kind] || LP_CY_PRE.other, cur = typeof cy.tail === 'boolean' ? cy.tail : P.tail; cy.tail = !cur; A._render(); return true; }
  if (act === 'sug') {
    const s = cy.sug = { busy: true }; A._render();
    A._hass.callWS({ type: 'lemur_home_dashboard/cycle_suggest', sensor: D.f.sensor, cycle: lpCyRec(Object.assign({}, cy, { on: true })) || { kind: cy.kind } })
      .then((r) => { s.busy = false; s.res = r || { days: 0, cycles: [] }; }, (e) => { s.busy = false; s.err = (e && e.message) || String(e); })
      .then(() => { if (A._enE === D) A._render(); });
    return true;
  }
  if (act === 'sugapply') { const T = (cy.sug && cy.sug.res && cy.sug.res.tuned) || {}; Object.keys(T).forEach((x) => { if (cy.v[x] !== undefined) cy.v[x] = String(T[x]); }); cy.sug.applied = true; A._render(); return true; }
  if (act === 'test') {
    if (!cy.n.targets.length) { cy.test = { ok: false, text: lpCyT(L, 'nPick') }; A._render(); return true; }
    const tt = cy.test = { busy: true }; A._render();
    A._hass.callWS({ type: 'lemur_home_dashboard/cycle_test', targets: cy.n.targets.slice(0, 10), msg: String(cy.n.msg || '').trim().slice(0, 200), name: String(D.f.name || '').trim().slice(0, 60) })
      .then((r) => { const R = (r && r.results) || [], bad = R.filter((x) => !x.ok); tt.busy = false; tt.ok = !bad.length; tt.text = bad.length ? bad.map((x) => lpCyT(L, 'nTestBad', { t: x.target, e: x.error })).join(' · ') : lpCyT(L, 'nTestOk', { m: (r && r.message) || '' }); },
        (e) => { tt.busy = false; tt.ok = false; tt.text = (e && e.message) || String(e); })
      .then(() => { if (A._enE === D) A._render(); });
    return true;
  }
  if (act === 'card') {
    const tabs = A._work(), tab = tabs.filter((x) => x.id === cy.tab)[0] || tabs[0], sec = tab && ((tab.sections || []).filter((x) => x.id === cy.sec)[0] || (tab.sections || [])[0]);
    if (!tab || !sec) return true;
    const tid = tab.id, sid = sec.id, ent = 'sensor.lhd_' + D.id + '_cycle';
    A._edit((T) => { const x = T.filter((y) => y.id === tid)[0], S = x && (x.sections || []).filter((z) => z.id === sid)[0]; if (S) { S.entities = S.entities || []; S.entities.push(lpCyItem(ent)); } }, lpCyT(L, 'cardAdded', { s: sec.title || sec.id }));
    return true;
  }
  return false;
}
// alanlar (admin.js'in change / input işleyicisinden); true: işlendi
function lpCyInput(A, el) {
  const D = A._enE; if (!D || !D.f || !D.f.cy || !el.getAttribute) return false;
  const cy = D.f.cy, v = el.getAttribute('data-cyv'), d = el.getAttribute('data-cyd');
  if (v) { cy.v[v] = el.value; A._enErr = ''; return true; }
  if (!d) return false;
  if (d === 'msg') { cy.n.msg = el.value; cy.test = null; return true; }
  if (d === 'remind_h') cy.n.remind_h = el.value;
  else if (d === 'tab') { cy.tab = el.value; cy.sec = ''; }
  else cy[d] = el.value;
  if (el.tagName === 'SELECT') A._render();
  return true;
}
