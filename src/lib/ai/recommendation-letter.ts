/**
 * 推荐信生成相关类型定义
 */

export interface RecommendationLetterInput {
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
  recommender: {
    identity: 'course_teacher' | 'research_mentor' | 'thesis_advisor' | 'internship_supervisor' | 'project_mentor' | 'academic_leader';
    name?: string;
    title?: string;
    institution?: string;
    relationship: string;
    knownDuration: string;
    courseOrProject: string;
    verifiableAbilities: string[];
  };
  contentMaterials: {
    academicAbilityExamples: string[];
    researchAbilityExamples: string[];
    classPerformance: string;
    communicationAbility: string;
    leadershipResponsibility: string;
    englishCrossCulturalAbility?: string;
    keySellingPoints: string[];
    tonePreference: 'steady' | 'positive' | 'strong';
  };
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
  objectives: string;
  careers: string[];
  officialUrl: string;
}

export interface RecommendationLetterOutput {
  documentType: 'recommendation_letter';
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

export const RECOMMENDER_IDENTITY_OPTIONS = [
  { value: 'course_teacher', label: '课程老师' },
  { value: 'research_mentor', label: '科研导师' },
  { value: 'thesis_advisor', label: '论文导师' },
  { value: 'internship_supervisor', label: '实习主管' },
  { value: 'project_mentor', label: '项目导师' },
  { value: 'academic_leader', label: '学院领导' },
];

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

export const IDENTITY_TONE_MAP: Record<string, { intro: string; perspective: string }> = {
  course_teacher: {
    intro: 'I taught [Student]\'s course at [University] and have had the opportunity to observe their academic performance and intellectual curiosity.',
    perspective: 'In my course'
  },
  research_mentor: {
    intro: 'I supervised [Student]\'s research work at [University/Institution], where I have been able to observe their research capabilities and scientific thinking.',
    perspective: 'During the research project'
  },
  thesis_advisor: {
    intro: 'As [Student]\'s thesis advisor, I have worked closely with them on their academic research and writing.',
    perspective: 'In supervising their thesis'
  },
  internship_supervisor: {
    intro: 'I supervised [Student] during their internship at [Company/Institution], where I observed their professional abilities and work attitude.',
    perspective: 'During their internship'
  },
  project_mentor: {
    intro: 'I mentored [Student] in the [Project Name] project, where I observed their technical skills and teamwork abilities.',
    perspective: 'In the project'
  },
  academic_leader: {
    intro: 'In my role as [Title] at [University], I have had the privilege to observe [Student]\'s academic achievements and personal qualities.',
    perspective: 'From my observation'
  }
};
