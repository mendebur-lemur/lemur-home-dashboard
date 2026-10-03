/*! Lemur Halo Cards (gömülü kopya) v0.2.0 | MIT | https://github.com/mendebur-lemur/lemur-halo-cards */
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
/*! Lemur Home Dashboard v0.0.8 | MIT */
(() => {
if (customElements.get('lemur-home-dashboard-card')) return;
const PANEL_VERSION = '0.0.8';
const CSS = ":host { display: block; color: var(--lp-text); font-family: var(--primary-font-family, Roboto, Noto, sans-serif);\n--lp-text: #FFFFFF; --lp-text2: #D3D3D3;\n--lp-card: rgba(10, 10, 10, 0.4);\n--lp-box-bg: rgba(20, 24, 31, 0.55); --lp-box-border: rgba(255, 255, 255, 0.08);\n--lp-sel: rgba(91, 141, 239, 0.9);\n--lp-on-border: rgb(255, 214, 10); --lp-on-icon: #FFC107; --lp-na: #555555;\n--lp-embed-bg: rgb(28, 28, 28); }\n.wrap { display: grid; grid-template-rows: auto minmax(0, 1fr); grid-gap: 12px; padding: 4px 4px 25px 4px; box-sizing: border-box;\nheight: var(--lp-h, auto); min-height: var(--lp-h, calc(100vh - var(--header-height, 56px)));\n-webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }\n.nav { grid-area: h; display: flex; align-items: center; min-width: 0; margin: 4px 4px 8px 4px; }\n.navb { flex: 0 1 235px; min-width: 0; height: 155px; box-sizing: border-box; border-radius: 15px; background: var(--lp-card);\nborder: 0 none; opacity: 0.85; padding: 9.4px 0; display: flex; flex-direction: column; align-items: center; cursor: pointer;\noverflow: hidden; transition: all 0.3s ease-out; color: var(--lp-text); }\n.navb + .navb { margin-left: 8px; }\n.navb.sel { opacity: 1; border: 2px solid var(--lp-sel); }\n.ni { flex: 1 1 auto; width: 40%; min-height: 0; display: flex; align-items: center; justify-content: center; }\n.ni ha-icon { display: block; width: 100%; --mdc-icon-size: 100%; }\n.nn { font-size: 16.8px; line-height: 20px; max-width: 100%; padding: 0 6px; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.clock { flex: 1 0 150px; margin-left: 8px; text-align: center; font-size: 32px; line-height: 40px; font-weight: 700; font-variant-numeric: tabular-nums; }\n.col { display: flex; flex-direction: column; min-width: 0; min-height: 0; margin: 4px; }\n.col > .subs { display: grid; grid-gap: 12px; flex: 1 1 auto; min-height: 0; }\n.sub { display: flex; flex-direction: column; min-width: 0; min-height: 0; }\n.sub > .box + .box { margin-top: 12px; }\n.box { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; min-width: 0; overflow: hidden; box-sizing: border-box; padding: 20px;\nbackground: var(--lp-box-bg); border: 1px solid var(--lp-box-border); border-radius: 22px; }\n.box > * + * { margin-top: 8px; }\n.box.spread { justify-content: space-between; }\n.box.empty { align-items: center; justify-content: center; color: var(--lp-text2); font-size: 18px; text-align: center; padding: 40px; }\n.title { flex: 0 0 auto; text-align: center; font-size: 18px; line-height: 22px; font-weight: 700; padding: 19px 16px 20px; min-width: 0; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; }\n.title.hd { padding: 10px 0 14px; display: flex; align-items: center; justify-content: center; letter-spacing: 0.01em; }\n.title.hd ha-icon { display: block; width: 20px; height: 20px; --mdc-icon-size: 20px; margin-right: 8px; }\n.title.season { cursor: pointer; }\n.grid { display: grid; grid-gap: 8px; flex: 1 1 auto; min-height: 0; }\n.tile { box-sizing: border-box; min-width: 0; min-height: 0; border-radius: 20px; background-color: var(--lp-card); border: 0 solid transparent;\ncolor: var(--lp-text); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4% 0;\ncursor: pointer; overflow: hidden; text-align: center; transition: all 0.2s ease-out; }\n.tile ha-state-icon { display: block; width: 40%; --mdc-icon-size: 100%; color: var(--lp-text); }\n.tile .nm { margin-top: 8px; font-size: 16px; line-height: 19.2px; max-width: 100%; padding: 0 4px; box-sizing: border-box;\noverflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }\n.tile.on { border: 2px solid var(--tile-rgb, var(--lp-on-border)); background-color: rgba(255, 255, 255, 0.05); }\n.tile.on ha-state-icon { color: var(--tile-rgb, var(--lp-on-icon)); }\n.tile.fx { border-width: 2px; border-style: solid; background-color: rgba(255, 255, 255, 0.05); }\n.tile.na ha-state-icon { color: var(--lp-na); }\n.scene { flex: 0 1 118px; height: auto; min-height: 48px; box-sizing: border-box; border-radius: 22px; background: var(--lp-card); color: var(--lp-text);\ndisplay: -webkit-box; display: flex; align-items: center; cursor: pointer; overflow: hidden; transition: all 0.2s ease-out; }\n.scene .si { flex: 0 0 40%; display: flex; justify-content: center; }\n.scene ha-icon { display: block; width: 40px; --mdc-icon-size: 40px; }\n.scene span { flex: 1 1 auto; min-width: 0; padding-left: 6px; font-size: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.emb { --ha-card-background: var(--lp-embed-bg); --card-background-color: var(--lp-embed-bg); --ha-card-border-radius: 20px;\n--ha-card-border-width: 0; --ha-card-border-color: transparent; --ha-card-box-shadow: none;\n--primary-text-color: var(--lp-text); --secondary-text-color: var(--lp-text2); }\n.row { display: flex; align-items: center; padding: 16px; border-radius: 20px; background: var(--lp-embed-bg); cursor: pointer; --mdc-icon-size: 36px; }\n.row ha-state-icon { flex: 0 0 auto; color: var(--lp-text); margin-right: 14px; }\n.row.on ha-state-icon { color: var(--lp-on-icon); }\n.rt { min-width: 0; }\n.rn { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.rs { font-size: 14px; color: var(--lp-text2); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.down { -webkit-transform: scale(0.96); transform: scale(0.96); }\n.wrap.edit { position: relative; touch-action: none; }\n.edit .box { cursor: pointer; transition: box-shadow 0.15s; position: relative; }\n.bgrip { position: absolute; left: 4px; top: 4px; width: 28px; height: 28px; border-radius: 9px; background: rgba(242, 169, 59, 0.16); color: #F2A93B;\ndisplay: flex; align-items: center; justify-content: center; cursor: grab; z-index: 3; --mdc-icon-size: 18px; }\n.bgrip:hover { background: rgba(242, 169, 59, 0.3); }\n.bgrip ha-icon { pointer-events: none; }\n.edit .box:hover { box-shadow: 0 0 0 2px rgba(242, 169, 59, 0.35); }\n.edit .box.selbox { box-shadow: 0 0 0 3px #F2A93B; }\n.edit .tile, .edit .scene, .edit .row, .edit .emb { cursor: grab; }\n.edit .tile > *, .edit .scene > *, .edit .row > *, .edit .emb > *, .edit .title.season { pointer-events: none; }\n.edit .navb { cursor: pointer; }\n.edit .dragging { opacity: 0.35; }\n.edit .dropl { box-shadow: -6px 0 0 -2px #F2A93B !important; }\n.edit .dropr { box-shadow: 6px 0 0 -2px #F2A93B !important; }\n.edit .dropt { box-shadow: 0 -6px 0 -2px #F2A93B !important; }\n.edit .dropd { box-shadow: 0 6px 0 -2px #F2A93B !important; }\n.edit .dropin { box-shadow: 0 0 0 3px #F2A93B !important; }\n.colh { position: absolute; width: 14px; cursor: col-resize; z-index: 5; }\n.colh::after { content: ''; position: absolute; left: 5px; top: 10%; bottom: 10%; width: 4px; border-radius: 2px; background: transparent; transition: background 0.15s; }\n.wrap.edit:hover .colh::after { background: rgba(242, 169, 59, 0.3); }\n.colh:hover::after, .colh:active::after { background: #F2A93B !important; }\n.rowh { position: absolute; height: 14px; cursor: row-resize; z-index: 5; }\n.rowh::after { content: ''; position: absolute; top: 5px; left: 15%; right: 15%; height: 4px; border-radius: 2px; background: transparent; transition: background 0.15s; }\n.wrap.edit:hover .rowh::after { background: rgba(242, 169, 59, 0.3); }\n.rowh:hover::after, .rowh:active::after { background: #F2A93B !important; }\n.dropline { position: absolute; height: 4px; border-radius: 2px; background: #F2A93B; z-index: 6; pointer-events: none; box-shadow: 0 0 12px rgba(242, 169, 59, 0.6); }\n.eph { flex: 1 1 auto; min-height: 90px; display: flex; align-items: center; justify-content: center; text-align: center; color: var(--lp-text2);\nborder: 2px dashed rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 16px; font-size: 15px; }\n.box.colempty { align-items: center; justify-content: center; text-align: center; color: var(--lp-text2); background: transparent;\nborder: 2px dashed rgba(242, 169, 59, 0.35); font-size: 15px; padding: 20px; cursor: default; }\n.addsec { margin-top: 14px; padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(242, 169, 59, 0.5); background: rgba(242, 169, 59, 0.12);\ncolor: #F2A93B; font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer; }\n.addsec:hover { background: rgba(242, 169, 59, 0.22); }\n.gsq { position: relative; flex: 0 0 auto; height: 0; }\n.gsq > .grid { position: absolute; left: 0; top: 0; right: 0; bottom: 0; }\n.tile.ph { cursor: default; }\n.tile.ph ha-icon { display: block; width: 40%; --mdc-icon-size: 100%; color: var(--lp-text); }\n.edit .box.over { box-shadow: 0 0 0 2px #e5484d; }\n.edit .box.over::after { content: attr(data-over); position: absolute; left: 50%; bottom: 6px; transform: translateX(-50%); padding: 4px 12px; border-radius: 12px; max-width: 90%; box-sizing: border-box; text-align: center;\nbackground: #e5484d; color: #fff; font-size: 18px; line-height: 22px; font-weight: 700; pointer-events: none; z-index: 3; }\n.scene.lec.on { box-shadow: inset 0 0 0 2px var(--sc), 0 0 18px -8px var(--sc); background-color: rgba(255, 255, 255, 0.05); }\n.scene.lec.na { opacity: 0.45; }";
const ADMIN_CSS = ":host { display: block; height: 100vh; height: 100dvh; font-family: var(--lemur-font, Archivo, var(--ha-font-family-body, system-ui), sans-serif); }\n* { box-sizing: border-box; }\nbutton, input, select { font-family: inherit; color: inherit; font-size: inherit; }\nbutton { cursor: pointer; }\nha-icon { --mdc-icon-size: 100%; display: inline-flex; width: 20px; height: 20px; flex: none; }\n.s14 { width: 14px; height: 14px; } .s16 { width: 16px; height: 16px; } .s18 { width: 18px; height: 18px; } .s24 { width: 24px; height: 24px; }\n.app { position: relative; height: 100%; display: flex; flex-direction: column; gap: 12px; padding: 0 16px 16px; background: #0B0C0E; color: #ECEDEE;\noverflow: hidden; font-size: 14px; line-height: 1.4;\n--bg: #0B0C0E; --s1: #131417; --s2: #18191D; --s3: #1F2125; --s4: #272A2F; --s5: #30333A;\n--ln: rgba(255,255,255,.06); --ln2: rgba(255,255,255,.10); --ln3: rgba(255,255,255,.18);\n--tx: #ECEDEE; --tx2: #B3B7BE; --mu: #7C818A; --mu2: #5A5E66;\n--ac: #F2A93B; --acs: rgba(242,169,59,.13); --acl: rgba(242,169,59,.55); --actx: #1B1206;\n--red: #EE6A5F; --reds: rgba(238,106,95,.12); --tint: #261C10;\n--r1: 22px; --r2: 14px; --r3: 10px; }\n.grow { flex: 1; }\n.mu { color: var(--mu); }\n.top { display: flex; align-items: center; gap: 10px; min-height: 60px; flex: none; }\n.lg { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(140deg, #F4B24A, #E2702C); display: grid; place-items: center; color: var(--actx); flex: none; }\n.lg ha-icon { width: 18px; height: 18px; }\n.top h1 { font-size: 16px; font-weight: 600; margin: 0 6px 0 2px; letter-spacing: -.01em; white-space: nowrap; }\n.badge { font-size: 12px; font-weight: 500; padding: 3px 10px; border-radius: 99px; background: var(--acs); color: var(--ac); border: 1px solid var(--acl); white-space: nowrap; }\n.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 34px; padding: 0 12px; border-radius: var(--r3);\nborder: 1px solid var(--ln2); background: var(--s2); font-size: 13px; font-weight: 500; color: var(--tx); white-space: nowrap; }\n.btn:hover { background: var(--s3); }\n.btn:disabled { opacity: .35; cursor: default; }\n.btn.ic { width: 34px; padding: 0; }\n.btn.pri { background: var(--ac); color: var(--actx); border-color: var(--ac); }\n.btn.pri:hover { filter: brightness(1.06); }\n.btn.dan { color: var(--red); }\n.btn.dan.ask { background: var(--reds); border-color: rgba(238,106,95,.45); }\n.btn.sm { height: 30px; font-size: 12.5px; padding: 0 10px; }\n.btn.dash { border-style: dashed; background: none; color: var(--tx2); }\n.btn.dash:hover { color: var(--tx); background: var(--s2); }\n.warn { background: var(--reds); border: 1px solid rgba(238,106,95,.35); color: #F3B0A9; padding: 10px 14px; border-radius: var(--r2); font-size: 13px; flex: none; }\n.rblock { flex: none; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); padding: 10px; }\n.rooms { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 1px; margin-bottom: -1px; position: relative; z-index: 2; align-items: flex-start; scrollbar-width: none; }\n.rooms::-webkit-scrollbar { display: none; }\n.rb { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 130px; padding: 14px 18px; border-radius: var(--r2); background: var(--s2);\nborder: 1px solid transparent; font-weight: 600; font-size: 16px; line-height: 1.2; white-space: nowrap; color: var(--tx2); cursor: pointer; flex: none; user-select: none; touch-action: none; }\n.rb ha-icon { width: 24px; height: 24px; }\n.rb:hover { background: var(--s3); color: var(--tx); }\n.rb.on { background: var(--tint); color: var(--ac); border: 1px solid var(--acl); border-bottom-color: var(--tint); border-radius: var(--r2) var(--r2) 0 0;\npadding-bottom: 24px; margin-bottom: -1px; }\n.rb.add { background: none; border: 1px dashed var(--ln2); color: var(--mu); font-weight: 500; min-width: 0; }\n.rb.add:hover { color: var(--tx); }\n.rpanel { position: relative; z-index: 1; background: var(--tint); border: 1px solid var(--acl); border-radius: var(--r2); padding: 12px; display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: flex-end; }\n.rpanel.first { border-top-left-radius: 0; }\n.fld { display: flex; flex-direction: column; gap: 6px; min-width: 0; }\n.fld > label, .lbl { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); }\n.inp { flex-shrink: 0; height: 36px; border-radius: var(--r3); border: 1px solid var(--ln2); background: var(--s2); padding: 0 11px; color: var(--tx); outline: none; min-width: 0; width: 100%; }\n.inp:focus { border-color: var(--acl); background: var(--s3); }\nselect.inp { padding-right: 6px; }\n.iconin { display: flex; align-items: center; gap: 8px; }\n.iconin .pv { width: 36px; height: 36px; border-radius: var(--r3); background: var(--s3); display: grid; place-items: center; flex: none; }\n.iconin .pv ha-icon { width: 20px; height: 20px; }\n.seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 11px; background: var(--s2); border: 1px solid var(--ln2); flex-wrap: wrap; }\n.seg button { height: 30px; padding: 0 12px; border: none; border-radius: 8px; background: none; color: var(--tx2); font-weight: 500; font-size: 13px; white-space: nowrap; }\n.seg button:hover { color: var(--tx); }\n.seg button.on { background: var(--s4); color: var(--tx); box-shadow: 0 1px 2px rgba(0,0,0,.35); }\n.tg { width: 42px; height: 24px; border-radius: 99px; border: none; background: var(--s5); position: relative; flex: none; padding: 0; transition: background .15s; }\n.tg::after { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left .15s; }\n.tg.on { background: var(--ac); }\n.tg.on::after { left: 21px; }\n.main { flex: 1; display: flex; gap: 12px; min-height: 0; }\n.pvw { flex: 1 1 auto; min-width: 0; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); padding: 12px; display: flex; flex-direction: column; gap: 10px; }\n.pvh { display: flex; align-items: center; gap: 8px; color: var(--tx2); font-size: 13px; }\n.pvh b { color: var(--tx); font-weight: 600; }\n.pvh .seg button { height: 26px; padding: 0 10px; font-size: 12px; }\n.pvbox { position: relative; flex: 1; min-height: 200px; overflow: hidden; border-radius: 14px; background: #08090b; }\n.pvc { position: absolute; left: 0; top: 0; transform-origin: 0 0; border-radius: 0; overflow: hidden; }\n.ins { flex: 0 0 420px; min-width: 0; background: var(--s1); border: 1px solid var(--ln); border-radius: var(--r1); display: flex; flex-direction: column; min-height: 0; }\n.ins .sc { overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 14px; min-height: 0; flex: 1; scrollbar-width: thin; }\n.ins h3 { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); display: flex; align-items: center; gap: 8px; }\n.narrowv .main { flex-direction: column; overflow-y: auto; }\n.narrowv .pvw { flex: none; height: 46vh; }\n.narrowv .ins { flex: none; }\n.sl { display: flex; flex-direction: column; gap: 6px; }\n.si { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 12px; background: var(--s2); border: 1px solid transparent; cursor: pointer; user-select: none; }\n.si:hover { background: var(--s3); }\n.si.on { background: var(--tint); border-color: var(--acl); }\n.si .ti { width: 30px; height: 30px; border-radius: 9px; background: var(--s4); display: grid; place-items: center; flex: none; color: var(--tx2); }\n.si.on .ti { background: var(--acs); color: var(--ac); }\n.si .ti ha-icon { width: 18px; height: 18px; }\n.si .nm { flex: 1; min-width: 0; }\n.si .nm b { display: block; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.si .nm span { font-size: 12px; color: var(--mu); }\n.cb { font-size: 11.5px; font-weight: 600; padding: 2px 8px; border-radius: 99px; background: var(--s4); color: var(--tx2); flex: none; }\n.hd { color: var(--mu2); cursor: grab; display: grid; place-items: center; width: 18px; flex: none; touch-action: none; }\n.hd:hover { color: var(--tx2); }\n.dragging { opacity: .45; }\n.dropb { box-shadow: 0 -2px 0 var(--ac); }\n.dropa { box-shadow: 0 2px 0 var(--ac); }\n.rooms .dropb { box-shadow: -3px 0 0 var(--ac); }\n.rooms .dropa { box-shadow: 3px 0 0 var(--ac); }\n.ed { display: flex; flex-direction: column; gap: 12px; padding: 12px; border-radius: 16px; background: var(--s2); border: 1px solid var(--ln); }\n.row2 { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }\n.row2 > .fld { flex: 1 1 140px; }\n.items { display: flex; flex-direction: column; gap: 6px; }\n.it { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 11px; background: var(--s3); }\n.it .ico { width: 30px; height: 30px; border-radius: 9px; background: var(--s4); display: grid; place-items: center; flex: none; }\n.it .ico ha-icon, .it .ico ha-state-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }\n.it .col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }\n.it .inp { height: 30px; font-size: 13px; padding: 0 8px; }\n.it .eid { font-size: 11.5px; color: var(--mu); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.it .x { width: 28px; height: 28px; border: none; background: none; color: var(--mu); border-radius: 8px; display: grid; place-items: center; flex: none; }\n.it .x:hover { background: var(--s4); color: var(--red); }\n.it input[type=color] { width: 30px; height: 30px; border: none; border-radius: 9px; padding: 0; background: none; flex: none; cursor: pointer; }\n.it input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }\n.it input[type=color]::-webkit-color-swatch { border: none; border-radius: 9px; }\n.it .sub { display: flex; gap: 6px; }\n.it .sub select { flex: 1; min-width: 0; height: 28px; font-size: 12px; }\n.it.ph { opacity: .75; }\n.acts { display: flex; gap: 8px; flex-wrap: wrap; }\n.empty { padding: 14px; border-radius: 12px; border: 1px dashed var(--ln2); color: var(--mu); font-size: 13px; text-align: center; }\n.hint { font-size: 12.5px; color: var(--mu); }\n.menu { position: absolute; z-index: 30; min-width: 220px; background: var(--s2); border: 1px solid var(--ln2); border-radius: 14px; padding: 6px; box-shadow: 0 18px 40px rgba(0,0,0,.5); }\n.menu button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: none; background: none; border-radius: 9px; text-align: left; color: var(--tx); }\n.menu button:hover { background: var(--s3); }\n.menu button.dan { color: var(--red); }\n.menu hr { border: none; border-top: 1px solid var(--ln); margin: 6px 4px; }\n.menu .mh { font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); padding: 6px 10px 4px; }\n.ov { position: absolute; left: 0; top: 0; right: 0; bottom: 0; z-index: 40; background: rgba(0,0,0,.55); display: flex; align-items: center; justify-content: center; padding: 24px; }\n.dlg { width: min(900px, 100%); max-height: 100%; background: #111215; border: 1px solid var(--ln2); border-radius: 22px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.6); }\n.dlg.sm { width: min(560px, 100%); }\n.dh { display: flex; align-items: center; gap: 12px; padding: 18px 20px 12px; }\n.dh .di { width: 38px; height: 38px; border-radius: 50%; background: var(--s3); display: grid; place-items: center; color: var(--ac); flex: none; }\n.dh h2 { margin: 0; font-size: 18px; font-weight: 600; flex: 1; }\n.db { padding: 4px 20px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; min-height: 0; }\n.df { display: flex; gap: 10px; justify-content: flex-end; padding: 12px 20px 18px; border-top: 1px solid var(--ln); align-items: center; }\n.sh { font-size: 11.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--mu); margin: 10px 4px 0; }\n.srow { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 16px; background: var(--s1); border: 1px solid var(--ln); }\n.srow .t { flex: 1; min-width: 0; }\n.srow .t b { display: block; font-weight: 600; }\n.srow .t span { font-size: 12.5px; color: var(--mu); }\n.srow .inp { width: 120px; }\n.srow .inp.w { width: 260px; }\n.plist { display: flex; flex-direction: column; gap: 4px; }\n.pg { font-size: 11.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--mu); margin: 10px 4px 2px; }\n.pi { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 12px; background: var(--s1); border: 1px solid transparent; cursor: pointer; user-select: none; }\n.pi:hover { background: var(--s2); }\n.pi.on { border-color: var(--acl); background: var(--tint); }\n.pi.dis { opacity: .45; cursor: default; }\n.pi .ck { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--ln3); display: grid; place-items: center; flex: none; color: var(--actx); }\n.pi.on .ck { background: var(--ac); border-color: var(--ac); }\n.pi .ico { width: 30px; height: 30px; border-radius: 9px; background: var(--s3); display: grid; place-items: center; flex: none; }\n.pi .ico ha-state-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }\n.pi .t { flex: 1; min-width: 0; }\n.pi .t b { display: block; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.pi .t span { font-size: 12px; color: var(--mu); }\n.pi .st { font-size: 12px; color: var(--tx2); flex: none; }\n.toast { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%) translateY(20px); opacity: 0; pointer-events: none; z-index: 50;\ndisplay: flex; align-items: center; gap: 14px; padding: 10px 12px 10px 16px; border-radius: 14px; background: #24262B; border: 1px solid var(--ln2);\nbox-shadow: 0 14px 30px rgba(0,0,0,.45); transition: all .2s; font-size: 13.5px; }\n.toast.show { opacity: 1; transform: translateX(-50%); pointer-events: auto; }\n.toast button { border: none; background: var(--s4); color: var(--ac); font-weight: 600; padding: 6px 10px; border-radius: 9px; }\n.toast button[hidden] { display: none; }\n.lecna { color: #F3B0A9; font-weight: 600; }";
// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', room_lights: '{area} IŞIKLARI', scenes: 'SENARYOLAR', shortcuts: 'KISAYOLLAR',
    control: 'EV KONTROL', other_control: 'DİĞER CİHAZLAR', media: 'MEDYA',
    empty: 'Bu sekmede gösterilecek cihaz yok. Yönetim panelinden ekleyebilirsin.',
    edit_empty: 'Boş bölüm · sağdan "Cihaz ekle" ya da başka bölümden bir öğeyi buraya sürükle', col_empty: 'Boş sütun · bir kutuyu ⠿ tutamağından tutup buraya sürükle ya da', add_section: 'Bölüm ekle', effects: 'Efektler', too_full: 'Ekrana sığmıyor', drag_box: 'Kutuyu taşımak için tut ve sürükle',
    heat: 'Isıtıyor', cool: 'Soğutuyor', idle: 'Beklemede', off: 'Kapalı', on: 'Açık', playing: 'Çalıyor', paused: 'Duraklatıldı', unavailable: 'Ulaşılamıyor',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', room_lights: '{area} LIGHTS', scenes: 'SCENES', shortcuts: 'SHORTCUTS',
    control: 'CONTROLS', other_control: 'OTHER DEVICES', media: 'MEDIA',
    empty: 'Nothing to show on this tab yet. Add devices from the admin panel.',
    edit_empty: 'Empty section · use "Add device" on the right or drag an item here from another section', col_empty: 'Empty sub-column · drag a box here by its ⠿ handle, or', add_section: 'Add section', effects: 'Effects', too_full: "Doesn't fit the screen", drag_box: 'Hold and drag to move the box',
    heat: 'Heating', cool: 'Cooling', idle: 'Idle', off: 'Off', on: 'On', playing: 'Playing', paused: 'Paused', unavailable: 'Unavailable',
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
      this.conn.subscribeMessage((msg) => { if (this.pending) return; this.data = msg; this.subs.forEach((f) => f(msg)); }, { type: 'lemur_home_dashboard/subscribe' });
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
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});

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
// - Lemur Light Effect Card kuruluysa senaryoların sonuna "Efektler" düğmesi eklenir (efekt ekranı, sekmenin odasıyla).
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
  // Lemur Light Effect Card kuruluysa her sekmenin senaryolarının sonunda "Efektler": LEC'in efekt ekranını sekmenin odasıyla açar
  const lecBtn = () => ((hass.config && (hass.config.components || []).indexOf('lemur_light_effects') >= 0)
    ? [{ name: t(lang, 'effects'), icon: 'mdi:creation', color: '#FF6FAE', action: { service: 'lemur_light_effects.open' } }] : []);

  const tab = (o) => {
    colorIdx = 0;   // her sekmede renkler baştan: aynı sıradaki düğme aynı renkte
    const secs = [
      { id: o.id + '-l', type: 'lights', title: o.lightTitle, col: 0, entities: o.lights, tile_columns: 5 },
      { id: o.id + '-s', type: 'scenes', title: o.sceneTitle, col: 1, items: o.scenes.map(sceneItem).concat(lecBtn()) },
      { id: o.id + '-c', type: 'climate', title: o.controlTitle, col: 2, entities: o.controls.map(climateItem) },
      { id: o.id + '-v', type: 'vacuum', col: 2, entities: o.vacuums || [] },
      { id: o.id + '-m', type: 'media', col: 2, entities: o.medias }
    ];
    return { id: o.id, name: o.name, icon: o.icon, area: o.area || null, columns: [56, 17, 25.5], sections: secs };
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
    // kiosk: yan menü home-assistant-main içinde, üst bar hui-root içinde
    const k = kiosk || {};
    style(m, KID, active && k.hide_sidebar ? 'ha-sidebar{display:none !important}ha-drawer{--mdc-drawer-width:0px !important}' : '');
    if (!sr) return;
    style(sr, KID, active && k.hide_header ? '.header,.toolbar,app-header,ha-app-layout>[slot=header]{display:none !important}#view,hui-view-container{padding-top:0 !important;min-height:100vh !important}' : '');
    if (!active) { style(sr, ID, ''); return; }
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

// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Görünüm referans tablet panosuyla birebir (ölçüler base.css'te).
// Çizim iki aşamalı: iskelet sekme ya da ayar değişince bir kez kurulur (_build), durum değişince sadece karolar güncellenir (_update).
// Böylece gömülü kartların (iklim, süpürge) halesi ve karoların efekt animasyonu her durum değişiminde baştan başlamaz.
// Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
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
    '.tile.fx-' + p.k + '{border-color:' + p.c[0] + ';animation:lpfx-' + p.k + ' ' + p.d + 's linear infinite}' +
    '.tile.fx-' + p.k + ' ha-state-icon{animation:lpfxi-' + p.k + ' ' + p.d + 's linear infinite}';
}).join('');

// Mevsim: ayarda yoksa aya göre (Mayıs-Eylül yaz). Kış'ta petek, Yaz'da klima kartları.
function lpSeason() {
  const d = STORE.data, s = d && d.settings && d.settings.season;
  if (s === 'summer' || s === 'winter') return s;
  const m = new Date().getMonth() + 1;
  return m >= 5 && m <= 9 ? 'summer' : 'winter';
}

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; this._sig = null; if (this._hass) this._render(); }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) { LEC.load(h); STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    LemurLightPopup.update(h);
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
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    if (this._hass) this._render();
  }
  disconnectedCallback() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    clearInterval(this._clock); this._clock = null;
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
    const present = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => { const e = lpEnt(x); if (e && S[e.entity]) present.push(e.entity); }));
    const sig = JSON.stringify([tab, season, lang, present, tabs.map((x) => [x.id, x.name, x.icon]), lpHas('lemur-hd-climate-card'), LEC.installed(h), !!this._config.edit, this._config.selected || '']);
    if (sig !== this._sig) { this._sig = sig; this._build(tab, tabs, lang, season); }
    this._update();
  }

  // --- iskelet ---
  _build(tab, tabs, lang, season) {
    const h = this._hass, S = h.states;
    const tiles = [], tileItems = [], rows = [], embeds = [];
    const lecRooms = {};   // bu sekmede LEC'ten oynayan efekti sorulacak odalar
    // ayarda olup şu an HA'da olmayan cihazlar: gelince (ör. HA yeniden başladıktan sonra) pano yeniden kurulur
    this._missing = [];
    (tab.sections || []).forEach((s) => (s.entities || []).forEach((x) => { const e = lpEnt(x); if (e && !S[e.entity]) this._missing.push(e.entity); }));
    const edit = !!this._config.edit, selected = this._config.selected || '';
    let curSec = '';
    // her öğe hangi bölümün kaçıncı öğesi: düzenleme modunda sürükle-bırak için
    const mark = (i) => ' data-sec="' + esc(curSec) + '" data-idx="' + i + '"';
    const emb = (tag, cfg, id, i) => {
      if (!lpHas(tag)) { rows.push(id); return '<div class="row" data-row="' + esc(id) + '"' + mark(i) + '></div>'; }
      embeds.push({ tag: tag, cfg: Object.assign({ language: lang }, cfg) });
      return '<div class="emb" data-emb="' + (embeds.length - 1) + '"' + mark(i) + '></div>';
    };
    const withIdx = (arr, norm) => (arr || []).map((x, i) => { const e = norm(x); return e ? Object.assign({ _i: i }, e) : null; }).filter(Boolean);
    const bodyOf = (s) => {
      if (s.type === 'lights') {
        // karo: "light.x" ya da { entity, name, icon }; cihazı olmayan { name, icon } boş yuva olarak çizilir (tablet panosundaki gibi)
        const items = withIdx(s.entities, lpItem).filter((e) => !e.entity || S[e.entity]);
        if (!items.some((e) => e.entity)) return null;
        // Tablet panosundaki gibi: 4 ve daha çok satırda satırlar kutuyu doldurur; daha azında karolar kare kalır, altı boş kalır.
        // Kare için padding yüzdesi kullanılıyor (genişliğe göre); aspect-ratio eski Safari'de yok.
        // Karo sayısı ayardaki kadar, ama sütun daraldıysa karolar 70 px'ten küçülmesin diye azalır (kanvas en az W piksel geniş)
        const cw = ((STORE.data && STORE.data.settings && STORE.data.settings.canvas) || {}).width || 1280;
        const sumW = widths.reduce((a, b) => a + b, 0), ci = Math.max(0, Math.min(widths.length - 1, s.col || 0));
        const inner = (cw - 8 - 20 * widths.length) * widths[ci] / sumW / splits[ci] - 12 - 40;
        const c = Math.max(1, Math.min(s.tile_columns || 5, Math.floor((inner + 8) / 78))), r = Math.ceil(items.length / c), fill = r >= 4;
        const gs = 'grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + r + ',' + (fill ? 'minmax(84px,1fr)' : '1fr') + ')';
        const open = fill ? '<div class="grid" data-sec="' + esc(s.id) + '" style="' + gs + '">'
          : '<div class="gsq" data-sec="' + esc(s.id) + '" style="padding-bottom:calc((100% - ' + (8 * (c - 1)) + 'px) / ' + c + ' * ' + r + ' + ' + (8 * (r - 1)) + 'px)"><div class="grid" style="' + gs + '">';
        return { kind: 'md', html: open +
          items.map((it) => {
            if (!it.entity) return '<div class="tile ph"' + mark(it._i) + '><ha-icon icon="' + esc(it.icon || 'mdi:lightbulb') + '"></ha-icon><div class="nm">' + esc(it.name || '') + '</div></div>';
            tiles.push(it.entity); tileItems.push(it);
            return '<div class="tile" data-light="' + esc(it.entity) + '" data-ti="' + (tileItems.length - 1) + '"' + mark(it._i) + '><ha-state-icon></ha-state-icon><div class="nm"></div></div>';
          }).join('') + (fill ? '</div>' : '</div></div>') };
      }
      if (s.type === 'scenes') {
        // LEC düğmeleri: LEC kurulu değilse panoda görünmez (düzenlemede soluk görünür)
        const lecOn = LEC.installed(h);
        const items = (s.items || []).map((it, i) => ({ it: it, i: i, k: lpLecKind(it) })).filter((x) => x.it && (!x.k || lecOn || edit));
        if (!items.length) return null;
        return { kind: 'md', spread: true, html: items.map((x) => {
          const it = x.it, c = it.color || '#5B8DEF';
          let lec = '';
          if (x.k) {
            const room = x.k === 'open' ? (it.action.room || tab.area || '') : ((it.action.data && it.action.data.room) || '');
            if (room) lecRooms[room] = 1;
            lec = ' data-lk="' + esc(x.k) + '" data-lroom="' + esc(room) + '" data-lfx="' + esc((it.action.data && it.action.data.effect) || '') + '"';
          }
          return '<div class="scene' + (x.k ? ' lec' + (lecOn ? '' : ' na') : '') + '" style="--sc:' + esc(c) + '" data-scene="' + esc(s.id) + ':' + x.i + '"' + lec + mark(x.i) + '><div class="si"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(c) + '"></ha-icon></div><span>' + esc(it.name) + '</span></div>';
        }).join('') };
      }
      if (s.type === 'climate') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        const isAC = (x) => (x.kind ? x.kind === 'ac' : (S[x.entity].attributes.hvac_modes || []).indexOf('cool') >= 0);
        const ac = items.filter(isAC), rad = items.filter((x) => !isAC(x));
        const both = ac.length > 0 && rad.length > 0;
        const list = both ? (season === 'winter' ? rad : ac) : items;
        return { kind: 'hd', spread: true, season: both, html: list.map((x) => { const c = Object.assign({ type: 'custom:lemur-hd-climate-card' }, x); delete c._i; return emb('lemur-hd-climate-card', c, x.entity, x._i); }).join('') };
      }
      if (s.type === 'vacuum') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        return { kind: 'hd', spread: true, html: items.map((x) => { const c = Object.assign({ type: 'custom:lemur-hd-vacuum-card' }, x); delete c._i; return emb('lemur-hd-vacuum-card', c, x.entity, x._i); }).join('') };
      }
      if (s.type === 'media') {
        const items = withIdx(s.entities, lpEnt).filter((e) => S[e.entity]);
        if (!items.length) return null;
        return { kind: 'hd', spread: true, html: items.map((x) => { rows.push(x.entity); return '<div class="row" data-row="' + esc(x.entity) + '"' + mark(x._i) + '></div>'; }).join('') };
      }
      return null;
    };

    // kolonlara dağıt; başlıksız bölüm aynı kolondaki önceki kutunun içine girer (ör. iklimin altında süpürge)
    // içi boş bölümün başlığı, aynı kolonda arkasından gelen başlıksız bölüme geçer.
    // Düzenleme modunda boş bölüm de bir kutu olarak görünür (içine sürüklenebilsin diye).
    // Yerleşim: kolonlar (genişlik oranı) ve her kolonun içinde 1-3 eşit sütun (tab.splits). Bölümün yeri: col + sub.
    const widths = lpWeights(tab), splits = lpSplits(tab, widths.length);
    const cols = widths.map((w, i) => { const a = []; for (let j = 0; j < splits[i]; j++) a.push([]); return a; });
    const pend = {};
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0)), sj = Math.max(0, Math.min(splits[ci] - 1, s.sub || 0)), key = ci + ':' + sj;
      curSec = s.id;
      let b = bodyOf(s);
      if (!b && edit) b = { kind: s.type === 'lights' || s.type === 'scenes' ? 'md' : 'hd', html: '<div class="eph" data-sec="' + esc(s.id) + '">' + esc(t(lang, 'edit_empty')) + '</div>' };
      if (!b) { if (s.title) pend[key] = s; return; }
      const boxes = cols[ci][sj];
      if (!s.title && !pend[key] && boxes.length) { const last = boxes[boxes.length - 1]; last.html += b.html; last.spread = last.spread || b.spread; last.secs.push(s.id); return; }
      const head = s.title ? s : pend[key];
      pend[key] = null;
      boxes.push({ title: head ? head.title : (s.type === 'media' ? t(lang, 'media') : ''), kind: b.kind, season: !!b.season && head === s, spread: b.spread, html: b.html,
        secs: head && head !== s ? [head.id, s.id] : [s.id], grow: (head || s).grow || 1 });
    });
    const used = [];
    cols.forEach((c, i) => { if (edit || c.some((x) => x.length)) used.push(i); });   // düzenlemede boş kolon da görünür

    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><div class="ni"><ha-icon icon="' + esc(x.icon || 'mdi:home-outline') + '"></ha-icon></div><div class="nn">' + esc(x.name) + '</div></div>').join('') +
      '<div class="clock">' + this._time() + '</div></div>';
    const seasonIcon = season === 'winter' ? '<ha-icon icon="mdi:snowflake" style="color:#7cc8ff"></ha-icon>' : '<ha-icon icon="mdi:white-balance-sunny" style="color:#ffc23d"></ha-icon>';
    // aynı sütunda birden çok kutu varsa yükseklikler "grow" oranında paylaşılır (düzenlemede aradaki çizgi sürüklenerek değişir)
    const boxHtml = (b, multi) => '<div class="box' + (b.spread ? ' spread' : '') + (edit && b.secs.indexOf(selected) >= 0 ? ' selbox' : '') + '" data-secs="' + esc(b.secs.join(',')) + '"' +
      (multi ? ' style="flex:' + b.grow + ' 1 0px;min-height:auto"' : '') + '>' +
      (edit ? '<div class="bgrip" title="' + esc(t(lang, 'drag_box')) + '"><ha-icon icon="mdi:drag"></ha-icon></div>' : '') +
      (b.title ? '<div class="title ' + b.kind + (b.season ? ' season" data-season="1">' + seasonIcon : '">') + '<span>' + esc(b.title) + '</span></div>' : '') +
      b.html + '</div>';   // spread: başlık da dahil hepsi kutuya eşit aralıkla dağılır (tablet panosundaki justify-content: space-between)
    const subHtml = (i, j, boxes) => '<div class="sub" data-col="' + i + '" data-sub="' + j + '">' +
      (boxes.length ? boxes.map((b) => boxHtml(b, boxes.length > 1)).join('')
        : '<div class="box colempty"><span>' + esc(t(lang, 'col_empty')) + '</span><button class="addsec" data-addsec="' + i + ':' + j + '">+ ' + esc(t(lang, 'add_section')) + '</button></div>') + '</div>';
    let grid, body;
    if (used.length) {
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
    R.innerHTML = '<style>' + CSS + LP_FX_CSS + '</style><div class="wrap' + (edit ? ' edit' : '') + '" style="' + grid + '">' + nav + body + '</div>';

    // gömülü kartlar
    this._embeds = [];
    R.querySelectorAll('[data-emb]').forEach((ph) => {
      const spec = embeds[+ph.getAttribute('data-emb')];
      const el = document.createElement(spec.tag);
      try { el.setConfig(spec.cfg); } catch (e) { ph.textContent = String((e && e.message) || e); return; }
      el.hass = h;
      ph.appendChild(el);
      this._embeds.push(el);
    });
    this._tiles = []; R.querySelectorAll('[data-light]').forEach((el) => { el._item = tileItems[+el.getAttribute('data-ti')]; this._tiles.push(el); });
    this._rows = []; R.querySelectorAll('[data-row]').forEach((el) => this._rows.push(el));
    // LEC: karoların odaları da sorulur; efekt düğmesi olan odaların ışıkları izlenir (değişince oynayan efekt yeniden sorulur)
    tiles.forEach((id) => { const r = LEC.roomOf(id); if (r) lecRooms[r] = 1; });
    this._lecRooms = Object.keys(lecRooms).filter((r) => LEC.hasRoom(r));
    const lecLights = [];
    this._lecRooms.forEach((r) => LEC.lightsOf(r).forEach((id) => { if (tiles.indexOf(id) < 0 && lecLights.indexOf(id) < 0) lecLights.push(id); }));
    this._watched = tiles.concat(rows, lecLights);
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
      lpPress(b, () => this._hass.callService('homeassistant', 'toggle', { entity_id: id }), hold);
    });
    this._rows.forEach((b) => lpPress(b, () => more(b.getAttribute('data-row'))));
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => {
      const p = b.getAttribute('data-scene').split(':');
      const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      const it = s && s.items && s.items[+p[1]];
      if (!it || !it.action || !it.action.service) return;
      const lk = lpLecKind(it);
      if (lk === 'open') { LEC.open(this._hass, it.action.room || tab.area); return; }
      if (lk) { LEC.run(this._hass, it.action); return; }
      const sv = it.action.service.split('.');
      this._hass.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }));
    R.querySelectorAll('[data-season]').forEach((b) => lpPress(b, () => STORE.season(lpSeason() === 'winter' ? 'summer' : 'winter')));
  }

  // --- düzenleme modu: tıkla seç, sürükle taşı, çizgiden boyutlandır ---
  // Kart değişikliği kendisi kaydetmez; yeni sekme ayarını 'lhd-change' ile yönetim paneline verir, panel kaydeder.
  _editBind(R, tab, widths, used) {
    const wrap = R.querySelector('.wrap');
    const clone = () => JSON.parse(JSON.stringify(tab));
    const emit = (nt) => lpFire(this, 'lhd-change', { tab: nt });
    const zoom = () => { const r = this.getBoundingClientRect(); return (r.width && this.offsetWidth) ? r.width / this.offsetWidth : 1; };
    const secById = (T, id) => (T.sections || []).filter((x) => x.id === id)[0];
    const listOf = (s) => (s.type === 'scenes' ? (s.items = s.items || []) : (s.entities = s.entities || []));
    const typeOf = (id) => { const s = secById(tab, id); return s ? s.type : ''; };
    const r2 = (x) => Math.round(x * 100) / 100;
    const arr = (x) => Array.prototype.slice.call(x);
    R.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => lpFire(this, 'lhd-tab', { tab: b.getAttribute('data-nav') })));

    let D = null;   // süren sürükleme
    // boyutlandırma tutamakları: kolonların arasında dikey, aynı kolonda üst üste duran kutuların arasında yatay
    const place = () => {
      if (!wrap.isConnected || D) return;
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
          const r = it.getBoundingClientRect(), horiz = it.classList.contains('tile');
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

  // --- durum güncellemesi (iskelete dokunmadan) ---
  _update() {
    const h = this._hass, S = h.states, lang = this._lang;
    // LEC odalarındaki bir ışık değiştiyse o odada oynayan efekti yeniden sor
    if (this._lecRooms && this._lecRooms.length && !this._config.edit) {
      const seen = {};
      (this._watched || []).forEach((id) => { if (this._last[id] && S[id] !== this._last[id]) { const r = LEC.roomOf(id); if (r && !seen[r] && this._lecRooms.indexOf(r) >= 0) { seen[r] = 1; LEC.watch(h, r); } } });
    }
    (this._tiles || []).forEach((el) => {
      const id = el.getAttribute('data-light'), st = S[id];
      if (!st || this._last[id] === st) return;
      const a = st.attributes, it = el._item || {}, on = LP_ON.indexOf(st.state) >= 0;
      // efekt: ışığın kendi efekti; yoksa LEC'in o odada oynattığı efekt (yanan ışıklarda)
      const fx = lpFx(st) || (st.state === 'on' ? lpFxByName(LEC.playing[LEC.roomOf(id)]) : null);
      el.className = 'tile' + (on ? ' on' : '') + (st.state === 'unavailable' || st.state === 'unknown' ? ' na' : '') + (fx ? ' fx fx-' + fx.k : '');
      const rgb = on && !fx && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
      if (rgb) el.style.setProperty('--tile-rgb', rgb); else el.style.removeProperty('--tile-rgb');
      const ic = el.firstChild;
      ic.hass = h; ic.stateObj = st;
      if (it.icon) { ic.icon = it.icon; ic.setAttribute('icon', it.icon); }
      // HA'nın kendi karosundaki gibi: renkli lambanın simgesi parlaklığa göre hafif koyulaşır
      ic.style.filter = on && !fx && typeof a.brightness === 'number' ? 'brightness(' + Math.round((a.brightness + 245) / 5) + '%)' : '';
      el.lastChild.textContent = it.name || a.friendly_name || id;
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
      el.innerHTML = '<ha-state-icon></ha-state-icon><div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div>';
      const ic = el.firstChild; ic.hass = h; ic.stateObj = st;
    });
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
  set hass(h) { this._h = h; if (!this._closed && !this._dragging) this._sync(); }
  _t(k, v) { let s = (LP_POP_TXT[this._lang] || LP_POP_TXT.en)[k] || k; if (v) Object.keys(v).forEach((x) => { s = s.replace('{' + x + '}', v[x]); }); return s; }

  // aynı cihazın segment ışıkları (ör. light.lantern_floor_lamp_s_segment_001..004)
  _segments() {
    const ents = this._h.entities || {}, e = ents[this._id], dv = e && e.device_id;
    if (!dv) return [];
    return Object.keys(this._h.states).filter((x) => x !== this._id && x.indexOf('light.') === 0 && /_segment_?\d+$/.test(x) && ents[x] && ents[x].device_id === dv).sort();
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
    const icon = it.icon ? '<ha-icon icon="' + esc(it.icon) + '"></ha-icon>' : '<ha-state-icon></ha-state-icon>';
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
      }, () => { this._dragging = false; sl.classList.remove('drag'); send(); });
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
      }, () => { this._dragging = false; setTimeout(send, 120); });
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
  _sync() {
    const R = this._pan, S = this._h.states;
    if (!R) return;
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
    secTitle: 'Başlık', column: 'Kolon', colL: 'Sol', colM: 'Orta', colR: 'Sağ', tileCols: 'Satırdaki karo', delSec: 'Bölümü sil',
    t_lights: 'Işıklar', t_scenes: 'Senaryolar', t_climate: 'İklim', t_vacuum: 'Süpürge', t_media: 'Medya',
    d_lights: 'Işık, priz, perde karoları', d_scenes: 'Script, sahne ve otomasyon düğmeleri', d_climate: 'Klima ve petek kartları (Yaz/Kış)', d_vacuum: 'Robot süpürge kartları', d_media: 'TV ve hoparlörler',
    n_items: '{n} öğe', addDev: 'Cihaz ekle', addPh: 'Boş yuva', addScene: 'Düğme ekle', name: 'Ad', target: 'Çalıştırılacak', noItems: 'Henüz öğe yok.',
    tSensor: 'Sıcaklık sensörü', hSensor: 'Nem sensörü', fromDevice: 'Cihazdan', noOutdoor: 'Dış sıcaklık yok', noLink: 'Birlikte kontrol yok', linkT: 'Birlikte kontrol edilen cihaz (ör. aynı odadaki ikinci petek)', outdoorT: 'Dış sıcaklık sensörü (petek kartı ısıtma ihtiyacını gösterir)', addScPh: 'Boş düğme', kind: 'Tür', k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Geniş 16:9', scr_here: 'Bu ekran',
    pickT: 'Cihaz ekle', search: 'Ara: ad, alan ya da varlık kimliği', cancel: 'Vazgeç', addN: 'Ekle ({n})', added: 'Ekli', noArea2: 'Alanı olmayanlar', nothing: 'Eşleşen cihaz yok.',
    s_board: 'Pano', s_look: 'Görünüm', s_screen: 'Ekran', s_info: 'Bilgi',
    lang: 'Dil', lAuto: 'Otomatik', season: 'Mevsim', seasonT: 'İklim bölümünde Yaz klimaları, Kış petekleri gösterir. Otomatik: Mayıs-Eylül yaz.', sAuto: 'Otomatik', sSum: 'Yaz', sWin: 'Kış',
    bg: 'Arka plan', bgT: 'Koyu: tablet panosundaki zemin. Resim için adres yaz (ör. /local/zemin.jpg).', bgDark: 'Koyu', bgImg: 'Resim', bgUrl: 'Resim adresi',
    theme: 'HA teması', themeT: 'Boş bırakılabilir; açılır pencereler bu temayla gelir.', kHeader: 'Üst barı gizle', kHeaderT: 'Bu panoda HA\'nın başlık çubuğu görünmez.',
    kSide: 'Yan menüyü gizle', kSideT: 'Bu panoda HA\'nın sol menüsü görünmez.', canvas: 'Kanvas', canvasT: 'Tasarım genişliği ve referans yüksekliği (px). Pano ekrana bu oranla ölçeklenir.',
    version: 'Sürüm', lec: 'Lemur Light Effect Card', lecOn: 'Kurulu ({v}). Senaryolara efekt ekranı ve efekt düğmeleri eklenebilir.', lecOff: 'Kurulu değil. Işık efektleri için isteğe bağlı olarak kurulabilir; kurulunca efekt düğmeleri burada açılır.', hold: 'Işığa basılı tutunca', holdT: 'Işık karosuna basılı tutunca açılan pencere', hPop: 'Işık penceresi', hHa: 'HA penceresi', hLec: 'Efekt ekranı', lecOpen: 'Efekt ekranı', lecStop: 'Efekti durdur', lecGroup: 'Işık efektleri · {r}', lecLoading: 'Efektler yükleniyor…', tOpen: 'Efekt ekranı · {r}', tPlay: 'Efekt: {e} · {r}', tStop: 'Efekti durdur · {r}', roomByTab: 'sekmenin odası', lecNa: 'Lemur Light Effect Card kurulu değil: bu düğme panoda görünmez',
    resetAll: 'Otomatik düzene dön', resetQ: 'Bütün sekme ve bölümler silinir, pano yeniden evin alanlarından kurulur. Ayarlar kalır.', resetOk: 'Otomatik düzene dönüldü',
    close: 'Kapat', notLoaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.', editNote: 'Not: Bu panoda HA\'nın kendi düzenleyicisinde "kontrolü al" dersen pano bu panelden kopar.'
  },
  en: {
    title: 'Lemur Home Dashboard', auto: 'Automatic layout', autoT: 'The dashboard is currently built from your areas. Your first change saves this layout, then everything is edited here.',
    undo: 'Undo', undoK: 'Undo (Ctrl+Z)', settings: 'Settings', more: 'More', saved: 'Saved', undone: 'Undone', err: 'Could not save: {e}',
    tabName: 'Tab name', icon: 'Icon', area: 'Area', noArea: 'No area', cols: 'Columns', colAdd: 'Add column', colDel: 'Remove last column', colTab: 'Tablet layout', colEq: 'Equal', colHint: 'Set widths by dragging the line between columns in the preview.', delTab: 'Delete tab', sure: 'Sure?',
    refill: 'Refill from area', refillT: 'Rebuilds this tab\'s sections from the devices of the chosen area.', addTab: 'Tab', newTab: 'New tab', emptyTab: 'Empty tab', fromArea: 'Tab from area',
    preview: 'Preview', pvHint: 'Drag boxes by their ⠿ handle, items by themselves · drag lines to resize', splits: 'Columns inside', splitsT: 'Splits a column into 2-3 equal sub-columns (e.g. two scene sections side by side).', splitNarrow: 'This many sub-columns will not fit: use fewer columns first', sub: 'Sub-column', sections: 'Sections', addSec: 'Add section', noSec: 'This tab has no sections.',
    secTitle: 'Title', column: 'Column', colL: 'Left', colM: 'Middle', colR: 'Right', tileCols: 'Tiles per row', delSec: 'Delete section',
    t_lights: 'Lights', t_scenes: 'Scenes', t_climate: 'Climate', t_vacuum: 'Vacuum', t_media: 'Media',
    d_lights: 'Light, plug and cover tiles', d_scenes: 'Script, scene and automation buttons', d_climate: 'Air conditioner and radiator cards (summer/winter)', d_vacuum: 'Robot vacuum cards', d_media: 'TVs and speakers',
    n_items: '{n} items', addDev: 'Add device', addPh: 'Empty slot', addScene: 'Add button', name: 'Name', target: 'Runs', noItems: 'No items yet.',
    tSensor: 'Temperature sensor', hSensor: 'Humidity sensor', fromDevice: 'From device', noOutdoor: 'No outdoor temperature', noLink: 'No linked device', linkT: 'Device controlled together (e.g. a second radiator in the same room)', outdoorT: 'Outdoor temperature sensor (radiator card shows heating demand)', addScPh: 'Empty button', kind: 'Type', k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Wide 16:9', scr_here: 'This screen',
    pickT: 'Add device', search: 'Search: name, area or entity id', cancel: 'Cancel', addN: 'Add ({n})', added: 'Added', noArea2: 'No area', nothing: 'No matching device.',
    s_board: 'Dashboard', s_look: 'Appearance', s_screen: 'Screen', s_info: 'About',
    lang: 'Language', lAuto: 'Automatic', season: 'Season', seasonT: 'The climate section shows air conditioners in summer, radiators in winter. Automatic: May-September is summer.', sAuto: 'Automatic', sSum: 'Summer', sWin: 'Winter',
    bg: 'Background', bgT: 'Dark: the background of the tablet dashboard. For an image, enter its address (e.g. /local/background.jpg).', bgDark: 'Dark', bgImg: 'Image', bgUrl: 'Image address',
    theme: 'HA theme', themeT: 'Optional; dialogs open with this theme.', kHeader: 'Hide the top bar', kHeaderT: 'Home Assistant\'s header is hidden on this dashboard.',
    kSide: 'Hide the sidebar', kSideT: 'Home Assistant\'s sidebar is hidden on this dashboard.', canvas: 'Canvas', canvasT: 'Design width and reference height (px). The dashboard scales to the screen with this ratio.',
    version: 'Version', lec: 'Lemur Light Effect Card', lecOn: 'Installed ({v}). Effect screen and effect buttons can be added to scene sections.', lecOff: 'Not installed. Optional, for light effects; effect buttons turn on here once it is installed.', hold: 'Holding a light', holdT: 'What opens when you hold a light tile', hPop: 'Light window', hHa: 'HA dialog', hLec: 'Effect screen', lecOpen: 'Effect screen', lecStop: 'Stop effect', lecGroup: 'Light effects · {r}', lecLoading: 'Loading effects…', tOpen: 'Effect screen · {r}', tPlay: 'Effect: {e} · {r}', tStop: 'Stop effect · {r}', roomByTab: 'the tab\'s room', lecNa: 'Lemur Light Effect Card is not installed: this button is hidden on the dashboard',
    resetAll: 'Back to automatic layout', resetQ: 'Every tab and section is deleted and the dashboard is rebuilt from your areas. Settings stay.', resetOk: 'Back to automatic layout',
    close: 'Close', notLoaded: 'The Lemur Home Dashboard integration is not loaded.', editNote: 'Note: if you "take control" of this dashboard in Home Assistant\'s own editor, it disconnects from this panel.'
  }
};
const LHD_TYPES = {
  lights: { icon: 'mdi:lightbulb-group-outline', domains: ['light', 'switch', 'cover', 'fan', 'input_boolean'], col: 0 },
  scenes: { icon: 'mdi:gesture-tap-button', domains: ['script', 'scene', 'automation'], col: 1 },
  climate: { icon: 'mdi:thermostat', domains: ['climate'], col: 2 },
  vacuum: { icon: 'mdi:robot-vacuum', domains: ['vacuum'], col: 2 },
  media: { icon: 'mdi:television', domains: ['media_player'], col: 2 }
};
// Önizleme ekranları: pano gerçekte ekranın oranına göre ölçeklenir (scale.js); önizleme seçilen ekranı aynı hesapla taklit eder.
const LHD_SCREENS = [['tab16', 1600, 1000], ['tab43', 1024, 768], ['wide', 1920, 1080], ['here', 0, 0]];
const LHD_MAXCOLS = 6;
const LHD_COLORS = ['#5B8DEF', '#8E7CFF', '#4FD1C5', '#FF6FAE', '#6BC46B', '#E5484D', '#F2B33D', '#FFB86B'];
const lhdClone = (x) => JSON.parse(JSON.stringify(x));
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
    if (this._hass && STORE.data) { this._sub(); this._render(); }
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._key);
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
  _work() { const d = STORE.data; return lhdClone(d && d.tabs && d.tabs.length ? d.tabs : buildDefaultTabs(this._hass, this._lang)); }
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
    const R = this.shadowRoot;
    if (!STORE.data) { R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app"><div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + esc(this._t('title')) + '</h1></div><div class="warn">' + esc(this._t('notLoaded')) + '</div></div>'; return; }
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab);
    const t = (k, v) => esc(this._t(k, v));
    const narrow = (this.clientWidth || window.innerWidth) < 980;
    this._narrowNow = narrow;

    const top = '<div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + t('title') + '</h1>' +
      (this._isAuto() ? '<span class="badge" title="' + t('autoT') + '">' + t('auto') + '</span>' : '') + '<div class="grow"></div>' +
      '<button class="btn ic" data-a="undo" title="' + t('undoK') + '"' + (this._undo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:undo"></ha-icon></button>' +
      '<button class="btn" data-a="settings"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon>' + t('settings') + '</button>' +
      '<button class="btn ic" data-a="more" title="' + t('more') + '"><ha-icon class="s16" icon="mdi:dots-horizontal"></ha-icon></button></div>';

    const rooms = '<div class="rooms" data-dl="tabs" data-dir="x">' + tabs.map((x) => '<div class="rb' + (x.id === this._tab ? ' on' : '') + '" data-di data-tab="' + esc(x.id) + '" data-handle><ha-icon icon="' + esc(x.icon || 'mdi:door') + '"></ha-icon>' + esc(x.name) + '</div>').join('') +
      '<div class="rb add" data-a="addtab"><ha-icon class="s18" icon="mdi:plus"></ha-icon>' + t('addTab') + '</div></div>';
    const areaOpts = '<option value="">' + t('noArea') + '</option>' + Object.keys(this._hass.areas || {}).map((a) => '<option value="' + esc(a) + '"' + (tab && tab.area === a ? ' selected' : '') + '>' + esc(this._area(a)) + '</option>').join('');
    const W = tab ? lpWeights(tab) : LP_DEFAULT_COLS, wsum = W.reduce((a, b) => a + b, 0), SP = lpSplits(tab, W.length);
    const rpanel = tab ? '<div class="rpanel' + (tabs[0] && tabs[0].id === tab.id ? ' first' : '') + '">' +
      '<div class="fld" style="flex:1 1 180px"><label>' + t('tabName') + '</label><input class="inp" data-f="tab.name" value="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('icon') + '</label><div class="iconin"><div class="pv"><ha-icon icon="' + esc(tab.icon || 'mdi:door') + '"></ha-icon></div><input class="inp" data-f="tab.icon" value="' + esc(tab.icon || '') + '" placeholder="mdi:sofa-outline"></div></div>' +
      '<div class="fld" style="flex:1 1 160px"><label>' + t('area') + '</label><select class="inp" data-f="tab.area">' + areaOpts + '</select></div>' +
      '<div class="fld"><label title="' + t('colHint') + '">' + t('cols') + ' · ' + W.map((x) => Math.round(x / wsum * 100)).join(' / ') + '</label><div class="acts">' +
        '<button class="btn sm ic" data-a="coldel" title="' + t('colDel') + '"' + (W.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:minus"></ha-icon></button>' +
        '<span class="btn sm" style="pointer-events:none;min-width:38px">' + W.length + '</span>' +
        '<button class="btn sm ic" data-a="coladd" title="' + t('colAdd') + '"' + (W.length >= LHD_MAXCOLS ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon></button>' +
        (W.length === 3 ? '<button class="btn sm" data-a="coltab">' + t('colTab') + '</button>' : '') + '<button class="btn sm" data-a="coleq">' + t('colEq') + '</button></div></div>' +
      '<div class="fld"><label title="' + t('splitsT') + '">' + t('splits') + '</label><div class="acts">' + SP.map((v, i) => '<div class="seg"><button disabled style="opacity:.6">' + esc(this._colName(i, W.length)) + '</button>' + [1, 2, 3].map((n) => '<button data-split="' + i + ':' + n + '"' + (v === n ? ' class="on"' : (!lhdCanSplit(tab, i, n, this._cw()) ? ' disabled title="' + esc(t('splitNarrow')) + '"' : '')) + '>' + n + '</button>').join('') + '</div>').join('') + '</div></div>' +
      (tab.area ? '<button class="btn sm" data-a="refill" title="' + t('refillT') + '"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('refill') + '</button>' : '') +
      '<button class="btn sm dan' + (this._ask === 'deltab' ? ' ask' : '') + '" data-a="deltab"' + (tabs.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'deltab' ? t('sure') : t('delTab')) + '</button></div>' : '';

    const ncols = W.length;
    const colName = (s) => this._colName(Math.min(s.col || 0, ncols - 1), ncols) + (SP[Math.min(s.col || 0, ncols - 1)] > 1 ? ' · ' + (Math.min(s.sub || 0, SP[Math.min(s.col || 0, ncols - 1)] - 1) + 1) : '');
    const count = (s) => (s.type === 'scenes' ? (s.items || []).length : (s.entities || []).length);
    const secList = tab && (tab.sections || []).length ? '<div class="sl" data-dl="secs">' + tab.sections.map((s) => '<div class="si' + (s.id === this._sec ? ' on' : '') + '" data-di data-sec="' + esc(s.id) + '">' +
      '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span><div class="ti"><ha-icon icon="' + esc((LHD_TYPES[s.type] || {}).icon || 'mdi:shape') + '"></ha-icon></div>' +
      '<div class="nm"><b>' + esc(s.title || this._t('t_' + s.type)) + '</b><span>' + t('t_' + s.type) + ' · ' + t('n_items', { n: count(s) }) + '</span></div><span class="cb">' + colName(s) + '</span></div>').join('') + '</div>'
      : '<div class="empty">' + t('noSec') + '</div>';

    const ins = '<div class="ins"><div class="sc">' +
      '<h3>' + t('sections') + '<span class="grow"></span><button class="btn sm" data-a="addsec"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addSec') + '</button></h3>' + secList +
      (sec ? this._secEditor(tab, sec, ncols) : '') +
      (this._isAuto() ? '<div class="hint">' + t('autoT') + '</div>' : '') + '<div class="hint">' + t('editNote') + '</div></div></div>';

    const scr = this._screenKey();
    const pv = '<div class="pvw"><div class="pvh"><ha-icon class="s16" icon="mdi:eye-outline"></ha-icon><b>' + t('preview') + '</b><span>· ' + t('pvHint') + '</span><span class="grow"></span>' +
      '<div class="seg">' + LHD_SCREENS.map((x) => '<button data-scr="' + x[0] + '"' + (x[0] === scr ? ' class="on"' : '') + '>' + t('scr_' + x[0]) + '</button>').join('') + '</div></div><div class="pvbox"><div class="pvc"></div></div></div>';

    // yeniden çizimde odaktaki alan ve imleç korunur
    const act = R.activeElement, keyOf = (el) => { if (!el || !el.getAttribute) return null; const n = ['data-f', 'data-if', 'data-sf', 'data-q', 'data-bgurl'].filter((k) => el.hasAttribute(k))[0]; return n ? '[' + n + (el.getAttribute(n) ? '="' + el.getAttribute(n) + '"' : '') + ']' : null; };
    const focusKey = keyOf(act), selS = act && act.selectionStart, selE = act && act.selectionEnd;
    R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app' + (narrow ? ' narrowv' : '') + '">' + top +
      '<div class="rblock">' + rooms + rpanel + '</div><div class="main">' + pv + ins + '</div>' +
      this._menuHtml() + this._modalHtml(tabs, tab, sec) +
      '<div class="toast"><span></span><button data-a="undo">' + t('undo') + '</button></div></div>';

    this._mountPreview(tab, sec);
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
    const xBtn = (i) => '<button class="x" data-del="' + i + '" title="×"><ha-icon class="s16" icon="mdi:close"></ha-icon></button>';
    if (s.type === 'scenes') {
      const items = s.items || [];
      body = items.length ? '<div class="items" data-dl="items">' + items.map((it, i) => '<div class="it" data-di>' + handle +
        '<input type="color" data-if="' + i + '.color" value="' + esc(it.color || '#5B8DEF') + '">' +
        '<div class="ico"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || '#5B8DEF') + '"></ha-icon></div>' +
        '<div class="col"><input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + t('name') + '">' +
        '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(it.icon || '') + '" placeholder="mdi:play" style="height:28px;font-size:12px">' +
        '</div><span class="eid">' + this._scTarget(tab, it) + '</span></div>' + xBtn(i) + '</div>').join('') + '</div>'
        : '<div class="empty">' + t('noItems') + '</div>';
      body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addScene') + '</button>' +
        '<button class="btn sm dash" data-a="addscph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addScPh') + '</button>' +
        (LEC.installed(this._hass) ? '<button class="btn sm" data-a="addlec"><ha-icon class="s16" icon="mdi:creation"></ha-icon>' + t('lecOpen') + '</button>' : '') + '</div>';
    } else {
      const items = (s.entities || []).map((x) => (typeof x === 'string' ? { entity: x } : x));
      const temps = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'temperature');
      const hums = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'humidity');
      const sel = (i, key, list, cur) => '<select class="inp" data-if="' + i + '.' + key + '"><option value="">' + t('fromDevice') + '</option>' +
        list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
      body = items.length ? '<div class="items" data-dl="items">' + items.map((it, i) => {
        const st = it.entity ? S[it.entity] : null;
        const ico = it.entity ? (it.icon ? '<ha-icon icon="' + esc(it.icon) + '"></ha-icon>' : '<ha-state-icon data-eid="' + esc(it.entity) + '"></ha-state-icon>') : '<ha-icon icon="' + esc(it.icon || 'mdi:lightbulb') + '"></ha-icon>';
        let extra = '';
        if (s.type === 'lights') extra = '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(it.icon || '') + '" placeholder="' + t('icon') + ' (mdi:...)" style="height:28px;font-size:12px"></div>';
        const sel2 = (key, list, cur, none, title) => '<select class="inp" data-if="' + i + '.' + key + '" title="' + esc(title) + '"><option value="">' + esc(none) + '</option>' +
          list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
        const climates = Object.keys(S).filter((id) => id.indexOf('climate.') === 0 && id !== it.entity);
        if (s.type === 'climate') extra = '<div class="sub">' + sel(i, 'temperature_sensor', temps, it.temperature_sensor) + sel(i, 'humidity_sensor', hums, it.humidity_sensor) + '</div>' +
          '<div class="sub">' + sel2('outdoor_sensor', temps, it.outdoor_sensor, this._t('noOutdoor'), this._t('outdoorT')) + sel2('link', climates, (it.entities || [])[0], this._t('noLink'), this._t('linkT')) + '</div>' +
          '<div class="sub"><select class="inp" data-if="' + i + '.kind">' + ['auto', 'ac', 'radiator'].map((k) => '<option value="' + k + '"' + ((it.kind || 'auto') === k ? ' selected' : '') + '>' + t('k_' + k) + '</option>').join('') + '</select></div>';
        return '<div class="it' + (it.entity ? '' : ' ph') + '" data-di>' + handle + '<div class="ico">' + ico + '</div><div class="col">' +
          '<input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + esc(it.entity ? this._ename(it.entity) : this._t('name')) + '">' + extra +
          '<span class="eid">' + esc(it.entity ? it.entity + (st ? '' : ' · ?') : this._t('addPh')) + '</span></div>' + xBtn(i) + '</div>';
      }).join('') + '</div>' : '<div class="empty">' + t('noItems') + '</div>';
      body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addDev') + '</button>' +
        (s.type === 'lights' ? '<button class="btn sm dash" data-a="addph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addPh') + '</button>' : '') + '</div>';
    }
    return '<div class="ed"><div class="row2"><div class="fld"><label>' + t('secTitle') + '</label><input class="inp" data-f="sec.title" value="' + esc(s.title || '') + '" placeholder="' + t('t_' + s.type) + '"></div>' +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('column') + '</label>' + colSeg + '</div>' + subSeg + '</div>' +
      (s.type === 'lights' ? '<div class="fld"><label>' + t('tileCols') + '</label><div class="seg">' + [2, 3, 4, 5, 6].map((n) => '<button data-tc="' + n + '"' + ((s.tile_columns || 5) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') +
      body + '<div class="acts"><span class="grow"></span><button class="btn sm dan' + (this._ask === 'delsec' ? ' ask' : '') + '" data-a="delsec"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'delsec' ? t('sure') : t('delSec')) + '</button></div></div>';
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
        (areas.length ? '<hr><div class="mh">' + t('fromArea') + '</div>' + areas.map((a) => '<button data-newtab="' + esc(a) + '"><ha-icon class="s16" icon="' + esc((this._hass.areas[a].icon) || 'mdi:door') + '"></ha-icon>' + esc(this._area(a)) + '</button>').join('') : '');
    }
    if (m.kind === 'addsec') inner = Object.keys(LHD_TYPES).map((k) => '<button data-newsec="' + k + '"><ha-icon class="s16" icon="' + LHD_TYPES[k].icon + '"></ha-icon><span><b>' + t('t_' + k) + '</b><br><span class="mu" style="font-size:12px">' + t('d_' + k) + '</span></span></button>').join('');
    return '<div class="menu" style="left:' + m.x + 'px;top:' + m.y + 'px;max-height:' + Math.max(200, window.innerHeight - m.y - 20) + 'px;overflow:auto">' + inner + '</div>';
  }

  _modalHtml(tabs, tab, sec) {
    const md = this._modal; if (!md) return '';
    const t = (k, v) => esc(this._t(k, v));
    if (md === 'pick' && sec) {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="' + LHD_TYPES[sec.type].icon + '"></ha-icon></div><h2>' + t('pickT') + ' → ' + esc(sec.title || this._t('t_' + sec.type)) + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-q placeholder="' + t('search') + '" value="' + esc(this._q) + '"></div>' +
        '<div class="db"><div class="plist">' + this._pickList(sec) + '</div></div>' +
        '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="pickadd"' + (this._picked.length ? '' : ' disabled') + '>' + t('addN', { n: this._picked.length }) + '</button></div></div></div>';
    }
    if (md === 'settings') {
      const s = this._settings();
      const seg = (path, cur, opts) => '<div class="seg">' + opts.map((o) => '<button data-set="' + path + '" data-val="' + esc(o[0]) + '"' + (cur === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const tg = (path, on) => '<button class="tg' + (on ? ' on' : '') + '" data-tg="' + path + '"></button>';
      const k = s.kiosk || {}, cv = s.canvas || {};
      const bgImg = typeof s.background === 'string' && /url\(/.test(s.background);
      const bgUrl = bgImg ? (s.background.match(/url\(['"]?([^'")]+)/) || [])[1] || '' : '';
      const lec = !!(this._hass.config && (this._hass.config.components || []).indexOf('lemur_light_effects') >= 0);
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('settings') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' +
        '<div class="sh">' + t('s_board') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lang') + '</b></div>' + seg('language', s.language || 'auto', [['auto', this._t('lAuto')], ['tr', 'Türkçe'], ['en', 'English']]) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('season') + '</b><span>' + t('seasonT') + '</span></div>' + seg('season', s.season || 'auto', [['auto', this._t('sAuto')], ['summer', this._t('sSum')], ['winter', this._t('sWin')]]) + '</div>' +
        '<div class="sh">' + t('s_look') + '</div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t"><b>' + t('bg') + '</b><span>' + t('bgT') + '</span></div>' + seg('bgmode', bgImg ? 'img' : 'dark', [['dark', this._t('bgDark')], ['img', this._t('bgImg')]]) +
        (bgImg ? '<input class="inp w" data-bgurl value="' + esc(bgUrl) + '" placeholder="/local/zemin.jpg" style="width:100%">' : '') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('theme') + '</b><span>' + t('themeT') + '</span></div><input class="inp w" data-sf="theme_name" value="' + esc(s.theme_name || '') + '" placeholder="ios-dark-mode-blue-red"></div>' +
        '<div class="sh">' + t('s_screen') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kHeader') + '</b><span>' + t('kHeaderT') + '</span></div>' + tg('kiosk.hide_header', !!k.hide_header) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kSide') + '</b><span>' + t('kSideT') + '</span></div>' + tg('kiosk.hide_sidebar', !!k.hide_sidebar) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('canvas') + '</b><span>' + t('canvasT') + '</span></div><input class="inp" type="number" min="800" max="3000" data-sf="canvas.width" value="' + esc(cv.width || 1280) + '" style="width:90px"><input class="inp" type="number" min="500" max="2500" data-sf="canvas.ref_height" value="' + esc(cv.ref_height || 1075) + '" style="width:90px"></div>' +
        '<div class="sh">' + t('s_info') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lec') + '</b><span>' + (lec ? t('lecOn', { v: LEC.version || '?' }) : t('lecOff')) + '</span></div></div>' +
        '<div class="srow"><div class="t"><b>' + t('hold') + '</b><span>' + t('holdT') + '</span></div>' + seg('hold', lpHoldMode() === 'lec' && !lec ? 'popup' : lpHoldMode(), [['popup', this._t('hPop')], ['ha', this._t('hHa')]].concat(lec ? [['lec', this._t('hLec')]] : [])) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('version') + '</b><span>' + esc(PANEL_VERSION) + '</span></div></div>' +
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
    const doms = LHD_TYPES[sec.type].domains;
    const have = {};
    if (sec.type === 'scenes') (sec.items || []).forEach((x) => {
      if (x.action && x.action.target) have[x.action.target] = 1;
      const k = lpLecKind(x), d = (x.action && x.action.data) || {};
      if (k === 'play') have['lec:' + d.room + ':' + d.effect] = 1;
      if (k === 'stop') have['lecstop:' + d.room] = 1;
    });
    else (sec.entities || []).forEach((x) => { const id = typeof x === 'string' ? x : x.entity; if (id) have[id] = 1; });
    const areaOf = (id) => { const e = ents[id]; if (!e) return ''; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return (d && d.area_id) || ''; };
    const q = this._q.toLowerCase().trim();
    const ids = Object.keys(S).filter((id) => doms.indexOf(id.split('.')[0]) >= 0 && !(ents[id] && (ents[id].hidden || ents[id].entity_category)))
      .filter((id) => !q || (this._ename(id) + ' ' + id + ' ' + this._area(areaOf(id))).toLowerCase().indexOf(q) >= 0);
    const lecHtml = this._lecGroups(sec, have, q);
    if (!ids.length) return lecHtml || '<div class="empty">' + esc(this._t('nothing')) + '</div>';
    const groups = {};
    ids.forEach((id) => { const a = areaOf(id); (groups[a] = groups[a] || []).push(id); });
    // sekmenin alanı en üstte (oda sekmesine cihaz eklerken önce o odanınkiler görünsün)
    const ct = this._curTab(this._work()), ta = ct && ct.area;
    const order = (ta && groups[ta] ? [ta] : []).concat(Object.keys(this._hass.areas || {}).filter((a) => groups[a] && a !== ta)).concat(groups[''] ? [''] : []);
    return order.map((a) => '<div class="pg">' + esc(a ? this._area(a) : this._t('noArea2')) + '</div>' + groups[a].sort((x, y) => this._ename(x).localeCompare(this._ename(y))).map((id) => {
      const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
      return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
        '<div class="ico"><ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon></div><div class="t"><b>' + esc(this._ename(id)) + '</b><span>' + esc(id) + '</span></div>' +
        '<span class="st">' + esc(dis ? this._t('added') : (this._hass.formatEntityState ? this._hass.formatEntityState(S[id]) : S[id].state)) + '</span></div>';
    }).join('')).join('') + lecHtml;
  }

  // senaryo düğmesinin ne yaptığı (düzenleyicideki alt yazı)
  _scTarget(tab, it) {
    const T = (k, v) => esc(this._t(k, v)), k = lpLecKind(it), a = it.action || {};
    const rn = (r) => (r ? (LEC.names[r] || this._area(r) || r) : this._t('roomByTab'));
    let txt;
    if (k === 'open') txt = T('tOpen', { r: rn(a.room || tab.area) });
    else if (k === 'play') txt = T('tPlay', { e: (a.data && a.data.effect) || '?', r: rn(a.data && a.data.room) });
    else if (k === 'stop') txt = T('tStop', { r: rn(a.data && a.data.room) });
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
    if (sec.type !== 'scenes' || !LEC.installed(this._hass) || !LEC.rooms) return '';
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
          '<div class="ico"><ha-icon icon="' + icon + '"></ha-icon></div><div class="t"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></div>' +
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
    const cfg = { type: 'custom:lemur-home-dashboard-card', tab: tab.id, edit: true, selected: sec ? sec.id : '' };
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
    const cw = Math.max(W, Math.floor(sw / sh * H)), ch = Math.floor(sh * cw / sw);
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
      if (g('[data-ovl]') && e.target === g('[data-ovl]')) { this._modal = null; this._render(); return; }
      if (act !== 'deltab' && act !== 'delsec' && this._ask) { this._ask = null; }
      const at = (el) => { const r = el.getBoundingClientRect(), rr = app.getBoundingClientRect(); return { x: Math.min(r.left - rr.left, rr.width - 260), y: r.bottom - rr.top + 6 }; };
      if (act === 'undo') return this._undoIt();
      if (act === 'settings') { this._modal = 'settings'; this._menu = null; return this._render(); }
      if (act === 'more' || act === 'addtab' || act === 'addsec') { const p = at(a); this._menu = this._menu && this._menu.kind === act ? null : { kind: act, x: p.x, y: p.y }; return this._render(); }
      if (act === 'close') { this._modal = null; this._picked = []; this._q = ''; return this._render(); }
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
      if (act === 'pick') { this._modal = 'pick'; this._picked = []; this._q = ''; return this._render(); }
      if (act === 'pickadd') {
        const ids = this._picked.slice(); this._modal = null; this._picked = []; this._q = '';
        return editSec((S) => {
          if (S.type === 'scenes') {
            S.items = S.items || [];
            ids.forEach((id) => {
              if (id.indexOf('lec:') === 0) {
                const p = id.split(':'), room = p[1], effect = p.slice(2).join(':');
                S.items.push({ name: effect, icon: 'mdi:creation', color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: { service: LP_LEC_DOMAIN + '.play', data: { room: room, effect: effect } } });
                return;
              }
              if (id.indexOf('lecstop:') === 0) {
                S.items.push({ name: this._t('lecStop'), icon: 'mdi:stop-circle-outline', color: '#E5484D', action: { service: LP_LEC_DOMAIN + '.stop', data: { room: id.slice(8) } } });
                return;
              }
              const d = id.split('.')[0], st = this._hass.states[id];
              S.items.push({ name: this._ename(id), icon: (st && st.attributes.icon) || (d === 'script' ? 'mdi:play-circle-outline' : d === 'scene' ? 'mdi:palette-outline' : 'mdi:robot'),
                color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: { service: d === 'automation' ? 'automation.trigger' : d + '.turn_on', target: id } });
            });
          } else {
            S.entities = S.entities || [];
            ids.forEach((id) => S.entities.push(S.type === 'climate' ? this._climateItem(id) : id));
          }
        });
      }
      if (act === 'addlec') return editSec((S) => { S.items = S.items || []; S.items.push({ name: this._t('lecOpen'), icon: 'mdi:creation', color: '#FF6FAE', action: { service: LP_LEC_DOMAIN + '.open' } }); });
      if (act === 'addscph') return editSec((S) => { S.items = S.items || []; S.items.push({ name: this._t('addScPh'), icon: 'mdi:gesture-tap', color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: null }); });
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
        const L = this._lang, titles = { lights: t(L, 'lights'), scenes: t(L, 'scenes'), climate: tab.area ? upper(L, this._area(tab.area)) : t(L, 'control'), vacuum: '', media: '' };
        const ncol = lpWeights(tab).length;
        const s = { id: id, type: type, title: titles[type], col: tgt ? tgt.col : Math.min(LHD_TYPES[type].col, ncol - 1) };
        if (tgt && tgt.sub) s.sub = tgt.sub;
        if (type === 'scenes') s.items = []; else s.entities = [];
        // karo sayısı yerin genişliğine göre: geniş kolonda 5, dar sütunda daha az (tablet panosunda 56'lık kolonda 5 karo)
        if (type === 'lights') { const w = lpWeights(tab), sum = w.reduce((a, b) => a + b, 0), sp = lpSplits(tab, w.length)[s.col] || 1;
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
      const dl = g('[data-del]');
      if (dl) { const i = +dl.getAttribute('data-del'); return editSec((S) => { (S.type === 'scenes' ? S.items : S.entities).splice(i, 1); }); }
      const pk = g('[data-pk]');
      if (pk && !pk.classList.contains('dis')) {
        const id = pk.getAttribute('data-pk'), k = this._picked.indexOf(id);
        if (k >= 0) this._picked.splice(k, 1); else this._picked.push(id);
        pk.classList.toggle('on', k < 0);
        pk.querySelector('.ck').innerHTML = k < 0 ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '';
        const btn = R.querySelector('[data-a="pickadd"]'); btn.disabled = !this._picked.length; btn.textContent = this._t('addN', { n: this._picked.length });
        return;
      }
      const st = g('[data-set]');
      if (st) {
        const path = st.getAttribute('data-set'), v = st.getAttribute('data-val');
        if (path === 'bgmode') return this._setting('background', v === 'img' ? "center / cover no-repeat fixed url('/local/zemin.jpg')" : null);
        return this._setting(path, v === 'auto' ? null : v);
      }
      const tgl = g('[data-tg]');
      if (tgl) { const path = tgl.getAttribute('data-tg'); const cur = tgl.classList.contains('on'); return this._setting(path, cur ? null : true); }
    });

    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir (yazarken odak kaybolmasın)
    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir. Yazı alanları "soft" kaydedilir: panel yeniden
    // çizilmez (odak ve hemen arkasından basılan düğme kaybolmasın); görünen ilgili yazılar yerinde güncellenir, önizleme kendisi güncellenir.
    app.addEventListener('change', (e) => {
      const el = e.target;
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
        const ic = R.querySelector('.rb.on ha-icon'); if (ic) ic.setAttribute('icon', v);
        return editTab((T) => { T.icon = v; }, true);
      }
      if (f === 'tab.area') return editTab((T) => { T.area = el.value || null; });
      if (f === 'sec.title') {
        const lb = R.querySelector('.si.on .nm b'); if (lb) lb.textContent = el.value || this._t('t_' + sec.type);
        return editSec((S) => { S.title = el.value; }, true);
      }
      const itf = el.getAttribute && el.getAttribute('data-if');
      if (itf) {
        const p = itf.split('.'), i = +p[0], key = p[1], v = el.value.trim();
        if (key === 'color') { const ic = el.parentNode.querySelector('.ico ha-icon'); if (ic) ic.style.color = v; }
        return editSec((S) => {
          if (S.type === 'scenes') { const it = S.items[i]; if (!it) return; if (v) it[key] = v; else if (key !== 'name') delete it[key]; return; }
          let it = S.entities[i]; if (it === undefined) return;
          if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
          if (key === 'link') { if (v) it.entities = [v].concat((it.entities || []).slice(1).filter((x) => x !== v)); else delete it.entities; }
          else if (v && !(key === 'kind' && v === 'auto')) it[key] = v; else delete it[key];
          if (it.entity && Object.keys(it).length === 1) S.entities[i] = it.entity;   // sade kalsın
        }, soft);
      }
      const sf = el.getAttribute && el.getAttribute('data-sf');
      if (sf) { const v = el.type === 'number' ? (parseInt(el.value, 10) || null) : el.value.trim(); return this._setting(sf, v, true); }
      if (el.hasAttribute && el.hasAttribute('data-bgurl')) { const u = el.value.trim(); return this._setting('background', u ? "center / cover no-repeat fixed url('" + u.replace(/'/g, '') + "')" : null, true); }
    });
    app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('inp') && e.target.tagName === 'INPUT') e.target.blur(); });
    // simge alanında yazarken önizleme
    app.addEventListener('input', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-q')) { this._q = el.value; const pl = R.querySelector('.plist'); if (pl) { pl.innerHTML = this._pickList(sec); pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; }); } return; }
      const f = el.getAttribute && (el.getAttribute('data-f') || el.getAttribute('data-if') || '');
      if (/icon$/.test(f)) { const pv = el.closest('.iconin, .it'); const ic = pv && pv.querySelector('.pv ha-icon, .ico ha-icon'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.setAttribute('icon', el.value.trim()); }
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
          if (kind === 'items') editSec((S) => lhdMove(S.type === 'scenes' ? S.items : S.entities, from, dest));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
  }

  // iklim cihazı eklenirken aynı alandaki harici sıcaklık/nem sensörü önerilir (otomatik düzendeki kural)
  _climateItem(id) { return lpClimateItem(this._hass, id); }
}

// Bazı eklentiler sayfa açılırken window.customElements'i kendi kopyasıyla değiştiriyor (scoped registry polyfill).
// Biz ondan önce yüklenirsek tanımımız yeni kopyada görünmez; HA pano stratejisini bulamaz ("Timeout waiting for strategy element").
// Bu yüzden ilk 30 sn boyunca kayıt defterine bakıp eksikse yeniden kaydediyoruz (aynı sınıf; tarayıcının asıl kaydı zaten bizde).
const LP_DEFS = [['ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy], ['lemur-home-dashboard-card', LemurHomeDashboardCard], ['lemur-home-dashboard-admin', LemurHomeDashboardAdmin]];
const lpDefineAll = () => LP_DEFS.forEach((d) => { try { if (!window.customElements.get(d[0])) window.customElements.define(d[0], d[1]); } catch (e) {} });
lpDefineAll();
let lpTries = 0;
const lpTimer = setInterval(() => { lpDefineAll(); if (++lpTries > 300) clearInterval(lpTimer); }, 100);
window.addEventListener('location-changed', lpDefineAll);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
