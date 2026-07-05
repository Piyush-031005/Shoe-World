"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ShoePlaceholder(props: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Main Body (Cherry Red Glass) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#d90429"
          transmission={0.8}
          opacity={1}
          metalness={0.2}
          roughness={0.1}
          ior={1.5}
          thickness={0.5}
          attenuationColor="#ff4d4d"
          attenuationDistance={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Accents (Dark red / metallic) */}
      <mesh position={[0, 0.4, 0.5]} castShadow>
        <boxGeometry args={[0.8, 0.1, 1.5]} />
        <meshPhysicalMaterial
          color="#8a0319"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glow highlight */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
        <meshStandardMaterial color="#ff2a4b" emissive="#ff2a4b" emissiveIntensity={2} />
      </mesh>
      
      {/* Sole */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.52, 1.2, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
    </group>
  );
}
