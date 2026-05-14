import { useState, useRef } from "react";

const plans = [
  {
    id: "online",
    name: "Online Presence",
    price: "$800",
    period: "/mo",
    meta: "Up to 16 posts · Up to 2 platforms",
    features: ["Up to 2 social media platforms", "Up to 16 posts (total)", "Caption writing", "Google Business Profile setup or review", "Monthly performance summary email"],
    badge: null,
  },
  {
    id: "growth",
    name: "Growth Engine",
    price: "$1,500",
    period: "/mo",
    meta: "Up to 32 posts · Up to 4 platforms",
    features: ["Up to 4 social media platforms", "Up to 32 posts (total)", "Caption writing", "2 promotional emails/month", "Automated Google Review requests", "Google Business Profile management", "Full client dashboard with analytics"],
    badge: "Most Popular",
  },
  {
    id: "partner",
    name: "Done For You Partner",
    price: "$2,800",
    period: "/mo",
    meta: "Complete done-for-you management",
    features: ["1 hour strategic onboarding call", "Monthly strategy check-ins", "Complete social media management", "Google Business Profile management", "Appointment calendar setup", "Email campaigns & newsletters", "Paid ads management & reporting"],
    badge: null,
  },
];

const services = [
  { name: "Film & Video Content Capture", tag: "One-time or recurring" },
  { name: "Build a Website", tag: "One-time project" },
  { name: "Refresh Your Website", tag: "One-time project" },
  { name: "A La Carte Services", tag: "By scope" },
  { name: "Create a Custom Package", tag: "Ongoing retainer" },
];

export default function LayoutB() {
  const [selected, setSelected] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const selectedPlan = plans.find(p => p.id === selected);

  const handleCardClick = (id: string) => {
    setSelected(prev => prev === id ? null : id);
  };

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "48px 24px 36px" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 500, color: "#1F3D2C", margin: "0 0 10px" }}>Choose your plan</h1>
        <p style={{ fontSize: 15, color: "#6B756B", margin: 0 }}>Click a plan to select it, then scroll down to continue.</p>
      </div>

      {/* Cards — click to select, lights up */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>
        {plans.map(p => {
          const isSelected = selected === p.id;
          return (
            <div
              key={p.id}
              onClick={() => handleCardClick(p.id)}
              style={{
                background: isSelected ? "#EEF5F1" : "#fff",
                borderRadius: 14,
                padding: "28px 22px",
                position: "relative",
                border: isSelected ? "2px solid #2D6B4F" : "1.5px solid rgba(31,61,44,0.12)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "border 0.18s, background 0.18s, box-shadow 0.18s",
                boxShadow: isSelected ? "0 4px 24px rgba(45,107,79,0.13)" : "none",
                outline: "none",
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#2D6B4F",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#F5F2EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                </div>
              )}

              {p.badge && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#2D6B4F", color: "#F5F2EA", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  {p.badge}
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#2D6B4F" : "#6B756B", marginBottom: 6, transition: "color 0.18s" }}>{p.name}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#1F3D2C", marginBottom: 4 }}>
                {p.price}<span style={{ fontSize: 15, fontWeight: 400 }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 12, color: "#9AA199", marginBottom: 16 }}>{p.meta}</div>

              <div style={{ borderTop: "1px solid rgba(31,61,44,0.08)", paddingTop: 16, flex: 1 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ color: "#2D6B4F", fontSize: 12, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#6B756B", lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll nudge — appears below cards once a plan is selected */}
      <div style={{
        maxWidth: 920, margin: "0 auto", padding: "0 24px",
        overflow: "hidden",
        maxHeight: selected ? 80 : 0,
        opacity: selected ? 1 : 0,
        transition: "max-height 0.4s ease, opacity 0.35s ease",
      }}>
        <div
          onClick={scrollToCta}
          style={{
            marginTop: 20,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 14, color: "#2D6B4F", fontWeight: 500 }}>
            {selectedPlan ? `${selectedPlan.name} selected — scroll down to continue` : ""}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 920, margin: "48px auto 0", padding: "0 24px" }}>
        <hr style={{ border: "none", borderTop: "1px solid rgba(107,117,107,0.15)" }} />
      </div>

      {/* Custom & À La Carte */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 0" }}>
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

      {/* Bottom CTA — always visible, activates when a plan is selected */}
      <div ref={ctaRef} style={{ maxWidth: 820, margin: "64px auto 0", padding: "0 24px" }}>
        <div style={{
          borderTop: "1px solid rgba(107,117,107,0.15)",
          paddingTop: 40,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
        }}>
          <div>
            {selectedPlan ? (
              <>
                <p style={{ fontSize: 12, color: "#9AA199", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Selected plan</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: "#1F3D2C", margin: 0 }}>
                  {selectedPlan.name} <span style={{ color: "#6B756B", fontWeight: 400, fontSize: 15 }}>— {selectedPlan.price}/mo</span>
                </p>
              </>
            ) : (
              <p style={{ fontSize: 15, color: "#9AA199", margin: 0 }}>No plan selected yet — click a plan above.</p>
            )}
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            disabled={!selected}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: selected ? "#7D2A03" : "#d9d3c7",
              color: selected ? "#F5F2EA" : "#9AA199",
              padding: "15px 36px", borderRadius: 999,
              fontSize: 15, fontWeight: 600, border: "none",
              cursor: selected ? "pointer" : "not-allowed",
              transition: "background 0.25s, color 0.25s",
              whiteSpace: "nowrap",
            }}
          >
            {selected ? "Continue to Account Setup" : "Select a Plan to Continue"}
            {selected && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
