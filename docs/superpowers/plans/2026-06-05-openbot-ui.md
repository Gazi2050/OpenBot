# OpenBot Chat UI — Final Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use `- [ ]` syntax for tracking.

**Goal:** Build the complete visual shell of the OpenBot chat interface matching DESIGN.md and UI_ANALYSIS.md.

**Architecture:** SvelteKit 2 + Svelte 5 runes. shadcn-svelte components (untouched in `ui/`) composed into custom components (in `custom/`). Dark-only, desktop-only (>=1280px). Geist via Google Fonts CDN. @comark/svelte for future markdown rendering.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), Tailwind CSS 4, shadcn-svelte (luma), @lucide/svelte, @comark/svelte

---

## File Structure

```
apps/frontend/src/
├── app.html                                # MODIFY: add class="dark"
├── routes/
│   ├── +layout.svelte                      # MODIFY: Sidebar.Provider + Tooltip.Provider + Geist
│   ├── +page.svelte                        # MODIFY: Welcome canvas
│   └── layout.css                          # MODIFY: DESIGN.md tokens
└── lib/
    ├── components/
    │   ├── ui/                             # shadcn-svelte (installed via CLI, DO NOT EDIT)
    │   │   ├── sidebar/
    │   │   ├── button/
    │   │   ├── avatar/
    │   │   ├── input/
    │   │   ├── card/
    │   │   ├── separator/
    │   │   ├── tooltip/
    │   │   ├── textarea/
    │   │   └── scroll-area/
    │   └── custom/                         # Custom components composing shadcn primitives
    │       ├── app-sidebar.svelte          # Sidebar: logo + search + new chat + nav + avatar
    │       ├── topbar.svelte               # 3-zone top bar: trigger + model pill + share
    │       ├── model-selector.svelte       # Pill-shaped selector (visual only)
    │       ├── prompt-card.svelte          # Suggestion card wrapping shadcn Card
    │       ├── message-input.svelte        # Input bar: Textarea + send Button
    │       ├── openbot-logo.svelte         # Logomark SVG (two circles)
    │       └── markdown-renderer.svelte    # @comark/svelte wrapper for chat messages
    └── utils.ts                            # EXISTING: cn() utility (untouched)
```

---

### Task 1: Install shadcn-svelte components

**Files:**
- Create: directories under `src/lib/components/ui/`

- [ ] **Step 1: Install**

```bash
pnpm dlx shadcn-svelte@latest add sidebar button avatar input card separator tooltip textarea scroll-area --cwd apps/frontend
```

- [ ] **Step 2: Verify**

```bash
ls apps/frontend/src/lib/components/ui/
```

Expected: `sidebar/ button/ avatar/ input/ card/ separator/ tooltip/ textarea/ scroll-area/`

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/lib/components/ui/ && git commit -m "feat: install shadcn-svelte UI components"
```

---

### Task 2: Replace layout.css with DESIGN.md tokens

**Files:**
- Modify: `apps/frontend/src/routes/layout.css`

Strategy:
- `:root` gets all DESIGN.md custom properties PLUS shadcn CSS variable names mapped to DESIGN.md dark values
- Remove `.dark` selector (dark forced via `app.html`)
- Keep `@custom-variant dark (&:is(.dark *))` so shadcn `dark:` utilities activate
- Add DESIGN.md tokens to `@theme inline` for Tailwind utilities (`bg-accent-lime`, `text-ink`, `border-hairline`, etc.)

**shadcn → DESIGN.md token mapping:**

| shadcn | DESIGN.md | Value |
|---|---|---|
| `--background` | canvas | `#141414` |
| `--foreground` | ink | `#f5f5f5` |
| `--primary` | accent-lime | `#a8f251` |
| `--primary-foreground` | accent-lime-on | `#0e1a00` |
| `--secondary` | surface-elevated | `#2a2a2a` |
| `--card` | surface-card | `#222222` |
| `--muted` | surface-card | `#222222` |
| `--muted-foreground` | mute | `rgba(245,245,245,0.5)` |
| `--border` | hairline | `rgba(255,255,255,0.08)` |
| `--input` | hairline-strong | `rgba(255,255,255,0.14)` |
| `--ring` | accent-blue | `#3b82f6` |
| `--sidebar` | surface-sidebar | `#1c1c1c` |
| `--sidebar-accent` | surface-card | `#222222` |
| `--sidebar-border` | hairline | `rgba(255,255,255,0.08)` |
| `--radius` | rounded-lg | `0.75rem` |

- [ ] **Step 1: Write full `:root` block** with all DESIGN.md properties (accent, surface, text, radius, spacing, typography) and shadcn mappings above

- [ ] **Step 2: Write `@theme inline` block** mapping shadcn vars to Tailwind theme AND adding DESIGN.md custom tokens: `--color-accent-lime`, `--color-accent-lime-on`, `--color-surface-elevated`, `--color-surface-input`, `--color-ink`, `--color-mute-text`, `--color-placeholder-text`, `--color-icon-default`, `--color-icon-active`, `--color-hairline`, `--color-hairline-strong`

- [ ] **Step 3: Keep `@layer base`** with `border-border`, `bg-background text-foreground`, `font-sans` but remove any light-mode defaults

- [ ] **Step 4: Commit**

```bash
git add apps/frontend/src/routes/layout.css && git commit -m "feat: wire DESIGN.md tokens into layout.css"
```

---

### Task 3: Force dark mode in app.html

**Files:**
- Modify: `apps/frontend/src/app.html`

- [ ] **Step 1: Add `class="dark"` to `<html>`**

Change `<html lang="en">` → `<html lang="en" class="dark">` in `apps/frontend/src/app.html`

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/app.html && git commit -m "feat: force dark mode via html class"
```

---

### Task 4: Create OpenBot logomark SVG

**Files:**
- Create: `apps/frontend/src/lib/components/custom/openbot-logo.svelte`

- [ ] **Step 1: Create component**

Two overlapping circles per DESIGN.md. Left circle full opacity `{colors.ink}`, right circle offset below-right, slightly smaller, 70% opacity. Accepts `class` prop. Size 24x24, `aria-hidden="true"`.

```svelte
<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<svg
	class={className}
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<circle cx="9" cy="10" r="6" fill="currentColor" />
	<circle cx="15" cy="14" r="5" fill="currentColor" opacity="0.7" />
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/components/custom/ && git commit -m "feat: add OpenBot logomark SVG"
```

---

### Task 5: Create AppSidebar component

**Files:**
- Create: `apps/frontend/src/lib/components/custom/app-sidebar.svelte`

Composes shadcn Sidebar primitives. Structure:

```
Sidebar.Root (collapsible="none", side="left", variant="sidebar")
├── Sidebar.Header
│   └── OpenBot logo + wordmark "OpenBot"
├── Sidebar.Content
│   ├── Search input (shadcn Input + Lucide Search icon)
│   ├── New Chat button (shadcn Button, lime bg, rounded-[20px])
│   └── Sidebar.Group > Sidebar.Menu
│       ├── Sidebar.MenuItem: Chats (Lucide MessageSquare)
│       └── Sidebar.MenuItem: Settings (Lucide Settings2)
└── Sidebar.Footer
    └── Avatar (shadcn Avatar.Root/Image/Fallback, right-aligned)
```

Key styling:
- Search: `Input` wrapped in relative div, `Search` icon `absolute left-3`, `bg-surface-input`, `rounded-lg`, `h-10`
- New Chat: `Button` with `bg-accent-lime hover:brightness-[0.92] text-accent-lime-on font-semibold h-11 rounded-[20px] justify-start px-4`. Lucide `PlusCircle` icon 18px. ONLY lime surface in entire UI.
- Nav items: `Sidebar.MenuButton` with custom `class` for `h-10 rounded-lg text-mute-text hover:bg-surface-card hover:text-ink`. Icons via `child` snippet.
- Avatar: `Avatar.Root` with `size-8 rounded-full`, placeholder image `https://github.com/shadcn.png`

Imports: shadcn sidebar (`* as Sidebar`), button, input, avatar, custom openbot-logo, Lucide icons (Search, PlusCircle, MessageSquare, Settings2)

- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/components/custom/app-sidebar.svelte && git commit -m "feat: build AppSidebar with shadcn Sidebar primitives"
```

---

### Task 6: Create TopBar + ModelSelector components

**Files:**
- Create: `apps/frontend/src/lib/components/custom/model-selector.svelte`
- Create: `apps/frontend/src/lib/components/custom/topbar.svelte`

- [ ] **Step 1: Create model-selector.svelte**

Visual-only pill button. `rounded-full`, `bg-surface-elevated`, `border border-hairline`, `h-9 px-3.5`. Content: placeholder circle icon + "GPT-5.4 Nano" label + Lucide `ChevronDown`. Centered. No dropdown behavior for visual shell.

- [ ] **Step 2: Create topbar.svelte**

3-zone header: `flex h-16 items-center justify-between border-b border-hairline px-4`

```
[left zone]  → Sidebar.Trigger (from shadcn sidebar index.js), hover:bg-surface-card rounded-lg
[center]     → ModelSelector component, mx-auto
[right zone] → shadcn Button variant="outline", h-9 gap-2 rounded-xl border-hairline
                bg-surface-elevated px-3.5 text-sm font-semibold text-ink
                Lucide Share icon (size-4, text-icon-default) + "Share" label
```

- [ ] **Step 3: Commit**

```bash
git add apps/frontend/src/lib/components/custom/topbar.svelte apps/frontend/src/lib/components/custom/model-selector.svelte && git commit -m "feat: add TopBar with model selector and share button"
```

---

### Task 7: Create PromptCard component

**Files:**
- Create: `apps/frontend/src/lib/components/custom/prompt-card.svelte`

Props: `title: string`, `subtitle: string`

Uses shadcn `Card.Root` with overrides:
- `bg-surface-card border-hairline rounded-xl p-6 min-h-[90px] cursor-pointer`
- Hover: `hover:bg-surface-elevated hover:border-hairline-strong`

Content left-aligned:
- Title: `style="font: var(--type-card-title)"` class `text-ink`
- Subtitle: `style="font: var(--type-card-body)"` class `mt-1` with `color: var(--colors-mute)`

- [ ] **Step 1: Create component**
- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/components/custom/prompt-card.svelte && git commit -m "feat: add prompt suggestion card"
```

---

### Task 8: Create MessageInput component

**Files:**
- Create: `apps/frontend/src/lib/components/custom/message-input.svelte`

Container div: `bg-surface-input border border-hairline-strong rounded-xl p-3.5 min-h-[80px] flex flex-col justify-between`

Inner layout:
```
[Textarea]  → shadcn Textarea, override: bg-transparent border-0 outline-0 resize-none
              text-ink placeholder:text-placeholder-text
              style="font: var(--type-input-text)"
              placeholder="Send a message... (@ to mention, / for commands)"

[Bottom row] → flex justify-between items-center
   [left]    → Lucide Plus icon (size-[18px] text-icon-default), ghost button
   [right]   → shadcn Button size="icon" rounded-full h-8 w-8
               bg-surface-elevated text-icon-default hover:text-ink
               Lucide ArrowUp icon (size-4)
```

Active state for send button: when textarea has text → `bg-ink text-canvas` (managed via `$state`)

- [ ] **Step 1: Create component**
- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/components/custom/message-input.svelte && git commit -m "feat: add message input bar"
```

---

### Task 9: Create MarkdownRenderer (comark wrapper)

**Files:**
- Create: `apps/frontend/src/lib/components/custom/markdown-renderer.svelte`

Props: `markdown: string`, `streaming: boolean = false`, `class: string = ''`

```svelte
<script lang="ts">
	import { Comark } from '@comark/svelte';

	let {
		markdown = '',
		streaming = false,
		class: className = '',
	}: {
		markdown?: string;
		streaming?: boolean;
		class?: string;
	} = $props();
</script>

<Comark {markdown} {streaming} caret {class} />
```

Infrastructure for rendering assistant chat messages as markdown. Supports streaming with caret animation. Not rendered in welcome state — ready for future chat view.

- [ ] **Step 1: Create component**
- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/lib/components/custom/markdown-renderer.svelte && git commit -m "feat: add comark markdown renderer wrapper"
```

---

### Task 10: Update +layout.svelte

**Files:**
- Modify: `apps/frontend/src/routes/+layout.svelte`

```svelte
<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import AppSidebar from '$lib/components/custom/app-sidebar.svelte';
	import TopBar from '$lib/components/custom/topbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Tooltip.Provider>
	<Sidebar.Provider style="--sidebar-width: 275px;">
		<AppSidebar />
		<main class="flex h-screen flex-col">
			<TopBar />
			{@render children()}
		</main>
	</Sidebar.Provider>
</Tooltip.Provider>
```

- [ ] **Step 1: Rewrite layout**
- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/routes/+layout.svelte && git commit -m "feat: add Sidebar.Provider + Tooltip.Provider shell with Geist font"
```

---

### Task 11: Build welcome page

**Files:**
- Modify: `apps/frontend/src/routes/+page.svelte`

```svelte
<script lang="ts">
	import PromptCard from '$lib/components/custom/prompt-card.svelte';
	import MessageInput from '$lib/components/custom/message-input.svelte';
</script>

<div class="flex flex-1 flex-col items-center overflow-y-auto">
	<div class="flex w-full max-w-[680px] flex-1 flex-col px-8">
		<div class="flex flex-1 flex-col items-center justify-center">
			<h1
				class="text-center text-ink"
				style="font: var(--type-welcome-headline)"
			>
				Hello there!
			</h1>
			<p
				class="mt-2 text-center"
				style="font: var(--type-welcome-subtitle); color: var(--colors-mute)"
			>
				How can I help you today?
			</p>
			<div class="mt-12 grid w-full grid-cols-2 gap-3">
				<PromptCard
					title="What's the weather"
					subtitle="In San Francisco?"
				/>
				<PromptCard
					title="Explain React hooks"
					subtitle="like useState and useEffect"
				/>
			</div>
		</div>
		<div class="py-8">
			<MessageInput />
		</div>
	</div>
</div>
```

- [ ] **Step 1: Rewrite page**
- [ ] **Step 2: Commit**

```bash
git add apps/frontend/src/routes/+page.svelte && git commit -m "feat: build welcome canvas page"
```

---

### Task 12: Verify

- [ ] **Step 1: Typecheck**

```bash
pnpm --filter @openbot/frontend typecheck
```

- [ ] **Step 2: Lint**

```bash
pnpm --filter @openbot/frontend format && pnpm --filter @openbot/frontend lint
```

- [ ] **Step 3: Visual verification checklist**

- [ ] Canvas bg `#141414` (not `#000000`)
- [ ] Sidebar `#1c1c1c`, 275px, hairline right border
- [ ] New Chat lime `#a8f251`, 44px tall, `rounded-[20px]`, only lime surface
- [ ] Search: magnifier icon, `#1e1e1e` bg, 12px radius
- [ ] Nav: Chats + Settings with Lucide icons
- [ ] Avatar in sidebar footer
- [ ] TopBar: 64px, 3-zone, hairline bottom
- [ ] Model pill: `#2a2a2a` bg, `rounded-full`, "GPT-5.4 Nano"
- [ ] Share button: `#2a2a2a` bg, `rounded-xl`
- [ ] "Hello there!" 36px bold ink
- [ ] Subtitle 22px regular, 50% opacity
- [ ] 48px gap subtitle → cards
- [ ] Cards: `#222222` bg, 16px radius, 24px padding, hairline border
- [ ] Input: `#1e1e1e` bg, hairline-strong border, 16px radius
- [ ] Send: circular `#2a2a2a` bg
- [ ] No drop shadows anywhere
- [ ] Geist font active (DevTools → computed font-family)
- [ ] All icons Lucide

---

## Dependency Graph

```
Task 1 (install)  ──┐
Task 2 (layout.css) ┤
Task 3 (app.html)  ─┤
                    ├──► Task 4  (logo)        ──┐
Task 1 ─────────────┤                           ├──► Task 5  (sidebar)   ──┐
                    ├──► Task 6  (topbar+model) ──┤                         │
                    ├──► Task 7  (prompt-card)  ──┤                         │
                    ├──► Task 8  (msg-input)    ──┼──► Task 10 (layout) ──┤
                    └──► Task 9  (markdown)     ──┘                         │
                                                            Task 11 (page) ┤
                                                                           └──► Task 12 (verify)
```
