"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

/**
 * StylizedHuman — The Cinematic Silhouette
 * 
 * "The human is NOT the hero. The human is only emotional context."
 * Geometry is hidden in pure darkness. Material only catches extreme rim lights.
 */

export default function StylizedHuman() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Body parts
  const torsoRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  
  // The shoes
  const leftShoeRef = useRef<THREE.Mesh>(null);
  const rightShoeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    (window as any).__humanRig = {
      dissolve: (duration: number) => {
        if (!groupRef.current) return;
        const tl = gsap.timeline();
        
        // Dissolve into darkness by shrinking and moving backward
        const parts = [groupRef.current];
        parts.forEach(part => {
          if (part) {
            tl.to(part.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease: "power2.in" }, 0);
            tl.to(part.position, { z: -10, duration, ease: "power2.in" }, 0);
          }
        });

        // Nullify the running animation weight
        tl.to(window, { __runCycleWeight: 0, duration, ease: "power2.inOut" }, 0);

        return tl;
      }
    };
    
    (window as any).__runCycleWeight = 1.0;

    return () => {
      delete (window as any).__humanRig;
      delete (window as any).__runCycleWeight;
    };
  }, []);

  // Material designed to be invisible in darkness, only catching rim lights
  const silhouetteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#222222",
    roughness: 0.4, // Less glossy so it catches more diffuse light
    metalness: 0.5, 
  }), []);

  // Dark charcoal/leather proxy shoes so they don't look like bright cartoon boxes
  const shoeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a1f", 
    roughness: 0.5,
    metalness: 0.4,
    emissive: "#000000",
  }), []);

  // Procedural Run Cycle
  useFrame((state) => {
    const weight = (window as any).__runCycleWeight !== undefined ? (window as any).__runCycleWeight : 1.0;
    if (weight <= 0) return;

    // Time scale from FilmController
    const timeScale = (window as any).__envSpeed !== undefined ? (window as any).__envSpeed : 1.0;
    
    if (!(window as any).__internalRunTime) (window as any).__internalRunTime = 0;
    (window as any).__internalRunTime += state.clock.getDelta() * timeScale * 10.0; // Sprint speed
    
    const t = (window as any).__internalRunTime;

    if (groupRef.current) {
      groupRef.current.position.y = Math.abs(Math.sin(t)) * 0.15 * weight;
    }

    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t) * 1.5 * weight;
      rightArmRef.current.rotation.x = Math.sin(t + Math.PI) * 1.5 * weight;
    }

    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(t + Math.PI) * 1.2 * weight;
      rightLegRef.current.rotation.x = Math.sin(t) * 1.2 * weight;
      
      const leftKnee = leftLegRef.current.children[1];
      const rightKnee = rightLegRef.current.children[1];
      if (leftKnee) leftKnee.rotation.x = (Math.sin(t + Math.PI) > 0 ? -Math.sin(t + Math.PI) : 0) * 1.5 * weight;
      if (rightKnee) rightKnee.rotation.x = (Math.sin(t) > 0 ? -Math.sin(t) : 0) * 1.5 * weight;
    }
    
    if (torsoRef.current) {
      torsoRef.current.rotation.y = Math.sin(t) * 0.2 * weight;
      torsoRef.current.rotation.z = Math.sin(t) * 0.05 * weight;
      torsoRef.current.rotation.x = 0.4 * weight; // Aggressive forward lean
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Torso */}
      <mesh ref={torsoRef} position={[0, 1.3, 0]} material={silhouetteMaterial} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 0.6, 16, 16]} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 2.1, 0.2]} material={silhouetteMaterial} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[0.35, 1.7, 0]}>
        <mesh position={[0, -0.35, 0]} material={silhouetteMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.5, 16, 16]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[-0.35, 1.7, 0]}>
        <mesh position={[0, -0.35, 0]} material={silhouetteMaterial} castShadow>
          <capsuleGeometry args={[0.08, 0.5, 16, 16]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[0.15, 0.8, 0]}>
        <mesh position={[0, -0.25, 0]} material={silhouetteMaterial} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 16, 16]} />
        </mesh>
        <group position={[0, -0.6, 0]}>
          <mesh position={[0, -0.25, 0]} material={silhouetteMaterial} castShadow>
            <capsuleGeometry args={[0.08, 0.4, 16, 16]} />
          </mesh>
          <mesh ref={leftShoeRef} position={[0, -0.6, 0.1]} material={shoeMaterial} castShadow>
            <boxGeometry args={[0.15, 0.1, 0.3]} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[-0.15, 0.8, 0]}>
        <mesh position={[0, -0.25, 0]} material={silhouetteMaterial} castShadow>
          <capsuleGeometry args={[0.1, 0.4, 16, 16]} />
        </mesh>
        <group position={[0, -0.6, 0]}>
          <mesh position={[0, -0.25, 0]} material={silhouetteMaterial} castShadow>
            <capsuleGeometry args={[0.08, 0.4, 16, 16]} />
          </mesh>
          <mesh ref={rightShoeRef} position={[0, -0.6, 0.1]} material={shoeMaterial} castShadow>
            <boxGeometry args={[0.15, 0.1, 0.3]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
