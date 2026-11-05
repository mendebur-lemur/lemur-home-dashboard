// Panoyu kendiliğinden oluşturma (2026-11-05). Entegrasyon eklenirken "Panoyu oluştur" açıksa, kurulumdan sonra
// açılan ilk yönetici sayfası panoyu oluşturur: lovelace/dashboards/create + lovelace/config/save
// ({ strategy: { type: custom:lemur-home-dashboard } }). Python tarafı bunu yapamıyor: HA pano listesini yalnız
// websocket üzerinden açıyor. Sunucu (lemur_home_dashboard/dashboard_claim) bir kez "evet" der; iki sekme aynı anda
// açıksa pano iki kez oluşmaz. Zaten aynı stratejiyi kullanan bir pano varsa yenisi açılmaz.
const LHD_STRAT = 'custom:lemur-home-dashboard';
function lhdAutoDash() {
  if (window.__LHD_AUTODASH) return;
  window.__LHD_AUTODASH = 1;
  let tries = 0;
  const wait = () => {
    const ha = document.querySelector('home-assistant'), h = ha && ha.hass;
    if (!h || !h.connection || !h.user) { if (++tries < 120) setTimeout(wait, 1000); return; }
    if (!h.user.is_admin) return;
    lhdAutoDashRun(ha, h).catch((e) => console.warn('Lemur Home Dashboard: pano oluşturulamadı', e && (e.message || e.code || e)));
  };
  setTimeout(wait, 1500);
}
async function lhdAutoDashRun(ha, h) {
  const c = h.connection, send = (m) => c.sendMessagePromise(m);
  const info = await send({ type: 'lemur_home_dashboard/info' });
  if (!info || !info.setup_dashboard) return;
  const list = (await send({ type: 'lovelace/dashboards/list' })) || [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].mode && list[i].mode !== 'storage') continue;
    try {
      const cfg = await send({ type: 'lovelace/config', url_path: list[i].url_path });
      if (cfg && cfg.strategy && cfg.strategy.type === LHD_STRAT) { await send({ type: 'lemur_home_dashboard/dashboard_claim' }); return; }
    } catch (e) { /* boş pano: config_not_found */ }
  }
  const claim = await send({ type: 'lemur_home_dashboard/dashboard_claim' });
  if (!claim || !claim.ok) return;
  const used = {}; list.forEach((d) => { used[d.url_path] = 1; });
  Object.keys(h.panels || {}).forEach((k) => { used[k] = 1; });
  let url = 'lemur-home', n = 2;
  while (used[url]) url = 'lemur-home-' + (n++);
  await send({ type: 'lovelace/dashboards/create', url_path: url, title: claim.title || 'Lemur Home Dashboard', icon: 'mdi:tablet-dashboard', show_in_sidebar: true, require_admin: false });
  await send({ type: 'lovelace/config/save', url_path: url, config: { strategy: { type: LHD_STRAT } } });
  const tr = String(h.language || '').toLowerCase().indexOf('tr') === 0;
  ha.dispatchEvent(new CustomEvent('hass-notification', { bubbles: true, composed: true,
    detail: { message: tr ? '"' + (claim.title || '') + '" panosu oluşturuldu; kenar çubuğunda.' : 'The "' + (claim.title || '') + '" dashboard was created; it is in the sidebar.' } }));
}
lhdAutoDash();
