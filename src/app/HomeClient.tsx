"use client";

import { getQSRank, getQSYear, getQSLabel } from "@/lib/qs-ranking";


import Image from "next/image";
import Link from "next/link";
import { getSchoolLogo } from "@/lib/schoolLogos";
import type { School } from "@/types";

interface HomeClientProps {
  schools: School[];
}

const regions = ["英国", "中国香港/澳门", "新加坡", "澳大利亚", "新西兰"];

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
    .filter((school) => getQSRank(school) > 0)
    .sort((a, b) => getQSRank(a) - getQSRank(b))
    .slice(0, 6);

  return <div className="design-container py-10 sm:py-12">
    <section><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">从目的地开始</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">探索院校与专业</h2><p className="mt-2 text-sm text-slate-500">了解学校，再进入具体专业查看申请条件。</p></div><Link href="/schools" className="ui-secondary">浏览全部院校 →</Link></div>
    <div className="mb-6 flex flex-wrap gap-2">{regions.map(region=><Link href={`/schools?region=${encodeURIComponent(region)}`} key={region} className="ui-secondary">{region}</Link>)}</div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{topSchools.map(school=><Link key={school.school_code} href={`/schools/${school.school_code}`} className="home-school-card"><span className="school-logo-small"><Image src={getSchoolLogo(school.school_code)} alt="" width={40} height={40}/></span><div className="min-w-0"><h3 className="text-base font-semibold text-slate-900">{cnName(school)}</h3><p className="mt-1 truncate text-xs text-slate-500">{enName(school)}</p><p className="mt-2 text-xs text-slate-600">{cnRegion(school)} · QS {getQSYear(school)} {getQSLabel(school)}</p></div></Link>)}</div></section>
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow">为申请做好准备</p><h2 className="mt-1 text-xl font-semibold">从目标清单，到下一步行动</h2><p className="mt-2 text-sm leading-6 text-slate-500">结合个人背景整理规划，准备材料，练习面试。</p></div><Link href="/ai/school-match" className="ui-primary">查看个人选校匹配 →</Link></div><div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">{[{name:'申请规划',desc:'整理背景、目标与申请安排',href:'/ai/study-plan'},{name:'文书准备',desc:'整理简历与个人陈述素材',href:'/ai'},{name:'面试训练',desc:'练习项目面试与个人表达',href:'/ai/interview'}].map(x=><Link key={x.href} href={x.href} className="rounded-xl p-3 hover:bg-slate-50"><h3 className="text-sm font-semibold text-slate-900">{x.name} →</h3><p className="mt-1 text-xs text-slate-500">{x.desc}</p></Link>)}</div></section>
  </div>;
}
