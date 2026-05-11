export default function FounderStory() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80, alignItems: "center", width: "100%" }}>

        {/* Left — visual */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%", aspectRatio: "3/4", borderRadius: 24,
            background: "linear-gradient(145deg, #1F3D2C 0%, #2D6B4F 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "rgba(235,201,155,0.20)",
              border: "2px solid rgba(235,201,155,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 42, fontWeight: 600, color: "#EBC99B",
            }}>D</div>
            <div style={{
              position: "absolute", bottom: 24, left: 24, right: 24,
              background: "rgba(31,61,44,0.70)", backdropFilter: "blur(8px)",
              borderRadius: 12, padding: "14px 18px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F2EA" }}>Done For You Marketing</div>
              <div style={{ fontSize: 12, color: "rgba(245,242,234,0.55)", marginTop: 3 }}>Founded right here in Sacramento, CA</div>
            </div>
          </div>
          <div style={{
            position: "absolute", top: -16, right: -16,
            background: "#EBC99B", borderRadius: 12, padding: "10px 16px",
            fontSize: 12, fontWeight: 600, color: "#1F3D2C",
          }}>From the founder ✦</div>
        </div>

        {/* Right — story */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>Our Story</div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15, marginBottom: 24 }}>
            Built for business owners who are too busy to do it all.
          </h2>
          <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.8, marginBottom: 20 }}>
            I started Done For You Marketing because I kept hearing the same thing from business owners: "I know I need to show up online, but I just don't have the time — and I can't afford to hire a full agency."
          </p>
          <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.8, marginBottom: 32 }}>
            So I built something in between. A dedicated team that handles your marketing like it's their own — so you can stay focused on the work that actually moves your business forward.
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {[["Local", "Sacramento-based team"], ["Dedicated", "One point of contact"], ["Transparent", "You approve everything"]].map(([val, label]) => (
              <div key={val}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: "#2D6B4F" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#9AA199", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
