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

// Light Effect Card'ın renkli efekt simgeleri: panoda simge adı "lec:aurora" biçiminde yazılır.
// Panonun kendi kopyasından gelir (/lemur_home_dashboard/lec-icons.json, ad → SVG; kaynağı ../lemur-icons/efektler.json),
// Light Effect Card kurulu olmasa da görünür. İlk gereken yerde bir kez yüklenir.
// Yüklenince abone olan kart ve panel yeniden çizilir. LEC kaldırılırsa bu simgelerin yerinde boşluk kalır.
const LP_LECI = window.__LEMUR_HD_LECI || (window.__LEMUR_HD_LECI = { map: null, loading: null, subs: [] });
function lpLecIcons() {
  if (LP_LECI.map) return Promise.resolve(LP_LECI.map);
  if (!LP_LECI.loading) {
    LP_LECI.loading = fetch('/lemur_home_dashboard/lec-icons.json?v=' + PANEL_VERSION).then((r) => (r.ok ? r.json() : {})).catch(() => ({})).then((m) => {
      LP_LECI.map = m && typeof m === 'object' ? m : {};
      LP_LECI.subs.slice().forEach((f) => { try { f(); } catch (e) {} });
      return LP_LECI.map;
    });
  }
  return LP_LECI.loading;
}
function lpLecIconsSub(f) { LP_LECI.subs.push(f); return () => { LP_LECI.subs = LP_LECI.subs.filter((x) => x !== f); }; }
const lpIsLecIcon = (i) => typeof i === 'string' && i.indexOf('lec:') === 0;
// simge HTML'i: "lec:..." ise LEC'in renkli SVG'si, değilse panonun simge setinden (src/mdic.js). cls ve style isteğe bağlı.
// Set yüklenene kadar boş yer tutucu döner; yüklenince abone olan kart ve panel yeniden çizer.
function lpIcon(icon, cls, style) {
  const open = '<span class="lic' + (cls ? ' ' + cls : '');
  const tail = '"' + (style ? ' style="' + style + '"' : '') + '>';
  if (lpIsLecIcon(icon)) {
    if (!LP_LECI.map) lpLecIcons();
    const svg = LP_LECI.map && LP_LECI.map[icon.slice(4)];
    return open + tail + (svg || '') + '</span>';
  }
  if (lpIconFlat(icon)) return open + ' haic' + tail + '<ha-icon icon="' + esc(icon) + '"></ha-icon></span>';   // sette yok: HA'nın düz simgesi
  return open + ' mdic' + tail + (lpMdicSvg(icon || LP_MDIC_FALLBACK) || '') + '</span>';
}
