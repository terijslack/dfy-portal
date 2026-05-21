export default function VariantC() {
  const navItems = [
    { icon: "◎", label: "Your Social Media", active: true },
    { icon: "G", label: "Google Business Profile", active: false },
    { icon: "▦", label: "Performance Analytics", active: false },
    { icon: "◉", label: "Your Account", active: false },
    { icon: "✉", label: "Contact Us", active: false },
    { icon: "☰", label: "Business Intake Form", active: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top header */}
      <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.1)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1F3D2C", fontSize: 18, fontWeight: 400 }}>Done For You</span>
          <span style={{ color: "#9AA199", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: "#6B756B", fontSize: 13 }}>Jane Smith</span>
          <button style={{ background: "none", border: "1px solid rgba(31,61,44,0.18)", borderRadius: 6, color: "#6B756B", fontSize: 12, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Left sidebar */}
        <aside style={{ width: 220, background: "#1F3D2C", flexShrink: 0, padding: "28px 0" }}>
          <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 12 }}>
            <p style={{ color: "#EBC99B", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 2px" }}>Welcome back</p>
            <p style={{ color: "#F5F2EA", fontSize: 15, fontWeight: 500, margin: 0, fontFamily: "'Fraunces', Georgia, serif" }}>Jane Smith</p>
          </div>
          {navItems.map((item) => (
            <a key={item.label} href="#" style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 20px",
              background: item.active ? "rgba(235,201,155,0.12)" : "none",
              borderLeft: item.active ? "3px solid #EBC99B" : "3px solid transparent",
              textDecoration: "none", cursor: "pointer",
            }}>
              <span style={{ fontSize: 15, color: item.active ? "#EBC99B" : "rgba(245,242,234,0.55)", width: 20, textAlign: "center" }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: item.active ? "#F5F2EA" : "rgba(245,242,234,0.55)", fontWeight: item.active ? 600 : 400, lineHeight: 1.3 }}>{item.label}</span>
            </a>
          ))}
        </aside>

        {/* Main content area */}
        <main style={{ flex: 1, padding: "36px 40px" }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", color: "#1F3D2C", fontSize: 26, fontWeight: 400, margin: "0 0 4px", fontStyle: "italic" }}>Good morning, Jane!</h1>
            <p style={{ color: "#6B756B", fontSize: 13, margin: 0 }}>Your marketing is running. Here's your overview.</p>
          </div>

          {/* Quick stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[["5", "Total Posts"], ["3", "Awaiting Review"], ["1", "Approved"]].map(([n, l]) => (
              <div key={l} style={{ background: "#fff", border: "1px solid rgba(31,61,44,0.1)", borderRadius: 12, padding: "20px 20px" }}>
                <p style={{ fontSize: 28, fontWeight: 600, color: "#1F3D2C", margin: "0 0 4px" }}>{n}</p>
                <p style={{ fontSize: 12, color: "#9AA199", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{l}</p>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={{ background: "#fff", border: "1px solid rgba(31,61,44,0.1)", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9AA199", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>Recent Posts</p>
            {[["Instagram", "Spring is here! 🌸 We're helping local businesses bloom…", "Needs Review"], ["Facebook", "Did you know 80% of customers research businesses online…", "Approved"]].map(([platform, text, status]) => (
              <div key={platform} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(31,61,44,0.06)" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2D6B4F", background: "rgba(45,107,79,0.08)", padding: "3px 8px", borderRadius: 4 }}>{platform}</span>
                <span style={{ fontSize: 13, color: "#1F3D2C", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: status === "Approved" ? "#2D6B4F" : "#7D2A03", flexShrink: 0 }}>{status}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
