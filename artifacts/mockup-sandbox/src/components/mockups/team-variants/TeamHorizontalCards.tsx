const team = [
  { name: "Teri Slack", role: "Founder & Lead Strategist", bio: "10+ years helping small businesses grow their presence without the agency overhead." },
  { name: "Frankie Lanoue", role: "Client Operations Manager", bio: "Former brand journalist who knows how to make every post earn its place in a feed." },
  { name: "Zane Starkewolfe", role: "Corporate Development Consultant", bio: "Platform-obsessed and data-driven — he turns analytics into better content every week." },
  { name: "Ivory Townsend", role: "Content Analytics Director", bio: "Your main point of contact. She makes sure everything runs smoothly from day one." },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).join("");

export default function TeamHorizontalCards() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#2D6B4F", minHeight: "100vh", padding: "80px 48px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 400, color: "#F5F2EA", lineHeight: 1.15, marginBottom: 52, maxWidth: 480 }}>
          The people behind your marketing.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {team.map((member) => (
            <div key={member.name} style={{
              display: "flex", alignItems: "center", gap: 28,
              background: "rgba(245,242,234,0.07)", borderRadius: 14,
              border: "1px solid rgba(245,242,234,0.1)", padding: "24px 28px",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: "#1F3D2C", border: "2px solid rgba(235,201,155,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, color: "#EBC99B" }}>{initials(member.name)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#F5F2EA" }}>{member.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#EBC99B", letterSpacing: "0.08em", textTransform: "uppercase" }}>{member.role}</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(245,242,234,0.7)", lineHeight: 1.65 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
