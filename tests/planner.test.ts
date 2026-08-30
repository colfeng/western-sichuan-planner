import assert from "node:assert/strict";
import test from "node:test";
import { buildPlanOptions } from "../src/planner.ts";

test("builds three dynamic five-day options and keeps must-see places", () => {
  const options = buildPlanOptions({
    days: 5,
    maxDrive: 5,
    priority: "comfort",
    avoidNight: true,
    selectedAttractionIds: ["shuangqiao", "jiaju"],
  });

  assert.equal(options.length, 3);
  for (const option of options) {
    assert.equal(option.schedule.length, 5);
    assert.equal(option.schedule[0].startAnchorId, "chengdu-start");
    assert.equal(option.schedule.at(-1)?.endAnchorId, "chengdu-end");
    assert.ok(option.selectedAttractionIds.includes("shuangqiao"));
    assert.ok(option.selectedAttractionIds.includes("jiaju"));
  }
});

test("uses the grand loop when a branch attraction is required", () => {
  const options = buildPlanOptions({
    days: 6,
    maxDrive: 6,
    priority: "scenery",
    avoidNight: true,
    selectedAttractionIds: ["tagong-grassland"],
  });

  assert.ok(options.every((option) => option.routeKind === "grand"));
  assert.ok(options.every((option) => option.routeAnchorIds.includes("tagong")));
});

test("reports an infeasible compressed plan instead of hiding the conflict", () => {
  const options = buildPlanOptions({
    days: 3,
    maxDrive: 4,
    priority: "comfort",
    avoidNight: true,
    selectedAttractionIds: ["shuangqiao", "jiaju", "hailuogou"],
  });

  assert.ok(options.some((option) => !option.feasible));
  assert.ok(options.some((option) => option.warnings.some((warning) => warning.severity === "block")));
});

test("a smaller drive cap changes feasibility", () => {
  const relaxed = buildPlanOptions({
    days: 5,
    maxDrive: 6,
    priority: "comfort",
    avoidNight: true,
    selectedAttractionIds: ["shuangqiao"],
  });
  const strict = buildPlanOptions({
    days: 5,
    maxDrive: 3,
    priority: "comfort",
    avoidNight: true,
    selectedAttractionIds: ["shuangqiao"],
  });

  assert.ok(relaxed.some((option) => option.feasible));
  assert.ok(strict.some((option) => !option.feasible));
});
