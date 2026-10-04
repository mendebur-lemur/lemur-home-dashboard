// Renkli simge seti: pakete gömülü, Light Effect Card gerekmez. Entegrasyon ayrı bir dosya olarak sunar
// (/lemur_home_dashboard/mdi-color.json, "mdi:ad" → SVG). Ana JS'e girmez; ayarda "Simge stili: Renkli" seçiliyse
// ilk gereken yerde bir kez yüklenir, eski tabletler düz simgede hiç indirmez. Sette olmayan simge düz çizilir (ha-icon).
// Kapalı ışık ve cihazlarda renkli simge soluk görünür (base.css: .tile:not(.on) .lic).
const LP_MDIC_URL = '/lemur_home_dashboard/mdi-color.json';
const LP_MDIC = window.__LEMUR_HD_MDIC || (window.__LEMUR_HD_MDIC = { map: null, loading: null, subs: [] });
// panonun kendi varsayılanlarında geçip sette birebir olmayanlar: en yakın renkli simge
const LP_MDIC_ALIAS = {
  'mdi:bed-king-outline': 'mdi:bed-king', 'mdi:table-chair': 'mdi:silverware-fork-knife', 'mdi:flower-outline': 'mdi:flower',
  'mdi:home-variant-outline': 'mdi:home-outline', 'mdi:palette-outline': 'mdi:palette', 'mdi:play-circle-outline': 'mdi:play',
  'mdi:white-balance-sunny': 'mdi:weather-sunny', 'mdi:creation': 'mdi:palette', 'mdi:television-classic': 'mdi:television',
  'mdi:lightbulb-variant': 'mdi:lightbulb', 'mdi:lightbulb-variant-outline': 'mdi:lightbulb-outline', 'mdi:led-strip': 'mdi:led-strip-variant',
  'mdi:thermometer-auto': 'mdi:thermometer', 'mdi:power-socket': 'mdi:power-socket-eu', 'mdi:power-socket-de': 'mdi:power-socket-eu'
};
function lpMdicOn() { const s = STORE.data && STORE.data.settings; return !!(s && s.icon_style === 'color'); }
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
// "mdi:x" simgesinin setteki anahtarı (yoksa null): önce eşleme, sonra kendisi, sonra -outline'sız hali
function lpMdicKey(icon) {
  const M = LP_MDIC.map;
  if (!M || typeof icon !== 'string' || icon.indexOf('mdi:') !== 0) return null;
  let k = LP_MDIC_ALIAS[icon] || icon;
  if (M[k]) return k;
  if (/-outline$/.test(k)) { k = k.slice(0, -8); if (M[k]) return k; }
  return null;
}
// renkli stil açıksa simgenin SVG'si; set henüz yüklenmediyse yüklemeyi başlatır ve null döner (yüklenince abone olanlar yeniden çizer)
function lpMdicSvg(icon) {
  if (!lpMdicOn() || typeof icon !== 'string' || icon.indexOf('mdi:') !== 0) return null;
  if (!LP_MDIC.map) { lpMdicLoad(); return null; }
  const k = lpMdicKey(icon);
  return k ? LP_MDIC.map[k] : null;
}
// kendi simgesi olmayan varlığın varsayılan simgesi (HA'nın seçtiğine yakın); renkli sette karşılığı olanlar. Bilinmeyende null → düz simge
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
      return LP_MDIC_SENSOR[dc] ? m(LP_MDIC_SENSOR[dc]) : null;
    }
    case 'weather': return LP_MDIC_WEATHER[s] ? m(LP_MDIC_WEATHER[s]) : m('weather-partly-cloudy');
  }
  return null;
}
