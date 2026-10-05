// Besleme kartı: evcil hayvan (kedi, köpek, balık...) için besleme hatırlatıcısı.
// Hayvanın ayarı STORE.data.pets[id], beslemeler STORE.data.feed[id] = { last, due, log } (entegrasyon tutar, bütün ekranlar aynı görür).
// Durum: never (hiç beslenmedi), ok (zamanında), soon (yaklaşıyor), due (zamanı geldi), late (gecikti). Renkler Halo kartlarıyla aynı aile.
// Dokun: "Besledim" (10 sn içinde yeniden dokununca geri alınır). Basılı tut: son beslemeler.
const LP_PET_KINDS = { cat: 'mdi:cat', dog: 'mdi:dog', fish: 'mdi:fish', bird: 'mdi:bird', rabbit: 'mdi:rabbit', turtle: 'mdi:turtle', other: 'mdi:paw' };
const LP_PET_RGB = { ok: '40,190,100', soon: '255,205,40', due: '255,140,30', late: '255,55,55', never: '150,150,150' };
const LP_PET_TXT = {
  tr: { ok: 'Zamanında', soon: 'Yaklaşıyor', due: 'Zamanı geldi', late: 'Gecikti', never: 'Hiç beslenmedi', ago: '{t} önce', last: 'Son', next: 'Sıradaki {t}', tomorrow: 'yarın {t}',
    lateBy: '{t} gecikti', at: 'Zamanı {t}', fed: 'Beslendi', undo: 'Geri almak için dokun', now: 'az önce', min: 'dk', hour: 'sa', day: 'g', hist: 'Son beslemeler', none: 'Henüz besleme yok', missing: 'Hayvan bulunamadı' },
  en: { ok: 'On time', soon: 'Soon', due: 'Due', late: 'Late', never: 'Never fed', ago: '{t} ago', last: 'Last', next: 'Next {t}', tomorrow: 'tomorrow {t}',
    lateBy: '{t} late', at: 'Due {t}', fed: 'Fed', undo: 'Tap to undo', now: 'just now', min: 'min', hour: 'h', day: 'd', hist: 'Recent feedings', none: 'No feedings yet', missing: 'Pet not found' }
};
const lpPetT = (lang, k, v) => { let s = (LP_PET_TXT[lang] || LP_PET_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
function lpPetNum(v, d) { const f = parseFloat(v); return f > 0 ? f : d; }
// durum: entegrasyondaki pets.status ile aynı hesap (sıradaki besleme "due" sunucudan gelir)
function lpPetStatus(pet, rec, now) {
  rec = rec || {};
  if (!rec.last) return 'never';
  const due = Date.parse(rec.due || '');
  if (isNaN(due)) return 'never';
  const soon = lpPetNum(pet.soon_min, 60) * 60000, grace = lpPetNum(pet.grace_min, 30) * 60000;
  if (now < due - soon) return 'ok';
  if (now < due) return 'soon';
  if (now < due + grace) return 'due';
  return 'late';
}
function lpPetDur(lang, ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 1) return lpPetT(lang, 'now');
  if (m < 60) return m + ' ' + lpPetT(lang, 'min');
  const h = Math.floor(m / 60), r = m % 60;
  if (h < 24) return h + ' ' + lpPetT(lang, 'hour') + (r ? ' ' + r + ' ' + lpPetT(lang, 'min') : '');
  const d = Math.floor(h / 24);
  return d + ' ' + lpPetT(lang, 'day') + (h % 24 ? ' ' + (h % 24) + ' ' + lpPetT(lang, 'hour') : '');
}
function lpPetClock(lang, ts, now) {
  const d = new Date(ts), p = (n) => (n < 10 ? '0' : '') + n, hm = p(d.getHours()) + ':' + p(d.getMinutes());
  const n = new Date(now), tm = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
  return d.getDate() === tm.getDate() && d.getMonth() === tm.getMonth() ? lpPetT(lang, 'tomorrow', { t: hm }) : hm;
}
// kartın içi (tekrar tekrar çizilir)
function lpPetHtml(lang, pet, rec, now, justFed) {
  if (!pet) return '<div class="pi">' + lpIcon('mdi:paw') + '</div><div class="pt"><b>?</b><span>' + esc(lpPetT(lang, 'missing')) + '</span></div>';
  rec = rec || {};
  const st = lpPetStatus(pet, rec, now), last = Date.parse(rec.last || ''), due = Date.parse(rec.due || '');
  let l2, l3 = '';
  if (justFed) { l2 = lpPetT(lang, 'fed') + ' ✓'; l3 = lpPetT(lang, 'undo'); }
  else {
    // 2. satır durum (gecikmede ne kadar), 3. satır son besleme ve sıradaki
    l2 = st === 'late' && !isNaN(due) ? lpPetT(lang, 'lateBy', { t: lpPetDur(lang, now - due) }) : lpPetT(lang, st);
    const parts = [];
    if (!isNaN(last)) parts.push(lpPetT(lang, 'ago', { t: lpPetDur(lang, now - last) }));
    if (!isNaN(due) && st !== 'late') parts.push(lpPetT(lang, st === 'due' ? 'at' : 'next', { t: lpPetClock(lang, due, now) }));
    l3 = parts.join(' · ');
  }
  return '<div class="pi">' + lpIcon(pet.icon || LP_PET_KINDS[pet.kind] || 'mdi:paw') + '</div><div class="pt"><b>' + esc(pet.name || '') + '</b><span class="ps">' + esc(l2) + '</span>' +
    (l3 ? '<span class="pn">' + esc(l3) + '</span>' : '') + '</div>';
}
function lpPetPaint(el, lang, now) {
  const D = STORE.data || {}, id = el.getAttribute('data-pet'), pet = (D.pets || {})[id], rec = (D.feed || {})[id];
  const just = el._fedAt && now - el._fedAt < 10000;
  const st = pet ? (just ? 'ok' : lpPetStatus(pet, rec, now)) : 'never';
  const key = st + '|' + (just ? 1 : 0) + '|' + JSON.stringify([pet, rec]) + '|' + Math.floor(now / 30000);
  if (el._pk === key) return;
  el._pk = key;
  el.className = 'petc st-' + st + (just ? ' just' : '');
  el.style.setProperty('--pc', LP_PET_RGB[st]);
  el.innerHTML = lpPetHtml(lang, pet, rec, now, just);
}
function lpPetHistory(h, lang, id) {
  const D = STORE.data || {}, pet = (D.pets || {})[id] || {}, log = (((D.feed || {})[id] || {}).log || []).slice(0, 15);
  const fmt = (ts) => { const d = new Date(ts), p = (n) => (n < 10 ? '0' : '') + n; return p(d.getDate()) + '.' + p(d.getMonth() + 1) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()); };
  const html = '<div class="phist">' + (log.length ? log.map((x) => '<div class="phr"><b>' + esc(fmt(x.t)) + '</b><span>' + esc(lpPetDur(lang, Date.now() - Date.parse(x.t))) + '</span><i>' + esc(x.by || '') + '</i></div>').join('')
    : '<div class="phr"><span>' + esc(lpPetT(lang, 'none')) + '</span></div>') + '</div>';
  LemurCardPopup.open(h, { title: (pet.name || '') + ' · ' + lpPetT(lang, 'hist'), html: html }, lang);
}
