import { useState } from "react";

const CURRENT = "Growth Engine";

const PLANS = [
  {
    key: "Starter Presence",
    price: 800,
    tagline: "Essential visibility",
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
    tagline: "Our most popular plan",
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
    tagline: "Full-service management",
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
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="7" cy="7" r="7" fill={dark ? "rgba(235,201,155,0.15)" : "rgba(45,107,79,0.10)"} />
    <polyline points="4,7 6,9 10,5" stroke={dark ? "#EBC99B" : "#2D6B4F"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function CompareA1() {
  const [selected, setSelected]   = useState<string | null>(null);
  const [action, setAction]       = useState<string | null>(null);

  const handlePlan = (key: string) => {
    setAction(null);
    setSelected(prev => prev === key ? null : key);
  };
  const handleAction = (a: string) => {
    setSelected(null);
    setAction(prev => prev === a ? null : a);
  };

  const canConfirm = !!selected || !!action;
  const confirmLabel =
    action === "pause"  ? "Request Pause" :
    action === "cancel" ? "Request Cancellation" :
    "Request Change";

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-6">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 840,
        padding: "36px 36px 30px",
      }}>

        <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: 22, color: "#1F3D2C", margin: "0 0 28px" }}>
          Compare Plans
        </h2>

        {/* Cards — equal height */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "stretch", paddingTop: 16, marginBottom: 18 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === CURRENT;
            const isSelected = selected === p.key;
            return (
              <div
                key={p.key}
                onClick={() => !isCurrent && handlePlan(p.key)}
                style={{
                  background: isCurrent ? "#1F3D2C" : isSelected ? "rgba(45,107,79,0.04)" : "#fafaf8",
                  border: `1.5px solid ${isSelected ? "#2D6B4F" : isCurrent ? "transparent" : "rgba(31,61,44,0.1)"}`,
                  borderRadius: 14,
                  padding: "20px 18px 20px",
                  cursor: isCurrent ? "default" : "pointer",
                  boxShadow: isSelected ? "0 0 0 3px rgba(45,107,79,0.10)" : "none",
                  transition: "all 0.13s",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {isCurrent && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.09em",
                    color: "#2D6B4F", background: "rgba(45,107,79,0.10)",
                    padding: "2px 10px", borderRadius: 20,
                    fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap",
                  }}>
                    CURRENT
                  </div>
                )}

                {/* Plan header */}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: isCurrent ? "#EBC99B" : "#2D6B4F", letterSpacing: "0.02em", marginBottom: 2 }}>
                    {p.key}
                  </div>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 10.5, color: isCurrent ? "rgba(235,201,155,0.5)" : "#9AA199" }}>
                    {p.tagline}
                  </div>
                </div>

                {/* Price */}
                <div style={{ lineHeight: 1, marginBottom: 16 }}>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: isCurrent ? "#F5F2EA" : "#1F3D2C" }}>
                    ${p.price.toLocaleString()}
                  </span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 500, color: isCurrent ? "rgba(245,242,234,0.45)" : "#9AA199" }}>
                    /mo
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: isCurrent ? "rgba(255,255,255,0.10)" : "rgba(31,61,44,0.07)", marginBottom: 16 }} />

                {/* Features — flex: 1 makes all cards equal height */}
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "Inter, system-ui, sans-serif", fontSize: 11.5, color: isCurrent ? "#EFEBDF" : "#6B756B", lineHeight: 1.45 }}>
                      <Check dark={isCurrent} />{f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Pause/cancel banner */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(235,201,155,0.12)",
          border: "1.5px solid rgba(235,201,155,0.45)",
          borderLeft: `3px solid ${action === "cancel" ? "#7D2A03" : action === "pause" ? "#b47800" : "rgba(235,201,155,0.6)"}`,
          borderRadius: 10, padding: "10px 14px", marginBottom: 22, gap: 12,
          transition: "border-left-color 0.18s",
        }}>
          <span style={{ fontSize: 12.5, color: "#6B756B", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
            Need to step back?
          </span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {(["pause", "cancel"] as const).map(a => (
              <button
                key={a}
                onClick={() => handleAction(a)}
                style={{
                  background: action === a ? (a === "pause" ? "rgba(180,120,0,0.10)" : "rgba(125,42,3,0.08)") : "transparent",
                  border: `1.5px solid ${action === a ? (a === "pause" ? "#b47800" : "#7D2A03") : a === "pause" ? "rgba(180,120,0,0.35)" : "rgba(125,42,3,0.3)"}`,
                  borderRadius: 7, cursor: "pointer", whiteSpace: "nowrap",
                  color: a === "pause" ? "#7a5200" : "#7D2A03",
                  fontSize: 11.5, fontWeight: 600, padding: "5px 13px",
                  fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.12s",
                }}>
                {a === "pause" ? "Pause Plan" : "Cancel Plan"}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center" }}>
          <button style={{ background: "transparent", border: "1.5px solid rgba(31,61,44,0.14)", borderRadius: 8, color: "#6B756B", fontSize: 13, fontWeight: 500, padding: "9px 20px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
            Close
          </button>
          <button disabled={!canConfirm} style={{ background: canConfirm ? "#2D6B4F" : "#C8CCCA", border: "none", borderRadius: 8, color: "#F5F2EA", fontSize: 13, fontWeight: 600, padding: "9px 22px", cursor: canConfirm ? "pointer" : "not-allowed", fontFamily: "Inter, system-ui, sans-serif", transition: "background 0.14s", whiteSpace: "nowrap" }}>
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
