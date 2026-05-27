import Link from "next/link";

type ProductType = "resume" | "ps" | "recommendation" | "motivation" | "essay";

const productCopy: Record<ProductType, { title: string; subtitle: string; focus: string[] }> = {
  resume: {
    title: "AI留学申请简历",
    subtitle: "面向海外院校申请的英文 CV 结构化生成工具",
    focus: ["申请定位分析", "项目匹配表达", "经历量化呈现"],
  },
  ps: {
    title: "AI个人陈述 PS",
    subtitle: "围绕学术动机、成长经历和目标专业生成 Personal Statement 参考草稿",
    focus: ["故事线设计", "学术潜力表达", "院校专业侧重"],
  },
  recommendation: {
    title: "AI推荐信",
    subtitle: "从推荐人视角组织学生能力证据，生成正式英文推荐信参考草稿",
    focus: ["推荐人视角", "可验证事例", "招生官阅读逻辑"],
  },
  motivation: {
    title: "AI动机信",
    subtitle: "针对目标院校、目标专业和职业规划生成 Motivation Letter 参考草稿",
    focus: ["院校匹配", "专业动机", "未来规划表达"],
  },
  essay: {
    title: "AI Essay/小文书",
    subtitle: "拆解学校题目意图，生成结构清晰、观点聚焦的小文书参考草稿",
    focus: ["题目解析", "观点提炼", "素材取舍"],
  },
};

interface AIProductIntroProps {
  product: ProductType;
}

export default function AIProductIntro({ product }: AIProductIntroProps) {
  const copy = productCopy[product];

  return (
    <div className="mb-6">
      <Link
        href="/ai"
        className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
      >
        <svg className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回 AI留学文书
      </Link>

      <section className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 mb-2">留学Hub 文书模型</p>
            <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
            <p className="mt-2 text-gray-600">{copy.subtitle}</p>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              基于全球 3000+ 院校与专业数据、招生官录取文书偏好观察，以及多年成功申请顾问经验沉淀，
              将不同国家、学校和专业的关注点提炼为 AI 写作策略，帮助你把真实经历转化为更清晰、更匹配的申请表达。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:min-w-[300px]">
            <div className="rounded-lg bg-white px-3 py-3 text-center border border-blue-100">
              <div className="text-lg font-bold text-blue-600">3000+</div>
              <div className="text-xs text-gray-500">院校专业数据</div>
            </div>
            <div className="rounded-lg bg-white px-3 py-3 text-center border border-blue-100">
              <div className="text-lg font-bold text-blue-600">多地区</div>
              <div className="text-xs text-gray-500">申请偏好沉淀</div>
            </div>
            <div className="rounded-lg bg-white px-3 py-3 text-center border border-blue-100">
              <div className="text-lg font-bold text-blue-600">定制化</div>
              <div className="text-xs text-gray-500">学校专业侧重</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {copy.focus.map((item) => (
            <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 border border-blue-100">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
