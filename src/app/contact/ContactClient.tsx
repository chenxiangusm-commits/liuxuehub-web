'use client';
import {useEffect,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {SITE} from '@/config/site';
import {consultationText,parseSharedIds} from '@/lib/plan';
import type {CatalogItem} from '@/lib/catalog-types';
export default function ContactClient(){
 const params=useSearchParams();const raw=params.get('ids');const [items,setItems]=useState<CatalogItem[]>([]),[message,setMessage]=useState('');
 useEffect(()=>{const ids=parseSharedIds(raw);setItems([]);if(!ids.length)return;const c=new AbortController();fetch('/api/catalog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids}),signal:c.signal}).then(async r=>{if(!r.ok)throw Error('清单暂时读取失败，可在邮件中补充项目链接。');return r.json();}).then(d=>setItems(d.items)).catch(e=>{if(!c.signal.aborted)setMessage(e.message);});return()=>c.abort();},[raw]);
 const text=consultationText(items);
 // The mail client remains responsible for reviewing and sending; no contact is submitted here.
 const body=encodeURIComponent(text).length<1500?text:`您好，我想咨询一份${items.length}个专业的选校清单。\n请回复我以进一步沟通申请条件、选校组合和材料准备。\n\n我会附上从九万里留学库复制的咨询摘要。`;
 return <main className="design-container py-10"><div className="mx-auto max-w-3xl"><p className="eyebrow">九万里留学库 · 咨询与方案沟通</p><h1 className="mt-2 text-3xl font-bold">让顾问看看我的选校方向</h1><p className="mt-4 leading-7 text-slate-600">带上目标学校和专业、预算与入学年份，沟通申请条件、选校组合和待准备材料。</p><section className="mt-7 rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">联系邮箱</h2><a className="mt-3 block break-all text-xl font-semibold text-blue-700" href={'mailto:'+SITE.email}>{SITE.email}</a><p className="mt-3 text-sm leading-7 text-slate-500">点击下方按钮将打开你的邮件应用。内容由你检查、编辑并发送，本页不会自动发送或提交咨询。较长清单请先复制下方完整摘要，再粘贴到邮件。</p><div className="mt-5 flex flex-wrap gap-3"><a className="ui-primary" href={'mailto:'+SITE.email+'?subject='+encodeURIComponent('选校方案咨询｜九万里留学库')+'&body='+encodeURIComponent(body)}>打开咨询邮件草稿</a><button className="ui-secondary" onClick={async()=>{try{await navigator.clipboard.writeText(text);setMessage('咨询摘要已复制，可粘贴到你的邮件中。');}catch{setMessage('未能复制，可手动选择下方摘要。');}}}>复制咨询摘要</button></div><p role="status" className="mt-3 text-sm text-blue-700">{message}</p></section><section className="mt-6 rounded-2xl border bg-white p-6"><h2 className="text-lg font-semibold">本次咨询摘要{items.length>0&&` · ${items.length} 个专业`}</h2><pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-600">{text}</pre><p className="mt-4 text-xs leading-6 text-slate-500">摘要只包含公开项目资料，不自动读取本机学生备注。请勿在邮件中附上不必要的证件信息。</p></section><div className="mt-6 flex flex-wrap gap-3"><Link className="ui-secondary" href="/favorites">整理选校清单</Link><Link className="ui-secondary" href="/programs">继续查询专业</Link><Link className="ui-secondary" href="/about">了解九万里留学库</Link></div></div></main>;
}
