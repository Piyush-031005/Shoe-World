"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

/**
 * LightTunnel — The "Crazy" AC Motorsport Vibe
 * 
 * Replaces the human runner entirely.
 * We are flying through a high-speed tunnel of light streaks over a glossy road.
 * This gives massive visual impact without needing a 3D character asset.
 */

export default function LightTunnel() {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Cylindrical distribution for a tunnel feel
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 8; // Don't block the center completely
      temp.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius + 2, // Shift up slightly
        z: (Math.random() - 0.5) * 200, // Very long distribution
        speed: Math.random() * 5 + 2,
        scale: Math.random() * 2 + 1,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Make some lines red, some white/blue
  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color("#ff2a00"); // Aggressive Red
    const c2 = new THREE.Color("#ffffff"); // Pure White
    for (let i = 0; i < count; i++) {
      const col = Math.random() > 0.8 ? c1 : c2;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return colors;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Read velocity from Lenis scroll (set in page.tsx)
    const baseSpeed = 1.0;
    const scrollVelocity = (window as any).__lenisVelocity || 0;
    // Map scroll velocity (which can be from -100 to 100) to a positive speed multiplier
    const speedMultiplier = baseSpeed + Math.abs(scrollVelocity) * 0.5;

    lines.forEach((line, i) => {
      // Fly towards camera
      const direction = scrollVelocity >= 0 ? 1 : -1; 
      line.z += line.speed * 40 * delta * (baseSpeed + (scrollVelocity * 0.2));
      
      if (line.z > 20) {
        line.z = -150; // Reset far back
      } else if (line.z < -150) {
        line.z = 20;
      }

      dummy.position.set(line.x, line.y, line.z);
      // Stretch them massively based on speed to look like light trails
      dummy.scale.set(0.02, 0.02, line.scale * speedMultiplier * 5);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
        </boxGeometry>
        <meshBasicMaterial vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}
