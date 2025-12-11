import { DBClient, DataSourceConfig, SchemaCacheRepository } from '@sparkline/db';
import { ColumnDefinition, DataSource, TableSchema } from '@sparkline/models';

export interface SchemaServiceDeps {
  schemaRepo: SchemaCacheRepository;
  getDBClient: (datasource: DataSource) => Promise<DBClient>;
  logger?: {
    info: (msg: string, ...args: unknown[]) => void;
    error: (msg: string | Error, ...args: unknown[]) => void;
    warn: (msg: string, ...args: unknown[]) => void;
  };
}

export class SchemaService {
  constructor(private deps: SchemaServiceDeps) {}

  async list(datasourceId: number): Promise<TableSchema[]> {
    return this.deps.schemaRepo.listTables(datasourceId);
  }

  async updateTableMetadata(
    tableSchemaId: number,
    data: { tableComment?: string | null; semanticDescription?: string | null },
  ): Promise<void> {
    await this.deps.schemaRepo.updateTableMetadata(tableSchemaId, data);
  }

  async updateColumnMetadata(
    columnId: number,
    data: { columnComment?: string | null; semanticDescription?: string | null },
  ): Promise<void> {
    await this.deps.schemaRepo.updateColumnMetadata(columnId, data);
  }

  async sync(datasource: DataSource): Promise<Date> {
    const client = await this.deps.getDBClient(datasource);
    const config: DataSourceConfig = { ...datasource };

    // 转义数据库名称，防止 SQL 注入
    const escapedDbName = datasource.database.replace(/\\/g, '\\\\').replace(/'/g, "''");

    this.deps.logger?.info(
      `Syncing datasource ${datasource.id} (${datasource.name}), database: ${datasource.database}`,
    );

    // 查询表注释
    const tableSql = `
      SELECT
        TABLE_NAME AS tableName,
        TABLE_COMMENT AS tableComment
      FROM information_schema.tables
      WHERE table_schema = '${escapedDbName}'
        AND table_type = 'BASE TABLE'
      ORDER BY TABLE_NAME;
    `;

    let tableRows: { tableName: string; tableComment: string | null }[] = [];
    try {
      const result = await client.query<{
        tableName: string;
        tableComment: string | null;
      }>(config, tableSql);
      tableRows = result.rows;
      this.deps.logger?.info(`Found ${tableRows.length} tables in database ${datasource.database}`);
    } catch (err) {
      this.deps.logger?.error(
        err instanceof Error ? err : new Error(String(err)),
        'Failed to query tables',
      );
      throw err;
    }

    const tableComments = new Map<string, string | null>();
    for (const row of tableRows) {
      tableComments.set(row.tableName, row.tableComment);
    }

    // 查询列信息
    const columnSql = `
      SELECT
        TABLE_NAME   AS tableName,
        COLUMN_NAME  AS columnName,
        DATA_TYPE    AS dataType,
        COLUMN_COMMENT AS columnComment,
        ORDINAL_POSITION AS ordinalPosition
      FROM information_schema.columns
      WHERE table_schema = '${escapedDbName}'
      ORDER BY TABLE_NAME, ORDINAL_POSITION;
    `;

    let columnRows: {
      tableName: string;
      columnName: string;
      dataType: string;
      columnComment: string | null;
      ordinalPosition: number;
    }[] = [];
    try {
      const result = await client.query<{
        tableName: string;
        columnName: string;
        dataType: string;
        columnComment: string | null;
        ordinalPosition: number;
      }>(config, columnSql);
      columnRows = result.rows;
      this.deps.logger?.info(
        `Found ${columnRows.length} columns in database ${datasource.database}`,
      );
    } catch (err) {
      this.deps.logger?.error(
        err instanceof Error ? err : new Error(String(err)),
        'Failed to query columns',
      );
      throw err;
    }

    const grouped = new Map<
      string,
      { tableName: string; tableComment?: string; columns: ColumnDefinition[] }
    >();

    for (const row of columnRows) {
      const entry =
        grouped.get(row.tableName) ??
        ({
          tableName: row.tableName,
          tableComment: tableComments.get(row.tableName) ?? undefined,
          columns: [],
        } as { tableName: string; tableComment?: string; columns: ColumnDefinition[] });
      entry.columns.push({
        name: row.columnName,
        type: row.dataType,
        comment: row.columnComment ?? undefined,
      });
      grouped.set(row.tableName, entry);
    }

    // 处理只有表没有列的情况（理论上不应该发生，但为了完整性）
    for (const [tableName, tableComment] of tableComments) {
      if (!grouped.has(tableName)) {
        grouped.set(tableName, {
          tableName,
          tableComment: tableComment ?? undefined,
          columns: [],
        });
      }
    }

    const tables = Array.from(grouped.values());
    this.deps.logger?.info(
      `Saving ${tables.length} tables to cache for datasource ${datasource.id}`,
    );

    try {
      await this.deps.schemaRepo.replaceSchemas(datasource.id, tables);
      // 验证保存是否成功
      const savedTables = await this.deps.schemaRepo.listTables(datasource.id);
      this.deps.logger?.info(
        `Successfully synced ${savedTables.length} tables for datasource ${datasource.id}`,
      );
      if (savedTables.length !== tables.length) {
        this.deps.logger?.warn(
          `Table count mismatch: expected ${tables.length}, got ${savedTables.length}`,
        );
      }
    } catch (err) {
      this.deps.logger?.error(
        err instanceof Error ? err : new Error(String(err)),
        'Failed to save schemas',
      );
      throw err;
    }

    const now = new Date();
    return now;
  }
}
