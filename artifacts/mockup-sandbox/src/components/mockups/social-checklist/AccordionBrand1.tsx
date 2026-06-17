import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: (color: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: (color: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: (color: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our LinkedIn profile: [Agency LinkedIn Profile].","Select the admin role — choose Super Admin for full access.","Click Save."],
    note: "We'll receive a notification and accept the invite.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: (color: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
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
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2D6B4F", margin: "0 0 6px" }}>Social Media Access</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1F3D2C", margin: "0 0 8px", letterSpacing: "-0.025em", lineHeight: 1.15 }}>Grant us access</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.65 }}>
            We need admin access to start managing your accounts. Select your platforms and follow the steps.
          </p>
          {/* Plan toggle — inline text style */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Plan:</span>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setOpenId(null); }}
                style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${plan === p.id ? "#2D6B4F" : "rgba(31,61,44,0.15)"}`, background: plan === p.id ? "#2D6B4F" : "white", color: plan === p.id ? "white" : "#9CA3AF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform selection — 4 horizontal tiles */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#C4C4C4" }}>Your platforms</span>
            <span style={{ fontSize: 12, color: selected.length >= limit ? "#7D2A03" : "#9CA3AF" }}>{selected.length} of {limit}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isDone = completed[p.id];
              const isLocked = !isSel && atLimit;
              return (
                <button key={p.id} onClick={() => toggle(p.id)} disabled={isLocked}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                    padding: "16px 8px 14px",
                    borderRadius: 10,
                    background: "white",
                    border: "none",
                    borderBottom: `3px solid ${isDone ? "#2D6B4F" : isSel ? "#2D6B4F" : "transparent"}`,
                    boxShadow: "0 0 0 1.5px rgba(31,61,44,0.1)",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.35 : 1,
                    fontFamily: "inherit", transition: "all 0.15s",
                    outline: isSel ? "2px solid rgba(45,107,79,0.15)" : "none",
                    outlineOffset: 2,
                  }}>
                  {p.icon(isDone ? "#2D6B4F" : isSel ? "#2D6B4F" : "#C4C4C4")}
                  <span style={{ fontSize: 11, fontWeight: 600, color: isDone ? "#2D6B4F" : isSel ? "#2D6B4F" : "#9CA3AF" }}>{p.name}</span>
                  {isDone && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                  )}
                </button>
              );
            })}
          </div>
          {atLimit && <p style={{ fontSize: 11, color: "#7D2A03", margin: "8px 0 0" }}>Plan limit reached — tap a platform to remove it.</p>}
        </div>

        {/* Progress bar */}
        {selected.length > 0 && (
          <div style={{ margin: "18px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: completedCount === selected.length ? "#2D6B4F" : "#6B7280" }}>
                {completedCount === selected.length && selected.length > 0 ? "All done!" : `${completedCount} of ${selected.length} complete`}
              </span>
            </div>
            <div style={{ height: 4, background: "#F0EDE8", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#2D6B4F", borderRadius: 2, width: `${(completedCount / selected.length) * 100}%`, transition: "width 0.4s" }}/>
            </div>
          </div>
        )}

        {/* Accordion — flat, divider-only style */}
        {selected.length === 0 ? (
          <div style={{ borderTop: "1px solid rgba(31,61,44,0.08)", paddingTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#C4C4C4", margin: 0 }}>Select platforms above to see the steps.</p>
          </div>
        ) : (
          <div style={{ borderTop: "1px solid rgba(31,61,44,0.08)" }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];
              return (
                <div key={p.id} style={{ borderBottom: "1px solid rgba(31,61,44,0.08)" }}>
                  <button onClick={() => setOpenId(isOpen ? null : p.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {p.icon(isDone ? "#2D6B4F" : isOpen ? "#1F3D2C" : "#9CA3AF")}
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1F3D2C" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: 500 }}>
                          {isDone ? "Access granted ✓" : `${p.steps.length} steps`}
                        </div>
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                      <polyline points="6,9 12,15 18,9"/>
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ paddingBottom: 20 }}>
                      {/* Steps — plain large numbers, no circles */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                        {p.steps.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 16 }}>
                            <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 900, color: "#7D2A03", width: 16, paddingTop: 1, opacity: 0.4 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.65 }}>{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Note — inline with icon */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 14, padding: "10px 14px", background: "#F9F8F5", borderRadius: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <p style={{ fontSize: 12, color: "#4B5563", margin: 0, lineHeight: 1.55 }}>{p.note}</p>
                      </div>

                      {/* URL */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, color: "#9CA3AF", marginBottom: 5 }}>
                          Your {p.name} page link <span style={{ color: "#C4C4C4" }}>(optional)</span>
                        </label>
                        <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", fontSize: 12, color: "#1F3D2C", background: "white", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                      </div>

                      <button onClick={e => markDone(p.id, e)}
                        style={{ padding: "10px 22px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        I've completed these steps
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#D1D5DB", marginTop: 32, lineHeight: 1.6 }}>
          We will never ask for your passwords. Reply to your onboarding email if you need help.
        </p>
      </div>
    </div>
  );
}
