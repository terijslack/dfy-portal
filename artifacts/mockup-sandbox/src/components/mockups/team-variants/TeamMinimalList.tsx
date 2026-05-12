const team = [
  { name: "Teri Slack", role: "Founder & Lead Strategist", bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best." },
  { name: "Frankie Lanoue", role: "Client Operations Manager", bio: "With a background in customer service and a natural eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks." },
  { name: "Zane Starkewolfe", role: "Corporate Development Consultant", bio: "15+ years of experience in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, forming partnerships, and launching ventures that drive real growth." },
  { name: "Ivory Townsend", role: "Content Analytics Director", bio: "A multidisciplinary creative with a background spanning content creation, social media, startup launches, and the arts, Ivory brings a unique blend of analytical thinking and storytelling that helps our clients' brands truly come to life." },
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
