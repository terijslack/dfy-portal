import { useState } from "react";

const PLANS = [
  { key: "Starter Presence",  price: 800,  posts: 8,  platforms: "1 platform" },
  { key: "Growth Engine",     price: 1500, posts: 16, platforms: "3 platforms" },
  { key: "Marketing Partner", price: 2800, posts: 24, platforms: "3–4 platforms" },
];
const CURRENT = "Growth Engine";

export default function VariantA() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[680px] p-8">

        {/* Header */}
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 22, color: "#1F3D2C", marginBottom: 4 }}>
          Manage Your Plan
        </h2>
        <p style={{ fontSize: 13, color: "#6B756B", marginBottom: 24 }}>
          Select a plan below and we'll reach out to confirm the change.
        </p>

        {/* Plan cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
          {PLANS.map(p => {
            const isCurrent = p.key === CURRENT;
            const isSelected = selected === p.key;
            return (
              <div
                key={p.key}
                onClick={() => !isCurrent && setSelected(p.key)}
                style={{
                  border: `2px solid ${isSelected ? "#2D6B4F" : isCurrent ? "rgba(45,107,79,0.25)" : "rgba(31,61,44,0.1)"}`,
                  borderRadius: 12,
                  padding: "16px 14px",
                  cursor: isCurrent ? "default" : "pointer",
                  background: isSelected ? "rgba(45,107,79,0.04)" : isCurrent ? "rgba(45,107,79,0.025)" : "#fff",
                  boxShadow: isSelected ? "0 0 0 3px rgba(45,107,79,0.12)" : "none",
                  transition: "all 0.14s",
                  position: "relative",
                  opacity: isCurrent ? 0.75 : 1,
                }}
              >
                {isCurrent && (
                  <div style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#2D6B4F", background: "rgba(45,107,79,0.09)", padding: "2px 7px", borderRadius: 20 }}>
                    CURRENT
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C", marginBottom: 6 }}>{p.key}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1F3D2C", lineHeight: 1 }}>
                  ${p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#6B756B" }}>/mo</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B756B", marginTop: 6 }}>{p.posts} posts · {p.platforms}</div>
              </div>
            );
          })}
        </div>

        {/* Divider + text links */}
        <div style={{ borderTop: "1px solid rgba(31,61,44,0.08)", paddingTop: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#9AA199" }}>Need something else?</span>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#b47800", textDecoration: "underline", padding: 0, fontFamily: "inherit" }}>
            Pause plan
          </button>
          <span style={{ fontSize: 12, color: "#9AA199" }}>·</span>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#7D2A03", textDecoration: "underline", padding: 0, fontFamily: "inherit" }}>
            Cancel plan
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={{ background: "transparent", border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 8, color: "#6B756B", fontSize: 13, fontWeight: 500, padding: "9px 18px", cursor: "pointer", fontFamily: "inherit" }}>
            Close
          </button>
          <button
            disabled={!selected}
            style={{ background: selected ? "#2D6B4F" : "#9AA199", border: "none", borderRadius: 8, color: "#F5F2EA", fontSize: 13, fontWeight: 600, padding: "9px 22px", cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background 0.12s" }}>
            Request Change
          </button>
        </div>
      </div>
    </div>
  );
}
