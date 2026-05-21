import './nav-variants.css';

const posts = [
  { platform: 'Instagram', icon: '📸', caption: 'Spring is here and so is our new collection! Stop by the studio this weekend for a first look at what we\'ve been working on.', status: 'pending', date: 'May 24' },
  { platform: 'Facebook', icon: '👥', caption: 'We\'re thrilled to announce our partnership with three incredible local farms. Every ingredient you taste has a story.', status: 'pending', date: 'May 26' },
];

export function NavV2HeaderTiles() {
  return (
    <div className="nav-portal-shell">
      {/* Header */}
      <header className="nav-header">
        <div className="nav-brand"><span className="nav-brand-serif">Done For You</span><span className="nav-brand-sans">Marketing</span></div>
        <div className="nav-header-right"><span className="nav-welcome">Jane Smith</span><button className="nav-logout">Sign out</button></div>
      </header>

      <div className="nav-layout">
        {/* Sidebar */}
        <aside className="nav-sidebar">
          <div className="nav-sidebar-inner">
            <div className="nav-sidebar-top">
              <p className="nav-sidebar-label">Welcome back</p>
              <p className="nav-sidebar-name">Jane Smith</p>
            </div>
            <nav>
              <div className="nav-item nav-item-active">
                <span className="nav-item-icon">◎</span> Your Social Media
              </div>
              <div className="nav-item">
                <span className="nav-item-icon" style={{fontWeight:300,fontFamily:'Inter,sans-serif',fontSize:'13px'}}>G</span> Google Business Profile
              </div>
              <div className="nav-item">
                <span className="nav-item-icon">▦</span> Performance Analytics
              </div>
              <div className="nav-item">
                <span className="nav-item-icon">◉</span> Your Account
              </div>
              <div className="nav-item">
                <span className="nav-item-icon">✉</span> Contact Us
              </div>
            </nav>
          </div>
        </aside>

        <main className="nav-main">
          <div className="nav-main-body">

            {/* THREE SECTION TILES at the top */}
            <div className="nav-section-tiles">
              <div className="nav-tile nav-tile-active">
                <div className="nav-tile-icon">✅</div>
                <div className="nav-tile-name">Post Approval</div>
                <div className="nav-tile-badge">2 to review</div>
              </div>
              <div className="nav-tile">
                <div className="nav-tile-icon">📅</div>
                <div className="nav-tile-name">Content Calendar</div>
                <div className="nav-tile-hint">View schedule →</div>
              </div>
              <div className="nav-tile">
                <div className="nav-tile-icon">📱</div>
                <div className="nav-tile-name">Your Socials</div>
                <div className="nav-tile-hint">3 connected →</div>
              </div>
            </div>

            {/* Post list below the tiles */}
            <div className="nav-posts-list" style={{marginTop: '24px'}}>
              {posts.map((p, i) => (
                <div key={i} className="nav-post-card">
                  <div className="nav-post-meta">
                    <span className={`nav-platform nav-plat-${p.platform.toLowerCase()}`}>{p.icon} {p.platform}</span>
                    <span className="nav-post-date">📅 {p.date}</span>
                    <span className="nav-badge nav-badge-pending">Needs Review</span>
                  </div>
                  <p className="nav-post-caption">{p.caption}</p>
                  <div className="nav-post-actions">
                    <button className="nav-btn-approve">✓ Approve</button>
                    <button className="nav-btn-changes">✏ Request Changes</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
