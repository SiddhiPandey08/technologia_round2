import { useState, useEffect, useRef } from "react";

export default function DiscoveryWorkspace({ onComplete, onAutosave }) {
  const [frontend, setFrontend] = useState("");
  const [database, setDatabase] = useState("");
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceRef = useRef(null);
  const isSubmittingRef = useRef(false); // ← add this

  // Autosave whatever's currently filled in, 1.5s after the last edit.
  useEffect(() => {
    if (!frontend && !database && !justification.trim()) return;
    if (isSubmittingRef.current) return; // ← don't schedule autosave mid-submit

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onAutosave?.({ frontend, database, justification });
    }, 1500);
    return () => clearTimeout(debounceRef.current);
  }, [frontend, database, justification, onAutosave]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!frontend || !database || !justification.trim()) {
      alert(
        "Please select all options and provide an engineering justification.",
      );
      return;
    }

    // Cancel any pending autosave so it can't race the submit's own save.
    clearTimeout(debounceRef.current);
    isSubmittingRef.current = true;

    setIsSubmitting(true);
    try {
      await onComplete({ frontend, database, justification });
    } catch (err) {
      console.error(err);
      isSubmittingRef.current = false; // allow autosave again if submit failed
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--violet)",
              textTransform: "uppercase",
            }}
          >
            MISSION 01
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 0" }}>
            Requirement Analysis
          </h2>
        </div>
        <span
          style={{
            fontSize: 11,
            background: "var(--border)",
            padding: "4px 10px",
            borderRadius: 12,
            color: "var(--text-secondary)",
          }}
        >
          Discovery Phase
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 20,
        }}
      >
        Select the technology stack based on the client's functional and
        non-functional requirements.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Primary Frontend Framework
          </label>
          <select
            value={frontend}
            onChange={(e) => setFrontend(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-primary)",
            }}
          >
            <option value="">Choose Framework</option>
            <option value="fe-react-cdn">
              React / Next.js SPA (CDN Hosted)
            </option>
            <option value="fe-vue">Vue.js / Nuxt.js Single Page App</option>
            <option value="fe-angular">Angular Enterprise Platform</option>
            <option value="fe-svelte">SvelteKit Lightweight Web App</option>
            <option value="fe-monolith">
              Server-Rendered Templates (Monolithic UI)
            </option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Core Database Engine
          </label>
          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-primary)",
            }}
          >
            <option value="">Choose Database</option>
            <option value="db-postgres">
              Managed PostgreSQL (Relational / ACID Compliant)
            </option>
            <option value="db-medium-replica">
              Managed Relational DB — Medium + Read Replica
            </option>
            <option value="db-large">
              Managed Relational DB — Multi-AZ + 2 Replicas
            </option>
            <option value="db-nosql">
              Managed NoSQL Document Store (MongoDB / DynamoDB)
            </option>
            <option value="db-redis-hybrid">
              In-Memory Key-Value & Document Hybrid
            </option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Engineering Justification
          </label>
          <textarea
            rows={5}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Explain why your chosen technologies satisfy scalability, maintainability, security, deployment, and client requirements..."
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "var(--bg-page)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--text-primary)",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            marginTop: 8,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Analysis →"}
        </button>
      </form>
    </div>
  );
}
