"use client";

import { useEffect } from "react";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export function useKonamiCode(onActivate: () => void) {
  useEffect(() => {
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[index]) {
        index++;
        if (index === KONAMI.length) {
          onActivate();
          index = 0;
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onActivate]);
}

export function triggerKonamiEffect() {
  // Invert colors briefly as the easter egg effect
  document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
  setTimeout(() => {
    document.documentElement.style.filter = "";
  }, 1200);
}
