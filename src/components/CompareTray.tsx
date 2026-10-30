'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {readCompare,saveCompare,COMPARE_EVENT} from '@/lib/shortlist';
import type {CatalogItem} from '@/lib/catalog-types';
import Icon from './ui/Icon';

export default function CompareTray() {
  const [ids,setIds]=useState<string[]>([]);
  const [items,setItems]=useState<CatalogItem[]>([]);
  const [expanded,setExpanded]=useState(false);
  const [error,setError]=useState('');
  const pathname=usePathname();
  useEffect(()=>{const sync=()=>setIds(readCompare());sync();window.addEventListener(COMPARE_EVENT,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(COMPARE_EVENT,sync);window.removeEventListener('storage',sync);};},[]);
  useEffect(()=>{const c=new AbortController();setError('');if(!ids.length){setItems([]);return;}fetch('/api/catalog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids}),signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(r=>setItems(r.items)).catch(()=>{if(!c.signal.aborted)setError('名称暂时无法加载，仍可进入对比。');});return()=>c.abort();},[ids]);
  const remove=(id:string)=>{try{saveCompare(readCompare().filter(x=>x!==id));}catch{setError('未能保存，请重试。');}};
  if(!ids.length||!['/programs','/schools','/favorites','/ai/school-match'].some(p=>pathname.startsWith(p)))return null;
  return <><div className="h-24" aria-hidden="true"/><aside aria-label="已选专业对比" className="compare-tray">
    <div className="compare-tray-head"><button className="flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-900" aria-expanded={expanded} aria-controls="compare-tray-items" onClick={()=>setExpanded(x=>!x)}><Icon name="compare"/><span>已选 {ids.length} / 4</span><Icon name="chevron" className={expanded?'rotate-180':''}/></button><Link href="/compare" className="ui-primary">开始对比 <Icon name="arrow" width="16" height="16"/></Link></div>
    <div id="compare-tray-items" className={expanded?'compare-tray-items':'compare-tray-items hidden'}>{ids.map((id,i)=>{const item=items.find(p=>p.id===id);return <div key={id} className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2"><div className="min-w-0 flex-1"><p className="text-xs text-slate-500">{item?.school||'已选专业'}</p><Link href={`/programs/${id}`} className="block truncate text-sm text-slate-800">{item?.name||`专业 ${i+1}`}</Link></div><button aria-label={`移除${item?.name||`专业 ${i+1}`}`} onClick={()=>remove(id)} className="icon-button"><Icon name="close" width="16" height="16"/></button></div>;})}</div>
    {error&&<p role="status" className="text-xs text-amber-800">{error}</p>}
  </aside></>;
}
