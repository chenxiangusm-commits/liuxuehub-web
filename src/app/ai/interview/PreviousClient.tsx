"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type DegreeLevel = "本科" | "硕士";
type InterviewType = "入学面试" | "奖学金面试" | "英文口语训练";

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

const degreeLevels: DegreeLevel[] = ["本科", "硕士"];
const interviewTypes: InterviewType[] = ["入学面试", "奖学金面试", "英文口语训练"];

const questionTemplates: Record<InterviewType, string[]> = {
  入学面试: [
    "Why do you want to study {program} at {school}?",
    "Tell me about your academic background and how it prepares you for {program}.",
    "What makes you a strong fit for {school}?",
  ],
  奖学金面试: [
    "Why do you believe you deserve this scholarship for {program} at {school}?",
    "Describe a moment when you created impact beyond your own academic results.",
    "How would this scholarship change your study plan and future contribution?",
  ],
  英文口语训练: [
    "Please introduce yourself and explain your study goals in English.",
    "Describe a challenge you faced during your studies and how you handled it.",
    "What are your short-term and long-term career goals?",
  ],
};

function buildQuestion(type: InterviewType, targetSchool: string, targetProgram: string, index = 0) {
  const school = targetSchool.trim() || "your target university";
  const program = targetProgram.trim() || "your target program";
  const templates = questionTemplates[type];
  return templates[index % templates.length]
    .replaceAll("{school}", school)
    .replaceAll("{program}", program);
}

function scoreColor(score: number) {
  if (score >= 85) return "text-emerald-300";
  if (score >= 70) return "text-blue-300";
  if (score >= 55) return "text-amber-300";
  return "text-red-300";
}

function scoreBar(score: number) {
  if (score >= 85) return "from-emerald-400 to-green-500";
  if (score >= 70) return "from-blue-400 to-cyan-500";
  if (score >= 55) return "from-amber-400 to-orange-500";
  return "from-red-400 to-rose-500";
}

export default function InterviewPage() {
  const [targetSchool, setTargetSchool] = useState("The University of Hong Kong");
  const [targetProgram, setTargetProgram] = useState("MSc in Finance");
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("硕士");
  const [interviewType, setInterviewType] = useState<InterviewType>("入学面试");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = useMemo(
    () => buildQuestion(interviewType, targetSchool, targetProgram, questionIndex),
    [interviewType, targetSchool, targetProgram, questionIndex],
  );

  const answerLength = studentAnswer.trim().length;

  const handleNextQuestion = () => {
    setQuestionIndex((value) => value + 1);
    setEvaluation(null);
    setError("");
  };

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setEvaluation(null);

    if (!targetSchool.trim()) {
      setError("请填写目标学校");
      return;
    }
    if (!targetProgram.trim()) {
      setError("请填写目标专业");
      return;
    }
    if (answerLength < 40) {
      setError("请用英文完成一段更完整的回答，至少 40 个字符。");
      return;
    }
    if (answerLength > 4000) {
      setError("回答太长了，请控制在 4000 字符以内。");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetSchool: targetSchool.trim(),
          targetProgram: targetProgram.trim(),
          degreeLevel,
          interviewType,
          question,
          studentAnswer: studentAnswer.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        data?: InterviewEvaluation;
      } | null;

      if (!response.ok || !payload?.success || !payload.data) {
        setError(payload?.error || "AI 面试官暂时不可用，请稍后重试。");
        return;
      }

      setEvaluation(payload.data);
    } catch {
      setError("网络异常，请检查本地服务或稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const scoreItems = evaluation
    ? [
        { label: "语言流畅度", value: evaluation.fluencyScore },
        { label: "逻辑结构", value: evaluation.logicScore },
        { label: "问题相关性", value: evaluation.relevanceScore },
        { label: "自信表达", value: evaluation.confidenceScore },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-100">
            文本版 AI 面试官 Beta
          </span>
          <h1 className="mt-5 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            AI 招生官模拟面试
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-gray-300">
            AI 出题，学生用英文回答。系统会评估内容、逻辑、相关性与表达质量，并给出追问和优化答案。
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">面试设置</h2>
                <p className="mt-1 text-sm text-gray-400">
                  填写目标信息后，AI 会生成更贴近申请场景的英文问题。
                </p>
              </div>
              <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-300">
                DeepSeek 优先
              </span>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-300">目标学校</span>
                <input
                  value={targetSchool}
                  onChange={(event) => setTargetSchool(event.target.value.slice(0, 120))}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="例如：The University of Hong Kong"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-300">目标专业</span>
                <input
                  value={targetProgram}
                  onChange={(event) => setTargetProgram(event.target.value.slice(0, 120))}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="例如：MSc in Finance"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">申请层级</span>
                  <select
                    value={degreeLevel}
                    onChange={(event) => setDegreeLevel(event.target.value as DegreeLevel)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {degreeLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">面试类型</span>
                  <select
                    value={interviewType}
                    onChange={(event) => {
                      setInterviewType(event.target.value as InterviewType);
                      setQuestionIndex(0);
                      setEvaluation(null);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {interviewTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-blue-200">AI 面试问题</span>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-gray-200 transition hover:bg-white/10"
                >
                  换一题
                </button>
              </div>
              <p className="text-lg font-semibold leading-8 text-white">&quot;{question}&quot;</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {["结合经历", "结构清晰", "具体例子"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center text-sm text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={submitAnswer} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">学生英文回答</h2>
                <p className="mt-1 text-sm text-gray-400">
                  建议先按 90-180 秒口述长度写出回答，再根据 AI 建议修改。
                </p>
              </div>
              <span className={`text-sm ${answerLength > 4000 ? "text-red-300" : "text-gray-400"}`}>
                {answerLength}/4000
              </span>
            </div>

            <textarea
              value={studentAnswer}
              onChange={(event) => setStudentAnswer(event.target.value.slice(0, 4200))}
              className="min-h-80 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Write your answer in English here. Example: I want to study this programme because..."
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "AI 面试官评分中..." : "提交并生成评分报告"}
            </button>
          </form>
        </div>

        <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">AI 面试报告</h2>
              <p className="mt-1 text-sm text-gray-400">
                报告基于英文回答文本生成，重点评估内容相关性、逻辑结构和表达质量。
              </p>
            </div>
            {evaluation && (
              <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-5 py-3 text-center">
                <p className="text-xs text-green-200">综合评分</p>
                <p className={`text-4xl font-black ${scoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}
                </p>
              </div>
            )}
          </div>

          {!evaluation ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-gray-400">
              提交回答后，这里会显示评分、优势、问题、AI 追问和优化后的英文回答。
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {scoreItems.map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <span className={`text-xl font-bold ${scoreColor(item.value)}`}>{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${scoreBar(item.value)}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-green-400/20 bg-green-500/10 p-5">
                  <h3 className="mb-3 font-semibold text-green-200">回答亮点</h3>
                  <ul className="space-y-2 text-sm leading-6 text-gray-200">
                    {evaluation.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-5">
                  <h3 className="mb-3 font-semibold text-amber-200">需要改进</h3>
                  <ul className="space-y-2 text-sm leading-6 text-gray-200">
                    {evaluation.weaknesses.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-5">
                <h3 className="mb-3 font-semibold text-blue-200">AI 追问</h3>
                <p className="text-lg font-medium leading-8 text-white">&quot;{evaluation.followUpQuestion}&quot;</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                <h3 className="mb-3 font-semibold text-white">优化后的英文回答</h3>
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-200">{evaluation.improvedAnswer}</p>
              </div>

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-5">
                <h3 className="mb-3 font-semibold text-cyan-200">下一轮训练建议</h3>
                <p className="text-sm leading-7 text-gray-200">{evaluation.finalAdvice}</p>
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <span>想把面试训练和选校规划结合起来？可以先生成一份学生规划书，再定制面试问题。</span>
          <Link
            href="/ai/study-plan"
            className="rounded-xl bg-white px-5 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            生成 AI 留学规划书
          </Link>
        </div>
      </main>
    </div>
  );
}
