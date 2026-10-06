// Metinler: her metin tr ve en. Arayüzde marka adı geçmez.
const TXT = {
  tr: { home: 'Ev', other: 'Diğer', lights: 'IŞIKLAR', room_lights: '{area} IŞIKLARI', scenes: 'SENARYOLAR', shortcuts: 'KISAYOLLAR',
    control: 'EV KONTROL', other_control: 'DİĞER CİHAZLAR', media: 'MEDYA',
    empty: 'Bu sekmede gösterilecek cihaz yok. Yönetim panelinden ekleyebilirsin.',
    edit_empty: 'Boş bölüm · sağdan "Cihaz ekle" ya da başka bölümden bir öğeyi buraya sürükle', col_empty: 'Boş sütun · bir kutuyu ⠿ tutamağından tutup buraya sürükle ya da', add_section: 'Bölüm ekle', effects: 'Efektler', c_lights: 'Işıklar', c_climate: 'İklim', c_scenes: 'Senaryolar', c_other: 'Diğer', c_all: 'Tümü', cl_mode: 'Mod', cl_fan: 'Fan', cl_swing: 'Salınım', cl_now: 'şu an', cl_power: 'Güç', cl_vac: 'Süpürge', cl_stop: 'Durdur', cl_find: 'Bul', cl_suction: 'Emiş', too_full: 'Ekrana sığmıyor', drag_box: 'Kutuyu taşımak için tut ve sürükle',
    fb: 'Yedek yoldan kontrol edildi: {t}', heat: 'Isıtıyor', cool: 'Soğutuyor', idle: 'Beklemede', off: 'Kapalı', on: 'Açık', playing: 'Çalıyor', paused: 'Duraklatıldı', unavailable: 'Ulaşılamıyor', open: 'Açık', closed: 'Kapalı', opening: 'Açılıyor', closing: 'Kapanıyor',
    admin_title: 'Lemur Home Dashboard', admin_intro: 'Panonun sekmeleri, bölümleri ve boyutları burada düzenlenecek. (Yapım aşamasında)',
    reset: 'Varsayılana dön', save: 'Kaydet', saved: 'Kaydedildi', not_loaded: 'Lemur Home Dashboard entegrasyonu yüklü değil.' },
  en: { home: 'Home', other: 'Other', lights: 'LIGHTS', room_lights: '{area} LIGHTS', scenes: 'SCENES', shortcuts: 'SHORTCUTS',
    control: 'CONTROLS', other_control: 'OTHER DEVICES', media: 'MEDIA',
    empty: 'Nothing to show on this tab yet. Add devices from the admin panel.',
    edit_empty: 'Empty section · use "Add device" on the right or drag an item here from another section', col_empty: 'Empty sub-column · drag a box here by its ⠿ handle, or', add_section: 'Add section', effects: 'Effects', c_lights: 'Lights', c_climate: 'Climate', c_scenes: 'Scenes', c_other: 'Other', c_all: 'All', cl_mode: 'Mode', cl_fan: 'Fan', cl_swing: 'Swing', cl_now: 'now', cl_power: 'Power', cl_vac: 'Vacuum', cl_stop: 'Stop', cl_find: 'Locate', cl_suction: 'Suction', too_full: "Doesn't fit the screen", drag_box: 'Hold and drag to move the box',
    fb: 'Controlled through the backup: {t}', heat: 'Heating', cool: 'Cooling', idle: 'Idle', off: 'Off', on: 'On', playing: 'Playing', paused: 'Paused', unavailable: 'Unavailable', open: 'Open', closed: 'Closed', opening: 'Opening', closing: 'Closing',
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
