"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShoeModel(props: any) {
  const group = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // We are creating a futuristic, segmented 3D shoe model using primitives
  // This guarantees it loads instantly and perfectly supports the dismantling animation.

  useEffect(() => {
    if (!group.current) return;

    // Create a GSAP timeline tied to scroll for dismantling
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#main-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Make the whole group rotate
    tl.to(group.current.rotation, {
      y: Math.PI * 4,
      duration: 1
    }, 0);

    // Explode parts outwards for the dismantling effect
    meshesRef.current.forEach((mesh, i) => {
      if (!mesh) return;

      const dir = mesh.position.clone().normalize();
      if (dir.lengthSq() === 0) {
        dir.set(0, 1, 0); // Default up if at origin
      }

      const distance = 1.2 + (Math.random() * 0.8);

      tl.to(mesh.position, {
        x: mesh.position.x + dir.x * distance,
        y: mesh.position.y + dir.y * distance,
        z: mesh.position.z + dir.z * distance,
        duration: 1,
        ease: "power2.inOut"
      }, 0);

      tl.to(mesh.rotation, {
        x: mesh.rotation.x + Math.random() * Math.PI,
        y: mesh.rotation.y + Math.random() * Math.PI,
        z: mesh.rotation.z + Math.random() * Math.PI,
        duration: 1,
        ease: "power2.inOut"
      }, 0);
    });

  }, []);

  // Gentle float independent of scroll
  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 0.2;
    }
  });

  const redGlassMaterial = <meshPhysicalMaterial
    color="#d90429"
    transmission={0.9}
    opacity={1}
    metalness={0.1}
    roughness={0.05}
    ior={1.5}
    thickness={0.5}
    attenuationColor="#ff4d4d"
    attenuationDistance={2}
    clearcoat={1}
  />;

  const darkMaterial = <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.2} />;
  const glowMaterial = <meshStandardMaterial color="#ff2a4b" emissive="#ff2a4b" emissiveIntensity={2} />;

  return (
    <group ref={group} {...props} dispose={null}>

      {/* 1. The Sole */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[0] = el; }}
        position={[0, -0.4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.2, 32, 32]} />
        {darkMaterial}
      </mesh>

      {/* 2. The Upper Body (Red Glass) */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[1] = el; }}
        position={[0, 0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow receiveShadow>
        <capsuleGeometry args={[0.48, 1.1, 32, 32]} />
        {redGlassMaterial}
      </mesh>

      {/* 3. The Heel Guard */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[2] = el; }}
        position={[0, 0.3, -0.6]}
        rotation={[0.2, 0, 0]}
        castShadow>
        <boxGeometry args={[0.9, 0.5, 0.2]} />
        {darkMaterial}
      </mesh>

      {/* 4. The Laces / Strap (Glowing) */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[3] = el; }}
        position={[0, 0.5, 0.3]}
        rotation={[-0.2, 0, 0]}
        castShadow>
        <boxGeometry args={[0.7, 0.1, 0.8]} />
        {glowMaterial}
      </mesh>

      {/* 5. Tongue */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[4] = el; }}
        position={[0, 0.6, 0.1]}
        rotation={[-0.4, 0, 0]}
        castShadow>
        <boxGeometry args={[0.4, 0.6, 0.1]} />
        {redGlassMaterial}
      </mesh>

      {/* 6. Side Swoosh/Logo piece */}
      <mesh
        ref={(el) => { if (el) meshesRef.current[5] = el; }}
        position={[0.5, 0.2, 0]}
        rotation={[0, 0, -0.2]}
        castShadow>
        <capsuleGeometry args={[0.05, 0.8, 16, 16]} />
        {glowMaterial}
      </mesh>

    </group>
  );
}
