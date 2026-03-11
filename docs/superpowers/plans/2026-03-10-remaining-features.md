# Remaining Pre-Launch Features Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete four pre-launch features: favicon + OG image, responsive layout fixes, Resend contact form, and Instagram/Behold.so feed section.

**Architecture:** Each feature is self-contained. Favicon/OG only touches `public/` and `src/app/`. Responsive fixes are isolated edits to existing section components. Resend wires into the existing API route with a new env var. Behold.so adds one new component inserted into `page.tsx`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion v12, Resend SDK, Behold.so embed

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `public/favicon.svg` | Create | SVG favicon with "JJ" initials |
| `src/app/opengraph-image.tsx` | Create | Next.js OG image (Bold + Tags style, 1200×630) |
| `src/app/layout.tsx` | Modify | Full metadata: icons, openGraph, twitter fields |
| `src/components/sections/Hero.tsx` | Modify | Responsive fixes |
| `src/components/sections/About.tsx` | Modify | Responsive fixes |
| `src/components/sections/Experience.tsx` | Modify | Responsive fixes |
| `src/components/sections/GitHubActivity.tsx` | Modify | Responsive fixes (heatmap scroll) |
| `src/components/sections/Contact.tsx` | Modify | Remove Twitter link |
| `src/app/api/contact/route.ts` | Modify | Wire Resend SDK |
| `.env.local` | Modify | Add RESEND_API_KEY |
| `.env.example` | Create | Document required env vars |
| `src/components/sections/Instagram.tsx` | Create | Behold.so embed section |
| `src/app/page.tsx` | Modify | Insert Instagram section |

---

## Chunk 1: Favicon + OG Image

### Task 1: Create the SVG favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0a0f1e"/>
  <text
    x="16"
    y="22"
    font-family="monospace"
    font-size="14"
    font-weight="bold"
    fill="#38bdf8"
    text-anchor="middle"
  >JJ</text>
</svg>
```

- [ ] **Step 2: Verify the file renders in a browser**

Open `public/favicon.svg` directly in your browser. You should see a navy square with "JJ" in sky blue.

---

### Task 2: Create the OG image

**Files:**
- Create: `src/app/opengraph-image.tsx`

Next.js automatically picks up `opengraph-image.tsx` in the `app/` directory and serves it at `/opengraph-image`. It also uses it as the `og:image` and `twitter:image` meta tags when referenced from `layout.tsx`.

- [ ] **Step 1: Install `next` image response dependency (already included in next)**

```bash
bun add @vercel/og
```

Note: `ImageResponse` is re-exported from `next/og` — no separate package needed. Skip if already present.

- [ ] **Step 2: Create `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jake Jeffreys — Senior Platform Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f1629 50%, #0d1f3c 100%)",
          position: "relative",
          fontFamily: "monospace",
          overflow: "hidden",
        }}
      >
        {/* Glow blob top-right */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Glow blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "120px",
            width: "440px",
            height: "220px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "72px", fontWeight: "bold", color: "#e2e8f0", lineHeight: "1.1" }}>
            Jake Jeffreys
          </div>
          <div style={{ fontSize: "32px", color: "#38bdf8" }}>
            Senior Platform Engineer
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            {["Platform", "Cloud", "Denver, CO"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "#1e2a45",
                  color: "#94a3b8",
                  fontSize: "22px",
                  padding: "8px 20px",
                  borderRadius: "9999px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            fontSize: "22px",
            color: "#1e3a5f",
          }}
        >
          jakejeffreys.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
bun dev
```

Navigate to `http://localhost:3000/opengraph-image` in your browser. You should see the 1200×630 gradient card with name, title, and tag pills.

---

### Task 3: Update layout.tsx metadata

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the `metadata` export in `src/app/layout.tsx`**

Replace the existing `metadata` export with:

```ts
export const metadata: Metadata = {
  title: "Jake Jeffreys — Senior Platform Engineer",
  description:
    "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
  keywords: ["platform engineer", "software engineer", "AWS", "cloud-native", "Denver", "Colorado"],
  authors: [{ name: "Jake Jeffreys" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Jake Jeffreys — Senior Platform Engineer",
    description:
      "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
    url: "https://jakejeffreys.dev",
    siteName: "Jake Jeffreys",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Jeffreys — Senior Platform Engineer",
    description:
      "Senior Platform Engineer based in Denver, Colorado. Designing and scaling cloud-native backend systems on AWS.",
  },
};
```

- [ ] **Step 2: Verify favicon appears in browser tab**

Open `http://localhost:3000`. The browser tab should show the "JJ" favicon.

- [ ] **Step 3: Commit**

```bash
git add public/favicon.svg src/app/opengraph-image.tsx src/app/layout.tsx
git commit -m "feat: add favicon and OG image"
```

---

## Chunk 2: Responsive Layout Review

Open Chrome DevTools → Toggle Device Toolbar. Test at 375px (iPhone SE) and 768px (iPad). Fix any issues found.

### Task 4: Responsive audit and fixes

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/About.tsx`
- Modify: `src/components/sections/Experience.tsx`
- Modify: `src/components/sections/GitHubActivity.tsx`
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/components/Nav.tsx`

- [ ] **Step 1: Read and audit Hero.tsx**

Read `src/components/sections/Hero.tsx`. Look for:
- Hardcoded widths/heights that don't scale
- Text sizes that are too large on mobile (`text-6xl` without `sm:` prefix)
- Blobs or absolute-positioned elements that overflow on narrow screens (`overflow-hidden` on the section)
- CTA buttons that stack awkwardly

Apply fixes. Common patterns:
- `text-5xl sm:text-6xl lg:text-7xl` for headings
- `px-4 sm:px-6 lg:px-8` for section padding
- `flex-col sm:flex-row` for button groups
- Add `overflow-hidden` to sections with decorative blobs

- [ ] **Step 2: Read and audit About.tsx**

Look for grid columns that don't collapse on mobile. Fix with `grid-cols-1 sm:grid-cols-2` or similar. Check badge/tag wrapping looks correct at 375px.

- [ ] **Step 3: Read and audit Experience.tsx**

Check the timeline layout. Timeline dots and connectors should not overflow. Skills grid should use `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` or similar.

- [ ] **Step 4: Read and audit GitHubActivity.tsx**

The contribution heatmap is the riskiest — it's wide and can overflow. It should be wrapped in:
```tsx
<div className="overflow-x-auto">
  {/* heatmap */}
</div>
```
Verify the recent events list looks clean on mobile.

- [ ] **Step 5: Read and audit Contact.tsx**

The `grid-cols-1 sm:grid-cols-2` name/email row is already correct. Check the social links row — 3 icons should center correctly on mobile.

- [ ] **Step 6: Visual verification**

With `bun dev` running, open DevTools at 375px and scroll through all sections. Confirm no horizontal overflow anywhere. Use:
```
document.body.style.overflow = 'hidden'
```
in console — if content still overflows, find the culprit element.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/ src/components/Nav.tsx
git commit -m "fix: responsive layout across all sections"
```

---

## Chunk 3: Contact Form — Resend Integration

### Task 5: Install Resend and configure env

**Files:**
- Modify: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: Install Resend SDK**

```bash
bun add resend
```

Expected: `resend` added to `package.json` dependencies.

- [ ] **Step 2: Add API key to `.env.local`**

Open `.env.local` (create it if it doesn't exist) and add:

```
RESEND_API_KEY=re_YOUR_KEY_HERE
```

Replace `re_YOUR_KEY_HERE` with your actual Resend API key from [resend.com/api-keys](https://resend.com/api-keys).

- [ ] **Step 3: Create `.env.example`**

```
# Resend — contact form email delivery
# Get your key at https://resend.com/api-keys
RESEND_API_KEY=

# Behold.so — Instagram feed widget
# Get your widget ID at https://behold.so
NEXT_PUBLIC_BEHOLD_WIDGET_ID=
```

- [ ] **Step 4: Verify `.gitignore` excludes `.env.local`**

```bash
grep ".env.local" .gitignore
```

Expected: `.env.local` is listed. If not, add it.

---

### Task 6: Wire Resend into the API route

**Files:**
- Modify: `src/app/api/contact/route.ts`

- [ ] **Step 1: Replace `src/app/api/contact/route.ts` with Resend integration**

```ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;
    const { name, email, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Jake's Website <onboarding@resend.dev>",
      to: "njjeffreys@gmail.com",
      subject: `New message from ${name} via jakejeffreys.dev`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Test the form end-to-end**

With `bun dev` running, go to `http://localhost:3000/#contact`, fill out the form, and submit. Check `njjeffreys@gmail.com` for the email. The form should show the success state.

If Resend returns an error, check the terminal output for the error message.

- [ ] **Step 3: Remove Twitter social link from Contact.tsx**

In `src/components/sections/Contact.tsx`, find the `socialLinks` array (line ~124) and remove the Twitter/X entry:

Remove this object from the array:
```ts
{
  label: "Twitter / X",
  href: "#",
  Icon: Twitter,
},
```

Also remove the `Twitter` import from the lucide-react import line at the top of the file.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/contact/route.ts src/components/sections/Contact.tsx .env.example package.json bun.lock
git commit -m "feat: wire Resend email integration and remove Twitter link"
```

---

## Chunk 4: Instagram Feed — Behold.so

### Task 7: Create Instagram section component

**Files:**
- Create: `src/components/sections/Instagram.tsx`

Behold.so uses a custom HTML element (`<behold-widget>`). We load the script once via `useEffect` and render the custom element. TypeScript doesn't know about custom elements, so we add a JSX declaration.

- [ ] **Step 1: Create `src/components/sections/Instagram.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "behold-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "feed-id"?: string;
      };
    }
  }
}

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

const WIDGET_ID = process.env.NEXT_PUBLIC_BEHOLD_WIDGET_ID;

export default function Instagram() {
  useEffect(() => {
    if (!WIDGET_ID) return;
    if (document.querySelector('script[src*="behold.so"]')) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = `https://w.behold.so/widget.js`;
    document.head.appendChild(script);
  }, []);

  if (!WIDGET_ID) return null;

  return (
    <section id="instagram" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-12" {...fadeUpProps(0)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-sky-400" />
            <span className="text-sky-400 text-sm font-mono tracking-widest uppercase">
              Instagram
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            On Instagram
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Life outside the terminal.
          </p>
        </motion.div>

        <motion.div {...fadeUpProps(0.1)}>
          <behold-widget feed-id={WIDGET_ID} />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add NEXT_PUBLIC_BEHOLD_WIDGET_ID to `.env.local`**

```
NEXT_PUBLIC_BEHOLD_WIDGET_ID=your_widget_id_here
```

Replace `your_widget_id_here` with the widget ID from your Behold.so dashboard. If you haven't set it up yet, leave it blank — the section will be hidden until the env var is set.

---

### Task 8: Insert Instagram section into page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add Instagram import and insert section**

In `src/app/page.tsx`:

Add import after the GitHubActivity import:
```tsx
import Instagram from "@/components/sections/Instagram";
```

Insert `<Instagram />` between `<GitHubActivity />` and `<Contact />`:
```tsx
<GitHubActivity />
<Instagram />
<Contact />
```

- [ ] **Step 2: Verify in dev (with widget ID set)**

With `bun dev` running, scroll to the Instagram section. The Behold.so widget should render your Instagram grid. Without a widget ID set, the section should not appear at all.

- [ ] **Step 3: Run build to catch any type errors**

```bash
bun run build
```

Expected: clean build, no errors. Fix any TypeScript errors before proceeding.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Instagram.tsx src/app/page.tsx .env.example
git commit -m "feat: add Instagram feed section via Behold.so"
```

---

## Final Verification

- [ ] Run `bun run build` — must pass clean
- [ ] Open `http://localhost:3000` at 375px width — no horizontal overflow
- [ ] Check browser tab shows JJ favicon
- [ ] Visit `/opengraph-image` — see gradient card
- [ ] Submit contact form — receive email at njjeffreys@gmail.com
- [ ] Instagram section visible (if Behold widget ID configured)
- [ ] Git log shows clean commit history

---

## Notes for Executor

- `.env.local` is never committed — only `.env.example` goes to git
- If Resend rejects `onboarding@resend.dev` sender, the user must verify a domain in Resend and update the `from` field
- Behold.so widget ID format is typically a short alphanumeric string found in the widget's embed code
- The `opengraph-image.tsx` `runtime = "edge"` means it runs at the edge — this is required for `ImageResponse`
