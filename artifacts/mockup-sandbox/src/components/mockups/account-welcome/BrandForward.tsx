export default function BrandForward() {
  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", minHeight: "100vh", padding: "0 0 60px" }}>

      {/* Top nav strip */}
      <div style={{ textAlign: "center", padding: "32px 24px 0" }}>
        <div style={{ display: "inline-block", width: 44, height: 44, borderRadius: "50%", background: "#2D6B4F", marginBottom: 16 }}>
          <svg viewBox="0 0 44 44" width="44" height="44" fill="none">
            <text x="50%" y="65%" textAnchor="middle" fontSize="20" fill="#F5F2EA" fontFamily="serif">D</text>
          </svg>
        </div>
        <a href="#" style={{ display: "block", fontSize: 13, color: "#6B756B", textDecoration: "none", marginTop: 4 }}>← Change plan</a>
      </div>

      {/* Welcome block — brand-forward banner */}
      <div style={{ maxWidth: 460, margin: "36px auto 0", padding: "0 24px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D6B4F", marginBottom: 10 }}>
            Done For You Marketing
          </p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.75rem", fontWeight: 400, color: "#1F3D2C", margin: "0 0 10px", lineHeight: 1.2 }}>
            Welcome! Please create an account to continue.
          </h1>
          <div style={{ width: 36, height: 2, background: "#7D2A03", margin: "0 auto 14px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9AA199" }}>Your plan</span>
            <span style={{ width: 1, height: 12, background: "rgba(107,117,107,0.3)", display: "inline-block" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1F3D2C" }}>Growth Engine</span>
            <span style={{ fontSize: 13, color: "#6B756B" }}>$1,500/mo</span>
          </div>

          {/* Plan features */}
          <div style={{ marginTop: 18, textAlign: "left", borderTop: "1px solid rgba(31,61,44,0.12)", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
            {[
              "Up to 4 social media platforms",
              "Up to 32 posts (total)",
              "Caption writing",
              "2 promotional emails/month",
              "Automated Google Review requests",
              "Google Business Profile management",
            ].map(f => (
              <div key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{ color: "#2D6B4F", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 12, color: "#6B756B", lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 15, color: "#6B756B", lineHeight: 1.65, margin: "0 0 28px" }}>
          Fill in your details below to finish setting up your account.
        </p>
      </div>

      {/* Form preview */}
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 24px" }}>
        {["Business name", "Full name", "Business email", "Password"].map((label, i) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B756B", marginBottom: 6, letterSpacing: "0.03em" }}>{label}</label>
            <div style={{ background: "#fff", border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 10, padding: "13px 16px", color: "#9AA199", fontSize: 14 }}>
              {["Bloom Wellness", "Jane Smith", "jane@yourbusiness.com", "At least 8 characters"][i]}
            </div>
          </div>
        ))}
        <button style={{ width: "100%", background: "#7D2A03", color: "#F5F2EA", border: "none", borderRadius: 10, padding: "16px", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
          Continue to Payment →
        </button>
        <p style={{ textAlign: "center", fontSize: 13, color: "#9AA199", marginTop: 16 }}>Already have an account? <span style={{ color: "#2D6B4F", fontWeight: 500 }}>Sign in</span></p>
      </div>

      <div style={{ marginTop: 40, borderTop: "1px solid rgba(107,117,107,0.12)", paddingTop: 12, textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9AA199", textTransform: "uppercase" }}>C — Brand Forward</span>
      </div>
    </div>
  );
}
