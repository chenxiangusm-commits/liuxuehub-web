'use client';

interface UpgradePromptProps {
  trialUsed?: boolean;
  onUpgrade: () => void;
}

export default function UpgradePrompt({ trialUsed = false, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-8">
          <h3 className="text-lg font-bold mb-2">
            {trialUsed ? '免费试用已用完' : '解锁完整AI定校报告'}
          </h3>
          <p className="text-red-100 text-sm mb-3">
            {trialUsed
              ? '升级会员，解锁完整冲稳保院校清单、详细匹配理由和申请建议'
              : '免费试用仅展示部分结果，升级会员查看完整报告'
            }
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              完整冲稳保院校清单
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              详细匹配理由
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              录取风险分析
            </div>
            <div className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              材料优化建议
            </div>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="px-6 py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors whitespace-nowrap"
        >
          升级会员解锁完整报告
        </button>
      </div>
    </div>
  );
}
