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

// Aggregate reference only; admissions facts remain in the existing course snapshot.
function snapshot(): Snapshot | undefined {
  const release=readRelease();if(release)return release.profiles.sg;
  if (process.env.NODE_ENV !== "development") return undefined;
  const file = path.resolve(process.cwd(), "../reports/sg-applicant-profiles-20261026/profiles-v1.json");
  if (!fs.existsSync(file)) return undefined;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cached?.revision !== revision) {
    const value = JSON.parse(fs.readFileSync(file, "utf8")) as Snapshot;
    if (value.schema !== 1 || !value.local_preview_only || !value.schools || !value.programs) throw new Error("Invalid Singapore applicant reference");
    cached = { revision, value };
  }
  return cached.value;
}

export const getSgSchoolProfile = (code: string) => snapshot()?.schools[code];
export const getSgProgramProfile = (id: string) => snapshot()?.programs[id];
