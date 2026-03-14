"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const PHOTOS = [
  "SnapInsta.to_288467111_551773773336159_6541681656165698825_n.jpg",
  "SnapInsta.to_315934497_6176996872328731_3205882519055314683_n.jpg",
  "SnapInsta.to_316136246_803820907512820_7547955553378746679_n.jpg",
  "SnapInsta.to_316176411_1340748906667194_9121341017644344103_n.jpg",
  "SnapInsta.to_331968638_5985902678152523_6161372437014303237_n.jpg",
  "SnapInsta.to_334247831_554609063316504_1654720872710418676_n.jpg",
  "SnapInsta.to_361683844_254502767330256_1817587707420264129_n.jpg",
  "SnapInsta.to_361711683_929255834840822_4294934515868365952_n.jpg",
  "SnapInsta.to_361936005_823758988958230_5437640975047828622_n.jpg",
  "SnapInsta.to_365586304_820808439674606_7839705955200385531_n.jpg",
  "SnapInsta.to_366103749_635522641951983_3073234566103624654_n.jpg",
  "SnapInsta.to_366128967_313366824584345_2514508730042298897_n.jpg",
  "SnapInsta.to_404610625_1733242157152236_5237471902122236168_n.jpg",
  "SnapInsta.to_404937428_1310479396325969_5986930891282447831_n.jpg",
  "SnapInsta.to_440702483_416913567713589_4102295047882087069_n.jpg",
  "SnapInsta.to_440873416_1082628222837478_568360752682323766_n.jpg",
  "SnapInsta.to_454239182_510337511399686_8454128103516387661_n.jpg",
  "SnapInsta.to_454261870_382012147933746_1852837594399593088_n.jpg",
  "SnapInsta.to_454283394_1537066967241121_3098031339818542316_n.jpg",
  "SnapInsta.to_454526393_878435596952584_6491359704232487848_n.jpg",
  "SnapInsta.to_482763840_18490350109035757_6264162162429828732_n.jpg",
  "SnapInsta.to_483659772_18490350172035757_3655140051870523368_n.jpg",
  "SnapInsta.to_605147736_18538144252034172_4329639457973834487_n.jpg",
  "SnapInsta.to_642573584_17951082921099922_2787738168004842258_n.jpg",
  "SnapInsta.to_646126333_17951810121095918_2927696457688359033_n.jpg",
  "SnapInsta.to_649237410_18006495269704623_8997140278942957756_n.jpg",
];

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

export default function Instagram() {
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
  const TOTAL_WIDTH = PHOTOS.length * ITEM_WIDTH;

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

  // Duplicate photos for seamless loop
  const loopedPhotos = [...PHOTOS, ...PHOTOS];

  return (
    <section id="instagram" className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-12" {...fadeUpProps(0)}>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            Photo Feed
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px w-12 rounded-full" style={{ background: "var(--color-accent)" }} />
            <div className="h-px flex-1 rounded-full" style={{ background: "var(--color-border)" }} />
          </div>
          <p className="mt-4 text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Life outside the terminal.
          </p>
        </motion.div>
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
                <div
                  key={i}
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  style={{
                    width: PHOTO_SIZE,
                    height: PHOTO_SIZE,
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/instagram/${photo}`}
                    alt=""
                    draggable={false}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
