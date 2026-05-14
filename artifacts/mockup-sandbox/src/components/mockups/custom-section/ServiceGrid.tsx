import React from 'react';

const COLORS = {
  cream: '#F5F2EA',
  green: '#2D6B4F',
  forest: '#1F3D2C',
  rust: '#7D2A03',
  tan: '#EBC99B',
  slate: '#6B756B',
};

const IconRefresh = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const IconBuildSite = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const IconLanding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconAddPlatform = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98" />
    <path d="M15.41 6.51l-6.82 3.98" />
  </svg>
);

const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconAlaCarte = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const SERVICES = [
  {
    title: 'Website Refresh or Update',
    description: 'Breathe new life into your existing site with modernized design, improved flow, and updated content.',
    Icon: IconRefresh,
  },
  {
    title: 'Build a Website',
    description: 'Start fresh with a fully custom, responsive website tailored to your brand and business goals.',
    Icon: IconBuildSite,
  },
  {
    title: 'Landing Page or Lead Capture',
    description: 'High-converting, focused single pages designed specifically to capture leads or drive sales.',
    Icon: IconLanding,
  },
  {
    title: 'Add Platforms or Posts to Package',
    description: 'Expand your reach by adding new social channels or increasing your posting frequency.',
    Icon: IconAddPlatform,
  },
  {
    title: 'Customize Email Campaigns',
    description: 'Engaging, beautifully designed email sequences that nurture your audience and drive conversions.',
    Icon: IconEmail,
  },
  {
    title: 'A La Carte Services',
    description: 'Need something specific? We offer flexible, one-off design and marketing tasks on demand.',
    Icon: IconAlaCarte,
  },
];

export default function ServiceGrid() {
  return (
    <div style={{ backgroundColor: COLORS.cream, fontFamily: '"Inter", sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap');
        .sg-heading { font-family: 'Fraunces', serif; }
        .sg-tag:hover { background: ${COLORS.tan}55; }
        .sg-btn-rust { transition: opacity 0.2s, transform 0.15s; }
        .sg-btn-rust:hover { opacity: 0.88; transform: scale(1.03); }
        .sg-input { border: 1px solid #d4cfc5; border-radius: 8px; padding: 12px 16px; width: 100%; font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .sg-input:focus { border-color: #2D6B4F; }
      ` }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 72px' }}>

        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: COLORS.rust, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Beyond the Packages</p>
          <h2 className="sg-heading" style={{ fontSize: 52, fontWeight: 500, color: COLORS.forest, margin: 0 }}>Custom Services</h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 56 }}>
          {SERVICES.map((s, i) => (
            <span
              key={i}
              className="sg-tag"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: 999,
                border: `1.5px solid ${COLORS.tan}`,
                fontSize: 15,
                fontWeight: 500,
                color: COLORS.forest,
                transition: 'background 0.18s',
                cursor: 'default',
              }}
            >
              {s.title}
            </span>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: COLORS.slate, marginBottom: 28, lineHeight: 1.6 }}>
            Not sure what you need? Tell us your goals and we'll build the right plan.
          </p>
          <a
            href="/signup"
            className="sg-btn-rust"
            style={{ backgroundColor: COLORS.rust, color: '#fff', textDecoration: 'none', padding: '18px 44px', borderRadius: 999, fontSize: 17, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            Request Custom Services <span style={{ fontSize: 19 }}>→</span>
          </a>
        </div>
      </div>

    </div>
  );
}
