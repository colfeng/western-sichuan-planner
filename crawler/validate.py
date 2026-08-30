#!/usr/bin/env python3
"""Validate that candidate events remain minimal, official, and non-published."""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
sources = json.loads((ROOT / "crawler" / "sources.json").read_text(encoding="utf-8"))
events = json.loads((ROOT / "data" / "pending-events.json").read_text(encoding="utf-8"))
allowed_hosts = {host for source in sources for host in source["allowed_domains"]}
forbidden_fields = {"html", "body", "fullText", "fullContent", "imageData"}
allowed_statuses = {"pending", "approved", "rejected", "expired"}

errors: list[str] = []
seen: set[str] = set()
for index, event in enumerate(events):
    label = f"event[{index}]"
    url = event.get("url", "")
    if not isinstance(url, str) or not url.startswith("https://"):
        errors.append(f"{label}: URL must use HTTPS")
    elif urlparse(url).hostname not in allowed_hosts:
        errors.append(f"{label}: URL host is not on the official-source whitelist")
    if url in seen:
        errors.append(f"{label}: duplicate URL")
    seen.add(url)
    if not event.get("titleZh") or len(event.get("titleZh", "")) > 280:
        errors.append(f"{label}: title is missing or too long")
    if event.get("reviewStatus") not in allowed_statuses:
        errors.append(f"{label}: invalid reviewStatus")
    if event.get("reviewStatus") == "pending" and event.get("affectsPlanner") is not False:
        errors.append(f"{label}: pending events cannot affect the planner")
    present_forbidden = forbidden_fields.intersection(event)
    if present_forbidden:
        errors.append(f"{label}: forbidden republished fields: {sorted(present_forbidden)}")

if errors:
    raise SystemExit("\n".join(errors))

print(f"Validated {len(events)} candidate road events.")
