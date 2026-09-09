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

/**
 * Ink bleeding into paper.
 *
 * Replaces the green matrix rain, which was pure digital and fought the paper
 * direction. Blots bloom from random origins with irregular edges, soak outward
 * with decreasing alpha, and leave a coffee ring behind.
 *
 * Public API is unchanged: same canvas mount, same fixed overlay, same timed
 * teardown. Colours are read off the computed root style so it works in both
 * paper and night paper.
 */
export function triggerKonamiEffect() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const canvas = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "9999",
    pointerEvents: "none",
  });
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  const w = window.innerWidth;
  const h = window.innerHeight;

  const rootStyle = getComputedStyle(document.documentElement);
  const ink = rootStyle.getPropertyValue("--color-text").trim() || "#2a2622";
  const accent = rootStyle.getPropertyValue("--color-accent").trim() || "#e8552b";

  type Blot = {
    x: number;
    y: number;
    r: number;
    maxR: number;
    speed: number;
    color: string;
    lobes: number[];
    ring: boolean;
  };

  const BLOT_COUNT = prefersReducedMotion ? 6 : 26;
  const blots: Blot[] = Array.from({ length: BLOT_COUNT }, (_, i) => {
    const lobeCount = 9 + Math.floor(Math.random() * 4);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0,
      maxR: 40 + Math.random() * 120,
      // Stagger starts so the page soaks progressively rather than all at once
      speed: (0.6 + Math.random() * 1.4) * (prefersReducedMotion ? 4 : 1),
      color: i % 5 === 0 ? accent : ink,
      lobes: Array.from({ length: lobeCount }, () => 0.78 + Math.random() * 0.42),
      ring: Math.random() > 0.72,
    };
  });

  /** One blot: an irregular closed blob rather than a circle. */
  function drawBlot(b: Blot, alpha: number) {
    const n = b.lobes.length;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const idx = i % n;
      const angle = (i / n) * Math.PI * 2;
      const radius = b.r * b.lobes[idx];
      const px = b.x + Math.cos(angle) * radius;
      const py = b.y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else {
        const prevAngle = ((i - 1) / n) * Math.PI * 2;
        const prevRadius = b.r * b.lobes[(i - 1) % n];
        const cx = b.x + Math.cos((prevAngle + angle) / 2) * ((radius + prevRadius) / 2) * 1.08;
        const cy = b.y + Math.sin((prevAngle + angle) / 2) * ((radius + prevRadius) / 2) * 1.08;
        ctx.quadraticCurveTo(cx, cy, px, py);
      }
    }
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = b.color;
    ctx.fill();

    if (b.ring) {
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  const DURATION = 3000;
  const start = Date.now();

  function draw() {
    const elapsed = Date.now() - start;
    const t = elapsed / DURATION;

    ctx.clearRect(0, 0, w, h);

    for (const b of blots) {
      if (b.r < b.maxR) b.r += b.speed;
      // Soak in, hold, then fade as the paper dries
      const alpha = 0.18 * Math.min(1, t * 4) * (1 - Math.max(0, (t - 0.6) / 0.4));
      if (alpha > 0) drawBlot(b, alpha);
    }

    ctx.globalAlpha = 1;

    if (elapsed < DURATION) requestAnimationFrame(draw);
    else canvas.remove();
  }

  requestAnimationFrame(draw);
}
