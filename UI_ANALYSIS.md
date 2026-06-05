# UI Analysis — Elysium AI Screenshot

## Supplement to DESIGN.md (OpenBot)

This document is a deep, pixel-level analysis of the reference screenshot.
It is intended to be read **alongside** the existing DESIGN.md.
Where DESIGN.md defines tokens and intent, this document describes **exact observed values** and **visual behavior** as seen in the UI.

---

## Global Observations

- **App name in screenshot**: "Elysium AI" — the DESIGN.md calls it "OpenBot". Apply OpenBot branding but replicate this exact layout.
- **Outer frame**: A light `#e5e5e5`-ish background wraps the app card — this is a mockup shadow/frame and is **not part of the UI itself**. The actual UI card has subtle `border-radius ≈ 16px` outer edge.
- **Viewport impression**: ~1280–1440px desktop. Sidebar is visible and fully expanded. No collapsed state visible.
- **No scrollbar visible**: Content fits the initial viewport cleanly.

---

## Sidebar — Precise Breakdown

### Dimensions

- Width: ~275px (matches DESIGN.md spec)
- Full-height, dark panel
- Separated from main area by a 1px hairline right border (`rgba(255,255,255,~0.08)`)

### Logo Row (top-left)

- **Logomark**: Two overlapping circles — left circle white/light fill, right circle offset below-right, slightly smaller. The two-circle mark appears to use a simple SVG circle overlap. Both circles appear to be `{colors.ink}` / near-white on the dark sidebar.
- **Wordmark**: "Elysium AI" (replace with "OpenBot") — font weight `600`, size ~15px, color `{colors.ink}`. Single space between word and "AI".
- **Collapse icon**: A sidebar-toggle (two vertical lines with arrow) sits at the **top of the main area** (not inside the sidebar logo row). It is a standalone icon in the topbar-left zone, not embedded in sidebar.

### Search Bar

- Full width within sidebar, ~40px tall
- Background: `{colors.surface-input}` (`#1e1e1e`)
- Left-aligned magnifier icon (~16px), `{colors.icon-default}` opacity
- Placeholder: "Search chats..." — `{colors.placeholder}` weight 400
- Border: 1px `{colors.hairline}`, `border-radius: {rounded.lg}` (12px)
- No visible focus ring in screenshot (resting state)
- Margin: ~12px horizontal padding from sidebar edges

### New Chat Button

- **Color**: Lime green — `#a8f251` (matches DESIGN.md exactly)
- **Height**: ~44px
- **Width**: Full sidebar width minus horizontal padding (~16px each side)
- **Border-radius**: ~20px (`{rounded.xxl}`) — very rounded rectangle, not pill
- **Icon**: `⊕` — circle with plus inside, ~18px, color `{colors.accent-lime-on}` (dark green `#0e1a00`)
- **Label**: "New Chat" — weight `600`, ~14px, color `{colors.accent-lime-on}`
- **Layout**: icon + label, left-aligned within button with ~14–16px left padding. Not centered.
- **No border**: Pure solid fill, no outline

### Nav Items

- **Chats**: Chat-bubble icon (square rounded with tail, ~18px) + "Chats" label
- **Settings**: Gear/shield-like icon + "Settings" label
- Both items: `{colors.mute}` text at rest, `{colors.icon-default}` icons
- Height: ~40px, padding: 0 16px
- Icon: left-aligned, ~20px gap between icon and label
- No active/hover state visible in screenshot (both appear at rest)
- `border-radius: {rounded.lg}` (12px) for hover state (not shown)

### Sidebar Bottom Bar

- Pinned to very bottom of sidebar
- Left: **Sun/brightness icon** — theme toggle, ~20–22px, `{colors.icon-default}`
- Right: **User avatar** — ~32px circular photo, real user photo (cropped face), `border-radius: {rounded.full}`, no visible border in screenshot (though DESIGN.md specifies one)
- Padding: ~16px all sides
- Both items on same baseline row, `justify-content: space-between`

---

## Top Bar — Precise Breakdown

### Layout

- 3-zone horizontal layout: [left icon] [center pill] [right action]
- Height: ~60–64px
- Background: `{colors.canvas}` (`#141414`) — same as main area, no distinct background
- Bottom border: 1px hairline (very subtle, barely visible)

### Left Zone — Sidebar Toggle

- Icon: two-panel / sidebar-toggle icon (~20px), `{colors.icon-default}`
- Position: left edge with ~16px padding
- No background, no border, just icon

### Center Zone — Model Selector Pill

- **Label**: "GPT-5.4 Nano"
- **Left icon**: OpenAI-style circular logo (~18px) — appears to be a white/light stylized circle mark
- **Chevron**: Down arrow on right, ~14–16px, `{colors.icon-default}`
- **Background**: `{colors.surface-elevated}` (`#2a2a2a`)
- **Border**: 1px `{colors.hairline}`
- **Border-radius**: `{rounded.full}` (fully pill shaped)
- **Height**: ~36px
- **Padding**: ~0 14px
- **Centered**: `margin: 0 auto` or absolute center in the topbar

### Right Zone — Share Button

- **Label**: "Share"
- **Left icon**: Export/upload arrow icon (~16px) — upward arrow from a box shape
- **Background**: `{colors.surface-elevated}` (`#2a2a2a`)
- **Border**: 1px `{colors.hairline}`
- **Border-radius**: `{rounded.lg}` (12px) — **not** pill-shaped; visibly rectangular with rounded corners
- **Height**: ~36px
- **Padding**: ~0 14px
- **Color**: `{colors.ink}`, weight `600`, ~14px

---

## Welcome Canvas — Precise Breakdown

### Vertical Positioning

- The headline + subtitle block sits **above the vertical center** of the available canvas area (between topbar and input bar).
- Approximate top offset from topbar: ~160–180px
- This leaves deliberate whitespace above prompt cards and before the input bar.

### Headline

- **Text**: "Hello there!"
- **Size**: ~36px
- **Weight**: 700 (bold)
- **Color**: `{colors.ink}` (`#f5f5f5`) — full opacity white
- **Alignment**: centered
- **Letter spacing**: default / 0

### Subtitle

- **Text**: "How can I help you today?"
- **Size**: ~22px
- **Weight**: 400 (regular)
- **Color**: `{colors.mute}` — ~50% opacity white (visibly dimmer than headline)
- **Alignment**: centered
- **Margin-top**: ~8px from headline (`{spacing.sm}`)

### Prompt Cards Grid

- 2 columns, equal width
- **Gap between cards**: ~12px (`{spacing.md}`)
- **Card width**: ~48% of max-width container (each)
- **Max-width container**: ~640–680px, centered in canvas

#### Card 1 — "What's the weather"

- **Title**: "What's the weather" — weight `600`, ~15px, `{colors.ink}`
- **Body**: "In San Francisco?" — weight `400`, ~13px, `{colors.mute}`
- **Background**: `{colors.surface-card}` (`#222222`)
- **Border**: 1px `{colors.hairline}`
- **Border-radius**: `{rounded.xl}` (16px)
- **Padding**: ~22–24px all sides
- **Min-height**: ~88–92px
- **Title-to-body gap**: ~4px (`{spacing.xs}`)

#### Card 2 — "Explain React hooks"

- **Title**: "Explain React hooks"
- **Body**: "like useState and useEffect"
- Same visual treatment as Card 1

### Spacing Between Elements

- Headline → subtitle: ~8px
- Subtitle → prompt cards: ~48–52px (`{spacing.section}` ≈ 48px)
- Prompt cards → input bar: The cards float above the input with ~32–40px gap

---

## Message Input Bar — Precise Breakdown

### Container

- **Background**: `{colors.surface-input}` (`#1e1e1e`)
- **Border**: 1px `{colors.hairline-strong}` (`rgba(255,255,255,0.14)`)
- **Border-radius**: `{rounded.xl}` (16px)
- **Min-height**: ~80–90px
- **Padding**: ~14px 16px
- **Width**: full width of centered content column (~680px max-width area)
- **Position**: docked to bottom, ~32px from canvas bottom edge

### Placeholder Text

- **Text**: "Send a message... (@ to mention, / for commands)"
- **Color**: `{colors.placeholder}` (~35% opacity white)
- **Size**: ~15px, weight 400
- Sits at top of textarea area

### Bottom Action Row

- **Left**: `+` plus icon inside a circle — attachment/context menu button
  - ~18px, `{colors.icon-default}` opacity
  - No background in resting state
- **Right**: Send button (arrow up icon)
  - `background: {colors.surface-elevated}` (`#2a2a2a`) in empty state
  - `border-radius: {rounded.full}` — circular
  - Size: ~32×32px
  - Icon: upward arrow (~14px), `{colors.icon-default}` in empty state
  - Active state (text present): `background: {colors.ink}`, icon color: `{colors.canvas}`
- Both items vertically aligned to the bottom of the input container

---

## Iconography — Observed Set

All icons appear to be from **Lucide** (consistent with DESIGN.md spec).

| Location           | Icon                | Lucide Name (inferred)       |
| ------------------ | ------------------- | ---------------------------- |
| Sidebar logo row   | Two-circle mark     | Custom SVG (not Lucide)      |
| Topbar left        | Sidebar toggle      | `PanelLeft` or `SidebarOpen` |
| Search field       | Magnifier           | `Search`                     |
| New Chat button    | Circle with plus    | `PlusCircle`                 |
| Chats nav          | Chat bubble         | `MessageSquare`              |
| Settings nav       | Gear / shield       | `Settings` or `Settings2`    |
| Model pill         | Provider logo       | Custom (OpenAI-style)        |
| Model pill chevron | Down arrow          | `ChevronDown`                |
| Share button       | Upload/export arrow | `Share` or `Upload`          |
| Theme toggle       | Sun                 | `Sun`                        |
| Input attach       | Plus circle         | `Plus` or `PlusCircle`       |
| Input send         | Arrow up            | `ArrowUp`                    |

**Icon sizing rule** (DESIGN.md + observed):

- Nav icons: 18px
- Topbar icons: 18–20px
- Inline/action icons: 16px
- Send / attachment: 16–18px

---

## Colors — Observed vs Token

| Element               | Observed       | Token                         |
| --------------------- | -------------- | ----------------------------- |
| Page/canvas bg        | ~`#141414`     | `{colors.canvas}` ✓           |
| Sidebar panel         | ~`#1c1c1c`     | `{colors.surface-sidebar}` ✓  |
| Prompt cards          | ~`#222222`     | `{colors.surface-card}` ✓     |
| Model pill / Share bg | ~`#2a2a2a`     | `{colors.surface-elevated}` ✓ |
| Input / Search bg     | ~`#1e1e1e`     | `{colors.surface-input}` ✓    |
| New Chat button       | `#a8f251` lime | `{colors.accent-lime}` ✓      |
| Headline text         | `#f5f5f5`      | `{colors.ink}` ✓              |
| Subtitle / nav labels | ~50% opacity   | `{colors.mute}` ✓             |
| Placeholder           | ~35% opacity   | `{colors.placeholder}` ✓      |
| Hairline borders      | ~8% white      | `{colors.hairline}` ✓         |

All observed values **confirm** the DESIGN.md token system. No discrepancies found.

---

## Spacing Audit

| Context                    | Observed Value | Token                 |
| -------------------------- | -------------- | --------------------- |
| Sidebar horizontal padding | ~16px          | `{spacing.lg}` ✓      |
| Nav item height            | ~40px          | spec ✓                |
| New Chat button height     | ~44px          | spec ✓                |
| Search bar height          | ~40px          | spec ✓                |
| Card internal padding      | ~24px          | `{spacing.xxl}` ✓     |
| Card gap                   | ~12px          | `{spacing.md}` ✓      |
| Headline → subtitle gap    | ~8px           | `{spacing.sm}` ✓      |
| Subtitle → cards gap       | ~48px          | `{spacing.section}` ✓ |
| Input bar height           | ~80–90px       | spec ✓                |
| Topbar height              | ~60–64px       | spec ✓                |

---

## Critical Implementation Notes for Agent

### Things DESIGN.md doesn't specify that are visible in the screenshot:

1. **New Chat button icon is left-aligned**, not centered — text + icon group has ~14px left padding, remaining space is empty to the right.

2. **Sidebar search has magnifier icon embedded on the left** — it's part of the field itself, not floating. Use `position: absolute` or flexbox row with icon + input.

3. **Model selector pill icon is the provider logo** (OpenAI-style circular mark), not a generic model icon. For OpenBot, substitute with a relevant AI provider logo or custom mark.

4. **Topbar sidebar-toggle icon** is in the **main panel** (left edge of top bar), not inside the sidebar. This enables toggling the sidebar from the main view.

5. **Prompt card content is left-aligned**, not centered. Title flush left, body flush left beneath it.

6. **Input placeholder includes feature hints** — "(@ to mention, / for commands)" — this is part of the UX copy, not just generic placeholder text.

7. **Send button is circular** (32×32px) with upward arrow icon. In the empty/resting state: `{colors.surface-elevated}` background with dimmed icon. When text is typed: inverts to `{colors.ink}` background with dark icon.

8. **No chat history visible in sidebar** — screenshot is a fresh/new chat state. The "Chats" section is a nav label, not a list. The list presumably populates below the nav section.

9. **Avatar is a real photo** (circular crop), not an initials placeholder. Implement with `<img>` + `border-radius: 9999px` + `object-fit: cover`.

10. **Outer card rounded corners** — the entire UI panel has ~`border-radius: 16px` which is the app shell itself (useful if embedding in a larger page or iframe).

---

## Agent Build Checklist

Use this as a build checklist to verify completeness:

### Sidebar

- [ ] Logo row: logomark SVG + "OpenBot" wordmark + collapse icon
- [ ] Search input: magnifier icon + placeholder "Search chats..."
- [ ] New Chat button: lime bg, dark label, `⊕` icon, left-aligned content
- [ ] Nav: Chats item (MessageSquare icon) + Settings item (Settings icon)
- [ ] Bottom bar: Sun icon (left) + avatar photo (right)
- [ ] Right border: 1px hairline

### Top Bar

- [ ] Left: PanelLeft icon (sidebar toggle)
- [ ] Center: Model pill — provider icon + "GPT-5.4 Nano" label + ChevronDown (swap model name as needed)
- [ ] Right: Share button — Upload icon + "Share" label
- [ ] Bottom border: 1px hairline

### Welcome Canvas

- [ ] "Hello there!" headline — 36px 700
- [ ] "How can I help you today?" subtitle — 22px 400 muted
- [ ] Prompt cards 2-col grid: "What's the weather / In San Francisco?" + "Explain React hooks / like useState and useEffect"
- [ ] Cards: left-aligned content, surface-card bg, hairline border, xl radius

### Input Bar

- [ ] Textarea: transparent bg, ink text, placeholder text with feature hints
- [ ] Bottom row: Plus icon (left) + circular send button (right)
- [ ] Send button: elevated bg at rest, ink bg when active
- [ ] Input container: surface-input bg, hairline-strong border, xl radius
- [ ] Docked to canvas bottom with xxxl padding

### Global

- [ ] Canvas bg: `#141414`
- [ ] Font: Geist (import from Google Fonts)
- [ ] No drop shadows anywhere
- [ ] Single lime accent — only on New Chat button
- [ ] All icons from Lucide at correct sizes
