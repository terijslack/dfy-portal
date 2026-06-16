const variants = [
  {
    label: "A — Solid pill",
    desc: "Full-width, fully rounded, rust fill",
    style: {
      width: "100%", padding: "13px 24px", background: "#7D2A03", color: "white",
      border: "none", borderRadius: 50, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.01em",
    },
  },
  {
    label: "B — Outlined",
    desc: "Transparent background, rust border + text",
    style: {
      width: "100%", padding: "12px 24px", background: "transparent", color: "#7D2A03",
      border: "2px solid #7D2A03", borderRadius: 12, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: "Inter, sans-serif",
    },
  },
  {
    label: "C — Soft fill",
    desc: "Rust tint background, no border, warm text",
    style: {
      width: "100%", padding: "13px 24px", background: "rgba(125,42,3,0.1)", color: "#7D2A03",
      border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: "Inter, sans-serif",
    },
  },
  {
    label: "D — Two-tone",
    desc: "Green background, rust right-side accent",
    style: {
      width: "100%", padding: "13px 24px", background: "#2D6B4F", color: "white",
      border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
      cursor: "pointer", fontFamily: "Inter, sans-serif", position: "relative" as const,
      overflow: "hidden" as const,
    },
    accent: true,
  },
];

export function ButtonVariants() {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: "32px 28px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9CA3AF", margin: "0 0 20px" }}>
        Button options — "I've completed these steps"
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {variants.map(v => (
          <div key={v.label} style={{ background: "white", borderRadius: 16, padding: "20px 20px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#1F3D2C" }}>{v.label}</span>
            </div>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 14px", lineHeight: 1.4 }}>{v.desc}</p>
            <div style={{ position: "relative" }}>
              <button style={v.style}>
                {v.accent && (
                  <span style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, background: "rgba(125,42,3,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                  </span>
                )}
                I've completed these steps
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
