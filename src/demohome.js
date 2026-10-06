// Otomatik kur penceresindeki önizleme için hayali ev. Yeni başlayanın evinde birkaç cihaz olur; önizleme, seçilen seçeneklerle
// dolu bir akıllı evin panosunun nasıl görünebileceğini gösterir. Kurulum her zaman kullanıcının kendi evinden yapılır.
// Varlıklar HA'daki gibi (states, entities, areas); sahte hass dokununca durumu değiştirir, böylece önizleme denenebilir.
function lhdDemoHome(lang) {
  const tr = lang !== 'en', T = (a, b) => (tr ? a : b);
  const S = {}, E = {}, areas = {};
  const area = (id, tn, en, icon) => { areas[id] = { area_id: id, name: T(tn, en), icon: icon, floor_id: null }; };
  const add = (id, state, a, aid) => { S[id] = { entity_id: id, state: state, attributes: a, last_changed: '2026-01-01T00:00:00Z', last_updated: '2026-01-01T00:00:00Z' }; E[id] = { entity_id: id, area_id: aid || null, platform: 'demo' }; };
  const CT = ['color_temp', 'hs'], FX = ['Aurora', 'Fire', 'Candle', 'Rainbow', 'Ocean'];
  // genel adlar (Tavan, Ayna) HA'daki gibi odanın adıyla: Ev sekmesinde hangi odanın ışığı olduğu anlaşılsın
  // 4 oda yeter: üst şeritte kalabalık olmasın, önizlemede her şey görünsün
  const L = (aid, slug, tn, en, icon, on, x) => add('light.' + aid + '_' + slug, on ? 'on' : 'off', Object.assign({ friendly_name: (/^(Tavan|Ayna|Ceiling|Mirror)$/.test(T(tn, en)) ? areas[aid].name + ' ' : '') + T(tn, en), icon: icon, supported_color_modes: CT, effect_list: FX }, on ? { brightness: 204, color_mode: 'color_temp', color_temp_kelvin: 2700, rgb_color: [255, 177, 110] } : {}, x || {}), aid);
  const rgb = (r, g, b) => ({ color_mode: 'hs', rgb_color: [r, g, b] });
  area('salon', 'Salon', 'Living Room', 'lhd:room-living');
  area('mutfak', 'Mutfak', 'Kitchen', 'lhd:room-kitchen');
  area('yatak', 'Yatak Odası', 'Bedroom', 'lhd:room-bedroom');
  area('calisma', 'Çalışma Odası', 'Office', 'lhd:room-office');
  L('salon', 'tavan', 'Tavan', 'Ceiling', 'lhd:smart-ceiling-light', true);
  L('salon', 'serit', 'Gizli Şerit', 'Cove Strip', 'lhd:drop-ceiling-strip', true, rgb(162, 107, 255));
  L('salon', 'tv', 'TV Arkası', 'Behind TV', 'lhd:tv-back-strip', true, rgb(83, 155, 255));
  L('salon', 'lambader', 'Lambader', 'Floor Lamp', 'lhd:floor-lamp-arc', false);
  L('salon', 'koltuk', 'Koltuk Altı', 'Under Sofa', 'lhd:sofa-under-light', false);
  L('salon', 'spot', 'Spotlar', 'Spotlights', 'lhd:spot-triple', false);
  L('salon', 'panel', 'Altıgen Panel', 'Hexagon Panels', 'lhd:hexagon-panels', true, Object.assign(rgb(255, 111, 174), { effect: 'Aurora' }));
  L('mutfak', 'tavan', 'Tavan', 'Ceiling', 'lhd:ceiling-panel', false);
  L('mutfak', 'ada', 'Ada Sarkıtları', 'Island Pendants', 'lhd:kitchen-island-pendants', true);
  L('mutfak', 'tezgah', 'Tezgah Altı', 'Under Cabinet', 'lhd:under-cabinet-light', true);
  L('mutfak', 'dolap', 'Dolap Üstü', 'Above Cabinets', 'lhd:kitchen-upper-cabinet', false);
  L('yatak', 'tavan', 'Tavan', 'Ceiling', 'lhd:smart-ceiling-light', false);
  L('yatak', 'basucu', 'Başucu', 'Bedside', 'lhd:bedside-lamp', true, { brightness: 77 });
  L('yatak', 'yatakalti', 'Yatak Altı', 'Under Bed', 'lhd:bed-under-light', false);
  L('yatak', 'ayna', 'Ayna', 'Mirror', 'lhd:mirror-back-light', false);
  L('calisma', 'masa', 'Masa', 'Desk', 'lhd:desk-lamp-led-bar', true);
  L('calisma', 'monitor', 'Monitör Işığı', 'Monitor Light', 'lhd:monitor-light-bar', false);
  L('calisma', 'tavan', 'Tavan', 'Ceiling', 'lhd:ceiling-linear-recessed', false);
  const AC = (aid, tn, en, st, cur, tgt, act) => add('climate.' + aid + '_klima', st, { friendly_name: T(tn, en), icon: 'lhd:ac-split', hvac_modes: ['off', 'cool', 'heat', 'dry', 'fan_only', 'auto'], hvac_action: act, current_temperature: cur, current_humidity: 48,
    temperature: tgt, min_temp: 16, max_temp: 30, target_temp_step: 1, fan_modes: ['auto', 'low', 'medium', 'high'], fan_mode: 'auto', swing_modes: ['off', 'vertical'], swing_mode: 'off' }, aid);
  const RAD = (aid, tn, en, st, cur, tgt, act) => add('climate.' + aid + '_petek', st, { friendly_name: T(tn, en), icon: 'lhd:heater-convector', hvac_modes: ['off', 'heat'], hvac_action: act, current_temperature: cur, temperature: tgt, min_temp: 5, max_temp: 30, target_temp_step: 0.5 }, aid);
  AC('salon', 'Salon Klima', 'Living Room AC', 'cool', 26.4, 23, 'cooling');
  RAD('salon', 'Salon Petek', 'Living Room Radiator', 'heat', 21.2, 22, 'heating');
  AC('yatak', 'Yatak Odası Klima', 'Bedroom AC', 'off', 25.1, 22, 'off');
  RAD('yatak', 'Yatak Odası Petek', 'Bedroom Radiator', 'heat', 20.4, 21, 'idle');
  AC('calisma', 'Çalışma Klima', 'Office AC', 'cool', 25.6, 24, 'cooling');
  add('vacuum.robot', 'docked', { friendly_name: T('Robot Süpürge', 'Robot Vacuum'), battery_level: 100, fan_speed: 'standard', fan_speed_list: ['quiet', 'standard', 'turbo'] }, 'salon');
  add('vacuum.ust_kat', 'cleaning', { friendly_name: T('Üst Kat Süpürge', 'Upstairs Vacuum'), battery_level: 64 }, 'yatak');
  add('media_player.salon_tv', 'playing', { friendly_name: T('Salon TV', 'Living Room TV'), media_title: T('Belgesel', 'Documentary'), volume_level: 0.3 }, 'salon');
  add('media_player.mutfak_hoparlor', 'paused', { friendly_name: T('Mutfak Hoparlör', 'Kitchen Speaker'), media_title: 'Jazz', media_artist: 'Lemur' }, 'mutfak');
  const SC = (id, tn, en, icon, aid) => add(id, 'off', { friendly_name: T(tn, en), icon: icon }, aid);
  SC('scene.gunaydin', 'Günaydın', 'Good Morning', 'lhd:scene-sunset');
  SC('scene.sinema', 'Sinema', 'Movie Night', 'lhd:room-cinema');
  SC('scene.okuma', 'Okuma', 'Reading', 'lhd:scene-reading');
  SC('scene.romantik', 'Romantik', 'Romantic', 'lhd:scene-romantic');
  SC('script.eve_geldim', 'Eve Geldim', 'I\'m Home', 'lhd:welcome-home');
  SC('script.iyi_geceler', 'İyi Geceler', 'Good Night', 'lhd:goodnight');
  SC('scene.salon_parti', 'Parti', 'Party', 'lhd:scene-party-lights', 'salon');
  SC('scene.salon_dinlen', 'Dinlenme', 'Relax', 'lhd:scene-relax', 'salon');
  SC('scene.mutfak_yemek', 'Yemek', 'Cooking', 'lhd:scene-cooking', 'mutfak');
  SC('scene.yatak_uyku', 'Uyku', 'Sleep', 'lhd:scene-kids-sleep', 'yatak');
  SC('scene.calisma_odak', 'Odak', 'Focus', 'lhd:scene-focus', 'calisma');
  return { states: S, entities: E, areas: areas };
}
// önizleme için sahte hass: kullanıcının hass'ından dil, yerel ayar ve biçimleme alınır; servisler yalnız hayali evin durumunu değiştirir
function lhdDemoHass(base, home, onChange) {
  const S = home.states;
  const set = (id, st, a) => { const o = S[id]; if (!o) return; S[id] = Object.assign({}, o, { state: st, attributes: Object.assign({}, o.attributes, a || {}), last_updated: new Date().toISOString() }); };
  const h = {
    states: S, entities: home.entities, devices: {}, areas: home.areas, floors: {}, services: {},
    language: base.language, locale: base.locale, themes: base.themes, selectedLanguage: base.selectedLanguage, user: base.user,
    config: Object.assign({}, base.config, { components: [] }),
    callWS: () => Promise.resolve(null),
    connection: { sendMessagePromise: () => Promise.resolve(null), subscribeMessage: () => Promise.resolve(() => {}) },
    formatEntityState: (st) => (base.formatEntityState ? base.formatEntityState(st) : undefined),
    callService: (dom, svc, data) => {
      [].concat((data && data.entity_id) || []).forEach((id) => {
        const o = S[id]; if (!o) return;
        const d = id.split('.')[0], on = o.state !== 'off' && o.state !== 'docked';
        if (svc === 'toggle') set(id, d === 'light' || d === 'switch' ? (on ? 'off' : 'on') : o.state, on ? {} : { brightness: 204 });
        else if (svc === 'turn_on' && d === 'light') set(id, 'on', Object.assign({ brightness: (o.attributes.brightness || 204) }, data.brightness_pct ? { brightness: Math.round(data.brightness_pct * 2.55) } : {}, data.rgb_color ? { rgb_color: data.rgb_color, color_mode: 'hs' } : {}, data.effect ? { effect: data.effect } : {}));
        else if (svc === 'turn_off') set(id, 'off');
        else if (svc === 'turn_on' && d === 'climate') set(id, (o.attributes.hvac_modes || ['heat'])[1] || 'heat');
        else if (svc === 'set_temperature') set(id, o.state, { temperature: data.temperature });
        else if (svc === 'set_hvac_mode') set(id, data.hvac_mode);
        else if (svc === 'set_fan_mode') set(id, o.state, { fan_mode: data.fan_mode });
        else if (svc === 'set_swing_mode') set(id, o.state, { swing_mode: data.swing_mode });
        else if (svc === 'start') set(id, 'cleaning');
        else if (svc === 'pause') set(id, 'paused');
        else if (svc === 'return_to_base') set(id, 'returning');
      });
      h.states = Object.assign({}, S);
      if (onChange) onChange();
      return Promise.resolve();
    }
  };
  return h;
}
