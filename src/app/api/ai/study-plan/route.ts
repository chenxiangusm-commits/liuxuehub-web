import { NextRequest, NextResponse } from "next/server";
import { getClientIp, withApiProtection } from "@/lib/api-helpers";
import { generateWithModel } from "@/lib/ai/model-provider";
import type { StudyPlanResult } from "@/lib/ai/studyPlanMock";

const MAX_FIELD_LENGTH = 1200;
const MAX_TOTAL_INPUT_LENGTH = 5000;
const STUDY_PLAN_WINDOW_MS = 60 * 1000;
const STUDY_PLAN_MAX_REQUESTS = 5;

// TODO: Beta 后如果部署到多实例/多区域，改用 Redis/Upstash 做全局限流。
const studyPlanRequests = new Map<string, { count: number; resetTime: number }>();

interface StudyPlanRequest {
  degreeLevel?: string;
  targetRegions?: string[];
  targetMajor?: string;
  schoolBackground?: string;
  gpa?: string;
  language?: string;
  greGmat?: string;
  experiences?: string;
  goals?: string;
}

const SYSTEM_PROMPT = [
  "你是资深留学规划顾问，服务对象是留学顾问和留学机构。",
  "你要根据中国学生背景，生成一份可供顾问初步沟通使用的留学规划书。",
  "必须保守、可信、结构化。",
  "不能承诺录取。",
  "不能编造具体官网政策。",
  "如果信息不足，必须写“建议补充确认”。",
  "所有学校和专业建议必须附带风险提示。",
  "输出必须是 JSON，不要 Markdown，不要代码块，不要解释。",
].join("\n");

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    const rateLimit = checkStudyPlanRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { success: false, error: "请求过于频繁，请稍后再试" },
        { status: 429 }
      );
      response.headers.set("Retry-After", rateLimit.retryAfter.toString());
      return response;
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { success: false, error: "AI服务暂未配置，请联系管理员。" },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => null)) as StudyPlanRequest | null;

    if (!body) {
      return NextResponse.json({ success: false, error: "请求格式不正确" }, { status: 400 });
    }

    const validationError = validateInput(body);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const result = await generateWithModel({
      provider: "deepseek",
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(sanitizeInput(body)),
      temperature: 0.35,
      responseFormat: "json",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "AI规划书生成失败，请稍后重试。",
        },
        { status: 500 }
      );
    }

    const data = normalizeStudyPlanResult(result.data);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "AI返回内容格式不稳定，请稍后重试。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  });
}

function checkStudyPlanRateLimit(ip: string | null) {
  const key = ip || "unknown";
  const now = Date.now();
  const current = studyPlanRequests.get(key);

  if (!current || now > current.resetTime) {
    studyPlanRequests.set(key, { count: 1, resetTime: now + STUDY_PLAN_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= STUDY_PLAN_MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetTime - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function validateInput(input: StudyPlanRequest): string | null {
  if (!input.degreeLevel) return "请选择申请阶段。";
  if (!input.targetMajor?.trim()) return "请填写目标专业方向。";
  if (!input.targetRegions || input.targetRegions.length === 0) return "请至少选择一个目标地区。";
  const totalLength = [
    input.degreeLevel,
    ...(input.targetRegions || []),
    input.targetMajor,
    input.schoolBackground,
    input.gpa,
    input.language,
    input.greGmat,
    input.experiences,
    input.goals,
  ].reduce((sum, item) => sum + (item || "").length, 0);
  if (totalLength > MAX_TOTAL_INPUT_LENGTH) return "输入内容过长，请精简后再生成规划书。";
  if (!input.gpa?.trim() && !input.language?.trim() && !input.experiences?.trim()) {
    return "请至少填写 GPA、语言成绩或经历中的一项，方便生成规划。";
  }
  return null;
}

function cleanText(value?: string) {
  return (value || "").slice(0, MAX_FIELD_LENGTH).trim();
}

function sanitizeInput(input: StudyPlanRequest): Required<StudyPlanRequest> {
  return {
    degreeLevel: cleanText(input.degreeLevel),
    targetRegions: (input.targetRegions || []).slice(0, 6).map((item) => cleanText(item)).filter(Boolean),
    targetMajor: cleanText(input.targetMajor),
    schoolBackground: cleanText(input.schoolBackground),
    gpa: cleanText(input.gpa),
    language: cleanText(input.language),
    greGmat: cleanText(input.greGmat),
    experiences: cleanText(input.experiences),
    goals: cleanText(input.goals),
  };
}

function buildUserPrompt(input: Required<StudyPlanRequest>) {
  return [
    "请基于以下学生背景，生成稳定 JSON：",
    `申请阶段：${input.degreeLevel}`,
    `目标地区：${input.targetRegions.join("、")}`,
    `目标专业方向：${input.targetMajor}`,
    `学校背景：${input.schoolBackground || "建议补充确认"}`,
    `GPA/均分：${input.gpa || "建议补充确认"}`,
    `语言成绩：${input.language || "建议补充确认"}`,
    `GRE/GMAT：${input.greGmat || "无或待确认"}`,
    `实习/科研/竞赛/项目经历：${input.experiences || "建议补充确认"}`,
    `申请目标和偏好：${input.goals || "建议补充确认"}`,
    "",
    "请严格输出以下 JSON 结构，所有数组至少 2 项，学校建议必须包含 risk：",
    JSON.stringify({
      studentProfile: {
        summary: "",
        strengths: [],
        weaknesses: [],
        competitivenessScore: 0,
      },
      schoolStrategy: {
        reach: [{ school: "", program: "", reason: "", risk: "" }],
        match: [{ school: "", program: "", reason: "", risk: "" }],
        safe: [{ school: "", program: "", reason: "", risk: "" }],
      },
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },
      timeline: [{ stage: "", time: "", tasks: [] }],
      actionPlan: [{ priority: "高/中/低", action: "", reason: "" }],
      riskNotes: [],
      advisorNotes: [],
      disclaimer: "AI生成内容仅作规划参考，最终以学校官网和顾问审核为准。",
    }),
  ].join("\n");
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function normalizePlanList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 5).map((item) => {
    const row = item as Partial<Record<keyof StudyPlanResult["schoolStrategy"]["reach"][number], unknown>>;
    return {
      school: String(row.school || "建议补充确认"),
      program: String(row.program || "建议补充确认"),
      reason: String(row.reason || "建议补充确认"),
      risk: String(row.risk || "建议补充确认"),
    };
  });
}

function normalizeStudyPlanResult(raw: unknown): StudyPlanResult | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Partial<StudyPlanResult>;
  const score = Number(source.studentProfile?.competitivenessScore || 0);

  return {
    studentProfile: {
      summary: String(source.studentProfile?.summary || "建议补充确认学生背景后生成完整画像。"),
      strengths: asStringArray(source.studentProfile?.strengths),
      weaknesses: asStringArray(source.studentProfile?.weaknesses),
      competitivenessScore: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0,
    },
    schoolStrategy: {
      reach: normalizePlanList(source.schoolStrategy?.reach),
      match: normalizePlanList(source.schoolStrategy?.match),
      safe: normalizePlanList(source.schoolStrategy?.safe),
    },
    swot: {
      strengths: asStringArray(source.swot?.strengths),
      weaknesses: asStringArray(source.swot?.weaknesses),
      opportunities: asStringArray(source.swot?.opportunities),
      threats: asStringArray(source.swot?.threats),
    },
    timeline: Array.isArray(source.timeline)
      ? source.timeline.slice(0, 8).map((item) => ({
          stage: String(item.stage || "申请规划"),
          time: String(item.time || "建议补充确认"),
          tasks: asStringArray(item.tasks),
        }))
      : [],
    actionPlan: Array.isArray(source.actionPlan)
      ? source.actionPlan.slice(0, 8).map((item) => ({
          priority: item.priority === "高" || item.priority === "中" || item.priority === "低" ? item.priority : "中",
          action: String(item.action || "建议补充确认"),
          reason: String(item.reason || "建议补充确认"),
        }))
      : [],
    riskNotes: asStringArray(source.riskNotes),
    advisorNotes: asStringArray(source.advisorNotes),
    disclaimer: "AI生成内容仅作规划参考，最终以学校官网和顾问审核为准。",
  };
}
