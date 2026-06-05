"use client";

import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import type { School } from "@/types";

interface HomeClientProps {
  schools: School[];
}

const planFeatures = [
  ["3分钟生成学生申请画像", "整理院校背景、GPA、语言、实习科研与目标方向，形成顾问沟通底稿。"],
  ["自动输出冲刺/匹配/保底方案", "把学校和专业拆成梯度，帮助顾问更快解释选校逻辑和申请风险。"],
  ["面向中国学生背景做申请建议", "围绕985/211/双非/海本、GPA、语言和实践经历生成建议。"],
  ["顾问沟通和签约前方案基础", "适合初次咨询、家长沟通、签约前规划书和后续服务跟进。"],
];

const chinaFit = [
  "985 / 211 / 双非 / 海本背景区分",
  "GPA / 语言 / 实习 / 科研综合评估",
  "国际生学费和语言要求优先展示",
  "申请建议仅供参考，最终以官网为准",
];

const regions = ["英国", "中国香港/澳门", "新加坡", "澳大利亚", "新西兰", "加拿大"];

function hasCn(value?: string | null) {
  return /[\u4e00-\u9fff]/.test(value || "");
}

function cnName(school: School) {
  if (hasCn(school.school_name_cn)) return school.school_name_cn as string;
  if (hasCn(school.school_name)) return school.school_name;
  return school.school_name_en || school.school_code;
}

function enName(school: School) {
  return school.school_name_en || school.school_name || school.school_code;
}

function cnRegion(school: School) {
  if (hasCn(school.region_cn)) return school.region_cn;
  const map: Record<string, string> = {
    "United Kingdom": "英国",
    "Hong Kong SAR": "中国香港",
    "Macao SAR": "中国澳门",
    Singapore: "新加坡",
    Australia: "澳大利亚",
    "New Zealand": "新西兰",
    Canada: "加拿大",
    "United States": "美国",
    Ireland: "爱尔兰",
  };
  return map[school.region_en] || school.region_cn || school.region_en || "待确认";
}

export default function HomeClient({ schools }: HomeClientProps) {
  const topSchools = [...schools]
    .filter((school) => school.qs_ranking_2026 > 0)
    .sort((a, b) => a.qs_ranking_2026 - b.qs_ranking_2026)
    .slice(0, 6);

  return (
    <>
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="primary">AI留学规划书</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                从学生背景到可沟通的申请方案
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                帮顾问把碎片化信息转成结构化规划：画像、SWOT、选校梯度、差距分析、时间线和行动建议。
              </p>
            </div>
            <Link href="/ai/study-plan" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              立即生成规划书
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {planFeatures.map(([title, desc], index) => (
              <Card key={title} className="p-6 shadow-sm" hoverable>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-4 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  Beta体验 / 面试训练
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-950">AI面试官保留为辅助工具</h3>
                <p className="mt-1 text-sm text-slate-600">用于面试训练和回答反馈，不再作为首页首屏主转化入口。</p>
              </div>
              <Link href="/ai/interview" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
                进入面试训练
              </Link>
            </div>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <Badge variant="default">中国学生申请场景</Badge>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              贴近顾问真实判断，而不是泛泛推荐
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              留学规划最难的不是列学校，而是解释为什么这个学生适合这个梯度。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {chinaFit.map((item) => (
              <Card key={item} className="p-6 shadow-sm" hoverable>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">✓</div>
                <p className="text-base font-bold leading-7 text-slate-900">{item}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="primary">院校入口</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                热门地区与热门院校
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                首页只保留轻量入口，详细筛选和学校专业数据请进入院校库。
              </p>
            </div>
            <Link href="/schools" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
              浏览完整院校库
            </Link>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {regions.map((region) => (
              <Link key={region} href="/schools" className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-center text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600">
                {region}
              </Link>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topSchools.map((school) => (
              <Link key={school.school_code} href={`/schools/${school.school_code}`}>
                <Card className="h-full p-5 shadow-sm" hoverable>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <Image src={getSchoolMarkPath(school.school_code)} alt={cnName(school)} width={52} height={52} className="max-h-12 max-w-12 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-black text-slate-950">{cnName(school)}</h3>
                        <span className="shrink-0 rounded-lg bg-red-50 px-2 py-1 text-xs font-black text-red-600">QS {school.qs_ranking_2026}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-500">{enName(school)}</p>
                      <p className="mt-2 text-sm font-semibold text-blue-600">{cnRegion(school)} · {school.total_programs || 0}个项目</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="default">可信说明</Badge>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                数据与AI建议都要服务顾问判断
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                平台提供结构化数据和规划框架，但最终方案仍应由顾问结合学生真实背景、学校官网和当季申请政策审核。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "数据来自学校官网及公开课程目录",
                "面向中国学生申请场景整理",
                "学费、语言、截止日期以学校官网为准",
                "AI生成内容仅作规划参考，需由顾问最终审核",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 text-sm font-bold leading-6 text-blue-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center text-white shadow-2xl shadow-blue-600/20 sm:px-10">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            开始为学生生成第一份AI留学规划书
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-blue-50">
            用一份结构化方案，把学生背景、选校梯度、申请风险和下一步行动讲清楚。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/ai/study-plan" className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-blue-700 transition hover:bg-blue-50">
              立即生成规划书
            </Link>
            <Link href="/schools" className="rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-black text-white transition hover:bg-white/15">
              浏览院校库
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
