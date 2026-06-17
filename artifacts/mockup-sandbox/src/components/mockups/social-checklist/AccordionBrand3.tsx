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
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
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
  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});

  const limit = plan === "starter" ? 2 : 4;
  const atLimit = selected.length >= limit;
  const completedCount = Object.values(completed).filter(Boolean).length;

  const toggle = (id: string) => {
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
    <div style={{ background: "#F8F7F4", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* Header — structured, with a bottom border */}
        <div style={{ paddingBottom: 20, marginBottom: 22, borderBottom: "2px solid rgba(31,61,44,0.08)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 5px" }}>Social Media Access</p>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1F3D2C", margin: "0 0 6px", letterSpacing: "-0.025em" }}>Grant us access</h2>
              <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6, maxWidth: 320 }}>
                Admin access is required to manage your accounts. Select platforms and complete the steps.
              </p>
            </div>
            {/* Plan toggle — right-aligned text buttons */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#C4C4C4" }}>Plan</span>
              <div style={{ display: "flex", gap: 2, border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 4, overflow: "hidden" }}>
                {PLANS.map(p => (
                  <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setOpenId(null); }}
                    style={{ padding: "5px 12px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "#1F3D2C" : "transparent", color: plan === p.id ? "white" : "#9CA3AF", transition: "all 0.15s", borderRight: "1px solid rgba(31,61,44,0.1)" }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Platform cards — 2x2 grid, outlined, sharp corners */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>Select your platforms</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: selected.length >= limit ? "#7D2A03" : "#9CA3AF" }}>
              {selected.length}/{limit} selected
            </span>
          </div>

          {/* Outer grid border */}
          <div style={{ border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {PLATFORMS.map((p, idx) => {
                const isSel = selected.includes(p.id);
                const isDone = completed[p.id];
                const isLocked = !isSel && atLimit;
                const borderRight = idx % 2 === 0 ? "1px solid rgba(31,61,44,0.1)" : "none";
                const borderBottom = idx < 2 ? "1px solid rgba(31,61,44,0.1)" : "none";
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} disabled={isLocked}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 18px",
                      background: isDone ? "rgba(45,107,79,0.05)" : isSel ? "#2D6B4F" : "white",
                      border: "none",
                      borderRight, borderBottom,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      opacity: isLocked ? 0.35 : 1,
                      fontFamily: "inherit", transition: "background 0.15s", textAlign: "left",
                    }}>
                    <div style={{ width: 38, height: 38, borderRadius: 4, background: isDone ? "rgba(45,107,79,0.08)" : isSel ? "rgba(255,255,255,0.15)" : "rgba(31,61,44,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: isSel ? "white" : isDone ? "#2D6B4F" : "#6B7280" }}>{p.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? "white" : "#1F3D2C" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: isSel ? "rgba(255,255,255,0.65)" : isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: 500 }}>
                        {isDone ? "Access granted ✓" : isSel ? "Selected" : "Tap to add"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {atLimit && <p style={{ fontSize: 11, color: "#7D2A03", margin: "8px 0 0" }}>Plan limit reached — tap a platform to swap.</p>}
        </div>

        {/* Progress — simple step counter */}
        {selected.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderRadius: 6, border: "1.5px solid rgba(31,61,44,0.08)", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {PLATFORMS.filter(p => selected.includes(p.id)).map(p => (
                <div key={p.id} style={{ width: 8, height: 8, borderRadius: 2, background: completed[p.id] ? "#2D6B4F" : "rgba(31,61,44,0.15)", transition: "background 0.3s" }}/>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {completedCount === selected.length
                ? <span style={{ color: "#2D6B4F", fontWeight: 700 }}>All platforms connected</span>
                : completedCount === 0 ? "Open a platform below to begin"
                : `${selected.length - completedCount} platform${selected.length - completedCount > 1 ? "s" : ""} remaining`}
            </span>
          </div>
        )}

        {/* Accordion — flat, outlined, square corners */}
        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "white", borderRadius: 6, border: "1.5px dashed rgba(31,61,44,0.12)" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select your platforms above to see the steps.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];
              return (
                <div key={p.id} style={{
                  background: "white",
                  borderRadius: 6,
                  border: `1.5px solid ${isOpen ? "#2D6B4F" : isDone ? "rgba(45,107,79,0.2)" : "rgba(31,61,44,0.1)"}`,
                  overflow: "hidden", transition: "border-color 0.15s",
                }}>
                  {/* Forest top stripe when open */}
                  {isOpen && <div style={{ height: 3, background: "#1F3D2C" }}/>}

                  <button onClick={() => setOpenId(isOpen ? null : p.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: isDone ? "rgba(45,107,79,0.03)" : "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 4, background: isDone ? "rgba(45,107,79,0.08)" : "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isDone
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                          : <span style={{ color: "#1F3D2C" }}>{p.icon}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D2C" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: isDone ? 600 : 400 }}>
                          {isDone ? "Access granted ✓" : `${p.steps.length} steps to complete`}
                        </div>
                      </div>
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: 4, border: `1.5px solid ${isOpen ? "#2D6B4F" : "rgba(31,61,44,0.12)"}`, background: isOpen ? "#2D6B4F" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(31,61,44,0.07)", padding: "14px 16px 18px" }}>
                      {/* Steps — square badge numbers */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                        {p.steps.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 4, background: "#1F3D2C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Note — outlined gray box */}
                      <div style={{ border: "1px solid rgba(31,61,44,0.1)", borderRadius: 6, padding: "10px 14px", marginBottom: 14, background: "#F8F7F4" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <p style={{ fontSize: 12, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>{p.note}</p>
                        </div>
                      </div>

                      {/* URL */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 5 }}>
                          Your {p.name} page URL <span style={{ fontWeight: 400, color: "#C4C4C4" }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          </span>
                          <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "white", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 6, outline: "none", fontFamily: "inherit" }}/>
                        </div>
                      </div>

                      <button onClick={e => markDone(p.id, e)}
                        style={{ width: "100%", padding: "11px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        I've completed these steps
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#C4C4C4", marginTop: 28, lineHeight: 1.6 }}>
          We will never ask for your passwords. Reply to your onboarding email if you need help.
        </p>
      </div>
    </div>
  );
}
