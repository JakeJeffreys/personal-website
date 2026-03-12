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
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "9999",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  const chars = "アイウエオカキクケコ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|;:";
  const start = Date.now();

  function draw() {
    const elapsed = Date.now() - start;
    ctx.fillStyle = "rgba(10,15,30,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#22c55e";
    ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    if (elapsed < 4000) requestAnimationFrame(draw);
    else canvas.remove();
  }

  requestAnimationFrame(draw);
}
