"use client";

import Link from "next/link";
import { Program } from "@/types";
import Card from "@/components/ui/Card";

// 根据地区和QS排名判断是否显示AI分析模块
function isAIAnalysisEnabled(region: string, qsRanking: number): boolean {
  if (!qsRanking || qsRanking <= 0) return false;
  
  const regionLower = region.toLowerCase();
  
  if (regionLower.includes('香港')) {
    return qsRanking <= 100;
  }
  if (regionLower.includes('新加坡')) {
    return qsRanking <= 100;
  }
  if (regionLower.includes('英国')) {
    return qsRanking <= 100;
  }
  if (regionLower.includes('澳大利亚') || regionLower.includes('澳洲')) {
    return qsRanking <= 50;
  }
  
  return false;
}

// 判断专业类型
function getProgramType(program: Program): string {
  const majorEn = (program.major_en || '').toLowerCase();
  const majorCn = (program.major_cn || '').toLowerCase();
  const college = (program.college || '').toLowerCase();

  if (majorEn.includes('finance') || majorCn.includes('金融') || college.includes('finance')) {
    return 'finance';
  }
  if (majorEn.includes('accounting') || majorCn.includes('会计') || college.includes('accounting')) {
    return 'accounting';
  }
  if (majorEn.includes('computer') || majorEn.includes('ai') || majorEn.includes('machine learning') ||
      majorCn.includes('计算机') || majorCn.includes('人工智能') || college.includes('computer')) {
    return 'cs';
  }
  if (majorEn.includes('business analytics') || majorCn.includes('商业分析') || college.includes('analytics')) {
    return 'ba';
  }
  if (majorEn.includes('marketing') || majorCn.includes('市场营销') || college.includes('marketing')) {
    return 'marketing';
  }
  if (majorEn.includes('engineering') || majorCn.includes('工程') || college.includes('engineering')) {
    return 'engineering';
  }
  if (majorEn.includes('education') || majorCn.includes('教育') || college.includes('education')) {
    return 'education';
  }
  return 'other';
}

// 获取专业类型显示名称
function getProgramTypeName(programType: string): string {
  const typeNames: Record<string, string> = {
    finance: 'Finance',
    accounting: 'Finance',
    cs: 'Computer Science',
    ba: 'Business Analytics',
    marketing: 'Marketing',
    engineering: 'Engineering',
    education: 'Education',
    other: 'Other',
  };
  return typeNames[programType] || 'Other';
}

// 获取详细的申请画像（适合背景、加分项、风险项）
interface ProfileSection {
  title: string;
  icon: string;
  items: { label: string; value: string; type: 'suitable' | 'plus' | 'risk' }[];
}

function getDetailedProfile(programType: string): ProfileSection[] {
  const profiles: Record<string, ProfileSection[]> = {
    finance: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '985/211/海外本科优先，双非需高GPA', type: 'suitable' },
          { label: 'GPA要求', value: '985/211建议85+，双非建议88+', type: 'suitable' },
          { label: '专业背景', value: '金融、经济、会计、数学、统计、商科相关', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '实习经历', value: '投行、券商、基金、咨询、四大相关实习', type: 'plus' },
          { label: '语言成绩', value: '雅思7.0+/托福100+，GMAT 700+', type: 'plus' },
          { label: '证书资质', value: 'CFA、CPA、ACCA等证书', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '竞争激烈', value: '商科金融类竞争最激烈，录取率低', type: 'risk' },
          { label: '面试表现', value: '部分项目需面试，口语表达很重要', type: 'risk' },
        ]
      }
    ],
    cs: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '985/211/海外本科有优势', type: 'suitable' },
          { label: 'GPA要求', value: '985/211建议82+，双非建议85+', type: 'suitable' },
          { label: '专业背景', value: '计算机、软件工程、数学、统计学相关', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '编程能力', value: '熟练掌握Python、Java、C++等', type: 'plus' },
          { label: '项目经历', value: '有实际开发项目、GitHub开源项目', type: 'plus' },
          { label: '科研经历', value: '有顶会论文、科研项目经历', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '竞争激烈', value: 'CS/AI方向竞争激烈，偏好技术背景', type: 'risk' },
          { label: '前置课程', value: '缺乏编程和数学基础会被拒', type: 'risk' },
        ]
      }
    ],
    ba: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '985/211/海外本科优先', type: 'suitable' },
          { label: 'GPA要求', value: '985/211建议83+，双非建议86+', type: 'suitable' },
          { label: '专业背景', value: '金融、经济、数学、统计、商科、数据科学', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '数据能力', value: 'Python、SQL、R、Tableau等工具熟练', type: 'plus' },
          { label: '项目经历', value: '数据分析、商业分析相关项目', type: 'plus' },
          { label: '量化背景', value: '有数学建模、统计建模经验', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '竞争激烈', value: 'BA热度高，录取率较低', type: 'risk' },
          { label: '技术要求', value: '部分项目偏好理工科背景', type: 'risk' },
        ]
      }
    ],
    marketing: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '各类院校都有机会，竞争相对商科低', type: 'suitable' },
          { label: 'GPA要求', value: '建议80+，211/985有优势', type: 'suitable' },
          { label: '专业背景', value: '市场营销、商科、传播、广告、传媒相关', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '实习经历', value: '市场部、广告公司、咨询、电商运营', type: 'plus' },
          { label: '语言表达', value: '雅思7.0+，英文口语流利', type: 'plus' },
          { label: '创意作品', value: '有市场策划案例、广告作品集', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '科研权重', value: '科研经历对Marketing作用较小', type: 'risk' },
          { label: 'GPA要求', value: 'GPA中上即可，不需要特别高', type: 'risk' },
        ]
      }
    ],
    engineering: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '985/211/海外本科优势明显', type: 'suitable' },
          { label: 'GPA要求', value: '985/211建议80+，双非建议83+', type: 'suitable' },
          { label: '专业背景', value: '工程类相关专业本科', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '前置课程', value: '高等数学、物理、专业基础课', type: 'plus' },
          { label: '科研经历', value: '有科研项目、论文发表', type: 'plus' },
          { label: '项目经历', value: '有工程实践、项目经验', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '前置课程', value: '跨专业申请需补足基础课程', type: 'risk' },
          { label: '竞争程度', value: '工科竞争适中，热门方向较难', type: 'risk' },
        ]
      }
    ],
    education: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '各类师范院校、教育类本科优先', type: 'suitable' },
          { label: 'GPA要求', value: '建议78+，211/985有优势', type: 'suitable' },
          { label: '专业背景', value: '教育学、语言学、心理学、社会学', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '教学经历', value: '有教学、培训、家教、支教经历', type: 'plus' },
          { label: '语言成绩', value: '雅思6.5-7.0+，英文读写能力', type: 'plus' },
          { label: '相关经历', value: '教育机构实习、教研项目', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '竞争程度', value: '教育类整体竞争适中', type: 'risk' },
          { label: '科研要求', value: '部分研究型项目需要科研背景', type: 'risk' },
        ]
      }
    ],
    accounting: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '985/211/海外本科优先', type: 'suitable' },
          { label: 'GPA要求', value: '985/211建议83+，双非建议86+', type: 'suitable' },
          { label: '专业背景', value: '会计、金融、经济、管理相关', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '实习经历', value: '四大、财务部门、审计、税务实习', type: 'plus' },
          { label: '语言成绩', value: '雅思7.0+，ACCA通过门数', type: 'plus' },
          { label: '证书资质', value: 'ACCA、CPA证书', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '竞争激烈', value: '会计/金融竞争激烈', type: 'risk' },
          { label: '面试表现', value: '部分项目有面试环节', type: 'risk' },
        ]
      }
    ],
    other: [
      {
        title: '适合背景',
        icon: '🎓',
        items: [
          { label: '本科院校', value: '211/985/海外本科有优势', type: 'suitable' },
          { label: 'GPA要求', value: '建议80+，越高越好', type: 'suitable' },
          { label: '专业背景', value: '与申请专业相关的本科背景', type: 'suitable' },
        ]
      },
      {
        title: '加分项',
        icon: '✨',
        items: [
          { label: '项目经历', value: '有相关专业项目或作品', type: 'plus' },
          { label: '语言成绩', value: '雅思/托福达到项目要求', type: 'plus' },
          { label: '实习经历', value: '有相关行业实习经历', type: 'plus' },
        ]
      },
      {
        title: '风险项',
        icon: '⚠️',
        items: [
          { label: '跨专业', value: '跨专业申请需展示相关能力', type: 'risk' },
          { label: '竞争程度', value: '竞争程度视具体专业而定', type: 'risk' },
        ]
      }
    ],
  };
  
  return profiles[programType] || profiles.other;
}

// 计算录取概率
function calculateProbabilities(qsRanking: number, programType: string, region: string) {
  let baseProbability = 50;
  
  if (qsRanking <= 20) {
    baseProbability = 25 + Math.floor(Math.random() * 10);
  } else if (qsRanking <= 50) {
    baseProbability = 35 + Math.floor(Math.random() * 15);
  } else if (qsRanking <= 100) {
    baseProbability = 45 + Math.floor(Math.random() * 15);
  }
  
  const highCompetitionMajors = ['finance', 'accounting', 'cs', 'ba'];
  if (highCompetitionMajors.includes(programType)) {
    baseProbability -= 10;
  }
  
  const isAU = region.toLowerCase().includes('澳大利亚') || region.toLowerCase().includes('澳洲');
  if (isAU) {
    baseProbability += 10;
  }
  
  const safeProbability = Math.min(95, baseProbability + 30 + Math.floor(Math.random() * 10));
  const targetProbability = Math.min(85, baseProbability + 15 + Math.floor(Math.random() * 10));
  const reachProbability = Math.max(5, baseProbability + Math.floor(Math.random() * 10));
  
  return {
    reach: Math.round(reachProbability),
    target: Math.round(targetProbability),
    safe: Math.round(safeProbability),
  };
}

// 获取竞争难度
function getCompetitionLevel(qsRanking: number, programType: string, region: string): {
  level: string;
  color: string;
  index: number;
} {
  let baseIndex = 50;

  if (qsRanking <= 20) {
    baseIndex = 85 + Math.floor(Math.random() * 10);
  } else if (qsRanking <= 50) {
    baseIndex = 75 + Math.floor(Math.random() * 13);
  } else if (qsRanking <= 100) {
    baseIndex = 65 + Math.floor(Math.random() * 13);
  }

  const isHighCompetition = ['finance', 'accounting', 'cs', 'ba'].includes(programType);
  const isHKOrSG = region.includes('香港') || region.includes('新加坡');

  if (isHighCompetition) {
    baseIndex += 8;
  }
  if (isHKOrSG) {
    baseIndex += 5;
  }

  baseIndex = Math.min(baseIndex, 98);

  if (baseIndex < 65) {
    return { level: '🟢 较容易', color: 'text-green-600', index: baseIndex };
  } else if (baseIndex < 80) {
    return { level: '🟡 中等竞争', color: 'text-yellow-600', index: baseIndex };
  } else {
    return { level: '🔴 高竞争', color: 'text-red-600', index: baseIndex };
  }
}

interface AIAdmissionAnalysisProps {
  program: Program;
}

export default function AIAdmissionAnalysis({ program }: AIAdmissionAnalysisProps) {
  const region = program.region_cn || '';
  const qsRanking = program.qs_ranking_2026 || 0;
  
  if (!isAIAnalysisEnabled(region, qsRanking)) {
    return null;
  }

  const programType = getProgramType(program);
  const probabilities = calculateProbabilities(qsRanking, programType, region);
  const profileSections = getDetailedProfile(programType);
  const competition = getCompetitionLevel(qsRanking, programType, region);

  const schoolName = program.school_name || '';
  const programName = program.major_cn || program.major_en || '';
  
  let ctaUrl = `/ai/school-match?school=${encodeURIComponent(schoolName)}&program=${encodeURIComponent(programName)}`;
  if (region) {
    ctaUrl += `&region=${encodeURIComponent(region)}`;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'suitable': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'plus': return 'bg-green-50 text-green-700 border-green-100';
      case 'risk': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suitable': return '✓';
      case 'plus': return '+';
      case 'risk': return '!';
      default: return '•';
    }
  };

  return (
    <div className="space-y-5">
      {/* AI录取偏好分析 - 白色卡片 + 蓝色重点 */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
        {/* 浅蓝背景头部 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              AI
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI录取偏好分析</h2>
              <p className="text-xs text-gray-500 mt-0.5">{getProgramTypeName(programType)} · {schoolName}</p>
            </div>
          </div>
        </div>
        
        {/* 概率卡片区域 */}
        <div className="p-6">
          {/* 概率三卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* 冲刺概率 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-100">
              <div className="text-xs text-amber-600 font-medium mb-2">冲刺概率</div>
              <div className="text-2xl font-bold text-amber-600">{probabilities.reach}%</div>
            </div>
            {/* 匹配概率 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
              <div className="text-xs text-blue-600 font-medium mb-2">匹配概率</div>
              <div className="text-2xl font-bold text-blue-600">{probabilities.target}%</div>
            </div>
            {/* 稳妥概率 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-xs text-green-600 font-medium mb-2">稳妥概率</div>
              <div className="text-2xl font-bold text-green-600">{probabilities.safe}%</div>
            </div>
          </div>
          
          {/* 免责声明 */}
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            基于公开申请要求、院校层级、专业竞争度和中国学生常见申请背景生成，仅供参考，不代表真实录取结果。
          </p>
        </div>
      </div>

      {/* 申请画像 - 适合背景/加分项/风险项 */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📋</span>
          申请画像分析
        </h3>
        
        <div className="space-y-4">
          {profileSections.map((section, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{section.icon}</span>
                <h4 className="text-sm font-semibold text-gray-700">{section.title}</h4>
              </div>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-600">{item.label}：</span>
                      <span className="text-xs text-gray-500">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 竞争难度 */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-sm font-medium text-gray-700">竞争难度</div>
              <div className={`text-lg font-bold ${competition.color}`}>
                {competition.level}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">中国大陆申请竞争指数</div>
            <div className="text-xl font-bold text-gray-900">{competition.index}<span className="text-sm text-gray-400">/100</span></div>
          </div>
        </div>
        {/* 竞争指数进度条 */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              competition.index < 65 ? 'bg-green-500' :
              competition.index < 80 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${competition.index}%` }}
          ></div>
        </div>
      </Card>

      {/* CTA按钮 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={ctaUrl}
          className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="mr-2">🎯</span>
          AI评估我的录取概率
        </Link>
        <Link
          href={`/ai/interview?school=${encodeURIComponent(schoolName)}&program=${encodeURIComponent(programName)}`}
          className="flex-1 inline-flex items-center justify-center px-5 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="mr-2">🤖</span>
          AI面试官体验
        </Link>
      </div>
    </div>
  );
}
