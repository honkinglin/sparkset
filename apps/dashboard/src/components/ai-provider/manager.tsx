'use client';

import { Check, ChevronDown, Edit, Plus, Star, Trash2 } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AI_PROVIDER_TYPES, getProviderLabel } from '../../lib/aiProviderTypes';
import {
  type AIProviderDTO,
  type CreateAIProviderInput,
  createAIProvider,
  removeAIProvider,
  setDefaultAIProvider,
  updateAIProvider,
} from '../../lib/api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const defaultForm: CreateAIProviderInput = {
  name: '',
  type: 'openai',
  apiKey: '',
  baseURL: '',
  defaultModel: '',
  isDefault: false,
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export default function AIProviderManager({ initial }: { initial: AIProviderDTO[] }) {
  const [providers, setProviders] = useState(initial);
  const [form, setForm] = useState<CreateAIProviderInput>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [providerSelectOpen, setProviderSelectOpen] = useState(false);

  const canSubmit = useMemo(() => {
    // 创建时需要 API Key，编辑时不需要（如果不修改则保留原值）
    if (editingId) {
      return form.name && form.type;
    }
    return form.name && form.type && form.apiKey;
  }, [form, editingId]);

  const onChange =
    (key: keyof CreateAIProviderInput) => (e: ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof e === 'string' ? e : e.target.value;
      setForm((prev: CreateAIProviderInput) => ({
        ...prev,
        [key]: value,
      }));
    };

  const handleOpenDialog = (provider?: AIProviderDTO) => {
    if (provider) {
      setEditingId(provider.id);
      setForm({
        name: provider.name,
        type: provider.type,
        apiKey: '', // 编辑时不显示原有 API Key，需要重新输入
        baseURL: provider.baseURL ?? '',
        defaultModel: provider.defaultModel ?? '',
        isDefault: provider.isDefault,
      });
    } else {
      setEditingId(null);
      setForm(defaultForm);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      if (editingId) {
        // 编辑时，如果 API Key 为空，则不包含在更新数据中
        const updateData = { ...form };
        if (!updateData.apiKey) {
          delete updateData.apiKey;
        }
        const updated = await updateAIProvider(editingId, updateData);
        setProviders((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        toast.success('Provider 更新成功');
      } else {
        const created = await createAIProvider(form);
        setProviders((prev) => [...prev, created]);
        toast.success('Provider 创建成功');
      }
      handleCloseDialog();
    } catch (err) {
      toast.error((err as Error)?.message ?? '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    setActionId(id);
    try {
      await setDefaultAIProvider(id);
      setProviders((prev) =>
        prev.map((p) => ({
          ...p,
          isDefault: p.id === id,
        })),
      );
      toast.success('默认 Provider 设置成功');
    } catch (err) {
      toast.error((err as Error)?.message ?? '设置失败');
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (id: number) => {
    if (!globalThis.confirm('确定要删除该 Provider 吗？')) return;
    setActionId(id);
    try {
      await removeAIProvider(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
      toast.success('已删除');
    } catch (err) {
      toast.error((err as Error)?.message ?? '删除失败');
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              共 <span className="font-medium text-foreground">{providers.length}</span> 个 Provider
            </span>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            添加 Provider
          </Button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 text-muted-foreground font-medium">名称</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">类型</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">默认模型</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">状态</th>
                <th className="px-4 py-3 text-muted-foreground font-medium">更新时间</th>
                <th className="px-4 py-3 text-right text-muted-foreground font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={6}>
                    暂无 Provider，请点击右上角"添加 Provider"按钮创建。
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{provider.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {getProviderLabel(provider.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {provider.defaultModel || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {provider.isDefault ? (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          默认
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Check className="h-3 w-3" />
                          已配置
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(provider.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!provider.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionId === provider.id}
                            onClick={() => handleSetDefault(provider.id)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            设为默认
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionId === provider.id}
                          onClick={() => handleOpenDialog(provider)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionId === provider.id}
                          onClick={() => handleRemove(provider.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? '编辑 Provider' : '添加 Provider'}</DialogTitle>
            <DialogDescription>
              {editingId ? '修改 Provider 配置信息' : '填写以下信息以配置新的 AI Provider'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="如 my-openai"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Provider 类型</Label>
                <Popover open={providerSelectOpen} onOpenChange={setProviderSelectOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={providerSelectOpen}
                      className="h-auto min-h-9 w-full justify-between py-2 px-3 text-left font-normal"
                      id="type"
                    >
                      {form.type ? (
                        <div className="flex flex-col items-start gap-0.5 text-left w-full flex-1">
                          <span className="text-sm font-medium leading-tight">
                            {getProviderLabel(form.type)}
                          </span>
                          {AI_PROVIDER_TYPES.find((p) => p.value === form.type)?.description && (
                            <span className="text-xs text-muted-foreground leading-tight">
                              {AI_PROVIDER_TYPES.find((p) => p.value === form.type)?.description}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">选择 Provider 类型</span>
                      )}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="搜索 Provider..." />
                      <CommandList>
                        <CommandEmpty>未找到匹配的 Provider</CommandEmpty>
                        <CommandGroup>
                          {AI_PROVIDER_TYPES.map((providerType) => (
                            <CommandItem
                              key={providerType.value}
                              value={`${providerType.value} ${providerType.label} ${providerType.description || ''}`}
                              onSelect={() => {
                                onChange('type')(providerType.value);
                                setProviderSelectOpen(false);
                              }}
                              className="py-2.5"
                            >
                              <div className="flex flex-col items-start gap-0.5 w-full flex-1">
                                <span className="text-sm font-medium leading-tight">
                                  {providerType.label}
                                </span>
                                {providerType.description && (
                                  <span className="text-xs text-muted-foreground leading-tight">
                                    {providerType.description}
                                  </span>
                                )}
                              </div>
                              {form.type === providerType.value && (
                                <Check className="ml-auto h-4 w-4 shrink-0" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">
                  API Key{' '}
                  {editingId && <span className="text-muted-foreground">(留空则不修改)</span>}
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={form.apiKey}
                  onChange={onChange('apiKey')}
                  placeholder={editingId ? '留空则不修改' : 'sk-...'}
                  required={!editingId}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseURL">Base URL (可选)</Label>
                <Input
                  id="baseURL"
                  value={form.baseURL}
                  onChange={onChange('baseURL')}
                  placeholder="https://api.openai.com/v1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="defaultModel">默认模型 (可选)</Label>
                <Input
                  id="defaultModel"
                  value={form.defaultModel}
                  onChange={onChange('defaultModel')}
                  placeholder="gpt-4o-mini"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                取消
              </Button>
              <Button type="submit" disabled={!canSubmit || submitting}>
                {submitting ? '提交中...' : editingId ? '更新' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
