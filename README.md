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
| Package Manager | Bun |
| Hosting | Vercel |
| Analytics | Vercel Analytics |

## Sections

- **Hero** — Animated background, cycling taglines, CTAs
- **About** — Bio, quick stats, interests
- **Experience** — Vertical timeline + skills grid (data in `src/content/resume.ts`)
- **GitHub Activity** — Contribution heatmap + recent events via GitHub REST API
- **Instagram Feed** — Embedded via Behold.so
- **Contact** — GitHub and LinkedIn links

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
    sections/             # Hero, About, Experience, GitHubActivity, Instagram, Contact
  lib/
    github.ts             # GitHub REST API helpers
    utils.ts              # cn() utility
  content/
    resume.ts             # Job history and skills data
public/
  resume.pdf              # Downloadable resume
  favicon.svg
```

## Updating Content

- **Job history / skills** — edit `src/content/resume.ts`
- **Bio / Currently / Interests** — edit `src/components/sections/About.tsx`
- **Resume PDF** — replace `public/resume.pdf`
