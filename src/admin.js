// lemur-panel-admin: sol menüdeki yönetim paneli. TASLAK: şimdilik ayarları gösterir, varsayılana dönebilir.
// Hedef: Light Effect Card'ın kontrol paneli düzeninde sekme/bölüm/cihaz/boyut düzenleme, sürükle-bırak, canlı önizleme.
class LemurPanelAdmin extends HTMLElement {
  set hass(h) { const first = !this._hass; this._hass = h; if (first) STORE.load(h).then(() => this._render()).catch(() => this._render()); }
  set narrow(v) { this._narrow = v; }
  set panel(p) { this._panel = p; }
  _render() {
    const lang = pickLang(this._hass);
    const d = STORE.data;
    this.innerHTML = '<div style="padding:24px;max-width:960px;font-family:var(--primary-font-family, sans-serif);color:var(--primary-text-color)">' +
      '<h1 style="margin:0 0 8px">' + t(lang, 'admin_title') + '</h1><p>' + t(lang, 'admin_intro') + '</p>' +
      (d ? '<button id="reset">' + t(lang, 'reset') + '</button><pre style="white-space:pre-wrap;font-size:12px;opacity:.8">' + esc(JSON.stringify(d, null, 2)) + '</pre>' : '<p>' + t(lang, 'not_loaded') + '</p>') + '</div>';
    const r = this.querySelector('#reset');
    if (r) r.addEventListener('click', () => STORE.set('tabs', []).then(() => this._render()));
  }
}
