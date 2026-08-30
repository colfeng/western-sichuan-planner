#!/usr/bin/env python3
"""Validate minimal official candidates, source status, and reviewed road events."""

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
sources = json.loads((ROOT / "crawler" / "sources.json").read_text(encoding="utf-8"))
events = json.loads((ROOT / "data" / "pending-updates.json").read_text(encoding="utf-8"))
status = json.loads((ROOT / "data" / "update-status.json").read_text(encoding="utf-8"))
reviewed = json.loads((ROOT / "data" / "reviewed-road-events.json").read_text(encoding="utf-8"))
osm_services = json.loads((ROOT / "data" / "osm-service-points.json").read_text(encoding="utf-8"))
official_services = json.loads((ROOT / "data" / "official-service-points.json").read_text(encoding="utf-8"))
known_leg_ids = set(re.findall(r'leg\("([^"]+)"', (ROOT / "src" / "data.ts").read_text(encoding="utf-8")))
allowed_hosts = {host for source in sources for host in source["allowed_domains"]}
forbidden_fields = {"html", "body", "fullText", "fullContent", "imageData"}
allowed_statuses = {"pending", "approved", "rejected", "expired"}
allowed_candidate_types = {"road", "attraction"}

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
    if event.get("candidateType") not in allowed_candidate_types:
        errors.append(f"{label}: invalid candidateType")
    if event.get("reviewStatus") == "pending" and event.get("affectsPlanner") is not False:
        errors.append(f"{label}: pending events cannot affect the planner")
    if event.get("candidateType") == "road" and "suggestedLegIds" in event:
        if unknown := set(event.get("suggestedLegIds", [])) - known_leg_ids:
            errors.append(f"{label}: unknown suggested road-edge IDs: {sorted(unknown)}")
        if event.get("suggestedImpact") not in {"closed", "restricted", "delay"}:
            errors.append(f"{label}: invalid suggestedImpact")
        if event.get("mappingConfidence") not in {"low", "medium", "high"}:
            errors.append(f"{label}: invalid mappingConfidence")
        if event.get("requiresHumanReview") is not True:
            errors.append(f"{label}: mapped road suggestions must require human review")
    present_forbidden = forbidden_fields.intersection(event)
    if present_forbidden:
        errors.append(f"{label}: forbidden republished fields: {sorted(present_forbidden)}")

if errors:
    raise SystemExit("\n".join(errors))

if status.get("schemaVersion") != 1 or not isinstance(status.get("sourceResults"), list):
    errors.append("update-status.json must use schemaVersion 1 and a sourceResults array")
if status.get("totalSources") != len(sources) + 1:
    errors.append("update-status.json totalSources must include official sources and the OSM service snapshot")

if osm_services.get("schemaVersion") != 1 or osm_services.get("license") != "ODbL-1.0" or not isinstance(osm_services.get("points"), list):
    errors.append("osm-service-points.json must be an attributed ODbL snapshot")
service_types = {"fuel", "charging", "toilet", "hospital", "clinic"}
for index, point in enumerate(osm_services.get("points", [])):
    label = f"osm-service[{index}]"
    if point.get("type") not in service_types:
        errors.append(f"{label}: invalid service type")
    if not point.get("osmUrl", "").startswith("https://www.openstreetmap.org/"):
        errors.append(f"{label}: missing OpenStreetMap object URL")
    if not isinstance(point.get("latitude"), (int, float)) or not isinstance(point.get("longitude"), (int, float)):
        errors.append(f"{label}: invalid coordinates")

if official_services.get("schemaVersion") != 1 or not official_services.get("sourceUrl", "").startswith("https://"):
    errors.append("official-service-points.json must have a version and official source")
for index, point in enumerate(official_services.get("points", [])):
    label = f"official-service[{index}]"
    if unknown := set(point.get("legIds", [])) - known_leg_ids:
        errors.append(f"{label}: unknown road-edge IDs: {sorted(unknown)}")
    if not point.get("nameZh") or not point.get("nameEn") or not point.get("types"):
        errors.append(f"{label}: bilingual name and service types are required")

if reviewed.get("schemaVersion") != 1 or not isinstance(reviewed.get("events"), list):
    raise SystemExit("reviewed-road-events.json must use schemaVersion 1 and an events array")
for index, event in enumerate(reviewed["events"]):
    label = f"reviewed[{index}]"
    required = {"id", "legIds", "impact", "startsAt", "endsAt", "title"}
    if not required.issubset(event):
        errors.append(f"{label}: missing required fields")
    if event.get("impact") not in {"closed", "restricted", "delay"}:
        errors.append(f"{label}: invalid impact")
    if not isinstance(event.get("legIds"), list) or not event.get("legIds"):
        errors.append(f"{label}: legIds must be a non-empty array")
    elif unknown := set(event["legIds"]) - known_leg_ids:
        errors.append(f"{label}: unknown road-edge IDs: {sorted(unknown)}")
    title = event.get("title", {})
    if not isinstance(title, dict) or not title.get("zh") or not title.get("en"):
        errors.append(f"{label}: bilingual title is required")

if errors:
    raise SystemExit("\n".join(errors))

print(f"Validated {len(events)} unified candidates, {len(sources) + 1} sources, {len(official_services['points'])} official service points and {len(reviewed['events'])} reviewed road events.")
