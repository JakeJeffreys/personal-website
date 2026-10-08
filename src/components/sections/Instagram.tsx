"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/paper";

/** Alternating tilts so the strip reads as photos dropped on a table. */
const POLAROID_ROTATIONS = [-2.1, 1.6, -1.2, 2.3, -1.8, 1.1];


function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

/**
 * Lazy photos in a moving strip would otherwise pop in as blank white boxes.
 * Instead the frame shows unexposed film (surface-2) and the photo develops
 * in when it arrives. Opacity is an inline style so the layout's <noscript>
 * rule still reveals it without JS.
 */
function DevelopingPhoto({ src, size }: { src: string; size: number }) {
  const [developed, setDeveloped] = useState(false);
  return (
    <div style={{ height: size - 44, background: "var(--color-surface-2)" }}>
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={(size - 44) * 2}
        sizes={`${size}px`}
        quality={70}
        draggable={false}
        onLoad={() => setDeveloped(true)}
        className="h-full w-full object-cover"
        style={{
          opacity: developed ? 1 : 0,
          filter: developed ? "none" : "sepia(0.6) brightness(1.15)",
          transition: "opacity 0.8s ease-out, filter 1.4s ease-out",
        }}
      />
    </div>
  );
}

export default function Instagram({ photos }: { photos: string[] }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const lastDragXRef = useRef(0);
  const velocityRef = useRef(0);
  const [paused, setPaused] = useState(false);

  const PHOTO_SIZE = 280;
  const GAP = 12;
  const ITEM_WIDTH = PHOTO_SIZE + GAP;
  const SPEED = 0.5; // px per frame
  const TOTAL_WIDTH = photos.length * ITEM_WIDTH;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!isDraggingRef.current && !paused && !reduceMotion) {
        positionRef.current += SPEED * (dt / 16.67);
        if (positionRef.current >= TOTAL_WIDTH) {
          positionRef.current -= TOTAL_WIDTH;
        }
      }

      track.style.transform = `translateX(${-positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [paused, TOTAL_WIDTH, reduceMotion]);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPosRef.current = positionRef.current;
    lastDragXRef.current = e.clientX;
    velocityRef.current = 0;
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      velocityRef.current = lastDragXRef.current - e.clientX;
      lastDragXRef.current = e.clientX;
      const delta = dragStartXRef.current - e.clientX;
      let newPos = dragStartPosRef.current + delta;
      newPos = ((newPos % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH;
      positionRef.current = newPos;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [TOTAL_WIDTH]);

  // Touch drag
  const onTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartPosRef.current = positionRef.current;
    lastDragXRef.current = e.touches[0].clientX;
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      velocityRef.current = lastDragXRef.current - e.touches[0].clientX;
      lastDragXRef.current = e.touches[0].clientX;
      const delta = dragStartXRef.current - e.touches[0].clientX;
      let newPos = dragStartPosRef.current + delta;
      newPos = ((newPos % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH;
      positionRef.current = newPos;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [TOTAL_WIDTH]);

  // Nothing to scroll — don't render an empty marquee.
  if (photos.length === 0) return null;

  // Duplicate photos for seamless loop
  const loopedPhotos = [...photos, ...photos];

  return (
    <section id="instagram" className="py-20 overflow-hidden">
      {/* Padding lives here, not on the section, so the marquee stays full-bleed */}
      <div className="px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="life outside the terminal"
            eyebrow="the photo box"
            variant="taped"
          />
        </div>
      </div>

      <motion.div {...(reduceMotion ? {} : fadeUpProps(0.1))}>
        {/* Fade masks on edges */}
        <div className="relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, var(--color-background), transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, var(--color-background), transparent)" }}
          />

          <div
            // Vertical padding gives the tilted frames, hover lift and shadow room
            // inside the clip box; the negative margin keeps section spacing as-is.
            className="-my-6 overflow-hidden py-6 cursor-grab active:cursor-grabbing select-none"
            role="group"
            aria-label="Photo feed from Instagram"
            onMouseDown={onMouseDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
          >
            <div
              ref={trackRef}
              className="flex"
              style={{ gap: `${GAP}px`, width: `${loopedPhotos.length * ITEM_WIDTH}px` }}
            >
              {loopedPhotos.map((photo, i) => (
                <motion.div
                  key={i}
                  className="paper-tilt flex-shrink-0"
                  style={{
                    width: PHOTO_SIZE,
                    // Polaroid: even frame with a deep chin below the image
                    padding: "10px 10px 34px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                    boxShadow: "var(--shadow-paper)",

                  }}
                  initial={reduceMotion ? false : {
                    opacity: 0,
                    y: 18,
                    rotate: POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length] * -2,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: reduceMotion ? 0 : POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length],
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={reduceMotion ? undefined : {
                    rotate: 0,
                    y: -6,
                    boxShadow: "var(--shadow-paper-lift)",
                  }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
                >
                  <DevelopingPhoto src={`/instagram/${photo}`} size={PHOTO_SIZE} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
