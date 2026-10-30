import type { AdmissionsPreview } from "@/types";

export function HKUSources({ sources }: { sources: AdmissionsPreview["sources"]["fee"] }) {
  return <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
    {sources.map(s => <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline underline-offset-2 hover:text-blue-900">{s.label} ↗</a>)}
  </div>;
}

export default function HKUApplicationGuide({ info }: { info: AdmissionsPreview }) {
  return <section className="rounded-2xl border border-gray-100 bg-white p-6" aria-labelledby="official-entry-title">
    <h2 id="official-entry-title" className="scroll-mt-24 text-lg font-semibold text-gray-900">官方录取要求与申请注意事项</h2>
    <p className="mt-2 text-xs leading-5 text-gray-500">{info.cycle} · {info.mode} · {info.applicantScope}</p>
    {info.notices.map(note => <p key={note} className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">{note}</p>)}
    <div className="mt-4 space-y-4">
      {info.sections.map((section, index) => <details key={section.title} open={index===0} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900">{section.title}</summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-6 text-gray-700">
          {section.lines.map(line => <li key={line}>{line}</li>)}
        </ul>
        <HKUSources sources={section.sources} />
      </details>)}
    </div>
  </section>;
}
