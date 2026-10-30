import { readRelease } from "./release.server";
import fs from "fs";
import path from "path";
import type { HkApplicantProfile } from "./hk-applicant-profile";

interface Snapshot {
  schema: number;
  local_preview_only: boolean;
  schools: Record<string, HkApplicantProfile>;
  programs: Record<string, HkApplicantProfile>;
}
let cached: { revision: string; value: Snapshot } | undefined;

function snapshot(): Snapshot | undefined {
  const release=readRelease();if(release)return release.profiles.hk;
  if (process.env.NODE_ENV !== "development") return undefined;
  const file = path.resolve(process.cwd(), "../reports/hk-applicant-profiles-20261026/profiles-v2.json");
  if (!fs.existsSync(file)) return undefined;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cached?.revision !== revision) {
    const value = JSON.parse(fs.readFileSync(file, "utf8")) as Snapshot;
    if (value.schema !== 1 || !value.local_preview_only || !value.schools || !value.programs) throw new Error("Invalid Hong Kong applicant reference");
    cached = { revision, value };
  }
  return cached.value;
}

export const getHkSchoolProfile = (code: string) => snapshot()?.schools[code];
export const getHkProgramProfile = (id: string) => snapshot()?.programs[id];
