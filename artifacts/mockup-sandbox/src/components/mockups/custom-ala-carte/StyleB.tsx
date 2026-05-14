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
  'Film & Video Content Capture',
  'Build a Website',
  'Refresh Your Website',
  'A La Carte Services',
  'Create a Custom Package',
];

export default function StyleB() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (s: string) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div style={{ background: COLORS.cream, fontFamily: '"Inter", sans-serif', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .sb-heading { font-family: 'Fraunces', serif; }
        .sb-row { display: flex; align-items: center; gap: 20px; padding: 22px 0; border-bottom: 1.5px solid rgba(235,201,155,0.6); cursor: pointer; transition: background 0.15s; }
        .sb-row:hover .sb-title { color: #2D6B4F; }
        .sb-check { width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid #EBC99B; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, border-color 0.15s; }
        .sb-check.active { background: #2D6B4F; border-color: #2D6B4F; }
        .sb-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; color: #1F3D2C; transition: color 0.15s; }
        .sb-input { width: 100%; border: 1.5px solid #d9d3c7; border-radius: 8px; padding: 10px 13px; font-size: 14px; font-family: inherit; outline: none; box-sizing: border-box; background: #fff; transition: border-color 0.2s; }
        .sb-input:focus { border-color: #2D6B4F; }
        .sb-btn { width: 100%; background: #7D2A03; color: #fff; border: none; padding: 13px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
        .sb-btn:hover { opacity: 0.87; }
      ` }} />

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ color: COLORS.rust, fontSize: 12, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 10 }}>Custom & À La Carte</p>
          <h2 className="sb-heading" style={{ fontSize: 48, fontWeight: 500, color: COLORS.forest, margin: '0 0 12px', lineHeight: 1.1 }}>Pick what you need.</h2>
          <p style={{ fontSize: 15, color: COLORS.slate }}>Select any services below, then tell us about your project.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ borderTop: '1.5px solid rgba(235,201,155,0.6)' }}>
              {SERVICES.map((s, i) => {
                const active = selected.includes(s);
                return (
                  <div key={i} className="sb-row" onClick={() => toggle(s)}>
                    <div className={'sb-check' + (active ? ' active' : '')}>
                      {active && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="sb-title">{s}</span>
                    <span style={{ marginLeft: 'auto', color: COLORS.rust, fontSize: 18, opacity: active ? 1 : 0, transition: 'opacity 0.15s' }}>✓</span>
                  </div>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selected.map(s => (
                  <span key={s} style={{ background: COLORS.green + '18', border: `1px solid ${COLORS.green}44`, color: COLORS.green, borderRadius: 999, padding: '4px 14px', fontSize: 13, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid rgba(235,201,155,0.5)', padding: '32px 28px', position: 'sticky', top: 24 }}>
            <h3 className="sb-heading" style={{ fontSize: 22, fontWeight: 600, color: COLORS.forest, marginBottom: 6 }}>Get a quote</h3>
            <p style={{ fontSize: 13, color: COLORS.slate, marginBottom: 24, lineHeight: 1.5 }}>We'll respond within 24 hours with a custom proposal.</p>
            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="sb-input" placeholder="Your name" required />
                <input className="sb-input" placeholder="Business name" />
                <input className="sb-input" type="email" placeholder="Email address" required />
                <textarea className="sb-input" rows={3} placeholder="Tell us more about what you need..." style={{ resize: 'none' }} />
                <button type="submit" className="sb-btn" style={{ marginTop: 4 }}>Request Quote →</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🌿</div>
                <p style={{ fontWeight: 600, color: COLORS.forest, marginBottom: 6 }}>You're all set!</p>
                <p style={{ fontSize: 13, color: COLORS.slate, lineHeight: 1.5 }}>We'll reach out within 24 hours to talk through your project.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
