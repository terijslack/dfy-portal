const team = [
  { name: "Teri Slack", role: "Founder & Lead Strategist", bio: "10+ years helping small businesses grow their presence without the agency overhead." },
  { name: "Frankie Lanoue", role: "Client Operations Manager", bio: "Former brand journalist who knows how to make every post earn its place in a feed." },
  { name: "Zane Starkewolfe", role: "Corporate Development Consultant", bio: "Platform-obsessed and data-driven — he turns analytics into better content every week." },
  { name: "Ivory Townsend", role: "Content Analytics Director", bio: "Your main point of contact. She makes sure everything runs smoothly from day one." },
];

export default function TeamMinimalList() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#2D6B4F", minHeight: "100vh", padding: "80px 48px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 96, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 400, color: "#F5F2EA", lineHeight: 1.15, marginBottom: 20 }}>
            The people behind your marketing.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(245,242,234,0.65)", lineHeight: 1.75 }}>
            A small, focused team that treats your business like it's our own.
          </p>
        </div>
        <div>
          {team.map((member, i) => (
            <div key={member.name} style={{
              borderTop: "1px solid rgba(245,242,234,0.15)",
              paddingTop: 28, paddingBottom: 28,
              ...(i === team.length - 1 ? { borderBottom: "1px solid rgba(245,242,234,0.15)" } : {}),
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, color: "#F5F2EA" }}>{member.name}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: "#EBC99B", letterSpacing: "0.1em", textTransform: "uppercase" }}>{member.role}</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(245,242,234,0.65)", lineHeight: 1.7 }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
