import fs from "fs";
import path from "path";
import { Database, Program, ProgramIndexItem, School } from "@/types";

type ProgramLookup = Record<string, { school_code: string; education_level: string; source_file?: string }>;
type ProgramFilterIndexes = Record<string, Record<string, string[]>>;

let cachedDatabase: Database | null = null;
let cachedSchools: School[] | null = null;
let cachedProgramIndex: ProgramIndexItem[] | null = null;
let cachedProgramLookup: ProgramLookup | null = null;
let cachedProgramFilterIndexes: ProgramFilterIndexes | null = null;
const cachedSchoolPrograms = new Map<string, Program[]>();

function existingPath(candidates: string[]): string | null {
  return candidates.find(candidate => fs.existsSync(candidate)) || null;
}

function resolveSplitDatabaseDir(): string | null {
  return existingPath([
    process.env.LIUXUEHUB_DATA_DIR || "",
    path.join(process.cwd(), "src", "data", "database"),
    path.join(process.cwd(), "database", "app"),
    path.join(process.cwd(), "..", "database", "app"),
  ].filter(Boolean));
}

function resolveLegacyDatabasePath(): string {
  const candidates = [
    process.env.LIUXUEHUB_DATABASE_PATH,
    path.join(process.cwd(), "src", "data", "master_database.json"),
    path.join(process.cwd(), "database", "master_database.json"),
    path.join(process.cwd(), "..", "database", "master_database.json"),
  ].filter(Boolean) as string[];

  const databasePath = existingPath(candidates);

  if (!databasePath) {
    throw new Error(`Database file not found. Checked: ${candidates.join(", ")}`);
  }

  return databasePath;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getDatabase(): Promise<Database> {
  if (cachedDatabase) return cachedDatabase;

  const filePath = resolveLegacyDatabasePath();
  cachedDatabase = readJson<Database>(filePath);
  return cachedDatabase;
}

export async function getAllSchools(): Promise<School[]> {
  if (cachedSchools) return cachedSchools;

  const splitDir = resolveSplitDatabaseDir();
  if (splitDir) {
    cachedSchools = uniqueBy(readJson<School[]>(path.join(splitDir, "schools.json")), school => school.school_code);
    return cachedSchools;
  }

  const db = await getDatabase();
  cachedSchools = uniqueBy(db.schools, school => school.school_code);
  return cachedSchools;
}

export async function getSchoolByCode(schoolCode: string): Promise<School | undefined> {
  const schools = await getAllSchools();
  return schools.find(s => s.school_code === schoolCode);
}

export async function getProgramIndex(): Promise<ProgramIndexItem[]> {
  if (cachedProgramIndex) return cachedProgramIndex;

  const splitDir = resolveSplitDatabaseDir();
  if (splitDir) {
    cachedProgramIndex = uniqueBy(
      readJson<ProgramIndexItem[]>(path.join(splitDir, "programs_index.json")),
      program => program.id,
    );
    return cachedProgramIndex;
  }

  const db = await getDatabase();
  cachedProgramIndex = uniqueBy(db.programs, program => program.id);
  return cachedProgramIndex;
}

async function getProgramLookup(): Promise<ProgramLookup> {
  if (cachedProgramLookup) return cachedProgramLookup;

  const splitDir = resolveSplitDatabaseDir();
  if (splitDir) {
    cachedProgramLookup = readJson<ProgramLookup>(path.join(splitDir, "program_lookup.json"));
    return cachedProgramLookup;
  }

  const programs = await getAllPrograms();
  cachedProgramLookup = Object.fromEntries(programs.map(program => [
    program.id,
    { school_code: program.school_code, education_level: program.education_level },
  ]));
  return cachedProgramLookup;
}

async function getProgramFilterIndexes(): Promise<ProgramFilterIndexes | null> {
  if (cachedProgramFilterIndexes) return cachedProgramFilterIndexes;

  const splitDir = resolveSplitDatabaseDir();
  if (!splitDir) return null;

  const indexPath = path.join(splitDir, "program_filter_indexes.json");
  if (!fs.existsSync(indexPath)) return null;

  cachedProgramFilterIndexes = readJson<ProgramFilterIndexes>(indexPath);
  return cachedProgramFilterIndexes;
}

export async function getAllPrograms(): Promise<Program[]> {
  const splitDir = resolveSplitDatabaseDir();
  if (splitDir) {
    const bySchoolDir = path.join(splitDir, "programs_by_school");
    const files = fs.readdirSync(bySchoolDir).filter(file => file.endsWith(".json"));
    const all = files.flatMap(file => readJson<Program[]>(path.join(bySchoolDir, file)));
    return uniqueBy(all, program => program.id);
  }

  const db = await getDatabase();
  return uniqueBy(db.programs, program => program.id);
}

export async function getProgramsBySchoolCode(schoolCode: string): Promise<Program[]> {
  if (cachedSchoolPrograms.has(schoolCode)) {
    return cachedSchoolPrograms.get(schoolCode) || [];
  }

  const splitDir = resolveSplitDatabaseDir();
  if (splitDir) {
    const filePath = path.join(splitDir, "programs_by_school", `${schoolCode}.json`);
    const programs = fs.existsSync(filePath) ? readJson<Program[]>(filePath) : [];
    cachedSchoolPrograms.set(schoolCode, programs);
    return programs;
  }

  const db = await getDatabase();
  const programs = db.programs.filter(p => p.school_code === schoolCode);
  cachedSchoolPrograms.set(schoolCode, programs);
  return programs;
}

export async function getProgramById(id: string): Promise<Program | undefined> {
  const lookup = await getProgramLookup();
  const match = lookup[id];
  if (match) {
    const programs = await getProgramsBySchoolCode(match.school_code);
    return programs.find(program => program.id === id);
  }

  const programs = await getAllPrograms();
  return programs.find(p => p.id === id);
}

export async function searchProgramIndex(options: {
  keyword?: string;
  region?: string;
  educationLevel?: string;
  schoolCode?: string;
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ results: ProgramIndexItem[]; total: number; offset: number; pageSize: number }> {
  const keyword = options.keyword?.trim().toLowerCase();
  const region = options.region?.trim();
  const educationLevel = options.educationLevel?.trim();
  const schoolCode = options.schoolCode?.trim();
  const pageSize = Math.min(Math.max(options.pageSize || options.limit || 20, 1), 100);
  const pageOffset = options.page ? (Math.max(options.page, 1) - 1) * pageSize : 0;
  const offset = Math.max(options.offset ?? pageOffset, 0);
  const programIndex = await getProgramIndex();
  const filterIndexes = await getProgramFilterIndexes();
  const byId = new Map(programIndex.map(program => [program.id, program]));

  const candidateLists: string[][] = [];

  if (filterIndexes) {
    if (region && educationLevel) {
      candidateLists.push(filterIndexes.region_cn__education_level?.[`${region}||${educationLevel}`] || []);
    } else if (region) {
      candidateLists.push(filterIndexes.region_cn?.[region] || []);
    } else if (educationLevel) {
      candidateLists.push(filterIndexes.education_level?.[educationLevel] || []);
    }

    if (schoolCode && educationLevel) {
      candidateLists.push(filterIndexes.school_code__education_level?.[`${schoolCode}||${educationLevel}`] || []);
    } else if (schoolCode) {
      candidateLists.push(filterIndexes.school_code?.[schoolCode] || []);
    }
  }

  let results: ProgramIndexItem[];
  if (candidateLists.length > 0) {
    const [first, ...rest] = candidateLists.sort((a, b) => a.length - b.length);
    let candidateIds = new Set(first);
    for (const list of rest) {
      const current = new Set(list);
      candidateIds = new Set([...candidateIds].filter(id => current.has(id)));
    }
    results = [...candidateIds].map(id => byId.get(id)).filter(Boolean) as ProgramIndexItem[];
  } else {
    results = programIndex;
  }

  if (keyword) {
    results = results.filter(program => (
      program.major_cn?.toLowerCase().includes(keyword) ||
      program.major_en?.toLowerCase().includes(keyword) ||
      program.school_name?.toLowerCase().includes(keyword) ||
      program.school_name_en?.toLowerCase().includes(keyword) ||
      program.degree?.toLowerCase().includes(keyword)
    ));
  }

  if (region) {
    results = results.filter(program => program.region_cn === region);
  }

  if (educationLevel) {
    results = results.filter(program => program.education_level === educationLevel);
  }

  if (schoolCode) {
    results = results.filter(program => program.school_code === schoolCode);
  }

  const total = results.length;
  return {
    results: results.slice(offset, offset + pageSize),
    total,
    offset,
    pageSize,
  };
}
