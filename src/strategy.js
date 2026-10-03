// Pano stratejisi: `strategy: { type: custom:lemur-home-dashboard }` yazılan pano bu sınıfla üretilir.
// HA kuralı: custom:lemur-home-dashboard → <ll-strategy-dashboard-lemur-home-dashboard>, static generate(config, hass).

// Varsayılan zemin: tablet panosundaki arka plan resminin kendisi neredeyse düz koyu lacivert (#0b0e15), kenarlara doğru
// hafif kararıyor. Resim dosyası gerekmesin diye aynısı CSS ile çiziliyor.
const LP_DEFAULT_BG = 'radial-gradient(ellipse at center, #0b0e15 0%, #0b0e15 55%, #0a0c13 100%) fixed';

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
    // Zemin: ayarda HA'nın görünüm arka planı biçiminde (resim, opaklık...) ya da CSS metni olarak verilebilir; HA kendisi çizer.
    const bg = settings.background || LP_DEFAULT_BG;
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
