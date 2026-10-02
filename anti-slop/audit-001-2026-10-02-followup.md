# antislop audit 001: follow-up (2026-10-02)

Approved: all (1–10). Owner decisions: keep blue/cyan but limit the gradient to one moment; keep the fonts and drop the uppercase tracked labels; dials 2 / 2 / 2.

| # | Rule | Status | What changed |
|---|---|---|---|
| 1 | R-03 | Fixed | `Button` sm/md now 44px tall; hamburger 44px; `SocialIcon` 44px; mobile menu links, footer links, "View Case Study", back link, email link, and scroll hint all have `min-h-11`. Removed the `h-8 w-8` override on project GitHub icons. |
| 2 | R-13 | Fixed | Glow is only on the primary `Button` hover now. Removed it from SocialIcon, Skills cards, Card, Projects cards, Process nodes, Presensi preview, and the portrait aura. GridBackground orbs were removed with #4. |
| 3 | R-01 | Fixed | `text-gradient` is only on the Hero's "AI-powered"; the gradient border is only on the primary Button. Process/Experience lines are `bg-line`, markers neutral, hover borders `white/16`. Cyan removed from eyebrows, numbers, company names, Badge, previews, and case-study prose. Principles emphasis uses `fg` on `fg-muted`. |
| 4 | R-07 | Fixed | Removed `GridBackground` (grid + 3 orbs) from `BaseLayout` and deleted it, along with the inner grid in PortraitScene. |
| 5 | R-10 | Fixed | Glass only on the Navbar (scrolled) and its mobile menu. Contact and the portrait cards use the solid `Card`; removed blur from the Hero status pill. Deleted `GlassPanel`. |
| 6 | R-19 | Fixed | `StatusDot` is a static dot. Removed the infinite float on portrait cards and the scroll chevron, the cursor pulse in AgentsPreview, and NodeNetwork's loops (component deleted). Removed the unused `float`/`node-glow`/`dash-flow` tokens and keyframes. |
| 7 | R-04 | Fixed | Replaced the "AI & LLM Engineering" icon `sparkles` with `message-square-code` (chat + code fits Claude Code, the AI SDK, and prompting). Skill icons are now neutral. |
| 8 | R-06 | Fixed | The font reason is written in `DESIGN.md`. Every eyebrow, tagline, skill label, status line, and TechTag is sentence case with normal tracking. |
| 9 | R-05 | Fixed | `AgentsPreview` is now a Telegram-style chat list (initial avatars, name, role, live dot) instead of terminal chrome. |
| 10 | Part 3 | Fixed | `DESIGN.md` declares the Design Read and `Dial: ENERGY 2 / RHYTHM 2 / MOTION 2`. |

Also corrected in `DESIGN.md`: its title said "Alex Morgan" (copied from `PLAN.md`); it now names Ferdy and describes the current components.

## Verification (R-35)
- `npm run build`: passes, 5 pages.
- `npm run check`: 1 error, which was already there before these changes (see new finding 12).
- Every route was fetched from `astro preview`: `/` and all 4 `/projects/*` return 200.
- Anchors `#about #skills #projects #experience #contact #main` all resolve. `#top` has no element but scrolls to the top by HTML spec.
- Rendered HTML contains no `animate-ping`, no `animate-float`, no wide-tracked uppercase labels, and one `text-gradient`.
- **Not done:** a manual click-through in a real browser (no browser tooling this session). Please check by hand: open/close the mobile menu (button + Escape), the hover states, the hero at 375px width, and that "Start a conversation" opens mail.

## New findings (not fixed, need a decision)
11. **[R-17, MEDIUM] `PortraitScene` "Outside the day job" sparkline** draws a rising trend with no data behind it. The "5–10 hrs/wk" label is real; the line isn't. Options: remove the line, or replace it with something factual.
12. **[R-26, HIGH] Threads icon renders empty.** `Contact.astro` passes `name="@"`, but `SocialIcon` only supports `github | linkedin | x`. The link works but shows a blank 44px box, and it's the `astro check` error. The fix is to add a real Threads SVG path to `SocialIcon` (from the official brand asset).
13. **[R-09, LOW] Hero eyebrow repeats the H1.** "Fullstack developer, AI-powered" sits right above "Fullstack development. AI-powered by default." Consider cutting it or saying something the H1 doesn't (e.g. location).

## Owner overrides (2026-10-03)
- **#4 (R-07) reverted by owner:** `GridBackground` (grid + radial blobs) is restored site-wide. Recorded in `DESIGN.md`.
- **#6 (R-19) partly reverted by owner:** the floating hero cards and scroll arrow, the pulsing StatusDot, and the animated NodeNetwork behind Contact are restored. They still stop under `prefers-reduced-motion`. Recorded in `DESIGN.md`.
- Everything else from the follow-up stays as fixed.
