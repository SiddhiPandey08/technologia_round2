import React, { useState } from "react";

const DEPLOYMENT_CASE_STUDIES = [
  {
    id: "dep-case-1",
    title: "Case 1: Continuous Deployment & Zero-Downtime Cutover",
    scenario:
      "Your engineering team is preparing to deploy a major release of the e-commerce backend. The database schema includes a non-backwards-compatible migration (renaming `user_address` to `shipping_address`), and the service handles thousands of active checkouts per minute.",
    questions: [
      {
        id: "d1-q1",
        label: "1.1 Zero-Downtime Deployment Strategy",
        text: "Which deployment pattern allows you to route traffic incrementally from the old v1 code to the new v2 code while monitoring error rates?",
        options: [
          { id: "a", label: "Blue-Green or Canary Deployment" },
          {
            id: "b",
            label:
              "Recreate Deployment (shutting down v1 before spinning up v2)",
          },
          { id: "c", label: "Big-Bang In-Place Replacement" },
        ],
        correct: "a",
      },
      {
        id: "d1-q2",
        label: "1.2 Zero-Downtime Database Schema Migration",
        text: "How should you execute the column rename without breaking live v1 app instances before v2 finishes rolling out?",
        options: [
          {
            id: "a",
            label:
              "Apply Expand-Contract pattern: Add new column, dual-write to both, migrate data, switch reads, then drop old column.",
          },
          {
            id: "b",
            label:
              "Run `ALTER TABLE RENAME COLUMN` directly on production during live traffic.",
          },
          {
            id: "c",
            label:
              "Lock the table during deployment window until migration completes.",
          },
        ],
        correct: "a",
      },
      {
        id: "d1-q3",
        label: "1.3 Automated Rollback Automation",
        text: "What trigger mechanism should immediately abort a Canary deployment and revert 100% of traffic back to v1?",
        options: [
          {
            id: "a",
            label:
              "Automated monitoring alerts firing on elevated HTTP 5xx rates or p99 latency spikes.",
          },
          {
            id: "b",
            label: "A scheduled cron job running 2 hours after deployment.",
          },
          { id: "c", label: "Manual developer intervention via SSH terminal." },
        ],
        correct: "a",
      },
    ],
  },
  {
    id: "dep-case-2",
    title: "Case 2: Disaster Recovery, Data Backups & High Availability",
    scenario:
      "A cloud provider's primary availability zone (AZ) suffers a massive network outage. Your primary database node becomes unreachable, and static media files hosted on object storage are temporarily dropping requests.",
    questions: [
      {
        id: "d2-q1",
        label: "2.1 Database Failover Management",
        text: "How should the system handle automated failover to ensure minimal data loss (RPO) and low downtime (RTO)?",
        options: [
          {
            id: "a",
            label:
              "Promote a Multi-AZ Read Replica to Primary via automated health checks & update DNS endpoint pointers.",
          },
          {
            id: "b",
            label:
              "Restore the database manually from night-before cold S3 snapshot backups.",
          },
          {
            id: "c",
            label:
              "Wait for the cloud provider to restore the primary zone hardware.",
          },
        ],
        correct: "a",
      },
      {
        id: "d2-q2",
        label: "2.2 Content Delivery & Edge Redundancy",
        text: "What static asset delivery setup prevents image loading failures if an entire cloud storage region experiences downtime?",
        options: [
          {
            id: "a",
            label:
              "Multi-region replication on Object Storage paired with edge CDN caching.",
          },
          {
            id: "b",
            label:
              "Serving all static assets straight out of application server local disks.",
          },
          {
            id: "c",
            label: "Increasing HTTP client timeouts on browser image tags.",
          },
        ],
        correct: "a",
      },
      {
        id: "d2-q3",
        label: "2.3 Health Checks & Load Balancing",
        text: "Which endpoint type should the load balancer query to safely detect and isolate unhealthy application instances?",
        options: [
          {
            id: "a",
            label:
              "A dedicated `/healthz` endpoint checking database connectivity, cache connection, and disk state.",
          },
          { id: "b", label: "The root static landing page (`/`)." },
          {
            id: "c",
            label: "A deep database search query executed every 500ms.",
          },
        ],
        correct: "a",
      },
    ],
  },
  {
    id: "dep-case-3",
    title: "Case 3: Production Security, Environment & TLS Hardening",
    scenario:
      "Before launching to public traffic, your team conducts a production readiness security audit. You need to harden API keys, manage SSL certificates, and protect against distributed traffic attacks.",
    questions: [
      {
        id: "d3-q1",
        label: "3.1 Environment Secrets Management",
        text: "Where should sensitive production database credentials and API keys be stored and injected into running containers?",
        options: [
          {
            id: "a",
            label:
              "Encrypted Cloud Secret Manager / Vault injected at runtime via environment variables.",
          },
          {
            id: "b",
            label:
              "Committed inside the `config/production.json` file in Git repository.",
          },
          {
            id: "c",
            label: "Hardcoded directly inside source code constants.",
          },
        ],
        correct: "a",
      },
      {
        id: "d3-q2",
        label: "3.2 Traffic Encryption & TLS Termination",
        text: "How should TLS/SSL certificates be managed to guarantee encrypted communication without adding server CPU load?",
        options: [
          {
            id: "a",
            label:
              "Terminate SSL/TLS at the Load Balancer/Reverse Proxy level using auto-renewing managed certificates.",
          },
          {
            id: "b",
            label:
              "Decrypt TLS manually inside application code handlers on every request.",
          },
          {
            id: "c",
            label:
              "Allow unencrypted HTTP inside internal VPCs and skip public TLS.",
          },
        ],
        correct: "a",
      },
      {
        id: "d3-q3",
        label: "3.3 Rate Limiting & DDoS Mitigation",
        text: "How do you protect authentication and checkout API routes from brute-force bot attacks without blocking real users?",
        options: [
          {
            id: "a",
            label:
              "Configure Web Application Firewall (WAF) rate limits based on IP/User ID token buckets.",
          },
          {
            id: "b",
            label: "Disable public registration entirely during peak hours.",
          },
          {
            id: "c",
            label:
              "Increase server CPU count to process all bot requests faster.",
          },
        ],
        correct: "a",
      },
    ],
  },
];

export default function DeploymentWorkspace({ onComplete }) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentCase = DEPLOYMENT_CASE_STUDIES[currentCaseIndex];

  const handleSelect = (qId, optionId) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
  };

  const isCurrentCaseComplete = currentCase.questions.every(
    (q) => answers[q.id],
  );

  const handleNextCase = () => {
    if (currentCaseIndex < DEPLOYMENT_CASE_STUDIES.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const totalQuestions = DEPLOYMENT_CASE_STUDIES.reduce(
    (acc, c) => acc + c.questions.length,
    0,
  );
  const score = DEPLOYMENT_CASE_STUDIES.reduce((acc, c) => {
    return acc + c.questions.filter((q) => answers[q.id] === q.correct).length;
  }, 0);

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--violet)",
              textTransform: "uppercase",
            }}
          >
            Mission 4: Final Deployment Readiness
          </span>
          <h2 style={{ margin: "4px 0 0", fontSize: 20 }}>
            Production Launch Readiness Audit
          </h2>
        </div>
        <span
          className="mono"
          style={{ fontSize: 13, color: "var(--text-muted)" }}
        >
          Case {currentCaseIndex + 1} of {DEPLOYMENT_CASE_STUDIES.length}
        </span>
      </div>

      {!isFinished ? (
        <div>
          {/* Case Context Box */}
          <div
            style={{
              background: "var(--bg-page)",
              padding: 18,
              borderRadius: 8,
              border: "1px solid var(--border)",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                margin: "0 0 8px",
                color: "var(--text-primary)",
              }}
            >
              {currentCase.title}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {currentCase.scenario}
            </p>
          </div>

          {/* Sub Questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {currentCase.questions.map((q) => (
              <div
                key={q.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--violet)",
                    margin: "0 0 4px",
                  }}
                >
                  {q.label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                    margin: "0 0 12px",
                  }}
                >
                  {q.text}
                </p>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        padding: "10px 14px",
                        borderRadius: 6,
                        background:
                          answers[q.id] === opt.id
                            ? "rgba(139, 92, 246, 0.1)"
                            : "transparent",
                        border: `1px solid ${answers[q.id] === opt.id ? "var(--violet)" : "var(--border)"}`,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[q.id] === opt.id}
                        onChange={() => handleSelect(q.id, opt.id)}
                      />
                      <span style={{ color: "var(--text-primary)" }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 24,
            }}
          >
            <button
              onClick={handleNextCase}
              disabled={!isCurrentCaseComplete}
              style={{
                padding: "10px 24px",
                borderRadius: 6,
                background: isCurrentCaseComplete
                  ? "var(--violet)"
                  : "var(--border)",
                color: "#fff",
                border: "none",
                cursor: isCurrentCaseComplete ? "pointer" : "not-allowed",
              }}
            >
              {currentCaseIndex === DEPLOYMENT_CASE_STUDIES.length - 1
                ? "Submit Launch Audit"
                : "Next Case Study →"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <h3 style={{ fontSize: 22, color: "var(--green)", marginBottom: 8 }}>
            Deployment Audit Complete
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 20,
            }}
          >
            Readiness Score: {score} / {totalQuestions} passed across
            deployment, disaster recovery, and security checks.
          </p>
          <button
            onClick={() => onComplete && onComplete(score)}
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              background: "var(--violet)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Authorize Production Launch
          </button>
        </div>
      )}
    </div>
  );
}
