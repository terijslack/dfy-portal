import { useState } from "react";

const PLANS = [
  { key: "Starter Presence",  price: 800,  posts: 8,  platforms: "1 platform" },
  { key: "Growth Engine",     price: 1500, posts: 16, platforms: "3 platforms" },
  { key: "Marketing Partner", price: 2800, posts: 24, platforms: "3–4 platforms" },
];
const CURRENT = "Growth Engine";

export default function VariantB1() {
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

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-8">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 660,
        padding: "36px 36px 32px",
      }}>

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === CURRENT;
            const isSelected = selected === p.key;
            return (
              <div
                key={p.key}
                onClick={() => !isCurrent && handlePlan(p.key)}
                style={{
                  border: `1.5px solid ${isSelected ? "#2D6B4F" : isCurrent ? "rgba(45,107,79,0.3)" : "rgba(31,61,44,0.1)"}`,
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
                  fontSize: 11, fontWeight: 700, color: isCurrent ? "#2D6B4F" : "#1F3D2C",
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

        {/* Compact banner */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(235,201,155,0.12)",
          border: "1.5px solid rgba(235,201,155,0.45)",
          borderLeft: `3px solid ${action ? (action === "cancel" ? "#7D2A03" : "#b47800") : "rgba(235,201,155,0.6)"}`,
          borderRadius: 10,
          padding: "11px 14px",
          marginBottom: 22,
          gap: 12,
          transition: "border-left-color 0.18s",
        }}>
          <span style={{ fontSize: 12.5, color: "#6B756B", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
            Need to step back?
          </span>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => handleAction("pause")}
              style={{
                background: action === "pause" ? "rgba(180,120,0,0.10)" : "transparent",
                border: `1.5px solid ${action === "pause" ? "#b47800" : "rgba(180,120,0,0.35)"}`,
                borderRadius: 7,
                color: "#7a5200",
                fontSize: 11.5,
                fontWeight: 600,
                padding: "5px 13px",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
                transition: "all 0.12s",
              }}>
              Pause Plan
            </button>
            <button
              onClick={() => handleAction("cancel")}
              style={{
                background: action === "cancel" ? "rgba(125,42,3,0.08)" : "transparent",
                border: `1.5px solid ${action === "cancel" ? "#7D2A03" : "rgba(125,42,3,0.3)"}`,
                borderRadius: 7,
                color: "#7D2A03",
                fontSize: 11.5,
                fontWeight: 600,
                padding: "5px 13px",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
                transition: "all 0.12s",
              }}>
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center" }}>
          <button style={{
            background: "transparent",
            border: "1.5px solid rgba(31,61,44,0.14)",
            borderRadius: 8,
            color: "#6B756B",
            fontSize: 13,
            fontWeight: 500,
            padding: "9px 20px",
            cursor: "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
          }}>
            Close
          </button>
          <button
            disabled={!canConfirm}
            style={{
              background: canConfirm ? "#2D6B4F" : "#C8CCCA",
              border: "none",
              borderRadius: 8,
              color: canConfirm ? "#F5F2EA" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 22px",
              cursor: canConfirm ? "pointer" : "not-allowed",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1,
              transition: "background 0.14s",
            }}>
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
