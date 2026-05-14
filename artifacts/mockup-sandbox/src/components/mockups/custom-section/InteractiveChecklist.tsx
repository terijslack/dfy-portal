import React, { useState, useRef } from 'react';

const SERVICES = [
  'Website Refresh or Update',
  'Build a Website',
  'Landing Page or Lead Capture',
  'Add Platforms or Posts to Package',
  'Customize Email Campaigns',
  'A La Carte Services',
];

export default function InteractiveChecklist() {
  const [selected, setSelected] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const toggle = (s: string) => {
    setSelected((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const handleRequest = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  };

  const defaultMsg = selected.length > 0
    ? 'I am interested in:\n' + selected.map((s) => '- ' + s).join('\n') + '\n\nPlease let me know the next steps.'
    : '';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(107,117,107,0.25)',
    borderRadius: 10,
    fontSize: 15,
    fontFamily: '"Inter", sans-serif',
    backgroundColor: 'rgba(245,242,234,0.5)',
    outline: 'none',
    color: '#1F3D2C',
    boxSizing: 'border-box',
  };

  return (
    <section style={{ backgroundColor: '#F5F2EA', fontFamily: '"Inter", sans-serif', color: '#1F3D2C', padding: '80px 24px', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        .ic-serif { font-family: 'Playfair Display', serif; }
        .ic-row { transition: all 0.2s ease; cursor: pointer; border: 2px solid transparent; }
        .ic-row:hover { transform: translateY(-2px); }
        .ic-row-on { border-color: #2D6B4F !important; background: #fff !important; box-shadow: 0 8px 24px -8px rgba(45,107,79,0.18); }
        .ic-row-off { background: rgba(255,255,255,0.55); }
        .ic-row-off:hover { background: #fff; border-color: rgba(235,201,155,0.5) !important; }
        .ic-btn-active { transition: background 0.2s, transform 0.15s; }
        .ic-btn-active:hover { background: #1F3D2C !important; transform: scale(1.02); }
      ` }} />

      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7D2A03', marginBottom: 12 }}>Build Your Custom Package</p>
          <h2 className="ic-serif" style={{ fontSize: 46, margin: '0 0 16px' }}>What do you need?</h2>
          <p style={{ fontSize: 17, color: '#6B756B', maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Select the services that fit your goals. We'll put together a bespoke proposal just for you.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SERVICES.map((s, i) => {
              const on = selected.includes(s);
              return (
                <button
                  key={i}
                  onClick={() => toggle(s)}
                  className={'ic-row ' + (on ? 'ic-row-on' : 'ic-row-off')}
                  style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', borderRadius: 16, textAlign: 'left', border: on ? '2px solid #2D6B4F' : '2px solid transparent', background: on ? '#fff' : 'rgba(255,255,255,0.55)' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid', borderColor: on ? '#2D6B4F' : '#d0cfc7', backgroundColor: on ? '#2D6B4F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20, flexShrink: 0, transition: 'all 0.2s', color: '#fff', fontSize: 16, fontWeight: 700 }}>
                    {on ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 500, color: on ? '#1F3D2C' : '#6B756B', transition: 'color 0.2s' }}>{s}</span>
                </button>
              );
            })}
          </div>

          <div style={{ width: 320, flexShrink: 0, position: 'sticky', top: 24 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', boxShadow: '0 12px 32px -8px rgba(31,61,44,0.12)', border: '1px solid rgba(235,201,155,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: '#2D6B4F' }} />
              <h3 className="ic-serif" style={{ fontSize: 22, marginBottom: 20 }}>Your Selections</h3>

              {selected.length === 0 ? (
                <p style={{ color: '#6B756B', fontStyle: 'italic', fontSize: 14, marginBottom: 28, minHeight: 80 }}>Select services above to get started.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', minHeight: 80 }}>
                  {selected.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#1F3D2C', marginBottom: 8 }}>
                      <span style={{ color: '#2D6B4F', fontWeight: 700, marginTop: 1 }}>✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ borderTop: '1px solid rgba(235,201,155,0.35)', paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B756B' }}>Selected</span>
                  <span className="ic-serif" style={{ fontSize: 28, color: '#2D6B4F' }}>{selected.length}</span>
                </div>
                <button
                  onClick={handleRequest}
                  disabled={selected.length === 0}
                  className={selected.length > 0 ? 'ic-btn-active' : ''}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: 999, border: 'none', fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 600, cursor: selected.length > 0 ? 'pointer' : 'not-allowed', backgroundColor: selected.length > 0 ? '#2D6B4F' : 'rgba(107,117,107,0.12)', color: selected.length > 0 ? '#fff' : '#6B756B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                >
                  Request Custom Services <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div ref={formRef} style={{ marginTop: 80, paddingTop: 72, borderTop: '1px solid rgba(235,201,155,0.4)' }}>
            <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', borderRadius: 24, padding: '48px 40px', boxShadow: '0 24px 48px -12px rgba(31,61,44,0.12)' }}>
              <h3 className="ic-serif" style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>Let's Make It Happen</h3>
              <p style={{ color: '#6B756B', textAlign: 'center', fontSize: 15, marginBottom: 36 }}>Tell us about yourself and we'll get back to you with a tailored plan.</p>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F3D2C', marginBottom: 6 }}>Full Name</label>
                    <input style={inputStyle} type="text" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F3D2C', marginBottom: 6 }}>Business Name</label>
                    <input style={inputStyle} type="text" placeholder="Acme Co." />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F3D2C', marginBottom: 6 }}>Email Address</label>
                  <input style={inputStyle} type="email" placeholder="jane@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F3D2C', marginBottom: 6 }}>Tell us what you need</label>
                  <textarea style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }} defaultValue={defaultMsg} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingTop: 8 }}>
                  <button type="submit" style={{ backgroundColor: '#7D2A03', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: '"Inter", sans-serif' }}>
                    Send Request
                  </button>
                  <span style={{ color: '#6B756B', fontSize: 14 }}>or</span>
                  <a href="#" style={{ color: '#2D6B4F', fontSize: 15, fontWeight: 500, textDecoration: 'underline' }}>Book a Call →</a>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
