import type { Attraction, Copy, RouteLeg, Vehicle } from "./data.ts";
import { anchorCoordinates, attractions, c, roadLegs, routeAnchors, strategySuggestions } from "./data.ts";
import { osmServicePoints } from "./services.ts";

export type Strategy = keyof typeof strategySuggestions;
export type RoadEvent = { id: string; legIds: string[]; impact: "closed" | "restricted" | "delay"; delayHours?: number; startsAt: string; endsAt: string; title: Copy };
export type PlannerInput = { days: number; maxDrive: number; priority: Strategy; avoidNight: boolean; autoSuggest: boolean; selectedAttractionIds: string[]; startDate: string; startAnchorId: string; endAnchorId: string; departureTime: string; vehicle: Vehicle; evRangeKm: number; lockOrder: boolean; roadEvents?: RoadEvent[] };
export type PlanWarning = { code: string; severity: "warn" | "block"; day?: number; message: Copy };
export type EvChargeStop = { anchorId: string; legDistanceKm: number; estimatedChargeMinutes: number; chargerCount: number; required: boolean };
export type EvTravelLeg = { fromAnchorId: string; toAnchorId: string; distanceKm: number };
export type EvDayPlan = { safeBudgetKm: number; usagePercent: number; status: "ok" | "arrival" | "verify" | "blocked"; chargeStops: EvChargeStop[]; travelLegs: EvTravelLeg[]; destinationTopUpMinutes: number; destinationChargerCount: number; unresolvedBeforeAnchorId?: string };
export type DayRouteStep = { legId: string; fromAnchorId: string; toAnchorId: string; road: string; driveHours: number; distanceKm: number };
export type DayAgendaItem = { kind: "drive" | "visit" | "rest" | "lunch" | "charge"; startTime: string; endTime: string; anchorId: string; fromAnchorId?: string; toAnchorId?: string; attractionId?: string; road?: string; driveHours?: number; distanceKm?: number; detourDirection?: "outbound" | "return"; driveContinuation?: boolean; chargeKind?: "enroute" | "destination"; chargeMinutes?: number; chargerCount?: number };
export type PlanDay = { day: number; date: string; sunrise: string; sunset: string; daylightHours: number; departureTime: string; estimatedArrivalTime: string; daylightMarginMinutes: number; startAnchorId: string; endAnchorId: string; viaAnchorIds: string[]; routeSteps: DayRouteStep[]; agenda: DayAgendaItem[]; driveHours: number; distanceKm: number; activityHours: number; restHours: number; mealHours: number; chargeHours: number; dutyHours: number; freeHours: number; sleepAltitude: number; attractionIds: string[]; roads: string[]; legIds: string[]; evPlan?: EvDayPlan };
export type PlanOption = { id: Strategy; title: Copy; subtitle: Copy; routeKind: "network"; routeAnchorIds: string[]; schedule: PlanDay[]; warnings: PlanWarning[]; feasible: boolean; score: number; selectedAttractionIds: string[]; suggestedAttractionIds: string[]; minimumDays: number | null; totalDriveHours: number; totalDistanceKm: number; activeRoadEventCount: number };
type Task = { kind: "travel" | "visit"; fromAnchorId: string; toAnchorId: string; driveHours: number; distanceKm: number; activityHours: number; road?: string; legId?: string; evLimited?: boolean; attractionId?: string; effort?: Attraction["effort"] };
type Segment = { start: number; end: number };
type PathResult = { legs: RouteLeg[]; cost: number };

const attractionById = new Map(attractions.map((item) => [item.id, item]));
const attractionAliases: Record<string, string> = {
  "fuyang-old-town": "songpan-old-town",
  "suochong-pheasant": "sangdui-red-grass",
};
const round = (value: number) => Math.round(value * 10) / 10;
const round2 = (value: number) => Math.round(value * 100) / 100;
const unique = <T,>(values: T[]): T[] => [...new Set(values)];
const canonicalAttractionId = (id: string) => attractionAliases[id] ?? id;
export function normalizeAttractionIds(ids: string[]): string[] {
  const result: string[] = [];
  const groups = new Set<string>();
  for (const rawId of ids) {
    const id = canonicalAttractionId(rawId);
    const item = attractionById.get(id);
    if (!item) continue;
    const group = item.placeGroupId ?? item.id;
    if (groups.has(group)) continue;
    groups.add(group);
    result.push(id);
  }
  return result;
}
const planningRoadHours = (edge: RouteLeg) => round(edge.hours * (edge.evSupport === "limited" ? 1.2 : /G4217|G4218|G5|S9/.test(edge.road) ? 1.1 : 1.15));
const planningDetourHours = (hours: number) => round(hours * 1.15);
const strategyCopy: Record<Strategy, { title: Copy; subtitle: Copy }> = {
  comfort: { title: c("舒适安全方案", "Comfort-first plan"), subtitle: c("优先控制驾驶、日照窗口、住宿海拔和高强度活动", "Controls driving, daylight, sleeping altitude and demanding activities") },
  scenery: { title: c("景观丰富方案", "Scenery-rich plan"), subtitle: c("在必去景点之外加入少量顺路自然景观", "Adds a small number of en-route landscapes beyond must-sees") },
  culture: { title: c("人文村落方案", "Culture and villages plan"), subtitle: c("在必去景点之外优先补充城镇、村寨和历史停留", "Adds towns, villages and historic stops beyond must-sees") },
};

function addDays(date: string, amount: number): string { const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + amount); return value.toISOString().slice(0, 10); }
const timeToHours = (value: string) => { const [hours, minutes] = value.split(":").map(Number); return hours + minutes / 60; };
const hoursToTime = (value: number) => { const normalized = ((value % 24) + 24) % 24; const totalMinutes = Math.round(normalized * 60); return `${String(Math.floor(totalMinutes / 60) % 24).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`; };
function daylight(date: string, latitude: number, longitude: number) {
  const d = new Date(`${date}T12:00:00Z`); const start = Date.UTC(d.getUTCFullYear(), 0, 0); const dayOfYear = Math.floor((d.getTime() - start) / 86400000);
  const declination = -23.44 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365); const lat = latitude * Math.PI / 180; const dec = declination * Math.PI / 180;
  const angle = Math.acos(Math.max(-1, Math.min(1, -Math.tan(lat) * Math.tan(dec)))); const hours = 24 * angle / Math.PI; const solarNoon = 12 + (120 - longitude) / 15; const sunrise = solarNoon - hours / 2; const sunset = solarNoon + hours / 2;
  return { hours: round(hours), sunrise: hoursToTime(sunrise), sunset: hoursToTime(sunset) };
}
function activeEvents(input: PlannerInput): RoadEvent[] { const end = addDays(input.startDate, input.days - 1); return (input.roadEvents ?? []).filter((event) => event.startsAt.slice(0, 10) <= end && event.endsAt.slice(0, 10) >= input.startDate); }

function shortestPath(from: string, to: string, input: PlannerInput): PathResult | null {
  if (from === to) return { legs: [], cost: 0 };
  const events = activeEvents(input); const closed = new Set(events.filter((event) => event.impact === "closed").flatMap((event) => event.legIds)); const delayByLeg = new Map<string, number>();
  for (const event of events.filter((item) => item.impact !== "closed")) for (const id of event.legIds) delayByLeg.set(id, (delayByLeg.get(id) ?? 0) + (event.delayHours ?? (event.impact === "restricted" ? 1 : 0.5)));
  const distance = new Map<string, number>([[from, 0]]); const previous = new Map<string, { node: string; leg: RouteLeg }>(); const unvisited = new Set(Object.keys(routeAnchors));
  while (unvisited.size) {
    let current: string | null = null; let best = Infinity;
    for (const node of unvisited) { const value = distance.get(node) ?? Infinity; if (value < best) { best = value; current = node; } }
    if (!current || best === Infinity) break; unvisited.delete(current); if (current === to) break;
    for (const edge of roadLegs) {
      if (closed.has(edge.id)) continue; const next = edge.from === current ? edge.to : edge.to === current ? edge.from : null; if (!next || !unvisited.has(next)) continue;
      const candidate = best + planningRoadHours(edge) + (delayByLeg.get(edge.id) ?? 0);
      if (candidate < (distance.get(next) ?? Infinity)) { distance.set(next, candidate); previous.set(next, { node: current, leg: edge.from === current ? edge : { ...edge, from: edge.to, to: edge.from } }); }
    }
  }
  if (!previous.has(to)) return null; const legs: RouteLeg[] = []; let cursor = to;
  while (cursor !== from) { const step = previous.get(cursor); if (!step) return null; legs.unshift(step.leg); cursor = step.node; }
  return { legs, cost: distance.get(to) ?? 0 };
}

function orderedAnchors(ids: string[], input: PlannerInput): string[] {
  const anchors = unique(ids.map((id) => attractionById.get(id)?.anchorId).filter((id): id is string => Boolean(id))).filter((id) => id !== input.startAnchorId && id !== input.endAnchorId); if (input.lockOrder || anchors.length < 2) return anchors;
  const remaining = [...anchors]; const result: string[] = []; let current = input.startAnchorId;
  while (remaining.length) { let bestIndex = 0; let bestCost = Infinity; remaining.forEach((anchor, index) => { const path = shortestPath(current, anchor, input); if (path && path.cost < bestCost) { bestIndex = index; bestCost = path.cost; } }); current = remaining.splice(bestIndex, 1)[0]; result.push(current); }
  return result;
}
function buildRoute(ids: string[], input: PlannerInput): RouteLeg[] | null {
  const stops = [input.startAnchorId, ...orderedAnchors(ids, input), input.endAnchorId]; const result: RouteLeg[] = [];
  for (let index = 1; index < stops.length; index += 1) { const path = shortestPath(stops[index - 1], stops[index], input); if (!path) return null; result.push(...path.legs); }
  return result;
}
function buildTasks(legs: RouteLeg[], attractionIds: string[], startAnchorId: string): Task[] {
  const byAnchor = new Map<string, Attraction[]>(); for (const id of attractionIds) { const item = attractionById.get(id); if (item) byAnchor.set(item.anchorId, [...(byAnchor.get(item.anchorId) ?? []), item]); }
  const visited = new Set<string>([startAnchorId]); const tasks: Task[] = [];
  for (const item of byAnchor.get(startAnchorId) ?? []) tasks.push({ kind: "visit", fromAnchorId: item.anchorId, toAnchorId: item.anchorId, driveHours: planningDetourHours(item.detourHours), distanceKm: item.detourKm, activityHours: item.visitHours, attractionId: item.id, effort: item.effort });
  for (const routeLeg of legs) {
    tasks.push({ kind: "travel", fromAnchorId: routeLeg.from, toAnchorId: routeLeg.to, driveHours: planningRoadHours(routeLeg), distanceKm: routeLeg.km, activityHours: 0, road: routeLeg.road, legId: routeLeg.id, evLimited: routeLeg.evSupport === "limited" });
    if (!visited.has(routeLeg.to)) { for (const item of byAnchor.get(routeLeg.to) ?? []) tasks.push({ kind: "visit", fromAnchorId: item.anchorId, toAnchorId: item.anchorId, driveHours: planningDetourHours(item.detourHours), distanceKm: item.detourKm, activityHours: item.visitHours, attractionId: item.id, effort: item.effort }); visited.add(routeLeg.to); }
  }
  return tasks;
}
function summarize(tasks: Task[], start: number, end: number) {
  const slice = tasks.slice(start, end); return { startAnchorId: slice[0].fromAnchorId, endAnchorId: slice.at(-1)!.toAnchorId, viaAnchorIds: unique(slice.filter((task) => task.kind === "travel").map((task) => task.toAnchorId)), routeSteps: slice.flatMap((task): DayRouteStep[] => task.kind === "travel" && task.legId && task.road ? [{ legId: task.legId, fromAnchorId: task.fromAnchorId, toAnchorId: task.toAnchorId, road: task.road, driveHours: task.driveHours, distanceKm: task.distanceKm }] : []), driveHours: slice.reduce((sum, task) => sum + task.driveHours, 0), distanceKm: slice.reduce((sum, task) => sum + task.distanceKm, 0), activityHours: slice.reduce((sum, task) => sum + task.activityHours, 0), attractionIds: slice.flatMap((task) => task.attractionId ? [task.attractionId] : []), roads: unique(slice.flatMap((task) => task.road ? [task.road] : [])), legIds: unique(slice.flatMap((task) => task.legId ? [task.legId] : [])), hasLimitedEvLeg: slice.some((task) => task.evLimited), highEffort: slice.filter((task) => task.effort === "high").length };
}
function plannedBreaks(driveHours: number, activityHours: number) {
  const mealHours = driveHours + activityHours >= 2.5 ? 0.75 : 0;
  const baseRestHours = driveHours >= 1.5 ? Math.max(1, Math.floor(driveHours / 2)) * 0.25 : 0;
  const restHours = Math.max(0, baseRestHours - (mealHours > 0 ? 0.25 : 0));
  return { restHours, mealHours };
}
function evPlanFrom(value: ReturnType<typeof summarize>, input: PlannerInput): EvDayPlan {
  const safeBudgetKm = Math.floor(input.evRangeKm * 0.65);
  const usagePercent = Math.round(value.distanceKm / Math.max(1, safeBudgetKm) * 100);
  const nodes: Array<{ anchorId: string; distanceKm: number }> = [{ anchorId: value.startAnchorId, distanceKm: 0 }];
  let cumulative = 0;
  for (const step of value.routeSteps) { cumulative += step.distanceKm; nodes.push({ anchorId: step.toAnchorId, distanceKm: cumulative }); }
  if (nodes.length === 1 || nodes.at(-1)!.anchorId !== value.endAnchorId) nodes.push({ anchorId: value.endAnchorId, distanceKm: cumulative });
  const totalKm = Math.max(value.distanceKm, cumulative);
  const chargeStops: EvChargeStop[] = [];
  const travelLegs: EvTravelLeg[] = [];
  const chargerCountAt = (anchorId: string) => osmServicePoints.filter((point) => point.anchorId === anchorId && point.types.includes("charging")).length;
  let startIndex = 0;
  let startDistance = 0;
  while (totalKm - startDistance > safeBudgetKm) {
    let candidateIndex = -1; let verifiedCandidateIndex = -1;
    for (let index = startIndex + 1; index < nodes.length - 1; index += 1) {
      if (nodes[index].distanceKm - startDistance <= safeBudgetKm && routeAnchors[nodes[index].anchorId]?.canStay) {
        candidateIndex = index; if (chargerCountAt(nodes[index].anchorId) > 0) verifiedCandidateIndex = index;
      }
    }
    if (verifiedCandidateIndex >= 0) candidateIndex = verifiedCandidateIndex;
    if (candidateIndex < 0) {
      const next = nodes.find((node) => node.distanceKm > startDistance + safeBudgetKm);
      return { safeBudgetKm, usagePercent, status: "blocked", chargeStops, travelLegs, destinationTopUpMinutes: 0, destinationChargerCount: 0, unresolvedBeforeAnchorId: next?.anchorId ?? value.endAnchorId };
    }
    const stop = nodes[candidateIndex]; const legDistanceKm = Math.round(stop.distanceKm - startDistance);
    travelLegs.push({ fromAnchorId: nodes[startIndex].anchorId, toAnchorId: stop.anchorId, distanceKm: legDistanceKm });
    const chargerCount = chargerCountAt(stop.anchorId);
    chargeStops.push({ anchorId: stop.anchorId, legDistanceKm, estimatedChargeMinutes: Math.max(20, Math.ceil(legDistanceKm * 0.22 / 10) * 10), chargerCount, required: true });
    startIndex = candidateIndex; startDistance = stop.distanceKm;
  }
  const finalDistance = Math.round(totalKm - startDistance);
  travelLegs.push({ fromAnchorId: nodes[startIndex].anchorId, toAnchorId: value.endAnchorId, distanceKm: finalDistance });
  const destinationTopUpMinutes = finalDistance >= safeBudgetKm * 0.55 ? Math.max(20, Math.ceil(finalDistance * 0.22 / 10) * 10) : 0;
  const destinationChargerCount = destinationTopUpMinutes > 0 ? chargerCountAt(value.endAnchorId) : 0;
  const unverified = chargeStops.some((stop) => stop.chargerCount === 0) || (destinationTopUpMinutes > 0 && destinationChargerCount === 0);
  const status = unverified ? "verify" : chargeStops.length > 0 ? "ok" : destinationTopUpMinutes > 0 ? "arrival" : "ok";
  return { safeBudgetKm, usagePercent, status, chargeStops, travelLegs, destinationTopUpMinutes, destinationChargerCount };
}
function agendaFrom(tasks: Task[], segment: Segment, input: PlannerInput, mealHours: number): DayAgendaItem[] {
  const agenda: DayAgendaItem[] = []; const slice = tasks.slice(segment.start, segment.end); let current = timeToHours(input.departureTime); let lunchRemaining = mealHours; let driveSinceRest = 0; let lastRestEnd = -Infinity; let currentAnchor = slice[0]?.fromAnchorId ?? input.startAnchorId;
  const addPause = (kind: "rest" | "lunch", duration: number, context: Partial<Pick<DayAgendaItem, "attractionId" | "road" | "fromAnchorId" | "toAnchorId">> = {}) => {
    if (duration <= 0) return;
    const startTime = hoursToTime(current); current += duration; const endTime = hoursToTime(current); const previous = agenda.at(-1);
    if (previous && previous.anchorId === currentAnchor && previous.endTime === startTime && previous.attractionId === context.attractionId && previous.road === context.road && (previous.kind === "rest" || previous.kind === "lunch")) {
      previous.kind = previous.kind === "lunch" || kind === "lunch" ? "lunch" : "rest"; previous.endTime = endTime;
    } else agenda.push({ kind, startTime, endTime, anchorId: currentAnchor, ...context });
    driveSinceRest = 0; if (kind === "rest") lastRestEnd = current;
  };
  const addDrive = (task: Task, duration: number, distanceKm: number, options: Partial<Pick<DayAgendaItem, "attractionId" | "detourDirection" | "driveContinuation">> = {}) => {
    if (duration <= 0) return;
    const startTime = hoursToTime(current); current += duration;
    agenda.push({ kind: "drive", startTime, endTime: hoursToTime(current), anchorId: task.toAnchorId, fromAnchorId: task.fromAnchorId, toAnchorId: task.toAnchorId, road: task.road ?? "景点支线 / Attraction branch", driveHours: duration < 0.2 ? round2(duration) : round(duration), distanceKm: Math.round(distanceKm), ...options });
    driveSinceRest += duration;
  };
  const addVisit = (task: Task, duration: number) => {
    if (duration <= 0 || !task.attractionId) return;
    const startTime = hoursToTime(current); current += duration;
    agenda.push({ kind: "visit", startTime, endTime: hoursToTime(current), anchorId: task.toAnchorId, attractionId: task.attractionId });
    if (duration >= 0.25) driveSinceRest = 0;
  };
  for (let taskIndex = 0; taskIndex < slice.length; taskIndex += 1) {
    const task = slice[taskIndex]; const nextTask = slice[taskIndex + 1];
    const duration = task.driveHours + task.activityHours;
    if (task.kind === "visit" && task.attractionId) {
      currentAnchor = task.toAnchorId;
      const outboundHours = task.driveHours / 2; const returnHours = Math.max(0, task.driveHours - outboundHours);
      const outboundKm = Math.ceil(task.distanceKm / 2); const returnKm = task.distanceKm - outboundKm;
      if (lunchRemaining > 0 && current >= 11.25 && current <= 13.5 && current + duration > 12.5) { addPause("lunch", lunchRemaining); lunchRemaining = 0; }
      addDrive(task, outboundHours, outboundKm, { attractionId: task.attractionId, detourDirection: "outbound" });
      if (lunchRemaining > 0 && current < 12 && current + task.activityHours > 13) {
        const morningDuration = 12 - current; addVisit(task, morningDuration);
        addPause("lunch", lunchRemaining, { attractionId: task.attractionId }); lunchRemaining = 0;
        addVisit(task, task.activityHours - morningDuration);
      } else {
        if (lunchRemaining > 0 && current >= 11.75 && current <= 14.5) { addPause("lunch", lunchRemaining, { attractionId: task.attractionId }); lunchRemaining = 0; }
        addVisit(task, task.activityHours);
      }
      addDrive(task, returnHours, returnKm, { attractionId: task.attractionId, detourDirection: "return" });
      continue;
    }
    if (lunchRemaining > 0 && current >= 11.5 && current + duration > 13.25) { addPause("lunch", lunchRemaining); lunchRemaining = 0; }
    if (task.kind === "travel") {
      let remainingHours = task.driveHours; let remainingKm = task.distanceKm; let consumedHours = 0;
      const addRequiredPause = () => {
        if (lunchRemaining > 0 && current >= 11.5 && current <= 13.25) { addPause("lunch", lunchRemaining, { road: task.road, fromAnchorId: task.fromAnchorId, toAnchorId: task.toAnchorId }); lunchRemaining = 0; }
        else addPause("rest", 0.25, { road: task.road, fromAnchorId: task.fromAnchorId, toAnchorId: task.toAnchorId });
      };
      while (remainingHours > 0.001) {
        const continuousAtArrival = driveSinceRest + remainingHours; const arrivalTime = current + remainingHours;
        const naturalStopSoon = continuousAtArrival <= 2.15 && (
          (lunchRemaining > 0 && arrivalTime >= 11.5 && arrivalTime <= 13.75)
          || (nextTask?.kind === "visit" && nextTask.activityHours >= 0.25)
        );
        if (continuousAtArrival <= 2 || naturalStopSoon) {
          addDrive(task, remainingHours, remainingKm, { driveContinuation: consumedHours > 0 }); remainingHours = 0; remainingKm = 0; break;
        }
        if (driveSinceRest >= 1.6) { addRequiredPause(); continue; }
        const chunkHours = Math.min(remainingHours, Math.max(0.1, 1.75 - driveSinceRest));
        const chunkKm = chunkHours >= remainingHours - 0.001 ? remainingKm : Math.round(remainingKm * chunkHours / remainingHours);
        addDrive(task, chunkHours, chunkKm, { driveContinuation: consumedHours > 0 }); consumedHours += chunkHours; remainingHours -= chunkHours; remainingKm -= chunkKm;
        if (remainingHours > 0.001) addRequiredPause();
      }
      currentAnchor = task.toAnchorId;
    }
    if (lunchRemaining > 0 && current >= 11.5 && current <= 14.25) {
      const canDeferPastRecentRest = current - lastRestEnd < 0.75 && nextTask?.kind === "travel" && current + nextTask.driveHours <= 14.25;
      if (!canDeferPastRecentRest) { addPause("lunch", lunchRemaining); lunchRemaining = 0; }
    }
  }
  if (lunchRemaining > 0 && current >= 11.25) addPause("lunch", lunchRemaining);
  return agenda;
}
function agendaWithEvCharges(agenda: DayAgendaItem[], evPlan: EvDayPlan, endAnchorId: string, departureTime: string): DayAgendaItem[] {
  const result = agenda.map((item) => ({ ...item }));
  let searchFrom = 0;
  for (const stop of evPlan.chargeStops) {
    const arrivalIndexes = result.flatMap((item, index) => index >= searchFrom && item.kind === "drive" && !item.detourDirection && item.toAnchorId === stop.anchorId ? [index] : []);
    const arrivalIndex = arrivalIndexes.at(-1);
    if (arrivalIndex === undefined) continue;
    let insertIndex = arrivalIndex + 1;
    if (result[insertIndex]?.kind === "rest") result.splice(insertIndex, 1);
    result.splice(insertIndex, 0, { kind: "charge", startTime: "00:00", endTime: "00:00", anchorId: stop.anchorId, chargeKind: "enroute", chargeMinutes: stop.estimatedChargeMinutes, chargerCount: stop.chargerCount });
    searchFrom = insertIndex + 1;
  }
  if (evPlan.destinationTopUpMinutes > 0) result.push({ kind: "charge", startTime: "00:00", endTime: "00:00", anchorId: endAnchorId, chargeKind: "destination", chargeMinutes: evPlan.destinationTopUpMinutes, chargerCount: evPlan.destinationChargerCount });
  let current = timeToHours(departureTime);
  return result.map((item) => {
    const duration = item.kind === "charge" ? (item.chargeMinutes ?? 0) / 60 : (timeToHours(item.endTime) - timeToHours(item.startTime) + 24) % 24;
    const startTime = hoursToTime(current); current += duration;
    return { ...item, startTime, endTime: hoursToTime(current) };
  });
}
function segmentCost(tasks: Task[], start: number, end: number, day: number, input: PlannerInput, strategy: Strategy, target: number): number {
  const value = summarize(tasks, start, end); const coordinate = anchorCoordinates[value.endAnchorId]; const light = daylight(addDays(input.startDate, day), coordinate.latitude, coordinate.longitude); const breaks = plannedBreaks(value.driveHours, value.activityHours); const evPlan = input.vehicle === "ev" ? evPlanFrom(value, input) : undefined; const chargeHours = evPlan ? (evPlan.chargeStops.reduce((sum, stop) => sum + stop.estimatedChargeMinutes, 0) + evPlan.destinationTopUpMinutes) / 60 : 0; const duty = value.driveHours + value.activityHours + breaks.restHours + breaks.mealHours + chargeHours; const daylightLimit = timeToHours(light.sunset) - 0.5 - timeToHours(input.departureTime); const dutyLimit = input.avoidNight ? Math.max(0.5, daylightLimit) : 10.5; const gain = routeAnchors[value.endAnchorId].altitude - routeAnchors[value.startAnchorId].altitude;
  let cost = Math.pow(duty - target, 2) * 1.5; cost += Math.pow(Math.max(0, value.driveHours - input.maxDrive), 2) * (strategy === "comfort" ? 180 : 140); cost += Math.pow(Math.max(0, duty - dutyLimit), 2) * 150;
  if (day === 0 && routeAnchors[input.startAnchorId].altitude < 2000 && routeAnchors[value.endAnchorId].altitude > 2800) cost += 140; if (gain > 1500 && routeAnchors[value.endAnchorId].altitude > 2600) cost += 80; cost += value.highEffort * (strategy === "comfort" ? 50 : 22); return cost;
}
function partition(tasks: Task[], input: PlannerInput, strategy: Strategy): Segment[] | null {
  if (tasks.length < input.days) return null; const target = tasks.reduce((sum, task) => sum + task.driveHours + task.activityHours, 0) / input.days;
  const dp: Array<Array<{ cost: number; prev: number } | null>> = Array.from({ length: input.days + 1 }, () => Array(tasks.length + 1).fill(null)); dp[0][0] = { cost: 0, prev: -1 };
  for (let day = 0; day < input.days; day += 1) for (let start = 0; start < tasks.length; start += 1) { const state = dp[day][start]; if (!state) continue; for (let end = start + 1; end <= tasks.length; end += 1) { const remaining = input.days - day - 1; if (tasks.length - end < remaining || (remaining === 0 && end !== tasks.length) || (remaining > 0 && end === tasks.length) || !routeAnchors[tasks[end - 1].toAnchorId].canStay) continue; const cost = state.cost + segmentCost(tasks, start, end, day, input, strategy, target); if (!dp[day + 1][end] || cost < dp[day + 1][end]!.cost) dp[day + 1][end] = { cost, prev: start }; } }
  if (!dp[input.days][tasks.length]) return null; const result: Segment[] = []; let end = tasks.length; for (let day = input.days; day > 0; day -= 1) { const start = dp[day][end]!.prev; result.unshift({ start, end }); end = start; } return result;
}
function scheduleFrom(tasks: Task[], segments: Segment[], input: PlannerInput): PlanDay[] {
  return segments.map((segment, index) => {
    const value = summarize(tasks, segment.start, segment.end); const date = addDays(input.startDate, index); const coordinate = anchorCoordinates[value.endAnchorId]; const light = daylight(date, coordinate.latitude, coordinate.longitude); const breaks = plannedBreaks(value.driveHours, value.activityHours); const safeSunset = timeToHours(light.sunset) - 0.5; const availableHours = input.avoidNight ? Math.max(0, safeSunset - timeToHours(input.departureTime)) : 10.5; const evPlan = input.vehicle === "ev" ? evPlanFrom(value, input) : undefined; const baseAgenda = agendaFrom(tasks, segment, input, breaks.mealHours); const agenda = evPlan ? agendaWithEvCharges(baseAgenda, evPlan, value.endAnchorId, input.departureTime) : baseAgenda; const itemHours = (item: DayAgendaItem) => (timeToHours(item.endTime) - timeToHours(item.startTime) + 24) % 24; const restHours = round2(agenda.filter((item) => item.kind === "rest").reduce((sum, item) => sum + itemHours(item), 0)); const mealHours = round2(agenda.filter((item) => item.kind === "lunch").reduce((sum, item) => sum + itemHours(item), 0)); const chargeHours = round2(agenda.filter((item) => item.kind === "charge").reduce((sum, item) => sum + itemHours(item), 0)); const dutyHours = round(agenda.reduce((sum, item) => sum + itemHours(item), 0)); const estimatedArrivalTime = agenda.at(-1)?.endTime ?? input.departureTime; const arrivalHours = timeToHours(estimatedArrivalTime);
    return { day: index + 1, date, sunrise: light.sunrise, sunset: light.sunset, daylightHours: light.hours, departureTime: input.departureTime, estimatedArrivalTime, daylightMarginMinutes: Math.round((safeSunset - arrivalHours) * 60), startAnchorId: value.startAnchorId, endAnchorId: value.endAnchorId, viaAnchorIds: value.viaAnchorIds, routeSteps: value.routeSteps, agenda, driveHours: round(value.driveHours), distanceKm: Math.round(value.distanceKm), activityHours: round(value.activityHours), restHours, mealHours, chargeHours, dutyHours, freeHours: round(Math.max(0, availableHours - dutyHours)), sleepAltitude: routeAnchors[value.endAnchorId].altitude, attractionIds: value.attractionIds, roads: value.roads, legIds: value.legIds, ...(evPlan ? { evPlan } : {}) };
  });
}
function warningsFor(schedule: PlanDay[], input: PlannerInput): PlanWarning[] {
  const warnings: PlanWarning[] = []; const month = new Date(`${input.startDate}T12:00:00Z`).getUTCMonth() + 1;
  for (const day of schedule) {
    const limit = input.avoidNight ? Math.max(0.5, timeToHours(day.sunset) - 0.5 - timeToHours(input.departureTime)) : 10.5; const gain = day.sleepAltitude - routeAnchors[day.startAnchorId].altitude;
    if (day.driveHours > input.maxDrive + 0.05) warnings.push({ code: `drive-${day.day}`, severity: "block", day: day.day, message: c(`第${day.day}天驾驶${day.driveHours}小时，超过${input.maxDrive}小时上限。`, `Day ${day.day} has ${day.driveHours} driving hours, above the ${input.maxDrive}-hour cap.`) });
    if (day.dutyHours > limit + 0.05) warnings.push({ code: `light-${day.day}`, severity: "block", day: day.day, message: c(`第${day.day}天预计${day.estimatedArrivalTime}完成，超过日落前30分钟的保守窗口。`, `Day ${day.day} is estimated to finish at ${day.estimatedArrivalTime}, beyond the conservative 30-minute pre-sunset margin.`) });
    if (timeToHours(input.departureTime) < timeToHours(day.sunrise) - 0.25) warnings.push({ code: `early-${day.day}`, severity: "warn", day: day.day, message: c(`第${day.day}天${input.departureTime}出发早于估算日出${day.sunrise}。`, `Day ${day.day} departs at ${input.departureTime}, before the estimated ${day.sunrise} sunrise.`) });
    if (day.day === 1 && routeAnchors[input.startAnchorId].altitude < 2000 && day.sleepAltitude > 2800) warnings.push({ code: "first-night", severity: "block", day: 1, message: c("从低海拔起点出发，第一晚直接住到2800米以上，建议增加低海拔过渡夜。", "Starting low and sleeping above 2,800 m on the first night calls for a lower-altitude transition night.") }); else if (gain > 1500 && day.sleepAltitude > 2600) warnings.push({ code: `gain-${day.day}`, severity: "warn", day: day.day, message: c(`第${day.day}天住宿海拔上升约${gain}米。`, `Sleeping altitude rises by about ${gain} m on day ${day.day}.`) });
    if (input.vehicle === "ev" && day.evPlan?.status === "blocked") warnings.push({ code: `ev-${day.day}`, severity: "block", day: day.day, message: c(`第${day.day}天在保守续航内找不到可落脚的途中补能节点，当前方案不可直接执行。`, `Day ${day.day} has no reachable en-route charging node within the conservative budget and must not be used as-is.`) });
    else if (input.vehicle === "ev" && day.evPlan?.status === "verify") warnings.push({ code: `ev-${day.day}`, severity: "warn", day: day.day, message: c(`第${day.day}天需要途中补能，但每周开放地图快照尚未核验到全部充电点；出发前必须用运营商或合规导航确认。`, `Day ${day.day} requires en-route charging, but the weekly open-map snapshot has not verified every stop; confirm with the operator or a licensed navigation service.`) });
    for (const id of day.attractionIds) { const item = attractionById.get(id); if (item?.bestMonths?.length && !item.bestMonths.includes(month)) warnings.push({ code: `season-${id}`, severity: "warn", day: day.day, message: c(`${item.name.zh}不在种子数据标注的推荐月份内；这不是闭园判断，请查官方公告。`, `${item.name.en} is outside the seed-data preferred months. This is not a closure determination; check the official notice.`) }); if (item?.effort === "high") warnings.push({ code: `effort-${id}`, severity: "warn", day: day.day, message: c(`${item.name.zh}属于高海拔或高强度项目。`, `${item.name.en} is a high-altitude or demanding activity.`) }); }
  }
  for (const event of activeEvents(input)) warnings.push({ code: `event-${event.id}`, severity: "warn", message: c(`审核道路公告已参与计算：${event.title.zh}`, `Reviewed road notice applied: ${event.title.en}`) }); return warnings;
}
function rawPlan(input: PlannerInput, strategy: Strategy, ids: string[]) { const legs = buildRoute(ids, input); if (!legs) return null; const tasks = buildTasks(legs, ids, input.startAnchorId); const endAnchorId = legs.at(-1)?.to ?? input.endAnchorId; let stayBoundaries = tasks.filter((task) => routeAnchors[task.toAnchorId].canStay).length; while (tasks.length < input.days || stayBoundaries < input.days) { tasks.push({ kind: "visit", fromAnchorId: endAnchorId, toAnchorId: endAnchorId, driveHours: 0, distanceKm: 0, activityHours: 0.1 }); stayBoundaries += 1; } const segments = partition(tasks, input, strategy); if (!segments) return null; const schedule = scheduleFrom(tasks, segments, input); return { legs, schedule, warnings: warningsFor(schedule, input) }; }
function normalizeInput(input: PlannerInput): PlannerInput { const startAnchorId = routeAnchors[input.startAnchorId] ? input.startAnchorId : "chengdu"; const endAnchorId = routeAnchors[input.endAnchorId] ? input.endAnchorId : startAnchorId; return { ...input, startDate: input.startDate || new Date().toISOString().slice(0, 10), startAnchorId, endAnchorId, departureTime: /^\d{2}:\d{2}$/.test(input.departureTime) ? input.departureTime : "08:30", vehicle: input.vehicle || "sedan", evRangeKm: input.evRangeKm || 450, autoSuggest: input.autoSuggest !== false, lockOrder: Boolean(input.lockOrder) }; }
function minimumDays(input: PlannerInput, strategy: Strategy, ids: string[]): number | null { for (let days = input.days; days <= 14; days += 1) { const raw = rawPlan({ ...input, days }, strategy, ids); if (raw && !raw.warnings.some((warning) => warning.severity === "block")) return days; } return null; }
function makeOption(sourceInput: PlannerInput, strategy: Strategy): PlanOption {
  const input = normalizeInput(sourceInput); const required = normalizeAttractionIds(input.selectedAttractionIds); const requiredGroups = new Set(required.map((id) => attractionById.get(id)?.placeGroupId ?? id)); const requiredRoute = buildRoute(required, input); const routeAnchorSet = new Set([input.startAnchorId, input.endAnchorId, ...(requiredRoute?.flatMap((leg) => [leg.from, leg.to]) ?? [])]); const month = new Date(`${input.startDate}T12:00:00Z`).getUTCMonth() + 1; const theme = strategy === "culture" ? "culture" : strategy === "scenery" ? "scenery" : "rest"; const strategyOrder = new Map<string, number>(strategySuggestions[strategy].map((id, index) => [id, index])); const candidates = attractions
    .filter((item) => routeAnchorSet.has(item.anchorId) && item.visitHours <= 4 && item.detourHours <= 1 && item.bestMonths.includes(month) && (item.themes.includes(theme) || strategy === "comfort") && !required.includes(item.id) && !requiredGroups.has(item.placeGroupId ?? item.id))
    .sort((left, right) => (strategyOrder.get(left.id) ?? 99) - (strategyOrder.get(right.id) ?? 99) || left.detourHours - right.detourHours || left.visitHours - right.visitHours)
    .map((item) => item.id); let suggested: string[] = []; let raw = rawPlan(input, strategy, required); const suggestionLimit = Math.min(12, Math.max(4, input.days * 2));
  if (input.autoSuggest && raw && !raw.warnings.some((item) => item.severity === "block")) for (const candidate of candidates) {
    const candidateGroup = attractionById.get(candidate)?.placeGroupId ?? candidate;
    if (suggested.some((id) => (attractionById.get(id)?.placeGroupId ?? id) === candidateGroup)) continue;
    if (suggested.length >= suggestionLimit) break; const trial = rawPlan(input, strategy, [...required, ...suggested, candidate]); if (!trial || trial.warnings.some((item) => item.severity === "block") || trial.schedule.some((day) => day.attractionIds.length > 3 || day.activityHours > 8.5 || day.freeHours < 0.75)) continue; suggested.push(candidate); raw = trial;
  }
  const ids = [...required, ...suggested];
  if (!raw || raw.schedule.flatMap((day) => day.attractionIds).some((id) => !ids.includes(id))) raw = rawPlan(input, strategy, ids);
  if (!raw) return { id: strategy, ...strategyCopy[strategy], routeKind: "network", routeAnchorIds: [input.startAnchorId, input.endAnchorId], schedule: [], warnings: [{ code: "no-route", severity: "block", message: c("当前起终点、天数或审核后的道路状态无法形成完整路线。", "The current endpoints, duration or reviewed road status cannot form a complete route.") }], feasible: false, score: 0, selectedAttractionIds: required, suggestedAttractionIds: [], minimumDays: minimumDays(input, strategy, required), totalDriveHours: 0, totalDistanceKm: 0, activeRoadEventCount: activeEvents(input).length };
  const blocking = raw.warnings.some((item) => item.severity === "block"); const totalDriveHours = round(raw.schedule.reduce((sum, day) => sum + day.driveHours, 0)); const totalDistanceKm = raw.schedule.reduce((sum, day) => sum + day.distanceKm, 0); const routeAnchorIds = raw.legs.length ? [raw.legs[0].from, ...raw.legs.map((leg) => leg.to)] : [input.startAnchorId];
  return { id: strategy, ...strategyCopy[strategy], routeKind: "network", routeAnchorIds, schedule: raw.schedule, warnings: raw.warnings, feasible: !blocking, score: Math.max(0, Math.min(99, 96 - raw.warnings.length * 4)), selectedAttractionIds: required, suggestedAttractionIds: suggested, minimumDays: blocking ? minimumDays(input, strategy, required) : input.days, totalDriveHours, totalDistanceKm, activeRoadEventCount: activeEvents(input).length };
}
export function buildPlanOptions(input: PlannerInput): PlanOption[] { const normalized = normalizeInput(input); return unique([normalized.priority, "comfort", "scenery", "culture"] as Strategy[]).map((strategy) => makeOption(normalized, strategy)); }
export function getAttraction(id: string) { return attractionById.get(canonicalAttractionId(id)); }
export function getReturnDate(input: PlannerInput) { return addDays(input.startDate, input.days - 1); }
