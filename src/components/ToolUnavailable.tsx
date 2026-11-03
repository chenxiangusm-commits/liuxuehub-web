import Link from 'next/link';
export default function ToolUnavailable({title}:{title:string}) {
  return <main className="design-container py-12"><section className="mx-auto max-w-2xl rounded-2xl border bg-white p-7 sm:p-10"><p className="eyebrow">文书与申请工具</p><h1 className="mt-3 text-2xl font-bold">{title}</h1><span className="meta-chip mt-4">筹备中 · 暂未开放生成</span><p className="mt-5 leading-7 text-slate-600">这项工具目前不能生成结果。你可以先查询课程要求、整理目标清单，或把选校方案交给顾问进一步沟通。</p><div className="mt-7 flex flex-wrap gap-3"><Link className="ui-primary" href="/favorites">整理我的选校方案</Link><Link className="ui-secondary" href="/contact">联系顾问</Link><Link className="ui-secondary" href="/ai">查看工具状态</Link></div></section></main>;
}
