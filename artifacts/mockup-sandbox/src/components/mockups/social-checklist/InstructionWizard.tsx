import { useState } from "react";

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook Page",
    color: "#1877F2",
    bg: "#E7F0FD",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    steps: [
      "Log into Facebook and go to your Business Page — not your personal profile.",
      "Click Professional Dashboard near the top of your page.",
      "On the left menu, click Page Access.",
      "Under People with Facebook Access, click Add New.",
      "Search for our account: [Agency Facebook Profile].",
      "Toggle on Allow this person to have full control.",
      "Click Give Access and confirm.",
    ],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bg: "#FDE8F0",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    steps: [
      "Complete the Facebook Page steps first — Instagram access is managed through Facebook.",
      "If Instagram is connected to your Facebook Page, access carries over automatically.",
      "To verify: Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.",
      "Not connected yet? Open Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page.",
    ],
    note: "Once Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin",
    name: "LinkedIn Page",
    color: "#0A66C2",
    bg: "#E7F0FB",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    steps: [
      "Log into LinkedIn and go to your Company Page — not your personal profile.",
      "Click Admin Tools in the top right corner of your page.",
      "Select Manage Admins.",
      "Click Add Admin.",
      "Search for our profile: [Agency LinkedIn Profile].",
      "Choose Super Admin for full access.",
      "Click Save.",
    ],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "google",
    name: "Google Business",
    color: "#34A853",
    bg: "#E6F4EB",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    steps: [
      "Go to business.google.com and log in.",
      "Select your business profile if you have more than one.",
      "Click Business Profile Settings → then Managers.",
      "Click the Add button (person icon with a plus sign).",
      "Enter our Google account email: [Agency Gmail].",
      "Select Manager for full access.",
      "Click Invite.",
    ],
    note: "We'll accept the invite within 24 hours.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#010101",
    bg: "#F0F0F0",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    steps: [
      "Log into TikTok on a desktop browser at tiktok.com.",
      "Go to your profile and click TikTok Studio.",
      "On the left menu, click Settings.",
      "Select Account → then Creator Permissions.",
      "Click Authorize and enter our handle: [Agency TikTok Handle].",
      "Grant the permissions listed and confirm.",
    ],
    note: "TikTok's admin access is more limited — we'll cover what's included in your kickoff call.",
  },
  {
    id: "yelp",
    name: "Yelp",
    color: "#D32323",
    bg: "#FDEAEA",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#D32323"/><text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="serif">y</text></svg>,
    smallIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#D32323"/><text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="serif">y</text></svg>,
    steps: [
      "Log into your Yelp Business account at biz.yelp.com.",
      "Click your business name in the top right.",
      "Go to Business Information → Account Settings → Users.",
      "Click Invite User.",
      "Enter our email: [Agency Email].",
      "Select Admin as the role.",
      "Click Send Invite.",
    ],
    note: "We'll accept and confirm once received.",
  },
];

export function InstructionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const isSummary = currentStep === PLATFORMS.length;
  const platform = PLATFORMS[currentStep];

  const markDoneAndNext = () => {
    if (!isSummary) {
      setCompleted(c => ({ ...c, [platform.id]: true }));
      setCurrentStep(s => s + 1);
    }
  };

  const skipAndNext = () => {
    setCurrentStep(s => Math.min(PLATFORMS.length, s + 1));
  };

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(31,61,44,0.1)", overflow: "hidden" }}>

        {!isSummary ? (
          <>
            {/* Progress header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(31,61,44,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                style={{ padding: 6, background: "none", border: "none", cursor: currentStep === 0 ? "default" : "pointer", opacity: currentStep === 0 ? 0 : 1, borderRadius: 8, display: "flex" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1F3D2C", textAlign: "center", marginBottom: 5 }}>
                  {currentStep + 1} of {PLATFORMS.length}
                </div>
                <div style={{ height: 4, background: "rgba(31,61,44,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${((currentStep + 1) / PLATFORMS.length) * 100}%`, background: "#2D6B4F", borderRadius: 2, transition: "width 0.3s ease" }}/>
                </div>
              </div>
              <div style={{ width: 30 }}/>
            </div>

            {/* Platform content */}
            <div style={{ padding: "24px 24px 20px" }}>
              {/* Icon */}
              <div style={{ width: 64, height: 64, borderRadius: 16, background: platform.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                {platform.icon}
              </div>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1F3D2C", textAlign: "center", margin: "0 0 18px" }}>
                {platform.name}
              </h2>

              {/* Steps list */}
              <ol style={{ margin: "0 0 14px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                {platform.steps.map((step, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#2D6B4F", marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ol>

              {/* Note */}
              <div style={{ background: "#F0F7F3", border: "1px solid rgba(45,107,79,0.2)", borderRadius: 8, padding: "9px 12px", marginBottom: 18, display: "flex", gap: 7 }}>
                <span style={{ fontSize: 12 }}>✅</span>
                <p style={{ fontSize: 12, color: "#2D6B4F", margin: 0, lineHeight: 1.5 }}>{platform.note}</p>
              </div>

              {/* Action buttons */}
              <button
                onClick={markDoneAndNext}
                style={{ width: "100%", padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}
              >
                {currentStep === PLATFORMS.length - 1 ? "Done — See Summary" : "I've completed these steps →"}
              </button>
              <button
                onClick={skipAndNext}
                style={{ width: "100%", padding: "10px", background: "none", color: "#9CA3AF", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                Skip — not on this platform
              </button>
            </div>
          </>
        ) : (
          /* Summary screen */
          <div style={{ padding: "28px 24px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EBC99B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F3D2C", textAlign: "center", margin: "0 0 6px" }}>
              Access requests submitted!
            </h2>
            <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", margin: "0 0 22px", lineHeight: 1.5 }}>
              Here's a summary of what you've completed. We'll confirm access from our side within 24 hours.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F9F9F7", borderRadius: 10, border: "1px solid rgba(31,61,44,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {p.smallIcon}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1F3D2C" }}>{p.name}</span>
                  </div>
                  {completed[p.id] ? (
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2D6B4F", background: "rgba(45,107,79,0.1)", padding: "3px 10px", borderRadius: 20 }}>Done ✓</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>Skipped</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => { setCurrentStep(0); setCompleted({}); }}
              style={{ width: "100%", padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
