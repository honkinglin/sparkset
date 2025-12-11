'use client';

import { AlertCircle, CheckCircle2, Play, X } from 'lucide-react';
import { useState } from 'react';
import { ActionDTO, executeAction } from '../lib/api';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  actions: ActionDTO[];
}

export default function ActionTable({ actions }: Props) {
  const [runningId, setRunningId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resultPreview, setResultPreview] = useState<unknown>(null);

  const handleExecute = async (id: number) => {
    setRunningId(id);
    setMessage(null);
    setResultPreview(null);
    try {
      const res = await executeAction(id);
      setResultPreview(res);
      setMessage('执行成功');
    } catch (err) {
      setMessage((err as Error)?.message ?? '执行失败');
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>模板列表</CardTitle>
          <CardDescription>已保存的动作模板，支持一键执行</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.includes('成功') ? 'default' : 'destructive'} className="mb-4">
              {message.includes('成功') ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{message.includes('成功') ? '成功' : '错误'}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {actions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              暂无模板，可通过 API/CLI 创建。
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">名称</th>
                      <th className="px-4 py-3 text-left font-medium">类型</th>
                      <th className="px-4 py-3 text-left font-medium">描述</th>
                      <th className="px-4 py-3 text-left font-medium">最近更新</th>
                      <th className="px-4 py-3 text-right font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((action) => (
                      <tr
                        key={action.id}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{action.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="uppercase text-xs">
                            {action.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {action.description ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {action.updatedAt ?? action.createdAt ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={runningId === action.id}
                            onClick={() => handleExecute(action.id)}
                          >
                            <Play
                              className={`mr-2 h-4 w-4 ${runningId === action.id ? 'animate-spin' : ''}`}
                            />
                            {runningId === action.id ? '执行中...' : '执行'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {resultPreview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>执行结果</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setResultPreview(null)}>
                <X className="mr-2 h-4 w-4" />
                清除
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto">
              <code>{JSON.stringify(resultPreview, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
