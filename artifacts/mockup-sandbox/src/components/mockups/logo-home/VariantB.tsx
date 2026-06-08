/* Variant B — Elevated Nav Lockup
   Logo gets a full icon + wordmark treatment in the nav.
   The hero features the logo icon embossed inside the mock dashboard card,
   and a subtle brand medallion anchors the left column. */

export function VariantB() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", color: "#6B756B" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`}</style>

      {/* Nav — full logo lockup */}
      <nav style={{ background: "#1F3D2C", padding: "0 48px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LogoMark size={36} />
          <div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#F5F2EA", lineHeight: 1.1 }}>Done For You</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.18em", textTransform: "uppercase" }}>Marketing</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Services", "About", "Pricing", "Contact"].map(l => (
            <a key={l} style={{ color: "rgba(245,242,234,0.65)", fontSize: 13, textDecoration: "none" }}>{l}</a>
          ))}
          <a style={{ background: "#7D2A03", color: "#F5F2EA", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500, textDecoration: "none", marginLeft: 8 }}>Client Login</a>
        </div>
      </nav>

      {/* Hero — 2-column with brand medallion */}
      <section style={{ padding: "72px 48px 60px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        {/* Left */}
        <div>
          {/* Brand medallion */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <LogoMark size={22} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase" }}>Done-For-You Social Media</span>
          </div>

          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 50, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 22 }}>
            We handle <em style={{ fontStyle: "italic", fontWeight: 300 }}>every post</em><br />so you don't have to
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "#6B756B", marginBottom: 36, maxWidth: 420 }}>
            Strategy, content, scheduling, and reporting — all handled by a team that lives and breathes social media.
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 44 }}>
            <a style={{ background: "#7D2A03", color: "#F5F2EA", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>Book a free call</a>
            <a style={{ color: "#2D6B4F", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>View our work →</a>
          </div>
          <div style={{ display: "flex", gap: 36 }}>
            {[["200+", "clients"], ["4.9★", "rating"], ["3×", "engagement"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24, fontWeight: 600, color: "#1F3D2C" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#9AA199" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — card with logo watermark */}
        <div style={{ position: "relative" }}>
          {/* Watermark logo behind card */}
          <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.06, pointerEvents: "none" }}>
            <LogoMark size={200} />
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 8px 40px rgba(31,61,44,0.12)", position: "relative" }}>
            {/* Card header with logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1F3D2C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogoMark size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2C" }}>Riverside Coffee Co.</div>
                <div style={{ fontSize: 11, color: "#9AA199" }}>DFY Portal · This week</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#2D6B4F", background: "rgba(45,107,79,0.10)", padding: "3px 10px", borderRadius: 12 }}>Active</div>
            </div>
            {[
              ["Instagram", "#E1306C", "Caption drafted, awaiting approval"],
              ["Facebook", "#1877F2", "Story posted — 1.2k reach"],
              ["LinkedIn", "#0A66C2", "Article scheduled for Thursday"],
            ].map(([p, c, t]) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(31,61,44,0.07)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2C" }}>{p}</div>
                  <div style={{ fontSize: 11, color: "#9AA199" }}>{t}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 12, background: "rgba(235,201,155,0.35)", color: "#7D5A2A" }}>In progress</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 4L73 22V58L40 76L7 58V22L40 4Z" stroke="#EBC99B" strokeWidth="3" fill="rgba(235,201,155,0.10)" />
      <line x1="40" y1="52" x2="40" y2="30" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 38 C40 38 32 34 30 26 C36 26 40 32 40 38Z" fill="#2D6B4F" />
      <path d="M40 44 C40 44 48 40 50 32 C44 32 40 38 40 44Z" fill="#2D6B4F" />
      <ellipse cx="40" cy="53" rx="6" ry="2.5" fill="rgba(45,107,79,0.25)" />
    </svg>
  );
}
