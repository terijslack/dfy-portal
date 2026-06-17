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
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* ── RUST ZONE: header + platform selection ── */}
      <div style={{ background: "#7D2A03" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 24px 28px" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(235,201,155,0.6)", margin: "0 0 6px" }}>
                Social Media Access
              </p>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 6px", lineHeight: 1.1, letterSpacing: "-0.025em" }}>
                Grant us access
              </h2>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.55, maxWidth: 280 }}>
                Select the platforms on your plan, then follow the steps.
              </p>
            </div>
            {selected.length > 0 && (
              <div style={{ flexShrink: 0, textAlign: "center", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "white", lineHeight: 1 }}>{completedCount}/{selected.length}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2, fontWeight: 600 }}>complete</div>
              </div>
            )}
          </div>

          {/* Plan toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Plan:</span>
            <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.2)", borderRadius: 6, padding: 2, gap: 1 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); }}
                  style={{ padding: "5px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "rgba(255,255,255,0.15)" : "transparent", color: plan === p.id ? "white" : "rgba(255,255,255,0.4)", transition: "all 0.18s" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform cards — white tiles on rust */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isLocked = !isSel && atLimit;
              const isDone = completed[p.id];
              return (
                <button key={p.id} onClick={() => toggleSelect(p.id)} disabled={isLocked}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "18px 12px",
                    borderRadius: 12,
                    background: isDone ? "rgba(45,107,79,0.15)" : isSel ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)",
                    border: `2px solid ${isDone ? "rgba(45,107,79,0.6)" : isSel ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)"}`,
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.3 : 1,
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}>
                  {isSel && (
                    <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: isDone ? "#2D6B4F" : "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                  <span style={{ color: isDone ? "#EBC99B" : isSel ? "white" : "rgba(255,255,255,0.5)" }}>{p.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isSel ? "white" : "rgba(255,255,255,0.6)" }}>{p.name}</span>
                  {isDone && <span style={{ fontSize: 10, color: "#EBC99B", fontWeight: 700 }}>Done!</span>}
                </button>
              );
            })}
          </div>

          {atLimit && (
            <p style={{ fontSize: 11, color: "rgba(235,201,155,0.8)", background: "rgba(0,0,0,0.15)", borderRadius: 6, padding: "8px 12px", marginTop: 10, marginBottom: 0 }}>
              Plan limit reached — tap a platform to swap it out.
            </p>
          )}
        </div>
      </div>

      {/* Tan divider strip */}
      <div style={{ height: 4, background: "#EBC99B" }}/>

      {/* ── CREAM ZONE: editorial steps ── */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 24px 40px" }}>

        {selectedPlatforms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 24px", border: "2px dashed rgba(125,42,3,0.15)", borderRadius: 12 }}>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Select your platforms above to see the access steps.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {selectedPlatforms.map((p, idx) => {
              const isDone = completed[p.id];
              return (
                <div key={p.id}>
                  {/* Section heading */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 30, fontWeight: 900, color: "rgba(125,42,3,0.15)", lineHeight: 1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "#1F3D2C", letterSpacing: "-0.02em" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: 600 }}>
                          {isDone ? "Access granted ✓" : `${p.steps.length} steps`}
                        </div>
                      </div>
                    </div>
                    {isDone && (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Steps — always visible */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {p.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#7D2A03", width: 18, textAlign: "right", paddingTop: 2, opacity: isDone ? 0.3 : 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: isDone ? "#B0B8C1" : "#374151", lineHeight: 1.6, textDecoration: isDone ? "line-through" : "none" }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note callout */}
                  <div style={{ background: "rgba(125,42,3,0.06)", border: "1px solid rgba(125,42,3,0.12)", borderLeft: "4px solid #7D2A03", borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: "#5A1E02", margin: 0, lineHeight: 1.5 }}>{p.note}</p>
                  </div>

                  {!isDone && (
                    <>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>
                          Your {p.name} link <span style={{ fontWeight: 400 }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          </span>
                          <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "white", border: "1.5px solid rgba(31,61,44,0.12)", borderRadius: 8, outline: "none", fontFamily: "inherit" }}/>
                        </div>
                      </div>
                      <button onClick={e => markDone(p.id, e)}
                        style={{ padding: "10px 22px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        I've completed these steps
                      </button>
                    </>
                  )}

                  {idx < selectedPlatforms.length - 1 && (
                    <div style={{ height: 1, background: "rgba(125,42,3,0.1)", marginTop: 24 }}/>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#C4C4C4", marginTop: 32, lineHeight: 1.6 }}>
          We will never ask for your passwords. Reply to your onboarding email if you need help.
        </p>
      </div>
    </div>
  );
}
