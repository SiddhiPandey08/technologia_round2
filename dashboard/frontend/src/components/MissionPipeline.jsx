import React from "react";

function LockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-muted, #6c7086)"
      strokeWidth="2"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function MissionCard({ mission, isSelected, onSelect }) {
  const { number, title, subtitle, status } = mission;
  const locked = status === "locked";
  const complete = status === "complete";
  const active = status === "active";

  const accent = complete
    ? "var(--green, #10b981)"
    : active
      ? "var(--amber, #f59e0b)"
      : "var(--text-muted, #6c7086)";

  const accentDim = complete
    ? "rgba(16, 185, 129, 0.15)"
    : active
      ? "rgba(245, 158, 11, 0.15)"
      : "transparent";

  return (
    <button
      className="mission-card"
      onClick={() => !locked && onSelect(mission)}
      disabled={locked}
      style={{
        flex: 1,
        minWidth: 150,
        textAlign: "left",
        background: locked
          ? "var(--surface-1, #11111b)"
          : isSelected
            ? "rgba(255, 255, 255, 0.04)"
            : "var(--surface-2, #181825)",
        border: `1px solid ${isSelected ? accent : "var(--border, #313244)"}`,
        borderRadius: 8,
        padding: "14px 16px",
        color: "inherit",
        transition: "border-color 120ms ease, background 120ms ease",
        cursor: locked ? "not-allowed" : "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-muted, #a6adc8)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Phase {String(number).padStart(2, "0")}
        </span>
        {locked ? (
          <LockIcon />
        ) : (
          <span
            className="mono"
            style={{
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 20,
              background: accentDim,
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.03em",
            }}
          >
            {complete ? "Complete" : "In Progress"}
          </span>
        )}
      </div>

      {locked ? (
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display, inherit)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-muted, #6c7086)",
            }}
          >
            Phase Locked
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 11,
              color: "var(--text-muted, #6c7086)",
            }}
          >
            Requires Phase {number - 1} completion
          </p>
        </div>
      ) : (
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-display, inherit)",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "var(--text-secondary, #bac2de)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </p>
        </div>
      )}
    </button>
  );
}

export default function MissionPipeline({ missions, selectedId, onSelect }) {
  return (
    <div
      className="pipeline-row"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 6,
        padding: "4px 0",
      }}
    >
      {missions.map((mission, i) => (
        <div
          key={mission.id || mission.number}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
            minWidth: 0,
          }}
        >
          <MissionCard
            mission={mission}
            isSelected={selectedId ? mission.id === selectedId : false}
            onSelect={onSelect}
          />
          {i < missions.length - 1 && (
            <svg
              className="pipeline-arrow"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--border-strong, #45475a)"
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
