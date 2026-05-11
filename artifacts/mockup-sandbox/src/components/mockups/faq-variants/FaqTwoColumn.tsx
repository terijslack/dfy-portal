import { useState } from "react";

const faqs = [
  { q: "Do I need to sign a long-term contract?", a: "No contracts, ever. All of our plans are month-to-month. We keep clients by doing great work — not by locking them in." },
  { q: "How does the approval process work?", a: "Before anything goes live, you'll review and approve every post through your client portal. Nothing gets published without your sign-off." },
  { q: "How long does it take to get started?", a: "Most clients are up and running within one week of signing on. We handle the onboarding, account setup, and first content calendar." },
  { q: "What platforms do you manage?", a: "We manage Instagram, Facebook, LinkedIn, Google Business Profile, and more. The platforms we focus on depend on your plan and your audience." },
  { q: "What if I don't like the content?", a: "We revise until you're happy. Your feedback is part of the process — and the more we work together, the better we get at matching your voice." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes, anytime. Just let us know and we'll adjust your plan at the start of the next billing cycle." },
];

export default function FaqTwoColumn() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh", padding: "72px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, alignItems: "flex-start" }}>

        {/* Left — sticky heading */}
        <div style={{ position: "sticky", top: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#7D2A03", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 38, fontWeight: 400, color: "#1F3D2C", lineHeight: 1.15, marginBottom: 20 }}>
            Common questions, answered.
          </h2>
          <p style={{ fontSize: 15, color: "#6B756B", lineHeight: 1.7 }}>
            Still have questions? Reach out and we'll get back to you within one business day.
          </p>
          <a href="#contact" style={{
            display: "inline-block", marginTop: 24,
            fontSize: 14, fontWeight: 500, color: "#2D6B4F",
            borderBottom: "1.5px solid rgba(45,107,79,0.30)", paddingBottom: 2,
          }}>Get in touch →</a>
        </div>

        {/* Right — accordion */}
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(31,61,44,0.10)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: "#1F3D2C", lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: open === i ? "#2D6B4F" : "transparent",
                  border: "1.5px solid rgba(31,61,44,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: open === i ? "#F5F2EA" : "#6B756B",
                  transition: "all 0.2s",
                }}>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: 20, paddingRight: 42 }}>
                  <p style={{ fontSize: 14, color: "#6B756B", lineHeight: 1.75 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(31,61,44,0.10)" }} />
        </div>
      </div>
    </div>
  );
}
