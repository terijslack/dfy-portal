export default function BtnB() {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px", fontWeight: 500 }}>
          B — Solid Forest
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            background: "#1F3D2C",
            color: "#F5F2EA",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            padding: "14px 36px",
            borderRadius: "6px",
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#7D2A03")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1F3D2C")}
        >
          Get Started
        </a>
        <p style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9AA199" }}>
          Deep forest fill, transitions to brand green on hover
        </p>
      </div>
    </div>
  );
}
