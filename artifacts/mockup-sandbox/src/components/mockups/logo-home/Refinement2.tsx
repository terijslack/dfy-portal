/* Refinement 2 — Watermark cropped at the edge, editorial treatment
   Same hero, same content. The logo bleeds off the right edge (~70% visible),
   implying scale rather than showing the full mark. A soft radial gradient
   gives the cream background more depth and warmth. */

export function Refinement2() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#6B756B" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
      `}</style>

      {/* ── NAV (unchanged) ── */}
      <nav style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.10)", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 600, color: "#1F3D2C" }}>Done For You</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#2D6B4F", letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["About", "Services", "FAQ", "Contact"].map(l => (
            <a key={l} style={{ color: "#6B756B", fontSize: 14 }}>{l}</a>
          ))}
          <a style={{ border: "1px solid rgba(31,61,44,0.25)", borderRadius: 6, padding: "7px 18px", fontSize: 13, color: "#1F3D2C", fontWeight: 500 }}>Client Login</a>
          <a style={{ background: "#7D2A03", borderRadius: 6, padding: "8px 20px", fontSize: 13, color: "#F5F2EA", fontWeight: 500 }}>Get Started</a>
        </div>
      </nav>

      {/* ── HERO — editorial watermark, cropped right edge ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>

        {/* Warm radial gradient background — adds depth to the cream */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 60%, rgba(235,201,155,0.18) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Watermark — large, anchored bottom-right, intentionally cropped */}
        <div style={{
          position: "absolute",
          right: "-18%",
          bottom: "-12%",
          opacity: 0.10,
          pointerEvents: "none",
          zIndex: 0,
        }}>
          <LogoMark size={640} />
        </div>

        {/* Soft right-edge fade so crop feels deliberate, not accidental */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "15%",
          background: "linear-gradient(to right, transparent, #F5F2EA)",
          pointerEvents: "none", zIndex: 2,
        }} />

        <section style={{ padding: "96px 48px 80px", maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Done For You</div>
            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 52, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
              Marketing,<br /><em style={{ fontStyle: "italic", fontWeight: 300 }}>handled.</em>
            </h1>
            <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.5, marginBottom: 16, maxWidth: 440 }}>Marketing made simpler for busy business owners.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
              {[
                "Professional support without building an in-house team",
                "Reliable execution without managing multiple contractors",
                "Consistent visibility without adding more to your plate",
              ].map(txt => (
                <li key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#6B756B", marginBottom: 10 }}>
                  <span style={{ color: "#2D6B4F", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 14 4 10"/></svg>
                  </span>
                  {txt}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 440, fontWeight: 500, color: "#1F3D2C" }}>You focus on running your business. We'll handle the marketing.</p>
            <a style={{ background: "#7D2A03", borderRadius: 8, padding: "14px 28px", fontSize: 15, color: "#F5F2EA", fontWeight: 500, display: "inline-block" }}>See What We Handle</a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#1F3D2C", borderRadius: 20, padding: "40px 36px", boxShadow: "0 8px 40px rgba(31,61,44,0.20)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 16, right: 24, fontFamily: "'Fraunces',Georgia,serif", fontSize: 120, lineHeight: 1, color: "rgba(255,255,255,0.05)", fontWeight: 600, userSelect: "none" }}>"</div>
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {[1,2,3,4,5].map(i => <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="#EBC99B" stroke="#EBC99B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              </div>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 20, fontWeight: 400, fontStyle: "italic", color: "#F5F2EA", lineHeight: 1.6, marginBottom: 28 }}>
                "I used to spend half my week on marketing. Now I just approve what they send me — and everything looks better than it ever did when I was doing it myself."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(235,201,155,0.20)", border: "2px solid rgba(235,201,155,0.30)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',Georgia,serif", fontSize: 17, fontWeight: 600, color: "#EBC99B", flexShrink: 0 }}>D</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F2EA" }}>David T.</div>
                  <div style={{ fontSize: 12, color: "rgba(245,242,234,0.55)" }}>Content Creator · Davis, CA</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 4L73 22V58L40 76L7 58V22L40 4Z" stroke="#1F3D2C" strokeWidth="3.5" fill="rgba(31,61,44,0.15)" />
      <line x1="40" y1="52" x2="40" y2="30" stroke="#1F3D2C" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M40 38 C40 38 32 34 30 26 C36 26 40 32 40 38Z" fill="#1F3D2C" />
      <path d="M40 44 C40 44 48 40 50 32 C44 32 40 38 40 44Z" fill="#1F3D2C" />
      <ellipse cx="40" cy="53" rx="6" ry="2.5" fill="rgba(31,61,44,0.30)" />
    </svg>
  );
}
