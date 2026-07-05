"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

/**
 * StoryEngine — The Scroll Choreographer
 * 
 * Takes over after FilmController finishes (Scene 03).
 * Uses GSAP ScrollTrigger to scrub a master timeline that dictates 
 * Scenes 04 (Paths), 05 (Constellation), and beyond.
 * 
 * Scroll advances scenes. Camera tells the story.
 */

interface StoryEngineProps {
  isReady: boolean; // True when FilmController finishes Scene 03
}

export default function StoryEngine({ isReady }: StoryEngineProps) {
  
  useEffect(() => {
    if (!isReady) return;

    // Grab all rigged components exposed on window
    const camera = (window as any).__cameraRig;
    const world = (window as any).__worldEngine;
    const transition = (window as any).__transitionEngine;
    const constellation = (window as any).__constellationRig;
    const shoe = (window as any).__shoeRig;

    if (!camera || !world || !transition) return;

    // The ConstellationRig starts hidden, let's make it visible now since we can scroll to it
    if (constellation) constellation.visible = true;

    // Create the master scroll timeline
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // 1 second smoothing
      }
    });

    // ── SCENE 04: PATHS (Progress 0.0 -> 0.3) ────────────────────────
    // The shoe stays elegant. The world moves beneath it.
    // Transition Engine morphs: Studio -> Stone -> Snow -> Forest -> Road

    // To simulate the world moving beneath the shoe, we can dolly the camera 
    // AND the shoe forward together across the world, OR we move the world itself.
    // Easiest is translating the ground texture, but for now we just morph the environments.

    scrollTl.add(() => {
      transition.morphToEnvironment(PRODUCTS[2], 1); // Boot (Rock/Wind)
    }, 0.1);

    scrollTl.add(() => {
      transition.morphToEnvironment(PRODUCTS[4], 1); // Crocs (Grass/Sun)
    }, 0.2);


    // ── SCENE 05: THE CONSTELLATION (Progress 0.3 -> 0.6) ────────────
    // Dive down into the museum space.
    
    // Camera pushes down significantly on the Y axis
    scrollTl.to(camera.targetRef.current, { y: -20, ease: "power2.inOut" }, 0.3);
    
    // Dolly the camera down to look at the constellation
    // (In CameraRig, when state is "idle", it looks at target and adds its position.
    // We need to move the camera's base Y position down too).
    scrollTl.to(camera.camera.position, { y: -18, z: 15, ease: "power2.inOut" }, 0.3);

    // Hide the hero shoe as we dive down
    scrollTl.to(shoe.group.position, { y: 10, ease: "power2.in" }, 0.3);

    // Fade the world to absolute void (Museum state)
    scrollTl.add(() => {
      transition.morphToEnvironment(PRODUCTS[0], 1); // Hero (Studio/Clear/Dark)
    }, 0.3);

    // ── SCENE 06: CATEGORY WORLDS (Progress 0.6 -> 1.0) ──────────────
    // The user interacts with the constellation via mouse hover (handled in ConstellationRig).
    // The scroll timeline can slowly push the camera through the constellation.

    scrollTl.to(camera.camera.position, { z: 5, ease: "none" }, 0.6);

    return () => {
      scrollTl.kill();
    };
  }, [isReady]);

  return null;
}
