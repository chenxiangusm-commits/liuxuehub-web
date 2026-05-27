/**
 * Motivation Letter (动机信) 生成器
 * 生成完整英文动机信成稿
 */

import type { MotivationLetterInput, MotivationLetterOutput } from './document-types';

export { type MotivationLetterInput, type MotivationLetterOutput };

const TONE_STYLES = {
  steady: {
    opening: 'I am writing to express my interest',
    conclusion: 'I believe',
    confidence: 'would be a valuable addition',
  },
  positive: {
    opening: 'With great enthusiasm, I submit my application',
    conclusion: 'I am confident',
    confidence: 'will make meaningful contributions',
  },
  strong: {
    opening: 'It is with exceptional motivation that I write',
    conclusion: 'I am convinced',
    confidence: 'will exceed all expectations',
  },
};

export function generateMotivationLetter(
  input: MotivationLetterInput
): MotivationLetterOutput {
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

  // 生成动机信主体
  let letter = '';

  // Letterhead placeholder
  letter += `[Your Name]\n`;
  letter += `[Your Address]\n`;
  letter += `[Email: your.email@example.com]\n\n`;

  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  letter += `${dateStr}\n\n`;

  // Recipient
  letter += `Dear Admissions Committee,\n\n`;

  // Opening paragraph
  letter += `${tone.opening} in the ${targetMajor} program at ${targetSchools || 'your esteemed institution'}. As a ${major} student with a strong passion for ${contentMaterials.motivation || 'this field'}, I am eager to contribute to and grow within your academic community.\n\n`;

  // Academic Background
  if (contentMaterials.academicBackground) {
    letter += `Academic Background\n`;
    letter += `-------------------\n`;
    letter += `${contentMaterials.academicBackground}\n`;
    if (gpa !== 'not specified') {
      letter += `My academic performance, with a GPA of ${gpa}, demonstrates my commitment to excellence in my field.\n`;
    }
    letter += `\n`;
  }

  // Relevant Experience
  if (contentMaterials.relevantExperience) {
    letter += `Relevant Experience\n`;
    letter += `-------------------\n`;
    letter += `${contentMaterials.relevantExperience}\n\n`;
  }

  // What You Can Contribute
  if (contentMaterials.whatYouCanContribute) {
    letter += `What I Can Contribute\n`;
    letter += `----------------------\n`;
    letter += `${contentMaterials.whatYouCanContribute}\n\n`;
  }

  // Why This School
  letter += `Why ${targetPrograms}\n`;
  letter += `-------------------\n`;
  if (contentMaterials.whyThisSchool) {
    letter += `${contentMaterials.whyThisSchool}\n\n`;
  } else {
    letter += `I am particularly drawn to your program because of its excellent reputation in ${targetMajor} and its commitment to fostering innovative research. The opportunity to study at ${targetSchools || 'such a prestigious institution'} would provide me with the knowledge and skills necessary to achieve my career aspirations.\n\n`;
  }

  // Career Aspirations
  if (contentMaterials.careerAspirations) {
    letter += `Career Aspirations\n`;
    letter += `------------------\n`;
    letter += `${contentMaterials.careerAspirations}\n\n`;
  }

  // Conclusion
  letter += `Conclusion\n`;
  letter += `----------\n`;
  letter += `${tone.conclusion} that my academic background, relevant experience, and genuine passion for ${targetMajor} ${tone.confidence} to your program. I would be honored to contribute to and learn from the distinguished faculty and talented students at your institution.\n\n`;
  letter += `Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your program.\n\n`;

  // Signature
  letter += `Sincerely,\n\n\n`;
  letter += `${studentName}\n`;
  letter += `[Contact Information]\n`;

  // 中文说明
  const chineseSummary = `本动机信参考草稿由AI根据您提供的信息生成，供您参考和修改。

主要内容说明：
1. 信头：您的联系信息占位
2. 开篇：表明申请意向和动机
3. 学术背景：介绍您的专业学习情况
4. 相关经历：描述与申请专业相关的经验
5. 能提供的贡献：说明您能为学校带来什么
6. 为什么选择该校：阐述您与学校的匹配度
7. 职业规划：分享您的长期发展目标
8. 结语：总结申请动机和期待

使用建议：
• 请填写您真实的联系信息
• 根据目标学校调整具体内容
• 确保表达真实自然，避免过度夸张
• 最终稿建议请专业人士润色`;

  // 亮点
  const highlights = [
    {
      point: '明确申请动机',
      evidence: '清晰阐述为什么选择该项目和学校',
    },
    {
      point: '突出相关经历',
      evidence: '展示与申请专业匹配的经历和能力',
    },
    {
      point: '强调贡献价值',
      evidence: '说明能为学校社区带来什么',
    },
  ];

  if (contentMaterials.relevantExperience) {
    highlights.push({
      point: '经验展示',
      evidence: contentMaterials.relevantExperience.slice(0, 50) + '...',
    });
  }

  // 学校匹配说明
  let schoolFit = `本动机信针对申请 ${targetPrograms} 的学生撰写。`;
  if (application.selectedProgramContext?.objectives) {
    schoolFit += `重点突出与该项目特色相匹配的个人优势和贡献价值。`;
  }

  // 招生官视角简评
  const admissionsReview = `从招生官视角看，本动机信具有以下特点：

优势：
• 使用正式信函格式，符合动机信规范
• 内容针对性强，突出与学校的匹配度
• 包含具体事例支撑，增强说服力
• 语气适中（${contentMaterials.tonePreference === 'strong' ? '强烈推荐' : contentMaterials.tonePreference === 'positive' ? '积极推荐' : '稳健推荐'}）

建议：
• 可根据不同学校调整内容
• 确保个人优势真实可信
• 避免与PS内容高度重复`;

  // 风险提醒
  const riskWarnings = [
    '本内容为参考草稿，需根据个人实际情况修改',
    '请勿直接使用AI生成的内容作为最终稿',
    '动机信应与个人陈述有所区别',
    '建议请教专业人士润色',
  ];

  // 改进建议
  const improvementSuggestions = [
    '建议根据不同学校调整侧重点',
    '可补充更多具体事例支撑',
    '确保语言表达地道专业',
    '检查格式是否符合目标学校要求',
  ];

  // 合规声明
  const complianceStatement = [
    '本内容为动机信参考草稿',
    '最终内容请根据个人实际情况修改',
    '请确保所有信息真实准确',
  ];

  // 会员CTA
  const membershipCta = {
    title: '升级会员，下载 Word 可编辑版本',
    features: [
      '完整英文动机信成稿',
      '院校专业定制',
      '个性化内容优化',
      'Word可编辑下载',
    ],
    upgradeUrl: '/membership',
  };

  return {
    documentType: 'motivation_letter',
    title: `Motivation Letter Draft for ${studentName}`,
    finalDraft: letter,
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
