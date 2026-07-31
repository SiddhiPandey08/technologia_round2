import React, { useState } from "react";

const CHECKLIST_ITEMS = [
  {
    id: "chk-auth",
    label: "Authentication & Authorization secured at gateway level",
  },
  { id: "chk-db", label: "Database decoupled from public internet" },
  {
    id: "chk-redundancy",
    label: "No single points of failure in primary flow",
  },
  { id: "chk-clean", label: "Unused components removed from architecture" },
];

export default function Mission4Workspace({ onComplete, blueprintData = {} }) {
  const [completedChecklist, setCompletedChecklist] = useState([]);
  const [architectureOverview, setArchitectureOverview] = useState("");

  // Simple textarea states for rollout and rollback
  const [rolloutPlan, setRolloutPlan] = useState("");
  const [rollbackPlan, setRollbackPlan] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleChecklistItem = (id) => {
    if (completedChecklist.includes(id)) {
      setCompletedChecklist(completedChecklist.filter((item) => item !== id));
    } else {
      setCompletedChecklist([...completedChecklist, id]);
    }
  };

  const handleFinalSubmission = () => {
    setIsSubmitted(true);
    if (onComplete) {
      onComplete({
        mission: "Mission 4 - Final Integration",
        completedChecklist,
        architectureOverview,
        deploymentPlan: {
          rolloutPlan,
          rollbackPlan,
        },
        blueprintData,
        submittedAt: new Date().toISOString(),
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
      }}
    >
      <h2 style={{ margin: "0 0 16px", fontSize: 20, color: "#fff" }}>
        Mission 4: Final Integration & Strategy
      </h2>

      {!isSubmitted ? (
        <div>
          {/* Rollout Plan Textarea */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 6,
                color: "#a6adc8",
                fontWeight: 600,
              }}
            >
              Rollout Strategy
            </label>
            <textarea
              rows={3}
              placeholder="Describe how the release will be deployed (e.g., Canary release steps, traffic shifting, blue/green deployment)..."
              value={rolloutPlan}
              onChange={(e) => setRolloutPlan(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                background: "#11111b",
                border: "1px solid #313244",
                color: "#fff",
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Rollback Plan Textarea */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 6,
                color: "#a6adc8",
                fontWeight: 600,
              }}
            >
              Rollback Plan & Triggers
            </label>
            <textarea
              rows={3}
              placeholder="Describe the conditions under which a rollback is triggered and the steps to safely revert..."
              value={rollbackPlan}
              onChange={(e) => setRollbackPlan(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                background: "#11111b",
                border: "1px solid #313244",
                color: "#fff",
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Pre-Flight Checklist */}
          <div style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                color: "#a6adc8",
                marginBottom: 10,
              }}
            >
              Pre-Flight Checklist
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#11111b",
                    border: "1px solid #313244",
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={completedChecklist.includes(item.id)}
                    readOnly
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Architecture Rationale */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 6,
                color: "#a6adc8",
                fontWeight: 600,
              }}
            >
              Architecture Design Rationale
            </label>
            <textarea
              rows={3}
              placeholder="Explain system data flow and overall architecture decisions..."
              value={architectureOverview}
              onChange={(e) => setArchitectureOverview(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                background: "#11111b",
                border: "1px solid #313244",
                color: "#fff",
                fontSize: 13,
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          <button
            onClick={handleFinalSubmission}
            style={{
              padding: "10px 20px",
              borderRadius: 6,
              background: "var(--green, #10b981)",
              color: "#11111b",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Submit Final Strategy 🚀
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <h3 style={{ color: "#fff" }}>Strategy & Architecture Submitted!</h3>
        </div>
      )}
    </div>
  );
}
