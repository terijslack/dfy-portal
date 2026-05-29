export function VariantB() {
  const platforms: Record<string, { color: string; label: string; icon: string }> = {
    instagram: { color: '#dc2743', label: 'Instagram',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` },
    facebook: { color: '#1877F2', label: 'Facebook',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>` },
    linkedin: { color: '#0A66C2', label: 'LinkedIn',
      icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
  };

  const posts = [
    { id:1, platform:'instagram', date:'May 22', status:'approved',  caption:'New client spotlight: Bloom Wellness launched their spring collection with incredible results.' },
    { id:2, platform:'facebook',  date:'May 19', status:'scheduled', caption:'Join us this weekend for our free marketing workshop. Learn proven growth strategies.' },
    { id:3, platform:'linkedin',  date:'May 15', status:'published', caption:'Q1 results: we helped 12 businesses increase engagement by an average of 340%.' },
    { id:4, platform:'instagram', date:'Apr 28', status:'published', caption:'Behind the scenes at the Bloom Wellness photo shoot. Great content starts with great visuals.' },
    { id:5, platform:'facebook',  date:'Apr 20', status:'published', caption:'April is here and so are fresh new ideas for your business. Let's talk strategy.' },
    { id:6, platform:'linkedin',  date:'Apr 12', status:'published', caption:'Consistency beats virality every time. Here's what 6 months of steady posting does.' },
  ];

  const months = [
    { label: 'May 2026', posts: posts.filter(p => p.date.startsWith('May')) },
    { label: 'April 2026', posts: posts.filter(p => p.date.startsWith('Apr')) },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    approved:  { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Approved' },
    scheduled: { bg: 'rgba(235,200,100,0.2)', color: '#7D5000', label: 'Scheduled' },
    published: { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Published' },
  };

  return (
    <div style={{ background: '#F5F2EA', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '32px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontFamily: 'Georgia, serif', fontWeight: 400, color: '#1F3D2C', margin: 0 }}>
          Your Socials
        </h1>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['All','Instagram','Facebook','LinkedIn'].map((f, i) => (
          <button key={f} style={{
            padding: '6px 16px', borderRadius: 20,
            border: i === 0 ? 'none' : '1.5px solid rgba(31,61,44,0.15)',
            background: i === 0 ? '#1F3D2C' : 'transparent',
            color: i === 0 ? '#fff' : '#6B756B',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}>{f}</button>
        ))}
      </div>

      {months.map(month => (
        <div key={month.label} style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontFamily: 'Georgia, serif', color: '#1F3D2C', marginBottom: 14 }}>
            {month.label}
          </div>
          {/* 2-column card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {month.posts.map(post => {
              const p = platforms[post.platform];
              const s = statusStyle[post.status] || statusStyle.published;
              return (
                <div key={post.id} style={{
                  background: '#fff', borderRadius: 14,
                  border: '1.5px solid rgba(31,61,44,0.08)',
                  overflow: 'hidden',
                }}>
                  {/* Colored top accent + image area */}
                  <div style={{
                    height: 80, background: p.color + '18',
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: '1px solid rgba(31,61,44,0.06)'
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="1.2" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    {/* Platform badge top-right */}
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 26, height: 26, borderRadius: 8,
                      background: p.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} dangerouslySetInnerHTML={{ __html: p.icon }} />
                  </div>
                  {/* Body */}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: '#9AA199' }}>{post.date}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: '#1F3D2C', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>
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
