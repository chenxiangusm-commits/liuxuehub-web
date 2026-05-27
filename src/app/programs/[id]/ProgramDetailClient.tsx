"use client";

import Link from "next/link";
import Image from "next/image";
import { Program } from "@/types";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/storage";
import { getSchoolTags } from "@/lib/schoolTags";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import { useState, useEffect } from "react";
import { 
  formatFee, 
  formatIntake, 
  formatDuration,
  formatCollegeDisplayName,
  formatEducationLevel,
  formatIELTS,
  formatTOEFL
} from "@/lib/displayFormat";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface ProgramDetailClientProps {
  program: Program;
}

// 根据地区获取申请时间线规划
const getTimelineByRegion = (region: string): Array<{ label: string; date: string }> => {
  const regionLower = region.toLowerCase();
  
  if (regionLower.includes('英国')) {
    return [
      { label: "申请开放", date: "2025年9月" },
      { label: "建议递交", date: "2025年10–12月" },
      { label: "滚动录取", date: "以官网为准" },
      { label: "官网确认", date: "以官网为准" },
    ];
  }
  
  if (regionLower.includes('香港')) {
    return [
      { label: "申请开放", date: "2025年9月" },
      { label: "建议递交", date: "2025年10–12月" },
      { label: "预计截止", date: "2026年1–4月" },
      { label: "官网确认", date: "以官网为准" },
    ];
  }
  
  if (regionLower.includes('新加坡')) {
    return [
      { label: "申请开放", date: "2025年8–10月" },
      { label: "建议递交", date: "开放后1个月内" },
      { label: "预计截止", date: "2026年2月" },
      { label: "官网确认", date: "以官网为准" },
    ];
  }
  
  if (regionLower.includes('澳洲') || regionLower.includes('澳大利亚')) {
    return [
      { label: "滚动开放", date: "全年接受申请" },
      { label: "建议递交", date: "开学前4–6个月" },
      { label: "名额满即止", date: "先到先得" },
      { label: "官网确认", date: "以官网为准" },
    ];
  }
  
  // 默认时间线
  return [
    { label: "申请开放", date: "以官网为准" },
    { label: "建议递交", date: "尽早申请" },
    { label: "截止日期", date: "以官网为准" },
    { label: "官网确认", date: "以官网为准" },
  ];
};

// 获取真实截止日期时间线
const parseDeadlineTimeline = (deadline: string): Array<{ label: string; date: string }> | null => {
  if (!deadline || deadline.toLowerCase().includes('see official') || deadline.toLowerCase().includes('以官网为准')) {
    return null;
  }
  
  const timeline: Array<{ label: string; date: string }> = [];
  
  // 检查是否包含滚动录取
  if (deadline.toLowerCase().includes('rolling')) {
    timeline.push({ label: "滚动录取", date: "建议尽早申请" });
  }
  
  // 提取轮次截止日期
          const roundMatches = deadline.match(/(Round\s*\d+:?\s*)([\d/\-]+)/gi);
          if (roundMatches) {
            roundMatches.forEach((match) => {
              const parts = match.split(':');
              const roundLabel = parts[0].trim();
              const date = parts[1]?.trim() || '';
              if (date) {
                timeline.push({ label: roundLabel, date });
              }
            });
          }
  
  // 如果没有轮次，尝试提取日期
  if (timeline.length === 0) {
    // 尝试匹配日期格式
    const datePattern = /(\d{4}[\-/]\d{2}[\-/]\d{2})/g;
    let match;
    while ((match = datePattern.exec(deadline)) !== null) {
      timeline.push({ label: timeline.length === 0 ? "截止日期" : `截止日期 ${timeline.length + 1}`, date: match[1] });
    }
  }
  
  // 添加官网确认
  timeline.push({ label: "官网确认", date: "以官网为准" });
  
  return timeline.length > 1 ? timeline : null;
};

// 获取通用就业方向
const getGeneralCareers = (majorCn: string, majorEn: string): string[] => {
  const text = `${majorCn} ${majorEn}`.toLowerCase();
  
  if (text.includes('计算机') || text.includes('computer') || text.includes('software')) {
    return ['软件开发工程师', '数据分析师', '系统架构师', '人工智能工程师', '产品经理'];
  }
  
  if (text.includes('金融') || text.includes('finance')) {
    return ['投资分析师', '金融顾问', '风险管理', '资产管理', '投资银行'];
  }
  
  if (text.includes('商业') || text.includes('business') || text.includes('management')) {
    return ['企业管理', '市场营销', '人力资源', '运营管理', '咨询顾问'];
  }
  
  if (text.includes('工程') || text.includes('engineering')) {
    return ['工程师', '项目管理', '技术咨询', '研发工程师', '产品设计'];
  }
  
  if (text.includes('数据') || text.includes('data') || text.includes('analytics')) {
    return ['数据分析师', '商业分析师', '数据科学家', '机器学习工程师', '量化分析师'];
  }
  
  if (text.includes('传媒') || text.includes('media') || text.includes('communication')) {
    return ['媒体策划', '品牌营销', '公共关系', '内容创作', '数字营销'];
  }
  
  if (text.includes('教育') || text.includes('education')) {
    return ['教育管理', '课程设计', '学术研究', '教育培训', '教育咨询'];
  }
  
  if (text.includes('法律') || text.includes('law')) {
    return ['律师', '法律顾问', '合规管理', '政策分析', '知识产权'];
  }
  
  return ['相关行业工作', '继续深造', '创业', '专业服务', '咨询顾问'];
};

// Mock AI评估结果
const getMockAIResult = () => ({
  probability: 72,
  judgment: '匹配',
  weaknesses: [
    '本科院校背景竞争力一般',
    '相关实习经历不足',
    '学术成绩处于中等水平'
  ],
  suggestions: [
    '建议补充1-2段相关领域实习',
    '准备高质量的个人陈述突出亮点',
    '争取获得强力推荐信',
    '提高语言成绩至雅思7.0'
  ]
});

export default function ProgramDetailClient({ program }: ProgramDetailClientProps) {
  const [favorited, setFavorited] = useState(false);
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiForm, setAIForm] = useState({
    school: '',
    gpa: '',
    background: '',
    language: '',
  });

  useEffect(() => {
    setFavorited(isFavorite(program.id));
  }, [program.id]);

  const handleToggleFavorite = () => {
    if (favorited) {
      removeFavorite(program.id);
    } else {
      addFavorite(program.id);
    }
    setFavorited(!favorited);
  };

  const handleAIAssessment = () => {
    setShowAIResult(true);
  };

  const feeInfo = formatFee(program.fee);
  const region = program.region_cn || '';
  
  // 优先使用真实截止日期，否则使用规划时间线
  const realTimeline = parseDeadlineTimeline(program.deadline || '');
  const timeline = realTimeline || getTimelineByRegion(region);
  const isAIPlan = !realTimeline;
  
  const careers = program.careers && program.careers.length > 0 ? program.careers : getGeneralCareers(program.major_cn || '', program.major_en || '');
  
  // 分组课程
  const curriculum = program.curriculum || [];
  const groupedCourses = {
    core: curriculum.slice(0, Math.ceil(curriculum.length * 0.4)) || [],
    elective: curriculum.slice(Math.ceil(curriculum.length * 0.4), Math.ceil(curriculum.length * 0.7)) || [],
    project: curriculum.slice(Math.ceil(curriculum.length * 0.7)) || []
  };

  // 检查是否有课程数据
  const hasCurriculumData = curriculum.length > 0 && 
    !curriculum.every(c => !c || c.trim() === '' || c.toLowerCase().includes('course list') || c.toLowerCase().includes('curriculum'));

  // 获取课程显示名称，优先显示中文
  const getCourseDisplayName = (course: string): string => {
    if (!course) return '';
    
    // 移除后台字段文案
    const cleanCourse = course
      .replace(/Course List/i, '')
      .replace(/Curriculum/i, '')
      .trim();
    
    // 如果包含 | 分隔符，优先取中文部分
    if (cleanCourse.includes('|')) {
      const parts = cleanCourse.split('|').map(p => p.trim());
      // 查找中文部分（包含中文字符）
      const chinesePart = parts.find(p => /[\u4e00-\u9fa5]/.test(p));
      if (chinesePart) {
        return chinesePart;
      }
      // 如果没有中文，返回第一个非空部分
      return parts[0] || cleanCourse;
    }
    
    return cleanCourse;
  };

  const aiResult = getMockAIResult();

  const languageRequirement = program.ielts && formatIELTS(program.ielts) ? formatIELTS(program.ielts) : 
                   program.toefl && formatTOEFL(program.toefl) ? formatTOEFL(program.toefl) : "官网暂未明确";
  const duration = formatDuration(program.duration) || "官网暂未明确";
  const intake = formatIntake(program.intake) || "官网暂未明确";

  return (
    <div className="space-y-6">
      {/* 模块1：专业头部 - 学生决策区 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-0">
          {/* 左侧：专业信息 - 70% */}
          <div className="p-6 lg:p-8">
            {/* 收藏按钮 - 右上角 */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  favorited
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
                }`}
              >
                <svg className="w-5 h-5" fill={favorited ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* 标签行 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs font-medium">
                {formatEducationLevel(program.education_level)}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs font-medium">
                {region}
              </Badge>
              {program.college && formatCollegeDisplayName(program.college) && (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200 text-xs font-medium">
                  {formatCollegeDisplayName(program.college)}
                </Badge>
              )}
              {getSchoolTags(program.school_code).map(tag => (
                <Badge key={tag} className="bg-gray-100 text-gray-700 border-gray-200 text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* 专业名称 - 最大视觉重点 */}
            <h1 className="text-5xl font-bold text-gray-900 mb-2 leading-tight">
              {program.major_cn || program.major_en || "官网暂未明确"}
            </h1>
            {program.major_en && (
              <p className="text-lg text-gray-500 mb-5">{program.major_en}</p>
            )}
            
            {/* 学校信息 */}
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/schools/${program.school_code}`} className="flex-shrink-0">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src={getSchoolMarkPath(program.school_code)}
                    alt={program.school_name || ''}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>
              </Link>
              <div>
                <Link href={`/schools/${program.school_code}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {program.school_name || "官网暂未明确"}
                </Link>
                <div className="text-sm text-gray-500">
                  {formatCollegeDisplayName(program.college) || "官网暂未明确"}
                </div>
                {program.qs_ranking_2026 && (
                  <div className="text-sm text-gray-400">
                    {region} · QS #{program.qs_ranking_2026}
                  </div>
                )}
              </div>
            </div>
            
            {/* 四个摘要卡 - 四卡横排 */}
            <div className="grid grid-cols-4 gap-4">
              {/* 国际学费 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-100" style={{ minHeight: '80px' }}>
                <div className="text-xs text-blue-600 font-medium mb-1">国际学费</div>
                <div className="text-lg font-bold text-blue-700">{feeInfo.primary}</div>
                {feeInfo.secondary && (
                  <div className="text-sm text-blue-600">{feeInfo.secondary}</div>
                )}
              </div>
              
              {/* 学制 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl p-4 border border-green-100" style={{ minHeight: '80px' }}>
                <div className="text-xs text-green-600 font-medium mb-1">学制</div>
                <div className="text-lg font-bold text-green-700">{duration}</div>
              </div>
              
              {/* 语言 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-xl p-4 border border-purple-100" style={{ minHeight: '80px' }}>
                <div className="text-xs text-purple-600 font-medium mb-1">语言</div>
                <div className="text-lg font-bold text-purple-700">{languageRequirement}</div>
              </div>
              
              {/* 入学 */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl p-4 border border-amber-100" style={{ minHeight: '80px' }}>
                <div className="text-xs text-amber-600 font-medium mb-1">入学</div>
                <div className="text-lg font-bold text-amber-700">{intake}</div>
              </div>
            </div>
            
            {/* 底部CTA区域 */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {/* 主按钮 */}
                <Link
                  href={`/ai/school-match?school=${encodeURIComponent(program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}&region=${encodeURIComponent(region)}`}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  AI评估我的录取率
                </Link>
                
                {/* AI面试体验 */}
                <Link
                  href={`/ai/interview?school=${encodeURIComponent(program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}`}
                  className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  AI面试体验
                </Link>
                
                {/* 访问官网 */}
                {program.official_url && (
                  <a
                    href={program.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    访问官网
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* 右侧：申请画像 - 30% */}
          <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6 lg:p-7 border-l border-gray-200">
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-gray-900">申请画像</h3>
              
              {/* 竞争等级 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500">竞争等级</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-gray-300">⭐</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-700">高竞争项目</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200"></div>
              
              {/* 建议背景 */}
              <div className="space-y-2.5">
                <div className="text-xs text-gray-500">建议背景</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">C9</span>
                    <span className="font-semibold text-gray-900">80–85+</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">985/211</span>
                    <span className="font-semibold text-gray-900">83–87+</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">双非</span>
                    <span className="font-semibold text-gray-900">87–90+</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">海外本科</span>
                    <span className="font-semibold text-gray-900">GPA 3.4–3.7+</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200"></div>
              
              {/* 偏好标签 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500">偏好标签</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                    数学能力
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                    科研经历
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                    实习经历
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                    相关背景
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200"></div>
              
              {/* 提升建议 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500">提升建议</div>
                <div className="bg-blue-50/60 rounded-lg p-3 space-y-1.5">
                  <div className="text-xs font-medium text-blue-800">双非建议：</div>
                  <div className="text-xs text-blue-700">• 增加科研经历</div>
                  <div className="text-xs text-blue-700">• 增加相关实习</div>
                  <div className="text-xs text-blue-700">• 雅思7.0+</div>
                </div>
              </div>
              
              {/* 免责声明 */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  基于历史项目数据推测<br/>
                  仅供参考
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 模块2：AI评估区 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">我适合申请这个项目吗？</h2>
        
        {!showAIResult ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={aiForm.school}
                onChange={(e) => setAIForm({ ...aiForm, school: e.target.value })}
                placeholder="本科院校"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={aiForm.gpa}
                onChange={(e) => setAIForm({ ...aiForm, gpa: e.target.value })}
                placeholder="均分/GPA"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={aiForm.background}
                onChange={(e) => setAIForm({ ...aiForm, background: e.target.value })}
                placeholder="专业背景"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={aiForm.language}
                onChange={(e) => setAIForm({ ...aiForm, language: e.target.value })}
                placeholder="语言成绩"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleAIAssessment}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              AI录取率评估
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 评估结果卡片 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-600">综合匹配度</span>
                <span className="text-4xl font-bold text-blue-600">{aiResult.probability}分</span>
              </div>
              
              {/* 概率分布 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-amber-600">冲刺概率</div>
                  <div className="text-xl font-bold text-amber-600">30%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-blue-600">匹配概率</div>
                  <div className="text-xl font-bold text-blue-600">50%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-green-600">保底概率</div>
                  <div className="text-xl font-bold text-green-600">20%</div>
                </div>
              </div>
              
              {/* 影响因素 */}
              <div className="mt-6 pt-4 border-t border-blue-200">
                <div className="text-sm text-gray-600 mb-3">影响因素：</div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700">
                    <span className="text-green-500">✓</span> GPA
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700">
                    <span className="text-green-500">✓</span> 院校背景
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700">
                    <span className="text-green-500">✓</span> 专业背景
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700">
                    <span className="text-green-500">✓</span> 实习科研
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700">
                    <span className="text-green-500">✓</span> 语言成绩
                  </span>
                </div>
              </div>
            </div>
            
            {/* 主要短板 */}
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-medium text-amber-800 mb-2">主要短板</h3>
              <ul className="space-y-1.5">
                {aiResult.weaknesses.map((item, idx) => (
                  <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 提升建议 */}
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-medium text-green-800 mb-2">提升建议</h3>
              <ul className="space-y-1.5">
                {aiResult.suggestions.map((item, idx) => (
                  <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 免责声明 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 text-center">
                AI评估结果基于公开项目信息和用户输入进行推测，仅供申请规划参考，不代表真实录取结果。
              </p>
            </div>
            
            <button
              onClick={() => setShowAIResult(false)}
              className="w-full py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              重新评估
            </button>
          </div>
        )}
      </Card>

      {/* 模块3：申请时间线 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">申请时间线</h2>
          {isAIPlan && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-300">AI规划参考，最终以官网为准</span>
          )}
        </div>
        
        <div className="relative">
          {/* 连接线 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
          
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                  index === 0 ? 'bg-blue-600 text-white' : 
                  index === timeline.length - 1 ? 'bg-gray-300 text-gray-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="mt-6 text-xs text-gray-500 text-center">
          以上时间为申请规划参考，最终截止日期请以学校官网为准。
        </p>
      </Card>

      {/* 模块4：课程设置 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">课程设置</h2>
        
        {/* 检查是否有任何课程数据 */}
        {hasCurriculumData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 核心课程 */}
            {groupedCourses.core.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📚</span>
                  <span className="font-medium text-blue-700">核心课程</span>
                </div>
                <ul className="space-y-2">
                  {groupedCourses.core.map((course, idx) => (
                    <li key={idx} className="text-sm text-gray-600 line-clamp-2">
                      {getCourseDisplayName(course)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 选修课程 */}
            {groupedCourses.elective.length > 0 && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🔬</span>
                  <span className="font-medium text-green-700">选修课程</span>
                </div>
                <ul className="space-y-2">
                  {groupedCourses.elective.map((course, idx) => (
                    <li key={idx} className="text-sm text-gray-600 line-clamp-2">
                      {getCourseDisplayName(course)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 项目实践 */}
            {groupedCourses.project.length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">💡</span>
                  <span className="font-medium text-amber-700">项目实践</span>
                </div>
                <ul className="space-y-2">
                  {groupedCourses.project.map((course, idx) => (
                    <li key={idx} className="text-sm text-gray-600 line-clamp-2">
                      {getCourseDisplayName(course)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-gray-500">课程设置以学校官网最新信息为准</p>
          </div>
        )}
      </Card>

      {/* 模块5：就业方向 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">就业方向</h2>
        
        <div className="flex flex-wrap gap-2">
          {careers.map((item, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-medium border border-green-200"
            >
              {item}
            </span>
          ))}
        </div>
      </Card>

      {/* 模块6：AI服务入口 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI留学服务</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`/ai/school-match?school=${encodeURIComponent(program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}&region=${encodeURIComponent(region)}`}
            className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
            <div className="font-medium text-blue-700">AI评估录取率</div>
            <div className="text-xs text-blue-500">智能匹配院校</div>
          </Link>
          
          <Link
            href={`/ai/interview?school=${encodeURIComponent(program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}`}
            className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🤖</div>
            <div className="font-medium text-green-700">AI面试官</div>
            <div className="text-xs text-green-500">模拟面试练习</div>
          </Link>
          
          <Link
            href="/ai/resume"
            className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
            <div className="font-medium text-amber-700">AI简历优化</div>
            <div className="text-xs text-amber-500">提升简历质量</div>
          </Link>
          
          <Link
            href={`/ai/school-match?school=${encodeURIComponent(program.school_name || '')}&program=${encodeURIComponent(program.major_cn || program.major_en || '')}&region=${encodeURIComponent(region)}`}
            className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💡</div>
            <div className="font-medium text-purple-700">AI选校助手</div>
            <div className="text-xs text-purple-500">智能推荐方案</div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
