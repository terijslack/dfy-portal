export default function FounderStory() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" />

      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left — big pull quote */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 28 }}>About Us</div>
          <blockquote style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 38, fontWeight: 300, fontStyle: "italic",
            color: "#1F3D2C", lineHeight: 1.25, margin: 0,
            borderLeft: "3px solid #EBC99B", paddingLeft: 28,
          }}>
            "You shouldn't have to choose between running your business and growing it."
          </blockquote>
          <div style={{ marginTop: 36, display: "flex", gap: 24 }}>
            {["Consistently", "Creatively", "With real care"].map((word) => (
              <div key={word} style={{
                fontSize: 12, fontWeight: 600, color: "#2D6B4F",
                borderBottom: "2px solid #EBC99B", paddingBottom: 4,
              }}>{word}</div>
            ))}
          </div>
        </div>

        {/* Right — full copy */}
        <div>
          <p style={{ fontSize: 16, color: "#4A5249", lineHeight: 1.85, marginBottom: 22 }}>
            We started Done For You Marketing because we kept seeing the same thing. Hardworking small business owners doing everything themselves, and watching their marketing fall to the bottom of the to-do list. Not because they didn't care, but because there simply weren't enough hours in the day.
          </p>
          <p style={{ fontSize: 16, color: "#4A5249", lineHeight: 1.85, marginBottom: 22 }}>
            We're a small team with a big belief: you shouldn't have to choose between running your business and growing it.
          </p>
          <p style={{ fontSize: 16, color: "#4A5249", lineHeight: 1.85 }}>
            Our job is to show up for your brand the way you show up for your customers — consistently, creatively, and with real care. We handle the content, the strategy, and the presence so you can stay focused on what you do best.
          </p>
        </div>
      </div>
    </div>
  );
}
