import React, { useState } from 'react';

const COLORS = {
  cream: '#F5F2EA',
  green: '#2D6B4F',
  forest: '#1F3D2C',
  rust: '#7D2A03',
  tan: '#EBC99B',
  slate: '#6B756B',
  white: '#fff',
};

const SERVICES = [
  { title: 'Film & Video Content Capture', desc: 'Professional on-location shoots for short-form reels, brand videos, and social content.' },
  { title: 'Build a Website', desc: 'A fully custom, responsive site built around your brand and goals.' },
  { title: 'Refresh Your Website', desc: 'Modernize your existing site with updated design, copy, and structure.' },
  { title: 'A La Carte Services', desc: 'One-off tasks — graphics, copy, campaigns — priced by scope.' },
  { title: 'Create a Custom Package', desc: 'Mix and match exactly what you need. We'll price it out together.' },
];

export default function StyleA() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ background: COLORS.cream, fontFamily: '"Inter", sans-serif', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .sa-heading { font-family: 'Fraunces', serif; }
        .sa-card { background: #fff; border: 1.5px solid rgba(235,201,155,0.5); border-radius: 16px; padding: 28px 24px; transition: box-shadow 0.2s, transform 0.2s; }
        .sa-card:hover { box-shadow: 0 12px 28px -8px rgba(31,61,44,0.14); transform: translateY(-3px); }
        .sa-input { width: 100%; border: 1.5px solid #d9d3c7; border-radius: 8px; padding: 11px 14px; font-size: 14px; font-family: inherit; outline: none; background: #fff; box-sizing: border-box; transition: border-color 0.2s; }
        .sa-input:focus { border-color: #2D6B4F; }
        .sa-btn { background: #7D2A03; color: #fff; border: none; padding: 14px 36px; border-radius: 999px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .sa-btn:hover { opacity: 0.87; }
      ` }} />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ color: COLORS.rust, fontSize: 12, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 10 }}>Custom & À La Carte</p>
          <h2 className="sa-heading" style={{ fontSize: 44, fontWeight: 500, color: COLORS.forest, margin: '0 0 14px' }}>Not everything fits a package.</h2>
          <p style={{ fontSize: 16, color: COLORS.slate, maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>Tell us what you need and we'll put together a quote — no pressure.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 64 }}>
          {SERVICES.map((s, i) => (
            <div key={i} className="sa-card" style={i === 4 ? { gridColumn: 'span 1' } : {}}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: COLORS.tan + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: COLORS.green, fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 600 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="sa-heading" style={{ fontSize: 17, fontWeight: 600, color: COLORS.forest, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: COLORS.slate, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.forest, borderRadius: 20, padding: '48px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h3 className="sa-heading" style={{ fontSize: 30, fontWeight: 500, color: '#fff', marginBottom: 12, lineHeight: 1.25 }}>Request a custom quote</h3>
              <p style={{ color: 'rgba(245,242,234,0.7)', fontSize: 15, lineHeight: 1.65, margin: 0 }}>We'll reach out within 24 hours to discuss your project and build the right plan for you.</p>
            </div>
            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input className="sa-input" placeholder="Your name" required />
                  <input className="sa-input" placeholder="Business name" />
                </div>
                <input className="sa-input" type="email" placeholder="Email address" required />
                <textarea className="sa-input" rows={3} placeholder="What are you looking for? (film shoot, website build, etc.)" style={{ resize: 'none' }} />
                <div>
                  <button type="submit" className="sa-btn">Send My Request</button>
                </div>
              </form>
            ) : (
              <div style={{ background: 'rgba(245,242,234,0.1)', borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ color: COLORS.tan, fontSize: 28, marginBottom: 8 }}>✓</p>
                <p style={{ color: '#fff', fontSize: 17, fontWeight: 500, marginBottom: 6 }}>Request received!</p>
                <p style={{ color: 'rgba(245,242,234,0.65)', fontSize: 14 }}>We'll be in touch within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
