import assert from "node:assert/strict";
import test from "node:test";
import type { PlannerInput } from "../src/planner.ts";
import { buildPlanOptions } from "../src/planner.ts";
import { anchorCoordinates, attractions, roadLegs, routeAnchors } from "../src/data.ts";

const base = (overrides: Partial<PlannerInput> = {}): PlannerInput => ({
  days: 7,
  maxDrive: 6,
  priority: "comfort",
  avoidNight: true,
  autoSuggest: true,
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
  assert.ok(option.schedule.every((day) => day.evPlan));
  assert.equal(option.schedule[0].evPlan?.safeBudgetKm, 162);
});

test("combines compatible short stops on the same day", () => {
  const option = buildPlanOptions(base({ days: 6, selectedAttractionIds: ["zhuokeji", "xisuo-village", "maerkang-town"] }))[0];
  assert.ok(option.schedule.some((day) => day.attractionIds.length >= 2));
});

test("automatically fills safe en-route free time and can be disabled", () => {
  const automatic = buildPlanOptions(base({ days: 8, selectedAttractionIds: ["moon-bay", "flower-lake"] }))[0];
  assert.ok(automatic.suggestedAttractionIds.length > 0);
  assert.ok(automatic.schedule.some((day) => day.attractionIds.some((id) => automatic.suggestedAttractionIds.includes(id))));
  const manualOnly = buildPlanOptions(base({ days: 8, autoSuggest: false, selectedAttractionIds: ["moon-bay", "flower-lake"] }))[0];
  assert.equal(manualOnly.suggestedAttractionIds.length, 0);
  assert.deepEqual(new Set(manualOnly.schedule.flatMap((day) => day.attractionIds)), new Set(["moon-bay", "flower-lake"]));
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
    assert.ok(day.restHours >= 0);
    assert.ok(day.mealHours >= 0);
    assert.ok(Array.isArray(day.legIds));
    assert.ok(Array.isArray(day.routeSteps));
    assert.ok(Array.isArray(day.agenda));
    assert.ok(day.freeHours >= 0);
    if (day.agenda.length > 0) assert.equal(day.agenda.at(-1)?.endTime, day.estimatedArrivalTime);
    for (let index = 1; index < day.agenda.length; index += 1) {
      const previous = day.agenda[index - 1];
      const current = day.agenda[index];
      const previousIsPause = previous.kind === "rest" || previous.kind === "lunch";
      const currentIsPause = current.kind === "rest" || current.kind === "lunch";
      assert.ok(!(previousIsPause && currentIsPause), `day ${day.day}: adjacent rest/meal blocks should be merged`);
    }
    for (const step of day.routeSteps) {
      assert.ok(step.road);
      assert.ok(step.distanceKm > 0);
      assert.ok(step.driveHours > 0);
    }
  }
});

test("published corridor mileages stay within calibrated planning ranges", () => {
  const byId = new Map(roadLegs.map((leg) => [leg.id, leg]));
  const corridor = (...ids: string[]) => ids.reduce((sum, id) => sum + (byId.get(id)?.km ?? 0), 0);

  assert.ok(corridor("djy-yx") >= 24 && corridor("djy-yx") <= 30, "G4217 Dujiangyan-Yingxiu should track the published 25.49 km section");
  assert.ok(corridor("yx-wc") >= 48 && corridor("yx-wc") <= 52, "G4217 Yingxiu-Wenchuan should track the published 48.27 km section");
  assert.ok(corridor("wc-lx", "lx-myl", "myl-mek") >= 170 && corridor("wc-lx", "lx-myl", "myl-mek") <= 180, "Wenchuan-Barkam should track the roughly 173 km expressway corridor");
  const wenchuanBarkamHours = ["wc-lx", "lx-myl", "myl-mek"].reduce((sum, id) => sum + (byId.get(id)?.hours ?? 0), 0);
  assert.ok(wenchuanBarkamHours >= 2.2 && wenchuanBarkamHours <= 2.6, "Wenchuan-Barkam open-road time should not imply an excessive mountain-expressway average speed");
  assert.ok(corridor("czs-jzg") >= 88 && corridor("czs-jzg") <= 100, "Chuanzhusi-Jiuzhaigou entrance should track the published 90.36 km section");
  assert.ok(corridor("ld-ya", "kd-ld") >= 130 && corridor("ld-ya", "kd-ld") <= 140, "Ya'an-Kangding should track the 135 km expressway corridor");
  assert.ok(corridor("lx-xj") >= 92 && corridor("lx-xj") <= 98, "Li County-Xiaojin should track the published 94 km Lixiao Road");
});

test("every road baseline is longer than its straight-line distance", () => {
  const earthRadiusKm = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  for (const leg of roadLegs) {
    const from = anchorCoordinates[leg.from];
    const to = anchorCoordinates[leg.to];
    const latitudeDelta = radians(to.latitude - from.latitude);
    const longitudeDelta = radians(to.longitude - from.longitude);
    const value = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
    const straightKm = 2 * earthRadiusKm * Math.asin(Math.sqrt(value));
    assert.ok(leg.km >= straightKm * 0.98, `${leg.id}: ${leg.km} km is shorter than its ${straightKm.toFixed(1)} km straight-line distance`);
  }
});

test("representative plans remain internally consistent across the road network", () => {
  const scenarios: PlannerInput[] = [
    base({ days: 8, selectedAttractionIds: ["moon-bay", "flower-lake"] }),
    base({ days: 8, selectedAttractionIds: ["huanglong", "jiuzhaigou"] }),
    base({ days: 10, maxDrive: 7, selectedAttractionIds: ["lianbaoyeze", "moon-bay"] }),
    base({ days: 8, selectedAttractionIds: ["shuangqiao", "jiaju", "tagong-grassland"] }),
    base({ days: 7, startAnchorId: "wenchuan", endAnchorId: "jiuzhaigou", selectedAttractionIds: ["dagu-glacier", "huanglong"] }),
    base({ days: 9, startDate: "2026-12-10", vehicle: "ev", evRangeKm: 300, selectedAttractionIds: ["jiuzhaigou"] }),
    base({ days: 9, startAnchorId: "yaan", endAnchorId: "aba-county", maxDrive: 7, selectedAttractionIds: ["lianbaoyeze"] }),
  ];
  const legById = new Map(roadLegs.map((leg) => [leg.id, leg]));

  for (const input of scenarios) {
    for (const option of buildPlanOptions(input)) {
      assert.equal(option.schedule.length, input.days, `${option.id}: unexpected schedule length`);
      assert.equal(option.routeAnchorIds[0], input.startAnchorId, `${option.id}: wrong start`);
      assert.equal(option.routeAnchorIds.at(-1), input.endAnchorId, `${option.id}: wrong end`);
      assert.deepEqual(new Set(option.selectedAttractionIds), new Set(input.selectedAttractionIds), `${option.id}: selected attraction was dropped`);
      const scheduled = new Set(option.schedule.flatMap((day) => day.attractionIds));
      for (const id of input.selectedAttractionIds) assert.ok(scheduled.has(id), `${option.id}: ${id} is missing from the schedule`);
      assert.equal(option.totalDistanceKm, option.schedule.reduce((sum, day) => sum + day.distanceKm, 0), `${option.id}: distance total drifted`);
      assert.ok(Math.abs(option.totalDriveHours - option.schedule.reduce((sum, day) => sum + day.driveHours, 0)) < 0.11, `${option.id}: drive-hour total drifted`);

      for (let dayIndex = 0; dayIndex < option.schedule.length; dayIndex += 1) {
        const day = option.schedule[dayIndex];
        if (dayIndex > 0) assert.equal(day.startAnchorId, option.schedule[dayIndex - 1].endAnchorId, `${option.id} day ${day.day}: discontinuous overnight anchor`);
        assert.ok(day.attractionIds.length <= 3, `${option.id} day ${day.day}: more than three attractions`);
        for (let stepIndex = 0; stepIndex < day.routeSteps.length; stepIndex += 1) {
          const step = day.routeSteps[stepIndex];
          const source = legById.get(step.legId);
          assert.ok(source, `${option.id}: unknown road leg ${step.legId}`);
          assert.equal(step.distanceKm, source?.km, `${option.id}: ${step.legId} distance drifted`);
          assert.ok(step.driveHours >= (source?.hours ?? 0), `${option.id}: ${step.legId} planning time lost its safety margin`);
          assert.ok(step.driveHours <= (source?.hours ?? 0) * 1.26 + 0.11, `${option.id}: ${step.legId} planning margin is unexpectedly large`);
          if (stepIndex > 0) assert.equal(step.fromAnchorId, day.routeSteps[stepIndex - 1].toAnchorId, `${option.id} day ${day.day}: discontinuous road steps`);
        }
      }
    }
  }
});

test("current cross-corridor links prevent obsolete backtracking", () => {
  const lianbaoyeze = buildPlanOptions(base({ days: 10, maxDrive: 7, autoSuggest: false, selectedAttractionIds: ["moon-bay", "lianbaoyeze"] }))[0];
  assert.ok(lianbaoyeze.routeAnchorIds.includes("hongyuan"));
  assert.ok(lianbaoyeze.routeAnchorIds.includes("aba-county"));
  const hongyuanIndex = lianbaoyeze.routeAnchorIds.indexOf("hongyuan");
  const abaIndex = lianbaoyeze.routeAnchorIds.indexOf("aba-county");
  assert.equal(lianbaoyeze.routeAnchorIds.slice(Math.min(hongyuanIndex, abaIndex), Math.max(hongyuanIndex, abaIndex) + 1).includes("maerkang"), false, "Hongyuan-Aba County should not backtrack through Barkam");

  const lixiao = buildPlanOptions(base({ days: 6, startAnchorId: "lixian", endAnchorId: "xiaojin", autoSuggest: false, selectedAttractionIds: [] }))[0];
  assert.ok(lixiao.routeAnchorIds.includes("lixian") && lixiao.routeAnchorIds.includes("xiaojin"));
  assert.equal(lixiao.routeAnchorIds.includes("wenchuan"), false, "Li County-Xiaojin should use the current direct corridor");
});

test("long itineraries add rest days instead of reporting no route", () => {
  const option = buildPlanOptions(base({ days: 10, autoSuggest: false, selectedAttractionIds: ["shuangqiao"] }))[0];
  assert.equal(option.schedule.length, 10);
  assert.ok(option.schedule.flatMap((day) => day.attractionIds).includes("shuangqiao"));
  assert.equal(option.warnings.some((warning) => warning.code === "no-route"), false);
});

test("connects the new Daocheng Yading corridor through Yajiang and Litang", () => {
  const option = buildPlanOptions(base({ days: 10, maxDrive: 7, autoSuggest: false, selectedAttractionIds: ["yading-scenic-area"] }))[0];
  assert.ok(option.routeAnchorIds.includes("yajiang"));
  assert.ok(option.routeAnchorIds.includes("litang"));
  assert.ok(option.routeAnchorIds.includes("daocheng"));
  assert.ok(option.routeAnchorIds.includes("shangrila"));
  assert.equal(option.feasible, true);
  assert.ok(option.schedule.flatMap((day) => day.attractionIds).includes("yading-scenic-area"));
});

test("an attraction branch is explicit and lunch happens before setting out", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 8,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "hongyuan",
    endAnchorId: "hongyuan",
    departureTime: "11:27",
    selectedAttractionIds: ["moon-bay"],
  }))[0];
  const agenda = option.schedule[0].agenda;
  const segments = agenda.filter((item) => item.attractionId === "moon-bay");
  assert.deepEqual(segments.map((item) => item.kind), ["drive", "visit", "drive"]);
  assert.deepEqual(segments.filter((item) => item.kind === "drive").map((item) => item.detourDirection), ["outbound", "return"]);
  assert.ok(agenda.findIndex((item) => item.kind === "lunch") < agenda.findIndex((item) => item.detourDirection === "outbound"));
  assert.equal(option.schedule[0].attractionIds.filter((id) => id === "moon-bay").length, 1);
});

test("a long road leg gets a real mid-route rest before arrival", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 12,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "songpan",
    endAnchorId: "ruoergai",
    selectedAttractionIds: ["flower-lake"],
  }))[0];
  const agenda = option.schedule[0].agenda;
  const roadDrives = agenda.filter((item) => item.kind === "drive" && item.road === "G213");
  const restIndex = agenda.findIndex((item) => item.kind === "rest" && item.road === "G213");
  assert.equal(roadDrives.length, 2);
  assert.ok(restIndex > 0 && restIndex < agenda.findIndex((item) => item.driveContinuation));
  assert.ok(roadDrives.every((item) => (item.driveHours ?? 0) <= 2));
  assert.deepEqual(
    agenda.filter((item) => item.attractionId === "flower-lake").map((item) => item.kind),
    ["drive", "visit", "drive"],
  );
});

test("a real visit resets continuous driving and preserves a short return branch", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 8,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "chengdu",
    endAnchorId: "maerkang",
    selectedAttractionIds: ["yingxiu-old-town", "maerkang-town"],
  }))[0];
  const day = option.schedule[0];
  const stop = day.agenda.filter((item) => item.attractionId === "yingxiu-old-town");
  assert.deepEqual(stop.map((item) => item.kind), ["drive", "visit", "drive"]);
  assert.deepEqual(stop.filter((item) => item.kind === "drive").map((item) => item.detourDirection), ["outbound", "return"]);
  assert.equal(stop.filter((item) => item.kind === "drive").reduce((sum, item) => sum + (item.distanceKm ?? 0), 0), 4);
  assert.equal(stop.filter((item) => item.kind === "visit").length, 1);
  assert.ok(day.agenda.findIndex((item) => item.kind === "rest") > day.agenda.findIndex((item) => item.kind === "lunch"));
  assert.equal(day.restHours, 0.25);
  assert.equal(day.mealHours, 0.75);
});

test("lunch can replace a due roadside rest instead of creating two close stops", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 10.5,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "xiaojin",
    endAnchorId: "wolong",
    selectedAttractionIds: [],
  }))[0];
  const agenda = option.schedule[0].agenda;
  const lunch = agenda.find((item) => item.kind === "lunch");
  assert.ok(lunch?.road);
  const lunchIndex = agenda.indexOf(lunch!);
  assert.notEqual(agenda[lunchIndex - 1]?.kind, "rest");
  assert.notEqual(agenda[lunchIndex + 1]?.kind, "rest");
});

test("a very long road baseline can split repeatedly after separate breaks", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 10.5,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "dujiangyan",
    endAnchorId: "aba-county",
    selectedAttractionIds: [],
  }))[0];
  let continuousMinutes = 0;
  for (const item of option.schedule[0].agenda) {
    const [startHour, startMinute] = item.startTime.split(":").map(Number);
    const [endHour, endMinute] = item.endTime.split(":").map(Number);
    const durationMinutes = (endHour * 60 + endMinute - startHour * 60 - startMinute + 1440) % 1440;
    if (item.kind === "drive") continuousMinutes += durationMinutes;
    else if (item.kind === "rest" || item.kind === "lunch") continuousMinutes = 0;
    assert.ok(continuousMinutes <= 129);
  }
});

test("EV plans name each required en-route charging town or block the day", () => {
  const option = buildPlanOptions(base({
    days: 1,
    maxDrive: 12,
    avoidNight: false,
    autoSuggest: false,
    startAnchorId: "chengdu",
    endAnchorId: "hongyuan",
    vehicle: "ev",
    evRangeKm: 375,
    selectedAttractionIds: [],
  }))[0];
  const evPlan = option.schedule[0].evPlan;
  assert.ok(evPlan);
  assert.ok(evPlan.status === "verify" || evPlan.status === "blocked" || evPlan.status === "ok");
  if (evPlan.status !== "blocked") {
    assert.ok(evPlan.chargeStops.length >= 1);
    assert.equal(evPlan.travelLegs.length, evPlan.chargeStops.length + 1);
    assert.ok(evPlan.chargeStops.every((stop) => routeAnchors[stop.anchorId]?.canStay));
    const chargeAgenda = option.schedule[0].agenda.filter((item) => item.kind === "charge");
    const expectedCharges = evPlan.chargeStops.length + (evPlan.destinationTopUpMinutes > 0 ? 1 : 0);
    assert.equal(chargeAgenda.length, expectedCharges, "every planned charging stop must appear in the roadbook timeline");
    assert.equal(chargeAgenda.reduce((sum, item) => sum + (item.chargeMinutes ?? 0), 0), Math.round(option.schedule[0].chargeHours * 60));
    assert.equal(option.schedule[0].estimatedArrivalTime, option.schedule[0].agenda.at(-1)?.endTime);
  }
});

test("every attraction exposes the same audited information fields", () => {
  const officialHosts = new Set([
    "www.djy.gov.cn", "wenchuan.gov.cn", "www.wenchuan.gov.cn", "www.abazhou.gov.cn", "abazhou.gov.cn",
    "www.sgns.cn", "www.xiaojin.gov.cn", "xiaojin.gov.cn", "www.danba.gov.cn", "www.kangding.gov.cn",
    "www.luding.gov.cn", "www.yaan.gov.cn", "www.huanglong.com", "www.jiuzhai.com", "www.daocheng.gov.cn", "daocheng.gov.cn",
    "www.gzz.gov.cn", "fgw.gzz.gov.cn", "rsj.yaan.gov.cn",
  ]);
  assert.ok(attractions.length >= 140 && attractions.length <= 150, `expected a reviewed 140–150 place catalogue, got ${attractions.length}`);
  let reservationCount = 0;
  for (const item of attractions) {
    assert.ok(routeAnchors[item.anchorId], `${item.id}: unknown anchor`);
    assert.ok(item.bestMonths.length > 0 && item.bestMonths.every((month) => month >= 1 && month <= 12), `${item.id}: invalid bestMonths`);
    assert.ok(item.opening.zh && item.opening.en, `${item.id}: missing bilingual opening note`);
    if (item.reservation) {
      reservationCount += 1;
      assert.ok(item.reservation.zh && item.reservation.en, `${item.id}: incomplete bilingual reservation note`);
    }
    assert.match(item.verifiedOn, /^\d{4}-\d{2}-\d{2}$/, `${item.id}: invalid review date`);
    const source = new URL(item.sourceUrl);
    assert.equal(source.protocol, "https:", `${item.id}: source must use HTTPS`);
    assert.ok(officialHosts.has(source.hostname), `${item.id}: source host is not on the official whitelist`);
  }
  assert.ok(reservationCount > 0 && reservationCount < attractions.length, "reservation notes should appear only where required");
});
