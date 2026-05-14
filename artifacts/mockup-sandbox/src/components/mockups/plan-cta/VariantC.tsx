import { useState, useEffect } from "react";

export default function VariantC() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(p => !p);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const plans = [
    { name: "Online Presence", price: "$800", period: "/mo", featured: false },
    { name: "Growth Engine", price: "$1,500", period: "/mo", featured: true, badge: "Most Popular" },
    { name: "Done For You Partner", price: "$2,800", period: "/mo", featured: false },
  ];

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", padding: "40px 32px 48px" }}>

      {/* Abbreviated plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 860, margin: "0 auto 44px" }}>
        {plans.map(p => (
          <div key={p.name} style={{
            background: p.featured ? "#1F3D2C" : "#fff",
            borderRadius: 14,
            padding: "24px 20px",
            textAlign: "center",
            border: p.featured ? "none" : "1px solid rgba(31,61,44,0.1)",
            position: "relative",
          }}>
            {p.badge && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#2D6B4F", color: "#F5F2EA", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>
                {p.badge}
              </div>
            )}
            <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? "#EBC99B" : "#6B756B", marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: p.featured ? "#F5F2EA" : "#1F3D2C" }}>
              {p.price}<span style={{ fontSize: 14, fontWeight: 400 }}>{p.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* VARIANT C: Pulse-ring button — draws the eye */}
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-block", position: "relative" }}>
          {/* Pulsing ring */}
          <div style={{
            position: "absolute", inset: -8,
            borderRadius: 999,
            border: "2px solid #7D2A03",
            opacity: pulse ? 0 : 0.4,
            transition: "opacity 1.6s ease",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: -16,
            borderRadius: 999,
            border: "1.5px solid #7D2A03",
            opacity: pulse ? 0 : 0.18,
            transition: "opacity 1.6s ease",
            pointerEvents: "none",
          }} />
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#7D2A03", color: "#F5F2EA",
            padding: "17px 50px", borderRadius: 999,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            position: "relative",
          }}>
            Get Started
          </a>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: "#9AA199" }}>Takes 2 minutes · Free onboarding call included</p>
      </div>

      <div style={{ marginTop: 40, borderTop: "1px solid rgba(107,117,107,0.15)", paddingTop: 12, textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>C — Pulse Ring</span>
      </div>
    </div>
  );
}
