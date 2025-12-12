'use client';

import { CodeViewer } from '../code-viewer';
import { Badge } from '../ui/badge';
import type { ApiActionResult } from './types';

interface ApiResultProps {
  result: ApiActionResult;
}

function getStatusBadgeVariant(
  statusCode: number,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (statusCode >= 200 && statusCode < 300) return 'default'; // success
  if (statusCode >= 400 && statusCode < 500) return 'secondary'; // warning
  if (statusCode >= 500) return 'destructive'; // error
  return 'outline';
}

export function ApiResult({ result }: ApiResultProps) {
  const badgeVariant = getStatusBadgeVariant(result.statusCode);
  const bodyString =
    typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">HTTP 响应</h3>
        <p className="text-sm text-muted-foreground">
          状态码: <Badge variant={badgeVariant}>{result.statusCode}</Badge>
          {result.duration && ` · 耗时: ${result.duration}ms`}
        </p>
      </div>
      {result.headers && (
        <div>
          <h4 className="text-sm font-semibold mb-2">响应头</h4>
          <CodeViewer code={JSON.stringify(result.headers, null, 2)} language="json" />
        </div>
      )}
      <div>
        <h4 className="text-sm font-semibold mb-2">响应体</h4>
        <CodeViewer code={bodyString} language="json" />
      </div>
    </div>
  );
}
