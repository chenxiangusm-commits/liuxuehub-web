"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { defaultStudyPlanForm, StudyPlanForm, studyPlanMockResult } from "@/lib/ai/studyPlanMock";
import { ReportBranding } from "@/config/reportBranding";

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold text-blue-600">{score}</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function LockedSection() {
  return (
    <Card className="relative overflow-hidden p-8 text-center shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
      <div className="relative mx-auto max-w-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-950">升级会员解锁完整规划书</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          完整版包含冲刺/匹配/保底方案、背景差距分析、申请时间轴和AI行动建议。
        </p>
        <Link
          href="/ai"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          查看AI工具中心
        </Link>
      </div>
    </Card>
  );
}

export default function StudyPlanResultPage() {
  const [form, setForm] = useState<StudyPlanForm>(defaultStudyPlanForm);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("studyPlanForm");
      if (stored) {
        setForm({ ...defaultStudyPlanForm, ...JSON.parse(stored) });
      }
    } catch {
      setForm(defaultStudyPlanForm);
    }
  }, []);

  const result = studyPlanMockResult;
  const isFreeUser = true;
  const direction = form.stage === "undergraduate" ? (form.targetMajor || form.direction) : form.direction;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="border-b border-blue-100 bg-white py-10">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge variant="primary">Dynamic Study Abroad Decision Map</Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
                你的 AI 留学战略地图
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                基于你填写的背景信息，生成面向中国学生的阶段性申请规划。当前为MVP样例结果。
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 text-sm text-gray-600">
              <div>申请阶段：<strong className="text-gray-900">{form.stage === "postgraduate" ? "硕士" : "本科"}</strong></div>
              <div>目标地区：<strong className="text-gray-900">{form.regions.join("、") || "待选择"}</strong></div>
              <div>目标方向：<strong className="text-gray-900">{direction || "待选择"}</strong></div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 shadow-sm" hoverable>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">模块 1</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950">AI学生画像</h2>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
                <div className="text-3xl font-black text-blue-600">{result.profile.competitiveness}</div>
                <div className="text-xs font-semibold text-blue-700">竞争力指数</div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-gray-500">申请方向：</span><strong>{direction || result.profile.direction}</strong></div>
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-gray-500">背景类型：</span><strong>{form.backgroundType || result.profile.backgroundType}</strong></div>
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-gray-500">申请风险：</span><strong>{result.profile.riskLevel}</strong></div>
              <div className="rounded-xl bg-slate-50 p-4"><span className="text-gray-500">核心短板：</span><strong>{result.profile.weakness}</strong></div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm" hoverable>
            <p className="text-sm font-semibold text-blue-600">模块 2</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">竞争力雷达图</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {result.radar.map((item) => (
                <ScoreBar key={item.label} label={item.label} score={item.score} />
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 shadow-sm" hoverable>
          <p className="text-sm font-semibold text-blue-600">模块 3</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">SWOT分析</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["优势", result.swot.strengths, "bg-emerald-50 text-emerald-700"],
              ["劣势", result.swot.weaknesses, "bg-amber-50 text-amber-700"],
              ["机会", result.swot.opportunities, "bg-blue-50 text-blue-700"],
              ["风险", result.swot.threats, "bg-rose-50 text-rose-700"],
            ].map(([title, items, color]) => (
              <div key={title as string} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-sm font-bold ${color as string}`}>{title as string}</div>
                <ul className="space-y-2 text-sm leading-6 text-gray-600">
                  {(items as string[]).map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {isFreeUser ? (
          <div className="mt-6">
            <LockedSection />
          </div>
        ) : (
          <>
            <Card className="mt-6 p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-950">推荐方案</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["冲刺", result.recommendations.reach],
                  ["匹配", result.recommendations.match],
                  ["保底", result.recommendations.safe],
                ].map(([label, schools]) => (
                  <div key={label as string} className="rounded-2xl bg-slate-50 p-4">
                    <h3 className="font-bold text-gray-950">{label as string}</h3>
                    <div className="mt-3 space-y-3">
                      {(schools as typeof result.recommendations.reach).map((school) => (
                        <div key={school.school} className="rounded-xl bg-white p-4 shadow-sm">
                          <div className="font-bold text-gray-900">{school.school}</div>
                          <div className="mt-1 text-xs text-blue-600">QS {school.qs} · {school.region}</div>
                          <p className="mt-2 text-sm text-gray-600">{school.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        <Card className="mt-6 p-6 text-sm leading-6 text-gray-500">
          <strong className="text-gray-700">免责声明：</strong>
          基于公开院校项目数据、申请要求、历史趋势及AI模型推测，仅供参考。最终申请要求和截止日期请以学校官网为准。
          {ReportBranding.showWatermark && <span className="ml-2">由 {ReportBranding.companyName} 生成样例展示。</span>}
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/ai/school-match" className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-blue-700">
            AI智能定校
          </Link>
          <Link href="/ai/interview" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-center text-sm font-bold text-gray-700 hover:text-blue-600">
            AI面试官
          </Link>
          <Link href="/ai" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-center text-sm font-bold text-gray-700 hover:text-blue-600">
            AI文书优化
          </Link>
        </div>
      </Container>
    </main>
  );
}

