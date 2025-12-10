import Link from 'next/link';
import { runQuery } from '../../lib/query';
import { fetchDatasources } from '../../lib/api';
import { Button } from '../../components/ui/button';
import QueryForm from './queryForm';

const QueryPage = async () => {
  const datasources = await fetchDatasources().catch(() => []);
  const firstDsId = datasources[0]?.id;

  let result: Awaited<ReturnType<typeof runQuery>> | null = null;
  if (firstDsId) {
    try {
      result = await runQuery({ question: '查询订单列表', datasource: firstDsId, limit: 5 });
    } catch (err) {
      console.warn('query failed', err);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300">Sparkline AI 运营助手</p>
          <h1 className="text-3xl font-semibold tracking-tight">查询工作台（实时）</h1>
        </div>
        <Button variant="ghost" size="sm">
          刷新
        </Button>
      </header>

      {result ? (
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs text-slate-400 mb-2">SQL</p>
            <pre className="text-sm whitespace-pre-wrap text-slate-100/90">{result.sql}</pre>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-400">结果</p>
                <h2 className="text-lg font-semibold">返回 {result.rows.length} 行</h2>
              </div>
              <Button size="sm" variant="ghost">
                导出 CSV
              </Button>
            </div>
            <div className="overflow-auto border border-white/10 rounded-xl">
              <table className="table w-full text-sm">
                <thead className="bg-white/5 text-left">
                  <tr>
                    {Object.keys(result.rows[0] ?? { 示例列: 'value' }).map((col) => (
                      <th key={col} className="px-4 py-2 capitalize">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      {Object.keys(result.rows[0] ?? {}).map((col) => (
                        <td key={col} className="px-4 py-3 text-slate-100/90">
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-5 text-slate-400 space-y-3">
          <div>未获取到数据，请确认 API 运行并至少存在一个数据源。</div>
          <Link href="/" className="text-brand-400 hover:underline text-sm">
            前往数据源页查看
          </Link>
        </div>
      )}
    </div>
  );
};

export default QueryPage;
