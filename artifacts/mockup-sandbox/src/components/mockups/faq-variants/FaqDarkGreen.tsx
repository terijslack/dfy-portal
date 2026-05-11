import { useState } from "react";

const faqs = [
  { q: "Do I need to sign a long-term contract?", a: "No contracts, ever. All of our plans are month-to-month. We keep clients by doing great work — not by locking them in." },
  { q: "How does the approval process work?", a: "Before anything goes live, you'll review and approve every post through your client portal. Nothing gets published without your sign-off." },
  { q: "How long does it take to get started?", a: "Most clients are up and running within one week of signing on. We handle the onboarding, account setup, and first content calendar." },
  { q: "What platforms do you manage?", a: "We manage Instagram, Facebook, LinkedIn, Google Business Profile, and more. The platforms we focus on depend on your plan and your audience." },
  { q: "What if I don't like the content?", a: "We revise until you're happy. Your feedback is part of the process — and the more we work together, the better we get at matching your voice." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes, anytime. Just let us know and we'll adjust your plan at the start of the next billing cycle." },
];

export default function FaqDarkGreen() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#1F3D2C", minHeight: "100vh", padding: "72px 64px" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,300;0,400;0,600;1,400&display=swap" />
      <div style={{ maxWidth: 780, margin: "0 auto", width: "100%" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#EBC99B", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 38, fontWeight: 400, color: "#F5F2EA", lineHeight: 1.15, marginBottom: 48 }}>
          Common questions, answered.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              background: open === i ? "rgba(235,201,155,0.08)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${open === i ? "rgba(235,201,155,0.25)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 12, overflow: "hidden", transition: "all 0.2s",
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500, color: open === i ? "#EBC99B" : "#F5F2EA", lineHeight: 1.4, transition: "color 0.2s" }}>{faq.q}</span>
                <span style={{
                  width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                  background: open === i ? "#EBC99B" : "transparent",
                  border: `1.5px solid ${open === i ? "#EBC99B" : "rgba(245,242,234,0.25)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: open === i ? "#1F3D2C" : "rgba(245,242,234,0.60)",
                  transition: "all 0.2s",
                }}>
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p style={{ fontSize: 14, color: "rgba(245,242,234,0.65)", lineHeight: 1.75 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
