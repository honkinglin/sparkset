# API Dockerfile - 多阶段构建
# 阶段 1: 依赖安装
FROM node:20-alpine AS deps

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# 安装所有依赖（包括 devDependencies，因为需要构建工具）
RUN pnpm install --frozen-lockfile

# 阶段 2: 构建
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages ./packages

# 复制源代码
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages

# 生成 Prisma Client
RUN pnpm --filter @sparkset/db prisma generate --schema packages/db/prisma/schema.prisma

# 构建所有包
RUN pnpm build --filter @sparkset/api...

# 阶段 3: 运行时
FROM node:20-alpine AS runtime

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /app

# 安装生产依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 从构建阶段复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages

# 复制 Prisma schema（运行时可能需要）
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma

# 设置工作目录为 API 目录
WORKDIR /app/apps/api

# 暴露端口
EXPOSE 3333

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "dist/index.js"]
