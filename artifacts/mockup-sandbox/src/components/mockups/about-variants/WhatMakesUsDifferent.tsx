export default function WhatMakesUsDifferent() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" />

      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", textAlign: "center" }}>

        <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>About Us</div>

        <h2 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 42, fontWeight: 400, color: "#1F3D2C",
          lineHeight: 1.2, marginBottom: 40,
        }}>
          A small team.<br />A big belief.
        </h2>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(31,61,44,0.12)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EBC99B" }} />
          <div style={{ flex: 1, height: 1, background: "rgba(31,61,44,0.12)" }} />
        </div>

        <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.9, marginBottom: 24, maxWidth: 660, margin: "0 auto 24px" }}>
          We started Done For You Marketing because we kept seeing the same thing. Hardworking small business owners doing everything themselves, and watching their marketing fall to the bottom of the to-do list. Not because they didn't care, but because there simply weren't enough hours in the day.
        </p>

        <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.9, marginBottom: 24, maxWidth: 660, margin: "0 auto 24px" }}>
          We're a small team with a big belief: you shouldn't have to choose between running your business and growing it.
        </p>

        <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.9, maxWidth: 660, margin: "0 auto 48px" }}>
          Our job is to show up for your brand the way you show up for your customers — consistently, creatively, and with real care. We handle the content, the strategy, and the presence so you can stay focused on what you do best.
        </p>

        {/* Three accent words */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          {[
            { word: "Consistently", icon: "🔄" },
            { word: "Creatively", icon: "✦" },
            { word: "With real care", icon: "🤝" },
          ].map(({ word, icon }) => (
            <div key={word} style={{
              background: "#F5F2EA", borderRadius: 40,
              padding: "10px 22px", fontSize: 13, fontWeight: 500,
              color: "#2D6B4F", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>{icon}</span> {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
