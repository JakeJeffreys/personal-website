"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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

export default function Instagram({ photos }: { photos: string[] }) {
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

      if (!isDraggingRef.current && !paused) {
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
  }, [paused, TOTAL_WIDTH]);

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
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="life outside the terminal"
          eyebrow="the photo box"
          variant="taped"
        />
      </div>

      <motion.div {...fadeUpProps(0.1)}>
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
                    transform: `rotate(${POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length]}deg)`,
                  }}
                  whileHover={{
                    rotate: 0,
                    y: -6,
                    boxShadow: "var(--shadow-paper-lift)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/instagram/${photo}`}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{ height: PHOTO_SIZE - 44 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
