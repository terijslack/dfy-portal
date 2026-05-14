const team: { name: string; role: string; roleOverride?: string; bio: string; img: string; initials: string; scale?: number; translateY?: string }[] = [
  {
    name: "Teri Slack",
    role: "Founder & Lead Strategist",
    bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best.",
    img: "/__mockup/images/team/teri-slack-nobg.png?v=2",
    initials: "TS",
  },
  {
    name: "Frankie Lanoue",
    role: "Client Operations Manager",
    bio: "With a background in customer service and an eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks.",
    img: "/__mockup/images/team/frankie-lanoue-nobg.png",
    initials: "FL",
  },
  {
    name: "Zane Starkewolfe",
    role: "Business Development Consultant",
    bio: "With 15+ years in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, building partnerships, and driving real growth.",
    img: "/__mockup/images/team/zane-starkewolfe-nobg.png",
    initials: "ZS",
  },
  {
    name: "Ivory Townsend",
    role: "Creative Consultant",
    bio: "A creative with a background in content, social media, and the arts, Ivory blends analytical thinking and storytelling to help our clients' brands truly come to life.",
    img: "/__mockup/images/team/ivory-townsend-nobg.png",
    initials: "IT",
    roleOverride: "Creative\nConsultant",
    scale: 1.18,
    translateY: "12%",
  },
];

export function CenteredPortraits() {
  return (
    <div style={{ background: "#2D6B4F", padding: "72px 48px", fontFamily: "Inter, sans-serif", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
          <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 40, fontWeight: 400, color: "#F5F2EA", margin: 0 }}>The people behind your marketing.</h2>
        </div>

        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {team.map((member) => (
            <div key={member.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 220, textAlign: "center" }}>
              <div style={{
                width: 140, height: 140, borderRadius: "50%",
                overflow: "hidden", border: "3px solid rgba(235,201,155,0.40)",
                marginBottom: 20, flexShrink: 0,
                background: "#7D2A03",
                display: "flex", alignItems: "flex-end", justifyContent: "center"
              }}>
                <img
                  src={member.img}
                  alt={member.name}
                  style={{ width: "92%", height: "92%", objectFit: "contain", objectPosition: "bottom", transform: `scale(${member.scale ?? 1}) translateY(${member.translateY ?? "0%"})`, transformOrigin: "bottom center" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F5F2EA", marginBottom: 4 }}>{member.name}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, whiteSpace: "pre-line", lineHeight: 1.5 }}>{member.roleOverride ?? member.role}</div>
              <p style={{ fontSize: 13, color: "rgba(245,242,234,0.7)", lineHeight: 1.65, margin: 0 }}>{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
