'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {getFavorites,removeFavorite,FAVORITES_UPDATED_EVENT} from '@/lib/storage';
import {readStudentLists,saveStudentLists,STUDENT_LISTS_EVENT,type StudentList} from '@/lib/shortlist';
import type {CatalogItem,SchoolSummary} from '@/lib/catalog-types';
import CatalogCard from '@/components/CatalogCard';
import ShortlistBackupTools from '@/components/ShortlistBackup';
import {planPath,SHARE_LIMIT} from '@/lib/plan';

export default function FavoritesClient(){
 const [ids,setIds]=useState<string[]>([]),[lists,setLists]=useState<StudentList[]>([]),[active,setActive]=useState('');
 const [name,setName]=useState(''),[rename,setRename]=useState(''),[confirmDelete,setConfirmDelete]=useState(false),[deleted,setDeleted]=useState<StudentList|null>(null);
 const [items,setItems]=useState<CatalogItem[]>([]),[schools,setSchools]=useState<SchoolSummary[]>([]),[chosen,setChosen]=useState<string[]>([]);
 const [message,setMessage]=useState(''),[loading,setLoading]=useState(false);
 useEffect(()=>{
  const syncFavorites=()=>setIds(getFavorites()),syncLists=()=>setLists(readStudentLists());
  const sync=()=>{syncFavorites();syncLists();};sync();
  window.addEventListener(FAVORITES_UPDATED_EVENT,syncFavorites);window.addEventListener(STUDENT_LISTS_EVENT,syncLists);window.addEventListener('storage',sync);
  return()=>{window.removeEventListener(FAVORITES_UPDATED_EVENT,syncFavorites);window.removeEventListener(STUDENT_LISTS_EVENT,syncLists);window.removeEventListener('storage',sync);};
 },[]);
 const selected=lists.find(x=>x.id===active);const current=selected?.ids||ids;const currentKey=JSON.stringify(current);
 useEffect(()=>{setRename(selected?.name||'');setConfirmDelete(false);},[active,selected?.name]);
 useEffect(()=>{
  const c=new AbortController();setMessage('');setItems([]);setSchools([]);setChosen([]);
  const requestIds=JSON.parse(currentKey) as string[];
  if(!requestIds.length){setLoading(false);return;}setLoading(true);
  (async()=>{
   const merged:CatalogItem[]=[],foundSchools:SchoolSummary[]=[];let missing=0;
   for(let start=0;start<requestIds.length;start+=200){
    const r=await fetch('/api/catalog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids:requestIds.slice(start,start+200)}),signal:c.signal});
    if(!r.ok)throw Error('清单资料读取失败，请重试。');const data=await r.json();merged.push(...data.items);foundSchools.push(...data.schools);missing+=data.missing.length;
   }
   if(c.signal.aborted)return;setItems(merged);setSchools(foundSchools);setChosen(merged.length<=SHARE_LIMIT?merged.map(p=>p.id):[]);
   if(missing)setMessage(`${missing} 个历史收藏暂时找不到，原记录仍保留。`);
  })().catch(e=>{if(!c.signal.aborted)setMessage(e.message);}).finally(()=>{if(!c.signal.aborted)setLoading(false);});
  return()=>c.abort();
 },[currentKey]);
 function update(transform:(existing:StudentList[])=>StudentList[]){try{const next=transform(readStudentLists());saveStudentLists(next);setLists(next);setMessage('');return true;}catch(e){setMessage(e instanceof Error?e.message:'本机保存失败，请先导出清单。');return false;}}
 function create(){if(!name.trim()){setMessage('请填写学生代号。');return;}const id=crypto.randomUUID();if(update(existing=>{if(existing.length>=100)throw Error('最多保存100份清单，请先备份并整理旧清单。');return [...existing,{id,name:name.trim(),ids:[],note:''}];})){setActive(id);setName('');}}
 function remove(id:string){if(selected)update(existing=>existing.map(x=>x.id===active?{...x,ids:x.ids.filter(i=>i!==id)}:x));else removeFavorite(id);}
 function deleteList(){if(!selected)return;const old=selected;if(update(existing=>existing.filter(x=>x.id!==old.id))){setDeleted(old);setActive('');setConfirmDelete(false);}}
 function undoDelete(){if(!deleted)return;const old=deleted;if(update(existing=>[...existing,{...old,id:existing.some(x=>x.id===old.id)?crypto.randomUUID():old.id}]))setDeleted(null);}
 const selectedIds=items.filter(p=>chosen.includes(p.id)).map(p=>p.id);
 const canShare=!loading&&selectedIds.length>0&&selectedIds.length<=SHARE_LIMIT;
 function openPlan(){if(!canShare)return;try{sessionStorage.setItem('liuxueku_plan_draft_v1',JSON.stringify({name:selected?.name||'我的选校方案',note:selected?.note||'',ids:selectedIds}));location.href=planPath(selectedIds)+'&draft=1';}catch{setMessage('当前浏览器无法保存方案草稿，请先导出备份或使用公开专业链接。');}}
 function exportText(){const text=[selected?.name||'我的收藏',`导出日期：${new Date().toLocaleDateString('zh-CN')}`,selected?.note||'',...schools.map(s=>`${s.name} · ${s.region}`),...items.map(p=>[p.school+' / '+p.name,p.cycle,p.state.label,'学费：'+p.fee,'语言：'+p.language,'截止：'+p.deadline,'详情：'+location.origin+'/programs/'+p.id,'官网：'+p.officialUrl].join('\n'))].join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='选校清单.txt';a.click();URL.revokeObjectURL(url);}
 return <main className="design-container py-8">
  <h1 className="text-2xl font-bold">收藏与学生清单</h1><p className="mt-2 text-sm leading-7 text-gray-600">保存在当前浏览器，可使用学生代号分类；暂不跨设备同步，请及时导出备份。</p>
  {deleted&&<div role="status" className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm"><span>已删除“{deleted.name}”清单，我的收藏保留。</span><button className="ui-secondary" onClick={undoDelete}>撤销删除</button></div>}
  <section className="my-5 rounded-2xl border bg-white p-5">
   <div className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <label className="min-w-0 text-sm">当前清单<select className="ui-input mt-2" value={active} onChange={e=>setActive(e.target.value)}><option value="">我的收藏</option>{lists.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
    <label className="min-w-0 text-sm">学生代号<input className="ui-input mt-2" maxLength={60} value={name} onChange={e=>setName(e.target.value)} placeholder="如 学生A / 2027商科"/></label><button className="ui-primary" onClick={create}>新建清单</button>
   </div>
   {selected&&<>
    <div className="mt-5 flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-sm">清单名称<input className="ui-input mt-2" maxLength={60} value={rename} onChange={e=>setRename(e.target.value)}/></label><button className="ui-secondary" disabled={!rename.trim()||rename.trim()===selected.name} onClick={()=>update(existing=>existing.map(x=>x.id===active?{...x,name:rename.trim()}:x))}>保存名称</button><button className="ui-secondary" onClick={()=>setConfirmDelete(true)}>删除此清单</button></div>
    {confirmDelete&&<div role="alert" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7"><p>删除“{selected.name}”及其中的顾问备注？我的收藏和院校资料不会删除。</p><div className="mt-2 flex flex-wrap gap-3"><button className="ui-secondary" onClick={()=>setConfirmDelete(false)}>取消</button><button className="ui-secondary" onClick={deleteList}>确认删除清单</button></div></div>}
    <label className="mt-4 block text-sm">顾问备注<textarea className="ui-input mt-2 min-h-28" maxLength={2000} value={selected.note} placeholder="目标、预算、待补材料等" onChange={e=>update(existing=>existing.map(x=>x.id===active?{...x,note:e.target.value}:x))}/></label><button className="mt-3 min-h-11 text-sm text-blue-700" onClick={()=>update(existing=>existing.map(x=>x.id===active?{...x,ids:[...new Set([...x.ids,...ids])]}:x))}>将我的收藏复制到此清单</button>
   </>}
   <div className="mt-5 flex flex-wrap gap-4 text-sm"><Link href="/programs">查找专业</Link><Link href="/compare">专业对比</Link><button onClick={exportText} disabled={loading}>导出完整清单与备注</button></div>
  </section>
  <ShortlistBackupTools onRestore={()=>{setIds(getFavorites());setLists(readStudentLists());}}/>
  <section className="my-5 rounded-2xl border border-blue-100 bg-blue-50 p-5"><h2 className="font-semibold">本次方案与咨询</h2><p className="mt-2 text-sm leading-7">已选 {selectedIds.length} / {SHARE_LIMIT} 个专业。勾选下方专业生成方案或咨询摘要，完整清单继续保留。</p>
   {items.length>SHARE_LIMIT&&<p className="mt-2 text-sm leading-7 text-blue-800">这份清单超过20个专业，请选择本次要沟通的项目，不会自动截掉剩余专业。</p>}
   <div className="mt-3 flex flex-wrap gap-3"><button className="ui-secondary" disabled={!items.length||loading} onClick={()=>setChosen(items.slice(0,SHARE_LIMIT).map(p=>p.id))}>{items.length>SHARE_LIMIT?'选择前20个专业':'选择全部专业'}</button><button className="ui-secondary" onClick={()=>setChosen([])}>取消选择</button></div>
   <div className="mt-4 flex flex-wrap gap-3"><button className="ui-primary" disabled={!canShare} onClick={openPlan}>生成选校方案 / 保存 PDF</button>{canShare?<Link className="ui-secondary" href={'/contact?ids='+selectedIds.map(encodeURIComponent).join(',')}>请顾问看看所选专业</Link>:<button className="ui-secondary" disabled>请先选择专业</button>}</div>
  </section>
  <p role="status" className="mb-4 text-sm text-gray-600">{loading?'正在读取清单…':message||`${schools.length} 所学校 · ${items.length} 个专业`}</p>
  {schools.length>0&&<section className="mb-6"><h2 className="mb-3 font-semibold">学校收藏</h2><div className="grid gap-3 sm:grid-cols-3">{schools.map(s=><article key={s.id} className="rounded-xl border bg-white p-4"><Link href={`/schools/${s.id}`} className="font-semibold text-blue-700">{s.name}</Link><p className="mt-2 text-sm">{s.region} · {s.programs} 个项目</p><button className="mt-2 min-h-11 text-xs text-gray-500" onClick={()=>remove(s.id)}>从当前清单移除</button></article>)}</div></section>}
  <div className="grid items-start gap-4 lg:grid-cols-2">{items.map(p=><div key={p.id} className="min-w-0"><label className="mb-2 flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" aria-label={`纳入本次方案：${p.name}`} checked={chosen.includes(p.id)} disabled={!chosen.includes(p.id)&&chosen.length>=SHARE_LIMIT} onChange={e=>setChosen(x=>e.target.checked?[...x,p.id]:x.filter(id=>id!==p.id))}/>纳入本次方案</label><CatalogCard item={p}/>{selected&&<button className="min-h-11 p-2 text-xs text-gray-500" onClick={()=>remove(p.id)}>从当前学生清单移除</button>}</div>)}</div>
  {!loading&&!current.length&&<p className="rounded-xl bg-white p-8 text-center">清单暂无记录。可以在学校或专业页面点击收藏。</p>}
 </main>;
}
