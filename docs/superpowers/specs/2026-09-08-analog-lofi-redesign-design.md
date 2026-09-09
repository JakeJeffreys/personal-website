# Analog Lo-Fi Redesign — Design Spec

- **Date:** 2026-09-08
- **Status:** Approved, pending implementation plan
- **Scope:** Visual redesign of jakejeffreys.dev. No content, routing, or data-fetching changes.

---

## 1. Problem

The site is competently built but reads as plain. The cause is not missing features — it already
has a ⌘K command palette, a WebGL globe, a Konami easter egg and a contribution heatmap. The cause
is that every individual visual choice is the median choice for a developer portfolio, and they
compound:

- **Palette:** dark navy `#0a0f1e` + sky-blue `#38bdf8` accent — the most common dev-portfolio
  palette in existence.
- **Type:** Geist Sans + Geist Mono, single weight axis, headings at `text-3xl`/`text-4xl`.
  Identical to the Vercel starter.
- **Layout:** all seven sections are `py-24 px-6` → `max-w-5xl mx-auto` → centered heading → grid.
  One rhythm, no variation, nothing asymmetric, nothing bleeding out of the column.
- **Section headings:** all seven use the identical `h-px w-12 rounded-full` accent bar followed by
  `h-px flex-1` rule.
- **Motion:** every section uses the same fade-up-28px-on-scroll. Uniform motion reads as no motion.
- **Decoration:** blurred gradient blobs + dot grid is the default "make it less flat" move and no
  longer registers as intentional.

The deeper issue: the novelty features are bolted onto a neutral template rather than expressions of
a coherent idea. Adding an eighth feature would not fix this.

## 2. Decision

Adopt **Analog Lo-Fi**: a paper-and-ink aesthetic where imperfection is the organising principle.
Warm paper ground, real grain, cards rotated fractionally off-axis with hard offset shadows,
handwriting for display type, dashed rules, tape and sticker elements.

This was chosen over three alternatives (Brutalist Terminal, Editorial Print, Kinetic Dark). It is
the strangest of the four and the only one where the person outruns the résumé — which suits a site
carrying fifteen listed interests and a photo feed.

Three scope decisions were made alongside it:

| Decision | Choice |
|---|---|
| **Intensity** | Playful everywhere **except Experience**, which stays sober and CV-legible. |
| **Globe + Konami** | Cut the WebGL globe; reskin the matrix rain as ink bleed. |
| **Dark mode** | Keep the toggle; dark becomes "night paper" (dark kraft + bone ink). |

### Non-goals

- No copy rewrites beyond what the visual treatment requires (lowercase hero, scrawled annotations).
- No changes to `src/content/resume.ts` data, GitHub API logic, or the contact API route.
- No new sections, no AI chat widget, no Spotify integration (those remain in `todo.md`).
- No routing or App Router structural changes.

## 3. Token system — `src/app/globals.css`

The current palette inverts a key assumption that must be reversed: today `--color-surface` is
*lighter* than `--color-background` (a raised panel on a dark ground). On paper, a card is **card
stock lying on a desk** — lighter than the ground, with depth from a hard offset shadow, never a
blur.

### 3.1 Paper (light — default)

| Token | Value | Role |
|---|---|---|
| `--color-background` | `#EFE8DB` | paper ground |
| `--color-surface` | `#FBF7EF` | card stock |
| `--color-surface-2` | `#E4DACA` | recessed / tape |
| `--color-border` | `#C3B7A4` | pencil rule |
| `--color-accent` | `#E8552B` | marker orange — graphics and display type only |
| `--color-accent-ink` | `#C2431F` | marker orange for text under 18px |
| `--color-accent-muted` | `#C2431F` | hover / pressed |
| `--color-accent-glow` | `rgba(232,85,43,0.14)` | highlighter wash |
| `--color-text` | `#2A2622` | ink |
| `--color-text-muted` | `#554C43` | secondary ink |
| `--color-text-dim` | `#6B6157` | tertiary ink |

### 3.2 Night paper (dark)

Applied under `html.dark` to match the existing `next-themes` setup (current file uses `html.light`
as the override; this inverts, since paper is now the default — see §3.5).

| Token | Value |
|---|---|
| `--color-background` | `#1C1815` |
| `--color-surface` | `#262019` |
| `--color-surface-2` | `#322A21` |
| `--color-border` | `#453A2D` |
| `--color-accent` | `#F2733F` |
| `--color-accent-ink` | `#F2733F` |
| `--color-accent-muted` | `#D45A28` |
| `--color-accent-glow` | `rgba(242,115,63,0.16)` |
| `--color-text` | `#EDE4D4` |
| `--color-text-muted` | `#C8BBA6` |
| `--color-text-dim` | `#94897A` |

### 3.3 Heatmap ink density

The GitHub contribution heatmap becomes ink soaking into paper rather than glowing pixels.

| Token | Paper | Night paper |
|---|---|---|
| `--color-heat-0` | `#DDD3C2` | `#322A21` |
| `--color-heat-1` | `#F0B694` | `#6E3A1E` |
| `--color-heat-2` | `#E8552B` | `#C2521F` |
| `--color-heat-3` | `#A8330F` | `#F2733F` |

### 3.4 New structural tokens

| Token | Value | Notes |
|---|---|---|
| `--radius-card` | `2px` | paper has no 16px radius |
| `--shadow-paper` | `2px 3px 0 rgba(42,38,34,0.12)` | hard, zero blur |
| `--shadow-paper-lift` | `4px 6px 0 rgba(42,38,34,0.14)` | hover state |
| `--tilt-a` | `-0.7deg` | |
| `--tilt-b` | `1.1deg` | |
| `--tilt-c` | `-1.4deg` | |
| `--font-hand` | `var(--font-caveat)` | |

In night paper, `--shadow-paper` becomes `2px 3px 0 rgba(0,0,0,0.35)`.

### 3.5 Theme mechanics

Every token above is declared in the bare `:root` block with its paper value, then redefined under
`html.dark`. No color may be defined only inside the dark block. `body` sets an explicit
`background-color` from a token.

**Migration note:** the current file declares paper values under `html.light` as an *override* of a
dark `:root`. This inverts — `:root` becomes paper, `html.dark` becomes the override.

`ThemeProvider` is verified compatible and **requires no change**: it already runs
`attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`, so `next-themes` stamps
`light` or `dark` directly on `<html>` and `html.dark` resolves correctly. Because the default
theme is already `light`, putting paper in the bare `:root` also removes a pre-hydration flash
that exists today. The Nav toggle is unchanged.

## 4. Contrast requirements

Marker orange on paper is approximately 3.4:1 — acceptable for rules, icons and type at 18px+/bold,
but **failing WCAG AA for small text**.

This is not hypothetical. `--color-accent` is used as a text colour in **21 places**, of which at
least **9 sit on `text-xs` or `text-sm`** — verified in `Nav.tsx` (lines 97, 229), `Hero.tsx` (130),
`About.tsx` (127, 165), `GitHubActivity.tsx` (375, 448, 476) and `Contact.tsx` (38). Every one of
these fails AA once the accent becomes marker orange, and each must be migrated.

**Rule:** `--color-accent` for graphics and display type ≥18px; `--color-accent-ink` for anything
smaller. Every existing small-text use of `--color-accent` must be migrated to `--color-accent-ink`.

Verified minimums (all against their own ground):

- `--color-text` on `--color-background`: ≥ 12:1
- `--color-text-muted` on `--color-background`: ≥ 7:1
- `--color-text-dim` on `--color-background`: ≥ 4.5:1
- `--color-accent-ink` on `--color-background`: ≥ 4.5:1

## 5. Typography

| Role | Face | Notes |
|---|---|---|
| Display, nav, annotation | **Caveat** (new, via `next/font/google`) | headings, nav links, scrawls |
| Body | Geist Sans (existing) | all running text |
| Labels, data, code | Geist Mono (existing) | reads as typewriter on paper — on concept |

One new font family. Caveat is loaded in `layout.tsx` alongside the existing Geist fonts and exposed
as `--font-caveat`.

**Caveat sizing rule:** Caveat has a small x-height and reads ~20% smaller than its nominal size.
Every Caveat use gets a 1.25× size bump versus the equivalent sans, with a hard floor of 20px
effective for nav links.

**Caveat is never used for body copy** — headings, nav, annotations and captions only. This is the
single most important guardrail against illegibility.

## 6. Global paper treatment

- **Grain:** a fixed `body::before` overlay composed of three offset `radial-gradient` layers at
  differing `background-size` (7px, 11px, 9px), `opacity: 0.42`, `pointer-events: none`,
  `z-index: 1` beneath content. No image asset, no network request.
- **Selection:** highlighter swipe — `background: var(--color-accent-glow)`, `color: var(--color-text)`.
- **Scrollbar:** 6px, thumb `--color-border`, hover `--color-text-dim`.
- **`scroll-behavior: smooth`** retained.
- The blunt `* { border-color: var(--color-border) }` rule is retained.

## 7. New shared primitives

These live in `src/components/paper/`. They exist to fix the structural monotony identified in §1 —
seven sections currently share one heading treatment and one motion pattern.

### 7.1 `SectionHeading`

```
props: {
  title: string
  eyebrow?: string
  variant: "dashed" | "torn" | "taped"
  id?: string
}
```

Replaces the repeated `h-px w-12 rounded-full` + `h-px flex-1` idiom in About, Experience,
TechStack, GitHubActivity, Instagram and Contact. **Each consuming section passes a different
`variant`** so the page rhythm varies rather than repeating.

### 7.2 `PaperCard`

```
props: {
  tilt?: "a" | "b" | "c" | "none"
  lift?: boolean       // hover raises shadow + straightens tilt
  as?: ElementType
  children: ReactNode
}
```

Card stock background, 1px border, `--radius-card`, `--shadow-paper`, rotation from the tilt tokens.
`tilt="none"` is required in Experience (see §8).

### 7.3 `Tape`

```
props: { children: ReactNode; rotate?: number }
```

Translucent tape label — `rgba(230,220,150,0.6)` over paper, 1px muted border, mono uppercase text,
default `-1.6deg`.

### 7.4 `Scrawl`

```
props: {
  children: ReactNode
  arrow?: "left" | "right" | "none"
  rotate?: number
}
```

Caveat annotation in accent orange with an optional hand-drawn inline-SVG arrow. The arrow path
animates in via `stroke-dashoffset` (see §10).

## 8. Per-section specification

| Section | File | Changes |
|---|---|---|
| **Nav** | `Nav.tsx` | Remove `backdrop-blur-md` — paper does not blur. Becomes a thin ink rule that appears on scroll. Logo and links in Caveat at 20px+. ⌘K button restyled as a small index card with `--shadow-paper`. Theme toggle label unchanged in behaviour. |
| **Hero** | `sections/Hero.tsx` | Delete the three animated gradient blobs, the dot-grid overlay, and the `<Globe />` mount. Add a hand-drawn inline-SVG ink map of Colorado with a Denver pin. `hi, i'm jake` lowercase in Caveat. `Tape` label for "denver, colorado". Cycling `TYPED_PHRASES` retained but rendered as a `Scrawl`. CTAs become paper buttons with hard offset shadows. Height `min-h-[88vh]`, not `100vh`. |
| **About** | `sections/About.tsx` | `interests` become peel-on-hover sticker tags with alternating tilts. `stats` become `PaperCard` index cards. `SectionHeading variant="taped"`. |
| **Experience** | `sections/Experience.tsx` | **Sober.** No Caveat, no tilt (`PaperCard tilt="none"`), no stickers. Geist Sans hierarchy, `--color-text` / `--color-text-muted` only. The timeline rail becomes a ruled-notebook margin line. `rounded-2xl` → `--radius-card`. `SectionHeading variant="dashed"`. This section must remain scannable as a printed CV. |
| **TechStack** | `sections/TechStack.tsx` | Simple-icons on paper chips with slight per-chip rotation. Category labels in Caveat. `rounded-lg` → `--radius-card`. `SectionHeading variant="dashed"`. |
| **GitHubActivity** | `sections/GitHubActivity.tsx` | Heatmap squares take the §3.3 ink-density scale plus a 1px ink border; `rounded-[2px]` retained. Profile card and event list become `PaperCard`. `ring-sky-400/30` on the avatar must be replaced — it is a hardcoded sky colour. `SectionHeading variant="torn"`. |
| **Instagram** | `sections/Instagram.tsx` | Photos become polaroids: thick white border (`#FBF7EF`), `--shadow-paper`, alternating tilt, Caveat caption beneath. `SectionHeading variant="taped"`. |
| **Contact** | `sections/Contact.tsx` | Restyled as a postcard — `PaperCard` with a divided back, stamp box, and ruled address lines. Small accent labels migrate to `--color-accent-ink`. `SectionHeading variant="torn"`. |
| **Footer** | `app/page.tsx` | Torn paper top edge via an SVG mask. Replace hardcoded `border-slate-800`, `text-slate-500`, `text-sky-400`, `hover:text-sky-400` with tokens. |
| **CommandPalette** | `CommandPalette.tsx` | Overlay backdrop shifts from `rgba(0,0,0,0.6)` to a warm `rgba(42,38,34,0.55)`. Panel becomes card stock with `--radius-card` and `--shadow-paper` instead of `rounded-xl`. Item rows keep mono. Behaviour unchanged. |

**Hardcoded-colour audit.** These are not token-driven and must be migrated: `Nav.tsx` (backdrop),
`Hero.tsx` (`#0c2a4a` secondary CTA background, blob rgba values), `GitHubActivity.tsx`
(`ring-sky-400/30`), `page.tsx` footer (`border-slate-800`, `text-slate-500`, `text-sky-400`).

## 9. Konami easter egg

`src/hooks/useKonamiCode.ts` keeps its public API — `useKonamiCode(onActivate)` and
`triggerKonamiEffect()` — and keeps the canvas mount, fixed overlay, `pointerEvents: none`,
`zIndex: 9999` and timed teardown. Only the render loop changes.

The falling katakana column effect is replaced with **ink bleeding into paper**: expanding radial
blots with irregular edges that bloom from random origins, soak outward with decreasing alpha, and
leave a coffee-ring stain. Colour is drawn from `--color-accent` and ink tokens read off the
computed root style so it works in both themes.

The command palette's existing entry point for this effect is unchanged.

## 10. Motion

The uniform fade-up-28px is replaced with physical behaviour. All values respect
`prefers-reduced-motion: reduce`, which disables transforms and reduces durations to near-zero
globally.

| Element | Behaviour |
|---|---|
| `PaperCard` | Drops and settles — `initial: { opacity: 0, y: -18, rotate: 0 }` → spring `stiffness: 260, damping: 18` into its tilt, with slight overshoot |
| `Scrawl` arrows | Draw in via `stroke-dashoffset`, 0.6s, `ease: [0.22, 1, 0.36, 1]` |
| Sticker tags | Peel on hover — `rotate` + `translateY(-3px)`, spring `stiffness: 400, damping: 15` |
| Polaroids | Straighten and lift on hover |
| Section entry | Retained `useInView({ once: true })`, but staggered per-card rather than one block fade |

**Framer Motion v12 constraint (existing, must be preserved):** `ease` arrays inside function-style
variants must be typed as tuples — `as [number, number, number, number]`. String eases like
`"easeOut"` cannot be narrowed to `Easing` in that position.

## 11. Deletions

**Files removed:**

- `src/components/Globe.tsx`
- `src/components/GlobeScene.tsx`
- `src/lib/globe-geometry.ts`

**Dependencies removed from `package.json`:**

- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `d3-geo`
- `topojson-client`
- `world-atlas`

Six dependencies and a substantial client bundle, all serving one decorative hero element that
conflicts with the chosen direction.

## 12. Accessibility

- Contrast pairs per §4, with `--color-accent-ink` mandatory for text under 18px.
- Caveat never used for body copy; 20px effective floor for nav (§5).
- Focus states visible in all themes — 2px `--color-accent` outline, 2px offset. The current
  `focus:outline-none` uses must retain a paired `focus-visible` ring.
- `prefers-reduced-motion` disables tilt, drop, peel and draw-in animations globally.
- Tilted elements must not clip their own text; rotation is applied to the card, never the text node.
- The grain overlay is `pointer-events: none` and `aria-hidden`.

## 13. Verification

The project has **no test framework installed** — no vitest, jest or playwright in `package.json`.
Verification for this work is therefore build-and-visual, not automated coverage. This is a known
limitation and is stated here rather than papered over.

Required before the work is called complete:

1. `bun run build` — succeeds with no errors.
2. `bunx tsc --noEmit` — no type errors.
3. `bun run lint` — clean.
4. Manual pass in both themes, confirming no token resolves to an undefined value.
5. Manual pass with `prefers-reduced-motion: reduce` enabled.
6. Keyboard-only pass: every interactive element reachable with a visible focus state.
7. Confirm no `three`/`d3-geo` import survives: `grep -rn "three\|d3-geo\|topojson\|world-atlas" src/`.

Adding a test harness is explicitly out of scope for this change.

## 14. Risks

| Risk | Mitigation |
|---|---|
| Reads casual and undercuts "senior platform engineer" | Experience stays sober (§8); handwriting capped to display roles (§5) |
| Marker orange fails contrast on small text | `--color-accent-ink` split, enforced in §4 |
| Caveat illegible at small sizes | 1.25× bump, 20px nav floor, never used for body copy |
| Grain overlay costs paint performance | CSS gradients only, no image, single fixed layer |
| Night paper becomes a second design system to maintain | Same token names, values only; no separate component branches |
| Tilt causes layout shift or clipping | Rotation on cards only, never text nodes; containers sized with tilt accounted for |

## 15. Follow-ups (not in scope)

- Geist Sans is slightly cold on paper. A warmer humanist body face would serve the direction
  better, but adding a third family was rejected for load cost. Revisit after the redesign lands.
- Remaining `todo.md` items (AI chat widget, Spotify, console easter egg, custom 404) are unaffected.
  The 404 page in particular would benefit from this direction later.
