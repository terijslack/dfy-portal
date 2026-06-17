import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our LinkedIn profile: [Agency LinkedIn Profile].","Select the admin role — choose Super Admin for full access.","Click Save."],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
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
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});

  const limit = plan === "starter" ? 2 : 4;
  const atLimit = selected.length >= limit;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const activePlatform = PLATFORMS.find(p => p.id === activeTab) ?? null;

  const handleTab = (id: string) => {
    const isSel = selected.includes(id);
    if (isSel) {
      // already selected — just switch view, or deselect if it's the only one
      setActiveTab(id);
    } else {
      if (atLimit) return;
      setSelected(s => [...s, id]);
      setActiveTab(id);
    }
  };

  const deselect = (id: string) => {
    setSelected(s => s.filter(x => x !== id));
    setCompleted(c => { const n = { ...c }; delete n[id]; return n; });
    setUrls(u => { const n = { ...u }; delete n[id]; return n; });
    if (activeTab === id) setActiveTab(selected.filter(x => x !== id)[0] ?? null);
  };

  const markDone = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCompleted(c => ({ ...c, [id]: true }));
  };

  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "#F5F2EA", padding: "24px 24px 0" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7D2A03", margin: "0 0 4px" }}>Social Media Access</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1F3D2C", margin: 0, letterSpacing: "-0.02em" }}>Grant us access</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <div style={{ display: "inline-flex", background: "rgba(31,61,44,0.08)", borderRadius: 6, padding: 2, gap: 1 }}>
                {PLANS.map(p => (
                  <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setActiveTab(null); }}
                    style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "#2D6B4F" : "transparent", color: plan === p.id ? "white" : "#9CA3AF", transition: "all 0.18s" }}>
                    {p.label}
                  </button>
                ))}
              </div>
              {selected.length > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: completedCount === selected.length ? "#7D2A03" : "#2D6B4F" }}>
                  {completedCount}/{selected.length} done
                </span>
              )}
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#6B7280", margin: "8px 0 16px", lineHeight: 1.6 }}>
            Select a platform to add it and see your steps. Tap between tabs to switch.
          </p>
        </div>
      </div>

      {/* Platform tabs — 4 equal width */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 4 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isActive = activeTab === p.id;
              const isDone = completed[p.id];
              const isLocked = !isSel && atLimit;
              return (
                <button key={p.id} onClick={() => handleTab(p.id)} disabled={isLocked}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    padding: "14px 8px 12px",
                    borderRadius: 12,
                    background: isDone ? "rgba(45,107,79,0.1)" : isActive ? "#1F3D2C" : isSel ? "white" : "rgba(31,61,44,0.04)",
                    border: `2px solid ${isDone ? "#2D6B4F" : isActive ? "#1F3D2C" : isSel ? "rgba(31,61,44,0.2)" : "rgba(31,61,44,0.08)"}`,
                    borderBottom: isActive ? "2px solid #1F3D2C" : isDone ? "2px solid #2D6B4F" : isSel ? "2px solid rgba(31,61,44,0.2)" : "2px solid rgba(31,61,44,0.08)",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.35 : 1,
                    fontFamily: "inherit", transition: "all 0.15s", position: "relative",
                  }}>
                  {isDone && (
                    <div style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                  <span style={{ color: isDone ? "#2D6B4F" : isActive ? "#EBC99B" : isSel ? "#1F3D2C" : "#9CA3AF" }}>{p.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: isDone ? "#2D6B4F" : isActive ? "white" : isSel ? "#1F3D2C" : "#9CA3AF", textAlign: "center" }}>{p.name}</span>
                </button>
              );
            })}
          </div>
          {atLimit && <p style={{ fontSize: 10, color: "#7D2A03", margin: "4px 0 0" }}>Plan limit reached.</p>}
        </div>
      </div>

      {/* Content panel */}
      <div style={{ flex: 1, padding: "12px 24px 32px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>

          {!activeTab || !activePlatform ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 16, border: "2px dashed rgba(31,61,44,0.1)", marginTop: 8 }}>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Tap a platform tab above to get started.</p>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(31,61,44,0.08)" }}>
              {/* Panel header */}
              <div style={{ background: "#1F3D2C", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#EBC99B" }}>{activePlatform.icon}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>{activePlatform.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {completed[activePlatform.id] && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#EBC99B" }}>Access granted ✓</span>
                  )}
                  <button onClick={() => deselect(activePlatform.id)}
                    style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
                    Remove
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  {activePlatform.steps.map((step, i) => {
                    const isDone = completed[activePlatform.id];
                    return (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isDone ? "#2D6B4F" : "rgba(45,107,79,0.08)", border: isDone ? "none" : "1.5px solid rgba(45,107,79,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: isDone ? "white" : "#2D6B4F", marginTop: 1, transition: "all 0.2s" }}>
                          {isDone
                            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                            : i + 1}
                        </span>
                        <span style={{ fontSize: 12, color: isDone ? "#9CA3AF" : "#374151", lineHeight: 1.6, paddingTop: 3, textDecoration: isDone ? "line-through" : "none" }}>{step}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Note */}
                <div style={{ background: "#F5F2EA", borderLeft: "3px solid #EBC99B", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#1F3D2C", margin: 0, lineHeight: 1.5 }}>{activePlatform.note}</p>
                </div>

                {/* URL input */}
                {!completed[activePlatform.id] && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Your {activePlatform.name} link <span style={{ fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </span>
                        <input type="url" value={urls[activePlatform.id] || ""} onChange={e => setUrls(u => ({ ...u, [activePlatform.id]: e.target.value }))} placeholder={activePlatform.urlPlaceholder}
                          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#F9F9F7", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                      </div>
                    </div>
                    <button onClick={e => markDone(activePlatform.id, e)}
                      style={{ width: "100%", padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      I've completed these steps
                    </button>
                  </>
                )}

                {completed[activePlatform.id] && (
                  <div style={{ textAlign: "center", padding: "12px", background: "rgba(45,107,79,0.06)", borderRadius: 10, border: "1px solid rgba(45,107,79,0.15)" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#2D6B4F", margin: 0 }}>Access granted for {activePlatform.name} ✓</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mini platform switcher if multiple selected */}
          {selected.length > 1 && activeTab && (
            <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
              {selected.map(id => {
                const plat = PLATFORMS.find(p => p.id === id)!;
                return (
                  <button key={id} onClick={() => setActiveTab(id)}
                    style={{ padding: "4px 12px", borderRadius: 20, border: "1.5px solid", borderColor: activeTab === id ? "#1F3D2C" : "rgba(31,61,44,0.15)", background: activeTab === id ? "#1F3D2C" : "white", color: activeTab === id ? "white" : "#6B7280", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                    {plat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#C4C4C4", margin: "0 0 20px", lineHeight: 1.6, padding: "0 24px" }}>
        We will never ask for your passwords. Reply to your onboarding email if you need help.
      </p>
    </div>
  );
}
