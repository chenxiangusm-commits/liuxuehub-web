'use client';

interface AiAdvisorCommentaryProps {
  commentary: {
    strengths: string[];
    weaknesses: string[];
    strategy: string;
    nextSteps: string[];
  };
  isLimited?: boolean;
}

export default function AiAdvisorCommentary({ commentary, isLimited = false }: AiAdvisorCommentaryProps) {
  const displayedStrengths = isLimited ? commentary.strengths.slice(0, 2) : commentary.strengths;
  const displayedWeaknesses = isLimited ? commentary.weaknesses.slice(0, 1) : commentary.weaknesses;
  const displayedNextSteps = isLimited ? commentary.nextSteps.slice(0, 2) : commentary.nextSteps;

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI 顾问点评</h3>
            <p className="text-xs text-gray-500">基于你的背景信息生成的个性化建议</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 优势 */}
          <div>
            <h4 className="flex items-center text-sm font-medium text-green-700 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              你的优势
            </h4>
            <ul className="space-y-2">
              {displayedStrengths.map((strength, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  {strength}
                </li>
              ))}
            </ul>
            {isLimited && commentary.strengths.length > 2 && (
              <p className="text-xs text-blue-600 mt-2">会员可查看全部 {commentary.strengths.length} 项优势分析</p>
            )}
          </div>

          {/* 短板 */}
          <div>
            <h4 className="flex items-center text-sm font-medium text-red-700 mb-3">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              你的短板
            </h4>
            <ul className="space-y-2">
              {displayedWeaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  {weakness}
                </li>
              ))}
            </ul>
            {isLimited && commentary.weaknesses.length > 1 && (
              <p className="text-xs text-blue-600 mt-2">会员可查看全部 {commentary.weaknesses.length} 项短板分析</p>
            )}
          </div>
        </div>

        {/* 选校策略 */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="flex items-center text-sm font-medium text-blue-700 mb-3">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            选校策略
          </h4>
          <p className="text-gray-700">{commentary.strategy}</p>
        </div>

        {/* 下一步行动 */}
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h4 className="flex items-center text-sm font-medium text-purple-700 mb-3">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            下一步行动建议
          </h4>
          <ul className="space-y-2">
            {displayedNextSteps.map((step, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
          {isLimited && commentary.nextSteps.length > 2 && (
            <p className="text-xs text-blue-600 mt-2">会员可查看全部 {commentary.nextSteps.length} 项行动建议</p>
          )}
        </div>
      </div>
    </div>
  );
}
