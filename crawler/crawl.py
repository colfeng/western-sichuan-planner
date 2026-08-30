#!/usr/bin/env python3
"""Discover candidate official road notices without republishing page content."""

from __future__ import annotations

import json
import sys
import time
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SOURCES_PATH = ROOT / "crawler" / "sources.json"
OUTPUT_PATH = ROOT / "data" / "pending-events.json"
USER_AGENT = "WesternSichuanPlanner/0.1 (+https://github.com/colfeng/western-sichuan-planner)"


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self._href: str | None = None
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
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


def fetch(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html"})
    with urlopen(request, timeout=25) as response:
        encoding = response.headers.get_content_charset() or "utf-8"
        return response.read(2_000_000).decode(encoding, errors="replace")


def discover(source: dict[str, object]) -> list[dict[str, str]]:
    html = fetch(str(source["list_url"]))
    parser = LinkParser()
    parser.feed(html)
    allowed = set(source["allowed_domains"])
    keywords = tuple(source["keywords"])
    results: list[dict[str, str]] = []

    for link in parser.links:
        if not any(keyword in link["title"] for keyword in keywords):
            continue
        absolute_url = urljoin(str(source["list_url"]), link["href"])
        if urlparse(absolute_url).hostname not in allowed:
            continue
        results.append(
            {
                "sourceId": str(source["id"]),
                "agencyZh": str(source["agency_zh"]),
                "agencyEn": str(source["agency_en"]),
                "titleZh": link["title"][:280],
                "url": absolute_url,
            }
        )
    return results


def main() -> int:
    sources = json.loads(SOURCES_PATH.read_text(encoding="utf-8"))
    existing = json.loads(OUTPUT_PATH.read_text(encoding="utf-8")) if OUTPUT_PATH.exists() else []
    by_url = {event["url"]: event for event in existing}
    successful_sources = 0
    discovered_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    for index, source in enumerate(sources):
        try:
            candidates = discover(source)
            successful_sources += 1
            for candidate in candidates:
                if candidate["url"] not in by_url:
                    candidate.update(
                        {
                            "discoveredAt": discovered_at,
                            "reviewStatus": "pending",
                            "affectsPlanner": False,
                        }
                    )
                    by_url[candidate["url"]] = candidate
            print(f"{source['id']}: discovered {len(candidates)} candidate links")
        except Exception as exc:  # Network and template failures must remain visible.
            print(f"{source['id']}: failed: {exc}", file=sys.stderr)
        if index < len(sources) - 1:
            time.sleep(2)

    if successful_sources == 0:
        print("All official-source checks failed; preserving existing data.", file=sys.stderr)
        return 1

    events = sorted(by_url.values(), key=lambda item: item.get("discoveredAt", ""), reverse=True)
    OUTPUT_PATH.write_text(json.dumps(events, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(events)} pending events to {OUTPUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
