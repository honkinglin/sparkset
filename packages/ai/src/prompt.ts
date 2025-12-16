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

export interface ActionPromptOptions {
  name: string;
  description: string;
  schemas: TableSchema[];
}

/**
 * 构建用于生成 Action SQL 的提示词
 * 与查询 prompt 的区别：支持 DML 操作（INSERT, UPDATE, DELETE）和命名参数
 */
export function buildActionPrompt(options: ActionPromptOptions): string {
  const { name, description, schemas } = options;

  // 格式化 Schema 信息
  const schemaSection = formatSchemas(schemas);

  // 根据名称和描述推断操作类型
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  let operationHint = '';

  if (
    lowerName.includes('查询') ||
    lowerName.includes('获取') ||
    lowerName.includes('列表') ||
    lowerDesc.includes('查询') ||
    lowerDesc.includes('获取') ||
    lowerDesc.includes('列表')
  ) {
    operationHint = '这是一个查询操作，请使用 SELECT 语句。';
  } else if (
    lowerName.includes('插入') ||
    lowerName.includes('添加') ||
    lowerName.includes('创建') ||
    lowerDesc.includes('插入') ||
    lowerDesc.includes('添加') ||
    lowerDesc.includes('创建')
  ) {
    operationHint = '这是一个插入操作，请使用 INSERT 语句。';
  } else if (
    lowerName.includes('更新') ||
    lowerName.includes('修改') ||
    lowerName.includes('编辑') ||
    lowerDesc.includes('更新') ||
    lowerDesc.includes('修改') ||
    lowerDesc.includes('编辑')
  ) {
    operationHint = '这是一个更新操作，请使用 UPDATE 语句。';
  } else if (
    lowerName.includes('删除') ||
    lowerName.includes('移除') ||
    lowerName.includes('封禁') ||
    lowerDesc.includes('删除') ||
    lowerDesc.includes('移除') ||
    lowerDesc.includes('封禁')
  ) {
    operationHint = '这是一个删除或更新操作，请使用 DELETE 或 UPDATE 语句。';
  }

  // 构建完整提示词
  const prompt = `你是一个专业的 SQL 生成助手。根据用户提供的 Action 名称和描述，以及数据库 Schema 信息，生成准确、安全的 SQL 语句。

**重要：你的响应必须是有效的 JSON 格式，不能包含任何其他文本、markdown 代码块或解释。**

## 数据库 Schema 信息

${schemaSection}

## Action 信息

- **名称**: ${name}
${description ? `- **描述**: ${description}` : '- **描述**: 无（仅根据名称推断）'}
${operationHint ? `- **操作类型提示**: ${operationHint}` : ''}

## 重要约束

1. **只能使用提供的表**：**严格禁止**使用 Schema 信息中未列出的表。如果 Action 涉及的表不在 Schema 中，返回 JSON 错误。
2. **只能使用提供的列**：**严格禁止**使用表中未列出的列名。只能使用 Schema 中明确列出的列。
3. **支持 DML 操作**：可以根据 Action 描述生成 SELECT、INSERT、UPDATE、DELETE 等语句。
4. **禁止 DDL**：不允许 CREATE、ALTER、DROP 等数据定义语句。
5. **禁止系统操作**：不允许访问系统表或执行系统函数。
6. **使用命名参数**：对于需要用户输入的值，必须使用命名参数格式 \`:paramName\`（例如：\`:userId\`, \`:user_id\`, \`:limit\`）。
7. **参数命名规范**：
   - 使用有意义的参数名（如 \`:userId\` 而不是 \`:id\`）
   - 参数名使用小写字母和下划线（如 \`:user_id\`）
   - 根据 Action 描述推断需要哪些参数

## 输出格式要求（必须严格遵守）

**你的响应必须是纯 JSON 文本，格式如下：**

成功时（必须包含 SQL 和参数定义）：
{
  "success": true,
  "sql": "SELECT * FROM \`users\` WHERE \`id\` = :userId",
  "parameters": [
    {
      "name": "userId",
      "type": "number",
      "required": true,
      "label": "User Id",
      "description": "用户 ID"
    }
  ]
}

失败时：
{"success": false, "error": "表不存在或信息不足"}

**参数定义说明：**
- name: 参数名（与 SQL 中的 :paramName 一致，不包含冒号）
- type: 参数类型，必须是 "string"、"number" 或 "boolean"
- required: 是否必填，true 或 false
- label: 显示标签（可选，如不提供则使用 name）
- description: 参数描述（可选）

**严格禁止：**
- ❌ 不要使用 markdown 代码块（不要包含 \`\`\`json 或 \`\`\`）
- ❌ 不要添加任何解释文字、注释或说明
- ❌ 不要返回纯 SQL 文本
- ❌ 不要返回纯文本错误消息
- ✅ 只返回有效的 JSON 对象

## SQL 语句要求

- 单条语句
- 使用标准的 SQL 语法，表名和列名使用反引号包裹（如果包含特殊字符）
- 在 WHERE 条件、VALUES 子句、SET 子句等需要用户输入的地方使用命名参数（格式：\`:paramName\`）

## 示例

如果 Action 是"查询用户"，成功时应返回：
{
  "success": true,
  "sql": "SELECT * FROM \`users\` WHERE \`id\` = :userId",
  "parameters": [
    {
      "name": "userId",
      "type": "number",
      "required": true,
      "label": "用户 ID",
      "description": "要查询的用户 ID"
    }
  ]
}

如果 Action 是"封禁用户"，成功时应返回：
{
  "success": true,
  "sql": "UPDATE \`users\` SET \`status\` = 'banned' WHERE \`id\` = :userId",
  "parameters": [
    {
      "name": "userId",
      "type": "number",
      "required": true,
      "label": "用户 ID",
      "description": "要封禁的用户 ID"
    }
  ]
}

如果表不存在，应返回：
{"success": false, "error": "表 users 不存在于 Schema 中"}

## 任务

为 Action "${name}" 生成 SQL 语句和参数定义。

**重要：**
1. 如果 SQL 中包含命名参数（如 :userId），必须在 parameters 数组中定义这些参数
2. 根据 Action 名称和描述，为每个参数推断合适的类型、标签和描述
3. 参数名必须与 SQL 中的命名参数一致（不包含冒号）

**现在请只返回 JSON，格式：**
- 成功：{"success": true, "sql": "...", "parameters": [...]}
- 失败：{"success": false, "error": "..."}**`;

  return prompt;
}
