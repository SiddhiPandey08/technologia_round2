import { useEffect } from "react";

export default function ResourceModal({ resource, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!resource) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [resource, onClose]);

  if (!resource) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10, 7, 19, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "960px",
          height: "88vh",
          background: "var(--surface-1)",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            {resource.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "20px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, background: "var(--surface-2)" }}>
          {resource.type === "image" ? (
            <img
              src={resource.url}
              alt={resource.title}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <iframe
              src={resource.url}
              title={resource.title}
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          )}
        </div>

        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <a
            href={resource.url}
            download
            style={{
              color: "var(--amber)",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            Download original ↓
          </a>
        </div>
      </div>
    </div>
  );
}
