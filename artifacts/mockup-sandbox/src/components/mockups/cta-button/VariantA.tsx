export default function VariantA() {
  return (
    <div style={{
      background: "#F5F2EA",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 740, width: "100%", textAlign: "center" }}>

        <p style={{ color: "#7D2A03", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
          Beyond the Packages
        </p>

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 500, color: "#1F3D2C", margin: "0 0 40px", lineHeight: 1.15 }}>
          Custom Services
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 36 }}>
          {["Website Refresh or Update", "Build a Website", "Landing Page or Lead Capture", "Add Platforms or Posts", "A La Carte Services"].map(tag => (
            <span key={tag} style={{ padding: "10px 22px", borderRadius: 999, border: "1.5px solid #EBC99B", fontSize: 15, fontWeight: 500, color: "#1F3D2C" }}>
              {tag}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 15, color: "#6B756B", marginBottom: 36, lineHeight: 1.6 }}>
          Not sure what you need? Tell us your goals and we'll build the right plan.
        </p>

        {/* VARIANT A: Bold rust fill — large, full-weight, arrow icon */}
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "#7D2A03", color: "#fff",
          padding: "20px 52px", borderRadius: 999,
          fontSize: 18, fontWeight: 600,
          textDecoration: "none", letterSpacing: "0.01em",
          boxShadow: "0 4px 24px rgba(125,42,3,0.28)",
        }}>
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>

        <p style={{ fontSize: 13, color: "#9AA199", marginTop: 16 }}>No commitment — free consultation call</p>

        <div style={{ marginTop: 48, padding: "12px 0", borderTop: "1px solid rgba(107,117,107,0.15)", textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>A — Bold Rust Fill</span>
        </div>
      </div>
    </div>
  );
}
