/**
 * Personal Statement (个人陈述) 生成器
 * 生成完整英文PS成稿
 */

import type { PersonalStatementInput, PersonalStatementOutput } from './document-types';

export { type PersonalStatementInput, type PersonalStatementOutput };

const TONE_STYLES = {
  steady: {
    opening: 'I am writing to express my strong interest',
    conclusion: 'I believe',
    confidence: 'would be a valuable addition',
  },
  positive: {
    opening: 'I am thrilled to submit my application',
    conclusion: 'I am confident',
    confidence: 'will make significant contributions',
  },
  strong: {
    opening: 'With tremendous enthusiasm, I write to apply',
    conclusion: 'I am absolutely convinced',
    confidence: 'will exceed every expectation',
  },
};

export function generatePersonalStatement(
  input: PersonalStatementInput
): PersonalStatementOutput {
  const { student, contentMaterials, application } = input;

  const studentName = student.englishName;
  const major = student.currentMajor;
  const gpa = student.gpa || 'not specified';
  const direction = student.applicationDirection || major;

  const targetMajor = application.targetMajor || direction;
  const targetPrograms = application.selectedProgramContext
    ? `${application.selectedProgramContext.majorEn} at ${application.selectedProgramContext.schoolNameEn}`
    : targetMajor;
  const targetSchools = application.targetSchools.length > 0
    ? application.targetSchools.join(', ')
    : '[Target Universities]';

  const tone = TONE_STYLES[contentMaterials.tonePreference] || TONE_STYLES.positive;

  // 生成PS主体
  let ps = '';

  // Opening paragraph
  ps += `${tone.opening} for the ${targetMajor} program at your esteemed institution. As a final-year student majoring in ${major} at ${student.currentSchool}, I have developed a deep passion for ${contentMaterials.academicInterest || 'this field'}, and I am eager to further my academic journey at your university.\n\n`;

  // Academic Background
  if (contentMaterials.academicBackground || contentMaterials.backgroundStory) {
    ps += `Academic Background\n`;
    ps += `-------------------\n`;
    if (contentMaterials.backgroundStory) {
      ps += `${contentMaterials.backgroundStory}\n\n`;
    }
    if (contentMaterials.academicBackground) {
      ps += `My academic journey in ${major} has provided me with a solid foundation. ${contentMaterials.academicBackground}`;
      if (gpa !== 'not specified') {
        ps += ` My GPA of ${gpa} reflects my consistent dedication to academic excellence.`;
      }
      ps += `\n\n`;
    }
  }

  // Research Experience
  if (contentMaterials.researchExperience) {
    ps += `Research Experience\n`;
    ps += `-------------------\n`;
    ps += `${contentMaterials.researchExperience}\n\n`;
  }

  // Key Achievements
  if (contentMaterials.keyAchievements) {
    ps += `Key Achievements\n`;
    ps += `----------------\n`;
    ps += `${contentMaterials.keyAchievements}\n\n`;
  }

  // Personal Qualities / Challenges Overcome
  if (contentMaterials.challenges) {
    ps += `Personal Growth and Challenges\n`;
    ps += `-----------------------------\n`;
    ps += `${contentMaterials.challenges}\n\n`;
  }

  // Career Goals
  if (contentMaterials.careerGoals) {
    ps += `Career Goals\n`;
    ps += `------------\n`;
    ps += `${contentMaterials.careerGoals}\n\n`;
  }

  // Why This Program
  ps += `Why ${targetPrograms}\n`;
  ps += `-------------------\n`;
  if (contentMaterials.whyThisProgram) {
    ps += `${contentMaterials.whyThisProgram}\n\n`;
  } else {
    ps += `I am particularly drawn to your program's focus on ${application.selectedProgramContext?.objectives || 'academic excellence and research opportunities'} and believe it aligns perfectly with my academic interests and career aspirations. The opportunity to study at ${targetSchools || 'your esteemed institution'} would be invaluable in helping me achieve my goals.\n\n`;
  }

  // Conclusion
  ps += `Conclusion\n`;
  ps += `----------\n`;
  ps += `${tone.conclusion} that my academic background, research experience, and personal qualities ${tone.confidence} to your program. I am excited about the prospect of contributing to and learning from the vibrant academic community at your university.\n\n`;
  ps += `Thank you for considering my application. I look forward to the opportunity to discuss my candidacy further.\n\n`;
  ps += `Sincerely,\n`;
  ps += `${studentName}\n`;

  // 中文说明
  const chineseSummary = `本个人陈述参考草稿由AI根据您提供的信息生成，供您参考和修改。

主要内容说明：
1. 开篇：表明申请意向和背景
2. 学术背景：介绍您的专业学习和成绩
3. 研究经历：描述相关科研或项目经验
4. 关键成就：展示您的学术或专业成就
5. 个人成长：分享挑战和成长经历
6. 职业目标：阐述您的长期发展规划
7. 为什么选择该项目：说明您与项目的匹配度
8. 结语：总结您的优势和申请动机

使用建议：
• 请根据个人实际情况修改具体内容
• 可添加或删除相关章节
• 确保所有信息准确无误
• 最终稿建议请专业人士润色`;

  // 亮点
  const highlights = [
    {
      point: '个性化开篇',
      evidence: '从学术兴趣出发，表明申请动机',
    },
    {
      point: '结构清晰',
      evidence: '包含学术背景、研究经历、职业目标等完整结构',
    },
    {
      point: '针对性强',
      evidence: `针对${targetMajor}专业和目标院校定制`,
    },
  ];

  if (contentMaterials.keyAchievements) {
    highlights.push({
      point: '成就展示',
      evidence: contentMaterials.keyAchievements.slice(0, 50) + '...',
    });
  }

  // 学校匹配说明
  let schoolFit = `本个人陈述针对申请 ${targetPrograms} 的学生撰写。`;
  if (application.selectedProgramContext?.objectives) {
    schoolFit += `重点突出与该项目培养目标相匹配的学术能力和职业规划。`;
  }

  // 招生官视角简评
  const admissionsReview = `从招生官视角看，本个人陈述具有以下特点：

优势：
• 使用第一人称视角，符合正式PS格式
• 包含个人故事和具体事例，增强了个人形象
• 结构清晰，涵盖学术、经历、目标等多维度
• 语气适中（${contentMaterials.tonePreference === 'strong' ? '强烈推荐' : contentMaterials.tonePreference === 'positive' ? '积极推荐' : '稳健推荐'}）

建议：
• 可根据目标学校数量调整内容长度
• 确保个人故事真实可信
• 避免过度夸张或夸大其词`;

  // 风险提醒
  const riskWarnings = [
    '本内容为参考草稿，需根据个人实际情况修改',
    '请勿直接使用AI生成的内容作为最终稿',
    '所有经历和成就必须基于真实事实',
    '建议请教专业人士或native speaker润色',
  ];

  // 改进建议
  const improvementSuggestions = [
    '建议添加更多个人化的故事细节',
    '可补充具体的数据或成果支撑',
    '确保语言表达地道流畅',
    '根据不同学校调整侧重点',
  ];

  // 合规声明
  const complianceStatement = [
    '本内容为个人陈述参考草稿',
    '最终内容请根据个人实际情况修改',
    '请确保所有信息真实准确',
  ];

  // 会员CTA
  const membershipCta = {
    title: '升级会员，下载 Word 可编辑版本',
    features: [
      '完整英文PS成稿',
      '个性化故事线设计',
      '目标学校专业定制',
      'Word可编辑下载',
    ],
    upgradeUrl: '/membership',
  };

  return {
    documentType: 'personal_statement',
    title: `Personal Statement Draft for ${studentName}`,
    finalDraft: ps,
    chineseSummary,
    highlights,
    schoolFit,
    admissionsReview,
    riskWarnings,
    improvementSuggestions,
    complianceStatement,
    membershipCta,
  };
}
