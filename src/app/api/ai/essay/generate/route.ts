/**
 * POST /api/ai/essay/generate
 * AI Essay/小文书生成接口
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateEssay, EssayInput } from '@/lib/ai/essay-generator';
import { withApiProtection } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const body = await request.json() as EssayInput;

    // 验证必填字段
    if (!body.student?.chineseName || !body.student?.englishName) {
      return NextResponse.json(
        { success: false, error: '请填写学生姓名信息' },
        { status: 400 }
      );
    }

    if (!body.contentMaterials?.topic) {
      return NextResponse.json(
        { success: false, error: '请填写Essay题目' },
        { status: 400 }
      );
    }

    // 生成Essay
    const output = generateEssay(body);

    return NextResponse.json({
      success: true,
      data: output,
    });
  });
}
