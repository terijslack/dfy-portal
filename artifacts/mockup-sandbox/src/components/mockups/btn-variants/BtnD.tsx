export default function BtnD() {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px", fontWeight: 500 }}>
          D — Pill
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            background: "#EBC99B",
            color: "#1F3D2C",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            padding: "14px 44px",
            borderRadius: "100px",
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#d4b080")}
          onMouseLeave={e => (e.currentTarget.style.background = "#EBC99B")}
        >
          Get Started
        </a>
        <p style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199" }}>
          Warm tan fill, pill shape — friendly &amp; approachable
        </p>
      </div>
    </div>
  );
}
