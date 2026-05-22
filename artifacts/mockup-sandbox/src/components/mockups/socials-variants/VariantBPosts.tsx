import { useState } from "react";

// Variant B extended — Platform tiles but each connected account
// expands to show a strip of recent post thumbnails + engagement

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
};

type Post = { id: number; date: string; caption: string; likes: number; comments: number; color: string };

const PLATFORMS: Record<string, {
  name: string; color: string; gradient?: string; prefix: string; desc: string;
  posts: Post[];
}> = {
  instagram: {
    name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)", color: "#dc2743", prefix: "@", desc: "Photos & Reels",
    posts: [
      { id: 1, date: "May 19", caption: "Fresh sourdough this morning 🌾", likes: 142, comments: 18, color: "#f5e6c8" },
      { id: 2, date: "May 16", caption: "Meet our weekend special — the honey croissant", likes: 98,  comments: 11, color: "#f0d4b0" },
      { id: 3, date: "May 12", caption: "Behind the scenes at 5am 🥐", likes: 201, comments: 34, color: "#e8c89a" },
    ],
  },
  facebook: {
    name: "Facebook",  color: "#1877F2", prefix: "@", desc: "Page & posts",
    posts: [
      { id: 1, date: "May 18", caption: "We're open this Sunday — come say hello!", likes: 54, comments: 7, color: "#d0e8ff" },
      { id: 2, date: "May 14", caption: "New menu items dropping next week 👀",      likes: 41, comments: 4, color: "#b8d8ff" },
      { id: 3, date: "May 10", caption: "Thank you for 500 followers!",              likes: 88, comments: 12, color: "#a0c4f8" },
    ],
  },
  linkedin: {
    name: "LinkedIn",  color: "#0A66C2", prefix: "in/", desc: "Professional content",
    posts: [
      { id: 1, date: "May 17", caption: "How we scaled from 1 to 3 locations in 18 months", likes: 67, comments: 9, color: "#d0e4f4" },
      { id: 2, date: "May 11", caption: "We're hiring — pastry chef wanted!",                likes: 39, comments: 5, color: "#bcd4ec" },
      { id: 3, date: "May 5",  caption: "Our sustainability journey: compostable packaging",  likes: 51, comments: 8, color: "#a8c4e4" },
    ],
  },
  tiktok: {
    name: "TikTok", color: "#010101", prefix: "@", desc: "Short-form video",
    posts: [],
  },
};

const SAMPLE_CONNECTED: Record<string, string> = { instagram: "wildflower.bakery", linkedin: "wildflower-bakery-co" };

const IgIcon = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FbIcon = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const LiIcon = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TkIcon = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
const ICONS: Record<string, ({ size }: { size?: number }) => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

const HeartIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const MsgIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

export function VariantBPosts() {
  const [connected, setConnected] = useState<Record<string, string>>(SAMPLE_CONNECTED);
  const [adding, setAdding] = useState<string | null>(null);
  const [handle, setHandle] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ instagram: true });

  const save = () => {
    if (!adding || !handle) return;
    setConnected(prev => ({ ...prev, [adding]: handle.replace(/^@/, "") }));
    setAdding(null); setHandle("");
  };

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 860 }}>
            {Object.entries(PLATFORMS).map(([key, p]) => {
              const isConn = !!connected[key];
              const isExpanded = !!expanded[key];
              const isAddingThis = adding === key;
              const Icon = ICONS[key];

              return (
                <div key={key} style={{ background: "#fff", border: `2px solid ${isConn ? "rgba(45,107,79,0.2)" : "rgba(31,61,44,0.09)"}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.15s" }}>
                  {/* Card header */}
                  <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: isConn ? "pointer" : "default", borderBottom: isConn && isExpanded ? "1px solid rgba(31,61,44,0.07)" : "none" }}
                    onClick={() => isConn && setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isConn ? (p.gradient || p.color) : "rgba(31,61,44,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: isConn ? "#fff" : BRAND.slate, flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.forest }}>{p.name}</div>
                      {isConn
                        ? <div style={{ fontSize: 11, color: BRAND.slate }}>{p.prefix}{connected[key]}</div>
                        : <div style={{ fontSize: 11, color: BRAND.slate }}>{p.desc}</div>
                      }
                    </div>
                    {isConn ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, background: "rgba(45,107,79,0.09)", color: BRAND.green, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>Active</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={BRAND.slate} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.18s" }}><polyline points="2,4 6,8 10,4"/></svg>
                      </div>
                    ) : null}
                  </div>

                  {/* Posts strip — only for connected + expanded */}
                  {isConn && isExpanded && (
                    <div>
                      {p.posts.length > 0 ? (
                        <>
                          {/* Thumbnail row */}
                          <div style={{ display: "flex", gap: 0, padding: "12px 18px 10px", gap: "8px" }}>
                            {p.posts.map(post => (
                              <div key={post.id} style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(31,61,44,0.08)" }}>
                                {/* Placeholder post image */}
                                <div style={{ height: 72, background: post.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(31,61,44,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                                </div>
                                <div style={{ padding: "6px 8px", background: "#fff" }}>
                                  <div style={{ fontSize: 9, color: BRAND.slate, marginBottom: 3 }}>{post.date}</div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <span style={{ fontSize: 9, color: BRAND.slate, display: "flex", alignItems: "center", gap: 2 }}><HeartIcon /> {post.likes}</span>
                                    <span style={{ fontSize: 9, color: BRAND.slate, display: "flex", alignItems: "center", gap: 2 }}><MsgIcon /> {post.comments}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ padding: "0 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: BRAND.slate }}>3 recent posts</span>
                            <button style={{ fontSize: 11, color: BRAND.green, fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>View all →</button>
                          </div>
                        </>
                      ) : (
                        <div style={{ padding: "16px 18px", textAlign: "center" }}>
                          <div style={{ fontSize: 12, color: "#9AA199" }}>No posts yet — your team will start posting soon.</div>
                        </div>
                      )}
                      <div style={{ padding: "10px 18px 14px", borderTop: "1px solid rgba(31,61,44,0.06)", display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => { const c = { ...connected }; delete c[key]; setConnected(c); setExpanded(prev => ({ ...prev, [key]: false })); }} style={{ fontSize: 11, color: BRAND.rust, background: "transparent", border: `1.5px solid rgba(125,42,3,0.2)`, borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  )}

                  {/* Not connected states */}
                  {!isConn && (
                    <div style={{ padding: "14px 18px" }}>
                      {isAddingThis ? (
                        <>
                          <div style={{ display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.18)`, borderRadius: 8, overflow: "hidden", marginBottom: 8, background: "#fafaf8" }}>
                            <span style={{ padding: "0 8px", fontSize: 13, color: "#9AA199" }}>{p.prefix}</span>
                            <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" autoFocus style={{ flex: 1, border: "none", background: "transparent", padding: "9px 8px 9px 0", fontSize: 13, outline: "none", fontFamily: "Inter,sans-serif", color: BRAND.forest }} />
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={save} style={{ flex: 1, background: BRAND.green, color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
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
        </main>
      </div>
    </div>
  );
}
