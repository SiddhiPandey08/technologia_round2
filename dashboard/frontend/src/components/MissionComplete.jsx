import React, { useEffect, useState } from "react";
import GridScan from "./background/GridScan";

export default function MissionComplete() {
  const [statusStep, setStatusStep] = useState(0);

  // Sequences for animations
  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusStep((prev) => (prev < 5 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(statusTimer);
  }, []);

  const handleExit = () => {
    localStorage.removeItem("recruitos_token");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        /* Global & Background - Lock viewport */
        html, body { 
          margin: 0; 
          padding: 0; 
          width: 100vw; 
          height: 100vh; 
          overflow: hidden; 
          background-color: #05020a; 
          color: #fff; 
          font-family: system-ui, -apple-system, sans-serif;
        }

        .cyber-grid {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2;
          background-image: 
            linear-gradient(rgba(124, 58, 237, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.15) 1px, transparent 1px);
          background-size: 40px 40px;
          perspective: 1000px;
          opacity: 0.4;
        }
        .ambient-glow {
          position: fixed; top: -20vh; left: 20vw; width: 60vw; height: 60vh; z-index: -1;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(0,0,0,0) 70%);
          border-radius: 50%; filter: blur(60px);
        }

        /* Glassmorphism */
        .glass-card {
          background: rgba(15, 10, 30, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }
        .glass-card::before {
          content: ""; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,215,0,0.05), transparent);
          transform: skewX(-20deg); animation: shine 6s infinite;
        }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }

        .animate-fade-in { animation: fadeIn 1.2s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
        
        /* Delays */
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }

        /* Typography & Colors */
        .text-emerald { color: #10B981; text-shadow: 0 0 8px rgba(16,185,129,0.4); }
        .text-purple-primary { color: #A855F7; text-shadow: 0 0 8px rgba(168,85,247,0.4); }
        .text-purple-secondary { color: #8B5CF6; text-shadow: 0 0 8px rgba(139,92,246,0.4); }
        .text-gold { color: #FFD700; text-shadow: 0 0 8px rgba(255,215,0,0.4); }
        .text-green-neon { color: #22C55E; text-shadow: 0 0 10px rgba(34,197,94,0.6); }

        .chip-completed {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);
          padding: 3px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: bold;
          text-transform: uppercase; letter-spacing: 1px;
        }

        /* Buttons */
        .cyber-btn {
          background: transparent; color: #fff; font-weight: bold; letter-spacing: 1px;
          text-transform: uppercase; padding: 10px 24px; border-radius: 4px;
          cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .btn-primary {
          border: 1px solid #7C3AED; background: rgba(124, 58, 237, 0.15);
        }
        .btn-primary:hover {
          background: rgba(192, 132, 252, 0.4); box-shadow: 0 0 20px rgba(192, 132, 252, 0.6);
          border-color: #C084FC;
        }
      `}</style>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <GridScan />
      </div>

      <div className="cyber-grid"></div>
      <div className="ambient-glow"></div>

      {/* Main viewport container set strictly to 100vh with Flexbox */}
      <main
        className="relative z-10 animate-fade-in"
        style={{
          width: "100vw",
          height: "100vh",
          maxWidth: 1000,
          margin: "0 auto",
          padding: "20px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: "0.75rem", color: "#aaa", letterSpacing: 1 }}
            >
              TECHNOLOGIA 2.0
            </div>
            <div
              className="text-purple-secondary"
              style={{
                fontSize: "0.8rem",
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              OPERATION PHOENIX
            </div>
          </div>
          <div>
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid #10B981",
                color: "#10B981",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: "0.75rem",
                fontWeight: "bold",
                letterSpacing: 1,
                boxShadow: "0 0 10px rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  background: "#10B981",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px #10B981",
                }}
              ></span>
              PROJECT DEPLOYED
            </div>
          </div>
        </header>

        {/* Main Hero */}
        <div
          style={{ textAlign: "center" }}
          className="animate-slide-up delay-100"
        >
          <h1
            className="text-emerald"
            style={{
              fontSize: "clamp(1.8rem, 4vh, 2.8rem)",
              margin: "0 0 12px",
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            MISSION SUCCESSFUL
          </h1>

          <div
            className="glass-card animate-slide-up delay-600"
            style={{
              padding: "16px 20px",
              textAlign: "center",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <p style={{ fontSize: "1rem", margin: "0 0 8px", color: "#fff" }}>
              Your engineering simulation has been successfully completed.
            </p>
            <p style={{ fontSize: "0.9rem", color: "#aaa", margin: "0 0 6px" }}>
              Thank you for participating in{" "}
              <span className="text-purple-secondary">TECHNOLOGIA 2.0</span>.
            </p>
            <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>
              Qualified candidates will receive further communication regarding
              the next stage.
            </p>
          </div>
        </div>

        {/* Grid Cards Container */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {/* Mission Summary Card */}
          <div
            className="glass-card animate-slide-up delay-300"
            style={{ padding: 16 }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "0.95rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: 6,
                letterSpacing: 1,
              }}
              className="text-purple-secondary"
            >
              MISSION SUMMARY
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { n: 1, t: "Requirements Discovery" },
                { n: 2, t: "Architecture Foundation" },
                { n: 3, t: "System Expansion" },
                { n: 4, t: "Final Integration" },
              ].map((m) => (
                <div
                  key={m.n}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.3)",
                    padding: "8px 12px",
                    borderRadius: 6,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#888",
                        marginBottom: 2,
                      }}
                    >
                      Mission {m.n}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {m.t}
                    </div>
                  </div>
                  <div className="chip-completed">Completed</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status Card */}
          <div
            className="glass-card animate-slide-up delay-400"
            style={{ padding: 16 }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "0.95rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: 6,
                letterSpacing: 1,
                fontFamily: "monospace",
              }}
              className="text-purple-secondary"
            >
              &gt;_ SYSTEM STATUS
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: statusStep >= 1 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <span style={{ color: "#aaa" }}>Deployment Status</span>
                <span className="text-green-neon">SUCCESS</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: statusStep >= 2 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <span style={{ color: "#aaa" }}>Architecture Validation</span>
                <span className="text-emerald">PASSED</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: statusStep >= 3 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <span style={{ color: "#aaa" }}>System Health</span>
                <span style={{ color: "#fff" }}>100%</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: statusStep >= 4 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <span style={{ color: "#aaa" }}>Critical Errors</span>
                <span style={{ color: "#fff" }}>0</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: statusStep >= 5 ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
              >
                <span style={{ color: "#aaa" }}>Readiness</span>
                <span className="text-gold">Production Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div
          className="animate-slide-up delay-700"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button className="cyber-btn btn-primary" onClick={handleExit}>
            Exit Simulation
          </button>
        </div>
      </main>
    </>
  );
}
