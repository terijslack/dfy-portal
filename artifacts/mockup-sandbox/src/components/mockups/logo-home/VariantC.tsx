/* Variant C — Watermark Overlay
   Deep forest-green hero with the logo rendered as a massive, low-opacity
   background element. Text and CTA float over it. Dramatic and editorial. */

export function VariantC() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", color: "#6B756B" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`}</style>

      {/* Nav — minimal / transparent over the dark hero */}
      <nav style={{ background: "transparent", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "absolute", width: "100%", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={28} light />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#F5F2EA" }}>Done For You</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.18em", textTransform: "uppercase", marginLeft: 4, marginTop: 3 }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Services", "Work", "Pricing"].map(l => (
            <a key={l} style={{ color: "rgba(245,242,234,0.65)", fontSize: 13, textDecoration: "none" }}>{l}</a>
          ))}
          <a style={{ border: "1px solid rgba(235,201,155,0.50)", color: "#EBC99B", padding: "7px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Login</a>
        </div>
      </nav>

      {/* Hero — dark green with giant watermark logo */}
      <section style={{ background: "#1F3D2C", minHeight: 520, position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Watermark — massive, low opacity */}
        <div style={{
          position: "absolute",
          right: -40,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.07,
          pointerEvents: "none",
        }}>
          <LogoMark size={600} light />
        </div>

        {/* Subtle radial gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(45,107,79,0.40) 0%, transparent 65%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "120px 80px 80px", maxWidth: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ width: 1, height: 28, background: "#EBC99B", opacity: 0.6 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.16em", textTransform: "uppercase" }}>Done-For-You Marketing</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 58, fontWeight: 400, color: "#F5F2EA", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 24 }}>
            Your content,<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "#EBC99B" }}>every single day</em>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "rgba(245,242,234,0.65)", marginBottom: 42, maxWidth: 480 }}>
            We manage your social media from end to end — strategy, copy, design, and scheduling — so your brand stays visible while you focus on your business.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a style={{ background: "#7D2A03", color: "#F5F2EA", padding: "15px 32px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Start today — it's free</a>
            <a style={{ color: "rgba(245,242,234,0.60)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Watch a demo →</a>
          </div>
        </div>
      </section>

      {/* Cream section below hero — logo referenced as section marker */}
      <section style={{ background: "#F5F2EA", padding: "64px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <LogoMark size={32} />
            <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 400, color: "#1F3D2C" }}>What we take off your plate</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              ["✦", "Content Creation", "Captions, graphics, reels, and carousels tailored to your voice."],
              ["✦", "Scheduling", "Posts go live at the perfect time — every platform, every day."],
              ["✦", "Reporting", "Monthly reports so you always know what's working."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ background: "#fff", borderRadius: 12, padding: "24px 22px" }}>
                <div style={{ color: "#7D2A03", marginBottom: 10, fontSize: 14 }}>{icon}</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#1F3D2C", marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#6B756B" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LogoMark({ size = 40, light = false }: { size?: number; light?: boolean }) {
  const strokeColor = light ? "#EBC99B" : "#EBC99B";
  const leafColor   = light ? "#4CAF82" : "#2D6B4F";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 4L73 22V58L40 76L7 58V22L40 4Z" stroke={strokeColor} strokeWidth="3" fill={light ? "rgba(235,201,155,0.06)" : "rgba(235,201,155,0.08)"} />
      <line x1="40" y1="52" x2="40" y2="30" stroke={leafColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 38 C40 38 32 34 30 26 C36 26 40 32 40 38Z" fill={leafColor} />
      <path d="M40 44 C40 44 48 40 50 32 C44 32 40 38 40 44Z" fill={leafColor} />
      <ellipse cx="40" cy="53" rx="6" ry="2.5" fill={light ? "rgba(76,175,130,0.30)" : "rgba(45,107,79,0.25)"} />
    </svg>
  );
}
