"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <nav style={{
      position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
      background: "rgba(10,10,15,0.6)", backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
      padding: "10px 20px", display: "flex", gap: 30, alignItems: "center", letterSpacing: "0.1em",
    }}>
      <Link href="/" className="font-pixel" style={{ background: "#ff003c", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", textDecoration: "none" }}>SW</Link>
      <Link href="/" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>HOME</Link>
      <Link href="/collection" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>COLLECTION</Link>
      <Link href="/about" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>ABOUT</Link>
      <Link href="/contact" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>CONTACT</Link>
      <Link href="/contact" className="font-pixel" style={{ background: "#F0EDE8", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 30, fontSize: 10 }}>VISIT STORE +</Link>
    </nav>
  );
}

const TIMELINE = [
  { year: "2018", event: "Founded", desc: "Shoe World opens its first store in Pithoragarh market, stocking curated trekking boots and local footwear." },
  { year: "2020", event: "First Collection", desc: "Launched our first curated collection of 50+ premium footwear brands — from sports to formal wear." },
  { year: "2022", event: "Himalayan Tested", desc: "Our boot range was tested on Panchachuli Base Camp trails at 4,500m. Certified for high-altitude performance." },
  { year: "2024", event: "5000+ Customers", desc: "Crossed 5,000 happy customers across Kumaon and Garhwal regions. Expanded to 3 categories." },
  { year: "2025", event: "Digital Launch", desc: "Shoe World goes online — bringing Pithoragarh's finest footwear to doorsteps across Uttarakhand." },
];

const VALUES = [
  {
    icon: "⛰️",
    title: "MOUNTAIN DNA",
    color: "#00cc55",
    desc: "Every product we stock has been evaluated for Himalayan conditions. If it can handle Munsiyari winters, it can handle anything.",
  },
  {
    icon: "✦",
    title: "CRAFTSMANSHIP",
    color: "#c8860a",
    desc: "We only carry footwear from brands that care about build quality — from hand-stitched leather to precision-molded soles.",
  },
  {
    icon: "❤️",
    title: "COMMUNITY",
    color: "#ff003c",
    desc: "Born in Pithoragarh, built for Pahadi people. We give back 2% of every sale to local trekking conservation initiatives.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#050005", color: "#fff" }}>
      {/* Hero glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 350, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 60% 0%, rgba(0,80,200,0.12) 0%, transparent 60%)",
      }} />

      {/* HERO SECTION — Split layout */}
      <section style={{
        position: "relative", zIndex: 10, minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "80px 6vw 60px",
        gap: "6vw",
      }}>
        {/* Left: Story */}
        <div style={{ flex: "0 0 50%", maxWidth: "50%" }}>
          <p className="font-pixel" style={{ fontSize: 9, color: "#0066ff", letterSpacing: "0.4em", marginBottom: 24, opacity: 0.9 }}>
            [ OUR STORY ]
          </p>
          <h1 className="font-pixel" style={{ fontSize: "clamp(36px, 6vw, 90px)", lineHeight: 1.05, marginBottom: 32 }}>
            BORN IN<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>THE</span><br />
            MOUNTAINS.
          </h1>
          <div style={{ width: 50, height: 2, background: "#0066ff", marginBottom: 28 }} />
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.9,
            color: "rgba(255,255,255,0.55)", maxWidth: 500, marginBottom: 24,
          }}>
            Shoe World started as a small shop in the heart of Pithoragarh — a hill town perched at the edge of the great Himalayan ranges in Uttarakhand.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.9,
            color: "rgba(255,255,255,0.45)", maxWidth: 500, marginBottom: 36,
          }}>
            Founded by a family of trekkers who understood what it means to need reliable footwear on steep mountain paths and rocky riverbeds — we set out to bring the best footwear in the world to the people of Kumaon and beyond.
          </p>
          <blockquote style={{
            borderLeft: "2px solid rgba(0,100,255,0.4)", paddingLeft: 20,
            fontFamily: "'Inter', sans-serif", fontStyle: "italic",
            fontSize: 14, color: "rgba(0,150,255,0.8)", lineHeight: 1.8, marginBottom: 40,
          }}>
            "पहाड़ की ऊँचाइयाँ हमें सिखाती हैं — हर कदम मजबूती से।"<br />
            <span style={{ fontSize: 12, opacity: 0.6 }}>The mountains teach us — every step, with strength.</span>
          </blockquote>
          <div style={{ display: "flex", gap: 48 }}>
            {[["2018", "Founded"], ["500+", "Styles"], ["5000+", "Customers"]].map(([num, label]) => (
              <div key={label}>
                <div className="font-pixel" style={{ fontSize: 28, color: "#fff" }}>{num}</div>
                <div className="font-pixel" style={{ fontSize: 8, color: "#0066ff", marginTop: 4, letterSpacing: "0.2em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mountain SVG + visual */}
        <div style={{ flex: 1, position: "relative", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Mountain illustration */}
          <svg viewBox="0 0 500 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }}>
            <defs>
              <linearGradient id="mtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0066ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#001133" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points="250,30 310,160 350,120 420,280 80,280 150,100 190,160" fill="url(#mtGrad)" />
            <polygon points="250,30 255,50 245,50" fill="rgba(255,255,255,0.6)" />
          </svg>
          {/* Shoe image */}
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <Image src="/shoe-boot.png" alt="Himalayan Boot" width={480} height={380}
              style={{ width: "80%", height: "auto", objectFit: "contain", filter: "drop-shadow(0 0 60px rgba(0,100,255,0.4))" }} />
            {/* Location pin */}
            <div style={{
              position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
              background: "rgba(0,50,150,0.7)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,100,255,0.3)", borderRadius: 20, padding: "10px 20px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0066ff" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#fff", letterSpacing: "0.05em" }}>
                Pithoragarh, Uttarakhand — 262501
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ position: "relative", zIndex: 10, padding: "80px 6vw", background: "rgba(0,0,0,0.3)" }}>
        <p className="font-pixel" style={{ fontSize: 9, color: "#ff003c", letterSpacing: "0.4em", marginBottom: 16, opacity: 0.8 }}>[ OUR JOURNEY ]</p>
        <h2 className="font-pixel" style={{ fontSize: "clamp(24px, 4vw, 52px)", marginBottom: 60, lineHeight: 1.1 }}>
          FROM THE HILLS<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>TO YOUR FEET.</span>
        </h2>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "8vw", top: 0, bottom: 0, width: 1,
            background: "linear-gradient(180deg, transparent 0%, rgba(255,0,60,0.4) 20%, rgba(0,100,255,0.4) 80%, transparent 100%)",
          }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "4vw", alignItems: "flex-start", paddingLeft: "2vw" }}>
                <div style={{
                  flex: "0 0 6vw", textAlign: "right",
                  fontFamily: "'Press Start 2P', monospace", fontSize: 11,
                  color: i % 2 === 0 ? "#ff003c" : "#0066ff", paddingTop: 4,
                }}>
                  {item.year}
                </div>
                {/* Dot */}
                <div style={{
                  flex: "0 0 16px", width: 16, height: 16, borderRadius: "50%",
                  background: i % 2 === 0 ? "#ff003c" : "#0066ff",
                  boxShadow: `0 0 12px ${i % 2 === 0 ? "rgba(255,0,60,0.5)" : "rgba(0,100,255,0.5)"}`,
                  marginTop: 2,
                }} />
                <div style={{ flex: 1 }}>
                  <p className="font-pixel" style={{ fontSize: 10, color: "#fff", marginBottom: 10, letterSpacing: "0.1em" }}>{item.event}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 500 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ position: "relative", zIndex: 10, padding: "80px 6vw" }}>
        <p className="font-pixel" style={{ fontSize: 9, color: "#00cc55", letterSpacing: "0.4em", marginBottom: 16, opacity: 0.8 }}>[ WHAT WE STAND FOR ]</p>
        <h2 className="font-pixel" style={{ fontSize: "clamp(24px, 4vw, 52px)", marginBottom: 50, lineHeight: 1.1 }}>
          OUR<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>VALUES.</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{
              background: "rgba(14,14,20,0.9)", border: `1px solid ${v.color}22`,
              borderRadius: 24, padding: "36px 28px",
              borderTop: `3px solid ${v.color}`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 20 }}>{v.icon}</div>
              <p className="font-pixel" style={{ fontSize: 10, color: v.color, letterSpacing: "0.2em", marginBottom: 16 }}>{v.title}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: "relative", zIndex: 10, padding: "80px 6vw 160px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p className="font-pixel" style={{ fontSize: 9, color: "#ff003c", letterSpacing: "0.4em", marginBottom: 20, opacity: 0.7 }}>[ COME VISIT US ]</p>
        <h2 className="font-pixel" style={{ fontSize: "clamp(24px, 4vw, 52px)", marginBottom: 20, lineHeight: 1.1 }}>
          EXPERIENCE IT<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>IN PERSON.</span>
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)",
          maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.8,
        }}>
          Visit our store in Pithoragarh and try on 500+ styles. Our team will help you find the perfect pair for your terrain.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <Link href="/contact" className="font-pixel" style={{
            display: "inline-block", padding: "14px 32px", background: "#ff003c", borderRadius: 30,
            color: "#fff", textDecoration: "none", fontSize: 9, letterSpacing: "0.15em",
          }}>FIND OUR STORE →</Link>
          <Link href="/collection" className="font-pixel" style={{
            display: "inline-block", padding: "14px 32px",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30,
            color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 9, letterSpacing: "0.15em",
          }}>VIEW COLLECTION</Link>
        </div>
      </section>

      <Navbar />
    </div>
  );
}
