import { useEffect } from "react";
import "./BenefitLedQuiet.css";

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
    <div className="quiet-guide__form-frame">
      <iframe
        src="https://api.leadconnectorhq.com/widget/form/kzv1Ob1IqTbQ8Wf05eMY"
        id="inline-kzv1Ob1IqTbQ8Wf05eMY"
        title="Get Your Free Guide - 7 Posts You Can Steal"
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        data-form-name="Get Your Free Guide - 7 Posts You Can Steal"
        data-height="708"
        data-layout-iframe-id="inline-kzv1Ob1IqTbQ8Wf05eMY"
        data-form-id="kzv1Ob1IqTbQ8Wf05eMY"
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
      />
    </div>
  );
}

export function BenefitLedQuiet() {
  return (
    <div className="quiet-guide">
      <header className="quiet-guide__header">
        <a href="/" className="quiet-guide__brand" aria-label="Done For You Marketing home">
          <span className="quiet-guide__brand-main">Done For You</span>
          <span className="quiet-guide__brand-sub">Marketing</span>
        </a>
        <span className="quiet-guide__header-note">Free resource</span>
      </header>

      <main className="quiet-guide__main">
        <div className="quiet-guide__layout">
          <section className="quiet-guide__intro">
            <p className="quiet-guide__eyebrow">A small head start</p>
            <h1>Seven posts.<br /><em>Zero</em> blank screens.</h1>
            <p className="quiet-guide__dek">
              A practical swipe file for the weeks when your business is moving faster than your content plan.
            </p>
            <div className="quiet-guide__rule" />
            <ol className="quiet-guide__benefits">
              <li className="quiet-guide__benefit">
                <span className="quiet-guide__number">01</span>
                <span>
                  <strong className="quiet-guide__benefit-title">A clear place to begin</strong>
                  <span className="quiet-guide__benefit-copy">Seven prompts built to turn a blank caption into a useful first draft.</span>
                </span>
              </li>
              <li className="quiet-guide__benefit">
                <span className="quiet-guide__number">02</span>
                <span>
                  <strong className="quiet-guide__benefit-title">Room for your point of view</strong>
                  <span className="quiet-guide__benefit-copy">Simple cues for adding your offer, your voice, and the details only you know.</span>
                </span>
              </li>
              <li className="quiet-guide__benefit">
                <span className="quiet-guide__number">03</span>
                <span>
                  <strong className="quiet-guide__benefit-title">A rhythm that leaves room</strong>
                  <span className="quiet-guide__benefit-copy">A gentler way to stay visible without making content your second job.</span>
                </span>
              </li>
            </ol>
          </section>

          <section className="quiet-guide__form-wrap" aria-label="Free guide signup">
            <div className="quiet-guide__form-heading">
              <span>Get the guide in your inbox</span>
              <span className="quiet-guide__form-meta">No fuss / just useful</span>
            </div>
            <FormEmbed />
          </section>
        </div>
      </main>

      <footer className="quiet-guide__footer">
        <p>© 2026 Done For You Marketing — <a href="/">dfymarketinggroup.com</a></p>
        <p><a href="/privacy">Privacy Policy</a> &nbsp;·&nbsp; <a href="/privacy?tab=tos">Terms of Service</a></p>
      </footer>
    </div>
  );
}