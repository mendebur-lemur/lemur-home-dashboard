"""Check of a submitted measurement (GitHub Actions, on every new or edited submission).

v0.32: the pool is open to everyone; the measurement itself is checked, not who sent it or with which plug.
  - format and quality (common.check): zeros, stuck rows, power falling with brightness, a slow plug, too many cells
    the plug could not read, a plug model that keeps failing (library/plugs.json)
  - the owner's submissions join the pool at once and replace the owner's earlier measurement of that model
  - anyone else's: joins by itself only when the model is already in the pool and the highest power agrees (AGREE).
    A model's first measurement always waits for the owner ('bekliyor'): two made-up accounts agreeing with each other
    must not be able to add a model. The owner accepts a waiting one by putting the 'onay' label on it.
Each plug model's passed / failed count is kept in library/plugs.json; one that fails most of the time is blocked.
Only numbers and fixed fields of a submission are read; free text never. Writes into --lib (the 'havuz' branch);
the workflow commits it when something changed."""
from __future__ import annotations

import argparse
import json
import os
import urllib.request
from pathlib import Path

import review as R
from common import BLOCK_MIN, BLOCK_RATIO, check, parse

OK_TR = "Havuza eklendi"
APPROVE = "onay"


def api(method: str, path: str, data: dict | None = None):
    req = urllib.request.Request(f"https://api.github.com/repos/{os.environ['REPO']}{path}", method=method, data=json.dumps(data).encode() if data is not None else None,
                                 headers={"Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}", "Accept": "application/vnd.github+json", "Content-Type": "application/json"})
    raw = urllib.request.urlopen(req, timeout=20).read()
    return json.loads(raw) if raw else None


def load_plugs(lib: Path) -> dict:
    try:
        d = json.loads((lib / "plugs.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        d = {}
    d.setdefault("stats", {})
    d.setdefault("block", [])
    return d


def count_plug(plugs: dict, key: str, ok: bool) -> None:
    if not key or key == "|":
        return
    s = plugs["stats"].setdefault(key, {"ok": 0, "bad": 0})
    s["ok" if ok else "bad"] += 1
    n = s["ok"] + s["bad"]
    if n >= BLOCK_MIN and s["bad"] / n >= BLOCK_RATIO and key not in plugs["block"]:
        plugs["block"].append(key)


def decide(clean: dict, n, owner: bool, by: str) -> tuple[list, str]:
    """([(issue number, clean, by), ...] to add, note). An empty list: it waits for the owner."""
    if owner:
        return [(n, clean, by)], "proje sahibi onayladı"
    subs = R._models().get(R._fname(clean["key"]), {}).get("subs") or []
    if not subs:
        return [], "bu modelin ilk ölçümü; proje sahibi onaylayınca havuza girer"
    if any(s.get("by") == by for s in subs):
        return [], "bu hesabın aynı model için ölçümü zaten havuzda; proje sahibi bakacak"
    ok, why = R.agrees(clean, subs[0])
    return ([(n, clean, by)], "havuzdaki ölçümle tutarlı: " + why) if ok else ([], "havuzdaki ölçümle tutarsız: " + why + "; proje sahibi bakacak")


def owner_replace(key: str, n, by: str) -> bool:
    """The owner's newer measurement of a model replaces the owner's earlier ones (older entries carry no 'by': all were the
    owner's); other accounts' submissions stay. True when something was dropped."""
    path = R.LIB / "models" / (R._fname(key) + ".json")
    try:
        m = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return False
    subs = m.get("subs") or []
    keep = [x for x in subs if x.get("issue") == n or (x.get("by") and x.get("by") != by)]
    if len(keep) == len(subs) or not keep:
        return False
    m["subs"] = keep
    path.write_text(json.dumps(m, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return True


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--lib", default="", help="library folder to write (the 'havuz' branch)")
    ap.add_argument("--post", action="store_true")
    a = ap.parse_args()
    lib = Path(a.lib) if a.lib else R.LIB
    R.LIB = lib
    ev = json.load(open(a.event, encoding="utf-8"))
    issue = ev.get("issue") or {}
    n = issue.get("number")
    mine = issue.get("author_association") == "OWNER"
    # the owner's 'onay' label on someone's waiting measurement accepts it (only people with rights on the repository can label)
    approved = (ev.get("action") == "labeled" and (ev.get("label") or {}).get("name") == APPROVE
                and (ev.get("sender") or {}).get("login") == ((ev.get("repository") or {}).get("owner") or {}).get("login"))
    owner = mine or approved
    by = R.by_hash((issue.get("user") or {}).get("login"))
    plugs = load_plugs(lib)
    p = parse(issue.get("body") or "")
    errs, clean = check(p, strict=not mine, blocked=plugs["block"]) if p else (["ölçüm verisi bulunamadı / no measurement data found"], {})
    already = bool(clean) and any(s.get("issue") == n for s in R._models().get(R._fname(clean["key"]), {}).get("subs") or [])
    changed = False
    posts: list[tuple] = []   # (issue, comment, labels, close reason or None)
    if p and not already and ev.get("action") == "opened":   # an edit or a label is not a second submission
        count_plug(plugs, (clean or {}).get("plug_key") or "", not errs)
        changed = True
    if errs:
        msg = "Bu gönderim kontrolden geçmedi:\n\n" + "\n".join(f"- {e}" for e in errs) + "\n\nPanelde yeniden ölçüp tekrar gönderebilirsin.\n\nThis submission did not pass the check; you can measure again and resend."
        posts.append((n, msg, ["olcum", "gecersiz"], "not_planned"))
    elif already:
        if mine and owner_replace(clean["key"], n, by):
            R.rebuild()
            changed = True
        posts.append((n, f"{OK_TR}. / Already in the pool.", ["olcum", "eklendi"], "completed"))
    else:
        add, note = decide(clean, n, owner, by)
        nm = f"{clean['manufacturer']} {clean['model_id'] or clean['model']}" + (f", {clean['length_m']} m şerit" if clean["strip"] else "")
        if add:
            for num, c, b in add:
                R.add_sub(c, num, b)
            if mine:
                owner_replace(clean["key"], n, by)
            R.rebuild()
            changed = True
            for num, _c, _b in add:
                posts.append((num, f"{OK_TR}: {nm} ({note}). Panolar havuzu birkaç saat içinde yeniden okur.\n\nAdded to the shared pool.", ["olcum", "eklendi"], "completed"))
        else:
            posts.append((n, f"Kontrol tamam: {nm}. {note[:1].upper() + note[1:]}.\n\nChecks passed; it waits for the owner's review.", ["olcum", "bekliyor"], None))
    if not (lib / "index.json").exists():   # the small list the dashboards read for "measurement ready"
        R.rebuild()
        changed = True
    if changed:
        (lib / "plugs.json").write_text(json.dumps(plugs, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    for num, msg, labels, close in posts:
        print(f"#{num}: {msg}")
        if a.post and num:
            api("POST", f"/issues/{num}/comments", {"body": msg})
            api("PUT", f"/issues/{num}/labels", {"labels": labels})
            if close:
                api("PATCH", f"/issues/{num}", {"state": "closed", "state_reason": close})
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"changed={'true' if changed else 'false'}\n")


if __name__ == "__main__":
    main()
