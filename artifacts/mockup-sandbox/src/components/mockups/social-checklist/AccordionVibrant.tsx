import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    accent: "#1F3D2C", urlPlaceholder: "https://facebook.com/yourpagename",
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
    id: "instagram", name: "Instagram",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    accent: "#2D6B4F", urlPlaceholder: "https://instagram.com/yourhandle",
    steps: [
      "Complete the Facebook Page steps above first — Instagram access is managed through Facebook.",
      "If your Instagram is connected to your Facebook Page, access carries over automatically.",
      "To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.",
      "If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page.",
    ],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    accent: "#1F3D2C", urlPlaceholder: "https://linkedin.com/company/your-company",
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
    id: "tiktok", name: "TikTok",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    accent: "#2D6B4F", urlPlaceholder: "https://tiktok.com/@yourhandle",
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
];

const PLANS = [
  { id: "starter", label: "Starter Presence", limit: 2 },
  { id: "growth", label: "Growth Engine", limit: 4 },
];

export function AccordionVibrant() {
  const [plan, setPlan] = useState<"starter" | "growth">("starter");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});

  const limit = plan === "starter" ? 2 : 4;
  const atLimit = selected.length >= limit;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = selected.length > 0 ? (completedCount / selected.length) * 100 : 0;

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id));
      setCompleted(c => { const n = { ...c }; delete n[id]; return n; });
      setUrls(u => { const n = { ...u }; delete n[id]; return n; });
      if (openId === id) setOpenId(null);
    } else {
      if (atLimit) return;
      setSelected(s => [...s, id]);
    }
  };

  const markDone = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCompleted(c => ({ ...c, [id]: true }));
    setOpenId(null);
  };

  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: "0 0 40px" }}>

      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, #1F3D2C 0%, #2D6B4F 100%)", padding: "28px 28px 24px", marginBottom: 28 }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Social Media Access</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", margin: "0 0 8px", lineHeight: 1.25 }}>Let's get connected</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 18px", lineHeight: 1.6 }}>
            To get started managing your social media, we'll need admin access to your accounts. Follow the steps below for each platform you use. If you get stuck on any step, don't hesitate to reach out and we will walk you through it!
          </p>

          {/* Plan toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.12)", borderRadius: 24, padding: 3, gap: 2 }}>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setOpenId(null); }}
                style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "white" : "transparent", color: plan === p.id ? "#1F3D2C" : "rgba(255,255,255,0.7)", transition: "all 0.18s" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px" }}>

        {/* Platform chips */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your platforms</span>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: atLimit ? "rgba(125,42,3,0.1)" : "rgba(45,107,79,0.1)", color: atLimit ? "#7D2A03" : "#2D6B4F" }}>
              {selected.length}/{limit} selected
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isLocked = !isSel && atLimit;
              return (
                <button key={p.id} onClick={() => toggleSelect(p.id)} disabled={isLocked}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 24, border: "2px solid", borderColor: isSel ? "#2D6B4F" : isLocked ? "rgba(31,61,44,0.07)" : "rgba(31,61,44,0.18)", background: isSel ? "#2D6B4F" : isLocked ? "rgba(31,61,44,0.03)" : "white", color: isSel ? "white" : isLocked ? "#C4C4C4" : "#1F3D2C", cursor: isLocked ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", opacity: isLocked ? 0.45 : 1, transition: "all 0.15s", boxShadow: isSel ? "0 2px 8px rgba(45,107,79,0.25)" : "none" }}>
                  <span style={{ color: isSel ? "white" : isLocked ? "#C4C4C4" : "#1F3D2C" }}>{p.icon}</span>
                  {p.name}
                  {isSel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>}
                </button>
              );
            })}
          </div>
          {atLimit && <p style={{ fontSize: 11, color: "#7D2A03", marginTop: 8, marginBottom: 0 }}>Plan limit reached — deselect a platform to swap.</p>}
        </div>

        {/* Progress bar */}
        {selected.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2D6B4F" }}>{completedCount}/{selected.length} done</span>
            </div>
            <div style={{ height: 6, background: "rgba(31,61,44,0.1)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #2D6B4F, #4CAF78)", borderRadius: 6, transition: "width 0.4s ease" }}/>
            </div>
          </div>
        )}

        {/* Accordion */}
        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "white", borderRadius: 16, border: "2px dashed rgba(31,61,44,0.12)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>☝️</div>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select the platforms you use above to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];
              return (
                <div key={p.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: isOpen ? "0 6px 24px rgba(31,61,44,0.12)" : "0 1px 4px rgba(0,0,0,0.05)", border: `1.5px solid ${isOpen ? "#2D6B4F" : isDone ? "rgba(45,107,79,0.2)" : "rgba(31,61,44,0.08)"}`, transition: "all 0.2s" }}>
                  {/* Left accent bar */}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: 4, flexShrink: 0, background: isDone ? "#2D6B4F" : isOpen ? "#2D6B4F" : "transparent", transition: "background 0.2s" }}/>
                    <div style={{ flex: 1 }}>
                      <button onClick={() => setOpenId(isOpen ? null : p.id)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: isDone ? "rgba(45,107,79,0.08)" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#1F3D2C" }}>{p.icon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D2C", marginBottom: 1 }}>{p.name}</div>
                            {!isDone && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{p.steps.length} steps</div>}
                            {isDone && <div style={{ fontSize: 11, color: "#2D6B4F", fontWeight: 600 }}>Access granted ✓</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {isDone && <span style={{ fontSize: 18 }}>🎉</span>}
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: isOpen ? "#2D6B4F" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
                              <polyline points="6,9 12,15 18,9"/>
                            </svg>
                          </div>
                        </div>
                      </button>

                      {isOpen && (
                        <div style={{ borderTop: "1px solid rgba(31,61,44,0.06)", padding: "16px 16px 18px" }}>
                          <ol style={{ margin: "0 0 14px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                            {p.steps.map((step, i) => (
                              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", marginTop: 1 }}>{i + 1}</span>
                                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, paddingTop: 3 }}>{step}</span>
                              </li>
                            ))}
                          </ol>
                          <div style={{ background: "linear-gradient(135deg, #F0F7F3, #E8F4EE)", border: "1px solid rgba(45,107,79,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8 }}>
                            <span style={{ fontSize: 14 }}>✅</span>
                            <p style={{ fontSize: 12, color: "#2D6B4F", margin: 0, lineHeight: 1.5 }}>{p.note}</p>
                          </div>
                          <div style={{ marginBottom: 14 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                              Paste a link to your {p.name} page <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span>
                            </label>
                            <div style={{ position: "relative" }}>
                              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                              </span>
                              <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                                style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#F9F9F7", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button onClick={e => markDone(p.id, e)}
                              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #2D6B4F, #1F3D2C)", color: "white", border: "none", borderRadius: 24, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 3px 10px rgba(45,107,79,0.3)", letterSpacing: "0.02em" }}>
                              Done — grant access ✓
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.6 }}>
          🔒 We will never ask for your passwords. If you need help, just reply to your onboarding email.
        </p>
      </div>
    </div>
  );
}
