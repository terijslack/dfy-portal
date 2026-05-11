export default function WhatMakesUsDifferent() {
  const points = [
    {
      icon: "👤",
      title: "One team. One point of contact.",
      desc: "No account managers, no handoffs, no explaining yourself twice. The person who plans your content is the person who creates it.",
    },
    {
      icon: "✅",
      title: "You approve everything before it goes live.",
      desc: "Nothing gets published without your sign-off. You stay in control without having to do any of the work.",
    },
    {
      icon: "📍",
      title: "Local presence, professional execution.",
      desc: "We're Sacramento-based and we treat your business like it's in our own backyard — because it is.",
    },
    {
      icon: "🔄",
      title: "Cancel anytime. No retainer games.",
      desc: "Month-to-month, no hidden fees. We keep clients by delivering results — not by locking them into contracts.",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* Left */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Why Choose Us</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15, marginBottom: 20 }}>
              What makes us different.
            </h2>
            <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.8, marginBottom: 32 }}>
              There's no shortage of marketing options out there. Here's why business owners who've tried them all choose to work with us instead.
            </p>
            <div style={{
              background: "#1F3D2C", borderRadius: 16, padding: "24px 28px",
              display: "inline-flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(235,201,155,0.20)", border: "2px solid rgba(235,201,155,0.30)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 600, color: "#EBC99B" }}>D</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F2EA" }}>Sacramento-based</div>
                <div style={{ fontSize: 12, color: "rgba(245,242,234,0.50)" }}>Done For You Marketing Group</div>
              </div>
            </div>
          </div>

          {/* Right — differentiators */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {points.map((p, i) => (
              <div key={i} style={{
                background: "#F5F2EA", borderRadius: 16, padding: "24px 28px",
                border: "1.5px solid rgba(31,61,44,0.06)",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,107,79,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#1F3D2C", marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 14, color: "#6B756B", lineHeight: 1.65 }}>{p.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
