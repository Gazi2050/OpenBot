# OpenBot — Full Feature Documentation

OpenBot is a general-purpose AI chatbot with the visual language of a precision instrument. It is a **pnpm monorepo** with two deployable apps and one shared package: a SvelteKit frontend and a Hono backend, both deployed to Vercel (Edge / Node serverless), backed by PostgreSQL (Neon) and authenticated by Clerk.

This document describes **every feature** in the project, end to end, with file references.

---

## Table of Contents

1. [Architecture & Deployment](#1-architecture--deployment)
2. [Core Product Features](#2-core-product-features)
3. [Frontend — Application Shell](#3-frontend--application-shell)
4. [Frontend — Chat Experience](#4-frontend--chat-experience)
5. [Frontend — Conversation & State Management](#5-frontend--conversation--state-management)
6. [Frontend — Authentication UI](#6-frontend--authentication-ui)
7. [Frontend — Routing & Navigation](#7-frontend--routing--navigation)
8. [Backend — API](#8-backend--api)
9. [Backend — AI Engine & Streaming](#9-backend--ai-engine--streaming)
10. [Backend — Conversation Persistence](#10-backend--conversation-persistence)
11. [Backend — Database & Data Model](#11-backend--database--data-model)
12. [Shared Package](#12-shared-package)
13. [Design System](#13-design-system)
14. [Authentication (full-stack)](#14-authentication-full-stack)
15. [Models & Providers](#15-models--providers)
16. [Notable Implementation Details](#16-notable-implementation-details)
17. [Known Gaps & Roadmap](#17-known-gaps--roadmap)

---

## 1. Architecture & Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      pnpm monorepo                           │
│                                                              │
│  apps/frontend ──── SvelteKit 2 + Svelte 5 (runes)          │
│  apps/backend  ──── Hono 4 (Vercel serverless)              │
│  packages/shared ── Types, models, logger, system prompt    │
│  docker-compose.yml ── PostgreSQL 16 (local dev)            │
└─────────────────────────────────────────────────────────────┘
```

**Dependency flow:**

```
@openbot/shared  (zero runtime deps)
    ├── @openbot/backend
    └── @openbot/frontend
```

**Stack:** Svelte 5 (runes forced) · SvelteKit 2 · Vite 8 · Hono 4 · Drizzle ORM · `@neondatabase/serverless` (HTTP driver) · PostgreSQL 16 · Tailwind CSS 4 · shadcn-svelte (luma) · Clerk (svelte-clerk + @clerk/hono) · AI SDK v6 (`ai`) · pnpm workspaces · tsup.

**Deployment (Vercel CLI):** Two separate Vercel projects, both deployed from the repo root with `rootDirectory` set server-side:

| Project | URL | Root dir | Entrypoint |
|---------|-----|----------|------------|
| `openbot-api` (backend) | `https://openbot-api.vercel.app` | `apps/backend` | `src/index.ts` — `export default app` (Hono preset, zero-config) |
| `openbott` (frontend) | `https://openbott.vercel.app` | `apps/frontend` | SvelteKit `@sveltejs/adapter-vercel` (Build Output v3) |

**Cross-origin strategy (CORS-free):** The frontend never calls the backend cross-origin from the browser. A Vercel rewrite in `apps/frontend/vercel.json` proxies same-origin `/api/*` requests to the backend:

```json
"rewrites": [{ "source": "/api/(.*)", "destination": "https://openbot-api.vercel.app/api/$1" }]
```

Server-side (SSR) fetches bypass the rewrite and hit `PUBLIC_API_URL` directly (`apps/frontend/src/lib/server/api.ts:3`).

---

## 2. Core Product Features

At the product level, OpenBot is a multi-conversation AI chat client:

- **Streaming chat** with multiple AI models (Google Gemini, Groq Llama, Ollama models), rendered token-by-token with a typewriter effect and markdown + mermaid rendering.
- **Persistent conversations** — every message is saved server-side; reload a past conversation and the full history hydrates.
- **Model selection** — switch models per message; the available set is derived dynamically from which provider API keys are configured.
- **Authentication** — email/password + email verification + Google OAuth, via Clerk.
- **Conversation management** — sidebar list, create new chat, delete chats, search chats, per-conversation routes with shareable URLs (`/c/[id]`).
- **Responsive shell** — persistent sidebar on desktop, slide-in drawer on mobile.
- **Distinctive dark UI** — a precision-instrument aesthetic with a single lime accent, warm near-black canvas, depth via surface steps (no drop shadows).

---

## 3. Frontend — Application Shell

Defined in the protected `(main)` route group.

**Layout** (`apps/frontend/src/routes/(main)/+layout.svelte`): `Tooltip.Provider > Sidebar.Provider` (`--sidebar-width: 275px`, `h-svh overflow-hidden`) containing `<AppSidebar />` + `<main>` with `<TopBar />` and routed children. `h-svh` + `min-h-0/min-w-0` give correct flex scrolling across desktop and mobile.

### Sidebar (`lib/components/app-sidebar.svelte`)
- `Sidebar.Root collapsible="offcanvas" side="left"` — persistent rail on desktop, slide-in **drawer** on mobile.
- **Header:** Bot icon + "OpenBot" wordmark.
- **Search:** "Search chats..." button opens a `Command.Dialog` (`search-dialog.svelte`) that client-side filters conversations by title (case-insensitive) and navigates on select.
- **New Chat button** — the **only** place the brand lime accent (`bg-accent-lime text-accent-lime-on`) is used per the design system. Resets chat state and navigates to `/`.
- **Conversation list:** each row shows a `MessageSquare` icon, truncated title, and a hover-revealed delete `Trash2`. Active conversation is highlighted (`bg-surface-card`). Shows skeleton placeholders while loading, and an empty-state "No conversations yet."
- **Footer:** three auth-aware states — loading skeleton avatar, "Sign In" link (signed out), or avatar + `ProfilePopover` (signed in). The popover shows name/email and a Sign Out action.

### TopBar (`lib/components/topbar.svelte`)
- `h-16` header with a bottom hairline border.
- Left: sidebar trigger (toggles the drawer / collapses the rail).
- Right: a **Delete** button that appears **only** on `/c/*` routes; deleting the active chat returns the user to a fresh `/` state.

### Mobile behavior
- Sidebar auto-closes (`setOpenMobile(false)`) on new-chat, chat-select, and search navigation.
- An `IsMobile` reactive hook (`lib/hooks/is-mobile.svelte.ts`, 768px breakpoint) exists but is currently dormant — the shadcn sidebar's internal breakpoint handles responsiveness.

---

## 4. Frontend — Chat Experience

### Chat orchestrator (`lib/components/chat/chat-page.svelte`)
- **Empty state:** centered welcome — "Hello there!" / "How can I help you today?" — when there are no messages.
- **Activity label:** "Thinking…" while the request is submitted; "Analyzing…" while streaming if the message contains tool-type parts, otherwise "Thinking…". The label animates per-character via the `slot-text` library.
- **Auto-scroll:** tracks whether the user is at the bottom (within 50px). On submit it smooth-scrolls to bottom; while streaming it snaps to bottom every 100ms **only if** the user is already at the bottom (so manual scroll-up to read isn't interrupted). A floating "scroll to bottom" button fades in when not at the bottom, respecting `prefers-reduced-motion`.
- **Loading indicator:** a pulsing dot inside an assistant bubble with a Bot avatar.
- **Error state:** "Something went wrong. Please try again."

### Messages (`lib/components/chat/chat-message.svelte`)
- **Avatars:** Lucide `User` / `Bot` (18px) on a surface-elevated tile; the user row is reversed.
- **Bubbles:** user = `bg-surface-elevated` (no border); assistant = `bg-surface-card` + hairline border; `rounded-2xl`, 15px ink text.
- **Typewriter effect:** a client-side `displayedContent` state reveals streamed text in ~20ms increments with an **adaptive chunk size** (`min 2, max 5, scaled by remaining length`) so it catches up faster when it falls behind the token stream. Non-streaming messages snap to full content immediately.
- **Copy button** revealed on hover; copies via `navigator.clipboard` and swaps the icon to a check for 2s.
- Entry animation (`message-in`, translateY 10→0) with reduced-motion guard.

### Markdown rendering (`lib/components/chat/markdown-renderer.svelte`)
- Powered by **`@comark/svelte`** with the **mermaid** plugin — so ```` ```mermaid ```` blocks render as diagrams.
- **Streaming caret:** a CSS block cursor that blinks (`cursor-blink`, 1.1s steps) while streaming.
- Exhaustively styled content: headings, inline code (orange on translucent), fenced `pre` blocks (canvas bg, hairline border, monospace), lists, blockquotes, links (accent-blue with hover underline), tables, `hr`, images. All guarded for reduced motion.

### Composer (`lib/components/chat/message-input.svelte`)
- **Auto-resizing textarea** using **`@chenglou/pretext`** for pixel-accurate measurement (font `400 15px Geist`, line-height 22.5, min 44 / max 200px), recomputed on window resize, with a `scrollHeight` fallback.
- **Send:** `Enter` sends, `Shift+Enter` inserts a newline. Send button is a round ghost icon (`ArrowUp`) that activates (`bg-ink text-canvas`) only when there is text and nothing is streaming.
- **Footer row:** model selector on the left, send button on the right.
- Placeholder: "Ask anything — code, explain, brainstorm..."

### Model selector (`lib/components/chat/model-selector.svelte`)
- A popover pill (dot indicator + label + `ChevronDown`). Options are filtered by the backend-provided `enabledModelIds`; selecting fires `onChange(id)`. Authoritative model state lives in `chatState.model`.

### Copy control (`lib/components/chat/copy-button.svelte`)
- Clipboard copy with a 2s icon swap and proper timeout cleanup.

> **Gap:** there is **no stop-generation control** — the send button simply disables during streaming; the user cannot mid-stream abort.

---

## 5. Frontend — Conversation & State Management

State lives in `.svelte.ts` modules as module-scoped Svelte 5 runes (`$state` / `$derived`), exposed through plain object facades with getters — **not** Svelte stores.

### Chat engine (`lib/hooks/chat.svelte.ts`)
- `model` (defaults to the first shared model), `enabledModelIds` (populated from the backend).
- `syncModelAvailability()` — `GET /api/ai/models`; if the current model isn't enabled, switches to the backend's `defaultModelId`.
- `titleFromChat()` — derives a title from the last user text part (sliced to 50 chars, fallback "New Chat").
- `createChatInstance()` wraps the AI SDK's `Chat` with a `DefaultChatTransport`:
  - **`getBody`** returns `{ model, conversationId? }` — `conversationId` is included **only** when `currentId` is set. (Omitting it tells the backend to mint a new conversation.)
  - **`onResponse`** reads the `X-Conversation-Id` response header; if it differs from the current id, it sets the new id, prepends the conversation to the sidebar, and — if the user is on `/` — performs `goto('/c/'+cid, { replaceState, noScroll, keepFocus })`. **This is the URL/sidebar/active-chat reconciliation.**
- Facade `chatState` exposes `chat` (SSR-safe with a stub), `model`, `enabledModelIds`, `setModel`, `newConversation`, `clearChat`, and `replaceChat(initialMessages, id)`.

### Conversation list (`lib/hooks/conversations.svelte.ts`)
- Singleton `conversationsState` with `$state` fields: `conversations`, `loading`, `hydrated`, `error`, `currentId`.
- **`currentId` is the single source of truth** for the active conversation, persisted to `sessionStorage['openbot.activeConversationId']`.
- `hydrate(initial)` — once-only SSR seed of the list.
- `fetch()` — dedups concurrent fetches; retries **once after 300ms on a 401** to handle the Clerk token-not-yet-ready race on cold loads.
- `prependConversation(id, title)` — optimistic sidebar update (deduped stub) called from the chat `onResponse` before any refetch.
- `create(title?)`, `loadConversation(id)`, `remove(id)` — CRUD helpers (some currently unused by the UI, which routes through navigation + SSR loads instead).

### Reconciliation loop (critical)
Three writers keep `currentId` consistent:
1. `c/[id]/+page.svelte` `$effect` → from the URL param.
2. `chat.svelte.ts` `onResponse` → from the `X-Conversation-Id` header (then `goto('/c/'+cid)` if on home).
3. `conversationsState.create/remove` → on explicit actions.

The sidebar derives its active id from **both** `$page.params.id` and `currentId` to stay in sync during transitions.

### Server-side fetch helper (`lib/server/api.ts`)
- `BASE_URL = env.PUBLIC_API_URL || 'http://localhost:3000'` — production SSR needs the real backend URL because server-side `fetch` does **not** go through the Vite/Vercel `/api` rewrite.
- `serverApiFetch(path, getToken, options)` awaits the Clerk token, injects `Authorization: Bearer`, and is used by the main layout load and the conversation route load.

---

## 6. Frontend — Authentication UI

Clerk is wired via `svelte-clerk`: `<ClerkProvider>` in the root layout (`+layout.svelte:21`), `buildClerkProps(locals.auth())` in the root server load, and `withClerkHandler()` in `hooks.server.ts`.

### Auth form (`lib/components/auth/auth-form.svelte`)
- Dual mode (`'sign-in' | 'sign-up'`), each in its own catch-all route (`(auth)/sign-in/[...sign_in]`, `(auth)/sign-up/[...sign_up]`) so Clerk can drive multi-step flows under one mount.
- **Sign-in:** `signIn.create({ identifier: email, password })`; on completion → `finalize()` + go home.
- **Sign-up:** `signUp.create(...)` → `sendEmailCode()` → moves to a **verify step** (`verifyEmailCode({ code })`) → `finalize()`.
- Errors merge local validation with Clerk's global error. Mode-switch footer links use SvelteKit `resolve()` with route-group paths.
- UI: email input, show/hide `PasswordInput`, outline submit button, "or" divider, Google button, switch-mode link.

### Google OAuth (`lib/components/auth/google-oauth-button.svelte`)
- `authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: origin+'/sso-callback', redirectUrlComplete: origin+'/' })` on either `signIn` or `signUp` depending on mode. The `/sso-callback` route (client-only, `ssr = false`) hosts `AuthenticateWithRedirectCallback` to complete the redirect hop.

### Password input (`lib/components/auth/password-input.svelte`)
- Eye/EyeOff toggle, bindable value, `minlength={8}`.

### Auth state in the UI
- Unauthenticated users hitting a `(main)` route are redirected to `/sign-in` (307) by `(main)/+layout.server.ts`.
- The sidebar footer renders loading/signed-out/signed-in states and a profile popover with sign-out.

---

## 7. Frontend — Routing & Navigation

| Route | Group | Auth | Behavior |
|-------|-------|------|----------|
| `/` | `(main)` | protected | Home — renders `<ChatPage />` in a fresh state (resets stale state on mount unless a stream is active). |
| `/c/[id]` | `(main)` | protected | Conversation view — server-loads conversation + messages, hydrates `chatState`, syncs `currentId`. |
| `/sign-in/[...sign_in]` | `(auth)` | public | Sign-in form. |
| `/sign-up/[...sign_up]` | `(auth)` | public | Sign-up form. |
| `/sso-callback` | — | public | Client-only (`ssr = false`) OAuth redirect completion with a spinner. |

**Conversation hydration** (`routes/(main)/c/[id]/+page.svelte`):
- Converts stored `Message[]` → AI SDK `UIMessage[]` (`{ id, role, parts: [{ type: 'text', text }] }`).
- One `$effect` keeps `currentId` synced to the URL id.
- A second `$effect` calls `chatState.replaceChat(...)` **unless** a stream is active on that same conversation (deliberately avoids nuking the live stream), tracking `loadedId` to avoid redundant replacements.
- Server load maps `404` → SvelteKit `error(404, 'Conversation not found')`, non-ok → `error(status)`, malformed envelope → `error(500)`.

**Global setup** (`+layout.svelte`): imports global CSS (`slot-text/style.css` + `layout.css`), sets the favicon, preloads the **Geist** font from Google Fonts (weights 400/500/600/700), and wraps everything in `<ClerkProvider>`. Uses runes: `let { children } = $props()` + `{@render children()}`.

---

## 8. Backend — API

Hono app mounted at `basePath('/api')` (`apps/backend/src/index.ts`), with global `clerkMiddleware()` and a single `errorHandler` (`middleware/error-handler.ts`) that returns `{ success: false, error }` with the error's status. Every response uses the shared `ApiResponse<T>` envelope:

```ts
interface ApiResponse<T> { success: boolean; data: T; error?: string }
```

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `GET` | `/api/` | — | Welcome — `{ message: 'OpenBot API' }`. (`routes/health.ts:6`) |
| `GET` | `/api/health` | — | Health check — `{ status: 'ok' }`. (`routes/health.ts:13`) |
| `GET` | `/api/me` | yes | Returns the caller's Clerk `userId`; 401 if unauthenticated. (`routes/me.ts:7`) |
| `GET` | `/api/ai/models` | — | Returns `{ defaultModelId, enabledModelIds }` — the dynamic model catalog. (`routes/ai.ts:15`) |
| `POST` | `/api/ai/chat` | yes | Streaming chat (see §9). (`routes/ai.ts:25`) |
| `POST` | `/api/conversations` | yes | Create a conversation (UUID id, title). (`routes/conversations.ts:16`) |
| `GET` | `/api/conversations` | yes | List the caller's conversations, newest-first by `updatedAt`. (`routes/conversations.ts:38`) |
| `GET` | `/api/conversations/:id` | yes | Fetch one conversation + its messages (ownership-checked). (`routes/conversations.ts:52`) |
| `DELETE` | `/api/conversations/:id` | yes | Delete a conversation (cascades messages). (`routes/conversations.ts:89`) |

All conversation endpoints verify the resource belongs to the authenticated `userId`; mismatches return `404` (not `403`) to avoid leaking existence.

### Entry point & runtime (`src/index.ts`)
- Loads env (dev only, `VERCEL`-guarded via `load-env.ts`), guards `DATABASE_URL`, initializes the Drizzle DB.
- Builds the Hono app (basePath `/api`, clerk middleware, error handler, routes) and **`export default app`** — the zero-config entrypoint Vercel's Hono preset imports to route all paths.
- Local dev: `if (!process.env.VERCEL)` dynamically imports `@hono/node-server` and calls `serve()` so `tsx watch` runs a real local server (skipped on Vercel).

---

## 9. Backend — AI Engine & Streaming

### Chat endpoint `POST /api/ai/chat` (`routes/ai.ts:25`)
1. Parses `{ messages, model?, conversationId? }`.
2. Authenticates via Clerk (`getAuth`); 401 if missing.
3. Derives a title from the last user message's first text part (sliced to 50, fallback "New Chat").
4. **`ensureConversation`** — reuses the provided `conversationId` if it exists and belongs to the user; otherwise creates a new one (logging a warning for stale/unauthorized ids).
5. **`persistUserMessage`** — saves the user message (idempotent on message id; on FK violation it transparently mints a fresh conversation and re-inserts — a self-healing guard against stale ids).
6. **`resolveModelId`** — falls back to `DEFAULT_MODEL` if the requested model is unavailable (logs a warning).
7. **`streamText`** (AI SDK) with:
   - the resolved model,
   - `convertToModelMessages(uiMessages)` for history,
   - the shared `SYSTEM_PROMPT`,
   - `onError` — structured error logging (model, message count, conversation id, stack),
   - `onFinish` — **persists the assistant's final text** to the DB and bumps the conversation's `updatedAt`.
8. Returns `result.toUIMessageStreamResponse()` with custom headers:
   - **`X-Conversation-Id`** — the effective conversation id (the cross-boundary reconciler the frontend reads).
   - **`X-Effective-Model-Id`** — the model actually used (may differ from the request if it fell back).
   - `onError` serializes error messages to the stream.

### Provider loader (`lib/ai/providers.ts`)
- Constructs providers from the AI SDK: `@ai-sdk/google`, `@ai-sdk/groq`, and `ollama-ai-provider-v2` (Ollama, with optional bearer auth and configurable `OLLAMA_BASE_URL`).
- **Dynamic availability:** a provider is registered only if its API key env var is set (`GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `OLLAMA_API_KEY`). If **none** are set, the module throws at startup.
- `DEFAULT_MODEL` = the first available model; `availableModelIds` = all available; `getModel`/`resolveModelId` resolve ids with fallback.

---

## 10. Backend — Conversation Persistence

Two helpers in `lib/chat/`:

- **`ensureConversation(db, userId, id?, title?)`** (`conversations.ts:7`) — returns an existing owned conversation or inserts a new one (UUID id). Titles are truncated to 50 chars.
- **`persistUserMessage(db, conversationId, messageId, content, userId, title)`** (`conversations.ts:38`) — idempotent insert keyed on the client-supplied `messageId` (so retries don't duplicate); recovers from FK violations by creating a fresh conversation.
- **`persistAssistantMessage(db, conversationId, text)`** (`persistence.ts:6`) — inserts the assistant message and updates the conversation's `updatedAt`.

All persistence is best-effort with structured logging; failures don't crash the stream.

---

## 11. Backend — Database & Data Model

**ORM:** Drizzle · **Driver:** `@neondatabase/serverless` HTTP via `drizzle-orm/neon-http` (no TCP pooling) · **Schema dir:** `apps/backend/src/db/`.

A singleton DB (`db/index.ts:4`) initialized once via `initDb(connectionString)`; `getDb()` throws if not initialized.

### Schema (`db/schema/conversation.ts`)

**`conversations`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | client/server-generated UUID |
| `user_id` | `text` NOT NULL | Clerk user id |
| `title` | `varchar(255)` | default `'New Chat'` |
| `created_at` | `timestamp` | `defaultNow()` |
| `updated_at` | `timestamp` | `defaultNow()`, bumped on new assistant message |

**`messages`**
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | client-supplied for user msgs (idempotency), server UUID for assistant |
| `conversation_id` | `text` NOT NULL | FK → `conversations.id`, **`ON DELETE CASCADE`** |
| `role` | `varchar(50)` | `'user'` \| `'assistant'` |
| `content` | `text` NOT NULL | plain text (markdown authored by the model) |
| `created_at` | `timestamp` | `defaultNow()` |

Drizzle migrations are managed with `drizzle-kit` (`db:generate`, `db:push`, `db:migrate`, `db:studio`).

---

## 12. Shared Package

`@openbot/shared` — zero runtime dependencies, built with tsup (dual ESM + CJS + `.d.ts`).

- **Types & envelope** (`src/index.ts`): `ApiResponse<T>`, `Conversation`, `Message`.
- **Models** (`src/models.ts`): the `ModelProvider` union (`'google' | 'groq' | 'ollama'`), the `Model` interface, and the static `models` catalog (id, label, provider) shared by both apps so the selector and the backend agree.
- **System prompt** (`src/system-prompt.ts`): a structured `SYSTEM_PROMPT` with `<identity>`, `<core_principles>`, `<formatting>` (CommonMark + fenced code with language tags + mermaid), `<tone>`, `<safety>`, `<security>` (prompt-injection resistance), `<knowledge>`, `<copyright>`, and `<honesty_about_yourself>` sections.
- **Logger** (`src/logger.ts`): an ANSI-colored CLI logger (`success/info/warn/error/debug`) with timestamped labels and `NO_COLOR` support.

---

## 13. Design System

Spec: `DESIGN.md`. Tokens implemented in `apps/frontend/src/routes/layout.css`.

- **Canvas:** `#141414` (warm near-black — never pure `#000`).
- **Brand accent:** `#a8f251` (lime) — used **only** on the New Chat button; `#3b82f6` (blue) for links/rings.
- **Depth:** a surface ladder stepping by `#080808` — sidebar `#1c1c1c`, card `#222`, elevated `#2a2a`, input `#1e1e1e`. **No drop shadows anywhere.**
- **Hairlines:** `rgba(255,255,255,.08)` / `.14`.
- **Ink scale:** `#f5f5f5` at opacities 1 / .82 (body) / .5 (mute) / .35 (placeholder) / .22 (disabled); icons .6 / 1.
- **Radii:** sm 6, md 8, lg 12, xl 16, xxl 20, full 9999 (cards/inputs 16px, New Chat 20px, pills 9999).
- **Typography:** single family `Geist` (`'Inter Tight'` fallback); hierarchy via size/weight/opacity only.
- **Icons:** Lucide only — 18px nav, 16px inline, 20px topbar.
- shadcn-svelte (`luma` style, `neutral` base) is aliased onto the same token values (`--background`, `--card`, `--primary` = lime, `--sidebar`, `--border`, `--ring` = blue, `--radius`).
- Tokens are exposed as Tailwind utilities via `@theme inline` (`bg-canvas`, `bg-surface-card`, `text-ink`, `border-hairline`, `bg-accent-lime`, …) and applied throughout the markup.

> **Gap:** the spec calls for a theme toggle in the sidebar bottom bar, but **no toggle / light theme exists** — the app is dark-only via `:root` tokens (the `dark` custom variant is defined but unused).

---

## 14. Authentication (full-stack)

**Provider:** Clerk.

- **Frontend:** `svelte-clerk` — `<ClerkProvider>` (root layout), `buildClerkProps(locals.auth())` (root server load), `withClerkHandler()` (`hooks.server.ts`). Reactive hooks: `useClerkContext()` (sidebar/profile/Google button), `useSignIn()` / `useSignUp()` (auth form).
- **Backend:** `@clerk/hono` — global `clerkMiddleware()`; routes call `getAuth(c)` to read `userId` and return `401` when absent.
- **Flows:** email/password sign-in, email-code-verified sign-up, Google OAuth (redirect + SSO callback), sign-out.
- **SSR:** Clerk's server handler verifies the session cookie on every request, so the frontend also needs `CLERK_SECRET_KEY` (server-side) in addition to `PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Frontend/backend Clerk keys must match** (same instance, same test/live mode) or token validation fails.

**Required environment:**

| App | Variables |
|-----|-----------|
| Backend | `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `OLLAMA_API_KEY` |
| Frontend | `PUBLIC_API_URL`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `PUBLIC_CLERK_SIGN_IN_URL`, `PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`, `PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` |

---

## 15. Models & Providers

The catalog (`packages/shared/src/models.ts`):

| Model id | Label | Provider |
|----------|-------|----------|
| `gemini-3.1-flash-lite` | Gemini 3.1 | Google |
| `gemini-3.5-flash` | Gemini 3.5 | Google |
| `llama-3.1-8b-instant` | Llama 3.1 | Groq |
| `llama-3.3-70b-versatile` | Llama 3.3 | Groq |
| `gpt-oss:120b-cloud` | GPT-OSS | Ollama |
| `minimax-m3:cloud` | MiniMax M3 | Ollama |

A model is **enabled at runtime only if its provider's API key is set**; the `/api/ai/models` endpoint reports the live set, and the frontend selector filters to it, falling back to the default when the chosen model is unavailable.

---

## 16. Notable Implementation Details

- **Runes discipline:** state lives in module-scoped `$state`/`$derived` in `.svelte.ts` files, exported via plain object facades with getters — no Svelte stores anywhere.
- **`untrack` discipline:** scroll and typewriter effects read their triggers via `untrack` to avoid self-retriggering effect loops.
- **Dynamic transport body:** `body: opts.getBody` is a resolvable function (not a getter) so the latest `conversationId` is picked up per request — a deliberate fix for a "frozen body" bug that caused conversation splitting.
- **`conversationId` contract:** omitting it in `/api/ai/chat` makes the backend create a new conversation; including a stale/unauthorized id self-heals into a new conversation.
- **`X-Conversation-Id` reconciler:** the single header that keeps the sidebar, URL, and active chat consistent across the stream boundary.
- **Stream-safe hydration:** `c/[id]/+page.svelte` deliberately skips `replaceChat` while a stream is active on the same conversation, so navigating doesn't nuke an in-flight response.
- **Idempotent user-message persistence:** keyed on the client-supplied message id; retries don't duplicate rows.
- **FK self-heal:** `persistUserMessage` recovers from FK violations by minting a fresh conversation.
- **CORS-free by design:** browser calls are same-origin `/api/*`, rewritten to the backend; only SSR uses the absolute `PUBLIC_API_URL`.
- **Accessibility-aware motion:** every animation declares a `prefers-reduced-motion: reduce` override.
- **Pixel-accurate composer:** `@chenglou/pretext` measures the textarea without DOM thrash.

---

## 17. Known Gaps & Roadmap

| Area | Status |
|------|--------|
| Tests | No automated tests; verification is manual. |
| Theme toggle | Specified but not implemented (dark-only). |
| Stop generation | No mid-stream abort control in the composer. |
| Conversation sort | No client-side re-sort by `updatedAt`; order is creation/server-driven with prepends. |
| CI/CD | None — deployments are via Vercel CLI, no GitHub Actions pipeline. |
| Search | Client-side title filter only (no server-side/full-text search). |
| Mobile hook | `is-mobile.svelte.ts` exists but is dormant. |

---

*Generated from the source at `apps/`, `packages/shared/`, and `DESIGN.md`. File references use `path:line` for navigation.*
