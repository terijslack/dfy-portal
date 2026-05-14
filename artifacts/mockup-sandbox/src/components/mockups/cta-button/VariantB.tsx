export default function VariantB() {
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

        <p style={{ fontSize: 15, color: "#6B756B", marginBottom: 40, lineHeight: 1.6 }}>
          Not sure what you need? Tell us your goals and we'll build the right plan.
        </p>

        {/* VARIANT B: Forest green pill, wide + confident, subtle leaf icon */}
        <a href="#" style={{
          display: "inline-flex", alignItems: "center", gap: 14,
          background: "#1F3D2C", color: "#F5F2EA",
          padding: "18px 56px", borderRadius: 999,
          fontSize: 17, fontWeight: 600,
          textDecoration: "none", letterSpacing: "0.02em",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          Get Started
        </a>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D6B4F" }} />
          <span style={{ fontSize: 13, color: "#6B756B" }}>Free strategy call · No contracts · Cancel anytime</span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2D6B4F" }} />
        </div>

        <div style={{ marginTop: 48, padding: "12px 0", borderTop: "1px solid rgba(107,117,107,0.15)", textAlign: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>B — Forest Green Pill</span>
        </div>
      </div>
    </div>
  );
}
