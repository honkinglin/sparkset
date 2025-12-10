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
 * Stub QueryService: future version will invoke AI + executor. Now returns canned rows and
 * optionally echoes action payload / datasource context to aid frontend/CLI integration.
 */
export class QueryService {
  constructor(
    private deps?: {
      getDatasource?: (id: number) => Promise<DataSource | null>;
      getAction?: (id: number) => Promise<{ payload: unknown } | null>;
    },
  ) {}

  async run(input: QueryRequest): Promise<QueryResponse> {
    const rows: QueryResultRow[] = [
      { user: 'Alice', region: '杭州', orders: 34, refundRate: '2.1%' },
      { user: 'Bob', region: '上海', orders: 21, refundRate: '1.5%' },
      { user: 'Carol', region: '北京', orders: 18, refundRate: '3.2%' },
    ];

    let sql = `-- generated SQL for: ${input.question}`;
    let datasource: DataSource | undefined;

    if (input.datasource && this.deps?.getDatasource) {
      datasource = (await this.deps.getDatasource(input.datasource)) ?? undefined;
      if (datasource) sql += `\n-- target datasource: ${datasource.name}`;
    }

    if (input.action && this.deps?.getAction) {
      const action = await this.deps.getAction(input.action);
      if (action?.payload) {
        sql += `\n-- action payload attached`;
        rows.unshift({ actionPayload: action.payload });
      }
    }

    const limitedRows = input.limit ? rows.slice(0, input.limit) : rows;
    return {
      sql,
      rows: limitedRows,
      datasource,
      summary: 'Stubbed query response; replace with AI + executor pipeline.',
    };
  }
}
