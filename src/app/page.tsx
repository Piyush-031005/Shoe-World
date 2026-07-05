"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { useScramble } from "@/hooks/useScramble";
import { PRODUCTS } from "@/data/products";
import Image from "next/image";

// Dynamic import to avoid SSR issues with R3F / Three.js
const ExperienceEngine = dynamic(
  () => import("@/experience/ExperienceEngine"),
  { ssr: false }
);

const S = {
  pixel: '"Silkscreen", monospace',
  sans: '"Inter", sans-serif',
  fg: "#F0EDE8",
  fgDim: "rgba(240,237,232,0.45)",
  fgFaint: "rgba(240,237,232,0.15)",
};

/**
 * TextScramble Component
 * Uses the custom hook to scramble text on mount or hover
 */
function ScrambleText({ text, delay = 0, duration = 800 }: { text: string, delay?: number, duration?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const scrambled = useScramble(text, delay, isHovered ? 400 : duration);
  
  return (
    <span 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "inline-block" }}
    >
      {scrambled}
    </span>
  );
}

export default function Home() {
  const [engineReady, setEngineReady] = useState(false);

  // Initialize Lenis for buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      // Expose velocity to window for the WebGL fluid shader
      (window as any).__lenisVelocity = lenis.velocity;
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    setEngineReady(true);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: S.fg }}>
      
      {/* ── WebGL Canvas (fixed, full viewport, z-index -1) ── */}
      {engineReady && <ExperienceEngine />}

      {/* ── Foreground DOM Layer ── */}
      <main style={{ position: "relative", zIndex: 10 }}>
        
        {/* Hero Section */}
        <section style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10vw" }}>
          <p style={{ fontFamily: S.pixel, fontSize: 12, color: S.fgDim, letterSpacing: "0.2em", marginBottom: 20 }}>
            <ScrambleText text="SYSTEM STATUS: ONLINE" delay={200} />
          </p>
          <h1 className="rgb-glitch" data-text="SHOE WORLD" style={{ 
            fontFamily: S.pixel, 
            fontSize: "clamp(60px, 12vw, 150px)", 
            lineHeight: 0.9, 
            letterSpacing: "-0.02em" 
          }}>
            <ScrambleText text="SHOE WORLD" delay={400} duration={1200} />
          </h1>
          <p style={{ fontFamily: S.sans, fontSize: 16, color: S.fgDim, maxWidth: 400, marginTop: 40 }}>
            <ScrambleText text="Engineered for the extremes. Designed for the streets. A premium collection of tactical and lifestyle footwear." delay={1000} />
          </p>
        </section>

        {/* Product Grid Section */}
        <section style={{ minHeight: "100vh", padding: "10vw", paddingTop: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
            <h2 className="rgb-glitch" data-text="COLLECTION" style={{ fontFamily: S.pixel, fontSize: "clamp(30px, 6vw, 80px)", lineHeight: 1 }}>
              <ScrambleText text="COLLECTION" delay={0} />
            </h2>
            <p style={{ fontFamily: S.pixel, fontSize: 12, color: S.fgDim }}>[01 - 04]</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "4vw",
          }}>
            {PRODUCTS.slice(0, 4).map((product, index) => (
              <div key={product.id} style={{ display: "flex", flexDirection: "column", gap: 20, cursor: "pointer" }} className="group">
                <div style={{ 
                  aspectRatio: "4/5", 
                  position: "relative", 
                  background: "rgba(20,20,25,0.4)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  {/* Subtle RGB Glitch on hover for images via CSS */}
                  <div style={{
                    position: "absolute", inset: 0, 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: S.pixel, color: S.fgDim, fontSize: 12
                  }}>
                    [IMG_MISSING]
                  </div>
                </div>
                <div>
                  <h3 className="rgb-glitch" data-text={product.name} style={{ fontFamily: S.pixel, fontSize: 20, marginBottom: 8 }}>
                    {product.name}
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: S.sans, fontSize: 14, color: S.fgDim }}>
                    <span>{product.type}</span>
                    <span>{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: "10vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontFamily: S.pixel, fontSize: 10, color: S.fgDim }}>© 2026 SHOE WORLD</p>
          <p style={{ fontFamily: S.pixel, fontSize: 10, color: S.fgDim }}>PITHORAGARH, UTTARAKHAND</p>
        </footer>

      </main>
    </div>
  );
}
