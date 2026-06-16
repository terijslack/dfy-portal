import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook Page",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#1877F2"/><path d="M13.5 8h-1.5a.5.5 0 0 0-.5.5V10H13l-.5 2H11.5v5H9.5v-5H8v-2h1.5V8.5A2.5 2.5 0 0 1 11 6h2.5v2z" fill="white"/></svg>,
    steps: [
      "Log into Facebook and go to your Business Page (not your personal profile).",
      "Click Professional Dashboard near the top of your page.",
      "On the left side menu, click Page Access.",
      "Under People with Facebook Access, click Add New.",
      "Search for our Facebook account: [Agency Facebook Profile].",
      "Toggle on Allow this person to have full control for full admin access.",
      "Click Give Access and confirm.",
    ],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="#E1306C" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/></svg>,
    steps: [
      "Complete the Facebook Page steps above first — Instagram access is managed through Facebook.",
      "If your Instagram is connected to your Facebook Page, access carries over automatically.",
      "To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.",
      "If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page.",
    ],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin",
    name: "LinkedIn Page",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2"/><path d="M7 10h2v7H7v-7zm1-3a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 8 7zm4 3h1.9v1h.02C14.22 10.4 15 9.9 16.5 9.9 18.5 9.9 19 11 19 13v4h-2v-3.5c0-.83-.3-1.5-1.1-1.5-.6 0-1 .4-1.15.8-.06.14-.08.32-.08.5V17h-2V10z" fill="white"/></svg>,
    steps: [
      "Log into LinkedIn and navigate to your Company Page (not your personal profile).",
      "Click Admin Tools in the top right corner of your page.",
      "Select Manage Admins.",
      "Click Add Admin.",
      "Search for our LinkedIn profile: [Agency LinkedIn Profile].",
      "Select the admin role — choose Super Admin for full access.",
      "Click Save.",
    ],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "google",
    name: "Google Business",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="1"/><path d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.63z" fill="#4285F4"/><path d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H3.95v2.33A8.99 8.99 0 0 0 12 21z" fill="#34A853"/><path d="M6.96 13.71A5.41 5.41 0 0 1 6.68 12c0-.59.1-1.17.28-1.71V7.96H3.95A8.99 8.99 0 0 0 3 12c0 1.45.35 2.82.95 4.04l3.01-2.33z" fill="#FBBC05"/><path d="M12 6.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 3.89 14.43 3 12 3A8.99 8.99 0 0 0 3.95 7.96l3.01 2.33C7.67 8.16 9.66 6.58 12 6.58z" fill="#EA4335"/></svg>,
    steps: [
      "Go to business.google.com and log in.",
      "Select your business profile if you have more than one.",
      "Click Business Profile Settings → then Managers.",
      "Click the Add button (person icon with a plus sign).",
      "Enter our Google account email: [Agency Gmail Address].",
      "Select the role — choose Manager for full access.",
      "Click Invite.",
    ],
    note: "We'll accept the invite from our end within 24 hours.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7 1.7-3.7 3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#010101"/><path d="M15.5 6.5c.5 1.2 1.5 2 2.5 2.2v2c-.8-.1-1.6-.4-2.3-.9v4c0 2.1-1.7 3.7-3.7 3.7s-3.7-1.7-3.7-3.7c.2 0 .4 0 .5.02v2c-.2-.03-.35-.05-.5-.05-1 0-1.7.8-1.7 1.7 0 1 .8 1.7 1.7 1.7s1.7-.8 1.7-1.7V6.5h2.1z" fill="white"/></svg>,
    steps: [
      "Log into TikTok on a desktop browser at tiktok.com.",
      "Go to your profile and click TikTok Studio.",
      "On the left menu, click Settings.",
      "Select Account → then Creator Permissions.",
      "Click Authorize and enter our TikTok handle: [Agency TikTok Handle].",
      "Grant the permissions listed and confirm.",
    ],
    note: "TikTok's admin access is more limited than other platforms — we'll discuss what this covers during your kickoff call.",
  },
  {
    id: "yelp",
    name: "Yelp",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#D32323"/><text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="serif">y</text></svg>,
    chipIcon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#D32323"/><text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="serif">y</text></svg>,
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

const PLANS = [
  { id: "starter", label: "Starter Presence", limit: 2 },
  { id: "growth", label: "Growth Engine", limit: 4 },
];

export function AccordionGuide() {
  const [plan, setPlan] = useState<"starter" | "growth">("starter");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const limit = plan === "starter" ? 2 : 4;

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id));
      setCompleted(c => { const n = { ...c }; delete n[id]; return n; });
      if (openId === id) setOpenId(null);
    } else {
      if (selected.length >= limit) return;
      setSelected(s => [...s, id]);
    }
  };

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  const markDone = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCompleted(c => ({ ...c, [id]: true }));
    setOpenId(null);
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const atLimit = selected.length >= limit;

  return (
    <div style={{ backgroundColor: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 540 }}>

        {/* Plan toggle — demo only */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", background: "rgba(31,61,44,0.08)", borderRadius: 24, padding: 3, gap: 2 }}>
            {PLANS.map(p => (
              <button
                key={p.id}
                onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setOpenId(null); }}
                style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", transition: "all 0.18s", background: plan === p.id ? "#2D6B4F" : "transparent", color: plan === p.id ? "white" : "#6B7280" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 21, fontWeight: 700, color: "#1F3D2C", margin: "0 0 10px", lineHeight: 1.3 }}>Grant us access to your accounts</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 18px", lineHeight: 1.65 }}>
            To get started managing your social media, we'll need admin access to your accounts. Follow the steps below for each platform you use. If you get stuck on any step, don't worry, just reach out and we'll walk you through it!
          </p>

          {/* Platform selection chips */}
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 10px", textAlign: "left" }}>
              Which platforms do you use?{" "}
              <span style={{ fontWeight: 400, color: selected.length >= limit ? "#7D2A03" : "#9CA3AF" }}>
                {selected.length}/{limit} selected
              </span>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PLATFORMS.map(p => {
                const isSelected = selected.includes(p.id);
                const isDisabled = !isSelected && atLimit;
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSelect(p.id)}
                    disabled={isDisabled}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 12px", borderRadius: 20, border: "1.5px solid",
                      borderColor: isSelected ? "#2D6B4F" : isDisabled ? "rgba(31,61,44,0.06)" : "rgba(31,61,44,0.15)",
                      background: isSelected ? "rgba(45,107,79,0.08)" : isDisabled ? "rgba(31,61,44,0.03)" : "white",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      fontSize: 12, fontWeight: 600,
                      color: isSelected ? "#2D6B4F" : isDisabled ? "#C4C4C4" : "#374151",
                      fontFamily: "inherit", transition: "all 0.15s",
                      opacity: isDisabled ? 0.5 : 1,
                    }}
                  >
                    <span style={{ opacity: isDisabled ? 0.4 : 1 }}>{p.chipIcon}</span>
                    {p.name}
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
            {atLimit && (
              <p style={{ fontSize: 11, color: "#7D2A03", marginTop: 8, marginBottom: 0, textAlign: "left" }}>
                You've reached your plan limit of {limit} platforms. Deselect one to swap.
              </p>
            )}
          </div>

          {/* Progress — only shown once platforms are selected */}
          {selected.length > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", border: "1px solid rgba(31,61,44,0.12)", borderRadius: 20, padding: "5px 14px", marginTop: 10 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {selected.map(id => (
                  <div key={id} style={{ width: 8, height: 8, borderRadius: "50%", background: completed[id] ? "#2D6B4F" : "rgba(31,61,44,0.12)", transition: "background 0.2s" }}/>
                ))}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1F3D2C" }}>{completedCount} of {selected.length} done</span>
            </div>
          )}
        </div>

        {/* Accordion — only selected platforms */}
        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 20px", background: "white", borderRadius: 14, border: "1.5px dashed rgba(31,61,44,0.15)" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select the platforms you use above to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];

              return (
                <div
                  key={p.id}
                  style={{
                    background: "white",
                    borderRadius: 14,
                    border: `1.5px solid ${isOpen ? "#2D6B4F" : isDone ? "rgba(45,107,79,0.25)" : "rgba(31,61,44,0.1)"}`,
                    boxShadow: isOpen ? "0 4px 16px rgba(45,107,79,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                >
                  <button
                    onClick={() => toggle(p.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: isDone ? "rgba(45,107,79,0.03)" : "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: isDone ? "rgba(45,107,79,0.08)" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {p.icon}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1F3D2C" }}>{p.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      {isDone ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#2D6B4F", background: "rgba(45,107,79,0.1)", padding: "3px 10px", borderRadius: 20 }}>Done ✓</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{p.steps.length} steps</span>
                      )}
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
                      >
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(31,61,44,0.06)" }}>
                      <div style={{ padding: "16px 18px 18px 18px" }}>
                        <ol style={{ margin: "0 0 14px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                          {p.steps.map((step, i) => (
                            <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#2D6B4F", marginTop: 1 }}>{i + 1}</span>
                              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{step}</span>
                            </li>
                          ))}
                        </ol>

                        <div style={{ background: "#F0F7F3", border: "1px solid rgba(45,107,79,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 14 }}>✅</span>
                          <p style={{ fontSize: 12, color: "#2D6B4F", margin: 0, lineHeight: 1.5 }}>{p.note}</p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={e => markDone(p.id, e)}
                            style={{ padding: "9px 22px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            I've completed these steps →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 20, lineHeight: 1.6 }}>
          We will never ask for your passwords. If you need help, just reply to your onboarding email.
        </p>
      </div>
    </div>
  );
}
