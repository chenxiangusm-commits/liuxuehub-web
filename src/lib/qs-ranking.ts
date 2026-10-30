import type { QSRanking } from "@/types";

type Ranked = { qs_ranking_2026?: number; qs_ranking_latest?: QSRanking };

// Never relabel a historical value as a newer edition. Bands retain their display label.
export function getQSRank(item: Ranked): number {
  if (item.qs_ranking_latest) return item.qs_ranking_latest.rank || 0;
  const old = Number.parseInt(String(item.qs_ranking_2026 || "").replace(/^=/, ""), 10);
  return Number.isFinite(old) && old > 0 ? old : 0;
}
export function getQSYear(item: Ranked): number { return item.qs_ranking_latest?.year || 2026; }
export function getQSLabel(item: Ranked): string {
  return item.qs_ranking_latest?.label || (getQSRank(item) ? String(item.qs_ranking_2026) : "暂无已确认排名");
}
export function getQSSource(item: Ranked): string {
  return item.qs_ranking_latest?.source || "https://www.topuniversities.com/world-university-rankings/2026";
}
