'use client';
import Link from 'next/link';
import { useState } from 'react';
import { SITE } from '@/config/site';
import { consultationText } from '@/lib/plan';
import type { CatalogItem } from '@/lib/catalog-types';

export default function ContactClient({items}: {items: CatalogItem[]}) {
  const [goal, setGoal] = useState('');
  const [year, setYear] = useState('');
  const [question, setQuestion] = useState('');
  const [message, setMessage] = useState('');
  const text = [consultationText(items), goal.trim() && '目标地区或专业：'+goal.trim(),
    year.trim() && '计划入学：'+year.trim(), question.trim() && '我想了解：'+question.trim()].filter(Boolean).join('\n\n');
  const long = encodeURIComponent(text).length > 1500;
  const body = long ? '您好，我想咨询留学申请。完整咨询摘要将粘贴在此邮件中。' : text;
  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setMessage(label+'已复制。'); }
    catch { setMessage('浏览器未能复制，请长按或选中页面中的文字手动复制。'); }
  }
  return <>
    <section className="mt-5 rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold">整理咨询摘要</h2>
      <p className="mt-2 text-sm text-slate-600">以下内容均可选，仅在当前页面生成邮件草稿。</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>目标地区或专业<input className="ui-input mt-1" maxLength={120} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="例如 香港 · 数据科学"/></label>
        <label>计划入学时间<input className="ui-input mt-1" maxLength={50} value={year} onChange={e=>setYear(e.target.value)} placeholder="例如 2027年秋季"/></label>
        <label className="sm:col-span-2">想请顾问帮你看什么<textarea className="ui-input mt-1" maxLength={500} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="例如 我的本科专业是否满足先修课要求？"/></label>
      </div>
      <h3 className="mt-5 font-semibold">本次咨询摘要{items.length>0 && ' · '+items.length+' 个专业'}</h3>
      <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm leading-7">{text}</p>
      <p className="mt-4 text-sm leading-7 text-slate-600">{long && '摘要较长，请先复制完整摘要，再粘贴到邮件。'}由你在邮件应用里确认发送。也可以复制邮箱和摘要，在常用邮箱中发送。</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className="ui-primary" href={'mailto:'+SITE.email+'?subject='+encodeURIComponent('选校方案咨询｜九万里留学库')+'&body='+encodeURIComponent(body)}>打开咨询邮件草稿</a>
        <button className="ui-secondary" onClick={()=>copy(SITE.email,'邮箱')}>复制邮箱</button>
        <button className="ui-secondary" onClick={()=>copy(text,'咨询摘要')}>复制咨询摘要</button>
      </div>
      <p role="status" className="mt-2 text-sm text-blue-700">{message}</p>
    </section>
    <div className="mt-5 flex flex-wrap gap-4"><Link className="ui-secondary" href="/favorites">整理我的清单</Link><Link className="ui-secondary" href="/programs">继续查专业</Link></div>
  </>;
}
