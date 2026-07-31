import { useMemo, useState } from "react";
import { techCatalog, BUDGET_CAP } from "../techCatalog";

/**
 * Mission 4 companion to ArchitectureBuilder. Replaces the free-text
 * "what will you watch" essay with three concrete, gradeable steps that
 * each give Mission 4 its own identity (synthesis + judgment, not just
 * re-filling slots):
 *
 *   1. Pick which dashboard metrics you'd alert on (multi-select — wrong
 *      options are obviously irrelevant, not subtle, so beginners can
 *      reason it out from the Mission 2 dashboard doc with confidence).
 *   2. A single "something breaks after launch" MCQ that closes the loop
 *      back to the Mission 2 root cause.
 *   3. An auto-computed Go / No-Go checklist against the candidate's own
 *      saved architecture — no typing required, just a clear pass/fail
 *      readout so submitting feels like a real launch decision.
 *
 * Mount this ABOVE or BELOW the existing ArchitectureBuilder's deployment
 * plan section (or in place of it). It's self-contained: pass in the
 * candidate's current `selections` (same shape ArchitectureBuilder uses)
 * and `totalCost` so the checklist can compute against real choices.
 *
 * `onComplete` fires with a small structured object you can merge into the
 * existing deploymentPlan.monitoring string (schema needs no changes), e.g.:
 *   monitoring: [
 *     `Watching: ${result.metrics.join(", ")}`,
 *     `If DB CPU/pool spikes post-launch: ${result.incidentAnswerLabel}`,
 *   ].join(" — ")
 */

const AMBER = "var(--amber)";
const GREEN = "var(--teal)";
const RED = "var(--red)";
const PANEL_BG = "var(--surface-1)";
const ZONE_BG = "var(--surface-2)";
const BORDER = "var(--border)";

const METRIC_OPTIONS = [
  { id: "db-cpu", label: "Database CPU %", correct: true },
  {
    id: "db-pool",
    label: "Database connection pool (X / 50 seats used)",
    correct: true,
  },
  { id: "api-p95", label: "API response time, p95", correct: true },
  {
    id: "error-rate",
    label: "Error rate (% of requests failing)",
    correct: true,
  },
  {
    id: "browser-tabs",
    label: "Number of browser tabs open on the dev laptop",
    correct: false,
  },
  {
    id: "cdn-mascot",
    label: "The CDN provider's company logo color",
    correct: false,
  },
  {
    id: "github-stars",
    label: "GitHub stars on the project repo",
    correct: false,
  },
  { id: "office-wifi", label: "Office wifi signal strength", correct: false },
];

const INCIDENT_OPTIONS = [
  {
    id: "restart-app",
    label: "Restart the app servers and hope it clears up",
    correct: false,
  },
  {
    id: "check-db",
    label:
      "Check DB CPU and connection pool usage — that's where Mission 2's failure started",
    correct: true,
  },
  {
    id: "call-cdn",
    label: "Call the CDN provider's support line",
    correct: false,
  },
  {
    id: "pause-marketing",
    label: "Ask the marketing team to stop announcing the launch",
    correct: false,
  },
];

function findOption(categoryKey, optionId) {
  const category = techCatalog.find((c) => c.key === categoryKey);
  return category?.options.find((o) => o.id === optionId) || null;
}

export default function LaunchReadiness({
  selections = {},
  totalCost = 0,
  requiredCategoryKeys = [],
  onComplete,
}) {
  const [pickedMetrics, setPickedMetrics] = useState([]);
  const [incidentChoice, setIncidentChoice] = useState(null);

  function toggleMetric(id) {
    setPickedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  const metricsCorrectCount = pickedMetrics.filter(
    (id) => METRIC_OPTIONS.find((m) => m.id === id)?.correct,
  ).length;
  const metricsWrongCount = pickedMetrics.length - metricsCorrectCount;
  const metricsDone = pickedMetrics.length > 0;
  const incidentRevealed = incidentChoice !== null;

  // --- Go / No-Go checklist, computed straight from the saved architecture ---
  const checklist = useMemo(() => {
    const requiredFilled = requiredCategoryKeys.every((k) => selections[k]);
    const overBudget = totalCost > BUDGET_CAP;
    const drOption = selections.dr ? findOption("dr", selections.dr) : null;
    const hasDrPlan = !!drOption; // any DR choice counts — "backup" is a valid, cheaper answer
    const cacheChosen = selections.caching
      ? findOption("caching", selections.caching)
      : null;
    const hasCache = cacheChosen?.id === "cache-redis";

    return [
      {
        label: "All required components selected",
        pass: requiredFilled,
        detail: requiredFilled
          ? "Every required slot is filled."
          : "Some required slots are still empty — check the builder above.",
      },
      {
        label: "Within budget",
        pass: !overBudget,
        detail: overBudget
          ? `Over the $${BUDGET_CAP.toLocaleString()}/mo cap by $${(totalCost - BUDGET_CAP).toLocaleString()}.`
          : `$${totalCost.toLocaleString()} / $${BUDGET_CAP.toLocaleString()} cap.`,
      },
      {
        label: "Recovery plan in place (RTO/RPO)",
        pass: hasDrPlan,
        detail: hasDrPlan
          ? `Chosen: ${drOption.name}.`
          : "No DR/backup option selected yet — the board's 15-min RTO / 5-min RPO ask needs one.",
      },
      {
        label: "Database reads protected under load",
        pass: hasCache,
        detail: hasCache
          ? "Cache layer selected — matches the root cause found in Mission 2."
          : "No cache layer selected — this is exactly what failed the 50,000-user test in Mission 2.",
      },
    ];
  }, [selections, totalCost, requiredCategoryKeys]);

  const allChecksPass = checklist.every((c) => c.pass);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Step 1 — metrics */}
      <Section title="What will you watch after launch?" step="1 of 3">
        <p
          style={{
            margin: "0 0 12px",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          Pick everything worth alerting on. Think back to the Mission 2
          dashboard — what actually moved right before things broke?
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {METRIC_OPTIONS.map((m) => {
            const picked = pickedMetrics.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMetric(m.id)}
                style={{
                  background: picked ? "var(--amber-dim)" : ZONE_BG,
                  border: `1px solid ${picked ? AMBER : BORDER}`,
                  borderRadius: 20,
                  padding: "7px 14px",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        {metricsDone && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12,
              color: metricsWrongCount ? RED : GREEN,
            }}
          >
            {metricsWrongCount
              ? `${metricsWrongCount} of those aren't real system health signals — remove them.`
              : `✓ All ${metricsCorrectCount} selected are real signals from the incident.`}
          </p>
        )}
      </Section>

      {/* Step 2 — incident MCQ */}
      <Section
        title="Two hours after launch, DB CPU hits 95%. What do you check first?"
        step="2 of 3"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {INCIDENT_OPTIONS.map((opt) => {
            const selected = incidentChoice === opt.id;
            const showResult = incidentRevealed && selected;
            return (
              <button
                key={opt.id}
                onClick={() => !incidentRevealed && setIncidentChoice(opt.id)}
                disabled={incidentRevealed}
                style={{
                  textAlign: "left",
                  background: showResult
                    ? opt.correct
                      ? "var(--teal-dim)"
                      : "var(--red-dim)"
                    : ZONE_BG,
                  border: `1px solid ${
                    showResult ? (opt.correct ? GREEN : RED) : BORDER
                  }`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  cursor: incidentRevealed ? "default" : "pointer",
                  opacity: incidentRevealed && !selected ? 0.5 : 1,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {incidentRevealed && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12,
              color: INCIDENT_OPTIONS.find((o) => o.id === incidentChoice)
                ?.correct
                ? GREEN
                : RED,
            }}
          >
            {INCIDENT_OPTIONS.find((o) => o.id === incidentChoice)?.correct
              ? "✓ Right instinct — go straight to where Mission 2's failure actually started."
              : "That won't tell you what's wrong. The correct move: check DB CPU and connection pool first, since that's exactly what maxed out in Mission 2."}
          </p>
        )}
      </Section>

      {/* Step 3 — go/no-go, auto-computed */}
      <Section title="Launch readiness" step="3 of 3">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {checklist.map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 0",
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  color: c.pass ? GREEN : RED,
                  fontSize: 14,
                  marginTop: 1,
                }}
              >
                {c.pass ? "✓" : "✕"}
              </span>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {c.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 8,
            background: allChecksPass ? "var(--teal-dim)" : "var(--red-dim)",
            border: `1px solid ${allChecksPass ? GREEN : RED}`,
            fontSize: 13,
            fontWeight: 700,
            color: allChecksPass ? GREEN : RED,
          }}
        >
          {allChecksPass
            ? "✓ Ready to launch"
            : "Not ready — fix the items above"}
        </div>
      </Section>

      <button
        onClick={() =>
          onComplete?.({
            metrics: pickedMetrics,
            metricsLabels: pickedMetrics
              .map((id) => METRIC_OPTIONS.find((m) => m.id === id)?.label)
              .filter(Boolean),
            metricsAllCorrect: metricsWrongCount === 0 && metricsDone,
            incidentAnswer: incidentChoice,
            incidentAnswerLabel: INCIDENT_OPTIONS.find(
              (o) => o.id === incidentChoice,
            )?.label,
            incidentCorrect: !!INCIDENT_OPTIONS.find(
              (o) => o.id === incidentChoice,
            )?.correct,
            allChecksPass,
          })
        }
        disabled={!metricsDone || !incidentRevealed}
        style={{
          alignSelf: "flex-end",
          background:
            metricsDone && incidentRevealed ? AMBER : "var(--border-strong)",
          color:
            metricsDone && incidentRevealed
              ? "var(--bg-page)"
              : "var(--text-muted)",
          border: "none",
          borderRadius: 6,
          padding: "10px 20px",
          fontWeight: 700,
          fontSize: 13,
          cursor: metricsDone && incidentRevealed ? "pointer" : "not-allowed",
        }}
      >
        Confirm launch plan
      </button>
    </div>
  );
}

function Section({ title, step, children }) {
  return (
    <div
      style={{
        background: PANEL_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 14, color: "var(--text-primary)" }}>
          {title}
        </h3>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{step}</span>
      </div>
      {children}
    </div>
  );
}
