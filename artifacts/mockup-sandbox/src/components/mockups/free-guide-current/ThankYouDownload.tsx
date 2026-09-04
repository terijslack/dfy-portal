import { useState } from "react";
import "./_group.css";
import "./ThankYouDownload.css";

function ArrowDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v10M6 9.5l4 4 4-4M4 17h12" />
    </svg>
  );
}

export function ThankYouDownload() {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="free-guide-mockup thank-you-page">
      <header className="guide-nav thank-you-nav">
        <div className="guide-nav-inner">
          <a href="/" className="nav-logo-link" aria-label="Done For You Marketing home">
            <span className="nav-logo-crop" aria-hidden="true">
              <img className="nav-logo" src="/__mockup/logo-green.png" alt="" />
            </span>
          </a>
          <a href="/" className="wordmark" aria-label="Done For You Marketing home">
            <span className="wordmark-serif">Done For You</span>
            <span className="wordmark-sans">Marketing</span>
          </a>
        </div>
      </header>
      <main className="thank-you-main">
        <section className="thank-you-hero" aria-labelledby="thank-you-title">
          <div className="hero-copy">
            <h1 id="thank-you-title">Your next seven posts just got a whole lot easier.</h1>
            <p className="hero-intro">
              Thanks for signing up. Your free guide is ready to open now, and a copy will arrive in your inbox shortly.
            </p>
            <div className="hero-actions">
              <a
                className={`download-button ${downloaded ? "is-downloaded" : ""}`}
                href="/__mockup/downloads/7-proven-posts-for-trades.pdf"
                download="7-Proven-Posts-For-Trades.pdf"
                onClick={() => setDownloaded(true)}
              >
                <ArrowDown />
                <span>{downloaded ? "Guide ready to read" : "Download the free guide"}</span>
              </a>
              <a className="home-button" href="/">Back to the home page <span aria-hidden="true">↗</span></a>
            </div>
            <p className="download-note">PDF guide · 7 Proven Posts · yours to keep</p>
          </div>

          <div className="guide-preview" aria-label="Preview of the 7 Proven Posts guide">
            <div className="preview-shadow" />
            <div className="preview-paper">
              <div className="paper-topline"><span>DONE FOR YOU</span></div>
              <div className="paper-rule" />
              <p className="paper-kicker">The free guide</p>
              <h2>7 Proven<br /><em>Posts</em></h2>
              <p className="paper-caption">You can steal for your small business</p>
              <div className="paper-footer">Marketing that fits real life.</div>
            </div>
          </div>
        </section>

        <section className="next-steps" aria-labelledby="next-steps-title">
          <div className="section-heading">
            <h2 id="next-steps-title">A little less marketing<br /><em>on your mind.</em></h2>
          </div>
          <div className="steps-list">
            <article className="step">
              <span className="step-number">01</span>
              <div><h3>Open the guide today</h3><p>Pick one prompt that sounds like you. One useful post is a strong start.</p></div>
            </article>
            <article className="step">
              <span className="step-number">02</span>
              <div><h3>Make it yours</h3><p>Swap in your story, your offer, and the words your customers already use.</p></div>
            </article>
            <article className="step">
              <span className="step-number">03</span>
              <div><h3>Keep the momentum</h3><p>When the week gets full, come back to the guide and choose the next easy win.</p></div>
            </article>
          </div>
        </section>

        <section className="about-strip">
          <div className="about-mark" aria-hidden="true">
            <img className="about-mark-logo" src="/__mockup/logo-green.png" alt="" />
          </div>
          <div className="about-copy">
            <h2>Marketing support for the parts you don&apos;t have time to carry alone.</h2>
            <p>Done For You Marketing Group helps busy small-business owners show up consistently with clear strategy, thoughtful creative, and reliable hands-on support. You run the business. We&apos;ll help keep it visible.</p>
          </div>
          <a className="about-link" href="/">See how we can help <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className="guide-footer thank-you-footer">
        <p>&copy; 2026 Done For You Marketing Group <span>·</span> dfymarketinggroup.com</p>
        <p><a href="/privacy">Privacy Policy</a><span>·</span><a href="/privacy?tab=tos">Terms of Service</a></p>
      </footer>
    </div>
  );
}