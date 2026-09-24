"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Scrawl } from "@/components/paper";
import { useCommandPalette } from "@/components/CommandPaletteProvider";

/**
 * The 404 page as undeliverable mail: the same postcard as Contact, stamped
 * RETURN TO SENDER, addressed to whatever path the visitor asked for.
 */
export default function ReturnToSender() {
  const pathname = usePathname();
  const { setOpen } = useCommandPalette();

  return (
    <motion.div
      className="paper-tilt relative w-full max-w-2xl"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-paper-lift)",
      }}
      initial={{ opacity: 0, y: -24, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: 0.8 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
    >
      <div className="grid gap-8 p-8 sm:grid-cols-[1fr_auto_1fr] sm:p-10">
        {/* Message side */}
        <div>
          <p
            className="font-mono text-xs uppercase tracking-[0.18em]"
            style={{ color: "var(--color-accent-ink)" }}
          >
            Error 404
          </p>
          <h1
            className="mt-3"
            style={{
              fontFamily: "var(--font-hand)",
              color: "var(--color-text)",
              fontSize: "clamp(2.6rem, 7vw, 3.6rem)",
              lineHeight: 0.95,
            }}
          >
            Address unknown
          </h1>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            This page got lost in the mail. It may have moved, or it never
            existed.
          </p>
        </div>

        <div
          className="hidden w-px sm:block"
          style={{ backgroundColor: "var(--color-border)" }}
          aria-hidden="true"
        />

        {/* Address side */}
        <div className="relative flex flex-col justify-end gap-3 pt-20">
          {/* Postmark: slams down after the card lands */}
          <motion.div
            className="pointer-events-none absolute right-0 top-0 z-10 select-none px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.2em] sm:text-base"
            style={{
              color: "var(--color-accent)",
              border: "3px double var(--color-accent)",
              borderRadius: "4px",
              opacity: 0.85,
            }}
            initial={{ scale: 2.2, opacity: 0, rotate: -14 }}
            animate={{ scale: 1, opacity: 0.85, rotate: -14 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 500, damping: 22 }}
            aria-hidden="true"
          >
            Return to sender
          </motion.div>
          <AddressLine label="to">
            <span className="break-all font-mono text-sm">{pathname}</span>
          </AddressLine>
          <AddressLine label="status">
            <span className="font-mono text-sm">no such address</span>
          </AddressLine>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 px-8 pb-8 sm:px-10"
        style={{ borderTop: "1.5px dashed var(--color-border)", paddingTop: "1.5rem" }}
      >
        <Link
          href="/"
          className="px-4 py-2 font-mono text-sm transition-transform hover:-translate-y-0.5"
          style={{
            background: "var(--color-accent-ink)",
            color: "var(--color-surface)",
            borderRadius: "var(--radius-card)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          ← Back home
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-sm underline decoration-dotted underline-offset-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          or press ⌘K to look around
        </button>
        <Scrawl rotate={-3} className="ml-auto">
          happens to the best of us
        </Scrawl>
      </div>
    </motion.div>
  );
}

function AddressLine({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-baseline gap-3 pb-1"
      style={{ borderBottom: "1px solid var(--color-border)", color: "var(--color-text)" }}
    >
      <span
        className="font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: "var(--color-text-dim)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
