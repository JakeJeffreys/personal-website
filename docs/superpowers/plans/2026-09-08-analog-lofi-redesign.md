# Analog Lo-Fi Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default dark-navy/sky-blue portfolio treatment on jakejeffreys.dev with a paper-and-ink "Analog Lo-Fi" aesthetic, without changing content, routing, or data fetching.

**Architecture:** The redesign is token-first. Nearly every component already reads `var(--color-*)`, so Task 1 swaps the token system in one file and the whole site shifts at once. Tasks 2–3 add four shared paper primitives and delete the WebGL globe. Tasks 4–12 restyle sections one at a time, each independently reviewable. Task 13 reskins the Konami effect. Task 14 is the accessibility and contrast sweep.

**Tech Stack:** Next.js 15.5 (App Router), TypeScript, Tailwind CSS v4 (CSS-first `@theme`), Framer Motion v12, next-themes, Bun.

**Spec:** `docs/superpowers/specs/2026-09-08-analog-lofi-redesign-design.md`

## Global Constraints

- **No test framework exists.** Verification is `bunx tsc --noEmit`, `bun run build`, targeted `grep`, and manual passes. Adding a test harness is out of scope.
- **Tailwind v4:** CSS-first config via `@theme {}` in `globals.css`. There is no `tailwind.config.js`. Do not create one.
- **Framer Motion v12:** `ease` arrays inside function-style variants must be typed as tuples — `as [number, number, number, number]`. Never use string eases like `"easeOut"` in a variant function.
- **Contrast rule:** `--color-accent` for graphics and text ≥18px only. `--color-accent-ink` for all text below 18px. Non-negotiable.
- **Caveat is never used for body copy** — display, nav, captions and annotations only. 1.25× size bump, 20px effective floor for nav.
- **`prefers-reduced-motion: reduce`** must disable tilt, drop, peel and draw-in animations.
- **Experience stays sober** — no handwriting, no tilt, no stickers. It must scan as a printed CV.
- **Do not modify:** `src/content/resume.ts` data, `src/lib/github.ts`, `src/app/api/`.
- **Commit after every task.** Attribution line: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

---

## File Structure

**Create:**
- `src/components/paper/SectionHeading.tsx` — section heading with three rule variants
- `src/components/paper/PaperCard.tsx` — card stock with tilt + hard offset shadow
- `src/components/paper/Tape.tsx` — translucent tape label
- `src/components/paper/Scrawl.tsx` — Caveat annotation with optional drawn arrow
- `src/components/paper/index.ts` — barrel export
- `src/components/ColoradoMap.tsx` — hand-drawn inline-SVG ink map, replaces the globe

**Modify:**
- `src/app/globals.css` — full token system swap (Task 1)
- `src/app/layout.tsx` — add Caveat font (Task 1)
- `src/components/Nav.tsx`, all seven `src/components/sections/*.tsx`, `src/components/CommandPalette.tsx`, `src/app/page.tsx`, `src/hooks/useKonamiCode.ts`
- `package.json` — remove six dependencies (Task 3)

**Delete:**
- `src/components/Globe.tsx`, `src/components/GlobeScene.tsx`, `src/lib/globe-geometry.ts`

---

### Task 1: Token system and Caveat font

**Files:**
- Modify: `src/app/globals.css` (full rewrite of the token blocks)
- Modify: `src/app/layout.tsx` (add Caveat)

**Interfaces:**
- Produces: CSS custom properties consumed by every later task — `--color-background`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-accent`, `--color-accent-ink`, `--color-accent-muted`, `--color-accent-glow`, `--color-text`, `--color-text-muted`, `--color-text-dim`, `--color-heat-0..3`, `--radius-card`, `--shadow-paper`, `--shadow-paper-lift`, `--tilt-a`, `--tilt-b`, `--tilt-c`, `--font-hand`.

- [ ] **Step 1: Invert the theme branches in `globals.css`**

`:root` currently holds the dark palette with `html.light` overriding. Reverse it: `:root` holds paper, `html.dark` overrides. Values verbatim from spec §3.1–3.4. Add the grain overlay, highlighter selection, and ink scrollbar from spec §6.

- [ ] **Step 2: Add Caveat in `layout.tsx`**

```ts
import { Caveat } from "next/font/google";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});
```

Add `${caveat.variable}` to the `<body>` className alongside the existing Geist variables.

- [ ] **Step 3: Verify no token is defined only in the dark branch**

Run: `grep -c -- "--color-" src/app/globals.css` — confirm every token appearing under `html.dark` also appears in `:root`.

- [ ] **Step 4: Typecheck**

Run: `bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat(design): swap to paper/night-paper token system, add Caveat"
```

---

### Task 2: Paper primitives

**Files:**
- Create: `src/components/paper/PaperCard.tsx`, `Tape.tsx`, `Scrawl.tsx`, `SectionHeading.tsx`, `index.ts`

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces — exact signatures every later task depends on:

```ts
// PaperCard.tsx
export type Tilt = "a" | "b" | "c" | "none";
export default function PaperCard(props: {
  tilt?: Tilt;              // default "none"
  lift?: boolean;           // default true — hover raises shadow, straightens tilt
  delay?: number;           // default 0 — stagger for the drop-in animation
  className?: string;
  children: React.ReactNode;
}): JSX.Element;

// Tape.tsx
export default function Tape(props: {
  rotate?: number;          // default -1.6
  className?: string;
  children: React.ReactNode;
}): JSX.Element;

// Scrawl.tsx
export default function Scrawl(props: {
  arrow?: "left" | "right" | "none";  // default "none"
  rotate?: number;                     // default -2
  className?: string;
  children: React.ReactNode;
}): JSX.Element;

// SectionHeading.tsx
export default function SectionHeading(props: {
  title: string;
  eyebrow?: string;
  variant: "dashed" | "torn" | "taped";
  className?: string;
}): JSX.Element;
```

- [ ] **Step 1: Implement the four primitives** per spec §7, with motion per spec §10.

- [ ] **Step 2: Barrel export**

```ts
// src/components/paper/index.ts
export { default as PaperCard } from "./PaperCard";
export { default as Tape } from "./Tape";
export { default as Scrawl } from "./Scrawl";
export { default as SectionHeading } from "./SectionHeading";
```

- [ ] **Step 3: Typecheck** — `bunx tsc --noEmit`. Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/paper
git commit -m "feat(design): add paper primitives"
```

---

### Task 3: Remove the WebGL globe and six dependencies

**Files:**
- Delete: `src/components/Globe.tsx`, `src/components/GlobeScene.tsx`, `src/lib/globe-geometry.ts`
- Create: `src/components/ColoradoMap.tsx`
- Modify: `src/components/sections/Hero.tsx` (swap the mount only), `package.json`

**Interfaces:**
- Produces: `export default function ColoradoMap(props: { className?: string }): JSX.Element` — inline SVG, hand-drawn Colorado outline with a Denver pin, strokes from `currentColor` and the accent token so it themes correctly.

- [ ] **Step 1: Create `ColoradoMap.tsx`** — inline SVG, no dependencies, `aria-hidden` on decorative paths, accessible label on the pin.

- [ ] **Step 2: Replace the `<Globe />` mount in Hero** with `<ColoradoMap />`. Leave the rest of Hero for Task 4.

- [ ] **Step 3: Delete the three globe files.**

- [ ] **Step 4: Remove dependencies**

```bash
bun remove three @react-three/fiber @react-three/drei d3-geo topojson-client world-atlas
```

- [ ] **Step 5: Verify no stale imports**

Run: `grep -rn "three\|d3-geo\|topojson\|world-atlas\|GlobeScene\|globe-geometry" src/`
Expected: no matches.

- [ ] **Step 6: Build** — `bun run build`. Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(design): replace WebGL globe with hand-drawn ink map, drop 6 deps"
```

---

### Task 4: Hero

**Files:** Modify `src/components/sections/Hero.tsx`

Per spec §8: delete the three animated gradient blobs and the dot-grid overlay. `hi, i'm jake` lowercase in Caveat. `Tape` label for "denver, colorado". `TYPED_PHRASES` retained, rendered via `Scrawl`. CTAs become paper buttons with `--shadow-paper`. Height `min-h-[88vh]`. Replace the hardcoded `#0c2a4a` secondary-CTA background with a token.

- [ ] **Step 1:** Implement the above.
- [ ] **Step 2:** `grep -n "0c2a4a\|blur(\|radial-gradient" src/components/sections/Hero.tsx` — expected: no matches.
- [ ] **Step 3:** `bunx tsc --noEmit` — no errors.
- [ ] **Step 4:** Commit — `feat(design): rebuild hero on paper`

---

### Task 5: Nav

**Files:** Modify `src/components/Nav.tsx`

Per spec §8: remove `backdrop-blur-md`. Thin ink rule on scroll. Logo and links in Caveat, minimum 20px effective. ⌘K button as a small index card. Migrate `text-xs`/`text-sm` accent usages at lines 97 and 229 to `--color-accent-ink`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** `grep -n "backdrop-blur" src/components/Nav.tsx` — expected: no matches.
- [ ] **Step 3:** `bunx tsc --noEmit` — no errors.
- [ ] **Step 4:** Commit — `feat(design): restyle nav as paper`

---

### Task 6: About

**Files:** Modify `src/components/sections/About.tsx`

`interests` become peel-on-hover sticker tags with alternating tilts. `stats` become `PaperCard` index cards. `SectionHeading variant="taped"`. Migrate accent text at lines 127 and 165 to `--color-accent-ink`.

- [ ] **Step 1:** Implement. **Step 2:** `bunx tsc --noEmit`. **Step 3:** Commit — `feat(design): paper treatment for about`

---

### Task 7: Experience — sober

**Files:** Modify `src/components/sections/Experience.tsx`

**This is the constraint-critical task.** No Caveat, no tilt (`PaperCard tilt="none"`), no stickers. Geist Sans hierarchy, `--color-text` / `--color-text-muted` only. Timeline rail becomes a ruled-notebook margin line. `rounded-2xl` → `var(--radius-card)`. `SectionHeading variant="dashed"`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** `grep -n "font-hand\|caveat\|tilt-\|rounded-2xl" src/components/sections/Experience.tsx` — expected: no matches.
- [ ] **Step 3:** `bunx tsc --noEmit`. **Step 4:** Commit — `feat(design): sober CV treatment for experience`

---

### Task 8: TechStack

**Files:** Modify `src/components/sections/TechStack.tsx`

Icons on paper chips with slight per-chip rotation. Category labels in Caveat. `rounded-lg` → `var(--radius-card)`. `SectionHeading variant="dashed"`.

- [ ] **Step 1:** Implement. **Step 2:** `bunx tsc --noEmit`. **Step 3:** Commit — `feat(design): paper chips for tech stack`

---

### Task 9: GitHubActivity

**Files:** Modify `src/components/sections/GitHubActivity.tsx`

Heatmap uses the §3.3 ink-density scale plus a 1px ink border. Profile card and event list become `PaperCard`. **Replace `ring-sky-400/30` on the avatar** — hardcoded sky colour. Migrate accent text at lines 375, 448, 476 to `--color-accent-ink`. `SectionHeading variant="torn"`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** `grep -n "sky-400\|slate-" src/components/sections/GitHubActivity.tsx` — expected: no matches.
- [ ] **Step 3:** `bunx tsc --noEmit`. **Step 4:** Commit — `feat(design): ink-density heatmap and paper cards`

---

### Task 10: Instagram polaroids

**Files:** Modify `src/components/sections/Instagram.tsx`

Photos become polaroids — thick `--color-surface` border, `--shadow-paper`, alternating tilt, Caveat caption beneath. Straighten and lift on hover. `SectionHeading variant="taped"`.

- [ ] **Step 1:** Implement. **Step 2:** `bunx tsc --noEmit`. **Step 3:** Commit — `feat(design): polaroid photo feed`

---

### Task 11: Contact and footer

**Files:** Modify `src/components/sections/Contact.tsx`, `src/app/page.tsx`

Contact restyled as a postcard — `PaperCard` with divided back, stamp box, ruled address lines. Accent label at line 38 → `--color-accent-ink`. `SectionHeading variant="torn"`. Footer gets a torn top edge; replace `border-slate-800`, `text-slate-500`, `text-sky-400`, `hover:text-sky-400` with tokens.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** `grep -n "slate-\|sky-" src/app/page.tsx src/components/sections/Contact.tsx` — expected: no matches.
- [ ] **Step 3:** `bunx tsc --noEmit`. **Step 4:** Commit — `feat(design): postcard contact and torn footer`

---

### Task 12: CommandPalette

**Files:** Modify `src/components/CommandPalette.tsx`

Backdrop `rgba(0,0,0,0.6)` → warm `rgba(42,38,34,0.55)`. Panel becomes card stock with `var(--radius-card)` and `var(--shadow-paper)` instead of `rounded-xl`. Item rows keep mono. **Behaviour and keybindings unchanged.**

- [ ] **Step 1:** Implement. **Step 2:** `bunx tsc --noEmit`. **Step 3:** Commit — `feat(design): paper command palette`

---

### Task 13: Konami ink bleed

**Files:** Modify `src/hooks/useKonamiCode.ts`

Keep the public API — `useKonamiCode(onActivate)` and `triggerKonamiEffect()` — and keep the canvas mount, fixed overlay, `pointerEvents: none`, `zIndex: 9999` and timed teardown. Replace only the render loop: falling katakana → ink blots that bloom from random origins, soak outward with decreasing alpha, and leave a coffee ring. Read ink and accent colours off `getComputedStyle(document.documentElement)` so it works in both themes.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** `grep -n "アイウエオ\|katakana" src/hooks/useKonamiCode.ts` — expected: no matches.
- [ ] **Step 3:** Confirm both exports still present: `grep -n "export function" src/hooks/useKonamiCode.ts`
- [ ] **Step 4:** `bunx tsc --noEmit`. **Step 5:** Commit — `feat(design): ink-bleed konami effect`

---

### Task 14: Accessibility sweep and final verification

**Files:** Any remaining offenders found by the greps below.

- [ ] **Step 1: Contrast migration is complete**

Run: `grep -rn -B2 'var(--color-accent)"' src --include="*.tsx" | grep -E "text-xs|text-sm"`
Expected: no matches. Every small-text accent use must now be `--color-accent-ink`.

- [ ] **Step 2: No hardcoded legacy colours survive**

Run: `grep -rn "sky-400\|slate-800\|slate-500\|#0a0f1e\|#38bdf8\|#0c2a4a" src/`
Expected: no matches.

- [ ] **Step 3: Reduced motion is honoured**

Run: `grep -n "prefers-reduced-motion" src/app/globals.css`
Expected: at least one match disabling transform and animation.

- [ ] **Step 4: Focus states** — confirm every `focus:outline-none` has a paired `focus-visible` ring:

Run: `grep -rn "focus:outline-none" src --include="*.tsx"`
Review each hit.

- [ ] **Step 5: Full build** — `bun run build`. Expected: succeeds, no errors.

- [ ] **Step 6: Lint** — `bun run lint`. If `next lint` is deprecated in 15.5 and fails, record the actual output rather than claiming it passed.

- [ ] **Step 7: Manual passes** — both themes, reduced motion, keyboard-only navigation, on http://localhost:3001.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "fix(a11y): contrast, focus and reduced-motion sweep"
```

---

## Self-Review

**Spec coverage:** §3 tokens → Task 1. §4 contrast → Tasks 5, 6, 9, 11, 14. §5 typography → Task 1. §6 paper treatment → Task 1. §7 primitives → Task 2. §8 per-section → Tasks 4–12. §9 Konami → Task 13. §10 motion → Task 2, applied throughout. §11 deletions → Task 3. §12 accessibility → Task 14. §13 verification → Task 14. No gaps.

**Placeholder scan:** No TBDs. Every task names exact files, exact greps with expected output, and a commit message.

**Type consistency:** `PaperCard` props (`tilt`, `lift`, `delay`, `className`, `children`), `Tape` (`rotate`), `Scrawl` (`arrow`, `rotate`), `SectionHeading` (`title`, `eyebrow`, `variant`) are defined once in Task 2 and used with those exact names in Tasks 4–12. `Tilt` union is `"a" | "b" | "c" | "none"` throughout. `ColoradoMap` takes only `className`.

**Known deviation:** the skill's TDD step pattern is replaced with build/typecheck/grep gates, because no test framework exists in this project (spec §13).
