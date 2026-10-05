// Güncellemeden sonra eski sürüm kalmasın: HA'nın service worker'ı sunduğu her sayfanın bir kopyasını saklar. Güncellemeden önce
// alınmış kopya eski dosyamızı (lemur-home-dashboard.js?v=ESKİ) ister ve tarayıcı onu da önbellekten verir; sonuç: yeni sürüm gelmez.
// Entegrasyonun sürümü bizimkinden farklıysa eski kopyaları ve eski dosyaları siler, sayfayı bir kez yeniler (Light Effect Card'daki yöntem).
function lhdHeal(want) {
  if (!window.caches) return Promise.resolve(0);
  let n = 0;
  return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.open(k).then((c) => c.keys().then((reqs) => Promise.all(reqs.map((r) => {
    const u = r.url;
    if (/\/lemur_home_dashboard\/lemur-home-dashboard\.js\?v=/.test(u)) { if (u.indexOf('v=' + want) < 0) { n++; return c.delete(r); } return null; }
    let path; try { path = new URL(u).pathname; } catch (e) { return null; }
    if (/\.[a-z0-9]{1,5}$/i.test(path)) return null;   // sadece sayfalar
    return c.match(r).then((res) => (res ? res.clone().text() : '')).then((txt) => {
      const m = txt.match(/lemur-home-dashboard\.js\?v=([0-9.]+)/);
      if (m && m[1] !== want) { n++; return c.delete(r); }
      return null;
    });
  }))))))).then(() => n).catch(() => n);
}
function lhdHealCheck(conn) {
  conn.sendMessagePromise({ type: 'lemur_home_dashboard/info' }).then((info) => {
    const want = info && info.version;
    if (!want || want === PANEL_VERSION) return;
    lhdHeal(want).then(() => {
      try { const f = 'lhd-heal-' + want; if (!sessionStorage.getItem(f)) { sessionStorage.setItem(f, '1'); location.reload(); } } catch (e) {}
    });
  }).catch(() => {});
}
// Ortak ayarlar: entegrasyondan okunur, değişince bütün açık ekranlara gelir.
const STORE = window.__LEMUR_HOME_DASHBOARD_STORE || (window.__LEMUR_HOME_DASHBOARD_STORE = {
  data: null, conn: null, subs: [], loading: null, pending: 0,
  load(hass) {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.conn = hass.connection;
    this.loading = this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/get' }).then((d) => {
      this.data = d;
      lhdHealCheck(this.conn);
      // kendi kaydımızın yankısı beklenirken gelen eski veri ekrandakini ezmesin
      this.conn.subscribeMessage((msg) => {
        if (msg && msg.__feed) {   // yalnız bir hayvanın besleme kaydı değişti
          if (!this.data) return;
          this.data = Object.assign({}, this.data, { feed: Object.assign({}, this.data.feed, msg.__feed) });
          const d = this.data; this.subs.forEach((f) => f(d)); return;
        }
        if (this.pending) return; this.data = msg; this.subs.forEach((f) => f(msg));
      }, { type: 'lemur_home_dashboard/subscribe' });
      // bağlantı koparsa (HA yeniden başladı, tablet uyudu) dönüşte güncel ayarı al; o arada yapılan değişiklikler kaçmasın
      if (this.conn.addEventListener) this.conn.addEventListener('ready', () => {
        this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/get' }).then((n) => { if (n && !this.pending) { this.data = n; this.subs.forEach((f) => f(n)); } }).catch(() => {});
      });
      return d;
    }).catch((e) => { this.loading = null; throw e; });
    return this.loading;
  },
  set(key, value) {
    this.pending++;
    const done = () => { this.pending = Math.max(0, this.pending - 1); };
    return this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/set', key: key, value: value }).then((r) => { done(); return r; }, (e) => { done(); throw e; });
  },
  // Yaz/Kış: yönetici olmayan kullanıcı (evdeki tablet) da değiştirebilir. Ekran beklemeden hemen değişir.
  season(value) {
    if (this.data) {
      this.data = Object.assign({}, this.data, { settings: Object.assign({}, this.data.settings, { season: value }) });
      const d = this.data;
      this.subs.forEach((f) => f(d));
    }
    return this.conn ? this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/season', season: value }) : Promise.resolve();
  },
  // Besleme kartı: "Besledim" (ve geri al). Her kullanıcı yapabilir; sonuç abonelikle bütün ekranlara gelir.
  feed(pet, undo) { return this.conn ? this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/feed', pet: pet, undo: !!undo }).catch(() => null) : Promise.resolve(); },   // bir dakikadan kısa sürede ikinci besleme sayılmaz (too_soon)
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});
