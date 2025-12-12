'use client';

import { CodeViewer } from '../code-viewer';
import { ApiResult } from './api-result';
import { SqlResult } from './sql-result';
import type { ActionExecutionResponse } from './types';
import { isApiResult, isSqlResult } from './types';

interface ActionResultProps {
  actionType: string;
  result: ActionExecutionResponse;
}

export function ActionResult({ actionType, result }: ActionResultProps) {
  const { result: actionResult } = result;

  // SQL 类型：使用 SQL 结果组件
  if (actionType === 'sql' && isSqlResult(actionResult)) {
    return <SqlResult result={actionResult} />;
  }

  // API 类型：使用 API 结果组件
  if (actionType === 'api' && isApiResult(actionResult)) {
    return <ApiResult result={actionResult} />;
  }

  // 其他类型：默认 JSON 展示
  return <CodeViewer code={JSON.stringify(actionResult, null, 2)} language="json" />;
}
