# Build Plan — Alex Morgan Portfolio (Astro + Content Collections)

> A production-grade personal developer portfolio rebuilt with **Astro 7** (static output, zero-JS by default), **Content Collections** (Content Layer API) for content, **Tailwind CSS 4** for styling, and CSS/IntersectionObserver-based motion. Dark, premium, "product studio" aesthetic. Runs on **Node 24** (Astro requires ≥ 22.12; even-numbered LTS only).

---

## Phase 0 — Scaffolding & Tooling

### Step 0.1 — Clean out the previous Next.js scaffold
- [ ] Delete Next.js artifacts: `src/`, `node_modules/`, `.next/`, `next.config.ts`, `next-env.d.ts`, `mdx-components.tsx`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.tsbuildinfo`, `bun.lock`
- [ ] Keep: `PLAN.md`, `README.md`, `.gitignore`, `public/` (reusable assets), `AGENTS.md`, `CLAUDE.md`

### Step 0.2 — Pin Node 24
- [ ] Add `.nvmrc` containing `24`
- [ ] Add `"engines": { "node": ">=24" }` to `package.json`
- [ ] Verify with `node --version` → v24.x

### Step 0.3 — Initialize Astro project
- [ ] Run `npm create astro@latest . -- --template minimal --install --no-git`
- [ ] At prompts: choose TypeScript → **strict**
- [ ] Verify dev server runs: `npm run dev`

### Step 0.4 — Install core dependencies
- [ ] MDX: `npx astro add mdx --yes` (adds `@astrojs/mdx` + registers integration in `astro.config.mjs`)
- [ ] Tailwind 4: `npx astro add tailwind --yes` (wires `@tailwindcss/vite` plugin; no config file needed — tokens live in CSS `@theme`)
- [ ] Icons: `@lucide/astro`
- [ ] Utility: `clsx`, `tailwind-merge` (for `cn()` helper)
- [ ] Type checking: `npm install -D @astrojs/check typescript` → add `"check": "astro check"` script

### Step 0.5 — Project structure
```
src/
  content.config.ts     # Content Collections: projects (glob), experience + skills (file/JSON)
  content/
    projects/*.mdx      # Project data + case study bodies
    experience.json     # Timeline entries (one array item = one entry)
    skills.json         # Skill categories + metadata
  layouts/
    BaseLayout.astro    # <head>, fonts, metadata, background system, Navbar/Footer
  pages/
    index.astro         # Assembles all sections
    projects/[slug].astro  # Case study routes (getStaticPaths + render)
  components/
    layout/             # Navbar, Footer, Container, SectionHeading
    sections/           # Hero, About, Skills, Projects, Process,
                        # Experience, Principles, Contact
    visuals/            # PortraitScene, ProjectPreview*, GridBackground,
                        # NodeNetwork, GlowLine, StatusDot, TechTag
    ui/                 # Button, Card, Badge, GlassPanel, Reveal
  styles/
    global.css          # Tailwind import + @theme design tokens + base styles
  lib/
    utils.ts            # cn(), formatting helpers
```

---

## Phase 1 — Design System Foundation

### Step 1.1 — Color tokens (in `styles/global.css` via Tailwind 4 `@theme`)
- [ ] Background base: near-black charcoal `#0A0B0E`–`#0D0F14`
- [ ] Surface: dark graphite `#111318` / `#15181F`
- [ ] Accent: electric blue `#3B82F6` → cyan `#22D3EE` (gradient pair)
- [ ] Text: off-white `#E8EAED`; secondary: cool gray `#8B93A1`
- [ ] Border: `rgba(255,255,255,0.08)` thin 1px system
- [ ] Glow: `rgba(59,130,246,0.15)` soft, restrained

### Step 1.2 — Typography (self-hosted via Fontsource)
- [ ] Headings: **Space Grotesk** — `@fontsource-variable/space-grotesk`
- [ ] Body: **Inter** — `@fontsource-variable/inter`
- [ ] Mono (tech labels, project numbers, metadata): **JetBrains Mono** — `@fontsource-variable/jetbrains-mono`
- [ ] Import fonts in `BaseLayout.astro`; expose as CSS variables (`--font-heading`, `--font-body`, `--font-mono`) through `@theme`

### Step 1.3 — Global UI primitives (`components/ui/`, all `.astro`)
- [ ] `Button` — primary (gradient border/glow) + secondary (ghost) variants, refined hover
- [ ] `Card` / `GlassPanel` — thin border, subtle glass `backdrop-blur`, rounded-xl (not overly soft)
- [ ] `Badge` / `TechTag` — mono font, small, bordered
- [ ] `SectionHeading` — eyebrow (mono, uppercase, cyan) + large heading + optional subtitle
- [ ] `Reveal` — scroll-triggered fade/slide wrapper: IntersectionObserver adds a class, CSS handles the transition; `data-reveal-delay` for stagger; no framework runtime

### Step 1.4 — Background system (`components/visuals/`)
- [ ] `GridBackground` — fine 1px grid, extremely subtle, fixed behind content
- [ ] `NodeNetwork` — abstract nodes + thin connection lines with slow glow animation (CSS keyframes)
- [ ] `GlowLine` / radial gradient orbs — soft blue/cyan ambient light
- [ ] Ensure all backgrounds are decorative (`aria-hidden`, pointer-events-none)

---

## Phase 2 — Layout Shell

### Step 2.1 — Navbar (`components/layout/Navbar.astro`)
- [ ] Sticky, transparent → translucent glass on scroll (tiny inline script toggles a class on scroll; `backdrop-blur` + border-bottom appears)
- [ ] Left: "Alex Morgan" + mono descriptor "Product Engineer"
- [ ] Right links: About, Skills, Projects, Experience, Contact (smooth-scroll to `#id`)
- [ ] "Let's Talk" CTA button (small, subtle glow)
- [ ] Mobile: hamburger → clean full-screen/slide-down menu, animated (details/popover or small script)

### Step 2.2 — BaseLayout (`layouts/BaseLayout.astro`)
- [ ] Global metadata: title, description, OG tags (fictional Alex Morgan branding)
- [ ] Fonts, background layers, Navbar + `<slot />` + Footer composition
- [ ] Smooth scroll behavior, selection color, scrollbar styling
- [ ] Optional: `<ClientRouter />` from `astro:transitions` for animated navigation to case studies

### Step 2.3 — Footer
- [ ] Left: Alex Morgan / Solo Product Engineer
- [ ] Links: About, Projects, Experience, Contact
- [ ] Status: `● Open to interesting projects` (pulsing dot)
- [ ] Bottom line: `© 2026 Alex Morgan. Built with intention.`

---

## Phase 3 — Content Layer (Content Collections)

### Step 3.1 — `src/content.config.ts`
- [ ] `projects` collection — `glob({ pattern: "**/*.mdx", base: "./src/content/projects" })` with Zod schema:
```ts
import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    number: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    github: z.string().url(),
    gradient: z.string(),
    order: z.number().default(99),
  }),
});

const experience = defineCollection({
  loader: file("./src/content/experience.json"),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    period: z.string(),
    location: z.string(),
    description: z.string(),
  }),
});

const skills = defineCollection({
  loader: file("./src/content/skills.json"),
  schema: z.object({
    category: z.string(),
    icon: z.string(),
    items: z.array(z.object({
      name: z.string(),
      meta: z.enum(["primary", "exploring"]),
      years: z.number().optional(),
    })),
  }),
});

export const collections = { projects, experience, skills };
```
- [ ] Query with `getCollection("projects")` and sort by `order`; invalid frontmatter fails the build with a clear Zod error

### Step 3.2 — Projects as MDX (`src/content/projects/*.mdx`)
Each project file uses frontmatter + MDX body (fallback case study):
```mdx
---
title: Flowboard
number: "01"
description: AI-powered project management platform.
tags: [Astro, TypeScript, PostgreSQL, AI]
github: https://github.com/alexmorgan/flowboard
gradient: from-blue-500/20 to-cyan-500/10
order: 1
---
```
- [ ] Flowboard, Pulse Analytics, DevFlow, LaunchKit
- [ ] Keep structured data in frontmatter so it's trivially replaceable

### Step 3.3 — Experience & skills data
- [ ] `content/experience.json` — JSON array (role, company, period, description, location); one item = one collection entry
- [ ] `content/skills.json` — 4 categories (Frontend / Backend / Infrastructure / AI & Development), each item with name + small technical metadata (`"primary"`, `"exploring"`, years)
- [ ] Designed for drop-in replacement with real data

---

## Phase 4 — Sections (in page order, `pages/index.astro`)

### Step 4.1 — Hero (`sections/Hero.astro`)
- [ ] Eyebrow: `SOLO PRODUCT ENGINEER` (mono, cyan, tracking-wide)
- [ ] H1: "I turn ideas into products." (large, gradient text on key word)
- [ ] Supporting paragraph (from brief)
- [ ] CTAs: "View Projects" (primary) / "Let's Talk" (ghost)
- [ ] Status pill: `● Available for selected projects` (green pulse)
- [ ] Right: `PortraitScene` component
  - Developer portrait (generate placeholder: gradient silhouette or local image in `public/`)
  - Floating glass cards: mini code snippet, architecture nodes, metrics sparkline, tech chips (`TypeScript`, `Astro`, `Node.js`, `PostgreSQL`)
  - Subtle parallax on floats (CSS `translate` on hover), slow float animation
- [ ] Bottom: scroll hint / marquee of tech stack (optional, restrained)

### Step 4.2 — About (`sections/About.astro`) — id="about"
- [ ] Split layout: left sticky heading "Building products, not just writing code."
- [ ] Right: concise biography (independent dev, idea → design → architecture → ship)
- [ ] Stats grid: `5+ Years` / `20+ Projects shipped` / `12 Products launched` / `100% Independent`
- [ ] Large mono/gradient numerals, small gray captions; count-up animation on reveal (IO-triggered)

### Step 4.3 — Skills (`sections/Skills.astro`) — id="skills"
- [ ] Heading: "Tools I use to build products."
- [ ] 4 category cards in responsive grid from `getCollection("skills")`; each card: icon, category label (mono), tech list
- [ ] Each tech row: name + metadata chip (no percentage bars)
- [ ] Hover: card lifts slightly, border glows blue, icon tint shifts

### Step 4.4 — Projects (`sections/Projects.astro`) — id="projects"
- [ ] Heading "Selected work" + subtitle
- [ ] Large cards (full-width or 2-col on desktop, stacked on mobile), alternating layout, from `getCollection("projects")` sorted by `order`
- [ ] Each card: mono number `01`, name, description, TechTags, and a **custom fake UI preview**:
  - `FlowboardPreview` — SaaS kanban/dashboard mock (columns, cards, sidebar)
  - `PulsePreview` — analytics dashboard (line/bar charts in SVG, stat cards)
  - `DevFlowPreview` — terminal/automation workflow UI (nodes, logs)
  - `LaunchKitPreview` — premium SaaS layout (pricing/auth UI mock)
- [ ] Previews built from pure HTML/SVG in brand palette, gentle parallax, hover shift
- [ ] Links: "View Case Study →" + GitHub icon
- [ ] Case study pages wired to `/projects/[slug]` routes (Phase 6)

### Step 4.5 — Process (`sections/Process.astro`) — "How I build"
- [ ] 4 steps: 01 Understand / 02 Design / 03 Build / 04 Ship
- [ ] Horizontal on desktop with connecting animated gradient line, vertical on mobile
- [ ] Mono numbers, short descriptions, subtle node markers on the line

### Step 4.6 — Experience (`sections/Experience.astro`) — id="experience"
- [ ] Vertical timeline: thin line, node dots, glass cards
- [ ] Entries from `getCollection("experience")` (3 roles, 2018–present)
- [ ] Hover highlight; clearly data-driven for easy replacement

### Step 4.7 — Principles (`sections/Principles.astro`) — "What I believe"
- [ ] Large typographic statements list with faint background grid/pattern
- [ ] Each principle reveals on scroll with stagger; key words in gradient/mono
- [ ] Statements: "Good software starts with good thinking." / "Simple systems scale better." / "AI should amplify engineers…" / "Ship → learn → improve."

### Step 4.8 — Contact (`sections/Contact.astro`) — id="contact"
- [ ] Big heading: "Have an idea worth building?"
- [ ] Supporting quote, primary CTA `mailto:hello@alexmorgan.dev` "Start a conversation"
- [ ] Secondary: `hello@alexmorgan.dev` link
- [ ] Social icons: GitHub, LinkedIn, X
- [ ] Ambient glow + node background, glass panel composition

---

## Phase 5 — Motion & Interaction Pass

- [ ] `Reveal` wrapper: fade + 16–24px slide-up via IntersectionObserver + CSS transitions, `once` behavior, small stagger between siblings (`data-reveal-delay`)
- [ ] Navbar: smooth background/height transition on scroll
- [ ] Buttons: subtle glow/brightness hover, scale-`[1.02]`, fast transitions (150–250ms)
- [ ] Project cards: `-translate-y-1`, border-glow on hover; preview elements parallax slightly
- [ ] Connection lines/nodes: slow opacity/position pulse (CSS keyframes, GPU-friendly)
- [ ] Respect `prefers-reduced-motion` globally (media query kills all reveals/animations)
- [ ] Zero framework runtime by default — only tiny inline scripts for scroll state, reveal trigger, count-up; no React islands
- [ ] Audit: no excessive animation — fast, intentional, premium

---

## Phase 6 — Case Study Routes (MDX pages)

- [ ] `src/pages/projects/[slug].astro`:
```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
```
- [ ] Styled prose layer (`.prose`-style rules for `h2`, `p`, `code`, lists in `global.css`) — no @tailwindcss/typography needed unless desired
- [ ] "View Case Study" links resolve to `/projects/[entry.id]`; back link to `/#projects`
- [ ] Fallback case study content per project (problem, approach, stack, outcome) lives in each MDX body

---

## Phase 7 — Responsive & polish

- [ ] Breakpoint audit: 375 / 768 / 1024 / 1280 / 1536
- [ ] Mobile: hamburger menu, stacked cards, portrait prominent, no horizontal overflow (`overflow-x: clip` on body)
- [ ] Generous spacing preserved on mobile; typography scales with `clamp()`
- [ ] Focus-visible states, semantic HTML, skip-to-content link
- [ ] Image placeholder for portrait in `/public` with proper `alt`; consider `astro:assets` `<Image />` if raster
- [ ] SEO: meta/OG per page; `npx astro add sitemap --yes` + set `site` in `astro.config.mjs`; add `robots.txt`

---

## Phase 8 — Verification & Ship

- [ ] `npm run check` (`astro check`) clean — note: Astro 7's Rust compiler is strict about unclosed tags and invalid HTML nesting; fix all errors
- [ ] `npm run build` succeeds (validates MDX compilation + Zod schemas at build time)
- [ ] `npm run preview` — manual pass: all anchor links, mobile menu, hover states, reduced-motion
- [ ] Lighthouse: performance/a11y best-effort (self-hosted fonts, SVG visuals, near-zero JS)

---

## Tech Stack Summary

| Layer     | Choice |
|-----------|--------|
| Runtime   | Node 24 (`.nvmrc` + `engines`) — Astro 7 requires ≥ 22.12 |
| Framework | Astro 7 (static output, TypeScript strict) |
| Content   | Content Collections (Content Layer API): `glob` loader for MDX projects, `file` loader for JSON experience/skills, Zod-validated |
| Styling   | Tailwind CSS 4 via `@tailwindcss/vite` + `@theme` tokens in CSS |
| Motion    | CSS keyframes + IntersectionObserver reveals (no runtime frameworks) |
| Icons     | `@lucide/astro` |
| Fonts     | Space Grotesk · Inter · JetBrains Mono (Fontsource variable, self-hosted) |

## Key Constraints (from brief)

- Dark charcoal + electric blue/cyan; **subtle** gradients/glows — no cyberpunk
- Premium software-interface cards, thin 1px borders, fine grids, mono tech labels
- Fictional content structured for easy replacement with real data (frontmatter + JSON)
- Feel: premium SaaS site × design studio × engineering portfolio
