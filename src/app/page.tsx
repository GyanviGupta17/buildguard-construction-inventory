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
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #333", pb: "15px", marginBottom: "30px" }}>
        <h1 style={{ margin: "0 0 5px 0", color: "#111" }}>🏗️ BuildGuard Control Center</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Intelligent Construction Material Allocation & Transfer Optimizer
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* Left Column: Form */}
        <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", border: "1px solid #ddd" }}>
          <h2 style={{ marginTop: 0 }}>Create Material Request</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Project:</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="1">Metro Station Line 1 (Local Stock: 50 Bags Cement)</option>
                <option value="2">National Highway 44 (Stock: 300 Bags Cement)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Material:</label>
              <select
                value={materialId}
                onChange={(e) => setMaterialId(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="1">Grade 53 Cement (Bags)</option>
                <option value="2">TMT Rebar 12mm (Tons)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Requested By:</label>
              <select
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="1">Rajesh Sharma (Site Engineer)</option>
                <option value="2">Anil Kumar (Store Manager)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Purpose / Reason:</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#0066cc",
                color: "#fff",
                padding: "10px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {loading ? "Evaluating Rules..." : "Submit Material Request"}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: "15px", background: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "4px" }}>
              🚨 <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Right Column: Intelligent Recommendation Panel */}
        <div>
          <h2 style={{ marginTop: 0 }}>BuildGuard Rule Engine Result</h2>

          {lastResponse ? (
            <div
              style={{
                border: "2px solid #0066cc",
                borderRadius: "8px",
                padding: "20px",
                background: "#f0f7ff",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#004085" }}>
                Request #{lastResponse.request.id} Evaluation
              </h3>

              <p><strong>Local Warehouse Stock:</strong> {lastResponse.localStockAvailable} units</p>
              <p>
                <strong>Stock Status:</strong>{" "}
                {lastResponse.isStockSufficient ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>✅ Stock Sufficient</span>
                ) : (
                  <span style={{ color: "red", fontWeight: "bold" }}>⚠️ Insufficient Local Stock</span>
                )}
              </p>

              {/* Transfer Recommendation Box */}
              {lastResponse.transferRecommendation ? (
                <div
                  style={{
                    background: "#fff3cd",
                    border: "1px solid #ffeba1",
                    padding: "15px",
                    borderRadius: "6px",
                    marginTop: "15px",
                  }}
                >
                  <h4 style={{ margin: "0 0 5px 0", color: "#856404" }}>
                    💡 Idle Stock Transfer Recommendation
                  </h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#856404" }}>
                    Instead of purchasing new materials, BuildGuard detected excess inventory at another project:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#856404" }}>
                    <li><strong>Source Project:</strong> {lastResponse.transferRecommendation.sourceProjectName}</li>
                    <li><strong>Available Transferable Stock:</strong> {lastResponse.transferRecommendation.availableQuantity} units</li>
                  </ul>
                </div>
              ) : !lastResponse.isStockSufficient ? (
                <div style={{ background: "#f8d7da", padding: "10px", borderRadius: "6px", marginTop: "15px" }}>
                  ❌ No inter-project transfer options available. Procurement required.
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ border: "1px dashed #ccc", padding: "40px", textAlign: "center", color: "#777", borderRadius: "8px" }}>
              Submit a material request on the left to see BuildGuard validate local stock, budget, and cross-project transfer rules.
            </div>
          )}
        </div>
      </div>

      {/* Audit Log / History Table */}
      <div style={{ marginTop: "40px" }}>
        <h2>Material Requests Log</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#222", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Project</th>
              <th style={{ padding: "10px" }}>Material</th>
              <th style={{ padding: "10px" }}>Qty</th>
              <th style={{ padding: "10px" }}>Requested By</th>
              <th style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>#{r.id}</td>
                <td style={{ padding: "10px" }}>{r.project.name}</td>
                <td style={{ padding: "10px" }}>{r.material.name}</td>
                <td style={{ padding: "10px" }}>{r.quantity} {r.material.unit}</td>
                <td style={{ padding: "10px" }}>{r.user.name}</td>
                <td style={{ padding: "10px" }}>
                  <span style={{ background: "#eee", padding: "3px 8px", borderRadius: "4px", fontSize: "12px" }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}