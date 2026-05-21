import './nav-variants.css';

const posts = [
  { platform: 'Instagram', icon: '📸', caption: 'Spring is here and so is our new collection! Stop by the studio this weekend for a first look at what we\'ve been working on.', status: 'pending', date: 'May 24' },
  { platform: 'Facebook', icon: '👥', caption: 'We\'re thrilled to announce our partnership with three incredible local farms. Every ingredient you taste has a story.', status: 'pending', date: 'May 26' },
  { platform: 'LinkedIn', icon: '💼', caption: 'Hiring alert! We\'re growing our team and looking for passionate people who believe in what we do.', status: 'approved', date: 'May 22' },
];

export function NavV1RightRail() {
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

        {/* Main */}
        <main className="nav-main">
          <div className="nav-main-body nav-main-body-cols">

            {/* Left: post list */}
            <div className="nav-posts-col">
              <h1 className="nav-page-title">Post Approval</h1>
              <p className="nav-page-sub">Review each post and approve or request changes.</p>

              <div className="nav-posts-list">
                {posts.filter(p => p.status === 'pending').map((p, i) => (
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

            {/* RIGHT RAIL — 3 nav cards */}
            <aside className="nav-right-rail">
              <p className="nav-rail-label">Social Media</p>
              <div className="nav-rail-cards">
                <div className="nav-rail-card nav-rail-card-active">
                  <div className="nav-rail-card-icon">✅</div>
                  <div>
                    <div className="nav-rail-card-title">Post Approval</div>
                    <div className="nav-rail-card-sub">2 awaiting review</div>
                  </div>
                </div>
                <div className="nav-rail-card">
                  <div className="nav-rail-card-icon">📅</div>
                  <div>
                    <div className="nav-rail-card-title">Content Calendar</div>
                    <div className="nav-rail-card-sub">See upcoming posts</div>
                  </div>
                </div>
                <div className="nav-rail-card">
                  <div className="nav-rail-card-icon">📱</div>
                  <div>
                    <div className="nav-rail-card-title">Your Socials</div>
                    <div className="nav-rail-card-sub">Connected accounts</div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}
