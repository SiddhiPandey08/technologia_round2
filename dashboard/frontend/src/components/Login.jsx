import { useState } from "react";
import AuthBackdrop from "./AuthBackdrop.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Login({ onLoginSuccess }) {
  const [candidateId, setCandidateId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        return;
      }

      localStorage.setItem("recruitos_token", data.token);
      localStorage.setItem(
        "recruitos_candidate",
        JSON.stringify(data.candidate),
      );

      // Ensure an Attempt exists before the dashboard tries to load missions.
      // 400 here just means "already started" (returning candidate) — fine to ignore.
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
        return;
      }

      onLoginSuccess();
    } catch {
      setError("Couldn't reach the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthBackdrop>
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
          style={{
            width: "100%",
            maxWidth: 360,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "28px 26px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                fill="var(--amber)"
              />
              <path
                d="M8 16V8l4 5 4-5v8"
                stroke="#20140a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Recruit.OS
            </span>
          </div>

          <p
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
              margin: "0 0 4px",
            }}
          >
            engineering war room
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              margin: "0 0 20px",
            }}
          >
            Candidate sign in
          </h1>

          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "var(--text-secondary)",
              marginBottom: 6,
            }}
          >
            Candidate ID
          </label>
          <input
            type="text"
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
              style={{ fontSize: 12, color: "var(--red)", margin: "14px 0 0" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              background: "var(--amber)",
              color: "#20140a",
              border: "none",
              borderRadius: "var(--radius)",
              padding: "10px 18px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </AuthBackdrop>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--surface-1)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 14,
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
};
