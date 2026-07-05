"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { useScramble } from "@/hooks/useScramble";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

// Dynamic import to avoid SSR issues with R3F
const ExperienceEngine = dynamic(() => import("@/experience/ExperienceEngine"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const S = {
  pixel: "'Silkscreen', monospace",
  sans: "'Inter', sans-serif",
  fg: "#F0EDE8",
  fgDim: "rgba(240,237,232,0.45)",
};

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
  
  // Refs for animations
  const heroRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lenis Smooth Scroll Setup
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
      (window as any).__lenisVelocity = lenis.velocity;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    setEngineReady(true);

    // --- GSAP ANIMATIONS ---
    const ctx = gsap.context(() => {
      // 1. Hero Stagger
      gsap.from(".hero-elem", {
        y: 100, opacity: 0, rotationX: -30, skewY: 10,
        duration: 1.5, stagger: 0.1, ease: "power4.out", delay: 0.1, clearProps: "all"
      });

      // 2. Parallax and Reveal for Colorful Sections
      const panels = gsap.utils.toArray(".color-panel");
      panels.forEach((panel: any) => {
        gsap.from(panel, {
          scrollTrigger: { trigger: panel, start: "top 85%" },
          y: 100, opacity: 0, scale: 0.95, duration: 1.2, ease: "expo.out", clearProps: "all"
        });
        
        // Image Parallax within panels
        const imgs = panel.querySelectorAll(".parallax-img");
        if (imgs.length > 0) {
          gsap.to(imgs, {
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
            y: (i: number) => -100 * (i + 1), // Different speed for each image
            ease: "none"
          });
        }
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
      
      {/* ── WebGL Canvas (Background) ── */}
      {engineReady && <ExperienceEngine />}

      {/* ── Glassmorphism Navbar ── */}
      <nav style={{
        position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
        background: "rgba(10,10,15,0.6)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
        padding: "10px 20px", display: "flex", gap: 30, alignItems: "center",
        fontFamily: S.pixel, fontSize: 10, letterSpacing: "0.1em"
      }}>
        <div style={{ background: "#ff003c", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>SW</div>
        <a href="#" style={{ color: S.fg, textDecoration: "none" }}>HOME</a>
        <a href="#" style={{ color: S.fgDim, textDecoration: "none" }}>COLLECTION</a>
        <a href="#" style={{ color: S.fgDim, textDecoration: "none" }}>ABOUT</a>
        <a href="#" style={{ color: S.fgDim, textDecoration: "none" }}>CONTACT</a>
        <button style={{ background: S.fg, color: "#000", border: "none", padding: "10px 20px", borderRadius: 30, fontFamily: S.pixel, cursor: "pointer" }}>VISIT STORE +</button>
      </nav>

      <main style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>
        
        {/* ── HERO SECTION ── */}
        <section ref={heroRef} style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10vw" }}>
          <div style={{ paddingBottom: 10 }}>
            <p className="hero-elem" style={{ fontFamily: S.pixel, fontSize: 12, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 20 }}>
              <ScrambleText text="[ SYSTEM STATUS: ONLINE ]" delay={0} />
            </p>
          </div>
          <div style={{ paddingBottom: 20 }}>
            <h1 className="hero-elem" style={{ fontFamily: S.pixel, fontSize: "clamp(50px, 10vw, 150px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
              <ScrambleText text="SHOE WORLD" delay={200} duration={1200} />
            </h1>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <p className="hero-elem" style={{ fontFamily: S.sans, fontSize: 16, color: S.fgDim, maxWidth: 400, marginTop: 40 }}>
              Engineered for the extremes. Designed for the streets. A premium collection of tactical and lifestyle footwear.
            </p>
          </div>
        </section>

        {/* ── VIBRANT COLOR PANELS ── */}
        <div ref={sectionsRef} style={{ padding: "0 5vw", display: "flex", flexDirection: "column", gap: "5vw", paddingBottom: "20vh" }}>

          {/* HILLS / GREEN */}
          <section className="color-panel" style={{ 
            background: "linear-gradient(145deg, #0f2d18, #05140a)", 
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden"
          }}>
            {/* Massive BG Typography */}
            <h2 style={{ position: "absolute", top: "5%", left: "-5%", fontSize: "30vw", fontFamily: S.pixel, color: "rgba(255,255,255,0.02)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>
              HILLS
            </h2>
            
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", height: "100%" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 style={{ fontFamily: S.pixel, fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>BUILT FOR<br/>THE HILLS.</h2>
                <p style={{ fontFamily: S.sans, color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Born in the shadow of the Himalayas, Shoe World curates the finest footwear for every terrain and every moment.</p>
                <div style={{ marginTop: 40, display: "flex", gap: 40, fontFamily: S.pixel }}>
                  <div>
                    <div style={{ fontSize: 24 }}>500+</div>
                    <div style={{ fontSize: 10, color: "#00ff66" }}>STYLES</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24 }}>10+</div>
                    <div style={{ fontSize: 10, color: "#00ff66" }}>BRANDS</div>
                  </div>
                </div>
              </div>
              
              <div style={{ position: "relative", width: "45%", height: "60vh" }}>
                <Image src="/shoe-boot.png" alt="Boot" width={600} height={600} className="parallax-img" style={{ position: "absolute", bottom: "-10%", right: "10%", width: "80%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))" }} />
                <Image src="/shoe-sandal.png" alt="Sandal" width={400} height={400} className="parallax-img" style={{ position: "absolute", top: "10%", left: "-20%", width: "60%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }} />
              </div>
            </div>
          </section>

          {/* SPORTS / RED */}
          <section className="color-panel" style={{ 
            background: "linear-gradient(145deg, #3b080b, #120202)", 
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden"
          }}>
            <h2 style={{ position: "absolute", top: "20%", right: "-10%", fontSize: "30vw", fontFamily: S.pixel, color: "rgba(255,255,255,0.02)", lineHeight: 0.8, pointerEvents: "none" }}>
              RUN
            </h2>
            
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", height: "100%", alignItems: "center" }}>
              <div style={{ maxWidth: "40%", textAlign: "right" }}>
                <h2 style={{ fontFamily: S.pixel, fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>SPORTS</h2>
                <p style={{ fontFamily: S.pixel, fontSize: 12, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 20 }}>RUN . TRAIN . PERFORM</p>
                <p style={{ fontFamily: S.sans, color: "rgba(255,255,255,0.6)", fontSize: 16, marginLeft: "auto" }}>Curated for every journey — from mountain trails to city streets.</p>
                <button style={{ marginTop: 40, padding: "15px 30px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontFamily: S.pixel, fontSize: 12, cursor: "pointer" }}>SHOP NOW &rarr;</button>
              </div>
              
              <div style={{ position: "relative", width: "50%", height: "60vh" }}>
                <Image src="/shoe-hero.png" alt="Sports Shoe" width={800} height={800} className="parallax-img" style={{ position: "absolute", top: "10%", left: "-10%", width: "100%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.6))" }} />
              </div>
            </div>
          </section>

          {/* LOAFERS / BROWN */}
          <section className="color-panel" style={{ 
            background: "linear-gradient(145deg, #2a1a0a, #0d0803)", 
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden"
          }}>
            <h2 style={{ position: "absolute", bottom: "-10%", left: "5%", fontSize: "20vw", fontFamily: S.pixel, color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>
              FORMAL
            </h2>
            
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", height: "100%", alignItems: "center" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 style={{ fontFamily: S.pixel, fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>LOAFERS</h2>
                <p style={{ fontFamily: S.pixel, fontSize: 12, color: "#ff9900", letterSpacing: "0.2em", marginBottom: 20 }}>FORMAL . ELEGANT . PREMIUM</p>
                <p style={{ fontFamily: S.sans, color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Step into sophistication. Premium leathers and classic designs for the modern gentleman.</p>
              </div>
              
              <div style={{ position: "relative", width: "45%", height: "60vh" }}>
                <Image src="/shoe-loafer.png" alt="Loafer" width={600} height={600} className="parallax-img" style={{ position: "absolute", top: "0%", right: "0%", width: "90%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }} />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
