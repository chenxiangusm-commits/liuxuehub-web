"use client";

import Link from "next/link";
import { Program } from "@/types";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { useState, useEffect } from "react";
import { formatDisplayValue, formatFee } from "@/lib/displayFormat";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(program.id));
  }, [program.id]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(toggleFavorite(program.id));
  };

  const feeInfo = formatFee(program.fee);

  return (
    <Link href={`/programs/${program.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow relative">
        {/* 收藏按钮 */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            className={`w-5 h-5 ${favorited ? "text-red-500 fill-red-500" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* 专业名称 */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-white bg-blue-700 px-2 py-1 rounded">
              {program.education_level === "postgraduate" ? "硕士" : "本科"}
            </span>
            <span className="text-xs text-gray-500">
              {program.region_cn}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1 pr-8">
            {program.major_cn || program.major_en || "待确认"}
          </h3>
          <p className="text-sm text-gray-500 mb-1 line-clamp-1">
            {program.major_en || "-"}
          </p>
          <p className="text-sm text-blue-700 font-medium">
            {program.school_name || "待确认"}
          </p>
        </div>

        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">学制</p>
            <p className="font-medium text-gray-800">{formatDisplayValue(program.duration)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0.5">语言要求</p>
            <p className="font-medium text-gray-800">{formatDisplayValue(program.ielts)}</p>
          </div>
        </div>

        {/* 学费 */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-xs mb-0.5">学费</p>
          <p className="font-medium text-gray-800">{feeInfo.primary}</p>
          {feeInfo.secondary && (
            <p className="text-xs text-gray-500 mt-1">{feeInfo.secondary}</p>
          )}
        </div>

        {/* 查看详情 */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-blue-600 font-medium hover:text-blue-800">
            查看详情 &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
