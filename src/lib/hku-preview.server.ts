import fs from "fs";
import path from "path";
import type { Program, ProgramIndexItem } from "@/types";

type Overlay = Pick<Program, "major_cn" | "major_en" | "degree" | "college" | "duration" | "intake" | "study_mode" | "official_url" | "fee" | "deadline" | "ielts" | "toefl" | "language_requirement" | "req_detail" | "admissions_preview">;
const cached = new Map<string, { revision: string; programs: Record<string, Overlay> }>();
const previewFiles: Record<string, string> = {
  UNIMELB: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  UNSW: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  USYD: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  ANU: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  MONASH: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  UQ: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  UWA: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  ADELAIDE: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  UTS: "../reports/au-chinese-copy-20261025/preview-zh-v2.json",
  IC: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  OXFORD: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  CAMBRIDGE: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  UCL: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  KCL: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  EDINBURGH: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  MANCHESTER: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  BRISTOL: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  LSE: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  WARWICK: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  BIRMINGHAM: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  GLASGOW: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  LEEDS: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  SOUTHAMPTON: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  SHEFFIELD: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  DURHAM: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  NOTTINGHAM: "../reports/uk-qs100-masters-preview-20261025/preview-v2.json",
  NUS: "../reports/sg-public-masters-preview-20261023/preview-v3.json",
  NTU: "../reports/sg-public-masters-preview-20261023/preview-v3.json",
  SMU: "../reports/sg-public-masters-preview-20261023/preview-v3.json",
  HKU: "../reports/hku-masters-preview-20261023/preview-v2.json",
  CUHK: "../reports/cuhk-hkust-masters-preview-20261023/preview-v3.json",
  HKUST: "../reports/cuhk-hkust-masters-preview-20261023/preview-v3.json",
  CityU: "../reports/cityu-polyu-masters-preview-20261023/preview-v2.json",
  PolyU: "../reports/cityu-polyu-masters-preview-20261023/preview-v2.json",
  CHC: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  CMU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  EdUHK: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  HKBU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  HKMU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  HKSYU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  HSUHK: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  LingnanU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  MPU: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  MUST: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  TWC: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  UM: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
  UTM: "../reports/hk-mo-remaining-masters-preview-20261023/preview-v3.json",
};

// This local presentation overlay is deliberately absent from production builds.
// It never changes IDs, school membership, undergraduate records, or database files.
export function applyHKUPreview<T extends Program | ProgramIndexItem>(programs: T[]): T[] {
  if (process.env.NODE_ENV !== "development") return programs;
  const active = new Map<string, Record<string, Overlay>>();
  for (const schoolCode of new Set(programs.filter(p => p.education_level === "postgraduate").map(p => p.school_code))) {
    const relative = previewFiles[schoolCode];
    if (!relative) continue;
    const file = path.resolve(process.cwd(), relative);
    if (!fs.existsSync(file)) continue;
    const stat = fs.statSync(file);
    const revision = `${stat.mtimeMs}:${stat.size}`;
    let snapshot = cached.get(file);
    if (snapshot?.revision !== revision) {
      const input = JSON.parse(fs.readFileSync(file, "utf8"));
      if (input.schema !== 1 || input.local_preview_only !== true || !input.programs) throw new Error("Invalid local admissions preview");
      snapshot = { revision, programs: input.programs };
      cached.set(file, snapshot);
    }
    active.set(schoolCode, snapshot.programs);
  }
  if (!active.size) return programs;
  return programs.map(program => {
    const overlay = active.get(program.school_code)?.[program.id];
    if (program.education_level !== "postgraduate" || !program.id.startsWith(`${program.school_code.toLowerCase()}-postgraduate-`) || !overlay?.admissions_preview) return program;
    // Explicit allowlist: delivery metadata cannot override identity or history.
    return { ...program,
      major_cn: overlay.major_cn, major_en: overlay.major_en, degree: overlay.degree,
      college: overlay.college, duration: overlay.duration, intake: overlay.intake,
      study_mode: overlay.study_mode, official_url: overlay.official_url,
      fee: overlay.fee, deadline: overlay.deadline, ielts: overlay.ielts, toefl: overlay.toefl,
      language_requirement: overlay.language_requirement, req_detail: overlay.req_detail,
      admissions_preview: overlay.admissions_preview,
    };
  });
}
