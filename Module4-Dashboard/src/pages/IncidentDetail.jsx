import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getIncidentById, updateIncident } from "../api";

const SEVERITY_COLORS = {
  CRITICAL: "#C0392B",
  HIGH: "#E67E22",
  MEDIUM: "#F1C40F",
  LOW: "#27AE60",
};

const HIGH_RISK_KEYWORDS = ["admin", "root", "database", "server"];

function buildReasoningTrail(incident) {
  const { attackType, failedAttempts, targetAsset, classification, severity, priorityScore, priority } = incident;
  const steps = [];

  steps.push(`Incident reported with attack type "${attackType}".`);

  if (attackType?.toLowerCase() === "brute force" && failedAttempts > 10) {
    steps.push(
      `Rule fired: failedAttempts (${failedAttempts}) > 10 AND attackType = "Brute Force" → classification set to "${classification}".`
    );
  } else {
    steps.push(`Classification determined as "${classification}" based on matching attack-type rules.`);
  }

  const isHighRisk =
    targetAsset && HIGH_RISK_KEYWORDS.some((w) => targetAsset.toLowerCase().includes(w));
  steps.push(
    `Target asset "${targetAsset || "unspecified"}" ${
      isHighRisk ? "matched a high-value keyword (admin/root/database/server)" : "did not match a high-value keyword"
    } → contributed to severity = "${severity}".`
  );

  if (priorityScore != null) {
    steps.push(
      `Heuristic score calculated: severity weight + asset criticality + attack frequency + impact = ${priorityScore}/100 → priority = "${priority}".`
    );
  }

  return steps;
}

function IncidentDetail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const loadIncident = () => {
    getIncidentById(id)
      .then((res) => {
        setIncident(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load this incident.");
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    loadIncident();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateIncident(incident.id, { ...incident, status: newStatus });
      setIncident(res.data);
    } catch (err) {
      alert("Could not update status.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={styles.page}><p style={styles.message}>Loading...</p></div>;
  if (error) return <div style={styles.page}><p style={{ ...styles.message, color: "#E74C3C" }}>{error}</p></div>;

  const reasoningSteps = buildReasoningTrail(incident);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Incident #{incident.id}</h1>
        <button style={styles.backButton} onClick={() => navigate("/incidents")}>
          Back to List
        </button>
      </div>

      <div style={styles.statusBar}>
        <span style={styles.label}>Status:</span>
        {["OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={updating || incident.status === s}
            style={{
              ...styles.statusButton,
              backgroundColor: incident.status === s ? "#2E86C1" : "transparent",
              color: incident.status === s ? "white" : "#AEB6BF",
            }}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Raw Incident Data</h3>
          <Row label="Source IP" value={incident.sourceIp} />
          <Row label="Destination IP" value={incident.destinationIp || "N/A"} />
          <Row label="Attack Type" value={incident.attackType} />
          <Row label="Failed Attempts" value={incident.failedAttempts ?? "N/A"} />
          <Row label="Target Asset" value={incident.targetAsset || "N/A"} />
          <Row
            label="Timestamp"
            value={incident.timestamp ? new Date(incident.timestamp).toLocaleString() : "N/A"}
          />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>AI Reasoning</h3>
          <Row label="Classification" value={incident.classification || "Not analyzed"} />
          <div style={styles.rowFlex}>
            <span style={styles.label}>Severity</span>
            <span style={{ ...styles.badge, backgroundColor: SEVERITY_COLORS[incident.severity] || "#566573" }}>
              {incident.severity || "N/A"}
            </span>
          </div>
          <div style={styles.rowFlex}>
            <span style={styles.label}>Priority</span>
            <span style={{ ...styles.badge, backgroundColor: SEVERITY_COLORS[incident.priority] || "#566573" }}>
              {incident.priority || "N/A"}
            </span>
          </div>
          <Row
            label="Priority Score"
            value={incident.priorityScore != null ? `${incident.priorityScore} / 100` : "N/A"}
          />

          <h4 style={styles.subTitle}>Recommended Actions</h4>
          {incident.recommendations && incident.recommendations.length > 0 ? (
            <ul style={styles.list}>
              {incident.recommendations.map((rec, idx) => (
                <li key={idx} style={styles.listItem}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p style={styles.message}>No recommendations available</p>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Reasoning Trail (Forward Chaining + Heuristic Search)</h3>
        <ol style={styles.reasoningList}>
          {reasoningSteps.map((step, idx) => (
            <li key={idx} style={styles.reasoningItem}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={styles.rowFlex}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

const styles = {
  page: { backgroundColor: "#1B2631", minHeight: "100vh", padding: "32px", fontFamily: "Segoe UI, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { color: "white", fontSize: "26px", margin: 0 },
  backButton: {
    padding: "10px 18px", borderRadius: "6px", border: "1px solid #566573",
    backgroundColor: "transparent", color: "#D5DBDB", cursor: "pointer", fontSize: "14px",
  },
  message: { color: "#AEB6BF", fontSize: "15px" },
  statusBar: {
    display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#2C3E50", padding: "14px 20px", borderRadius: "10px", marginBottom: "20px",
  },
  statusButton: {
    padding: "8px 16px", borderRadius: "6px", border: "1px solid #566573",
    cursor: "pointer", fontSize: "13px", fontWeight: "bold",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" },
  card: { backgroundColor: "#2C3E50", borderRadius: "10px", padding: "24px" },
  cardTitle: { color: "white", marginTop: 0, marginBottom: "18px" },
  subTitle: { color: "white", marginTop: "20px", marginBottom: "10px", fontSize: "15px" },
  rowFlex: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #3B4A5A" },
  label: { color: "#AEB6BF", fontSize: "14px" },
  value: { color: "white", fontSize: "14px", fontWeight: "500" },
  badge: { padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", color: "white" },
  list: { paddingLeft: "20px", margin: 0 },
  listItem: { color: "white", fontSize: "14px", marginBottom: "8px" },
  reasoningList: { color: "white", fontSize: "14px", lineHeight: "1.8", paddingLeft: "20px", margin: 0 },
  reasoningItem: { marginBottom: "6px" },
};

export default IncidentDetail;