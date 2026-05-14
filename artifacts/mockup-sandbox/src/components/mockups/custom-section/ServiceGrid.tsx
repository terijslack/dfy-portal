import React, { useState, useRef } from 'react';

const COLORS = {
  cream: '#F5F2EA',
  green: '#2D6B4F',
  forest: '#1F3D2C',
  rust: '#7D2A03',
  tan: '#EBC99B',
  slate: '#6B756B',
};

const SERVICES = [
  {
    title: 'Website Refresh or Update',
    description: 'Breathe new life into your existing site with modernized design, improved flow, and updated content.',
    icon: '↺',
  },
  {
    title: 'Build a Website',
    description: 'Start fresh with a fully custom, responsive website tailored to your brand and business goals.',
    icon: '⬡',
  },
  {
    title: 'Landing Page or Lead Capture',
    description: 'High-converting, focused single pages designed specifically to capture leads or drive sales.',
    icon: '◎',
  },
  {
    title: 'Add Platforms or Posts to Package',
    description: 'Expand your reach by adding new social channels or increasing your posting frequency.',
    icon: '+',
  },
  {
    title: 'Customize Email Campaigns',
    description: 'Engaging, beautifully designed email sequences that nurture your audience and drive conversions.',
    icon: '✉',
  },
  {
    title: 'A La Carte Services',
    description: 'Need something specific? We offer flexible, one-off design and marketing tasks on demand.',
    icon: '✦',
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
        .sg-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .sg-card:hover { transform: translateY(-5px); box-shadow: 0 16px 32px -12px rgba(31,61,44,0.18); }
        .sg-btn-rust { transition: opacity 0.2s, transform 0.15s; }
        .sg-btn-rust:hover { opacity: 0.88; transform: scale(1.03); }
        .sg-input { border: 1px solid #d4cfc5; border-radius: 8px; padding: 12px 16px; width: 100%; font-size: 15px; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .sg-input:focus { border-color: #2D6B4F; }
      ` }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ color: COLORS.rust, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Beyond the Packages</p>
          <h2 className="sg-heading" style={{ fontSize: 48, fontWeight: 500, color: COLORS.forest, margin: '0 0 16px' }}>Custom Services</h2>
          <p style={{ fontSize: 18, color: COLORS.slate, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Need something built just for your brand? We offer bespoke solutions alongside our core plans.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 72 }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="sg-card" style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid rgba(235,201,155,0.4)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: COLORS.tan + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 22, color: COLORS.green }}>
                {s.icon}
              </div>
              <h3 className="sg-heading" style={{ fontSize: 18, fontWeight: 600, color: COLORS.forest, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.slate, lineHeight: 1.65 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: COLORS.forest, padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', backgroundColor: COLORS.tan, opacity: 0.07 }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', backgroundColor: COLORS.rust, opacity: 0.07 }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <h2 className="sg-heading" style={{ fontSize: 36, fontWeight: 500, color: '#fff', marginBottom: 16 }}>
            Ready to start a custom project?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 40, lineHeight: 1.6 }}>
            Tell us about your goals and we'll put together a tailored proposal for your brand.
          </p>
          {!isFormVisible && (
            <button onClick={handleShowForm} className="sg-btn-rust" style={{ backgroundColor: COLORS.rust, color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 999, fontSize: 16, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Request Custom Services <span style={{ fontSize: 18 }}>→</span>
            </button>
          )}
        </div>
      </div>

      {isFormVisible && (
        <div ref={formRef} style={{ backgroundColor: COLORS.cream, padding: '72px 24px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 24px 48px -12px rgba(31,61,44,0.14)' }}>
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
