'use client';

import { ArrowLeft, Edit2, RefreshCw, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  type DatasourceDetailDTO,
  type TableColumnDTO,
  type TableSchemaDTO,
  fetchDatasourceDetail,
  syncDatasource,
  updateColumnMetadata,
  updateTableMetadata,
} from '../../lib/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

interface EditingTableState {
  tableId: number;
  tableComment: string;
  semanticDescription: string;
}

interface EditingColumnState {
  columnId: number;
  columnComment: string;
  semanticDescription: string;
}

export default function DatasourceDetail({ initial }: { initial: DatasourceDetailDTO }) {
  const [datasource, setDatasource] = useState(initial);
  const [editingTable, setEditingTable] = useState<EditingTableState | null>(null);
  const [editingColumn, setEditingColumn] = useState<EditingColumnState | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEditTable = (table: TableSchemaDTO) => {
    setEditingTable({
      tableId: table.id,
      tableComment: table.tableComment ?? '',
      semanticDescription: table.semanticDescription ?? '',
    });
  };

  const handleSaveTable = async () => {
    if (!editingTable) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateTableMetadata(datasource.id, editingTable.tableId, {
        tableComment: editingTable.tableComment || null,
        semanticDescription: editingTable.semanticDescription || null,
      });
      setDatasource((prev) => ({
        ...prev,
        tables: prev.tables.map((t) =>
          t.id === editingTable.tableId
            ? {
                ...t,
                tableComment: editingTable.tableComment || undefined,
                semanticDescription: editingTable.semanticDescription || undefined,
              }
            : t,
        ),
      }));
      setEditingTable(null);
      setMessage('保存成功');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage((err as Error)?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelTable = () => {
    setEditingTable(null);
  };

  const handleEditColumn = (tableId: number, column: TableColumnDTO) => {
    if (!column.id) return;
    setEditingColumn({
      columnId: column.id,
      columnComment: column.comment ?? '',
      semanticDescription: column.semanticDescription ?? '',
    });
  };

  const handleSaveColumn = async () => {
    if (!editingColumn) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateColumnMetadata(datasource.id, editingColumn.columnId, {
        columnComment: editingColumn.columnComment || null,
        semanticDescription: editingColumn.semanticDescription || null,
      });
      setDatasource((prev) => ({
        ...prev,
        tables: prev.tables.map((t) => ({
          ...t,
          columns: t.columns.map((c) =>
            c.id === editingColumn.columnId
              ? {
                  ...c,
                  comment: editingColumn.columnComment || undefined,
                  semanticDescription: editingColumn.semanticDescription || undefined,
                }
              : c,
          ),
        })),
      }));
      setEditingColumn(null);
      setMessage('保存成功');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage((err as Error)?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelColumn = () => {
    setEditingColumn(null);
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await syncDatasource(datasource.id);
      // 重新获取详情数据以更新表结构
      const updated = await fetchDatasourceDetail(datasource.id);
      setDatasource(updated);
      toast.success('同步成功');
    } catch (err) {
      toast.error((err as Error)?.message ?? '同步失败');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>数据源信息</CardTitle>
              <CardDescription>数据源的基础连接信息</CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? '同步中...' : '同步'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">名称</Label>
              <p className="text-sm font-medium">{datasource.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">类型</Label>
              <p className="text-sm font-medium uppercase">{datasource.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Host</Label>
              <p className="text-sm font-medium">{`${datasource.host}:${datasource.port}`}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">数据库</Label>
              <p className="text-sm font-medium">{datasource.database}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">用户名</Label>
              <p className="text-sm font-medium">{datasource.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">最近同步</Label>
              <p className="text-sm font-medium text-muted-foreground">
                {formatDate(datasource.lastSyncAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>结构信息</CardTitle>
          <CardDescription>
            共 {datasource.tables.length} 个表，可编辑表注释和语义描述以帮助 AI 更好地理解数据结构
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`mb-4 rounded-md p-3 text-sm ${
                message.includes('成功')
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {message}
            </div>
          )}

          {datasource.tables.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              暂无结构信息，请先同步数据源
            </p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {datasource.tables.map((table) => (
                <AccordionItem key={table.id} value={`table-${table.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-1 items-center justify-between pr-4">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{table.tableName}</span>
                        {table.tableComment && (
                          <span className="text-xs text-muted-foreground">
                            {table.tableComment}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTable(table);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {editingTable?.tableId === table.id ? (
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`table-comment-${table.id}`}>表注释</Label>
                                <Input
                                  id={`table-comment-${table.id}`}
                                  value={editingTable.tableComment}
                                  onChange={(e) =>
                                    setEditingTable({
                                      ...editingTable,
                                      tableComment: e.target.value,
                                    })
                                  }
                                  placeholder="数据库表注释"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`table-semantic-${table.id}`}>语义描述</Label>
                                <Textarea
                                  id={`table-semantic-${table.id}`}
                                  value={editingTable.semanticDescription}
                                  onChange={(e) =>
                                    setEditingTable({
                                      ...editingTable,
                                      semanticDescription: e.target.value,
                                    })
                                  }
                                  placeholder="用于 AI 理解表的业务含义和用途"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveTable} disabled={saving}>
                                  <Save className="mr-2 h-4 w-4" />
                                  保存
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelTable}
                                  disabled={saving}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  取消
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-2">
                          {table.tableComment && (
                            <div>
                              <Label className="text-xs text-muted-foreground">表注释</Label>
                              <p className="text-sm">{table.tableComment}</p>
                            </div>
                          )}
                          {table.semanticDescription && (
                            <div>
                              <Label className="text-xs text-muted-foreground">语义描述</Label>
                              <p className="text-sm">{table.semanticDescription}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <Separator />

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium">列信息</Label>
                          <span className="text-xs text-muted-foreground">
                            {table.columns.length} 列
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-3 py-2 text-left text-muted-foreground">列名</th>
                                <th className="px-3 py-2 text-left text-muted-foreground">类型</th>
                                <th className="px-3 py-2 text-left text-muted-foreground">注释</th>
                                <th className="px-3 py-2 text-left text-muted-foreground">
                                  语义描述
                                </th>
                                <th className="px-3 py-2 text-right text-muted-foreground">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.columns.map((column) => (
                                <tr key={column.name} className="border-t">
                                  <td className="px-3 py-2 font-medium">{column.name}</td>
                                  <td className="px-3 py-2 text-muted-foreground">{column.type}</td>
                                  <td className="px-3 py-2">
                                    {editingColumn?.columnId === column.id ? (
                                      <Input
                                        value={editingColumn.columnComment}
                                        onChange={(e) =>
                                          setEditingColumn({
                                            ...editingColumn,
                                            columnComment: e.target.value,
                                          })
                                        }
                                        placeholder="列注释"
                                        className="h-8"
                                      />
                                    ) : (
                                      <span className="text-muted-foreground">
                                        {column.comment || '-'}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    {editingColumn?.columnId === column.id ? (
                                      <Textarea
                                        value={editingColumn.semanticDescription}
                                        onChange={(e) =>
                                          setEditingColumn({
                                            ...editingColumn,
                                            semanticDescription: e.target.value,
                                          })
                                        }
                                        placeholder="语义描述"
                                        rows={2}
                                        className="min-w-[200px]"
                                      />
                                    ) : (
                                      <span className="text-muted-foreground">
                                        {column.semanticDescription || '-'}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {editingColumn?.columnId === column.id ? (
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleSaveColumn}
                                          disabled={saving}
                                        >
                                          <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={handleCancelColumn}
                                          disabled={saving}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditColumn(table.id, column)}
                                        disabled={!column.id || editingColumn !== null}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
