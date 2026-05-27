"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InterviewPage() {
  const [time, setTime] = useState(42);
  const [waveHeight, setWaveHeight] = useState([30, 60, 40, 80, 50, 70, 45]);
  const [currentQuestionIndex] = useState(1);
  const [totalQuestions] = useState(5);
  const [remainingTime, setRemainingTime] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const waveTimer = setInterval(() => {
      setWaveHeight(prev => prev.map(() => Math.floor(Math.random() * 60) + 20));
    }, 150);
    return () => clearInterval(waveTimer);
  }, []);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = [
    "Why do you want to study at The University of Hong Kong?",
    "Tell me about your academic background and why you chose this program.",
    "Describe a challenge you've faced and how you overcame it.",
    "What are your career goals after completing this program?",
    "How would you contribute to our university community?",
  ];

  const analysisItems = [
    {
      label: '语言流畅度',
      score: 92,
      color: 'blue',
      advice: '表达流畅自然，建议保持语速稳定。',
    },
    {
      label: '自信程度',
      score: 84,
      color: 'green',
      advice: '整体自信度良好，可适当增加手势表达。',
    },
    {
      label: '眼神交流',
      score: 78,
      color: 'amber',
      advice: '适当增加镜头注视，提高交流感。',
    },
    {
      label: '语法准确性',
      score: 89,
      color: 'purple',
      advice: '语法使用准确，注意复杂句的结构。',
    },
    {
      label: '沟通能力',
      score: 91,
      color: 'cyan',
      advice: '表达清晰有力，逻辑结构完整。',
    },
  ];

  const scoreSamples = [
    { label: '内容评分', value: 88 },
    { label: '自信度', value: 84 },
    { label: '流畅度', value: 90 },
  ];

  const colorClasses: Record<string, { bg: string; text: string; progress: string; glow: string }> = {
    blue: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      progress: 'bg-gradient-to-r from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/25',
    },
    green: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      progress: 'bg-gradient-to-r from-green-500 to-green-600',
      glow: 'shadow-green-500/25',
    },
    amber: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      progress: 'bg-gradient-to-r from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/25',
    },
    purple: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      progress: 'bg-gradient-to-r from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/25',
    },
    cyan: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-400',
      progress: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      glow: 'shadow-cyan-500/25',
    },
  };

  void totalQuestions;
  void remainingTime;
  void formatRemainingTime;
  void analysisItems;
  void colorClasses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950">
      {/* 顶部导航 */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">留</span>
              </div>
              <span className="text-xl font-bold text-white">留学Hub | 九万里AI</span>
            </Link>
            
            {/* 体验版标签 */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-full">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-blue-300">体验版 Preview</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 页面标题 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            AI招生官模拟面试
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            基于真实硕士项目题库 + AI实时评分 + 招生官分析
          </p>
        </div>

        {/* 主内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 左侧：摄像头模拟区域 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* 顶部状态栏 */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/30">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                  <span className="text-sm font-medium text-red-400">Recording</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* 麦克风状态 */}
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm0 14a5 5 0 00-5 5H4a1 1 0 001 1h14a1 1 0 001-1h-3a5 5 0 00-5-5z" />
                  </svg>
                  {/* 音频波纹 */}
                  <div className="flex items-end space-x-0.5 h-4">
                    {waveHeight.map((height, i) => (
                      <div
                        key={i}
                        className="w-1 bg-green-400 rounded-full transition-all duration-150"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-mono text-white">{formatTime(time)}</div>
              </div>
            </div>

            {/* 视频区域 */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              {/* 左上角信息 - 项目名称 */}
              <div className="absolute top-4 left-4">
                <div className="bg-black/60 backdrop-blur rounded-xl p-3 border border-white/10">
                  <p className="text-white font-medium text-sm">香港大学 MSc in Finance</p>
                </div>
              </div>
              
              {/* 右上角信息 - 题号和剩余时间 */}
              <div className="absolute top-4 right-4">
                <div className="bg-black/60 backdrop-blur rounded-xl p-3 border border-white/10 space-y-2">
                  <p className="text-white text-sm">
                    <span className="text-gray-400">问题 </span>
                    <span className="font-bold text-blue-400">3/8</span>
                  </p>
                  <p className="text-white text-sm">
                    <span className="text-gray-400">预计剩余：</span>
                    <span className="font-bold text-green-400">5分钟</span>
                  </p>
                </div>
              </div>

              {/* 用户头像占位 */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {/* Recording红点 */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></div>
              </div>

              {/* 底部实时识别状态 */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur rounded-xl p-4 border border-white/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🎤</span>
                      <div>
                        <p className="text-white text-sm font-medium">正在识别语音</p>
                        <p className="text-xs text-gray-400">实时转录中...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">👀</span>
                      <div>
                        <p className="text-white text-sm font-medium">眼神接触正常</p>
                        <p className="text-xs text-green-400">良好</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">😊</span>
                      <div>
                        <p className="text-white text-sm font-medium">表情识别正常</p>
                        <p className="text-xs text-green-400">自信状态</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📈</span>
                      <div>
                        <p className="text-white text-sm font-medium">回答逻辑稳定</p>
                        <p className="text-xs text-green-400">结构清晰</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：AI面试问题区域 */}
          <div className="space-y-4">
            {/* AI面试问题卡片 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-white">AI 招生官问题</h2>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">实时评分中</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-5 mb-4 border border-white/5">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-medium">
                    问题 {currentQuestionIndex}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded">
                    建议时长 3分钟
                  </span>
                </div>
                <p className="text-white font-medium text-lg leading-relaxed">
                  &quot;{questions[currentQuestionIndex - 1]}&quot;
                </p>
              </div>

              {/* 回答建议 */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-3">回答要点</p>
                <div className="grid grid-cols-2 gap-2">
                  {['结合个人经历', '突出学术兴趣', '展示职业规划', '使用具体案例'].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 评分样例 */}
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-400">实时评分</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">AI分析中</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {scoreSamples.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI分析报告区域 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">AI招生官评估报告</h2>
          </div>

          {/* 录取预测卡片 */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur rounded-xl p-6 mb-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300 mb-1">录取预测</p>
                <p className="text-5xl font-bold text-green-400">72%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-2">基于同批次申请者数据</p>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-green-400">综合评估中</span>
                </div>
              </div>
            </div>
          </div>

          {/* 评分维度 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 表达流畅度 */}
            <div className="bg-black/30 backdrop-blur rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-gray-300 text-sm">表达流畅度</span>
                <span className="text-blue-400 text-xs bg-blue-500/20 px-2 py-0.5 rounded">高于78%申请者</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">92</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* 自信程度 */}
            <div className="bg-black/30 backdrop-blur rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-gray-300 text-sm">自信程度</span>
                <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded">语速略快</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">84</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            {/* 逻辑结构 */}
            <div className="bg-black/30 backdrop-blur rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-gray-300 text-sm">逻辑结构</span>
                <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded">案例支撑不足</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">88</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            {/* 眼神交流 */}
            <div className="bg-black/30 backdrop-blur rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-gray-300 text-sm">眼神交流</span>
                <span className="text-red-400 text-xs bg-red-500/20 px-2 py-0.5 rounded">存在低头现象</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2">78</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          {/* 招生官评价 */}
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">招生官评价</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-300">你的表达自然，</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-300">职业目标明确，</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-300">但缺少学校课程与经历之间的关联。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 面试技巧提示 */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">面试小贴士</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                在真实面试中，建议您保持自然的姿态和表情，注意语速适中，眼神保持与镜头接触。回答问题时尽量结合具体案例，展示您的学术热情和职业规划。AI评分系统会从语言流畅度、自信程度、眼神交流等多个维度进行实时评估。
              </p>
            </div>
          </div>
        </div>

        {/* 底部转化区 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8">
          {/* 主按钮 */}
          <div className="mb-4">
            <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all text-lg">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>立即模拟完整面试</span>
              </span>
            </button>
          </div>

          {/* 次按钮组 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="px-4 py-3 bg-white/5 backdrop-blur border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all text-sm">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>查看完整分析报告</span>
              </span>
            </button>
            <button className="px-4 py-3 bg-white/5 backdrop-blur border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all text-sm">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>生成个性化回答</span>
              </span>
            </button>
            <button className="px-4 py-3 bg-white/5 backdrop-blur border border-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all text-sm">
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>继续下一题</span>
              </span>
            </button>
          </div>
        </div>

        {/* 留学转化提示 */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-green-300">面试表现优秀可获得留学顾问1对1咨询机会</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
