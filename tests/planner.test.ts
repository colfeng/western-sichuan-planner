import assert from "node:assert/strict";
import test from "node:test";
import type { PlannerInput } from "../src/planner.ts";
import { buildPlanOptions } from "../src/planner.ts";

const base = (overrides: Partial<PlannerInput> = {}): PlannerInput => ({
  days: 7,
  maxDrive: 6,
  priority: "comfort",
  avoidNight: true,
  selectedAttractionIds: ["moon-bay", "flower-lake"],
  startDate: "2026-09-15",
  startAnchorId: "chengdu",
  endAnchorId: "chengdu",
  departureTime: "08:30",
  vehicle: "sedan",
  evRangeKm: 450,
  lockOrder: false,
  roadEvents: [],
  ...overrides,
});

test("builds three options on the northern road graph", () => {
  const options = buildPlanOptions(base());
  assert.equal(options.length, 3);
  for (const option of options) {
    assert.equal(option.routeAnchorIds[0], "chengdu");
    assert.equal(option.routeAnchorIds.at(-1), "chengdu");
    assert.ok(option.routeAnchorIds.includes("hongyuan"));
    assert.ok(option.routeAnchorIds.includes("ruoergai"));
    assert.ok(option.selectedAttractionIds.includes("moon-bay"));
  }
});

test("connects Jiuzhaigou and Huanglong through the shared northern graph", () => {
  const option = buildPlanOptions(base({ days: 8, selectedAttractionIds: ["huanglong", "jiuzhaigou"] }))[0];
  assert.ok(option.routeAnchorIds.includes("huanglong"));
  assert.ok(option.routeAnchorIds.includes("jiuzhaigou"));
  assert.ok(option.routeAnchorIds.includes("chuanzhusi"));
});

test("connects Lianbaoyeze and Hongyuan instead of choosing a fixed loop", () => {
  const option = buildPlanOptions(base({ days: 9, maxDrive: 7, selectedAttractionIds: ["lianbaoyeze", "moon-bay"] }))[0];
  assert.ok(option.routeAnchorIds.includes("aba-county"));
  assert.ok(option.routeAnchorIds.includes("lianbaoyeze"));
  assert.ok(option.routeAnchorIds.includes("hongyuan"));
});

test("respects a user-locked visit order", () => {
  const option = buildPlanOptions(base({ days: 10, lockOrder: true, selectedAttractionIds: ["jiuzhaigou", "moon-bay", "lianbaoyeze"] }))[0];
  assert.ok(option.routeAnchorIds.indexOf("jiuzhaigou") < option.routeAnchorIds.lastIndexOf("hongyuan"));
  assert.ok(option.routeAnchorIds.lastIndexOf("hongyuan") < option.routeAnchorIds.lastIndexOf("lianbaoyeze"));
});

test("a reviewed closure is mapped to an edge and changes the path", () => {
  const option = buildPlanOptions(base({
    days: 9,
    selectedAttractionIds: ["jiuzhaigou"],
    roadEvents: [{ id: "reviewed-1", legIds: ["mx-sp"], impact: "closed", startsAt: "2026-09-01", endsAt: "2026-10-01", title: { zh: "G213审核封闭", en: "Reviewed G213 closure" } }],
  }))[0];
  assert.equal(option.activeRoadEventCount, 1);
  assert.ok(option.routeAnchorIds.includes("ruoergai"));
  assert.ok(option.warnings.some((warning) => warning.code === "event-reviewed-1"));
});

test("winter travel produces a seasonal warning without claiming closure", () => {
  const option = buildPlanOptions(base({ startDate: "2026-12-10", selectedAttractionIds: ["omtang"] }))[0];
  assert.ok(option.warnings.some((warning) => warning.code === "season-omtang"));
});

test("EV range warning uses a conservative fraction of rated range", () => {
  const option = buildPlanOptions(base({ vehicle: "ev", evRangeKm: 250, selectedAttractionIds: ["jiuzhaigou"] }))[0];
  assert.ok(option.warnings.some((warning) => warning.code.startsWith("ev-")));
});

test("supports different start and end anchors on the same graph", () => {
  const option = buildPlanOptions(base({
    days: 6,
    startAnchorId: "wenchuan",
    endAnchorId: "jiuzhaigou",
    selectedAttractionIds: ["dagu-glacier", "huanglong"],
  }))[0];
  assert.equal(option.routeAnchorIds[0], "wenchuan");
  assert.equal(option.routeAnchorIds.at(-1), "jiuzhaigou");
  assert.ok(option.routeAnchorIds.includes("heishui"));
  assert.ok(option.routeAnchorIds.includes("huanglong"));
});

test("records departure, estimated finish and sunset margin for every day", () => {
  const option = buildPlanOptions(base({ departureTime: "09:15" }))[0];
  assert.ok(option.schedule.length > 0);
  for (const day of option.schedule) {
    assert.equal(day.departureTime, "09:15");
    assert.match(day.estimatedArrivalTime, /^\d{2}:\d{2}$/);
    assert.equal(typeof day.daylightMarginMinutes, "number");
  }
});
