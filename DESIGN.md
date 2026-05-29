# OpenBot — Design System

## Overview

OpenBot is a developer-facing chat interface with the visual language of a precision instrument.
Every surface opens on `{colors.canvas}` (`#141414`), a near-black warmer than pure black, giving
the UI a soft depth that pure `#000000` cannot achieve. The loudest element is not a brand stamp
or a hero headline — it is the **lime-green New Chat button** (`{colors.accent-lime}` — `#a8f251`),
which sits anchored in the sidebar at eye-level, functioning as the sole bright surface in the
entire viewport. That single decision defines the brand tone: technical, calm, purposeful, and
precisely opinionated about where your attention goes.

The sidebar carries a two-column structure: a narrow left panel (≈ 275px) for navigation, and
a wide main area for the chat canvas. The top bar holds the model selector as a pill-shaped
dropdown — currently "GPT-5.4 Nano" — flanked by a sidebar-toggle icon on the left and a
Share button on the right. The main canvas presents a centered welcome state with a bold
greeting headline, a muted subtitle, suggestion prompt cards, and a multi-line message input
docked at the bottom. The overall rhythm is: sidebar → top-bar → welcome splash → prompt
cards → input bar — clean, scannable, and without decorative noise.

Typography is weight-led, not family-led. A single sans-serif carries the entire interface. The
greeting "Hello there!" sits at ≈ 36px bold; the subtitle "How can I help you today?" drops to
≈ 22px at a lower opacity — a luminance shift replaces a family shift for hierarchy. Body copy
in cards and nav labels runs at ≈ 14–15px regular. No serif. No monospace in the welcome state.

**Key Characteristics:**

- Near-black canvas (`{colors.canvas}` — `#141414`) with a warm temperature, never cold pure black.
- Sidebar panel at `{colors.surface-sidebar}` (`#1c1c1c`) — one visible step above canvas.
- A single lime-green CTA (`{colors.accent-lime}` — `#a8f251`) as the only saturated bright surface in the UI. It is the brand's visual anchor.
- Weight-led type hierarchy: one font family, hierarchy carried by size + opacity.
- No drop shadows. Depth built from surface luminance steps and hairline borders.
- Rounded language: cards and input at `{rounded.xl}` (16px), New Chat button at `{rounded.xxl}` (20px), pill selectors at `{rounded.full}`.
- Sidebar and main area separated by a single `{colors.hairline}` 1px vertical divider — no shadow, no gap.
- Theme toggle lives in the **sidebar bottom bar only** — not in the top bar.

---

## CSS Custom Properties

Paste this block into your `:root` to wire up all tokens immediately.

```css
:root {
  /* Accent */
  --colors-accent-lime: #a8f251;
  --colors-accent-lime-on: #0e1a00;
  --colors-accent-blue: #3b82f6;

  /* Surface */
  --colors-canvas: #141414;
  --colors-surface-sidebar: #1c1c1c;
  --colors-surface-card: #222222;
  --colors-surface-elevated: #2a2a2a;
  --colors-surface-input: #1e1e1e;
  --colors-hairline: rgba(255, 255, 255, 0.08);
  --colors-hairline-strong: rgba(255, 255, 255, 0.14);

  /* Text */
  --colors-ink: #f5f5f5;
  --colors-body: rgba(245, 245, 245, 0.82);
  --colors-mute: rgba(245, 245, 245, 0.5);
  --colors-placeholder: rgba(245, 245, 245, 0.35);
  --colors-disabled: rgba(245, 245, 245, 0.22);
  --colors-icon-default: rgba(245, 245, 245, 0.6);
  --colors-icon-active: #f5f5f5;

  /* Border Radius */
  --rounded-none: 0px;
  --rounded-sm: 6px;
  --rounded-md: 8px;
  --rounded-lg: 12px;
  --rounded-xl: 16px;
  --rounded-xxl: 20px;
  --rounded-full: 9999px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-xxl: 24px;
  --spacing-xxxl: 32px;
  --spacing-section: 48px;

  /* Typography */
  --font-primary: "Geist", "Inter Tight", "Inter", system-ui, sans-serif;
}
```

---

## Colors

### Brand & Accent

- **Accent Lime** (`{colors.accent-lime}` — `#a8f251`): the sole brand accent. Used exclusively as the `{component.button-new-chat}` background. Never used for text, borders, or atmospheric washes.
- **Accent Lime On** (`{colors.accent-lime-on}` — `#0e1a00`): label color on top of `{colors.accent-lime}` surfaces. Near-black green for legibility on the lime button.
- **Accent Blue** (`{colors.accent-blue}` — `#3b82f6`): focus rings and inline links only. Never a button background.

### Surface

- **Canvas** (`{colors.canvas}` — `#141414`): default page background. Warm near-black — not `#000000`, not `#0a0a0a`.
- **Surface Sidebar** (`{colors.surface-sidebar}` — `#1c1c1c`): left sidebar panel. +`#080808` above canvas.
- **Surface Card** (`{colors.surface-card}` — `#222222`): prompt suggestion cards and secondary surfaces. +`#080808` above sidebar.
- **Surface Elevated** (`{colors.surface-elevated}` — `#2a2a2a`): model-selector pill, Share button, send icon background. +`#080808` above card.
- **Surface Input** (`{colors.surface-input}` — `#1e1e1e`): message input and sidebar search field background. Shared token — same `#1e1e1e` value for both contexts.
- **Hairline** (`{colors.hairline}` — `rgba(255,255,255,0.08)`): 1px soft borders on cards, sidebar divider, model-selector pill.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(255,255,255,0.14)`): 1px structural border on message input and focus states.

### Text

- **Ink** (`{colors.ink}` — `#f5f5f5`): primary text — headlines, active nav labels, card titles.
- **Body** (`{colors.body}` — `rgba(245,245,245,0.82)`): standard body text, card sub-lines.
- **Mute** (`{colors.mute}` — `rgba(245,245,245,0.50)`): secondary labels — nav items at rest, welcome subtitle.
- **Placeholder** (`{colors.placeholder}` — `rgba(245,245,245,0.35)`): input placeholder text.
- **Disabled** (`{colors.disabled}` — `rgba(245,245,245,0.22)`): disabled states.
- **Icon Default** (`{colors.icon-default}` — `rgba(245,245,245,0.60)`): icons at rest — sidebar nav, topbar chrome.
- **Icon Active** (`{colors.icon-active}` — `#f5f5f5`): icons on hover or active parent.

---

## Typography

### Font Family

OpenBot uses a single sans-serif stack. All text — headlines, nav labels, captions, button
labels — uses the same family. Hierarchy is expressed through size, weight, and opacity only.

- **Primary UI Font**: `"Geist", "Inter Tight", "Inter", system-ui, sans-serif`
- Import Geist: `https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap`
- Fallback: If Geist is unavailable, use Inter Tight with `letter-spacing: -0.02em` on body sizes.

### Hierarchy

| Token                            | CSS var                    | Size | Weight | Opacity | Line Height | Use                                      |
| -------------------------------- | -------------------------- | ---- | ------ | ------- | ----------- | ---------------------------------------- |
| `{typography.welcome-headline}`  | `--type-welcome-headline`  | 36px | 700    | 100%    | 1.2         | "Hello there!" — one per welcome screen. |
| `{typography.welcome-subtitle}`  | `--type-welcome-subtitle`  | 22px | 400    | 50%     | 1.3         | "How can I help you today?"              |
| `{typography.card-title}`        | `--type-card-title`        | 15px | 600    | 100%    | 1.4         | Prompt card primary line.                |
| `{typography.card-body}`         | `--type-card-body`         | 13px | 400    | 70%     | 1.5         | Prompt card secondary line.              |
| `{typography.nav-label}`         | `--type-nav-label`         | 14px | 500    | 60%     | 1.0         | Sidebar nav items at rest.               |
| `{typography.button-label}`      | `--type-button-label`      | 14px | 600    | 100%    | 1.0         | "New Chat", "Share" labels.              |
| `{typography.model-pill}`        | `--type-model-pill`        | 14px | 500    | 90%     | 1.0         | Model selector label.                    |
| `{typography.input-placeholder}` | `--type-input-placeholder` | 15px | 400    | 35%     | 1.5         | Input placeholder.                       |
| `{typography.input-text}`        | `--type-input-text`        | 15px | 400    | 100%    | 1.5         | User-typed message.                      |
| `{typography.logo}`              | `--type-logo`              | 15px | 600    | 100%    | 1.0         | "OpenBot" wordmark.                      |

### Typography CSS Variables

```css
:root {
  --type-welcome-headline: 700 36px/1.2 var(--font-primary);
  --type-welcome-subtitle: 400 22px/1.3 var(--font-primary);
  --type-card-title: 600 15px/1.4 var(--font-primary);
  --type-card-body: 400 13px/1.5 var(--font-primary);
  --type-nav-label: 500 14px/1 var(--font-primary);
  --type-button-label: 600 14px/1 var(--font-primary);
  --type-model-pill: 500 14px/1 var(--font-primary);
  --type-input-text: 400 15px/1.5 var(--font-primary);
  --type-logo: 600 15px/1 var(--font-primary);
}
```

### Principles

- Hierarchy is opacity-first, weight-second. Drop opacity to create secondary text — never switch families.
- `700` weight is used only for `{typography.welcome-headline}`. Everything else is 400–600.
- No letter-spacing overrides — the font's native metrics apply throughout.

---

## Layout

### Spacing System

- **Base unit**: 4px.
- **Tokens**: `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.lg}` 16px · `{spacing.xl}` 20px · `{spacing.xxl}` 24px · `{spacing.xxxl}` 32px · `{spacing.section}` 48px.

### Shell Structure

- **Sidebar width**: 275px fixed. Contains: logo row (wordmark + collapse icon); search bar; New Chat button; Chats nav item; Settings nav item; pinned bottom row (theme-toggle + avatar).
- **Main area**: `calc(100vw - 275px)`. Contains: top bar; welcome/chat canvas; input bar docked bottom.
- **Top bar height**: 64px. Layout: [sidebar-toggle icon left] — [model-selector pill centered] — [Share button right]. **No theme toggle in the top bar.**
- **Input bar**: docked to bottom of main canvas, min-height 100px including padding.

### Grid & Container

- **Welcome content**: horizontally centered, max-width 680px.
- **Prompt cards**: `display: grid; grid-template-columns: 1fr 1fr; gap: {spacing.md}` (12px).
- **Input bar padding**: `{spacing.xxxl}` (32px) horizontal within the canvas container.

### Whitespace Philosophy

- Welcome canvas is deliberately spacious — headline + subtitle sit above vertical center to leave room for the docked input bar.
- Prompt cards: `{spacing.xxl}` (24px) internal padding all sides.
- Sidebar nav items: `{spacing.lg}` (16px) vertical padding.

---

## Elevation & Depth

| Level        | Token                       | Value     | Border                         | Use                                     |
| ------------ | --------------------------- | --------- | ------------------------------ | --------------------------------------- |
| 0 — canvas   | `{colors.canvas}`           | `#141414` | none                           | Main chat area, page shell.             |
| 1 — sidebar  | `{colors.surface-sidebar}`  | `#1c1c1c` | none                           | Left sidebar panel.                     |
| 2 — card     | `{colors.surface-card}`     | `#222222` | 1px `{colors.hairline}`        | Prompt suggestion cards.                |
| 3 — elevated | `{colors.surface-elevated}` | `#2a2a2a` | 1px `{colors.hairline}`        | Model pill, Share button, send icon bg. |
| 4 — input    | `{colors.surface-input}`    | `#1e1e1e` | 1px `{colors.hairline-strong}` | Message input and search fields.        |

Each step increments by exactly `#080808`. **No drop shadows anywhere in this system.**

---

## Shapes

### Border Radius Scale

| Token            | CSS var          | Value  | Use                                                          |
| ---------------- | ---------------- | ------ | ------------------------------------------------------------ |
| `{rounded.none}` | `--rounded-none` | 0px    | Internal dividers, full-bleed separators.                    |
| `{rounded.sm}`   | `--rounded-sm`   | 6px    | Small inline chips, code tags.                               |
| `{rounded.md}`   | `--rounded-md`   | 8px    | Avatar container frame.                                      |
| `{rounded.lg}`   | `--rounded-lg`   | 12px   | Search bar, Share button, nav item hover state.              |
| `{rounded.xl}`   | `--rounded-xl`   | 16px   | Prompt cards, message input bar.                             |
| `{rounded.xxl}`  | `--rounded-xxl`  | 20px   | New Chat button (primary lime CTA).                          |
| `{rounded.full}` | `--rounded-full` | 9999px | Model selector pill, user avatar, send button, theme-toggle. |

### Assignment Rules

- Selector / pill → `{rounded.full}`
- Card / input container → `{rounded.xl}`
- Primary CTA button → `{rounded.xxl}`
- Secondary action button → `{rounded.lg}`
- Avatar → `{rounded.md}` frame, `{rounded.full}` image clip

---

## Components

### Sidebar

**`{component.sidebar-shell}`**

- `background: {colors.surface-sidebar}` · `width: 275px` · `height: 100vh`
- Right edge: `border-right: 1px solid {colors.hairline}`
- Layout: `display: flex; flex-direction: column; justify-content: space-between`

**`{component.sidebar-logo-row}`**

- Contains: OpenBot logomark SVG (two-circle mark, `{colors.ink}`) + wordmark `{typography.logo}` left; collapse icon `{colors.icon-default}` right.
- Padding: `{spacing.lg}` all sides.

**`{component.sidebar-search}`**

- `background: {colors.surface-input}` · `border: 1px solid {colors.hairline}` · `border-radius: {rounded.lg}` · `height: 40px` · `padding: 10px 14px`
- Left icon: magnifier `{colors.icon-default}` · Placeholder: `{colors.placeholder}` · `font: {typography.input-text}`

**`{component.button-new-chat}`** — primary lime CTA

- `background: {colors.accent-lime}` · `color: {colors.accent-lime-on}` · `font: {typography.button-label}`
- `height: 44px` · `width: calc(100% - 32px)` · `border-radius: {rounded.xxl}` · `border: none`
- Left icon: `+` circle outline `{colors.accent-lime-on}` 18px.
- Hover: `filter: brightness(0.92)`
- **Only lime surface in the UI.**

**`{component.sidebar-nav-item}`**

- `background: transparent` · `color: {colors.mute}` · `font: {typography.nav-label}` · `height: 40px`
- `padding: 0 {spacing.lg}` · `border-radius: {rounded.lg}` · `display: flex; align-items: center; gap: {spacing.sm}`
- Icon: `{colors.icon-default}` 18px.
- Hover / Active: `background: {colors.surface-card}` · `color: {colors.ink}` · icon: `{colors.icon-active}`

**`{component.sidebar-bottom-bar}`**

- Pinned to sidebar bottom. `padding: {spacing.lg}` · `display: flex; justify-content: space-between; align-items: center`
- Left: theme-toggle icon `{colors.icon-default}` · `border-radius: {rounded.full}` · 32×32px · no background.
- Right: user avatar 32×32px · `border-radius: {rounded.full}` · `border: 1px solid {colors.hairline-strong}`

### Top Bar

**`{component.topbar-shell}`**

- `background: {colors.canvas}` · `height: 64px` · `border-bottom: 1px solid {colors.hairline}`
- `display: flex; align-items: center; justify-content: space-between; padding: 0 {spacing.lg}`

**`{component.model-selector-pill}`**

- `background: {colors.surface-elevated}` · `border: 1px solid {colors.hairline}` · `border-radius: {rounded.full}`
- `height: 36px` · `padding: 0 14px` · `display: flex; align-items: center; gap: {spacing.sm}`
- Left: provider logo icon 18px · Label: `{typography.model-pill}` · Right: chevron-down `{colors.icon-default}` 16px.
- Positioned `margin: 0 auto` to stay centered between left and right controls.

**`{component.button-share}`**

- `background: {colors.surface-elevated}` · `border: 1px solid {colors.hairline}` · `border-radius: {rounded.lg}`
- `height: 36px` · `padding: 0 14px` · `display: flex; align-items: center; gap: {spacing.sm}`
- Left: share/export icon `{colors.icon-default}` 16px · Label: `{typography.button-label}`

**`{component.button-ghost}`** — secondary action (not primary)

- `background: {colors.surface-elevated}` · `border: 1px solid {colors.hairline}` · `border-radius: {rounded.lg}`
- `height: 36px` · `padding: 0 14px` · `color: {colors.ink}` · `font: {typography.button-label}`
- Use whenever a second CTA is needed — never use lime for a second button.

### Welcome Canvas

**`{component.welcome-headline}`**

- `color: {colors.ink}` · `font: {typography.welcome-headline}` · `text-align: center`

**`{component.welcome-subtitle}`**

- `color: {colors.mute}` · `font: {typography.welcome-subtitle}` · `text-align: center`
- `margin-top: {spacing.sm}` (8px) below headline.

**`{component.prompt-card}`** — suggestion chip

- `background: {colors.surface-card}` · `border: 1px solid {colors.hairline}` · `border-radius: {rounded.xl}`
- `padding: {spacing.xxl}` (24px) · `min-height: 90px` · `cursor: pointer`
- Title: `{typography.card-title}` `{colors.ink}` · Sub: `{typography.card-body}` `{colors.mute}` · `margin-top: {spacing.xs}`
- Hover: `background: {colors.surface-elevated}` · `border-color: {colors.hairline-strong}`

### Message Input

**`{component.input-bar}`**

- `background: {colors.surface-input}` · `border: 1px solid {colors.hairline-strong}` · `border-radius: {rounded.xl}`
- `padding: 14px 16px` · `min-height: 80px` · `display: flex; flex-direction: column; justify-content: space-between`
- Textarea: `background: transparent` · `color: {colors.ink}` · `font: {typography.input-text}` · `border: none; outline: none; resize: none`
- Placeholder color: `{colors.placeholder}`
- Focus state: `border-color: {colors.accent-blue}`
- Bottom row: attachment `+` icon left (`{colors.icon-default}` 18px) · send button right.

**`{component.send-button}`**

- `background: {colors.surface-elevated}` · `color: {colors.ink}` · `border-radius: {rounded.full}` · 32×32px · `border: none`
- Has-text / active state: `background: {colors.ink}` · `color: {colors.canvas}`
- Mobile: scales to 40×40px.

---

## Do's and Don'ts

### Do

- Use `{colors.canvas}` (`#141414`) as the page background. Warm near-black, never `#000000`.
- Reserve `{colors.accent-lime}` exclusively for `{component.button-new-chat}`. One lime surface, one per viewport.
- Step surface layers by exactly `#080808` per elevation level.
- Use opacity to carry text hierarchy — drop to `{colors.mute}` (50%) for secondary, `{colors.placeholder}` (35%) for hints.
- Set cards and inputs to `{rounded.xl}` (16px), the New Chat button to `{rounded.xxl}` (20px), pills to `{rounded.full}`.
- Keep the top bar to three zones only: [icon left] — [model pill centered] — [action right].
- Place the theme toggle in `{component.sidebar-bottom-bar}` only.
- Use `{component.button-ghost}` for any second CTA — never a second lime button.

### Don't

- Don't use `#000000` as the canvas. The system lives on `#141414`.
- Don't add a second saturated accent. Lime is the entire accent vocabulary.
- Don't use lime for text, icons, borders, or backgrounds other than `{component.button-new-chat}`.
- Don't add drop shadows. This system has no shadow language.
- Don't define a theme-toggle in the top bar — it belongs to the sidebar bottom bar only.
- Don't exceed `{rounded.xxl}` for any button radius.
- Don't break the single-font-family rule. One grotesque, everywhere.
- Don't skip elevation steps. `#141414 → #1c1c1c → #222222 → #2a2a2a` — never compress.
- Don't merge `{colors.surface-input}` and `{colors.surface-card}` — they serve distinct layout roles despite both being near-black.

---

## Responsive Behavior

### Breakpoints

| Name         | Width       | Key Changes                                                            |
| ------------ | ----------- | ---------------------------------------------------------------------- |
| Desktop XL   | ≥ 1440px    | Full sidebar 275px, 2-up prompt grid, input max-width 680px.           |
| Desktop      | 1280–1439px | Sidebar unchanged; main area compresses.                               |
| Tablet Large | 1024–1279px | Sidebar collapses to icon-only rail (64px); labels hidden.             |
| Tablet       | 768–1023px  | Sidebar hidden; top bar gains hamburger icon.                          |
| Mobile       | ≤ 767px     | Full-screen canvas; sidebar is slide-in drawer; prompt cards 1-column. |

### Touch Targets

- `{component.button-new-chat}`: 44px tall all breakpoints — WCAG AA.
- `{component.sidebar-nav-item}`: 40px desktop → 48px mobile (padding adjustment).
- `{component.send-button}`: 32px desktop → 40px mobile.
- `{component.model-selector-pill}`: 36px all breakpoints.

### Collapsing Strategy

- Sidebar rail at tablet: labels fade out, New Chat becomes a `+` icon-only circle (40×40px, `{rounded.full}`, lime bg).
- Welcome headline clamps: 36px → 28px → 22px across breakpoints.
- Prompt cards: `grid-template-columns: 1fr 1fr` → `1fr` at ≤ 767px.
- Input padding: 32px → 16px at mobile.
- Model selector label: truncates with ellipsis below 900px; icon always visible.

---

## Iteration Guide

1. **Lime scarcity is non-negotiable.** If a second component requests lime, push back — use `{component.button-ghost}` instead.
2. **Elevation steps are fixed at `#080808`.** Do not introduce a value between steps or skip a step.
3. **New interactive text** defaults to `{colors.mute}` at rest, `{colors.ink}` on hover/active.
4. **Border radius rule**: pill/selector → `{rounded.full}` · card/input → `{rounded.xl}` · primary button → `{rounded.xxl}` · secondary button/search → `{rounded.lg}`.
5. **Icon set**: Lucide or Phosphor only. 18px nav · 16px inline · 20px top-bar actions. Do not mix sets.
6. **Shadows are never the answer.** If a surface feels flat, raise its background one level and add `{colors.hairline-strong}` border.
7. **Theme toggle placement**: sidebar bottom bar only. Never duplicated into the top bar.

---

## Known Gaps

- Active/selected sidebar chat item state not shown in source design — infer `background: {colors.surface-card}` + `color: {colors.ink}`.
- Message bubble styles (user + assistant turns) are out of scope — derive from the surface system when implementing.
- Typing indicator animation is undocumented.
- Mobile drawer open/close transition is unspecified.
- OpenBot logomark SVG geometry (two-circle mark) is inferred; exact paths require asset delivery.
- Light-mode palette is fully undefined — the sun icon in the sidebar implies it exists but no light-surface screen was provided. Treat as out of scope until delivered.
