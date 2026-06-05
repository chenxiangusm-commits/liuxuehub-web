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
  timeline: [
    { stage: "定校与补材料", time: "2026年3月", tasks: ["确认目标地区", "梳理项目清单", "规划语言考试"] },
    { stage: "背景提升", time: "2026年5月", tasks: ["补充实习或科研", "完成项目经历包装"] },
    { stage: "文书准备", time: "2026年8月", tasks: ["完成CV", "准备PS和推荐信"] },
    { stage: "递交申请", time: "2026年9月", tasks: ["优先递交冲刺和匹配项目", "跟进官网截止日期"] },
  ],
  actionPlan: [
    { priority: "高", action: "提升语言成绩", reason: "语言是筛选和奖学金评估的重要基础。" },
    { priority: "中", action: "补充相关实践", reason: "增强专业匹配度和文书可信度。" },
    { priority: "中", action: "提前准备文书", reason: "热门项目建议尽早递交，避免名额压力。" },
  ],
  riskNotes: ["不要承诺录取结果", "所有截止日期和费用以官网为准", "建议补充确认具体课程先修要求"],
  advisorNotes: ["可先用该方案做首次咨询底稿", "后续根据学生真实材料细化学校梯度"],
  disclaimer: "AI生成内容仅作规划参考，最终以学校官网和顾问审核为准。",
};
