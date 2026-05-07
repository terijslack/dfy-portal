export function DarkHeader() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:wght@400;700&display=swap"
      />

      <header
        style={{
          background: "#1F3D2C",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <img
          src="/__mockup/images/logo.png"
          alt="DFY Marketing"
          style={{ height: 36, width: "auto", filter: "brightness(0) invert(1)" }}
        />
        <div
          style={{
            width: 1,
            height: 28,
            background: "rgba(245,242,234,0.20)",
          }}
        />
        <span
          style={{
            color: "#EBC99B",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Client Portal
        </span>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 24px rgba(31,61,44,0.10)",
            width: 400,
            padding: "40px 44px 44px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: "#1F3D2C",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "#9AA199", fontSize: 14, marginBottom: 30 }}>
            Sign in to review your posts
          </p>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                color: "#6B756B",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              readOnly
              style={{
                width: "100%",
                padding: "10px 13px",
                borderRadius: 8,
                border: "1px solid rgba(31,61,44,0.15)",
                fontSize: 14,
                color: "#6B756B",
                background: "#FAFAF8",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 26 }}>
            <label
              style={{
                display: "block",
                color: "#6B756B",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              readOnly
              style={{
                width: "100%",
                padding: "10px 13px",
                borderRadius: 8,
                border: "1px solid rgba(31,61,44,0.15)",
                fontSize: 14,
                color: "#6B756B",
                background: "#FAFAF8",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "#7D2A03",
              color: "#F5F2EA",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Sign in
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#9AA199" }}>
            New client?{" "}
            <span style={{ color: "#2D6B4F", fontWeight: 500, cursor: "pointer" }}>
              Get started
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
