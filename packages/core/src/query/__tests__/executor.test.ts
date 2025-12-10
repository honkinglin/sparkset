import { describe, it, expect, vi } from 'vitest';
import { QueryExecutor } from '../executor';
import { SqlSnippet } from '../types';

const makeClient = (rows: unknown[]) => ({
  testConnection: vi.fn().mockResolvedValue(true),
  query: vi.fn().mockResolvedValue({ rows }),
});

describe('QueryExecutor', () => {
  it('executes snippets and aggregates rows', async () => {
    const client = makeClient([{ a: 1 }, { a: 2 }]);
    const getDBClient = vi.fn().mockResolvedValue(client);
    const getDatasourceConfig = vi
      .fn()
      .mockResolvedValue({ id: 1, host: '', port: 0, username: '', password: '', database: '' });
    const executor = new QueryExecutor({ getDBClient, getDatasourceConfig });
    const sql: SqlSnippet[] = [
      { sql: 'select 1', datasourceId: 1 },
      { sql: 'select 2', datasourceId: 1 },
    ];

    const result = await executor.execute(sql);

    expect(result.rows).toHaveLength(4);
    expect(getDBClient).toHaveBeenCalledTimes(2);
    expect(client.query).toHaveBeenCalledTimes(2);
  });
});
