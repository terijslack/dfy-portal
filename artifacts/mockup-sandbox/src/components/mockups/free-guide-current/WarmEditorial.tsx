import { useEffect } from "react";
import "./_group.css";

function FormEmbed() {
  useEffect(() => {
    const scriptId = "leadconnector-editorial-form-script";
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

export function WarmEditorial() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#EDE4D4", color: "#1F3D2C", fontFamily: "'Inter', sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap"
      />
      <header style={{ height: 74, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(31,61,44,0.16)" }}>
        <a href="/" aria-label="Done For You Marketing home" style={{ display: "inline-flex", alignItems: "baseline", gap: 7, color: "inherit", textDecoration: "none" }}>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 600 }}>Done For You</span>
          <span style={{ color: "#2D6B4F", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Marketing</span>
        </a>
      </header>
      <main style={{ flex: 1, padding: "76px 28px 100px" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 74, alignItems: "end", marginBottom: 36 }}>
            <div>
              <span style={{ display: "inline-block", marginBottom: 17, color: "#7D2A03", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>The content shortcut</span>
              <h1 style={{ margin: 0, fontFamily: "'Fraunces', Georgia, serif", fontSize: 64, fontWeight: 400, lineHeight: 0.98, letterSpacing: "-0.05em" }}>Your next post is already here.</h1>
            </div>
            <p style={{ margin: "0 0 4px", maxWidth: 390, color: "#6B756B", fontSize: 15, lineHeight: 1.7 }}>Seven prompts, one less blank page, and a little more room in your week. Download the guide and make content feel lighter.</p>
          </div>
          <div style={{ height: 1, background: "rgba(31,61,44,0.2)", marginBottom: 34 }} />
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 35, alignItems: "start" }}>
            <div style={{ paddingTop: 21, color: "#7D2A03", fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontStyle: "italic", lineHeight: 1.25 }}>A small gift for your content calendar.</div>
            <div style={{ padding: "24px 22px 18px", background: "#F8F5EE", border: "1px solid rgba(31,61,44,0.12)", borderRadius: 4, boxShadow: "8px 8px 0 rgba(125,42,3,0.10)" }}>
              <div style={{ marginBottom: 14, color: "#1F3D2C", fontFamily: "'Fraunces', Georgia, serif", fontSize: 25 }}>Get the free guide</div>
              <FormEmbed />
            </div>
          </div>
        </div>
      </main>
      <footer style={{ padding: "24px 20px", background: "#1F3D2C", textAlign: "center", color: "rgba(245,242,234,0.55)", fontSize: 12 }}>
        <p>&copy; 2026 Done For You Marketing &mdash; <a href="/" style={{ color: "#EBC99B", textDecoration: "none" }}>dfymarketinggroup.com</a></p>
        <p style={{ marginTop: 8 }}><a href="/privacy" style={{ color: "rgba(235,201,155,0.85)", textDecoration: "none" }}>Privacy Policy</a>{" \u00A0\u00B7\u00A0 "}<a href="/privacy?tab=tos" style={{ color: "rgba(235,201,155,0.85)", textDecoration: "none" }}>Terms of Service</a></p>
      </footer>
    </div>
  );
}