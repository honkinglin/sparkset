'use client';

import { FileText } from 'lucide-react';
import { useState } from 'react';
import { QueryResponse } from '../../lib/query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ResultTable } from './result-table';
import { SchemaDrawer } from './schema-drawer';
import { SqlViewer } from './sql-viewer';

interface QueryResultProps {
  result: QueryResponse;
  datasourceId?: number;
}

export function QueryResult({ result, datasourceId }: QueryResultProps) {
  const [sqlDrawerOpen, setSqlDrawerOpen] = useState(false);
  const [schemaDrawerOpen, setSchemaDrawerOpen] = useState(false);

  return (
    <Card className="overflow-hidden w-full max-w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              查询结果
            </CardTitle>
            <CardDescription>
              返回 {result.rows.length} 行数据
              {result.summary && ` · ${result.summary}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <SqlViewer sql={result.sql} open={sqlDrawerOpen} onOpenChange={setSqlDrawerOpen} />
            <SchemaDrawer
              datasourceId={datasourceId}
              open={schemaDrawerOpen}
              onOpenChange={setSchemaDrawerOpen}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ResultTable rows={result.rows} />
      </CardContent>
    </Card>
  );
}
