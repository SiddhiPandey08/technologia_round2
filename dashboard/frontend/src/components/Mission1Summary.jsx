// Mission1Summary.jsx
import { techCatalog } from "../techCatalog";

export default function Mission1Summary({ mission1Selections = {} }) {
  // Extract and format selections
  const selectedItems = Object.entries(mission1Selections)
    .map(([categoryKey, optionId]) => {
      const category = techCatalog.find((c) => c.key === categoryKey);
      const option = category?.options.find((o) => o.id === optionId);
      return {
        categoryLabel: category?.label || categoryKey,
        optionName: option?.name,
        cost: option?.cost || 0,
      };
    })
    .filter((item) => item.optionName); // Only keep configured selections

  if (selectedItems.length === 0) {
    return (
      <div
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        No prior selections recorded from Mission 1.
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}
    >
      {selectedItems.map((item, idx) => (
        <div
          key={idx}
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--text-muted)",
                fontWeight: 700,
              }}
            >
              {item.categoryLabel}
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginTop: 2,
              }}
            >
              {item.optionName}
            </div>
          </div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--teal)",
            }}
          >
            ${item.cost}/mo
          </span>
        </div>
      ))}
    </div>
  );
}
