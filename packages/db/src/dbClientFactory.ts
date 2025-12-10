import { PrismaClient } from '@prisma/client';
import { DataSourceConfig, DBClient, QueryResult } from './index';
import mysql from 'mysql2/promise';

class MySQLDBClient implements DBClient {
  async testConnection(config: DataSourceConfig): Promise<boolean> {
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    await conn.end();
    return true;
  }

  async query<T = unknown>(config: DataSourceConfig, sql: string): Promise<QueryResult<T>> {
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
    });
    const [rows] = await conn.query(sql);
    await conn.end();
    return { rows: rows as T[] };
  }
}

class PrismaDBClient implements DBClient {
  constructor(private prisma: PrismaClient) {}

  async testConnection(): Promise<boolean> {
    await this.prisma.$queryRaw`SELECT 1`;
    return true;
  }

  async query<T = unknown>(_config: DataSourceConfig, sql: string): Promise<QueryResult<T>> {
    // Prisma does not expose raw connections easily per datasource; for now use $queryRawUnsafe
    const rows = (await this.prisma.$queryRawUnsafe(sql)) as T[];
    return { rows };
  }
}

export const createDBClient = (config: DataSourceConfig, prisma?: PrismaClient): DBClient => {
  if (prisma) return new PrismaDBClient(prisma);
  if (config.type === 'mysql') return new MySQLDBClient();
  // default: mysql client
  return new MySQLDBClient();
};
