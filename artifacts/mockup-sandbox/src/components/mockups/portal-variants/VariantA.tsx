export default function VariantA() {
  const cards = [
    { icon: "◎", label: "Your Social Media" },
    { icon: "G", label: "Your Google Business Profile" },
    { icon: "▦", label: "Performance Analytics" },
    { icon: "◉", label: "Your Account" },
    { icon: "✉", label: "Contact Us" },
    { icon: "☰", label: "Business Intake Form" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh" }}>
      {/* Header — dark forest */}
      <header style={{ background: "#1F3D2C", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#F5F2EA", fontSize: 20, fontWeight: 400 }}>Done For You</span>
          <span style={{ color: "#9AA199", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9AA199", padding: "6px 8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span style={{ color: "#EBC99B", fontSize: 13, fontWeight: 500 }}>Jane Smith</span>
          <button style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "#9AA199", fontSize: 12, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
        </div>
      </header>

      {/* Hero banner */}
      <div style={{ background: "#2D6B4F", padding: "36px 40px", borderBottom: "1px solid rgba(31,61,44,0.15)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ color: "#EBC99B", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Welcome back</p>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#F5F2EA", fontSize: 36, fontWeight: 300, margin: "0 0 6px", fontStyle: "italic" }}>Good morning, Jane.</h1>
          <p style={{ color: "rgba(245,242,234,0.65)", fontSize: 14, margin: 0 }}>Your marketing is running. Here's your portal.</p>
        </div>
      </div>

      {/* Cards */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {cards.map((c) => (
            <a key={c.label} href="#" style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid rgba(31,61,44,0.1)", borderRadius: 12, padding: "20px 24px", textDecoration: "none", transition: "box-shadow 0.15s", cursor: "pointer", borderLeft: "3px solid #EBC99B" }}>
              <span style={{ fontSize: 20, color: "#1F3D2C", width: 28, textAlign: "center", flexShrink: 0 }}>{c.icon}</span>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1F3D2C", fontSize: 16, fontWeight: 400 }}>{c.label}</span>
              <span style={{ marginLeft: "auto", color: "#9AA199", fontSize: 16 }}>→</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
