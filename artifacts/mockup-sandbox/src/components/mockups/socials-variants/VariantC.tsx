import { useState } from "react";

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
  dark: "#141F17",
};

type PlatformMeta = { name: string; color: string; gradient?: string; prefix: string; short: string };
const PLATFORMS: Record<string, PlatformMeta> = {
  instagram: { name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)", color: "#dc2743", prefix: "@", short: "IG" },
  facebook:  { name: "Facebook",  color: "#1877F2", prefix: "@", short: "FB" },
  linkedin:  { name: "LinkedIn",  color: "#0A66C2", prefix: "in/", short: "LI" },
  tiktok:    { name: "TikTok",    color: "#666", prefix: "@", short: "TT" },
};

const SAMPLE = [
  { platform: "instagram", username: "wildflower.bakery" },
  { platform: "linkedin",  username: "wildflower-bakery-co" },
];

const IgIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FbIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LiIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
const ICONS: Record<string, () => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

export function VariantC() {
  const [accounts, setAccounts] = useState(SAMPLE);
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("");
  const [handle, setHandle] = useState("");

  const connected = new Set(accounts.map(a => a.platform));
  const p = platform ? PLATFORMS[platform] : null;

  const save = () => {
    if (!platform || !handle) return;
    setAccounts([...accounts, { platform, username: handle.replace(/^@/, "") }]);
    setPlatform(""); setHandle(""); setShowForm(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f1a12", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar — deeper dark */}
      <aside style={{ width: 220, background: "#0a120c", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 11, color: BRAND.tan, opacity: 0.6, marginBottom: 2, letterSpacing: "0.07em" }}>Welcome back</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>Wildflower Bakery</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(235,201,155,0.06)", borderLeft: `3px solid ${BRAND.tan}`, cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.tan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>Your Social Media</span>
          </div>
          {[{ label: "Post Approval", active: false }, { label: "Content Calendar", active: false }, { label: "Your Socials", active: true }].map(item => (
            <div key={item.label} style={{ padding: "8px 20px 8px 36px", cursor: "pointer", borderLeft: item.active ? `3px solid ${BRAND.green}` : "3px solid transparent" }}>
              <span style={{ fontSize: 12, color: item.active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
          {["Google Business Profile", "Analytics", "Account"].map(l => (
            <div key={l} style={{ padding: "10px 20px", cursor: "pointer" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{l}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ background: "#0a120c", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: "rgba(255,255,255,0.85)", fontStyle: "italic" }}>Done For You</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.tan, letterSpacing: "0.07em" }}>MARKETING</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Wildflower Bakery</span>
            <button style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "40px 40px 32px", display: "flex", gap: 32 }}>
          {/* Content */}
          <div style={{ flex: 1 }}>
            {/* Page title */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.9)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>Your Socials</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>The accounts your team manages on your behalf.</p>
            </div>

            {/* Stat row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'Fraunces', serif", marginBottom: 2 }}>{accounts.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Connected</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 20px", flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "'Fraunces', serif", marginBottom: 2 }}>{4 - accounts.length}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Available slots</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 20px", flex: 2 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Managed since</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Jan 2025</div>
              </div>
            </div>

            {/* Accounts table-style */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0 16px", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Handle</span>
                <span />
              </div>
              {accounts.map(a => {
                const meta = PLATFORMS[a.platform];
                const Icon = ICONS[a.platform];
                return (
                  <div key={a.platform} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0 16px", alignItems: "center", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.gradient || meta.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <Icon />
                      </div>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", minWidth: 80 }}>{meta.name}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}>{meta.prefix}{a.username}</span>
                    <button onClick={() => setAccounts(accounts.filter(x => x.platform !== a.platform))} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,100,60,0.7)", padding: "5px 12px", fontSize: 11, cursor: "pointer" }}>Remove</button>
                  </div>
                );
              })}
            </div>

            {/* Add form */}
            {!showForm ? (
              <button onClick={() => setShowForm(true)} disabled={accounts.length >= 4} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,107,79,0.2)", color: BRAND.green, border: `1px solid rgba(45,107,79,0.3)`, borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Social Media
              </button>
            ) : (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Add account</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter,sans-serif", flex: 1 }}>
                    <option value="">Platform…</option>
                    {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k} disabled={connected.has(k)}>{v.name}</option>)}
                  </select>
                  <div style={{ flex: 2, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
                    <span style={{ padding: "0 10px", color: "rgba(255,255,255,0.25)", fontSize: 13, flexShrink: 0 }}>{p?.prefix || "@"}</span>
                    <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" style={{ flex: 1, background: "transparent", border: "none", padding: "9px 12px 9px 0", fontSize: 13, color: "rgba(255,255,255,0.8)", outline: "none", fontFamily: "Inter,sans-serif" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={save} style={{ background: BRAND.green, color: "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save</button>
                  <button onClick={() => setShowForm(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside style={{ width: 190, flexShrink: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>Quick Access</div>
            {[
              { label: "Post Approval", sub: "3 awaiting", active: false },
              { label: "Content Calendar", sub: "Monthly view", active: false },
              { label: "Your Socials", sub: `${accounts.length} connected`, active: true },
            ].map(card => (
              <div key={card.label} style={{ background: card.active ? "rgba(45,107,79,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${card.active ? "rgba(45,107,79,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: card.active ? BRAND.green : "rgba(255,255,255,0.5)", marginBottom: 2 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{card.sub}</div>
              </div>
            ))}
          </aside>
        </main>
      </div>
    </div>
  );
}
