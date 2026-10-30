/**
 * POST /api/ai/essay/generate
 * Server-side DeepSeek essay draft generation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { EssayInput, EssayOutput } from '@/lib/ai/essay-generator';
import { withApiProtection } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';
const DEEPSEEK_MODEL = 'deepseek-chat';

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const body = await request.json() as EssayInput;
    const validationError = validateEssayInput(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: '文书生成服务尚未配置，请联系管理员。' },
        { status: 500 }
      );
    }

    const prompt = buildEssayPrompt(body);
    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: [
              '你是资深留学文书顾问，擅长生成真实、克制、可编辑的申请文书初稿。',
              '不要编造奖项、学校、成绩或经历；缺失信息用“[请补充具体信息]”提示。',
              '输出应以英文文书初稿为主，并附上简短中文修改说明。',
            ].join('\n'),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2200,
      }),
    });

    const data = await response.json().catch(() => null) as DeepSeekChatResponse | null;

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `DeepSeek 请求失败：${data?.error?.message || response.statusText || '请稍后重试。'}`,
        },
        { status: 502 }
      );
    }

    const draft = data?.choices?.[0]?.message?.content?.trim();
    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'DeepSeek 未返回有效文书内容，请稍后重试。' },
        { status: 502 }
      );
    }

    const output = buildEssayOutput(body, draft);

    return NextResponse.json({
      success: true,
      data: output,
    });
  });
}

function validateEssayInput(input: EssayInput): string | null {
  const targetSchools = input.application?.targetSchools || [];
  const targetMajor = input.application?.targetMajor?.trim();
  const currentMajor = input.student?.currentMajor?.trim();
  const background = [
    input.student?.currentSchool,
    input.student?.currentMajor,
    input.contentMaterials?.personalStory,
    input.contentMaterials?.relevantExperiences,
    input.contentMaterials?.reflection,
    input.contentMaterials?.keyMessage,
  ].filter(Boolean).join(' ').trim();

  if (!background && !targetMajor && targetSchools.length === 0) {
    return '请至少填写个人背景、申请方向和目标学校中的关键信息。';
  }

  if (!background) {
    return '请填写个人背景或相关经历，AI 才能生成有针对性的文书初稿。';
  }

  if (!targetMajor && !currentMajor) {
    return '请填写申请方向或当前专业。';
  }

  if (targetSchools.length === 0) {
    return '请填写至少一所目标学校。';
  }

  return null;
}

function buildEssayPrompt(input: EssayInput): string {
  const { application, student, contentMaterials } = input;
  const targetSchools = application.targetSchools.join(', ');
  const wordLimit = contentMaterials.wordLimit || 650;

  return [
    `请根据以下信息生成一篇英文留学申请 Essay / Personal Statement 初稿，长度约 ${wordLimit} 词。`,
    '',
    '申请信息：',
    `- 目标学校：${targetSchools}`,
    `- 申请方向/专业：${application.targetMajor || student.currentMajor || '未填写'}`,
    `- Essay 题目：${contentMaterials.topic || application.essayTopic || '通用个人陈述'}`,
    '',
    '学生背景：',
    `- 中文名：${student.chineseName || '未填写'}`,
    `- 英文名：${student.englishName || '未填写'}`,
    `- 当前学校：${student.currentSchool || '未填写'}`,
    `- 当前专业：${student.currentMajor || '未填写'}`,
    '',
    '写作素材：',
    `- 个人故事/背景：${contentMaterials.personalStory || '未填写'}`,
    `- 相关经历：${contentMaterials.relevantExperiences || '未填写'}`,
    `- 反思与成长：${contentMaterials.reflection || '未填写'}`,
    `- 核心信息：${contentMaterials.keyMessage || '未填写'}`,
    `- 语气偏好：${contentMaterials.tonePreference || 'positive'}`,
    '',
    '输出要求：',
    '1. 先输出英文文书初稿。',
    '2. 再输出“中文修改说明”，用 3-5 点说明如何继续个性化。',
    '3. 不要编造未提供的具体数字、奖项、实习公司或论文。',
    '4. 如果信息不足，用 [请补充具体信息] 作为占位。',
  ].join('\n');
}

function buildEssayOutput(input: EssayInput, draft: string): EssayOutput {
  const topic = input.contentMaterials.topic || input.application.essayTopic || 'Personal Statement';
  const targetSchools = input.application.targetSchools.join(', ');
  const targetMajor = input.application.targetMajor || input.student.currentMajor || '目标专业';

  return {
    documentType: 'essay',
    title: `Essay Draft: ${topic}`,
    finalDraft: draft,
    chineseSummary: [
      '这是一篇由 DeepSeek 根据你填写的信息生成的文书初稿。',
      '请务必基于真实经历继续修改，不要直接提交 AI 原文。',
      `当前版本面向：${targetSchools} / ${targetMajor}。`,
    ].join('\n'),
    highlights: [
      {
        point: '申请方向明确',
        evidence: `围绕 ${targetMajor} 展开文书主线。`,
      },
      {
        point: '目标学校已纳入上下文',
        evidence: targetSchools,
      },
      {
        point: '保留可编辑空间',
        evidence: '信息不足处会以占位提示补充，便于后续人工润色。',
      },
    ],
    schoolFit: `本初稿面向 ${targetSchools} 的 ${targetMajor} 申请，可继续补充具体课程、教授、项目特色和职业目标。`,
    admissionsReview: '从招生官视角看，下一步应重点补充更具体的个人经历、量化成果和与目标项目的匹配细节。',
    riskWarnings: [
      '请不要直接提交 AI 生成原文。',
      '请核对所有经历、学校、项目和时间线是否真实准确。',
      '如出现占位符，请先补充真实细节后再使用。',
    ],
    improvementSuggestions: [
      '补充 1-2 个具体经历细节。',
      '加入目标学校课程或项目特色。',
      '压缩空泛表达，强化个人动机。',
    ],
    complianceStatement: [
      '本文书为参考初稿。',
      '最终提交版本应由申请人基于真实经历修改完成。',
      '不得编造背景、成绩、奖项或推荐信息。',
    ],
    membershipCta: {
      title: '升级会员，获取完整文书优化服务',
      features: [
        '多版本文书润色',
        '学校匹配角度优化',
        'Word/PDF 导出',
      ],
      upgradeUrl: '/membership',
    },
  };
}
