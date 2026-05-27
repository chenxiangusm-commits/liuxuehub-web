"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { filterSchools, sortSchoolsByRanking } from "@/lib/filters";
import { getRegionDisplayCn, getSchoolNameCn, getSchoolNameEn } from "@/lib/schoolDisplay";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import { getFavorites, toggleFavorite } from "@/lib/storage";
import { getSchoolTags } from "@/lib/schoolTags";
import type { School } from "@/types";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionTitle from "@/components/ui/SectionTitle";

interface SchoolsClientProps {
  schools: School[];
}

const REGIONS = [
  "全部",
  "中国香港/澳门",
  "澳大利亚",
  "新加坡",
  "英国",
  "新西兰",
  "爱尔兰",
  "加拿大",
  "美国",
  "马来西亚",
  "中外合办",
  "合作区",
];

const QS_RANKINGS = [
  { label: "不限", value: "" },
  { label: "1-10", value: "1-10" },
  { label: "11-50", value: "11-50" },
  { label: "51-100", value: "51-100" },
  { label: "101-150", value: "101-150" },
  { label: "151-200", value: "151-200" },
  { label: "201+", value: "201+" },
];

const SORT_OPTIONS = [
  { label: "QS排名优先", value: "ranking" },
  { label: "学校名称", value: "name" },
  { label: "专业数量", value: "programs" },
];

const SCHOOLS_PER_PAGE = 12;

export default function SchoolsClient({ schools }: SchoolsClientProps) {
  const { educationLevel } = useApp();
  const [clientReady, setClientReady] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("全部");
  const [qsRanking, setQsRanking] = useState("");
  const [eduLevelFilter, setEduLevelFilter] = useState<"all" | "undergraduate" | "postgraduate">("all");
  const [sortBy, setSortBy] = useState("ranking");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setClientReady(true);
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

  const resetPage = () => setPage(1);

  const filteredSchools = useMemo(() => {
    let result = filterSchools(schools, {
      keyword,
      region: region === "全部" ? "all" : region,
      qsRanking,
      educationLevel,
    });

    // 本科/硕士阶段筛选
    if (eduLevelFilter !== "all") {
      result = result.filter(school => {
        if (eduLevelFilter === "undergraduate") {
          return school.education_levels?.includes("undergraduate");
        } else if (eduLevelFilter === "postgraduate") {
          return school.education_levels?.includes("postgraduate");
        }
        return true;
      });
    }

    // 排序
    switch (sortBy) {
      case "name":
        result = [...result].sort((a, b) => {
          const nameA = getSchoolNameCn(a).toLowerCase();
          const nameB = getSchoolNameCn(b).toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      case "programs":
        result = [...result].sort((a, b) => {
          const countA = a.total_programs || 0;
          const countB = b.total_programs || 0;
          return countB - countA;
        });
        break;
      default:
        result = sortSchoolsByRanking(result);
    }

    return result;
  }, [schools, keyword, region, qsRanking, educationLevel, sortBy, eduLevelFilter]);

  const totalPages = Math.ceil(filteredSchools.length / SCHOOLS_PER_PAGE);
  const paginatedSchools = filteredSchools.slice(
    (page - 1) * SCHOOLS_PER_PAGE,
    page * SCHOOLS_PER_PAGE,
  );

  if (!clientReady) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Container className="py-8">
      <SectionTitle 
        title="院校库" 
        subtitle="按 QS 排名、国家地区和申请阶段筛选学校，进入学校后查看全部专业。" 
      />

      <Card className="p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">快速筛选院校</h3>
        
        {/* 第一行：搜索框 + 排序 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索学校名称"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                resetPage();
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              resetPage();
            }}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 第二行：申请阶段筛选 */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-2">申请阶段</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setEduLevelFilter("all"); resetPage(); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${eduLevelFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              全部
            </button>
            <button
              onClick={() => { setEduLevelFilter("undergraduate"); resetPage(); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${eduLevelFilter === "undergraduate" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              本科
            </button>
            <button
              onClick={() => { setEduLevelFilter("postgraduate"); resetPage(); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${eduLevelFilter === "postgraduate" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              硕士
            </button>
          </div>
        </div>

        {/* 第三行：地区筛选 */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-2">地区筛选</label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.slice(0, 8).map(item => (
              <button
                key={item}
                onClick={() => {
                  setRegion(item);
                  resetPage();
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${region === item ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {item}
              </button>
            ))}
            {REGIONS.length > 8 && (
              <button className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                更多地区...
              </button>
            )}
          </div>
        </div>

        {/* 第三行：QS排名筛选 */}
        <div>
          <label className="block text-xs text-gray-500 mb-2">QS排名</label>
          <div className="flex flex-wrap gap-2">
            {QS_RANKINGS.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setQsRanking(item.value);
                  resetPage();
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${qsRanking === item.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          共找到 <span className="font-semibold text-blue-600">{filteredSchools.length}</span> 所学校
        </p>
      </div>

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
            {paginatedSchools.map(school => {
              const logoPath = getSchoolMarkPath(school.school_code);
              return (
                <Card key={school.school_code} className="p-3 hover:shadow-md transition-shadow relative">
                  {/* 收藏按钮 - 右上角 */}
                  <button
                    onClick={() => handleToggleFavorite(school.school_code || '')}
                    className={`absolute top-3 right-3 p-1.5 rounded-md transition-colors flex-shrink-0 ${
                      favorites.includes(school.school_code || '')
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-4 h-4" fill={favorites.includes(school.school_code || '') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className="flex items-start gap-3">
                    {/* 左侧信息 */}
                    <div className="flex items-start flex-1">
                      <Link href={`/schools/${school.school_code}`}>
                        <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden mr-3">
                          <Image
                            src={logoPath}
                            alt={getSchoolNameCn(school)}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base truncate mb-0.5">
                          {getSchoolNameCn(school)}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mb-1.5">
                          {getSchoolNameEn(school)}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <Badge>{getRegionDisplayCn(school)}</Badge>
                          {school.education_levels?.includes("undergraduate") && (
                            <Badge>本科</Badge>
                          )}
                          {school.education_levels?.includes("postgraduate") && (
                            <Badge variant="success">硕士</Badge>
                          )}
                        </div>
                        {/* 学校标签 */}
                        <div className="flex flex-wrap gap-1">
                          {getSchoolTags(school.school_code).slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 右侧信息 */}
                    <div className="flex flex-col items-end min-w-[80px]">
                      {school.qs_ranking_2026 && school.qs_ranking_2026 > 0 ? (
                        <div className="bg-blue-50 rounded-lg px-2.5 py-1.5 text-center mb-2">
                          <span className="text-xs text-blue-500 block">QS排名</span>
                          <span className="text-xl font-bold text-blue-600">#{school.qs_ranking_2026}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 mb-2 text-center">暂无排名</div>
                      )}
                      <div className="text-xs text-gray-500 text-right">
                        <span className="block text-gray-400">
                          {eduLevelFilter === "all" ? "专业" : eduLevelFilter === "undergraduate" ? "本科项目" : "硕士项目"}
                        </span>
                        <span className="font-medium">
                          {eduLevelFilter === "all" 
                            ? (school.program_counts?.total || school.total_programs || 0)
                            : eduLevelFilter === "undergraduate"
                              ? (school.program_counts?.undergraduate || 0)
                              : (school.program_counts?.postgraduate || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 查看学校按钮 - 右下角 */}
                  <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/schools/${school.school_code}`}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-900 text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
                    >
                      查看学校
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(current => Math.max(1, current - 1))}
                disabled={page === 1}
                className={`pagination-btn ${page === 1 ? "pagination-btn-disabled" : ""}`}
              >
                上一页
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNum;
                if (totalPages <= 5) pageNum = index + 1;
                else if (page <= 3) pageNum = index + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + index;
                else pageNum = page - 2 + index;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`pagination-btn ${page === pageNum ? "pagination-btn-active" : ""}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className={`pagination-btn ${page === totalPages ? "pagination-btn-disabled" : ""}`}
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}