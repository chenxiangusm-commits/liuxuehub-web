/**
 * POST /api/ai/resume/generate
 * AI留学申请简历生成接口
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateWithModel } from '@/lib/ai/model-provider';
import {
  ResumeInput,
  RESUME_SYSTEM_PROMPT,
  buildResumePrompt,
  SelectedProgramContext,
} from '@/lib/ai/resume';
import {
  generateWritingStrategy,
  generateDocumentOutput,
  COMPLIANCE_DECLARATIONS,
  COMPLIANCE_DISCLAIMERS,
  MEMBERSHIP_FEATURES,
  WritingStrategy,
  DocumentDraft,
  DocumentReview,
} from '@/lib/ai/writing-strategy';
import { withApiProtection } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

const USE_MOCK = process.env.AI_RESUME_USE_MOCK === 'true';
const MODEL_PROVIDER = process.env.AI_MODEL_PROVIDER || 'qwen';

export interface EnhancedResumeOutput {
  documentType: 'cv';
  strategy: WritingStrategy;
  draft: DocumentDraft;
  review: DocumentReview;
  complianceStatement: {
    declarations: string[];
    disclaimers: string[];
    verificationRequired: boolean;
  };
  membershipCta: {
    title: string;
    description: string;
    features: string[];
    upgradeUrl: string;
  };
}

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const body = await request.json();
    const { profile, education, experiences, skills, languages, uploadedResumeText, selectedProgramContext } = body as {
      profile: ResumeInput['profile'];
      education: ResumeInput['education'];
      experiences: ResumeInput['experiences'];
      skills?: string;
      languages?: string;
      uploadedResumeText?: string;
      selectedProgramContext?: SelectedProgramContext;
    };

    if (!profile || !education || education.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少必填信息：基础信息和教育背景' },
        { status: 400 }
      );
    }

    const input: ResumeInput = {
      application: body.application || {
        stage: '硕士',
        countries: ['英国', '香港'],
        targetMajor: '',
        outputLanguage: 'english',
      },
      profile,
      education,
      experiences: experiences || [],
      skills,
      languages,
      uploadedResumeText,
      selectedProgramContext,
    };

    if (USE_MOCK) return NextResponse.json({success:false,error:'当前为演示配置，请先启用真实生成服务。'},{status:503});

    const provider = MODEL_PROVIDER as 'qwen' | 'deepseek' | 'doubao' | 'kimi' | 'openai' | 'claude';
    const result = await generateWithModel({
      provider,
      systemPrompt: RESUME_SYSTEM_PROMPT,
      userPrompt: buildResumePrompt(input),
      temperature: 0.7,
      responseFormat: 'json',
    });

    if (!result.success) return NextResponse.json({success:false,error:'简历生成暂时失败，你填写的资料仍保留，请稍后重试。'},{status:502});
    const draftText=(result.data as {cv?:string})?.cv;
    if(typeof draftText!=='string'||!draftText.trim())return NextResponse.json({success:false,error:'未收到完整简历，请稍后重试。'},{status:502});

    const strategy = generateWritingStrategy(input);
    
    const output: EnhancedResumeOutput = {
      documentType: 'cv',
      strategy,
      draft: {
        draftId: `draft-${Date.now()}`,
        documentType: 'cv',
        title: selectedProgramContext 
          ? `CV - ${selectedProgramContext.majorEn}` 
          : 'Curriculum Vitae',
        finalDraft: draftText,
        sections: [],
        wordCount: 0,
        tone: 'Professional',
        language: 'english'
      },
      review: {
        reviewId: `review-${Date.now()}`,
        draftId: '',
        admissionsOfficerPerspective: [],
        strengths: [],
        areasForImprovement: [{suggestion:'核对日期、成绩、职责和成果；只保留可证明的经历。',priority:'high',rationale:'生成稿需要由申请人逐项确认。',example:''}],
        complianceCheck: [],
        optimizedVersion: (result.data as { cv?: string })?.cv || '',
        overallRating: 0,
        confidenceScore: 0
      },
      complianceStatement: {
        declarations: COMPLIANCE_DECLARATIONS,
        disclaimers: COMPLIANCE_DISCLAIMERS,
        verificationRequired: true
      },
      membershipCta: {
        title: '解锁完整功能',
        description: '获取完整文书下载和高级优化服务',
        features: MEMBERSHIP_FEATURES,
        upgradeUrl: '/membership'
      }
    };

    return NextResponse.json({
      success: true,
      data: output,
    });
  });
}

function generateMockCV(input: ResumeInput, program?: SelectedProgramContext): string {
  const name = input.profile.englishName || input.profile.chineseName || 'Your Name';
  const email = input.profile.email || 'email@example.com';
  const phone = input.profile.phone || '';
  const city = input.profile.city || '';

  let cv = `Name: ${name}\n`;
  cv += `Email: ${email}\n`;
  if (phone) cv += `Phone: ${phone}\n`;
  if (city) cv += `Location: ${city}\n`;
  if (input.profile.linkedin) cv += `LinkedIn: ${input.profile.linkedin}\n`;
  if (input.profile.website) cv += `Website: ${input.profile.website}\n`;

  if (program) {
    cv += `\n=== TARGET PROGRAM ===\n`;
    cv += `${program.schoolNameEn}\n`;
    cv += `${program.majorEn}\n`;
    cv += `Degree: ${program.degree}\n`;
    cv += `Duration: ${program.duration}\n`;
  }

  cv += '\n=== EDUCATION ===\n';
  input.education.forEach(edu => {
    cv += `${edu.school}\n`;
    cv += `${edu.major}, ${edu.degree}\n`;
    if (edu.startDate || edu.endDate) {
      cv += `${edu.startDate || ''} - ${edu.endDate || ''}\n`;
    }
    if (edu.gpa) cv += `GPA: ${edu.gpa}\n`;
    if (edu.courses) cv += `Relevant Courses: ${edu.courses}\n`;
    if (edu.awards) cv += `Awards: ${edu.awards}\n`;
    cv += '\n';
  });

  if (input.experiences && input.experiences.length > 0) {
    cv += '=== EXPERIENCE ===\n';
    input.experiences.forEach(exp => {
      cv += `${exp.title}\n`;
      if (exp.organization) cv += `${exp.organization}\n`;
      if (exp.startDate || exp.endDate) {
        cv += `${exp.startDate || ''} - ${exp.endDate || ''}\n`;
      }
      cv += `${exp.description}\n\n`;
    });
  }

  if (input.skills) {
    cv += '=== SKILLS ===\n';
    cv += `${input.skills}\n\n`;
  }

  if (input.languages) {
    cv += '=== LANGUAGE ===\n';
    cv += `${input.languages}\n`;
  }

  return cv;
}
