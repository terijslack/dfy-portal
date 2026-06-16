import { useState } from "react";

const PlatformIcons: Record<string, JSX.Element> = {
  instagram: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/>
    </svg>
  ),
  facebook: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/>
      <path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/>
    </svg>
  ),
  linkedin: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/>
      <path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/>
    </svg>
  ),
  tiktok: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/>
      <path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/>
    </svg>
  ),
  google: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/>
      <path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/>
      <path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/>
      <path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/>
      <path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/>
    </svg>
  ),
  x: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/>
      <path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/>
    </svg>
  ),
};

const SmallIcons: Record<string, JSX.Element> = {
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
  tiktok: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
  google: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#000"/><path d="M13.6 11.1 17.8 6h-1l-3.6 4.2L10.2 6H6.8l4.4 6.4L6.8 18h1l3.9-4.5 3.1 4.5h3.4l-4.6-6.9zm-1.4 1.6-.45-.65-3.6-5.14H10l2.9 4.15.45.65 3.75 5.38h-1.55l-3.35-4.39z" fill="white"/></svg>,
};

const PLATFORMS = [
  { id: "instagram", name: "Instagram", color: "#E1306C", bg: "#FDE8F0", instruction: "Open the app, tap your profile photo — your handle is shown as @yourname at the top.", placeholder: "@yourname" },
  { id: "facebook", name: "Facebook", color: "#1877F2", bg: "#E7F0FD", instruction: "Go to your Page, click Edit Page Info — your @handle appears under Username.", placeholder: "@handle" },
  { id: "linkedin", name: "LinkedIn", color: "#0A66C2", bg: "#E7F0FB", instruction: "Go to your Company Page, click Edit page — find your Public URL, the last part is your handle.", placeholder: "company-name" },
  { id: "tiktok", name: "TikTok", color: "#010101", bg: "#F0F0F0", instruction: "Open TikTok, tap the profile icon — your @username is shown below your profile photo.", placeholder: "@yourname" },
  { id: "google", name: "Google Business", color: "#34A853", bg: "#E6F4EB", instruction: "Search your business on Google, click your listing — your business name appears in the panel.", placeholder: "Business Name" },
  { id: "x", name: "X (Twitter)", color: "#000000", bg: "#F0F0F0", instruction: "Go to X.com, click your profile — your @username is shown below your display name.", placeholder: "@username" },
];

export function InstructionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [handles, setHandles] = useState<Record<string, string>>({});

  const isSummary = currentStep === PLATFORMS.length;
  const platform = PLATFORMS[currentStep];
  const progressPct = ((currentStep + 1) / PLATFORMS.length) * 100;

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(31,61,44,0.1)", overflow: "hidden" }}>

        {!isSummary ? (
          <>
            {/* Header with progress */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(31,61,44,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                style={{ padding: 6, background: "none", border: "none", cursor: currentStep === 0 ? "default" : "pointer", opacity: currentStep === 0 ? 0 : 1, borderRadius: 8, display: "flex" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1F3D2C", textAlign: "center", marginBottom: 6 }}>
                  Step {currentStep + 1} of {PLATFORMS.length}
                </div>
                <div style={{ height: 5, background: "rgba(31,61,44,0.08)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progressPct}%`, background: "#2D6B4F", borderRadius: 3, transition: "width 0.3s ease" }}/>
                </div>
              </div>
              <div style={{ width: 32 }}/>
            </div>

            {/* Content */}
            <div style={{ padding: "32px 28px" }}>
              {/* Platform icon */}
              <div style={{ width: 72, height: 72, borderRadius: 18, background: platform.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                {PlatformIcons[platform.id]}
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1F3D2C", textAlign: "center", margin: "0 0 8px" }}>
                {platform.name}
              </h2>

              <div style={{ background: "#F5F2EA", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, textAlign: "center", margin: 0 }}>
                  {platform.instruction}
                </p>
              </div>

              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#4B5563", marginBottom: 8 }}>
                Your {platform.name} handle
              </label>
              <input
                type="text"
                value={handles[platform.id] || ""}
                onChange={e => setHandles(h => ({ ...h, [platform.id]: e.target.value }))}
                placeholder={platform.placeholder}
                style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 14, color: "#1F3D2C", background: "#FAFAFA", border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 10, outline: "none", fontFamily: "inherit", marginBottom: 20 }}
              />

              <button
                onClick={() => setCurrentStep(s => s + 1)}
                style={{ width: "100%", padding: "13px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                {currentStep === PLATFORMS.length - 1 ? "Review Summary" : "Next Platform →"}
              </button>
            </div>
          </>
        ) : (
          /* Summary screen */
          <div style={{ padding: "32px 28px" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EBC99B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1F3D2C", textAlign: "center", margin: "0 0 6px" }}>
              All done!
            </h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", margin: "0 0 24px" }}>
              Here's what your team will use to find your accounts.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F9F9F7", borderRadius: 10, border: "1px solid rgba(31,61,44,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {SmallIcons[p.id]}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2C" }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: handles[p.id] ? "#2D6B4F" : "#D1D5DB", fontWeight: handles[p.id] ? 500 : 400 }}>
                    {handles[p.id] || "Skipped"}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setCurrentStep(0)} style={{ flex: 1, padding: "12px", background: "none", border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#6B7280", cursor: "pointer", fontFamily: "inherit" }}>
                Edit
              </button>
              <button style={{ flex: 1, padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Confirm & Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
