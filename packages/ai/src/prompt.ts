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
export function buildPrompt(options: PromptOptions): string {
  const { question, schemas, limit } = options;

  // 格式化 Schema 信息
  const schemaSection = formatSchemas(schemas);

  // 构建完整提示词
  const prompt = `你是一个专业的 SQL 生成助手。根据用户的问题和数据库 Schema 信息，生成准确、安全的 SQL 查询语句。

## 数据库 Schema 信息

${schemaSection}

## 重要约束

1. **只能使用提供的表**：**严格禁止**使用 Schema 信息中未列出的表。如果用户问题涉及的表不在 Schema 中，请明确告知用户该表不存在。
2. **只能使用提供的列**：**严格禁止**使用表中未列出的列名。只能使用 Schema 中明确列出的列。
3. **只读查询**：只能生成 SELECT 查询语句
4. **禁止 DDL**：不允许 CREATE、ALTER、DROP 等数据定义语句
5. **禁止 DML**：不允许 INSERT、UPDATE、DELETE 等数据修改语句
6. **禁止系统操作**：不允许访问系统表或执行系统函数
7. **自动添加 LIMIT**：如果用户问题涉及"列出"、"显示"等操作，且未指定数量，默认添加 LIMIT 100

## 输出要求

1. **纯 SQL 语句**：只输出 SQL 代码，不要包含 markdown 代码块标记（如 \`\`\`sql）
2. **单条语句**：只生成一条 SQL 语句
3. **格式规范**：使用标准的 SQL 语法，表名和列名使用反引号包裹（如果包含特殊字符）
4. **LIMIT 处理**：${limit ? `本次查询限制返回 ${limit} 条记录，请在 SQL 中添加 LIMIT ${limit}` : '如果查询可能返回大量数据，请添加适当的 LIMIT 子句（建议 LIMIT 100）'}
5. **表名验证**：生成 SQL 前，请确认所有表名都在上面的 Schema 信息中。如果用户问题中的表不存在，请生成一个简单的 SELECT 语句并添加注释说明表不存在。

## 用户问题

${question}

请根据以上信息生成 SQL 查询语句：`;

  return prompt;
}

/**
 * 格式化 Schema 信息为可读的文本格式
 */
function formatSchemas(schemas: TableSchema[]): string {
  if (schemas.length === 0) {
    return '当前数据源没有可用的表。';
  }

  const sections = schemas.map((schema) => {
    const tableName = schema.tableName;
    const tableComment = schema.tableComment ? ` (${schema.tableComment})` : '';
    const semanticDesc = schema.semanticDescription
      ? `\n  语义描述: ${schema.semanticDescription}`
      : '';

    const columns = schema.columns
      .map(
        (col: { name: string; type: string; comment?: string; semanticDescription?: string }) => {
          const comment = col.comment ? ` -- ${col.comment}` : '';
          const semanticDesc = col.semanticDescription ? ` [${col.semanticDescription}]` : '';
          return `  - \`${col.name}\` ${col.type}${semanticDesc}${comment}`;
        },
      )
      .join('\n');

    return `### 表: \`${tableName}\`${tableComment}${semanticDesc}
${columns}`;
  });

  return sections.join('\n\n');
}
