import { useState } from "react";
import { techCatalog } from "../techCatalog";

const AMBER = "var(--amber)";
const PANEL_BG = "var(--surface-1)";
const BORDER = "var(--border)";
const ZONE_BG = "var(--surface-2)";

// Filter only the categories required for Mission 3
const MISSION_3_KEYS = [
  "ai_ml",
  "payments",
  "monitoring",
  "caching",
  "storage",
];

export default function Mission3Addons({
  onSave,
  initialSelections = {},
  whatsNew = null,
  submitLabel = "Save Mission 3 Selections",
}) {
  const [selections, setSelections] = useState(initialSelections);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Get catalog details for M3 categories
  const m3Categories = techCatalog.filter((cat) =>
    MISSION_3_KEYS.includes(cat.key),
  );

  const handleSelect = (categoryKey, optionId) => {
    setSelections((prev) => ({
      ...prev,
      [categoryKey]: optionId,
    }));
  };

  // Check if at least the core required categories (e.g., ai_ml and payments) are selected
  const isComplete = selections.ai_ml && selections.payments;

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const components = Object.entries(selections).map(
      ([categoryKey, optionId]) => {
        const cat = techCatalog.find((c) => c.key === categoryKey);
        const opt = cat?.options.find((o) => o.id === optionId);
        return {
          category: categoryKey,
          optionId,
          name: opt?.name,
          cost: opt?.cost || 0,
        };
      },
    );

    try {
      await onSave?.({ components, isAutosave: false });
    } catch (err) {
      setError(err?.message || "Failed to save selections.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* What's New Banner */}
      {whatsNew && (
        <div
          style={{
            background: "var(--violet-dim)",
            border: "1px solid var(--violet)",
            borderRadius: 10,
            padding: "12px 16px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--violet)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Mission 3 Goal
          </span>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "var(--text-primary)",
            }}
          >
            {whatsNew}
          </p>
        </div>
      )}

      {/* Category Selection Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {m3Categories.map((cat) => (
          <div
            key={cat.key}
            style={{
              background: PANEL_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                }}
              >
                {cat.label}
              </h4>
              {["ai_ml", "payments"].includes(cat.key) && (
                <span
                  style={{
                    fontSize: 10,
                    background: "var(--amber-dim)",
                    color: AMBER,
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  Required
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {cat.options.map((option) => {
                const isSelected = selections[cat.key] === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(cat.key, option.id)}
                    style={{
                      background: isSelected ? "var(--surface-3)" : ZONE_BG,
                      border: `1.5px solid ${isSelected ? AMBER : BORDER}`,
                      borderRadius: 8,
                      padding: 12,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {option.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--teal)",
                          fontWeight: 700,
                        }}
                      >
                        ${option.cost}/mo
                      </span>
                    </div>
                    {option.note && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                      >
                        {option.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ color: "var(--red)", fontSize: 13, padding: 8 }}>
          {error}
        </div>
      )}

      {/* Save Action */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          disabled={saving || !isComplete}
          className="btn-primary"
          style={{
            background: !isComplete ? "var(--surface-3)" : AMBER,
            color: !isComplete ? "var(--text-muted)" : "var(--bg-page)",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            cursor: !isComplete || saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
