'use client';

import { useState } from 'react';
import AIProductIntro from '@/components/AIProductIntro';
import MembershipModal from '@/components/MembershipModal';
import type {
  MotivationLetterInput,
  MotivationLetterOutput,
} from '@/lib/ai/motivation-letter-generator';
import {
  TONE_PREFERENCE_OPTIONS,
  STAGE_OPTIONS,
  COUNTRY_OPTIONS,
} from '@/lib/ai/document-types';

export default function MotivationLetterPage() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<MotivationLetterOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  // Form states
  const [stage, setStage] = useState('硕士');
  const [countries, setCountries] = useState<string[]>(['英国', '香港']);
  const [targetSchools, setTargetSchools] = useState('');
  const [targetMajor, setTargetMajor] = useState('');

  const [chineseName, setChineseName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [currentMajor, setCurrentMajor] = useState('');
  const [gpa, setGpa] = useState('');
  const [applicationDirection, setApplicationDirection] = useState('');

  const [motivation, setMotivation] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [academicBackground, setAcademicBackground] = useState('');
  const [careerAspirations, setCareerAspirations] = useState('');
  const [whyThisSchool, setWhyThisSchool] = useState('');
  const [whatYouCanContribute, setWhatYouCanContribute] = useState('');
  const [tonePreference, setTonePreference] = useState<'steady' | 'positive' | 'strong'>('positive');

  const handleCountryChange = (country: string, checked: boolean) => {
    if (checked) {
      setCountries([...countries, country]);
    } else {
      setCountries(countries.filter(c => c !== country));
    }
  };

  const handleGenerate = async () => {
    if (!chineseName || !englishName || !currentSchool || !currentMajor) {
      setError('请填写学生基本信息');
      return;
    }

    setIsGenerating(true);
    setError('');

    const input: MotivationLetterInput = {
      application: {
        stage,
        countries,
        targetSchools: targetSchools.split(',').map(s => s.trim()).filter(Boolean),
        targetMajor,
      },
      student: {
        chineseName,
        englishName,
        currentSchool,
        currentMajor,
        gpa: gpa || undefined,
        applicationDirection,
        keyStrengths: [],
      },
      contentMaterials: {
        motivation,
        relevantExperience,
        academicBackground,
        careerAspirations,
        whyThisSchool,
        whatYouCanContribute,
        tonePreference,
      },
    };

    try {
      const response = await fetch('/api/ai/motivation-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setShowResult(true);
      } else {
        setError(data.error || '生成失败，请稍后重试');
      }
    } catch {
      setError('网络错误，请检查连接后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToEdit = () => {
    setShowResult(false);
    setResult(null);
  };

  if (showResult && result) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MembershipModal isOpen={showMembershipModal} onClose={() => setShowMembershipModal(false)} />
        <AIProductIntro product="motivation" />
        <button
          onClick={handleBackToEdit}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回修改
        </button>

        <div className="space-y-6">
          {/* 完整动机信草稿 - 优先显示 */}
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {result.title}
              </h2>
              <button
                onClick={() => navigator.clipboard.writeText(result.finalDraft)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制成稿
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto leading-relaxed">
                {result.finalDraft}
              </pre>
            </div>
          </div>

          {/* 下载按钮 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setShowMembershipModal(true)}
              className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-6m-6 6h6" />
              </svg>
              下载PDF
            </button>
            <button
              onClick={() => setShowMembershipModal(true)}
              className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载Word
            </button>
            <button
              onClick={() => setShowMembershipModal(true)}
              className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              生成新版本
            </button>
          </div>

          {/* 中文说明 */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">中文说明</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.chineseSummary}</p>
          </div>

          {/* 文书亮点 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">文书亮点</h3>
            <ul className="space-y-3">
              {result.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800">{highlight.point}</p>
                    <p className="text-sm text-gray-600">{highlight.evidence}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 招生官视角简评 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">招生官视角简评</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.admissionsReview}</p>
          </div>

          {/* 风险提醒 */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">风险提醒与使用建议</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">风险提醒</h4>
                <ul className="space-y-1">
                  {result.riskWarnings.map((warning, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-amber-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">合规声明</h4>
                <ul className="space-y-1">
                  {result.complianceStatement.map((statement, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {statement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AIProductIntro product="motivation" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI 动机信参考草稿</h1>
        <p className="mt-2 text-gray-600">
          针对目标院校和专业生成 Motivation Letter 成稿
        </p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-800">不知道怎么填？</p>
              <p className="text-blue-700 mt-1">
                可先填写姓名、学校、专业、目标专业和核心经历，其他内容可后续补充。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-amber-800">重要提示</p>
              <p className="text-amber-700 mt-1">
                本工具生成的动机信为参考草稿，请根据个人实际情况修改后使用。
                所有内容必须基于真实经历，切勿直接使用AI生成内容作为最终稿。
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* 申请信息 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">申请信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请阶段</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">目标专业</label>
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                placeholder="如：Computer Science, Finance"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">目标国家/地区</label>
              <div className="flex flex-wrap gap-2">
                {COUNTRY_OPTIONS.map(opt => (
                  <label key={opt.value} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={countries.includes(opt.value)}
                      onChange={(e) => handleCountryChange(opt.value, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">目标学校（可选，多个用逗号分隔）</label>
              <input
                type="text"
                value={targetSchools}
                onChange={(e) => setTargetSchools(e.target.value)}
                placeholder="如：Imperial College London, University of Hong Kong"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 学生信息 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">学生信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学生中文姓名 *</label>
              <input
                type="text"
                value={chineseName}
                onChange={(e) => setChineseName(e.target.value)}
                placeholder="张三"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学生英文姓名 *</label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="San Zhang"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前学校 *</label>
              <input
                type="text"
                value={currentSchool}
                onChange={(e) => setCurrentSchool(e.target.value)}
                placeholder="如：Peking University"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前专业 *</label>
              <input
                type="text"
                value={currentMajor}
                onChange={(e) => setCurrentMajor(e.target.value)}
                placeholder="如：Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA/均分（可选）</label>
              <input
                type="text"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="如：3.8/4.0 或 88/100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请方向</label>
              <input
                type="text"
                value={applicationDirection}
                onChange={(e) => setApplicationDirection(e.target.value)}
                placeholder="如：Machine Learning, Data Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 动机信内容素材 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">动机信内容素材</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请动机（为什么想学习这个专业）</label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="描述您的申请动机和热情来源..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学术背景（您的相关学术学习）</label>
              <textarea
                value={academicBackground}
                onChange={(e) => setAcademicBackground(e.target.value)}
                placeholder="描述您的学术背景和相关课程学习..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">相关经历（与申请专业相关的实习、项目、工作经验）</label>
              <textarea
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                placeholder="描述您的相关经历..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">您能提供的贡献（您能为学校社区带来什么）</label>
              <textarea
                value={whatYouCanContribute}
                onChange={(e) => setWhatYouCanContribute(e.target.value)}
                placeholder="描述您能提供的独特价值..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">为什么选择这所学校</label>
              <textarea
                value={whyThisSchool}
                onChange={(e) => setWhyThisSchool(e.target.value)}
                placeholder="说明为什么选择目标学校..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职业期望（您的职业发展规划）</label>
              <textarea
                value={careerAspirations}
                onChange={(e) => setCareerAspirations(e.target.value)}
                placeholder="描述您的职业目标和愿景..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">语气偏好</label>
              <div className="flex gap-4">
                {TONE_PREFERENCE_OPTIONS.map(opt => (
                  <label key={opt.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="tonePreference"
                      value={opt.value}
                      checked={tonePreference === opt.value}
                      onChange={(e) => setTonePreference(e.target.value as 'steady' | 'positive' | 'strong')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 生成按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                生成 Motivation Letter 参考草稿
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
