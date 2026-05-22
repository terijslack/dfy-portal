import { useState } from "react";

const CURRENT = "Growth Engine";

const PLANS = [
  { key: "Starter Presence", price: 800 },
  { key: "Growth Engine",    price: 1500 },
  { key: "Marketing Partner", price: 2800 },
];

const ALL_FEATURES = [
  { label: "Social media platforms",       vals: ["Up to 2", "Up to 4", "Complete mgmt"] },
  { label: "Posts per month",              vals: ["Up to 16", "Up to 32", "Unlimited"] },
  { label: "Caption writing",              vals: [true, true, true] },
  { label: "Google Business Profile",      vals: ["Setup / review", "Full management", "Full management"] },
  { label: "Strategic support",            vals: [false, true, true] },
  { label: "Promotional emails/month",     vals: [false, "2/month", true] },
  { label: "Automated Google Reviews",     vals: [false, true, true] },
  { label: "Client dashboard & analytics", vals: [false, true, true] },
  { label: "Monthly strategy check-ins",   vals: [false, false, true] },
  { label: "Appointment calendar setup",   vals: [false, false, true] },
  { label: "Automated appt reminders",     vals: [false, false, true] },
  { label: "Email campaigns & newsletters",vals: [false, false, true] },
  { label: "Paid ads management",          vals: [false, false, true] },
  { label: "Landing page / promo",         vals: [false, false, true] },
  { label: "Strategic onboarding call",    vals: [false, false, "1 hour"] },
];

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="rgba(45,107,79,0.10)" />
    <polyline points="4,7 6,9 10,5" stroke="#2D6B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Dash = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <line x1="4" y1="7" x2="10" y2="7" stroke="rgba(31,61,44,0.18)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CompareB() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center p-6">
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(31,61,44,0.10), 0 1px 4px rgba(31,61,44,0.06)",
        width: "100%",
        maxWidth: 820,
        padding: "36px 36px 30px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 22, color: "#1F3D2C", margin: "0 0 22px" }}>
          Compare Plans
        </h2>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ width: "34%", padding: "0 0 14px", textAlign: "left" }} />
              {PLANS.map(p => {
                const isCurrent = p.key === CURRENT;
                const isSelected = selected === p.key;
                return (
                  <th
                    key={p.key}
                    onClick={() => !isCurrent && setSelected(prev => prev === p.key ? null : p.key)}
                    style={{
                      width: "22%",
                      padding: "14px 10px",
                      textAlign: "center",
                      cursor: isCurrent ? "default" : "pointer",
                      borderRadius: "12px 12px 0 0",
                      background: isCurrent ? "#1F3D2C" : isSelected ? "rgba(45,107,79,0.06)" : "transparent",
                      border: isSelected ? "1.5px solid #2D6B4F" : "1.5px solid transparent",
                      borderBottom: "none",
                      transition: "all 0.13s",
                      position: "relative",
                    }}
                  >
                    {isCurrent && (
                      <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", color: "#2D6B4F", background: "rgba(45,107,79,0.10)", padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", fontFamily: "Inter, system-ui, sans-serif" }}>
                        CURRENT
                      </div>
                    )}
                    <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: isCurrent ? "#EBC99B" : "#1F3D2C", marginBottom: 4 }}>{p.key}</div>
                    <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: isCurrent ? "#F5F2EA" : "#1F3D2C", lineHeight: 1 }}>
                      ${p.price.toLocaleString()}<span style={{ fontSize: 10, fontWeight: 500, color: isCurrent ? "rgba(245,242,234,0.5)" : "#9AA199" }}>/mo</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ALL_FEATURES.map((row, ri) => (
              <tr key={row.label} style={{ background: ri % 2 === 0 ? "rgba(31,61,44,0.015)" : "transparent" }}>
                <td style={{ padding: "9px 0 9px 4px", fontFamily: "Inter, system-ui, sans-serif", fontSize: 11.5, color: "#6B756B", borderTop: "1px solid rgba(31,61,44,0.06)" }}>
                  {row.label}
                </td>
                {row.vals.map((v, ci) => {
                  const isCurrent = PLANS[ci].key === CURRENT;
                  const isSelected = selected === PLANS[ci].key;
                  return (
                    <td
                      key={ci}
                      onClick={() => !isCurrent && setSelected(prev => prev === PLANS[ci].key ? null : PLANS[ci].key)}
                      style={{
                        padding: "9px 10px",
                        textAlign: "center",
                        borderTop: "1px solid rgba(31,61,44,0.06)",
                        background: isCurrent ? "rgba(31,61,44,0.03)" : isSelected ? "rgba(45,107,79,0.04)" : "transparent",
                        cursor: isCurrent ? "default" : "pointer",
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 11,
                        color: "#6B756B",
                        transition: "background 0.13s",
                      }}
                    >
                      {v === true ? <div style={{ display: "flex", justifyContent: "center" }}><Check /></div>
                       : v === false ? <div style={{ display: "flex", justifyContent: "center" }}><Dash /></div>
                       : <span style={{ color: isCurrent ? "#2D6B4F" : "#6B756B", fontWeight: typeof v === "string" ? 500 : 400 }}>{v}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22, paddingTop: 16, borderTop: "1px solid rgba(31,61,44,0.08)" }}>
          <button style={{ background: "transparent", border: "1.5px solid rgba(31,61,44,0.14)", borderRadius: 8, color: "#6B756B", fontSize: 13, fontWeight: 500, padding: "9px 20px", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
            Close
          </button>
          <button disabled={!selected} style={{ background: selected ? "#2D6B4F" : "#C8CCCA", border: "none", borderRadius: 8, color: "#F5F2EA", fontSize: 13, fontWeight: 600, padding: "9px 22px", cursor: selected ? "pointer" : "not-allowed", fontFamily: "Inter, system-ui, sans-serif" }}>
            Request Change
          </button>
        </div>
      </div>
    </div>
  );
}
