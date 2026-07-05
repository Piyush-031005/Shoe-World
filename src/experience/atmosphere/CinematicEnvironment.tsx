"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * CinematicEnvironment — The Premium Uttarakhand Abstraction
 * 
 * Minimal, elegant, premium. 
 * A glossy dark road reflecting rim lights, cold fog, and abstract silhouettes.
 * Speed comes from the environment moving past the camera.
 */
export default function CinematicEnvironment() {
  const roadRef = useRef<THREE.Mesh>(null);
  
  // High-speed texture offset for the road to create momentum
  const roadMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#020202",
    roughness: 0.1, // Highly reflective (wet/glossy road)
    metalness: 0.5,
  }), []);

  useFrame((state, delta) => {
    // Environmental speed driven by FilmController
    const speed = (window as any).__envSpeed !== undefined ? (window as any).__envSpeed : 0;
    
    // We can't easily scroll a solid color, but we can move abstract lines or 
    // just rely on particles rushing past. For the road, we'll keep it static 
    // and let the particles and camera provide the speed.
  });

  return (
    <group>
      {/* Subtle ambient for the environment so it's not pure black */}
      <ambientLight intensity={0.2} color="#4a5568" />
      
      {/* Glossy Road */}
      <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 200]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>

      {/* Abstract Pine Silhouettes (Very far back, deep in fog) */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() > 0.5 ? 1 : -1) * (4 + Math.random() * 6), // Sides of the road
            2, 
            -10 - Math.random() * 40
          ]}
        >
          <coneGeometry args={[1.5, 6, 8]} />
          <meshBasicMaterial color="#111115" fog={true} />
        </mesh>
      ))}
    </group>
  );
}
