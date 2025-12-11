/**
 * AI SDK v6 支持的 Provider 类型列表
 * 参考: https://v6.ai-sdk.dev/providers/ai-sdk-providers
 */

export interface ProviderTypeInfo {
  value: string;
  label: string;
  description?: string;
}

export const AI_PROVIDER_TYPES: ProviderTypeInfo[] = [
  { value: 'openai', label: 'OpenAI', description: 'GPT 系列模型' },
  { value: 'anthropic', label: 'Anthropic', description: 'Claude 系列模型' },
  { value: 'google', label: 'Google Generative AI', description: 'Gemini 系列模型' },
  { value: 'google-vertex', label: 'Google Vertex AI', description: 'Gemini 系列模型（Vertex）' },
  { value: 'xai', label: 'xAI Grok', description: 'Grok 系列模型' },
  { value: 'azure', label: 'Azure OpenAI', description: 'Azure 托管的 OpenAI' },
  { value: 'amazon-bedrock', label: 'Amazon Bedrock', description: 'AWS Bedrock 服务' },
  { value: 'vercel', label: 'Vercel', description: 'Vercel AI Gateway' },
  { value: 'mistral', label: 'Mistral AI', description: 'Mistral 系列模型' },
  { value: 'groq', label: 'Groq', description: 'Groq 推理服务' },
  { value: 'deepinfra', label: 'DeepInfra', description: 'DeepInfra 托管模型' },
  { value: 'deepseek', label: 'DeepSeek', description: 'DeepSeek 系列模型' },
  { value: 'cerebras', label: 'Cerebras', description: 'Cerebras 模型' },
  { value: 'fireworks', label: 'Fireworks', description: 'Fireworks AI' },
  { value: 'huggingface', label: 'Hugging Face', description: 'Hugging Face 模型' },
  { value: 'baseten', label: 'Baseten', description: 'Baseten 平台' },
  { value: 'together', label: 'Together.ai', description: 'Together AI 服务' },
  { value: 'cohere', label: 'Cohere', description: 'Cohere 模型' },
  { value: 'perplexity', label: 'Perplexity', description: 'Perplexity AI' },
  { value: 'elevenlabs', label: 'ElevenLabs', description: '语音合成服务' },
  { value: 'lmnt', label: 'LMNT', description: '语音合成服务' },
  { value: 'hume', label: 'Hume', description: '情感 AI 服务' },
  { value: 'revai', label: 'Rev.ai', description: '语音识别服务' },
  { value: 'deepgram', label: 'Deepgram', description: '语音识别服务' },
  { value: 'gladia', label: 'Gladia', description: '语音识别服务' },
  { value: 'assemblyai', label: 'AssemblyAI', description: '语音识别服务' },
  {
    value: 'openai-compatible',
    label: 'OpenAI Compatible',
    description: '兼容 OpenAI API 的自定义端点',
  },
];

export function getProviderLabel(type: string): string {
  return AI_PROVIDER_TYPES.find((p) => p.value === type)?.label ?? type;
}

export function getProviderDescription(type: string): string | undefined {
  return AI_PROVIDER_TYPES.find((p) => p.value === type)?.description;
}
