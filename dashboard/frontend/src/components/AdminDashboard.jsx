import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [candidateData, setCandidateData] = useState(null);

  const [adminSecret, setAdminSecret] = useState(
    localStorage.getItem("admin_secret") || "",
  );
  const [inputSecret, setInputSecret] = useState("");

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:4000";

  // Save admin secret
  const handleSaveSecret = (e) => {
    e.preventDefault();
    localStorage.setItem("admin_secret", inputSecret);
    setAdminSecret(inputSecret);
    setError(null);
  };

  // 1. Fetch Candidate List
  useEffect(() => {
    if (!adminSecret) return;

    async function fetchCandidateList() {
      setLoadingList(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/admin/candidates`, {
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": adminSecret,
          },
        });

        if (res.status === 401) throw new Error("Invalid Admin Secret key.");
        if (!res.ok) throw new Error(`Failed status ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.candidates || [];
        setCandidates(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingList(false);
      }
    }

    fetchCandidateList();
  }, [adminSecret]);

  // 2. Fetch Selected Candidate Detail using _id
  useEffect(() => {
    if (!selectedCandidateId || !adminSecret) return;

    async function fetchCandidateDetail() {
      setLoadingDetail(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/admin/candidates/${selectedCandidateId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-admin-secret": adminSecret,
            },
          },
        );

        if (!res.ok) throw new Error(`Failed status ${res.status}`);

        const data = await res.json();
        setCandidateData(data.candidate || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDetail(false);
      }
    }

    fetchCandidateDetail();
  }, [selectedCandidateId, adminSecret]);

  if (!adminSecret || (error && error.includes("Invalid Admin Secret"))) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#0f172a",
          color: "#fff",
        }}
      >
        <form
          onSubmit={handleSaveSecret}
          style={{
            padding: 32,
            border: "1px solid #334155",
            borderRadius: 12,
            background: "#1e293b",
            width: 360,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Admin Portal Access</h3>
          {error && <p style={{ color: "#ff4d4f", fontSize: 13 }}>{error}</p>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
              Enter Admin Secret Key:
            </label>
            <input
              type="password"
              value={inputSecret}
              onChange={(e) => setInputSecret(e.target.value)}
              placeholder="ADMIN_SECRET value"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #334155",
                background: "#0f172a",
                color: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#f59e0b",
              color: "#000",
              fontWeight: 600,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  // --- DATA PARSING HELPERS ---
  const rawArchitectures =
    candidateData?.architectures ||
    candidateData?.submissions ||
    candidateData?.attempt?.architectures ||
    [];

  const rawMissions =
    candidateData?.attempt?.missions || candidateData?.missions || [];

  const isMission4Completed =
    rawMissions.some(
      (m) =>
        (m.number === 4 || m.missionNumber === 4) && m.status === "complete",
    ) ||
    candidateData?.attempt?.status === "submitted" ||
    candidateData?.status === "submitted";

  const extractComponents = (archItem) => {
    if (!archItem) return [];
    return (
      archItem.components ||
      archItem.payload?.components ||
      archItem.architecture?.components ||
      archItem.selectedComponents ||
      []
    );
  };

  return (
    <div
      style={{
        padding: 32,
        background: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          borderBottom: "1px solid #334155",
          paddingBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {selectedCandidateId && (
            <button
              onClick={() => {
                setSelectedCandidateId(null);
                setCandidateData(null);
              }}
              style={{
                padding: "6px 12px",
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #334155",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              ← Back to Candidates List
            </button>
          )}
          <h2 style={{ margin: 0 }}>
            {selectedCandidateId
              ? "Candidate Detail Review"
              : "Candidate Submissions"}
          </h2>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin_secret");
            setAdminSecret("");
          }}
          style={{
            padding: "8px 12px",
            background: "transparent",
            color: "#ff4d4f",
            border: "1px solid #ff4d4f",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Logout Key
        </button>
      </div>

      {!selectedCandidateId ? (
        <div>
          {loadingList ? (
            <p style={{ color: "#94a3b8" }}>Loading candidate list...</p>
          ) : candidates.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No candidate submissions found.</p>
          ) : (
            <div
              style={{
                border: "1px solid #334155",
                borderRadius: 10,
                overflow: "hidden",
                background: "#1e293b",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #334155",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <th style={{ padding: "12px 16px" }}>Name / Email</th>
                    <th style={{ padding: "12px 16px" }}>Candidate ID</th>
                    <th style={{ padding: "12px 16px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => {
                    // Send Mongo _id to ensure exact matching in query
                    const id = c._id || c.id;
                    return (
                      <tr
                        key={id}
                        style={{ borderBottom: "1px solid #334155" }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <strong>
                            {c.name || c.email || "Unnamed Candidate"}
                          </strong>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#94a3b8" }}>
                          {c.candidateId || id}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => setSelectedCandidateId(id)}
                            style={{
                              padding: "6px 14px",
                              background: "#f59e0b",
                              color: "#000",
                              border: "none",
                              borderRadius: 6,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontSize: 13,
                            }}
                          >
                            View Submissions
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : loadingDetail ? (
        <div style={{ color: "#94a3b8", padding: 20 }}>Loading details...</div>
      ) : (
        <>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>
            Reviewing:{" "}
            {candidateData?.name || candidateData?.email || selectedCandidateId}
          </h3>

          {/* ARCHITECTURES */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Architectural Submissions</h3>
            {rawArchitectures.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                No architectural submissions recorded.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {rawArchitectures.map((archItem, index) => {
                  const components = extractComponents(archItem);
                  return (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #334155",
                        padding: 20,
                        borderRadius: 10,
                        background: "#1e293b",
                      }}
                    >
                      <h4 style={{ color: "#f59e0b", marginTop: 0 }}>
                        Mission {archItem.missionNumber || index + 1}{" "}
                        Architecture
                      </h4>
                      {components.length > 0 ? (
                        <ul style={{ paddingLeft: 18 }}>
                          {components.map((comp, idx) => (
                            <li
                              key={idx}
                              style={{ fontSize: 13, marginBottom: 4 }}
                            >
                              {typeof comp === "string"
                                ? comp
                                : JSON.stringify(comp)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: "#94a3b8", fontSize: 13 }}>
                          No component details available.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* MCQs & ANSWERS */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>
              Candidate Answers (MCQs &amp; Case Studies)
            </h3>
            {rawMissions.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                No interactive answers recorded.
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {rawMissions.map((missionObj, index) => {
                  const missionNum =
                    missionObj.number || missionObj.missionNumber || index + 1;
                  const answersObj = missionObj.answers;

                  if (!answersObj || Object.keys(answersObj).length === 0)
                    return null;

                  return (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #334155",
                        borderRadius: 10,
                        padding: 18,
                        background: "#1e293b",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 10px",
                          fontSize: 15,
                          color: "#f59e0b",
                        }}
                      >
                        Mission {missionNum} Answers
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {Object.entries(answersObj).map(([qKey, answerVal]) => (
                          <div key={qKey} style={{ fontSize: 13 }}>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#cbd5e1",
                                textTransform: "capitalize",
                              }}
                            >
                              {qKey.replace(/_/g, " ")}:{" "}
                            </span>
                            <span>
                              {typeof answerVal === "object" &&
                              answerVal !== null
                                ? JSON.stringify(answerVal, null, 2)
                                : String(answerVal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* CLOSING / FINALIZED PAGE */}
          {isMission4Completed && (
            <section
              style={{
                marginTop: 40,
                padding: 24,
                borderRadius: 12,
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid #10b981",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <h3 style={{ color: "#10b981", margin: "0 0 8px" }}>
                Assessment Completed
              </h3>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  maxWidth: 500,
                  margin: "0 auto 16px",
                }}
              >
                Candidate has finalized Mission 4 and submitted all answers.
              </p>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: 20,
                  background: "rgba(16, 185, 129, 0.1)",
                  color: "#10b981",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                Status: Finalized
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
