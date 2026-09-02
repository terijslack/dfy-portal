import { useEffect } from "react";
import "./_group.css";

function FormEmbed() {
  useEffect(() => {
    const scriptId = "leadconnector-split-form-script";
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

export function SplitCopyForm() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#1F3D2C", color: "#F5F2EA", fontFamily: "'Inter', sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:wght@400;600&display=swap"
      />
      <header style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 54px", borderBottom: "1px solid rgba(245,242,234,0.13)" }}>
        <a href="/" aria-label="Done For You Marketing home" style={{ display: "inline-flex", alignItems: "baseline", gap: 7, color: "inherit", textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 600 }}>Done For You</span>
          <span style={{ color: "#EBC99B", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
        </a>
        <span style={{ color: "rgba(245,242,234,0.62)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>A free resource for business owners</span>
      </header>
      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "0.92fr 1.08fr", maxWidth: 1280, width: "100%", margin: "0 auto" }}>
        <section style={{ padding: "118px 72px 96px 70px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span style={{ display: "inline-block", width: "fit-content", marginBottom: 22, color: "#EBC99B", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Free guide</span>
          <h1 style={{ margin: "0 0 24px", color: "#F5F2EA", fontFamily: "'Fraunces', Georgia, serif", fontSize: 58, fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.04em" }}>7 posts you can steal this week.</h1>
          <p style={{ maxWidth: 420, margin: "0 0 38px", color: "rgba(245,242,234,0.68)", fontSize: 16, lineHeight: 1.7 }}>Good content does not need to be complicated. This short guide gives you seven useful starting points, so your next post is already halfway written.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 13, color: "#EBC99B", fontSize: 12, fontWeight: 600 }}>
            <span style={{ display: "block", width: 42, height: 1, background: "#EBC99B" }} />
            Delivered straight to your inbox
          </div>
        </section>
        <section style={{ padding: "48px 54px 54px", background: "#F5F2EA", color: "#6B756B" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 22px 22px", background: "#fff", borderRadius: 16, boxShadow: "0 15px 45px rgba(12,29,20,0.18)" }}>
            <div style={{ margin: "0 0 14px", color: "#1F3D2C", fontFamily: "'Fraunces', Georgia, serif", fontSize: 24 }}>Start here.</div>
            <FormEmbed />
          </div>
        </section>
      </main>
      <footer style={{ padding: "21px 24px", background: "#162C20", textAlign: "center", color: "rgba(245,242,234,0.5)", fontSize: 12 }}>
        <p>&copy; 2026 Done For You Marketing &mdash; <a href="/" style={{ color: "#EBC99B", textDecoration: "none" }}>dfymarketinggroup.com</a></p>
      </footer>
    </div>
  );
}