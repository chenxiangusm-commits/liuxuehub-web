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
};

export const studyPlanMockResult = {
  profile: {
    direction: "金融 / 商科",
    backgroundType: "211 本科，相关专业背景",
    competitiveness: 76,
    riskLevel: "中等风险",
    weakness: "语言成绩和实习深度仍需提升",
  },
  radar: [
    { label: "学术能力", score: 78 },
    { label: "语言能力", score: 68 },
    { label: "科研能力", score: 58 },
    { label: "项目能力", score: 72 },
    { label: "实习能力", score: 74 },
    { label: "职业匹配度", score: 80 },
  ],
  swot: {
    strengths: ["本科背景具备竞争力", "目标方向清晰", "已有相关项目经历"],
    weaknesses: ["语言成绩仍有提升空间", "高质量实习数量不足", "科研产出不够突出"],
    opportunities: ["英国和香港商科项目选择丰富", "部分院校重视职业规划匹配", "可通过文书强化申请动机"],
    threats: ["热门专业竞争激烈", "部分项目截止较早", "同背景申请者数量较多"],
  },
  recommendations: {
    reach: [
      { school: "伦敦政治经济学院", qs: 56, region: "英国", reason: "项目声誉强，适合冲刺高排名商科方向。" },
      { school: "伦敦大学学院", qs: 9, region: "英国", reason: "综合排名高，对量化和职业规划要求较高。" },
    ],
    match: [
      { school: "曼彻斯特大学", qs: 35, region: "英国", reason: "专业覆盖广，背景匹配度较好。" },
      { school: "华威大学", qs: 74, region: "英国", reason: "商学院认可度高，适合作为主申选择。" },
    ],
    safe: [
      { school: "利兹大学", qs: 86, region: "英国", reason: "专业选择多，申请容错度相对更高。" },
      { school: "南安普顿大学", qs: 87, region: "英国", reason: "适合作为稳妥方案补充。" },
    ],
  },
  gaps: {
    met: ["本科背景达到多数项目基本门槛", "专业方向与申请目标基本一致", "已有可包装的项目经历"],
    improve: ["雅思建议提升至 7.0 或以上", "补充一段强相关实习", "明确职业目标与课程匹配关系"],
    risks: ["申请材料同质化风险", "热门学校截止较早", "量化课程基础需要在文书中说明"],
  },
  timeline: [
    { month: "2026年3月", task: "完成语言考试规划，确定目标分数" },
    { month: "2026年5月", task: "补充科研、项目或实习经历" },
    { month: "2026年8月", task: "完成简历、PS和推荐信初稿" },
    { month: "2026年9月", task: "开始递交第一批申请" },
  ],
  actions: [
    { title: "语言提升", detail: "优先冲刺雅思总分 7.0，写作和口语避免短板。" },
    { title: "科研建议", detail: "选择与目标方向相关的课程论文或数据分析项目。" },
    { title: "项目建议", detail: "用商业分析、金融建模或行业研究项目强化专业匹配。" },
    { title: "文书建议", detail: "突出申请动机、职业路径和目标课程之间的逻辑。" },
    { title: "面试建议", detail: "提前准备自我介绍、选校原因和职业规划问答。" },
  ],
};

