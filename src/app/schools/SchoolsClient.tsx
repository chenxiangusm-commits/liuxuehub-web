"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const ALL_REGIONS = "全部";
const HONG_KONG_MACAU = "中国香港/澳门";
const DEFAULT_LOGO = "/school-logos/default.svg";
const SCHOOLS_PER_PAGE = 12;

const REGIONS = [
  ALL_REGIONS,
  HONG_KONG_MACAU,
  "澳大利亚",
  "新加坡",
  "英国",
  "新西兰",
  "加拿大",
  "更多地区...",
];

const HK_MACAU_REGION_KEYWORDS = ["中国香港", "香港", "Hong Kong", "中国澳门", "澳门", "Macau", "Macao"];

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

function normalizeRegionFilter(value?: string | null) {
  if (!value) return ALL_REGIONS;
  const decoded = decodeURIComponent(value);
  if (["中国香港", "香港", "Hong Kong", "中国澳门", "澳门", "Macau", "Macao"].includes(decoded)) {
    return HONG_KONG_MACAU;
  }
  return REGIONS.includes(decoded) ? decoded : ALL_REGIONS;
}

function getRegionSearchText(school: School) {
  return [school.region_cn, school.region_en, getRegionDisplayCn(school)].filter(Boolean).join(" ");
}

function matchesSelectedRegion(school: School, selectedRegion: string) {
  if (selectedRegion === ALL_REGIONS || selectedRegion === "更多地区...") return true;

  const regionText = getRegionSearchText(school);
  if (selectedRegion === HONG_KONG_MACAU) {
    return HK_MACAU_REGION_KEYWORDS.some(keyword => regionText.includes(keyword));
  }

  return regionText.includes(selectedRegion);
}

function getProgramCount(school: School, educationLevel: "all" | "undergraduate" | "postgraduate") {
  if (educationLevel === "undergraduate") return school.program_counts?.undergraduate || 0;
  if (educationLevel === "postgraduate") return school.program_counts?.postgraduate || 0;
  return school.program_counts?.total || school.total_programs || 0;
}

function getProgramCountLabel(educationLevel: "all" | "undergraduate" | "postgraduate") {
  if (educationLevel === "undergraduate") return "本科项目";
  if (educationLevel === "postgraduate") return "硕士项目";
  return "专业数量";
}

function getQsBadge(school: School) {
  const ranking = school.qs_ranking_2026;

  if (typeof ranking !== "number" || ranking <= 0) {
    return {
      label: "QS暂无",
      className: "bg-gray-100 text-gray-500 border-gray-200",
    };
  }

  return {
    label: `QS #${ranking}`,
    className: ranking <= 100
      ? "bg-red-50 text-red-600 border-red-100"
      : "bg-slate-100 text-slate-600 border-slate-200",
  };
}

function SchoolListCard({
  school,
  educationLevel,
  isFavorite,
  onToggleFavorite,
}: {
  school: School;
  educationLevel: "all" | "undergraduate" | "postgraduate";
  isFavorite: boolean;
  onToggleFavorite: (schoolCode: string) => void;
}) {
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState(getSchoolMarkPath(school.school_code) || DEFAULT_LOGO);
  const href = `/schools/${school.school_code}`;
  const qsBadge = getQsBadge(school);
  const schoolTags = getSchoolTags(school.school_code).slice(0, 2);
  const programCount = getProgramCount(school, educationLevel);

  useEffect(() => {
    setLogoSrc(getSchoolMarkPath(school.school_code) || DEFAULT_LOGO);
  }, [school.school_code]);

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite(school.school_code || "");
  };

  const handleViewClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(href);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(href);
        }
      }}
      className="group relative flex min-h-[214px] cursor-pointer flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="flex items-start gap-4 pr-12">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
          <Image
            src={logoSrc}
            alt={`${getSchoolNameCn(school)} logo`}
            width={64}
            height={64}
            className="h-full w-full object-contain"
            onError={() => setLogoSrc(DEFAULT_LOGO)}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${qsBadge.className}`}>
              {qsBadge.label}
            </span>
          </div>
          <h3 className="mb-1 truncate text-lg font-semibold text-gray-950 transition-colors group-hover:text-blue-700">
            {getSchoolNameCn(school)}
          </h3>
          <p className="line-clamp-1 text-sm text-gray-500" title={getSchoolNameEn(school)}>
            {getSchoolNameEn(school)}
          </p>
        </div>
      </div>

      <button
        type="button"
        aria-label={isFavorite ? "取消收藏" : "收藏学校"}
        onClick={handleFavoriteClick}
        className={`absolute right-4 top-4 rounded-full border p-2 transition-colors ${
          isFavorite
            ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
            : "border-gray-100 bg-white text-gray-400 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <svg className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="primary">{getRegionDisplayCn(school)}</Badge>
        {school.education_levels?.includes("undergraduate") && <Badge>本科</Badge>}
        {school.education_levels?.includes("postgraduate") && <Badge variant="success">硕士</Badge>}
        {schoolTags.map(tag => (
          <span key={tag} className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-gray-400">{getProgramCountLabel(educationLevel)}</p>
          <p className="text-xl font-semibold text-gray-900">{programCount}</p>
        </div>
        <button
          type="button"
          onClick={handleViewClick}
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
        >
          查看学校
          <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function SchoolsClient({ schools }: SchoolsClientProps) {
  const { educationLevel } = useApp();
  const [clientReady, setClientReady] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState(ALL_REGIONS);
  const [qsRanking, setQsRanking] = useState("");
  const [eduLevelFilter, setEduLevelFilter] = useState<"all" | "undergraduate" | "postgraduate">("all");
  const [sortBy, setSortBy] = useState("ranking");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setClientReady(true);
    setFavorites(getFavorites());

    const params = new URLSearchParams(window.location.search);
    setRegion(normalizeRegionFilter(params.get("region")));

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
      region: "all",
      qsRanking,
      educationLevel,
    }).filter(school => matchesSelectedRegion(school, region));

    if (eduLevelFilter !== "all") {
      result = result.filter(school => {
        if (eduLevelFilter === "undergraduate") {
          return school.education_levels?.includes("undergraduate");
        }
        return school.education_levels?.includes("postgraduate");
      });
    }

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
        subtitle="按地区、申请阶段和 QS 排名筛选学校，快速找到适合自己的留学目标。"
      />

      <Card className="mb-6 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">快速筛选院校</h3>

        <div className="mb-3 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索学校中文名、英文名或学校代码"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                resetPage();
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              resetPage();
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="mb-2 block text-xs text-gray-500">申请阶段</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "全部", value: "all" },
              { label: "本科", value: "undergraduate" },
              { label: "硕士", value: "postgraduate" },
            ].map(item => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setEduLevelFilter(item.value as "all" | "undergraduate" | "postgraduate");
                  resetPage();
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${eduLevelFilter === item.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-2 block text-xs text-gray-500">地区筛选</label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setRegion(item);
                  resetPage();
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${region === item ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-gray-500">QS排名</label>
          <div className="flex flex-wrap gap-2">
            {QS_RANKINGS.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setQsRanking(item.value);
                  resetPage();
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${qsRanking === item.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">没有找到匹配的学校</h3>
          <p className="text-gray-500">试试调整筛选条件，或者换一个关键词搜索。</p>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedSchools.map(school => (
              <SchoolListCard
                key={school.school_code}
                school={school}
                educationLevel={eduLevelFilter}
                isFavorite={favorites.includes(school.school_code || "")}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                type="button"
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
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`pagination-btn ${page === pageNum ? "pagination-btn-active" : ""}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
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
