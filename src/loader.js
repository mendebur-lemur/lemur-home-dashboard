/*! Lemur Home Dashboard yükleyici v__VERSION__ */
// Her sayfaya yüklenen küçük dosya (2026-11-04, GitHub #3).
// Ana dosya ~700 KB. Yavaş tabletlerde ve HA Android uygulamasında, HA'nın pano stratejisini
// bekleme süresi dolmadan inip çalışamıyor, pano "Timeout waiting for strategy element" veriyordu.
// Bu dosya strateji elemanını hemen tanımlar; ana dosyayı arkada yükler. HA generate() çağırınca
// ana dosyanın yüklenmesi beklenir ve iş asıl stratejiye devredilir.
(function () {
  var NAME = 'll-strategy-dashboard-lemur-home-dashboard';
  var MAIN = '/lemur_home_dashboard/lemur-home-dashboard.js?v=__VERSION__';
  var W = window;
  var loading = null;

  function ready() {
    return !!W.__LEMUR_HD_STRATEGY;
  }

  function loadMain() {
    if (ready()) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var tries = 0;
      function attempt() {
        var s = document.createElement('script');
        // Modül olarak yüklenir (eskiden de HA bunu modül olarak yüklüyordu): üst düzey adlar genel alana
        // taşmaz, katı kip korunur, yönetim paneli de aynı adresi modül olarak yüklediği için dosya bir kez çalışır.
        // Modül desteklemeyen eski tarayıcıda klasik betik olarak yüklenir.
        if ('noModule' in HTMLScriptElement.prototype) s.type = 'module';
        else s.charset = 'utf-8';
        s.src = MAIN + (tries ? '&r=' + tries : '');
        s.async = true;
        s.onload = function () {
          if (ready()) resolve();
          else retry(new Error('Lemur Home Dashboard yüklendi ama tanımlanmadı'));
        };
        s.onerror = function () { retry(new Error('Lemur Home Dashboard indirilemedi')); };
        document.head.appendChild(s);
      }
      function retry(err) {
        tries += 1;
        if (tries > 3) { loading = null; reject(err); return; }
        setTimeout(attempt, 1500 * tries);
      }
      attempt();
    });
    return loading;
  }

  class LemurHomeDashboardStrategyLoader extends HTMLElement {
    static async generate(config, hass) {
      await loadMain();
      return W.__LEMUR_HD_STRATEGY.generate(config, hass);
    }
  }

  function define() {
    try {
      if (!W.customElements.get(NAME)) W.customElements.define(NAME, LemurHomeDashboardStrategyLoader);
    } catch (e) { /* zaten tanımlı */ }
  }

  // ---- kendini onarma (v0.33.1, GitHub #21) ----
  // Home Assistant pano stratejisini birkaç saniye bekler. Bu dosya o sürede gelmezse (ilk açılış, yavaş ağ) ya da ana dosya
  // inemezse HA bir hata sayfası üretir ve öyle bırakır; kullanıcı sayfayı yenileyene kadar pano gelmez. Bu dosya eninde
  // sonunda yüklenir: pano bizim stratejimizi kullandığı halde üretilen sayfada kartımız yoksa HA'ya panoyu yeniden
  // ürettirir. En çok 3 kez dener; HA'nın işlevi yoksa sayfayı bir kez yeniler (dakikada en çok bir).
  var STRAT = 'custom:lemur-home-dashboard', CARD = 'custom:lemur-home-dashboard-card';
  var heals = 0, healing = false;
  function panel() {
    try {
      var ha = document.querySelector('home-assistant'), m = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
      return (m && m.shadowRoot && m.shadowRoot.querySelector('ha-panel-lovelace')) || null;
    } catch (e) { return null; }
  }
  function broken(p) {
    var L = p && p.lovelace, raw = L && L.rawConfig, cfg = L && L.config;
    if (!raw || !raw.strategy || raw.strategy.type !== STRAT || !cfg || !Array.isArray(cfg.views)) return false;
    for (var i = 0; i < cfg.views.length; i++) {
      var cards = (cfg.views[i] && cfg.views[i].cards) || [];
      for (var j = 0; j < cards.length; j++) if (cards[j] && cards[j].type === CARD) return false;
    }
    return true;
  }
  function reloadOnce() {
    try {
      var last = +(W.sessionStorage.getItem('lhd-heal') || 0);
      if (Date.now() - last < 60000) return;
      W.sessionStorage.setItem('lhd-heal', String(Date.now()));
      W.location.reload();
    } catch (e) { /* depolama kapalıysa yenileme döngüsüne girmemek için hiçbir şey yapılmaz */ }
  }
  function heal() {
    if (healing || heals >= 3) return;
    var p = panel();
    if (!broken(p)) return;
    healing = true; heals += 1;
    loadMain().then(function () {
      if (!broken(p)) return null;   // bu arada kendiliğinden düzeldi
      if (typeof p._regenerateStrategyConfig === 'function') return p._regenerateStrategyConfig();
      if (typeof p._fetchConfig === 'function') return p._fetchConfig(true);
      reloadOnce();
      return null;
    }).catch(function () { /* ana dosya hâlâ inemiyor: sonraki denemede */ }).then(function () {
      healing = false;
      // yeniden üretim işe yaramadıysa son çare: sayfayı bir kez yenile
      if (heals >= 3) setTimeout(function () { if (broken(panel())) reloadOnce(); }, 3000);
    });
  }

  define();
  // bazı eklentiler window.customElements'i sonradan değiştiriyor; ilk 30 sn tanımı yenile (ana dosyadaki gibi)
  var n = 0;
  var timer = setInterval(function () { define(); if (n % 15 === 14) heal(); if (++n > 600) clearInterval(timer); }, 100);   // onarma: 1,5 sn'de bir, bir dakika boyunca
  W.addEventListener('location-changed', function () { define(); setTimeout(heal, 1500); });
  // kart ve diğer panolar da ana dosyaya ihtiyaç duyuyor: hemen yüklemeye başla
  loadMain().catch(function (e) { console.warn(e && e.message); });
})();
