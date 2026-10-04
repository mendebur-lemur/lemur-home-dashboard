// Küçük YAML okuyucu/yazıcı: yönetim panelinde "Kart (YAML)" ve "Pencerede kart aç" kutuları için.
// HA kart ayarlarında kullanılan kadarı: girintili eşlemeler ve listeler, tırnaklı/tırnaksız metin, sayı, true/false/null,
// tek satırlık [a, b] ve {a: 1}, çok satırlı | ve > metinleri, # yorumları. JSON da yazılabilir (YAML'ın alt kümesi).
// Hatalı metinde Error fırlatır (mesajda satır numarası).
function lhdYamlScalar(s) {
  s = s.trim();
  if (s === '' || s === '~' || s === 'null' || s === 'Null' || s === 'NULL') return null;
  if (s === 'true' || s === 'True' || s === 'TRUE') return true;
  if (s === 'false' || s === 'False' || s === 'FALSE') return false;
  if (s[0] === '"') { try { return JSON.parse(s); } catch (e) { throw new Error('"' + s + '"'); } }
  if (s[0] === "'") { if (s[s.length - 1] !== "'") throw new Error(s); return s.slice(1, -1).replace(/''/g, "'"); }
  if (s[0] === '[' || s[0] === '{') return lhdYamlFlow(s);
  if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s) && !/^0\d/.test(s)) return Number(s);
  return s;
}
// tek satırlık [a, b, {c: 1}] ve {a: 1, b: [x]}
function lhdYamlFlow(src) {
  let i = 0;
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const val = (stop) => {
    ws();
    if (src[i] === '[') { i++; const a = []; ws(); if (src[i] === ']') { i++; return a; } for (;;) { a.push(val(',]')); ws(); if (src[i] === ',') { i++; continue; } if (src[i] === ']') { i++; return a; } throw new Error(src); } }
    if (src[i] === '{') {
      i++; const o = {}; ws(); if (src[i] === '}') { i++; return o; }
      for (;;) {
        ws(); const k = val(':,}'); ws();
        if (src[i] !== ':') throw new Error(src);
        i++; o[String(k)] = val(',}'); ws();
        if (src[i] === ',') { i++; continue; } if (src[i] === '}') { i++; return o; } throw new Error(src);
      }
    }
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; let j = i + 1;
      while (j < src.length && !(src[j] === q && (q === "'" ? src[j + 1] !== "'" : src[j - 1] !== '\\'))) j += (q === "'" && src[j] === "'" ? 2 : 1);
      const r = lhdYamlScalar(src.slice(i, j + 1)); i = j + 1; return r;
    }
    let j = i;
    while (j < src.length && stop.indexOf(src[j]) < 0) j++;
    const r = lhdYamlScalar(src.slice(i, j)); i = j; return r;
  };
  const r = val('');
  ws(); if (i < src.length) throw new Error(src);
  return r;
}
// satırdaki yorumu sil (tırnak içindeki # hariç; # öncesinde boşluk olmalı)
function lhdYamlStrip(l) {
  let q = null;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { if (i === 0 || /[\s:[{,-]/.test(l[i - 1])) q = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(l[i - 1]))) return l.slice(0, i);
  }
  return l;
}
// "anahtar: değer" ayır (tırnaklı anahtar olabilir); eşleme satırı değilse null
function lhdYamlKey(t) {
  let m = /^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')\s*:(\s+|$)/.exec(t);
  if (m) return { k: lhdYamlScalar(m[1]), rest: t.slice(m[0].length) };
  m = /^([^\s:#[\]{},"'][^:#]*?|[^\s:#[\]{},"'])\s*:(\s+|$)/.exec(t);
  if (m) return { k: m[1].trim(), rest: t.slice(m[0].length) };
  return null;
}
function lhdYamlParse(text) {
  text = String(text || '').replace(/\r\n?/g, '\n').replace(/\t/g, '  ');
  const tt = text.trim();
  if (!tt) return null;
  if (tt[0] === '{' || tt[0] === '[') { try { return JSON.parse(tt); } catch (e) { /* YAML akış biçimi olabilir */ } }
  const raw = text.split('\n');
  const L = [];   // { n: satır no, ind, t: metin, raw }
  raw.forEach((r, n) => { const s = lhdYamlStrip(r); if (s.trim() && s.trim() !== '---') L.push({ n: n + 1, ind: s.length - s.replace(/^ +/, '').length, t: s.trim(), raw: r }); });
  let p = 0;
  const fail = (l) => { const e = new Error('YAML (' + l.n + ')'); e.line = l.n; throw e; };
  // | ve > çok satırlı metin: ham satırlardan okunur (yorum silinmez, boş satırlar korunur)
  const block = (hdr, parentInd, startLine) => {
    const out = [];
    let i = startLine, ind = -1;
    while (i < raw.length) {
      const r = raw[i].replace(/\t/g, '  ');
      if (!r.trim()) { out.push(''); i++; continue; }
      const ri = r.length - r.replace(/^ +/, '').length;
      if (ri <= parentInd) break;
      if (ind < 0) ind = ri;
      out.push(r.slice(Math.min(ind, ri))); i++;
    }
    while (out.length && out[out.length - 1] === '') out.pop();
    while (p < L.length && L[p].n <= i) p++;
    let s = hdr[0] === '>' ? out.join('\n').replace(/([^\n])\n(?=[^\n ])/g, '$1 ') : out.join('\n');
    if (hdr.indexOf('-') < 0) s += '\n';
    return s;
  };
  const value = (rest, l, ind) => {
    rest = rest.trim();
    if (/^[|>][-+]?$/.test(rest)) return block(rest, ind, l.n);
    if (rest !== '') return lhdYamlScalar(rest);
    if (p < L.length && L[p].ind > ind) return node(L[p].ind);
    if (p < L.length && L[p].ind === ind && /^-(\s|$)/.test(L[p].t)) return node(ind);   // "anahtar:" altındaki liste aynı girintide olabilir
    return null;
  };
  const node = (ind) => {
    const l0 = L[p];
    if (/^-(\s|$)/.test(l0.t)) {
      const arr = [];
      while (p < L.length && L[p].ind === ind && /^-(\s|$)/.test(L[p].t)) {
        const l = L[p], rest = l.t.slice(1).replace(/^ +/, ''), sub = ind + (l.t.length - rest.length);
        p++;
        if (!rest) { arr.push(p < L.length && L[p].ind > ind ? node(L[p].ind) : null); continue; }
        const kv = lhdYamlKey(rest);
        if (kv && !/^[[{"']/.test(rest)) {   // "- anahtar: değer" → eşleme, devamı aynı girintide
          const o = {}; o[kv.k] = value(kv.rest, l, sub);
          while (p < L.length && L[p].ind === sub) {
            const k2 = lhdYamlKey(L[p].t); if (!k2) fail(L[p]);
            const l2 = L[p]; p++; o[k2.k] = value(k2.rest, l2, sub);
          }
          arr.push(o);
        } else arr.push(value(rest, l, ind));
      }
      return arr;
    }
    const o = {};
    while (p < L.length && L[p].ind === ind) {
      const l = L[p], kv = lhdYamlKey(l.t);
      if (!kv) { if (Object.keys(o).length === 0 && p === 0) { p++; return lhdYamlScalar(l.t); } fail(l); }
      p++;
      o[kv.k] = value(kv.rest, l, ind);
    }
    return o;
  };
  const r = node(L[0].ind);
  if (p < L.length) fail(L[p]);
  return r;
}
// YAML yazıcı: düzenleme kutusunda gösterilecek metin
function lhdYamlDump(v, ind) {
  ind = ind || '';
  const sc = (x) => {
    if (x === null || x === undefined) return 'null';
    if (typeof x === 'number' || typeof x === 'boolean') return String(x);
    const s = String(x);
    if (s === '' || /^[\s]|[\s]$|^[-?:,[\]{}#&*!|>'"%@`]|: | #|^(true|false|null|yes|no|on|off|~)$/i.test(s) || /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(s)) return JSON.stringify(s);
    return s;
  };
  const multi = (s, i2) => typeof s === 'string' && s.indexOf('\n') >= 0 ? '|' + (/\n$/.test(s) ? '' : '-') + '\n' + s.replace(/\n$/, '').split('\n').map((x) => (x ? i2 + x : '')).join('\n') : null;
  if (Array.isArray(v)) {
    if (!v.length) return ind + '[]';
    return v.map((x) => {
      if (x && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length) { const d = lhdYamlDump(x, ind + '  '); return ind + '- ' + d.slice(ind.length + 2); }
      if (Array.isArray(x) && x.length) return ind + '-\n' + lhdYamlDump(x, ind + '  ');
      const m = multi(x, ind + '  ');
      return ind + '- ' + (m || (Array.isArray(x) ? '[]' : (x && typeof x === 'object') ? '{}' : sc(x)));
    }).join('\n');
  }
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    if (!ks.length) return ind + '{}';
    return ks.map((k) => {
      const x = v[k], kk = /^[A-Za-z_][\w-]*$/.test(k) ? k : JSON.stringify(k);
      if (x && typeof x === 'object' && (Array.isArray(x) ? x.length : Object.keys(x).length)) return ind + kk + ':\n' + lhdYamlDump(x, ind + '  ');
      const m = multi(x, ind + '  ');
      return ind + kk + ': ' + (m || (Array.isArray(x) ? '[]' : (x && typeof x === 'object') ? '{}' : sc(x)));
    }).join('\n');
  }
  return ind + sc(v);
}
