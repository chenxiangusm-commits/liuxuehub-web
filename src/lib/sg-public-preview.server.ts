import fs from "fs";
import path from "path";
import type { Program, ProgramIndexItem, School } from "@/types";

type Snapshot = { newSchools: School[]; newPrograms: Program[] };
let cache: { revision: string; snapshot: Snapshot } | undefined;
const codes = new Set(["SUTD", "SIT", "SUSS"]);

// Read-only development expansion. Formal files and production results stay untouched.
function readExpansion(): Snapshot {
  const empty = { newSchools: [], newPrograms: [] };
  if (process.env.NODE_ENV !== "development") return empty;
  const file = path.resolve(process.cwd(), "../reports/sg-public-masters-preview-20261023/preview-v3.json");
  if (!fs.existsSync(file)) return empty;
  const stat = fs.statSync(file);
  const revision = `${stat.mtimeMs}:${stat.size}`;
  if (cache?.revision === revision) return cache.snapshot;
  const input = JSON.parse(fs.readFileSync(file, "utf8"));
  if (input.schema !== 1 || input.local_preview_only !== true || !Array.isArray(input.newSchools) || !Array.isArray(input.newPrograms)) {
    throw new Error("Invalid Singapore preview expansion");
  }
  const snapshot: Snapshot = input;
  if (snapshot.newSchools.some(s => !codes.has(s.school_code)) ||
      snapshot.newPrograms.some(p => !codes.has(p.school_code) || p.education_level !== "postgraduate" ||
        !p.id.startsWith(`${p.school_code.toLowerCase()}-postgraduate-`) || !p.admissions_preview) ||
      new Set(snapshot.newPrograms.map(p => p.id)).size !== snapshot.newPrograms.length) {
    throw new Error("Invalid Singapore preview identity");
  }
  cache = { revision, snapshot };
  return snapshot;
}

export function hasSGPreviewExpansion(): boolean {
  return readExpansion().newPrograms.length > 0;
}

export function appendSGPreviewSchools(schools: School[]): School[] {
  const existing = new Set(schools.map(s => s.school_code));
  const added = readExpansion().newSchools.filter(s => !existing.has(s.school_code));
  return added.length ? [...schools, ...added] : schools;
}

export function appendSGPreviewPrograms<T extends Program | ProgramIndexItem>(programs: T[], schoolCode?: string): (T | Program)[] {
  const existing = new Set(programs.map(p => p.id));
  const added = readExpansion().newPrograms.filter(p => (!schoolCode || p.school_code === schoolCode) && !existing.has(p.id));
  return added.length ? [...programs, ...added] : programs;
}
