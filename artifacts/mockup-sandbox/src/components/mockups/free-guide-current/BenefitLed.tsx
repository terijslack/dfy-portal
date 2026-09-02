import { useEffect } from "react";
import "./_group.css";

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
  return (
    <div className="free-guide-mockup" style={{ background: "#F5F2EA" }}>
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
      <main style={{ flex: 1, padding: "68px 48px 88px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "0.88fr 1.12fr", gap: 64, alignItems: "start" }}>
          <section style={{ paddingTop: 28 }}>
            <span className="eyebrow">Free guide</span>
            <h1 style={{ margin: "0 0 22px", color: "#1F3D2C", fontFamily: "'Fraunces', Georgia, serif", fontSize: 58, fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.035em" }}>
              Make your next seven posts the easiest ones yet.
            </h1>
            <p style={{ maxWidth: 450, margin: "0 0 36px", color: "#6B756B", fontSize: 16, lineHeight: 1.7 }}>
              A practical swipe file for business owners who want to show up consistently without spending all afternoon wondering what to say.
            </p>
            <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
              {[
                ["01", "Seven ready-to-use post prompts", "Start with a clear idea instead of a blank screen."],
                ["02", "Simple ways to make them yours", "Add your voice, offer, and point of view in minutes."],
                ["03", "A rhythm you can actually keep", "Build consistency without turning content into a second job."],
              ].map(([number, title, copy]) => (
                <div key={number} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, alignItems: "start" }}>
                  <span style={{ color: "#7D2A03", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", paddingTop: 3 }}>{number}</span>
                  <div>
                    <strong style={{ display: "block", color: "#1F3D2C", fontSize: 14, marginBottom: 3 }}>{title}</strong>
                    <span style={{ color: "#6B756B", fontSize: 12, lineHeight: 1.5 }}>{copy}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="form-card" style={{ padding: "30px 24px 22px" }}>
            <div style={{ color: "#1F3D2C", fontFamily: "'Fraunces', Georgia, serif", fontSize: 23, margin: "0 0 18px" }}>Get the guide in your inbox</div>
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