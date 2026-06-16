import { useState } from "react";

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    bg: "#FDE8F0",
    instruction: `Open the Instagram app, tap your profile photo — your handle is shown as @yourname at the top.`,
    placeholder: "@yourbusiness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    bg: "#E7F0FD",
    instruction: `Go to your Facebook Page, click Edit Page Info — your @handle appears under Username.`,
    placeholder: "@yourbusiness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/>
        <path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    bg: "#E7F0FB",
    instruction: `Go to your LinkedIn Company Page, click Edit page — find your Public URL. The last part of the URL is your handle.`,
    placeholder: "company/yourbusiness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/>
        <path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    bg: "#F0F0F0",
    instruction: `Open TikTok, tap your profile icon — your username is shown as @yourname below your profile photo.`,
    placeholder: "@yourbusiness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/>
        <path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "google",
    name: "Google Business",
    bg: "#E6F4EB",
    instruction: `Search your business on Google, click your listing — your short business name appears in the Business Profile panel on the right.`,
    placeholder: "Your Business Name",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
        <path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/>
        <path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/>
        <path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/>
        <path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    bg: "#F0F0F0",
    instruction: `Go to X.com, click your profile — your handle is the @username shown below your display name.`,
    placeholder: "@yourbusiness",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/>
        <path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/>
      </svg>
    ),
  },
];

interface PlatformState {
  handle: string;
  done: boolean;
}

export function SocialChecklist() {
  const [platforms, setPlatforms] = useState<Record<string, PlatformState>>(
    Object.fromEntries(PLATFORMS.map(p => [p.id, { handle: "", done: false }]))
  );
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const completedCount = Object.values(platforms).filter(p => p.done).length;
  const totalCount = PLATFORMS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const circumference = 81.7;

  const update = (id: string, field: "handle" | "done", value: string | boolean) => {
    setSaved(false);
    setPlatforms(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F5F2EA", minHeight: "100vh", padding: "0 0 48px" }}>

      {/* Section Header */}
      <div style={{ padding: "28px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1F3D2C", margin: 0, letterSpacing: "-0.3px" }}>
              Social Media Accounts
            </h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0", lineHeight: 1.5 }}>
              Share your handles so your team knows where to post on your behalf. No passwords needed.
            </p>
          </div>

          {/* Progress ring */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "white", borderRadius: 999,
            padding: "7px 16px 7px 10px",
            border: "1.5px solid rgba(45,107,79,0.15)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            flexShrink: 0,
          }}>
            <svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="17" cy="17" r="13" fill="none" stroke="rgba(31,61,44,0.1)" strokeWidth="3"/>
              <circle
                cx="17" cy="17" r="13" fill="none" stroke="#2D6B4F" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(progressPct / 100) * circumference} ${circumference}`}
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D2C", lineHeight: 1 }}>{completedCount}/{totalCount}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", lineHeight: 1.3, marginTop: 1 }}>platforms</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(31,61,44,0.08)", borderRadius: 2, margin: "16px 0 24px" }}>
          <div style={{
            height: "100%", borderRadius: 2, background: "#2D6B4F",
            width: `${progressPct}%`, transition: "width 0.4s ease",
          }}/>
        </div>
      </div>

      {/* Platform list */}
      <div style={{ padding: "0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
        {PLATFORMS.map(platform => {
          const state = platforms[platform.id];
          const isDone = state.done;
          const hasHandle = state.handle.trim().length > 0;

          return (
            <div
              key={platform.id}
              style={{
                background: isDone ? "rgba(45,107,79,0.04)" : "white",
                border: isDone ? "1.5px solid rgba(45,107,79,0.3)" : "1.5px solid rgba(31,61,44,0.1)",
                borderRadius: 12,
                padding: "16px 18px",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {/* Platform icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: platform.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {platform.icon}
                </div>

                {/* Name + instruction + input */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1F3D2C" }}>
                      {platform.name}
                    </div>
                    {isDone && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#2D6B4F",
                        background: "rgba(45,107,79,0.1)",
                        borderRadius: 999, padding: "2px 9px",
                      }}>
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 11.5, color: "#6B7280", lineHeight: 1.5, marginBottom: 10 }}>
                    {platform.instruction}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="text"
                      value={state.handle}
                      onChange={e => update(platform.id, "handle", e.target.value)}
                      placeholder={platform.placeholder}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        fontSize: 13,
                        color: "#1F3D2C",
                        background: isDone ? "rgba(45,107,79,0.04)" : "#FAFAFA",
                        border: `1.5px solid ${hasHandle ? "rgba(45,107,79,0.4)" : "rgba(31,61,44,0.12)"}`,
                        borderRadius: 8,
                        outline: "none",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s",
                      }}
                    />

                    {/* Completion checkbox */}
                    <button
                      onClick={() => update(platform.id, "done", !isDone)}
                      title={isDone ? "Mark incomplete" : "Mark complete"}
                      style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        border: isDone ? "none" : "1.5px solid rgba(31,61,44,0.2)",
                        background: isDone ? "#2D6B4F" : "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "all 0.18s ease", padding: 0,
                      }}
                    >
                      {isDone ? (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8 L6.5 11.5 L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7 L5.8 10.3 L11.5 3.7" stroke="rgba(31,61,44,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes field */}
      <div style={{ padding: "18px 32px 0" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", display: "block", marginBottom: 6 }}>
          Additional notes <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); setSaved(false); }}
          placeholder="e.g. Our Instagram was set up under a personal account, TikTok is brand new…"
          rows={2}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px", fontSize: 13, color: "#1F3D2C",
            background: "white",
            border: "1.5px solid rgba(31,61,44,0.12)",
            borderRadius: 10, outline: "none",
            fontFamily: "inherit", resize: "vertical", lineHeight: 1.5,
          }}
        />
      </div>

      {/* Save bar */}
      <div style={{
        margin: "20px 32px 0", padding: "14px 0 0",
        borderTop: "1px solid rgba(31,61,44,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          fontSize: 12,
          color: saved ? "#2D6B4F" : "#9CA3AF",
          fontWeight: saved ? 600 : 400,
        }}>
          {saved ? "✓ Saved successfully" : "Changes will be saved to your profile"}
        </span>
        <button
          onClick={() => setSaved(true)}
          style={{
            background: "#1F3D2C", color: "white", border: "none",
            borderRadius: 9, padding: "10px 24px",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Save Section
        </button>
      </div>
    </div>
  );
}
