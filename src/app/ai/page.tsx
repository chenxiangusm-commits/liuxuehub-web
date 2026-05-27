'use client';

const onlineTools = [
  {
    id: "resume",
    title: "AI留学申请简历",
    description: "填写信息或上传基础简历，生成适合海外院校申请的英文CV",
    icon: "📄",
    features: ["中英双语输出", "申请定位分析", "专业CV模板"],
    href: "/ai/resume",
    size: "large" as const,
  },
];

const onlineToolsRow2 = [
  {
    id: "ps",
    title: "AI个人陈述PS",
    description: "生成个性化、有说服力的 Personal Statement 完整英文成稿",
    icon: "✍️",
    features: ["完整英文成稿", "故事线设计", "结构优化"],
    href: "/ai/ps",
  },
  {
    id: "recommendation",
    title: "AI推荐信",
    description: "生成正式英文推荐信参考草稿，供推荐人审阅确认",
    icon: "📝",
    features: ["推荐信参考草稿", "推荐人视角", "可编辑下载"],
    href: "/ai/recommendation-letter",
  },
  {
    id: "motivation",
    title: "AI动机信",
    description: "针对目标院校和专业生成 Motivation Letter 成稿",
    icon: "💌",
    features: ["院校专业定制", "完整英文成稿", "个性化内容"],
    href: "/ai/motivation-letter",
  },
  {
    id: "essay",
    title: "AI Essay/小文书",
    description: "根据学校题目生成 Essay 成稿和思路",
    icon: "📚",
    features: ["题目解析", "完整成稿", "思路拓展"],
    href: "/ai/essay",
  },
];

const comingSoonTools = [
  {
    id: "interview",
    title: "AI留学面试官",
    description: "港校、新加坡、英国院校申请面试模拟",
    icon: "🎙️",
    features: ["真实模拟", "即时反馈", "评分报告"],
    href: "/ai/interview",
  },
  {
    id: "review",
    title: "AI申请材料检查器",
    description: "检查 CV、PS、推荐信、Essay 是否一致，发现材料短板",
    icon: "🔍",
    features: ["完整性检查", "格式规范", "优化建议"],
    href: null,
  },
];

export default function AIPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          AI留学文书中心
          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">Beta</span>
        </h1>
        <p className="text-gray-600">
          生成适合海外院校申请的 CV、个人陈述、推荐信参考草稿、动机信和 Essay
        </p>
      </div>

      {/* 已上线工具 - 第一行大卡片 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          已上线工具
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {onlineTools.map((tool) => (
            <a
              key={tool.id}
              href={tool.href}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <span className="text-4xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg group-hover:bg-blue-700 transition-colors">
                    立即生成
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 已上线工具 - 第二行卡片 */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onlineToolsRow2.map((tool) => (
            <a
              key={tool.id}
              href={tool.href}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg group-hover:bg-blue-700 transition-colors">
                    立即生成
                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 即将上线工具 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          即将上线工具
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comingSoonTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-50 rounded-xl border border-gray-200 p-5 opacity-75"
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-700">{tool.title}</h3>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      即将上线
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-white text-gray-500 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  {tool.href ? (
                    <button
                      disabled
                      className="mt-3 px-3 py-1.5 bg-gray-300 text-gray-500 text-xs font-medium rounded-lg cursor-not-allowed"
                    >
                      即将上线
                    </button>
                  ) : (
                    <button
                      disabled
                      className="mt-3 px-3 py-1.5 bg-gray-300 text-gray-500 text-xs font-medium rounded-lg cursor-not-allowed"
                    >
                      即将上线
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="mt-10 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">ℹ️</span>
          </div>
          <div>
            <h3 className="font-semibold text-orange-800 mb-1">Beta 说明</h3>
            <p className="text-orange-700 text-sm">
              当前为 AI 留学申请材料生成 Beta，内容供申请材料准备参考，提交前请自行核对真实性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
