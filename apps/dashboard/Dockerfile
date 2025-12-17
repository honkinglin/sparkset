# Dashboard Dockerfile - 多阶段构建
# 阶段 1: 依赖安装
FROM node:20-alpine AS deps

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /app

# 复制包管理文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/*/package.json ./packages/*/

# 安装所有依赖
RUN pnpm install --frozen-lockfile

# 阶段 2: 构建
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/dashboard/node_modules ./apps/dashboard/node_modules
COPY --from=deps /app/packages ./packages

# 复制源代码
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/dashboard ./apps/dashboard
COPY packages ./packages

# 设置构建时环境变量（Next.js 需要 NEXT_PUBLIC_* 在构建时注入）
ARG NEXT_PUBLIC_API_URL=http://localhost:3333
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 构建 Dashboard
RUN pnpm build --filter @sparkset/dashboard

# 阶段 3: 运行时
FROM node:20-alpine AS runtime

# 安装 pnpm 和 wget（用于健康检查）
RUN corepack enable && corepack prepare pnpm@9.12.2 --activate && \
    apk add --no-cache wget

WORKDIR /app

# 从构建阶段复制 package.json
COPY --from=builder /app/apps/dashboard/package.json ./

# 安装生产依赖（Next.js 需要）
RUN pnpm install --frozen-lockfile --prod --no-optional

# 从构建阶段复制构建产物
COPY --from=builder /app/apps/dashboard/.next ./.next
COPY --from=builder /app/apps/dashboard/public ./public
COPY --from=builder /app/apps/dashboard/next.config.mjs ./
COPY --from=builder /app/apps/dashboard/components.json ./

# 暴露端口
EXPOSE 3000

# 设置运行时环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 健康检查（检查根路径）
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# 启动 Next.js
CMD ["node_modules/.bin/next", "start"]
