'use client';

import { useState } from 'react';
import AIProductIntro from '@/components/AIProductIntro';
import MembershipModal from '@/components/MembershipModal';
import type {
  RecommendationLetterInput,
  RecommendationLetterOutput
} from '@/lib/ai/recommendation-letter';
import {
  RECOMMENDER_IDENTITY_OPTIONS,
  TONE_PREFERENCE_OPTIONS,
  STAGE_OPTIONS,
  COUNTRY_OPTIONS,
} from '@/lib/ai/recommendation-letter';

export default function RecommendationLetterPage() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<RecommendationLetterOutput | null>(null);
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
  const [keyStrengths, setKeyStrengths] = useState('');

  const [recommenderIdentity, setRecommenderIdentity] = useState('course_teacher');
  const [recommenderName, setRecommenderName] = useState('');
  const [recommenderTitle, setRecommenderTitle] = useState('');
  const [recommenderInstitution, setRecommenderInstitution] = useState('');
  const [relationship, setRelationship] = useState('');
  const [knownDuration, setKnownDuration] = useState('');
  const [courseOrProject, setCourseOrProject] = useState('');
  const [verifiableAbilities, setVerifiableAbilities] = useState('');

  const [academicExamples, setAcademicExamples] = useState('');
  const [researchExamples, setResearchExamples] = useState('');
  const [classPerformance, setClassPerformance] = useState('');
  const [communicationAbility, setCommunicationAbility] = useState('');
  const [leadershipResponsibility, setLeadershipResponsibility] = useState('');
  const [englishAbility, setEnglishAbility] = useState('');
  const [keySellingPoints, setKeySellingPoints] = useState('');
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
    if (!relationship || !courseOrProject) {
      setError('请填写推荐人信息');
      return;
    }

    setIsGenerating(true);
    setError('');

    const input: RecommendationLetterInput = {
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
        keyStrengths: keyStrengths.split(',').map(s => s.trim()).filter(Boolean),
      },
      recommender: {
        identity: recommenderIdentity as RecommendationLetterInput['recommender']['identity'],
        name: recommenderName || undefined,
        title: recommenderTitle || undefined,
        institution: recommenderInstitution || undefined,
        relationship,
        knownDuration,
        courseOrProject,
        verifiableAbilities: verifiableAbilities.split(',').map(s => s.trim()).filter(Boolean),
      },
      contentMaterials: {
        academicAbilityExamples: academicExamples.split('\n').filter(Boolean),
        researchAbilityExamples: researchExamples.split('\n').filter(Boolean),
        classPerformance,
        communicationAbility,
        leadershipResponsibility,
        englishCrossCulturalAbility: englishAbility || undefined,
        keySellingPoints: keySellingPoints.split(',').map(s => s.trim()).filter(Boolean),
        tonePreference,
      },
    };

    try {
      const response = await fetch('/api/ai/recommendation-letter/generate', {
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
        <AIProductIntro product="recommendation" />
        <button
          onClick={handleBackToEdit}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回修改
        </button>

        {/* 合规提示 */}
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              <p className="font-bold text-red-800">合规声明</p>
              <p className="text-red-700 mt-1">
                本功能生成推荐信参考草稿，最终内容需由推荐人审阅、修改和确认后提交。请勿伪造推荐人身份、签名或联系方式。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 完整推荐信草稿 - 优先显示 */}
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

          {/* 推荐信亮点 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">推荐信亮点</h3>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              招生官视角简评
            </h3>
            <p className="text-sm text-gray-700">{result.admissionsReview}</p>
          </div>

          {/* 风险提醒 */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              风险提醒与使用建议
            </h3>
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
      <AIProductIntro product="recommendation" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI 推荐信参考草稿</h1>
        <p className="mt-2 text-gray-600">
          生成完整英文推荐信草稿，供推荐人审阅、修改和确认后使用
        </p>
        {/* 强化合规提示 - 红色醒目 */}
        <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              <p className="font-bold text-red-800">合规声明</p>
              <p className="text-red-700 mt-1">
                本功能生成推荐信参考草稿，最终内容需由推荐人审阅、修改和确认后提交。请勿伪造推荐人身份、签名或联系方式。
              </p>
            </div>
          </div>
        </div>
        {/* 快速开始提示 */}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">主要优势（多个用逗号分隔）</label>
              <input
                type="text"
                value={keyStrengths}
                onChange={(e) => setKeyStrengths(e.target.value)}
                placeholder="如：科研能力强、编程基础扎实、沟通表达优秀"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 推荐人信息 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐人信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐人身份 *</label>
              <select
                value={recommenderIdentity}
                onChange={(e) => setRecommenderIdentity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {RECOMMENDER_IDENTITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐人姓名（可选）</label>
              <input
                type="text"
                value={recommenderName}
                onChange={(e) => setRecommenderName(e.target.value)}
                placeholder="如：Prof. Wang"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐人职称（可选）</label>
              <input
                type="text"
                value={recommenderTitle}
                onChange={(e) => setRecommenderTitle(e.target.value)}
                placeholder="如：Professor, Associate Professor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐人单位（可选）</label>
              <input
                type="text"
                value={recommenderInstitution}
                onChange={(e) => setRecommenderInstitution(e.target.value)}
                placeholder="如：Department of Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">与推荐人关系 *</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="如：我是学生的数据结构课程授课老师，已认识该学生两年"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">认识时长</label>
              <input
                type="text"
                value={knownDuration}
                onChange={(e) => setKnownDuration(e.target.value)}
                placeholder="如：2年"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">教授的课程或指导的项目 *</label>
              <input
                type="text"
                value={courseOrProject}
                onChange={(e) => setCourseOrProject(e.target.value)}
                placeholder="如：数据结构与算法、机器学习研究项目"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐人可以证明的能力（多个用逗号分隔）</label>
              <input
                type="text"
                value={verifiableAbilities}
                onChange={(e) => setVerifiableAbilities(e.target.value)}
                placeholder="如：编程能力、数学基础、问题解决能力、研究潜力"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 推荐内容素材 */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">推荐内容素材</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学术能力相关事例（每行一个）</label>
              <textarea
                value={academicExamples}
                onChange={(e) => setAcademicExamples(e.target.value)}
                placeholder="描述推荐人观察到的学生学术表现，如：&#10;• 在期末考试中获得班级前5%&#10;• 独立完成了课程项目并获得了高分"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">科研/项目能力事例（每行一个）</label>
              <textarea
                value={researchExamples}
                onChange={(e) => setResearchExamples(e.target.value)}
                placeholder="描述推荐人参与或观察到的科研/项目经历，如：&#10;• 主导了实验室的图像识别项目&#10;• 独立完成了XX算法的实现和测试"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">课堂表现</label>
              <textarea
                value={classPerformance}
                onChange={(e) => setClassPerformance(e.target.value)}
                placeholder="描述学生在课堂上的表现，如：积极提问、善于思考、小组讨论中的贡献等"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">沟通协作能力</label>
              <textarea
                value={communicationAbility}
                onChange={(e) => setCommunicationAbility(e.target.value)}
                placeholder="描述学生在沟通协作方面的表现"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">领导力或责任心</label>
              <textarea
                value={leadershipResponsibility}
                onChange={(e) => setLeadershipResponsibility(e.target.value)}
                placeholder="描述学生在领导力或责任心方面的表现"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">英文能力或跨文化能力（可选）</label>
              <textarea
                value={englishAbility}
                onChange={(e) => setEnglishAbility(e.target.value)}
                placeholder="描述学生的英语能力和跨文化交流经验"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最希望推荐信突出的 2-3 个卖点（多个用逗号分隔）</label>
              <input
                type="text"
                value={keySellingPoints}
                onChange={(e) => setKeySellingPoints(e.target.value)}
                placeholder="如：科研潜力、编程能力、学习能力"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">推荐语气</label>
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
                生成推荐信参考草稿
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
