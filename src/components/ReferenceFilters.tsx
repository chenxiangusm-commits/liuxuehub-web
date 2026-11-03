'use client';
import {useState} from 'react';
type School={code:string;name:string;region:string};
export default function ReferenceFilters({schools,initialRegion,initialSchool}:{schools:School[];initialRegion:string;initialSchool:string}){
 const [region,setRegion]=useState(initialRegion),[school,setSchool]=useState(initialSchool);
 const available=schools.filter(s=>!region||s.region===region);
 return <form className="my-7 grid items-end gap-3 rounded-2xl border bg-white p-5 sm:grid-cols-3" action="/references">
  <label className="text-sm">地区<select name="region" value={region} className="ui-input mt-2" onChange={e=>{const next=e.target.value;setRegion(next);if(!schools.some(s=>s.code===school&&(!next||s.region===next)))setSchool('');}}><option value="">全部地区</option>{[...new Set(schools.map(s=>s.region))].map(r=><option key={r}>{r}</option>)}</select></label>
  <label className="text-sm">学校<select name="school" required value={school} className="ui-input mt-2" onChange={e=>setSchool(e.target.value)}><option value="">请选择学校</option>{available.map(s=><option key={s.code} value={s.code}>{s.name}</option>)}</select></label>
  <button className="ui-primary" disabled={!school}>查看参考</button>
 </form>;
}
