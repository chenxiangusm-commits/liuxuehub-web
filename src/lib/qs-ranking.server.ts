import fs from "fs";
import path from "path";
import type { QSRanking } from "@/types";

let cache: { revision: string; schools: Record<string, QSRanking> } | undefined;

// Same local preview boundary as admissions overlays; formal historical files stay intact.
export function applyQSRankings<T extends { school_code: string }>(items: T[]): T[] {
  if (process.env.NODE_ENV !== "development") return items;
  const file = path.resolve(process.cwd(), "../reports/qs2027-update-20261025/rankings.json");
  if (!fs.existsSync(file)) return items;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cache?.revision !== revision) {
    const input = JSON.parse(fs.readFileSync(file, "utf8"));
    if (input.schema !== 1 || input.local_preview_only !== true || input.year !== 2027 || !input.schools) throw new Error("Invalid QS ranking snapshot");
    for (const r of Object.values(input.schools) as QSRanking[]) {
      if (r.year !== 2027 || !/^https:\/\//.test(r.source) ||
          (r.status === "ranked" && (!r.rank || !/^=?\d+(?:-\d+)?$/.test(r.label)))) throw new Error("Invalid QS rank entry");
    }
    cache = { revision, schools: input.schools };
  }
  const schools = cache.schools;
  return items.map(item => schools[item.school_code] ? { ...item, qs_ranking_latest: schools[item.school_code] } : item);
}
