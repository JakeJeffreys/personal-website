# Command Palette Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a VS Code-style command palette (⌘K / Ctrl+K) that provides site navigation, actions (resume, theme toggle), and a Konami easter egg trigger — accessible from any page.

**Architecture:** Single `CommandPalette` client component mounted once in `layout.tsx`. Uses the `cmdk` headless library for keyboard navigation and fuzzy search. A shared `useCommandPalette` context hook exposes `open/setOpen` so Nav and any other component can trigger it. A `⌘K` hint badge is added to Nav.

**Tech Stack:** `cmdk`, React context, `next-themes` (already installed for theme toggle)

---

## Chunk 1: Foundation

### Task 1: Install `cmdk`

**Files:**
- `package.json` (modified by install)

- [ ] **Step 1: Install**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun add cmdk
```

- [ ] **Step 2: Verify**

```bash
node -e "require('cmdk'); console.log('cmdk ok')"
```

Expected: `cmdk ok`

---

### Task 2: Create command palette context

**Files:**
- Create: `src/components/CommandPaletteProvider.tsx`

This provides `open` state and `setOpen` via React context so the palette can be opened from Nav or any other component.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CommandPaletteProvider.tsx
git commit -m "feat: add CommandPaletteProvider context"
```

---

## Chunk 2: The Palette UI

### Task 3: Create the Konami easter egg hook

**Files:**
- Create: `src/hooks/useKonamiCode.ts`

The Konami easter egg effect is shared between the command palette and the future Konami easter egg feature. Defining it here first.

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect, useCallback } from "react";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export function useKonamiCode(onActivate: () => void) {
  useEffect(() => {
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[index]) {
        index++;
        if (index === KONAMI.length) {
          onActivate();
          index = 0;
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onActivate]);
}

export function triggerKonamiEffect() {
  // Invert colors briefly as the easter egg effect
  document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
  setTimeout(() => {
    document.documentElement.style.filter = "";
  }, 1200);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useKonamiCode.ts
git commit -m "feat: add useKonamiCode hook and triggerKonamiEffect"
```

---

### Task 4: Create `CommandPalette` component

**Files:**
- Create: `src/components/CommandPalette.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useCommandPalette } from "./CommandPaletteProvider";
import { triggerKonamiEffect } from "@/hooks/useKonamiCode";

const NAV_COMMANDS = [
  { label: "Go to About", href: "#about" },
  { label: "Go to Experience", href: "#experience" },
  { label: "Go to Projects", href: "#projects" },
  { label: "Go to GitHub Activity", href: "#github-activity" },
  { label: "Go to Contact", href: "#contact" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { theme, setTheme } = useTheme();

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  const handleSelect = useCallback((value: string) => {
    setOpen(false);
    if (value === "resume") {
      window.open("/resume.pdf", "_blank");
    } else if (value === "theme") {
      setTheme(theme === "dark" ? "light" : "dark");
    } else if (value === "konami") {
      setTimeout(triggerKonamiEffect, 150);
    } else if (value.startsWith("#")) {
      setTimeout(() => scrollTo(value), 100);
    }
  }, [setOpen, theme, setTheme]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl overflow-hidden border"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full" label="Command palette">
          {/* Search input */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span style={{ color: "var(--color-accent)" }} className="font-mono text-lg">⌘</span>
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{ color: "var(--color-text)" }}
            />
            <kbd
              className="text-xs font-mono px-1.5 py-0.5 rounded border"
              style={{ color: "var(--color-text-dim)", borderColor: "var(--color-border)" }}
            >
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto">
            <Command.Empty className="py-8 text-center text-sm font-mono" style={{ color: "var(--color-text-dim)" }}>
              No results found.
            </Command.Empty>

            {/* Navigation */}
            <Command.Group
              heading="Navigation"
              className="px-2 pt-2"
            >
              {NAV_COMMANDS.map((cmd) => (
                <Command.Item
                  key={cmd.href}
                  value={cmd.href}
                  onSelect={handleSelect}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono cursor-pointer data-[selected=true]:bg-[var(--color-surface)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span style={{ color: "var(--color-accent)" }}>↓</span>
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions" className="px-2 pt-2">
              <Command.Item
                value="resume"
                onSelect={handleSelect}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-mono cursor-pointer data-[selected=true]:bg-[var(--color-surface)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--color-accent)" }}>↓</span>
                  Open Resume
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}
                >
                  PDF
                </span>
              </Command.Item>
              <Command.Item
                value="theme"
                onSelect={handleSelect}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono cursor-pointer data-[selected=true]:bg-[var(--color-surface)]"
                style={{ color: "var(--color-text-muted)" }}
              >
                <span style={{ color: "var(--color-accent)" }}>↓</span>
                Toggle Dark / Light Mode
              </Command.Item>
            </Command.Group>

            {/* Easter Eggs */}
            <Command.Group heading="Easter Eggs" className="px-2 pt-2 pb-2">
              <Command.Item
                value="konami"
                onSelect={handleSelect}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono cursor-pointer data-[selected=true]:bg-[var(--color-surface)]"
                style={{ color: "var(--color-text-dim)" }}
              >
                <span style={{ color: "#f59e0b" }}>★</span>
                <span>konami</span>
                <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>— you know what to do</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div
            className="flex items-center gap-4 px-4 py-2.5 border-t text-xs font-mono"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}
          >
            <span><kbd className="mr-1">↑↓</kbd>navigate</span>
            <span><kbd className="mr-1">↵</kbd>select</span>
            <span><kbd className="mr-1">ESC</kbd>close</span>
          </div>
        </Command>
      </div>
    </div>
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
git add src/components/CommandPalette.tsx
git commit -m "feat: add CommandPalette component with cmdk"
```

---

## Chunk 3: Wire It Up

### Task 5: Mount provider and palette in layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Wrap `ThemeProvider` children with `CommandPaletteProvider` and mount `CommandPalette`**

In `src/app/layout.tsx`, add imports and update the body:

```tsx
// Add imports:
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";
import CommandPalette from "@/components/CommandPalette";

// Replace the body content:
<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  <ThemeProvider>
    <CommandPaletteProvider>
      <CommandPalette />
      {children}
    </CommandPaletteProvider>
  </ThemeProvider>
  <Analytics />
</body>
```

- [ ] **Step 2: Build and verify**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount CommandPaletteProvider and CommandPalette in root layout"
```

---

### Task 6: Add ⌘K hint badge to Nav

**Files:**
- Modify: `src/components/Nav.tsx`

- [ ] **Step 1: Import context and add hint badge**

In `src/components/Nav.tsx`:

1. Add import: `import { useCommandPalette } from "./CommandPaletteProvider";`
2. Inside the component, add: `const { setOpen } = useCommandPalette();`
3. In the desktop nav, after the `<ul>` of links and before the theme toggle button, add the hint badge:

```tsx
{/* ⌘K hint */}
<motion.button
  onClick={() => setOpen(true)}
  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-colors focus:outline-none"
  style={{
    borderColor: "var(--color-border)",
    color: "var(--color-text-dim)",
    backgroundColor: "transparent",
  }}
  whileHover={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
  aria-label="Open command palette"
>
  <span>⌘K</span>
</motion.button>
```

- [ ] **Step 2: Build and manually test**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Then run `bun run dev` and verify:
- `⌘K` badge visible in desktop nav
- Clicking badge opens palette
- Pressing `⌘K` (Mac) or `Ctrl+K` (Win/Linux) opens palette
- ESC and backdrop click close it
- Arrow keys navigate, Enter selects
- Nav items scroll to correct sections
- "Toggle Dark / Light Mode" switches theme
- "Open Resume" opens `/resume.pdf` in new tab
- Typing `konami` and pressing Enter triggers the invert effect

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add ⌘K hint badge to Nav, wire to CommandPaletteProvider"
```
