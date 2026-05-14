import { useState } from "react";

const plans = [
  {
    id: "online",
    name: "Online Presence",
    price: "$800",
    period: "/mo",
    meta: "Up to 16 posts · Up to 2 platforms",
    features: ["Up to 2 social media platforms", "Up to 16 posts (total)", "Caption writing", "Google Business Profile setup or review", "Monthly performance summary email"],
    featured: false,
  },
  {
    id: "growth",
    name: "Growth Engine",
    price: "$1,500",
    period: "/mo",
    meta: "Up to 32 posts · Up to 4 platforms",
    features: ["Up to 4 social media platforms", "Up to 32 posts (total)", "Caption writing", "2 promotional emails/month", "Automated Google Review requests", "Google Business Profile management", "Full client dashboard with analytics"],
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "partner",
    name: "Done For You Partner",
    price: "$2,800",
    period: "/mo",
    meta: "Complete done-for-you management",
    features: ["1 hour strategic onboarding call", "Monthly strategy check-ins", "Complete social media management", "Google Business Profile management", "Appointment calendar setup", "Email campaigns & newsletters", "Management & reporting of paid ads"],
    featured: false,
  },
];

export default function LayoutA() {
  const [selected, setSelected] = useState<string | null>("growth");

  const selectedPlan = plans.find(p => p.id === selected);

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingBottom: selected ? 100 : 48 }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 36px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 500, color: "#1F3D2C", margin: "0 0 10px" }}>Choose your plan</h1>
        <p style={{ fontSize: 15, color: "#6B756B", margin: 0 }}>Pick the package that fits your business. Click a plan to select it, then continue.</p>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        {plans.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              background: p.featured ? "#1F3D2C" : "#fff",
              borderRadius: 14,
              padding: "28px 22px",
              cursor: "pointer",
              position: "relative",
              border: selected === p.id
                ? `2.5px solid ${p.featured ? "#EBC99B" : "#7D2A03"}`
                : p.featured ? "2.5px solid transparent" : "1.5px solid rgba(31,61,44,0.12)",
              boxShadow: selected === p.id ? "0 4px 24px rgba(0,0,0,0.10)" : "none",
              transition: "border 0.15s, box-shadow 0.15s",
            }}
          >
            {p.badge && (
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#2D6B4F", color: "#F5F2EA", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                {p.badge}
              </div>
            )}

            {/* Selected indicator */}
            {selected === p.id && (
              <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: p.featured ? "#EBC99B" : "#7D2A03", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={p.featured ? "#1F3D2C" : "#fff"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? "#EBC99B" : "#6B756B", marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: p.featured ? "#F5F2EA" : "#1F3D2C", marginBottom: 4 }}>
              {p.price}<span style={{ fontSize: 15, fontWeight: 400 }}>{p.period}</span>
            </div>
            <div style={{ fontSize: 12, color: p.featured ? "rgba(245,242,234,0.55)" : "#9AA199", marginBottom: 16 }}>{p.meta}</div>
            <div style={{ borderTop: `1px solid ${p.featured ? "rgba(255,255,255,0.1)" : "rgba(31,61,44,0.08)"}`, paddingTop: 16 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: p.featured ? "#EBC99B" : "#2D6B4F", fontSize: 12, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: p.featured ? "rgba(245,242,234,0.80)" : "#6B756B", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom bar */}
      {selected && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#1F3D2C",
          padding: "16px 32px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 24,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.18)",
          zIndex: 100,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(245,242,234,0.55)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Selected</div>
            <div style={{ fontSize: 16, color: "#F5F2EA", fontWeight: 600 }}>{selectedPlan?.name} · {selectedPlan?.price}/mo</div>
          </div>
          <a href="/create-account" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#7D2A03", color: "#F5F2EA",
            padding: "13px 36px", borderRadius: 999,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
          }}>
            Select & Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "rgba(245,242,234,0.45)", fontSize: 12, cursor: "pointer" }}>Change</button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 36, paddingBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>A — Sticky Confirmation Bar</span>
      </div>
    </div>
  );
}
