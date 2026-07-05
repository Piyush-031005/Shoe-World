"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import FluidShaderBackground from "./atmosphere/FluidShaderBackground";

/**
 * Global Scene Registrar
 * Captures the R3F scene so the TransitionEngine can animate global properties like Fog.
 */
function SceneRegistrar() {
  const { scene } = useThree();
  useEffect(() => {
    (window as any).__globalScene = scene;
    return () => { delete (window as any).__globalScene; };
  }, [scene]);
  return null;
}

/**
 * ExperienceEngine — The Canvas Container
 * 
 * UPDATED for WebGL Interactive Scroll Pivot:
 * - Removed heavy 3D cinematic actors
 * - Now serves as a highly performant, scroll-reactive shader background
 */
export default function ExperienceEngine() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1, // Sits behind the DOM
        background: "#050508",
      }}
    >
      <SceneRegistrar />
      
      <Suspense fallback={null}>
        {/* Abstract Fluid Shader */}
        <FluidShaderBackground />
        
        <EffectComposer disableNormalPass>
          <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
