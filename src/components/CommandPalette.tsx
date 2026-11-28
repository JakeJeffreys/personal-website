"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useCommandPalette } from "./CommandPaletteProvider";

const NAV_COMMANDS = [
  { label: "Go to Home", href: "/" },
  { label: "Go to Lab", href: "/lab" },
  { label: "Go to Work", href: "/work" },
  { label: "Go to About", href: "/about" },
];

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-[var(--radius-card)] px-3 py-2 font-mono text-sm text-[var(--color-text-muted)] data-[selected=true]:bg-[var(--color-surface-2)] data-[selected=true]:text-[var(--color-text)]";

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

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
    } else if (value.startsWith("/")) {
      router.push(value);
    }
  }, [setOpen, theme, setTheme, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      style={{ backgroundColor: "var(--scrim)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-4 w-full max-w-lg overflow-hidden border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-overlay)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full" label="Command palette">
          <div
            className="flex items-center gap-3 border-b px-4 py-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span style={{ color: "var(--color-accent-ink)" }} className="font-mono text-lg" aria-hidden="true">⌘</span>
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent font-mono text-sm outline-none"
              style={{ color: "var(--color-text)" }}
            />
            <kbd
              className="rounded-[var(--radius-card)] border px-1.5 py-0.5 font-mono text-xs"
              style={{ color: "var(--color-text-dim)", borderColor: "var(--color-border)" }}
            >
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center font-mono text-sm" style={{ color: "var(--color-text-dim)" }}>
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation">
              {NAV_COMMANDS.map((cmd) => (
                <Command.Item key={cmd.href} value={cmd.href} onSelect={handleSelect} className={itemClass}>
                  <span style={{ color: "var(--color-accent-ink)" }} aria-hidden="true">→</span>
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item value="resume" onSelect={handleSelect} className={`${itemClass} justify-between`}>
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--color-accent-ink)" }} aria-hidden="true">→</span>
                  Open Resume
                </div>
                <span
                  className="rounded-[var(--radius-card)] border px-1.5 py-0.5 font-mono text-xs"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}
                >
                  PDF
                </span>
              </Command.Item>
              <Command.Item value="theme" onSelect={handleSelect} className={itemClass}>
                <span style={{ color: "var(--color-accent-ink)" }} aria-hidden="true">→</span>
                Toggle Dark / Light Mode
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div
            className="flex items-center gap-4 border-t px-4 py-2.5 font-mono text-xs"
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
