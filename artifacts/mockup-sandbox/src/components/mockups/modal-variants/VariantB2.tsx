import { useState } from "react";

const PLANS = [
  { key: "Starter Presence",  price: 800,  posts: 8,  platforms: "1 platform" },
  { key: "Growth Engine",     price: 1500, posts: 16, platforms: "3 platforms" },
  { key: "Marketing Partner", price: 2800, posts: 24, platforms: "3–4 platforms" },
];
const CURRENT = "Growth Engine";

// Pause icon
const PauseIcon = () => (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="2.5" height="9" rx="1.2" fill="currentColor"/>
    <rect x="5.5" y="0" width="2.5" height="9" rx="1.2" fill="currentColor"/>
  </svg>
);

// X icon
const XIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0 }}>
    <line x1="0.5" y1="0.5" x2="7.5" y2="7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="7.5" y1="0.5" x2="0.5" y2="7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export default function VariantB2() {
  const [selected, setSelected] = useState<string | null>(null);
  const [action, setAction]     = useState<string | null>(null);

  const handleAction = (a: string) => {
    setSelected(null);
    setAction(prev => prev === a ? null : a);
  };
  const handlePlan = (key: string) => {
    setAction(null);
    setSelected(prev => prev === key ? null : key);
  };

  const confirmLabel =
    action === "pause"  ? "Request Pause" :
    action === "cancel" ? "Request Cancellation" :
    "Request Change";
  const canConfirm = !!selected || !!action;

  const confirmBg =
    action === "cancel" ? "#7D2A03" :
    action === "pause"  ? "#b47800" :
    "#2D6B4F";

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-8">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 660,
        overflow: "hidden",
      }}>

        {/* Modal body */}
        <div style={{ padding: "36px 36px 28px" }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: 23, color: "#1F3D2C", margin: "0 0 6px" }}>
              Manage Your Plan
            </h2>
            <p style={{ fontSize: 13, color: "#8A948A", margin: 0, lineHeight: 1.5 }}>
              Select a plan below and we'll reach out to confirm the change.
            </p>
          </div>

          {/* Plan cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {PLANS.map(p => {
              const isCurrent = p.key === CURRENT;
              const isSelected = selected === p.key;
              return (
                <div
                  key={p.key}
                  onClick={() => !isCurrent && handlePlan(p.key)}
                  style={{
                    border: `1.5px solid ${isSelected ? "#2D6B4F" : isCurrent ? "rgba(45,107,79,0.28)" : "rgba(31,61,44,0.1)"}`,
                    borderRadius: 12,
                    padding: "15px 14px 14px",
                    cursor: isCurrent ? "default" : "pointer",
                    background: isSelected
                      ? "rgba(45,107,79,0.04)"
                      : isCurrent
                      ? "rgba(45,107,79,0.02)"
                      : "#fafaf8",
                    boxShadow: isSelected ? "0 0 0 3px rgba(45,107,79,0.10)" : "none",
                    transition: "border-color 0.13s, box-shadow 0.13s, background 0.13s",
                    position: "relative",
                  }}
                >
                  {isCurrent && (
                    <div style={{
                      position: "absolute", top: 9, right: 9,
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.09em",
                      color: "#2D6B4F", background: "rgba(45,107,79,0.10)",
                      padding: "2px 7px", borderRadius: 20,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}>
                      CURRENT
                    </div>
                  )}
                  <div style={{
                    fontSize: 11, fontWeight: 700,
                    color: isCurrent ? "#2D6B4F" : "#1F3D2C",
                    marginBottom: 8, letterSpacing: "0.01em",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}>
                    {p.key}
                  </div>
                  <div style={{ lineHeight: 1, marginBottom: 7 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#1F3D2C", fontFamily: "Inter, system-ui, sans-serif" }}>
                      ${p.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#9AA199", fontFamily: "Inter, system-ui, sans-serif" }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9AA199", fontFamily: "Inter, system-ui, sans-serif" }}>
                    {p.posts} posts · {p.platforms}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer bar — full-width, slightly different bg */}
        <div style={{
          borderTop: "1px solid rgba(31,61,44,0.08)",
          background: "#fafaf8",
          padding: "14px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          {/* Left: pause + cancel */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11.5, color: "#9AA199", fontFamily: "Inter, system-ui, sans-serif", marginRight: 2 }}>
              Step back:
            </span>
            <button
              onClick={() => handleAction("pause")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: action === "pause" ? "rgba(180,120,0,0.10)" : "transparent",
                border: `1.5px solid ${action === "pause" ? "#b47800" : "rgba(180,120,0,0.3)"}`,
                borderRadius: 20,
                color: "#7a5200",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 11px 4px 9px",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                whiteSpace: "nowrap",
                transition: "all 0.12s",
              }}>
              <PauseIcon /> Pause
            </button>
            <button
              onClick={() => handleAction("cancel")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: action === "cancel" ? "rgba(125,42,3,0.08)" : "transparent",
                border: `1.5px solid ${action === "cancel" ? "#7D2A03" : "rgba(125,42,3,0.25)"}`,
                borderRadius: 20,
                color: "#7D2A03",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 11px 4px 9px",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                whiteSpace: "nowrap",
                transition: "all 0.12s",
              }}>
              <XIcon /> Cancel
            </button>
          </div>

          {/* Right: close + confirm */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button style={{
              background: "transparent",
              border: "1.5px solid rgba(31,61,44,0.14)",
              borderRadius: 8,
              color: "#6B756B",
              fontSize: 13,
              fontWeight: 500,
              padding: "8px 18px",
              cursor: "pointer",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1,
            }}>
              Close
            </button>
            <button
              disabled={!canConfirm}
              style={{
                background: canConfirm ? confirmBg : "#C8CCCA",
                border: "none",
                borderRadius: 8,
                color: "#F5F2EA",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 20px",
                cursor: canConfirm ? "pointer" : "not-allowed",
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1,
                transition: "background 0.18s",
                whiteSpace: "nowrap",
              }}>
              {confirmLabel}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
