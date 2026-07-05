"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Shared Navbar ── */
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
      <Link href="/collection" className="font-pixel" style={{ color: "#F0EDE8", textDecoration: "none", fontSize: 10 }}>COLLECTION</Link>
      <Link href="/about" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>ABOUT</Link>
      <Link href="/contact" className="font-pixel" style={{ color: "rgba(240,237,232,0.45)", textDecoration: "none", fontSize: 10 }}>CONTACT</Link>
      <Link href="/contact" className="font-pixel" style={{ background: "#F0EDE8", color: "#000", textDecoration: "none", padding: "10px 20px", borderRadius: 30, fontSize: 10 }}>VISIT STORE +</Link>
    </nav>
  );
}

/* ── Product Data ── */
type Product = { id: number; name: string; price: string; oldPrice?: string; badge?: string; img: string; category: string; color: string; glow: string; };
const PRODUCTS: Product[] = [
  // BOOTS
  { id: 1, name: "Himalayan Trek Pro", price: "₹4,299", oldPrice: "₹5,499", badge: "BESTSELLER", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.35)" },
  { id: 2, name: "Summit Ridge Boot", price: "₹3,799", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.3)" },
  { id: 3, name: "Kumaon Trail Boot", price: "₹5,199", badge: "NEW", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.3)" },
  // SPORTS
  { id: 4, name: "Pahadi Sprint X1", price: "₹2,999", badge: "HOT", img: "/shoe-sports-orange.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.35)" },
  { id: 5, name: "Altitude Runner", price: "₹3,499", oldPrice: "₹4,299", img: "/shoe-sports-orange.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.3)" },
  { id: 6, name: "Valley Stride Pro", price: "₹2,599", img: "/shoe-sports.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.3)" },
  // SANDALS
  { id: 7, name: "Ghat Breeze Sandal", price: "₹1,299", badge: "SUMMER", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.35)" },
  { id: 8, name: "Munsiyari Comfort", price: "₹1,599", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.3)" },
  { id: 9, name: "River Trek Sandal", price: "₹999", oldPrice: "₹1,499", badge: "SALE", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.3)" },
  // LOAFERS
  { id: 10, name: "Pithoragarh Classic", price: "₹3,299", badge: "PREMIUM", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.35)" },
  { id: 11, name: "Oxford Formal", price: "₹2,999", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.3)" },
  { id: 12, name: "Urban Slip-On", price: "₹2,499", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.3)" },
  // SNEAKERS
  { id: 13, name: "Street Legend Air", price: "₹4,799", badge: "ICONIC", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.35)" },
  { id: 14, name: "Block High-Top", price: "₹3,999", oldPrice: "₹5,199", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)" },
  { id: 15, name: "Culture Core", price: "₹3,499", badge: "NEW", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)" },
  // CASUAL
  { id: 16, name: "Nubuck Daily Walk", price: "₹2,799", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.35)" },
  { id: 17, name: "Red Chief Classic", price: "₹3,199", badge: "BESTSELLER", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.3)" },
  { id: 18, name: "Village Square", price: "₹1,999", oldPrice: "₹2,799", badge: "SALE", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.3)" },
  // CROCS
  { id: 19, name: "Valley Clog OG", price: "₹1,499", badge: "SUMMER", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.35)" },
  { id: 20, name: "Waterproof Terrain", price: "₹1,799", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.3)" },
  { id: 21, name: "Stream Clog Pro", price: "₹1,299", oldPrice: "₹1,999", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.3)" },
];

const CATEGORIES = ["All", "Boots", "Sports", "Sandals", "Loafers", "Sneakers", "Casual", "Crocs"];
const CATEGORY_COLORS: Record<string, string> = {
  All: "#ff003c", Boots: "#ff003c", Sports: "#ffa500", Sandals: "#00cc55",
  Loafers: "#c8860a", Sneakers: "#ff3c3c", Casual: "#c8860a", Crocs: "#7ab648",
};

function ProductCard({ p }: { p: Product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(20,20,28,0.98)" : "rgba(14,14,20,0.95)",
        border: hovered ? `1px solid ${p.color}55` : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: "20px 16px 16px",
        display: "flex", flexDirection: "column", alignItems: "center",
        cursor: "pointer", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${p.glow}` : "0 4px 16px rgba(0,0,0,0.3)",
        position: "relative",
      }}
    >
      {p.badge && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 3,
          background: p.badge === "SALE" ? "#ff003c" : p.badge === "NEW" ? "#0066ff" : p.badge === "BESTSELLER" ? "#c8860a" : "rgba(255,255,255,0.15)",
          borderRadius: 6, padding: "3px 8px",
          fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#fff", letterSpacing: "0.1em",
        }}>
          {p.badge}
        </div>
      )}
      <div style={{ width: "100%", height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at center, ${p.glow} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s",
        }} />
        <Image src={p.img} alt={p.name} width={240} height={160}
          style={{ width: "85%", height: "auto", objectFit: "contain", filter: `drop-shadow(0 0 20px ${p.glow})`, position: "relative", zIndex: 2 }} />
      </div>
      <div style={{ width: "100%", textAlign: "left" }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: p.color, letterSpacing: "0.15em", marginBottom: 6 }}>
          {p.category.toUpperCase()}
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#fff", fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#fff", fontWeight: 700 }}>{p.price}</span>
          {p.oldPrice && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{p.oldPrice}</span>}
        </div>
        <button style={{
          width: "100%", padding: "10px 0",
          background: hovered ? p.color : "transparent",
          border: `1px solid ${hovered ? p.color : "rgba(255,255,255,0.15)"}`,
          borderRadius: 30, color: "#fff", cursor: "pointer",
          fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: "0.12em",
          transition: "all 0.25s ease",
        }}>
          {hovered ? "ADD TO CART" : "SHOP NOW →"}
        </button>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const accentColor = CATEGORY_COLORS[activeCategory] || "#ff003c";

  return (
    <div style={{ minHeight: "100vh", background: "#050005", color: "#fff" }}>
      {/* Cinematic top glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 300, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 30% 0%, ${accentColor}18 0%, transparent 60%)`,
        transition: "background 0.6s ease",
      }} />

      {/* Page Header */}
      <header style={{ position: "relative", zIndex: 10, padding: "60px 6vw 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
          <div>
            <p className="font-pixel" style={{ fontSize: 9, color: accentColor, letterSpacing: "0.4em", marginBottom: 16, opacity: 0.8 }}>
              [ SHOE WORLD STORE ]
            </p>
            <h1 className="font-pixel" style={{ fontSize: "clamp(28px, 5vw, 64px)", lineHeight: 1.05, color: "#fff" }}>
              THE<br /><span style={{ color: accentColor }}>COLLECTION</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>SORT BY</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: "8px 16px", color: "#fff", fontSize: 11,
                fontFamily: "'Inter', sans-serif", cursor: "pointer", outline: "none",
              }}
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="new">Newest First</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            const catColor = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 22px",
                  background: isActive ? catColor : "rgba(255,255,255,0.04)",
                  border: isActive ? `1px solid ${catColor}` : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 30, color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  cursor: "pointer", fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  letterSpacing: "0.1em", transition: "all 0.2s ease",
                }}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", alignSelf: "center", marginLeft: 8 }}>
            {filtered.length} styles
          </span>
        </div>
      </header>

      {/* Product Grid */}
      <main style={{ position: "relative", zIndex: 10, padding: "0 6vw 160px" }}>
        {/* Category intro strip */}
        {activeCategory !== "All" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 20, marginBottom: 32,
            borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24,
          }}>
            <div style={{ width: 40, height: 2, background: accentColor }} />
            <p className="font-pixel" style={{ fontSize: 9, color: accentColor, letterSpacing: "0.3em" }}>
              {activeCategory.toUpperCase()} — PITHORAGARH COLLECTION
            </p>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 20,
        }}>
          {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>

        {/* Load more teaser */}
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <p className="font-pixel" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.3em", marginBottom: 20 }}>
            — VISIT OUR STORE FOR 500+ MORE STYLES —
          </p>
          <Link href="/contact" className="font-pixel" style={{
            display: "inline-block", padding: "14px 36px",
            background: "#ff003c", borderRadius: 30,
            color: "#fff", textDecoration: "none", fontSize: 9, letterSpacing: "0.15em",
          }}>
            FIND OUR STORE →
          </Link>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
