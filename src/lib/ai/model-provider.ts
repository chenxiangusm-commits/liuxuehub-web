/**
 * AI 模型提供者抽象层
 * 支持多种模型：qwen、deepseek、doubao、kimi、openai、claude
 * 架构设计支持后期扩展，不暴露 API Key
 */

export type ModelProvider = 'qwen' | 'deepseek' | 'doubao' | 'kimi' | 'openai' | 'claude';

export interface GenerateOptions {
  provider?: ModelProvider;
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  responseFormat?: 'json' | 'text';
}

export interface GenerateResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// 模型端点配置（服务端使用，不暴露给前端）
const MODEL_ENDPOINTS: Record<ModelProvider, { baseUrl: string; defaultModel: string }> = {
  qwen: {
    baseUrl: process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: process.env.QWEN_MODEL || 'qwen-plus',
  },
  deepseek: {
    baseUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
    defaultModel: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
  doubao: {
    baseUrl: process.env.DOUBAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: process.env.DOUBAO_MODEL || 'doubao-pro-32k',
  },
  kimi: {
    baseUrl: process.env.KIMI_API_URL || 'https://api.moonshot.cn/v1',
    defaultModel: process.env.KIMI_MODEL || 'moonshot-v1-32k',
  },
  openai: {
    baseUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    defaultModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  claude: {
    baseUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1',
    defaultModel: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
  },
};

/**
 * 获取 API Key（从环境变量，服务端使用）
 */
function getApiKey(provider: ModelProvider): string {
  const keyMap: Record<ModelProvider, string> = {
    qwen: process.env.QWEN_API_KEY || '',
    deepseek: process.env.DEEPSEEK_API_KEY || '',
    doubao: process.env.DOUBAO_API_KEY || '',
    kimi: process.env.KIMI_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    claude: process.env.CLAUDE_API_KEY || '',
  };
  return keyMap[provider];
}

/**
 * 统一生成函数
 * @param options 生成选项
 * @returns 生成结果
 */
export async function generateWithModel(options: GenerateOptions): Promise<GenerateResult> {
  const {
    provider = 'qwen',
    model,
    systemPrompt,
    userPrompt,
    temperature = 0.7,
    responseFormat = 'json',
  } = options;

  const config = MODEL_ENDPOINTS[provider];
  const apiKey = getApiKey(provider);
  const modelName = model || config.defaultModel;

  // 检查 API Key
  if (!apiKey) {
    return {
      success: false,
      error: `API Key not configured for provider: ${provider}`,
    };
  }

  try {
    // 根据不同 provider 构建请求
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(provider === 'claude' ? { 'x-api-key': apiKey } : { 'Authorization': `Bearer ${apiKey}` }),
        ...(provider === 'claude' && { 'anthropic-version': '2023-06-01' }),
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        ...(responseFormat === 'json' && { response_format: { type: 'json_object' } }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: 'No content generated',
      };
    }

    // 如果需要 JSON 格式，尝试解析
    if (responseFormat === 'json') {
      try {
        // 尝试提取 JSON（处理可能的 markdown 代码块）
        let jsonStr = content;
        if (content.includes('```json')) {
          jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (content.includes('```')) {
          jsonStr = content.replace(/```\n?/g, '').replace(/```\n?$/g, '');
        }
        const parsed = JSON.parse(jsonStr);
        return {
          success: true,
          data: parsed,
        };
      } catch {
        return {
          success: false,
          error: 'Failed to parse JSON response',
        };
      }
    }

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mock 生成函数（用于开发测试或免费用户）
 */
export async function mockGenerate(options: GenerateOptions): Promise<GenerateResult> {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 根据用户提示词生成简单的 mock 响应
  return {
    success: true,
    data: {
      message: 'This is a mock response for development/testing.',
      provider: options.provider || 'mock',
      promptLength: options.userPrompt.length,
    },
  };
}

/**
 * 根据工具类型选择合适的 provider
 */
export function getDefaultProviderForTool(toolType: string): ModelProvider {
  const toolProviders: Record<string, ModelProvider> = {
    resume: 'qwen',      // 留学简历用 Qwen（中文支持好）
    ps: 'qwen',          // 个人陈述
    motivation: 'qwen',  // 动机信
    recommendation: 'qwen', // 推荐信
    essay: 'qwen',       // Essay
    interview: 'deepseek', // 面试模拟用 DeepSeek（推理能力强）
    review: 'kimi',      // 材料检查
  };
  return toolProviders[toolType] || 'qwen';
}
