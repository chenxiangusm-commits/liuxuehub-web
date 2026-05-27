/**
 * 留学申请文书生成相关类型定义
 */

// Personal Statement 类型
export interface PersonalStatementInput {
  application: {
    stage: string;
    countries: string[];
    targetSchools: string[];
    targetMajor: string;
    selectedProgramContext?: SelectedProgramContext;
  };
  student: {
    chineseName: string;
    englishName: string;
    currentSchool: string;
    currentMajor: string;
    gpa?: string;
    applicationDirection: string;
    keyStrengths: string[];
  };
  contentMaterials: {
    backgroundStory: string;
    academicInterest: string;
    academicBackground: string;
    researchExperience: string;
    careerGoals: string;
    whyThisProgram: string;
    keyAchievements: string;
    challenges: string;
    tonePreference: 'steady' | 'positive' | 'strong';
  };
}

export interface PersonalStatementOutput {
  documentType: 'personal_statement';
  title: string;
  finalDraft: string;
  chineseSummary: string;
  highlights: {
    point: string;
    evidence: string;
  }[];
  schoolFit: string;
  admissionsReview: string;
  riskWarnings: string[];
  improvementSuggestions: string[];
  complianceStatement: string[];
  membershipCta: {
    title: string;
    features: string[];
    upgradeUrl: string;
  };
}

// Motivation Letter 类型
export interface MotivationLetterInput {
  application: {
    stage: string;
    countries: string[];
    targetSchools: string[];
    targetMajor: string;
    selectedProgramContext?: SelectedProgramContext;
  };
  student: {
    chineseName: string;
    englishName: string;
    currentSchool: string;
    currentMajor: string;
    gpa?: string;
    applicationDirection: string;
    keyStrengths: string[];
  };
  contentMaterials: {
    motivation: string;
    relevantExperience: string;
    academicBackground: string;
    careerAspirations: string;
    whyThisSchool: string;
    whatYouCanContribute: string;
    tonePreference: 'steady' | 'positive' | 'strong';
  };
}

export interface MotivationLetterOutput {
  documentType: 'motivation_letter';
  title: string;
  finalDraft: string;
  chineseSummary: string;
  highlights: {
    point: string;
    evidence: string;
  }[];
  schoolFit: string;
  admissionsReview: string;
  riskWarnings: string[];
  improvementSuggestions: string[];
  complianceStatement: string[];
  membershipCta: {
    title: string;
    features: string[];
    upgradeUrl: string;
  };
}

// Essay 类型
export interface EssayInput {
  application: {
    stage?: string;
    targetSchools: string[];
    targetMajor: string;
    essayTopic?: string;
  };
  student: {
    chineseName: string;
    englishName: string;
    currentSchool: string;
    currentMajor: string;
  };
  contentMaterials: {
    topic: string;
    personalStory: string;
    relevantExperiences: string;
    reflection: string;
    keyMessage: string;
    wordLimit?: number;
    tonePreference: 'steady' | 'positive' | 'strong';
  };
}

export interface EssayOutput {
  documentType: 'essay';
  title: string;
  finalDraft: string;
  chineseSummary: string;
  highlights: {
    point: string;
    evidence: string;
  }[];
  schoolFit: string;
  admissionsReview: string;
  riskWarnings: string[];
  improvementSuggestions: string[];
  complianceStatement: string[];
  membershipCta: {
    title: string;
    features: string[];
    upgradeUrl: string;
  };
}

// 共享类型
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
  objectives: string;
  careers: string[];
  officialUrl: string;
}

// 常量选项
export const TONE_PREFERENCE_OPTIONS = [
  { value: 'steady', label: '稳健（客观陈述为主）' },
  { value: 'positive', label: '积极（适度正面评价）' },
  { value: 'strong', label: '强烈（突出优势，表达信心）' },
];

export const STAGE_OPTIONS = [
  { value: '本科', label: '本科' },
  { value: '硕士', label: '硕士' },
  { value: '博士', label: '博士' },
  { value: '交换', label: '交换生' },
  { value: '暑校', label: '暑期学校' },
];

export const COUNTRY_OPTIONS = [
  { value: '香港', label: '香港' },
  { value: '英国', label: '英国' },
  { value: '澳洲', label: '澳洲' },
  { value: '新加坡', label: '新加坡' },
  { value: '美国', label: '美国' },
  { value: '加拿大', label: '加拿大' },
  { value: '欧洲', label: '欧洲' },
];
