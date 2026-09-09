"use client";

import { cn } from "@/lib/utils";

/**
 * A strip of translucent tape holding something to the page.
 *
 * Deliberately slightly crooked. The tint is a fixed warm yellow rather than a
 * token because tape is tape in both themes — it just sits on a darker ground
 * at night.
 */
export default function Tape({
  rotate = -1.6,
  className,
  children,
}: {
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "paper-tilt inline-block px-4 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
        className
      )}
      style={{
        backgroundColor: "rgba(230, 220, 150, 0.55)",
        border: "1px solid rgba(180, 170, 110, 0.45)",
        color: "var(--color-text-muted)",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </span>
  );
}
