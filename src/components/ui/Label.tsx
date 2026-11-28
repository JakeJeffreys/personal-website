import { cn } from "@/lib/utils";

const TONES = {
  accent: "text-[var(--color-accent-ink)]",
  muted: "text-[var(--color-text-muted)]",
  dim: "text-[var(--color-text-dim)]",
} as const;

/** Small mono metadata text. `tag` adds a bordered chip look. */
export default function Label({
  tone = "muted",
  tag = false,
  className,
  children,
}: {
  tone?: keyof typeof TONES;
  tag?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-mono text-xs tracking-wide",
        TONES[tone],
        tag &&
          "inline-block rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
}
