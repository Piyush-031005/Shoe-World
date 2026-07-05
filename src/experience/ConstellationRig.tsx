"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { PRODUCTS, ProductDefinition } from "@/data/products";
import PlaceholderShoe from "./shoe/PlaceholderShoe";

/**
 * ConstellationRig — Physics-Based Orbital Array
 * 
 * Renders the products as floating objects in a museum-like dark space.
 * 
 * Constellation Physics:
 * - Orbit speed (unique to each shoe's weight)
 * - Attraction / Hover force (pulls toward camera when hovered)
 * - Focus weight (pushes other shoes away when one is focused)
 */

const ConstellationNode = ({ 
  product, 
  index,
  total,
  onHover 
}: { 
  product: ProductDefinition, 
  index: number,
  total: number,
  onHover: (id: string | null) => void 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shoeWrapperRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  // Initial orbital angles spaced evenly
  const initialAngle = (index / total) * Math.PI * 2;
  const currentAngle = useRef(initialAngle);

  useFrame((state, delta) => {
    if (!groupRef.current || !shoeWrapperRef.current) return;

    // 1. Orbital Motion
    // Orbit speed is affected by the product's defined physics weight
    const speed = product.physics.orbitSpeed * (1 / product.physics.weight);
    
    // Slow down orbit when hovered
    const targetSpeed = hovered ? speed * 0.1 : speed;
    currentAngle.current += targetSpeed * delta;

    const radius = product.physics.orbitRadius;
    const x = Math.sin(currentAngle.current) * radius;
    const z = Math.cos(currentAngle.current) * radius;
    
    // Subtle vertical floating based on time and index
    const y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.5;

    groupRef.current.position.set(x, y, z);
    
    // Shoes always face outward from center initially, but we can make them rotate slowly
    groupRef.current.rotation.y = currentAngle.current + Math.PI / 2;

    // 2. Attraction / Hover Force (Magnetic pull toward camera)
    if (hovered) {
      // Pull toward camera (local z-axis translation)
      gsap.to(shoeWrapperRef.current.position, {
        z: product.physics.hoverForce,
        duration: 0.8,
        ease: "power2.out"
      });
      // Slight tilt for inspection
      gsap.to(shoeWrapperRef.current.rotation, {
        x: -0.2,
        y: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
    } else {
      // Return to neutral
      gsap.to(shoeWrapperRef.current.position, {
        z: 0,
        duration: 1.2,
        ease: "power2.out"
      });
      gsap.to(shoeWrapperRef.current.rotation, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  });

  return (
    <group ref={groupRef}>
      <group 
        ref={shoeWrapperRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(product.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "default";
        }}
      >
        {/* We use a scaled down PlaceholderShoe for now. 
            In production, this would load the specific GLB for this product. */}
        <group scale={[0.5, 0.5, 0.5]}>
          <PlaceholderShoe />
        </group>
      </group>
    </group>
  );
};

export default function ConstellationRig() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const containerRef = useRef<THREE.Group>(null);

  // We exclude the Hero shoe since it's already in the center (Scene 01-04)
  const collectionProducts = useMemo(() => 
    PRODUCTS.filter(p => p.category !== "Hero"), 
  []);

  // When a shoe is focused (hovered), we tell the TransitionEngine to morph the environment!
  useEffect(() => {
    if (focusedId) {
      const product = collectionProducts.find(p => p.id === focusedId);
      const transitionEngine = (window as any).__transitionEngine;
      if (product && transitionEngine) {
        // Morph environment to match the hovered shoe's native world
        transitionEngine.morphToEnvironment(product, 1.5);
      }
    } else {
      // Return to neutral "museum" state when nothing is hovered
      const transitionEngine = (window as any).__transitionEngine;
      if (transitionEngine) {
        transitionEngine.morphToEnvironment({
          environment: { ground: "studio", weather: "clear", fogColor: "#050508", fogDensity: 0.05 }
        }, 1.5);
      }
    }
  }, [focusedId, collectionProducts]);

  useEffect(() => {
    (window as any).__constellationRig = containerRef.current;
    return () => {
      delete (window as any).__constellationRig;
    };
  }, []);

  return (
    <group ref={containerRef} position={[0, -20, 0]} visible={false}>
      {/* 
        This group is positioned far below the hero scene. 
        During Scene 05, the StoryEngine will dolly the camera down here,
        or translate this group up into view.
      */}
      {collectionProducts.map((product, index) => (
        <ConstellationNode
          key={product.id}
          product={product}
          index={index}
          total={collectionProducts.length}
          onHover={setFocusedId}
        />
      ))}
    </group>
  );
}
