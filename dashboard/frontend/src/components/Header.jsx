export default function Header({
  candidateName = "Candidate",
  candidateId = "—",
  onLogout,
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0 20px",
        marginBottom: 16,
        borderBottom: "1px solid var(--border, #313244)",
      }}
    >
      {/* Candidate Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--amber, #f59e0b)",
            color: "#11111b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {candidateName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            {candidateName}
          </div>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--text-muted, #a6adc8)" }}
          >
            ID: {candidateId}
          </div>
        </div>
      </div>

      {/* Logout Action */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="btn-secondary"
          style={{
            background: "transparent",
            border: "1px solid var(--border-strong, #45475a)",
            color: "var(--text-secondary, #bac2de)",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Log Out
        </button>
      )}
    </header>
  );
}
