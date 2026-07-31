import React, { useState } from "react";

const AVAILABLE_COMPONENTS = [
  {
    id: "frontend-react",
    name: "React Web App",
    category: "Frontend",
    color: "var(--cyan, #06b6d4)",
  },
  {
    id: "frontend-mobile",
    name: "React Native Mobile",
    category: "Frontend",
    color: "var(--cyan, #06b6d4)",
  },
  {
    id: "backend-spring",
    name: "Spring Boot API",
    category: "Backend",
    color: "var(--violet, #8b5cf6)",
  },
  {
    id: "backend-node",
    name: "Node.js Express",
    category: "Backend",
    color: "var(--violet, #8b5cf6)",
  },
  {
    id: "db-postgres",
    name: "PostgreSQL DB",
    category: "Database",
    color: "var(--green, #10b981)",
  },
  {
    id: "db-mongo",
    name: "MongoDB NoSQL",
    category: "Database",
    color: "var(--green, #10b981)",
  },
  {
    id: "auth-jwt",
    name: "Auth0 / JWT Auth",
    category: "Security",
    color: "var(--amber, #f59e0b)",
  },
  {
    id: "notify-service",
    name: "Email/SMS Service",
    category: "Messaging",
    color: "var(--pink, #ec4899)",
  },
];

export default function Mission2Workspace({ onComplete }) {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedForConnect, setSelectedForConnect] = useState(null);

  // Toggle selecting a component into the Canvas
  const handleToggleComponent = (comp) => {
    if (selectedComponents.some((c) => c.id === comp.id)) {
      setSelectedComponents(selectedComponents.filter((c) => c.id !== comp.id));
      setConnections(
        connections.filter(
          (conn) => conn.from !== comp.id && conn.to !== comp.id,
        ),
      );
    } else {
      setSelectedComponents([...selectedComponents, comp]);
    }
  };

  // Connect two nodes visually
  const handleNodeClick = (comp) => {
    if (!selectedForConnect) {
      setSelectedForConnect(comp);
    } else if (selectedForConnect.id === comp.id) {
      setSelectedForConnect(null);
    } else {
      const newConn = { from: selectedForConnect.id, to: comp.id };
      const exists = connections.some(
        (c) =>
          (c.from === newConn.from && c.to === newConn.to) ||
          (c.from === newConn.to && c.to === newConn.from),
      );
      if (!exists) {
        setConnections([...connections, newConn]);
      }
      setSelectedForConnect(null);
    }
  };

  const handleClearCanvas = () => {
    setSelectedComponents([]);
    setConnections([]);
    setSelectedForConnect(null);
  };

  const handleSubmitFoundation = () => {
    if (onComplete) {
      onComplete({
        mission: "Mission 2 - Architecture Foundation",
        placedComponents: selectedComponents.map((c) => c.name),
        logicalConnections: connections,
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
              color: "var(--violet, #8b5cf6)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            TechNova Engineering Phase 2 · Architecture Foundation
          </span>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, color: "#fff" }}>
            Build the Core System Foundation
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted, #a6adc8)" }}>
            Project Phoenix Design Board
          </span>
        </div>
      </div>

      {/* Briefing Box */}
      <div
        style={{
          background: "rgba(139, 92, 246, 0.08)",
          padding: 16,
          borderRadius: 8,
          border: "1px solid rgba(139, 92, 246, 0.2)",
          marginBottom: 24,
        }}
      >
        <h4 style={{ margin: "0 0 6px", fontSize: 14, color: "#cba6f7" }}>
          Graduate Engineer Task Instructions:
        </h4>
        <p
          style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#bac2de" }}
        >
          Select core components from the palette below to place them onto your
          Architecture Canvas. Click on any placed node and then another to
          create logical data flow connections (e.g., Client → API → Database).
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}
      >
        {/* Component Palette Sidebar */}
        <div>
          <h3
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#a6adc8",
              marginBottom: 12,
            }}
          >
            Component Palette
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {AVAILABLE_COMPONENTS.map((comp) => {
              const isSelected = selectedComponents.some(
                (c) => c.id === comp.id,
              );
              return (
                <button
                  key={comp.id}
                  onClick={() => handleToggleComponent(comp)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 6,
                    background: isSelected
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isSelected ? comp.color : "var(--border, #313244)"}`,
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {comp.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.08)",
                      color: comp.color,
                    }}
                  >
                    {isSelected ? "Placed" : "+ Add"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Architecture Canvas */}
        <div
          style={{
            background: "#11111b",
            border: "1px dashed var(--border, #45475a)",
            borderRadius: 8,
            padding: 20,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 12, color: "#a6adc8" }}>
                Canvas Area ({selectedComponents.length} Components Placed,{" "}
                {connections.length} Connections)
              </span>
              {selectedComponents.length > 0 && (
                <button
                  onClick={handleClearCanvas}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f38ba8",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Clear Canvas
                </button>
              )}
            </div>

            {selectedComponents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "#6c7086",
                }}
              >
                <p style={{ fontSize: 14 }}>Canvas is empty.</p>
                <p style={{ fontSize: 12 }}>
                  Click components from the left palette to build your core
                  foundation.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 11, color: "#89b4fa", marginBottom: 12 }}>
                  * Click a component to start connecting it to another
                  component.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {selectedComponents.map((comp) => {
                    const isConnecting = selectedForConnect?.id === comp.id;
                    return (
                      <div
                        key={comp.id}
                        onClick={() => handleNodeClick(comp)}
                        style={{
                          padding: "12px 18px",
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.05)",
                          border: `2px solid ${isConnecting ? "#f9e2af" : comp.color}`,
                          cursor: "pointer",
                          boxShadow: isConnecting
                            ? "0 0 12px rgba(249, 226, 175, 0.4)"
                            : "none",
                          userSelect: "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            color: comp.color,
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          {comp.category}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#fff",
                            marginTop: 2,
                          }}
                        >
                          {comp.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* List Active Connections */}
                {connections.length > 0 && (
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: "1px solid #313244",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#a6adc8",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Configured Connections:
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {connections.map((conn, idx) => {
                        const fromNode = selectedComponents.find(
                          (c) => c.id === conn.from,
                        );
                        const toNode = selectedComponents.find(
                          (c) => c.id === conn.to,
                        );
                        return (
                          <span
                            key={idx}
                            style={{
                              fontSize: 11,
                              padding: "4px 8px",
                              borderRadius: 4,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid #45475a",
                            }}
                          >
                            {fromNode?.name} → {toNode?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
              paddingTop: 16,
              borderTop: "1px solid #313244",
            }}
          >
            <span style={{ fontSize: 12, color: "#a6adc8" }}>
              Ready to submit your core architecture design for manual
              evaluation by TechNova leads?
            </span>
            <button
              onClick={handleSubmitFoundation}
              disabled={selectedComponents.length === 0}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                background:
                  selectedComponents.length > 0
                    ? "var(--violet, #8b5cf6)"
                    : "#45475a",
                color: "#fff",
                border: "none",
                cursor:
                  selectedComponents.length > 0 ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Complete Foundation &amp; Proceed to Mission 3 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
