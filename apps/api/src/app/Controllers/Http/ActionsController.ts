import { ActionExecutor } from '@sparkline/core';
import { FastifyReply } from 'fastify';
import { ActionService } from '../../services/actionService';
import { actionCreateSchema, actionUpdateSchema } from '../../validators/action';
import { TypedRequest } from '../types';

export class ActionsController {
  constructor(
    private service: ActionService,
    private actionExecutor?: ActionExecutor,
  ) {}

  async index(_req: TypedRequest, reply: FastifyReply) {
    const items = await this.service.list();
    return reply.send({ items });
  }

  async show(req: TypedRequest, reply: FastifyReply) {
    const id = Number((req.params as { id: string }).id);
    const item = await this.service.get(id);
    if (!item) return reply.code(404).send({ message: 'Action not found' });
    return reply.send(item);
  }

  async store(req: TypedRequest, reply: FastifyReply) {
    const parsed = actionCreateSchema.parse(req.body);
    const item = await this.service.create(parsed);
    return reply.code(201).send(item);
  }

  async update(req: TypedRequest, reply: FastifyReply) {
    const parsed = actionUpdateSchema.parse({ ...req.body, ...req.params });
    const item = await this.service.update(parsed);
    return reply.send(item);
  }

  async destroy(req: TypedRequest, reply: FastifyReply) {
    const id = Number((req.params as { id: string }).id);
    await this.service.remove(id);
    return reply.code(204).send();
  }

  async execute(req: TypedRequest, reply: FastifyReply) {
    const id = Number((req.params as { id: string }).id);
    const item = await this.service.get(id);
    if (!item) return reply.code(404).send({ message: 'Action not found' });
    if (!this.actionExecutor)
      return reply.send({ message: 'Action executed (stub)', action: item });

    // 从请求体中获取 parameters，如果没有则使用 Action 中存储的 parameters
    const requestParameters = (req.body as { parameters?: unknown })?.parameters;
    const parameters = requestParameters !== undefined ? requestParameters : item.parameters;

    const result = await this.actionExecutor.run({
      id: item.id,
      type: item.type,
      payload: item.payload,
      parameters,
    });
    if (!result.success) {
      return reply.code(400).send({ message: result.error?.message ?? 'Execution failed' });
    }
    return reply.send({ actionId: item.id, result: result.data });
  }
}
