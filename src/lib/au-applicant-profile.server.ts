import { readRelease } from "./release.server";
import fs from "fs";
import path from "path";
import type { AuApplicantProfile } from "./au-applicant-profile";

interface Snapshot {
  schema: number;
  local_preview_only: boolean;
  schools: Record<string, AuApplicantProfile>;
  programs: Record<string, AuApplicantProfile>;
}
let cached: { revision: string; value: Snapshot } | undefined;

function snapshot(): Snapshot | undefined {
  const release=readRelease();if(release)return release.profiles.au;
  if (process.env.NODE_ENV !== "development") return undefined;
  const file = path.resolve(process.cwd(), "../reports/au-applicant-profiles-20261026/profiles-v1.json");
  if (!fs.existsSync(file)) return undefined;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cached?.revision !== revision) {
    const value = JSON.parse(fs.readFileSync(file, "utf8")) as Snapshot;
    if (value.schema !== 1 || value.local_preview_only !== true || !value.programs || !value.schools) throw new Error("Invalid Australia applicant profile snapshot");
    cached = { revision, value };
  }
  return cached.value;
}

export function getAuSchoolProfile(code: string): AuApplicantProfile | undefined {
  return snapshot()?.schools[code];
}

export function getAuProgramProfile(id: string): AuApplicantProfile | undefined {
  return snapshot()?.programs[id];
}
