/**
 * 推荐信参考草稿生成器
 * 生成完整英文推荐信，供推荐人审阅、修改和确认后使用
 */

import type { RecommendationLetterInput, RecommendationLetterOutput } from './recommendation-letter';

export { type RecommendationLetterInput, type RecommendationLetterOutput };

const IDENTITY_LABELS: Record<string, string> = {
  course_teacher: 'Course Instructor',
  research_mentor: 'Research Supervisor',
  thesis_advisor: 'Thesis Advisor',
  internship_supervisor: 'Internship Supervisor',
  project_mentor: 'Project Mentor',
  academic_leader: 'Academic Leader',
};

const IDENTITY_PERSPECTIVE: Record<string, { phrase: string; context: string }> = {
  course_teacher: { 
    phrase: 'In my course', 
    context: 'taught' 
  },
  research_mentor: { 
    phrase: 'During the research project', 
    context: 'supervised' 
  },
  thesis_advisor: { 
    phrase: 'As their thesis advisor', 
    context: 'advised' 
  },
  internship_supervisor: { 
    phrase: 'During their internship', 
    context: 'supervised' 
  },
  project_mentor: { 
    phrase: 'In the project', 
    context: 'mentored' 
  },
  academic_leader: { 
    phrase: 'From my observations', 
    context: 'observed' 
  },
};

const TONE_STYLES = {
  steady: {
    opening: 'I am pleased to write this letter of recommendation',
    conclusion: 'I recommend',
    confidence: 'believe',
  },
  positive: {
    opening: 'It is with great pleasure that I write this letter of recommendation',
    conclusion: 'I strongly recommend',
    confidence: 'confidently recommend',
  },
  strong: {
    opening: 'I am writing this letter with the highest enthusiasm to recommend',
    conclusion: 'I give my highest recommendation',
    confidence: 'without reservation',
  },
};

export function generateRecommendationLetter(
  input: RecommendationLetterInput
): RecommendationLetterOutput {
  const { student, recommender, contentMaterials, application } = input;
  
  const studentName = student.englishName;
  const studentChineseName = student.chineseName;
  const school = student.currentSchool;
  const major = student.currentMajor;
  const gpa = student.gpa || 'not specified';
  const direction = student.applicationDirection || major;
  
  const recommenderIdentity = recommender.identity;
  const recommenderName = recommender.name || '[Recommender Name]';
  const recommenderTitle = recommender.title || '[Recommender Title]';
  const recommenderInstitution = recommender.institution || school;
  const identityLabel = IDENTITY_LABELS[recommenderIdentity] || 'Instructor';
  const perspective = IDENTITY_PERSPECTIVE[recommenderIdentity] || IDENTITY_PERSPECTIVE.course_teacher;
  
  const tone = TONE_STYLES[contentMaterials.tonePreference] || TONE_STYLES.positive;
  
  const targetMajor = application.targetMajor || direction;
  const targetPrograms = application.selectedProgramContext 
    ? `${application.selectedProgramContext.majorEn} at ${application.selectedProgramContext.schoolNameEn}`
    : targetMajor;
  
  // 生成推荐信主体
  let letter = '';
  
  // Letterhead 占位符
  letter += `[${recommenderInstitution}]\n`;
  letter += `[Department/Institution Address]\n\n\n`;
  
  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  letter += `${dateStr}\n\n`;
  
  // Salutation
  letter += `Dear Admissions Committee,\n\n`;
  
  // Introduction - 与学生关系
  letter += `${tone.opening} for ${studentName} (${studentChineseName}), whom I have ${perspective.context} in my capacity as ${identityLabel} at ${school}. I have known ${studentName} for ${recommender.knownDuration || 'a significant period of time'}, during which I have had the opportunity to observe their academic abilities, research potential, and personal qualities.\n\n`;
  
  // 推荐人教授的课程或项目
  letter += `During my association with ${studentName}, I had the privilege of ${perspective.context} them in ${recommender.courseOrProject}. This experience has given me substantial insight into their intellectual capabilities, work ethic, and character.\n\n`;
  
  // 学术/专业能力
  letter += `Academic and Professional Abilities\n`;
  letter += `--------------------------------\n`;
  
  if (contentMaterials.academicAbilityExamples.length > 0) {
    letter += `${perspective.phrase} on ${recommender.courseOrProject.split(',')[0]}, ${studentName} consistently demonstrated exceptional academic abilities. `;
    letter += contentMaterials.academicAbilityExamples.slice(0, 2).join('. ') + '.';
    if (gpa !== 'not specified') {
      letter += ` Their academic performance, reflected in a GPA of ${gpa}, places them among the top students I have taught.`;
    }
    letter += `\n\n`;
  }
  
  // 科研/项目能力
  if (contentMaterials.researchAbilityExamples.length > 0) {
    letter += `${perspective.phrase}, ${studentName} exhibited remarkable research capabilities. `;
    letter += contentMaterials.researchAbilityExamples.slice(0, 2).join('. ') + '.';
    letter += ` They demonstrated strong analytical thinking, problem-solving skills, and the ability to independently conduct scholarly work.\n\n`;
  }
  
  // 具体事例 1
  if (contentMaterials.academicAbilityExamples.length > 0) {
    letter += `Specific Example 1\n`;
    letter += `-----------------\n`;
    letter += `${perspective.phrase}, one particular instance stands out in my memory. ${contentMaterials.academicAbilityExamples[0]}\n\n`;
  }
  
  // 具体事例 2
  if (contentMaterials.researchAbilityExamples.length > 0) {
    letter += `Specific Example 2\n`;
    letter += `-----------------\n`;
    letter += `Another notable example of ${studentName}'s abilities can be seen in their work on ${contentMaterials.researchAbilityExamples[0]}\n\n`;
  }
  
  // 个人品质和潜力
  letter += `Personal Qualities and Potential\n`;
  letter += `-------------------------------\n`;
  
  if (contentMaterials.classPerformance) {
    letter += `${perspective.phrase}, ${studentName} demonstrated excellent class participation and intellectual curiosity. ${contentMaterials.classPerformance}\n\n`;
  }
  
  if (contentMaterials.communicationAbility) {
    letter += `${studentName} possesses outstanding communication and collaboration skills. ${contentMaterials.communicationAbility}\n\n`;
  }
  
  if (contentMaterials.leadershipResponsibility) {
    letter += `${studentName} has shown remarkable leadership and sense of responsibility. ${contentMaterials.leadershipResponsibility}\n\n`;
  }
  
  // 与目标项目的匹配
  letter += `Fit for the Target Program\n`;
  letter += `--------------------------\n`;
  letter += `Based on my observations, I believe ${studentName} is exceptionally well-suited for the ${targetPrograms} program. `;
  
  const keyPoints = contentMaterials.keySellingPoints.length > 0 
    ? contentMaterials.keySellingPoints.slice(0, 3).join(', ')
    : 'academic abilities and research potential';
  letter += `Their ${keyPoints} align perfectly with what this program seeks in candidates. `;
  
  if (application.selectedProgramContext?.objectives) {
    letter += `The program's focus on ${application.selectedProgramContext.objectives} resonates strongly with ${studentName}'s academic interests and career aspirations.`;
  }
  letter += `\n\n`;
  
  // 明确推荐结论
  letter += `Conclusion\n`;
  letter += `----------\n`;
  letter += `${tone.conclusion} ${studentName} for admission to your program without hesitation. `;
  letter += `I ${tone.confidence} that ${studentName} will make significant contributions to your academic community and will uphold the high standards of your institution.\n\n`;
  
  letter += `Please do not hesitate to contact me if you require any further information.\n\n`;
  
  // 签名
  letter += `Sincerely,\n\n\n`;
  letter += `${recommenderName}\n`;
  letter += `${recommenderTitle}\n`;
  if (recommenderInstitution) {
    letter += `${recommenderInstitution}\n`;
  }
  letter += `\n[Contact Information - to be provided by recommender]\n`;
  
  // 生成中文说明
  const chineseSummary = `本推荐信参考草稿由AI根据您提供的信息生成，供推荐人参考。

主要内容说明：
1. 信件结构：包含推荐人信息、日期、称谓、正文、结尾和签名区域
2. 关系描述：说明推荐人与您的关系以及认识时长
3. 能力评价：基于您提供的学术能力、科研能力等素材
4. 具体事例：包含您提供的1-2个具体事例作为佐证
5. 项目匹配：说明您与目标项目的匹配度
6. 推荐结论：表达对您的推荐态度（语气已根据您的选择调整）

使用建议：
• 请将本草稿发送给推荐人审阅
• 推荐人应根据自身观察补充或修改内容
• 签名和联系方式必须由推荐人本人确认
• 最终提交前请确保所有信息准确无误`;

  // 生成亮点
  const highlights = [];
  
  if (contentMaterials.academicAbilityExamples.length > 0) {
    highlights.push({
      point: '学术能力突出',
      evidence: contentMaterials.academicAbilityExamples[0],
    });
  }
  
  if (contentMaterials.researchAbilityExamples.length > 0) {
    highlights.push({
      point: '科研潜力明显',
      evidence: contentMaterials.researchAbilityExamples[0],
    });
  }
  
  if (contentMaterials.classPerformance) {
    highlights.push({
      point: '课堂表现优秀',
      evidence: contentMaterials.classPerformance.slice(0, 50) + '...',
    });
  }
  
  if (contentMaterials.leadershipResponsibility) {
    highlights.push({
      point: '具备领导力',
      evidence: contentMaterials.leadershipResponsibility.slice(0, 50) + '...',
    });
  }
  
  // 学校匹配说明
  let schoolFit = `本推荐信针对申请 ${targetPrograms} 的学生撰写。`;
  
  if (application.selectedProgramContext?.curriculum && application.selectedProgramContext.curriculum.length > 0) {
    schoolFit += `重点突出了与该项目课程设置相关的学术能力，包括：${application.selectedProgramContext.curriculum.slice(0, 3).join('、')}等领域。`;
  }
  
  if (application.selectedProgramContext?.careers && application.selectedProgramContext.careers.length > 0) {
    schoolFit += `同时强调了在${application.selectedProgramContext.careers[0]}方向的发展潜力。`;
  }
  
  // 招生官视角简评
  const admissionsReview = `从招生官视角看，本推荐信具有以下特点：
  
优势：
• 使用推荐人第一人称视角，符合正式推荐信格式
• 包含具体事例而非空泛评价，增强了可信度
• 涵盖学术能力、科研潜力、个人品质等多维度评价
• 语气适中（${contentMaterials.tonePreference === 'strong' ? '强烈推荐' : contentMaterials.tonePreference === 'positive' ? '积极推荐' : '稳健推荐'}），符合目标国家/地区的偏好

建议：
• 推荐人可根据实际情况调整具体表述
• 确保所有评价有真实观察作为支撑
• 补充推荐人个人背景以增强说服力`;

  // 风险提醒
  const riskWarnings = [
    '本内容为参考草稿，需由推荐人审阅确认后方可使用',
    '请勿伪造推荐人签名或联系方式',
    '所有评价必须基于真实观察到的经历，不得编造',
    '部分内容可能需要根据目标学校的具体要求调整',
    '建议推荐人添加更多个人化的观察细节',
  ];
  
  // 改进建议
  const improvementSuggestions = [
    '建议推荐人补充1-2个您可能不了解的具体事例',
    '如有可能，建议添加推荐人在该领域的学术成就介绍',
    '请确保推荐信上的联系方式准确且推荐人会及时查收',
    '可根据目标学校数量调整信件长度和侧重点',
  ];
  
  // 合规声明
  const complianceStatement = [
    '本内容为推荐信参考草稿',
    '最终内容需由推荐人审阅、修改和确认',
    '请勿伪造推荐人身份、签名或联系方式',
    '请确保所有经历和评价基于真实事实',
  ];
  
  // 会员CTA
  const membershipCta = {
    title: '升级会员，下载 Word 可编辑版本',
    features: [
      '完整英文推荐信草稿',
      '推荐人视角优化',
      '目标学校专业定制',
      'Word可编辑下载',
    ],
    upgradeUrl: '/membership',
  };

  return {
    documentType: 'recommendation_letter',
    title: `Recommendation Letter Draft for ${studentName}`,
    finalDraft: letter,
    chineseSummary,
    highlights: highlights.length > 0 ? highlights : [{ point: '提供个性化评价', evidence: '基于您提供的信息生成' }],
    schoolFit,
    admissionsReview,
    riskWarnings,
    improvementSuggestions,
    complianceStatement,
    membershipCta,
  };
}
