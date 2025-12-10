import { describe, it, expect, vi } from 'vitest';
import { QueryService } from '../src/app/services/queryService';
import { QueryPlanner } from '@sparkline/core';
import { QueryExecutor } from '@sparkline/core';

const makeDatasourceService = () => ({
  list: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: 'ds',
      type: 'mysql',
      host: '',
      port: 0,
      username: '',
      password: '',
      database: '',
    },
  ]),
});
const makeActionService = () => ({ get: vi.fn().mockResolvedValue(null) });

const planner = {
  plan: vi.fn().mockResolvedValue({
    question: 'q',
    sql: [{ sql: 'select 1', datasourceId: 1 }],
    limit: undefined,
  }),
} as unknown as QueryPlanner;
const executor = {
  execute: vi
    .fn()
    .mockResolvedValue({ rows: [{ a: 1 }], sql: [{ sql: 'select 1', datasourceId: 1 }] }),
} as unknown as QueryExecutor;

describe('QueryService', () => {
  it('returns executor rows when wired', async () => {
    const svc = new QueryService({
      datasourceService: makeDatasourceService() as any,
      actionService: makeActionService() as any,
      planner,
      executor,
    });

    const res = await svc.run({ question: 'hi' });
    expect(res.rows[0]).toEqual({ a: 1 });
  });

  it('falls back to stub rows when executor missing', async () => {
    const svc = new QueryService({
      datasourceService: makeDatasourceService() as any,
      actionService: makeActionService() as any,
    } as any);
    const res = await svc.run({ question: 'hi', limit: 1 });
    expect(res.rows).toHaveLength(1);
  });
});
