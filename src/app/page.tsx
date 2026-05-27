import { getAllSchools } from "@/lib/data.server";
import HomeClient from "./HomeClient";
import { siteStats } from "@/config/siteStats";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const schools = await getAllSchools();

  return (
    <main>
      {/* Hero - 左右布局 */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
            {/* 左侧：文案区域 */}
            <div className="space-y-8">
              {/* 标题 */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  AI让留学申请
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    从经验判断变成数据决策
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
                  全球院校数据库 + AI智能选校 + AI文书 + AI面试训练
                </p>
              </div>

              {/* 按钮 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/ai/interview"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  立即体验 AI 面试官
                  <span className="ml-2 px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-sm font-semibold">Beta</span>
                </a>
                <a
                  href="/ai/school-match"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 hover:border-white/40 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  免费智能选校
                </a>
                <a
                  href="/ai/study-plan"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  AI留学规划书
                </a>
              </div>

              {/* AI规划书说明 */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  国家规划
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  学校梯度
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  专业路线
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  时间规划
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  背景提升
                </span>
              </div>

              {/* 数据能力 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {siteStats.schools.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">全球院校</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {siteStats.programs.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">专业项目</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {siteStats.aiAnalysis.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">AI分析</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {siteStats.interviews.toLocaleString()}+
                  </div>
                  <div className="text-sm text-gray-400">模拟面试</div>
                </div>
              </div>
            </div>

            {/* 右侧：产品预览区域 */}
            <div className="space-y-4">
              {/* AI面试官Mock界面 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
                {/* 浏览器标签栏 */}
                <div className="flex items-center gap-2 px-4 py-3 bg-black/30">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-3 text-xs text-gray-400">AI 留学面试官</span>
                </div>
                {/* 面试内容 */}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-300 mb-1">AI 面试官</div>
                      <div className="text-white">请介绍一下你为什么选择这个专业？</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm placeholder-white/50">
                      输入你的回答...
                    </div>
                    <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* AI评分报告卡片 */}
              <div className="grid grid-cols-2 gap-4">
                {/* IELTS评分 */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-xs text-gray-400">IELTS 预估</span>
                  </div>
                  <div className="text-2xl font-bold text-white">7.0</div>
                  <div className="text-xs text-green-400">达到目标</div>
                </div>

                {/* Communication Score */}
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs text-gray-400">沟通能力</span>
                  </div>
                  <div className="text-2xl font-bold text-white">85</div>
                  <div className="text-xs text-green-400">优秀</div>
                </div>
              </div>

              {/* 院校推荐 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">AI推荐院校</span>
                  <span className="text-xs text-blue-400">查看全部</span>
                </div>
                <div className="space-y-2">
                  {schools.slice(0, 3).map((school) => (
                    <div key={school.school_code} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        {school.school_code?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{school.school_name}</div>
                        {school.qs_ranking_2026 && (
                          <div className="text-xs text-red-400">QS {school.qs_ranking_2026}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeClient schools={schools} />
    </main>
  );
}
