import { FastifyReply } from 'fastify';
import { QueryService } from '../../services/queryService';
import { queryRequestSchema } from '../../validators/query';
import { TypedRequest } from '../types';

export class QueriesController {
  constructor(private service: QueryService) {}

  async run(req: TypedRequest, reply: FastifyReply) {
    try {
      const parsed = queryRequestSchema.parse(req.body);
      const result = await this.service.run(parsed);
      return reply.send(result);
    } catch (error) {
      req.log.error(error, 'Query execution error');
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({
          error: 'Validation error',
          message: error.message,
        });
      }

      // 检查是否是数据库表不存在的错误
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('不存在') || errorMessage.includes("doesn't exist")) {
        return reply.code(400).send({
          error: 'Database error',
          message:
            errorMessage +
            '。请确保数据源的 schema 已正确同步，并且 AI 生成的 SQL 只使用 schema 中存在的表。',
        });
      }

      return reply.code(500).send({
        error: 'Internal server error',
        message: errorMessage,
      });
    }
  }
}
