import { useState } from "react";

const plans = [
  {
    id: "online",
    name: "Online Presence",
    price: "$800",
    period: "/mo",
    meta: "Up to 16 posts · Up to 2 platforms",
    features: ["Up to 2 social media platforms", "Up to 16 posts (total)", "Caption writing", "Google Business Profile setup", "Monthly performance summary email"],
    featured: false,
  },
  {
    id: "growth",
    name: "Growth Engine",
    price: "$1,500",
    period: "/mo",
    meta: "Up to 32 posts · Up to 4 platforms",
    features: ["Up to 4 social media platforms", "Up to 32 posts (total)", "Caption writing", "2 promotional emails/month", "Automated Google Review requests", "Google Business Profile management", "Full client dashboard with analytics"],
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "partner",
    name: "Done For You Partner",
    price: "$2,800",
    period: "/mo",
    meta: "Complete done-for-you management",
    features: ["1 hr strategic onboarding call", "Monthly strategy check-ins", "Complete social media management", "Google Business Profile management", "Appointment calendar setup", "Email campaigns & newsletters", "Paid ads management & reporting"],
    featured: false,
  },
];

const services = [
  { name: "Film & Video Content Capture", tag: "One-time or recurring" },
  { name: "Build a Website", tag: "One-time project" },
  { name: "Refresh Your Website", tag: "One-time project" },
  { name: "A La Carte Services", tag: "By scope" },
  { name: "Create a Custom Package", tag: "Ongoing retainer" },
];

export default function LayoutC() {
  const [selected, setSelected] = useState<string | null>("growth");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const selectedPlan = plans.find(p => p.id === selected);

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 36px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 500, color: "#1F3D2C", margin: "0 0 10px" }}>Choose your plan</h1>
        <p style={{ fontSize: 15, color: "#6B756B", margin: 0 }}>Select a plan to get started. You'll create your account on the next step.</p>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        {plans.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              background: p.featured ? "#1F3D2C" : "#fff",
              borderRadius: 14,
              padding: "28px 22px",
              cursor: "pointer",
              position: "relative",
              border: selected === p.id
                ? `2.5px solid ${p.featured ? "#EBC99B" : "#7D2A03"}`
                : p.featured ? "2.5px solid transparent" : "1.5px solid rgba(31,61,44,0.12)",
              transition: "border 0.15s, transform 0.15s",
              transform: selected === p.id ? "translateY(-3px)" : "none",
            }}
          >
            {p.badge && (
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#2D6B4F", color: "#F5F2EA", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                {p.badge}
              </div>
            )}
            <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? "#EBC99B" : "#6B756B", marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: p.featured ? "#F5F2EA" : "#1F3D2C", marginBottom: 4 }}>
              {p.price}<span style={{ fontSize: 15, fontWeight: 400 }}>{p.period}</span>
            </div>
            <div style={{ fontSize: 12, color: p.featured ? "rgba(245,242,234,0.55)" : "#9AA199", marginBottom: 16 }}>{p.meta}</div>
            <div style={{ borderTop: `1px solid ${p.featured ? "rgba(255,255,255,0.1)" : "rgba(31,61,44,0.08)"}`, paddingTop: 16 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: p.featured ? "#EBC99B" : "#2D6B4F", fontSize: 12, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: p.featured ? "rgba(245,242,234,0.80)" : "#6B756B", lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Inline confirmation panel */}
      <div style={{
        maxWidth: 920, margin: "28px auto 0", padding: "0 24px",
        opacity: selected ? 1 : 0,
        transition: "opacity 0.25s",
        pointerEvents: selected ? "auto" : "none",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 14,
          border: "1.5px solid rgba(31,61,44,0.12)",
          padding: "24px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9AA199", marginBottom: 4 }}>Your selection</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1F3D2C" }}>
              {selectedPlan?.name}
              <span style={{ fontSize: 15, fontWeight: 400, color: "#6B756B", marginLeft: 8 }}>{selectedPlan?.price}/mo</span>
            </div>
            <div style={{ fontSize: 13, color: "#9AA199", marginTop: 2 }}>First month billed today · Cancel anytime</div>
          </div>
          <a href="/create-account" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#7D2A03", color: "#F5F2EA",
            padding: "15px 40px", borderRadius: 999,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 14px rgba(125,42,3,0.22)",
          }}>
            Select &amp; Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 920, margin: "56px auto 0", padding: "0 24px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(107,117,107,0.15)" }} />
      </div>

      {/* Custom & À La Carte */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 56px" }}>
        <p style={{ color: "#7D2A03", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
          Custom &amp; À La Carte
        </p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 300, color: "#1F3D2C", fontStyle: "italic", lineHeight: 1.1, margin: 0 }}>Beyond the plan.</h2>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.1, margin: "4px 0 40px" }}>Built for you.</h2>

        <div style={{ borderTop: "1px solid rgba(107,117,107,0.2)", marginBottom: 44 }}>
          {services.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "22px 0", borderBottom: "1px solid rgba(107,117,107,0.2)", gap: 16 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 300, color: "#1F3D2C", letterSpacing: "-0.01em" }}>{s.name}</span>
              <span style={{ fontSize: 11, color: "#6B756B", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.tag}</span>
            </div>
          ))}
        </div>

        {!quoteOpen && !submitted && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 15, color: "#6B756B", marginBottom: 20, lineHeight: 1.65 }}>Every project is different. Let's talk about yours.</p>
            <button
              onClick={() => setQuoteOpen(true)}
              style={{ background: "transparent", border: "1.5px solid #1F3D2C", color: "#1F3D2C", padding: "13px 32px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer" }}
            >
              Request a Custom Quote
            </button>
          </div>
        )}

        {quoteOpen && !submitted && (
          <div>
            <div style={{ width: 40, height: 2, background: "#7D2A03", marginBottom: 28 }} />
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 400, color: "#1F3D2C", marginBottom: 32 }}>Tell us about your project.</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {["Name", "Business"].map(label => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B756B" }}>{label}</label>
                  <input style={{ border: "none", borderBottom: "1.5px solid #d9d3c7", padding: "10px 0", fontSize: 15, fontFamily: "inherit", outline: "none", background: "transparent", color: "#1F3D2C" }} />
                </div>
              ))}
            </div>
            {["Email", "What do you need?"].map(label => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6B756B" }}>{label}</label>
                <input style={{ border: "none", borderBottom: "1.5px solid #d9d3c7", padding: "10px 0", fontSize: 15, fontFamily: "inherit", outline: "none", background: "transparent", color: "#1F3D2C" }} />
              </div>
            ))}
            <button
              onClick={() => { setSubmitted(true); setQuoteOpen(false); }}
              style={{ background: "#1F3D2C", color: "#F5F2EA", border: "none", padding: "14px 36px", borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: "pointer", marginTop: 4 }}
            >
              Submit Request
            </button>
          </div>
        )}

        {submitted && (
          <div style={{ borderTop: "1px solid rgba(107,117,107,0.2)", paddingTop: 40 }}>
            <p style={{ color: "#7D2A03", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", marginBottom: 10 }}>Received</p>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 400, color: "#1F3D2C", marginBottom: 10 }}>We'll be in touch soon.</h3>
            <p style={{ fontSize: 15, color: "#6B756B", lineHeight: 1.65 }}>Expect a reply within 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
