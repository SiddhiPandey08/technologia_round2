import { useEffect, useMemo, useState } from "react";
import { techCatalog, BUDGET_CAP } from "../techCatalog";

const AMBER = "var(--amber)";
const RED = "var(--red)";
const GREEN = "var(--teal)";
const PANEL_BG = "var(--surface-1)";
const BORDER = "var(--border)";
const ZONE_BG = "var(--surface-2)";

function findOption(categoryKey, optionId) {
  const category = techCatalog.find((c) => c.key === categoryKey);
  return category?.options.find((o) => o.id === optionId) || null;
}

export default function ArchitectureBuilder({
  onSave,
  initialSelections = {},
  initialDeploymentPlan = { rollout: "", rollback: "", monitoring: "" },
  showDeploymentPlan = false,
  submitLabel = "Save architecture v1",
  whatsNew = null,
  additionalRequiredCategories = [],
  allowedCategories = [],
}) {
  const [selections, setSelections] = useState(initialSelections);
  const [baseline, setBaseline] = useState(initialSelections);
  const [dragOverKey, setDragOverKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [rollout, setRollout] = useState(initialDeploymentPlan.rollout || "");
  const [rollback, setRollback] = useState(
    initialDeploymentPlan.rollback || "",
  );
  const [monitoring, setMonitoring] = useState(
    initialDeploymentPlan.monitoring || "",
  );

  // Strict filtering: If allowedCategories is provided, ONLY render those keys.
  const visibleCategories = useMemo(() => {
    if (!allowedCategories || allowedCategories.length === 0) {
      return techCatalog;
    }
    return techCatalog.filter((cat) => allowedCategories.includes(cat.key));
  }, [allowedCategories]);

  // Tracks which categories are collapsed; initialized to collapse all visible categories by default
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    return visibleCategories.reduce((acc, cat) => {
      acc[cat.key] = true;
      return acc;
    }, {});
  });

  function toggleCategory(categoryKey) {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }

  useEffect(() => {
    if (initialSelections && Object.keys(initialSelections).length > 0) {
      setSelections(initialSelections);
      setBaseline(initialSelections);
    } else {
      setSelections({});
      setBaseline({});
    }
  }, [JSON.stringify(initialSelections)]);

  useEffect(() => {
    if (initialDeploymentPlan?.rollout)
      setRollout(initialDeploymentPlan.rollout);
    if (initialDeploymentPlan?.rollback)
      setRollback(initialDeploymentPlan.rollback);
    if (initialDeploymentPlan?.monitoring)
      setMonitoring(initialDeploymentPlan.monitoring);
  }, [initialDeploymentPlan]);

  const hasBaseline = Object.keys(baseline).length > 0;

  // Compute total cost ONLY for the currently visible categories
  const totalCost = useMemo(() => {
    return visibleCategories.reduce((sum, cat) => {
      const optionId = selections[cat.key];
      if (!optionId) return sum;
      const opt = findOption(cat.key, optionId);
      return sum + (opt?.cost || 0);
    }, 0);
  }, [selections, visibleCategories]);

  const requiredCategories = visibleCategories.filter(
    (c) => c.required || additionalRequiredCategories.includes(c.key),
  );

  const filledRequired = requiredCategories.filter(
    (c) => selections[c.key],
  ).length;

  const deploymentPlanFilled =
    !showDeploymentPlan ||
    (rollout.trim() && rollback.trim() && monitoring.trim());

  const allRequiredFilled =
    filledRequired === requiredCategories.length && deploymentPlanFilled;

  const overBudget = totalCost > BUDGET_CAP;

  function handleDragStart(e, categoryKey, optionId) {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ categoryKey, optionId }),
    );
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(e, zoneCategoryKey) {
    e.preventDefault();
    setDragOverKey(null);
    let payload;
    try {
      payload = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }
    if (!payload || payload.categoryKey !== zoneCategoryKey) return;
    setSelections((prev) => ({ ...prev, [zoneCategoryKey]: payload.optionId }));
  }

  function handleRemove(categoryKey) {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[categoryKey];
      return next;
    });
  }

  async function handleSave() {
    const components = visibleCategories
      .filter((cat) => selections[cat.key])
      .map((cat) => {
        const optionId = selections[cat.key];
        const opt = findOption(cat.key, optionId);
        return {
          category: cat.key,
          optionId,
          name: opt?.name,
          cost: opt?.cost || 0,
        };
      });

    const payload = {
      components,
      connections: [],
      isAutosave: false,
      ...(showDeploymentPlan
        ? { deploymentPlan: { rollout, rollback, monitoring } }
        : {}),
    };

    setSaving(true);
    setSaveError(null);
    try {
      await onSave?.(payload);
    } catch (err) {
      setSaveError(err?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {whatsNew && (
        <div
          style={{
            background: "var(--violet-dim)",
            border: "1px solid var(--violet)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
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
            What's new this mission
          </span>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: "var(--text-primary)",
              lineHeight: 1.5,
            }}
          >
            {whatsNew}
          </p>
        </div>
      )}

      {/* Top Bar */}
      <div
        style={{
          background: PANEL_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Estimated Monthly Spend
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: overBudget ? RED : GREEN,
                fontFamily: "var(--font-display)",
              }}
            >
              ${totalCost.toLocaleString()}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              / ${BUDGET_CAP.toLocaleString()} cap
            </span>
          </div>
        </div>

        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Required Layers
          </span>
          <div
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            {filledRequired} / {requiredCategories.length} configured
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !allRequiredFilled || overBudget}
          className="btn-primary"
          style={{
            background:
              !allRequiredFilled || overBudget ? "var(--surface-3)" : AMBER,
            color:
              !allRequiredFilled || overBudget
                ? "var(--text-muted)"
                : "var(--bg-page)",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 700,
            cursor:
              !allRequiredFilled || overBudget || saving
                ? "not-allowed"
                : "pointer",
          }}
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>

      {saveError && (
        <div
          style={{
            background: "var(--red-dim)",
            border: `1px solid ${RED}`,
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: RED,
          }}
        >
          {saveError}
        </div>
      )}

      {/* Main Canvas + Inventory Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* Drop Canvas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visibleCategories.map((cat) => {
            const key = cat.key;
            const selectedOptId = selections[key];
            const currentOpt = findOption(key, selectedOptId);
            const baselineOptId = baseline[key];
            const isModified = hasBaseline && selectedOptId !== baselineOptId;
            const isDragOver = dragOverKey === key;
            const isReq =
              cat.required || additionalRequiredCategories.includes(key);

            return (
              <div
                key={key}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleDrop(e, key)}
                style={{
                  background: isDragOver ? "var(--surface-3)" : ZONE_BG,
                  border: `1.5px dashed ${
                    isDragOver
                      ? AMBER
                      : currentOpt
                        ? "var(--border-strong)"
                        : BORDER
                  }`,
                  borderRadius: 10,
                  padding: 14,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: currentOpt ? 10 : 0,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {cat.label}
                    </span>
                    {isReq && (
                      <span
                        style={{
                          fontSize: 10,
                          background: "var(--amber-dim)",
                          color: AMBER,
                          padding: "2px 6px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        Required
                      </span>
                    )}
                  </div>
                  {currentOpt && (
                    <button
                      onClick={() => handleRemove(key)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                {currentOpt ? (
                  <div
                    style={{
                      background: PANEL_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      padding: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {currentOpt.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {currentOpt.note}
                      </div>
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: GREEN,
                        marginLeft: 12,
                      }}
                    >
                      ${currentOpt.cost}/mo
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "16px 0",
                      textAlign: "center",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    Drop {cat.label.toLowerCase()} option here
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inventory Palette Panel */}
        <div
          style={{
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 16,
            position: "sticky",
            top: 60,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "0 0 4px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            Technology catalogue
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              margin: "0 0 16px",
            }}
          >
            Drag an option into the matching slot on the left.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {visibleCategories.map((cat) => {
              const isCollapsed = collapsedCategories[cat.key];

              return (
                <div key={cat.key}>
                  <div
                    onClick={() => toggleCategory(cat.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: 8,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {isCollapsed ? "►" : "▼"}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {cat.options.map((option) => {
                        const isSelected = selections[cat.key] === option.id;

                        return (
                          <div
                            key={option.id}
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, cat.key, option.id)
                            }
                            style={{
                              background: isSelected
                                ? "var(--surface-3)"
                                : ZONE_BG,
                              border: `1px solid ${
                                isSelected ? AMBER : BORDER
                              }`,
                              borderRadius: 8,
                              padding: 10,
                              cursor: "grab",
                              opacity: isSelected ? 0.6 : 1,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
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
                                className="mono"
                                style={{
                                  fontSize: 11,
                                  color: GREEN,
                                  fontWeight: 700,
                                }}
                              >
                                ${option.cost}/mo
                              </span>
                            </div>
                            {option.note && (
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  margin: "4px 0 0",
                                  lineHeight: 1.3,
                                }}
                              >
                                {option.note}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
