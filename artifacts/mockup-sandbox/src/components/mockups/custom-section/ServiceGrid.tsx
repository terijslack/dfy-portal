import React, { useState, useRef } from 'react';

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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleShowForm = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div style={{ backgroundColor: COLORS.cream, fontFamily: '"Inter", sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap');
        .sg-heading { font-family: 'Fraunces', serif; }
        .sg-row { transition: color 0.2s; cursor: default; }
        .sg-row:hover .sg-title { color: ${COLORS.green}; }
        .sg-btn-rust { transition: opacity 0.2s, transform 0.15s; }
        .sg-btn-rust:hover { opacity: 0.88; transform: scale(1.03); }
        .sg-input { border: 1px solid #d4cfc5; border-radius: 8px; padding: 12px 16px; width: 100%; font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .sg-input:focus { border-color: #2D6B4F; }
      ` }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 72px' }}>

        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ color: COLORS.rust, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Beyond the Packages</p>
          <h2 className="sg-heading" style={{ fontSize: 52, fontWeight: 500, color: COLORS.forest, margin: '0 0 20px' }}>Custom Services</h2>
          <p style={{ fontSize: 18, color: COLORS.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Need something built just for your brand? We offer bespoke solutions alongside our core plans.
          </p>
        </div>

        <div style={{ borderTop: `1.5px solid ${COLORS.tan}` }}>
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="sg-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                alignItems: 'start',
                gap: '0 48px',
                padding: '32px 0',
                borderBottom: `1.5px solid ${COLORS.tan}`,
              }}
            >
              <h3
                className="sg-heading sg-title"
                style={{ fontSize: 22, fontWeight: 600, color: COLORS.forest, margin: 0, lineHeight: 1.3, transition: 'color 0.2s' }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 15, color: COLORS.slate, margin: 0, lineHeight: 1.7 }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, textAlign: 'center' }}>
          {!isFormVisible && (
            <button
              onClick={handleShowForm}
              className="sg-btn-rust"
              style={{ backgroundColor: COLORS.rust, color: '#fff', border: 'none', padding: '16px 40px', borderRadius: 999, fontSize: 16, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              Request Custom Services <span style={{ fontSize: 18 }}>→</span>
            </button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div ref={formRef} style={{ backgroundColor: COLORS.forest, padding: '80px 24px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 24px 48px -12px rgba(31,61,44,0.28)' }}>
            <h3 className="sg-heading" style={{ fontSize: 28, color: COLORS.forest, marginBottom: 8 }}>Project Request</h3>
            <p style={{ color: COLORS.slate, marginBottom: 36, fontSize: 15 }}>Fill out the details below and we'll get back to you within 24 hours.</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: COLORS.forest, marginBottom: 6 }}>Name</label>
                  <input className="sg-input" type="text" placeholder="Jane Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: COLORS.forest, marginBottom: 6 }}>Business Name</label>
                  <input className="sg-input" type="text" placeholder="Jane's Bakery" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: COLORS.forest, marginBottom: 6 }}>Email</label>
                <input className="sg-input" type="email" placeholder="jane@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: COLORS.forest, marginBottom: 6 }}>Tell us what you need</label>
                <textarea className="sg-input" rows={4} placeholder="I'd love to build a landing page for an upcoming product launch..." style={{ resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 8 }}>
                <button type="submit" style={{ backgroundColor: COLORS.green, color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                  Send Request
                </button>
                <span style={{ color: COLORS.slate, fontSize: 14 }}>or</span>
                <button type="button" style={{ background: 'none', border: 'none', color: COLORS.rust, fontSize: 15, fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}>
                  Book a Call →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
