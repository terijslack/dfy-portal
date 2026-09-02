import { useEffect } from "react";
import "./_group.css";

export function Current() {
  useEffect(() => {
    const scriptId = "leadconnector-form-embed-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="free-guide-mockup">
      <header className="guide-nav">
        <a href="/" className="wordmark" aria-label="Done For You Marketing home">
          <span className="wordmark-serif">Done For You</span>
          <span className="wordmark-sans">Marketing</span>
        </a>
      </header>

      <main className="guide-main">
        <section className="guide-content" aria-labelledby="guide-heading">
          <span className="eyebrow">Free Guide</span>
          <h1 id="guide-heading">7 social media posts you can steal</h1>
          <p className="intro">
            Stop staring at a blank content calendar. Get simple, ready-to-use post ideas
            that make showing up consistently easier.
          </p>

          <div className="form-card">
            <div className="form-frame">
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
          </div>
        </section>
      </main>

      <footer className="guide-footer">
        <p>
          &copy; 2026 Done For You Marketing &mdash;{" "}
          <a href="/">dfymarketinggroup.com</a>
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="/privacy">Privacy Policy</a>
          {" \u00A0\u00B7\u00A0 "}
          <a href="/privacy?tab=tos">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}