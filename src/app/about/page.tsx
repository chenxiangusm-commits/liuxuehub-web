import Link from "next/link";

export const metadata = {
  title: "关于九万里AI - 留学Hub",
  description: "了解九万里AI的使命和技术能力",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">关于九万里AI</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          九万里AI致力于利用人工智能和数据技术重构全球留学申请流程
        </p>
      </div>

      {/* 公司介绍 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">公司使命</h2>
        <p className="text-blue-100 leading-relaxed mb-6">
          九万里AI致力于利用人工智能和数据技术重构全球留学申请流程。通过全球院校数据库、录取趋势分析、AI文书生成和AI面试训练能力，帮助学生更高效完成申请决策。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-blue-200 text-sm">全球院校</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <div className="text-3xl font-bold mb-2">30000+</div>
            <div className="text-blue-200 text-sm">专业项目</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <div className="text-3xl font-bold mb-2">100000+</div>
            <div className="text-blue-200 text-sm">AI分析次数</div>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-xl">
            <div className="text-3xl font-bold mb-2">50000+</div>
            <div className="text-blue-200 text-sm">模拟面试训练</div>
          </div>
        </div>
      </div>

      {/* 核心能力 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">核心能力</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">AI申请决策引擎</h3>
            <p className="text-gray-600 text-sm">
              基于大数据分析和机器学习算法，为学生提供精准的冲刺/匹配/保底方案
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">全球院校数据库</h3>
            <p className="text-gray-600 text-sm">
              覆盖QS1000+院校，包含本科、硕士专业信息，实时更新招生要求
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">AI面试训练系统</h3>
            <p className="text-gray-600 text-sm">
              智能提问、实时评分、专业反馈，帮助学生提升面试表现
            </p>
          </div>
        </div>
      </div>

      {/* AI文书生成 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI文书生成能力</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">CV 简历</h3>
              <p className="text-sm text-gray-500">专业简历优化与生成</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">PS 个人陈述</h3>
              <p className="text-sm text-gray-500">个性化陈述撰写</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">推荐信</h3>
              <p className="text-sm text-gray-500">专业推荐信模板</p>
            </div>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">联系我们</h2>
        <p className="text-gray-600 mb-6">
          欢迎任何关于留学申请、合作洽谈的咨询
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <div className="px-6 py-3 bg-white rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">邮箱</div>
            <div className="font-medium text-gray-800">contact@liuxuehub.cn</div>
          </div>
          <div className="px-6 py-3 bg-white rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">网站</div>
            <div className="font-medium text-gray-800">www.liuxuehub.cn</div>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
