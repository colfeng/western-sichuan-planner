import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

CRAWLER_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(CRAWLER_DIR))
import crawl  # noqa: E402


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
        with patch.object(crawl, "fetch", return_value=html):
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
