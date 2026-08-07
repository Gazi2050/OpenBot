# SDK Merge + Full Codebase Cleanup

**Date:** 2026-08-07
**Status:** Approved — Ready for implementation

## Overview

Merge the SDK (`apps/sdk/`) into the existing `@openbot/shared` package and frontend app, then perform a comprehensive codebase cleanup addressing ~30 findings from a full audit. The result: one fewer package to build, consistent API patterns, proper error handling, no dead code, and documentation that matches reality.

## Decisions

| Decision | Rationale |
|----------|-----------|
| Keep DB layer in backend | Simpler — one fewer package. AGENTS.md updated to reflect reality. |
| `models` + `SYSTEM_PROMPT` → `@openbot/shared` | Both used by frontend AND backend. Shared is already a dep of both. |
| `createChat()` → frontend `$lib/chat-transport.ts` | Only used by frontend, depends on `@ai-sdk/svelte`. |
| Delete `OpenBotClient`, `API_PATHS`, `Bot`/`BotStatus` | Zero consumers. Dead code. |
| Delete `apps/sdk/` entirely | All useful exports moved. |
| Skip tests | Deferred. Add when critical-path coverage needed. |
| Simplify DESIGN.md to match code | Remove unimplemented token spec. Reference layout.css. |

## Phase 1: Shared Package

1. Create `packages/shared/src/models.ts` — copy model definitions from SDK
2. Create `packages/shared/src/system-prompt.ts` — copy system prompt from SDK
3. Update `packages/shared/src/index.ts` — add new exports, delete dead `Bot`/`BotStatus` types, fix indentation
4. Fix `logger.ts` — stdlib formatDate, NO_COLOR support, debug → console.debug
5. Fix `tsup.config.ts` — `clean: true`
6. Fix `package.json` — add `sideEffects: false`

## Phase 2: SDK Merge & Deletion

1. Create `apps/frontend/src/lib/chat-transport.ts` — copy `chat.ts` from SDK
2. Update all 4 import sites (frontend: `chat.svelte.ts`, `model-selector.svelte`; backend: `providers.ts`, `ai.ts`) from `openbot-sdk` → `@openbot/shared` / `$lib/chat-transport.js`
3. Remove `openbot-sdk` from frontend and backend `package.json`
4. Delete `apps/sdk/`
5. Update root `build:packages` script, remove `build:sdk`
6. Regenerate lockfile via `pnpm install`

## Phase 3: Backend Cleanup

1. Add global error handler middleware
2. Fix ApiResponse consistency: health, me, ai routes
3. Split `ai.ts`: extract conversation creation, user message persistence, assistant message persistence
4. Extract string/number constants for all hardcoded values
5. Delete dead `bots` schema table
6. Fix dotenv to not run on Vercel Edge
7. Fix hardcoded Ollama base URL → env var
8. Fix type assertions in conversations route
9. Fix unused barrel in lib/ai/index.ts
10. Generate migration to drop bots table

## Phase 4: Frontend Cleanup

1. Delete dead code: `lib/api.ts`, `lib/index.ts`, `openbot-logo.svelte`
2. Remove dead UI: share button, profile no-op button
3. Fix SSR guard: wrap chat instance creation in `if (browser)`
4. Extract constants: API paths, routes, title max length
5. Fix copy-button setTimeout memory leak
6. Accessibility: profile trigger keyboard support, error message aria link
7. Replace hardcoded hex colors with CSS variables
8. Split large components: `auth-form` → extract verification form, `chat-page` → extract welcome screen + scroll button
9. Remove redundant `@fontsource-variable/inter` font load
10. Enable Svelte a11y ESLint rules

## Phase 5: Documentation

1. AGENTS.md: remove all `@openbot/database`/`packages/database` references, remove `Bot`/`BotStatus`, update dependency flow, add Clerk auth section, update build scripts
2. DESIGN.md: strip `{token.name}` syntax, reference layout.css, keep qualitative rules

## Verification

```bash
pnpm install && pnpm build:packages && pnpm build:apps && pnpm typecheck && pnpm lint
```
