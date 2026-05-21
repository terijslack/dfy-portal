import { useState } from "react";

const BRAND = {
  cream: "#F5F2EA",
  green: "#2D6B4F",
  forest: "#1F3D2C",
  rust: "#7D2A03",
  tan: "#EBC99B",
  slate: "#6B756B",
};

type Platform = { name: string; color: string; gradient?: string; prefix: string; description: string };

const PLATFORMS: Record<string, Platform> = {
  instagram: { name: "Instagram", gradient: "linear-gradient(135deg,#f09433,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888)", color: "#dc2743", prefix: "@", description: "Photos & Reels" },
  facebook:  { name: "Facebook",  color: "#1877F2", prefix: "@", description: "Page & posts" },
  linkedin:  { name: "LinkedIn",  color: "#0A66C2", prefix: "in/", description: "Professional content" },
  tiktok:    { name: "TikTok",    color: "#010101", prefix: "@", description: "Short-form video" },
};

const SAMPLE_CONNECTED: Record<string, string> = {
  instagram: "wildflower.bakery",
  linkedin: "wildflower-bakery-co",
};

const IgIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FbIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LiIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TkIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);
const ICONS: Record<string, ({ size }: { size?: number }) => JSX.Element> = { instagram: IgIcon, facebook: FbIcon, linkedin: LiIcon, tiktok: TkIcon };

export function VariantB() {
  const [connected, setConnected] = useState<Record<string, string>>(SAMPLE_CONNECTED);
  const [adding, setAdding] = useState<string | null>(null);
  const [handle, setHandle] = useState("");

  const save = () => {
    if (!adding || !handle) return;
    setConnected(prev => ({ ...prev, [adding]: handle.replace(/^@/, "") }));
    setAdding(null); setHandle("");
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "rgba(235,201,155,0.08)", borderLeft: `3px solid ${BRAND.tan}`, cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.tan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span style={{ fontSize: 13, color: "#F5F2EA", fontWeight: 600 }}>Your Social Media</span>
          </div>
          {[
            { label: "Post Approval", active: false },
            { label: "Content Calendar", active: false },
            { label: "Your Socials", active: true },
          ].map(item => (
            <div key={item.label} style={{ padding: "8px 20px 8px 36px", cursor: "pointer", background: item.active ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: item.active ? `3px solid ${BRAND.green}` : "3px solid transparent" }}>
              <span style={{ fontSize: 12, color: item.active ? "#F5F2EA" : "rgba(245,242,234,0.5)", fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
            </div>
          ))}
          {["Google Business Profile", "Performance Analytics", "Your Account"].map(label => (
            <div key={label} style={{ padding: "10px 20px", cursor: "pointer" }}>
              <span style={{ fontSize: 13, color: "rgba(245,242,234,0.5)" }}>{label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

        <main style={{ flex: 1, padding: 32 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 400, color: BRAND.forest, margin: "0 0 4px" }}>Your Socials</h1>
            <p style={{ fontSize: 13, color: BRAND.slate, margin: 0 }}>Click any platform to manage your connection.</p>
          </div>

          {/* 2x2 Platform tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 680, marginBottom: 32 }}>
            {Object.entries(PLATFORMS).map(([key, p]) => {
              const isConnected = !!connected[key];
              const Icon = ICONS[key];
              const isAdding = adding === key;
              return (
                <div key={key} style={{
                  background: "#fff",
                  border: `2px solid ${isConnected ? (p.gradient ? "#dc2743" : p.color) : "rgba(31,61,44,0.1)"}`,
                  borderRadius: 16,
                  padding: "22px 20px",
                  transition: "border-color 0.15s",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Subtle top accent */}
                  {isConnected && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: p.gradient || p.color }} />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: isConnected ? (p.gradient || p.color) : "rgba(31,61,44,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: isConnected ? "#fff" : BRAND.slate, flexShrink: 0 }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.forest }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: BRAND.slate }}>{p.description}</div>
                    </div>
                  </div>

                  {isConnected ? (
                    <>
                      <div style={{ background: "rgba(45,107,79,0.06)", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                        <div style={{ fontSize: 11, color: BRAND.slate, marginBottom: 1 }}>Connected as</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.forest }}>{p.prefix}{connected[key]}</div>
                      </div>
                      <button onClick={() => { const c = { ...connected }; delete c[key]; setConnected(c); }} style={{ fontSize: 12, color: BRAND.rust, background: "transparent", border: `1.5px solid rgba(125,42,3,0.2)`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", width: "100%" }}>Remove connection</button>
                    </>
                  ) : isAdding ? (
                    <>
                      <div style={{ display: "flex", alignItems: "center", border: `1.5px solid rgba(31,61,44,0.2)`, borderRadius: 8, overflow: "hidden", marginBottom: 8, background: "#fafaf8" }}>
                        <span style={{ padding: "0 8px", fontSize: 13, color: "#9AA199" }}>{p.prefix}</span>
                        <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" autoFocus style={{ flex: 1, border: "none", background: "transparent", padding: "9px 10px 9px 0", fontSize: 13, outline: "none", color: BRAND.forest, fontFamily: "Inter,sans-serif" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={save} style={{ flex: 1, background: BRAND.green, color: "#fff", border: "none", borderRadius: 7, padding: "8px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
                        <button onClick={() => { setAdding(null); setHandle(""); }} style={{ background: "transparent", color: BRAND.slate, border: `1.5px solid rgba(31,61,44,0.15)`, borderRadius: 7, padding: "8px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => setAdding(key)} style={{ width: "100%", background: "rgba(31,61,44,0.04)", color: BRAND.forest, border: `1.5px dashed rgba(31,61,44,0.2)`, borderRadius: 8, padding: "10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add {p.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(45,107,79,0.05)", border: `1.5px solid rgba(45,107,79,0.12)`, borderRadius: 12, padding: "14px 18px", maxWidth: 680, display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ fontSize: 12, color: BRAND.slate, margin: 0 }}>You're connected on <strong style={{ color: BRAND.forest }}>{Object.keys(connected).length}</strong> of 4 platforms. Your team manages content on all connected accounts.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
