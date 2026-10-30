"use client";

import { getQSRank, getQSYear, getQSLabel } from "@/lib/qs-ranking";


import { useState, useMemo, useEffect } from "react";
import { formatCollegeDisplayName } from "@/lib/displayFormat";
import type { Program } from "@/types";
import { admissionsState } from "@/lib/admissions-state";
import CatalogCard from "@/components/CatalogCard";
import {languageFromRecords} from "@/lib/presentation";
import Card from "@/components/ui/Card";

interface SchoolDetailClientProps {
  programs: Program[];
  schoolName?: string;
  region?: string;
}

const MAJOR_DIRECTIONS = [
  { label: '商科', keywords: ['business', '商', 'finance', 'account', 'econ', '管理', '营销', 'MBA'] },
  { label: '计算机/AI', keywords: ['computer', 'cs', '软件', 'information', 'data', 'ai', '人工智能', 'machine learning', 'deep learning'] },
  { label: '数据科学', keywords: ['data science', 'data analytics', '大数据', '数据分析'] },
  { label: '工程', keywords: ['engineer', '工程', 'mechanical', 'electrical', 'civil', 'aeronautical', 'chemical'] },
  { label: '传媒', keywords: ['media', '传媒', 'communication', 'journalism', '传播'] },
  { label: '教育', keywords: ['education', '教育', 'teaching', 'pedagogy'] },
  { label: '法律', keywords: ['law', '法律', 'legal', 'juris'] },
  { label: '医学健康', keywords: ['medicine', '医学', 'medical', 'nursing', '护理', 'health', 'public health'] },
  { label: '心理学', keywords: ['psychology', '心理', '心理咨询'] },
  { label: '建筑设计', keywords: ['architecture', '建筑', '设计', 'urban design'] },
  { label: '环境可持续', keywords: ['environment', '环境', 'sustainability', '可持续'] },
  { label: '社科人文', keywords: ['social', '社科', 'humanities', '国际关系', '政治', '历史', '哲学'] },
];

function getColleges(programs: Program[]): string[] {
  const colleges = new Set<string>();
  programs.forEach(p => {
    if (p.college) {
      colleges.add(formatCollegeDisplayName(p.college));
    }
  });
  return Array.from(colleges).filter(Boolean);
}


export default function SchoolDetailClient({ programs }: SchoolDetailClientProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("postgraduate");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [displayCount, setDisplayCount] = useState(12);
  const [showHistory, setShowHistory] = useState(false);

  const programsForCollegeOptions = useMemo(() => {
    return programs.filter(program => {
      if (!showHistory && ["archived","closed"].includes(admissionsState(program).code)) return false;
      if (selectedLevel && program.education_level !== selectedLevel) {
        return false;
      }

      if (selectedDirection) {
        const majorAll = `${program.major_cn || ''} ${program.major_en || ''} ${program.college || ''}`.toLowerCase();
        const direction = MAJOR_DIRECTIONS.find(d => d.label === selectedDirection);
        if (direction) {
          const hasMatch = direction.keywords.some(kw => majorAll.includes(kw.toLowerCase()));
          if (!hasMatch) return false;
        }
      }

      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchCn = program.major_cn?.toLowerCase().includes(keyword);
        const matchEn = program.major_en?.toLowerCase().includes(keyword);
        if (!matchCn && !matchEn) return false;
      }

      return true;
    });
  }, [programs, selectedLevel, selectedDirection, searchKeyword, showHistory]);

  const colleges = useMemo(
    () => getColleges(programsForCollegeOptions),
    [programsForCollegeOptions]
  );

  useEffect(() => {
    if (selectedCollege && !colleges.includes(selectedCollege)) {
      setSelectedCollege("");
      setDisplayCount(12);
    }
  }, [selectedCollege, colleges]);

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      if (!showHistory && ["archived","closed"].includes(admissionsState(program).code)) return false;
      if (selectedLevel && program.education_level !== selectedLevel) {
        return false;
      }
      if (selectedDirection) {
        const majorAll = `${program.major_cn || ''} ${program.major_en || ''} ${program.college || ''}`.toLowerCase();
        const direction = MAJOR_DIRECTIONS.find(d => d.label === selectedDirection);
        if (direction) {
          const hasMatch = direction.keywords.some(kw => majorAll.includes(kw.toLowerCase()));
          if (!hasMatch) return false;
        }
      }
      if (selectedCollege) {
        const collegeName = formatCollegeDisplayName(program.college || '');
        if (collegeName !== selectedCollege) return false;
      }
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchCn = program.major_cn?.toLowerCase().includes(keyword);
        const matchEn = program.major_en?.toLowerCase().includes(keyword);
        if (!matchCn && !matchEn) return false;
      }
      return true;
    });
  }, [programs, searchKeyword, selectedLevel, selectedDirection, selectedCollege, showHistory]);

  const undergradCount = programs.filter(p => p.education_level === "undergraduate").length;
  const postgradCount = programs.filter(p => p.education_level === "postgraduate").length;

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedCollege("");
    setDisplayCount(12);
  };

  const handleDirectionChange = (direction: string) => {
    setSelectedDirection(direction);
    setDisplayCount(12);
  };

  const renderProgramCards = () => {
    const displayedPrograms = filteredPrograms.slice(0, displayCount);
    
    return (
      <div className="catalog-grid">
        {displayedPrograms.map(program=>{const a=program.admissions_preview;return <CatalogCard key={program.id} item={{id:program.id,schoolCode:program.school_code,school:program.school_name,name:program.major_cn||program.major_en,nameEn:program.major_en,region:program.region_cn,degree:program.degree,level:program.education_level,duration:program.duration||'官网未明确',fee:a?.feeShort||program.fee||'官网未明确',feeNote:a?.feeNote,language:a?.languageShort||program.language_requirement||languageFromRecords(program.ielts,program.toefl)||'官网未明确',deadline:a?.deadlineSummary||program.deadline||'官网未明确',cycle:a?.cycle||'历史资料，当前批次待确认',year:a?.entryYear??null,updated:a?.updatedOn||program.last_updated||'',rank:getQSRank(program)>0?`QS ${getQSYear(program)} · ${getQSLabel(program)}`:'',officialUrl:program.official_url||'',state:admissionsState(program),hasCurrentPresentation:Boolean(a)}}>{a?.notices.map(note=><p key={note} className="mb-3 text-xs leading-6 text-amber-800">{note}</p>)}</CatalogCard>;})}
        {filteredPrograms.length > displayCount && (
          <div className="mt-4 text-center col-span-full">
            <button
              onClick={() => setDisplayCount(prev => prev + 12)}
              className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              查看更多专业
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="programs" className="school-program-browser">
      <Card className="p-4 mb-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2">{[{value:'',label:'全部'},{value:'undergraduate',label:`本科 (${undergradCount})`},{value:'postgraduate',label:`硕士 (${postgradCount})`}].map(level=><button key={level.value} onClick={()=>handleLevelChange(level.value)} aria-pressed={selectedLevel===level.value} className={selectedLevel===level.value?'rounded-lg bg-blue-600 px-3 py-2 text-sm text-white':'rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600'}>{level.label}</button>)}</div><label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={showHistory} onChange={e=>{setShowHistory(e.target.checked);setDisplayCount(12);}}/>包含已截止与历史项目</label></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]"><label className="col-span-2 md:col-span-1"><span className="sr-only">搜索专业名称</span><input className="ui-input" placeholder="搜索专业名称" value={searchKeyword} onChange={e=>{setSearchKeyword(e.target.value);setDisplayCount(12);}}/></label><label><span className="sr-only">专业方向</span><select className="ui-input" value={selectedDirection} onChange={e=>handleDirectionChange(e.target.value)}><option value="">全部专业方向</option>{MAJOR_DIRECTIONS.map(d=><option value={d.label} key={d.label}>{d.label}</option>)}</select></label><label><span className="sr-only">学院</span><select className="ui-input" value={selectedCollege} onChange={e=>{setSelectedCollege(e.target.value);setDisplayCount(12);}}><option value="">全部学院</option>{colleges.map(c=><option key={c}>{c}</option>)}</select></label></div>
      </Card>

      {filteredPrograms.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到符合条件的专业</h3>
          <p className="text-gray-500">请尝试调整筛选条件或使用不同的关键词搜索</p>
        </Card>
      ) : (
        <>{renderProgramCards()}</>
      )}
    </div>
  );
}
