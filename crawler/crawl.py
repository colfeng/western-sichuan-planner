#!/usr/bin/env python3
"""Discover minimal road and attraction update candidates from official pages."""

from __future__ import annotations

import json
import math
import re
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlencode, urljoin, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SOURCES_PATH = ROOT / "crawler" / "sources.json"
OUTPUT_PATH = ROOT / "data" / "pending-updates.json"
STATUS_PATH = ROOT / "data" / "update-status.json"
OSM_SERVICES_PATH = ROOT / "data" / "osm-service-points.json"
ROAD_SEGMENTS_PATH = ROOT / "crawler" / "road-segments.json"
USER_AGENT = "WesternSichuanPlanner/0.8.0 (+https://github.com/colfeng/western-sichuan-planner)"


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self._href: str | None = None
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "a":
            self._href = dict(attrs).get("href")
            self._parts = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() != "a" or self._href is None:
            return
        title = " ".join("".join(self._parts).split())
        if title:
            self.links.append({"href": self._href, "title": title})
        self._href = None
        self._parts = []


class TextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() in {"script", "style", "noscript"}:
            self.hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style", "noscript"} and self.hidden_depth:
            self.hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self.hidden_depth:
            value = " ".join(data.split())
            if value:
                self.parts.append(value)


def fetch(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html"})
    with urlopen(request, timeout=25) as response:
        encoding = response.headers.get_content_charset() or "utf-8"
        return response.read(2_000_000).decode(encoding, errors="replace")


def visible_text(html: str) -> str:
    parser = TextParser()
    parser.feed(html)
    return " ".join(parser.parts)


def publication_date(title: str, url: str) -> datetime | None:
    """Read a conservative publication date from an official title or URL path."""
    title_match = re.search(r"(20\d{2})[年./-](\d{1,2})[月./-](\d{1,2})日?", title)
    if title_match:
        year, month, day = (int(value) for value in title_match.groups())
        try:
            return datetime(year, month, day, tzinfo=timezone.utc)
        except ValueError:
            return None
    path_match = re.search(r"/(20\d{2})(\d{2})/", urlparse(url).path)
    if path_match:
        year, month = (int(value) for value in path_match.groups())
        try:
            return datetime(year, month, 1, tzinfo=timezone.utc)
        except ValueError:
            return None
    return None


def is_recent_candidate(title: str, url: str, max_age_days: object) -> bool:
    if not isinstance(max_age_days, int) or max_age_days <= 0:
        return True
    published = publication_date(title, url)
    if published is None:
        return True
    age_days = (datetime.now(timezone.utc) - published).days
    return -31 <= age_days <= max_age_days


def analyse_road_candidate(title: str, url: str) -> dict[str, object]:
    try:
        content = visible_text(fetch(url))[:120_000]
    except Exception:
        content = title
    evidence = f"{title} {content}"
    if re.search(r"禁止.{0,20}(车辆|通行)|封闭|中断交通|断道", evidence):
        impact, delay = "closed", 0
    elif re.search(r"半幅|交替放行|单向放行|限行|临时管制|观察通行", evidence):
        impact, delay = "restricted", 1
    else:
        impact, delay = "delay", 0.5
    mappings: list[tuple[int, str]] = []
    for segment in json.loads(ROAD_SEGMENTS_PATH.read_text(encoding="utf-8")):
        road_hits = sum(1 for value in segment["roads"] if value in evidence)
        place_hits = sum(1 for value in segment["places"] if value in evidence)
        score = road_hits * 2 + place_hits
        if score >= 3 or (place_hits >= 2 and road_hits >= 1):
            mappings.append((score, segment["id"]))
    mappings.sort(reverse=True)
    top_score = mappings[0][0] if mappings else 0
    leg_ids = [item[1] for item in mappings if item[0] >= max(3, top_score - 1)][:6]
    confidence = "high" if top_score >= 5 and len(leg_ids) <= 3 else "medium" if top_score >= 3 else "low"
    date_values = re.findall(r"(20\d{2})[年./-](\d{1,2})[月./-](\d{1,2})日?", evidence)
    dates = [f"{year}-{int(month):02d}-{int(day):02d}" for year, month, day in date_values[:6]]
    end_date = dates[1] if len(dates) > 1 and dates[1] >= dates[0] else None
    return {
        "suggestedImpact": impact,
        "suggestedDelayHours": delay,
        "suggestedLegIds": leg_ids,
        "mappingConfidence": confidence,
        "suggestedStartsAt": dates[0] if dates else None,
        "suggestedEndsAt": end_date,
        "requiresHumanReview": True,
    }


def discover(source: dict[str, object]) -> list[dict[str, object]]:
    parser = LinkParser()
    parser.feed(fetch(str(source["list_url"])))
    if not parser.links:
        raise RuntimeError("official page returned no parseable links; preserving the previous snapshot")
    allowed = set(source["allowed_domains"])
    keywords = tuple(source["keywords"])
    results: list[dict[str, object]] = []
    for link in parser.links:
        if not any(keyword in link["title"] for keyword in keywords):
            continue
        absolute_url = urljoin(str(source["list_url"]), link["href"])
        if urlparse(absolute_url).hostname not in allowed:
            continue
        if not is_recent_candidate(link["title"], absolute_url, source.get("max_age_days")):
            continue
        candidate: dict[str, object] = {
            "sourceId": str(source["id"]),
            "candidateType": str(source["category"]),
            "agencyZh": str(source["agency_zh"]),
            "agencyEn": str(source["agency_en"]),
            "titleZh": link["title"][:280],
            "url": absolute_url,
        }
        if source["category"] == "attraction":
            title = link["title"]
            candidate["suggestedStatus"] = (
                "closed" if re.search(r"闭园|暂停开放|临时关闭", title)
                else "reopened" if re.search(r"恢复开放|重新开放", title)
                else "reservation" if re.search(r"预约|售罄|限流|票务", title)
                else "notice"
            )
            candidate["requiresHumanReview"] = True
        if source["category"] == "road" and len(results) < 20:
            candidate.update(analyse_road_candidate(link["title"], absolute_url))
        results.append(candidate)
    return results


def anchor_coordinates() -> dict[str, tuple[float, float]]:
    source = (ROOT / "src" / "data.ts").read_text(encoding="utf-8")
    pattern = re.compile(r'^\s*(?:"([^"]+)"|([A-Za-z0-9_-]+)):\s*\{ longitude: ([\d.]+), latitude: ([\d.]+) \}', re.MULTILINE)
    return {(quoted or bare): (float(lon), float(lat)) for quoted, bare, lon, lat in pattern.findall(source)}


def distance_sq(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    return ((lon1 - lon2) * math.cos(math.radians((lat1 + lat2) / 2))) ** 2 + (lat1 - lat2) ** 2


def parse_power_kw(tags: dict[str, str]) -> float | None:
    values = [value for key, value in tags.items() if key == "output" or key.endswith(":output")]
    parsed: list[float] = []
    for value in values:
        match = re.search(r"([\d.]+)\s*(kW|W)", value, re.IGNORECASE)
        if match:
            amount = float(match.group(1))
            parsed.append(amount / 1000 if match.group(2).lower() == "w" else amount)
    return max(parsed) if parsed else None


def refresh_osm_services(attempted_at: str) -> int:
    query = '''[out:json][timeout:90];(
      nwr["amenity"~"^(fuel|charging_station|toilets|hospital|clinic)$"](28.3,99.9,33.8,104.3);
    );out center tags;'''
    request = Request(
        "https://overpass-api.de/api/interpreter",
        data=urlencode({"data": query}).encode("utf-8"),
        headers={"User-Agent": USER_AGENT, "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urlopen(request, timeout=120) as response:
        payload = json.loads(response.read(12_000_000).decode("utf-8"))
    coordinates = anchor_coordinates()
    type_map = {"fuel": "fuel", "charging_station": "charging", "toilets": "toilet", "hospital": "hospital", "clinic": "clinic"}
    points: list[dict[str, object]] = []
    for element in payload.get("elements", []):
        tags = element.get("tags", {})
        amenity = tags.get("amenity")
        if amenity not in type_map:
            continue
        center = element.get("center", element)
        if "lat" not in center or "lon" not in center:
            continue
        latitude, longitude = float(center["lat"]), float(center["lon"])
        nearest = min(coordinates, key=lambda anchor: distance_sq(longitude, latitude, *coordinates[anchor]))
        point: dict[str, object] = {
            "id": f"osm-{element['type']}-{element['id']}",
            "name": tags.get("name:zh") or tags.get("name") or "",
            "nameEn": tags.get("name:en") or "",
            "type": type_map[amenity],
            "latitude": round(latitude, 6),
            "longitude": round(longitude, 6),
            "nearestAnchorId": nearest,
            "osmUrl": f"https://www.openstreetmap.org/{element['type']}/{element['id']}",
            "_distanceSq": distance_sq(longitude, latitude, *coordinates[nearest]),
        }
        power = parse_power_kw(tags) if amenity == "charging_station" else None
        if power:
            point["powerKw"] = round(power, 1)
        points.append(point)
    points.sort(key=lambda point: (str(point["nearestAnchorId"]), str(point["type"]), float(point["_distanceSq"])))
    nearby_points: list[dict[str, object]] = []
    group_counts: dict[tuple[str, str], int] = {}
    for point in points:
        key = (str(point["nearestAnchorId"]), str(point["type"]))
        if float(point["_distanceSq"]) > 0.02 or group_counts.get(key, 0) >= 4:
            continue
        group_counts[key] = group_counts.get(key, 0) + 1
        point.pop("_distanceSq", None)
        nearby_points.append(point)
    points = nearby_points
    if not points:
        raise RuntimeError("OpenStreetMap returned no usable nearby facilities; preserving the previous snapshot")
    previous_count = 0
    if OSM_SERVICES_PATH.exists():
        try:
            previous_count = len(json.loads(OSM_SERVICES_PATH.read_text(encoding="utf-8")).get("points", []))
        except (OSError, ValueError, TypeError):
            previous_count = 0
    minimum_safe_count = max(10, previous_count // 4) if previous_count >= 40 else 1
    if len(points) < minimum_safe_count:
        raise RuntimeError(f"OpenStreetMap facility count fell from {previous_count} to {len(points)}; preserving the previous snapshot")
    OSM_SERVICES_PATH.write_text(json.dumps({
        "schemaVersion": 1,
        "updatedAt": attempted_at,
        "source": "OpenStreetMap contributors",
        "license": "ODbL-1.0",
        "attributionUrl": "https://www.openstreetmap.org/copyright",
        "points": points,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return len(points)


def main() -> int:
    sources = json.loads(SOURCES_PATH.read_text(encoding="utf-8"))
    existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8")) if OUTPUT_PATH.exists() else []
    by_url = {event["url"]: event for event in existing}
    attempted_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    source_results: list[dict[str, object]] = []
    successful_source_ids: set[str] = set()

    for index, source in enumerate(sources):
        try:
            candidates = discover(source)
            for candidate in candidates:
                if candidate["url"] not in by_url:
                    candidate.update({"discoveredAt": attempted_at, "reviewStatus": "pending", "affectsPlanner": False})
                    by_url[candidate["url"]] = candidate
                else:
                    by_url[candidate["url"]].update({key: value for key, value in candidate.items() if key not in {"discoveredAt", "reviewStatus", "affectsPlanner"}})
                by_url[candidate["url"]]["lastSeenAt"] = attempted_at
            successful_source_ids.add(str(source["id"]))
            source_results.append({"sourceId": source["id"], "ok": True, "candidateCount": len(candidates)})
            print(f"{source['id']}: discovered {len(candidates)} candidate links")
        except Exception as exc:
            source_results.append({"sourceId": source["id"], "ok": False, "error": str(exc)[:240]})
            print(f"{source['id']}: failed: {exc}", file=sys.stderr)
        if index < len(sources) - 1:
            time.sleep(2)

    try:
        service_count = refresh_osm_services(attempted_at)
        source_results.append({"sourceId": "openstreetmap-services", "ok": True, "candidateCount": service_count})
        print(f"openstreetmap-services: refreshed {service_count} facility points")
    except Exception as exc:
        source_results.append({"sourceId": "openstreetmap-services", "ok": False, "error": str(exc)[:240]})
        print(f"openstreetmap-services: failed: {exc}", file=sys.stderr)

    successful = sum(1 for item in source_results if item["ok"])
    STATUS_PATH.write_text(json.dumps({
        "schemaVersion": 1,
        "lastAttemptAt": attempted_at,
        "successfulSources": successful,
        "totalSources": len(sources) + 1,
        "sourceResults": source_results,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if successful == 0:
        print("All official-source checks failed; preserving existing candidates.", file=sys.stderr)
        return 1

    events = sorted((
        item for item in by_url.values()
        if item.get("sourceId") not in successful_source_ids or item.get("lastSeenAt") == attempted_at
    ), key=lambda item: (item.get("lastSeenAt", ""), item.get("discoveredAt", "")), reverse=True)
    OUTPUT_PATH.write_text(json.dumps(events, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(events)} pending candidates and checked {successful}/{len(sources) + 1} data sources")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
