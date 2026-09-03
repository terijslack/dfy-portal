import { useEffect } from "react";
import "./_group.css";
import "./BenefitLed.css";

function FormEmbed() {
  useEffect(() => {
    const scriptId = "leadconnector-benefit-form-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ height: 708, width: "100%" }}>
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/kzv1Ob1IqTbQ8Wf05eMY"
        style={{ width: "100%", height: "100%", border: "none", borderRadius: 4 }}
        id="inline-kzv1Ob1IqTbQ8Wf05eMY"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Get Your Free Guide - 7 Posts You Can Steal"
        data-height="708"
        data-layout-iframe-id="inline-kzv1Ob1IqTbQ8Wf05eMY"
        data-form-id="kzv1Ob1IqTbQ8Wf05eMY"
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title="Get Your Free Guide - 7 Posts You Can Steal"
      />
    </div>
  );
}

export function BenefitLed() {
  const benefits = [
    ["01", "Seven ready-to-use post prompts", "Start with a clear idea instead of a blank screen."],
    ["02", "Simple ways to make them yours", "Add your voice, offer, and point of view in minutes."],
    ["03", "A rhythm you can actually keep", "Build consistency without turning content into a second job."],
  ];

  return (
    <div className="free-guide-mockup benefit-led-page">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:wght@400;600&display=swap"
      />
      <header className="guide-nav">
        <a href="/" className="wordmark" aria-label="Done For You Marketing home">
          <span className="wordmark-serif">Done For You</span>
          <span className="wordmark-sans">Marketing</span>
        </a>
      </header>
      <main className="benefit-led-main">
        <div className="benefit-led-grid">
          <section className="benefit-led-copy">
            <h1>Make your next seven posts the easiest ones yet.</h1>
            <p className="benefit-led-intro">A practical swipe file for business owners who want to show up consistently.</p>
            <div className="benefit-list">
              {benefits.map(([number, title, copy]) => (
                <div className="benefit-item" key={number}>
                  <span className="benefit-number">{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <span>{copy}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="benefit-led-note">Made for the busy weeks when posting seems impossible.</p>
          </section>
          <section className="form-card benefit-led-form">
            <div className="form-kicker">Your free download</div>
            <h2>Get the guide in your inbox</h2>
            <p>Leave your details below and we’ll send it your way.</p>
            <FormEmbed />
          </section>
        </div>
      </main>
      <footer className="guide-footer">
        <p>&copy; 2026 Done For You Marketing &mdash; <a href="/">dfymarketinggroup.com</a></p>
        <p style={{ marginTop: 8 }}><a href="/privacy">Privacy Policy</a>{" \u00A0\u00B7\u00A0 "}<a href="/privacy?tab=tos">Terms of Service</a></p>
      </footer>
    </div>
  );
}