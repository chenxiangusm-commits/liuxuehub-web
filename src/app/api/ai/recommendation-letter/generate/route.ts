/**
 * POST /api/ai/recommendation-letter/generate
 * AI推荐信参考草稿生成接口
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendationLetter, RecommendationLetterInput } from '@/lib/ai/recommendation-letter-generator';
import { withApiProtection } from '@/lib/api-helpers';

const USE_MOCK = process.env.AI_RESUME_USE_MOCK === 'true';

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const body = await request.json() as RecommendationLetterInput;

    // 验证必填字段
    if (!body.student?.chineseName || !body.student?.englishName) {
      return NextResponse.json(
        { success: false, error: '请填写学生姓名信息' },
        { status: 400 }
      );
    }

    if (!body.recommender?.relationship || !body.recommender?.courseOrProject) {
      return NextResponse.json(
        { success: false, error: '请填写推荐人信息和关系' },
        { status: 400 }
      );
    }

    // 使用 mock 模式或实际生成
    if (USE_MOCK) {
      const output = generateRecommendationLetter(body);
      
      return NextResponse.json({
        success: true,
        data: output,
      });
    }

    // TODO: 集成实际 AI 模型生成
    // 目前使用 mock 生成
    const output = generateRecommendationLetter(body);
    
    return NextResponse.json({
      success: true,
      data: output,
    });
  });
}
