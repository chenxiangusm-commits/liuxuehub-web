import type { School } from "@/types";

const REGION_CN: Record<string, string> = {
  Australia: "澳大利亚",
  "Hong Kong SAR": "中国香港",
  "Macao SAR": "中国澳门",
  Singapore: "新加坡",
  "United Kingdom": "英国",
  "New Zealand": "新西兰",
  Ireland: "爱尔兰",
  Canada: "加拿大",
  "United States": "美国",
};

function hasChineseText(value?: string | null): boolean {
  return /[\u4e00-\u9fff]/.test(value || "");
}

export function getSchoolNameCn(school: Pick<School, "school_code" | "school_name" | "school_name_cn">): string {
  if (school.school_name_cn && hasChineseText(school.school_name_cn)) return school.school_name_cn;
  if (school.school_name && hasChineseText(school.school_name)) return school.school_name;
  return school.school_name || school.school_code || "待确认";
}

export function getSchoolNameEn(school: Pick<School, "school_name" | "school_name_en">): string {
  return school.school_name_en || school.school_name || "待确认";
}

export function getRegionDisplayCn(school: Pick<School, "region_cn" | "region_en">): string {
  if (hasChineseText(school.region_cn)) return school.region_cn;
  return REGION_CN[school.region_en] || school.region_cn || "待确认";
}
