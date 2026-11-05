import type { CatalogItem } from './catalog-types';
export const SHARE_LIMIT=20;
export function parseSharedIds(value:string|null):string[]{
 if(!value||value.length>7600)return [];
 return [...new Set(value.split(',').filter(s=>/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,299}$/.test(s)))].slice(0,SHARE_LIMIT);
}
export function planPath(ids:string[]){return '/plan?ids='+ids.slice(0,SHARE_LIMIT).map(encodeURIComponent).join(',');}
export function consultationText(items:CatalogItem[]){
 return [items.length?'您好，我想咨询以下选校方案：':'您好，我想咨询留学选校和申请规划。',...items.map((p,i)=>`${i+1}. ${p.school}｜${p.name}\n招生批次：${p.cycle}\n学费：${p.fee}\n语言：${p.language}\n截止：${p.deadline}\n项目：https://www.liuxueku.cn/programs/${encodeURIComponent(p.id)}`),'想进一步确认：申请条件、选校组合和材料准备。'].join('\n\n');
}
