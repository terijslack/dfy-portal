import './nav-variants.css';

const IcShare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IcCalendar = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcCheckCircle = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcSmartphone = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const IcBarChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IcUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IcMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcCamera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IcUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const posts = [
  { platform: 'Instagram', PlatIc: IcCamera, caption: 'Spring is here and so is our new collection! Stop by the studio this weekend for a first look at what we\'ve been working on.', status: 'pending', date: 'May 24' },
  { platform: 'Facebook', PlatIc: IcUsers, caption: 'We\'re thrilled to announce our partnership with three incredible local farms. Every ingredient you taste has a story.', status: 'pending', date: 'May 26' },
];

export function NavCombined() {
  return (
    <div className="nav-portal-shell">
      <header className="nav-header">
        <div className="nav-brand">
          <span className="nav-brand-serif">Done For You</span>
          <span className="nav-brand-sans">Marketing</span>
        </div>
        <div className="nav-header-right">
          <span className="nav-welcome">Jane Smith</span>
          <button className="nav-logout">Sign out</button>
        </div>
      </header>

      <div className="nav-layout">

        {/* Sidebar — nested sub-items */}
        <aside className="nav-sidebar">
          <div className="nav-sidebar-inner">
            <div className="nav-sidebar-top">
              <p className="nav-sidebar-label">Welcome back</p>
              <p className="nav-sidebar-name">Jane Smith</p>
            </div>
            <nav>
              <div className="nav-item nav-item-parent-active">
                <span className="nav-item-icon"><IcShare /></span>
                Your Social Media
                <span className="nav-item-chevron">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,4 6,8 10,4"/></svg>
                </span>
              </div>
              <div className="nav-subitem nav-subitem-active">
                <span className="nav-subitem-line-icon"><IcCheckCircle size={12} /></span>
                Post Approval
                <span className="nav-subitem-badge">2</span>
              </div>
              <div className="nav-subitem">
                <span className="nav-subitem-line-icon"><IcCalendar size={12} /></span>
                Content Calendar
              </div>
              <div className="nav-subitem">
                <span className="nav-subitem-line-icon"><IcSmartphone size={12} /></span>
                Your Socials
              </div>

              <div className="nav-item" style={{marginTop:'4px'}}>
                <span className="nav-item-icon" style={{fontFamily:'Inter,sans-serif',fontSize:'13px',fontWeight:300,display:'flex',alignItems:'center',justifyContent:'center'}}>G</span>
                Google Business Profile
              </div>
              <div className="nav-item">
                <span className="nav-item-icon"><IcBarChart /></span>
                Performance Analytics
              </div>
              <div className="nav-item">
                <span className="nav-item-icon"><IcUser /></span>
                Your Account
              </div>
              <div className="nav-item">
                <span className="nav-item-icon"><IcMail /></span>
                Contact Us
              </div>
            </nav>
          </div>
        </aside>

        <main className="nav-main">
          <div className="nav-main-body nav-main-body-cols">

            {/* Post list */}
            <div className="nav-posts-col">
              <h1 className="nav-page-title">Post Approval</h1>
              <p className="nav-page-sub">Review each post and approve or request changes.</p>

              <div className="nav-posts-list">
                {posts.map((p, i) => (
                  <div key={i} className="nav-post-card">
                    <div className="nav-post-meta">
                      <span className={`nav-platform nav-plat-${p.platform.toLowerCase()}`}>
                        <p.PlatIc /> {p.platform}
                      </span>
                      <span className="nav-post-date">
                        <IcCalendar size={11} /> {p.date}
                      </span>
                      <span className="nav-badge nav-badge-pending">Needs Review</span>
                    </div>
                    <p className="nav-post-caption">{p.caption}</p>
                    <div className="nav-post-actions">
                      <button className="nav-btn-approve">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Approve
                      </button>
                      <button className="nav-btn-changes">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Request Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right rail nav cards */}
            <aside className="nav-right-rail">
              <p className="nav-rail-label">Social Media</p>
              <div className="nav-rail-cards">
                <div className="nav-rail-card nav-rail-card-active">
                  <span className="nav-rail-card-icon"><IcCheckCircle size={18} /></span>
                  <div>
                    <div className="nav-rail-card-title">Post Approval</div>
                    <div className="nav-rail-card-sub">2 awaiting review</div>
                  </div>
                </div>
                <div className="nav-rail-card">
                  <span className="nav-rail-card-icon"><IcCalendar size={18} /></span>
                  <div>
                    <div className="nav-rail-card-title">Content Calendar</div>
                    <div className="nav-rail-card-sub">See upcoming posts</div>
                  </div>
                </div>
                <div className="nav-rail-card">
                  <span className="nav-rail-card-icon"><IcSmartphone size={18} /></span>
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
