import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GridScan } from "./GridScan/GridScan.jsx";
import acmSigaiLogo from "../assets/acm-sigai-logo-dark.png";
import tcetLogo from "../assets/tcet.png";
import tcsLogo from "../assets/tcs.png";
import tcetSigaiLogo from "../assets/tcet-sigai.png";
const NAV_LINKS = ["Missions", "Engineering", "Systems"];

const MISSIONS_DATA = [
  { number: 1, title: "Understand the Project", locked: false },
  { number: 2, title: "Build the Foundation", locked: true },
  { number: 3, title: "Expand the System", locked: true },
  { number: 4, title: "Final Integration", locked: true },
];

const LIVE_STATS = [
  { label: "candidates", target: 50, suffix: "" },
  { label: "time limit", target: 60, suffix: " min" },
  { label: "selected", target: 18, suffix: "" },
];

/* ---------- typing effect ---------- */
function useTypewriter(fullText, speed, active) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [active, fullText, speed]);
  return shown;
}

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
        <div
          className="header-brand"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <OrganizerLogos />
          <span
            aria-hidden
            style={{ width: 1, height: 18, background: "var(--border)" }}
          />
          <span
            className="mono flowing-wordmark"
            style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.005em" }}
          >
            TECHNOLOGIA 2.0
          </span>
        </div>
        <nav
          className="header-nav"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          {NAV_LINKS.map((l) => (
            <span
              key={l}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.03em",
              }}
            >
              {l}
            </span>
          ))}
        </nav>

        <span
          className="header-status"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            fontWeight: 600,
            color: "var(--teal)",
            padding: "3px 10px",
            borderRadius: 20,
            border: "1px solid rgba(43, 184, 153, 0.3)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--teal)",
            }}
          />
          OPERATION PHOENIX · LIVE
        </span>
      </div>
    </header>
  );
}

/* ---------- mockup frame ---------- */
function AppFrame({ children, footer }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--surface-1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderBottom: "1px solid var(--border)",
          background: "var(--purple-900)",
        }}
      >
        {["#e2564f", "#f2b93b", "#2bb899"].map((c) => (
          <span
            key={c}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c,
              opacity: 0.7,
            }}
          />
        ))}
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 8 }}
        >
          recruitos.technova.io/mission-1
        </span>
      </div>
      {children}
      {footer}
    </div>
  );
}

function MissionStepperStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        flexWrap: "wrap",
        padding: "8px 14px",
        borderTop: "1px solid var(--border)",
        background: "var(--purple-900)",
      }}
    >
      {MISSIONS_DATA.map((s, i) => (
        <div
          key={s.number}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 20,
              color: !s.locked ? "var(--text-primary)" : "var(--text-muted)",
              border: !s.locked
                ? "1px solid var(--violet)"
                : "1px solid transparent",
              background: !s.locked ? "var(--violet-dim)" : "transparent",
            }}
          >
            {i + 1} {s.title.split(" ")[0]}
          </span>
          {i < MISSIONS_DATA.length - 1 && (
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}
function OrganizerLogos() {
  const logos = [
    { src: acmSigaiLogo, alt: "ACM SIGAI" },
    { src: tcetLogo, alt: "TCET" },
    { src: tcsLogo, alt: "TCS" },
    { src: tcetSigaiLogo, alt: "TCET SIGAI" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {logos.map((l) => (
        <img
          key={l.alt}
          src={l.src}
          alt={l.alt}
          style={{
            height: 22,
            width: "auto",
            opacity: 0.85,
            filter: "grayscale(10%)",
          }}
        />
      ))}
    </div>
  );
}
export default function LandingPage() {
  const containerRef = useRef(null);
  const mockupWrapRef = useRef(null);
  const mockupFrameRef = useRef(null);
  const rightPanelRef = useRef(null);
  const [typingActive, setTypingActive] = useState(false);
  const [statsStart, setStatsStart] = useState(false);

  const typed = useTypewriter(
    "Congratulations on clearing the initial assessment phase. The core system architecture has been compromised.",
    15,
    typingActive,
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray(".word-reveal", containerRef.current);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from('[data-reveal="header"]', { y: -30, opacity: 0, duration: 0.5 })
        .from(".eyebrow-reveal", { y: 12, opacity: 0, duration: 0.35 }, "-=0.2")
        .from(
          words,
          { y: 26, opacity: 0, duration: 0.5, stagger: 0.07 },
          "-=0.15",
        )
        .from(".subtext-reveal", { y: 12, opacity: 0, duration: 0.4 }, "-=0.25")
        .from(".cta-reveal", { y: 10, opacity: 0, duration: 0.35 }, "-=0.22")
        .from(".stats-reveal", { y: 8, opacity: 0, duration: 0.35 }, "-=0.2")
        .from(
          mockupWrapRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.96,
            rotateX: 6,
            duration: 0.65,
            transformPerspective: 800,
          },
          "-=0.3",
        )
        .call(() => {
          setTypingActive(true);
          setStatsStart(true);
        })
        .from(
          rightPanelRef.current,
          { x: 18, opacity: 0, duration: 0.45 },
          "+=0.7",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* subtle mouse-parallax tilt on the mockup */
  useEffect(() => {
    const el = mockupFrameRef.current;
    const wrap = mockupWrapRef.current;
    if (!el || !wrap) return;

    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: px * 4,
        rotateX: -py * 4,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
      });

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .bg-dotgrid {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: radial-gradient(rgba(168, 85, 247, 0.16) 1px, transparent 1px);
          background-size: 26px 26px;
          -webkit-mask-image: linear-gradient(to bottom, transparent, #000 8%, #000 70%, transparent);
          mask-image: linear-gradient(to bottom, transparent, #000 8%, #000 70%, transparent);
          pointer-events: none;
        }
        .flowing-wordmark {
          background: linear-gradient(90deg, var(--gold), var(--violet), var(--gold-bright), var(--violet), var(--gold));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wordmark-flow 6s linear infinite;
        }
        @keyframes wordmark-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: -300% 50%; }
        }
        @media (max-width: 720px) {
          .header-nav, .header-status { display: none !important; }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .mockup-col { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
      <div className="bg-dotgrid" />
      <div className="bg-dotgrid" />:
      <GridScan
        gridScale={0.14}
        scanOpacity={0.3}
        bloomIntensity={0.45}
        scanDuration={3.5}
        scanDelay={2.5}
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      />
      <Header />
      {/* HERO — fills remaining viewport height, no scroll */}
      <div
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          maxWidth: 1040,
          width: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          gap: 44,
          alignItems: "center",
        }}
      >
        <div>
          <p
            className="mono eyebrow-reveal"
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              margin: "0 0 8px",
            }}
          >
            technova solutions · graduate onboarding program
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(30px, 3.8vw, 46px)",
              fontWeight: 700,
              margin: "0 0 14px",
              lineHeight: 1.08,
              color: "var(--text-primary)",
            }}
          >
            <span className="word-reveal" style={{ display: "inline-block" }}>
              Operation{" "}
            </span>
            <span
              className="word-reveal gradient-text"
              style={{ display: "inline-block" }}
            >
              Phoenix
            </span>
          </h1>
          <p
            className="subtext-reveal"
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: "0 0 20px",
              maxWidth: 400,
            }}
          >
            Your lead architect resigned last night. Four missions, one live
            simulation — reconstruct the system before the deployment window
            closes.
          </p>

          <div
            className="cta-reveal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 18,
            }}
          >
            <Link
              to="/login"
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#1a1204",
                fontWeight: 700,
                fontSize: 13.5,
                padding: "12px 26px",
                borderRadius: 9,
                textDecoration: "none",
              }}
            >
              Enter Mission Control →
            </Link>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              60 min · 4 missions
            </span>
          </div>

          {/* compact inline live stats — replaces the old full-width stats banner */}
          <div className="stats-reveal" style={{ display: "flex", gap: 20 }}>
            {LIVE_STATS.map((s) => (
              <div key={s.label}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--text-primary)",
                  }}
                >
                  <CountUp
                    target={s.target}
                    suffix={s.suffix}
                    start={statsStart}
                  />
                </p>
                <p
                  className="mono"
                  style={{
                    fontSize: 9.5,
                    color: "var(--text-muted)",
                    letterSpacing: "0.04em",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* mockup */}
        <div
          className="mockup-col"
          ref={mockupWrapRef}
          style={{ position: "relative" }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "10px -10px -10px 10px",
              border: "1px solid var(--border)",
              borderRadius: 14,
              zIndex: 0,
            }}
          />
          <div
            ref={mockupFrameRef}
            style={{
              position: "relative",
              zIndex: 1,
              transformStyle: "preserve-3d",
            }}
          >
            <AppFrame footer={<MissionStepperStrip />}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  minHeight: 220,
                }}
              >
                <div
                  style={{
                    padding: 16,
                    borderRight: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      RECRUIT.OS
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--teal)",
                        padding: "2px 8px",
                        borderRadius: 20,
                        border: "1px solid rgba(43, 184, 153, 0.3)",
                      }}
                    >
                      ● live
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9,
                        color: "var(--text-muted)",
                        margin: "0 0 6px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      FROM · ENGINEERING OPERATIONS
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 700,
                        margin: "0 0 8px",
                        color: "var(--text-primary)",
                      }}
                    >
                      Welcome to TechNova Solutions
                    </p>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        margin: 0,
                        minHeight: 48,
                      }}
                    >
                      {typed}
                      <span
                        style={{
                          display: "inline-block",
                          width: 5,
                          height: 11,
                          background: "var(--violet)",
                          marginLeft: 2,
                          verticalAlign: "text-bottom",
                          opacity: typed.length % 2 === 0 ? 1 : 0.3,
                        }}
                      />
                    </p>
                  </div>
                </div>

                <div
                  ref={rightPanelRef}
                  style={{
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 9,
                        color: "var(--violet)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      OPERATION PHOENIX
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--red)",
                        padding: "2px 8px",
                        borderRadius: 20,
                        border: "1px solid rgba(226, 86, 79, 0.3)",
                      }}
                    >
                      CRITICAL
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 700,
                      margin: 0,
                      color: "var(--text-primary)",
                    }}
                  >
                    Mission 1: The Lost Blueprint
                  </h3>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          color: "var(--text-muted)",
                          margin: "0 0 2px",
                        }}
                      >
                        DIFFICULTY
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--gold)",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        Medium
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          color: "var(--text-muted)",
                          margin: "0 0 2px",
                        }}
                      >
                        DURATION
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        15 MIN
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 9,
                          color: "var(--text-muted)",
                          margin: "0 0 2px",
                        }}
                      >
                        STATUS
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--teal)",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        READY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AppFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
