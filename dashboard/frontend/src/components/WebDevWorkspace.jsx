import React, { useState } from "react";

const EXPANSION_MODULES = [
  {
    id: "ai-engine",
    name: "AI Recommendation Service",
    category: "Intelligence",
    color: "var(--purple, #a855f7)",
    description: "Personalized search & recommendation pipeline",
    requires: ["Python / FastAPI", "Vector DB (Milvus/PGVector)"],
  },
  {
    id: "payment-gw",
    name: "Payment Gateway",
    category: "Integrations",
    color: "var(--emerald, #10b981)",
    description: "Stripe/PayPal third-party checkout webhook handler",
    requires: ["Secure Webhooks", "PCI-DSS Compliant Layer"],
  },
  {
    id: "realtime-ws",
    name: "Real-Time Push Service",
    category: "Messaging",
    color: "var(--sky, #0284c7)",
    description: "WebSocket server for live status & chat updates",
    requires: ["Socket.io / WebSockets", "Redis Pub/Sub"],
  },
  {
    id: "analytics-db",
    name: "Analytics & Logging Dashboard",
    category: "Data & Ops",
    color: "var(--amber, #f59e0b)",
    description: "Clickstream tracking and asynchronous event analytics",
    requires: ["Kafka / Event Queue", "ClickHouse / OpenSearch"],
  },
];

export default function Mission3Workspace({ onComplete }) {
  const [activeServices, setActiveServices] = useState([]);
  const [serviceNotes, setServiceNotes] = useState({});

  const toggleService = (module) => {
    if (activeServices.some((s) => s.id === module.id)) {
      setActiveServices(activeServices.filter((s) => s.id !== module.id));
    } else {
      setActiveServices([...activeServices, module]);
    }
  };

  const handleNoteChange = (id, text) => {
    setServiceNotes((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmitExpansion = () => {
    if (onComplete) {
      onComplete({
        mission: "Mission 3 - System Expansion",
        expandedServices: activeServices.map((s) => ({
          name: s.name,
          category: s.category,
          integrationNotes: serviceNotes[s.id] || "No notes provided",
        })),
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-1, #1e1e2e)",
        border: "1px solid var(--border, #313244)",
        borderRadius: 12,
        padding: 24,
        color: "#cdd6f4",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header Context */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottom: "1px solid var(--border, #313244)",
          paddingBottom: 16,
        }}
      >
        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--amber, #f59e0b)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            TechNova Engineering Phase 3 · System Expansion
          </span>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, color: "#fff" }}>
            Expand Project Phoenix Architecture
          </h2>
        </div>
        <span style={{ fontSize: 12, color: "var(--text-muted, #a6adc8)" }}>
          Client Feature Request
        </span>
      </div>

      {/* Briefing Box */}
      <div
        style={{
          background: "rgba(245, 158, 11, 0.08)",
          padding: 16,
          borderRadius: 8,
          border: "1px solid rgba(245, 158, 11, 0.2)",
          marginBottom: 24,
        }}
      >
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#f9e2af" }}>
          Graduate Engineer Briefing:
        </h4>
        <p
          style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#bac2de" }}
        >
          The client has requested extended features for Project Phoenix. Select
          which new services to integrate into your existing foundation, and
          briefly describe how they communicate with your core system.
        </p>
      </div>

      {/* Module Selection Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {EXPANSION_MODULES.map((module) => {
          const isSelected = activeServices.some((s) => s.id === module.id);
          return (
            <div
              key={module.id}
              onClick={() => toggleService(module)}
              style={{
                background: isSelected
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${isSelected ? module.color : "var(--border, #313244)"}`,
                borderRadius: 8,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: module.color,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {module.category}
                </span>
                <input type="checkbox" checked={isSelected} readOnly />
              </div>
              <h4 style={{ margin: "6px 0 4px", fontSize: 15, color: "#fff" }}>
                {module.name}
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#a6adc8",
                  lineHeight: 1.4,
                }}
              >
                {module.description}
              </p>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {module.requires.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      color: "#cdd6f4",
                    }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale / Integration Details */}
      {activeServices.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 14, color: "#fff", marginBottom: 12 }}>
            Integration Justification &amp; Data Flow Notes
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeServices.map((service) => (
              <div key={service.id}>
                <label
                  style={{
                    fontSize: 12,
                    color: service.color,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  How does <strong>{service.name}</strong> connect to your core
                  API or database?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Connected via REST endpoint to Spring Boot / async Kafka topic..."
                  value={serviceNotes[service.id] || ""}
                  onChange={(e) => handleNoteChange(service.id, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 6,
                    background: "#11111b",
                    border: "1px solid #313244",
                    color: "#fff",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 16,
          borderTop: "1px solid #313244",
        }}
      >
        <span style={{ fontSize: 12, color: "#a6adc8" }}>
          {activeServices.length} expansion service(s) selected
        </span>
        <button
          onClick={handleSubmitExpansion}
          disabled={activeServices.length === 0}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            background:
              activeServices.length > 0 ? "var(--amber, #f59e0b)" : "#45475a",
            color: activeServices.length > 0 ? "#11111b" : "#fff",
            border: "none",
            cursor: activeServices.length > 0 ? "pointer" : "not-allowed",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Submit Expansion &amp; Proceed to Mission 4 →
        </button>
      </div>
    </div>
  );
}
