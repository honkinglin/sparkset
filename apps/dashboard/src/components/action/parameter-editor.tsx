'use client';

import { RiSubtractLine, RiAddLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { type ActionInputSchema, type ParameterDefinition } from '../../lib/api';
import { cn } from '../../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button, buttonVariants } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface ParameterEditorProps {
  value: ActionInputSchema | undefined;
  onChange: (value: ActionInputSchema | undefined) => void;
}

export function ParameterEditor({ value, onChange }: ParameterEditorProps) {
  const [parameters, setParameters] = useState<ParameterDefinition[]>(value?.parameters || []);

  // 同步外部 value 的变化
  useEffect(() => {
    setParameters(value?.parameters || []);
  }, [value]);

  const updateParameters = (newParams: ParameterDefinition[]) => {
    setParameters(newParams);
    if (newParams.length === 0) {
      onChange(undefined);
    } else {
      onChange({ parameters: newParams });
    }
  };

  const addParameter = () => {
    const newParam: ParameterDefinition = {
      name: `param${parameters.length + 1}`,
      type: 'string',
      required: false,
    };
    updateParameters([...parameters, newParam]);
  };

  const removeParameter = (index: number) => {
    updateParameters(parameters.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, updates: Partial<ParameterDefinition>) => {
    const newParams = [...parameters];
    newParams[index] = { ...newParams[index], ...updates };
    updateParameters(newParams);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>输入参数定义</Label>
        <Button type="button" variant="outline" size="sm" onClick={addParameter}>
          <RiAddLine className="mr-2 h-4 w-4" />
          添加参数
        </Button>
      </div>

      {parameters.length === 0 ? (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          暂无参数定义。如果 Action 需要输入参数，请点击"添加参数"按钮。
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
          {parameters.map((param, index) => (
            <AccordionItem key={index} value={`param-${index}`} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {param.label || param.name || `参数 #${index + 1}`}
                    </span>
                    <span className="text-xs text-muted-foreground">({param.type})</span>
                    {param.required && <span className="text-xs text-destructive">*</span>}
                  </div>
                  <div
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      'h-6 w-6 p-0 cursor-pointer',
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeParameter(index);
                    }}
                  >
                    <RiSubtractLine className="h-3 w-3" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pb-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`param-name-${index}`} className="text-xs">
                        参数名称 *
                      </Label>
                      <Input
                        id={`param-name-${index}`}
                        value={param.name}
                        onChange={(e) => updateParameter(index, { name: e.target.value })}
                        placeholder="如：limit"
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`param-type-${index}`} className="text-xs">
                        类型 *
                      </Label>
                      <Select
                        value={param.type}
                        onValueChange={(value) =>
                          updateParameter(index, {
                            type: value as 'string' | 'number' | 'boolean',
                          })
                        }
                      >
                        <SelectTrigger id={`param-type-${index}`} className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`param-label-${index}`} className="text-xs">
                      显示标签
                    </Label>
                    <Input
                      id={`param-label-${index}`}
                      value={param.label || ''}
                      onChange={(e) =>
                        updateParameter(index, { label: e.target.value || undefined })
                      }
                      placeholder="如：数量限制（可选，默认使用参数名称）"
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`param-description-${index}`} className="text-xs">
                      描述
                    </Label>
                    <Textarea
                      id={`param-description-${index}`}
                      value={param.description || ''}
                      onChange={(e) =>
                        updateParameter(index, { description: e.target.value || undefined })
                      }
                      placeholder="参数说明（可选）"
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`param-default-${index}`} className="text-xs">
                        默认值
                      </Label>
                      {param.type === 'boolean' ? (
                        <Select
                          value={param.default === undefined ? '' : String(param.default)}
                          onValueChange={(value) =>
                            updateParameter(index, {
                              default: value === '' ? undefined : value === 'true',
                            })
                          }
                        >
                          <SelectTrigger id={`param-default-${index}`} className="h-8">
                            <SelectValue placeholder="无默认值" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">无默认值</SelectItem>
                            <SelectItem value="true">true</SelectItem>
                            <SelectItem value="false">false</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={`param-default-${index}`}
                          type={param.type === 'number' ? 'number' : 'text'}
                          value={param.default === undefined ? '' : String(param.default)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              updateParameter(index, { default: undefined });
                            } else if (param.type === 'number') {
                              updateParameter(index, { default: Number(value) });
                            } else {
                              updateParameter(index, { default: value });
                            }
                          }}
                          placeholder="默认值（可选）"
                          className="h-8"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">必填</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id={`param-required-${index}`}
                          checked={param.required || false}
                          onCheckedChange={(checked) =>
                            updateParameter(index, { required: Boolean(checked) })
                          }
                        />
                        <label
                          htmlFor={`param-required-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          此参数为必填项
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
