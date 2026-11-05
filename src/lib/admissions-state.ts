import type { Program, ProgramIndexItem, AdmissionsPreview } from '@/types';
type RecordInput = Pick<Program | ProgramIndexItem, 'region_cn' | 'deadline' | 'admissions_preview' | 'admissions_review'> & { school_code?: string };
export type AdmissionState = { code: 'archived' | 'closed' | 'upcoming_deadline' | 'unknown'; label: string; detail: string; nextDate?: string };
const zones: Record<string,string> = {'英国':'Europe/London','中国香港':'Asia/Hong_Kong','中国澳门':'Asia/Macau','新加坡':'Asia/Singapore'};
const schoolZones: Record<string,string> = {UNSW:'Australia/Sydney',UTS:'Australia/Sydney',UQ:'Australia/Brisbane'};
export function roundIsClosed(round: AdmissionsPreview['rounds'][number], region: string, now = new Date(), schoolCode?: string) {
  if (round.closed) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(round.date)) return false;
  // Without a confirmed timezone (e.g. multiple Australian zones), allow a full
  // additional day. Do not close an application prematurely based on a guess.
  const zone = (schoolCode && schoolZones[schoolCode]) || zones[region];
  if (!zone) return now.getTime() > Date.parse(round.date+'T23:59:59Z')+24*3600*1000;
  const parts = new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
  const localDate=parts.slice(0,10);
  if(localDate !== round.date) return localDate > round.date;
  const time = round.time?.match(/^(\d{2}:\d{2})(?:\s|$)/)?.[1];
  return Boolean(time && parts.slice(11,16)>time);
}
export function admissionsState(p: RecordInput, now=new Date()): AdmissionState {
  const a=p.admissions_preview;
  const explicit=[a?.deadlineSummary,...(a?.notices||[])].filter(Boolean).join(' ');
  if (/不再开办|本(?:招生)?批次不招生|本批次不再招生|已停办|已取消|停止招生/.test(explicit) || (!a && p.admissions_review?.catalogue_status==='not_offered')) return {code:'archived',label:'历史项目',detail:'当前展示批次不招生，保留历史资料。'};
  const rounds=a?.rounds||[];
  const future=rounds.filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&!roundIsClosed(r,p.region_cn,now,p.school_code)).sort((x,y)=>x.date.localeCompare(y.date));
  if (future.length) return {code:'upcoming_deadline',label:'截止日未到',detail:'请同时确认申请开放时间与剩余名额。',nextDate:future[0].date};
  if ((rounds.length && rounds.every(r=>roundIsClosed(r,p.region_cn,now,p.school_code))) || (a?.deadlineSummary.includes('已截止') && !rounds.some(r=>!roundIsClosed(r,p.region_cn,now,p.school_code)))) return {code:'closed',label:'本批次已截止',detail:'请查看下一招生批次；历史记录保留。'};
  return {code:'unknown',label:a?'申请安排见官网':'批次待确认',detail:a?'未能从现有资料确定下一有效截止日。':'历史资料尚未完成当前批次核验。'};
}
export function feeAmount(text:string): {currency:string;amount:number;basis:string}|null {
  if (/未公布|未明确|待|不适用|尚无|约|预计|往届|历史|每学分|\/学分|per credit|per unit/i.test(text)) return null;
  if(/\d[\d,.]*\s*(?:-|–|—|~|至|到)\s*(?:[A-Z]{3}\s*)?\d/.test(text))return null;
  const m=[...text.matchAll(/\b(HKD|GBP|AUD|SGD|NZD|MOP|USD|CNY|RMB)\s*([\d,]+(?:\.\d{1,2})?)/gi)];
  if(m.length!==1) return null;
  const amount=Number(m[0][2].replace(/,/g,''));
  const basis=/全课程|全程|全项目|total programme|total program/i.test(text)?'total':/每年|[/／]\s*(?:年|标准年负荷|year)|per year|per annum|annual/i.test(text)?'annual':'';
  return amount>0&&basis?{currency:m[0][1].toUpperCase(),amount,basis}:null;
}
