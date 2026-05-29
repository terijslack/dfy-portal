export function VariantC() {
  const platforms: Record<string, { color: string; label: string }> = {
    instagram: { color: '#dc2743', label: 'Instagram' },
    facebook:  { color: '#1877F2', label: 'Facebook' },
    linkedin:  { color: '#0A66C2', label: 'LinkedIn' },
  };

  const posts = [
    { id:1, platform:'instagram', date:'May 22', status:'approved',  caption:'New client spotlight: Bloom Wellness launched their spring collection with incredible results — over 2,000 new followers in the first week.' },
    { id:2, platform:'facebook',  date:'May 19', status:'scheduled', caption:'Join us this weekend for our free marketing workshop. Learn the exact strategies we use to grow local businesses.' },
    { id:3, platform:'linkedin',  date:'May 15', status:'published', caption:'Q1 results: 12 local businesses increased their social engagement by an average of 340%.' },
    { id:4, platform:'instagram', date:'Apr 28', status:'published', caption:'Behind the scenes at the Bloom Wellness photo shoot. Great content starts with great visuals.' },
    { id:5, platform:'facebook',  date:'Apr 20', status:'published', caption:"April is here and so are fresh new ideas for your business. Let's talk strategy." },
    { id:6, platform:'linkedin',  date:'Apr 12', status:'published', caption:"Consistency beats virality every time. Here's what 6 months of steady posting does for your brand." },
    { id:7, platform:'instagram', date:'Mar 30', status:'published', caption:'Spring is the perfect time to refresh your brand. We helped Glow Studio redesign their entire feed.' },
    { id:8, platform:'facebook',  date:'Mar 18', status:'published', caption:'Celebrating 3 years of Done For You Marketing. Thank you to all our incredible clients.' },
  ];

  const months = [
    { label: 'May 2026', posts: posts.filter(p => p.date.startsWith('May')) },
    { label: 'April 2026', posts: posts.filter(p => p.date.startsWith('Apr')) },
    { label: 'March 2026', posts: posts.filter(p => p.date.startsWith('Mar')) },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    approved:  { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Approved' },
    scheduled: { bg: 'rgba(235,200,100,0.2)', color: '#7D5000', label: 'Scheduled' },
    published: { bg: 'rgba(45,107,79,0.12)', color: '#2D6B4F', label: 'Published' },
    pending:   { bg: 'rgba(31,61,44,0.08)',  color: '#6B756B', label: 'Pending' },
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
        <div key={month.label} style={{ marginBottom: 28 }}>
          {/* Month header row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8
          }}>
            <span style={{ fontSize: 14, fontFamily: 'Georgia, serif', color: '#1F3D2C', whiteSpace: 'nowrap' }}>
              {month.label}
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(31,61,44,0.1)' }} />
            <span style={{ fontSize: 11, color: '#9AA199', whiteSpace: 'nowrap' }}>{month.posts.length} posts</span>
          </div>

          {/* Compact list */}
          <div style={{
            background: '#fff', borderRadius: 14,
            border: '1.5px solid rgba(31,61,44,0.08)',
            overflow: 'hidden'
          }}>
            {month.posts.map((post, idx) => {
              const p = platforms[post.platform];
              const s = statusStyle[post.status] || statusStyle.pending;
              return (
                <div key={post.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: idx < month.posts.length - 1 ? '1px solid rgba(31,61,44,0.06)' : 'none',
                }}>
                  {/* Platform bar */}
                  <div style={{ width: 3, height: 36, borderRadius: 2, background: p.color, flexShrink: 0 }} />

                  {/* Platform + date */}
                  <div style={{ width: 96, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1F3D2C' }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: '#9AA199', marginTop: 1 }}>{post.date}</div>
                  </div>

                  {/* Caption */}
                  <div style={{
                    flex: 1, fontSize: 12, color: '#1F3D2C', lineHeight: 1.4,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    minWidth: 0
                  }}>
                    {post.caption}
                  </div>

                  {/* Status pill */}
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: s.bg, color: s.color, whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
