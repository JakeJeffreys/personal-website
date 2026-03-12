"use client";

import { useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useCommandPalette } from "./CommandPaletteProvider";
import { useKonamiCode, triggerKonamiEffect } from "@/hooks/useKonamiCode";

const NAV_COMMANDS = [
  { label: "Go to About", href: "#about" },
  { label: "Go to Experience", href: "#experience" },
  { label: "Go to Tech Stack", href: "#tech-stack" },
  { label: "Go to GitHub Activity", href: "#github" },
  { label: "Go to Photo Feed", href: "#instagram" },
  { label: "Go to Contact", href: "#contact" },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { theme, setTheme } = useTheme();

  // Listen for physical Konami sequence (↑↑↓↓←→←→BA)
  useKonamiCode(triggerKonamiEffect);

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
