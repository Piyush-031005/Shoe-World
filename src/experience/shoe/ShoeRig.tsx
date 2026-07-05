"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import PlaceholderShoe from "./PlaceholderShoe";

/**
 * ShoeRig — The Interactive, Separable Product Group
 * 
 * Controls the explode/assemble states for all shoe components.
 * Mouse position creates subtle parallax on floating pieces (Scene 02).
 * 
 * States:
 * - assembled: All parts at origin positions
 * - exploding: Parts drift apart magnetically  
 * - exploded: Parts floating, mouse-reactive
 * - assembling: Parts snapping back with overshoot
 */

// Define the exploded positions for each named component
// Each part moves in a unique direction (not uniform — magnetic feel)
const EXPLODE_MAP: Record<string, { x: number; y: number; z: number; rx: number; ry: number; rz: number }> = {
  outsole:  { x:  0,    y: -1.8, z:  0.3, rx: 0.05,  ry: 0,     rz: 0     },
  midsole:  { x:  0.3,  y: -0.9, z: -0.2, rx: -0.03, ry: 0.08,  rz: 0.02  },
  upper:    { x: -0.2,  y:  0.8, z:  0.4, rx: 0.04,  ry: -0.06, rz: -0.03 },
  heel:     { x: -1.2,  y:  0.5, z: -0.5, rx: 0,     ry: 0.15,  rz: 0.08  },
  toe:      { x:  1.5,  y:  0.3, z:  0.3, rx: 0.06,  ry: -0.1,  rz: 0     },
  tongue:   { x:  0.1,  y:  1.6, z:  0.2, rx: -0.1,  ry: 0,     rz: 0.12  },
  "lace-0": { x:  0.4,  y:  1.0, z:  0.5, rx: 0,     ry: 0.2,   rz: 0.05  },
  "lace-1": { x: -0.3,  y:  1.3, z: -0.3, rx: 0.1,   ry: -0.1,  rz: -0.08 },
  "lace-2": { x:  0.5,  y:  1.5, z:  0.1, rx: -0.05, ry: 0.15,  rz: 0.04  },
  logo:     { x:  0.6,  y:  0.4, z:  1.2, rx: 0,     ry: 0.3,   rz: 0     },
};

export default function ShoeRig() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef<"assembled" | "exploding" | "exploded" | "assembling">("assembled");
  const partsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const originPosRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const originRotRef = useRef<Map<string, THREE.Euler>>(new Map());

  // Track mouse for parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Index all named parts on mount
  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name) {
        partsRef.current.set(child.name, child);
        originPosRef.current.set(child.name, child.position.clone());
        originRotRef.current.set(child.name, child.rotation.clone());
      }
    });

    // Expose ShoeRig API to window for FilmController
    const rig = {
      group: groupRef.current,
      stateRef,

      // EXPLODE — magnetic zero-gravity separation
      explode: (duration: number = 3) => {
        stateRef.current = "exploding";
        const tl = gsap.timeline({
          onComplete: () => { stateRef.current = "exploded"; }
        });

        partsRef.current.forEach((obj, name) => {
          const target = EXPLODE_MAP[name];
          if (!target) return;

          const origin = originPosRef.current.get(name)!;

          // Heavier parts move slower (Motion Principle #2)
          const weight = name === "outsole" || name === "midsole" ? 1.4 : 
                         name === "upper" || name === "heel" ? 1.1 : 0.8;

          tl.to(obj.position, {
            x: origin.x + target.x,
            y: origin.y + target.y,
            z: origin.z + target.z,
            duration: duration * weight,
            ease: "power2.out",
          }, 0);

          tl.to(obj.rotation, {
            x: target.rx,
            y: target.ry,
            z: target.rz,
            duration: duration * weight,
            ease: "power2.out",
          }, 0);
        });

        return tl;
      },

      // ASSEMBLE — snap back with overshoot and settle
      assemble: (duration: number = 0.4) => {
        stateRef.current = "assembling";
        const tl = gsap.timeline({
          onComplete: () => { stateRef.current = "assembled"; }
        });

        partsRef.current.forEach((obj, name) => {
          const origin = originPosRef.current.get(name)!;
          const rot = originRotRef.current.get(name)!;

          // Snap with overshoot (Motion Principle #4)
          tl.to(obj.position, {
            x: origin.x,
            y: origin.y,
            z: origin.z,
            duration,
            ease: "elastic.out(1, 0.4)",
          }, 0);

          tl.to(obj.rotation, {
            x: rot.x,
            y: rot.y,
            z: rot.z,
            duration,
            ease: "elastic.out(1, 0.4)",
          }, 0);
        });

        return tl;
      },

      // Set visibility
      setVisible: (visible: boolean) => {
        if (groupRef.current) groupRef.current.visible = visible;
      },
    };

    (window as any).__shoeRig = rig;

    return () => {
      delete (window as any).__shoeRig;
    };
  }, []);

  // Per-frame: mouse parallax when exploded
  useFrame(() => {
    if (stateRef.current !== "exploded" || !partsRef.current.size) return;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    partsRef.current.forEach((obj, name) => {
      // Subtle parallax — each part reacts differently
      const sensitivity = name === "lace-0" || name === "lace-1" || name === "lace-2" 
        ? 0.08 : 0.03;
      
      obj.position.x += (mx * sensitivity - (obj.position.x - (originPosRef.current.get(name)!.x + (EXPLODE_MAP[name]?.x || 0)))) * 0.05;
      obj.position.y += (-my * sensitivity - (obj.position.y - (originPosRef.current.get(name)!.y + (EXPLODE_MAP[name]?.y || 0)))) * 0.05;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.3, 0]}>
      <PlaceholderShoe />
    </group>
  );
}
