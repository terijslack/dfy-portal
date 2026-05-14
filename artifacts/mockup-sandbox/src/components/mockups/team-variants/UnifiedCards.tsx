const team = [
  {
    name: "Teri Slack",
    role: "Founder & Lead Strategist",
    bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best.",
    img: "/__mockup/images/team/teri-slack.jpg",
    initials: "TS",
  },
  {
    name: "Frankie Lanoue",
    role: "Client Operations Manager",
    bio: "With a background in customer service and an eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks.",
    img: "/__mockup/images/team/frankie-lanoue.jpg",
    initials: "FL",
  },
  {
    name: "Zane Starkewolfe",
    role: "Corporate Development Consultant",
    bio: "With 15+ years in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, building partnerships, and driving real growth.",
    img: "/__mockup/images/team/zane-starkewolfe.jpg",
    initials: "ZS",
  },
  {
    name: "Ivory Townsend",
    role: "Creative Consultant",
    bio: "A creative with a background in content, social media, and the arts, Ivory blends analytical thinking and storytelling to help our clients' brands truly come to life.",
    img: "/__mockup/images/team/ivory-townsend.jpg",
    initials: "IT",
  },
];

export function UnifiedCards() {
  return (
    <div style={{ background: "#2D6B4F", padding: "72px 48px", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 40, fontWeight: 400, color: "#F5F2EA", margin: 0 }}>The people behind your marketing.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {team.map((member) => (
            <div
              key={member.name}
              style={{
                background: "#F5F2EA",
                borderRadius: 12,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ height: 200, overflow: "hidden", background: "#d4cfc5", position: "relative" }}>
                <img
                  src={member.img}
                  alt={member.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 40,
                  background: "linear-gradient(to bottom, transparent, rgba(245,242,234,0.4))"
                }} />
              </div>

              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1F3D2C", marginBottom: 3 }}>{member.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{member.role}</div>
                <div style={{ width: 28, height: 2, background: "#EBC99B", marginBottom: 12, borderRadius: 1 }} />
                <p style={{ fontSize: 13, color: "#4a5a4a", lineHeight: 1.65, margin: 0 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
