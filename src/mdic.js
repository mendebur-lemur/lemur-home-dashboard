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
      LP_MDIC.map = m && typeof m === 'object' ? m : {};
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
