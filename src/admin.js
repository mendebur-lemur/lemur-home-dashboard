// lemur-home-dashboard-admin: sol menüdeki yönetim paneli.
// Düzen Light Effect Card'ın kontrol paneliyle aynı aile: üstte sekme şeridi (seçili sekmenin ayarları altında birleşik),
// solda panonun canlı önizlemesi (tıklayınca bölüm seçilir), sağda bölüm düzenleyici. Her değişiklik anında kaydedilir,
// açık bütün tabletler canlı güncellenir; "Geri al" (Ctrl+Z) son değişiklikleri geri alır.
// Ayar yokken pano otomatik düzendedir; ilk değişiklikte o düzen kopyalanıp kaydedilir.

const ADM = {
  tr: {
    title: 'Lemur Home Dashboard', auto: 'Otomatik düzen', autoT: 'Pano şu an evin alanlarından kendiliğinden kuruluyor. İlk değişiklikte bu düzen kaydedilir, sonra her şey buradan düzenlenir.',
    undo: 'Geri al', undoK: 'Geri al (Ctrl+Z)', settings: 'Ayarlar', more: 'Diğer işlemler', saved: 'Kaydedildi', undone: 'Geri alındı', err: 'Kaydedilemedi: {e}',
    tabName: 'Sekme adı', icon: 'Simge', area: 'Alan', noArea: 'Alan yok', cols: 'Kolonlar', colAdd: 'Kolon ekle', colDel: 'Son kolonu kaldır', colTab: 'Tablet düzeni', colEq: 'Eşit', colHint: 'Genişliği önizlemede kolonların arasındaki çizgiyi sürükleyerek ayarla.', delTab: 'Sekmeyi sil', sure: 'Emin misin?',
    refill: 'Alandan yeniden doldur', refillT: 'Bu sekmenin bölümleri seçili alanın cihazlarıyla baştan kurulur.', addTab: 'Sekme', newTab: 'Yeni sekme', emptyTab: 'Boş sekme', fromArea: 'Alandan sekme',
    preview: 'Önizleme', pvHint: 'Kutuyu ⠿ tutamağından, öğeyi kendisinden sürükle · çizgilerden boyutlandır', splits: 'Kolon içi sütun', splitsT: 'Bir kolonu eşit genişlikte 2-3 sütuna böler (ör. yan yana iki senaryo bölümü). Kolon dar ise yer açmak için kendiliğinden genişler.', splitNarrow: 'Bu kadar sütun ekrana sığmaz: önce kolon sayısını azalt', sub: 'Sütun', sections: 'Bölümler', addSec: 'Bölüm ekle', noSec: 'Bu sekmede bölüm yok.',
    secTitle: 'Başlık', column: 'Kolon', colL: 'Sol', colM: 'Orta', colR: 'Sağ', tileCols: 'Satırdaki karo', delSec: 'Bölümü sil',
    t_lights: 'Işıklar', t_scenes: 'Senaryolar', t_climate: 'İklim', t_vacuum: 'Süpürge', t_media: 'Medya',
    d_lights: 'Işık, priz, perde karoları', d_scenes: 'Script, sahne ve otomasyon düğmeleri', d_climate: 'Klima ve petek kartları (Yaz/Kış)', d_vacuum: 'Robot süpürge kartları', d_media: 'TV ve hoparlörler',
    n_items: '{n} öğe', addDev: 'Cihaz ekle', addPh: 'Boş yuva', addScene: 'Düğme ekle', name: 'Ad', target: 'Çalıştırılacak', noItems: 'Henüz öğe yok.',
    tSensor: 'Sıcaklık sensörü', hSensor: 'Nem sensörü', fromDevice: 'Cihazdan', noOutdoor: 'Dış sıcaklık yok', noLink: 'Birlikte kontrol yok', linkT: 'Birlikte kontrol edilen cihaz (ör. aynı odadaki ikinci petek)', outdoorT: 'Dış sıcaklık sensörü (petek kartı ısıtma ihtiyacını gösterir)', addScPh: 'Boş düğme', kind: 'Tür', k_auto: 'Otomatik', k_ac: 'Klima', k_radiator: 'Petek',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Geniş 16:9', scr_here: 'Bu ekran',
    pickT: 'Cihaz ekle', search: 'Ara: ad, alan ya da varlık kimliği', cancel: 'Vazgeç', addN: 'Ekle ({n})', added: 'Ekli', noArea2: 'Alanı olmayanlar', nothing: 'Eşleşen cihaz yok.',
    s_board: 'Pano', s_look: 'Görünüm', s_screen: 'Ekran', s_info: 'Bilgi',
    lang: 'Dil', lAuto: 'Otomatik', season: 'Mevsim', seasonT: 'İklim bölümünde Yaz klimaları, Kış petekleri gösterir. Otomatik: Mayıs-Eylül yaz.', sAuto: 'Otomatik', sSum: 'Yaz', sWin: 'Kış',
    bg: 'Arka plan', bgT: 'Koyu: tablet panosundaki zemin. Resim için adres yaz (ör. /local/zemin.jpg).', bgDark: 'Koyu', bgImg: 'Resim', bgUrl: 'Resim adresi',
    theme: 'HA teması', themeT: 'Boş bırakılabilir; açılır pencereler bu temayla gelir.', kHeader: 'Üst barı gizle', kHeaderT: 'Bu panoda HA\'nın başlık çubuğu görünmez.',
    kSide: 'Yan menüyü gizle', kSideT: 'Bu panoda HA\'nın sol menüsü görünmez.', canvas: 'Kanvas', canvasT: 'Tasarım genişliği ve referans yüksekliği (px). Pano ekrana bu oranla ölçeklenir.',
    version: 'Sürüm', lec: 'Lemur Light Effect Card', lecOn: 'Kurulu ({v}). Senaryolara efekt ekranı ve efekt düğmeleri eklenebilir.', lecOff: 'Kurulu değil. Işık efektleri için isteğe bağlı olarak kurulabilir; kurulunca efekt düğmeleri burada açılır.', lecHold: 'Basılı tutunca efekt ekranı', lecHoldT: 'Işık karosuna basılı tutunca HA penceresi yerine efekt ekranı lambanın odasıyla açılır', lecOpen: 'Efekt ekranı', lecStop: 'Efekti durdur', lecGroup: 'Işık efektleri · {r}', lecLoading: 'Efektler yükleniyor…', tOpen: 'Efekt ekranı · {r}', tPlay: 'Efekt: {e} · {r}', tStop: 'Efekti durdur · {r}', roomByTab: 'sekmenin odası', lecNa: 'Lemur Light Effect Card kurulu değil: bu düğme panoda görünmez',
    resetAll: 'Otomatik düzene dön', resetQ: 'Bütün sekme ve bölümler silinir, pano yeniden evin alanlarından kurulur. Ayarlar kalır.', resetOk: 'Otomatik düzene dönüldü',
    close: 'Kapat', notLoaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.', editNote: 'Not: Bu panoda HA\'nın kendi düzenleyicisinde "kontrolü al" dersen pano bu panelden kopar.'
  },
  en: {
    title: 'Lemur Home Dashboard', auto: 'Automatic layout', autoT: 'The dashboard is currently built from your areas. Your first change saves this layout, then everything is edited here.',
    undo: 'Undo', undoK: 'Undo (Ctrl+Z)', settings: 'Settings', more: 'More', saved: 'Saved', undone: 'Undone', err: 'Could not save: {e}',
    tabName: 'Tab name', icon: 'Icon', area: 'Area', noArea: 'No area', cols: 'Columns', colAdd: 'Add column', colDel: 'Remove last column', colTab: 'Tablet layout', colEq: 'Equal', colHint: 'Set widths by dragging the line between columns in the preview.', delTab: 'Delete tab', sure: 'Sure?',
    refill: 'Refill from area', refillT: 'Rebuilds this tab\'s sections from the devices of the chosen area.', addTab: 'Tab', newTab: 'New tab', emptyTab: 'Empty tab', fromArea: 'Tab from area',
    preview: 'Preview', pvHint: 'Drag boxes by their ⠿ handle, items by themselves · drag lines to resize', splits: 'Columns inside', splitsT: 'Splits a column into 2-3 equal sub-columns (e.g. two scene sections side by side).', splitNarrow: 'This many sub-columns will not fit: use fewer columns first', sub: 'Sub-column', sections: 'Sections', addSec: 'Add section', noSec: 'This tab has no sections.',
    secTitle: 'Title', column: 'Column', colL: 'Left', colM: 'Middle', colR: 'Right', tileCols: 'Tiles per row', delSec: 'Delete section',
    t_lights: 'Lights', t_scenes: 'Scenes', t_climate: 'Climate', t_vacuum: 'Vacuum', t_media: 'Media',
    d_lights: 'Light, plug and cover tiles', d_scenes: 'Script, scene and automation buttons', d_climate: 'Air conditioner and radiator cards (summer/winter)', d_vacuum: 'Robot vacuum cards', d_media: 'TVs and speakers',
    n_items: '{n} items', addDev: 'Add device', addPh: 'Empty slot', addScene: 'Add button', name: 'Name', target: 'Runs', noItems: 'No items yet.',
    tSensor: 'Temperature sensor', hSensor: 'Humidity sensor', fromDevice: 'From device', noOutdoor: 'No outdoor temperature', noLink: 'No linked device', linkT: 'Device controlled together (e.g. a second radiator in the same room)', outdoorT: 'Outdoor temperature sensor (radiator card shows heating demand)', addScPh: 'Empty button', kind: 'Type', k_auto: 'Automatic', k_ac: 'Air conditioner', k_radiator: 'Radiator',
    scr_tab16: 'Tablet 16:10', scr_tab43: 'Tablet 4:3', scr_wide: 'Wide 16:9', scr_here: 'This screen',
    pickT: 'Add device', search: 'Search: name, area or entity id', cancel: 'Cancel', addN: 'Add ({n})', added: 'Added', noArea2: 'No area', nothing: 'No matching device.',
    s_board: 'Dashboard', s_look: 'Appearance', s_screen: 'Screen', s_info: 'About',
    lang: 'Language', lAuto: 'Automatic', season: 'Season', seasonT: 'The climate section shows air conditioners in summer, radiators in winter. Automatic: May-September is summer.', sAuto: 'Automatic', sSum: 'Summer', sWin: 'Winter',
    bg: 'Background', bgT: 'Dark: the background of the tablet dashboard. For an image, enter its address (e.g. /local/background.jpg).', bgDark: 'Dark', bgImg: 'Image', bgUrl: 'Image address',
    theme: 'HA theme', themeT: 'Optional; dialogs open with this theme.', kHeader: 'Hide the top bar', kHeaderT: 'Home Assistant\'s header is hidden on this dashboard.',
    kSide: 'Hide the sidebar', kSideT: 'Home Assistant\'s sidebar is hidden on this dashboard.', canvas: 'Canvas', canvasT: 'Design width and reference height (px). The dashboard scales to the screen with this ratio.',
    version: 'Version', lec: 'Lemur Light Effect Card', lecOn: 'Installed ({v}). Effect screen and effect buttons can be added to scene sections.', lecOff: 'Not installed. Optional, for light effects; effect buttons turn on here once it is installed.', lecHold: 'Hold for effect screen', lecHoldT: 'Holding a light tile opens the effect screen for that light\'s room instead of the HA dialog', lecOpen: 'Effect screen', lecStop: 'Stop effect', lecGroup: 'Light effects · {r}', lecLoading: 'Loading effects…', tOpen: 'Effect screen · {r}', tPlay: 'Effect: {e} · {r}', tStop: 'Stop effect · {r}', roomByTab: 'the tab\'s room', lecNa: 'Lemur Light Effect Card is not installed: this button is hidden on the dashboard',
    resetAll: 'Back to automatic layout', resetQ: 'Every tab and section is deleted and the dashboard is rebuilt from your areas. Settings stay.', resetOk: 'Back to automatic layout',
    close: 'Close', notLoaded: 'The Lemur Home Dashboard integration is not loaded.', editNote: 'Note: if you "take control" of this dashboard in Home Assistant\'s own editor, it disconnects from this panel.'
  }
};
const LHD_TYPES = {
  lights: { icon: 'mdi:lightbulb-group-outline', domains: ['light', 'switch', 'cover', 'fan', 'input_boolean'], col: 0 },
  scenes: { icon: 'mdi:gesture-tap-button', domains: ['script', 'scene', 'automation'], col: 1 },
  climate: { icon: 'mdi:thermostat', domains: ['climate'], col: 2 },
  vacuum: { icon: 'mdi:robot-vacuum', domains: ['vacuum'], col: 2 },
  media: { icon: 'mdi:television', domains: ['media_player'], col: 2 }
};
// Önizleme ekranları: pano gerçekte ekranın oranına göre ölçeklenir (scale.js); önizleme seçilen ekranı aynı hesapla taklit eder.
const LHD_SCREENS = [['tab16', 1600, 1000], ['tab43', 1024, 768], ['wide', 1920, 1080], ['here', 0, 0]];
const LHD_MAXCOLS = 6;
const LHD_COLORS = ['#5B8DEF', '#8E7CFF', '#4FD1C5', '#FF6FAE', '#6BC46B', '#E5484D', '#F2B33D', '#FFB86B'];
const lhdClone = (x) => JSON.parse(JSON.stringify(x));
// Kolon içi sütun en az bu kadar geniş olabilir (kanvas pikseli): kutunun 40 px iç boşluğu + bir karo
const LHD_MINSUB = 150;
const lhdColPx = (T, i, cw) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); return (cw - 8 - 20 * w.length) * w[i] / sum; };
const lhdMaxSplit = (T, i, cw) => Math.max(1, Math.min(3, Math.floor(lhdColPx(T, i, cw) / LHD_MINSUB + 0.02)));
// sütun sayısı seçilebilir mi: diğer kolonlar en dar hallerine inse bile bu kolon k sütuna yetecek kadar genişleyebiliyor mu
const lhdCanSplit = (T, i, k, cw) => { const n = lpWeights(T).length, sp = lpSplits(T, n); let need = LHD_MINSUB * k; for (let j = 0; j < n; j++) if (j !== i) need += LHD_MINSUB * sp[j]; return need <= cw - 8 - 20 * n; };
// Kolon en az LHD_MINSUB × sütun sayısı geniş kalsın: dar kalanlar o genişliğe çekilir, fark geniş kolonlardan oranla alınır
function lhdFitCols(T, cw) {
  const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0), avail = cw - 8 - 20 * n, sp = lpSplits(T, n);
  const minF = sp.map((k) => Math.min(1 / n, LHD_MINSUB * k / avail));
  let fr = w.map((x) => x / sum);
  for (let it = 0; it < n; it++) {
    const fixed = fr.map((f, i) => f < minF[i] - 1e-9);
    if (!fixed.some(Boolean)) break;
    const fs = fr.reduce((a, f, i) => a + (fixed[i] ? minF[i] : 0), 0), rs = fr.reduce((a, f, i) => a + (fixed[i] ? 0 : f), 0);
    fr = fr.map((f, i) => (fixed[i] ? minF[i] : f * (1 - fs) / rs));
  }
  T.columns = fr.map((f) => Math.round(f * sum * 100) / 100);
}
// kolonlar değişince sığmayan sütunları azalt; o sütundaki bölümler kalan son sütuna geçer
function lhdFitSplits(T, cw) {
  if (!T.splits) return;
  const n = lpWeights(T).length, sp = lpSplits(T, n);
  for (let i = 0; i < n; i++) {
    const mx = lhdMaxSplit(T, i, cw);
    if (sp[i] > mx) { sp[i] = mx; (T.sections || []).forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > mx - 1) { if (mx > 1) s.sub = mx - 1; else delete s.sub; } }); }
  }
  T.splits = sp;
}
let lhdSeq = 0;
const lhdId = (p) => p + Date.now().toString(36) + (lhdSeq++).toString(36);
const lhdSlug = (x) => String(x || '').replace(/İ/g, 'i').toLowerCase().replace(/[çćč]/g, 'c').replace(/ğ/g, 'g').replace(/[ıîí]/g, 'i').replace(/[öô]/g, 'o').replace(/ş/g, 's').replace(/[üû]/g, 'u')
  .replace(/[âáà]/g, 'a').replace(/[éè]/g, 'e').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
const lhdMove = (arr, from, to) => { const x = arr.splice(from, 1)[0]; arr.splice(to, 0, x); };

class LemurHomeDashboardAdmin extends HTMLElement {
  constructor() {
    super();
    this._tab = null; this._sec = null; this._undo = []; this._modal = null; this._menu = null; this._q = ''; this._picked = [];
    this._ask = null;
  }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (first) {
      LEC.load(h);
      if (!this._lecUnsub) this._lecUnsub = LEC.onChange((k) => { if (k === 'playing') return; if (this._modal === 'pick') this._refreshPick(); else if (STORE.data && this.shadowRoot && !this._modal) this._render(); });
      STORE.load(h).then(() => {
        this._sub();
        this._render();
      }).catch(() => this._render());
      return;
    }
    if (this._pv) this._pv.hass = h;
  }
  // ayar değişince yeniden çiz; kendi kaydımızın ve sunucu yankısının aynısı gelirse çizme (odak ve tıklama kaybolmasın)
  _sub() {
    if (this._unsub) return;
    this._unsub = STORE.onChange((d) => {
      const j = JSON.stringify(d);
      if (j === this._lastJson) return;
      this._lastJson = j;
      if (!this._modal) this._render();
    });
  }
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panelCfg = p; }
  connectedCallback() {
    if (!this._key) {
      this._key = (e) => {
        const typing = e.composedPath && e.composedPath()[0] && /INPUT|SELECT|TEXTAREA/.test(e.composedPath()[0].tagName || '');
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && this._undo.length) { e.preventDefault(); this._undoIt(); }
        if (e.key === 'Escape' && (this._modal || this._menu)) { this._modal = null; this._menu = null; this._render(); }
      };
    }
    window.addEventListener('keydown', this._key);
    if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => this._fit());
    if (this._hass && STORE.data) { this._sub(); this._render(); }
  }
  disconnectedCallback() {
    window.removeEventListener('keydown', this._key);
    if (this._unsub) { this._unsub(); this._unsub = null; }
    if (this._lecUnsub) { this._lecUnsub(); this._lecUnsub = null; }
    if (this._ro) this._ro.disconnect();
  }

  get _lang() { return pickLang(this._hass); }
  _t(k, v) {
    const d = ADM[this._lang] || ADM.en;
    let s = d[k] !== undefined ? d[k] : (ADM.en[k] !== undefined ? ADM.en[k] : k);
    if (v) Object.keys(v).forEach((x) => { s = s.split('{' + x + '}').join(v[x]); });
    return s;
  }
  _settings() { return (STORE.data && STORE.data.settings) || {}; }
  _cw() { return (this._settings().canvas || {}).width || 1280; }
  _isAuto() { const d = STORE.data; return !(d && d.tabs && d.tabs.length); }
  _work() { const d = STORE.data; return lhdClone(d && d.tabs && d.tabs.length ? d.tabs : buildDefaultTabs(this._hass, this._lang)); }
  _area(id) { const a = this._hass.areas && this._hass.areas[id]; return a ? a.name : ''; }
  _ename(id) { const s = this._hass.states[id]; return (s && s.attributes.friendly_name) || id; }

  // ---- kayıt: önce ekranda, sonra entegrasyona; her değişiklik geri alınabilir ----
  _commit(key, value) {
    STORE.data = Object.assign({}, STORE.data); STORE.data[key] = value;
    const d = STORE.data;
    this._lastJson = JSON.stringify(d);   // kendi değişikliğimiz: abonelikten gelince yeniden çizme
    STORE.subs.forEach((f) => { try { f(d); } catch (e) {} });
    return STORE.set(key, value).catch((e) => this._toast(this._t('err', { e: (e && e.message) || e }), false));
  }
  _snap() {
    this._undo.push({ tabs: lhdClone((STORE.data && STORE.data.tabs) || []), settings: lhdClone(this._settings()) });
    if (this._undo.length > 40) this._undo.shift();
  }
  _undoIt() {
    const u = this._undo.pop(); if (!u) return;
    // sadece değişen anahtar gönderilir (ikisi birden gönderilince ara yankı geri alınanı bir an geri getiriyordu)
    if (JSON.stringify(u.settings) !== JSON.stringify(this._settings())) this._commit('settings', u.settings);
    if (JSON.stringify(u.tabs) !== JSON.stringify((STORE.data && STORE.data.tabs) || [])) this._commit('tabs', u.tabs);
    this._render();
    this._toast(this._t('undone'), false);
  }
  // soft: yazı alanından gelen değişiklik; panel yeniden çizilmez (odak ve hemen ardından gelen tıklama kaybolmasın), önizleme kendisi güncellenir
  _edit(fn, msg, soft) {
    this._snap();
    const tabs = this._work();
    fn(tabs);
    this._commit('tabs', tabs);
    if (!soft) this._render(); else this._undoBtn();
    this._toast(msg || this._t('saved'));
  }
  _setting(path, value, soft) {
    this._snap();
    const s = lhdClone(this._settings());
    const p = path.split('.');
    let o = s;
    for (let i = 0; i < p.length - 1; i++) { if (!o[p[i]] || typeof o[p[i]] !== 'object') o[p[i]] = {}; o = o[p[i]]; }
    if (value === undefined || value === null || value === '') delete o[p[p.length - 1]]; else o[p[p.length - 1]] = value;
    this._commit('settings', s);
    if (!soft) this._render(); else this._undoBtn();   // ayarlar penceresi açıkken de güncel görünsün
    this._toast(this._t('saved'));
  }
  // yazı alanından gelen kayıtta panel yeniden çizilmez; geri al düğmesi yine de açılsın (ilk değişiklikte kapalı kalıyordu)
  _undoBtn() { const u = this.shadowRoot && this.shadowRoot.querySelector('[data-a="undo"]'); if (u) u.disabled = !this._undo.length; }
  _toast(x, undo) {
    const el = this.shadowRoot && this.shadowRoot.querySelector('.toast'); if (!el) return;
    el.querySelector('span').textContent = x;
    el.querySelector('button').hidden = undo === false || !this._undo.length;
    el.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => el.classList.remove('show'), 4200);
  }

  // ---- seçili sekme ve bölüm ----
  _curTab(tabs) {
    let t = tabs.filter((x) => x.id === this._tab)[0];
    if (!t) { t = tabs[0]; this._tab = t ? t.id : null; }
    return t;
  }
  _curSec(tab) {
    if (!tab) return null;
    const s = (tab.sections || []).filter((x) => x.id === this._sec)[0];
    if (!s) this._sec = null;
    return s || null;
  }

  // ---- çizim ----
  _render() {
    if (!this._hass) return;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const R = this.shadowRoot;
    if (!STORE.data) { R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app"><div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + esc(this._t('title')) + '</h1></div><div class="warn">' + esc(this._t('notLoaded')) + '</div></div>'; return; }
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab);
    const t = (k, v) => esc(this._t(k, v));
    const narrow = (this.clientWidth || window.innerWidth) < 980;
    this._narrowNow = narrow;

    const top = '<div class="top"><div class="lg"><ha-icon icon="mdi:tablet-dashboard"></ha-icon></div><h1>' + t('title') + '</h1>' +
      (this._isAuto() ? '<span class="badge" title="' + t('autoT') + '">' + t('auto') + '</span>' : '') + '<div class="grow"></div>' +
      '<button class="btn ic" data-a="undo" title="' + t('undoK') + '"' + (this._undo.length ? '' : ' disabled') + '><ha-icon class="s16" icon="mdi:undo"></ha-icon></button>' +
      '<button class="btn" data-a="settings"><ha-icon class="s16" icon="mdi:cog-outline"></ha-icon>' + t('settings') + '</button>' +
      '<button class="btn ic" data-a="more" title="' + t('more') + '"><ha-icon class="s16" icon="mdi:dots-horizontal"></ha-icon></button></div>';

    const rooms = '<div class="rooms" data-dl="tabs" data-dir="x">' + tabs.map((x) => '<div class="rb' + (x.id === this._tab ? ' on' : '') + '" data-di data-tab="' + esc(x.id) + '" data-handle><ha-icon icon="' + esc(x.icon || 'mdi:door') + '"></ha-icon>' + esc(x.name) + '</div>').join('') +
      '<div class="rb add" data-a="addtab"><ha-icon class="s18" icon="mdi:plus"></ha-icon>' + t('addTab') + '</div></div>';
    const areaOpts = '<option value="">' + t('noArea') + '</option>' + Object.keys(this._hass.areas || {}).map((a) => '<option value="' + esc(a) + '"' + (tab && tab.area === a ? ' selected' : '') + '>' + esc(this._area(a)) + '</option>').join('');
    const W = tab ? lpWeights(tab) : LP_DEFAULT_COLS, wsum = W.reduce((a, b) => a + b, 0), SP = lpSplits(tab, W.length);
    const rpanel = tab ? '<div class="rpanel' + (tabs[0] && tabs[0].id === tab.id ? ' first' : '') + '">' +
      '<div class="fld" style="flex:1 1 180px"><label>' + t('tabName') + '</label><input class="inp" data-f="tab.name" value="' + esc(tab.name || '') + '"></div>' +
      '<div class="fld" style="flex:1 1 200px"><label>' + t('icon') + '</label><div class="iconin"><div class="pv"><ha-icon icon="' + esc(tab.icon || 'mdi:door') + '"></ha-icon></div><input class="inp" data-f="tab.icon" value="' + esc(tab.icon || '') + '" placeholder="mdi:sofa-outline"></div></div>' +
      '<div class="fld" style="flex:1 1 160px"><label>' + t('area') + '</label><select class="inp" data-f="tab.area">' + areaOpts + '</select></div>' +
      '<div class="fld"><label title="' + t('colHint') + '">' + t('cols') + ' · ' + W.map((x) => Math.round(x / wsum * 100)).join(' / ') + '</label><div class="acts">' +
        '<button class="btn sm ic" data-a="coldel" title="' + t('colDel') + '"' + (W.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:minus"></ha-icon></button>' +
        '<span class="btn sm" style="pointer-events:none;min-width:38px">' + W.length + '</span>' +
        '<button class="btn sm ic" data-a="coladd" title="' + t('colAdd') + '"' + (W.length >= LHD_MAXCOLS ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:plus"></ha-icon></button>' +
        (W.length === 3 ? '<button class="btn sm" data-a="coltab">' + t('colTab') + '</button>' : '') + '<button class="btn sm" data-a="coleq">' + t('colEq') + '</button></div></div>' +
      '<div class="fld"><label title="' + t('splitsT') + '">' + t('splits') + '</label><div class="acts">' + SP.map((v, i) => '<div class="seg"><button disabled style="opacity:.6">' + esc(this._colName(i, W.length)) + '</button>' + [1, 2, 3].map((n) => '<button data-split="' + i + ':' + n + '"' + (v === n ? ' class="on"' : (!lhdCanSplit(tab, i, n, this._cw()) ? ' disabled title="' + esc(t('splitNarrow')) + '"' : '')) + '>' + n + '</button>').join('') + '</div>').join('') + '</div></div>' +
      (tab.area ? '<button class="btn sm" data-a="refill" title="' + t('refillT') + '"><ha-icon class="s16" icon="mdi:auto-fix"></ha-icon>' + t('refill') + '</button>' : '') +
      '<button class="btn sm dan' + (this._ask === 'deltab' ? ' ask' : '') + '" data-a="deltab"' + (tabs.length < 2 ? ' disabled' : '') + '><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'deltab' ? t('sure') : t('delTab')) + '</button></div>' : '';

    const ncols = W.length;
    const colName = (s) => this._colName(Math.min(s.col || 0, ncols - 1), ncols) + (SP[Math.min(s.col || 0, ncols - 1)] > 1 ? ' · ' + (Math.min(s.sub || 0, SP[Math.min(s.col || 0, ncols - 1)] - 1) + 1) : '');
    const count = (s) => (s.type === 'scenes' ? (s.items || []).length : (s.entities || []).length);
    const secList = tab && (tab.sections || []).length ? '<div class="sl" data-dl="secs">' + tab.sections.map((s) => '<div class="si' + (s.id === this._sec ? ' on' : '') + '" data-di data-sec="' + esc(s.id) + '">' +
      '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span><div class="ti"><ha-icon icon="' + esc((LHD_TYPES[s.type] || {}).icon || 'mdi:shape') + '"></ha-icon></div>' +
      '<div class="nm"><b>' + esc(s.title || this._t('t_' + s.type)) + '</b><span>' + t('t_' + s.type) + ' · ' + t('n_items', { n: count(s) }) + '</span></div><span class="cb">' + colName(s) + '</span></div>').join('') + '</div>'
      : '<div class="empty">' + t('noSec') + '</div>';

    const ins = '<div class="ins"><div class="sc">' +
      '<h3>' + t('sections') + '<span class="grow"></span><button class="btn sm" data-a="addsec"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addSec') + '</button></h3>' + secList +
      (sec ? this._secEditor(tab, sec, ncols) : '') +
      (this._isAuto() ? '<div class="hint">' + t('autoT') + '</div>' : '') + '<div class="hint">' + t('editNote') + '</div></div></div>';

    const scr = this._screenKey();
    const pv = '<div class="pvw"><div class="pvh"><ha-icon class="s16" icon="mdi:eye-outline"></ha-icon><b>' + t('preview') + '</b><span>· ' + t('pvHint') + '</span><span class="grow"></span>' +
      '<div class="seg">' + LHD_SCREENS.map((x) => '<button data-scr="' + x[0] + '"' + (x[0] === scr ? ' class="on"' : '') + '>' + t('scr_' + x[0]) + '</button>').join('') + '</div></div><div class="pvbox"><div class="pvc"></div></div></div>';

    // yeniden çizimde odaktaki alan ve imleç korunur
    const act = R.activeElement, keyOf = (el) => { if (!el || !el.getAttribute) return null; const n = ['data-f', 'data-if', 'data-sf', 'data-q', 'data-bgurl'].filter((k) => el.hasAttribute(k))[0]; return n ? '[' + n + (el.getAttribute(n) ? '="' + el.getAttribute(n) + '"' : '') + ']' : null; };
    const focusKey = keyOf(act), selS = act && act.selectionStart, selE = act && act.selectionEnd;
    R.innerHTML = '<style>' + ADMIN_CSS + '</style><div class="app' + (narrow ? ' narrowv' : '') + '">' + top +
      '<div class="rblock">' + rooms + rpanel + '</div><div class="main">' + pv + ins + '</div>' +
      this._menuHtml() + this._modalHtml(tabs, tab, sec) +
      '<div class="toast"><span></span><button data-a="undo">' + t('undo') + '</button></div></div>';

    this._mountPreview(tab, sec);
    this._bind(tabs, tab, sec);
    if (focusKey) { const el = R.querySelector(focusKey); if (el && el.focus) { el.focus(); try { if (selS !== null && selS !== undefined) el.setSelectionRange(selS, selE); } catch (x) {} } }
  }

  _secEditor(tab, s, ncols) {
    const t = (k, v) => esc(this._t(k, v));
    const S = this._hass.states;
    const ci = Math.min(s.col || 0, ncols - 1), nsub = lpSplits(tab, ncols)[ci];
    const subSeg = nsub > 1 ? '<div class="fld" style="flex:0 0 auto"><label>' + t('sub') + '</label><div class="seg">' + Array.apply(null, Array(nsub)).map((x, j) => '<button data-ssub="' + j + '"' + (Math.min(s.sub || 0, nsub - 1) === j ? ' class="on"' : '') + '>' + (j + 1) + '</button>').join('') + '</div></div>' : '';
    const colSeg = '<div class="seg">' + Array.apply(null, Array(ncols)).map((x, c) => '<button data-scol="' + c + '"' + (Math.min(s.col || 0, ncols - 1) === c ? ' class="on"' : '') + '>' + esc(this._colName(c, ncols)) + '</button>').join('') + '</div>';
    let body = '';
    const handle = '<span class="hd" data-handle><ha-icon class="s16" icon="mdi:drag-vertical"></ha-icon></span>';
    const xBtn = (i) => '<button class="x" data-del="' + i + '" title="×"><ha-icon class="s16" icon="mdi:close"></ha-icon></button>';
    if (s.type === 'scenes') {
      const items = s.items || [];
      body = items.length ? '<div class="items" data-dl="items">' + items.map((it, i) => '<div class="it" data-di>' + handle +
        '<input type="color" data-if="' + i + '.color" value="' + esc(it.color || '#5B8DEF') + '">' +
        '<div class="ico"><ha-icon icon="' + esc(it.icon || 'mdi:play') + '" style="color:' + esc(it.color || '#5B8DEF') + '"></ha-icon></div>' +
        '<div class="col"><input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + t('name') + '">' +
        '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(it.icon || '') + '" placeholder="mdi:play" style="height:28px;font-size:12px">' +
        '</div><span class="eid">' + this._scTarget(tab, it) + '</span></div>' + xBtn(i) + '</div>').join('') + '</div>'
        : '<div class="empty">' + t('noItems') + '</div>';
      body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addScene') + '</button>' +
        '<button class="btn sm dash" data-a="addscph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addScPh') + '</button>' +
        (LEC.installed(this._hass) ? '<button class="btn sm" data-a="addlec"><ha-icon class="s16" icon="mdi:creation"></ha-icon>' + t('lecOpen') + '</button>' : '') + '</div>';
    } else {
      const items = (s.entities || []).map((x) => (typeof x === 'string' ? { entity: x } : x));
      const temps = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'temperature');
      const hums = Object.keys(S).filter((id) => id.indexOf('sensor.') === 0 && S[id].attributes.device_class === 'humidity');
      const sel = (i, key, list, cur) => '<select class="inp" data-if="' + i + '.' + key + '"><option value="">' + t('fromDevice') + '</option>' +
        list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
      body = items.length ? '<div class="items" data-dl="items">' + items.map((it, i) => {
        const st = it.entity ? S[it.entity] : null;
        const ico = it.entity ? (it.icon ? '<ha-icon icon="' + esc(it.icon) + '"></ha-icon>' : '<ha-state-icon data-eid="' + esc(it.entity) + '"></ha-state-icon>') : '<ha-icon icon="' + esc(it.icon || 'mdi:lightbulb') + '"></ha-icon>';
        let extra = '';
        if (s.type === 'lights') extra = '<div class="sub"><input class="inp" data-if="' + i + '.icon" value="' + esc(it.icon || '') + '" placeholder="' + t('icon') + ' (mdi:...)" style="height:28px;font-size:12px"></div>';
        const sel2 = (key, list, cur, none, title) => '<select class="inp" data-if="' + i + '.' + key + '" title="' + esc(title) + '"><option value="">' + esc(none) + '</option>' +
          list.map((id) => '<option value="' + esc(id) + '"' + (cur === id ? ' selected' : '') + '>' + esc(this._ename(id)) + '</option>').join('') + '</select>';
        const climates = Object.keys(S).filter((id) => id.indexOf('climate.') === 0 && id !== it.entity);
        if (s.type === 'climate') extra = '<div class="sub">' + sel(i, 'temperature_sensor', temps, it.temperature_sensor) + sel(i, 'humidity_sensor', hums, it.humidity_sensor) + '</div>' +
          '<div class="sub">' + sel2('outdoor_sensor', temps, it.outdoor_sensor, this._t('noOutdoor'), this._t('outdoorT')) + sel2('link', climates, (it.entities || [])[0], this._t('noLink'), this._t('linkT')) + '</div>' +
          '<div class="sub"><select class="inp" data-if="' + i + '.kind">' + ['auto', 'ac', 'radiator'].map((k) => '<option value="' + k + '"' + ((it.kind || 'auto') === k ? ' selected' : '') + '>' + t('k_' + k) + '</option>').join('') + '</select></div>';
        return '<div class="it' + (it.entity ? '' : ' ph') + '" data-di>' + handle + '<div class="ico">' + ico + '</div><div class="col">' +
          '<input class="inp" data-if="' + i + '.name" value="' + esc(it.name || '') + '" placeholder="' + esc(it.entity ? this._ename(it.entity) : this._t('name')) + '">' + extra +
          '<span class="eid">' + esc(it.entity ? it.entity + (st ? '' : ' · ?') : this._t('addPh')) + '</span></div>' + xBtn(i) + '</div>';
      }).join('') + '</div>' : '<div class="empty">' + t('noItems') + '</div>';
      body += '<div class="acts"><button class="btn sm" data-a="pick"><ha-icon class="s16" icon="mdi:plus"></ha-icon>' + t('addDev') + '</button>' +
        (s.type === 'lights' ? '<button class="btn sm dash" data-a="addph"><ha-icon class="s16" icon="mdi:square-rounded-outline"></ha-icon>' + t('addPh') + '</button>' : '') + '</div>';
    }
    return '<div class="ed"><div class="row2"><div class="fld"><label>' + t('secTitle') + '</label><input class="inp" data-f="sec.title" value="' + esc(s.title || '') + '" placeholder="' + t('t_' + s.type) + '"></div>' +
      '<div class="fld" style="flex:0 0 auto"><label>' + t('column') + '</label>' + colSeg + '</div>' + subSeg + '</div>' +
      (s.type === 'lights' ? '<div class="fld"><label>' + t('tileCols') + '</label><div class="seg">' + [2, 3, 4, 5, 6].map((n) => '<button data-tc="' + n + '"' + ((s.tile_columns || 5) === n ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div></div>' : '') +
      body + '<div class="acts"><span class="grow"></span><button class="btn sm dan' + (this._ask === 'delsec' ? ' ask' : '') + '" data-a="delsec"><ha-icon class="s16" icon="mdi:trash-can-outline"></ha-icon>' + (this._ask === 'delsec' ? t('sure') : t('delSec')) + '</button></div></div>';
  }

  _menuHtml() {
    const m = this._menu; if (!m) return '';
    const t = (k) => esc(this._t(k));
    let inner = '';
    if (m.kind === 'more') inner = '<button class="dan" data-a="reset"><ha-icon class="s16" icon="mdi:restore"></ha-icon>' + t('resetAll') + '</button>';
    if (m.kind === 'addtab') {
      const used = {}; this._work().forEach((x) => { if (x.area) used[x.area] = 1; });
      const areas = Object.keys(this._hass.areas || {}).filter((a) => !used[a]);
      inner = '<button data-newtab=""><ha-icon class="s16" icon="mdi:tab-plus"></ha-icon>' + t('emptyTab') + '</button>' +
        (areas.length ? '<hr><div class="mh">' + t('fromArea') + '</div>' + areas.map((a) => '<button data-newtab="' + esc(a) + '"><ha-icon class="s16" icon="' + esc((this._hass.areas[a].icon) || 'mdi:door') + '"></ha-icon>' + esc(this._area(a)) + '</button>').join('') : '');
    }
    if (m.kind === 'addsec') inner = Object.keys(LHD_TYPES).map((k) => '<button data-newsec="' + k + '"><ha-icon class="s16" icon="' + LHD_TYPES[k].icon + '"></ha-icon><span><b>' + t('t_' + k) + '</b><br><span class="mu" style="font-size:12px">' + t('d_' + k) + '</span></span></button>').join('');
    return '<div class="menu" style="left:' + m.x + 'px;top:' + m.y + 'px;max-height:' + Math.max(200, window.innerHeight - m.y - 20) + 'px;overflow:auto">' + inner + '</div>';
  }

  _modalHtml(tabs, tab, sec) {
    const md = this._modal; if (!md) return '';
    const t = (k, v) => esc(this._t(k, v));
    if (md === 'pick' && sec) {
      return '<div class="ov" data-ovl><div class="dlg"><div class="dh"><div class="di"><ha-icon icon="' + LHD_TYPES[sec.type].icon + '"></ha-icon></div><h2>' + t('pickT') + ' → ' + esc(sec.title || this._t('t_' + sec.type)) + '</h2>' +
        '<button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div>' +
        '<div class="db" style="padding-bottom:4px;flex:none;overflow:visible"><input class="inp" data-q placeholder="' + t('search') + '" value="' + esc(this._q) + '"></div>' +
        '<div class="db"><div class="plist">' + this._pickList(sec) + '</div></div>' +
        '<div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="pickadd"' + (this._picked.length ? '' : ' disabled') + '>' + t('addN', { n: this._picked.length }) + '</button></div></div></div>';
    }
    if (md === 'settings') {
      const s = this._settings();
      const seg = (path, cur, opts) => '<div class="seg">' + opts.map((o) => '<button data-set="' + path + '" data-val="' + esc(o[0]) + '"' + (cur === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</div>';
      const tg = (path, on) => '<button class="tg' + (on ? ' on' : '') + '" data-tg="' + path + '"></button>';
      const k = s.kiosk || {}, cv = s.canvas || {};
      const bgImg = typeof s.background === 'string' && /url\(/.test(s.background);
      const bgUrl = bgImg ? (s.background.match(/url\(['"]?([^'")]+)/) || [])[1] || '' : '';
      const lec = !!(this._hass.config && (this._hass.config.components || []).indexOf('lemur_light_effects') >= 0);
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di"><ha-icon icon="mdi:cog-outline"></ha-icon></div><h2>' + t('settings') + '</h2><button class="btn ic" data-a="close"><ha-icon class="s16" icon="mdi:close"></ha-icon></button></div><div class="db">' +
        '<div class="sh">' + t('s_board') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lang') + '</b></div>' + seg('language', s.language || 'auto', [['auto', this._t('lAuto')], ['tr', 'Türkçe'], ['en', 'English']]) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('season') + '</b><span>' + t('seasonT') + '</span></div>' + seg('season', s.season || 'auto', [['auto', this._t('sAuto')], ['summer', this._t('sSum')], ['winter', this._t('sWin')]]) + '</div>' +
        '<div class="sh">' + t('s_look') + '</div>' +
        '<div class="srow" style="flex-wrap:wrap"><div class="t"><b>' + t('bg') + '</b><span>' + t('bgT') + '</span></div>' + seg('bgmode', bgImg ? 'img' : 'dark', [['dark', this._t('bgDark')], ['img', this._t('bgImg')]]) +
        (bgImg ? '<input class="inp w" data-bgurl value="' + esc(bgUrl) + '" placeholder="/local/zemin.jpg" style="width:100%">' : '') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('theme') + '</b><span>' + t('themeT') + '</span></div><input class="inp w" data-sf="theme_name" value="' + esc(s.theme_name || '') + '" placeholder="ios-dark-mode-blue-red"></div>' +
        '<div class="sh">' + t('s_screen') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kHeader') + '</b><span>' + t('kHeaderT') + '</span></div>' + tg('kiosk.hide_header', !!k.hide_header) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('kSide') + '</b><span>' + t('kSideT') + '</span></div>' + tg('kiosk.hide_sidebar', !!k.hide_sidebar) + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('canvas') + '</b><span>' + t('canvasT') + '</span></div><input class="inp" type="number" min="800" max="3000" data-sf="canvas.width" value="' + esc(cv.width || 1280) + '" style="width:90px"><input class="inp" type="number" min="500" max="2500" data-sf="canvas.ref_height" value="' + esc(cv.ref_height || 1075) + '" style="width:90px"></div>' +
        '<div class="sh">' + t('s_info') + '</div>' +
        '<div class="srow"><div class="t"><b>' + t('lec') + '</b><span>' + (lec ? t('lecOn', { v: LEC.version || '?' }) : t('lecOff')) + '</span></div></div>' +
        (lec ? '<div class="srow"><div class="t"><b>' + t('lecHold') + '</b><span>' + t('lecHoldT') + '</span></div>' + tg('lec_hold', !!s.lec_hold) + '</div>' : '') +
        '<div class="srow"><div class="t"><b>' + t('version') + '</b><span>' + esc(PANEL_VERSION) + '</span></div></div>' +
        '</div><div class="df"><button class="btn" data-a="close">' + t('close') + '</button></div></div></div>';
    }
    if (md === 'reset') {
      return '<div class="ov" data-ovl><div class="dlg sm"><div class="dh"><div class="di" style="color:var(--red)"><ha-icon icon="mdi:restore"></ha-icon></div><h2>' + t('resetAll') + '</h2></div>' +
        '<div class="db"><div>' + t('resetQ') + '</div></div><div class="df"><button class="btn" data-a="close">' + t('cancel') + '</button><button class="btn pri" data-a="resetgo" style="background:var(--red);border-color:var(--red);color:#fff">' + t('resetAll') + '</button></div></div></div>';
    }
    return '';
  }

  // cihaz seçici listesi: bölümün türüne uyan cihazlar, alana göre gruplu, aramayla süzülür
  _pickList(sec) {
    const S = this._hass.states, ents = this._hass.entities || {}, devs = this._hass.devices || {};
    const doms = LHD_TYPES[sec.type].domains;
    const have = {};
    if (sec.type === 'scenes') (sec.items || []).forEach((x) => {
      if (x.action && x.action.target) have[x.action.target] = 1;
      const k = lpLecKind(x), d = (x.action && x.action.data) || {};
      if (k === 'play') have['lec:' + d.room + ':' + d.effect] = 1;
      if (k === 'stop') have['lecstop:' + d.room] = 1;
    });
    else (sec.entities || []).forEach((x) => { const id = typeof x === 'string' ? x : x.entity; if (id) have[id] = 1; });
    const areaOf = (id) => { const e = ents[id]; if (!e) return ''; if (e.area_id) return e.area_id; const d = e.device_id && devs[e.device_id]; return (d && d.area_id) || ''; };
    const q = this._q.toLowerCase().trim();
    const ids = Object.keys(S).filter((id) => doms.indexOf(id.split('.')[0]) >= 0 && !(ents[id] && (ents[id].hidden || ents[id].entity_category)))
      .filter((id) => !q || (this._ename(id) + ' ' + id + ' ' + this._area(areaOf(id))).toLowerCase().indexOf(q) >= 0);
    const lecHtml = this._lecGroups(sec, have, q);
    if (!ids.length) return lecHtml || '<div class="empty">' + esc(this._t('nothing')) + '</div>';
    const groups = {};
    ids.forEach((id) => { const a = areaOf(id); (groups[a] = groups[a] || []).push(id); });
    // sekmenin alanı en üstte (oda sekmesine cihaz eklerken önce o odanınkiler görünsün)
    const ct = this._curTab(this._work()), ta = ct && ct.area;
    const order = (ta && groups[ta] ? [ta] : []).concat(Object.keys(this._hass.areas || {}).filter((a) => groups[a] && a !== ta)).concat(groups[''] ? [''] : []);
    return order.map((a) => '<div class="pg">' + esc(a ? this._area(a) : this._t('noArea2')) + '</div>' + groups[a].sort((x, y) => this._ename(x).localeCompare(this._ename(y))).map((id) => {
      const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
      return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
        '<div class="ico"><ha-state-icon data-eid="' + esc(id) + '"></ha-state-icon></div><div class="t"><b>' + esc(this._ename(id)) + '</b><span>' + esc(id) + '</span></div>' +
        '<span class="st">' + esc(dis ? this._t('added') : (this._hass.formatEntityState ? this._hass.formatEntityState(S[id]) : S[id].state)) + '</span></div>';
    }).join('')).join('') + lecHtml;
  }

  // senaryo düğmesinin ne yaptığı (düzenleyicideki alt yazı)
  _scTarget(tab, it) {
    const T = (k, v) => esc(this._t(k, v)), k = lpLecKind(it), a = it.action || {};
    const rn = (r) => (r ? (LEC.names[r] || this._area(r) || r) : this._t('roomByTab'));
    let txt;
    if (k === 'open') txt = T('tOpen', { r: rn(a.room || tab.area) });
    else if (k === 'play') txt = T('tPlay', { e: (a.data && a.data.effect) || '?', r: rn(a.data && a.data.room) });
    else if (k === 'stop') txt = T('tStop', { r: rn(a.data && a.data.room) });
    else txt = T('target') + ': ' + esc(a.target ? this._ename(a.target) : '—');
    if (k && !LEC.installed(this._hass)) txt += ' · <b class="lecna">' + T('lecNa') + '</b>';
    return txt;
  }
  _refreshPick() {
    const pl = this.shadowRoot && this.shadowRoot.querySelector('.plist'); if (!pl) return;
    const tabs = this._work(), tab = this._curTab(tabs), sec = this._curSec(tab); if (!sec) return;
    pl.innerHTML = this._pickList(sec);
    pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; });
  }
  // senaryo seçicide LEC efektleri: sekmenin odası (oda yoksa bütün LEC odaları); önce "durdur", sonra favoriler, sonra hepsi
  _lecGroups(sec, have, q) {
    if (sec.type !== 'scenes' || !LEC.installed(this._hass) || !LEC.rooms) return '';
    const tab = this._curTab(this._work());
    const rooms = LEC.hasRoom(tab && tab.area) ? [tab.area] : Object.keys(LEC.rooms);
    return rooms.map((r) => {
      const name = LEC.names[r] || this._area(r) || r;
      const list = LEC.effects[r];
      if (!list) { LEC.query(this._hass, r); return '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div><div class="empty">' + esc(this._t('lecLoading')) + '</div>'; }
      const fav = (LEC.favorites || []).map((x) => String(x).toLowerCase());
      const sorted = list.slice().sort((a, b) => ((fav.indexOf(String(a).toLowerCase()) < 0) - (fav.indexOf(String(b).toLowerCase()) < 0)) || String(a).localeCompare(String(b)));
      const row = (id, icon, title, sub) => {
        if (q && (title + ' ' + sub).toLowerCase().indexOf(q) < 0) return '';
        const on = this._picked.indexOf(id) >= 0, dis = !!have[id];
        return '<div class="pi' + (on ? ' on' : '') + (dis ? ' dis' : '') + '" data-pk="' + esc(id) + '"><span class="ck">' + (on || dis ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '') + '</span>' +
          '<div class="ico"><ha-icon icon="' + icon + '"></ha-icon></div><div class="t"><b>' + esc(title) + '</b><span>' + esc(sub) + '</span></div>' +
          '<span class="st">' + esc(dis ? this._t('added') : '') + '</span></div>';
      };
      const body = row('lecstop:' + r, 'mdi:stop-circle-outline', this._t('lecStop'), name) +
        sorted.map((e) => row('lec:' + r + ':' + e, fav.indexOf(String(e).toLowerCase()) >= 0 ? 'mdi:star' : 'mdi:creation', e, name)).join('');
      return body ? '<div class="pg">' + esc(this._t('lecGroup', { r: name })) + '</div>' + body : '';
    }).join('');
  }

  _colName(c, n) {
    if (n === 2) return [this._t('colL'), this._t('colR')][c] || String(c + 1);
    if (n === 3) return [this._t('colL'), this._t('colM'), this._t('colR')][c] || String(c + 1);
    return String(c + 1);
  }

  // ---- önizleme: panonun kendi kartı, düzenleme modunda, tasarım boyutunda çizilip kutuya sığdırılır ----
  _mountPreview(tab, sec) {
    const box = this.shadowRoot.querySelector('.pvc'); if (!box || !tab) return;
    if (!this._pv) {
      this._pv = document.createElement('lemur-home-dashboard-card');
      this._pv.addEventListener('lhd-select', (e) => { this._sec = e.detail.section; this._ask = null; this._render(); });
      this._pv.addEventListener('lhd-tab', (e) => { this._tab = e.detail.tab; this._sec = null; this._ask = null; this._render(); });
      // önizlemede sürükle-bırak ya da boyutlandırma: kart yeni sekme ayarını verir, burada kaydedilir (geri alınabilir)
      this._pv.addEventListener('lhd-addsec', (e) => {
        // tıklama olayı panele ulaştıktan sonra aç (yoksa "dışarı tıklandı" sayılıp hemen kapanır)
        const d = e.detail; setTimeout(() => { const rr = this.shadowRoot.querySelector('.app').getBoundingClientRect(); this._menu = { kind: 'addsec', x: Math.max(8, Math.min(d.x - rr.left, rr.width - 280)), y: Math.min(d.y - rr.top + 8, rr.height - 320), target: { col: d.col, sub: d.sub } }; this._render(); }, 0);
      });
      this._pv.addEventListener('lhd-change', (e) => { const nt = e.detail.tab; this._edit((T) => { const i = T.map((x) => x.id).indexOf(nt.id); if (i >= 0) { lhdFitSplits(nt, this._cw()); T[i] = nt; } }); });
    }
    const cfg = { type: 'custom:lemur-home-dashboard-card', tab: tab.id, edit: true, selected: sec ? sec.id : '' };
    if (!this._pvCfg || JSON.stringify(this._pvCfg) !== JSON.stringify(cfg)) { this._pvCfg = cfg; this._pv.setConfig(cfg); }
    box.appendChild(this._pv);
    this._pv.hass = this._hass;
    const s = this._settings();
    box.style.background = typeof s.background === 'string' ? s.background : LP_DEFAULT_BG;
    if (this._ro) { this._ro.disconnect(); this._ro.observe(box.parentNode); }
    this._fit();
  }
  // önizleme ekranı bu tarayıcıda hatırlanır (ayar değil, herkese gitmez)
  _screenKey() { let k = null; try { k = localStorage.getItem('lhd-preview-screen'); } catch (e) {} return LHD_SCREENS.some((x) => x[0] === k) ? k : 'tab16'; }
  _fit() {
    const R = this.shadowRoot; if (!R) return;
    // dar ekranda (tablet dikey) önizleme üstte, düzenleyici altta
    if (this._narrowNow !== undefined && ((this.clientWidth || window.innerWidth) < 980) !== this._narrowNow && !this._modal) { this._render(); return; }
    const box = R.querySelector('.pvc'), wrap = R.querySelector('.pvbox'); if (!box || !wrap) return;
    // gerçek ölçeklemeyle aynı hesap: kanvas en az W geniş, ekranın oranına göre genişler, yüksekliği ekrana göre
    const cv = this._settings().canvas || {}, W = cv.width || 1280, H = cv.ref_height || 1075;
    const sc = LHD_SCREENS.filter((x) => x[0] === this._screenKey())[0];
    const sw = sc[1] || window.innerWidth, sh = sc[2] || window.innerHeight;
    const cw = Math.max(W, Math.floor(sw / sh * H)), ch = Math.floor(sh * cw / sw);
    const z = Math.min(wrap.clientWidth / cw, wrap.clientHeight / ch) || 0.5;
    box.style.width = cw + 'px'; box.style.height = ch + 'px';
    box.style.setProperty('--lp-h', ch + 'px');
    box.style.transform = 'translate(' + Math.max(0, (wrap.clientWidth - cw * z) / 2) + 'px,' + Math.max(0, (wrap.clientHeight - ch * z) / 2) + 'px) scale(' + z + ')';
  }

  // ---- olaylar ----
  _bind(tabs, tab, sec) {
    const R = this.shadowRoot, app = R.querySelector('.app');
    R.querySelectorAll('ha-state-icon[data-eid]').forEach((e) => { e.hass = this._hass; e.stateObj = this._hass.states[e.getAttribute('data-eid')]; });
    // sekme ve bölüm sırayla değil kimlikle bulunur (otomatik düzen ya da başka cihazdan değişiklik sırayı kaydırabilir)
    const tabId = tab ? tab.id : null, secId = sec ? sec.id : null;
    const findTab = (T) => T.filter((x) => x.id === tabId)[0];
    const editTab = (fn, soft) => this._edit((T) => { const x = findTab(T); if (x) fn(x, T); }, null, soft);
    const editSec = (fn, soft) => this._edit((T) => { const x = findTab(T), y = x && (x.sections || []).filter((z) => z.id === secId)[0]; if (y) fn(y, x); }, null, soft);

    app.addEventListener('click', (e) => {
      const g = (sel) => (e.target.closest ? e.target.closest(sel) : null);
      const a = g('[data-a]'), act = a && !a.disabled ? a.getAttribute('data-a') : null;
      if (this._menu && !g('.menu') && act !== 'more' && act !== 'addtab' && act !== 'addsec') { this._menu = null; this._render(); return; }
      if (g('[data-ovl]') && e.target === g('[data-ovl]')) { this._modal = null; this._render(); return; }
      if (act !== 'deltab' && act !== 'delsec' && this._ask) { this._ask = null; }
      const at = (el) => { const r = el.getBoundingClientRect(), rr = app.getBoundingClientRect(); return { x: Math.min(r.left - rr.left, rr.width - 260), y: r.bottom - rr.top + 6 }; };
      if (act === 'undo') return this._undoIt();
      if (act === 'settings') { this._modal = 'settings'; this._menu = null; return this._render(); }
      if (act === 'more' || act === 'addtab' || act === 'addsec') { const p = at(a); this._menu = this._menu && this._menu.kind === act ? null : { kind: act, x: p.x, y: p.y }; return this._render(); }
      if (act === 'close') { this._modal = null; this._picked = []; this._q = ''; return this._render(); }
      if (act === 'reset') { this._menu = null; this._modal = 'reset'; return this._render(); }
      if (act === 'resetgo') { this._snap(); this._modal = null; this._sec = null; this._commit('tabs', []); this._toast(this._t('resetOk')); return this._render(); }
      if (act === 'deltab') {
        if (this._ask !== 'deltab') { this._ask = 'deltab'; return this._render(); }
        this._ask = null; const id = tab.id; this._sec = null;
        this._edit((T) => { T.splice(T.map((x) => x.id).indexOf(id), 1); }); this._tab = null; return;
      }
      if (act === 'delsec') {
        if (this._ask !== 'delsec') { this._ask = 'delsec'; return this._render(); }
        this._ask = null; const id = sec.id; this._sec = null;
        return editTab((T) => { T.sections = T.sections.filter((x) => x.id !== id); });
      }
      if (act === 'refill') {
        const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === tab.area)[0];
        if (!fresh) return;
        this._sec = null;
        // sekmenin kolon sayısı korunur: otomatik düzendeki 3. kolon, kolonu az olan sekmede son kolona düşer
        return editTab((T) => { const n = lpWeights(T).length; T.sections = fresh.sections.map((s) => { const o = Object.assign({}, s, { id: lhdId('s') }); if ((o.col || 0) > n - 1) o.col = n - 1; delete o.sub; return o; }); });
      }
      if (act === 'pick') { this._modal = 'pick'; this._picked = []; this._q = ''; return this._render(); }
      if (act === 'pickadd') {
        const ids = this._picked.slice(); this._modal = null; this._picked = []; this._q = '';
        return editSec((S) => {
          if (S.type === 'scenes') {
            S.items = S.items || [];
            ids.forEach((id) => {
              if (id.indexOf('lec:') === 0) {
                const p = id.split(':'), room = p[1], effect = p.slice(2).join(':');
                S.items.push({ name: effect, icon: 'mdi:creation', color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: { service: LP_LEC_DOMAIN + '.play', data: { room: room, effect: effect } } });
                return;
              }
              if (id.indexOf('lecstop:') === 0) {
                S.items.push({ name: this._t('lecStop'), icon: 'mdi:stop-circle-outline', color: '#E5484D', action: { service: LP_LEC_DOMAIN + '.stop', data: { room: id.slice(8) } } });
                return;
              }
              const d = id.split('.')[0], st = this._hass.states[id];
              S.items.push({ name: this._ename(id), icon: (st && st.attributes.icon) || (d === 'script' ? 'mdi:play-circle-outline' : d === 'scene' ? 'mdi:palette-outline' : 'mdi:robot'),
                color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: { service: d === 'automation' ? 'automation.trigger' : d + '.turn_on', target: id } });
            });
          } else {
            S.entities = S.entities || [];
            ids.forEach((id) => S.entities.push(S.type === 'climate' ? this._climateItem(id) : id));
          }
        });
      }
      if (act === 'addlec') return editSec((S) => { S.items = S.items || []; S.items.push({ name: this._t('lecOpen'), icon: 'mdi:creation', color: '#FF6FAE', action: { service: LP_LEC_DOMAIN + '.open' } }); });
      if (act === 'addscph') return editSec((S) => { S.items = S.items || []; S.items.push({ name: this._t('addScPh'), icon: 'mdi:gesture-tap', color: LHD_COLORS[S.items.length % LHD_COLORS.length], action: null }); });
      if (act === 'addph') return editSec((S) => { S.entities = (S.entities || []).concat([{ name: this._t('addPh'), icon: 'mdi:lightbulb-outline' }]); });
      const nt = g('[data-newtab]');
      if (nt) {
        const aid = nt.getAttribute('data-newtab'); this._menu = null;
        // sekme kimliği panonun adresinde görünür (/pano/salon): alan kimliği ya da "sekme", çakışırsa -2, -3...
        const taken = {}; this._work().forEach((x) => { taken[x.id] = 1; });
        const base = aid || (this._lang === 'tr' ? 'sekme' : 'tab');
        let id = base, k = 2; while (taken[id]) id = base + '-' + (k++);
        let nw;
        if (aid) {
          const fresh = buildDefaultTabs(this._hass, this._lang).filter((x) => x.area === aid)[0];
          const ar = this._hass.areas[aid];
          nw = fresh ? Object.assign({}, fresh, { id: id, sections: fresh.sections.map((s) => Object.assign({}, s, { id: lhdId('s') })) })
            : { id: id, name: ar.name, icon: ar.icon || 'mdi:door', area: aid, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        } else {
          nw = { id: id, name: this._t('newTab'), icon: 'mdi:door', area: null, columns: LP_DEFAULT_COLS.slice(), sections: [] };
        }
        this._tab = id; this._sec = null;
        return this._edit((T) => { T.push(nw); });
      }
      const ns = g('[data-newsec]');
      if (ns) {
        const type = ns.getAttribute('data-newsec'), id = lhdId('s'), tgt = this._menu && this._menu.target; this._menu = null;
        const L = this._lang, titles = { lights: t(L, 'lights'), scenes: t(L, 'scenes'), climate: tab.area ? upper(L, this._area(tab.area)) : t(L, 'control'), vacuum: '', media: '' };
        const ncol = lpWeights(tab).length;
        const s = { id: id, type: type, title: titles[type], col: tgt ? tgt.col : Math.min(LHD_TYPES[type].col, ncol - 1) };
        if (tgt && tgt.sub) s.sub = tgt.sub;
        if (type === 'scenes') s.items = []; else s.entities = [];
        // karo sayısı yerin genişliğine göre: geniş kolonda 5, dar sütunda daha az (tablet panosunda 56'lık kolonda 5 karo)
        if (type === 'lights') { const w = lpWeights(tab), sum = w.reduce((a, b) => a + b, 0), sp = lpSplits(tab, w.length)[s.col] || 1;
          s.tile_columns = Math.max(2, Math.min(5, Math.round(w[s.col] / sum / sp * 9))); }
        this._sec = id;
        return editTab((T) => { T.sections.push(s); });
      }
      const tb = g('[data-tab]');
      if (tb && !this._dragged) { this._tab = tb.getAttribute('data-tab'); this._sec = null; return this._render(); }
      const si = g('.si[data-sec]');
      if (si && !this._dragged && !g('[data-handle]')) { this._sec = si.getAttribute('data-sec'); return this._render(); }
      const sb = g('[data-scr]');
      if (sb) { try { localStorage.setItem('lhd-preview-screen', sb.getAttribute('data-scr')); } catch (x) {} return this._render(); }
      // kolonlar: ekle / son kolonu kaldır (bölümleri bir soldakine geçer) / tablet düzeni / eşit. Toplam oran korunur, bölümler yerinde kalır.
      if (act === 'coladd') return editTab((T) => { const w = lpWeights(T), n = w.length, sum = w.reduce((a, b) => a + b, 0); T.columns = w.map((x) => Math.round(x * n / (n + 1) * 100) / 100).concat([Math.round(sum / (n + 1) * 100) / 100]); if (T.splits) T.splits = lpSplits(T, n + 1);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coldel') return editTab((T) => { const w = lpWeights(T), n = w.length; if (n < 2) return; const sum = w.reduce((a, b) => a + b, 0), keep = w.slice(0, -1), ks = keep.reduce((a, b) => a + b, 0);
        T.columns = keep.map((x) => Math.round(x * sum / ks * 100) / 100); T.sections.forEach((s) => { if ((s.col || 0) > n - 2) { s.col = n - 2; delete s.sub; } });
        if (T.splits) T.splits = lpSplits(T, n - 1); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const spb = g('[data-split]');
      if (spb) { const p = spb.getAttribute('data-split').split(':'), i = +p[0], v = +p[1];
        return editTab((T) => { const sp = lpSplits(T, lpWeights(T).length); sp[i] = v; T.splits = sp; T.sections.forEach((s) => { if ((s.col || 0) === i && (s.sub || 0) > v - 1) { if (v > 1) s.sub = v - 1; else delete s.sub; } }); lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); }); }
      const ssb = g('[data-ssub]');
      if (ssb) { const v = +ssb.getAttribute('data-ssub'); return editSec((S) => { if (v) S.sub = v; else delete S.sub; }); }
      if (act === 'coltab') return editTab((T) => { T.columns = LP_DEFAULT_COLS.slice();  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      if (act === 'coleq') return editTab((T) => { const w = lpWeights(T), sum = w.reduce((a, b) => a + b, 0); T.columns = w.map(() => Math.round(sum / w.length * 100) / 100);  lhdFitCols(T, this._cw()); lhdFitSplits(T, this._cw()); });
      const sc = g('[data-scol]');
      if (sc) return editSec((S) => { S.col = +sc.getAttribute('data-scol'); delete S.sub; });
      const tc = g('[data-tc]');
      if (tc) return editSec((S) => { S.tile_columns = +tc.getAttribute('data-tc'); });
      const dl = g('[data-del]');
      if (dl) { const i = +dl.getAttribute('data-del'); return editSec((S) => { (S.type === 'scenes' ? S.items : S.entities).splice(i, 1); }); }
      const pk = g('[data-pk]');
      if (pk && !pk.classList.contains('dis')) {
        const id = pk.getAttribute('data-pk'), k = this._picked.indexOf(id);
        if (k >= 0) this._picked.splice(k, 1); else this._picked.push(id);
        pk.classList.toggle('on', k < 0);
        pk.querySelector('.ck').innerHTML = k < 0 ? '<ha-icon class="s14" icon="mdi:check"></ha-icon>' : '';
        const btn = R.querySelector('[data-a="pickadd"]'); btn.disabled = !this._picked.length; btn.textContent = this._t('addN', { n: this._picked.length });
        return;
      }
      const st = g('[data-set]');
      if (st) {
        const path = st.getAttribute('data-set'), v = st.getAttribute('data-val');
        if (path === 'bgmode') return this._setting('background', v === 'img' ? "center / cover no-repeat fixed url('/local/zemin.jpg')" : null);
        return this._setting(path, v === 'auto' ? null : v);
      }
      const tgl = g('[data-tg]');
      if (tgl) { const path = tgl.getAttribute('data-tg'); const cur = tgl.classList.contains('on'); return this._setting(path, cur ? null : true); }
    });

    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir (yazarken odak kaybolmasın)
    // metin alanları: değişiklik Enter'a basınca ya da alandan çıkınca kaydedilir. Yazı alanları "soft" kaydedilir: panel yeniden
    // çizilmez (odak ve hemen arkasından basılan düğme kaybolmasın); görünen ilgili yazılar yerinde güncellenir, önizleme kendisi güncellenir.
    app.addEventListener('change', (e) => {
      const el = e.target;
      const soft = el.tagName === 'INPUT';
      const f = el.getAttribute && el.getAttribute('data-f');
      if (f === 'tab.name') {
        const v = el.value.trim(); if (!v) { el.value = tab.name; return; }
        const lb = R.querySelector('.rb.on'); if (lb && lb.lastChild && lb.lastChild.nodeType === 3) lb.lastChild.textContent = v;
        // yeni açılmış adsız sekme ilk kez adlandırılınca adresi de addan gelsin (/pano/sekme → /pano/salon)
        if (/^(sekme|tab)(-\d+)?$/.test(tab.id)) {
          const base = lhdSlug(v) || tab.id, taken = {}; this._work().forEach((x) => { if (x.id !== tab.id) taken[x.id] = 1; });
          let nid = base, k = 2; while (taken[nid]) nid = base + '-' + (k++);
          if (nid !== tab.id) { this._tab = nid; return this._edit((T) => { const x = T.filter((y) => y.id === tabId)[0]; if (x) { x.name = v; x.id = nid; } }); }
        }
        return editTab((T) => { T.name = v; }, true);
      }
      if (f === 'tab.icon') {
        const v = el.value.trim() || 'mdi:door';
        const ic = R.querySelector('.rb.on ha-icon'); if (ic) ic.setAttribute('icon', v);
        return editTab((T) => { T.icon = v; }, true);
      }
      if (f === 'tab.area') return editTab((T) => { T.area = el.value || null; });
      if (f === 'sec.title') {
        const lb = R.querySelector('.si.on .nm b'); if (lb) lb.textContent = el.value || this._t('t_' + sec.type);
        return editSec((S) => { S.title = el.value; }, true);
      }
      const itf = el.getAttribute && el.getAttribute('data-if');
      if (itf) {
        const p = itf.split('.'), i = +p[0], key = p[1], v = el.value.trim();
        if (key === 'color') { const ic = el.parentNode.querySelector('.ico ha-icon'); if (ic) ic.style.color = v; }
        return editSec((S) => {
          if (S.type === 'scenes') { const it = S.items[i]; if (!it) return; if (v) it[key] = v; else if (key !== 'name') delete it[key]; return; }
          let it = S.entities[i]; if (it === undefined) return;
          if (typeof it === 'string') { it = { entity: it }; S.entities[i] = it; }
          if (key === 'link') { if (v) it.entities = [v].concat((it.entities || []).slice(1).filter((x) => x !== v)); else delete it.entities; }
          else if (v && !(key === 'kind' && v === 'auto')) it[key] = v; else delete it[key];
          if (it.entity && Object.keys(it).length === 1) S.entities[i] = it.entity;   // sade kalsın
        }, soft);
      }
      const sf = el.getAttribute && el.getAttribute('data-sf');
      if (sf) { const v = el.type === 'number' ? (parseInt(el.value, 10) || null) : el.value.trim(); return this._setting(sf, v, true); }
      if (el.hasAttribute && el.hasAttribute('data-bgurl')) { const u = el.value.trim(); return this._setting('background', u ? "center / cover no-repeat fixed url('" + u.replace(/'/g, '') + "')" : null, true); }
    });
    app.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('inp') && e.target.tagName === 'INPUT') e.target.blur(); });
    // simge alanında yazarken önizleme
    app.addEventListener('input', (e) => {
      const el = e.target;
      if (el.hasAttribute && el.hasAttribute('data-q')) { this._q = el.value; const pl = R.querySelector('.plist'); if (pl) { pl.innerHTML = this._pickList(sec); pl.querySelectorAll('ha-state-icon[data-eid]').forEach((x) => { x.hass = this._hass; x.stateObj = this._hass.states[x.getAttribute('data-eid')]; }); } return; }
      const f = el.getAttribute && (el.getAttribute('data-f') || el.getAttribute('data-if') || '');
      if (/icon$/.test(f)) { const pv = el.closest('.iconin, .it'); const ic = pv && pv.querySelector('.pv ha-icon, .ico ha-icon'); if (ic && /^[a-z]+:[a-z0-9-]+$/.test(el.value.trim())) ic.setAttribute('icon', el.value.trim()); }
    });
    const q = R.querySelector('[data-q]'); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }

    // sürükle bırak: sekmeler (yatay), bölümler, öğeler
    R.querySelectorAll('[data-dl]').forEach((list) => {
      list.addEventListener('pointerdown', (e) => {
        const h = e.target.closest ? e.target.closest('[data-handle]') : null;
        if (!h || e.button !== 0) return;
        const item = h.closest('[data-di]'); if (!item || item.parentNode !== list) return;
        const items = Array.prototype.filter.call(list.children, (x) => x.hasAttribute('data-di'));
        const from = items.indexOf(item), horiz = list.getAttribute('data-dir') === 'x';
        const sx = e.clientX, sy = e.clientY;
        let to = from, started = false;
        this._dragged = false;
        const clear = () => items.forEach((x) => x.classList.remove('dropb', 'dropa'));
        const move = (ev) => {
          if (!started && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
          if (!started) { started = true; item.classList.add('dragging'); try { list.setPointerCapture(e.pointerId); } catch (x) {} }
          const pos = horiz ? ev.clientX : ev.clientY;
          to = items.length;
          for (let i = 0; i < items.length; i++) { const r = items[i].getBoundingClientRect(); if (pos < (horiz ? r.left + r.width / 2 : r.top + r.height / 2)) { to = i; break; } }
          clear();
          if (to < items.length) items[to].classList.add('dropb'); else items[items.length - 1].classList.add('dropa');
        };
        const up = () => {
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          clear(); item.classList.remove('dragging');
          if (!started) return;
          this._dragged = true; setTimeout(() => { this._dragged = false; }, 0);
          const dest = to > from ? to - 1 : to;
          if (dest === from) return;
          const kind = list.getAttribute('data-dl');
          if (kind === 'tabs') this._edit((T) => lhdMove(T, from, dest));
          if (kind === 'secs') editTab((T) => lhdMove(T.sections, from, dest));
          if (kind === 'items') editSec((S) => lhdMove(S.type === 'scenes' ? S.items : S.entities, from, dest));
        };
        window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
    });
  }

  // iklim cihazı eklenirken aynı alandaki harici sıcaklık/nem sensörü önerilir (otomatik düzendeki kural)
  _climateItem(id) { return lpClimateItem(this._hass, id); }
}
