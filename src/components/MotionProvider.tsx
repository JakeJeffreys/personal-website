"use client";

import { MotionConfig } from "framer-motion";

// Site-wide: with reduced motion on, transforms (slides, springs) are skipped; opacity still fades.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
