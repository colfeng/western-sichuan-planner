import type {
  Attraction,
  Copy,
  RouteLeg,
} from "./data.ts";
import {
  attractions,
  c,
  compactRoute,
  grandRoute,
  routeAnchors,
  strategySuggestions,
} from "./data.ts";

export type Strategy = keyof typeof strategySuggestions;

export type PlannerInput = {
  days: number;
  maxDrive: number;
  priority: Strategy;
  avoidNight: boolean;
  selectedAttractionIds: string[];
};

export type PlanWarning = {
  code: string;
  severity: "warn" | "block";
  day?: number;
  message: Copy;
};

export type PlanDay = {
  day: number;
  startAnchorId: string;
  endAnchorId: string;
  viaAnchorIds: string[];
  driveHours: number;
  distanceKm: number;
  activityHours: number;
  dutyHours: number;
  sleepAltitude: number;
  attractionIds: string[];
  roads: string[];
};

export type PlanOption = {
  id: Strategy;
  title: Copy;
  subtitle: Copy;
  routeKind: "compact" | "grand";
  routeAnchorIds: string[];
  schedule: PlanDay[];
  warnings: PlanWarning[];
  feasible: boolean;
  score: number;
  selectedAttractionIds: string[];
  suggestedAttractionIds: string[];
  minimumDays: number | null;
  totalDriveHours: number;
  totalDistanceKm: number;
};

type Task = {
  kind: "travel" | "visit";
  fromAnchorId: string;
  toAnchorId: string;
  driveHours: number;
  distanceKm: number;
  activityHours: number;
  road?: string;
  attractionId?: string;
  effort?: Attraction["effort"];
};

type Segment = {
  start: number;
  end: number;
  cost: number;
};

type PartitionResult = {
  segments: Segment[];
  cost: number;
};

const attractionById = new Map(attractions.map((item) => [item.id, item]));
const branchAnchors = new Set(["bamei", "tagong", "xinduqiao", "kangding"]);

const strategyCopy: Record<Strategy, { title: Copy; subtitle: Copy }> = {
  comfort: {
    title: c("舒适安全方案", "Comfort-first plan"),
    subtitle: c("优先降低连续驾驶、海拔跃升和高强度活动", "Reduces sustained driving, altitude jumps and demanding activities"),
  },
  scenery: {
    title: c("景观丰富方案", "Scenery-rich plan"),
    subtitle: c("在时间允许时加入更多不同地貌，避免重复追逐同类景观", "Adds varied landscapes when time allows without repeating the same scenery"),
  },
  culture: {
    title: c("人文村落方案", "Culture and villages plan"),
    subtitle: c("增加纪念地、藏寨、古碉与城镇慢行", "Adds memorials, Tibetan villages, watchtowers and town walks"),
  },
};

const round = (value: number) => Math.round(value * 10) / 10;

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function routeForAttractions(ids: string[]): { kind: "compact" | "grand"; legs: RouteLeg[] } {
  const needsGrand = ids.some((id) => {
    const item = attractionById.get(id);
    return item ? branchAnchors.has(item.anchorId) : false;
  });
  return needsGrand ? { kind: "grand", legs: grandRoute } : { kind: "compact", legs: compactRoute };
}

function anchorIdsForRoute(legs: RouteLeg[]): string[] {
  return [legs[0].from, ...legs.map((item) => item.to)];
}

function buildTasks(legs: RouteLeg[], attractionIds: string[]): Task[] {
  const selected = new Set(attractionIds);
  const byAnchor = new Map<string, Attraction[]>();

  for (const item of attractions) {
    if (!selected.has(item.id)) continue;
    const current = byAnchor.get(item.anchorId) ?? [];
    current.push(item);
    byAnchor.set(item.anchorId, current);
  }

  const tasks: Task[] = [];
  for (const routeLeg of legs) {
    tasks.push({
      kind: "travel",
      fromAnchorId: routeLeg.from,
      toAnchorId: routeLeg.to,
      driveHours: routeLeg.hours,
      distanceKm: routeLeg.km,
      activityHours: 0,
      road: routeLeg.road,
    });

    for (const item of byAnchor.get(routeLeg.to) ?? []) {
      tasks.push({
        kind: "visit",
        fromAnchorId: item.anchorId,
        toAnchorId: item.anchorId,
        driveHours: item.detourHours,
        distanceKm: item.detourKm,
        activityHours: item.visitHours,
        attractionId: item.id,
        effort: item.effort,
      });
    }
  }

  return tasks;
}

function summarizeTasks(tasks: Task[], start: number, end: number) {
  const slice = tasks.slice(start, end);
  const startAnchorId = slice[0].fromAnchorId;
  const endAnchorId = slice[slice.length - 1].toAnchorId;
  const viaAnchorIds = unique(slice.filter((task) => task.kind === "travel").map((task) => task.toAnchorId));
  const driveHours = slice.reduce((sum, task) => sum + task.driveHours, 0);
  const distanceKm = slice.reduce((sum, task) => sum + task.distanceKm, 0);
  const activityHours = slice.reduce((sum, task) => sum + task.activityHours, 0);
  const attractionIds = slice.flatMap((task) => task.attractionId ? [task.attractionId] : []);
  const roads = unique(slice.flatMap((task) => task.road ? [task.road] : []));
  const highEffortCount = slice.filter((task) => task.effort === "high").length;
  return {
    startAnchorId,
    endAnchorId,
    viaAnchorIds,
    driveHours,
    distanceKm,
    activityHours,
    dutyHours: driveHours + activityHours,
    attractionIds,
    roads,
    highEffortCount,
  };
}

function segmentCost(
  tasks: Task[],
  start: number,
  end: number,
  dayIndex: number,
  input: PlannerInput,
  strategy: Strategy,
  targetDuty: number,
): number {
  const summary = summarizeTasks(tasks, start, end);
  const startAltitude = routeAnchors[summary.startAnchorId].altitude;
  const endAltitude = routeAnchors[summary.endAnchorId].altitude;
  const dutyLimit = input.avoidNight ? 9.2 : 10.5;
  const driveOver = Math.max(0, summary.driveHours - input.maxDrive);
  const dutyOver = Math.max(0, summary.dutyHours - dutyLimit);
  const altitudeGain = endAltitude - startAltitude;
  let cost = Math.pow(summary.dutyHours - targetDuty, 2) * 1.7;

  cost += driveOver * driveOver * (strategy === "comfort" ? 170 : 135);
  cost += dutyOver * dutyOver * 125;
  cost += Math.max(0, summary.driveHours - 6) * 45;

  if (dayIndex === 0 && endAltitude > 2800) cost += 120 + (endAltitude - 2800) * 0.05;
  if (altitudeGain > 1500 && endAltitude > 2600) cost += (altitudeGain - 1500) * 0.06;
  if (endAltitude > 3600) cost += strategy === "comfort" ? 55 : 25;
  if (summary.highEffortCount > 0) cost += summary.highEffortCount * (strategy === "comfort" ? 45 : 20);
  if (summary.dutyHours < 2.2) cost += (2.2 - summary.dutyHours) * 8;

  return cost;
}

function partitionTasks(tasks: Task[], input: PlannerInput, strategy: Strategy): PartitionResult | null {
  if (tasks.length < input.days) return null;
  const totalDuty = tasks.reduce((sum, task) => sum + task.driveHours + task.activityHours, 0);
  const targetDuty = totalDuty / input.days;
  const dp: Array<Array<{ cost: number; previous: number } | null>> = Array.from(
    { length: input.days + 1 },
    () => Array(tasks.length + 1).fill(null),
  );
  dp[0][0] = { cost: 0, previous: -1 };

  for (let day = 0; day < input.days; day += 1) {
    for (let start = 0; start < tasks.length; start += 1) {
      const state = dp[day][start];
      if (!state) continue;

      for (let end = start + 1; end <= tasks.length; end += 1) {
        const remainingDays = input.days - day - 1;
        if (tasks.length - end < remainingDays) continue;
        const endAnchorId = tasks[end - 1].toAnchorId;
        if (!routeAnchors[endAnchorId].canStay) continue;
        if (remainingDays === 0 && end !== tasks.length) continue;
        if (remainingDays > 0 && end === tasks.length) continue;

        const nextCost = state.cost + segmentCost(tasks, start, end, day, input, strategy, targetDuty);
        const existing = dp[day + 1][end];
        if (!existing || nextCost < existing.cost) {
          dp[day + 1][end] = { cost: nextCost, previous: start };
        }
      }
    }
  }

  const finalState = dp[input.days][tasks.length];
  if (!finalState) return null;

  const segments: Segment[] = [];
  let end = tasks.length;
  for (let day = input.days; day > 0; day -= 1) {
    const state = dp[day][end];
    if (!state) return null;
    const start = state.previous;
    segments.unshift({
      start,
      end,
      cost: segmentCost(tasks, start, end, day - 1, input, strategy, targetDuty),
    });
    end = start;
  }

  return { segments, cost: finalState.cost };
}

function toSchedule(tasks: Task[], result: PartitionResult): PlanDay[] {
  return result.segments.map((segment, index) => {
    const summary = summarizeTasks(tasks, segment.start, segment.end);
    return {
      day: index + 1,
      startAnchorId: summary.startAnchorId,
      endAnchorId: summary.endAnchorId,
      viaAnchorIds: summary.viaAnchorIds,
      driveHours: round(summary.driveHours),
      distanceKm: Math.round(summary.distanceKm),
      activityHours: round(summary.activityHours),
      dutyHours: round(summary.dutyHours),
      sleepAltitude: routeAnchors[summary.endAnchorId].altitude,
      attractionIds: summary.attractionIds,
      roads: summary.roads,
    };
  });
}

function warningsForSchedule(schedule: PlanDay[], input: PlannerInput): PlanWarning[] {
  const warnings: PlanWarning[] = [];
  const dutyLimit = input.avoidNight ? 9.2 : 10.5;

  for (const day of schedule) {
    const startAltitude = routeAnchors[day.startAnchorId].altitude;
    const gain = day.sleepAltitude - startAltitude;

    if (day.driveHours > input.maxDrive + 0.05) {
      warnings.push({
        code: `drive-cap-${day.day}`,
        severity: "block",
        day: day.day,
        message: c(`第${day.day}天驾驶${day.driveHours}小时，超过你的${input.maxDrive}小时上限。`, `Day ${day.day} has ${day.driveHours} hours of driving, above your ${input.maxDrive}-hour cap.`),
      });
    } else if (day.driveHours > 6) {
      warnings.push({
        code: `long-drive-${day.day}`,
        severity: "warn",
        day: day.day,
        message: c(`第${day.day}天驾驶超过6小时，需要明确安排两次以上休息。`, `Day ${day.day} exceeds six driving hours and needs at least two planned breaks.`),
      });
    }

    if (day.dutyHours > dutyLimit + 0.05) {
      warnings.push({
        code: `duty-${day.day}`,
        severity: "block",
        day: day.day,
        message: c(`第${day.day}天驾驶加游玩约${day.dutyHours}小时，无法在安全日照窗口内舒适完成。`, `Day ${day.day} totals about ${day.dutyHours} hours of driving and activities, beyond a comfortable daylight window.`),
      });
    }

    if (day.day === 1 && day.sleepAltitude > 2800) {
      warnings.push({
        code: "first-night-altitude",
        severity: "block",
        day: 1,
        message: c("第一晚直接住到2800米以上，不符合新手单司机的渐进海拔原则。", "The first night is above 2,800 m, which conflicts with gradual acclimatization for a novice solo driver."),
      });
    } else if (gain > 1500 && day.sleepAltitude > 2600) {
      warnings.push({
        code: `altitude-gain-${day.day}`,
        severity: "warn",
        day: day.day,
        message: c(`第${day.day}天住宿海拔上升约${gain}米，应减少剧烈活动并观察身体反应。`, `Day ${day.day} gains about ${gain} m in sleeping altitude; reduce exertion and monitor symptoms.`),
      });
    }

    for (const id of day.attractionIds) {
      const item = attractionById.get(id);
      if (item?.effort === "high") {
        warnings.push({
          code: `high-effort-${id}`,
          severity: "warn",
          day: day.day,
          message: c(`${item.name.zh}属于高强度项目，不能仅按普通景点时长理解。`, `${item.name.en} is demanding and should not be treated as an ordinary sightseeing stop.`),
        });
      }
    }
  }

  return warnings;
}

function hasBlockingWarnings(warnings: PlanWarning[]): boolean {
  return warnings.some((warning) => warning.severity === "block");
}

function createRawPlan(input: PlannerInput, strategy: Strategy, requiredIds: string[], suggestedIds: string[]) {
  const allIds = unique([...requiredIds, ...suggestedIds]).filter((id) => attractionById.has(id));
  const route = routeForAttractions(allIds);
  const tasks = buildTasks(route.legs, allIds);
  const partition = partitionTasks(tasks, input, strategy);
  if (!partition) return null;
  const schedule = toSchedule(tasks, partition);
  const warnings = warningsForSchedule(schedule, input);
  return { route, tasks, partition, schedule, warnings };
}

function estimateMinimumDays(input: PlannerInput, strategy: Strategy, requiredIds: string[]): number | null {
  for (let days = input.days; days <= 8; days += 1) {
    const trialInput = { ...input, days };
    const raw = createRawPlan(trialInput, strategy, requiredIds, []);
    if (raw && !hasBlockingWarnings(raw.warnings)) return days;
  }
  return null;
}

function makeOption(input: PlannerInput, strategy: Strategy): PlanOption {
  const requiredIds = unique(input.selectedAttractionIds).filter((id) => attractionById.has(id));
  const suggestionLimit = Math.max(2, Math.min(strategySuggestions[strategy].length, input.days - 1));
  let suggestedIds = strategySuggestions[strategy]
    .filter((id) => !requiredIds.includes(id))
    .slice(0, suggestionLimit);
  let raw = createRawPlan(input, strategy, requiredIds, suggestedIds);

  while (raw && hasBlockingWarnings(raw.warnings) && suggestedIds.length > 0) {
    suggestedIds = suggestedIds.slice(0, -1);
    raw = createRawPlan(input, strategy, requiredIds, suggestedIds);
  }

  if (!raw) {
    const fallbackRoute = routeForAttractions(requiredIds);
    return {
      id: strategy,
      ...strategyCopy[strategy],
      routeKind: fallbackRoute.kind,
      routeAnchorIds: anchorIdsForRoute(fallbackRoute.legs),
      schedule: [],
      warnings: [{
        code: "no-partition",
        severity: "block",
        message: c("当前天数不足以形成每天都在可住宿地结束的完整环线。", "The current trip length cannot form a complete loop ending each day at a viable overnight stop."),
      }],
      feasible: false,
      score: 0,
      selectedAttractionIds: requiredIds,
      suggestedAttractionIds: [],
      minimumDays: estimateMinimumDays(input, strategy, requiredIds),
      totalDriveHours: 0,
      totalDistanceKm: 0,
    };
  }

  const feasible = !hasBlockingWarnings(raw.warnings);
  const totalDriveHours = round(raw.schedule.reduce((sum, day) => sum + day.driveHours, 0));
  const totalDistanceKm = raw.schedule.reduce((sum, day) => sum + day.distanceKm, 0);
  const score = Math.max(0, Math.min(99, Math.round(96 - raw.partition.cost / 18 - raw.warnings.length * 2)));

  return {
    id: strategy,
    ...strategyCopy[strategy],
    routeKind: raw.route.kind,
    routeAnchorIds: anchorIdsForRoute(raw.route.legs),
    schedule: raw.schedule,
    warnings: raw.warnings,
    feasible,
    score,
    selectedAttractionIds: requiredIds,
    suggestedAttractionIds: suggestedIds,
    minimumDays: feasible ? input.days : estimateMinimumDays(input, strategy, requiredIds),
    totalDriveHours,
    totalDistanceKm,
  };
}

export function buildPlanOptions(input: PlannerInput): PlanOption[] {
  const order: Strategy[] = unique([input.priority, "comfort", "scenery", "culture"] as Strategy[]);
  const options = order.map((strategy) => makeOption(input, strategy));
  const bestIndex = options.findIndex((option) => option.feasible);

  if (bestIndex > 0) {
    const [best] = options.splice(bestIndex, 1);
    options.unshift(best);
  }

  return options;
}

export function getAttraction(id: string): Attraction | undefined {
  return attractionById.get(id);
}
