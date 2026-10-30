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

// Only aggregate cases are exposed; existing course facts stay in their own snapshot.
function snapshot(): Snapshot | undefined {
  const release=readRelease();if(release)return release.profiles.uk;
  if (process.env.NODE_ENV !== "development") return undefined;
  const file = path.resolve(process.cwd(), "../reports/uk-applicant-profiles-20261027/profiles-v1.json");
  if (!fs.existsSync(file)) return undefined;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cached?.revision !== revision) {
    const value = JSON.parse(fs.readFileSync(file, "utf8")) as Snapshot;
    if (value.schema !== 1 || !value.local_preview_only || !value.schools || !value.programs) throw new Error("Invalid UK applicant reference");
    cached = { revision, value };
  }
  return cached.value;
}

export const getUkSchoolProfile = (code: string) => snapshot()?.schools[code];
export const getUkProgramProfile = (id: string) => snapshot()?.programs[id];
