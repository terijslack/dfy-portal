import './_group.css';

const metrics = [
  { label: 'Posts published', value: 5, max: 12, display: '5', unit: 'this month', color: '#2D6B4F', delta: null },
  { label: 'Approved & queued', value: 1, max: 12, display: '1', unit: 'ready to publish', color: '#1F3D2C', delta: null },
  { label: 'GBP views', value: 142, max: 200, display: '142', unit: 'profile views', color: '#2D6B4F', delta: '+9% vs last mo.' },
  { label: 'Engagement rate', value: 3.4, max: 10, display: '3.4%', unit: 'likes, comments, shares', color: '#7D2A03', delta: '+0.2% vs last mo.' },
];

const platforms = [
  { name: 'Instagram', followers: '2,240', delta: '+22%', color: '#E1306C' },
  { name: 'Facebook', followers: '1,490', delta: '+11%', color: '#1877F2' },
  { name: 'Google', followers: '948', delta: '+9%', color: '#4285F4' },
  { name: 'LinkedIn', followers: '142', delta: '+3%', color: '#0A66C2' },
];

export function VisualBars() {
  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '36px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px', border: '0.5px solid rgba(31,61,44,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#1F3D2C', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Monthly KPIs</p>
            <a href="#" style={{ fontSize: 11, color: '#2D6B4F', fontWeight: 600, textDecoration: 'none' }}>Full analytics →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {metrics.map((m, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                  <span style={{ fontSize: 12, color: '#6B756B', fontWeight: 500 }}>{m.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {m.delta && <span style={{ fontSize: 10, color: '#2D6B4F', fontWeight: 600, background: 'rgba(45,107,79,0.1)', borderRadius: 4, padding: '2px 6px' }}>{m.delta}</span>}
                    <span style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.display}</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: 'rgba(31,61,44,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((m.value / m.max) * 100)}%`,
                    borderRadius: 99,
                    background: `linear-gradient(90deg, ${m.color}cc, ${m.color})`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <p style={{ fontSize: 10, color: '#9aaa9a', margin: '4px 0 0' }}>{m.unit}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px', border: '0.5px solid rgba(31,61,44,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#1F3D2C', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Reach by platform</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {platforms.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#1F3D2C', fontWeight: 500, width: 80 }}>{p.name}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'rgba(31,61,44,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((parseInt(p.followers.replace(',','')) / 2500) * 100)}%`,
                    background: p.color,
                    opacity: 0.7,
                    borderRadius: 99,
                  }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1F3D2C', width: 52, textAlign: 'right' }}>{p.followers}</span>
                <span style={{ fontSize: 11, color: '#2D6B4F', fontWeight: 600, width: 36, textAlign: 'right' }}>{p.delta}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '0.5px solid rgba(31,61,44,0.08)' }}>
            <p style={{ fontSize: 11, color: '#6B756B', margin: '0 0 12px', fontWeight: 500 }}>This month vs last</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['Total reach', '4,820'], ['Avg. engagement', '3.4%'], ['GBP rating', '4.8 ★']].map(([k,v], i) => (
                <div key={i} style={{ flex: 1, background: 'rgba(45,107,79,0.04)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 10, color: '#6B756B', margin: '0 0 4px' }}>{k}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#1F3D2C', margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
