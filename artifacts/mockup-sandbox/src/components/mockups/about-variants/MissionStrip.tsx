export default function MissionStrip() {
  const values = [
    { icon: "🤝", label: "Trustworthy", desc: "You'll always know what's happening with your marketing." },
    { icon: "⚡", label: "Consistent", desc: "Reliable execution, month after month, without you chasing us." },
    { icon: "🎯", label: "Intentional", desc: "Everything we create has a purpose — no filler content." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#1F3D2C", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />

      <div style={{ maxWidth: 900, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>Who We Are</div>

        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 48, fontWeight: 400, color: "#F5F2EA",
          lineHeight: 1.2, marginBottom: 28,
        }}>
          We believe every business owner deserves professional marketing support —{" "}
          <em style={{ color: "#EBC99B", fontStyle: "italic" }}>without the agency price tag.</em>
        </h2>

        <p style={{ fontSize: 16, color: "rgba(245,242,234,0.65)", lineHeight: 1.8, marginBottom: 64, maxWidth: 680, margin: "0 auto 64px" }}>
          Done For You Marketing was built to fill the gap between "I'll do it myself" and "I'll hire an agency." We're the dedicated team that handles your marketing so you can handle your business.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 64 }}>
          {values.map((v, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 16, padding: "32px 28px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 400, color: "#EBC99B", marginBottom: 10 }}>{v.label}</div>
              <div style={{ fontSize: 14, color: "rgba(245,242,234,0.55)", lineHeight: 1.65 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
