import { useState } from "react";

const NOTE = "To add admins at all, your LinkedIn Company Page needs to be on a Premium plan. If you're not sure whether you have it, check under your Page's Admin Tools. You'll see an upgrade prompt if it's not active. Unfortunately, we're unable to manage a non-Premium LinkedIn page for this reason.";

export function BysVariantB() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 20px" }}>Variant B — Bold icon row</p>

      <div style={{ width: "100%", maxWidth: 340, borderRadius: 12, overflow: "hidden" }}>
        {/* Prominent row button */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(235,201,155,0.25)", border: "none", borderLeft: "3px solid #EBC99B", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EBC99B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#7D5A1A", lineHeight: 1 }}>!</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>Before you start</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{open ? "tap to hide" : "important — tap to read"}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {/* Expanded content */}
        {open && (
          <div style={{ background: "#FBF8F3", borderLeft: "3px solid #EBC99B", padding: "10px 14px" }}>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{NOTE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
