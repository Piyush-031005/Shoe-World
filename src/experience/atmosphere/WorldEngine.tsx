"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

/**
 * WorldEngine — The Environmental State Machine
 * 
 * Controls the ground plane, fog, and weather particles.
 * Reacts to state changes initiated by the TransitionEngine.
 * 
 * Ground states: studio, stone, snow, track, rock, marble, grass
 * Weather states: clear, mist, wind, warm, sunlight
 */

export default function WorldEngine() {
  const groundRef = useRef<THREE.Mesh>(null);
  const weatherPointsRef = useRef<THREE.Points>(null);
  const fogRef = useRef<THREE.FogExp2>(null);

  // Expose API to window for TransitionEngine / StoryEngine
  useEffect(() => {
    // Generate initial weather particles
    if (weatherPointsRef.current) {
      const count = 1000;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 40;
        pos[i * 3 + 1] = Math.random() * 20;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
      weatherPointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    }

    const engine = {
      ground: groundRef.current,
      weather: weatherPointsRef.current,
      
      // Called by TransitionEngine to swap the ground visually
      setGroundState: (type: string) => {
        if (!groundRef.current) return;
        const mat = groundRef.current.material as THREE.MeshStandardMaterial;
        
        switch(type) {
          case "studio": mat.color.set("#0A0A0F"); mat.roughness = 0.8; break;
          case "stone":  mat.color.set("#3A3A42"); mat.roughness = 0.9; break;
          case "snow":   mat.color.set("#DCE5EB"); mat.roughness = 0.6; break;
          case "track":  mat.color.set("#8B3A3A"); mat.roughness = 0.75; break;
          case "marble": mat.color.set("#111111"); mat.roughness = 0.1; break;
          case "grass":  mat.color.set("#1B3A2A"); mat.roughness = 0.9; break;
          case "rock":   mat.color.set("#2A2A2A"); mat.roughness = 1.0; break;
        }
      },

      // Called by TransitionEngine to change weather behavior
      setWeatherState: (type: string) => {
        // Will be picked up by useFrame
        (window as any).__currentWeather = type;
      }
    };

    (window as any).__worldEngine = engine;
    return () => { delete (window as any).__worldEngine; };
  }, []);

  // Weather animation loop
  useFrame((state) => {
    const weatherType = (window as any).__currentWeather || "clear";
    if (!weatherPointsRef.current || weatherType === "clear") {
      if (weatherPointsRef.current) weatherPointsRef.current.visible = false;
      return;
    }
    
    weatherPointsRef.current.visible = true;
    const posAttr = weatherPointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    // Simple state-based particle physics
    for (let i = 0; i < posAttr.count; i++) {
      let y = posAttr.array[i * 3 + 1] as number;
      
      if (weatherType === "wind" || weatherType === "mist") {
        posAttr.array[i * 3]     = (posAttr.array[i * 3] as number) + 0.05; // Wind blows right
        posAttr.array[i * 3 + 1] = y - 0.01; // Slow fall
      } else if (weatherType === "sunlight") {
        // Dust motes drifting up
        posAttr.array[i * 3 + 1] = y + 0.01;
      }

      // Wrap around
      if (y < 0) posAttr.array[i * 3 + 1] = 20;
      if (y > 20) posAttr.array[i * 3 + 1] = 0;
      if ((posAttr.array[i * 3] as number) > 20) posAttr.array[i * 3] = -20;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Dynamic Ground Plane */}
      <mesh 
        ref={groundRef} 
        position={[0, -0.7, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial 
          color="#0A0A0F" 
          roughness={0.8} 
          metalness={0.1}
          // In production, we would use a ShaderMaterial here to smoothly 
          // blend between textures (diffuse, normal, displacement) during transitions.
        />
      </mesh>

      {/* Dynamic Weather Particles */}
      <points ref={weatherPointsRef} visible={false}>
        <bufferGeometry />
        <pointsMaterial 
          size={0.05} 
          color="#FFFFFF" 
          transparent 
          opacity={0.3} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Global Fog is controlled at Canvas level, but we attach a ref to it if needed */}
    </group>
  );
}
