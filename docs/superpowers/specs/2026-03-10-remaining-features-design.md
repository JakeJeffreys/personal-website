# Remaining Features Design — 2026-03-10

## Scope

Four features to complete before launch:
1. Favicon + Open Graph image
2. Responsive layout review and fixes
3. Contact form — Resend integration
4. Instagram feed — Behold.so integration

---

## 1. Favicon + OG Image

### Favicon
- `/public/favicon.svg` — "JJ" initials, sky blue (`#38bdf8`) on navy (`#0a0f1e`)
- `/public/favicon.ico` — 32×32 PNG fallback (can be generated from SVG)
- `src/app/layout.tsx` — update `metadata.icons` to reference both

### OG Image
- `src/app/opengraph-image.tsx` — Next.js `ImageResponse` at 1200×630
- Style: Bold + Tags (gradient dark card, large name, title, tag pills for "Platform", "Cloud", "Denver, CO")
- Gradient: `#0a0f1e → #0f1629 → #0d1f3c` with subtle radial glow blobs in sky blue
- This file is automatically picked up by Next.js as the OG and Twitter card image

### Metadata
- `src/app/layout.tsx` — add full `openGraph` and `twitter` metadata:
  - title, description, siteName, locale, type
  - `twitter.card: "summary_large_image"`
  - No Twitter handle (user does not have one)

---

## 2. Responsive Review

Audit all sections at 375px (mobile) and 768px (tablet). Fix any layout, overflow, or readability issues found. Sections to check:
- Nav (hamburger menu, overflow)
- Hero (font sizes, blob positioning, CTA layout)
- About (bio columns, stats card, badges)
- Experience (timeline, skills grid)
- GitHubActivity (heatmap horizontal scroll, event feed)
- Contact (form layout, social links)

---

## 3. Contact Form — Resend

### Package
- Add `resend` to dependencies

### Environment
- `RESEND_API_KEY` in `.env.local` (not committed)
- `.env.example` updated with `RESEND_API_KEY=` placeholder

### API Route — `src/app/api/contact/route.ts`
- Import `Resend` and instantiate with `process.env.RESEND_API_KEY`
- On validated submission, call `resend.emails.send()`:
  - `from`: `"Jake's Website <onboarding@resend.dev>"`
  - `to`: `njjeffreys@gmail.com`
  - `subject`: `"New message from [name] via jakejeffreys.dev"`
  - `text`: plain-text body with name, email, and message
- Return appropriate error responses if Resend call fails

### Contact.tsx
- Remove Twitter/X social link (currently `#` placeholder) entirely

---

## 4. Instagram Feed — Behold.so

### Environment
- `NEXT_PUBLIC_BEHOLD_WIDGET_ID` in `.env.local`
- `.env.example` updated with placeholder

### Component — `src/components/sections/Instagram.tsx`
- Client component (`"use client"`)
- Loads Behold.so widget script via `useEffect` (append `<script>` to document head)
- Renders `<behold-widget feed-id={widgetId}>` custom element
- Section heading: "On Instagram" with the same section style as other sections
- Gracefully hides the section if `NEXT_PUBLIC_BEHOLD_WIDGET_ID` is not set

### Page — `src/app/page.tsx`
- Import and insert `<Instagram />` between `<GitHubActivity />` and `<Contact />`

---

## Deferred / Out of Scope

- Light mode toggle (not selected by user)
- Vercel Analytics (not selected)
- Bonus features: command palette, Spotify, 3D hero, easter eggs, custom 404 (not selected)
- Twitter/X link: removed entirely
- Deployment steps: manual (purchase domain, Vercel CLI) — not automated
