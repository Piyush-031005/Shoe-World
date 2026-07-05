"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Float, Environment } from "@react-three/drei";
import Image from "next/image";

const ExperienceEngine = dynamic(() => import("@/experience/ExperienceEngine"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ── 3D Model with per-shoe color & emissive ── */
function ShoeModel({
  path, primaryColor = "#888888", emissiveColor = "#000000",
  roughness = 0.6, metalness = 0.3,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  modelScale = 2.8,
}: {
  path: string; primaryColor?: string; emissiveColor?: string;
  roughness?: number; metalness?: number;
  modelPosition?: number[]; modelRotation?: number[]; modelScale?: number;
}) {
  const { scene } = useGLTF(path);
  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color.set(primaryColor);
        if (child.material.emissive) child.material.emissive.set(emissiveColor);
        child.material.emissiveIntensity = 0.18;
        child.material.roughness = roughness;
        child.material.metalness = metalness;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, primaryColor, emissiveColor, roughness, metalness]);
  // @ts-ignore
  return <primitive object={scene} scale={modelScale} position={modelPosition} rotation={modelRotation} />;
}

/* ── 3D Viewer Canvas ── */
function ShoeViewer({ path, height = 520, primaryColor, emissiveColor, roughness, metalness, modelPosition, modelRotation, modelScale }: {
  path: string; height?: number;
  primaryColor?: string; emissiveColor?: string; roughness?: number; metalness?: number;
  modelPosition?: number[]; modelRotation?: number[]; modelScale?: number;
}) {
  return (
    <div style={{ width: "100%", height, cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={2.5} />
        <spotLight position={[8, 12, 8]} angle={0.4} penumbra={1} intensity={5} castShadow />
        <spotLight position={[-6, -4, 6]} angle={0.4} penumbra={1} intensity={3} color={emissiveColor || "#ffffff"} />
        <pointLight position={[0, -8, 0]} intensity={1.5} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} enableDamping dampingFactor={0.05} />
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <ShoeModel
              path={path} primaryColor={primaryColor} emissiveColor={emissiveColor}
              roughness={roughness} metalness={metalness}
              modelPosition={modelPosition} modelRotation={modelRotation} modelScale={modelScale}
            />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ── Superman Cinematic Beams: 3 depth layers across full viewport ── */
function CinematicBeams() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  // Background layer: wide, slow, blurred, very low opacity
  const bgBeams = Array.from({ length: 16 }, (_, i) => {
    const yFrac = i / 16;
    const y = yFrac * (vh + 100) - 50;
    const colorPalette = ["rgba(180,0,30,0.15)", "rgba(10,80,200,0.12)", "rgba(255,255,255,0.10)", "rgba(200,60,0,0.12)", "rgba(180,0,30,0.13)"];
    return {
      y, color: colorPalette[i % colorPalette.length],
      width: 700 + Math.sin(i * 1.7) * 400, height: 10 + (i % 4) * 5,
      blur: 6, speed: 5 + (i % 5) * 0.9, delay: (i * 0.4) % 5.5,
    };
  });

  // Middle layer: medium blur, moderate speed
  const midBeams = Array.from({ length: 22 }, (_, i) => {
    const yFrac = i / 22;
    const y = yFrac * (vh + 120) - 60;
    const colorPalette = ["rgba(255,0,40,0.38)", "rgba(20,120,255,0.34)", "rgba(255,255,255,0.42)", "rgba(255,80,0,0.32)"];
    return {
      y, color: colorPalette[i % colorPalette.length],
      width: 300 + (i % 3) * 250, height: 2 + (i % 3) * 1.5,
      blur: 2, speed: 2.5 + (i % 6) * 0.35, delay: (i * 0.28) % 4.5,
    };
  });

  // Foreground layer: thin, bright, fast — sparse
  const fgBeams = Array.from({ length: 10 }, (_, i) => {
    const yFrac = i / 10;
    const y = yFrac * (vh + 80) - 40;
    const colorPalette = ["rgba(255,20,50,0.95)", "rgba(50,140,255,0.90)", "rgba(255,255,255,1.0)", "rgba(255,110,20,0.85)"];
    return {
      y, color: colorPalette[i % colorPalette.length],
      width: 120 + (i % 4) * 100, height: 1 + (i % 2),
      blur: 0, speed: 1.0 + (i % 4) * 0.25, delay: (i * 0.38) % 3.8,
    };
  });

  const allBeams = [...bgBeams, ...midBeams, ...fgBeams];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: 2, overflow: "hidden",
    }}>
      {allBeams.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.y,
            left: "-40vw",
            width: b.width,
            height: b.height,
            background: `linear-gradient(90deg, transparent 0%, ${b.color} 25%, ${b.color} 75%, transparent 100%)`,
            boxShadow: b.blur > 0 ? `0 0 ${b.blur * 3}px ${b.color}` : undefined,
            filter: b.blur > 0 ? `blur(${b.blur / 4}px)` : undefined,
            willChange: "transform",
            animation: `beamSlide ${b.speed}s linear infinite`,
            animationDelay: `${b.delay}s`,
            borderRadius: 99,
          }}
        />
      ))}
      {/* Soft dark mask protecting SHOE WORLD text readability */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "45vw", height: "100%",
        background: "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

/* ── Mountain SVG ── */
function MountainSilhouette() {
  return (
    <svg className="mountain-silhouette" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <polygon points="0,200 100,80 200,130 350,40 500,100 600,60 720,110 850,30 1000,90 1100,50 1200,100 1300,70 1440,120 1440,200" fill="rgba(255,255,255,0.02)" />
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

    const raf = (time: number) => { (window as any).__lenisVelocity = lenis.velocity; requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    setEngineReady(true);

    const ctx = gsap.context(() => {
      gsap.from(".hero-elem", { y: 80, opacity: 0, duration: 1.5, stagger: 0.15, ease: "power4.out", delay: 0.2 });
      gsap.utils.toArray<HTMLElement>(".color-panel").forEach((panel) => {
        gsap.from(panel, {
          scrollTrigger: { trigger: panel, start: "top 85%", toggleActions: "play none none none" },
          y: 80, opacity: 0, scale: 0.97, duration: 1, ease: "expo.out",
        });
      });
    });

    return () => { lenis.destroy(); ctx.revert(); };
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      {engineReady && <ExperienceEngine />}

      {/* Superman-style Cinematic Beams across full screen */}
      <CinematicBeams />

      {/* Navbar */}
      <nav style={{
        position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
        background: "rgba(10,10,15,0.6)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
        padding: "10px 20px", display: "flex", gap: 30, alignItems: "center", letterSpacing: "0.1em",
      }}>
        <div className="font-pixel" style={{ background: "#ff003c", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>SW</div>
        <a href="#" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>HOME</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>COLLECTION</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>ABOUT</a>
        <a href="#" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>CONTACT</a>
        <button className="font-pixel" style={{ background: "#F0EDE8", color: "#000", border: "none", padding: "10px 20px", borderRadius: 30, cursor: "pointer", fontSize: 10 }}>VISIT STORE +</button>
      </nav>

      <main style={{ position: "relative", zIndex: 10, overflow: "hidden" }}>

        {/* HERO */}
        <section ref={heroRef} style={{
          height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 8vw", position: "relative", overflow: "hidden",
        }}>
          <MountainSilhouette />

          <div className="hero-elem" style={{ width: 60, height: 3, background: "#ff003c", marginBottom: 20, position: "relative", zIndex: 15 }} />
          <p className="hero-elem font-pixel" style={{ fontSize: 11, color: "#ff003c", letterSpacing: "0.25em", marginBottom: 28, position: "relative", zIndex: 15 }}>
            [ SYSTEM STATUS: ONLINE ]
          </p>
          <h1 className="hero-elem font-pixel rgb-glitch" data-text="SHOE"
            style={{ fontSize: "clamp(60px, 12vw, 180px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", position: "relative", zIndex: 15, margin: 0 }}>
            SHOE
          </h1>
          <h1 className="hero-elem font-pixel rgb-glitch" data-text="WORLD"
            style={{ fontSize: "clamp(60px, 12vw, 180px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", position: "relative", zIndex: 15, margin: 0, marginBottom: 50 }}>
            WORLD
          </h1>
          <p className="hero-elem font-pixel" style={{ fontSize: 11, color: "#00eaff", letterSpacing: "0.2em", marginBottom: 14, position: "relative", zIndex: 15 }}>
            PITHORAGARH · UTTARAKHAND · INDIA
          </p>
          <p className="hero-elem font-sans" style={{ fontSize: 15, color: "rgba(240,237,232,0.5)", maxWidth: 420, lineHeight: 1.6, position: "relative", zIndex: 15 }}>
            Born in the shadow of the Himalayas. Engineered for the extremes. Designed for the streets.
          </p>
          <div className="hero-elem" style={{ width: 40, height: 2, background: "#0066ff", marginTop: 30, position: "relative", zIndex: 15 }} />
        </section>

        {/* COLOR PANELS */}
        <div style={{ padding: "0 5vw", display: "flex", flexDirection: "column", gap: "5vw", paddingBottom: "20vh", paddingTop: "5vw", background: "#050005" }}>

          {/* BOOTS */}
          <section className="color-panel panel-boots" style={{ borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>RUGGED</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>BOOTS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 20 }}>MOUNTAIN · TREK · RUGGED</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Conquer every trail from the Himalayas to the city streets with rugged, premium craftsmanship.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "48%" }}>
                <ShoeViewer
                  path="/models/boots.glb"
                  height={540}
                  primaryColor="#1c0808"
                  emissiveColor="#8b0000"
                  roughness={0.5} metalness={0.35}
                  modelPosition={[0, 0.3, 0]}
                  modelRotation={[0.15, -0.5, 0]}
                  modelScale={2.8}
                />
              </div>
            </div>
          </section>

          {/* SPORTS — transparent PNG (no 3D model) */}
          <section className="color-panel panel-sports" style={{ borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "15%", right: "-8%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>RUN</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>SPORTS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ffd700", letterSpacing: "0.2em", marginBottom: 20 }}>RUN · TRAIN · PERFORM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Pushing boundaries with aerodynamic design and explosive energy return.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src="/shoe-sports-orange.png" alt="Sports Shoe" width={600} height={480}
                  style={{ width: "90%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(255,130,0,0.45))" }}
                />
              </div>
            </div>
          </section>

          {/* SANDALS */}
          <section className="color-panel panel-sandals-green" style={{ borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "25vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>FREE</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>SANDALS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#00cc55", letterSpacing: "0.2em", marginBottom: 20 }}>SUMMER · BREEZE · COMFORT</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Lightweight, breathable, designed for relaxation on Himalayan trails.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "48%" }}>
                <ShoeViewer
                  path="/models/sandles.glb"
                  height={540}
                  primaryColor="#0a3d20"
                  emissiveColor="#c8a415"
                  roughness={0.55} metalness={0.4}
                  modelPosition={[0, 0.3, 0]}
                  modelRotation={[0.15, -0.5, 0]}
                  modelScale={2.6}
                />
              </div>
            </div>
          </section>

          {/* LOAFERS */}
          <section className="color-panel panel-loafers" style={{ borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", bottom: "-5%", right: "-5%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>FORMAL</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "60vh" }}>
              <div style={{ maxWidth: "40%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>LOAFERS</h2>
                <p className="font-pixel" style={{ fontSize: 12, color: "#ff9999", letterSpacing: "0.2em", marginBottom: 20 }}>FORMAL · ELEGANT · PREMIUM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Step into sophistication. Premium leathers and classic designs for the modern gentleman.</p>
                <button className="font-pixel" style={{ marginTop: 30, padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 11, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "48%" }}>
                <ShoeViewer
                  path="/models/loafer.glb"
                  height={540}
                  primaryColor="#4a2810"
                  emissiveColor="#c8860a"
                  roughness={0.85} metalness={0.15}
                  modelPosition={[0, 0.3, 0]}
                  modelRotation={[0.15, -0.5, 0]}
                  modelScale={2.8}
                />
              </div>
            </div>
          </section>

          {/* HILLS */}
          <section className="color-panel panel-hills" style={{ borderRadius: 40, padding: "8vw", minHeight: "80vh", position: "relative", overflow: "hidden" }}>
            <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "40%", pointerEvents: "none" }} viewBox="0 0 1440 300" preserveAspectRatio="none">
              <polygon points="0,300 80,120 200,180 350,60 500,150 650,80 780,140 900,50 1050,120 1200,70 1350,130 1440,90 1440,300" fill="rgba(0,255,100,0.04)" />
            </svg>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>HILLS</h2>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 className="font-pixel" style={{ fontSize: "clamp(40px, 6vw, 100px)", lineHeight: 1, marginBottom: 20 }}>BUILT FOR<br />THE HILLS.</h2>
              <p className="font-pixel" style={{ fontSize: 12, color: "#00ff66", letterSpacing: "0.2em", marginBottom: 20 }}>PITHORAGARH · UTTARAKHAND · INDIA</p>
              <p className="font-sans" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500 }}>Born in the shadow of the Himalayas, Shoe World curates the finest footwear for every terrain.</p>
              <div style={{ marginTop: 40, display: "flex", gap: 60 }}>
                <div><div className="font-pixel" style={{ fontSize: 36 }}>500+</div><div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>STYLES</div></div>
                <div><div className="font-pixel" style={{ fontSize: 36 }}>10+</div><div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>BRANDS</div></div>
                <div><div className="font-pixel" style={{ fontSize: 36 }}>5000+</div><div className="font-pixel" style={{ fontSize: 10, color: "#00ff66", marginTop: 5 }}>CUSTOMERS</div></div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
