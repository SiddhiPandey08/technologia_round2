import { useState } from "react";

const OPTIONS = [
  {
    id: 1,
    label: "Load balancer misconfiguration",
    correct: false,
  },
  {
    id: 2,
    label: "Application servers lack CPU capacity",
    correct: false,
  },
  {
    id: 3,
    label: "Checkout → Inventory queue backing up",
    correct: false,
  },
  {
    id: 4,
    label:
      "No caching layer causing database connection pool exhaustion under heavy read traffic",
    correct: true,
  },
];

export default function IncidentDiagnosis({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");

  function handleSubmit() {
    const answer = OPTIONS.find((o) => o.id === selected);

    if (!answer) return;

    if (answer.correct) {
      onComplete({
        rootCause: "cache",
        answerLabel:
          "Introduce a caching layer to reduce database reads and prevent DB connection pool exhaustion.",
      });
      return;
    }

    if (attempts >= 1) {
      onComplete({
        rootCause: "cache",
        answerLabel:
          "Introduce a caching layer to reduce database reads and prevent DB connection pool exhaustion.",
      });
      return;
    }

    setAttempts((a) => a + 1);

    setFeedback(
      "Incorrect. Compare which services remain healthy (Cart/Auth) with those failing (Catalog/Search). The infrastructure isn't overloaded—the database is.",
    );
  }

  return (
    <div
      style={{
        maxWidth: 950,
        margin: "0 auto",
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20,
          background: "var(--surface-1)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: 10,
            fontFamily: "var(--font-display)",
          }}
        >
          Mission 2 · Production Incident
        </h2>

        <p
          style={{
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          The stress test has failed. Study the evidence collected by the
          engineering team and identify the architectural flaw before
          redesigning the system.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        }}
      >
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 18,
            background: "var(--surface-1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>📄 Server Logs</h3>

          <pre
            style={{
              fontSize: 12,
              whiteSpace: "pre-wrap",
              color: "var(--text-secondary)",
            }}
          >
            {`11:42:13  GET /catalog       504 Gateway Timeout
11:42:15  GET /products      504 Gateway Timeout
11:42:16  DB_POOL exhausted
11:42:18  Connection timeout

GET /cart          200
GET /auth/profile  200`}
          </pre>
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 18,
            background: "var(--surface-1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>📊 Monitoring Dashboard</h3>

          <table
            style={{
              width: "100%",
              fontSize: 13,
            }}
          >
            <tbody>
              <tr>
                <td>CPU Usage</td>
                <td>42%</td>
              </tr>

              <tr>
                <td>Memory Usage</td>
                <td>61%</td>
              </tr>

              <tr>
                <td>DB Connections</td>
                <td style={{ color: "#ff6464", fontWeight: 700 }}>100%</td>
              </tr>

              <tr>
                <td>Catalog API</td>
                <td>5.9 s</td>
              </tr>

              <tr>
                <td>Search API</td>
                <td>6.3 s</td>
              </tr>

              <tr>
                <td>Cart API</td>
                <td>170 ms</td>
              </tr>

              <tr>
                <td>Authentication</td>
                <td>120 ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 18,
            background: "var(--surface-1)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>📑 Performance Report</h3>

          <ul
            style={{
              marginBottom: 0,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
            }}
          >
            <li>Database connection pool saturated.</li>

            <li>Repeated read queries hitting database.</li>

            <li>No caching layer detected.</li>

            <li>Load balancer operating normally.</li>

            <li>Application servers below 50% CPU.</li>

            <li>Checkout queue operating normally.</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 20,
          background: "var(--surface-1)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Diagnose the most likely root cause</h3>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 20,
          }}
        >
          Which explanation best matches every piece of evidence?
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {OPTIONS.map((option) => (
            <label
              key={option.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 14,
                cursor: "pointer",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <input
                type="radio"
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {feedback && (
          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 8,
              background: "rgba(255,170,0,.08)",
              border: "1px solid rgba(255,170,0,.4)",
              color: "var(--text-secondary)",
            }}
          >
            <strong>Hint:</strong> {feedback}
          </div>
        )}

        {attempts >= 1 && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 8,
              background: "rgba(120,220,120,.08)",
              border: "1px solid rgba(120,220,120,.4)",
            }}
          >
            <strong>Investigation Summary</strong>

            <p style={{ marginBottom: 0 }}>
              The database became saturated because every read request was
              directly reaching it. Introducing a caching layer reduces repeated
              database reads and prevents connection pool exhaustion.
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 24,
          }}
        >
          <button
            className="btn-primary"
            disabled={!selected}
            onClick={handleSubmit}
          >
            Continue to Architecture Builder →
          </button>
        </div>
      </div>
    </div>
  );
}
