"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * SpeedFlow (Atmospheric Dust)
 * 
 * Re-designed per user request:
 * "Speed must come from: camera velocity, environment movement, perspective, motion blur, atmosphere. NOT from decorative glowing lines."
 * 
 * This is now subtle environmental dust rushing past the camera to create momentum,
 * not decorative laser beams.
 */

export default function SpeedFlow() {
  const count = 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.2) * 20,
        z: (Math.random() - 0.5) * 80,
        speed: Math.random() * 2 + 0.5,
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const timeScale = (window as any).__envSpeed !== undefined ? (window as any).__envSpeed : 1.0;

    particles.forEach((particle, i) => {
      // Move dust towards camera based on environmental speed
      particle.z += particle.speed * 20 * delta * timeScale;
      
      // Simulate curl noise wind drift using sine waves
      const t = state.clock.elapsedTime;
      const driftX = Math.sin(particle.z * 0.1 + t) * 0.05 * timeScale;
      const driftY = Math.cos(particle.z * 0.15 + t) * 0.05 * timeScale;
      
      particle.x += driftX;
      particle.y += driftY;
      
      if (particle.z > 10) {
        particle.z = -70;
        particle.x = (Math.random() - 0.5) * 40;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      // Small dust particles, stretching slightly if moving fast
      dummy.scale.set(0.04, 0.04, 0.04 + (timeScale * 0.1));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial 
        color="#ffffff"
        transparent 
        opacity={0.15} // Very subtle
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </instancedMesh>
  );
}
