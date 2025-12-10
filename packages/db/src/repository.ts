import { DataSourceConfig } from './index';
import mysql, { Pool } from 'mysql2/promise';

export interface DatasourceRow {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database_name: string;
  last_sync_at?: Date | null;
}

export class MySQLRepo {
  private pool: Pool;

  constructor(config: DataSourceConfig) {
    this.pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }

  async close() {
    await this.pool.end();
  }
}
