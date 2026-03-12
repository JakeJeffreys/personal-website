# jakejeffreys.dev

Personal website for Jake Jeffreys — Senior Platform Engineer based in Denver, Colorado.

Live at **[jakejeffreys.dev](https://jakejeffreys.dev)**

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D | React Three Fiber + Drei |
| Package Manager | Bun |
| Hosting | Vercel |
| Analytics | Vercel Analytics |

## Sections

- **Hero** — Animated background, cycling taglines, CTAs, rotating 3D globe with Denver pin
- **About** — Bio, quick stats, interests
- **Experience** — Vertical timeline (data in `src/content/resume.ts`)
- **Tech Stack** — Hoverable skill pills with brand icons, grouped by category
- **GitHub Activity** — Contribution heatmap + recent events via GitHub REST API
- **Instagram Feed** — Embedded via Behold.so
- **Contact** — GitHub and LinkedIn links

### Easter eggs

- **⌘K** — Command palette for site navigation, resume, and theme toggle
- **Konami code** (`↑↑↓↓←→←→BA`) — Matrix rain effect (also triggerable via command palette)

---

## Local Development

**Prerequisites:** [Bun](https://bun.sh) installed

```bash
# Install dependencies
bun install

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file in the project root:

```env
# Behold.so widget ID for Instagram feed
NEXT_PUBLIC_BEHOLD_WIDGET_ID=your_widget_id_here
```

---

## Deployment

The site auto-deploys to Vercel on every push to `main`.

- **Production** → `main` branch → [jakejeffreys.dev](https://jakejeffreys.dev)
- **Preview** → any PR or feature branch → unique Vercel preview URL

To deploy manually:

```bash
vercel --prod --yes
```

---

## Project Structure

```
src/
  app/
    page.tsx              # Home page — imports all sections
    layout.tsx            # Root layout, fonts, metadata
    globals.css           # Tailwind v4 @theme config + CSS variables
  components/
    Nav.tsx               # Sticky nav with mobile menu + theme toggle
    ThemeProvider.tsx     # next-themes wrapper
    CommandPalette.tsx    # ⌘K command palette (cmdk)
    CommandPaletteProvider.tsx  # Open/close context
    Globe.tsx             # SSR-safe dynamic wrapper for GlobeScene
    GlobeScene.tsx        # React Three Fiber globe scene
    sections/             # Hero, About, Experience, TechStack, GitHubActivity, Instagram, Contact
  hooks/
    useKonamiCode.ts      # Konami sequence listener + matrix rain effect
  lib/
    github.ts             # GitHub REST API helpers
    globe-geometry.ts     # TopoJSON → Three.js BufferGeometry for continent lines
    icons.ts              # simple-icons lookup for TechStack pills
    utils.ts              # cn() utility
  content/
    resume.ts             # Job history and skills data
public/
  resume.pdf              # Downloadable resume
  favicon.svg
```

## Updating Content

- **Job history / tech stack** — edit `src/content/resume.ts`
- **Bio / Currently / Interests** — edit `src/components/sections/About.tsx`
- **Resume PDF** — replace `public/resume.pdf`
- **Command palette commands** — edit `src/components/CommandPalette.tsx`
