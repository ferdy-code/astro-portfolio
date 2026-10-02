# Design System: Ferdy Portfolio

> As-built design reference for Muhammad Ferdy Ardiansyah's portfolio. `PLAN.md` was the original build checklist; this file describes what ships now. Keep it in sync when the design changes. UI work is also filtered through antislop (see `anti-slop/` for audits).

**Design Read:** personal developer portfolio for hiring managers and collaborators, in a quiet, dark product-interface style.

**Dial: ENERGY 2 / RHYTHM 2 / MOTION 2**
- ENERGY 2: confident but restrained. One gradient moment (hero headline word + primary CTA), everything else neutral.
- RHYTHM 2: consistent sections with a few breaks (alternating project cards, sticky split About, timeline Experience, typographic Principles list).
- MOTION 2: one-shot scroll reveals, the About count-up, and hover states, plus three ambient loops kept by owner choice (2026-10-03): floating hero cards and scroll arrow, pulsing status dots, and the animated node network behind Contact. All of them stop under `prefers-reduced-motion`. Don't add more idle loops.

---

## 1. Tokens

All tokens live in `src/styles/global.css` under Tailwind 4's `@theme`, consumed as utilities (`bg-ink`, `text-fg-muted`, `font-heading`).

### Color

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0a0b0e` | Page background |
| `--color-ink-2` | `#0d0f14` | Footer / secondary layer |
| `--color-surface` | `#111318` | Cards |
| `--color-surface-2` | `#15181f` | Raised fill (primary button, portrait frame) |
| `--color-fg` | `#e8eaed` | Primary text, emphasized words |
| `--color-fg-muted` | `#8b93a1` | Secondary text, labels, timeline markers (5.4:1 on surface, 5.8:1 on ink) |
| `--color-line` | `rgb(255 255 255 / 0.08)` | 1px borders, timeline lines |
| `--color-accent` | `#3b82f6` | Accent: focus ring, selection, small syntax highlights in previews |
| `--color-accent-cyan` | `#22d3ee` | Second stop of the one gradient |
| `--color-glow` | `rgb(59 130 246 / 0.15)` | Primary button hover only |

**Why this palette:** dark because the site sits next to the tools it talks about (editors, terminals, Telegram bots). It reads as an engineer's workspace, not a "tech" costume. Blue/cyan is used once, as a gradient on the hero's "RAG and agents" and the primary CTA border, to mark the one idea the page is about. Everything else stays neutral so that moment lands.

**Background:** `GridBackground` (a fine 72px grid fading out from the top, plus three soft blue/cyan blobs) sits fixed behind every page. The owner kept it on 2026-10-03; it's the site's ambient layer, so don't stack more background effects on top.

**Rules:**
- The `text-gradient` utility is used only in the Hero headline. Don't add it elsewhere.
- Glow (`--color-glow`) is used only on the primary `Button` hover.
- Hover states on cards and icons change border to `white/16`. No colored borders, no shadows.
- Emphasis inside text uses contrast (`fg` on `fg-muted`), not color (see Principles).

### Typography

| Token | Font | Use |
|---|---|---|
| `--font-heading` | Space Grotesk Variable | Headings, buttons |
| `--font-body` | Inter Variable | Body copy |
| `--font-mono` | JetBrains Mono Variable | Small metadata: section labels, numbers, dates, tags, status |

**Why these fonts:** Space Grotesk's slightly mechanical shapes suit an engineer's portfolio without going full monospace. Inter keeps long paragraphs readable at small sizes. JetBrains Mono is the font Ferdy reads code in every day, so it marks "this is metadata" the same way it does in an editor.

**Copy:** no em dashes in page text; use commas, colons, or periods.

**Rules:** labels are sentence case at normal tracking (`font-mono text-xs`/`text-sm text-fg-muted`). No uppercase, wide-tracked eyebrows. Headline sizes use `clamp()`.

### Radius & elevation

`rounded-md` for buttons, badges, and tags; `rounded-lg` for icon buttons; `rounded-xl`/`2xl` for cards and frames; `rounded-full` only for dots and avatars. No resting shadows. Glass (`backdrop-blur`) is used only on the Navbar once scrolled and on its mobile menu, so content stays readable underneath.

---

## 2. Components

### `ui/`
- **Button**: `primary` (gradient border + hover glow, the page's one accent) and `ghost` (neutral). Sizes `sm`/`md` are 44px tall, `lg` is 48px. Renders `<a>` when `href` is set.
- **Card**: solid `surface/70`, 1px line border. `hoverable` brightens the border only.
- **Badge / TechTag**: mono, `rounded-md`, original casing. Badge `accent` tone = brighter neutral (marks "primary" skills).
- **SectionHeading**: mono sentence-case label, heading, optional subtitle.
- **SocialIcon**: 44px icon link, neutral hover. Supports `github`, `linkedin`, `x`.
- **Reveal**: one-shot IntersectionObserver fade/slide-up. Content stays visible without JS (`.js` gate) and under `prefers-reduced-motion`.

### `visuals/`
- **StatusDot**: 8px dot with a slow ping ring, marking a real state (project status, "Building in public").
- **PortraitScene**: the hero visual. Neutral silhouette placeholder (to be replaced by a real photo) plus three slowly floating cards (code, RAG pipeline, stack tags).
- **GridBackground**: the site-wide ambient background (see Color).
- **NodeNetwork**: animated SVG nodes and dashed lines, used only behind the Contact card at 40% opacity.
- **previews/**: one abstract mock per project, `aria-hidden`. `AgentsPreview` is a Telegram-style chat list because the product is Telegram bots.

### `sections/` (page order)
Hero, Projects, About, Skills, Experience, Principles, Contact. Projects come right after the hero because they're the main evidence for a hiring reader. Principles ("How I work") covers what the old Process section said. Each section is its own `.astro` file; the nav ones have an `id` anchor.

### `layout/`
- **Navbar**: sticky. Becomes translucent glass with a border after 24px of scroll. 44px hamburger, mobile menu closes on Escape or link click.
- **Footer**: name, tagline, status, section links (44px targets).

---

## 3. Content

Content Collections in `src/content.config.ts`, validated with Zod at build time:

| Collection | Loader | Source |
|---|---|---|
| `projects` | `glob` | `src/content/projects/*.mdx`: `title, number, description, tags, status, github?, gradient, order`. The body is the case study at `/projects/[slug]`. |
| `experience` | `file` | `src/content/experience.json` |
| `skills` | `file` | `src/content/skills.json`: `icon` is a key in `Skills.astro`'s `iconMap` |

All copy, numbers, and statuses are Ferdy's real data. Don't add stats, testimonials, or logos without a real source.

Case-study prose is styled by the global `.case-study` rules in `global.css` (neutral markers and links).

---

## 4. Motion

- Reveal: 20px slide-up + fade, `cubic-bezier(0.22, 1, 0.36, 1)`, 700ms, once.
- Hover: 150–250ms, color/border changes; cards with links (Projects) lift 4px.
- Count-up on the About stat runs once when it scrolls into view.
- Ambient loops (owner choice): `animate-float`/`animate-float-slow` on the hero cards and scroll arrow, `animate-ping` on StatusDot, and `animate-node-glow`/`animate-dash-flow` in NodeNetwork. Tokens live in `global.css`.
- `prefers-reduced-motion` disables all of it globally.
- Scripts are small and inline, and re-run on `astro:after-swap`. No framework islands.

## 5. Stack

Astro 7 (static, strict TS) · Tailwind CSS 4 via `@tailwindcss/vite` · Content Layer + Zod · `@lucide/astro` icons · Fontsource Variable fonts · `@astrojs/mdx`, `@astrojs/sitemap` · Node ≥ 24.
