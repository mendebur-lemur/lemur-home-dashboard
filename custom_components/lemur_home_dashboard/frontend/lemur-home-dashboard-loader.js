/*! Lemur Home Dashboard yükleyici v0.35.0 */
// Her sayfaya yüklenen küçük dosya (2026-11-04, GitHub #3).
// Ana dosya ~700 KB. Yavaş tabletlerde ve HA Android uygulamasında, HA'nın pano stratejisini
// bekleme süresi dolmadan inip çalışamıyor, pano "Timeout waiting for strategy element" veriyordu.
// Bu dosya strateji elemanını hemen tanımlar; ana dosyayı arkada yükler. HA generate() çağırınca
// ana dosyanın yüklenmesi beklenir ve iş asıl stratejiye devredilir.
(function () {
  var W = window;
  // Bu dosya sayfaya iki yoldan gelebilir (add_extra_js_url ve Lovelace kaynağı); ikincisi hiçbir şey yapmaz.
  if (W.__LEMUR_HD_LOADER) return;
  W.__LEMUR_HD_LOADER = '0.35.0';
  var NAME = 'll-strategy-dashboard-lemur-home-dashboard';
  var MAIN = '/lemur_home_dashboard/lemur-home-dashboard.js?v=0.35.0';
  // Ana dosya inemezse yeniden denenir: ilk 40 sn 3 sn'de bir (ilki 1,5 sn sonra), 2. dakikaya kadar 5 sn'de bir,
  // 5. dakikaya kadar 15 sn'de bir, sonra dakikada bir; 10 dakika sonra bırakılır.
  // Home Assistant açılırken eklenti kurulana kadar ana dosyanın adresi "bulunamadı" döner (evde ~14 sn, yavaş sistemde daha uzun).
  var MAX_MS = 600000;
  function wait(k, ms) { return k === 0 ? 1500 : ms < 40000 ? 3000 : ms < 120000 ? 5000 : ms < 300000 ? 15000 : 60000; }
  var loading = null;
  var seq = 0;   // tarayıcı başarısız modül adresini sayfa boyunca hatırlar: her deneme başka adresle yapılır

  function ready() {
    return !!W.__LEMUR_HD_STRATEGY;
  }

  function loadMain() {
    if (ready()) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var t0 = Date.now(), k = 0;
      function attempt() {
        if (ready()) { resolve(); return; }
        var s = document.createElement('script');
        // Modül olarak yüklenir (eskiden de HA bunu modül olarak yüklüyordu): üst düzey adlar genel alana
        // taşmaz, katı kip korunur, yönetim paneli de aynı adresi modül olarak yüklediği için dosya bir kez çalışır.
        // Modül desteklemeyen eski tarayıcıda klasik betik olarak yüklenir.
        if ('noModule' in HTMLScriptElement.prototype) s.type = 'module';
        else s.charset = 'utf-8';
        s.src = MAIN + (seq ? '&r=' + seq : '');
        seq += 1;
        s.async = true;
        s.onload = function () {
          if (ready()) resolve();
          else retry(s, new Error('Lemur Home Dashboard yüklendi ama tanımlanmadı'));
        };
        s.onerror = function () { retry(s, new Error('Lemur Home Dashboard indirilemedi')); };
        document.head.appendChild(s);
      }
      function retry(s, err) {
        try { if (s.parentNode) s.parentNode.removeChild(s); } catch (e) { /* önemsiz */ }
        var ms = Date.now() - t0;
        if (ms > MAX_MS) { loading = null; reject(err); return; }
        setTimeout(attempt, wait(k, ms));
        k += 1;
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

  // ---- kendini onarma (v0.33.1, GitHub #21; v0.34.0'da sayfa yenileme kaldırıldı) ----
  // Home Assistant pano stratejisini birkaç saniye bekler. Bu dosya o sürede gelmezse (ilk açılış, yavaş ağ) HA bir hata
  // sayfası üretir ve öyle bırakır; kullanıcı sayfayı yenileyene kadar pano gelmez. Bu dosya eninde sonunda yüklenir: pano
  // bizim stratejimizi kullandığı halde üretilen sayfada kartımız yoksa HA'ya panoyu yeniden ürettirir.
  // Sayfa hiçbir durumda kendiliğinden yenilenmez. Denemeler seyrekleşir: 2. sn, sonra 5, 15, 30 sn arayla, sonra dakikada
  // bir; 14 denemeden sonra bırakılır. Sayfa geçişinde ve ağ geri gelince yeniden başlar.
  var STRAT = 'custom:lemur-home-dashboard', CARD = 'custom:lemur-home-dashboard-card';
  var GAPS = [5, 15, 30, 60], HEAL_MAX = 14;
  var healN = 0, healing = false, healNext = Date.now() + 2000;
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
  function heal() {
    if (healing || healN >= HEAL_MAX || Date.now() < healNext) return;
    var p = panel();
    if (!broken(p)) return;
    healing = true;
    healNext = Date.now() + 1000 * (healN < GAPS.length ? GAPS[healN] : 60);
    healN += 1;
    loadMain().then(function () {
      if (!broken(p)) return null;   // bu arada kendiliğinden düzeldi
      if (typeof p._regenerateStrategyConfig === 'function') return p._regenerateStrategyConfig();
      if (typeof p._fetchConfig === 'function') return p._fetchConfig(true);
      return null;
    }).catch(function () { /* ana dosya hâlâ inemiyor: sonraki denemede */ }).then(function () { healing = false; });
  }

  define();
  // bazı eklentiler window.customElements'i sonradan değiştiriyor; ilk 30 sn tanımı yenile (ana dosyadaki gibi)
  var n = 0;
  var timer = setInterval(function () { define(); if (++n > 300) clearInterval(timer); }, 100);
  // onarma: saniyede bir bakılır, 12 dakika sonra bırakılır; sayfa geçişinde yeniden başlar
  var hn = 0;
  var htimer = setInterval(function () { heal(); if (++hn > 720) clearInterval(htimer); }, 1000);
  function again() {
    if (!healing) { healN = 0; healNext = Date.now() + 1500; }
    if (hn > 720) { hn = 0; htimer = setInterval(function () { heal(); if (++hn > 720) clearInterval(htimer); }, 1000); }
    setTimeout(heal, 1600);
  }
  W.addEventListener('location-changed', function () { define(); again(); });
  W.addEventListener('online', again);
  // kart ve diğer panolar da ana dosyaya ihtiyaç duyuyor: hemen yüklemeye başla
  loadMain().catch(function (e) { console.warn(e && e.message); });
})();
