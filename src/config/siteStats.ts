import type {School,ProgramIndexItem} from '@/types';
export function getSiteStats(schools:School[],programs:ProgramIndexItem[]){return {schools:schools.length,programs:programs.length,postgraduate:programs.filter(p=>p.education_level==='postgraduate').length};}
