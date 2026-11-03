import { languageFromRecords } from './presentation';
import { getAllSchools,getProgramIndex,getProgramById } from './data.server';
import { admissionsState,feeAmount } from './admissions-state';
import { getQSLabel,getQSYear,getQSRank } from './qs-ranking';
import { getHkProgramProfile } from './hk-applicant-profile.server';
import { getAuProgramProfile } from './au-applicant-profile.server';
import { getSgProgramProfile } from './sg-applicant-profile.server';
import { getUkProgramProfile } from './uk-applicant-profile.server';
import type { ProgramIndexItem,Program } from '@/types';
import type { CatalogItem,SchoolSummary } from './catalog-types';
import {informationPriority,matchesSubject,publishedIelts} from './catalog-policy';
export function summarizeProgram(p:ProgramIndexItem|Program):CatalogItem {
 const a=p.admissions_preview;
 return {id:p.id,schoolCode:p.school_code,school:p.school_name,name:p.major_cn||p.major_en,nameEn:p.major_en,region:p.region_cn,degree:p.degree,level:p.education_level,duration:p.duration||'官网未明确',fee:a?.feeShort||p.fee||'官网未明确',feeNote:a?.feeNote,language:a?.languageShort||p.language_requirement||languageFromRecords(p.ielts,p.toefl)||'官网未明确',deadline:a?.deadlineSummary||p.deadline||'官网未明确',cycle:a?.cycle||'历史资料，当前批次待确认',year:a?.entryYear??null,updated:a?.updatedOn||('last_updated' in p?p.last_updated:'')||'',rank:getQSRank(p)>0?`QS ${getQSYear(p)} · ${getQSLabel(p)}`:'',officialUrl:('official_url' in p?p.official_url:'')||a?.sources.catalogue[0]?.url||'',state:admissionsState(p),hasCurrentPresentation:Boolean(a)};
}
export function programProfile(p:ProgramIndexItem) {
 return p.region_cn==='中国香港'?getHkProgramProfile(p.id):p.region_cn==='英国'?getUkProgramProfile(p.id):p.region_cn==='新加坡'?getSgProgramProfile(p.id):p.region_cn==='澳大利亚'?getAuProgramProfile(p.id)?.caseProfile:undefined;
}
export async function catalogPage(params:URLSearchParams) {
 const index=await getProgramIndex();
 const q=(params.get('q')||'').trim().toLowerCase().slice(0,150);
 const region=params.get('region')||'';const school=params.get('school')||'';
 const level=params.get('level')||'postgraduate';const year=params.get('year')||'';
 const status=params.get('status')||'current';const duration=params.get('duration')||'';
 const currency=params.get('currency')||'';const basis=params.get('basis')||'total';
 const max=Number(params.get('maxFee')||0);const rmbMax=Number(params.get('rmbMax')||0);const fxRate=Number(params.get('fxRate')||0);
 const now=new Date();
 const subject=params.get('subject')||'';
 const rankMax=Number(params.get('rankMax')||0);
 const ieltsMax=Number(params.get('ieltsMax')||0);
 const background=params.get('background')||'';
 let found=index.filter(p=>{
  if(level!=='all'&&p.education_level!==level)return false;
  if(region&&p.region_cn!==region)return false;
  if(school&&![p.school_code,p.school_name,p.school_name_en].includes(school))return false;
  if(q&&![p.major_cn,p.major_en,p.degree,p.school_name,p.school_name_en].join(' ').toLowerCase().includes(q))return false;
  if(!matchesSubject(p,subject))return false;
  if(rankMax>0&&(!getQSRank(p)||getQSRank(p)>rankMax))return false;
  if(ieltsMax>0){const score=publishedIelts(p);if(score===null||score>ieltsMax)return false;}
  if(background==='open'){
   const text=p.admissions_preview?.sections.map(s=>s.lines.join(' ')).join(' ')||'';
   if(!/any (?:academic )?(?:discipline|background)|不限(?:本科)?专业|不限制本科专业|不要求特定专业背景/i.test(text))return false;
  }
  if(year&&String(p.admissions_preview?.entryYear)!==year)return false;
  if(duration&&!(p.duration||'').includes(duration))return false;
  const s=admissionsState(p,now);
  if(status==='current'&&['archived','closed'].includes(s.code))return false;
  if(status==='deadline'&&s.code!=='upcoming_deadline')return false;
  if(status==='published'&&(!p.admissions_preview?.entryYear||['closed','archived'].includes(s.code)))return false;
  if(status==='pending'&&(p.admissions_preview?.entryYear||['closed','archived'].includes(s.code)))return false;
  if(status==='history'&&!['archived','closed'].includes(s.code))return false;
  if(currency&&Number.isFinite(max)&&max>0){const fee=feeAmount(p.admissions_preview?.feeShort||'');if(!fee||fee.currency!==currency||fee.basis!==basis||fee.amount>max)return false;}
  if(currency&&Number.isFinite(rmbMax)&&rmbMax>0&&Number.isFinite(fxRate)&&fxRate>0&&fxRate<=1000){const fee=feeAmount(p.admissions_preview?.feeShort||'');if(!fee||fee.currency!==currency||fee.basis!==basis||fee.amount*fxRate>rmbMax)return false;}
  return true;
 });
 const states=new Map(found.map(p=>[p.id,admissionsState(p,now)]));
 const sort=params.get('sort')||'ready';
 found=found.sort((a,b)=>{
  const sa=states.get(a.id)!,sb=states.get(b.id)!;
  if(sort==='deadline')return (sa.nextDate||'9999').localeCompare(sb.nextDate||'9999')||a.id.localeCompare(b.id);
  if(sort==='rank')return (getQSRank(a)||99999)-(getQSRank(b)||99999)||a.id.localeCompare(b.id);
  if(sort==='name')return a.school_name.localeCompare(b.school_name,'zh-CN')||a.id.localeCompare(b.id);
  return informationPriority(a,sa)-informationPriority(b,sb)||(sa.nextDate||'9999').localeCompare(sb.nextDate||'9999')||(getQSRank(a)||99999)-(getQSRank(b)||99999)||a.id.localeCompare(b.id);
 });
 const counts={published:found.filter(p=>p.admissions_preview?.entryYear&&!['closed','archived'].includes(states.get(p.id)!.code)).length,pending:found.filter(p=>!p.admissions_preview?.entryYear&&!['closed','archived'].includes(states.get(p.id)!.code)).length,history:found.filter(p=>['closed','archived'].includes(states.get(p.id)!.code)).length};
 const pages=Math.max(1,Math.ceil(found.length/12));const raw=Number(params.get('page')||1);const page=Number.isFinite(raw)?Math.min(pages,Math.max(1,Math.floor(raw))):1;
 const items=found.slice((page-1)*12,page*12).map(p=>({...summarizeProgram(p),...(params.get('match')==='1'?{profile:programProfile(p)}:{})}));
 return {items,total:found.length,page,pages,counts,regions:[...new Set(index.map(p=>p.region_cn))].sort(),schoolCount:new Set(index.map(p=>p.school_code)).size};
}
export async function resolveCollection(ids:string[]) {
 const schools=await getAllSchools();const schoolMap=new Map(schools.map(s=>[s.school_code,s]));
 const unique=[...new Set(ids)];const selectedSchools:SchoolSummary[]=[];const items:CatalogItem[]=[];const missing:string[]=[];
 for(const id of unique){const s=schoolMap.get(id);if(s){selectedSchools.push({id:s.school_code,name:s.school_name,region:s.region_cn,programs:s.total_programs});continue;}const p=await getProgramById(id);if(p)items.push(summarizeProgram(p));else missing.push(id);}
 return {items,schools:selectedSchools,missing};
}
