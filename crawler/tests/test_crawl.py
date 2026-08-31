import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

CRAWLER_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(CRAWLER_DIR))
import crawl  # noqa: E402


class FrozenDateTime(datetime):
    @classmethod
    def now(cls, tz=None):
        return cls(2026, 8, 31, tzinfo=tz or timezone.utc)


class FakeHeaders:
    def get_content_charset(self):
        return "utf-8"


class FakeResponse:
    def __init__(self, payload: bytes):
        self.payload = payload
        self.headers = FakeHeaders()

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self, _limit=None):
        return self.payload


class WeeklyCrawlerTests(unittest.TestCase):
    def test_discover_keeps_only_minimal_whitelisted_metadata(self):
        source = {
            "id": "test", "category": "attraction", "agency_zh": "测试", "agency_en": "Test",
            "list_url": "https://example.gov.cn/list", "allowed_domains": ["example.gov.cn"],
            "keywords": ["开放"], "max_age_days": 0,
        }
        html = '<a href="/notice/1">景区恢复开放公告</a><a href="https://bad.example/2">景区开放</a>'
        with patch.object(crawl, "fetch", return_value=html), patch.object(crawl, "datetime", FrozenDateTime):
            candidates = crawl.discover(source)
        self.assertEqual(len(candidates), 1)
        self.assertEqual(candidates[0]["url"], "https://example.gov.cn/notice/1")
        self.assertNotIn("body", candidates[0])
        self.assertNotIn("content", candidates[0])
        self.assertTrue(candidates[0]["requiresHumanReview"])

    def test_empty_official_page_does_not_count_as_success(self):
        source = {
            "id": "test", "category": "attraction", "agency_zh": "测试", "agency_en": "Test",
            "list_url": "https://example.gov.cn/list", "allowed_domains": ["example.gov.cn"],
            "keywords": ["开放"],
        }
        with patch.object(crawl, "fetch", return_value="<html><p>layout changed</p></html>"):
            with self.assertRaisesRegex(RuntimeError, "no parseable links"):
                crawl.discover(source)

    def test_hyphenated_notice_url_yields_full_publication_date(self):
        published = crawl.publication_date("恢复开放通告", "https://www.jiuzhai.com/news/notice/11290-2026-07-29-02-04-43")
        self.assertIsNotNone(published)
        self.assertEqual(published.date().isoformat(), "2026-07-29")

    def test_attraction_notice_maps_only_to_explicit_target_and_expires_capacity_notice(self):
        source = {
            "id": "park", "category": "attraction", "agency_zh": "测试", "agency_en": "Test",
            "list_url": "https://example.gov.cn/list", "allowed_domains": ["example.gov.cn"],
            "keywords": ["公告"], "max_age_days": 180,
            "attraction_targets": [{"ids": ["park-a"], "keywords": ["甲景区"]}],
        }
        html = '<a href="/notice/9-2026-08-30-10-00-00">甲景区8月31日门票预约已达最大承载量公告</a><a href="/notice/general">全县旅游公告</a>'
        with patch.object(crawl, "fetch", return_value=html):
            candidates = crawl.discover(source)
        mapped = next(item for item in candidates if "甲景区" in item["titleZh"])
        general = next(item for item in candidates if "全县" in item["titleZh"])
        self.assertEqual(mapped["suggestedAttractionIds"], ["park-a"])
        self.assertEqual(mapped["publishedAt"], "2026-08-30")
        self.assertEqual(mapped["expiresAt"], "2026-09-01")
        self.assertEqual(general["suggestedAttractionIds"], [])

    def test_missing_candidate_is_retained_for_grace_period_but_not_forever(self):
        item = {"sourceId": "park", "discoveredAt": "2026-08-20T00:00:00+00:00"}
        self.assertTrue(crawl.should_keep_candidate(item, {"park"}, "2026-08-31T00:00:00+00:00"))
        self.assertFalse(crawl.should_keep_candidate(item, {"park"}, "2026-09-20T00:00:00+00:00"))
        expired = {**item, "expiresAt": "2026-08-25"}
        self.assertFalse(crawl.should_keep_candidate(expired, {"park"}, "2026-08-31T00:00:00+00:00"))

    def test_empty_osm_response_preserves_existing_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            snapshot = Path(directory) / "osm.json"
            original = {"schemaVersion": 1, "points": [{"id": "existing"}]}
            snapshot.write_text(json.dumps(original), encoding="utf-8")
            payload = json.dumps({"elements": []}).encode()
            with patch.object(crawl, "OSM_SERVICES_PATH", snapshot), patch.object(crawl, "urlopen", return_value=FakeResponse(payload)):
                with self.assertRaisesRegex(RuntimeError, "no usable nearby facilities"):
                    crawl.refresh_osm_services("2026-08-31T00:00:00+00:00")
            self.assertEqual(json.loads(snapshot.read_text(encoding="utf-8")), original)

    def test_large_osm_drop_preserves_existing_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            snapshot = Path(directory) / "osm.json"
            original = {"schemaVersion": 1, "points": [{"id": str(index)} for index in range(100)]}
            snapshot.write_text(json.dumps(original), encoding="utf-8")
            elements = [{"type": "node", "id": index, "lat": 30.5728, "lon": 104.0665, "tags": {"amenity": "toilets"}} for index in range(5)]
            payload = json.dumps({"elements": elements}).encode()
            with patch.object(crawl, "OSM_SERVICES_PATH", snapshot), patch.object(crawl, "urlopen", return_value=FakeResponse(payload)):
                with self.assertRaisesRegex(RuntimeError, "fell from 100"):
                    crawl.refresh_osm_services("2026-08-31T00:00:00+00:00")
            self.assertEqual(len(json.loads(snapshot.read_text(encoding="utf-8"))["points"]), 100)


if __name__ == "__main__":
    unittest.main()
