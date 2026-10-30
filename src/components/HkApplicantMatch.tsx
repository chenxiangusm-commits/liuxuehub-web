"use client";

import { admissionsState } from "@/lib/admissions-state";
import { useState } from "react";
import type { AdmissionsPreview } from "@/types";
import { compareHkBackground, type HkApplicantProfile, type HkMatchInput } from "@/lib/hk-applicant-profile";

export default function HkApplicantMatch({ profile, admissions, anchorId = "hk-match", unavailableReason, requirementsHref = "#admissions-facts-title", region = "", academicLabel = "学历、先修课与经历" }: { profile?: HkApplicantProfile; admissions?: AdmissionsPreview; anchorId?: string; unavailableReason?: string; requirementsHref?: string; academicLabel?: string; region?: string }) {
  const [form, setForm] = useState<HkMatchInput>({ group: "双非本科", scale: 100, grade: "", academic: "", language: "", intake: "" });
  const [submitted, setSubmitted] = useState(false);
  // Use an explicit current-cycle closure statement, not a historical round's date.
  const closed = admissionsState({region_cn:region,deadline:"",admissions_preview:admissions}).code === "closed";
  const result = submitted ? compareHkBackground(profile, form, closed) : null;
  function change<K extends keyof HkMatchInput>(key: K, value: HkMatchInput[K]) {
    setForm(prev => ({ ...prev, [key]: value })); setSubmitted(false);
  }
  const inputClass = "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
  if (unavailableReason) return <section id={anchorId} className="scroll-mt-24 rounded-2xl border border-amber-100 bg-white p-6" data-applicant-unavailable>
    <h2 className="text-lg font-semibold text-gray-900">当前申请安排</h2>
    <p className="mt-2 text-sm leading-6 text-amber-900">{unavailableReason}</p>
  </section>;
  return <section id={anchorId} className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-6" data-hk-applicant-match={anchorId === "hk-match" ? true : undefined} data-au-applicant-match={anchorId === "au-match" ? true : undefined} data-sg-applicant-match={anchorId === "sg-match" ? true : undefined} data-uk-applicant-match={anchorId === "uk-match" ? true : undefined}>
    <h2 className="text-lg font-semibold text-gray-900">查看我的申请匹配度</h2>
    <p className="mt-2 text-sm leading-6 text-gray-500">填写自己的背景，再对照本项目要求查看成绩位置。信息仅用于当前页面比较。</p>
    <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="mt-5 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="text-sm text-gray-700">本科背景<select className={inputClass} value={form.group} onChange={e => change("group", e.target.value)}>
          <option>双非本科</option><option>985/211</option><option>海外本科</option><option>其他背景</option>
        </select></label>
        <label className="text-sm text-gray-700">成绩制式<select className={inputClass} value={form.scale} onChange={e => change("scale", Number(e.target.value))}>
          <option value={100}>百分制</option><option value={4}>4 分制</option><option value={5}>5 分制</option>
        </select></label>
        <label className="text-sm text-gray-700">我的成绩<input className={inputClass} inputMode="decimal" value={form.grade} onChange={e => change("grade", e.target.value)} placeholder={form.scale === 100 ? "如 82" : "如 3.3"} /></label>
      </div>
      <div className="rounded-xl bg-blue-50/60 p-4">
        <p className="mb-3 text-sm font-medium text-gray-800">对照下方官网要求，确认申请条件</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {([['academic', academicLabel], ['language', '语言要求或可用豁免'], ['intake', '拟申请批次仍接受申请']] as const).map(([key, label]) => <label key={key} className="text-xs text-gray-600">{label}
            <select className={inputClass} value={form[key]} onChange={e => change(key, e.target.value)}><option value="">请确认</option><option value="yes">已确认符合</option><option value="no">尚不符合</option><option value="unknown">暂不确定</option></select>
          </label>)}
        </div>
        <a href={requirementsHref} className="mt-3 inline-block text-xs text-blue-700 underline underline-offset-2">查看课程申请要求 ↓</a>
      </div>
      {closed && <p className="text-sm text-amber-800">当前展示批次已截止，请先确认新的招生安排。</p>}
      <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">查看匹配参考</button>
    </form>
    {result && <div role="status" className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <p className="text-base font-semibold text-gray-900">{result.title}</p>
      <p className="mt-2 text-sm leading-6 text-gray-700">{result.detail}</p>
      {result.band && <p className="mt-2 text-xs text-gray-500">{result.band.count} 条去重背景记录 · {profile?.period} 年发布 · 行业公开案例参考{result.band.limited ? " · 样本较少" : ""}</p>}
    </div>}
  </section>;
}
