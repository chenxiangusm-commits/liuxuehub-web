import type { AuApplicantProfile as Profile } from "@/lib/au-applicant-profile";
import { formatHkBand } from "@/lib/hk-applicant-profile";
import HkApplicantProfile from "@/components/HkApplicantProfile";

export default function AuApplicantProfile({ profile, compact = false }: { profile: Profile; compact?: boolean }) {
  if (profile.inactive) return <div data-au-applicant-profile="inactive" className="space-y-3">
    <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">{profile.summary}</p>
    {profile.items.map(item => <p key={item.label} className="text-sm text-gray-700">{item.label}：{item.value}</p>)}
  </div>;
  const gradeItems = profile.items.filter(item => /分$/.test(item.value));
  const focus = profile.items.find(item => item.label === "申请重点");
  const cases = profile.caseProfile;
  return <div data-au-applicant-profile="planning-with-separate-cases" className="space-y-3">
    <p className="text-xs leading-5 text-blue-700">建议区间 · 中国本科均分</p>
    <div className={compact ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 gap-3 sm:grid-cols-2"}>
      {gradeItems.map(item => {
        const group = item.label.includes("双非") ? "双非本科" : "985/211";
        const band = cases?.bands.find(b => b.group === group && b.scale === 100);
        return <div key={item.label} className="rounded-xl border border-blue-50 bg-white px-4 py-3">
          <div className="text-xs text-gray-500">{group === "985/211" ? "985 / 211（含 C9）" : group}</div>
          <div className="mt-1 text-lg font-semibold leading-6 text-gray-900">{item.value}</div>
          {band && <div className="mt-2 border-t border-gray-100 pt-2 text-xs leading-5 text-gray-600">
            <p>案例参考：{formatHkBand(band)}</p>
            <p className="text-gray-500">{band.basisLabel}{band.limited ? " · 样本较少" : ""}</p>
          </div>}
        </div>;
      })}
    </div>
    {focus && <div className="rounded-lg bg-blue-50/60 p-3 text-xs leading-6 text-gray-700"><span className="font-semibold">申请重点：</span>{focus.value}</div>}
    <p className="text-xs leading-5 text-gray-500">先看大致区间，再结合专业背景、学制路径与官网要求判断。</p>
    <details className="text-xs leading-6 text-gray-500">
      <summary className="cursor-pointer text-blue-700">查看录取案例与参考依据</summary>
      <p className="my-3">上方建议区间用于选校初筛；案例参考来自行业公开录取案例，两者分别展示。澳洲 WAM / GPA 不直接换算为中国均分，录取案例也不作为语言门槛。</p>
      {cases && <HkApplicantProfile profile={cases} compact={compact} />}
      {!cases && <p>暂缺可用案例统计，请结合课程官网要求判断。</p>}
    </details>
  </div>;
}
