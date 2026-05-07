export function StyledText() {
  const cards = [
    { icon: "📅", title: "Your Scheduled Posts", desc: "Review and approve the social media posts we've created for you." },
    { icon: "📊", title: "Performance Analytics", desc: "See how your content is performing across platforms." },
    { icon: "👤", title: "Your Account", desc: "Manage your profile, plan, and subscription details." },
    { icon: "💬", title: "Contact Us", desc: "Get in touch with your dedicated marketing team." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:wght@400;600&display=swap" />

      {/* Header — styled text wordmark instead of logo image */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid rgba(31,61,44,0.10)",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#1F3D2C",
            letterSpacing: "-0.01em",
          }}>Done For You</span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            color: "#2D6B4F",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#9AA199", fontSize: 14 }}>Bloom Wellness</span>
          <button style={{
            background: "transparent",
            border: "1px solid rgba(31,61,44,0.20)",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 13,
            color: "#6B756B",
            cursor: "pointer",
          }}>Sign out</button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ padding: "40px 32px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, color: "#1F3D2C", marginBottom: 6 }}>
          Welcome back, Bloom Wellness!
        </h1>
        <p style={{ color: "#9AA199", fontSize: 14 }}>Your marketing is in good hands. Here's everything in one place.</p>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 32px", maxWidth: 900, margin: "0 auto" }}>
        {cards.map(c => (
          <div key={c.title} style={{
            background: "#fff",
            border: "1px solid rgba(31,61,44,0.10)",
            borderRadius: 12,
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#1F3D2C", fontSize: 14, marginBottom: 3 }}>{c.title}</div>
              <div style={{ color: "#9AA199", fontSize: 12.5, lineHeight: 1.4 }}>{c.desc}</div>
            </div>
            <span style={{ color: "#9AA199", fontSize: 18 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
