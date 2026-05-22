import { useState } from "react";

// Inversion of C (Dark Minimal):
// C = dark bg → D = brilliant cream/white
// C = table rows + column headers → D = flowing editorial cards, no grid
// C = monospace handles → D = large Fraunces serif display text
// C = stat counter widgets → D = no counters, just accounts
// C = muted/subdued palette → D = full platform colour, warm & rich
// C = tight/compact → D = generous breathing room, spacious

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
};

const PLATFORMS: Record<string, { name: string; color: string; gradient?: string; prefix: string; bg: string }> = {
  instagram: { name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)", color: "#dc2743", prefix: "@", bg: "rgba(220,39,67,0.06)" },
  facebook:  { name: "Facebook",  color: "#1877F2", prefix: "@", bg: "rgba(24,119,242,0.06)" },
  linkedin:  { name: "LinkedIn",  color: "#0A66C2", prefix: "in/", bg: "rgba(10,102,194,0.06)" },
  tiktok:    { name: "TikTok",    color: "#333",    prefix: "@", bg: "rgba(0,0,0,0.04)" },
};

const SAMPLE = [
  { platform: "instagram", username: "wildflower.bakery" },
  { platform: "linkedin",  username: "wildflower-bakery-co" },
];

const IgIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FbIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LiIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TkIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
const ICONS: Record<string, () => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

export function VariantD() {
  const [accounts, setAccounts] = useState(SAMPLE);
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");

  const connected = new Set(accounts.map(a => a.platform));

  const save = () => {
    if (!platform || !handle) return;
    setAccounts([...accounts, { platform, username: handle.replace(/^@/, "") }]);
    setPlatform(""); setHandle(""); setShowForm(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BRAND.cream, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: BRAND.forest, flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, color: BRAND.tan, opacity: 0.7, marginBottom: 2, letterSpacing: "0.06em" }}>Welcome back</div>
          <div style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Wildflower Bakery</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(235,201,155,0.08)", borderLeft: `3px solid ${BRAND.tan}` }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BRAND.tan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Your Social Media</span>
          </div>
          {[{ label: "Post Approval", active: false }, { label: "Content Calendar", active: false }, { label: "Your Socials", active: true }].map(item => (
            <div key={item.label} style={{ padding: "8px 20px 8px 36px", borderLeft: item.active ? `3px solid ${BRAND.green}` : "3px solid transparent" }}>
              <span style={{ fontSize: 12, color: item.active ? "#F5F2EA" : "rgba(245,242,234,0.45)", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
          {["Google Business Profile", "Analytics", "Account"].map(l => (
            <div key={l} style={{ padding: "9px 20px" }}><span style={{ fontSize: 12, color: "rgba(245,242,234,0.35)" }}>{l}</span></div>
          ))}
        </nav>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.08)", padding: "0 40px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: BRAND.forest, fontStyle: "italic" }}>Done For You <span style={{ fontSize: 13, fontStyle: "normal", fontWeight: 700, color: BRAND.green, letterSpacing: "0.07em" }}>MARKETING</span></span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: BRAND.slate }}>Wildflower Bakery</span>
            <button style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1px solid rgba(125,42,3,0.2)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "52px 48px 40px" }}>
          {/* Big editorial heading — opposite of C's small label */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BRAND.slate, margin: "0 0 10px" }}>Your Socials · {accounts.length} connected</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 300, color: BRAND.forest, margin: "0 0 10px", lineHeight: 1.1 }}>Managed<br /><em>on your behalf.</em></h1>
            <p style={{ fontSize: 14, color: BRAND.slate, margin: 0, maxWidth: 380 }}>Every platform below is actively managed by your team. Add up to four accounts.</p>
          </div>

          {/* Flowing editorial cards — opposite of table rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 620, marginBottom: 40 }}>
            {accounts.map((a, i) => {
              const p = PLATFORMS[a.platform];
              const Icon = ICONS[a.platform];
              return (
                <div key={a.platform} style={{ display: "flex", alignItems: "center", gap: 28, padding: "28px 0", borderBottom: i < accounts.length - 1 ? `1.5px solid rgba(31,61,44,0.08)` : "none" }}>
                  {/* Large colour disc — opposite of C's small icon */}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: p.gradient || p.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                    <Icon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: BRAND.slate, marginBottom: 5 }}>{p.name}</div>
                    {/* Fraunces serif handle — opposite of C's monospace */}
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 300, color: BRAND.forest, lineHeight: 1 }}>
                      <span style={{ fontSize: 16, color: BRAND.slate }}>{p.prefix}</span>{a.username}
                    </div>
                  </div>
                  <button onClick={() => setAccounts(accounts.filter(x => x.platform !== a.platform))} style={{ background: "transparent", border: `1.5px solid rgba(125,42,3,0.18)`, borderRadius: 8, color: BRAND.rust, fontSize: 12, padding: "7px 14px", cursor: "pointer" }}>Remove</button>
                </div>
              );
            })}
          </div>

          {/* Add — no stats at top (opposite of C), just a clean action */}
          {!showForm ? (
            <button onClick={() => setShowForm(true)} disabled={accounts.length >= 4} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: BRAND.green, color: BRAND.cream, border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Social Media
            </button>
          ) : (
            <div style={{ background: "#fff", border: `1.5px solid rgba(31,61,44,0.12)`, borderRadius: 16, padding: "28px 24px", maxWidth: 500 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 300, color: BRAND.forest, marginBottom: 20 }}>Add an account</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ flex: 1, minWidth: 140, border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "Inter,sans-serif", color: BRAND.forest, background: "#fafaf8" }}>
                  <option value="">Platform…</option>
                  {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k} disabled={connected.has(k)}>{v.name}</option>)}
                </select>
                <div style={{ flex: 2, minWidth: 160, display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, background: "#fafaf8", overflow: "hidden" }}>
                  <span style={{ padding: "0 10px", color: "#9AA199", fontSize: 14, flexShrink: 0 }}>{platform && PLATFORMS[platform] ? PLATFORMS[platform].prefix : "@"}</span>
                  <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" style={{ flex: 1, border: "none", background: "transparent", padding: "10px 12px 10px 0", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", color: BRAND.forest }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={save} style={{ background: BRAND.green, color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Account</button>
                <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: BRAND.slate, border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
