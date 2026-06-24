import { getSchoolLogo } from "./schoolLogos";

export interface SchoolMeta {
  school_code: string;
  display_name_cn: string;
  display_name_en: string;
  short_name: string;
  region_cn: string;
}

export function getSchoolMeta(schoolCode: string | undefined): SchoolMeta | null {
  void schoolCode;
  return null;
}

export function getDisplayCn(schoolCode: string | undefined, fallback = ""): string {
  return fallback || schoolCode || "Unknown";
}

export function getDisplayEn(schoolCode: string | undefined, fallback = ""): string {
  return fallback || schoolCode || "Unknown";
}

export function getRegionCn(schoolCode: string | undefined, fallback = ""): string {
  void schoolCode;
  return fallback || "Unknown";
}

export function getLogoPath(schoolCode: string | undefined): string {
  return getSchoolLogo(schoolCode);
}

export function getMacauOfficialLogo(schoolCode: string | undefined): string {
  return getSchoolLogo(schoolCode);
}
