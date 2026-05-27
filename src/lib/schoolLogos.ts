/**
 * School Mark System
 *
 * This module provides school identification icons (school marks) for display purposes.
 * These are NOT official university logos - they are placeholder identification icons
 * used to visually identify schools within the application.
 *
 * Schools with official logos available in /school-logos/official/ are mapped
 * with priority fallback: official logo first, then placeholder mark.
 *
 * The actual official logo source information is recorded in:
 * /public/school-logos/logo_sources.json
 * /public/school-logos/official/logo_sources.json
 */

// Official logo map: schools that have real logos downloaded
const officialLogoMap: Record<string, string> = {
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

// Map of school codes to school mark asset paths (placeholder icons)
const schoolMarkMap: Record<string, string> = {
  IC: "/logos/schools/ic.svg",
  OXFORD: "/logos/schools/oxford.svg",
  CAMBRIDGE: "/logos/schools/cambridge.svg",
  UCL: "/logos/schools/ucl.svg",
  LSE: "/logos/schools/lse.svg",
  NUS: "/logos/schools/nus.svg",
  NTU: "/logos/schools/ntu.svg",
  HKU: "/logos/schools/hku.svg",
  CUHK: "/logos/schools/cuhk.svg",
  HKUST: "/logos/schools/hkust.svg",
  POLYU: "/logos/schools/polyu.svg",
  CITYU: "/logos/schools/cityu.svg",
  UNIMELB: "/logos/schools/unimelb.svg",
  UNSW: "/logos/schools/unsw.svg",
  USYD: "/logos/schools/usyd.svg",
  MONASH: "/logos/schools/monash.svg",
  EDINBURGH: "/logos/schools/edinburgh.svg",
  MANCHESTER: "/logos/schools/manchester.svg",
  BRISTOL: "/logos/schools/bristol.svg",
  KCL: "/logos/schools/kcl.svg",
  WARWICK: "/logos/schools/warwick.svg",
  BIRMINGHAM: "/logos/schools/birmingham.svg",
  GLASGOW: "/logos/schools/glasgow.svg",
  LEEDS: "/logos/schools/leeds.svg",
  SOUTHAMPTON: "/logos/schools/southampton.svg",
  SHEFFIELD: "/logos/schools/sheffield.svg",
  DURHAM: "/logos/schools/durham.svg",
  NOTTINGHAM: "/logos/schools/nottingham.svg",
  ANU: "/logos/schools/anu.svg",
  UQ: "/logos/schools/uq.svg",
  UWA: "/logos/schools/uwa.svg",
  ADELAIDE: "/logos/schools/adelaide.svg",
  UTS: "/logos/schools/uts.svg",
  RMIT: "/logos/schools/rmit.svg",
  MACQUARIE: "/logos/schools/macquarie.svg",
  AUCKLAND: "/logos/schools/auckland.svg",
  OTAGO: "/logos/schools/otago.svg",
  MASSEY: "/logos/schools/massey.svg",
  VUW: "/logos/schools/vuw.svg",
  CANTERBURY: "/logos/schools/canterbury.svg",
  WAIKATO: "/logos/schools/waikato.svg",
  LINCOLN: "/logos/schools/lincoln.svg",
  AUT: "/logos/schools/aut.svg",
  HKBU: "/logos/schools/hkbu.svg",
  LINGNANU: "/logos/schools/lingnan.svg",
  CHC: "/logos/schools/chc.svg",
  EDUHK: "/logos/schools/eduhk.svg",
  HKMU: "/logos/schools/hkmu.svg",
  HKSYU: "/logos/schools/hksyu.svg",
  HSUHK: "/logos/schools/hsuhk.svg",
  TWC: "/logos/schools/twc.svg",
  UM: "/logos/schools/um.svg",
  MUST: "/logos/schools/must.svg",
  CMU: "/logos/schools/cityu-mo.svg",
  MPU: "/logos/schools/mpu.svg",
  UTM: "/logos/schools/utm.svg",
  SMU: "/logos/schools/smu.svg",
  QMUL: "/school-logos/default.svg",
  STANDREWS: "/school-logos/default.svg",
};

/**
 * Get the school mark path for a given school code.
 * Returns the official logo if available, otherwise falls back to placeholder mark.
 *
 * @param code - School code
 * @returns Path to school mark image
 */
export function getSchoolMarkPath(code?: string | null): string {
  if (!code) return "/school-logos/default.svg";
  const normalizedCode = code.trim().toUpperCase();
  // Priority: official logo > placeholder mark > default
  return officialLogoMap[normalizedCode] || schoolMarkMap[normalizedCode] || "/school-logos/default.svg";
}

/**
 * Get the count of supported school marks.
 * @returns Number of schools with mark assets
 */
export function getSupportedSchoolMarkCount(): number {
  return Object.keys(schoolMarkMap).length;
}

// Legacy function names for backward compatibility
// @deprecated Use getSchoolMarkPath instead
export function getSchoolLogo(code?: string | null): string {
  return getSchoolMarkPath(code);
}

// @deprecated Use getSupportedSchoolMarkCount instead
export function getSupportedSchoolLogoCount(): number {
  return getSupportedSchoolMarkCount();
}
