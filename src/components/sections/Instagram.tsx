"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui";

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.25, ease: "easeOut" as const, delay },
  };
}

/**
 * Lazy photos in a moving strip would otherwise pop in as blank boxes.
 * The frame shows surface-2 and the photo fades in when it arrives. Opacity is
 * an inline style so the layout's <noscript> rule still reveals it without JS.
 */
function FadeInPhoto({ src, size }: { src: string; size: number }) {
  const [developed, setDeveloped] = useState(false);
  return (
    <div style={{ height: size - 18, background: "var(--color-surface-2)" }}>
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={(size - 18) * 2}
        sizes={`${size}px`}
        quality={70}
        draggable={false}
        onLoad={() => setDeveloped(true)}
        className="h-full w-full object-cover"
        style={{
          opacity: developed ? 1 : 0,
          transition: "opacity 0.25s ease-out",
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
            title="Life outside the terminal"
            eyebrow="photos"
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
            className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
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
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{
                    width: PHOTO_SIZE,
                    padding: "8px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-card)",
                  }}
                >
                  <FadeInPhoto src={`/instagram/${photo}`} size={PHOTO_SIZE} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
