'use client';
import {useEffect,useState} from 'react';
import {readCompare,saveCompare,COMPARE_EVENT} from '@/lib/shortlist';
export default function CompareButton({id}:{id:string}){
 const [ids,setIds]=useState<string[]>([]);const [error,setError]=useState('');
 useEffect(()=>{const sync=()=>setIds(readCompare());sync();window.addEventListener(COMPARE_EVENT,sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener(COMPARE_EVENT,sync);window.removeEventListener('storage',sync);};},[]);
 const selected=ids.includes(id);
 return <span><button type="button" aria-pressed={selected} onClick={e=>{e.preventDefault();e.stopPropagation();const current=readCompare();if(!current.includes(id)&&current.length>=4){setError('最多对比 4 个专业，请先移除一个。');return;}try{saveCompare(current.includes(id)?current.filter(x=>x!==id):[...current,id]);setError('');}catch{setError('浏览器未能保存对比，请检查存储权限。');}}} className={selected ? "ui-secondary compare-selected" : "ui-secondary"}>{selected?'已加入对比':'加入对比'}</button>{error&&<span role="status" className="block text-xs text-amber-800">{error}</span>}</span>;
}
