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
  // Yaz/Kış: yönetici olmayan kullanıcı (evdeki tablet) da değiştirebilir. Ekran beklemeden hemen değişir.
  season(value) {
    if (this.data) {
      this.data = Object.assign({}, this.data, { settings: Object.assign({}, this.data.settings, { season: value }) });
      const d = this.data;
      this.subs.forEach((f) => f(d));
    }
    return this.conn ? this.conn.sendMessagePromise({ type: 'lemur_home_dashboard/season', season: value }) : Promise.resolve();
  },
  onChange(f) { this.subs.push(f); return () => { this.subs = this.subs.filter((x) => x !== f); }; }
});
