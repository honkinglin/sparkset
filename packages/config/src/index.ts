// Shared config loader
import { loadAIConfig, type AIConfig } from './ai';

export interface AppConfig {
  ai?: AIConfig | null;
}

/**
 * 加载应用配置
 */
export const loadConfig = (): AppConfig => {
  return {
    ai: loadAIConfig(),
  };
};

// 导出 AI 配置相关类型和函数
export { getDefaultProviderConfig, getProviderConfig, loadAIConfig } from './ai';
export type { AIConfig, AIProviderConfig } from './ai';
