export function VariantA() {
  const palette = {
    instagram: { bar: 'linear-gradient(180deg,#f09433,#dc2743,#bc1888)', dot: '#dc2743', label: 'Instagram' },
    facebook:  { bar: '#1877F2', dot: '#1877F2', label: 'Facebook' },
    linkedin:  { bar: '#0A66C2', dot: '#0A66C2', label: 'LinkedIn' },
  };

  const posts = [
    { id:1, platform:'instagram', date:'May 22, 2026', status:'approved',  caption:'New client spotlight: Bloom Wellness launched their spring collection with our help. The response has been incredible — over 2,000 new followers in the first week.' },
    { id:2, platform:'facebook',  date:'May 19, 2026', status:'scheduled', caption:'Join us this weekend for our free marketing workshop. Learn the exact strategies we use to grow local businesses.' },
    { id:3, platform:'linkedin',  date:'May 15, 2026', status:'published', caption:'Excited to share our Q1 results: we helped 12 local businesses increase their social engagement by an average of 340%.' },
    { id:4, platform:'instagram', date:'Apr 28, 2026', status:'published', caption:'Behind the scenes at the Bloom Wellness photo shoot. Great content starts with great visuals.' },
    { id:5, platform:'facebook',  date:'Apr 20, 2026', status:'published', caption:"April is here and so are fresh new ideas for your business. Let's talk strategy." },
    { id:6, platform:'linkedin',  date:'Apr 12, 2026', status:'published', caption:"Marketing insight: consistency beats virality every time. Here's what 6 months of steady posting does for your brand." },
  ];

  const months = [
    { label: 'May 2026', posts: posts.filter(p => p.date.startsWith('May')) },
    { label: 'April 2026', posts: posts.filter(p => p.date.startsWith('Apr')) },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    approved:  { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Approved' },
    scheduled: { bg: 'rgba(235,200,100,0.2)', color: '#7D5000', label: 'Scheduled' },
    published: { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Published' },
    pending:   { bg: 'rgba(31,61,44,0.08)',  color: '#6B756B', label: 'Pending' },
  };

  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '32px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontFamily: 'Georgia, serif', fontWeight: 400, color: '#1F3D2C', margin: 0 }}>
          Your Socials
        </h1>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {['All','Instagram','Facebook','LinkedIn'].map((f, i) => (
          <button key={f} style={{
            padding: '6px 16px', borderRadius: 20, border: i === 0 ? 'none' : '1.5px solid rgba(31,61,44,0.15)',
            background: i === 0 ? '#1F3D2C' : 'transparent',
            color: i === 0 ? '#fff' : '#6B756B',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}>{f}</button>
        ))}
      </div>

      {/* Month groups */}
      {months.map(month => (
        <div key={month.label} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontFamily: 'Georgia, serif', color: '#1F3D2C', marginBottom: 14, fontWeight: 400 }}>
            {month.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {month.posts.map(post => {
              const p = palette[post.platform as keyof typeof palette];
              const s = statusStyle[post.status] || statusStyle.pending;
              return (
                <div key={post.id} style={{
                  background: '#fff', borderRadius: 14,
                  border: '1.5px solid rgba(31,61,44,0.08)',
                  display: 'flex', overflow: 'hidden',
                }}>
                  {/* Color bar */}
                  <div style={{ width: 4, flexShrink: 0, background: p.bar }} />

                  {/* Thumbnail placeholder */}
                  <div style={{
                    width: 72, height: 72, margin: '14px 0 14px 14px',
                    borderRadius: 10, background: 'rgba(31,61,44,0.06)',
                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(31,61,44,0.2)'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#1F3D2C' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.dot, display: 'inline-block' }} />
                        {p.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#9AA199' }}>{post.date}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#1F3D2C', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {post.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
