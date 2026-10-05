/*! Lemur Halo Cards (gömülü kopya) v0.2.0 | GPL-3.0 | https://github.com/mendebur-lemur/lemur-halo-cards */
(() => {
if (window.__lemurHdCardsLoaded) return;
window.__lemurHdCardsLoaded = true;
const CSS = ":host { display: block; }\nha-card { position: relative; padding: 0; overflow: hidden; isolation: isolate;\nborder-radius: var(--ha-card-border-radius, 12px);\nbackground: var(--ha-card-background, var(--card-background-color)); }\n.halo { position: absolute; left: 14px; top: 14px; width: 460px; height: 460px; margin: -230px 0 0 -230px;\npointer-events: none; z-index: 0; mix-blend-mode: screen; opacity: var(--halo-k, 1);\n-webkit-mask-image: radial-gradient(circle closest-side, transparent 52px, #000 53px);\nmask-image: radial-gradient(circle closest-side, transparent 52px, #000 53px); }\n.halo::before, .halo::after { content: ''; position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 50%;\nwill-change: transform, opacity; }\n.halo::before { background: radial-gradient(circle closest-side,\nrgba(var(--temp-rgb), 0.416) 52px,\nrgba(var(--temp-rgb), 0.399) 70px,\nrgba(var(--temp-rgb), 0.353) 88px,\nrgba(var(--temp-rgb), 0.288) 105px,\nrgba(var(--temp-rgb), 0.216) 123px,\nrgba(var(--temp-rgb), 0.150) 141px,\nrgba(var(--temp-rgb), 0.095) 159px,\nrgba(var(--temp-rgb), 0.056) 177px,\nrgba(var(--temp-rgb), 0.030) 194px,\nrgba(var(--temp-rgb), 0.015) 212px,\nrgba(var(--temp-rgb), 0.000) 230px);\nanimation: lc-glow var(--halo-dur, 4.4s) cubic-bezier(0.45, 0, 0.55, 1) infinite; }\n.halo::after { background: radial-gradient(circle closest-side,\nrgba(var(--tint-rgb), 0.272) 52px,\nrgba(var(--tint-rgb), 0.250) 70px,\nrgba(var(--tint-rgb), 0.196) 88px,\nrgba(var(--tint-rgb), 0.130) 105px,\nrgba(var(--tint-rgb), 0.073) 123px,\nrgba(var(--tint-rgb), 0.034) 141px,\nrgba(var(--tint-rgb), 0.014) 159px,\nrgba(var(--tint-rgb), 0.005) 177px,\nrgba(var(--tint-rgb), 0.002) 194px,\nrgba(var(--tint-rgb), 0.000) 212px,\nrgba(var(--tint-rgb), 0.000) 230px);\nanimation: lc-sheen var(--halo-dur, 4.4s) cubic-bezier(0.45, 0, 0.55, 1) infinite;\nanimation-delay: calc(var(--halo-dur, 4.4s) * -0.12); }\n@keyframes lc-glow { 0%, 100% { transform: scale(0.84); opacity: 0.72; } 50% { transform: scale(1.06); opacity: 1; } }\n@keyframes lc-sheen { 0%, 100% { transform: translateY(8px) scale(0.86); opacity: 0.55; } 50% { transform: translateY(16px) scale(1.04); opacity: 1; } }\n.alarm .halo { animation: lc-alarm var(--halo-dur, 1.2s) ease-in-out infinite; }\n@keyframes lc-alarm { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }\n.still .halo::before { animation: none; transform: scale(1); opacity: 0.95; }\n.still .halo::after { animation: none; transform: translateY(12px) scale(1); opacity: 0.9; }\n.light .halo { mix-blend-mode: normal; }\n@media (prefers-reduced-motion: reduce) {\n.halo::before, .halo::after, .alarm .halo { animation: none; }\n}\n.top { position: relative; z-index: 1; height: 70px; }\n.ic { position: absolute; left: -18px; top: -18px; box-sizing: border-box; width: 64px; height: 64px; border-radius: 50%;\ndisplay: flex; align-items: center; justify-content: center;\nbackground: rgba(127, 127, 127, 0.08); border: 1px solid rgba(255, 255, 255, 0.07);\ncolor: rgb(var(--temp-rgb, 140,140,140)); --mdc-icon-size: 38px; }\n.ic svg { width: 38px; height: 38px; }\n.txt { position: absolute; left: 76px; top: 12px; right: 90px; min-width: 0; }\n.name { font-size: 14px; line-height: 21px; font-weight: 500; color: var(--primary-text-color);\nwhite-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.sec { font-size: 12px; line-height: 16px; color: var(--secondary-text-color); overflow: hidden;\ndisplay: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; max-height: 32px; word-wrap: break-word; }\n.pwr { position: absolute; top: 12px; right: 12px; width: 56px; height: 56px; border-radius: 14px; border: none; cursor: pointer; padding: 0;\ndisplay: flex; align-items: center; justify-content: center; --mdc-icon-size: 26px;\nbackground: var(--lc-box, rgba(255, 255, 255, 0.05)); color: var(--secondary-text-color); }\n.pwr.on { background: rgba(40, 190, 100, 0.18); color: rgb(40, 190, 100); }\n.nopwr .txt { right: 14px; }\n.compact .top { height: 80px; }\n.compact .txt { top: 50%; -webkit-transform: translateY(-50%); transform: translateY(-50%); }\n.bottom { position: relative; z-index: 1; display: flex; padding: 12px 12px 14px; }\n.bottom > .box + .box { margin-left: 10px; }\n.box { box-sizing: border-box; flex: 1 1 0; min-width: 0; height: 42px; border-radius: 12px; background: var(--lc-box, rgba(255, 255, 255, 0.05));\ndisplay: flex; align-items: center; justify-content: space-between; padding: 0 4px; color: var(--primary-text-color); overflow: hidden; }\n.box button { border: none; background: transparent; color: inherit; font-size: 1.2rem; flex: 0 1 30px; min-width: 14px; height: 32px;\ncursor: pointer; border-radius: 8px; padding: 0; }\n.box .val { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }\n.box.sel { position: relative; justify-content: flex-start; }\n.box.sel .lead { flex: 0 0 auto; display: flex; margin-left: 6px; --mdc-icon-size: 20px; color: var(--primary-text-color); }\n.box.sel .lbl { flex: 0 1 auto; min-width: 0; margin-left: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }\n.box.sel .chev { flex: 0 1000000 20px; min-width: 0; margin-left: auto; overflow: hidden; display: flex; justify-content: flex-end;\n--mdc-icon-size: 20px; color: var(--primary-text-color); margin-right: 5px; }\n.box.sel select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; padding: 0; margin: 0; border: 0; cursor: pointer; font-size: 16px; }\n.box.sel:focus-within { box-shadow: inset 0 0 0 2px rgba(var(--temp-rgb, 140,140,140), 0.55); }\n.box.sel select option { color: var(--primary-text-color); background: var(--card-background-color, #1c1c1c); }\nbutton.box { border: none; font: inherit; margin: 0; cursor: pointer; -webkit-appearance: none; appearance: none; }\n.box.btn { justify-content: center; --mdc-icon-size: 20px; }\n.box.btn ha-icon, .box.info ha-icon { flex: 0 0 auto; display: flex; }\n.box.btn .lbl, .box.info .lbl { flex: 0 1 auto; min-width: 0; margin-left: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; font-weight: 500; }\n.box.btn.active { background: rgba(var(--temp-rgb), 0.2); color: rgb(var(--temp-rgb)); }\n.box.btn.ask { background: rgba(255, 55, 55, 0.22); color: rgb(255, 95, 95); }\n.box.btn:active { -webkit-transform: scale(0.97); transform: scale(0.97); }\n.box.info { justify-content: center; --mdc-icon-size: 18px; }\n.box.info ha-icon { color: var(--secondary-text-color); }\n.box.btn.tight .lbl, .box.sel.tight .lbl { display: none; }\n.box.info.tight ha-icon { display: none; }\n.box.info.tight .lbl { margin-left: 0; }\n.bottom.dis { opacity: 0.38; pointer-events: none; }\n.pwr:disabled { opacity: 0.38; cursor: default; }\n.ic[data-more], .txt[data-more] { -webkit-tap-highlight-color: transparent; }\n.light { --lc-box: rgba(0, 0, 0, 0.05); }\n.light .ic { border-color: rgba(0, 0, 0, 0.07); }";
const DOCS_URL = "https://github.com/mendebur-lemur/lemur-halo-cards";
// Metinler. Her metin hem tr hem en. Arayüzde marka adı geçmez.
// Ortak metinler burada; her kart kendi metinlerini addText() ile ekler.
const TXT = {
  tr: {
    // ortak durumlar
    st_off: 'Kapalı', st_on: 'Açık', st_lost: 'Bağlantı yok', st_sensor: 'Sensör yok', st_unknown: 'Bilinmiyor',
    confirm: 'Emin misin?', power: 'Aç / kapat',
    // renkler (editör)
    c_ice: 'Buz mavisi', c_blue: 'Mavi', c_green: 'Yeşil', c_yellow: 'Sarı', c_orange: 'Turuncu', c_red: 'Kırmızı',
    c_alarm: 'Kırmızı, yanıp söner', c_grey: 'Gri', c_purple: 'Mor',
    // editör: ortak alanlar
    ed_entity: 'Cihaz', ed_entities: 'Birlikte kontrol edilecek diğer cihazlar', ed_name: 'Ad', ed_icon: 'Simge (her zaman)',
    ed_icon_on: 'Simge (açıkken)', ed_icon_off: 'Simge (kapalıyken)', ed_power_icon: 'Sağ üst düğmenin simgesi',
    ed_icons: 'Simge eşlemesi: durum, mod, seçenek ya da düğme → simge (ör. cool: mdi:snowflake-variant)',
    ed_appearance: 'Görünüm', ed_advanced: 'Gelişmiş', ed_show_power: 'Sağ üstteki düğme', ed_show_halo: 'Hale (parıltı)',
    ed_show_labels: 'Kutularda adları da yaz', ed_language: 'Dil', ed_stale_after: 'Bu kadar saniye haber gelmezse "Bağlantı yok" (0: kapalı; son görülme sensörüyle varsayılan 7200)',
    ed_last_seen_sensor: 'Son görülme sensörü (isteğe bağlı; ör. Zigbee2MQTT last_seen)',
    ed_lang_auto: 'Otomatik', ed_reset: 'Varsayılana dön',
    // renk ve hale ayarları
    ed_colors: 'Renkler ve hale', ed_color: 'Kartın rengi (boşsa duruma göre)', ed_effect: 'Hale hareketi',
    ed_tones: 'Durumlara göre renk ve hale', ed_tone_color: 'renk', ed_tone_effect: 'hale',
    ef_auto: 'Varsayılan', ef_breathe: 'Yavaş nefes', ef_pulse: 'Hızlı nabız', ef_blink: 'Yanıp söner', ef_still: 'Sabit', ef_none: 'Hale yok',
    tn_very_cold: 'Çok soğuk', tn_cold: 'Serin', tn_comfort: 'Konforlu', tn_warm: 'Sıcak', tn_hot: 'Çok sıcak', tn_heating: 'Isıtırken'
  },
  en: {
    st_off: 'Off', st_on: 'On', st_lost: 'No connection', st_sensor: 'No sensor', st_unknown: 'Unknown',
    confirm: 'Sure?', power: 'Turn on / off',
    c_ice: 'Ice blue', c_blue: 'Blue', c_green: 'Green', c_yellow: 'Yellow', c_orange: 'Orange', c_red: 'Red',
    c_alarm: 'Red, blinking', c_grey: 'Grey', c_purple: 'Purple',
    ed_entity: 'Device', ed_entities: 'Other devices controlled together', ed_name: 'Name', ed_icon: 'Icon (always)',
    ed_icon_on: 'Icon (when on)', ed_icon_off: 'Icon (when off)', ed_power_icon: 'Top-right button icon',
    ed_icons: 'Icon map: state, mode, option or button → icon (e.g. cool: mdi:snowflake-variant)',
    ed_appearance: 'Appearance', ed_advanced: 'Advanced', ed_show_power: 'Top-right button', ed_show_halo: 'Halo (glow)',
    ed_show_labels: 'Show names in the boxes', ed_language: 'Language', ed_stale_after: 'Show "No connection" after this many seconds without news (0: off; 7200 by default with a last seen sensor)',
    ed_last_seen_sensor: 'Last seen sensor (optional; e.g. Zigbee2MQTT last_seen)',
    ed_colors: 'Colours and halo', ed_color: 'Card colour (by state if empty)', ed_effect: 'Halo motion',
    ed_tones: 'Colour and halo by state', ed_tone_color: 'colour', ed_tone_effect: 'halo',
    ef_auto: 'Default', ef_breathe: 'Slow breath', ef_pulse: 'Fast pulse', ef_blink: 'Blinking', ef_still: 'Still', ef_none: 'No halo',
    tn_very_cold: 'Very cold', tn_cold: 'Cool', tn_comfort: 'Comfortable', tn_warm: 'Warm', tn_hot: 'Hot', tn_heating: 'Heating',
    ed_lang_auto: 'Automatic', ed_reset: 'Reset to defaults'
  }
};

function addText(tr, en) {
  Object.assign(TXT.tr, tr);
  Object.assign(TXT.en, en);
}

function pickLang(hass, forced) {
  if (forced === 'tr' || forced === 'en') return forced;
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}

function t(lang, key) {
  const d = TXT[lang] || TXT.en;
  return d[key] !== undefined ? d[key] : (TXT.en[key] !== undefined ? TXT.en[key] : key);
}

// Anahtar yoksa null döner (bilinmeyen cihaz değerleri için)
function tMaybe(lang, key) {
  const d = TXT[lang] || TXT.en;
  if (d[key] !== undefined) return d[key];
  return TXT.en[key] !== undefined ? TXT.en[key] : null;
}

// Bilinmeyen bir cihaz değerini okunur yaz: "medium_high" → "Medium high"
function prettify(x) {
  const r = String(x).replace(/_/g, ' ');
  return r.charAt(0).toUpperCase() + r.slice(1);
}

// Hale renkleri ve bir nefesin süresi (sn). Serin renkler yavaş, sıcak renkler hızlı nefes alır; alarm hızlı yanıp söner.
// Saf veri ve hesap, DOM yok (node testleri de bunu kullanır).
const BANDS = {
  ice:    { name: 'ice',    rgb: '120,215,255', duration: 5.2 },
  blue:   { name: 'blue',   rgb: '0,140,255',   duration: 5.0 },
  green:  { name: 'green',  rgb: '40,190,100',  duration: 4.4 },
  yellow: { name: 'yellow', rgb: '255,205,40',  duration: 4.0 },
  orange: { name: 'orange', rgb: '255,140,30',  duration: 3.8 },
  red:    { name: 'red',    rgb: '255,55,55',   duration: 3.6 },
  purple: { name: 'purple', rgb: '160,100,255', duration: 4.6 },
  grey:   { name: 'grey',   rgb: '150,150,150', duration: 6.0 },
  alarm:  { name: 'alarm',  rgb: '255,55,55',   duration: 1.2 }
};
const BAND_NAMES = ['ice', 'blue', 'green', 'yellow', 'orange', 'red', 'alarm', 'purple', 'grey'];

function band(name) { return BANDS[name] || BANDS.green; }

// Home Assistant renk seçicisinin adları (temadan okunamazsa bu değerler kullanılır)
const UI_COLORS = { primary: '3,169,244', accent: '255,152,0', pink: '233,30,99', purple: '146,107,199', 'deep-purple': '110,65,171',
  indigo: '63,81,181', 'light-blue': '3,169,244', cyan: '0,188,212', teal: '0,150,136', 'light-green': '139,195,74', lime: '205,220,57',
  amber: '255,193,7', 'deep-orange': '255,111,34', brown: '121,85,72', 'light-grey': '189,189,189', 'dark-grey': '96,96,96',
  'blue-grey': '96,125,139', black: '0,0,0', white: '255,255,255' };

// Kullanıcının yazdığı rengi "r,g,b" yapar: [r,g,b], "#rgb", "#rrggbb", "r,g,b" ya da renk adı (green, red...). Anlaşılmazsa null.
function parseColor(v) {
  if (v === null || v === undefined || v === '') return null;
  const ok = (a) => a.length === 3 && a.every((x) => isFinite(x) && x >= 0 && x <= 255);
  if (Array.isArray(v)) { const a = v.map(Number); return ok(a) ? a.map(Math.round).join(',') : null; }
  const s = String(v).trim().toLowerCase();
  if (BANDS[s]) return BANDS[s].rgb;
  if (UI_COLORS[s]) return UI_COLORS[s];
  let m = /^#?([0-9a-f]{6})$/.exec(s);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].substr(i, 2), 16)).join(',');
  m = /^#?([0-9a-f]{3})$/.exec(s);
  if (m) return [0, 1, 2].map((i) => parseInt(m[1][i] + m[1][i], 16)).join(',');
  const a = s.split(',').map((x) => Number(x.trim()));
  return a.length === 3 && ok(a) ? a.join(',') : null;
}
// "r,g,b" → "#rrggbb" (editördeki renk seçici için)
function rgbHex(rgb) { return '#' + String(rgb).split(',').map((x) => ('0' + Number(x).toString(16)).slice(-2)).join(''); }

// Hale hareketleri. auto: kartın kendi seçimi (normalde yavaş nefes, alarm durumunda yanıp söner)
const EFFECTS = ['auto', 'breathe', 'pulse', 'blink', 'still', 'none'];

// Konfor bandından durum anahtarı (renk ve hale ayarlarında kullanılır)
const BAND_TONE = { ice: 'very_cold', blue: 'cold', green: 'comfort', yellow: 'warm', orange: 'warm', red: 'hot', alarm: 'lost' };

// Değeri dört sınırla beş bölgeye ayırır: < s1 → r1, < s2 → r2, < s3 → r3, < s4 → r4, üstü → r5.
// Boş (null) sınır atlanır, o bölge bir sonrakiyle birleşir. Dönen değer renk adıdır.
function zoneColor(value, limits, colors) {
  for (let i = 0; i < 4; i++) {
    const l = limits[i];
    if (l !== null && l !== undefined && l !== '' && isFinite(l) && value < Number(l)) return colors[i];
  }
  return colors[4];
}

// Aynı bölgelemeyle sıra numarası (0-4): etiket seçmek için
function zoneIndex(value, limits) {
  for (let i = 0; i < 4; i++) {
    const l = limits[i];
    if (l !== null && l !== undefined && l !== '' && isFinite(l) && value < Number(l)) return i;
  }
  return 4;
}

// Küçük yardımcılar. Eski Safari (iOS 12) için ?. ve ?? kullanılmıyor.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Katı sayı çevirme: "2026-10-04T06:00" ya da "12abc" sayı sayılmaz (parseFloat bunları 2026 / 12 yapardı)
const num = (v) => {
  if (typeof v === 'number') return isFinite(v) ? v : null;
  if (typeof v !== 'string') return null;
  const s = v.trim(); if (!s) return null;
  const n = Number(s); return isFinite(n) ? n : null;
};
const round = (v, d) => { const k = Math.pow(10, d || 0); return Math.round(v * k) / k; };

// Halenin ikinci parıltısı için ana rengin açık tonu (beyaza %55 yaklaştırılmış)
const tint = (rgb) => rgb.split(',').map((v) => Math.round(+v + (255 - v) * 0.55)).join(',');

const isOff = (st) => !st || st.state === 'off' || st.state === 'unavailable' || st.state === 'unknown';
const isDead = (st) => !st || st.state === 'unavailable' || st.state === 'unknown';

// Cihazdan uzun süredir haber yoksa ya da unavailable/unknown ise true
function stale(st, limit) {
  if (isDead(st)) return true;
  const ts = Date.parse(st.last_reported || st.last_updated);
  return isFinite(ts) && limit > 0 && (Date.now() - ts) / 1000 > limit;
}

// Varlığın sayısal değeri (yoksa null)
function stateNum(hass, id) {
  if (!id || !hass.states[id]) return null;
  return num(hass.states[id].state);
}

// Güç sensörünü watt'a çevirir. Birim büyük/küçük harfe duyarlı: mW (miliwatt) ile MW (megawatt) farklı.
const POWER_UNITS = { W: 1, kW: 1000, MW: 1e6, GW: 1e9, mW: 0.001 };
function watts(hass, id) {
  if (!id || !hass.states[id]) return null;
  const st = hass.states[id], v = num(st.state);
  if (v === null) return null;
  const k = POWER_UNITS[String(st.attributes.unit_of_measurement || 'W').trim()];
  return v * (k || 1);
}

// Yüzde: Türkçede %48, İngilizcede 48%
function pct(v, lang) { return lang === 'tr' ? '%' + v : v + '%'; }

// Sıcaklık birimi: HA'nın birim sistemi (°C / °F). Konfor hesapları °C ile yapılır.
function tempUnit(hass) { return (hass && hass.config && hass.config.unit_system && hass.config.unit_system.temperature) || '°C'; }
function toC(v, unit) { return v === null || v === undefined ? v : (String(unit).indexOf('F') >= 0 ? (v - 32) * 5 / 9 : v); }
function fmtPower(w) {
  const a = Math.abs(w);
  return a >= 1000 ? round(w / 1000, a >= 10000 ? 0 : 1) + ' kW' : Math.round(w) + ' W';
}

// Sensör değeri + birimi: "24.5 °C", "%48" (en: "48%"), "812 ppm"
function fmtState(hass, id, decimals, lang) {
  const st = hass.states[id];
  if (!st) return '';
  const v = num(st.state);
  if (v === null) return st.state;
  const u = st.attributes.unit_of_measurement || '';
  const d = decimals !== undefined && decimals !== null && decimals !== '' ? Number(decimals) : (Math.abs(v) < 100 && v % 1 ? 1 : 0);
  const s = String(round(v, d));
  if (u === '%') return pct(s, lang || 'tr');
  return u ? s + ' ' + u : s;
}

function friendly(hass, id) {
  const st = hass.states[id];
  return (st && st.attributes.friendly_name) || id;
}

// HA'nın ayrıntı penceresini açar
function moreInfo(el, entityId) {
  el.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: entityId }, bubbles: true, composed: true }));
}

// Fan hızı simgeleri (klima ve hava temizleyici). Listede olmayan değer mdi:fan alır.
const FAN_ICONS = { auto: 'mdi:fan-auto', off: 'mdi:fan-off', on: 'mdi:fan',
  low: 'mdi:fan-speed-1', quiet: 'mdi:fan-speed-1', silent: 'mdi:fan-speed-1', sleep: 'mdi:fan-speed-1', medium_low: 'mdi:fan-speed-1',
  medium: 'mdi:fan-speed-2', middle: 'mdi:fan-speed-2', mid: 'mdi:fan-speed-2', medium_high: 'mdi:fan-speed-2', normal: 'mdi:fan-speed-2',
  high: 'mdi:fan-speed-3', strong: 'mdi:fan-speed-3', turbo: 'mdi:fan-speed-3', powerful: 'mdi:fan-speed-3', boost: 'mdi:fan-speed-3', max: 'mdi:fan-speed-3' };
const fanIcon = (x) => FAN_ICONS[String(x).toLowerCase()] || 'mdi:fan';
// Fan adı: bilinen değerler çevrilir, bilinmeyen değer okunur hâle getirilir
const fanLabel = (lang, x) => { const v = tMaybe(lang, 'f_' + String(x).toLowerCase()); return v !== null ? v : prettify(x); };

// İlk uygun varlık (editör ilk açıldığında örnek ayar için)
function firstEntity(hass, domains, filter) {
  if (!hass) return '';
  const ids = Object.keys(hass.states).filter((id) => domains.indexOf(id.split('.')[0]) >= 0 && (!filter || filter(hass.states[id])));
  return ids[0] || '';
}

addText({
  f_auto: 'Otomatik', f_low: 'Düşük', f_medium_low: 'Orta-düşük', f_medium: 'Orta', f_middle: 'Orta', f_mid: 'Orta', f_normal: 'Normal',
  f_medium_high: 'Orta-yüksek', f_high: 'Yüksek', f_quiet: 'Sessiz', f_silent: 'Sessiz', f_sleep: 'Uyku', f_strong: 'Güçlü',
  f_powerful: 'Güçlü', f_turbo: 'Turbo', f_boost: 'Turbo', f_max: 'En yüksek', f_on: 'Açık', f_off: 'Kapalı', f_focus: 'Odaklı', f_diffuse: 'Yayılı'
}, {
  f_auto: 'Auto', f_low: 'Low', f_medium_low: 'Medium-low', f_medium: 'Medium', f_middle: 'Medium', f_mid: 'Medium', f_normal: 'Normal',
  f_medium_high: 'Medium-high', f_high: 'High', f_quiet: 'Quiet', f_silent: 'Silent', f_sleep: 'Sleep', f_strong: 'Strong',
  f_powerful: 'Powerful', f_turbo: 'Turbo', f_boost: 'Boost', f_max: 'Max', f_on: 'On', f_off: 'Off', f_focus: 'Focus', f_diffuse: 'Diffuse'
});

// Saf hesaplar (DOM yok). Bugünkü Jinja şablonlarının birebir JS karşılığı.
// Kaynak: dev/eski-kartlar/klima-karti.md ve petek-karti.md

const COMFORT_DEFAULTS = { cold: 16, cool: 19, warm: 29, hot: 31.5, humid_dewpoint: 18, dry_humidity: 28 };
const RADIATOR_DEFAULTS = { very_cold: 15, cold: 18, comfort: 24, warm: 26, outdoor_base: 10, outdoor_factor: 0.33, outdoor_max_shift: 3 };

// Renkler core/bands.js içinde (BANDS).

// Çiy noktası (Magnus formülü). Nem yoksa null.
function dewPoint(t, rh) {
  if (!(rh > 0) || !isFinite(t)) return null;
  const g = Math.log(rh / 100) + (17.62 * t) / (243.12 + t);
  return (243.12 * g) / (17.62 - g);
}

// Hissedilen sıcaklık: 13.5 °C üstü çiy noktası sıcağı artırır, 12 °C altı kuru hava serinletir;
// etki 21 °C altında devreye girmez, 24 °C'de tam etkili olur.
function feelsLike(t, rh) {
  const td = dewPoint(t, rh);
  if (td === null) return { his: t, td: null };
  const nemli = Math.max(0, td - 13.5);
  const kuru = Math.max(0, 12 - td);
  const k = Math.min(1, Math.max(0, (t - 21) / 3));
  return { his: t + k * (0.55 * nemli - 0.3 * kuru), td: td };
}

// Konfor etiketi anahtarı (i18n.js'deki anahtarlar)
function comfortKey(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const r = feelsLike(t, rh);
  const his = r.his, td = r.td;
  if (his < c.cold) return 'very_cold';
  if (his < c.cool) return 'cool';
  if (his < c.warm) {
    if (td !== null && td >= c.humid_dewpoint) return 'humid';
    if (rh > 0 && rh < c.dry_humidity) return 'dry';
    return 'comfortable';
  }
  if (his < c.hot) return 'warm';
  return 'hot';
}

// Klima hale bandı: hissedilen sıcaklığa göre
function acBand(t, rh, c) {
  c = Object.assign({}, COMFORT_DEFAULTS, c || {});
  const his = feelsLike(t, rh).his;
  if (his < c.cool) return BANDS.blue;
  if (his < c.warm) return BANDS.green;
  if (his < c.hot) return BANDS.yellow;
  return BANDS.red;
}

// Petek hale bandı: gerçek sıcaklığa göre, dış sıcaklıkla kayan eşikler
function radiatorBand(t, outdoor, b, lost) {
  if (lost) return BANDS.alarm;
  b = Object.assign({}, RADIATOR_DEFAULTS, b || {});
  let kay = 0;
  if (outdoor !== null && outdoor !== undefined && isFinite(outdoor)) {
    kay = Math.max(0, Math.min(b.outdoor_max_shift, (outdoor - b.outdoor_base) * b.outdoor_factor));
  }
  if (t < b.very_cold + kay) return BANDS.ice;
  if (t < b.cold + kay) return BANDS.blue;
  if (t < b.comfort + kay) return BANDS.green;
  if (t < b.warm + kay) return BANDS.yellow;
  return BANDS.red;
}


// Kendi simgelerimiz. Petek simgeleri bu projenin kendi çizimi.
// MDI simgeleri için HA'nın ha-icon bileşeni kullanılır (ek bağımlılık değil).
const ICONS = (() => {
  const f = (n) => Math.round(n * 100) / 100;
  const rr = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w - r) + ' ' + f(y + h) +
      'H' + f(x + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + r) + ' ' + f(y) + 'Z';
  };
  const rrHole = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    return 'M' + f(x + r) + ' ' + f(y) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x) + ' ' + f(y + r) +
      'V' + f(y + h - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + r) + ' ' + f(y + h) +
      'H' + f(x + w - r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w) + ' ' + f(y + h - r) +
      'V' + f(y + r) + 'A' + f(r) + ' ' + f(r) + ' 0 0 0 ' + f(x + w - r) + ' ' + f(y) + 'Z';
  };
  const circle = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 1 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const circleHole = (cx, cy, r) =>
    'M' + f(cx - r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx + r) + ' ' + f(cy) + 'A' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(cx - r) + ' ' + f(cy) + 'Z';
  const sectional = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(0, 3, 20, 1.7, 0.85) + R(0, 11.3, 20, 1.7, 0.85);
    for (let i = 0; i < 4; i++) p += R(1.4 + i * 4.55, 0.5, 3.3, 14.5, 1.65);
    return p + R(2.05, 15, 2, 2, 0.6) + R(15.95, 15, 2, 2, 0.6);
  };
  const panel = (bx, by, s) => {
    const R = (x, y, w, h, r) => rr(bx + x * s, by + y * s, w * s, h * s, r * s);
    const H = (x, y, w, h, r) => rrHole(bx + x * s, by + y * s, w * s, h * s, r * s);
    let p = R(1, 0.5, 18, 14, 1.8);
    for (let i = 0; i < 6; i++) p += H(3.3 + i * 2.55, 2.6, 0.95, 9.8, 0.47);
    return p + R(0, 1.6, 1.4, 1.6, 0.4) + R(18.6, 11.8, 1.4, 1.6, 0.4) + R(3, 14.5, 1.8, 2.5, 0.5) + R(15.2, 14.5, 1.8, 2.5, 0.5);
  };
  const slash = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = (-dy / L) * w / 2, ny = (dx / L) * w / 2;
    return 'M' + f(x1 - nx) + ' ' + f(y1 - ny) + 'L' + f(x2 - nx) + ' ' + f(y2 - ny) + 'L' + f(x2 + nx) + ' ' + f(y2 + ny) + 'L' + f(x1 + nx) + ' ' + f(y1 + ny) + 'Z';
  };
  const badge = (cx, cy, r) => circle(cx, cy, r) + rrHole(cx - r * 0.17, cy - r * 0.62, r * 0.34, r * 0.72, r * 0.17) + circleHole(cx, cy + r * 0.5, r * 0.19);
  const full = { bx: 2, by: 3.5, s: 1 };
  const small = { bx: 1.5, by: 8.6, s: 0.72 };
  return {
    'sectional': sectional(full.bx, full.by, full.s),
    'sectional-off': sectional(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'sectional-lost': sectional(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6),
    'panel': panel(full.bx, full.by, full.s),
    'panel-off': panel(full.bx, full.by, full.s) + slash(3, 2.5, 21, 21.5, 2.2),
    'panel-lost': panel(small.bx, small.by, small.s) + badge(18.6, 5.6, 4.6)
  };
})();

function svgIcon(name) {
  const p = ICONS[name] || ICONS.panel;
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="nonzero" d="' + p + '"/></svg>';
}

// Bütün Lemur kartlarının ortak tabanı. HTMLElement + shadow DOM, Lit yok, başka eklenti yok.
// Eski Safari (iOS 12) için ?. ve ?? kullanılmıyor, sınıf alanı (class field) yok.
//
// Bir kart şunları tanımlar:
//   static get TYPE()      'lemur-xxx-card'
//   static get DOMAINS()   ana varlığın alanları (['climate']); ana varlığı olmayan kart için null
//   static get DEFAULTS()  kartın varsayılan ayarları (BASE_DEFAULTS ile birleşir)
//   static nested(cfg, hass)   editörde iç içe ayar grupları ve varsayılanları: { comfort: {...} }
//   static get RESETS()    editörde bir alan değişince sıfırlanacak iç içe gruplar: { levels: ['entity', 'preset'] }
//   static schema(lang, cfg, hass)  editör şeması (ha-form)
//   static stub(hass)      kart ilk eklendiğinde örnek ayar
//   ids()                  yeniden çizimi tetikleyen varlıklar
//   view(lang)             { name, sec:[...], icon:{mdi|svg}, state, tone, band, on, powerIcon, disabled, boxes:[...], haloK, moreInfo }
//                          state: simge eşlemesinde (icons) kullanılan durum anahtarı (ör. 'cool', 'cleaning', 'zone2')
//                          tone:  renk ve hale ayarlarında (tones) kullanılan durum anahtarı ya da öncelik sırasıyla anahtar listesi
//                                 (ör. ['off', 'comfort']: kullanıcı "kapalı" için renk seçtiyse o, yoksa "konforlu")
//   static toneList(lang, cfg, hass)  editörde gösterilecek durumlar: [{ key, label, band (renk adı ya da null), effect }]
//   power()                sağ üst düğmeye basılınca
//   onStep(id, dir) / onSelect(id, value) / onButton(id)   alt satır kutuları
//
// Kutular (alt satır, eşit genişlik):
//   { type: 'step', id, value }                         − değer +
//   { type: 'select', id, icon, label, value, options: [{ value, label, icon }] }
//   { type: 'button', id, icon, label, active, confirm, showLabel }
//   { type: 'info', icon, text, entity }                sadece gösterir; dokununca ayrıntı penceresi
//
// "Bağlantı yok": cihaz unavailable / unknown ise. İsteğe bağlı olarak:
//   last_seen_sensor  son görülme zamanını tutan sensör (ör. Zigbee2MQTT'nin sensor.xxx_last_seen); stale_after (varsayılan 7200 sn) geçerse
//   stale_after       > 0 ise cihazın durumu bu kadar saniye hiç değişmezse. Dikkat: HA, değer aynı kaldıkça zamanı güncellemez;
//                     sadece sürekli değişen cihazlarda kullan.

const CARD_VERSION = '0.2.0';

const BASE_DEFAULTS = {
  name: '',
  icon: '',            // her zaman bu simge
  icon_on: '',         // açıkken
  icon_off: '',        // kapalıyken
  power_icon: '',      // sağ üst düğme
  icons: {},           // eşleme: durum / mod / seçenek / düğme / varlık → simge (ör. cool: mdi:snowflake-variant)
  show_power: true,
  show_halo: true,
  show_labels: false,
  last_seen_sensor: '',
  stale_after: 0,
  language: 'auto',
  color: '',           // kartın tek rengi (boşsa duruma göre); [r,g,b], #rrggbb ya da renk adı
  effect: 'auto',      // hale hareketi: auto, breathe, pulse, blink, still, none
  tones: {}            // durum → { color, effect } (ör. hot: { color: '#ff0000', effect: blink })
};

class LemurCard extends HTMLElement {
  static get TYPE() { return 'lemur-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() { return {}; }
  static get RESETS() { return {}; }
  static allDefaults() { return Object.assign({}, BASE_DEFAULTS, this.DEFAULTS); }
  static nested() { return {}; }
  static schema() { return []; }
  static toneList() { return []; }
  static stub(hass) {
    const d = this.DOMAINS;
    return d ? { entity: firstEntity(hass, d) || (d[0] + '.example') } : {};
  }
  static getConfigElement() { return document.createElement(this.TYPE + '-editor'); }
  static getStubConfig(hass) { return this.stub(hass); }

  validate(config) {
    const d = this.constructor.DOMAINS;
    if (!d) return;
    const dom = String(config.entity || '').split('.')[0];
    if (!config.entity || d.indexOf(dom) < 0) throw new Error('entity: ' + d.join(' / ') + '.xxx');
  }

  setConfig(config) {
    if (!config) throw new Error('config');
    this.validate(config);
    const D = this.constructor.allDefaults(), c = Object.assign({}, D, config);
    // YAML'da liste yerine tek değer yazılmışsa listeye çevir (lights: light.salon → [light.salon])
    Object.keys(D).forEach((k) => {
      if (!Array.isArray(D[k])) return;
      if (typeof c[k] === 'string') c[k] = c[k] ? [c[k]] : [];
      else if (!Array.isArray(c[k])) c[k] = [];
    });
    if (!c.icons || typeof c.icons !== 'object') c.icons = {};
    if (!c.tones || typeof c.tones !== 'object' || Array.isArray(c.tones)) c.tones = {};
    this._config = c;
    this._sig = '';
    this._timer();
    if (this._hass) this._render();
  }

  // Alt satırı olmayan kart kısadır (yalnız üst satır)
  getCardSize() { return this._compact ? 2 : 3; }
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }

  connectedCallback() {
    this._timer();
    // Kart genişliği değişince (tablet döndü, pano yeniden dizildi) kutulara sığma kontrolü
    if (!this._ro && !this._onRs) {
      if (window.ResizeObserver) { this._ro = new ResizeObserver(() => this._fit()); this._ro.observe(this); }
      else { this._onRs = () => this._fit(); window.addEventListener('resize', this._onRs); }
    }
    this._fit();
  }
  disconnectedCallback() {
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this._onRs) { window.removeEventListener('resize', this._onRs); this._onRs = null; }
  }
  // Süreye bağlı "Bağlantı yok" kontrolü açıksa dakikada bir yeniden bak (durum değişmese de)
  _timer() {
    const c = this._config, need = c && (c.stale_after > 0 || c.last_seen_sensor) && this.isConnected;
    if (need && !this._tick) this._tick = setInterval(() => { this._sig = ''; if (this._hass) this.hass = this._hass; }, 60000);
    if (!need && this._tick) { clearInterval(this._tick); this._tick = null; }
  }

  // Sığma kontrolü: kutudaki ad tam sığmıyorsa .tight (CSS: düğme/seçimde ad gizlenir, bilgi kutusunda simge gizlenir).
  // Yarım kalmış "Kap…" gibi yazılar yerine ya tamamı ya hiç.
  _fit() {
    const root = this.shadowRoot;
    if (!root || !this.offsetWidth) return;
    const boxes = root.querySelectorAll('.box.btn, .box.sel, .box.info');
    for (let i = 0; i < boxes.length; i++) boxes[i].classList.remove('tight');
    for (let i = 0; i < boxes.length; i++) {
      const l = boxes[i].querySelector('.lbl');
      if (l && l.scrollWidth > l.clientWidth + 1) boxes[i].classList.add('tight');
    }
  }

  set hass(h) {
    this._hass = h;
    if (!this._config) return;
    const dark = !(h.themes && h.themes.darkMode === false);
    const sig = pickLang(h, this._config.language) + (dark ? 'D' : 'L') + '|' +
      this.ids().concat([this._config.last_seen_sensor]).filter(Boolean)
        .map((id) => { const s = h.states[id]; return s ? id + s.last_updated + s.state : id; }).join('|');
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }
  get hass() { return this._hass; }

  ids() { return [this._config.entity].concat(this._config.entities || []); }
  st(id) { return id && this._hass ? this._hass.states[id] : undefined; }
  power() {}
  onStep() {}
  onSelect() {}
  onButton() {}

  // Bağlantı yok mu: cihaz unavailable/unknown, ya da (açıksa) süre aşıldı, ya da son görülme sensörü eski
  isLost(id) {
    const c = this._config;
    if (stale(this.st(id), c.stale_after)) return true;
    if (c.last_seen_sensor) {
      const s = this.st(c.last_seen_sensor), ts = s ? Date.parse(s.state) : NaN;
      const limit = c.stale_after > 0 ? c.stale_after : 7200;
      if (isFinite(ts) && (Date.now() - ts) / 1000 > limit) return true;
    }
    return false;
  }

  call(domain, service, data) {
    return this._hass.callService(domain, service, data || {});
  }

  // Art arda basışları toplar, 800 ms sonra tek komut gönderir. Değer kutusu hemen güncellenir,
  // arada kart yeniden çizilse de bekleyen değer gösterilmeye devam eder.
  stepValue(key, cur, delta, lo, hi, fmt, commit) {
    this._pend = this._pend || {};
    this._pendFmt = this._pendFmt || {};
    const base = this._pend[key] !== undefined ? this._pend[key] : cur;
    if (base === null || base === undefined) return;
    let v = Math.round((base + delta) * 100) / 100;
    if (lo !== null && lo !== undefined) v = Math.max(lo, v);
    if (hi !== null && hi !== undefined) v = Math.min(hi, v);
    this._pend[key] = v;
    this._pendFmt[key] = fmt;
    const el = this.shadowRoot && this.shadowRoot.getElementById(key + '-val');
    if (el) el.textContent = fmt(v);
    this._tmrs = this._tmrs || {};
    clearTimeout(this._tmrs[key]);
    this._tmrs[key] = setTimeout(() => { const val = this._pend[key]; delete this._pend[key]; commit(val); }, 800);
  }

  // Büyük ikon. Öncelik: icon > icon_on / icon_off > icons[durum] > kartın kendi seçimi
  _icon(v) {
    const c = this._config, map = c.icons || {};
    if (c.icon) return { mdi: c.icon };
    if (v.on && c.icon_on) return { mdi: c.icon_on };
    if (!v.on && c.icon_off) return { mdi: c.icon_off };
    if (v.state !== undefined && map[v.state]) return { mdi: map[v.state] };
    return v.icon || { mdi: 'mdi:help-circle' };
  }

  // Kutulara simge eşlemesi: seçenek değeri, düğme kimliği ya da varlık kimliği
  _mapBox(b) {
    const map = this._config.icons || {};
    if (!Object.keys(map).length) return b;
    const o = Object.assign({}, b);
    if (o.type === 'select') {
      o.options = (o.options || []).map((x) => map[x.value] ? Object.assign({}, x, { icon: map[x.value] }) : x);
      if (map[o.value]) o.icon = map[o.value];
    } else if (o.type === 'button' && map[o.id]) o.icon = map[o.id];
    else if (o.type === 'info' && o.entity && map[o.entity]) o.icon = map[o.entity];
    return o;
  }

  // Hale rengi ve hareketi. Öncelik: durumun kendi ayarı (tones) > kartın tek rengi / hareketi > kartın kendi seçimi.
  // "Bağlantı yok" durumunda kartın tek rengi uygulanmaz (uyarı görünür kalsın), ama tones.lost ile değiştirilebilir.
  _haloStyle(v, bnd) {
    const c = this._config, keys = Array.isArray(v.tone) ? v.tone : (v.tone ? [v.tone] : []);
    const isAlarm = bnd === BANDS.alarm;
    let rgb = bnd.rgb, eff = isAlarm ? 'blink' : 'breathe';
    if (keys[0] !== 'lost') {
      const fc = this._color(c.color); if (fc) rgb = fc;
      if (c.effect && c.effect !== 'auto' && EFFECTS.indexOf(c.effect) >= 0) eff = c.effect;
    }
    const T = c.tones || {};
    for (let i = 0; i < keys.length; i++) {
      const o = T[keys[i]];
      if (!o || typeof o !== 'object') continue;
      const oc = this._color(o.color), oe = o.effect && o.effect !== 'auto' && EFFECTS.indexOf(o.effect) >= 0 ? o.effect : null;
      if (!oc && !oe) continue;
      if (oc) rgb = oc;
      if (oe) eff = oe;
      break;
    }
    const dur = eff === 'blink' ? (isAlarm ? bnd.duration : 1.2) : eff === 'pulse' ? 1.6 : (isAlarm ? 4.4 : bnd.duration);
    return { rgb: rgb, eff: eff, dur: dur };
  }

  // Renk adı temada tanımlıysa (--rgb-red-color gibi) temanın rengi, değilse parseColor
  _color(v) {
    if (typeof v === 'string' && /^[a-z-]+$/.test(v.trim()) && window.getComputedStyle) {
      const css = window.getComputedStyle(this).getPropertyValue('--rgb-' + v.trim() + '-color').trim();
      const p = css && parseColor(css.replace(/\s+/g, ''));
      if (p) return p;
    }
    return parseColor(v);
  }

  _boxHtml(b, showLabels) {
    const id = esc(b.id || '');
    const lbl = (txt, force) => (txt && (showLabels || force)) ? '<span class="lbl" id="' + id + '-lbl">' + esc(txt) + '</span>' : '';
    if (b.type === 'step') {
      const pv = this._pend && this._pend[b.id], f = this._pendFmt && this._pendFmt[b.id];
      const value = pv !== undefined && f ? f(pv) : b.value;
      return '<div class="box tgt"><button data-step="' + id + '" data-dir="-1" aria-label="−">−</button>' +
        '<span class="val" id="' + id + '-val">' + esc(value) + '</span>' +
        '<button data-step="' + id + '" data-dir="1" aria-label="+">+</button></div>';
    }
    if (b.type === 'select') {
      const opts = b.options || [];
      const has = opts.some((o) => o.value === b.value);
      return '<div class="box sel" title="' + esc(b.title || '') + '"><ha-icon class="lead" id="' + id + '-ic" icon="' + esc(b.icon || 'mdi:menu') + '"></ha-icon>' +
        lbl(b.label) + '<span class="chev"><ha-icon icon="mdi:menu-down"></ha-icon></span>' +
        '<select data-sel="' + id + '" aria-label="' + esc(b.title || '') + '">' +
        (has ? '' : '<option value="" selected disabled hidden>' + esc(b.label || '') + '</option>') +
        opts.map((o) => '<option value="' + esc(o.value) + '"' + (o.value === b.value ? ' selected' : '') + '>' + esc(o.label) + '</option>').join('') +
        '</select></div>';
    }
    if (b.type === 'button') {
      return '<button class="box btn' + (b.active ? ' active' : '') + '" data-btn="' + id + '"' + (b.confirm ? ' data-confirm="1"' : '') +
        ' title="' + esc(b.label || '') + '" aria-label="' + esc(b.label || '') + '">' +
        '<ha-icon icon="' + esc(b.icon || 'mdi:gesture-tap') + '"></ha-icon>' + lbl(b.label, b.showLabel) + '</button>';
    }
    // info
    return '<div class="box info"' + (b.entity ? ' data-info="' + esc(b.entity) + '"' : '') + ' title="' + esc(b.title || '') + '">' +
      (b.icon ? '<ha-icon icon="' + esc(b.icon) + '"></ha-icon>' : '') + '<span class="lbl">' + esc(b.text) + '</span></div>';
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const root = this.shadowRoot;
    // Açık bir seçim listesi varken yeniden çizme (iPad'de liste kapanır); seçim bitince çizilir
    const ae = root.activeElement;
    if (ae && ae.tagName === 'SELECT') { this._dirty = true; return; }
    this._dirty = false;
    // İskelet bir kez kurulur: hale öğesi hep aynı kalır, animasyonu durum değişince baştan başlamaz
    if (!this._card) {
      root.innerHTML = '<style>' + CSS + '</style><ha-card><div class="halo"></div><div class="content"></div></ha-card>';
      this._card = root.querySelector('ha-card');
      this._halo = root.querySelector('.halo');
      this._content = root.querySelector('.content');
    }
    const c = this._config, lang = pickLang(this._hass, c.language);
    let v;
    try { v = this.view(lang); } catch (e) { v = { name: c.name || this.constructor.TYPE, sec: [String(e && e.message || e)], icon: { mdi: 'mdi:alert' }, band: BANDS.alarm, boxes: [] }; }
    const bnd = v.band || BANDS.green;
    const hs = this._haloStyle(v, bnd);
    const alarm = hs.eff === 'blink';
    const light = this._hass.themes && this._hass.themes.darkMode === false;
    const icon = this._icon(v);
    const iconHtml = icon.svg ? svgIcon(icon.svg) : '<ha-icon icon="' + esc(icon.mdi) + '"></ha-icon>';
    // Alt yazı parçaları kendi içinde bölünmesin diye boşluklar bölünmez boşluk olur; satır yalnız " · " aralarında kırılır
    const sec = (v.sec || []).filter((x) => x !== '' && x !== null && x !== undefined).map((x) => String(x).replace(/ /g, ' ')).join(' · ');
    const boxes = (v.boxes || []).filter(Boolean).map((b) => this._mapBox(b));
    v.boxes = boxes;
    const haloK = v.haloK !== undefined ? v.haloK : 1;
    const hasPwr = c.show_power && v.powerIcon !== null;
    this._compact = !boxes.length;
    this._card.className = (v.on ? 'on' : 'off') + (alarm ? ' alarm' : '') + (hs.eff === 'still' ? ' still' : '') + (light ? ' light' : '') + (hasPwr ? '' : ' nopwr') + (boxes.length ? '' : ' compact');
    this._card.setAttribute('style', '--temp-rgb:' + hs.rgb + ';--tint-rgb:' + tint(hs.rgb) + ';--halo-dur:' + hs.dur + 's;--halo-k:' + haloK);
    this._halo.style.display = c.show_halo && hs.eff !== 'none' ? '' : 'none';
    this._content.innerHTML =
      '<div class="top"><div class="ic" data-more="1">' + iconHtml + '</div>' +
      '<div class="txt" data-more="1"><div class="name">' + esc(c.name || v.name || '') + '</div><div class="sec">' + esc(sec) + '</div></div>' +
      (hasPwr ? '<button class="pwr' + (v.on ? ' on' : '') + '" id="pwr" aria-label="' + esc(v.powerTitle || t(lang, 'power')) + '"' +
        (v.disabled ? ' disabled' : '') + '><ha-icon icon="' + esc(c.power_icon || v.powerIcon || 'mdi:power') + '"></ha-icon></button>' : '') +
      '</div>' + (boxes.length ? '<div class="bottom' + (v.disabled ? ' dis' : '') + '">' + boxes.map((b) => this._boxHtml(b, c.show_labels)).join('') + '</div>' : '');
    this._bind(v, lang);
    this._fit();
    if (window.requestAnimationFrame) requestAnimationFrame(() => this._fit());
  }

  _bind(v, lang) {
    const root = this.shadowRoot;
    const each = (sel, fn) => { const l = root.querySelectorAll(sel); for (let i = 0; i < l.length; i++) fn(l[i]); };
    const pwr = root.getElementById('pwr');
    if (pwr) pwr.addEventListener('click', (e) => { e.stopPropagation(); this.power(); });
    const mi = v.moreInfo !== undefined ? v.moreInfo : this._config.entity;
    if (mi) each('[data-more]', (el) => { el.style.cursor = 'pointer'; el.addEventListener('click', () => moreInfo(this, mi)); });
    each('[data-step]', (el) => el.addEventListener('click', () => this.onStep(el.getAttribute('data-step'), Number(el.getAttribute('data-dir')))));
    each('[data-sel]', (el) => {
      el.addEventListener('change', () => {
        const id = el.getAttribute('data-sel'), box = (v.boxes || []).filter((b) => b && b.id === id)[0];
        const opt = box && box.options.filter((o) => o.value === el.value)[0];
        if (opt && opt.icon) { const ic = root.getElementById(id + '-ic'); if (ic) ic.setAttribute('icon', opt.icon); }
        const lb = root.getElementById(id + '-lbl'); if (lb && opt) lb.textContent = opt.label;
        this.onSelect(id, el.value);
        el.blur();
      });
      // Liste açıkken gelen güncellemeler beklemişse şimdi çiz
      el.addEventListener('blur', () => { if (this._dirty) setTimeout(() => this._render(), 0); });
    });
    each('[data-btn]', (el) => el.addEventListener('click', () => {
      const id = el.getAttribute('data-btn');
      if (el.getAttribute('data-confirm') && !el.classList.contains('ask')) {
        // Riskli işlem: ilk dokunuşta "Emin misin?", 3 sn içinde ikinci dokunuş onaylar
        el.classList.add('ask');
        el.classList.remove('tight');
        const lb = el.querySelector('.lbl'); const old = lb ? lb.textContent : null;
        if (lb) lb.textContent = t(lang, 'confirm'); else el.insertAdjacentHTML('beforeend', '<span class="lbl">' + esc(t(lang, 'confirm')) + '</span>');
        setTimeout(() => { el.classList.remove('ask'); const l2 = el.querySelector('.lbl'); if (l2) { if (old === null) l2.parentNode.removeChild(l2); else l2.textContent = old; } this._fit(); }, 3000);
        return;
      }
      el.classList.remove('ask');
      this.onButton(id);
    }));
    each('[data-info]', (el) => { el.style.cursor = 'pointer'; el.addEventListener('click', () => moreInfo(this, el.getAttribute('data-info'))); });
  }
}

// ---------------------------------------------------------------------------
// Ortak editör: kartın schema() ve varsayılanlarıyla çalışır. HA'nın kendi ha-form bileşeni (ek bağımlılık değil).
class LemurEditor extends HTMLElement {
  setConfig(config) { this._config = Object.assign({}, config); this._render(); }
  set hass(h) { this._hass = h; if (this._form) this._form.hass = h; else this._render(); }

  // İç içe ayar grupları: kartın kendi grupları + renk ve hale (tones)
  _nested(cfg, lang) {
    const K = this.constructor.cardClass, N = Object.assign({}, K.nested(cfg, this._hass));
    const tl = K.toneList(lang, cfg, this._hass) || [];
    if (tl.length) {
      N.tones = {};
      tl.forEach((x) => { N.tones[x.key] = { effect: x.effect || 'auto' }; });
    }
    return N;
  }

  _clean(cfg) {
    const K = this.constructor.cardClass, D = K.allDefaults(), N = this._nested(cfg, pickLang(this._hass, cfg.language));
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const empty = (x) => x === '' || x === null || x === undefined || (Array.isArray(x) && !x.length);
    // Varsayılanla aynı ya da boş olan alt alanları at; boş kalan grubu tamamen kaldır (iki seviyeye kadar)
    const strip = (val, def) => {
      const out = {};
      Object.keys(val || {}).forEach((x) => {
        let w = val[x];
        const d = def ? def[x] : undefined;
        if (w && typeof w === 'object' && !Array.isArray(w)) { w = strip(w, d && typeof d === 'object' ? d : {}); if (!Object.keys(w).length) return; }
        else if (empty(w) || same(w, d)) return;
        out[x] = w;
      });
      return out;
    };
    Object.keys(N).forEach((k) => {
      const v = strip(cfg[k] || {}, N[k]);
      if (Object.keys(v).length) cfg[k] = v; else delete cfg[k];
    });
    Object.keys(D).forEach((k) => {
      if (Array.isArray(D[k]) && Array.isArray(cfg[k]) && cfg[k].join() === D[k].join()) delete cfg[k];
      else if (cfg[k] === D[k]) delete cfg[k];
    });
    Object.keys(cfg).forEach((k) => {
      const x = cfg[k];
      if (x === '' || x === undefined || x === null || (Array.isArray(x) && !x.length) || (typeof x === 'object' && !Array.isArray(x) && !Object.keys(x).length)) delete cfg[k];
    });
    return cfg;
  }

  _render() {
    if (!this._hass || !this._config) return;
    const K = this.constructor.cardClass;
    const lang = pickLang(this._hass, this._config.language);
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => { if (s.label) return s.label; const v = tMaybe(lang, 'ed_' + s.name); return v !== null ? v : (s.title || s.name); };
      this._form.addEventListener('value-changed', (ev) => {
        const prev = this._config, next = Object.assign({}, prev, ev.detail.value), R = K.RESETS;
        // Cihaz ya da hazır ayar değişince ona bağlı iç içe grup (ör. sensör bölgeleri) eskisinden kalmasın
        Object.keys(R).forEach((k) => { if (R[k].some((f) => String(prev[f] || '') !== String(next[f] || ''))) delete next[k]; });
        const cfg = this._clean(next);
        this._config = cfg;
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
        this._render();
      });
      this.appendChild(this._form);
    }
    const N = this._nested(this._config, lang), data = Object.assign({}, K.allDefaults(), this._config);
    const isObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
    Object.keys(N).forEach((k) => {
      // Varsayılanların üstüne kullanıcının değerleri; durum grupları (tones) bir seviye daha birleşir
      const cur = this._config[k] || {}, d = {};
      Object.keys(N[k]).forEach((x) => { d[x] = isObj(N[k][x]) ? Object.assign({}, N[k][x]) : N[k][x]; });
      Object.keys(cur).forEach((x) => { d[x] = isObj(cur[x]) && isObj(d[x]) ? Object.assign(d[x], cur[x]) : cur[x]; });
      data[k] = d;
    });
    // Renk seçici ad ya da #rrggbb gösterir; YAML'da [r,g,b] ya da "r,g,b" yazılmışsa #rrggbb'ye çevir
    const toPick = (v) => { if (v === undefined || v === null || v === '') return undefined; if (typeof v === 'string' && !/,/.test(v)) return v; const p = parseColor(v); return p ? rgbHex(p) : undefined; };
    data.color = toPick(data.color);
    if (data.tones) Object.keys(data.tones).forEach((x) => { const o = data.tones[x]; if (o && o.color !== undefined) o.color = toPick(o.color); });
    let schema = K.schema(lang, this._config, this._hass);
    const tl = K.toneList(lang, this._config, this._hass) || [];
    const cs = SCH.colors(lang, tl), ai = schema.map((x) => x && x.name).indexOf('adv');
    schema = ai >= 0 ? schema.slice(0, ai).concat([cs], schema.slice(ai)) : schema.concat([cs]);
    this._form.hass = this._hass;
    this._form.schema = schema;
    this._form.data = data;
  }
}

// Editör şemasında sık kullanılan parçalar
const SCH = {
  entity: (name, domains, extra) => ({ name: name, selector: { entity: Object.assign({ domain: domains }, extra || {}) } }),
  entities: (name, domains) => ({ name: name, selector: { entity: { domain: domains, multiple: true } } }),
  text: (name) => ({ name: name, selector: { text: {} } }),
  icon: () => ({ name: 'icon', selector: { icon: {} } }),
  bool: (name) => ({ name: name, selector: { boolean: {} } }),
  num: (name, min, max, step, unit) => ({ name: name, selector: { number: { min: min, max: max, step: step || 1, mode: 'box', unit_of_measurement: unit || '' } } }),
  select: (name, lang, values, prefix) => ({ name: name, selector: { select: { mode: 'dropdown',
    options: values.map((x) => ({ value: x, label: t(lang, (prefix || '') + x) })) } } }),
  color: (name, lang) => ({ name: name, selector: { select: { mode: 'dropdown', options: BAND_NAMES.map((x) => ({ value: x, label: t(lang, 'c_' + x) })) } } }),
  // Görünüm bölümü: her kartın ortak anahtarları + kartın kendi anahtarları
  appearance: (lang, extra) => ({ type: 'expandable', name: 'appearance', flatten: true, title: t(lang, 'ed_appearance'), schema: [
    { type: 'grid', name: '', flatten: true, schema: ['show_power', 'show_halo', 'show_labels'].concat(extra || []).map((k) => ({ name: k, selector: { boolean: {} } })) },
    { type: 'grid', name: '', flatten: true, schema: [{ name: 'icon', selector: { icon: {} } }, { name: 'power_icon', selector: { icon: {} } },
      { name: 'icon_on', selector: { icon: {} } }, { name: 'icon_off', selector: { icon: {} } }] },
    { name: 'icons', selector: { object: {} } },
    { name: 'language', selector: { select: { mode: 'dropdown', options: [{ value: 'auto', label: t(lang, 'ed_lang_auto') }, { value: 'tr', label: 'Türkçe' }, { value: 'en', label: 'English' }] } } }] }),
  // Renkler ve hale: kartın tek rengi ve hareketi, durum başına renk ve hareket
  colors: (lang, tones) => {
    const eff = { select: { mode: 'dropdown', options: EFFECTS.map((x) => ({ value: x, label: t(lang, 'ef_' + x) })) } };
    const col = { ui_color: { include_state: false, include_none: false } };
    const sch = [{ type: 'grid', name: '', flatten: true, schema: [{ name: 'color', selector: col }, { name: 'effect', selector: eff }] }];
    if (tones.length) {
      sch.push({ type: 'expandable', name: 'tones', title: t(lang, 'ed_tones'), schema: tones.map((x) => ({ type: 'grid', name: x.key, schema: [
        { name: 'color', label: x.label + ' · ' + t(lang, 'ed_tone_color'), selector: col },
        { name: 'effect', label: x.label + ' · ' + t(lang, 'ed_tone_effect'), selector: eff }] })) });
    }
    return { type: 'expandable', name: 'colors_sec', flatten: true, title: t(lang, 'ed_colors'), schema: sch };
  },
  // Gelişmiş bölümü: kartın kendi alanları + bağlantı kontrolü (her kartta)
  advanced: (lang, extra) => ({ type: 'expandable', name: 'adv', flatten: true, title: t(lang, 'ed_advanced'), schema: (extra || []).concat([
    { name: 'last_seen_sensor', selector: { entity: { domain: ['sensor'], device_class: 'timestamp' } } },
    { name: 'stale_after', selector: { number: { min: 0, max: 86400, step: 60, mode: 'box', unit_of_measurement: 's' } } }]) })
};

// Kartı ve editörünü kaydeder, HA'nın "Kart ekle" listesine ekler
function registerCard(cls, info) {
  const type = cls.TYPE.replace(/^lemur-/, 'lemur-hd-');
  if (!customElements.get(type)) customElements.define(type, cls);
  if (!customElements.get(type + '-editor')) {
    const Ed = class extends LemurEditor {};
    Ed.cardClass = cls;
    customElements.define(type + '-editor', Ed);
  }
  return;  // gömülü kopya Kart ekle listesine girmez
  window.customCards = window.customCards || [];
  if (window.customCards.some((x) => x.type === type)) return;
  const L = () => { const ha = document.querySelector('home-assistant'); return pickLang(ha && ha.hass); };
  window.customCards.push({ type: type, preview: true, documentationURL: DOCS_URL,
    get name() { return info[L()].name; }, get description() { return info[L()].desc; } });
}

// İklim kartı: klima ve petek (radyatör vanası / termostat).
// Konfor hesabı core/comfort.js'te (projenin kendi formülü).

addText({
  very_cold: 'Çok soğuk', cool: 'Serin', comfortable: 'Konforlu', humid: 'Nemli', dry: 'Kuru', warm: 'Biraz sıcak', hot: 'Sıcak',
  st_heating: 'Isıtıyor', st_cooling: 'Soğutuyor', st_idle: 'Bekliyor',
  mode: 'Mod', fan: 'Fan', target: 'Hedef',
  m_off: 'Kapalı', m_heat: 'Isıtma', m_cool: 'Soğutma', m_heat_cool: 'Isıtma/Soğutma', m_auto: 'Otomatik',
  m_dry: 'Nem alma', m_fan_only: 'Fan', m_unavailable: 'Bağlantı yok', m_unknown: 'Bilinmiyor',
  k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek', rs_panel: 'Panel', rs_sectional: 'Dilimli',
  ed_kind: 'Kart tipi', ed_radiator_style: 'Petek simgesi',
  ed_temperature_sensor: 'Sıcaklık sensörü (boşsa cihazdan)', ed_humidity_sensor: 'Nem sensörü (boşsa cihazdan)',
  ed_outdoor_sensor: 'Dış sıcaklık sensörü (petek eşiklerini kaydırır)',
  ed_show_target: 'Hedef sıcaklık', ed_show_hvac_modes: 'Mod seçici', ed_show_fan_modes: 'Fan hızı seçici',
  ed_hvac_modes: 'Mod listesinde gösterilecek modlar', ed_sensor_stale_after: 'Sensörden bu kadar saniye haber gelmezse "Sensör yok"',
  ed_comfort: 'Konfor eşikleri (hissedilen, °C)', ed_radiator_bands: 'Petek renk eşikleri (°C)',
  ed_cold: 'Çok soğuk sınırı', ed_cool: 'Serin sınırı', ed_warm: 'Biraz sıcak başlangıcı', ed_hot: 'Sıcak başlangıcı',
  ed_humid_dewpoint: 'Nemli: çiy noktası en az', ed_dry_humidity: 'Kuru: nem en çok', ed_very_cold: 'Çok soğuk sınırı',
  rb_very_cold: 'Buz mavisi: bunun altı', rb_cold: 'Mavi: bunun altı', rb_comfort: 'Yeşil: bunun altı', rb_warm: 'Sarı: bunun altı (üstü kırmızı)'
}, {
  very_cold: 'Very cold', cool: 'Cool', comfortable: 'Comfortable', humid: 'Humid', dry: 'Dry', warm: 'A bit warm', hot: 'Hot',
  st_heating: 'Heating', st_cooling: 'Cooling', st_idle: 'Idle',
  mode: 'Mode', fan: 'Fan', target: 'Target',
  m_off: 'Off', m_heat: 'Heat', m_cool: 'Cool', m_heat_cool: 'Heat/Cool', m_auto: 'Auto',
  m_dry: 'Dry', m_fan_only: 'Fan', m_unavailable: 'No connection', m_unknown: 'Unknown',
  k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator', rs_panel: 'Panel', rs_sectional: 'Sectional',
  ed_kind: 'Card type', ed_radiator_style: 'Radiator icon',
  ed_temperature_sensor: 'Temperature sensor (device if empty)', ed_humidity_sensor: 'Humidity sensor (device if empty)',
  ed_outdoor_sensor: 'Outdoor temperature sensor (shifts radiator thresholds)',
  ed_show_target: 'Target temperature', ed_show_hvac_modes: 'Mode selector', ed_show_fan_modes: 'Fan speed selector',
  ed_hvac_modes: 'Modes shown in the mode list', ed_sensor_stale_after: 'Show "No sensor" after this many seconds without news',
  ed_comfort: 'Comfort thresholds (feels-like, °C)', ed_radiator_bands: 'Radiator colour thresholds (°C)',
  ed_cold: 'Very cold below', ed_cool: 'Cool below', ed_warm: 'A bit warm from', ed_hot: 'Hot from',
  ed_humid_dewpoint: 'Humid: dew point at least', ed_dry_humidity: 'Dry: humidity at most', ed_very_cold: 'Very cold below',
  rb_very_cold: 'Ice blue below', rb_cold: 'Blue below', rb_comfort: 'Green below', rb_warm: 'Yellow below (red above)'
});

const MODE_ICONS = { cool: 'mdi:snowflake', heat: 'mdi:fire', dry: 'mdi:water-percent', fan_only: 'mdi:fan',
  heat_cool: 'mdi:sun-snowflake-variant', auto: 'mdi:autorenew', off: 'mdi:power-standby' };
const modeIcon = (x) => MODE_ICONS[x] || 'mdi:air-conditioner';

// Aç / kapat: cihaz destekliyorsa climate.turn_on/turn_off, desteklemiyorsa set_hvac_mode
// (TURN_OFF = 128, TURN_ON = 256; bazı termostat vanaları bunları desteklemez)
function climateOff(card, ids) {
  ids.forEach((id) => {
    const st = card.st(id); if (!st) return;
    const f = num(st.attributes.supported_features) || 0;
    if (f & 128) card.call('climate', 'turn_off', { entity_id: id });
    else card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: 'off' });
  });
}
function climateOn(card, ids, mode) {
  ids.forEach((id) => {
    const st = card.st(id); if (!st) return;
    const f = num(st.attributes.supported_features) || 0, modes = (st.attributes.hvac_modes || []).filter((x) => x !== 'off');
    if (mode && modes.indexOf(mode) >= 0) card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: mode });
    else if (f & 256) card.call('climate', 'turn_on', { entity_id: id });
    // Klimada soğutma, petekte (tek mod) ısıtma; yoksa ilk mod
    else if (modes.length) card.call('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: modes.indexOf('cool') >= 0 ? 'cool' : modes[0] });
  });
}

class LemurClimateCard extends LemurCard {
  static get TYPE() { return 'lemur-climate-card'; }
  static get DOMAINS() { return ['climate']; }
  static get DEFAULTS() {
    return {
      kind: 'auto',               // auto | ac | radiator (auto: hvac_modes içinde cool varsa klima)
      radiator_style: 'panel',    // panel | sectional
      entities: [],
      temperature_sensor: '',
      humidity_sensor: '',
      outdoor_sensor: '',
      hvac_modes: ['heat', 'cool', 'dry', 'fan_only'],
      show_target: true,
      show_hvac_modes: true,
      show_fan_modes: true,
      sensor_stale_after: 0
    };
  }
  static nested() { return { comfort: COMFORT_DEFAULTS, radiator_bands: { very_cold: 15, cold: 18, comfort: 24, warm: 26 } }; }
  static schema(lang) {
    const n = (name, min, max) => SCH.num(name, min, max, 0.5, '°C');
    return [
      Object.assign(SCH.entity('entity', ['climate']), { required: true }),
      SCH.entities('entities', ['climate']),
      SCH.text('name'),
      { type: 'grid', name: '', flatten: true, schema: [SCH.select('kind', lang, ['auto', 'ac', 'radiator'], 'k_'), SCH.select('radiator_style', lang, ['panel', 'sectional'], 'rs_')] },
      SCH.entity('temperature_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.entity('humidity_sensor', ['sensor'], { device_class: 'humidity' }),
      SCH.entity('outdoor_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.appearance(lang, ['show_target', 'show_hvac_modes', 'show_fan_modes']),
      { name: 'hvac_modes', selector: { select: { multiple: true, mode: 'list',
        options: ['heat', 'cool', 'dry', 'fan_only', 'heat_cool', 'auto', 'off'].map((x) => ({ value: x, label: t(lang, 'm_' + x) })) } } },
      { type: 'expandable', name: 'comfort', title: t(lang, 'ed_comfort'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30), SCH.num('dry_humidity', 0, 100, 1, '%')] },
      // Petek alanları konfor alanlarıyla aynı adı taşıdığı için etiketleri ayrı verilir
      { type: 'expandable', name: 'radiator_bands', title: t(lang, 'ed_radiator_bands'), schema: [
        Object.assign(n('very_cold', 0, 40), { label: t(lang, 'rb_very_cold') }), Object.assign(n('cold', 0, 40), { label: t(lang, 'rb_cold') }),
        Object.assign(n('comfort', 0, 40), { label: t(lang, 'rb_comfort') }), Object.assign(n('warm', 0, 40), { label: t(lang, 'rb_warm') })] },
      SCH.advanced(lang, [SCH.num('sensor_stale_after', 0, 86400, 60, 's')])
    ];
  }

  ids() {
    const c = this._config;
    return [c.entity].concat(c.entities || [], [c.temperature_sensor, c.humidity_sensor, c.outdoor_sensor]);
  }

  // Renk ve hale ayarlarında gösterilen durumlar
  static toneList(lang, cfg, hass) {
    const st = hass && cfg.entity ? hass.states[cfg.entity] : null;
    const kind = cfg.kind && cfg.kind !== 'auto' ? cfg.kind : ((st && st.attributes.hvac_modes || []).indexOf('cool') >= 0 ? 'ac' : 'radiator');
    const L = (k, b, e) => ({ key: k, label: t(lang, k === 'off' ? 'st_off' : k === 'lost' ? 'st_lost' : 'tn_' + k), band: b, effect: e || 'auto' });
    const zones = kind === 'ac' ? [L('cold', 'blue'), L('comfort', 'green'), L('warm', 'yellow'), L('hot', 'red')]
      : [L('very_cold', 'ice'), L('cold', 'blue'), L('comfort', 'green'), L('warm', 'yellow'), L('hot', 'red'), L('heating', null)];
    return zones.concat([L('off', null), L('lost', 'alarm', 'blink')]);
  }

  _model() {
    const c = this._config, h = this._hass;
    const ents = [c.entity].concat(c.entities || []);
    const main = this.st(c.entity), a = main ? main.attributes : {};
    const kind = c.kind !== 'auto' ? c.kind : ((a.hvac_modes || []).indexOf('cool') >= 0 ? 'ac' : 'radiator');
    // Sıcaklık HA'nın biriminde okunur (°C ya da °F); konfor ve renk hesabı için °C'ye çevrilir
    let tmp = stateNum(h, c.temperature_sensor); if (tmp === null) tmp = num(a.current_temperature);
    const unit = tempUnit(h), tc = toC(tmp, unit);
    let rh = stateNum(h, c.humidity_sensor); if (rh === null) rh = num(a.current_humidity);
    const outdoor = stateNum(h, c.outdoor_sensor);
    const lost = ents.some((id) => this.isLost(id));
    const allDead = ents.every((id) => isDead(this.st(id)));
    const sensorLost = !!c.temperature_sensor && stale(this.st(c.temperature_sensor), c.sensor_stale_after);
    const onList = ents.filter((id) => !isOff(this.st(id)));
    const busy = onList.some((id) => {
      const x = this.st(id).attributes, act = x.hvac_action;
      if (act === 'heating' || act === 'cooling') return true;
      return !act && num(x.current_temperature) !== null && num(x.temperature) !== null && num(x.current_temperature) < num(x.temperature);
    });
    const m = { kind: kind, t: tmp, unit: unit, rh: rh, isOn: onList.length > 0, lost: lost, allDead: allDead, main: main, a: a, ents: ents };
    if (kind === 'ac') {
      m.band = lost ? BANDS.alarm : acBand(tc === null ? 22 : tc, rh, c.comfort);
      const zk = BAND_TONE[acBand(tc === null ? 22 : tc, rh, c.comfort).name];
      m.tone = lost ? ['lost'] : (m.isOn ? [zk] : ['off', zk]);
      m.icon = { mdi: lost ? 'mdi:air-conditioner' : modeIcon(main ? main.state : '') };
      m.label = lost ? 'st_lost' : (tc === null ? '' : comfortKey(tc, rh, c.comfort));
    } else {
      let st = !m.isOn ? 'st_off' : (busy ? 'st_heating' : 'st_idle');
      if (lost) st = 'st_lost'; else if (sensorLost) st = 'st_sensor';
      m.band = radiatorBand(tc === null ? 20 : tc, toC(outdoor, unit), c.radiator_bands, lost || sensorLost);
      const zk = BAND_TONE[radiatorBand(tc === null ? 20 : tc, toC(outdoor, unit), c.radiator_bands, false).name];
      m.tone = (lost || sensorLost) ? ['lost'] : (!m.isOn ? ['off', zk] : (busy ? ['heating', zk] : [zk]));
      const base = c.radiator_style === 'sectional' ? 'sectional' : 'panel';
      m.icon = st === 'st_heating' ? { mdi: 'mdi:fire' } : { svg: base + (st === 'st_off' ? '-off' : (st === 'st_lost' || st === 'st_sensor') ? '-lost' : '') };
      m.label = st;
    }
    return m;
  }

  view(lang) {
    const c = this._config, m = this._model(), a = m.a, main = m.main;
    this._m = m;
    const sec = [m.label ? t(lang, m.label) : ''];
    if (m.t !== null) sec.push(round(m.t, 1) + ' ' + m.unit);
    if (m.rh !== null && m.rh > 0) sec.push(pct(Math.round(m.rh), lang));
    const boxes = [];
    const target = num(a.temperature);
    if (c.show_target && target !== null) boxes.push({ type: 'step', id: 'tgt', value: target + '°' });
    if (m.kind === 'ac' && c.show_hvac_modes) {
      const modes = (a.hvac_modes || []).filter((x) => c.hvac_modes.indexOf(x) >= 0);
      const cur = main ? main.state : '';
      if (modes.length) boxes.push({ type: 'select', id: 'mode', title: t(lang, 'mode'), icon: modeIcon(cur), label: t(lang, 'm_' + cur), value: cur,
        options: modes.map((x) => ({ value: x, label: t(lang, 'm_' + x), icon: modeIcon(x) })) });
    }
    if (m.kind === 'ac' && c.show_fan_modes && (a.fan_modes || []).length) {
      boxes.push({ type: 'select', id: 'fan', title: t(lang, 'fan'), icon: fanIcon(a.fan_mode || ''),
        label: a.fan_mode ? fanLabel(lang, a.fan_mode) : t(lang, 'fan'), value: a.fan_mode,
        options: a.fan_modes.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    }
    // Simge eşlemesi anahtarı: klimada mod (cool, heat...), petekte durum (heating, idle, off, lost, sensor)
    const state = m.kind === 'ac' ? (m.lost ? 'lost' : (main ? main.state : '')) : m.label.replace('st_', '');
    return { name: a.friendly_name || c.entity, sec: sec, icon: m.icon, state: state, tone: m.tone, band: m.band, on: m.isOn,
      disabled: m.kind === 'ac' ? m.lost : m.allDead, boxes: boxes };
  }

  power() {
    const m = this._m;
    if (m.isOn) return climateOff(this, m.ents);
    return climateOn(this, m.ents, m.kind === 'radiator' ? 'heat' : null);
  }

  onStep(id, dir) {
    const a = this._m.a, step = num(a.target_temp_step) || 0.5;
    this.stepValue('tgt', num(a.temperature), dir * step, num(a.min_temp) !== null ? num(a.min_temp) : 5, num(a.max_temp) !== null ? num(a.max_temp) : 35,
      (v) => v + '°', (v) => this.call('climate', 'set_temperature', { entity_id: this._m.ents, temperature: v }));
  }

  onSelect(id, value) {
    if (id === 'mode') this.call('climate', 'set_hvac_mode', { entity_id: this._config.entity, hvac_mode: value });
    if (id === 'fan') this.call('climate', 'set_fan_mode', { entity_id: this._config.entity, fan_mode: value });
  }
}

registerCard(LemurClimateCard, {
  tr: { name: 'Lemur İklim Kartı', desc: 'Klima ve petek için konfor göstergeli kart' },
  en: { name: 'Lemur Climate Card', desc: 'Air conditioner and radiator card with comfort display' }
});

// Sensör kartı: herhangi bir sayısal sensör. Değer dört sınırla beş bölgeye ayrılır, her bölgenin rengi ve adı var.
// Hazır ayarlar (preset) sensörün türüne (device_class) göre otomatik seçilir; hepsi editörden değiştirilebilir.
// Hava temizleyici kartı da bu hazır ayarları kullanır.

addText({
  // bölge adları
  z_temperature_0: 'Çok soğuk', z_temperature_1: 'Serin', z_temperature_2: 'Konforlu', z_temperature_3: 'Sıcak', z_temperature_4: 'Çok sıcak',
  z_humidity_0: 'Çok kuru', z_humidity_1: 'Kuru', z_humidity_2: 'İdeal', z_humidity_3: 'Nemli', z_humidity_4: 'Çok nemli',
  z_co2_0: 'Temiz', z_co2_1: 'İyi', z_co2_2: 'Havalandır', z_co2_3: 'Kötü', z_co2_4: 'Çok kötü',
  z_pm25_0: 'İyi', z_pm25_1: 'Orta', z_pm25_2: 'Hassas', z_pm25_3: 'Kötü', z_pm25_4: 'Çok kötü',
  z_pm10_0: 'İyi', z_pm10_1: 'Orta', z_pm10_2: 'Hassas', z_pm10_3: 'Kötü', z_pm10_4: 'Çok kötü',
  z_voc_0: 'İyi', z_voc_1: 'Orta', z_voc_2: 'Hassas', z_voc_3: 'Kötü', z_voc_4: 'Çok kötü',
  z_aqi_0: 'İyi', z_aqi_1: 'Orta', z_aqi_2: 'Hassas', z_aqi_3: 'Kötü', z_aqi_4: 'Çok kötü',
  z_battery_0: 'Kritik', z_battery_1: 'Zayıf', z_battery_2: 'Orta', z_battery_3: 'İyi', z_battery_4: 'Dolu',
  z_power_0: 'Boşta', z_power_1: 'Düşük', z_power_2: 'Orta', z_power_3: 'Yüksek', z_power_4: 'Çok yüksek',
  z_illuminance_0: 'Karanlık', z_illuminance_1: 'Loş', z_illuminance_2: 'Normal', z_illuminance_3: 'Aydınlık', z_illuminance_4: 'Güneşli',
  p_auto: 'Otomatik (sensör türüne göre)', p_temperature: 'Sıcaklık', p_humidity: 'Nem', p_co2: 'CO₂', p_pm25: 'PM2.5', p_pm10: 'PM10',
  p_voc: 'VOC (indeks)', p_aqi: 'Hava kalitesi indeksi', p_battery: 'Pil', p_power: 'Güç (W)', p_illuminance: 'Işık (lx)', p_custom: 'Özel (renk sabit)',
  ed_preset: 'Hazır ayar', ed_levels: 'Bölgeler: sınırlar ve renkler', ed_switch_entity: 'Sağ üstteki düğme bunu açıp kapatsın (isteğe bağlı)',
  ed_show_zone: 'Bölge adını yaz', ed_decimals: 'Ondalık basamak', ed_extra: 'Altta gösterilecek diğer değerler (en çok 3)',
  ed_t1: '1. sınır', ed_t2: '2. sınır', ed_t3: '3. sınır', ed_t4: '4. sınır',
  ed_c1: '1. sınırın altı', ed_c2: '1-2 arası', ed_c3: '2-3 arası', ed_c4: '3-4 arası', ed_c5: '4. sınırın üstü'
}, {
  z_temperature_0: 'Very cold', z_temperature_1: 'Cool', z_temperature_2: 'Comfortable', z_temperature_3: 'Warm', z_temperature_4: 'Hot',
  z_humidity_0: 'Very dry', z_humidity_1: 'Dry', z_humidity_2: 'Ideal', z_humidity_3: 'Humid', z_humidity_4: 'Very humid',
  z_co2_0: 'Fresh', z_co2_1: 'Good', z_co2_2: 'Ventilate', z_co2_3: 'Poor', z_co2_4: 'Very poor',
  z_pm25_0: 'Good', z_pm25_1: 'Moderate', z_pm25_2: 'Sensitive', z_pm25_3: 'Unhealthy', z_pm25_4: 'Very unhealthy',
  z_pm10_0: 'Good', z_pm10_1: 'Moderate', z_pm10_2: 'Sensitive', z_pm10_3: 'Unhealthy', z_pm10_4: 'Very unhealthy',
  z_voc_0: 'Good', z_voc_1: 'Moderate', z_voc_2: 'Sensitive', z_voc_3: 'Unhealthy', z_voc_4: 'Very unhealthy',
  z_aqi_0: 'Good', z_aqi_1: 'Moderate', z_aqi_2: 'Sensitive', z_aqi_3: 'Unhealthy', z_aqi_4: 'Very unhealthy',
  z_battery_0: 'Critical', z_battery_1: 'Low', z_battery_2: 'Medium', z_battery_3: 'Good', z_battery_4: 'Full',
  z_power_0: 'Idle', z_power_1: 'Low', z_power_2: 'Medium', z_power_3: 'High', z_power_4: 'Very high',
  z_illuminance_0: 'Dark', z_illuminance_1: 'Dim', z_illuminance_2: 'Normal', z_illuminance_3: 'Bright', z_illuminance_4: 'Sunny',
  p_auto: 'Automatic (by sensor type)', p_temperature: 'Temperature', p_humidity: 'Humidity', p_co2: 'CO₂', p_pm25: 'PM2.5', p_pm10: 'PM10',
  p_voc: 'VOC (index)', p_aqi: 'Air quality index', p_battery: 'Battery', p_power: 'Power (W)', p_illuminance: 'Light (lx)', p_custom: 'Custom (fixed colour)',
  ed_preset: 'Preset', ed_levels: 'Zones: limits and colours', ed_switch_entity: 'Top-right button switches this (optional)',
  ed_show_zone: 'Show zone name', ed_decimals: 'Decimal places', ed_extra: 'Other values shown below (up to 3)',
  ed_t1: 'Limit 1', ed_t2: 'Limit 2', ed_t3: 'Limit 3', ed_t4: 'Limit 4',
  ed_c1: 'Below limit 1', ed_c2: 'Between 1 and 2', ed_c3: 'Between 2 and 3', ed_c4: 'Between 3 and 4', ed_c5: 'Above limit 4'
});

// Hazır ayarlar: 4 sınır, 5 renk, simge
const PRESETS = {
  temperature: { t: [16, 19, 26, 30], c: ['ice', 'blue', 'green', 'yellow', 'red'], icon: 'mdi:thermometer' },
  humidity:    { t: [25, 35, 60, 70], c: ['orange', 'yellow', 'green', 'blue', 'purple'], icon: 'mdi:water-percent' },
  co2:         { t: [600, 1000, 1500, 2000], c: ['green', 'green', 'yellow', 'orange', 'red'], icon: 'mdi:molecule-co2' },
  pm25:        { t: [9, 35, 55, 125], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:blur' },
  pm10:        { t: [54, 154, 254, 354], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:blur-linear' },
  voc:         { t: [150, 250, 350, 450], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:air-filter' },
  aqi:         { t: [51, 101, 151, 201], c: ['green', 'yellow', 'orange', 'red', 'purple'], icon: 'mdi:air-filter' },
  battery:     { t: [10, 25, 50, 80], c: ['alarm', 'red', 'yellow', 'green', 'green'], icon: 'mdi:battery' },
  power:       { t: [5, 300, 1500, 3000], c: ['grey', 'green', 'yellow', 'orange', 'red'], icon: 'mdi:flash' },
  illuminance: { t: [10, 100, 1000, 10000], c: ['blue', 'ice', 'green', 'yellow', 'orange'], icon: 'mdi:brightness-5' },
  custom:      { t: [null, null, null, null], c: ['green', 'green', 'green', 'green', 'green'], icon: 'mdi:gauge' }
};
const PRESET_NAMES = ['auto', 'temperature', 'humidity', 'co2', 'pm25', 'pm10', 'voc', 'aqi', 'battery', 'power', 'illuminance', 'custom'];
// VOC device_class'ları µg/m³ ya da ppm/ppb ölçer; VOC hazır ayarı ise indeks (1-500) içindir, bu yüzden otomatik seçilmez (elle seçilebilir)
const DC_PRESET = { temperature: 'temperature', humidity: 'humidity', carbon_dioxide: 'co2', pm25: 'pm25', pm10: 'pm10',
  aqi: 'aqi', battery: 'battery', power: 'power', illuminance: 'illuminance' };

function presetOf(hass, id, chosen) {
  if (chosen && chosen !== 'auto' && PRESETS[chosen]) return chosen;
  const st = hass && id ? hass.states[id] : null;
  const dc = st ? st.attributes.device_class : '';
  return DC_PRESET[dc] || 'custom';
}
// Bölge ayarları: hazır ayar + kullanıcının değiştirdikleri
function levelsOf(preset, user) {
  const p = PRESETS[preset], u = user || {}, d = {};
  for (let i = 0; i < 4; i++) d['t' + (i + 1)] = p.t[i];
  for (let i = 0; i < 5; i++) d['c' + (i + 1)] = p.c[i];
  return Object.assign(d, u);
}
// Değeri bölgeye yerleştir: { band, zone (0-4), label }
function zoneOf(lang, preset, levels, v) {
  const L = [levels.t1, levels.t2, levels.t3, levels.t4], C = [levels.c1, levels.c2, levels.c3, levels.c4, levels.c5];
  const i = zoneIndex(v, L);
  return { band: band(zoneColor(v, L, C)), zone: i, label: preset === 'custom' ? '' : t(lang, 'z_' + preset + '_' + i) };
}
// Renk ve hale ayarları için beş bölge (bölge adı ve varsayılan rengi)
function zoneTones(lang, preset, levels) {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const lbl = preset === 'custom' ? '' : tMaybe(lang, 'z_' + preset + '_' + i);
    out.push({ key: 'zone' + i, label: (lbl || t(lang, 'ed_c' + (i + 1))), band: levels['c' + (i + 1)] || 'grey', effect: levels['c' + (i + 1)] === 'alarm' ? 'blink' : 'auto' });
  }
  return out;
}
// Pil simgesi doluluğa göre
function batteryIcon(v) {
  if (v === null) return 'mdi:battery-unknown';
  const s = Math.round(v / 10) * 10;
  return s >= 100 ? 'mdi:battery' : s <= 0 ? 'mdi:battery-outline' : 'mdi:battery-' + s;
}
const DC_ICONS = { temperature: 'mdi:thermometer', humidity: 'mdi:water-percent', carbon_dioxide: 'mdi:molecule-co2', pm25: 'mdi:blur',
  pm10: 'mdi:blur-linear', power: 'mdi:flash', energy: 'mdi:lightning-bolt', illuminance: 'mdi:brightness-5', pressure: 'mdi:gauge',
  voltage: 'mdi:sine-wave', current: 'mdi:current-ac', volatile_organic_compounds: 'mdi:air-filter', volatile_organic_compounds_parts: 'mdi:air-filter',
  moisture: 'mdi:water', gas: 'mdi:meter-gas', water: 'mdi:water' };
function entityIcon(hass, id) {
  const st = hass.states[id];
  if (!st) return 'mdi:help-circle-outline';
  if (st.attributes.icon) return st.attributes.icon;
  const dc = st.attributes.device_class;
  if (dc === 'battery') return batteryIcon(num(st.state));
  return DC_ICONS[dc] || 'mdi:eye';
}
function levelsSchema(lang) {
  const row = (i) => ({ type: 'grid', name: '', flatten: true, schema: [SCH.num('t' + i, -100000, 100000, 0.1), SCH.color('c' + i, lang)] });
  return { type: 'expandable', name: 'levels', title: t(lang, 'ed_levels'), schema: [row(1), row(2), row(3), row(4), SCH.color('c5', lang)] };
}

class LemurSensorCard extends LemurCard {
  static get TYPE() { return 'lemur-sensor-card'; }
  static get DOMAINS() { return ['sensor', 'number', 'input_number']; }
  static get DEFAULTS() { return { preset: 'auto', extra: [], switch_entity: '', show_zone: true, decimals: '' }; }
  static stub(hass) {
    // Önce bilinen türden sayısal bir sensör (sıcaklık, nem, CO2...), yoksa herhangi bir sayısal sensör
    const isNum = (s) => num(s.state) !== null;
    const known = ['temperature', 'humidity', 'carbon_dioxide', 'pm25', 'battery', 'power'];
    for (let i = 0; i < known.length; i++) {
      const id = firstEntity(hass, ['sensor'], (s) => isNum(s) && s.attributes.device_class === known[i]);
      if (id) return { entity: id };
    }
    return { entity: firstEntity(hass, ['sensor'], isNum) || 'sensor.example' };
  }
  static nested(cfg, hass) { return { levels: levelsOf(presetOf(hass, cfg.entity, cfg.preset)) }; }
  static get RESETS() { return { levels: ['entity', 'preset'] }; }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['sensor', 'number', 'input_number']), { required: true }),
      SCH.text('name'),
      SCH.select('preset', lang, PRESET_NAMES, 'p_'),
      { name: 'extra', selector: { entity: { multiple: true } } },
      { name: 'switch_entity', selector: { entity: { domain: ['switch', 'light', 'fan', 'input_boolean', 'humidifier', 'climate'] } } },
      SCH.appearance(lang, ['show_zone']),
      levelsSchema(lang),
      SCH.advanced(lang, [SCH.num('decimals', 0, 4, 1)])
    ];
  }
  ids() { const c = this._config; return [c.entity, c.switch_entity].concat(c.extra || []); }
  static toneList(lang, cfg, hass) {
    const preset = presetOf(hass, cfg.entity, cfg.preset);
    return zoneTones(lang, preset, levelsOf(preset, cfg.levels)).concat([{ key: 'lost', label: t(lang, 'st_lost'), band: 'alarm', effect: 'blink' }]);
  }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity);
    const preset = presetOf(h, c.entity, c.preset), lv = levelsOf(preset, c.levels);
    const lost = this.isLost(c.entity);
    let v = preset === 'power' ? watts(h, c.entity) : stateNum(h, c.entity);
    // Sıcaklık hazır ayarı °C'dir; °F sensörün değeri bölgelemede °C'ye çevrilir
    const vz = preset === 'temperature' && st ? toC(v, st.attributes.unit_of_measurement || '') : v;
    const z = v === null ? { band: BANDS.grey, label: '' } : zoneOf(lang, preset, lv, vz);
    const valTxt = st ? (preset === 'power' && v !== null ? fmtPower(v) : fmtState(h, c.entity, c.decimals, lang)) : '';
    const sw = this.st(c.switch_entity);
    const icon = st && st.attributes.icon ? st.attributes.icon : (preset === 'battery' ? batteryIcon(v) : (DC_ICONS[st && st.attributes.device_class] || PRESETS[preset].icon));
    return {
      name: st ? st.attributes.friendly_name : c.entity,
      sec: lost ? [t(lang, 'st_lost')] : [c.show_zone ? z.label : '', valTxt],
      icon: { mdi: icon }, band: lost ? BANDS.alarm : z.band,
      state: lost ? 'lost' : (v === null ? 'unknown' : 'zone' + z.zone),   // simge eşlemesi: zone0..zone4, lost
      tone: lost ? 'lost' : (v === null ? '' : 'zone' + z.zone),
      on: sw ? !isOff(sw) : true,
      powerIcon: c.switch_entity ? 'mdi:power' : null,
      boxes: (c.extra || []).slice(0, 3).map((id) => ({ type: 'info', icon: entityIcon(h, id), text: fmtState(h, id, null, lang), entity: id, title: friendly(h, id) }))
    };
  }
  power() { if (this._config.switch_entity) this.call('homeassistant', 'toggle', { entity_id: this._config.switch_entity }); }
}

registerCard(LemurSensorCard, {
  tr: { name: 'Lemur Sensör Kartı', desc: 'Herhangi bir sensör; değere göre renk değiştiren hale' },
  en: { name: 'Lemur Sensor Card', desc: 'Any sensor, with a halo that changes colour with the value' }
});

// Hava kartı: hava temizleyici (fan) + hava kalitesi sensörü. Hale sensörün bölgesine göre renk alır
// (sensör kartının hazır ayarları: PM2.5, PM10, CO₂, VOC, AQI). Sensör yoksa: açık yeşil, kapalı gri.

addText({
  speed: 'Hız', preset: 'Program',
  ed_sensor: 'Hava kalitesi sensörü (PM2.5, CO₂...)', ed_show_speed: 'Hız (− %40 +)', ed_show_presets: 'Program seçici'
}, {
  speed: 'Speed', preset: 'Preset',
  ed_sensor: 'Air quality sensor (PM2.5, CO₂...)', ed_show_speed: 'Speed (− 40% +)', ed_show_presets: 'Preset selector'
});

class LemurAirCard extends LemurCard {
  static get TYPE() { return 'lemur-air-card'; }
  static get DOMAINS() { return ['fan']; }
  static get DEFAULTS() { return { sensor: '', preset: 'auto', extra: [], show_speed: true, show_presets: true, show_zone: true }; }
  static nested(cfg, hass) { return { levels: levelsOf(presetOf(hass, cfg.sensor, cfg.preset)) }; }
  static get RESETS() { return { levels: ['sensor', 'preset'] }; }
  static stub(hass) {
    return { entity: firstEntity(hass, ['fan']) || 'fan.example',
      sensor: firstEntity(hass, ['sensor'], (s) => ['pm25', 'carbon_dioxide', 'aqi'].indexOf(s.attributes.device_class) >= 0) };
  }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['fan']), { required: true }),
      SCH.entity('sensor', ['sensor']),
      SCH.text('name'),
      SCH.select('preset', lang, ['auto', 'pm25', 'pm10', 'co2', 'voc', 'aqi', 'humidity', 'custom'], 'p_'),
      { name: 'extra', selector: { entity: { multiple: true } } },
      SCH.appearance(lang, ['show_speed', 'show_presets', 'show_zone']),
      levelsSchema(lang),
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.entity, c.sensor].concat(c.extra || []); }
  static toneList(lang, cfg, hass) {
    const zones = cfg.sensor ? zoneTones(lang, presetOf(hass, cfg.sensor, cfg.preset), levelsOf(presetOf(hass, cfg.sensor, cfg.preset), cfg.levels)) : [];
    return zones.concat([{ key: 'on', label: t(lang, 'st_on'), band: 'green' }, { key: 'off', label: t(lang, 'st_off'), band: null },
      { key: 'lost', label: t(lang, 'st_lost'), band: 'alarm', effect: 'blink' }]);
  }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity), a = st ? st.attributes : {};
    const on = !isOff(st), lost = this.isLost(c.entity);
    const sec = [];
    let bnd = on ? BANDS.green : BANDS.grey, zk = '';
    if (c.sensor) {
      const preset = presetOf(h, c.sensor, c.preset), v = stateNum(h, c.sensor);
      if (v !== null) {
        const z = zoneOf(lang, preset, levelsOf(preset, c.levels), v);
        bnd = z.band; zk = 'zone' + z.zone;
        if (c.show_zone) sec.push(z.label);
      }
      sec.push(fmtState(h, c.sensor, null, lang));
    }
    if (lost) { bnd = BANDS.alarm; sec.unshift(t(lang, 'st_lost')); }
    else if (!on) sec.push(t(lang, 'st_off'));
    else if (a.preset_mode) sec.push(fanLabel(lang, a.preset_mode));
    else if (num(a.percentage) !== null) sec.push(pct(Math.round(num(a.percentage)), lang));
    const boxes = [];
    if (c.show_speed && a.percentage !== undefined) {
      boxes.push({ type: 'step', id: 'spd', value: on && num(a.percentage) !== null ? pct(Math.round(num(a.percentage)), lang) : '—' });
    }
    if (c.show_presets && (a.preset_modes || []).length) {
      boxes.push({ type: 'select', id: 'pre', title: t(lang, 'preset'), icon: a.preset_mode ? fanIcon(a.preset_mode) : 'mdi:tune-variant',
        label: a.preset_mode ? fanLabel(lang, a.preset_mode) : t(lang, 'preset'), value: a.preset_mode,
        options: a.preset_modes.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    }
    (c.extra || []).forEach((id) => { if (boxes.length < 3) boxes.push({ type: 'info', icon: entityIcon(h, id), text: fmtState(h, id, null, lang), entity: id, title: friendly(h, id) }); });
    const tone = lost ? ['lost'] : (zk ? (on ? [zk] : ['off', zk]) : [on ? 'on' : 'off']);
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: on ? 'mdi:air-purifier' : 'mdi:air-purifier-off' }, state: lost ? 'lost' : (on ? 'on' : 'off'), tone: tone, band: bnd, on: on, disabled: lost, boxes: boxes };
  }

  power() { this.call('fan', isOff(this.st(this._config.entity)) ? 'turn_on' : 'turn_off', { entity_id: this._config.entity }); }
  onStep(id, dir) {
    const a = this.st(this._config.entity).attributes, step = num(a.percentage_step) || 10;
    const cur = isOff(this.st(this._config.entity)) ? 0 : (num(a.percentage) || 0);
    const lang = pickLang(this._hass, this._config.language);
    this.stepValue('spd', cur, dir * step, 0, 100, (v) => pct(Math.round(v), lang),
      (v) => this.call('fan', 'set_percentage', { entity_id: this._config.entity, percentage: Math.round(v) }));
  }
  onSelect(id, value) { this.call('fan', 'set_preset_mode', { entity_id: this._config.entity, preset_mode: value }); }
}

registerCard(LemurAirCard, {
  tr: { name: 'Lemur Hava Kartı', desc: 'Hava temizleyici ve hava kalitesi; kaliteye göre renk değiştiren hale' },
  en: { name: 'Lemur Air Card', desc: 'Air purifier and air quality, with a halo that follows the air quality' }
});

// Robot süpürge kartı. Sağ üstteki düğme başlat / duraklat; altta durdur, eve dön, emiş gücü (ya da bul).
// Hale: temizlerken yeşil, eve dönerken mavi, şarj olurken buz mavisi, istasyonda dolu gri, beklerken sarı, hata kırmızı yanıp söner.

addText({
  v_cleaning: 'Temizliyor', v_docked: 'İstasyonda', v_charging: 'Şarj oluyor', v_returning: 'Eve dönüyor', v_paused: 'Duraklatıldı',
  v_idle: 'Bekliyor', v_error: 'Hata', v_start: 'Başlat', v_pause: 'Duraklat', v_stop: 'Durdur', v_home: 'Eve dön', v_locate: 'Bul',
  v_suction: 'Emiş gücü',
  ed_battery_sensor: 'Pil sensörü (boşsa cihazdan)', ed_show_stop: 'Durdur', ed_show_return: 'Eve dön', ed_show_fan_speed: 'Emiş gücü', ed_show_locate: 'Bul'
}, {
  v_cleaning: 'Cleaning', v_docked: 'Docked', v_charging: 'Charging', v_returning: 'Returning', v_paused: 'Paused',
  v_idle: 'Idle', v_error: 'Error', v_start: 'Start', v_pause: 'Pause', v_stop: 'Stop', v_home: 'Go home', v_locate: 'Locate',
  v_suction: 'Suction',
  ed_battery_sensor: 'Battery sensor (device if empty)', ed_show_stop: 'Stop', ed_show_return: 'Go home', ed_show_fan_speed: 'Suction power', ed_show_locate: 'Locate'
});

// VacuumEntityFeature bitleri. Öznitelik hiç yoksa (eski ya da sahte cihaz) hepsi var sayılır.
const VF = { TURN_ON: 1, TURN_OFF: 2, PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, START: 8192 };
const vacFeatures = (a) => (a.supported_features === undefined || a.supported_features === null) ? 0xFFFFFF : (num(a.supported_features) || 0);
// Sağ üst düğme: temizlerken duraklat > durdur > eve dön > kapat; değilse başlat > aç
function vacPower(f, cleaning) {
  if (cleaning) return f & VF.PAUSE ? 'pause' : f & VF.STOP ? 'stop' : f & VF.RETURN ? 'return_to_base' : f & VF.TURN_OFF ? 'turn_off' : null;
  return f & VF.START ? 'start' : f & VF.TURN_ON ? 'turn_on' : null;
}
const VAC_PWR = { pause: ['mdi:pause', 'v_pause'], stop: ['mdi:stop', 'v_stop'], return_to_base: ['mdi:home-import-outline', 'v_home'],
  turn_off: ['mdi:stop', 'v_stop'], start: ['mdi:play', 'v_start'], turn_on: ['mdi:play', 'v_start'] };

class LemurVacuumCard extends LemurCard {
  static get TYPE() { return 'lemur-vacuum-card'; }
  static get DOMAINS() { return ['vacuum']; }
  static get DEFAULTS() { return { battery_sensor: '', show_stop: true, show_return: true, show_fan_speed: true, show_locate: true }; }
  static toneList(lang) {
    const L = (k, b, e) => ({ key: k, label: k === 'lost' ? t(lang, 'st_lost') : t(lang, 'v_' + k), band: b, effect: e || 'auto' });
    return [L('cleaning', 'green'), L('returning', 'blue'), L('charging', 'ice'), L('docked', 'grey'), L('paused', 'yellow'), L('idle', 'yellow'),
      L('error', 'alarm', 'blink'), L('lost', 'alarm', 'blink')];
  }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['vacuum']), { required: true }),
      SCH.text('name'),
      SCH.entity('battery_sensor', ['sensor'], { device_class: 'battery' }),
      SCH.appearance(lang, ['show_stop', 'show_return', 'show_fan_speed', 'show_locate']),
      SCH.advanced(lang)
    ];
  }
  // Pil: önce seçilen sensör, sonra cihazın battery_level özniteliği (HA 2025.8'den beri kullanımdan kalkıyor),
  // sonra aynı adlı pil sensörü (sensor.<süpürge>_battery)
  _battery() {
    const c = this._config, h = this._hass, st = this.st(c.entity), obj = c.entity.split('.')[1];
    let v = stateNum(h, c.battery_sensor);
    if (v === null && st) v = num(st.attributes.battery_level);
    if (v === null) v = stateNum(h, 'sensor.' + obj + '_battery');
    if (v === null) v = stateNum(h, 'sensor.' + obj + '_battery_level');
    return v;
  }
  ids() { const obj = this._config.entity.split('.')[1]; return [this._config.entity, this._config.battery_sensor, 'sensor.' + obj + '_battery', 'sensor.' + obj + '_battery_level']; }

  view(lang) {
    const c = this._config, h = this._hass, st = this.st(c.entity), a = st ? st.attributes : {};
    const lost = this.isLost(c.entity);
    const bat = this._battery();
    let s = st ? st.state : 'unavailable';
    if (s === 'docked' && bat !== null && bat < 100) s = 'charging';
    const BAND = { cleaning: 'green', returning: 'blue', charging: 'ice', docked: 'grey', paused: 'yellow', idle: 'yellow', error: 'alarm' };
    const bnd = lost ? BANDS.alarm : band(BAND[s] || 'grey');
    const cleaning = s === 'cleaning';
    const sec = [lost ? t(lang, 'st_lost') : (tMaybe(lang, 'v_' + s) || prettify(s))];
    if (bat !== null) sec.push(pct(Math.round(bat), lang));
    if (s === 'error' && a.error) sec.push(String(a.error));
    const f = vacFeatures(a), pw = vacPower(f, cleaning);
    const boxes = [];
    if (c.show_stop && (f & VF.STOP) && pw !== 'stop') boxes.push({ type: 'button', id: 'stop', icon: 'mdi:stop', label: t(lang, 'v_stop') });
    if (c.show_return && (f & VF.RETURN)) boxes.push({ type: 'button', id: 'home', icon: 'mdi:home-import-outline', label: t(lang, 'v_home'), active: s === 'returning' });
    if (c.show_fan_speed && (f & VF.FAN) && (a.fan_speed_list || []).length) {
      boxes.push({ type: 'select', id: 'suction', title: t(lang, 'v_suction'), icon: fanIcon(a.fan_speed || ''), label: a.fan_speed ? fanLabel(lang, a.fan_speed) : t(lang, 'v_suction'),
        value: a.fan_speed, options: a.fan_speed_list.map((x) => ({ value: x, label: fanLabel(lang, x), icon: fanIcon(x) })) });
    } else if (c.show_locate && (f & VF.LOCATE)) {
      boxes.push({ type: 'button', id: 'locate', icon: 'mdi:map-marker-radius', label: t(lang, 'v_locate') });
    }
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: s === 'error' ? 'mdi:robot-vacuum-alert' : 'mdi:robot-vacuum' }, state: lost ? 'lost' : s, tone: lost ? 'lost' : s,
      band: bnd, on: cleaning, disabled: lost, powerIcon: pw ? VAC_PWR[pw][0] : null, powerTitle: pw ? t(lang, VAC_PWR[pw][1]) : '', boxes: boxes };
  }

  power() {
    const st = this.st(this._config.entity); if (!st) return;
    const svc = vacPower(vacFeatures(st.attributes), st.state === 'cleaning');
    if (svc) this.call('vacuum', svc, { entity_id: this._config.entity });
  }
  onButton(id) {
    const svc = { stop: 'stop', home: 'return_to_base', locate: 'locate' }[id];
    if (svc) this.call('vacuum', svc, { entity_id: this._config.entity });
  }
  onSelect(id, value) { this.call('vacuum', 'set_fan_speed', { entity_id: this._config.entity, fan_speed: value }); }
}

registerCard(LemurVacuumCard, {
  tr: { name: 'Lemur Robot Süpürge Kartı', desc: 'Robot süpürge: durum, pil, başlat / eve dön' },
  en: { name: 'Lemur Vacuum Card', desc: 'Robot vacuum: status, battery, start / go home' }
});

// Enerji kartı: güneş üretimi, ev tüketimi, şebeke ve batarya. Ana varlığı yok, sensörler seçilir.
// Şebeke: pozitif = şebekeden çekiş, negatif = şebekeye veriş (ters bağlıysa grid_invert).
// Şebeke sensörü yoksa tüketim − üretim − batarya deşarjı olarak hesaplanır.
// Hale: şebekeye veriyor ya da kendine yetiyor yeşil; az çekiş sarı; orta turuncu; çok çekiş kırmızı.

addText({
  tn_import_low: 'Az çekiyor', tn_import_mid: 'Orta çekiyor', tn_import_high: 'Çok çekiyor',
  e_name: 'Enerji', e_pick: 'Ayarlardan sensör seç', e_producing: 'Üretiyor', e_export: 'Şebekeye veriyor', e_self: 'Kendine yetiyor', e_import: 'Şebekeden çekiyor', e_nodata: 'Veri yok',
  e_solar: 'Güneş', e_home: 'Ev', e_grid: 'Şebeke', e_battery: 'Batarya',
  ed_solar_power: 'Güneş üretimi (W/kW)', ed_home_power: 'Ev tüketimi (W/kW)', ed_grid_power: 'Şebeke gücü (W/kW; + çekiş, − veriş)',
  ed_grid_invert: 'Şebeke sensörü ters (+ veriş, − çekiş)', ed_battery_soc: 'Batarya doluluğu (%)', ed_battery_power: 'Batarya gücü (W/kW; + deşarj)',
  ed_battery_invert: 'Batarya gücü ters (+ şarj)', ed_limits: 'Renk sınırları (W)', ed_self_margin: 'Kendine yetiyor sayılan çekiş (en çok)',
  ed_import_mid: 'Turuncu başlangıcı', ed_import_high: 'Kırmızı başlangıcı',
  ed_show_solar: 'Güneş kutusu', ed_show_home: 'Ev kutusu', ed_show_grid: 'Şebeke kutusu', ed_show_battery: 'Batarya kutusu'
}, {
  tn_import_low: 'Importing a little', tn_import_mid: 'Importing more', tn_import_high: 'Importing a lot',
  e_name: 'Energy', e_pick: 'Pick sensors in the settings', e_producing: 'Producing', e_export: 'Exporting', e_self: 'Self-sufficient', e_import: 'Importing', e_nodata: 'No data',
  e_solar: 'Solar', e_home: 'Home', e_grid: 'Grid', e_battery: 'Battery',
  ed_solar_power: 'Solar production (W/kW)', ed_home_power: 'Home consumption (W/kW)', ed_grid_power: 'Grid power (W/kW; + import, − export)',
  ed_grid_invert: 'Grid sensor inverted (+ export, − import)', ed_battery_soc: 'Battery charge (%)', ed_battery_power: 'Battery power (W/kW; + discharge)',
  ed_battery_invert: 'Battery power inverted (+ charge)', ed_limits: 'Colour limits (W)', ed_self_margin: 'Import still counted as self-sufficient (max)',
  ed_import_mid: 'Orange from', ed_import_high: 'Red from',
  ed_show_solar: 'Solar box', ed_show_home: 'Home box', ed_show_grid: 'Grid box', ed_show_battery: 'Battery box'
});

const ENERGY_LIMITS = { self_margin: 100, import_mid: 1000, import_high: 3000 };

class LemurEnergyCard extends LemurCard {
  static get TYPE() { return 'lemur-energy-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() {
    return { solar_power: '', home_power: '', grid_power: '', grid_invert: false, battery_soc: '', battery_power: '', battery_invert: false,
      show_solar: true, show_home: true, show_grid: true, show_battery: true, show_power: false };
  }
  static nested() { return { limits: ENERGY_LIMITS }; }
  static toneList(lang) {
    const L = (k, lb, b, e) => ({ key: k, label: t(lang, lb), band: b, effect: e || 'auto' });
    return [L('export', 'e_export', 'green'), L('self', 'e_self', 'green'), L('import_low', 'tn_import_low', 'yellow'), L('import_mid', 'tn_import_mid', 'orange'),
      L('import_high', 'tn_import_high', 'red'), L('producing', 'e_producing', 'green'), L('nodata', 'e_nodata', 'grey'), L('lost', 'st_lost', 'alarm', 'blink')];
  }
  static stub(hass) {
    const p = (re) => firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'power' && re.test(s.entity_id));
    const any = firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'power');
    const cfg = { solar_power: p(/solar|pv|gunes/i), home_power: p(/home|house|load|ev_|tuketim/i), grid_power: p(/grid|sebeke/i) };
    if (!cfg.solar_power && !cfg.home_power && !cfg.grid_power) cfg.home_power = any;
    Object.keys(cfg).forEach((k) => { if (!cfg[k]) delete cfg[k]; });
    return cfg;
  }
  // Sensör seçilmemişse hata yerine kartta "Ayarlardan sensör seç" yazar
  validate() {}
  static schema(lang) {
    const pw = (n) => SCH.entity(n, ['sensor'], { device_class: 'power' });
    return [
      SCH.text('name'),
      pw('solar_power'), pw('home_power'), pw('grid_power'), SCH.bool('grid_invert'),
      SCH.entity('battery_soc', ['sensor'], { device_class: 'battery' }), pw('battery_power'), SCH.bool('battery_invert'),
      SCH.appearance(lang, ['show_solar', 'show_home', 'show_grid', 'show_battery']),
      { type: 'expandable', name: 'limits', title: t(lang, 'ed_limits'), schema: [
        SCH.num('self_margin', 0, 100000, 10, 'W'), SCH.num('import_mid', 0, 100000, 50, 'W'), SCH.num('import_high', 0, 100000, 50, 'W')] },
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.solar_power, c.home_power, c.grid_power, c.battery_soc, c.battery_power]; }

  _flows() {
    const c = this._config, h = this._hass;
    const solar = watts(h, c.solar_power), home = watts(h, c.home_power);
    let grid = watts(h, c.grid_power); if (grid !== null && c.grid_invert) grid = -grid;
    let batt = watts(h, c.battery_power); if (batt !== null && c.battery_invert) batt = -batt;
    if (grid === null && home !== null) grid = home - (solar || 0) - (batt || 0);
    return { solar: solar, home: home, grid: grid, batt: batt, soc: stateNum(h, c.battery_soc) };
  }

  view(lang) {
    const c = this._config, f = this._flows(), L = Object.assign({}, ENERGY_LIMITS, c.limits || {});
    const main = c.grid_power || c.solar_power || c.home_power;
    if (!main) return { name: t(lang, 'e_name'), sec: [t(lang, 'e_pick')], icon: { mdi: 'mdi:home-lightning-bolt-outline' }, band: BANDS.grey, on: false, powerIcon: null, boxes: [] };
    const lost = this.isLost(main);
    let key = 'e_nodata', bnd = BANDS.grey, amount = null;
    // Yalnız ev sensörü varsa üretim kaynağı yoktur: her şey şebekeden gelir, "kendine yetiyor" denmez
    const homeOnly = !c.solar_power && !c.battery_power && !c.grid_power;
    if (f.grid !== null) {
      if (!homeOnly && f.grid < -L.self_margin) { key = 'e_export'; bnd = BANDS.green; amount = -f.grid; }
      else if (!homeOnly && f.grid <= L.self_margin) { key = 'e_self'; bnd = BANDS.green; }
      else { key = 'e_import'; amount = Math.max(f.grid, 0); bnd = f.grid <= L.self_margin ? BANDS.green : f.grid < L.import_mid ? BANDS.yellow : f.grid < L.import_high ? BANDS.orange : BANDS.red; }
    } else if (f.solar !== null) {
      // Sadece güneş sensörü var: üretimi göster
      key = f.solar > 20 ? 'e_producing' : 'e_nodata'; amount = f.solar > 20 ? f.solar : null; bnd = f.solar > 20 ? BANDS.green : BANDS.grey;
    }
    const boxes = [];
    if (c.show_solar && f.solar !== null) boxes.push({ type: 'info', icon: 'mdi:solar-power', text: fmtPower(f.solar), entity: c.solar_power, title: t(lang, 'e_solar') });
    if (c.show_home && f.home !== null) boxes.push({ type: 'info', icon: 'mdi:home-lightning-bolt-outline', text: fmtPower(f.home), entity: c.home_power, title: t(lang, 'e_home') });
    if (c.show_grid && f.grid !== null) boxes.push({ type: 'info', icon: f.grid < 0 ? 'mdi:transmission-tower-export' : 'mdi:transmission-tower-import',
      text: fmtPower(Math.abs(f.grid)), entity: c.grid_power || c.home_power, title: t(lang, 'e_grid') });
    if (c.show_battery && f.soc !== null) boxes.push({ type: 'info', icon: batteryIcon(f.soc), text: pct(Math.round(f.soc), lang), entity: c.battery_soc, title: t(lang, 'e_battery') });
    // Dört kutu dar gelir: dördü de varsa ev kutusu çıkar (ev tüketimi alt yazıda zaten okunur)
    if (boxes.length > 3) boxes.splice(1, 1);
    return {
      name: t(lang, 'e_name'),
      sec: lost ? [t(lang, 'st_lost')] : [t(lang, key), amount !== null ? fmtPower(amount) : ''],
      icon: { mdi: f.solar !== null && f.solar > 20 ? 'mdi:solar-power-variant' : 'mdi:home-lightning-bolt-outline' },
      state: lost ? 'lost' : key.replace('e_', ''),   // simge eşlemesi: export, self, import, nodata, lost
      tone: lost ? 'lost' : (key === 'e_import' ? (f.grid >= L.import_high ? 'import_high' : f.grid >= L.import_mid ? 'import_mid' : 'import_low') : key.replace('e_', '')),
      band: lost ? BANDS.alarm : bnd, on: true, powerIcon: null, moreInfo: main, boxes: boxes
    };
  }
}

registerCard(LemurEnergyCard, {
  tr: { name: 'Lemur Enerji Kartı', desc: 'Güneş, ev, şebeke ve batarya; şebekeden çekişe göre renk' },
  en: { name: 'Lemur Energy Card', desc: 'Solar, home, grid and battery, coloured by grid import' }
});

// Güvenlik kartı: üç tür cihazla çalışır, ana cihazın türüne göre davranır.
//  - binary_sensor (kapı, pencere, hareket, su kaçağı, duman...): bir ya da birden çok. Açık olanları sayar ve yazar.
//    Tehlike (su, duman, gaz...) kırmızı yanıp söner; açık kapı/pencere sarı; hareket mavi; hepsi kapalı yeşil.
//  - alarm_control_panel: evde / dışarıda kur, kapat. Kurulu mavi, kuruluyor sarı, çalıyor kırmızı yanıp söner.
//  - lock: kilitle / aç. Kilitli yeşil, açık sarı, sıkışmış kırmızı yanıp söner.
// Kilidi açmak ve alarmı kapatmak iki dokunuş ister ("Emin misin?").

addText({
  tn_clear: 'Hepsi kapalı / sorun yok', tn_open: 'Açık bir şey var', tn_motion: 'Hareket', tn_danger: 'Tehlike (su, duman, gaz)',
  tn_disarmed: 'Kurulu değil', tn_armed: 'Kurulu', tn_arming: 'Kuruluyor / bekliyor', tn_triggered: 'Çalıyor',
  tn_locked: 'Kilitli', tn_unlocked: 'Kilit açık', tn_moving: 'Kilitleniyor / açılıyor', tn_jammed: 'Sıkıştı',
  s_group: 'Güvenlik', s_all_closed: 'Hepsi kapalı', s_no_motion: 'Hareket yok', s_all_clear: 'Sorun yok', s_open: 'açık', s_motion: 'Hareket', s_alert: 'Uyarı',
  s_disarmed: 'Kapalı', s_armed_home: 'Evde kurulu', s_armed_away: 'Dışarıda kurulu', s_armed_night: 'Gece kurulu',
  s_armed_vacation: 'Tatil modunda', s_armed_custom_bypass: 'Özel kurulu', s_arming: 'Kuruluyor', s_disarming: 'Kapanıyor',
  s_pending: 'Bekliyor', s_triggered: 'ALARM!', s_code: 'Kod gerekli',
  s_arm_home: 'Evde', s_arm_away: 'Dışarıda', s_arm_night: 'Gece', s_disarm: 'Kapat',
  l_locked: 'Kilitli', l_unlocked: 'Kilit açık', l_locking: 'Kilitleniyor', l_unlocking: 'Açılıyor', l_jammed: 'Sıkıştı', l_open: 'Kapı açık',
  l_opening: 'Kapı açılıyor', l_lock: 'Kilitle', l_unlock: 'Kilidi aç', l_open_door: 'Kapıyı aç',
  ed_show_list: 'Altta cihazları tek tek göster'
}, {
  tn_clear: 'All closed / all clear', tn_open: 'Something open', tn_motion: 'Motion', tn_danger: 'Danger (water, smoke, gas)',
  tn_disarmed: 'Disarmed', tn_armed: 'Armed', tn_arming: 'Arming / pending', tn_triggered: 'Triggered',
  tn_locked: 'Locked', tn_unlocked: 'Unlocked', tn_moving: 'Locking / unlocking', tn_jammed: 'Jammed',
  s_group: 'Security', s_all_closed: 'All closed', s_no_motion: 'No motion', s_all_clear: 'All clear', s_open: 'open', s_motion: 'Motion', s_alert: 'Alert',
  s_disarmed: 'Disarmed', s_armed_home: 'Armed home', s_armed_away: 'Armed away', s_armed_night: 'Armed night',
  s_armed_vacation: 'Vacation', s_armed_custom_bypass: 'Armed custom', s_arming: 'Arming', s_disarming: 'Disarming',
  s_pending: 'Pending', s_triggered: 'ALARM!', s_code: 'Code required',
  s_arm_home: 'Home', s_arm_away: 'Away', s_arm_night: 'Night', s_disarm: 'Disarm',
  l_locked: 'Locked', l_unlocked: 'Unlocked', l_locking: 'Locking', l_unlocking: 'Unlocking', l_jammed: 'Jammed', l_open: 'Door open',
  l_opening: 'Opening', l_lock: 'Lock', l_unlock: 'Unlock', l_open_door: 'Open door',
  ed_show_list: 'Show each device below'
});

const DANGER = ['moisture', 'smoke', 'gas', 'carbon_monoxide', 'safety', 'problem', 'tamper', 'heat'];
const ACTIVITY = ['motion', 'occupancy', 'presence', 'vibration', 'sound'];
// [kapalı/normal simge, açık/algılandı simge]
const BS_ICONS = {
  door: ['mdi:door-closed', 'mdi:door-open'], window: ['mdi:window-closed-variant', 'mdi:window-open-variant'],
  garage_door: ['mdi:garage', 'mdi:garage-open'], opening: ['mdi:square-outline', 'mdi:square-rounded-badge-outline'],
  lock: ['mdi:lock', 'mdi:lock-open-variant'], motion: ['mdi:motion-sensor-off', 'mdi:motion-sensor'],
  occupancy: ['mdi:home-outline', 'mdi:home-account'], presence: ['mdi:home-outline', 'mdi:home-account'],
  moisture: ['mdi:water-off', 'mdi:water-alert'], smoke: ['mdi:smoke-detector-variant', 'mdi:smoke-detector-variant-alert'],
  gas: ['mdi:meter-gas', 'mdi:meter-gas-outline'], carbon_monoxide: ['mdi:smoke-detector', 'mdi:smoke-detector-alert'],
  safety: ['mdi:shield-check', 'mdi:shield-alert'], problem: ['mdi:check-circle', 'mdi:alert-circle'], tamper: ['mdi:check-circle', 'mdi:alert-circle'],
  heat: ['mdi:thermometer', 'mdi:fire-alert'], vibration: ['mdi:crop-portrait', 'mdi:vibrate'], sound: ['mdi:music-note-off', 'mdi:music-note']
};
const bsIcon = (st) => { const dc = st ? st.attributes.device_class : '', p = BS_ICONS[dc] || ['mdi:checkbox-blank-circle-outline', 'mdi:checkbox-marked-circle']; return p[st && st.state === 'on' ? 1 : 0]; };
const ALARM_ICONS = { disarmed: 'mdi:shield-off-outline', armed_home: 'mdi:shield-home', armed_away: 'mdi:shield-lock', armed_night: 'mdi:shield-moon',
  armed_vacation: 'mdi:shield-airplane', armed_custom_bypass: 'mdi:security', arming: 'mdi:shield-sync', disarming: 'mdi:shield-sync',
  pending: 'mdi:shield-sync', triggered: 'mdi:bell-ring' };
const LOCK_ICONS = { locked: 'mdi:lock', unlocked: 'mdi:lock-open-variant', locking: 'mdi:lock-clock', unlocking: 'mdi:lock-clock',
  jammed: 'mdi:lock-alert', open: 'mdi:door-open', opening: 'mdi:door-open' };

class LemurSecurityCard extends LemurCard {
  static get TYPE() { return 'lemur-security-card'; }
  static get DOMAINS() { return ['binary_sensor', 'alarm_control_panel', 'lock']; }
  static get DEFAULTS() { return { entities: [], show_list: true, show_power: false }; }
  static toneList(lang, cfg) {
    const dom = String(cfg.entity || '').split('.')[0];
    const L = (k, b, e) => ({ key: k, label: k === 'lost' ? t(lang, 'st_lost') : t(lang, 'tn_' + k), band: b, effect: e || 'auto' });
    const list = dom === 'alarm_control_panel' ? [L('disarmed', 'green'), L('armed', 'blue'), L('arming', 'yellow'), L('triggered', 'alarm', 'blink')]
      : dom === 'lock' ? [L('locked', 'green'), L('unlocked', 'yellow'), L('moving', 'blue'), L('jammed', 'alarm', 'blink')]
      : [L('clear', 'green'), L('open', 'yellow'), L('motion', 'blue'), L('danger', 'alarm', 'blink')];
    return list.concat([L('lost', 'alarm', 'blink')]);
  }
  static stub(hass) { return { entity: firstEntity(hass, ['alarm_control_panel', 'lock']) || firstEntity(hass, ['binary_sensor'], (s) => !!BS_ICONS[s.attributes.device_class]) || 'binary_sensor.example' }; }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['binary_sensor', 'alarm_control_panel', 'lock']), { required: true }),
      SCH.entities('entities', ['binary_sensor', 'lock']),
      SCH.text('name'),
      SCH.appearance(lang, ['show_list']),
      SCH.advanced(lang)
    ];
  }

  view(lang) {
    const dom = this._config.entity.split('.')[0];
    if (dom === 'alarm_control_panel') return this._alarm(lang);
    if (dom === 'lock') return this._lock(lang);
    return this._sensors(lang);
  }

  _sensors(lang) {
    const c = this._config, h = this._hass, ids = [c.entity].concat(c.entities || []), sts = ids.map((id) => this.st(id));
    const lost = ids.some((id) => this.isLost(id));
    const onIds = ids.filter((id) => { const s = this.st(id); return s && s.state === 'on'; });
    const dcOf = (id) => { const s = this.st(id); return s ? s.attributes.device_class : ''; };
    const danger = onIds.filter((id) => DANGER.indexOf(dcOf(id)) >= 0);
    const active = onIds.filter((id) => ACTIVITY.indexOf(dcOf(id)) >= 0);
    const open = onIds.filter((id) => danger.indexOf(id) < 0 && active.indexOf(id) < 0);
    const short = (id) => String(friendly(h, id)).replace(/\s*(sensörü|sensor|kontak|contact)\s*$/i, '');
    let bnd = BANDS.green, sec = [], icon = bsIcon(this.st(c.entity)), state = 'clear';
    const mainDc = dcOf(c.entity);
    if (danger.length) { state = 'danger'; bnd = BANDS.alarm; icon = bsIcon(this.st(danger[0])); sec = [t(lang, 's_alert'), danger.map(short).join(', ')]; }
    else if (open.length) { state = 'open'; bnd = BANDS.yellow; icon = bsIcon(this.st(open[0])); sec = [ids.length > 1 ? open.length + ' ' + t(lang, 's_open') : t(lang, 'st_on'), ids.length > 1 ? open.map(short).join(', ') : '']; }
    else if (active.length) { state = 'motion'; bnd = BANDS.blue; icon = bsIcon(this.st(active[0])); sec = [t(lang, 's_motion'), active.map(short).join(', ')]; }
    else sec = [t(lang, ACTIVITY.indexOf(mainDc) >= 0 ? 's_no_motion' : DANGER.indexOf(mainDc) >= 0 ? 's_all_clear' : 's_all_closed')];
    if (lost) { state = 'lost'; bnd = BANDS.alarm; sec.unshift(t(lang, 'st_lost')); }
    // Altta: önce açık / algılayanlar, en çok 3
    const order = onIds.concat(ids.filter((id) => onIds.indexOf(id) < 0));
    const boxes = c.show_list && ids.length > 1 ? order.slice(0, 3).map((id) => ({ type: 'info', icon: bsIcon(this.st(id)), text: short(id), entity: id, title: friendly(h, id) })) : [];
    return { name: ids.length > 1 ? t(lang, 's_group') : friendly(h, c.entity), sec: sec, icon: { mdi: icon }, state: state, tone: state, band: bnd, on: onIds.length > 0, powerIcon: null, boxes: boxes };
  }

  _alarm(lang) {
    const c = this._config, st = this.st(c.entity), a = st ? st.attributes : {}, s = st ? st.state : 'unavailable';
    const lost = this.isLost(c.entity);
    const B = { disarmed: 'green', triggered: 'alarm', arming: 'yellow', pending: 'yellow', disarming: 'yellow' };
    const bnd = lost ? BANDS.alarm : band(B[s] || (s.indexOf('armed') === 0 ? 'blue' : 'grey'));
    const f = num(a.supported_features) || 0, codeArm = a.code_arm_required !== false && !!a.code_format, codeDisarm = !!a.code_format;
    const boxes = [];
    if (!codeArm) {
      if (f & 1) boxes.push({ type: 'button', id: 'arm_home', icon: 'mdi:shield-home', label: t(lang, 's_arm_home'), active: s === 'armed_home', showLabel: true });
      if (f & 2) boxes.push({ type: 'button', id: 'arm_away', icon: 'mdi:shield-lock', label: t(lang, 's_arm_away'), active: s === 'armed_away', showLabel: true });
      if ((f & 4) && boxes.length < 2) boxes.push({ type: 'button', id: 'arm_night', icon: 'mdi:shield-moon', label: t(lang, 's_arm_night'), active: s === 'armed_night', showLabel: true });
    }
    if (!codeDisarm) boxes.push({ type: 'button', id: 'disarm', icon: 'mdi:shield-off-outline', label: t(lang, 's_disarm'), active: s === 'disarmed', confirm: true, showLabel: true });
    if (codeArm || codeDisarm) boxes.push({ type: 'info', icon: 'mdi:dialpad', text: t(lang, 's_code'), entity: c.entity });
    return { name: a.friendly_name || c.entity, sec: [lost ? t(lang, 'st_lost') : (tMaybe(lang, 's_' + s) || prettify(s))],
      icon: { mdi: ALARM_ICONS[s] || 'mdi:shield-outline' }, state: lost ? 'lost' : s,
      tone: lost ? 'lost' : (s === 'disarmed' ? 'disarmed' : s === 'triggered' ? 'triggered' : s.indexOf('armed') === 0 ? 'armed' : 'arming'), band: bnd, on: s.indexOf('armed') === 0, powerIcon: null, disabled: lost, boxes: boxes };
  }

  _lock(lang) {
    const c = this._config, ids = [c.entity].concat(c.entities || []), st = this.st(c.entity), a = st ? st.attributes : {}, s = st ? st.state : 'unavailable';
    const lost = ids.some((id) => this.isLost(id));
    const anyOpen = ids.some((id) => { const x = this.st(id); return x && (x.state === 'unlocked' || x.state === 'open'); });
    const B = { locked: 'green', unlocked: 'yellow', open: 'yellow', opening: 'yellow', locking: 'blue', unlocking: 'blue', jammed: 'alarm' };
    const bnd = lost ? BANDS.alarm : band(anyOpen && s === 'locked' ? 'yellow' : (B[s] || 'grey'));
    const boxes = [
      { type: 'button', id: 'lock', icon: 'mdi:lock', label: t(lang, 'l_lock'), active: s === 'locked', showLabel: true },
      { type: 'button', id: 'unlock', icon: 'mdi:lock-open-variant', label: t(lang, 'l_unlock'), active: s === 'unlocked', confirm: true, showLabel: true }
    ];
    if ((num(a.supported_features) || 0) & 1) boxes.push({ type: 'button', id: 'open', icon: 'mdi:door-open', label: t(lang, 'l_open_door'), confirm: true, showLabel: true });
    return { name: a.friendly_name || c.entity, sec: [lost ? t(lang, 'st_lost') : (tMaybe(lang, 'l_' + s) || prettify(s))],
      icon: { mdi: LOCK_ICONS[s] || 'mdi:lock-question' }, state: lost ? 'lost' : s,
      tone: lost ? 'lost' : (s === 'jammed' ? 'jammed' : (s === 'locking' || s === 'unlocking') ? 'moving' : (s === 'locked' && !anyOpen) ? 'locked' : 'unlocked'), band: bnd, on: s === 'locked', powerIcon: null, disabled: lost, boxes: boxes };
  }

  onButton(id) {
    const c = this._config, dom = c.entity.split('.')[0];
    if (dom === 'alarm_control_panel') this.call('alarm_control_panel', 'alarm_' + id, { entity_id: c.entity });
    if (dom === 'lock') this.call('lock', id, { entity_id: [c.entity].concat(c.entities || []).filter((x) => x.indexOf('lock.') === 0) });
  }
}

registerCard(LemurSecurityCard, {
  tr: { name: 'Lemur Güvenlik Kartı', desc: 'Kapı, pencere, sızıntı ve duman sensörleri, alarm paneli ya da kilit' },
  en: { name: 'Lemur Security Card', desc: 'Door, window, leak and smoke sensors, alarm panel or lock' }
});

// Oda kartı: bir odanın özeti. Sıcaklık ve nemden konfor (iklim kartıyla aynı hesap), ışıklar, iklim cihazı ve bir ek cihaz.
// Sağ üstteki düğme odadaki her şeyi kapatır (bir şey açıksa) ya da ışıkları açar.
// Altta: ışıklar (açık / toplam, dokununca hepsini aç-kapat), iklim cihazı (mod simgesi + hedef), ek cihaz.

addText({
  r_name: 'Oda', r_pick: 'Ayarlardan cihaz seç', r_lights: 'Işıklar', r_lights_off: 'Işıklar kapalı', r_lights_n: 'ışık açık', r_all_off: 'Hepsini kapat', r_lights_on: 'Işıkları aç', tn_lights_on: 'Işıklar açık (sıcaklık yoksa)',
  ed_climate: 'Klima / petek (isteğe bağlı)', ed_lights: 'Işıklar', ed_extra_entity: 'Ek cihaz (TV, fan, priz...)',
  ed_show_lights: 'Işık kutusu', ed_show_climate: 'İklim kutusu', ed_show_extra: 'Ek cihaz kutusu'
}, {
  r_name: 'Room', r_pick: 'Pick devices in the settings', r_lights: 'Lights', r_lights_off: 'Lights off', r_lights_n: 'lights on', r_all_off: 'Turn everything off', r_lights_on: 'Turn lights on', tn_lights_on: 'Lights on (no temperature)',
  ed_climate: 'Air conditioner / radiator (optional)', ed_lights: 'Lights', ed_extra_entity: 'Extra device (TV, fan, plug...)',
  ed_show_lights: 'Lights box', ed_show_climate: 'Climate box', ed_show_extra: 'Extra device box'
});

const DOMAIN_ICONS = { media_player: ['mdi:television-off', 'mdi:television'], fan: ['mdi:fan-off', 'mdi:fan'], switch: ['mdi:power-plug-off-outline', 'mdi:power-plug'],
  light: ['mdi:lightbulb-outline', 'mdi:lightbulb'], input_boolean: ['mdi:toggle-switch-off-outline', 'mdi:toggle-switch'],
  humidifier: ['mdi:air-humidifier-off', 'mdi:air-humidifier'], cover: ['mdi:window-shutter', 'mdi:window-shutter-open'] };

class LemurRoomCard extends LemurCard {
  static get TYPE() { return 'lemur-room-card'; }
  static get DOMAINS() { return null; }
  static get DEFAULTS() {
    return { icon: '', temperature_sensor: '', humidity_sensor: '', climate: '', lights: [], extra_entity: '',
      show_lights: true, show_climate: true, show_extra: true };
  }
  static toneList(lang, cfg) {
    const L = (k, b, e, lb) => ({ key: k, label: t(lang, lb || ('tn_' + k)), band: b, effect: e || 'auto' });
    const z = cfg.temperature_sensor || cfg.climate ? [L('cold', 'blue'), L('comfort', 'green'), L('warm', 'yellow'), L('hot', 'red')] : [];
    return z.concat([L('on', 'yellow', '', 'tn_lights_on'), L('off', null, '', 'st_off'), L('lost', 'alarm', 'blink', 'st_sensor')]);
  }
  static nested() { return { comfort: COMFORT_DEFAULTS }; }
  static stub(hass) {
    const tmp = firstEntity(hass, ['sensor'], (s) => s.attributes.device_class === 'temperature');
    const light = firstEntity(hass, ['light']), cl = firstEntity(hass, ['climate']);
    const cfg = {};   // ad boşsa kart dile göre "Oda" / "Room" yazar
    if (tmp) cfg.temperature_sensor = tmp;
    if (light) cfg.lights = [light];
    if (!tmp && cl) cfg.climate = cl;
    return cfg;
  }
  // Hiçbir şey seçilmemişse hata yerine kartta "Ayarlardan cihaz seç" yazar
  validate() {}
  static schema(lang) {
    const n = (name, min, max) => SCH.num(name, min, max, 0.5, '°C');
    return [
      SCH.text('name'),
      SCH.entity('temperature_sensor', ['sensor'], { device_class: 'temperature' }),
      SCH.entity('humidity_sensor', ['sensor'], { device_class: 'humidity' }),
      SCH.entity('climate', ['climate']),
      SCH.entities('lights', ['light', 'switch']),
      { name: 'extra_entity', selector: { entity: { domain: ['media_player', 'fan', 'switch', 'input_boolean', 'humidifier', 'light', 'cover'] } } },
      SCH.appearance(lang, ['show_lights', 'show_climate', 'show_extra']),
      { type: 'expandable', name: 'comfort', title: t(lang, 'ed_comfort'), schema: [
        n('cold', 0, 40), n('cool', 0, 40), n('warm', 0, 45), n('hot', 0, 45), n('humid_dewpoint', 0, 30), SCH.num('dry_humidity', 0, 100, 1, '%')] },
      SCH.advanced(lang)
    ];
  }
  ids() { const c = this._config; return [c.temperature_sensor, c.humidity_sensor, c.climate, c.extra_entity].concat(c.lights || []); }

  // Ek cihaz açık mı: görünüm ve sağ üst düğme aynı kuralı kullanır (kapalı perde, bekleyen medya "kapalı" sayılır)
  _exOn() {
    const ex = this.st(this._config.extra_entity);
    return !!ex && !isOff(ex) && ['idle', 'standby', 'closed', 'paused'].indexOf(ex.state) < 0;
  }
  _lightsOn() { return (this._config.lights || []).filter((id) => !isOff(this.st(id))); }
  _anyOn() { const cl = this.st(this._config.climate); return this._lightsOn().length > 0 || (!!cl && !isOff(cl)) || this._exOn(); }

  view(lang) {
    const c = this._config, h = this._hass, cl = this.st(c.climate), ca = cl ? cl.attributes : {};
    if (!c.temperature_sensor && !c.climate && !(c.lights || []).length && !c.extra_entity) {
      return { name: t(lang, 'r_name'), sec: [t(lang, 'r_pick')], icon: { mdi: 'mdi:sofa-outline' }, band: BANDS.grey, on: false, powerIcon: null, boxes: [] };
    }
    // Sıcaklık HA'nın biriminde gösterilir, konfor hesabı °C ile yapılır
    let tmp = stateNum(h, c.temperature_sensor); if (tmp === null) tmp = num(ca.current_temperature);
    let rh = stateNum(h, c.humidity_sensor); if (rh === null) rh = num(ca.current_humidity);
    const unit = tempUnit(h), tc = toC(tmp, unit);
    const lights = c.lights || [], lightsOn = this._lightsOn();
    const ex = this.st(c.extra_entity), exOn = this._exOn();
    const anyOn = this._anyOn();
    const sensorLost = c.temperature_sensor ? this.isLost(c.temperature_sensor) : false;
    let bnd = tc !== null ? acBand(tc, rh, c.comfort) : (lightsOn.length ? BANDS.yellow : BANDS.grey);
    const sec = [];
    if (sensorLost) { bnd = BANDS.alarm; sec.push(t(lang, 'st_sensor')); }
    else if (tc !== null) sec.push(t(lang, comfortKey(tc, rh, c.comfort)));
    if (tmp !== null) sec.push(round(tmp, 1) + ' ' + unit);
    if (rh !== null && rh > 0) sec.push(pct(Math.round(rh), lang));
    // Sıcaklık yoksa alt yazıda ışık durumu
    if (tmp === null && lights.length) sec.push(lightsOn.length ? lightsOn.length + '/' + lights.length + ' ' + t(lang, 'r_lights_n') : t(lang, 'r_lights_off'));
    const boxes = [];
    if (c.show_lights && lights.length) boxes.push({ type: 'button', id: 'lights', icon: lightsOn.length ? 'mdi:lightbulb-group' : 'mdi:lightbulb-group-off-outline',
      label: lightsOn.length + '/' + lights.length, active: lightsOn.length > 0, showLabel: true });
    if (c.show_climate && cl) {
      const tg = num(ca.temperature);
      boxes.push({ type: 'button', id: 'climate', icon: isDead(cl) ? 'mdi:air-conditioner' : modeIcon(cl.state),
        label: isOff(cl) ? t(lang, 'st_off') : (tg !== null ? tg + '°' : t(lang, 'm_' + cl.state)), active: !isOff(cl), showLabel: true });
    }
    if (c.show_extra && ex) {
      const d = DOMAIN_ICONS[c.extra_entity.split('.')[0]] || ['mdi:toggle-switch-off-outline', 'mdi:toggle-switch'];
      boxes.push({ type: 'button', id: 'extra', icon: ex.attributes.icon || d[exOn ? 1 : 0], label: exOn ? t(lang, 'st_on') : t(lang, 'st_off'), active: exOn, showLabel: true });
    }
    const zk = tc !== null ? BAND_TONE[acBand(tc, rh, c.comfort).name] : '';
    const tone = sensorLost ? ['lost'] : (zk ? (anyOn ? [zk] : ['off', zk]) : [lightsOn.length ? 'on' : 'off']);
    return { name: t(lang, 'r_name'), sec: sec, icon: { mdi: 'mdi:sofa-outline' }, state: anyOn ? 'on' : 'off', tone: tone, band: bnd, on: anyOn,
      powerIcon: lights.length || cl || ex ? undefined : null,
      powerTitle: t(lang, anyOn ? 'r_all_off' : 'r_lights_on'), moreInfo: c.temperature_sensor || c.climate || lights[0] || c.extra_entity, boxes: boxes };
  }

  _lights(on) {
    const ls = this._config.lights || [];
    if (ls.length) this.call('homeassistant', on ? 'turn_on' : 'turn_off', { entity_id: ls });
  }
  power() {
    const c = this._config, cl = this.st(c.climate);
    if (!this._anyOn()) return this._lights(true);
    // Odadan çıkarken: her şeyi kapat
    this._lights(false);
    if (cl && !isOff(cl)) climateOff(this, [c.climate]);
    if (this._exOn()) this.call('homeassistant', 'turn_off', { entity_id: c.extra_entity });
  }
  onButton(id) {
    const c = this._config;
    if (id === 'lights') this._lights(!this._lightsOn().length);
    if (id === 'climate') { if (isOff(this.st(c.climate))) climateOn(this, [c.climate]); else climateOff(this, [c.climate]); }
    // Ek cihaz: aç / kapat (medya oynatıcı dahil; kapalı TV'yi de açar)
    if (id === 'extra') this.call('homeassistant', this._exOn() ? 'turn_off' : 'turn_on', { entity_id: c.extra_entity });
  }
}

registerCard(LemurRoomCard, {
  tr: { name: 'Lemur Oda Kartı', desc: 'Odanın konforu, ışıkları ve iklim cihazı tek kartta' },
  en: { name: 'Lemur Room Card', desc: 'A room at a glance: comfort, lights and climate in one card' }
});

// Işık kartı: hale lambanın kendi rengini alır (renkli lamba: rengi; beyaz lamba: renk sıcaklığı), parlaklığı halenin şiddeti olur.
// Bir ya da birden çok lamba. Altta parlaklık (− %80 +), renk sıcaklığı (− 2700K +) ve efekt seçici.
// Efekt kartları için ayrıca Lemur Light Effect Card var; bu kart günlük kullanım içindir.

addText({
  li_on: 'Açık', li_some_on: 'açık', li_effect: 'Efekt', li_none: 'Yok',
  ed_show_brightness: 'Parlaklık (− %80 +)', ed_show_color_temp: 'Renk sıcaklığı (− 2700K +)', ed_show_effect: 'Efekt seçici',
  ed_brightness_step: 'Parlaklık adımı (%)', ed_kelvin_step: 'Renk sıcaklığı adımı (K)'
}, {
  li_on: 'On', li_some_on: 'on', li_effect: 'Effect', li_none: 'None',
  ed_show_brightness: 'Brightness (− 80% +)', ed_show_color_temp: 'Colour temperature (− 2700K +)', ed_show_effect: 'Effect selector',
  ed_brightness_step: 'Brightness step (%)', ed_kelvin_step: 'Colour temperature step (K)'
});

// Renk sıcaklığından (K) yaklaşık RGB
function kelvinRgb(k) {
  const x = Math.max(1000, Math.min(40000, k)) / 100;
  let r, g, b;
  if (x <= 66) { r = 255; g = 99.47 * Math.log(x) - 161.12; b = x <= 19 ? 0 : 138.52 * Math.log(x - 10) - 305.04; }
  else { r = 329.7 * Math.pow(x - 60, -0.1332); g = 288.12 * Math.pow(x - 60, -0.0755); b = 255; }
  const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return c(r) + ',' + c(g) + ',' + c(b);
}

class LemurLightCard extends LemurCard {
  static get TYPE() { return 'lemur-light-card'; }
  static get DOMAINS() { return ['light']; }
  static get DEFAULTS() { return { entities: [], show_brightness: true, show_color_temp: true, show_effect: true, brightness_step: 10, kelvin_step: 250 }; }
  // Açıkken hale lambanın kendi rengindedir; buradan sabit bir renk seçilirse o kullanılır
  static toneList(lang) {
    return [{ key: 'on', label: t(lang, 'li_on'), band: null, effect: 'auto' }, { key: 'off', label: t(lang, 'st_off'), band: 'grey', effect: 'auto' },
      { key: 'lost', label: t(lang, 'st_lost'), band: 'alarm', effect: 'blink' }];
  }
  static schema(lang) {
    return [
      Object.assign(SCH.entity('entity', ['light']), { required: true }),
      SCH.entities('entities', ['light']),
      SCH.text('name'),
      SCH.appearance(lang, ['show_brightness', 'show_color_temp', 'show_effect']),
      { type: 'expandable', name: 'adv', flatten: true, title: t(lang, 'ed_advanced'), schema: [
        SCH.num('brightness_step', 1, 50, 1, '%'), SCH.num('kelvin_step', 50, 1000, 50, 'K')] },
      SCH.advanced(lang)
    ];
  }

  _ents() { return [this._config.entity].concat(this._config.entities || []); }

  view(lang) {
    const c = this._config, ents = this._ents(), st = this.st(c.entity), a = st ? st.attributes : {};
    const onIds = ents.filter((id) => !isOff(this.st(id)));
    const on = onIds.length > 0;
    const lost = ents.some((id) => this.isLost(id));
    // Renk ve parlaklık açık olan ilk lambadan
    const lead = on ? this.st(onIds[0]).attributes : a;
    const bri = on && num(lead.brightness) !== null ? Math.round(num(lead.brightness) / 2.55) : (on ? 100 : 0);
    const kelvin = num(lead.color_temp_kelvin);
    let rgb = '255,180,90';
    if (lead.color_mode === 'color_temp' && kelvin) rgb = kelvinRgb(kelvin);
    else if (Array.isArray(lead.rgb_color)) rgb = lead.rgb_color.join(',');
    else if (kelvin) rgb = kelvinRgb(kelvin);
    const bnd = lost ? BANDS.alarm : on ? { name: 'light', rgb: rgb, duration: 5.0 } : BANDS.grey;
    const modes = a.supported_color_modes || [];
    const dimmable = modes.some((m) => m !== 'onoff');
    const sec = [];
    if (lost) sec.push(t(lang, 'st_lost'));
    else if (ents.length > 1) sec.push(onIds.length + '/' + ents.length + ' ' + t(lang, 'li_some_on'));
    else sec.push(t(lang, on ? 'li_on' : 'st_off'));
    if (on && dimmable) sec.push(pct(bri, lang));
    if (on && lead.color_mode === 'color_temp' && kelvin) sec.push(Math.round(kelvin) + 'K');
    // "none" / "off" efekt yok demektir, alt yazıya yazılmaz
    if (on && lead.effect && ['none', 'off'].indexOf(String(lead.effect).toLowerCase()) < 0) sec.push(String(lead.effect));
    const boxes = [];
    if (c.show_brightness && dimmable) boxes.push({ type: 'step', id: 'bri', value: on ? pct(bri, lang) : '—' });
    if (c.show_color_temp && modes.indexOf('color_temp') >= 0) boxes.push({ type: 'step', id: 'ct', value: kelvin && on ? Math.round(kelvin) + 'K' : '—' });
    if (c.show_effect && (a.effect_list || []).length) {
      boxes.push({ type: 'select', id: 'fx', title: t(lang, 'li_effect'), icon: 'mdi:creation', label: a.effect || t(lang, 'li_effect'), value: a.effect,
        options: a.effect_list.map((x) => ({ value: x, label: String(x) })) });
    }
    return { name: a.friendly_name || c.entity, sec: sec, icon: { mdi: on ? 'mdi:lightbulb' : 'mdi:lightbulb-outline' }, state: lost ? 'lost' : (on ? 'on' : 'off'), tone: lost ? 'lost' : (on ? 'on' : 'off'), band: bnd, on: on,
      haloK: on ? 0.35 + 0.65 * bri / 100 : 0.3, disabled: lost && !on, boxes: boxes };
  }

  power() {
    const ents = this._ents(), on = ents.some((id) => !isOff(this.st(id)));
    this.call('light', on ? 'turn_off' : 'turn_on', { entity_id: ents });
  }
  // Adım düğmeleri, ekranda gösterilen lambadan (açık olan ilk lamba) başlar; komut gruptaki bütün lambalara gider
  onStep(id, dir) {
    const c = this._config, ents = this._ents(), lang = pickLang(this._hass, c.language);
    const onIds = ents.filter((x) => !isOff(this.st(x))), st = this.st(onIds.length ? onIds[0] : c.entity);
    if (!st) return;
    const a = st.attributes, on = onIds.length > 0;
    if (id === 'bri') {
      const cur = on && num(a.brightness) !== null ? Math.round(num(a.brightness) / 2.55) : 0;
      this.stepValue('bri', cur, dir * Number(c.brightness_step), dir > 0 ? 1 : 0, 100, (v) => pct(Math.round(v), lang),
        (v) => v <= 0 ? this.call('light', 'turn_off', { entity_id: ents }) : this.call('light', 'turn_on', { entity_id: ents, brightness_pct: Math.round(v) }));
    }
    if (id === 'ct') {
      const lo = num(a.min_color_temp_kelvin) || 2000, hi = num(a.max_color_temp_kelvin) || 6500;
      const cur = num(a.color_temp_kelvin) || Math.round((lo + hi) / 2);
      this.stepValue('ct', cur, dir * Number(c.kelvin_step), lo, hi, (v) => Math.round(v) + 'K',
        (v) => this.call('light', 'turn_on', { entity_id: ents, color_temp_kelvin: Math.round(v) }));
    }
  }
  onSelect(id, value) { this.call('light', 'turn_on', { entity_id: this._ents(), effect: value }); }
}

registerCard(LemurLightCard, {
  tr: { name: 'Lemur Işık Kartı', desc: 'Hale lambanın rengini ve parlaklığını alır; parlaklık ve renk sıcaklığı ayarı' },
  en: { name: 'Lemur Light Card', desc: 'The halo takes the lamp\'s colour and brightness; brightness and colour temperature control' }
});

if (0) console.info('%c LEMUR HALO CARDS %c v' + CARD_VERSION + ' ', 'background:#F0A93B;color:#1A1105;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
/*! Lemur Home Dashboard v0.13.0 | GPL-3.0 */
(() => {
// Önbellek koruması (Light Effect Card'daki heal.js'in uyarlaması).
// Home Assistant'ın service worker'ı sunduğu her sayfanın bir kopyasını saklar. Güncellemeden önce alınmış bir kopya eski
// pano dosyasını (?v=eski) çağırır, tarayıcı da o dosyayı saklar; böylece güncellemeden sonra eski pano geri gelebilir.
// Paket en başta bu eski kopyaları ve ?v= değeri farklı eski lemur dosyalarını siler; bir sonraki açılış bu sürümü alır.
// Bu sayfada daha eski bir pano önce yüklendiyse sayfa bir kez yenilenir (sessionStorage bayrağıyla, döngüye girmez).
(() => {
  const V = '0.13.0';
  const older = !!customElements.get('lemur-home-dashboard-card') && window.__LEMUR_HD_VER !== V;
  const heal = async () => {
    if (!window.caches) return 0;
    let n = 0;
    for (const k of await caches.keys()) {
      const c = await caches.open(k);
      for (const r of await c.keys()) {
        const u = r.url;
        if (/\/lemur_home_dashboard\/(lemur-home-dashboard\.js|mdi-color\.json|lec-icons\.json)\?v=/.test(u)) { if (!u.includes('v=' + V)) { await c.delete(r); n++; } continue; }
        let p; try { p = new URL(u).pathname; } catch (e) { continue; }
        if (/\.[a-z0-9]{1,5}$/i.test(p)) continue;   // yalnızca sayfalar
        const res = await c.match(r); if (!res) continue;
        const m = (await res.clone().text()).match(/lemur-home-dashboard\.js\?v=([0-9.]+)/);
        if (m && m[1] !== V) { await c.delete(r); n++; }
      }
    }
    return n;
  };
  window.__LEMUR_HD_HEAL = () => heal().catch(() => 0);
  const run = () => window.__LEMUR_HD_HEAL().then(() => {
    if (!older) return;
    try { const f = 'lemur-hd-heal-' + V; if (!sessionStorage.getItem(f)) { sessionStorage.setItem(f, '1'); location.reload(); } } catch (e) {}
  });
  if (older) run(); else setTimeout(run, 8000);
})();

// Son hatalar (Sorun bildir için): yalnızca panoya ait dosyalardan gelen hatalar, en çok 10 tane. Varlık kimlikleri
// (light.salon gibi) kayda girmeden önce silinir; kişisel bilgi tutulmaz.
(() => {
  if (window.__LEMUR_HD_ERRH) return;
  window.__LEMUR_HD_ERRH = 1;
  const L = window.__LEMUR_HD_ERR = [];
  const add = (m, src) => {
    if (!/lemur[-_]home[-_]dashboard|lemur-hd-/i.test(String(src || ''))) return;
    const msg = String(m || '?').replace(/\b[a-z_]+\.[a-z0-9_]+\b/g, '<varlık>').slice(0, 160);
    L.push(new Date().toTimeString().slice(0, 8) + ' ' + msg);
    if (L.length > 10) L.shift();
  };
  window.addEventListener('error', (e) => add(e.message, (e.filename || '') + ' ' + ((e.error && e.error.stack) || '')));
  window.addEventListener('unhandledrejection', (e) => { const r = e.reason; add((r && r.message) || r, r && r.stack); });
})();

if (customElements.get('lemur-home-dashboard-card')) return;
const PANEL_VERSION = '0.13.0';
const CSS = ":host { display: block; color: var(--lp-text); font-family: var(--primary-font-family, Roboto, Noto, sans-serif);\n--lp-text: #FFFFFF; --lp-text2: #D3D3D3;\n--lp-card: rgba(10, 10, 10, 0.4);\n--lp-box-bg: rgba(20, 24, 31, 0.55); --lp-box-border: rgba(255, 255, 255, 0.08);\n--lp-sel: rgba(91, 141, 239, 0.9);\n--lp-on-border: rgb(255, 214, 10); --lp-on-icon: #FFC107; --lp-na: #555555;\n--lp-embed-bg: rgb(28, 28, 28); }\n.wrap { display: grid; grid-template-rows: auto minmax(0, 1fr); grid-gap: 12px; padding: 4px 4px 25px 4px; box-sizing: border-box;\nheight: var(--lp-h, auto); min-height: var(--lp-h, calc(100vh - var(--header-height, 56px)));\n-webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }\n.nav { grid-area: h; display: flex; align-items: center; min-width: 0; margin: 4px 4px 8px 4px; }\n.navb { flex: 0 1 235px; min-width: 0; height: 155px; box-sizing: border-box; border-radius: 15px; background: var(--lp-card);\nborder: 0 none; opacity: 0.85; padding: 9.4px 0; display: flex; flex-direction: column; align-items: center; cursor: pointer;\noverflow: hidden; transition: all 0.3s ease-out; color: var(--lp-text); }\n.navb + .navb { margin-left: 8px; }\n.navb.sel { opacity: 1; border: 2px solid var(--lp-sel); }\n.ni { flex: 1 1 auto; width: 40%; min-height: 0; display: flex; align-items: center; justify-content: center; }\n.ni ha-icon { display: block; width: 100%; --mdc-icon-size: 100%; }\n.nn { font-size: 16.8px; line-height: 20px; max-width: 100%; padding: 0 6px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.clock { flex: 1 0 150px; margin-left: 8px; text-align: center; font-size: 32px; line-height: 40px; font-weight: 700; font-variant-numeric: tabular-nums; }\n.col { display: flex; flex-direction: column; min-width: 0; min-height: 0; margin: 4px; }\n.col > .subs { display: grid; grid-gap: 12px; flex: 1 1 auto; min-height: 0; }\n.sub { display: flex; flex-direction: column; min-width: 0; min-height: 0; }\n.sub > .box + .box { margin-top: 12px; }\n.box { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; min-width: 0; overflow: hidden; box-sizing: border-box; padding: 20px;\nbackground: var(--lp-box-bg); border: 1px solid var(--lp-box-border); border-radius: 22px; }\n.box > * + * { margin-top: var(--lp-gap, 8px); }\n.box.spread { justify-content: flex-start; }\n.box.mix > .scene { flex: 0 0 72px; }\n.box.mix > .emb, .box.mix > .row { flex: 0 0 auto; }\n.box.empty { align-items: center; justify-content: center; color: var(--lp-text2); font-size: 18px; text-align: center; padding: 40px; }\n.title { flex: 0 0 auto; text-align: center; font-size: 18px; line-height: 22px; font-weight: 700; padding: 19px 16px 20px; min-width: 0; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; }\n.title.hd { padding: 10px 0 14px; display: flex; align-items: center; justify-content: center; letter-spacing: 0.01em; }\n.title.hd ha-icon { display: block; width: 20px; height: 20px; --mdc-icon-size: 20px; margin-right: 8px; }\n.title.season { cursor: pointer; }\n.grid { display: grid; grid-gap: 8px; flex: 1 1 auto; min-height: 0; }\n.tile { box-sizing: border-box; min-width: 0; min-height: 0; border-radius: 20px; background-color: var(--lp-card); border: 0 solid transparent;\ncolor: var(--lp-text); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4% 0;\ncursor: pointer; overflow: hidden; text-align: center; transition: all 0.2s ease-out; }\n.tile ha-state-icon { display: block; width: 40%; --mdc-icon-size: 100%; color: var(--lp-text); }\n.tile .nm { margin-top: 8px; font-size: 16px; line-height: 19.2px; max-width: 100%; padding: 0 4px; box-sizing: border-box;\noverflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }\n.tile.on { border: 2px solid var(--tile-rgb, var(--lp-on-border)); background-color: rgba(255, 255, 255, 0.05); }\n.tile.on ha-state-icon { color: var(--tile-rgb, var(--lp-on-icon)); }\n.tile.fx { border-width: 2px; border-style: solid; background-color: rgba(255, 255, 255, 0.05); }\n.tile.na ha-state-icon { color: var(--lp-na); }\n.bars { display: grid; grid-gap: 8px; flex: 1 1 auto; min-height: 0; }\n.bars.fixed { flex: 0 0 auto; grid-auto-rows: 72px; }\n.bar { position: relative; box-sizing: border-box; min-width: 0; border-radius: 18px; background: var(--lp-card); border: 1px solid rgba(255, 255, 255, 0.08);\noverflow: hidden; display: flex; align-items: center; cursor: pointer; color: var(--lp-text); -webkit-user-select: none; user-select: none;\n-webkit-tap-highlight-color: transparent; touch-action: pan-y; transition: transform 0.1s ease-out, border-color 0.2s; --bar-c: #F0A93B; }\n.bar .bf { position: absolute; left: 0; top: 0; bottom: 0; width: var(--p, 0%); background-color: var(--bar-c); opacity: 0.32; transition: width 0.18s ease-in-out, background-color 0.18s; }\n.bar.drag .bf { transition: background-color 0.18s; }\n.bar.down, .bar.drag { transform: scale(0.98); }\n.bar ha-state-icon, .bar > ha-icon { position: relative; display: block; flex: 0 0 auto; width: 34px; height: 34px; --mdc-icon-size: 34px; margin: 0 14px 0 18px; color: var(--lp-text2); }\n.bar.on ha-state-icon { color: var(--bar-c); }\n.bar.na { opacity: 0.5; }\n.bar.fx { border-width: 2px; border-style: solid; }\n.bar .bt { position: relative; flex: 1 1 auto; min-width: 0; padding-right: 12px; }\n.bar .nm { font-size: 17px; line-height: 21px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.bar .pc { font-size: 14px; line-height: 18px; font-weight: 600; color: var(--lp-text2); opacity: 0.75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.bar.ph { cursor: default; }\n.scene { flex: 0 1 118px; height: auto; min-height: 48px; box-sizing: border-box; border-radius: 22px; background: var(--lp-card); color: var(--lp-text);\ndisplay: -webkit-box; display: flex; align-items: center; cursor: pointer; overflow: hidden; transition: all 0.2s ease-out; }\n.scene .si { flex: 0 0 40%; display: flex; justify-content: center; }\n.scene ha-icon { display: block; width: 40px; --mdc-icon-size: 40px; }\n.scene span span { padding-left: 0; font-size: inherit; }\n.scene span { flex: 1 1 auto; min-width: 0; padding-left: 6px; font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.emb { --ha-card-background: var(--lp-embed-bg); --card-background-color: var(--lp-embed-bg); --ha-card-border-radius: 20px;\n--ha-card-border-width: 0; --ha-card-border-color: transparent; --ha-card-box-shadow: none;\n--primary-text-color: var(--lp-text); --secondary-text-color: var(--lp-text2); }\n.row { display: flex; align-items: center; padding: 16px; border-radius: 20px; background: var(--lp-embed-bg); cursor: pointer; --mdc-icon-size: 36px; }\n.row ha-state-icon { flex: 0 0 auto; color: var(--lp-text); margin-right: 14px; }\n.row.on ha-state-icon { color: var(--lp-on-icon); }\n.rt { min-width: 0; }\n.rn { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.rs { font-size: 14px; color: var(--lp-text2); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.down { -webkit-transform: scale(0.96); transform: scale(0.96); }\n.wrap.edit { position: relative; touch-action: none; }\n.edit .box { cursor: pointer; transition: box-shadow 0.15s; position: relative; }\n.bgrip { position: absolute; left: 4px; top: 4px; width: 28px; height: 28px; border-radius: 9px; background: rgba(242, 169, 59, 0.16); color: #F2A93B;\ndisplay: flex; align-items: center; justify-content: center; cursor: grab; z-index: 3; --mdc-icon-size: 18px; }\n.bgrip:hover { background: rgba(242, 169, 59, 0.3); }\n.bgrip ha-icon { pointer-events: none; }\n.edit .box:hover { box-shadow: 0 0 0 2px rgba(242, 169, 59, 0.35); }\n.edit .box.selbox { box-shadow: 0 0 0 3px #F2A93B; }\n.edit .tile, .edit .bar, .edit .scene, .edit .row, .edit .emb { cursor: grab; }\n.edit .tile > *, .edit .bar > *, .edit .scene > *, .edit .row > *, .edit .emb > *, .edit .title.season { pointer-events: none; }\n.edit .navb { cursor: pointer; }\n.edit .dragging { opacity: 0.35; }\n.edit .dropl { box-shadow: -6px 0 0 -2px #F2A93B !important; }\n.edit .dropr { box-shadow: 6px 0 0 -2px #F2A93B !important; }\n.edit .dropt { box-shadow: 0 -6px 0 -2px #F2A93B !important; }\n.edit .dropd { box-shadow: 0 6px 0 -2px #F2A93B !important; }\n.edit .dropin { box-shadow: 0 0 0 3px #F2A93B !important; }\n.colh { position: absolute; width: 14px; cursor: col-resize; z-index: 5; }\n.colh::after { content: ''; position: absolute; left: 5px; top: 10%; bottom: 10%; width: 4px; border-radius: 2px; background: transparent; transition: background 0.15s; }\n.wrap.edit:hover .colh::after { background: rgba(242, 169, 59, 0.3); }\n.colh:hover::after, .colh:active::after { background: #F2A93B !important; }\n.rowh { position: absolute; height: 14px; cursor: row-resize; z-index: 5; }\n.rowh::after { content: ''; position: absolute; top: 5px; left: 15%; right: 15%; height: 4px; border-radius: 2px; background: transparent; transition: background 0.15s; }\n.wrap.edit:hover .rowh::after { background: rgba(242, 169, 59, 0.3); }\n.rowh:hover::after, .rowh:active::after { background: #F2A93B !important; }\n.dropline { position: absolute; height: 4px; border-radius: 2px; background: #F2A93B; z-index: 6; pointer-events: none; box-shadow: 0 0 12px rgba(242, 169, 59, 0.6); }\n.eph { flex: 1 1 auto; min-height: 90px; display: flex; align-items: center; justify-content: center; text-align: center; color: var(--lp-text2);\nborder: 2px dashed rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px; font-size: 15px; }\n.box.colempty { align-items: center; justify-content: center; text-align: center; color: var(--lp-text2); background: transparent;\nborder: 2px dashed rgba(242, 169, 59, 0.35); font-size: 15px; padding: 20px; cursor: default; }\n.addsec { margin-top: 14px; padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(242, 169, 59, 0.5); background: rgba(242, 169, 59, 0.12);\ncolor: #F2A93B; font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer; }\n.addsec:hover { background: rgba(242, 169, 59, 0.22); }\n.gsq { position: relative; flex: 0 0 auto; height: 0; }\n.gsq > .grid { position: absolute; left: 0; top: 0; right: 0; bottom: 0; }\n.tile.ph { cursor: default; }\n.tile.ph ha-icon { display: block; width: 40%; --mdc-icon-size: 100%; color: var(--lp-text); }\n.edit .box.over { box-shadow: 0 0 0 2px #e5484d; }\n.edit .box.over::after { content: attr(data-over); position: absolute; left: 50%; bottom: 6px; transform: translateX(-50%); padding: 4px 12px; border-radius: 12px; max-width: 90%; box-sizing: border-box; text-align: center;\nbackground: #e5484d; color: #fff; font-size: 18px; line-height: 22px; font-weight: 700; pointer-events: none; z-index: 3; }\n.scene.lec.on { box-shadow: inset 0 0 0 2px var(--sc), 0 0 18px -8px var(--sc); background-color: rgba(255, 255, 255, 0.05); }\n.scene.lec.na { opacity: 0.45; }\n.navb.fxb .ni ha-icon { color: #FF6FAE; }\n.wrap.phone { display: block; height: auto; min-height: 0; padding: 8px 8px 24px; }\n.phone .nav { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; margin: 0 0 10px; padding-bottom: 2px; }\n.phone .nav::-webkit-scrollbar { display: none; }\n.phone .navb { flex: 0 0 84px; height: 84px; border-radius: 16px; padding: 8px 0 6px; }\n.phone .navb + .navb { margin-left: 8px; }\n.phone .ni { width: 46%; }\n.phone .nn { font-size: 12px; line-height: 15px; }\n.phone .clock { display: none; }\n.phone .pcol > .box { margin: 0 0 10px; padding: 14px; min-height: 0; }\n.phone .title { font-size: 15px; padding: 6px 8px 12px; }\n.phone .title.hd { padding: 4px 0 10px; }\n.phone .tile .nm { font-size: 12px; line-height: 15px; margin-top: 6px; }\n.phone .bars { flex: 0 0 auto; grid-auto-rows: 58px; }\n.phone .bar { border-radius: 16px; }\n.phone .bar ha-state-icon, .phone .bar > ha-icon { width: 24px; height: 24px; --mdc-icon-size: 24px; margin: 0 10px 0 12px; }\n.phone .bar .nm { font-size: 14px; line-height: 18px; }\n.phone .bar .pc { font-size: 12px; line-height: 15px; }\n.phone .box.spread { flex-direction: row; flex-wrap: wrap; justify-content: space-between; align-content: flex-start; }\n.phone .box.spread > .title { flex: 0 0 100%; }\n.phone .box.spread > * + * { margin-top: 0; }\n.phone .box.spread > .scene { flex: 0 0 calc(50% - 4px); height: 64px; min-height: 0; margin-bottom: 8px; border-radius: 18px; }\n.phone .scene .si { flex: 0 0 54px; }\n.phone .scene ha-icon { width: 28px; --mdc-icon-size: 28px; }\n.phone .scene span { font-size: 14px; }\n.phone .box.spread > .emb, .phone .box.spread > .row { flex: 0 0 100%; margin-bottom: 8px; box-sizing: border-box; }\n.phone .box.spread > .eph { flex: 0 0 100%; }\n.phone .box.mix > .scene { flex: 0 0 64px; border-radius: 18px; }\n.lic { display: inline-block; line-height: 0; }\n.lic svg { width: 100%; height: 100%; display: block; }\n.tile .lic { display: block; width: 40%; }\n.ic-auto .tile:not(.on) .lic, .ic-auto .bar:not(.on) .lic, .ic-auto .row:not(.on) .lic, .ic-auto .navb:not(.sel):not(.fxb) .ni .lic, .ic-mono .lic { filter: grayscale(1) brightness(1.1); opacity: 0.7; }\n.ic-auto .navb:not(.sel):not(.fxb) .ni .lic { opacity: 0.55; }\n.ic-tint .lic.mdic { color: #7c8598; }\n.ic-tint .tile.on .lic, .ic-tint .bar.on .lic, .ic-tint .row.on .lic, .ic-tint .navb.sel .lic, .ic-tint .navb.fxb .lic, .ic-tint .title .lic { color: var(--lp-ic-on); }\n.ic-tint.ic-lightc .tile.on .lic, .ic-tint.ic-lightc .bar.on .lic { color: var(--tile-rgb, var(--lp-ic-on)); }\n.ic-tint .scene .lic.mdic { color: var(--sc, var(--lp-ic-on)); }\n.tile.na .lic { opacity: 0.4; }\n.row .lic { flex: 0 0 auto; width: 24px; height: 24px; margin-right: 14px; }\n.title .lic { width: 20px; height: 20px; margin-right: 8px; vertical-align: -4px; }\n.tile .lic:empty { height: 0; padding-bottom: 40%; }\n.bar .lic:empty, .row .lic:empty, .si .lic:empty { min-height: 1px; }\n.bar .lic { position: relative; flex: 0 0 auto; width: 34px; height: 34px; margin: 0 14px 0 18px; }\n.phone .bar .lic { width: 24px; height: 24px; margin: 0 10px 0 12px; }\n.ni .lic { width: 100%; }\n.si .lic { width: 40px; height: 40px; }\n.phone .scene .lic { width: 28px; height: 28px; }\n.tile.val .lic { width: 32%; }\n.tile.val .vl { margin-top: 6px; font-size: 17px; line-height: 20px; font-weight: 700; max-width: 100%; padding: 0 6px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.tile.val .nm { margin-top: 2px; font-size: 13px; line-height: 16px; color: var(--lp-text2); -webkit-line-clamp: 1; }\n.phone .tile.val .vl { font-size: 13px; line-height: 16px; margin-top: 4px; }\n.phone .tile.val .nm { font-size: 11px; line-height: 13px; }\n.tile.val.na .vl { color: var(--lp-na); font-weight: 500; font-size: 13px; }\n.bar.val { cursor: pointer; }\n.ic-auto .tile.live .lic, .ic-auto .bar.live .lic { filter: none; opacity: 1; }\n.ic-tint .tile.live .lic, .ic-tint .bar.live .lic { color: var(--lp-ic-on); }\n.lic.haic { position: relative; color: var(--lp-text2); }\n.lic.haic::before { content: ''; display: block; padding-bottom: 100%; }\n.lic.haic ha-icon { position: absolute; left: 0; top: 0; width: 100%; height: 100%; --mdc-icon-size: 100%; display: flex; align-items: center; justify-content: center; }\n.tile.on .lic.haic, .bar.on .lic.haic, .row.on .lic.haic { color: var(--tile-rgb, var(--lp-on-icon)); }\n.tile.live .lic.haic, .bar.live .lic.haic, .navb.sel .lic.haic, .title .lic.haic { color: var(--lp-text); }\n.scene .lic.haic { color: var(--sc, var(--lp-text)); }\n.ic-auto .lic.haic { filter: none !important; }\n[data-hid] { opacity: 0.38; outline: 2px dashed rgba(255, 255, 255, 0.25); outline-offset: -2px; }\n.emb.hc { min-height: 40px; }\n.cwarn { display: flex; align-items: center; padding: 14px 16px; border-radius: 14px; background: rgba(229, 72, 77, 0.12); color: #FF9592; font-size: 14px; line-height: 1.35; }\n.cwarn ha-icon { --mdc-icon-size: 20px; margin-right: 10px; flex: 0 0 auto; }\n.ic-tint .lic.haic { color: #7c8598; }\n.ic-tint .tile.on .lic.haic, .ic-tint .bar.on .lic.haic, .ic-tint .tile.live .lic.haic, .ic-tint .navb.sel .lic.haic, .ic-tint .title .lic.haic { color: var(--lp-ic-on); }\n.ic-tint .scene .lic.haic { color: var(--sc, var(--lp-ic-on)); }\n.box.mix, .box.spread, .box.fit { overflow: visible; min-height: auto; }\n.box.mix > .grid, .box.mix > .bars { min-height: auto; }\n.phone .box.mix, .phone .box.spread, .phone .box.fit { min-height: 0; }\n.box.fill > .scene { flex: 1 1 0px; min-height: 48px; }\n.box.fill > .grid, .box.fill > .bars { flex: 1 1 auto; }\n.box.fill > .emb, .box.fill > .row { flex: 0 0 auto; }\n.box.al-center { justify-content: center; }\n.box.al-center > .title { margin-bottom: auto; }\n.box.al-center > .title ~ :last-child { margin-bottom: auto; }\n.box.al-spread > * + *:not(.title + *) { margin-top: auto; }\n.tile .lic { width: var(--lp-icw, 40%); }\n.tile.val .lic { width: var(--lp-icw, 32%); }\n.tile .nm { font-size: var(--lp-fs, 16px); line-height: calc(var(--lp-fs, 16px) * 1.2); }\n.tile.val .vl { font-size: var(--lp-fs, 17px); line-height: calc(var(--lp-fs, 17px) + 3px); }\n.tile.val .nm { font-size: 13px; line-height: 16px; }\n.bar .lic { width: var(--lp-icw, 34px); height: var(--lp-icw, 34px); }\n.bar .nm { font-size: var(--lp-fs, 17px); line-height: calc(var(--lp-fs, 17px) + 4px); }\n.si .lic { width: var(--lp-icw, 40px); height: var(--lp-icw, 40px); }\n.scene span { font-size: var(--lp-fs, 18px); }\n.phone .bar .lic { width: 24px; height: 24px; }\n.phone .bar .nm { font-size: 14px; line-height: 18px; }\n.phone .tile .nm { font-size: 12px; line-height: 15px; }\n.phone .tile.val .nm { font-size: 11px; line-height: 13px; }\n.phone .tile.val .vl { font-size: 13px; line-height: 16px; }\n.phone .scene .lic { width: 28px; height: 28px; }\n.phone .scene span { font-size: 14px; }\n.sub { overflow-y: auto; overflow-x: hidden; padding: 4px; margin: -4px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }\n.sub::-webkit-scrollbar { display: none; }\n.vrows { display: grid; grid-gap: 8px; flex: 0 0 auto; }\n.vrow { display: flex; align-items: center; height: 44px; padding: 0 12px; border-radius: 14px; background: var(--lp-card); cursor: pointer; min-width: 0; box-sizing: border-box; color: var(--lp-text); transition: all 0.2s ease-out; }\n.vrow .lic { flex: 0 0 auto; width: var(--lp-icw, 22px); height: var(--lp-icw, 22px); margin-right: 10px; }\n.vrow .rn { flex: 1 1 auto; min-width: 0; font-size: var(--lp-fs, 15px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.vrow .rv { flex: 0 0 auto; margin-left: 8px; font-size: var(--lp-fs, 15px); font-weight: 700; white-space: nowrap; }\n.vrow.on { box-shadow: inset 0 0 0 2px var(--tile-rgb, var(--lp-on-border)); background-color: rgba(255, 255, 255, 0.05); }\n.vrow.na { opacity: 0.5; }\n.phone .vrow { height: 40px; }\n.scene.ebtn .sb { flex: 1 1 auto; min-width: 0; padding-left: 6px; }\n.scene.ebtn .sn { display: block; font-size: var(--lp-fs, 18px); font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.scene.ebtn .sv { display: block; font-style: normal; font-size: 14px; color: var(--lp-text2); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.scene.ebtn.on { box-shadow: inset 0 0 0 2px var(--tile-rgb, var(--lp-on-border)); background-color: rgba(255, 255, 255, 0.05); }\n.scene.ebtn.na { opacity: 0.5; }\n.box.mix > .vrows, .box.fill > .vrows { flex: 0 0 auto; }\n.tile.act .nm { margin-top: 8px; }\n.ic-auto .tile.act .lic, .ic-auto .vrow.act .lic { filter: none; opacity: 1; }\n.ic-tint .tile.act .lic.mdic, .ic-tint .vrow.act .lic.mdic { color: var(--sc, var(--lp-ic-on)); }\n.ic-auto .vrow:not(.on):not(.live):not(.act) .lic, .ic-auto .ebtn:not(.on):not(.live) .lic { filter: grayscale(1) brightness(1.1); opacity: 0.7; }\n.ic-tint .vrow.on .lic, .ic-tint .vrow.live .lic, .ic-tint .ebtn.on .lic, .ic-tint .ebtn.live .lic { color: var(--lp-ic-on); }\n.icc .lic, .icc .lic.haic { color: var(--ic) !important; filter: none !important; opacity: 1 !important; }\n.tile.zc { border: 2px solid var(--tile-rgb); }\n.tile.val.zc .vl, .vrow.zc .rv, .ebtn.zc .sv { color: var(--tile-rgb); }\n.emb { position: relative; }\n.tapov { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 2; cursor: pointer; border-radius: 20px; }\n.tapov.down { background: rgba(255, 255, 255, 0.06); }\n.pets { display: grid; grid-gap: 8px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); flex: 0 0 auto; }\n.petc { position: relative; display: flex; align-items: center; min-height: 96px; padding: 14px 16px 14px 14px; border-radius: 20px; background: var(--lp-embed-bg);\noverflow: hidden; cursor: pointer; box-sizing: border-box; color: var(--lp-text); --pc: 150,150,150; transition: transform 0.1s ease-out; }\n.petc::before { content: ''; position: absolute; left: -46px; top: 50%; width: 170px; height: 170px; margin-top: -85px; border-radius: 50%; pointer-events: none;\nbackground: radial-gradient(circle, rgba(var(--pc), 0.55) 0%, rgba(var(--pc), 0.2) 42%, rgba(var(--pc), 0) 70%); animation: lppetb 4.4s ease-in-out infinite; }\n.petc .pi { position: relative; flex: 0 0 62px; height: 62px; border-radius: 50%; background: rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center; margin-right: 14px; }\n.petc .pi .lic { width: 38px; height: 38px; }\n.petc .pt { position: relative; flex: 1 1 auto; min-width: 0; }\n.petc .pt b { display: block; font-size: 18px; line-height: 22px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.petc .ps { display: block; margin-top: 2px; font-size: 15px; line-height: 19px; font-weight: 600; color: rgb(var(--pc)); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.petc .pn { display: block; margin-top: 1px; font-size: 13px; line-height: 17px; color: var(--lp-text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.petc.st-never .ps { color: var(--lp-text2); }\n.petc.st-due { box-shadow: inset 0 0 0 2px rgba(var(--pc), 0.7); }\n.petc.st-late { animation: lppetf 1.2s ease-in-out infinite; }\n.petc.st-late::before { animation-duration: 1.2s; }\n.petc.just .ps { color: rgb(40, 190, 100); }\n.petc.down { transform: scale(0.97); }\n@keyframes lppetb { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }\n@keyframes lppetf { 0%, 100% { box-shadow: inset 0 0 0 2px rgba(var(--pc), 0.25); } 50% { box-shadow: inset 0 0 0 2px rgba(var(--pc), 1); } }\n.box.mix > .pets, .box.fill > .pets { flex: 0 0 auto; }\n.phone .pets { grid-template-columns: 1fr; }\n.box.fill > * + * { margin-top: var(--lp-gap, 12px); }\n.vrows, .pets { grid-gap: var(--lp-gapg, 8px); }\n.box.fill > .emb { flex: 1 1 0px; min-height: 80px; }\n.box.fill > .emb > *, .emb.hfix > * { height: 100%; }\n.emb.hfix { display: flex; flex-direction: column; }\n.emb.hfix > * { flex: 1 1 auto; }\n.subt { flex: 0 0 auto; padding: 10px 2px 2px; font-size: 14px; line-height: 18px; font-weight: 700; letter-spacing: 0.04em; color: var(--lp-text2); text-align: center; }\n.tile.wide { flex-direction: row; justify-content: center; padding: 0 12px; }\n.tile.wide .lic { flex: 0 0 auto; width: var(--lp-icwp, 40px); margin-right: 14px; }\n.tile.wide .lic:empty { height: var(--lp-icwp, 40px); padding-bottom: 0; }\n.tile.wide .nm { margin-top: 0; text-align: left; }\n.tile.val.wide { display: grid; grid-template-columns: auto minmax(0, auto); grid-template-rows: auto auto; align-content: center; justify-content: center; grid-column-gap: 14px; }\n.tile.val.wide .lic { grid-row: 1 / 3; align-self: center; margin-right: 0; }\n.tile.val.wide .vl { margin-top: 0; text-align: left; padding: 0; align-self: end; }\n.tile.val.wide .nm { text-align: left; padding: 0; align-self: start; }\n.tile .sl { margin-top: 2px; font-size: 12.5px; line-height: 15px; color: var(--lp-text2); max-width: 100%; padding: 0 6px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.tile.wide .sl { text-align: left; padding: 0; }\n.tile.val.wide .sl { grid-column: 2; }\n.scene .s2w { display: block; flex: 1 1 auto; min-width: 0; padding-left: 6px; }\n.scene .s2w b { display: block; font-weight: 400; font-size: var(--lp-fs, 18px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.scene .s2w .ss { display: block; font-style: normal; font-size: 13.5px; color: var(--lp-text2); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.phone .tile .sl { font-size: 10.5px; line-height: 13px; }\n.si .lic.haic { flex: 0 0 auto; }\n.tile.fbk, .scene.fbk { position: relative; }\n.tile.fbk::after, .bar.fbk::after, .scene.fbk::after { content: ''; position: absolute; top: 8px; right: 8px; width: 9px; height: 9px; border-radius: 50%; background: #F0A93B; box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35); pointer-events: none; }";
const ADMIN_CSS = ":host { display: block; height: 100vh; height: 100dvh; font-family: var(--lemur-font, Archivo, var(--ha-font-family-body, system-ui), sans-serif); }\n* { box-sizing: border-box; }\nbutton, input, select { font-family: inherit; color: inherit; font-size: inherit; }\nbutton { cursor: pointer; }\nha-icon { --mdc-icon-size: 100%; display: inline-flex; width: 20px; height: 20px; flex: none; }\n.s14 { width: 14px; height: 14px; } .s16 { width: 16px; height: 16px; } .s18 { width: 18px; height: 18px; } .s24 { width: 24px; height: 24px; }\n.app { position: relative; height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 0 16px 16px; background: #0B0C0E; color: #ECEDEE;\noverflow: hidden; font-size: 14px; line-height: 1.4;\n--bg: #0B0C0E; --s1: #131417; --s2: #18191D; --s3: #1F2125; --s4: #272A2F; --s5: #30333A;\n--ln: rgba(255,255,255,.06); --ln2: rgba(255,255,255,.10); --ln3: rgba(255,255,255,.18);\n--tx: #ECEDEE; --tx2: #B3B7BE; --mu: #7C818A; --mu2: #5A5E66;\n--ac: #F2A93B; --acs: rgba(242,169,59,.13); --acl: rgba(242,169,59,.55); --actx: #1B1206;\n--red: #EE6A5F; --reds: rgba(238,106,95,.12); --tint: #261C10;\n--r1: 22px; --r2: 14px; --r3: 10px; }\n.grow { flex: 1; }\n.mu { color: var(--mu); }\n.top { display: flex; align-items: center; gap: 10px; min-height: 60px; flex: none; }\n.lg { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(140deg, #F4B24A, #E2702C); display: grid; place-items: center; color: var(--actx); flex: none; }\n.lg ha-icon { width: 18px; height: 18px; }\n.top h1 { font-size: 16px; font-weight: 600; margin: 0 6px 0 2px; letter-spacing: -.01em; white-space: nowrap; }\n.badge { font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: var(--acs); color: var(--ac); border: 1px solid var(--acl); white-space: nowrap; }\n.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 34px; padding: 0 12px; border-radius: var(--r3);\nborder: 1px solid var(--ln2); background: var(--s2); font-size: 13px; font-weight: 500; color: var(--tx); white-space: nowrap; }\n.btn:hover { background: var(--s3); }\n.btn:disabled { opacity: .35; cursor: default; }\n.btn.ic { width: 34px; padding: 0; }\n.btn.pri { background: var(--ac); color: var(--actx); border-color: var(--ac); }\n.btn.pri:hover { filter: brightness(1.06); }\n.btn.dan { color: var(--red); }\n.btn.dan.ask { background: var(--reds); border-color: rgba(238,106,95,.45); }\n.btn.sm { height: 30px; font-size: 12.5px; padding: 0 10px; }\n.btn.dash { border-style: dashed; background: none; color: var(--tx2); }\n.btn.dash:hover { color: var(--tx); background: var(--s2); }\n.warn { background: var(--reds); border: 1px solid rgba(238,106,95,.35); color: #F3B0A9; padding: 10px 14px; border-radius: var(--r2); font-size: 13px; flex: none; }\n.rblock { flex: none; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); padding: 10px; }\n.rooms { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 1px; margin-bottom: -1px; position: relative; z-index: 2; align-items: flex-start; scrollbar-width: none; }\n.rooms::-webkit-scrollbar { display: none; }\n.rb { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 130px; padding: 14px 18px; border-radius: var(--r2); background: var(--s2);\nborder: 1px solid transparent; font-weight: 600; font-size: 16px; line-height: 1.2; white-space: nowrap; color: var(--tx2); cursor: pointer; flex: none; user-select: none; touch-action: none; }\n.rb ha-icon { width: 24px; height: 24px; }\n.rb:hover { background: var(--s3); color: var(--tx); }\n.rb.on { background: var(--tint); color: var(--ac); border: 1px solid var(--acl); border-bottom-color: var(--tint); border-radius: var(--r2) var(--r2) 0 0;\npadding-bottom: 24px; margin-bottom: -1px; }\n.rb.add { background: none; border: 1px dashed var(--ln2); color: var(--mu); font-weight: 500; min-width: 0; }\n.rb.add:hover { color: var(--tx); }\n.rpanel { position: relative; z-index: 1; background: var(--tint); border: 1px solid var(--acl); border-radius: var(--r2); padding: 12px; display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: flex-end; }\n.rpanel.first { border-top-left-radius: 0; }\n.fld { display: flex; flex-direction: column; gap: 6px; min-width: 0; }\n.fld > label, .lbl { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); }\n.inp { flex-shrink: 0; height: 36px; border-radius: var(--r3); border: 1px solid var(--ln2); background: var(--s2); padding: 0 11px; color: var(--tx); outline: none; min-width: 0; width: 100%; }\n.inp:focus { border-color: var(--acl); background: var(--s3); }\nselect.inp { padding-right: 6px; }\n.iconin { display: flex; align-items: center; gap: 8px; }\n.iconin .pv { width: 36px; height: 36px; border-radius: var(--r3); background: var(--s3); display: grid; place-items: center; flex: none; }\n.iconin .pv ha-icon { width: 20px; height: 20px; }\n.iconin .inp { flex: 1 1 auto; min-width: 0; }\n.iconin .btn { flex: none; }\n.it .sub .inp { flex: 1 1 auto; min-width: 0; }\n.seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 11px; background: var(--s2); border: 1px solid var(--ln2); flex-wrap: wrap; }\n.seg button { height: 30px; padding: 0 12px; border: none; border-radius: 8px; background: none; color: var(--tx2); font-weight: 500; font-size: 13px; white-space: nowrap; }\n.seg button:hover { color: var(--tx); }\n.seg button.on { background: var(--s4); color: var(--tx); box-shadow: 0 1px 2px rgba(0,0,0,.35); }\n.tg { width: 42px; height: 24px; border-radius: 99px; border: none; background: var(--s5); position: relative; flex: none; padding: 0; transition: background .15s; }\n.tg::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left .15s; }\n.tg.on { background: var(--ac); }\n.tg.on::after { left: 21px; }\n.main { flex: 1; display: flex; gap: 12px; min-height: 0; }\n.pvw { flex: 1 1 auto; min-width: 0; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); padding: 12px; display: flex; flex-direction: column; gap: 10px; }\n.pvh { display: flex; align-items: center; gap: 8px; color: var(--tx2); font-size: 13px; }\n.pvh b { color: var(--tx); font-weight: 600; }\n.pvh .seg button { height: 26px; padding: 0 10px; font-size: 12px; }\n.pvbox { position: relative; flex: 1; min-height: 200px; overflow: hidden; border-radius: 14px; background: #08090b; }\n.pvc { position: absolute; left: 0; top: 0; transform-origin: 0 0; border-radius: 0; overflow: hidden; }\n.ins { flex: 0 0 420px; min-width: 0; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); display: flex; flex-direction: column; min-height: 0; }\n.ins .sc { overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 14px; min-height: 0; flex: 1; scrollbar-width: thin; }\n.ins h3 { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); display: flex; align-items: center; gap: 8px; }\n.narrowv .main { flex-direction: column; overflow-y: auto; }\n.narrowv .pvw { flex: none; height: 46vh; }\n.narrowv .ins { flex: none; }\n.sl { display: flex; flex-direction: column; gap: 6px; }\n.si { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 12px; background: var(--s2); border: 1px solid transparent; cursor: pointer; user-select: none; }\n.si:hover { background: var(--s3); }\n.si.on { background: var(--tint); border-color: var(--acl); }\n.si .ti { width: 30px; height: 30px; border-radius: 9px; background: var(--s4); display: grid; place-items: center; flex: none; color: var(--tx2); }\n.si.on .ti { background: var(--acs); color: var(--ac); }\n.si .ti ha-icon { width: 18px; height: 18px; }\n.si .nm { flex: 1; min-width: 0; }\n.si .nm b { display: block; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.si .nm span { font-size: 12px; color: var(--mu); }\n.cb { font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: var(--s4); color: var(--tx2); flex: none; }\n.hd { color: var(--mu2); cursor: grab; display: grid; place-items: center; width: 18px; flex: none; touch-action: none; }\n.hd:hover { color: var(--tx2); }\n.dragging { opacity: .45; }\n.dropb { box-shadow: 0 -2px 0 var(--ac); }\n.dropa { box-shadow: 0 2px 0 var(--ac); }\n.rooms .dropb { box-shadow: -3px 0 0 var(--ac); }\n.rooms .dropa { box-shadow: 3px 0 0 var(--ac); }\n.ed { display: flex; flex-direction: column; gap: 12px; padding: 12px; border-radius: 16px; background: var(--s2); border: 1px solid var(--ln); }\n.row2 { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }\n.row2 > .fld { flex: 1 1 140px; }\n.items { display: flex; flex-direction: column; gap: 6px; }\n.it { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 11px; background: var(--s3); }\n.it .ico { width: 30px; height: 30px; border-radius: 9px; background: var(--s4); display: grid; place-items: center; flex: none; }\n.it .ico ha-icon, .it .ico ha-state-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }\n.it .col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }\n.it .inp { height: 30px; font-size: 13px; padding: 0 8px; }\n.it .eid { font-size: 11.5px; color: var(--mu); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.it .x { width: 28px; height: 28px; border: none; background: none; color: var(--mu); border-radius: 8px; display: grid; place-items: center; flex: none; }\n.it .x:hover { background: var(--s4); color: var(--red); }\n.it input[type=color] { width: 30px; height: 30px; border: none; border-radius: 9px; padding: 0; background: none; flex: none; cursor: pointer; }\n.it input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }\n.it input[type=color]::-webkit-color-swatch { border: none; border-radius: 9px; }\n.it .sub { display: flex; gap: 6px; }\n.it .sub select { flex: 1; min-width: 0; height: 28px; font-size: 12px; }\n.it.ph { opacity: .75; }\n.acts { display: flex; gap: 8px; flex-wrap: wrap; }\n.empty { padding: 14px; border-radius: 12px; border: 1px dashed var(--ln2); color: var(--mu); font-size: 13px; text-align: center; }\n.hint { font-size: 12.5px; color: var(--mu); }\n.menu { position: absolute; z-index: 30; min-width: 220px; background: var(--s2); border: 1px solid var(--ln2); border-radius: 14px; padding: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.5); }\n.menu button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: none; background: none; border-radius: 9px; text-align: left; color: var(--tx); }\n.menu button:hover { background: var(--s3); }\n.menu button.dan { color: var(--red); }\n.menu hr { border: none; border-top: 1px solid var(--ln); margin: 6px 4px; }\n.menu .mh { font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); padding: 6px 10px 4px; }\n.ov { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 40; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; padding: 24px; }\n.dlg { width: min(900px, 100%); max-height: 100%; background: #111215; border: 1px solid var(--ln2); border-radius: 22px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.6); }\n.dlg.sm { width: min(560px, 100%); }\n.dh { display: flex; align-items: center; gap: 12px; padding: 18px 20px 12px; }\n.dh .di { width: 38px; height: 38px; border-radius: 50%; background: var(--s3); display: grid; place-items: center; color: var(--ac); flex: none; }\n.dh h2 { margin: 0; font-size: 18px; font-weight: 600; flex: 1; }\n.db { padding: 4px 20px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; min-height: 0; }\n.df { display: flex; gap: 10px; justify-content: flex-end; padding: 12px 20px 18px; border-top: 1px solid var(--ln); align-items: center; }\n.sh { font-size: 11.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--mu); margin: 10px 4px 0; }\n.srow { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 16px; background: var(--s1); border: 1px solid var(--ln); }\n.srow .t { flex: 1; min-width: 0; }\n.srow .t b { display: block; font-weight: 600; }\n.srow .t span { font-size: 12.5px; color: var(--mu); }\n.srow .inp { width: 120px; }\n.srow .inp.w { width: 260px; }\n.plist { display: flex; flex-direction: column; gap: 4px; }\n.pg { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); margin: 10px 4px 2px; }\n.pi { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 12px; background: var(--s1); border: 1px solid transparent; cursor: pointer; user-select: none; }\n.pi:hover { background: var(--s2); }\n.pi.on { border-color: var(--acl); background: var(--tint); }\n.pi.dis { opacity: .45; cursor: default; }\n.pi .ck { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--ln3); display: grid; place-items: center; flex: none; color: var(--actx); }\n.pi.on .ck { background: var(--ac); border-color: var(--ac); }\n.pi .ico { width: 30px; height: 30px; border-radius: 9px; background: var(--s3); display: grid; place-items: center; flex: none; }\n.pi .ico ha-state-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }\n.pi .t { flex: 1; min-width: 0; }\n.pi .t b { display: block; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.pi .t span { font-size: 12px; color: var(--mu); }\n.pi .st { font-size: 12px; color: var(--tx2); flex: none; }\n.toast { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%) translateY(20px); opacity: 0; pointer-events: none; z-index: 50;\ndisplay: flex; align-items: center; gap: 14px; padding: 10px 12px 10px 16px; border-radius: 14px; background: #24262B; border: 1px solid var(--ln2);\nbox-shadow: 0 14px 30px rgba(0,0,0,.45); transition: all .2s; font-size: 13.5px; }\n.toast.show { opacity: 1; transform: translateX(-50%); pointer-events: auto; }\n.toast button { border: none; background: var(--s4); color: var(--ac); font-weight: 600; padding: 6px 10px; border-radius: 9px; }\n.toast button[hidden] { display: none; }\n.lecna { color: #F3B0A9; font-weight: 600; }\n.lecinfo { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 14px; border-radius: var(--r2); background: linear-gradient(135deg, rgba(255,111,174,.14), rgba(142,124,255,.14)); border: 1px solid rgba(255,111,174,.35); }\n.lecinfo > ha-icon { --mdc-icon-size: 22px; color: #FF6FAE; flex: none; }\n.lecinfo .t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; font-size: 13px; }\n.lecinfo .t span { color: var(--tx2, #B5B9C0); line-height: 1.45; }\n.ipb { width: 28px; height: 28px; min-width: 28px; padding: 0; flex: none; }\n.ilist { display: flex; flex-direction: column; }\n.igrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; }\n.icell { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 4px 8px; border-radius: 12px; background: var(--s1); border: 1px solid transparent; cursor: pointer; min-width: 0; }\n.icell:hover { background: var(--s2); }\n.icell.on { border-color: var(--acl); background: var(--tint); }\n.icell ha-icon { --mdc-icon-size: 26px; width: 26px; height: 26px; color: var(--tx); }\n.icell span { font-size: 10.5px; color: var(--mu); max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.bgsw { width: 100%; display: flex; flex-wrap: wrap; margin-top: 4px; }\n.bgc { width: 34px; height: 34px; border-radius: 10px; border: 2px solid var(--ln2); margin: 0 8px 8px 0; cursor: pointer; padding: 0; box-sizing: border-box; position: relative; }\n.bgc.on { border-color: var(--acl); box-shadow: 0 0 0 2px rgba(240, 169, 59, 0.35); }\n.bgc.pick { display: inline-flex; align-items: center; justify-content: center; background: var(--s3); color: var(--tx2); overflow: hidden; }\n.bgc.pick input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }\n.bgfx { width: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); grid-gap: 8px; margin-top: 4px; }\n.fxs { display: flex; flex-direction: column; align-items: stretch; padding: 6px; border-radius: 12px; border: 1px solid var(--ln2); background: var(--s2); color: var(--tx2); cursor: pointer; font-size: 11.5px; }\n.fxs i { display: block; height: 34px; border-radius: 8px; margin-bottom: 5px; }\n.fxs.on { border-color: var(--acl); color: var(--tx); background: var(--s3); }\n.fxs span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }\n.lic { display: inline-block; line-height: 0; flex: 0 0 auto; }\n.lic svg { width: 100%; height: 100%; display: block; }\n.rb .lic { width: 26px; height: 26px; }\n:host(.ic-auto) .rb:not(.on) .lic { filter: grayscale(1) brightness(1.15); opacity: 0.55; }\n:host(.ic-tint) .lic.mdic { color: #9AA6BE; } :host(.ic-tint) .rb.on .lic.mdic { color: var(--lp-ic-on, #FFC24A); }\n:host(.ic-mono) .rb .lic, :host(.ic-mono) .it .lic, :host(.ic-mono) .pv .lic, :host(.ic-mono) .pi .lic { filter: grayscale(1) brightness(1.1); opacity: 0.7; }\n.lic.s16 { width: 16px; height: 16px; margin-right: 8px; }\n.pi .ico .lic { width: 22px; height: 22px; }\n.iconin .pv .lic { width: 22px; height: 22px; }\n.it .ico .lic { width: 22px; height: 22px; }\n.icell .lic { width: 34px; height: 34px; }\n.srow.upd .ubtn { display: flex; gap: 8px; flex: 0 0 auto; }\n.srow.upd a { color: var(--ac); }\n.uok { color: #46CF3C; } .unew { color: var(--ac); } .uerr { color: var(--red); }\n.news .db { display: flex; flex-direction: column; gap: 12px; }\n.news .nv { padding: 14px 16px; border-radius: 16px; background: var(--s1); border: 1px solid var(--ln); }\n.news .nv.cur { border-color: var(--acl); background: var(--tint); }\n.news .nvh { font-weight: 700; margin-bottom: 6px; }\n.news .nv.cur .nvh { color: var(--ac); }\n.news ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }\n.news .lnk { align-self: flex-start; background: none; border: 0; color: var(--ac); font: inherit; cursor: pointer; padding: 4px 0; }\n.dh .di .lic { width: 22px; height: 22px; }\n.rep .db { display: flex; flex-direction: column; gap: 10px; }\n.rep .rl { font-weight: 600; }\n.rep .rl span { display: block; font-weight: 400; color: var(--mu); font-size: 12.5px; }\n.rep textarea { width: 100%; box-sizing: border-box; min-height: 110px; resize: vertical; font: inherit; }\n.rinfo { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; padding: 12px 14px; border-radius: 14px; background: var(--s1); border: 1px solid var(--ln); font-size: 12.5px; }\n.rinfo > div { display: contents; }\n.rinfo span { color: var(--mu); }\n.rinfo b { font-weight: 500; word-break: break-word; }\n.rnote { color: var(--mu); font-size: 12.5px; margin: 0; }\nlabel.btn { cursor: pointer; }\n.imdlg .db { display: flex; flex-direction: column; gap: 14px; }\n.inp.ta { height: auto; min-height: 64px; padding: 8px 10px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12.5px; line-height: 1.5; white-space: pre; overflow: auto; tab-size: 2; }\n.imact { display: flex; flex-direction: column; gap: 8px; }\n.imact .fld .fld { margin-top: 8px; }\n.imvis { display: flex; flex-direction: column; gap: 10px; }\n.imvis .fld.nar { flex: 0 0 170px; }\n.imerr { margin: 0 20px 10px; padding: 10px 12px; border-radius: 12px; background: rgba(229, 72, 77, .12); color: #FF9592; font-size: 13px; }\n.cnd { color: #F2A93B; font-weight: 600; }\n.it .cty { font-size: 13px; font-weight: 600; }\n.it .x + .x { margin-left: 2px; }\n.it .x[data-im]:hover { color: var(--tx, #fff); }\n.imdlg .seg { flex-wrap: wrap; } .imdlg .fld.nar2 { flex: 1 1 200px; }\n.clrf .seg { align-items: center; }\n.clrf input[type=color] { width: 40px; height: 28px; padding: 0; border: none; background: none; cursor: pointer; opacity: .45; }\n.clrf input[type=color].set { opacity: 1; }\n.zones { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }\n.zones input[type=color] { width: 36px; height: 30px; padding: 0; border: none; background: none; cursor: pointer; }\n.zones .inp { width: 70px; height: 30px; }\n.hsw { width: 22px; height: 22px; min-width: 0; padding: 0 !important; border-radius: 50% !important; border: 2px solid transparent !important; margin: 0 2px; }\n.hsw.on { border-color: #fff !important; }\n.scrows { display: flex; flex-direction: column; gap: 6px; }\n.scr { display: flex; gap: 8px; align-items: center; }\n.scr .inp { flex: 1 1 auto; }\n.scr input[type=color] { width: 40px; height: 32px; padding: 0; border: none; background: none; cursor: pointer; }\n.modeseg { margin-right: 4px; }\n.hlp { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; margin-left: 6px; padding: 0; border-radius: 50%; border: 1px solid var(--ln2); background: var(--s2); color: var(--tx2);\nfont: 700 11px/1 inherit; cursor: pointer; vertical-align: 1px; text-transform: none; letter-spacing: 0; }\n.hlp:hover { background: #F2A93B; border-color: #F2A93B; color: #111; }\n.hlpov { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 60; background: rgba(0, 0, 0, .55); display: flex; align-items: center; justify-content: center; padding: 20px; }\n.hlpd { width: min(520px, 100%); max-height: 100%; overflow: auto; background: #111215; border: 1px solid var(--ln2); border-radius: 22px; box-shadow: 0 30px 80px rgba(0,0,0,.6); }\n.hlpd .hb { padding: 4px 22px 20px; font-size: 14px; line-height: 1.55; color: var(--tx); }\n.hlpd .hb p { margin: 0 0 10px; white-space: pre-line; }\n.hlpd .hb b { color: #F2A93B; font-weight: 600; }\n.advnote { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; background: rgba(242, 169, 59, .1); color: var(--tx2); font-size: 13px; line-height: 1.4; }\n.advnote ha-icon { color: #F2A93B; --mdc-icon-size: 20px; flex: none; }\n.advnote span { flex: 1; }\n.advb { color: var(--mu); font-weight: 600; }\n.cplist .pg { margin: 12px 2px 8px; }\n.cpg { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }\n.cpi { display: flex; align-items: center; gap: 12px; text-align: left; padding: 10px 12px; border-radius: 14px; border: 1px solid var(--ln); background: var(--s1); color: var(--tx); cursor: pointer; font: inherit; }\n.cpi:hover { border-color: #F2A93B; }\n.cpi .lic { width: 28px; height: 28px; flex: none; }\n.cpi span { min-width: 0; }\n.cpi b { display: block; font-weight: 600; font-size: 14px; }\n.cpi i { display: block; font-style: normal; font-size: 12px; color: var(--mu); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.cedlg { width: min(1100px, 100%); }\n.cebody { display: flex; gap: 18px; padding: 4px 20px 16px; min-height: 0; flex: 1 1 auto; overflow: hidden; }\n.cel { flex: 1 1 55%; min-width: 0; overflow: auto; display: flex; flex-direction: column; gap: 10px; }\n.cer { flex: 1 1 45%; min-width: 0; overflow: auto; }\n.cer .lbl { margin-bottom: 8px; }\n.cepv { padding: 14px; border-radius: 18px; background: #0b0e15; border: 1px solid var(--ln); --ha-card-background: rgb(28, 28, 28); --card-background-color: rgb(28, 28, 28); --ha-card-border-radius: 20px; --primary-text-color: #fff; --secondary-text-color: #D3D3D3; }\n.cepv .cwarn { display: flex; align-items: center; gap: 8px; color: #FF9592; font-size: 13px; }\n.ceed { min-height: 120px; }\n@media (max-width: 600px) {\n.top { flex-wrap: wrap; row-gap: 8px; padding: 6px 0; }\n.top h1, .top .badge { display: none; }\n.modeseg button { white-space: nowrap; }\n.srow { flex-wrap: wrap; }\n.srow .t { flex: 1 1 100%; }\n.srow .inp.w { width: 100%; }\n.df { flex-wrap: wrap; }\n.srow .seg { flex-wrap: wrap; max-width: 100%; }\n}\n.wallrow { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 10px; width: 100%; padding: 10px 0; border-top: 1px solid var(--ln); align-items: end; }\n.wallrow .fld { margin: 0; min-width: 0; }\n.wallrow select.inp, .wallrow input.inp { width: 100%; box-sizing: border-box; }\n.wallrow .btn.dan { justify-self: start; }\n.wallrow .wallw { grid-column: 1 / -1; color: var(--ac); }";
// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', room_lights: '{area} IŞIKLARI', scenes: 'SENARYOLAR', shortcuts: 'KISAYOLLAR',
    control: 'EV KONTROL', other_control: 'DİĞER CİHAZLAR', media: 'MEDYA',
    empty: 'Bu sekmede gösterilecek cihaz yok. Yönetim panelinden ekleyebilirsin.',
    edit_empty: 'Boş bölüm · sağdan "Cihaz ekle" ya da başka bölümden bir öğeyi buraya sürükle', col_empty: 'Boş sütun · bir kutuyu ⠿ tutamağından tutup buraya sürükle ya da', add_section: 'Bölüm ekle', effects: 'Efektler', too_full: 'Ekrana sığmıyor', drag_box: 'Kutuyu taşımak için tut ve sürükle',
    fb: 'Yedek yoldan kontrol edildi: {t}', heat: 'Isıtıyor', cool: 'Soğutuyor', idle: 'Beklemede', off: 'Kapalı', on: 'Açık', playing: 'Çalıyor', paused: 'Duraklatıldı', unavailable: 'Ulaşılamıyor', open: 'Açık', closed: 'Kapalı', opening: 'Açılıyor', closing: 'Kapanıyor',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', room_lights: '{area} LIGHTS', scenes: 'SCENES', shortcuts: 'SHORTCUTS',
    control: 'CONTROLS', other_control: 'OTHER DEVICES', media: 'MEDIA',
    empty: 'Nothing to show on this tab yet. Add devices from the admin panel.',
    edit_empty: 'Empty section · use "Add device" on the right or drag an item here from another section', col_empty: 'Empty sub-column · drag a box here by its ⠿ handle, or', add_section: 'Add section', effects: 'Effects', too_full: "Doesn't fit the screen", drag_box: 'Hold and drag to move the box',
    fb: 'Controlled through the backup: {t}', heat: 'Heating', cool: 'Cooling', idle: 'Idle', off: 'Off', on: 'On', playing: 'Playing', paused: 'Paused', unavailable: 'Unavailable', open: 'Open', closed: 'Closed', opening: 'Opening', closing: 'Closing',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Tabs, sections and sizes of the dashboard will be edited here. (Work in progress)',
    reset: 'Reset to defaults', save: 'Save', saved: 'Saved', not_loaded: 'The Lemur Home Dashboard integration is not loaded.' }
};
// Dil: ayarda tr/en seçildiyse o, yoksa (auto) kullanıcının HA arayüz dili.
function pickLang(hass) {
  const st = window.__LEMUR_HOME_DASHBOARD_STORE, set = st && st.data && st.data.settings && st.data.settings.language;
  if (set === 'tr' || set === 'en') return set;
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}
function t(lang, key, vars) {
  const d = TXT[lang] || TXT.en;
  let s = d[key] !== undefined ? d[key] : (TXT.en[key] !== undefined ? TXT.en[key] : key);
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}
// Türkçe büyük harf (i → İ, ı → I). Eski Safari'de yerel ayarlı dönüşüm yoksa elle yapılır.
function upper(lang, s) {
  s = String(s);
  if (lang === 'tr') s = s.replace(/i/g, 'İ').replace(/ı/g, 'I');
  return s.toUpperCase();
}

// Güvenlik denetimleri (Light Effect Card v1.6.1 ile aynı yaklaşım). Saf işlevler, DOM yok; tests/frontend_safe.test.js denetler.
// SVG simgeler HTML olarak eklenir: yalnız tek <svg>…</svg>, betik / olay / dış bağlantı yok (lemur-icons/birlestir.py ile aynı kurallar).
const LHD_ICON_BAD = /<script|<foreignObject|<iframe|<object|<embed|<image|<a[\s>]|<use[^>]*href\s*=\s*["'](?!#)|\son[a-z]+\s*=|javascript:|data:text|href\s*=\s*["'](?!#)|xlink:href\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i;
const lhdSafeSvg = (v) => typeof v === 'string' && v.length < 60000 && /^\s*<svg[\s>][\s\S]*<\/svg>\s*$/i.test(v) && !LHD_ICON_BAD.test(v) && (v.match(/<svg[\s>]/gi) || []).length === 1;
// simge seti dosyası: anahtar biçimi ve SVG'si temiz olanlar kalır
function lhdSafeIcons(d, keyRe) {
  const o = {};
  if (d && typeof d === 'object' && !Array.isArray(d)) Object.keys(d).forEach((k) => { if (keyRe.test(k) && lhdSafeSvg(d[k])) o[k] = d[k]; });
  return o;
}
// açılabilir adres: yalnız http(s):// ya da / ile başlayan yol (javascript:, data: vb. değil)
const lhdSafeUrl = (u) => typeof u === 'string' && (/^https?:\/\/[^\s"'<>]+$/i.test(u) || /^\/(?!\/)[^\s"'<>]*$/.test(u));
// servis adı ve besleme / bildirim için izinli alanlar (yönetici olmayan "Besledim" dediğinde entegrasyon yetkisiyle çalışır)
const LHD_SVC_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const LHD_FEEDER_DOMAINS = ['switch', 'button', 'input_button', 'timer', 'script', 'fan', 'number', 'select', 'esphome', 'notify', 'input_boolean', 'light'];
const lhdSafeFeederSvc = (s) => typeof s === 'string' && LHD_SVC_RE.test(s) && LHD_FEEDER_DOMAINS.indexOf(s.split('.')[0]) >= 0;
const lhdSafeNotify = (s) => typeof s === 'string' && /^notify\.[a-z0-9_]+$/.test(s);
const lhdIsObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// eylem: pencere içeriği olarak yalnız kart (html alanı atılır), url eyleminde güvenli adres
function lhdCleanAction(a) {
  if (!lhdIsObj(a)) return a;
  const o = Object.assign({}, a);
  if (lhdIsObj(o.popup)) { const p = {}; if (typeof o.popup.title === 'string') p.title = o.popup.title.slice(0, 200); if (lhdIsObj(o.popup.card)) p.card = o.popup.card; o.popup = p; }
  else if ('popup' in o) delete o.popup;
  if (o.action === 'url' && !lhdSafeUrl(o.url_path)) delete o.url_path;
  return o;
}
// sekmeler: eylemleri temizle, sayıları sayı yap (grow, gap), bozuk öğeleri at
function lhdCleanTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.filter(lhdIsObj).slice(0, 60).map((t) => {
    const T = Object.assign({}, t);
    T.sections = (Array.isArray(t.sections) ? t.sections : []).filter(lhdIsObj).slice(0, 80).map((s) => {
      const S = Object.assign({}, s);
      if ('grow' in S) { const g = parseFloat(S.grow); if (g > 0 && g < 100) S.grow = g; else delete S.grow; }
      if ('gap' in S) { const g = parseFloat(S.gap); if (g >= 0 && g <= 60) S.gap = g; else delete S.gap; }
      S.entities = (Array.isArray(s.entities) ? s.entities : []).filter((x) => typeof x === 'string' || lhdIsObj(x)).slice(0, 200).map((x) => {
        if (typeof x === 'string') return x;
        const it = Object.assign({}, x);
        ['tap', 'hold', 'action'].forEach((k) => { if (k in it) it[k] = lhdCleanAction(it[k]); });
        return it;
      });
      return S;
    });
    return T;
  });
}
// hayvanlar: biçim, izinli besleme servisi ve bildirim hedefi; en çok 50 hayvan
function lhdCleanPets(p) {
  const out = {};
  if (!lhdIsObj(p)) return out;
  Object.keys(p).slice(0, 50).forEach((id) => {
    const x = p[id];
    if (!/^[a-z0-9_-]{1,40}$/.test(id) || !lhdIsObj(x)) return;
    const o = { name: String(x.name || id).slice(0, 60), kind: ['cat', 'dog', 'fish', 'bird', 'rabbit', 'turtle', 'other'].indexOf(x.kind) >= 0 ? x.kind : 'other', mode: x.mode === 'times' ? 'times' : 'interval' };
    const n = (v, lo, hi, d) => { const f = parseFloat(v); return f >= lo && f <= hi ? f : d; };
    o.every_h = n(x.every_h, 0.1, 720, 12); o.soon_min = n(x.soon_min, 0, 1440, 60); o.grace_min = n(x.grace_min, 0, 1440, 30);
    o.times = (Array.isArray(x.times) ? x.times : []).filter((t) => typeof t === 'string' && /^\d{1,2}:\d{2}$/.test(t)).slice(0, 24);
    if (typeof x.icon === 'string' && /^[a-z]+:[a-z0-9-]+$/.test(x.icon)) o.icon = x.icon;
    if (lhdSafeNotify(x.notify)) o.notify = x.notify;
    const f = x.feeder;
    if (lhdIsObj(f) && lhdSafeFeederSvc(f.service)) {
      o.feeder = { service: f.service };
      if (typeof f.target === 'string' && /^[a-z0-9_]+\.[a-z0-9_]+$/.test(f.target)) o.feeder.target = f.target;
      if (lhdIsObj(f.data)) o.feeder.data = f.data;
    }
    out[id] = o;
  });
  return out;
}

// Yenilikler: güncellemeden sonra yönetim panelinde bir kez gösterilir (Ayarlar → Sürüm'den yeniden açılır).
// En yeni sürüm en üstte; ilk kaydın sürümü paketin sürümüyle aynı olmalı, yoksa pencere çıkmaz. Satırlar kısa olsun,
// ayrıntılar GitHub'daki sürüm notlarında. tr dışındaki diller en'e düşer.
const LHD_CHANGES = [
  { v: '0.13.0',
    tr: ['Yedek kontrol (Gelişmiş): Home Assistant\'ta iki kez görünen lambaya (ör. Govee LAN ve Matter) ikinci kopyası yedek olarak seçilir. Komut önce hızlı yoldan gider; lamba birkaç saniye içinde cevap vermezse yedekten gönderilir, karonun köşesinde turuncu nokta çıkar.',
      'Duvar anahtarları (Ayarlar → Gelişmiş): yalnız sinyal veren röle bir lambaya bağlanır; elle basınca lamba açılır/kapanır, açarken parlaklık ve kelvin verilebilir. Aynı anahtarı kullanan HA otomasyonu varsa uyarılır.',
      'Yeni servis: lemur_home_dashboard.control (yedekli aç / kapa / tersine çevir).'],
    en: ['Backup control (Advanced): a lamp that shows up twice in Home Assistant (e.g. Govee LAN and Matter) gets its second copy as a backup. The command goes the fast way first; if the lamp does not answer within a few seconds it is sent through the backup and an orange dot appears in the tile\'s corner.',
      'Wall switches (Settings → Advanced): a relay that only gives a signal is bound to a lamp; pressing it toggles the lamp, with optional brightness and kelvin for turning on. You are warned if an HA automation uses the same switch.',
      'New service: lemur_home_dashboard.control (on / off / toggle with backup).'] },
  { v: '0.12.4',
    tr: ['Yatay tutulan telefonda ve dikey tutulan tablette pano telefon düzenine geçer (yazılar artık küçülmüyor, karolar uzamıyor); karo sayısı ekran genişliğine göre artar.',
      'Telefonda medya satırları kutudan taşmıyor; yönetim paneli ve ayarlar dar ekrana sığıyor; ışık penceresinde beyaz ton düğmeleri dar telefonda iki satır.',
      'Daha hızlı: pano dosyası sıkıştırılmış gelir (~580 KB yerine ~170 KB), ışık penceresi yalnız kendi ışıkları değişince yeniden çizilir.'],
    en: ['A phone held sideways and a tablet held upright now get the phone layout (no more tiny text or stretched tiles); the number of tiles grows with the screen width.',
      'Media rows no longer overflow on phones; the admin panel and settings fit narrow screens; the light window\'s white-tone buttons wrap to two rows on small phones.',
      'Faster: the dashboard file is served compressed (~170 KB instead of ~580 KB) and the light window only redraws when its own lights change.'] },
  { v: '0.12.3',
    tr: ['Işık düğmeleri anında tepki verir: dokununca cihazın cevabı beklenmez. Açarken düğme ışığın son renginde yanar; gerçek durum gelince gerekirse düzelir, 5 sn içinde cevap gelmezse eski haline döner.'],
    en: ['Light buttons react instantly: no waiting for the device. Turning on lights the button in the light\'s last colour; it is corrected when the real state arrives and goes back if there is no reply within 5 s.'] },
  { v: '0.12.2',
    tr: ['Ayarlar: "Sürüm ve güncelleme" en üstte; güncellemeler tek dokunuşla denetlenir.'],
    en: ['Settings: "Version and updates" is now at the top; check for updates with one tap.'] },
  { v: '0.12.1',
    tr: ['Güvenlik düzeltmeleri: pencere içeriği, bağlantılar, yedekten geri yükleme ve simge dosyaları denetleniyor.',
      'Besleme: bir dakika içinde ikinci "Besledim" sayılmaz, otomatik yemlik iki kez çalışmaz. Yemlik servisi izinli alanlardan biri olmalı (button, switch, script...).',
      'Yönetici olmayan kullanıcılar (duvar tableti) yemlik servisini ve bildirim hedefini görmez.'],
    en: ['Security fixes: popup content, links, backup restore and icon files are checked.',
      'Feeding: a second "Fed" within a minute is not counted and the automatic feeder does not run twice. The feeder service must be in an allowed domain (button, switch, script...).',
      'Non-admin users (the wall tablet) do not see the feeder service or the notification target.'] },
  { v: '0.12.0',
    tr: ['İkinci satır: durum, son değişim, öznitelik ya da yazı; değer karosunda ad üstte, değer altta seçeneği.',
      'Ad ve ikinci satırda Home Assistant şablonu ({{ }} / {% %}); değer değişince yazı kendiliğinden güncellenir.',
      'Dokununca onay iste: "Evi Kapa çalıştırılsın mı?"',
      'Kart seçici: Halo kartları, Home Assistant kartları ve kurulu özel kartlar listeden; görsel düzenleyici ve canlı önizleme.'],
    en: ['Second line: state, last changed, an attribute or text; a value tile can put the name on top and the value below.',
      'Home Assistant templates ({{ }} / {% %}) in the name and second line; the text updates by itself.',
      'Ask before running: "Run Close the house?"',
      'Card picker: Halo cards, Home Assistant cards and installed custom cards from a list; visual editor and live preview.'] },
  { v: '0.11.0',
    tr: ['Yönetim panelinde Basit ve Gelişmiş mod: Basit modda yalnız temel ayarlar görünür; gelişmiş ayarlar silinmez, çalışmaya devam eder. Üst çubuktan değiştirilir, bu tarayıcıda hatırlanır.',
      'Karmaşık ayarların yanında ? yardım: ne işe yaradığı, nasıl ayarlandığı ve bir örnek.',
      'Basit modda gelişmiş ayarı olan öğe "gelişmiş" işaretiyle görünür.'],
    en: ['Simple and Advanced mode in the admin panel: simple mode shows only the basics; advanced settings are kept and keep working. Switch it in the top bar; it is remembered in this browser.',
      'A ? help next to complex settings: what it does, how to set it up and an example.',
      'In simple mode, items with advanced settings carry an "advanced" mark.'] },
  { v: '0.10.0',
    tr: ['Besleme kartı: kedi, köpek, balık... için besleme hatırlatıcısı. Zamanında yeşil, yaklaşınca sarı, zamanı gelince turuncu, gecikince kırmızı ve yanıp söner.',
      'Karta dokun: "Besledim" (10 sn içinde yeniden dokununca geri alınır). Basılı tut: son beslemeler.',
      'Her N saatte bir ya da günün belli saatlerinde; gecikince telefona bildirim, istersen otomatik yemlik.',
      'Home Assistant\'ta her hayvan için besleme durumu ve "besledim" düğmesi oluşur; otomasyonlarda kullanılabilir.',
      'Bölüm ayarı Aralık; kutuyu doldururken öğeler artık birbirine yapışmaz.',
      'Halo görünümünde ve kart öğelerinde yükseklik, simge ve yazı boyutu; Halo öğenin simgesini kullanır.',
      'Sabit renk ve duruma göre renk (metin değerler de); bölüm içinde alt başlık; satır boyu karoda simge ve yazı yan yana.'],
    en: ['Feeding card: a feeding reminder for a cat, dog, fish... Green on time, yellow when due soon, orange when due, red and blinking when late.',
      'Tap the card: "Fed" (tap again within 10 s to undo). Hold: recent feedings.',
      'Every N hours or at set times of day; a phone notification when late, and an automatic feeder if you have one.',
      'Home Assistant gets a feeding status and a "fed" button for every pet, usable in automations.',
      'Section setting Spacing; items no longer touch when filling the box.',
      'Height, icon and text size for the Halo look and card items; the Halo look uses the item\'s icon.',
      'Fixed colour and colour by state (text values too); subtitles inside a section; a full-row tile puts icon and text side by side.'] },
  { v: '0.9.0',
    tr: ['Öğe ayarı Görünüm: düğme ışıkların yanında karo olabilir; değerler ve cihazlar ince satır ya da düğme, sayısal değerler Halo kartı olarak çizilebilir.',
      'Öğe renkleri: simge rengi, açıkken renk, arka plan tonu; sayısal değerde 4 sınır ve 5 renkle değere göre renk.',
      'Kart öğesine ve Halo görünümüne dokununca / basılı tutunca eylem: kartın kendi tıklaması yerine o çalışır.',
      'Kare karolu kutu da artık kesilmez, karoların boyuna kadar uzar.'],
    en: ['Item setting Look: a button can be a tile next to the lights; values and devices can be thin rows or buttons, numeric values a Halo card.',
      'Item colours: icon colour, colour when on, background tint; numeric values can be coloured by value with 4 limits and 5 colours.',
      'Tap / hold action on card items and the Halo look: it runs instead of the card\'s own tap.',
      'A box with square tiles is no longer cut off either; it grows to fit the tiles.'] },
  { v: '0.8.0',
    tr: ['Bölüme düğme eklenince kutu artık kesilmez: kutu içeriği kadar uzar, ekrana sığmayan sütun kendi içinde kayar.',
      'Bölüm ayarı Doldurma: "Kutuyu doldur" seçilince düğmeler ve karolar kutunun yüksekliğine eşit dağılır.',
      'Bölüm ayarı Hizalama: üst, orta ya da eşit dağıt.',
      'Öğe ayarı Boyut: karo 1×1, 2×1, 1×2, 2×2 ya da satır boyu.',
      'Öğe ayarı Simge boyutu ve Yazı boyutu: küçük, orta, büyük.'],
    en: ['A section no longer cuts off buttons: the box grows with its content and a column that doesn\'t fit the screen scrolls by itself.',
      'Section setting Fill: with "Fill the box", buttons and tiles share the box height evenly.',
      'Section setting Alignment: top, middle or spread evenly.',
      'Item setting Size: a tile can be 1×1, 2×1, 1×2, 2×2 or a full row.',
      'Item settings Icon size and Text size: small, medium, large.'] },
  { v: '0.7.0',
    tr: ['Değer karosu: sensör, zamanlayıcı, sayaç ve seçimler simge, değer + birim ve adıyla görünür; çalışan zamanlayıcı geri sayar.',
      'Öğe ayarları (⚙): ad, simge, açık/kapalı simgesi, dokununca ve basılı tutunca ne olacağı.',
      'Sadece şu durumda göster: öğe, seçilen varlığın durumuna göre görünür ya da hiç çizilmez.',
      'Kart (YAML): bölüme Home Assistant kartı eklenir; düğme bir kartı panonun kendi penceresinde açabilir.',
      'Sette olmayan simgeler artık Home Assistant\'ın düz simgesiyle çizilir.'],
    en: ['Value tile: sensors, timers, counters and selects show their icon, value + unit and name; a running timer counts down.',
      'Item settings (⚙): name, icon, on/off icons, what happens on tap and on hold.',
      'Only show when: an item shows or is not drawn at all depending on an entity\'s state.',
      'Card (YAML): add a Home Assistant card to a section; a button can open a card in the dashboard\'s own window.',
      'Icons not in the set are now drawn with Home Assistant\'s flat icon.'] },
  { v: '0.6.0',
    tr: ['Efekt simgeleri artık panonun kendi kopyasından gelir: Light Effect Card kurulu olmasa da sekmelerde ve öğelerde kullanılabilir.',
      'Ayarlar → Sürüm ve güncelleme: güncellemeyi denetle, HACS ile indir ve Home Assistant\'ı yeniden başlat, hepsi buradan.',
      'Güncellemeden sonra eski panonun açılması sorunu giderildi.',
      'Güncellemeden sonra bu "Yenilikler" penceresi bir kez çıkar; sonra Ayarlar → Sürüm\'den yeniden açılır.',
      'Ayarlar → Yardım → Sorun bildir: sürüm ve cihaz bilgisiyle hazır bir GitHub kaydı açar; kişisel bilgi eklenmez.',
      'Ayarlar → Yedek: bütün pano düzeni tek dosya olarak indirilir ve dosyadan geri yüklenir.'],
    en: ['Effect icons now come from the dashboard\'s own copy: usable on tabs and items even without Light Effect Card.',
      'Settings → Version and updates: check for updates, download with HACS and restart Home Assistant, all from here.',
      'Fixed the old dashboard opening after an update.',
      'After an update this "What\'s new" window shows once; reopen it from Settings → Version.',
      'Settings → Help → Report a problem: opens a GitHub issue with the version and device details; nothing personal is added.',
      'Settings → Backup: download the whole dashboard layout as one file and restore it from a file.'] },
  { v: '0.5.0',
    tr: ['Simge stiline Tek renk eklendi: kapalılar gri, açıklar seçtiğin renkte; istersen ışık lambanın kendi renginde.'],
    en: ['Single colour icon style: devices that are off are grey, those that are on take the colour you pick; optionally a light shows its own colour.'] },
  { v: '0.4.0',
    tr: ['Panodaki bütün simgeler kendi setinden çizilir; simge stili Otomatik, Renkli ya da Düz.',
      'Ayarlarda bir şey değiştirince pencere artık başa atlamıyor; "Yan menüyü gizle" boş şerit bırakmıyor.'],
    en: ['Every icon on the dashboard is drawn from its own set; icon style Automatic, Colourful or Flat.',
      'Changing a setting no longer jumps the window to the top; "Hide sidebar" no longer leaves an empty strip.'] },
  { v: '0.3.0',
    tr: ['Renkli simge seti 1305 simgeye çıktı: oda, ışık, perde, TV, bilgisayar, iklim, güvenlik ve daha fazlası.'],
    en: ['The colourful icon set grew to 1305 icons: rooms, lights, curtains, TVs, computers, climate, security and more.'] },
  { v: '0.2.0',
    tr: ['Renkli simge stili ve simge seçicide renkli simgeler.'],
    en: ['Colourful icon style and colourful icons in the icon picker.'] },
];

// Güncellemeden sonra eski sürüm kalmasın: HA'nın service worker'ı sunduğu her sayfanın bir kopyasını saklar. Güncellemeden önce
// alınmış kopya eski dosyamızı (lemur-home-dashboard.js?v=ESKİ) ister ve tarayıcı onu da önbellekten verir; sonuç: yeni sürüm gelmez.
// Entegrasyonun sürümü bizimkinden farklıysa eski kopyaları ve eski dosyaları siler, sayfayı bir kez yeniler (Light Effect Card'daki yöntem).
function lhdHeal(want) {
  if (!window.caches) return Promise.resolve(0);
  let n = 0;
  return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.open(k).then((c) => c.keys().then((reqs) => Promise.all(reqs.map((r) => {
    const u = r.url;
    if (/\/lemur_home_dashboard\/lemur-home-dashboard\.js\?v=/.test(u)) { if (u.indexOf('v=' + want) < 0) { n++; return c.delete(r); } return null; }
    let path; try { path = new URL(u).pathname; } catch (e) { return null; }
    if (/\.[a-z0-9]{1,5}$/i.test(path)) return null;   // sadece sayfalar
    return c.match(r).then((res) => (res ? res.clone().text() : '')).then((txt) => {
      const m = txt.match(/lemur-home-dashboard\.js\?v=([0-9.]+)/);
      if (m && m[1] !== want) { n++; return c.delete(r); }
      return null;
    });
  }))))))).then(() => n).catch(() => n);
}
function lhdHealCheck(conn) {
  conn.sendMessagePromise({ type: 'lemur_home_dashboard/info' }).then((info) => {
    const want = info && info.version;
    if (!want || want === PANEL_VERSION) return;
    lhdHeal(want).then(() => {
      try { const f = 'lhd-heal-' + want; if (!sessionStorage.getItem(f)) { sessionStorage.setItem(f, '1'); location.reload(); } } catch (e) {}
    });
  }).catch(() => {});
}
// Ortak ayarlar: entegrasyondan okunur, değişince bütün açık ekranlara gelir.
const STORE = window.__LEMUR_HOME_DASHBOARD_STORE || (window.__LEMUR_HOME_DASHBOARD_STORE = {
  data: null, conn: null, subs: [], loading: null, pending: 0,
  load(hass) {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.conn = hass.connection;
    this.loading = this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/get' }).then((d) => {
      this.data = d;
      lhdHealCheck(this.conn);
      // kendi kaydımızın yankısı beklenirken gelen eski veri ekrandakini ezmesin
      this.conn.subscribeMessage((msg) => {
        if (msg && msg.__fb) {   // bir lamba yedek yoldan kontrol edildi (src: twins.py)
          if (!this.data) return;
          this.data = Object.assign({}, this.data, { fallback: Object.assign({}, this.data.fallback, msg.__fb) });
          const d = this.data; this.subs.forEach((f) => f(d)); return;
        }
        if (msg && msg.__feed) {   // yalnız bir hayvanın besleme kaydı değişti
          if (!this.data) return;
          this.data = Object.assign({}, this.data, { feed: Object.assign({}, this.data.feed, msg.__feed) });
          const d = this.data; this.subs.forEach((f) => f(d)); return;
        }
        if (this.pending) return; this.data = msg; this.subs.forEach((f) => f(msg));
      }, { type: 'lemur_home_dashboard/subscribe' });
      // bağlantı koparsa (HA yeniden başladı, tablet uyudu) dönüşte güncel ayarı al; o arada yapılan değişiklikler kaçmasın
      if (this.conn.addEventListener) this.conn.addEventListener('ready', () => {
        this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/get' }).then((n) => { if (n && !this.pending) { this.data = n; this.subs.forEach((f) => f(n)); } }).catch(() => {});
      });
      return d;
    }).catch((e) => { this.loading = null; throw e; });
    return this.loading;
  },
  set(key, value) {
    this.pending++;
    const done = () => { this.pending = Math.max(0, this.pending - 1); };
    return this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/set', key: key, value: value }).then((r) => { done(); return r; }, (e) => { done(); throw e; });
  },
  // Yaz/Kış: yönetici olmayan kullanıcı (evdeki tablet) da değiştirebilir. Ekran beklemeden hemen değişir.
  season(value) {
    if (this.data) {
      this.data = Object.assign({}, this.data, { settings: Object.assign({}, this.data.settings, { season: value }) });
      const d = this.data;
      this.subs.forEach((f) => f(d));
    }
    return this.conn ? this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/season', season: value }) : Promise.resolve();
  },
  // Besleme kartı: "Besledim" (ve geri al). Her kullanıcı yapabilir; sonuç abonelikle bütün ekranlara gelir.
  feed(pet, undo) { return this.conn ? this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/feed', pet: pet, undo: !!undo }).catch(() => null) : Promise.resolve(); },   // bir dakikadan kısa sürede ikinci besleme sayılmaz (too_soon)
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});

// Simge seti: panonun bütün simgeleri bu setten çizilir (Home Assistant simgeleri kullanılmaz). Anahtarlar "mdi:ad" (MDI adı)
// ve "lhd:ad" (panoya özel). Entegrasyon ayrı bir dosya olarak sunar (/lemur_home_dashboard/mdi-color.json, ad → SVG);
// ilk gereken yerde bir kez yüklenir, tarayıcı önbellekte tutar. Yüklenene kadar simgenin yeri boş kalır.
// Simge stili (ayar icon_style): Otomatik (varsayılan; kapalı cihaz ve seçili olmayan oda düz/gri, açık olan renkli),
// Renkli (her zaman renkli), Düz (her zaman gri), Tek renk (çizimler tek tona çevrilir: kapalı gri, açık seçilen renkte).
// Griler ve tonlar CSS ile yapılır (base.css: .ic-auto / .ic-mono / .ic-tint).
const LP_MDIC_URL = '/lemur_home_dashboard/mdi-color.json';
const LP_MDIC = window.__LEMUR_HD_MDIC || (window.__LEMUR_HD_MDIC = { map: null, loading: null, subs: [], near: {} });
const lpIsLhdIcon = (i) => typeof i === 'string' && i.indexOf('lhd:') === 0;
const LP_MDIC_FALLBACK = 'mdi:circle-medium';
// eski panolarda geçip sette birebir olmayanlar: en yakın simge
const LP_MDIC_ALIAS = {
  'mdi:bed-king-outline': 'mdi:bed-king', 'mdi:table-chair': 'lhd:room-dining', 'mdi:flower-outline': 'mdi:flower',
  'mdi:home-variant-outline': 'mdi:home-outline', 'mdi:palette-outline': 'mdi:palette', 'mdi:play-circle-outline': 'mdi:play',
  'mdi:television-classic': 'mdi:television', 'mdi:lightbulb-variant': 'mdi:lightbulb', 'mdi:lightbulb-variant-outline': 'mdi:lightbulb-outline',
  'mdi:led-strip': 'mdi:led-strip-variant', 'mdi:thermometer-auto': 'mdi:thermometer', 'mdi:power-socket': 'mdi:power-socket-eu',
  'mdi:office-building-minus-outline': 'mdi:balcony', 'mdi:door': 'mdi:door-closed', 'mdi:bed-outline': 'mdi:bed', 'mdi:desk': 'lhd:desk-monitor'
};
// simge stili: 'auto' | 'full' | 'mono' | 'tint' (eski 'color' değeri Otomatik sayılır)
function lpIconMode() { const s = (STORE.data && STORE.data.settings) || {}; return s.icon_style === 'full' || s.icon_style === 'mono' || s.icon_style === 'tint' ? s.icon_style : 'auto'; }
// Tek renk stili: açık cihazın rengi (ayar icon_tint) ve ışıkta ışığın kendi rengi (icon_tint_light, varsayılan açık)
const LP_TINT_DEFAULT = '#FFC24A';
function lpIconTint() { const s = (STORE.data && STORE.data.settings) || {}; return /^#[0-9a-fA-F]{6}$/.test(s.icon_tint || '') ? s.icon_tint : LP_TINT_DEFAULT; }
function lpIconTintLight() { const s = (STORE.data && STORE.data.settings) || {}; return s.icon_tint_light !== false; }
// çizimin tek renk hali: gradyanlar ve renkler kaldırılır, hepsi currentColor (rengi CSS verir); beyaz ayrıntılar
// (dolu rozet üstündeki tik gibi) koyu zemin rengiyle oyulur. Simge başına bir kez hesaplanır.
function lpMono(k) {
  const C = LP_MDIC.mono || (LP_MDIC.mono = {});
  if (C[k] !== undefined) return C[k];
  const svg = (LP_MDIC.map && LP_MDIC.map[k]) || '';
  return (C[k] = svg.replace(/<defs>[\s\S]*?<\/defs>/g, '')
    .replace(/(stroke|fill)="#[Ff]{6}"/g, '$1="#10141c"')
    .replace(/(stroke|fill)="(url\(#[^)]+\)|#[0-9A-Fa-f]{6})"/g, '$1="currentColor"'));
}
// stile göre simgenin çizimi (Tek renkte tek renk hali)
function lpMdicGet(k) { return lpIconMode() === 'tint' ? lpMono(k) : (LP_MDIC.map[k] || ''); }
function lpMdicOn() { return true; }
function lpMdicLoad() {
  if (LP_MDIC.map) return Promise.resolve(LP_MDIC.map);
  if (!LP_MDIC.loading) {
    LP_MDIC.loading = fetch(LP_MDIC_URL + '?v=' + PANEL_VERSION).then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((m) => {
      LP_MDIC.map = lhdSafeIcons(m, /^(mdi|lhd):[a-z0-9-]+$/);   // yalnız temiz SVG'ler (src/safe.js)
      LP_MDIC.subs.slice().forEach((f) => { try { f(); } catch (e) {} });
      return LP_MDIC.map;
    });
  }
  return LP_MDIC.loading;
}
function lpMdicSub(f) { LP_MDIC.subs.push(f); return () => { LP_MDIC.subs = LP_MDIC.subs.filter((x) => x !== f); }; }
// sette olmayan bir MDI adına en yakın simge: aynı kelimeyle başlayan ve en çok kelimesi ortak olan (yoksa null)
const LP_MDIC_WEAK = { outline: 1, variant: 1, box: 1, circle: 1, multiple: 1, alt: 1, thick: 1, thin: 1, sharp: 1, rounded: 1 };
function lpMdicNear(name) {
  const M = LP_MDIC.map, N = LP_MDIC.near;
  if (N[name] !== undefined) return N[name];
  const w = name.slice(4).split('-'), off = w[w.length - 1] === 'off', want = w.filter((x) => !LP_MDIC_WEAK[x] && x !== 'off');
  let best = null, bs = 0;
  if (want.length) {
    Object.keys(M).forEach((k) => {
      const kw = k.slice(4).split('-');
      if (kw[0] !== want[0]) return;
      let sc = 3;
      for (let i = 1; i < want.length; i++) if (kw.indexOf(want[i]) >= 0) sc += 2;
      if ((kw[kw.length - 1] === 'off') === off) sc += 1;
      sc -= Math.abs(kw.length - w.length) * 0.3;
      if (k.indexOf('mdi:') === 0) sc += 0.1;
      if (sc > bs) { bs = sc; best = k; }
    });
  }
  N[name] = best;
  return best;
}
// simgenin setteki anahtarı: kendisi, eşleme, -outline'sız hali, en yakını (set yüklenmediyse ya da bulunamazsa null)
function lpMdicKey(icon) {
  const M = LP_MDIC.map;
  if (!M || typeof icon !== 'string') return null;
  if (M[icon]) return icon;
  if (lpIsLhdIcon(icon)) return null;
  if (icon.indexOf('mdi:') !== 0) return null;
  let k = LP_MDIC_ALIAS[icon] || icon;
  if (M[k]) return k;
  if (/-outline$/.test(k)) { k = k.slice(0, -8); if (M[k]) return k; }
  return lpMdicNear(icon);
}
// açıkça verilen simge için katı arama: kendisi, eşleme ya da -outline'sız hali (en yakın benzer aranmaz). Yoksa null:
// o zaman simge HA'nın düz simgesi olarak çizilir (ha-icon), başka bir simgeye ya da noktaya dönmez.
function lpMdicStrict(icon) {
  const M = LP_MDIC.map;
  if (!M || typeof icon !== 'string') return null;
  if (M[icon]) return icon;
  const a = LP_MDIC_ALIAS[icon];
  if (a && M[a]) return a;
  if (/^mdi:.+-outline$/.test(icon) && M[icon.slice(0, -8)]) return icon.slice(0, -8);
  return null;
}
// sette karşılığı olmayan simge HA'nın kendi çizimiyle gösterilsin mi (mdi:, hass: ya da başka bir simge paketi; lhd:/lec: hariç)
const lpIconFlat = (icon) => typeof icon === 'string' && /^[a-z][a-z0-9_-]*:[a-z0-9-]+$/.test(icon) && !lpIsLhdIcon(icon) && icon.indexOf('lec:') !== 0 && !!LP_MDIC.map && !lpMdicStrict(icon);
// simgenin SVG'si (bulunamazsa yedek simge); set henüz yüklenmediyse yüklemeyi başlatır ve null döner
function lpMdicSvg(icon) {
  if (!LP_MDIC.map) { lpMdicLoad(); return null; }
  const k = lpMdicKey(icon);
  return lpMdicGet(k || LP_MDIC_FALLBACK);
}
// bir varlığın simgesi: öğeye verilen, HA'daki kendi simgesi, yoksa durumuna göre varsayılan
function lpEntIcon(st, own) {
  if (own) return own;
  const k = st && st.attributes && st.attributes.icon ? lpMdicKey(st.attributes.icon) : null;
  if (k) return k;   // HA'daki simgenin setteki karşılığı (yakını olabilir)
  return lpStateIconName(st) || (st && st.attributes && st.attributes.icon) || LP_MDIC_FALLBACK;
}
// kendi simgesi olmayan varlığın varsayılan simgesi (HA'nın seçtiğine yakın), hepsi sette var. Bilinmeyende null
const LP_MDIC_COVER = { garage: ['garage', 'garage-open'], gate: ['gate', 'gate-open'], door: ['door-closed', 'door-open'], window: ['window-closed', 'window-open'], shutter: ['window-shutter', 'window-shutter-open'], blind: ['blinds-horizontal-closed', 'blinds-horizontal'], curtain: ['curtains-closed', 'curtains'], shade: ['roller-shade-closed', 'roller-shade'] };
const LP_MDIC_BIN = {
  door: ['door-closed', 'door-open'], garage_door: ['garage', 'garage-open'], window: ['window-closed', 'window-open'], opening: ['square-outline', 'square'],
  motion: ['motion-sensor-off', 'motion-sensor'], occupancy: ['home-outline', 'home'], presence: ['home-outline', 'home'], smoke: ['smoke-detector', 'smoke-detector-alert'],
  moisture: ['water-off', 'water'], plug: ['power-plug-off', 'power-plug'], power: ['power-plug-off', 'power-plug'], battery: ['battery', 'battery-alert'],
  battery_charging: ['battery', 'battery-charging'], lock: ['lock', 'lock-open-variant'], sound: ['music-note-off', 'music-note'], vibration: ['crop-portrait', 'vibrate'],
  connectivity: ['close-network-outline', 'check-network-outline'], problem: ['check-circle', 'alert-circle'], safety: ['check-circle', 'alert-circle'],
  heat: ['thermometer', 'fire'], cold: ['thermometer', 'snowflake'], light: ['brightness-5', 'brightness-7'], running: ['stop', 'play']
};
const LP_MDIC_SENSOR = {
  temperature: 'thermometer', humidity: 'water-percent', moisture: 'water-percent', power: 'flash', energy: 'lightning-bolt', carbon_dioxide: 'molecule-co2',
  carbon_monoxide: 'molecule-co', illuminance: 'brightness-5', pressure: 'gauge', atmospheric_pressure: 'gauge', voltage: 'sine-wave', current: 'current-ac',
  gas: 'meter-gas', pm25: 'molecule', pm10: 'molecule', pm1: 'molecule', timestamp: 'clock', weight: 'weight', speed: 'speedometer', wind_speed: 'weather-windy',
  precipitation: 'weather-rainy', precipitation_intensity: 'weather-pouring', signal_strength: 'wifi', ph: 'ph', water: 'water', volume: 'storage-tank', duration: 'progress-clock'
};
const LP_MDIC_WEATHER = {
  'clear-night': 'weather-night', cloudy: 'weather-cloudy', fog: 'weather-fog', hail: 'weather-hail', lightning: 'weather-lightning', 'lightning-rainy': 'weather-lightning-rainy',
  partlycloudy: 'weather-partly-cloudy', pouring: 'weather-pouring', rainy: 'weather-rainy', snowy: 'weather-snowy', 'snowy-rainy': 'weather-snowy-rainy',
  sunny: 'weather-sunny', windy: 'weather-windy', 'windy-variant': 'weather-windy-variant'
};
function lpStateIconName(st) {
  if (!st || !st.entity_id) return null;
  const d = st.entity_id.split('.')[0], s = st.state, a = st.attributes || {}, dc = a.device_class;
  const open = s === 'open' || s === 'opening', on = s === 'on';
  const m = (n) => 'mdi:' + n;
  switch (d) {
    case 'light': return m('lightbulb');
    case 'switch': return dc === 'outlet' ? m(on ? 'power-plug' : 'power-plug-off') : m(on ? 'toggle-switch-variant' : 'toggle-switch-variant-off');
    case 'input_boolean': return m(on ? 'toggle-switch-variant' : 'toggle-switch-variant-off');
    case 'fan': return m('fan');
    case 'climate': return m('thermostat');
    case 'vacuum': return m('robot-vacuum');
    case 'lawn_mower': return m('robot-mower');
    case 'humidifier': return m(on ? 'air-humidifier' : 'air-humidifier-off');
    case 'water_heater': return m(s === 'off' ? 'water-boiler-off' : 'water-boiler');
    case 'lock': return m(s === 'unlocked' || s === 'open' || s === 'opening' ? 'lock-open-variant' : s === 'jammed' ? 'lock-alert' : 'lock');
    case 'media_player':
      if (dc === 'tv') return m(s === 'off' ? 'television-off' : 'television');
      if (dc === 'speaker' || dc === 'receiver') return m(s === 'off' ? 'speaker-off' : 'speaker');
      return m(s === 'off' ? 'cast-off' : 'cast');
    case 'cover': { const c = LP_MDIC_COVER[dc] || LP_MDIC_COVER.shutter; return m(c[open ? 1 : 0]); }
    case 'valve': return m(open ? 'valve-open' : 'valve-closed');
    case 'scene': return m('palette');
    case 'script': return m('script-text-play');
    case 'automation': return m('robot');
    case 'camera': return m('video');
    case 'siren': return m('bullhorn');
    case 'button': case 'input_button': return m('gesture-tap-button');
    case 'person': return m('account');
    case 'alarm_control_panel':
      return m(s === 'disarmed' ? 'shield-off' : s === 'armed_home' ? 'shield-home' : s === 'armed_night' ? 'shield-moon' : s === 'armed_vacation' ? 'shield-airplane' : s === 'triggered' ? 'bell-ring' : 'shield-lock');
    case 'binary_sensor': { const b = LP_MDIC_BIN[dc]; return b ? m(b[on ? 1 : 0]) : m(on ? 'checkbox-marked-circle' : 'radiobox-blank'); }
    case 'sensor': {
      if (dc === 'battery') { const v = parseFloat(s); if (isNaN(v)) return m('battery-unknown'); const n = Math.floor(v / 10) * 10; return m(n >= 100 ? 'battery' : n < 10 ? 'battery-outline' : 'battery-' + n); }
      return LP_MDIC_SENSOR[dc] ? m(LP_MDIC_SENSOR[dc]) : m('gauge');
    }
    case 'weather': return LP_MDIC_WEATHER[s] ? m(LP_MDIC_WEATHER[s]) : m('weather-partly-cloudy');
    case 'number': case 'input_number': return m('ray-vertex');
    case 'select': case 'input_select': return m('format-list-bulleted');
    case 'text': case 'input_text': return m('form-textbox');
    case 'counter': return m('counter');
    case 'timer': return m('timer-outline');
    case 'update': return m('update');
    case 'device_tracker': case 'zone': return m('map-marker');
    case 'sun': return m(s === 'below_horizon' ? 'weather-night' : 'weather-sunny');
    case 'remote': return m('remote');
    case 'event': return m('bell-ring');
    case 'image': return m('image');
    case 'calendar': return m('calendar');
    case 'todo': return m('clipboard-list');
    case 'notify': return m('message');
  }
  return null;
}

// Lemur Light Effect Card (LEC) ile birlikte çalışma. LEC pakete girmez, ayrı kurulur; kuruluysa pano:
// - senaryolarda "Efekt ekranı" düğmesi: LEC'in tam ekran efekt ekranını sekmenin odasıyla açar,
// - efekt düğmeleri: seçilen efekti o odada başlatır / durdurur (LEC servisleri play, stop),
// - oynayan efekti gösterir: o odanın karoları efektin paletiyle parlar, efektin düğmesi yanar,
// - isteğe bağlı: ışık karosuna basılı tutunca HA'nın penceresi yerine LEC ekranı açılır (ayar: lec_hold).
// LEC'in odaları HA alan kimlikleriyle tutulur (oturma_odasi...), panodaki sekmelerin alanı da aynı; eşleme kendiliğinden.
const LP_LEC_DOMAIN = 'lemur_light_effects';
const LEC = window.__LEMUR_HD_LEC || (window.__LEMUR_HD_LEC = {
  rooms: null,        // { alan: [ışık, ...] } (LEC'in oda listesi)
  favorites: [], recent: {},
  effects: {},        // oda → efekt adları (LEC list_effects)
  names: {},          // oda → odanın adı
  playing: {},        // oda → şu an oynayan efekt (yoksa null)
  version: null, subs: [], loading: null, pend: {}, timers: {},
  installed(h) { return !!(h && h.config && (h.config.components || []).indexOf(LP_LEC_DOMAIN) >= 0); },
  load(h) {
    if (!this.installed(h)) return Promise.resolve(null);
    if (this.rooms) return Promise.resolve(this);
    if (this.loading) return this.loading;
    const conn = h.connection;
    this.loading = conn.sendMessagePromise({ type: LP_LEC_DOMAIN + '/get' }).then((d) => {
      this._put(d || {});
      // LEC'in ayarı değişince (oda listesi, favoriler) canlı gelsin
      conn.subscribeMessage((m) => { this._put(m || {}); this._emit('rooms'); }, { type: LP_LEC_DOMAIN + '/subscribe' }).catch(() => {});
      conn.sendMessagePromise({ type: LP_LEC_DOMAIN + '/info' }).then((r) => { this.version = (r && r.version) || null; this._emit('info'); }).catch(() => {});
      this._emit('rooms');
      return this;
    }).catch(() => { this.loading = null; return null; });
    return this.loading;
  },
  _put(d) {
    if (d.rooms) this.rooms = d.rooms;
    if (d.favorites) this.favorites = d.favorites;
    if (d.recent) this.recent = d.recent;
    if (!this.rooms) this.rooms = {};
  },
  hasRoom(room) { return !!(room && this.rooms && this.rooms[room]); },
  roomOf(id) { const r = this.rooms || {}; for (const k in r) if ((r[k] || []).indexOf(id) >= 0) return k; return null; },
  lightsOf(room) { return (this.rooms && this.rooms[room]) || []; },
  // odanın efekt listesi ve şu an oynayan efekt: LEC'in cevap veren servisi (yönetici olmayan kullanıcı da çağırabilir)
  query(h, room) {
    if (!room) return Promise.resolve(null);
    if (this.pend[room]) return this.pend[room];
    this.pend[room] = h.connection.sendMessagePromise({ type: 'call_service', domain: LP_LEC_DOMAIN, service: 'list_effects', service_data: { room: room }, return_response: true })
      .then((r) => {
        const x = (r && r.response) || {};
        const first = !this.effects[room];
        this.effects[room] = x.effects || [];
        this.names[room] = x.name || room;
        const p = x.playing || null, ch = this.playing[room] !== p;
        this.playing[room] = p;
        if (ch) this._emit('playing');
        if (first) this._emit('effects');   // yönetim panelindeki seçici efekt listesini göstersin
        return x;
      }).catch(() => null).then((x) => { delete this.pend[room]; return x; });
    return this.pend[room];
  },
  // odanın ışıkları değişince oynayan efekti yeniden sor; art arda gelen değişiklikler birleşir
  watch(h, room) {
    clearTimeout(this.timers[room]);
    this.timers[room] = setTimeout(() => this.query(h, room), 1200);
  },
  isPlaying(room, effect) {
    const p = this.playing[room];
    return !!(p && effect && String(p).toLowerCase() === String(effect).toLowerCase());
  },
  // LEC'in tam ekran efekt ekranı (LEC'in kendi düğmesi gizli olarak kullanılır; oda verilirse o oda seçili açılır)
  open(h, room) {
    let el = null;
    try { el = document.createElement('lemur-fullscreen-button'); } catch (e) { el = null; }
    if (!el || typeof el.open !== 'function') return false;
    el.setConfig(this.hasRoom(room) ? { room: room } : {});
    el.hass = h;
    el.open(false);
    return true;
  },
  run(h, action) {
    const sv = String(action.service || '').split('.')[1];
    return h.callService(LP_LEC_DOMAIN, sv, action.data || {});
  },
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; },
  _emit(kind) { this.subs.forEach((f) => { try { f(kind); } catch (e) {} }); }
});
// senaryo öğesi LEC'e mi ait: 'open' (efekt ekranı), 'play' (efekt), 'stop' (durdur)
function lpLecKind(it) {
  const s = it && it.action && it.action.service;
  if (!s || s.indexOf(LP_LEC_DOMAIN + '.') !== 0) return null;
  return s.split('.')[1];
}

// Light Effect Card'ın renkli efekt simgeleri: panoda simge adı "lec:aurora" biçiminde yazılır.
// Panonun kendi kopyasından gelir (/lemur_home_dashboard/lec-icons.json, ad → SVG; kaynağı ../lemur-icons/efektler.json),
// Light Effect Card kurulu olmasa da görünür. İlk gereken yerde bir kez yüklenir.
// Yüklenince abone olan kart ve panel yeniden çizilir. LEC kaldırılırsa bu simgelerin yerinde boşluk kalır.
const LP_LECI = window.__LEMUR_HD_LECI || (window.__LEMUR_HD_LECI = { map: null, loading: null, subs: [] });
function lpLecIcons() {
  if (LP_LECI.map) return Promise.resolve(LP_LECI.map);
  if (!LP_LECI.loading) {
    LP_LECI.loading = fetch('/lemur_home_dashboard/lec-icons.json?v=' + PANEL_VERSION).then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((m) => {
      LP_LECI.map = lhdSafeIcons(m, /^[a-z0-9_-]{1,60}$/);   // yalnız temiz SVG'ler (src/safe.js)
      LP_LECI.subs.slice().forEach((f) => { try { f(); } catch (e) {} });
      return LP_LECI.map;
    });
  }
  return LP_LECI.loading;
}
function lpLecIconsSub(f) { LP_LECI.subs.push(f); return () => { LP_LECI.subs = LP_LECI.subs.filter((x) => x !== f); }; }
const lpIsLecIcon = (i) => typeof i === 'string' && i.indexOf('lec:') === 0;
// simge HTML'i: "lec:..." ise LEC'in renkli SVG'si, değilse panonun simge setinden (src/mdic.js). cls ve style isteğe bağlı.
// Set yüklenene kadar boş yer tutucu döner; yüklenince abone olan kart ve panel yeniden çizer.
function lpIcon(icon, cls, style) {
  const open = '<span class="lic' + (cls ? ' ' + cls : '');
  const tail = '"' + (style ? ' style="' + style + '"' : '') + '>';
  if (lpIsLecIcon(icon)) {
    if (!LP_LECI.map) lpLecIcons();
    const svg = LP_LECI.map && LP_LECI.map[icon.slice(4)];
    return open + tail + (svg || '') + '</span>';
  }
  if (lpIconFlat(icon)) return open + ' haic' + tail + '<ha-icon icon="' + esc(icon) + '"></ha-icon></span>';   // sette yok: HA'nın düz simgesi
  return open + ' mdic' + tail + (lpMdicSvg(icon || LP_MDIC_FALLBACK) || '') + '</span>';
}

// Ayar yokken evden varsayılan düzen üretir: ilk kurulumda tek satırla dolu bir pano gelsin diye.
// Kurallar:
// - İlk sekme "Ev": bütün evin özeti, odalardan sırayla (en fazla 20 ışık, 6 senaryo, 6 iklim cihazı, süpürgeler, 2 medya).
// - İklim cihazına aynı alandaki sıcaklık/nem sensörü eşlenir (cihazın kendi sensörü değilse); kart konforu ondan hesaplar.
// - Her alan bir sekme (kat sırasına göre, sonra HA'daki alan sırası). Klima/medya yoksa ve 3'ten az ışık varsa küçük oda sayılır,
//   ayrı sekme açılmaz (koridor, banyo gibi yerler üst şeridi kalabalıklaştırmasın).
// - Küçük odaların ve alana atanmamış cihazların hepsi sondaki "Diğer" sekmesinde (en az bir oda sekmesi açıldıysa).
// - Küçük ışık grubunun üyeleri ayrıca gösterilmez; odanın tamamını kapsayan büyük grupta üyeler de görünür.
// - Şerit/lamba segmentleri, ışığı olan cihazın güç anahtarı ve tarayıcı eklentisi (browser_mod) varlıkları alınmaz.
// - Parametre isteyen betikler senaryo düğmesi olmaz.
// - Lemur Light Effect Card kuruluysa efekt ekranı üst şeritteki "Efektler" düğmesinden açılır (kart çizer, burada bir şey eklenmez).
// - En fazla 6 oda sekmesi; fazlası ve küçük odalar "Diğer"de (sekme sayısı 8'i geçmesin, oda kaybolmasın).
// - Anahtarlardan (switch) sadece priz ve aydınlatma gibi görünenler alınır; ayar anahtarları ve gizli varlıklar alınmaz.
// Eski Safari için ?. ve ?? yok.
const LP_SCENE_COLORS = ['#5B8DEF', '#8E7CFF', '#F5A623', '#4CD964', '#FF6B6B', '#2EC4B6', '#FFB86B', '#E879F9'];
const LP_AREA_ICONS = [
  [/salon|oturma|living|lounge/i, 'mdi:sofa-outline'],
  [/yatak|bedroom|\bbed/i, 'mdi:bed-king-outline'],
  [/çocuk|cocuk|kid|child|nursery|bebek/i, 'mdi:teddy-bear'],
  [/mutfak|kitchen/i, 'mdi:silverware-fork-knife'],
  [/banyo|bath|wc|tuvalet|toilet/i, 'mdi:shower'],
  [/ofis|çalışma|calisma|office|study|lemur/i, 'mdi:desk'],
  [/yemek|dining/i, 'mdi:table-chair'],
  [/koridor|hol|antre|giriş|giris|hall|entry/i, 'mdi:door-open'],
  [/bahçe|bahce|garden|yard|teras|terrace|balkon|balcony/i, 'mdi:flower-outline'],
  [/garaj|garage/i, 'mdi:garage'],
  [/çamaşır|camasir|laundry/i, 'mdi:washing-machine'],
  [/stüdyo|studyo|studio/i, 'mdi:home-variant-outline']
];

// --- Serbest bölümler ---
// Bir bölüme her türden öğe eklenebilir; her öğe kendi türüne göre çizilir (ışık karosu, senaryo düğmesi, iklim kartı...).
// Bölümün türü (lights, scenes, climate...) sadece başlangıç başlığı ve simgesi için.
// Öğe biçimleri: "light.x" ya da { entity, name, icon, ... } (cihaz), { name, icon, color, action } (düğme), { name, icon } (boş karo).
// Değer gösteren varlıklar (sensör, zamanlayıcı, sayaç, seçim...): kendi karosu var (simge, ad, değer + birim), dokununca cihaz penceresi.
const LHD_VALUE_DOMAINS = ['sensor', 'binary_sensor', 'timer', 'counter', 'input_number', 'input_select', 'input_text', 'input_datetime', 'number', 'select', 'text',
  'date', 'time', 'datetime', 'weather', 'sun', 'person', 'device_tracker', 'zone', 'update', 'event', 'calendar', 'todo', 'image'];
function lhdKind(it) {
  if (!it) return null;
  if (typeof it === 'string') it = { entity: it };
  if (it.card && typeof it.card === 'object') return 'card';   // gömülü HA kartı
  if (typeof it.pet === 'string') return 'pet';
  if (typeof it.subtitle === 'string') return 'sub';           // bölüm içinde alt başlık (yalnız yazı, tam satır)       // besleme kartı (evcil hayvan)
  if (!it.entity) return Object.prototype.hasOwnProperty.call(it, 'action') ? 'scene' : 'ph';
  const d = it.entity.split('.')[0];
  if (d === 'script' || d === 'scene' || d === 'automation' || d === 'button' || d === 'input_button') return 'scene';
  if (d === 'climate') return 'climate';
  if (d === 'vacuum') return 'vacuum';
  if (d === 'media_player') return 'media';
  if (LHD_VALUE_DOMAINS.indexOf(d) >= 0) return 'value';
  return 'tile';
}
// Koşullu görünürlük: öğenin visible alanı { entity, state | states: [...] | not: [...] }. Alan yoksa ya da eksikse öğe hep görünür.
// Koşul varlığı HA'da yoksa öğe gizli kalır (koşul sağlanamaz).
function lpVisible(v, S) {
  if (!v || typeof v !== 'object' || !v.entity) return true;
  const st = S && S[v.entity], s = st ? String(st.state) : null;
  if (s === null) return false;
  const list = (x) => (Array.isArray(x) ? x : [x]).map(String);
  const want = v.states !== undefined ? list(v.states) : (v.state !== undefined ? list(v.state) : null);
  if (want && want.indexOf(s) < 0) return false;
  const not = v.not !== undefined ? list(v.not) : null;
  if (not && not.indexOf(s) >= 0) return false;
  return true;
}
// Eski kayıtları yeni biçime getirir (v: 2): senaryo öğeleri `items`ten `entities`e geçer; aynı kolon/sütunda başlıksız bölüm,
// eskiden olduğu gibi önceki bölümün kutusuna girdiği için onunla birleşir (ekranda değişen bir şey olmaz, yönetim panelinde tek bölüm görünür).
function lhdNormTab(tab) {
  if (!tab || tab.v === 2) return tab;
  const out = [];
  (tab.sections || []).forEach((s0) => {
    const s = Object.assign({}, s0);
    s.entities = (s.entities || []).concat(s.items || []);
    delete s.items;
    let prev = null;
    for (let i = out.length - 1; i >= 0; i--) if ((out[i].col || 0) === (s.col || 0) && (out[i].sub || 0) === (s.sub || 0)) { prev = out[i]; break; }
    if (prev && !s.title) {
      prev.entities = prev.entities.concat(s.entities);
      Object.keys(s).forEach((k) => { if (prev[k] === undefined && k !== 'id' && k !== 'title') prev[k] = s[k]; });
      return;
    }
    out.push(s);
  });
  return Object.assign({}, tab, { v: 2, sections: out });
}
// Bölümdeki öğe türleri (yönetim panelindeki özet için): { tile: 7, scene: 2, ... }
function lhdKinds(s) {
  const c = {};
  ((s && s.entities) || []).forEach((it) => { const k = lhdKind(it); if (k) c[k === 'ph' ? 'tile' : k] = (c[k === 'ph' ? 'tile' : k] || 0) + 1; });
  return c;
}

function buildDefaultTabs(hass, lang) {
  const S = hass.states || {};
  const ents = hass.entities || {};   // varlık kaydı özeti (area_id, device_id, hidden, entity_category)
  const devs = hass.devices || {};
  const areas = hass.areas || {};
  const floors = hass.floors || {};
  const dom = (id) => id.split('.')[0];
  const attr = (id) => (S[id] && S[id].attributes) || {};
  const name = (id) => attr(id).friendly_name || id;

  const areaOf = (id) => {
    const e = ents[id]; if (!e) return null;
    if (e.area_id) return e.area_id;
    const d = e.device_id && devs[e.device_id];
    return d && d.area_id ? d.area_id : null;
  };
  const usable = (id) => {
    const e = ents[id];
    if (e && (e.hidden || e.hidden_by || e.entity_category || e.disabled_by)) return false;
    // tarayıcı/tablet eklentilerinin her ekran için açtığı "ışık" ve "oynatıcı"lar (browser_mod) ev cihazı değil
    if (e && e.platform === 'browser_mod') return false;
    // şu an ulaşılamayan cihaz otomatik düzene girmez (bozuk ya da kaldırılmış cihazlar panoyu doldurmasın)
    const st = S[id];
    return !(st && (st.state === 'unavailable' || st.state === 'unknown'));
  };
  const lightLikeSwitch = (id) => {
    const a = attr(id);
    if (a.device_class === 'outlet') return true;
    if (/^mdi:(lightbulb|lamp|ceiling-light|floor-lamp|desk-lamp|led-strip|string-lights|wall-sconce|outdoor-lamp|power-socket|power-plug)/.test(a.icon || '')) return true;
    // "Adaptive Lighting" gibi ayar anahtarları girmesin diye İngilizce kelimeler tam kelime olarak aranır
    const n = String(name(id));
    return /\b(lamp|lamps|light|lights|bulb|led|outlet|socket|plug)\b/i.test(n) || /lamba|ışık|ışığı|aydınlatma|avize|abajur|aplik|priz|şerit/i.test(n);
  };

  const scriptNeedsInput = (id) => {
    const sv = hass.services && hass.services.script && hass.services.script[id.split('.')[1]];
    return !!(sv && sv.fields && Object.keys(sv.fields).length);
  };

  // tüm varlıkları bir kez gez, türüne göre ayır
  const lights = [], controls = [], medias = [], scenes = [], vacuums = [];
  Object.keys(S).forEach((id) => {
    if (!usable(id)) return;
    const d = dom(id);
    if (d === 'light') lights.push(id);
    else if (d === 'switch' && lightLikeSwitch(id)) lights.push(id);
    else if (d === 'climate') controls.push(id);
    else if (d === 'media_player') medias.push(id);
    else if (d === 'scene') scenes.push(id);
    else if (d === 'script' && !scriptNeedsInput(id)) scenes.push(id);   // parametre isteyen yardımcı betikler düğme olamaz
    else if (d === 'vacuum') vacuums.push(id);
  });
  const devOf = (id) => (ents[id] && ents[id].device_id) || null;
  const climateItem = (id) => lpClimateItem(hass, id);

  // ışık grubu: üyeleri listeden çıkar
  const members = {};
  // Küçük grup (ör. 3 ampullük "Tavan") tek karo olur, üyeleri gizlenir. Büyük grup (odanın bütün ışıkları, ör. Hue oda grubu)
  // ve Hue oda/bölge grupları "hepsi" karosu olarak kalır ama üyeleri de ayrı ayrı görünür; yoksa odanın tek tek lambaları kaybolur.
  lights.forEach((id) => { const m = attr(id).entity_id; if (dom(id) === 'light' && Array.isArray(m) && m.length <= 4 && !attr(id).is_hue_group) m.forEach((x) => { if (x !== id) members[x] = true; }); });
  // Aynı cihazın parçaları ayrı karo olmasın: şerit/lamba "segment"leri ve ışığı olan cihazın güç anahtarı (ana ışık zaten var)
  const devHasLight = {};
  lights.forEach((id) => { const dv = devOf(id); if (dom(id) === 'light' && dv && !/_segment_?\d+$/.test(id)) devHasLight[dv] = true; });
  const part = (id) => {
    const dv = devOf(id);
    if (/_segment_?\d+$/.test(id)) return !dv || devHasLight[dv] || lights.some((x) => x !== id && id.indexOf(x.replace(/_govee$/, '') + '_segment') === 0);
    return dom(id) === 'switch' && !!dv && !!devHasLight[dv];
  };
  const lightList = lights.filter((id) => !members[id] && !part(id));
  // sıra: ışık grupları önce, sonra normal ışıklar, en sonda durum ledi gibi görünenler (…_leds, …_switch_state)
  const lightRank = (id) => (Array.isArray(attr(id).entity_id) ? 0 : /_(leds|switch_state|status|status_led|indicator)$/.test(id) ? 2 : 1);

  const byName = (a, b) => String(name(a)).localeCompare(String(name(b)), lang);
  const inArea = (list, aid) => list.filter((id) => areaOf(id) === aid).sort(byName);
  const lightsIn = (aid) => inArea(lightList, aid).sort((a, b) => (lightRank(a) - lightRank(b)) || byName(a, b));

  // alan sırası: kat seviyesi (yoksa en sona), sonra kayıt sırası
  const areaIds = Object.keys(areas);
  const levelOf = (aid) => { const f = floors[areas[aid].floor_id]; return f && typeof f.level === 'number' ? f.level : 9999; };
  const order = areaIds.map((aid, i) => ({ aid: aid, i: i })).sort((a, b) => (levelOf(a.aid) - levelOf(b.aid)) || (a.i - b.i)).map((x) => x.aid);
  const areaRank = {}; order.forEach((aid, i) => { areaRank[aid] = i; });
  const byArea = (a, b) => {
    const ra = areaRank[areaOf(a)], rb = areaRank[areaOf(b)];
    return ((ra === undefined ? 9999 : ra) - (rb === undefined ? 9999 : rb)) || byName(a, b);
  };

  let colorIdx = 0;
  const sceneItem = (id) => ({
    name: name(id),
    icon: attr(id).icon || (dom(id) === 'script' ? 'mdi:play-circle-outline' : 'mdi:palette-outline'),
    color: LP_SCENE_COLORS[(colorIdx++) % LP_SCENE_COLORS.length],
    action: { service: dom(id) + '.turn_on', target: id }
  });
  const globalScenes = scenes.filter((id) => !areaOf(id)).sort(byName);

  const tab = (o) => {
    colorIdx = 0;   // her sekmede renkler baştan: aynı sıradaki düğme aynı renkte
    // sağ kolon tek bölüm: iklim kartları, süpürgeler ve medya aynı kutuda
    const secs = [
      { id: o.id + '-l', type: 'lights', title: o.lightTitle, col: 0, entities: o.lights, tile_columns: 5 },
      { id: o.id + '-s', type: 'scenes', title: o.sceneTitle, col: 1, entities: o.scenes.map(sceneItem) },
      { id: o.id + '-c', type: 'climate', title: o.controlTitle, col: 2, entities: o.controls.map(climateItem).concat(o.vacuums || [], o.medias || []) }
    ];
    return { id: o.id, name: o.name, icon: o.icon, area: o.area || null, v: 2, columns: [56, 17, 25.5], sections: secs };
  };

  // Ev sekmesi bütün evin özeti: listeyi tek bir odanın cihazları doldurmasın, odalardan sırayla alınır
  const spread = (list, rank, max) => {
    const g = {}, keys = [];
    list.forEach((id) => { const a = areaOf(id) || ''; if (!g[a]) { g[a] = []; keys.push(a); } g[a].push(id); });
    keys.sort((a, b) => (areaRank[a] === undefined ? 9999 : areaRank[a]) - (areaRank[b] === undefined ? 9999 : areaRank[b]));
    keys.forEach((a) => g[a].sort((x, y) => ((rank ? rank(x) - rank(y) : 0)) || byName(x, y)));
    const out = [];
    for (let i = 0; out.length < max; i++) {
      let any = false;
      keys.forEach((a) => { if (out.length < max && g[a][i] !== undefined) { out.push(g[a][i]); any = true; } });
      if (!any) break;
    }
    return out;
  };

  const tabs = [];
  const usedIds = { home: true, other: true };
  tabs.push(tab({
    id: 'home', name: t(lang, 'home'), icon: 'mdi:home-outline',
    lights: spread(lightList.filter((id) => lightRank(id) < 2), lightRank, 20),
    scenes: (globalScenes.length ? globalScenes : scenes.slice().sort(byName)).slice(0, 6),
    controls: spread(controls, null, 6),
    vacuums: vacuums.slice().sort(byArea).slice(0, 3),
    medias: medias.slice().sort(byArea).slice(0, 2),
    lightTitle: t(lang, 'lights'), sceneTitle: t(lang, 'scenes'), controlTitle: t(lang, 'control')
  }));

  const small = {};
  order.forEach((aid) => {
    const L = lightsIn(aid), C = inArea(controls, aid), M = inArea(medias, aid), V = inArea(vacuums, aid);
    if (!C.length && !M.length && !V.length && L.length < 3) { small[aid] = true; return; }
    if (tabs.length >= 7) { small[aid] = true; return; }   // Ev + 6 oda dolu: kalan odalar "Diğer"e
    const sc = inArea(scenes, aid);
    const ar = areas[aid];
    const aname = ar.name || aid;
    let icon = ar.icon;
    if (!icon) { const hit = LP_AREA_ICONS.filter((p) => p[0].test(aname))[0]; icon = hit ? hit[1] : 'mdi:door'; }
    const id = usedIds[aid] ? 'a-' + aid : aid; usedIds[id] = true;
    tabs.push(tab({
      id: id, name: aname, icon: icon, area: aid,
      lights: L.slice(0, 25), scenes: (sc.length ? sc : globalScenes).slice(0, 6), controls: C.slice(0, 4), vacuums: V.slice(0, 2), medias: M.slice(0, 3),
      lightTitle: t(lang, 'room_lights', { area: upper(lang, aname) }), sceneTitle: t(lang, 'shortcuts'), controlTitle: upper(lang, aname)
    }));
  });

  if (tabs.length > 1) {
    const rest = (id) => { const a = areaOf(id); return !a || small[a] || !areas[a]; };
    const L = lightList.filter(rest).sort(byArea);
    const C = controls.filter(rest).sort(byArea);
    const M = medias.filter(rest).sort(byArea);
    const V = vacuums.filter(rest).sort(byArea);
    if (L.length || C.length || M.length || V.length) tabs.push(tab({
      id: 'other', name: t(lang, 'other'), icon: 'mdi:dots-horizontal-circle-outline',
      lights: L.slice(0, 25), scenes: globalScenes.slice(0, 6), controls: C.slice(0, 4), vacuums: V.slice(0, 2), medias: M.slice(0, 3),
      lightTitle: t(lang, 'lights'), sceneTitle: t(lang, 'shortcuts'), controlTitle: t(lang, 'other_control')
    }));
  }
  return tabs.slice(0, 8);
}


// İklim cihazına oda sensörü: aynı alandaki sıcaklık/nem sensörlerinden en uygunu. Puan: termostat/oda sensörü öne,
// iklim cihazlarının kendi sensörleri (petek/vana "local temperature") ve balkon/dış sensörleri arkaya, 3B yazıcı gibi
// cihazların iç sensörleri hiç. Nem, mümkünse seçilen sıcaklık sensörüyle aynı cihazdan.
function lpClimateItem(hass, id) {
  const S = hass.states || {}, ents = hass.entities || {}, devs = hass.devices || {};
  const o = { entity: id };
  const areaOf = (x) => { const e = ents[x]; if (!e) return null; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return d && d.area_id ? d.area_id : null; };
  const devOf = (x) => (ents[x] && ents[x].device_id) || null;
  const a = areaOf(id); if (!a) return o;
  const climateDevs = {};
  Object.keys(S).forEach((x) => { if (x.split('.')[0] === 'climate' && devOf(x)) climateDevs[devOf(x)] = true; });
  const nm = (x) => String((S[x].attributes && S[x].attributes.friendly_name) || x);
  const cname = (nm(id) + ' ' + id).toLowerCase();
  const score = (x) => {
    const e = ents[x];
    if (e && (e.hidden || e.entity_category || e.disabled_by)) return -99;
    const t = (nm(x) + ' ' + x).toLowerCase();
    if (/nozzle|bed_|chamber|ams_|cpu|gpu|battery|pil|device_temperature|internal|dahili|soc|probe|water|su_|boiler|kombi/.test(t)) return -99;
    let p = 0;
    if (/termostat|thermostat/.test(t)) p += 4;
    else if (/temp_hmd|temperature_humidity|sicaklik_nem|hygro|thermometer|termometre/.test(t)) p += 2;
    if (/local_temperature|_local_|petek|radiator|valve|vana|trv/.test(t)) p -= 5;
    if (devOf(x) && climateDevs[devOf(x)]) p -= 4;
    if (/balkon|balcony|outdoor|outside|exterior|dis_|dış|bahce|bahçe|garden|teras|terrace/.test(t) && !/balkon|balcony|outdoor|dis_|dış/.test(cname)) p -= 6;
    if (/motion|hareket/.test(t)) p -= 1;
    // iklim cihazının adındaki oda adı sensörün adında da geçiyorsa (ör. "Salon Petek" → "Salon Termostat")
    cname.split(/[^a-zçğıöşü0-9]+/).filter((w) => w.length > 3 && ['climate', 'petek', 'klima', 'tarafi', 'device'].indexOf(w) < 0).forEach((w) => { if (t.indexOf(w) >= 0) p += 1; });
    return p;
  };
  const cand = (cls) => Object.keys(S).filter((x) => x.split('.')[0] === 'sensor' && S[x].attributes && S[x].attributes.device_class === cls &&
    areaOf(x) === a && devOf(x) !== devOf(id) && !isNaN(parseFloat(S[x].state)))
    .map((x) => ({ x: x, p: score(x) })).filter((c) => c.p > -50).sort((p, q) => (q.p - p.p) || nm(p.x).localeCompare(nm(q.x)));
  const ts = cand('temperature')[0];
  if (ts) o.temperature_sensor = ts.x;
  const hs = cand('humidity');
  const same = ts && hs.filter((c) => devOf(c.x) && devOf(c.x) === devOf(ts.x))[0];
  if (same || hs[0]) o.humidity_sensor = (same || hs[0]).x;
  return o;
}

// Kanvas ölçekleme ve kiosk. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
// Kiosk: ayarda seçildiyse bizim panomuz açıkken HA'nın üst barı ve yan menüsü gizlenir (kiosk-mode ya da browser_mod gerekmez).
// Telefon düzeni (ölçekleme yok, bölümler alt alta, sayfa kayar): dar ekran (700 px altı), yatay telefon (yükseklik 500 px altı)
// ve dikey tutulan tablet (genişlik 1100 px altı, yükseklik genişlikten fazla). Yoksa 1280 px kanvas ekrana sığdırılır;
// yatay telefonda yazılar okunamayacak kadar küçülüyor, dikey tablette karolar uzun ince oluyordu.
function lpPhoneScreen() {
  const w = window.innerWidth || 1280, h = window.innerHeight || 800;
  return w < 700 || (h < 500 && w < 1100) || (h > w && w < 1100);
}
const LemurScale = (() => {
  const ID = 'lemur-home-dashboard-scale', KID = 'lemur-home-dashboard-kiosk';
  function mainRoot() {
    try { return document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main').shadowRoot; } catch (e) { return null; }
  }
  function root(m) {
    try {
      const p = m.querySelector('ha-panel-lovelace');
      const r = p && p.shadowRoot && p.shadowRoot.querySelector('hui-root');
      return (r && r.shadowRoot) ? r : null;
    } catch (e) { return null; }
  }
  function style(host, id, css) {
    if (!host) return;
    let st = host.getElementById ? host.getElementById(id) : host.querySelector('#' + id);
    if (!css) { if (st) st.textContent = ''; return; }
    if (!st) { st = document.createElement('style'); st.id = id; host.appendChild(st); }
    if (st.textContent !== css) st.textContent = css;
  }
  function apply(canvas, kiosk) {
    const m = mainRoot(); if (!m) return;
    const r = root(m);
    const sr = r && r.shadowRoot;
    const raw = r && r.lovelace && r.lovelace.rawConfig;
    const active = !!sr && (!!sr.querySelector('lemur-home-dashboard-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-home-dashboard'));
    // kiosk: yan menü home-assistant-main içinde, üst bar hui-root içinde. Yeni HA (2025.x+) menü genişliğini
    // --ha-sidebar-width ile verir; sadece menüyü gizlemek solda boş şerit bırakıyordu, genişlik de sıfırlanır.
    const k = kiosk || {};
    style(m, KID, active && k.hide_sidebar ? ':host{--ha-sidebar-width:0px !important;--ha-top-app-bar-width:100% !important}ha-sidebar{display:none !important}ha-drawer{--mdc-drawer-width:0px !important}' : '');
    if (!sr) return;
    style(sr, KID, active && k.hide_header ? '.header,.toolbar,app-header,ha-app-layout>[slot=header]{display:none !important}#view,hui-view-container{padding-top:0 !important;min-height:100vh !important}' : '');
    if (!active) { style(sr, ID, ''); return; }
    // telefon: ölçekleme yok, pano kendi telefon düzenini çizer (panel-card lpIsPhone ile aynı eşik)
    if (lpPhoneScreen()) { style(sr, ID, 'hui-view{min-height:0 !important;}'); return; }
    const W = (canvas && canvas.width) || 1280, H = (canvas && canvas.ref_height) || 1075;
    const kap = sr.querySelector('hui-view-container') || r;
    const g = kap.getBoundingClientRect().width;
    const bas = sr.querySelector('.header');
    const top = bas && bas.offsetHeight ? bas.getBoundingClientRect().bottom : Math.max(0, kap.getBoundingClientRect().top);
    const y = window.innerHeight - top;
    if (!g || !y) return;
    let gen = Math.max(W, Math.floor(g / y * H));
    const z = Math.max(0.35, Math.min(2, Math.floor(g / gen * 1000) / 1000));
    gen = Math.max(W, Math.floor(g / z));
    // --lp-h: ekranın kalan yüksekliği, kanvas pikseli cinsinden. Kart bunu en az yükseklik olarak kullanır, böylece kolonlar ekranı doldurur.
    // (Ekrandan hesaplanır, içerikten değil: içerik ölçülürse zoom kendini besler.)
    const lh = Math.floor(y / z);
    style(sr, ID, 'hui-view{zoom:' + z + ';width:' + gen + 'px !important;max-width:' + gen + 'px !important;margin:0 auto;flex:0 0 auto !important;min-height:0 !important;height:auto !important;--lp-h:' + lh + 'px;}');
  }
  let canvas = null, kiosk = null;
  const run = () => apply(canvas, kiosk);
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  return { set(c, k) { canvas = c; kiosk = k || null; run(); }, run: run };
})();

// Pano stratejisi: `strategy: { type: custom:lemur-home-dashboard }` yazılan pano bu sınıfla üretilir.
// HA kuralı: custom:lemur-home-dashboard → <ll-strategy-dashboard-lemur-home-dashboard>, static generate(config, hass).

// Varsayılan zemin: tablet panosundaki arka plan resminin kendisi neredeyse düz koyu lacivert (#0b0e15), kenarlara doğru
// hafif kararıyor. Resim dosyası gerekmesin diye aynısı CSS ile çiziliyor.
const LP_DEFAULT_BG = 'radial-gradient(ellipse at center, #0b0e15 0%, #0b0e15 55%, #0a0c13 100%) fixed';

// Zemin seçenekleri (ayarlar → Arka plan): koyu (varsayılan), siyah, renk, efekt renkleri, resim.
// Efekt renkleri Lemur Light Effect Card'ın efekt paletleri: her efektin renk tonları (hue), kartın arkasındaki ışıltı gibi
// koyu zeminin üstüne yumuşak renk lekeleri olarak çizilir. Light Effect Card kurulu olmasa da seçilebilir.
const LP_BG_FX = [
  ['aurora', 'Kutup ışığı', 'Aurora', [150, 200, 280]], ['fire', 'Ateş', 'Fire', [8, 30]], ['candle', 'Mum ışığı', 'Candlelight', [32, 45]],
  ['rainbow', 'Gökkuşağı', 'Rainbow', [0, 120, 240]], ['sunrise', 'Gün doğumu', 'Sunrise', [30, 48]], ['sunset', 'Gün batımı', 'Sunset', [15, 330]],
  ['night', 'Gece', 'Night', [230, 255]], ['galaxy', 'Galaksi', 'Galaxy', [255, 290]], ['storm', 'Fırtına', 'Storm', [255, 50]],
  ['rain', 'Yağmur', 'Rain', [205, 225]], ['snow', 'Kar', 'Snow', [190, 205]], ['ocean', 'Okyanus', 'Ocean', [190, 215]],
  ['forest', 'Orman', 'Forest', [95, 135]], ['autumn', 'Sonbahar', 'Autumn', [22, 40]], ['blossom', 'Çiçek', 'Blossom', [320, 345]],
  ['desert', 'Çöl', 'Desert', [35, 45]], ['mountain', 'Dağ', 'Mountain', [30, 140]], ['planet', 'Gezegen', 'Planet', [20, 200]],
  ['sparkle', 'Işıltı', 'Sparkle', [50, 300]], ['romantic', 'Romantik', 'Romantic', [340, 355]], ['party', 'Parti', 'Party', [300, 190]],
  ['music', 'Müzik', 'Music', [285, 320, 200]], ['movie', 'Sinema', 'Movie', [230, 260]], ['sleep', 'Uyku', 'Sleep', [250, 270]],
  ['zen', 'Meditasyon', 'Meditation', [170, 280]], ['game', 'Oyun', 'Gaming', [120, 280]], ['art', 'Sanat', 'Art', [0, 60, 200]],
  ['coffee', 'Kahve', 'Coffee', [25, 35]], ['halloween', 'Cadılar bayramı', 'Halloween', [30, 280]], ['gradient', 'Geçiş', 'Gradient', [30, 210]]
];
// paletin önizlemesi ve zemini: ton listesinden yumuşak renk lekeleri (köşelerde) + koyu zemin
function lpFxHues(key) { const f = LP_BG_FX.filter((x) => x[0] === key)[0]; return f ? f[3] : [220]; }
function lpFxSwatch(hues) {
  const h = hues.length === 1 ? [hues[0], (hues[0] + 22) % 360] : hues;
  return 'linear-gradient(120deg,' + h.map((x, i) => 'hsl(' + x + ',75%,45%) ' + Math.round(i / (h.length - 1) * 100) + '%').join(',') + ')';
}
function lpBgCss(b) {
  if (!b || !b.mode || b.mode === 'dark') return null;
  if (b.mode === 'black') return '#000000';
  if (b.mode === 'color') return 'linear-gradient(rgba(0,0,0,0) 35%, rgba(0,0,0,0.25)) fixed, ' + (b.color || '#0e1726');
  if (b.mode === 'img') return b.url ? "center / cover no-repeat fixed url('" + String(b.url).replace(/'/g, '') + "')" : null;
  if (b.mode === 'fx') {
    const hs = lpFxHues(b.fx), h = hs.length === 1 ? [hs[0], (hs[0] + 22) % 360] : hs;
    const pos = ['85% 10%', '10% 90%', '45% 55%'], a = [0.5, 0.45, 0.22];
    return h.slice(0, 3).map((x, i) => 'radial-gradient(ellipse 80% 70% at ' + pos[i] + ', hsla(' + x + ',75%,45%,' + a[i] + ') 0%, hsla(' + x + ',75%,45%,0) 70%) fixed').join(', ') + ', #0b0e15';
  }
  return null;
}

class LemurHomeDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    const lang = pickLang(hass);
    let data = null;
    try { data = await STORE.load(hass); } catch (e) { data = null; }
    if (!data) {
      return { views: [{ title: 'Lemur Home Dashboard', type: 'panel', cards: [{ type: 'markdown', content: t(lang, 'not_loaded') }] }] };
    }
    const tabs = (data.tabs && data.tabs.length) ? data.tabs : buildDefaultTabs(hass, lang);
    const settings = data.settings || {};
    LemurScale.set(settings.canvas || null, settings.kiosk || null);
    // Zemin: ayarda HA'nın görünüm arka planı biçiminde (resim, opaklık...) ya da CSS metni olarak verilebilir; HA kendisi çizer.
    const bg = settings.background || LP_DEFAULT_BG;
    window.__LHD_VIEWS = tabs.map((x) => x.id);   // kartın gezinmesi bilsin: hangi sekmelerin HA'da görünümü var
    return {
      views: tabs.map((tab) => {
        const v = {
          title: tab.name,
          path: tab.id,
          icon: tab.icon,
          type: 'panel',
          background: bg,
          cards: [{ type: 'custom:lemur-home-dashboard-card', tab: tab.id }]
        };
        if (settings.theme_name) v.theme = settings.theme_name;
        return v;
      })
    };
  }
}

// Şablon metin (A6): {{ }} ya da {% %} içeren ad / ikinci satır Home Assistant'ta çözülür (websocket render_template aboneliği).
// Her şablon bir kez abone olur; sonuç değişince o şablonu kullanan kartlar yeniden çizilir. Sonuç gelmeden '…' görünür.
const LP_TPL = window.__LEMUR_HD_TPL || (window.__LEMUR_HD_TPL = { m: {} });
const lpIsTpl = (s) => typeof s === 'string' && (s.indexOf('{{') >= 0 || s.indexOf('{%') >= 0);
function lpTpl(hass, tpl, onChange) {
  let e = LP_TPL.m[tpl];
  if (!e) {
    e = LP_TPL.m[tpl] = { v: null, cbs: [] };
    const conn = hass && hass.connection;
    if (conn && conn.subscribeMessage) {
      const p = conn.subscribeMessage((msg) => {
        const r = msg && Object.prototype.hasOwnProperty.call(msg, 'result') ? msg.result : (msg && msg.error ? '' : msg);
        e.v = r === null || r === undefined ? '' : (typeof r === 'object' ? JSON.stringify(r) : String(r));
        e.cbs.slice().forEach((f) => { try { f(); } catch (x) {} });
      }, { type: 'render_template', template: tpl, strict: false });
      if (p && p.then) p.then((u) => { e.unsub = u; }).catch(() => { e.v = ''; e.cbs.slice().forEach((f) => { try { f(); } catch (x) {} }); });
    } else e.v = '';
  }
  if (onChange && e.cbs.indexOf(onChange) < 0) e.cbs.push(onChange);
  return e.v;
}

// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Görünüm referans tablet panosuyla birebir (ölçüler base.css'te).
// Çizim iki aşamalı: iskelet sekme ya da ayar değişince bir kez kurulur (_build), durum değişince sadece karolar güncellenir (_update).
// Böylece gömülü kartların (iklim, süpürge) halesi ve karoların efekt animasyonu her durum değişiminde baştan başlamaz.
// Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const LP_HOLD_MS = 500;

// Dokun / basılı tut. Parmak kayarsa (kaydırma) hiçbir şey yapmaz.
function lpPress(el, tap, hold) {
  let timer = null, held = false, moved = false, sx = 0, sy = 0, touched = false;
  const start = (x, y) => {
    held = false; moved = false; sx = x; sy = y; clearTimeout(timer);
    el.classList.add('down');
    if (hold) timer = setTimeout(() => { held = true; el.classList.remove('down'); hold(); }, LP_HOLD_MS);
  };
  const cancel = () => { moved = true; clearTimeout(timer); el.classList.remove('down'); };
  const end = () => { clearTimeout(timer); el.classList.remove('down'); if (!held && !moved) tap(); };
  el.addEventListener('touchstart', (e) => { touched = true; const p = e.touches[0]; start(p.clientX, p.clientY); }, { passive: true });
  el.addEventListener('touchmove', (e) => { const p = e.touches[0]; if (Math.abs(p.clientX - sx) > 10 || Math.abs(p.clientY - sy) > 10) cancel(); }, { passive: true });
  el.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); end(); });
  el.addEventListener('touchcancel', cancel);
  el.addEventListener('mousedown', (e) => { if (touched || e.button !== 0) return; start(e.clientX, e.clientY); });
  el.addEventListener('mouseup', () => { if (touched) return; end(); });
  el.addEventListener('mouseleave', () => { if (!touched) cancel(); });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
// Kaydırmalı çubuk: dokun aç/kapat, sağa-sola kaydır değer (parlaklık, perde konumu, fan hızı), basılı tut pencere.
// Kaydırma parmağın başladığı yerden göreli (dokununca değer zıplamaz). Dikey hareket sayfayı kaydırır.
// o: { tap, hold, can() → kaydırılabilir mi, start() → şu anki değer 0-100, move(v), end() }
function lpSlide(el, o) {
  let timer = null, held = false, mode = null, sx = 0, sy = 0, sv = 0, w = 1, touched = false;
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
  const begin = (x, y) => {
    held = false; mode = null; sx = x; sy = y; clearTimeout(timer);
    el.classList.add('down');
    timer = setTimeout(() => { if (mode) return; held = true; el.classList.remove('down'); o.hold(); }, LP_HOLD_MS);
  };
  const move = (x, y, e) => {
    const dx = x - sx, dy = y - sy;
    if (!mode && !held) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) && o.can()) {
        mode = 'drag'; clearTimeout(timer); el.classList.remove('down'); el.classList.add('drag');
        sv = o.start(); w = el.getBoundingClientRect().width || 1; sx = x;
      } else if (Math.abs(dx) > 10 || Math.abs(dy) > 10) { mode = 'scroll'; clearTimeout(timer); el.classList.remove('down'); }
    }
    if (mode === 'drag') { if (e && e.cancelable) e.preventDefault(); o.move(clamp(sv + (x - sx) / w * 100)); }
  };
  const end = () => {
    clearTimeout(timer); el.classList.remove('down');
    if (mode === 'drag') { el.classList.remove('drag'); o.end(); } else if (!held && !mode) o.tap();
    mode = null;
  };
  el.addEventListener('touchstart', (e) => { touched = true; const p = e.touches[0]; begin(p.clientX, p.clientY); }, { passive: true });
  el.addEventListener('touchmove', (e) => { const p = e.touches[0]; move(p.clientX, p.clientY, e); }, { passive: false });
  el.addEventListener('touchend', (e) => { if (e.cancelable) e.preventDefault(); end(); });
  el.addEventListener('touchcancel', () => { clearTimeout(timer); el.classList.remove('down'); if (mode === 'drag') { el.classList.remove('drag'); o.end(); } mode = 'scroll'; });
  el.addEventListener('mousedown', (e) => {
    if (touched || e.button !== 0) return;
    begin(e.clientX, e.clientY);
    const mm = (ev) => move(ev.clientX, ev.clientY, ev);
    const mu = () => { document.removeEventListener('mousemove', mm, true); document.removeEventListener('mouseup', mu, true); end(); };
    document.addEventListener('mousemove', mm, true); document.addEventListener('mouseup', mu, true);
  });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}
// Çubuğun kaydırdığı değer (0-100): ışıkta parlaklık, perdede konum, fanda hız. Kaydırılamayan cihazda null.
function lpBarCan(st) {
  if (!st) return false;
  const d = st.entity_id.split('.')[0], a = st.attributes || {};
  if (d === 'light') { const m = a.supported_color_modes || []; return !(m.length && m.every((x) => x === 'onoff')); }
  if (d === 'cover') return typeof a.current_position === 'number';
  if (d === 'fan') return typeof a.percentage === 'number' || ((a.supported_features || 0) & 1) === 1;
  return false;
}
function lpBarVal(st) {
  const d = st.entity_id.split('.')[0], a = st.attributes || {};
  if (d === 'cover') return typeof a.current_position === 'number' ? a.current_position : (st.state === 'open' ? 100 : 0);
  if (st.state !== 'on') return 0;
  if (d === 'light' && typeof a.brightness === 'number') return Math.max(1, Math.round(a.brightness / 2.55));
  if (d === 'fan' && typeof a.percentage === 'number') return a.percentage;
  return 100;
}
function lpBarSet(h, id, v) {
  const d = id.split('.')[0];
  if (d === 'light') return v > 0 ? h.callService('light', 'turn_on', { entity_id: id, brightness_pct: v }) : h.callService('light', 'turn_off', { entity_id: id });
  if (d === 'cover') return h.callService('cover', 'set_cover_position', { entity_id: id, position: v });
  if (d === 'fan') return v > 0 ? h.callService('fan', 'set_percentage', { entity_id: id, percentage: v }) : h.callService('fan', 'turn_off', { entity_id: id });
}
const LP_BAR_COLOR = '#F0A93B';
function lpFire(node, type, detail) {
  const ev = new Event(type, { bubbles: true, composed: true });
  ev.detail = detail;
  node.dispatchEvent(ev);
}
// Kolon genişlikleri: sayı dizisi (oran, ör. [56, 17, 25.5]); eski kayıtlarda "56%" metni de olabilir.
const LP_DEFAULT_COLS = [56, 17, 25.5];
// Kolon içi sütun sayısı (1-3); genişlik kolondan eşit paylaşılır, ayrıca ayarlanmaz.
function lpSplits(tab, n) {
  const sp = (tab && tab.splits) || [];
  const out = [];
  for (let i = 0; i < n; i++) { const v = parseInt(sp[i], 10); out.push(v >= 1 && v <= 3 ? v : 1); }
  return out;
}
function lpWeights(tab) {
  const c = (tab && tab.columns && tab.columns.length) ? tab.columns : LP_DEFAULT_COLS;
  return c.map((x) => { const v = parseFloat(typeof x === 'object' && x ? x.w : x); return v > 0 ? v : 10; });
}
const lpEnt = (x) => (typeof x === 'string' ? { entity: x } : (x && x.entity ? x : null));
// Gömülü kart (Halo) tanımlı mı? customElements.get'e güvenilmez (kayıt defteri değişmiş olabilir), öğeyi oluşturup bakıyoruz.
const LP_HAS = {};
function lpHas(tag) {
  if (LP_HAS[tag]) return true;
  try { const el = document.createElement(tag); if (typeof el.setConfig === 'function') LP_HAS[tag] = true; } catch (e) {}
  return !!LP_HAS[tag];
}
const lpItem = (x) => (typeof x === 'string' ? { entity: x } : (x && (x.entity || x.name) ? x : null));
// karoda "açık" sayılan durumlar (ışık, priz, perde açık, medya çalıyor...)
const LP_ON = ['on', 'open', 'opening', 'closing', 'playing', 'cleaning'];
// Anında tepki: aç/kapat'a dokununca karo cihazın cevabını beklemeden yeni durumda çizilir.
// Işığın son rengi ve parlaklığı bu tarayıcıda hatırlanır (lhd-light-mem); açarken karo o renkte yanar.
// Gerçek durum gelince (ya da 5 sn içinde gelmezse) karo gerçeğe göre yeniden çizilir; başka yerden değiştiyse gerçek olan kalır.
const LP_OPT = window.__LEMUR_HD_OPT || (window.__LEMUR_HD_OPT = { mem: null, pend: {}, t: null });
const LP_OPT_DOMAINS = ['light', 'switch', 'input_boolean', 'fan'];
const LP_OPT_MS = 5000;
function lpOptMem() {
  if (!LP_OPT.mem) {
    let m = null; try { m = JSON.parse(localStorage.getItem('lhd-light-mem') || 'null'); } catch (e) {}
    LP_OPT.mem = m && typeof m === 'object' && !Array.isArray(m) ? m : {};
  }
  return LP_OPT.mem;
}
// yanan ışığın rengini ve parlaklığını hatırla (değiştiyse kaydet; yazma 2 sn toplanır)
function lpOptRemember(st) {
  if (!st || st.state !== 'on' || st.entity_id.indexOf('light.') !== 0) return;
  const a = st.attributes || {}, o = {};
  if (Array.isArray(a.rgb_color) && a.rgb_color.length >= 3) o.rgb_color = a.rgb_color.slice(0, 3);
  if (typeof a.brightness === 'number') o.brightness = a.brightness;
  if (typeof a.color_mode === 'string') o.color_mode = a.color_mode;
  const M = lpOptMem(), id = st.entity_id;
  if (M[id] && JSON.stringify(M[id]) === JSON.stringify(o)) return;
  M[id] = o;
  clearTimeout(LP_OPT.t);
  LP_OPT.t = setTimeout(() => { try { localStorage.setItem('lhd-light-mem', JSON.stringify(M)); } catch (e) {} }, 2000);
}
// dokunuşta beklenen durumu hazırla; aç/kapat edilebilen bir cihaz değilse false
function lpOptToggle(h, id) {
  const st = h && h.states[id], d = String(id).split('.')[0];
  if (!st || LP_OPT_DOMAINS.indexOf(d) < 0 || (st.state !== 'on' && st.state !== 'off')) return false;
  const on = st.state === 'off', a = Object.assign({}, st.attributes);
  if (d === 'light') {
    if (on) Object.assign(a, lpOptMem()[id] || {});
    else ['rgb_color', 'brightness', 'hs_color', 'xy_color', 'rgbw_color', 'rgbww_color', 'color_temp', 'color_temp_kelvin', 'effect'].forEach((k) => { delete a[k]; });
  }
  LP_OPT.pend[id] = { from: st, st: Object.assign({}, st, { state: on ? 'on' : 'off', attributes: a }), until: Date.now() + LP_OPT_MS };
  return true;
}
// yedek kontrol (twins.py): lambanın yedeği ve son 30 dakikada yedek yolun kullanıldığı zaman
const lpTwinOf = (id) => { const T = STORE.data && STORE.data.twins; const r = T && T[id]; return r && typeof r.backup === 'string' ? r.backup : null; };
function lpFbAt(id) {
  const F = STORE.data && STORE.data.fallback, v = F && F[id]; if (!v) return null;
  const ms = Date.parse(v); return ms && Date.now() - ms < 30 * 60000 ? ms : null;
}
// çizimde kullanılacak durum: cevap beklenirken beklenen durum, gelince (ya da süre dolunca) gerçeği
function lpEff(S, id) {
  const p = LP_OPT.pend[id], r = S[id];
  if (!p) return r;
  if (r && Date.now() < p.until && r.state === p.from.state) return p.st;
  delete LP_OPT.pend[id];
  return r;
}

// Efekt oynayan ışık: çerçeve ve simge efektin adına göre seçilen paletle döner, hafif parlar (tablet panosundaki Govee karoları).
const LP_FX = [
  { k: 'music', d: 3, c: ['#ff3b6b', '#ffd60a', '#34c759', '#0a84ff', '#bf5af2'], t: (e) => e.slice(0, 5) === 'music' },
  { k: 'water', d: 6, c: ['#0a84ff', '#5ac8fa', '#00c7ff', '#2b6cff'], w: ['sea', 'ocean', 'lake', 'river', 'ice', 'glacier', 'snow', 'winter', 'rain', 'wave', 'ripple', 'deep', 'fog', 'cloud'] },
  { k: 'fire', d: 5, c: ['#ff453a', '#ff9f0a', '#ff6b00', '#ff2d55'], w: ['fire', 'blood', 'dracarys', 'sunset', 'sunrise', 'autumn', 'desert', 'candle'] },
  { k: 'forest', d: 6, c: ['#30d158', '#a3e635', '#00c78c', '#34c759'], w: ['forest', 'grass', 'green', 'spring', 'leaf', 'tree', 'oasis', 'mountain', 'summer'] },
  { k: 'aurora', d: 7, c: ['#bf5af2', '#5e5ce6', '#0a84ff', '#af52de'], w: ['aurora', 'night', 'moon', 'twilight', 'galaxy', 'dream', 'coven', 'arctic'] },
  { k: 'rainbow', d: 5, c: ['#ff3b30', '#ff9f0a', '#ffd60a', '#34c759', '#0a84ff', '#bf5af2'], w: ['rainbow', 'colorful', 'flower', 'cherry', 'birthday', 'bloom', 'party'] },
  { k: 'other', d: 6, c: ['#ffd60a', '#ff9f0a', '#ffe9a8'] }
];
const LP_FX_NONE = ['', 'none', 'off', 'solid', 'static', 'normal'];
function lpFx(st) {
  if (!st || st.state !== 'on') return null;
  return lpFxByName(st.attributes.effect);
}
function lpFxByName(name) {
  const ef = String(name || '').toLowerCase().replace(/^\s+|\s+$/g, '');
  if (LP_FX_NONE.indexOf(ef) >= 0) return null;
  for (let i = 0; i < LP_FX.length; i++) {
    const p = LP_FX[i];
    if (p.t ? p.t(ef) : (!p.w || p.w.some((w) => ef.indexOf(w) >= 0))) return p;
  }
  return null;
}
const LP_FX_CSS = LP_FX.map((p) => {
  let a = '', b = '';
  p.c.forEach((c, i) => {
    const pc = Math.round(i * 100 / p.c.length);
    a += pc + '%{border-color:' + c + ';box-shadow:0 0 18px -6px ' + c + '}';
    b += pc + '%{color:' + c + '}';
  });
  a += '100%{border-color:' + p.c[0] + ';box-shadow:0 0 18px -6px ' + p.c[0] + '}';
  b += '100%{color:' + p.c[0] + '}';
  return '@keyframes lpfx-' + p.k + '{' + a + '}@keyframes lpfxi-' + p.k + '{' + b + '}' +
    '.tile.fx-' + p.k + ',.bar.fx-' + p.k + '{border-color:' + p.c[0] + ';animation:lpfx-' + p.k + ' ' + p.d + 's linear infinite}' +
    '.tile.fx-' + p.k + ' ha-state-icon,.bar.fx-' + p.k + ' ha-state-icon{animation:lpfxi-' + p.k + ' ' + p.d + 's linear infinite}';
}).join('');

// Telefon görünümü: dar ekranda (700 px altı) pano ölçeklenmez; üst şerit kayar, bölümler alt alta, karolar 3'lü.
// Yönetim panelinin önizlemesi "Telefon" ekranında config.phone ile zorlar.
const LP_PHONE_W = 700;
// telefon düzeninde kartın genişliği (yönetim panelinin telefon önizlemesinde çerçevenin genişliği); geniş ekranda karo sayısı artar (karo ~120 px): 390 px'te 3, 800 px'te 6
const lpPhoneW = (el) => Math.min((el && el.getBoundingClientRect().width) || window.innerWidth || 390, 1100);
const lpPhoneKey = (el, cfg) => (lpIsPhone(cfg) ? 'p' + Math.floor(lpPhoneW(el) / 120) : 't');
function lpIsPhone(cfg) {
  if (cfg && typeof cfg.phone === 'boolean') return cfg.phone;
  return lpPhoneScreen();   // src/scale.js
}

// üst şeritteki Efektler düğmesi: LEC kuruluysa varsayılan açık
function lpLecNav(h) {
  const st = (STORE.data && STORE.data.settings) || {};
  return LEC.installed(h) && st.lec_nav !== false;
}

// Mevsim: ayarda yoksa aya göre (Mayıs-Eylül yaz). Kış'ta petek, Yaz'da klima kartları.
function lpSeason() {
  const d = STORE.data, s = d && d.settings && d.settings.season;
  if (s === 'summer' || s === 'winter') return s;
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 9 ? 'summer' : 'winter';
}

// Öğe boyutu (size): karonun ızgarada kapladığı hücre. '1x1' (varsayılan), '2x1', '1x2', '2x2', 'row' (satır boyu)
function lpSpan(it, c) {
  const z = String((it && it.size) || '');
  if (z === 'row') return [c, 1];
  const m = /^([1-3])x([1-3])$/.exec(z);
  return m ? [Math.min(+m[1], c), +m[2]] : [1, 1];
}
// Izgaranın satır sayısı: öğeler sırayla, boşlukları dolduran (dense) yerleşimle; hepsi 1x1 ise ceil(n / c)
function lpGridRows(items, c) {
  const occ = [];
  const free = (r, x, w, h) => { for (let j = r; j < r + h; j++) for (let i = x; i < x + w; i++) if (occ[j] && occ[j][i]) return false; return true; };
  let rows = 0;
  items.forEach((it) => {
    const sp = lpSpan(it, c), w = sp[0], h = sp[1];
    for (let r = 0; ; r++) {
      let done = false;
      for (let x = 0; x + w <= c; x++) if (free(r, x, w, h)) {
        for (let j = r; j < r + h; j++) { occ[j] = occ[j] || []; for (let i = x; i < x + w; i++) occ[j][i] = 1; }
        rows = Math.max(rows, r + h); done = true; break;
      }
      if (done) break;
    }
  });
  return rows;
}
// Simge ve yazı boyutu (icon_size / text_size: 's' | 'm' | 'l'; yoksa bugünkü ölçü). Öğenin style'ına CSS değişkeni olarak yazılır.
const LP_ICW = { row: { s: '18px', m: '22px', l: '28px' }, tile: { s: '28%', m: '40%', l: '56%' }, val: { s: '24%', m: '32%', l: '46%' }, bar: { s: '24px', m: '34px', l: '46px' }, scene: { s: '28px', m: '40px', l: '58px' } };
const LP_FS = { row: { s: 13, m: 15, l: 18 }, tile: { s: 13, m: 16, l: 20 }, val: { s: 14, m: 17, l: 22 }, bar: { s: 14, m: 17, l: 21 }, scene: { s: 15, m: 18, l: 23 } };
function lpItemStyle(it, kind, c) {
  let st = '';
  if (c) { const sp = lpSpan(it, c); if (it.size === 'row') st += 'grid-column:1/-1;'; else { if (sp[0] > 1) st += 'grid-column:span ' + sp[0] + ';'; if (sp[1] > 1) st += 'grid-row:span ' + sp[1] + ';'; } }
  if (c && lpWide(it, c) && it.icon_size && LP_ICWP[it.icon_size]) st += '--lp-icwp:' + LP_ICWP[it.icon_size] + ';';
  if (it.icon_size && LP_ICW[kind][it.icon_size]) st += '--lp-icw:' + LP_ICW[kind][it.icon_size] + ';';
  if (it.text_size && LP_FS[kind][it.text_size]) st += '--lp-fs:' + LP_FS[kind][it.text_size] + 'px;';
  return st;
}
const LP_HALO_DOMAINS = ['sensor', 'number', 'input_number'];
// gömülü kartın (Halo görünümü, kart öğesi) yüksekliği: height = '1' | '1.5' | '2' satır
const LP_EMB_H = { 1: 96, 1.5: 144, 2: 192 };
// Halo kartının yazı ve simge boyutu (öğenin text_size / icon_size), kartın içine eklenen stil
function lpHaloStyle(it) {
  const T = { s: [13, 11], m: [16, 13.5], l: [20, 16] }[it.text_size], I = { s: [56, 32], m: [74, 44], l: [90, 54] }[it.icon_size];
  let css = ':host{height:100%}ha-card{height:100%;box-sizing:border-box}.compact .top{height:100%;min-height:80px}';
  if (T) css += '.name{font-size:' + T[0] + 'px;line-height:' + Math.round(T[0] * 1.4) + 'px}.sec{font-size:' + T[1] + 'px;line-height:' + Math.round(T[1] * 1.35) + 'px;max-height:none}';
  if (I) css += '.ic{width:' + I[0] + 'px;height:' + I[0] + 'px;--mdc-icon-size:' + I[1] + 'px}.ic svg{width:' + I[1] + 'px;height:' + I[1] + 'px}.txt{left:' + (I[0] + 12) + 'px}';
  return css;
}
// A4 öğe renkleri. zones: { t: [4 sınır], c: [5 renk] } (Halo kartlarındaki bölge mantığı): değer t[k]'ye eşit ya da büyükse bir üst bölge
function lpZone(it, st) {
  const z = it && it.zones; if (!z || !st) return null;
  const v = parseFloat(st.state); if (isNaN(v)) return null;
  const T = z.t || [], C = z.c || [];
  let i = 0;
  for (let k = 0; k < 4; k++) { const x = parseFloat(T[k]); if (!isNaN(x) && v >= x) i = k + 1; }
  return C[i] || null;
}
// duruma göre renk: state_colors = { entity (verilmezse öğenin varlığı), map: { durum: renk } }
function lpMapColor(it, S) {
  const m = it && it.state_colors; if (!m || typeof m !== 'object' || !m.map) return null;
  const id = m.entity || it.entity, st = id && S ? S[id] : null;
  return st ? (m.map[st.state] || null) : null;
}
// Halo kartının hale rengi (Halo'nun kendi renk adlarıyla da verilebilir: green, blue...)
const LP_HALO_RGB = { green: '#28BE64', blue: '#008CFF', ice: '#78D7FF', yellow: '#FFCD28', orange: '#FF8C1E', red: '#FF3737', purple: '#A064FF', grey: '#969696' };
function lpHexA(c, a) { const m = /^#?([0-9a-f]{6})$/i.exec(String(c || '')); if (!m) return c; const n = parseInt(m[1], 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
// geniş ve tek satır yüksekliğindeki karo (2x1, satır boyu): simge ve yazı yan yana
const lpWide = (it, c) => { const sp = lpSpan(it, c); return sp[0] >= 2 && sp[1] === 1 && c >= 2; };
const LP_ICWP = { s: '28px', m: '40px', l: '56px' };
const lpStyleA = (st) => (st ? ' style="' + st + '"' : '');
// Değer karosu: açık/kapalı durumu olan alanlar ve "açık" sayılan durumları
const LP_VAL_ONOFF = ['binary_sensor', 'timer', 'person', 'device_tracker', 'update', 'calendar'];
const LP_VAL_ON = ['on', 'active', 'home', 'open'];
function lpDur(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60, p = (n) => (n < 10 ? '0' : '') + n;
  return h ? h + ':' + p(m) + ':' + p(s) : m + ':' + p(s);
}
function lpDurParse(x) { const p = String(x || '').split(':').map(Number); if (p.some(isNaN) || !p.length) return null; return p.reduce((a, b) => a * 60 + b, 0); }
// Değer metni: HA'nın kendi biçimi (çeviri, birim, ondalık) varsa o; yoksa durum + birim. Çalışan zamanlayıcıda kalan süre.
function lpValText(h, st, lang) {
  const a = st.attributes || {}, d = st.entity_id.split('.')[0];
  if (d === 'timer' && st.state === 'active') {
    let left = null;
    if (a.finishes_at) left = (Date.parse(a.finishes_at) - Date.now()) / 1000;
    else { const r = lpDurParse(a.remaining); if (r !== null) left = r - (Date.now() - Date.parse(st.last_changed || st.last_updated || '')) / 1000; }
    if (left !== null && !isNaN(left)) return lpDur(left);
  }
  if (st.state === 'unavailable') return t(lang, 'unavailable');
  if (h && typeof h.formatEntityState === 'function') { try { const v = h.formatEntityState(st); if (v !== undefined && v !== null && v !== '') return String(v); } catch (e) {} }
  if (st.state === 'unknown') return '—';
  const s = TXT[lang] && TXT[lang][st.state] ? t(lang, st.state) : st.state;
  return a.unit_of_measurement ? s + ' ' + a.unit_of_measurement : s;
}

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._sig = null; if (this._hass) this._render(); }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) { LEC.load(h); STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    LemurLightPopup.update(h);
    LemurCardPopup.update(h);
    if (!this._sig) return;
    (this._embeds || []).forEach((e) => { e.hass = h; });
    const w = this._watched || [];
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
    const m = this._missing || [];
    for (let i = 0; i < m.length; i++) if (h.states[m[i]]) { this._render(); return; }
  }
  connectedCallback() {
    if (!this._unsub) this._unsub = STORE.onChange((d) => {
      this._def = null;
      const st = (d && d.settings) || {};
      if (!this._config.edit) LemurScale.set(st.canvas || null, st.kiosk || null);   // ölçek ve kiosk ayarı canlı değişsin
      this._render();
    });
    if (!this._lecUnsub) this._lecUnsub = LEC.onChange((kind) => {
      if (kind === 'rooms') { this._sig = null; this._render(); return; }
      if (kind === 'effects' || kind === 'info') return;   // oda listesi değişti: izlenen ışıklar değişir
      this._last = {}; if (this._sig) this._update();                       // oynayan efekt değişti: karolar ve düğmeler
    });
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => this._render());   // LEC simgeleri yüklendi
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { this._sig = null; this._render(); });   // renkli simge seti yüklendi
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    // ekran döndürülünce ya da pencere daralınca telefon ↔ tablet görünümü
    if (!this._rsz) { this._rsz = () => { const p = lpPhoneKey(this, this._config); if (p !== this._phone) { this._phone = p; this._sig = null; this._render(); } }; window.addEventListener('resize', this._rsz); }
    this._phone = lpPhoneKey(this, this._config);
    if (this._hass) this._render();
  }
  disconnectedCallback() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._leciUnsub) { this._leciUnsub(); this._leciUnsub = null; }
    if (this._mdicUnsub) { this._mdicUnsub(); this._mdicUnsub = null; }
    clearInterval(this._clock); this._clock = null;
    clearInterval(this._tmr); this._tmr = null;
    if (this._rsz) { window.removeEventListener('resize', this._rsz); this._rsz = null; }
    if (this._edMove) { window.removeEventListener('pointermove', this._edMove); window.removeEventListener('pointerup', this._edUp); window.removeEventListener('pointercancel', this._edUp); this._edMove = null; }
    if (this._edRO) { this._edRO.disconnect(); this._edRO = null; }
    this._sig = null;   // geri takılınca baştan kurulsun (dinleyiciler yeniden bağlansın)
  }

  _tabs() {
    const d = STORE.data;
    if (d && d.tabs && d.tabs.length) return d.tabs;
    if (!this._def) this._def = buildDefaultTabs(this._hass, pickLang(this._hass));
    return this._def;
  }
  _tick() {
    const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time();
    (this._pets || []).forEach((el) => lpPetPaint(el, this._lang, Date.now()));   // "2 sa önce", durum rengi
    if (this._ticks % 4 === 0 && this._hasAgo) this._repaint();                       // "son değişim" ikinci satırları
    this._ticks = (this._ticks || 0) + 1;
    if (this._ticks % 20 === 0 && this._def && this._hass) { this._def = null; this._render(); }   // otomatik düzen 5 dk'da bir tazelenir
  }
  _time() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states, lang = pickLang(h);
    const tabs = this._tabs();
    const tab = tabs.filter((x) => x.id === (this._config && this._config.tab))[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; this._sig = null; return; }
    const season = lpSeason();
    // iskeleti değiştiren her şey: sekme ayarı, mevsim, dil, var olan cihazlar
    const present = [], vis = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => {
      const e = lpEnt(x); if (e && S[e.entity]) present.push(e.entity);
      if (x && x.visible) vis.push(lpVisible(x.visible, S));   // koşullu öğe: koşul değişince iskelet yeniden kurulur
      if (x && x.state_colors) vis.push(lpMapColor(x, S));      // duruma göre renk (Halo kartı yeniden kurulur)
    }));
    const sig = JSON.stringify([tab, season, lang, present, vis, tabs.map((x) => [x.id, x.name, x.icon]), lpHas('lemur-hd-climate-card'), LEC.installed(h), lpLecNav(h), lpIsPhone(this._config), !!this._config.edit, this._config.selected || '', !!LP_LECI.map, lpIconMode(), lpIconTint(), lpIconTintLight(), !!LP_MDIC.map]);
    if (sig !== this._sig) { this._sig = sig; this._build(tab, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    tab = lhdNormTab(tab);
    const h = this._hass, S = h.states;
    if (this.getAttribute('lang') !== lang) this.setAttribute('lang', lang);
    const tiles = [], tileItems = [], rows = [], embeds = [], vals = [], cards = [], visW = [], ssItems = [];
    // şablonlu (A6) sabit yazılar: yer tutucu span, _update'te doldurulur
    const txs = (s) => (lpIsTpl(s) ? '<span data-tx="' + esc(s) + '">…</span>' : esc(s));
    const lecRooms = {};   // bu sekmede LEC'ten oynayan efekti sorulacak odalar
    // ayarda olup şu an HA'da olmayan cihazlar: gelince (ör. HA yeniden başladıktan sonra) pano yeniden kurulur
    this._missing = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => { const e = lpEnt(x); if (e && !S[e.entity]) this._missing.push(e.entity); }));
    const edit = !!this._config.edit, selected = this._config.selected || '';
    const phone = lpIsPhone(this._config);
    let curSec = '';
    // her öğe hangi bölümün kaçıncı öğesi: düzenleme modunda sürükle-bırak için
    const mark = (i) => ' data-sec="' + esc(curSec) + '" data-idx="' + i + '"';
    // düzenleme modunda koşulu şu an sağlanmayan öğe soluk görünür (normal panoda hiç çizilmez, yer kaplamaz)
    const hidA = (it) => (it._hid ? ' data-hid="1"' : '');
    // değer karosu (sensör, zamanlayıcı...): simge, değer, ad. Çubuk görünümünde yatay çubuk
    const valTile = (it, bar, c) => {
      vals.push(it);
      const ic = lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>';
      if (bar) return '<div class="bar val" data-val="' + esc(it.entity) + '" data-vi="' + (vals.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'bar', c)) + hidA(it) + mark(it._i) + '>' + ic + '<div class="bt"><div class="nm"></div><div class="pc"></div></div></div>';
      return '<div class="tile val' + (c && lpWide(it, c) ? ' wide" data-wide="1' : '') + '" data-val="' + esc(it.entity) + '" data-vi="' + (vals.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'val', c)) + hidA(it) + mark(it._i) + '>' + ic + '<div class="vl"></div><div class="nm"></div>' + (it.secondary ? '<div class="sl"></div>' : '') + '</div>';
    };
    const emb = (tag, cfg, id, i, it) => {
      if (!lpHas(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"' + mark(i) + '></div>'; }
      embeds.push({ tag: tag, cfg: Object.assign({ language: lang }, cfg), it: it || null });
      return '<div class="emb' + (it && LP_EMB_H[it.height] ? ' hfix' : '') + '" data-emb="' + (embeds.length - 1) + '"' + (it && LP_EMB_H[it.height] ? ' style="min-height:' + LP_EMB_H[it.height] + 'px"' : '') + (it ? hidA(it) : '') + mark(i) + '></div>';
    };
    // görünümü değiştirilmiş varlık öğesi (düğme ya da satır): simge, ad, değer/durum. _paintEnt çizer
    const ents = [];
    const entEl = (it, look) => {
      ents.push(it);
      const ei = ' data-ent="' + esc(it.entity) + '" data-ei="' + (ents.length - 1) + '"' + hidA(it) + mark(it._i);
      const ic = lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>';
      if (look === 'row') return '<div class="vrow"' + lpStyleA(lpItemStyle(it, 'row', 0)) + ei + '>' + ic + '<span class="rn"></span><span class="rv"></span></div>';
      return '<div class="scene ebtn"' + lpStyleA(lpItemStyle(it, 'scene', 0)) + ei + '><div class="si">' + ic + '</div><div class="sb"><b class="sn"></b><i class="sv"></i></div></div>';
    };
    // eylem öğesi (düğme) karo ya da satır görünümünde: dokununca düğme gibi çalışır (data-scene)
    const actEl = (s, it, look, c) => {
      const st = it.entity ? S[it.entity] : null, cc = it.color || '#5B8DEF';
      const name = it.name || (st ? st.attributes.friendly_name || it.entity : '');
      const icon = it.icon || (st && st.attributes.icon) || 'mdi:play';
      const ic = lpIcon(icon, 'acti', 'color:' + esc(cc));
      if (look === 'row') return '<div class="vrow act" style="--sc:' + esc(cc) + ';' + lpItemStyle(it, 'row', 0) + '" data-scene="' + esc(s.id) + ':' + it._i + '"' + hidA(it) + mark(it._i) + '>' + ic + '<span class="rn">' + txs(name) + '</span></div>';
      return '<div class="tile act" style="--sc:' + esc(cc) + ';' + lpItemStyle(it, 'tile', c) + '" data-scene="' + esc(s.id) + ':' + it._i + '"' + hidA(it) + mark(it._i) + '>' + ic + '<div class="nm">' + txs(name) + '</div></div>';
    };
    const withIdx = (arr, norm) => (arr || []).map((x, i) => { const e = norm(x); return e ? Object.assign({ _i: i }, e) : null; }).filter(Boolean);
    // Bölüm serbest: öğeler sırayla, kendi türüne göre çizilir. Art arda gelen aynı türden öğeler bir grup olur:
    // karolar (ışık, priz, perde, fan... ve boş karo) bir ızgara, senaryo düğmeleri, iklim/süpürge kartları ve medya satırları alt alta.
    // Bölümde sadece karo varsa ızgara kutuyu doldurur (tablet panosundaki gibi); başka öğelerle birlikteyse karolar kare kalır.
    const tileGrid = (s, items, only) => {
      // Karo sayısı ayardaki kadar, ama sütun daraldıysa karolar 70 px'ten küçülmesin diye azalır (kanvas en az W piksel geniş)
      const cw = ((STORE.data && STORE.data.settings && STORE.data.settings.canvas) || {}).width || 1280;
      const sumW = widths.reduce((a, b) => a + b, 0), ci = Math.max(0, Math.min(widths.length - 1, s.col || 0));
      const inner = (cw - 8 - 20 * widths.length) * widths[ci] / sumW / splits[ci] - 12 - 40;
      // kaydırmalı çubuklar: bölüm ayarı look = 'bar' (her yerde) ya da 'phone' (telefonda otomatik)
      if (s.look === 'bar' || (s.look === 'phone' && phone)) {
        const want = s.bar_columns || (items.length > 12 ? 3 : 2), bc = phone ? Math.min(want, 2) : Math.max(1, Math.min(want, Math.floor((inner + 8) / 158)));
        // tablette satırlar kutuyu doldurur ama bir çubuk kutunun altıda birinden uzun olmaz; telefonda ya da başka öğelerle birlikteyken sabit yükseklik
        const br = Math.max(6, lpGridRows(items, bc)), fillB = only && !phone;
        const dense = items.some((x) => x.size) ? ';grid-auto-flow:row dense' : '';
        return '<div class="bars' + (fillB ? '' : ' fixed') + '" data-sec="' + esc(s.id) + '" style="grid-template-columns:repeat(' + bc + ',minmax(0,1fr))' + (fillB ? ';grid-template-rows:repeat(' + br + ',minmax(60px,1fr))' : '') + dense + (typeof s.gap === 'number' ? ';grid-gap:' + s.gap + 'px' : '') + '">' +
          items.map((it) => {
            if (it._val) return valTile(it, true, bc);
            if (it._act) return actEl(s, it, 'tile', bc);
            if (!it.entity) return '<div class="bar ph"' + lpStyleA(lpItemStyle(it, 'bar', bc)) + hidA(it) + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="bt"><div class="nm">' + esc(it.name || '') + '</div></div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="bar" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'bar', bc)) + hidA(it) + mark(it._i) + '><div class="bf"></div>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>') + '<div class="bt"><div class="nm"></div><div class="pc"></div></div></div>';
          }).join('') + '</div>';
      }
      // 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
      // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
      const c = phone ? Math.max(Math.min(s.tile_columns || 5, 3), Math.min(8, Math.floor(lpPhoneW(this) / 120))) : Math.max(1, Math.min(s.tile_columns || 5, Math.floor((inner + 8) / 78))), r = lpGridRows(items, c), fill = !phone && (r >= 4 || !!s.fill);
      // başka öğelerle aynı kutudaysa karolar kalan yeri doldurur, gerekirse kısalır (kartlar kendi yüksekliğinde kalır)
      const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? (only ? 'minmax(84px,1fr)' : 'minmax(56px,1fr)') : '1fr') + ')' + (items.some((x) => x.size) ? ';grid-auto-flow:row dense' : '');
      const G = typeof s.gap === 'number' ? s.gap : 8, gs2 = gs + (typeof s.gap === 'number' ? ';grid-gap:' + G + 'px' : '');   // bölüm ayarı Aralık
      const open = fill ? '<div class="grid" data-sec="' + esc(s.id) + '" style="' + gs2 + '">'
        : '<div class="gsq" data-sec="' + esc(s.id) + '" style="padding-bottom:calc((100% - ' + (G * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (G * (r - 1)) + 'px)"><div class="grid" style="' + gs2 + '">';
      return open + items.map((it) => {
        if (it._val) return valTile(it, false, c);
        if (it._act) return actEl(s, it, 'tile', c);
        if (!it.entity) return '<div class="tile ph"' + lpStyleA(lpItemStyle(it, 'tile', c)) + hidA(it) + mark(it._i) + '>' + lpIcon(it.icon || 'mdi:lightbulb') + '<div class="nm">' + esc(it.name || '') + '</div></div>';
        tiles.push(it.entity); tileItems.push(it);
        return '<div class="tile' + (lpWide(it, c) ? ' wide" data-wide="1' : '') + '" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + lpStyleA(lpItemStyle(it, 'tile', c)) + hidA(it) + mark(it._i) + '>' + (lpIsLecIcon(it.icon) ? lpIcon(it.icon) : '<span class="lic mdic"></span>') + '<div class="nm"></div>' + (it.secondary ? '<div class="sl"></div>' : '') + '</div>';
      }).join('') + (fill ? '</div>' : '</div></div>');
    };
    const sceneBtn = (s, it, i) => {
      const lecOn = LEC.installed(h), k = lpLecKind(it), c = it.color || '#5B8DEF';
      let lec = '';
      if (k) {
        const room = k === 'open' ? (it.action.room || tab.area || '') : ((it.action.data && it.action.data.room) || '');
        if (room) lecRooms[room] = 1;
        lec = ' data-lk="' + esc(k) + '" data-lroom="' + esc(room) + '" data-lfx="' + esc((it.action.data && it.action.data.effect) || '') + '"';
      }
      const st = it.entity ? S[it.entity] : null;
      const name = it.name || (st ? st.attributes.friendly_name || it.entity : '');
      const icon = it.icon || (st && st.attributes.icon) || 'mdi:play';
      return '<div class="scene' + (k ? ' lec' + (lecOn ? '' : ' na') : '') + '" style="--sc:' + esc(c) + ';' + lpItemStyle(it, 'scene', 0) + '" data-scene="' + esc(s.id) + ':' + i + '"' + lec + hidA(it) + mark(i) + '><div class="si">' + lpIcon(icon, '', 'color:' + esc(c)) + '</div>' +
        (it.secondary ? '<span class="s2w"><b>' + txs(name) + '</b><i class="ss" data-ss="' + (ssItems.push(it) - 1) + '"></i></span>' : '<span>' + txs(name) + '</span>') + '</div>';
    };
    const bodyOf = (s) => {
      const lecOn = LEC.installed(h);
      const all = (s.entities || []).map((x, i) => {
        const k = lhdKind(x); if (!k) return null;
        const it = typeof x === 'string' ? { entity: x } : x;
        if (it.entity && !S[it.entity]) return null;                                // HA'da (şimdilik) yok
        if (k === 'scene' && lpLecKind(it) && !lecOn && !edit) return null;          // LEC kurulu değilse LEC düğmesi görünmez
        if (it.visible && it.visible.entity && visW.indexOf(it.visible.entity) < 0) visW.push(it.visible.entity);
        const sce = it.state_colors && (it.state_colors.entity || it.entity);
        if (sce && visW.indexOf(sce) < 0) visW.push(sce);
        const hid = !!it.visible && !lpVisible(it.visible, S);
        if (hid && !edit) return null;                                              // koşul sağlanmıyor: çizilmez, boşluk kalmaz
        // görünüm (look): eylem öğesi karo/satır, varlık öğesi düğme/satır, değer öğesi Halo kartı. Verilmezse türünün bugünkü görünümü
        const lk = it.look, d0 = it.entity ? it.entity.split('.')[0] : '';
        const base = { _i: i, _hid: hid };
        if (k === 'scene' && lk === 'tile') return Object.assign(base, { _k: 'tile', _act: true }, it);
        if (k === 'scene' && lk === 'row') return Object.assign(base, { _k: 'vrow', _act: true }, it);
        if ((k === 'value' || k === 'tile') && it.entity && (lk === 'button' || lk === 'row')) return Object.assign(base, { _k: lk === 'row' ? 'vrow' : 'ebtn', _val: k === 'value' }, it);
        if (k === 'value' && lk === 'halo' && LP_HALO_DOMAINS.indexOf(d0) >= 0) return Object.assign(base, { _k: 'halo' }, it);
        return Object.assign(base, { _k: k === 'ph' || k === 'value' ? 'tile' : k, _val: k === 'value' }, it);
      }).filter(Boolean);
      if (!all.length) return null;
      // iklim: bölümde hem klima hem petek varsa mevsime göre biri gösterilir (başlıkta Yaz/Kış düğmesi)
      const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
      const cl = all.filter((x) => x._k === 'climate'), both = cl.some(isAC) && cl.some((x) => !isAC(x));
      const items = both ? all.filter((x) => x._k !== 'climate' || (season === 'winter' ? !isAC(x) : isAC(x))) : all;
      if (!items.length) return null;
      const groups = [];
      items.forEach((x) => { const g = groups[groups.length - 1]; if (g && g.k === x._k && (x._k === 'tile' || x._k === 'vrow' || x._k === 'pet')) g.items.push(x); else groups.push({ k: x._k, items: [x] }); });
      const hasTiles = groups.some((g) => g.k === 'tile'), onlyTiles = groups.length === 1 && hasTiles;
      const html = groups.map((g) => {
        if (g.k === 'tile') return tileGrid(s, g.items, onlyTiles);
        // besleme kartları: kutuya sığdığı kadar yan yana (en az 220 px)
        if (g.k === 'pet') return '<div class="pets">' + g.items.map((x) => '<div class="petc" data-pet="' + esc(x.pet) + '"' + hidA(x) + mark(x._i) + '></div>').join('') + '</div>';
        // satırlar: ince yatay satırlar, kutuya sığdığı kadar yan yana (en az 170 px)
        if (g.k === 'vrow') return '<div class="vrows" style="grid-template-columns:repeat(' + (phone ? 1 : Math.max(1, Math.min(s.row_columns || 3, g.items.length))) + ',minmax(0,1fr))">' +
          g.items.map((x) => (x._act ? actEl(s, x, 'row') : entEl(x, 'row'))).join('') + '</div>';
        return g.items.map((x) => {
          if (x._k === 'scene') return sceneBtn(s, x, x._i);
          if (x._k === 'ebtn') return entEl(x, 'button');
          if (x._k === 'halo') {
            const hc = { type: 'custom:lemur-hd-sensor-card', entity: x.entity };
            if (x.name) hc.name = x.name;
            if (x.icon && !lpIsLecIcon(x.icon)) hc.icon = x.icon;
            const hcol = lpMapColor(x, S) || x.color;                       // sabit renk ya da duruma göre renk
            if (hcol) hc.color = LP_HALO_RGB[hcol] || hcol;
            return emb('lemur-hd-sensor-card', hc, x.entity, x._i, x);
          }
          if (x._k === 'card') { cards.push(x); return '<div class="emb hc' + (LP_EMB_H[x.height] ? ' hfix" style="min-height:' + LP_EMB_H[x.height] + 'px' : '') + '" data-hc="' + (cards.length - 1) + '"' + hidA(x) + mark(x._i) + '></div>'; }
          if (x._k === 'sub') return '<div class="subt"' + hidA(x) + mark(x._i) + '>' + esc(x.subtitle) + '</div>';
          const c = Object.assign({}, x); delete c._i; delete c._k; delete c._val; delete c._hid; delete c._act;
          if (x._k === 'climate') return emb('lemur-hd-climate-card', Object.assign(c, { type: 'custom:lemur-hd-climate-card' }), x.entity, x._i);
          if (x._k === 'vacuum') return emb('lemur-hd-vacuum-card', Object.assign(c, { type: 'custom:lemur-hd-vacuum-card' }), x.entity, x._i);
          rows.push(x.entity); return '<div class="row" data-row="' + esc(x.entity) + '"' + hidA(x) + mark(x._i) + '></div>';
        }).join('');
      }).join('');
      // başlık biçimi: karo ya da düğmeyle başlayan bölüm büyük başlık, kartla başlayan küçük başlık
      const first = groups[0].k;
      // kare karolu (gsq) kutu da içeriğinden kısa olamaz (alttaki karo kesilmez)
      return { kind: first === 'tile' || first === 'scene' ? 'md' : 'hd', spread: !hasTiles, mix: hasTiles && !onlyTiles, season: both, html: html, fit: html.indexOf('class="gsq"') >= 0 };
    };

    // Her bölüm bir kutu. Yerleşim: kolonlar (genişlik oranı) ve her kolonun içinde 1-3 eşit sütun (tab.splits). Bölümün yeri: col + sub.
    // Düzenleme modunda boş bölüm de bir kutu olarak görünür (içine sürüklenebilsin diye).
    const widths = lpWeights(tab), splits = lpSplits(tab, widths.length);
    const cols = widths.map((w, i) => { const a = []; for (let j = 0; j < splits[i]; j++) a.push([]); return a; });
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0)), sj = Math.max(0, Math.min(splits[ci] - 1, s.sub || 0));
      curSec = s.id;
      let b = bodyOf(s);
      if (!b && edit) b = { kind: 'md', html: '<div class="eph" data-sec="' + esc(s.id) + '">' + esc(t(lang, 'edit_empty')) + '</div>' };
      if (!b) return;
      cols[ci][sj].push({ title: s.title || '', kind: b.kind, season: !!b.season, spread: b.spread, mix: b.mix, fit: !!b.fit, html: b.html, secs: [s.id], grow: parseFloat(s.grow) > 0 ? parseFloat(s.grow) : 1, gap: typeof s.gap === 'number' ? s.gap : null,
        fill: !!s.fill, align: !s.fill && (s.align === 'center' || s.align === 'spread') ? s.align : '' });   // doldururken hizalama yok (aralık kaybolmasın)
    });
    const used = [];
    cols.forEach((c, i) => { if (edit || c.some((x) => x.length)) used.push(i); });   // düzenlemede boş kolon da görünür

    // Lemur Light Effect Card kuruluysa üst şeridin sonunda "Efektler": efekt ekranını bu sekmenin odasıyla açar (ayarlardan kapatılabilir)
    const navFx = lpLecNav(h) ? '<div class="navb fxb" data-navfx><div class="ni">' + lpIcon('mdi:creation') + '</div><div class="nn">' + esc(t(lang, 'effects')) + '</div></div>' : '';
    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni">' + lpIcon(x.icon || 'mdi:home-outline') + '</div><div class="nn">' + esc(x.name) + '</div></div>').join('') +
      navFx + '<div class="clock">' + this._time() + '</div></div>';
    const seasonIcon = lpIcon(season === 'winter' ? 'mdi:snowflake' : 'mdi:white-balance-sunny', 'season');
    // aynı sütunda birden çok kutu varsa yükseklikler "grow" oranında paylaşılır (düzenlemede aradaki çizgi sürüklenerek değişir)
    // fill: öğeler kutunun yüksekliğini doldurur; align: içeriğe göre olan kutuda öğeler ortada ya da eşit aralıkla
    const boxHtml = (b, multi) => '<div class="box' + (b.spread ? ' spread' : '') + (b.mix ? ' mix' : '') + (b.fit ? ' fit' : '') + (b.fill ? ' fill' : '') + (b.align ? ' al-' + b.align : '') + (edit && b.secs.indexOf(selected) >= 0 ? ' selbox' : '') + '" data-secs="' + esc(b.secs.join(',')) + '"' +
      (multi || b.gap !== null ? ' style="' + (multi ? 'flex:' + b.grow + ' 1 0px;min-height:auto;' : '') + (b.gap !== null ? '--lp-gap:' + b.gap + 'px;--lp-gapg:' + b.gap + 'px' : '') + '"' : '') + '>' +
      (edit ? '<div class="bgrip" title="' + esc(t(lang, 'drag_box')) + '"><ha-icon icon="mdi:drag"></ha-icon></div>' : '') +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    const subHtml = (i, j, boxes) => '<div class="sub" data-col="' + i + '" data-sub="' + j + '">' +
      (boxes.length ? boxes.map((b) => boxHtml(b, boxes.length > 1)).join('')
        : '<div class="box colempty"><span>' + esc(t(lang, 'col_empty')) + '</span><button class="addsec" data-addsec="' + i + ':' + j + '">+ ' + esc(t(lang, 'add_section')) + '</button></div>') + '</div>';
    let grid, body;
    if (phone) {
      // telefon: kolonlar soldan sağa, sütunlar sırayla alt alta; boş sütun yer kaplamaz
      grid = '';
      const bx = [];
      cols.forEach((c) => c.forEach((boxes) => boxes.forEach((b) => bx.push(b))));
      body = '<div class="pcol">' + (bx.length ? bx.map((b) => boxHtml(b, false)).join('') : '<div class="box empty">' + esc(t(lang, 'empty')) + '</div>') + '</div>';
    } else if (used.length) {
      // kolon genişlikleri oran (fr): kolon sayısı ne olursa olsun ekrana sığar, aralıklar taşırmaz
      grid = 'grid-template-columns:' + used.map((i) => 'minmax(0,' + widths[i] + 'fr)').join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => {
        // normal panoda boş sütun yer kaplamaz; düzenlemede görünür
        const subs = cols[i].map((boxes, j) => ({ j: j, boxes: boxes })).filter((x) => edit || x.boxes.length);
        return '<div class="col" data-col="' + i + '" style="grid-area:c' + i + '"><div class="subs" style="grid-template-columns:repeat(' + subs.length + ',minmax(0,1fr))">' +
          subs.map((x) => subHtml(i, x.j, x.boxes)).join('') + '</div></div>';
      }).join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="subs"><div class="sub"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div></div></div>';
    }
    const R = this.shadowRoot;
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap ic-' + lpIconMode() + (lpIconTintLight() ? ' ic-lightc' : '') + (edit ? ' edit' : '') + (phone ? ' phone' : '') + '" style="' + grid + ';--lp-ic-on:' + lpIconTint() + '">' + nav + body + '</div>';

    // gömülü kartlar
    this._embeds = [];
    R.querySelectorAll('[data-emb]').forEach((ph) => {
      const spec = embeds[+ph.getAttribute('data-emb')];
      const el = document.createElement(spec.tag);
      try { el.setConfig(spec.cfg); } catch (e) { ph.textContent = String((e && e.message) || e); return; }
      el.hass = h;
      ph.appendChild(el);
      this._embeds.push(el);
      if (spec.it) ph._item = spec.it;
      if (spec.it && spec.tag === 'lemur-hd-sensor-card' && el.shadowRoot) { const st = document.createElement('style'); st.textContent = lpHaloStyle(spec.it); el.shadowRoot.appendChild(st); }
    });
    // gömülü HA kartları (HA'nın kart yardımcısıyla; yüklenemezse kısa uyarı)
    R.querySelectorAll('[data-hc]').forEach((ph) => {
      const ci = cards[+ph.getAttribute('data-hc')];
      ph._item = ci;
      lpMountCard(ph, ci.card, () => this._hass, lang, (el) => { if (ph.isConnected && this._embeds) this._embeds.push(el); });
    });
    this._txEls = Array.prototype.slice.call(R.querySelectorAll('[data-tx]'));
    this._ssEls = []; R.querySelectorAll('[data-ss]').forEach((el) => { el._item = ssItems[+el.getAttribute('data-ss')]; this._ssEls.push(el); });
    this._pets = []; R.querySelectorAll('[data-pet]').forEach((el) => this._pets.push(el));
    this._ents = []; R.querySelectorAll('[data-ent]').forEach((el) => { el._item = ents[+el.getAttribute('data-ei')]; this._ents.push(el); });
    this._vals = []; R.querySelectorAll('[data-val]').forEach((el) => { el._item = vals[+el.getAttribute('data-vi')]; el._bar = el.classList.contains('bar'); el._wide = el.hasAttribute('data-wide'); this._vals.push(el); });
    this._tiles = []; R.querySelectorAll('[data-light]').forEach((el) => { el._item = tileItems[+el.getAttribute('data-ti')]; el._bar = el.classList.contains('bar'); el._wide = el.hasAttribute('data-wide'); this._tiles.push(el); });
    this._rows = []; R.querySelectorAll('[data-row]').forEach((el) => this._rows.push(el));
    // LEC: karoların odaları da sorulur; efekt düğmesi olan odaların ışıkları izlenir (değişince oynayan efekt yeniden sorulur)
    tiles.forEach((id) => { const r = LEC.roomOf(id); if (r) lecRooms[r] = 1; });
    this._lecRooms = Object.keys(lecRooms).filter((r) => LEC.hasRoom(r));
    const lecLights = [];
    this._lecRooms.forEach((r) => LEC.lightsOf(r).forEach((id) => { if (tiles.indexOf(id) < 0 && lecLights.indexOf(id) < 0) lecLights.push(id); }));
    this._watched = tiles.concat(rows, lecLights, vals.concat(ents, ssItems).map((x) => x.entity).filter((x) => x && tiles.indexOf(x) < 0), visW);
    if (!edit && LEC.installed(h)) this._lecRooms.forEach((r) => LEC.query(h, r));
    this._last = {};
    this._lang = lang;

    // düzenleme modu (yönetim panelindeki önizleme): cihazlara dokunulmaz; tıklama seçer, sürükleme taşır, çizgiler boyutlandırır
    if (edit) { this._editBind(R, tab, widths, used); return; }
    // dokunuşlar
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      const base = location.pathname.split('/').slice(0, 2).join('/');
      // pano açıkken eklenen sekmenin HA'da henüz görünümü yok: sayfa baştan yüklenir, pano yeniden üretilir
      if (window.__LHD_VIEWS && window.__LHD_VIEWS.indexOf(id) < 0) { location.assign(base + '/' + id); return; }
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => lpFire(this, 'hass-more-info', { entityId: id });
    this._tiles.forEach((b) => {
      const id = b.getAttribute('data-light');
      // basılı tut: varsayılan bizim ışık penceremiz; ayarda seçildiyse HA'nın penceresi ya da LEC'in efekt ekranı (lambanın odasıyla)
      const hold = () => {
        const mode = lpHoldMode(), h = this._hass, d = id.split('.')[0];
        if (mode === 'lec' && LEC.installed(h) && LEC.open(h, LEC.roomOf(id) || tab.area)) return;
        if (mode !== 'ha' && (d === 'light' || d === 'switch' || d === 'input_boolean')) { LemurLightPopup.open(h, id, b._item, LEC.roomOf(id) || tab.area); return; }
        more(id);
      };
      const it = b._item || {};
      const tap0 = () => this._act(it.tap, id, 'toggle');
      const tap = () => this._confirm(it, tap0);
      const hold2 = it.hold ? () => this._act(it.hold, id) : hold;   // öğede tap/hold verildiyse o
      if (!b._bar) { lpPress(b, tap, hold2); return; }
      lpSlide(b, {
        tap: tap, hold: hold2,
        can: () => lpBarCan(this._hass.states[id]),
        start: () => { const st = this._hass.states[id]; return b._settle && Date.now() < b._settle.until ? b._settle.v : (st ? lpBarVal(st) : 0); },
        move: (v) => { b._drag = true; b._dv = v; this._paintBar(b, this._hass.states[id], v); },
        end: () => {
          b._drag = false; const v = b._dv;
          if (typeof v !== 'number') return;
          // gönderilen değer, cihazın yeni durumu gelene kadar (en çok 3 sn) çubukta kalır; geri zıplamaz
          b._settle = { v: v, until: Date.now() + 3000 };
          lpBarSet(this._hass, id, v);
          setTimeout(() => { if (!b._drag) this._paintBar(b, this._hass.states[id]); }, 3100);
        }
      });
    });
    this._rows.forEach((b) => lpPress(b, () => more(b.getAttribute('data-row'))));
    // düğme / satır görünümündeki varlık: değer öğesinde cihaz penceresi, diğerlerinde aç/kapat (öğenin tap/hold'u önce gelir)
    this._ents.forEach((b) => {
      const id = b.getAttribute('data-ent'), it = b._item || {}, d = id.split('.')[0];
      const holdDef = () => { const hm = lpHoldMode(); if (!it._val && hm !== 'ha' && (d === 'light' || d === 'switch' || d === 'input_boolean')) LemurLightPopup.open(this._hass, id, it, LEC.roomOf(id) || tab.area); else more(id); };
      lpPress(b, () => this._confirm(it, () => this._act(it.tap, id, it._val ? 'more-info' : 'toggle')), it.hold ? () => this._act(it.hold, id) : holdDef);
    });
    // besleme kartı: dokun "Besledim" (10 sn içinde yeniden dokununca geri alınır), basılı tut son beslemeler
    this._pets.forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-pet'), now = Date.now();
      if (!STORE.data || !(STORE.data.pets || {})[id]) return;
      if (b._fedAt && now - b._fedAt < 10000) { b._fedAt = 0; b._pk = null; lpPetPaint(b, lang, now); STORE.feed(id, true); return; }
      b._fedAt = now; b._pk = null; lpPetPaint(b, lang, now); STORE.feed(id, false);
      setTimeout(() => { b._pk = null; lpPetPaint(b, this._lang, Date.now()); }, 10100);
    }, () => lpPetHistory(this._hass, this._lang, b.getAttribute('data-pet'))));
    // gömülü kart (kart öğesi ya da Halo görünümü): öğede tap/hold verildiyse kartın üstüne şeffaf katman, kartın kendi tıklaması yerine o çalışır
    R.querySelectorAll('[data-hc],[data-emb]').forEach((ph) => {
      const it = ph._item; if (!it || (!it.tap && !it.hold)) return;
      const ov = document.createElement('div'); ov.className = 'tapov'; ph.appendChild(ov);
      const id = it.entity || (it.card && it.card.entity) || '';
      lpPress(ov, () => this._act(it.tap, id, 'more-info'), () => this._act(it.hold, id, 'more-info'));
    });
    // değer karosu: dokun → öğenin tap'i (varsayılan cihaz penceresi), basılı tut → hold'u (varsayılan cihaz penceresi)
    this._vals.forEach((b) => { const id = b.getAttribute('data-val'), it = b._item || {}; lpPress(b, () => this._confirm(it, () => this._act(it.tap, id, 'more-info')), () => this._act(it.hold, id, 'more-info')); });
    const sceneItem = (b) => { const p = b.getAttribute('data-scene').split(':'), s = (tab.sections || []).filter((x) => x.id === p[0])[0]; const it = s && s.entities && s.entities[+p[1]]; return typeof it === 'string' ? { entity: it } : it; };
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => this._confirm(sceneItem(b), () => {
      const it = sceneItem(b);
      if (it && it.tap) { this._act(it.tap, it.entity); return; }   // öğede dokunma eylemi verildiyse o
      if (it && it.entity && !it.action) {   // düğme olarak eklenmiş betik, sahne, otomasyon, buton
        const d = it.entity.split('.')[0];
        const sv = d === 'automation' ? 'trigger' : (d === 'button' || d === 'input_button') ? 'press' : 'turn_on';
        this._hass.callService(d, sv, { entity_id: it.entity }); return;
      }
      if (!it || !it.action) return;
      if (!it.action.service) { this._act(it.action, it.entity); return; }   // pencerede kart aç, HA biçimli eylem...
      const lk = lpLecKind(it);
      if (lk === 'open') { LEC.open(this._hass, it.action.room || tab.area); return; }
      if (lk) { LEC.run(this._hass, it.action); return; }
      const sv = it.action.service.split('.');
      this._hass.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }), (() => { const it0 = sceneItem(b); return it0 && it0.hold ? () => this._act(it0.hold, it0.entity) : null; })()));
    R.querySelectorAll('[data-season]').forEach((b) => lpPress(b, () => STORE.season(lpSeason() === 'winter' ? 'summer' : 'winter')));
    R.querySelectorAll('[data-navfx]').forEach((b) => lpPress(b, () => LEC.open(this._hass, tab.area)));
  }

  // --- düzenleme modu: tıkla seç, sürükle taşı, çizgiden boyutlandır ---
  // Kart değişikliği kendisi kaydetmez; yeni sekme ayarını 'lhd-change' ile yönetim paneline verir, panel kaydeder.
  _editBind(R, tab, widths, used) {
    const wrap = R.querySelector('.wrap');
    const clone = () => JSON.parse(JSON.stringify(tab));
    const emit = (nt) => lpFire(this, 'lhd-change', { tab: nt });
    const zoom = () => { const r = this.getBoundingClientRect(); return (r.width && this.offsetWidth) ? r.width / this.offsetWidth : 1; };
    const secById = (T, id) => (T.sections || []).filter((x) => x.id === id)[0];
    const listOf = (s) => (s.entities = s.entities || []);
    // bölümler serbest: her öğe her bölüme taşınabilir
    const typeOf = (id) => (secById(tab, id) ? 'any' : '');
    const r2 = (x) => Math.round(x * 100) / 100;
    const arr = (x) => Array.prototype.slice.call(x);
    R.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => lpFire(this, 'lhd-tab', { tab: b.getAttribute('data-nav') })));

    let D = null;   // süren sürükleme
    // boyutlandırma tutamakları: kolonların arasında dikey, aynı kolonda üst üste duran kutuların arasında yatay
    const place = () => {
      if (!wrap.isConnected || D) return;
      if (wrap.classList.contains('phone')) return;   // telefonda kolon/satır boyutlandırma yok
      // sığmayan kutuyu işaretle
      arr(R.querySelectorAll('.box[data-secs]')).forEach((b) => {
        const over = b.scrollHeight > b.clientHeight + 2 || b.scrollWidth > b.clientWidth + 2;
        b.classList.toggle('over', over);
        if (over) b.setAttribute('data-over', t(this._lang || 'tr', 'too_full')); else b.removeAttribute('data-over');
      });
      arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => x.remove());
      const cols = arr(R.querySelectorAll('.col[data-col]'));
      for (let k = 0; k < cols.length - 1; k++) {
        const a = cols[k], b = cols[k + 1], hd = document.createElement('div');
        hd.className = 'colh'; hd.setAttribute('data-k', k);
        hd.style.left = ((a.offsetLeft + a.offsetWidth + b.offsetLeft) / 2 - 7) + 'px';
        hd.style.top = a.offsetTop + 'px'; hd.style.height = a.offsetHeight + 'px';
        wrap.appendChild(hd);
      }
      arr(R.querySelectorAll('.sub[data-sub]')).forEach((c) => {
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs'));
        for (let j = 0; j < bx.length - 1; j++) {
          const hd = document.createElement('div');
          hd.className = 'rowh'; hd.setAttribute('data-col', c.getAttribute('data-col')); hd.setAttribute('data-sub', c.getAttribute('data-sub')); hd.setAttribute('data-j', j);
          hd.style.left = c.offsetLeft + 'px'; hd.style.width = c.offsetWidth + 'px';
          hd.style.top = ((bx[j].offsetTop + bx[j].offsetHeight + bx[j + 1].offsetTop) / 2 - 7) + 'px';
          wrap.appendChild(hd);
        }
      });
    };
    requestAnimationFrame(place); setTimeout(place, 400); setTimeout(place, 1500);

    const clearMarks = () => arr(R.querySelectorAll('.dropl,.dropr,.dropt,.dropd,.dropin')).forEach((x) => x.classList.remove('dropl', 'dropr', 'dropt', 'dropd', 'dropin'));
    const line = (left, top, width) => {
      let ln = R.querySelector('.dropline');
      if (!ln) { ln = document.createElement('div'); ln.className = 'dropline'; wrap.appendChild(ln); }
      ln.style.left = left + 'px'; ln.style.top = top + 'px'; ln.style.width = width + 'px';
    };
    // bırakma hedefi: işaretçinin altındaki (ya da en yakın) sütun
    const colAt = (x) => {
      const cols = arr(R.querySelectorAll('.sub[data-sub]'));
      let best = null, bd = 1e9;
      cols.forEach((c) => { const r = c.getBoundingClientRect(); const d = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0); if (d < bd) { bd = d; best = c; } });
      return best;
    };

    const down = (e) => {
      if (e.button !== 0) return;
      const tg = e.target;
      const ch = tg.closest('.colh'), rh = tg.closest('.rowh');
      const item = !ch && !rh ? tg.closest('[data-idx]') : null;
      const box = !ch && !rh && !item ? tg.closest('.box[data-secs]') : null;
      if (!ch && !rh && !item && !box) return;
      D = { kind: ch ? 'col' : rh ? 'row' : item ? 'item' : 'box', el: ch || rh || item || box, sx: e.clientX, sy: e.clientY, on: false, z: zoom() };
      if (ch) {
        const k = +ch.getAttribute('data-k'), cols = arr(R.querySelectorAll('.col[data-col]'));
        D.a = used[k]; D.b = used[k + 1]; D.pa = cols[k].offsetWidth; D.pb = cols[k + 1].offsetWidth; D.W = widths.slice();
      }
      if (rh) {
        const c = R.querySelector('.sub[data-col="' + rh.getAttribute('data-col') + '"][data-sub="' + rh.getAttribute('data-sub') + '"]'), j = +rh.getAttribute('data-j');
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs'));
        D.A = bx[j]; D.B = bx[j + 1]; D.ha = D.A.offsetHeight; D.hb = D.B.offsetHeight;
        D.ga = parseFloat(D.A.style.flexGrow) || 1; D.gb = parseFloat(D.B.style.flexGrow) || 1;
      }
      e.preventDefault();
    };
    const move = (e) => {
      if (!D) return;
      const dx = (e.clientX - D.sx) / D.z, dy = (e.clientY - D.sy) / D.z;
      if (!D.on) {
        if (Math.abs(e.clientX - D.sx) + Math.abs(e.clientY - D.sy) < 6) return;
        D.on = true;
        if (D.kind === 'box' || D.kind === 'item') D.el.classList.add('dragging');
        if (D.kind === 'col' || D.kind === 'row') arr(R.querySelectorAll('.colh,.rowh')).forEach((x) => { if (x !== D.el) x.style.display = 'none'; });
      }
      if (D.kind === 'col') {
        // kolon, içindeki sütun sayısı kadar daralabilir: her sütun en dar kanvasta (W, genelde 1280) en az 150 px.
        // Sınır oran olarak hesaplanır; önizleme ya da ekran daha geniş olsa da dar tablette sütun ezilmez.
        const spl = lpSplits(tab, widths.length), n = widths.length;
        const cw = ((STORE.data && STORE.data.settings && STORE.data.settings.canvas) || {}).width || 1280;
        const k = (wrap.offsetWidth - 8 - 20 * n) / (cw - 8 - 20 * n);
        const ma = spl[D.a] * 150 * Math.max(1, k), mb = spl[D.b] * 150 * Math.max(1, k);
        const tot = D.pa + D.pb, na = Math.max(ma, Math.min(tot - mb, D.pa + dx));
        const sum = widths[D.a] + widths[D.b];
        D.W[D.a] = r2(sum * na / tot); D.W[D.b] = r2(sum - D.W[D.a]);
        wrap.style.gridTemplateColumns = used.map((i) => 'minmax(0,' + D.W[i] + 'fr)').join(' ');
        D.el.style.left = (parseFloat(D.el.style.left) + (e.clientX - (D.lx || D.sx)) / D.z) + 'px'; D.lx = e.clientX;
        return;
      }
      if (D.kind === 'row') {
        const tot = D.ha + D.hb, nh = Math.max(100, Math.min(tot - 100, D.ha + dy)), sum = D.ga + D.gb;
        D.na = r2(sum * nh / tot); D.nb = r2(sum - D.na);
        D.A.style.flexGrow = D.na; D.B.style.flexGrow = D.nb;
        D.el.style.top = (parseFloat(D.el.style.top) + (e.clientY - (D.ly || D.sy)) / D.z) + 'px'; D.ly = e.clientY;
        return;
      }
      if (D.kind === 'box') {
        const c = colAt(e.clientX); if (!c) return;
        const bx = arr(c.children).filter((x) => x.hasAttribute('data-secs') && x !== D.el);
        let before = null;
        for (let i = 0; i < bx.length; i++) { const r = bx[i].getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { before = bx[i]; break; } }
        const last = bx[bx.length - 1];
        const top = before ? before.offsetTop - 8 : (last ? last.offsetTop + last.offsetHeight + 4 : c.offsetTop + 8);
        line(c.offsetLeft, top, c.offsetWidth);
        D.target = { col: +c.getAttribute('data-col'), sub: +c.getAttribute('data-sub'), before: before ? before.getAttribute('data-secs').split(',')[0] : null };
        return;
      }
      if (D.kind === 'item') {
        clearMarks(); D.target = null;
        const under = R.elementFromPoint ? R.elementFromPoint(e.clientX, e.clientY) : null; if (!under) return;
        const srcType = typeOf(D.el.getAttribute('data-sec'));
        const it = under.closest ? under.closest('[data-idx]') : null;
        if (it && it !== D.el && typeOf(it.getAttribute('data-sec')) === srcType) {
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile') || it.classList.contains('bar');
          const after = horiz ? e.clientX > r.left + r.width / 2 : e.clientY > r.top + r.height / 2;
          it.classList.add(horiz ? (after ? 'dropr' : 'dropl') : (after ? 'dropd' : 'dropt'));
          D.target = { sec: it.getAttribute('data-sec'), idx: +it.getAttribute('data-idx') + (after ? 1 : 0) };
          return;
        }
        // öğenin üstünde değil: aynı türden bir bölümün kutusuna bırakılırsa sona eklenir
        const bx = under.closest ? under.closest('.box[data-secs]') : null;
        if (bx) {
          const sid = bx.getAttribute('data-secs').split(',').filter((id) => typeOf(id) === srcType)[0];
          if (sid) { bx.classList.add('dropin'); const s = secById(tab, sid); D.target = { sec: sid, idx: listOf(JSON.parse(JSON.stringify(s))).length }; }
        }
      }
    };
    const up = () => {
      if (!D) return;
      const d = D; D = null;
      clearMarks();
      const ln = R.querySelector('.dropline'); if (ln) ln.remove();
      if (d.el) d.el.classList.remove('dragging');
      if (!d.on) return;   // sürüklenmedi: tıklama olarak kalır
      this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
      if (d.kind === 'col') { const nt = clone(); nt.columns = d.W; return emit(nt); }
      if (d.kind === 'row') {
        if (d.na === undefined) return;
        const nt = clone();
        const ha = secById(nt, d.A.getAttribute('data-secs').split(',')[0]), hb = secById(nt, d.B.getAttribute('data-secs').split(',')[0]);
        if (ha) ha.grow = d.na; if (hb) hb.grow = d.nb;
        return emit(nt);
      }
      if (d.kind === 'box' && d.target) {
        const nt = clone(), group = d.el.getAttribute('data-secs').split(',');
        const moving = nt.sections.filter((s) => group.indexOf(s.id) >= 0), rest = nt.sections.filter((s) => group.indexOf(s.id) < 0);
        const spl = lpSplits(nt, lpWeights(nt).length);
        const subOf = (x) => Math.min(x.sub || 0, (spl[x.col || 0] || 1) - 1);
        moving.forEach((x) => { x.col = d.target.col; if (d.target.sub) x.sub = d.target.sub; else delete x.sub; });
        let at = rest.length;
        if (d.target.before) at = rest.map((x) => x.id).indexOf(d.target.before);
        else { for (let i = rest.length - 1; i >= 0; i--) if ((rest[i].col || 0) === d.target.col && subOf(rest[i]) === d.target.sub) { at = i + 1; break; } }
        if (at < 0) at = rest.length;
        nt.sections = rest.slice(0, at).concat(moving, rest.slice(at));
        if (JSON.stringify(nt.sections) !== JSON.stringify(tab.sections)) emit(nt);
        return;
      }
      if (d.kind === 'item' && d.target) {
        const nt = clone(), sid = d.el.getAttribute('data-sec'), si = +d.el.getAttribute('data-idx');
        const src = secById(nt, sid), dst = secById(nt, d.target.sec);
        if (!src || !dst) return;
        let di = d.target.idx;
        if (src === dst && si < di) di--;
        if (src === dst && si === di) return;
        const obj = listOf(src).splice(si, 1)[0];
        listOf(dst).splice(di, 0, obj);
        emit(nt);
      }
    };
    if (this._edDown && this._edWrap) this._edWrap.removeEventListener('pointerdown', this._edDown);
    if (this._edMove) { window.removeEventListener('pointermove', this._edMove); window.removeEventListener('pointerup', this._edUp); window.removeEventListener('pointercancel', this._edUp); }
    this._edWrap = wrap; this._edDown = down; this._edMove = move; this._edUp = up;
    wrap.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    if (window.ResizeObserver) { if (this._edRO) this._edRO.disconnect(); this._edRO = new ResizeObserver(() => { if (!D) place(); }); this._edRO.observe(wrap); }

    // tıklama: bölümü seç (sürüklemeden sonra gelen tıklama sayılmaz); boş sütundaki "+ Bölüm ekle" panelin menüsünü açar
    wrap.addEventListener('click', (e) => {
      if (this._dragged) return;
      const ad = e.target.closest ? e.target.closest('[data-addsec]') : null;
      if (ad) { const p = ad.getAttribute('data-addsec').split(':'); return lpFire(this, 'lhd-addsec', { col: +p[0], sub: +p[1], x: e.clientX, y: e.clientY }); }
      const bx = e.target.closest ? e.target.closest('.box[data-secs]') : null; if (!bx) return;
      const hit = e.target.closest('[data-sec]');
      lpFire(this, 'lhd-select', { section: hit ? hit.getAttribute('data-sec') : bx.getAttribute('data-secs').split(',')[0] });
    });
  }

  // kaydırmalı çubuğu çiz: dolgu değer kadar (ışığın renginde), simge renkli, altta yüzde ya da durum.
  // v verilirse (kaydırırken) o değer gösterilir; yoksa cihazın durumu (gönderilen değer yerleşene kadar o).
  _paintBar(el, st, v, fx) {
    if (!st) return;
    const a = st.attributes, it = el._item || {}, d = st.entity_id.split('.')[0], lang = this._lang;
    if (typeof v !== 'number') {
      v = lpBarVal(st);
      if (el._settle) { if (Date.now() < el._settle.until && Math.abs(el._settle.v - v) > 1) v = el._settle.v; else el._settle = null; }
    }
    if (fx === undefined) fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(st.entity_id)]) : null);
    const on = v > 0 || LP_ON.indexOf(st.state) >= 0, na = st.state === 'unavailable' || st.state === 'unknown';
    const rgb = a.rgb_color && a.rgb_color[0] + a.rgb_color[1] + a.rgb_color[2] >= 12 ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
    el.className = 'bar' + (on && !na ? ' on' : '') + (na ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '') + (el._drag ? ' drag' : '') + (el._fb ? ' fbk' : '');
    el.style.setProperty('--bar-c', fx ? fx.c[0] : (d === 'light' && rgb ? rgb : LP_BAR_COLOR));
    el.style.setProperty('--p', (na ? 0 : v) + '%');
    if (on && !na && !fx && d === 'light' && rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
    const ic = this._icSwap(el, st, it, 1), nm = el.querySelector('.nm'), pc = el.querySelector('.pc');
    nm.textContent = this._tx(it.name) || a.friendly_name || st.entity_id;
    let txt;
    if (na) txt = t(lang, 'unavailable');
    else if (lpBarCan(st) && (on || d === 'cover')) txt = v + '%';
    else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
    pc.textContent = txt;
  }

  // karo / çubuk simgesi (span.lic.mdic): öğenin simgesi, varlığın HA'daki simgesi ya da durumuna göre varsayılan, hepsi setten.
  // Durum değişince (kapı açıldı, priz kapandı) simge de değişir. Set yüklenmediyse boş kalır. i: simgenin öğedeki sırası.
  // own: öğenin istediği simge (verilmezse it.icon; değer karosunda duruma göre icon_on/icon_off).
  // Açıkça verilen simgenin sette karşılığı yoksa HA'nın düz simgesi (ha-icon) çizilir; ampul ya da noktaya dönmez.
  _icSwap(el, st, it, i, own, mono) {
    if (own === undefined) own = it.icon;
    const old = el.children[i];
    if (!old) return old;
    if (lpIsLecIcon(own)) {
      if (old.getAttribute('data-n') === own) return old;
      const tmp = document.createElement('div'); tmp.innerHTML = lpIcon(own);
      const x = tmp.firstChild; x.setAttribute('data-n', own); el.replaceChild(x, old); return x;
    }
    if (!LP_MDIC.map) { lpMdicLoad(); return old; }
    if (own && lpIconFlat(own)) {
      if (old.getAttribute('data-n') !== 'ha:' + own) { old.setAttribute('data-n', 'ha:' + own); old.className = 'lic haic'; old.innerHTML = '<ha-icon icon="' + esc(own) + '"></ha-icon>'; }
      return old;
    }
    const k = lpMdicKey(lpEntIcon(st, own)) || lpMdicKey(lpStateIconName(st)) || LP_MDIC_FALLBACK;
    // renk verilmiş öğede simge tek renk (currentColor) çizilir, rengi CSS'ten (--ic)
    const key = mono ? k + '#m' : k;
    if (old.getAttribute('data-n') !== key) { old.setAttribute('data-n', key); old.className = 'lic mdic'; old.innerHTML = mono ? lpMono(k) : lpMdicGet(k); }
    return old;
  }
  // öğenin renkleri: simge rengi (color), açıkken renk (color_on), eşiğe göre renk (zones), arka plan tonu (bg). Simge tek renge geçerse true
  _colorize(el, it, st, on) {
    const mc = lpMapColor(it, this._hass.states), z0 = lpZone(it, st) || mc, z = z0 ? (LP_HALO_RGB[z0] || z0) : null;
    const col = z || (on && it.color_on) || (LP_HALO_RGB[it.color] || it.color) || '';
    if (col) el.style.setProperty('--ic', col); else el.style.removeProperty('--ic');
    if (col) el.classList.add('icc');
    if (z) { el.style.setProperty('--tile-rgb', z); el.classList.add('zc'); }
    else if (on && it.color_on) el.style.setProperty('--tile-rgb', it.color_on);
    if (it.bg) el.style.setProperty('background-color', lpHexA(it.bg, 0.22));
    return !!col;
  }

  // A7 onay: öğede confirm verildiyse ("Evi Kapa" gibi) dokununca önce sorulur
  _confirm(it, fn) {
    if (!it || !it.confirm) return fn();
    const st = it.entity ? this._hass.states[it.entity] : null;
    const name = this._tx(it.name) || (st && st.attributes.friendly_name) || it.entity || '';
    LemurCardPopup.confirm(this._hass, this._lang, typeof it.confirm === 'string' ? this._tx(it.confirm) : lpCardT(this._lang, 'ask', { n: name }), fn);
  }
  // A6 şablon metin: {{ }} / {% %} içeren yazı Home Assistant'ta çözülür (render_template), sonuç gelince yeniden çizilir
  _tx(s) {
    if (!lpIsTpl(s)) return s || '';
    if (!this._tplCb) this._tplCb = () => { if (this._tplT) return; this._tplT = setTimeout(() => { this._tplT = null; this._repaint(); }, 60); };
    const v = lpTpl(this._hass, s, this._tplCb);
    return v === null ? '…' : v;
  }
  // aç/kapat dokunuşu: karoyu hemen beklenen durumda çiz, süre dolunca gerçeğe göre yeniden çiz
  _optTap(id) {
    if (!lpOptToggle(this._hass, id) || !this._sig) return;
    delete this._last[id]; this._update();
    setTimeout(() => { if (this._sig && this._hass) { delete this._last[id]; this._update(); } }, LP_OPT_MS + 100);
  }
  _repaint() {
    if (!this._hass || !this._sig) return;
    this._last = {};
    [this._vals, this._ents].forEach((L) => (L || []).forEach((el) => el.removeAttribute('data-p')));
    this._update();
  }
  // A5 ikinci satır: 'state' durum, 'last_changed' son değişim, 'attr:ad' öznitelik, ya da şablon metin
  _sec2(it, st) {
    const s = it && it.secondary; if (!s) return null;
    if (s === 'last_changed') this._hasAgo = true;
    if (s === 'state') return st ? lpValText(this._hass, st, this._lang) : '';
    if (s === 'last_changed') { if (!st) return ''; const ms = Date.now() - Date.parse(st.last_changed); return ms < 60000 ? lpPetT(this._lang, 'now') : lpPetT(this._lang, 'ago', { t: lpPetDur(this._lang, ms) }); }
    if (s.indexOf('attr:') === 0) {
      const k = s.slice(5), v = st && st.attributes ? st.attributes[k] : undefined;
      if (v === undefined || v === null) return '';
      if (this._hass.formatEntityAttributeValue) { try { return String(this._hass.formatEntityAttributeValue(st, k)); } catch (e) {} }
      return String(v);
    }
    return this._tx(s);
  }

  // Öğe eylemi (dokun / basılı tut / düğme). a:
  //   'more-info' | 'toggle' | 'none'                     cihaz penceresi, aç/kapat, hiçbir şey
  //   { service: 'timer.start', target, data }            servis çalıştır (target: varlık kimliği, liste ya da { entity_id })
  //   { popup: { title, card } }                          kartı panonun kendi penceresinde aç
  //   { action: 'more-info' | 'toggle' | 'navigate' | 'perform-action', ... }   HA'nın kart biçimi de olur
  // a yoksa def (varsayılan) yapılır. id: öğenin varlığı
  _act(a, id, def) {
    const h = this._hass;
    if (a === undefined || a === null || a === '') a = def;
    if (!a) return;
    if (typeof a === 'string') {
      if (a === 'more-info') { if (id) lpFire(this, 'hass-more-info', { entityId: id }); return; }
      if (a === 'toggle') {
        if (!id) return;
        this._optTap(id);
        // yedek kontrolü olan lamba: entegrasyon önce hızlı yoldan dener, cevap gelmezse yedekten gönderir (twins.py)
        if (lpTwinOf(id)) h.callService('lemur_home_dashboard', 'control', { entity_id: id, action: 'toggle' });
        else h.callService('homeassistant', 'toggle', { entity_id: id });
        return;
      }
      return;
    }
    if (typeof a !== 'object') return;
    if (a.popup) { const pp = lhdIsObj(a.popup) ? a.popup : {}; LemurCardPopup.open(h, { title: pp.title, card: pp.card }, this._lang); return; }   // pencere içeriği yalnız kart
    const sv = a.service || a.perform_action;
    if (!sv && typeof a.action === 'string') {
      if (a.action === 'navigate' && a.navigation_path) { history.pushState(null, '', a.navigation_path); lpFire(window, 'location-changed', { replace: false }); return; }
      if (a.action === 'url' && lhdSafeUrl(a.url_path)) { window.open(a.url_path, '_blank', 'noopener'); return; }
      if (a.action === 'more-info' || a.action === 'toggle') this._act(a.action, a.entity || id); 
      return;
    }
    if (typeof sv !== 'string' || sv.indexOf('.') < 0) return;
    const p = sv.split('.'), d = Object.assign({}, a.data || a.service_data || {}), tg = a.target;
    if (typeof tg === 'string' || Array.isArray(tg)) d.entity_id = tg;
    else if (tg && typeof tg === 'object') Object.keys(tg).forEach((k) => { d[k] = tg[k]; });
    h.callService(p[0], p[1], d);
  }

  // değer karosunu çiz: simge (duruma göre), değer (HA'nın biçimiyle, birimli), ad. Zamanlayıcı çalışırken geri sayar.
  _paintVal(el, st) {
    const it = el._item || {}, a = st.attributes || {}, d = st.entity_id.split('.')[0];
    const na = st.state === 'unavailable';
    // açık/kapalı durumu olanlar (ikili sensör, zamanlayıcı, kişi...) duruma göre renklenir; ölçüm gösterenler hep canlı
    const two = LP_VAL_ONOFF.indexOf(d) >= 0, on = two && LP_VAL_ON.indexOf(st.state) >= 0;
    el.className = (el._bar ? 'bar' : 'tile') + ' val' + (el._wide ? ' wide' : '') + (on ? ' on' : '') + (!two && !na ? ' live' : '') + (na ? ' na' : '');
    if (el._bar) el.style.setProperty('--p', '0%');
    el.style.removeProperty('--tile-rgb');
    const mono = this._colorize(el, it, st, on);
    const own = (on ? it.icon_on : (two ? it.icon_off : null)) || it.icon;
    this._icSwap(el, st, it, 0, own, mono);
    const nm = el.querySelector('.nm'), vl = el.querySelector(el._bar ? '.pc' : '.vl');
    const nmT = this._tx(it.name) || a.friendly_name || st.entity_id, vlT = lpValText(this._hass, st, this._lang);
    // swap: ad üstte büyük, değer altta
    nm.textContent = it.swap && !el._bar ? vlT : nmT;
    vl.textContent = it.swap && !el._bar ? nmT : vlT;
    const s2 = el.querySelector('.sl'); if (s2) s2.textContent = this._sec2(it, st) || '';
  }
  // düğme ya da satır görünümündeki varlık öğesi
  _paintEnt(el, st) {
    const it = el._item || {}, a = st.attributes || {}, d = st.entity_id.split('.')[0], row = el.classList.contains('vrow');
    const na = st.state === 'unavailable' || (!it._val && st.state === 'unknown');
    const two = !it._val || LP_VAL_ONOFF.indexOf(d) >= 0;
    const on = it._val ? two && LP_VAL_ON.indexOf(st.state) >= 0 : LP_ON.indexOf(st.state) >= 0;
    el.className = (row ? 'vrow' : 'scene ebtn') + (on ? ' on' : '') + (!two && !na ? ' live' : '') + (na ? ' na' : '') + (el._fb ? ' fbk' : '');
    const rgb = on && !it._val && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
    if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
    const mono = this._colorize(el, it, st, on);
    const own = (on ? it.icon_on : (two ? it.icon_off : null)) || it.icon;
    this._icSwap(row ? el : el.firstChild, st, it, 0, own, mono);
    const txt = it._val ? lpValText(this._hass, st, this._lang) : (na ? t(this._lang, 'unavailable') : (this._hass.formatEntityState ? lpValText(this._hass, st, this._lang) : (TXT[this._lang][st.state] ? t(this._lang, st.state) : st.state)));
    el.querySelector(row ? '.rn' : '.sn').textContent = this._tx(it.name) || a.friendly_name || st.entity_id;
    const s2 = this._sec2(it, st);
    el.querySelector(row ? '.rv' : '.sv').textContent = s2 !== null ? s2 : txt;
  }
  _timers() {
    const act = (this._vals || []).some((el) => { const st = this._hass.states[el.getAttribute('data-val')]; return st && st.entity_id.indexOf('timer.') === 0 && st.state === 'active'; });
    if (act && !this._tmr) this._tmr = setInterval(() => {
      if (!this.isConnected || !this._hass) return;
      (this._vals || []).forEach((el) => { const id = el.getAttribute('data-val'), st = this._hass.states[id]; if (st && id.indexOf('timer.') === 0 && st.state === 'active') { const vl = el.querySelector(el._bar ? '.pc' : '.vl'); if (vl) vl.textContent = lpValText(this._hass, st, this._lang); } });
    }, 1000);
    if (!act && this._tmr) { clearInterval(this._tmr); this._tmr = null; }
  }

  // --- durum güncellemesi (iskelete dokunmadan) ---
  _update() {
    const h = this._hass, S = h.states, lang = this._lang;
    // LEC odalarındaki bir ışık değiştiyse o odada oynayan efekti yeniden sor
    if (this._lecRooms && this._lecRooms.length && !this._config.edit) {
      const seen = {};
      (this._watched || []).forEach((id) => { if (this._last[id] && S[id] !== this._last[id]) { const r = LEC.roomOf(id); if (r && !seen[r] && this._lecRooms.indexOf(r) >= 0) { seen[r] = 1; LEC.watch(h, r); } } });
    }
    (this._tiles || []).forEach((el) => {
      const id = el.getAttribute('data-light'), st = lpEff(S, id);
      lpOptRemember(S[id]);
      const fb = lpFbAt(id);
      if (el._fb !== fb) { el._fb = fb; delete this._last[id]; el.title = fb ? t(lang, 'fb', { t: new Date(fb).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) }) : ''; }
      if (!st || this._last[id] === st) return;
      const a = st.attributes, it = el._item || {}, on = LP_ON.indexOf(st.state) >= 0;
      // efekt: ışığın kendi efekti; yoksa LEC'in o odada oynattığı efekt (yanan ışıklarda)
      const fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(id)]) : null);
      if (el._bar) { if (!el._drag) this._paintBar(el, st, null, fx); return; }
      el.className = 'tile' + (el._wide ? ' wide' : '') + (on ? ' on' : '') + (st.state === 'unavailable' || st.state === 'unknown' ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '') + (el._fb ? ' fbk' : '');
      const rgb = on && !fx && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
      const mono = this._colorize(el, it, st, on);
      this._icSwap(el, st, it, 0, undefined, mono);
      el.querySelector('.nm').textContent = this._tx(it.name) || a.friendly_name || id;
      const s2 = el.querySelector('.sl'); if (s2) s2.textContent = this._sec2(it, st) || '';
    });
    (this._rows || []).forEach((el) => {
      const id = el.getAttribute('data-row'), st = S[id];
      if (!st || this._last[id] === st) return;
      const a = st.attributes;
      let txt;
      if (st.state === 'unavailable') txt = t(lang, 'unavailable');
      else if (st.state === 'playing') txt = a.media_title ? a.media_title + (a.media_artist ? ' · ' + a.media_artist : '') : t(lang, 'playing');
      else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
      el.className = 'row' + (st.state === 'playing' || st.state === 'on' ? ' on' : '');
      el.innerHTML = lpIcon(lpEntIcon(st)) + '<div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div>';
    });
    (this._vals || []).forEach((el) => {
      const id = el.getAttribute('data-val'), st = S[id];
      if (!st || (this._last[id] === st && el.getAttribute('data-p'))) return;
      el.setAttribute('data-p', '1');
      this._paintVal(el, st);
    });
    (this._pets || []).forEach((el) => lpPetPaint(el, lang, Date.now()));
    (this._txEls || []).forEach((el) => { el.textContent = this._tx(el.getAttribute('data-tx')); });
    (this._ssEls || []).forEach((el) => { const it = el._item || {}; el.textContent = this._sec2(it, it.entity ? S[it.entity] : null) || ''; });
    (this._ents || []).forEach((el) => {
      const id = el.getAttribute('data-ent'), st = lpEff(S, id);
      lpOptRemember(S[id]);
      const fb = lpFbAt(id);
      if (el._fb !== fb) { el._fb = fb; el.removeAttribute('data-p'); el.title = fb ? t(lang, 'fb', { t: new Date(fb).toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' }) }) : ''; }
      if (!st || (this._last[id] === st && el.getAttribute('data-p'))) return;
      el.setAttribute('data-p', '1');
      this._paintEnt(el, st);
    });
    this._timers();
    (this._watched || []).forEach((id) => { this._last[id] = S[id]; });
    // LEC düğmeleri: efekti oynuyorsa (ya da efekt ekranı düğmesinin odasında bir efekt oynuyorsa) yanar
    const R = this.shadowRoot;
    if (R) Array.prototype.forEach.call(R.querySelectorAll('.scene[data-lk]'), (el) => {
      const k = el.getAttribute('data-lk'), room = el.getAttribute('data-lroom');
      const on = k === 'play' ? LEC.isPlaying(room, el.getAttribute('data-lfx')) : (k === 'open' ? !!LEC.playing[room] : false);
      el.classList.toggle('on', on);
    });
  }
}

// Işık penceresi: ışık karosuna basılı tutunca açılır (Hakan'ın tablet panosundaki ışık penceresinin aynısı, yardımcı varlık gerekmeden).
// Üstte ad + kapat, altında parlaklık kaydırıcısı + güç düğmesi, sonra sekmeler:
//   Renk: kelvin düğmeleri (2200-6500 K), renk çemberi, 12 renk örneği
//   Efekt: Lemur Light Effect Card kuruluysa ve ışık bir LEC odasındaysa efekt ekranını o odayla açar; değilse ışığın kendi efekt listesi
//   Segment: aynı cihazın segment ışıkları varsa (Govee şerit/lamba) segment seçilir, renk o segmente uygulanır
// Durum pencerenin içinde tutulur (input_select gibi yardımcı varlık yok). Pencere sayfanın kendisine eklenir (panonun ölçeğinden bağımsız).
// Eski Safari (iOS 12): pointer event yok (dokunma + fare), ?. ?? yok, flex gap yok.
const LP_POP_KELVIN = [[2200, '#FF9227'], [2700, '#FFA757'], [3200, '#FFB87B'], [3500, '#FFC18D'], [4000, '#FFCEA6'], [6500, '#FFFEFA']];
const LP_POP_SWATCH = ['#FF3B30', '#FF9500', '#FFD60A', '#A3E635', '#30D158', '#40E0D0', '#32ADE6', '#0A84FF', '#5E5CE6', '#BF5AF2', '#FF6FB5', '#FF2D95'];
const LP_POP_ACCENT = '#F0A93B';
const LP_POP_CSS = `
:host { position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 9000; display: block; font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
  -webkit-tap-highlight-color: transparent; -webkit-user-select: none; user-select: none; }
.bg { position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.55); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.18s; }
.pan { position: absolute; left: 50%; top: 50%; width: 560px; max-width: calc(100vw - 16px); max-height: calc(100vh - 24px); overflow-y: auto; -webkit-overflow-scrolling: touch;
  box-sizing: border-box; padding: 18px; border-radius: 30px; background: #131416; color: #ECEDEF; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -46%) scale(0.98); opacity: 0; transition: transform 0.2s ease-out, opacity 0.18s; }
:host(.in) .bg { opacity: 1; }
:host(.in) .pan { transform: translate(-50%, -50%); opacity: 1; }
.box { background: #1E2024; border-radius: 18px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.box + .box { margin-top: 14px; }
.hd { display: flex; align-items: center; }
.hd .nm { flex: 1 1 auto; display: flex; align-items: center; height: 56px; padding: 0 18px; min-width: 0; }
.hd .nm ha-icon, .hd .nm ha-state-icon { --mdc-icon-size: 22px; color: ${LP_POP_ACCENT}; margin-right: 12px; flex: 0 0 auto; }
.hd .nm b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x { flex: 0 0 56px; height: 56px; margin-left: 12px; border-radius: 18px; background: #1E2024; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ECEDEF; }
.x ha-icon { --mdc-icon-size: 22px; }
.row { display: flex; align-items: center; padding: 8px; }
.sl { position: relative; flex: 1 1 auto; height: 74px; border-radius: 14px; background: #0C0D0F; overflow: hidden; cursor: pointer; touch-action: none; }
.sl .fill { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--lc, ${LP_POP_ACCENT}); opacity: 0.85; transition: width 0.15s; }
.sl.drag .fill { transition: none; }
.sl .in { position: relative; display: flex; align-items: center; height: 100%; padding: 0 18px; }
.sl ha-state-icon, .sl ha-icon { --mdc-icon-size: 24px; color: #8A8F96; margin-right: 14px; flex: 0 0 auto; }
.sl.on ha-state-icon, .sl.on ha-icon { color: #fff; }
:host(.ic-auto) .sl:not(.on) .lic, :host(.ic-mono) .lic { filter: grayscale(1) brightness(1.1); opacity: 0.7; }
:host(.ic-tint) .lic { color: #8A8F96; } :host(.ic-tint) .sl.on .lic { color: #fff; } :host(.ic-tint) .hd .lic { color: var(--lp-ic-on, #FFC24A); }
.lic { display: inline-block; line-height: 0; flex: 0 0 auto; } .lic svg { width: 100%; height: 100%; display: block; }
.hd .nm .lic { width: 22px; height: 22px; margin-right: 12px; } .sl .lic { width: 24px; height: 24px; margin-right: 14px; }
.sl .tx { min-width: 0; }
.sl .tx b { display: block; font-size: 16px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sl .tx span { display: block; font-size: 13px; color: #8A8F96; margin-top: 2px; }
.sl.on .tx span { color: rgba(255, 255, 255, 0.85); }
.pw { flex: 0 0 74px; height: 74px; margin-left: 10px; border-radius: 18px; background: #2A2D33; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8A8F96; }
.pw.on { background: ${LP_POP_ACCENT}; color: #1A1105; }
.pw ha-icon { --mdc-icon-size: 26px; }
.tabs { display: flex; padding: 5px; }
.tab { flex: 1 1 0; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #8A8F96; cursor: pointer; }
.tab + .tab { margin-left: 5px; }
.tab.on { background: ${LP_POP_ACCENT}; color: #1A1105; font-weight: 600; }
.pane { padding: 18px; }
.kel { display: grid; grid-template-columns: repeat(6, 1fr); grid-gap: 7px; }
.kel div { height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #3A2A17;
  font-family: 'JetBrains Mono', ui-monospace, monospace; cursor: pointer; }
.kel div.on { box-shadow: 0 0 0 2px #fff; }
@media (max-width: 360px) { .kel { grid-template-columns: repeat(3, 1fr); } }   /* dar telefonda 6 kelvin düğmesi sığmıyor: 2 satır */
.col { display: grid; grid-template-columns: 177px 1fr; align-items: center; grid-gap: 14px; margin-top: 14px; }
.wh { position: relative; width: 163px; height: 163px; margin: 0 auto; touch-action: none; }
.wh canvas { width: 100%; height: 100%; border-radius: 50%; display: block; box-shadow: 0 6px 24px -12px rgba(0, 0, 0, 0.9); }
.wh .dot { position: absolute; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5);
  -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); pointer-events: none; left: 50%; top: 50%; }
.sw { display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 8px; }
.sw div { height: 51px; border-radius: 11px; cursor: pointer; }
.fx { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 6px; max-height: 300px; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.fx div { font-size: 13px; padding: 11px 12px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); color: #B5B9C0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
.fx div.on { background: rgba(91, 141, 239, 0.28); border-color: rgba(91, 141, 239, 0.95); color: #fff; }
.lecb { display: flex; align-items: center; justify-content: center; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #FF6FAE, #8E7CFF); color: #fff;
  font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 12px; }
.lecb ha-icon { --mdc-icon-size: 22px; margin-right: 10px; }
.segs { display: grid; grid-gap: 7px; margin-bottom: 14px; }
.segs div { height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.06); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #B5B9C0; cursor: pointer; }
.segs div.on { background: ${LP_POP_ACCENT}; color: #1A1105; font-weight: 600; }
.segs div.lit { box-shadow: inset 0 0 0 2px var(--sc, #fff); }
.empty { color: #8A8F96; font-size: 14px; text-align: center; padding: 18px 0; }
@media (max-width: 560px) { .col { grid-template-columns: 1fr; } .pan { padding: 12px; border-radius: 24px; } }
`;
const LP_POP_TXT = {
  tr: { color: 'Renk', effect: 'Efekt', segment: 'Segment', off: 'Kapalı', on: 'Açık', lec: 'Efekt ekranını aç', noFx: 'Bu ışığın efekti yok', unav: 'Ulaşılamıyor', seg: 'Segment {n}' },
  en: { color: 'Color', effect: 'Effect', segment: 'Segment', off: 'Off', on: 'On', lec: 'Open effect screen', noFx: 'This light has no effects', unav: 'Unavailable', seg: 'Segment {n}' }
};

// basılı tutunca ne açılır: 'popup' (bu pencere, varsayılan), 'ha' (HA'nın kendi penceresi), 'lec' (LEC efekt ekranı); eski lec_hold ayarı 'lec' sayılır
function lpHoldMode() {
  const st = (STORE.data && STORE.data.settings) || {};
  if (st.hold === 'ha' || st.hold === 'lec' || st.hold === 'popup') return st.hold;
  return st.lec_hold ? 'lec' : 'popup';
}

// hsv → rgb (renk çemberi)
function lpHsv(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
// dokunma + fare ile sürükleme (iOS 12'de pointer event yok)
function lpDrag(el, onMove, onEnd) {
  let on = false;
  const pt = (e) => (e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e));
  const mv = (e) => { if (!on) return; if (e.cancelable) e.preventDefault(); onMove(pt(e), false); };
  const up = (e) => {
    if (!on) return; on = false;
    window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up);
    window.removeEventListener('touchmove', mv); window.removeEventListener('touchend', up); window.removeEventListener('touchcancel', up);
    onEnd(pt(e));
  };
  const down = (e) => {
    if (e.type === 'mousedown' && e.button !== 0) return;
    on = true; if (e.cancelable) e.preventDefault(); onMove(pt(e), true);
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', mv, { passive: false }); window.addEventListener('touchend', up); window.addEventListener('touchcancel', up);
  };
  el.addEventListener('mousedown', down);
  el.addEventListener('touchstart', down, { passive: false });
}

const LP_POP = { cur: null };
class LemurLightPopup {
  // id: ışık; item: karodaki ad/simge; room: LEC odası (yoksa sekmenin alanı)
  static open(hass, id, item, room) {
    if (LP_POP.cur) LP_POP.cur.close(true);
    const p = new LemurLightPopup(hass, id, item || {}, room || null);
    LP_POP.cur = p;
    return p;
  }
  static update(hass) { if (LP_POP.cur) LP_POP.cur.hass = hass; }

  constructor(hass, id, item, room) {
    this._h = hass; this._id = id; this._item = item; this._room = room;
    this._lang = pickLang(hass);
    this._tab = 'color'; this._seg = 0;
    this._host = document.createElement('div');
    this._host.className = 'lemur-light-popup';
    const R = this._host.attachShadow({ mode: 'open' });
    R.innerHTML = '<style>' + LP_POP_CSS + '</style><div class="bg"></div><div class="pan" role="dialog" aria-modal="true"></div>';
    this._R = R; this._pan = R.querySelector('.pan');
    R.querySelector('.bg').addEventListener('click', () => this.close());
    this._key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); this.close(); } };
    window.addEventListener('keydown', this._key, true);
    // geri tuşu pencereyi kapatsın (Android tablet, tarayıcı)
    this._pop = () => this.close(true);
    try { history.pushState(Object.assign({}, history.state, { lhdPop: 1 }), ''); this._pushed = true; window.addEventListener('popstate', this._pop); } catch (e) { this._pushed = false; }
    document.body.appendChild(this._host);
    this._render();
    requestAnimationFrame(() => requestAnimationFrame(() => this._host.classList.add('in')));
  }
  close(fromNav) {
    if (this._closed) return;
    this._closed = true;
    if (LP_POP.cur === this) LP_POP.cur = null;
    window.removeEventListener('keydown', this._key, true);
    window.removeEventListener('popstate', this._pop);
    if (this._pushed && !fromNav) { try { history.back(); } catch (e) {} }
    this._host.classList.remove('in');
    setTimeout(() => { if (this._host.parentNode) this._host.parentNode.removeChild(this._host); }, 200);
  }
  // HA her durum değişiminde hass gönderir: pencere yalnız kendi ışıklarından biri değiştiyse yeniden çizilir
  set hass(h) { this._h = h; if (!this._closed && !this._dragging) this._sync(true); }
  _t(k, v) { let s = (LP_POP_TXT[this._lang] || LP_POP_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; }

  // aynı cihazın segment ışıkları (ör. light.lantern_floor_lamp_s_segment_001..004)
  // (bütün varlıkları taramak pahalı: varlık listesi değişmedikçe önceki sonuç kullanılır)
  _segments() {
    const ents = this._h.entities || {};
    if (this._segC && this._segC.e === ents) return this._segC.v;
    const e = ents[this._id], dv = e && e.device_id;
    const v = !dv ? [] : Object.keys(this._h.states).filter((x) => x !== this._id && x.indexOf('light.') === 0 && /_segment_?\d+$/.test(x) && ents[x] && ents[x].device_id === dv).sort();
    this._segC = { e: ents, v: v };
    return v;
  }
  _caps(id) {
    const st = this._h.states[id], a = (st && st.attributes) || {}, m = a.supported_color_modes || [];
    const color = m.some((x) => ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'].indexOf(x) >= 0);
    const ct = m.indexOf('color_temp') >= 0 || color;
    const dim = color || ct || m.indexOf('brightness') >= 0 || m.indexOf('white') >= 0;
    return { color: color, ct: ct, dim: id.indexOf('light.') === 0 && dim, fx: (a.effect_list || []).filter((x) => x).length > 0 };
  }
  _lecRoom() { return LEC.installed(this._h) ? (LEC.roomOf(this._id) || (LEC.hasRoom(this._room) ? this._room : null)) : null; }
  _tabs() {
    const c = this._caps(this._id), out = [];
    if (c.color || c.ct) out.push('color');
    if (c.fx || this._lecRoom()) out.push('effect');
    if (this._segments().length) out.push('segment');
    return out;
  }

  _render() {
    const S = this._h.states, st = S[this._id], it = this._item;
    const name = it.name || (st && st.attributes.friendly_name) || this._id;
    const icon = lpIcon(lpEntIcon(st, it.icon));
    if (!LP_MDIC.map) lpMdicLoad().then(() => { if (this._host && this._host.isConnected) this._render(); });
    if (this._host) { this._host.className = 'lemur-light-popup ic-' + lpIconMode(); this._host.style.setProperty('--lp-ic-on', lpIconTint()); }
    const tabs = this._tabs();
    if (tabs.indexOf(this._tab) < 0) this._tab = tabs[0] || null;
    let h = '<div class="hd"><div class="box nm">' + icon + '<b>' + esc(name) + '</b></div><div class="x" data-x><ha-icon icon="mdi:close"></ha-icon></div></div>' +
      '<div class="box row" style="margin-top:14px">' + this._sliderHtml(this._id, name, icon) + '<div class="pw" data-pw><ha-icon icon="mdi:power"></ha-icon></div></div>';
    if (tabs.length > 1 || (tabs.length === 1 && tabs[0] !== 'color')) {
      h += '<div class="box tabs" style="margin-top:14px">' + tabs.map((k) => '<div class="tab' + (k === this._tab ? ' on' : '') + '" data-tab="' + k + '">' + esc(this._t(k)) + '</div>').join('') + '</div>';
    }
    if (this._tab) h += '<div class="box pane" style="margin-top:14px">' + this._paneHtml() + '</div>';
    this._pan.innerHTML = h;
    this._bind();
    this._sync();
  }
  _sliderHtml(id, name, icon) {
    return '<div class="sl" data-sl="' + esc(id) + '"><div class="fill"></div><div class="in">' + icon + '<div class="tx"><b>' + esc(name) + '</b><span></span></div></div></div>';
  }
  _target() { const segs = this._segments(); return this._tab === 'segment' && segs[this._seg] ? segs[this._seg] : this._id; }
  _colorHtml(id) {
    const c = this._caps(id);
    let h = '';
    if (c.ct) h += '<div class="kel">' + LP_POP_KELVIN.map((k) => '<div data-k="' + k[0] + '" style="background:' + k[1] + '">' + k[0] + 'K</div>').join('') + '</div>';
    if (c.color) h += '<div class="col"' + (c.ct ? '' : ' style="margin-top:0"') + '><div class="wh"><canvas width="326" height="326"></canvas><div class="dot"></div></div>' +
      '<div class="sw">' + LP_POP_SWATCH.map((x) => '<div data-rgb="' + x + '" style="background:' + x + '"></div>').join('') + '</div></div>';
    return h;
  }
  _paneHtml() {
    const S = this._h.states;
    if (this._tab === 'color') return this._colorHtml(this._id);
    if (this._tab === 'effect') {
      const room = this._lecRoom();
      const list = ((S[this._id] && S[this._id].attributes.effect_list) || []).filter((x) => x);
      return (room ? '<div class="lecb" data-lec><ha-icon icon="mdi:creation"></ha-icon>' + esc(this._t('lec')) + '</div>' : '') +
        (list.length ? '<div class="fx">' + list.map((x) => '<div data-fx="' + esc(x) + '">' + esc(x) + '</div>').join('') + '</div>' : (room ? '' : '<div class="empty">' + esc(this._t('noFx')) + '</div>'));
    }
    if (this._tab === 'segment') {
      const segs = this._segments(), id = segs[this._seg];
      const n = segs.length;
      return '<div class="segs" style="grid-template-columns:repeat(' + Math.min(n, 6) + ',1fr)">' + segs.map((x, i) => '<div data-seg="' + i + '"' + (i === this._seg ? ' class="on"' : '') + '>' + (i + 1) + '</div>').join('') + '</div>' +
        '<div class="row" style="padding:0;margin-bottom:14px">' + this._sliderHtml(id, this._t('seg', { n: this._seg + 1 }), '<ha-icon icon="mdi:led-strip-variant"></ha-icon>') +
        '<div class="pw" data-pws><ha-icon icon="mdi:power"></ha-icon></div></div>' + this._colorHtml(id);
    }
    return '';
  }

  _bind() {
    const R = this._pan, H = () => this._h;
    R.querySelector('[data-x]').addEventListener('click', () => this.close());
    R.querySelector('[data-pw]').addEventListener('click', () => this._toggle(this._id));
    const pws = R.querySelector('[data-pws]'); if (pws) pws.addEventListener('click', () => this._toggle(this._target()));
    Array.prototype.forEach.call(R.querySelectorAll('[data-tab]'), (el) => el.addEventListener('click', () => {
      const k = el.getAttribute('data-tab');
      // tablet panosundaki gibi: Efekt sekmesi, LEC kuruluysa ve ışığın listesi yoksa doğrudan efekt ekranını açar
      if (k === 'effect' && this._lecRoom() && !this._caps(this._id).fx) { this._openLec(); return; }
      this._tab = k; this._render();
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-seg]'), (el) => el.addEventListener('click', () => { this._seg = +el.getAttribute('data-seg'); this._render(); }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-k]'), (el) => el.addEventListener('click', () => {
      this._call('turn_on', this._target(), { color_temp_kelvin: +el.getAttribute('data-k') });
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-rgb]'), (el) => el.addEventListener('click', () => {
      const x = el.getAttribute('data-rgb'); this._call('turn_on', this._target(), { rgb_color: [parseInt(x.slice(1, 3), 16), parseInt(x.slice(3, 5), 16), parseInt(x.slice(5, 7), 16)] });
    }));
    Array.prototype.forEach.call(R.querySelectorAll('[data-fx]'), (el) => el.addEventListener('click', () => this._call('turn_on', this._id, { effect: el.getAttribute('data-fx') })));
    const lec = R.querySelector('[data-lec]'); if (lec) lec.addEventListener('click', () => this._openLec());
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = H(); el.stateObj = H().states[this._id]; });
    // parlaklık kaydırıcıları: sürükledikçe dolgu değişir, bırakınca (ve sürüklerken 300 ms'de bir) ışığa gönderilir
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => {
      const id = sl.getAttribute('data-sl');
      if (!this._caps(id).dim) return;
      let pct = 0, last = 0;
      const send = () => { last = Date.now(); if (pct <= 0) this._call('turn_off', id, {}); else this._call('turn_on', id, { brightness_pct: pct }); };
      lpDrag(sl, (p) => {
        this._dragging = true; sl.classList.add('drag');
        const r = sl.getBoundingClientRect();
        pct = Math.max(0, Math.min(100, Math.round((p.clientX - r.left) / r.width * 100)));
        sl.querySelector('.fill').style.width = pct + '%';
        sl.querySelector('.tx span').textContent = pct ? pct + '%' : this._t('off');
        if (Date.now() - last > 300) send();
      }, () => { this._dragging = false; this._seen = null; sl.classList.remove('drag'); send(); });
    });
    // renk çemberi
    const wh = R.querySelector('.wh');
    if (wh) {
      this._paintWheel(wh.querySelector('canvas'));
      let hs = null, last = 0;
      const send = () => { if (!hs) return; last = Date.now(); this._call('turn_on', this._target(), { hs_color: hs }); };
      lpDrag(wh, (p) => {
        this._dragging = true;
        const r = wh.getBoundingClientRect(), rad = r.width / 2;
        let x = p.clientX - r.left - rad, y = p.clientY - r.top - rad, d = Math.sqrt(x * x + y * y) / rad;
        if (d > 1) { x /= d; y /= d; d = 1; }
        hs = [Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360), Math.round(d * 100)];
        const dot = wh.querySelector('.dot'); dot.style.left = (50 + x / rad * 50) + '%'; dot.style.top = (50 + y / rad * 50) + '%';
        if (Date.now() - last > 220) send();
      }, () => { this._dragging = false; this._seen = null; setTimeout(send, 120); });
    }
  }
  _paintWheel(cv) {
    const n = cv.width, c = n / 2, ctx = cv.getContext('2d'), img = ctx.createImageData(n, n), d = img.data;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const dx = x - c + 0.5, dy = y - c + 0.5, r = Math.sqrt(dx * dx + dy * dy) / c, k = 4 * (y * n + x);
      if (r > 1) { d[k + 3] = 0; continue; }
      const rgb = lpHsv((Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360, r, 1);
      d[k] = rgb[0]; d[k + 1] = rgb[1]; d[k + 2] = rgb[2]; d[k + 3] = r > 0.985 ? Math.round((1 - r) / 0.015 * 255) : 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  _call(svc, id, data) {
    const d = id.split('.')[0];
    if (d !== 'light') { this._h.callService('homeassistant', svc === 'turn_off' ? 'turn_off' : 'turn_on', { entity_id: id }); return; }
    this._h.callService('light', svc, Object.assign({ entity_id: id }, data));
  }
  _toggle(id) { this._h.callService(id.split('.')[0] === 'light' ? 'light' : 'homeassistant', 'toggle', { entity_id: id }); }
  _openLec() {
    const room = this._lecRoom();
    this.close();
    setTimeout(() => LEC.open(this._h, room), 220);
  }

  // durumu ekrana yansıt (yeniden çizmeden)
  _sync(onlyIfChanged) {
    const R = this._pan, S = this._h.states;
    if (!R) return;
    const ids = [this._id, this._target()].concat(this._segments());
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => ids.push(sl.getAttribute('data-sl')));
    const seen = ids.map((i) => S[i]), L = this._seen;
    if (onlyIfChanged && L && L.length === seen.length && seen.every((x, i) => x === L[i])) return;
    this._seen = seen;
    Array.prototype.forEach.call(R.querySelectorAll('[data-sl]'), (sl) => {
      const st = S[sl.getAttribute('data-sl')];
      const on = !!st && st.state === 'on', a = (st && st.attributes) || {};
      const pct = on ? (typeof a.brightness === 'number' ? Math.max(1, Math.round(a.brightness / 2.55)) : 100) : 0;
      const rgb = on && a.rgb_color && (a.rgb_color[0] + a.rgb_color[1] + a.rgb_color[2]) > 12 ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      sl.classList.toggle('on', on);
      if (rgb) sl.style.setProperty('--lc', rgb); else sl.style.removeProperty('--lc');
      sl.querySelector('.fill').style.width = pct + '%';
      sl.querySelector('.tx span').textContent = !st || st.state === 'unavailable' ? this._t('unav') : (on ? (this._caps(sl.getAttribute('data-sl')).dim ? pct + '%' : this._t('on')) : this._t('off'));
    });
    const pw = R.querySelector('[data-pw]'), st = S[this._id];
    if (pw) pw.classList.toggle('on', !!st && st.state === 'on');
    const pws = R.querySelector('[data-pws]'), ts = S[this._target()];
    if (pws) pws.classList.toggle('on', !!ts && ts.state === 'on');
    Array.prototype.forEach.call(R.querySelectorAll('ha-state-icon'), (el) => { el.hass = this._h; el.stateObj = st; });
    // seçili renk: çemberdeki nokta, kelvin düğmesi, efekt
    const tgt = S[this._target()], ta = (tgt && tgt.attributes) || {};
    const dot = R.querySelector('.wh .dot');
    if (dot && ta.hs_color && tgt.state === 'on') {
      const a = ta.hs_color[0] * Math.PI / 180, r = ta.hs_color[1] / 100;
      dot.style.left = (50 + Math.cos(a) * r * 50) + '%'; dot.style.top = (50 + Math.sin(a) * r * 50) + '%';
    }
    Array.prototype.forEach.call(R.querySelectorAll('[data-k]'), (el) => {
      el.classList.toggle('on', !!tgt && tgt.state === 'on' && ta.color_mode === 'color_temp' && Math.abs((ta.color_temp_kelvin || 0) - +el.getAttribute('data-k')) < 120);
    });
    const ef = st && st.state === 'on' ? String(st.attributes.effect || '') : '';
    Array.prototype.forEach.call(R.querySelectorAll('[data-fx]'), (el) => el.classList.toggle('on', !!ef && el.getAttribute('data-fx') === ef));
    Array.prototype.forEach.call(R.querySelectorAll('[data-seg]'), (el) => {
      const s2 = S[this._segments()[+el.getAttribute('data-seg')]], a2 = (s2 && s2.attributes) || {};
      const lit = !!s2 && s2.state === 'on';
      el.classList.toggle('lit', lit);
      if (lit && a2.rgb_color) el.style.setProperty('--sc', 'rgb(' + a2.rgb_color.join(',') + ')'); else el.style.removeProperty('--sc');
    });
  }
}

// Gömülü HA kartı ve kart penceresi.
// Öğe { card: { type: ... } } bölümde HA'nın kart yardımcısıyla (window.loadCardHelpers().createCardElement) çizilir; hass verilir.
// Eylem { popup: { title, card } } kartı panonun kendi penceresinde açar (ışık penceresi gibi): dışarı dokun, X ya da geri tuşu kapatır.
// Kart yüklenemezse yerinde kısa bir uyarı çıkar; pano bozulmaz.
const LP_CARD_TXT = {
  tr: { bad: 'Kart ayarı eksik: type yok', fail: 'Kart yüklenemedi: {t}', close: 'Kapat', yes: 'Evet', no: 'Vazgeç', ask: '{n} çalıştırılsın mı?' },
  en: { bad: 'Card config is missing its type', fail: 'Card could not be loaded: {t}', close: 'Close', yes: 'Yes', no: 'Cancel', ask: 'Run {n}?' }
};
const lpCardT = (lang, k, v) => { let s = (LP_CARD_TXT[lang] || LP_CARD_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); }); return s; };
const LP_CH = { p: null };
function lpCardHelpers() {
  if (!LP_CH.p) LP_CH.p = window.loadCardHelpers ? Promise.resolve().then(() => window.loadCardHelpers()).catch(() => null) : Promise.resolve(null);
  return LP_CH.p;
}
// ph: kartın konacağı kutu; getHass: güncel hass; onEl(el): kart takılınca (hass güncellemesi için listeye eklenir)
function lpMountCard(ph, cfg, getHass, lang, onEl) {
  const warn = (msg) => { ph.innerHTML = '<div class="cwarn"><ha-icon icon="mdi:alert-outline"></ha-icon><span>' + esc(msg) + '</span></div>'; };
  if (!cfg || typeof cfg !== 'object' || typeof cfg.type !== 'string' || !cfg.type) { warn(lpCardT(lang, 'bad')); return; }
  const put = (el) => {
    if (!ph.isConnected && ph.parentNode === null) return;
    try { el.hass = getHass(); } catch (e) {}
    // HA'nın hata kartı, eksik özel kart sonradan tanımlanınca kendini yeniden kurdurur
    el.addEventListener('ll-rebuild', (ev) => { ev.stopPropagation(); lpMountCard(ph, cfg, getHass, lang, onEl); });
    ph.innerHTML = ''; ph.appendChild(el);
    if (onEl) onEl(el);
    setTimeout(() => { try { window.dispatchEvent(new Event('resize')); } catch (e) {} }, 60);   // grafik kartları boyutunu ölçsün
  };
  lpCardHelpers().then((H) => {
    if (H && H.createCardElement) {
      let el = null;
      try { el = H.createCardElement(cfg); } catch (e) { warn(lpCardT(lang, 'fail', { t: cfg.type })); return; }
      if (!el) { warn(lpCardT(lang, 'fail', { t: cfg.type })); return; }
      put(el); return;
    }
    // kart yardımcısı yok (çok eski HA): özel kart doğrudan oluşturulur
    const tag = cfg.type.indexOf('custom:') === 0 ? cfg.type.slice(7) : 'hui-' + cfg.type + '-card';
    const make = () => { try { const el = document.createElement(tag); if (typeof el.setConfig !== 'function') return false; el.setConfig(cfg); put(el); return true; } catch (e) { return false; } };
    if (make()) return;
    let done = false;
    const tm = setTimeout(() => { if (!done) { done = true; warn(lpCardT(lang, 'fail', { t: cfg.type })); } }, 4000);
    if (window.customElements && customElements.whenDefined) customElements.whenDefined(tag).then(() => { if (done) return; done = true; clearTimeout(tm); if (!make()) warn(lpCardT(lang, 'fail', { t: cfg.type })); });
  });
}

const LP_CPOP_CSS = `
:host { position: fixed; left: 0; top: 0; right: 0; bottom: 0; z-index: 9000; display: block; font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
  -webkit-tap-highlight-color: transparent; }
.bg { position: absolute; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.55); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); opacity: 0; transition: opacity 0.18s; }
.pan { position: absolute; left: 50%; top: 50%; width: 640px; max-width: calc(100vw - 16px); max-height: calc(100vh - 24px); overflow-y: auto; -webkit-overflow-scrolling: touch;
  box-sizing: border-box; padding: 18px; border-radius: 30px; background: #131416; color: #ECEDEF; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -46%) scale(0.98); opacity: 0; transition: transform 0.2s ease-out, opacity 0.18s; }
:host(.in) .bg { opacity: 1; }
:host(.in) .pan { transform: translate(-50%, -50%); opacity: 1; }
.hd { display: flex; align-items: center; margin-bottom: 14px; }
.hd .nm { flex: 1 1 auto; display: flex; align-items: center; height: 56px; padding: 0 18px; min-width: 0; background: #1E2024; border-radius: 18px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.hd .nm b { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x { flex: 0 0 56px; height: 56px; margin-left: 12px; border-radius: 18px; background: #1E2024; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ECEDEF; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); }
.x ha-icon { --mdc-icon-size: 22px; }
.x.solo { position: absolute; right: 18px; top: 18px; z-index: 1; }
.cb { min-height: 40px; }
.cwarn { display: flex; align-items: center; padding: 14px 16px; border-radius: 14px; background: rgba(229, 72, 77, 0.12); color: #FF9592; font-size: 14px; line-height: 1.35; }
.cwarn ha-icon { --mdc-icon-size: 20px; margin-right: 10px; flex: 0 0 auto; }
.phist { background: #1E2024; border-radius: 18px; padding: 6px 0; }
.phr { display: flex; align-items: center; padding: 10px 18px; font-size: 15px; }
.phr + .phr { border-top: 1px solid rgba(255, 255, 255, 0.06); }
.phr b { flex: 0 0 auto; font-weight: 600; margin-right: 14px; font-variant-numeric: tabular-nums; }
.phr span { flex: 1 1 auto; color: #9aa0a8; }
.phr i { font-style: normal; color: #9aa0a8; font-size: 13px; }
.cfm { display: flex; margin-top: 4px; }
.cfm > div { flex: 1 1 0; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 600; cursor: pointer; background: #1E2024; }
.cfm > div + div { margin-left: 12px; }
.cfm .ok { background: #F0A93B; color: #111; }
`;
const LP_CPOP = { cur: null };
class LemurCardPopup {
  // p: { title, card }
  // p: { title, card }. Hazır HTML içerik yalnız panonun kendi pencerelerinden (_openHtml): ayardan gelen html kabul edilmez
  static open(hass, p, lang) { p = p || {}; return LemurCardPopup._open(hass, { title: p.title, card: p.card }, lang); }
  static _openHtml(hass, title, html, lang) { return LemurCardPopup._open(hass, { title: title, html: html }, lang); }
  static _open(hass, p, lang) {
    if (LP_CPOP.cur) LP_CPOP.cur.close(true);
    if (typeof LP_POP !== 'undefined' && LP_POP.cur) LP_POP.cur.close(true);
    const x = new LemurCardPopup(hass, p || {}, lang || pickLang(hass));
    LP_CPOP.cur = x;
    return x;
  }
  static update(hass) { if (LP_CPOP.cur) LP_CPOP.cur.hass = hass; }
  // onay sorusu ("Evi Kapa çalıştırılsın mı?"): Evet'e basınca yes() çalışır
  static confirm(hass, lang, text, yes) {
    const p = LemurCardPopup._openHtml(hass, text, '<div class="cfm"><div data-no>' + esc(lpCardT(lang, 'no')) + '</div><div class="ok" data-yes>' + esc(lpCardT(lang, 'yes')) + '</div></div>', lang);
    const R = p._host.shadowRoot;
    R.querySelector('[data-no]').addEventListener('click', () => p.close());
    R.querySelector('[data-yes]').addEventListener('click', () => { p.close(); yes(); });
    return p;
  }
  constructor(hass, p, lang) {
    this._h = hass; this._els = [];
    this._host = document.createElement('div');
    this._host.className = 'lemur-card-popup';
    const R = this._host.attachShadow({ mode: 'open' });
    const title = p.title ? String(p.title) : '';
    R.innerHTML = '<style>' + LP_CPOP_CSS + '</style><div class="bg"></div><div class="pan" role="dialog" aria-modal="true">' +
      (title ? '<div class="hd"><div class="nm"><b>' + esc(title) + '</b></div><div class="x" data-x title="' + esc(lpCardT(lang, 'close')) + '"><ha-icon icon="mdi:close"></ha-icon></div></div>'
        : '<div class="x solo" data-x title="' + esc(lpCardT(lang, 'close')) + '"><ha-icon icon="mdi:close"></ha-icon></div>') +
      '<div class="cb"></div></div>';
    R.querySelector('.bg').addEventListener('click', () => this.close());
    R.querySelector('[data-x]').addEventListener('click', () => this.close());
    this._key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); this.close(); } };
    window.addEventListener('keydown', this._key, true);
    // geri tuşu pencereyi kapatsın (Android tablet, tarayıcı)
    this._pop = () => this.close(true);
    try { history.pushState(Object.assign({}, history.state, { lhdPop: 1 }), ''); this._pushed = true; window.addEventListener('popstate', this._pop); } catch (e) { this._pushed = false; }
    document.body.appendChild(this._host);
    if (typeof p.html === 'string') R.querySelector('.cb').innerHTML = p.html;   // hazır içerik (ör. son beslemeler)
    else lpMountCard(R.querySelector('.cb'), p.card, () => this._h, lang, (el) => { this._els.push(el); });
    requestAnimationFrame(() => requestAnimationFrame(() => this._host.classList.add('in')));
  }
  set hass(h) { this._h = h; if (!this._closed) this._els.forEach((e) => { e.hass = h; }); }
  close(fromNav) {
    if (this._closed) return;
    this._closed = true;
    if (LP_CPOP.cur === this) LP_CPOP.cur = null;
    window.removeEventListener('keydown', this._key, true);
    window.removeEventListener('popstate', this._pop);
    if (this._pushed && !fromNav) { try { history.back(); } catch (e) {} }
    this._host.classList.remove('in');
    setTimeout(() => { if (this._host.parentNode) this._host.parentNode.removeChild(this._host); }, 200);
  }
}

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
  LemurCardPopup._openHtml(h, (pet.name || '') + ' · ' + lpPetT(lang, 'hist'), html, lang);
}

// Küçük YAML okuyucu/yazıcı: yönetim panelinde "Kart (YAML)" ve "Pencerede kart aç" kutuları için.
// HA kart ayarlarında kullanılan kadarı: girintili eşlemeler ve listeler, tırnaklı/tırnaksız metin, sayı, true/false/null,
// tek satırlık [a, b] ve {a: 1}, çok satırlı | ve > metinleri, # yorumları. JSON da yazılabilir (YAML'ın alt kümesi).
// Hatalı metinde Error fırlatır (mesajda satır numarası).
function lhdYamlScalar(s) {
  s = s.trim();
  if (s === '' || s === '~' || s === 'null' || s === 'Null' || s === 'NULL') return null;
  if (s === 'true' || s === 'True' || s === 'TRUE') return true;
  if (s === 'false' || s === 'False' || s === 'FALSE') return false;
  if (s[0] === '"') { try { return JSON.parse(s); } catch (e) { throw new Error('"' + s + '"'); } }
  if (s[0] === "'") { if (s[s.length - 1] !== "'") throw new Error(s); return s.slice(1, -1).replace(/''/g, "'"); }
  if (s[0] === '[' || s[0] === '{') return lhdYamlFlow(s);
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s) && !/^0\d/.test(s)) return Number(s);
  return s;
}
// tek satırlık [a, b, {c: 1}] ve {a: 1, b: [x]}
function lhdYamlFlow(src) {
  let i = 0;
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const val = (stop) => {
    ws();
    if (src[i] === '[') { i++; const a = []; ws(); if (src[i] === ']') { i++; return a; } for (;;) { a.push(val(',]')); ws(); if (src[i] === ',') { i++; continue; } if (src[i] === ']') { i++; return a; } throw new Error(src); } }
    if (src[i] === '{') {
      i++; const o = {}; ws(); if (src[i] === '}') { i++; return o; }
      for (;;) {
        ws(); const k = val(':,}'); ws();
        if (src[i] !== ':') throw new Error(src);
        i++; o[String(k)] = val(',}'); ws();
        if (src[i] === ',') { i++; continue; } if (src[i] === '}') { i++; return o; } throw new Error(src);
      }
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; let j = i + 1;
      while (j < src.length && !(src[j] === q && (q === "'" ? src[j + 1] !== "'" : src[j - 1] !== '\\'))) j += (q === "'" && src[j] === "'" ? 2 : 1);
      const r = lhdYamlScalar(src.slice(i, j + 1)); i = j + 1; return r;
    }
    let j = i;
    while (j < src.length && stop.indexOf(src[j]) < 0) j++;
    const r = lhdYamlScalar(src.slice(i, j)); i = j; return r;
  };
  const r = val('');
  ws(); if (i < src.length) throw new Error(src);
  return r;
}
// satırdaki yorumu sil (tırnak içindeki # hariç; # öncesinde boşluk olmalı)
function lhdYamlStrip(l) {
  let q = null;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { if (i === 0 || /[\s:[{,-]/.test(l[i - 1])) q = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(l[i - 1]))) return l.slice(0, i);
  }
  return l;
}
// "anahtar: değer" ayır (tırnaklı anahtar olabilir); eşleme satırı değilse null
function lhdYamlKey(t) {
  let m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')\s*:(\s+|$)/.exec(t);
  if (m) return { k: lhdYamlScalar(m[1]), rest: t.slice(m[0].length) };
  m = /^([^\s:#[\]{},"'][^:#]*?|[^\s:#[\]{},"'])\s*:(\s+|$)/.exec(t);
  if (m) return { k: m[1].trim(), rest: t.slice(m[0].length) };
  return null;
}
function lhdYamlParse(text) {
  text = String(text || '').replace(/\r\n?/g, '\n').replace(/\t/g, '  ');
  const tt = text.trim();
  if (!tt) return null;
  if (tt[0] === '{' || tt[0] === '[') { try { return JSON.parse(tt); } catch (e) { /* YAML akış biçimi olabilir */ } }
  const raw = text.split('\n');
  const L = [];   // { n: satır no, ind, t: metin, raw }
  raw.forEach((r, n) => { const s = lhdYamlStrip(r); if (s.trim() && s.trim() !== '---') L.push({ n: n + 1, ind: s.length - s.replace(/^ +/, '').length, t: s.trim(), raw: r }); });
  let p = 0;
  const fail = (l) => { const e = new Error('YAML (' + l.n + ')'); e.line = l.n; throw e; };
  // | ve > çok satırlı metin: ham satırlardan okunur (yorum silinmez, boş satırlar korunur)
  const block = (hdr, parentInd, startLine) => {
    const out = [];
    let i = startLine, ind = -1;
    while (i < raw.length) {
      const r = raw[i].replace(/\t/g, '  ');
      if (!r.trim()) { out.push(''); i++; continue; }
      const ri = r.length - r.replace(/^ +/, '').length;
      if (ri <= parentInd) break;
      if (ind < 0) ind = ri;
      out.push(r.slice(Math.min(ind, ri))); i++;
    }
    while (out.length && out[out.length - 1] === '') out.pop();
    while (p < L.length && L[p].n <= i) p++;
    let s = hdr[0] === '>' ? out.join('\n').replace(/([^\n])\n(?=[^\n ])/g, '$1 ') : out.join('\n');
    if (hdr.indexOf('-') < 0) s += '\n';
    return s;
  };
  const value = (rest, l, ind) => {
    rest = rest.trim();
    if (/^[|>][-+]?$/.test(rest)) return block(rest, ind, l.n);
    if (rest !== '') return lhdYamlScalar(rest);
    if (p < L.length && L[p].ind > ind) return node(L[p].ind);
    if (p < L.length && L[p].ind === ind && /^-(\s|$)/.test(L[p].t)) return node(ind);   // "anahtar:" altındaki liste aynı girintide olabilir
    return null;
  };
  const node = (ind) => {
    const l0 = L[p];
    if (/^-(\s|$)/.test(l0.t)) {
      const arr = [];
      while (p < L.length && L[p].ind === ind && /^-(\s|$)/.test(L[p].t)) {
        const l = L[p], rest = l.t.slice(1).replace(/^ +/, ''), sub = ind + (l.t.length - rest.length);
        p++;
        if (!rest) { arr.push(p < L.length && L[p].ind > ind ? node(L[p].ind) : null); continue; }
        const kv = lhdYamlKey(rest);
        if (kv && !/^[[{"']/.test(rest)) {   // "- anahtar: değer" → eşleme, devamı aynı girintide
          const o = {}; o[kv.k] = value(kv.rest, l, sub);
          while (p < L.length && L[p].ind === sub) {
            const k2 = lhdYamlKey(L[p].t); if (!k2) fail(L[p]);
            const l2 = L[p]; p++; o[k2.k] = value(k2.rest, l2, sub);
          }
          arr.push(o);
        } else arr.push(value(rest, l, ind));
      }
      return arr;
    }
    const o = {};
    while (p < L.length && L[p].ind === ind) {
      const l = L[p], kv = lhdYamlKey(l.t);
      if (!kv) { if (Object.keys(o).length === 0 && p === 0) { p++; return lhdYamlScalar(l.t); } fail(l); }
      p++;
      o[kv.k] = value(kv.rest, l, ind);
    }
    return o;
  };
  const r = node(L[0].ind);
  if (p < L.length) fail(L[p]);
  return r;
}
// YAML yazıcı: düzenleme kutusunda gösterilecek metin
function lhdYamlDump(v, ind) {
  ind = ind || '';
  const sc = (x) => {
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'number' || typeof x === 'boolean') return String(x);
    const s = String(x);
    if (s === '' || /^[\s]|[\s]$|^[-?:,[\]{}#&*!|>'"%@`]|: | #|^(true|false|null|yes|no|on|off|~)$/i.test(s) || /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return JSON.stringify(s);
    return s;
  };
  const multi = (s, i2) => typeof s === 'string' && s.indexOf('\n') >= 0 ? '|' + (/\n$/.test(s) ? '' : '-') + '\n' + s.replace(/\n$/, '').split('\n').map((x) => (x ? i2 + x : '')).join('\n') : null;
  if (Array.isArray(v)) {
    if (!v.length) return ind + '[]';
    return v.map((x) => {
      if (x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length) { const d = lhdYamlDump(x, ind + '  '); return ind + '- ' + d.slice(ind.length + 2); }
      if (Array.isArray(x) && x.length) return ind + '-\n' + lhdYamlDump(x, ind + '  ');
      const m = multi(x, ind + '  ');
      return ind + '- ' + (m || (Array.isArray(x) ? '[]' : (x && typeof x === 'object') ? '{}' : sc(x)));
    }).join('\n');
  }
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    if (!ks.length) return ind + '{}';
    return ks.map((k) => {
      const x = v[k], kk = /^[A-Za-z_][\w-]*$/.test(k) ? k : JSON.stringify(k);
      if (x && typeof x === 'object' && (Array.isArray(x) ? x.length : Object.keys(x).length)) return ind + kk + ':\n' + lhdYamlDump(x, ind + '  ');
      const m = multi(x, ind + '  ');
      return ind + kk + ': ' + (m || (Array.isArray(x) ? '[]' : (x && typeof x === 'object') ? '{}' : sc(x)));
    }).join('\n');
  }
  return ind + sc(v);
}

// Yönetim panelindeki ? yardım pencereleri: [başlık, paragraflar...]. **kalın** yazılabilir. tr ve en.
// Her biri: ne işe yarar, nasıl ayarlanır, bir örnek.
const LHD_HELP = {
  twin: {
    tr: ['Yedek kontrol', 'Bazı lambalar Home Assistant\'ta iki kez görünür: örneğin bir Govee lamba hem govee2mqtt (LAN, hızlı) hem Matter (yavaş ama güvenilir) ile. Buraya lambanın ikinci kopyası seçilir.',
      'Dokununca komut her zaman bu öğenin kendisinden (hızlı yoldan) gider. Lambanın açık mı kapalı mı olduğu iki kopyadan hangisi en son değiştiyse ondan okunur; biri takılı kalırsa öbürü düzeltir.',
      'Lamba birkaç saniye içinde cevap vermezse aynı komut yedekten gönderilir ve karonun köşesinde turuncu bir nokta çıkar (30 dakika kalır). Normalde gecikme değişmez.',
      'Örnek: Alt Kat WC Tavan (govee2mqtt) öğesine yedek olarak "Alt Kat WC Tavan (Matter)" seç. Wi-Fi gidip geldiğinde govee2mqtt takılsa bile lamba açılıp kapanır.'],
    en: ['Backup control', 'Some lamps show up twice in Home Assistant: for example a Govee lamp through govee2mqtt (LAN, fast) and Matter (slower but reliable). Pick the lamp\'s second copy here.',
      'A tap always sends the command through this item first (the fast path). Whether the lamp is on is read from whichever copy changed last, so a stuck one is corrected by the other.',
      'If the lamp does not answer within a few seconds, the same command is sent through the backup and an orange dot appears in the tile\'s corner (for 30 minutes). Normally nothing gets slower.',
      'Example: give the Downstairs WC Ceiling (govee2mqtt) item the backup "Downstairs WC Ceiling (Matter)". Even if govee2mqtt gets stuck after a Wi-Fi drop, the lamp still turns on and off.'] },
  walls: {
    tr: ['Duvar anahtarları', 'Duvardaki anahtarın arkasındaki röle (Sonoff, ESPHome...) lambanın elektriğini kesmiyor, yalnız sinyal veriyorsa buradan bir lambaya bağlanır.',
      'Anahtara elle basınca lamba açılır ya da kapanır; yedek kontrolü olan lambada yedek yol da kullanılır. Home Assistant\'tan ya da bir otomasyondan rölenin değişmesi yok sayılır.',
      'Açarken parlaklık ve renk sıcaklığı verilebilir (boş bırakılırsa lamba son ayarıyla açılır).',
      'Aynı anahtar için Home Assistant\'ta ayrıca bir otomasyon varsa onu kapat; yoksa her basışta iki kez çalışır.'],
    en: ['Wall switches', 'If the relay behind a wall switch (Sonoff, ESPHome...) does not cut the lamp\'s power but only gives a signal, bind it to a lamp here.',
      'Pressing the switch by hand turns the lamp on or off; a lamp with backup control also uses the backup path. Relay changes made by Home Assistant or an automation are ignored.',
      'Brightness and colour temperature can be set for turning on (left empty, the lamp turns on with its last setting).',
      'If Home Assistant also has an automation for the same switch, turn it off; otherwise each press runs twice.'] },
  mode: {
    tr: ['Basit ve Gelişmiş mod', 'Basit modda yalnız temel ayarlar görünür: sekme, bölüm, cihaz ekleme, ad, simge, görünüm ve dokununca ne olacağı.',
      'Gelişmiş modda boyutlar, renkler, koşullu görünürlük, özel eylemler, kartlar ve bölüm yerleşimi de açılır.',
      'Mod değişince hiçbir ayar silinmez: basit modda gizlenen ayarlar panoda çalışmaya devam eder. Seçim bu tarayıcıda hatırlanır.'],
    en: ['Simple and Advanced mode', 'Simple mode shows only the basics: tabs, sections, adding devices, name, icon, look and what a tap does.',
      'Advanced mode also opens sizes, colours, conditional visibility, custom actions, cards and section layout.',
      'Switching never deletes anything: settings hidden in simple mode keep working on the dashboard. The choice is remembered in this browser.'] },
  look: {
    tr: ['Görünüm', 'Öğenin panoda hangi şekilde çizileceği.', '**Karo**: kare kutu, ışıkların yanında. **Düğme**: yatay düğme (senaryolar gibi), adın altında durum. **Satır**: ince, tek satır; simge, ad ve değer, kutuya yan yana üç tane sığar. **Halo**: sayısal değer Halo sensör kartı olarak (gelişmiş).',
      'Örnek: Bluetooth bağlantı sensörlerini "Satır" yap, ışık kutusunun altında ince satırlar olarak dursunlar.'],
    en: ['Look', 'How the item is drawn on the dashboard.', '**Tile**: a square next to the lights. **Button**: a wide button (like scenes) with the state under the name. **Row**: a thin single line with icon, name and value; three fit side by side. **Halo**: a numeric value as a Halo sensor card (advanced).',
      'Example: make the Bluetooth connection sensors "Row" so they sit as thin lines under the lights.'] },
  size: {
    tr: ['Boyut', 'Karonun ızgarada kaç hücre kapladığı: 1×1 (normal), 2×1 (iki geniş), 1×2 (iki uzun), 2×2 ya da Satır boyu.', 'Geniş tek satırlık karoda simge ve yazı yan yana dizilir. Diğer karolar boşlukları kendiliğinden doldurur.',
      'Simge boyutu ve Yazı boyutu: Otomatik bugünkü ölçüdür; Küçük, Orta, Büyük.'],
    en: ['Size', 'How many cells the tile takes in the grid: 1×1 (normal), 2×1 (wide), 1×2 (tall), 2×2 or Full row.', 'A wide one-row tile puts icon and text side by side. Other tiles fill the gaps by themselves.',
      'Icon size and Text size: Auto is today\'s size; Small, Medium, Large.'] },
  colors: {
    tr: ['Renkler', '**Simge**: simgenin rengi; verilince simge tek renk çizilir. **Açıkken**: cihaz açıkken çerçeve ve simge rengi. **Arka plan**: karoya hafif renk tonu.', 'Yuvarlaklar Halo kartlarının renkleridir (yeşil, mavi, açık mavi, sarı, turuncu, kırmızı, mor, gri); en sağdaki kutudan istediğin rengi seçebilirsin. "Yok" rengi kaldırır.',
      'Halo görünümünde tek bir "Sabit renk" vardır: kartın halesi hep o renkte olur.'],
    en: ['Colours', '**Icon**: the icon colour; the icon is then drawn in one colour. **When on**: frame and icon colour while the device is on. **Background**: a light tint on the tile.', 'The dots are the Halo card colours (green, blue, light blue, yellow, orange, red, purple, grey); the box on the right picks any colour. "None" removes it.',
      'The Halo look has a single "Fixed colour": the card\'s halo always takes it.'] },
  zones: {
    tr: ['Değere göre renk', 'Sayısal bir değeri 4 sınırla 5 bölgeye ayırır; her bölgenin rengi var. Değer bir sınıra eşit ya da büyükse bir sonraki renge geçer.', 'Çerçeve, değer yazısı ve simge o bölgenin renginde olur.',
      'Örnek, akvaryum suyu: 22 / 24 / 28 / 30 sınırları ve açık mavi, mavi, yeşil, sarı, kırmızı renkleri. 26,8 °C yeşil, 31 °C kırmızı görünür.'],
    en: ['Colour by value', 'Splits a numeric value into 5 zones with 4 limits; each zone has a colour. When the value reaches a limit it moves to the next colour.', 'The frame, the value text and the icon take the zone\'s colour.',
      'Example, aquarium water: limits 22 / 24 / 28 / 30 with light blue, blue, green, yellow, red. 26.8 °C shows green, 31 °C red.'] },
  statecol: {
    tr: ['Duruma göre renk', 'Bir varlığın durumunu (yazısını) renge eşler. Metin değerlerde de çalışır, sayı gerekmez.', 'Varlık boşsa öğenin kendi varlığı kullanılır. Başka bir varlık da seçilebilir: kart bir şeyi gösterirken rengi başka bir sensörden alabilir.',
      'Örnek, yem kartı: Varlık sensor.balik_yem_durumu; aktif → yeşil, yem → sarı, uyari → turuncu, acil → kırmızı. Durum değişince kartın rengi de değişir.'],
    en: ['Colour by state', 'Maps an entity\'s state (its text) to a colour. Works for text values too, no number needed.', 'With the entity empty, the item\'s own entity is used. Another entity can be chosen: a card can show one thing and take its colour from another sensor.',
      'Example, feeding card: entity sensor.feeding_status; active → green, due → yellow, warning → orange, urgent → red. When the state changes, the card\'s colour follows.'] },
  visible: {
    tr: ['Sadece şu durumda göster', 'Öğe yalnız seçilen varlık belirli bir durumdayken görünür. Koşul sağlanmazsa panoda hiç çizilmez, yerinde boşluk kalmaz; yönetim panelinin önizlemesinde soluk görünür.',
      '**şuna eşitse**: tek durum. **şunlardan biriyse**: virgülle birkaç durum. **şunlar değilse**: bu durumlarda gizli.',
      'Örnek: aynı yem göstergesini dört kez ekle, her birini sensor.balik_yem_durumu = aktif / yem / uyari / acil durumunda göster; her an yalnız biri görünür.'],
    en: ['Only show when', 'The item shows only while the chosen entity is in a given state. Otherwise it is not drawn at all and leaves no gap; it shows faded in the admin preview.',
      '**equals**: one state. **is one of**: several states, comma separated. **is none of**: hidden in these states.',
      'Example: add the same feeding gauge four times and show each when sensor.feeding_status = active / due / warning / urgent; only one is visible at a time.'] },
  actions: {
    tr: ['Dokununca / Basılı tutunca', '**Varsayılan**: öğenin türüne göre (ışıkta aç/kapat, değerde cihaz penceresi). **Cihaz penceresi**, **Aç / kapat**, **Hiçbir şey** temel seçeneklerdir.',
      '**Servis çalıştır** (gelişmiş): ör. Servis timer.start, Hedef timer.balik_besleme. İstenirse Veri kutusuna YAML (duration: "00:10:00").',
      '**Pencerede kart aç** (gelişmiş): bir Home Assistant kartını panonun kendi penceresinde açar. **Gelişmiş (YAML)**: Home Assistant\'ın eylem biçimi aynen yazılır.'],
    en: ['On tap / On hold', '**Default**: by the item\'s kind (toggle for a light, more info for a value). **More info**, **Toggle**, **Nothing** are the basic choices.',
      '**Call a service** (advanced): e.g. Service timer.start, Target timer.fish_feeding. Optional YAML in Data (duration: "00:10:00").',
      '**Open a card in a window** (advanced): opens a Home Assistant card in the dashboard\'s own window. **Advanced (YAML)**: Home Assistant\'s action format as is.'] },
  popup: {
    tr: ['Pencerede kart aç', 'Düğmeye ya da karoya dokununca bir Home Assistant kartı, ışık penceresi gibi panonun kendi penceresinde açılır. Dışarı dokunmak, X ya da geri tuşu kapatır.',
      'Pencere başlığı ve kartın YAML\'ı yazılır. Kurulu özel kartlar da olur.', 'Örnek: Başlık "Akvaryum ışık programı", Kart: type: custom:akvaryum-program-card'],
    en: ['Open a card in a window', 'Tapping the button or tile opens a Home Assistant card in the dashboard\'s own window, like the light window. Tap outside, X or the back button closes it.',
      'Write the window title and the card\'s YAML. Installed custom cards work too.', 'Example: title "Aquarium light schedule", card: type: custom:aquarium-schedule-card'] },
  card: {
    tr: ['Kart (YAML)', 'Bölüme herhangi bir Home Assistant kartı eklenir: markdown, grafik, kurulu özel kartlar. Kartın YAML\'ı, Home Assistant\'ın kart düzenleyicisindeki "Kod düzenleyici" ile aynıdır.',
      'Kart yüklenemezse yerinde kısa bir uyarı çıkar, pano bozulmaz. Gelişmiş modda kartın yüksekliği ve dokununca ne olacağı da verilebilir.',
      'Örnek:\ntype: markdown\ncontent: "**Akvaryum** · Program: Gündüz"'],
    en: ['Card (YAML)', 'Adds any Home Assistant card to the section: markdown, graphs, installed custom cards. The YAML is the same as Home Assistant\'s card editor "Code editor".',
      'If the card can\'t load, a short warning shows in its place and the dashboard keeps working. In advanced mode you can also set its height and what a tap does.',
      'Example:\ntype: markdown\ncontent: "**Aquarium** · Schedule: Day"'] },
  halo: {
    tr: ['Halo görünümü', 'Sayısal bir değer (sensör, sayı) Halo sensör kartı olarak çizilir: solda simge, arkasında değere göre renk alan hale.',
      'Yükseklik: 1, 1,5 ya da 2 satır. Bölüm "Kutuyu doldur" ise kartlar kolona eşit yayılır. Simge ve yazı boyutu da büyütülebilir.',
      'Renk: Halo kendi bölgelerini kullanır (sıcaklık, nem, CO₂...). Sabit renk ya da Duruma göre renk verilirse hale o renkte olur.'],
    en: ['Halo look', 'A numeric value (sensor, number) is drawn as a Halo sensor card: the icon on the left with a halo coloured by the value.',
      'Height: 1, 1.5 or 2 rows. With the section set to "Fill the box", the cards share the column evenly. Icon and text can be made larger too.',
      'Colour: Halo uses its own zones (temperature, humidity, CO₂...). With a fixed colour or colour by state, the halo takes that colour.'] },
  pet: {
    tr: ['Besleme kartı', 'Evcil hayvan için besleme hatırlatıcısı. Zamanında yeşil, yaklaşınca sarı, zamanı gelince turuncu, gecikince kırmızı ve yanıp söner.',
      '**Her N saatte bir**: son beslemeden N saat sonra. **Günün belli saatlerinde**: ör. 08:00, 20:00; sıradaki saatten en çok "yaklaşıyor" süresi kadar önce verilen yem o saati karşılar.',
      'Karta dokununca "Besledim" kaydedilir (10 sn içinde yeniden dokununca geri alınır), basılı tutunca son beslemeler açılır. Home Assistant\'ta her hayvan için bir besleme durumu ve "besledim" düğmesi oluşur; otomasyonda, sesli asistanda ya da NFC etiketinde kullanılabilir.'],
    en: ['Feeding card', 'A feeding reminder for a pet. Green on time, yellow when due soon, orange when due, red and blinking when late.',
      '**Every N hours**: N hours after the last feeding. **At set times of day**: e.g. 08:00, 20:00; food given up to the "soon" time before the next slot covers that slot.',
      'Tap the card to record "Fed" (tap again within 10 s to undo), hold for recent feedings. Home Assistant gets a feeding status and a "fed" button for every pet, usable in automations, voice assistants or NFC tags.'] },
  fill: {
    tr: ['Doldurma, hizalama, aralık', '**İçeriğe göre**: öğeler kendi boylarında, kutunun üstünden başlar. **Kutuyu doldur**: düğmeler, karolar ve kartlar kutunun yüksekliğine eşit dağılır.',
      '**Hizalama** (içeriğe göre olan kutuda): Üst, Orta ya da Eşit dağıt. Başlık hep üstte kalır.', '**Aralık**: öğeler arasındaki boşluk (0-24 px). Otomatik: bugünkü (doldururken 12 px).'],
    en: ['Fill, alignment, spacing', '**Fit content**: items keep their size from the top of the box. **Fill the box**: buttons, tiles and cards share the box height evenly.',
      '**Alignment** (for fit content): Top, Middle or Spread evenly. The title always stays on top.', '**Spacing**: the gap between items (0-24 px). Auto: as before (12 px when filling).'] },
  tpl: {
    tr: ['Şablon metin ve ikinci satır', 'Ad ya da ikinci satır Home Assistant şablonu olabilir: {{ ... }} ve {% ... %}. Home Assistant hesaplar, değer değişince yazı kendiliğinden güncellenir.',
      '**İkinci satır**: Durum (cihazın durumu, birimiyle), Son değişim ("5 dk önce"), Öznitelik (ör. brightness, battery) ya da Şablon.',
      "Örnekler: {{ states('sensor.esp_wifi') }} dBm  ·  {% if is_state('binary_sensor.sol_baglanti', 'on') %}Bağlı{% else %}Bağlantı yok{% endif %}  ·  Çevrimiçi · {{ states('sensor.esp_wifi') }} dBm"],
    en: ['Template text and second line', "The name or the second line can be a Home Assistant template: {{ ... }} and {% ... %}. Home Assistant renders it and the text updates by itself.",
      '**Second line**: State (with unit), Last changed ("5 min ago"), Attribute (e.g. brightness, battery) or Template.',
      "Examples: {{ states('sensor.esp_wifi') }} dBm  ·  {% if is_state('binary_sensor.left_link', 'on') %}Connected{% else %}No connection{% endif %}  ·  Online · {{ states('sensor.esp_wifi') }} dBm"] },
  splits: {
    tr: ['Kolon içi sütun', 'Bir kolonu eşit genişlikte 2 ya da 3 sütuna böler; her bölüm hangi sütunda duracağını kendi ayarından seçer.', 'Örnek: orta kolonda yan yana iki senaryo bölümü. Kolon çok darsa bölünmez, önce kolon sayısını azalt.'],
    en: ['Sub-columns', 'Splits a column into 2 or 3 equal sub-columns; each section picks its sub-column in its own settings.', 'Example: two scene sections side by side in the middle column. A column that is too narrow can\'t be split; reduce the number of columns first.'] }
};
// Öğede basit modda görünmeyen bir ayar var mı (rozet ve uyarı için)
function lhdItemAdv(it) {
  if (!it || typeof it !== 'object') return false;
  const keys = ['size', 'icon_size', 'text_size', 'color_on', 'bg', 'zones', 'state_colors', 'visible', 'height', 'hold', 'icon_on', 'icon_off', 'card', 'subtitle'];
  for (let i = 0; i < keys.length; i++) if (Object.prototype.hasOwnProperty.call(it, keys[i])) return true;
  if (it.entity && it.color) return true;
  if (it.look === 'halo') return true;
  const basic = (a) => a === undefined || a === null || a === 'more-info' || a === 'toggle' || a === 'none';
  if (!basic(it.tap)) return true;
  if (!it.entity && it.action && (it.action.popup || it.action.action || it.action.perform_action)) return true;
  return false;
}

// lemur-home-dashboard-admin: sol menüdeki yönetim paneli.
// Düzen Light Effect Card'ın kontrol paneliyle aynı aile: üstte sekme şeridi (seçili sekmenin ayarları altında birleşik),
// solda panonun canlı önizlemesi (tıklayınca bölüm seçilir), sağda bölüm düzenleyici. Her değişiklik anında kaydedilir,
// açık bütün tabletler canlı güncellenir; "Geri al" (Ctrl+Z) son değişiklikleri geri alır.
// Ayar yokken pano otomatik düzendedir; ilk değişiklikte o düzen kopyalanıp kaydedilir.

const ADM = {
  tr: {
    title: 'Lemur Home Dashboard', auto: 'Otomatik düzen', autoT: 'Pano şu an evin alanlarından kendiliğinden kuruluyor. İlk değişiklikte bu düzen kaydedilir, sonra her şey buradan düzenlenir.',
    undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', settings: 'Ayarlar', more: 'Diğer işlemler', saved: 'Kaydedildi', undone: 'Geri alındı', err: 'Kaydedilemedi: {e}',
    tabName: 'Sekme adı', icon: 'Simge', area: 'Alan', noArea: 'Alan yok', cols: 'Kolonlar', colAdd: 'Kolon ekle', colDel: 'Son kolonu kaldır', colTab: 'Tablet düzeni', colEq: 'Eşit', colHint: 'Genişliği önizlemede kolonların arasındaki çizgiyi sürükleyerek ayarla.', delTab: 'Sekmeyi sil', sure: 'Emin misin?',
    refill: 'Alandan yeniden doldur', refillT: 'Bu sekmenin bölümleri seçili alanın cihazlarıyla baştan kurulur.', addTab: 'Sekme', newTab: 'Yeni sekme', emptyTab: 'Boş sekme', fromArea: 'Alandan sekme',
    preview: 'Önizleme', pvHint: 'Kutuyu ⠿ tutamağından, öğeyi kendisinden sürükle · çizgilerden boyutlandır', splits: 'Kolon içi sütun', splitsT: 'Bir kolonu eşit genişlikte 2-3 sütuna böler (ör. yan yana iki senaryo bölümü). Kolon dar ise yer açmak için kendiliğinden genişler.', splitNarrow: 'Bu kadar sütun ekrana sığmaz: önce kolon sayısını azalt', sub: 'Sütun', sections: 'Bölümler', addSec: 'Bölüm ekle', noSec: 'Bu sekmede bölüm yok.',
    secTitle: 'Başlık', column: 'Kolon', colL: 'Sol', colM: 'Orta', colR: 'Sağ', tileCols: 'Satırdaki karo', look: 'Görünüm', lookTile: 'Karo', lookBar: 'Kaydırmalı', lookPhone: 'Telefonda otomatik', lookTileT: 'Kare karolar: dokun aç/kapat, basılı tut pencere', lookBarT: 'Yatay çubuklar: dokun aç/kapat, sağa-sola kaydır parlaklık, basılı tut pencere', lookPhoneT: 'Tablette karo, telefonda kaydırmalı çubuk', barCols: 'Satırdaki çubuk', delSec: 'Bölümü sil',
    t_values: 'Değerler', t_cards: 'Kartlar', t_subs: 'Alt başlık', t_free: 'Boş bölüm', t_lights: 'Işıklar', t_scenes: 'Senaryolar', t_climate: 'İklim', t_vacuum: 'Süpürge', t_media: 'Medya', d_free: 'Başlıksız boş kutu', secFree: 'Bölüm türü sadece başlangıç: her bölüme her şey eklenebilir, her öğe kendi türüne göre görünür.', pfAll: 'Tümü', pfTile: 'Işık ve anahtar', titleOpt: 'Başlık (isteğe bağlı)',
    d_lights: 'Işık, priz, perde karoları', d_scenes: 'Script, sahne ve otomasyon düğmeleri', d_climate: 'Klima ve petek kartları (Yaz/Kış)', d_vacuum: 'Robot süpürge kartları', d_media: 'TV ve hoparlörler',
    n_items: '{n} öğe', addDev: 'Ekle', addPh: 'Boş karo', addScene: 'Düğme ekle', name: 'Ad', target: 'Çalıştırılacak', noItems: 'Henüz öğe yok.',
    tSensor: 'Sıcaklık sensörü', hSensor: 'Nem sensörü', fromDevice: 'Cihazdan', noOutdoor: 'Dış sıcaklık yok', noLink: 'Birlikte kontrol yok', linkT: 'Birlikte kontrol edilen cihaz (ör. aynı odadaki ikinci petek)', outdoorT: 'Dış sıcaklık sensörü (petek kartı ısıtma ihtiyacını gösterir)', addScPh: 'Boş düğme', kind: 'Tür', k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Geniş 16:9', scr_phone: 'Telefon', scr_here: 'Bu ekran',
    pickT: 'Ekle', search: 'Ara: ad, alan ya da varlık kimliği', cancel: 'Vazgeç', addN: 'Ekle ({n})', added: 'Ekli', noArea2: 'Alanı olmayanlar', nothing: 'Eşleşen cihaz yok.',
    sHelp: 'Yardım', repT: 'Sorun bildir', repS: 'Sürüm ve cihaz bilgisiyle GitHub\'da kayıt açar; ne olduğunu yazman yeter', repQ: 'Ne oldu?', repPh: 'Ne yaptın, ne bekliyordun, ne oldu? Örnek: Salon sekmesinde ışık çubuğunu kaydırınca parlaklık değişmiyor.', repInfo: 'Kayda eklenecek bilgiler', repInfoS: 'Kişisel bilgi yok: oda, cihaz ve kişi adları, adresin ya da hesabın eklenmez.', repNoGh: 'GitHub hesabın yoksa metni kopyalayıp geliştiriciye ilet.', repCopy: 'Metni kopyala', repCopied: 'Kopyalandı', repGh: 'GitHub\'da aç', rWhat: 'Ne oldu?', rInfoH: 'Bilgiler', rPanel: 'Pano', rInt: 'entegrasyon', rHa: 'Home Assistant', rBrowser: 'Tarayıcı', rApp: 'HA uygulaması', rScreen: 'Ekran', rTouch: 'dokunmatik', rNoTouch: 'dokunmatik değil', rCanvas: 'kanvas', rLang: 'Dil', rLayout: 'Düzen', rAuto: 'otomatik', rTabs: 'sekme', rSecs: 'bölüm', rItems: 'öğe', rKinds: 'Öğe türleri', rLook: 'Görünüm', rLec: 'Light Effect Card', rErr: 'Son hatalar', rNoErr: 'yok', sBackup: 'Yedek', bkDown: 'Yedeği indir', bkDownS: 'Sekmeler, bölümler ve ayarlar tek dosyada', bkUp: 'Yedekten geri yükle', bkUpS: 'Bir yedek dosyası seç; önce onay sorulur, şu anki düzenin yerine geçer', bkQ: 'Yedek geri yüklensin mi?', bkW: '{d} tarihli yedek (v{v}): {n} sekme, {s} bölüm. Şu anki sekmeler, bölümler ve ayarlar bu yedekle değiştirilir. Geri al ile dönebilirsin.', bkVer: 'Yedek v{v} ile alınmış; yine de yüklenebilir.', bkSvc: 'Bu yedekteki hayvanlar şu servisleri kendiliğinden çalıştırır:', twinL: 'Yedek kontrol', twinNone: 'Yok', twinT: 'Lamba cevap vermezse komut buradan da gönderilir', sWalls: 'Duvar anahtarları', wallsT: 'Röle yalnız sinyal veriyorsa elle basınca seçilen lamba açılır/kapanır', wallSw: 'Anahtar', wallLight: 'Lamba', wallBr: 'Parlaklık %', wallK: 'Kelvin', wallAdd: 'Anahtar ekle', wallDel: 'Kaldır', wallPick: 'Seç…', wallNone: 'Henüz duvar anahtarı yok.', wallAuto: 'Bu anahtar için HA\'da ayrıca bir otomasyon varsa kapat: {n}', bkYes: 'Geri yükle', bkSaved: 'Yedek indirildi', bkOk: 'Yedek geri yüklendi', bkErr: 'Bu dosya bir pano yedeği değil', newsT: 'Yenilikler', newsV: 'v{v} ile gelenler', newsOld: 'Önceki sürümler', newsAll: 'Bütün notlar GitHub\'da', newsOk: 'Tamam', newsLink: 'Yenilikler', sVer: 'Sürüm ve güncelleme', updT: 'Sürüm', updInst: 'Yüklü: v{v}', updCheck: 'Güncellemeleri denetle', updChecking: 'Denetleniyor…', updOk: 'güncel', updAt: 'son kontrol {t}', updNew: 'v{v} hazır', updNotes: 'Yenilikler', updNoHacs: 'HACS ile kurulmadığı için buradan yüklenemiyor', updGo: 'Güncelle', updGh: 'GitHub’da aç', updIng: 'v{v} indiriliyor…', updDone: 'v{v} indirildi. Home Assistant yeniden başlayınca devreye girer.', updRestart: 'Yeniden başlat', updAsk: 'Home Assistant yeniden başlasın mı? Bir iki dakika ışık kontrolü ve otomasyonlar durur.', updYes: 'Evet, yeniden başlat', updRest: 'Yeniden başlatılıyor… Açılınca sayfa kendiliğinden yenilenir.', updErr: 'Denetlenemedi: {e}', updAgain: 'Tekrar denetle', s_board: 'Pano', s_look: 'Görünüm', s_screen: 'Ekran', s_info: 'Bilgi',
    lang: 'Dil', lAuto: 'Otomatik', season: 'Mevsim', seasonT: 'İklim bölümünde Yaz klimaları, Kış petekleri gösterir. Otomatik: Mayıs-Eylül yaz.', sAuto: 'Otomatik', sSum: 'Yaz', sWin: 'Kış',
    bg: 'Arka plan', bgT: 'Koyu: tablet panosundaki zemin. Renk: istediğin düz renk. Efekt: Light Effect Card\'ın efekt renkleriyle yumuşak ışıltı. Resim: /local/zemin.jpg gibi bir adres.', bgDark: 'Koyu', bgBlack: 'Siyah', bgColor: 'Renk', bgFx: 'Efekt', bgImg: 'Resim', bgUrl: 'Resim adresi', bgBad: 'Bu adreste resim açılmadı: dosyayı HA\'nın config/www klasörüne koy, adresi /local/dosya.jpg diye yaz.',
    theme: 'HA teması', themeT: 'Boş bırakılabilir; açılır pencereler bu temayla gelir.', kHeader: 'Üst barı gizle', kHeaderT: 'Bu panoda HA\'nın başlık çubuğu görünmez.',
    kSide: 'Yan menüyü gizle', kSideT: 'Bu panoda HA\'nın sol menüsü görünmez.', canvas: 'Kanvas', canvasT: 'Tasarım genişliği ve referans yüksekliği (px). Pano ekrana bu oranla ölçeklenir.',
    version: 'Sürüm', lec: 'Lemur Light Effect Card', lecOn: 'Kurulu ({v}). Efekt ekranı üst şeritten, ışık penceresinden ve senaryo düğmelerinden açılır.', lecOff: 'Kurulu değil. Işık efektleri için isteğe bağlı olarak kurulabilir; kurulunca efekt düğmeleri burada açılır.', lecNav: 'Üst şeritte Efektler', lecNavT: 'Panonun üst şeridinde, oda düğmelerinin yanında efekt ekranını açan düğme', lecInfoT: 'Lemur Light Effect Card kurulu', lecInfo: 'Panonun üst şeridine Efektler düğmesi eklendi: dokununca efekt ekranı o sekmenin odasıyla açılır. Senaryo bölümlerine tek tek efekt düğmesi de ekleyebilirsin (bölümü seç → Düğme ekle → Işık efektleri). Işık penceresindeki Efekt sekmesi de efekt ekranını açar.', ok: 'Tamam', iconPick: 'Simge seç', iconSug: 'Önerilen', iconAll: 'Arama sonuçları', iconSearch: 'Ara (ör. lamba, sofa, tavan)', iconMore: 'İlk {n} sonuç gösteriliyor, aramayı daralt', iconNone: 'Bulunamadı. Simgenin adını mdi:... diye yazabilirsin.', iconLoading: 'Simgeler yükleniyor…', icCol: 'Simgeler', iconEvery: 'Tüm simgeler', icColNone: 'Simgeler yüklenemedi.', icStyle: 'Simge stili', icStyleT: 'Otomatik: kapalı cihazlar gri, açıklar renkli. Renkli: hepsi renkli. Düz: hepsi gri. Tek renk: çizgiler tek tonda; kapalılar gri, açıklar seçtiğin renkte.', icAuto: 'Otomatik', icFlat: 'Düz', icColor: 'Renkli', icTint: 'Tek renk', icTintC: 'Renk seç', icTintL: 'Işıkta ışığın rengi', icTintLT: 'Tek renk stilinde açık ışığın simgesi lambanın kendi renginde görünür.', icLec: 'Efekt simgeleri', icLecNone: 'Efekt simgeleri yüklenemedi.', hold: 'Işığa basılı tutunca', holdT: 'Işık karosuna basılı tutunca açılan pencere', hPop: 'Işık penceresi', hHa: 'HA penceresi', hLec: 'Efekt ekranı', lecOpen: 'Efekt ekranı', lecStop: 'Efekti durdur', lecGroup: 'Işık efektleri · {r}', lecLoading: 'Efektler yükleniyor…', tOpen: 'Efekt ekranı · {r}', tPlay: 'Efekt: {e} · {r}', tStop: 'Efekti durdur · {r}', roomByTab: 'sekmenin odası', lecNa: 'Lemur Light Effect Card kurulu değil: bu düğme panoda görünmez',
    resetAll: 'Otomatik düzene dön', resetQ: 'Bütün sekme ve bölümler silinir, pano yeniden evin alanlarından kurulur. Ayarlar kalır.', resetOk: 'Otomatik düzene dönüldü',
    secL: 'İkinci satır', sc_none: 'Yok', sc_state: 'Durum', sc_lc: 'Son değişim', sc_attr: 'Öznitelik', sc_tpl: 'Yazı ya da şablon', swapL: 'Ad üstte, değer altta', cfmL: 'Dokununca onay iste', cfmT: 'Yanlışlıkla dokunmaya karşı: önce "çalıştırılsın mı?" diye sorar', cfmText: 'Soru (boşsa "<ad> çalıştırılsın mı?")', nameTplT: 'Ad ve ikinci satırda Home Assistant şablonu yazılabilir: {{ ... }}',
    cpT: 'Kart ekle', cpSearch: 'Kart ara', cpHalo: 'Halo kartları', cpHa: 'Home Assistant kartları', cpCustom: 'Kurulu özel kartlar', cpYaml: 'YAML ile yaz', ceT: 'Kartı düzenle', cePv: 'Önizleme', ceVisual: 'Görsel', ceYaml: 'YAML', ceNoEd: 'Bu kartın görsel düzenleyicisi yok; YAML ile düzenle.', ceLoad: 'Düzenleyici yükleniyor…', ceEdit: 'Görsel düzenle', ceBack: 'Geri',
    modeSimple: 'Basit', modeAdv: 'Gelişmiş', modeT: 'Basit modda yalnız temel ayarlar görünür; gelişmiş ayarlar silinmez, çalışmaya devam eder.', advHas: 'Bu öğede gelişmiş ayarlar var (boyut, renk, koşul ya da özel eylem). Basit modda gizli ama çalışıyor.', advTag: 'gelişmiş', helpT: 'Yardım',
    gapL: 'Aralık', gapAuto: 'Otomatik', heightL: 'Yükseklik', h_rows: '{n} satır', addSub: 'Alt başlık', addSubT: 'Bölümün içinde küçük bir ara başlık (ör. karoların altında BAĞLANTI)', subItem: 'Alt başlık', subText: 'Yazı',
    scL: 'Duruma göre renk', scT: 'Bir varlığın durumuna göre renk (ör. yem durumu: aktif → yeşil, acil → kırmızı). Metin değerlerde de çalışır.', scE: 'Varlık (boşsa öğenin kendisi)', scState: 'Durum', scAdd: 'Satır ekle', cFixed: 'Sabit renk',
    addPet: 'Evcil hayvan', addPetT: 'Besleme kartı: kedi, köpek, balık... için besleme hatırlatıcısı', t_pets: 'Besleme', petItem: 'Besleme kartı', petKind: 'Tür',
    pk_cat: 'Kedi', pk_dog: 'Köpek', pk_fish: 'Balık', pk_bird: 'Kuş', pk_rabbit: 'Tavşan', pk_turtle: 'Kaplumbağa', pk_other: 'Diğer',
    petSched: 'Ne zaman beslenir', pm_interval: 'Her N saatte bir', pm_times: 'Günün belli saatlerinde', petEvery: 'Kaç saatte bir', petTimes: 'Saatler (virgülle)',
    petSoon: 'Yaklaşıyor uyarısı (dk önce)', petGrace: 'Gecikme payı (dk)', petNotify: 'Gecikince bildirim', petNoNotify: 'Bildirim yok', petFeeder: 'Otomatik yemlik (isteğe bağlı)', petFeederT: 'Besledim deyince bu servis de çalışır (ör. button.press)',
    petEnt: 'Home Assistant\'ta "{n} besleme" durumu ve "{n} besledim" düğmesi oluşur; otomasyonlarda kullanılabilir.', petNeedName: 'Hayvanın adını yaz', petFeederBad: 'Yemlik servisi şu alanlardan biri olmalı: {d}',
    lookL: 'Görünüm', lk_tile: 'Karo', lk_button: 'Düğme', lk_row: 'Satır', lk_halo: 'Halo', colorsL: 'Renkler', cIcon: 'Simge', cOn: 'Açıkken', cBg: 'Arka plan', cNone: 'Yok',
    zonesL: 'Değere göre renk', zonesT: '4 sınır, 5 renk: değer bir sınıra eşit ya da büyükse bir sonraki renge geçer (Halo kartlarındaki bölgeler gibi). Çerçeve, değer ve simge bu renkte.', zLim: 'Sınır {n}',
    cardTapT: 'Verilmezse kartın kendi dokunma davranışı', a_defCard: 'Varsayılan: kartın kendisi',
    fillL: 'Doldurma', fillC: 'İçeriğe göre', fillF: 'Kutuyu doldur', fillT: 'Kutuyu doldur: düğmeler ve karolar kutunun yüksekliğine eşit dağılır', alignL: 'Hizalama', alTop: 'Üst', alCenter: 'Orta', alSpread: 'Eşit dağıt',
    sizeL: 'Boyut', sz_row: 'Satır boyu', icSizeL: 'Simge boyutu', txSizeL: 'Yazı boyutu', sz_auto: 'Otomatik', sz_s: 'Küçük', sz_m: 'Orta', sz_l: 'Büyük',
    tPop: 'Pencerede açar: {t}', imT: 'Öğe ayarları', imSave: 'Kaydet', iconOn: 'Açıkken simge', iconOff: 'Kapalıyken simge', tapL: 'Dokununca', holdL: 'Basılı tutunca', actL: 'Ne yapar',
    a_defMore: 'Varsayılan: cihaz penceresi', a_defTog: 'Varsayılan: aç / kapat', a_defHold: 'Varsayılan: ışık ya da cihaz penceresi', a_defRun: 'Varsayılan: seçili hedefi çalıştır', a_more: 'Cihaz penceresi', a_tog: 'Aç / kapat', a_none: 'Hiçbir şey',
    a_svc: 'Servis çalıştır', a_pop: 'Pencerede kart aç', a_yaml: 'Gelişmiş (YAML)', svc: 'Servis', tgt: 'Hedef varlık', svcData: 'Veri (YAML, isteğe bağlı)', popTitle: 'Pencere başlığı', cardY: 'Kart (YAML)', actY: 'Eylem (YAML)',
    visL: 'Sadece şu durumda göster', visT: 'Koşul sağlanmazsa öğe panoda hiç çizilmez, yerinde boşluk kalmaz. Önizlemede soluk görünür.', visE: 'Varlık', v_eq: 'şuna eşitse', v_in: 'şunlardan biriyse', v_not: 'şunlar değilse', visV: 'Durum (birden çoksa virgülle)', visNow: 'Şu an: {s}',
    yamlErr: 'YAML okunamadı: {e}', yamlErrL: 'YAML okunamadı: {n}. satırda girinti ya da yazım hatası var', cardNoType: 'Kartta "type:" satırı yok', addCard: 'Kart', addCardT: 'Halo kartı, Home Assistant kartı ya da kurulu bir özel kart ekle; listeden seç, görsel ayarla', cond: 'koşullu', cardItem: 'Kart', svcNeed: 'Servis "alan.servis" biçiminde olmalı (ör. timer.start)',
    close: 'Kapat', notLoaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.', editNote: 'Not: Bu panoda HA\'nın kendi düzenleyicisinde "kontrolü al" dersen pano bu panelden kopar.'
  },
  en: {
    title: 'Lemur Home Dashboard', auto: 'Automatic layout', autoT: 'The dashboard is currently built from your areas. Your first change saves this layout, then everything is edited here.',
    undo: 'Undo', undoK: 'Undo (Ctrl+Z)', settings: 'Settings', more: 'More', saved: 'Saved', undone: 'Undone', err: 'Could not save: {e}',
    tabName: 'Tab name', icon: 'Icon', area: 'Area', noArea: 'No area', cols: 'Columns', colAdd: 'Add column', colDel: 'Remove last column', colTab: 'Tablet layout', colEq: 'Equal', colHint: 'Set widths by dragging the line between columns in the preview.', delTab: 'Delete tab', sure: 'Sure?',
    refill: 'Refill from area', refillT: 'Rebuilds this tab\'s sections from the devices of the chosen area.', addTab: 'Tab', newTab: 'New tab', emptyTab: 'Empty tab', fromArea: 'Tab from area',
    preview: 'Preview', pvHint: 'Drag boxes by their ⠿ handle, items by themselves · drag lines to resize', splits: 'Columns inside', splitsT: 'Splits a column into 2-3 equal sub-columns (e.g. two scene sections side by side).', splitNarrow: 'This many sub-columns will not fit: use fewer columns first', sub: 'Sub-column', sections: 'Sections', addSec: 'Add section', noSec: 'This tab has no sections.',
    secTitle: 'Title', column: 'Column', colL: 'Left', colM: 'Middle', colR: 'Right', tileCols: 'Tiles per row', look: 'Look', lookTile: 'Tiles', lookBar: 'Sliders', lookPhone: 'Auto on phone', lookTileT: 'Square tiles: tap to toggle, hold for the window', lookBarT: 'Horizontal bars: tap to toggle, swipe sideways for brightness, hold for the window', lookPhoneT: 'Tiles on a tablet, slider bars on a phone', barCols: 'Sliders per row', delSec: 'Delete section',
    t_values: 'Values', t_cards: 'Cards', t_subs: 'Subtitle', t_free: 'Empty section', t_lights: 'Lights', t_scenes: 'Scenes', t_climate: 'Climate', t_vacuum: 'Vacuum', t_media: 'Media', d_free: 'An empty box without a title', secFree: 'The section type is only a start: anything can go into any section, and each item shows in its own way.', pfAll: 'All', pfTile: 'Lights and switches', titleOpt: 'Title (optional)',
    d_lights: 'Light, plug and cover tiles', d_scenes: 'Script, scene and automation buttons', d_climate: 'Air conditioner and radiator cards (summer/winter)', d_vacuum: 'Robot vacuum cards', d_media: 'TVs and speakers',
    n_items: '{n} items', addDev: 'Add', addPh: 'Empty tile', addScene: 'Add button', name: 'Name', target: 'Runs', noItems: 'No items yet.',
    tSensor: 'Temperature sensor', hSensor: 'Humidity sensor', fromDevice: 'From device', noOutdoor: 'No outdoor temperature', noLink: 'No linked device', linkT: 'Device controlled together (e.g. a second radiator in the same room)', outdoorT: 'Outdoor temperature sensor (radiator card shows heating demand)', addScPh: 'Empty button', kind: 'Type', k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Wide 16:9', scr_phone: 'Phone', scr_here: 'This screen',
    pickT: 'Add', search: 'Search: name, area or entity id', cancel: 'Cancel', addN: 'Add ({n})', added: 'Added', noArea2: 'No area', nothing: 'No matching device.',
    sHelp: 'Help', repT: 'Report a problem', repS: 'Opens a GitHub issue with the version and device details; you only write what happened', repQ: 'What happened?', repPh: 'What did you do, what did you expect, what happened? Example: swiping a light bar on the Living room tab does not change the brightness.', repInfo: 'Details added to the issue', repInfoS: 'Nothing personal: no room, device or person names, address or account.', repNoGh: 'No GitHub account? Copy the text and send it to the developer.', repCopy: 'Copy text', repCopied: 'Copied', repGh: 'Open on GitHub', rWhat: 'What happened?', rInfoH: 'Details', rPanel: 'Dashboard', rInt: 'integration', rHa: 'Home Assistant', rBrowser: 'Browser', rApp: 'HA app', rScreen: 'Screen', rTouch: 'touch', rNoTouch: 'no touch', rCanvas: 'canvas', rLang: 'Language', rLayout: 'Layout', rAuto: 'automatic', rTabs: 'tabs', rSecs: 'sections', rItems: 'items', rKinds: 'Item kinds', rLook: 'Look', rLec: 'Light Effect Card', rErr: 'Recent errors', rNoErr: 'none', sBackup: 'Backup', bkDown: 'Download backup', bkDownS: 'Tabs, sections and settings in one file', bkUp: 'Restore a backup', bkUpS: 'Pick a backup file; you are asked first, then it replaces the current layout', bkQ: 'Restore this backup?', bkW: 'Backup from {d} (v{v}): {n} tabs, {s} sections. The current tabs, sections and settings are replaced by it. Undo brings them back.', bkVer: 'The backup was made with v{v}; it can still be restored.', bkSvc: 'The pets in this backup run these services on their own:', twinL: 'Backup control', twinNone: 'None', twinT: 'If the lamp does not answer, the command is also sent through this', sWalls: 'Wall switches', wallsT: 'If the relay only gives a signal, pressing it by hand toggles the chosen lamp', wallSw: 'Switch', wallLight: 'Lamp', wallBr: 'Brightness %', wallK: 'Kelvin', wallAdd: 'Add switch', wallDel: 'Remove', wallPick: 'Pick…', wallNone: 'No wall switches yet.', wallAuto: 'If HA also has an automation for this switch, turn it off: {n}', bkYes: 'Restore', bkSaved: 'Backup downloaded', bkOk: 'Backup restored', bkErr: 'This file is not a dashboard backup', newsT: 'What\'s new', newsV: 'New in v{v}', newsOld: 'Earlier versions', newsAll: 'All notes on GitHub', newsOk: 'OK', newsLink: 'What\'s new', sVer: 'Version and updates', updT: 'Version', updInst: 'Installed: v{v}', updCheck: 'Check for updates', updChecking: 'Checking…', updOk: 'up to date', updAt: 'checked {t}', updNew: 'v{v} is ready', updNotes: 'What’s new', updNoHacs: 'Not installed with HACS, so it cannot be installed from here', updGo: 'Update', updGh: 'Open on GitHub', updIng: 'Downloading v{v}…', updDone: 'v{v} is downloaded. It takes effect when Home Assistant restarts.', updRestart: 'Restart', updAsk: 'Restart Home Assistant? Light control and automations stop for a minute or two.', updYes: 'Yes, restart', updRest: 'Restarting… The page reloads by itself when it is back.', updErr: 'Could not check: {e}', updAgain: 'Check again', s_board: 'Dashboard', s_look: 'Appearance', s_screen: 'Screen', s_info: 'About',
    lang: 'Language', lAuto: 'Automatic', season: 'Season', seasonT: 'The climate section shows air conditioners in summer, radiators in winter. Automatic: May-September is summer.', sAuto: 'Automatic', sSum: 'Summer', sWin: 'Winter',
    bg: 'Background', bgT: 'Dark: the tablet dashboard background. Colour: any solid colour. Effect: a soft glow in the effect colours of Light Effect Card. Image: an address like /local/background.jpg.', bgDark: 'Dark', bgBlack: 'Black', bgColor: 'Colour', bgFx: 'Effect', bgImg: 'Image', bgUrl: 'Image address', bgBad: 'No image opens at this address: put the file in HA\'s config/www folder and write /local/file.jpg.',
    theme: 'HA theme', themeT: 'Optional; dialogs open with this theme.', kHeader: 'Hide the top bar', kHeaderT: 'Home Assistant\'s header is hidden on this dashboard.',
    kSide: 'Hide the sidebar', kSideT: 'Home Assistant\'s sidebar is hidden on this dashboard.', canvas: 'Canvas', canvasT: 'Design width and reference height (px). The dashboard scales to the screen with this ratio.',
    version: 'Version', lec: 'Lemur Light Effect Card', lecOn: 'Installed ({v}). The effect screen opens from the top bar, the light window and scene buttons.', lecOff: 'Not installed. Optional, for light effects; effect buttons turn on here once it is installed.', lecNav: 'Effects in the top bar', lecNavT: 'A button next to the room buttons at the top that opens the effect screen', lecInfoT: 'Lemur Light Effect Card is installed', lecInfo: 'An Effects button was added to the top bar of the dashboard: it opens the effect screen for that tab\'s room. You can also add single effect buttons to scene sections (select the section → Add button → Light effects). The Effect tab in the light window opens the effect screen too.', ok: 'OK', iconPick: 'Choose icon', iconSug: 'Suggested', iconAll: 'Search results', iconSearch: 'Search (e.g. lamp, sofa, ceiling)', iconMore: 'Showing the first {n} results, narrow the search', iconNone: 'Nothing found. You can type the icon name as mdi:...', iconLoading: 'Loading icons…', icCol: 'Icons', iconEvery: 'All icons', icColNone: 'Could not load the icons.', icStyle: 'Icon style', icStyleT: 'Automatic: devices that are off are grey, devices that are on are colourful. Colourful: all colourful. Flat: all grey. Single colour: one tone; devices that are off are grey, devices that are on are in the colour you pick.', icAuto: 'Automatic', icFlat: 'Flat', icColor: 'Colourful', icTint: 'Single colour', icTintC: 'Pick a colour', icTintL: 'Light colour on lights', icTintLT: 'In single colour style, a light that is on shows its icon in the lamp\'s own colour.', icLec: 'Effect icons', icLecNone: 'Could not load the effect icons.', hold: 'Holding a light', holdT: 'What opens when you hold a light tile', hPop: 'Light window', hHa: 'HA dialog', hLec: 'Effect screen', lecOpen: 'Effect screen', lecStop: 'Stop effect', lecGroup: 'Light effects · {r}', lecLoading: 'Loading effects…', tOpen: 'Effect screen · {r}', tPlay: 'Effect: {e} · {r}', tStop: 'Stop effect · {r}', roomByTab: 'the tab\'s room', lecNa: 'Lemur Light Effect Card is not installed: this button is hidden on the dashboard',
    resetAll: 'Back to automatic layout', resetQ: 'Every tab and section is deleted and the dashboard is rebuilt from your areas. Settings stay.', resetOk: 'Back to automatic layout',
    secL: 'Second line', sc_none: 'None', sc_state: 'State', sc_lc: 'Last changed', sc_attr: 'Attribute', sc_tpl: 'Text or template', swapL: 'Name on top, value below', cfmL: 'Ask before running', cfmT: 'Against accidental taps: asks "run it?" first', cfmText: 'Question (empty: "Run <name>?")', nameTplT: 'Name and second line accept a Home Assistant template: {{ ... }}',
    cpT: 'Add a card', cpSearch: 'Search cards', cpHalo: 'Halo cards', cpHa: 'Home Assistant cards', cpCustom: 'Installed custom cards', cpYaml: 'Write YAML', ceT: 'Edit card', cePv: 'Preview', ceVisual: 'Visual', ceYaml: 'YAML', ceNoEd: 'This card has no visual editor; edit it as YAML.', ceLoad: 'Loading the editor…', ceEdit: 'Visual edit', ceBack: 'Back',
    modeSimple: 'Simple', modeAdv: 'Advanced', modeT: 'Simple mode shows only the basic settings; advanced settings are kept and keep working.', advHas: 'This item has advanced settings (size, colour, condition or a custom action). They are hidden in simple mode but still work.', advTag: 'advanced', helpT: 'Help',
    gapL: 'Spacing', gapAuto: 'Auto', heightL: 'Height', h_rows: '{n} rows', addSub: 'Subtitle', addSubT: 'A small heading inside the section (e.g. CONNECTION under the tiles)', subItem: 'Subtitle', subText: 'Text',
    scL: 'Colour by state', scT: 'Colour by an entity\'s state (e.g. feeding status: active → green, urgent → red). Works for text values too.', scE: 'Entity (empty: the item itself)', scState: 'State', scAdd: 'Add row', cFixed: 'Fixed colour',
    addPet: 'Pet', addPetT: 'Feeding card: a feeding reminder for a cat, dog, fish...', t_pets: 'Feeding', petItem: 'Feeding card', petKind: 'Kind',
    pk_cat: 'Cat', pk_dog: 'Dog', pk_fish: 'Fish', pk_bird: 'Bird', pk_rabbit: 'Rabbit', pk_turtle: 'Turtle', pk_other: 'Other',
    petSched: 'When to feed', pm_interval: 'Every N hours', pm_times: 'At set times of day', petEvery: 'Every how many hours', petTimes: 'Times (comma separated)',
    petSoon: 'Soon warning (min before)', petGrace: 'Grace time (min)', petNotify: 'Notify when late', petNoNotify: 'No notification', petFeederT: 'Also runs this service on "fed" (e.g. button.press)', petFeeder: 'Automatic feeder (optional)',
    petEnt: 'Home Assistant gets a "{n} feeding" status and a "{n} fed" button, usable in automations.', petNeedName: 'Write the pet\'s name', petFeederBad: 'The feeder service must be in one of these domains: {d}',
    lookL: 'Look', lk_tile: 'Tile', lk_button: 'Button', lk_row: 'Row', lk_halo: 'Halo', colorsL: 'Colours', cIcon: 'Icon', cOn: 'When on', cBg: 'Background', cNone: 'None',
    zonesL: 'Colour by value', zonesT: '4 limits, 5 colours: when the value reaches a limit it moves to the next colour (like the zones in Halo cards). The frame, value and icon take this colour.', zLim: 'Limit {n}',
    cardTapT: 'If not set, the card handles taps itself', a_defCard: 'Default: the card itself',
    fillL: 'Fill', fillC: 'Fit content', fillF: 'Fill the box', fillT: 'Fill the box: buttons and tiles share the box height evenly', alignL: 'Alignment', alTop: 'Top', alCenter: 'Middle', alSpread: 'Spread evenly',
    sizeL: 'Size', sz_row: 'Full row', icSizeL: 'Icon size', txSizeL: 'Text size', sz_auto: 'Auto', sz_s: 'Small', sz_m: 'Medium', sz_l: 'Large',
    tPop: 'Opens in a window: {t}', imT: 'Item settings', imSave: 'Save', iconOn: 'Icon when on', iconOff: 'Icon when off', tapL: 'On tap', holdL: 'On hold', actL: 'Action',
    a_defMore: 'Default: more info', a_defTog: 'Default: toggle', a_defHold: 'Default: light or more-info window', a_defRun: 'Default: run the chosen target', a_more: 'More info', a_tog: 'Toggle', a_none: 'Nothing',
    a_svc: 'Call a service', a_pop: 'Open a card in a window', a_yaml: 'Advanced (YAML)', svc: 'Service', tgt: 'Target entity', svcData: 'Data (YAML, optional)', popTitle: 'Window title', cardY: 'Card (YAML)', actY: 'Action (YAML)',
    visL: 'Only show when', visT: 'If the condition is not met the item is not drawn at all and leaves no gap. It shows faded in the preview.', visE: 'Entity', v_eq: 'equals', v_in: 'is one of', v_not: 'is none of', visV: 'State (comma for several)', visNow: 'Now: {s}',
    yamlErr: 'Could not read the YAML: {e}', yamlErrL: 'Could not read the YAML: indentation or syntax error on line {n}', cardNoType: 'The card has no "type:" line', addCard: 'Card', addCardT: 'Add a Halo card, a Home Assistant card or an installed custom card; pick from the list, set it up visually', cond: 'conditional', cardItem: 'Card', svcNeed: 'The service must look like "domain.service" (e.g. timer.start)',
    close: 'Close', notLoaded: 'The Lemur Home Dashboard integration is not loaded.', editNote: 'Note: if you "take control" of this dashboard in Home Assistant\'s own editor, it disconnects from this panel.'
  }
};
// Bölüm türleri sadece başlangıç (başlık ve simge); her bölüme her şey eklenebilir. domains: seçicideki süzgeç
const LHD_TYPES = {
  free: { icon: 'mdi:view-grid-plus-outline', domains: null, col: 0 },
  lights: { icon: 'mdi:lightbulb-group-outline', domains: ['light', 'switch', 'cover', 'fan', 'input_boolean'], col: 0 },
  scenes: { icon: 'mdi:gesture-tap-button', domains: ['script', 'scene', 'automation'], col: 1 },
  climate: { icon: 'mdi:thermostat', domains: ['climate'], col: 2 },
  vacuum: { icon: 'mdi:robot-vacuum', domains: ['vacuum'], col: 2 },
  media: { icon: 'mdi:television', domains: ['media_player'], col: 2 }
};
// Renk zemini için hazır koyu tonlar (açık renkler de seçilebilir ama yazılar beyaz)
const LHD_TINT_COLORS = ['#FFC24A', '#E6ECF5', '#5B8DEF', '#4FD1C5', '#7BD83A', '#FF7AB0', '#B07CFF', '#FF8A4A'];
const LHD_BG_COLORS = ['#0b0e15', '#0e1726', '#101418', '#0f1a14', '#1a1024', '#1d0f12', '#1a160e', '#0d1b1e'];
const LHD_ALL_DOMAINS = ['light', 'switch', 'cover', 'fan', 'input_boolean', 'lock', 'script', 'scene', 'automation', 'button', 'input_button', 'climate', 'vacuum', 'media_player'].concat(LHD_VALUE_DOMAINS);
// Kart seçicideki listeler. Halo: [tür, ad tr, ad en, açıklama tr, açıklama en, simge]; HA: [tür, ad tr, ad en, simge]
const LHD_HALO_CARDS = [
  ['sensor', 'Sensör', 'Sensor', 'Değere göre renk alan haleli değer', 'A value with a halo coloured by the value', 'mdi:thermometer'],
  ['climate', 'İklim', 'Climate', 'Klima ve petek', 'Air conditioner and radiator', 'mdi:thermostat'],
  ['air', 'Hava temizleyici', 'Air purifier', 'Fan ve hava kalitesi', 'Fan and air quality', 'mdi:air-purifier'],
  ['vacuum', 'Süpürge', 'Vacuum', 'Robot süpürge', 'Robot vacuum', 'mdi:robot-vacuum'],
  ['energy', 'Enerji', 'Energy', 'Güç ve tüketim', 'Power and consumption', 'mdi:lightning-bolt'],
  ['security', 'Güvenlik', 'Security', 'Alarm, kapı, pencere', 'Alarm, doors, windows', 'mdi:shield-home'],
  ['room', 'Oda', 'Room', 'Odanın özeti', 'Room summary', 'mdi:sofa-outline'],
  ['light', 'Işık', 'Light', 'Işık ve parlaklık', 'Light and brightness', 'mdi:lightbulb']
];
const LHD_HA_CARDS = [
  ['tile', 'Karo', 'Tile', 'mdi:square-rounded-outline'], ['entities', 'Varlıklar', 'Entities', 'mdi:format-list-bulleted'], ['button', 'Düğme', 'Button', 'mdi:gesture-tap-button'],
  ['glance', 'Bakış', 'Glance', 'mdi:view-module-outline'], ['markdown', 'Yazı (Markdown)', 'Markdown', 'mdi:language-markdown-outline'], ['history-graph', 'Geçmiş grafiği', 'History graph', 'mdi:chart-line'],
  ['statistics-graph', 'İstatistik grafiği', 'Statistics graph', 'mdi:chart-bar'], ['gauge', 'Gösterge', 'Gauge', 'mdi:gauge'], ['sensor', 'Sensör', 'Sensor', 'mdi:eye-outline'],
  ['thermostat', 'Termostat', 'Thermostat', 'mdi:thermostat'], ['weather-forecast', 'Hava durumu', 'Weather forecast', 'mdi:weather-partly-cloudy'], ['media-control', 'Medya', 'Media control', 'mdi:play-box-outline'],
  ['light', 'Işık', 'Light', 'mdi:lightbulb-outline'], ['picture-entity', 'Resimli varlık', 'Picture entity', 'mdi:image-outline'], ['map', 'Harita', 'Map', 'mdi:map-outline'],
  ['calendar', 'Takvim', 'Calendar', 'mdi:calendar'], ['todo-list', 'Yapılacaklar', 'To-do list', 'mdi:clipboard-list-outline'], ['alarm-panel', 'Alarm paneli', 'Alarm panel', 'mdi:shield-home-outline'],
  ['area', 'Alan', 'Area', 'mdi:texture-box'], ['logbook', 'Kayıt defteri', 'Logbook', 'mdi:format-list-text'], ['iframe', 'Web sayfası', 'Webpage', 'mdi:web']
];
const LHD_SC_DEF = ['#28BE64', '#FFCD28', '#FF8C1E', '#FF3737'];
const LHD_ZONE_DEF = { t: [20, 40, 60, 80], c: ['#78D7FF', '#008CFF', '#28BE64', '#FFCD28', '#FF3737'] };
const LHD_KIND_KEY = { tile: 't_lights', scene: 't_scenes', climate: 't_climate', vacuum: 't_vacuum', media: 't_media', value: 't_values', card: 't_cards', pet: 't_pets', sub: 't_subs' };
// Önizleme ekranları: pano gerçekte ekranın oranına göre ölçeklenir (scale.js); önizleme seçilen ekranı aynı hesapla taklit eder.
const LHD_SCREENS = [['tab16', 1600, 1000], ['tab43', 1024, 768], ['wide', 1920, 1080], ['phone', 390, 844], ['here', 0, 0]];
const LHD_MAXCOLS = 6;
const LHD_COLORS = ['#5B8DEF', '#8E7CFF', '#4FD1C5', '#FF6FAE', '#6BC46B', '#E5484D', '#F2B33D', '#FFB86B'];
const lhdClone = (x) => JSON.parse(JSON.stringify(x));
// Simge seçici: önce bağlama göre önerilenler, aramada HA'nın kendi MDI listesi (/static/mdi/iconList.json, ad + İngilizce anahtar kelimeler).
// Türkçe aramalar için küçük bir sözlük; liste açılamazsa (eski HA) sadece önerilenler ve elle yazılan ad.
const LHD_ICON_SUGGEST = {
  room: ['home-outline', 'sofa-outline', 'sofa', 'bed-outline', 'bed-king-outline', 'bed-double-outline', 'silverware-fork-knife', 'stove', 'fridge-outline', 'shower', 'bathtub-outline', 'toilet',
    'desk', 'desktop-tower-monitor', 'laptop', 'teddy-bear', 'baby-carriage', 'door', 'door-open', 'stairs', 'stairs-up', 'garage', 'flower-outline', 'tree-outline', 'balcony', 'washing-machine',
    'television', 'gamepad-variant-outline', 'dumbbell', 'book-open-variant', 'coffee-outline', 'wardrobe-outline', 'home-floor-1', 'home-floor-2', 'home-roof', 'office-building-outline', 'dots-horizontal-circle-outline'],
  light: ['lightbulb', 'lightbulb-outline', 'lightbulb-group', 'ceiling-light', 'ceiling-light-outline', 'ceiling-light-multiple', 'chandelier', 'floor-lamp', 'floor-lamp-outline', 'floor-lamp-torchiere',
    'desk-lamp', 'lamp', 'lamp-outline', 'wall-sconce', 'wall-sconce-round', 'wall-sconce-round-outline', 'wall-sconce-flat-outline', 'track-light', 'spotlight', 'spotlight-beam', 'led-strip', 'led-strip-variant',
    'string-lights', 'lava-lamp', 'outdoor-lamp', 'coach-lamp', 'light-recessed', 'television', 'television-ambient-light', 'monitor', 'bed-outline', 'sofa-outline', 'curtains-closed', 'blinds', 'door',
    'stairs', 'toilet', 'mirror', 'cupboard-outline', 'countertop-outline', 'power-socket-eu', 'fan', 'palette-outline'],
  scene: ['play-circle-outline', 'white-balance-sunny', 'weather-night', 'lightbulb-night', 'lightbulb-group', 'movie-open', 'music-note', 'party-popper', 'creation', 'book-open-variant', 'sofa',
    'bed-outline', 'coffee-outline', 'silverware-fork-knife', 'home-export-outline', 'home-import-outline', 'power', 'shield-home-outline', 'robot-vacuum', 'fire', 'snowflake', 'palette-outline',
    'candle', 'heart-outline', 'star-outline', 'run', 'airplane', 'sleep', 'alarm', 'gesture-tap']
};
const LHD_ICON_TR = { salon: 'sofa living couch', oturma: 'sofa couch', kanepe: 'sofa couch', koltuk: 'sofa seat chair', sandalye: 'chair', yatak: 'bed',  mutfak: 'kitchen silverware stove fridge', banyo: 'shower bath', tuvalet: 'toilet', wc: 'toilet',
  çocuk: 'teddy baby', cocuk: 'teddy baby', ofis: 'desk office monitor', çalışma: 'desk', calisma: 'desk', kapı: 'door', kapi: 'door', giriş: 'door', giris: 'door', merdiven: 'stairs', balkon: 'balcony',
  bahçe: 'flower tree garden', bahce: 'flower tree garden', garaj: 'garage car', ev: 'home house', kat: 'floor', ışık: 'lightbulb light lamp', isik: 'lightbulb light lamp', lamba: 'lamp lightbulb',
  ampul: 'lightbulb', tavan: 'ceiling', avize: 'chandelier', abajur: 'lamp', aplik: 'sconce', şerit: 'strip', serit: 'strip', spot: 'spot track', lambader: 'floor-lamp', masa: 'desk table',
  perde: 'curtains blinds', panjur: 'blinds shutter', pencere: 'window', cam: 'window', tv: 'television', televizyon: 'television', ekran: 'monitor', klima: 'air-conditioner', petek: 'radiator',
  ısıtma: 'heat radiator fire', soğutma: 'snowflake', süpürge: 'vacuum', supurge: 'vacuum', müzik: 'music', muzik: 'music', film: 'movie', sinema: 'movie', gece: 'night moon', gündüz: 'sun', gunduz: 'sun',
  güneş: 'sun', gunes: 'sun', parti: 'party', kitap: 'book', okuma: 'book', uyku: 'sleep', kahve: 'coffee', yemek: 'silverware food', kapat: 'power', güç: 'power', guc: 'power', priz: 'socket',
  fan: 'fan', vantilatör: 'fan', dolap: 'wardrobe cupboard', ayna: 'mirror', efekt: 'creation magic', renk: 'palette', yangın: 'fire', ateş: 'fire', kar: 'snowflake', kalp: 'heart', yıldız: 'star', alarm: 'alarm' };
const LHD_ICONS = { list: null, loading: null };
function lhdIconList() {
  if (LHD_ICONS.list) return Promise.resolve(LHD_ICONS.list);
  if (!LHD_ICONS.loading) LHD_ICONS.loading = fetch('/static/mdi/iconList.json').then((r) => (r.ok ? r.json() : [])).catch(() => [])
    .then((l) => { LHD_ICONS.list = (l || []).map((x) => ({ n: x.name, k: (x.keywords || []).join(' ').toLowerCase() })); return LHD_ICONS.list; });
  return LHD_ICONS.loading;
}
// Kolon içi sütun en az bu kadar geniş olabilir (kanvas pikseli): kutunun 40 px iç boşluğu + bir karo
const LHD_MINSUB = 150;
const lhdColPx = (T, i, cw) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); return (cw - 8 - 20 * w.length) * w[i] / sum; };
const lhdMaxSplit = (T, i, cw) => Math.max(1, Math.min(3, Math.floor(lhdColPx(T, i, cw) / LHD_MINSUB + 0.02)));
// sütun sayısı seçilebilir mi: diğer kolonlar en dar hallerine inse bile bu kolon k sütuna yetecek kadar genişleyebiliyor mu
const lhdCanSplit = (T, i, k, cw) => { const n = lpWeights(T).length, sp = lpSplits(T, n); let need = LHD_MINSUB * k; for (let j = 0; j < n; j++) if (j !== i) need += LHD_MINSUB * sp[j]; return need <= cw - 8 - 20 * n; };
// Kolon en az LHD_MINSUB × sütun sayısı geniş kalsın: dar kalanlar o genişliğe çekilir, fark geniş kolonlardan oranla alınır
function lhdFitCols(T, cw) {
  const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0), avail = cw - 8 - 20 * n, sp = lpSplits(T, n);
  const minF = sp.map((k) => Math.min(1 / n, LHD_MINSUB * k / avail));
  let fr = w.map((x) => x / sum);
  for (let it = 0; it < n; it++) {
    const fixed = fr.map((f, i) => f < minF[i] - 1e-9);
    if (!fixed.some(Boolean)) break;
    const fs = fr.reduce((a, f, i) => a + (fixed[i] ? minF[i] : 0), 0), rs = fr.reduce((a, f, i) => a + (fixed[i] ? 0 : f), 0);
    fr = fr.map((f, i) => (fixed[i] ? minF[i] : f * (1 - fs) / rs));
  }
  T.columns = fr.map((f) => Math.round(f * sum * 100) / 100);
}
// kolonlar değişince sığmayan sütunları azalt; o sütundaki bölümler kalan son sütuna geçer
function lhdFitSplits(T, cw) {
  if (!T.splits) return;
  const n = lpWeights(T).length, sp = lpSplits(T, n);
  for (let i = 0; i < n; i++) {
    const mx = lhdMaxSplit(T, i, cw);
    if (sp[i] > mx) { sp[i] = mx; (T.sections || []).forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > mx - 1) { if (mx > 1) s.sub = mx - 1; else delete s.sub; } }); }
  }
  T.splits = sp;
}
let lhdSeq = 0;
const lhdId = (p) => p + Date.now().toString(36) + (lhdSeq++).toString(36);
// yedek kontrol ve duvar anahtarı için izinli alanlar (custom_components/.../twins.py ile aynı)
const LHD_TWIN_DOMAINS = ['light', 'switch', 'fan', 'input_boolean'];
const LHD_WALL_DOMAINS = ['switch', 'input_boolean', 'binary_sensor', 'light'];
// lambanın adından "govee", "matter", parantez içi gibi ekleri at: iki kopyayı eşleştirmek için
const lhdTwinKey = (s) => String(s || '').toLocaleLowerCase('tr').replace(/\([^)]*\)/g, ' ').replace(/\b(govee|matter|mqtt|lan|zigbee|wifi|wi-fi|esp|light|lamba|ışık)\b/g, ' ').replace(/[^a-z0-9çğıöşü]+/g, ' ').trim();
const LHD_REPO_URL = /^https:\/\/github\.com\/mendebur-lemur\/lemur-home-dashboard(\/[^\s"'<>]*)?$/;
const lhdSlug = (x) => String(x || '').replace(/İ/g, 'i').toLowerCase().replace(/[çćč]/g, 'c').replace(/ğ/g, 'g').replace(/[ıîí]/g, 'i').replace(/[öô]/g, 'o').replace(/ş/g, 's').replace(/[üû]/g, 'u')
  .replace(/[âáà]/g, 'a').replace(/[éè]/g, 'e').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
const lhdMove = (arr, from, to) => { const x = arr.splice(from, 1)[0]; arr.splice(to, 0, x); };

class LemurHomeDashboardAdmin extends HTMLElement {
  constructor() {
    super();
    this._tab = null; this._sec = null; this._undo = []; this._modal = null; this._menu = null; this._q = ''; this._picked = [];
    this._ask = null;
  }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) {
      LEC.load(h);
      if (!this._lecUnsub) this._lecUnsub = LEC.onChange((k) => { if (k === 'playing') return; if (this._modal === 'pick') this._refreshPick(); else if (STORE.data && this.shadowRoot && !this._modal) this._render(); });
      STORE.load(h).then(() => {
        this._sub();
        this._render();
      }).catch(() => this._render());
      return;
    }
    if (this._pv) this._pv.hass = h;
  }
  // ayar değişince yeniden çiz; kendi kaydımızın ve sunucu yankısının aynısı gelirse çizme (odak ve tıklama kaybolmasın)
  _sub() {
    if (this._unsub) return;
    this._unsub = STORE.onChange((d) => {
      const j = JSON.stringify(d);
      if (j === this._lastJson) return;
      this._lastJson = j;
      if (!this._modal) this._render();
    });
  }
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panelCfg = p; }
  connectedCallback() {
    if (!this._key) {
      this._key = (e) => {
        const typing = e.composedPath && e.composedPath()[0] && /INPUT|SELECT|TEXTAREA/.test(e.composedPath()[0].tagName || '');
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
        if (e.key === 'Escape' && (this._modal || this._menu)) { this._modal = null; this._menu = null; this._render(); }
      };
    }
    window.addEventListener('keydown', this._key);
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._fit());
    if (!this._leciUnsub) this._leciUnsub = lpLecIconsSub(() => { if (this._hass && STORE.data) this._render(); });
    if (!this._mdicUnsub) this._mdicUnsub = lpMdicSub(() => { if (this._hass && STORE.data) { this._render(); if (this._modal === 'icon') this._refreshIcons(); } });
    if (this._hass && STORE.data) { this._sub(); this._render(); }
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._key);
    if (this._leciUnsub) { this._leciUnsub(); this._leciUnsub = null; }
    if (this._mdicUnsub) { this._mdicUnsub(); this._mdicUnsub = null; }
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._ro) this._ro.disconnect();
  }

  get _lang() { return pickLang(this._hass); }
  _t(k, v) {
    const d = ADM[this._lang] || ADM.en;
    let s = d[k] !== undefined ? d[k] : (ADM.en[k] !== undefined ? ADM.en[k] : k);
    if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  _settings() { return (STORE.data && STORE.data.settings) || {}; }
  _cw() { return (this._settings().canvas || {}).width || 1280; }
  _isAuto() { const d = STORE.data; return !(d && d.tabs && d.tabs.length); }
  _work() { const d = STORE.data; return lhdClone(d && d.tabs && d.tabs.length ? d.tabs : buildDefaultTabs(this._hass, this._lang)).map(lhdNormTab); }
  _area(id) { const a = this._hass.areas && this._hass.areas[id]; return a ? a.name : ''; }
  _ename(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }

  // ---- kayıt: önce ekranda, sonra entegrasyona; her değişiklik geri alınabilir ----
  _commit(key, value) {
    STORE.data = Object.assign({}, STORE.data); STORE.data[key] = value;
    const d = STORE.data;
    this._lastJson = JSON.stringify(d);   // kendi değişikliğimiz: abonelikten gelince yeniden çizme
    STORE.subs.forEach((f) => { try { f(d); } catch (e) {} });
    return STORE.set(key, value).catch((e) => this._toast(this._t('err', { e: (e && e.message) || e }), false));
  }
  _snap() {
    this._undo.push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    if (this._undo.length > 40) this._undo.shift();
  }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    // sadece değişen anahtar gönderilir (ikisi birden gönderilince ara yankı geri alınanı bir an geri getiriyordu)
    if (JSON.stringify(u.settings) !== JSON.stringify(this._settings())) this._commit('settings', u.settings);
    if (JSON.stringify(u.tabs) !== JSON.stringify((STORE.data && STORE.data.tabs) || [])) this._commit('tabs', u.tabs);
    this._render();
    this._toast(this._t('undone'), false);
  }
  // soft: yazı alanından gelen değişiklik; panel yeniden çizilmez (odak ve hemen ardından gelen tıklama kaybolmasın), önizleme kendisi güncellenir
  _edit(fn, msg, soft) {
    this._snap();
    const tabs = this._work();
    fn(tabs);
    this._commit('tabs', tabs);
    if (!soft) this._render(); else this._undoBtn();
    this._toast(msg || this._t('saved'));
  }
  // zemin: seçim (bg) ve HA'nın çizdiği CSS metni (background) birlikte kaydedilir
  _bgSet(b, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    if (b) s.bg = b; else delete s.bg;
    const css = lpBgCss(b);
    if (css) s.background = css; else delete s.background;
    this._commit('settings', s);
    if (!soft) this._render(); else { this._undoBtn(); const box = this.shadowRoot && this.shadowRoot.querySelector('.pvbox'); if (box) box.style.background = css || LP_DEFAULT_BG; }
    this._toast(this._t('saved'));
  }



  // ---- sorun bildir: sürüm ve cihaz bilgisiyle hazır bir GitHub kaydı; kişisel bilgi yok ----
  async _reportOpen() {
    this._rep = { text: '', iv: null, copied: false }; this._modal = 'report'; this._render();
    try { this._rep.iv = (await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version; } catch (e) {}
    if (this._modal === 'report') this._repInfoPaint();
  }
  _repInfo() {
    const t = (k) => this._t(k), H = this._hass || {}, R = this._rep || {}, s = this._settings();
    const ua = navigator.userAgent || '', app = /Home ?Assistant\//i.test(ua);
    const m = (re) => { const x = re.exec(ua); return x ? x[1] : null; };
    const br = (m(/Edg\/(\d+)/) && 'Edge ' + m(/Edg\/(\d+)/)) || (m(/Firefox\/(\d+)/) && 'Firefox ' + m(/Firefox\/(\d+)/)) || (m(/Chrome\/(\d+)/) && 'Chrome ' + m(/Chrome\/(\d+)/)) || (m(/Version\/([\d.]+).*Safari/) && 'Safari ' + m(/Version\/([\d.]+)/)) || '?';
    const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'iOS ' + ((m(/OS (\d+)_/)) || '') : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '?';
    const tabs = this._work(); let secs = 0, items = 0; const kinds = {};
    tabs.forEach((x) => (x.sections || []).forEach((sc) => { secs++; (sc.entities || []).forEach((it) => { items++; const k = lhdKind(it); kinds[k] = (kinds[k] || 0) + 1; }); }));
    const err = (window.__LEMUR_HD_ERR || []).slice(-5);
    const cv = s.canvas || {};
    return [
      [t('rPanel'), 'v' + PANEL_VERSION + (R.iv && R.iv !== PANEL_VERSION ? ' · ' + t('rInt') + ' v' + R.iv : '')],
      [t('rHa'), (H.config && H.config.version) || '?'],
      [t('rBrowser'), (app ? t('rApp') + ' · ' : '') + br + ' · ' + os],
      [t('rScreen'), window.innerWidth + '×' + window.innerHeight + ' · ' + ((navigator.maxTouchPoints || 0) > 0 ? t('rTouch') : t('rNoTouch')) + ' · ' + t('rCanvas') + ' ' + (cv.width || 1280) + '×' + (cv.ref_height || 1075)],
      [t('rLang'), ((H.locale && H.locale.language) || H.language || '?') + ' → ' + this._lang],
      [t('rLayout'), (this._isAuto() ? t('rAuto') + ' · ' : '') + tabs.length + ' ' + t('rTabs') + ', ' + secs + ' ' + t('rSecs') + ', ' + items + ' ' + t('rItems')],
      [t('rKinds'), Object.keys(kinds).sort().map((k) => k + ' ' + kinds[k]).join(', ') || '–'],
      [t('rLook'), lpIconMode() + (s.bg && s.bg.mode ? ' · ' + s.bg.mode : '') + (s.kiosk && (s.kiosk.hide_header || s.kiosk.hide_sidebar) ? ' · kiosk' : '')],
      [t('rLec'), LEC.installed(H) ? (LEC.version ? 'v' + LEC.version : '✓') : '–'],
      [t('rErr'), err.length ? err.join(' | ') : t('rNoErr')],
    ];
  }
  _repBody() {
    const t = (k) => this._t(k), R = this._rep || {};
    return '**' + t('rWhat') + '**\n\n' + ((R.text || '').trim() || '…') + '\n\n**' + t('rInfoH') + '**\n\n' + this._repInfo().map((x) => '- ' + x[0] + ': ' + x[1]).join('\n');
  }
  _repInfoPaint() { const el = this.shadowRoot && this.shadowRoot.getElementById('repinfo'); if (el) el.innerHTML = this._repInfo().map((x) => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join(''); }
  _reportHtml() {
    const t = (k, v) => esc(this._t(k, v)), R = this._rep || {};
    return '<div class="ov" data-ovl><div class="dlg sm rep"><div class="dh"><div class="di">' + lpIcon('mdi:chat-question') + '</div><h2>' + t('repT') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db"><label class="rl" for="repq">' + t('repQ') + '</label><textarea id="repq" class="inp" rows="5" data-repq placeholder="' + t('repPh') + '">' + esc(R.text || '') + '</textarea>' +
      '<div class="rl">' + t('repInfo') + '<span>' + t('repInfoS') + '</span></div><div class="rinfo" id="repinfo">' + this._repInfo().map((x) => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join('') + '</div>' +
      '<p class="rnote">' + t('repNoGh') + '</p></div>' +
      '<div class="df"><button class="btn" data-a="repcopy">' + (R.copied ? t('repCopied') : t('repCopy')) + '</button><span style="flex:1"></span><button class="btn pri" data-a="repgo">' + t('repGh') + '</button></div></div></div>';
  }
  _repGo() {
    const R = this._rep || {}, first = (R.text || '').trim().split('\n')[0].slice(0, 70);
    const title = '[v' + PANEL_VERSION + '] ' + (first || this._t('repT'));
    let body = this._repBody(); if (body.length > 6000) body = body.slice(0, 6000) + '\n…';
    window.open('https://github.com/mendebur-lemur/lemur-home-dashboard/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body), '_blank', 'noopener');
  }
  async _repCopy() {
    const txt = '[v' + PANEL_VERSION + '] ' + this._t('repT') + '\n\n' + this._repBody();
    let ok = false; try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {}
    if (!ok) { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); }
    if (ok && this._rep) { this._rep.copied = true; this._render(); }
  }

  // ---- yedekle / içe aktar: bütün pano düzeni (sekmeler, bölümler, ayarlar) tek JSON dosyasında ----
  _backupDown() {
    const d = STORE.data || {};
    const out = { format: 'lemur-home-dashboard-backup', version: PANEL_VERSION, date: new Date().toISOString(), data: { tabs: d.tabs || [], settings: d.settings || {}, profiles: d.profiles || {}, pets: d.pets || {} } };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    a.download = 'lemur-pano-yedek-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    this._toast(this._t('bkSaved'));
  }
  _backupRead(f) {
    const rd = new FileReader();
    rd.onload = () => {
      let b = null; try { b = JSON.parse(rd.result); } catch (e) {}
      if (!b || b.format !== 'lemur-home-dashboard-backup' || !b.data || !Array.isArray(b.data.tabs)) return this._toast(this._t('bkErr'), false);
      // yedek dosyası dışarıdan gelir: sekmeler ve hayvanlar temizlenir (src/safe.js), ayarlar nesne olmalı
      const D = b.data;
      b.data = { tabs: lhdCleanTabs(D.tabs), settings: lhdIsObj(D.settings) ? D.settings : {} };
      if (lhdIsObj(D.profiles)) b.data.profiles = D.profiles;
      if (lhdIsObj(D.pets)) b.data.pets = lhdCleanPets(D.pets);
      this._bk = b; this._modal = 'restore'; this._render();
    };
    rd.readAsText(f);
  }
  _restoreHtml() {
    const t = (k, v) => esc(this._t(k, v)), b = this._bk || {}, D = b.data || {}; let d = ''; try { d = new Date(b.date).toLocaleString(this._lang === 'tr' ? 'tr-TR' : 'en-GB'); } catch (e) {}
    let secs = 0; (D.tabs || []).forEach((x) => { secs += (x.sections || []).length; });
    // hayvanların yemlik servisi ve bildirimi: "Besledim" / gecikme ile kendiliğinden çalışır, geri yüklemeden önce görünsün
    const run = [];
    Object.keys(D.pets || {}).forEach((id) => { const P = D.pets[id]; if (P.feeder) run.push(esc(P.name) + ': ' + esc(P.feeder.service) + (P.feeder.target ? ' → ' + esc(P.feeder.target) : '')); if (P.notify) run.push(esc(P.name) + ': ' + esc(P.notify)); });
    const svcs = run.length ? '<div class="rnote">' + t('bkSvc') + '<br>' + run.join('<br>') + '</div>' : '';
    return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di">' + lpIcon('mdi:package-up') + '</div><h2>' + t('bkQ') + '</h2></div>' +
      '<div class="db"><div>' + t('bkW', { d: d || '?', v: b.version || '?', n: (D.tabs || []).length, s: secs }) + '</div>' + (b.version && b.version !== PANEL_VERSION ? '<div class="rnote">' + t('bkVer', { v: b.version }) + '</div>' : '') + svcs + '</div>' +
      '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="bkyes">' + t('bkYes') + '</button></div></div></div>';
  }
  _backupApply() {
    const b = this._bk; if (!b) return; const D = b.data || {};
    this._snap();
    this._commit('tabs', lhdCleanTabs(D.tabs));
    this._commit('settings', lhdIsObj(D.settings) ? D.settings : {});
    if (lhdIsObj(D.profiles)) this._commit('profiles', D.profiles);
    if (lhdIsObj(D.pets)) this._commit('pets', lhdCleanPets(D.pets));
    this._bk = null; this._modal = null; this._tab = null; this._render(); this._toast(this._t('bkOk'));
  }
  // ---- yenilikler: güncellemeden sonra bir kez, ve Ayarlar → Sürüm'den ----
  _newsAuto() {
    let seen = null; try { seen = localStorage.getItem('lemur-hd-news'); } catch (e) { return; }
    if (seen === PANEL_VERSION) return;
    const mark = () => { try { localStorage.setItem('lemur-hd-news', PANEL_VERSION); } catch (e) {} };
    const d = STORE.data || {}, used = (d.tabs && d.tabs.length) || (d.settings && Object.keys(d.settings).length);
    if (!seen && !used) return mark();                       // ilk kurulumda gösterilecek bir şey yok
    if (!LHD_CHANGES.length || LHD_CHANGES[0].v !== PANEL_VERSION) return mark();
    if (this._modal) return;                                   // başka bir pencere açık: bir dahaki sefere
    this._newsFrom = null; this._newsAll = false; this._modal = 'news';
  }
  _newsClose() { try { localStorage.setItem('lemur-hd-news', PANEL_VERSION); } catch (e) {} this._modal = this._newsFrom || null; this._newsFrom = null; this._render(); }
  _newsHtml() {
    const t = (k, v) => esc(this._t(k, v)), lines = (c) => c[this._lang] || c.en || [];
    const one = (c, cur) => '<div class="nv' + (cur ? ' cur' : '') + '"><div class="nvh">' + t('newsV', { v: c.v }) + '</div><ul>' + lines(c).map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    const rest = LHD_CHANGES.slice(1);
    return '<div class="ov" data-ovl><div class="dlg sm news"><div class="dh"><div class="di">' + lpIcon('mdi:creation') + '</div><h2>' + t('newsT') + '</h2><button class="btn ic" data-newsclose><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db">' + (LHD_CHANGES.length ? one(LHD_CHANGES[0], true) : '') +
      (rest.length ? (this._newsAll ? rest.map((c) => one(c, false)).join('') : '<button class="lnk" data-newsall>' + t('newsOld') + ' ›</button>') : '') + '</div>' +
      '<div class="df"><a class="btn" href="https://github.com/mendebur-lemur/lemur-home-dashboard/releases" target="_blank" rel="noopener">' + t('newsAll') + '</a><span style="flex:1"></span><button class="btn pri" data-newsclose>' + t('newsOk') + '</button></div></div></div>';
  }
  // ---- sürüm ve güncelleme: HACS varsa onunla (bilgileri güncelle, indir), yoksa GitHub'daki son sürümü gösterir ----
  _updRow() {
    const t = (k, v) => esc(this._t(k, v)), U = this._upd || { st: 'idle' }, cur = U.cur || PANEL_VERSION;
    const notes = U.url ? ' · <a href="' + esc(U.url) + '" target="_blank" rel="noopener">' + t('updNotes') + '</a>' : '';
    let sub = t('updInst', { v: cur }) + ' · <a href="#" data-news>' + t('newsLink') + '</a>', ctl = '<button class="btn" data-updcheck>' + t('updCheck') + '</button>';
    if (U.st === 'checking') ctl = '<button class="btn" disabled>' + t('updChecking') + '</button>';
    else if (U.st === 'ok') { sub += ' · <span class="uok">✓ ' + t('updOk') + '</span> · ' + t('updAt', { t: U.at }); ctl = '<button class="btn" data-updcheck>' + t('updAgain') + '</button>'; }
    else if (U.st === 'new') { sub += ' · <b class="unew">' + t('updNew', { v: U.latest }) + '</b>' + notes + (U.ent ? '' : '<br>' + t('updNoHacs')); ctl = U.ent ? '<button class="btn pri" data-updgo>' + t('updGo') + '</button>' : (U.url ? '<a class="btn" href="' + esc(U.url) + '" target="_blank" rel="noopener">' + t('updGh') + '</a>' : ''); }
    else if (U.st === 'installing') { sub = '<b class="unew">' + t('updIng', { v: U.latest }) + '</b>' + (U.pct != null ? ' %' + U.pct : ''); ctl = ''; }
    else if (U.st === 'installed') { sub = '<b class="unew">' + t('updDone', { v: U.latest }) + '</b>' + notes; ctl = '<button class="btn pri" data-updrs>' + t('updRestart') + '</button>'; }
    else if (U.st === 'ask') { sub = '<b>' + t('updAsk') + '</b>'; ctl = '<button class="btn" data-updno>' + t('cancel') + '</button><button class="btn pri" data-updyes style="background:var(--red);border-color:var(--red);color:#fff">' + t('updYes') + '</button>'; }
    else if (U.st === 'restarting') { sub = '<b class="unew">' + t('updRest') + '</b>'; ctl = ''; }
    else if (U.st === 'err') { sub += ' · <span class="uerr">' + t('updErr', { e: U.err }) + '</span>'; ctl = '<button class="btn" data-updcheck>' + t('updAgain') + '</button>'; }
    return '<div class="srow upd" style="flex-wrap:wrap"><div class="t"><b>' + t('updT') + '</b><span>' + sub + '</span></div><div class="ubtn">' + ctl + '</div></div>';
  }
  _updSet(o) { this._upd = Object.assign({}, this._upd, o); if (this._modal === 'settings') this._render(); }
  // yedek kontrol adayları: aynı alanda, adı aynı (govee / matter / parantez içi ekler hariç) başka bir lamba ya da anahtar
  _twinCands(eid) {
    const H = this._hass, E = H.entities || {}, D = H.devices || {}, S = H.states;
    const area = (id) => { const e = E[id]; if (!e) return null; return e.area_id || (e.device_id && D[e.device_id] ? D[e.device_id].area_id : null); };
    const me = E[eid] || {}, myArea = area(eid), myKey = lhdTwinKey(this._ename(eid));
    return Object.keys(S).filter((x) => {
      if (x === eid || LHD_TWIN_DOMAINS.indexOf(x.split('.')[0]) < 0) return false;
      const e = E[x]; if (e && e.entity_category) return false;   // gizli olabilir: yedek kopya genelde gizlenir
      if (/_segment_?\d+$/.test(x)) return false;                       // aynı lambanın segmentleri değil
      if (me.device_id && e && e.device_id === me.device_id) return false;   // ikinci kopya başka bir entegrasyondan gelir
      if (!myKey || lhdTwinKey(this._ename(x)) !== myKey) return false;
      const ax = area(x); return !myArea || !ax || ax === myArea;   // alanı olmayan kopya da olur (Matter cihazına çoğu zaman alan verilmez)
    }).sort();
  }
  // ---- duvar anahtarları (Ayarlar, gelişmiş) ----
  _walls() { return lhdClone(this._wallDraft || (STORE.data && STORE.data.walls) || []); }
  _wallsHtml() {
    const t = (k, v) => esc(this._t(k, v)), W = this._walls(), S = this._hass.states;
    const ents = (doms) => Object.keys(S).filter((x) => doms.indexOf(x.split('.')[0]) >= 0).sort();
    const sel = (i, key, list, cur) => '<select class="inp" data-wl="' + i + ':' + key + '"><option value="">' + t('wallPick') + '</option>' + list.map((x) => '<option value="' + esc(x) + '"' + (cur === x ? ' selected' : '') + '>' + esc(this._ename(x)) + '</option>').join('') + '</select>';
    // aynı anahtarı kullanan açık otomasyonlar (HA'nın "ilgili öğeler" araması; bir kez sorulur)
    const C = this._wallAutos || (this._wallAutos = {});
    const autos = (sw) => {
      if (!C[sw]) { C[sw] = []; this._hass.callWS({ type: 'search/related', item_type: 'entity', item_id: sw }).then((r) => { C[sw] = (r && r.automation) || []; if (C[sw].length && this._modal === 'settings') this._render(); }).catch(() => {}); }
      return C[sw].filter((x) => S[x] && S[x].state === 'on');
    };
    const sws = ents(LHD_WALL_DOMAINS), lights = ents(LHD_TWIN_DOMAINS);
    let h = '<div class="sh">' + t('sWalls') + this._hb('walls') + '</div><div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><span>' + t('wallsT') + '</span></div>';
    if (!W.length) h += '<div class="mu" style="flex:1 1 100%">' + t('wallNone') + '</div>';
    W.forEach((w, i) => {
      h += '<div class="wallrow">' +
        '<div class="fld"><label>' + t('wallSw') + '</label>' + sel(i, 'switch', sws, w.switch) + '</div>' +
        '<div class="fld"><label>' + t('wallLight') + '</label>' + sel(i, 'light', lights, w.light) + '</div>' +
        '<div class="fld"><label>' + t('wallBr') + '</label><input class="inp" type="number" min="1" max="100" data-wl="' + i + ':brightness" value="' + esc(w.brightness || '') + '" placeholder="—"></div>' +
        '<div class="fld"><label>' + t('wallK') + '</label><input class="inp" type="number" min="2000" max="9000" step="100" data-wl="' + i + ':kelvin" value="' + esc(w.kelvin || '') + '" placeholder="—"></div>' +
        '<button class="btn sm dan" data-wldel="' + i + '">' + t('wallDel') + '</button>' +
        (w.switch && autos(w.switch).length ? '<div class="hint wallw">' + t('wallAuto', { n: autos(w.switch).map((x) => (S[x].attributes.friendly_name || x)).join(', ') }) + '</div>' : '') + '</div>';
    });
    return h + '<button class="btn sm" data-wladd><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('wallAdd') + '</button></div>';
  }
  _wallSet(i, key, v) {
    const W = this._walls(); if (!W[i]) return;
    if (key === 'brightness' || key === 'kelvin') { const n = parseFloat(v); if (n > 0) W[i][key] = Math.round(n); else delete W[i][key]; }
    else if (v) W[i][key] = v; else delete W[i][key];
    // yarım satır (anahtar ya da lamba seçilmemiş) sunucuya gitmez; bitince kaydedilir
    this._wallDraft = W;
    const ok = W.filter((w) => w.switch && w.light);
    if (ok.length === W.length) { this._wallDraft = null; this._commit('walls', W); }
    this._render();
  }
  _updEnt() {
    // yalnız HACS'in oluşturduğu güncelleme varlığı (başka bir entegrasyon aynı adresi taklit edemesin)
    const S = this._hass.states, E = this._hass.entities || {};
    const hacs = (s) => !!s && s.entity_id.indexOf('update.') === 0 && !!E[s.entity_id] && E[s.entity_id].platform === 'hacs';
    return Object.values(S).find((s) => hacs(s) && LHD_REPO_URL.test(String(s.attributes.release_url || ''))) || (hacs(S['update.lemur_home_dashboard_update']) ? S['update.lemur_home_dashboard_update'] : null);
  }
  async _updCheck() {
    const c = this._hass.connection, vnum = (v) => String(v || '').replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
    const newer = (a, b) => { const x = vnum(a), y = vnum(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
    this._updSet({ st: 'checking', err: null });
    try {
      let cur = PANEL_VERSION; try { cur = (await c.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version || cur; } catch (e) {}
      // HACS: menüsündeki "Bilgileri güncelle" ile aynı; güncelleme varlığı en yeni sürümü öğrensin
      try { const L = await c.sendMessagePromise({ type: 'hacs/repositories/list' }); const r = (L || []).filter((x) => /^mendebur-lemur\/lemur-home-dashboard$/i.test(x.full_name || ''))[0]; if (r) { await c.sendMessagePromise({ type: 'hacs/repository/refresh', repository: String(r.id) }); await new Promise((z) => setTimeout(z, 900)); } } catch (e) {}
      const ent = this._updEnt();
      let latest = ent && ent.attributes.latest_version, url = ent && ent.attributes.release_url;
      if (!latest) { const g = await fetch('https://api.github.com/repos/mendebur-lemur/lemur-home-dashboard/releases/latest').then((r) => r.json()); latest = g.tag_name; url = g.html_url; }
      latest = String(latest || '').replace(/^v/i, '');
      if (!LHD_REPO_URL.test(String(url || ''))) url = null;   // bağlantı yalnız projenin GitHub sayfasına
      const at = new Date().toLocaleTimeString(this._lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
      this._updSet(newer(latest, cur) ? { st: 'new', cur: cur, latest: latest, url: url, ent: ent ? ent.entity_id : null, at: at } : { st: 'ok', cur: cur, latest: latest, url: url, at: at });
    } catch (e) { this._updSet({ st: 'err', err: (e && (e.message || e.code)) || String(e) }); }
  }
  async _updInstall() {
    const U = this._upd || {}; if (!U.ent) return;
    this._updSet({ st: 'installing', pct: null });
    try { await this._hass.callService('update', 'install', { entity_id: U.ent }); }
    catch (e) { return this._updSet({ st: 'err', err: (e && e.message) || String(e) }); }
    const t0 = Date.now();
    const tick = () => {
      const s = this._hass.states[U.ent], a = (s && s.attributes) || {};
      const done = s && !a.in_progress && String(a.installed_version || '').replace(/^v/i, '') === U.latest;
      if (done) return this._updSet({ st: 'installed', pct: null });
      if (Date.now() - t0 > 300000) return this._updSet({ st: 'err', err: 'timeout' });
      if (typeof a.update_percentage === 'number' || typeof a.in_progress === 'number') this._updSet({ pct: Math.round(a.update_percentage != null ? a.update_percentage : a.in_progress) });
      this._updT = setTimeout(tick, 1000);
    };
    tick();
  }
  // yeniden başlat; yeni sürüm cevap verince sayfayı bir kez yenile (o ana kadar bellekte eski kod var)
  _updRestart() {
    const want = (this._upd || {}).latest; this._updSet({ st: 'restarting' });
    this._hass.callService('homeassistant', 'restart').catch(() => {});
    const t0 = Date.now(); let down = false;
    const poll = async () => {
      if (Date.now() - t0 > 600000) return;
      try {
        const v = (await this._hass.connection.sendMessagePromise({ type: 'lemur_home_dashboard/info' })).version;
        if (v === want || (down && v)) { await Promise.resolve(window.__LEMUR_HD_HEAL && window.__LEMUR_HD_HEAL()); return location.reload(); }
      } catch (e) { down = true; }
      setTimeout(poll, 3000);
    };
    setTimeout(poll, 8000);
  }
  _setting(path, value, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    const p = path.split('.');
    let o = s;
    for (let i = 0; i < p.length - 1; i++) { if (!o[p[i]] || typeof o[p[i]] !== 'object') o[p[i]] = {}; o = o[p[i]]; }
    if (value === undefined || value === null || value === '') delete o[p[p.length - 1]]; else o[p[p.length - 1]] = value;
    this._commit('settings', s);
    if (!soft) this._render(); else this._undoBtn();   // ayarlar penceresi açıkken de güncel görünsün
    this._toast(this._t('saved'));
  }
  // yazı alanından gelen kayıtta panel yeniden çizilmez; geri al düğmesi yine de açılsın (ilk değişiklikte kapalı kalıyordu)
  _undoBtn() { const u = this.shadowRoot && this.shadowRoot.querySelector('[data-a="undo"]'); if (u) u.disabled = !this._undo.length; }
  _toast(x, undo) {
    const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'); if (!el) return;
    el.querySelector('span').textContent = x;
    el.querySelector('button').hidden = undo === false || !this._undo.length;
    el.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 4200);
  }

  // ---- seçili sekme ve bölüm ----
  _curTab(tabs) {
    let t = tabs.filter((x) => x.id === this._tab)[0];
    if (!t) { t = tabs[0]; this._tab = t ? t.id : null; }
    return t;
  }
  _curSec(tab) {
    if (!tab) return null;
    const s = (tab.sections || []).filter((x) => x.id === this._sec)[0];
    if (!s) this._sec = null;
    return s || null;
  }

  // ---- çizim ----
  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    // büyük harfe çevrilen başlıklar panelin diliyle çevrilsin (İngilizce panoda "SECTİONS" olmasın)
    if (this.getAttribute('lang') !== this._lang) this.setAttribute('lang', this._lang);
    const icm = 'ic-' + lpIconMode(); if (this.className !== icm) this.className = icm; this.style.setProperty('--lp-ic-on', lpIconTint());
    if (!LP_MDIC.map) lpMdicLoad();
    if (!this._newsChk && STORE.data) { this._newsChk = true; this._newsAuto(); }
    const R = this.shadowRoot;
    if (!STORE.data) { R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app"><div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + esc(this._t('title')) + '</h1></div><div class="warn">' + esc(this._t('notLoaded')) + '</div></div>'; return; }
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab);
    const t = (k, v) => esc(this._t(k, v));
    const narrow = (this.clientWidth || window.innerWidth) < 980;
    this._narrowNow = narrow;

    const top = '<div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + t('title') + '</h1>' +
      (this._isAuto() ? '<span class="badge" title="' + t('autoT') + '">' + t('auto') + '</span>' : '') + '<div class="grow"></div>' +
      '<div class="seg modeseg" title="' + t('modeT') + '"><button data-mode="simple"' + (this._adv() ? '' : ' class="on"') + '>' + t('modeSimple') + '</button><button data-mode="adv"' + (this._adv() ? ' class="on"' : '') + '>' + t('modeAdv') + '</button></div>' + this._hb('mode') +
      '<button class="btn ic" data-a="undo" title="' + t('undoK') + '"' + (this._undo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:undo"></ha-icon></button>' +
      '<button class="btn" data-a="settings"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon>' + t('settings') + '</button>' +
      '<button class="btn ic" data-a="more" title="' + t('more') + '"><ha-icon class="s16" icon="mdi:dots-horizontal"></ha-icon></button></div>';

    const rooms = '<div class="rooms" data-dl="tabs" data-dir="x">' + tabs.map((x) => '<div class="rb' + (x.id === this._tab ? ' on' : '') + '" data-di data-tab="' + esc(x.id) + '" data-handle>' + lpIcon(x.icon || 'mdi:door') + esc(x.name) + '</div>').join('') +
      '<div class="rb add" data-a="addtab"><ha-icon class="s18" icon="mdi:plus"></ha-icon>' + t('addTab') + '</div></div>';
    const areaOpts = '<option value="">' + t('noArea') + '</option>' + Object.keys(this._hass.areas || {}).map((a) => '<option value="' + esc(a) + '"' + (tab && tab.area === a ? ' selected' : '') + '>' + esc(this._area(a)) + '</option>').join('');
    const W = tab ? lpWeights(tab) : LP_DEFAULT_COLS, wsum = W.reduce((a, b) => a + b, 0), SP = lpSplits(tab, W.length);
    const rpanel = tab ? '<div class="rpanel' + (tabs[0] && tabs[0].id === tab.id ? ' first' : '') + '">' +
      '<div class="fld" style="flex:1 1 180px"><label>' + t('tabName') + '</label><input class="inp" data-f="tab.name" value="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('icon') + '</label><div class="iconin"><div class="pv">' + lpIcon(tab.icon || 'mdi:door') + '</div><input class="inp" data-f="tab.icon" value="' + esc(tab.icon || '') + '" placeholder="mdi:sofa-outline"><button class="btn sm ic" data-ip="tab" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div></div>' +
      '<div class="fld" style="flex:1 1 160px"><label>' + t('area') + '</label><select class="inp" data-f="tab.area">' + areaOpts + '</select></div>' +
      '<div class="fld"><label title="' + t('colHint') + '">' + t('cols') + ' · ' + W.map((x) => Math.round(x / wsum * 100)).join(' / ') + '</label><div class="acts">' +
        '<button class="btn sm ic" data-a="coldel" title="' + t('colDel') + '"' + (W.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:minus"></ha-icon></button>' +
        '<span class="btn sm" style="pointer-events:none;min-width:38px">' + W.length + '</span>' +
        '<button class="btn sm ic" data-a="coladd" title="' + t('colAdd') + '"' + (W.length >= LHD_MAXCOLS ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon></button>' +
        (W.length === 3 ? '<button class="btn sm" data-a="coltab">' + t('colTab') + '</button>' : '') + '<button class="btn sm" data-a="coleq">' + t('colEq') + '</button></div></div>' +
      (!this._adv() ? '' : '<div class="fld"><label title="' + t('splitsT') + '">' + t('splits') + this._hb('splits') + '</label><div class="acts">' + SP.map((v, i) => '<div class="seg"><button disabled style="opacity:.6">' + esc(this._colName(i, W.length)) + '</button>' + [1, 2, 3].map((n) => '<button data-split="' + i + ':' + n + '"' + (v === n ? ' class="on"' : (!lhdCanSplit(tab, i, n, this._cw()) ? ' disabled title="' + esc(t('splitNarrow')) + '"' : '')) + '>' + n + '</button>').join('') + '</div>').join('') + '</div></div>') +
      (tab.area ? '<button class="btn sm" data-a="refill" title="' + t('refillT') + '"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('refill') + '</button>' : '') +
      '<button class="btn sm dan' + (this._ask === 'deltab' ? ' ask' : '') + '" data-a="deltab"' + (tabs.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'deltab' ? t('sure') : t('delTab')) + '</button></div>' : '';

    const ncols = W.length;
    const colName = (s) => this._colName(Math.min(s.col || 0, ncols - 1), ncols) + (SP[Math.min(s.col || 0, ncols - 1)] > 1 ? ' · ' + (Math.min(s.sub || 0, SP[Math.min(s.col || 0, ncols - 1)] - 1) + 1) : '');
    // özet: içindeki öğe türleri ("Işıklar 7 · İklim 2"); boşsa "0 öğe"
    const summary = (s) => { const k = lhdKinds(s), ks = Object.keys(k); return ks.length ? ks.map((x) => this._t(LHD_KIND_KEY[x]) + ' ' + k[x]).join(' · ') : this._t('n_items', { n: 0 }); };
    const secList = tab && (tab.sections || []).length ? '<div class="sl" data-dl="secs">' + tab.sections.map((s) => '<div class="si' + (s.id === this._sec ? ' on' : '') + '" data-di data-sec="' + esc(s.id) + '">' +
      '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span><div class="ti"><ha-icon icon="' + esc((LHD_TYPES[s.type] || {}).icon || 'mdi:shape') + '"></ha-icon></div>' +
      '<div class="nm"><b>' + esc(s.title || this._t('t_' + (LHD_TYPES[s.type] ? s.type : 'free'))) + '</b><span>' + esc(summary(s)) + '</span></div><span class="cb">' + colName(s) + '</span></div>').join('') + '</div>'
      : '<div class="empty">' + t('noSec') + '</div>';

    const ins = '<div class="ins"><div class="sc">' +
      '<h3>' + t('sections') + '<span class="grow"></span><button class="btn sm" data-a="addsec"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addSec') + '</button></h3>' + secList +
      (sec ? this._secEditor(tab, sec, ncols) : '') +
      (this._isAuto() ? '<div class="hint">' + t('autoT') + '</div>' : '') + '<div class="hint">' + t('editNote') + '</div></div></div>';

    const scr = this._screenKey();
    const pv = '<div class="pvw"><div class="pvh"><ha-icon class="s16" icon="mdi:eye-outline"></ha-icon><b>' + t('preview') + '</b><span>· ' + t('pvHint') + '</span><span class="grow"></span>' +
      '<div class="seg">' + LHD_SCREENS.map((x) => '<button data-scr="' + x[0] + '"' + (x[0] === scr ? ' class="on"' : '') + '>' + t('scr_' + x[0]) + '</button>').join('') + '</div></div><div class="pvbox"><div class="pvc"></div></div></div>';

    // yeniden çizimde odaktaki alan ve imleç korunur
    const act = R.activeElement, keyOf = (el) => { if (!el || !el.getAttribute) return null; const n = ['data-f', 'data-if', 'data-sf', 'data-q', 'data-bgurl', 'data-imf'].filter((k) => el.hasAttribute(k))[0]; return n ? '[' + n + (el.getAttribute(n) ? '="' + el.getAttribute(n) + '"' : '') + ']' : null; };
    const focusKey = keyOf(act), selS = act && act.selectionStart, selE = act && act.selectionEnd;
    // LEC kuruluysa bir kez: efektlerin nerede olduğunu anlatan bilgi kutusu ("Tamam" deyince kaybolur)
    const st0 = this._settings();
    const lecInfo = LEC.installed(this._hass) && !st0.lec_seen ? '<div class="lecinfo" data-lecinfo><ha-icon icon="mdi:creation"></ha-icon><div class="t"><b>' + t('lecInfoT') + '</b><span>' + t('lecInfo') + '</span></div>' +
      '<button class="btn sm" data-a="settings">' + t('settings') + '</button><button class="btn sm pri" data-a="lecok">' + t('ok') + '</button></div>' : '';
    // yeniden çizimde kaydırma yerleri korunsun (ayarlarda bir şey değişince pencere başa atlamasın)
    const SCR = ['.ov .db', '.ins .sc', '.main', '.rooms', '.plist', '.ilist'], scrKeep = {};
    SCR.forEach((q) => { const el = R.querySelector(q); if (el && (el.scrollTop || el.scrollLeft)) scrKeep[q] = [el.scrollTop, el.scrollLeft]; });
    R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app' + (narrow ? ' narrowv' : '') + '">' + top + lecInfo +
      '<div class="rblock">' + rooms + rpanel + '</div><div class="main">' + pv + ins + '</div>' +
      this._menuHtml() + this._modalHtml(tabs, tab, sec) + this._helpHtml() +
      '<div class="toast"><span></span><button data-a="undo">' + t('undo') + '</button></div></div>';

    Object.keys(scrKeep).forEach((q) => { const el = R.querySelector(q); if (el) { el.scrollTop = scrKeep[q][0]; el.scrollLeft = scrKeep[q][1]; } });
    this._mountPreview(tab, sec);
    this._ceMount();
    this._bind(tabs, tab, sec);
    if (focusKey) { const el = R.querySelector(focusKey); if (el && el.focus) { el.focus(); try { if (selS !== null && selS !== undefined) el.setSelectionRange(selS, selE); } catch (x) {} } }
  }

  _secEditor(tab, s, ncols) {
    const t = (k, v) => esc(this._t(k, v));
    const S = this._hass.states;
    const ci = Math.min(s.col || 0, ncols - 1), nsub = lpSplits(tab, ncols)[ci];
    const subSeg = nsub > 1 ? '<div class="fld" style="flex:0 0 auto"><label>' + t('sub') + '</label><div class="seg">' + Array.apply(null, Array(nsub)).map((x, j) => '<button data-ssub="' + j + '"' + (Math.min(s.sub || 0, nsub - 1) === j ? ' class="on"' : '') + '>' + (j + 1) + '</button>').join('') + '</div></div>' : '';
    const colSeg = '<div class="seg">' + Array.apply(null, Array(ncols)).map((x, c) => '<button data-scol="' + c + '"' + (Math.min(s.col || 0, ncols - 1) === c ? ' class="on"' : '') + '>' + esc(this._colName(c, ncols)) + '</button>').join('') + '</div>';
    let body = '';
    const handle = '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span>';
    // her öğenin sağında: ayarlar (ad, simge, dokununca, koşul...) ve sil
    const xBtn = (i) => '<button class="x" data-im="' + i + '" title="' + t('imT') + '"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon></button><button class="x" data-del="' + i + '" title="×"><ha-icon class="s16" icon="mdi:close"></ha-icon></button>';
    const cond = (it) => (it && typeof it === 'object' && it.visible && it.visible.entity ? ' · <b class="cnd">' + t('cond') + '</b>' : '') +
      (!this._adv() && lhdItemAdv(it) ? ' · <b class="advb">' + t('advTag') + '</b>' : '');
    const iconField = (i, cur, ph) => '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(cur || '') + '" placeholder="' + esc(ph) + '" style="height:28px;font-size:12px"><button class="btn sm ic ipb" data-ip="item:' + i + '" title="' + t('iconPick') + '"><ha-icon class="s14" icon="mdi:shape-outline"></ha-icon></button></div>';
    const temps = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'temperature');
    const hums = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'humidity');
    const sel = (i, key, list, cur) => '<select class="inp" data-if="' + i + '.' + key + '"><option value="">' + t('fromDevice') + '</option>' +
      list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
    const list = s.entities || [];
    // her öğe kendi türüne göre düzenlenir: düğmede renk, simge ve ne çalıştırdığı; karoda ad ve simge; iklimde sensörler
    body = list.length ? '<div class="items" data-dl="items">' + list.map((raw, i) => {
      const k = lhdKind(raw), it = typeof raw === 'string' ? { entity: raw } : raw;
      if (k === 'sub') {
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon('mdi:format-header-pound') + '</div><div class="col"><input class="inp" data-if="' + i + '.subtitle" value="' + esc(it.subtitle) + '" placeholder="' + t('subText') + '">' +
          '<span class="eid">' + t('subItem') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'pet') {
        const P = ((STORE.data && STORE.data.pets) || {})[it.pet] || {};
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon(P.icon || LP_PET_KINDS[P.kind] || 'mdi:paw') + '</div><div class="col"><b class="cty">' + esc(P.name || it.pet) + '</b>' +
          '<span class="eid">' + t('petItem') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'card') {
        return '<div class="it" data-di>' + handle + '<div class="ico">' + lpIcon('mdi:card-text-outline') + '</div><div class="col"><b class="cty">' + t('cardItem') + ': ' + esc(String(it.card.type || '?')) + '</b>' +
          '<span class="eid">' + esc(it.card.title || it.card.entity || '') + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      if (k === 'scene' && !it.entity) {
        return '<div class="it" data-di>' + handle +
          '<input type="color" data-if="' + i + '.color" value="' + esc(it.color || '#5B8DEF') + '">' +
          '<div class="ico">' + lpIcon(it.icon || 'mdi:play', '', 'color:' + esc(it.color || '#5B8DEF')) + '</div>' +
          '<div class="col"><input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + t('name') + '">' +
          iconField(i, it.icon, 'mdi:play') + '<span class="eid">' + this._scTarget(tab, it) + cond(it) + '</span></div>' + xBtn(i) + '</div>';
      }
      const st = it.entity ? S[it.entity] : null;
      const ico = it.entity ? lpIcon(lpEntIcon(this._hass.states[it.entity], it.icon)) : lpIcon(it.icon || 'mdi:lightbulb');
      let extra = '';
      if (k === 'tile' || k === 'ph' || k === 'scene' || k === 'value') extra = iconField(i, it.icon, this._t('icon') + ' (mdi:...)');
      if (k === 'climate') {
        const sel2 = (key, opts, cur, none, title) => '<select class="inp" data-if="' + i + '.' + key + '" title="' + esc(title) + '"><option value="">' + esc(none) + '</option>' +
          opts.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
        const climates = Object.keys(S).filter((id) => id.indexOf('climate.') === 0 && id !== it.entity);
        extra = '<div class="sub">' + sel(i, 'temperature_sensor', temps, it.temperature_sensor) + sel(i, 'humidity_sensor', hums, it.humidity_sensor) + '</div>' +
          '<div class="sub">' + sel2('outdoor_sensor', temps, it.outdoor_sensor, this._t('noOutdoor'), this._t('outdoorT')) + sel2('link', climates, (it.entities || [])[0], this._t('noLink'), this._t('linkT')) + '</div>' +
          '<div class="sub"><select class="inp" data-if="' + i + '.kind">' + ['auto', 'ac', 'radiator'].map((x) => '<option value="' + x + '"' + ((it.kind || 'auto') === x ? ' selected' : '') + '>' + t('k_' + x) + '</option>').join('') + '</select></div>';
      }
      return '<div class="it' + (it.entity ? '' : ' ph') + '" data-di>' + handle + '<div class="ico">' + ico + '</div><div class="col">' +
        '<input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + esc(it.entity ? this._ename(it.entity) : this._t('name')) + '">' + extra +
        '<span class="eid">' + esc(it.entity ? it.entity + (st ? '' : ' · ?') : this._t('addPh')) + cond(it) + '</span></div>' + xBtn(i) + '</div>';
    }).join('') + '</div>' : '<div class="empty">' + t('noItems') + '</div>';
    body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addDev') + '</button>' +
      (!this._adv() ? '' : '<button class="btn sm dash" data-a="addph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addPh') + '</button>' +
      '<button class="btn sm dash" data-a="addscph"><ha-icon class="s16" icon="mdi:gesture-tap"></ha-icon>' + t('addScPh') + '</button>') +
      (!this._adv() ? '' : '<button class="btn sm dash" data-a="addsub" title="' + t('addSubT') + '"><ha-icon class="s16" icon="mdi:format-header-pound"></ha-icon>' + t('addSub') + '</button>') +
      '<button class="btn sm dash" data-a="addpet" title="' + t('addPetT') + '"><ha-icon class="s16" icon="mdi:paw"></ha-icon>' + t('addPet') + '</button>' +
      ('<button class="btn sm dash" data-a="addcard" title="' + t('addCardT') + '"><ha-icon class="s16" icon="mdi:card-text-outline"></ha-icon>' + t('addCard') + '</button>') +
      (LEC.installed(this._hass) ? '<button class="btn sm" data-a="addlec"><ha-icon class="s16" icon="mdi:creation"></ha-icon>' + t('lecOpen') + '</button>' : '') + '</div>';
    // karo görünümü: bölümde karo varsa (ya da bölüm boşsa) gösterilir
    const kinds = lhdKinds(s), tilesHere = !!kinds.tile || !list.length;
    const lookHtml = tilesHere ? '<div class="fld"><label>' + t('look') + '</label><div class="seg">' + [['tile', 'lookTile'], ['bar', 'lookBar'], ['phone', 'lookPhone']].map((x) => '<button data-look="' + x[0] + '" title="' + t(x[1] + 'T') + '"' + ((s.look || 'tile') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div></div>' +
      '<div class="row2">' + (s.look !== 'bar' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('tileCols') + '</label><div class="seg">' + [2, 3, 4, 5, 6].map((n) => '<button data-tc="' + n + '"' + ((s.tile_columns || 5) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') +
      (s.look === 'bar' || s.look === 'phone' ? '<div class="fld" style="flex:0 0 auto"><label>' + t('barCols') + '</label><div class="seg">' + [1, 2, 3].map((n) => '<button data-bc="' + n + '"' + ((s.bar_columns || ((kinds.tile || 0) > 12 ? 3 : 2)) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') + '</div>' : '';
    return '<div class="ed"><div class="row2"><div class="fld"><label>' + t('secTitle') + '</label><input class="inp" data-f="sec.title" value="' + esc(s.title || '') + '" placeholder="' + t('titleOpt') + '"></div>' +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('column') + '</label>' + colSeg + '</div>' + subSeg + '</div>' +
      lookHtml + (this._adv() ? this._secBoxHtml(s) : '') + body + '<div class="acts"><span class="grow"></span><button class="btn sm dan' + (this._ask === 'delsec' ? ' ask' : '') + '" data-a="delsec"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'delsec' ? t('sure') : t('delSec')) + '</button></div></div>';
  }

  // Basit / Gelişmiş mod (tarayıcıya göre; varsayılan basit). Basit modda gelişmiş ayarlar gizlenir, silinmez.
  _adv() { try { return localStorage.getItem('lhd-admin-mode') === 'adv'; } catch (e) { return false; } }
  // ? yardım düğmesi ve penceresi
  _hb(key) { return LHD_HELP[key] ? '<button class="hlp" data-help="' + key + '" title="' + esc(this._t('helpT')) + '">?</button>' : ''; }
  _helpHtml() {
    const h = this._help && LHD_HELP[this._help]; if (!h) return '';
    const L = h[this._lang] || h.en;
    return '<div class="hlpov" data-hlpov><div class="hlpd"><div class="dh"><div class="di"><ha-icon icon="mdi:help-circle-outline"></ha-icon></div><h2>' + esc(L[0]) + '</h2><button class="btn ic" data-hlpx><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="hb">' + L.slice(1).map((p) => '<p>' + esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') + '</p>').join('') + '</div></div></div>';
  }

  // bölümün kutu ayarları: doldurma (içeriğe göre / kutuyu doldur) ve hizalama (üst / orta / eşit dağıt)
  _secBoxHtml(s) {
    const t = (k) => esc(this._t(k));
    const seg = (attr, cur, opts) => '<div class="seg">' + opts.map((o) => '<button ' + attr + '="' + o[0] + '"' + (cur === o[0] ? ' class="on"' : '') + (o[2] ? ' title="' + esc(o[2]) + '"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
    return '<div class="row2"><div class="fld" style="flex:0 0 auto"><label>' + t('fillL') + this._hb('fill') + '</label>' + seg('data-sfill', s.fill ? '1' : '', [['', this._t('fillC')], ['1', this._t('fillF'), this._t('fillT')]]) + '</div>' +
      (s.fill ? '' : '<div class="fld" style="flex:0 0 auto"><label>' + t('alignL') + '</label>' + seg('data-salign', s.align === 'center' || s.align === 'spread' ? s.align : '', [['', this._t('alTop')], ['center', this._t('alCenter')], ['spread', this._t('alSpread')]]) + '</div>') +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('gapL') + '</label>' + seg('data-sgap', typeof s.gap === 'number' ? String(s.gap) : '', [['', this._t('gapAuto')], ['0', '0'], ['6', '6'], ['12', '12'], ['18', '18'], ['24', '24']]) + '</div></div>';
  }

  _menuHtml() {
    const m = this._menu; if (!m) return '';
    const t = (k) => esc(this._t(k));
    let inner = '';
    if (m.kind === 'more') inner = '<button class="dan" data-a="reset"><ha-icon class="s16" icon="mdi:restore"></ha-icon>' + t('resetAll') + '</button>';
    if (m.kind === 'addtab') {
      const used = {}; this._work().forEach((x) => { if (x.area) used[x.area] = 1; });
      const areas = Object.keys(this._hass.areas || {}).filter((a) => !used[a]);
      inner = '<button data-newtab=""><ha-icon class="s16" icon="mdi:tab-plus"></ha-icon>' + t('emptyTab') + '</button>' +
        (areas.length ? '<hr><div class="mh">' + t('fromArea') + '</div>' + areas.map((a) => '<button data-newtab="' + esc(a) + '">' + lpIcon((this._hass.areas[a].icon) || 'mdi:door', 's16') + esc(this._area(a)) + '</button>').join('') : '');
    }
    if (m.kind === 'addsec') inner = '<div class="mh" style="white-space:normal;max-width:290px;line-height:1.45;text-transform:none;letter-spacing:0;font-weight:500;font-size:12.5px">' + t('secFree') + '</div>' + Object.keys(LHD_TYPES).map((k) => '<button data-newsec="' + k + '"><ha-icon class="s16" icon="' + LHD_TYPES[k].icon + '"></ha-icon><span><b>' + t('t_' + k) + '</b><br><span class="mu" style="font-size:12px">' + t('d_' + k) + '</span></span></button>').join('');
    return '<div class="menu" style="left:' + m.x + 'px;top:' + m.y + 'px;max-height:' + Math.max(200, window.innerHeight - m.y - 20) + 'px;overflow:auto">' + inner + '</div>';
  }

  _modalHtml(tabs, tab, sec) {
    const md = this._modal; if (!md) return '';
    const t = (k, v) => esc(this._t(k, v));
    if (md === 'pick' && sec) {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="' + (LHD_TYPES[sec.type] || LHD_TYPES.free).icon + '"></ha-icon></div><h2>' + t('pickT') + ' → ' + esc(sec.title || this._t('t_' + (LHD_TYPES[sec.type] ? sec.type : 'free'))) + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-q placeholder="' + t('search') + '" value="' + esc(this._q) + '">' +
        '<div class="seg pf" style="margin-top:8px">' + [['all', 'pfAll'], ['lights', 'pfTile'], ['scenes', 't_scenes'], ['values', 't_values'], ['climate', 't_climate'], ['vacuum', 't_vacuum'], ['media', 't_media']].map((x) => '<button data-pf="' + x[0] + '"' + ((this._pf || 'all') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div></div>' +
        '<div class="db"><div class="plist">' + this._pickList(sec) + '</div></div>' +
        '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="pickadd"' + (this._picked.length ? '' : ' disabled') + '>' + t('addN', { n: this._picked.length }) + '</button></div></div></div>';
    }
    if (md === 'icon') {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="mdi:shape-outline"></ha-icon></div><h2>' + t('iconPick') + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-iq placeholder="' + t('iconSearch') + '" value="' + esc(this._iq || '') + '">' +
        ('<div class="seg" style="margin-top:8px">' + [['col', 'icCol'], ['lec', 'icLec']].map((x) => '<button data-icset="' + x[0] + '"' + ((this._icSet || 'col') === x[0] ? ' class="on"' : '') + '>' + t(x[1]) + '</button>').join('') + '</div>') + '</div>' +
        '<div class="db"><div class="ilist">' + this._iconList() + '</div></div></div></div>';
    }
    if (md === 'news') return this._newsHtml();
    if (md === 'item') return this._imHtml();
    if (md === 'cardpick') return this._cpHtml();
    if (md === 'cardedit') return this._ceHtml();
    if (md === 'report') return this._reportHtml();
    if (md === 'restore') return this._restoreHtml();
    if (md === 'settings') {
      const s = this._settings();
      const seg = (path, cur, opts) => '<div class="seg">' + opts.map((o) => '<button data-set="' + path + '" data-val="' + esc(o[0]) + '"' + (cur === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const tg = (path, on) => '<button class="tg' + (on ? ' on' : '') + '" data-tg="' + path + '"></button>';
      const k = s.kiosk || {}, cv = s.canvas || {};
      // "Resim" seçilince önce adres kutusu açılır; zemin ancak adres yazılınca değişir (yoksa var olmayan bir dosya zemin olurdu)
      const bgImg = (typeof s.background === 'string' && /url\(/.test(s.background)) || !!this._bgImg;
      const bgMode = this._bgImg ? 'img' : (s.bg && s.bg.mode) || (bgImg ? 'img' : 'dark');
      const bgUrl = typeof s.background === 'string' ? (s.background.match(/url\(['"]?([^'")]+)/) || [])[1] || '' : '';
      const lec = !!(this._hass.config && (this._hass.config.components || []).indexOf('lemur_light_effects') >= 0);
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('settings') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' +
        '<div class="sh">' + t('sVer') + '</div>' + this._updRow() +   // en üstte (Light Effect Card ile aynı)
        '<div class="sh">' + t('s_board') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lang') + '</b></div>' + seg('language', s.language || 'auto', [['auto', this._t('lAuto')], ['tr', 'Türkçe'], ['en', 'English']]) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('season') + '</b><span>' + t('seasonT') + '</span></div>' + seg('season', s.season || 'auto', [['auto', this._t('sAuto')], ['summer', this._t('sSum')], ['winter', this._t('sWin')]]) + '</div>' +
        '<div class="sh">' + t('s_look') + '</div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t"><b>' + t('bg') + '</b><span>' + t('bgT') + '</span></div>' + seg('bgmode', bgMode, [['dark', this._t('bgDark')], ['black', this._t('bgBlack')], ['color', this._t('bgColor')], ['fx', this._t('bgFx')], ['img', this._t('bgImg')]]) +
        (bgMode === 'img' ? '<input class="inp w" data-bgurl value="' + esc(bgUrl) + '" placeholder="/local/zemin.jpg" style="width:100%">' + (this._bgBad ? '<span class="lecna" style="width:100%">' + t('bgBad') + '</span>' : '') : '') +
        (bgMode === 'color' ? '<div class="bgsw">' + LHD_BG_COLORS.map((c) => '<button class="bgc' + ((s.bg.color || '').toLowerCase() === c ? ' on' : '') + '" data-bgcolor="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('') +
          '<label class="bgc pick" title="' + t('bgColor') + '"><input type="color" data-bgpick value="' + esc(s.bg.color || '#0e1726') + '"><ha-icon class="s16" icon="mdi:eyedropper-variant"></ha-icon></label></div>' : '') +
        (bgMode === 'fx' ? '<div class="bgfx">' + LP_BG_FX.map((f) => '<button class="fxs' + (s.bg.fx === f[0] ? ' on' : '') + '" data-bgfx="' + f[0] + '"><i style="background:' + lpFxSwatch(f[3]) + '"></i><span>' + esc(this._lang === 'tr' ? f[1] : f[2]) + '</span></button>').join('') + '</div>' : '') + '</div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t" style="flex:1 1 100%"><b>' + t('icStyle') + '</b><span>' + t('icStyleT') + '</span></div>' + seg('icon_style', lpIconMode(), [['auto', this._t('icAuto')], ['full', this._t('icColor')], ['mono', this._t('icFlat')], ['tint', this._t('icTint')]]) +
          (lpIconMode() === 'tint' ? '<div class="bgsw" style="width:100%">' + LHD_TINT_COLORS.map((c) => '<button class="bgc' + (lpIconTint().toLowerCase() === c.toLowerCase() ? ' on' : '') + '" data-tintc="' + c + '" style="background:' + c + '" title="' + c + '"></button>').join('') + '<label class="bgc pick" title="' + t('icTintC') + '"><input type="color" data-tintpick value="' + esc(lpIconTint()) + '"><ha-icon class="s16" icon="mdi:eyedropper-variant"></ha-icon></label></div>' : '') + '</div>' +
        (lpIconMode() === 'tint' ? '<div class="srow"><div class="t"><b>' + t('icTintL') + '</b><span>' + t('icTintLT') + '</span></div>' + tg('icon_tint_light', lpIconTintLight()) + '</div>' : '') +
        '<div class="srow"><div class="t"><b>' + t('theme') + '</b><span>' + t('themeT') + '</span></div><input class="inp w" data-sf="theme_name" value="' + esc(s.theme_name || '') + '" placeholder="ios-dark-mode-blue-red"></div>' +
        '<div class="sh">' + t('s_screen') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kHeader') + '</b><span>' + t('kHeaderT') + '</span></div>' + tg('kiosk.hide_header', !!k.hide_header) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kSide') + '</b><span>' + t('kSideT') + '</span></div>' + tg('kiosk.hide_sidebar', !!k.hide_sidebar) + '</div>' +
        (!this._adv() ? '' : '<div class="srow"><div class="t"><b>' + t('canvas') + '</b><span>' + t('canvasT') + '</span></div><input class="inp" type="number" min="800" max="3000" data-sf="canvas.width" value="' + esc(cv.width || 1280) + '" style="width:90px"><input class="inp" type="number" min="500" max="2500" data-sf="canvas.ref_height" value="' + esc(cv.ref_height || 1075) + '" style="width:90px"></div>') +
        '<div class="sh">' + t('s_info') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lec') + '</b><span>' + (lec ? t('lecOn', { v: LEC.version || '?' }) : t('lecOff')) + '</span></div></div>' +
        (lec ? '<div class="srow"><div class="t"><b>' + t('lecNav') + '</b><span>' + t('lecNavT') + '</span></div>' + tg('lec_nav', s.lec_nav !== false) + '</div>' : '') +
        '<div class="srow"><div class="t"><b>' + t('hold') + '</b><span>' + t('holdT') + '</span></div>' + seg('hold', lpHoldMode() === 'lec' && !lec ? 'popup' : lpHoldMode(), [['popup', this._t('hPop')], ['ha', this._t('hHa')]].concat(lec ? [['lec', this._t('hLec')]] : [])) + '</div>' +
        (this._adv() ? this._wallsHtml() : '') +
        '<div class="sh">' + t('sHelp') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('repT') + '</b><span>' + t('repS') + '</span></div><button class="btn" data-a="report">' + t('repT') + '</button></div>' +
        '<div class="sh">' + t('sBackup') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('bkDown') + '</b><span>' + t('bkDownS') + '</span></div><button class="btn" data-a="bkdown">' + t('bkDown') + '</button></div>' +
        '<div class="srow"><div class="t"><b>' + t('bkUp') + '</b><span>' + t('bkUpS') + '</span></div><label class="btn">' + t('bkUp') + '<input type="file" accept=".json,application/json" data-bkfile style="display:none"></label></div>' +
        '</div><div class="df"><button class="btn" data-a="close">' + t('close') + '</button></div></div></div>';
    }
    if (md === 'reset') {
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di" style="color:var(--red)"><ha-icon icon="mdi:restore"></ha-icon></div><h2>' + t('resetAll') + '</h2></div>' +
        '<div class="db"><div>' + t('resetQ') + '</div></div><div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="resetgo" style="background:var(--red);border-color:var(--red);color:#fff">' + t('resetAll') + '</button></div></div></div>';
    }
    return '';
  }

  // cihaz seçici listesi: bölümün türüne uyan cihazlar, alana göre gruplu, aramayla süzülür
  _pickList(sec) {
    const S = this._hass.states, ents = this._hass.entities || {}, devs = this._hass.devices || {};
    // bölüm serbest: her tür cihaz eklenebilir; üstteki süzgeç sadece listeyi daraltır
    const pf = this._pf || 'all', doms = pf === 'all' ? LHD_ALL_DOMAINS : pf === 'values' ? LHD_VALUE_DOMAINS : (pf === 'lights' ? LHD_TYPES.lights.domains.concat(['lock']) : LHD_TYPES[pf].domains.concat(pf === 'scenes' ? ['button', 'input_button'] : []));
    const have = {};
    (sec.entities || []).forEach((x) => {
      if (typeof x === 'string') { have[x] = 1; return; }
      if (x.entity) have[x.entity] = 1;
      if (x.action && x.action.target) have[x.action.target] = 1;
      const k = lpLecKind(x), d = (x.action && x.action.data) || {};
      if (k === 'play') have['lec:' + d.room + ':' + d.effect] = 1;
      if (k === 'stop') have['lecstop:' + d.room] = 1;
    });
    const areaOf = (id) => { const e = ents[id]; if (!e) return ''; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return (d && d.area_id) || ''; };
    const q = this._q.toLowerCase().trim();
    const ids = Object.keys(S).filter((id) => doms.indexOf(id.split('.')[0]) >= 0 && !(ents[id] && (ents[id].hidden || ents[id].entity_category)))
      .filter((id) => !q || (this._ename(id) + ' ' + id + ' ' + this._area(areaOf(id))).toLowerCase().indexOf(q) >= 0);
    const lecHtml = pf === 'all' || pf === 'scenes' ? this._lecGroups(sec, have, q) : '';
    if (!ids.length) return lecHtml || '<div class="empty">' + esc(this._t('nothing')) + '</div>';
    const groups = {};
    ids.forEach((id) => { const a = areaOf(id); (groups[a] = groups[a] || []).push(id); });
    // sekmenin alanı en üstte (oda sekmesine cihaz eklerken önce o odanınkiler görünsün)
    const ct = this._curTab(this._work()), ta = ct && ct.area;
    const order = (ta && groups[ta] ? [ta] : []).concat(Object.keys(this._hass.areas || {}).filter((a) => groups[a] && a !== ta)).concat(groups[''] ? [''] : []);
    return order.map((a) => '<div class="pg">' + esc(a ? this._area(a) : this._t('noArea2')) + '</div>' + groups[a].sort((x, y) => this._ename(x).localeCompare(this._ename(y))).map((id) => {
      const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
      return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
        '<div class="ico">' + lpIcon(lpEntIcon(this._hass.states[id])) + '</div><div class="t"><b>' + esc(this._ename(id)) + '</b><span>' + esc(id) + '</span></div>' +
        '<span class="st">' + esc(dis ? this._t('added') : (this._hass.formatEntityState ? this._hass.formatEntityState(S[id]) : S[id].state)) + '</span></div>';
    }).join('')).join('') + lecHtml;
  }

  // simge seçicinin bağlamı: sekme → oda simgeleri, ışık bölümü → lambalar, senaryo → senaryolar
  _iconCtx() {
    const ip = this._ip || {};
    if (ip.kind === 'tab') return 'room';
    const tab = this._curTab(this._work()), sec = this._curSec(tab);
    const it = sec && (sec.entities || [])[ip.idx];
    return lhdKind(it) === 'scene' ? 'scene' : 'light';
  }
  _iconList() {
    const q = String(this._iq || '').toLowerCase().trim(), cur = this._ip && this._ip.cur;
    if (this._icSet === 'lec') return this._lecIconList(q, cur);
    return this._colIconList(q, cur);
    const cell = (n) => '<div class="icell' + ('mdi:' + n === cur ? ' on' : '') + '" data-icn="mdi:' + esc(n) + '" title="mdi:' + esc(n) + '"><ha-icon icon="mdi:' + esc(n) + '"></ha-icon><span>' + esc(n) + '</span></div>';
    const sug = LHD_ICON_SUGGEST[this._iconCtx()] || [];
    if (!q) return '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sug.map(cell).join('') + '</div>';
    if (/^mdi:[a-z0-9-]+$/.test(q)) return '<div class="igrid">' + cell(q.slice(4)) + '</div>';
    const L = LHD_ICONS.list;
    if (!L) { lhdIconList().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    // Türkçe kelimeleri İngilizce karşılıklarıyla genişlet
    const words = q.split(/\s+/).filter(Boolean);
    // "Işık" küçültülünce "işık" olur; karşılaştırma Türkçe harfler sadeleştirilerek yapılır
    const nz = (s) => s.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
    const terms = []; words.forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
    const score = (x) => { let b = 0; terms.forEach((tm) => { if (x.n === tm) b = Math.max(b, 4); else if (x.n.indexOf(tm) === 0) b = Math.max(b, 3); else if (x.n.indexOf(tm) >= 0) b = Math.max(b, 2); else if (x.k.indexOf(tm) >= 0) b = Math.max(b, 1); }); return b; };
    const hits = L.map((x) => ({ n: x.n, s: score(x) })).filter((x) => x.s > 0).sort((a, b) => (b.s - a.s) || (a.n.length - b.n.length) || (a.n < b.n ? -1 : 1));
    const MAX = 240;
    const sugHit = sug.filter((n) => terms.some((tm) => n.indexOf(tm) >= 0));
    let h = sugHit.length ? '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sugHit.map(cell).join('') + '</div>' : '';
    if (!hits.length && !sugHit.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    h += '<div class="pg">' + esc(this._t('iconAll')) + ' · ' + hits.length + '</div><div class="igrid">' + hits.slice(0, MAX).map((x) => cell(x.n)).join('') + '</div>';
    if (hits.length > MAX) h += '<div class="empty">' + esc(this._t('iconMore', { n: MAX })) + '</div>';
    return h;
  }
  // Light Effect Card'ın renkli simgeleri: hepsi bir ızgarada, arama adlarında (Türkçe kelimeler İngilizce karşılıklarıyla)
  _lecIconList(q, cur) {
    const M = LP_LECI.map;
    if (!M) { lpLecIcons().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    let keys = Object.keys(M).sort();
    if (!keys.length) return '<div class="empty">' + esc(this._t('icLecNone')) + '</div>';
    if (q) {
      const nz = (x) => x.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const terms = []; q.split(/\s+/).filter(Boolean).forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
      keys = keys.filter((k) => terms.some((tm) => k.replace(/_/g, ' ').indexOf(tm) >= 0 || k.indexOf(tm) >= 0));
      if (!keys.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    }
    return '<div class="igrid">' + keys.map((k) => '<div class="icell lec' + ('lec:' + k === cur ? ' on' : '') + '" data-icn="lec:' + esc(k) + '" title="' + esc(k.replace(/_/g, ' ')) + '"><span class="lic">' + M[k] + '</span><span>' + esc(k.replace(/_/g, ' ')) + '</span></div>').join('') + '</div>';
  }
  // gömülü renkli set (src/mdic.js): hepsi bir ızgarada; seçilen simge "mdi:ad" olarak kaydedilir, düz stilde de aynı simge düz çizilir
  _colIconList(q, cur) {
    const M = LP_MDIC.map;
    if (!M) { lpMdicLoad().then(() => { if (this._modal === 'icon') this._refreshIcons(); }); return '<div class="empty">' + esc(this._t('iconLoading')) + '</div>'; }
    let keys = Object.keys(M).sort();
    if (!keys.length) return '<div class="empty">' + esc(this._t('icColNone')) + '</div>';
    const cellOf = (k) => '<div class="icell lec' + (k === cur ? ' on' : '') + '" data-icn="' + esc(k) + '" title="' + esc(k) + '"><span class="lic">' + M[k] + '</span><span>' + esc(lpIsLhdIcon(k) ? k.slice(4) + ' ★' : k.slice(4)) + '</span></div>';
    if (!q) {
      const sug = []; (LHD_ICON_SUGGEST[this._iconCtx()] || []).forEach((n) => { const k = lpMdicKey('mdi:' + n); if (k && sug.indexOf(k) < 0) sug.push(k); });
      if (sug.length) return '<div class="pg">' + esc(this._t('iconSug')) + '</div><div class="igrid">' + sug.map(cellOf).join('') + '</div><div class="pg">' + esc(this._t('iconEvery')) + ' · ' + keys.length + '</div><div class="igrid">' + keys.map(cellOf).join('') + '</div>';
    }
    if (q) {
      const nz = (x) => x.replace(/[ıİ]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const terms = []; q.replace(/^mdi:/, '').split(/\s+/).filter(Boolean).forEach((w) => { const a = nz(w); terms.push(a); Object.keys(LHD_ICON_TR).forEach((k) => { const b = nz(k); if (b.indexOf(a) === 0 || (b.length > 2 && a.indexOf(b) === 0)) LHD_ICON_TR[k].split(' ').forEach((x) => terms.push(x)); }); });
      keys = keys.filter((k) => terms.some((tm) => k.indexOf(tm) >= 0));
      if (!keys.length) return '<div class="empty">' + esc(this._t('iconNone')) + '</div>';
    }
    return '<div class="igrid">' + keys.map((k) => { const n = k.slice(4); return '<div class="icell lec' + (k === cur ? ' on' : '') + '" data-icn="' + esc(k) + '" title="' + esc(k) + '"><span class="lic">' + M[k] + '</span><span>' + esc(lpIsLhdIcon(k) ? n + ' ★' : n) + '</span></div>'; }).join('') + '</div>';
  }
  _refreshIcons() { const l = this.shadowRoot && this.shadowRoot.querySelector('.ilist'); if (l) l.innerHTML = this._iconList(); }
  _applyIcon(v) {
    const ip = this._ip || {}; this._modal = null; this._ip = null; this._iq = '';
    if (ip.kind === 'im' && this._im) { this._im.f[ip.key] = v; this._modal = 'item'; return this._render(); }
    const tabs = this._work(), tab = this._curTab(tabs), tabId = tab && tab.id;
    if (ip.kind === 'tab') return this._edit((T) => { const x = T.filter((y) => y.id === tabId)[0]; if (x) x.icon = v; });
    const sec = this._curSec(tab), secId = sec && sec.id, i = ip.idx;
    return this._edit((T) => {
      const x = T.filter((y) => y.id === tabId)[0], S = x && (x.sections || []).filter((z) => z.id === secId)[0]; if (!S) return;
      let it = S.entities[i]; if (it === undefined) return;
      if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
      it.icon = v;
    });
  }

  // senaryo düğmesinin ne yaptığı (düzenleyicideki alt yazı)
  _scTarget(tab, it) {
    const T = (k, v) => esc(this._t(k, v)), k = lpLecKind(it), a = it.action || {};
    const rn = (r) => (r ? (LEC.names[r] || this._area(r) || r) : this._t('roomByTab'));
    let txt;
    if (k === 'open') txt = T('tOpen', { r: rn(a.room || tab.area) });
    else if (k === 'play') txt = T('tPlay', { e: (a.data && a.data.effect) || '?', r: rn(a.data && a.data.room) });
    else if (k === 'stop') txt = T('tStop', { r: rn(a.data && a.data.room) });
    else if (a.popup) txt = T('tPop', { t: (a.popup.title || (a.popup.card && a.popup.card.type) || '') });
    else txt = T('target') + ': ' + esc(a.target ? this._ename(a.target) : '—');
    if (k && !LEC.installed(this._hass)) txt += ' · <b class="lecna">' + T('lecNa') + '</b>';
    return txt;
  }
  _refreshPick() {
    const pl = this.shadowRoot && this.shadowRoot.querySelector('.plist'); if (!pl) return;
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab); if (!sec) return;
    pl.innerHTML = this._pickList(sec);
    pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; });
  }
  // senaryo seçicide LEC efektleri: sekmenin odası (oda yoksa bütün LEC odaları); önce "durdur", sonra favoriler, sonra hepsi
  _lecGroups(sec, have, q) {
    if (!LEC.installed(this._hass) || !LEC.rooms) return '';
    const tab = this._curTab(this._work());
    const rooms = LEC.hasRoom(tab && tab.area) ? [tab.area] : Object.keys(LEC.rooms);
    return rooms.map((r) => {
      const name = LEC.names[r] || this._area(r) || r;
      const list = LEC.effects[r];
      if (!list) { LEC.query(this._hass, r); return '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div><div class="empty">' + esc(this._t('lecLoading')) + '</div>'; }
      const fav = (LEC.favorites || []).map((x) => String(x).toLowerCase());
      const sorted = list.slice().sort((a, b) => ((fav.indexOf(String(a).toLowerCase()) < 0) - (fav.indexOf(String(b).toLowerCase()) < 0)) || String(a).localeCompare(String(b)));
      const row = (id, icon, title, sub) => {
        if (q && (title + ' ' + sub).toLowerCase().indexOf(q) < 0) return '';
        const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
        return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
          '<div class="ico">' + lpIcon(icon) + '</div><div class="t"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></div>' +
          '<span class="st">' + esc(dis ? this._t('added') : '') + '</span></div>';
      };
      const body = row('lecstop:' + r, 'mdi:stop-circle-outline', this._t('lecStop'), name) +
        sorted.map((e) => row('lec:' + r + ':' + e, fav.indexOf(String(e).toLowerCase()) >= 0 ? 'mdi:star' : 'mdi:creation', e, name)).join('');
      return body ? '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div>' + body : '';
    }).join('');
  }

  _colName(c, n) {
    if (n === 2) return [this._t('colL'), this._t('colR')][c] || String(c + 1);
    if (n === 3) return [this._t('colL'), this._t('colM'), this._t('colR')][c] || String(c + 1);
    return String(c + 1);
  }

  // ---- önizleme: panonun kendi kartı, düzenleme modunda, tasarım boyutunda çizilip kutuya sığdırılır ----
  _mountPreview(tab, sec) {
    const box = this.shadowRoot.querySelector('.pvc'); if (!box || !tab) return;
    if (!this._pv) {
      this._pv = document.createElement('lemur-home-dashboard-card');
      this._pv.addEventListener('lhd-select', (e) => { this._sec = e.detail.section; this._ask = null; this._render(); });
      this._pv.addEventListener('lhd-tab', (e) => { this._tab = e.detail.tab; this._sec = null; this._ask = null; this._render(); });
      // önizlemede sürükle-bırak ya da boyutlandırma: kart yeni sekme ayarını verir, burada kaydedilir (geri alınabilir)
      this._pv.addEventListener('lhd-addsec', (e) => {
        // tıklama olayı panele ulaştıktan sonra aç (yoksa "dışarı tıklandı" sayılıp hemen kapanır)
        const d = e.detail; setTimeout(() => { const rr = this.shadowRoot.querySelector('.app').getBoundingClientRect(); this._menu = { kind: 'addsec', x: Math.max(8, Math.min(d.x - rr.left, rr.width - 280)), y: Math.min(d.y - rr.top + 8, rr.height - 320), target: { col: d.col, sub: d.sub } }; this._render(); }, 0);
      });
      this._pv.addEventListener('lhd-change', (e) => { const nt = e.detail.tab; this._edit((T) => { const i = T.map((x) => x.id).indexOf(nt.id); if (i >= 0) { lhdFitSplits(nt, this._cw()); T[i] = nt; } }); });
    }
    const cfg = { type: 'custom:lemur-home-dashboard-card', tab: tab.id, edit: true, selected: sec ? sec.id : '', phone: this._screenKey() === 'phone' || (this._screenKey() === 'here' && lpPhoneScreen()) };
    if (!this._pvCfg || JSON.stringify(this._pvCfg) !== JSON.stringify(cfg)) { this._pvCfg = cfg; this._pv.setConfig(cfg); }
    box.appendChild(this._pv);
    this._pv.hass = this._hass;
    const s = this._settings();
    box.style.background = typeof s.background === 'string' ? s.background : LP_DEFAULT_BG;
    if (this._ro) { this._ro.disconnect(); this._ro.observe(box.parentNode); }
    this._fit();
  }
  // önizleme ekranı bu tarayıcıda hatırlanır (ayar değil, herkese gitmez)
  _screenKey() { let k = null; try { k = localStorage.getItem('lhd-preview-screen'); } catch (e) {} return LHD_SCREENS.some((x) => x[0] === k) ? k : 'tab16'; }
  _fit() {
    const R = this.shadowRoot; if (!R) return;
    // dar ekranda (tablet dikey) önizleme üstte, düzenleyici altta
    if (this._narrowNow !== undefined && ((this.clientWidth || window.innerWidth) < 980) !== this._narrowNow && !this._modal) { this._render(); return; }
    const box = R.querySelector('.pvc'), wrap = R.querySelector('.pvbox'); if (!box || !wrap) return;
    // gerçek ölçeklemeyle aynı hesap: kanvas en az W geniş, ekranın oranına göre genişler, yüksekliği ekrana göre
    const cv = this._settings().canvas || {}, W = cv.width || 1280, H = cv.ref_height || 1075;
    const sc = LHD_SCREENS.filter((x) => x[0] === this._screenKey())[0];
    const sw = sc[1] || window.innerWidth, sh = sc[2] || window.innerHeight;
    const ph = sc[0] === 'phone' || (sc[0] === 'here' && lpPhoneScreen());
    // telefon: pano ölçeklenmez, ekranın kendi genişliğinde çizilir ve aşağı kayar
    const cw = ph ? sw : Math.max(W, Math.floor(sw / sh * H)), ch = ph ? sh : Math.floor(sh * cw / sw);
    box.style.overflowY = ph ? 'auto' : '';
    const z = Math.min(wrap.clientWidth / cw, wrap.clientHeight / ch) || 0.5;
    box.style.width = cw + 'px'; box.style.height = ch + 'px';
    box.style.setProperty('--lp-h', ch + 'px');
    box.style.transform = 'translate(' + Math.max(0, (wrap.clientWidth - cw * z) / 2) + 'px,' + Math.max(0, (wrap.clientHeight - ch * z) / 2) + 'px) scale(' + z + ')';
  }

  // ---- olaylar ----
  _bind(tabs, tab, sec) {
    const R = this.shadowRoot, app = R.querySelector('.app');
    R.querySelectorAll('ha-state-icon[data-eid]').forEach((e) => { e.hass = this._hass; e.stateObj = this._hass.states[e.getAttribute('data-eid')]; });
    // sekme ve bölüm sırayla değil kimlikle bulunur (otomatik düzen ya da başka cihazdan değişiklik sırayı kaydırabilir)
    const tabId = tab ? tab.id : null, secId = sec ? sec.id : null;
    const findTab = (T) => T.filter((x) => x.id === tabId)[0];
    const editTab = (fn, soft) => this._edit((T) => { const x = findTab(T); if (x) fn(x, T); }, null, soft);
    const editSec = (fn, soft) => this._edit((T) => { const x = findTab(T), y = x && (x.sections || []).filter((z) => z.id === secId)[0]; if (y) fn(y, x); }, null, soft);

    app.addEventListener('click', (e) => {
      const g = (sel) => (e.target.closest ? e.target.closest(sel) : null);
      const a = g('[data-a]'), act = a && !a.disabled ? a.getAttribute('data-a') : null;
      if (this._menu && !g('.menu') && act !== 'more' && act !== 'addtab' && act !== 'addsec') { this._menu = null; this._render(); return; }
      if (g('[data-ovl]') && e.target === g('[data-ovl]')) { if (this._modal === 'news') return this._newsClose(); if (this._modal === 'item' || this._modal === 'cardedit') return; if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); } this._modal = null; this._render(); return; }   // öğe ayarları dışarı tıklayınca kapanmaz (yazılan kaybolmasın)
      if (act !== 'deltab' && act !== 'delsec' && this._ask) { this._ask = null; }
      const at = (el) => { const r = el.getBoundingClientRect(), rr = app.getBoundingClientRect(); return { x: Math.min(r.left - rr.left, rr.width - 260), y: r.bottom - rr.top + 6 }; };
      if (act === 'undo') return this._undoIt();
      if (act === 'settings') { this._modal = 'settings'; this._menu = null; return this._render(); }
      if (act === 'more' || act === 'addtab' || act === 'addsec') { const p = at(a); this._menu = this._menu && this._menu.kind === act ? null : { kind: act, x: p.x, y: p.y }; return this._render(); }
      if (act === 'close') {
        if (this._modal === 'icon' && this._ip && this._ip.kind === 'im' && this._im) { this._ip = null; this._modal = 'item'; return this._render(); }   // simge seçiciden öğe ayarlarına dön
        if (this._modal === 'cardedit' && this._ce && this._ce.im) { this._im = this._ce.im; this._ce = null; this._modal = 'item'; return this._render(); }
        this._modal = null; this._picked = []; this._q = ''; this._bk = null; this._im = null; this._ce = null; return this._render();
      }
      if (act === 'imsave') return this._imSave();
      if (act === 'addsub') return editSec((S) => { S.entities = (S.entities || []).concat([{ subtitle: this._t('subItem').toLocaleUpperCase(this._lang === 'tr' ? 'tr' : 'en') }]); });
      if (act === 'addpet') return this._imOpen(-1, { pet: '' }, true);
      if (act === 'addcard') { this._cpq = ''; this._modal = 'cardpick'; this._menu = null; return this._render(); }
      if (act === 'report') return this._reportOpen();
      if (act === 'repgo') return this._repGo();
      if (act === 'repcopy') return this._repCopy();
      if (act === 'bkdown') return this._backupDown();
      if (act === 'bkyes') return this._backupApply();
      if (act === 'reset') { this._menu = null; this._modal = 'reset'; return this._render(); }
      if (act === 'resetgo') { this._snap(); this._modal = null; this._sec = null; this._commit('tabs', []); this._toast(this._t('resetOk')); return this._render(); }
      if (act === 'deltab') {
        if (this._ask !== 'deltab') { this._ask = 'deltab'; return this._render(); }
        this._ask = null; const id = tab.id; this._sec = null;
        this._edit((T) => { T.splice(T.map((x) => x.id).indexOf(id), 1); }); this._tab = null; return;
      }
      if (act === 'delsec') {
        if (this._ask !== 'delsec') { this._ask = 'delsec'; return this._render(); }
        this._ask = null; const id = sec.id; this._sec = null;
        return editTab((T) => { T.sections = T.sections.filter((x) => x.id !== id); });
      }
      if (act === 'refill') {
        const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === tab.area)[0];
        if (!fresh) return;
        this._sec = null;
        // sekmenin kolon sayısı korunur: otomatik düzendeki 3. kolon, kolonu az olan sekmede son kolona düşer
        return editTab((T) => { const n = lpWeights(T).length; T.sections = fresh.sections.map((s) => { const o = Object.assign({}, s, { id: lhdId('s') }); if ((o.col || 0) > n - 1) o.col = n - 1; delete o.sub; return o; }); });
      }
      if (act === 'pick') { this._modal = 'pick'; this._picked = []; this._q = ''; this._pf = 'all'; return this._render(); }
      if (act === 'pickadd') {
        const ids = this._picked.slice(); this._modal = null; this._picked = []; this._q = '';
        return editSec((S) => {
          S.entities = S.entities || [];
          const nBtn = () => S.entities.filter((x) => lhdKind(x) === 'scene').length;
          ids.forEach((id) => {
            if (id.indexOf('lec:') === 0) {
              const p = id.split(':'), room = p[1], effect = p.slice(2).join(':');
              S.entities.push({ name: effect, icon: 'mdi:creation', color: LHD_COLORS[nBtn() % LHD_COLORS.length], action: { service: LP_LEC_DOMAIN + '.play', data: { room: room, effect: effect } } });
              return;
            }
            if (id.indexOf('lecstop:') === 0) {
              S.entities.push({ name: this._t('lecStop'), icon: 'mdi:stop-circle-outline', color: '#E5484D', action: { service: LP_LEC_DOMAIN + '.stop', data: { room: id.slice(8) } } });
              return;
            }
            const d = id.split('.')[0], st = this._hass.states[id];
            // betik, sahne, otomasyon, buton: renkli düğme olur (ad, simge, renk düzenlenebilir)
            if (d === 'script' || d === 'scene' || d === 'automation' || d === 'button' || d === 'input_button') {
              const sv = d === 'automation' ? 'automation.trigger' : (d === 'button' || d === 'input_button') ? d + '.press' : d + '.turn_on';
              S.entities.push({ name: this._ename(id), icon: (st && st.attributes.icon) || (d === 'script' ? 'mdi:play-circle-outline' : d === 'scene' ? 'mdi:palette-outline' : d === 'automation' ? 'mdi:robot' : 'mdi:gesture-tap-button'),
                color: LHD_COLORS[nBtn() % LHD_COLORS.length], action: { service: sv, target: id } });
              return;
            }
            S.entities.push(d === 'climate' ? this._climateItem(id) : id);
          });
        });
      }
      const ipb = g('[data-ip]');
      if (ipb) {
        const v = ipb.getAttribute('data-ip'), tabs0 = this._work(), tab0 = this._curTab(tabs0), sec0 = this._curSec(tab0);
        let cur = '';
        if (v === 'tab') cur = tab0 && tab0.icon;
        else if (v.indexOf('im:') === 0) cur = this._im ? this._im.f[v.slice(3)] : '';
        else { const i = +v.split(':')[1], L = sec0 && sec0.entities; const it = L && L[i]; cur = it && typeof it === 'object' ? it.icon : ''; }
        this._ip = v === 'tab' ? { kind: 'tab', cur: cur } : v.indexOf('im:') === 0 ? { kind: 'im', key: v.slice(3), cur: cur } : { kind: 'item', idx: +v.split(':')[1], cur: cur };
        this._iq = ''; this._modal = 'icon'; this._icSet = lpIsLecIcon(cur) ? 'lec' : 'col'; lpMdicLoad(); this._render();
        // dokunmatik ekranda klavye kendiliğinden açılmasın: odak sadece fareli cihazda
        const q = this.shadowRoot.querySelector('[data-iq]'); if (q && !('ontouchstart' in window)) q.focus();
        return;
      }
      const ics = g('[data-icset]');
      if (ics) { this._icSet = ics.getAttribute('data-icset'); this.shadowRoot.querySelectorAll('[data-icset]').forEach((b) => b.classList.toggle('on', b === ics)); this._refreshIcons(); return; }
      const icn = g('[data-icn]');
      if (icn && this._modal === 'icon') return this._applyIcon(icn.getAttribute('data-icn'));
      if (act === 'lecok') return this._setting('lec_seen', true);
      if (act === 'addlec') return editSec((S) => { S.entities = S.entities || []; S.entities.push({ name: this._t('lecOpen'), icon: 'mdi:creation', color: '#FF6FAE', action: { service: LP_LEC_DOMAIN + '.open' } }); });
      if (act === 'addscph') return editSec((S) => { S.entities = S.entities || []; S.entities.push({ name: this._t('addScPh'), icon: 'mdi:gesture-tap', color: LHD_COLORS[S.entities.filter((x) => lhdKind(x) === 'scene').length % LHD_COLORS.length], action: null }); });
      if (act === 'addph') return editSec((S) => { S.entities = (S.entities || []).concat([{ name: this._t('addPh'), icon: 'mdi:lightbulb-outline' }]); });
      const nt = g('[data-newtab]');
      if (nt) {
        const aid = nt.getAttribute('data-newtab'); this._menu = null;
        // sekme kimliği panonun adresinde görünür (/pano/salon): alan kimliği ya da "sekme", çakışırsa -2, -3...
        const taken = {}; this._work().forEach((x) => { taken[x.id] = 1; });
        const base = aid || (this._lang === 'tr' ? 'sekme' : 'tab');
        let id = base, k = 2; while (taken[id]) id = base + '-' + (k++);
        let nw;
        if (aid) {
          const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === aid)[0];
          const ar = this._hass.areas[aid];
          nw = fresh ? Object.assign({}, fresh, { id: id, sections: fresh.sections.map((s) => Object.assign({}, s, { id: lhdId('s') })) })
            : { id: id, name: ar.name, icon: ar.icon || 'mdi:door', area: aid, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        } else {
          nw = { id: id, name: this._t('newTab'), icon: 'mdi:door', area: null, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        }
        this._tab = id; this._sec = null;
        return this._edit((T) => { T.push(nw); });
      }
      const ns = g('[data-newsec]');
      if (ns) {
        const type = ns.getAttribute('data-newsec'), id = lhdId('s'), tgt = this._menu && this._menu.target; this._menu = null;
        const L = this._lang, titles = { free: '', lights: t(L, 'lights'), scenes: t(L, 'scenes'), climate: tab.area ? upper(L, this._area(tab.area)) : t(L, 'control'), vacuum: upper(L, this._t('t_vacuum')), media: t(L, 'media') };
        const ncol = lpWeights(tab).length;
        const s = { id: id, type: type, title: titles[type], col: tgt ? tgt.col : Math.min(LHD_TYPES[type].col, ncol - 1) };
        if (tgt && tgt.sub) s.sub = tgt.sub;
        s.entities = [];
        // karo sayısı yerin genişliğine göre: geniş kolonda 5, dar sütunda daha az (tablet panosunda 56'lık kolonda 5 karo)
        if (type === 'lights' || type === 'free') { const w = lpWeights(tab), sum = w.reduce((a, b) => a + b, 0), sp = lpSplits(tab, w.length)[s.col] || 1;
          s.tile_columns = Math.max(2, Math.min(5, Math.round(w[s.col] / sum / sp * 9))); }
        this._sec = id;
        return editTab((T) => { T.sections.push(s); });
      }
      const tb = g('[data-tab]');
      if (tb && !this._dragged) { this._tab = tb.getAttribute('data-tab'); this._sec = null; return this._render(); }
      const si = g('.si[data-sec]');
      if (si && !this._dragged && !g('[data-handle]')) { this._sec = si.getAttribute('data-sec'); return this._render(); }
      const sb = g('[data-scr]');
      if (sb) { try { localStorage.setItem('lhd-preview-screen', sb.getAttribute('data-scr')); } catch (x) {} return this._render(); }
      // kolonlar: ekle / son kolonu kaldır (bölümleri bir soldakine geçer) / tablet düzeni / eşit. Toplam oran korunur, bölümler yerinde kalır.
      if (act === 'coladd') return editTab((T) => { const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0); T.columns = w.map((x) => Math.round(x * n / (n + 1) * 100) / 100).concat([Math.round(sum / (n + 1) * 100) / 100]); if (T.splits) T.splits = lpSplits(T, n + 1);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coldel') return editTab((T) => { const w = lpWeights(T), n = w.length; if (n < 2) return; const sum = w.reduce((a, b) => a + b, 0), keep = w.slice(0, -1), ks = keep.reduce((a, b) => a + b, 0);
        T.columns = keep.map((x) => Math.round(x * sum / ks * 100) / 100); T.sections.forEach((s) => { if ((s.col || 0) > n - 2) { s.col = n - 2; delete s.sub; } });
        if (T.splits) T.splits = lpSplits(T, n - 1); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const spb = g('[data-split]');
      if (spb) { const p = spb.getAttribute('data-split').split(':'), i = +p[0], v = +p[1];
        return editTab((T) => { const sp = lpSplits(T, lpWeights(T).length); sp[i] = v; T.splits = sp; T.sections.forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > v - 1) { if (v > 1) s.sub = v - 1; else delete s.sub; } }); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); }); }
      const ssb = g('[data-ssub]');
      if (ssb) { const v = +ssb.getAttribute('data-ssub'); return editSec((S) => { if (v) S.sub = v; else delete S.sub; }); }
      if (act === 'coltab') return editTab((T) => { T.columns = LP_DEFAULT_COLS.slice();  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coleq') return editTab((T) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); T.columns = w.map(() => Math.round(sum / w.length * 100) / 100);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const sc = g('[data-scol]');
      if (sc) return editSec((S) => { S.col = +sc.getAttribute('data-scol'); delete S.sub; });
      const tc = g('[data-tc]');
      if (tc) return editSec((S) => { S.tile_columns = +tc.getAttribute('data-tc'); });
      const pfb = g('[data-pf]');
      if (pfb) { this._pf = pfb.getAttribute('data-pf'); this.shadowRoot.querySelectorAll('[data-pf]').forEach((b) => b.classList.toggle('on', b === pfb)); this._refreshPick(); return; }
      const lk = g('[data-look]');
      if (lk) return editSec((S) => { const v = lk.getAttribute('data-look'); if (v === 'tile') delete S.look; else S.look = v; });
      const sfb = g('[data-sfill]');
      if (sfb) return editSec((S) => { if (sfb.getAttribute('data-sfill')) S.fill = true; else delete S.fill; });
      const sgb = g('[data-sgap]');
      if (sgb) return editSec((S) => { const v = sgb.getAttribute('data-sgap'); if (v === '') delete S.gap; else S.gap = +v; });
      const sab = g('[data-salign]');
      if (sab) return editSec((S) => { const v = sab.getAttribute('data-salign'); if (v) S.align = v; else delete S.align; });
      const bcb = g('[data-bc]');
      if (bcb) return editSec((S) => { S.bar_columns = +bcb.getAttribute('data-bc'); });
      const imb = g('[data-im]');
      if (imb) { const i = +imb.getAttribute('data-im'), L = (sec && sec.entities) || []; if (L[i] !== undefined) this._imOpen(i, L[i], false); return; }
      const hlp = g('[data-help]');
      if (hlp) { e.preventDefault(); e.stopPropagation(); this._help = hlp.getAttribute('data-help'); return this._render(); }
      if (g('[data-hlpx]') || (g('[data-hlpov]') && e.target === g('[data-hlpov]'))) { this._help = null; return this._render(); }
      const mdb = g('[data-mode]');
      if (mdb) { try { localStorage.setItem('lhd-admin-mode', mdb.getAttribute('data-mode')); } catch (x) {} return this._render(); }
      if (g('[data-advon]')) { try { localStorage.setItem('lhd-admin-mode', 'adv'); } catch (x) {} return this._render(); }
      const isw = g('[data-imsw]');
      if (isw && this._im) { const p = isw.getAttribute('data-imsw').split(':'); this._im.f[p[0]] = p[1]; return this._render(); }
      if (g('[data-imsc]') && this._im) { this._im.f.scOn = !this._im.f.scOn; return this._render(); }
      if (g('[data-imscadd]') && this._im) { this._im.f.scRows.push(['', '#28BE64']); return this._render(); }
      const icl = g('[data-imclr]');
      if (icl && this._im) { this._im.f[icl.getAttribute('data-imclr')] = ''; return this._render(); }
      if (g('[data-imzone]') && this._im) { this._im.f.zOn = !this._im.f.zOn; return this._render(); }
      const itg = g('[data-imtg]');
      if (itg && this._im) { const kk = itg.getAttribute('data-imtg'); this._im.f[kk] = !this._im.f[kk]; return this._render(); }
      if (g('[data-ceopen]') && this._im) {
        let c; try { c = lhdYamlParse(this._im.f.card || ''); } catch (x) { c = null; }
        return this._ceOpen(c && c.type ? c : { type: 'markdown', content: '' }, this._im);
      }
      const cpi = g('[data-cpk]');
      if (cpi) return this._cpPick(cpi.getAttribute('data-cpk'));
      if (g('[data-cpyaml]')) { this._modal = null; return this._imOpen(-1, { card: { type: 'markdown', content: '' } }, true); }
      const cev = g('[data-cev]');
      if (cev && this._ce) { this._ceSetView(cev.getAttribute('data-cev')); return; }
      if (g('[data-cesave]') && this._ce) return this._ceSave();
      if (g('[data-ceback]') && this._ce) { const back = this._ce.im; this._ce = null; if (back) { this._im = back; this._modal = 'item'; } else this._modal = 'cardpick'; return this._render(); }
      const isg = g('[data-imseg]');
      if (isg && this._im) { const p = isg.getAttribute('data-imseg').split(':'); this._im.f[p[0]] = p[1]; return this._render(); }
      if (g('[data-imvis]') && this._im) { this._im.f.visOn = !this._im.f.visOn; return this._render(); }
      const dl = g('[data-del]');
      if (dl) { const i = +dl.getAttribute('data-del'); return editSec((S) => { (S.entities || []).splice(i, 1); }); }
      const pk = g('[data-pk]');
      if (pk && !pk.classList.contains('dis')) {
        const id = pk.getAttribute('data-pk'), k = this._picked.indexOf(id);
        if (k >= 0) this._picked.splice(k, 1); else this._picked.push(id);
        pk.classList.toggle('on', k < 0);
        pk.querySelector('.ck').innerHTML = k < 0 ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '';
        const btn = R.querySelector('[data-a="pickadd"]'); btn.disabled = !this._picked.length; btn.textContent = this._t('addN', { n: this._picked.length });
        return;
      }
      if (g('[data-news]')) { e.preventDefault(); this._newsFrom = this._modal; this._newsAll = false; this._modal = 'news'; return this._render(); }
      if (g('[data-newsall]')) { this._newsAll = true; return this._render(); }
      if (g('[data-newsclose]')) return this._newsClose();
      if (g('[data-updcheck]')) return this._updCheck();
      if (g('[data-wladd]')) { const W = this._walls(); W.push({}); this._wallDraft = W; return this._render(); }
      if (g('[data-wldel]')) { const W = this._walls(); W.splice(+g('[data-wldel]').getAttribute('data-wldel'), 1); this._wallDraft = null; const ok = W.filter((w) => w.switch && w.light); this._commit('walls', ok); return this._render(); }
      if (g('[data-updgo]')) return this._updInstall();
      if (g('[data-updrs]')) return this._updSet({ st: 'ask' });
      if (g('[data-updno]')) return this._updSet({ st: 'installed' });
      if (g('[data-updyes]')) return this._updRestart();
      const tcl = g('[data-tintc]');
      if (tcl) return this._setting('icon_tint', tcl.getAttribute('data-tintc'));
      const bgc = g('[data-bgcolor]');
      if (bgc) return this._bgSet({ mode: 'color', color: bgc.getAttribute('data-bgcolor') });
      const bgf = g('[data-bgfx]');
      if (bgf) return this._bgSet({ mode: 'fx', fx: bgf.getAttribute('data-bgfx') });
      const st = g('[data-set]');
      if (st) {
        const path = st.getAttribute('data-set'), v = st.getAttribute('data-val');
        if (path === 'bgmode') {
          if (v === 'img') { this._bgImg = true; this._bgBad = false; this._render(); const i = this.shadowRoot.querySelector('[data-bgurl]'); if (i) i.focus(); return; }
          this._bgImg = false; this._bgBad = false;
          const cur = this._settings().bg || {};
          if (v === 'dark') return this._bgSet(null);
          if (v === 'black') return this._bgSet({ mode: 'black' });
          if (v === 'color') return this._bgSet({ mode: 'color', color: cur.color || LHD_BG_COLORS[1] });
          if (v === 'fx') return this._bgSet({ mode: 'fx', fx: cur.fx || 'aurora' });
        }
        return this._setting(path, v === 'auto' ? null : v);
      }
      const tgl = g('[data-tg]');
      if (tgl) {
        const path = tgl.getAttribute('data-tg'); const cur = tgl.classList.contains('on');
        if (path === 'lec_nav' || path === 'icon_tint_light') return this._setting(path, cur ? false : null);   // varsayılan açık: kapatınca false saklanır
        return this._setting(path, cur ? null : true);
      }
    });

    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir (yazarken odak kaybolmasın)
    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir. Yazı alanları "soft" kaydedilir: panel yeniden
    // çizilmez (odak ve hemen arkasından basılan düğme kaybolmasın); görünen ilgili yazılar yerinde güncellenir, önizleme kendisi güncellenir.
    app.addEventListener('change', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-imf')) { if (this._im) { this._im.f[el.getAttribute('data-imf')] = el.value; if (el.tagName === 'SELECT' || (el.type === 'color' && /^(color|color_on|bg)$/.test(el.getAttribute('data-imf')))) this._render(); } return; }
      if (el.hasAttribute && el.hasAttribute('data-wl')) { const p = el.getAttribute('data-wl').split(':'); this._wallSet(+p[0], p[1], el.value); return; }
      if (el.hasAttribute && el.hasAttribute('data-bkfile')) { const f = el.files && el.files[0]; el.value = ''; if (f) this._backupRead(f); return; }
      const soft = el.tagName === 'INPUT';
      const f = el.getAttribute && el.getAttribute('data-f');
      if (f === 'tab.name') {
        const v = el.value.trim(); if (!v) { el.value = tab.name; return; }
        const lb = R.querySelector('.rb.on'); if (lb && lb.lastChild && lb.lastChild.nodeType === 3) lb.lastChild.textContent = v;
        // yeni açılmış adsız sekme ilk kez adlandırılınca adresi de addan gelsin (/pano/sekme → /pano/salon)
        if (/^(sekme|tab)(-\d+)?$/.test(tab.id)) {
          const base = lhdSlug(v) || tab.id, taken = {}; this._work().forEach((x) => { if (x.id !== tab.id) taken[x.id] = 1; });
          let nid = base, k = 2; while (taken[nid]) nid = base + '-' + (k++);
          if (nid !== tab.id) { this._tab = nid; return this._edit((T) => { const x = T.filter((y) => y.id === tabId)[0]; if (x) { x.name = v; x.id = nid; } }); }
        }
        return editTab((T) => { T.name = v; }, true);
      }
      if (f === 'tab.icon') {
        const v = el.value.trim() || 'mdi:door';
        const ic = R.querySelector('.rb.on .lic'); if (ic) ic.outerHTML = lpIcon(v);
        const pv = R.querySelector('.iconin .pv .lic'); if (pv) pv.outerHTML = lpIcon(v);
        return editTab((T) => { T.icon = v; }, true);
      }
      if (f === 'tab.area') return editTab((T) => { T.area = el.value || null; });
      if (f === 'sec.title') {
        const lb = R.querySelector('.si.on .nm b'); if (lb) lb.textContent = el.value || this._t('t_' + (LHD_TYPES[sec.type] ? sec.type : 'free'));
        return editSec((S) => { S.title = el.value; }, true);
      }
      const itf = el.getAttribute && el.getAttribute('data-if');
      if (itf) {
        const p = itf.split('.'), i = +p[0], key = p[1], v = el.value.trim();
        if (key === 'color') { const ic = el.parentNode.querySelector('.ico ha-icon'); if (ic) ic.style.color = v; }
        return editSec((S) => {
          let it = S.entities[i]; if (it === undefined) return;
          if (it && typeof it === 'object' && !it.entity) { if (v) it[key] = v; else if (key !== 'name') delete it[key]; return; }   // düğme ya da boş karo
          if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
          if (key === 'link') { if (v) it.entities = [v].concat((it.entities || []).slice(1).filter((x) => x !== v)); else delete it.entities; }
          else if (v && !(key === 'kind' && v === 'auto')) it[key] = v; else delete it[key];
          if (it.entity && Object.keys(it).length === 1) S.entities[i] = it.entity;   // sade kalsın
        }, soft);
      }
      if (el.hasAttribute && el.hasAttribute('data-bgpick')) return this._bgSet({ mode: 'color', color: el.value }, true);
      if (el.hasAttribute && el.hasAttribute('data-tintpick')) return this._setting('icon_tint', el.value);
      const sf = el.getAttribute && el.getAttribute('data-sf');
      if (sf) { const v = el.type === 'number' ? (parseInt(el.value, 10) || null) : el.value.trim(); return this._setting(sf, v, true); }
      if (el.hasAttribute && el.hasAttribute('data-bgurl')) {
        const u = el.value.trim();
        // resim gerçekten açılıyor mu: açılmazsa uyarı (zemin yine kaydedilir, dosya sonradan konabilir)
        if (u) { const im = new Image(); im.onload = () => { if (this._bgBad) { this._bgBad = false; this._render(); } }; im.onerror = () => { this._bgBad = true; if (this._modal === 'settings') this._render(); }; im.src = u; }
        return this._bgSet(u ? { mode: 'img', url: u } : null, true);
      }
    });
    app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('inp') && e.target.tagName === 'INPUT') e.target.blur(); });
    // simge alanında yazarken önizleme
    app.addEventListener('input', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-iq')) { this._iq = el.value; this._refreshIcons(); return; }
      if (el.hasAttribute && el.hasAttribute('data-cpq')) { this._cpq = el.value; const l = R.querySelector('.cplist'); if (l) { const tmp = document.createElement('div'); tmp.innerHTML = this._cpHtml(); const nl = tmp.querySelector('.cplist'); if (nl) l.innerHTML = nl.innerHTML; } return; }
      if (el.hasAttribute && el.hasAttribute('data-ceyaml')) { if (this._ce) { this._ce.yaml = el.value; clearTimeout(this._ce.yT); const C = this._ce; C.yT = setTimeout(() => { try { const c = lhdYamlParse(C.yaml); if (c && c.type) { C.cfg = c; this._cePreview(); } } catch (e) {} }, 500); } return; }
      if (el.hasAttribute && el.hasAttribute('data-imsr')) { if (this._im) { const p = el.getAttribute('data-imsr').split(':'); this._im.f.scRows[+p[0]][+p[1]] = el.value; } return; }
      if (el.hasAttribute && el.hasAttribute('data-imf')) {
        if (this._im) { const key = el.getAttribute('data-imf'); this._im.f[key] = el.value; if (/icon/.test(key)) { const pv = el.closest('.iconin'); const ic = pv && pv.querySelector('.pv .lic'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.outerHTML = lpIcon(el.value.trim()); } }
        return;
      }
      if (el.hasAttribute && el.hasAttribute('data-repq')) { if (this._rep) { this._rep.text = el.value; this._rep.copied = false; } return; }
      if (el.hasAttribute && el.hasAttribute('data-q')) { this._q = el.value; const pl = R.querySelector('.plist'); if (pl) { pl.innerHTML = this._pickList(sec); pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; }); } return; }
      const f = el.getAttribute && (el.getAttribute('data-f') || el.getAttribute('data-if') || '');
      if (/icon$/.test(f)) { const pv = el.closest('.iconin, .it'); const ic = pv && pv.querySelector('.pv .lic, .ico .lic'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.outerHTML = lpIcon(el.value.trim()); }
    });
    const q = R.querySelector('[data-q]'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }

    // sürükle bırak: sekmeler (yatay), bölümler, öğeler
    R.querySelectorAll('[data-dl]').forEach((list) => {
      list.addEventListener('pointerdown', (e) => {
        const h = e.target.closest ? e.target.closest('[data-handle]') : null;
        if (!h || e.button !== 0) return;
        const item = h.closest('[data-di]'); if (!item || item.parentNode !== list) return;
        const items = Array.prototype.filter.call(list.children, (x) => x.hasAttribute('data-di'));
        const from = items.indexOf(item), horiz = list.getAttribute('data-dir') === 'x';
        const sx = e.clientX, sy = e.clientY;
        let to = from, started = false;
        this._dragged = false;
        const clear = () => items.forEach((x) => x.classList.remove('dropb', 'dropa'));
        const move = (ev) => {
          if (!started && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
          if (!started) { started = true; item.classList.add('dragging'); try { list.setPointerCapture(e.pointerId); } catch (x) {} }
          const pos = horiz ? ev.clientX : ev.clientY;
          to = items.length;
          for (let i = 0; i < items.length; i++) { const r = items[i].getBoundingClientRect(); if (pos < (horiz ? r.left + r.width / 2 : r.top + r.height / 2)) { to = i; break; } }
          clear();
          if (to < items.length) items[to].classList.add('dropb'); else items[items.length - 1].classList.add('dropa');
        };
        const up = () => {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          clear(); item.classList.remove('dragging');
          if (!started) return;
          this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
          const dest = to > from ? to - 1 : to;
          if (dest === from) return;
          const kind = list.getAttribute('data-dl');
          if (kind === 'tabs') this._edit((T) => lhdMove(T, from, dest));
          if (kind === 'secs') editTab((T) => lhdMove(T.sections, from, dest));
          if (kind === 'items') editSec((S) => lhdMove(S.entities, from, dest));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
  }

  // --- öğe ayarları penceresi: ad, simge, açık/kapalı simgeleri, dokununca / basılı tutunca, düğmenin eylemi, gömülü kart, koşullu görünürlük ---
  // Alanlar taslakta (this._im.f) tutulur; "Kaydet"e basınca öğeye yazılır (YAML hatalıysa pencere açık kalır, hata gösterilir).
  _imOpen(idx, raw, isNew) {
    const tab = this._curTab(this._work()), sec = this._curSec(tab);
    if (!tab || !sec) return;
    const it = typeof raw === 'string' ? { entity: raw } : lhdClone(raw || {});
    const f = { name: it.name || '', icon: it.icon || '', icon_on: it.icon_on || '', icon_off: it.icon_off || '', size: it.size || '', icon_size: it.icon_size || '', text_size: it.text_size || '',
      look: it.look || '', color: it.color || '', color_on: it.color_on || '', bg: it.bg || '', height: it.height ? String(it.height) : '', subtitle: it.subtitle || '',
      swap: !!it.swap, cfm: !!it.confirm, cfmText: typeof it.confirm === 'string' ? it.confirm : '' };
    const tw = it.entity && STORE.data && STORE.data.twins && STORE.data.twins[it.entity];
    f.twin = (tw && tw.backup) || '';
    const s2 = it.secondary || '';
    f.secK = !s2 ? '' : s2 === 'state' || s2 === 'last_changed' ? s2 : s2.indexOf('attr:') === 0 ? 'attr' : 'tpl';
    f.secAttr = f.secK === 'attr' ? s2.slice(5) : ''; f.secTpl = f.secK === 'tpl' ? s2 : '';
    const sc = it.state_colors && typeof it.state_colors === 'object' ? it.state_colors : null;
    f.scOn = !!sc; f.scE = (sc && sc.entity) || '';
    f.scRows = sc && sc.map ? Object.keys(sc.map).map((x) => [x, sc.map[x]]) : [];
    while (f.scRows.length < 4) f.scRows.push(['', LHD_SC_DEF[f.scRows.length % LHD_SC_DEF.length]]);
    const z = it.zones && typeof it.zones === 'object' ? it.zones : null;
    f.zOn = !!z;
    for (let q = 0; q < 4; q++) f['zt' + q] = z && z.t && z.t[q] !== undefined && z.t[q] !== null ? String(z.t[q]) : String(LHD_ZONE_DEF.t[q]);
    for (let q = 0; q < 5; q++) f['zc' + q] = (z && z.c && z.c[q]) || LHD_ZONE_DEF.c[q];
    const ai = (pre, a, scene) => {
      const o = {};
      if (scene && (a === null || a === undefined)) o.K = 'none';
      else if (a === undefined || a === null || a === '') o.K = 'def';
      else if (typeof a === 'string') o.K = ['more-info', 'toggle', 'none'].indexOf(a) >= 0 ? a : 'def';
      else if (a.popup && typeof a.popup === 'object') { o.K = 'popup'; o.Title = a.popup.title || ''; o.Card = a.popup.card ? lhdYamlDump(a.popup.card) : ''; }
      else {
        const sv = a.service || a.perform_action, tg = a.target;
        const simpleT = tg === undefined || typeof tg === 'string' || (tg && typeof tg === 'object' && !Array.isArray(tg) && Object.keys(tg).length === 1 && typeof tg.entity_id === 'string');
        const ks = Object.keys(a).filter((k) => ['service', 'perform_action', 'target', 'data', 'action'].indexOf(k) < 0);
        if (typeof sv === 'string' && simpleT && !ks.length && (!a.action || a.action === 'perform-action' || a.action === 'call-service')) {
          o.K = 'service'; o.Sv = sv; o.Tg = typeof tg === 'string' ? tg : (tg ? tg.entity_id : ''); o.Data = a.data && Object.keys(a.data).length ? lhdYamlDump(a.data) : '';
        } else if (!sv && (a.action === 'more-info' || a.action === 'toggle' || a.action === 'none') && !a.entity) o.K = a.action;
        else { o.K = 'yaml'; o.Y = lhdYamlDump(a); }
      }
      Object.keys(o).forEach((k) => { f[pre + k] = o[k]; });
    };
    ai('tap', it.tap); ai('hold', it.hold);
    if (!it.entity && Object.prototype.hasOwnProperty.call(it, 'action')) ai('act', it.action, true);
    if (it.card) f.card = lhdYamlDump(it.card);
    if (Object.prototype.hasOwnProperty.call(it, 'pet')) {
      const P = ((STORE.data && STORE.data.pets) || {})[it.pet] || {}, fd = P.feeder || {};
      Object.assign(f, { pName: P.name || '', pKind: P.kind || 'cat', pIcon: P.icon || '', pMode: P.mode === 'times' ? 'times' : 'interval', pEvery: String(P.every_h || 12),
        pTimes: (P.times || ['08:00', '20:00']).join(', '), pSoon: String(P.soon_min || 60), pGrace: String(P.grace_min || 30), pNotify: P.notify || '', pFeedSv: fd.service || '', pFeedTg: fd.target || '' });
    }
    const v = it.visible && typeof it.visible === 'object' ? it.visible : null;
    f.visOn = !!(v && v.entity); f.visE = (v && v.entity) || '';
    f.visM = v && v.not !== undefined ? 'not' : (v && v.states !== undefined ? 'in' : 'eq');
    const vl = v ? (v.not !== undefined ? v.not : (v.states !== undefined ? v.states : v.state)) : null;
    f.visV = vl === null || vl === undefined ? '' : [].concat(vl).join(', ');
    this._im = { tab: tab.id, sec: sec.id, idx: idx, isNew: !!isNew, raw: it, f: f, err: '' };
    this._modal = 'item'; this._menu = null; this._render();
  }
  _imHtml() {
    const M = this._im; if (!M) return '';
    const t = (k, v) => esc(this._t(k, v)), f = M.f, it = M.raw, S = this._hass.states;
    const k = lhdKind(it), st = it.entity ? S[it.entity] : null, d = it.entity ? it.entity.split('.')[0] : '';
    const adv = this._adv(), hb = (x) => this._hb(x);   // basit modda gelişmiş ayarlar gizli (silinmez)
    const inp = (key, ph, list) => '<input class="inp" data-imf="' + key + '" value="' + esc(f[key] || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + (list ? ' list="lhdents"' : '') + ' spellcheck="false">';
    const ta = (key, rows, ph) => '<textarea class="inp ta" data-imf="' + key + '" rows="' + rows + '" spellcheck="false"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(f[key] || '') + '</textarea>';
    const fld = (label, html, cls) => '<div class="fld' + (cls ? ' ' + cls : '') + '"><label>' + label + '</label>' + html + '</div>';
    const icf = (key, label, ph) => fld(label, '<div class="iconin"><div class="pv">' + lpIcon(f[key] || ph || 'mdi:shape-outline') + '</div>' + inp(key, ph) + '<button class="btn sm ic" data-ip="im:' + key + '" title="' + t('iconPick') + '"><ha-icon class="s16" icon="mdi:shape-outline"></ha-icon></button></div>');
    // eylem seçici: pre = tap | hold | act
    const actF = (pre, label, defLabel, opts) => {
      const K = f[pre + 'K'] || (opts[0] === 'def' ? 'def' : opts[0]);
      if (!adv) { opts = opts.filter((o) => ['def', 'more-info', 'toggle', 'none'].indexOf(o) >= 0); if (opts.indexOf(K) < 0) return ''; }   // basit: yalnız temel eylemler
      const names = { def: defLabel, 'more-info': this._t('a_more'), toggle: this._t('a_tog'), none: this._t('a_none'), service: this._t('a_svc'), popup: this._t('a_pop'), yaml: this._t('a_yaml') };
      let h = '<select class="inp" data-imf="' + pre + 'K">' + opts.map((o) => '<option value="' + o + '"' + (o === K ? ' selected' : '') + '>' + esc(names[o]) + '</option>').join('') + '</select>';
      if (K === 'service') h += '<div class="row2">' + fld(t('svc'), inp(pre + 'Sv', 'timer.start')) + fld(t('tgt'), inp(pre + 'Tg', 'timer.balik_besleme', true)) + '</div>' + fld(t('svcData'), ta(pre + 'Data', 3, 'duration: "00:10:00"'));
      if (K === 'popup') h += fld(t('popTitle') + hb('popup'), inp(pre + 'Title', this._t('popTitle'))) + fld(t('cardY'), ta(pre + 'Card', 8, 'type: custom:...\nentity: ...'));
      if (K === 'yaml') h += fld(t('actY'), ta(pre + 'Y', 6, 'action: perform-action\nperform_action: script.turn_on'));
      return '<div class="imact">' + fld(label + hb('actions'), h) + '</div>';
    };
    let body = '';
    if (k === 'pet') {
      const sgp = (key, opts) => '<div class="seg">' + opts.map((o) => '<button data-imseg="' + key + ':' + o[0] + '"' + (f[key] === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const nts = Object.keys((this._hass.services && this._hass.services.notify) || {}).sort();
      body += fld(t('name'), inp('pName', 'Pamuk')) +
        fld(t('petKind'), sgp('pKind', Object.keys(LP_PET_KINDS).map((x) => [x, this._t('pk_' + x)]))) +
        icf('pIcon', t('icon'), LP_PET_KINDS[f.pKind] || 'mdi:paw') +
        fld(t('petSched') + hb('pet'), sgp('pMode', [['interval', this._t('pm_interval')], ['times', this._t('pm_times')]])) +
        (f.pMode === 'times' ? fld(t('petTimes'), inp('pTimes', '08:00, 20:00')) : fld(t('petEvery'), '<input class="inp" type="number" min="0.5" step="0.5" data-imf="pEvery" value="' + esc(f.pEvery) + '">')) +
        '<div class="row2">' + fld(t('petSoon'), '<input class="inp" type="number" min="0" step="5" data-imf="pSoon" value="' + esc(f.pSoon) + '">') + fld(t('petGrace'), '<input class="inp" type="number" min="0" step="5" data-imf="pGrace" value="' + esc(f.pGrace) + '">') + '</div>' +
        fld(t('petNotify'), '<select class="inp" data-imf="pNotify"><option value="">' + t('petNoNotify') + '</option>' + nts.map((x) => '<option value="notify.' + esc(x) + '"' + (f.pNotify === 'notify.' + x ? ' selected' : '') + '>notify.' + esc(x) + '</option>').join('') + '</select>') +
        (!adv ? '' : fld(t('petFeeder'), '<div class="row2">' + inp('pFeedSv', 'button.press') + inp('pFeedTg', 'button.yemlik', true) + '</div><div class="hint">' + t('petFeederT') + '</div>')) +
        '<div class="hint">' + esc(this._t('petEnt', { n: f.pName || '…' })) + '</div>';
    }
    if (k === 'card') body += '<button class="btn sm" data-ceopen><ha-icon class="s16" icon="mdi:pencil-box-outline"></ha-icon>' + t('ceEdit') + '</button>' + (!adv ? '' : fld(t('cardY') + hb('card'), ta('card', 12, 'type: markdown\ncontent: ...'))) + (!adv ? '' :
      fld(t('heightL'), '<div class="seg">' + [['', this._t('sz_auto')], ['1', this._t('h_rows', { n: 1 })], ['1.5', this._t('h_rows', { n: '1,5' })], ['2', this._t('h_rows', { n: 2 })]].map((o) => '<button data-imseg="height:' + o[0] + '"' + (f.height === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>') +
      actF('tap', t('tapL'), this._t('a_defCard'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']) + actF('hold', t('holdL'), this._t('a_defCard'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
    else if (k === 'sub') body += fld(t('subText'), inp('subtitle', 'BAĞLANTI'));
    else if (k !== 'pet') {
      body += '<div class="row2">' + fld(t('name') + (adv ? hb('tpl') : ''), inp('name', it.entity ? this._ename(it.entity) : this._t('name'))) + '</div>';
      if (k !== 'climate' && k !== 'vacuum' && k !== 'media') body += icf('icon', t('icon'), it.entity ? lpEntIcon(st) : 'mdi:lightbulb-outline');
      if (adv && k === 'value' && LP_VAL_ONOFF.indexOf(d) >= 0) body += '<div class="row2">' + icf('icon_on', t('iconOn'), 'mdi:bluetooth-connect') + icf('icon_off', t('iconOff'), 'mdi:bluetooth-off') + '</div>';
      // görünüm: eylem düğmesi karo/satır, varlık düğme/satır, sayısal değer Halo kartı
      const sg = (key, opts) => '<div class="seg">' + opts.map((o) => '<button data-imseg="' + key + ':' + o[0] + '"' + ((f[key] || '') === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const lks = k === 'scene' ? [['', 'lk_button'], ['tile', 'lk_tile'], ['row', 'lk_row']]
        : k === 'value' ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']].concat(LP_HALO_DOMAINS.indexOf(d) >= 0 ? [['halo', 'lk_halo']] : [])
          : (k === 'tile' && it.entity) ? [['', 'lk_tile'], ['button', 'lk_button'], ['row', 'lk_row']] : null;
      const lks2 = lks && !adv ? lks.filter((x) => x[0] !== 'halo' || f.look === 'halo') : lks;
      if (lks2) body += fld(t('lookL') + hb('look'), sg('look', lks2 .map((x) => [x[0], this._t(x[1])])));
      const L0 = f.look || '';
      const inGrid = (k === 'tile' || k === 'ph' || k === 'value') && !L0 || (k === 'scene' && L0 === 'tile');
      if (adv && inGrid) body += fld(t('sizeL') + hb('size'), sg('size', [['', '1×1'], ['2x1', '2×1'], ['1x2', '1×2'], ['2x2', '2×2'], ['row', this._t('sz_row')]]));
      if (adv && L0 === 'halo') body += fld(t('heightL') + hb('halo'), sg('height', [['', this._t('sz_auto')], ['1', this._t('h_rows', { n: 1 })], ['1.5', this._t('h_rows', { n: '1,5' })], ['2', this._t('h_rows', { n: 2 })]]));
      if (adv && (inGrid || k === 'scene' || L0 === 'button' || L0 === 'row' || L0 === 'halo')) {
        const so = [['', this._t('sz_auto')], ['s', this._t('sz_s')], ['m', this._t('sz_m')], ['l', this._t('sz_l')]];
        body += fld(t('icSizeL'), sg('icon_size', so)) + fld(t('txSizeL'), sg('text_size', so));
      }
      // yedek kontrol: lambanın ikinci kopyası (ör. Matter); yalnız gelişmiş modda ve ikinci kopya bulunursa
      if (adv && it.entity && LHD_TWIN_DOMAINS.indexOf(d) >= 0) {
        const cands = this._twinCands(it.entity);
        if (f.twin && cands.indexOf(f.twin) < 0) cands.unshift(f.twin);
        if (cands.length) body += fld(t('twinL') + hb('twin'), '<select class="inp" data-imf="twin"><option value="">' + t('twinNone') + '</option>' +
          cands.map((x) => '<option value="' + esc(x) + '"' + (f.twin === x ? ' selected' : '') + '>' + esc(this._ename(x)) + ' (' + esc(x) + ')</option>').join('') + '</select><div class="hint">' + t('twinT') + '</div>');
      }
      // renkler: simge rengi, açıkken renk, arka plan; sayısal değerde değere göre renk
      if (adv && (k === 'tile' || k === 'value') && it.entity) {
        const two = k === 'tile' || LP_VAL_ONOFF.indexOf(d) >= 0;
        // renk alanı: Yok, Halo renkleri (hazır), serbest renk
        const sw = (key) => Object.keys(LP_HALO_RGB).map((n) => '<button class="hsw' + ((f[key] || '').toUpperCase() === LP_HALO_RGB[n] ? ' on' : '') + '" data-imsw="' + key + ':' + LP_HALO_RGB[n] + '" style="background:' + LP_HALO_RGB[n] + '" title="' + n + '"></button>').join('');
        const cf = (key, label) => '<div class="fld clrf"><label>' + label + '</label><div class="seg"><button data-imclr="' + key + '"' + (f[key] ? '' : ' class="on"') + '>' + t('cNone') + '</button>' + sw(key) +
          '<input type="color" data-imf="' + key + '" value="' + esc(LP_HALO_RGB[f[key]] || f[key] || '#FFC24A') + '"' + (f[key] ? ' class="set"' : '') + '></div></div>';
        body += L0 === 'halo' ? fld(t('colorsL') + hb('colors'), cf('color', t('cFixed'))) : fld(t('colorsL') + hb('colors'), cf('color', t('cIcon')) + (two ? cf('color_on', t('cOn')) : '') + (L0 === 'row' || L0 === 'button' ? '' : cf('bg', t('cBg'))));
        // duruma göre renk (metin değerler de)
        body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('scL') + hb('statecol') + '</b><span>' + t('scT') + '</span></div><button class="tg' + (f.scOn ? ' on' : '') + '" data-imsc></button></div>' +
          (f.scOn ? fld(t('scE'), inp('scE', it.entity, true)) + '<div class="scrows">' + f.scRows.map((r, q) => '<div class="scr"><input class="inp" data-imsr="' + q + ':0" value="' + esc(r[0]) + '" placeholder="' + t('scState') + '">' +
            '<input type="color" data-imsr="' + q + ':1" value="' + esc(LP_HALO_RGB[r[1]] || r[1] || '#28BE64') + '"></div>').join('') + '</div><button class="btn sm" data-imscadd>+ ' + t('scAdd') + '</button>' : '') + '</div>';
        if (k === 'value' && !two && L0 !== 'halo') {
          body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('zonesL') + hb('zones') + '</b><span>' + t('zonesT') + '</span></div><button class="tg' + (f.zOn ? ' on' : '') + '" data-imzone></button></div>' +
            (f.zOn ? '<div class="zones">' + [0, 1, 2, 3, 4].map((q) => '<input type="color" data-imf="zc' + q + '" value="' + esc(f['zc' + q]) + '">' + (q < 4 ? '<input class="inp" type="number" step="any" data-imf="zt' + q + '" value="' + esc(f['zt' + q]) + '" title="' + esc(this._t('zLim', { n: q + 1 })) + '">' : '')).join('') + '</div>' : '') + '</div>';
        }
      }
      if (k === 'value') body += actF('tap', t('tapL'), this._t('a_defMore'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']) + (!adv ? '' : actF('hold', t('holdL'), this._t('a_defMore'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
      if (k === 'tile' && it.entity) body += actF('tap', t('tapL'), this._t('a_defTog'), ['def', 'more-info', 'service', 'popup', 'none', 'yaml']) + (!adv ? '' : actF('hold', t('holdL'), this._t('a_defHold'), ['def', 'more-info', 'toggle', 'service', 'popup', 'none', 'yaml']));
      // ikinci satır (gelişmiş), değer öğesinde ad/değer yer değiştirme, onay sorusu (basit modda da)
      if (adv && (k === 'tile' || k === 'value' || k === 'scene') && L0 !== 'halo') {
        const attrs = st ? Object.keys(st.attributes || {}).filter((x) => ['friendly_name', 'icon', 'entity_picture', 'supported_features', 'supported_color_modes'].indexOf(x) < 0) : [];
        const opts = [['', 'sc_none']].concat(it.entity ? [['state', 'sc_state'], ['last_changed', 'sc_lc']] : []).concat(attrs.length ? [['attr', 'sc_attr']] : []).concat([['tpl', 'sc_tpl']]);
        body += fld(t('secL') + hb('tpl'), '<select class="inp" data-imf="secK">' + opts.map((o) => '<option value="' + o[0] + '"' + (f.secK === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>').join('') + '</select>' +
          (f.secK === 'attr' ? '<select class="inp" data-imf="secAttr">' + attrs.map((x) => '<option' + (f.secAttr === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select>' : '') +
          (f.secK === 'tpl' ? inp('secTpl', "{{ states('sensor.x') }}") : ''));
        if (k === 'value' && (!L0 || L0 === 'tile')) body += '<div class="srow"><div class="t"><b>' + t('swapL') + '</b></div><button class="tg' + (f.swap ? ' on' : '') + '" data-imtg="swap"></button></div>';
      }
      if ((k === 'scene' || ((k === 'tile' || k === 'value') && it.entity)) && L0 !== 'halo') {
        body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('cfmL') + '</b><span>' + t('cfmT') + '</span></div><button class="tg' + (f.cfm ? ' on' : '') + '" data-imtg="cfm"></button></div>' +
          (f.cfm ? fld(t('cfmText'), inp('cfmText', '')) : '') + '</div>';
      }
      if (adv && k === 'scene' && !it.entity && !lpLecKind(it)) body += actF('act', t('actL'), '', ['none', 'service', 'popup', 'yaml']);
    }
    // koşullu görünürlük (gelişmiş)
    const vs = f.visE && S[f.visE] ? S[f.visE].state : null;
    if (!adv && lhdItemAdv(it)) body = '<div class="advnote"><ha-icon icon="mdi:tune-variant"></ha-icon><span>' + t('advHas') + '</span><button class="btn sm" data-advon>' + t('modeAdv') + '</button></div>' + body;
    if (adv) body += '<div class="imvis"><div class="srow"><div class="t"><b>' + t('visL') + hb('visible') + '</b><span>' + t('visT') + '</span></div><button class="tg' + (f.visOn ? ' on' : '') + '" data-imvis></button></div>' +
      (f.visOn ? '<div class="row2">' + fld(t('visE'), inp('visE', 'sensor.balik_yem_durumu', true)) +
        fld('&nbsp;', '<select class="inp" data-imf="visM">' + ['eq', 'in', 'not'].map((m) => '<option value="' + m + '"' + (f.visM === m ? ' selected' : '') + '>' + t('v_' + m) + '</option>').join('') + '</select>', 'nar') + '</div>' +
        fld(t('visV'), inp('visV', 'aktif')) + (vs !== null ? '<div class="hint">' + t('visNow', { s: vs }) + '</div>' : '') : '') + '</div>';
    const ents = Object.keys(S).sort();
    return '<div class="ov" data-ovl><div class="dlg sm imdlg"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('imT') + (it.entity ? ' · ' + esc(this._ename(it.entity)) : '') + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' + body + '</div>' +
      (M.err ? '<div class="imerr">' + esc(M.err) + '</div>' : '') +
      '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="imsave">' + t('imSave') + '</button></div></div>' +
      '<datalist id="lhdents">' + ents.map((id) => '<option value="' + esc(id) + '">').join('') + '</datalist></div>';
  }
  // taslaktan eylemi kur (hatalıysa Error); undefined: alan silinir (varsayılan davranış)
  _imAct(pre, scene) {
    const f = this._im.f, K = f[pre + 'K'] || (scene ? 'none' : 'def'), T = (k, v) => this._t(k, v);
    const y = (txt) => { try { return lhdYamlParse(txt); } catch (e) { throw new Error(e.line ? T('yamlErrL', { n: e.line }) : T('yamlErr', { e: e.message })); } };
    if (K === 'def') return undefined;
    if (K === 'none') return scene ? null : 'none';
    if (K === 'more-info' || K === 'toggle') return K;
    if (K === 'service') {
      const sv = String(f[pre + 'Sv'] || '').trim(), tg = String(f[pre + 'Tg'] || '').trim();
      if (!/^[a-z0-9_]+\.[a-z0-9_]+$/.test(sv)) throw new Error(T('svcNeed'));
      const o = { service: sv };
      if (tg) o.target = tg;
      const dt = String(f[pre + 'Data'] || '').trim();
      if (dt) { const v = y(dt); if (v && typeof v === 'object' && !Array.isArray(v)) o.data = v; else throw new Error(T('yamlErr', { e: 'data' })); }
      return o;
    }
    if (K === 'popup') {
      const c = y(f[pre + 'Card'] || '');
      if (!c || typeof c !== 'object' || !c.type) throw new Error(T('cardNoType'));
      const p = { card: c }, ti = String(f[pre + 'Title'] || '').trim();
      if (ti) p.title = ti;
      return { popup: p };
    }
    if (K === 'yaml') { const v = y(f[pre + 'Y'] || ''); if (!v) return undefined; return v; }
    return undefined;
  }
  _imSave() {
    const M = this._im; if (!M) return;
    const f = M.f, k = lhdKind(M.raw);
    let it = lhdClone(M.raw);
    const setS = (key, v) => { v = String(v || '').trim(); if (v) it[key] = v; else delete it[key]; };
    try {
      if (k === 'pet') {
        const name = String(f.pName || '').trim();
        if (!name) throw new Error(this._t('petNeedName'));
        const pets = lhdClone((STORE.data && STORE.data.pets) || {});
        let id = it.pet;
        if (!id) { const base = lhdSlug(name) || 'pet'; id = base; let q = 2; while (pets[id]) id = base + '_' + (q++); it.pet = id; }
        const num = (x, d, hi) => { const v = parseFloat(String(x).replace(',', '.')); return v >= 0 ? Math.min(v, hi || 1440) : d; };
        const P = { name: name, kind: f.pKind || 'other', mode: f.pMode === 'times' ? 'times' : 'interval', every_h: num(f.pEvery, 12, 720) || 12,
          times: String(f.pTimes || '').split(/[,;\s]+/).map((x) => x.trim()).filter((x) => /^\d{1,2}:\d{2}$/.test(x)).slice(0, 24),
          soon_min: num(f.pSoon, 60), grace_min: num(f.pGrace, 30) };
        if (String(f.pIcon || '').trim()) P.icon = String(f.pIcon).trim();
        if (f.pNotify) P.notify = f.pNotify;
        const fsv = String(f.pFeedSv || '').trim();
        if (fsv && !lhdSafeFeederSvc(fsv)) throw new Error(this._t('petFeederBad', { d: LHD_FEEDER_DOMAINS.join(', ') }));
        if (fsv) { P.feeder = { service: fsv }; if (String(f.pFeedTg || '').trim()) P.feeder.target = String(f.pFeedTg).trim(); }
        pets[id] = P;
        this._commit('pets', pets);
      }
      if (k === 'sub') { it.subtitle = String(f.subtitle || '').trim(); }
      if (k === 'card') {
        setS('height', f.height);
        ['tap', 'hold'].forEach((pre) => { const v = this._imAct(pre); if (v === undefined) delete it[pre]; else it[pre] = v; });
        let c; try { c = lhdYamlParse(f.card || ''); } catch (e) { throw new Error(e.line ? this._t('yamlErrL', { n: e.line }) : this._t('yamlErr', { e: e.message })); }
        if (!c || typeof c !== 'object' || !c.type) throw new Error(this._t('cardNoType'));
        it.card = c;
      } else if (k !== 'pet' && k !== 'sub') {
        setS('name', f.name);
        if (k !== 'climate' && k !== 'vacuum' && k !== 'media') setS('icon', f.icon);
        if (k === 'value') { setS('icon_on', f.icon_on); setS('icon_off', f.icon_off); }
        if (k === 'tile' || k === 'ph' || k === 'value' || k === 'scene') setS('size', f.size);
        if (k === 'tile' || k === 'value' || k === 'scene') {
          const sv2 = f.secK === 'attr' ? (f.secAttr ? 'attr:' + f.secAttr : '') : f.secK === 'tpl' ? String(f.secTpl || '').trim() : f.secK;
          setS('secondary', sv2);
          if (k === 'value' && f.swap) it.swap = true; else delete it.swap;
          if (f.cfm) it.confirm = String(f.cfmText || '').trim() || true; else delete it.confirm;
        }
        if (k === 'scene' || k === 'value' || (k === 'tile' && it.entity)) setS('look', f.look);
        if ((k === 'tile' || k === 'value') && it.entity) {
          setS('color', f.color); setS('color_on', f.color_on); setS('bg', f.bg);
          if (f.look === 'halo') { delete it.color_on; delete it.bg; delete it.zones; setS('height', f.height); } else delete it.height;
          const rows = f.scRows.filter((r) => String(r[0]).trim());
          if (f.scOn && rows.length) { const m = {}; rows.forEach((r) => { m[String(r[0]).trim()] = r[1]; }); it.state_colors = { map: m }; if (String(f.scE || '').trim()) it.state_colors.entity = String(f.scE).trim(); } else delete it.state_colors;
          if (k === 'value' && f.zOn) {
            const tt = [0, 1, 2, 3].map((q) => { const v = parseFloat(String(f['zt' + q]).replace(',', '.')); return isNaN(v) ? null : v; });
            it.zones = { t: tt, c: [0, 1, 2, 3, 4].map((q) => f['zc' + q]) };
          } else delete it.zones;
        }
        if (k === 'tile' || k === 'ph' || k === 'value' || k === 'scene') { setS('icon_size', f.icon_size); setS('text_size', f.text_size); }
        if (k === 'value' || (k === 'tile' && it.entity)) {
          ['tap', 'hold'].forEach((pre) => { const v = this._imAct(pre); if (v === undefined) delete it[pre]; else it[pre] = v; });
        }
        if (k === 'scene' && !it.entity && !lpLecKind(it)) it.action = this._imAct('act', true);
      }
      if (f.visOn && String(f.visE || '').trim()) {
        const vals = String(f.visV || '').split(',').map((x) => x.trim()).filter((x) => x !== '');
        const v = { entity: String(f.visE).trim() };
        if (f.visM === 'not') v.not = vals;
        else if (f.visM === 'in' || vals.length > 1) v.states = vals;
        else if (vals.length) v.state = vals[0];
        it.visible = v;
      } else delete it.visible;
    } catch (e) { M.err = e.message; this._render(); return; }
    // yedek kontrol bütün ev için tutulur (öğeye değil lambaya bağlı)
    if (it.entity && LHD_TWIN_DOMAINS.indexOf(it.entity.split('.')[0]) >= 0) {
      const T = lhdClone((STORE.data && STORE.data.twins) || {}), cur = (T[it.entity] && T[it.entity].backup) || '';
      if ((f.twin || '') !== cur) { if (f.twin) T[it.entity] = { backup: f.twin }; else delete T[it.entity]; this._commit('twins', T); }
    }
    if (it.entity && Object.keys(it).length === 1) it = it.entity;   // sade kalsın
    this._modal = null; this._im = null;
    this._edit((T) => {
      const x = T.filter((y) => y.id === M.tab)[0], S = x && (x.sections || []).filter((z) => z.id === M.sec)[0]; if (!S) return;
      S.entities = S.entities || [];
      if (M.isNew) S.entities.push(it); else if (M.idx < S.entities.length) S.entities[M.idx] = it;
    });
  }

  // ---- kart seçici (D1, D2) ve kart düzenleyici ----
  // Liste: Halo kartları (panonun gömülü kopyası), Home Assistant kartları, kurulu özel kartlar (window.customCards).
  // Seçilen kartın örnek ayarı kartın kendisinden (getStubConfig) alınır, düzenleyicisi (getConfigElement) açılır, yanında canlı önizleme.
  _cpList() {
    const L = this._lang === 'tr' ? 0 : 1, out = [];
    LHD_HALO_CARDS.forEach((x) => out.push({ g: 'halo', key: 'custom:lemur-hd-' + x[0] + '-card', name: x[L + 1], desc: x[L + 3], icon: x[5] }));
    LHD_HA_CARDS.forEach((x) => out.push({ g: 'ha', key: x[0], name: x[L + 1], icon: x[3] }));
    (window.customCards || []).forEach((c) => { if (!c || !c.type || /^lemur-hd-/.test(c.type)) return; out.push({ g: 'custom', key: 'custom:' + c.type, name: c.name || c.type, desc: c.description || '', icon: 'mdi:puzzle-outline' }); });
    return out;
  }
  _cpHtml() {
    const t = (k, v) => esc(this._t(k, v)), q = (this._cpq || '').toLowerCase();
    const L = this._cpList().filter((x) => !q || (x.name + ' ' + x.key + ' ' + (x.desc || '')).toLowerCase().indexOf(q) >= 0);
    const grp = (g, title) => { const a = L.filter((x) => x.g === g); return a.length ? '<div class="pg">' + title + '</div><div class="cpg">' + a.map((x) => '<button class="cpi" data-cpk="' + esc(x.key) + '">' + lpIcon(x.icon) + '<span><b>' + esc(x.name) + '</b>' + (x.desc ? '<i>' + esc(x.desc) + '</i>' : '') + '</span></button>').join('') + '</div>' : ''; };
    return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="mdi:card-plus-outline"></ha-icon></div><h2>' + t('cpT') + this._hb('card') + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-cpq placeholder="' + t('cpSearch') + '" value="' + esc(this._cpq || '') + '"></div>' +
      '<div class="db"><div class="cplist">' + grp('halo', t('cpHalo')) + grp('ha', t('cpHa')) + grp('custom', t('cpCustom')) + '</div></div>' +
      (this._adv() ? '<div class="df"><button class="btn" data-cpyaml><ha-icon class="s16" icon="mdi:code-braces"></ha-icon>' + t('cpYaml') + '</button></div>' : '') + '</div></div>';
  }
  // kartın sınıfı (yüklenene kadar bekler; en çok 4 sn)
  _cardClass(type) {
    const tag = type.indexOf('custom:') === 0 ? type.slice(7) : 'hui-' + type + '-card';
    const now = customElements.get(tag);
    if (now) return Promise.resolve(now);
    return lpCardHelpers().then((H) => {
      if (H && H.createCardElement && type.indexOf('custom:') !== 0) { try { H.createCardElement({ type: type }); } catch (e) {} }
      return Promise.race([customElements.whenDefined(tag).then(() => customElements.get(tag)), new Promise((r) => setTimeout(() => r(null), 4000))]);
    });
  }
  _cpPick(type) {
    const ents = Object.keys(this._hass.states);
    this._cardClass(type).then((C) => {
      let p = Promise.resolve({});
      try { if (C && C.getStubConfig) p = Promise.resolve(C.getStubConfig(this._hass, ents, ents)); } catch (e) {}
      return p.catch(() => ({}));
    }).then((stub) => {
      const cfg = Object.assign({ type: type }, stub || {}, { type: type });
      this._ceOpen(cfg, null);
    });
  }
  _ceOpen(cfg, im) {
    this._ce = { cfg: lhdClone(cfg), im: im, view: 'visual', ed: null, edFor: null, noEd: false, yaml: lhdYamlDump(cfg), err: '' };
    if (im) { this._imKeep = im; }
    this._modal = 'cardedit'; this._render();
  }
  _ceHtml() {
    const C = this._ce; if (!C) return '';
    const t = (k) => esc(this._t(k)), vis = C.view === 'visual' && !C.noEd;
    return '<div class="ov" data-ovl><div class="dlg cedlg"><div class="dh"><div class="di"><ha-icon icon="mdi:pencil-box-outline"></ha-icon></div><h2>' + t('ceT') + ' · ' + esc(C.cfg.type) + '</h2>' +
      '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
      '<div class="cebody"><div class="cel"><div class="seg">' + [['visual', 'ceVisual'], ['yaml', 'ceYaml']].map((x) => '<button data-cev="' + x[0] + '"' + ((vis ? 'visual' : 'yaml') === x[0] ? ' class="on"' : '') + (x[0] === 'visual' && C.noEd ? ' disabled' : '') + '>' + t(x[1]) + '</button>').join('') + '</div>' +
      (C.noEd ? '<div class="hint">' + t('ceNoEd') + '</div>' : '') +
      (vis ? '<div class="ceed" data-ceed><div class="hint">' + t('ceLoad') + '</div></div>' : '<textarea class="inp ta" data-ceyaml rows="16" spellcheck="false">' + esc(C.yaml) + '</textarea>') +
      (C.err ? '<div class="imerr" style="margin:8px 0 0">' + esc(C.err) + '</div>' : '') + '</div>' +
      '<div class="cer"><div class="lbl">' + t('cePv') + '</div><div class="cepv" data-cepv></div></div></div>' +
      '<div class="df"><button class="btn" data-ceback>' + t('ceBack') + '</button><span class="grow"></span><button class="btn pri" data-cesave>' + t('imSave') + '</button></div></div></div>';
  }
  // render sonrası: düzenleyici ve önizleme öğeleri (yeniden çizimde kaybolmasınlar diye saklanır, yerine takılır)
  _ceMount() {
    const C = this._ce; if (!C || this._modal !== 'cardedit') return;
    const R = this.shadowRoot, slot = R.querySelector('[data-ceed]'), pv = R.querySelector('[data-cepv]');
    if (pv) {
      if (!C.pvHost) { C.pvHost = document.createElement('div'); C.pvHost.className = 'cepvh'; this._cePreview(); }
      pv.appendChild(C.pvHost);
    }
    if (!slot) return;
    if (C.ed && C.edFor === C.cfg.type) { slot.innerHTML = ''; slot.appendChild(C.ed); try { C.ed.hass = this._hass; } catch (e) {} return; }
    const type = C.cfg.type;
    const tag = type.indexOf('custom:') === 0 ? type.slice(7) : 'hui-' + type + '-card';
    this._cardClass(type).then((K) => (K && K.getConfigElement ? Promise.resolve(K.getConfigElement()) : null)).then((ed) => {
      if (this._ce !== C) return;
      // kartın verdiği düzenleyici tanımsızsa (ör. gömülü Halo kopyası) kartın adıyla kayıtlı düzenleyici
      if ((!ed || typeof ed.setConfig !== 'function') && customElements.get(tag + '-editor')) ed = document.createElement(tag + '-editor');
      if (ed && typeof ed.setConfig !== 'function') ed = null;
      if (!ed) { C.noEd = true; C.view = 'yaml'; return this._render(); }
      C.ed = ed; C.edFor = type;
      try { ed.hass = this._hass; ed.lovelace = { config: { views: [] }, editMode: true }; } catch (e) {}
      try { ed.setConfig(lhdClone(C.cfg)); } catch (e) { C.noEd = true; C.view = 'yaml'; return this._render(); }
      ed.addEventListener('config-changed', (ev) => {
        ev.stopPropagation();
        const c = ev.detail && ev.detail.config; if (!c) return;
        C.cfg = lhdClone(c); C.yaml = lhdYamlDump(C.cfg); C.err = '';
        clearTimeout(C.pvT); C.pvT = setTimeout(() => this._cePreview(), 250);
      });
      const s2 = this.shadowRoot && this.shadowRoot.querySelector('[data-ceed]');
      if (s2) { s2.innerHTML = ''; s2.appendChild(ed); }
    }).catch(() => { C.noEd = true; C.view = 'yaml'; this._render(); });
  }
  _cePreview() {
    const C = this._ce; if (!C || !C.pvHost) return;
    lpMountCard(C.pvHost, lhdClone(C.cfg), () => this._hass, this._lang, (el) => { C.pvEl = el; });
  }
  _ceSetView(v) {
    const C = this._ce;
    if (v === 'visual' && C.view === 'yaml') {
      try { const c = lhdYamlParse(C.yaml); if (!c || !c.type) throw new Error(this._t('cardNoType')); C.cfg = c; if (C.ed) { try { C.ed.setConfig(lhdClone(c)); } catch (e) {} } C.err = ''; }
      catch (e) { C.err = e.line ? this._t('yamlErrL', { n: e.line }) : e.message; return this._render(); }
      this._cePreview();
    }
    if (v === 'yaml') C.yaml = lhdYamlDump(C.cfg);
    C.view = v; this._render();
  }
  _ceSave() {
    const C = this._ce;
    if (C.view === 'yaml') {
      try { const c = lhdYamlParse(C.yaml); if (!c || !c.type) throw new Error(this._t('cardNoType')); C.cfg = c; }
      catch (e) { C.err = e.line ? this._t('yamlErrL', { n: e.line }) : e.message; return this._render(); }
    }
    const cfg = C.cfg, im = C.im;
    this._ce = null;
    if (im) { im.f.card = lhdYamlDump(cfg); this._im = im; this._modal = 'item'; return this._render(); }   // öğe ayarlarına dön (Kaydet orada)
    this._modal = null;
    const tab = this._curTab(this._work()), sec = this._curSec(tab); if (!tab || !sec) return this._render();
    const tid = tab.id, sid = sec.id;
    this._edit((T) => { const x = T.filter((y) => y.id === tid)[0], S = x && (x.sections || []).filter((z) => z.id === sid)[0]; if (S) { S.entities = S.entities || []; S.entities.push({ card: cfg }); } });
  }

  // iklim cihazı eklenirken aynı alandaki harici sıcaklık/nem sensörü önerilir (otomatik düzendeki kural)
  _climateItem(id) { return lpClimateItem(this._hass, id); }
}

// Bazı eklentiler sayfa açılırken window.customElements'i kendi kopyasıyla değiştiriyor (scoped registry polyfill).
// Biz ondan önce yüklenirsek tanımımız yeni kopyada görünmez; HA pano stratejisini bulamaz ("Timeout waiting for strategy element").
// Bu yüzden ilk 30 sn boyunca kayıt defterine bakıp eksikse yeniden kaydediyoruz (aynı sınıf; tarayıcının asıl kaydı zaten bizde).
const LP_DEFS = [['ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy], ['lemur-home-dashboard-card', LemurHomeDashboardCard], ['lemur-home-dashboard-admin', LemurHomeDashboardAdmin]];
const lpDefineAll = () => LP_DEFS.forEach((d) => { try { if (!window.customElements.get(d[0])) window.customElements.define(d[0], d[1]); } catch (e) {} });
window.__LEMUR_HD_VER = PANEL_VERSION;
lpDefineAll();
let lpTries = 0;
const lpTimer = setInterval(() => { lpDefineAll(); if (++lpTries > 300) clearInterval(lpTimer); }, 100);
window.addEventListener('location-changed', lpDefineAll);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
