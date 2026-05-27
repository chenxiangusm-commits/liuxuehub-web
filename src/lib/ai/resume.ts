/**
 * 留学申请简历生成器
 * 包含简历生成的系统提示词和格式化逻辑
 */

export interface ResumeProfile {
  chineseName?: string;
  englishName?: string;
  email?: string;
  phone?: string;
  city?: string;
  linkedin?: string;
  website?: string;
}

export interface ResumeEducation {
  school: string;
  major: string;
  degree: string;
  gpa?: string;
  startDate?: string;
  endDate?: string;
  courses?: string;
  awards?: string;
}

export interface ResumeExperience {
  type: 'research' | 'internship' | 'project' | 'activity' | 'award';
  title: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  description: string;
}

export interface SelectedProgramContext {
  id: string;
  schoolName: string;
  schoolNameEn: string;
  region: string;
  qsRanking: number | null;
  majorCn: string;
  majorEn: string;
  degree: string;
  duration: string;
  fee: string;
  deadline: string;
  ielts: string;
  toefl: string;
  languageRequirement: string | null;
  subjectRequirement: string | null;
  admissionRoute: string | null;
  requirementDetail: string | null;
  curriculum: string[];
  objectives: string | null;
  careers: string[];
  officialUrl: string;
}

export interface ResumeInput {
  application: {
    stage: string;
    countries: string[];
    targetMajor: string;
    targetSchools?: string;
    outputLanguage: 'english' | 'bilingual';
  };
  profile: ResumeProfile;
  education: ResumeEducation[];
  experiences: ResumeExperience[];
  skills?: string;
  languages?: string;
  uploadedResumeText?: string;
  selectedProgramContext?: SelectedProgramContext;
}

export interface ResumeOutput {
  score: number;
  positioning: string;
  cv: string;
  suggestions: string[];
  missingFields: string[];
  programFitScore?: number;
  programFitSummary?: string;
  requirementGaps?: string[];
  membershipCta?: {
    title: string;
    features: string[];
  };
}

export const RESUME_SYSTEM_PROMPT = `你是一名顶级留学申请简历顾问，熟悉中国学生申请香港、英国、澳洲、新加坡、美国、加拿大、欧洲本科、硕士和博士项目的英文CV写作规范。

根据用户提供的中文或英文信息，生成真实、专业、适合大学招生官阅读的英文留学申请CV。

严格规则：
1. 不得虚构学校、成绩、奖项、论文、科研、实习、职位、项目或技能。
2. 可以优化语言和结构，但不能编造事实。
3. 信息不足时必须列入missingFields。
4. 输出服务于留学申请，不要写成企业求职简历。
5. 语言专业、克制、具体，避免夸张。
6. 硕士申请突出专业匹配、课程基础、项目和实习。
7. 博士申请突出科研经历、方法论、论文/课题、导师匹配潜力。
8. 本科申请突出课程学习、竞赛活动、领导力和潜力展示。
9. 必须返回JSON，不要Markdown。
10. 如果提供了目标项目要求，请优先根据目标项目要求优化CV的内容顺序和表达重点，但不得编造任何用户没有提供的经历或成果。如果用户背景缺少关键要求，请明确指出。

输出格式：
{
  "score": 0-100的整数，表示简历完整度评分,
  "positioning": "申请定位描述，如：冲刺院校/主申院校/保底院校",
  "cv": "完整的英文CV内容，使用标准格式",
  "suggestions": ["优化建议1", "优化建议2", ...],
  "missingFields": ["缺失信息1", "缺失信息2", ...],
  "programFitScore": 0-100的整数，表示与目标项目的匹配度（仅当提供目标项目时）,
  "programFitSummary": "目标项目匹配分析摘要（仅当提供目标项目时）",
  "requirementGaps": ["背景缺口1", "背景缺口2", ...]
}`;

export function buildResumePrompt(input: ResumeInput): string {
  let prompt = '请根据以下信息生成留学申请CV：\n\n';

  if (input.selectedProgramContext) {
    const prog = input.selectedProgramContext;
    prompt += '【目标项目要求】\n';
    prompt += `学校：${prog.schoolName}（${prog.schoolNameEn}）\n`;
    prompt += `专业：${prog.majorCn}（${prog.majorEn}）\n`;
    prompt += `地区：${prog.region}\n`;
    prompt += `学位：${prog.degree}\n`;
    if (prog.qsRanking) prompt += `QS排名：${prog.qsRanking}\n`;
    if (prog.ielts) prompt += `IELTS要求：${prog.ielts}\n`;
    if (prog.toefl) prompt += `TOEFL要求：${prog.toefl}\n`;
    if (prog.languageRequirement) prompt += `语言要求：${prog.languageRequirement}\n`;
    if (prog.subjectRequirement) prompt += `科目要求：${prog.subjectRequirement}\n`;
    if (prog.admissionRoute) prompt += `录取途径：${prog.admissionRoute}\n`;
    if (prog.requirementDetail) prompt += `申请要求：${prog.requirementDetail}\n`;
    if (prog.curriculum && prog.curriculum.length > 0) {
      prompt += `课程关键词：${prog.curriculum.slice(0, 5).join('、')}\n`;
    }
    if (prog.objectives) prompt += `培养目标：${prog.objectives}\n`;
    if (prog.careers && prog.careers.length > 0) {
      prompt += `就业方向：${prog.careers.slice(0, 3).join('、')}\n`;
    }
    prompt += '\n请优先根据目标项目要求优化CV的内容顺序和表达重点，但不得编造任何用户没有提供的经历或成果。如果用户背景缺少关键要求，请明确指出。\n\n';
  }

  prompt += '【申请目标】\n';
  prompt += `申请阶段：${input.application.stage}\n`;
  prompt += `目标国家/地区：${input.application.countries.join('、')}\n`;
  prompt += `目标专业：${input.application.targetMajor}\n`;
  if (input.application.targetSchools) {
    prompt += `目标学校：${input.application.targetSchools}\n`;
  }
  prompt += `输出语言：${input.application.outputLanguage === 'english' ? '英文CV' : '中英双语'}\n\n`;

  prompt += '【基础信息】\n';
  if (input.profile.chineseName) prompt += `中文姓名：${input.profile.chineseName}\n`;
  if (input.profile.englishName) prompt += `英文姓名：${input.profile.englishName}\n`;
  if (input.profile.email) prompt += `邮箱：${input.profile.email}\n`;
  if (input.profile.phone) prompt += `电话：${input.profile.phone}\n`;
  if (input.profile.city) prompt += `所在地：${input.profile.city}\n`;
  if (input.profile.linkedin) prompt += `LinkedIn：${input.profile.linkedin}\n`;
  if (input.profile.website) prompt += `个人网站：${input.profile.website}\n`;
  prompt += '\n';

  if (input.education && input.education.length > 0) {
    prompt += '【教育背景】\n';
    input.education.forEach((edu, index) => {
      prompt += `${index + 1}. ${edu.school} - ${edu.major} (${edu.degree})\n`;
      if (edu.gpa) prompt += `   GPA/均分：${edu.gpa}\n`;
      if (edu.startDate && edu.endDate) prompt += `   时间：${edu.startDate} - ${edu.endDate}\n`;
      if (edu.courses) prompt += `   核心课程：${edu.courses}\n`;
      if (edu.awards) prompt += `   排名/奖学金：${edu.awards}\n`;
    });
    prompt += '\n';
  }

  if (input.experiences && input.experiences.length > 0) {
    const typeLabels: Record<string, string> = {
      research: '科研经历',
      internship: '实习经历',
      project: '项目经历',
      activity: '社团/志愿者经历',
      award: '获奖经历',
    };

    prompt += '【经历信息】\n';
    input.experiences.forEach((exp, index) => {
      const typeLabel = typeLabels[exp.type] || exp.type;
      prompt += `${index + 1}. [${typeLabel}] ${exp.title}\n`;
      if (exp.organization) prompt += `   组织：${exp.organization}\n`;
      if (exp.startDate && exp.endDate) prompt += `   时间：${exp.startDate} - ${exp.endDate}\n`;
      prompt += `   详情：${exp.description}\n`;
    });
    prompt += '\n';
  }

  if (input.skills) {
    prompt += `【技能】\n${input.skills}\n\n`;
  }
  if (input.languages) {
    prompt += `【语言能力】\n${input.languages}\n\n`;
  }

  if (input.uploadedResumeText) {
    prompt += '【上传的原始简历内容】\n';
    prompt += input.uploadedResumeText;
  }

  return prompt;
}

export function calculateCompletenessScore(input: ResumeInput): number {
  let score = 0;

  if (input.profile.englishName) score += 5;
  if (input.profile.email) score += 5;
  if (input.profile.phone) score += 5;
  if (input.profile.city) score += 5;

  if (input.education && input.education.length > 0) {
    score += 10;
    if (input.education[0].gpa) score += 10;
    if (input.education[0].courses) score += 5;
    if (input.education[0].awards) score += 5;
  }

  if (input.experiences && input.experiences.length > 0) {
    const types = new Set(input.experiences.map(e => e.type));
    score += Math.min(30, input.experiences.length * 5);
    if (types.has('research')) score += 5;
    if (types.has('internship')) score += 5;
    if (types.has('project')) score += 5;
  }

  if (input.skills) score += 5;
  if (input.languages) score += 5;

  if (input.uploadedResumeText) score += 10;

  return Math.min(100, Math.max(0, score));
}

export function detectMissingFields(input: ResumeInput): string[] {
  const missing: string[] = [];

  if (!input.profile.englishName) missing.push('英文姓名');
  if (!input.profile.email) missing.push('邮箱');

  if (!input.education || input.education.length === 0) {
    missing.push('教育背景');
  } else {
    if (!input.education[0].gpa && !input.education[0].awards) {
      missing.push('GPA或成绩排名');
    }
  }

  if (!input.experiences || input.experiences.length === 0) {
    missing.push('任何经历（科研/实习/项目）');
  }

  if (!input.skills) missing.push('技能列表');
  if (!input.languages) missing.push('语言能力');

  return missing;
}

export function generateSuggestions(input: ResumeInput): string[] {
  const suggestions: string[] = [];

  if (input.application.stage === '硕士') {
    if (input.experiences?.filter(e => e.type === 'project' || e.type === 'research').length === 0) {
      suggestions.push('建议增加科研或项目经历，这对该阶段的申请非常重要');
    }
  }

  if (input.application.stage === '博士') {
    if (!input.experiences?.some(e => e.type === 'research')) {
      suggestions.push('博士申请建议增加科研经历和论文发表情况');
    }
  }

  if (!input.profile.linkedin && !input.profile.website) {
    suggestions.push('建议添加LinkedIn或个人网站链接，增加可信度');
  }

  if (input.education?.[0]?.gpa && input.education[0].gpa.includes('/')) {
    suggestions.push('建议将排名格式统一，如"Top 5%"或"GPA 3.8/4.0"');
  }

  if (input.experiences && input.experiences.length < 3) {
    suggestions.push('建议至少准备3段相关经历，包括科研、实习或项目');
  }

  if (suggestions.length === 0) {
    suggestions.push('信息完整度较好，请确保描述具体、数据化');
  }

  return suggestions;
}

export const MEMBERSHIP_CTA = {
  title: '解锁完整功能',
  features: [
    '无水印PDF下载',
    'Word可编辑版本',
    '多国家申请版本',
    '目标学校定制优化',
    '海外模型高级润色',
  ],
};
