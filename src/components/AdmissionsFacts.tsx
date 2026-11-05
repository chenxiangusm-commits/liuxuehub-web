import { roundIsClosed } from "@/lib/admissions-state";
import { Program, AdmissionsEvidence } from "@/types";
import { HKUSources } from "@/components/HKUApplicationGuide";

const statusLabels = {
  verified: "官网已核对",
  not_published: "所查来源未明确公布",
  conflict: "来源存在差异",
  unconfirmed: "尚待确认",
};

export function isHKMOMasters(program: Pick<Program, "education_level" | "region_cn">) {
  return program.education_level === "postgraduate" && ["中国香港", "中国澳门"].includes(program.region_cn);
}

function Evidence({ evidence }: { evidence?: AdmissionsEvidence }) {
  if (!evidence) return <p className="mt-2 text-xs text-amber-700">历史记录，当前批次尚未确认</p>;
  const label = evidence.status === "verified" && evidence.sources.some(source => source.url.includes("compassedu.hk"))
    ? "已核对（含指南者参考资料）"
    : statusLabels[evidence.status];
  return <div className="mt-2 space-y-1 text-xs text-gray-500">
    <p>{label} · {evidence.cycle}</p>
    {evidence.note && <p className="text-amber-800">{evidence.note}</p>}
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {evidence.sources.map(source => <a key={source.key} href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2">{source.label} ↗</a>)}
    </div>
  </div>;
}

export default function AdmissionsFacts({ program }: { program: Program }) {
  const info = program.admissions_preview;
  if (info) return <section className="rounded-2xl border border-blue-100 bg-white p-6" aria-labelledby="admissions-facts-title">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
      <h2 id="admissions-facts-title" className="scroll-mt-24 text-lg font-semibold text-gray-900">招生信息与来源</h2>
      <span className="text-xs text-gray-500">资料日期：{info.updatedOn}</span>
    </div>
    <p className="mb-5 text-sm text-blue-700">{info.cycle} · {info.mode} · {info.applicantScope}</p>
    <dl className="divide-y divide-gray-100 text-sm leading-7 text-gray-700">
      <div className="pb-4">
        <dt className="mb-2 font-semibold text-gray-900">申请截止时间</dt>
        {info.deadlineCheckedOn && <p className="mb-2 text-xs text-gray-500">
          {info.deadlineCheckStatus === "confirmed" ? "申请时间已按本批次官网核对" : "已检查官网，课程专属日期仍需确认"} · {info.deadlineCheckedOn}
        </p>}
        <dd>{info.rounds.length ? <ul className="space-y-2">{info.rounds.map((r, n) => <li key={`${r.date}-${n}`} className={roundIsClosed(r, program.region_cn, undefined, program.school_code) ? "text-gray-500" : "text-gray-800"}>
          <span className="font-medium">{r.label}：</span>{r.display}{roundIsClosed(r, program.region_cn, undefined, program.school_code) && <span className="ml-2 text-xs">已截止</span>}
        </li>)}</ul> : info.deadlineSummary}
          <HKUSources sources={info.sources.deadline} />
        </dd>
      </div>
      <div className="py-4">
        <dt className="mb-2 font-semibold text-gray-900">学费</dt>
        <dd>{info.feeShort}{info.feeNote && <p className="mt-1 text-amber-800">{info.feeNote}</p>}<HKUSources sources={info.sources.fee} /></dd>
      </div>
      <div className="pt-4">
        <dt className="mb-2 font-semibold text-gray-900">语言条件</dt>
        <dd><ul className="space-y-1">{(info.languageDetails.length ? info.languageDetails : [program.language_requirement || '本批次语言条件尚无明确资料']).map(line => <li key={line}>{line}</li>)}</ul><HKUSources sources={info.sources.language} /></dd>
      </div>
    </dl>
  </section>;
  const review = program.admissions_review;
  const facts = [
    { key: "deadline" as const, label: "申请批次与截止日期", value: program.deadline },
    { key: "fee" as const, label: "学费", value: program.fee },
    { key: "language" as const, label: "语言条件", value: program.language_requirement || [program.ielts, program.toefl].filter(Boolean).join("；") },
  ];
  return <section className="rounded-2xl border border-blue-100 bg-white p-6" aria-labelledby="admissions-facts-title">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
      <h2 id="admissions-facts-title" className="text-lg font-semibold text-gray-900">招生信息与来源</h2>
      <span className="text-xs text-gray-500">{review ? `核对日期：${review.checked_on}` : "当前批次尚未确认"}</span>
    </div>
    {review?.catalogue_status === "unconfirmed" && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">当前官方目录尚未确认此项目，请先向学校核实是否招生。</p>}
    {review?.catalogue_status === "pending_approval" && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">官网列为拟开办课程，仍待批准及正式公布；申请安排以学校最终通知为准。</p>}
    {review?.catalogue_status === "not_offered" && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">官网明确说明本申请年度不再开办此课程。此页保留历史记录，请查看学校现行课程。</p>}
    {review?.newness === "added_to_database" && <p className="mb-4 text-sm text-blue-700">本次补入院校库的项目；不代表学校于本学年首次开设。</p>}
    {review?.newness === "newly_offered" && <p className="mb-4 text-sm text-blue-700">官网已确认新开设项目。</p>}
    <dl className="divide-y divide-gray-100">
      {facts.map(fact => <div key={fact.key} className="py-4 first:pt-0 last:pb-0">
        <dt className="mb-2 font-medium text-gray-900">{fact.label}</dt>
        <dd className="whitespace-pre-line break-words text-sm leading-7 text-gray-700">{fact.value || "尚无可确认的信息"}<Evidence evidence={review?.fields[fact.key]} /></dd>
      </div>)}
    </dl>
  </section>;
}
