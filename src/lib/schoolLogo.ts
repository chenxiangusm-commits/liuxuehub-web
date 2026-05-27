/**
 * School Mark System (Alternative Path)
 *
 * This module provides school identification icons from an alternative path.
 * These are NOT official university logos - they are placeholder identification icons.
 *
 * Schools with official logos in /school-logos/official/ are served with priority.
 *
 * See /public/school-logos/logo_sources.json for official logo source records.
 * See /public/school-logos/official/logo_sources.json for official logo metadata.
 */

// Official logo map: schools that have real logos downloaded
const OFFICIAL_LOGOS: Record<string, string> = {
  HKU: "/school-logos/official/hku.jpg",
  CUHK: "/school-logos/official/cuhk.svg",
  HKUST: "/school-logos/official/hkust.svg",
  POLYU: "/school-logos/official/polyu.png",
  CITYU: "/school-logos/official/cityu.svg",
  HKBU: "/school-logos/official/hkbu.svg",
  LINGNANU: "/school-logos/official/lingnan.png",
  LINGNAN: "/school-logos/official/lingnan.png",
  CHC: "/school-logos/official/chc.png",
  EDUHK: "/school-logos/official/eduhk.png",
  HKMU: "/school-logos/official/hkmu.png",
  HKSYU: "/school-logos/official/hksyu.svg",
  HSUHK: "/school-logos/official/hsuhk.png",
  TWC: "/school-logos/official/twc.svg",
  NUS: "/school-logos/official/nus.svg",
  NTU: "/school-logos/official/ntu.svg",
  SMU: "/school-logos/official/smu.svg",
  UM: "/school-logos/official/um.png",
  MUST: "/school-logos/official/must.png",
  MPU: "/school-logos/official/mpu.png",
  UTM: "/school-logos/official/utm.png",
  CMU: "/school-logos/official/cmu.png",
  "CityU-MO": "/school-logos/official/cmu.png",
  "CITYU-MO": "/school-logos/official/cmu.png",
};

const SCHOOL_MARKS: Record<string, string> = {
  HKU: "/logos/schools/hku.svg",
  CUHK: "/logos/schools/cuhk.svg",
  HKUST: "/logos/schools/hkust.svg",
  PolyU: "/logos/schools/polyu.svg",
  CityU: "/logos/schools/cityu.svg",
  HKBU: "/logos/schools/hkbu.svg",
  LingnanU: "/logos/schools/lingnan.svg",
  CHC: "/logos/schools/chc.svg",
  EdUHK: "/logos/schools/eduhk.svg",
  HKMU: "/logos/schools/hkmu.svg",
  HKSYU: "/logos/schools/hksyu.svg",
  HSUHK: "/logos/schools/hsuhk.svg",
  TWC: "/logos/schools/twc.svg",
  UM: "/logos/schools/um.svg",
  MUST: "/logos/schools/must.svg",
  CMU: "/logos/schools/cityu-mo.svg",
  MPU: "/logos/schools/mpu.svg",
  UTM: "/logos/schools/utm.svg",
  NUS: "/logos/schools/nus.svg",
  NTU: "/logos/schools/ntu.svg",
  SMU: "/logos/schools/smu.svg",
  IC: "/logos/schools/ic.svg",
  OXFORD: "/logos/schools/oxford.svg",
  CAMBRIDGE: "/logos/schools/cambridge.svg",
  UCL: "/logos/schools/ucl.svg",
  KCL: "/logos/schools/kcl.svg",
  EDINBURGH: "/logos/schools/edinburgh.svg",
  MANCHESTER: "/logos/schools/manchester.svg",
  BRISTOL: "/logos/schools/bristol.svg",
  LSE: "/logos/schools/lse.svg",
  WARWICK: "/logos/schools/warwick.svg",
  BIRMINGHAM: "/logos/schools/birmingham.svg",
  GLASGOW: "/logos/schools/glasgow.svg",
  LEEDS: "/logos/schools/leeds.svg",
  SOUTHAMPTON: "/logos/schools/southampton.svg",
  SHEFFIELD: "/logos/schools/sheffield.svg",
  DURHAM: "/logos/schools/durham.svg",
  NOTTINGHAM: "/logos/schools/nottingham.svg",
  UNIMELB: "/logos/schools/unimelb.svg",
  UNSW: "/logos/schools/unsw.svg",
  USYD: "/logos/schools/usyd.svg",
  ANU: "/logos/schools/anu.svg",
  MONASH: "/logos/schools/monash.svg",
  UQ: "/logos/schools/uq.svg",
  UWA: "/logos/schools/uwa.svg",
  ADELAIDE: "/logos/schools/adelaide.svg",
  UTS: "/logos/schools/uts.svg",
  RMIT: "/logos/schools/rmit.svg",
  MACQUARIE: "/logos/schools/macquarie.svg",
  // 新西兰学校
  AUCKLAND: "/logos/schools/auckland.svg",
  OTAGO: "/logos/schools/otago.svg",
  MASSEY: "/logos/schools/massey.svg",
  VUW: "/logos/schools/vuw.svg",
  CANTERBURY: "/logos/schools/canterbury.svg",
  WAIKATO: "/logos/schools/waikato.svg",
  LINCOLN: "/logos/schools/lincoln.svg",
  AUT: "/logos/schools/aut.svg",
};

export function getSchoolMarkPath(code?: string | null): string | null {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  return OFFICIAL_LOGOS[normalizedCode] || SCHOOL_MARKS[normalizedCode] || null;
}

export function getSupportedSchoolMarkCount(): number {
  return Object.keys(SCHOOL_MARKS).length;
}

// Legacy function names for backward compatibility
// @deprecated Use getSchoolMarkPath instead
export function getSchoolLogo(code?: string | null): string | null {
  return getSchoolMarkPath(code);
}

// @deprecated Use getSupportedSchoolMarkCount instead
export function getSupportedSchoolLogoCount(): number {
  return getSupportedSchoolMarkCount();
}
