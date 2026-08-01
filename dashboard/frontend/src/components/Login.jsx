import { useState, useEffect } from "react";
import AuthBackdrop from "./AuthBackdrop.jsx";
import AccessPreloader from "./AccessPreloader.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const LAST_ID_KEY = "recruitos_last_candidate_id";

export default function Login({ onLoginSuccess }) {
  const [candidateId, setCandidateId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      return sessionStorage.getItem("recruitos_access_cleared") !== "1";
    } catch {
      return true;
    }
  });

  // Prefill the last-used candidate ID for repeat visits
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_ID_KEY);
      if (saved) setCandidateId(saved);
    } catch {
      // localStorage unavailable — skip prefill
    }
  }, []);

  function handlePreloaderComplete() {
    try {
      sessionStorage.setItem("recruitos_access_cleared", "1");
    } catch {
      // sessionStorage unavailable — just proceed without persisting
    }
    setShowPreloader(false);
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        triggerShake();
        return;
      }

      try {
        localStorage.setItem(LAST_ID_KEY, candidateId);
      } catch {
        // ignore
      }

      localStorage.setItem("recruitos_token", data.token);
      localStorage.setItem(
        "recruitos_candidate",
        JSON.stringify(data.candidate),
      );

      const startRes = await fetch(`${API_BASE}/api/missions/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });
      if (!startRes.ok && startRes.status !== 400) {
        const startErr = await startRes.json().catch(() => ({}));
        setError(startErr.error || "Could not start your attempt.");
        triggerShake();
        return;
      }

      onLoginSuccess();
    } catch {
      setError("Couldn't reach the server. Check that the backend is running.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthBackdrop>
      {showPreloader && (
        <AccessPreloader onComplete={handlePreloaderComplete} />
      )}

      <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-card-in {
          animation: loginFadeIn 460ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardShake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .login-card-shake {
          animation: cardShake 420ms ease;
        }
        .flowing-wordmark-sm {
          background: linear-gradient(90deg, var(--gold), var(--violet), var(--gold-bright), var(--violet), var(--gold));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: wordmark-flow-sm 6s linear infinite;
        }
        @keyframes wordmark-flow-sm {
          0% { background-position: 0% 50%; }
          100% { background-position: -300% 50%; }
        }
        .candidate-input {
          transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .candidate-input:focus {
          outline: none;
          border-color: var(--violet) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.18);
        }
        .signin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: filter 150ms ease, transform 150ms ease;
        }
        .signin-btn:not(:disabled):hover {
          filter: brightness(1.06);
        }
        .signin-btn:not(:disabled):active {
          transform: scale(0.98);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid rgba(32, 20, 10, 0.35);
          border-top-color: #20140a;
          animation: spin 700ms linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .login-card-in, .login-card-shake, .flowing-wordmark-sm, .spinner {
            animation: none !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <form
          onSubmit={handleSubmit}
          className={`${showPreloader ? "" : "login-card-in"} ${shake ? "login-card-shake" : ""}`}
          style={{
            width: "100%",
            maxWidth: 360,
            /* Backdrop blur and semi-transparency so Lightfall looks great underneath */
            background: "rgba(18, 18, 24, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 12,
            padding: "28px 26px",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <span
              className="mono flowing-wordmark-sm"
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "0.005em",
              }}
            >
              TECHNOLOGIA 2.0
            </span>
          </div>

          <p
            className="mono"
            style={{
              fontSize: 11,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "0.04em",
              margin: "0 0 4px",
            }}
          >
            engineering war room · clearance required
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              margin: "0 0 6px",
              color: "#ffffff",
            }}
          >
            Candidate sign in
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.5)",
              margin: "0 0 20px",
              lineHeight: 1.5,
            }}
          >
            Enter your candidate ID to enter Mission Control.
          </p>

          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: 6,
            }}
          >
            Candidate ID
          </label>
          <input
            type="text"
            className="candidate-input"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            placeholder="TN-0001"
            autoComplete="username"
            required
            style={inputStyle}
          />

          {error && (
            <p
              role="alert"
              style={{ fontSize: 12, color: "#ff6b6b", margin: "14px 0 0" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="signin-btn"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              background: "var(--amber, #f59e0b)",
              color: "#20140a",
              border: "none",
              borderRadius: "var(--radius, 8px)",
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              opacity: loading ? 0.85 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading && <span className="spinner" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </AuthBackdrop>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255, 255, 255, 0.07)",
  border: "1px solid #f59e0b",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 14,
  color: "#ffffff",
  fontFamily: "var(--font-body)",
};
