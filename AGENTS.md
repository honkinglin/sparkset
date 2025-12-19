# 开发指南

## 严格禁止的操作

### Git 操作限制

- **绝对禁止执行 git reset、git revert、git rebase、git restore 等回滚工作的命令**
- **只允许使用 git logs、git status、git diff 等安全操作来对比文件变化以及恢复文件内容**
- **禁止删除或修改 .git 目录**
- **任何 git 操作前必须得到用户明确许可**

### 文件系统操作限制

- **绝对禁止执行 rm -rf 命令**
- **禁止删除目录，特别是项目根目录或重要目录**
- **删除文件前必须明确告知用户并得到许可**

## 沟通语言

**重要**：请使用与用户相同的语言进行所有沟通和交流。包括：

- 所有对话和回复
- 代码注释（除非项目规范要求英文）
- 文档说明
- 错误提示和解释
- 任务计划和总结

## 理念

### 核心信念

- **渐进式进展优于大爆炸式改动** - 小改动，保证能编译通过并测试通过
- **从现有代码中学习** - 实施前先研究和规划
- **务实优于教条** - 适应项目实际情况
- **清晰的意图优于聪明的代码** - 保持无聊和明显

### 简单意味着

- 每个函数/类单一职责
- 避免过早抽象
- 不要耍小聪明 - 选择无聊的解决方案
- 如果需要解释，那就太复杂了

## 流程

### 1. 规划与分阶段

将复杂工作分解为 3-5 个阶段。记录在 `IMPLEMENTATION_PLAN.md` 中：

```markdown
## 阶段 N: [名称]

**目标**: [具体交付物]
**成功标准**: [可测试的结果]
**测试**: [具体测试用例]
**状态**: [未开始|进行中|已完成]
```

- 进展时更新状态
- 所有阶段完成后删除文件

### 2. 实施流程

1. **理解** - 研究代码库中的现有模式
2. **测试** - 先写测试（红灯）
3. **实现** - 最少代码通过测试（绿灯）
4. **重构** - 在测试通过的情况下清理代码
5. **验证** - 确保编译通过且测试运行
6. **更新 TODO** - 标记已完成的任务并总结成就
7. **提交** - 使用清晰的消息链接到计划

**关键**: 代码编译成功后，始终要：

- 更新 TODO 列表标记已完成任务
- 添加完成内容的总结
- 规划下一步（如适用）
- 永远不要让 TODO 列表过时或停滞

### 3. 遇到困难时（尝试 3 次后）

**关键**: 每个问题最多尝试 3 次，然后停止。

1. **记录失败内容**：
   - 你尝试了什么
   - 具体的错误消息
   - 你认为失败的原因

2. **研究替代方案**：
   - 找到 2-3 个类似的实现
   - 记录使用的不同方法

3. **质疑根本问题**：
   - 这是正确的抽象级别吗？
   - 可以分解成更小的问题吗？
   - 有完全更简单的方法吗？

4. **尝试不同角度**：
   - 不同的库/框架功能？
   - 不同的架构模式？
   - 删除抽象而不是增加？

## 技术标准

### 架构原则

- **组合优于继承** - 使用依赖注入
- **接口优于单例** - 实现可测试性和灵活性
- **显式优于隐式** - 清晰的数据流和依赖
- **尽可能测试驱动** - 永不禁用测试，修复它们

### 代码质量

- **每次提交必须**：
  - 成功编译
  - 通过所有现有测试
  - 为新功能包含测试
  - 遵循项目格式化/代码检查规则

- **提交前**：
  - 运行格式化器/代码检查器
  - 自我审查更改
  - 确保提交消息解释"为什么"

### 错误处理

- 快速失败并提供描述性消息
- 包含调试上下文
- 在适当级别处理错误
- 永远不要默默吞掉异常

### 编译错误处理

**基本原则**：永远不要删除代码来绕过编译错误。修复根本原因。

遇到编译错误时：

1. **永远不要这样做**：
   - 删除有问题的方法/代码
   - 注释掉错误行
   - 使用占位符实现（TODO，抛出 NotImplemented）
   - 修改业务逻辑以匹配错误假设

2. **始终这样做**：
   - 理解错误发生的原因
   - 研究实际的数据模型/API
   - 修复你的代码以匹配现实，而不是相反
   - 如果属性不存在，找出：
     - 正确的属性名是什么？
     - 应该向模型添加此属性吗？
     - 有替代方法吗？

3. **错误解决流程**：

   ```
   错误发生 → 理解根本原因 → 研究正确解决方案 → 修复实际问题
   ```

   而不是：

   ```
   错误发生 → 删除有问题的代码 → 编译通过 ❌
   ```

4. **常见陷阱和解决方案**：
   - **属性名称不匹配**：研究实际模型，使用正确名称
   - **缺少功能**：基于实际能力实现，而不是假设
   - **类型不兼容**：理解类型，正确转换
   - **缺少依赖**：添加所需的导入/包

5. **质量优于速度**：
   - 工作的部分实现 > 破损的完整实现
   - 正确的实现 > 快速编译
   - 理解问题 > 绕过问题

**记住**：删除错误代码是在逃避问题，而不是解决问题。每个错误都是更好理解系统的机会。

## 决策框架

当存在多个有效方法时，基于以下选择：

1. **可测试性** - 我能轻松测试这个吗？
2. **可读性** - 6 个月后有人能理解这个吗？
3. **一致性** - 这与项目模式匹配吗？
4. **简单性** - 这是最简单的可行解决方案吗？
5. **可逆性** - 以后改变有多难？

## 项目集成

### 学习代码库

- 找到 3 个类似的功能/组件
- 识别常见模式和约定
- 尽可能使用相同的库/工具
- 遵循现有的测试模式

### 工具

- 使用项目现有的构建系统
- 使用项目的测试框架
- 使用项目的格式化器/代码检查器设置
- 没有强有力的理由不要引入新工具
- **可以并且更多的使用已安装的 agents** - 充分利用各种专门的 agents 来提高效率和质量

## 质量门槛

### 完成的定义

- [ ] 测试编写并通过
- [ ] 代码遵循项目约定
- [ ] 没有代码检查器/格式化器警告
- [ ] 提交消息清晰
- [ ] 实现与计划匹配
- [ ] 没有不带问题编号的 TODO

### 测试指南

- 测试行为，而不是实现
- 尽可能每个测试一个断言
- 清晰的测试名称描述场景
- 使用现有的测试工具/帮助器
- 测试应该是确定性的

## 重要提醒

**永远不要**：

- 使用 `--no-verify` 绕过提交钩子
- 禁用测试而不是修复它们
- 提交不能编译的代码
- 做假设 - 用现有代码验证
- 删除代码只为通过编译
- 使用 TODO 或占位符绕过实现
- 修改正确的业务逻辑以匹配错误的代码

**始终**：

- 增量提交工作代码
- 随时更新计划文档
- 从现有实现中学习
- 3 次失败尝试后停止并重新评估
- 从根本原因修复编译错误
- 在修复前理解错误发生的原因
- 确保实现完整且功能正常

---

## Project Structure & Module Organization (项目结构与模块组织)

- Monorepo managed by Turborepo. Top-level `apps/` (server, dashboard) and `packages/` (core, ai, utils, config). Scripts and seeds live in `scripts/`.
- Server (AdonisJS) in `apps/server`; routes, services under `src/app`, tests in `apps/server/tests`.
- Dashboard (Next.js) in `apps/dashboard`; UI components in `src/components`, pages in `src/app`. shadcn components are auto-added under `src/components/ui` via CLI.
- CLI in `apps/cli/src`. Shared logic in `packages/*`. Lucid migrations in `apps/server/database/migrations`.

## Build, Test, and Development Commands (构建、测试和开发命令)

- `pnpm dev` (root): run all dev targets via Turborepo.
- `pnpm --filter @sparkset/server dev` / `...dashboard dev`: run server or dashboard only.
- `pnpm --filter @sparkset/server test` / `...core test`: Vitest unit/integration.
- `cd apps/server && node ace migration:run` runs Lucid migrations.
- Seed/demo DB: `mysql -uroot -p'123456' sparkset_demo < scripts/demo-seed.sql`.

## Coding Style & Naming Conventions (代码风格与命名约定)

- TypeScript-first. Follow spec.md naming: kebab-case dirs, camelCase vars, PascalCase types.
- Formatting via Prettier (pre-commit), lint via ESLint. Respect shadcn UI tokens; prefer shadcn components added via `pnpm dlx shadcn@latest add <component>`. Avoid hand-rolled UI unless necessary.

## Testing Guidelines (测试指南)

- Vitest for `apps/api` and `packages/core`. Place specs under `tests/**` or `src/**/__tests__`.
- Prefer focused unit tests for services/planner/executor; add integration tests for routes. Run with `pnpm --filter <pkg> test`.

## Commit & Pull Request Guidelines (提交与 PR 指南)

- **Commit messages MUST be in English**: All commit messages must be written in English, regardless of the language used in code comments or documentation.
- Commit messages in imperative, scoped style seen in history (e.g., `feat: ...`, `fix(api): ...`, `chore(dashboard): ...`). One logical change per commit; avoid mixing formatting and features.
- PRs should include: summary of changes, testing evidence (commands run), screenshots for UI changes, and linked issue/requirement when applicable.

## UI & Component Policy (UI 与组件策略)

- Use shadcn components via CLI (list at https://ui.shadcn.com/llms.txt). Layouts should reference blocks (https://ui.shadcn.com/blocks); sidebar-02 is the baseline for dashboard shell.
- Keep `components.json` in sync; new components must be added through shadcn CLI so tailwind tokens stay consistent.
- For customization guidelines, see Component Development Guidelines > shadcn Component Customization Guidelines.

## Component Development Guidelines (组件开发指南)

### shadcn Component Customization Guidelines

- **Do NOT modify shadcn atomic components**: Components in `src/components/ui/` are shadcn atomic components and should NOT be modified directly.
  - These components are maintained via shadcn CLI and may be updated/replaced automatically
  - Modifying them directly will cause conflicts when updating shadcn components via CLI
  - Modifications will be lost when regenerating components
- **Customization approaches**:
  - **Page-level customization**: Apply custom styles or behavior at the business page/component level using className, style props, or wrapper components
    - Example: `<Button className="custom-class">` in your page component
  - **Higher-order components**: Create wrapper components in `src/components/` (not in `src/components/ui/`) that extend or compose shadcn components
    - Example: Create `src/components/custom-button.tsx` that wraps and extends `src/components/ui/button.tsx`
    - This preserves the original shadcn component while providing custom functionality
  - **Module-specific variants**: Create module-specific wrapper components in `src/components/{module}/` when customization is specific to a feature
    - Example: `src/components/query/query-button.tsx` for query-specific button variants
- **Why this matters**:
  - Maintains compatibility with shadcn CLI updates
  - Keeps atomic components clean and reusable
  - Enables easy maintenance and version upgrades
  - Separates concerns: atomic components vs. business logic

### File Naming Convention (文件命名约定)

- **Component files MUST use kebab-case naming**: `query-form.tsx`, `ai-provider-manager.tsx`, `page-header.tsx`
- **Exception**: shadcn UI components in `src/components/ui/` follow shadcn's naming (usually kebab-case)
- **Page components** in `src/app/` follow Next.js App Router conventions (kebab-case for directories, but can use camelCase for page.tsx if needed)
- **Avoid redundant namespace in module components**: Components already placed in `components/{module}/` directory should NOT repeat the module name in the filename
  - ❌ **Wrong**: `components/datasource/datasource-manager.tsx`, `components/query/query-result.tsx`
  - ✅ **Correct**: `components/datasource/manager.tsx`, `components/query/result.tsx`
  - **Rationale**: The directory already provides the namespace context, so repeating it in the filename is redundant
  - **Exception**: Only use `{module}-{name}.tsx` format when the component is a global component in `components/` root (e.g., `datasource-selector.tsx` is global and used across modules)

### Component Organization (组件组织)

- **Global vs Module Components**:
  - **Global public components**: Components that can be used across multiple modules/features should be placed directly in `src/components/` (not in module subdirectories)
    - Examples: `datasource-selector.tsx`, `ai-provider-selector.tsx`, `page-header.tsx`, `code-viewer.tsx`
    - These are reusable UI components that are not tied to a specific feature
    - If a component is used in 2+ different modules, it should be considered global
  - **Module-specific components**: Components that are specific to a single feature/module should be placed in `src/components/{module}/`
    - Examples: `src/components/query/result.tsx`, `src/components/query/schema-drawer.tsx`
    - These components are tightly coupled to a specific feature's logic and UI
    - **Note**: Component names should NOT repeat the module name (e.g., use `result.tsx` not `query-result.tsx` in `components/query/`)
- **Module-based organization**: Group related components by feature/module
  - **Prefer `components/{module}/` structure**: Components should be organized under `src/components/{module}/` when they can be shared or are substantial enough to warrant separation
  - **Page-specific components**: Only keep truly page-specific, small components in `src/app/{module}/`
  - Example: `src/components/query/` contains `result.tsx`, `result-table.tsx`, `schema-drawer.tsx`, `sql-viewer.tsx` (query module components)
  - Example: `src/components/datasource/` contains `manager.tsx`, `detail.tsx` (datasource module components)
  - Example: `src/components/ai-provider/` contains `manager.tsx` (ai-provider module components)
- **Component structure**:
  ```
  apps/dashboard/src/
  ├── components/          # Shared/reusable components
  │   ├── ui/             # shadcn UI primitives
  │   ├── datasource-selector.tsx    # Global component (used across modules)
  │   ├── ai-provider-selector.tsx   # Global component (used across modules)
  │   ├── code-viewer.tsx            # Global component (used across modules)
  │   ├── page-header.tsx             # Global component (used across modules)
  │   ├── query/          # Query module components
  │   │   ├── result.tsx
  │   │   ├── result-table.tsx
  │   │   ├── schema-drawer.tsx
  │   │   └── sql-viewer.tsx
  │   ├── datasource/     # Datasource module components
  │   │   ├── manager.tsx
  │   │   └── detail.tsx
  │   └── ai-provider/    # AI Provider module components
  │       └── manager.tsx
  └── app/
      └── query/          # Query page (should be minimal, mostly composition)
          └── page.tsx    # Main page component, imports from components/query/
  ```
- **Component splitting principles**:
  - **Avoid flat structure**: Don't put all components directly in `src/app/{module}/` - extract to `components/{module}/`
  - **Extract substantial components**: Any component over ~150 lines should be extracted
  - **Extract reusable logic**: Components that can be reused or have clear boundaries should be extracted
  - **Extract complex UI sections**: Large UI sections (forms, tables, drawers, modals) should be separate components
  - **Keep pages clean**: Page components (`page.tsx`) should primarily compose smaller components, not contain large inline JSX
  - **Single responsibility**: Each component should have a clear, single purpose
  - **Benefits of splitting**:
    - Easier to maintain and test
    - Better code reusability
    - Cleaner, more readable page components
    - Easier to locate and modify specific functionality

### Component Design Principles (组件设计原则)

- **Visual Hierarchy**:
  - Primary actions should be visually prominent (larger, primary color)
  - Secondary actions should be subtle (smaller, muted colors)
  - Use spacing, typography, and color to establish clear hierarchy
- **Layout & Spacing**:
  - Use consistent spacing scale (Tailwind's spacing tokens)
  - Group related elements together with appropriate spacing
  - Use cards/sections to separate distinct content areas
- **Card Usage Guidelines**:
  - **Avoid excessive Card nesting**: Don't nest Cards inside Cards - this creates visual clutter and excessive padding
  - **Use Cards sparingly**: Cards should be used for distinct, self-contained content sections, not for every UI element
  - **Prefer alternatives**: Use borders, dividers, spacing, and background colors to separate content instead of nested Cards
  - **Design inspiration**: Reference excellent UI designs (e.g., Linear, Vercel, GitHub, Stripe) for inspiration
  - **Principles**:
    - One Card per major content section
    - Use subtle borders and backgrounds for grouping instead of Cards
    - Prefer clean, minimal layouts with generous whitespace
    - Avoid "cardception" (cards within cards) - it looks cluttered
  - **When to use Cards**:
    - Main content containers (e.g., query results panel)
    - Distinct feature sections that need clear separation
    - Modal/dialog content
  - **When NOT to use Cards**:
    - Inside other Cards (use borders/backgrounds instead)
    - For small UI elements (use Badge, Button, etc.)
    - For simple groupings (use spacing and borders)
- **Design Aesthetics**:
  - **Strive for elegance**: Aim for clean, minimal, and sophisticated designs
  - **Reference excellent designs**: Study and learn from top-tier products (Linear, Vercel, GitHub, Stripe, etc.)
  - **Whitespace is powerful**: Use generous spacing to create breathing room
  - **Subtle is better**: Prefer subtle borders, shadows, and backgrounds over heavy visual elements
  - **Consistency matters**: Maintain consistent spacing, typography, and color usage throughout
- **Interaction Design**:
  - Provide clear visual feedback for all interactive elements
  - Use appropriate loading states (skeletons, spinners)
  - Handle empty states gracefully with helpful messages
  - Use progressive disclosure (drawers, collapsibles) for secondary information
  - Ensure responsive design works on mobile and desktop
- **Accessibility**:
  - Use semantic HTML elements
  - Provide proper ARIA labels where needed
  - Ensure keyboard navigation works
  - Maintain sufficient color contrast
- **Code Quality**:
  - Keep components focused and single-purpose
  - Extract complex logic into custom hooks
  - Use TypeScript types/interfaces for props
  - Prefer composition over complex prop drilling
- **Formatting & Linting**:
  - **Always format code after changes**: Run Prettier to format code after making any code changes
    - Use `pnpm prettier --write <file>` to format specific files
    - Use `pnpm prettier --write .` to format all files (if needed)
    - Pre-commit hooks will check formatting, but it's better to fix issues proactively
  - **Fix linting issues**: Address ESLint warnings and errors before committing
    - Run `pnpm lint` to check for linting issues
    - Fix issues or use appropriate ESLint disable comments only when necessary
  - **Pre-commit checks**: The project uses Husky pre-commit hooks that run:
    - Prettier formatting checks
    - ESLint checks
    - Ensure all checks pass before committing
  - **Best practice**: Format and lint code immediately after making changes, not just before committing

## Security & Configuration Tips (安全与配置提示)

- Set `DATABASE_URL` for API to hit real MySQL; default falls back to in-memory stores (limited).
- Dashboard expects `NEXT_PUBLIC_API_URL`; CLI can override API with `--api`.
- Avoid committing secrets; use `.env` locally and never add it to git.
