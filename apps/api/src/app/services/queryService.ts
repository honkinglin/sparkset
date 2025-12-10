import { DataSource } from '@sparkline/models';

export interface QueryRequest {
  question: string;
  datasource?: number;
  action?: number;
  limit?: number;
}

export type QueryResultRow = Record<string, unknown>;

export interface QueryResponse {
  sql: string;
  rows: QueryResultRow[];
  summary?: string;
  datasource?: DataSource;
}

/**
 * Stub QueryService: in future connects AI + executor. Currently returns canned rows.
 */
export class QueryService {
  async run(input: QueryRequest): Promise<QueryResponse> {
    const sql = `-- generated SQL for: ${input.question}`;
    const rows: QueryResultRow[] = [
      { user: 'Alice', region: '杭州', orders: 34, refundRate: '2.1%' },
      { user: 'Bob', region: '上海', orders: 21, refundRate: '1.5%' },
      { user: 'Carol', region: '北京', orders: 18, refundRate: '3.2%' },
    ];
    const limitedRows = input.limit ? rows.slice(0, input.limit) : rows;
    return {
      sql,
      rows: limitedRows,
      summary: 'Stubbed query response; replace with AI + executor pipeline.',
    };
  }
}
