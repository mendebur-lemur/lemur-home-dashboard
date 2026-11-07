/*! Lemur Home Dashboard yükleyici v0.28.0 */
// Her sayfaya yüklenen küçük dosya (2026-11-04, GitHub #3).
// Ana dosya ~700 KB. Yavaş tabletlerde ve HA Android uygulamasında, HA'nın pano stratejisini
// bekleme süresi dolmadan inip çalışamıyor, pano "Timeout waiting for strategy element" veriyordu.
// Bu dosya strateji elemanını hemen tanımlar; ana dosyayı arkada yükler. HA generate() çağırınca
// ana dosyanın yüklenmesi beklenir ve iş asıl stratejiye devredilir.
(function () {
  var NAME = 'll-strategy-dashboard-lemur-home-dashboard';
  var MAIN = '/lemur_home_dashboard/lemur-home-dashboard.js?v=0.28.0';
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

  define();
  // bazı eklentiler window.customElements'i sonradan değiştiriyor; ilk 30 sn tanımı yenile (ana dosyadaki gibi)
  var n = 0;
  var timer = setInterval(function () { define(); if (++n > 300) clearInterval(timer); }, 100);
  W.addEventListener('location-changed', define);
  // kart ve diğer panolar da ana dosyaya ihtiyaç duyuyor: hemen yüklemeye başla
  loadMain().catch(function (e) { console.warn(e && e.message); });
})();
