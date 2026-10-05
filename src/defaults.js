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
