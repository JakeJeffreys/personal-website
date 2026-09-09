"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Tilt = "a" | "b" | "c" | "none";

const TILT_DEG: Record<Tilt, number> = {
  a: -0.7,
  b: 1.1,
  c: -1.4,
  none: 0,
};

/**
 * Card stock lying on a desk.
 *
 * Depth is a hard offset shadow with zero blur — paper doesn't glow. Rotation
 * is applied to the card only, never to a text node, so glyphs stay crisp and
 * nothing clips.
 */
export default function PaperCard({
  tilt = "none",
  lift = true,
  delay = 0,
  className,
  children,
}: {
  tilt?: Tilt;
  lift?: boolean;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const deg = TILT_DEG[tilt];

  return (
    <motion.div
      className={cn("paper-tilt", className)}
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-paper)",
      }}
      initial={{ opacity: 0, y: -18, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: deg }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        delay,
      }}
      whileHover={
        lift
          ? {
              rotate: 0,
              y: -3,
              boxShadow: "var(--shadow-paper-lift)",
              transition: { type: "spring", stiffness: 400, damping: 22 },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
