export function TextWordmark() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#F5F2EA", fontFamily: "'Inter', sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap"
      />

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 2px 24px rgba(31,61,44,0.10)",
          width: 400,
          padding: "44px 44px 48px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 28,
                fontWeight: 400,
                color: "#1F3D2C",
                letterSpacing: "-0.01em",
              }}
            >
              Done For You
            </span>
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#2D6B4F",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Marketing Group
            </span>
          </div>
          <div
            style={{
              width: 32,
              height: 2,
              background: "#EBC99B",
              margin: "14px auto 0",
              borderRadius: 2,
            }}
          />
          <p
            style={{
              color: "#9AA199",
              fontSize: 12.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            Client Portal
          </p>
        </div>

        <h1
          style={{
            color: "#1F3D2C",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          Welcome back
        </h1>
        <p style={{ color: "#9AA199", fontSize: 13.5, marginBottom: 28 }}>
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
  );
}
