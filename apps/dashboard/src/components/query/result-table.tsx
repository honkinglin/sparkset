'use client';

interface ResultTableProps {
  rows: Record<string, unknown>[];
}

export function ResultTable({ rows }: ResultTableProps) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center px-6">
        <p className="text-sm text-muted-foreground">查询成功但无数据返回</p>
      </div>
    );
  }

  const columns = Object.keys(rows[0] ?? {});

  return (
    <div className="border-t overflow-x-auto">
      <table className="text-sm table-auto">
        <thead className="bg-muted/50 border-b">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-border transition-colors ${
                idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
              } hover:bg-muted/50`}
            >
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-foreground whitespace-nowrap">
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
