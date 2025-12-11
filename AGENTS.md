# Repository Guidelines

## Project Structure & Module Organization

- Monorepo managed by Turborepo. Top-level `apps/` (api, dashboard, cli) and `packages/` (core, db, ai, models, utils, config). Scripts and seeds live in `scripts/`.
- API (Fastify) in `apps/api`; routes, services under `src/app`, tests in `apps/api/tests`.
- Dashboard (Next.js) in `apps/dashboard`; UI components in `src/components`, pages in `src/app`. shadcn components are auto-added under `src/components/ui` via CLI.
- CLI in `apps/cli/src`. Shared logic in `packages/*`. Prisma schema and migrations in `packages/db/prisma`.

## Build, Test, and Development Commands

- `pnpm dev` (root): run all dev targets via Turborepo.
- `pnpm --filter @sparkline/api dev` / `...dashboard dev`: run API or dashboard only.
- `pnpm --filter @sparkline/api test` / `...core test`: Vitest unit/integration.
- `pnpm prisma:migrate:deploy` (root) applies Prisma migrations; `pnpm prisma:generate` regenerates client.
- Seed/demo DB: `mysql -uroot -p'123456' sparkline_demo < scripts/demo-seed.sql`.

## Coding Style & Naming Conventions

- TypeScript-first. Follow spec.md naming: kebab-case dirs, camelCase vars, PascalCase types.
- Formatting via Prettier (pre-commit), lint via ESLint. Respect shadcn UI tokens; prefer shadcn components added via `pnpm dlx shadcn@latest add <component>`. Avoid hand-rolled UI unless necessary.

## Testing Guidelines

- Vitest for `apps/api` and `packages/core`. Place specs under `tests/**` or `src/**/__tests__`.
- Prefer focused unit tests for services/planner/executor; add integration tests for routes. Run with `pnpm --filter <pkg> test`.

## Commit & Pull Request Guidelines

- Commit messages in imperative, scoped style seen in history (e.g., `feat: ...`, `fix(api): ...`, `chore(dashboard): ...`). One logical change per commit; avoid mixing formatting and features.
- PRs should include: summary of changes, testing evidence (commands run), screenshots for UI changes, and linked issue/requirement when applicable.

## UI & Component Policy

- Use shadcn components via CLI (list at https://ui.shadcn.com/llms.txt). Layouts should reference blocks (https://ui.shadcn.com/blocks); sidebar-02 is the baseline for dashboard shell.
- Keep `components.json` in sync; new components must be added through shadcn CLI so tailwind tokens stay consistent.

## Security & Configuration Tips

- Set `DATABASE_URL` for API to hit real MySQL; default falls back to in-memory stores (limited).
- Dashboard expects `NEXT_PUBLIC_API_URL`; CLI can override API with `--api`.
- Avoid committing secrets; use `.env` locally and never add it to git.
