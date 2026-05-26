import './_group.css';

const cards = [
  {
    label: 'Posts this month',
    value: '5',
    sub: '3 pending your review',
    bg: '#1F3D2C',
    fg: '#fff',
    subFg: 'rgba(255,255,255,0.6)',
    accent: '#EBC99B',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  {
    label: 'Approved & queued',
    value: '1',
    sub: 'Ready to publish',
    bg: '#EBC99B',
    fg: '#1F3D2C',
    subFg: 'rgba(31,61,44,0.6)',
    accent: '#1F3D2C',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    label: 'GBP views',
    value: '142',
    sub: '+9% vs last month',
    delta: '↑',
    bg: '#2D6B4F',
    fg: '#fff',
    subFg: 'rgba(255,255,255,0.65)',
    accent: '#EBC99B',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Engagement rate',
    value: '3.4%',
    sub: '+0.2% vs last month',
    delta: '↑',
    bg: '#F5F2EA',
    fg: '#7D2A03',
    subFg: '#6B756B',
    accent: '#7D2A03',
    border: '1px solid rgba(31,61,44,0.12)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export function ScorecardGrid() {
  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '36px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#6B756B', textTransform: 'uppercase', margin: '0 0 4px' }}>May 2026</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F3D2C', margin: 0 }}>Your marketing this month</h2>
        </div>
        <a href="#" style={{ fontSize: 12, color: '#2D6B4F', fontWeight: 600, textDecoration: 'none', background: 'rgba(45,107,79,0.08)', padding: '8px 16px', borderRadius: 8 }}>Full analytics →</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: c.bg,
            border: c.border || 'none',
            borderRadius: 16,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxSizing: 'border-box',
          }}>
            <div style={{ color: c.fg, opacity: 0.75 }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: c.subFg, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: c.fg, lineHeight: 1, letterSpacing: '-0.02em' }}>{c.value}</span>
                {c.delta && <span style={{ fontSize: 18, color: c.accent, marginBottom: 4, fontWeight: 700 }}>{c.delta}</span>}
              </div>
            </div>
            <p style={{ fontSize: 11, color: c.subFg, margin: 0, lineHeight: 1.5 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[
          { k: 'GBP rating', v: '4.8 ★', sub: '23 reviews' },
          { k: 'Total reach', v: '4,820', sub: 'across all platforms' },
          { k: 'Top platform', v: 'Instagram', sub: '+22% growth' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '0.5px solid rgba(31,61,44,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: '#6B756B', margin: '0 0 4px' }}>{item.k}</p>
              <p style={{ fontSize: 12, color: '#9aaa9a', margin: 0 }}>{item.sub}</p>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1F3D2C' }}>{item.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
