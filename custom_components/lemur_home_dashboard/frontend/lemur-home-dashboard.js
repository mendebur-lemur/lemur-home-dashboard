/*! Lemur Home Dashboard v0.0.1 | MIT */
(() => {
if (customElements.get('lemur-home-dashboard-card')) return;
const PANEL_VERSION = '0.0.1';
const CSS = ":host { display: block; color: var(--lp-text);\n--lp-box-bg: rgba(20, 24, 31, 0.55); --lp-box-border: rgba(255, 255, 255, 0.08); --lp-accent: #5B8DEF; --lp-on: #FDD835;\n--lp-heat: #FF8A3D; --lp-cool: #4FC3F7;\n--lp-tile-bg: var(--ha-card-background, var(--card-background-color, rgba(30, 33, 40, 0.9)));\n--lp-text: var(--primary-text-color, #ECEDEF); --lp-text2: var(--secondary-text-color, #9AA0A6); }\n.wrap { display: grid; grid-template-rows: auto 1fr; gap: 12px; padding: 12px; box-sizing: border-box;\nmin-height: var(--lp-h, calc(100vh - var(--header-height, 56px)));\n-webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }\n.nav { grid-area: h; display: flex; align-items: center; gap: 12px; min-width: 0; }\n.navb { flex: 0 1 235px; min-width: 0; height: 155px; border-radius: 15px; background: var(--lp-tile-bg); color: var(--lp-text); opacity: 0.85;\ndisplay: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-size: 18px;\n--mdc-icon-size: 64px; padding: 0 8px; box-sizing: border-box; overflow: hidden; transition: transform 0.12s; }\n.navb span { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.navb.sel { opacity: 1; box-shadow: inset 0 0 0 2px var(--lp-accent); }\n.clock { flex: 0 0 auto; margin-left: auto; margin-right: 40px; font-size: 56px; font-weight: 700; font-variant-numeric: tabular-nums; }\n.col { display: flex; flex-direction: column; gap: 12px; min-width: 0; min-height: 0; }\n.box { background: var(--lp-box-bg); border: 1px solid var(--lp-box-border); border-radius: 22px; padding: 12px; box-sizing: border-box;\ndisplay: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; }\n.box.empty { align-items: center; justify-content: center; color: var(--lp-text2); font-size: 18px; text-align: center; padding: 40px; }\n.title { text-align: center; font-weight: 700; font-size: 18px; padding: 6px 0 4px; letter-spacing: 0.3px; }\n.grid { display: grid; gap: 10px; flex: 1 1 auto; min-height: 0; }\n.tile { border-radius: 14px; background: var(--lp-tile-bg); border: 2px solid transparent; box-sizing: border-box; color: var(--lp-text);\ndisplay: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; cursor: pointer; padding: 6px;\n--mdc-icon-size: 44px; font-size: 14px; text-align: center; min-width: 0; overflow: hidden; transition: transform 0.12s; }\n.tile .nm { max-width: 100%; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.2; }\n.tile .br { font-size: 12px; color: var(--lp-text2); }\n.tile.on { border-color: var(--tile-rgb, var(--lp-on)); background: rgba(255, 255, 255, 0.05); }\n.tile.on ha-state-icon { color: var(--tile-rgb, var(--lp-on)); }\n.tile ha-state-icon { color: var(--lp-text2); }\n.na { opacity: 0.45; }\n.scene { flex: 0 0 118px; height: 118px; border-radius: 22px; background: var(--lp-tile-bg); color: var(--lp-text);\ndisplay: flex; align-items: center; gap: 16px; padding: 0 20px; box-sizing: border-box; font-size: 18px; cursor: pointer; --mdc-icon-size: 40px; transition: transform 0.12s; }\n.scene span { min-width: 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }\n.rows { display: flex; flex-direction: column; gap: 10px; }\n.row { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 18px; background: var(--lp-tile-bg); cursor: pointer;\n--mdc-icon-size: 36px; transition: transform 0.12s; }\n.row ha-state-icon { color: var(--lp-text2); flex: 0 0 auto; }\n.row.on ha-state-icon { color: var(--lp-accent); }\n.row.heat ha-state-icon { color: var(--lp-heat); }\n.row.cool ha-state-icon { color: var(--lp-cool); }\n.rt { min-width: 0; }\n.rn { font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.rs { font-size: 14px; color: var(--lp-text2); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.down { transform: scale(0.96); }";
// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', room_lights: '{area} IŞIKLARI', scenes: 'SENARYOLAR', shortcuts: 'KISAYOLLAR',
    control: 'EV KONTROL', other_control: 'DİĞER CİHAZLAR', media: 'MEDYA',
    empty: 'Bu sekmede gösterilecek cihaz yok. Yönetim panelinden ekleyebilirsin.',
    heat: 'Isıtıyor', cool: 'Soğutuyor', idle: 'Beklemede', off: 'Kapalı', on: 'Açık', playing: 'Çalıyor', paused: 'Duraklatıldı', unavailable: 'Ulaşılamıyor',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', room_lights: '{area} LIGHTS', scenes: 'SCENES', shortcuts: 'SHORTCUTS',
    control: 'CONTROLS', other_control: 'OTHER DEVICES', media: 'MEDIA',
    empty: 'Nothing to show on this tab yet. Add devices from the admin panel.',
    heat: 'Heating', cool: 'Cooling', idle: 'Idle', off: 'Off', on: 'On', playing: 'Playing', paused: 'Paused', unavailable: 'Unavailable',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Tabs, sections and sizes of the dashboard will be edited here. (Work in progress)',
    reset: 'Reset to defaults', save: 'Save', saved: 'Saved', not_loaded: 'The Lemur Home Dashboard integration is not loaded.' }
};
function pickLang(hass) {
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

// Ortak ayarlar: entegrasyondan okunur, değişince bütün açık ekranlara gelir.
const STORE = window.__LEMUR_HOME_DASHBOARD_STORE || (window.__LEMUR_HOME_DASHBOARD_STORE = {
  data: null, conn: null, subs: [], loading: null,
  load(hass) {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.conn = hass.connection;
    this.loading = this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/get' }).then((d) => {
      this.data = d;
      this.conn.subscribeMessage((msg) => { this.data = msg; this.subs.forEach((f) => f(msg)); }, { type: 'lemur_home_dashboard/subscribe' });
      return d;
    }).catch((e) => { this.loading = null; throw e; });
    return this.loading;
  },
  set(key, value) { return this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/set', key: key, value: value }); },
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});

// Ayar yokken evden varsayılan düzen üretir: ilk kurulumda tek satırla dolu bir pano gelsin diye.
// Kurallar:
// - İlk sekme "Ev": bütün evin özeti (en fazla 20 ışık, 6 senaryo, bütün klimalar, 2 medya).
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
    return !(e && (e.hidden || e.hidden_by || e.entity_category || e.disabled_by));
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
  const lights = [], controls = [], medias = [], scenes = [];
  Object.keys(S).forEach((id) => {
    if (!usable(id)) return;
    const d = dom(id);
    if (d === 'light') lights.push(id);
    else if (d === 'switch' && lightLikeSwitch(id)) lights.push(id);
    else if (d === 'climate') controls.push(id);
    else if (d === 'media_player') medias.push(id);
    else if (d === 'scene' || d === 'script') scenes.push(id);
  });

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
      { id: o.id + '-c', type: 'climate', title: o.controlTitle, col: 2, entities: o.controls },
      { id: o.id + '-m', type: 'media', col: 2, entities: o.medias }
    ];
    return { id: o.id, name: o.name, icon: o.icon, area: o.area || null, columns: ['56%', '17%', '25.5%'], sections: secs };
  };

  const tabs = [];
  const usedIds = { home: true, other: true };
  tabs.push(tab({
    id: 'home', name: t(lang, 'home'), icon: 'mdi:home-outline',
    lights: lightList.slice().sort(byArea).slice(0, 20),
    scenes: (globalScenes.length ? globalScenes : scenes.slice().sort(byName)).slice(0, 6),
    controls: controls.slice().sort(byArea).slice(0, 4),
    medias: medias.slice().sort(byArea).slice(0, 2),
    lightTitle: t(lang, 'lights'), sceneTitle: t(lang, 'scenes'), controlTitle: t(lang, 'control')
  }));

  const small = {};
  order.forEach((aid) => {
    const L = inArea(lightList, aid), C = inArea(controls, aid), M = inArea(medias, aid);
    if (!C.length && !M.length && L.length < 3) { small[aid] = true; return; }
    const sc = inArea(scenes, aid);
    const ar = areas[aid];
    const aname = ar.name || aid;
    let icon = ar.icon;
    if (!icon) { const hit = LP_AREA_ICONS.filter((p) => p[0].test(aname))[0]; icon = hit ? hit[1] : 'mdi:door'; }
    const id = usedIds[aid] ? 'a-' + aid : aid; usedIds[id] = true;
    tabs.push(tab({
      id: id, name: aname, icon: icon, area: aid,
      lights: L.slice(0, 25), scenes: (sc.length ? sc : globalScenes).slice(0, 6), controls: C.slice(0, 4), medias: M.slice(0, 3),
      lightTitle: t(lang, 'room_lights', { area: upper(lang, aname) }), sceneTitle: t(lang, 'shortcuts'), controlTitle: upper(lang, aname)
    }));
  });

  if (tabs.length > 1) {
    const rest = (id) => { const a = areaOf(id); return !a || small[a] || !areas[a]; };
    const L = lightList.filter(rest).sort(byArea);
    const C = controls.filter(rest).sort(byArea);
    const M = medias.filter(rest).sort(byArea);
    if (L.length || C.length || M.length) tabs.push(tab({
      id: 'other', name: t(lang, 'other'), icon: 'mdi:dots-horizontal-circle-outline',
      lights: L.slice(0, 25), scenes: globalScenes.slice(0, 6), controls: C.slice(0, 4), medias: M.slice(0, 3),
      lightTitle: t(lang, 'lights'), sceneTitle: t(lang, 'shortcuts'), controlTitle: t(lang, 'other_control')
    }));
  }
  return tabs.slice(0, 8);
}

// Kanvas ölçekleme. İçerik ÖLÇÜLMEZ; zoom sadece ekran boyutundan hesaplanır ve hui-root'a CSS kuralı olarak yazılır.
// Böylece görünüm ilk karede doğru boyutta gelir, sayfa değişince oynamaz. (Arkadaşın panosundaki tablet-olcek.js v8'in dersi.)
const LemurScale = (() => {
  const ID = 'lemur-home-dashboard-scale';
  function root() {
    try {
      const m = document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main').shadowRoot;
      const p = m.querySelector('ha-panel-lovelace');
      const r = p && p.shadowRoot && p.shadowRoot.querySelector('hui-root');
      return (r && r.shadowRoot) ? r : null;
    } catch (e) { return null; }
  }
  function apply(canvas) {
    const r = root(); if (!r) return;
    const sr = r.shadowRoot;
    const raw = r.lovelace && r.lovelace.rawConfig;
    const active = !!sr.querySelector('lemur-home-dashboard-card') || !!(raw && raw.strategy && raw.strategy.type === 'custom:lemur-home-dashboard');
    let st = sr.getElementById(ID);
    if (!active) { if (st) st.textContent = ''; return; }
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
    const css = 'hui-view{zoom:' + z + ';width:' + gen + 'px !important;max-width:' + gen + 'px !important;margin:0 auto;flex:0 0 auto !important;min-height:0 !important;height:auto !important;--lp-h:' + lh + 'px;}';
    if (!st) { st = document.createElement('style'); st.id = ID; sr.appendChild(st); }
    if (st.textContent !== css) st.textContent = css;
  }
  let canvas = null;
  const run = () => apply(canvas);
  window.addEventListener('resize', run);
  window.addEventListener('location-changed', () => { run(); setTimeout(run, 0); setTimeout(run, 100); });
  setInterval(run, 1000);
  return { set(c) { canvas = c; run(); }, run: run };
})();

// Pano stratejisi: `strategy: { type: custom:lemur-home-dashboard }` yazılan pano bu sınıfla üretilir.
// HA kuralı: custom:lemur-home-dashboard → <ll-strategy-dashboard-lemur-home-dashboard>, static generate(config, hass).
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
    LemurScale.set(settings.canvas || null);
    return {
      views: tabs.map((tab) => ({
        title: tab.name,
        path: tab.id,
        icon: tab.icon,
        type: 'panel',
        theme: settings.theme_name || undefined,
        cards: [{ type: 'custom:lemur-home-dashboard-card', tab: tab.id }]
      }))
    };
  }
}

// lemur-home-dashboard-card: bir sekmeyi baştan sona çizer (üst şerit + kolonlar).
// Şimdilik: oda düğmeleri + saat, ışık karoları (dokun = aç/kapat, basılı tut = HA'nın cihaz penceresi),
// senaryo düğmeleri, iklim ve medya için geçici satırlar (dokun = cihaz penceresi). Asıl iklim/medya kartları ve
// kendi ışık penceremiz 3. adımda gelecek. Eski Safari (iOS 12) için ?. ve ?? yok, pointer event yok (touch + mouse).
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
const lpFr = (v) => (/%$/.test(String(v)) ? parseFloat(v) + 'fr' : String(v));

class LemurHomeDashboardCard extends HTMLElement {
  setConfig(config) { this._config = config || {}; if (this._hass) this._render(); }
  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) { STORE.load(h).then(() => this._render()).catch(() => this._render()); return; }
    const w = this._watched;
    if (!w) return;
    for (let i = 0; i < w.length; i++) if (h.states[w[i]] !== this._last[w[i]]) { this._render(); return; }
  }
  connectedCallback() {
    if (!this._unsub) this._unsub = STORE.onChange(() => { this._def = null; this._render(); });
    if (!this._clock) this._clock = setInterval(() => this._tick(), 15000);
    if (this._hass && this.shadowRoot) this._render();
  }
  disconnectedCallback() {
    if (this._unsub) { this._unsub(); this._unsub = null; }
    clearInterval(this._clock); this._clock = null;
  }

  _tabs() {
    const d = STORE.data;
    if (d && d.tabs && d.tabs.length) return d.tabs;
    if (!this._def) this._def = buildDefaultTabs(this._hass, pickLang(this._hass));
    return this._def;
  }
  _tick() { const c = this.shadowRoot && this.shadowRoot.querySelector('.clock'); if (c) c.textContent = this._time(); }
  _time() { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  // --- bölüm içerikleri: boşsa '' döner, bölüm hiç çizilmez ---
  _lights(s, watched) {
    const S = this._hass.states;
    const ids = (s.entities || []).filter((id) => S[id]);
    if (!ids.length) return '';
    const c = s.tile_columns || 5, rows = Math.max(4, Math.ceil(ids.length / c));
    return '<div class="grid" style="grid-template-columns:repeat(' + c + ',minmax(0,1fr));grid-template-rows:repeat(' + rows + ',minmax(84px,1fr))">' +
      ids.map((id) => {
        watched.push(id);
        const st = S[id], a = st.attributes, on = st.state === 'on', na = st.state === 'unavailable';
        const rgb = on && a.rgb_color ? 'rgb(' + a.rgb_color.join(',') + ')' : '';
        const br = on && typeof a.brightness === 'number' ? Math.round(a.brightness / 2.55) + '%' : '';
        return '<div class="tile' + (on ? ' on' : '') + (na ? ' na' : '') + '" data-light="' + esc(id) + '"' + (rgb ? ' style="--tile-rgb:' + rgb + '"' : '') + '>' +
          '<ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon><div class="nm">' + esc(a.friendly_name || id) + '</div>' +
          (br ? '<div class="br">' + br + '</div>' : '') + '</div>';
      }).join('') + '</div>';
  }
  _scenes(s) {
    const items = s.items || [];
    if (!items.length) return '';
    return items.map((it, i) => '<div class="scene" data-scene="' + esc(s.id) + ':' + i + '"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || 'var(--lp-accent)') + '"></ha-icon><span>' + esc(it.name) + '</span></div>').join('');
  }
  _rows(s, watched, lang) {
    const S = this._hass.states;
    const ids = (s.entities || []).filter((id) => S[id]);
    if (!ids.length) return '';
    return '<div class="rows">' + ids.map((id) => {
      watched.push(id);
      const st = S[id], a = st.attributes;
      let txt = '', cls = '';
      if (st.state === 'unavailable') { txt = t(lang, 'unavailable'); cls = ' na'; }
      else if (id.indexOf('climate.') === 0) {
        const act = a.hvac_action;
        const parts = [];
        if (typeof a.current_temperature === 'number') parts.push(a.current_temperature + '°' + (st.state !== 'off' && typeof a.temperature === 'number' ? ' → ' + a.temperature + '°' : ''));
        if (st.state === 'off') { parts.push(t(lang, 'off')); }
        else if (act === 'heating') { parts.push(t(lang, 'heat')); cls = ' heat'; }
        else if (act === 'cooling') { parts.push(t(lang, 'cool')); cls = ' cool'; }
        else { parts.push(t(lang, 'idle')); cls = ' on'; }
        txt = parts.join(' · ');
      } else {
        if (st.state === 'playing') { txt = a.media_title ? a.media_title + (a.media_artist ? ' · ' + a.media_artist : '') : t(lang, 'playing'); cls = ' on'; }
        else txt = TXT[lang][st.state] ? t(lang, st.state) : st.state;
      }
      return '<div class="row' + cls + '" data-more="' + esc(id) + '"><ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon>' +
        '<div class="rt"><div class="rn">' + esc(a.friendly_name || id) + '</div><div class="rs">' + esc(txt) + '</div></div></div>';
    }).join('') + '</div>';
  }

  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const h = this._hass, S = h.states, lang = pickLang(h);
    const tabs = this._tabs();
    const tab = tabs.filter((x) => x.id === (this._config && this._config.tab))[0] || tabs[0];
    if (!tab) { this.shadowRoot.innerHTML = ''; return; }
    const watched = [];

    // kolonlara dağıt; başlıksız bölüm aynı kolondaki önceki kutunun içine girer (ör. iklimin altında medya)
    const widths = tab.columns || ['56%', '17%', '25.5%'];
    const cols = widths.map(() => []);
    (tab.sections || []).forEach((s) => {
      const ci = Math.max(0, Math.min(cols.length - 1, s.col || 0));
      let body = '';
      if (s.type === 'lights') body = this._lights(s, watched);
      else if (s.type === 'scenes') body = this._scenes(s);
      else if (s.type === 'climate' || s.type === 'media') body = this._rows(s, watched, lang);
      if (!body) return;
      const boxes = cols[ci];
      if (!s.title && boxes.length) boxes[boxes.length - 1].body += body;
      else boxes.push({ title: s.title || (s.type === 'media' ? t(lang, 'media') : ''), body: body });
    });
    const used = [];
    cols.forEach((b, i) => { if (b.length) used.push(i); });

    const nav = '<div class="nav">' + tabs.map((x) => '<div class="navb' + (x.id === tab.id ? ' sel' : '') + '" data-nav="' + esc(x.id) + '"><ha-icon icon="' + esc(x.icon || 'mdi:home') + '"></ha-icon><span>' + esc(x.name) + '</span></div>').join('') +
      '<div class="clock">' + this._time() + '</div></div>';
    let grid, body;
    if (used.length) {
      grid = 'grid-template-columns:' + used.map((i) => lpFr(widths[i])).join(' ') + ';grid-template-areas:\'' + used.map(() => 'h').join(' ') + '\' \'' + used.map((i) => 'c' + i).join(' ') + '\'';
      body = used.map((i) => '<div class="col" style="grid-area:c' + i + '">' + cols[i].map((b) =>
        '<div class="box">' + (b.title ? '<div class="title">' + esc(b.title) + '</div>' : '') + b.body + '</div>').join('') + '</div>').join('');
    } else {
      grid = 'grid-template-columns:1fr;grid-template-areas:\'h\' \'c0\'';
      body = '<div class="col" style="grid-area:c0"><div class="box empty">' + esc(t(lang, 'empty')) + '</div></div>';
    }
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style><div class="wrap" style="' + grid + '">' + nav + body + '</div>';

    this._watched = watched; this._last = {};
    watched.forEach((id) => { this._last[id] = S[id]; });
    const R = this.shadowRoot;
    R.querySelectorAll('ha-state-icon[data-eid]').forEach((e) => { e.hass = h; e.stateObj = S[e.getAttribute('data-eid')]; });
    R.querySelectorAll('[data-nav]').forEach((b) => lpPress(b, () => {
      const id = b.getAttribute('data-nav');
      if (id === tab.id) return;
      const base = location.pathname.split('/').slice(0, 2).join('/');
      history.pushState(null, '', base + '/' + id);
      lpFire(window, 'location-changed', { replace: false });
    }));
    const more = (id) => lpFire(this, 'hass-more-info', { entityId: id });
    R.querySelectorAll('[data-light]').forEach((b) => {
      const id = b.getAttribute('data-light');
      lpPress(b, () => h.callService('homeassistant', 'toggle', { entity_id: id }), () => more(id));
    });
    R.querySelectorAll('[data-more]').forEach((b) => lpPress(b, () => more(b.getAttribute('data-more'))));
    R.querySelectorAll('[data-scene]').forEach((b) => lpPress(b, () => {
      const p = b.getAttribute('data-scene').split(':');
      const s = (tab.sections || []).filter((x) => x.id === p[0])[0];
      const it = s && s.items && s.items[+p[1]];
      if (!it || !it.action || !it.action.service) return;
      const sv = it.action.service.split('.');
      h.callService(sv[0], sv[1], it.action.target ? { entity_id: it.action.target } : (it.action.data || {}));
    }));
  }
}

// lemur-home-dashboard-admin: sol menüdeki yönetim paneli. TASLAK: şimdilik ayarları gösterir, varsayılana dönebilir.
// Hedef: Light Effect Card'ın kontrol paneli düzeninde sekme/bölüm/cihaz/boyut düzenleme, sürükle-bırak, canlı önizleme.
class LemurHomeDashboardAdmin extends HTMLElement {
  set hass(h) { const first = !this._hass; this._hass = h; if (first) STORE.load(h).then(() => this._render()).catch(() => this._render()); }
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panel = p; }
  _render() {
    const lang = pickLang(this._hass);
    const d = STORE.data;
    this.innerHTML = '<div style="padding:24px;max-width:960px;font-family:var(--primary-font-family, sans-serif);color:var(--primary-text-color)">' +
      '<h1 style="margin:0 0 8px">' + t(lang, 'admin_title') + '</h1><p>' + t(lang, 'admin_intro') + '</p>' +
      (d ? '<button id="reset">' + t(lang, 'reset') + '</button><pre style="white-space:pre-wrap;font-size:12px;opacity:.8">' + esc(JSON.stringify(d, null, 2)) + '</pre>' : '<p>' + t(lang, 'not_loaded') + '</p>') + '</div>';
    const r = this.querySelector('#reset');
    if (r) r.addEventListener('click', () => STORE.set('tabs', []).then(() => this._render()));
  }
}

customElements.define('ll-strategy-dashboard-lemur-home-dashboard', LemurHomeDashboardStrategy);
customElements.define('lemur-home-dashboard-card', LemurHomeDashboardCard);
customElements.define('lemur-home-dashboard-admin', LemurHomeDashboardAdmin);
console.info('%c LEMUR HOME DASHBOARD %c v' + PANEL_VERSION + ' ', 'background:#5B8DEF;color:#0B1020;font-weight:700', 'background:#1E2024;color:#ECEDEF');
})();
