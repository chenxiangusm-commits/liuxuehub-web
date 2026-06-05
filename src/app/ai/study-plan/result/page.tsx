"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { StudyPlanResult, studyPlanMockResult } from "@/lib/ai/studyPlanMock";

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold text-slate-950">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {(items.length ? items : ["建议补充确认"]).map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function StudyPlanResultPage() {
  const [result, setResult] = useState<StudyPlanResult>(studyPlanMockResult);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("studyPlanResult");
      if (stored) setResult(JSON.parse(stored) as StudyPlanResult);
    } catch {
      setResult(studyPlanMockResult);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="border-b border-blue-100 bg-white py-10">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge variant="primary">Dynamic Study Abroad Decision Map</Badge>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
                AI留学规划书结果
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                以下内容为AI生成的顾问沟通参考，最终方案请结合学生真实材料和学校官网审核。
              </p>
            </div>
            <Link href="/ai/study-plan" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">
              重新生成
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-950">学生画像</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600">{result.studentProfile.summary}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
                <div className="text-3xl font-black text-blue-600">{result.studentProfile.competitivenessScore}</div>
                <div className="text-xs font-bold text-blue-700">竞争力评分</div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ListBlock title="优势" items={result.studentProfile.strengths} />
              <ListBlock title="短板" items={result.studentProfile.weaknesses} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-950">SWOT分析</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ListBlock title="优势" items={result.swot.strengths} />
              <ListBlock title="劣势" items={result.swot.weaknesses} />
              <ListBlock title="机会" items={result.swot.opportunities} />
              <ListBlock title="风险" items={result.swot.threats} />
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950">冲刺 / 匹配 / 保底方案</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              ["冲刺", result.schoolStrategy.reach],
              ["匹配", result.schoolStrategy.match],
              ["保底", result.schoolStrategy.safe],
            ].map(([label, items]) => (
              <div key={label as string} className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black text-gray-950">{label as string}</h3>
                <div className="mt-3 space-y-3">
                  {(items as StudyPlanResult["schoolStrategy"]["reach"]).map((item) => (
                    <div key={`${label}-${item.school}-${item.program}`} className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="font-bold text-gray-900">{item.school}</div>
                      <div className="mt-1 text-sm font-semibold text-blue-600">{item.program}</div>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{item.reason}</p>
                      <p className="mt-2 text-xs leading-5 text-red-600">风险：{item.risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-950">申请时间线</h2>
            <div className="mt-5 space-y-3">
              {result.timeline.map((item) => (
                <div key={`${item.time}-${item.stage}`} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex justify-between gap-3">
                    <strong>{item.stage}</strong>
                    <span className="text-sm font-bold text-blue-600">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{item.tasks.join("、") || "建议补充确认"}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-950">行动建议</h2>
            <div className="mt-5 space-y-3">
              {result.actionPlan.map((item) => (
                <div key={`${item.priority}-${item.action}`} className="rounded-2xl bg-slate-50 p-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">优先级：{item.priority}</span>
                  <h3 className="mt-3 font-bold text-gray-950">{item.action}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 text-sm leading-6 text-gray-500">
          {result.disclaimer}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {["保存方案", "导出PDF", "发给学生"].map((label) => (
              <button key={label} type="button" disabled className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-bold text-slate-400">
                {label}（即将上线）
              </button>
            ))}
          </div>
        </Card>
      </Container>
    </main>
  );
}
