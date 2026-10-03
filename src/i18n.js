// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', scenes: 'SENARYOLAR', control: 'EV KONTROL', media: 'MEDYA',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', scenes: 'SCENES', control: 'CONTROLS', media: 'MEDIA',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Tabs, sections and sizes of the dashboard will be edited here. (Work in progress)',
    reset: 'Reset to defaults', save: 'Save', saved: 'Saved', not_loaded: 'The Lemur Home Dashboard integration is not loaded.' }
};
function pickLang(hass) {
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}
function t(lang, key) { const d = TXT[lang] || TXT.en; return d[key] !== undefined ? d[key] : (TXT.en[key] || key); }
