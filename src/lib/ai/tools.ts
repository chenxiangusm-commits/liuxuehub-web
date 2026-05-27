/**
 * AI 工具注册表
 * 定义所有可用的 AI 工具及其配置
 */

export type AIToolType = 'resume' | 'ps' | 'motivation' | 'recommendation' | 'essay' | 'interview' | 'review';

export interface AIToolConfig {
  id: AIToolType;
  name: string;
  description: string;
  icon: string;
  features: string[];
  available: boolean;
  route: string;
  inputFields: AIToolField[];
  outputFields: string[];
}

export interface AIToolField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multitext' | 'file' | 'date-range';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  maxItems?: number; // 用于 multitext 类型
}

export const AI_TOOLS: AIToolConfig[] = [
  {
    id: 'resume',
    name: 'AI留学申请简历',
    description: '生成适合海外院校申请的英文CV',
    icon: '📄',
    features: ['中英双语输出', '申请定位分析', '专业CV模板'],
    available: true,
    route: '/ai/resume',
    inputFields: [
      {
        name: 'application',
        label: '申请目标',
        type: 'multitext',
        required: true,
        maxItems: 5,
      },
      {
        name: 'profile',
        label: '基础信息',
        type: 'multitext',
        required: true,
        maxItems: 8,
      },
      {
        name: 'education',
        label: '教育背景',
        type: 'multitext',
        required: true,
        maxItems: 5,
      },
      {
        name: 'experiences',
        label: '经历信息',
        type: 'multitext',
        required: false,
        maxItems: 10,
      },
    ],
    outputFields: ['score', 'positioning', 'cv', 'suggestions', 'missingFields'],
  },
  {
    id: 'ps',
    name: 'AI个人陈述PS',
    description: '生成个性化、有说服力的Personal Statement',
    icon: '✍️',
    features: ['故事线设计', '结构优化', '语言润色'],
    available: false,
    route: '/ai/ps',
    inputFields: [],
    outputFields: [],
  },
  {
    id: 'motivation',
    name: 'AI动机信',
    description: '针对目标院校定制Motivation Letter',
    icon: '💌',
    features: ['院校定制', '亮点突出', '专业匹配'],
    available: false,
    route: '/ai/motivation',
    inputFields: [],
    outputFields: [],
  },
  {
    id: 'recommendation',
    name: 'AI推荐信',
    description: '辅助撰写教授/导师推荐信',
    icon: '📝',
    features: ['多角色模板', '真实自然', '差异化表达'],
    available: false,
    route: '/ai/recommendation',
    inputFields: [],
    outputFields: [],
  },
  {
    id: 'essay',
    name: 'AI Essay/小文书',
    description: '申请港校/美本必备的短essay辅助撰写',
    icon: '📚',
    features: ['话题解析', '思路拓展', '范例参考'],
    available: false,
    route: '/ai/essay',
    inputFields: [],
    outputFields: [],
  },
  {
    id: 'interview',
    name: 'AI留学面试官',
    description: '港校、新加坡、英国院校申请面试模拟',
    icon: '🎙️',
    features: ['真实模拟', '即时反馈', '评分报告'],
    available: false,
    route: '/ai/interview',
    inputFields: [],
    outputFields: [],
  },
  {
    id: 'review',
    name: 'AI申请材料检查器',
    description: '全面检查申请材料，提升录取几率',
    icon: '🔍',
    features: ['完整性检查', '格式规范', '优化建议'],
    available: false,
    route: '/ai/review',
    inputFields: [],
    outputFields: [],
  },
];

/**
 * 获取工具配置
 */
export function getToolConfig(toolId: AIToolType): AIToolConfig | undefined {
  return AI_TOOLS.find(tool => tool.id === toolId);
}

/**
 * 获取可用工具列表
 */
export function getAvailableTools(): AIToolConfig[] {
  return AI_TOOLS.filter(tool => tool.available);
}

/**
 * 获取即将上线工具列表
 */
export function getComingSoonTools(): AIToolConfig[] {
  return AI_TOOLS.filter(tool => !tool.available);
}
