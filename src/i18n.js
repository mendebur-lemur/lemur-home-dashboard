// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', room_lights: '{area} IŞIKLARI', scenes: 'SENARYOLAR', shortcuts: 'KISAYOLLAR',
    control: 'EV KONTROL', other_control: 'DİĞER CİHAZLAR', media: 'MEDYA',
    empty: 'Bu sekmede gösterilecek cihaz yok. Yönetim panelinden ekleyebilirsin.',
    heat: 'Isıtıyor', cool: 'Soğutuyor', idle: 'Beklemede', off: 'Kapalı', on: 'Açık', playing: 'Çalıyor', paused: 'Duraklatıldı', unavailable: 'Ulaşılamıyor',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', room_lights: '{area} LIGHTS', scenes: 'SCENES', shortcuts: 'SHORTCUTS',
    control: 'CONTROLS', other_control: 'OTHER DEVICES', media: 'MEDIA',
    empty: 'Nothing to show on this tab yet. Add devices from the admin panel.',
    heat: 'Heating', cool: 'Cooling', idle: 'Idle', off: 'Off', on: 'On', playing: 'Playing', paused: 'Paused', unavailable: 'Unavailable',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Tabs, sections and sizes of the dashboard will be edited here. (Work in progress)',
    reset: 'Reset to defaults', save: 'Save', saved: 'Saved', not_loaded: 'The Lemur Home Dashboard integration is not loaded.' }
};
// Dil: ayarda tr/en seçildiyse o, yoksa (auto) kullanıcının HA arayüz dili.
function pickLang(hass) {
  const st = window.__LEMUR_HOME_DASHBOARD_STORE, set = st && st.data && st.data.settings && st.data.settings.language;
  if (set === 'tr' || set === 'en') return set;
  const l = (hass && ((hass.locale && hass.locale.language) || hass.language)) || 'en';
  return String(l).toLowerCase().indexOf('tr') === 0 ? 'tr' : 'en';
}
function t(lang, key, vars) {
  const d = TXT[lang] || TXT.en;
  let s = d[key] !== undefined ? d[key] : (TXT.en[key] !== undefined ? TXT.en[key] : key);
  if (vars) Object.keys(vars).forEach((k) => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}
// Türkçe büyük harf (i → İ, ı → I). Eski Safari'de yerel ayarlı dönüşüm yoksa elle yapılır.
function upper(lang, s) {
  s = String(s);
  if (lang === 'tr') s = s.replace(/i/g, 'İ').replace(/ı/g, 'I');
  return s.toUpperCase();
}
