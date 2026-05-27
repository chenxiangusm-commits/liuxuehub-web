"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProgramCard from "@/components/ProgramCard";
import { filterPrograms } from "@/lib/filters";
import { Program, School } from "@/types";

interface ProgramsClientProps {
  initialPrograms: Program[];
  schools: School[];
  regions: string[];
}

export default function ProgramsClient({
  initialPrograms,
  schools,
  regions,
}: ProgramsClientProps) {
  const searchParams = useSearchParams();

  const [region, setRegion] = useState<string>(searchParams.get("region") || "");
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [qsRanking, setQsRanking] = useState<string>("");
  const [feeKeyword, setFeeKeyword] = useState<string>("");
  const [ieltsKeyword, setIeltsKeyword] = useState<string>("");
  const [majorKeyword, setMajorKeyword] = useState<string>(searchParams.get("keyword") || "");

  // 学校去重
  const uniqueSchools = useMemo(() => {
    const seen = new Set<string>();
    return schools.filter((s) => {
      if (seen.has(s.school_code)) return false;
      seen.add(s.school_code);
      return true;
    });
  }, [schools]);

  const filteredPrograms = useMemo(() => {
    return filterPrograms(initialPrograms, {
      region,
      educationLevel,
      schoolName: selectedSchool,
      qsRanking,
      feeKeyword,
      ieltsKeyword,
      majorKeyword,
    });
  }, [initialPrograms, region, educationLevel, selectedSchool, qsRanking, feeKeyword, ieltsKeyword, majorKeyword]);

  const clearFilters = () => {
    setRegion("");
    setEducationLevel("");
    setSelectedSchool("");
    setQsRanking("");
    setFeeKeyword("");
    setIeltsKeyword("");
    setMajorKeyword("");
  };

  const hasFilters = region || educationLevel || selectedSchool || qsRanking || feeKeyword || ieltsKeyword || majorKeyword;

  return (
    <div>
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 专业关键词搜索 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="请输入专业关键词..."
            value={majorKeyword}
            onChange={(e) => setMajorKeyword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 地区筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">地区</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 学历筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">学历</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部</option>
              <option value="undergraduate">本科</option>
              <option value="postgraduate">硕士</option>
            </select>
          </div>

          {/* 学校筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">学校</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部</option>
              {uniqueSchools.map((s) => (
                <option key={s.school_code} value={s.school_name}>{s.school_name_en || s.school_name}</option>
              ))}
            </select>
          </div>

          {/* QS排名筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QS排名</label>
            <select
              value={qsRanking}
              onChange={(e) => setQsRanking(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">不限</option>
              <option value="1-50">1-50</option>
              <option value="51-100">51-100</option>
              <option value="101-200">101-200</option>
              <option value="201+">201+</option>
            </select>
          </div>
        </div>

        {/* 高级筛选 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">语言要求关键词</label>
            <input
              type="text"
              placeholder="如：6.5、7.0..."
              value={ieltsKeyword}
              onChange={(e) => setIeltsKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">学费关键词</label>
            <input
              type="text"
              placeholder="如：HKD、AUD、RMB..."
              value={feeKeyword}
              onChange={(e) => setFeeKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          共找到 <span className="font-bold text-blue-700">{filteredPrograms.length.toLocaleString()}</span> 个专业
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 专业列表 */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-600">没有找到符合条件的专业</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
}
