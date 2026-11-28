"use client";

import { useCommandPalette } from "@/components/CommandPaletteProvider";

export default function NotFoundActions() {
  const { setOpen } = useCommandPalette();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex min-h-11 items-center font-mono text-sm underline underline-offset-4"
      style={{ color: "var(--color-text-muted)" }}
    >
      or press ⌘K to look around
    </button>
  );
}
