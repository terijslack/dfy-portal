import { useState } from "react";

const NOTE = "To add admins at all, your LinkedIn Company Page needs to be on a Premium plan. If you're not sure whether you have it, check under your Page's Admin Tools. You'll see an upgrade prompt if it's not active. Unfortunately, we're unable to manage a non-Premium LinkedIn page for this reason.";

export function BysVariantC() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 20px" }}>Variant C — Ghost outlined</p>

      <div style={{ width: "100%", maxWidth: 340, borderRadius: 10, overflow: "hidden", border: "1.5px solid rgba(235,201,155,0.7)" }}>
        {/* Ghost/outlined row button */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "white", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EBC99B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>Before you start</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{open ? "hide" : "tap to read"}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {/* Expanded content */}
        {open && (
          <div style={{ background: "#FDFCF9", borderTop: "1px solid rgba(235,201,155,0.4)", padding: "10px 12px" }}>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{NOTE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
