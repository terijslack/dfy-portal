import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    iconLg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    iconLg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    iconLg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our LinkedIn profile: [Agency LinkedIn Profile].","Select the admin role — choose Super Admin for full access.","Click Save."],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    iconLg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    urlPlaceholder: "https://tiktok.com/@yourhandle",
    steps: ["Log into TikTok on a desktop browser at tiktok.com.","Go to your profile and click TikTok Studio.","On the left menu, click Settings.","Select Account → then Creator Permissions.","Click Authorize and enter our TikTok handle: [Agency TikTok Handle].","Grant the permissions listed and confirm."],
    note: "TikTok's admin access is more limited than other platforms — we'll discuss what this covers during your kickoff call.",
  },
];

const PLANS = [
  { id: "starter", label: "Starter", limit: 2 },
  { id: "growth", label: "Growth Engine", limit: 4 },
];

export function AccordionBrand1() {
  const [plan, setPlan] = useState<"starter" | "growth">("starter");
  const [selected, setSelected] = useState<string[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});

  const limit = plan === "starter" ? 2 : 4;
  const atLimit = selected.length >= limit;
  const completedCount = Object.values(completed).filter(Boolean).length;

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(s => s.filter(x => x !== id));
      setCompleted(c => { const n = { ...c }; delete n[id]; return n; });
      setUrls(u => { const n = { ...u }; delete n[id]; return n; });
    } else {
      if (atLimit) return;
      setSelected(s => [...s, id]);
    }
  };

  const markDone = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCompleted(c => ({ ...c, [id]: true }));
  };

  const selectedPlatforms = PLATFORMS.filter(p => selected.includes(p.id));

  return (
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* Sticky top bar */}
      <div style={{ position: "sticky", top: 0, background: "white", borderBottom: "1px solid rgba(31,61,44,0.08)", zIndex: 10, padding: "12px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7D2A03" }}>Social Media Access</span>
          {selected.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: completedCount === selected.length ? "#7D2A03" : "#2D6B4F" }}>
              {completedCount}/{selected.length} complete
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* Editorial heading */}
        <div style={{ borderLeft: "3px solid #7D2A03", paddingLeft: 16, marginBottom: 28 }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "#1F3D2C", margin: "0 0 8px", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            Grant us access
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.65 }}>
            We need admin access to your social accounts to start managing them. Select the platforms you use and follow the steps shown below.
          </p>
        </div>

        {/* Platform chip row */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9CA3AF" }}>Your platforms</span>
            <div style={{ display: "inline-flex", background: "#F5F2EA", borderRadius: 6, padding: 2, gap: 1 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); }}
                  style={{ padding: "4px 10px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "#1F3D2C" : "transparent", color: plan === p.id ? "white" : "#9CA3AF", transition: "all 0.18s" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isLocked = !isSel && atLimit;
              const isDone = completed[p.id];
              return (
                <button key={p.id} onClick={() => toggleSelect(p.id)} disabled={isLocked}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px 7px 10px", borderRadius: 50, border: "2px solid", borderColor: isDone ? "#2D6B4F" : isSel ? "#1F3D2C" : "rgba(31,61,44,0.15)", background: isDone ? "rgba(45,107,79,0.06)" : isSel ? "#1F3D2C" : "white", color: isSel ? "white" : "#1F3D2C", cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.35 : 1, fontSize: 13, fontWeight: 600, fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ color: isDone ? "#2D6B4F" : isSel ? "white" : "#1F3D2C" }}>{p.icon}</span>
                  {p.name}
                  {isDone && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>}
                </button>
              );
            })}
          </div>
          {atLimit && <p style={{ fontSize: 11, color: "#7D2A03", margin: "4px 0 0" }}>Plan limit reached — tap a platform to deselect it.</p>}
        </div>

        {/* Divider */}
        {selectedPlatforms.length > 0 && (
          <div style={{ height: 1, background: "rgba(31,61,44,0.08)", margin: "20px 0" }}/>
        )}

        {/* Editorial platform sections — always open, no accordion */}
        {selectedPlatforms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", border: "2px dashed rgba(31,61,44,0.1)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select the platforms above to see your steps.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {selectedPlatforms.map((p, sectionIdx) => {
              const isDone = completed[p.id];
              return (
                <div key={p.id}>
                  {/* Platform heading */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: "rgba(125,42,3,0.25)", letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}>
                        {String(sectionIdx + 1).padStart(2, "0")}
                      </span>
                      <span style={{ color: "#1F3D2C" }}>{p.iconLg}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#1F3D2C", letterSpacing: "-0.02em" }}>{p.name}</span>
                    </div>
                    {isDone && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#2D6B4F", background: "rgba(45,107,79,0.08)", padding: "4px 10px", borderRadius: 20 }}>
                        Access granted ✓
                      </span>
                    )}
                  </div>

                  {/* Steps — always visible */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                    {p.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 900, color: "#7D2A03", width: 20, textAlign: "right", paddingTop: 1, opacity: isDone ? 0.4 : 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: isDone ? "#9CA3AF" : "#374151", lineHeight: 1.6, textDecoration: isDone ? "line-through" : "none" }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div style={{ background: "#F5F2EA", borderLeft: "3px solid #EBC99B", borderRadius: "0 6px 6px 0", padding: "10px 14px", marginBottom: 14 }}>
                    <p style={{ fontSize: 12, color: "#1F3D2C", margin: 0, lineHeight: 1.5 }}>{p.note}</p>
                  </div>

                  {/* URL + Done */}
                  {!isDone && (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                          {p.name} page link <span style={{ fontWeight: 400 }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          </span>
                          <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#F9F9F7", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                        </div>
                      </div>
                      <button onClick={e => markDone(p.id, e)}
                        style={{ padding: "10px 24px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        I've completed these steps
                      </button>
                    </>
                  )}

                  {sectionIdx < selectedPlatforms.length - 1 && (
                    <div style={{ height: 1, background: "rgba(31,61,44,0.07)", marginTop: 28 }}/>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#C4C4C4", marginTop: 36, lineHeight: 1.6 }}>
          We will never ask for your passwords. Reply to your onboarding email if you need help.
        </p>
      </div>
    </div>
  );
}
