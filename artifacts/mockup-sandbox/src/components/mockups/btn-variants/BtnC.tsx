export default function BtnC() {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px", fontWeight: 500 }}>
          C — Minimal Underline
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#1F3D2C",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            padding: "4px 0",
            borderBottom: "1.5px solid #EBC99B",
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#7D2A03"; e.currentTarget.style.borderColor = "#7D2A03"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#1F3D2C"; e.currentTarget.style.borderColor = "#EBC99B"; }}
        >
          Get Started →
        </a>
        <p style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199" }}>
          Understated — tan underline accent, rust on hover
        </p>
      </div>
    </div>
  );
}
