"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Float } from "@react-three/drei";

const ExperienceEngine = dynamic(() => import("@/experience/ExperienceEngine"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ── 3D Model Component ── */
function ShoeModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  // Scale it up a bit since it's a dummy mesh, and add a shiny white material to make it visible
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.color.set(0xffffff);
        child.material.roughness = 0.2;
        child.material.metalness = 0.5;
      }
    });
  }, [scene]);
  return <primitive object={scene} scale={2.5} position={[0, -1, 0]} />;
}

/* ── Interactive 3D Shoe Component (Real 3D) ── */
function InteractiveShoeModel({ path, width, height, className }: {
  path: string; width: number; height: number; className?: string;
}) {
  return (
    <div
      className={`shoe-interactive-3d ${className || ""}`}
      style={{ width: "100%", height, display: "inline-block", cursor: "grab", position: "relative", zIndex: 5 }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={3} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <Suspense fallback={null}>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <ShoeModel path={path} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}


/* ── Speed Lines Component (Horizontal AC Motorsport Style) ── */
function SpeedLines() {
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 40; i++) {
      const rng = Math.random();
      const isRed = rng > 0.6;
      const isWhite = rng < 0.2;
      let color;
      if (isRed) color = `rgba(255,0,60,${0.4 + Math.random() * 0.4})`;
      else if (isWhite) color = `rgba(255,255,255,${0.3 + Math.random() * 0.3})`;
      else color = `rgba(0,120,255,${0.4 + Math.random() * 0.4})`;
      
      const height = isWhite ? 2 : (Math.random() > 0.5 ? 2 : 4);
      
      generated.push(
        <div
          key={i}
          className="speed-line-horizontal"
          style={{
            top: `${Math.random() * 100}%`,
            left: `-50%`,
            width: `${200 + Math.random() * 600}px`,
            height: `${height}px`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
          }}
        />
      );
    }
    setLines(generated);
  }, []);
  return <div className="speed-lines">{lines}</div>;
}

/* ── Mountain SVG Silhouette ── */
function MountainSilhouette() {
  return (
    <svg className="mountain-silhouette" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <polygon points="0,200 100,80 200,130 350,40 500,100 600,60 720,110 850,30 1000,90 1100,50 1200,100 1300,70 1440,120 1440,200" fill="rgba(255,255,255,0.02)" />
      <polygon points="0,200 150,120 300,160 450,90 600,140 750,80 900,130 1050,100 1200,140 1350,110 1440,150 1440,200" fill="rgba(255,255,255,0.015)" />
    </svg>
  );
}

export default function Home() {
  const [engineReady, setEngineReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    function raf(time: number) {
      (window as any).__lenisVelocity = lenis.velocity;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    setEngineReady(true);

    const ctx = gsap.context(() => {
      // Hero entrance — DO NOT use clearProps
      gsap.from(".hero-elem", {
        y: 80, opacity: 0, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2,
      });

      // Panel reveal on scroll — NO clearProps so backgrounds stay
      gsap.utils.toArray<HTMLElement>(".color-panel").forEach((panel) => {
        gsap.from(panel, {
          scrollTrigger: { trigger: panel, start: "top 85%", toggleActions: "play none none none" },
          y: 80, opacity: 0, scale: 0.97, duration: 1, ease: "expo.out",
        });
      });
    });

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* WebGL Canvas */}
      {engineReady && <ExperienceEngine />}

      {/* Red/Blue Speed Lines */}
      <SpeedLines />

      {/* Glassmorphism Navbar */}
      <nav style={{
        position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
        background: "rgba(10,10,15,0.6)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
        padding: "10px 20px", display: "flex", gap: 30, alignItems: "center",
        letterSpacing: "0.1em",
      }}>
        <div className="font-pixel" style={{ background: "#ff003c", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>SW</div>
        <a href="#" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>HOME</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>COLLECTION</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>ABOUT</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>CONTACT</a>
        <button className="font-pixel" style={{ background: "#F0EDE8", color: "#000", border: "none", padding: "10px 20px", borderRadius: 30, cursor: "pointer", fontSize: 10 }}>VISIT STORE +</button>
      </nav>

      <main style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>

        {/* ── HERO SECTION — AC Motorsport + Utopia Tokyo style ── */}
        <section ref={heroRef} style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw", position: "relative", overflow: "hidden" }}>
          {/* Red/Blue glow accents behind text */}
          <div style={{ position: "absolute", top: "20%", left: "-10%", width: "50vw", height: "50vh", background: "radial-gradient(ellipse, rgba(255,0,60,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "40vw", height: "40vh", background: "radial-gradient(ellipse, rgba(0,100,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <MountainSilhouette />
          
          {/* Red accent line */}
          <div className="hero-elem" style={{ width: 60, height: 3, background: "#ff003c", marginBottom: 20 }} />
          
          <p className="hero-elem font-pixel" style={{ fontSize: 11, color: "#ff003c", letterSpacing: "0.25em", marginBottom: 30 }}>
            [ SYSTEM STATUS: ONLINE ]
          </p>
          
          <h1 className="hero-elem font-pixel rgb-glitch" data-text="SHOE" style={{ fontSize: "clamp(60px, 12vw, 180px)", lineHeight: 0.9, letterSpacing: "-0.02em", color: "#fff" }}>
            SHOE
          </h1>
          <h1 className="hero-elem font-pixel rgb-glitch" data-text="WORLD" style={{ fontSize: "clamp(60px, 12vw, 180px)", lineHeight: 0.9, letterSpacing: "-0.02em", color: "#fff", marginBottom: 40 }}>
            WORLD
          </h1>
          
          <p className="hero-elem font-pixel" style={{ fontSize: 11, color: "#00eaff", letterSpacing: "0.2em", marginBottom: 15 }}>
            PITHORAGARH · UTTARAKHAND · INDIA
          </p>
          
          <p className="hero-elem font-sans" style={{ fontSize: 15, color: "rgba(240,237,232,0.5)", maxWidth: 450, lineHeight: 1.6 }}>
            Born in the shadow of the Himalayas. Engineered for the extremes. Designed for the streets.
          </p>
          
          {/* Blue accent line */}
          <div className="hero-elem" style={{ width: 40, height: 2, background: "#0066ff", marginTop: 30 }} />
        </section>

        {/* ── VIBRANT COLOR PANELS ── backgrounds via CSS classes, not inline */}
        <div style={{ padding: "0 5vw", display: "flex", flexDirection: "column", gap: "5vw", paddingBottom: "20vh", paddingTop: "5vw", background: "#050005" }}>

          {/* BOOTS / RED */}
          <section className="color-panel panel-boots" style={{
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>RUGGED</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>BOOTS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 20 }}>MOUNTAIN · TREK · RUGGED</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Conquer every trail from the Himalayas to the city streets with rugged, premium craftsmanship.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "45%" }}>
                <InteractiveShoeModel path="/models/shoe1.glb" width={600} height={600} />
              </div>
            </div>
          </section>

          {/* SPORTS / YELLOW-ORANGE */}
          <section className="color-panel panel-sports" style={{
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "15%", right: "-8%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>RUN</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>SPORTS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ffd700", letterSpacing: "0.2em", marginBottom: 20 }}>RUN · TRAIN · PERFORM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Pushing boundaries with aerodynamic design and explosive energy return.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <InteractiveShoeModel path="/models/shoe2.glb" width={800} height={800} />
              </div>
            </div>
          </section>

          {/* SANDALS / DARK GREEN */}
          <section className="color-panel panel-sandals-green" style={{
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>FREE</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>SANDALS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#00cc55", letterSpacing: "0.2em", marginBottom: 20 }}>SUMMER · BREEZE · COMFORT</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Lightweight, breathable, and designed for ultimate relaxation on Himalayan trails.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "45%" }}>
                <InteractiveShoeModel path="/models/shoe3.glb" width={600} height={600} />
              </div>
            </div>
          </section>

          {/* LOAFERS / WINE */}
          <section className="color-panel panel-loafers" style={{
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", bottom: "-5%", right: "-5%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>FORMAL</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>LOAFERS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ff9999", letterSpacing: "0.2em", marginBottom: 20 }}>FORMAL · ELEGANT · PREMIUM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Step into sophistication. Premium leathers and classic designs for the modern gentleman.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "45%" }}>
                <InteractiveShoeModel path="/models/shoe1.glb" width={600} height={600} />
              </div>
            </div>
          </section>

          {/* HILLS / GREEN — Uttarakhand identity section */}
          <section className="color-panel panel-hills" style={{
            borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden",
          }}>
            {/* Mountain SVG inside the green section */}
            <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "40%", pointerEvents: "none" }} viewBox="0 0 1440 300" preserveAspectRatio="none">
              <polygon points="0,300 80,120 200,180 350,60 500,150 650,80 780,140 900,50 1050,120 1200,70 1350,130 1440,90 1440,300" fill="rgba(0,255,100,0.04)" />
              <polygon points="0,300 120,160 280,220 420,100 580,180 700,120 880,170 1000,90 1150,150 1300,110 1440,160 1440,300" fill="rgba(0,255,100,0.025)" />
              <polygon points="0,300 200,200 400,250 600,160 800,220 1000,180 1200,210 1440,190 1440,300" fill="rgba(0,200,80,0.02)" />
            </svg>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>HILLS</h2>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>BUILT FOR<br />THE HILLS.</h2>
              <p className="font-pixel" style={{ fontSize: 12, color: "#00ff66", letterSpacing: "0.2em", marginBottom: 20 }}>PITHORAGARH · UTTARAKHAND · INDIA</p>
              <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500 }}>Born in the shadow of the Himalayas, Shoe World curates the finest footwear for every terrain and every moment. From mountain peaks to city streets.</p>
              <div style={{ marginTop: 40, display: "flex", gap: 60 }}>
                <div>
                  <div className="font-pixel" style={{ fontSize: 36 }}>500+</div>
                  <div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>STYLES</div>
                </div>
                <div>
                  <div className="font-pixel" style={{ fontSize: 36 }}>10+</div>
                  <div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>BRANDS</div>
                </div>
                <div>
                  <div className="font-pixel" style={{ fontSize: 36 }}>5000+</div>
                  <div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>CUSTOMERS</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
