"""Weekly review of waiting submissions (run by hand or by a scheduled task; a person merges the result).

  gh issue list -R mendebur-lemur/lemur-home-dashboard -l bekliyor --state open --limit 200 --json number,title,body,author,createdAt > pending.json
  python library/tools/review.py pending.json                 → report (markdown): per submission ok / hold / reject with reasons
  python library/tools/review.py pending.json --accept 12,15  → writes library/models/<key>.json and rebuilds library/library.json

Checks on top of the format: the same model's other submissions (median, how far off), features (integration, color modes,
temperature range) against the ones already accepted, the open library's rated / max power for the model, patterns across
submitters (one account sending many models, two identical tables). Only numbers and fixed fields are read; free text never.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import statistics
import sys
from datetime import date
from pathlib import Path

from common import AGREE, ROOT, check, parse, per_meter

LIB = ROOT / "library"


def _vals(t: dict) -> list[float]:
    out = []
    if t.get("ct"):
        out += [x for r in t["ct"]["w"] for x in r]
    if t.get("hs"):
        out += [x for p in t["hs"]["w"] for r in p for x in r]
    if t.get("br"):
        out += list(t["br"]["w"])
    return out


def _models() -> dict:
    out = {}
    for f in (LIB / "models").glob("*.json"):
        try:
            out[f.stem] = json.loads(f.read_text(encoding="utf-8"))
        except ValueError:
            continue
    return out


def _fname(k: str) -> str:
    return k.replace("|", "__") or "x"


def by_hash(login: str) -> str:
    """Who sent it, without keeping the account name in the pool: the same account gives the same short code."""
    return hashlib.sha256(("lhd|" + str(login or "?").casefold()).encode()).hexdigest()[:12]


CELL_MED = 0.10    # iki tablonun ortak hücrelerinde ortanca fark (en yüksek güce oranla) en çok bu kadar
CELL_FAR = 0.30    # bu kadardan fazla ayrılan hücre "uzak" sayılır
FAR_SHARE = 0.10   # uzak hücreler ortak hücrelerin en çok bu kadarı olabilir
CELLS_MIN = 12     # karşılaştırmak için en az bu kadar ortak hücre gerekir


def _cells(t: dict) -> dict:
    """Every cell of a table by where it sits: {(mode, color, brightness): watts}."""
    out = {}
    c = t.get("ct")
    if c:
        for i, k in enumerate(c["k"]):
            for j, b in enumerate(c["b"]):
                out[("ct", k, b)] = c["w"][i][j]
    h = t.get("hs")
    if h:
        for si, s in enumerate(h["s"]):
            for hi, hue in enumerate(h["h"]):
                for j, b in enumerate(h["b"]):
                    out[("hs", s, hue, b)] = h["w"][si][hi][j]
    r = t.get("br")
    if r:
        for j, b in enumerate(r["b"]):
            out[("br", b)] = r["w"][j]
    return out


def agrees(a: dict, b: dict) -> tuple[bool, str]:
    """Two submissions of one model: same color modes and integration, highest power within AGREE, and (v0.32.1) the
    tables close to each other cell by cell. Only the highest power was compared before: a made-up table with the right
    peak joined by itself and moved the model's values for everyone."""
    ca, cb = (a.get("caps") or {}).get("color_modes"), (b.get("caps") or {}).get("color_modes")
    if ca and cb and sorted(ca) != sorted(cb):
        return False, "renk modları farklı"
    if a.get("integration") and b.get("integration") and a["integration"] != b["integration"]:
        return False, f"entegrasyon farklı ({a['integration']} / {b['integration']})"
    ha, hb = max(_vals(per_meter(a))), max(_vals(per_meter(b)))
    dev = abs(ha - hb) / max(ha, hb) if max(ha, hb) else 0
    if dev > AGREE:
        return False, f"en yüksek {ha:.1f} W / {hb:.1f} W (%{dev * 100:.0f} fark)"
    ca2, cb2 = _cells(per_meter(a)), _cells(per_meter(b))
    common = [k for k in ca2 if k in cb2]
    if len(common) < CELLS_MIN:
        return False, f"tablolar aynı adımlarla ölçülmemiş ({len(common)} ortak hücre), hücre hücre karşılaştırılamadı"
    top = max(ha, hb) or 1.0
    diffs = sorted(abs(ca2[k] - cb2[k]) / top for k in common)
    med = diffs[len(diffs) // 2]
    far = sum(1 for d in diffs if d > CELL_FAR) / len(diffs)
    if med > CELL_MED or far > FAR_SHARE:
        return False, f"tablolar birbirini tutmuyor (ortanca fark %{med * 100:.0f}, uzak hücre %{far * 100:.0f})"
    return True, f"en yüksek {ha:.1f} W / {hb:.1f} W (%{dev * 100:.0f} fark), {len(common)} hücrede ortanca fark %{med * 100:.0f}"


def add_sub(c: dict, n, by: str = "") -> None:
    """Writes one accepted submission into library/models (the same issue replaces its earlier copy); rebuild() after."""
    c = dict(c, issue=n, date=date.today().isoformat())
    if by:
        c["by"] = by
    f = _fname(c["key"])
    path = LIB / "models" / (f + ".json")
    try:
        m = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        m = {"subs": []}
    m["subs"] = [s for s in m.get("subs") or [] if s.get("issue") != n] + [c]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(m, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


def review(pending: list) -> list[dict]:
    have = _models()
    by_author: dict[str, set] = {}
    rows = []
    for it in pending:
        p = parse(it.get("body") or "")
        errs, c = check(p) if p else (["veri yok"], {})
        a = ((it.get("author") or {}).get("login")) or "?"
        r = {"n": it.get("number"), "author": a, "errs": errs, "c": c, "notes": [], "verdict": "reject" if errs else "ok"}
        if c:
            by_author.setdefault(a, set()).add(c["key"])
            k = c["key"]
            old = have.get(_fname(k), {}).get("subs", [])
            if old:
                caps0 = old[0].get("caps", {})
                if caps0.get("color_modes") and sorted(caps0["color_modes"]) != sorted(c["caps"]["color_modes"]):
                    r["notes"].append("renk modları kabul edilenlerden farklı"); r["verdict"] = "hold"
                if old[0].get("integration") and c["integration"] and old[0]["integration"] != c["integration"]:
                    r["notes"].append(f"entegrasyon farklı ({old[0]['integration']} / {c['integration']})"); r["verdict"] = "hold"
                hi_old = statistics.median([max(_vals(per_meter(s))) for s in old])
                hi_new = max(_vals(per_meter(c)))
                dev = abs(hi_new - hi_old) / hi_old if hi_old else 0
                r["notes"].append(f"en yüksek {hi_new:.1f} W, kabul edilenlerin ortası {hi_old:.1f} W (%{dev*100:.0f} fark)")
                if dev > 0.25:
                    r["verdict"] = "hold"
            else:
                r["notes"].append("bu modelin ilk ölçümü: elle onay"); r["verdict"] = "hold" if r["verdict"] == "ok" else r["verdict"]
        rows.append(r)
    for r in rows:   # örüntüler
        if r["c"] and len(by_author.get(r["author"], ())) >= 6:
            r["notes"].append(f"aynı hesap bu hafta {len(by_author[r['author']])} model gönderdi"); r["verdict"] = "hold" if r["verdict"] == "ok" else r["verdict"]
    seen: dict[str, int] = {}
    for r in rows:
        if r["c"]:
            sig = json.dumps(r["c"]["lut"], sort_keys=True)
            if sig in seen:
                r["notes"].append(f"#{seen[sig]} ile birebir aynı tablo"); r["verdict"] = "reject"
            seen[sig] = r["n"]
    return rows


def report(rows: list[dict]) -> str:
    out = ["| # | Model | Karar | Neden |", "|---|---|---|---|"]
    for r in rows:
        c = r["c"]
        nm = f"{c.get('manufacturer','?')} {c.get('model_id') or c.get('model','')}" + (f" ({c['length_m']} m)" if c.get("strip") else "") if c else "?"
        out.append(f"| {r['n']} | {nm} | {dict(ok='kabul', hold='beklet', reject='ret')[r['verdict']]} | {'; '.join(r['errs'] + r['notes']) or '-'} |")
    return "\n".join(out)


def _median_table(tabs: list[dict]) -> dict:
    t0 = json.loads(json.dumps(tabs[0]))
    same = [t for t in tabs if all((t.get(k) or {}).get(ax) == (t0.get(k) or {}).get(ax) for k in ("ct", "hs", "br") for ax in ("k", "h", "s", "b"))]
    def med(path):
        return round(statistics.median(path(t) for t in same), 3)
    if t0.get("ct"):
        t0["ct"]["w"] = [[med(lambda t, i=i, j=j: t["ct"]["w"][i][j]) for j in range(len(t0["ct"]["b"]))] for i in range(len(t0["ct"]["k"]))]
    if t0.get("hs"):
        t0["hs"]["w"] = [[[med(lambda t, a=a, i=i, j=j: t["hs"]["w"][a][i][j]) for j in range(len(t0["hs"]["b"]))] for i in range(len(t0["hs"]["h"]))] for a in range(len(t0["hs"]["s"]))]
    if t0.get("br"):
        t0["br"]["w"] = [med(lambda t, j=j: t["br"]["w"][j]) for j in range(len(t0["br"]["b"]))]
    return t0


def _standby(subs: list) -> float:
    """Median of the standbys a plug could read; 0.0 when none could (the dashboard then counts its own floor)."""
    v = [s["standby"] for s in subs if isinstance(s.get("standby"), (int, float)) and s["standby"] >= 0.1]
    return round(statistics.median(v), 3) if v else 0.0


def rebuild() -> None:
    models = {}
    for k, m in _models().items():
        subs = m.get("subs") or []
        if not subs:
            continue
        s0 = subs[0]
        tabs = [per_meter(s) for s in subs]
        his = [max(_vals(t)) for t in tabs]
        agree = (max(his) - min(his)) / statistics.median(his) if len(his) > 1 and statistics.median(his) else None
        caps = [s["adapter_w"] for s in subs if s.get("adapter_w")]
        models[s0.get("key") or k] = {"manufacturer": s0["manufacturer"], "model": s0["model_id"] or s0["model"], "aliases": sorted({x for s in subs for x in (s["model"], s["model_id"]) if x}),
                     "n": len(subs), "agree": round(agree, 3) if agree is not None else None, "updated": max(s.get("date", "") for s in subs),
                     "standby": _standby(subs), "lut": _median_table(tabs), "mains_v": s0.get("mains_v", 230),
                     "strip": bool(s0.get("strip")), "per_m": bool(s0.get("strip")), "cap_w": max(caps) if caps else None}
    out = {"v": 1, "updated": date.today().isoformat(), "note": "Lemur Home Dashboard shared light measurements. Each model: the median of reviewed submissions. Strips are per meter (per_m).", "models": models}
    (LIB / "library.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    # index.json: only which models are in the pool (Önerilen ürünler shows "measurement ready" from it, src/picks.js)
    (LIB / "index.json").write_text(json.dumps({"v": 1, "updated": out["updated"], "models": sorted(models)}, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pending")
    ap.add_argument("--accept", default="")
    ap.add_argument("--lib", default="", help="library folder (default: this checkout's library/)")
    a = ap.parse_args()
    if a.lib:
        global LIB
        LIB = Path(a.lib)
    rows = review(json.load(open(a.pending, encoding="utf-8")))
    print(report(rows))
    acc = {int(x) for x in a.accept.split(",") if x.strip().isdigit()}
    if not acc:
        return
    for r in rows:
        if r["n"] in acc and r["c"] and not r["errs"]:
            add_sub(r["c"], r["n"], by_hash(r["author"]))
    rebuild()
    print(f"\n{len(acc)} gönderim eklendi; library.json yenilendi.", file=sys.stderr)


if __name__ == "__main__":
    main()
