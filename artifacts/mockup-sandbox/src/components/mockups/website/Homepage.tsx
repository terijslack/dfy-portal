export function Homepage() {
  const plans = [
    {
      name: "Starter Presence",
      price: "$800",
      period: "/mo",
      tagline: "Perfect for getting started",
      posts: "8 posts/month",
      platforms: "1 platform",
      features: ["Content calendar", "Post copywriting", "Client approval portal", "Monthly report"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Growth Engine",
      price: "$1,500",
      period: "/mo",
      tagline: "Most popular",
      posts: "16 posts/month",
      platforms: "3 platforms",
      features: ["Content calendar", "Post copywriting", "Client approval portal", "Bi-weekly reports", "Story & reel content", "Priority support"],
      cta: "Get Started",
      highlight: true,
    },
    {
      name: "Marketing Partner",
      price: "$2,800",
      period: "/mo",
      tagline: "Full-service growth",
      posts: "24 posts/month",
      platforms: "3–4 platforms",
      features: ["Everything in Growth", "Ad campaign management", "Influencer outreach", "Weekly strategy calls", "Dedicated account manager", "Custom reporting"],
      cta: "Get Started",
      highlight: false,
    },
  ];

  const services = [
    { icon: "✍️", title: "Content Creation", desc: "Professionally written captions, hooks, and copy crafted to match your brand voice." },
    { icon: "📅", title: "Scheduling & Publishing", desc: "We handle the calendar so you never have to think about when to post again." },
    { icon: "✅", title: "Client Approval Portal", desc: "Review and approve every post before it goes live — all in one clean dashboard." },
    { icon: "📊", title: "Analytics & Reporting", desc: "Clear, plain-English reports on what's working and where we're growing." },
    { icon: "🎯", title: "Strategy & Positioning", desc: "We align your content with your business goals, not just follower counts." },
    { icon: "🤝", title: "Dedicated Support", desc: "A real person who knows your account — not a ticket queue." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", color: "#6B756B" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />

      {/* ── NAV ── */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid rgba(31,61,44,0.10)",
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 19, fontWeight: 600, color: "#1F3D2C" }}>Done For You</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#2D6B4F", letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a href="#services" style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>Services</a>
          <a href="#pricing" style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>Pricing</a>
          <a href="#about" style={{ color: "#6B756B", fontSize: 14, textDecoration: "none" }}>About</a>
          <a href="/login" style={{
            background: "transparent",
            border: "1px solid rgba(31,61,44,0.25)",
            borderRadius: 6,
            padding: "7px 18px",
            fontSize: 13,
            color: "#1F3D2C",
            textDecoration: "none",
            fontWeight: 500,
          }}>Client Login</a>
          <a href="#pricing" style={{
            background: "#7D2A03",
            borderRadius: 6,
            padding: "8px 20px",
            fontSize: 13,
            color: "#F5F2EA",
            textDecoration: "none",
            fontWeight: 500,
          }}>Get Started</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: "96px 48px 80px",
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "center",
      }}>
        <div>
          <div style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            color: "#7D2A03",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>Social Media Management</div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 52,
            fontWeight: 400,
            color: "#1F3D2C",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            Your marketing,<br /><em style={{ fontStyle: "italic", fontWeight: 300 }}>handled.</em>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#6B756B", marginBottom: 36, maxWidth: 440 }}>
            We create, schedule, and publish social media content for your business — so you can focus on what you do best. Every post approved by you, before it goes live.
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <a href="#pricing" style={{
              background: "#7D2A03",
              borderRadius: 8,
              padding: "14px 28px",
              fontSize: 15,
              color: "#F5F2EA",
              textDecoration: "none",
              fontWeight: 500,
            }}>View Packages</a>
            <a href="#services" style={{
              color: "#2D6B4F",
              fontSize: 14,
              textDecoration: "none",
              fontWeight: 500,
            }}>See how it works →</a>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 32 }}>
            {[["100%", "Posts approved by you"], ["3", "Platforms managed"], ["48hr", "Content turnaround"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, fontWeight: 600, color: "#1F3D2C" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#9AA199", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div style={{ position: "relative" }}>
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 8px 40px rgba(31,61,44,0.12)",
          }}>
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(45,107,79,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2C" }}>Bloom Wellness</div>
                <div style={{ fontSize: 11, color: "#9AA199" }}>3 posts pending review</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 11, color: "#9AA199" }}>Client Portal</div>
            </div>
            {[
              { platform: "Instagram", status: "Pending", date: "May 12", color: "#E1306C" },
              { platform: "Facebook", status: "Approved", date: "May 14", color: "#1877F2" },
              { platform: "LinkedIn", status: "Pending", date: "May 16", color: "#0077B5" },
            ].map(p => (
              <div key={p.platform} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: "1px solid rgba(31,61,44,0.07)",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#1F3D2C", fontWeight: 500 }}>{p.platform} · {p.date}</div>
                  <div style={{ fontSize: 11, color: "#9AA199" }}>✨ Spring wellness tips post</div>
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: p.status === "Approved" ? "rgba(45,107,79,0.12)" : "rgba(235,201,155,0.40)",
                  color: p.status === "Approved" ? "#2D6B4F" : "#7D5A2A",
                }}>{p.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, maxWidth: 520 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>What We Do</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 38, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15 }}>
              Everything your social media needs
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {services.map(s => (
              <div key={s.title} style={{
                background: "#F5F2EA",
                borderRadius: 12,
                padding: "28px 24px",
              }}>
                <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1F3D2C", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#6B756B" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Packages</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 38, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15, marginBottom: 12 }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: 15, color: "#9AA199", maxWidth: 400, margin: "0 auto" }}>No contracts. Cancel anytime. Your posts, your approval.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {plans.map(plan => (
              <div key={plan.name} style={{
                background: plan.highlight ? "#1F3D2C" : "#fff",
                border: plan.highlight ? "none" : "1px solid rgba(31,61,44,0.10)",
                borderRadius: 14,
                padding: "32px 28px",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#EBC99B",
                    color: "#1F3D2C",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: 20,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}>Most Popular</div>
                )}
                <div style={{ fontSize: 13, fontWeight: 500, color: plan.highlight ? "#9AA199" : "#9AA199", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 40, fontWeight: 600, color: plan.highlight ? "#F5F2EA" : "#1F3D2C" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: plan.highlight ? "#9AA199" : "#9AA199" }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: 12, color: plan.highlight ? "#EBC99B" : "#2D6B4F", marginBottom: 4 }}>{plan.posts} · {plan.platforms}</div>
                <div style={{ width: "100%", height: 1, background: plan.highlight ? "rgba(255,255,255,0.10)" : "rgba(31,61,44,0.08)", margin: "20px 0" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13.5, color: plan.highlight ? "#EFEBDF" : "#6B756B", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: plan.highlight ? "#EBC99B" : "#2D6B4F", fontSize: 12 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#onboarding" style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  background: plan.highlight ? "#7D2A03" : "transparent",
                  border: plan.highlight ? "none" : "1px solid rgba(31,61,44,0.25)",
                  color: plan.highlight ? "#F5F2EA" : "#1F3D2C",
                }}>{plan.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ background: "#2D6B4F", padding: "64px 48px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 36, fontWeight: 400, color: "#F5F2EA", marginBottom: 14, lineHeight: 1.2 }}>
            Ready to hand off your social media?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(245,242,234,0.70)", marginBottom: 32 }}>
            Pick a plan, complete a quick onboarding form, and we'll start creating content within 48 hours.
          </p>
          <a href="#pricing" style={{
            background: "#7D2A03",
            borderRadius: 8,
            padding: "14px 32px",
            fontSize: 15,
            color: "#F5F2EA",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-block",
          }}>Choose Your Package</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1F3D2C", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 600, color: "#F5F2EA" }}>Done For You</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <a href="#" style={{ color: "rgba(245,242,234,0.50)", fontSize: 13, textDecoration: "none" }}>Services</a>
          <a href="#" style={{ color: "rgba(245,242,234,0.50)", fontSize: 13, textDecoration: "none" }}>Pricing</a>
          <a href="/login" style={{ color: "#EBC99B", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>Client Login →</a>
        </div>
      </footer>
    </div>
  );
}
