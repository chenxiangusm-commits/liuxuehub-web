"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AIProductIntro from "@/components/AIProductIntro";
import type { ResumeEducation, ResumeExperience, SelectedProgramContext } from "@/lib/ai/resume";
import type { WritingStrategy, DocumentDraft, DocumentReview } from "@/lib/ai/writing-strategy";

interface EnhancedResult {
  documentType: string;
  strategy: WritingStrategy;
  draft: DocumentDraft;
  review: DocumentReview;
  complianceStatement: {
    declarations: string[];
    disclaimers: string[];
    verificationRequired: boolean;
  };
  membershipCta: {
    title: string;
    description: string;
    features: string[];
    upgradeUrl: string;
  };
}

const STAGE_OPTIONS = [
  { value: "本科", label: "本科" },
  { value: "硕士", label: "硕士" },
  { value: "博士", label: "博士" },
  { value: "交换", label: "交换生" },
  { value: "暑校", label: "暑期学校" },
];

const COUNTRY_OPTIONS = [
  { value: "香港", label: "香港" },
  { value: "英国", label: "英国" },
  { value: "澳洲", label: "澳洲" },
  { value: "新加坡", label: "新加坡" },
  { value: "美国", label: "美国" },
  { value: "加拿大", label: "加拿大" },
  { value: "欧洲", label: "欧洲" },
];

const DEGREE_OPTIONS = [
  { value: "本科", label: "本科" },
  { value: "硕士", label: "硕士" },
  { value: "博士", label: "博士" },
];

const EXPERIENCE_TYPES = [
  { value: "research", label: "科研经历" },
  { value: "internship", label: "实习经历" },
  { value: "project", label: "项目经历" },
  { value: "activity", label: "社团/志愿者" },
  { value: "award", label: "获奖经历" },
];

interface ProgramSearchResult {
  id: string;
  schoolName: string;
  schoolNameEn: string;
  region: string;
  qsRanking: number | null;
  majorCn: string;
  majorEn: string;
  degree: string;
  duration: string;
  fee: string;
  deadline: string;
  ielts: string;
  toefl: string;
  languageRequirement: string | null;
  subjectRequirement: string | null;
  admissionRoute: string | null;
  requirementDetail: string | null;
  curriculum: string[];
  objectives: string | null;
  careers: string[];
  officialUrl: string;
}

export default function ResumeBuilderClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<EnhancedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [stage, setStage] = useState("硕士");
  const [countries, setCountries] = useState<string[]>(["英国", "香港"]);
  const [targetMajor, setTargetMajor] = useState("");
  const [targetSchools, setTargetSchools] = useState("");
  const [outputLanguage, setOutputLanguage] = useState<"english" | "bilingual">("english");

  const [chineseName, setChineseName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [education, setEducation] = useState<ResumeEducation[]>([
    { school: "", major: "", degree: "本科", gpa: "", startDate: "", endDate: "", courses: "", awards: "" },
  ]);

  const [experiences, setExperiences] = useState<ResumeExperience[]>([]);

  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [programSearchKeyword, setProgramSearchKeyword] = useState("");
  const [programSearchResults, setProgramSearchResults] = useState<ProgramSearchResult[]>([]);
  const [isSearchingPrograms, setIsSearchingPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramSearchResult | null>(null);
  const [showProgramSearch, setShowProgramSearch] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProgramSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (programSearchKeyword.trim().length < 2) {
      setProgramSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingPrograms(true);
      try {
        const res = await fetch(`/api/programs/search?keyword=${encodeURIComponent(programSearchKeyword)}&limit=10`);
        const data = await res.json();
        if (data.success) {
          setProgramSearchResults(data.data);
          setShowProgramSearch(true);
        }
      } catch {
        console.error("搜索失败");
      } finally {
        setIsSearchingPrograms(false);
      }
    }, 300);
  }, [programSearchKeyword]);

  const handleSelectProgram = (program: ProgramSearchResult) => {
    setSelectedProgram(program);
    setProgramSearchKeyword("");
    setProgramSearchResults([]);
    setShowProgramSearch(false);
    if (!targetMajor) {
      setTargetMajor(program.majorCn);
    }
    if (!targetSchools) {
      setTargetSchools(program.schoolName);
    }
  };

  const handleRemoveSelectedProgram = () => {
    setSelectedProgram(null);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { school: "", major: "", degree: "本科", gpa: "", startDate: "", endDate: "", courses: "", awards: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (index: number, field: keyof ResumeEducation, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addExperience = (type: ResumeExperience["type"]) => {
    setExperiences([
      ...experiences,
      { type, title: "", organization: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof ResumeExperience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const toggleCountry = (country: string) => {
    if (countries.includes(country)) {
      setCountries(countries.filter((c) => c !== country));
    } else {
      setCountries([...countries, country]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleGenerate = async () => {
    if (!englishName && !chineseName) {
      setError("请填写姓名信息");
      return;
    }
    if (education.every((e) => !e.school)) {
      setError("请至少填写一个教育背景");
      return;
    }

    setIsGenerating(true);
    setError(null);

    let selectedProgramContext: SelectedProgramContext | undefined;
    if (selectedProgram) {
      selectedProgramContext = {
        id: selectedProgram.id,
        schoolName: selectedProgram.schoolName,
        schoolNameEn: selectedProgram.schoolNameEn,
        region: selectedProgram.region,
        qsRanking: selectedProgram.qsRanking,
        majorCn: selectedProgram.majorCn,
        majorEn: selectedProgram.majorEn,
        degree: selectedProgram.degree,
        duration: selectedProgram.duration,
        fee: selectedProgram.fee,
        deadline: selectedProgram.deadline,
        ielts: selectedProgram.ielts,
        toefl: selectedProgram.toefl,
        languageRequirement: selectedProgram.languageRequirement,
        subjectRequirement: selectedProgram.subjectRequirement,
        admissionRoute: selectedProgram.admissionRoute,
        requirementDetail: selectedProgram.requirementDetail,
        curriculum: selectedProgram.curriculum,
        objectives: selectedProgram.objectives,
        careers: selectedProgram.careers,
        officialUrl: selectedProgram.officialUrl,
      };
    }

    try {
      const response = await fetch("/api/ai/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: {
            stage,
            countries,
            targetMajor,
            targetSchools,
            outputLanguage,
          },
          profile: {
            chineseName,
            englishName,
            email,
            phone,
            city,
            linkedin,
          },
          education,
          experiences,
          skills,
          languages,
          uploadedResumeText: uploadedFileName ? `[上传文件: ${uploadedFileName}]` : undefined,
          selectedProgramContext,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setShowResult(true);
      } else {
        setError(data.error || "生成失败，请稍后重试");
      }
    } catch {
      setError("网络错误，请检查连接后重试");
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
        <AIProductIntro product="resume" />
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {result.draft?.title || 'Curriculum Vitae'}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(result.draft?.finalDraft || '')}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制内容
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {result.draft?.finalDraft || '生成中...'}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-6m-6 6h6" />
              </svg>
              下载PDF（预览版有水印）
            </button>
            <button className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center relative overflow-hidden">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载Word
              <span className="absolute top-0 right-0 bg-yellow-400 text-yellow-800 text-xs px-2 py-0.5 rounded-bl-lg font-medium">
                会员
              </span>
            </button>
            <button className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              生成新版本
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                简历亮点
              </h3>
              <ul className="space-y-3">
                {result.review?.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{strength.strength}</p>
                      <p className="text-sm text-gray-600">{strength.evidence}</p>
                    </div>
                  </li>
                )) || (
                  <li className="text-gray-500">分析中...</li>
                )}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                项目匹配说明
              </h3>
              {result.strategy?.alignmentAnalysis && (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={result.strategy.alignmentAnalysis.overallFitScore >= 70 ? "#8B5CF6" : "#F59E0B"}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(result.strategy.alignmentAnalysis.overallFitScore / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-purple-700">
                        {result.strategy.alignmentAnalysis.overallFitScore}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-purple-700 font-medium">
                        {result.strategy.alignmentAnalysis.overallFitScore >= 70 ? "匹配度较高" : "有一定差距"}
                      </p>
                      <p className="text-xs text-gray-500">综合匹配评分</p>
                    </div>
                  </div>
                  {result.strategy.alignmentAnalysis.recommendations?.slice(0, 2).map((rec, index) => (
                    <div key={index} className="text-sm text-gray-700 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded mr-2 ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rec.priority === 'high' ? '重点' : '建议'}
                      </span>
                      {rec.recommendation}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              招生官视角简评
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.review?.admissionsOfficerPerspective?.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{comment.category}</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(comment.rating / 2) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">{comment.explanation}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm text-blue-700">
                  综合评分: {result.review?.overallRating || 0}/10 | 置信度: {result.review?.confidenceScore || 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              优化建议与风险提醒
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">改进建议</h4>
                <ul className="space-y-2">
                  {result.review?.areasForImprovement?.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className={`text-xs px-2 py-0.5 rounded mr-2 flex-shrink-0 mt-0.5 ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {suggestion.priority === 'high' ? '高' : suggestion.priority === 'medium' ? '中' : '低'}
                      </span>
                      <div>
                        <p className="text-sm text-gray-800">{suggestion.suggestion}</p>
                        <p className="text-xs text-gray-500">{suggestion.rationale}</p>
                        {suggestion.example && (
                          <p className="text-xs text-blue-600 mt-1">例如: {suggestion.example}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-amber-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">合规声明</h4>
                <ul className="space-y-1">
                  {result.complianceStatement?.declarations?.slice(0, 3).map((declaration, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {declaration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-3">{result.membershipCta?.title || "解锁完整功能"}</h3>
            <p className="text-sm text-blue-100 mb-4">{result.membershipCta?.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {result.membershipCta?.features.map((feature, index) => (
                <div key={index} className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2.5 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              升级会员
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AIProductIntro product="resume" />
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/ai" className="hover:text-blue-600">
          留学AI工具中心
        </Link>
        <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-800">AI留学申请简历</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI留学申请简历生成器</h1>
        <p className="text-gray-600">
          填写您的信息，生成适合海外院校申请的英文CV
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              A
            </span>
            申请目标
          </h2>

          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-purple-700">从专业库选择目标项目（增强功能）</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">会员功能预览</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              选择目标项目后，AI将根据项目要求为您定制CV，突出匹配的经历和技能
            </p>

            {selectedProgram ? (
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">{selectedProgram.schoolName}</span>
                      {selectedProgram.qsRanking && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          QS #{selectedProgram.qsRanking}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{selectedProgram.majorCn}</p>
                    <p className="text-xs text-gray-500">{selectedProgram.majorEn}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{selectedProgram.region}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{selectedProgram.degree}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{selectedProgram.duration}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      {selectedProgram.ielts && selectedProgram.ielts !== "待确认" && (
                        <div><span className="text-gray-500">IELTS:</span> <span className="text-gray-700">{selectedProgram.ielts}</span></div>
                      )}
                      {selectedProgram.fee && selectedProgram.fee !== "待确认" && (
                        <div><span className="text-gray-500">学费:</span> <span className="text-gray-700">{selectedProgram.fee}</span></div>
                      )}
                    </div>
                    {selectedProgram.requirementDetail && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">申请要求：</span>{selectedProgram.requirementDetail}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveSelectedProgram}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    value={programSearchKeyword}
                    onChange={(e) => setProgramSearchKeyword(e.target.value)}
                    onFocus={() => programSearchResults.length > 0 && setShowProgramSearch(true)}
                    placeholder="搜索学校或专业，如：港大、计算机、金融..."
                    className="w-full px-4 py-2.5 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  {isSearchingPrograms && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {showProgramSearch && programSearchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {programSearchResults.map((program) => (
                      <button
                        key={program.id}
                        onClick={() => handleSelectProgram(program)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{program.schoolName}</span>
                              {program.qsRanking && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">QS #{program.qsRanking}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{program.majorCn}</p>
                            <p className="text-xs text-gray-400">{program.majorEn}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">{program.region}</span>
                            <p className="text-xs text-gray-400">{program.degree}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                申请阶段 <span className="text-red-500">*</span>
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标专业方向 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => setTargetMajor(e.target.value)}
                placeholder="如：计算机科学、金融学"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标国家/地区
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleCountry(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      countries.includes(opt.value)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标学校（可选）
              </label>
              <input
                type="text"
                value={targetSchools}
                onChange={(e) => setTargetSchools(e.target.value)}
                placeholder="如：Imperial College London, UCL, HKU"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                输出语言
              </label>
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value as "english" | "bilingual")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">英文CV</option>
                <option value="bilingual">中英双语</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              B
            </span>
            基础信息
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">中文姓名</label>
              <input
                type="text"
                value={chineseName}
                onChange={(e) => setChineseName(e.target.value)}
                placeholder="张三"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                英文姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="San Zhang"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+86 138 0000 0000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所在城市</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="北京"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/yourname"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              C
            </span>
            教育背景
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                {education.length > 1 && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      学校 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, "school", e.target.value)}
                      placeholder="北京大学"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      专业 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => updateEducation(index, "major", e.target.value)}
                      placeholder="计算机科学与技术"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">学历</label>
                    <select
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {DEGREE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA/均分</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                      placeholder="3.8/4.0 或 85/100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                      placeholder="2020.09"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                      placeholder="2024.06"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">核心课程</label>
                    <input
                      type="text"
                      value={edu.courses}
                      onChange={(e) => updateEducation(index, "courses", e.target.value)}
                      placeholder="数据结构、算法、机器学习、数据库"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">排名/奖学金</label>
                    <input
                      type="text"
                      value={edu.awards}
                      onChange={(e) => updateEducation(index, "awards", e.target.value)}
                      placeholder="Top 5%、国家奖学金"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + 添加教育经历
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              D
            </span>
            经历信息
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {EXPERIENCE_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => addExperience(type.value as ResumeExperience["type"])}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                + {type.label}
              </button>
            ))}
          </div>

          {experiences.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>点击上方按钮添加经历</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, index) => {
                const typeLabel = EXPERIENCE_TYPES.find((t) => t.value === exp.type)?.label || exp.type;
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {typeLabel}
                      </span>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, "title", e.target.value)}
                          placeholder="项目名称或职位"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">组织/公司</label>
                        <input
                          type="text"
                          value={exp.organization || ""}
                          onChange={(e) => updateExperience(index, "organization", e.target.value)}
                          placeholder="公司或机构名称"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                        <input
                          type="text"
                          value={exp.startDate || ""}
                          onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                          placeholder="2023.06"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                        <input
                          type="text"
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                          placeholder="2023.09 或 至今"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                          placeholder="描述您的职责、成果和贡献，尽量数据化"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              E
            </span>
            技能与语言
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">技能</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, Java, SQL, TensorFlow, AWS..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">语言能力</label>
              <textarea
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="英语 CET-6 580, 雅思 7.0, 日语 N2..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold mr-3">
              F
            </span>
            上传现有简历（可选）
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedFileName ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{uploadedFileName}</span>
                <button
                  onClick={() => setUploadedFileName(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer text-gray-500 hover:text-blue-500"
                >
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p>点击上传 PDF 或 Word 文件</p>
                  <p className="text-xs text-gray-400 mt-1">MVP阶段暂不解析文件内容</p>
                </label>
              </>
            )}
          </div>
        </section>

        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </span>
            ) : (
              "生成留学简历"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
