import { useState } from "react";

/**
 * Mission 3 warm-up step. Shown BEFORE the ArchitectureBuilder.
 * Forces the candidate to sort the client's asks into Fixed / Flexible
 * before they touch any tech choices — this is the actual reasoning skill
 * Mission 3 is meant to test (see Business Requirements §6), and it gives
 * Mission 3 its own distinct opening beat instead of jumping straight into
 * the same drag-and-drop screen as Mission 1.
 *
 * Every requirement below is taken near-verbatim from the client email, and
 * the email itself states the answer in §6 — so this isn't a trick quiz,
 * it's a comprehension check. Wrong taps get an immediate, plain-English
 * correction that points back to the source line.
 *
 * Usage:
 *   <FixedFlexibleSort onComplete={() => setStep("architecture")} />
 *
 * Render this first; once `onComplete` fires, mount <ArchitectureBuilder />
 * as you do today. No new backend/schema needed — this step doesn't save
 * anything, it's a comprehension gate.
 */

const AMBER = "var(--amber)";
const GREEN = "var(--teal)";
const RED = "var(--red)";
const PANEL_BG = "var(--surface-1)";
const ZONE_BG = "var(--surface-2)";
const BORDER = "var(--border)";

const REQUIREMENTS = [
  {
    id: "r1",
    text: "15-minute recovery time / 5-minute data-loss target (RTO/RPO)",
    answer: "fixed",
    why: "The email says the board wants a real answer on this — it's non-negotiable.",
  },
  {
    id: "r2",
    text: "Indian customers' personal data must stay stored in India",
    answer: "fixed",
    why: "Called out as an unchanged rule — it's a legal/compliance requirement, not a preference.",
  },
  {
    id: "r3",
    text: "Total monthly infrastructure budget cap",
    answer: "fixed",
    why: "Finance said no — the board approved market expansion, not a bigger budget.",
  },
  {
    id: "r4",
    text: "Exactly how you achieve fast access for SEA/UAE customers",
    answer: "flexible",
    why: 'The email explicitly says "How exactly you achieve global reach" is your call.',
  },
  {
    id: "r5",
    text: "Running a full live duplicate of the whole system in every region",
    answer: "flexible",
    why: 'The email says this is one option, not a requirement — "NOT asking for a live duplicate running in every region at once."',
  },
  {
    id: "r6",
    text: "Whether the regional sales dashboard updates in real-time",
    answer: "flexible",
    why: 'The email says "updated a few times a day is enough — this does NOT need to be real-time."',
  },
];

export default function FixedFlexibleSort({ onComplete }) {
  const [answers, setAnswers] = useState({}); // { [id]: 'fixed' | 'flexible' }
  const [revealed, setRevealed] = useState({}); // { [id]: true } once tapped

  function choose(id, value) {
    if (revealed[id]) return; // lock after first answer — no re-guessing
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  }

  const doneCount = Object.keys(revealed).length;
  const allDone = doneCount === REQUIREMENTS.length;
  const correctCount = REQUIREMENTS.filter(
    (r) => answers[r.id] === r.answer,
  ).length;

  return (
    <div
      style={{
        background: PANEL_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--violet)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Before you touch the architecture
        </span>
        <h3
          style={{
            margin: "6px 0 4px",
            fontSize: 16,
            color: "var(--text-primary)",
          }}
        >
          Sort the client's asks
        </h3>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
          Tap <strong style={{ color: AMBER }}>Fixed</strong> if the client says
          this can't change, or{" "}
          <strong style={{ color: "var(--violet)" }}>Flexible</strong> if they
          left the "how" up to you. Re-read Ananya's email if you're not sure —
          section 6 spells it out directly.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {REQUIREMENTS.map((r) => {
          const chosen = answers[r.id];
          const isRevealed = revealed[r.id];
          const isCorrect = chosen === r.answer;
          return (
            <div
              key={r.id}
              style={{
                background: ZONE_BG,
                border: `1px solid ${
                  isRevealed ? (isCorrect ? GREEN : RED) : BORDER
                }`,
                borderRadius: 8,
                padding: "12px 14px",
                transition: "border-color 150ms ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    flex: 1,
                    minWidth: 220,
                  }}
                >
                  {r.text}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <TagButton
                    label="Fixed"
                    active={chosen === "fixed"}
                    color={AMBER}
                    disabled={isRevealed}
                    onClick={() => choose(r.id, "fixed")}
                  />
                  <TagButton
                    label="Flexible"
                    active={chosen === "flexible"}
                    color="var(--violet)"
                    disabled={isRevealed}
                    onClick={() => choose(r.id, "flexible")}
                  />
                </div>
              </div>
              {isRevealed && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    color: isCorrect ? GREEN : RED,
                  }}
                >
                  {isCorrect ? "✓ Correct — " : `✕ Actually ${r.answer} — `}
                  {r.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {doneCount} / {REQUIREMENTS.length} sorted
          {allDone && (
            <span style={{ marginLeft: 10, color: "var(--text-secondary)" }}>
              · {correctCount} / {REQUIREMENTS.length} correct
            </span>
          )}
        </span>
        <button
          onClick={() => onComplete?.({ answers, correctCount })}
          disabled={!allDone}
          style={{
            background: allDone ? AMBER : "var(--border-strong)",
            color: allDone ? "var(--bg-page)" : "var(--text-muted)",
            border: "none",
            borderRadius: 6,
            padding: "10px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: allDone ? "pointer" : "not-allowed",
          }}
        >
          Continue to architecture →
        </button>
      </div>
    </div>
  );
}

function TagButton({ label, active, color, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active ? color : "transparent",
        color: active ? "var(--bg-page)" : "var(--text-secondary)",
        border: `1px solid ${active ? color : "var(--border-strong)"}`,
        borderRadius: 6,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled && !active ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  );
}
