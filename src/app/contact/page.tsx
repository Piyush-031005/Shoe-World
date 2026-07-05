"use client";
import { useState } from "react";
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
      <Link href="/about" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>ABOUT</Link>
      <Link href="/contact" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>CONTACT</Link>
      <Link href="/contact" className="font-pixel" style={{ background: "#F0EDE8", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 30, fontSize: 10 }}>VISIT STORE +</Link>
    </nav>
  );
}

const INFO_ITEMS = [
  { label: "ADDRESS", value: "Main Market Road, Pithoragarh\nUttarakhand — 262501, India", icon: "📍", color: "#ff003c" },
  { label: "PHONE", value: "+91 98765 43210\n+91 96789 01234", icon: "📞", color: "#0066ff" },
  { label: "HOURS", value: "Mon–Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 6:00 PM", icon: "🕐", color: "#00cc55" },
  { label: "EMAIL", value: "hello@shoeworld.in\nsupport@shoeworld.in", icon: "✉️", color: "#c8860a" },
];

const SOCIALS = [
  { name: "Instagram", handle: "@shoeworld_pithoragarh", color: "#c850c0", href: "#" },
  { name: "Facebook", handle: "Shoe World Pithoragarh", color: "#4267B2", href: "#" },
  { name: "WhatsApp", handle: "+91 98765 43210", color: "#25D366", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = (field: string) => ({
    width: "100%", padding: "14px 18px",
    background: focused === field ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === field ? "rgba(255,0,60,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 12, color: "#fff", fontSize: 14,
    fontFamily: "'Inter', sans-serif", outline: "none",
    transition: "all 0.2s ease", boxSizing: "border-box" as const,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#050005", color: "#fff" }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 400, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 0%, rgba(255,0,60,0.08) 0%, transparent 60%)",
      }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, padding: "60px 6vw 50px" }}>
        <p className="font-pixel" style={{ fontSize: 9, color: "#ff003c", letterSpacing: "0.4em", marginBottom: 20, opacity: 0.8 }}>
          [ GET IN TOUCH ]
        </p>
        <h1 className="font-pixel" style={{ fontSize: "clamp(32px, 6vw, 80px)", lineHeight: 1.05, marginBottom: 20 }}>
          REACH<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>US.</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)",
          maxWidth: 480, lineHeight: 1.8,
        }}>
          Visit us in Pithoragarh or send us a message — we&apos;d love to help you find your perfect pair.
        </p>
      </header>

      {/* Main two-column */}
      <main style={{ position: "relative", zIndex: 10, padding: "0 6vw 160px", display: "flex", gap: "5vw", alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* LEFT: Store Info */}
        <div style={{ flex: "0 0 420px", minWidth: 300 }}>
          {/* Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            {INFO_ITEMS.map((item, i) => (
              <div key={i} style={{
                background: "rgba(14,14,20,0.95)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "20px 22px",
                borderLeft: `3px solid ${item.color}`,
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                <div>
                  <p className="font-pixel" style={{ fontSize: 8, color: item.color, letterSpacing: "0.2em", marginBottom: 8 }}>{item.label}</p>
                  {item.value.split("\n").map((line, j) => (
                    <p key={j} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div style={{
            background: "rgba(0,20,60,0.4)", border: "1px solid rgba(0,100,255,0.2)",
            borderRadius: 20, height: 200, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", position: "relative",
            overflow: "hidden", marginBottom: 28,
          }}>
            {/* Mountain SVG mini */}
            <svg viewBox="0 0 400 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              <polygon points="200,20 280,120 340,80 400,180 0,180 60,80 120,140 180,60" fill="#0066ff" />
            </svg>
            <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff003c", margin: "0 auto 12px", boxShadow: "0 0 20px rgba(255,0,60,0.6)" }} />
              <p className="font-pixel" style={{ fontSize: 8, color: "#fff", letterSpacing: "0.15em", marginBottom: 6 }}>PITHORAGARH</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Uttarakhand, India — 6,000m Range</p>
            </div>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer"
              style={{
                position: "absolute", bottom: 14, right: 14,
                background: "rgba(0,100,255,0.2)", border: "1px solid rgba(0,100,255,0.3)",
                borderRadius: 20, padding: "6px 14px",
                fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#0066ff",
                textDecoration: "none", letterSpacing: "0.1em",
              }}
            >OPEN MAP →</a>
          </div>

          {/* Social links */}
          <p className="font-pixel" style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", marginBottom: 16 }}>FOLLOW US</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SOCIALS.map((s, i) => (
              <a key={i} href={s.href} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(14,14,20,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "12px 16px", textDecoration: "none",
                transition: "border-color 0.2s",
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <div>
                  <p className="font-pixel" style={{ fontSize: 8, color: s.color, marginBottom: 3 }}>{s.name}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <div style={{
            background: "rgba(14,14,20,0.95)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 24, padding: "40px 36px",
          }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 24 }}>✅</div>
                <p className="font-pixel" style={{ fontSize: 12, color: "#00cc55", letterSpacing: "0.2em", marginBottom: 16 }}>MESSAGE SENT!</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.<br />
                  Our team is based in Pithoragarh — we love hearing from you.
                </p>
                <button onClick={() => setSubmitted(false)} className="font-pixel" style={{
                  marginTop: 32, padding: "12px 28px", background: "#ff003c",
                  border: "none", borderRadius: 30, color: "#fff", fontSize: 9,
                  cursor: "pointer", letterSpacing: "0.15em",
                }}>SEND ANOTHER →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="font-pixel" style={{ fontSize: 9, color: "#ff003c", letterSpacing: "0.3em", marginBottom: 28 }}>[ SEND A MESSAGE ]</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.1em" }}>NAME</label>
                    <input
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                      style={inputStyle("name")} placeholder="Your name" required
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.1em" }}>EMAIL</label>
                    <input
                      type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      style={inputStyle("email")} placeholder="your@email.com" required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.1em" }}>SUBJECT</label>
                  <input
                    value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                    style={inputStyle("subject")} placeholder="What's this about?" required
                  />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.1em" }}>MESSAGE</label>
                  <textarea
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle("message"), height: 160, resize: "none" } as React.CSSProperties}
                    placeholder="Tell us what you're looking for…"
                    required
                  />
                </div>

                <button type="submit" className="font-pixel" style={{
                  width: "100%", padding: "16px 0", background: "#ff003c",
                  border: "none", borderRadius: 30, color: "#fff", fontSize: 9,
                  cursor: "pointer", letterSpacing: "0.15em",
                }}>
                  SEND MESSAGE →
                </button>

                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)",
                  textAlign: "center", marginTop: 16, lineHeight: 1.6,
                }}>
                  We reply within 24 hours · Pithoragarh, Uttarakhand
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
