// Güvenlik denetimleri (Light Effect Card v1.6.1 ile aynı yaklaşım). Saf işlevler, DOM yok; tests/frontend_safe.test.js denetler.
// SVG simgeler HTML olarak eklenir: yalnız tek <svg>…</svg>, betik / olay / dış bağlantı yok (lemur-icons/birlestir.py ile aynı kurallar).
const LHD_ICON_BAD = /<script|<foreignObject|<iframe|<object|<embed|<image|<a[\s>]|<use[^>]*href\s*=\s*["'](?!#)|\son[a-z]+\s*=|javascript:|data:text|href\s*=\s*["'](?!#)|xlink:href\s*=\s*["'](?!#)|url\(\s*["']?(?!#)/i;
const lhdSafeSvg = (v) => typeof v === 'string' && v.length < 60000 && /^\s*<svg[\s>][\s\S]*<\/svg>\s*$/i.test(v) && !LHD_ICON_BAD.test(v) && (v.match(/<svg[\s>]/gi) || []).length === 1;
// simge seti dosyası: anahtar biçimi ve SVG'si temiz olanlar kalır
function lhdSafeIcons(d, keyRe) {
  const o = {};
  if (d && typeof d === 'object' && !Array.isArray(d)) Object.keys(d).forEach((k) => { if (keyRe.test(k) && lhdSafeSvg(d[k])) o[k] = d[k]; });
  return o;
}
// açılabilir adres: yalnız http(s):// ya da / ile başlayan yol (javascript:, data: vb. değil)
const lhdSafeUrl = (u) => typeof u === 'string' && (/^https?:\/\/[^\s"'<>]+$/i.test(u) || /^\/(?!\/)[^\s"'<>]*$/.test(u));
// servis adı ve besleme / bildirim için izinli alanlar (yönetici olmayan "Besledim" dediğinde entegrasyon yetkisiyle çalışır)
const LHD_SVC_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const LHD_FEEDER_DOMAINS = ['switch', 'button', 'input_button', 'timer', 'script', 'fan', 'number', 'select', 'esphome', 'notify', 'input_boolean', 'light'];
const lhdSafeFeederSvc = (s) => typeof s === 'string' && LHD_SVC_RE.test(s) && LHD_FEEDER_DOMAINS.indexOf(s.split('.')[0]) >= 0;
const lhdSafeNotify = (s) => typeof s === 'string' && /^notify\.[a-z0-9_]+$/.test(s);
const lhdIsObj = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// eylem: pencere içeriği olarak yalnız kart (html alanı atılır), url eyleminde güvenli adres
function lhdCleanAction(a) {
  if (!lhdIsObj(a)) return a;
  const o = Object.assign({}, a);
  if (lhdIsObj(o.popup)) { const p = {}; if (typeof o.popup.title === 'string') p.title = o.popup.title.slice(0, 200); if (lhdIsObj(o.popup.card)) p.card = o.popup.card; o.popup = p; }
  else if ('popup' in o) delete o.popup;
  if (o.action === 'url' && !lhdSafeUrl(o.url_path)) delete o.url_path;
  return o;
}
// sekmeler: eylemleri temizle, sayıları sayı yap (grow, gap), bozuk öğeleri at
function lhdCleanTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.filter(lhdIsObj).slice(0, 60).map((t) => {
    const T = Object.assign({}, t);
    T.sections = (Array.isArray(t.sections) ? t.sections : []).filter(lhdIsObj).slice(0, 80).map((s) => {
      const S = Object.assign({}, s);
      if ('grow' in S) { const g = parseFloat(S.grow); if (g > 0 && g < 100) S.grow = g; else delete S.grow; }
      if ('gap' in S) { const g = parseFloat(S.gap); if (g >= 0 && g <= 60) S.gap = g; else delete S.gap; }
      S.entities = (Array.isArray(s.entities) ? s.entities : []).filter((x) => typeof x === 'string' || lhdIsObj(x)).slice(0, 200).map((x) => {
        if (typeof x === 'string') return x;
        const it = Object.assign({}, x);
        ['tap', 'hold', 'action'].forEach((k) => { if (k in it) it[k] = lhdCleanAction(it[k]); });
        return it;
      });
      return S;
    });
    return T;
  });
}
// hayvanlar: biçim, izinli besleme servisi ve bildirim hedefi; en çok 50 hayvan
function lhdCleanPets(p) {
  const out = {};
  if (!lhdIsObj(p)) return out;
  Object.keys(p).slice(0, 50).forEach((id) => {
    const x = p[id];
    if (!/^[a-z0-9_-]{1,40}$/.test(id) || !lhdIsObj(x)) return;
    const o = { name: String(x.name || id).slice(0, 60), kind: ['cat', 'dog', 'fish', 'bird', 'rabbit', 'turtle', 'other'].indexOf(x.kind) >= 0 ? x.kind : 'other', mode: x.mode === 'times' ? 'times' : 'interval' };
    const n = (v, lo, hi, d) => { const f = parseFloat(v); return f >= lo && f <= hi ? f : d; };
    o.every_h = n(x.every_h, 0.1, 720, 12); o.soon_min = n(x.soon_min, 0, 1440, 60); o.grace_min = n(x.grace_min, 0, 1440, 30);
    o.times = (Array.isArray(x.times) ? x.times : []).filter((t) => typeof t === 'string' && /^\d{1,2}:\d{2}$/.test(t)).slice(0, 24);
    if (typeof x.icon === 'string' && /^[a-z]+:[a-z0-9-]+$/.test(x.icon)) o.icon = x.icon;
    if (lhdSafeNotify(x.notify)) o.notify = x.notify;
    const f = x.feeder;
    if (lhdIsObj(f) && lhdSafeFeederSvc(f.service)) {
      o.feeder = { service: f.service };
      if (typeof f.target === 'string' && /^[a-z0-9_]+\.[a-z0-9_]+$/.test(f.target)) o.feeder.target = f.target;
      if (lhdIsObj(f.data)) o.feeder.data = f.data;
    }
    out[id] = o;
  });
  return out;
}

// Canlı abonelik, HA yeniden başlayınca da sürsün: websocket kütüphanesi dönüşte aboneliği kendisi yenilemeye çalışır ama
// entegrasyon o an henüz yüklenmemişse "Unknown command" alır ve abonelik sessizce ölür (tablet ayar değişikliklerini
// sayfa yenilenene kadar görmezdi). Burada yenilemeyi biz yaparız: bağlantı her hazır olduğunda yeniden abone olunur,
// komut henüz yoksa 5 sn arayla denenir; onReady o sırada güncel veriyi yeniden ister.
function lhdLiveSub(conn, msg, onMsg, onReady) {
  if (!conn || !conn.subscribeMessage) return;
  let gen = 0;
  const go = (g, n) => {
    if (g !== gen) return;
    conn.subscribeMessage(onMsg, msg, { resubscribe: false }).catch((e) => {
      if (g === gen && n < 36 && e && e.code === 'unknown_command') setTimeout(() => go(g, n + 1), 5000);
    });
  };
  go(gen, 0);
  if (conn.addEventListener) conn.addEventListener('ready', () => { gen++; const g = gen; go(g, 0); if (onReady) onReady(g === gen); });
  // bekçi: yeniden bağlanmalarda abonelik nadiren yine de kayboluyor (canlı HA'da görüldü); 30 sn'de bir bakılır,
  // bağlantı açıkken kütüphanenin abonelik listesinde bizimki yoksa yeniden abone olunur ve güncel veri istenir
  setInterval(() => {
    const m = conn.commands;
    if (!conn.connected || !m || typeof m.forEach !== 'function') return;
    let ok = false; m.forEach((v) => { if (v && v.callback === onMsg) ok = true; });
    if (!ok) { gen++; go(gen, 0); if (onReady) onReady(true); }
  }, 30000);
}
// istek, entegrasyon henüz yüklenmemişse (HA açılıyor) birkaç kez yeniden denenir
function lhdRetryMsg(conn, msg, n) {
  return conn.sendMessagePromise(msg).catch((e) => {
    if ((n || 0) < 36 && e && e.code === 'unknown_command') return new Promise((r) => setTimeout(r, 5000)).then(() => lhdRetryMsg(conn, msg, (n || 0) + 1));
    throw e;
  });
}
