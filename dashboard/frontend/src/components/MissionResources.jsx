const ICONS = {
  document: (
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h8 M8 9h2" />
  ),
  image: (
    <path d="M4 4h16v16H4z M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3 M21 15l-5-5L5 21" />
  ),
  logs: <path d="M4 4h16v16H4z M8 9h8 M8 13h5 M8 17h8" />,
  dashboard: <path d="M4 4h16v16H4z M8 16v-4 M12 16v-8 M16 16v-6" />,
  email: <path d="M4 6h16v12H4z M4 6l8 7 8-7" />,
  checklist: <path d="M4 4h16v16H4z M8 9l1.5 1.5L12 8 M8 15h8 M8 12h1" />,
};

function ResourceIcon({ type }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[type] || ICONS.document}
    </svg>
  );
}

export default function MissionResources({ mission, onOpenResource }) {
  const resources = mission?.resources || [];

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "18px 20px",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--amber)",
            display: "inline-block",
          }}
        />
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-secondary)",
            letterSpacing: "0.04em",
          }}
        >
          mission resources
        </span>
      </div>

      {resources.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          Nothing to review yet for this mission.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {resources.map((res, i) => (
            <button
              key={i}
              className="resource-row"
              onClick={() => onOpenResource?.(res)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "9px 10px",
                color: "var(--text-primary)",
              }}
            >
              <span
                style={{
                  color: "var(--text-muted)",
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: "var(--surface-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ResourceIcon type={res.type} />
              </span>
              <span style={{ fontSize: 13, flex: 1 }}>{res.title}</span>
              <span
                className="mono"
                style={{ fontSize: 10, color: "var(--text-muted)" }}
              >
                {res.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
