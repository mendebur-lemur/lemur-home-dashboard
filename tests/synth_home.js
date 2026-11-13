// edge test harness: synthetic homes. LP_SYNTH(n) + &var=empty|one|noarea|long|weird|dup|big80|odd
function LP_SYNTH(n) {
  var q = location.search, en = /lang=en/.test(q), v = (/[?&]var=([a-z0-9]+)/.exec(q) || [])[1] || '';
  var S = {}, E = {}, A = {}, D = {};
  function add(id, st, at, area) { S[id] = { entity_id: id, state: st, attributes: at }; E[id] = { entity_id: id, area_id: area || null, platform: 'demo' }; }
  var rooms = en ? ['Living Room', 'Kitchen', 'Master Bedroom', 'Kids Room', 'Office', 'Bathroom', 'Hallway', 'Garage', 'Garden and Terrace', 'Guest Room', 'Laundry', 'Basement Workshop'] : ['Salon', 'Mutfak', 'Ebeveyn Yatak Odası', 'Çocuk Odası', 'Çalışma Odası', 'Banyo', 'Koridor', 'Garaj', 'Bahçe ve Teras', 'Misafir Odası', 'Çamaşır Odası', 'Bodrum Atölye'];
  var kinds = en ? ['Ceiling Light', 'Floor Lamp', 'LED Strip', 'Spot', 'Bedside', 'Under Cabinet', 'Mirror', 'Desk'] : ['Tavan Lambası', 'Lambader', 'LED Şerit', 'Spot', 'Başucu', 'Dolap Altı', 'Ayna', 'Masa'];
  if (v === 'empty') n = 0;
  var nr = v === 'one' ? 1 : Math.max(1, Math.min(rooms.length, Math.ceil(n / 8)));
  if (v !== 'empty') for (var r = 0; r < nr; r++) A['r' + r] = { area_id: 'r' + r, name: rooms[r], icon: null, floor_id: null };
  var nm = function (s, i) {
    if (v === 'long') return s + ' with an extraordinarily long descriptive name that never ends ' + i;
    if (v === 'weird') return ['💡 ' + s, s + ' "quoted" <b>x</b> & co', "O'Neil's <script>", s + ' &amp; &lt;'][i % 4] + ' ' + i;
    if (v === 'dup') return en ? 'Lamp' : 'Lamba';
    return s;
  };
  var noArea = v === 'noarea';
  for (var i = 0; i < n; i++) {
    var r2 = i % nr, k = i % 10, ar = noArea ? null : 'r' + r2;
    if (k < 7) add('light.x' + i, i % 3 ? 'off' : 'on', { friendly_name: nm(rooms[r2] + ' ' + kinds[i % kinds.length] + ' ' + (Math.floor(i / nr) + 1), i), brightness: 200, supported_color_modes: ['hs', 'color_temp'], color_mode: 'hs', hs_color: [30 + i * 7 % 360, 60], rgb_color: [255, 180, 110], min_color_temp_kelvin: 2000, max_color_temp_kelvin: 6500, supported_features: 4, effect_list: ['Rainbow', 'Fire'] }, ar);
    else if (k === 7) add('climate.x' + i, 'heat', { friendly_name: nm(rooms[r2] + (en ? ' Thermostat ' : ' Termostat ') + i, i), hvac_modes: ['cool', 'heat', 'off'], current_temperature: 21.5, temperature: 22, hvac_action: 'heating', min_temp: 16, max_temp: 30, target_temp_step: 0.5, supported_features: 393, fan_modes: ['auto', 'low', 'high'], fan_mode: 'auto' }, ar);
    else if (k === 8) add('scene.x' + i, 'unknown', { friendly_name: nm((en ? 'Scene number ' : 'Senaryo numara ') + i + ' ' + rooms[r2], i) }, ar);
    else add('media_player.x' + i, 'playing', { friendly_name: nm(rooms[r2] + (en ? ' Speaker' : ' Hoparlör'), i), media_title: 'A fairly long media title here' }, ar);
  }
  if (v === 'big80') {
    A.big = { area_id: 'big', name: en ? 'Big Hall' : 'Büyük Salon', icon: null, floor_id: null };
    for (var j = 0; j < 80; j++) add('light.big' + j, j % 2 ? 'on' : 'off', { friendly_name: (en ? 'Hall light ' : 'Salon ışık ') + (j + 1), brightness: 180, supported_color_modes: ['brightness'], color_mode: 'brightness' }, 'big');
  }
  if (v === 'odd') {   // minimal-capability devices in room r0
    add('climate.onoff', 'off', { friendly_name: 'OnOff Klima', hvac_modes: ['off', 'heat'], supported_features: 0 }, 'r0');
    add('climate.bare', 'off', { friendly_name: 'Bare Climate', hvac_modes: ['off'], supported_features: 0 }, 'r0');
    add('cover.oc', 'closed', { friendly_name: 'Garage Door', supported_features: 3 }, 'r0');
    add('light.onoff', 'off', { friendly_name: 'Plain Bulb', supported_color_modes: ['onoff'], color_mode: 'onoff' }, 'r0');
    add('camera.nostream', 'unavailable', { friendly_name: 'Dead Cam' }, 'r0');
    add('camera.nopic', 'idle', { friendly_name: 'No Picture Cam' }, 'r0');
  }
  return { states: S, entities: E, devices: D, areas: A, floors: {}, tabs: [], settings: {} };
}
