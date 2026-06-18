import { useState, type MouseEvent } from "react";

const PLATFORMS = [
  {
    id: "facebook", name: "Facebook",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    urlPlaceholder: "https://facebook.com/yourpagename",
    steps: ["Log into Facebook and go to your Business Page (not your personal profile).","Click Professional Dashboard near the top of your page.","On the left side menu, click Page Access.","Under People with Facebook Access, click Add New.","Search for our Facebook account: [Agency Facebook Profile].","Toggle on Allow this person to have full control for full admin access.","Click Give Access and confirm."],
    note: "We'll get a notification and accept from our end.",
  },
  {
    id: "instagram", name: "Instagram",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    urlPlaceholder: "https://instagram.com/yourhandle",
    steps: ["Complete the Facebook Page steps above first — Instagram access is managed through Facebook.","If your Instagram is connected to your Facebook Page, access carries over automatically.","To verify: go to your Facebook Page → Settings → Linked Accounts → confirm Instagram is connected.","If Instagram is NOT yet connected: open the Instagram app → Settings → Account → Sharing and Remixing → connect your Facebook Page."],
    note: "Once your Instagram is linked to your Facebook Page and we have Page access, we're good to go.",
    note2: "Even if we're only managing your Instagram and not your Facebook page, we still need to be connected to both. This is a Meta limitation. Instagram business accounts can only be managed through a linked Facebook Page, so the Facebook steps must be completed regardless.",
  },
  {
    id: "linkedin", name: "LinkedIn",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
    urlPlaceholder: "https://linkedin.com/company/your-company",
    steps: ["Log into LinkedIn and navigate to your Company Page (not your personal profile).","Click Admin Tools in the top right corner of your page.","Select Manage Admins.","Click Add Admin.","Search for our client operations manager's profile: Frankie Lanoue.","Select the admin role: choose Content Admin to allow us to create and manage content.","Click Save."],
    note: "LinkedIn doesn't allow a business page to be made an admin on another page. That's why you'll be adding Frankie Lanoue (our client operations manager) directly. She'll accept and manage access from there.",
    note2: "To add admins at all, your LinkedIn Company Page needs to be on a Premium plan. If you're not sure whether you have it, check under your Page's Admin Tools. You'll see an upgrade prompt if it's not active. Unfortunately, we're unable to manage a non-Premium LinkedIn page for this reason.",
  },
  {
    id: "tiktok", name: "TikTok",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    urlPlaceholder: "https://tiktok.com/@yourhandle",
    steps: ["Log into TikTok on a desktop browser at tiktok.com.","Go to your profile and click TikTok Studio.","On the left menu, click Settings.","Select Account → then Creator Permissions.","Click Authorize and enter our TikTok handle: [Agency TikTok Handle].","Grant the permissions listed and confirm."],
    note: "TikTok's admin access is more limited than other platforms — we'll discuss what this covers during your kickoff call.",
  },
];

const PLANS = [
  { id: "starter", label: "Starter", limit: 2 },
  { id: "growth", label: "Growth Engine", limit: 4 },
];

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9,11 12,14 22,4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const IconDone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
);

export function AccordionBrand2() {
  const [plan, setPlan] = useState<"starter" | "growth">("starter");
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [expandedNote2, setExpandedNote2] = useState<Record<string, boolean>>({});

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
    <div style={{ background: "#F5F2EA", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 540, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: 26 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2D6B4F", margin: "0 0 6px", textAlign: "center" }}>
            Almost there!
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1F3D2C", margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.15, textAlign: "center" }}>
            Let's connect your accounts
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 18px", lineHeight: 1.7, textAlign: "center" }}>
            To start managing your social media, we'll need access to your accounts. Stuck? Don't worry, reach out and we'll walk you through each one step by step!
          </p>

          {/* Quick how-it-works strip — no SVGs in arrays */}
          <div style={{ display: "flex", background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 18 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRight: "1px solid rgba(31,61,44,0.07)" }}>
              <IconCheck />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textAlign: "center", lineHeight: 1.4 }}>Pick your platforms</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRight: "1px solid rgba(31,61,44,0.07)" }}>
              <IconClock />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textAlign: "center", lineHeight: 1.4 }}>Follow the steps</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px" }}>
              <IconDone />
              <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", textAlign: "center", lineHeight: 1.4 }}>We take it from there</span>
            </div>
          </div>

          {/* Plan toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>My plan:</span>
            <div style={{ display: "inline-flex", background: "rgba(31,61,44,0.07)", borderRadius: 8, padding: 3, gap: 2 }}>
              {PLANS.map(p => (
                <button key={p.id} onClick={() => { setPlan(p.id as "starter" | "growth"); setSelected([]); setCompleted({}); setUrls({}); setOpenId(null); }}
                  style={{ padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", background: plan === p.id ? "white" : "transparent", color: plan === p.id ? "#1F3D2C" : "#9CA3AF", boxShadow: plan === p.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.18s" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform cards — 2x2 grid, large, rounded, green fill */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>Which platforms are you on?</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(125,42,3,0.08)", color: "#7D2A03" }}>
              {selected.length} of {limit}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PLATFORMS.map(p => {
              const isSel = selected.includes(p.id);
              const isDone = completed[p.id];
              const isLocked = !isSel && atLimit;
              return (
                <button key={p.id} onClick={() => toggle(p.id)} disabled={isLocked}
                  style={{
                    position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    padding: "22px 12px 18px",
                    borderRadius: 16,
                    background: isDone ? "rgba(45,107,79,0.06)" : isSel ? "#2D6B4F" : "white",
                    border: `2px solid ${isDone ? "#2D6B4F" : isSel ? "#2D6B4F" : "rgba(31,61,44,0.0)"}`,
                    boxShadow: isSel ? "0 6px 20px rgba(45,107,79,0.22)" : "0 2px 8px rgba(0,0,0,0.06)",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.4 : 1,
                    fontFamily: "inherit", transition: "all 0.18s",
                  }}>
                  {isSel && !isDone && (
                    <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                  {isDone && (
                    <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: "#2D6B4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                  <span style={{ color: isSel ? "white" : isDone ? "#2D6B4F" : "#1F3D2C" }}>{p.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSel ? "white" : "#1F3D2C" }}>{p.name}</span>
                  {isDone && <span style={{ fontSize: 10, color: "#2D6B4F", fontWeight: 700 }}>Done!</span>}
                </button>
              );
            })}
          </div>
          {atLimit && (
            <p style={{ fontSize: 11, color: "#7D2A03", background: "rgba(125,42,3,0.06)", border: "1px solid rgba(125,42,3,0.12)", borderRadius: 8, padding: "8px 12px", marginTop: 12, marginBottom: 0 }}>
              You've hit your plan limit — tap one above to swap it out.
            </p>
          )}
        </div>

        {/* Progress — platform name chips */}
        {selected.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0 18px" }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => (
              <span key={p.id} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: completed[p.id] ? "#2D6B4F" : "rgba(31,61,44,0.07)", color: completed[p.id] ? "white" : "#6B7280", transition: "all 0.3s" }}>
                {completed[p.id] ? "✓ " : ""}{p.name}
              </span>
            ))}
            {completedCount === selected.length && selected.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, color: "#2D6B4F" }}>
                You're all set!
              </span>
            )}
          </div>
        )}

        {/* Accordion — rounded white cards */}
        {selected.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "white", borderRadius: 16, border: "2px dashed rgba(31,61,44,0.1)" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", margin: "0 0 4px" }}>Choose your platforms above</p>
            <p style={{ fontSize: 12, color: "#C4C4C4", margin: 0 }}>We'll guide you through each one. it's quick, we promise.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PLATFORMS.filter(p => selected.includes(p.id)).map(p => {
              const isOpen = openId === p.id;
              const isDone = completed[p.id];
              return (
                <div key={p.id} style={{
                  background: "white", borderRadius: 16, overflow: "hidden",
                  boxShadow: isOpen ? "0 8px 28px rgba(31,61,44,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
                  border: `2px solid ${isOpen ? "rgba(45,107,79,0.2)" : "transparent"}`,
                  borderLeft: isOpen ? "4px solid #2D6B4F" : isDone ? "4px solid rgba(45,107,79,0.3)" : "4px solid transparent",
                  transition: "all 0.2s",
                }}>
                  <button onClick={() => setOpenId(isOpen ? null : p.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: isDone ? "rgba(45,107,79,0.08)" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isDone
                          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6B4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                          : <span style={{ color: "#1F3D2C" }}>{p.icon}</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D2C" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: isDone ? "#2D6B4F" : "#9CA3AF", fontWeight: isDone ? 600 : 400 }}>
                          {isDone ? "All done — thank you!" : `${p.steps.length} quick steps`}
                        </div>
                      </div>
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: isOpen ? "#2D6B4F" : "#F5F2EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
                        <polyline points="6,9 12,15 18,9"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(31,61,44,0.06)", padding: "16px 18px 20px" }}>
                      {(p as any).note2 && (
                        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
                          <button
                            onClick={() => setExpandedNote2(n => ({ ...n, [p.id]: !n[p.id] }))}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(235,201,155,0.25)", border: "none", borderLeft: "3px solid #EBC99B", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EBC99B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: 14, fontWeight: 900, color: "#7D5A1A", lineHeight: 1 }}>!</span>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#1F3D2C" }}>Before you start</div>
                              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{expandedNote2[p.id] ? "tap to hide" : "important — tap to read"}</div>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedNote2[p.id] ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
                              <polyline points="6,9 12,15 18,9"/>
                            </svg>
                          </button>
                          {expandedNote2[p.id] && (
                            <div style={{ background: "#FBF8F3", borderLeft: "3px solid #EBC99B", padding: "10px 14px" }}>
                              <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{(p as any).note2}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 14 }}>
                        {p.steps.map((step, i) => (
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "rgba(45,107,79,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#2D6B4F", marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: "#FBF8F3", borderLeft: "3px solid #EBC99B", borderRadius: "0 10px 10px 0", padding: "8px 12px", marginBottom: 14 }}>
                        <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.55 }}>
                          <strong style={{ fontWeight: 700, color: "#1F3D2C" }}>Heads up:</strong> {p.note}
                        </p>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
                          Your {p.name} page link <span style={{ fontWeight: 400, color: "#C4C4C4" }}>(optional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.3 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F3D2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          </span>
                          <input type="url" value={urls[p.id] || ""} onChange={e => setUrls(u => ({ ...u, [p.id]: e.target.value }))} placeholder={p.urlPlaceholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 32px", fontSize: 12, color: "#1F3D2C", background: "#F9F8F5", border: "1.5px solid rgba(31,61,44,0.1)", borderRadius: 10, outline: "none", fontFamily: "inherit" }}/>
                        </div>
                      </div>

                      <button onClick={e => markDone(p.id, e)}
                        style={{ width: "100%", padding: "12px", background: "#2D6B4F", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        Done! Mark {p.name} as connected
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "#C4C4C4", marginTop: 28, lineHeight: 1.6 }}>
          We'll never ask for your passwords — ever. Stuck on a step? Just reply to your onboarding email and we'll sort it out.
        </p>
      </div>
    </div>
  );
}
