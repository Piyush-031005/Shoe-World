"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { useScramble } from "@/hooks/useScramble";
import { PRODUCTS } from "@/data/products";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Dynamic import to avoid SSR issues with R3F / Three.js
const ExperienceEngine = dynamic(
  () => import("@/experience/ExperienceEngine"),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const S = {
  pixel: '"Silkscreen", monospace',
  sans: '"Inter", sans-serif',
  fg: "#F0EDE8",
  fgDim: "rgba(240,237,232,0.45)",
  fgFaint: "rgba(240,237,232,0.15)",
};

/**
 * TextScramble Component
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
  const heroRef = useRef<HTMLElement>(null);
  const collectionRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Initialize Lenis & GSAP Animations
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    function raf(time: number) {
      // Expose velocity to window for the WebGL fluid shader
      (window as any).__lenisVelocity = lenis.velocity;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    setEngineReady(true);

    // --- GSAP ANIMATIONS ---
    const ctx = gsap.context(() => {
      // 1. Hero Entrance (Resn / Anime.js style aggressive stagger)
      const tl = gsap.timeline();
      tl.from(".hero-elem", {
        y: 150,
        opacity: 0,
        rotationX: -45,
        skewY: 15,
        duration: 1.8,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.3, // wait for canvas
        clearProps: "all" // Clears transform constraints after animation to prevent clipping
      });

      // 2. Collection ScrollTrigger (Staggered fade/slide up)
      gsap.from(".collection-title", {
        scrollTrigger: {
          trigger: collectionRef.current,
          start: "top 80%",
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
      });

      gsap.from(".product-card", {
        scrollTrigger: {
          trigger: collectionRef.current,
          start: "top 60%",
        },
        y: 150,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.5)",
      });

      // 3. Footer Reveal
      gsap.from(".footer-elem", {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    });

    return () => {
      lenis.destroy();
      ctx.revert();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div style={{ background: "#050005", minHeight: "100vh", color: S.fg }}>
      
      {/* ── WebGL Canvas ── */}
      {engineReady && <ExperienceEngine />}

      {/* ── Foreground DOM Layer ── */}
      <main style={{ position: "relative", zIndex: 10, perspective: "1000px" }}>
        
        {/* Hero Section */}
        <section ref={heroRef} style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10vw" }}>
          <div style={{ paddingBottom: 10 }}>
            <p className="hero-elem" style={{ fontFamily: S.pixel, fontSize: 12, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 20 }}>
              <ScrambleText text="[ SYSTEM STATUS: ONLINE ]" delay={200} />
            </p>
          </div>
          <div style={{ paddingBottom: 20 }}>
            <h1 className="hero-elem rgb-glitch" data-text="SHOE WORLD" style={{ 
              fontFamily: S.pixel, 
              fontSize: "clamp(60px, 12vw, 150px)", 
              lineHeight: 1, 
              letterSpacing: "-0.02em",
              textShadow: "0px 10px 30px rgba(255,0,60,0.2)"
            }}>
              <ScrambleText text="SHOE WORLD" delay={400} duration={1200} />
            </h1>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p className="hero-elem" style={{ fontFamily: S.sans, fontSize: 16, color: S.fgDim, maxWidth: 400, marginTop: 40 }}>
              <ScrambleText text="Engineered for the extremes. Designed for the streets. A premium collection of tactical and lifestyle footwear." delay={1000} />
            </p>
          </div>
        </section>

        {/* Product Grid Section */}
        <section ref={collectionRef} style={{ minHeight: "100vh", padding: "10vw", paddingTop: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80 }}>
            <h2 className="collection-title rgb-glitch" data-text="COLLECTION" style={{ fontFamily: S.pixel, fontSize: "clamp(30px, 6vw, 80px)", lineHeight: 1 }}>
              <ScrambleText text="COLLECTION" delay={0} />
            </h2>
            <p className="collection-title" style={{ fontFamily: S.pixel, fontSize: 12, color: "#00eaff" }}>[01 - 04]</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "4vw",
          }}>
            {PRODUCTS.slice(0, 4).map((product, index) => (
              <div key={product.id} className="product-card group" style={{ display: "flex", flexDirection: "column", gap: 20, cursor: "pointer" }}>
                <div style={{ 
                  aspectRatio: "4/5", 
                  position: "relative", 
                  background: "rgba(20,20,25,0.4)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(255,0,60,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  <div style={{
                    position: "absolute", inset: 0, 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: S.pixel, color: S.fgDim, fontSize: 12,
                    zIndex: 2
                  }}>
                    [IMG_MISSING]
                  </div>
                  {/* Subtle red tint overlay on hover */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent, rgba(255,0,60,0.2))",
                    opacity: 0,
                    transition: "opacity 0.4s",
                  }} 
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}
                  />
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
        <footer ref={footerRef} style={{ padding: "10vw", display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
          <p className="footer-elem" style={{ fontFamily: S.pixel, fontSize: 10, color: S.fgDim }}>© 2026 SHOE WORLD</p>
          <p className="footer-elem" style={{ fontFamily: S.pixel, fontSize: 10, color: S.fgDim }}>PITHORAGARH, UTTARAKHAND</p>
        </footer>

      </main>
    </div>
  );
}
