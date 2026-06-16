import { useState } from "react";

type PlatformId = "instagram" | "facebook" | "linkedin" | "tiktok" | "google" | "x";

interface Platform {
  id: PlatformId;
  name: string;
  icon: JSX.Element;
  smallIcon: JSX.Element;
  placeholder: string;
}

const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    placeholder: "@yourhandle",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
  },
  {
    id: "facebook",
    name: "Facebook",
    placeholder: "facebook.com/yourpage",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    placeholder: "linkedin.com/company/yourpage",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
  },
  {
    id: "tiktok",
    name: "TikTok",
    placeholder: "@yourhandle",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
  },
  {
    id: "google",
    name: "Google Business",
    placeholder: "Business Profile Link",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
  },
  {
    id: "x",
    name: "X (Twitter)",
    placeholder: "@yourhandle",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/><path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/><path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/></svg>,
  },
];

export function CardGrid() {
  const [selected, setSelected] = useState<Set<PlatformId>>(new Set());
  const [handles, setHandles] = useState<Record<string, string>>({});

  const toggle = (id: PlatformId) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const active = PLATFORMS.filter(p => selected.has(p.id));

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "white", borderRadius: 24, padding: "36px 32px", boxShadow: "0 4px 24px rgba(31,61,44,0.07)", border: "1px solid rgba(235,201,155,0.3)" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1F3D2C", margin: "0 0 8px" }}>Where can we find you?</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Select the platforms your business is active on.</p>
        </div>

        {/* Platform selection grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          {PLATFORMS.map(p => {
            const isOn = selected.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 12px",
                  borderRadius: 16,
                  border: isOn ? "2px solid #2D6B4F" : "2px solid rgba(31,61,44,0.08)",
                  background: isOn ? "rgba(45,107,79,0.05)" : "#FAFAF8",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
              >
                {isOn && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4.2 7.2 L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
                <div style={{ marginBottom: 10, opacity: isOn ? 1 : 0.5 }}>{p.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: isOn ? "#1F3D2C" : "#9CA3AF" }}>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Handles section */}
        <div style={{ borderTop: "1px solid rgba(31,61,44,0.08)", paddingTop: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1F3D2C", margin: "0 0 16px" }}>Your handles</h3>

          {active.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 16px", borderRadius: 12, border: "1.5px dashed rgba(31,61,44,0.15)", background: "#FAFAF8" }}>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select at least one platform above to add your handles.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {active.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {p.smallIcon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2C", width: 110, flexShrink: 0 }}>{p.name}</span>
                  <input
                    type="text"
                    value={handles[p.id] || ""}
                    onChange={e => setHandles(h => ({ ...h, [p.id]: e.target.value }))}
                    placeholder={p.placeholder}
                    style={{ flex: 1, padding: "9px 12px", fontSize: 13, color: "#1F3D2C", background: "#F9F9F7", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button style={{ padding: "11px 28px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  Save Handles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardGrid;
