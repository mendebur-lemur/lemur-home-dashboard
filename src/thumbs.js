// Yönetim panelindeki seçimlerin küçük resimleri (v0.28.2): her seçenek ne yaptığını gösteren küçük bir çizimle.
// lhdTh(anahtar) → SVG; lhdSegX → resimli seçim düğmeleri; lhdThLook → bölüm/öğe görünümünün canlı küçük resmi.
// Eski Safari için ?. ve ?? yok.
const LHD_TH_A = '#F2A93B', LHD_TH_G = 'rgba(255,255,255,.28)', LHD_TH_D = 'rgba(255,255,255,.12)';
function lhdThR(x, y, w, h, c, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r === undefined ? 2 : r) + '" fill="' + c + '"/>'; }
function lhdThC(x, y, r, c, sw) { return sw ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="' + c + '" stroke-width="' + sw + '"/>' : '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>'; }
function lhdTh(key) {
  const A = LHD_TH_A, G = LHD_TH_G, D = LHD_TH_D, R = lhdThR, C = lhdThC;
  const bulbs = (cols) => [0, 1, 2].map((i) => C(14 + i * 18, 20, 5, cols[i])).join('');
  let s = '';
  switch (key) {
    // simge stili
    case 'icon_style:auto': s = bulbs([A, G, '#4FD1E6']) + R(6, 31, 52, 2, D); break;
    case 'icon_style:full': s = bulbs(['#FFC94A', '#4FD1E6', '#F472A6']); break;
    case 'icon_style:mono': s = bulbs(['#fff', '#fff', '#fff']); break;
    case 'icon_style:tint': s = bulbs([A, G, G]); break;
    // parlaklık çubuğu
    case 'bright.look:auto': s = R(16, 12, 32, 8, G) + R(10, 26, 44, 3, D, 1.5); break;
    case 'bright.look:box': s = R(8, 8, 48, 24, D, 5) + R(16, 12, 32, 8, G) + R(14, 25, 24, 3, A, 1.5) + R(38, 25, 12, 3, G, 1.5); break;
    // telefonda gezinme
    case 'phone.nav:cats': s = R(20, 2, 24, 36, D, 4) + R(20, 31, 24, 7, G, 0) + [0, 1, 2].map((i) => C(25 + i * 7, 34.5, 1.6, i ? '#fff' : A)).join(''); break;
    case 'phone.nav:rooms': s = R(20, 2, 24, 36, D, 4) + R(20, 31, 24, 7, G, 0) + [0, 1].map((i) => R(22 + i * 11, 33, 9, 3, i ? '#fff' : A, 1)).join(''); break;
    case 'phone.nav:top': s = R(20, 2, 24, 36, D, 4) + R(20, 2, 24, 7, G, 0) + [0, 1].map((i) => R(22 + i * 11, 4, 9, 3, i ? '#fff' : A, 1)).join(''); break;
    // telefonda ışıklar
    case 'phone.lights:auto': s = R(20, 2, 24, 36, D, 4) + R(23, 6, 8, 8, A) + R(33, 6, 8, 8, G) + R(23, 18, 18, 4, G, 1) + R(23, 25, 18, 4, G, 1); break;
    case 'phone.lights:tiles': case 'phlook:tiles': s = R(20, 2, 24, 36, D, 4) + [0, 1, 2, 3].map((i) => R(23 + (i % 2) * 10, 6 + Math.floor(i / 2) * 11, 8, 9, i ? G : A)).join(''); break;
    case 'phone.lights:rows': case 'phlook:rows': s = R(20, 2, 24, 36, D, 4) + [0, 1, 2, 3].map((i) => R(23, 6 + i * 7, 18, 5, i ? G : A, 1)).join(''); break;
    case 'phlook:': s = R(20, 2, 24, 36, D, 4) + R(23, 6, 8, 8, G) + R(33, 6, 8, 8, G) + R(23, 18, 18, 4, G, 1); break;
    // mevsim
    case 'season:auto': s = C(24, 20, 7, A) + '<path d="M40 13 v14 M33 20 h14 M35 15 l10 10 M45 15 l-10 10" stroke="#9fd3ff" stroke-width="2"/>'; break;
    case 'season:summer': s = C(32, 20, 8, A) + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const t = a * Math.PI / 180; return '<line x1="' + (32 + 11 * Math.cos(t)).toFixed(1) + '" y1="' + (20 + 11 * Math.sin(t)).toFixed(1) + '" x2="' + (32 + 14 * Math.cos(t)).toFixed(1) + '" y2="' + (20 + 14 * Math.sin(t)).toFixed(1) + '" stroke="' + A + '" stroke-width="2"/>'; }).join(''); break;
    case 'season:winter': s = '<path d="M32 8 v24 M20 20 h24 M24 12 l16 16 M40 12 l-16 16" stroke="#9fd3ff" stroke-width="2.4" stroke-linecap="round"/>'; break;
    // iklim kartı
    case 'clim:': s = R(8, 8, 48, 24, D, 5) + C(22, 20, 7, G, 3) + R(34, 15, 16, 4, G, 1) + R(34, 22, 10, 3, D, 1); break;
    case 'clim:halo': s = R(8, 4, 48, 32, D, 5) + C(32, 20, 10, A, 3.5) + R(28, 18, 8, 4, '#fff', 1); break;
    case 'clim:rows': s = R(8, 8, 48, 10, D, 3) + R(8, 22, 48, 10, D, 3) + C(14, 13, 2.5, A) + R(20, 11, 18, 4, G, 1) + C(14, 27, 2.5, G) + R(20, 25, 18, 4, G, 1); break;
    // kutu: doldur, hizala, aralık
    case 'fill:': s = R(10, 3, 44, 34, D, 4) + R(14, 7, 36, 6, G, 2) + R(14, 15, 36, 6, G, 2); break;
    case 'fill:1': s = R(10, 3, 44, 34, D, 4) + R(14, 7, 36, 13, A, 2) + R(14, 22, 36, 11, G, 2); break;
    case 'align:': s = R(10, 3, 44, 34, D, 4) + R(14, 7, 36, 5, G, 2) + R(14, 14, 36, 5, G, 2); break;
    case 'align:center': s = R(10, 3, 44, 34, D, 4) + R(14, 13, 36, 5, G, 2) + R(14, 21, 36, 5, G, 2); break;
    case 'align:spread': s = R(10, 3, 44, 34, D, 4) + R(14, 7, 36, 5, G, 2) + R(14, 28, 36, 5, G, 2); break;
    // öğe boyutu
    case 'size:': s = lhdThGrid(0, 0, 1, 1); break;
    case 'size:2x1': s = lhdThGrid(0, 0, 2, 1); break;
    case 'size:1x2': s = lhdThGrid(0, 0, 1, 2); break;
    case 'size:2x2': s = lhdThGrid(0, 0, 2, 2); break;
    case 'size:row': s = lhdThGrid(0, 0, 3, 1); break;
    default: {
      const m = /^gap:(\d*)$/.exec(key);
      if (m) { const g = m[1] === '' ? 8 : +m[1], w = (44 - g) / 2; s = R(10, 8, w, 24, G, 3) + R(10 + w + g, 8, w, 24, G, 3); break; }
      const c = /^cols:(\d+)$/.exec(key);
      if (c) { const n = +c[1], w = (44 - (n - 1) * 3) / n; for (let i = 0; i < n * 2; i++) s += R(10 + (i % n) * (w + 3), 8 + Math.floor(i / n) * 13, w, 11, i ? G : A); break; }
      const nv = /^nav:(\w+)$/.exec(key);
      if (nv) { const k = nv[1] === 'auto' ? 0 : +nv[1]; s = [0, 1, 2].map((i) => R(8 + i * 16, 22, 14, 14, D, 2)).join('') + (k ? R(8, 6, k * 16 - 2, 10, A, 2) : R(8, 6, 10, 10, A, 2) + R(20, 6, 10, 10, G, 2)) + R(k ? 8 + k * 16 : 44, 8, 10, 6, G, 1); break; }
      const sz = /^(icon|text)_size:(\w*)$/.exec(key);
      if (sz) { const f = { '': 14, s: 10, m: 14, l: 19 }[sz[2]] || 14; s = sz[1] === 'icon' ? C(32, 20, f / 1.6, A) : '<text x="32" y="' + (20 + f / 2.8) + '" font-size="' + f + '" text-anchor="middle" fill="#fff" font-weight="700" font-family="sans-serif">Aa</text>'; break; }
    }
  }
  return s ? '<svg class="th" viewBox="0 0 64 40" aria-hidden="true">' + s + '</svg>' : '';
}
function lhdThGrid(x, y, w, h) {
  let s = '';
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) s += lhdThR(14 + c * 12.5, 6 + r * 14.5, 11, 13, LHD_TH_D);
  return s + lhdThR(14 + x * 12.5, 6 + y * 14.5, w * 12.5 - 1.5, h * 14.5 - 1.5, LHD_TH_A);
}
// "panelle aynı" seçeneğinin küçük resmi
function lhdThSame() { return '<svg class="th" viewBox="0 0 64 40" aria-hidden="true"><rect x="12" y="6" width="40" height="28" rx="5" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M25 17 h14 M25 23 h14" stroke="rgba(255,255,255,.55)" stroke-width="2.4" stroke-linecap="round"/></svg>'; }
// resimli seçim: attr(değer) düğmenin özniteliklerini verir; opts [değer, ad, ipucu?, hazır resim?]; hiç resim yoksa düz seçim
function lhdSegX(attr, cur, opts, key) {
  const th = opts.map((o) => (o[3] !== undefined ? o[3] : (key ? lhdTh(key + ':' + o[0]) : '')));
  const any = th.some((x) => !!x);
  return '<div class="' + (any ? 'vseg' : 'seg') + '">' + opts.map((o, i) => '<button ' + attr(o[0]) + (String(cur) === String(o[0]) ? ' class="on"' : '') + (o[2] ? ' title="' + esc(o[2]) + '"' : '') + '>' +
    (any ? (th[i] || lhdThSame()) + '<span>' + esc(o[1]) + '</span>' : esc(o[1])) + '</button>').join('') + '</div>';
}
// bölüm ve öğe görünümlerinin canlı küçük resmi: bölümün kendi öğeleriyle (its: [{ic, nm}])
function lhdThLook(kind, its) {
  const L = its && its.length ? its : [{ ic: '', nm: '' }];
  const g = (i) => L[i % L.length];
  const nm = (x) => '<i>' + esc(x.nm || '') + '</i>';
  let h = '';
  if (kind === 'tile') h = '<div class="tl3">' + [0, 1, 2].map((i) => '<b' + (i ? '' : ' class="on"') + '>' + g(i).ic + nm(g(i)) + '</b>').join('') + '</div>';
  else if (kind === 'bar') h = '<div class="br2">' + [0, 1].map((i) => '<b' + (i ? '' : ' class="on"') + '>' + g(i).ic + nm(g(i)) + '<u style="width:' + (i ? 30 : 70) + '%"></u></b>').join('') + '</div>';
  else if (kind === 'phone') h = '<div class="ph3">' + [0, 1, 2].map((i) => '<b>' + g(i).ic + nm(g(i)) + '<s' + (i === 1 ? '' : ' class="on"') + '></s></b>').join('') + '</div>';
  else if (kind === 'itile') h = '<div class="it1"><b class="on">' + g(0).ic + nm(g(0)) + '</b></div>';
  else if (kind === 'ibutton') h = '<div class="ib1"><b class="on">' + g(0).ic + '</b>' + nm(g(0)) + '</div>';
  else if (kind === 'irow') h = '<div class="ir1"><b>' + g(0).ic + nm(g(0)) + '<s class="on"></s></b></div>';
  else if (kind === 'ihalo') h = '<div class="ih1"><b>' + g(0).ic + '</b>' + nm(g(0)) + '</div>';
  return '<div class="thh">' + h + '</div>';
}
