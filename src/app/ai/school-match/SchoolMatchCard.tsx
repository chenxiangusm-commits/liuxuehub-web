'use client';

import Link from 'next/link';
import type { RecommendedSchool } from '@/lib/schoolMatch';

interface SchoolMatchCardProps {
  school: RecommendedSchool;
}

export default function SchoolMatchCard({ school }: SchoolMatchCardProps) {
  const difficultyColor = {
    '冲刺': 'bg-red-100 text-red-700',
    '稳妥': 'bg-green-100 text-green-700',
    '保底': 'bg-blue-100 text-blue-700',
  }[school.difficulty];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* 头部 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{school.nameCn}</h3>
          <p className="text-sm text-gray-500">{school.nameEn}</p>
        </div>
        <div className="flex flex-col items-end">
          {school.qsRank && (
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-1">QS</span>
              <span className="text-lg font-bold text-red-600">{school.qsRank}</span>
            </div>
          )}
          <span className={`mt-1 px-2 py-0.5 rounded text-xs font-medium ${difficultyColor}`}>
            {school.difficulty}
          </span>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-gray-600">{school.country}</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-600">推荐 {school.programCount} 个专业方向</span>
        <span className="text-gray-300">|</span>
        <span className="text-blue-600 font-medium">匹配度 {school.matchScore}%</span>
      </div>

      {/* 推荐理由 */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-500 mb-2">推荐理由</h4>
        <ul className="space-y-1">
          {school.reasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <span className="text-green-500 mr-2">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* 风险提示 */}
      <div className="bg-amber-50 rounded-lg p-3 mb-4">
        <div className="flex items-start">
          <svg className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-700">{school.riskWarning}</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <Link
          href={`/schools/${encodeURIComponent(school.nameCn)}`}
          className="flex-1 px-3 py-2 text-center text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          查看学校
        </Link>
        <Link
          href={`/schools/${encodeURIComponent(school.nameCn)}#programs`}
          className="flex-1 px-3 py-2 text-center text-sm bg-blue-600 border border-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
        >
          查看该校专业
        </Link>
        <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
