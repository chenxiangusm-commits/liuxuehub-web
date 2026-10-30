"use client";
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {normalizeStudyPlanTimeline,type StudyPlanResult} from '@/lib/ai/studyPlanMock';
function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {(items.length ? items : ["建议补充确认"]).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultView({ result }: { result: StudyPlanResult }) {
  const timeline = normalizeStudyPlanTimeline(result.timeline);
  const strategies = [
    ["冲刺", result.schoolStrategy.reach, "border-red-100 bg-red-50/50"],
    ["匹配", result.schoolStrategy.match, "border-blue-100 bg-blue-50/50"],
    ["保底", result.schoolStrategy.safe, "border-emerald-100 bg-emerald-50/50"],
  ] as const;

  return (
    <div className="mt-10 space-y-6">
      <Card className="p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge variant="primary">AI生成结果</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">学生画像</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{result.studentProfile.summary}</p>
          </div>

        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ListBlock title="优势" items={result.studentProfile.strengths} />
          <ListBlock title="短板" items={result.studentProfile.weaknesses} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {strategies.map(([label, list, style]) => (
          <Card key={label} className={`p-5 shadow-sm ${style}`}>
            <h3 className="text-xl font-black text-slate-950">{label}方案</h3>
            <div className="mt-4 space-y-3">
              {(list.length ? list : [{ school: "建议补充确认", program: "建议补充确认", reason: "需要更多学生背景后细化。", risk: "信息不足。" }]).map((item) => (
                <div key={`${label}-${item.school}-${item.program}`} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="font-bold text-slate-950">{item.school}</div>
                  <div className="mt-1 text-sm font-semibold text-blue-600">{item.program}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                  <p className="mt-2 text-xs leading-5 text-red-600">风险：{item.risk}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">SWOT分析</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ListBlock title="优势" items={result.swot.strengths} />
          <ListBlock title="劣势" items={result.swot.weaknesses} />
          <ListBlock title="机会" items={result.swot.opportunities} />
          <ListBlock title="风险" items={result.swot.threats} />
        </div>
      </Card>

      <Card className="p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">申请时间线</h2>
        <div className="mt-5 space-y-4">
          {timeline.map((item) => (
            <div key={`${item.time}-${item.stage}`} className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-950">{item.stage}</h3>
                <span className="text-sm font-bold text-blue-600">{item.time}</span>
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {(item.tasks.length ? item.tasks : ["建议补充确认"]).map((task) => (
                  <li key={task}>✓ {task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">行动建议</h2>
          <div className="mt-5 space-y-3">
            {result.actionPlan.map((item) => (
              <div key={`${item.priority}-${item.action}`} className="rounded-2xl bg-slate-50 p-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">优先级：{item.priority}</span>
                <h3 className="mt-3 font-bold text-slate-950">{item.action}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">顾问备注与风险提示</h2>
          <div className="mt-5 space-y-4">
            <ListBlock title="顾问备注" items={result.advisorNotes} />
            <ListBlock title="风险提示" items={result.riskNotes} />
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm">
        <h2 className="font-bold">方案依据与保存</h2>
        <p className="my-3 text-sm text-slate-600">{result.disclaimer}</p>
        {(result.references||[]).map(p=><div key={p.id} className="my-2 border-b pb-2 text-sm"><a className="text-blue-600 underline" href={'/programs/'+p.id}>{p.school} · {p.name}</a><p>{p.cycle} · {p.deadline}</p><p>学费：{p.fee} · 语言：{p.language}</p><span>资料日期：{p.updated||'未记录'}</span></div>)}
        <p className="text-sm text-slate-500">仅保存在本机浏览器。可下载后自行发送给学生；不会自动发送。</p>
        <div className="mt-4 flex gap-3"><button className="rounded-lg bg-blue-600 px-4 py-2 text-white" onClick={()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='留学规划.json';a.click();URL.revokeObjectURL(u);}}>下载方案</button><button className="rounded-lg border px-4 py-2" onClick={()=>window.print()}>打印 / 保存PDF</button></div>
      </Card>
    </div>
  );
}
