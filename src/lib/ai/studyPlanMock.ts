export type StudyPlanStage = "undergraduate" | "postgraduate";

export interface StudyPlanForm {
  stage: StudyPlanStage;
  regions: string[];
  direction: string;
  backgroundType?: string;
  schoolName?: string;
  major?: string;
  gpa?: string;
  language?: string;
  gre?: string;
  gmat?: string;
  internship?: string;
  research?: string;
  projects?: string;
  curriculumType?: string;
  highSchoolName?: string;
  highSchoolGrades?: string;
  standardTests?: string;
  activities?: string;
  targetMajor?: string;
  goals?: string;
}

export interface StudyPlanRecommendation {
  school: string;
  program: string;
  reason: string;
  risk: string;
}

export interface StudyPlanResult {
  studentProfile: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    competitivenessScore: number;
  };
  schoolStrategy: {
    reach: StudyPlanRecommendation[];
    match: StudyPlanRecommendation[];
    safe: StudyPlanRecommendation[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  timeline: Array<{
    stage: string;
    time: string;
    tasks: string[];
  }>;
  actionPlan: Array<{
    priority: "高" | "中" | "低";
    action: string;
    reason: string;
  }>;
  riskNotes: string[];
  advisorNotes: string[];
  disclaimer: string;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function formatMonthRange(startOffset: number, endOffset: number, baseDate = new Date()) {
  const start = addMonths(baseDate, startOffset);
  const end = addMonths(baseDate, endOffset);
  return `${formatMonth(start)}-${end.getMonth() + 1}月`;
}

export function createDynamicStudyPlanTimeline(baseDate = new Date()): StudyPlanResult["timeline"] {
  return [
    {
      stage: "语言提升",
      time: formatMonthRange(0, 1, baseDate),
      tasks: ["报名雅思/托福/PTE考试", "集中备考并确认目标分数", "若未达标，预留二刷时间"],
    },
    {
      stage: "文书准备",
      time: formatMonthRange(1, 2, baseDate),
      tasks: ["完成个人陈述初稿", "整理简历与项目经历", "联系推荐人并确认推荐信节奏"],
    },
    {
      stage: "申请递交",
      time: formatMonthRange(3, 5, baseDate),
      tasks: ["优先递交冲刺和匹配项目", "同步递交稳妥项目", "持续跟进官网截止日期"],
    },
    {
      stage: "后续跟进",
      time: `${formatMonth(addMonths(baseDate, 6))}-${formatMonth(addMonths(baseDate, 8))}`,
      tasks: ["等待录取结果", "准备面试或补充材料", "比较offer并规划签证与住宿"],
    },
  ];
}

function monthIndex(year: number, month: number) {
  return year * 12 + month;
}

function getLatestExplicitMonth(time: string) {
  const matches = Array.from(time.matchAll(/(\d{4})年(\d{1,2})月(?:\s*[-–—至到]\s*(?:(\d{4})年)?(\d{1,2})月)?/g));
  if (!matches.length) return null;

  return matches.reduce<number | null>((latest, match) => {
    const startYear = Number(match[1]);
    const startMonth = Number(match[2]);
    const endYear = match[3] ? Number(match[3]) : startYear;
    const endMonth = match[4] ? Number(match[4]) : startMonth;
    const current = monthIndex(endYear, endMonth);
    return latest === null || current > latest ? current : latest;
  }, null);
}

function isExpiredTime(time: string, baseDate: Date) {
  const latestMonth = getLatestExplicitMonth(time);
  if (latestMonth === null) return false;
  return latestMonth < monthIndex(baseDate.getFullYear(), baseDate.getMonth() + 1);
}

export function normalizeStudyPlanTimeline(
  timeline: StudyPlanResult["timeline"] | undefined,
  baseDate = new Date()
): StudyPlanResult["timeline"] {
  if (!timeline?.length) return createDynamicStudyPlanTimeline(baseDate);

  const hasExpiredStage = timeline.some((item) => isExpiredTime(String(item.time || ""), baseDate));
  if (hasExpiredStage) return createDynamicStudyPlanTimeline(baseDate);

  return timeline.map((item) => ({
    stage: item.stage || "申请规划",
    time: item.time || "以当前申请季为准",
    tasks: item.tasks?.length ? item.tasks : ["建议补充确认"],
  }));
}

export const defaultStudyPlanForm: StudyPlanForm = {
  stage: "postgraduate",
  regions: ["英国"],
  direction: "金融",
  backgroundType: "211",
  schoolName: "",
  major: "",
  gpa: "",
  language: "",
  gre: "",
  gmat: "",
  internship: "",
  research: "",
  projects: "",
  curriculumType: "普高",
  highSchoolName: "",
  highSchoolGrades: "",
  standardTests: "",
  activities: "",
  targetMajor: "",
  goals: "",
};

export const studyPlanMockResult: StudyPlanResult = {
  studentProfile: {
    summary: "学生具备一定学术基础，目标方向清晰，但语言成绩、实践深度和申请材料仍需要进一步强化。",
    strengths: ["目标方向明确", "本科背景具备基础竞争力", "已有可包装的项目或实践素材"],
    weaknesses: ["语言成绩仍需提升", "高质量实习或科研深度不足", "职业目标需要进一步具体化"],
    competitivenessScore: 76,
  },
  schoolStrategy: {
    reach: [
      {
        school: "伦敦政治经济学院",
        program: "MSc Management / MSc Finance",
        reason: "学校声誉强，适合作为高目标冲刺。",
        risk: "竞争强，需要更高语言成绩、量化经历和清晰职业规划。",
      },
    ],
    match: [
      {
        school: "曼彻斯特大学",
        program: "MSc Business Analytics / MSc Management",
        reason: "综合排名和专业覆盖较均衡，适合作为主申梯度。",
        risk: "热门专业申请人数多，建议尽早递交。",
      },
    ],
    safe: [
      {
        school: "利兹大学",
        program: "MSc International Business / MSc Data Analytics",
        reason: "专业选择较多，适合补充稳妥方案。",
        risk: "仍需确认具体课程先修要求和语言要求。",
      },
    ],
  },
  swot: {
    strengths: ["背景具备基础竞争力", "申请方向相对集中", "可通过文书强化动机"],
    weaknesses: ["语言和实践深度不足", "高端学校冲刺风险较高"],
    opportunities: ["英国和香港项目选择丰富", "部分学校滚动录取适合早递交"],
    threats: ["热门专业竞争激烈", "截止日期和名额变化需要持续关注"],
  },
  timeline: createDynamicStudyPlanTimeline(),
  actionPlan: [
    { priority: "高", action: "提升语言成绩", reason: "语言是筛选和奖学金评估的重要基础。" },
    { priority: "中", action: "补充相关实践", reason: "增强专业匹配度和文书可信度。" },
    { priority: "中", action: "提前准备文书", reason: "热门项目建议尽早递交，避免名额压力。" },
  ],
  riskNotes: ["不要承诺录取结果", "所有截止日期和费用以官网为准", "建议补充确认具体课程先修要求"],
  advisorNotes: ["可先用该方案做首次咨询底稿", "后续根据学生真实材料细化学校梯度"],
  disclaimer: "AI生成内容仅作规划参考，最终以学校官网和顾问审核为准。",
};
