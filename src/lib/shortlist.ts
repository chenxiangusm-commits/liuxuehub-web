export const COMPARE_EVENT='liuxuehub-compare-updated';
const COMPARE_KEY='liuxuehub_compare_v1';
export function readCompare():string[]{try{const x=JSON.parse(localStorage.getItem(COMPARE_KEY)||'[]');return Array.isArray(x)?x.filter(v=>typeof v==='string').slice(0,4):[];}catch{return [];}}
export function saveCompare(ids:string[]){localStorage.setItem(COMPARE_KEY,JSON.stringify([...new Set(ids)].slice(0,4)));window.dispatchEvent(new Event(COMPARE_EVENT));}
export type StudentList={id:string;name:string;ids:string[];note:string};
export function readStudentLists():StudentList[]{try{const x=JSON.parse(localStorage.getItem('liuxuehub_student_lists_v1')||'[]');return Array.isArray(x)?x.filter(v=>v&&typeof v.id==='string'&&typeof v.name==='string'&&Array.isArray(v.ids)).map(v=>({...v,ids:v.ids.filter((id:unknown)=>typeof id==='string'),note:typeof v.note==='string'?v.note:''})):[];}catch{return [];}}
export function saveStudentLists(lists:StudentList[]){localStorage.setItem('liuxuehub_student_lists_v1',JSON.stringify(lists));}
