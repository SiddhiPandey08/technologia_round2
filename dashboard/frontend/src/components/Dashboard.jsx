import { useEffect, useState, useRef } from "react";
import Header from "./Header.jsx";
import MissionPipeline from "./MissionPipeline.jsx";
import MissionProgress from "./MissionProgress.jsx";
import MissionBriefing from "./MissionBriefing.jsx";
import MissionResources from "./MissionResources.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import ResourceModal from "./ResourceModal.jsx";
import ArchitectureBuilder from "./ArchitectureBuilder.jsx";
import DiscoveryWorkspace from "./DiscoveryWorkspace.jsx";
import Mission3Addons from "./Mission3Addons.jsx";
import Mission4Workspace from "./Mission4Workspace.jsx";

// Standard Modals
function WorkspaceSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.45; }
          50% { opacity: 0.9; }
          100% { opacity: 0.45; }
        }
        .skeleton-block {
          background: var(--bg-elevated, #1c1c1f);
          border-radius: 6px;
          animation: skeleton-pulse 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* title row */}
      <div className="skeleton-block" style={{ width: "40%", height: 22 }} />
      <div className="skeleton-block" style={{ width: "70%", height: 14 }} />

      {/* card-ish body */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div className="skeleton-block" style={{ width: "30%", height: 16 }} />
        <div className="skeleton-block" style={{ width: "100%", height: 40 }} />
        <div className="skeleton-block" style={{ width: "100%", height: 40 }} />
        <div className="skeleton-block" style={{ width: "60%", height: 40 }} />
      </div>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div className="skeleton-block" style={{ width: "35%", height: 16 }} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="skeleton-block" style={{ width: 120, height: 60 }} />
          <div className="skeleton-block" style={{ width: 120, height: 60 }} />
          <div className="skeleton-block" style={{ width: 120, height: 60 }} />
        </div>
      </div>

      {/* footer / submit button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <div
          className="skeleton-block"
          style={{ width: 140, height: 36, borderRadius: 6 }}
        />
      </div>
    </div>
  );
}
function GlossaryPromptModal({ onOpenGlossary, onSkip }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg-page, #111)",
          padding: 24,
          borderRadius: 8,
          maxWidth: 400,
        }}
      >
        <h3>Need Help Getting Started?</h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          You can refer to the Glossary & Hints guide anytime during the round.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={onOpenGlossary}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Open Glossary
          </button>
          <button
            onClick={onSkip}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

function TabWarningModal({ count, maxCount, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg-page, #111)",
          padding: 24,
          borderRadius: 8,
          maxWidth: 400,
          border: "1px solid var(--red, red)",
        }}
      >
        <h3 style={{ color: "var(--red, red)" }}>
          Tab Switch Warning ({count}/{maxCount})
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Switching tabs or leaving full-screen mode violates test rules.
          Reaching 3 violations will automatically submit your assessment.
        </p>
        <button
          onClick={onClose}
          style={{ padding: "8px 12px", cursor: "pointer", marginTop: 12 }}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
}

const MISSIONS = [
  {
    id: 1,
    number: 1,
    title: "Understand the Project",
    subtitle: "Requirements Analysis & Tech Selection",
    status: "active",
    scenario:
      "Welcome to TechNova Solutions as a Graduate Software Engineer. The Senior Solution Architect is unavailable, and your team must prepare the system design for Project Phoenix. Analyze client requirements, identify functional vs. non-functional constraints, and curate your initial tech stack shortlist.",
    objectives: [
      "Review client and business requirements documentation",
      "Classify functional vs. non-functional system constraints",
      "Identify target user personas and project goals",
      "Shortlist initial core technologies for the system",
    ],
    resources: [
      {
        key: "client-requirements",
        type: "document",
        title: "Client Requirements",
        url: "/resources/m1-client-requirements.pdf",
      },
    ],
  },
  {
    id: 2,
    number: 2,
    title: "Build the Foundation",
    subtitle: "Core Architecture Setup",
    status: "locked",
    scenario:
      "Now that you understand the client's needs, lay down the baseline software architecture. Select and place the frontend, API engine, main database, authentication mechanism, and notification service onto the architecture canvas.",
    objectives: [
      "Place core frontend application tier",
      "Select and configure backend API server / application engine",
      "Attach primary relational or document database",
      "Integrate baseline authentication and notification services",
    ],
    resources: [
      {
        key: "technology-inventory",
        type: "document",
        title: "Technology Inventory",
        url: "/resources/m2-architecture-reference.pdf",
      },
    ],
  },
  {
    id: 3,
    number: 3,
    title: "Expand the System",
    subtitle: "Feature Additions & Microservices",
    status: "locked",
    scenario:
      "The client has introduced new feature requests: AI recommendation engines, secure payment processing, real-time updates, and an analytics dashboard. Extend your baseline architecture to support these requirements while keeping costs and complexity contained.",
    objectives: [
      "Integrate AI recommendation and analytics microservices",
      "Add secure payment gateway integration",
      "Connect real-time notification brokers (WebSockets/PubSub)",
      "Maintain logical flow and avoid unnecessary redundant components",
    ],
    resources: [
      {
        key: "technology-inventory",
        type: "document",
        title: "Technology Inventory",
        url: "/resources/m3-webdev-reference.pdf",
      },
    ],
  },
  {
    id: 4,
    number: 4,
    title: "Final Integration",
    subtitle: "Production Readiness & Submission",
    status: "locked",
    scenario:
      "Complete the end-to-end integration for Project Phoenix. Verify logical connections across all tiers, eliminate unused components, define deployment rollout plans, and submit the final system design for review.",
    objectives: [
      "Verify end-to-end component connectivity across all 4 tiers",
      "Remove redundant or unselected technologies from the canvas",
      "Finalize disaster recovery, Multi-AZ, and rollout strategy",
      "Submit final Architecture V4 for evaluation",
    ],
    resources: [
      {
        key: "deployment-reference-guide",
        type: "document",
        title: "Deployment Reference Guide",
        url: "/resources/m4-deployment-reference.pdf",
      },
    ],
  },
];

const MISSION_2_CATEGORIES = [
  "frontend",
  "compute",
  "database",
  "auth",
  "messaging",
];

const GLOSSARY_RESOURCE = {
  key: "glossary",
  type: "document",
  title: "Glossary & Hints",
  url: "/resources/Glossary_and_Hints.pdf",
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const WHATS_NEW = {
  2: "Core Phase: Establish baseline architecture foundation (Frontend, API server, Database, Auth, and Notifications).",
  3: "Expansion Phase: The client added feature requests for AI recommendations, payment gateways, real-time events, and analytics.",
  4: "Final Release: Complete end-to-end validation, disaster recovery planning, and submit final architecture.",
};

function applyMissionStatuses(baseMissions, attemptMissions) {
  if (!attemptMissions) return baseMissions;
  return baseMissions.map((m) => {
    const match = attemptMissions.find((am) => am.number === m.number);
    return match ? { ...m, status: match.status } : m;
  });
}

async function fetchArchitecture(missionNumber, token) {
  const res = await fetch(
    `${API_BASE}/api/missions/${missionNumber}/architecture`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.architecture || null;
}

function componentsToSelections(components = []) {
  if (!Array.isArray(components)) return {};
  return components.reduce((acc, comp) => {
    const categoryKey = comp.category || comp.key;
    const optionId = comp.optionId || comp.id;
    if (categoryKey && optionId) {
      acc[categoryKey] = optionId;
    }
    return acc;
  }, {});
}

function mergeMissionStatus(base, apiMissions) {
  if (!apiMissions) return base;
  return base.map((m) => {
    const match = apiMissions.find((am) => am.number === m.number);
    if (!match) return m;
    return {
      ...m,
      status: match.status,
      title: match.title || m.title,
      scenario: match.scenario ?? m.scenario,
      objectives: Array.isArray(match.objectives)
        ? match.objectives
        : m.objectives,
    };
  });
}

export default function Dashboard({ onLogout }) {
  const [tabSwitches, setTabSwitches] = useState(() => {
    return parseInt(sessionStorage.getItem("phoenix_tab_switches") || "0", 10);
  });
  const [showTabWarning, setShowTabWarning] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [missions, setMissions] = useState(MISSIONS);

  const activeMission =
    missions.find((m) => m.status === "active") || missions[0];

  const [selected, setSelected] = useState(activeMission);
  const [candidate, setCandidate] = useState(null);
  const [candidateError, setCandidateError] = useState(null);
  const [openResource, setOpenResource] = useState(null);
  const [workspaceMission, setWorkspaceMission] = useState(null);

  const [workspaceInitial, setWorkspaceInitial] = useState({
    selections: {},
    deploymentPlan: {},
    suggestedCategories: [],
    deploymentScore: null,
    answers: {},
  });
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [attemptExpired, setAttemptExpired] = useState(false);
  const [showGlossaryPrompt, setShowGlossaryPrompt] = useState(
    () => !sessionStorage.getItem("phoenix_glossary_prompt_seen"),
  );
  const [endsAt, setEndsAt] = useState(() => {
    const cached = localStorage.getItem("phoenix_ends_at");
    return cached ? parseInt(cached, 10) : null;
  });

  const isReportingRef = useRef(false);

  const enterFullscreen = () => {
    if (
      document.documentElement.requestFullscreen &&
      !document.fullscreenElement
    ) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    }
  };

  const handleSelect = (mission) => {
    setSelected(mission);
  };
  const advanceToNextMission = (
    completedMissionNumber,
    updatedMissionsList,
  ) => {
    const nextNumber = completedMissionNumber + 1;
    const nextMission = updatedMissionsList.find(
      (m) => m.number === nextNumber,
    );

    if (nextMission) {
      setSelected(nextMission);
    } else {
      // If it was the final mission (Mission 4), keep Mission 4 selected
      const current = updatedMissionsList.find(
        (m) => m.number === completedMissionNumber,
      );
      if (current) setSelected(current);
    }
  };
  const handleEnter = async (mission) => {
    setWorkspaceLoading(true);
    setWorkspaceMission(mission);
    enterFullscreen();

    try {
      const token = localStorage.getItem("recruitos_token");
      if (token && mission.number > 1) {
        const arch = await fetchArchitecture(mission.number, token);
        if (arch) {
          setWorkspaceInitial({
            selections: componentsToSelections(arch.components),
            deploymentPlan: arch.deploymentPlan || {},
            suggestedCategories: arch.suggestedCategories || [],
            deploymentScore: arch.deploymentScore || null,
            answers: arch.answers || {},
          });
        }
      }
    } catch (err) {
      console.error("Failed to load workspace data:", err);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const triggerAutoSubmit = async () => {
    setIsAutoSubmitting(true);
    try {
      await handleDeploymentComplete({
        autoSubmitted: true,
        reason: "Exceeded tab switch threshold (3/3)",
      });
    } catch (err) {
      console.error("Auto-submit failed:", err);
    } finally {
      setIsAutoSubmitting(false);
    }
  };

  function dismissGlossaryPrompt() {
    sessionStorage.setItem("phoenix_glossary_prompt_seen", "1");
    setShowGlossaryPrompt(false);
  }

  // Consolidated Violation Tracker
  useEffect(() => {
    if (attemptExpired || !workspaceMission) return;

    const reportViolation = async (reason) => {
      if (isReportingRef.current) return;
      isReportingRef.current = true;

      try {
        const token = localStorage.getItem("recruitos_token");
        const res = await fetch(`${API_BASE}/api/session/tab-switch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        });

        if (res.ok) {
          const data = await res.json();
          setTabSwitches(data.tabSwitches);
          sessionStorage.setItem(
            "phoenix_tab_switches",
            data.tabSwitches.toString(),
          );

          if (data.status === "terminated" || data.tabSwitches >= 3) {
            triggerAutoSubmit();
          } else {
            setShowTabWarning(true);
          }
        }
      } catch (err) {
        console.error("Violation sync failed:", err);
      } finally {
        setTimeout(() => {
          isReportingRef.current = false;
        }, 1000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) reportViolation("tab_switch");
    };

    const handleWindowBlur = () => {
      if (!document.hasFocus() && document.hidden) {
        reportViolation("window_blur");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) reportViolation("fullscreen_exit");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [workspaceMission, attemptExpired]);

  useEffect(() => {
    if (endsAt) {
      localStorage.setItem("phoenix_ends_at", endsAt.toString());
    }
  }, [endsAt]);

  useEffect(() => {
    const token = localStorage.getItem("recruitos_token");
    if (!token) return;

    fetch(`${API_BASE}/api/missions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("recruitos_token");
            if (onLogout) onLogout();
          }
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${res.status}: Failed to fetch missions`,
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.endsAt) setEndsAt(new Date(data.endsAt).getTime());
        setMissions((prev) => {
          const merged = mergeMissionStatus(prev, data.missions);
          setSelected((prevSelected) => {
            const stillSelected = merged.find(
              (m) => m.number === prevSelected?.number,
            );
            return (
              stillSelected ||
              merged.find((m) => m.status === "active") ||
              merged[0]
            );
          });
          return merged;
        });
      })
      .catch((err) => console.error("Failed to load mission status:", err));
  }, [onLogout]);

  useEffect(() => {
    const token = localStorage.getItem("recruitos_token");
    if (!token) {
      setCandidateError("Not signed in.");
      return;
    }

    const cached = localStorage.getItem("recruitos_candidate");
    if (cached) {
      try {
        setCandidate(JSON.parse(cached));
      } catch {
        setCandidateError("Could not read candidate details.");
      }
    } else {
      setCandidateError("No candidate details found. Please sign in again.");
    }
  }, []);

  useEffect(() => {
    if (!endsAt) return;
    const msLeft = endsAt - Date.now();
    if (msLeft <= 0) {
      setAttemptExpired(true);
      return;
    }
    const timeout = setTimeout(() => setAttemptExpired(true), msLeft);
    return () => clearTimeout(timeout);
  }, [endsAt]);

  async function handleWorkspaceAnswersSave(missionNumber, answersData) {
    const token = localStorage.getItem("recruitos_token");
    if (!token) throw new Error("Authentication token missing.");

    const response = await fetch(
      `${API_BASE}/api/missions/${missionNumber}/answers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersData }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.error || `Server responded with status ${response.status}`,
      );
    }

    return response.json();
  }

  async function handleDiscoveryComplete(discoveryData) {
    try {
      setWorkspaceLoading(true);
      await handleWorkspaceAnswersSave(1, discoveryData);

      const token = localStorage.getItem("recruitos_token");
      const completeRes = await fetch(`${API_BASE}/api/missions/1/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!completeRes.ok) {
        const errData = await completeRes.json().catch(() => ({}));
        throw new Error(errData.error || "Could not complete Mission 1.");
      }

      const completeData = await completeRes.json();

      // 1. Close workspace FIRST so workspace components unmount cleanly
      setWorkspaceMission(null);

      // 2. Update missions and advance selection
      if (completeData.missions) {
        setMissions((prev) => {
          const nextMissions = applyMissionStatuses(
            prev,
            completeData.missions,
          );
          advanceToNextMission(1, nextMissions);
          return nextMissions;
        });
      }
    } catch (err) {
      console.error("Failed to submit Mission 1 analysis:", err);
      alert(`Error saving analysis: ${err.message}`);
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleDeploymentComplete(m4Data) {
    try {
      setWorkspaceLoading(true);
      const token = localStorage.getItem("recruitos_token");

      await handleWorkspaceAnswersSave(4, m4Data);

      await fetch(`${API_BASE}/api/missions/4/architecture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          components: workspaceInitial.selections || [],
          deploymentPlan: {
            rollout: m4Data.deploymentPlan?.rolloutPlan || "",
            rollback: m4Data.deploymentPlan?.rollbackPlan || "",
          },
          answers: m4Data,
        }),
      });

      const completeRes = await fetch(`${API_BASE}/api/missions/4/complete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        throw new Error(err.error || "Could not complete Mission 4.");
      }

      const data = await completeRes.json();
      if (data.missions) {
        setMissions((prev) => applyMissionStatuses(prev, data.missions));
      }

      setWorkspaceMission(null);
    } catch (err) {
      console.error("Failed to submit Mission 4:", err);
      alert(`Error submitting Mission 4: ${err.message}`);
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handleSaveArchitecture(missionNumber, payload) {
    try {
      setWorkspaceLoading(true);
      const token = localStorage.getItem("recruitos_token");

      const fullPayload = {
        ...payload,
        answers: {
          ...(workspaceInitial.answers || {}),
          deploymentPlan: payload.deploymentPlan || {},
        },
      };

      const saveRes = await fetch(
        `${API_BASE}/api/missions/${missionNumber}/architecture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fullPayload),
        },
      );
      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save architecture.");
      }

      const completeRes = await fetch(
        `${API_BASE}/api/missions/${missionNumber}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!completeRes.ok) {
        const err = await completeRes.json().catch(() => ({}));
        throw new Error(err.error || "Could not complete mission.");
      }

      const data = await completeRes.json();

      // 1. Unmount workspace FIRST
      setWorkspaceMission(null);

      // 2. Update state and advance to next briefing
      if (data.missions) {
        setMissions((prev) => {
          const nextMissions = applyMissionStatuses(prev, data.missions);
          advanceToNextMission(missionNumber, nextMissions);
          return nextMissions;
        });
      }
    } catch (err) {
      console.error(`Failed to save Mission ${missionNumber}:`, err);
      alert(`Error saving architecture: ${err.message}`);
    } finally {
      setWorkspaceLoading(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 80px" }}
    >
      <Header
        candidateName={candidate?.name || "Loading…"}
        candidateId={candidate?.candidateId || "—"}
        onLogout={onLogout}
      />
      {candidateError && (
        <p
          style={{ fontSize: 12, color: "var(--red)", margin: "-20px 0 20px" }}
        >
          {candidateError}
        </p>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <div>
          <p
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
              margin: "0 0 6px",
            }}
          >
            technova solutions · graduate onboarding program
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Project Phoenix System Design
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              margin: "8px 0 0",
            }}
          >
            Welcome aboard! Transform the client's business vision into a
            production-ready software architecture across 4 engineering phases.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setOpenResource(GLOSSARY_RESOURCE)}
            className="icon-btn"
            style={{
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Available the whole round"
          >
            📘 Glossary &amp; Hints
          </button>
          <CountdownTimer
            endsAt={endsAt}
            onExpire={() => setAttemptExpired(true)}
          />
        </div>
      </div>

      <MissionProgress missions={missions} />

      {attemptExpired && (
        <div
          style={{
            background: "var(--red-dim)",
            border: "1px solid var(--red)",
            borderRadius: 10,
            padding: "12px 16px",
            margin: "14px 0",
            fontSize: 13,
            color: "var(--text-primary)",
          }}
        >
          <strong style={{ color: "var(--red)" }}>Time's up.</strong> Your 60
          minutes are over, so new saves won't go through. If this is a test
          run, ask an admin to reset your attempt.
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <MissionPipeline
          missions={missions}
          selectedId={selected?.id}
          onSelect={handleSelect}
        />
      </div>

      {workspaceMission ? (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "var(--bg-page)",
              borderBottom: "1px solid var(--border)",
              padding: "10px 0",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setWorkspaceMission(null)}
              style={{
                background: "transparent",
                border: "1px solid var(--border-strong)",
                color: "var(--text-secondary)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ← Back to dashboard briefing
            </button>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Mission {workspaceMission.number} · {workspaceMission.title}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div>
              {workspaceLoading ? (
                <WorkspaceSkeleton />
              ) : workspaceMission?.number === 1 ? (
                <DiscoveryWorkspace onComplete={handleDiscoveryComplete} />
              ) : workspaceMission?.number === 2 ? (
                <ArchitectureBuilder
                  key="arch-builder-mission-2"
                  onSave={(payload) => handleSaveArchitecture(2, payload)}
                  initialSelections={workspaceInitial.selections}
                  initialDeploymentPlan={workspaceInitial.deploymentPlan}
                  suggestedCategories={workspaceInitial.suggestedCategories}
                  allowedCategories={MISSION_2_CATEGORIES}
                  submitLabel="Save architecture v2"
                  whatsNew={WHATS_NEW[2]}
                />
              ) : workspaceMission?.number === 3 ? (
                <Mission3Addons
                  key="mission-3-addons"
                  onSave={(payload) => handleSaveArchitecture(3, payload)}
                  initialSelections={workspaceInitial.selections}
                  whatsNew={WHATS_NEW[3]}
                  submitLabel="Save architecture v3"
                />
              ) : workspaceMission?.number === 4 ? (
                <Mission4Workspace
                  key="mission-4-workspace"
                  onComplete={handleDeploymentComplete}
                  blueprintData={workspaceInitial}
                />
              ) : null}
            </div>

            <div>
              <MissionResources
                mission={workspaceMission}
                onOpenResource={(res) => setOpenResource(res)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className="dashboard-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
            gap: 18,
            marginTop: 20,
          }}
        >
          <MissionBriefing
            mission={selected}
            onEnter={handleEnter}
            attemptExpired={attemptExpired}
          />
          <MissionResources
            mission={selected}
            onOpenResource={(res) => setOpenResource(res)}
          />
        </div>
      )}

      <ResourceModal
        resource={openResource}
        onClose={() => setOpenResource(null)}
      />

      {showGlossaryPrompt && (
        <GlossaryPromptModal
          onOpenGlossary={() => {
            setOpenResource(GLOSSARY_RESOURCE);
            dismissGlossaryPrompt();
          }}
          onSkip={dismissGlossaryPrompt}
        />
      )}

      {showTabWarning && tabSwitches < 3 && (
        <TabWarningModal
          count={tabSwitches}
          maxCount={3}
          onClose={() => {
            setShowTabWarning(false);
            enterFullscreen();
          }}
        />
      )}
      {tabSwitches >= 3 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(10, 7, 19, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <h2>Limit Exceeded (3/3 Tab Switches)</h2>
          <p style={{ color: "var(--text-muted)" }}>
            {isAutoSubmitting
              ? "Submitting your assessment automatically…"
              : "Your attempt has been submitted due to security policy enforcement."}
          </p>
        </div>
      )}
    </div>
  );
}
