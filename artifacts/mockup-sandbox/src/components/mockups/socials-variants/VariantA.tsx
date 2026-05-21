import { useState } from "react";

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
};

const PLATFORMS: Record<string, { name: string; color: string; gradient?: string; prefix: string }> = {
  instagram: { name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)", color: "#dc2743", prefix: "@" },
  facebook:  { name: "Facebook",  color: "#1877F2", prefix: "@" },
  linkedin:  { name: "LinkedIn",  color: "#0A66C2", prefix: "in/" },
  tiktok:    { name: "TikTok",    color: "#010101", prefix: "@" },
};

const SAMPLE = [
  { platform: "instagram", username: "wildflower.bakery" },
  { platform: "linkedin",  username: "wildflower-bakery-co" },
];

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);
const ICONS: Record<string, () => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

export function VariantA() {
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");
  const [accounts, setAccounts] = useState(SAMPLE);

  const connected = new Set(accounts.map(a => a.platform));
  const prefix = platform && PLATFORMS[platform] ? PLATFORMS[platform].prefix : "@";

  const addAccount = () => {
    if (!platform || !handle) return;
    setAccounts([...accounts, { platform, username: handle.replace(/^@/, "") }]);
    setPlatform(""); setHandle(""); setShowForm(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BRAND.cream, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: BRAND.forest, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, color: BRAND.tan, opacity: 0.7, marginBottom: 2, letterSpacing: "0.06em" }}>Welcome back</div>
          <div style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Wildflower Bakery</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          {/* Active parent */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(235,201,155,0.08)", borderLeft: `3px solid ${BRAND.tan}`, cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.tan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Your Social Media</span>
          </div>
          {[
            { label: "Post Approval", active: false },
            { label: "Content Calendar", active: false },
            { label: "Your Socials", active: true },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 20px 8px 36px", cursor: "pointer", background: item.active ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: item.active ? `3px solid ${BRAND.green}` : "3px solid transparent" }}>
              <span style={{ fontSize: 12, color: item.active ? "#F5F2EA" : "rgba(245,242,234,0.5)", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
          {["Google Business Profile", "Performance Analytics", "Your Account"].map(label => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", marginTop: 2 }}>
              <span style={{ fontSize: 13, color: "rgba(245,242,234,0.5)" }}>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.08)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: BRAND.forest, fontStyle: "italic" }}>Done For You</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.green, letterSpacing: "0.06em" }}>MARKETING</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: BRAND.slate }}>Wildflower Bakery</span>
            <button style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1px solid rgba(125,42,3,0.2)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 32, display: "flex", gap: 24 }}>
          {/* Content col */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: BRAND.forest, margin: "0 0 4px" }}>Your Socials</h1>
              <p style={{ fontSize: 13, color: BRAND.slate, margin: 0 }}>The accounts your team manages on your behalf.</p>
            </div>

            {/* Count */}
            <p style={{ fontSize: 12, color: "#9AA199", marginBottom: 14 }}>
              Connected: <span style={{ color: BRAND.green, fontWeight: 600 }}>{accounts.length}</span> of 4 accounts
            </p>

            {/* Account list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {accounts.map(a => {
                const p = PLATFORMS[a.platform];
                const Icon = ICONS[a.platform];
                return (
                  <div key={a.platform} style={{ background: "#fff", border: `1.5px solid rgba(45,107,79,0.18)`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Left accent bar */}
                    <div style={{ width: 4, height: 36, borderRadius: 4, background: p.gradient || p.color, flexShrink: 0 }} />
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: p.gradient || p.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                      <Icon />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.slate, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.forest }}>{p.prefix}{a.username}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, background: "rgba(45,107,79,0.08)", color: BRAND.green, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>Active</span>
                      <button style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1.5px solid rgba(125,42,3,0.2)`, borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add button / form */}
            {!showForm ? (
              <button onClick={() => setShowForm(true)} disabled={accounts.length >= 4} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: BRAND.green, color: BRAND.cream, border: "none", borderRadius: 9, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Social Media
              </button>
            ) : (
              <div style={{ background: "#fff", border: `1.5px solid rgba(31,61,44,0.12)`, borderRadius: 14, padding: "22px 20px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.forest, marginBottom: 14 }}>Add an account</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: BRAND.slate, display: "block", marginBottom: 5 }}>Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, padding: "9px 28px 9px 12px", fontSize: 13, fontFamily: "Inter,sans-serif", color: BRAND.forest, background: "#fafaf8", minWidth: 160 }}>
                      <option value="">Select platform…</option>
                      {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k} disabled={connected.has(k)}>{v.name}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: BRAND.slate, display: "block", marginBottom: 5 }}>Handle</label>
                    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, background: "#fafaf8", overflow: "hidden" }}>
                      <span style={{ padding: "0 8px", fontSize: 13, color: "#9AA199", flexShrink: 0 }}>{prefix}</span>
                      <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" style={{ flex: 1, border: "none", background: "transparent", padding: "9px 12px 9px 0", fontSize: 13, fontFamily: "Inter,sans-serif", color: BRAND.forest, outline: "none" }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button onClick={addAccount} style={{ background: BRAND.green, color: BRAND.cream, border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Account</button>
                  <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: BRAND.slate, border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside style={{ width: 204, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.slate, marginBottom: 12 }}>Social Media</div>
            {[
              { label: "Post Approval", sub: "3 awaiting review", active: false },
              { label: "Content Calendar", sub: "See upcoming posts", active: false },
              { label: "Your Socials", sub: `${accounts.length} accounts connected`, active: true },
            ].map(card => (
              <div key={card.label} style={{ background: card.active ? BRAND.green : "#fff", border: `1.5px solid ${card.active ? BRAND.green : "rgba(31,61,44,0.1)"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: card.active ? "#fff" : BRAND.forest, marginBottom: 3 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: card.active ? "rgba(255,255,255,0.75)" : BRAND.slate }}>{card.sub}</div>
              </div>
            ))}
          </aside>
        </main>
      </div>
    </div>
  );
}
