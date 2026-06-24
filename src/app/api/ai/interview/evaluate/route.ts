import { NextRequest, NextResponse } from "next/server";
import { withApiProtection } from "@/lib/api-helpers";
import { generateWithModel, getDefaultProviderForTool } from "@/lib/ai/model-provider";

export const dynamic = "force-dynamic";

const MAX_FIELD_LENGTH = 800;
const MAX_ANSWER_LENGTH = 4000;

interface InterviewEvaluateInput {
  targetSchool?: string;
  targetProgram?: string;
  degreeLevel?: string;
  interviewType?: string;
  question?: string;
  studentAnswer?: string;
  transcript?: string;
}

interface InterviewEvaluation {
  overallScore: number;
  fluencyScore: number;
  logicScore: number;
  relevanceScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  followUpQuestion: string;
  finalAdvice: string;
}

const allowedDegreeLevels = new Set(["本科", "硕士"]);
const allowedInterviewTypes = new Set(["入学面试", "奖学金面试", "英文口语训练"]);

export async function GET() {
  return NextResponse.json({
    success: false,
    message: "AI 面试官评分接口仅支持 POST 请求。请在页面中提交英文回答，或使用 curl/Postman 测试。",
    page: "/ai/interview",
    method: "POST",
    requiredFields: [
      "targetSchool",
      "targetProgram",
      "degreeLevel",
      "interviewType",
      "question",
      "studentAnswer",
    ],
  });
}

function cleanText(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
}

function clampScore(value: unknown) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.max(0, Math.min(100, Math.round(numberValue)));
}

function normalizeList(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) {
    const items = value.map((item) => cleanText(item, 260)).filter(Boolean).slice(0, 5);
    if (items.length > 0) return items;
  }

  const text = cleanText(value, 600);
  return text ? [text] : fallback;
}

function normalizeEvaluation(data: unknown): InterviewEvaluation {
  const raw = (data && typeof data === "object" ? data : {}) as Partial<InterviewEvaluation>;

  return {
    overallScore: clampScore(raw.overallScore),
    fluencyScore: clampScore(raw.fluencyScore),
    logicScore: clampScore(raw.logicScore),
    relevanceScore: clampScore(raw.relevanceScore),
    confidenceScore: clampScore(raw.confidenceScore),
    strengths: normalizeList(raw.strengths, ["回答覆盖了问题核心，但仍建议补充更具体的个人经历。"]),
    weaknesses: normalizeList(raw.weaknesses, ["回答细节和结构仍可加强，建议使用 Problem-Action-Result 结构。"]),
    improvedAnswer:
      cleanText(raw.improvedAnswer, 2400) ||
      "I would structure my answer more clearly by linking my academic background, project experience and future goals to this programme.",
    followUpQuestion:
      cleanText(raw.followUpQuestion, 600) ||
      "Can you give a specific example of an experience that prepared you for this programme?",
    finalAdvice:
      cleanText(raw.finalAdvice, 1000) ||
      "下一轮练习建议先用 20 秒给出结论，再用 1-2 个具体经历支撑，最后回到目标专业和职业规划。",
  };
}

function validateInput(input: InterviewEvaluateInput) {
  const targetSchool = cleanText(input.targetSchool);
  const targetProgram = cleanText(input.targetProgram);
  const degreeLevel = cleanText(input.degreeLevel, 20);
  const interviewType = cleanText(input.interviewType, 30);
  const question = cleanText(input.question, 1200);
  const studentAnswer = cleanText(input.studentAnswer || input.transcript, MAX_ANSWER_LENGTH);

  if (!targetSchool) return { error: "请填写目标学校" };
  if (!targetProgram) return { error: "请填写目标专业" };
  if (!allowedDegreeLevels.has(degreeLevel)) return { error: "请选择本科或硕士" };
  if (!allowedInterviewTypes.has(interviewType)) return { error: "请选择面试类型" };
  if (!question) return { error: "请先生成或填写面试问题" };
  if (!studentAnswer) return { error: "请填写英文回答" };
  if (studentAnswer.length < 40) return { error: "回答过短，请至少输入 40 个英文字符" };

  return {
    data: {
      targetSchool,
      targetProgram,
      degreeLevel,
      interviewType,
      question,
      studentAnswer,
    },
  };
}

function buildSystemPrompt() {
  return [
    "You are a senior admissions interview coach for international university applications.",
    "Your users are Chinese students and study-abroad advisors preparing English admission interviews.",
    "Evaluate the student's English answer based on content, logic, relevance, clarity and confidence.",
    "Do not claim that you performed real acoustic pronunciation or video analysis.",
    "Be strict but constructive. Do not invent personal facts not provided by the student.",
    "Return only valid JSON. No markdown, no code block, no extra commentary.",
    "All score fields must be integers from 0 to 100.",
    "strengths and weaknesses must be arrays of concise Chinese bullet points.",
    "improvedAnswer must be a polished English answer that keeps the student's original facts.",
    "followUpQuestion must be one realistic English follow-up question.",
    "finalAdvice must be concise Chinese advice for the next practice round.",
    "The JSON keys must be exactly: overallScore, fluencyScore, logicScore, relevanceScore, confidenceScore, strengths, weaknesses, improvedAnswer, followUpQuestion, finalAdvice.",
  ].join("\n");
}

function buildUserPrompt(input: NonNullable<ReturnType<typeof validateInput>["data"]>) {
  return [
    "Please evaluate this interview answer and return the required JSON object.",
    "",
    `Target school: ${input.targetSchool}`,
    `Target program: ${input.targetProgram}`,
    `Degree level: ${input.degreeLevel}`,
    `Interview type: ${input.interviewType}`,
    `Interview question: ${input.question}`,
    "",
    "Student answer:",
    input.studentAnswer,
  ].join("\n");
}

function isEvaluationUsable(evaluation: InterviewEvaluation) {
  return (
    evaluation.overallScore > 0 &&
    evaluation.fluencyScore > 0 &&
    evaluation.logicScore > 0 &&
    evaluation.relevanceScore > 0 &&
    evaluation.confidenceScore > 0 &&
    evaluation.strengths.length > 0 &&
    evaluation.weaknesses.length > 0 &&
    Boolean(evaluation.improvedAnswer) &&
    Boolean(evaluation.followUpQuestion) &&
    Boolean(evaluation.finalAdvice)
  );
}

function buildFallbackEvaluation(
  input: NonNullable<ReturnType<typeof validateInput>["data"]>,
): InterviewEvaluation {
  const answerLength = input.studentAnswer.length;
  const hasSpecificExample =
    /\b(project|internship|research|competition|leadership|team|data|finance|analysis|experience|case)\b/i.test(
      input.studentAnswer,
    );
  const hasClearMotivation =
    /\b(because|therefore|so that|goal|career|future|interested|passion|want to|plan to)\b/i.test(
      input.studentAnswer,
    );

  const relevanceScore = hasClearMotivation ? 78 : 68;
  const logicScore = hasSpecificExample ? 76 : 66;
  const fluencyScore = answerLength > 220 ? 76 : 68;
  const confidenceScore = answerLength > 160 && hasSpecificExample ? 74 : 65;
  const overallScore = Math.round((relevanceScore + logicScore + fluencyScore + confidenceScore) / 4);

  return {
    overallScore,
    fluencyScore,
    logicScore,
    relevanceScore,
    confidenceScore,
    strengths: [
      "回答能够回应面试问题，并表达了继续学习该方向的基本动机。",
      hasClearMotivation
        ? "回答中已经出现目标、兴趣或职业规划相关表达。"
        : "回答语气较自然，适合作为第一版口语草稿继续打磨。",
    ],
    weaknesses: [
      hasSpecificExample
        ? "具体经历还可以进一步量化，例如说明项目规模、个人职责和结果。"
        : "缺少具体经历支撑，建议加入一个课程、项目、实习或研究案例。",
      "结尾需要更明确地回到目标学校和目标专业，形成更强的申请匹配度。",
    ],
    improvedAnswer: `I want to study ${input.targetProgram} at ${input.targetSchool} because it matches both my academic interests and my long-term career plan. Through my previous study and project experience, I have become increasingly interested in how analytical thinking can be used to solve real problems in this field. I hope to build stronger professional knowledge, improve my ability to work with international peers, and learn from the practical resources offered by the programme. In the future, I want to apply what I learn to create measurable value in my chosen industry. This is why I believe ${input.targetSchool} is a strong fit for my next stage of development.`,
    followUpQuestion: `Can you describe one specific project, course, or internship experience that shows you are ready for ${input.targetProgram}?`,
    finalAdvice:
      "建议下一轮回答使用“三段式”：先给结论，再讲一个具体经历，最后回到目标学校、专业和职业规划。每次练习控制在 90-120 秒，会更像真实面试。",
  };
}

export async function POST(request: NextRequest) {
  return withApiProtection(request, async () => {
    try {
      const body = (await request.json()) as InterviewEvaluateInput;
      const validation = validateInput(body);

      if ("error" in validation) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }

      const provider = getDefaultProviderForTool("interview");
      const result = await generateWithModel({
        provider,
        systemPrompt: buildSystemPrompt(),
        userPrompt: buildUserPrompt(validation.data),
        temperature: 0.35,
        responseFormat: "json",
      });

      if (!result.success) {
        console.warn("Interview model unavailable, using fallback evaluation:", result.error);
        return NextResponse.json({
          success: true,
          data: buildFallbackEvaluation(validation.data),
          meta: {
            mode: "fallback",
            reason: "model_unavailable",
          },
        });
      }

      const evaluation = normalizeEvaluation(result.data);

      if (!isEvaluationUsable(evaluation)) {
        console.warn("Interview model returned incomplete content, using fallback evaluation.");
        return NextResponse.json({
          success: true,
          data: buildFallbackEvaluation(validation.data),
          meta: {
            mode: "fallback",
            reason: "incomplete_model_response",
          },
        });
      }

      return NextResponse.json({ success: true, data: evaluation });
    } catch (error) {
      console.error("Interview evaluation error:", error);
      return NextResponse.json(
        { success: false, error: "面试评分失败，请稍后重试。" },
        { status: 500 },
      );
    }
  });
}
