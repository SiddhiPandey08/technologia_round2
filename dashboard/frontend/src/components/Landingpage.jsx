import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GridScan } from "./GridScan/GridScan.jsx";
import acmSigaiLogo from "../assets/acm-sigai-logo-dark.jpeg";
import tcetLogo from "../assets/tcet.png";
import tcsLogo from "../assets/tcs.png";
import tcetSigaiLogo from "../assets/tcet-sigai.png";
import "./Landingpage.css";

const NAV_LINKS = ["Missions", "Engineering", "Systems"];

const LIVE_STATS = [
  { label: "candidates active", target: 50, suffix: "" },
  { label: "time limit", target: 60, suffix: " min" },
  { label: "selected slots", target: 18, suffix: "" },
];

const ORGANIZER_LOGOS = [
  { src: acmSigaiLogo, alt: "ACM SIGAI" },
  { src: tcetLogo, alt: "TCET" },
  { src: tcsLogo, alt: "TCS" },
  { src: tcetSigaiLogo, alt: "TCET SIGAI" },
];

/* ---------- animated count-up ---------- */
function CountUp({ target, suffix = "", start }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!start || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix;
      },
    });
  }, [start, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ---------- sticky header ---------- */
function Header() {
  return (
    <header
      data-reveal="header"
      style={{
        flexShrink: 0,
        borderBottom: "1px solid var(--border)",
        background: "rgba(10, 7, 19, 0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
        }}
      >
        <span
          className="mono flowing-wordmark"
          style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.05em" }}
        >
          TECHNOLOGIA 2.0
        </span>

        <nav
          className="header-nav"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        ></nav>

        <span className="header-status">
          <span className="pulse-dot" />
          SIMULATION INACTIVE
        </span>
      </div>
    </header>
  );
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const [statsStart, setStatsStart] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".word-reveal", containerRef.current);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from('[data-reveal="header"]', { y: -30, opacity: 0, duration: 0.5 })
        .from(
          ".top-marquee-reveal",
          { y: -10, opacity: 0, duration: 0.4 },
          "-=0.3",
        )
        .from(
          ".badge-reveal",
          { scale: 0.8, opacity: 0, duration: 0.35 },
          "-=0.2",
        )
        .from(
          words,
          { y: 26, opacity: 0, duration: 0.5, stagger: 0.07 },
          "-=0.15",
        )
        .from(".subtext-reveal", { y: 12, opacity: 0, duration: 0.4 }, "-=0.25")
        .from(".cta-reveal", { y: 10, opacity: 0, duration: 0.35 }, "-=0.22")
        .from(".stats-reveal", { y: 12, opacity: 0, duration: 0.35 }, "-=0.2")
        .call(() => {
          setStatsStart(true);
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#0a0713",
      }}
    >
      <div className="bg-dotgrid" />
      <div className="hero-bg-overlay" />
      <GridScan
        gridScale={0.14}
        scanOpacity={0.25}
        bloomIntensity={0.4}
        scanDuration={3.5}
        scanDelay={2.5}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      />

      <Header />

      {/* CENTRAL HERO CONTAINER */}
      <main
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          maxWidth: 860,
          width: "100%",
          margin: "0 auto",
          padding: "30px 24px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {/* LOGO MARQUEE PLACED ON TOP */}
        <div
          className="top-marquee-reveal marquee-container"
          style={{ marginBottom: 28 }}
        >
          <div className="marquee-track">
            <div className="marquee-content">
              {[...ORGANIZER_LOGOS, ...ORGANIZER_LOGOS].map((logo, idx) => (
                <img
                  key={idx}
                  src={logo.src}
                  alt={logo.alt}
                  className="partner-logo"
                />
              ))}
            </div>
          </div>
        </div>

        {/* GAMIFIED BADGE */}
        <div className="badge-reveal gamified-badge">
          <span className="badge-dot" />
          THREAT LEVEL: CRITICAL · DEPLOYMENT WINDOW CLOSING
        </div>

        {/* MAIN TITLE */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 800,
            margin: "0 0 16px",
            lineHeight: 1.05,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="word-reveal" style={{ display: "inline-block" }}>
            OPERATION{" "}
          </span>{" "}
          <span
            className="word-reveal gradient-text"
            style={{ display: "inline-block" }}
          >
            PHOENIX
          </span>
        </h1>

        {/* SUBTITLE */}
        <p
          className="subtext-reveal"
          style={{
            fontSize: "clamp(14px, 1.8vw, 16px)",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            margin: "0 0 28px",
            maxWidth: 580,
          }}
        >
          Your lead architect resigned overnight. Reconstruct the core
          architecture, solve 4 critical system missions, and prove your
          engineering capability.
        </p>

        {/* ACTION BUTTONS */}
        <div
          className="cta-reveal"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginBottom: 44,
          }}
        >
          <Link to="/login" className="btn-gamified">
            INITIALIZE MISSION CONTROL →
          </Link>
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--text-muted)" }}
          >
            ⏱ 60 MINUTES · 4 MISSIONS · LIVE COMPILER
          </span>
        </div>

        {/* HUD STATS GRID */}
        <div className="stats-reveal stats-container">
          {LIVE_STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">
                <CountUp
                  target={s.target}
                  suffix={s.suffix}
                  start={statsStart}
                />
              </div>
              <div className="stat-label mono">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
