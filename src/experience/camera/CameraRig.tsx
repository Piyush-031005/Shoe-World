"use client";

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

/**
 * CameraRig — The Narrator
 * 
 * 7 emotional camera states driven by GSAP:
 * Idle Drift → Slow Orbit → Push In → Rack Focus → Freeze → Impact Snap → Reveal
 * 
 * Exposes a ref via window for the FilmController to orchestrate.
 */

interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export default function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const driftRef = useRef({ x: 0, y: 0 });
  const orbitRef = useRef({ angle: 0, radius: 12, y: 1.5 });
  const stateRef = useRef<"idle" | "orbit" | "freeze" | "reveal">("idle");

  // Initial camera setup
  useEffect(() => {
    camera.position.set(0, 1.5, 12);
    (camera as THREE.PerspectiveCamera).fov = 35;
    (camera as THREE.PerspectiveCamera).near = 0.1;
    (camera as THREE.PerspectiveCamera).far = 100;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    // Expose controls to window for FilmController access
    const rig = {
      camera,
      targetRef,
      orbitRef,
      stateRef,
      
      // Camera state setters
      setOrbit: (angle: number, radius: number, y: number, duration: number) => {
        return gsap.to(orbitRef.current, {
          angle, radius, y,
          duration,
          ease: "power2.inOut",
        });
      },
      
      setPosition: (x: number, y: number, z: number, duration: number) => {
        return gsap.to(camera.position, {
          x, y, z,
          duration,
          ease: "power3.inOut",
        });
      },

      setTarget: (x: number, y: number, z: number, duration: number) => {
        return gsap.to(targetRef.current, {
          x, y, z,
          duration,
          ease: "power3.inOut",
        });
      },

      setFov: (fov: number, duration: number) => {
        return gsap.to(camera as THREE.PerspectiveCamera, {
          fov,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
          },
        });
      },

      freeze: () => {
        stateRef.current = "freeze";
      },

      unfreeze: (state: "idle" | "orbit" | "reveal") => {
        stateRef.current = state;
      },

      // Impact snap — micro-shake then settle
      impactSnap: () => {
        const tl = gsap.timeline();
        tl.to(camera.position, { x: "+=0.06", y: "+=0.03", duration: 0.04 })
          .to(camera.position, { x: "-=0.12", y: "-=0.06", duration: 0.04 })
          .to(camera.position, { x: "+=0.08", y: "+=0.04", duration: 0.06, ease: "power2.out" })
          .to(camera.position, { x: "-=0.02", y: "-=0.01", duration: 0.1, ease: "power3.out" });
        return tl;
      },
    };

    (window as any).__cameraRig = rig;

    return () => {
      delete (window as any).__cameraRig;
    };
  }, [camera]);

  // Per-frame updates
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const currentState = stateRef.current;

    if (currentState === "freeze") {
      // Camera frozen conceptually, but we STILL apply breathing so it doesn't look dead.
      // We skip the orbit calculation below.
    } else if (currentState === "orbit") {
      // Orbit around target
      const { angle, radius, y } = orbitRef.current;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = y;
    }

    // Always apply idle drift (breathing) unless frozen
    if (currentState !== "freeze") {
      driftRef.current.x = Math.sin(t * 0.4) * 0.015;
      driftRef.current.y = Math.cos(t * 0.3) * 0.01;
      camera.position.x += driftRef.current.x;
      camera.position.y += driftRef.current.y;
    }

    camera.lookAt(targetRef.current);
  });

  return null;
}
