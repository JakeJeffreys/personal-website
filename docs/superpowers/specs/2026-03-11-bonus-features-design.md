# Bonus Features Design — jakejeffreys.dev
**Date:** 2026-03-11
**Status:** Approved
**Features:** Command Palette, 3D Hero Globe, Tech Stack Grid

---

## 1. Command Palette (⌘K)

### Overview
A VS Code-style command palette accessible from anywhere on the site via `⌘K` (Mac) or `Ctrl+K` (Win/Linux). Closes on ESC or backdrop click.

### Library
`cmdk` — headless, composable, used by Vercel. Fully custom-styled to match site design.

### Commands

**Navigation group**
- Go to About
- Go to Experience
- Go to Projects
- Go to GitHub Activity
- Go to Contact

**Actions group**
- Open Resume (opens PDF in new tab)
- Toggle Dark / Light Mode

**Easter Eggs group**
- `konami` — triggers the Konami code easter egg effect

### UI
- Centered modal overlay with backdrop blur
- Input at top with `⌘` icon prefix and ESC badge
- Fuzzy search filters all commands as you type
- Groups: Navigation, Actions, Easter Eggs
- Footer hint bar: `↑↓` navigate · `↵` select · `ESC` close
- A `⌘K` hint badge in the nav hints at its existence

### Architecture
- Single `CommandPalette` client component mounted once in `layout.tsx`
- Global `keydown` listener for `⌘K` / `Ctrl+K`
- Available on every page

---

## 2. 3D Hero Globe

### Overview
A rotating wireframe globe with continent outlines and a glowing Denver pin, positioned in the Hero section alongside the name/title text. Hidden on small mobile, visible on `md+` screens.

### Libraries
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — OrbitControls, helpers
- `world-atlas` (TopoJSON, `countries-110m`, ~90KB) — continent geometry
- `d3-geo` — orthographic projection of GeoJSON paths onto sphere surface

### Globe Design
- Wireframe sphere mesh, lines in border color `#1e2a45`
- Subtle lat/lon grid lines
- Continent outlines projected as `THREE.Line` objects from GeoJSON — rotate with the globe
- Ambient sky-blue glow `rgba(56,189,248,0.07)` behind globe
- Globe rim stroke `#1e3a5f`

### Denver Pin
- Lat: 39.7392°N, Lon: 104.9903°W
- Glowing sky-blue dot (`#38bdf8`) with pulse animation
- "Denver" label rendered as a floating HTML overlay (`@react-three/drei Html`)

### Interaction
- Auto-rotation: slow continuous spin, pauses on hover
- Mouse drag: OrbitControls for manual rotation

### SSR Safety
- Wrapped in `next/dynamic` with `ssr: false` to avoid Next.js hydration issues

### Layout
- Right side of Hero section (flex row, text left / globe right)
- Globe: `200×200px` on desktop

---

## 3. Tech Stack Grid

### Overview
A new section between About and Experience showing skills grouped by category as hoverable pill badges with Simple Icons SVG brand icons.

### Source of Truth
Reads directly from `resume.ts` `skills[]`. The `skills[]` array will be updated to reflect the agreed list below.

### Updated `skills[]` in `resume.ts`

| Category | Items |
|---|---|
| Languages | TypeScript, JavaScript, Java, SQL, Bash |
| Backend | Node.js, Java Spring, REST APIs, Docker, Kubernetes |
| Infrastructure | AWS, Lambda, DynamoDB, S3, CloudFront, API Gateway, SNS, SQS, EventBridge, Terraform |
| Observability | Datadog, Runscope, BlazeMeter |
| AI & Agents | Claude Code, Claude API, MCP, Agent SDK, Skills |

> **Removed from resume.ts:** Python (Languages), Jenkins (Infrastructure), Tailwind CSS + Framer Motion + Split.io + React + Next.js (entire Frontend category removed)
> **Moved:** DynamoDB from Backend → Infrastructure
> **Added:** Docker, Kubernetes (Backend), EventBridge (Infrastructure), AI & Agents category

### Icons
`simple-icons` package for SVG brand icons. Text/initials fallback for anything without a Simple Icons entry (REST APIs, Skills, etc.).

### Pill Design
- Background: `#0f1629`, border: `#1e2a45`, border-radius: `8px`
- Hover state: accent border `#38bdf8` + subtle glow `rgba(56,189,248,0.15)`
- AI & Agents category: accent-bordered pills at rest to distinguish the section

### Animation
- Framer Motion stagger: categories fade up, pills fan in with per-item delay

### Placement
- New `TechStack` section component in `src/components/sections/TechStack.tsx`
- Inserted between About and Experience in `src/app/page.tsx`

---

## Shared Notes

- All three features are independent — can be implemented in parallel
- `resume.ts` skills[] update is a prerequisite for the Tech Stack Grid
- Command Palette and Konami easter egg share the same trigger effect — implement Konami effect first or stub it
