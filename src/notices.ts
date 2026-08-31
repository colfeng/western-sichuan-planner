import type { Attraction } from "./data.ts";

export type PendingAttractionUpdate = {
  sourceId: string;
  candidateType: string;
  titleZh: string;
  url: string;
  discoveredAt?: string;
  lastSeenAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  reviewStatus?: string;
  suggestedStatus?: "closed" | "reopened" | "reservation" | "notice";
  suggestedAttractionIds?: string[];
};

const updateTimestamp = (item: PendingAttractionUpdate) => Date.parse(item.publishedAt ?? item.lastSeenAt ?? item.discoveredAt ?? "1970-01-01") || 0;
const updatePriority = (item: PendingAttractionUpdate) => ({ closed: 4, reopened: 3, reservation: 2, notice: 1 }[item.suggestedStatus ?? "notice"]);
const MAX_PUBLIC_NOTICE_AGE_MS = 180 * 86400000;

export function selectAttractionUpdate(
  updates: PendingAttractionUpdate[],
  attraction: Attraction | undefined,
  now = Date.now(),
): PendingAttractionUpdate | undefined {
  if (!attraction?.updateSourceId) return undefined;
  return updates
    .filter((item) => item.candidateType === "attraction"
      && item.sourceId === attraction.updateSourceId
      && item.suggestedAttractionIds?.includes(attraction.id)
      && !["rejected", "expired"].includes(item.reviewStatus ?? "pending")
      && (!item.expiresAt || Date.parse(item.expiresAt) >= now)
      && updateTimestamp(item) > 0
      && now - updateTimestamp(item) <= MAX_PUBLIC_NOTICE_AGE_MS
      && updateTimestamp(item) - now <= 31 * 86400000)
    .sort((left, right) => updateTimestamp(right) - updateTimestamp(left) || updatePriority(right) - updatePriority(left))[0];
}
