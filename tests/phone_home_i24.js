// GitHub #24 (telefon görüntü uyuşmazlığı): kullanıcının evinin taklidi. demo.html?ev=i24
// Sekmeler Otomatik kur ile kurulmuş gibi: Ev, Hol, Oyun odası, Mutfak, Yatak odası, Misafir Odası, Çocuk Odası.
// Tek ışık Oyun odasında, robot süpürge "Robot" Hol'de. Hol'ün ışık ve kısayol bölümleri boş.
var LP_I24 = (function () {
  var S = {}, E = {}, A = {};
  function add(id, st, at, area) { S[id] = { entity_id: id, state: st, attributes: at }; E[id] = { entity_id: id, area_id: area || null, platform: 'demo' }; }
  [['ev', 'Ev'], ['hol', 'Hol'], ['oyun_odasi', 'Oyun odası'], ['mutfak', 'Mutfak'], ['yatak_odasi', 'Yatak odası'], ['misafir_odasi', 'Misafir Odası'], ['cocuk_odasi', 'Çocuk Odası']]
    .forEach(function (a) { A[a[0]] = { area_id: a[0], name: a[1], icon: null, floor_id: null }; });
  add('light.oyun_odasi_tepe_lambasi', 'on', { friendly_name: 'Oyun Odası Tepe Lambası', brightness: 200, supported_color_modes: ['color_temp'], color_mode: 'color_temp', color_temp_kelvin: 3000, min_color_temp_kelvin: 2000, max_color_temp_kelvin: 6500 }, 'oyun_odasi');
  add('vacuum.robot', 'docked', { friendly_name: 'Robot', battery_level: 100, fan_speed: 'standard', fan_speed_list: ['quiet', 'standard', 'turbo'], supported_features: 14204 }, 'hol');
  var C = [56, 17, 25.5];
  function tab(id, name, icon, area, L, lt, st, V, ct) {
    return { id: id, name: name, icon: icon, area: area, v: 2, columns: C, sections: [
      { id: id + '-l', type: 'lights', title: lt, col: 0, entities: L, tile_columns: 5 },
      { id: id + '-s', type: 'scenes', title: st, col: 1, entities: [] },
      { id: id + '-c', type: 'climate', title: ct, col: 2, entities: V }] };
  }
  var tabs = [
    tab('home', 'Ev', 'mdi:home-outline', null, ['light.oyun_odasi_tepe_lambasi'], 'Işıklar', 'Senaryolar', ['vacuum.robot'], 'Ev kontrol'),
    tab('hol', 'Hol', 'mdi:door', 'hol', [], 'Hol ışıkları', 'Kısayollar', ['vacuum.robot'], 'Hol'),
    tab('oyun_odasi', 'Oyun odası', 'mdi:gamepad-variant-outline', 'oyun_odasi', ['light.oyun_odasi_tepe_lambasi'], 'Işıklar', 'Kısayollar', [], 'Oyun odası'),
    tab('mutfak', 'Mutfak', 'mdi:countertop-outline', 'mutfak', [], 'Mutfak ışıkları', 'Kısayollar', [], 'Mutfak'),
    tab('yatak_odasi', 'Yatak odası', 'mdi:bed-king-outline', 'yatak_odasi', [], 'Yatak odası ışıkları', 'Kısayollar', [], 'Yatak odası'),
    tab('misafir_odasi', 'Misafir Odası', 'mdi:bed-outline', 'misafir_odasi', [], 'Misafir Odası ışıkları', 'Kısayollar', [], 'Misafir Odası'),
    tab('cocuk_odasi', 'Çocuk Odası', 'mdi:teddy-bear', 'cocuk_odasi', [], 'Çocuk Odası ışıkları', 'Kısayollar', [], 'Çocuk Odası')
  ];
  return { states: S, entities: E, devices: {}, areas: A, floors: {}, tabs: tabs, settings: {} };
})();
