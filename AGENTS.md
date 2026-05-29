# OpenBot

## Project Overview

OpenBot is a developer-facing chat interface with the visual language of a precision instrument. It is a pnpm monorepo with 3 apps and 2 shared packages, deployed as a SvelteKit frontend + Hono backend (Vercel edge).

**Current state:** Scaffolded but minimal. Frontend shows default SvelteKit welcome page. Backend has 2 routes (root + health). Database has 1 table (`bots`) not yet wired into routes. No custom UI components implemented yet.

**Architecture:**

```
┌─────────────────────────────────────────────────────────┐
│                      pnpm monorepo                       │
│                                                          │
│  apps/frontend ──── SvelteKit 2 + Svelte 5 (runes)      │
│  apps/backend  ──── Hono 4 (Vercel edge runtime)         │
│  apps/sdk      ──── OpenBot SDK (dual ESM + CJS)         │
│                                                          │
│  packages/database ── Drizzle ORM + Neon PostgreSQL      │
│  packages/shared  ─── Types, logger, utilities           │
│                                                          │
│  docker-compose.yml ── PostgreSQL 16 Alpine (local dev)  │
│  DESIGN.md ──────────── Full design system spec          │
└─────────────────────────────────────────────────────────┘
```

**Dependency flow:**

```
@openbot/shared (zero runtime deps)
    ├── @openbot/database (depends on shared)
    ├── openbot-sdk (depends on shared)
    └── @openbot/backend (depends on shared + database)

@openbot/frontend (depends on shared + openbot-sdk)
```

## Monorepo Structure

```
OpenBot/
├── package.json              # Root workspace scripts
├── pnpm-workspace.yaml       # apps/* + packages/*
├── tsconfig.base.json        # Shared TS config (strict, ESM, verbatimModuleSyntax)
├── docker-compose.yml        # PostgreSQL 16 Alpine (user: openbot, db: openbot)
├── .env.example              # DATABASE_URL, PORT, PUBLIC_API_URL
├── DESIGN.md                 # Full design system spec (419 lines)
│
├── apps/
│   ├── frontend/             # @openbot/frontend — SvelteKit 2 + Svelte 5
│   │   ├── src/routes/       # Pages (+page.svelte, +layout.svelte)
│   │   ├── src/lib/          # $lib: components, utils, assets
│   │   ├── src/lib/utils.ts  # cn() utility (clsx + tailwind-merge)
│   │   └── components.json   # shadcn-svelte config (luma style, lucide icons)
│   │
│   ├── backend/              # @openbot/backend — Hono 4 API server
│   │   └── src/index.ts      # Routes: GET /api/, GET /api/health
│   │
│   └── sdk/                  # openbot-sdk — Public npm package
│       └── src/index.ts      # OpenBotClient class (health, getBots)
│
└── packages/
    ├── database/             # @openbot/database — Drizzle ORM + Neon
    │   ├── src/connection.ts  # createClient(connectionString) factory
    │   ├── src/schema/bot.ts  # bots table (id, name, status, timestamps)
    │   └── drizzle.config.ts  # PostgreSQL dialect, ./src/schema/index.ts
    │
    └── shared/               # @openbot/shared — Zero runtime deps
        ├── src/index.ts       # ApiResponse<T>, Bot, BotStatus types
        └── src/logger.ts      # ANSI-colored CLI logger
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | Svelte 5 (runes mode forced) | `^5.55.2` |
| Full-stack Framework | SvelteKit | `^2.57.0` |
| Build Tool (frontend) | Vite | `^8.0.7` |
| API Framework | Hono | `^4.12.23` |
| Runtime | Vercel Edge + `@hono/node-server` (dev) | — |
| ORM | Drizzle ORM | `^0.44.7` |
| Database Driver | `@neondatabase/serverless` (HTTP, not TCP) | `^1.1.0` |
| Database | PostgreSQL 16 (Neon or docker-compose) | — |
| CSS | Tailwind CSS 4 (`@import` syntax) | `^4.2.2` |
| Component Library | shadcn-svelte (Luma style, Lucide icons) | `^1.3.0` |
| Package Manager | pnpm (workspaces) | — |
| Build Tool (packages) | tsup (dual ESM + CJS + d.ts) | `^8.x` |
| TypeScript | Strict mode, `verbatimModuleSyntax` | `^5.8` / `^6.0` |
| Font | Inter Variable via `@fontsource-variable/inter` | — |
| Icons | `@lucide/svelte` | `^1.17.0` |

## Common Commands

All commands run from the project root.

```bash
# Development
pnpm dev              # Build packages, then run all dev servers in parallel
pnpm dev:frontend     # Frontend only (Vite dev server)
pnpm dev:backend      # Backend only (tsx watch)

# Build (ORDER MATTERS: packages must build before apps)
pnpm build            # pnpm build:packages && pnpm build:apps
pnpm build:packages   # @openbot/shared + @openbot/database + openbot-sdk
pnpm build:apps       # @openbot/backend + @openbot/frontend
pnpm build:sdk        # openbot-sdk only

# Type checking
pnpm typecheck        # Runs svelte-check (frontend) and tsc --noEmit (others)

# Linting (frontend only — no lint config for backend/packages)
pnpm lint             # Prettier check + ESLint on @openbot/frontend

# Database (Drizzle Kit)
pnpm db:generate      # Generate migration files from schema changes
pnpm db:push          # Push schema directly to database (no migration file)
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio (database browser)

# Docker (local PostgreSQL)
docker compose up -d  # Start PostgreSQL 16 on localhost:5432

# Clean
pnpm clean            # Remove all dist/ and node_modules/
```

## Code Conventions

### Module System

- ESM everywhere: `"type": "module"` in all package.json files
- Use `.js` extensions in imports: `import { x } from './module.js'`
- `verbatimModuleSyntax: true` in `tsconfig.base.json`

### TypeScript

- `strict: true` everywhere
- Backend/packages/sdk: `module: "NodeNext"`, `moduleResolution: "NodeNext"`
- Frontend: `moduleResolution: "bundler"`, extends `.svelte-kit/tsconfig.json` (NOT `tsconfig.base.json`)
- Backend has `jsx: "react-jsx"`, `jsxImportSource: "hono/jsx"` for Hono's JSX middleware

### Svelte

- Svelte 5 runes mode forced via `svelte.config.js`: `$props()`, `$state()`, `$derived()`, `{@render children()}`
- No legacy Svelte 4 syntax (`export let`, `<slot />`)

### Build

- Packages (shared, database, sdk) build with tsup: dual ESM + CJS + TypeScript declarations
- tsup config pattern: `entry: ['src/index.ts']`, `format: ['esm', 'cjs']`, `dts: true`, `clean: true`
- Frontend builds with Vite via SvelteKit

### API Types

- All API responses use `ApiResponse<T>` from `@openbot/shared`:
  ```typescript
  interface ApiResponse<T> {
    success: boolean
    data: T
    error?: string
  }
  ```

### Formatting (frontend only)

- Prettier: tabs, single quotes, no trailing commas, 100 char width
- Plugins: `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`
- ESLint 10 flat config with `typescript-eslint`, `eslint-plugin-svelte`, `eslint-config-prettier`

### Environment

- Node >= 20 (enforced via `engine-strict=true` in `.npmrc`)
- `auto-install-peers=true`, `strict-peer-dependencies=false`
- Env vars: `DATABASE_URL`, `PORT` (default 3000), `PUBLIC_API_URL`

## Design System

Full spec lives in `DESIGN.md` (419 lines). Key rules:

| Rule | Value |
|------|-------|
| Canvas background | `#141414` (warm near-black, never `#000000`) |
| Brand accent | `#a8f251` (lime green, **only** on New Chat button) |
| Depth system | Surface steps by `#080808` — no drop shadows anywhere |
| Typography | Single font family (Geist / Inter), hierarchy via size + weight + opacity |
| Icons | Lucide only — 18px nav, 16px inline, 20px topbar |
| Border radius | Cards/inputs: 16px, New Chat button: 20px, pills: 9999px |
| Theme toggle | Sidebar bottom bar only — never in top bar |

**Important gap:** The current `layout.css` uses shadcn-svelte's default oklch color tokens, which differ from DESIGN.md's hex/rgba custom properties. These need to be reconciled when implementing the design system.

## Database Conventions

- **ORM:** Drizzle (`drizzle-orm/pg-core`)
- **Driver:** `@neondatabase/serverless` HTTP driver via `drizzle-orm/neon-http` (not TCP pooling)
- **Schema directory:** `packages/database/src/schema/`
- **Schema barrel:** `packages/database/src/schema/index.ts` re-exports all tables
- **Connection factory:** `createClient(connectionString)` in `packages/database/src/connection.ts`
- **Migrations config:** `packages/database/drizzle.config.ts` — PostgreSQL dialect, output `./drizzle/`
- **Drizzle Kit commands:** run via root scripts (`pnpm db:generate`, `pnpm db:push`, etc.)
- **Current schema:** single `bots` table — `id` (text PK), `name` (varchar 255), `status` (varchar 50, default `'offline'`), `created_at`, `updated_at` (timestamps)

### Adding a new table

1. Create `packages/database/src/schema/<name>.ts` using `pgTable` from `drizzle-orm/pg-core`
2. Re-export from `packages/database/src/schema/index.ts`
3. Run `pnpm db:generate` to create migration
4. Run `pnpm db:push` to apply (dev) or `pnpm db:migrate` (production)

## Frontend Conventions

### Tailwind CSS 4

- Uses `@import 'tailwindcss'` syntax (NOT `@tailwind base/components/utilities`)
- Main stylesheet: `src/routes/layout.css` (NOT `app.css`)
- Custom dark variant: `@custom-variant dark (&:is(.dark *))`
- Theme variables in `@theme inline {}` block
- Imports: `tw-animate-css`, `shadcn-svelte/tailwind.css`, `@fontsource-variable/inter`

### shadcn-svelte

- Config: `apps/frontend/components.json`
- Style: `luma`, icons: `lucide`, base color: `neutral`
- Aliases:
  - Components → `$lib/components`
  - UI components → `$lib/components/ui`
  - Hooks → `$lib/hooks`
  - Utils → `$lib/utils`
  - Lib → `$lib`

### Utilities

- `cn()` function in `$lib/utils.ts` — combines `clsx` + `tailwind-merge`
- Type helpers: `WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`, `WithElementRef` (for shadcn patterns)

### Vite Dev Proxy

The frontend proxies `/api` requests to the Hono backend:
- `/api/*` → `http://localhost:3000/*` (strips `/api` prefix)
- Backend base path is `/api`, so frontend calls `/api/health` → backend receives `/health`

## API Conventions

- **Framework:** Hono with `app.basePath('/api')`
- **Edge deployment:** Exports `config = { runtime: 'edge' }` and `default handle(app)` for Vercel
- **Dev server:** In non-production, dynamically imports `@hono/node-server`, listens on `PORT` (default 3000)
- **Response format:** All endpoints return `ApiResponse<T>` from `@openbot/shared`
- **Current routes:** `GET /api/` (welcome), `GET /api/health` (health check)
- **Note:** `@openbot/database` is installed but NOT yet used in any route handler

### Adding a new route

1. Add route handler in `apps/backend/src/index.ts` on the `app` instance
2. Return typed `ApiResponse<T>` using `c.json<ApiResponse<T>>()`
3. Add corresponding method to `OpenBotClient` in `apps/sdk/src/index.ts`
4. Re-export any new types from `@openbot/shared`

## Current State & Gaps

| Area | Status |
|------|--------|
| Frontend UI | Scaffolded — default SvelteKit welcome page, no custom components |
| Backend API | 2 routes (root + health), database not wired |
| Database | 1 table (`bots`), no migrations generated |
| SDK | Basic client with `health()` and `getBots()` |
| Design tokens | `layout.css` uses shadcn defaults, not DESIGN.md tokens |
| Tests | None — no test framework configured |
| CI/CD | None — no GitHub Actions or deployment pipeline |

## graphify

This project has a graphify knowledge graph at `graphify-out/`.

Rules:

- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` for god nodes and community structure
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- Before making ANY code change, query the graph to understand the impact area and dependencies
- After brainstorming or design discussions, validate assumptions against the graph before implementing
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## superpowers

Auto-trigger the matching skill based on the task type. Do not ask the user which skill to use — pick the right one automatically.

| Task type | Skill to invoke |
|-----------|----------------|
| New feature, build request, or adding functionality | `brainstorming` → `writing-plans` → implement |
| Bug report, test failure, unexpected behavior | `systematic-debugging` |
| Code review before merge or after completing work | `requesting-code-review` |
| Received review feedback to implement | `receiving-code-review` |
| About to claim work is complete or tests pass | `verification-before-completion` |
| Building UI, pages, dashboards, styling | `frontend-design` |
| Styling with Tailwind or responsive layouts | `tailwind-css-patterns` |
| shadcn/ui components or presets | `shadcn` |
| Tailwind v4 setup or theme issues | `tailwind-v4-shadcn` |
| Adding or configuring authentication | `clerk` |
| Writing Playwright or E2E tests | `playwright-best-practices` |
| Writing Vitest or unit tests | `vitest` |
| Form validation with React Hook Form | `react-hook-form` |
| Schema validation with Zod | `zod` |
| Complex TypeScript type logic | `typescript-advanced-types` |
| React performance optimization | `vercel-react-best-practices` |
| Component architecture or refactoring | `vercel-composition-patterns` |
| Node.js backend or REST API | `nodejs-backend-patterns` |
| Accessibility audit or WCAG compliance | `accessibility` |
| SEO optimization | `seo` |
| 2+ independent tasks that can run in parallel | `dispatching-parallel-agents` |
| Vite config or plugin issues | `vite` |
| Deploying to Vercel | `deploy-to-vercel` |

## combined workflow

These rules chain graphify + superpowers into a single unified workflow. Follow them in order.

### Before every task
1. Query the graph for context about the area you're about to work in
2. Let the graph tell you what's connected before touching code

### During implementation
1. Use the graph as the first source of truth — it already knows the architecture
2. Let the matching superpowers skill drive the process (debugging, TDD, design, etc.)
3. Code is the output, not the starting point

### After every task
1. Run `graphify update .` to sync the graph with any code changes
2. Run lint, typecheck, and tests via `verification-before-completion` before claiming done

### Auto-chain examples
When the user says:
- `"fix the auth bug"` → `graphify query "auth"` → `systematic-debugging` → fix → `graphify update .`
- `"add dark mode toggle"` → `graphify query "theme"` → `brainstorming` → `writing-plans` → implement → `graphify update .`
- `"how does X relate to Y"` → `graphify path "X" "Y"` → explain from graph
- `"review my code"` → `requesting-code-review` → cross-reference graph for missed connections
- `"build a settings page"` → `graphify query "settings"` → `brainstorming` → `frontend-design` → implement → `graphify update .`
- `"make it accessible"` → `graphify query` affected area → `accessibility` → fix → `graphify update .`
- `"optimize performance"` → `graphify query` bottlenecks → `vercel-react-best-practices` → optimize → `graphify update .`

## fallback

If `graphify-out/` does not exist in the project, skip all graphify rules and rely only on superpowers skills. Offer to run `/graphify .` to build the graph if it would help the current task.
