"""Format check of a submitted measurement (GitHub Actions, on every new or edited submission).
Labels it 'bekliyor' (waits for the weekly review) or 'gecersiz' with the reasons and closes it. Adds nothing to the pool."""
from __future__ import annotations

import argparse
import json
import os
import urllib.request

from common import check, parse


def api(method: str, path: str, data: dict | None = None) -> None:
    req = urllib.request.Request(f"https://api.github.com/repos/{os.environ['REPO']}{path}", method=method, data=json.dumps(data).encode() if data is not None else None,
                                 headers={"Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}", "Accept": "application/vnd.github+json", "Content-Type": "application/json"})
    urllib.request.urlopen(req, timeout=20).read()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--event", required=True)
    ap.add_argument("--post", action="store_true")
    a = ap.parse_args()
    ev = json.load(open(a.event, encoding="utf-8"))
    issue = ev.get("issue") or {}
    p = parse(issue.get("body") or "")
    errs, clean = check(p) if p else (["ölçüm verisi bulunamadı / no measurement data found"], {})
    n = issue.get("number")
    if errs:
        msg = "Bu gönderim biçim kontrolünden geçmedi:\n\n" + "\n".join(f"- {e}" for e in errs) + "\n\nPanelde yeniden ölçüp tekrar gönderebilirsin.\n\nThis submission did not pass the format check; you can measure again and resend."
        labels, state = ["olcum", "gecersiz"], "closed"
    else:
        msg = (f"Biçim tamam: {clean['manufacturer']} {clean['model_id'] or clean['model']}, {len(json.dumps(clean['lut']))} bayt tablo" + (f", {clean['length_m']} m şerit" if clean["strip"] else "") +
               ". Haftalık incelemede aynı modelin diğer ölçümleri, ışığın özellikleri ve ürünün gücüyle karşılaştırılacak.\n\nFormat OK; it will be compared in the weekly review.")
        labels, state = ["olcum", "bekliyor"], "open"
    print(msg)
    if a.post and n:
        api("POST", f"/issues/{n}/comments", {"body": msg})
        api("PUT", f"/issues/{n}/labels", {"labels": labels})
        if state == "closed":
            api("PATCH", f"/issues/{n}", {"state": "closed", "state_reason": "not_planned"})


if __name__ == "__main__":
    main()
