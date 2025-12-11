/**
 * AI 配置模块
 * 支持多个 provider 配置和默认 provider 设置
 */

export type AIProviderType =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'google-vertex'
  | 'xai'
  | 'azure'
  | 'amazon-bedrock'
  | 'vercel'
  | 'mistral'
  | 'groq'
  | 'deepinfra'
  | 'deepseek'
  | 'cerebras'
  | 'fireworks'
  | 'huggingface'
  | 'baseten'
  | 'together'
  | 'cohere'
  | 'perplexity'
  | 'elevenlabs'
  | 'lmnt'
  | 'hume'
  | 'revai'
  | 'deepgram'
  | 'gladia'
  | 'assemblyai'
  | 'openai-compatible'; // 兼容 OpenAI API 的自定义端点

export interface AIProviderConfig {
  /** Provider 名称，如 'openai', 'anthropic' */
  name: string;
  /** Provider 类型 */
  type: AIProviderType;
  /** API Key */
  apiKey?: string;
  /** Base URL（可选，用于兼容 OpenAI API 的自定义端点） */
  baseURL?: string;
  /** 默认模型 */
  defaultModel?: string;
}

export interface AIConfig {
  /** 默认 provider 名称 */
  defaultProvider: string;
  /** Provider 配置列表 */
  providers: AIProviderConfig[];
  /** Fallback 模型列表（按优先级排序） */
  fallbackModels?: Array<{
    model: string;
    provider: string;
  }>;
}

/**
 * 从环境变量加载 AI 配置
 * @param dbConfig 可选的数据库配置（优先使用）
 */
export function loadAIConfig(dbConfig?: AIConfig | null): AIConfig | null {
  // 优先使用数据库配置
  if (dbConfig) {
    return dbConfig;
  }
  // 检查是否有任何 AI 配置
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAIConfig = !!(
    process.env.AI_API_KEY ||
    process.env.AI_PROVIDER ||
    hasOpenAIKey ||
    hasAnthropicKey
  );

  if (!hasAIConfig) {
    return null;
  }

  const providers: AIProviderConfig[] = [];
  let defaultProvider = process.env.AI_PROVIDER || 'openai';

  // 配置 OpenAI provider
  const openaiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (openaiKey) {
    providers.push({
      name: 'openai',
      type: 'openai',
      apiKey: openaiKey,
      baseURL: process.env.OPENAI_BASE_URL || process.env.AI_BASE_URL,
      defaultModel: process.env.OPENAI_MODEL || process.env.AI_MODEL || 'gpt-4o-mini',
    });
  }

  // 配置 Anthropic provider
  const anthropicKey =
    process.env.ANTHROPIC_API_KEY ||
    (process.env.AI_PROVIDER === 'anthropic' ? process.env.AI_API_KEY : undefined);
  if (anthropicKey) {
    providers.push({
      name: 'anthropic',
      type: 'anthropic',
      apiKey: anthropicKey,
      baseURL: process.env.ANTHROPIC_BASE_URL || process.env.AI_BASE_URL,
      defaultModel:
        process.env.ANTHROPIC_MODEL || process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    });
  }

  // 如果指定了 AI_PROVIDER 但对应的 key 不存在，使用通用配置
  if (process.env.AI_PROVIDER && !providers.find((p) => p.name === process.env.AI_PROVIDER)) {
    const aiKey = process.env.AI_API_KEY;
    if (aiKey) {
      const providerType = process.env.AI_PROVIDER === 'anthropic' ? 'anthropic' : 'openai';
      providers.push({
        name: process.env.AI_PROVIDER,
        type: providerType,
        apiKey: aiKey,
        baseURL: process.env.AI_BASE_URL,
        defaultModel:
          process.env.AI_MODEL ||
          (providerType === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 'gpt-4o-mini'),
      });
    }
  }

  // 如果没有配置任何 provider，返回 null
  if (providers.length === 0) {
    return null;
  }

  // 验证默认 provider 是否存在
  if (!providers.find((p) => p.name === defaultProvider)) {
    defaultProvider = providers[0].name;
  }

  // 解析 fallback 模型
  let fallbackModels: Array<{ model: string; provider: string }> | undefined;
  if (process.env.AI_FALLBACK_MODELS) {
    try {
      const parsed = JSON.parse(process.env.AI_FALLBACK_MODELS);
      if (Array.isArray(parsed)) {
        fallbackModels = parsed.map((item) => {
          if (typeof item === 'string') {
            // 简单格式: "model:provider" 或只有 "model"（使用默认 provider）
            const parts = item.split(':');
            return {
              model: parts[0],
              provider: parts[1] || defaultProvider,
            };
          } else if (typeof item === 'object' && item.model) {
            return {
              model: item.model,
              provider: item.provider || defaultProvider,
            };
          }
          throw new Error('Invalid fallback model format');
        });
      }
    } catch (err) {
      console.warn('Failed to parse AI_FALLBACK_MODELS, ignoring fallback configuration:', err);
    }
  }

  return {
    defaultProvider,
    providers,
    fallbackModels,
  };
}

/**
 * 获取指定 provider 的配置
 */
export function getProviderConfig(
  config: AIConfig,
  providerName?: string,
): AIProviderConfig | null {
  const name = providerName || config.defaultProvider;
  return config.providers.find((p) => p.name === name) || null;
}

/**
 * 获取默认 provider 的配置
 */
export function getDefaultProviderConfig(config: AIConfig): AIProviderConfig | null {
  return getProviderConfig(config, config.defaultProvider);
}
