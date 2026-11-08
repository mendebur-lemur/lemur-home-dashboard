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
import json
import statistics
import sys
from datetime import date
from pathlib import Path

from common import ROOT, check, parse, per_meter

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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pending")
    ap.add_argument("--accept", default="")
    a = ap.parse_args()
    rows = review(json.load(open(a.pending, encoding="utf-8")))
    print(report(rows))
    acc = {int(x) for x in a.accept.split(",") if x.strip().isdigit()}
    if not acc:
        return
    have = _models()
    for r in rows:
        if r["n"] in acc and r["c"] and not r["errs"]:
            c = dict(r["c"], issue=r["n"], date=date.today().isoformat())
            f = _fname(c["key"])
            m = have.get(f, {"subs": []})
            m["subs"] = [s for s in m["subs"] if s.get("issue") != r["n"]] + [c]
            (LIB / "models" / (f + ".json")).write_text(json.dumps(m, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
            have[f] = m
    rebuild()
    print(f"\n{len(acc)} gönderim eklendi; library.json yenilendi.", file=sys.stderr)


if __name__ == "__main__":
    main()
