import { FastifyReply } from 'fastify';
import { AIProviderService } from '../../services/aiProviderService';
import {
  aiProviderCreateSchema,
  aiProviderUpdateSchema,
  setDefaultSchema,
} from '../../validators/aiProvider';
import { TypedRequest } from '../types';

export class AIProvidersController {
  constructor(private service: AIProviderService) {}

  async index(_req: TypedRequest, reply: FastifyReply) {
    const items = await this.service.list();
    return reply.send({ items });
  }

  async store(req: TypedRequest, reply: FastifyReply) {
    const parsed = aiProviderCreateSchema.parse(req.body);
    const record = await this.service.create(parsed);
    return reply.code(201).send(record);
  }

  async update(req: TypedRequest, reply: FastifyReply) {
    const parsed = aiProviderUpdateSchema.parse({ ...req.body, ...req.params });
    const record = await this.service.update(parsed);
    return reply.send(record);
  }

  async destroy(req: TypedRequest, reply: FastifyReply) {
    const id = Number((req.params as { id: string }).id);
    await this.service.remove(id);
    return reply.code(204).send();
  }

  async setDefault(req: TypedRequest, reply: FastifyReply) {
    const parsed = setDefaultSchema.parse(req.params);
    await this.service.setDefault(parsed.id);
    return reply.send({ success: true });
  }
}
