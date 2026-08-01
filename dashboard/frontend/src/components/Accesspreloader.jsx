import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ---------- Web Audio Synthesizer Cues ---------- */
const playAudioCue = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === "ping") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    } else if (type === "connected") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    } else if (type === "type") {
      osc.type = "square";
      osc.frequency.setValueAtTime(500 + Math.random() * 80, ctx.currentTime);
      gain.gain.setValueAtTime(0.004, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
};

export default function InterviewWelcomePreloader({ onComplete }) {
  const containerRef = useRef(null);
  const avatarRef = useRef(null);
  const buttonRef = useRef(null);

  const [stage, setStage] = useState("connecting"); // 'connecting' | 'welcoming'
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const fullWelcomeText =
    "Welcome to Round 2. I'll be overseeing your technical evaluation today. We're eager to observe your system design thinking and execution under structured constraints. Whenever you feel ready, initiate your workspace below.";

  /* ---------- Connection Phase ---------- */
  useEffect(() => {
    gsap.to(avatarRef.current, {
      y: -5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const audioInterval = setInterval(() => playAudioCue("ping"), 1400);

    const timer = setTimeout(() => {
      clearInterval(audioInterval);
      setStage("welcoming");
      playAudioCue("connected");
    }, 2200);

    return () => {
      clearInterval(audioInterval);
      clearTimeout(timer);
    };
  }, []);

  /* ---------- Subdued, Professional Typewriter (90ms) ---------- */
  useEffect(() => {
    if (stage !== "welcoming") return;

    let index = 0;
    const typeInterval = setInterval(() => {
      index++;
      setTypedText(fullWelcomeText.slice(0, index));

      if (index % 3 === 0) playAudioCue("type");

      if (index >= fullWelcomeText.length) {
        clearInterval(typeInterval);
        setIsTypingDone(true);
      }
    }, 90);

    return () => clearInterval(typeInterval);
  }, [stage]);

  /* ---------- Smooth Button Fade-In ---------- */
  useEffect(() => {
    if (isTypingDone && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }
  }, [isTypingDone]);

  const handleLaunchWorkspace = () => {
    playAudioCue("connected");
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.99,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        background: "#08070c",
        color: "#d1d5db",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "36px 56px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .subtle-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .avatar-border-neutral {
          border: 1px solid rgba(168, 85, 247, 0.3);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .avatar-border-active {
          border: 1px solid rgba(43, 184, 153, 0.5);
          box-shadow: 0 0 20px rgba(43, 184, 153, 0.08);
        }

        /* macOS Window Dot Controls */
        .mac-btn {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: filter 0.2s ease;
        }

        .mac-close {
          background-color: #FF5F56;
          border: 0.5px solid rgba(0, 0, 0, 0.2);
        }

        .mac-minimize {
          background-color: #FFBD2E;
          border: 0.5px solid rgba(0, 0, 0, 0.2);
        }

        .mac-maximize {
          background-color: #27C93F;
          border: 0.5px solid rgba(0, 0, 0, 0.2);
        }

        .mac-dots-container:hover .mac-btn::after {
          opacity: 0.6;
        }

        .mac-close::after {
          content: "×";
          font-size: 10px;
          color: #4d0000;
          opacity: 0;
          font-weight: bold;
          line-height: 1;
        }

        .mac-minimize::after {
          content: "–";
          font-size: 10px;
          color: #5a3d00;
          opacity: 0;
          font-weight: bold;
          line-height: 1;
        }

        .mac-maximize::after {
          content: "+";
          font-size: 9px;
          color: #003e00;
          opacity: 0;
          font-weight: bold;
          line-height: 1;
        }

        .eq-bar-subtle {
          width: 2px;
          background: #2bb899;
          border-radius: 1px;
          animation: eqPulse 1s infinite alternate ease-in-out;
        }

        @keyframes eqPulse {
          0% { height: 3px; opacity: 0.2; }
          100% { height: 14px; opacity: 0.8; }
        }
      `}</style>

      <div className="subtle-grid" />

      {/* TOP HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9333ea",
              letterSpacing: "0.12em",
            }}
          >
            RECRUIT.OS
          </span>
          <span style={{ fontSize: 10, color: "#4b5563" }}>
            / ASSESSMENT GATEWAY
          </span>
        </div>

        {/* STEPPER BREADCRUMBS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 11,
          }}
        >
          <span
            style={{
              color: "#2bb899",
              border: "1px solid rgba(43, 184, 153, 0.2)",
              padding: "4px 14px",
              borderRadius: 20,
              background: "rgba(43, 184, 153, 0.04)",
            }}
          >
            ✓ Stage 01 · Aptitude
          </span>
          <span style={{ color: "#374151" }}>—</span>
          <span
            style={{
              color: "#f3f4f6",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              padding: "4px 14px",
              borderRadius: 20,
              background: "rgba(168, 85, 247, 0.08)",
              fontWeight: 600,
            }}
          >
            Stage 02 · Engineering
          </span>
        </div>

        <div style={{ fontSize: 10, color: "#6b7280" }}>
          SESSION <span style={{ color: "#9ca3af" }}>#8092-ENG</span>
        </div>
      </div>

      {/* CENTER EXPANDED HUD LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          gap: 28,
          alignItems: "center",
          height: "calc(100vh - 170px)",
          maxHeight: 500,
          zIndex: 10,
        }}
      >
        {/* LEFT HUD METRICS */}
        <div
          style={{
            background: "rgba(12, 10, 18, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            padding: 20,
            fontSize: 10,
            color: "#6b7280",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                color: "#a855f7",
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.05em",
              }}
            >
              CANDIDATE DOSSIER
            </div>
            <div style={{ color: "#d1d5db" }}>CLEARANCE: VERIFIED</div>
            <div style={{ marginTop: 2 }}>TRACK: FULL-STACK ARCHITECTURE</div>
          </div>
          <hr
            style={{
              borderColor: "rgba(255,255,255,0.04)",
              width: "100%",
              margin: 0,
            }}
          />
          <div>
            <div
              style={{
                color: "#a855f7",
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.05em",
              }}
            >
              SYSTEM METRICS
            </div>
            <div>LATENCY: 18ms</div>
            <div style={{ marginTop: 2 }}>RUNTIME: ISOLATED V8</div>
          </div>
        </div>

        {/* CENTER INTERVIEW TERMINAL (macOS Style) */}
        <div
          style={{
            height: "100%",
            background: "rgba(15, 13, 22, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderTop: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: 12,
            boxShadow:
              "0 30px 60px -12px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "0 0 24px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* macOS TERMINAL TITLEBAR */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              padding: "12px 18px",
            }}
          >
            {/* macOS Red / Yellow / Green Dots */}
            <div
              className="mac-dots-container"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span className="mac-btn mac-close" />
              <span className="mac-btn mac-minimize" />
              <span className="mac-btn mac-maximize" />
            </div>

            {/* Terminal Title */}
            <div
              style={{
                fontSize: 11,
                color: "#9ca3af",
                fontWeight: 500,
                letterSpacing: "0.02em",
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                opacity: 0.8,
              }}
            ></div>

            {/* Status Indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: stage === "connecting" ? "#f59e0b" : "#2bb899",
                  boxShadow:
                    stage === "connecting"
                      ? "0 0 8px rgba(245, 158, 11, 0.4)"
                      : "0 0 8px rgba(43, 184, 153, 0.4)",
                }}
              />
              <span
                style={{
                  color: stage === "connecting" ? "#f59e0b" : "#2bb899",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {stage === "connecting" ? "INITIALIZING..." : "ONLINE"}
              </span>
            </div>
          </div>

          {/* AVATAR & TYPING AREA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "auto 0",
              padding: "0 32px",
            }}
          >
            {/* MINIMALIST AVATAR */}
            <div
              ref={avatarRef}
              className={
                stage === "connecting"
                  ? "avatar-border-neutral"
                  : "avatar-border-active"
              }
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 50% 30%, #1a1528, #09070e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                transition: "border 0.5s ease, box-shadow 0.5s ease",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="3.2"
                  fill={stage === "connecting" ? "#9ca3af" : "#2bb899"}
                  fillOpacity="0.85"
                  style={{ transition: "fill 0.5s ease" }}
                />
                <path
                  d="M5.5 18.5C5.5 15.4624 8.41015 13 12 13C15.5899 13 18.5 15.4624 18.5 18.5"
                  stroke={stage === "connecting" ? "#9ca3af" : "#2bb899"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ transition: "stroke 0.5s ease" }}
                />
              </svg>
            </div>

            {/* AUDIO EQUALIZER */}
            {stage === "welcoming" && !isTypingDone && (
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  height: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  className="eq-bar-subtle"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="eq-bar-subtle"
                  style={{ animationDelay: "0.3s" }}
                />
                <div
                  className="eq-bar-subtle"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="eq-bar-subtle"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            )}

            {/* STREAMING GREETING TEXT */}
            <div style={{ textAlign: "center", maxWidth: 500, minHeight: 72 }}>
              {stage === "connecting" ? (
                <p
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    letterSpacing: "0.02em",
                  }}
                >
                  Establishing encrypted candidate channel...
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: "#e5e7eb",
                    lineHeight: 1.65,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {typedText}
                  {!isTypingDone && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 4,
                        height: 12,
                        background: "#2bb899",
                        marginLeft: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </p>
              )}
            </div>

            {/* ACTION BUTTON WITH ENHANCED macOS HOVER STYLES */}
            <div style={{ marginTop: 24, minHeight: 44 }}>
              {isTypingDone && (
                <button
                  ref={buttonRef}
                  onClick={handleLaunchWorkspace}
                  onMouseEnter={() => setIsBtnHovered(true)}
                  onMouseLeave={() => setIsBtnHovered(false)}
                  style={{
                    background: isBtnHovered ? "#f59e0b" : "#f3f4f6",
                    color: "#09070e",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    padding: "12px 28px",
                    borderRadius: 8,
                    border: "1px solid",
                    cursor: "pointer",

                    transform: isBtnHovered
                      ? "translateY(-2px)"
                      : "translateY(0)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>ENTER WORKSPACE</span>
                  <span
                    style={{
                      display: "inline-block",
                      transform: isBtnHovered
                        ? "translateX(4px)"
                        : "translateX(0)",
                      transition:
                        "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    →
                  </span>
                </button>
              )}
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 10, color: "#4b5563" }}>
            Recruit.OS Assessment Environment
          </div>
        </div>

        {/* RIGHT HUD DIAGNOSTICS */}
        <div
          style={{
            background: "rgba(12, 10, 18, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 12,
            padding: 20,
            fontSize: 10,
            color: "#6b7280",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                color: "#2bb899",
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.05em",
              }}
            >
              ENVIRONMENT CHECKS
            </div>
            <div>[✓] IDE SYNC</div>
            <div style={{ marginTop: 2 }}>[✓] AUDIO HANDSHAKE</div>
            <div style={{ marginTop: 2 }}>[✓] TELEMETRY DOCK</div>
          </div>
          <hr
            style={{
              borderColor: "rgba(255,255,255,0.04)",
              width: "100%",
              margin: 0,
            }}
          />
          <div>
            <div
              style={{
                color: "#2bb899",
                fontWeight: 700,
                marginBottom: 6,
                letterSpacing: "0.05em",
              }}
            >
              SECURITY
            </div>
            <div>PROCTORING: ACTIVE</div>
            <div style={{ marginTop: 2 }}>ENCRYPTION: AES-256</div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10,
          color: "#4b5563",
          zIndex: 10,
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          paddingTop: 16,
        }}
      >
        <span>READY FOR EVALUATION</span>
        <span>CONFIDENTIAL ASSESSMENT</span>
      </div>
    </div>
  );
}
