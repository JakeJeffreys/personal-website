# Personal Website — Plan

## About

Senior Software Engineer based in Denver, Colorado. Goal: a high-tech, clean, modern personal website that serves as a hub for professional presence and personal brand.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Package Manager | Bun |
| Hosting | Vercel (free tier) |
| Domain | TBD — .dev domain (leaning jakejeffreys.dev) |
| Domain Registrar | Porkbun or Cloudflare Registrar |

---

## Design Direction

- Dark mode default, light mode toggle
- Animated gradient or mesh background on hero
- Monospace font accents for code-flavored elements
- Color palette: dark navy/slate base + bright accent (cyan, electric blue, or green)
- Glassmorphism or bordered minimalist cards
- Smooth scroll + subtle entrance animations (Framer Motion)

---

## Sections

| Section | Description |
|---|---|
| Hero | Name, title, tagline, animated background |
| About | Photo, bio, Denver lifestyle, personal interests |
| Experience / Resume | Timeline-style, downloadable PDF, tech stack icons |
| Projects | Cards pulled from GitHub API (pinned repos) |
| GitHub Activity | Contribution graph + recent commits via GitHub REST API |
| Instagram Feed | Via Behold.so or Instagram Basic Display API |
| Contact | Email form (Resend API), links to GitHub / LinkedIn / Twitter |

---

## Integrations

| Integration | Method |
|---|---|
| GitHub Activity & Projects | GitHub REST API (public, no auth needed) |
| Instagram Feed | Behold.so (easiest) or Instagram Basic Display API |
| Contact Form | Resend + React Email |
| Analytics | Vercel Analytics (free, privacy-friendly) |
| Resume | Static PDF in /public + rendered timeline from data file |

---

## Project Structure

```
src/
  app/
    page.tsx              # Home (all sections as one page)
    blog/                 # Optional MDX blog
    api/                  # API routes (contact form, etc.)
  components/
    sections/             # Hero, About, Experience, Projects, GitHub, Instagram, Contact
    ui/                   # shadcn components
  lib/
    github.ts             # GitHub API helpers
    instagram.ts          # Behold/Instagram helpers
  content/
    resume.ts             # Resume/experience data
    interests.ts          # About section data
public/
  resume.pdf              # Downloadable resume
```

---

## Hosting & Deployment

- Host on Vercel, connected to this GitHub repo
- Auto-deploy on push to `main`
- Preview deployments on every PR
- Connect custom `.dev` domain once purchased
- Vercel provisions SSL automatically (required for .dev domains)

---

## Todo

### Setup
- [x] Scaffold Next.js 15 with TypeScript and App Router
- [x] Configure Tailwind CSS v4
- [x] Install Framer Motion
- [x] Set up Bun as package manager
- [ ] Deploy to Vercel and connect repo

### Sections
- [x] Hero section with animated blobs, typing effect, and CTAs
- [x] About section with bio, stats card, and interest badges
- [x] Experience section — vertical timeline + skills grid
- [x] ~~Projects section~~ — removed per preference
- [x] GitHub Activity section — heatmap + recent event feed
- [ ] Instagram Feed section
- [x] Contact section with form (Resend stub wired, needs API key)

### Integrations
- [x] GitHub REST API integration (repos, user, activity)
- [ ] Instagram / Behold.so integration
- [ ] Resend contact form integration (stub ready in `src/app/api/contact/route.ts`)
- [ ] Vercel Analytics

### Content (needs real data)
- [x] Update `src/content/resume.ts` with real job history and skills
- [x] Review and update bio paragraphs in `src/components/sections/About.tsx`
- [x] Add real LinkedIn URL in `src/components/sections/Contact.tsx`
- [ ] Add Twitter/X URL in `src/components/sections/Contact.tsx`
- [ ] Add a downloadable resume PDF to `/public/resume.pdf`

### Design & Polish
- [ ] Dark mode default + light mode toggle
- [ ] Responsive layout review (mobile, tablet, desktop)
- [x] Entrance animations (Framer Motion — scroll-triggered on all sections)
- [x] Typography and color palette finalized (Geist fonts, sky-blue accent, navy base)
- [ ] Favicon and Open Graph meta tags / social preview image

### Launch
- [x] Run locally and review (`bun dev`)
- [ ] Purchase .dev domain
- [ ] Deploy to Vercel (`vercel` CLI)
- [ ] Connect domain to Vercel
- [ ] Final content review
- [ ] Go live

### Bonus (if time permits)
- [ ] Command palette (cmd+k) — VS Code-style navigation with easter egg terminal commands
- [ ] AI chat widget — Claude API chatbot trained on resume/bio, visitors can ask questions about you
- [ ] Spotify Now Playing — show current/last played track via Spotify API
- [ ] 3D hero element — React Three Fiber scene (rotating globe with Denver pin, or abstract mesh)
- [ ] "Currently" section — what you're reading, listening to, or working on
- [ ] Interactive tech stack grid — hoverable, grouped by category
- [ ] Console message easter egg — styled greeting for visitors who open devtools
- [ ] Custom 404 page — interactive or humorous
- [ ] Konami code easter egg
