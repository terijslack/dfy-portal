import React, { useState } from 'react';

const COLORS = {
  cream: '#F5F2EA',
  green: '#2D6B4F',
  forest: '#1F3D2C',
  rust: '#7D2A03',
  tan: '#EBC99B',
  slate: '#6B756B',
};

const SERVICES = [
  { title: 'Film & Video Content Capture', tag: 'One-time or recurring' },
  { title: 'Build a Website', tag: 'One-time project' },
  { title: 'Refresh Your Website', tag: 'One-time project' },
  { title: 'A La Carte Services', tag: 'By scope' },
  { title: 'Create a Custom Package', tag: 'Ongoing retainer' },
];

export default function StyleC() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: COLORS.cream, fontFamily: '"Inter", sans-serif', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300&family=Inter:wght@400;500;600&display=swap');
        .sc-heading { font-family: 'Fraunces', serif; }
        .sc-service-row { display: flex; align-items: baseline; justify-content: space-between; padding: 28px 0; border-bottom: 1px solid rgba(107,117,107,0.2); gap: 16px; }
        .sc-service-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 300; color: #1F3D2C; letter-spacing: -0.01em; }
        .sc-tag { font-size: 12px; color: #6B756B; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
        .sc-input { width: 100%; border: none; border-bottom: 1.5px solid #d9d3c7; padding: 10px 0; font-size: 15px; font-family: inherit; outline: none; background: transparent; color: #1F3D2C; transition: border-color 0.2s; box-sizing: border-box; }
        .sc-input:focus { border-color: #2D6B4F; }
        .sc-input::placeholder { color: #9AA199; }
        .sc-btn { background: #1F3D2C; color: #F5F2EA; border: none; padding: 15px 40px; border-radius: 999px; font-size: 15px; font-weight: 500; cursor: pointer; letter-spacing: 0.02em; transition: background 0.2s; }
        .sc-btn:hover { background: #2D6B4F; }
        .sc-open-btn { background: transparent; border: 1.5px solid #1F3D2C; color: #1F3D2C; padding: 14px 36px; border-radius: 999px; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .sc-open-btn:hover { background: #1F3D2C; color: #F5F2EA; }
      ` }} />

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '80px 24px 100px' }}>

        <div style={{ marginBottom: 60 }}>
          <p style={{ color: COLORS.rust, fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Custom & À La Carte</p>
          <h2 className="sc-heading" style={{ fontSize: 52, fontWeight: 300, color: COLORS.forest, margin: 0, lineHeight: 1.1, fontStyle: 'italic' }}>
            Beyond the plan.
          </h2>
          <h2 className="sc-heading" style={{ fontSize: 52, fontWeight: 400, color: COLORS.forest, margin: '4px 0 0', lineHeight: 1.1 }}>
            Built for you.
          </h2>
        </div>

        <div style={{ borderTop: '1px solid rgba(107,117,107,0.2)', marginBottom: 64 }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="sc-service-row">
              <span className="sc-service-title">{s.title}</span>
              <span className="sc-tag">{s.tag}</span>
            </div>
          ))}
        </div>

        {!open ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: COLORS.slate, marginBottom: 28, lineHeight: 1.65 }}>
              Every project is different. Let's talk about yours.
            </p>
            <button className="sc-open-btn" onClick={() => setOpen(true)}>
              Request a Custom Quote
            </button>
          </div>
        ) : !submitted ? (
          <div>
            <div style={{ width: 40, height: 1.5, background: COLORS.rust, marginBottom: 32 }} />
            <h3 className="sc-heading" style={{ fontSize: 28, fontWeight: 400, color: COLORS.forest, marginBottom: 36 }}>Tell us about your project.</h3>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.slate, marginBottom: 8 }}>Name</label>
                  <input className="sc-input" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.slate, marginBottom: 8 }}>Business</label>
                  <input className="sc-input" placeholder="Jane's Studio" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.slate, marginBottom: 8 }}>Email</label>
                <input className="sc-input" type="email" placeholder="jane@example.com" required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.slate, marginBottom: 8 }}>What do you need?</label>
                <input className="sc-input" placeholder="e.g. Video shoot + website refresh" />
              </div>
              <div style={{ paddingTop: 8 }}>
                <button type="submit" className="sc-btn">Submit Request</button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(107,117,107,0.2)', paddingTop: 48 }}>
            <p style={{ color: COLORS.rust, fontSize: 12, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 12 }}>Received</p>
            <h3 className="sc-heading" style={{ fontSize: 32, fontWeight: 400, color: COLORS.forest, marginBottom: 12 }}>We'll be in touch soon.</h3>
            <p style={{ fontSize: 15, color: COLORS.slate, lineHeight: 1.65 }}>Expect a reply within 24 hours. We'll review your project and reach out to talk through the details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
