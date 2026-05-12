const team = [
  { name: "Teri Slack", role: "Founder & Lead Strategist", bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best." },
  { name: "Frankie Lanoue", role: "Client Operations Manager", bio: "With a background in customer service and an eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks." },
  { name: "Zane Starkewolfe", role: "Corporate Development Consultant", bio: "With 15+ years in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, building partnerships, and driving real growth." },
  { name: "Ivory Townsend", role: "Content Analytics Director", bio: "A creative with a background in content, social media, and the arts, Ivory blends analytical thinking and storytelling to help our clients' brands truly come to life." },
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
