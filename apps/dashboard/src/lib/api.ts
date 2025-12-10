const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3333';

export interface DatasourceDTO {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number;
  username: string;
  database: string;
  lastSyncAt?: string;
}

export async function fetchDatasources(): Promise<DatasourceDTO[]> {
  const res = await fetch(`${API_BASE}/datasources`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.items ?? [];
}
