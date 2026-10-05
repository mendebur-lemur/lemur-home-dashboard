// Şablon metin (A6): {{ }} ya da {% %} içeren ad / ikinci satır Home Assistant'ta çözülür (websocket render_template aboneliği).
// Her şablon bir kez abone olur; sonuç değişince o şablonu kullanan kartlar yeniden çizilir. Sonuç gelmeden '…' görünür.
const LP_TPL = window.__LEMUR_HD_TPL || (window.__LEMUR_HD_TPL = { m: {} });
const lpIsTpl = (s) => typeof s === 'string' && (s.indexOf('{{') >= 0 || s.indexOf('{%') >= 0);
function lpTpl(hass, tpl, onChange) {
  let e = LP_TPL.m[tpl];
  if (!e) {
    e = LP_TPL.m[tpl] = { v: null, cbs: [] };
    const conn = hass && hass.connection;
    if (conn && conn.subscribeMessage) {
      const p = conn.subscribeMessage((msg) => {
        const r = msg && Object.prototype.hasOwnProperty.call(msg, 'result') ? msg.result : (msg && msg.error ? '' : msg);
        e.v = r === null || r === undefined ? '' : (typeof r === 'object' ? JSON.stringify(r) : String(r));
        e.cbs.slice().forEach((f) => { try { f(); } catch (x) {} });
      }, { type: 'render_template', template: tpl, strict: false });
      if (p && p.then) p.then((u) => { e.unsub = u; }).catch(() => { e.v = ''; e.cbs.slice().forEach((f) => { try { f(); } catch (x) {} }); });
    } else e.v = '';
  }
  if (onChange && e.cbs.indexOf(onChange) < 0) e.cbs.push(onChange);
  return e.v;
}
