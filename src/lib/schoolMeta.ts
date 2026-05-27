// 学校展示信息映射表
// 用于覆盖数据库中的显示名称和提供logo路径

export interface SchoolMeta {
  school_code: string;
  display_name_cn: string;
  display_name_en: string;
  logo_path: string;
  short_name: string;
  region_cn: string;
}

export const schoolMetaMap: Record<string, SchoolMeta> = {
  // 香港 - 暂时不使用文字假Logo，回退到显示真实school_code缩写
  "HKU": {
    school_code: "HKU",
    display_name_cn: "香港大学",
    display_name_en: "The University of Hong Kong",
    logo_path: "",
    short_name: "港大",
    region_cn: "中国香港"
  },
  "CUHK": {
    school_code: "CUHK",
    display_name_cn: "香港中文大学",
    display_name_en: "The Chinese University of Hong Kong",
    logo_path: "",
    short_name: "港中大",
    region_cn: "中国香港"
  },
  "HKUST": {
    school_code: "HKUST",
    display_name_cn: "香港科技大学",
    display_name_en: "The Hong Kong University of Science and Technology",
    logo_path: "",
    short_name: "港科大",
    region_cn: "中国香港"
  },
  "CityU": {
    school_code: "CityU",
    display_name_cn: "香港城市大学",
    display_name_en: "City University of Hong Kong",
    logo_path: "",
    short_name: "城大",
    region_cn: "中国香港"
  },
  "PolyU": {
    school_code: "PolyU",
    display_name_cn: "香港理工大学",
    display_name_en: "The Hong Kong Polytechnic University",
    logo_path: "",
    short_name: "理大",
    region_cn: "中国香港"
  },
  "HKBU": {
    school_code: "HKBU",
    display_name_cn: "香港浸会大学",
    display_name_en: "Hong Kong Baptist University",
    logo_path: "",
    short_name: "浸大",
    region_cn: "中国香港"
  },
  "LingnanU": {
    school_code: "LingnanU",
    display_name_cn: "岭南大学",
    display_name_en: "Lingnan University",
    logo_path: "",
    short_name: "岭大",
    region_cn: "中国香港"
  },
  "EdUHK": {
    school_code: "EdUHK",
    display_name_cn: "香港教育大学",
    display_name_en: "The Education University of Hong Kong",
    logo_path: "",
    short_name: "教大",
    region_cn: "中国香港"
  },
  "HKMU": {
    school_code: "HKMU",
    display_name_cn: "香港都会大学",
    display_name_en: "Hong Kong Metropolitan University",
    logo_path: "",
    short_name: "都会大学",
    region_cn: "中国香港"
  },
  "HKSYU": {
    school_code: "HKSYU",
    display_name_cn: "香港树仁大学",
    display_name_en: "Hong Kong Shue Yan University",
    logo_path: "",
    short_name: "树仁",
    region_cn: "中国香港"
  },
  "CHC": {
    school_code: "CHC",
    display_name_cn: "香港珠海学院",
    display_name_en: "Chu Hai College of Higher Education",
    logo_path: "",
    short_name: "珠海",
    region_cn: "中国香港"
  },
  "HSUHK": {
    school_code: "HSUHK",
    display_name_cn: "香港恒生大学",
    display_name_en: "The Hang Seng University of Hong Kong",
    logo_path: "",
    short_name: "恒生",
    region_cn: "中国香港"
  },
  "TWC": {
    school_code: "TWC",
    display_name_cn: "香港东华学院",
    display_name_en: "Tung Wah College",
    logo_path: "",
    short_name: "东华",
    region_cn: "中国香港"
  },

  // 新加坡
  "NUS": {
    school_code: "NUS",
    display_name_cn: "新加坡国立大学",
    display_name_en: "National University of Singapore",
    logo_path: "/school-logos/official/nus.svg",
    short_name: "国大",
    region_cn: "新加坡"
  },
  "NTU": {
    school_code: "NTU",
    display_name_cn: "南洋理工大学",
    display_name_en: "Nanyang Technological University",
    logo_path: "/school-logos/official/ntu.svg",
    short_name: "南大",
    region_cn: "新加坡"
  },
  "SMU": {
    school_code: "SMU",
    display_name_cn: "新加坡管理大学",
    display_name_en: "Singapore Management University",
    logo_path: "/school-logos/official/smu.svg",
    short_name: "新大",
    region_cn: "新加坡"
  },

  // 澳大利亚
  "ADELAIDE": {
    school_code: "ADELAIDE",
    display_name_cn: "阿德莱德大学",
    display_name_en: "Adelaide University",
    logo_path: "/logos/schools/adelaide.svg",
    short_name: "阿德莱德",
    region_cn: "澳大利亚"
  },
  "ANU": {
    school_code: "ANU",
    display_name_cn: "澳大利亚国立大学",
    display_name_en: "Australian National University",
    logo_path: "/logos/schools/anu.svg",
    short_name: "澳国立",
    region_cn: "澳大利亚"
  },
  "MONASH": {
    school_code: "MONASH",
    display_name_cn: "蒙纳士大学",
    display_name_en: "Monash University",
    logo_path: "/logos/schools/monash.svg",
    short_name: "蒙纳士",
    region_cn: "澳大利亚"
  },
  "UNSW": {
    school_code: "UNSW",
    display_name_cn: "新南威尔士大学",
    display_name_en: "UNSW Sydney",
    logo_path: "/logos/schools/unsw.svg",
    short_name: "新南",
    region_cn: "澳大利亚"
  },
  "USYD": {
    school_code: "USYD",
    display_name_cn: "悉尼大学",
    display_name_en: "University of Sydney",
    logo_path: "/logos/schools/usyd.svg",
    short_name: "悉大",
    region_cn: "澳大利亚"
  },
  "UQ": {
    school_code: "UQ",
    display_name_cn: "昆士兰大学",
    display_name_en: "The University of Queensland",
    logo_path: "/logos/schools/uq.svg",
    short_name: "昆大",
    region_cn: "澳大利亚"
  },
  "UNIMELB": {
    school_code: "UNIMELB",
    display_name_cn: "墨尔本大学",
    display_name_en: "University of Melbourne",
    logo_path: "/logos/schools/unimelb.svg",
    short_name: "墨大",
    region_cn: "澳大利亚"
  },
  "UTS": {
    school_code: "UTS",
    display_name_cn: "悉尼科技大学",
    display_name_en: "University of Technology Sydney",
    logo_path: "/logos/schools/uts.svg",
    short_name: "悉尼科大",
    region_cn: "澳大利亚"
  },
  "RMIT": {
    school_code: "RMIT",
    display_name_cn: "皇家墨尔本理工大学",
    display_name_en: "RMIT University",
    logo_path: "/logos/schools/rmit.svg",
    short_name: "RMIT",
    region_cn: "澳大利亚"
  },
  "UWA": {
    school_code: "UWA",
    display_name_cn: "西澳大学",
    display_name_en: "The University of Western Australia",
    logo_path: "/logos/schools/uwa.svg",
    short_name: "西澳",
    region_cn: "澳大利亚"
  },

  // 默认补充
  "MACQUARIE": {
    school_code: "MACQUARIE",
    display_name_cn: "麦考瑞大学",
    display_name_en: "Macquarie University",
    logo_path: "/logos/schools/macquarie.svg",
    short_name: "麦考瑞",
    region_cn: "澳大利亚"
  },
  "DEAKIN": {
    school_code: "DEAKIN",
    display_name_cn: "迪肯大学",
    display_name_en: "Deakin University",
    logo_path: "/school-logos/default.svg",
    short_name: "迪肯",
    region_cn: "澳大利亚"
  },
  "LA_TROBE": {
    school_code: "LA_TROBE",
    display_name_cn: "拉筹伯大学",
    display_name_en: "La Trobe University",
    logo_path: "/school-logos/default.svg",
    short_name: "拉筹伯",
    region_cn: "澳大利亚"
  },
  "SWINBURNE": {
    school_code: "SWINBURNE",
    display_name_cn: "斯威本科技大学",
    display_name_en: "Swinburne University of Technology",
    logo_path: "/school-logos/default.svg",
    short_name: "斯威本",
    region_cn: "澳大利亚"
  },
  "VICTORIA": {
    school_code: "VICTORIA",
    display_name_cn: "维多利亚大学",
    display_name_en: "Victoria University",
    logo_path: "/school-logos/default.svg",
    short_name: "维多利亚",
    region_cn: "澳大利亚"
  },
  "WESTERN_SYDNEY": {
    school_code: "WESTERN_SYDNEY",
    display_name_cn: "西悉尼大学",
    display_name_en: "Western Sydney University",
    logo_path: "/school-logos/default.svg",
    short_name: "西悉尼",
    region_cn: "澳大利亚"
  },
  "FLINDERS": {
    school_code: "FLINDERS",
    display_name_cn: "弗林德斯大学",
    display_name_en: "Flinders University",
    logo_path: "/school-logos/default.svg",
    short_name: "弗林德斯",
    region_cn: "澳大利亚"
  },
  // 澳门 - 暂时不使用文字假Logo，回退到显示真实school_code缩写
  "UM": {
    school_code: "UM",
    display_name_cn: "澳门大学",
    display_name_en: "University of Macau",
    logo_path: "",
    short_name: "澳大",
    region_cn: "中国澳门"
  },
  "MUST": {
    school_code: "MUST",
    display_name_cn: "澳门科技大学",
    display_name_en: "Macau University of Science and Technology",
    logo_path: "",
    short_name: "澳科大",
    region_cn: "中国澳门"
  },
  "MPU": {
    school_code: "MPU",
    display_name_cn: "澳门理工大学",
    display_name_en: "Macao Polytechnic University",
    logo_path: "",
    short_name: "澳门理工",
    region_cn: "中国澳门"
  },
  "CityU_MO": {
    school_code: "CityU_MO",
    display_name_cn: "澳门城市大学",
    display_name_en: "City University of Macau",
    logo_path: "",
    short_name: "澳城大",
    region_cn: "中国澳门"
  },
  "UTM": {
    school_code: "UTM",
    display_name_cn: "澳门旅游大学",
    display_name_en: "Macao University of Tourism",
    logo_path: "",
    short_name: "澳旅大",
    region_cn: "中国澳门"
  },
  "UCL": {
    school_code: "UCL",
    display_name_cn: "伦敦大学学院",
    display_name_en: "University College London",
    logo_path: "/logos/schools/ucl.svg",
    short_name: "UCL",
    region_cn: "英国"
  },
  "IC": {
    school_code: "IC",
    display_name_cn: "帝国理工学院",
    display_name_en: "Imperial College London",
    logo_path: "/logos/schools/ic.svg",
    short_name: "帝国理工",
    region_cn: "英国"
  },
  "LSE": {
    school_code: "LSE",
    display_name_cn: "伦敦政治经济学院",
    display_name_en: "London School of Economics",
    logo_path: "/logos/schools/lse.svg",
    short_name: "LSE",
    region_cn: "英国"
  },
  "SUTD": {
    school_code: "SUTD",
    display_name_cn: "新加坡科技设计大学",
    display_name_en: "Singapore University of Technology and Design",
    logo_path: "/school-logos/default.svg",
    short_name: "新科大",
    region_cn: "新加坡"
  }
};

// 获取学校元信息
export function getSchoolMeta(schoolCode: string | undefined): SchoolMeta | null {
  if (!schoolCode) return null;
  return schoolMetaMap[schoolCode] || null;
}

// 获取显示名称（中文）
export function getDisplayCn(schoolCode: string | undefined, fallback: string = ""): string {
  const meta = getSchoolMeta(schoolCode);
  if (meta) return meta.display_name_cn;
  return fallback || schoolCode || "待确认";
}

// 获取显示名称（英文）
export function getDisplayEn(schoolCode: string | undefined, fallback: string = ""): string {
  const meta = getSchoolMeta(schoolCode);
  if (meta) return meta.display_name_en;
  return fallback || schoolCode || "待确认";
}

// 获取地区（中文）
export function getRegionCn(schoolCode: string | undefined, fallback: string = ""): string {
  const meta = getSchoolMeta(schoolCode);
  if (meta) return meta.region_cn;
  return fallback || "待确认";
}

// 获取logo路径
export function getLogoPath(schoolCode: string | undefined): string {
  const logoPathByCode: Record<string, string> = {
    HKU: "/school-logos/official/hku.jpg",
    CUHK: "/school-logos/official/cuhk.svg",
    HKUST: "/school-logos/official/hkust.svg",
    PolyU: "/school-logos/official/polyu.png",
    POLYU: "/school-logos/official/polyu.png",
    CityU: "/school-logos/official/cityu.svg",
    CITYU: "/school-logos/official/cityu.svg",
    HKBU: "/school-logos/official/hkbu.svg",
    LingnanU: "/school-logos/official/lingnan.png",
    LINGNANU: "/school-logos/official/lingnan.png",
    CHC: "/school-logos/official/chc.png",
    EdUHK: "/school-logos/official/eduhk.png",
    EDUHK: "/school-logos/official/eduhk.png",
    HKMU: "/school-logos/official/hkmu.png",
    HKSYU: "/school-logos/official/hksyu.svg",
    HSUHK: "/school-logos/official/hsuhk.png",
    TWC: "/school-logos/official/twc.svg",
    UM: "/school-logos/official/um.png",
    MUST: "/school-logos/official/must.png",
    CMU: "/school-logos/official/cmu.png",
    "CityU-MO": "/school-logos/official/cmu.png",
    "CITYU-MO": "/school-logos/official/cmu.png",
    CityU_MO: "/school-logos/official/cmu.png",
    MPU: "/school-logos/official/mpu.png",
    UTM: "/school-logos/official/utm.png",
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

  if (schoolCode && logoPathByCode[schoolCode]) return logoPathByCode[schoolCode];
  const meta = getSchoolMeta(schoolCode);
  if (meta && meta.logo_path) return meta.logo_path;
  return "";
}

// 澳门学校官方 logo 映射
const macauOfficialLogos: Record<string, string> = {
  UM: "/school-logos/official/um.png",
  MUST: "/school-logos/official/must.png",
  MPU: "/school-logos/official/mpu.png",
  UTM: "/school-logos/official/utm.png",
  CMU: "/school-logos/official/cmu.png",
  "CityU-MO": "/school-logos/official/cmu.png",
  "CITYU-MO": "/school-logos/official/cmu.png",
  CityU_MO: "/school-logos/official/cmu.png",
};

// 获取澳门学校官方 logo
export function getMacauOfficialLogo(schoolCode: string | undefined): string {
  if (!schoolCode) return "";
  return macauOfficialLogos[schoolCode] || "";
}
