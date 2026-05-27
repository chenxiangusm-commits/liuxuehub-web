"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getRegionDisplayCn, getSchoolNameCn, getSchoolNameEn } from "@/lib/schoolDisplay";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import { sortSchoolsByRanking } from "@/lib/filters";
import { getFavorites, toggleFavorite } from "@/lib/storage";
import type { School } from "@/types";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";
import { siteStats } from "@/config/siteStats";

interface HomeClientProps {
  schools: School[];
}

const REGION_FILTERS = [
  { label: "全部", values: [] },
  { label: "中国香港/澳门", values: ["中国香港", "中国澳门", "香港", "澳门", "中国香港/澳门"] },
  { label: "中国香港", values: ["中国香港", "香港"] },
  { label: "中国澳门", values: ["中国澳门", "澳门"] },
  { label: "澳大利亚", values: ["澳大利亚"] },
  { label: "新加坡", values: ["新加坡"] },
  { label: "英国", values: ["英国"] },
  { label: "新西兰", values: ["新西兰"] },
  { label: "爱尔兰", values: ["爱尔兰"] },
  { label: "马来西亚", values: ["马来西亚"] },
  { label: "中外合办", values: ["中外合办"] },
  { label: "合作区", values: ["合作区"] },
];

const QS_RANKINGS = [
  { label: "不限", value: 0 },
  { label: "1-10", value: 10 },
  { label: "11-50", value: 50 },
  { label: "51-100", value: 100 },
  { label: "101-150", value: 150 },
  { label: "151-200", value: 200 },
  { label: "201+", value: 300 },
];

const SCHOOLS_PER_PAGE = 8;

export default function HomeClient({ schools }: HomeClientProps) {
  const { educationLevel } = useApp();

  const [schoolKeyword, setSchoolKeyword] = useState("");
  const [schoolRegion, setSchoolRegion] = useState("全部");
  const [schoolQsRank, setSchoolQsRank] = useState(0);
  const [schoolPage, setSchoolPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const handleUpdate = () => {
      setFavorites(getFavorites());
    };
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  const handleToggleFavorite = (schoolCode: string) => {
    toggleFavorite(schoolCode);
    setFavorites(getFavorites());
  };

  const filteredSchools = useMemo(() => {
    let result = schools;

    if (educationLevel !== "all") {
      result = result.filter(s => s.education_levels?.includes(educationLevel));
    }

    if (schoolKeyword) {
      const kw = schoolKeyword.toLowerCase();
      result = result.filter(s =>
        s.school_name?.toLowerCase().includes(kw) ||
        s.school_name_en?.toLowerCase().includes(kw) ||
        s.school_code?.toLowerCase().includes(kw)
      );
    }

    if (schoolRegion !== "全部") {
      const regionFilter = REGION_FILTERS.find(rf => rf.label === schoolRegion);
      if (regionFilter && regionFilter.values.length > 0) {
        result = result.filter(s => regionFilter.values.includes(s.region_cn));
      }
    }

    if (schoolQsRank > 0) {
      if (schoolQsRank === 10) {
        result = result.filter(s => s.qs_ranking_2026 > 0 && s.qs_ranking_2026 <= 10);
      } else if (schoolQsRank === 50) {
        result = result.filter(s => s.qs_ranking_2026 > 10 && s.qs_ranking_2026 <= 50);
      } else if (schoolQsRank === 100) {
        result = result.filter(s => s.qs_ranking_2026 > 50 && s.qs_ranking_2026 <= 100);
      } else if (schoolQsRank === 150) {
        result = result.filter(s => s.qs_ranking_2026 > 100 && s.qs_ranking_2026 <= 150);
      } else if (schoolQsRank === 200) {
        result = result.filter(s => s.qs_ranking_2026 > 150 && s.qs_ranking_2026 <= 200);
      } else {
        result = result.filter(s => s.qs_ranking_2026 > 200 || !s.qs_ranking_2026);
      }
    }

    return sortSchoolsByRanking(result);
  }, [schools, educationLevel, schoolKeyword, schoolRegion, schoolQsRank]);

  const schoolTotalPages = Math.ceil(filteredSchools.length / SCHOOLS_PER_PAGE);

  const paginatedSchools = filteredSchools.slice(
    (schoolPage - 1) * SCHOOLS_PER_PAGE,
    schoolPage * SCHOOLS_PER_PAGE
  );

  const topSchools = useMemo(() => {
    return sortSchoolsByRanking(schools).filter(s => s.qs_ranking_2026 && s.qs_ranking_2026 <= 50).slice(0, 6);
  }, [schools]);

  return (
    <div>
      {/* 数据能力模块 */}
      <div className="bg-gray-50 py-12">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">数据能力</h2>
            <p className="text-gray-600">强大的数据库支持，为你的留学申请保驾护航</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hoverable">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {siteStats.schools.toLocaleString()}+
              </div>
              <div className="text-gray-600">全球院校数据库</div>
            </Card>
            <Card className="text-center p-6 hoverable">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {siteStats.programs.toLocaleString()}+
              </div>
              <div className="text-gray-600">专业项目</div>
            </Card>
            <Card className="text-center p-6 hoverable">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {siteStats.aiAnalysis.toLocaleString()}+
              </div>
              <div className="text-gray-600">AI申请分析</div>
            </Card>
            <Card className="text-center p-6 hoverable">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {siteStats.interviews.toLocaleString()}+
              </div>
              <div className="text-gray-600">模拟面试训练</div>
            </Card>
          </div>
        </Container>
      </div>

      {/* 技术能力模块 - 为什么选择九万里AI */}
      <div className="py-12">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">为什么选择九万里AI</h2>
            <p className="text-gray-600">领先的AI技术，重新定义留学申请体验</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="p-6 hoverable">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI智能选校</h3>
              <p className="text-gray-600 text-sm">根据背景自动生成冲刺/匹配/保底方案</p>
            </Card>
            <Card className="p-6 hoverable">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI文书生成</h3>
              <p className="text-gray-600 text-sm">支持CV、PS、推荐信</p>
            </Card>
            <Card className="p-6 hoverable">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI面试训练</h3>
              <p className="text-gray-600 text-sm">实时提问、评分、反馈</p>
            </Card>
            <Card className="p-6 hoverable">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">全球院校数据库</h3>
              <p className="text-gray-600 text-sm">QS1000+ 本科、硕士</p>
            </Card>
            <Card className="p-6 hoverable">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI大数据留学规划</h3>
              <p className="text-gray-600 text-sm mb-3">基于院校库、项目库、申请要求和AI分析，自动生成你的留学路线图。</p>
              <Link
                href="/ai/study-plan"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                生成规划书
              </Link>
            </Card>
          </div>
        </Container>
      </div>

      {/* 信任模块 - 数据来源 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">数据来源</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">学校官网</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">QS排名</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">官方招生要求</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">历史申请数据分析</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">实时更新</span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">数据持续更新中</p>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Top Schools Section */}
        <SectionTitle 
          title="QS Top 50 院校" 
          subtitle="全球顶尖学府，助力你的留学梦想" 
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {topSchools.map((school) => {
            const logoPath = getSchoolMarkPath(school.school_code);
            return (
              <Link
                key={school.school_code}
                href={`/schools/${school.school_code}`}
                className="group"
              >
                <Card className="p-4 text-center hoverable">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src={logoPath}
                      alt={getSchoolNameCn(school)}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm truncate mb-1 group-hover:text-blue-600 transition-colors">
                    {getSchoolNameCn(school)}
                  </h4>
                  {school.qs_ranking_2026 && school.qs_ranking_2026 > 0 && (
                    <Badge variant="danger" className="text-xs">
                      QS {school.qs_ranking_2026}
                    </Badge>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Browse Schools Section */}
        <SectionTitle 
          title="浏览院校库" 
          subtitle="根据你的需求筛选适合的学校" 
        />
        <Card className="p-4 mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="输入学校关键词"
              value={schoolKeyword}
              onChange={(e) => {
                setSchoolKeyword(e.target.value);
                setSchoolPage(1);
              }}
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {REGION_FILTERS.slice(0, 8).map((rf) => (
                <button
                  key={rf.label}
                  onClick={() => {
                    setSchoolRegion(rf.label);
                    setSchoolPage(1);
                  }}
                  className={`filter-btn ${schoolRegion === rf.label ? "filter-btn-active" : ""}`}
                >
                  {rf.label}
                </button>
              ))}
              {REGION_FILTERS.length > 8 && (
                <button className="filter-btn">
                  更多...
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              {QS_RANKINGS.map((ranking) => (
                <button
                  key={ranking.label}
                  onClick={() => {
                    setSchoolQsRank(ranking.value);
                    setSchoolPage(1);
                  }}
                  className={`filter-btn ${schoolQsRank === ranking.value ? "filter-btn-active" : ""}`}
                >
                  QS {ranking.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {paginatedSchools.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的学校</h3>
            <p className="text-gray-500">请尝试调整筛选条件或使用不同的关键词搜索</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {paginatedSchools.map((school) => {
                const logoPath = getSchoolMarkPath(school.school_code);
                return (
                  <Card key={school.school_code} className="p-5 hoverable">
                    <div className="flex items-start">
                      <Link href={`/schools/${school.school_code}`} className="flex items-start flex-1">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mr-4 shadow-sm">
                          <Image
                            src={logoPath}
                            alt={getSchoolNameCn(school)}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-base truncate">
                              {getSchoolNameCn(school)}
                            </h3>
                            {school.qs_ranking_2026 && school.qs_ranking_2026 > 0 && (
                              <span className="flex-shrink-0 px-2.5 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-md shadow-md">
                                QS {school.qs_ranking_2026}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mb-2">
                            {getSchoolNameEn(school)}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {getRegionDisplayCn(school)}
                            </span>
                            {school.education_levels?.includes("undergraduate") && (
                              <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                                本科
                              </span>
                            )}
                            {school.education_levels?.includes("postgraduate") && (
                              <span className="inline-flex items-center px-2.5 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded-md">
                                硕士
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {school.total_programs || 0} 个专业
                          </div>
                        </div>
                      </Link>
                      <button
                        onClick={() => handleToggleFavorite(school.school_code || '')}
                        className={`ml-3 p-2 rounded-xl transition-all flex-shrink-0 ${
                          favorites.includes(school.school_code || '')
                            ? "text-red-500 hover:bg-red-50"
                            : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                        }`}
                      >
                        <svg className="w-5 h-5" fill={favorites.includes(school.school_code || '') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {schoolTotalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setSchoolPage(p => Math.max(1, p - 1))}
                  disabled={schoolPage === 1}
                  className={`pagination-btn ${schoolPage === 1 ? "pagination-btn-disabled" : ""}`}
                >
                  上一页
                </button>
                {Array.from({ length: Math.min(5, schoolTotalPages) }, (_, i) => {
                  let pageNum;
                  if (schoolTotalPages <= 5) {
                    pageNum = i + 1;
                  } else if (schoolPage <= 3) {
                    pageNum = i + 1;
                  } else if (schoolPage >= schoolTotalPages - 2) {
                    pageNum = schoolTotalPages - 4 + i;
                  } else {
                    pageNum = schoolPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setSchoolPage(pageNum)}
                      className={`pagination-btn ${schoolPage === pageNum ? "pagination-btn-active" : ""}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setSchoolPage(p => Math.min(schoolTotalPages, p + 1))}
                  disabled={schoolPage === schoolTotalPages}
                  className={`pagination-btn ${schoolPage === schoolTotalPages ? "pagination-btn-disabled" : ""}`}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}