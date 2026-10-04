// Pano stratejisi: `strategy: { type: custom:lemur-home-dashboard }` yazılan pano bu sınıfla üretilir.
// HA kuralı: custom:lemur-home-dashboard → <ll-strategy-dashboard-lemur-home-dashboard>, static generate(config, hass).

// Varsayılan zemin: tablet panosundaki arka plan resminin kendisi neredeyse düz koyu lacivert (#0b0e15), kenarlara doğru
// hafif kararıyor. Resim dosyası gerekmesin diye aynısı CSS ile çiziliyor.
const LP_DEFAULT_BG = 'radial-gradient(ellipse at center, #0b0e15 0%, #0b0e15 55%, #0a0c13 100%) fixed';

// Zemin seçenekleri (ayarlar → Arka plan): koyu (varsayılan), siyah, renk, efekt renkleri, resim.
// Efekt renkleri Lemur Light Effect Card'ın efekt paletleri: her efektin renk tonları (hue), kartın arkasındaki ışıltı gibi
// koyu zeminin üstüne yumuşak renk lekeleri olarak çizilir. Light Effect Card kurulu olmasa da seçilebilir.
const LP_BG_FX = [
  ['aurora', 'Kutup ışığı', 'Aurora', [150, 200, 280]], ['fire', 'Ateş', 'Fire', [8, 30]], ['candle', 'Mum ışığı', 'Candlelight', [32, 45]],
  ['rainbow', 'Gökkuşağı', 'Rainbow', [0, 120, 240]], ['sunrise', 'Gün doğumu', 'Sunrise', [30, 48]], ['sunset', 'Gün batımı', 'Sunset', [15, 330]],
  ['night', 'Gece', 'Night', [230, 255]], ['galaxy', 'Galaksi', 'Galaxy', [255, 290]], ['storm', 'Fırtına', 'Storm', [255, 50]],
  ['rain', 'Yağmur', 'Rain', [205, 225]], ['snow', 'Kar', 'Snow', [190, 205]], ['ocean', 'Okyanus', 'Ocean', [190, 215]],
  ['forest', 'Orman', 'Forest', [95, 135]], ['autumn', 'Sonbahar', 'Autumn', [22, 40]], ['blossom', 'Çiçek', 'Blossom', [320, 345]],
  ['desert', 'Çöl', 'Desert', [35, 45]], ['mountain', 'Dağ', 'Mountain', [30, 140]], ['planet', 'Gezegen', 'Planet', [20, 200]],
  ['sparkle', 'Işıltı', 'Sparkle', [50, 300]], ['romantic', 'Romantik', 'Romantic', [340, 355]], ['party', 'Parti', 'Party', [300, 190]],
  ['music', 'Müzik', 'Music', [285, 320, 200]], ['movie', 'Sinema', 'Movie', [230, 260]], ['sleep', 'Uyku', 'Sleep', [250, 270]],
  ['zen', 'Meditasyon', 'Meditation', [170, 280]], ['game', 'Oyun', 'Gaming', [120, 280]], ['art', 'Sanat', 'Art', [0, 60, 200]],
  ['coffee', 'Kahve', 'Coffee', [25, 35]], ['halloween', 'Cadılar bayramı', 'Halloween', [30, 280]], ['gradient', 'Geçiş', 'Gradient', [30, 210]]
];
// paletin önizlemesi ve zemini: ton listesinden yumuşak renk lekeleri (köşelerde) + koyu zemin
function lpFxHues(key) { const f = LP_BG_FX.filter((x) => x[0] === key)[0]; return f ? f[3] : [220]; }
function lpFxSwatch(hues) {
  const h = hues.length === 1 ? [hues[0], (hues[0] + 22) % 360] : hues;
  return 'linear-gradient(120deg,' + h.map((x, i) => 'hsl(' + x + ',75%,45%) ' + Math.round(i / (h.length - 1) * 100) + '%').join(',') + ')';
}
function lpBgCss(b) {
  if (!b || !b.mode || b.mode === 'dark') return null;
  if (b.mode === 'black') return '#000000';
  if (b.mode === 'color') return 'linear-gradient(rgba(0,0,0,0) 35%, rgba(0,0,0,0.25)) fixed, ' + (b.color || '#0e1726');
  if (b.mode === 'img') return b.url ? "center / cover no-repeat fixed url('" + String(b.url).replace(/'/g, '') + "')" : null;
  if (b.mode === 'fx') {
    const hs = lpFxHues(b.fx), h = hs.length === 1 ? [hs[0], (hs[0] + 22) % 360] : hs;
    const pos = ['85% 10%', '10% 90%', '45% 55%'], a = [0.5, 0.45, 0.22];
    return h.slice(0, 3).map((x, i) => 'radial-gradient(ellipse 80% 70% at ' + pos[i] + ', hsla(' + x + ',75%,45%,' + a[i] + ') 0%, hsla(' + x + ',75%,45%,0) 70%) fixed').join(', ') + ', #0b0e15';
  }
  return null;
}

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
    LemurScale.set(settings.canvas || null, settings.kiosk || null);
    // Zemin: ayarda HA'nın görünüm arka planı biçiminde (resim, opaklık...) ya da CSS metni olarak verilebilir; HA kendisi çizer.
    const bg = settings.background || LP_DEFAULT_BG;
    window.__LHD_VIEWS = tabs.map((x) => x.id);   // kartın gezinmesi bilsin: hangi sekmelerin HA'da görünümü var
    return {
      views: tabs.map((tab) => {
        const v = {
          title: tab.name,
          path: tab.id,
          icon: tab.icon,
          type: 'panel',
          background: bg,
          cards: [{ type: 'custom:lemur-home-dashboard-card', tab: tab.id }]
        };
        if (settings.theme_name) v.theme = settings.theme_name;
        return v;
      })
    };
  }
}
