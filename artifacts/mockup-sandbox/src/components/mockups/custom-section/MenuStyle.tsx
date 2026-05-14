import React, { useState } from 'react';

const SERVICES = [
  { name: 'Website Refresh or Update', tagline: 'Breathe new life into your existing digital presence.' },
  { name: 'Build a Website', tagline: 'From scratch, tailored specifically to your brand identity.' },
  { name: 'Landing Page or Lead Capture', tagline: 'High-converting single pages designed for your next campaign.' },
  { name: 'Add Platforms or Posts to Package', tagline: 'Expand your reach with additional social channels and content.' },
  { name: 'Customize Email Campaigns', tagline: 'Bespoke newsletter templates and automated sequences.' },
  { name: 'A La Carte Services', tagline: 'Specific, one-off deliverables for your unique requirements.' },
];

export default function MenuStyle() {
  const [showForm, setShowForm] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(245,242,234,0.25)',
    color: '#F5F2EA',
    fontFamily: '"Inter", sans-serif',
    fontSize: 16,
    padding: '12px 0',
    width: '100%',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#EBC99B',
    marginBottom: 6,
  };

  return (
    <section style={{ backgroundColor: '#1F3D2C', color: '#F5F2EA', fontFamily: '"Inter", sans-serif', minHeight: '100vh', padding: '80px 24px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600&display=swap');
        .ms-serif { font-family: 'Fraunces', serif; }
        .ms-row { border-bottom: 1px solid rgba(245,242,234,0.15); transition: border-color 0.25s; }
        .ms-row:hover { border-color: rgba(235,201,155,0.45); }
        .ms-ghost-btn { background: transparent; border: 1px solid rgba(245,242,234,0.6); color: #F5F2EA; font-family: "Inter", sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; padding: 18px 48px; cursor: pointer; transition: background 0.35s, color 0.35s; }
        .ms-ghost-btn:hover { background: #F5F2EA; color: #1F3D2C; }
      ` }} />

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#EBC99B', marginBottom: 16 }}>Beyond the Packages</p>
          <h1 className="ms-serif" style={{ fontSize: 64, fontWeight: 300, margin: '0 0 20px', lineHeight: 1.1 }}>Custom Services</h1>
          <p style={{ fontSize: 18, opacity: 0.75, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            Bespoke solutions and one-off projects, crafted with the same care as our core offerings.
          </p>
        </div>

        <div style={{ marginBottom: 64 }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="ms-row" style={{ padding: '32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24 }}>
              <div>
                <h3 className="ms-serif" style={{ fontSize: 32, fontWeight: 300, margin: '0 0 6px' }}>{s.name}</h3>
                <p style={{ fontSize: 16, fontStyle: 'italic', opacity: 0.65, margin: 0 }}>{s.tagline}</p>
              </div>
              <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EBC99B', whiteSpace: 'nowrap', flexShrink: 0 }}>Custom Quote</span>
            </div>
          ))}
        </div>

        {!showForm ? (
          <div style={{ textAlign: 'center', paddingBottom: 80 }}>
            <button onClick={() => setShowForm(true)} className="ms-ghost-btn">
              Request Custom Services
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,234,0.12)', padding: '56px 48px', marginBottom: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h3 className="ms-serif" style={{ fontSize: 40, fontWeight: 300, margin: '0 0 12px' }}>Tell us what you need</h3>
              <p style={{ color: '#EBC99B', fontStyle: 'italic', fontSize: 16, opacity: 0.9 }}>We'll get back to you with a custom quote within 48 hours.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 600, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle} type="text" placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Business</label>
                  <input style={inputStyle} type="text" placeholder="Company name" />
                </div>
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="hello@example.com" />
              </div>
              <div style={{ marginBottom: 48 }}>
                <label style={labelStyle}>Tell us what you need</label>
                <textarea style={{ ...inputStyle, borderBottom: 'none', border: '1px solid rgba(245,242,234,0.2)', padding: 16, minHeight: 130, resize: 'none', borderRadius: 4 }} placeholder="Describe your project, timeline, and goals..." />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
                <button type="submit" style={{ backgroundColor: '#EBC99B', color: '#1F3D2C', border: 'none', padding: '18px 56px', fontFamily: '"Inter", sans-serif', fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', width: '100%' }}>
                  Send Request
                </button>
                <a href="#" style={{ color: '#F5F2EA', fontSize: 17, fontStyle: 'italic', textDecoration: 'none' }} className="ms-serif">
                  or Book a Call →
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
