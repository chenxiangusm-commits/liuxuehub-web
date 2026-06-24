/**
 * Single school logo entrypoint.
 *
 * Page components should only call getSchoolLogo(). Assets are resolved from
 * /public/school-logos/official, with one local default fallback.
 */

const DEFAULT_LOGO = "/school-logos/default.svg";

const SCHOOL_LOGOS: Record<string, string> = {
  IC: "/school-logos/official/ic.svg",
  IMPERIAL: "/school-logos/official/ic.svg",
  OXFORD: "/school-logos/official/oxford-clean.svg",
  OX: "/school-logos/official/oxford-clean.svg",
  CAMBRIDGE: "/school-logos/official/cambridge-clean.svg",
  CAM: "/school-logos/official/cambridge-clean.svg",
  UCL: "/school-logos/official/ucl.svg",
  KCL: "/school-logos/official/kcl-clean.svg",
  LSE: "/school-logos/lse.svg",
  EDINBURGH: "/school-logos/edinburgh.svg",
  MANCHESTER: "/school-logos/manchester.svg",
  BRISTOL: "/school-logos/bristol.svg",
  WARWICK: "/school-logos/warwick.svg",
  BIRMINGHAM: "/school-logos/birmingham.svg",
  GLASGOW: "/school-logos/glasgow.svg",
  LEEDS: "/school-logos/leeds.svg",
  SOUTHAMPTON: "/school-logos/southampton.svg",
  SHEFFIELD: "/school-logos/sheffield.svg",
  DURHAM: "/school-logos/durham.svg",
  NOTTINGHAM: "/school-logos/nottingham.svg",
  NUS: "/school-logos/official/nus.svg",
  NTU: "/school-logos/official/ntu.svg",
  SMU: "/school-logos/official/smu.svg",
  HKU: "/school-logos/official/hku-clean.png",
  CUHK: "/school-logos/official/cuhk.svg",
  HKUST: "/school-logos/official/hkust.svg",
  POLYU: "/school-logos/official/polyu.png",
  CITYU: "/school-logos/official/cityu.svg",
  HKBU: "/school-logos/official/hkbu.svg",
  LINGNANU: "/school-logos/official/lingnan.png",
  EDUHK: "/school-logos/official/eduhk.png",
  HKMU: "/school-logos/official/hkmu.png",
  HKSYU: "/school-logos/official/hksyu.svg",
  HSUHK: "/school-logos/official/hsuhk.png",
  TWC: "/school-logos/official/twc.svg",
  UM: "/school-logos/official/um.png",
  MUST: "/school-logos/official/must.png",
  CMU: "/school-logos/official/cmu.png",
  "CITYU-MO": "/school-logos/official/cmu.png",
  CITYU_MO: "/school-logos/official/cmu.png",
  MPU: "/school-logos/official/mpu.png",
  UTM: "/school-logos/official/utm.png",
  CHC: "/school-logos/official/chc.png",
  UNIMELB: "/school-logos/official/unimelb.png",
  MELBOURNE: "/school-logos/official/unimelb.png",
  UNSW: "/school-logos/official/unsw.png",
  USYD: "/school-logos/official/usyd.svg",
  SYDNEY: "/school-logos/official/usyd.svg",
  ANU: "/school-logos/official/anu-clean.svg",
  UQ: "/school-logos/official/uq.svg",
  MONASH: "/school-logos/monash.svg",
  ADELAIDE: "/school-logos/adelaide.svg",
  UTS: "/school-logos/uts.svg",
  RMIT: "/school-logos/rmit.svg",
  MACQUARIE: "/school-logos/macquarie.svg",
  UWA: "/school-logos/uwa.svg",
  AUCKLAND: "/school-logos/auckland.svg",
  OTAGO: "/school-logos/otago.svg",
  MASSEY: "/school-logos/massey.svg",
  VUW: "/school-logos/vuw.svg",
  CANTERBURY: "/school-logos/canterbury.svg",
  WAIKATO: "/school-logos/waikato.svg",
  LINCOLN: "/school-logos/lincoln.svg",
  AUT: "/school-logos/aut.svg",
};

function normalizeSchoolCode(code?: string | null): string {
  return (code || "").trim().toUpperCase();
}

export function getSchoolLogo(code?: string | null): string {
  const normalizedCode = normalizeSchoolCode(code);
  return SCHOOL_LOGOS[normalizedCode] || DEFAULT_LOGO;
}

export function getSchoolLogoAlt(schoolName?: string | null): string {
  return `${schoolName?.trim() || "学校"} logo`;
}

export function getSupportedSchoolLogoCount(): number {
  return Object.keys(SCHOOL_LOGOS).length;
}

// Backward-compatible aliases. Do not add another mapping here.
export const getSchoolMarkPath = getSchoolLogo;
export const getSupportedSchoolMarkCount = getSupportedSchoolLogoCount;

