"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Atmosphere — Environmental Storytelling
 * 
 * 2000 instanced dust/snow particles drifting in curl-noise patterns.
 * Cold blue tint. Very small. Creates depth, scale, and the feeling of 
 * cold Himalayan air before anything else appears.
 * 
 * This is the first thing the visitor perceives.
 */

const PARTICLE_COUNT = 2000;
const SPREAD = 20;

export default function Atmosphere() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions in a sphere
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute in a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * SPREAD;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Subtle drift velocities (wind)
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = -Math.random() * 0.002 - 0.001; // Slight downward (snow-like)
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return [pos, vel];
  }, []);

  // Sizes — varying for depth illusion
  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = Math.random() * 0.04 + 0.01;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x = posAttr.array[i * 3] as number;
      let y = posAttr.array[i * 3 + 1] as number;
      let z = posAttr.array[i * 3 + 2] as number;

      // Apply wind drift
      x += velocities[i * 3];
      y += velocities[i * 3 + 1];
      z += velocities[i * 3 + 2];

      // Add subtle sine turbulence (curl-noise approximation)
      x += Math.sin(time * 0.3 + y * 0.5) * 0.002;
      y += Math.cos(time * 0.2 + x * 0.5) * 0.001;
      z += Math.sin(time * 0.25 + z * 0.3) * 0.002;

      // Wrap particles back if they drift too far
      if (Math.abs(x) > SPREAD) x *= -0.9;
      if (y < -SPREAD) y = SPREAD;
      if (Math.abs(z) > SPREAD) z *= -0.9;

      (posAttr.array as Float32Array)[i * 3] = x;
      (posAttr.array as Float32Array)[i * 3 + 1] = y;
      (posAttr.array as Float32Array)[i * 3 + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#A8C8E8"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
