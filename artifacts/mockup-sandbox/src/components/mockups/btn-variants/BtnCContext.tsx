const plans = [
  {
    name: "Online Presence",
    price: "$800",
    meta: "Build your foundation online",
    features: [
      "Google Business Profile setup & management",
      "Facebook & Instagram setup & management",
      "8 posts per month across platforms",
      "Basic monthly analytics report",
      "Reputation management",
    ],
  },
  {
    name: "Growth Engine",
    price: "$1,500",
    meta: "Grow your audience and leads",
    features: [
      "Everything in Online Presence",
      "16 posts per month across platforms",
      "2 promotional emails to clients/month",
      "Automated Google Review requests",
      "Google Business Profile management",
      "Full client dashboard with analytics",
    ],
  },
  {
    name: "Done For You Partner",
    price: "$2,800",
    meta: "Complete done-for-you management",
    features: [
      "1 hour strategic onboarding call",
      "Monthly strategy check-ins",
      "Complete social media management",
      "Complete Google Business Profile management",
      "Appointment calendar setup",
      "Automated appointment reminders",
      "Email campaigns & newsletters",
      "Management & reporting of paid ads",
      "1 landing page or promo",
    ],
  },
];

export default function BtnCContext() {
  return (
    <div style={{ background: "#F5F2EA", minHeight: "100vh", padding: "60px 40px 80px", fontFamily: "Inter, sans-serif" }}>

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9AA199", marginBottom: "10px", fontWeight: 500 }}>
          Packages
        </p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: 400, color: "#1F3D2C", margin: 0, lineHeight: 1.2 }}>
          Simple, transparent pricing
        </h2>
      </div>

      {/* Plan cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", maxWidth: "960px", margin: "0 auto 36px" }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: "#fff",
              border: "1px solid rgba(31,61,44,0.1)",
              borderRadius: "10px",
              padding: "28px 24px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#2D6B4F", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}>
              {plan.name}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <span style={{ fontSize: "30px", fontWeight: 700, color: "#1F3D2C" }}>{plan.price}</span>
              <span style={{ fontSize: "13px", color: "#9AA199" }}>/mo</span>
            </div>
            <div style={{ fontSize: "12px", color: "#9AA199", marginBottom: "18px" }}>{plan.meta}</div>
            <div style={{ height: "1px", background: "rgba(31,61,44,0.08)", marginBottom: "18px" }} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: "13px", color: "#4A5568", marginBottom: "8px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#2D6B4F", fontWeight: 600, flexShrink: 0 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* The B-style button */}
      <div style={{ textAlign: "center" }}>
        <a
          href="#"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#1F3D2C",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            padding: "10px 24px",
            border: "1.5px solid #EBC99B",
            borderRadius: "6px",
            textDecoration: "none",
            letterSpacing: "0.01em",
            transition: "border-color 0.15s, color 0.15s, background 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#F5F2EA";
            e.currentTarget.style.background = "#1F3D2C";
            e.currentTarget.style.borderColor = "#1F3D2C";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#1F3D2C";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#EBC99B";
          }}
        >
          Get Started →
        </a>
      </div>
    </div>
  );
}
