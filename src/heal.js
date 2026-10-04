// Önbellek koruması (Light Effect Card'daki heal.js'in uyarlaması).
// Home Assistant'ın service worker'ı sunduğu her sayfanın bir kopyasını saklar. Güncellemeden önce alınmış bir kopya eski
// pano dosyasını (?v=eski) çağırır, tarayıcı da o dosyayı saklar; böylece güncellemeden sonra eski pano geri gelebilir.
// Paket en başta bu eski kopyaları ve ?v= değeri farklı eski lemur dosyalarını siler; bir sonraki açılış bu sürümü alır.
// Bu sayfada daha eski bir pano önce yüklendiyse sayfa bir kez yenilenir (sessionStorage bayrağıyla, döngüye girmez).
(() => {
  const V = '__VERSION__';
  const older = !!customElements.get('lemur-home-dashboard-card') && window.__LEMUR_HD_VER !== V;
  const heal = async () => {
    if (!window.caches) return 0;
    let n = 0;
    for (const k of await caches.keys()) {
      const c = await caches.open(k);
      for (const r of await c.keys()) {
        const u = r.url;
        if (/\/lemur_home_dashboard\/(lemur-home-dashboard\.js|mdi-color\.json|lec-icons\.json)\?v=/.test(u)) { if (!u.includes('v=' + V)) { await c.delete(r); n++; } continue; }
        let p; try { p = new URL(u).pathname; } catch (e) { continue; }
        if (/\.[a-z0-9]{1,5}$/i.test(p)) continue;   // yalnızca sayfalar
        const res = await c.match(r); if (!res) continue;
        const m = (await res.clone().text()).match(/lemur-home-dashboard\.js\?v=([0-9.]+)/);
        if (m && m[1] !== V) { await c.delete(r); n++; }
      }
    }
    return n;
  };
  window.__LEMUR_HD_HEAL = () => heal().catch(() => 0);
  const run = () => window.__LEMUR_HD_HEAL().then(() => {
    if (!older) return;
    try { const f = 'lemur-hd-heal-' + V; if (!sessionStorage.getItem(f)) { sessionStorage.setItem(f, '1'); location.reload(); } } catch (e) {}
  });
  if (older) run(); else setTimeout(run, 8000);
})();
