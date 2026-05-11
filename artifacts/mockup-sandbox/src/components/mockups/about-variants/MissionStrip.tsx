export default function MissionStrip() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#1F3D2C", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left — copy */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>About Us</div>

          <p style={{ fontSize: 17, color: "rgba(245,242,234,0.80)", lineHeight: 1.85, marginBottom: 22 }}>
            We started Done For You Marketing because we kept seeing the same thing. Hardworking small business owners doing everything themselves, and watching their marketing fall to the bottom of the to-do list. Not because they didn't care, but because there simply weren't enough hours in the day.
          </p>

          <p style={{ fontSize: 17, color: "rgba(245,242,234,0.80)", lineHeight: 1.85, marginBottom: 22 }}>
            We're a small team with a big belief: you shouldn't have to choose between running your business and growing it.
          </p>

          <p style={{ fontSize: 17, color: "rgba(245,242,234,0.80)", lineHeight: 1.85 }}>
            Our job is to show up for your brand the way you show up for your customers — consistently, creatively, and with real care. We handle the content, the strategy, and the presence so you can stay focused on what you do best.
          </p>
        </div>

        {/* Right — stacked accent words */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { word: "Consistently", sub: "Reliable execution, every single month." },
            { word: "Creatively", sub: "Content that actually sounds like you." },
            { word: "With real care", sub: "We treat your brand like it's our own." },
          ].map(({ word, sub }, i) => (
            <div key={word} style={{
              border: "1px solid rgba(235,201,155,0.20)",
              borderRadius: 16, padding: "22px 26px",
              background: i === 0 ? "rgba(235,201,155,0.08)" : "transparent",
            }}>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 26, fontWeight: 400, fontStyle: "italic",
                color: "#EBC99B", marginBottom: 8,
              }}>{word}</div>
              <div style={{ fontSize: 14, color: "rgba(245,242,234,0.50)", lineHeight: 1.6 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
