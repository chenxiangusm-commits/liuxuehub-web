// 学校中文名映射表
export const schoolChineseNames: Record<string, string> = {
  // 澳大利亚
  "ADELAIDE": "阿德莱德大学",
  "ANU": "澳大利亚国立大学",
  "MONASH": "莫纳什大学",
  "UNSW": "新南威尔士大学",
  "USYD": "悉尼大学",
  "UQ": "昆士兰大学",
  "UTS": "悉尼科技大学",
  "RMIT": "皇家墨尔本理工大学",
  "MACQUARIE": "麦考瑞大学",
  "DEAKIN": "迪肯大学",
  "LA_TROBE": "拉筹伯大学",
  "SWINBURNE": "斯威本科技大学",
  "VICTORIA": "维多利亚大学",
  "WESTERN_SYDNEY": "西悉尼大学",
  "FLINDERS": "弗林德斯大学",
  "MELBOURNE": "墨尔本大学",
  "UWA": "西澳大学",
  "QUT": "昆士兰科技大学",
  
  // 新加坡
  "NUS": "新加坡国立大学",
  "NTU": "南洋理工大学",
  "SMU": "新加坡管理大学",
  "SUTD": "新加坡科技设计大学",
  
  // 中国香港
  "HKU": "香港大学",
  "HKUST": "香港科技大学",
  "CUHK": "香港中文大学",
  "HKCityU": "香港城市大学",
  "HKPolyU": "香港理工大学",
  "HKUofS": "香港大学专业进修学院",
  "Lingnan": "香港岭南大学",
  "HKBU": "香港浸会大学",
  
  // 中国澳门
  "UM": "澳门大学",
  "MU": "澳门理工大学",
  
  // 英国
  "OXFORD": "牛津大学",
  "CAMBRIDGE": "剑桥大学",
  "UCL": "伦敦大学学院",
  "IC": "帝国理工学院",
  "LSE": "伦敦政治经济学院",
  "MANCHESTER": "曼彻斯特大学",
  "EDINBURGH": "爱丁堡大学",
  "KCL": "伦敦国王学院",
  "BRISTOL": "布里斯托尔大学",
  "GLASGOW": "格拉斯哥大学",
  "BIRMINGHAM": "伯明翰大学",
  "LEEDS": "利兹大学",
  "SHEFFIELD": "谢菲尔德大学",
  "SOUTHAMPTON": "南安普顿大学",
  "NOTTINGHAM": "诺丁汉大学",
  "LIVERPOOL": "利物浦大学",
  
  // 默认值
};

// 获取学校中文名
export function getSchoolChineseName(schoolCode: string | undefined, fallbackName: string = ""): string {
  if (!schoolCode) return fallbackName || "待确认";
  return schoolChineseNames[schoolCode] || fallbackName || schoolCode;
}
