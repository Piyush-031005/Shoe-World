"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, OrbitControls, Float, Environment, Html, useProgress } from "@react-three/drei";
import Image from "next/image";
import { useInView } from "framer-motion";

const ExperienceEngine = dynamic(() => import("@/experience/ExperienceEngine"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ── 3D Model: scale managed via React state to prevent flash/shrink ── */
function ShoeModel({
  path, primaryColor = "#888888", emissiveColor = "#000000",
  roughness = 0.6, metalness = 0.3,
  modelRotation = [0, 0, 0],
  // kept for API compatibility but handled by auto-fit below
  modelPosition: _mp, modelScale: _ms, fitScale: _fs,
}: {
  path: string; primaryColor?: string; emissiveColor?: string;
  roughness?: number; metalness?: number;
  modelRotation?: number[]; modelPosition?: number[]; modelScale?: number; fitScale?: number;
}) {
  const { scene } = useGLTF(path);

  // ─── PERMANENT FIX ───────────────────────────────────────────────────────────
  // Scale is managed as React state starting at 0 (invisible).
  // useEffect measures the native bounds and sets the correct scale via setState.
  // This means the group is ALWAYS scale=0 on first render, so there is never
  // a frame where the model appears at its huge native size before shrinking.
  // We also never mutate scene.scale/position on the cached useGLTF object,
  // preventing contamination across remounts.
  // ─────────────────────────────────────────────────────────────────────────────
  const [displayScale, setDisplayScale] = useState<number>(0);
  const [centerOffset, setCenterOffset] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    try {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          if (child.material.color) child.material.color.set(primaryColor);
          if (child.material.emissive) child.material.emissive.set(emissiveColor);
          child.material.emissiveIntensity = 0.18;
          child.material.roughness = roughness;
          child.material.metalness = metalness;
          child.material.needsUpdate = true;
        }
      });

      // Reset scene to identity so Box3 always measures the true native size,
      // regardless of any previous scale/position set on the cached object.
      scene.scale.set(1, 1, 1);
      scene.position.set(0, 0, 0);
      scene.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);

      if (maxDim > 0) {
        // Target 2.0 Three.js units: at camera z=4, fov=45 this fills ~60% of frame
        const s = 2.0 / maxDim;
        setDisplayScale(s);
        setCenterOffset([-center.x * s, -center.y * s, -center.z * s]);
      }
    } catch (e) {
      console.error("ShoeModel Error:", e);
    }
  }, [scene, primaryColor, emissiveColor, roughness, metalness]);

  return (
    <group position={centerOffset} rotation={modelRotation as any} scale={displayScale}>
      <primitive object={scene} />
    </group>
  );
}

/* ── 3D Loading State ── */
function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        color: "#fff", fontFamily: "'Silkscreen', monospace", fontSize: 14,
        background: "rgba(0,0,0,0.5)", padding: "8px 16px", borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.1)", whiteSpace: "nowrap"
      }}>
        LOADING 3D... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

/* ── 3D Viewer Canvas — camera at z=4 for bigger, closer view ── */
function ShoeViewer({ path, height = 520, primaryColor, emissiveColor, roughness, metalness, modelRotation,
  modelPosition: _modelPosition, modelScale: _modelScale, fitScale: _fitScale,
}: {
  path: string; height?: number;
  primaryColor?: string; emissiveColor?: string; roughness?: number; metalness?: number;
  modelRotation?: number[]; modelPosition?: number[]; modelScale?: number; fitScale?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "200px" });

  return (
    <div ref={ref} style={{ width: "100%", height, cursor: "grab" }}>
      {isInView && (
        <Canvas camera={{ position: [0, 0.3, 4], fov: 45 }} gl={{ alpha: true }}>
          <ambientLight intensity={2.5} />
          <spotLight position={[8, 12, 8]} angle={0.4} penumbra={1} intensity={5} castShadow />
          <spotLight position={[-6, -4, 6]} angle={0.4} penumbra={1} intensity={3} color={emissiveColor || "#ffffff"} />
          <pointLight position={[0, -8, 0]} intensity={1.5} />
          <Suspense fallback={<ModelLoader />}>
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} enableDamping dampingFactor={0.05} />
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
              <ShoeModel
                path={path} primaryColor={primaryColor} emissiveColor={emissiveColor}
                roughness={roughness} metalness={metalness}
                modelRotation={modelRotation}
              />
            </Float>
          </Suspense>
        </Canvas>
      )}
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
        <a href="/" className="font-pixel" style={{ background: "#ff003c", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", textDecoration: "none" }}>SW</a>
        <a href="/" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>HOME</a>
        <a href="/collection" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>COLLECTION</a>
        <a href="/about" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>ABOUT</a>
        <a href="/contact" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>CONTACT</a>
        <a href="/contact" className="font-pixel" style={{ background: "#F0EDE8", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 30, fontSize: 10 }}>VISIT STORE +</a>
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
            style={{ fontSize: "clamp(60px, 12vw, 180px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", position: "relative", zIndex: 15, margin: 0, marginBottom: 100 }}>
            WORLD
          </h1>
          {/* Premium subtitle — spaced far below the big title */}
          <p className="hero-elem" style={{
            fontSize: 11, color: "#00eaff", letterSpacing: "0.35em", marginBottom: 18,
            position: "relative", zIndex: 15,
            fontFamily: "'Inter', sans-serif", fontWeight: 600, textTransform: "uppercase",
          }}>
            PITHORAGARH &nbsp;·&nbsp; UTTARAKHAND &nbsp;·&nbsp; INDIA
          </p>
          <p className="hero-elem" style={{
            fontSize: 14, color: "rgba(240,237,232,0.45)", maxWidth: 400, lineHeight: 1.8,
            position: "relative", zIndex: 15,
            fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.05em",
          }}>
            Born in the shadow of the Himalayas.<br />
            Engineered for the extremes.<br />
            Designed for the streets.
          </p>
          <div className="hero-elem" style={{ width: 40, height: 2, background: "#0066ff", marginTop: 36, position: "relative", zIndex: 15 }} />
        </section>

        {/* COLOR PANELS — compact cards with bigger models */}
        <div style={{ padding: "0 5vw", display: "flex", flexDirection: "column", gap: "3vw", paddingBottom: "15vh", paddingTop: "5vw", background: "#050005" }}>

          {/* BOOTS */}
          <section className="color-panel panel-boots" style={{ borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "22vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>RUGGED</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>BOOTS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#ff003c", letterSpacing: "0.2em", marginBottom: 14 }}>MOUNTAIN · TREK · RUGGED</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>Conquer every trail from the Himalayas to the city streets with rugged, premium craftsmanship.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/boots_new.glb"
                  height={420}
                  primaryColor="#0a0a0a"
                  emissiveColor="#6b0010"
                  roughness={0.75} metalness={0.12}
                  modelPosition={[0, 0, 0]}
                  modelRotation={[0.1, -0.4, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* SPORTS */}
          <section className="color-panel panel-sports" style={{ borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "10%", right: "-6%", fontSize: "22vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>RUN</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>SPORTS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#ffd700", letterSpacing: "0.2em", marginBottom: 14 }}>RUN · TRAIN · PERFORM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>Pushing boundaries with aerodynamic design and explosive energy return.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/sports.glb"
                  height={420}
                  primaryColor="#cc4400"
                  emissiveColor="#ff6600"
                  roughness={0.35} metalness={0.45}
                  modelPosition={[0, 0, 0]}
                  modelRotation={[0.05, -0.3, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* SANDALS */}
          <section className="color-panel panel-sandals-green" style={{ borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", left: "-3%", fontSize: "22vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>FREE</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>SANDALS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#00cc55", letterSpacing: "0.2em", marginBottom: 14 }}>SUMMER · BREEZE · COMFORT</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>Lightweight, breathable, designed for relaxation on Himalayan trails.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/sandles_new.glb"
                  height={420}
                  primaryColor="#1a4020"
                  emissiveColor="#b8900a"
                  roughness={0.45} metalness={0.55}
                  modelPosition={[0, 0, 0]}
                  fitScale={0.7}
                  modelRotation={[0.1, -0.4, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* LOAFERS */}
          <section className="color-panel panel-loafers" style={{ borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden" }}>
            <h2 className="font-pixel" style={{ position: "absolute", bottom: "-5%", right: "-5%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>FORMAL</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>LOAFERS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#ff9999", letterSpacing: "0.2em", marginBottom: 14 }}>FORMAL · ELEGANT · PREMIUM</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>Step into sophistication. Premium leathers and classic designs for the modern gentleman.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/loafer_new.glb"
                  height={420}
                  primaryColor="#6b3520"
                  emissiveColor="#d4900a"
                  roughness={0.92} metalness={0.05}
                  modelPosition={[0, 0, 0]}
                  fitScale={0.7}
                  modelRotation={[0.1, -0.4, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* SNEAKERS */}
          <section className="color-panel" style={{
            borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden",
            background: "#ffefbe",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", right: "-5%", fontSize: "22vw", color: "rgba(0,0,0,0.05)", lineHeight: 0.8, pointerEvents: "none" }}>AIR</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16, color: "#1a3a0a" }}>SNEAKERS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#b32200", letterSpacing: "0.2em", marginBottom: 14 }}>STREET · CULTURE · ICONIC</p>
                <p className="font-sans" style={{ color: "rgba(26,58,10,0.72)", fontSize: 14, lineHeight: 1.6 }}>Step into streetwear culture. Iconic silhouettes for the bold and the fearless.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(26,58,10,0.35)", borderRadius: 30, color: "#1a3a0a", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/sneaker.glb"
                  height={420}
                  primaryColor="#080808"
                  emissiveColor="#cc0020"
                  roughness={0.6} metalness={0.2}
                  modelPosition={[0, 0, 0]}
                  fitScale={1.2}
                  modelRotation={[0.05, -0.3, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* CASUAL */}
          <section className="color-panel" style={{
            borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden",
            background: "linear-gradient(145deg, #1a1000 0%, #120c00 40%, #0a0800 100%)",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "10%", left: "-5%", fontSize: "20vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>EASY</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%", textAlign: "right" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>CASUAL</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#c8860a", letterSpacing: "0.2em", marginBottom: 14 }}>DAILY · COMFORT · CLASSIC</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>All-day comfort meets timeless style. Premium nubuck leather crafted for every occasion.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/casual.glb"
                  height={420}
                  primaryColor="#8c5810"
                  emissiveColor="#c8860a"
                  roughness={0.8} metalness={0.1}
                  modelPosition={[0, 0, 0]}
                />
              </div>
            </div>
          </section>

          {/* CROCS */}
          <section className="color-panel" style={{
            borderRadius: 32, padding: "4vw 6vw", minHeight: "55vh", position: "relative", overflow: "hidden",
            background: "linear-gradient(145deg, #0f1a0a 0%, #0a1205 40%, #050a02 100%)",
          }}>
            <h2 className="font-pixel" style={{ position: "absolute", top: "5%", right: "-5%", fontSize: "22vw", color: "rgba(255,255,255,0.03)", lineHeight: 0.8, pointerEvents: "none" }}>CLOG</h2>
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "45vh" }}>
              <div style={{ maxWidth: "38%" }}>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1, marginBottom: 16 }}>CROCS</h2>
                <p className="font-pixel" style={{ fontSize: 11, color: "#7ab648", letterSpacing: "0.2em", marginBottom: 14 }}>LIGHT · FREE · ANYWHERE</p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6 }}>Ultra-lightweight, waterproof, and built for adventure — from Himalayan streams to city streets.</p>
                <button className="font-pixel" style={{ marginTop: 24, padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, color: "#fff", fontSize: 10, cursor: "pointer" }}>SHOP NOW →</button>
              </div>
              <div style={{ width: "50%" }}>
                <ShoeViewer
                  path="/models/crocs.glb"
                  height={420}
                  primaryColor="#2e5c1a"
                  emissiveColor="#5a9040"
                  roughness={0.8} metalness={0.08}
                  modelPosition={[0, 0, 0]}
                  fitScale={1.2}
                  modelRotation={[0.05, -0.3, 0]}
                  modelScale={2.4}
                />
              </div>
            </div>
          </section>

          {/* ── BUILT FOR THE HILLS — Uttarakhand Identity ── */}
          <section className="color-panel panel-hills" style={{
            borderRadius: 32, padding: "5vw 6vw", minHeight: "70vh",
            position: "relative", overflow: "hidden",
            background: "linear-gradient(180deg, #051a0d 0%, #041510 40%, #020d08 100%)",
          }}>
            {/* Multi-layer Himalayan mountain silhouette */}
            <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "65%", pointerEvents: "none" }} viewBox="0 0 1440 400" preserveAspectRatio="none">
              {/* Far background peaks — lightest */}
              <polygon points="0,400 60,200 150,260 280,130 400,210 520,150 640,220 760,100 880,180 1000,130 1120,190 1240,110 1360,170 1440,130 1440,400" fill="rgba(0,180,80,0.06)" />
              {/* Mid mountain range */}
              <polygon points="0,400 80,240 200,300 340,160 480,260 600,180 720,250 850,120 980,210 1100,155 1220,230 1340,160 1440,200 1440,400" fill="rgba(0,150,60,0.09)" />
              {/* Foreground hills */}
              <polygon points="0,400 100,300 240,350 380,240 520,320 650,260 780,310 900,210 1040,290 1160,240 1300,300 1440,260 1440,400" fill="rgba(0,120,50,0.13)" />
              {/* Snow caps on tallest peaks */}
              <polygon points="760,100 790,130 730,130" fill="rgba(255,255,255,0.12)" />
              <polygon points="280,130 310,158 250,158" fill="rgba(255,255,255,0.09)" />
              <polygon points="1000,130 1030,158 970,158" fill="rgba(255,255,255,0.09)" />
              {/* Rolling valley floor */}
              <ellipse cx="720" cy="400" rx="800" ry="60" fill="rgba(0,80,30,0.15)" />
            </svg>

            {/* Decorative Kumaoni-inspired geometric border at top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, transparent 0%, #00cc55 20%, #00ff88 50%, #00cc55 80%, transparent 100%)",
              opacity: 0.4,
            }} />
            <div style={{
              position: "absolute", top: 6, left: "10%", right: "10%", height: 1,
              background: "linear-gradient(90deg, transparent 0%, rgba(0,255,100,0.3) 50%, transparent 100%)",
            }} />

            {/* Star/dot motif — Kumaoni style */}
            {[0.1, 0.25, 0.5, 0.75, 0.9].map((x, i) => (
              <div key={i} style={{
                position: "absolute", top: 12, left: `${x * 100}%`,
                width: 4, height: 4, borderRadius: "50%",
                background: "rgba(0,255,100,0.5)",
                transform: "translateX(-50%)",
              }} />
            ))}

            <h2 className="font-pixel" style={{ position: "absolute", top: "8%", left: "-2%", fontSize: "18vw", color: "rgba(0,255,100,0.025)", lineHeight: 0.8, pointerEvents: "none", whiteSpace: "nowrap" }}>HILLS</h2>

            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              {/* Left: Main content */}
              <div style={{ maxWidth: "52%" }}>
                <p className="font-pixel" style={{ fontSize: 10, color: "#00cc55", letterSpacing: "0.4em", marginBottom: 20, opacity: 0.8 }}>
                  ❖ PITHORAGARH · UTTARAKHAND · INDIA ❖
                </p>
                <h2 className="font-pixel" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1.05, marginBottom: 20, color: "#fff" }}>
                  BUILT FOR<br />
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>THE HILLS.</span>
                </h2>
                {/* Kumaoni quote */}
                <p style={{
                  fontSize: 13, color: "rgba(0,255,100,0.7)", fontFamily: "'Inter', sans-serif",
                  fontStyle: "italic", fontWeight: 300, letterSpacing: "0.06em",
                  borderLeft: "2px solid rgba(0,255,100,0.3)", paddingLeft: 16, marginBottom: 20,
                }}>
                  "पहाड़ की मिट्टी, पैरों की ताकत" <br />
                  <span style={{ fontSize: 11, opacity: 0.6 }}>The strength of the mountains, under your feet.</span>
                </p>
                <p className="font-sans" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 440, lineHeight: 1.7 }}>
                  From the high-altitude trails of Munsiyari to the ghats of Patal Bhuvaneshwar —
                  Shoe World was born in Pithoragarh to equip every Pahadi adventure.
                </p>
                <div style={{ marginTop: 32, display: "flex", gap: 40, flexWrap: "wrap" }}>
                  <div>
                    <div className="font-pixel" style={{ fontSize: 32, color: "#fff" }}>500+</div>
                    <div className="font-pixel" style={{ fontSize: 9, color: "#00cc55", marginTop: 4, letterSpacing: "0.2em" }}>STYLES</div>
                  </div>
                  <div>
                    <div className="font-pixel" style={{ fontSize: 32, color: "#fff" }}>10+</div>
                    <div className="font-pixel" style={{ fontSize: 9, color: "#00cc55", marginTop: 4, letterSpacing: "0.2em" }}>BRANDS</div>
                  </div>
                  <div>
                    <div className="font-pixel" style={{ fontSize: 32, color: "#fff" }}>5000+</div>
                    <div className="font-pixel" style={{ fontSize: 9, color: "#00cc55", marginTop: 4, letterSpacing: "0.2em" }}>CUSTOMERS</div>
                  </div>
                  <div>
                    <div className="font-pixel" style={{ fontSize: 32, color: "#fff" }}>6000m</div>
                    <div className="font-pixel" style={{ fontSize: 9, color: "#00cc55", marginTop: 4, letterSpacing: "0.2em" }}>ALTITUDE TESTED</div>
                  </div>
                </div>
              </div>

              {/* Right: Uttarakhand districts badge */}
              <div style={{
                maxWidth: "38%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12,
              }}>
                <div style={{
                  border: "1px solid rgba(0,255,100,0.2)", borderRadius: 16, padding: "20px 24px",
                  background: "rgba(0,50,20,0.3)", backdropFilter: "blur(8px)",
                }}>
                  <p className="font-pixel" style={{ fontSize: 9, color: "#00cc55", letterSpacing: "0.3em", marginBottom: 14 }}>OUR HOME TERRAIN</p>
                  {["Pithoragarh", "Munsiyari", "Bageshwar", "Almora", "Champawat"].map((place) => (
                    <div key={place} style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00cc55", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{place}</span>
                    </div>
                  ))}
                </div>
                <p className="font-pixel" style={{ fontSize: 9, color: "rgba(0,255,100,0.4)", letterSpacing: "0.2em", textAlign: "right" }}>
                  READY FOR EVERYWHERE.
                </p>
              </div>
            </div>
          </section>

          {/* AND LOT MORE — teaser */}
          <section style={{
            borderRadius: 32, padding: "5vw 6vw", minHeight: "42vh",
            background: "linear-gradient(145deg, #0d0d0d 0%, #050505 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,0,60,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
            <p className="font-pixel" style={{ fontSize: 10, color: "#ff003c", letterSpacing: "0.4em", marginBottom: 20, opacity: 0.8 }}>[ AND LOT MORE ]</p>
            <h2 className="font-pixel" style={{ fontSize: "clamp(28px, 4.5vw, 64px)", lineHeight: 1.1, marginBottom: 20, color: "#fff" }}>
              EXPLORE THE FULL
              <br /><span style={{ color: "rgba(255,255,255,0.35)" }}>COLLECTION</span>
            </h2>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.38)", maxWidth: 500, lineHeight: 1.8,
              fontFamily: "'Inter', sans-serif", fontWeight: 300, letterSpacing: "0.04em", marginBottom: 32,
            }}>
              Formal wear, flip-flops, slip-ons, Oxford shoes, mules, wedges, and more —<br />
              over 500+ styles waiting for you in-store.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <button className="font-pixel" style={{
                padding: "14px 32px", background: "#ff003c", border: "none", borderRadius: 30,
                color: "#fff", fontSize: 10, cursor: "pointer", letterSpacing: "0.15em",
              }}>VIEW ALL CATEGORIES →</button>
              <button className="font-pixel" style={{
                padding: "14px 32px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30,
                color: "rgba(255,255,255,0.5)", fontSize: 10, cursor: "pointer", letterSpacing: "0.15em",
              }}>VISIT STORE</button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}


