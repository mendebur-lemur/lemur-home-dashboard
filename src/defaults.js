// Ayar yokken evden varsayılan düzen üretir: ilk kurulumda tek satırla dolu bir pano gelsin diye.
// Kurallar:
// - İlk sekme "Ev": bütün evin özeti (en fazla 20 ışık, 6 senaryo, iklim cihazları, süpürgeler, 2 medya).
// - İklim cihazına aynı alandaki sıcaklık/nem sensörü eşlenir (cihazın kendi sensörü değilse); kart konforu ondan hesaplar.
// - Her alan bir sekme (kat sırasına göre, sonra HA'daki alan sırası). Klima/medya yoksa ve 3'ten az ışık varsa küçük oda sayılır,
//   ayrı sekme açılmaz (koridor, banyo gibi yerler üst şeridi kalabalıklaştırmasın).
// - Küçük odaların ve alana atanmamış cihazların hepsi sondaki "Diğer" sekmesinde (en az bir oda sekmesi açıldıysa).
// - Işık grubu varsa üyeleri ayrıca gösterilmez (aynı sekmede iki kez görünmesin).
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

  // tüm varlıkları bir kez gez, türüne göre ayır
  const lights = [], controls = [], medias = [], scenes = [], vacuums = [], temps = [], hums = [];
  Object.keys(S).forEach((id) => {
    if (!usable(id)) return;
    const d = dom(id);
    if (d === 'light') lights.push(id);
    else if (d === 'switch' && lightLikeSwitch(id)) lights.push(id);
    else if (d === 'climate') controls.push(id);
    else if (d === 'media_player') medias.push(id);
    else if (d === 'scene' || d === 'script') scenes.push(id);
    else if (d === 'vacuum') vacuums.push(id);
    else if (d === 'sensor' && attr(id).device_class === 'temperature') temps.push(id);
    else if (d === 'sensor' && attr(id).device_class === 'humidity') hums.push(id);
  });
  const devOf = (id) => (ents[id] && ents[id].device_id) || null;
  // klimaya aynı alandaki harici sensör (klimanın kendi cihazındaki sensör değil)
  const climateItem = (id) => {
    const o = { entity: id }, a = areaOf(id);
    if (!a) return o;
    const pickS = (list) => list.filter((x) => areaOf(x) === a && devOf(x) !== devOf(id) && !isNaN(parseFloat(S[x].state))).sort((x, y) => String(name(x)).localeCompare(String(name(y))))[0];
    const ts = pickS(temps), hs = pickS(hums);
    if (ts) o.temperature_sensor = ts;
    if (hs) o.humidity_sensor = hs;
    return o;
  };

  // ışık grubu: üyeleri listeden çıkar
  const members = {};
  lights.forEach((id) => { const m = attr(id).entity_id; if (dom(id) === 'light' && Array.isArray(m)) m.forEach((x) => { if (x !== id) members[x] = true; }); });
  const lightList = lights.filter((id) => !members[id]);

  const byName = (a, b) => String(name(a)).localeCompare(String(name(b)), lang);
  const inArea = (list, aid) => list.filter((id) => areaOf(id) === aid).sort(byName);

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
    const secs = [
      { id: o.id + '-l', type: 'lights', title: o.lightTitle, col: 0, entities: o.lights, tile_columns: 5 },
      { id: o.id + '-s', type: 'scenes', title: o.sceneTitle, col: 1, items: o.scenes.map(sceneItem) },
      { id: o.id + '-c', type: 'climate', title: o.controlTitle, col: 2, entities: o.controls.map(climateItem) },
      { id: o.id + '-v', type: 'vacuum', col: 2, entities: o.vacuums || [] },
      { id: o.id + '-m', type: 'media', col: 2, entities: o.medias }
    ];
    return { id: o.id, name: o.name, icon: o.icon, area: o.area || null, columns: [56, 17, 25.5], sections: secs };
  };

  const tabs = [];
  const usedIds = { home: true, other: true };
  tabs.push(tab({
    id: 'home', name: t(lang, 'home'), icon: 'mdi:home-outline',
    lights: lightList.slice().sort(byArea).slice(0, 20),
    scenes: (globalScenes.length ? globalScenes : scenes.slice().sort(byName)).slice(0, 6),
    controls: controls.slice().sort(byArea).slice(0, 4),
    vacuums: vacuums.slice().sort(byArea).slice(0, 3),
    medias: medias.slice().sort(byArea).slice(0, 2),
    lightTitle: t(lang, 'lights'), sceneTitle: t(lang, 'scenes'), controlTitle: t(lang, 'control')
  }));

  const small = {};
  order.forEach((aid) => {
    const L = inArea(lightList, aid), C = inArea(controls, aid), M = inArea(medias, aid), V = inArea(vacuums, aid);
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
