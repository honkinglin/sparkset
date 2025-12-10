import { MySQLRepo } from './repository';
import { DataSource } from '@sparkline/models';

export interface DatasourceRepository {
  list(): Promise<DataSource[]>;
  create(input: Omit<DataSource, 'id' | 'lastSyncAt'>): Promise<DataSource>;
  update(input: Partial<DataSource> & { id: number }): Promise<DataSource>;
  remove(id: number): Promise<void>;
}

export class MySQLDatasourceRepository implements DatasourceRepository {
  constructor(private repo: MySQLRepo) {}

  async list(): Promise<DataSource[]> {
    const rows = await this.repo.query<DataSource>(
      'SELECT id, name, type, host, port, username, password, database_name AS database, last_sync_at AS lastSyncAt FROM datasources',
    );
    return rows;
  }

  async create(input: Omit<DataSource, 'id' | 'lastSyncAt'>): Promise<DataSource> {
    const sql =
      'INSERT INTO datasources (name, type, host, port, username, password, database_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [
      input.name,
      input.type,
      input.host,
      input.port,
      input.username,
      input.password,
      input.database,
    ];
    const result = await this.repo.query<{ insertId: number }>(sql, params);
    const id = (result as unknown as { insertId: number }).insertId;
    return { id, lastSyncAt: undefined, ...input };
  }

  async update(input: Partial<DataSource> & { id: number }): Promise<DataSource> {
    const existing = await this.repo.query<DataSource>(
      'SELECT id, name, type, host, port, username, password, database_name AS database, last_sync_at AS lastSyncAt FROM datasources WHERE id = ? LIMIT 1',
      [input.id],
    );
    if (!existing.length) throw new Error('Datasource not found');
    const merged = { ...existing[0], ...input } as DataSource;
    const sql =
      'UPDATE datasources SET name=?, type=?, host=?, port=?, username=?, password=?, database_name=?, last_sync_at=? WHERE id=?';
    await this.repo.query(sql, [
      merged.name,
      merged.type,
      merged.host,
      merged.port,
      merged.username,
      merged.password,
      merged.database,
      merged.lastSyncAt ?? null,
      merged.id,
    ]);
    return merged;
  }

  async remove(id: number): Promise<void> {
    await this.repo.query('DELETE FROM datasources WHERE id = ?', [id]);
  }
}
