# 3D Hero Globe Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a rotating 3D wireframe globe with continent outlines and a glowing Denver pin to the right side of the Hero section.

**Architecture:** A `GlobeScene` component contains the actual Three.js/R3F scene (continent lines from GeoJSON + OrbitControls). A thin `Globe` wrapper uses `next/dynamic` with `ssr: false` to prevent SSR hydration errors. Hero.tsx is refactored from centered layout to a two-column flex layout (text left, globe right) on `md+` screens.

**Tech Stack:** `@react-three/fiber`, `@react-three/drei`, `three`, `d3-geo`, `topojson-client`, `world-atlas`

---

## Chunk 1: Install Dependencies

### Task 1: Install R3F packages

**Files:**
- `package.json` (modified by install)

- [ ] **Step 1: Install**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun add @react-three/fiber @react-three/drei three
```

- [ ] **Step 2: Install geo packages**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun add d3-geo topojson-client world-atlas
```

- [ ] **Step 3: Install types**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun add -d @types/three @types/d3-geo @types/topojson-client @types/world-atlas
```

- [ ] **Step 4: Verify build still passes**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add package.json bun.lockb
git commit -m "chore: install react-three-fiber, drei, d3-geo, topojson-client, world-atlas"
```

---

## Chunk 2: Build the Globe

### Task 2: Create continent geometry utility

**Files:**
- Create: `src/lib/globe-geometry.ts`

This utility loads the world-atlas TopoJSON and converts continent outlines to Three.js `BufferGeometry` line segments, projected orthographically onto a sphere of a given radius.

- [ ] **Step 1: Create the file**

```ts
import * as topojson from "topojson-client";
import { geoOrthographic, geoPath } from "d3-geo";
import type { Topology } from "topojson-specification";
import * as THREE from "three";

// Converts a GeoJSON MultiLineString/LineString path to 3D points on a sphere
function geoPathTo3D(
  coordinates: number[][][],
  radius: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (const ring of coordinates) {
    for (const [lon, lat] of ring) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      points.push(
        new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    // Add a break between rings by inserting a NaN point
    points.push(new THREE.Vector3(NaN, NaN, NaN));
  }
  return points;
}

export async function loadContinentLines(radius: number): Promise<THREE.BufferGeometry> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  );
  const world = (await res.json()) as Topology;

  const countries = topojson.feature(world, world.objects.countries as any);
  const mesh = topojson.mesh(world, world.objects.countries as any);

  const allPoints: number[] = [];
  const coords = (mesh.coordinates as number[][][]);

  for (const ring of coords) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [lon1, lat1] = ring[i];
      const [lon2, lat2] = ring[i + 1];

      const phi1 = (90 - lat1) * (Math.PI / 180);
      const theta1 = (lon1 + 180) * (Math.PI / 180);
      const phi2 = (90 - lat2) * (Math.PI / 180);
      const theta2 = (lon2 + 180) * (Math.PI / 180);

      // Start point
      allPoints.push(
        -radius * Math.sin(phi1) * Math.cos(theta1),
        radius * Math.cos(phi1),
        radius * Math.sin(phi1) * Math.sin(theta1)
      );
      // End point
      allPoints.push(
        -radius * Math.sin(phi2) * Math.cos(theta2),
        radius * Math.cos(phi2),
        radius * Math.sin(phi2) * Math.sin(theta2)
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(allPoints, 3)
  );
  return geometry;
}
```

> **Note:** This fetches from jsDelivr CDN at runtime (cached after first load). The world-atlas npm package is included as a fallback type reference.

- [ ] **Step 2: Commit**

```bash
git add src/lib/globe-geometry.ts
git commit -m "feat: add globe-geometry utility for continent line segments"
```

---

### Task 3: Create `GlobeScene` (R3F canvas, no SSR)

**Files:**
- Create: `src/components/GlobeScene.tsx`

This is the actual Three.js scene — it must only run client-side. It's loaded via `next/dynamic ssr:false` in the next task.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { loadContinentLines } from "@/lib/globe-geometry";

const GLOBE_RADIUS = 1.8;
// Denver: lat 39.7392, lon -104.9903
const DENVER_LAT = 39.7392;
const DENVER_LON = -104.9903;

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function ContinentLines() {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    loadContinentLines(GLOBE_RADIUS).then(setGeometry);
  }, []);

  if (!geometry) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#2d5a8e" transparent opacity={0.85} />
    </lineSegments>
  );
}

function DenverPin() {
  const pinPos = latLonToVec3(DENVER_LAT, DENVER_LON, GLOBE_RADIUS + 0.05);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.scale.setScalar(
        1 + 0.3 * Math.sin(Date.now() * 0.003)
      );
    }
  });

  return (
    <group position={pinPos}>
      {/* Pin dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.06, 0.075, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Label */}
      <Html
        position={[0.1, 0.15, 0]}
        style={{ pointerEvents: "none" }}
        distanceFactor={4}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#38bdf8",
            whiteSpace: "nowrap",
            textShadow: "0 0 8px rgba(56,189,248,0.8)",
          }}
        >
          Denver
        </span>
      </Html>
    </group>
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current && !isHovered) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Globe sphere (wireframe grid) */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 36, 18]} />
        <meshBasicMaterial
          color="#0a0f1e"
          wireframe={false}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Lat/lon grid */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 18, 9]} />
        <meshBasicMaterial color="#1e2a45" wireframe transparent opacity={0.35} />
      </mesh>
      {/* Continent outlines */}
      <ContinentLines />
      {/* Denver pin */}
      <DenverPin />
      {/* Rim glow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.02, 36, 18]} />
        <meshBasicMaterial color="#1e3a5f" wireframe={false} transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function GlobeScene() {
  return (
    <div className="w-[220px] h-[220px] relative">
      {/* Ambient glow behind canvas */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
          transform: "scale(1.4)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Globe />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            dampingFactor={0.08}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: no errors from GlobeScene.tsx. (R3F JSX intrinsic elements like `lineSegments`, `mesh`, etc. may need tsconfig adjustment — see next step if you see TS errors.)

If you see errors like `Property 'mesh' does not exist on type 'JSX.IntrinsicElements'`, add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["@react-three/fiber"]
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GlobeScene.tsx
git commit -m "feat: add GlobeScene R3F component with continent lines and Denver pin"
```

---

### Task 4: Create `Globe` dynamic wrapper

**Files:**
- Create: `src/components/Globe.tsx`

This is a thin wrapper that uses `next/dynamic` with `ssr: false` to prevent Three.js from running during server rendering.

- [ ] **Step 1: Create the file**

```tsx
import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
  ssr: false,
  loading: () => (
    <div
      className="w-[220px] h-[220px] rounded-full"
      style={{ background: "radial-gradient(circle at 38% 35%, #0f1f3d, #070c18)" }}
    />
  ),
});

export default function Globe() {
  return <GlobeScene />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Globe.tsx
git commit -m "feat: add Globe dynamic wrapper with ssr:false"
```

---

## Chunk 3: Integrate into Hero

### Task 5: Refactor Hero layout to two-column and add globe

**Files:**
- Modify: `src/components/sections/Hero.tsx`

The Hero currently centers all content. We need to change it to a two-column flex layout on `md+` screens: text on the left, globe on the right. On mobile (`< md`), the globe is hidden and the text returns to centered layout.

- [ ] **Step 1: Add Globe import**

At the top of `src/components/sections/Hero.tsx`, add:

```tsx
import Globe from "@/components/Globe";
```

- [ ] **Step 2: Replace the main content div**

Find the `<div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full">` block.

Replace it with a two-column layout:

```tsx
{/* Main content — two column on desktop */}
<div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 max-w-5xl mx-auto w-full">
  {/* Text column */}
  <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
    {/* Pre-title label */}
    <motion.p
      className="font-mono text-sm mb-4 tracking-widest uppercase"
      style={{ color: "var(--color-accent)" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      Hello, world. I&apos;m
    </motion.p>

    {/* Name */}
    <motion.h1
      className="font-sans font-bold leading-tight tracking-tight mb-4"
      style={{
        color: "var(--color-text)",
        fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
    >
      Jake{" "}
      <span style={{ color: "var(--color-accent)" }}>Jeffreys</span>
    </motion.h1>

    {/* Cycling typed text */}
    <motion.div
      className="h-10 flex items-center justify-center md:justify-start mb-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={phraseIndex}
          className="font-mono text-xl sm:text-2xl"
          style={{ color: "var(--color-text-muted)" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {TYPED_PHRASES[phraseIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>

    {/* Tagline */}
    <motion.p
      className="text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed"
      style={{ color: "var(--color-text-dim)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.65 }}
    >
      Designing and scaling cloud-native backend systems. Currently building platform infrastructure at Ibotta.
    </motion.p>

    {/* CTA Buttons */}
    <motion.div
      className="flex flex-col sm:flex-row items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Primary CTA */}
      <motion.button
        onClick={() => scrollToSection("#experience")}
        className={cn(
          "relative px-7 py-3 rounded-lg font-mono font-medium text-sm",
          "overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        )}
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-background)",
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="relative z-10">View My Work</span>
        <motion.span
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ background: "linear-gradient(135deg, #fff 0%, transparent 60%)" }}
        />
      </motion.button>

      {/* Secondary CTA */}
      <motion.button
        onClick={() => scrollToSection("#contact")}
        className={cn(
          "px-7 py-3 rounded-lg font-mono font-medium text-sm border",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200"
        )}
        style={{
          borderColor: "var(--color-accent)",
          color: "var(--color-accent)",
          backgroundColor: "transparent",
        }}
        whileHover={{
          backgroundColor: "rgba(56, 189, 248, 0.08)",
          scale: 1.04,
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        Get In Touch
      </motion.button>
    </motion.div>
  </div>

  {/* Globe — hidden on mobile */}
  <motion.div
    className="hidden md:flex flex-shrink-0 items-center justify-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
  >
    <Globe />
  </motion.div>
</div>
```

- [ ] **Step 3: Build and verify**

```bash
cd /Users/jakejeffreys/Repos/personal-website && bun run build 2>&1 | tail -20
```

Expected: clean build.

Then run `bun run dev` and verify:
- On desktop (`≥ md`): text left, globe right; globe rotates slowly, pauses on hover
- Drag to manually rotate the globe
- Denver pin glows sky-blue with pulse ring and "Denver" label
- Continent outlines visible as thin blue lines
- On mobile: globe hidden, text centered as before
- Page loads without hydration errors in browser console

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: refactor Hero to two-column layout and integrate 3D globe"
```
