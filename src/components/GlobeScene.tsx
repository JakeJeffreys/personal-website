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

  useFrame(() => {
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
      {/* Globe sphere (solid background) */}
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
