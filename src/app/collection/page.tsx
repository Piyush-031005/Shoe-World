"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Navbar ── */
function Navbar() {
  return (
    <nav style={{
      position: "fixed", bottom: "5%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
      background: "rgba(10,10,15,0.75)", backdropFilter: "blur(20px)",
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

/* ── Types ── */
type Product = {
  id: number; name: string; price: string; oldPrice?: string;
  badge?: string; badgeColor?: string;
  img: string; category: string; color: string; glow: string;
  rating: number; reviews: number;
  sizes: number[];
  tags: string[];
};

/* ── Product Data ── */
const PRODUCTS: Product[] = [
  // BOOTS
  { id: 1, name: "Himalayan Trek Pro", price: "₹4,299", oldPrice: "₹5,499", badge: "BESTSELLER", badgeColor: "#c8860a", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.35)", rating: 4.8, reviews: 142, sizes: [6,7,8,9,10,11], tags: ["Waterproof", "High Ankle"] },
  { id: 2, name: "Summit Ridge Boot", price: "₹3,799", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.3)", rating: 4.5, reviews: 88, sizes: [7,8,9,10,11], tags: ["Lace-up", "Rugged Sole"] },
  { id: 3, name: "Kumaon Trail Boot", price: "₹5,199", badge: "NEW", badgeColor: "#0066ff", img: "/shoe-boot.png", category: "Boots", color: "#ff003c", glow: "rgba(255,0,60,0.3)", rating: 4.9, reviews: 31, sizes: [6,7,8,9,10], tags: ["Leather", "All-Terrain"] },
  // SPORTS
  { id: 4, name: "Pahadi Sprint X1", price: "₹2,999", badge: "HOT", badgeColor: "#ff003c", img: "/shoe-sports-orange.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.35)", rating: 4.7, reviews: 203, sizes: [6,7,8,9,10,11,12], tags: ["Mesh Upper", "Cushioned"] },
  { id: 5, name: "Altitude Runner", price: "₹3,499", oldPrice: "₹4,299", img: "/shoe-sports-orange.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.3)", rating: 4.4, reviews: 76, sizes: [7,8,9,10,11], tags: ["Lightweight", "Trail"] },
  { id: 6, name: "Valley Stride Pro", price: "₹2,599", img: "/shoe-sports.png", category: "Sports", color: "#ffa500", glow: "rgba(255,130,0,0.3)", rating: 4.2, reviews: 55, sizes: [6,7,8,9,10], tags: ["Anti-Slip", "EVA Sole"] },
  // SANDALS
  { id: 7, name: "Ghat Breeze Sandal", price: "₹1,299", badge: "SUMMER", badgeColor: "#00aa44", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.35)", rating: 4.6, reviews: 119, sizes: [6,7,8,9,10], tags: ["Open Toe", "Breathable"] },
  { id: 8, name: "Munsiyari Comfort", price: "₹1,599", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.3)", rating: 4.3, reviews: 67, sizes: [7,8,9,10,11], tags: ["Buckle Strap", "Leather"] },
  { id: 9, name: "River Trek Sandal", price: "₹999", oldPrice: "₹1,499", badge: "SALE", badgeColor: "#ff003c", img: "/shoe-sandal.png", category: "Sandals", color: "#00cc55", glow: "rgba(0,200,80,0.3)", rating: 4.1, reviews: 44, sizes: [6,7,8,9,10,11], tags: ["Waterproof", "Casual"] },
  // LOAFERS
  { id: 10, name: "Pithoragarh Classic", price: "₹3,299", badge: "PREMIUM", badgeColor: "#c8860a", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.35)", rating: 4.9, reviews: 98, sizes: [7,8,9,10,11], tags: ["Suede", "Tassel"] },
  { id: 11, name: "Oxford Formal", price: "₹2,999", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.3)", rating: 4.5, reviews: 72, sizes: [6,7,8,9,10], tags: ["Leather", "Formal"] },
  { id: 12, name: "Urban Slip-On", price: "₹2,499", img: "/shoe-loafer.png", category: "Loafers", color: "#c8860a", glow: "rgba(200,130,10,0.3)", rating: 4.3, reviews: 51, sizes: [7,8,9,10,11], tags: ["Slip-On", "Casual-Formal"] },
  // SNEAKERS
  { id: 13, name: "Street Legend Air", price: "₹4,799", badge: "ICONIC", badgeColor: "#8800ff", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.35)", rating: 4.9, reviews: 267, sizes: [6,7,8,9,10,11,12], tags: ["High-Top", "Black/Red/White"] },
  { id: 14, name: "Block High-Top", price: "₹3,999", oldPrice: "₹5,199", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)", rating: 4.6, reviews: 134, sizes: [7,8,9,10,11], tags: ["Leather", "Street"] },
  { id: 15, name: "Culture Core", price: "₹3,499", badge: "NEW", badgeColor: "#0066ff", img: "/shoe-sneaker.png", category: "Sneakers", color: "#ff3c3c", glow: "rgba(255,60,60,0.3)", rating: 4.7, reviews: 49, sizes: [6,7,8,9,10,11], tags: ["Canvas", "Street"] },
  // CASUAL
  { id: 16, name: "Nubuck Daily Walk", price: "₹2,799", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.35)", rating: 4.4, reviews: 88, sizes: [7,8,9,10,11], tags: ["Nubuck Leather", "Everyday"] },
  { id: 17, name: "Red Chief Classic", price: "₹3,199", badge: "BESTSELLER", badgeColor: "#c8860a", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.3)", rating: 4.7, reviews: 156, sizes: [6,7,8,9,10,11], tags: ["Classic Tan", "Leather"] },
  { id: 18, name: "Village Square", price: "₹1,999", oldPrice: "₹2,799", badge: "SALE", badgeColor: "#ff003c", img: "/shoe-casual.png", category: "Casual", color: "#c8860a", glow: "rgba(200,130,10,0.3)", rating: 4.2, reviews: 63, sizes: [7,8,9,10], tags: ["Casual", "Light"] },
  // CROCS
  { id: 19, name: "Valley Clog OG", price: "₹1,499", badge: "SUMMER", badgeColor: "#00aa44", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.35)", rating: 4.5, reviews: 93, sizes: [6,7,8,9,10,11], tags: ["Waterproof", "Lightweight"] },
  { id: 20, name: "Waterproof Terrain", price: "₹1,799", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.3)", rating: 4.3, reviews: 47, sizes: [7,8,9,10,11], tags: ["All-Weather", "Vented"] },
  { id: 21, name: "Stream Clog Pro", price: "₹1,299", oldPrice: "₹1,999", img: "/shoe-crocs.png", category: "Crocs", color: "#7ab648", glow: "rgba(120,180,70,0.3)", rating: 4.1, reviews: 38, sizes: [6,7,8,9,10], tags: ["Stream", "Lightweight"] },
];

const CATEGORIES = ["All", "Boots", "Sports", "Sandals", "Loafers", "Sneakers", "Casual", "Crocs"];
const CATEGORY_COLORS: Record<string, string> = {
  All: "#ff003c", Boots: "#ff003c", Sports: "#ffa500", Sandals: "#00cc55",
  Loafers: "#c8860a", Sneakers: "#ff3c3c", Casual: "#c8860a", Crocs: "#7ab648",
};

/* ── Star Rating ── */
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#ffd700" : "none"} stroke="#ffd700" strokeWidth="2">
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
        </svg>
      ))}
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>{rating} ({p => p})</span>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ p, wishlist, toggleWishlist, addToCart }: {
  p: Product;
  wishlist: Set<number>;
  toggleWishlist: (id: number) => void;
  addToCart: (p: Product, size: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selectedSize) return;
    addToCart(p, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWishlisted = wishlist.has(p.id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(20,20,28,0.99)" : "rgba(12,12,18,0.95)",
        border: hovered ? `1px solid ${p.color}44` : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20, padding: "0 0 16px",
        display: "flex", flexDirection: "column",
        cursor: "pointer", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 50px ${p.glow}` : "0 4px 16px rgba(0,0,0,0.4)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Badge */}
      {p.badge && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 4,
          background: p.badgeColor || "#333",
          borderRadius: 6, padding: "3px 9px",
          fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "#fff", letterSpacing: "0.1em",
        }}>{p.badge}</div>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 4,
          background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50%", width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.2s",
          color: isWishlisted ? "#ff003c" : "rgba(255,255,255,0.4)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? "#ff003c" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {/* Image area */}
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "20px 20px 0 0", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at center, ${p.glow} 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0.5, transition: "opacity 0.35s",
        }} />
        <Image src={p.img} alt={p.name} width={260} height={180}
          style={{
            width: "82%", height: "auto", objectFit: "contain",
            filter: `drop-shadow(0 4px 20px ${p.glow})`,
            position: "relative", zIndex: 2,
            transform: hovered ? "scale(1.08) rotate(-3deg)" : "scale(1)",
            transition: "transform 0.5s ease",
          }} />
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 0" }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: p.color, letterSpacing: "0.15em", marginBottom: 6 }}>
          {p.category.toUpperCase()}
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#fff", fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</p>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 1 }}>
            {[1,2,3,4,5].map((s) => (
              <svg key={s} width="9" height="9" viewBox="0 0 24 24" fill={s <= Math.round(p.rating) ? "#ffd700" : "none"} stroke="#ffd700" strokeWidth="2">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
              </svg>
            ))}
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{p.rating} ({p.reviews})</span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
          {p.tags.slice(0,2).map((tag) => (
            <span key={tag} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "2px 8px",
            }}>{tag}</span>
          ))}
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#fff", fontWeight: 700 }}>{p.price}</span>
          {p.oldPrice && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.28)", textDecoration: "line-through" }}>{p.oldPrice}</span>}
          {p.oldPrice && (
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#ff003c",
              background: "rgba(255,0,60,0.12)", borderRadius: 4, padding: "1px 5px",
            }}>
              {Math.round((1 - parseInt(p.price.replace(/[^0-9]/g,"")) / parseInt(p.oldPrice.replace(/[^0-9]/g,""))) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Size Selector */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: "0.1em" }}>
            SIZE (UK) {selectedSize ? `— UK ${selectedSize}` : "— Select"}
          </p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {p.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz === selectedSize ? null : sz)}
                style={{
                  width: 32, height: 28,
                  background: selectedSize === sz ? p.color : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedSize === sz ? p.color : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 6, color: selectedSize === sz ? "#fff" : "rgba(255,255,255,0.5)",
                  fontFamily: "'Inter', sans-serif", fontSize: 10, cursor: "pointer",
                  transition: "all 0.18s ease", fontWeight: 600,
                }}
              >{sz}</button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={!selectedSize}
          style={{
            width: "100%", padding: "10px 0",
            background: added ? "#00cc55" : (selectedSize ? p.color : "rgba(255,255,255,0.04)"),
            border: `1px solid ${added ? "#00cc55" : (selectedSize ? p.color : "rgba(255,255,255,0.1)")}`,
            borderRadius: 30, color: selectedSize ? "#fff" : "rgba(255,255,255,0.25)",
            cursor: selectedSize ? "pointer" : "not-allowed",
            fontFamily: "'Press Start 2P', monospace", fontSize: 7.5, letterSpacing: "0.12em",
            transition: "all 0.25s ease",
          }}
        >
          {added ? "✓ ADDED TO CART" : selectedSize ? "ADD TO CART →" : "SELECT SIZE FIRST"}
        </button>
      </div>
    </div>
  );
}

/* ── Cart Drawer ── */
function CartDrawer({ cart, onClose }: { cart: {product: Product; size: number; qty: number}[]; onClose: () => void }) {
  const total = cart.reduce((sum, item) => sum + parseInt(item.product.price.replace(/[^0-9]/g, "")) * item.qty, 0);
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380, zIndex: 200,
      background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)",
      borderLeft: "1px solid rgba(255,255,255,0.08)", padding: "30px 24px",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <p className="font-pixel" style={{ fontSize: 10, color: "#fff", letterSpacing: "0.2em" }}>CART ({cart.length})</p>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 20 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 80, color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👟</div>
            <p className="font-pixel" style={{ fontSize: 8, letterSpacing: "0.2em" }}>YOUR CART IS EMPTY</p>
          </div>
        ) : cart.map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "12px 14px",
            background: "rgba(255,255,255,0.03)", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <Image src={item.product.img} alt={item.product.name} width={60} height={50}
              style={{ width: 60, height: 50, objectFit: "contain", filter: `drop-shadow(0 0 8px ${item.product.glow})` }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 3 }}>{item.product.name}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>UK {item.size} · Qty {item.qty}</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: item.product.color, fontWeight: 700, marginTop: 4 }}>{item.product.price}</p>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Total</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <Link href="/contact" className="font-pixel" style={{
            display: "block", textAlign: "center", padding: "14px 0",
            background: "#ff003c", borderRadius: 30, color: "#fff",
            textDecoration: "none", fontSize: 9, letterSpacing: "0.15em",
          }}>CHECKOUT → VISIT STORE</Link>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 10 }}>
            Pay in store at Pithoragarh
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Trust Badges ── */
function TrustBadges() {
  const badges = [
    { icon: "🚚", title: "Free Delivery", sub: "Within Pithoragarh" },
    { icon: "↩", title: "7-Day Return", sub: "Easy exchanges" },
    { icon: "🛡", title: "Genuine Only", sub: "100% authentic brands" },
    { icon: "📞", title: "Expert Help", sub: "In-store assistance" },
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1,
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      marginBottom: 40,
    }}>
      {badges.map((b, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
          background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
        }}>
          <span style={{ fontSize: 20 }}>{b.icon}</span>
          <div>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7.5, color: "#fff", marginBottom: 3 }}>{b.title}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [cart, setCart] = useState<{product: Product; size: number; qty: number}[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addToCart = (p: Product, size: number) => {
    setCart((prev) => {
      const exists = prev.findIndex((i) => i.product.id === p.id && i.size === size);
      if (exists >= 0) {
        const next = [...prev];
        next[exists].qty += 1;
        return next;
      }
      return [...prev, { product: p, size, qty: 1 }];
    });
    setCartOpen(true);
  };

  const accentColor = CATEGORY_COLORS[activeCategory] || "#ff003c";

  let filtered = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
  if (sortBy === "price-asc") filtered = [...filtered].sort((a,b) => parseInt(a.price.replace(/[^0-9]/g,"")) - parseInt(b.price.replace(/[^0-9]/g,"")));
  if (sortBy === "price-desc") filtered = [...filtered].sort((a,b) => parseInt(b.price.replace(/[^0-9]/g,"")) - parseInt(a.price.replace(/[^0-9]/g,"")));
  if (sortBy === "rating") filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  return (
    <div style={{ minHeight: "100vh", background: "#050005", color: "#fff" }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 320, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 30% 0%, ${accentColor}14 0%, transparent 65%)`,
        transition: "background 0.6s ease",
      }} />

      {/* Cart Drawer Overlay */}
      {cartOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199 }} onClick={() => setCartOpen(false)} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />}

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, padding: "60px 6vw 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <p className="font-pixel" style={{ fontSize: 8, color: accentColor, letterSpacing: "0.4em", marginBottom: 14, opacity: 0.85, transition: "color 0.4s" }}>
              [ SHOE WORLD · PITHORAGARH ]
            </p>
            <h1 className="font-pixel" style={{ fontSize: "clamp(28px, 5vw, 60px)", lineHeight: 1.05, color: "#fff" }}>
              THE<br /><span style={{ color: accentColor, transition: "color 0.4s" }}>COLLECTION</span>
            </h1>
          </div>

          {/* Top-right: wishlist + cart */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 30, padding: "8px 16px",
            }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>SORT</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                background: "transparent", border: "none", color: "#fff", fontSize: 11,
                fontFamily: "'Inter', sans-serif", cursor: "pointer", outline: "none",
              }}>
                <option value="popular" style={{ background: "#0a0a0a" }}>Popular</option>
                <option value="price-asc" style={{ background: "#0a0a0a" }}>Price ↑</option>
                <option value="price-desc" style={{ background: "#0a0a0a" }}>Price ↓</option>
                <option value="rating" style={{ background: "#0a0a0a" }}>Top Rated</option>
              </select>
            </div>

            {/* Wishlist button */}
            <button onClick={() => {}} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.2)",
              borderRadius: 30, padding: "8px 16px", cursor: "pointer", color: "#ff003c",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ff003c" stroke="#ff003c" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="font-pixel" style={{ fontSize: 7 }}>{wishlist.size}</span>
            </button>

            {/* Cart button */}
            <button onClick={() => setCartOpen(true)} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: cart.length > 0 ? "#ff003c" : "rgba(255,255,255,0.04)",
              border: `1px solid ${cart.length > 0 ? "#ff003c" : "rgba(255,255,255,0.1)"}`,
              borderRadius: 30, padding: "8px 18px", cursor: "pointer", color: "#fff",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 10a4 4 0 0 1-8 0M3.103 6.034h17.794M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
              </svg>
              <span className="font-pixel" style={{ fontSize: 7 }}>CART {cart.length > 0 ? `(${cart.length})` : ""}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            const catColor = CATEGORY_COLORS[cat];
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: "9px 20px",
                background: isActive ? catColor : "rgba(255,255,255,0.03)",
                border: isActive ? `1px solid ${catColor}` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 30, color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                cursor: "pointer", fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                letterSpacing: "0.1em", transition: "all 0.2s ease",
                boxShadow: isActive ? `0 4px 20px ${catColor}40` : "none",
              }}>
                {cat.toUpperCase()}
              </button>
            );
          })}
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 4 }}>
            {filtered.length} styles
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{ position: "relative", zIndex: 10, padding: "0 6vw 160px" }}>
        <TrustBadges />

        {activeCategory !== "All" && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 20 }}>
            <div style={{ width: 36, height: 2, background: accentColor }} />
            <p className="font-pixel" style={{ fontSize: 8, color: accentColor, letterSpacing: "0.25em" }}>
              {activeCategory.toUpperCase()} — PITHORAGARH COLLECTION
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />
          ))}
        </div>

        {/* Store CTA */}
        <div style={{ textAlign: "center", marginTop: 70, padding: "50px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="font-pixel" style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.3em", marginBottom: 18 }}>
            — 500+ MORE STYLES IN STORE —
          </p>
          <h3 className="font-pixel" style={{ fontSize: "clamp(18px, 3vw, 36px)", color: "#fff", marginBottom: 14, lineHeight: 1.2 }}>
            CAN&apos;T FIND<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>YOUR SIZE?</span>
          </h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
            Visit our store in Pithoragarh — we carry every size, every style.
          </p>
          <Link href="/contact" className="font-pixel" style={{
            display: "inline-block", padding: "13px 32px", background: "#ff003c",
            borderRadius: 30, color: "#fff", textDecoration: "none", fontSize: 8, letterSpacing: "0.15em",
          }}>FIND OUR STORE →</Link>
        </div>
      </main>

      <Navbar />
    </div>
  );
}
