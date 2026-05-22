import { useState } from "react";

// Inversion of C (Dark Minimal):
// C = muted monochrome → E = maximum platform colour saturation
// C = neutral dark bg → E = platform gradients own the card backgrounds
// C = sparse/spacious → E = dense, show everything at once
// C = table rows only → E = bold tiles for all 4 platforms, always visible
// C = no counters beyond 2 stats → E = every metric surfaced
// C = understated CTAs → E = bold high-contrast action buttons

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  tan: "#EBC99B",
  slate: "#6B756B",
};

const PLATFORMS: Record<string, { name: string; gradient: string; textColor: string; prefix: string; desc: string; posts: number; followers: string }> = {
  instagram: {
    name: "Instagram", prefix: "@",
    gradient: "linear-gradient(140deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    textColor: "#fff", desc: "Photos & Reels",
    posts: 48, followers: "2.1k",
  },
  facebook: {
    name: "Facebook", prefix: "@",
    gradient: "linear-gradient(140deg,#1877F2,#0a56c9)",
    textColor: "#fff", desc: "Page & posts",
    posts: 91, followers: "854",
  },
  linkedin: {
    name: "LinkedIn", prefix: "in/",
    gradient: "linear-gradient(140deg,#0A66C2,#004182)",
    textColor: "#fff", desc: "Professional content",
    posts: 22, followers: "430",
  },
  tiktok: {
    name: "TikTok", prefix: "@",
    gradient: "linear-gradient(140deg,#2d2d2d,#111)",
    textColor: "#fff", desc: "Short-form video",
    posts: 0, followers: "—",
  },
};

const SAMPLE_CONNECTED: Record<string, string> = { instagram: "wildflower.bakery", linkedin: "wildflower-bakery-co" };

const IgIcon = ({ size = 22 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FbIcon = ({ size = 22 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LiIcon = ({ size = 22 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TkIcon = ({ size = 22 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
const ICONS: Record<string, ({ size }: { size?: number }) => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

export function VariantE() {
  const [connected, setConnected] = useState<Record<string, string>>(SAMPLE_CONNECTED);
  const [adding, setAdding] = useState<string | null>(null);
  const [handle, setHandle] = useState("");

  const save = () => {
    if (!adding || !handle) return;
    setConnected(prev => ({ ...prev, [adding]: handle.replace(/^@/, "") }));
    setAdding(null); setHandle("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0EDE4", fontFamily: "'Inter', sans-serif" }}>
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
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.08)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: BRAND.forest, fontStyle: "italic" }}>Done For You <span style={{ fontStyle: "normal", fontSize: 12, fontWeight: 700, color: BRAND.green, letterSpacing: "0.07em" }}>MARKETING</span></span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: BRAND.slate }}>Wildflower Bakery</span>
            <button style={{ fontSize: 12, color: "#7D2A03", background: "transparent", border: "1px solid rgba(125,42,3,0.2)", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: BRAND.forest, margin: "0 0 4px" }}>Your Socials</h1>
            <p style={{ fontSize: 13, color: BRAND.slate, margin: 0 }}>All four platforms — tap any unconnected one to add it.</p>
          </div>

          {/* Dense 2×2 grid — all 4 always visible, max colour */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 780 }}>
            {Object.entries(PLATFORMS).map(([key, p]) => {
              const isConn = !!connected[key];
              const isAdding = adding === key;
              const Icon = ICONS[key];

              return (
                <div key={key} style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: isConn ? "0 4px 24px rgba(0,0,0,0.14)" : "0 1px 6px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.2s",
                }}>
                  {/* Platform header — full gradient background */}
                  <div style={{ background: isConn ? p.gradient : "rgba(31,61,44,0.06)", padding: "18px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isConn ? "rgba(255,255,255,0.2)" : "rgba(31,61,44,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: isConn ? "#fff" : BRAND.slate, flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: isConn ? "#fff" : BRAND.forest, lineHeight: 1.2 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: isConn ? "rgba(255,255,255,0.7)" : BRAND.slate }}>{p.desc}</div>
                    </div>
                    {isConn && (
                      <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>ACTIVE</span>
                      </div>
                    )}
                  </div>

                  {/* Card body — white */}
                  <div style={{ background: "#fff", padding: "14px 20px 16px" }}>
                    {isConn ? (
                      <>
                        {/* Metrics row — dense, shows everything */}
                        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.forest }}>{p.followers}</div>
                            <div style={{ fontSize: 10, color: BRAND.slate, textTransform: "uppercase", letterSpacing: "0.06em" }}>Followers</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.forest }}>{p.posts}</div>
                            <div style={{ fontSize: 10, color: BRAND.slate, textTransform: "uppercase", letterSpacing: "0.06em" }}>Posts</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.green }}>↑</div>
                            <div style={{ fontSize: 10, color: BRAND.slate, textTransform: "uppercase", letterSpacing: "0.06em" }}>Growing</div>
                          </div>
                        </div>
                        <div style={{ background: "#f7f7f5", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                          <div style={{ fontSize: 10, color: BRAND.slate, marginBottom: 1 }}>Handle</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.forest }}>{p.prefix}{connected[key]}</div>
                        </div>
                        <button onClick={() => { const c = { ...connected }; delete c[key]; setConnected(c); }} style={{ width: "100%", background: "rgba(125,42,3,0.05)", color: "#7D2A03", border: "1.5px solid rgba(125,42,3,0.2)", borderRadius: 8, padding: "9px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove connection</button>
                      </>
                    ) : isAdding ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.2)`, borderRadius: 8, overflow: "hidden", marginBottom: 10, background: "#fafaf8" }}>
                          <span style={{ padding: "0 8px", fontSize: 13, color: "#9AA199" }}>{p.prefix}</span>
                          <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" autoFocus style={{ flex: 1, border: "none", background: "transparent", padding: "10px 10px 10px 0", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", color: BRAND.forest }} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={save} style={{ flex: 1, background: BRAND.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Connect</button>
                          <button onClick={() => { setAdding(null); setHandle(""); }} style={{ background: "transparent", color: BRAND.slate, border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 8, padding: "9px 14px", fontSize: 12, cursor: "pointer" }}>✕</button>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => setAdding(key)} style={{ width: "100%", background: "rgba(31,61,44,0.04)", color: BRAND.forest, border: "2px dashed rgba(31,61,44,0.18)", borderRadius: 10, padding: "14px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}>
                        + Connect {p.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
