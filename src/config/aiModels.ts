export const AIModels = {
  planning: {
    provider: "qwen",
    model: "qwen-plus",
  },
  reasoning: {
    provider: "deepseek",
    model: "deepseek-chat",
  },
  longContext: {
    provider: "kimi",
    model: "moonshot-v1",
  },
} as const;

