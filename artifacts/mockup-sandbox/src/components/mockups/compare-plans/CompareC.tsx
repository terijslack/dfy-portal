import { useState } from "react";

const CURRENT = "Growth Engine";

const PLANS = [
  {
    key: "Starter Presence",
    price: 800,
    meta: "Up to 2 platforms · Up to 16 posts",
    features: [
      "Up to 2 social media platforms",
      "Up to 16 posts (total)",
      "Caption writing",
      "Google Business Profile setup or review",
      "Monthly performance summary email",
    ],
  },
  {
    key: "Growth Engine",
    price: 1500,
    meta: "Up to 4 platforms · Up to 32 posts",
    features: [
      "Access to ongoing strategic support",
      "Up to 4 social media platforms",
      "Up to 32 posts (total)",
      "Caption writing",
      "2 promotional emails to clients/month",
      "Automated Google Review requests",
      "Google Business Profile management",
      "Full client dashboard with analytics",
    ],
  },
  {
    key: "Marketing Partner",
    price: 2800,
    meta: "Complete management",
    features: [
      "1 hour strategic onboarding call",
      "Monthly strategy check-ins",
      "Complete social media management",
      "Complete Google Business Profile management",
      "Appointment calendar setup",
      "Automated appointment reminders",
      "Email campaigns & newsletters",
      "Management & reporting of paid ads",
      "1 landing page or promo",
    ],
  },
];

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="6.5" cy="6.5" r="6.5" fill="rgba(45,107,79,0.10)" />
    <polyline points="3.5,6.5 5.5,8.5 9.5,4.5" stroke="#2D6B4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function CompareC() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPlan = PLANS.find(p => p.key === selected);

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-6">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 640,
        padding: "36px 36px 30px",
      }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 22, color: "#1F3D2C", margin: "0 0 24px" }}>
          Compare Plans
        </h2>

        {/* Compact plan selector row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, paddingTop: 18, marginBottom: 16 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === CURRENT;
            const isSelected = selected === p.key;
            return (
              <div
                key={p.key}
                onClick={() => !isCurrent && setSelected(prev => prev === p.key ? null : p.key)}
                style={{
                  border: `1.5px solid ${isSelected ? "#2D6B4F" : isCurrent ? "rgba(45,107,79,0.28)" : "rgba(31,61,44,0.1)"}`,
                  borderRadius: 12,
                  padding: "13px 12px",
                  cursor: isCurrent ? "default" : "pointer",
                  background: isSelected ? "rgba(45,107,79,0.04)" : isCurrent ? "rgba(45,107,79,0.02)" : "#fafaf8",
                  boxShadow: isSelected ? "0 0 0 3px rgba(45,107,79,0.10)" : "none",
                  transition: "all 0.13s",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                {isCurrent && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", color: "#2D6B4F", background: "rgba(45,107,79,0.10)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: "Inter, system-ui, sans-serif" }}>
                    CURRENT
                  </div>
                )}
                <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 10, fontWeight: 700, color: isCurrent ? "#2D6B4F" : "#1F3D2C", marginBottom: 5, letterSpacing: "0.01em" }}>
                  {p.key}
                </div>
                <div style={{ lineHeight: 1 }}>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: "#1F3D2C" }}>${p.price.toLocaleString()}</span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 10, color: "#9AA199" }}>/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable detail panel */}
        <div style={{
          overflow: "hidden",
          maxHeight: selectedPlan ? 500 : 0,
          opacity: selectedPlan ? 1 : 0,
          transition: "max-height 0.28s ease, opacity 0.2s ease",
          marginBottom: selectedPlan ? 18 : 0,
        }}>
          {selectedPlan && (
            <div style={{
              background: "rgba(45,107,79,0.03)",
              border: "1.5px solid rgba(45,107,79,0.14)",
              borderRadius: 12,
              padding: "18px 18px 16px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 700, color: "#2D6B4F" }}>{selectedPlan.key}</div>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, color: "#9AA199", marginTop: 2 }}>{selectedPlan.meta}</div>
                </div>
                <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: "#1F3D2C", lineHeight: 1 }}>
                  ${selectedPlan.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#9AA199" }}>/mo</span>
                </div>
              </div>
              <div style={{ height: 1, background: "rgba(45,107,79,0.10)", marginBottom: 14 }} />
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                {selectedPlan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11.5, color: "#6B756B", lineHeight: 1.4 }}>
                    <Check />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Banner strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(235,201,155,0.12)", border: "1.5px solid rgba(235,201,155,0.45)", borderLeft: "3px solid rgba(235,201,155,0.6)", borderRadius: 10, padding: "10px 14px", marginBottom: 22, gap: 12 }}>
          <span style={{ fontSize: 12, color: "#6B756B", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>Need to step back?</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "transparent", border: "1.5px solid rgba(180,120,0,0.35)", borderRadius: 7, color: "#7a5200", fontSize: 11, fontWeight: 600, padding: "4px 12px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>Pause Plan</button>
            <button style={{ background: "transparent", border: "1.5px solid rgba(125,42,3,0.3)", borderRadius: 7, color: "#7D2A03", fontSize: 11, fontWeight: 600, padding: "4px 12px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>Cancel Plan</button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={{ background: "transparent", border: "1.5px solid rgba(31,61,44,0.14)", borderRadius: 8, color: "#6B756B", fontSize: 13, fontWeight: 500, padding: "9px 20px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>Close</button>
          <button disabled={!selected} style={{ background: selected ? "#2D6B4F" : "#C8CCCA", border: "none", borderRadius: 8, color: "#F5F2EA", fontSize: 13, fontWeight: 600, padding: "9px 22px", cursor: selected ? "pointer" : "not-allowed", fontFamily: "Inter, system-ui, sans-serif", transition: "background 0.14s" }}>
            Request Change
          </button>
        </div>
      </div>
    </div>
  );
}
