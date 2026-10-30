"use client";
import Link from 'next/link';
import Image from 'next/image';
import {useEffect,useState} from 'react';
import {getFavorites,toggleFavorite,FAVORITES_UPDATED_EVENT} from '@/lib/storage';
import {getSchoolLogo} from '@/lib/schoolLogos';
import {localizedUnits} from '@/lib/presentation';
import type {CatalogItem} from '@/lib/catalog-types';
import CompareButton from './CompareButton';
import Icon from './ui/Icon';

export default function CatalogCard({item,children}:{item:CatalogItem;children?:React.ReactNode}) {
  const [favorite,setFavorite]=useState(false);
  useEffect(()=>{const sync=()=>setFavorite(getFavorites().includes(item.id));sync();window.addEventListener(FAVORITES_UPDATED_EVENT,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(FAVORITES_UPDATED_EVENT,sync);window.removeEventListener('storage',sync);};},[item.id]);
  return <article className="catalog-card">
    <div className="flex items-center gap-3">
      <Link href={`/schools/${item.schoolCode}`} className="school-logo-small" aria-label={`查看${item.school}`}><Image src={getSchoolLogo(item.schoolCode)} alt="" width={40} height={40}/></Link>
      <div className="min-w-0 flex-1"><Link href={`/schools/${item.schoolCode}`} className="text-sm font-semibold text-slate-800 hover:text-blue-700">{item.school}</Link><p className="mt-0.5 text-xs text-slate-500">{item.region}{item.rank&&` · ${item.rank}`}</p></div>
      <button aria-label={favorite?`取消收藏${item.name}`:`收藏${item.name}`} aria-pressed={favorite} onClick={()=>toggleFavorite(item.id)} className={`icon-button ${favorite?'text-rose-600':'text-slate-500'}`}><Icon name="heart" fill={favorite?'currentColor':'none'}/></button>
    </div>
    <div className="mt-4"><h2 className="text-lg font-semibold leading-7 text-slate-950"><Link href={`/programs/${item.id}`} className="text-inherit hover:text-blue-700">{item.name}</Link></h2><p className="mt-1 text-sm leading-5 text-slate-500">{item.nameEn}</p></div>
    <div className="mt-3 flex flex-wrap items-center gap-2"><span className="meta-chip">{item.degree|| (item.level==='undergraduate'?'本科':'研究生')}</span><span className={`status-chip ${item.state.code==='upcoming_deadline'?'status-known':''}`}>{item.state.label}</span></div>
    <p className="mt-3 text-xs leading-5 text-slate-600">招生批次：{item.cycle}</p>
    <dl className="catalog-facts">
      <div className="catalog-fee"><dt>国际生学费</dt><dd>{localizedUnits(item.fee)}{item.feeNote&&<p className="mt-1 text-xs font-normal leading-5 text-slate-600">{item.feeNote}</p>}</dd></div>
      <div><dt>学制</dt><dd className="font-medium">{localizedUnits(item.duration)}</dd></div>
      <div className="col-span-2"><dt>语言条件</dt><dd>{item.language}</dd></div>
    </dl>
    <div className="catalog-deadline"><div className="flex items-center gap-2 text-xs font-medium text-slate-600"><Icon name="clock" width="16" height="16"/>申请截止时间</div>
      {item.state.nextDate?<><p className="mt-1 text-base font-semibold tabular-nums text-slate-900">{item.state.nextDate} <span className="text-xs font-normal text-slate-600">下一截止日</span></p><details className="mt-1 text-xs leading-6 text-slate-600"><summary className="cursor-pointer text-blue-700">查看轮次与适用条件</summary><p>{item.deadline}</p></details></>:<p className="mt-1 text-sm leading-6 text-slate-700">{item.deadline}</p>}
    </div>
    {children}
    <div className="catalog-actions"><Link href={`/programs/${item.id}`} className="ui-primary">查看专业 <Icon name="arrow" width="16" height="16"/></Link><CompareButton id={item.id}/></div>
  </article>;
}
