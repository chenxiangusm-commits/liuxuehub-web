'use client';
export default function DraftActions({text,onEdit}:{text:string;onEdit:()=>void}){
 return <div className="flex flex-wrap gap-3"><button className="rounded-lg border bg-white px-4 py-3 text-sm" onClick={()=>window.print()}>打印 / 保存 PDF</button><button className="rounded-lg border bg-white px-4 py-3 text-sm" onClick={()=>{const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='申请文书草稿.txt';a.click();URL.revokeObjectURL(url);}}>下载可编辑文本</button><button className="rounded-lg border bg-white px-4 py-3 text-sm" onClick={onEdit}>修改素材后重新生成</button></div>;
}
