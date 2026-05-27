import type { Program, School } from "@/types";

export const QS_RANKING_OPTIONS = [
  { label: "1-10", min: 1, max: 10 },
  { label: "11-50", min: 11, max: 50 },
  { label: "1-50", min: 1, max: 50 },
  { label: "51-100", min: 51, max: 100 },
  { label: "101-150", min: 101, max: 150 },
  { label: "151-200", min: 151, max: 200 },
  { label: "101-200", min: 101, max: 200 },
  { label: "201+", min: 201, max: Number.POSITIVE_INFINITY },
] as const;

export interface ProgramFilters {
  region?: string;
  educationLevel?: string;
  schoolName?: string;
  qsRanking?: string;
  feeKeyword?: string;
  ieltsKeyword?: string;
  majorKeyword?: string;
}

export interface SchoolFilters {
  keyword?: string;
  region?: string;
  qsRanking?: string;
  educationLevel?: "all" | "undergraduate" | "postgraduate";
}

export function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function matchesQsRanking(ranking: number | undefined, selected?: string): boolean {
  if (!selected) return true;
  const option = QS_RANKING_OPTIONS.find(item => item.label === selected);
  if (!option) return true;
  const value = ranking || 0;
  return value >= option.min && value <= option.max;
}

function matchesRegion(actualRegion: string | undefined, selectedRegion?: string): boolean {
  if (!selectedRegion || selectedRegion === "all") return true;
  if (!actualRegion) return false;

  const regionGroups: Record<string, string[]> = {
    "中国香港/澳门": ["中国香港", "中国澳门", "香港", "澳门"],
  };

  const acceptedRegions = regionGroups[selectedRegion] || selectedRegion.split("/").map(region => region.trim());
  return acceptedRegions.includes(actualRegion);
}

export function filterPrograms(programs: Program[], filters: ProgramFilters): Program[] {
  const majorKeyword = filters.majorKeyword?.trim().toLowerCase();
  const feeKeyword = filters.feeKeyword?.trim().toLowerCase();
  const ieltsKeyword = filters.ieltsKeyword?.trim().toLowerCase();

  return programs.filter(program => {
    if (!matchesRegion(program.region_cn, filters.region)) return false;
    if (filters.educationLevel && program.education_level !== filters.educationLevel) return false;
    if (filters.schoolName && program.school_name !== filters.schoolName) return false;
    if (!matchesQsRanking(program.qs_ranking_2026, filters.qsRanking)) return false;
    if (feeKeyword && !program.fee?.toLowerCase().includes(feeKeyword)) return false;
    if (ieltsKeyword && !program.ielts?.toLowerCase().includes(ieltsKeyword)) return false;

    if (majorKeyword) {
      const matchCn = program.major_cn?.toLowerCase().includes(majorKeyword);
      const matchEn = program.major_en?.toLowerCase().includes(majorKeyword);
      if (!matchCn && !matchEn) return false;
    }

    return true;
  });
}

export function sortSchoolsByRanking(schools: School[]): School[] {
  return [...schools].sort((a, b) => {
    const rankA = a.qs_ranking_2026;
    const rankB = b.qs_ranking_2026;
    const hasRankA = typeof rankA === "number" && rankA > 0;
    const hasRankB = typeof rankB === "number" && rankB > 0;

    if (hasRankA && hasRankB) return rankA - rankB;
    if (hasRankA) return -1;
    if (hasRankB) return 1;

    return (a.school_name_en || a.school_name || a.school_code || "")
      .localeCompare(b.school_name_en || b.school_name || b.school_code || "");
  });
}

export function filterSchools(schools: School[], filters: SchoolFilters): School[] {
  const keyword = filters.keyword?.trim().toLowerCase();

  return schools.filter(school => {
    if (keyword) {
      const match = school.school_name?.toLowerCase().includes(keyword)
        || school.school_name_en?.toLowerCase().includes(keyword)
        || school.school_code?.toLowerCase().includes(keyword);
      if (!match) return false;
    }

    if (!matchesRegion(school.region_cn, filters.region)) return false;
    if (!matchesQsRanking(school.qs_ranking_2026, filters.qsRanking)) return false;

    if (filters.educationLevel && filters.educationLevel !== "all") {
      const hasLevel = school.program_counts
        ? school.program_counts[filters.educationLevel] > 0
        : school.education_levels?.includes(filters.educationLevel);
      if (!hasLevel) return false;
    }

    return true;
  });
}
