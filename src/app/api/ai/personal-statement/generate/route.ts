/**
 * POST /api/ai/personal-statement/generate
 * AI个人陈述PS生成接口
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalStatement, PersonalStatementInput } from '@/lib/ai/personal-statement-generator';
import { withApiProtection } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const body = await request.json() as PersonalStatementInput;

    // 验证必填字段
    if (!body.student?.chineseName || !body.student?.englishName) {
      return NextResponse.json(
        { success: false, error: '请填写学生姓名信息' },
        { status: 400 }
      );
    }

    if (!body.student?.currentSchool || !body.student?.currentMajor) {
      return NextResponse.json(
        { success: false, error: '请填写学生学校和专业信息' },
        { status: 400 }
      );
    }

    // 生成PS
    const output = generatePersonalStatement(body);

    return NextResponse.json({
      success: true,
      data: output,
    });
  });
}
