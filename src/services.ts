import type { Copy, Locale } from "./data";
import { anchorCoordinates, c, routeAnchors } from "./data";
import officialData from "../data/official-service-points.json";
import osmData from "../data/osm-service-points.json";

export type ServiceType = "rest" | "toilet" | "water" | "rescue" | "fuel" | "charging" | "hospital" | "clinic";

export type ServicePoint = {
  id: string;
  name: Copy;
  types: ServiceType[];
  legIds: string[];
  road?: string;
  kilometer?: string;
  anchorId?: string;
  latitude?: number;
  longitude?: number;
  sourceUrl: string;
  sourceKind: "government" | "openstreetmap";
  powerKw?: number;
};

type OsmPoint = {
  id: string;
  name?: string;
  nameEn?: string;
  type: "fuel" | "charging" | "toilet" | "hospital" | "clinic";
  latitude: number;
  longitude: number;
  nearestAnchorId: string;
  powerKw?: number;
  osmUrl: string;
};

export const officialServicePoints: ServicePoint[] = officialData.points.map((point) => ({
  id: point.id,
  name: c(point.nameZh, point.nameEn),
  types: point.types as ServiceType[],
  legIds: point.legIds,
  road: point.road,
  kilometer: point.kilometer,
  sourceUrl: officialData.sourceUrl,
  sourceKind: "government",
}));

export const osmServicePoints: ServicePoint[] = (osmData.points as OsmPoint[]).map((point) => ({
  id: point.id,
  name: c(point.name || serviceFallbackName(point.type, "zh"), point.nameEn || point.name || serviceFallbackName(point.type, "en")),
  types: [point.type],
  legIds: [],
  anchorId: point.nearestAnchorId,
  latitude: point.latitude,
  longitude: point.longitude,
  powerKw: point.powerKw,
  sourceUrl: point.osmUrl,
  sourceKind: "openstreetmap",
}));

export const serviceSnapshot = {
  updatedAt: osmData.updatedAt as string | null,
  count: osmServicePoints.length,
  attributionUrl: osmData.attributionUrl,
};

function serviceFallbackName(type: OsmPoint["type"], locale: Locale): string {
  const values: Record<OsmPoint["type"], Copy> = {
    fuel: c("加油站", "Fuel station"),
    charging: c("充电站", "Charging station"),
    toilet: c("公共厕所", "Public toilet"),
    hospital: c("医院", "Hospital"),
    clinic: c("医疗点", "Clinic"),
  };
  return values[type][locale];
}

export function servicesForLegs(legIds: string[], limit = 3): ServicePoint[] {
  const ids = new Set(legIds);
  return officialServicePoints.filter((point) => point.legIds.some((id) => ids.has(id))).slice(0, limit);
}

export function servicesNearAnchors(anchorIds: string[], types?: ServiceType[], limit = 6): ServicePoint[] {
  const anchors = new Set(anchorIds);
  return osmServicePoints.filter((point) => point.anchorId && anchors.has(point.anchorId) && (!types || point.types.some((type) => types.includes(type)))).slice(0, limit);
}

export function amapSearchUrl(anchorId: string, keyword: string): string {
  const coordinate = anchorCoordinates[anchorId];
  const name = routeAnchors[anchorId].name.zh;
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(`${name} ${keyword}`)}&center=${coordinate.longitude},${coordinate.latitude}&view=map&callnative=1`;
}
