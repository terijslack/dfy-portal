const team = [
  { name: "Teri Slack", role: "Founder & Lead Strategist", bio: "A natural big-picture thinker, Teri specializes in building brand presence and long-term growth strategies that let business owners focus on what they do best." },
  { name: "Frankie Lanoue", role: "Client Operations Manager", bio: "With a background in customer service and a natural eye for detail, Frankie makes sure every client feels heard, every deadline is met, and nothing slips through the cracks." },
  { name: "Zane Starkewolfe", role: "Corporate Development Consultant", bio: "15+ years of experience in corporate development, Zane brings a sharp strategic mind and a proven track record of closing deals, forming partnerships, and launching ventures that drive real growth." },
  { name: "Ivory Townsend", role: "Content Analytics Director", bio: "A multidisciplinary creative with a background spanning content creation, social media, startup launches, and the arts, Ivory brings a unique blend of analytical thinking and storytelling that helps our clients' brands truly come to life." },
];

const initials = (name: string) => name.split(" ").map(n => n[0]).join("");

export default function TeamPortraitGrid() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#2D6B4F", minHeight: "100vh", padding: "80px 48px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Our Team</div>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 42, fontWeight: 400, color: "#F5F2EA", lineHeight: 1.15, marginBottom: 56, maxWidth: 480 }}>
          The people behind your marketing.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
          {team.map((member) => (
            <div key={member.name} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                width: "100%", aspectRatio: "1", borderRadius: 12,
                background: "rgba(31,61,44,0.6)", border: "1px solid rgba(245,242,234,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 300, color: "#EBC99B" }}>{initials(member.name)}</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#F5F2EA", marginBottom: 2 }}>{member.name}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#EBC99B", letterSpacing: "0.06em", marginBottom: 10 }}>{member.role}</div>
                <p style={{ fontSize: 13, color: "rgba(245,242,234,0.7)", lineHeight: 1.65 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
