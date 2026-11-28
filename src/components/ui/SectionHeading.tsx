"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import Label from "./Label";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Plain heading with an optional mono eyebrow. */
export default function SectionHeading({
  title,
  eyebrow,
  as: Tag = "h2",
  className,
}: {
  title: string;
  eyebrow?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("mb-10", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {eyebrow && (
        <Label tone="accent" className="mb-2 block uppercase tracking-[0.14em]">
          {eyebrow}
        </Label>
      )}
      <Tag className="text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
        {title}
      </Tag>
    </motion.div>
  );
}
