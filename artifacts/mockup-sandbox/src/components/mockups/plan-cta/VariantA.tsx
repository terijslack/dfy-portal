export default function VariantA() {
  const plans = [
    { name: "Online Presence", price: "$800", period: "/mo", featured: false },
    { name: "Growth Engine", price: "$1,500", period: "/mo", featured: true, badge: "Most Popular" },
    { name: "Done For You Partner", price: "$2,800", period: "/mo", featured: false },
  ];

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", padding: "40px 32px 48px" }}>

      {/* Abbreviated plan cards — just names + prices for context */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 860, margin: "0 auto 40px" }}>
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

      {/* VARIANT A: Bold rust pill — larger, arrow, trust note */}
      <div style={{ textAlign: "center" }}>
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "#7D2A03", color: "#fff",
          padding: "18px 52px", borderRadius: 999,
          fontSize: 17, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(125,42,3,0.25)",
          letterSpacing: "0.01em",
        }}>
          Get Started
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <p style={{ marginTop: 12, fontSize: 13, color: "#9AA199" }}>Free strategy call · No long-term contracts</p>
      </div>

      <div style={{ marginTop: 40, borderTop: "1px solid rgba(107,117,107,0.15)", paddingTop: 12, textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>A — Bold Rust Pill</span>
      </div>
    </div>
  );
}
