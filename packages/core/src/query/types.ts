export interface SqlSnippet {
  sql: string;
  datasourceId: number;
}

export interface PlannedQuery {
  question: string;
  sql: SqlSnippet[];
  limit?: number;
}

export interface ExecutionResult {
  rows: unknown[];
  sql: SqlSnippet[];
  summary?: string;
}
