import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our LinkedIn profile: [Agency LinkedIn Profile].","Select the admin role — choose Super Admin for full access.","Click Save."],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    urlPlaceholder: "https://tiktok.com/@yourhandle",
    steps: ["Log into TikTok on a desktop browser at tiktok.com.","Go to your profile and click TikTok Studio.","On the left menu, click Settings.","Select Account → then Creator Permissions.","Click Authorize and enter our TikTok handle: [Agency TikTok Handle].","Grant the permissions listed and confirm."],
    note: "TikTok's admin access is more limited than other platforms — we'll discuss what this covers during your kickoff call.",
  },
];

const PLANS = [
  { id: "starter", label: "Starter", limit: 2 },
  { id: "growth", label: "Growth Engine", limit: 4 },
];

export function AccordionBrand3() {
  const [plan, setPlan] = useState<"starter" | "growth">("starter");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});

  const limit = plan === "starter" ? 2 : 4;
  const atLimit = selected.length >= limit;
  const completedCount = Object.values(completed).filter(Boolean).length;

  const handlePlatformClick = (id: string) => {
    const isSel = selected.includes(id);
    if (isSel) {
      // If currently active, deactivate view but keep selected; click again to deselect
      if (activeId === id) {
        setSelected(s => s.filter(x => x !== id));
        setCompleted(c => { const n = { ...c }; delete n[id]; return n; });
        setUrls(u => { const n = { ...u }; delete n[id]; return n; });
        setActiveId(selected.filter(x => x !== id)[0] ?? null);
      } else {
        setActiveId(id);
      }
    } else {
      if (atLimit) return;
      setSelected(s => [...s, id]);
      setActiveId(id);
    }
  };

  const markDone = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCompleted(c => ({ ...c, [id]: true }));
  };

  const activePlatform = PLATFORMS.find(p => p.id === activeId) ?? null;

  return (
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Full-width header */}
      <div style={{ borderBottom: "1px solid rgba(31,61,44,0.08)", padding: "16px 0" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2D6B4F", margin: "0 0 2px" }}>Social Media Access</p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F3D2C", margin: 0, letterSpacing: "-0.02em" }}>Grant us access</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {selected.length > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: completedCount === selected.length ? "#2D6B4F" : "#9CA3AF" }}>
                {completedCount}/{selected.length} done
              </span>
            )}
            <div style={{ display: "inline-flex", background: "#F5F2EA", borderRadius: 6, padding: 2, gap: 1 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setActiveId(null); }}
                  style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "#2D6B4F" : "transparent", color: plan === p.id ? "white" : "#9CA3AF", transition: "all 0.18s" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, maxWidth: 680, margin: "0 auto", width: "100%", display: "flex", boxSizing: "border-box" }}>

        {/* LEFT SIDEBAR — platform selector */}
        <div style={{ width: 200, flexShrink: 0, borderRight: "1px solid rgba(31,61,44,0.07)", padding: "20px 16px", background: "#FAFAF8" }}>
          <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9CA3AF", margin: "0 0 10px" }}>
            Platforms
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isActive = activeId === p.id;
              const isDone = completed[p.id];
              const isLocked = !isSel && atLimit;
              return (
                <button key={p.id} onClick={() => handlePlatformClick(p.id)} disabled={isLocked}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: isActive ? "#2D6B4F" : isSel ? "rgba(45,107,79,0.07)" : "transparent",
                    border: "none",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.35 : 1,
                    fontFamily: "inherit", transition: "all 0.15s", textAlign: "left", width: "100%",
                  }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: isActive ? "rgba(255,255,255,0.15)" : isDone ? "rgba(45,107,79,0.1)" : "rgba(31,61,44,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: isActive ? "white" : isDone ? "#2D6B4F" : "#9CA3AF" }}>{p.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "white" : isSel ? "#1F3D2C" : "#6B7280", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: isActive ? "rgba(255,255,255,0.65)" : isDone ? "#2D6B4F" : "#C4C4C4", fontWeight: 500 }}>
                      {isDone ? "Done ✓" : isSel ? `${PLATFORMS.find(x => x.id === p.id)!.steps.length} steps` : "tap to add"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {atLimit && (
            <p style={{ fontSize: 10, color: "#7D2A03", marginTop: 10, lineHeight: 1.5 }}>Plan limit reached.</p>
          )}

          {/* Progress summary */}
          {selected.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(31,61,44,0.07)" }}>
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9CA3AF", margin: "0 0 8px" }}>Progress</p>
              <div style={{ height: 6, background: "rgba(45,107,79,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#2D6B4F", borderRadius: 3, width: `${selected.length > 0 ? (completedCount / selected.length) * 100 : 0}%`, transition: "width 0.4s" }}/>
              </div>
              <p style={{ fontSize: 11, color: "#6B7280", margin: "6px 0 0" }}>
                {completedCount === 0 ? "Not started" : completedCount === selected.length ? "All done!" : `${completedCount} of ${selected.length}`}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — step content */}
        <div style={{ flex: 1, padding: "20px 20px 32px", overflowY: "auto" }}>

          {!activePlatform ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 320, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0, maxWidth: 220, lineHeight: 1.6 }}>Select a platform on the left to see your access steps.</p>
            </div>
          ) : (
            <div>
              {/* Panel header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid rgba(31,61,44,0.07)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: completed[activePlatform.id] ? "rgba(45,107,79,0.1)" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: completed[activePlatform.id] ? "#2D6B4F" : "#1F3D2C" }}>{activePlatform.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1F3D2C", letterSpacing: "-0.02em" }}>{activePlatform.name}</div>
                  <div style={{ fontSize: 11, color: completed[activePlatform.id] ? "#2D6B4F" : "#9CA3AF", fontWeight: 600 }}>
                    {completed[activePlatform.id] ? "Access granted ✓" : `${activePlatform.steps.length} steps to complete`}
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {activePlatform.steps.map((step, i) => {
                  const isDone = completed[activePlatform.id];
                  return (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isDone ? "#2D6B4F" : "rgba(45,107,79,0.08)", border: isDone ? "none" : "1.5px solid rgba(45,107,79,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: isDone ? "white" : "#2D6B4F", marginTop: 1, transition: "all 0.2s", flexShrink: 0 }}>
                        {isDone
                          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                          : i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: isDone ? "#B0B8C1" : "#374151", lineHeight: 1.6, paddingTop: 3 }}>{step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Note */}
              <div style={{ background: "#F5F2EA", borderLeft: "3px solid #2D6B4F", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 12, color: "#1F3D2C", margin: 0, lineHeight: 1.5 }}>{activePlatform.note}</p>
              </div>

              {/* URL + Done */}
              {!completed[activePlatform.id] && (
                <>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
                      Your {activePlatform.name} link <span style={{ fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      </span>
                      <input type="url" value={urls[activePlatform.id] || ""} onChange={e => setUrls(u => ({ ...u, [activePlatform.id]: e.target.value }))} placeholder={activePlatform.urlPlaceholder}
                        style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#FAFAF8", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                    </div>
                  </div>
                  <button onClick={e => markDone(activePlatform.id, e)}
                    style={{ width: "100%", padding: "11px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    I've completed these steps
                  </button>
                </>
              )}

              {completed[activePlatform.id] && (
                <div style={{ background: "rgba(45,107,79,0.06)", border: "1px solid rgba(45,107,79,0.15)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#2D6B4F", margin: 0 }}>Access granted for {activePlatform.name} ✓</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#D1D5DB", margin: "0 0 16px", padding: "0 20px", lineHeight: 1.6 }}>
        We will never ask for your passwords. Reply to your onboarding email if you need help.
      </p>
    </div>
  );
}
