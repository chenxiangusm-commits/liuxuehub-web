import type { School } from "@/types";
import { getQSRank, getQSYear, getQSLabel } from "@/lib/qs-ranking";
/**
 * 智能定校匹配逻辑
 * 基于规则匹配生成冲刺/稳妥/保底选校方案
 */

// 输入类型
export interface SchoolMatchInput {
  stage: string;
  countries: string[];
  schoolTier: string;
  schoolName: string;
  major: string;
  gpa: string;
  gpaType: '百分制' | '4.0制' | '英国学位等级';
  languageType: string | null;
  languageScore?: string;
  targetDirections: string[];
  preference: string[];
}

// 学校推荐类型
export interface RecommendedSchool {
  nameCn: string;
  nameEn: string;
  country: string;
  qsRank?: number;
  qsYear?: number;
  qsLabel?: string;
  matchScore: number;
  type: 'reach' | 'match' | 'safety';
  difficulty: string;
  reasons: string[];
  riskWarning: string;
  programCount: number;
}

// 定校结果类型
export interface SchoolMatchResult {
  summary: {
    reachPercent: number;
    matchPercent: number;
    safetyPercent: number;
  };
  coreScores: {
    comprehensiveScore: string;
    rankingPotential: string;
    admissionStability: string;
  };
  reachSchools: RecommendedSchool[];
  matchSchools: RecommendedSchool[];
  safetySchools: RecommendedSchool[];
  aiCommentary: {
    strengths: string[];
    weaknesses: string[];
    strategy: string;
    nextSteps: string[];
  };
}

// 学校数据库 - 简化版mock数据
const schoolDatabase: Array<{
  schoolCode: string;
  nameCn: string;
  nameEn: string;
  country: string;
  qsRank?: number;
  qsYear?: number;
  qsLabel?: string;
  tiers: string[];
  directions: string[];
}> = [
  // 英国
  { schoolCode: 'IC', nameCn: '帝国理工学院', nameEn: 'Imperial College London', country: '英国', tiers: ['985', '211', '双一流'], directions: ['商科', '金融', '计算机', '工程'] },
  { schoolCode: 'OXFORD', nameCn: '牛津大学', nameEn: 'University of Oxford', country: '英国', tiers: ['985', '211', '双一流'], directions: ['商科', '法律', '公共政策', '国际关系'] },
  { schoolCode: 'CAMBRIDGE', nameCn: '剑桥大学', nameEn: 'University of Cambridge', country: '英国', tiers: ['985', '211', '双一流'], directions: ['商科', '工程', '法律', '教育'] },
  { schoolCode: 'UCL', nameCn: '伦敦大学学院', nameEn: 'UCL', country: '英国', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '建筑', '教育', '传媒'] },
  { schoolCode: 'EDINBURGH', nameCn: '爱丁堡大学', nameEn: 'University of Edinburgh', country: '英国', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '金融', '教育', 'AI'] },
  { schoolCode: 'MANCHESTER', nameCn: '曼彻斯特大学', nameEn: 'University of Manchester', country: '英国', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '金融', '会计', '工程'] },
  { schoolCode: 'KCL', nameCn: '伦敦国王学院', nameEn: "King's College London", country: '英国', tiers: ['985', '211', '双一流', '普通一本'], directions: ['医学', '法律', '公共政策'] },
  { schoolCode: 'WARWICK', nameCn: '华威大学', nameEn: 'University of Warwick', country: '英国', tiers: ['985', '211', '双一流', '普通一本', '普通二本'], directions: ['商科', '金融', '管理', '数据科学'] },
  { schoolCode: 'BRISTOL', nameCn: '布里斯托大学', nameEn: 'University of Bristol', country: '英国', tiers: ['985', '211', '双一流', '普通一本'], directions: ['工程', '计算机', '金融', '法学'] },
  { schoolCode: 'GLASGOW', nameCn: '格拉斯哥大学', nameEn: 'University of Glasgow', country: '英国', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['商科', '金融', '教育', '工程'] },
  { schoolCode: 'SOUTHAMPTON', nameCn: '南安普顿大学', nameEn: 'University of Southampton', country: '英国', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['工程', '计算机', '物理', '光电'] },
  { schoolCode: 'LEEDS', nameCn: '利兹大学', nameEn: 'University of Leeds', country: '英国', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['商科', '金融', '传媒', '工程'] },
  { schoolCode: 'SHEFFIELD', nameCn: '谢菲尔德大学', nameEn: 'University of Sheffield', country: '英国', tiers: ['211', '普通一本', '普通二本'], directions: ['工程', '计算机', '管理', '建筑'] },
  { schoolCode: 'NOTTINGHAM', nameCn: '诺丁汉大学', nameEn: 'University of Nottingham', country: '英国', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['商科', '工程', '教育', '传媒'] },
  { schoolCode: 'NEWCASTLE', nameCn: '纽卡斯尔大学', nameEn: 'Newcastle University', country: '英国', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['医学', '商科', '建筑', '计算机'] },
  { schoolCode: 'CARDIFF', nameCn: '卡迪夫大学', nameEn: 'Cardiff University', country: '英国', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['商科', '传媒', '建筑', '工程'] },
  { schoolCode: 'EXETER', nameCn: '埃克塞特大学', nameEn: 'University of Exeter', country: '英国', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['商科', '金融', '教育', '心理学'] },
  { schoolCode: 'YORK', nameCn: '约克大学', nameEn: 'University of York', country: '英国', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['计算机', '教育', '心理学', '艺术设计'] },

  // 澳大利亚
  { schoolCode: 'ANU', nameCn: '澳大利亚国立大学', nameEn: 'ANU', country: '澳大利亚', tiers: ['985', '211', '双一流', '普通一本'], directions: ['计算机', '公共政策', '国际关系', 'AI'] },
  { schoolCode: 'UNIMELB', nameCn: '墨尔本大学', nameEn: 'University of Melbourne', country: '澳大利亚', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '医学', '法学', '工程'] },
  { schoolCode: 'USYD', nameCn: '悉尼大学', nameEn: 'University of Sydney', country: '澳大利亚', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '医学', '法学', '传媒'] },
  { schoolCode: 'UNSW', nameCn: '新南威尔士大学', nameEn: 'UNSW', country: '澳大利亚', tiers: ['985', '211', '双一流', '普通一本'], directions: ['工程', '商科', '金融', '计算机'] },
  { schoolCode: 'UQ', nameCn: '昆士兰大学', nameEn: 'UQ', country: '澳大利亚', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '医学', '生物', '环境'] },
  { schoolCode: 'MONASH', nameCn: '莫纳什大学', nameEn: 'Monash University', country: '澳大利亚', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['商科', '工程', '医学', '教育'] },
  { schoolCode: 'UWA', nameCn: '西澳大学', nameEn: 'UWA', country: '澳大利亚', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['工程', '商科', '医学', '矿业'] },
  { schoolCode: 'ADELAIDE', nameCn: '阿德莱德大学', nameEn: 'Adelaide University', country: '澳大利亚', tiers: ['普通一本', '普通二本', '独立学院/民办'], directions: ['工程', '医学', '商科', '葡萄酒'] },

  // 新加坡
  { schoolCode: 'NUS', nameCn: '新加坡国立大学', nameEn: 'NUS', country: '新加坡', tiers: ['985', '211', '双一流'], directions: ['商科', '计算机', '工程', '法学'] },
  { schoolCode: 'NTU', nameCn: '南洋理工大学', nameEn: 'NTU', country: '新加坡', tiers: ['985', '211', '双一流'], directions: ['工程', '商科', 'AI', '数据科学'] },

  // 中国香港
  { schoolCode: 'HKU', nameCn: '香港大学', nameEn: 'HKU', country: '中国香港', tiers: ['985', '211', '双一流', '普通一本'], directions: ['医学', '法学', '商科', '建筑'] },
  { schoolCode: 'CUHK', nameCn: '香港中文大学', nameEn: 'CUHK', country: '中国香港', tiers: ['985', '211', '双一流', '普通一本'], directions: ['商科', '法学', '传媒', '医学'] },
  { schoolCode: 'HKUST', nameCn: '香港科技大学', nameEn: 'HKUST', country: '中国香港', tiers: ['985', '211', '双一流', '普通一本'], directions: ['工程', '商科', '计算机', '金融'] },
  { schoolCode: 'CityU', nameCn: '香港城市大学', nameEn: 'CityU', country: '中国香港', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['商科', '法学', '工程', '数据科学'] },
  { schoolCode: 'PolyU', nameCn: '香港理工大学', nameEn: 'PolyU', country: '中国香港', tiers: ['211', '双一流', '普通一本', '普通二本'], directions: ['工程', '建筑', '商科', '设计'] },
];

// 将GPA转换为百分制
function normalizeGPA(gpa: string, gpaType: string): number {
  if (!gpa) return 0;

  if (gpaType === '百分制') {
    return parseFloat(gpa) || 0;
  }

  if (gpaType === '4.0制') {
    const val = parseFloat(gpa) || 0;
    return Math.min(100, val * 25); // 4.0 -> 100
  }

  if (gpaType === '英国学位等级') {
    // First Class: 70+, Upper Second: 60-69, Lower Second: 50-59, Third: 40-49
    const gpaLower = gpa.toLowerCase();
    if (gpaLower.includes('first') || gpaLower.includes('first class')) return 85;
    if (gpaLower.includes('upper second') || gpaLower.includes('2:1')) return 75;
    if (gpaLower.includes('lower second') || gpaLower.includes('2:2')) return 65;
    if (gpaLower.includes('third') || gpaLower.includes('third class')) return 55;
    return 70; // default for UK degrees
  }

  return 0;
}

// 计算综合竞争力
function calculateComprehensiveScore(
  gpa: number,
  schoolTier: string,
  hasLanguage: boolean,
  targetDirections: string[]
): number {
  let score = 0;

  // GPA (40%)
  score += (gpa / 100) * 40;

  // 学校背景 (30%)
  if (schoolTier === '985') score += 30;
  else if (schoolTier === '211' || schoolTier === '双一流') score += 25;
  else if (schoolTier === '海外本科') score += 22;
  else if (schoolTier === '普通一本') score += 15;
  else if (schoolTier === '普通二本') score += 10;
  else score += 5;

  // 语言成绩 (20%)
  if (hasLanguage) score += 20;
  else score += 5;

  // 专业方向匹配 (10%)
  if (targetDirections.length > 0) score += 10;

  return Math.round(score);
}

// 筛选学校
function filterSchools(
  input: SchoolMatchInput,
  gpa: number,
  schools: typeof schoolDatabase
): typeof schoolDatabase {
  return schools.filter(school => {
    // 1. 按国家筛选
    if (!input.countries.includes(school.country)) return false;

    // 2. 按专业方向筛选
    if (input.targetDirections.length > 0) {
      const hasMatch = input.targetDirections.some(dir =>
        school.directions.some(sd => sd.includes(dir) || dir.includes(sd))
      );
      if (!hasMatch) return false;
    }

    // 3. 按学校层级初步筛选
    if (school.tiers.includes(input.schoolTier)) return true;

    // 如果学校层级不在学校的tiers中，根据GPA判断
    if (gpa >= 85 && school.qsRank && school.qsRank <= 50) return true;
    if (gpa >= 75 && school.qsRank && school.qsRank <= 100) return true;
    if (gpa >= 65 && school.qsRank && school.qsRank <= 200) return true;

    return false;
  });
}

// 分配学校到冲刺/稳妥/保底
function categorizeSchools(
  schools: typeof schoolDatabase,
  gpa: number,
  schoolTier: string,
  input: SchoolMatchInput
): { reach: typeof schoolDatabase; match: typeof schoolDatabase; safety: typeof schoolDatabase } {
  const reach: typeof schoolDatabase = [];
  const match: typeof schoolDatabase = [];
  const safety: typeof schoolDatabase = [];

  // 计算竞争力阈值
  let safetyThreshold = 30;

  if (schoolTier === '985' || schoolTier === '211') {
    safetyThreshold = 60;
  } else if (schoolTier === '双一流' || schoolTier === '海外本科') {
    safetyThreshold = 55;
  } else if (schoolTier === '普通一本') {
    safetyThreshold = 65;
  } else {
    safetyThreshold = 70;
  }

  schools.forEach(school => {
    const score = school.qsRank ? Math.max(0, 100 - school.qsRank) : 50;

    // 根据偏好调整
    if (input.preference.includes('dream_school') && school.qsRank && school.qsRank <= 30) {
      reach.push(school);
    } else if (input.preference.includes('safe_option')) {
      if (score > safetyThreshold) {
        match.push(school);
      } else {
        safety.push(school);
      }
    } else {
      // 默认分类逻辑
      if (school.qsRank && school.qsRank <= 50) {
        if (gpa >= 80 || schoolTier === '985') {
          reach.push(school);
        } else {
          match.push(school);
        }
      } else if (school.qsRank && school.qsRank <= 100) {
        if (gpa >= 75) {
          reach.push(school);
        } else if (gpa >= 65) {
          match.push(school);
        } else {
          safety.push(school);
        }
      } else if (school.qsRank && school.qsRank <= 200) {
        if (gpa >= 70) {
          match.push(school);
        } else {
          safety.push(school);
        }
      } else {
        safety.push(school);
      }
    }
  });

  // 按QS排名排序
  const sortByRank = (a: typeof schoolDatabase[0], b: typeof schoolDatabase[0]) => {
    if (!a.qsRank) return 1;
    if (!b.qsRank) return -1;
    return a.qsRank - b.qsRank;
  };

  reach.sort(sortByRank);
  match.sort(sortByRank);
  safety.sort(sortByRank);

  return { reach, match, safety };
}

// 生成推荐学校详情
function generateRecommendedSchool(
  school: typeof schoolDatabase[0],
  type: 'reach' | 'match' | 'safety',
  input: SchoolMatchInput
): RecommendedSchool {
  const reasons: string[] = [];
  const riskWarnings: string[] = [];

  // 生成推荐理由
  if (school.qsRank && school.qsRank <= 30) {
    reasons.push('QS世界排名前30，学历含金量高');
  } else if (school.qsRank && school.qsRank <= 50) {
    reasons.push('QS世界排名前50，知名度和认可度高');
  } else if (school.qsRank && school.qsRank <= 100) {
    reasons.push('QS世界排名前100，回国就业有优势');
  }

  if (input.targetDirections.some(dir => school.directions.includes(dir))) {
    reasons.push('专业方向与目标申请匹配');
  }

  if (type === 'reach') {
    reasons.push('适合冲刺申请，增加录取机会');
  } else if (type === 'match') {
    reasons.push('综合背景与学校要求较为匹配');
  } else {
    reasons.push('录取难度相对较低，适合保底');
  }

  // 生成风险提示
  const gpa = normalizeGPA(input.gpa, input.gpaType);
  if (type === 'reach') {
    if (gpa < 85) {
      riskWarnings.push('GPA与热门专业强竞争区间有差距，建议搭配稳妥院校');
    }
    if (!input.languageScore) {
      riskWarnings.push('语言成绩缺失可能影响审核');
    }
  } else if (type === 'match') {
    if (!input.languageScore) {
      riskWarnings.push('建议在申请前获得合格的语言成绩');
    }
  }

  // 计算匹配度
  let matchScore = 70;
  if (school.tiers.includes(input.schoolTier)) matchScore += 10;
  if (school.qsRank && school.qsRank <= 50 && gpa >= 80) matchScore += 10;
  if (input.targetDirections.some(dir => school.directions.includes(dir))) matchScore += 10;
  matchScore = Math.min(95, matchScore);

  return {
    nameCn: school.nameCn,
    nameEn: school.nameEn,
    country: school.country,
    qsRank: school.qsRank,
    qsYear: school.qsYear,
    qsLabel: school.qsLabel,
    matchScore,
    type,
    difficulty: type === 'reach' ? '冲刺' : type === 'match' ? '稳妥' : '保底',
    reasons,
    riskWarning: riskWarnings.length > 0 ? riskWarnings[0] : '无明显风险',
    programCount: school.directions.length,
  };
}

// 生成AI点评
function generateAICommentary(
  input: SchoolMatchInput,
  gpa: number,
  reachCount: number,
  matchCount: number,
  safetyCount: number
): SchoolMatchResult['aiCommentary'] {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const nextSteps: string[] = [];

  // 分析优势
  if (input.schoolTier === '985' || input.schoolTier === '211') {
    strengths.push(`${input.schoolTier}院校背景，在留学申请中具有较强竞争力`);
  }
  if (gpa >= 80) {
    strengths.push(`GPA表现优秀（${gpa}分），具备申请世界顶尖院校的基础`);
  } else if (gpa >= 70) {
    strengths.push('GPA表现良好，可以冲击多数目标院校');
  }
  if (input.targetDirections.length > 0) {
    strengths.push(`目标专业方向明确（${input.targetDirections.join('、')}）`);
  }
  if (input.languageScore) {
    strengths.push(`已具备${input.languageType}成绩（${input.languageScore}），可节省备考时间`);
  }

  // 分析短板
  if (!input.languageScore) {
    weaknesses.push('尚未取得语言成绩，建议优先准备语言考试');
  }
  if (gpa < 70) {
    weaknesses.push(`GPA（${gpa}分）竞争力一般，需要在PS和推荐信中突出其他优势`);
  }
  if (!input.schoolTier) {
    weaknesses.push('学校背景信息缺失，可能影响选校定位精度');
  }

  // 选校策略
  let strategy = '';
  if (reachCount >= 2 && matchCount >= 3 && safetyCount >= 2) {
    strategy = `建议采用"${reachCount}所冲刺 + ${matchCount}所稳妥 + ${safetyCount}所保底"的组合，既能冲击名校，又能确保录取`;
  } else if (reachCount > matchCount) {
    strategy = '当前背景冲刺院校较多，建议适当增加稳妥院校以降低风险';
  } else if (safetyCount > reachCount) {
    strategy = '保底院校比例较高，可以适当提升冲刺院校档次';
  } else {
    strategy = '选校组合较为合理，建议保持当前策略';
  }

  // 下一步行动
  if (!input.languageScore) {
    nextSteps.push('尽快准备并参加语言考试（雅思/托福/PTE）');
  }
  if (input.targetDirections.length === 0) {
    nextSteps.push('明确1-2个目标专业方向，以便更精准选校');
  }
  nextSteps.push('完善个人陈述（PS），突出学术兴趣和职业规划');
  nextSteps.push('联系推荐人，准备推荐信');
  nextSteps.push('关注申请截止日期，提前准备申请材料');

  return { strengths, weaknesses, strategy, nextSteps };
}

// 主函数：生成选校匹配结果
export function generateSchoolMatch(input: SchoolMatchInput, rankings: School[] = []): SchoolMatchResult {
  const gpa = normalizeGPA(input.gpa, input.gpaType);
  const hasLanguage = !!input.languageScore;

  // 计算综合竞争力
  const comprehensiveScore = calculateComprehensiveScore(gpa, input.schoolTier, hasLanguage, input.targetDirections);

  // 筛选学校
  const rankedSchools = schoolDatabase.map(s => {
    const current = rankings.find(r => r.school_code === s.schoolCode);
    return { ...s, qsRank: current ? getQSRank(current) : undefined, qsYear: current ? getQSYear(current) : undefined, qsLabel: current ? getQSLabel(current) : undefined };
  });
  const filteredSchools = filterSchools(input, gpa, rankedSchools);

  // 分类学校
  const categorized = categorizeSchools(filteredSchools, gpa, input.schoolTier, input);

  // 生成推荐详情
  const reachSchools = categorized.reach.slice(0, 5).map(s => generateRecommendedSchool(s, 'reach', input));
  const matchSchools = categorized.match.slice(0, 5).map(s => generateRecommendedSchool(s, 'match', input));
  const safetySchools = categorized.safety.slice(0, 5).map(s => generateRecommendedSchool(s, 'safety', input));

  // 计算分布比例
  const total = reachSchools.length + matchSchools.length + safetySchools.length;
  const reachPercent = total > 0 ? Math.round((reachSchools.length / total) * 100) : 30;
  const matchPercent = total > 0 ? Math.round((matchSchools.length / total) * 100) : 50;
  const safetyPercent = 100 - reachPercent - matchPercent;

  // 生成AI点评
  const aiCommentary = generateAICommentary(
    input,
    gpa,
    reachSchools.length,
    matchSchools.length,
    safetySchools.length
  );

  // 生成核心评分
  const rankingPotential = reachSchools.length >= 3
    ? 'QS Top 50 可冲 3-5 所'
    : reachSchools.length >= 1
    ? `QS Top 100 可冲 ${reachSchools.length} 所`
    : 'QS Top 100 冲刺空间有限';

  const admissionStability = matchSchools.length >= 3
    ? '中等偏稳'
    : matchSchools.length >= 1
    ? '有一定把握'
    : '建议提升背景后申请';

  return {
    summary: {
      reachPercent,
      matchPercent,
      safetyPercent,
    },
    coreScores: {
      comprehensiveScore: `${comprehensiveScore}/100`,
      rankingPotential,
      admissionStability,
    },
    reachSchools,
    matchSchools,
    safetySchools,
    aiCommentary,
  };
}
