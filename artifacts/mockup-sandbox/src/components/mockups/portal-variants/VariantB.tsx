export default function VariantB() {
  const cards = [
    { icon: "◎", label: "Your Social Media", accent: "#2D6B4F", bg: "rgba(45,107,79,0.07)" },
    { icon: "G", label: "Your Google Business Profile", accent: "#4285F4", bg: "rgba(66,133,244,0.07)" },
    { icon: "▦", label: "Performance Analytics", accent: "#7D2A03", bg: "rgba(125,42,3,0.07)" },
    { icon: "◉", label: "Your Account", accent: "#1F3D2C", bg: "rgba(31,61,44,0.07)" },
    { icon: "✉", label: "Contact Us", accent: "#6B756B", bg: "rgba(107,117,107,0.07)" },
    { icon: "☰", label: "Business Intake Form", accent: "#EBC99B", bg: "rgba(235,201,155,0.15)" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.1)", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1F3D2C", fontSize: 19, fontWeight: 400 }}>Done For You</span>
          <span style={{ color: "#9AA199", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#2D6B4F", padding: "6px 8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span style={{ color: "#6B756B", fontSize: 13 }}>Jane Smith</span>
          <button style={{ background: "none", border: "1px solid rgba(31,61,44,0.2)", borderRadius: 6, color: "#6B756B", fontSize: 12, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 40px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1F3D2C", fontSize: 28, fontWeight: 400, margin: "0 0 4px" }}>Welcome back, Jane!</h1>
          <p style={{ color: "#6B756B", fontSize: 14, margin: 0 }}>Your marketing is in good hands. Here's everything in one place.</p>
        </div>

        {/* Color-accented cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {cards.map((c) => (
            <a key={c.label} href="#" style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", border: "1px solid rgba(31,61,44,0.1)", borderRadius: 14, padding: "20px 20px 18px", textDecoration: "none", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, color: c.accent }}>{c.icon}</span>
              </div>
              <div>
                <span style={{ color: "#1F3D2C", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{c.label}</span>
              </div>
              <span style={{ color: c.accent, fontSize: 13, fontWeight: 500, marginTop: "auto" }}>Open →</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
