"use client";

import { useEffect, useState } from "react";

interface RequestItem {
  id: number;
  quantity: number;
  status: string;
  reason: string;
  createdAt: string;
  project: { name: string };
  material: { name: string; unit: string };
  user: { name: string };
}

export default function Dashboard() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [projectId, setProjectId] = useState("1"); // Metro Project
  const [materialId, setMaterialId] = useState("1"); // Cement
  const [requestedBy, setRequestedBy] = useState("1"); // Rajesh Sharma
  const [quantity, setQuantity] = useState("100");
  const [reason, setReason] = useState("Slab casting for Level 2");

  const [lastResponse, setLastResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch past requests on load
  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLastResponse(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: Number(projectId),
          materialId: Number(materialId),
          requestedBy: Number(requestedBy),
          quantity: Number(quantity),
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create request");
      } else {
        setLastResponse(data);
        fetchRequests(); // Refresh request history
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
        color: "#111827",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "15px", marginBottom: "30px" }}>
        <h1 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "28px", fontWeight: "700" }}>
          🏗️ BuildGuard Control Center
        </h1>
        <p style={{ margin: 0, color: "#4b5563", fontSize: "15px" }}>
          Intelligent Construction Material Allocation & Transfer Optimizer
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
        {/* Left Column: Form */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1f2937", fontSize: "20px" }}>
            Create Material Request
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                Project:
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="1">Metro Station Line 1 (Local Stock: 50 Bags Cement)</option>
                <option value="2">National Highway 44 (Stock: 300 Bags Cement)</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                Material:
              </label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="1">Grade 53 Cement (Bags)</option>
                <option value="2">TMT Rebar 12mm (Tons)</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                Requested By:
              </label>
              <select
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="1">Rajesh Sharma (Site Engineer)</option>
                <option value="2">Anil Kumar (Store Manager)</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                Quantity:
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#374151" }}>
                Purpose / Reason:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#111827",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#9ca3af" : "#0284c7",
                color: "#ffffff",
                padding: "12px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "15px",
                width: "100%",
                transition: "background-color 0.15s ease",
              }}
            >
              {loading ? "Evaluating Rules..." : "Submit Material Request"}
            </button>
          </form>

          {error && (
            <div
              style={{
                marginTop: "16px",
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              🚨 <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Right Column: Intelligent Recommendation Panel */}
        <div>
          <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#1f2937", fontSize: "20px" }}>
            BuildGuard Rule Engine Result
          </h2>

          {lastResponse ? (
            <div
              style={{
                border: "1px solid #bfdbfe",
                borderRadius: "8px",
                padding: "20px",
                background: "#eff6ff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 12px 0", color: "#1e40af", fontSize: "18px" }}>
                Request #{lastResponse.request.id} Evaluation
              </h3>

              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1e293b" }}>
                <strong>Local Warehouse Stock:</strong> {lastResponse.localStockAvailable} units
              </p>
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#1e293b" }}>
                <strong>Stock Status:</strong>{" "}
                {lastResponse.isStockSufficient ? (
                  <span style={{ color: "#15803d", fontWeight: "700" }}>✅ Stock Sufficient</span>
                ) : (
                  <span style={{ color: "#b91c1c", fontWeight: "700" }}>⚠️ Insufficient Local Stock</span>
                )}
              </p>

              {/* Transfer Recommendation Box */}
              {lastResponse.transferRecommendation ? (
                <div
                  style={{
                    background: "#fefce8",
                    border: "1px solid #fef08a",
                    padding: "16px",
                    borderRadius: "6px",
                    marginTop: "16px",
                  }}
                >
                  <h4 style={{ margin: "0 0 6px 0", color: "#854d0e", fontSize: "15px" }}>
                    💡 Idle Stock Transfer Recommendation
                  </h4>
                  <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#713f12", lineHeight: "1.4" }}>
                    Instead of purchasing new materials, BuildGuard detected excess inventory at another project:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#713f12", fontSize: "14px" }}>
                    <li style={{ marginBottom: "4px" }}>
                      <strong>Source Project:</strong> {lastResponse.transferRecommendation.sourceProjectName}
                    </li>
                    <li>
                      <strong>Available Transferable Stock:</strong>{" "}
                      {lastResponse.transferRecommendation.availableQuantity} units
                    </li>
                  </ul>
                </div>
              ) : !lastResponse.isStockSufficient ? (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#991b1b",
                    padding: "12px",
                    borderRadius: "6px",
                    marginTop: "16px",
                    fontSize: "14px",
                  }}
                >
                  ❌ No inter-project transfer options available. Procurement required.
                </div>
              ) : null}
            </div>
          ) : (
            <div
              style={{
                border: "2px dashed #e5e7eb",
                padding: "40px 20px",
                textAlign: "center",
                color: "#6b7280",
                borderRadius: "8px",
                background: "#f9fafb",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              Submit a material request on the left to see BuildGuard validate local stock, budget, and cross-project
              transfer rules.
            </div>
          )}
        </div>
      </div>

      {/* Audit Log / History Table */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "16px", color: "#1f2937", fontSize: "20px" }}>Material Requests Log</h2>
        <div
          style={{
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#ffffff", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#111827", color: "#ffffff" }}>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Project</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Material</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Qty</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Requested By</th>
                <th style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
                    No material requests logged yet.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>
                      #{r.id}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#111827" }}>{r.project.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#111827" }}>{r.material.name}</td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#111827", fontWeight: "500" }}>
                      {r.quantity} {r.material.unit}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", color: "#374151" }}>{r.user.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background:
                            r.status === "APPROVED"
                              ? "#dcfce7"
                              : r.status === "PENDING_TRANSFER"
                              ? "#fef9c3"
                              : "#f3f4f6",
                          color:
                            r.status === "APPROVED"
                              ? "#15803d"
                              : r.status === "PENDING_TRANSFER"
                              ? "#a16207"
                              : "#374151",
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: "600",
                          display: "inline-block",
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}