import { FastifyReply } from 'fastify';
import { QueryService } from '../../services/queryService';
import { queryRequestSchema } from '../../validators/query';
import { TypedRequest } from '../types';

export class QueriesController {
  constructor(private service: QueryService) {}

  async run(req: TypedRequest, reply: FastifyReply) {
    const parsed = queryRequestSchema.parse(req.body);
    const result = await this.service.run(parsed);
    return reply.send(result);
  }
}
