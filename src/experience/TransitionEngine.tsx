"use client";

import { useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ProductDefinition } from "@/data/products";

/**
 * TransitionEngine — The Blending Layer
 * 
 * Controls dissolves, morphs, crossfades, environment blending, 
 * and lighting interpolation.
 * 
 * Takes the load off WorldEngine by orchestrating the smooth GSAP tweens 
 * between states whenever a new product environment is requested.
 */

export default function TransitionEngine() {
  
  useEffect(() => {
    const engine = {
      // Morph the world to match a specific product's definition
      morphToEnvironment: (product: ProductDefinition, duration: number = 2) => {
        const world = (window as any).__worldEngine;
        const lights = (window as any).__lightingRig;
        const scene = (window as any).__globalScene; // Grabbed from ExperienceEngine if needed for fog

        if (!world || !lights) return;

        const tl = gsap.timeline();

        // 1. Morph the ground color/roughness
        // To do this smoothly, we grab the material from WorldEngine and tween it
        if (world.ground && world.ground.material) {
          // Temporary mapping to colors for standard material tweening
          const colors: any = {
            studio: "#0A0A0F", stone: "#3A3A42", snow: "#DCE5EB",
            track: "#8B3A3A", marble: "#111111", grass: "#1B3A2A", rock: "#2A2A2A"
          };
          
          tl.to(world.ground.material.color, {
            r: new THREE.Color(colors[product.environment.ground]).r,
            g: new THREE.Color(colors[product.environment.ground]).g,
            b: new THREE.Color(colors[product.environment.ground]).b,
            duration: duration,
            ease: "power2.inOut"
          }, 0);
          
          // Roughness changes the specularity completely
          const roughnessMap: any = {
            studio: 0.8, stone: 0.9, snow: 0.6, track: 0.75, marble: 0.1, grass: 0.9, rock: 1.0
          };
          tl.to(world.ground.material, {
            roughness: roughnessMap[product.environment.ground],
            duration: duration,
            ease: "power2.inOut"
          }, 0);
        }

        // 2. Crossfade weather states
        // In a full production engine, we would fade opacity of old weather down, and new weather up.
        // For now, we trigger the swap at the mid-point of the transition.
        tl.call(() => {
          world.setWeatherState(product.environment.weather);
        }, [], duration * 0.5);

        // 3. Lighting Interpolation (Atmosphere matching)
        // Transition fog density and color if we registered the scene
        if (scene && scene.fog) {
          tl.to(scene.fog.color, {
            r: new THREE.Color(product.environment.fogColor).r,
            g: new THREE.Color(product.environment.fogColor).g,
            b: new THREE.Color(product.environment.fogColor).b,
            duration: duration,
            ease: "power2.inOut"
          }, 0);
          
          tl.to(scene.fog, {
            density: product.environment.fogDensity,
            duration: duration,
            ease: "power2.inOut"
          }, 0);
        }

        return tl;
      }
    };

    (window as any).__transitionEngine = engine;
    return () => { delete (window as any).__transitionEngine; };
  }, []);

  return null; // Non-rendering controller
}
