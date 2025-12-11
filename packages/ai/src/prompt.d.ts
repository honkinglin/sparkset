import { TableSchema } from '@sparkline/models';
export interface PromptOptions {
  question: string;
  schemas: TableSchema[];
  limit?: number;
}
/**
 * 构建用于生成 SQL 的提示词
 * 包含 Schema 信息、安全约束和输出格式要求
 */
export declare function buildPrompt(options: PromptOptions): string;
//# sourceMappingURL=prompt.d.ts.map
