"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";

/**
 * PlaceholderShoe — Premium Abstract Sculpture
 * 
 * NOT a blocky primitive anymore.
 * This is an elegant, smooth, shoe-shaped sculpture using
 * rounded geometry + high-end PBR materials so the lighting
 * has something beautiful to reveal.
 * 
 * When the production GLB arrives, swap this entire component out.
 * Everything else (camera, lights, timeline) stays unchanged.
 */

export default function PlaceholderShoe() {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.008;
  });

  return (
    <group ref={groupRef}>
      {/* ═══ OUTSOLE — Dark rubber tread ═══ */}
      <mesh
        name="outsole"
        position={[0, -0.62, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.8, 0.12, 1.05]} />
        <meshPhysicalMaterial
          color="#0A0A0A"
          roughness={0.95}
          metalness={0.0}
          clearcoat={0.1}
          clearcoatRoughness={0.8}
        />
      </mesh>

      {/* ═══ MIDSOLE — Premium white cushion with subtle sheen ═══ */}
      <mesh
        name="midsole"
        position={[0, -0.44, 0]}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[2.65, 0.22, 1.0]} radius={0.08} smoothness={6}>
          <meshPhysicalMaterial
            color="#F5F2ED"
            roughness={0.25}
            metalness={0.02}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
          />
        </RoundedBox>
      </mesh>

      {/* ═══ UPPER — Main body, dark leather with subtle reflections ═══ */}
      <mesh
        name="upper"
        position={[0, 0.08, 0]}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[2.2, 0.78, 0.88]} radius={0.15} smoothness={8}>
          <meshPhysicalMaterial
            color="#1A1A1C"
            roughness={0.4}
            metalness={0.12}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
            sheen={0.5}
            sheenRoughness={0.6}
            sheenColor={new THREE.Color("#2A2A32")}
          />
        </RoundedBox>
      </mesh>

      {/* ═══ HEEL — Back counter with aggressive stance ═══ */}
      <mesh
        name="heel"
        position={[-0.98, 0.14, 0]}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[0.55, 0.92, 0.82]} radius={0.12} smoothness={6}>
          <meshPhysicalMaterial
            color="#121215"
            roughness={0.35}
            metalness={0.2}
            clearcoat={0.4}
            clearcoatRoughness={0.3}
          />
        </RoundedBox>
      </mesh>

      {/* ═══ TOE — Smooth rounded toe cap ═══ */}
      <mesh
        name="toe"
        position={[1.18, -0.06, 0]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.48, 32, 24]} />
        <meshPhysicalMaterial
          color="#1E1E22"
          roughness={0.3}
          metalness={0.15}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* ═══ TONGUE — Thin elegant flap ═══ */}
      <mesh
        name="tongue"
        position={[0.12, 0.62, 0]}
        rotation={[0, 0, 0.12]}
        castShadow
      >
        <RoundedBox args={[0.75, 0.48, 0.06]} radius={0.03} smoothness={4}>
          <meshPhysicalMaterial
            color="#252528"
            roughness={0.55}
            metalness={0.05}
            clearcoat={0.2}
            clearcoatRoughness={0.5}
          />
        </RoundedBox>
      </mesh>

      {/* ═══ LACES — Three sleek horizontal strands ═══ */}
      {[0.28, 0.42, 0.56].map((y, i) => (
        <mesh
          key={i}
          name={`lace-${i}`}
          position={[0.2, y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.018, 0.65, 12]} />
          <meshPhysicalMaterial
            color="#F0EDE8"
            roughness={0.6}
            metalness={0.0}
            clearcoat={0.3}
            clearcoatRoughness={0.4}
          />
        </mesh>
      ))}

      {/* ═══ LOGO — Premium copper disc with glow ═══ */}
      <mesh
        name="logo"
        position={[0, 0.12, 0.46]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.14, 0.14, 0.015, 32]} />
        <meshPhysicalMaterial
          color="#B87333"
          roughness={0.15}
          metalness={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          emissive="#B87333"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* ═══ ACCENT STRIPE — Side detail for visual interest ═══ */}
      <mesh
        position={[0.3, 0.05, 0.445]}
        rotation={[0, 0, 0.05]}
      >
        <boxGeometry args={[1.2, 0.04, 0.01]} />
        <meshPhysicalMaterial
          color="#B87333"
          roughness={0.2}
          metalness={0.8}
          emissive="#B87333"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh
        position={[0.3, 0.05, -0.445]}
        rotation={[0, 0, -0.05]}
      >
        <boxGeometry args={[1.2, 0.04, 0.01]} />
        <meshPhysicalMaterial
          color="#B87333"
          roughness={0.2}
          metalness={0.8}
          emissive="#B87333"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
