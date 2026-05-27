'use client';

import { useState } from 'react';
import type { RecommendedSchool } from '@/lib/schoolMatch';
import SchoolMatchCard from './SchoolMatchCard';

interface MatchResultTabsProps {
  reachSchools: RecommendedSchool[];
  matchSchools: RecommendedSchool[];
  safetySchools: RecommendedSchool[];
}

export default function MatchResultTabs({ reachSchools, matchSchools, safetySchools }: MatchResultTabsProps) {
  const [activeTab, setActiveTab] = useState<'reach' | 'match' | 'safety'>('reach');

  const tabs = [
    { key: 'reach' as const, label: '冲刺院校', schools: reachSchools, color: 'red' },
    { key: 'match' as const, label: '稳妥院校', schools: matchSchools, color: 'green' },
    { key: 'safety' as const, label: '保底院校', schools: safetySchools, color: 'blue' },
  ];

  const currentTab = tabs.find(t => t.key === activeTab)!;

  return (
    <div className="mb-8">
      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? `border-${tab.color}-500 text-${tab.color}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key
                ? `bg-${tab.color}-100 text-${tab.color}-700`
                : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.schools.length}
            </span>
          </button>
        ))}
      </div>

      {/* 学校列表 */}
      {currentTab.schools.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">暂无符合条件的{currentTab.label}</p>
          <p className="text-sm text-gray-400 mt-1">尝试调整筛选条件</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTab.schools.map((school, index) => (
            <SchoolMatchCard key={`${school.nameCn}-${index}`} school={school} />
          ))}
        </div>
      )}
    </div>
  );
}
