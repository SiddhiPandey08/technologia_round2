import React from "react";

export default function MissionBriefing({ mission, onEnter, attemptExpired }) {
  if (!mission) return null;

  // Ensure objectives is always treated as an array
  const objectives = Array.isArray(mission.objectives)
    ? mission.objectives
    : typeof mission.objectives === "string"
      ? [mission.objectives]
      : [];

  return (
    <div
      style={{
        background: "var(--surface-2, #181825)",
        border: "1px solid var(--border, #313244)",
        borderRadius: 12,
        padding: "22px 24px",
        color: "#cdd6f4",
      }}
    >
      {/* Top Meta Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--amber, #f59e0b)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          TechNova Engineering Briefing · Phase{" "}
          {String(mission.number || 1).padStart(2, "0")}
        </span>
        {mission.subtitle && (
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--text-muted, #a6adc8)" }}
          >
            {mission.subtitle}
          </span>
        )}
      </div>

      {/* Mission Title */}
      <h2
        style={{
          fontFamily: "var(--font-display, inherit)",
          fontSize: 22,
          fontWeight: 600,
          margin: "4px 0 10px",
          color: "#fff",
        }}
      >
        {mission.title}
      </h2>

      {/* Narrative Scenario / Context */}
      <p
        style={{
          fontSize: 14,
          color: "#bac2de",
          lineHeight: 1.6,
          margin: "0 0 18px",
          maxWidth: 620,
        }}
      >
        {mission.scenario}
      </p>

      {/* Mission Objectives */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 22,
        }}
      >
        {objectives.length > 0 ? (
          objectives.map((task, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: "#cdd6f4",
              }}
            >
              <span
                className="mono"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: "1px solid var(--border-strong, #45475a)",
                  background: "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--amber, #f59e0b)",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span style={{ lineHeight: 1.4 }}>{task}</span>
            </div>
          ))
        ) : (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted, #a6adc8)",
              fontStyle: "italic",
            }}
          >
            No specific objectives defined for this engineering phase.
          </p>
        )}
      </div>
      <button
        className="btn-primary"
        disabled={attemptExpired || mission.status === "complete"}
        onClick={() => onEnter(mission)}
        style={{
          background:
            attemptExpired || mission.status === "complete"
              ? "var(--border-strong, #45475a)"
              : "var(--amber, #f59e0b)",
          color:
            attemptExpired || mission.status === "complete"
              ? "var(--text-muted, #a6adc8)"
              : "#11111b",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "var(--font-display, inherit)",
          cursor:
            attemptExpired || mission.status === "complete"
              ? "not-allowed"
              : "pointer",
          transition: "opacity 0.15s ease",
        }}
      >
        {mission.status === "complete"
          ? "✓ Phase Completed"
          : attemptExpired
            ? "Attempt Expired"
            : `Launch Phase ${mission.number} Workspace →`}
      </button>
    </div>
  );
}
