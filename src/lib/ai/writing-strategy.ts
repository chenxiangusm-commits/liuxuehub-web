/**
 * 留学文书写作策略模块
 * 负责根据用户背景和目标项目制定写作策略
 */

import type { ResumeInput, SelectedProgramContext } from './resume';

export interface WritingStrategy {
  strategyId: string;
  targetProgram: SelectedProgramContext | null;
  userStrengths: string[];
  keyThemes: string[];
  contentStructure: StrategySection[];
  toneRecommendation: string;
  wordCountTarget: {
    min: number;
    max: number;
  };
  focusAreas: string[];
  avoidPoints: string[];
  alignmentAnalysis: AlignmentAnalysis;
}

export interface StrategySection {
  sectionId: string;
  title: string;
  purpose: string;
  keyPoints: string[];
  suggestedContent: string;
}

export interface AlignmentAnalysis {
  overallFitScore: number;
  programRequirements: ProgramRequirement[];
  userMatch: UserMatch[];
  gaps: GapAnalysis[];
  recommendations: StrategyRecommendation[];
}

export interface ProgramRequirement {
  category: string;
  requirement: string;
  importance: 'high' | 'medium' | 'low';
}

export interface UserMatch {
  category: string;
  userStrength: string;
  matchScore: number;
  supportingEvidence: string;
}

export interface GapAnalysis {
  category: string;
  gapDescription: string;
  gapSeverity: 'critical' | 'significant' | 'minor';
  suggestedAction: string;
}

export interface StrategyRecommendation {
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  rationale: string;
}

export interface DocumentDraft {
  draftId: string;
  documentType: 'ps' | 'cv' | 'recommendation' | 'motivation' | 'essay';
  title: string;
  finalDraft: string;
  sections: DraftSection[];
  wordCount: number;
  tone: string;
  language: 'english' | 'chinese' | 'bilingual';
}

export interface DraftSection {
  sectionId: string;
  title: string;
  content: string;
  wordCount: number;
  purpose: string;
}

export interface DocumentReview {
  reviewId: string;
  draftId: string;
  admissionsOfficerPerspective: AdmissionsOfficerComment[];
  strengths: ReviewStrength[];
  areasForImprovement: ImprovementSuggestion[];
  complianceCheck: ComplianceIssue[];
  optimizedVersion: string;
  overallRating: number;
  confidenceScore: number;
}

export interface AdmissionsOfficerComment {
  category: string;
  comment: string;
  rating: number;
  explanation: string;
}

export interface ReviewStrength {
  strength: string;
  impact: 'high' | 'medium' | 'low';
  evidence: string;
}

export interface ImprovementSuggestion {
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  example: string;
}

export interface ComplianceIssue {
  issueType: 'warning' | 'error';
  description: string;
  location: string;
  suggestedFix: string;
}

export interface DocumentOutput {
  documentType: 'ps' | 'cv' | 'recommendation' | 'motivation' | 'essay';
  strategy: WritingStrategy;
  draft: DocumentDraft;
  review: DocumentReview;
  complianceStatement: ComplianceStatement;
  membershipCta: MembershipCta;
}

export interface ComplianceStatement {
  declarations: string[];
  disclaimers: string[];
  verificationRequired: boolean;
}

export interface MembershipCta {
  title: string;
  description: string;
  features: string[];
  upgradeUrl: string;
}

export const COMPLIANCE_DECLARATIONS = [
  '本文书由AI辅助生成，所有内容基于用户提供的真实信息',
  '未编造任何用户未提供的经历或成就',
  '未伪造推荐人信息（如适用）',
  '未对录取结果做出任何承诺或保证',
];

export const COMPLIANCE_DISCLAIMERS = [
  '最终文书需经用户审核确认，确保信息真实准确',
  '推荐信草稿需由推荐人审阅并签署后方可提交',
  '学校招生委员会拥有最终录取决定权',
  '本工具仅提供写作辅助，不保证任何录取结果',
];

export const CV_COMPLIANCE_DECLARATIONS = [
  '内容基于用户提供信息生成',
  '不编造经历',
  '请提交前自行核对真实性',
];

export const CV_COMPLIANCE_DISCLAIMERS = [
  '本工具仅提供写作辅助，不保证任何录取结果',
];

export const MEMBERSHIP_FEATURES = [
  '完整英文成稿下载',
  '目标学校/专业定制优化',
  'Word/PDF多格式导出',
  '多版本生成对比',
  '招生官视角深度审阅',
  '无限次生成',
];

export function generateWritingStrategy(
  input: ResumeInput
): WritingStrategy {
  const { education, experiences, selectedProgramContext } = input;
  
  const userStrengths: string[] = [];
  const keyThemes: string[] = [];
  
  if (education.length > 0 && education[0].gpa) {
    userStrengths.push('学术成绩优秀');
    keyThemes.push('学术能力');
  }
  
  const hasResearch = experiences.some(e => e.type === 'research');
  const hasInternship = experiences.some(e => e.type === 'internship');
  const hasProject = experiences.some(e => e.type === 'project');
  
  if (hasResearch) {
    userStrengths.push('科研能力突出');
    keyThemes.push('研究潜力');
  }
  if (hasInternship) {
    userStrengths.push('实践经验丰富');
    keyThemes.push('职业准备');
  }
  if (hasProject) {
    userStrengths.push('项目经验丰富');
    keyThemes.push('动手能力');
  }
  
  if (selectedProgramContext) {
    keyThemes.push(selectedProgramContext.majorCn);
    if (selectedProgramContext.careers && selectedProgramContext.careers.length > 0) {
      keyThemes.push(...selectedProgramContext.careers.slice(0, 2));
    }
  }
  
  const contentStructure: StrategySection[] = [
    {
      sectionId: 'introduction',
      title: 'Introduction',
      purpose: 'Hook the reader and state your academic/professional goals',
      keyPoints: ['Clear thesis statement', 'Personal motivation', 'Connection to program'],
      suggestedContent: `Start with a compelling opening that connects your background to ${selectedProgramContext?.majorCn || 'your chosen field'}.`
    },
    {
      sectionId: 'academic-background',
      title: 'Academic Background',
      purpose: 'Demonstrate your academic preparation',
      keyPoints: ['Relevant coursework', 'Academic achievements', 'Intellectual curiosity'],
      suggestedContent: `Highlight key courses and academic projects that prepare you for ${selectedProgramContext?.majorCn || 'graduate study'}.`
    },
    {
      sectionId: 'experience-highlights',
      title: 'Experience Highlights',
      purpose: 'Showcase relevant experiences',
      keyPoints: ['Research/projects', 'Internships', 'Leadership'],
      suggestedContent: 'Focus on 2-3 most impactful experiences with specific achievements.'
    },
    {
      sectionId: 'program-fit',
      title: 'Program Fit',
      purpose: 'Explain why this specific program',
      keyPoints: ['Specific program features', 'Faculty alignment', 'Resources'],
      suggestedContent: `Connect your goals to ${selectedProgramContext?.schoolName || 'the program'}'s strengths and resources.`
    },
    {
      sectionId: 'conclusion',
      title: 'Conclusion',
      purpose: 'Reinforce your fit and future goals',
      keyPoints: ['Summary of fit', 'Future aspirations', 'Closing statement'],
      suggestedContent: 'End with a strong closing that ties everything together.'
    }
  ];
  
  const alignmentAnalysis = selectedProgramContext 
    ? analyzeProgramAlignment(input, selectedProgramContext)
    : {
        overallFitScore: 70,
        programRequirements: [],
        userMatch: [],
        gaps: [],
        recommendations: []
      };
  
  return {
    strategyId: `strategy-${Date.now()}`,
    targetProgram: selectedProgramContext || null,
    userStrengths,
    keyThemes,
    contentStructure,
    toneRecommendation: 'Professional yet personal, confident but not arrogant',
    wordCountTarget: { min: 500, max: 800 },
    focusAreas: keyThemes,
    avoidPoints: [
      'Generic statements without specific examples',
      'Overly casual language',
      'Exaggerated claims without evidence',
      'Clichéd phrases',
    ],
    alignmentAnalysis,
  };
}

function analyzeProgramAlignment(
  input: ResumeInput,
  program: SelectedProgramContext
): AlignmentAnalysis {
  const requirements: ProgramRequirement[] = [];
  const userMatches: UserMatch[] = [];
  const gaps: GapAnalysis[] = [];
  const recommendations: StrategyRecommendation[] = [];
  
  if (program.ielts && program.ielts !== '待确认') {
    requirements.push({
      category: 'Language Proficiency',
      requirement: `IELTS ${program.ielts}`,
      importance: 'high'
    });
  }
  
  if (program.toefl && program.toefl !== '待确认') {
    requirements.push({
      category: 'Language Proficiency',
      requirement: `TOEFL ${program.toefl}`,
      importance: 'high'
    });
  }
  
  if (program.subjectRequirement) {
    requirements.push({
      category: 'Academic Prerequisites',
      requirement: program.subjectRequirement,
      importance: 'high'
    });
  }
  
  if (program.requirementDetail) {
    requirements.push({
      category: 'Admission Requirements',
      requirement: program.requirementDetail,
      importance: 'medium'
    });
  }
  
  if (input.education.length > 0) {
    const edu = input.education[0];
    userMatches.push({
      category: 'Academic Background',
      userStrength: `${edu.school} - ${edu.major}`,
      matchScore: edu.gpa ? (parseFloat(edu.gpa) >= 3.5 ? 90 : parseFloat(edu.gpa) >= 3.0 ? 75 : 60) : 70,
      supportingEvidence: edu.gpa ? `GPA: ${edu.gpa}` : 'Degree completed'
    });
  }
  
  const hasRelevantExperience = input.experiences.some(e => 
    e.type === 'research' || e.type === 'project'
  );
  
  if (hasRelevantExperience) {
    userMatches.push({
      category: 'Practical Experience',
      userStrength: hasRelevantExperience ? 'Research/project experience' : 'Work experience',
      matchScore: input.experiences.filter(e => e.type === 'research' || e.type === 'project').length >= 2 ? 85 : 70,
      supportingEvidence: `${input.experiences.length} experiences documented`
    });
  }
  
  if (!input.languages) {
    gaps.push({
      category: 'Language Proficiency',
      gapDescription: 'Language test scores not provided',
      gapSeverity: 'significant',
      suggestedAction: 'Add IELTS/TOEFL scores if available'
    });
  }
  
  if (input.experiences.length < 2) {
    gaps.push({
      category: 'Experience Depth',
      gapDescription: 'Limited experience documented',
      gapSeverity: 'minor',
      suggestedAction: 'Add more detailed project or research experiences'
    });
  }
  
  recommendations.push({
    priority: 'high',
    recommendation: `Emphasize alignment with ${program.majorCn} curriculum`,
    rationale: 'Show clear fit with program requirements'
  });
  
  if (program.objectives) {
    recommendations.push({
      priority: 'medium',
      recommendation: 'Connect personal goals to program objectives',
      rationale: 'Demonstrate shared vision with the program'
    });
  }
  
  let matchScore = 65;
  
  if (userMatches.length > 0 && requirements.length > 0) {
    matchScore = Math.min(100, Math.max(0, 
      userMatches.reduce((acc, m) => acc + m.matchScore, 0) / userMatches.length * 0.6 + 
      (requirements.length - gaps.length) / requirements.length * 40
    ));
  } else if (userMatches.length > 0) {
    matchScore = Math.min(100, Math.max(0, userMatches.reduce((acc, m) => acc + m.matchScore, 0) / userMatches.length * 0.8 + 15));
  }
  
  return {
    overallFitScore: Math.round(matchScore),
    programRequirements: requirements,
    userMatch: userMatches,
    gaps,
    recommendations
  };
}

export function generateDocumentOutput(
  input: ResumeInput
): DocumentOutput {
  const strategy = generateWritingStrategy(input);
  const draft = generateCvDraft(input);
  const review = generateReview(input, draft);
  
  return {
    documentType: 'cv',
    strategy,
    draft,
    review,
    complianceStatement: {
      declarations: CV_COMPLIANCE_DECLARATIONS,
      disclaimers: CV_COMPLIANCE_DISCLAIMERS,
      verificationRequired: false
    },
    membershipCta: {
      title: '解锁完整功能',
      description: '获取完整文书下载和高级优化服务',
      features: MEMBERSHIP_FEATURES,
      upgradeUrl: '/membership'
    }
  };
}

export function generateCvDraft(
  input: ResumeInput
): DocumentDraft {
  const { profile, education, experiences, skills, languages, selectedProgramContext } = input;
  
  const name = profile.englishName || profile.chineseName || 'Your Name';
  
  let finalDraft = `${name}\n`;
  if (profile.email) finalDraft += `Email: ${profile.email}\n`;
  if (profile.phone) finalDraft += `Phone: ${profile.phone}\n`;
  if (profile.city) finalDraft += `Location: ${profile.city}\n`;
  if (profile.linkedin) finalDraft += `LinkedIn: ${profile.linkedin}\n`;
  if (profile.website) finalDraft += `Website: ${profile.website}\n`;
  
  if (selectedProgramContext) {
    finalDraft += `\nTarget Program: ${selectedProgramContext.majorEn} | ${selectedProgramContext.schoolNameEn}\n`;
  }
  
  finalDraft += '\n=== EDUCATION ===\n';
  if (education.length > 0) {
    education.forEach(edu => {
      finalDraft += `${edu.school}\n`;
      finalDraft += `${edu.major}, ${edu.degree}\n`;
      if (edu.startDate && edu.endDate) {
        finalDraft += `${edu.startDate} - ${edu.endDate}\n`;
      } else if (edu.startDate) {
        finalDraft += `${edu.startDate} - Present\n`;
      }
      if (edu.gpa) finalDraft += `GPA: ${edu.gpa}\n`;
      if (edu.courses) finalDraft += `Relevant Coursework: ${edu.courses}\n`;
      if (edu.awards) finalDraft += `Honors: ${edu.awards}\n`;
      finalDraft += '\n';
    });
  }
  
  const researchExperiences = experiences.filter(e => e.type === 'research');
  if (researchExperiences.length > 0) {
    finalDraft += '=== RESEARCH EXPERIENCE ===\n';
    researchExperiences.forEach(exp => {
      finalDraft += `${exp.title}\n`;
      if (exp.organization) finalDraft += `${exp.organization}\n`;
      if (exp.startDate && exp.endDate) {
        finalDraft += `${exp.startDate} - ${exp.endDate}\n`;
      }
      finalDraft += `${exp.description}\n\n`;
    });
  }
  
  const internshipExperiences = experiences.filter(e => e.type === 'internship');
  if (internshipExperiences.length > 0) {
    finalDraft += '=== INTERNSHIP EXPERIENCE ===\n';
    internshipExperiences.forEach(exp => {
      finalDraft += `${exp.title}\n`;
      if (exp.organization) finalDraft += `${exp.organization}\n`;
      if (exp.startDate && exp.endDate) {
        finalDraft += `${exp.startDate} - ${exp.endDate}\n`;
      }
      finalDraft += `${exp.description}\n\n`;
    });
  }
  
  const projectExperiences = experiences.filter(e => e.type === 'project');
  if (projectExperiences.length > 0) {
    finalDraft += '=== PROJECT EXPERIENCE ===\n';
    projectExperiences.forEach(exp => {
      finalDraft += `${exp.title}\n`;
      if (exp.organization) finalDraft += `${exp.organization}\n`;
      if (exp.startDate && exp.endDate) {
        finalDraft += `${exp.startDate} - ${exp.endDate}\n`;
      }
      finalDraft += `${exp.description}\n\n`;
    });
  }
  
  const activityExperiences = experiences.filter(e => e.type === 'activity');
  if (activityExperiences.length > 0) {
    finalDraft += '=== LEADERSHIP & ACTIVITIES ===\n';
    activityExperiences.forEach(exp => {
      finalDraft += `${exp.title}\n`;
      if (exp.organization) finalDraft += `${exp.organization}\n`;
      if (exp.startDate && exp.endDate) {
        finalDraft += `${exp.startDate} - ${exp.endDate}\n`;
      }
      finalDraft += `${exp.description}\n\n`;
    });
  }
  
  const awardExperiences = experiences.filter(e => e.type === 'award');
  if (awardExperiences.length > 0) {
    finalDraft += '=== HONORS & AWARDS ===\n';
    awardExperiences.forEach(exp => {
      finalDraft += `${exp.title}\n`;
      if (exp.organization) finalDraft += `${exp.organization}\n`;
      if (exp.startDate) finalDraft += `${exp.startDate}\n`;
      finalDraft += `${exp.description}\n\n`;
    });
  }
  
  if (skills) {
    finalDraft += '=== SKILLS ===\n';
    finalDraft += `${skills}\n\n`;
  }
  
  if (languages) {
    finalDraft += '=== LANGUAGES ===\n';
    finalDraft += `${languages}\n`;
  }
  
  return {
    draftId: `draft-${Date.now()}`,
    documentType: 'cv',
    title: selectedProgramContext 
      ? `CV - ${selectedProgramContext.majorEn}` 
      : 'Curriculum Vitae',
    finalDraft,
    sections: [],
    wordCount: finalDraft.split(' ').length,
    tone: 'Professional',
    language: 'english'
  };
}

function generateReview(
  input: ResumeInput,
  draft: DocumentDraft
): DocumentReview {
  const strengths: ReviewStrength[] = [];
  const improvements: ImprovementSuggestion[] = [];
  const complianceIssues: ComplianceIssue[] = [];
  
  strengths.push({
    strength: 'Clear structure and flow',
    impact: 'high',
    evidence: 'The document follows a logical progression from introduction to conclusion'
  });
  
  strengths.push({
    strength: 'Program alignment demonstrated',
    impact: 'high',
    evidence: 'Clear connection between applicant background and program requirements'
  });
  
  if (input.experiences.length > 0) {
    strengths.push({
      strength: 'Relevant experience included',
      impact: 'medium',
      evidence: 'Applicant has documented practical experiences'
    });
  }
  
  improvements.push({
    suggestion: 'Add more specific examples and quantifiable achievements',
    priority: 'high',
    rationale: 'Specific examples make your story more compelling and credible',
    example: 'Instead of "improved efficiency", say "increased process efficiency by 30%"'
  });
  
  improvements.push({
    suggestion: 'Highlight unique contributions in experiences',
    priority: 'medium',
    rationale: 'Show what made your work stand out from others',
    example: 'Describe specific challenges overcome or innovations introduced'
  });
  
  if (!input.languages) {
    complianceIssues.push({
      issueType: 'warning',
      description: 'Language proficiency information not provided',
      location: 'Personal profile',
      suggestedFix: 'Add IELTS/TOEFL scores if available'
    });
  }
  
  const officerComments: AdmissionsOfficerComment[] = [
    {
      category: 'Overall Impression',
      comment: 'Strong academic background with clear motivation',
      rating: 8,
      explanation: 'The applicant demonstrates good preparation and clear goals'
    },
    {
      category: 'Program Fit',
      comment: 'Good alignment with program requirements',
      rating: 7,
      explanation: 'Applicant shows understanding of program strengths'
    },
    {
      category: 'Writing Quality',
      comment: 'Well-written and professional',
      rating: 8,
      explanation: 'Clear communication with proper structure'
    }
  ];
  
  return {
    reviewId: `review-${Date.now()}`,
    draftId: draft.draftId,
    admissionsOfficerPerspective: officerComments,
    strengths,
    areasForImprovement: improvements,
    complianceCheck: complianceIssues,
    optimizedVersion: draft.finalDraft,
    overallRating: 8,
    confidenceScore: 85
  };
}
