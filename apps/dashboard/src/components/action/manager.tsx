'use client';

import { Edit, Play, Plus, Trash2, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  type ActionDTO,
  type CreateActionInput,
  type UpdateActionInput,
  createAction,
  deleteAction,
  executeAction,
  updateAction,
} from '../../lib/api';
import { Alert, AlertDescription } from '../ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ExecuteDialog } from './execute-dialog';
import { ParameterEditor } from './parameter-editor';
import { ActionResult } from './result';
import type { ActionExecutionResponse } from './types';

const defaultForm: CreateActionInput = {
  name: '',
  description: '',
  type: 'sql',
  payload: { sql: '' },
  parameters: undefined,
  inputSchema: undefined,
};

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default function ActionManager({ initial }: { initial: ActionDTO[] }) {
  const [actions, setActions] = useState(initial);
  const [form, setForm] = useState<CreateActionInput>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [executingId, setExecutingId] = useState<number | null>(null);
  const [executionResult, setExecutionResult] = useState<unknown>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [payloadText, setPayloadText] = useState('');
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [pendingExecuteId, setPendingExecuteId] = useState<number | null>(null);

  // 当类型改变时，更新 payloadText
  useEffect(() => {
    if (dialogOpen) {
      setPayloadText(getPayloadForEdit(form.payload, form.type));
    }
  }, [form.type, dialogOpen]);

  const canSubmit = useMemo(() => {
    if (!form.name.trim() || !form.type) return false;
    if (form.type === 'sql') {
      const payload = form.payload as { sql?: string };
      return !!payload?.sql?.trim();
    }
    return true;
  }, [form]);

  const onChange =
    (key: keyof CreateActionInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value;
      setForm((prev: CreateActionInput) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handlePayloadChange = (value: string) => {
    setPayloadText(value);
    try {
      const parsed = JSON.parse(value);
      setForm((prev: CreateActionInput) => ({
        ...prev,
        payload: parsed,
      }));
    } catch {
      // JSON 解析失败时，保持 payloadText 状态，提交时会验证
    }
  };

  const handleOpenDialog = (action?: ActionDTO) => {
    if (action) {
      setEditingId(action.id);
      setForm({
        name: action.name,
        description: action.description || '',
        type: action.type,
        payload: action.payload as CreateActionInput['payload'],
        parameters: action.parameters as CreateActionInput['parameters'],
        inputSchema: action.inputSchema || undefined,
      });
      setPayloadText(getPayloadForEdit(action.payload, action.type));
    } else {
      setEditingId(null);
      setForm(defaultForm);
      setPayloadText(getPayloadForEdit(defaultForm.payload, defaultForm.type));
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
    setPayloadText(getPayloadForEdit(defaultForm.payload, defaultForm.type));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    // 验证 payload JSON
    try {
      JSON.parse(payloadText);
    } catch {
      toast.error('Payload 格式不正确，请输入有效的 JSON');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updateData: UpdateActionInput = {
          id: editingId,
          name: form.name,
          description: form.description || undefined,
          type: form.type,
          payload: form.payload,
          parameters: form.parameters,
          inputSchema: form.inputSchema,
        };
        const updated = await updateAction(updateData);
        setActions((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
        toast.success('Action 更新成功');
      } else {
        const created = await createAction(form);
        setActions((prev) => [...prev, created]);
        toast.success('Action 创建成功');
      }
      handleCloseDialog();
    } catch (err) {
      toast.error((err as Error)?.message ?? '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionId(deletingId);
    try {
      await deleteAction(deletingId);
      setActions((prev) => prev.filter((a) => a.id !== deletingId));
      toast.success('已删除');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error((err as Error)?.message ?? '删除失败');
    } finally {
      setActionId(null);
    }
  };

  const handleExecuteClick = (id: number) => {
    const action = actions.find((a) => a.id === id);
    if (action?.inputSchema && action.inputSchema.parameters.length > 0) {
      // 如果有参数定义，显示参数输入对话框
      setPendingExecuteId(id);
      setExecuteDialogOpen(true);
    } else {
      // 没有参数，直接执行
      void handleExecute(id);
    }
  };

  const handleExecute = async (id: number, parameters?: Record<string, unknown>) => {
    setExecutingId(id);
    setExecutionResult(null);
    setExecutionError(null);
    setExecuteDialogOpen(false);
    try {
      const res = await executeAction(id, parameters);
      setExecutionResult(res);
    } catch (err) {
      setExecutionError((err as Error)?.message ?? '执行失败');
    } finally {
      setExecutingId(null);
      setPendingExecuteId(null);
    }
  };

  const getPayloadDisplay = (payload: unknown, type: string): string => {
    if (type === 'sql') {
      const sqlPayload = payload as { sql?: string };
      return sqlPayload?.sql || '';
    }
    return JSON.stringify(payload, null, 2);
  };

  const getPayloadForEdit = (payload: unknown, type: string): string => {
    if (type === 'sql') {
      const sqlPayload = payload as { sql?: string };
      return JSON.stringify({ sql: sqlPayload?.sql || '' }, null, 2);
    }
    return JSON.stringify(payload, null, 2);
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">{actions.length}</span> 个 Action
            </span>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            新建 Action
          </Button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 text-muted-foreground font-medium">名称</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">类型</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">描述</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">最近更新</th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {actions.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={5}>
                    暂无 Action，请点击右上角"新建 Action"按钮创建。
                  </td>
                </tr>
              ) : (
                actions.map((action) => (
                  <tr key={action.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{action.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="uppercase text-xs">
                        {action.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{action.description || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(action.updatedAt || action.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={executingId === action.id}
                          onClick={() => handleExecuteClick(action.id)}
                        >
                          <Play
                            className={`mr-2 h-4 w-4 ${executingId === action.id ? 'animate-spin' : ''}`}
                          />
                          {executingId === action.id ? '执行中...' : '执行'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionId === action.id}
                          onClick={() => handleOpenDialog(action)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionId === action.id}
                          onClick={() => {
                            setDeletingId(action.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建/编辑对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑 Action' : '新建 Action'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改 Action 信息' : '填写以下信息以创建新的 Action'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">名称 *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="如：查询用户列表"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={onChange('description')}
                  placeholder="输入 Action 描述（可选）"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">类型 *</Label>
                <Select value={form.type} onValueChange={(value) => onChange('type')(value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sql">SQL</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payload">
                  Payload (JSON) *
                  {form.type === 'sql' && (
                    <span className="text-xs text-muted-foreground ml-2">
                      格式: {`{"sql": "SELECT * FROM table"}`}
                    </span>
                  )}
                </Label>
                <Textarea
                  id="payload"
                  value={payloadText}
                  onChange={(e) => handlePayloadChange(e.target.value)}
                  placeholder={
                    form.type === 'sql' ? '{"sql": "SELECT * FROM table"}' : '{"key": "value"}'
                  }
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid gap-2">
                <ParameterEditor
                  value={form.inputSchema}
                  onChange={(value) => setForm((prev) => ({ ...prev, inputSchema: value }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={submitting || !canSubmit}>
                {submitting ? '保存中...' : editingId ? '更新' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该 Action 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 执行参数输入对话框 */}
      {pendingExecuteId !== null && (
        <ExecuteDialog
          open={executeDialogOpen}
          onOpenChange={setExecuteDialogOpen}
          inputSchema={
            actions.find((a) => a.id === pendingExecuteId)?.inputSchema || {
              parameters: [],
            }
          }
          onExecute={(parameters) => {
            if (pendingExecuteId !== null) {
              void handleExecute(pendingExecuteId, parameters);
            }
          }}
          executing={executingId === pendingExecuteId}
        />
      )}

      {/* 执行结果 */}
      {(executionResult || executionError) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>执行结果</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setExecutionResult(null);
                  setExecutionError(null);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                清除
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {executionError ? (
              <Alert variant="destructive">
                <AlertDescription>{executionError}</AlertDescription>
              </Alert>
            ) : (
              <ActionResult
                actionType={
                  actions.find(
                    (a) => a.id === (executionResult as ActionExecutionResponse).actionId,
                  )?.type || 'unknown'
                }
                result={executionResult as ActionExecutionResponse}
              />
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
