const LOGO = "https://393babb9-af72-4b63-a2c0-2f83507bfb64-00-3vouu36brmwwk.riker.replit.dev/logo.png";

export default function BiggerLogoRust() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#e8e4dc" }}>
      <div style={{ width: 220, background: "#2D6B4F", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "20px 20px 14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={LOGO} style={{ height: 95, width: "auto", display: "block" }} alt="DFY Marketing" />
        </div>
        <div style={{ padding: "0 16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
          <p style={{ color: "#7D2A03", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 2px", fontFamily: "Inter, sans-serif" }}>
            Marketing, handled.
          </p>
          <p style={{ color: "#F5F2EA", fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 500, margin: 0 }}>
            Bloom Wellness
          </p>
        </div>
        <div style={{ padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: 2 }}>
          {["Dashboard", "Your Social Media", "Google Business Profile", "Performance Analytics", "Content Calendar"].map((item, i) => (
            <div key={i} style={{ padding: "9px 12px", borderRadius: 7, background: i === 0 ? "rgba(245,242,234,0.12)" : "transparent", color: i === 0 ? "#F5F2EA" : "rgba(245,242,234,0.55)", fontSize: 13, fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: "rgba(245,242,234,0.15)", flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
