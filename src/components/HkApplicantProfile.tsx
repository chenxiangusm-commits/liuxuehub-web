"use client";

import { useState } from "react";
import { formatHkBand, type HkApplicantProfile as Profile } from "@/lib/hk-applicant-profile";

export default function HkApplicantProfile({ profile, compact = false }: { profile?: Profile; compact?: boolean }) {
  const [direction, setDirection] = useState("");
  const [selectedScale, setSelectedScale] = useState(100);
  const current = (direction && profile?.directions?.[direction]) || profile;
  const scales = [...new Set(current?.bands.map(b => b.scale) || [])].sort((a, b) => a === 100 ? -1 : b === 100 ? 1 : a - b);
  const scale = scales.includes(selectedScale) ? selectedScale : scales[0] || 100;
  const bands = current?.bands.filter(b => b.scale === scale) || [];
  return <div data-hk-applicant-profile className="space-y-3">
    <div className="flex flex-wrap items-center gap-2">
      {profile?.directions && Object.keys(profile.directions).length > 0 && <label className="text-xs text-gray-600">
        专业方向
        <select aria-label="申请参考专业方向" value={direction} onChange={e => setDirection(e.target.value)} className="ml-2 max-w-full rounded-lg border border-blue-100 bg-white px-2 py-2 text-sm text-gray-800">
          <option value="">全校硕士概览</option>
          {Object.keys(profile.directions).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>}
      {scales.length > 1 && <label className="text-xs text-gray-600">成绩制式
        <select aria-label="参考成绩制式" value={scale} onChange={e => setSelectedScale(Number(e.target.value))} className="ml-2 rounded-lg border border-blue-100 bg-white px-2 py-2 text-sm text-gray-800">
          {scales.map(s => <option value={s} key={s}>{s === 100 ? "百分制" : `${s} 分制`}</option>)}
        </select>
      </label>}
    </div>
    {bands.length > 0 ? <>
      <p className="text-xs text-blue-700">{compact ? "申请成绩参考" : `${direction || "全校硕士"} · 申请成绩参考`}</p>
      <div className={compact ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
        {bands.map(b => <div key={b.group} className="rounded-xl border border-blue-50 bg-white px-4 py-3">
          <div className="text-xs text-gray-500">{b.group}</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{formatHkBand(b)}</div>
          <div className="mt-1 text-xs leading-5 text-gray-500">{b.basisLabel}{b.limited ? " · 样本较少" : ""}</div>
        </div>)}
      </div>
      <p className="text-xs leading-5 text-gray-500">{profile?.directions ? "先看大致区间，再进入具体专业查看要求。" : "结合专业背景与材料一起判断，详细官网要求见下方。"}</p>
    </> : <div className="rounded-xl bg-white p-4">
      <p className="text-sm font-medium text-gray-900">同类案例尚不足</p>
      <p className="mt-2 text-xs leading-6 text-gray-600">先看学历与专业背景、语言条件和申请材料。{compact ? "具体要求见下方。" : "进入具体专业查看详情。"}</p>
    </div>}
    {profile && <details className="text-xs leading-6 text-gray-500">
      <summary className="cursor-pointer text-blue-700">参考依据与适用范围</summary>
      <p className="mt-2">行业公开案例参考 · {current?.period || "2024–2026"} 年发布的硕士录取案例。发布时间不等于入学年份。</p>
      <p>按本科背景和分制分别统计中间 50% 的成绩分布，百分制取整数、GPA 保留一位小数，区间向外取整。仅有成功案例，不能计算录取概率。本科层次沿用来源分类，985/211 含 C9，不表示院校偏好。</p>
      <p>每组至少 10 条才展示区间，10–29 条标注样本较少；未展示的背景或分制暂缺足够样本。GPA 不换算为百分制，海外本科百分制因各国评分差异不合并展示。</p>
      {bands.map(b => <p key={b.group}>{b.group}：{b.basisLabel}，{b.count} 条去重背景记录，{b.scale === 100 ? "百分制" : `${b.scale} 分制`}。</p>)}
      {compact && <p>标注“本校同类专业”的区间来自同校相近学科，不能视作本专业录取门槛。</p>}
    </details>}
  </div>;
}
