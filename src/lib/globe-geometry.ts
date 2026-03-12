import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import * as THREE from "three";

export async function loadContinentLines(radius: number): Promise<THREE.BufferGeometry> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
  );
  const world = (await res.json()) as Topology;

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
