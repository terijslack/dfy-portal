import { useState } from "react";

const CURRENT = "Growth Engine";

const PLANS = [
  {
    key: "Starter Presence",
    price: 800,
    meta: "Up to 16 posts · Up to 2 platforms",
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
    meta: "Up to 32 posts · Up to 4 platforms",
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

const Check = ({ dark }: { dark?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="6.5" cy="6.5" r="6.5" fill={dark ? "rgba(255,255,255,0.12)" : "rgba(45,107,79,0.10)"} />
    <polyline points="3.5,6.5 5.5,8.5 9.5,4.5" stroke={dark ? "#EBC99B" : "#2D6B4F"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function CompareA() {
  const [selected, setSelected] = useState<string | null>(null);

  const canConfirm = !!selected;
  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-6">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 820,
        padding: "36px 36px 30px",
      }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 22, color: "#1F3D2C", margin: "0 0 24px" }}>
          Compare Plans
        </h2>

        {/* 3 plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === CURRENT;
            const isSelected = selected === p.key;
            const isDark = isCurrent && !isSelected;
            return (
              <div
                key={p.key}
                onClick={() => !isCurrent && setSelected(prev => prev === p.key ? null : p.key)}
                style={{
                  background: isDark ? "#1F3D2C" : isSelected ? "rgba(45,107,79,0.04)" : "#fafaf8",
                  border: `1.5px solid ${isSelected ? "#2D6B4F" : isCurrent ? "transparent" : "rgba(31,61,44,0.1)"}`,
                  borderRadius: 14,
                  padding: "18px 16px 20px",
                  cursor: isCurrent ? "default" : "pointer",
                  boxShadow: isSelected ? "0 0 0 3px rgba(45,107,79,0.12)" : "none",
                  transition: "all 0.13s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  position: "relative",
                }}
              >
                {isCurrent && (
                  <div style={{
                    position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.09em",
                    color: "#2D6B4F", background: "rgba(45,107,79,0.10)",
                    padding: "2px 10px", borderRadius: 20,
                    fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap",
                  }}>CURRENT</div>
                )}
                <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: isDark ? "#EBC99B" : "#2D6B4F", letterSpacing: "0.02em", marginBottom: 8 }}>
                  {p.key}
                </div>
                <div style={{ marginBottom: 4, lineHeight: 1 }}>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 26, fontWeight: 700, color: isDark ? "#F5F2EA" : "#1F3D2C" }}>${p.price.toLocaleString()}</span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 500, color: isDark ? "rgba(235,201,155,0.6)" : "#9AA199" }}>/mo</span>
                </div>
                <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 10.5, color: isDark ? "rgba(235,235,223,0.55)" : "#9AA199", marginBottom: 14 }}>{p.meta}</div>
                <div style={{ width: "100%", height: 1, background: isDark ? "rgba(255,255,255,0.10)" : "rgba(31,61,44,0.07)", marginBottom: 14 }} />
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, color: isDark ? "#EFEBDF" : "#6B756B", lineHeight: 1.4 }}>
                      <Check dark={isDark} />{f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={{ background: "transparent", border: "1.5px solid rgba(31,61,44,0.14)", borderRadius: 8, color: "#6B756B", fontSize: 13, fontWeight: 500, padding: "9px 20px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
            Close
          </button>
          <button disabled={!canConfirm} style={{ background: canConfirm ? "#2D6B4F" : "#C8CCCA", border: "none", borderRadius: 8, color: "#F5F2EA", fontSize: 13, fontWeight: 600, padding: "9px 22px", cursor: canConfirm ? "pointer" : "not-allowed", fontFamily: "Inter, system-ui, sans-serif", transition: "background 0.14s" }}>
            Request Change
          </button>
        </div>
      </div>
    </div>
  );
}
