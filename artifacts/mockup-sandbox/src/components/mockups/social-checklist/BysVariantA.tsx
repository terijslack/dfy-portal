import { useState } from "react";

const NOTE = "To add admins at all, your LinkedIn Company Page needs to be on a Premium plan. If you're not sure whether you have it, check under your Page's Admin Tools. You'll see an upgrade prompt if it's not active. Unfortunately, we're unable to manage a non-Premium LinkedIn page for this reason.";

export function BysVariantA() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 20px" }}>Variant A — Inline pill</p>

      <div style={{ width: "100%", maxWidth: 340 }}>
        {/* Pill badge button */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px 5px 8px", background: "rgba(235,201,155,0.3)", border: "1.5px solid #EBC99B", borderRadius: 20, cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#EBC99B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#7D5A1A", flexShrink: 0 }}>!</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>Before you start</span>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>{open ? "hide" : "tap to read"}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>

        {/* Expanded content */}
        {open && (
          <div style={{ marginTop: 8, background: "white", borderRadius: 10, border: "1.5px solid rgba(235,201,155,0.5)", padding: "10px 14px" }}>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{NOTE}</p>
          </div>
        )}
      </div>
    </div>
  );
}
