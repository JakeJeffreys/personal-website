# Tech Stack Grid Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Tech Stack Grid section between About and Experience showing skills from `resume.ts` grouped by category with Simple Icons SVG brand icons and Framer Motion hover/entrance animations.

**Architecture:** Update `resume.ts` skills[] to the agreed list, then build a `TechStack` server component that maps over categories and renders pill badges with icons. No client state needed — hover effects are pure CSS/Tailwind.

**Tech Stack:** `simple-icons`, Framer Motion (already installed), `resume.ts` as data source

---

## Chunk 1: Update Data + Scaffold Component

### Task 1: Update `resume.ts` skills[]

**Files:**
- Modify: `src/content/resume.ts`

- [ ] **Step 1: Replace the `skills` array**

Open `src/content/resume.ts`. Replace the existing `skills` export (lines 86–107) with:

```ts
export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Java", "SQL", "Bash"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Java Spring", "REST APIs", "Docker", "Kubernetes"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Lambda", "DynamoDB", "S3", "CloudFront", "API Gateway", "SNS", "SQS", "EventBridge", "Terraform"],
  },
  {
    category: "Observability",
    items: ["Datadog", "Runscope", "BlazeMeter"],
  },
  {
    category: "AI & Agents",
    items: ["Claude Code", "Claude API", "MCP", "Agent SDK", "Skills"],
  },
];
```

> Note: Python, Jenkins, Tailwind CSS, Framer Motion, Split.io, React, Next.js removed. DynamoDB moved from Backend → Infrastructure. Docker, Kubernetes, EventBridge, and "AI & Agents" category added.

- [ ] **Step 2: Verify TypeScript still compiles**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: build succeeds (or only pre-existing errors, none from resume.ts).

- [ ] **Step 3: Commit**

```bash
git add src/content/resume.ts
git commit -m "feat: update skills[] — remove frontend, add Docker/K8s/EventBridge/AI & Agents"
```

---

### Task 2: Install `simple-icons`

**Files:**
- `package.json` (modified by install)

- [ ] **Step 1: Install the package**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun add simple-icons
```

- [ ] **Step 2: Verify it installed**

```bash
node -e "const si = require('simple-icons'); console.log(si.siTypescript.title)"
```

Expected: `TypeScript`

---

### Task 3: Create icon utility

**Files:**
- Create: `src/lib/icons.ts`

- [ ] **Step 1: Create the file**

`src/lib/icons.ts` maps skill display names to their Simple Icons slugs and brand colors. Items without a Simple Icons entry fall back to a text badge.

```ts
import * as si from "simple-icons";

// Map display name → simple-icons key (siXxx)
const ICON_MAP: Record<string, string> = {
  TypeScript: "siTypescript",
  JavaScript: "siJavascript",
  Java: "siJava",
  SQL: "siPostgresql",
  Bash: "siGnubash",
  "Node.js": "siNodedotjs",
  "Java Spring": "siSpring",
  Docker: "siDocker",
  Kubernetes: "siKubernetes",
  AWS: "siAmazonwebservices",
  Lambda: "siAwslambda",
  DynamoDB: "siAmazondynamodb",
  S3: "siAmazons3",
  CloudFront: "siAmazoncloudfront",
  "API Gateway": "siAmazonapigateway",
  SNS: "siAmazonsns",
  SQS: "siAmazonsqs",
  EventBridge: "siAmazoneventbridge",
  Terraform: "siTerraform",
  Datadog: "siDatadog",
  BlazeMeter: "siBlazemeter",
};

export interface IconInfo {
  svg: string;
  color: string;
}

export function getIconInfo(name: string): IconInfo | null {
  const key = ICON_MAP[name];
  if (!key) return null;
  const icon = (si as Record<string, { svg: string; hex: string } | undefined>)[key];
  if (!icon) return null;
  return { svg: icon.svg, color: `#${icon.hex}` };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/icons.ts
git commit -m "feat: add icon utility mapping skill names to simple-icons"
```

---

## Chunk 2: Build the Section

### Task 4: Create `TechStack` section component

**Files:**
- Create: `src/components/sections/TechStack.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/content/resume";
import { getIconInfo } from "@/lib/icons";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function SkillPill({ name, index, isAI }: { name: string; index: number; isAI: boolean }) {
  const icon = getIconInfo(name);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group flex items-center gap-2 rounded-lg px-3 py-2 border transition-all duration-200 cursor-default"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: isAI ? "var(--color-accent)" : "var(--color-border)",
        boxShadow: isAI ? "0 0 10px rgba(56,189,248,0.08)" : "none",
      }}
      whileHover={{
        borderColor: "var(--color-accent)",
        boxShadow: "0 0 14px rgba(56,189,248,0.15)",
      }}
    >
      {icon ? (
        <span
          className="w-4 h-4 flex-shrink-0"
          style={{ color: icon.color }}
          dangerouslySetInnerHTML={{
            __html: icon.svg.replace("<svg", `<svg width="16" height="16" fill="currentColor"`),
          }}
        />
      ) : (
        <span
          className="w-4 h-4 flex-shrink-0 rounded text-[8px] font-bold font-mono flex items-center justify-center"
          style={{ backgroundColor: "var(--color-accent)", color: "var(--color-background)" }}
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
        {name}
      </span>
    </motion.div>
  );
}

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="tech-stack"
      ref={ref}
      className="py-24 px-6"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          <p
            className="font-mono text-sm tracking-widest uppercase mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            What I work with
          </p>
          <h2
            className="text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Tech Stack
          </h2>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="space-y-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skills.map((category, catIndex) => {
            const isAI = category.category === "AI & Agents";
            return (
              <div key={category.category}>
                {/* Category label */}
                <motion.div
                  custom={catIndex * 3}
                  variants={fadeUp}
                  className="mb-4 pb-2 border-b"
                  style={{ borderColor: isAI ? "rgba(56,189,248,0.3)" : "var(--color-border)" }}
                >
                  <span
                    className="text-xs font-mono font-semibold tracking-widest uppercase"
                    style={{ color: isAI ? "var(--color-accent)" : "var(--color-text-dim)" }}
                  >
                    {category.category}
                  </span>
                </motion.div>

                {/* Pills */}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <SkillPill
                      key={item}
                      name={item}
                      index={catIndex * 3 + itemIndex + 1}
                      isAI={isAI}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/TechStack.tsx
git commit -m "feat: add TechStack section component with simple-icons and framer motion"
```

---

### Task 5: Wire TechStack into the page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add import and render TechStack between About and Experience**

In `src/app/page.tsx`, add the import at the top and insert `<TechStack />` between `<About />` and `<Experience />`:

```tsx
// Add import (after existing imports):
import TechStack from "@/components/sections/TechStack";

// In JSX, replace:
//   <About />
//   <Experience />
// with:
//   <About />
//   <TechStack />
//   <Experience />
```

- [ ] **Step 2: Build and visually verify**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: clean build.

Then run `bun run dev` and open `http://localhost:3000`. Scroll to the Tech Stack section:
- All 5 categories visible (Languages, Backend, Infrastructure, Observability, AI & Agents)
- Brand icons showing for known technologies, text fallback for REST APIs / Runscope / Skills etc.
- AI & Agents pills have accent-colored border
- Hover state applies accent glow to all pills

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire TechStack section into page between About and Experience"
```
