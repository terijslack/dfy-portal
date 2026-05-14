const team = [
  {
    name: "Teri Slack",
    role: "Founder & Lead Strategist",
    bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best.",
    img: "/__mockup/images/team/teri-slack.jpg",
  },
  {
    name: "Frankie Lanoue",
    role: "Client Operations Manager",
    bio: "With a background in customer service and an eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks.",
    img: "/__mockup/images/team/frankie-lanoue.jpg",
  },
  {
    name: "Zane Starkewolfe",
    role: "Corporate Development Consultant",
    bio: "With 15+ years in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, building partnerships, and driving real growth.",
    img: "/__mockup/images/team/zane-starkewolfe.jpg",
  },
  {
    name: "Ivory Townsend",
    role: "Creative Consultant",
    bio: "A creative with a background in content, social media, and the arts, Ivory blends analytical thinking and storytelling to help our clients' brands truly come to life.",
    img: "/__mockup/images/team/ivory-townsend.jpg",
  },
];

export function EditorialOffset() {
  return (
    <div style={{ background: "#1F3D2C", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <div style={{ padding: "64px 64px 48px", borderBottom: "1px solid rgba(245,242,234,0.08)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
        <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 40, fontWeight: 400, color: "#F5F2EA", margin: 0 }}>The people behind your marketing.</h2>
      </div>

      <div>
        {team.map((member, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={member.name}
              style={{
                display: "flex",
                flexDirection: isEven ? "row" : "row-reverse",
                borderBottom: "1px solid rgba(245,242,234,0.07)",
                minHeight: 180,
              }}
            >
              <div style={{ width: 220, flexShrink: 0, overflow: "hidden", background: "rgba(0,0,0,0.15)" }}>
                <img
                  src={member.img}
                  alt={member.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{
                flex: 1, padding: "32px 48px",
                display: "flex", flexDirection: "column", justifyContent: "center",
                borderLeft: isEven ? "1px solid rgba(245,242,234,0.07)" : "none",
                borderRight: isEven ? "none" : "1px solid rgba(245,242,234,0.07)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{member.role}</div>
                <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 24, fontWeight: 400, color: "#F5F2EA", marginBottom: 14 }}>{member.name}</div>
                <p style={{ fontSize: 14, color: "rgba(245,242,234,0.65)", lineHeight: 1.7, margin: 0, maxWidth: 560 }}>{member.bio}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
