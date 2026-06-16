import { useState } from "react";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
  },
  {
    id: "facebook",
    name: "Facebook",
    hint: "Your page URL or handle",
    placeholder: "Page name or URL",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    hint: "Company page URL",
    placeholder: "Company page",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
  },
  {
    id: "tiktok",
    name: "TikTok",
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
  },
  {
    id: "google",
    name: "Google Business",
    hint: "Your maps listing link",
    placeholder: "Maps URL",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
  },
  {
    id: "x",
    name: "X (Twitter)",
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/><path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/></svg>,
  },
];

export function QuickTable() {
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [hintId, setHintId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const completedCount = Object.values(handles).filter(v => v.trim() !== "").length;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 580, background: "white", borderRadius: 10, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

        {/* Table header bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #E5E7EB", background: "#FAFAFA" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1F3D2C" }}>Social Handles</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#1F3D2C", background: "#F5F2EA", padding: "3px 10px", borderRadius: 20 }}>
            {completedCount} of {PLATFORMS.length} added
          </span>
        </div>

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 64px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ padding: "8px 16px", fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform</div>
          <div style={{ padding: "8px 16px", fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Handle / URL</div>
          <div style={{ padding: "8px 16px", fontSize: 10, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Done</div>
        </div>

        {/* Rows */}
        {PLATFORMS.map((p, i) => {
          const value = handles[p.id] || "";
          const done = value.trim() !== "";
          return (
            <div
              key={p.id}
              style={{ display: "grid", gridTemplateColumns: "200px 1fr 64px", borderBottom: i < PLATFORMS.length - 1 ? "1px solid #F3F4F6" : "none", background: "white", transition: "background 0.1s" }}
            >
              {/* Platform name cell */}
              <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ opacity: done ? 1 : 0.5 }}>{p.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2C" }}>{p.name}</span>
                <div style={{ position: "relative" }}>
                  <button
                    onMouseEnter={() => setHintId(p.id)}
                    onMouseLeave={() => setHintId(null)}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.35 }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </button>
                  {hintId === p.id && (
                    <div style={{ position: "absolute", left: 18, top: -4, background: "#1F3D2C", color: "#F5F2EA", fontSize: 11, padding: "5px 10px", borderRadius: 6, whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                      {p.hint}
                    </div>
                  )}
                </div>
              </div>

              {/* Input cell */}
              <div style={{ padding: "6px 12px", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={value}
                  onChange={e => setHandles(h => ({ ...h, [p.id]: e.target.value }))}
                  placeholder={p.placeholder}
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid transparent", padding: "4px 0", fontSize: 13, color: "#1F3D2C", outline: "none", fontFamily: "inherit" }}
                  onFocus={e => { (e.target as HTMLInputElement).style.borderBottomColor = "#D1D5DB"; }}
                  onBlur={e => { (e.target as HTMLInputElement).style.borderBottomColor = "transparent"; }}
                />
              </div>

              {/* Status cell */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, border: done ? "none" : "1.5px solid #D1D5DB", background: done ? "#2D6B4F" : "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {done && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5 L4.5 8 L9 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px", borderTop: "1px solid #E5E7EB", background: "#FAFAFA" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? (
              <span>Saving…</span>
            ) : justSaved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7 L5.5 10.5 L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Saved
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickTable;
