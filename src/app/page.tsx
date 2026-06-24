import Link from "next/link";
import { getAllSchools } from "@/lib/data.server";
import HomeClient from "./HomeClient";
import { siteStats } from "@/config/siteStats";

export const dynamic = "force-dynamic";

const planningHighlights = [
  "国家规划",
  "学校梯度",
  "专业路线",
  "时间规划",
  "背景提升",
  "风险分析",
];

export default async function HomePage() {
  const schools = await getAllSchools();

  return (
    <main className="bg-[#F8FAFC]">
      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
              AI留学顾问工作台 Beta
            </div>

            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                AI留学顾问
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  工作台
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/90">
                面向留学顾问和机构，快速生成中国学生申请规划、智能选校方案与专业匹配建议。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/ai/study-plan"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-bold text-blue-700 shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                免费生成留学方案
              </Link>
              <Link
                href="/schools"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                进入院校库
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {planningHighlights.map((item) => (
                <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-blue-50">
                  {item}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 sm:max-w-xl">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="text-2xl font-black text-cyan-300">{siteStats.programs.toLocaleString()}+</div>
                <div className="mt-1 text-xs text-blue-100/75">院校项目数据</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="text-2xl font-black text-cyan-300">300000+</div>
                <div className="mt-1 text-xs text-blue-100/75">申请分析数据</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="text-2xl font-black text-cyan-300">120+</div>
                <div className="mt-1 text-xs text-blue-100/75">AI分析维度</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
              <div className="rounded-3xl bg-white p-5 text-slate-900">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600">顾问方案生成器</p>
                    <h2 className="text-xl font-black">AI留学方案预览</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Beta可体验
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["冲刺", "IC / LSE", "需要强化实习科研"],
                    ["匹配", "曼大 / 华威", "背景与方向较吻合"],
                    ["保底", "利兹 / 南安", "录取稳定性更高"],
                  ].map(([label, schoolsLabel, desc]) => (
                    <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="text-xs font-bold text-blue-600">{label}</div>
                      <div className="mt-2 font-black">{schoolsLabel}</div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-900">申请时间线</span>
                    <span className="text-xs text-blue-600">AI规划参考</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["2026年3月", "语言考试与定校"],
                      ["2026年6月", "实习/科研补强"],
                      ["2026年8月", "文书与推荐信准备"],
                      ["2026年9月", "递交第一轮申请"],
                    ].map(([date, text]) => (
                      <div key={date} className="flex gap-3 text-sm">
                        <div className="w-24 shrink-0 font-bold text-blue-700">{date}</div>
                        <div className="text-slate-700">{text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  AI结果仅作规划参考，需由顾问最终审核；申请要求与截止日期请以学校官网为准。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeClient schools={schools} />
    </main>
  );
}
