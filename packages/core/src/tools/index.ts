import { QueryExecutor } from '../query/executor';
import { SqlSnippet } from '../query/types';

export type ActionType = 'sql' | 'api' | 'file' | string;

export interface ActionContext<P = unknown> {
  id: number;
  type: ActionType;
  payload: P;
  parameters?: unknown;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
}

export interface ActionHandler {
  type: ActionType;
  execute: (ctx: ActionContext) => Promise<ActionResult>;
}

export class ActionRegistry {
  private handlers = new Map<ActionType, ActionHandler>();

  register(handler: ActionHandler) {
    this.handlers.set(handler.type, handler);
  }

  get(type: ActionType) {
    return this.handlers.get(type);
  }
}

export class ActionExecutor {
  constructor(private registry: ActionRegistry) {}

  async run(ctx: ActionContext): Promise<ActionResult> {
    const handler = this.registry.get(ctx.type);
    if (!handler) {
      return { success: false, error: new Error(`No handler for type ${ctx.type}`) };
    }
    return handler.execute(ctx);
  }
}

// SQL tool
export interface SqlActionPayload {
  sql: string | string[] | SqlSnippet[];
  datasourceId?: number;
  limit?: number;
}

export const createSqlActionHandler = (deps: {
  executor: QueryExecutor;
  defaultDatasourceId?: number | (() => Promise<number | undefined>);
}) => {
  const handler: ActionHandler = {
    type: 'sql',
    async execute(ctx: ActionContext<SqlActionPayload>) {
      const payload = ctx.payload;
      let dsId = payload.datasourceId;
      if (!dsId) {
        if (typeof deps.defaultDatasourceId === 'function') {
          dsId = await deps.defaultDatasourceId();
        } else {
          dsId = deps.defaultDatasourceId;
        }
      }
      if (!dsId)
        return { success: false, error: new Error('Datasource is required for SQL action') };

      const snippets: SqlSnippet[] = Array.isArray(payload.sql)
        ? typeof payload.sql[0] === 'string'
          ? (payload.sql as string[]).map((s) => ({ sql: s, datasourceId: dsId }))
          : ((payload.sql as SqlSnippet[]) ?? [])
        : [{ sql: payload.sql, datasourceId: dsId }];

      const execResult = await deps.executor.execute(snippets, { limit: payload.limit });
      return { success: true, data: execResult };
    },
  };
  return handler;
};

// Fallback stub tool for unimplemented types
export const createEchoHandler = (type: ActionType): ActionHandler => ({
  type,
  async execute(ctx) {
    return { success: true, data: ctx.payload };
  },
});
