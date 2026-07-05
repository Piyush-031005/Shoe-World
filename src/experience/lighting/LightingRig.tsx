"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

/**
 * LightingRig — Darkness reveals form.
 * 
 * UPDATED for Milestone 1.5: Visual Fidelity Pass
 * 
 * Key changes:
 * - Stronger ambient fill to prevent "confusion darkness"
 * - Rim lights create silhouette BEFORE key reveals detail
 * - Environment reflections via hemisphere light
 * - Better shadow quality
 * 
 * Lights:
 * - Key Spotlight (#FFF5E6) — sunrise sweep, primary
 * - Cold Rim (#A8C8E8) — edge separation (left/back)
 * - Warm Rim (#E8A060) — Uttarakhand sunrise edge (right/front)
 * - Hemisphere (#1a1a2e / #0a0a0a) — subtle environment fill
 * - Material Beam (#FFFFFF) — narrow texture reveal (Scene 02.5)
 * - Under Glow (#B87333) — copper brand accent from below
 */

export default function LightingRig() {
  const keyRef = useRef<THREE.SpotLight>(null);
  const coldRimRef = useRef<THREE.PointLight>(null);
  const warmRimRef = useRef<THREE.PointLight>(null);
  const materialBeamRef = useRef<THREE.SpotLight>(null);
  const underGlowRef = useRef<THREE.PointLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);

  // Expose to FilmController
  useEffect(() => {
    const rig = {
      key: keyRef.current,
      coldRim: coldRimRef.current,
      warmRim: warmRimRef.current,
      materialBeam: materialBeamRef.current,
      underGlow: underGlowRef.current,
      hemi: hemiRef.current,

      // Activate key spotlight with sweep animation
      activateKey: (duration: number) => {
        if (!keyRef.current) return;
        return gsap.fromTo(keyRef.current, 
          { intensity: 0 },
          { intensity: 18, duration, ease: "power2.inOut" }
        );
      },

      // Activate rim lights — silhouette creation
      activateRims: (duration: number) => {
        const tl = gsap.timeline();
        if (coldRimRef.current) {
          tl.fromTo(coldRimRef.current, 
            { intensity: 0 },
            { intensity: 6, duration, ease: "power2.out" }, 0
          );
        }
        if (warmRimRef.current) {
          tl.fromTo(warmRimRef.current,
            { intensity: 0 },
            { intensity: 5, duration: duration * 1.2, ease: "power2.out" }, 0.3
          );
        }
        // Under glow fades in with rims
        if (underGlowRef.current) {
          tl.fromTo(underGlowRef.current,
            { intensity: 0 },
            { intensity: 2, duration: duration * 1.5, ease: "power2.out" }, 0.5
          );
        }
        return tl;
      },

      // Activate ambient hemisphere
      activateHemi: (duration: number) => {
        if (!hemiRef.current) return;
        return gsap.fromTo(hemiRef.current,
          { intensity: 0 },
          { intensity: 0.4, duration, ease: "power2.out" }
        );
      },

      // Material beam sweep for Scene 02.5
      sweepBeam: (targets: { x: number; y: number; z: number }[], duration: number) => {
        if (!materialBeamRef.current) return;
        const tl = gsap.timeline();
        
        tl.set(materialBeamRef.current, { intensity: 0 });
        
        targets.forEach((pos, i) => {
          tl.to(materialBeamRef.current!.target.position, {
            x: pos.x, y: pos.y, z: pos.z,
            duration: duration / targets.length,
            ease: "power2.inOut",
          }, i * (duration / targets.length));
          
          if (i === 0) {
            tl.to(materialBeamRef.current!, {
              intensity: 30,
              duration: 0.5,
              ease: "power2.in"
            }, 0);
          }
        });
        
        tl.to(materialBeamRef.current, {
          intensity: 0, duration: 0.4, ease: "power2.out"
        });
        
        return tl;
      },

      // Full reveal on assembly — all lights bloom
      fullReveal: (duration: number) => {
        const tl = gsap.timeline();
        if (keyRef.current) tl.to(keyRef.current, { intensity: 30, duration, ease: "power2.out" }, 0);
        if (coldRimRef.current) tl.to(coldRimRef.current, { intensity: 8, duration, ease: "power2.out" }, 0);
        if (warmRimRef.current) tl.to(warmRimRef.current, { intensity: 7, duration, ease: "power2.out" }, 0);
        if (underGlowRef.current) tl.to(underGlowRef.current, { intensity: 4, duration, ease: "power2.out" }, 0);
        if (hemiRef.current) tl.to(hemiRef.current, { intensity: 0.6, duration, ease: "power2.out" }, 0);
        return tl;
      },

      // Kill all lights (for preloader)
      blackout: () => {
        if (keyRef.current) keyRef.current.intensity = 0;
        if (coldRimRef.current) coldRimRef.current.intensity = 0;
        if (warmRimRef.current) warmRimRef.current.intensity = 0;
        if (materialBeamRef.current) materialBeamRef.current.intensity = 0;
        if (underGlowRef.current) underGlowRef.current.intensity = 0;
        if (hemiRef.current) hemiRef.current.intensity = 0;
      },
    };

    (window as any).__lightingRig = rig;
    
    // Start in blackout
    rig.blackout();

    return () => {
      delete (window as any).__lightingRig;
    };
  }, []);

  // Subtle key light breathing when active
  useFrame((state) => {
    if (keyRef.current && keyRef.current.intensity > 0) {
      const t = state.clock.elapsedTime;
      // Very subtle pulse — like breathing (±1%)
      const base = keyRef.current.intensity;
      keyRef.current.intensity = base + Math.sin(t * 0.5) * (base * 0.005);
    }
    // Under glow subtle pulse
    if (underGlowRef.current && underGlowRef.current.intensity > 0) {
      const t = state.clock.elapsedTime;
      const base = underGlowRef.current.intensity;
      underGlowRef.current.intensity = base + Math.sin(t * 0.7 + 1) * (base * 0.01);
    }
  });

  return (
    <>
      {/* Ambient fill — prevent pure black crush, very subtle */}
      <ambientLight color="#0A0A14" intensity={0.15} />

      {/* Hemisphere light — sky/ground gradient for environment feel */}
      <hemisphereLight
        ref={hemiRef}
        color="#1a1a2e"
        groundColor="#0a0a0a"
        intensity={0}
        position={[0, 10, 0]}
      />

      {/* Key Spotlight — sunrise sweep, warm white */}
      <spotLight
        ref={keyRef}
        position={[5, 7, 5]}
        angle={0.4}
        penumbra={0.85}
        intensity={0}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Cold Rim — ice blue, edge separation (back-left) */}
      <pointLight
        ref={coldRimRef}
        position={[-6, 3, -4]}
        intensity={0}
        color="#A8C8E8"
        distance={25}
        decay={2}
      />

      {/* Warm Rim — amber Uttarakhand sunrise (front-right) */}
      <pointLight
        ref={warmRimRef}
        position={[5, -1, -5]}
        intensity={0}
        color="#E8A060"
        distance={25}
        decay={2}
      />

      {/* Under Glow — copper accent from below, brand identity */}
      <pointLight
        ref={underGlowRef}
        position={[0, -2, 1]}
        intensity={0}
        color="#B87333"
        distance={10}
        decay={2}
      />

      {/* Material Beam — narrow white spotlight for texture reveals */}
      <spotLight
        ref={materialBeamRef}
        position={[0, 6, 3]}
        angle={0.12}
        penumbra={0.3}
        intensity={0}
        color="#FFFFFF"
        distance={15}
        decay={2}
      >
        {/* Target object for beam aiming */}
        <object3D position={[0, 0, 0]} />
      </spotLight>
    </>
  );
}
