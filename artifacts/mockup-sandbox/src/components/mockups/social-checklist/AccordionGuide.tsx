import { useState } from "react";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    placeholder: "@yourname",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    steps: ["Open Instagram app.", "Tap your profile photo bottom-right.", "Your handle appears as @yourname at the top."],
  },
  {
    id: "facebook",
    name: "Facebook",
    placeholder: "@handle",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    steps: ["Go to your Facebook Page.", "Click \"Edit Page Info\".", "Your @handle is listed under \"Username\"."],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    placeholder: "company-name",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    steps: ["Visit your LinkedIn Company Page.", "Click \"Edit page\".", "Find \"Public URL\" — the last segment is your handle."],
  },
  {
    id: "tiktok",
    name: "TikTok",
    placeholder: "@username",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    steps: ["Open TikTok.", "Tap the profile icon bottom-right.", "Your @username is shown below your profile photo."],
  },
  {
    id: "google",
    name: "Google Business",
    placeholder: "Business Name",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    steps: ["Search your business name on Google.", "Click your listing.", "Your business name from the panel is what to share here."],
  },
  {
    id: "x",
    name: "X (Twitter)",
    placeholder: "@username",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/><path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/></svg>,
    steps: ["Go to X.com.", "Click your profile.", "Your @username is shown directly below your display name."],
  },
];

export function AccordionGuide() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  const markDone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (handles[id]?.trim()) {
      setCompleted(c => ({ ...c, [id]: true }));
      setOpenId(null);
    }
  };

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1F3D2C", margin: "0 0 8px" }}>Connect your accounts</h2>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
            We need your social handles so our team knows where to post.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PLATFORMS.map(p => {
            const isOpen = openId === p.id;
            const isDone = completed[p.id];
            const value = handles[p.id] || "";

            return (
              <div
                key={p.id}
                style={{
                  background: "white",
                  borderRadius: 14,
                  border: `1.5px solid ${isOpen ? "#2D6B4F" : "rgba(31,61,44,0.1)"}`,
                  boxShadow: isOpen ? "0 4px 16px rgba(45,107,79,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Accordion trigger */}
                <button
                  onClick={() => toggle(p.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isDone ? "rgba(45,107,79,0.1)" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1F3D2C" }}>{p.name}</div>
                      {isDone && value && (
                        <div style={{ fontSize: 12, color: "#2D6B4F", marginTop: 2 }}>{value}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    {isDone ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="1.5" strokeOpacity="0.25"><circle cx="12" cy="12" r="10"/></svg>
                    )}
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease", opacity: 0.5 }}
                    >
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </div>
                </button>

                {/* Expandable body */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid rgba(31,61,44,0.06)", padding: "16px 18px 18px" }}>
                    <div style={{ paddingLeft: 54 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 10px" }}>How to find it</p>
                      <ol style={{ paddingLeft: 0, margin: "0 0 16px", listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                        {p.steps.map((step, i) => (
                          <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                            <span style={{ fontWeight: 700, color: "#9CA3AF", flexShrink: 0, width: 16 }}>{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div style={{ display: "flex", gap: 10 }}>
                        <input
                          type="text"
                          value={value}
                          onChange={e => setHandles(h => ({ ...h, [p.id]: e.target.value }))}
                          placeholder={p.placeholder}
                          style={{ flex: 1, padding: "10px 14px", fontSize: 13, color: "#1F3D2C", background: "#F9F9F7", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}
                        />
                        <button
                          onClick={e => markDone(p.id, e)}
                          disabled={!value.trim()}
                          style={{ padding: "10px 20px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: value.trim() ? "pointer" : "not-allowed", opacity: value.trim() ? 1 : 0.45, fontFamily: "inherit" }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
