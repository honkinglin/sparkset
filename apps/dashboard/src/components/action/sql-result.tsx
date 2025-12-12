'use client';

import type { QueryResponse } from '../../lib/query';
import { QueryResult } from '../query/result';
import type { SqlActionResult } from './types';

interface SqlResultProps {
  result: SqlActionResult;
}

export function SqlResult({ result }: SqlResultProps) {
  // 将 SqlActionResult 转换为 QueryResponse 格式
  const queryResponse: QueryResponse = {
    sql: result.sql.map((s) => s.sql).join(';\n'),
    rows: result.rows as Record<string, unknown>[],
    summary: result.summary,
  };

  // 从 sql 数组中提取 datasourceId（取第一个）
  const datasourceId = result.sql[0]?.datasourceId;

  return <QueryResult result={queryResponse} datasourceId={datasourceId} />;
}
