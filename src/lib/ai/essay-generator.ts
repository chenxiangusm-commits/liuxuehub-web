/**
 * Essay (小文书) 生成器
 * 生成完整英文Essay成稿
 */

import type { EssayInput, EssayOutput } from './document-types';

export { type EssayInput, type EssayOutput };

const TONE_STYLES = {
  steady: {
    opening: 'I',
    conclusion: 'I believe',
  },
  positive: {
    opening: 'Through my experiences',
    conclusion: 'I am confident',
  },
  strong: {
    opening: 'Nothing has shaped my perspective more than',
    conclusion: 'I am convinced',
  },
};

export function generateEssay(
  input: EssayInput
): EssayOutput {
  const { student, contentMaterials, application } = input;

  const studentName = student.englishName;
  const major = student.currentMajor;

  const targetMajor = application.targetMajor || major;
  const targetSchools = application.targetSchools.length > 0
    ? application.targetSchools.join(', ')
    : '[Target Universities]';

  const topic = contentMaterials.topic || application.essayTopic || 'This essay';
  const wordLimit = contentMaterials.wordLimit || 500;

  const tone = TONE_STYLES[contentMaterials.tonePreference] || TONE_STYLES.positive;

  // 生成Essay主体
  let essay = '';

  // Title
  essay += `[Essay Topic: ${topic}]\n`;
  essay += `[Word Count: Approximately ${wordLimit} words]\n\n`;
  essay += `---\n\n`;

  // Opening
  essay += `${tone.opening}, I have come to understand the true meaning of ${contentMaterials.keyMessage || 'growth and learning'}. `;

  // Personal Story
  if (contentMaterials.personalStory) {
    essay += contentMaterials.personalStory;
  } else {
    essay += `This realization did not happen overnight; it was the culmination of experiences that challenged me to look beyond the surface and examine my beliefs, values, and aspirations.`;
  }

  essay += `\n\n`;

  // Relevant Experiences
  if (contentMaterials.relevantExperiences) {
    essay += `Relevant Experiences\n`;
    essay += `-------------------\n`;
    essay += `${contentMaterials.relevantExperiences}\n\n`;
  }

  // Reflection
  if (contentMaterials.reflection) {
    essay += `Reflection and Insights\n`;
    essay += `----------------------\n`;
    essay += `${contentMaterials.reflection}\n\n`;
  }

  // Key Message / Conclusion
  essay += `Conclusion\n`;
  essay += `----------\n`;
  essay += `${tone.conclusion} that this experience has fundamentally changed how I view ${contentMaterials.keyMessage || 'the world and my place in it'}. `;
  essay += `It has taught me that ${contentMaterials.keyMessage || 'true growth comes from stepping outside our comfort zones and embracing new challenges'}. `;
  essay += `Looking ahead, I am excited to apply these lessons as I pursue my studies in ${targetMajor} and work toward my future goals.\n`;

  // Signature
  essay += `\n---\n`;
  essay += `Submitted by ${studentName}\n`;

  // 中文说明
  const chineseSummary = `本Essay参考草稿由AI根据您提供的信息生成，供您参考和修改。

主要内容说明：
1. 标题：包含题目和字数提示
2. 开篇：用一个引人入胜的引子开启主题
3. 个人故事：分享相关的真实经历
4. 反思洞察：从经历中获得的思考和成长
5. 结语：总结核心信息和对未来的展望

使用建议：
• 请根据目标学校的具体题目调整内容
• 添加真实的个人细节和情感
• 确保文章逻辑连贯、情感真实
• 字数可根据要求适当调整`;

  // 亮点
  const highlights = [
    {
      point: '题目解析',
      evidence: `针对"${topic}"进行结构化写作`,
    },
    {
      point: '个人故事',
      evidence: '展示真实的个人经历和情感',
    },
    {
      point: '深度反思',
      evidence: '从经历中提炼洞察和成长',
    },
  ];

  if (contentMaterials.keyMessage) {
    highlights.push({
      point: '核心信息',
      evidence: contentMaterials.keyMessage,
    });
  }

  // 学校匹配说明
  let schoolFit = `本Essay针对申请 ${targetMajor} 专业的学生撰写。`;
  if (application.targetSchools.length > 0) {
    schoolFit += `目标学校包括：${targetSchools}。`;
  }

  // 招生官视角简评
  const admissionsReview = `从招生官视角看，本Essay具有以下特点：

优势：
• 针对具体题目进行写作
• 包含个人故事和真实情感
• 展现反思能力和成长潜力
• 语言表达地道流畅

建议：
• 可根据目标学校数量准备多个版本
• 确保故事真实且细节丰富
• 避免使用过于通用的事例`;

  // 风险提醒
  const riskWarnings = [
    '本内容为参考草稿，需根据个人实际情况修改',
    'Essay必须基于真实经历，切勿编造',
    '不同学校题目可能不同，需分别准备',
    '建议请教专业人士或native speaker润色',
  ];

  // 改进建议
  const improvementSuggestions = [
    '建议添加更多个人化的细节描写',
    '可补充具体的对话或场景',
    '确保语言表达自然流畅',
    '根据目标学校调整文章长度和风格',
  ];

  // 合规声明
  const complianceStatement = [
    '本内容为Essay参考草稿',
    '最终内容请根据真实经历修改',
    '请确保所有故事基于真实事实',
  ];

  // 会员CTA
  const membershipCta = {
    title: '升级会员，下载 Word 可编辑版本',
    features: [
      '完整英文Essay成稿',
      '题目解析与思路',
      '个性化故事设计',
      'Word可编辑下载',
    ],
    upgradeUrl: '/membership',
  };

  return {
    documentType: 'essay',
    title: `Essay Draft: ${topic}`,
    finalDraft: essay,
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
