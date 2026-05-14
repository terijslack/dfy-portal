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
    features: ["1 hour strategic onboarding call", "Monthly strategy check-ins", "Complete social media management", "Google Business Profile management", "Appointment calendar setup", "Email campaigns & newsletters", "Paid ads management & reporting"],
    featured: false,
  },
];

export default function LayoutB() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 36px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 500, color: "#1F3D2C", margin: "0 0 10px" }}>Choose your plan</h1>
        <p style={{ fontSize: 15, color: "#6B756B", margin: 0 }}>Select a plan to create your account. You'll enter payment details on the next screen.</p>
      </div>

      {/* Cards — each has its own CTA button */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        {plans.map(p => {
          const isHovered = hovered === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: p.featured ? "#1F3D2C" : "#fff",
                borderRadius: 14,
                padding: "28px 22px",
                position: "relative",
                border: p.featured ? "2.5px solid transparent" : "1.5px solid rgba(31,61,44,0.12)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {p.badge && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#2D6B4F", color: "#F5F2EA", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  {p.badge}
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? "#EBC99B" : "#6B756B", marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: p.featured ? "#F5F2EA" : "#1F3D2C", marginBottom: 4 }}>
                {p.price}<span style={{ fontSize: 15, fontWeight: 400 }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 12, color: p.featured ? "rgba(245,242,234,0.55)" : "#9AA199", marginBottom: 16 }}>{p.meta}</div>

              <div style={{ borderTop: `1px solid ${p.featured ? "rgba(255,255,255,0.1)" : "rgba(31,61,44,0.08)"}`, paddingTop: 16, flex: 1 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ color: p.featured ? "#EBC99B" : "#2D6B4F", fontSize: 12, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: p.featured ? "rgba(245,242,234,0.80)" : "#6B756B", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Per-card CTA button */}
              <a
                href="/create-account"
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "block", textAlign: "center",
                  marginTop: 24,
                  padding: "13px 16px",
                  borderRadius: 10,
                  fontSize: 14, fontWeight: 600,
                  textDecoration: "none",
                  background: p.featured
                    ? (isHovered ? "#6a2303" : "#7D2A03")
                    : (isHovered ? "rgba(31,61,44,0.08)" : "transparent"),
                  color: p.featured ? "#F5F2EA" : "#1F3D2C",
                  border: p.featured ? "none" : "1.5px solid rgba(31,61,44,0.28)",
                  transition: "background 0.15s",
                }}
              >
                {p.featured ? "Select & Continue →" : "Choose this plan →"}
              </a>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 36 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>B — Per-Card Buttons</span>
      </div>
    </div>
  );
}
