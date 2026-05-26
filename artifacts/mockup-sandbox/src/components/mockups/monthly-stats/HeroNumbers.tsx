import './_group.css';

const stats = [
  { label: 'Posts this month', value: '5', sub: '3 pending your review', delta: null, accent: '#2D6B4F' },
  { label: 'Approved & queued', value: '1', sub: 'Ready to publish', delta: null, accent: '#1F3D2C' },
  { label: 'GBP views', value: '142', sub: '23 reviews · 4.8 ★', delta: '+9%', up: true, accent: '#2D6B4F' },
  { label: 'Engagement rate', value: '3.4%', sub: 'Likes, comments, shares', delta: '+0.2%', up: true, accent: '#7D2A03' },
];

export function HeroNumbers() {
  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#6B756B', textTransform: 'uppercase', marginBottom: 6 }}>Monthly reach — all platforms</p>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1F3D2C', margin: 0 }}>May 2026 at a glance</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(31,61,44,0.1)' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: i % 2 === 0 ? '#fff' : 'rgba(45,107,79,0.04)',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            borderRight: i < 3 ? '1px solid rgba(31,61,44,0.08)' : 'none',
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: '#6B756B', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <span style={{ fontSize: 52, fontWeight: 800, color: s.accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</span>
              {s.delta && (
                <span style={{
                  fontSize: 13, fontWeight: 600, color: s.up ? '#2D6B4F' : '#7D2A03',
                  background: s.up ? 'rgba(45,107,79,0.1)' : 'rgba(125,42,3,0.1)',
                  borderRadius: 6, padding: '3px 8px', marginBottom: 8
                }}>
                  {s.up ? '↑' : '↓'} {s.delta}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: '#6B756B', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
        <a href="#" style={{ fontSize: 12, color: '#2D6B4F', fontWeight: 600, textDecoration: 'none', background: 'rgba(45,107,79,0.08)', padding: '8px 16px', borderRadius: 8 }}>Full analytics →</a>
        <a href="#" style={{ fontSize: 12, color: '#6B756B', fontWeight: 500, textDecoration: 'none', background: 'rgba(107,117,107,0.08)', padding: '8px 16px', borderRadius: 8 }}>View calendar →</a>
      </div>
    </div>
  );
}
