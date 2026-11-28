import { cn } from "@/lib/utils";

/** Flat surface: 1px border, small radius, no shadow. `interactive` adds a hover border for linked cards. */
export default function Card({
  interactive = false,
  className,
  children,
}: {
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]",
        interactive &&
          "transition-colors duration-200 hover:border-[var(--color-accent-ink)] focus-within:border-[var(--color-accent-ink)]",
        className
      )}
    >
      {children}
    </div>
  );
}
