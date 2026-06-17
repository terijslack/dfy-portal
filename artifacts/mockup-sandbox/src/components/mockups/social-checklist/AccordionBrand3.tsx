import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → profile → three lines → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our LinkedIn profile: [Agency LinkedIn Profile].","Select the admin role — choose Super Admin for full access.","Click Save."],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
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
  const [openId, setOpenId] = useState<string | null>(null);
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
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: "0 0 48px" }}>

      {/* Header with rust left-border accent */}
      <div style={{ borderLeft: "5px solid #7D2A03", background: "white", margin: "0 0 0 0", padding: "28px 28px 28px 23px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7D2A03", margin: "0 0 8px" }}>
            Social Media Access
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1F3D2C", margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Grant us access
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", lineHeight: 1.65, maxWidth: 420 }}>
            To get started managing your social media, we'll need admin access to your accounts. Follow the steps below — reach out anytime if you get stuck.
          </p>
          <div style={{ display: "inline-flex", background: "#F5F2EA", borderRadius: 8, padding: 3, gap: 2 }}>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setOpenId(null); }}
                style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "#2D6B4F" : "transparent", color: plan === p.id ? "white" : "#9CA3AF", transition: "all 0.18s" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px 0" }}>

        {/* Section row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#7D2A03" }}>Pick your platforms</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(125,42,3,0.09)", color: "#7D2A03" }}>
            {selected.length} of {limit} selected
          </span>
        </div>

        {/* Cards — tan default background */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {PLATFORMS.map(p => {
            const isSel = selected.includes(p.id);
            const isLocked = !isSel && atLimit;
            const isDone = completed[p.id];
            return (
              <button key={p.id} onClick={() => toggleSelect(p.id)} disabled={isLocked}
                style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "18px 12px", borderRadius: 14, background: isDone ? "rgba(45,107,79,0.08)" : isSel ? "rgba(45,107,79,0.08)" : "#EBC99B33", border: `2px solid ${isDone ? "#2D6B4F" : isSel ? "#2D6B4F" : "rgba(235,201,155,0.8)"}`, cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.4 : 1, fontFamily: "inherit", transition: "all 0.15s", boxShadow: isSel ? "0 4px 14px rgba(45,107,79,0.12)" : "none" }}>
                {isSel && (
                  <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                  </div>
                )}
                <span style={{ color: "#1F3D2C" }}>{p.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>{p.name}</span>
                {isDone && <span style={{ fontSize: 10, color: "#2D6B4F", fontWeight: 600 }}>Done!</span>}
              </button>
            );
          })}
        </div>

        {atLimit && <p style={{ fontSize: 11, color: "#7D2A03", background: "rgba(125,42,3,0.06)", border: "1px solid rgba(125,42,3,0.12)", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>Plan limit reached. Tap a platform to swap.</p>}

        {/* Progress dots */}
        {selected.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "10px 16px", background: "white", borderRadius: 10, border: "1px solid rgba(31,61,44,0.08)" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {selected.map(id => (
                <div key={id} style={{ width: 10, height: 10, borderRadius: "50%", background: completed[id] ? "#1F3D2C" : "rgba(125,42,3,0.18)", transition: "background 0.3s" }}/>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {completedCount === 0 ? "Tap a platform below to get started" : completedCount === selected.length ? <span style={{ color: "#7D2A03", fontWeight: 700 }}>All done! You're all set.</span> : `${selected.length - completedCount} left to go`}
            </span>
          </div>
        )}

        {/* Accordion */}
        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "white", borderRadius: 14, border: "2px dashed rgba(31,61,44,0.12)" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select platforms above to see the steps.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];
              return (
                <div key={p.id} style={{ background: "white", borderRadius: 14, overflow: "hidden", border: `2px solid ${isOpen ? "#2D6B4F" : isDone ? "rgba(45,107,79,0.25)" : "rgba(31,61,44,0.1)"}`, boxShadow: isOpen ? "0 6px 24px rgba(31,61,44,0.1)" : "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
                  <button onClick={() => setOpenId(isOpen ? null : p.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: isDone ? "rgba(45,107,79,0.04)" : "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: isDone ? "rgba(45,107,79,0.08)" : "rgba(235,201,155,0.35)", border: "1.5px solid rgba(235,201,155,0.7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isDone
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                          : <span style={{ color: "#1F3D2C" }}>{p.icon}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D2C" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: isDone ? 600 : 400 }}>
                          {isDone ? "Access granted ✓" : `${p.steps.length} steps to complete`}
                        </div>
                      </div>
                    </div>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: isOpen ? "#2D6B4F" : "rgba(235,201,155,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : "#1F3D2C"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1.5px solid rgba(235,201,155,0.5)", padding: "16px 16px 18px" }}>
                      <ol style={{ margin: "0 0 14px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                        {p.steps.map((step, i) => (
                          <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "#1F3D2C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#EBC99B", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, paddingTop: 3 }}>{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div style={{ background: "rgba(235,201,155,0.25)", border: "1.5px solid rgba(235,201,155,0.7)", borderLeft: "4px solid #7D2A03", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7D2A03" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <p style={{ fontSize: 12, color: "#1F3D2C", margin: 0, lineHeight: 1.5 }}>{p.note}</p>
                      </div>
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                          Paste your {p.name} page link <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          </span>
                          <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#FAFAF8", border: "1.5px solid rgba(235,201,155,0.7)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                        </div>
                      </div>
                      <button onClick={e => markDone(p.id, e)}
                        style={{ width: "100%", padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        I've completed these steps
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 24, lineHeight: 1.6 }}>
          We will never ask for your passwords. If you need help, just reply to your onboarding email.
        </p>
      </div>
    </div>
  );
}
