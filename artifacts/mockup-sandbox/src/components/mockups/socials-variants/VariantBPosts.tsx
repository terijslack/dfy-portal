import { useState } from "react";

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
};

type Post = { id: number; date: string; likes: number; comments: number; color: string };

type PlatformMeta = {
  name: string; color: string; gradient?: string; prefix: string; desc: string; posts: Post[];
};

// Primary 4 fixed tiles
const PRIMARY: Record<string, PlatformMeta> = {
  instagram: {
    name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)", color: "#dc2743", prefix: "@", desc: "Photos & Reels",
    posts: [
      { id: 1, date: "May 19", likes: 142, comments: 18, color: "#f5e6c8" },
      { id: 2, date: "May 16", likes: 98,  comments: 11, color: "#f0d4b0" },
      { id: 3, date: "May 12", likes: 201, comments: 34, color: "#e8c89a" },
    ],
  },
  facebook: {
    name: "Facebook", color: "#1877F2", prefix: "@", desc: "Page & posts",
    posts: [
      { id: 1, date: "May 18", likes: 54, comments: 7,  color: "#d0e8ff" },
      { id: 2, date: "May 14", likes: 41, comments: 4,  color: "#b8d8ff" },
      { id: 3, date: "May 10", likes: 88, comments: 12, color: "#a0c4f8" },
    ],
  },
  linkedin: {
    name: "LinkedIn", color: "#0A66C2", prefix: "in/", desc: "Professional content",
    posts: [
      { id: 1, date: "May 17", likes: 67, comments: 9, color: "#d0e4f4" },
      { id: 2, date: "May 11", likes: 39, comments: 5, color: "#bcd4ec" },
      { id: 3, date: "May 5",  likes: 51, comments: 8, color: "#a8c4e4" },
    ],
  },
  youtube: {
    name: "YouTube", color: "#FF0000", prefix: "@", desc: "Videos & Shorts",
    posts: [
      { id: 1, date: "May 15", likes: 310, comments: 42, color: "#ffe0e0" },
      { id: 2, date: "May 8",  likes: 188, comments: 27, color: "#ffc8c8" },
      { id: 3, date: "Apr 30", likes: 254, comments: 31, color: "#ffb0b0" },
    ],
  },
};

// "Other" platforms available in the dropdown
const OTHER_PLATFORMS: Record<string, { name: string; color: string; prefix: string }> = {
  tiktok:    { name: "TikTok",      color: "#010101", prefix: "@" },
  twitter:   { name: "X (Twitter)", color: "#000",    prefix: "@" },
  pinterest: { name: "Pinterest",   color: "#E60023", prefix: "@" },
  snapchat:  { name: "Snapchat",    color: "#FFFC00", prefix: "@" },
  threads:   { name: "Threads",     color: "#000",    prefix: "@" },
};

const SAMPLE_CONNECTED: Record<string, string> = {
  instagram: "wildflower.bakery",
  linkedin: "wildflower-bakery-co",
};

// SVG Icons
const IgIcon  = ({ s = 20 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FbIcon  = ({ s = 20 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LiIcon  = ({ s = 20 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const YtIcon  = ({ s = 20 }: { s?: number }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;
const ICONS: Record<string, ({ s }: { s?: number }) => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, youtube: YtIcon };

const HeartIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const MsgIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ShareIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;

export function VariantBPosts() {
  const [connected, setConnected] = useState<Record<string, string>>(SAMPLE_CONNECTED);
  // "other" slot: which platform was selected from dropdown + handle
  const [otherPlatform, setOtherPlatform] = useState<string>("");
  const [otherHandle, setOtherHandle]     = useState<string>("");
  const [otherConnected, setOtherConnected] = useState<{ platform: string; username: string } | null>(null);

  const [adding, setAdding]       = useState<string | null>(null);
  const [handle, setHandle]       = useState("");
  const [expanded, setExpanded]   = useState<Record<string, boolean>>({ instagram: true });

  const saveMain = (key: string) => {
    if (!handle) return;
    setConnected(prev => ({ ...prev, [key]: handle.replace(/^@/, "") }));
    setAdding(null); setHandle("");
  };

  const saveOther = () => {
    if (!otherPlatform || !otherHandle) return;
    setOtherConnected({ platform: otherPlatform, username: otherHandle.replace(/^@/, "") });
    setOtherPlatform(""); setOtherHandle("");
  };

  const removeOther = () => { setOtherConnected(null); };

  // Available "other" options = those not already connected as other
  const usedOther = otherConnected?.platform;
  const availableOthers = Object.entries(OTHER_PLATFORMS).filter(([k]) => k !== usedOther);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BRAND.cream, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: BRAND.forest, flexShrink: 0 }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, color: BRAND.tan, opacity: 0.7, marginBottom: 2 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Wildflower Bakery</div>
        </div>
        <nav style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(235,201,155,0.08)", borderLeft: `3px solid ${BRAND.tan}` }}>
            <ShareIcon />
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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <header style={{ background: "#fff", borderBottom: "1px solid rgba(31,61,44,0.08)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: BRAND.forest, fontStyle: "italic" }}>Done For You <span style={{ fontStyle: "normal", fontSize: 12, fontWeight: 700, color: BRAND.green, letterSpacing: "0.07em" }}>MARKETING</span></span>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: BRAND.slate }}>Wildflower Bakery</span>
            <button style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1px solid rgba(125,42,3,0.2)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Sign out</button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: BRAND.forest, margin: "0 0 4px" }}>Your Socials</h1>
            <p style={{ fontSize: 13, color: BRAND.slate, margin: 0 }}>Recent posts from your connected accounts.</p>
          </div>

          {/* 2×2 grid: 4 primary platforms */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 860, marginBottom: 20 }}>
            {Object.entries(PRIMARY).map(([key, p]) => {
              const isConn     = !!connected[key];
              const isExpanded = !!expanded[key];
              const isAddingThis = adding === key;
              const Icon = ICONS[key];

              return (
                <div key={key} style={{ background: "#fff", border: `2px solid ${isConn ? "rgba(45,107,79,0.2)" : "rgba(31,61,44,0.09)"}`, borderRadius: 16, overflow: "hidden" }}>
                  {/* Header row */}
                  <div style={{ padding: "15px 18px", display: "flex", alignItems: "center", gap: 12, cursor: isConn ? "pointer" : "default", borderBottom: isConn && isExpanded ? "1px solid rgba(31,61,44,0.07)" : "none" }}
                    onClick={() => isConn && setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isConn ? (p.gradient || p.color) : "rgba(31,61,44,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: isConn ? "#fff" : BRAND.slate, flexShrink: 0 }}>
                      <Icon s={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.forest }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: BRAND.slate }}>{isConn ? `${p.prefix}${connected[key]}` : p.desc}</div>
                    </div>
                    {isConn && (
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ fontSize: 10, background: "rgba(45,107,79,0.09)", color: BRAND.green, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>Active</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={BRAND.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}><polyline points="2,4 6,8 10,4"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Expanded posts */}
                  {isConn && isExpanded && (
                    <div>
                      <div style={{ display: "flex", gap: 8, padding: "12px 18px 10px" }}>
                        {p.posts.map(post => (
                          <div key={post.id} style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(31,61,44,0.08)" }}>
                            <div style={{ height: 68, background: post.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(31,61,44,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                            </div>
                            <div style={{ padding: "6px 7px", background: "#fff" }}>
                              <div style={{ fontSize: 9, color: BRAND.slate, marginBottom: 3 }}>{post.date}</div>
                              <div style={{ display: "flex", gap: 7 }}>
                                <span style={{ fontSize: 9, color: BRAND.slate, display: "flex", alignItems: "center", gap: 2 }}><HeartIcon /> {post.likes}</span>
                                <span style={{ fontSize: 9, color: BRAND.slate, display: "flex", alignItems: "center", gap: 2 }}><MsgIcon /> {post.comments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "0 18px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: BRAND.slate }}>3 recent posts</span>
                        <button style={{ fontSize: 11, color: BRAND.green, fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>View all →</button>
                      </div>
                      <div style={{ padding: "10px 18px 12px", borderTop: "1px solid rgba(31,61,44,0.06)", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => { const c = { ...connected }; delete c[key]; setConnected(c); setExpanded(p => ({ ...p, [key]: false })); }} style={{ fontSize: 11, color: BRAND.rust, background: "transparent", border: `1.5px solid rgba(125,42,3,0.2)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  )}

                  {/* Not connected */}
                  {!isConn && (
                    <div style={{ padding: "14px 18px" }}>
                      {isAddingThis ? (
                        <>
                          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.18)`, borderRadius: 8, overflow: "hidden", marginBottom: 8, background: "#fafaf8" }}>
                            <span style={{ padding: "0 8px", fontSize: 13, color: "#9AA199" }}>{p.prefix}</span>
                            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" autoFocus style={{ flex: 1, border: "none", background: "transparent", padding: "9px 8px 9px 0", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", color: BRAND.forest }} />
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => saveMain(key)} style={{ flex: 1, background: BRAND.green, color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
                            <button onClick={() => { setAdding(null); setHandle(""); }} style={{ background: "transparent", color: BRAND.slate, border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 7, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => setAdding(key)} style={{ width: "100%", background: "rgba(31,61,44,0.03)", color: BRAND.forest, border: "1.5px dashed rgba(31,61,44,0.18)", borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add {p.name}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* "Other" platform row — full width below the grid */}
          <div style={{ background: "#fff", border: "2px solid rgba(31,61,44,0.09)", borderRadius: 16, overflow: "hidden", maxWidth: 860 }}>
            {otherConnected ? (
              // Connected "other" — show row with remove
              <div style={{ padding: "15px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: OTHER_PLATFORMS[otherConnected.platform]?.color || "#666", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={otherConnected.platform === "snapchat" ? "#000" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: BRAND.slate, marginBottom: 1 }}>{OTHER_PLATFORMS[otherConnected.platform]?.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.forest }}>{OTHER_PLATFORMS[otherConnected.platform]?.prefix}{otherConnected.username}</div>
                </div>
                <span style={{ fontSize: 10, background: "rgba(45,107,79,0.09)", color: BRAND.green, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>Active</span>
                <button onClick={removeOther} style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1.5px solid rgba(125,42,3,0.2)`, borderRadius: 7, padding: "6px 13px", cursor: "pointer" }}>Remove</button>
              </div>
            ) : (
              // Not connected — show "Other" tile with platform dropdown
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(31,61,44,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: BRAND.slate, flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.forest }}>Other Platform</div>
                    <div style={{ fontSize: 11, color: BRAND.slate }}>TikTok, X, Pinterest, Snapchat, Threads</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <select value={otherPlatform} onChange={e => setOtherPlatform(e.target.value)}
                    style={{ border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "Inter,sans-serif", color: BRAND.forest, background: "#fafaf8", minWidth: 160 }}>
                    <option value="">Choose platform…</option>
                    {availableOthers.map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                  <div style={{ flex: 1, minWidth: 160, display: "flex", alignItems: "center", border: "1.5px solid rgba(31,61,44,0.15)", borderRadius: 8, overflow: "hidden", background: "#fafaf8" }}>
                    <span style={{ padding: "0 9px", fontSize: 13, color: "#9AA199", flexShrink: 0 }}>
                      {otherPlatform && OTHER_PLATFORMS[otherPlatform] ? OTHER_PLATFORMS[otherPlatform].prefix : "@"}
                    </span>
                    <input value={otherHandle} onChange={e => setOtherHandle(e.target.value)} placeholder="your_handle"
                      style={{ flex: 1, border: "none", background: "transparent", padding: "9px 10px 9px 0", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", color: BRAND.forest }} />
                  </div>
                  <button onClick={saveOther} disabled={!otherPlatform || !otherHandle}
                    style={{ background: otherPlatform && otherHandle ? BRAND.green : "rgba(31,61,44,0.12)", color: otherPlatform && otherHandle ? "#fff" : BRAND.slate, border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: otherPlatform && otherHandle ? "pointer" : "not-allowed", transition: "background 0.15s" }}>
                    Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
