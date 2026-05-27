"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getFavorites, toggleFavorite as toggleStoredFavorite } from "@/lib/storage";
import { formatCollegeDisplayName, formatFee, formatIntake, formatLanguageRequirement, formatDeadline } from "@/lib/displayFormat";
import type { Program } from "@/types";
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

// 获取录取难度标签
function getAdmissionLevel(ranking?: number): { label: string; className: string } {
  if (!ranking || ranking <= 0) {
    return { label: '匹配', className: 'bg-yellow-100 text-yellow-700' };
  }
  if (ranking <= 30) {
    return { label: '冲刺', className: 'bg-red-100 text-red-700' };
  }
  if (ranking <= 100) {
    return { label: '冲刺', className: 'bg-red-100 text-red-700' };
  }
  if (ranking <= 200) {
    return { label: '匹配', className: 'bg-yellow-100 text-yellow-700' };
  }
  return { label: '保底', className: 'bg-green-100 text-green-700' };
}

// 获取学院列表
function getColleges(programs: Program[]): string[] {
  const colleges = new Set<string>();
  programs.forEach(p => {
    if (p.college) {
      colleges.add(formatCollegeDisplayName(p.college));
    }
  });
  return Array.from(colleges).filter(Boolean);
}

// 获取学制列表
function getDurations(programs: Program[]): string[] {
  const durations = new Set<string>();
  programs.forEach(p => {
    if (p.duration) {
      durations.add(p.duration);
    }
  });
  return Array.from(durations).filter(Boolean);
}

// 获取入学季列表
function getIntakes(programs: Program[]): string[] {
  const intakes = new Set<string>();
  programs.forEach(p => {
    if (p.intake) {
      intakes.add(p.intake);
    }
  });
  return Array.from(intakes).filter(Boolean);
}

export default function SchoolDetailClient({ programs, schoolName, region }: SchoolDetailClientProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("postgraduate");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedIntake, setSelectedIntake] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toggleFavorite = (id: string) => {
    toggleStoredFavorite(id);
    setFavorites(getFavorites());
  };

  const colleges = getColleges(programs);
  const durations = getDurations(programs);
  const intakes = getIntakes(programs);

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
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
      if (selectedDuration && program.duration !== selectedDuration) {
        return false;
      }
      if (selectedIntake && program.intake !== selectedIntake) {
        return false;
      }
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchCn = program.major_cn?.toLowerCase().includes(keyword);
        const matchEn = program.major_en?.toLowerCase().includes(keyword);
        if (!matchCn && !matchEn) return false;
      }
      return true;
    });
  }, [programs, searchKeyword, selectedLevel, selectedDirection, selectedCollege, selectedDuration, selectedIntake]);

  const undergradCount = programs.filter(p => p.education_level === "undergraduate").length;
  const postgradCount = programs.filter(p => p.education_level === "postgraduate").length;

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setDisplayCount(20);
  };

  const handleDirectionChange = (direction: string) => {
    setSelectedDirection(direction);
    setDisplayCount(20);
  };

  const resetFilters = () => {
    setSelectedCollege("");
    setSelectedDuration("");
    setSelectedIntake("");
    setDisplayCount(20);
  };

  const renderProgramCards = () => {
    const displayedPrograms = filteredPrograms.slice(0, displayCount);
    
    return (
      <div className="space-y-3">
        {displayedPrograms.map((program) => {
          const feeInfo = formatFee(program.fee);
          const admissionLevel = getAdmissionLevel(program.qs_ranking_2026);
          
          return (
            <div
              key={program.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              {/* 上半部分 */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* 左侧：专业信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {program.major_cn || program.major_en || "官网暂未明确"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {program.major_en || "-"}
                      </p>
                    </div>
                    {/* 右侧：录取难度标签 + 收藏 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${admissionLevel.className}`}>
                        {admissionLevel.label}
                      </span>
                      <button
                        onClick={() => toggleFavorite(program.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          favorites.includes(program.id)
                            ? "text-red-500 hover:bg-red-50"
                            : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                        }`}
                        title={favorites.includes(program.id) ? "取消收藏" : "收藏"}
                      >
                        <svg className="w-5 h-5" fill={favorites.includes(program.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* 学院名（中文） */}
                  {program.college ? (
                    <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {formatCollegeDisplayName(program.college)}
                    </span>
                  ) : (
                    <span className="inline-block mt-2 px-2.5 py-1 bg-gray-100 text-gray-400 rounded-full text-xs">
                      学院信息暂未明确
                    </span>
                  )}
                </div>
              </div>
              
              {/* 信息行 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100">
                {/* 国际生学费 */}
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-400 text-sm">💰</span>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">{feeInfo.primary}</span>
                    {feeInfo.secondary && (
                      <span className="text-gray-400 text-xs ml-1">{feeInfo.secondary}</span>
                    )}
                  </div>
                </div>
                {/* 入学时间 */}
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-400 text-sm">📅</span>
                  <span className="text-sm text-gray-600">{formatIntake(program.intake || '')}</span>
                </div>
                {/* 语言要求 */}
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-400 text-sm">🌐</span>
                  <span className="text-sm text-gray-600">{formatLanguageRequirement(program.ielts, program.toefl)}</span>
                </div>
                {/* 申请截止 */}
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-400 text-sm">⏰</span>
                  <span className="text-sm text-gray-600">{formatDeadline(program.deadline || '')}</span>
                </div>
              </div>
              
              {/* 底部按钮 */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/ai/school-match?school=${encodeURIComponent(schoolName || program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}&region=${encodeURIComponent(region || program.region_cn || '')}`}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  AI录取率
                </Link>
                <Link
                  href={`/programs/${program.id}`}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  查看详情
                </Link>
              </div>
            </div>
          );
        })}
        
        {filteredPrograms.length > displayCount && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setDisplayCount(prev => prev + 20)}
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
    <div id="programs">
      <Card className="p-4 mb-6">
        {/* 学历筛选 */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLevelChange("")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === "" || selectedLevel === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => handleLevelChange("undergraduate")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === "undergraduate"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              本科 ({undergradCount})
            </button>
            <button
              onClick={() => handleLevelChange("postgraduate")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedLevel === "postgraduate"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              硕士 ({postgradCount})
            </button>
          </div>
        </div>

        {/* 专业搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索专业名称"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setDisplayCount(20);
            }}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 专业方向筛选 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">专业方向</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDirectionChange("")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDirection === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              全部
            </button>
            {MAJOR_DIRECTIONS.map(direction => (
              <button
                key={direction.label}
                onClick={() => handleDirectionChange(selectedDirection === direction.label ? '' : direction.label)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDirection === direction.label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {direction.label}
              </button>
            ))}
          </div>
        </div>

        {/* 展开更多筛选 */}
        <div>
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            {showMoreFilters ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                收起筛选
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                展开更多筛选
              </>
            )}
          </button>
          
          {showMoreFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              {/* 学院筛选 */}
              {colleges.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学院</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedCollege(""); setDisplayCount(20); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCollege === ""
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      全部
                    </button>
                    {colleges.map(college => (
                      <button
                        key={college}
                        onClick={() => { setSelectedCollege(college); setDisplayCount(20); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCollege === college
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {college}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 学制筛选 */}
              {durations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学制</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedDuration(""); setDisplayCount(20); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedDuration === ""
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      全部
                    </button>
                    {durations.map(duration => (
                      <button
                        key={duration}
                        onClick={() => { setSelectedDuration(duration); setDisplayCount(20); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedDuration === duration
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 入学季筛选 */}
              {intakes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">入学季</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedIntake(""); setDisplayCount(20); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedIntake === ""
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      全部
                    </button>
                    {intakes.map(intake => (
                      <button
                        key={intake}
                        onClick={() => { setSelectedIntake(intake); setDisplayCount(20); }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedIntake === intake
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {formatIntake(intake)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 重置筛选 */}
              {(selectedCollege || selectedDuration || selectedIntake) && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  重置筛选条件
                </button>
              )}
            </div>
          )}
        </div>
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
