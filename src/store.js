// Yeni sürüm uyarısı: entegrasyon (HACS güncellemesi ve HA yeniden başlatmasından sonra) bu dosyadan farklı bir sürüm
// bildirirse, pano ya da yönetim paneli açıkken üstte küçük bir uyarı çıkar: "Yeni sürüm yüklendi, görmek için sayfayı yenile".
// Sayfa yalnızca kullanıcı Yenile'ye basınca yenilenir. Tarayıcının ya da HA'nın önbelleğine dokunulmaz; paket adresindeki
// ?v=<sürüm> yeni dosyanın yüklenmesini zaten sağlar. Uyarı yalnızca bizim ekranlarımız açıkken görünür (users sayacı).
const LHD_NEWER = window.__LEMUR_HD_NEWER || (window.__LEMUR_HD_NEWER = { v: null, users: 0, el: null, lang: 'en', hidden: false });
function lhdNewerPaint() {
  const N = LHD_NEWER, show = !!N.v && N.users > 0 && !N.hidden;
  if (!show) { if (N.el) { N.el.remove(); N.el = null; } return; }
  if (N.el) return;
  const d = document.createElement('div');
  d.setAttribute('role', 'status');
  d.setAttribute('style', 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:14px;background:rgba(20,24,31,0.96);color:#ECEDEF;border:1px solid rgba(255,255,255,0.14);box-shadow:0 6px 24px rgba(0,0,0,0.45);font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:calc(100vw - 32px);box-sizing:border-box');
  const msg = document.createElement('span'); msg.textContent = t(N.lang, 'newer', { v: N.v });
  const btn = document.createElement('button'); btn.textContent = t(N.lang, 'newer_btn');
  btn.setAttribute('style', 'flex:none;border:0;border-radius:10px;padding:7px 14px;background:#5B8DEF;color:#0B1020;font:inherit;font-weight:700;cursor:pointer');
  btn.addEventListener('click', () => location.reload());
  const x = document.createElement('button'); x.textContent = '\u00d7'; x.setAttribute('aria-label', t(N.lang, 'newer_close'));
  x.setAttribute('style', 'flex:none;border:0;background:none;color:#ECEDEF;font-size:20px;line-height:1;padding:4px 8px;cursor:pointer;opacity:.7');
  x.addEventListener('click', () => { N.hidden = true; lhdNewerPaint(); });
  d.appendChild(msg); d.appendChild(btn); d.appendChild(x);
  document.body.appendChild(d); N.el = d;
}
// ekran (pano kartı ya da yönetim paneli) takılınca +1, çıkarılınca -1
function lhdNewerUse(on, lang) {
  LHD_NEWER.users = Math.max(0, LHD_NEWER.users + (on ? 1 : -1));
  if (lang) LHD_NEWER.lang = lang;
  lhdNewerPaint();
}
function lhdVerCheck(conn) {
  conn.sendMessagePromise({ type: 'lemur_home_dashboard/info' }).then((info) => {
    const want = info && info.version;
    if (!want || want === PANEL_VERSION || want === LHD_NEWER.v) return;
    LHD_NEWER.v = want; LHD_NEWER.hidden = false;
    if (LHD_NEWER.el) { LHD_NEWER.el.remove(); LHD_NEWER.el = null; }
    lhdNewerPaint();
  }).catch(() => {});
}
// Ortak ayarlar: entegrasyondan okunur, değişince bütün açık ekranlara gelir.
const STORE = window.__LEMUR_HOME_DASHBOARD_STORE || (window.__LEMUR_HOME_DASHBOARD_STORE = {
  data: null, conn: null, subs: [], loading: null, pending: 0,
  load(hass) {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.conn = hass.connection;
    this.loading = lhdRetryMsg(this.conn, { type: 'lemur_home_dashboard/get' }).then((d) => {   // HA açılırken entegrasyon henüz yoksa bekleyip yeniden dener
      this.data = d;
      lhdVerCheck(this.conn);
      // kendi kaydımızın yankısı beklenirken gelen eski veri ekrandakini ezmesin
      lhdLiveSub(this.conn, { type: 'lemur_home_dashboard/subscribe' }, (msg) => {
        if (msg && msg.__fb) {   // bir lamba yedek yoldan kontrol edildi (src: twins.py)
          if (!this.data) return;
          this.data = Object.assign({}, this.data, { fallback: Object.assign({}, this.data.fallback, msg.__fb) });
          const d = this.data; this.subs.forEach((f) => f(d)); return;
        }
        if (msg && msg.__feed) {   // yalnız bir hayvanın besleme kaydı değişti
          if (!this.data) return;
          this.data = Object.assign({}, this.data, { feed: Object.assign({}, this.data.feed, msg.__feed) });
          const d = this.data; this.subs.forEach((f) => f(d)); return;
        }
        if (this.pending) return; this.data = msg; this.subs.forEach((f) => f(msg));
      }, () => {
        // bağlantı koparsa (HA yeniden başladı, tablet uyudu) dönüşte güncel ayarı al; o arada yapılan değişiklikler kaçmasın
        lhdVerCheck(this.conn);   // HA güncellemeyle yeniden başladıysa yeni sürüm uyarısı
        lhdRetryMsg(this.conn, { type: 'lemur_home_dashboard/get' }).then((n) => { if (n && !this.pending) { this.data = n; this.subs.forEach((f) => f(n)); } }).catch(() => {});
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
// Panonun ayarları. Otomatik kur önizlemesi (hayali ev) çizilirken kısa süre kendi seçimleriyle değiştirilir (LP_OVR.s)
const LP_OVR = { s: null };
function lpSettings() { return LP_OVR.s || (STORE.data && STORE.data.settings) || {}; }
