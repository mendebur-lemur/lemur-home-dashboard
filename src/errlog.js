// Son hatalar (Sorun bildir için): yalnızca panoya ait dosyalardan gelen hatalar, en çok 10 tane. Varlık kimlikleri
// (light.salon gibi) kayda girmeden önce silinir; kişisel bilgi tutulmaz.
(() => {
  if (window.__LEMUR_HD_ERRH) return;
  window.__LEMUR_HD_ERRH = 1;
  const L = window.__LEMUR_HD_ERR = [];
  const add = (m, src) => {
    if (!/lemur[-_]home[-_]dashboard|lemur-hd-/i.test(String(src || ''))) return;
    const msg = String(m || '?').replace(/\b[a-z_]+\.[a-z0-9_]+\b/g, '<varlık>').slice(0, 160);
    L.push(new Date().toTimeString().slice(0, 8) + ' ' + msg);
    if (L.length > 10) L.shift();
  };
  window.addEventListener('error', (e) => add(e.message, (e.filename || '') + ' ' + ((e.error && e.error.stack) || '')));
  window.addEventListener('unhandledrejection', (e) => { const r = e.reason; add((r && r.message) || r, r && r.stack); });
})();
