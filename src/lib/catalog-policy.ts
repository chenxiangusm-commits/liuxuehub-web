import type { ProgramIndexItem } from '@/types';
import type { AdmissionState } from './admissions-state';

export const SUBJECTS: Record<string, RegExp> = {
  '商科': /business|finance|account|econom|marketing|management|商科|金融|会计|经济|营销|管理/i,
  '计算机与AI': /computer|computing|software|informatics|artificial intelligence|计算机|软件|人工智能|信息技术/i,
  '数据科学': /data science|data analytics|statistics|数据科学|数据分析|大数据|统计/i,
  '工程': /engineer|mechanical|electrical|civil|工程|机械|电子|电气/i,
  '教育': /education|teaching|pedagogy|教育|教学/i,
  '传媒': /media|communication|journalism|传媒|传播|新闻/i,
  '法律': /\blaw\b|legal|juris|法律|法学/i,
  '医学健康': /medicine|medical|nursing|health|医学|护理|健康|公共卫生/i,
  '心理学': /psychology|psychological|心理/i,
  '建筑设计': /architecture|urban design|建筑|设计/i,
  '环境可持续': /environment|sustainab|环境|可持续/i,
  '社科人文': /social|humanities|history|philosophy|politic|社会|人文|历史|哲学|政治/i,
};
export function matchesSubject(p: ProgramIndexItem, subject: string) {
  return !subject || Boolean(SUBJECTS[subject]?.test(`${p.major_cn} ${p.major_en}`));
}
export function publishedIelts(p: ProgramIndexItem): number | null {
  const text = p.admissions_preview?.languageShort || '';
  const m = text.match(/(?:IELTS|雅思(?:学术类)?)[^\d]{0,24}([4-9](?:\.[05])?)/i);
  return m ? Number(m[1]) : null;
}
// The label describes available evidence; a future deadline is not proof of a place.
export function informationPriority(p: ProgramIndexItem, state: AdmissionState) {
  if (state.code === 'archived') return 5;
  if (state.code === 'closed') return 4;
  if (p.admissions_preview?.entryYear && state.code === 'upcoming_deadline') return 0;
  if (p.admissions_preview?.entryYear) return 1;
  return p.admissions_preview ? 2 : 3;
}
