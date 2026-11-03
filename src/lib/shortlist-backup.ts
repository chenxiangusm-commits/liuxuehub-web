import type {StudentList} from './shortlist';
export interface ShortlistBackup{kind:'liuxueku-shortlist-backup';version:1;createdAt:string;favorites:string[];lists:StudentList[]}
function ids(value:unknown):string[]{
 if(!Array.isArray(value)||value.length>2000||value.some(v=>typeof v!=='string'||!v||v.length>300))throw Error('备份中的专业编号格式不正确。');
 return [...new Set(value as string[])];
}
export function parseBackup(text:string):ShortlistBackup{
 if(text.length>1_000_000)throw Error('备份文件超过1MB，请分批保存。');
 const x=JSON.parse(text);
 if(!x||x.kind!=='liuxueku-shortlist-backup'||x.version!==1||!Array.isArray(x.lists)||x.lists.length>100)throw Error('不是九万里清单备份文件。');
 const lists=x.lists.map((v:unknown)=>{
  if(!v||typeof v!=='object')throw Error('学生清单格式不正确。');
  const r=v as Record<string,unknown>;
  if(typeof r.id!=='string'||!r.id||r.id.length>100||typeof r.name!=='string'||!r.name.trim()||r.name.length>60||typeof r.note!=='string'||r.note.length>2000)throw Error('学生清单的名称或备注格式不正确。');
  return {id:r.id,name:r.name,ids:ids(r.ids),note:r.note};
 });
 if(lists.reduce((n: number,l: StudentList)=>n+l.ids.length,0)>10000)throw Error('清单项目过多，请分批导入。');
 return {kind:'liuxueku-shortlist-backup',version:1,createdAt:typeof x.createdAt==='string'?x.createdAt:'',favorites:ids(x.favorites),lists};
}
