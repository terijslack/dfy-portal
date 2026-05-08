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
    { icon: "📱", title: "Social Media Management", desc: "Content calendars, captions, posting, and platform management across Instagram, Facebook, LinkedIn, and more." },
    { icon: "📍", title: "Google Business Profile", desc: "Setup, optimization, weekly posts, review responses, and full profile management so you rank locally." },
    { icon: "📧", title: "Email Campaigns", desc: "Newsletters, promotions, and automated sequences written and sent for you — no copywriter needed." },
    { icon: "🌐", title: "Website & Landing Pages", desc: "Updates, new pages, lead capture forms, and seasonal promos — handled without a developer retainer." },
    { icon: "📊", title: "Analytics & Reporting", desc: "Plain-English reports on what's working, what to improve, and where your audience is growing." },
    { icon: "🎯", title: "Strategy & Brand Voice", desc: "We define your content pillars, campaign calendar, and brand positioning — then execute on it consistently." },
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
          }}>Done For You</div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 52,
            fontWeight: 400,
            color: "#1F3D2C",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}>
            Marketing,<br /><em style={{ fontStyle: "italic", fontWeight: 300 }}>handled.</em>
          </h1>
          <p style={{ fontSize: 16, color: "#6B756B", lineHeight: 1.5, marginBottom: 16, maxWidth: 440 }}>
            Marketing made simpler for busy business owners.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px 0" }}>
            {[
              "Professional support without building an in-house team",
              "Reliable execution without managing multiple contractors",
              "Consistent visibility without adding more to your plate",
            ].map(item => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 15, color: "#6B756B" }}>
                <span style={{ color: "#2D6B4F", fontWeight: 700, fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "#1F3D2C", fontWeight: 500, marginBottom: 36, maxWidth: 440 }}>
            You focus on running your business. We'll handle the marketing.
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
            }}>See what we handle →</a>
          </div>
        </div>

        {/* Hero testimonials */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "#1F3D2C",
            borderRadius: 20,
            padding: "40px 36px",
            boxShadow: "0 8px 40px rgba(31,61,44,0.20)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative quote mark */}
            <div style={{
              position: "absolute", top: 20, right: 28,
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 120, lineHeight: 1,
              color: "rgba(255,255,255,0.05)",
              fontWeight: 600, userSelect: "none",
            }}>"</div>

            {/* Stars */}
            <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: "#EBC99B", fontSize: 16 }}>★</span>
              ))}
            </div>

            {/* Quote */}
            <p style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 20,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#F5F2EA",
              lineHeight: 1.55,
              marginBottom: 28,
            }}>
              "I used to spend half my week on marketing. Now I just approve what they send me — and everything looks better than it ever did when I was doing it myself."
            </p>

            {/* Attribution */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(235,201,155,0.20)",
                border: "2px solid rgba(235,201,155,0.30)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 17, fontWeight: 600, color: "#EBC99B",
                flexShrink: 0,
              }}>S</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F2EA" }}>Sarah M.</div>
                <div style={{ fontSize: 12, color: "rgba(245,242,234,0.55)" }}>Owner, Bloom Wellness · Sacramento, CA</div>
              </div>
            </div>

          </div>

          {/* Second testimonial — light card */}
          <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: "24px 28px",
            boxShadow: "0 2px 16px rgba(31,61,44,0.08)",
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(45,107,79,0.10)",
              border: "2px solid rgba(45,107,79,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 16, fontWeight: 600, color: "#2D6B4F",
              flexShrink: 0, marginTop: 2,
            }}>J</div>
            <div>
              <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#EBC99B", fontSize: 13 }}>★</span>)}
              </div>
              <p style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 15, fontStyle: "italic", fontWeight: 400,
                color: "#1F3D2C", lineHeight: 1.55, marginBottom: 10,
              }}>
                "Managing my online presence was a full-time job on top of my actual job. It's such a relief to have it off my plate so I can focus on my clients."
              </p>
              <div style={{ fontSize: 12, color: "#9AA199" }}>Jamie R. · Owner, local service business</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: "#fff", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, maxWidth: 620 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>What We Handle</div>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 38, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15, marginBottom: 14 }}>
              One team. Everything your business needs to show up online.
            </h2>
            <p style={{ fontSize: 15, color: "#6B756B", lineHeight: 1.7 }}>No contractors to vet, no agencies to overpay, no in-house team to manage. You tell us what you need — we handle it end to end.</p>
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
            <p style={{ fontSize: 15, color: "#9AA199", maxWidth: 400, margin: "0 auto" }}>No hidden fees. Cancel anytime. Your posts, your approval.</p>
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
            Ready to have your marketing handled?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(245,242,234,0.70)", marginBottom: 32 }}>
            Pick a plan, complete a short intake form, and we'll get started on your content right away.
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
      <footer style={{ background: "#1F3D2C", padding: "48px 48px 36px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginBottom: 12 }}>
                <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 600, color: "#F5F2EA" }}>Done For You</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(245,242,234,0.50)", maxWidth: 240, lineHeight: 1.6 }}>
                Social media management that keeps you in control.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 48 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 14 }}>Company</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="#services" style={{ color: "rgba(245,242,234,0.60)", fontSize: 13, textDecoration: "none" }}>Services</a>
                  <a href="#pricing" style={{ color: "rgba(245,242,234,0.60)", fontSize: 13, textDecoration: "none" }}>Pricing</a>
                  <a href="#about" style={{ color: "rgba(245,242,234,0.60)", fontSize: 13, textDecoration: "none" }}>About</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 14 }}>Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="mailto:hello@dfymarketinggroup.com" style={{ color: "rgba(245,242,234,0.60)", fontSize: 13, textDecoration: "none" }}>hello@dfymarketinggroup.com</a>
                  <a href="tel:+19169708443" style={{ color: "rgba(245,242,234,0.60)", fontSize: 13, textDecoration: "none" }}>(916) 970-8443</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 14 }}>Portal</div>
                <a href="/login" style={{ color: "#EBC99B", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>Client Login →</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(245,242,234,0.30)" }}>© 2026 Done For You Marketing Group. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
