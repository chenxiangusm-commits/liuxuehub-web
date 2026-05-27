'use client';

import { useState } from 'react';
import MembershipGateModal from './MembershipGateModal';
import MatchResultTabs from './MatchResultTabs';
import AiAdvisorCommentary from './AiAdvisorCommentary';
import UpgradePrompt from './UpgradePrompt';
import { generateSchoolMatch, SchoolMatchInput, SchoolMatchResult } from '@/lib/schoolMatch';

// 会员状态类型
type MembershipStatus = 'guest' | 'free' | 'trial_used' | 'member';

interface UserState {
  membershipStatus: MembershipStatus;
  trialRemaining: number;
  isLoggedIn: boolean;
}

// 模拟用户状态 - 后续接真实登录系统
const mockUserState: UserState = {
  membershipStatus: 'free',
  trialRemaining: 1,
  isLoggedIn: false,
};

export default function SchoolMatchClient() {
  const [userState, setUserState] = useState<UserState>(mockUserState);
  const [showGateModal, setShowGateModal] = useState(false);
  const [gateModalType, setGateModalType] = useState<'login' | 'upgrade' | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SchoolMatchResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 表单数据
  const [formData, setFormData] = useState({
    stage: '硕士',
    countries: ['英国'],
    schoolTier: '',
    schoolName: '',
    major: '',
    gpa: '',
    gpaType: '百分制' as '百分制' | '4.0制' | '英国学位等级',
    languageType: '雅思' as '雅思' | '托福' | 'PTE' | '暂未考',
    languageScore: '',
    standardizedScore: '',
    targetDirections: [] as string[],
    preference: [] as string[],
  });

  // 选项数据
  const countries = ['英国', '澳大利亚', '新加坡', '中国香港/澳门', '新西兰', '爱尔兰', '马来西亚'];
  
  // 硕士申请的本科背景选项
  const schoolTiers = [
    { value: '985', label: '985' },
    { value: '211', label: '211' },
    { value: '双一流', label: '双一流' },
    { value: '海外本科', label: '海外本科' },
    { value: '普通一本', label: '普通一本' },
    { value: '普通二本', label: '普通二本' },
    { value: '独立学院/民办', label: '独立学院/民办' },
    { value: '专科/其他', label: '专科/其他' },
  ];
  
  // 本科申请的高中课程体系选项
  const highSchoolSystems = [
    { value: '普高', label: '普高' },
    { value: 'A-Level', label: 'A-Level' },
    { value: 'IB', label: 'IB' },
    { value: 'AP', label: 'AP' },
    { value: 'SAT/ACT', label: 'SAT/ACT' },
    { value: 'OSSD', label: 'OSSD' },
    { value: 'HKDSE', label: 'HKDSE' },
    { value: '国际学校', label: '国际学校' },
    { value: '其他', label: '其他' },
  ];
  
  const majorDirections = [
    '商科', '金融', '会计', '管理', '商业分析', '计算机', 'AI', '数据科学',
    '传媒', '教育', '法律', '工程', '建筑', '心理学', '公共政策', '国际关系', '艺术设计',
  ];
  const preferences = [
    { value: 'ranking', label: '更看重排名' },
    { value: 'employment', label: '更看重就业' },
    { value: 'success_rate', label: '更看重成功率' },
    { value: 'cost', label: '更看重费用' },
    { value: 'dream_school', label: '想冲名校' },
    { value: 'safe_option', label: '想稳妥拿offer' },
  ];

  const handleCountryChange = (country: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, countries: [...formData.countries, country] });
    } else {
      setFormData({ ...formData, countries: formData.countries.filter(c => c !== country) });
    }
  };

  const handleDirectionToggle = (direction: string) => {
    if (formData.targetDirections.includes(direction)) {
      setFormData({ ...formData, targetDirections: formData.targetDirections.filter(d => d !== direction) });
    } else {
      setFormData({ ...formData, targetDirections: [...formData.targetDirections, direction] });
    }
  };

  const handlePreferenceToggle = (pref: string) => {
    if (formData.preference.includes(pref)) {
      setFormData({ ...formData, preference: formData.preference.filter(p => p !== pref) });
    } else {
      setFormData({ ...formData, preference: [...formData.preference, pref] });
    }
  };

  const handleStartMatching = () => {
    // 检查会员状态
    if (userState.membershipStatus === 'guest') {
      setGateModalType('login');
      setShowGateModal(true);
      return;
    }

    if (userState.membershipStatus === 'trial_used') {
      setGateModalType('upgrade');
      setShowGateModal(true);
      return;
    }

    // free 状态且有试用次数，或 member 状态，直接生成
    generateResult();
  };

  const generateResult = () => {
    setIsGenerating(true);
    setShowGateModal(false);

    // 构造输入
    const input: SchoolMatchInput = {
      stage: formData.stage,
      countries: formData.countries,
      schoolTier: formData.schoolTier,
      schoolName: formData.schoolName,
      major: formData.major,
      gpa: formData.gpa,
      gpaType: formData.gpaType,
      languageType: formData.languageType === '暂未考' ? null : formData.languageType,
      languageScore: formData.languageScore || undefined,
      targetDirections: formData.targetDirections,
      preference: formData.preference,
    };

    // 模拟生成延迟
    setTimeout(() => {
      const matchResult = generateSchoolMatch(input);
      setResult(matchResult);
      setShowResult(true);

      // 更新试用次数
      if (userState.membershipStatus === 'free' && userState.trialRemaining > 0) {
        setUserState({
          ...userState,
          trialRemaining: 0,
          membershipStatus: 'trial_used',
        });
      }

      setIsGenerating(false);
    }, 2000);
  };

  const handleLogin = () => {
    // 模拟登录
    setUserState({
      ...userState,
      isLoggedIn: true,
      membershipStatus: 'free',
      trialRemaining: 1,
    });
    setShowGateModal(false);
  };

  const handleUpgrade = () => {
    // 模拟升级会员
    setUserState({
      ...userState,
      membershipStatus: 'member',
    });
    setShowGateModal(false);
    generateResult();
  };

  const getMembershipDisplay = () => {
    if (userState.membershipStatus === 'guest') {
      return { text: '游客', subtext: '登录后可试用1次', color: 'gray' };
    }
    if (userState.membershipStatus === 'free') {
      return {
        text: `剩余 ${userState.trialRemaining} 次试用`,
        subtext: '免费用户',
        color: userState.trialRemaining > 0 ? 'green' : 'red',
      };
    }
    if (userState.membershipStatus === 'trial_used') {
      return { text: '试用已用完', subtext: '升级会员解锁', color: 'red' };
    }
    return { text: '会员可用', subtext: '无限次使用', color: 'blue' };
  };

  const membershipDisplay = getMembershipDisplay();

  if (showResult && result) {
    const isLimited = userState.membershipStatus !== 'member';

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 结果头部 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI定校报告</h1>
              <p className="text-gray-600 mt-1">
                根据你的背景，建议采用：冲刺 {result.summary.reachPercent}% / 稳妥 {result.summary.matchPercent}% / 保底 {result.summary.safetyPercent}%
              </p>
            </div>
            <button
              onClick={() => { setShowResult(false); setResult(null); }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              重新填写
            </button>
          </div>

          {/* 核心评分 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-blue-600">{result.coreScores.comprehensiveScore}</div>
              <div className="text-sm text-gray-600">综合竞争力</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-red-600">{result.coreScores.rankingPotential}</div>
              <div className="text-sm text-gray-600">排名冲刺空间</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-green-600">{result.coreScores.admissionStability}</div>
              <div className="text-sm text-gray-600">录取稳定度</div>
            </div>
          </div>
        </div>

        {/* 结果Tab */}
        <MatchResultTabs
          reachSchools={isLimited ? result.reachSchools.slice(0, 2) : result.reachSchools}
          matchSchools={isLimited ? result.matchSchools.slice(0, 2) : result.matchSchools}
          safetySchools={isLimited ? result.safetySchools.slice(0, 2) : result.safetySchools}
        />

        {/* AI点评 */}
        <AiAdvisorCommentary
          commentary={result.aiCommentary}
          isLimited={isLimited}
        />

        {/* 会员转化 */}
        {isLimited && (
          <UpgradePrompt
            trialUsed={userState.membershipStatus === 'trial_used'}
            onUpgrade={handleUpgrade}
          />
        )}

        {userState.membershipStatus === 'member' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm text-center">
              会员用户可以看到完整报告内容，无展示限制
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AI智能定校</h1>
            <p className="text-gray-600">
              基于院校库、QS排名、专业方向、GPA与语言成绩，生成冲刺 / 稳妥 / 保底选校方案
            </p>
          </div>
          {/* 会员状态 */}
          <div className={`px-4 py-2 rounded-lg border ${
            membershipDisplay.color === 'green' ? 'bg-green-50 border-green-200' :
            membershipDisplay.color === 'red' ? 'bg-red-50 border-red-200' :
            membershipDisplay.color === 'blue' ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-sm font-medium ${
              membershipDisplay.color === 'green' ? 'text-green-700' :
              membershipDisplay.color === 'red' ? 'text-red-700' :
              membershipDisplay.color === 'blue' ? 'text-blue-700' :
              'text-gray-700'
            }`}>
              {membershipDisplay.text}
            </div>
            <div className="text-xs text-gray-500">{membershipDisplay.subtext}</div>
          </div>
        </div>
      </div>

      {/* 主内容区 - 左右布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧 - 表单区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* 步骤指示器 */}
            <div className="flex items-center mb-6">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>1</div>
                <span className="ml-2 text-sm">基本信息</span>
              </div>
              <div className="flex-1 h-px bg-gray-200 mx-4"></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>2</div>
                <span className="ml-2 text-sm">背景与成绩</span>
              </div>
              <div className="flex-1 h-px bg-gray-200 mx-4"></div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>3</div>
                <span className="ml-2 text-sm">目标偏好</span>
              </div>
            </div>

            {/* 步骤1：基本信息 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* 申请阶段 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">申请阶段</label>
                  <div className="flex gap-4">
                    {['硕士', '本科'].map(stage => (
                      <label key={stage} className="flex items-center">
                        <input
                          type="radio"
                          name="stage"
                          value={stage}
                          checked={formData.stage === stage}
                          onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 目标国家/地区 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标国家/地区</label>
                  <div className="flex flex-wrap gap-2">
                    {countries.map(country => (
                      <label key={country} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        formData.countries.includes(country)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.countries.includes(country)}
                          onChange={(e) => handleCountryChange(country, e.target.checked)}
                          className="sr-only"
                        />
                        {country}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 学校背景 - 根据申请阶段动态显示 */}
                {formData.stage === '硕士' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">本科学校背景</label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {schoolTiers.map(tier => (
                        <button
                          key={tier.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, schoolTier: tier.value })}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            formData.schoolTier === tier.value
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="或输入学校名称，如：深圳大学"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">高中/课程体系背景</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {highSchoolSystems.map(system => (
                        <button
                          key={system.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, schoolTier: system.value })}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            formData.schoolTier === system.value
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {system.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      placeholder="如：深圳中学 / 国际学校 / A-Level / IB / AP"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {/* 专业 - 根据申请阶段动态显示标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.stage === '硕士' ? '本科专业' : '目标专业方向'}
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder={
                      formData.stage === '硕士' 
                        ? '如：金融、计算机、经济、传媒' 
                        : '如：商科、工程、计算机、传媒'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步骤2：背景与成绩 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* GPA / 高中成绩 - 根据申请阶段动态显示 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.stage === '硕士' ? 'GPA' : '高中成绩 / GPA'}
                  </label>
                  {formData.stage === '硕士' ? (
                    <>
                      <div className="flex gap-2 mb-2">
                        {(['百分制', '4.0制', '英国学位等级'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, gpaType: type })}
                            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                              formData.gpaType === type
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={formData.gpa}
                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                        placeholder={
                          formData.gpaType === '百分制' ? '如：85' :
                          formData.gpaType === '4.0制' ? '如：3.5' : '如：Upper Second Class'
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      placeholder="如：高考600分 / GPA 3.8 / A-Level A*A*A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* 语言成绩 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">语言成绩（可选）</label>
                  <div className="flex gap-2 mb-2">
                    {(['雅思', '托福', 'PTE', '暂未考'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, languageType: type })}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                          formData.languageType === type
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {formData.languageType !== '暂未考' && (
                    <input
                      type="text"
                      value={formData.languageScore}
                      onChange={(e) => setFormData({ ...formData, languageScore: e.target.value })}
                      placeholder={`如：${formData.languageType === '雅思' ? '7.0' : formData.languageType === '托福' ? '100' : '68'}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* 标化成绩 - 仅本科申请显示 */}
                {formData.stage === '本科' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">标化成绩（可选）</label>
                    <input
                      type="text"
                      value={formData.standardizedScore}
                      onChange={(e) => setFormData({ ...formData, standardizedScore: e.target.value })}
                      placeholder="如：SAT 1450 / ACT 32 / A-Level A*A*A / IB 38"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步骤3：目标偏好 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* 目标专业方向 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标专业方向</label>
                  <div className="flex flex-wrap gap-2">
                    {majorDirections.map(direction => (
                      <label key={direction} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        formData.targetDirections.includes(direction)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.targetDirections.includes(direction)}
                          onChange={() => handleDirectionToggle(direction)}
                          className="sr-only"
                        />
                        {direction}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 偏好 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选校偏好（可多选）</label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.map(pref => (
                      <label key={pref.value} className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        formData.preference.includes(pref.value)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                        <input
                          type="checkbox"
                          checked={formData.preference.includes(pref.value)}
                          onChange={() => handlePreferenceToggle(pref.value)}
                          className="sr-only"
                        />
                        {pref.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleStartMatching}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        生成中...
                      </>
                    ) : (
                      '开始智能定校'
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  免费用户可试用 1 次，会员可解锁完整报告与多次方案调整
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧 - 说明区域 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-3">智能定校说明</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                填写你的背景信息和目标
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                AI 根据院校数据库匹配选校方案
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">3.</span>
                获得冲刺/稳妥/保底院校推荐
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">4.</span>
                查看 AI 顾问个性化点评
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">推荐参考因素</h4>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• QS 世界大学排名</li>
                <li>• 专业排名与课程设置</li>
                <li>• 录取难度与竞争程度</li>
                <li>• 就业率与职业发展</li>
                <li>• 学费与生活成本</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-700">
                <strong>提示：</strong>选校结果仅供参考，最终录取结果取决于多种因素。建议结合自身情况合理规划。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 会员拦截弹窗 */}
      {showGateModal && (
        <MembershipGateModal
          type={gateModalType!}
          onLogin={handleLogin}
          onUpgrade={handleUpgrade}
          onClose={() => setShowGateModal(false)}
        />
      )}
    </div>
  );
}
