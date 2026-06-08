/* Variant A — Centered Hero
   Logo is the hero's focal point: large icon centered above the headline.
   Great for a landing page where brand recognition is the first priority. */

export function VariantA() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", color: "#6B756B" }}>
      {/* Import fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.10)", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={28} />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1F3D2C" }}>Done For You</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>Services</a>
          <a style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>About</a>
          <a style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>Pricing</a>
          <a style={{ background: "#7D2A03", color: "#F5F2EA", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Get Started</a>
        </div>
      </nav>

      {/* Hero — centered logo + headline */}
      <section style={{ padding: "80px 48px 64px", textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
        {/* Logo mark — large centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div style={{ position: "relative" }}>
            {/* Glow halo */}
            <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,107,79,0.10) 0%, transparent 70%)" }} />
            <LogoMark size={100} />
          </div>
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>
          Done-For-You Social Media Marketing
        </p>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 54, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 22 }}>
          Your brand, <em style={{ fontStyle: "italic", fontWeight: 300 }}>handled</em>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "#6B756B", marginBottom: 38, maxWidth: 540, margin: "0 auto 38px" }}>
          We create, schedule, and publish content across every platform — so you stay consistent without lifting a finger.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", marginBottom: 56 }}>
          <a style={{ background: "#7D2A03", color: "#F5F2EA", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Start your free consult</a>
          <a style={{ color: "#2D6B4F", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>See how it works →</a>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, justifyContent: "center", paddingTop: 32, borderTop: "1px solid rgba(31,61,44,0.10)" }}>
          {[["200+", "clients managed"], ["4.9★", "avg. satisfaction"], ["3×", "avg. engagement lift"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 600, color: "#1F3D2C" }}>{val}</div>
              <div style={{ fontSize: 12, color: "#9AA199", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Subtle brand strip */}
      <div style={{ background: "#1F3D2C", padding: "16px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(245,242,234,0.60)", letterSpacing: "0.06em" }}>
          Instagram · Facebook · LinkedIn · Google Business · TikTok
        </p>
      </div>
    </div>
  );
}

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon */}
      <path d="M40 4L73 22V58L40 76L7 58V22L40 4Z" stroke="#EBC99B" strokeWidth="3" fill="rgba(235,201,155,0.08)" />
      {/* Plant sprout */}
      <line x1="40" y1="52" x2="40" y2="30" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 38 C40 38 32 34 30 26 C36 26 40 32 40 38Z" fill="#2D6B4F" />
      <path d="M40 44 C40 44 48 40 50 32 C44 32 40 38 40 44Z" fill="#2D6B4F" />
      <ellipse cx="40" cy="53" rx="6" ry="2.5" fill="rgba(45,107,79,0.25)" />
    </svg>
  );
}
