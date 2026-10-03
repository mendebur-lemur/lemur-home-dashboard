// Ayar yokken evden varsayılan düzen üretir (ilk kurulumda tek satırla dolu panel gelsin diye).
// TASLAK: alanlar → sekmeler; alandaki ışık ve anahtarlar → ışık bölümü; script/sahne → senaryolar; climate → kontrol; media_player → medya.
function buildDefaultTabs(hass, lang) {
  const S = hass.states;
  const ents = hass.entities || {};   // entity registry özeti (area_id, device_id)
  const devs = hass.devices || {};
  const areas = hass.areas || {};
  const areaOf = (id) => { const e = ents[id]; if (!e) return null; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return d ? d.area_id : null; };
  const hidden = (id) => { const e = ents[id]; return !!(e && (e.hidden || e.entity_category)); };
  const pick = (domains, area) => Object.keys(S).filter((id) => domains.indexOf(id.split('.')[0]) >= 0 && !hidden(id) && (area === undefined || areaOf(id) === area));
  const scenes = pick(['script', 'scene']).slice(0, 6).map((id) => ({ name: (S[id].attributes.friendly_name || id), icon: S[id].attributes.icon || 'mdi:play',
    action: { service: id.split('.')[0] === 'script' ? 'script.turn_on' : 'scene.turn_on', target: id } }));
  const tab = (id, name, icon, area) => ({ id: id, name: name, icon: icon, area: area, columns: ['56%', '17%', '25.5%'], sections: [
    { id: id + '-l', type: 'lights', title: t(lang, 'lights'), col: 0, entities: pick(['light', 'switch'], area).slice(0, 20), tile_columns: 5 },
    { id: id + '-s', type: 'scenes', title: t(lang, 'scenes'), col: 1, items: scenes },
    { id: id + '-c', type: 'climate', title: t(lang, 'control'), col: 2, entities: pick(['climate'], area).slice(0, 3) },
    { id: id + '-m', type: 'media', col: 2, entities: pick(['media_player'], area).slice(0, 2) }
  ] });
  const tabs = [tab('ev', t(lang, 'home'), 'mdi:home-outline', undefined)];
  Object.keys(areas).forEach((aid) => {
    if (pick(['light', 'climate', 'media_player'], aid).length) tabs.push(tab(aid, areas[aid].name, areas[aid].icon || 'mdi:door', aid));
  });
  return tabs.slice(0, 6);
}
